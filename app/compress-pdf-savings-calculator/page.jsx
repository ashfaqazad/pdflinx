import CompressionSavingsCalculator from "@/components/CompressionSavingsCalculator";

export const metadata = {
  title: "PDF Compression Savings Calculator | PDFLinx",
  description: "Calculate how much storage, bandwidth & money you save by compressing PDFs.",
};

export default function Page() {
  return <CompressionSavingsCalculator />;
}