"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
// import { CheckCircle, FileText, Type, Zap } from "lucide-react";
import {
  CheckCircle,
  FileText,
  Type,
  Zap,
  ShieldCheck,
  MonitorSmartphone,
  Lock,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

export default function AddWatermark() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [error, setError] = useState("");
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const file = flow.files?.[0] || null;

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-watermarked.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
  }, [file?.name]);

  const resetAll = () => {
    if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
    setWatermarkedUrl(null);
    setError("");
    setText("CONFIDENTIAL");
    setOpacity(0.3);
    flow.reset();
  };

  const handleRemoveFile = () => {
    resetAll();
  };

  const handleDownload = () => {
    if (!watermarkedUrl) return;
    const a = document.createElement("a");
    a.href = watermarkedUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a PDF file first!");
      return;
    }
    if (!text.trim()) {
      setError("Please enter watermark text!");
      return;
    }

    flow.startProcessing();
    startProgress();
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.max(42, Math.min(width, height) * 0.12);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.75, 0.75, 0.75),
          opacity,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
      setWatermarkedUrl(objectUrl);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      setError(
        "Oops! Something went wrong while adding the watermark. Please try again."
      );
      flow.handleError("Watermark failed. Please try again.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const customOptions = (
    <div className="mx-auto w-full max-w-[760px] space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Watermark settings</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add your text and adjust transparency.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Type className="h-4 w-4 text-slate-500" />
              Watermark text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., CONFIDENTIAL, DRAFT, SAMPLE"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="mt-2 w-full cursor-pointer accent-slate-600"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Script
        id="howto-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Watermark to PDF Online for Free",
            description: "Add text watermark to PDF pages instantly.",
            url: "https://pdflinx.com/add-watermark",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
              { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
            ]
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title="Add Watermark to PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Apply Watermark"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        customFilePreview={customOptions}
        doneTitle="Your watermarked PDF is ready"
        doneDescription="Click download to save your updated PDF."
        downloadLabel="Download Watermarked PDF"
        resetLabel="Watermark another PDF"
        sidebarTitle="Add Watermark"
        sidebarIcon={<FileText className="h-5 w-5 text-white" />}
        sidebarDescription="Add a clean watermark across every page — quick and free."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Watermark</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Applies across all pages</li>
              <li>Adjust text and opacity</li>
              <li>PDF output stays readable</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        // uploadLanding={true}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"

        uploadLanding={{
          content: {
            eyebrow: "ADD WATERMARK",

            heroTitle: (
              <>
                Add Watermark to PDF <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly
                </em>
              </>
            ),

            heroDescription:
              "Add watermark to PDF online for free using custom text like CONFIDENTIAL, DRAFT, SAMPLE, or your company name. Apply clean watermarks across every page instantly with no signup or software installation.",

            noticeTitle: "Watermark output",

            noticeItems: [
              "Single PDF → Watermarked PDF",
              "Custom text watermark",
              "Adjust opacity & visibility",
            ],

            howToTitle: "How to add watermark to PDF",

            howToSubtitle:
              "Upload your PDF, type the watermark text, customize the style, and download the updated file in seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Choose a PDF file from your device or drag & drop it into the uploader.",
                color: "bg-blue-600",
              },

              {
                n: "2",
                title: "Set watermark text & style",
                desc: "Type your watermark text and adjust opacity for a subtle and professional appearance.",
                color: "bg-purple-600",
              },

              {
                n: "3",
                title: "Apply & download",
                desc: "Apply the watermark across all pages and download your updated PDF instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx watermark tool?",

            whyItems: [
              {
                title: "Your Text, Your Way",
                desc: "Add any watermark text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
                icon: Type,
                iconColor: "text-gray-600",
                bgColor: "bg-gray-100",
              },

              {
                title: "Applies on Every Page",
                desc: "The watermark is automatically added across all pages of your PDF without extra editing work.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },

              {
                title: "Fast & Free",
                desc: "Add watermark to PDF online in seconds with no signup, no installation, and no hidden limits.",
                icon: Zap,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },

              {
                title: "Professional Watermarking",
                desc: "Create clean and subtle watermarks that protect your files without affecting readability.",
                icon: ShieldCheck,
                iconColor: "text-violet-600",
                bgColor: "bg-violet-100",
              },

              {
                title: "Works Everywhere",
                desc: "Use PDFLinx on Windows, macOS, Linux, Android, iPhone, tablet, or desktop browsers.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },

              {
                title: "Privacy Friendly",
                desc: "Your PDF files are processed securely and are not stored permanently after watermarking.",
                icon: Lock,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Watermark Guide",

            seoTitle:
              "Free Online Add Watermark to PDF Tool by PDFLinx",

            seoDescription:
              "Add text watermark to PDF online for free using custom labels like CONFIDENTIAL, DRAFT, SAMPLE, or company branding. Apply watermark across every page instantly.",

            seoSections: [
              {
                title: "Add Text Watermarks Across All PDF Pages",
                text: "PDFLinx lets you apply custom text watermarks to every page of your PDF automatically without editing pages one by one.",
              },

              {
                title: "Useful for Confidential and Draft Documents",
                text: "Add labels like CONFIDENTIAL, DRAFT, SAMPLE, INTERNAL, or DO NOT COPY to clearly mark document status and protect sensitive files.",
              },

              {
                title: "Protect Ownership and Branding",
                text: "Use watermarks to add your name, company, copyright text, or branding directly on PDF documents before sharing.",
              },

              {
                title: "Clean and Professional Watermark Output",
                text: "Adjust watermark visibility and opacity to create subtle, readable, and professional-looking PDF documents.",
              },

              {
                title: "Works on Mobile and Desktop Devices",
                text: "Use the PDFLinx watermark tool directly in your browser on Windows, macOS, Linux, Android, iPhone, and tablets.",
              },

              {
                title: "No Signup, No Watermark Ads",
                text: "Add watermark to PDF online for free with no account required, no software installation, and no extra branding added to your file.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: [
              {
                q: "Is the Add Watermark to PDF tool free?",
                a: "Yes. PDFLinx lets you add watermark to PDF online for free with unlimited usage and no signup required.",
              },

              {
                q: "Can I apply watermark on every page automatically?",
                a: "Yes. The watermark is added across all PDF pages automatically.",
              },

              {
                q: "What watermark text can I use?",
                a: "You can use any custom text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
              },

              {
                q: "Will watermark affect PDF readability?",
                a: "No. You can adjust opacity and placement to keep the watermark subtle and professional.",
              },

              {
                q: "Do I need to install software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },

              {
                q: "Can I use this tool on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },

              {
                q: "Are my uploaded PDFs secure?",
                a: "Yes. Files are processed securely and are not stored permanently after processing.",
              },

              {
                q: "Can I watermark contracts, reports, and study files?",
                a: "Yes. This tool is useful for contracts, reports, invoices, assignments, presentations, and many other PDF documents.",
              },
            ],
          },
        }}

      />

    </>
  );
}





























// "use client";

// import { useMemo, useState } from "react";
// import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
// import { CheckCircle, FileText, Type } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// export default function AddWatermark() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } =
//     useProgressBar();

//   const [text, setText] = useState("CONFIDENTIAL");
//   const [opacity, setOpacity] = useState(0.3);
//   const [error, setError] = useState("");
//   const [watermarkedUrl, setWatermarkedUrl] = useState(null);

//   const file = flow.files?.[0] || null;

//   const outputFilename = useMemo(() => {
//     if (!file?.name) return "pdflinx-watermarked.pdf";
//     return file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
//   }, [file?.name]);

//   const resetAll = () => {
//     if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
//     setWatermarkedUrl(null);
//     setError("");
//     setText("CONFIDENTIAL");
//     setOpacity(0.3);
//     flow.reset();
//   };

//   const handleRemoveFile = () => {
//     resetAll();
//   };

//   const handleDownload = () => {
//     if (!watermarkedUrl) return;
//     const a = document.createElement("a");
//     a.href = watermarkedUrl;
//     a.download = outputFilename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleConvert = async () => {
//     if (!file) {
//       setError("Please select a PDF file first!");
//       return;
//     }
//     if (!text.trim()) {
//       setError("Please enter watermark text!");
//       return;
//     }

//     flow.startProcessing();
//     startProgress();
//     setError("");

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//       const pages = pdfDoc.getPages();

//       pages.forEach((page) => {
//         const { width, height } = page.getSize();
//         const fontSize = Math.max(42, Math.min(width, height) * 0.12);
//         const textWidth = font.widthOfTextAtSize(text, fontSize);

//         page.drawText(text, {
//           x: (width - textWidth) / 2,
//           y: height / 2,
//           size: fontSize,
//           font,
//           color: rgb(0.75, 0.75, 0.75),
//           opacity,
//           rotate: degrees(-45),
//         });
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const objectUrl = URL.createObjectURL(blob);

//       if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
//       setWatermarkedUrl(objectUrl);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       setError(
//         "Oops! Something went wrong while adding the watermark. Please try again."
//       );
//       flow.handleError("Watermark failed. Please try again.");
//       // eslint-disable-next-line no-console
//       console.error(err);
//     }
//   };

//   const customOptions = (
//     <div className="mx-auto w-full max-w-[760px] space-y-5">
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h3 className="text-base font-bold text-slate-900">Watermark settings</h3>
//         <p className="mt-1 text-sm text-slate-500">
//           Add your text and adjust transparency.
//         </p>

//         <div className="mt-5 grid gap-4 md:grid-cols-2">
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//               <Type className="h-4 w-4 text-slate-500" />
//               Watermark text
//             </label>
//             <input
//               type="text"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="e.g., CONFIDENTIAL, DRAFT, SAMPLE"
//               className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-slate-700">
//               Opacity: {Math.round(opacity * 100)}%
//             </label>
//             <input
//               type="range"
//               min="0.1"
//               max="0.8"
//               step="0.1"
//               value={opacity}
//               onChange={(e) => setOpacity(parseFloat(e.target.value))}
//               className="mt-2 w-full cursor-pointer accent-slate-600"
//             />
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           <p className="font-semibold">{error}</p>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <Script
//         id="howto-schema-watermark"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Add Watermark to PDF Online for Free",
//             description: "Add text watermark to PDF pages instantly.",
//             url: "https://pdflinx.com/add-watermark",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
//               { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
//               { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-watermark"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
//             ]
//           }, null, 2),
//         }}
//       />

//       <ToolPageLayout
//         title="Add Watermark to PDF Online Free"
//         tagline="No Signup · No Watermark · Instant Download"
//         accept="application/pdf"
//         multiple={false}
//         convertLabel="Apply Watermark"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         customFilePreview={customOptions}
//         doneTitle="Your watermarked PDF is ready"
//         doneDescription="Click download to save your updated PDF."
//         downloadLabel="Download Watermarked PDF"
//         resetLabel="Watermark another PDF"
//         sidebarTitle="Add Watermark"
//         sidebarIcon={<FileText className="h-5 w-5 text-white" />}
//         sidebarDescription="Add a clean watermark across every page — quick and free."
//         sidebarNotice={
//           <>
//             <p className="text-sm font-semibold text-blue-800">ℹ️ Watermark</p>
//             <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
//               <li>Applies across all pages</li>
//               <li>Adjust text and opacity</li>
//               <li>PDF output stays readable</li>
//             </ul>
//           </>
//         }
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         // uploadLanding={true}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF files supported"

//         uploadLandingContent={{
//           eyebrow: "ADD WATERMARK",
//           heroTitle: (
//             <>
//               Add Watermark to PDF <br />
//               <em className="font-bold not-italic text-[#e8420a] sm:italic">
//                 instantly
//               </em>
//             </>
//           ),
//           heroDescription:
//             "Mark your PDFs as CONFIDENTIAL, DRAFT, SAMPLE (or any custom text) with a clean watermark across every page.",
//           noticeTitle: "Watermark output",
//           noticeItems: [
//             "Single PDF → Watermarked PDF",
//             "Text watermark",
//             "Adjust opacity",
//           ],
//           howToTitle: "How to add watermark to PDF",
//           howToSteps: [
//             {
//               n: "1",
//               title: "Upload your PDF",
//               desc: "Choose a PDF file from your device (drag & drop supported).",
//               color: "bg-blue-600",
//             },
//             {
//               n: "2",
//               title: "Set watermark text & opacity",
//               desc: "Type your watermark and adjust transparency for a subtle, professional look.",
//               color: "bg-purple-600",
//             },
//             {
//               n: "3",
//               title: "Apply & download",
//               desc: "Apply the watermark and download your updated PDF instantly.",
//               color: "bg-emerald-600",
//             },
//           ],
//         }}


//       />
            
//     </>
//   );
// }



























// // 'use client';

// // import { useState } from 'react';
// // import { PDFDocument, rgb } from 'pdf-lib';
// // import { Upload, Download, Type, CheckCircle } from 'lucide-react';
// // import Script from 'next/script';
// // import RelatedToolsSection from "@/components/RelatedTools";


// // export default function AddWatermark() {
// //   const [file, setFile] = useState(null);
// //   const [text, setText] = useState('CONFIDENTIAL');
// //   const [opacity, setOpacity] = useState(0.3);
// //   const [loading, setLoading] = useState(false);
// //   const [watermarkedUrl, setWatermarkedUrl] = useState(null);

// //   const addWatermark = async (e) => {
// //     const selected = e.target.files[0];
// //     if (!selected) return;
// //     setFile(selected);
// //   };

// //   const applyWatermark = async () => {
// //     if (!file || !text) return;
// //     setLoading(true);

// //     try {
// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdfDoc = await PDFDocument.load(arrayBuffer);
// //       const pages = pdfDoc.getPages();

// //       pages.forEach((page) => {
// //         const { width, height } = page.getSize();
// //         page.drawText(text, {
// //           x: width / 2 - 100,
// //           y: height / 2,
// //           size: 80,
// //           color: rgb(0.8, 0.8, 0.8),
// //           opacity: opacity,
// //           rotate: { type: 'degrees', angle: -45 },
// //         });
// //       });

// //       const pdfBytes = await pdfDoc.save();
// //       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// //       setWatermarkedUrl(URL.createObjectURL(blob));
// //     } catch (err) {
// //       alert('Error adding watermark');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <>
// //       <Script
// //         id="howto-schema-watermark"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Add Watermark to PDF Online for Free",
// //             description: "Add text watermark to PDF pages instantly.",
// //             url: "https://pdflinx.com/add-watermark",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
// //               { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
// //               { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png"
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-watermark"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
// //             ]
// //           }, null, 2),
// //         }}
// //       />

// //       <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 py-12 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
// //               Add Watermark to PDF <br /> Online (Free)
// //             </h1>
// //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
// //               Add text watermark to your PDF pages instantly. Perfect for "CONFIDENTIAL", "DRAFT", or copyright — 100% free.
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
// //             <label className="block cursor-pointer mb-10">
// //               <div className="border-4 border-dashed border-gray-300 rounded-3xl p-20 text-center hover:border-slate-500 transition">
// //                 <Upload className="w-24 h-24 mx-auto text-gray-600 mb-8" />
// //                 <span className="text-3xl font-bold text-gray-800 block mb-4">
// //                   Drop PDF here or click to upload
// //                 </span>
// //               </div>
// //               <input type="file" accept=".pdf" onChange={addWatermark} className="hidden" />
// //             </label>

// //             {file && (
// //               <div className="space-y-8">
// //                 <div>
// //                   <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
// //                     <Type size={28} className="text-gray-600" />
// //                     Watermark Text
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={text}
// //                     onChange={(e) => setText(e.target.value)}
// //                     placeholder="e.g., CONFIDENTIAL, DRAFT, © 2025"
// //                     className="w-full p-6 text-2xl text-center border-2 border-gray-300 rounded-2xl focus:border-slate-500 outline-none"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-xl font-semibold text-gray-700 mb-4">
// //                     Opacity: {Math.round(opacity * 100)}%
// //                   </label>
// //                   <input
// //                     type="range"
// //                     min="0.1"
// //                     max="0.8"
// //                     step="0.1"
// //                     value={opacity}
// //                     onChange={(e) => setOpacity(parseFloat(e.target.value))}
// //                     className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
// //                   />
// //                 </div>

// //                 <div className="text-center">
// //                   <button
// //                     onClick={applyWatermark}
// //                     disabled={loading}
// //                     className="bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-gray-700 hover:to-slate-700 disabled:opacity-60 transition shadow-2xl"
// //                   >
// //                     {loading ? 'Adding Watermark...' : 'Apply Watermark'}
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {watermarkedUrl && (
// //               <div className="text-center mt-12">
// //                 <p className="text-3xl font-bold text-green-600 mb-6">Watermark Added Successfully!</p>
// //                 <a
// //                   href={watermarkedUrl}
// //                   download="watermarked-pdf.pdf"
// //                   className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
// //                 >
// //                   <Download size={36} />
// //                   Download Watermarked PDF
// //                 </a>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>

// //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
// //             Add Watermark to PDF Online Free - Protect Your Documents
// //           </h2>
// //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// //             Add text watermark like "CONFIDENTIAL", "DRAFT", or copyright to all PDF pages instantly. Professional protection — completely free with PDF Linx.
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// //           <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <Type className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Text</h3>
// //             <p className="text-gray-600">Add any text — "CONFIDENTIAL", "DRAFT", "COPYRIGHT" etc.</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">All Pages</h3>
// //             <p className="text-gray-600">Watermark applied to every page automatically.</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
// //             <p className="text-gray-600">Add watermark unlimited times — no signup, no upload.</p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// //             How to Add Watermark to PDF in 3 Simple Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-12">
// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 1
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
// //               <p className="text-gray-600 text-lg">Drop or select your PDF document.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 2
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Enter Text</h4>
// //               <p className="text-gray-600 text-lg">Type your watermark text and adjust opacity.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 3
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Download</h4>
// //               <p className="text-gray-600 text-lg">Save watermarked PDF instantly.</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// //           Add watermark to PDFs every day with PDF Linx — trusted by professionals for fast, reliable, and completely free document protection.
// //         </p>
// //       </section>

// //     <RelatedToolsSection currentPage="add-watermark" />
      
// //     </>
// //   );
// // }

