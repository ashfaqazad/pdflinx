// app/embed/merge-pdf/page.jsx

import MergePdfCore from "@/app/merge-pdf/MergePdfCore";

export const metadata = {
  title: "Merge PDF - PDFLinx",
  robots: "noindex",
};

export default function EmbedMergePDF({ searchParams }) {
  const isCompact = searchParams?.compact === "true";

  return (
    <>
      <MergePdfCore compact={isCompact} />
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