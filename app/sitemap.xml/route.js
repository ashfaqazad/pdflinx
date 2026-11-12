import lastmod from "@/lib/lastmod.json";

// Sitemap index. Each child sitemap gets a <lastmod> = the newest <lastmod> among its URLs.
const STATIC_PAGES = new Set([
  "/", "/blog", "/free-pdf-tools", "/about", "/contact", "/privacy-policy",
  "/terms-and-conditions", "/embed-code",
  "/compare/pdflinx-vs-ilovepdf", "/compare/pdflinx-vs-smallpdf",
]);

function newest(predicate) {
  return Object.entries(lastmod)
    .filter(([path]) => predicate(path))
    .map(([, date]) => date)
    .sort()
    .pop();
}

export async function GET() {
  const children = [
    { loc: "https://pdflinx.com/sitemap/tools.xml", date: newest((p) => !STATIC_PAGES.has(p) && !p.startsWith("/blog/")) },
    { loc: "https://pdflinx.com/sitemap/blogs.xml", date: newest((p) => p.startsWith("/blog/")) },
    { loc: "https://pdflinx.com/sitemap/static.xml", date: newest((p) => STATIC_PAGES.has(p)) },
  ];

  const items = children
    .map(
      (c) => `
  <sitemap>
    <loc>${c.loc}</loc>${c.date ? `
    <lastmod>${c.date}</lastmod>` : ""}
  </sitemap>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}
