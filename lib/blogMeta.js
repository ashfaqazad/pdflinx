// Search-result titles for blog posts (kept under 60 characters).
// The on-page H1 stays the full post title; only <title> / og:title use these.
const BRAND = " | PDF Linx";

const OVERRIDES = {
  "pdf-to-word-accuracy-tips": "PDF to Word Accuracy Tips for Better Results",
  "word-to-pdf-best-practices": "Word to PDF Best Practices for Clean Documents",
  "image-to-pdf-quality-guide": "Image to PDF Quality Guide: Sharp, Clean Results",
  "when-to-merge-pdf-files": "When to Merge PDF Files: Smart Situations to Combine",
  "excel-to-pdf-print-layout": "Excel to PDF Print Layout: Fix Columns and Pages",
  "pdf-password-best-practices": "PDF Password Best Practices to Protect Documents",
  "pdf-pages-upside-down-fix": "PDF Pages Upside Down or Sideways? Fix Orientation",
  "digital-vs-electronic-signature-pdf": "Digital vs Electronic Signature on PDF: Differences",
  "word-to-pdf-free-no-signup": "Convert Word to PDF Free: No Sign Up, No Watermark",
  "how-small-should-i-compress-my-pdf": "How Small Should I Compress My PDF? Size Guide",
  "how-to-summarize-a-pdf-with-ai-instantly": "How to Summarize a PDF with AI Instantly",
  "chat-with-pdf-ai-questions-answers-any-document":
    "Chat with PDF Using AI: Ask Questions, Get Answers",
};

export function blogSeoTitle(blog) {
  if (blog.seoTitle) return blog.seoTitle;
  const base = OVERRIDES[blog.slug] || blog.title;
  return base.length + BRAND.length < 60 ? base + BRAND : base;
}

export const SITE_URL = "https://pdflinx.com";
export const DEFAULT_BLOG_IMAGE = "/og/pdflinx-og.png"; // 1200x630

const MONTHS = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

// "Aug 24, 2025" -> "2025-08-24"
export function blogIsoDate(dateStr) {
  const m = /^([A-Za-z]{3})[a-z]* (\d{1,2}), (\d{4})$/.exec(dateStr || "");
  if (!m || !MONTHS[m[1]]) return undefined;
  return `${m[3]}-${MONTHS[m[1]]}-${m[2].padStart(2, "0")}`;
}

export function blogImageUrl(blog) {
  const img = blog.coverImage || DEFAULT_BLOG_IMAGE;
  return img.startsWith("http") ? img : SITE_URL + img;
}
