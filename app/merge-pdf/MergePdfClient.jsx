// app/merge-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Download, CheckCircle, X, Files } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";


export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };


  // const handleMerge = async (e) => {
  //   e.preventDefault();
  //   if (files.length < 2) {
  //     alert("Please select at least 2 PDF files to merge.");
  //     return;
  //   }

  //   startProgress();        // ← setLoading(true) ki jagah
  //   setDownloadUrl("");
  //   setSuccess(false);

  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("files", file));

  //   try {
  //     const res = await fetch("/convert/merge-pdf", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       setDownloadUrl(`/api${data.download}`);
  //       completeProgress();   // ← setLoading(false) ki jagah

  //       setSuccess(true);

  //       setTimeout(() => {
  //         const downloadSection = document.getElementById('download-section');
  //         if (downloadSection) {
  //           downloadSection.scrollIntoView({
  //             behavior: 'smooth',
  //             block: 'center'
  //           });
  //         }
  //       }, 300);

  //     } else {
  //       cancelProgress();     // ← error pe
  //       alert("Merge failed: " + (data.error || "Unknown error"));
  //     }
  //   } catch (error) {
  //     cancelProgress();       // ← catch pe
  //     alert("Error merging PDFs. Please try again.");
  //     console.error(error);
  //   }
  //   // finally hata diya — hook khud handle karta hai
  // };



  const handleMerge = async (e) => {
  e.preventDefault();

  if (files.length < 2) {
    alert("Please select at least 2 PDF files to merge.");
    return;
  }

  startProgress();
  setSuccess(false);
  setDownloadUrl("");

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const res = await fetch("/convert/merge-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      cancelProgress();
      alert("Merge failed: " + (errorData?.error || "Unknown error"));
      return;
    }

    const data = await res.json();

    if (data.success) {
      setDownloadUrl(data.download);
      completeProgress();
      setSuccess(true);

      setTimeout(() => {
        const downloadSection = document.getElementById("download-section");
        if (downloadSection) {
          downloadSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    } else {
      cancelProgress();
      alert("Merge failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    cancelProgress();
    console.error("Merge frontend error:", error);
    alert("Error merging PDFs. Please try again.");
  }
};

const handleDownload = () => {
  if (!downloadUrl) return;
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = "merged-pdf.pdf";
  a.click();
};

  // const handleDownload = async () => {
  //   if (!downloadUrl) return;
  //   try {
  //     const response = await fetch(downloadUrl);
  //     if (!response.ok) throw new Error("Download failed");
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "merged-pdf.pdf";
  //     a.click();
      
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     alert("Failed to download merged PDF");
  //   }
  // };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>


      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Merge PDF */}
      <Script
        id="howto-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Merge Multiple PDF Files Online for Free",
            description: "Merge multiple PDF files into one online free — no signup, no watermark. Arrange files in any order and download one clean merged PDF instantly. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/merge-pdf",
            step: [
              {
                "@type": "HowToStep",
                name: "Select PDF Files",
                text: "Click 'Select Files' and choose 2 or more PDF files from your device. You can select multiple files at once."
              },
              {
                "@type": "HowToStep",
                name: "Click Merge PDFs",
                text: "Press the 'Merge PDFs' button and wait a few seconds while we combine your files."
              },
              {
                "@type": "HowToStep",
                name: "Download Merged PDF",
                text: "Your merged PDF will be ready instantly - click download to save the combined file."
              }
            ],
            totalTime: "PT45S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            tool: [{ "@type": "HowToTool", name: "PDF Linx Merge Tool" }],
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Merge PDF */}
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
              { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://pdflinx.com/merge-pdf" }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-merge-pdf"
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
                  "name": "Is the PDF merger free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes — PDFLinx Merge PDF is completely free with no signup, no watermark, and no hidden charges."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to install any software to merge PDFs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Everything works directly in your browser on mobile, tablet, and desktop."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I rearrange the order before merging?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Arrange your files in the order you want before merging so the final PDF is in the correct sequence."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will the quality of my PDFs be affected?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No — merging keeps the original text and image quality. Your PDFs are combined without compression."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are my files safe and private?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Files are processed securely and deleted automatically after merging."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I merge PDFs on my phone?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. PDFLinx works smoothly on Android and iPhone, as well as Windows and macOS."
                  }
                }
              ]
            },
            null,
            2
          )
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
{/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Merge PDF Files Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Merge multiple PDF files into one online free — no signup, no watermark, no software needed.
              Works on Windows, Mac, Android and iOS. Upload 2 or more PDFs, arrange them in the right
              order, and download one clean merged PDF instantly.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDFs", sub: "2 or more files" },
              { n: "2", label: "Arrange Order", sub: "Remove unwanted files" },
              { n: "3", label: "Merge & Download", sub: "One clean PDF" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                  {s.n}
                </div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── MAIN CARD ── */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* conversion overlay */}
            <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

              {/* blur overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-purple-200 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">Merging your files…</p>
                    <p className="text-sm text-gray-400 mt-1">{progress < 30 ? "Uploading…" : progress < 70 ? "Combining pages…" : "Almost done…"}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <div className="p-8 space-y-5">

                {/* ── DROPZONE ── */}
                <div>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer group ${
                      files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
                        files.length ? "bg-green-100" : "bg-indigo-50 group-hover:bg-indigo-100"
                      }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Files className="w-7 h-7 text-indigo-500" />
                      )}
                    </div>

                    {files.length ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Click to add more files</p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your PDF files here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse · minimum 2 files</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Unlimited files", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── File cards grid ── */}
                  {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
                      {files.map((file, index) => (
                        <div key={index} className="relative group bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                          <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
                          <p className="text-xs text-center font-medium text-gray-700 truncate">{file.name}</p>
                          <p className="text-xs text-center text-gray-400 mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Info row + Merge Button ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <Files className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Order matters</p>
                      <p className="text-xs text-gray-400 mt-0.5">Files merge top-left to bottom-right · Remove to reorder</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleMerge}
                    disabled={files.length < 2 || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
                      files.length >= 2 && !isLoading
                        ? "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Files className="w-4 h-4" />
                    {files.length < 2 ? "Select 2+ PDFs" : "Merge PDFs Now"}
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>📄 Files merge in the order shown — remove &amp; re-add to reorder</p>
                  <p>🔒 Files permanently deleted after merging — your privacy is protected</p>
                </div>

              </div>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE ── */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-1">
                    Merge Complete! 🎉
                  </h3>
                  <p className="text-sm text-indigo-700 font-medium mb-1">
                    All {files.length} files combined into one clean PDF
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Click below to download your merged document
                  </p>

                  {/* Download button */}
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-600 transition shadow-md mb-4"
                  >
                    <Download className="w-4 h-4" />
                    Download Merged PDF
                  </button>

                  {/* secondary actions */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); setDownloadUrl(""); }}
                      className="inline-flex items-center gap-2 bg-white border border-indigo-300 text-indigo-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Merge more PDFs
                    </button>
                    
                      <a href="/compress-pdf"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Compress PDF →
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No sign-up • No watermark • Auto-deleted after 1 hour • 100% free •
            Unlimited files • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>
      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Free PDF Merger — Combine PDF Files Online Without Losing Quality
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got multiple PDFs that belong together? Merge them into one clean,
            organized document here — page order stays perfect, original quality
            preserved, and your combined PDF is ready to download in seconds.
            Fast, free, and privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unlimited Files</h3>
            <p className="text-gray-600 text-sm">
              Combine 2 files or dozens — no file count limits, no fees, no
              restrictions on how many PDFs you merge at once.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality & Order Preserved</h3>
            <p className="text-gray-600 text-sm">
              Formatting, images, text, and page order stay exactly as they were
              — your merged PDF looks identical to the originals, combined.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Merges in seconds — no sign-up, no watermark, files permanently
              deleted after processing to protect your privacy.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Merge PDF Files — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF Files</h4>
              <p className="text-gray-600 text-sm">
                Select 2 or more PDF files from your device. Drag and drop
                supported — upload as many files as you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Arrange & Remove Files</h4>
              <p className="text-gray-600 text-sm">
                Files merge in the order you upload them. Remove any unwanted
                files by clicking the X before merging.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Merge & Download</h4>
              <p className="text-gray-600 text-sm">
                Click Merge PDFs Now and download your combined PDF instantly —
                one clean, organized file ready to share or submit.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to do more with your PDFs?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Merge is often just one step — split, compress, or convert your documents too.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/split-pdf" className="text-indigo-700 font-semibold hover:underline">
                Split PDF
              </a>{" "}
              <span className="text-slate-600">— extract specific pages before merging into the final document.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-indigo-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce the merged PDF file size for easy email sharing.</span>
            </li>
            <li>
              <a href="/word-to-pdf" className="text-indigo-700 font-semibold hover:underline">
                Word to PDF
              </a>{" "}
              <span className="text-slate-600">— convert Word documents to PDF first, then merge them together.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-indigo-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— compress, split, convert, protect & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to combine PDF files —
          fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF Merger – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ended up with a stack of separate PDFs — invoices, reports, scanned pages,
          certificates — that should really be one document? The{" "}
          <span className="font-medium text-slate-900">PDFLinx Merge PDF tool</span>{" "}
          combines multiple PDF files into a single, organized document in seconds.
          No software installation, no watermarks, no sign-up required. Upload your
          files, set the order, and download one clean merged PDF instantly.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF Merging?
        </h3>
        <p className="leading-7 mb-6">
          PDF merging — also called combining or joining PDFs — takes two or more
          separate PDF files and joins them into one seamless document. The merged
          file preserves the original formatting, images, text quality, and page
          layout of every source document. You control the order — the final merged
          PDF flows exactly as you arrange the files before merging.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Merge PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Send one file instead of multiple attachments in an email</li>
          <li>Combine invoices, receipts, or statements into one monthly document</li>
          <li>Join chapters, sections, or reports into a single organized PDF</li>
          <li>Attach cover letter, resume, and certificates as one application file</li>
          <li>Merge scanned document pages into one complete file</li>
          <li>Combine contracts, annexures, and appendices for clean delivery</li>
          <li>Simplify cloud storage — one file instead of a disorganized folder</li>
          <li>Submit multi-part assignments or project reports as a single PDF</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Does Merging PDFs Affect Quality?
            </h3>
            <p className="leading-7">
              No. PDF Linx merges files by joining the original page data directly —
              there is no re-rendering, re-compression, or quality loss. Text stays
              sharp, images stay clear, and formatting remains exactly as it was in
              the original documents. The merged PDF is simply the source pages
              combined into one file in the order you specified.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Control Page Order When Merging
            </h3>
            <p className="leading-7">
              Files are merged in the order you upload them — the first file uploaded
              becomes the first section of the merged PDF, the second file follows,
              and so on. To change the order, remove files using the X button and
              re-upload them in the correct sequence. If you need to extract specific
              pages before merging, use the{" "}
              <a href="/split-pdf" className="text-indigo-700 font-medium hover:underline">
                Split PDF tool
              </a>{" "}
              first to isolate the pages you need.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF Merging
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Job applications:</strong> Combine your resume, cover letter,
                and supporting certificates into one professional PDF submission.
              </li>
              <li>
                <strong>Invoice and receipt management:</strong> Merge monthly
                invoices or expense receipts into one organized PDF for accounting.
              </li>
              <li>
                <strong>Academic submissions:</strong> Join assignment sections,
                appendices, and reference lists into one submission-ready PDF.
              </li>
              <li>
                <strong>Legal and contract documents:</strong> Combine main
                agreements, annexures, and exhibit pages into one complete contract PDF.
              </li>
              <li>
                <strong>Business reports and proposals:</strong> Merge report sections,
                charts, and appendices into one polished client-ready document.
              </li>
              <li>
                <strong>Scanned document assembly:</strong> Combine individually
                scanned pages into one complete multi-page PDF document.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded PDF files
              are processed securely and{" "}
              <strong>permanently deleted after merging</strong> — never stored
              long-term, never shared with third parties, and never used for any other
              purpose. No account creation is required — no email, no password, no
              personal data collected. Your documents remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Merge PDFs on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation. Whether
              you are at your desk, on a laptop, or on your phone, you can merge PDF
              files in seconds. Fully responsive with drag-and-drop file upload
              supported on all devices including touchscreens.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF Merger — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF merger — no hidden fees</li>
            <li>Combine unlimited PDF files in one merge</li>
            <li>Original quality and formatting fully preserved</li>
            <li>Page order controlled by upload sequence</li>
            <li>Remove unwanted files before merging</li>
            <li>Fast processing — merged PDF ready in seconds</li>
            <li>No watermark added to merged files</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after merging — privacy protected</li>
            <li>No signup or account required</li>
            <li>Cross-platform: Windows, macOS, Android, iOS</li>
            <li>Drag-and-drop upload supported</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Combine assignment sections, appendices, and references into one submission PDF</li>
          <li><strong>Job seekers:</strong> Merge resume, cover letter, and certificates into one professional application file</li>
          <li><strong>Professionals:</strong> Join report sections, charts, and appendices into one client-ready document</li>
          <li><strong>Businesses:</strong> Combine invoices, contracts, and correspondence into organized single PDFs</li>
          <li><strong>Legal professionals:</strong> Merge agreements, annexures, and exhibit pages into complete contract documents</li>
          <li><strong>Administrative staff:</strong> Assemble scanned document pages into complete multi-page PDF files</li>
          <li><strong>Anyone:</strong> Combine any separate PDFs into one organized, easy-to-share document</li>
        </ul>
      </section>



      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the PDF merger free to use?",
                a: "Yes. PDFLinx Merge PDF is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software to merge PDFs?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "How many PDF files can I merge at once?",
                a: "There is no strict file count limit — you can merge 2 files or dozens in a single merge. Upload as many PDFs as you need to combine.",
              },
              {
                q: "Will the quality of my PDFs be affected by merging?",
                a: "No. PDF Linx joins the original page data directly — no re-rendering or compression. Text, images, and formatting stay exactly as they were in the original files.",
              },
              {
                q: "Can I control the page order of the merged PDF?",
                a: "Yes. Files are merged in the order you upload them. Remove files using the X button and re-upload them in the correct sequence to control the final page order.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after merging. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I merge PDFs on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "What is the difference between merging and combining PDFs?",
                a: "Merging and combining PDFs mean the same thing — joining two or more separate PDF files into one single document. The terms are used interchangeably.",
              },
              {
                q: "Can I merge a scanned PDF with a regular PDF?",
                a: "Yes. PDF Linx merges any PDF files together regardless of whether they are scanned documents, regular text PDFs, or image-based files.",
              },
              {
                q: "What should I do after merging if the file is too large?",
                a: "After merging, use the Compress PDF tool on PDF Linx to reduce the merged file size — useful when emailing or uploading to portals with strict size limits.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-indigo-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="merge-pdf" />

      {/* 🔗 Comparison Links */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Compare PDF Merge tools
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Compare PDF Linx merge tool with other popular PDF mergers.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF (Merge PDF)
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Ads, file limits, and merge order control.
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
                    PDF Linx vs Smallpdf (Merge)
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free usage limits and signup requirements.
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
