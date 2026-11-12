
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/breadcrumbSchema";

export const metadata = {
  title: { absolute: "Embed Free PDF Tools on Your Website | PDF Linx" },
  description: "Add free PDF tools to your website, blog, or WordPress site. Copy the embed code or download our WordPress plugin — no API key needed.",
  alternates: {
    canonical: "https://pdflinx.com/embed-code",
  },
  openGraph: {
    title: "Embed Free PDF Tools | PDFLinx",
    description: "Add PDF tools to your site for free. Works on HTML, WordPress, React, Next.js.",
    url: "https://pdflinx.com/embed-code",
  },
};

export default function EmbedCodeLayout({ children }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Embed Code", path: "/embed-code" }])} />
      {children}
    </>
  );
}
