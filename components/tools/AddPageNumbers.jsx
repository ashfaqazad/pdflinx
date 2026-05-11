"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Hash,
  FileText,
  CheckCircle,
  Settings,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
// import { CheckCircle, FileText, Hash, Settings } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import dynamic from "next/dynamic";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";



const PageNumberPreview = dynamic(
  () => import("@/components/PageNumberPreview"),
  { ssr: false }
);

export default function AddPageNumbers() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [error, setError] = useState("");
  const [downloadFile, setDownloadFile] = useState(null); // { blob, filename }

  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [margin, setMargin] = useState(20);

  const file = flow.files?.[0] || null;

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-page-numbers.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
  }, [file?.name]);

  useEffect(() => {
    setError("");
    setDownloadFile(null);
  }, [file]);

  const resetAll = () => {
    setError("");
    setDownloadFile(null);
    setPosition("bottom-center");
    setStartNumber(1);
    setFontSize(14);
    setMargin(20);
    flow.reset();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!file) return alert("Please select a PDF file first!");

  //   startProgress();
  //   setSuccess(false);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("position", position);
  //   formData.append("startNumber", String(startNumber));
  //   formData.append("fontSize", String(fontSize));
  //   formData.append("margin", String(margin));

  //   try {
  //     const res = await fetch("/convert/add-page-numbers", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       let msg = "Failed to add page numbers";
  //       try {
  //         const maybeJson = await res.json();
  //         msg = maybeJson?.error || msg;
  //       } catch {}
  //       throw new Error(msg);
  //     }

  //     const contentType = (res.headers.get("content-type") || "").toLowerCase();

  //     if (!contentType.includes("application/pdf")) {
  //       throw new Error("Unexpected response from server.");
  //     }

  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();

  //     window.URL.revokeObjectURL(url);

  //     completeProgress();
  //     setSuccess(true);
  //     setFile(null);
  //     setPosition("bottom-center");
  //     setStartNumber(1);
  //     setFontSize(14);
  //     setMargin(20);
  //     e.target.reset();
  //   } catch (err) {
  //     cancelProgress();
  //     alert(err.message || "Something went wrong, please try again.");
  //     console.error(err);
  //   }
  // };

  const handleDownload = () => {
    if (!downloadFile?.blob) return;
    const urlObj = URL.createObjectURL(downloadFile.blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = downloadFile.filename || outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };

  const handleConvert = async () => {
    if (!file) return flow.handleError("Please select a PDF file first!");

    flow.startProcessing();
    startProgress();
    setError("");
    setDownloadFile(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    formData.append("startNumber", String(startNumber));
    formData.append("fontSize", String(fontSize));
    formData.append("margin", String(margin));

    try {
      const res = await fetch("/convert/add-page-numbers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Failed to add page numbers";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      if (!contentType.includes("application/pdf")) {
        throw new Error("Unexpected response from server.");
      }

      const blob = await res.blob();
      setDownloadFile({ blob, filename: outputFilename });

      // Keep existing behavior: auto-download
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = outputFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      const msg = err?.message || "Something went wrong, please try again.";
      setError(msg);
      cancelProgress();
      flow.handleError(msg);
      console.error(err);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Add Page Numbers to a PDF Online for Free",
              description:
                "Insert page numbers into a PDF in 3 quick steps. Upload your file, choose the number position and style, and download the updated PDF instantly.",
              url: "https://pdflinx.com/add-page-numbers",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload the PDF file to which you want to add page numbers.",
                },
                {
                  "@type": "HowToStep",
                  name: "Choose page number settings",
                  text: "Select the position, starting number, font size, and margin for your page numbers.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download updated PDF",
                  text: "Click the add page numbers button and download your numbered PDF instantly.",
                },
              ],
              totalTime: "PT20S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://pdflinx.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Add Page Numbers",
                  item: "https://pdflinx.com/add-page-numbers",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is the Add Page Numbers to PDF tool free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, PDFLinx lets you add page numbers to PDF online for free with no signup required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I choose where page numbers appear?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can place page numbers at the top or bottom, and align them left, center, or right.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I start numbering from any number?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can begin numbering from 1, 5, 10, or any number you need.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will adding page numbers change my original PDF layout?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. The original PDF layout stays the same. Only page numbers are added to the pages.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my PDF files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Files are processed securely and deleted automatically after a short time.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I add page numbers to PDF on mobile?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="software-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Add Page Numbers to PDF - PDFLinx",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              description:
                "Add page numbers to PDF online free. Insert page numbering anywhere in your PDF instantly with no signup and no watermark.",
              url: "https://pdflinx.com/add-page-numbers",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Add page numbers to PDF",
                "Choose PDF page number position",
                "Start numbering from any number",
                "Free online PDF page numbering tool",
                "No watermark",
                "Secure file processing",
                "Works on mobile and desktop",
                "Instant browser-based tool",
              ],
              creator: {
                "@type": "Organization",
                name: "PDFLinx",
              },
            },
            null,
            2
          ),
        }}
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      <ToolPageLayout
        title="Add Page Numbers to PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Add Page Numbers"
        flow={flow}
        progress={progress}
        onRemoveFile={resetAll}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        customFilePreview={
          <div className="mx-auto w-full max-w-[900px] space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Page numbering settings
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose position, start number, font size, and margin.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Page number position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Start numbering from
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Font size
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value) || 14)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Margin
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value) || 20)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {file && (
              <PageNumberPreview
                file={file}
                position={position}
                startNumber={startNumber}
                fontSize={fontSize}
                margin={margin}
              />
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold">Current settings:</span> Start{" "}
              {startNumber}, {position.replace("-", " ")}, {fontSize}px, margin{" "}
              {margin}px
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-semibold">{error}</p>
              </div>
            )}
          </div>
        }
        doneTitle="Your numbered PDF is ready"
        doneDescription="Your file was processed successfully."
        downloadLabel="Download PDF"
        resetLabel="Add numbers to another PDF"
        sidebarTitle="Add Page Numbers"
        sidebarIcon={<Hash className="h-5 w-5 text-white" />}
        sidebarDescription="Add clean page numbering without changing the layout."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Tip</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Works great for reports & assignments</li>
              <li>Preview the position before exporting</li>
              <li>Original PDF content stays unchanged</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        // uploadLanding={true}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"


        uploadLanding={{
          content: {
            eyebrow: "ADD PAGE NUMBERS",

            heroTitle: (
              <>
                Add page numbers <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  to any PDF
                </em>
              </>
            ),

            heroDescription:
              "Add page numbers to PDF online for free without changing the rest of your document. Choose the position, starting number, font size, and download your updated PDF instantly — no signup or watermark required.",

            noticeTitle: "Page numbering",

            noticeItems: [
              "Single PDF → Updated numbered PDF",
              "Choose position and start number",
              "No signup, no watermark",
            ],

            howToTitle: "How to add page numbers to PDF",

            howToSubtitle:
              "Upload your PDF, customize the numbering settings, and download the updated file in seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Choose a PDF from your device or drag & drop it into the uploader.",
                color: "bg-blue-600",
              },

              {
                n: "2",
                title: "Choose numbering settings",
                desc: "Select page number position, alignment, start number, margin, and font size.",
                color: "bg-purple-600",
              },

              {
                n: "3",
                title: "Apply & download",
                desc: "Insert page numbers instantly and download your updated PDF file.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx to add page numbers?",

            whyItems: [
              {
                title: "Add Numbers Anywhere",
                desc: "Place page numbers at the top or bottom and align them left, center, or right without editing the rest of the PDF.",
                icon: Hash,
                iconColor: "text-indigo-500",
                bgColor: "bg-indigo-50",
              },

              {
                title: "Keeps Original Layout",
                desc: "Only the numbering is added. Your PDF design, formatting, images, and content remain unchanged.",
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },

              {
                title: "Fast & Free",
                desc: "Add page numbers to PDF online in seconds with no watermark, installation, or signup required.",
                icon: CheckCircle,
                iconColor: "text-emerald-500",
                bgColor: "bg-emerald-50",
              },

              {
                title: "Custom Numbering Options",
                desc: "Choose the starting page number, font size, and spacing to match your document style.",
                icon: Settings,
                iconColor: "text-violet-500",
                bgColor: "bg-violet-50",
              },

              {
                title: "Works on All Devices",
                desc: "Use PDFLinx on desktop, tablet, Android, iPhone, Windows, macOS, and Linux.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },

              {
                title: "Secure Processing",
                desc: "Uploaded PDF files are processed securely and automatically deleted after a short time.",
                icon: ShieldCheck,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Numbering Guide",

            seoTitle:
              "Free Online Add Page Numbers to PDF Tool by PDFLinx",

            seoDescription:
              "Add page numbers to PDF online without changing the original layout. Customize numbering position, alignment, and start number directly in your browser.",

            seoSections: [
              {
                title: "Add Page Numbers Without Editing the Whole PDF",
                text: "PDFLinx lets you insert page numbers into PDF files without recreating the document from scratch. The original formatting, design, images, and layout remain unchanged.",
              },

              {
                title: "Choose Position, Alignment, and Start Number",
                text: "Place page numbers at the top or bottom of the page and align them left, center, or right. You can also start numbering from any custom number.",
              },

              {
                title: "Useful for Reports, Invoices, and Assignments",
                text: "Page numbering helps organize long PDFs such as reports, contracts, eBooks, study material, scanned documents, and printable files.",
              },

              {
                title: "Works on Desktop and Mobile Devices",
                text: "Use PDFLinx directly in your browser on Windows, macOS, Linux, Android, and iPhone devices without installing software.",
              },

              {
                title: "Fast, Free, and No Watermark",
                text: "Add page numbers to PDF online for free with no signup, no installation, and no watermark added to your document.",
              },

              {
                title: "Secure PDF Processing",
                text: "Your uploaded files are processed securely and automatically deleted after processing to protect your privacy.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: [
              {
                q: "Is the Add Page Numbers to PDF tool free?",
                a: "Yes. PDFLinx lets you add page numbers to PDF online for free without signup or hidden charges.",
              },

              {
                q: "Can I choose where the page numbers appear?",
                a: "Yes. You can place page numbers at the top or bottom and align them left, center, or right.",
              },

              {
                q: "Can I start numbering from a custom number?",
                a: "Yes. You can start page numbering from any number such as 5, 10, or another custom value.",
              },

              {
                q: "Will the PDF layout remain unchanged?",
                a: "Yes. Only the page numbers are added. The original PDF formatting and layout stay the same.",
              },

              {
                q: "Can I add page numbers to scanned PDFs?",
                a: "Yes. The tool also works for scanned PDFs, reports, invoices, books, and printable documents.",
              },

              {
                q: "Do I need to install software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },

              {
                q: "Are my uploaded files secure?",
                a: "Yes. Files are processed securely and automatically deleted after processing.",
              },

              {
                q: "Can I use this tool on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },
            ],
          },
        }}
          />
      


    </>
  );
}






















// "use client";

// import { useState } from "react";
// import { Upload, Hash, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";
// import dynamic from "next/dynamic";

// const PageNumberPreview = dynamic(
//     () => import("@/components/PageNumberPreview"),
//     { ssr: false }
// );

// export default function AddPageNumbers() {
//     const [file, setFile] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const [position, setPosition] = useState("bottom-center");
//     const [startNumber, setStartNumber] = useState(1);
//     const [fontSize, setFontSize] = useState(14);
//     const [margin, setMargin] = useState(20);

//     const {
//         progress,
//         isLoading,
//         startProgress,
//         completeProgress,
//         cancelProgress,
//     } = useProgressBar();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!file) return alert("Please select a PDF file first!");

//         startProgress();
//         setSuccess(false);

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("position", position);
//         formData.append("startNumber", String(startNumber));
//         formData.append("fontSize", String(fontSize));
//         formData.append("margin", String(margin));

//         try {
//             const res = await fetch("/convert/add-page-numbers", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 let msg = "Failed to add page numbers";
//                 try {
//                     const maybeJson = await res.json();
//                     msg = maybeJson?.error || msg;
//                 } catch { }
//                 throw new Error(msg);
//             }

//             const contentType = (res.headers.get("content-type") || "").toLowerCase();

//             if (!contentType.includes("application/pdf")) {
//                 throw new Error("Unexpected response from server.");
//             }

//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;
//             a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);

//             completeProgress();
//             setSuccess(true);
//             setFile(null);

//             setPosition("bottom-center");
//             setStartNumber(1);
//             setFontSize(14);
//             setMargin(20);

//             e.target.reset();
//         } catch (err) {
//             cancelProgress();
//             alert(err.message || "Something went wrong, please try again.");
//             console.error(err);
//         }
//     };

//     return (
//         <>
//             <Script
//                 src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//                 strategy="afterInteractive"
//                 onReady={() => {
//                     if (window?.pdfjsLib) {
//                         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//                             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//                     }
//                 }}
//             />

//             {/* ==================== SEO SCHEMAS ==================== */}

//             <Script
//                 id="howto-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "HowTo",
//                         name: "How to Add Page Numbers to a PDF Online",
//                         description:
//                             "Add page numbers to your PDF in 3 easy steps. Upload your file, choose position and style, and download the updated PDF instantly.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         step: [
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Upload PDF",
//                                 text: "Upload your PDF file from your device.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Choose page number settings",
//                                 text: "Select position, starting number, font size, and margin.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Download PDF",
//                                 text: "Click Add Page Numbers and download your updated PDF instantly.",
//                             },
//                         ],
//                         totalTime: "PT20S",
//                         estimatedCost: {
//                             "@type": "MonetaryAmount",
//                             value: "0",
//                             currency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <Script
//                 id="breadcrumb-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "BreadcrumbList",
//                         itemListElement: [
//                             {
//                                 "@type": "ListItem",
//                                 position: 1,
//                                 name: "Home",
//                                 item: "https://pdflinx.com",
//                             },
//                             {
//                                 "@type": "ListItem",
//                                 position: 2,
//                                 name: "Add Page Numbers",
//                                 item: "https://pdflinx.com/add-page-numbers",
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="faq-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "FAQPage",
//                         mainEntity: [
//                             {
//                                 "@type": "Question",
//                                 name: "Is the Add Page Numbers tool free?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can add page numbers to PDF online for free without signup.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I choose where page numbers appear?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can place page numbers at top or bottom, left, center, or right.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I start numbering from a specific number?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can start numbering from any number such as 1, 5, or 10.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Will this change my PDF layout?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "No, the original layout stays the same. Only page numbers are added.",
//                                 },
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="software-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "SoftwareApplication",
//                         name: "Add Page Numbers to PDF - PDFLinx",
//                         applicationCategory: "BusinessApplication",
//                         operatingSystem: "Web Browser",
//                         description:
//                             "Add page numbers to PDF online free. Insert page numbers anywhere in your PDF instantly with no watermark.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         offers: {
//                             "@type": "Offer",
//                             price: "0",
//                             priceCurrency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="text-center mb-8">
//                         <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                             Add Page Numbers to PDF Online Free
//                             <br />
//                             <span className="text-2xl md:text-3xl font-medium">
//                                 Insert PDF Page Numbers in Seconds
//                             </span>
//                         </h1>

//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Add page numbers to your PDF online free. Upload your file, preview
//                             pages, choose number position, and download the updated PDF
//                             instantly.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* File Input */}
//                             <div className="relative">
//                                 <label className="block">
//                                     <div
//                                         className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
//                                             ? "border-green-500 bg-green-50"
//                                             : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
//                                             }`}
//                                     >
//                                         <Upload className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
//                                         <p className="text-lg font-semibold text-gray-700">
//                                             {file ? file.name : "Drop your PDF here or click to upload"}
//                                         </p>

//                                         <p className="text-sm text-gray-500 mt-1">Only .pdf files</p>

//                                         <p className="text-xs text-gray-500 mt-2">
//                                             Upload your PDF, preview the pages, choose page number
//                                             settings, and download the updated file instantly.
//                                         </p>
//                                     </div>

//                                     <input
//                                         type="file"
//                                         accept=".pdf"
//                                         onChange={(e) => {
//                                             const pickedFile = e.target.files?.[0] || null;
//                                             setFile(pickedFile);
//                                         }}
//                                         className="hidden"
//                                         required
//                                     />
//                                 </label>
//                             </div>

//                             {/* Settings */}
//                             {file && (
//                                 <div className="grid md:grid-cols-2 gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Page number position
//                                         </label>
//                                         <select
//                                             value={position}
//                                             onChange={(e) => setPosition(e.target.value)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         >
//                                             <option value="top-left">Top Left</option>
//                                             <option value="top-center">Top Center</option>
//                                             <option value="top-right">Top Right</option>
//                                             <option value="bottom-left">Bottom Left</option>
//                                             <option value="bottom-center">Bottom Center</option>
//                                             <option value="bottom-right">Bottom Right</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Start numbering from
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="1"
//                                             value={startNumber}
//                                             onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Font size
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="8"
//                                             max="48"
//                                             value={fontSize}
//                                             onChange={(e) => setFontSize(Number(e.target.value) || 14)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Margin
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={margin}
//                                             onChange={(e) => setMargin(Number(e.target.value) || 20)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Preview */}
//                             {file && (
//                                 <PageNumberPreview
//                                     file={file}
//                                     position={position}
//                                     startNumber={startNumber}
//                                     fontSize={fontSize}
//                                     margin={margin}
//                                 />
//                             )}

//                             {/* Info box */}
//                             {file && (
//                                 <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-gray-700">
//                                     <span className="font-semibold">Preview settings: </span>
//                                     Start <strong>{startNumber}</strong>, Position{" "}
//                                     <strong>{position.replace("-", " ")}</strong>, Font size{" "}
//                                     <strong>{fontSize}px</strong>, Margin <strong>{margin}px</strong>
//                                 </div>
//                             )}

//                             {/* Button */}
//                             <ProgressButton
//                                 isLoading={isLoading}
//                                 progress={progress}
//                                 disabled={!file}
//                                 icon={<Hash className="w-5 h-5" />}
//                                 label="Add Page Numbers"
//                                 gradient="from-indigo-600 to-blue-600"
//                             />

//                             <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
//                                 <p>
//                                     🔢 <strong>Add page numbers</strong> to your PDF in seconds.
//                                 </p>
//                                 <p>
//                                     👀 <strong>Use live preview</strong> to check the number position
//                                     before downloading.
//                                 </p>
//                             </div>
//                         </form>

//                         {success && (
//                             <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                                 <p className="text-xl font-bold text-green-700 mb-2">
//                                     Done! Your numbered PDF downloaded automatically 🎉
//                                 </p>
//                                 <p className="text-base text-gray-700">
//                                     Check your downloads folder.
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     <p className="text-center mt-6 text-gray-600 text-base">
//                         No account • No watermark • Auto-deleted after 1 hour • 100% free •
//                         Works on desktop & mobile
//                     </p>
//                 </div>
//             </main>

//             {/* ==================== SEO CONTENT ==================== */}
//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold mb-4">
//                         Add Page Numbers to PDF Online Free – Fast & Easy PDF Numbering Tool
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Looking to add page numbers to a PDF file online? PDFLinx lets you insert page numbers into your PDF instantly without changing the original layout.
//                         Whether you need to number reports, assignments, invoices, or contracts, this tool helps you do it in seconds.
//                     </p>
//                 </div>

//                 <div className="space-y-10">
//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             What Does Add Page Numbers to PDF Mean?
//                         </h3>
//                         <p>
//                             Adding page numbers to a PDF means inserting numbers on each page of your document. These numbers help organize your document,
//                             improve readability, and make navigation easier when printing or sharing files.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Why Add Page Numbers to PDF Files?
//                         </h3>
//                         <ul className="list-disc pl-6 space-y-2">
//                             <li>Organize long documents and reports</li>
//                             <li>Make navigation easier for readers</li>
//                             <li>Prepare professional documents for printing</li>
//                             <li>Add numbering to assignments or study material</li>
//                             <li>Improve document structure and readability</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Add Page Numbers Without Changing Layout
//                         </h3>
//                         <p>
//                             This tool adds page numbers without modifying your PDF’s original design. The content, formatting, and structure remain unchanged.
//                             Only the page numbers are added at your selected position.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Customize Page Number Position and Style
//                         </h3>
//                         <p>
//                             You can choose where to place page numbers — top or bottom, left, center, or right.
//                             You can also control the starting number, font size, and margin to match your document style.
//                         </p>
//                     </div>
//                 </div>

//                 <h3 className="text-xl font-semibold mt-10 mb-3">
//                     How to Add Page Numbers to PDF Online
//                 </h3>
//                 <ol className="list-decimal pl-6 space-y-2">
//                     <li>Upload your PDF file</li>
//                     <li>Select page number position and settings</li>
//                     <li>Click Add Page Numbers</li>
//                     <li>Download your updated PDF instantly</li>
//                 </ol>

//                 <div className="bg-gray-50 border rounded-xl p-6 mt-8">
//                     <h3 className="text-xl font-semibold mb-4">
//                         Features of Add Page Numbers Tool
//                     </h3>
//                     <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">
//                         <li>Add page numbers to PDF online free</li>
//                         <li>Choose position (top, bottom, left, right)</li>
//                         <li>Start numbering from any page</li>
//                         <li>Customize font size and margin</li>
//                         <li>No watermark added</li>
//                         <li>Works on mobile and desktop</li>
//                         <li>Fast and secure processing</li>
//                         <li>No signup required</li>
//                     </ul>
//                 </div>
//             </section>

//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                         Add Page Numbers to PDF Without Editing the Whole Document
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Insert page numbers into reports, assignments, contracts, invoices,
//                         and scanned PDFs quickly. Choose where the page numbers should appear
//                         and download the final PDF instantly.
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-8 mb-16">
//                     <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Hash className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Add Numbers Anywhere
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             Place page numbers at the top or bottom, left, center, or right side
//                             of every PDF page.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <FileText className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Live Preview
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             See how numbering will look before processing the final PDF file.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg border border-sky-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <CheckCircle className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Fast & Free
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             No signup, no installation, and no watermark. Just upload and
//                             download.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             <section className="py-16">
//                 <div className="max-w-4xl mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-10">
//                         Frequently Asked Questions
//                     </h2>

//                     <div className="space-y-4">
//                         {[
//                             {
//                                 q: "Is this tool free to use?",
//                                 a: "Yes, you can add page numbers to PDF online for free with no signup.",
//                             },
//                             {
//                                 q: "Can I choose where page numbers appear?",
//                                 a: "Yes, you can place them at top or bottom, left, center, or right.",
//                             },
//                             {
//                                 q: "Can I start numbering from a different number?",
//                                 a: "Yes, you can start from any number like 5 or 10.",
//                             },
//                             {
//                                 q: "Does this tool change my PDF layout?",
//                                 a: "No, it only adds page numbers without affecting layout.",
//                             },
//                             {
//                                 q: "Can I use this on mobile?",
//                                 a: "Yes, it works on all devices including mobile, tablet, and desktop.",
//                             },
//                         ].map((faq, i) => (
//                             <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                                 <summary className="font-semibold cursor-pointer flex justify-between items-center">
//                                     {faq.q}
//                                     <span className="text-indigo-500 text-lg group-open:rotate-45">+</span>
//                                 </summary>
//                                 <p className="mt-2 text-gray-600">{faq.a}</p>
//                             </details>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <RelatedToolsSection currentPage="add-page-numbers" />
//         </>
//     );
// }