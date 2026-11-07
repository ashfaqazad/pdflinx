import CompressionSavingsCalculator from "@/components/CompressionSavingsCalculator";
import { CALC_FAQS } from "@/lib/calcFaqs";

export const metadata = {
  title: "PDF Compression Savings Calculator | PDFLinx",
  description: "Calculate how much storage, bandwidth & money you save by compressing PDFs.",
  alternates: {
    canonical: "https://pdflinx.com/compress-pdf-savings-calculator",
  },
  openGraph: {
    title: "PDF Compression Savings Calculator | PDFLinx",
    description: "Calculate how much storage, bandwidth & money you save by compressing PDFs.",
    url: "https://pdflinx.com/compress-pdf-savings-calculator",
    type: "website",
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