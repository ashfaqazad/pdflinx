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

// 🔹 Dynamic Metadata
// export async function generateMetadata({ params }) {
//   const { tool } = params;
//   const pageData = seoData[tool];
//   if (!pageData) notFound();

//   return {
//     title: pageData.title,
//     description: pageData.description,
//     keywords: pageData.keywords.join(", "),
//   };
// }

export async function generateMetadata({ params }) {
  const { tool } = params;
  const pageData = seoData[tool];
  if (!pageData) notFound();

  return {
    metadataBase: new URL("https://www.pdflinx.com"),
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(", "),
    alternates: {
      canonical: pageData.canonical,
    },
    openGraph: pageData.openGraph,
    // twitter: {
    //   card: "summary_large_image",
    //   title: pageData.openGraph.title,
    //   description: pageData.openGraph.description,
    //   images: pageData.openGraph.images,
    // },
    twitter: {
      card: "summary_large_image",
      title: pageData.openGraph.title,
      description: pageData.openGraph.description,
      images: pageData.openGraph.images,  // Ye already array of objects hai seoData mein → perfect
    },
  };
}

// 🔹 Dynamic Page Loader
export default async function ToolPage({ params }) {
  const { tool } = params;
  const ComponentImport = componentMap[tool];
  if (!ComponentImport) notFound();

  const Component = (await ComponentImport()).default;
  return <Component />;
}

