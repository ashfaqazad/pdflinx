import CompressionSavingsCalculator from "@/components/CompressionSavingsCalculator";
import { CALC_FAQS } from "@/lib/calcFaqs";

export const metadata = {
  title: { absolute: "PDF Compression Savings Calculator | PDF Linx" },
  description: "Estimate how much storage, bandwidth and money you save by compressing PDFs. Enter your file size and volume to see savings per file and per month.",
  alternates: {
    canonical: "https://pdflinx.com/compress-pdf-savings-calculator",
  },
  openGraph: {
    title: "PDF Compression Savings Calculator | PDF Linx",
    description: "Estimate how much storage, bandwidth and money you save by compressing PDFs. Enter your file size and volume to see savings per file and per month.",
    url: "https://pdflinx.com/compress-pdf-savings-calculator",
    siteName: "PDF Linx",
    type: "website",
    images: [{ url: "/og/pdflinx-og.png", width: 1200, height: 630, alt: "PDF Linx — Free Online PDF Tools" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CALC_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CompressionSavingsCalculator />
    </>
  );
}