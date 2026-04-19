// app/compress-pdf/CompressPdfClient.jsx

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, FileDown, Scissors } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";
// import { FileDown } from "lucide-react";



export default function CompressPDF() {
  // const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  // const handleFileChange = (e) => setFile(e.target.files[0] || null);
  const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));

  const handleCompress = async (e) => {
  e.preventDefault();
  if (!files.length) return alert("Please select PDF file(s) first");

  startProgress();        // ← setLoading(true) ki jagah

  setDownloadUrl("");
  setSuccess(false);

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  try {
    const res = await fetch("/convert/compress-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setDownloadUrl(`/api${data.download}`);

      completeProgress();   // ← setLoading(false) ki jagah

      setSuccess(true);

      // Scroll wali lines same rakhi
      setTimeout(() => {
        const downloadSection = document.getElementById('download-section');
        if (downloadSection) {
          downloadSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);

    } else {
      cancelProgress();     // ← error pe
      alert("Compression failed: " + (data.error || "Try again"));
    }
  } catch (error) {
    cancelProgress();       // ← catch pe
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
  // finally block hata diya — hook khud handle karta hai
  };


  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = file ? file.name.replace(/\.pdf$/i, "-compressed.pdf") : "compressed.pdf";
      a.download = files.length > 1 ? "compressed-files.zip" : files[0].name.replace(/\.pdf$/i, "-compressed.pdf");

      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Compress PDF */}
      <Script
        id="howto-schema-compress"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Compress PDF Online for Free",
            description: "Compress PDF files online free — no signup, no watermark. Reduce file size up to 90% for email, WhatsApp, and portal uploads. Batch compress up to 15 files. Works on Windows, Mac, Android, iOS",
            url: "https://pdflinx.com/compress-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Compress", text: "Click 'Compress PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download your smaller, optimized PDF file instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Compress PDF */}
      <Script
        id="breadcrumb-schema-compress"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Compress PDF", item: "https://pdflinx.com/compress-pdf" }
            ]
          }, null, 2),
        }}
      />

  <Script
  id="faq-schema-compress-pdf"
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
            "name": "Is the PDF compressor free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes — PDFLinx Compress PDF is completely free with no signup and no watermark."
            }
          },
          {
            "@type": "Question",
            "name": "Will compressing affect the quality of my PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PDFLinx uses smart compression to reduce file size while keeping text sharp and images clear. Very image-heavy PDFs may reduce slightly to meet size limits."
            }
          },
          {
            "@type": "Question",
            "name": "Can I compress multiple PDF files at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can compress multiple PDFs in one go and download results easily. If multiple files are processed together, you may receive a ZIP download."
            }
          },
          {
            "@type": "Question",
            "name": "Are my files safe and private?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Files are processed securely and deleted automatically after compression."
            }
          },
          {
            "@type": "Question",
            "name": "How much can the file size be reduced?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on the PDF content, but many files shrink by 40–90% while staying readable."
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Compress PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compress PDF files online free — no signup, no watermark, no software needed.
              Reduce file size up to 90% for email, WhatsApp, government portals, and university
              uploads. Works on Windows, Mac, Android and iOS. Upload one file or batch compress
              up to 15 PDFs at once.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Drag & drop or click" },
              { n: "2", label: "Compress", sub: "Auto smart compression" },
              { n: "3", label: "Download", sub: "Smaller file, same quality" },
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

            {/* conversion overlay */}
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
                    <p className="text-base font-semibold text-gray-700">Compressing your file{files.length > 1 ? "s" : ""}…</p>
                    <p className="text-sm text-gray-400 mt-1">{progress < 30 ? "Uploading…" : progress < 70 ? "Optimizing…" : "Almost done…"}</p>
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

              <form onSubmit={handleCompress} className="p-8 space-y-5">

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
                        <FileDown className="w-7 h-7 text-blue-500" />
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
                              <FileDown className="w-3 h-3" />
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
                          {["✓ No signup", "✓ No watermark", "✓ Up to 15 PDFs", "✓ Max 25MB each"].map((t) => (
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
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>

                {/* ── Info row + Compress Button ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <FileDown className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Smart compression</p>
                      <p className="text-xs text-gray-400 mt-0.5">Up to 90% smaller · Quality preserved</p>
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
                    <FileDown className="w-4 h-4" />
                    Compress PDF
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>🔢 Max 15 PDF files at once · Max 25MB per file</p>
                </div>

              </form>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE — download button wala ── */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  {/* animated check */}
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    Compression Complete! 🎉
                  </h3>
                  <p className="text-sm text-green-700 font-medium mb-1">
                    Your file{files.length === 1 ? " is" : "s are"} ready — smaller and sharp
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    {files.length === 1
                      ? "Download your compressed PDF below"
                      : "ZIP contains all compressed PDF files"}
                  </p>

                  {/* Download button — explicit click required */}
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-green-700 transition shadow-md mb-4"
                  >
                    <Download className="w-4 h-4" />
                    {files.length === 1 ? "Download Compressed PDF" : "Download ZIP"}
                  </button>

                  {/* secondary actions */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); setDownloadUrl(""); }}
                      className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Compress another PDF
                    </button>
                    
                      <a href="/merge-pdf"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Merge PDF →
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single &amp; batch compression • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
<section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
  {/* Main Heading */}
  <div className="text-center mb-12">
    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
      Free PDF Compressor — Reduce PDF File Size for Email, WhatsApp & Portal Uploads
    </h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Need to shrink a PDF for email, WhatsApp, or an upload portal? Compress
      it here in seconds — file size drops dramatically while text stays sharp
      and images stay clear. Supports single file and batch compression up to
      15 PDFs at once. Fast, free, and privacy-friendly on PDF Linx.
    </p>
  </div>

  {/* Benefits Grid */}
  <div className="grid md:grid-cols-3 gap-8 mb-16">
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Scissors className="w-8 h-8 text-white rotate-90" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Up to 90% Smaller</h3>
      <p className="text-gray-600 text-sm">
        Reduce large PDFs to a fraction of their original size — ideal for
        email attachments, portal uploads, and storage saving.
      </p>
    </div>

    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Stays Sharp</h3>
      <p className="text-gray-600 text-sm">
        Smart compression preserves text clarity and image quality —
        your compressed PDF looks professional and stays fully readable.
      </p>
    </div>

    <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Download className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Compression</h3>
      <p className="text-gray-600 text-sm">
        Compress one PDF or up to 15 files at once. Single file downloads
        directly. Multiple files download as a ZIP — no signup, no watermark.
      </p>
    </div>
  </div>

  {/* How To Steps */}
  <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
    <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
      How to Compress a PDF — 3 Simple Steps
    </h3>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
          1
        </div>
        <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
        <p className="text-gray-600 text-sm">
          Select one PDF or upload up to 15 files at once for batch
          compression. Drag and drop supported on all devices.
        </p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
          2
        </div>
        <h4 className="text-lg font-semibold mb-2">Click Compress PDF</h4>
        <p className="text-gray-600 text-sm">
          Hit the Compress button and wait a few seconds. Smart compression
          runs automatically to give the best size-to-quality balance.
        </p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
          3
        </div>
        <h4 className="text-lg font-semibold mb-2">Download Compressed PDF or ZIP</h4>
        <p className="text-gray-600 text-sm">
          Single file downloads as a compressed PDF instantly. Multiple
          files are packaged into a ZIP with all compressed PDFs inside.
        </p>
      </div>
    </div>
  </div>

  {/* Contextual Links */}
  <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
    <h3 className="text-lg md:text-xl font-bold text-slate-900">
      Need to do more with your PDF?
    </h3>
    <p className="mt-1 text-sm text-slate-600">
      Compress is often just one step — combine, split, or convert your documents too.
    </p>
    <ul className="mt-4 space-y-2 text-sm">
      <li>
        <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
          Merge PDF
        </a>{" "}
        <span className="text-slate-600">— combine multiple PDFs into one before compressing.</span>
      </li>
      <li>
        <a href="/split-pdf" className="text-blue-700 font-semibold hover:underline">
          Split PDF
        </a>{" "}
        <span className="text-slate-600">— extract only the pages you need, then compress.</span>
      </li>
      <li>
        <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">
          Word to PDF
        </a>{" "}
        <span className="text-slate-600">— convert your document to PDF, then compress for sharing.</span>
      </li>
      <li>
        <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">
          Browse all PDF tools
        </a>{" "}
        <span className="text-slate-600">— merge, split, convert, protect & more.</span>
      </li>
    </ul>
  </div>

  <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
    Trusted by students, professionals, and businesses to reduce PDF file size —
    fast, reliable, and always free.
  </p>
</section>

{/* ── DEEP SEO CONTENT ── */}
  <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
      PDF Compressor – Free Online Tool by PDFLinx
    </h2>

    <p className="text-base leading-7 mb-6">
      Ever tried emailing a PDF only to get that "file too large" error? Or failed
      to upload a document because the portal has a strict size limit? The{" "}
      <span className="font-medium text-slate-900">PDFLinx Compress PDF tool</span>{" "}
      shrinks your PDF files quickly and efficiently — reducing file size by up to
      90% while keeping text sharp and images clear. No software, no watermarks,
      no sign-up needed. Works on any device, in any browser.
    </p>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      What Is PDF Compression?
    </h3>
    <p className="leading-7 mb-6">
      PDF compression reduces document file size by removing unnecessary data —
      such as embedded duplicate fonts, hidden metadata, and oversized image data —
      without visibly degrading the document. Our compressor uses smart lossy and
      lossless compression techniques including image downsampling and DPI
      optimization to achieve the best possible compression ratio while keeping
      text readable and images clear.
    </p>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      Why Compress PDF Files?
    </h3>
    <ul className="space-y-2 mb-6 list-disc pl-6">
      <li>Meet email attachment size limits — most email clients cap at 25MB</li>
      <li>Upload to government portals and university systems with strict size limits</li>
      <li>Share via WhatsApp, Telegram, or messaging apps with file size caps</li>
      <li>Reduce storage usage on phone, computer, or cloud drive</li>
      <li>Faster upload and download speeds for large documents</li>
      <li>Compress PDF from 20MB+ down to under 5MB for easy sharing</li>
      <li>Submit job applications and CVs within recruiter portal limits</li>
      <li>Archive documents efficiently without losing content quality</li>
    </ul>

    <div className="mt-10 space-y-10">

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Lossless vs Lossy PDF Compression — What Is the Difference?
        </h3>
        <p className="leading-7">
          <strong>Lossless compression</strong> removes redundant data (metadata,
          duplicate font data, unused objects) without changing any visible content —
          the PDF looks identical before and after. <strong>Lossy compression</strong>{" "}
          goes further by reducing image resolution and applying stronger image
          optimization — achieving much higher size reduction at the cost of slight
          image quality reduction. PDF Linx uses a smart combination of both
          techniques automatically, prioritizing text sharpness while optimizing
          image data for the best compression ratio.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How Much Can PDF File Size Be Reduced?
        </h3>
        <p className="leading-7">
          Compression results depend heavily on PDF content. PDFs with many
          high-resolution images typically compress the most — often{" "}
          <strong>50–90% reduction</strong>. Text-heavy PDFs with minimal images
          may compress less — typically <strong>20–50% reduction</strong>. PDFs
          that are already optimized or contain mostly vector graphics may see
          smaller gains. The tool automatically applies the best compression
          strategy for each file.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Common Use Cases for PDF Compression
        </h3>
        <ul className="space-y-2 list-disc pl-6 leading-7">
          <li>
            <strong>Email attachments:</strong> Gmail, Outlook, and Yahoo Mail
            have attachment size limits. Compress large PDF reports, invoices, or
            brochures to send without rejection.
          </li>
          <li>
            <strong>Government and university portals:</strong> Many official
            portals require uploads under 2MB, 5MB, or 10MB. Compress documents
            to meet these strict requirements easily.
          </li>
          <li>
            <strong>WhatsApp and messaging apps:</strong> Compress PDFs to share
            directly via WhatsApp, Telegram, or iMessage without file size errors.
          </li>
          <li>
            <strong>Job applications:</strong> Compress resume PDFs and cover
            letters to meet recruiter portal upload limits.
          </li>
          <li>
            <strong>Cloud storage and archiving:</strong> Reduce PDF sizes before
            uploading to Google Drive, Dropbox, or OneDrive to save storage space.
          </li>
          <li>
            <strong>Client presentations and proposals:</strong> Compress
            image-heavy proposal PDFs before emailing to clients.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Batch PDF Compression
        </h3>
        <p className="leading-7">
          Need to compress multiple PDFs at once? Upload up to{" "}
          <strong>15 PDF files</strong> simultaneously — up to 25MB per file. The
          tool compresses all files and delivers them as a{" "}
          <strong>ZIP download</strong> containing all compressed PDFs. Ideal for
          processing batches of invoices, reports, scanned documents, or assignment
          submissions in one go. Single PDF uploads download as a compressed PDF
          directly without any ZIP.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Privacy and File Security
        </h3>
        <p className="leading-7">
          PDF Linx is built with privacy as a core priority. Uploaded PDF files are
          transferred over encrypted connections and processed securely.{" "}
          <strong>Files are permanently deleted after compression</strong> — never
          stored long-term, never shared with third parties, and never used for any
          other purpose. No account creation is required — no email, no password, no
          personal data collected. Your documents remain completely private.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Compress PDF on Any Device
        </h3>
        <p className="leading-7">
          PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
          in any modern browser. No app download, no software installation. Whether
          you are at your desk, on a laptop, or on your phone during a commute, you
          can compress any PDF in seconds. Fully responsive with drag-and-drop file
          upload supported on all devices including touchscreens.
        </p>
      </div>

    </div>

    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        PDFLinx PDF Compressor — Feature Summary
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
        <li>Free online PDF compressor — no hidden fees</li>
        <li>Up to 90% file size reduction</li>
        <li>Smart lossless + lossy compression</li>
        <li>Batch compression — up to 15 files at once</li>
        <li>Max 25MB per file</li>
        <li>ZIP download for multiple file compressions</li>
        <li>Text sharpness and image clarity preserved</li>
        <li>Fast processing — compression in seconds</li>
        <li>No watermark added to compressed files</li>
        <li>Works on desktop and mobile browsers</li>
        <li>Files auto-deleted after compression — privacy protected</li>
        <li>No signup or account required</li>
      </ul>
    </div>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      Who Should Use This Tool?
    </h3>
    <ul className="space-y-2 mb-6 list-disc pl-6">
      <li><strong>Students:</strong> Compress scanned assignments, thesis documents, and project submissions to meet portal size limits</li>
      <li><strong>Job seekers:</strong> Reduce resume and cover letter PDF size for recruiter portal uploads</li>
      <li><strong>Professionals:</strong> Compress reports, proposals, and contracts before emailing to clients</li>
      <li><strong>Businesses:</strong> Reduce invoice, brochure, and presentation PDF sizes for easy distribution</li>
      <li><strong>Administrative staff:</strong> Compress scanned document batches for archiving and filing systems</li>
      <li><strong>Anyone:</strong> Shrink any oversized PDF to share via email, WhatsApp, or upload to any portal</li>
    </ul>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      Frequently Asked Questions — Compress PDF
    </h3>
  </section>


<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
      Frequently Asked Questions
    </h2>
    <div className="space-y-4">
      {[
        {
          q: "Is the PDF compressor free to use?",
          a: "Yes. PDFLinx Compress PDF is completely free — no hidden charges, no subscription, no premium tier required.",
        },
        {
          q: "Do I need to install any software?",
          a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
        },
        {
          q: "Will compressing affect the quality of my PDF?",
          a: "Text sharpness is always preserved. Images may be optimized slightly for maximum size reduction, but the document remains fully readable and professional-looking.",
        },
        {
          q: "How much can the PDF file size be reduced?",
          a: "Most PDFs shrink by 40–90%. Image-heavy PDFs compress the most. Text-only PDFs may compress less. Results depend on the original file content and structure.",
        },
        {
          q: "Are my uploaded PDF files safe and private?",
          a: "Yes. Files are transferred over encrypted connections, processed securely, and permanently deleted after compression. They are never stored long-term or shared with third parties.",
        },
        {
          q: "Can I compress multiple PDF files at once?",
          a: "Yes. Upload up to 15 PDF files simultaneously — up to 25MB per file. All compressed PDFs are delivered as a single ZIP download.",
        },
        {
          q: "What happens if I upload only one PDF?",
          a: "Single file uploads compress and download directly as a PDF — no ZIP, no extra steps.",
        },
        {
          q: "Does PDF compression reduce image resolution?",
          a: "Smart compression may slightly reduce image DPI to optimize file size. Text clarity is always maintained. The goal is to reduce file size while keeping the document visually clear.",
        },
        {
          q: "Can I compress a PDF on my phone?",
          a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
        },
        {
          q: "What is the maximum file size I can upload?",
          a: "Each PDF file can be up to 25MB. You can upload up to 15 files at once for batch compression.",
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
      

      <RelatedToolsSection currentPage="compress-pdf" />
    </>
  );
}







































// app/compress-pdf/CompressPdfClient.jsx

// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileDown, Scissors } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function CompressPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

//   const handleCompress = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PDF file first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/convert/compress-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//         // ✅ YE 8 LINES ADD KARO
//         setTimeout(() => {
//           const downloadSection = document.getElementById('download-section');
//           if (downloadSection) {
//             downloadSection.scrollIntoView({
//               behavior: 'smooth',
//               block: 'center'
//             });
//           }
//         }, 300);

//       } else {
//         alert("Compression failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Something went wrong. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file ? file.name.replace(/\.pdf$/i, "-compressed.pdf") : "compressed.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

//       {/* HowTo Schema - Compress PDF */}
//       <Script
//         id="howto-schema-compress"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Compress PDF Online for Free",
//             description: "Reduce PDF file size up to 90% while keeping quality intact. Completely free, no signup needed.",
//             url: "https://pdflinx.com/compress-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
//               { "@type": "HowToStep", name: "Compress", text: "Click 'Compress PDF' and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download your smaller, optimized PDF file instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Compress PDF */}
//       <Script
//         id="breadcrumb-schema-compress"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Compress PDF", item: "https://pdflinx.com/compress-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />
//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               Compress PDF Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a huge PDF that's too big to email or upload? We'll shrink it down (up to 90% smaller) while keeping it looking sharp. Super quick and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleCompress} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileDown className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PDF here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">We'll make it smaller without losing quality</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Compress Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Compressing... almost done!</>
//                 ) : (
//                   <>
//                     <FileDown className="w-5 h-5" />
//                     Compress PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div 
//               id="download-section"  // ✅ BAS YE EK LINE ADD KARO
//               className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">Nice! PDF is smaller now</p>
//                 <p className="text-base text-gray-700 mb-3">Ready to send or upload anywhere</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Compressed PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer Note */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files gone after 1 hour • Completely free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//             Compress PDF Online Free – Shrink Files Without Losing Quality
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Big PDFs slowing you down? Compress them here in seconds – make files tiny (up to 90% smaller) but still crystal clear. Perfect for emails, uploads, or just saving space. All free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Scissors className="w-8 h-8 text-white rotate-90" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Shrink Up To 90%</h3>
//             <p className="text-gray-600 text-sm">
//               Turn massive PDFs into lightweight ones – easy to share anywhere.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Stays Sharp</h3>
//             <p className="text-gray-600 text-sm">
//               Text and images look just as good – smart compression magic.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Works instantly – no sign-up, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Compress PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
//               <p className="text-gray-600 text-sm">Drop it in or click to pick any file.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Compress</h4>
//               <p className="text-gray-600 text-sm">We shrink it smartly in seconds.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download Smaller PDF</h4>
//               <p className="text-gray-600 text-sm">Your lighter file is ready to go!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Folks compress PDFs daily with PDF Linx – smaller files, faster sharing, zero hassle.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           Compress PDF – Free Online PDF Compressor by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever tried emailing a PDF only to get that annoying “file too large” error?
//           Or struggled to upload a document because it’s taking forever?
//           We’ve all been there. That’s why we created the <span className="font-medium text-slate-900">PDFLinx Compress PDF tool</span>—a completely free online compressor that shrinks your PDF files quickly while keeping the quality sharp. No software, no watermarks, no sign-up needed.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PDF Compression?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF compression reduces the file size of your document by removing unnecessary data—like embedded fonts, hidden layers, or high-resolution images—without ruining how it looks.
//           The result? A smaller, faster-loading PDF that’s perfect for emailing, uploading, or storing, while still looking clear and professional.
//         </p>

//         {/* Why compress */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Compress Your PDF Files?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Reduce file size dramatically—often by 50-90%</li>
//           <li>Send large PDFs via email without attachment limits</li>
//           <li>Upload documents faster to websites or cloud storage</li>
//           <li>Save storage space on your phone or computer</li>
//           <li>Maintain readable text and clear images</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Compress PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PDF file (drag & drop or click to select)</li>
//           <li>Choose your compression level (if options available)</li>
//           <li>Click “Compress PDF”</li>
//           <li>Download your smaller, optimized PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No registration, no watermark, no installation—100% free and secure.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx PDF Compressor
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online compression</li>
//             <li>Significant file size reduction</li>
//             <li>Preserves text and image quality</li>
//             <li>Fast and reliable processing</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – complete privacy</li>
//             <li>No watermarks or limits</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Students:</strong> Submit large scanned assignments or projects</li>
//           <li><strong>Professionals:</strong> Email reports, resumes, or contracts quickly</li>
//           <li><strong>Businesses:</strong> Share invoices, proposals, or brochures easily</li>
//           <li><strong>Job Applicants:</strong> Send CVs under email size limits</li>
//           <li><strong>Anyone:</strong> Free up space or speed up uploads with big PDFs</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Absolutely. Your privacy is our priority.
//           Every PDF you upload is processed securely on our servers and automatically deleted shortly after compression.
//           We never store, share, or access your documents.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Compress PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works smoothly on Windows, macOS, Linux, Android, and iOS.
//           Whether you're on your phone during a commute or at your desk, shrink any PDF in seconds with just a browser and internet connection.
//         </p>
//       </section>


//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">

//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the PDF compressor free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — completely free with no hidden fees or limits.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — everything works directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will compressing affect the quality of my PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 We use smart compression to reduce size while keeping text sharp and images clear.
//                 You’ll notice the smaller file size, not the difference in quality.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — your PDFs are deleted automatically shortly after processing.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I compress PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How much can the file size be reduced?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 It depends on the original PDF, but most files shrink by 40-90% while staying fully readable.
//               </p>
//             </details>
//           </div>
//         </div>
//       </section>

      

//       <RelatedToolsSection currentPage="compress-pdf" />
//     </>
//   );
// }

