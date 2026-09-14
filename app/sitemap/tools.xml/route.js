export async function GET() {
  const baseUrl = "https://pdflinx.com";
  // Fixed deployment date (Update this only when you release tool updates)
  const lastModDate = "2026-09-01T00:00:00.000Z";

  const toolRoutes = [
    "/pdf-to-word", "/pdf-to-word-for-students", "/word-to-pdf", "/image-to-pdf",
    "/compress-pdf", "/merge-pdf", "/split-pdf", "/excel-pdf", "/pdf-to-jpg",
    "/ppt-to-pdf", "/protect-pdf", "/unlock-pdf", "/rotate-pdf", "/sign-pdf",
    "/ocr-pdf", "/edit-pdf", "/add-watermark", "/pdf-to-excel",
    "/compress-pdf-savings-calculator", "/remove-pages", "/add-page-numbers",
    "/html-to-pdf", "/pdf-to-png", "/pdf-to-text", "/text-to-pdf",
    "/pdf-to-powerpoint", "/crop-pdf", "/extract-pdf", "/organize-pdf",
    "/repair-pdf", "/redact-pdf", "/ai-summarize", "/chat-with-pdf"
  ];

  const urlsXml = toolRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
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