"use client";

import { useState } from "react";
// import { FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
import { useToolFlow, STEPS } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileText,
  GitMerge,
  Scissors,
  Table,
  Minimize2,
  Download,
  CheckCircle,
  Lock
} from "lucide-react";



// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },

];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ DOC & DOCX Supported
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Both old DOC and modern DOCX formats work</li>
      <li>Single file → PDF directly</li>
      <li>Multiple files → ZIP with all PDFs</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Preserves formatting",
  "✓ Works on all devices",
];
// ───────────────────────────────────────────

// ↓ YAHAN DAALO — SIDEBAR_FEATURES ke turant baad
const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">📄 About this conversion</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ DOC & DOCX both supported</li>
      <li>✓ Single file → PDF directly</li>
      <li>✓ Multiple files → ZIP with all PDFs</li>
      <li>✓ Fonts, tables & images preserved</li>
      <li>✓ No quality loss</li>
    </ul>
  </div>
);


export default function WordToPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // ── DOWNLOAD HANDLER ─────────────────────
  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "pdflinx-word-to-pdf.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── API LOGIC ────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select a Word file first!");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    for (const f of flow.files) formData.append("files", f);

    try {
      const res = await fetch("/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Conversion failed";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      // CASE A: Single PDF stream
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        completeProgress();
        flow.finishSuccess();
        return;
      }

      // CASE B: Multiple → ZIP
      if (
        contentType.includes("application/zip") ||
        contentType.includes("application/octet-stream")
      ) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        completeProgress();
        flow.finishSuccess();
        return;
      }

      throw new Error("Unexpected response from server.");
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };
  // ── END API LOGIC ────────────────────────

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Word to PDF Online for Free",
              url: "https://pdflinx.com/word-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Word File(s)",
                  text: "Upload one Word file or select multiple DOC/DOCX files.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press Convert to PDF and wait a few seconds.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF or ZIP",
                  text: "Single file downloads as PDF. Multiple files download as a ZIP.",
                },
              ],
              totalTime: "PT30S",
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
        id="breadcrumb-schema-word"
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
                  name: "Word to PDF",
                  item: "https://pdflinx.com/word-to-pdf",
                },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-word-to-pdf"
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
                  name: "Is the Word to PDF converter free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, completely free with no hidden charges.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need to install any software?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Everything works directly in your browser.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will my Word formatting be preserved?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, fonts, tables, images, and layout are preserved accurately.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I convert multiple Word files at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Upload up to 10 files — all PDFs delivered as a ZIP download.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        // Title + Tagline
        title={seo?.h1 || "Word to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        // uploadTitle="Drop your Word file here"
        // uploadSubtitle="or click to browse — DOC/DOCX supported"
        // File input
        accept=".doc,.docx"
        multiple={true}
        // Buttons
        convertLabel="Convert to PDF"
        // Flow state
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        // Options Step
        optionsTitle="Conversion options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        // optionsSlot={null}
        // Processing Step
        processingTitle="Converting to PDF"
        processingDescription="Please wait while we prepare your PDF document."
        processingStages={["Uploading file", "Converting to PDF", "Finalising"]}
        // Done Step
        doneTitle="Your PDF is ready"
        doneDescription="Your Word document has been converted to PDF successfully."
        doneFileName="converted.pdf"
        downloadLabel="Download PDF"
        resetLabel="Convert another file"
        // Sidebar
        sidebarTitle="Word to PDF"
        sidebarIcon={<FileText className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Convert Word documents to PDF instantly — formatting preserved."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // uploadLanding={true}
        uploadTitle="Drop your Word file here"
        uploadSubtitle="or click to browse — DOC/DOCX supported"
        uploadInfo={
          <>
            <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
            <p className="mt-1">
              🔢 Max 10 Word files at once · Single file → PDF · Multiple → ZIP
            </p>
          </>
        }

        // uploadLandingContent={{
        uploadLanding={{

          content: {
            heroBadge: "✦ Word to PDF Converter · No Signup Required",

            // eyebrow: "WORD TO PDF CONVERTER",

            heroTitle: (
              <>
                Convert Word to PDF Online for Free {" "}
                <em className="font-bold text-[#e8420a] sm:italic">in Seconds</em>

                {/* in <span className="text-blue-600">Seconds ⚡</span> */}
              </>
            ),

            heroDescription:
              "Convert DOC and DOCX files into clean PDF documents instantly. Formatting stays preserved.",

            uploadTitle: "Drop your Word file here",
            uploadSubtitle: "or click to browse — DOC/DOCX supported",

            noticeTitle: "DOC & DOCX Supported",
            noticeItems: [
              "Both DOC and DOCX files supported",
              "Single file → PDF",
              "Multiple files → ZIP",
            ],

            howToTitle: "How to Convert Word to PDF",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your Word File(s)",
                desc: "Upload DOC or DOCX files from your device. Multiple Word documents can be added for batch PDF conversion.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Start the Conversion",
                desc: "Click Convert to PDF and let PDFLinx process your Word documents while preserving formatting, images, and layout.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PDF File",
                desc: "Download the converted PDF instantly. Multiple converted files are automatically packaged into a ZIP file.",
                color: "bg-emerald-600",
              },
            ],

            seoSections: [
              {
                title: "Free Word to PDF Converter — Convert DOC & DOCX to PDF Online",
                text: "Convert Word documents (DOC & DOCX) to high-quality PDF files instantly. PDFLinx preserves fonts, formatting, images, tables, and layout perfectly without signup or watermark.",
              },
              {
                title: "What is Word to PDF Conversion?",
                text: "Word to PDF conversion transforms editable Microsoft Word documents (.doc, .docx) into fixed, secure, and universally compatible PDF files. PDFs maintain consistent formatting across all devices and are ideal for sharing and professional use.",
              },
              {
                title: "Why Choose PDFLinx?",
                text: "PDFLinx offers fast, secure, and easy Word to PDF conversion. No signup, no watermark, no software installation. It supports batch conversion and works directly in your browser on all devices.",
              },
              {
                title: "Common Use Cases for Word to PDF Conversion",
                text: "• Students & Researchers: Submit assignments, theses, and reports\n\n• Job Seekers: Convert resumes and CVs for job applications\n\n• Professionals: Share reports, proposals, contracts, and presentations\n\n• Businesses: Invoices, agreements, quotations, and official documents\n\n• Teachers: Create worksheets and study materials\n\n• Freelancers: Deliver client deliverables safely",
              },
              {
                title: "Convert Word to PDF on Any Device",
                text: "No software installation needed. Works perfectly on Windows, Mac, Linux, Android, iPhone, iPad, and tablets directly in your browser.",
              },
              {
                title: "Privacy and File Security",
                text: "Your uploaded Word files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or view your documents.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Word to PDF converter free?",
                a: "Yes, PDFLinx Word to PDF converter is completely free. No hidden charges, no premium plans, and no limits.",
              },
              {
                q: "Do I need to create an account?",
                a: "No, no signup or account creation is required. You can convert Word files to PDF instantly.",
              },
              {
                q: "Can I convert both DOC and DOCX files?",
                a: "Yes, the tool supports both old .DOC and modern .DOCX Word document formats.",
              },
              {
                q: "Will the original formatting be preserved?",
                a: "We make every effort to preserve fonts, images, tables, headings, spacing, and overall layout. DOCX files usually give the best results.",
              },
              {
                q: "Can I convert multiple Word files at once?",
                a: "Yes, you can upload up to 10 Word files together. All converted PDFs will be packaged into a single ZIP file for easy download.",
              },
              {
                q: "Are my files safe and private?",
                a: "Yes, your files are processed securely on our servers and automatically deleted after 1 hour. No one can access your documents.",
              },
              {
                q: "Can I use the Word to PDF converter on mobile?",
                a: "Yes, PDFLinx works perfectly on Android, iPhone, iPad, tablets, Windows, and Mac browsers.",
              },
              {
                q: "What is the maximum file size supported?",
                a: "You can convert files up to 10 MB for a single file and up to 50 MB combined for multiple files.",
              },
              {
                q: "Does PDFLinx add any watermark?",
                a: "No, PDFLinx does not add any watermark. The final PDF remains 100% clean and original.",
              },
              {
                q: "Do I need Microsoft Word installed to use this tool?",
                a: "No, the entire conversion process happens online in your browser. Microsoft Word is not required.",
              },
              {
                q: "What happens if I upload only one Word file?",
                a: "It will be converted and downloaded directly as a single PDF file.",
              },
              {
                q: "How can I reduce the size of the converted PDF?",
                a: "You can use our Compress PDF tool after conversion to reduce file size while maintaining good quality.",
              },
            ],
          },
        }}

      />

      {/* ── SEO CONTENT ── */}
      {/* <RelatedToolsSection currentPage="word-to-pdf" /> */}
    </>
  );
}



