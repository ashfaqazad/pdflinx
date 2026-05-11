// lib/toolUiConfig.js

export const DEFAULT_SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Works on desktop & mobile",
];

export const DEFAULT_DONE_LINKS = [
  { label: "PDF to Word", href: "/pdf-to-word" },
  { label: "Word to PDF", href: "/word-to-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "Protect PDF", href: "/protect-pdf" },
];

export function buildUploadLandingContent({
  eyebrow,
  heroTitle,
  heroDescription,
  uploadTitle,
  uploadSubtitle,
  noticeTitle,
  noticeItems,
  howToTitle,
  howToSteps,
  seoSections,
  faqs,
  relatedTools,
}) {
  return {
    eyebrow,
    heroTitle,
    heroDescription,
    uploadTitle,
    uploadSubtitle,
    noticeTitle,
    noticeItems,
    howToTitle,
    howToSteps,
    seoSections,
    faqs,
    relatedTools,
  };
}

