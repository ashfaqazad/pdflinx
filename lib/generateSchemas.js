// lib/generateSchemas.js
const SITE_URL = "https://pdflinx.com";

export function generateSchemas(pageData) {
  const url = pageData.canonical; // seoData mein already full URL hai
  const name = pageData.h1 || pageData.title;
  const schemas = [];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    url,
    description: pageData.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "PDFLinx", url: SITE_URL },
  });

  if (pageData.howItWorks?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name,
      description: pageData.description,
      step: pageData.howItWorks.map((text, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: text,
        text,
      })),
    });
  }

  return schemas;
}