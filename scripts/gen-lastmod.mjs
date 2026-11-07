// Generates lib/lastmod.json = { "/path": "ISO date" } for the sitemaps, using the date of the
// last git commit that touched the page's own files (component + the lib helpers it imports).
// Runs automatically before `next build` (see "prebuild" in package.json).
// If git is not available (e.g. a build without history) the existing JSON is kept untouched.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "lib", "lastmod.json");

const read = (p) => { try { return readFileSync(path.join(root, p), "utf8"); } catch { return ""; } };

function gitDate(files) {
  const existing = files.filter((f) => existsSync(path.join(root, f)));
  if (!existing.length) return null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...existing], { cwd: root, encoding: "utf8" }).trim();
    return out || null;
  } catch {
    return null;
  }
}

try {
  execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: root, stdio: "ignore" });
} catch {
  console.log("[lastmod] git not available — keeping existing lib/lastmod.json");
  process.exit(0);
}

const result = {};
const day = (iso) => (iso ? iso.slice(0, 10) : null);

// ── tools: slug → component file (+ lib helpers it imports) ──
const loader = read("components/ToolLoader.jsx");
const toolFiles = {};
for (const m of loader.matchAll(/^\s*'([a-z0-9-]+)':\s*dynamic\(\(\) => import\('@\/([^']+)'\)/gm)) {
  toolFiles[m[1]] = `${m[2]}.jsx`;
}
Object.assign(toolFiles, {
  "compress-pdf": "app/compress-pdf/CompressPdfClient.jsx",
  "merge-pdf": "app/merge-pdf/MergePdfClient.jsx",
  "split-pdf": "app/split-pdf/SplitPdfClient.jsx",
  "compress-pdf-savings-calculator": "components/CompressionSavingsCalculator.jsx",
  "pdf-to-word-for-students": toolFiles["pdf-to-word"],
});

for (const [slug, file] of Object.entries(toolFiles)) {
  const src = read(file);
  const libs = [...src.matchAll(/from\s+"@\/(lib\/[A-Za-z0-9_]+)"/g)].map((m) => `${m[1]}.js`);
  const extra = slug === "compress-pdf-savings-calculator" ? ["app/compress-pdf-savings-calculator/page.jsx"] : [];
  const d = day(gitDate([file, ...libs, ...extra]));
  if (d) result[`/${slug}`] = d;
}

// ── blog: publish date from BlogClient (fallback: git date of the blog code) ──
const blogSrc = read("app/blog/BlogClient.jsx");
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
for (const m of blogSrc.matchAll(/date:\s*"([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})"[\s\S]*?slug:\s*"([^"]+)"/g)) {
  const [, mon, dd, yyyy, slug] = m;
  if (MONTHS[mon]) result[`/blog/${slug}`] = `${yyyy}-${String(MONTHS[mon]).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

// ── static pages ──
const staticPages = {
  "/": ["app/page.js", "components/HomeContent.jsx"],
  "/blog": ["app/blog/page.jsx", "app/blog/BlogClient.jsx"],
  "/free-pdf-tools": ["app/free-pdf-tools/page.jsx"],
  "/about": ["app/about/page.jsx", "app/about/AboutClient.jsx"],
  "/contact": ["app/contact"],
  "/privacy-policy": ["app/privacy-policy"],
  "/terms-and-conditions": ["app/terms-and-conditions"],
  "/embed-code": ["app/embed-code"],
  "/compare/pdflinx-vs-ilovepdf": ["app/compare", "lib/compareData.js"],
  "/compare/pdflinx-vs-smallpdf": ["app/compare", "lib/compareData.js"],
};
for (const [url, files] of Object.entries(staticPages)) {
  const d = day(gitDate(files));
  if (d) result[url] = d;
}

const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`[lastmod] wrote ${Object.keys(sorted).length} entries`);
