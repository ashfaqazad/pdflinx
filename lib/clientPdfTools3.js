// Browser-side document conversions (no backend). Used by:
//   pdf-to-word, word-to-pdf, pdf-to-excel
// Client-only. Output quality is "basic": text/paragraph level, not pixel-perfect layout.

import { openPdf, zipFiles, ocrPdfFiles } from "@/lib/clientPdfTools";
import { htmlToPdfBytes } from "@/lib/clientPdfTools2";

const stripExt = (n) => n.replace(/\.[^.]+$/, "");

// ── Shared: PDF page → positioned text lines ──────────────────────────────
// Returns [{ y, x0, x1, size, text, items:[{x,w,str}] }] sorted top → bottom.
async function pageLines(page) {
  const content = await page.getTextContent();
  const raw = [];
  for (const it of content.items) {
    if (typeof it.str !== "string" || !it.str.trim()) continue;
    const size = Math.hypot(it.transform[2], it.transform[3]) || it.height || 10;
    raw.push({ x: it.transform[4], y: it.transform[5], w: it.width || 0, size, str: it.str });
  }
  // top → bottom (PDF y grows upward), then left → right
  raw.sort((a, b) => b.y - a.y || a.x - b.x);

  const lines = [];
  for (const it of raw) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - it.y) <= Math.max(2, last.size * 0.45)) {
      last.items.push(it);
      last.size = Math.max(last.size, it.size);
    } else {
      lines.push({ y: it.y, size: it.size, items: [it] });
    }
  }
  for (const ln of lines) {
    ln.items.sort((a, b) => a.x - b.x);
    let text = "";
    let prevEnd = null;
    for (const it of ln.items) {
      if (prevEnd !== null) {
        const gap = it.x - prevEnd;
        if (gap > ln.size * 0.18 && !text.endsWith(" ") && !it.str.startsWith(" ")) text += " ";
      }
      text += it.str;
      prevEnd = it.x + it.w;
    }
    ln.text = text.replace(/\s+$/, "");
    // segments separated by wide gaps (table-like rows)
    const segs = [];
    let curSeg = null;
    for (const it of ln.items) {
      if (curSeg && it.x - curSeg.end <= ln.size * 1.6) {
        const sp = it.x - curSeg.end > ln.size * 0.18 && !curSeg.text.endsWith(" ") && !it.str.startsWith(" ");
        curSeg.text += (sp ? " " : "") + it.str;
        curSeg.end = it.x + it.w;
      } else {
        curSeg = { x: it.x, end: it.x + it.w, text: it.str };
        segs.push(curSeg);
      }
    }
    ln.segs = segs.map((g) => ({ x: g.x, text: g.text.trim() })).filter((g) => g.text);
    ln.isTabular = ln.segs.length > 1;
    ln.x0 = ln.items[0].x;
    ln.x1 = ln.items[ln.items.length - 1].x + ln.items[ln.items.length - 1].w;
  }
  return lines.filter((l) => l.text.trim());
}

const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// ═════════════════════════════════════════════════════════════════════════
// PDF → WORD (.docx)
// ═════════════════════════════════════════════════════════════════════════
async function pdfToDocxBytes(file, onProgress) {
  const docx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, Tab, TabStopType } = docx;
  const pdf = await openPdf(file);

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    pages.push({ w: vp.width, h: vp.height, lines: await pageLines(page) });
    page.cleanup();
    onProgress?.(i / pdf.numPages / 2);
  }
  pdf.destroy();

  const allLines = pages.flatMap((p) => p.lines);
  if (!allLines.length) {
    const e = new Error("NO_TEXT");
    e.code = "NO_TEXT";
    throw e;
  }
  const bodySize = median(allLines.map((l) => l.size));

  const children = [];
  pages.forEach((pg, pi) => {
    if (!pg.lines.length) {
      children.push(new Paragraph({ children: [], pageBreakBefore: pi > 0 }));
      return;
    }
    const minX = Math.min(...pg.lines.map((l) => l.x0));
    const maxW = Math.max(...pg.lines.map((l) => l.x1 - l.x0));

    // group lines into paragraphs
    const paras = [];
    let cur = null;
    pg.lines.forEach((ln, idx) => {
      const prev = pg.lines[idx - 1];
      const isHeading = ln.size > bodySize * 1.25;
      let startNew = !cur || !prev;
      if (!startNew) {
        const gap = prev.y - ln.y;
        const prevWidth = prev.x1 - prev.x0;
        const sizeChanged = Math.abs(ln.size - prev.size) > bodySize * 0.2;
        const prevFull = prevWidth >= maxW * 0.82; // previous line wrapped at the margin → same paragraph
        const indentJump = ln.x0 - prev.x0 > bodySize * 1.2 && Math.abs(ln.x0 - minX) > bodySize;
        startNew = gap > ln.size * 1.7 || sizeChanged || !prevFull || indentJump || isHeading || ln.isTabular || prev.isTabular;
      }
      if (startNew) {
        cur = { lines: [ln], size: ln.size, x0: ln.x0, heading: isHeading, firstOfPage: pi > 0 && !paras.length };
        paras.push(cur);
      } else {
        cur.lines.push(ln);
      }
    });

    paras.forEach((p) => {
      const indentPt = Math.max(0, p.x0 - minX);
      const sizeHalfPt = Math.max(16, Math.min(72, Math.round(p.size * 2)));
      const ln0 = p.lines[0];
      if (p.lines.length === 1 && ln0.isTabular) {
        // table-like row: keep columns with tab stops
        const children2 = [];
        ln0.segs.forEach((g, gi) => {
          if (gi > 0) children2.push(new TextRun({ children: [new Tab()], size: sizeHalfPt }));
          children2.push(new TextRun({ text: g.text, size: sizeHalfPt }));
        });
        children.push(
          new Paragraph({
            pageBreakBefore: p.firstOfPage,
            spacing: { after: 60 },
            tabStops: ln0.segs.slice(1).map((g) => ({ type: TabStopType.LEFT, position: Math.round((g.x - minX) * 20) })),
            children: children2,
          })
        );
        return;
      }
      const text = p.lines.map((l) => l.text).join(" ").replace(/\s{2,}/g, " ");
      children.push(
        new Paragraph({
          pageBreakBefore: p.firstOfPage,
          spacing: { after: p.heading ? 160 : 120 },
          indent: indentPt > 10 ? { left: Math.round(indentPt * 20) } : undefined,
          children: [new TextRun({ text, bold: p.heading, size: sizeHalfPt })],
        })
      );
    });
    onProgress?.(0.5 + (pi + 1) / pages.length / 2);
  });

  const first = pages[0];
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: Math.round(first.w * 20), height: Math.round(first.h * 20) },
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
          },
        },
        children,
      },
    ],
  });
  return await Packer.toBlob(doc);
}

const NO_TEXT_MSG =
  "No selectable text found — this looks like a scanned PDF. Turn on the OCR option (or use the OCR PDF tool first) and try again.";

export async function pdfFilesToWord(files, { ocr = false, ocrLanguage = "eng" } = {}, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    let src = files[i];
    if (ocr) {
      const r = await ocrPdfFiles([src], ocrLanguage);
      src = new File([r.blob], src.name, { type: "application/pdf" });
    }
    let blob;
    try {
      blob = await pdfToDocxBytes(src, (p) => onProgress?.((i + p) / files.length));
    } catch (e) {
      if (e?.code === "NO_TEXT") throw new Error(NO_TEXT_MSG);
      throw e;
    }
    outs.push({ name: `${stripExt(files[i].name)}.docx`, data: blob });
  }
  if (outs.length === 1) return { blob: outs[0].data, filename: outs[0].name };
  return { blob: await zipFiles(outs), filename: "pdflinx-pdf-to-word.zip" };
}

// ═════════════════════════════════════════════════════════════════════════
// WORD (.docx) → PDF   (mammoth → HTML → paged PDF)
// ═════════════════════════════════════════════════════════════════════════
const WORD_CSS = `
  body{font-family:Calibri,Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.35;color:#111;margin:0;padding:64px 72px;background:#fff}
  h1{font-size:22pt;margin:0 0 10px}h2{font-size:17pt;margin:14px 0 8px}h3{font-size:14pt;margin:12px 0 6px}
  h4,h5,h6{font-size:12pt;margin:10px 0 4px}
  p{margin:0 0 8px}ul,ol{margin:0 0 8px;padding-left:28px}
  table{border-collapse:collapse;margin:8px 0;max-width:100%}td,th{border:1px solid #999;padding:4px 7px;vertical-align:top}
  img{max-width:100%;height:auto}a{color:#0563c1}
`;

async function docxToPdfBytes(file) {
  if (/\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name)) {
    throw new Error(`"${file.name}" is an old .doc file. Please open it in Word and save it as .docx, then try again.`);
  }
  const mammoth = await import("mammoth/mammoth.browser");
  let result;
  try {
    result = await (mammoth.default || mammoth).convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  } catch (_) {
    throw new Error(`Could not read "${file.name}". Is it a valid .docx file?`);
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${WORD_CSS}</style></head><body>${result.value}</body></html>`;
  return await htmlToPdfBytes(html);
}

export async function wordFilesToPdf(files, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    outs.push({ name: `${stripExt(files[i].name)}.pdf`, data: await docxToPdfBytes(files[i]) });
    onProgress?.((i + 1) / files.length);
  }
  if (outs.length === 1) {
    return { blob: new Blob([outs[0].data], { type: "application/pdf" }), filename: outs[0].name };
  }
  return { blob: await zipFiles(outs), filename: "pdflinx-word-to-pdf.zip" };
}

// ═════════════════════════════════════════════════════════════════════════
// PDF → EXCEL (.xlsx)   one sheet per page; columns guessed from text positions
// ═════════════════════════════════════════════════════════════════════════
function pageToRows(lines) {
  if (!lines.length) return [];
  // 1) split each line into cells wherever there's a wide horizontal gap
  const rows = lines.map((ln) => {
    const cells = [];
    let cur = null;
    for (const it of ln.items) {
      const gapLimit = Math.max(6, ln.size * 0.9);
      if (cur && it.x - cur.end <= gapLimit) {
        const needSpace = it.x - cur.end > ln.size * 0.18 && !cur.text.endsWith(" ") && !it.str.startsWith(" ");
        cur.text += (needSpace ? " " : "") + it.str;
        cur.end = it.x + it.w;
      } else {
        cur = { x: it.x, end: it.x + it.w, text: it.str };
        cells.push(cur);
      }
    }
    return cells.map((c) => ({ x: c.x, text: c.text.trim() })).filter((c) => c.text);
  });

  // 2) column anchors: cluster the start-x of multi-cell rows
  const multi = rows.filter((r) => r.length > 1);
  const xs = (multi.length ? multi : rows).flatMap((r) => r.map((c) => c.x)).sort((a, b) => a - b);
  const tol = 8;
  const anchors = [];
  for (const x of xs) {
    const last = anchors[anchors.length - 1];
    if (last && x - last.max <= tol) { last.max = x; last.sum += x; last.n += 1; }
    else anchors.push({ min: x, max: x, sum: x, n: 1 });
  }
  // keep anchors that appear in at least 2 rows (or all if tiny)
  const cols = anchors.filter((a) => a.n >= 2 || anchors.length <= 3).map((a) => a.sum / a.n);
  if (!cols.length) cols.push(xs[0] ?? 0);

  // 3) assign each cell to the right-most anchor at or left of it
  return rows.map((cells) => {
    const out = new Array(cols.length).fill("");
    for (const c of cells) {
      let idx = 0;
      for (let k = 0; k < cols.length; k++) if (c.x >= cols[k] - tol) idx = k;
      out[idx] = out[idx] ? out[idx] + " " + c.text : c.text;
    }
    return out;
  });
}

const asNumberIfNumeric = (s) => {
  const t = String(s).trim();
  if (/^-?\(?\$?\s?\d{1,3}(,\d{3})*(\.\d+)?\)?%?$/.test(t) || /^-?\d+(\.\d+)?$/.test(t)) {
    const neg = /^\(.*\)$/.test(t) || t.startsWith("-");
    const n = parseFloat(t.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(n) && !t.endsWith("%") && !/^0\d/.test(t.replace(/[,$\s()-]/g, ""))) return neg ? -n : n;
  }
  return s;
};

async function pdfToXlsxArray(file, onProgress) {
  const XLSX = await import("xlsx");
  const pdf = await openPdf(file);
  const wb = XLSX.utils.book_new();
  let anyData = false;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const rows = pageToRows(await pageLines(page));
    page.cleanup();
    if (rows.length) {
      anyData = true;
      const aoa = rows.map((r) => r.map(asNumberIfNumeric));
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const widths = aoa[0].map((_, c) => ({ wch: Math.min(60, Math.max(8, ...aoa.map((r) => String(r[c] ?? "").length + 2))) }));
      ws["!cols"] = widths;
      XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
    }
    onProgress?.(i / pdf.numPages);
  }
  pdf.destroy();
  if (!anyData) {
    const e = new Error("NO_TEXT");
    e.code = "NO_TEXT";
    throw e;
  }
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

export async function pdfFilesToExcel(files, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    let data;
    try {
      data = await pdfToXlsxArray(files[i], (p) => onProgress?.((i + p) / files.length));
    } catch (e) {
      if (e?.code === "NO_TEXT") {
        throw new Error("No selectable text found — this looks like a scanned PDF. Please use the OCR PDF tool first.");
      }
      throw e;
    }
    outs.push({ name: `${stripExt(files[i].name)}.xlsx`, data });
  }
  if (outs.length === 1) {
    return {
      blob: new Blob([outs[0].data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      filename: outs[0].name,
    };
  }
  return { blob: await zipFiles(outs), filename: "pdflinx-pdf-to-excel.zip" };
}
