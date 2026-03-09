// app/embed/word-to-pdf/page.jsx

import WordToPdfCore from "@/components/tools/WordToPdfCore";

export const metadata = {
  title: "Word to PDF - PDFLinx",
  robots: "noindex",
};

export default function EmbedWordToPdf({ searchParams }) {
  const isCompact = searchParams?.compact === "true";

  return (
    <>
      <WordToPdfCore compact={isCompact} />
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