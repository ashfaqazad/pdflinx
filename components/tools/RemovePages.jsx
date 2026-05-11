"use client";

import { useEffect, useMemo, useState } from "react";
// import { FileText, Scissors } from "lucide-react";
import {
  FileText,
  Scissors,
  FilePlus,
  FileMinus,
  RotateCw,
  CheckCircle,
  Lock,
  Image,
} from "lucide-react";

import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import dynamic from "next/dynamic";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

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
  const [downloadFile, setDownloadFile] = useState(null); // { blob, filename }

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-pages-removed.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-pages-removed.pdf";
  }, [file?.name]);

  useEffect(() => {
    setSelectedPages([]);
    setDownloadFile(null);
  }, [file]);

  const handleRemoveFile = () => {
    flow.reset();
    setSelectedPages([]);
    setDownloadFile(null);
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
      const res = await fetch("/convert/remove-pages", {
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

      // Keep existing behavior: auto-download after processing
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
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <>
      <Script
        id="howto-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Remove Pages from a PDF Online for Free",
              description:
                "Delete unwanted pages from a PDF in 3 quick steps. Upload your file, enter page numbers or ranges, and download the updated PDF instantly.",
              url: "https://pdflinx.com/remove-pages",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload the PDF file from which you want to delete pages.",
                },
                {
                  "@type": "HowToStep",
                  name: "Select pages",
                  text: "Preview the PDF and click the pages you want to remove.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download updated PDF",
                  text: "Click the remove pages button and download your new PDF instantly.",
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
        id="breadcrumb-schema-remove-pages"
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
                  name: "Remove Pages",
                  item: "https://pdflinx.com/remove-pages",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-remove-pages"
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
                  name: "Is the Remove Pages from PDF tool free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, PDFLinx lets you remove pages from PDF online for free with no signup required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I specify which pages to delete?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Preview the document and click the pages you want to remove.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I remove multiple pages at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can remove multiple individual pages or page ranges in one go.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will the remaining PDF pages stay in the same order?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Only the selected pages are removed. The rest of the document stays in its original order.",
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
                  name: "Can I remove pages from PDF on mobile?",
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
        id="software-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Remove Pages from PDF - PDFLinx",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              description:
                "Remove unwanted pages from PDF online free. Delete single pages or page ranges instantly with no signup and no watermark.",
              url: "https://pdflinx.com/remove-pages",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Delete pages from PDF",
                "Remove PDF page ranges",
                "Free online PDF page remover",
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
        showOutputFormat={false}
        showPreserveLayout={false}
        customFilePreview={
          <div className="mx-auto w-full max-w-[900px] space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    PDF page preview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Click the pages you want to remove.
                  </p>
                </div>
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                  {selectedPages.length} selected
                </span>
              </div>

              <div className="mt-4">
                {file && (
                  <PdfPreviewSelector
                    file={file}
                    selectedPages={selectedPages}
                    setSelectedPages={setSelectedPages}
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold">Pages selected to remove:</span>{" "}
              {selectedPages.length ? selectedPages.join(", ") : "None"}
            </div>
          </div>
        }
        doneTitle="Your updated PDF is ready"
        doneDescription="Your file was processed successfully."
        downloadLabel="Download PDF"
        resetLabel="Remove pages from another PDF"
        sidebarTitle="Remove Pages"
        sidebarIcon={<Scissors className="h-5 w-5 text-white" />}
        sidebarDescription="Delete unwanted pages without affecting the rest."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Tip</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Select one or multiple pages to remove</li>
              <li>Remaining pages keep their order</li>
              <li>Great for blank or duplicate pages</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        // uploadLanding={true}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"


        // RemovePages.jsx ke andar ToolPageLayout mein paste karo
        // uploadLandingContent prop ke andar

        uploadLanding={{
          content: {
            eyebrow: "REMOVE PAGES FROM PDF",

            heroTitle: (
              <>
                Remove Pages from PDF <br />
                <em className="text-[#e8420a]">in seconds</em>


                {/* <em className="font-bold not-italic text-[#080605] sm:italic">
                  in seconds
                </em> */}
              </>
            ),

            heroDescription:
              "Upload a PDF, click the pages you want to delete, and download a clean updated PDF instantly — free and private. No signup, no watermark, no software needed.",

            bullets: [
              "Preview all pages before removing",
              "Select multiple pages to delete at once",
              "Original formatting preserved — only selected pages removed",
            ],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            privacyTitle: "Your files stay private",
            privacyText:
              "Files are processed securely and automatically deleted after conversion. Never stored or shared.",

            noticeTitle: "Page Removal",
            noticeItems: [
              "Single PDF → Updated PDF directly",
              "Preview pages before removing",
              "No signup, no watermark",
            ],

            breadcrumbItems: [
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Remove Pages from PDF" },
            ],

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            supports: [
              "Supports PDF files",
              "Auto-deleted after 1 hour",
            ],

            howToTitle: "How to Remove Pages from PDF",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF",
                desc: "Choose a PDF from your device. Drag and drop supported on all devices.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Select Pages to Remove",
                desc: "Click page thumbnails to mark the pages you want to delete. Select multiple at once.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Remove & Download",
                desc: "Remove selected pages and download your clean updated PDF instantly. No watermark.",
                color: "bg-emerald-600",
              },
            ],

            visualImage: "/images/remove-pages-visual.png",
            visualAlt: "Remove pages from PDF illustration",

            whyTitle: "Why Choose PDFLinx to Remove PDF Pages?",

            whyItems: [
              {
                title: "Visual Page Preview",
                desc: "See all PDF pages as thumbnails before removing — click to select, click again to deselect. Full control.",
                icon: Image, // FileSearch
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                title: "Remove Multiple Pages at Once",
                desc: "Select and delete as many pages as you need in one go — no need to process the PDF multiple times.",
                icon: Image, // FileMinus
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
              },
              {
                title: "Original Quality Preserved",
                desc: "Only selected pages are removed. All remaining pages keep their original formatting, fonts, and images.",
                icon: Image, // ShieldCheck
                iconColor: "text-emerald-500",
                bgColor: "bg-emerald-50",
              },
              {
                title: "Works on Any Device",
                desc: "Remove PDF pages on iPhone, Android, Windows, or Mac — no software installation needed.",
                icon: Image, // MonitorSmartphone
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
            ],

            relatedTitle: "You Might Also Need",

            // relatedTools: [
            //   { label: "Split PDF", href: "/split-pdf", desc: "Split PDF into separate files", iconColor: "text-pink-500", bgColor: "bg-pink-50" },
            //   { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", iconColor: "text-violet-500", bgColor: "bg-violet-50" },
            //   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", iconColor: "text-green-500", bgColor: "bg-green-50" },
            //   { label: "Rotate PDF", href: "/rotate-pdf", desc: "Rotate PDF pages", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
            //   { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
            //   { label: "Protect PDF", href: "/protect-pdf", desc: "Add password to PDF", iconColor: "text-red-500", bgColor: "bg-red-50" },
            // ],

            relatedTools: [
              {
                label: "Split PDF",
                href: "/split-pdf",
                desc: "Split PDF into separate files",
                icon: Scissors,
                iconColor: "text-pink-500",
                bgColor: "bg-pink-50",
              },

              {
                label: "Merge PDF",
                href: "/merge-pdf",
                desc: "Combine multiple PDFs",
                icon: FilePlus,
                iconColor: "text-violet-500",
                bgColor: "bg-violet-50",
              },

              {
                label: "Compress PDF",
                href: "/compress-pdf",
                desc: "Reduce PDF file size",
                icon: FileMinus,
                iconColor: "text-green-500",
                bgColor: "bg-green-50",
              },

              {
                label: "Rotate PDF",
                href: "/rotate-pdf",
                desc: "Rotate PDF pages",
                icon: RotateCw,
                iconColor: "text-amber-500",
                bgColor: "bg-amber-50",
              },

              {
                label: "PDF to Word",
                href: "/pdf-to-word",
                desc: "Convert PDF to editable DOCX",
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },

              {
                label: "Protect PDF",
                href: "/protect-pdf",
                desc: "Add password to PDF",
                icon: Lock,
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
              },
            ],

            faqTitle: "Frequently Asked Questions — Remove Pages from PDF",

            faqs: [
              {
                q: "Is the PDF page remover free to use?",
                a: "Yes, completely free. No hidden charges, no subscription, no limits.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software or plugins needed.",
              },
              {
                q: "Can I remove multiple pages at once?",
                a: "Yes. Select as many pages as you need and remove them all in one click.",
              },
              {
                q: "Will the remaining pages keep their original quality?",
                a: "Yes. Only the selected pages are removed. All remaining pages keep their original formatting, fonts, images, and layout.",
              },
              {
                q: "Can I preview pages before removing them?",
                a: "Yes. All PDF pages are shown as thumbnails. Click to select the ones you want to remove before confirming.",
              },
              {
                q: "Are my uploaded files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties.",
              },
              {
                q: "Can I remove pages on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "What if I want to keep only specific pages?",
                a: "Select all the pages you want to remove and download the updated PDF — only your selected pages will be deleted.",
              },
              {
                q: "Can I undo the page removal?",
                a: "Once downloaded, the removal cannot be undone. We recommend keeping a backup of your original PDF before removing pages.",
              },
              {
                q: "What is the difference between Remove Pages and Split PDF?",
                a: "Remove Pages deletes specific pages from your PDF and gives you one updated file. Split PDF divides your PDF into separate files by page range or individual pages.",
              },
            ],

            ctaBadge: "✦ 100% Free",
            ctaTitle: "Start Removing PDF Pages Now",
            ctaDescription: "Fast. Secure. Private. No sign up required.",
            ctaSubtext: "No limits. No hidden charges.",
            ctaButton: "Choose PDF File",

            seoSections: [
              {
                title: "Free PDF Page Remover — Delete Any Page from Your PDF Instantly",
                text: "Need to remove unwanted pages from a PDF? PDFLinx lets you visually select and delete any page from your PDF document — no software, no signup, no watermark. Upload your PDF, click the pages to remove, and download a clean updated PDF in seconds.",
              },
              {
                title: "What is PDF Page Removal?",
                text: "PDF page removal is the process of deleting one or more specific pages from a PDF document while keeping all remaining pages intact. This is useful for removing blank pages, confidential sections, duplicate content, or irrelevant pages from a document before sharing.",
              },
              {
                title: "Common Use Cases for Removing PDF Pages",
                text: "Remove blank or empty pages from scanned documents. Delete confidential pages before sharing a report. Remove cover pages or headers from downloaded PDFs. Clean up multi-page forms by removing unused sections. Extract only the relevant portion of a large PDF document.",
              },
              {
                title: "Privacy and File Security",
                text: "PDFLinx takes your privacy seriously. Uploaded PDF files are processed securely and permanently deleted after conversion — never stored long-term, never shared with third parties. No account creation is required. Your documents remain completely private throughout the process.",
              },
              {
                title: "Remove PDF Pages on Any Device",
                text: "Works on Windows, macOS, Linux, Android, and iOS — directly in your browser. No app download needed. PDFLinx is fully responsive with thumbnail preview support on both desktop and mobile. Remove PDF pages anywhere, anytime.",
              },
            ],

            showPdfTypes: false,
          },
        }}

      />
    </>
  );
}


