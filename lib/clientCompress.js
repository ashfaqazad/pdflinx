// Browser-side PDF compression that KEEPS text and vector graphics intact.
//
// Old approach rasterised every page into a JPEG: text became blurry/unselectable and for
// text PDFs the result was often bigger than the original. This one instead:
//   1. finds the embedded images and re-encodes only those (downscaled + JPEG),
//   2. rewrites the PDF structure with object streams (pdf-lib),
//   3. optionally runs a lossless qpdf pass (recompress streams),
//   4. returns the smallest valid result (never bigger than the original).

import { PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFArray, PDFBool } from "pdf-lib";

export const LEVEL_SETTINGS = {
  "high-quality": { maxEdge: 2600, quality: 0.85 },
  recommended: { maxEdge: 1800, quality: 0.7 },
  max: { maxEdge: 1200, quality: 0.5 },
};

const N = (name) => PDFName.of(name);
const tick = () => new Promise((r) => setTimeout(r, 0));

async function inflate(u8) {
  const ds = new DecompressionStream("deflate");
  const stream = new Blob([u8]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// undo PNG row filters (PDF Predictor >= 10), 8 bits per component
function pngUnfilter(data, colors, columns, height) {
  const rowBytes = columns * colors;
  const stride = rowBytes + 1;
  if (data.length < stride * height) throw new Error("short data");
  const out = new Uint8Array(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const ft = data[y * stride];
    const src = y * stride + 1;
    const dst = y * rowBytes;
    for (let x = 0; x < rowBytes; x++) {
      const raw = data[src + x];
      const a = x >= colors ? out[dst + x - colors] : 0;
      const b = y > 0 ? out[dst - rowBytes + x] : 0;
      const c = x >= colors && y > 0 ? out[dst - rowBytes + x - colors] : 0;
      let v;
      switch (ft) {
        case 0: v = raw; break;
        case 1: v = raw + a; break;
        case 2: v = raw + b; break;
        case 3: v = raw + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v = raw + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error("bad png filter");
      }
      out[dst + x] = v & 255;
    }
  }
  return out;
}

function nameOf(obj) {
  return obj instanceof PDFName ? obj.decodeText() : null;
}

// how many colour components does this image use? (1 = gray, 3 = RGB, other = unsupported)
function componentsOf(dict) {
  const cs = dict.lookup(N("ColorSpace"));
  const n = nameOf(cs);
  if (n === "DeviceRGB") return 3;
  if (n === "DeviceGray") return 1;
  if (cs instanceof PDFArray && nameOf(cs.lookup(0)) === "ICCBased") {
    const prof = cs.lookup(1);
    const nn = prof?.dict?.lookup(N("N"));
    if (nn instanceof PDFNumber) {
      const v = nn.asNumber();
      if (v === 1 || v === 3) return v;
    }
  }
  return 0;
}

const num = (dict, key) => {
  const v = dict.lookup(N(key));
  return v instanceof PDFNumber ? v.asNumber() : null;
};

async function toJpeg(source, w, h, maxEdge, quality) {
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const w2 = Math.max(1, Math.round(w * scale));
  const h2 = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w2;
  canvas.height = h2;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w2, h2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w2, h2);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob) throw new Error("jpeg encode failed");
  canvas.width = canvas.height = 0;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), w: w2, h: h2 };
}

async function recompressImage(stream, { maxEdge, quality }) {
  const dict = stream.dict;
  if (nameOf(dict.lookup(N("Subtype"))) !== "Image") return null;
  const imageMask = dict.lookup(N("ImageMask"));
  if (imageMask instanceof PDFBool && imageMask.asBoolean()) return null; // stencil masks stay as they are
  if (dict.has(N("Mask")) || dict.has(N("Decode"))) return null;
  const w = num(dict, "Width");
  const h = num(dict, "Height");
  const bpc = num(dict, "BitsPerComponent");
  if (!w || !h || w * h < 4096) return null;
  if (bpc !== 8) return null;

  const original = stream.getContents();
  if (original.length < 12000) return null; // already tiny

  const f = dict.lookup(N("Filter"));
  let filter = nameOf(f);
  if (!filter && f instanceof PDFArray && f.size() === 1) filter = nameOf(f.lookup(0));
  const comps = componentsOf(dict);

  let result;
  if (filter === "DCTDecode") {
    // plain JPEG data: let the browser decode it (CMYK / unknown colour spaces are skipped)
    if (!comps) return null;
    const bmp = await createImageBitmap(new Blob([original], { type: "image/jpeg" }), { imageOrientation: "none" });
    try {
      result = await toJpeg(bmp, bmp.width, bmp.height, maxEdge, quality);
    } finally {
      bmp.close?.();
    }
  } else if (filter === "FlateDecode") {
    if (!comps) return null;
    let raw = await inflate(original);
    const parms = dict.lookup(N("DecodeParms"));
    if (parms instanceof PDFArray) return null;
    const predictor = parms?.lookup ? parms.lookup(N("Predictor")) : null;
    const p = predictor instanceof PDFNumber ? predictor.asNumber() : 1;
    if (p >= 10) raw = pngUnfilter(raw, comps, w, h);
    else if (p !== 1) return null;
    if (raw.length < w * h * comps) return null;

    const rgba = new Uint8ClampedArray(w * h * 4);
    if (comps === 3) {
      for (let i = 0, j = 0, k = 0; i < w * h; i++, j += 3, k += 4) {
        rgba[k] = raw[j]; rgba[k + 1] = raw[j + 1]; rgba[k + 2] = raw[j + 2]; rgba[k + 3] = 255;
      }
    } else {
      for (let i = 0, k = 0; i < w * h; i++, k += 4) {
        rgba[k] = rgba[k + 1] = rgba[k + 2] = raw[i]; rgba[k + 3] = 255;
      }
    }
    const src = document.createElement("canvas");
    src.width = w;
    src.height = h;
    src.getContext("2d").putImageData(new ImageData(rgba, w, h), 0, 0);
    result = await toJpeg(src, w, h, maxEdge, quality);
    src.width = src.height = 0;
  } else {
    return null; // JBIG2 / CCITT / JPX … left untouched
  }

  if (result.bytes.length >= original.length * 0.92) return null; // not worth it
  return result;
}

async function qpdfLossless(bytes) {
  const { default: createModule } = await import("@neslinesli93/qpdf-wasm");
  const qpdf = await createModule({ locateFile: () => "/qpdf.wasm", print: () => {}, printErr: () => {} });
  qpdf.FS.writeFile("/in.pdf", bytes);
  try {
    qpdf.callMain(["--object-streams=generate", "--recompress-flate", "--compression-level=9", "--stream-data=compress", "/in.pdf", "/out.pdf"]);
  } catch (_) {}
  let out = null;
  try { out = qpdf.FS.readFile("/out.pdf"); } catch (_) {}
  try { qpdf.FS.unlink("/in.pdf"); } catch (_) {}
  try { qpdf.FS.unlink("/out.pdf"); } catch (_) {}
  return out;
}

/** Compress a PDF file. Returns a Blob (the original file if nothing could be saved). */
export async function compressPdf(file, level = "recommended", onProgress) {
  const settings = LEVEL_SETTINGS[level] || LEVEL_SETTINGS.recommended;
  const original = new Uint8Array(await file.arrayBuffer());

  let doc;
  try {
    doc = await PDFDocument.load(original, { updateMetadata: false });
  } catch (err) {
    if (/encrypt/i.test(String(err?.message)) || err?.name === "EncryptedPDFError") {
      const e = new Error("This PDF is password protected. Please unlock it first.");
      e.name = "PasswordException";
      throw e;
    }
    throw new Error("This PDF could not be read. Try the Repair PDF tool first.");
  }

  const entries = doc.context.enumerateIndirectObjects().filter(([, o]) => o instanceof PDFRawStream);
  let done = 0;
  for (const [ref, obj] of entries) {
    try {
      const r = await recompressImage(obj, settings);
      if (r) {
        const d = obj.dict;
        d.set(N("Filter"), N("DCTDecode"));
        d.set(N("ColorSpace"), N("DeviceRGB"));
        d.set(N("BitsPerComponent"), PDFNumber.of(8));
        d.set(N("Width"), PDFNumber.of(r.w));
        d.set(N("Height"), PDFNumber.of(r.h));
        d.delete(N("DecodeParms"));
        doc.context.assign(ref, PDFRawStream.of(d, r.bytes));
      }
    } catch (e) {
      console.warn("image skipped", e);
    }
    done++;
    if (onProgress && done % 3 === 0) {
      onProgress(done / entries.length);
      await tick();
    }
  }

  let best = new Uint8Array(await doc.save({ useObjectStreams: true }));

  try {
    const lossless = await qpdfLossless(best);
    if (lossless && lossless.length > 0 && lossless.length < best.length) best = lossless;
  } catch (e) {
    console.warn("qpdf pass skipped", e);
  }

  if (best.length >= original.length) return file; // nothing gained — keep the original untouched
  return new Blob([best], { type: "application/pdf" });
}
