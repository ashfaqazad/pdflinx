// Site-wide structured data. Rendered on the server (homepage) so it is in the raw HTML.
const SITE_URL = "https://pdflinx.com";

// Add real profile URLs here (X/Twitter, LinkedIn, GitHub, YouTube, ...).
// They are emitted as `sameAs` only when the list is not empty.
export const SOCIAL_PROFILES = [];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "PDF Linx",
  alternateName: "PDFLinx",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/Pdflinx.png`,
    width: 192,
    height: 192,
  },
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "PDF Linx",
  url: SITE_URL,
  description:
    "Free online PDF tools to convert, merge, split, compress, protect, unlock, rotate, sign, watermark and edit PDFs.",
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};
