// Browser-side helpers for the AI tools: read the PDF text locally, pick relevant passages,
// and call our own /api/ai/* routes (which hold the Groq key). The PDF file itself is never uploaded.

import { openPdf } from "@/lib/clientPdfTools";

const NO_TEXT_MSG =
  "No selectable text found — this looks like a scanned PDF. Please run it through the OCR PDF tool first.";

/** Extract text per page. Returns { pages: [{ n, text }], totalPages }. */
export async function extractPdfPages(file, { maxPages = 300, maxChars = 400000 } = {}) {
  const pdf = await openPdf(file);
  const pages = [];
  let chars = 0;
  const limit = Math.min(pdf.numPages, maxPages);
  for (let i = 1; i <= limit; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = "";
    let lastY = null;
    for (const it of content.items) {
      if (typeof it.str !== "string") continue;
      const y = it.transform ? it.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !text.endsWith("\n") && !text.endsWith(" ")) text += " ";
      text += it.str;
      if (it.hasEOL && !text.endsWith(" ")) text += " ";
      if (y !== null) lastY = y;
    }
    text = text.replace(/\s+/g, " ").trim();
    if (text) {
      pages.push({ n: i, text });
      chars += text.length;
    }
    page.cleanup();
    if (chars >= maxChars) break;
  }
  const totalPages = pdf.numPages;
  pdf.destroy();
  if (!pages.length) throw new Error(NO_TEXT_MSG);
  return { pages, totalPages };
}

async function postJson(url, payload) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    throw new Error("Network error. Please check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data;
}

// ── Summarize ─────────────────────────────────────────────────────────────
export async function summarizePdf(file) {
  const { pages } = await extractPdfPages(file, { maxPages: 15, maxChars: 60000 });
  const text = pages.map((p) => p.text).join("\n\n");
  const { summary } = await postJson("/api/ai/summarize", { text });
  return summary;
}

// ── Chat: local retrieval ─────────────────────────────────────────────────
const STOP = new Set(
  "a an the and or of to in on for with is are was were be been it this that these those as at by from what which who whom how why when where do does did can could should would about into than then so if not no yes i you we they he she them his her our your their my me".split(" ")
);
const tokenize = (s) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

/** Split pages into ~1100-char passages (with a little overlap) tagged with their page number. */
export function buildIndex(pages) {
  const chunks = [];
  const SIZE = 1100;
  const OVERLAP = 150;
  for (const p of pages) {
    for (let i = 0; i < p.text.length; i += SIZE - OVERLAP) {
      const text = p.text.slice(i, i + SIZE);
      if (text.trim().length < 20) continue;
      chunks.push({ page: p.n, text, tokens: tokenize(text) });
      if (i + SIZE >= p.text.length) break;
    }
  }
  const df = new Map();
  for (const c of chunks) for (const t of new Set(c.tokens)) df.set(t, (df.get(t) || 0) + 1);
  return { chunks, df, N: chunks.length };
}

/** Pick the most relevant passages for a question (BM25-style scoring). */
export function retrieve(index, question, { topK = 7, maxChars = 9000 } = {}) {
  const q = tokenize(question);
  const { chunks, df, N } = index;
  const k1 = 1.4;
  const b = 0.75;
  const avg = chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(1, N);

  const scored = chunks.map((c, i) => {
    const tf = new Map();
    for (const t of c.tokens) tf.set(t, (tf.get(t) || 0) + 1);
    let score = 0;
    for (const t of q) {
      const f = tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * c.tokens.length) / avg));
    }
    return { i, score };
  });

  let picked = scored.filter((s) => s.score > 0).sort((a, b2) => b2.score - a.score).slice(0, topK);
  // generic questions ("summarize", "what is this about") or no keyword hits → use the beginning of the document
  if (picked.length < 2) {
    const head = chunks.slice(0, topK).map((_, i) => ({ i, score: 0 }));
    picked = [...picked, ...head.filter((h) => !picked.some((p) => p.i === h.i))].slice(0, topK);
  }
  picked.sort((a, b2) => a.i - b2.i); // keep document order

  let out = "";
  for (const p of picked) {
    const c = chunks[p.i];
    const piece = `[page ${c.page}] ${c.text}\n\n`;
    if (out.length + piece.length > maxChars) break;
    out += piece;
  }
  return out.trim();
}

export async function askPdf(index, question, history = []) {
  const context = retrieve(index, question);
  const { answer } = await postJson("/api/ai/chat", { question, context, history });
  return answer;
}
