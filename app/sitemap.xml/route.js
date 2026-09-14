export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://pdflinx.com/sitemap/tools.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://pdflinx.com/sitemap/blogs.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://pdflinx.com/sitemap/static.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}