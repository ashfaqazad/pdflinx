// app/embed/pdf-to-jpg/page.jsx

import PdfToJpgCore from "@/components/tools/PdfToJpgCore";

export const metadata = {
  title: "PDF to JPG - PDFLinx",
  robots: "noindex",
};

export default function EmbedPdfToJpg({ searchParams }) {
  const isCompact = searchParams?.compact === "true";

  return (
    <>
      <PdfToJpgCore compact={isCompact} />
      <div style={{
        textAlign: "center",
        padding: "8px",
        borderTop: "1px solid #f1f5f9"
      }}>
        <a
          href="https://pdflinx.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#94a3b8", fontSize: "11px", textDecoration: "none" }}
        >
          🔗 Powered by PDFLinx.com
        </a>
      </div>
    </>
  );
}