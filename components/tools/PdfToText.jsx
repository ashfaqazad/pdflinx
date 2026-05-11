"use client";

import { useState } from "react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileText,
  AlignLeft,
  Type,
  Copy,
  Minimize2,
  GitMerge,
  Scissors,
  FileImage,
  Search,
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
const DONE_LINKS = [
  { label: "PDF to Word",   href: "/pdf-to-word",   icon: <FileText   className="h-4 w-4 text-blue-500"    /> },
  { label: "PDF to PNG",    href: "/pdf-to-png",    icon: <FileImage  className="h-4 w-4 text-sky-500"     /> },
  { label: "PDF to JPG",    href: "/pdf-to-jpg",    icon: <FileImage  className="h-4 w-4 text-amber-500"   /> },
  { label: "Compress PDF",  href: "/compress-pdf",  icon: <Minimize2  className="h-4 w-4 text-green-500"   /> },
  { label: "OCR PDF",       href: "/ocr-pdf",       icon: <Search     className="h-4 w-4 text-purple-500"  /> },
  { label: "Merge PDF",     href: "/merge-pdf",     icon: <GitMerge   className="h-4 w-4 text-violet-500"  /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-emerald-800">
      ℹ️ Text Extraction Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Single PDF → TXT file directly</li>
      <li>Multiple PDFs → ZIP with all TXTs</li>
      <li>Works on text-based PDFs only</li>
      <li>Scanned PDFs need OCR instead</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Batch extraction",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
    <p className="font-semibold text-slate-800">📄 About this extraction</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ All text extracted from every page</li>
      <li>✓ Reading order preserved</li>
      <li>✓ Plain TXT output — works everywhere</li>
      <li>✓ Single PDF → TXT file directly</li>
      <li>✓ Multiple PDFs → ZIP with all TXTs</li>
      <li className="text-amber-600 font-medium">⚠️ Scanned PDFs need OCR — use OCR PDF tool</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────────────────────────────────────

export default function PdfToText({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("extracted_text.txt");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const getDownloadName = (contentType = "") => {
    if (flow.files.length === 1) {
      return flow.files[0]?.name
        ? flow.files[0].name.replace(/\.pdf$/i, contentType.includes("zip") ? "_texts.zip" : ".txt")
        : "extracted_text.txt";
    }
    return "pdf_to_text_batch.zip";
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── API LOGIC ──────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length)
      return alert("Please select at least one PDF file!");

    flow.startProcessing();
    startProgress();
    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/pdf-to-text", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Extraction failed");
      }

      const contentType = res.headers.get("content-type") || "";
      const disposition = res.headers.get("content-disposition") || "";

      let filename = getDownloadName(contentType);
      if (disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(filename);

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError(err.message || "Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ──────────────────────────────────────────────────────

  return (
    <>
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-pdf-text"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Extract Text from PDF Online for Free",
            description: "Extract text from PDF files online free — no signup, no watermark. Copy or download plain text from any PDF in seconds. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/pdf-to-text",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select one or multiple PDF files from your device." },
              { "@type": "HowToStep", name: "Click Extract Text", text: "Wait a few seconds — all text is extracted from every page." },
              { "@type": "HowToStep", name: "Download TXT", text: "Auto download starts — single TXT file or ZIP for batch." },
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-pdf-text"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to Text", item: "https://pdflinx.com/pdf-to-text" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-pdf-text"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the PDF to Text converter free?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx PDF to Text extractor is completely free — no hidden charges, no subscription, no account required." } },
              { "@type": "Question", name: "What kind of PDFs can I extract text from?", acceptedAnswer: { "@type": "Answer", text: "Any text-based PDF — reports, articles, research papers, invoices, contracts, ebooks. Scanned PDFs (image-only) require OCR and may not extract cleanly." } },
              { "@type": "Question", name: "Can I extract text from multiple PDFs at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual TXT files or a single ZIP download." } },
              { "@type": "Question", name: "Will the extracted text keep formatting?", acceptedAnswer: { "@type": "Answer", text: "The output is plain text (.txt) — formatting like bold, tables, and columns is removed. Text content, paragraphs, and reading order are preserved as closely as possible." } },
              { "@type": "Question", name: "Are my uploaded PDF files safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "PDF to Text Extractor (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf,.pdf"
        multiple={true}
        convertLabel="Extract Text"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}

        optionsTitle="Extraction options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={OPTIONS_SLOT}

        processingTitle="Extracting Text from Your PDF"
        processingDescription="Please wait while we read all pages and extract plain text content."
        processingStages={["Uploading file", "Reading pages", "Extracting text"]}

        doneTitle="Your text file is ready"
        doneDescription={
          flow.files.length > 1
            ? "All PDFs processed. ZIP contains one TXT file per document."
            : "All text extracted from your PDF successfully."
        }
        doneFileName={downloadName}
        downloadLabel="Download TXT"
        resetLabel="Extract from another PDF"

        sidebarTitle="PDF to Text"
        sidebarIcon={<AlignLeft className="h-5 w-5 text-emerald-500" />}
        sidebarDescription="Extract plain text from any PDF — every page, in reading order, free and instant."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        uploadLanding={{
          content: {
            eyebrow: "PDF TO TEXT EXTRACTOR",

            heroTitle: (
              <>
                Extract Text from PDF <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Instantly & Free 📄
                </span>
              </>
            ),

            heroDescription:
              "Pull all text from any PDF in seconds — clean plain TXT output, reading order preserved. Single PDF downloads as TXT. Multiple PDFs download as ZIP. No signup, no watermark, completely free.",

            bullets: [
              "All text extracted from every page in reading order",
              "Plain TXT output — works in every text editor and tool",
              "Batch extract from multiple PDFs at once",
            ],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            privacyTitle: "Your files stay private",
            privacyText: "Files are processed securely and automatically deleted after extraction. Never stored or shared.",

            noticeTitle: "PDF to Text Output",
            noticeItems: [
              "Single PDF → TXT file directly",
              "Multiple PDFs → ZIP with all TXTs",
              "Scanned PDFs → use OCR PDF instead",
            ],

            breadcrumbItems: [
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "PDF to Text" },
            ],

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            supports: [
              "Supports text-based PDF files",
              "Auto-deleted after 1 hour",
            ],

            howToTitle: "How to Extract Text from PDF",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File(s)",
                desc: "Select one PDF or upload multiple PDFs for batch extraction. Drag and drop supported on all devices.",
                color: "bg-emerald-600",
              },
              {
                n: "2",
                title: "Text Extracted Automatically",
                desc: "PDFLinx reads every page of your PDF and extracts all text in reading order — paragraphs, headings, and body content preserved as plain TXT.",
                color: "bg-teal-600",
              },
              {
                n: "3",
                title: "Download TXT or ZIP",
                desc: "Single PDF downloads as one TXT file directly. Multiple PDFs download as a ZIP with one TXT file per document.",
                color: "bg-cyan-600",
              },
            ],

            visualImage: "/images/pdf-to-text-visual.png",
            visualAlt: "PDF to Text extraction illustration",

            whyTitle: "Why Choose PDFLinx PDF to Text?",

            whyItems: [
              {
                title: "Clean Text Extraction",
                desc: "Every PDF page scanned and all text extracted in reading order — paragraphs, headings, and body content preserved as clean plain TXT.",
                icon: AlignLeft,
                iconColor: "text-emerald-500",
                bgColor: "bg-emerald-50",
              },
              {
                title: "Smart Download",
                desc: "Single PDF downloads as one TXT directly. Multiple PDFs download as ZIP with one TXT per document — no manual work needed.",
                icon: FileText,
                iconColor: "text-teal-500",
                bgColor: "bg-teal-50",
              },
              {
                title: "Batch Extraction",
                desc: "Upload multiple PDFs at once — each processed separately and delivered as individual TXT files inside a single ZIP download.",
                icon: Copy,
                iconColor: "text-cyan-500",
                bgColor: "bg-cyan-50",
              },
              {
                title: "Works on Any Device",
                desc: "Extract PDF text on iPhone, Android, Windows, or Mac — no software installation needed. Fully browser-based.",
                icon: Type,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },
            ],

            relatedTitle: "You Might Also Need",

            relatedTools: [
              { label: "PDF to Word",   href: "/pdf-to-word",   desc: "Convert PDF to editable DOCX",      icon: FileText,   iconColor: "text-blue-500",    bgColor: "bg-blue-50"    },
              { label: "OCR PDF",       href: "/ocr-pdf",       desc: "Make scanned PDFs searchable",       icon: Search,     iconColor: "text-purple-500",  bgColor: "bg-purple-50"  },
              { label: "PDF to PNG",    href: "/pdf-to-png",    desc: "Convert PDF pages to PNG images",    icon: FileImage,  iconColor: "text-sky-500",     bgColor: "bg-sky-50"     },
              { label: "PDF to JPG",    href: "/pdf-to-jpg",    desc: "Convert PDF pages to JPG images",    icon: FileImage,  iconColor: "text-amber-500",   bgColor: "bg-amber-50"   },
              { label: "Compress PDF",  href: "/compress-pdf",  desc: "Reduce PDF file size",              icon: Minimize2,  iconColor: "text-green-500",   bgColor: "bg-green-50"   },
              { label: "Merge PDF",     href: "/merge-pdf",     desc: "Combine multiple PDFs",             icon: GitMerge,   iconColor: "text-violet-500",  bgColor: "bg-violet-50"  },
            ],

            faqTitle: "Frequently Asked Questions",

            faqs: [
              { q: "Is the PDF to Text extractor free?", a: "Yes. PDFLinx PDF to Text extractor is completely free — no hidden charges, no subscription, no premium tier required." },
              { q: "Do I need to install any software?", a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed." },
              { q: "What type of PDFs can I extract text from?", a: "Any text-based PDF — reports, articles, research papers, invoices, contracts, ebooks. The PDF must contain a real text layer, not just scanned images." },
              { q: "Why is my extracted text garbled or missing?", a: "This usually means your PDF is a scanned document (image-based) with no embedded text layer. Use the OCR PDF tool instead to extract text from scanned PDFs." },
              { q: "Will the extracted text keep its formatting?", a: "The output is plain text (.txt) — visual formatting like bold, tables, and columns is not preserved. Text content and paragraph order are extracted as closely as possible to the reading order." },
              { q: "How does the download work for single vs multiple PDFs?", a: "Single PDF downloads as one TXT file directly. Multiple PDFs download as a ZIP file containing one TXT file per document, named to match the original PDF filenames." },
              { q: "Can I extract text from multiple PDFs at once?", a: "Yes. Upload multiple PDFs simultaneously — each processed separately and delivered as individual TXT files inside a single ZIP download." },
              { q: "What is the difference between PDF to Text and PDF to Word?", a: "PDF to Text gives raw plain text — no formatting, smallest file size, works everywhere. PDF to Word attempts to preserve headings, tables, and layout in an editable DOCX file — better when you need to edit the document structure." },
              { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties." },
              { q: "Can I extract text from a PDF on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required." },
            ],

            ctaBadge: "✦ 100% Free",
            ctaTitle: "Extract Text from Your PDF Now",
            ctaDescription: "Fast. Secure. Private. No sign up required.",
            ctaSubtext: "No limits. No hidden charges.",
            ctaButton: "Choose PDF File",

            seoSections: [
              {
                title: "Free PDF to Text Extractor — Extract Plain Text from Any PDF Instantly",
                text: "Need to copy text from a PDF without retyping everything manually? PDFLinx pulls all text from your PDF documents in seconds — clean, readable plain text ready to paste into any editor, document, or tool. No software installation, no watermarks, no sign-up required.",
              },
              {
                title: "How PDF Text Extraction Works",
                text: "PDFLinx automatically reads every page of your PDF and extracts all embedded text in reading order. A single-page PDF downloads as one TXT directly. A multi-page PDF or batch of PDFs downloads as a ZIP containing one TXT per document.",
              },
              {
                title: "PDF to Text vs PDF to Word — Which to Use?",
                text: "PDF to Text gives raw plain text — no formatting, tiny file size, works in every text editor. Best for data pipelines, AI tools, copy-pasting content, or research. PDF to Word attempts to preserve headings, tables, and layout in an editable DOCX — better when you need to edit the document structure.",
              },
              {
                title: "Privacy and File Security",
                text: "Uploaded PDF files are processed securely and permanently deleted after extraction — never stored long-term, never shared with third parties. No account creation required. Your documents remain completely private.",
              },
            ],

            showPdfTypes: false,
          },
        }}
      />
    </>
  );
}



























// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileText, Type, AlignLeft, Copy } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";

// export default function PdfToText() {
//   const [files, setFiles] = useState([]);
//   const [success, setSuccess] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [downloadFilename, setDownloadFilename] = useState("extracted_text");

//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) return;
//     setFiles(selectedFiles);
//     setSuccess(false);
//     setDownloadUrl("");
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = downloadFilename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return alert("Please select at least one PDF file!");

//     setIsLoading(true);
//     setSuccess(false);
//     setProgress(0);

//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     let progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 88) return prev;
//         const increment = prev < 40 ? 8 : prev < 70 ? 5 : 2;
//         return prev + increment;
//       });
//     }, 300);

//     try {
//       const res = await fetch("/convert/pdf-to-text", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         alert("Conversion failed: " + errorText);
//         setIsLoading(false);
//         clearInterval(progressInterval);
//         return;
//       }

//       clearInterval(progressInterval);
//       setProgress(100);

//       const blob = await res.blob();
//       const contentType = res.headers.get("content-type");
//       const disposition = res.headers.get("content-disposition");
//       let filename = "extracted_text";

//       if (disposition && disposition.includes("filename=")) {
//         filename = disposition.split("filename=")[1].replace(/"/g, "");
//       } else if (files.length === 1) {
//         filename = files[0].name.replace(/\.pdf$/i, contentType.includes("zip") ? "_texts.zip" : ".txt");
//       } else {
//         filename = "pdf_to_text_batch.zip";
//       }

//       const url = window.URL.createObjectURL(blob);
//       setDownloadUrl(url);
//       setDownloadFilename(filename);

//       // Auto download
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);

//       setSuccess(true);

//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       clearInterval(progressInterval);
//       setTimeout(() => {
//         setIsLoading(false);
//         setProgress(0);
//       }, 800);
//     }
//   };

//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-pdf-text"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Extract Text from PDF Online for Free",
//             description: "Extract text from PDF files online free — no signup, no watermark. Copy or download plain text from any PDF in seconds. Works on Windows, Mac, Android, iOS.",
//             url: "https://pdflinx.com/pdf-to-text",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select one or multiple PDF files from your device." },
//               { "@type": "HowToStep", name: "Click Extract Text", text: "Wait a few seconds — all text is extracted from every page." },
//               { "@type": "HowToStep", name: "Download TXT", text: "Auto download starts — single TXT file or ZIP for batch." },
//             ],
//             totalTime: "PT20S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-pdf-text"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF to Text", item: "https://pdflinx.com/pdf-to-text" },
//             ],
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="faq-schema-pdf-text"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               {
//                 "@type": "Question",
//                 name: "Is the PDF to Text converter free?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. PDFLinx PDF to Text extractor is completely free — no hidden charges, no subscription, no account required.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "What kind of PDFs can I extract text from?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Any text-based PDF — reports, articles, research papers, invoices, contracts, ebooks. Scanned PDFs (image-only) require OCR and may not extract cleanly.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Can I extract text from multiple PDFs at once?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual TXT files or a single ZIP download.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Will the extracted text keep formatting?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "The output is plain text (.txt) — formatting like bold, tables, and columns is removed. Text content, paragraphs, and reading order are preserved as closely as possible.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Are my uploaded PDF files safe?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties.",
//                 },
//               },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
//               Extract Text from PDF Online Free
//               <br />
//               <span className="text-2xl md:text-3xl font-medium">
//                 No Signup · No Watermark · Instant Download
//               </span>
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Extract text from PDF files online free — no signup, no watermark, no software needed.
//               Copy or download plain text from any PDF in seconds. Supports single and batch PDF
//               text extraction. Works on Windows, Mac, Android and iOS.
//             </p>
//           </div>

//           {/* Step Strip */}
//           <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
//             {[
//               { n: "1", label: "Upload PDF", sub: "Single or multiple files" },
//               { n: "2", label: "Extract Text", sub: "All pages processed" },
//               { n: "3", label: "Download TXT", sub: "Or ZIP for batch" },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
//               >
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
//                   {s.n}
//                 </div>
//                 <p className="text-xs font-semibold text-gray-700">{s.label}</p>
//                 <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
//               </div>
//             ))}
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

//             <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

//               {/* Loading Overlay */}
//               {isLoading && (
//                 <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
//                   <div className="relative w-16 h-16">
//                     <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
//                     <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
//                     <div
//                       className="absolute inset-2 rounded-full border-4 border-teal-200 border-b-transparent animate-spin"
//                       style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
//                     ></div>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-base font-semibold text-gray-700">
//                       Extracting text from your file{files.length > 1 ? "s" : ""}…
//                     </p>
//                     <p className="text-sm text-gray-400 mt-1">
//                       {progress < 30 ? "Uploading…" : progress < 70 ? "Reading pages…" : "Almost done…"}
//                     </p>
//                   </div>
//                   <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-400 font-medium">{progress}%</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="p-8 space-y-5">

//                 {/* Dropzone */}
//                 <label className="block cursor-pointer group">
//                   <div
//                     className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
//                       files.length
//                         ? "border-green-400 bg-green-50"
//                         : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40"
//                     }`}
//                   >
//                     <div
//                       className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
//                         files.length ? "bg-green-100" : "bg-emerald-50 group-hover:bg-emerald-100"
//                       }`}
//                     >
//                       {files.length ? (
//                         <CheckCircle className="w-7 h-7 text-green-500" />
//                       ) : (
//                         <AlignLeft className="w-7 h-7 text-emerald-600" />
//                       )}
//                     </div>

//                     {files.length ? (
//                       <>
//                         <p className="text-base font-semibold text-green-700">
//                           {files.length} file{files.length > 1 ? "s" : ""} selected
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">Click to change selection</p>
//                         <div className="flex flex-wrap justify-center gap-2 mt-3">
//                           {files.slice(0, 5).map((f, i) => (
//                             <span
//                               key={i}
//                               className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
//                             >
//                               <FileText className="w-3 h-3" />
//                               {f.name.length > 24 ? f.name.slice(0, 22) + "…" : f.name}
//                             </span>
//                           ))}
//                           {files.length > 5 && (
//                             <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
//                               +{files.length - 5} more
//                             </span>
//                           )}
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <p className="text-base font-semibold text-gray-700">
//                           Drop your PDF file(s) here
//                         </p>
//                         <p className="text-sm text-gray-400 mt-1">
//                           or click to browse · PDF files only
//                         </p>
//                         <div className="flex flex-wrap justify-center gap-2 mt-4">
//                           {["✓ No signup", "✓ No watermark", "✓ Plain TXT output", "✓ Auto-deleted"].map((t) => (
//                             <span
//                               key={t}
//                               className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium px-2.5 py-1 rounded-full"
//                             >
//                               {t}
//                             </span>
//                           ))}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     multiple
//                     accept="application/pdf,.pdf"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>

//                 {/* Info row + Convert Button */}
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
//                   <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
//                     <Type className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-700 leading-none">Plain text extracted from all pages</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         Single PDF → TXT file · Multiple PDFs → ZIP download
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={!files.length || isLoading}
//                     className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
//                       files.length && !isLoading
//                         ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 hover:shadow-md active:scale-[0.98]"
//                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                     }`}
//                   >
//                     <AlignLeft className="w-4 h-4" />
//                     Extract Text
//                   </button>
//                 </div>

//                 {/* Hints */}
//                 <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
//                   <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
//                   <p>💡 Works best with text-based PDFs · Scanned PDFs may need OCR</p>
//                 </div>

//               </form>
//             </div>

//             {/* Success State */}
//             {success && (
//               <div
//                 id="download-section"
//                 className="mx-6 mb-6 rounded-2xl overflow-hidden border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
//               >
//                 <div className="flex flex-col items-center text-center px-8 py-10">
//                   <div className="relative w-16 h-16 mb-5">
//                     <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
//                     <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
//                       <CheckCircle className="w-8 h-8 text-white" />
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-bold text-emerald-800 mb-1">
//                     Done! Your text file{files.length > 1 ? "s" : ""} downloaded automatically 🎉
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-6">
//                     Check your downloads — TXT file contains all extracted text from your PDF.
//                   </p>
//                   <div className="flex flex-wrap gap-3 justify-center">
//                     <button
//                       onClick={() => { setSuccess(false); setFiles([]); }}
//                       className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
//                     >
//                       <FileText className="w-4 h-4" />
//                       Extract from another PDF
//                     </button>
//                     <a
//                       href="/pdf-to-png"
//                       className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
//                     >
//                       PDF to PNG →
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>

//           {/* Footer Trust Bar */}
//           <p className="text-center mt-6 text-gray-500 text-sm">
//             No account • No watermark • Auto-deleted after 1 hour • 100% free •
//             Plain TXT output • Works on Windows, Mac, Android &amp; iOS
//           </p>

//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
//             Free PDF to Text Extractor — Extract Plain Text from Any PDF Instantly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Need to extract text from a PDF file? Convert here — every page scanned and all
//             text extracted as a clean plain TXT file. Single PDF downloads directly. Multiple
//             PDFs download as a ZIP. Fast, free, and privacy-friendly on PDFLinx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlignLeft className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Clean Text Extraction</h3>
//             <p className="text-gray-600 text-sm">
//               Every PDF page scanned and all text extracted in reading order —
//               paragraphs, headings, and body content preserved as plain TXT.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg border border-teal-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Download</h3>
//             <p className="text-gray-600 text-sm">
//               Single PDF downloads as one TXT file directly. Multiple PDFs
//               download as a ZIP containing one TXT file per document.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl shadow-lg border border-cyan-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Extraction</h3>
//             <p className="text-gray-600 text-sm">
//               Upload one PDF or multiple PDFs at once — each processed
//               separately with no signup, no watermark required.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             How to Extract Text from PDF — 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
//               <p className="text-gray-600 text-sm">
//                 Select one PDF or upload multiple PDFs at once for batch
//                 text extraction. Drag and drop supported on all devices.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
//               <h4 className="text-lg font-semibold mb-2">Click Extract Text</h4>
//               <p className="text-gray-600 text-sm">
//                 Hit Extract and wait a few seconds — all text from every
//                 page is pulled out and saved as a clean plain TXT file.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
//               <h4 className="text-lg font-semibold mb-2">Download TXT or ZIP</h4>
//               <p className="text-gray-600 text-sm">
//                 Single PDF downloads as TXT directly. Batch PDFs download
//                 as ZIP with one TXT file per document inside.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Contextual Links */}
//         <div className="mt-10 bg-white p-6 md:p-8 shadow-sm rounded-xl border border-gray-100">
//           <h3 className="text-lg md:text-xl font-bold text-slate-900">Need to do more with your PDF?</h3>
//           <p className="mt-1 text-sm text-slate-600">
//             After extracting text from your PDF, these tools can help you work with your documents.
//           </p>
//           <ul className="mt-4 space-y-2 text-sm">
//             <li>
//               <a href="/pdf-to-png" className="text-emerald-700 font-semibold hover:underline">PDF to PNG</a>{" "}
//               <span className="text-slate-600">— convert PDF pages to lossless PNG images for design work.</span>
//             </li>
//             <li>
//               <a href="/pdf-to-jpg" className="text-emerald-700 font-semibold hover:underline">PDF to JPG</a>{" "}
//               <span className="text-slate-600">— convert PDF pages to JPG format for smaller file sizes.</span>
//             </li>
//             <li>
//               <a href="/compress-pdf" className="text-emerald-700 font-semibold hover:underline">Compress PDF</a>{" "}
//               <span className="text-slate-600">— reduce PDF file size before sharing or extracting content.</span>
//             </li>
//             <li>
//               <a href="/pdf-to-word" className="text-emerald-700 font-semibold hover:underline">PDF to Word</a>{" "}
//               <span className="text-slate-600">— convert PDF to an editable DOCX file with formatting preserved.</span>
//             </li>
//             <li>
//               <a href="/free-pdf-tools" className="text-emerald-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
//               <span className="text-slate-600">— merge, split, compress, convert &amp; more.</span>
//             </li>
//           </ul>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Trusted by students, developers, researchers, and professionals to extract
//           clean text from PDF files — fast, reliable, and always free.
//         </p>
//       </section>

//       {/* ==================== DEEP SEO CONTENT ==================== */}
//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PDF to Text Extractor – Free Online Tool by PDFLinx
//         </h2>

//         <p className="text-base leading-7 mb-6">
//           Need to copy text from a PDF without retyping everything manually? The{" "}
//           <span className="font-medium text-slate-900">PDFLinx PDF to Text Extractor</span>{" "}
//           pulls all text from your PDF documents in seconds — clean, readable plain text ready
//           to paste into any editor, document, or tool. No software installation, no watermarks,
//           no sign-up required. Works on any device, any browser.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What Is PDF Text Extraction?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF text extraction reads the embedded text layer inside a PDF document and outputs
//           it as plain text (.txt). Unlike copy-paste from a PDF viewer (which often breaks
//           formatting or misses text), a proper extractor reads all pages in sequence and
//           preserves reading order. Ideal for research, data processing, content reuse,
//           accessibility, and any workflow where you need the raw text content of a PDF.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           PDF to Text vs PDF to Word — Which Should You Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           <strong>PDF to Text (.txt)</strong> gives you raw plain text — no formatting, no
//           columns, no tables. Best for data pipelines, copy-pasting content, feeding text into
//           AI tools, or when you just need the words. File size is tiny and the output works
//           in every text editor.{" "}
//           <strong>PDF to Word (.docx)</strong> attempts to preserve formatting, headings,
//           tables, and layout in an editable document — better when you need to edit the
//           document and keep its structure. If you need Word format instead, use the{" "}
//           <a href="/pdf-to-word" className="text-emerald-700 font-medium hover:underline">PDF to Word tool</a>.
//         </p>

//         <div className="mt-6 space-y-10">
//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               Common Use Cases for PDF Text Extraction
//             </h3>
//             <ul className="space-y-2 list-disc pl-6 leading-7">
//               <li><strong>Students and researchers:</strong> Extract text from academic papers, textbooks, and research articles for notes, citations, and summaries.</li>
//               <li><strong>Developers and data engineers:</strong> Feed PDF content into NLP pipelines, AI models, search indexes, or databases without manual copying.</li>
//               <li><strong>Content writers:</strong> Extract reference text from PDFs to repurpose, summarize, or rewrite for articles and blog posts.</li>
//               <li><strong>Legal and compliance teams:</strong> Extract contract or policy text for review, comparison, or searchable archiving.</li>
//               <li><strong>Accessibility:</strong> Convert PDF content to plain text for screen readers, text-to-speech tools, or accessible document formats.</li>
//               <li><strong>Business professionals:</strong> Pull invoice data, report content, or presentation notes from PDFs into editable formats quickly.</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">Privacy and File Security</h3>
//             <p className="leading-7">
//               PDFLinx is built with privacy as a core priority. Uploaded PDF files are
//               processed securely and <strong>permanently deleted after conversion</strong> —
//               never stored long-term, never shared with third parties. No account creation
//               required — no email, no password, no personal data collected.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">Extract Text from PDF on Any Device</h3>
//             <p className="leading-7">
//               PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in
//               any modern browser. No app download, no software installation required. Extract
//               text from PDF files in seconds from any device, anywhere.
//             </p>
//           </div>
//         </div>

//         {/* Comparison Table */}
//         <div className="overflow-x-auto my-10">
//           <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
//             <thead className="bg-emerald-50 text-emerald-800 font-semibold">
//               <tr>
//                 <th className="px-4 py-3">Feature</th>
//                 <th className="px-4 py-3">PDF to Text (.txt)</th>
//                 <th className="px-4 py-3">PDF to Word (.docx)</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {[
//                 ["Output format", "Plain text (.txt)", "Editable document (.docx)"],
//                 ["Formatting preserved", "❌ Plain text only", "✅ Headers, tables, layout"],
//                 ["Best for", "Data, AI, copy-paste, research", "Editing, rewriting, documents"],
//                 ["File size", "Very small", "Larger"],
//                 ["Universal compatibility", "✅ Every text editor", "✅ Word, Google Docs"],
//                 ["Speed", "✅ Fastest", "⚠️ Slightly slower"],
//               ].map(([feature, txt, docx], i) => (
//                 <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                   <td className="px-4 py-3 font-medium">{feature}</td>
//                   <td className="px-4 py-3 text-emerald-700">{txt}</td>
//                   <td className="px-4 py-3 text-gray-600">{docx}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use This Tool?</h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Students:</strong> Extract text from research papers, textbooks, and lecture slides for notes and citations</li>
//           <li><strong>Developers:</strong> Parse PDF content for NLP, search indexing, AI training, or data pipelines</li>
//           <li><strong>Content creators:</strong> Pull source material from PDFs to summarize or rewrite for blogs and articles</li>
//           <li><strong>Legal teams:</strong> Extract contract text for review, redlining, or compliance archiving</li>
//           <li><strong>Business professionals:</strong> Copy invoice, report, or presentation data without manual retyping</li>
//           <li><strong>Accessibility users:</strong> Convert PDF content to plain text for screen readers and assistive tools</li>
//         </ul>
//       </section>

//       {/* ==================== FAQ SECTION ==================== */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-4">
//             {[
//               { q: "Is the PDF to Text extractor free to use?", a: "Yes. PDFLinx PDF to Text extractor is completely free — no hidden charges, no subscription, no premium tier required." },
//               { q: "Do I need to install any software?", a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed." },
//               { q: "What type of PDFs can I extract text from?", a: "Any text-based PDF — reports, articles, research papers, invoices, contracts, ebooks. The PDF must contain a real text layer, not just scanned images." },
//               { q: "Why is my extracted text garbled or missing?", a: "This usually means your PDF is a scanned document (image-based) with no embedded text layer. Scanned PDFs require OCR (Optical Character Recognition) to extract text — plain extraction won't work on image-only PDFs." },
//               { q: "Will the extracted text keep its formatting?", a: "The output is plain text (.txt) — visual formatting like bold, tables, and multi-column layouts is not preserved. Text content and paragraph order are extracted as closely as possible to the reading order." },
//               { q: "How does the download work for single vs multiple PDFs?", a: "Single PDF downloads as one TXT file directly. Multiple PDFs download as a ZIP file containing one TXT file per document, named to match the original PDF filenames." },
//               { q: "Can I extract text from multiple PDFs at once?", a: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual TXT files inside a single ZIP download." },
//               { q: "What is the difference between PDF to Text and PDF to Word?", a: "PDF to Text gives you raw plain text — no formatting, smallest file size, works everywhere. PDF to Word attempts to preserve headings, tables, and layout in an editable DOCX file — better when you need to edit the document structure." },
//               { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties." },
//               { q: "Can I extract text from a PDF on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required." },
//             ].map((faq, i) => (
//               <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                 <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
//                   {faq.q}
//                   <span className="text-emerald-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
//                 </summary>
//                 <p className="mt-2 text-gray-600">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="pdf-to-text" />
//     </>
//   );
// }