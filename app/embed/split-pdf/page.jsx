// app/embed/split-pdf/page.jsx

import SplitPdfCore from "@/app/split-pdf/SplitPdfCore";

export const metadata = {
  title: "Split PDF - PDFLinx",
  robots: "noindex",
};

export default function EmbedSplitPDF({ searchParams }) {
  const isCompact = searchParams?.compact === "true";

  return (
    <>
      <SplitPdfCore compact={isCompact} />
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