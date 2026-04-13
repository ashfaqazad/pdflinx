// app/word-to-pdf/page.js  (ya jsx—same)

"use client";
import { useState } from "react";
import { Upload, FileText, Download, CheckCircle } from "lucide-react";
import Script from "next/script"; // schemas
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";


export default function WordToPdf() {
  const [files, setFiles] = useState([]); // ✅ multiple
  // const [loading, setLoading] = useState(false);
  // const [downloadUrl, setDownloadUrl] = useState(null); // ✅ only used for ZIP case
  const [success, setSuccess] = useState(false);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a Word file first!");

    startProgress();        // ← setLoading(true) ki jagah
    setSuccess(false);

    const formData = new FormData();
    for (const f of files) formData.append("files", f);

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

      // ✅ SINGLE: PDF stream
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = files[0].name.replace(/\.(doc|docx)$/i, ".pdf");
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        completeProgress();   // ← setLoading(false) ki jagah
        setSuccess(true);
        setFiles([]);
        return;
      }

      // ✅ MULTIPLE: ZIP stream
      if (contentType.includes("application/zip") || contentType.includes("application/octet-stream")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "pdflinx-word-to-pdf.zip";

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        completeProgress();   // ← setLoading(false) ki jagah
        setSuccess(true);
        setFiles([]);
        return;
      }

      throw new Error("Unexpected response from server.");

    } catch (err) {
      cancelProgress();       // ← error pe reset
      alert(err.message || "Something went wrong, please try again.");
      console.error(err);
    }
    // finally block hata diya — completeProgress/cancelProgress khud handle karte hain
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Client-Side Safe) ==================== */}
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
              description:
                "Convert one or multiple Word documents (DOC/DOCX) to PDF in just 3 simple steps — completely free, no signup needed.",
              url: "https://pdflinx.com/word-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Word File(s)",
                  text: "Upload one Word file or select multiple DOC/DOCX files at the same time.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press the 'Convert to PDF' button and wait a few seconds while your file(s) are processed.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF (or ZIP)",
                  text: "Download your PDF instantly. If you converted multiple files, you'll get a ZIP with all PDFs inside.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
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
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Word to PDF", item: "https://pdflinx.com/word-to-pdf" },
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
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is the Word to PDF converter free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, PDFLinx offers a completely free Word to PDF converter with no hidden charges."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to install any software?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No installation is required. Everything works directly in your browser."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will my Word formatting be preserved?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, fonts, tables, images, and layout are preserved accurately."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are my files safe and private?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Files are processed securely and deleted automatically after conversion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert Word to PDF on mobile?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, PDFLinx works perfectly on mobile, tablet, and desktop devices."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert multiple Word files to PDF at once?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. PDFLinx allows you to upload and convert multiple Word files at the same time. If you upload more than one file, all converted PDFs are downloaded together in a ZIP file."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens if I upload only one Word file?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If you upload a single Word file, it converts and downloads as a PDF directly — no ZIP file needed."
                  }
                }
              ]
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="software-schema-word-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Word to PDF Converter - PDFLinx",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "description": "Convert Word to PDF online free — no signup, no watermark. Upload DOC or DOCX and get a clean PDF instantly. Batch convert up to 10 files. Works on Windows, Mac, Android, iOS.",
              "url": "https://pdflinx.com/word-to-pdf",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Convert DOC to PDF",
                "Convert DOCX to PDF",
                "Batch Word to PDF conversion",
                "No watermark",
                "Secure file processing",
                "Works on mobile and desktop",
                "Instant browser-based conversion"
              ],
              "creator": {
                "@type": "Organization",
                "name": "PDFLinx"
              }
            },
            null,
            2
          ),
        }}
      />
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Convert Word to PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert DOC or DOCX to PDF online free — no signup, no watermark, no software needed.
              Works on Windows, Mac, Android and iOS. Perfect for resumes, assignments, invoices,
              and contracts. Upload one file or batch convert up to 10 Word files at once.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload Word", sub: "DOC or DOCX file" },
              { n: "2", label: "Convert", sub: "One click process" },
              { n: "3", label: "Get PDF", sub: "Instant download" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
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
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
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
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
                      files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
                        files.length ? "bg-green-100" : "bg-blue-50 group-hover:bg-blue-100"
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
                          Drop your Word file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse · DOC & DOCX supported</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Up to 10 files", "✓ Auto-deleted"].map((t) => (
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
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    required
                  />
                </label>

                {/* ── Convert Button Row ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">DOC &amp; DOCX supported</p>
                      <p className="text-xs text-gray-400 mt-0.5">Single file → PDF · Multiple files → ZIP</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
                      files.length && !isLoading
                        ? "bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Convert to PDF
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>🔢 Max 10 Word files at once · Single file → PDF · Multiple → ZIP</p>
                </div>

              </form>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE ── */}
            {success && (
              <div className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
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
                      ? "Check your downloads folder for the PDF file"
                      : "Check your downloads — ZIP contains all converted PDF files"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); }}
                      className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Convert another file
                    </button>
                    
                      <a href="/pdf-to-word"
                      className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      PDF to Word →
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single &amp; batch conversion • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free Word to PDF Converter — Convert DOC & DOCX Without Losing Formatting
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to share a Word file that looks identical on every device? Convert
            DOC or DOCX to PDF here — fonts, images, tables, and layout stay
            pixel-perfect. Supports single file and batch conversion. Fast, free,
            and privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Formatting Stays Perfect</h3>
            <p className="text-gray-600 text-sm">
              Fonts, images, tables, headings, margins — your Word document looks
              exactly the same after converting to PDF. No layout shifts, no missing elements.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">DOC & DOCX Supported</h3>
            <p className="text-gray-600 text-sm">
              Works with both old DOC and modern DOCX formats — including files with
              complex styles, embedded images, multi-column layouts, and custom fonts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one file or up to 10 Word files at once. Single file downloads
              as PDF directly. Multiple files download as a ZIP — no signup, no watermark.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert Word to PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Word File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one DOC or DOCX file, or upload multiple Word files at once
                for batch conversion. Drag and drop supported.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to PDF</h4>
              <p className="text-gray-600 text-sm">
                Hit the Convert button and wait a few seconds. The tool processes
                your file server-side and preserves all formatting automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download PDF or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as a clean PDF instantly. Multiple files are
                packaged into a ZIP with all converted PDFs inside.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to convert Word documents
          to PDF — fast, reliable, and always free.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Word to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          A Word to PDF converter is an essential online tool that allows users to convert Word documents (DOC or DOCX) into secure, professional, and universally compatible PDF files.
          PDFs are widely used because they preserve formatting, layout, fonts, images, and structure across all devices.
          <span className="font-medium text-slate-900"> PDFLinx Word to PDF Converter</span>{" "}
          lets you convert files instantly without installing any software — and you can also convert multiple Word files at once.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">What is Word to PDF Conversion?</h3>
        <p className="leading-7 mb-6">
          Word to PDF conversion is the process of transforming editable Microsoft Word documents into fixed-layout PDF files.
          This ensures your document looks exactly the same on every device, browser, and operating system.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Why Convert Word Files to PDF?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves fonts, margins, tables, and images</li>
          <li>Opens perfectly on all devices without Microsoft Word</li>
          <li>Gives a professional and polished appearance</li>
          <li>More secure and harder to edit accidentally</li>
          <li>Optimized file size for easy sharing</li>
        </ul>

        {/* ==================== SEMANTIC SEO BOOST (NEW) ==================== */}
        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Word vs PDF – What’s the Difference?
            </h3>
            <p className="leading-7">
              A <strong>Word document (DOC/DOCX)</strong> is editable — great for writing and updates. A <strong>PDF</strong> is a fixed-layout format,
              made for sharing and printing. That’s why people convert <strong>Microsoft Word files to PDF</strong> when they want the same look on every device,
              with fonts, margins, and layout staying consistent.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              DOC vs DOCX – Which Converts Better?
            </h3>
            <p className="leading-7">
              <strong>DOCX</strong> is the newer Word format and usually converts more accurately because it supports modern styling, images, and formatting. {" "}
              <strong>DOC</strong> also works, but if your file has complex formatting, <strong>DOCX to PDF conversion</strong> often gives the cleanest output.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert Word to PDF Without Losing Formatting?
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>Prefer <strong>.docx</strong> if possible (better layout support).</li>
              <li>Use standard fonts (or embed fonts in your Word file if you can).</li>
              <li>Keep page size consistent (A4 / Letter) to avoid layout shift.</li>
              <li>If your Word file has tables/images, keep them inside page margins.</li>
            </ul>
            <p className="leading-7 mt-3">
              PDF Linx is built to preserve <strong>fonts, headings, tables, and images</strong> — so your Word file looks the same after converting to PDF.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert Large Word Files to PDF
            </h3>
            <p className="leading-7">
              If you’re converting a large DOCX (many pages, images, or charts), conversion may take a bit longer.
              Tip: after converting, you can reduce size using{" "}
              <a href="/compress-pdf" className="text-blue-700 font-medium hover:underline">
                Compress PDF
              </a>{" "}
              to make sharing easier without losing quality.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch Word to PDF Conversion Guide
            </h3>
            <p className="leading-7">
              Need to convert multiple Word files at once? Upload up to <strong>10 DOC/DOCX</strong> files together — you’ll get a <strong>ZIP download</strong> {" "}
              with all PDFs inside. This is perfect for resumes, assignments, office docs, and client deliverables.
            </p>
            <p className="leading-7 mt-2">
              After conversion, if you want to combine outputs into one file, use{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF
              </a>.
            </p>
          </div>

        </div>
        {/* ==================== /SEMANTIC SEO BOOST (NEW) ==================== */}

        <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Convert Word to PDF Online</h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload one Word file — or select multiple Word files (DOC/DOCX)</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait a few seconds while the file(s) are processed</li>
          <li>Download your PDF instantly (or a ZIP if you converted multiple files)</li>
        </ol>

        <p className="mb-6">No registration, no watermark, and no installation required.</p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Word to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online Word to PDF converter</li>
            <li>Supports DOC & DOCX formats</li>
            <li>Convert multiple Word files to PDF at once</li>
            <li>Bulk conversion with ZIP download for multiple files</li>
            <li>High-quality PDF output</li>
            <li>Original layout & formatting preserved</li>
            <li>Fast conversion speed</li>
            <li>Works on desktop & mobile</li>
            <li>No file storage – privacy protected</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use This Tool?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Submit assignments in PDF format</li>
          <li><strong>Professionals:</strong> Share resumes and reports securely</li>
          <li><strong>Businesses:</strong> Convert invoices and contracts</li>
          <li><strong>Freelancers:</strong> Deliver polished documents to clients</li>
          <li><strong>Teachers:</strong> Distribute learning material easily</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Is PDFLinx Safe to Use?</h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is privacy-focused. Uploaded files are processed automatically and deleted shortly after conversion.
          Your documents are never shared or stored permanently.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Convert Word to PDF Anytime, Anywhere</h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS devices. All you need is an internet connection and a modern browser
          to convert Word documents into professional PDFs in seconds — whether you upload one file or multiple files at once.
        </p>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the Word to PDF converter free to use?",
                a: "Yes. PDFLinx Word to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "Will my Word formatting be preserved after conversion?",
                a: "Yes. Fonts, tables, images, margins, headings, and page layout are all preserved accurately in the converted PDF.",
              },
              {
                q: "Are my uploaded Word files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert Word to PDF on mobile?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "Can I convert multiple Word files to PDF at once?",
                a: "Yes. Upload up to 10 DOC or DOCX files at the same time. All converted PDFs are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one Word file?",
                a: "Single file uploads convert and download directly as a PDF — no ZIP file, no extra steps.",
              },
              {
                q: "What is the difference between DOC and DOCX?",
                a: "DOC is the older Microsoft Word format. DOCX is the modern format introduced with Office 2007. Both are supported, but DOCX generally converts with higher accuracy for complex formatting.",
              },
              {
                q: "How do I convert a Word resume to PDF without breaking the layout?",
                a: "Upload your DOCX resume directly. PDFLinx preserves column layouts, fonts, spacing, and bullet points. After converting, check the PDF to confirm the layout is intact before submitting to job portals.",
              },
              {
                q: "Can I reduce the PDF file size after converting?",
                a: "Yes. After conversion, use the Compress PDF tool on PDF Linx to reduce file size — useful when uploading to portals with strict file size limits.",
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
      <RelatedToolsSection currentPage="word-to-pdf" />

      {/* 🔗 Comparison Links */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Compare Word to PDF tools
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            See how PDF Linx compares with other Word to PDF converters.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free limits, ads, and output quality comparison.
                  </div>
                </div>
                <span className="text-indigo-600">→</span>
              </div>
            </a>

            <a
              href="/compare/pdflinx-vs-smallpdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs Smallpdf
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Pricing, daily limits, and ease of use.
                  </div>
                </div>
                <span className="text-indigo-600">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

