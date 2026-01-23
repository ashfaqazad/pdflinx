import { notFound } from "next/navigation";
import { seoData } from "@/lib/seoData";

// 🔹 Lazy import map (same as before – perfect)
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
  "image-converter": () => import("@/components/tools/ImageConverter"),
  "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
  "add-watermark": () => import("@/components/tools/AddWatermark"),
  "ppt-to-pdf": () => import("@/components/tools/PptToPdf"),

};


// "rotate-pdf": () => import("@/components/tools/RotatePdf"),
  // "protect-pdf": () => import("@/components/tools/ProtectPdf"),
  // "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
  // "pdf-to-excel": () => import("@/components/tools/PdfToExcel"),

export async function generateMetadata({ params }) {
  const { tool } = params;
  const pageData = seoData[tool];
  if (!pageData) notFound();

  return {
    // ✅ Fix 1: non-www base URL
    metadataBase: new URL("https://pdflinx.com"),
    
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(", "),
    
    alternates: {
      canonical: pageData.canonical,  // Relative "/pdf-to-word" → automatically https://pdflinx.com/pdf-to-word banega
    },
    
    openGraph: {
      ...pageData.openGraph,
      // ✅ Fix 2: Ensure images have full non-www URL (safety)
      images: pageData.openGraph.images.map(img => ({
        ...img,
        url: img.url.startsWith("http") ? img.url : "https://pdflinx.com" + img.url,
      })),
    },
    
    twitter: {
      card: "summary_large_image",
      title: pageData.openGraph.title,
      description: pageData.openGraph.description,
      // ✅ Fix 3: Twitter expects array of strings or objects with url
      images: pageData.openGraph.images.map(img => 
        img.url.startsWith("http") ? img.url : "https://pdflinx.com" + img.url
      ),
    },
  };
}

// 🔹 Dynamic Page Loader (unchanged – perfect)
export default async function ToolPage({ params }) {
  const { tool } = params;
  const ComponentImport = componentMap[tool];
  if (!ComponentImport) notFound();

  const Component = (await ComponentImport()).default;
  return <Component />;
}



















// import { notFound } from "next/navigation";
// import { seoData } from "@/lib/seoData";

// // 🔹 Lazy import map
// const componentMap = {
//   "pdf-to-word": () => import("@/components/tools/PdfToWord"),
//   "word-to-pdf": () => import("@/components/tools/WordToPdf"),
//   "image-to-pdf": () => import("@/components/tools/ImageToPdf"),
//   "merge-pdf": () => import("@/components/tools/MergePdf"),
//   "split-pdf": () => import("@/components/tools/SplitPdf"),
//   "compress-pdf": () => import("@/components/tools/CompressPdf"),
//   "excel-pdf": () => import("@/components/tools/ExcelToPdf"),
//   "qr-generator": () => import("@/components/tools/QrGenerator"),
//   "password-gen": () => import("@/components/tools/PasswordGen"),
//   "unit-converter": () => import("@/components/tools/UnitConverter"),
//   "youtube-thumbnail": () => import("@/components/tools/YoutubeThumbnail"),
//   "image-compressor": () => import("@/components/tools/ImageCompressor"),
//   "image-to-text": () => import("@/components/tools/ImageToText"),
//   "signature-maker": () => import("@/components/tools/SignatureMaker"),
//   "heic-to-jpg": () => import("@/components/tools/HeicToJpg"),
//   "text-to-pdf": () => import("@/components/tools/TextToPdf"),
//   "image-converter": () => import("@/components/tools/ImageConverter"),
//   "rotate-pdf": () => import("@/components/tools/RotatePdf"),
//   "pdf-to-jpg": () => import("@/components/tools/PdfToJpg"),
//   "add-watermark": () => import("@/components/tools/AddWatermark"),
//   "protect-pdf": () => import("@/components/tools/ProtectPdf"),
// };


// export async function generateMetadata({ params }) {
//   const { tool } = params;
//   const pageData = seoData[tool];
//   if (!pageData) notFound();

//   return {
//     // metadataBase: new URL("https://pdflinx.com"),
//     metadataBase: new URL("https://pdflinx.com"),
//     title: pageData.title,
//     description: pageData.description,
//     keywords: pageData.keywords.join(", "),
//     alternates: {
//       canonical: pageData.canonical,
//     },
//     openGraph: pageData.openGraph,
//     twitter: {
//       card: "summary_large_image",
//       title: pageData.openGraph.title,
//       description: pageData.openGraph.description,
//       images: pageData.openGraph.images,  // Ye already array of objects hai seoData mein → perfect
//     },
//   };
// }

// // 🔹 Dynamic Page Loader
// export default async function ToolPage({ params }) {
//   const { tool } = params;
//   const ComponentImport = componentMap[tool];
//   if (!ComponentImport) notFound();

//   const Component = (await ComponentImport()).default;
//   return <Component />;
// }

