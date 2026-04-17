// app/pdf-to-word/page.js

"use client";
import { useState } from "react";
import Link from "next/link";
import { Upload, Download, CheckCircle, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";



// export default function PdfToWord() {
export default function PdfToWord({ seo }) {

  const [files, setFiles] = useState([]); // ✅ multiple PDFs
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // const [progress, setProgress] = useState(0);
  const [enableOcr, setEnableOcr] = useState(false);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  // ✅ only for ZIP downloads (multiple files)
  const [downloadUrl, setDownloadUrl] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select at least one PDF file");

    startProgress();        // ← setLoading(true) + setProgress(0) ki jagah
    setSuccess(false);
    setError("");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("enable_ocr", enableOcr ? "1" : "0");

    const pollIntervalMs = 1500;
    const maxWaitMs = 15 * 60 * 1000;
    const startedAt = Date.now();

    // Helper: fetch JSON with better errors
    const fetchJson = async (url, options) => {
      const r = await fetch(url, { cache: "no-store", ...options });
      const ct = r.headers.get("content-type") || "";
      let payload = null;

      if (ct.includes("json")) {
        try { payload = await r.json(); } catch { }
      }

      if (!r.ok) {
        const msg =
          payload?.detail || payload?.error || `Request failed ${r.status} ${r.statusText}`;
        const err = new Error(msg);
        err.status = r.status;
        err.payload = payload;
        throw err;
      }

      return payload ?? {};
    };

    // Helper: download file as blob
    const downloadViaBlob = async (url, filenameFallback) => {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`Download failed ${r.status}`);

      const blob = await r.blob();
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;

      const cd = r.headers.get("content-disposition") || "";
      const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
      const filename = match ? decodeURIComponent(match[1]) : filenameFallback;

      a.download = filename || "pdflinx-download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);
    };

    const getJobStatus = async (jobId) => {
      try {
        return await fetchJson(`/api/convert/job/${jobId}`);
      } catch (err) {
        if (err?.status === 404) {
          return await fetchJson(`/convert/job/${jobId}`);
        }
        throw err;
      }
    };

    const downloadResult = async (jobId) => {
      try {
        await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
      } catch (err) {
        if (err?.message?.includes("404")) {
          await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
          return;
        }
        try {
          await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
        } catch {
          throw err;
        }
      }
    };

    let stopped = false;
    const poll = async (jobId) => {
      if (stopped) return;

      if (Date.now() - startedAt > maxWaitMs) {
        cancelProgress();     // ← setLoading(false) ki jagah
        setError("Conversion timeout. Please try again.");
        return;
      }

      try {
        const statusData = await getJobStatus(jobId);
        const status = statusData?.status;

        if (status === "queued") {
          // progress bar apna kaam kar raha hai, kuch nahi karna
        } else if (status === "processing") {
          // hook ka progress chal raha hai, override nahi karna

        } else if (status === "done") {
          setFiles([]);
          await downloadResult(jobId);
          completeProgress();   // ← setProgress(100) + setLoading(false) ki jagah
          setSuccess(true);
          return;

        } else if (status === "failed") {
          cancelProgress();     // ← setLoading(false) ki jagah
          setError(statusData?.error || "Conversion failed on server");
          return;
        }

        setTimeout(() => poll(jobId), pollIntervalMs);
      } catch (err) {
        cancelProgress();       // ← setLoading(false) ki jagah
        setError(err?.message || "Polling failed");
      }
    };

    try {
      const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok) {
        let msg = `Server error ${res.status}`;
        if (ct.includes("json")) {
          try {
            const err = await res.json();
            msg = err.detail || err.error || msg;
          } catch { }
        }
        throw new Error(msg);
      }

      // CASE A: ZIP directly
      if (ct.includes("application/zip") || ct.includes("zip")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "pdflinx-pdf-to-word.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        completeProgress();   // ← setProgress(100) + setLoading(false) ki jagah
        setSuccess(true);
        setFiles([]);
        return;
      }

      // CASE B: JSON job
      if (!ct.includes("json")) {
        throw new Error(`Unexpected response type: ${ct}`);
      }

      const data = await res.json();
      const jobId = data?.jobId;
      if (!jobId) throw new Error("Job ID not received from server");

      poll(jobId);

    } catch (err) {
      stopped = true;
      cancelProgress();         // ← setLoading(false) ki jagah
      setError(err?.message || "Something went wrong");
    }
  };

  // ✅ Only for ZIP downloads (multiple PDFs)
  const handleDownloadZip = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-pdf-to-word.zip";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("There was a problem with the download.");
      console.error(err);
    }
  };

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
              "@type": "SoftwareApplication",
              "name": "PDFLinx PDF to Word Converter",
              "url": "https://pdflinx.com/pdf-to-word",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web, Windows, macOS, Android, iOS",
              "browserRequirements": "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
              "description": "Free online PDF to Word converter. No signup, no watermark. Supports scanned PDFs via OCR. Batch convert up to 10 PDFs at once.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "PDF to DOCX conversion",
                "OCR for scanned PDFs",
                "Batch conversion up to 10 files",
                "No watermark",
                "No signup required"
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


      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              {seo?.h1 || "Convert PDF to Word Online Free"}
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF to editable Word (DOCX) free — no signup, no watermark, no software needed.
              Works on Windows, Mac, Android and iOS. Supports scanned PDFs via OCR.
              Upload one file or batch convert up to 10 PDFs at once.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Drag & drop or click" },
              { n: "2", label: "Enable OCR", sub: "Only for scanned PDFs" },
              { n: "3", label: "Get DOCX", sub: "Instant download" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                  {s.n}
                </div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── MAIN CARD ── */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* conversion overlay — blurs content during loading */}
            <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

              {/* blur overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-green-200 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">Converting your file{files.length > 1 ? "s" : ""}…</p>
                    <p className="text-sm text-gray-400 mt-1">{progress < 30 ? "Uploading…" : progress < 70 ? "Processing…" : "Almost done…"}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-5">

                {/* ── DROPZONE ── */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${files.length
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
                      }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${files.length ? "bg-green-100" : "bg-blue-50 group-hover:bg-blue-100"
                        }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Upload className="w-7 h-7 text-blue-500" />
                      )}
                    </div>

                    {files.length ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Click to change selection</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                          {files.slice(0, 5).map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
                            >
                              <FileText className="w-3 h-3" />
                              {f.name.length > 24 ? f.name.slice(0, 22) + "…" : f.name}
                            </span>
                          ))}
                          {files.length > 5 && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                              +{files.length - 5} more
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your PDF file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Up to 10 PDFs", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    required
                  />
                </label>

                {/* ── OCR + Convert Button Row ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <label className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition flex-1">
                    <input
                      type="checkbox"
                      checked={enableOcr}
                      onChange={(e) => setEnableOcr(e.target.checked)}
                      className="mt-0.5 accent-blue-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Enable OCR</p>
                      <p className="text-xs text-gray-400 mt-0.5">For scanned / image PDFs</p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${files.length && !isLoading
                      ? "bg-linear-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 hover:shadow-md active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <FileText className="w-4 h-4" />
                    Convert to Word
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>🔢 Max 10 PDF files at once · Single PDF → DOCX · Multiple → ZIP</p>
                </div>

              </form>

              {/* MS Word compatibility notice */}
              <div className="mx-8 mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700">
                <p className="font-semibold text-blue-800 mb-1.5">ℹ️ Microsoft Word Compatibility</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600 text-xs">
                  <li>Converted files open best in <strong>Microsoft Word 2013 or newer</strong></li>
                  <li>Click <strong>&quot;Enable Editing&quot;</strong> when prompted — this is normal</li>
                  <li>Older Word versions may not fully support modern DOCX files</li>
                </ul>
              </div>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE ── */}
            {success && (
              <div className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-linear-to-br from-green-50 to-emerald-50">
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    Conversion Complete! 🎉
                  </h3>
                  <p className="text-sm text-green-700 font-medium mb-1">
                    Your file{files.length === 1 ? " has" : "s have"} been downloaded automatically
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    {files.length === 1
                      ? "Check your downloads folder for the DOCX file"
                      : "Check your downloads — ZIP contains all converted DOCX files"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); setError(""); }}
                      className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Convert another PDF
                    </button>
                    <Link
                      href="/word-to-pdf"
                      className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Word to PDF →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── ERROR STATE ── */}
            {error && (
              <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
                ⚠️ {error}
              </div>
            )}

          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single &amp; batch conversion • OCR for scanned PDFs • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>


      {/* ==================== SEO CONTENT SECTION ==================== */}
      < section className="mt-16 max-w-4xl mx-auto px-6 pb-16" >
        {/* Main Heading */}
        <div div className="text-center mb-12" >
          <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free PDF to Word Converter — Convert Scanned & Standard PDFs to Editable DOCX
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to edit a PDF? Convert it to Word here — text, tables, images,
            and layout move over cleanly so you can edit straight away. Supports
            single file and batch conversion. Scanned PDFs supported via OCR.
            Fast, free, and privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div div className="grid md:grid-cols-3 gap-8 mb-16" >
          <div className="bg-linear-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Accurate Text & Layout</h3>
            <p className="text-gray-600 text-sm">
              Text, tables, headings, images, and spacing transfer cleanly into
              Word — ready to edit without major cleanup for most standard PDFs.
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">OCR for Scanned PDFs</h3>
            <p className="text-gray-600 text-sm">
              Enable OCR to extract text from image-based and scanned PDFs —
              turning non-editable scans into fully editable DOCX documents.
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one PDF to DOCX directly, or upload up to 10 PDFs at once
              and download all converted Word files as a single ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100" >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert PDF to Word — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PDF or upload multiple files at once for batch
                conversion. Drag and drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Enable OCR if Needed & Convert</h4>
              <p className="text-gray-600 text-sm">
                For scanned PDFs, enable the OCR option first. Then click
                Convert — the tool processes your file and preserves formatting.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download DOCX or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as DOCX instantly. Multiple files are
                packaged into a ZIP containing all converted Word documents.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div div className="mt-10 bg-white p-6 md:p-8 shadow-sm" >
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to create a PDF too?
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Many workflows go both ways — convert documents into PDF, then edit PDFs back in Word.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">
                Word to PDF Converter
              </Link>{" "}
              <span className="text-slate-600">— export your edited DOCX back to PDF instantly.</span>
            </li>
            <li>
              <Link href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
                Merge PDF
              </Link>{" "}
              <span className="text-slate-600">— combine multiple PDFs into one before converting.</span>
            </li>
            <li>
              <Link href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
                Compress PDF
              </Link>{" "}
              <span className="text-slate-600">— reduce PDF file size before or after conversion.</span>
            </li>
            <li>
              <Link href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">
                Browse all PDF tools
              </Link>{" "}
              <span className="text-slate-600">— merge, split, compress, protect & more.</span>
            </li>
            <li>
              <Link href="/pdf-to-word-for-students" className="text-blue-700 font-semibold hover:underline">
                PDF to Word for Students
              </Link>{" "}
              <span className="text-slate-600">— optimized guide for students converting PDFs.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to convert PDFs into
          editable Word documents — fast, accurate, and always free.
        </p>
      </section >

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700" >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to Word Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever had a PDF you needed to edit right now — but couldn't? That's exactly
          what this tool solves. The{" "}
          <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span>{" "}
          extracts text, tables, images, and layout from any PDF and delivers a
          clean, editable Word (DOCX) file in seconds — with no software installation
          and no account required. Upload multiple PDFs and get everything in one ZIP.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF to Word Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to Word conversion transforms a fixed, non-editable PDF file into a
          Microsoft Word document (DOCX format) that you can freely edit — update
          text, fix typos, modify tables, or reuse content in your own templates.
          Our converter preserves the original text flow, heading structure, table
          layouts, and embedded images as accurately as possible, including support
          for scanned PDFs via OCR (Optical Character Recognition).
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PDF to Word?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Edit text, correct errors, and update content in any PDF</li>
          <li>Reuse content from PDFs in your own Word templates</li>
          <li>Extract and modify tables, figures, and formatted text</li>
          <li>Convert scanned documents to editable text using OCR</li>
          <li>Collaborate by sharing an editable DOCX instead of a locked PDF</li>
          <li>Update contracts, invoices, or reports without recreating from scratch</li>
          <li>Copy paragraphs, data, or sections into other documents</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Standard PDFs vs Scanned PDFs — What Is the Difference?
            </h3>
            <p className="leading-7">
              A <strong>standard PDF</strong> contains actual digital text that can be
              selected and copied — these convert to Word with high accuracy. A{" "}
              <strong>scanned PDF</strong> is essentially an image of a document — text
              appears visible but is not selectable. To convert scanned PDFs to editable
              Word, enable the <strong>OCR option</strong> on PDF Linx. OCR (Optical
              Character Recognition) reads the image and extracts the text, making it
              editable in Word. Complex layouts, columns, and tables in scanned documents
              may need minor adjustments after conversion.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert PDF to Word Without Losing Formatting
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Use <strong>standard PDFs</strong> where possible — they convert with higher accuracy than scanned files</li>
              <li>Enable <strong>OCR</strong> only when the PDF is scanned or image-based</li>
              <li>PDFs with simple, single-column layouts convert most cleanly</li>
              <li>Multi-column layouts and complex tables may need minor cleanup after conversion</li>
              <li>After conversion, open in <strong>Microsoft Word 2013 or newer</strong> for best compatibility</li>
              <li>Click <strong>"Enable Editing"</strong> when prompted — this is a standard Word security step</li>
            </ul>
            <p className="leading-7">
              PDF Linx is built to preserve <strong>text, tables, images, headings, and page
                structure</strong> — your converted Word document should be ready to edit with
              minimal corrections.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF to Word Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Editing contracts and agreements:</strong> Convert a received PDF
                contract to Word, make changes, and send back as an updated document.
              </li>
              <li>
                <strong>Updating resumes and CVs:</strong> Lost the original DOCX? Convert
                your PDF resume back to Word and edit it directly.
              </li>
              <li>
                <strong>Extracting content from reports:</strong> Pull text, data, and tables
                from PDF reports into editable Word documents for reuse or analysis.
              </li>
              <li>
                <strong>Academic and research documents:</strong> Convert PDF papers,
                theses, or assignments to Word for annotation, editing, or reformatting.
              </li>
              <li>
                <strong>Scanned document digitization:</strong> Use OCR to convert scanned
                paper documents, receipts, or forms into searchable, editable DOCX files.
              </li>
              <li>
                <strong>Invoice and form editing:</strong> Convert received PDF invoices or
                forms to Word to update figures, dates, or reference numbers.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PDF to Word Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple PDFs at once? Upload up to{" "}
              <strong>10 PDF files</strong> simultaneously. The tool converts all files
              and delivers them as a <strong>ZIP download</strong> containing individual
              DOCX files — ideal for processing multiple contracts, reports, assignments,
              or scanned documents in one go. Single PDF uploads download as a DOCX
              directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After converting, if you want to combine pages use{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF
              </a>
              . To export the edited Word file back as PDF, use{" "}
              <a href="/word-to-pdf" className="text-blue-700 font-medium hover:underline">
                Word to PDF
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a priority. Uploaded PDF files are
              processed automatically and <strong>permanently deleted after conversion</strong> —
              never stored long-term, never shared with third parties, and never used
              for any other purpose. No account creation is required — no email, no
              password, no personal data collected. Your documents stay completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert PDF to Word on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation required.
              Whether you are on a desktop at the office, a laptop at university, or a
              phone on the go, you can convert PDFs to editable Word documents in seconds.
              Fully responsive with drag-and-drop file upload supported on all devices
              including touchscreens.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF to Word Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF to Word converter — no hidden fees</li>
            <li>Converts PDF to editable DOCX format</li>
            <li>OCR support for scanned and image-based PDFs</li>
            <li>Batch conversion — up to 10 files at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>Text, tables, images, and layout preserved</li>
            <li>Fast processing — conversion in seconds</li>
            <li>No watermark added to converted files</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after conversion — privacy protected</li>
            <li>No signup or account required</li>
            <li>Cross-platform: Windows, macOS, Android, iOS</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Convert PDF study material, papers, and assignments to Word for annotation and editing</li>
          <li><strong>Job seekers:</strong> Convert a PDF resume back to DOCX when the original Word file is lost</li>
          <li><strong>Professionals:</strong> Edit received PDF contracts, proposals, and reports in Word</li>
          <li><strong>Businesses:</strong> Convert PDF invoices, forms, and correspondence to editable Word documents</li>
          <li><strong>Researchers:</strong> Extract and reformat content from academic PDFs and papers</li>
          <li><strong>Administrative staff:</strong> Digitize scanned forms and documents using OCR to Word conversion</li>
          <li><strong>Freelancers:</strong> Update and repurpose PDF content for client deliverables in Word format</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions — PDF to Word
        </h3>
      </section>


      {/* FAQ */}

      <section className="py-16 bg-gray-50" >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              ...(seo?.faqs || []),
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "Will my PDF formatting be preserved after conversion?",
                a: "Yes for standard PDFs — text, tables, images, and layout transfer cleanly into Word. Very complex layouts may need minor cleanup. Scanned PDFs converted via OCR may have slight formatting shifts.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert scanned PDFs to editable Word documents?",
                a: "Yes. Enable the OCR option before converting. OCR reads image-based and scanned PDFs and extracts the text into an editable DOCX file. Printed text works best for accurate OCR results.",
              },
              {
                q: "Does OCR work with handwritten text?",
                a: "OCR works best on clear, printed text. Handwritten text accuracy varies depending on scan quality and handwriting clarity — results may need manual correction.",
              },
              {
                q: "Can I convert multiple PDFs to Word at the same time?",
                a: "Yes. Upload up to 10 PDF files at the same time. All converted DOCX files are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one PDF?",
                a: "Single file uploads convert and download directly as a DOCX file — no ZIP, no extra steps.",
              },
              {
                q: "Why does Microsoft Word ask me to 'Enable Editing'?",
                a: "This is a standard Word security prompt for downloaded files. Click 'Enable Editing' to start editing your converted document — it is completely normal and safe.",
              },
              {
                q: "Can I convert PDF to Word on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {seo?.extraContent && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{seo.extraContent.heading}</h2>
          <p className="text-gray-600 leading-7">{seo.extraContent.body}</p>
        </section>
      )
      }


      <RelatedToolsSection currentPage="pdf-to-word" />


      {/* 🔗 Comparison Links (Styled) */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Compare PDF Linx with other PDF tools
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                See differences in limits, ads, pricing, and privacy — before you choose.
              </p>
            </div>

            <a
              href="/free-pdf-tools"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore all tools →
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Limits, ads, batch conversion, and privacy comparison.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>

            <a
              href="/compare/pdflinx-vs-smallpdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs Smallpdf
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free tier limits, pricing, and user experience.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

