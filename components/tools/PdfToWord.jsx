// components/tools/PdfToWord.jsx
"use client";

import { useState } from "react";
import {
  FileText,
  GitMerge,
  Minimize2,
  FileSpreadsheet,
  FileSearch,
  Scan,
  Image as ImageIcon,
  Pencil
} from "lucide-react";

import Link from "next/link";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow, STEPS } from "@/hooks/useToolFlow";

// ── Config ────────────────────────────────────────────
// PDF to Word ke liye
// Imports needed: FileText, FileSpreadsheet, Image, FileSearch, 
// Minimize2, GitMerge, Shield, Pencil (from lucide-react)

const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  { label: "PDF to Text", href: "/pdf-to-text", icon: <FileSearch className="h-4 w-4 text-yellow-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
  { label: "PDF to JPG", href: "/pdf-to-jpg", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
];

// const DONE_LINKS = [
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
//   { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

// UPLOAD step sidebar notice — MS Word compatibility
const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ Microsoft Word Compatibility
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
      <li>Converted files open best in <strong>Microsoft Word 2013 or newer</strong></li>
      <li>Click <strong>&quot;Enable Editing&quot;</strong> when prompted — this is normal</li>
      <li>Older Word versions may not fully support modern DOCX files</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Single & batch conversion",
  "✓ OCR for scanned PDFs",
  "✓ Works on Windows, Mac, Android & iOS",
];
// ─────────────────────────────────────────────────────

export default function PdfToWord({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();
  const [enableOcr, setEnableOcr] = useState(false);
  const [downloadFile, setDownloadFile] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleDownload = () => {
    if (!downloadFile?.blob) return;
    const urlObj = URL.createObjectURL(downloadFile.blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = downloadFile.filename || "pdflinx-pdf-to-word.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };


  const optionsSidebarNotice = (
    <div className="space-y-3">
      <button type="button" onClick={() => setEnableOcr(false)}
        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${!enableOcr ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
      >
        <div>
          <p className="text-sm font-bold text-blue-600">NO OCR</p>
          <p className="mt-0.5 text-xs text-slate-500">Convert PDFs with selectable text into editable Word files.</p>
        </div>
        {!enableOcr && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      <button type="button" onClick={() => setEnableOcr(true)}
        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${enableOcr ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-orange-500">OCR</p>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Free</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Convert scanned PDFs with non-selectable text into editable Word files.</p>
        </div>
        {enableOcr && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );

  // ── API Logic ─────────────────────────────────────
  const handleConvert = async () => {
    flow.startProcessing();
    startProgress();
    setDownloadFile(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("enable_ocr", enableOcr ? "1" : "0");

    const pollIntervalMs = 1500;
    const maxWaitMs = 15 * 60 * 1000;
    const startedAt = Date.now();

    const fetchJson = async (url, options) => {
      const r = await fetch(url, { cache: "no-store", ...options });
      const ct = r.headers.get("content-type") || "";
      let payload = null;
      if (ct.includes("json")) { try { payload = await r.json(); } catch { } }
      if (!r.ok) {
        const msg = payload?.detail || payload?.error || `Request failed ${r.status}`;
        const err = new Error(msg); err.status = r.status; throw err;
      }
      return payload ?? {};
    };

    const downloadViaBlob = async (url, filenameFallback) => {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`Download failed ${r.status}`);
      const blob = await r.blob();
      const cd = r.headers.get("content-disposition") || "";
      const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
      const filename = match ? decodeURIComponent(match[1]) : filenameFallback;
      setDownloadFile({ blob, filename: filename || filenameFallback || "pdflinx-pdf-to-word.docx" });
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = filename || filenameFallback || "pdflinx-pdf-to-word.docx";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(urlObj);
    };

    const getJobStatus = async (jobId) => {
      try { return await fetchJson(`/api/convert/job/${jobId}`); }
      catch (err) {
        if (err?.status === 404) return await fetchJson(`/convert/job/${jobId}`);
        throw err;
      }
    };

    const downloadResult = async (jobId) => {
      try { await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx"); }
      catch { await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx"); }
    };

    let stopped = false;

    const poll = async (jobId) => {
      if (stopped) return;
      if (Date.now() - startedAt > maxWaitMs) {
        cancelProgress(); flow.handleError("Conversion timeout. Please try again."); return;
      }
      try {
        const statusData = await getJobStatus(jobId);
        if (statusData?.status === "done") {
          await downloadResult(jobId); completeProgress(); flow.finishSuccess(); return;
        }
        if (statusData?.status === "failed") {
          cancelProgress(); flow.handleError(statusData?.error || "Conversion failed on server"); return;
        }
        setTimeout(() => poll(jobId), pollIntervalMs);
      } catch (err) {
        cancelProgress(); flow.handleError(err?.message || "Polling failed");
      }
    };

    try {
      const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        let msg = `Server error ${res.status}`;
        if (ct.includes("json")) { try { const e = await res.json(); msg = e.detail || e.error || msg; } catch { } }
        throw new Error(msg);
      }
      if (ct.includes("zip")) {
        const blob = await res.blob();
        setDownloadFile({ blob, filename: "pdflinx-pdf-to-word.zip" });
        const urlObj = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlObj; a.download = "pdflinx-pdf-to-word.zip";
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(urlObj);
        completeProgress(); flow.finishSuccess(); return;
      }
      if (!ct.includes("json")) throw new Error(`Unexpected response: ${ct}`);
      const data = await res.json();
      if (!data?.jobId) throw new Error("Job ID not received");
      poll(data.jobId);
    } catch (err) {
      stopped = true; cancelProgress();
      flow.handleError(err?.message || "Something went wrong");
    }
  };
  // ── End API Logic ──────────────────────────────────

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - PDF to Word */}
      <Script
        id="howto-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Word Online for Free",
              description:
                "Convert PDF to editable Word DOCX online free — no signup, no watermark. Supports scanned PDFs via OCR. Batch convert up to 10 files. Works on Windows, Mac, Android, iOS.",
              url: "https://pdflinx.com/pdf-to-word",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF File(s)",
                  text: "Upload a single PDF or select multiple PDFs at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press 'Convert to Word' and wait a few seconds while we process your file(s).",
                },
                {
                  "@type": "HowToStep",
                  name: "Download DOCX (or ZIP)",
                  text: "Single file downloads as DOCX. Multiple files download as a ZIP containing all DOCX files.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              tool: [{ "@type": "HowToTool", name: "PDFLinx PDF to Word Converter" }],
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      {/* Breadcrumb Schema - PDF to Word */}
      <Script
        id="breadcrumb-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is the PDF to Word converter free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. PDFLinx provides a completely free PDF to Word converter with no signup and no watermark."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to install any software?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No installation is required. The tool works directly in your browser on mobile, tablet, and desktop."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will formatting stay the same after conversion?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most formatting such as text, tables, and images is preserved. Very complex PDFs may need small adjustments after conversion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert scanned PDFs to editable Word documents?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Enable OCR to extract text from scanned or image-based PDFs and convert them into editable Word documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert multiple PDFs to Word at the same time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Upload multiple PDF files and they will be converted together. You will receive a ZIP file containing all DOCX documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are my files safe and private?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Files are processed securely and automatically removed after processing to protect your privacy."
                  }
                }
              ]
            },
            null,
            2
          )
        }}
      />

      <Script
        id="software-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",

              "name": "PDFLinx PDF to Word Converter",
              "url": "https://pdflinx.com/pdf-to-word",

              "applicationCategory": "BusinessApplication",

              "operatingSystem": "Windows, macOS, Linux, Android, iOS",

              "browserRequirements":
                "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",

              "description":
                "Free online PDF to Word converter. Convert PDF files into editable DOCX documents without signup or watermark. Supports OCR for scanned PDFs and batch conversion.",

              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },

              "featureList": [
                "PDF to DOCX conversion",
                "OCR for scanned PDFs",
                "Batch PDF conversion",
                "No watermark",
                "No signup required",
                "Works on mobile and desktop"
              ],

              "image": "https://pdflinx.com/og-image.png",

              "provider": {
                "@type": "Organization",
                "name": "PDFLinx",
                "url": "https://pdflinx.com"
              }
            },
            null,
            2
          ),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "PDF to Word Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={true}
        convertLabel="Convert to Word"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        // sidebarIcon={<FileText className="h-5 w-5 text-white" />}

        sidebarIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-7 w-7"
            fill="none"
          >
            <path
              d="M18 8h25l8 8v40H18V8z"
              fill="#f4f1ff"
            />
            <path
              d="M43 8v10h8"
              fill="#dcd6f7"
            />
            <path
              d="M25 29h17M25 36h17M25 43h12"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        }

        // sidebarIcon={<FileType2 className="h-5 w-5 text-white" />}
        sidebarTitle="PDF to Word"
        sidebarDescription="Convert PDF files into editable DOCX documents with a simple step-based experience."
        sidebarNotice={SIDEBAR_NOTICE}
        optionsSidebarNotice={optionsSidebarNotice}
        sidebarFeatures={SIDEBAR_FEATURES}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={null}
        uploadTitle="Drop your PDF here"

        uploadInfo={
          <>
            <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
            <p className="mt-1">
              🔢 Max 10 PDF files at once · Single PDF → DOCX · Multiple → ZIP
            </p>
          </>
        }

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS, 

            eyebrow: "PDF TO WORD CONVERTER",

            breadcrumbCurrent: "PDF to Word Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            heroTitle: (
              <>
                PDF to Word Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Free, Online, OCR Supported
                </em>
              </>
            ),

            heroDescription:
              "Convert PDF to Word online for free. Get fully editable DOCX files with text, tables, images, and layout preserved — including scanned PDFs via OCR. No signup, no watermark, no software needed.",

            pills: [
              "No watermark",
              "OCR for scanned PDFs",
              "Works on any device",
              "Instant conversion",
            ],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PDF to Word Conversion",
            noticeItems: [
              "Single PDF → DOCX",
              "Multiple PDFs → ZIP",
              "OCR available for scanned PDFs",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: true,
              eyebrow: "PDF Types",
              title: "Standard PDF vs Scanned PDF",
              subtitle:
                "Know the difference — choose the right conversion option for best results.",
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert PDF to Word — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File(s)",
                desc: "Select one PDF or upload multiple files at once for batch conversion. Drag and drop supported on all devices — mobile, tablet, desktop.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Enable OCR if Needed & Convert",
                desc: "For scanned PDFs or image-based files, enable OCR before converting. Click Convert — formatting, tables, and images are preserved automatically.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download DOCX or ZIP",
                desc: "Single file downloads as DOCX instantly. Multiple files are packaged into a ZIP containing all converted Word documents — ready to edit.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF to Word Converter",

            seoBadge: "PDF to Word Guide",
            seoTitle: "Complete Guide to PDF to Word Conversion",
            seoDescription:
              "Everything you need to know about converting PDF files to editable Word documents — free, online, with OCR support. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF to Word Converter — Convert Scanned & Standard PDFs to Editable DOCX",
                text: "Need to edit a PDF? PDFLinx lets you convert PDF to Word online for free — including scanned PDFs using OCR (Optical Character Recognition). Turn any static PDF into a fully editable DOCX document without losing formatting, tables, or images. Whether it is a report, invoice, resume, or assignment, PDFLinx converts it instantly with no signup, no watermark, no software installation required. It is the best free PDF to Word converter available online today.",
              },
              {
                title: "What is PDF to Word Conversion?",
                text: "PDF to Word conversion allows you to turn a static PDF file into an editable DOCX document. This means you can update text, edit formatting, reuse content, and make changes easily without recreating the file from scratch. It is especially useful for reports, invoices, assignments, and scanned documents where the original source file is unavailable. The output DOCX file is fully compatible with Microsoft Word, Google Docs, and LibreOffice.",
              },
              {
                title:
                  "How to Convert PDF to Word Without Losing Formatting",
                text: "One of the most common concerns is whether formatting stays intact after conversion. PDFLinx uses advanced document parsing to preserve tables, fonts, line spacing, images, and paragraph structure. For standard PDFs, formatting accuracy is very high. For scanned PDFs, our OCR engine extracts text from images and reconstructs the layout as closely as possible — giving you a clean, editable Word file ready for immediate use. If you need to convert a scanned PDF to an editable Word document, simply enable OCR before clicking Convert. Complex multi-column layouts may need minor adjustments in Word, but overall structure is always maintained.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF to Word Converter — No Watermark, No Limits",
                text: "Most free PDF to Word converters either add watermarks, limit file size, require account creation, or lock OCR behind a paywall. PDFLinx does none of that — completely free, no signup, no watermark, and no conversion limit. What makes PDFLinx the best free alternative is built-in OCR support for scanned PDFs, which most free tools including iLovePDF free tier and Smallpdf free tier do not fully offer. You get accurate text extraction from image-based PDFs without paying for Adobe Acrobat or a premium subscription.",
              },
              {
                title: "Common Use Cases for PDF to Word Conversion",
                text: "✓ Students & Researchers: Convert study notes, research papers, theses, and assignments into editable format.\n✓ Professionals & Office Workers: Edit reports, proposals, contracts, and business documents.\n✓ Job Seekers: Quickly update resumes and CVs without recreating them from scratch.\n✓ Lawyers & Accountants: Modify legal contracts, invoices, agreements, and financial documents.\n✓ HR Teams: Edit offer letters, company policies, and employee forms.\n✓ Teachers & Freelancers: Update worksheets, lesson plans, and client deliverables.",
              },
              {
                title:
                  "Convert PDF to Word on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works on every platform without any installation. On iPhone or Android, open your browser and upload directly — no app download required. On Mac or Windows, drag and drop your PDF and download the DOCX instantly. Unlike desktop software like Adobe Acrobat, PDFLinx is fully online and free. Whether you need to convert PDF to Word on mobile or desktop, PDFLinx works seamlessly on every device and operating system.",
              },
              {
                title:
                  "PDFLinx vs iLovePDF vs Smallpdf — Free PDF to Word Converter Comparison",
                text: "iLovePDF and Smallpdf both limit free conversions per day and require sign-up for full OCR features. Adobe Acrobat charges a monthly subscription for PDF to Word export. PDFLinx offers unlimited free conversions with built-in OCR — no account, no watermark, no daily limits. For anyone looking for the best free iLovePDF alternative or Smallpdf alternative for PDF to Word conversion, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "PDF to Word Converter vs Copy-Paste — Why a Proper Converter Gives Better Results",
                text: "Many people try to copy text from a PDF and paste it into Word manually — but this approach breaks tables, loses formatting, scrambles multi-column layouts, and fails completely on scanned PDFs. A proper PDF to Word converter like PDFLinx handles all of this automatically. It preserves document structure, keeps tables intact, extracts images in place, and uses OCR to handle scanned pages — giving you a Word document that looks like the original PDF, ready to edit immediately.",
              },
              {
                title: "Best For Everyday Document Editing",
                text: "Use the converted Word file for reports, assignments, invoices, contracts, forms, and office documents. The DOCX output is compatible with Microsoft Word, Google Docs, LibreOffice, and WPS Office — easy to edit, share, and reuse on any device.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF to Word converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of conversions. Convert as many PDFs as you need at zero cost.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "Can I convert scanned PDFs to editable Word?",
                a: "Yes. Enable the OCR option before converting — our OCR engine extracts text from scanned or image-based PDFs and produces a fully editable DOCX file.",
              },
              {
                q: "Will the original formatting be preserved after conversion?",
                a: "Yes, for standard PDFs formatting is preserved very accurately — including text, tables, columns, and images. Scanned PDFs may have minor differences depending on scan quality, but overall structure is always maintained.",
              },
              {
                q: "Can I convert multiple PDFs to Word at once?",
                a: "Yes. Upload multiple PDF files and all converted Word documents will be automatically packed into a single ZIP file for easy download.",
              },
              {
                q: "Does PDFLinx add any watermark?",
                a: "No watermarks, ever. Your converted Word document is 100% clean and ready to use or share.",
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
                q: "How do I convert PDF to Word without losing formatting?",
                a: "Upload your PDF and click Convert — PDFLinx automatically preserves tables, fonts, images, and layout. For scanned PDFs, enable OCR first for best formatting accuracy.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 10 MB per single file and up to 50 MB combined for batch uploads. For larger files, try splitting the PDF first using our free PDF Split tool.",
              },
              {
                q: "Why does Microsoft Word ask to Enable Editing after download?",
                a: "This is a standard Word security prompt for downloaded files — completely safe and normal. Just click Enable Editing to start making changes to your document.",
              },
              {
                q: "Can I convert password-protected PDFs?",
                a: "You need to unlock the PDF first before uploading. Use our free PDF Unlock tool to remove the password, then convert to Word.",
              },
              {
                q: "What file format will I receive after conversion?",
                a: "You will receive a .DOCX file — fully compatible with Microsoft Word, Google Docs, LibreOffice, and WPS Office.",
              },
              {
                q: "How long does PDF to Word conversion take?",
                a: "Most conversions complete within 10 to 30 seconds depending on file size and complexity. Scanned PDFs with OCR may take slightly longer.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free conversion?",
                a: "Yes — PDFLinx offers unlimited free conversions with built-in OCR, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict OCR and batch conversion behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert PDF to Word now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate PDF to Word conversion every day.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>


  );
}






