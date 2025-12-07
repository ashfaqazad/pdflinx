import { notFound } from "next/navigation";
import { seoData } from "@/lib/seoData";

// 🔹 Lazy import map
const componentMap = {
  "pdf-to-word": () => import("@/components/tools/PdfToWord"),
  "word-to-pdf": () => import("@/components/tools/WordToPdf"),
  "image-to-pdf": () => import("@/components/tools/ImageToPdf"),
  "merge-pdf": () => import("@/components/tools/MergePdf"),
  "split-pdf": () => import("@/components/tools/SplitPdf"),
  "compress-pdf": () => import("@/components/tools/CompressPdf"),
  "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
  "qr-generator": () => import("@/components/tools/QrGenerator"),
  "password-gen": () => import("@/components/tools/PasswordGen"),
  "unit-converter": () => import("@/components/tools/UnitConverter"),
  "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
  "image-compressor": () => import("@/components/tools/ImageCompressor"),
  "image-to-text": () => import("@/components/tools/ImageToText"),
  "signature-maker": () => import("@/components/tools/SignatureMaker"),
  "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
  "text-to-pdf": () => import("@/components/tools/TextToPdf"),
};

// Dynamic Metadata – FIXED
export async function generateMetadata({ params }) {
  const { tool } = await params;    // ← YEHI CHANGE KI HAI
  const pageData = seoData[tool];
  if (!pageData) notFound();

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(", "),
  };
}

// Dynamic Page Loader – FIXED
export default async function ToolPage({ params }) {
  const { tool } = await params;    // ← YEHI CHANGE KI HAI
  const ComponentImport = componentMap[tool];
  if (!ComponentImport) notFound();

  const Component = (await ComponentImport()).default;
  return <Component />;
}