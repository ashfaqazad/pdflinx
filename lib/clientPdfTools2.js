// Browser-side PDF helpers, batch 2 (no backend). Used by:
//   html-to-pdf, excel-to-pdf, pdf-to-powerpoint, edit-pdf
// Client-only (uses window/document).

import { openPdf, zipFiles } from "@/lib/clientPdfTools";

const hexToRgb01 = (hex = "#000000") => {
  let h = String(hex).replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const canvasToJpegBytes = async (canvas, q = 0.92) => {
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", q));
  return new Uint8Array(await blob.arrayBuffer());
};

// ── HTML → PDF ────────────────────────────────────────────────────────────
const A4_W_PT = 595.28;
const A4_H_PT = 841.89;
const HTML_CSS_W = 794; // A4 width at 96 dpi
const HTML_MAX_PAGES = 40;

export async function fetchHtmlFromUrl(url) {
  let u;
  try {
    u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
  } catch (_) {
    throw new Error("Please enter a valid URL.");
  }
  let res;
  try {
    res = await fetch(u.href, { mode: "cors" });
  } catch (_) {
    throw new Error(
      "This website doesn't allow its page to be read from the browser (CORS). Open the page, view its source (Ctrl+U) and paste it in the HTML Code option, or save the page as .html and use the File option."
    );
  }
  if (!res.ok) throw new Error(`Could not load the page (HTTP ${res.status}).`);
  const html = await res.text();
  const base = `<base href="${u.href.replace(/"/g, "&quot;")}">`;
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + base) : base + html;
}

export async function htmlToPdfBytes(html, onProgress) {
  const [{ default: html2canvas }, { PDFDocument }] = await Promise.all([
    import("html2canvas"),
    import("pdf-lib"),
  ]);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-same-origin"); // user HTML cannot run scripts
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${HTML_CSS_W}px;height:1200px;border:0;background:#fff;`;
  document.body.appendChild(iframe);

  try {
    await new Promise((resolve) => {
      iframe.onload = resolve;
      iframe.srcdoc = html;
      setTimeout(resolve, 8000);
    });
    const doc = iframe.contentDocument;
    if (!doc || !doc.documentElement || !doc.body) throw new Error("Could not read the HTML.");

    // wait for images and fonts (bounded)
    const pending = [...doc.images].filter((i) => !i.complete);
    await Promise.race([
      Promise.all(pending.map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 6000)),
    ]);
    try { await Promise.race([doc.fonts?.ready, new Promise((r) => setTimeout(r, 3000))]); } catch (_) {}

    const bg = iframe.contentWindow.getComputedStyle(doc.body).backgroundColor;
    if (!bg || bg === "rgba(0, 0, 0, 0)") doc.body.style.backgroundColor = "#fff";

    const fullH = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, 100);
    iframe.style.height = `${fullH}px`;
    const pageHpx = Math.floor((A4_H_PT / A4_W_PT) * HTML_CSS_W);
    const pageCount = Math.min(HTML_MAX_PAGES, Math.max(1, Math.ceil(fullH / pageHpx)));

    const out = await PDFDocument.create();
    for (let i = 0; i < pageCount; i++) {
      const sliceH = Math.min(pageHpx, fullH - i * pageHpx);
      const canvas = await html2canvas(doc.documentElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: HTML_CSS_W,
        height: sliceH,
        x: 0,
        y: i * pageHpx,
        windowWidth: HTML_CSS_W,
        windowHeight: fullH,
        logging: false,
      });
      const img = await out.embedJpg(await canvasToJpegBytes(canvas, 0.92));
      const page = out.addPage([A4_W_PT, A4_H_PT]);
      const drawH = (sliceH / pageHpx) * A4_H_PT;
      page.drawImage(img, { x: 0, y: A4_H_PT - drawH, width: A4_W_PT, height: drawH });
      canvas.width = canvas.height = 0;
      onProgress?.((i + 1) / pageCount);
    }
    return await out.save();
  } finally {
    iframe.remove();
  }
}

// ── EXCEL → PDF ───────────────────────────────────────────────────────────
async function excelToPdfBytes(file) {
  const [XLSX, { jsPDF }, autoTableMod] = await Promise.all([
    import("xlsx"),
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableMod.default || autoTableMod.autoTable;

  let wb;
  try {
    wb = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
  } catch (_) {
    throw new Error(`Could not read "${file.name}". Is it a valid .xlsx or .xls file?`);
  }

  const sheets = [];
  for (const name of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: false, defval: "", blankrows: false });
    let maxCol = 0;
    rows.forEach((r) => {
      for (let c = r.length - 1; c >= 0; c--) {
        if (String(r[c]).trim() !== "") { maxCol = Math.max(maxCol, c + 1); break; }
      }
    });
    if (!rows.length || !maxCol) continue;
    sheets.push({
      name,
      cols: maxCol,
      rows: rows.map((r) => Array.from({ length: maxCol }, (_, c) => String(r[c] ?? ""))),
    });
  }
  if (!sheets.length) throw new Error(`"${file.name}" has no data to convert.`);

  const orient = (cols) => (cols > 6 ? "landscape" : "portrait");
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: orient(sheets[0].cols) });
  sheets.forEach((sh, idx) => {
    if (idx > 0) doc.addPage("a4", orient(sh.cols));
    const fontSize = sh.cols <= 6 ? 9 : sh.cols <= 10 ? 8 : 6.5;
    let startY = 30;
    if (sheets.length > 1) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(sh.name, 30, 28);
      startY = 40;
    }
    const [head, ...body] = sh.rows;
    autoTable(doc, {
      head: [head],
      body,
      startY,
      margin: { left: 30, right: 30, top: 30, bottom: 30 },
      styles: { fontSize, cellPadding: 3, overflow: "linebreak", lineColor: [210, 214, 220], lineWidth: 0.4 },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
      theme: "grid",
      horizontalPageBreak: sh.cols > 12,
    });
  });
  return new Uint8Array(doc.output("arraybuffer"));
}

export async function excelFilesToPdf(files, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    outs.push({
      name: files[i].name.replace(/\.(xlsx|xls)$/i, "") + ".pdf",
      data: await excelToPdfBytes(files[i]),
    });
    onProgress?.((i + 1) / files.length);
  }
  if (outs.length === 1) {
    return { blob: new Blob([outs[0].data], { type: "application/pdf" }), filename: outs[0].name };
  }
  return { blob: await zipFiles(outs), filename: "pdflinx-excel-pdf.zip" };
}

// ── PDF → POWERPOINT (each page becomes an image slide) ───────────────────
export async function pdfToPptxBlob(file, opts = {}, onProgress) {
  const { slideSize = "widescreen", quality = "normal" } = opts;
  const [{ default: PptxGenJS }, pdf] = await Promise.all([import("pptxgenjs"), openPdf(file)]);
  const pptx = new PptxGenJS();
  const layout =
    slideSize === "standard"
      ? { name: "PDFLINX43", w: 10, h: 7.5 }
      : { name: "PDFLINX169", w: 13.333, h: 7.5 };
  pptx.defineLayout({ name: layout.name, width: layout.w, height: layout.h });
  pptx.layout = layout.name;

  const renderScale = quality === "high" ? 2.5 : 1.6;
  const jpegQ = quality === "high" ? 0.92 : 0.82;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", jpegQ);

    const ar = canvas.width / canvas.height;
    let w = layout.w;
    let h = layout.w / ar;
    if (h > layout.h) { h = layout.h; w = layout.h * ar; }
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addImage({ data: dataUrl, x: (layout.w - w) / 2, y: (layout.h - h) / 2, w, h });

    canvas.width = canvas.height = 0;
    page.cleanup();
    onProgress?.(i / pdf.numPages);
  }
  pdf.destroy();
  return await pptx.write({ outputType: "blob" });
}

// ── EDIT PDF (text / image / cover boxes) ─────────────────────────────────
// Objects use PDF points at scale 1, origin = top-left of the displayed page.
//  text:  { page, x, y, text, fontSize, color, fontFamily, fontWeight, fontStyle, textDecoration }
//  image: { page, x, y, width, height, file }
//  cover: { page, x, y, width, height, fill }
function pickStandardFont(SF, family = "", bold, italic) {
  const f = family.toLowerCase();
  if (/courier|mono/.test(f)) {
    return bold && italic ? SF.CourierBoldOblique : bold ? SF.CourierBold : italic ? SF.CourierOblique : SF.Courier;
  }
  if (/times|georgia|serif/.test(f) && !/sans/.test(f)) {
    return bold && italic ? SF.TimesRomanBoldItalic : bold ? SF.TimesRomanBold : italic ? SF.TimesRomanItalic : SF.TimesRoman;
  }
  return bold && italic ? SF.HelveticaBoldOblique : bold ? SF.HelveticaBold : italic ? SF.HelveticaOblique : SF.Helvetica;
}

async function imageFileToEmbeddable(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (file.type === "image/png") return { kind: "png", bytes };
  if (file.type === "image/jpeg" || file.type === "image/jpg") return { kind: "jpg", bytes };
  // webp and others: convert to PNG through a canvas
  const bmp = await createImageBitmap(file);
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  c.getContext("2d").drawImage(bmp, 0, 0);
  const blob = await new Promise((res) => c.toBlob(res, "image/png"));
  return { kind: "png", bytes: new Uint8Array(await blob.arrayBuffer()) };
}

export async function editPdfFile(file, objects) {
  const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

  const fontCache = new Map();
  const getFont = async (family, bold, italic) => {
    const key = pickStandardFont(StandardFonts, family, bold, italic);
    if (!fontCache.has(key)) fontCache.set(key, await doc.embedFont(key));
    return fontCache.get(key);
  };

  const byPage = new Map();
  for (const o of objects) {
    if (!byPage.has(o.page)) byPage.set(o.page, []);
    byPage.get(o.page).push(o);
  }

  let unsupportedChars = false;
  for (const [pageNum, objs] of byPage) {
    const idx = pageNum - 1;
    let page = doc.getPages()[idx];
    if (!page) continue;
    const rot = ((page.getRotation().angle % 360) + 360) % 360;
    const { width: W, height: H } = page.getSize();
    let vw = W;
    let vh = H;

    if (rot) {
      // Rebuild the page upright so edits can use the displayed coordinates.
      vw = rot === 90 || rot === 270 ? H : W;
      vh = rot === 90 || rot === 270 ? W : H;
      const embedded = await doc.embedPage(page);
      const fresh = doc.insertPage(idx, [vw, vh]);
      const t = rot === 90 ? { x: 0, y: W, r: -90 } : rot === 180 ? { x: W, y: H, r: 180 } : { x: H, y: 0, r: 90 };
      fresh.drawPage(embedded, { x: t.x, y: t.y, rotate: degrees(t.r) });
      doc.removePage(idx + 1);
      page = fresh;
    }

    for (const o of objs) {
      if (o.type === "cover") {
        const [r, g, b] = hexToRgb01(o.fill || "#ffffff");
        const h = o.height || 32;
        page.drawRectangle({ x: o.x, y: vh - o.y - h, width: o.width || 220, height: h, color: rgb(r, g, b) });
      } else if (o.type === "image" && o.file) {
        const emb = await imageFileToEmbeddable(o.file);
        const img = emb.kind === "png" ? await doc.embedPng(emb.bytes) : await doc.embedJpg(emb.bytes);
        const bw = o.width || 150;
        const bh = o.height || 150;
        const ar = img.width / img.height;
        let w = bw;
        let h = bw / ar;
        if (h > bh) { h = bh; w = bh * ar; }
        page.drawImage(img, { x: o.x + (bw - w) / 2, y: vh - o.y - bh + (bh - h) / 2, width: w, height: h });
      } else if (o.type === "text") {
        const size = o.fontSize || 16;
        const bold = o.fontWeight === "bold" || Number(o.fontWeight) >= 600;
        const italic = o.fontStyle === "italic";
        const font = await getFont(o.fontFamily, bold, italic);
        const [r, g, b] = hexToRgb01(o.color || "#111827");
        const lines = String(o.text ?? "").split("\n");
        lines.forEach((raw, li) => {
          // Standard fonts only cover WinAnsi; replace anything else so saving never fails.
          let line = "";
          for (const ch of raw) {
            try { font.widthOfTextAtSize(ch, size); line += ch; } catch (_) { line += "?"; unsupportedChars = true; }
          }
          const tx = o.x + 6; // preview has 6px side padding
          const baseline = vh - (o.y + 2 + size * 0.92 + li * size * 1.2); // 2px top padding
          page.drawText(line, { x: tx, y: baseline, size, font, color: rgb(r, g, b) });
          if (o.textDecoration === "underline" && line) {
            const w = font.widthOfTextAtSize(line, size);
            page.drawLine({
              start: { x: tx, y: baseline - size * 0.12 },
              end: { x: tx + w, y: baseline - size * 0.12 },
              thickness: Math.max(0.5, size / 16),
              color: rgb(r, g, b),
            });
          }
        });
      }
    }
  }
  return { bytes: await doc.save(), unsupportedChars };
}
