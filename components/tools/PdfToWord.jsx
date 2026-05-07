// components/tools/PdfToWord.jsx
"use client";

import { useState } from "react";
import {
  FileText, GitMerge, Scissors, Table, Minimize2, FileType2,
  Download, CheckCircle, Lock
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow, STEPS } from "@/hooks/useToolFlow";

// ── Config ────────────────────────────────────────────
const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
];

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
      {/* ── SEO Schemas ── */}
      <Script id="howto-schema-pdf-to-word" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "HowTo",
            name: "How to Convert PDF to Word Online for Free",
            url: "https://pdflinx.com/pdf-to-word",
            step: [
              { "@type": "HowToStep", name: "Upload PDF File(s)", text: "Upload a single PDF or select multiple PDFs at once." },
              { "@type": "HowToStep", name: "Click Convert", text: "Press Convert to Word and wait while we process your file(s)." },
              { "@type": "HowToStep", name: "Download DOCX or ZIP", text: "Single file downloads as DOCX. Multiple files download as a ZIP." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          })
        }}
      />
      <Script id="breadcrumb-schema-pdf-to-word" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" },
            ],
          })
        }}
      />

      {/* FolderOpen, */}


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

        uploadLanding={true}

        // uploadLandingContent={{
        //   eyebrow: "PDF TO WORD CONVERTER",
        //   heroTitle: (
        //     <>
        //       Convert PDF to Word <br />
        //       in <span className="text-blue-600">Seconds ⚡</span>
        //     </>
        //   ),
        //   heroDescription:
        //     "Convert PDF to editable Word documents with perfect formatting. Fast, free and 100% secure — your files never leave your browser.",
        // }}

        uploadLandingContent={{
          eyebrow: "PDF TO WORD CONVERTER",

          heroTitle: (
            <>
              Convert PDF to Word <br />
              <em className="font-bold not-italic text-[#e8420a] sm:italic">in Seconds</em>

              {/* in <span className="text-blue-600">Seconds ⚡</span> */}
            </>
          ),

          heroDescription:
            "Turn PDFs into editable Word documents in seconds — keep text, layout, images, and tables clean without signup or watermark.",

          uploadTitle: "Drop your PDF here",
          uploadSubtitle: "or click to browse — PDF files supported",

          noticeTitle: "PDF to Word Conversion",
          noticeItems: [
            "Single PDF → DOCX",
            "Multiple PDFs → ZIP",
            "OCR available for scanned PDFs",
          ],

          howToTitle: "How to Convert PDF to Word",

          howToSteps: [
            {
              n: "1",
              title: "Upload Your PDF File(s)",
              desc: "Select one PDF or upload multiple files at once for batch conversion. Drag and drop supported on all devices.",
              color: "bg-blue-600",
            },
            {
              n: "2",
              title: "Enable OCR if Needed & Convert",
              desc: "For scanned PDFs, enable the OCR option first. Then click Convert — the tool processes your file and preserves formatting.",
              color: "bg-purple-600",
            },
            {
              n: "3",
              title: "Download DOCX or ZIP",
              desc: "Single file downloads as DOCX instantly. Multiple files are packaged into a ZIP containing all converted Word documents.",
              color: "bg-emerald-600",
            },
          ],

          seoSections: [
            {
              title: "Free PDF to Word Converter — Convert Scanned & Standard PDFs to Editable DOCX",
              text: "Need to edit a PDF? Convert PDF to Word online for free. PDFLinx helps you turn scanned and standard PDF files into editable DOCX documents while keeping formatting clean.",
            },
            // {
            //   title: "What is PDF to Word Conversion?",
            //   text: "PDF to Word conversion transforms a PDF file into an editable DOCX format. This allows you to modify text, reuse content, and update formatting easily.",
            // },
            {
              title: "What is PDF to Word Conversion?",
              text: "PDF to Word conversion allows you to turn a static PDF file into an editable DOCX document. This means you can update text, edit formatting, reuse content, and make changes easily without recreating the file from scratch. It is especially useful for reports, invoices, assignments, and scanned documents.",
            },
            // {
            //   title: "Why Choose PDFLinx?",
            //   text: "PDFLinx is fast, simple, and secure. No signup, no watermark, and no software installation required.",
            // },
            {
              title: "Why Choose PDFLinx?",
              text: "PDFLinx is designed for fast, simple, and secure PDF conversion. You can convert files without signup, without watermark, and without installing any software. It supports both standard and scanned PDFs with OCR, making it a reliable solution for everyday document editing needs.",
            },
            {
              title: "Privacy and File Security",
              text: "Your files are processed securely and handled with care. Conversion is safe and private.",
            },
            {
              title: "Convert PDF to Word on Any Device",
              text: "Works on Windows, Mac, Android, iPhone, and tablets — directly in your browser.",
            },
          ],

          faqs: [
            {
              q: "Is PDFLinx PDF to Word converter free?",
              a: "Yes, PDFLinx PDF to Word converter is completely free.",
            },
            {
              q: "Do I need to sign up?",
              a: "No account is required to convert files.",
            },
            {
              q: "Can I convert scanned PDFs?",
              a: "Yes, OCR helps convert scanned PDFs into editable Word files.",
            },
            {
              q: "Will formatting be preserved?",
              a: "We try to preserve layout, fonts, images, and structure as accurately as possible.",
            },
            {
              q: "Can I convert multiple PDFs?",
              a: "Yes, multiple PDFs are converted and downloaded as a ZIP file.",
            },
            {
              q: "Is my file secure?",
              a: "Files are processed securely and are not stored permanently.",
            },
            {
              q: "Can I use it on mobile?",
              a: "Yes, PDFLinx works on desktop, tablet, Android, iPhone, and iPad browsers.",
            },
            {
              q: "What is the maximum file size?",
              a: "File size limits depend on the current tool settings and server configuration.",
            },
            {
              q: "Can I edit the converted Word file?",
              a: "Yes, the converted DOCX file can be opened and edited in Microsoft Word or compatible editors.",
            },
            {
              q: "Does PDFLinx add a watermark?",
              a: "No, PDFLinx does not add a watermark to converted files.",
            },
            {
              q: "Can I convert PDF to DOCX?",
              a: "Yes, the converted file is provided in DOCX format.",
            },
            {
              q: "Why does Microsoft Word ask me to Enable Editing?",
              a: "This is normal for downloaded DOCX files. Click Enable Editing to start editing the document.",
            },
          ],
        }}


      />
      {/* <ToolPageLayout
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
        sidebarIcon={<FileType2 className="h-5 w-5 text-white" />}

        // sidebarIcon={<FileText className="h-5 w-5 text-white" />}
        sidebarTitle="PDF to Word"
        sidebarDescription="Convert PDF files into editable DOCX documents with a simple step-based experience."
        sidebarNotice={SIDEBAR_NOTICE}
        optionsSidebarNotice={optionsSidebarNotice}   // ← lowercase (component ke andar wala)
        sidebarFeatures={SIDEBAR_FEATURES}
        showOutputFormat={false}                       // ← ADD
        showPreserveLayout={false}                     // ← ADD
        optionsSlot={null}                             // ← OCR checkbox hata diya
      /> */}
      {/* <RelatedToolsSection currentPage="ppt-to-pdf" /> */}
      {/* {flow.step !== STEPS.UPLOAD && (
        <RelatedToolsSection currentPage="pdf-to-word" />
      )} */}

    </>
  );
}






