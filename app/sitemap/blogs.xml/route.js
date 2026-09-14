export async function GET() {
  const baseUrl = "https://pdflinx.com";
  const lastModDate = "2026-09-01T00:00:00.000Z";

  const blogRoutes = [
    "/blog/pdf-to-word-accuracy-tips", "/blog/word-to-pdf-best-practices",
    "/blog/image-to-pdf-quality-guide", "/blog/when-to-merge-pdf-files",
    "/blog/split-pdf-for-sharing", "/blog/compress-pdf-email-limit",
    "/blog/excel-to-pdf-print-layout", "/blog/pdf-to-jpg-vs-png",
    "/blog/ppt-to-pdf-fonts-missing", "/blog/pdf-password-best-practices",
    "/blog/forgot-pdf-password-options", "/blog/pdf-pages-upside-down-fix",
    "/blog/digital-vs-electronic-signature-pdf", "/blog/ocr-pdf-accuracy-languages",
    "/blog/edit-pdf-without-word", "/blog/watermark-pdf-for-freelancers",
    "/blog/word-to-pdf-windows-vs-mac", "/blog/compress-pdf-mobile-vs-desktop",
    "/blog/chat-with-pdf-ai-questions-answers-any-document",
    "/blog/how-to-summarize-a-pdf-with-ai-instantly",
    "/blog/pdf-to-word-formatting-messed-up", "/blog/how-to-edit-scanned-pdf-in-word",
    "/blog/convert-pdf-resume-to-editable-word", "/blog/best-tools-for-students",
    "/blog/best-free-image-converter-tools", "/blog/how-to-convert-chatgpt-pdf-to-word",
    "/blog/pdf-file-too-large-compress", "/blog/freelancer-edit-pdf-free",
    "/blog/pdf-not-editable-fix", "/blog/convert-word-to-pdf-without-losing-formatting",
    "/blog/word-to-pdf-on-mobile", "/blog/word-to-pdf-not-working-fix",
    "/blog/why-formatting-breaks-in-word-to-pdf", "/blog/free-vs-paid-word-to-pdf-tools",
    "/blog/word-to-pdf-for-students", "/blog/word-to-pdf-free-no-signup",
    "/blog/compress-pdf-without-losing-quality", "/blog/compress-pdf-on-mobile",
    "/blog/pdf-still-too-large-after-compression", "/blog/why-are-pdf-files-so-large",
    "/blog/how-small-should-i-compress-my-pdf"
  ];

  const urlsXml = blogRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}