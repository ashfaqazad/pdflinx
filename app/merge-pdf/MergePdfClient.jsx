"use client";

import { useState } from "react";
import { GitMerge, FileText, Scissors, Lock, Minimize2 } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── CONFIG ─────────────────────────────────
const DONE_LINKS = [
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ How merging works
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Select 2 or more PDF files</li>
      <li>Files merge in the order you upload them</li>
      <li>Remove &amp; re-add to change order</li>
      <li>Download one clean merged PDF</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Unlimited files",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">📄 About merging</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Combine 2 or more PDF files</li>
      <li>✓ Page order = upload order</li>
      <li>✓ Original quality preserved</li>
      <li>✓ No re-compression</li>
      <li>✓ Remove files before merging</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

export default function MergePdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // const handleDownload = () => {
  //   if (!downloadUrl) return;
  //   const a = document.createElement("a");
  //   a.href = downloadUrl;
  //   a.download = "pdflinx-merged.pdf";
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  // };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  // ── API LOGIC ─────────────────────────────
  const handleConvert = async () => {
    if (flow.files.length < 2)
      return alert("Please select at least 2 PDF files to merge.");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        cancelProgress();
        flow.handleError(errorData?.error || "Merge failed");
        return;
      }

      const data = await res.json();

      if (data.success) {
        // Direct VPS URL — same pattern as original
        const directUrl = `https://pdflinx.com/api${data.download}`;
        setDownloadUrl(directUrl);
        completeProgress();
        flow.finishSuccess();
      } else {
        cancelProgress();
        flow.handleError(data.error || "Merge failed");
      }
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ─────────────────────────

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Merge Multiple PDF Files Online for Free",
            url: "https://pdflinx.com/merge-pdf",
            step: [
              { "@type": "HowToStep", name: "Select PDF Files", text: "Click 'Select Files' and choose 2 or more PDF files from your device." },
              { "@type": "HowToStep", name: "Click Merge PDFs", text: "Press the 'Merge PDFs' button and wait a few seconds." },
              { "@type": "HowToStep", name: "Download Merged PDF", text: "Your merged PDF will be ready instantly — click download to save." },
            ],
            totalTime: "PT45S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://pdflinx.com/merge-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the PDF merger free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes — completely free with no signup, no watermark, and no hidden charges." } },
              { "@type": "Question", name: "Do I need to install any software to merge PDFs?", acceptedAnswer: { "@type": "Answer", text: "No. Everything works directly in your browser." } },
              { "@type": "Question", name: "Can I rearrange the order before merging?", acceptedAnswer: { "@type": "Answer", text: "Files merge in upload order. Remove and re-add files to change the sequence." } },
              { "@type": "Question", name: "Will the quality of my PDFs be affected?", acceptedAnswer: { "@type": "Answer", text: "No — merging keeps the original text and image quality without compression." } },
              { "@type": "Question", name: "Are my files safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and deleted automatically after merging." } },
              { "@type": "Question", name: "Can I merge PDFs on my phone?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on Android and iPhone, as well as Windows and macOS." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Merge PDF Files Online Free"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={true}
        convertLabel="Merge PDFs"
        uploadTitle="Drop your PDF files here"
        uploadSubtitle="or click to browse — select 2 or more PDFs"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        // Options
        optionsTitle="Merge options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={OPTIONS_SLOT}
        // Processing
        processingTitle="Merging your PDFs"
        processingDescription="Please wait while we combine your PDF files."
        processingStages={["Uploading files", "Merging pages", "Generating PDF"]}
        // Done
        doneTitle="Your merged PDF is ready"
        doneDescription="All PDF files have been merged into one successfully."
        doneFileName="pdflinx-merged.pdf"
        downloadLabel="Download Merged PDF"
        resetLabel="Merge another set"
        // Sidebar
        sidebarTitle="Merge PDF"
        sidebarIcon={<GitMerge className="h-5 w-5 text-indigo-500" />}
        sidebarDescription="Combine multiple PDF files into one clean, organized document instantly."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // uploadLanding={true}

        uploadInfo={
          <>
            <p>⏱️ Large PDF files may take up to 1 minute — don&apos;t close this tab</p>
            <p className="mt-1">
              📄 Select at least 2 PDF files · Merge order follows upload order
            </p>
          </>
        }

        // uploadLandingContent={{
        uploadLanding={{
          content: {
            eyebrow: "MERGE PDF TOOL",

            heroTitle: (
              <>
                Merge PDF Files <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  into One Document
                </em>
              </>
            ),

            heroDescription:
              "Combine multiple PDF files into a single clean document online for free. Fast, secure, and works on all devices.",

            uploadTitle: "Drop your PDF files here",
            uploadSubtitle: "or click to browse — select 2 or more PDFs",

            noticeTitle: "PDF Merge Features",

            noticeItems: [
              "Merge multiple PDF files instantly",
              "Original quality preserved",
              "Works directly in your browser",
            ],

            howToTitle: "How to Merge PDF Files",

            howToSteps: [
              {
                n: "1",
                title: "Upload PDF Files",
                desc: "Select 2 or more PDF files from your device. Files are merged in the same order you upload them.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Start Merging",
                desc: "Click Merge PDFs and PDFLinx will securely combine all pages into one organized PDF document.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Merged PDF",
                desc: "Download your merged PDF instantly after processing completes.",
                color: "bg-emerald-600",
              },
            ],

            seoSections: [
              {
                title: "Free Merge PDF Tool — Combine PDF Files Online",
                text: "Merge multiple PDF files into one organized document online for free using PDFLinx. No signup, no watermark, and no software installation required.",
              },

              {
                title: "What is PDF Merging?",
                text: "PDF merging combines two or more PDF documents into a single file while preserving original quality, layout, fonts, and images. It is useful for reports, invoices, contracts, assignments, and business documents.",
              },

              {
                title: "Why Choose PDFLinx?",
                text: "PDFLinx provides fast, secure, and simple PDF merging directly in your browser. Files remain private, quality stays preserved, and multiple PDFs can be combined instantly.",
              },

              {
                title: "Privacy and File Security",
                text: "Your uploaded PDF files are processed securely and automatically deleted after processing.",
              },

              {
                title: "Merge PDFs on Any Device",
                text: "Use PDFLinx on Windows, Mac, Linux, Android, iPhone, and tablets without installing software.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Merge PDF tool free?",
                a: "Yes, the Merge PDF tool is completely free to use.",
              },
              {
                q: "Can I merge multiple PDF files?",
                a: "Yes, you can combine multiple PDF files into one document.",
              },
              {
                q: "Will PDF quality be reduced after merging?",
                a: "No, PDFLinx preserves the original quality and formatting.",
              },
              {
                q: "Can I change the order before merging?",
                a: "Yes, files merge according to upload order. Remove and re-upload files to rearrange them.",
              },
              {
                q: "Do I need to install software?",
                a: "No, PDFLinx works completely online in your browser.",
              },
              {
                q: "Is my data secure?",
                a: "Yes, uploaded files are processed securely and deleted automatically.",
              },
              {
                q: "Can I merge PDFs on mobile?",
                a: "Yes, PDFLinx works on Android, iPhone, tablets, and desktop devices.",
              },
              {
                q: "Does PDFLinx add watermarks?",
                a: "No, merged PDF files do not contain any watermark.",
              },
              {
                q: "What happens if I upload only one file?",
                a: "At least 2 PDF files are required for merging.",
              },
              {
                q: "Can I merge large PDF files?",
                a: "Yes, large PDF files are supported depending on server limits.",
              },
              {
                q: "Do merged PDFs preserve formatting?",
                a: "Yes, original fonts, images, layout, and formatting remain preserved.",
              },
              {
                q: "Can I use Merge PDF without signup?",
                a: "Yes, no account or registration is required.",
              },

              {
                q: "How many PDF files can I merge at once?",
                a: "You can merge multiple PDF files together depending on current upload limits.",
              },
              {
                q: "Will merged PDFs preserve formatting?",
                a: "Yes, fonts, images, layout, and formatting remain preserved after merging.",
              },
              {
                q: "Can I reorder PDF files before merging?",
                a: "Yes, PDF files merge according to upload order. Remove and re-upload files to rearrange them.",
              },
              {
                q: "Does PDFLinx add watermarks?",
                a: "No, merged PDF files do not contain any watermark.",
              },

            ],
          },
        }}
          />

          {/* ── SEO CONTENT ── */ }
      {/* <RelatedToolsSection currentPage="merge-pdf" /> */}
    </>
  );
}

