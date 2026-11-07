// Browser-side PDF helpers (no backend). Used by:
//   pdf-to-text, repair-pdf, redact-pdf, ocr-pdf
// Everything here must only be called from client components (uses window/document).

const PDFJS_VERSION = "3.11.174";
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

// ── pdf.js loader (shares window.pdfjsLib with the other tools) ───────────
let pdfjsPromise = null;
export function loadPdfJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
    return Promise.resolve(window.pdfjsLib);
  }
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = new Promise((resolve, reject) => {
    const done = () => {
      if (!window.pdfjsLib) return reject(new Error("PDF engine failed to load. Please refresh and try again."));
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
      resolve(window.pdfjsLib);
    };
    const existing = document.querySelector(`script[src="${PDFJS_BASE}/pdf.min.js"]`);
    if (existing) {
      // another component injected it; poll until ready
      let tries = 0;
      const t = setInterval(() => {
        if (window.pdfjsLib || tries++ > 100) { clearInterval(t); done(); }
      }, 100);
      return;
    }
    const s = document.createElement("script");
    s.src = `${PDFJS_BASE}/pdf.min.js`;
    s.async = true;
    s.onload = done;
    s.onerror = () => reject(new Error("PDF engine failed to load. Check your internet connection."));
    document.head.appendChild(s);
  }).catch((e) => { pdfjsPromise = null; throw e; });
  return pdfjsPromise;
}

export async function openPdf(file, password) {
  const pdfjsLib = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await pdfjsLib.getDocument({ data, password }).promise;
  } catch (e) {
    if (e?.name === "PasswordException") {
      throw new Error("This PDF is password-protected. Please unlock it first with the Unlock PDF tool.");
    }
    throw e;
  }
}

export async function zipFiles(entries) {
  // entries: [{ name, data }]
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const used = new Set();
  for (const { name, data } of entries) {
    let n = name;
    let i = 1;
    while (used.has(n)) n = name.replace(/(\.[^.]+)?$/, `-${i++}$1`);
    used.add(n);
    zip.file(n, data);
  }
  return zip.generateAsync({ type: "blob" });
}

const stripPdfExt = (n) => n.replace(/\.pdf$/i, "");

// ── 1. PDF → TEXT ─────────────────────────────────────────────────────────
async function extractTextFromFile(file, onProgress) {
  const pdf = await openPdf(file);
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = "";
    let lastY = null;
    for (const item of content.items) {
      if (typeof item.str !== "string") continue;
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !text.endsWith("\n")) text += "\n";
      text += item.str;
      if (item.hasEOL && !text.endsWith("\n")) text += "\n";
      if (y !== null) lastY = y;
    }
    pages.push(text.trim());
    page.cleanup();
    onProgress?.(i / pdf.numPages);
  }
  pdf.destroy();
  return pages.join("\n\n").trim();
}

/** Returns { blob, filename, type } — single .txt or a .zip for several files. */
export async function pdfFilesToText(files, onProgress) {
  const results = [];
  let anyText = false;
  for (let i = 0; i < files.length; i++) {
    const text = await extractTextFromFile(files[i], (p) => onProgress?.((i + p) / files.length));
    if (text) anyText = true;
    results.push({ name: `${stripPdfExt(files[i].name)}.txt`, text });
  }
  if (!anyText) {
    throw new Error(
      files.length === 1
        ? "No selectable text found. This looks like a scanned PDF — please use the OCR PDF tool first."
        : "No selectable text found in these PDFs. They look scanned — please use the OCR PDF tool first."
    );
  }
  if (results.length === 1) {
    return {
      blob: new Blob([results[0].text], { type: "text/plain;charset=utf-8" }),
      filename: results[0].name,
    };
  }
  const blob = await zipFiles(results.map((r) => ({ name: r.name, data: r.text })));
  return { blob, filename: "pdf_to_text_batch.zip" };
}

// ── 2. REPAIR PDF ─────────────────────────────────────────────────────────
async function repairWithQpdf(bytes) {
  const { default: createModule } = await import("@neslinesli93/qpdf-wasm");
  let errText = "";
  const qpdf = await createModule({
    locateFile: () => "/qpdf.wasm",
    print: () => {},
    printErr: (t) => { errText += t + " | "; },
  });
  qpdf.FS.writeFile("/in.pdf", bytes);
  try {
    // qpdf reconstructs a broken xref table automatically; exit code 3 = warnings, output is still written
    qpdf.callMain(["--object-streams=generate", "/in.pdf", "/out.pdf"]);
  } catch (e) { /* decide by output below */ errText += String(e?.message || e); }
  let out = null;
  try { out = qpdf.FS.readFile("/out.pdf"); } catch (_) {}
  if (!out) console.warn("qpdf repair output missing:", errText.slice(0, 500));
  try { qpdf.FS.unlink("/in.pdf"); } catch (_) {}
  try { qpdf.FS.unlink("/out.pdf"); } catch (_) {}
  return out && out.length ? out : null;
}

async function repairWithPdfLib(bytes) {
  const { PDFDocument } = await import("pdf-lib");
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false });
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, src.getPageIndices());
  pages.forEach((p) => out.addPage(p));
  return await out.save();
}

// Last resort: pdf.js can often read files whose structure is too damaged for qpdf/pdf-lib.
// It rebuilds each page as an image, so text is no longer selectable in the result.
async function repairWithPdfJs(file) {
  const [{ PDFDocument }, pdf] = await Promise.all([import("pdf-lib"), openPdf(file)]);
  const out = await PDFDocument.create();
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
    const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const p = out.addPage([base.width, base.height]);
    p.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
    canvas.width = canvas.height = 0;
    page.cleanup();
  }
  pdf.destroy();
  return await out.save();
}

async function repairOne(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let out = null;
  try { out = await repairWithQpdf(bytes); } catch (e) { console.warn("qpdf repair failed", e); }
  if (!out) {
    try { out = await repairWithPdfLib(bytes); } catch (e) { console.warn("pdf-lib repair failed", e); }
  }
  if (!out) {
    try { out = await repairWithPdfJs(file); } catch (e) { console.warn("pdf.js repair failed", e); }
  }
  if (!out) throw new Error(`Could not repair "${file.name}". The file may be too badly damaged.`);
  return out;
}

export async function repairPdfFiles(files, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    outs.push({ name: `${stripPdfExt(files[i].name)}-repaired.pdf`, data: await repairOne(files[i]) });
    onProgress?.((i + 1) / files.length);
  }
  if (outs.length === 1) {
    return { blob: new Blob([outs[0].data], { type: "application/pdf" }), filename: "repaired-pdf.pdf" };
  }
  return { blob: await zipFiles(outs), filename: "repaired-pdfs.zip" };
}

// ── 3. REDACT PDF ─────────────────────────────────────────────────────────
// rects: [{ pageNum, x, y, w, h }] in canvas pixels at `scale` (top-left origin).
const REDACT_RENDER_SCALE = 2;

export async function redactPdfFile(file, rects, scale = 1, onProgress) {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await openPdf(file);
  const bytes = new Uint8Array(await file.arrayBuffer());

  let srcDoc = null;
  try { srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true }); } catch (_) {}

  const out = await PDFDocument.create();
  const byPage = new Map();
  for (const r of rects) {
    if (!byPage.has(r.pageNum)) byPage.set(r.pageNum, []);
    byPage.get(r.pageNum).push(r);
  }

  for (let i = 1; i <= pdf.numPages; i++) {
    const pageRects = byPage.get(i);
    if (!pageRects && srcDoc) {
      // untouched page: keep original (text stays selectable)
      const [copied] = await out.copyPages(srcDoc, [i - 1]);
      out.addPage(copied);
    } else {
      // redacted page: flatten to an image so the hidden text is truly gone
      const page = await pdf.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: REDACT_RENDER_SCALE });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      ctx.fillStyle = "#000";
      const k = REDACT_RENDER_SCALE / (scale || 1); // canvas px at `scale` → render px
      for (const r of pageRects || []) {
        ctx.fillRect(r.x * k, r.y * k, r.w * k, r.h * k);
      }
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
      const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
      const p = out.addPage([base.width, base.height]);
      p.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
      canvas.width = canvas.height = 0;
      page.cleanup();
    }
    onProgress?.(i / pdf.numPages);
  }
  pdf.destroy();

  // strip metadata that may leak the original content
  out.setTitle(""); out.setAuthor(""); out.setSubject(""); out.setKeywords([]);
  out.setProducer("PDFLinx"); out.setCreator("PDFLinx");
  return await out.save();
}

/** Find text on all pages; returns rects in canvas pixels at `scale`. */
export async function findTextRects(file, query, scale = 1) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await openPdf(file);
  const needle = query.toLowerCase();
  const found = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const content = await page.getTextContent();
    for (const item of content.items) {
      const str = item.str || "";
      if (!str) continue;
      const hay = str.toLowerCase();
      let idx = hay.indexOf(needle);
      while (idx !== -1) {
        const t = pdfjsLib.Util.transform(viewport.transform, item.transform);
        const fontH = Math.hypot(t[2], t[3]) || item.height * scale;
        const totalW = item.width * scale;
        const x = t[4] + (idx / str.length) * totalW;
        const w = (needle.length / str.length) * totalW;
        found.push({
          pageNum: i,
          x: Math.max(0, x - 1),
          y: Math.max(0, t[5] - fontH * 0.95),
          w: w + 2,
          h: fontH * 1.2,
        });
        idx = hay.indexOf(needle, idx + needle.length);
      }
    }
    page.cleanup();
  }
  pdf.destroy();
  return found;
}

// ── 4. OCR PDF ────────────────────────────────────────────────────────────
const OCR_RENDER_SCALE = 2;

export async function ocrPdfFiles(files, language = "eng", onProgress) {
  const [{ createWorker }, { PDFDocument }] = await Promise.all([
    import("tesseract.js"),
    import("pdf-lib"),
  ]);

  const total = files.length;
  let fileIndex = 0;
  let pageFrac = 0;
  const report = () => onProgress?.(Math.min(0.99, (fileIndex + pageFrac) / total));

  const worker = await createWorker(language, 1, {
    logger: () => {},
  });

  const outs = [];
  try {
    for (fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      const pdf = await openPdf(file);
      const merged = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: OCR_RENDER_SCALE });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;

        const { data } = await worker.recognize(canvas, {}, { pdf: true });
        const pagePdf = await PDFDocument.load(new Uint8Array(data.pdf));
        const [copied] = await merged.copyPages(pagePdf, [0]);
        // Tesseract sizes the page in image pixels; bring it back to the original page size
        const { width } = copied.getSize();
        if (width > 0) {
          const f = base.width / width;
          if (Math.abs(f - 1) > 0.001) copied.scale(f, f);
        }
        merged.addPage(copied);

        canvas.width = canvas.height = 0;
        page.cleanup();
        pageFrac = i / pdf.numPages;
        report();
      }
      pdf.destroy();
      pageFrac = 0;
      outs.push({ name: `${stripPdfExt(file.name)}-searchable.pdf`, data: await merged.save() });
    }
  } finally {
    await worker.terminate().catch(() => {});
  }

  if (outs.length === 1) {
    return { blob: new Blob([outs[0].data], { type: "application/pdf" }), filename: outs[0].name };
  }
  return { blob: await zipFiles(outs), filename: "pdflinx-ocr-pdfs.zip" };
}
