// Browser-side document conversions (no backend). Used by:
//   pdf-to-word, word-to-pdf, pdf-to-excel
// Client-only. Output quality is "basic": text/paragraph level, not pixel-perfect layout.

import { openPdf, zipFiles, ocrPdfFiles } from "@/lib/clientPdfTools";

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
  const { Document, Packer, Paragraph, TextRun, Tab, TabStopType, Footer, PageNumber, AlignmentType } = docx;
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

  // Page numbers: a lone number near the bottom of (most) pages → real Word footer with a PAGE field,
  // instead of loose text that would end up at the end of the content.
  let pageNumStart = null;
  {
    const found = [];
    pages.forEach((pg, pi) => {
      const last = pg.lines[pg.lines.length - 1];
      if (!last || last.y > pg.h * 0.14) return;
      const m = last.text.trim().match(/^(?:page\s+)?(\d{1,4})$|^[-–—]\s*(\d{1,4})\s*[-–—]$/i);
      if (m) found.push({ pi, n: parseInt(m[1] || m[2], 10) });
    });
    const counts = new Map();
    found.forEach((f) => counts.set(f.n - f.pi, (counts.get(f.n - f.pi) || 0) + 1));
    let bestOff = null, bestCnt = 0;
    counts.forEach((c, off) => { if (c > bestCnt) { bestCnt = c; bestOff = off; } });
    const nonEmpty = pages.filter((p) => p.lines.length).length;
    if (found.length >= 2 && bestCnt >= Math.ceil(nonEmpty * 0.5) && bestCnt >= found.length * 0.9) {
      pageNumStart = bestOff; // PAGE value on the first page = printed number − page index
      found.forEach((f) => { if (f.n - f.pi === bestOff) pages[f.pi].lines.pop(); });
    }
  }

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
            ...(pageNumStart !== null ? { pageNumbers: { start: Math.max(1, pageNumStart) } } : {}),
          },
        },
        ...(pageNumStart !== null
          ? {
              footers: {
                default: new Footer({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })],
                    }),
                  ],
                }),
              },
            }
          : {}),
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
// WORD (.docx) → PDF   (docx-preview renders Word layout → page screenshots → PDF)
// ═════════════════════════════════════════════════════════════════════════

// ── Page-number fields ────────────────────────────────────────────────────
// docx-preview does not evaluate PAGE / NUMPAGES fields (it just shows whatever number Word last cached,
// the same one on every page, or nothing). So we swap those fields in headers/footers for markers
// before rendering and fill in the real number per page afterwards.
const PN_PAGE = "\uE000PAGE\uE001";
const PN_TOTAL = "\uE000TOTAL\uE001";

function fieldMarker(instr) {
  if (/^\s*PAGE\b/i.test(instr)) return PN_PAGE;
  if (/^\s*(NUMPAGES|SECTIONPAGES)\b/i.test(instr)) return PN_TOTAL;
  return null;
}

function replaceFieldsInPart(xml) {
  const mkRun = (rPr, marker) => `<w:r>${rPr || ""}<w:t xml:space="preserve">${marker}</w:t></w:r>`;

  // <w:fldSimple w:instr="PAGE"> … </w:fldSimple>
  xml = xml.replace(/<w:fldSimple\b[^>]*\bw:instr="([^"]*)"[^>]*>([\s\S]*?)<\/w:fldSimple>/g, (m, instr, inner) => {
    const mk = fieldMarker(instr);
    if (!mk) return m;
    const rPr = (inner.match(/<w:rPr>[\s\S]*?<\/w:rPr>/) || [""])[0];
    return mkRun(rPr, mk);
  });

  // complex fields: begin … instrText … separate … cached result … end (can be spread over several runs)
  let phase = "none"; // none | instr | result
  let instr = "";
  let held = [];
  let rPr = "";
  return xml.replace(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/g, (run) => {
    const tokens = [...run.matchAll(/<w:fldChar\b[^>]*w:fldCharType="(\w+)"|<w:instrText\b[^>]*>([^<]*)</g)];
    const ownRPr = (run.match(/<w:rPr>[\s\S]*?<\/w:rPr>/) || [""])[0];
    if (!tokens.length) {
      if (phase === "result") { held.push(run); rPr = rPr || ownRPr; return ""; }
      if (phase === "instr") return "";
      return run;
    }
    let out = "";
    for (const t of tokens) {
      if (t[2] !== undefined) { instr += t[2]; continue; }
      const type = t[1];
      if (type === "begin") { phase = "instr"; instr = ""; held = []; rPr = ownRPr; }
      else if (type === "separate") { phase = "result"; }
      else if (type === "end") {
        const mk = fieldMarker(instr);
        out += mk ? mkRun(rPr || ownRPr, mk) : held.join("");
        phase = "none"; instr = ""; held = []; rPr = "";
      }
    }
    return out;
  });
}

async function prepareDocxFields(arrayBuffer) {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(arrayBuffer);
  let start = 1;
  const docXml = zip.file("word/document.xml") ? await zip.file("word/document.xml").async("string") : "";
  const m = docXml.match(/<w:pgNumType\b[^>]*w:start="(\d+)"/);
  if (m) start = parseInt(m[1], 10) || 1;
  let changed = false;
  for (const name of Object.keys(zip.files)) {
    if (!/^word\/(header|footer)\d*\.xml$/.test(name)) continue;
    const xml = await zip.file(name).async("string");
    if (!/PAGE|SECTIONPAGES/i.test(xml)) continue;
    const next = replaceFieldsInPart(xml);
    if (next !== xml) { zip.file(name, next); changed = true; }
  }
  return { buffer: changed ? await zip.generateAsync({ type: "arraybuffer" }) : arrayBuffer, start };
}

// Pages that end with a lone number ("34") as ordinary text — typical for files converted from a PDF.
// If most pages do, treat those as page numbers and pin them to the bottom centre of the page.
function pinTrailingPageNumbers(pages) {
  const cands = [];
  for (const sec of pages) {
    const article = sec.querySelector("article");
    const last = article?.lastElementChild;
    if (!last || last === article.firstElementChild) continue;
    if (last.tagName !== "P" || !/^\d{1,4}$/.test((last.textContent || "").trim())) continue;
    cands.push(last);
  }
  if (cands.length < 2 || cands.length < Math.ceil(pages.length * 0.5)) return;
  for (const el of cands) {
    Object.assign(el.style, {
      position: "absolute", left: "0", right: "0", bottom: "40px",
      margin: "0", padding: "0", textIndent: "0", textAlign: "center",
    });
  }
}

function fillPageNumbers(pages, startNo) {
  const total = String(pages.length);
  pages.forEach((sec, i) => {
    const walker = sec.ownerDocument.createTreeWalker(sec, 4 /* SHOW_TEXT */);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.includes("\uE000")) nodes.push(walker.currentNode);
    for (const n of nodes) {
      n.nodeValue = n.nodeValue.split(PN_PAGE).join(String(startNo + i)).split(PN_TOTAL).join(total);
    }
  });
}

const WORD_MAX_PAGES = 200;
const WORD_RENDER_SCALE = 1.5; // ~144 dpi: sharp text, much faster than 2x
const WORD_CONCURRENCY = 3;

const pxToPt = (px) => px * 0.75;

async function docxToPdfBytes(file, onProgress) {
  if (/\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name)) {
    throw new Error(`"${file.name}" is an old .doc file. Please open it in Word and save it as .docx, then try again.`);
  }
  const [{ renderAsync }, { default: html2canvas }, { PDFDocument }] = await Promise.all([
    import("docx-preview"),
    import("html2canvas"),
    import("pdf-lib"),
  ]);

  // docx-preview lays the document out the way Word does (page size, margins, fonts, alignment,
  // spacing, tables, headers/footers) and already splits it into real pages.
  // Rendered inside an isolated iframe so the site's own CSS (Tailwind etc.) can't leak into the pages
  // and html2canvas never has to parse it.
  const host = document.createElement("iframe");
  host.setAttribute("sandbox", "allow-same-origin");
  host.setAttribute("scrolling", "no");
  host.style.cssText = "position:fixed;left:-100000px;top:0;width:1400px;height:1000px;border:0;pointer-events:none;";
  document.body.appendChild(host);
  await new Promise((resolve) => {
    host.onload = resolve;
    host.srcdoc = "<!doctype html><html><head><meta charset='utf-8'></head><body style='margin:0;background:#fff'></body></html>";
    setTimeout(resolve, 3000);
  });
  const idoc = host.contentDocument;
  const styleBox = idoc.createElement("div");
  idoc.body.appendChild(styleBox);
  const body = idoc.createElement("div");
  idoc.body.appendChild(body);

  let startNo = 1;
  try {
    try {
      let buf = await file.arrayBuffer();
      try {
        const prep = await prepareDocxFields(buf);
        buf = prep.buffer;
        startNo = prep.start;
      } catch (_) { /* keep the original file */ }
      await renderAsync(buf, body, styleBox, {
        inWrapper: true,
        breakPages: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
        useBase64URL: true,
        ignoreLastRenderedPageBreak: false,
      });
    } catch (_) {
      throw new Error(`Could not read "${file.name}". Is it a valid .docx file?`);
    }

    const wrapper = body.querySelector(".docx-wrapper");
    if (wrapper) { wrapper.style.background = "transparent"; wrapper.style.padding = "0"; wrapper.style.display = "block"; }
    const pages = [...body.querySelectorAll("section.docx")].slice(0, WORD_MAX_PAGES);
    if (!pages.length) throw new Error(`"${file.name}" has no content to convert.`);
    pages.forEach((p) => { p.style.boxShadow = "none"; p.style.margin = "0"; });
    fillPageNumbers(pages, startNo);
    pinTrailingPageNumbers(pages);
    // Make the iframe as tall as the whole document. If it stays short, html2canvas clips everything
    // below the iframe's viewport (that is what pushed footers / page numbers out of the picture).
    const maxW = Math.ceil(Math.max(...pages.map((p) => p.getBoundingClientRect().width), 800));
    host.style.width = `${maxW + 40}px`;
    host.style.height = "4000px";
    let fullH = Math.max(idoc.documentElement.scrollHeight, idoc.body.scrollHeight);
    host.style.height = `${fullH}px`;
    fullH = Math.max(idoc.documentElement.scrollHeight, idoc.body.scrollHeight);
    const fullW = Math.max(idoc.documentElement.scrollWidth, maxW);

    // wait (bounded) for fonts and images so the screenshot is complete
    try { await Promise.race([idoc.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]); } catch (_) {}
    const imgs = [...body.querySelectorAll("img")].filter((i) => !i.complete);
    if (imgs.length) {
      await Promise.race([
        Promise.all(imgs.map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
        new Promise((r) => setTimeout(r, 4000)),
      ]);
    }

    // screenshot pages a few at a time
    const shots = new Array(pages.length);
    let next = 0;
    let done = 0;
    const worker = async () => {
      while (next < pages.length) {
        const i = next++;
        const el = pages[i];
        const rect = el.getBoundingClientRect();
        const canvas = await html2canvas(el, {
          scale: WORD_RENDER_SCALE,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          windowWidth: fullW,
          windowHeight: fullH,
        });
        const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.9));
        shots[i] = { bytes: new Uint8Array(await blob.arrayBuffer()), w: pxToPt(rect.width), h: pxToPt(rect.height) };
        canvas.width = canvas.height = 0;
        done++;
        onProgress?.(done / pages.length);
      }
    };
    await Promise.all(Array.from({ length: Math.min(WORD_CONCURRENCY, pages.length) }, worker));

    const out = await PDFDocument.create();
    for (const s of shots) {
      const img = await out.embedJpg(s.bytes);
      const page = out.addPage([s.w, s.h]);
      page.drawImage(img, { x: 0, y: 0, width: s.w, height: s.h });
    }
    return await out.save();
  } finally {
    host.remove();
  }
}

export async function wordFilesToPdf(files, onProgress) {
  const outs = [];
  for (let i = 0; i < files.length; i++) {
    outs.push({ name: `${stripExt(files[i].name)}.pdf`, data: await docxToPdfBytes(files[i], (p) => onProgress?.((i + p) / files.length)) });
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
