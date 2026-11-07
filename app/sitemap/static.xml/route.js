import lastmod from "@/lib/lastmod.json";

// app/sitemap/static.sxml/route.js

export async function GET() {
  const baseUrl = "https://pdflinx.com";

  const staticRoutes = [
    { url: "/", priority: "1.0", freq: "weekly" },
    { url: "/blog", priority: "0.8", freq: "weekly" },
    { url: "/free-pdf-tools", priority: "0.8", freq: "monthly" },
    { url: "/about", priority: "0.4", freq: "yearly" },
    { url: "/contact", priority: "0.4", freq: "yearly" },
    { url: "/privacy-policy", priority: "0.3", freq: "yearly" },
    { url: "/terms-and-conditions", priority: "0.3", freq: "yearly" },
    { url: "/embed-code", priority: "0.7", freq: "monthly" },
    { url: "/compare/pdflinx-vs-ilovepdf", priority: "0.75", freq: "monthly" },
    { url: "/compare/pdflinx-vs-smallpdf", priority: "0.75", freq: "monthly" }
  ];

  const urlsXml = staticRoutes
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    ${lastmod[item.url] ? `
    <lastmod>${lastmod[item.url]}</lastmod>` : ""}
    <changefreq>${item.freq}</changefreq>
    <priority>${item.priority}</priority>
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