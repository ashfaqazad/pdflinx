import HomeContent from "@/components/HomeContent"; // 👈 Client component import

// ✅ SEO Metadata (server-side)
export const metadata = {
  title: "Free Online PDF Converter | Convert, Merge & Compress PDF Files",
  description:
    "Convert PDF to Word, merge, split, and compress PDF files online for free. Fast, secure, and no signup needed.",
  keywords:
    "PDF converter, merge PDF, split PDF, compress PDF, word to pdf, pdf to word, online pdf tools",
  robots: "index, follow",
  openGraph: {
    title: "Free Online PDF Converter | Convert, Merge & Compress PDF Files",
    description:
      "Convert PDF to Word, merge, split, and compress PDF files online for free. Fast, secure, and no signup needed.",
    url: "https://www.pdflinx.com/",
    siteName: "PDFLinx",
    type: "website",
  },
};

// ✅ Server component (no hooks)
export default function Home() {
  return <HomeContent />;
}
