// Web app manifest, served at /manifest.webmanifest (Next adds the <link rel="manifest"> tag).
export default function manifest() {
  return {
    name: "PDF Linx — Free Online PDF Tools",
    short_name: "PDF Linx",
    description:
      "Free online PDF tools to convert, merge, split, compress, sign and edit PDFs. No signup required.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
