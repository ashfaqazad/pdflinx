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
