// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://pdflinx.com";

  const staticRoutes = [
    { url: "/", changeFrequency: "monthly", priority: 1.0 },
    { url: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { url: "/free-pdf-tools", changeFrequency: "monthly", priority: 0.9 },
    { url: "/about", changeFrequency: "yearly", priority: 0.5 },
    { url: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { url: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { url: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
    { url: "/embed-code", changeFrequency: "monthly", priority: 0.9 },

    // Comparison Pages
    { url: "/compare/pdflinx-vs-ilovepdf", changeFrequency: "monthly", priority: 0.8 },
    { url: "/compare/pdflinx-vs-smallpdf", changeFrequency: "monthly", priority: 0.8 },
  ];

  const toolRoutes = [
    "/pdf-to-word",
    "/pdf-to-word-for-students",
    "/word-to-pdf",
    "/image-to-pdf",
    "/compress-pdf",
    "/merge-pdf",
    "/split-pdf",
    "/excel-pdf",
    "/pdf-to-jpg",
    "/ppt-to-pdf",
    "/protect-pdf",
    "/unlock-pdf",
    "/rotate-pdf",
    "/sign-pdf",
    "/ocr-pdf",
    "/edit-pdf",
    "/add-watermark",
    "/pdf-to-excel",
    "/compress-pdf-savings-calculator",
    "/remove-pages",
    "/add-page-numbers",
    "/html-to-pdf",
    "/pdf-to-png",
    "/pdf-to-text",
    "/text-to-pdf",

  ].map((url) => ({
    url,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogRoutes = [
    // General tool blogs
    "/blog/pdf-to-word",
    "/blog/word-to-pdf",
    "/blog/image-to-pdf",
    "/blog/merge-pdf",
    "/blog/split-pdf",
    "/blog/compress-pdf",
    "/blog/excel-pdf",
    "/blog/pdf-to-jpg",
    "/blog/ppt-to-pdf",
    "/blog/protect-pdf",
    "/blog/unlock-pdf",
    "/blog/rotate-pdf",
    "/blog/sign-pdf",
    "/blog/ocr-pdf",
    "/blog/edit-pdf",
    "/blog/add-watermark",
    "/blog/pdf-to-word-formatting-messed-up",
    "/blog/how-to-edit-scanned-pdf-in-word",
    "/blog/convert-pdf-resume-to-editable-word",
    "/blog/best-tools-for-students",
    "/blog/best-free-image-converter-tools",
    "/blog/how-to-convert-chatgpt-pdf-to-word",
    "/blog/pdf-file-too-large-compress",
    "/blog/freelancer-edit-pdf-free",
    "/blog/pdf-not-editable-fix",

    // 🔥 Word to PDF Cluster
    "/blog/how-to-convert-word-to-pdf",
    "/blog/convert-word-to-pdf-without-losing-formatting",
    "/blog/word-to-pdf-on-mobile",
    "/blog/word-to-pdf-not-working-fix",
    "/blog/why-formatting-breaks-in-word-to-pdf",
    "/blog/free-vs-paid-word-to-pdf-tools",
    "/blog/word-to-pdf-for-students",

    // 🔥 Compress PDF Cluster
    "/blog/how-to-compress-a-pdf",
    "/blog/compress-pdf-without-losing-quality",
    "/blog/compress-pdf-on-mobile",
    "/blog/pdf-still-too-large-after-compression",
    "/blog/why-are-pdf-files-so-large",
    "/blog/how-small-should-i-compress-my-pdf",
  ].map((url) => ({
    url,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

  return allRoutes.map(({ url, changeFrequency, priority }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}



