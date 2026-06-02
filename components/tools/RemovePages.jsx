"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GitMerge, Scissors, LayoutList, FolderOutput,
  RotateCw, Hash, Pencil, Minimize2
} from "lucide-react";

import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import dynamic from "next/dynamic";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";




const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "Organize PDF", href: "/organize-pdf", icon: <LayoutList className="h-4 w-4 text-blue-500" /> },
  { label: "Extract PDF", href: "/extract-pdf", icon: <FolderOutput className="h-4 w-4 text-cyan-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
];


const PdfPreviewSelector = dynamic(
  () => import("@/components/PdfPreviewSelector"),
  { ssr: false }
);

export default function RemovePdf() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const file = flow.files?.[0] || null;
  const [selectedPages, setSelectedPages] = useState([]);
  const [downloadFile, setDownloadFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-pages-removed.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-pages-removed.pdf";
  }, [file?.name]);

  useEffect(() => {
    setSelectedPages([]);
    setDownloadFile(null);
    setTotalPages(0);
  }, [file]);

  const handleRemoveFile = () => {
    flow.reset();
    setSelectedPages([]);
    setDownloadFile(null);
    setTotalPages(0);
  };

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
    if (!selectedPages.length)
      return flow.handleError("Please select page(s) to remove.");

    flow.startProcessing();
    startProgress();
    setDownloadFile(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", selectedPages.join(","));

    try {
      // const res = await fetch("/convert/remove-pages", {
      //   method: "POST",
      //   body: formData,
      // });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/remove-pages`, {
        method: "POST",
        body: formData,
      });


      if (!res.ok) {
        let msg = "Failed to remove pages";
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
      cancelProgress();
      flow.handleError(err?.message || "Something went wrong, please try again.");
      console.error(err);
    }
  };

  // ── Parse typed input like "1,3,5-8" ──
  const handlePageInputChange = (e) => {
    const raw = e.target.value;
    const parsed = [];
    raw.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) parsed.push(i);
        }
      } else {
        const n = Number(trimmed);
        if (!isNaN(n) && n > 0) parsed.push(n);
      }
    });
    setSelectedPages([...new Set(parsed)].sort((a, b) => a - b));
  };

  return (
    <>
      {/* ── JSON-LD SCHEMAS ── */}
      <Script
        id="howto-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Remove Pages from a PDF Online for Free",
            description: "Delete unwanted pages from a PDF in 3 quick steps.",
            url: "https://pdflinx.com/remove-pages",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF file from which you want to delete pages." },
              { "@type": "HowToStep", name: "Select pages", text: "Preview the PDF and click the pages you want to remove." },
              { "@type": "HowToStep", name: "Download updated PDF", text: "Click the remove pages button and download your new PDF instantly." },
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Remove Pages", item: "https://pdflinx.com/remove-pages" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the Remove Pages from PDF tool free?", acceptedAnswer: { "@type": "Answer", text: "Yes, PDFLinx lets you remove pages from PDF online for free with no signup required." } },
              { "@type": "Question", name: "How do I specify which pages to delete?", acceptedAnswer: { "@type": "Answer", text: "Preview the document and click the pages you want to remove." } },
              { "@type": "Question", name: "Can I remove multiple pages at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can remove multiple individual pages or page ranges in one go." } },
              { "@type": "Question", name: "Will the remaining PDF pages stay in the same order?", acceptedAnswer: { "@type": "Answer", text: "Yes. Only the selected pages are removed. The rest of the document stays in its original order." } },
              { "@type": "Question", name: "Are my PDF files safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and deleted automatically after a short time." } },
              { "@type": "Question", name: "Can I remove pages from PDF on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers." } },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="software-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Remove Pages from PDF - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Remove unwanted pages from PDF online free. Delete single pages or page ranges instantly with no signup and no watermark.",
            url: "https://pdflinx.com/remove-pages",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: ["Delete pages from PDF", "Remove PDF page ranges", "Free online PDF page remover", "No watermark", "Secure file processing", "Works on mobile and desktop"],
            creator: { "@type": "Organization", name: "PDFLinx" },
          }, null, 2),
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
        title="Remove Pages from PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Remove Pages"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        doneTitle="Your updated PDF is ready"
        doneDescription="Your file was processed successfully."
        downloadLabel="Download PDF"
        resetLabel="Remove pages from another PDF"
        sidebarTitle="Remove Pages"
        sidebarIcon={<Scissors className="h-5 w-5 text-white" />}
        sidebarDescription="Delete unwanted pages without affecting the rest."
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] min-h-[calc(100vh-80px)]">

            {/* ── LEFT — Pages Grid ── */}
            {/* <div className="bg-slate-100 p-6 overflow-y-auto h-[calc(100vh-80px)]"> */}
            <div className="bg-slate-100 p-4 overflow-y-auto overflow-x-hidden h-[calc(100vh-80px)]">

              <PdfPreviewSelector
                file={file}
                selectedPages={selectedPages}
                setSelectedPages={setSelectedPages}
                onTotalPages={(n) => setTotalPages(n)}
                hideHeader={true}
              />
            </div>

            {/* ── RIGHT — Sidebar (same pattern as AddWatermark) ── */}
            <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">

                {/* Title */}
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-3">
                  Remove Pages
                </h3>

                {/* Info box */}
                <div className="flex gap-2 items-start rounded-xl bg-blue-50 border border-blue-100 p-3">
                  <span className="text-blue-500 text-base mt-0.5 flex-shrink-0">ℹ️</span>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Click on pages to remove from document. You can use{" "}
                    <strong>shift</strong> key to set ranges.
                  </p>
                </div>

                {/* Total pages */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600 font-medium">Total pages:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {totalPages > 0 ? totalPages : "—"}
                  </span>
                </div>

                {/* Pages to remove input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Pages to remove:
                  </label>
                  <input
                    type="text"
                    placeholder="example: 1,5-8"
                    value={selectedPages.join(",")}
                    onChange={handlePageInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#f24d0d] focus:ring-2 focus:ring-[#f24d0d]/20"
                  />
                  {selectedPages.length > 0 && (
                    <p className="text-xs font-semibold text-[#f24d0d]">
                      {selectedPages.length} page{selectedPages.length !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Tips */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Tips
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      "Click thumbnails to select pages",
                      "Hold shift to select a range",
                      "Remaining pages keep their order",
                      "Great for blank or duplicate pages",
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-[#f24d0d] flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* ── Remove Pages button — bottom fixed (same as AddWatermark) ── */}
              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!selectedPages.length || flow.isProcessing}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${selectedPages.length && !flow.isProcessing
                    ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  {flow.isProcessing ? "Processing…" : "Remove Pages"}
                </button>
              </div>

            </div>
          </div>
        }

        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"

        // ============================================================
        // REMOVE PAGES FROM PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "REMOVE PAGES FROM PDF",

            breadcrumbCurrent: "Remove Pages from PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Remove Pages from PDF —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Instant
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Delete unwanted pages from any PDF online for free. Select individual pages or ranges to remove — no signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "Remove single or multiple pages",
            //   "Works on any device",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Remove Pages from PDF —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Delete Any Page Free Online
                </em>
              </>
            ),
            heroDescription:
              "Remove pages from PDF online free — select and permanently delete one or more pages from any PDF. Preview all pages before removing. No signup, no watermark, instant download.",
            pills: ["Visual page preview", "Delete any page(s)", "Permanent removal", "No watermark"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Remove Pages Info",
            noticeItems: [
              "Select pages to remove individually or by range",
              "Remaining pages stay intact",
              "Downloads as cleaned PDF instantly",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Remove Pages from PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, select pages to delete, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with PDFs of any size or page count.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Select Pages to Remove",
                desc: "Click on the page thumbnails you want to delete, or enter page numbers and ranges manually. Preview each page clearly before removing — no guesswork.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Cleaned PDF",
                desc: "Click Remove Pages and your updated PDF is ready in seconds. All remaining pages stay exactly as they were — formatting, images, and content fully intact.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Tool to Remove Pages from PDF Online",

            seoBadge: "Remove PDF Pages Guide",
            seoTitle: "Complete Guide to Removing Pages from PDF Online",
            seoDescription:
              "Everything you need to know about deleting unwanted pages from a PDF — free, online, instant. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Page Remover — Delete Any Page from a PDF Online in Seconds",
                text: "Need to remove pages from a PDF? PDFLinx lets you delete any page from a PDF online for free — instantly and without any software installation. Whether it is a blank page at the end, a confidential section in the middle, a cover page you no longer need, or a range of pages from a large document, PDFLinx removes them cleanly in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "Why You Might Need to Remove Pages from a PDF",
                text: "There are many everyday situations where removing pages from a PDF is necessary. A scanned document may include blank pages between content. A report may have an internal section that should not be shared with clients. A downloaded PDF may include advertisement pages or terms pages that are not relevant. A merged PDF may have duplicate pages. A legal document may need confidential pages removed before submission. In all these cases, PDFLinx removes exactly the pages you choose — without touching anything else in the document.",
              },
              {
                title: "How Page Removal Works — What Happens to the Rest of the PDF",
                text: "When you remove pages using PDFLinx, only the selected pages are deleted from the document. All remaining pages stay completely intact — their content, formatting, images, fonts, hyperlinks, and page order are preserved exactly as in the original. The output is a properly structured PDF with continuous page numbering and no broken layout — as if the removed pages were never there.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Page Remover — No Watermark, No Limits",
                text: "Most free PDF page removal tools add watermarks to the output, restrict the number of pages you can delete, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily limit. Unlike iLovePDF and Smallpdf which restrict page editing tools on free tiers, PDFLinx gives you full access at zero cost.",
              },
              {
                title: "Common Use Cases for Removing Pages from a PDF",
                text: "✓ Remove blank or empty pages from scanned documents before sharing.\n✓ Delete confidential or internal pages from reports before sending to clients.\n✓ Strip cover pages, table of contents, or appendix pages from a document.\n✓ Remove advertisement or filler pages from downloaded PDF files.\n✓ Clean up merged PDFs that contain duplicate or unwanted pages.\n✓ Trim a long PDF down to only the pages relevant to a specific recipient or submission.",
              },
              {
                title:
                  "Remove PDF Pages on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the cleaned file in seconds. Whether you need to remove pages on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when removing confidential or sensitive pages from business or legal documents. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "Remove Pages vs Split PDF — What is the Difference?",
                text: "Removing pages and splitting a PDF are related but different actions. Removing pages deletes specific pages and gives you back the same document without them. Splitting a PDF separates it into multiple files — either by individual pages or by page ranges. If you want to clean up a document by deleting unwanted pages, use Remove Pages. If you want to divide a document into separate files for different purposes, use our free PDF Split tool. Both are free on PDFLinx.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx remove pages tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on how many pages you remove or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and remove pages instantly — no email, no registration, no friction.",
              },
              {
                q: "Can I remove multiple pages at once?",
                a: "Yes. Select as many individual pages as you need or enter a page range — all selected pages are removed in a single operation.",
              },
              {
                q: "Will the remaining pages be affected after removal?",
                a: "No. Only the pages you select are removed. All remaining pages stay exactly as they were — content, formatting, images, and order all preserved.",
              },
              {
                q: "Can I preview pages before removing them?",
                a: "Yes. PDFLinx shows thumbnail previews of all pages so you can clearly see which pages you are selecting before confirming the removal.",
              },
              {
                q: "Does PDFLinx add any watermark to the output PDF?",
                a: "No watermarks, ever. Your cleaned PDF is 100% intact and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting the file first using our free PDF Split tool, then remove pages from each part.",
              },
              {
                q: "Can I remove pages from a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then delete the pages you need.",
              },
              {
                q: "What is the difference between removing pages and splitting a PDF?",
                a: "Removing pages deletes specific pages and returns the same document without them. Splitting divides the PDF into separate files. Use Remove Pages to clean up a document, and use our PDF Split tool to divide it into multiple files.",
              },
              {
                q: "How long does it take to remove pages from a PDF?",
                a: "Most operations complete within 5 to 10 seconds depending on file size and number of pages being removed.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for removing PDF pages?",
                a: "Yes — PDFLinx offers unlimited free page removal with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict page editing tools behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Remove PDF pages now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, clean PDF page removal every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />
    </>
  );
}























// "use client";

// import { useEffect, useMemo, useState } from "react";
// // import { FileText, Scissors } from "lucide-react";
// import {
//   FileText,
//   Scissors,
//   FilePlus,
//   FileMinus,
//   RotateCw,
//   CheckCircle,
//   Lock,
//   Image,
// } from "lucide-react";

// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import dynamic from "next/dynamic";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// const PdfPreviewSelector = dynamic(
//   () => import("@/components/PdfPreviewSelector"),
//   { ssr: false }
// );

// export default function RemovePdf() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } =
//     useProgressBar();

//   const file = flow.files?.[0] || null;
//   const [selectedPages, setSelectedPages] = useState([]);
//   const [downloadFile, setDownloadFile] = useState(null); // { blob, filename }

//   const outputFilename = useMemo(() => {
//     if (!file?.name) return "pdflinx-pages-removed.pdf";
//     return file.name.replace(/\.pdf$/i, "") + "-pages-removed.pdf";
//   }, [file?.name]);

//   useEffect(() => {
//     setSelectedPages([]);
//     setDownloadFile(null);
//   }, [file]);

//   const handleRemoveFile = () => {
//     flow.reset();
//     setSelectedPages([]);
//     setDownloadFile(null);
//   };

//   const handleDownload = () => {
//     if (!downloadFile?.blob) return;
//     const urlObj = URL.createObjectURL(downloadFile.blob);
//     const a = document.createElement("a");
//     a.href = urlObj;
//     a.download = downloadFile.filename || outputFilename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(urlObj);
//   };

//   const handleConvert = async () => {
//     if (!file) return flow.handleError("Please select a PDF file first!");
//     if (!selectedPages.length)
//       return flow.handleError("Please select page(s) to remove.");

//     flow.startProcessing();
//     startProgress();
//     setDownloadFile(null);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("pages", selectedPages.join(","));

//     try {
//       const res = await fetch("/convert/remove-pages", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Failed to remove pages";
//         try {
//           const maybeJson = await res.json();
//           msg = maybeJson?.error || msg;
//         } catch { }
//         throw new Error(msg);
//       }

//       const contentType = (res.headers.get("content-type") || "").toLowerCase();
//       if (!contentType.includes("application/pdf")) {
//         throw new Error("Unexpected response from server.");
//       }

//       const blob = await res.blob();
//       setDownloadFile({ blob, filename: outputFilename });

//       // Keep existing behavior: auto-download after processing
//       const urlObj = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = urlObj;
//       a.download = outputFilename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(urlObj);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       flow.handleError(err?.message || "Something went wrong, please try again.");
//       // eslint-disable-next-line no-console
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <Script
//         id="howto-schema-remove-pages"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Remove Pages from a PDF Online for Free",
//               description:
//                 "Delete unwanted pages from a PDF in 3 quick steps. Upload your file, enter page numbers or ranges, and download the updated PDF instantly.",
//               url: "https://pdflinx.com/remove-pages",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload PDF",
//                   text: "Upload the PDF file from which you want to delete pages.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Select pages",
//                   text: "Preview the PDF and click the pages you want to remove.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Download updated PDF",
//                   text: "Click the remove pages button and download your new PDF instantly.",
//                 },
//               ],
//               totalTime: "PT20S",
//               estimatedCost: {
//                 "@type": "MonetaryAmount",
//                 value: "0",
//                 currency: "USD",
//               },
//               image: "https://pdflinx.com/og-image.png",
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-remove-pages"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 {
//                   "@type": "ListItem",
//                   position: 1,
//                   name: "Home",
//                   item: "https://pdflinx.com",
//                 },
//                 {
//                   "@type": "ListItem",
//                   position: 2,
//                   name: "Remove Pages",
//                   item: "https://pdflinx.com/remove-pages",
//                 },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="faq-schema-remove-pages"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: [
//                 {
//                   "@type": "Question",
//                   name: "Is the Remove Pages from PDF tool free?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes, PDFLinx lets you remove pages from PDF online for free with no signup required.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "How do I specify which pages to delete?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Preview the document and click the pages you want to remove.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I remove multiple pages at once?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. You can remove multiple individual pages or page ranges in one go.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Will the remaining PDF pages stay in the same order?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. Only the selected pages are removed. The rest of the document stays in its original order.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Are my PDF files safe?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. Files are processed securely and deleted automatically after a short time.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I remove pages from PDF on mobile?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers.",
//                   },
//                 },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="software-schema-remove-pages"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "SoftwareApplication",
//               name: "Remove Pages from PDF - PDFLinx",
//               applicationCategory: "BusinessApplication",
//               operatingSystem: "Web Browser",
//               description:
//                 "Remove unwanted pages from PDF online free. Delete single pages or page ranges instantly with no signup and no watermark.",
//               url: "https://pdflinx.com/remove-pages",
//               offers: {
//                 "@type": "Offer",
//                 price: "0",
//                 priceCurrency: "USD",
//               },
//               featureList: [
//                 "Delete pages from PDF",
//                 "Remove PDF page ranges",
//                 "Free online PDF page remover",
//                 "No watermark",
//                 "Secure file processing",
//                 "Works on mobile and desktop",
//                 "Instant browser-based tool",
//               ],
//               creator: {
//                 "@type": "Organization",
//                 name: "PDFLinx",
//               },
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onReady={() => {
//           if (window?.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//           }
//         }}
//       />

//       <ToolPageLayout
//         title="Remove Pages from PDF Online Free"
//         tagline="No Signup · No Watermark · Instant Download"
//         accept="application/pdf"
//         multiple={false}
//         convertLabel="Remove Pages"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         customFilePreview={
//           <div className="mx-auto w-full max-w-[900px] space-y-4">
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between gap-3">
//                 <div>
//                   <p className="text-sm font-bold text-slate-900">
//                     PDF page preview
//                   </p>
//                   <p className="mt-1 text-xs text-slate-500">
//                     Click the pages you want to remove.
//                   </p>
//                 </div>
//                 <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
//                   {selectedPages.length} selected
//                 </span>
//               </div>

//               <div className="mt-4">
//                 {file && (
//                   <PdfPreviewSelector
//                     file={file}
//                     selectedPages={selectedPages}
//                     setSelectedPages={setSelectedPages}
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-slate-700">
//               <span className="font-semibold">Pages selected to remove:</span>{" "}
//               {selectedPages.length ? selectedPages.join(", ") : "None"}
//             </div>
//           </div>
//         }
//         doneTitle="Your updated PDF is ready"
//         doneDescription="Your file was processed successfully."
//         downloadLabel="Download PDF"
//         resetLabel="Remove pages from another PDF"
//         sidebarTitle="Remove Pages"
//         sidebarIcon={<Scissors className="h-5 w-5 text-white" />}
//         sidebarDescription="Delete unwanted pages without affecting the rest."
//         sidebarNotice={
//           <>
//             <p className="text-sm font-semibold text-blue-800">ℹ️ Tip</p>
//             <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
//               <li>Select one or multiple pages to remove</li>
//               <li>Remaining pages keep their order</li>
//               <li>Great for blank or duplicate pages</li>
//             </ul>
//           </>
//         }
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         // uploadLanding={true}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF files supported"


//         // RemovePages.jsx ke andar ToolPageLayout mein paste karo
//         // uploadLandingContent prop ke andar

//         uploadLanding={{
//           content: {
//             eyebrow: "REMOVE PAGES FROM PDF",

//             heroTitle: (
//               <>
//                 Remove Pages from PDF <br />
//                 <em className="text-[#e8420a]">in seconds</em>


//                 {/* <em className="font-bold not-italic text-[#080605] sm:italic">
//                   in seconds
//                 </em> */}
//               </>
//             ),

//             heroDescription:
//               "Upload a PDF, click the pages you want to delete, and download a clean updated PDF instantly — free and private. No signup, no watermark, no software needed.",

//             bullets: [
//               "Preview all pages before removing",
//               "Select multiple pages to delete at once",
//               "Original formatting preserved — only selected pages removed",
//             ],

//             uploadTitle: "Drop your PDF here",
//             uploadSubtitle: "or click to browse — PDF files supported",

//             privacyTitle: "Your files stay private",
//             privacyText:
//               "Files are processed securely and automatically deleted after conversion. Never stored or shared.",

//             noticeTitle: "Page Removal",
//             noticeItems: [
//               "Single PDF → Updated PDF directly",
//               "Preview pages before removing",
//               "No signup, no watermark",
//             ],

//             breadcrumbItems: [
//               { label: "Home", href: "/" },
//               { label: "PDF Tools", href: "/pdf-tools" },
//               { label: "Remove Pages from PDF" },
//             ],

//             trustPills: ["100% Free", "No Sign Up", "No Watermark"],

//             supports: [
//               "Supports PDF files",
//               "Auto-deleted after 1 hour",
//             ],

//             howToTitle: "How to Remove Pages from PDF",

//             howToSteps: [
//               {
//                 n: "1",
//                 title: "Upload Your PDF",
//                 desc: "Choose a PDF from your device. Drag and drop supported on all devices.",
//                 color: "bg-blue-600",
//               },
//               {
//                 n: "2",
//                 title: "Select Pages to Remove",
//                 desc: "Click page thumbnails to mark the pages you want to delete. Select multiple at once.",
//                 color: "bg-purple-600",
//               },
//               {
//                 n: "3",
//                 title: "Remove & Download",
//                 desc: "Remove selected pages and download your clean updated PDF instantly. No watermark.",
//                 color: "bg-emerald-600",
//               },
//             ],

//             visualImage: "/images/remove-pages-visual.png",
//             visualAlt: "Remove pages from PDF illustration",

//             whyTitle: "Why Choose PDFLinx to Remove PDF Pages?",

//             whyItems: [
//               {
//                 title: "Visual Page Preview",
//                 desc: "See all PDF pages as thumbnails before removing — click to select, click again to deselect. Full control.",
//                 icon: Image, // FileSearch
//                 iconColor: "text-blue-500",
//                 bgColor: "bg-blue-50",
//               },
//               {
//                 title: "Remove Multiple Pages at Once",
//                 desc: "Select and delete as many pages as you need in one go — no need to process the PDF multiple times.",
//                 icon: Image, // FileMinus
//                 iconColor: "text-red-500",
//                 bgColor: "bg-red-50",
//               },
//               {
//                 title: "Original Quality Preserved",
//                 desc: "Only selected pages are removed. All remaining pages keep their original formatting, fonts, and images.",
//                 icon: Image, // ShieldCheck
//                 iconColor: "text-emerald-500",
//                 bgColor: "bg-emerald-50",
//               },
//               {
//                 title: "Works on Any Device",
//                 desc: "Remove PDF pages on iPhone, Android, Windows, or Mac — no software installation needed.",
//                 icon: Image, // MonitorSmartphone
//                 iconColor: "text-orange-500",
//                 bgColor: "bg-orange-50",
//               },
//             ],

//             relatedTitle: "You Might Also Need",

//             // relatedTools: [
//             //   { label: "Split PDF", href: "/split-pdf", desc: "Split PDF into separate files", iconColor: "text-pink-500", bgColor: "bg-pink-50" },
//             //   { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", iconColor: "text-violet-500", bgColor: "bg-violet-50" },
//             //   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", iconColor: "text-green-500", bgColor: "bg-green-50" },
//             //   { label: "Rotate PDF", href: "/rotate-pdf", desc: "Rotate PDF pages", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
//             //   { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
//             //   { label: "Protect PDF", href: "/protect-pdf", desc: "Add password to PDF", iconColor: "text-red-500", bgColor: "bg-red-50" },
//             // ],

//             relatedTools: [
//               {
//                 label: "Split PDF",
//                 href: "/split-pdf",
//                 desc: "Split PDF into separate files",
//                 icon: Scissors,
//                 iconColor: "text-pink-500",
//                 bgColor: "bg-pink-50",
//               },

//               {
//                 label: "Merge PDF",
//                 href: "/merge-pdf",
//                 desc: "Combine multiple PDFs",
//                 icon: FilePlus,
//                 iconColor: "text-violet-500",
//                 bgColor: "bg-violet-50",
//               },

//               {
//                 label: "Compress PDF",
//                 href: "/compress-pdf",
//                 desc: "Reduce PDF file size",
//                 icon: FileMinus,
//                 iconColor: "text-green-500",
//                 bgColor: "bg-green-50",
//               },

//               {
//                 label: "Rotate PDF",
//                 href: "/rotate-pdf",
//                 desc: "Rotate PDF pages",
//                 icon: RotateCw,
//                 iconColor: "text-amber-500",
//                 bgColor: "bg-amber-50",
//               },

//               {
//                 label: "PDF to Word",
//                 href: "/pdf-to-word",
//                 desc: "Convert PDF to editable DOCX",
//                 icon: FileText,
//                 iconColor: "text-blue-500",
//                 bgColor: "bg-blue-50",
//               },

//               {
//                 label: "Protect PDF",
//                 href: "/protect-pdf",
//                 desc: "Add password to PDF",
//                 icon: Lock,
//                 iconColor: "text-red-500",
//                 bgColor: "bg-red-50",
//               },
//             ],

//             faqTitle: "Frequently Asked Questions — Remove Pages from PDF",

//             faqs: [
//               {
//                 q: "Is the PDF page remover free to use?",
//                 a: "Yes, completely free. No hidden charges, no subscription, no limits.",
//               },
//               {
//                 q: "Do I need to install any software?",
//                 a: "No. Everything works directly in your browser. No desktop software or plugins needed.",
//               },
//               {
//                 q: "Can I remove multiple pages at once?",
//                 a: "Yes. Select as many pages as you need and remove them all in one click.",
//               },
//               {
//                 q: "Will the remaining pages keep their original quality?",
//                 a: "Yes. Only the selected pages are removed. All remaining pages keep their original formatting, fonts, images, and layout.",
//               },
//               {
//                 q: "Can I preview pages before removing them?",
//                 a: "Yes. All PDF pages are shown as thumbnails. Click to select the ones you want to remove before confirming.",
//               },
//               {
//                 q: "Are my uploaded files safe and private?",
//                 a: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties.",
//               },
//               {
//                 q: "Can I remove pages on my phone?",
//                 a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
//               },
//               {
//                 q: "What if I want to keep only specific pages?",
//                 a: "Select all the pages you want to remove and download the updated PDF — only your selected pages will be deleted.",
//               },
//               {
//                 q: "Can I undo the page removal?",
//                 a: "Once downloaded, the removal cannot be undone. We recommend keeping a backup of your original PDF before removing pages.",
//               },
//               {
//                 q: "What is the difference between Remove Pages and Split PDF?",
//                 a: "Remove Pages deletes specific pages from your PDF and gives you one updated file. Split PDF divides your PDF into separate files by page range or individual pages.",
//               },
//             ],

//             ctaBadge: "✦ 100% Free",
//             ctaTitle: "Start Removing PDF Pages Now",
//             ctaDescription: "Fast. Secure. Private. No sign up required.",
//             ctaSubtext: "No limits. No hidden charges.",
//             ctaButton: "Choose PDF File",

//             seoSections: [
//               {
//                 title: "Free PDF Page Remover — Delete Any Page from Your PDF Instantly",
//                 text: "Need to remove unwanted pages from a PDF? PDFLinx lets you visually select and delete any page from your PDF document — no software, no signup, no watermark. Upload your PDF, click the pages to remove, and download a clean updated PDF in seconds.",
//               },
//               {
//                 title: "What is PDF Page Removal?",
//                 text: "PDF page removal is the process of deleting one or more specific pages from a PDF document while keeping all remaining pages intact. This is useful for removing blank pages, confidential sections, duplicate content, or irrelevant pages from a document before sharing.",
//               },
//               {
//                 title: "Common Use Cases for Removing PDF Pages",
//                 text: "Remove blank or empty pages from scanned documents. Delete confidential pages before sharing a report. Remove cover pages or headers from downloaded PDFs. Clean up multi-page forms by removing unused sections. Extract only the relevant portion of a large PDF document.",
//               },
//               {
//                 title: "Privacy and File Security",
//                 text: "PDFLinx takes your privacy seriously. Uploaded PDF files are processed securely and permanently deleted after conversion — never stored long-term, never shared with third parties. No account creation is required. Your documents remain completely private throughout the process.",
//               },
//               {
//                 title: "Remove PDF Pages on Any Device",
//                 text: "Works on Windows, macOS, Linux, Android, and iOS — directly in your browser. No app download needed. PDFLinx is fully responsive with thumbnail preview support on both desktop and mobile. Remove PDF pages anywhere, anytime.",
//               },
//             ],

//             showPdfTypes: false,
//           },
//         }}

//       />
//     </>
//   );
// }


