// app/excel-pdf/page.js  (or excel-pdf/page.js)

"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileSpreadsheet, Table } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";



export default function ExcelToPDF() {
  // ✅ Single + Multiple dono support (same input)
  const [files, setFiles] = useState([]); // array of Files (1 file ho to bhi array me 1 item)
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(""); // single pdf OR zip link (backend par depend)
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  const isSingle = files.length === 1;
  const isMultiple = files.length > 1;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setSuccess(false);
    setDownloadUrl("");
  };


  const handleConvert = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select an Excel file (or multiple files) first");

    startProgress();        // ← setLoading(true) ki jagah

    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      const res = await fetch("/convert/excel-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();   // ← setLoading(false) ki jagah

        setSuccess(true);

        // ✅ Scroll wali lines same rakhi
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
        alert("Conversion failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      cancelProgress();       // ← catch pe
      alert("Oops! Something went wrong. Please try again.");
      console.error(error);
    }
    // finally block hata diya — hook khud handle karta hai
  };


  const getDownloadName = () => {
    if (isSingle) {
      return files[0]?.name
        ? files[0].name.replace(/\.(xlsx|xls)$/i, ".pdf")
        : "converted.pdf";
    }
    // multiple files => zip
    return "pdflinx-excel-pdf.zip";
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadName();
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - Excel to PDF (single + multiple mention) */}
      <Script
        id="howto-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Excel to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert Excel to PDF online free — no signup, no watermark. Tables, charts, and formatting preserved. Batch convert multiple XLS or XLSX files at once. Works on Windows, Mac, Android, iOS.",
              url: "https://pdflinx.com/excel-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Excel (single or multiple)",
                  text: "Click the upload area and select one Excel file — or select multiple Excel files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to PDF",
                  text: "Click 'Convert to PDF' and wait a few seconds. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted PDF. For multiple files, you can download a ZIP containing all PDFs.",
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

      {/* Breadcrumb Schema - Excel to PDF */}
      <Script
        id="breadcrumb-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the Excel to PDF converter free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx Excel to PDF converter is completely free — no hidden charges, no subscription required."
                }
              },
              {
                "@type": "Question",
                "name": "Will charts and formatting be preserved?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Tables, charts, formulas, colors, and grid lines are all preserved accurately in the converted PDF."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert multiple Excel files at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Upload multiple XLS or XLSX files simultaneously. All converted PDFs are delivered as a single ZIP download."
                }
              },
              {
                "@type": "Question",
                "name": "Are my files safe and private?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert Excel to PDF on mobile?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx works on Android and iOS mobile browsers — no app required."
                }
              }
            ]
          }, null, 2)
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
{/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Convert Excel to PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert Excel to PDF online free — no signup, no watermark, no software needed.
              Tables, charts, formulas, and formatting stay exactly as they were. Works on
              Windows, Mac, Android and iOS. Upload one XLS or XLSX file or batch convert
              multiple Excel files at once.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload Excel", sub: "XLS or XLSX file" },
              { n: "2", label: "Convert", sub: "Tables & charts preserved" },
              { n: "3", label: "Download", sub: "PDF or ZIP" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
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
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-teal-200 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">Converting your file{files.length > 1 ? "s" : ""}…</p>
                    <p className="text-sm text-gray-400 mt-1">{progress < 30 ? "Uploading…" : progress < 70 ? "Processing sheets…" : "Almost done…"}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <form onSubmit={handleConvert} className="p-8 space-y-5">

                {/* ── DROPZONE ── */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
                      files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
                        files.length ? "bg-green-100" : "bg-emerald-50 group-hover:bg-emerald-100"
                      }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
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
                              <FileSpreadsheet className="w-3 h-3" />
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
                          Drop your Excel file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse · XLS &amp; XLSX supported</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Batch convert", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium px-2.5 py-1 rounded-full"
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
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>

                {/* ── Info row + Convert Button ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <Table className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">XLS &amp; XLSX supported</p>
                      <p className="text-xs text-gray-400 mt-0.5">Single file → PDF · Multiple files → ZIP</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
                      files.length && !isLoading
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    Convert to PDF
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>📊 Single file → PDF directly · Multiple files → ZIP download</p>
                </div>

              </form>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE ── */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-1">
                    Conversion Complete! 🎉
                  </h3>
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    {isSingle
                      ? "Your spreadsheet is now a clean PDF"
                      : `All ${files.length} files converted successfully`}
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    {isSingle
                      ? "Click below to download your PDF file"
                      : "ZIP contains all converted PDF files"}
                  </p>

                  {/* Download button */}
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition shadow-md mb-4"
                  >
                    <Download className="w-4 h-4" />
                    {isSingle ? "Download PDF" : "Download ZIP"}
                  </button>

                  {/* secondary actions */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); setDownloadUrl(""); }}
                      className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Convert another file
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
            Single &amp; batch conversion • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>
      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free Excel to PDF Converter — Convert XLS & XLSX Without Losing Formatting
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to share an Excel spreadsheet that looks identical on every
            device? Convert XLS or XLSX to PDF here — tables, charts, formulas,
            colors, and grid lines stay pixel-perfect. Upload a single file or
            batch convert multiple Excel files at once. Fast, free, and
            privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Formatting Stays Perfect</h3>
            <p className="text-gray-600 text-sm">
              Tables, charts, formulas, colors, and grid lines — your Excel
              spreadsheet looks exactly the same after converting to PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">XLS & XLSX Supported</h3>
            <p className="text-gray-600 text-sm">
              Works with both old XLS and modern XLSX formats — including
              multi-sheet workbooks, embedded charts, and complex data tables.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one Excel file or multiple files at once. Single file
              downloads as PDF directly. Multiple files download as a ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert Excel to PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Excel File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one XLS or XLSX file, or upload multiple Excel files at
                once for batch conversion. Drag and drop supported.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to PDF</h4>
              <p className="text-gray-600 text-sm">
                Hit Convert and wait a few seconds. Tables, charts, and
                formatting are preserved automatically in the output PDF.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download PDF or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as a clean PDF instantly. Multiple files
                are packaged into a ZIP with all converted PDFs inside.
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
            After converting Excel to PDF, these tools can help you organize and share your document.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine your Excel PDF with other documents into one file.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce the converted PDF file size for easy email sharing.</span>
            </li>
            <li>
              <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">
                Word to PDF
              </a>{" "}
              <span className="text-slate-600">— convert Word documents to PDF alongside your Excel files.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by accountants, analysts, and businesses to convert Excel
          spreadsheets to PDF — fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Excel to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Need to share an Excel spreadsheet but worried it will look different
          on someone else's device? Or want to lock down formulas and formatting
          so nothing gets accidentally changed? The{" "}
          <span className="font-medium text-slate-900">PDFLinx Excel to PDF Converter</span>{" "}
          transforms XLS and XLSX files into clean, professional PDFs in seconds —
          tables, charts, formulas, colors, and grid lines preserved exactly as
          designed. No software installation, no watermarks, no sign-up required.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is Excel to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          Excel to PDF conversion takes your editable spreadsheet and transforms
          it into a fixed-layout PDF document. Everything — formulas, charts,
          data tables, conditional formatting, colors, and column widths — stays
          exactly as you designed it, regardless of what device or software the
          recipient uses. PDFs are universally compatible and open identically on
          Windows, macOS, Android, and iOS without requiring Microsoft Excel.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert Excel Files to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves tables, charts, formulas, colors, and grid lines perfectly</li>
          <li>Opens identically on every device — no missing fonts or shifted columns</li>
          <li>Protects data and formulas from accidental edits — read-only format</li>
          <li>Print-ready output with consistent page layout</li>
          <li>Professional format for financial reports, invoices, and data presentations</li>
          <li>Required format for many client deliverables, portals, and official submissions</li>
          <li>Smaller, optimized file size for easy email sharing and uploading</li>
          <li>Batch convert multiple Excel files to PDF simultaneously</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              XLS vs XLSX — Which Format Converts Better?
            </h3>
            <p className="leading-7">
              <strong>XLSX</strong> is the modern Excel format introduced with
              Microsoft Office 2007 and generally converts to PDF with higher
              accuracy — better support for charts, conditional formatting,
              embedded images, and complex multi-sheet workbooks.{" "}
              <strong>XLS</strong> is the older format and also fully supported,
              but XLSX to PDF conversion tends to produce the cleanest output for
              spreadsheets with advanced formatting. If you have a choice, save
              your file as XLSX before converting.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert Excel to PDF Without Losing Formatting
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Use <strong>XLSX format</strong> where possible — better layout support than XLS</li>
              <li>Set <strong>print area</strong> in Excel before converting — controls which data appears in the PDF</li>
              <li>Use <strong>Page Layout view</strong> in Excel to check column widths fit within the page before converting</li>
              <li>Freeze headers in Excel — these transfer cleanly into the PDF output</li>
              <li>Avoid very wide tables that exceed the page width — split across sheets if needed</li>
            </ul>
            <p className="leading-7">
              PDF Linx preserves <strong>tables, charts, formulas, conditional
                formatting, and page structure</strong> — your Excel spreadsheet
              should look identical after PDF conversion.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for Excel to PDF Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Financial reports and budgets:</strong> Convert monthly
                P&L reports, budget sheets, and financial summaries to PDF for
                client or management distribution.
              </li>
              <li>
                <strong>Invoices and quotations:</strong> Send Excel invoices and
                price quotes as PDF to prevent accidental edits and ensure
                consistent formatting across all recipients.
              </li>
              <li>
                <strong>Data analysis and dashboards:</strong> Convert Excel
                dashboards and pivot table reports to PDF for presentation to
                stakeholders without requiring Excel.
              </li>
              <li>
                <strong>Academic and research data:</strong> Convert data tables,
                statistical analysis, and research spreadsheets to PDF for
                academic submission or publication.
              </li>
              <li>
                <strong>Inventory and product lists:</strong> Convert product
                catalogs, inventory sheets, and price lists to PDF for
                distribution to buyers or distributors.
              </li>
              <li>
                <strong>HR and payroll documents:</strong> Convert salary sheets,
                attendance records, and HR reports to PDF for secure distribution
                and archiving.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch Excel to PDF Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple Excel files at once? Upload multiple XLS
              or XLSX files simultaneously. The tool converts all files and
              delivers them as a <strong>ZIP download</strong> containing
              individual PDFs — ideal for batch processing monthly reports,
              invoice sets, or data exports. Single file uploads download as a
              PDF directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After batch conversion, to combine the PDFs into one document use
              the{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF tool
              </a>
              . To reduce file size before emailing, use{" "}
              <a href="/compress-pdf" className="text-blue-700 font-medium hover:underline">
                Compress PDF
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded Excel
              files are processed securely and{" "}
              <strong>permanently deleted after conversion</strong> — never stored
              long-term, never shared with third parties, and never used for any
              other purpose. No account creation is required — no email, no
              password, no personal data collected. Your spreadsheets and
              financial data remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert Excel to PDF on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no Microsoft Excel required
              on the recipient's device. Whether you are at your desk, on a
              laptop, or on your phone, you can convert Excel spreadsheets to PDF
              in seconds. Fully responsive with drag-and-drop file upload
              supported on all devices.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx Excel to PDF Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online Excel to PDF converter — no hidden fees</li>
            <li>Supports XLS and XLSX file formats</li>
            <li>Tables, charts, and formatting fully preserved</li>
            <li>Batch conversion — multiple files at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>High-quality, print-ready PDF output</li>
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
          <li><strong>Accountants & finance teams:</strong> Convert monthly reports, P&L statements, and budget sheets to PDF for distribution</li>
          <li><strong>Business owners:</strong> Send professional invoices and quotations as read-only PDFs</li>
          <li><strong>Data analysts:</strong> Convert dashboards, pivot tables, and data reports to PDF for stakeholder presentations</li>
          <li><strong>Students:</strong> Submit data analysis, research tables, and project spreadsheets as PDF</li>
          <li><strong>HR professionals:</strong> Convert salary sheets and attendance records to PDF for secure distribution</li>
          <li><strong>Anyone with Excel:</strong> Lock in formatting and share spreadsheets confidently on any device</li>
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
                q: "Is the Excel to PDF converter free to use?",
                a: "Yes. PDFLinx Excel to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no Microsoft Excel required, no plugins needed.",
              },
              {
                q: "Will my charts and formatting be preserved after conversion?",
                a: "Yes. Tables, charts, formulas, colors, conditional formatting, and grid lines are all preserved accurately in the converted PDF.",
              },
              {
                q: "Can I convert multiple Excel files to PDF at once?",
                a: "Yes. Upload multiple XLS or XLSX files simultaneously. All converted PDFs are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one Excel file?",
                a: "Single file uploads convert and download directly as a PDF — no ZIP file, no extra steps.",
              },
              {
                q: "What is the difference between XLS and XLSX?",
                a: "XLS is the older Microsoft Excel format. XLSX is the modern format introduced with Office 2007. Both are supported, but XLSX generally converts with higher accuracy for complex formatting and charts.",
              },
              {
                q: "Are my uploaded Excel files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties. Your financial data remains completely private.",
              },
              {
                q: "Can I convert Excel to PDF on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "Why are my columns cut off in the converted PDF?",
                a: "This happens when the Excel sheet is wider than the PDF page. Before converting, set the print area in Excel or use Page Layout view to fit columns within the page width.",
              },
              {
                q: "Can I combine the converted Excel PDFs into one document?",
                a: "Yes. After converting, use the Merge PDF tool on PDF Linx to combine multiple converted PDFs into one organized document.",
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
      <RelatedToolsSection currentPage="excel-pdf" />
    </>
  );
}



























// // app/excel-pdf/page.js   (or excel-pdf/page.js)

// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileSpreadsheet } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function ExcelToPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/convert/excel-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Oops! Something went wrong. Please try again.");
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
//       a.download = file ? file.name.replace(/\.(xlsx|xls)$/i, ".pdf") : "converted.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>

//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

//       {/* HowTo Schema - Excel to PDF */}
//       <Script
//         id="howto-schema-excel-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Excel to PDF Online for Free",
//             description: "Convert any Excel spreadsheet (XLSX, XLS) to PDF in seconds - completely free, no signup required.",
//             url: "https://pdflinx.com/excel-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload Excel", text: "Click the upload area and select your .xlsx or .xls file." },
//               { "@type": "HowToStep", name: "Convert to PDF", text: "Click 'Convert to PDF' and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download your perfectly formatted PDF file instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Excel to PDF */}
//       <Script
//         id="breadcrumb-schema-excel-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" }
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
//               Excel to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got an Excel sheet you want to share as PDF? Drop it here – tables, formulas, charts stay perfect. Quick and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleConvert} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your Excel file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">Supports .xlsx & .xls – layout stays perfect</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     <FileSpreadsheet className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">All set!</p>
//                 <p className="text-base text-gray-700 mb-3">Your spreadsheet is now a crisp PDF</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download PDF
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
//             Excel to PDF Online Free – Spreadsheets Made Shareable
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Turn your Excel files into clean PDFs – tables, charts, formulas stay exactly as they are. Great for reports, invoices, or just sharing without worries. Fast and free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1 10h10l1-10h2M7 7v10m4-10v10m4-10v10" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Looks Perfect</h3>
//             <p className="text-gray-600 text-sm">
//               Tables, charts, formulas – your sheet stays beautiful in PDF.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">XLS & XLSX Ready</h3>
//             <p className="text-gray-600 text-sm">
//               Works with any Excel file – even multi-sheet ones.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion – no sign-up, no watermark, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert Excel to PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your Sheet</h4>
//               <p className="text-gray-600 text-sm">Drop your XLS or XLSX file here.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We keep the layout spot-on.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
//               <p className="text-gray-600 text-sm">Your ready-to-share PDF is here!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Thousands turn to PDF Linx daily to make Excel into perfect PDFs – fast, reliable, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           Excel to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever needed to share an Excel spreadsheet but worried it’ll look different on someone else’s computer?
//           Or maybe you want to lock down those formulas and formatting so nothing gets accidentally changed?
//           That’s where our <span className="font-medium text-slate-900">PDFLinx Excel to PDF Converter</span> comes in.
//           It’s a 100% free online tool that turns your Excel files (XLS or XLSX) into clean, professional PDFs in seconds—no installation, no watermarks, no fuss.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is Excel to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           Excel to PDF conversion takes your editable spreadsheet and transforms it into a fixed-layout PDF document.
//           Everything—formulas, charts, tables, colors, and formatting—stays exactly as you designed it,
//           no matter what device or software the recipient uses. It’s the perfect way to share reports, budgets, invoices, or data tables professionally.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert Excel Files to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Preserves all formatting, charts, colors, and grid lines perfectly</li>
//           <li>Looks identical on any device—no missing fonts or shifted columns</li>
//           <li>Protects your data and formulas from accidental edits</li>
//           <li>Ideal for sharing financial reports, invoices, budgets, or dashboards</li>
//           <li>Smaller file size and easier to print or archive</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert Excel to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your Excel file (XLS or XLSX) – just drag & drop or click</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Wait a few seconds while we process it</li>
//           <li>Download your perfect PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No registration, no watermark, no software needed—completely free and fast.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx Excel to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports XLS and XLSX formats</li>
//             <li>Full preservation of charts & formulas</li>
//             <li>High-quality, print-ready output</li>
//             <li>Super-fast conversion</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – complete privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Accountants & Finance Teams:</strong> Share monthly reports and budgets securely</li>
//           <li><strong>Business Owners:</strong> Send professional invoices and quotes</li>
//           <li><strong>Students:</strong> Submit data analysis or project spreadsheets neatly</li>
//           <li><strong>Analysts:</strong> Present dashboards and charts without formatting issues</li>
//           <li><strong>Anyone with Excel:</strong> Lock in your hard work and share confidently</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Yes — completely safe. We take your privacy seriously.
//           Your uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
//           We never store or share your documents.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert Excel to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS devices.
//           All you need is a browser and an internet connection—turn any Excel spreadsheet into a polished PDF in just a few clicks.
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
//                 Is the Excel to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — totally free, no hidden charges or limits.
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
//                 Will my charts and formatting be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Absolutely. Tables, charts, colors, fonts, and layout are preserved with high accuracy.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — files are securely processed and deleted automatically after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert Excel to PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! It works smoothly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it support older XLS files?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — both XLS and XLSX formats are fully supported.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PowerPoint to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever created a beautiful PowerPoint presentation and then worried it might look messed up on someone else’s computer?
//           Missing fonts, broken animations, or shifted layouts—no thanks!
//           That’s why we made the <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>.
//           It’s a completely free online tool that turns your PPT or PPTX files into perfect, professional PDFs in seconds—no software needed, no watermarks, no stress.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PowerPoint to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           PowerPoint to PDF conversion transforms your editable presentation slides into a fixed-layout PDF document.
//           Every slide—text, images, animations (as static frames), charts, transitions, and formatting—stays exactly as you designed it.
//           The result is a clean, shareable file that looks identical on any device, whether the viewer has PowerPoint or not.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert PowerPoint Files to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Preserves slide layout, fonts, images, and design perfectly</li>
//           <li>Looks the same on any device—no missing fonts or broken elements</li>
//           <li>Protects your content from accidental edits</li>
//           <li>Ideal for sharing presentations, handouts, or portfolios professionally</li>
//           <li>Smaller file size and easier to print or email</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert PowerPoint to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PowerPoint file (PPT or PPTX) – drag & drop or click to select</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Wait just a few seconds while we process it</li>
//           <li>Download your high-quality PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No account required, no watermark added, no installation—100% free and simple.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx PowerPoint to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports PPT and PPTX formats</li>
//             <li>Full slide design & layout preserved</li>
//             <li>High-quality, print-ready PDFs</li>
//             <li>Super-fast conversion speed</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – total privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Teachers & Educators:</strong> Share lesson slides as clean handouts</li>
//           <li><strong>Students:</strong> Submit assignments or project presentations neatly</li>
//           <li><strong>Business Professionals:</strong> Send pitch decks or reports confidently</li>
//           <li><strong>Trainers & Speakers:</strong> Distribute slide decks without formatting worries</li>
//           <li><strong>Designers:</strong> Showcase portfolios in a universal format</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Absolutely safe. We value your privacy above everything.
//           Your uploaded presentations are processed securely and automatically deleted from our servers right after conversion.
//           We never store or share your files with anyone.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert PowerPoint to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works flawlessly on Windows, macOS, Linux, Android, and iOS.
//           Just open your browser, upload your slides, and get a polished PDF in seconds—no matter where you are.
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
//                 Is the PowerPoint to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — completely free with no hidden fees or restrictions.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — it all happens directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will my slides and animations be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! All text, images, layouts, fonts, and designs are preserved accurately.
//                 Animations appear as static frames in the correct order.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — files are deleted automatically shortly after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert PowerPoint to PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it support older PPT files?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — both PPT and PPTX formats are fully supported.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="excel-pdf" />

//     </>
//   );
// }




