"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileSpreadsheet, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";

export default function PdfToExcel() {
  // ✅ Single + Multiple dono support
  const [files, setFiles] = useState([]); // array of PDFs
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(""); // single xlsx OR zip link
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
    if (!files.length) return alert("Please select a PDF file (or multiple files) first");

    startProgress();

    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      const res = await fetch("/convert/pdf-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();
        setSuccess(true);

        setTimeout(() => {
          const downloadSection = document.getElementById("download-section");
          if (downloadSection) {
            downloadSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 300);
      } else {
        cancelProgress();
        alert("Conversion failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      cancelProgress();
      alert("Oops! Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const getDownloadName = () => {
    if (isSingle) {
      return files[0]?.name
        ? files[0].name.replace(/\.pdf$/i, ".xlsx")
        : "converted.xlsx";
    }
    return "pdflinx-pdf-to-excel.zip";
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

      {/* HowTo Schema */}
      <Script
        id="howto-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Excel Online for Free (Single or Multiple Files)",
              description:
                "Convert PDF tables into editable Excel (XLSX) in seconds. Upload a single PDF or select multiple PDFs together — free, no signup required.",
              url: "https://pdflinx.com/pdf-excel",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF (single or multiple)",
                  text: "Click the upload area and select one PDF file — or select multiple PDF files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to Excel",
                  text: "Click 'Convert to Excel' and wait a few seconds. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted Excel file. For multiple PDFs, you can download a ZIP containing all XLSX files.",
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

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-excel" },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the PDF to Excel converter free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx PDF to Excel converter is completely free — no hidden charges, no subscription required."
                }
              },
              {
                "@type": "Question",
                "name": "Will my tables and data be extracted accurately?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Rows, columns, and data are extracted accurately into editable Excel (XLSX) format. Best results with PDFs containing selectable text tables."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert multiple PDF files to Excel at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Upload multiple PDF files simultaneously. All converted XLSX files are delivered as a single ZIP download."
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
                "name": "Can I convert PDF to Excel on mobile?",
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Convert PDF to Excel Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF to Excel online free — no signup, no watermark, no software needed. Tables, rows, and data extracted accurately into editable XLSX. Works on Windows, Mac, Android and iOS. Upload one PDF or batch convert multiple PDF files to Excel at once.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleConvert} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      files.length
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />

                    {/* ✅ Single + Multiple UX */}
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your PDF file(s) here or click to upload"
                        : files.length === 1
                        ? files[0].name
                        : `${files.length} files selected (single + multiple upload supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Supports .pdf — select 1 file or select multiple files at once (we'll convert them together)
                    </p>

                    {/* Optional small list preview */}
                    {files.length > 1 && (
                      <div className="mt-3 text-xs text-gray-600 max-h-20 overflow-auto rounded-lg bg-white/60 border border-green-200 p-3">
                        <p className="font-semibold mb-2 text-gray-700">Selected files:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {files.slice(0, 10).map((f) => (
                            <li key={`${f.name}-${f.size}-${f.lastModified}`}>{f.name}</li>
                          ))}
                          {files.length > 10 && <li>...and {files.length - 10} more</li>}
                        </ul>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Convert Button — ProgressButton */}
              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!files.length}
                icon={<FileSpreadsheet className="w-5 h-5" />}
                label="Convert PDF to Excel"
                gradient="from-blue-600 to-green-600"
                type="button"
                onClick={handleConvert}
              />

              {/* Small helper note inside card */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one PDF</span> for a single XLSX, or{" "}
                <span className="font-semibold text-gray-700">select multiple PDFs</span> to convert in one go
                (recommended: download as ZIP).
              </p>

              {/* Scanned PDF tip */}
              <p className="text-center text-xs text-gray-400">
                Tip: Best results for PDFs that contain selectable text/tables. Scanned image PDFs may need OCR.
              </p>
            </form>

            {/* Success State */}
            {success && (
              <div
                id="download-section"
                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />

                <p className="text-xl font-bold text-green-700 mb-2">All set!</p>

                <p className="text-base text-gray-700 mb-3">
                  {isSingle ? (
                    <>Your PDF is now converted into an editable Excel file (XLSX).</>
                  ) : (
                    <>
                      Your <span className="font-semibold">{files.length}</span> PDFs are converted. Download the ZIP to get
                      all XLSX files together.
                    </>
                  )}
                </p>

                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  {isSingle ? "Download XLSX" : "Download ZIP"}
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single & batch conversion • Works on Windows, Mac, Android & iOS
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free PDF to Excel Converter — Extract Tables from PDF to XLSX Without Losing Data
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to edit data that's locked inside a PDF? Convert PDF to Excel here — tables, rows, and columns extracted
            accurately into a clean XLSX file you can edit in Microsoft Excel or Google Sheets. Upload a single PDF or
            batch convert multiple PDFs at once. Fast, free, and privacy-friendly on PDFLinx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tables Extracted Accurately</h3>
            <p className="text-gray-600 text-sm">
              Rows, columns, and data pulled from PDF tables into clean Excel sheets — ready to sort, filter, and calculate.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Editable XLSX Output</h3>
            <p className="text-gray-600 text-sm">
              Open your converted file in Excel, Google Sheets, or LibreOffice Calc — edit, calculate, and sort freely.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one PDF or multiple PDFs at once. Single file downloads as XLSX directly. Multiple files download as a ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert PDF to Excel — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PDF file or upload multiple PDFs at once for batch conversion. Drag and drop supported.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to Excel</h4>
              <p className="text-gray-600 text-sm">
                Hit Convert and wait a few seconds. Tables, rows, and data are extracted into XLSX format automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download XLSX or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as a clean XLSX instantly. Multiple files are packaged into a ZIP with all XLSX files inside.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to do more with your files?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            After converting PDF to Excel, these tools can help you work with your documents faster.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/excel-pdf" className="text-blue-700 font-semibold hover:underline">
                Excel to PDF
              </a>{" "}
              <span className="text-slate-600">— convert your Excel file back to PDF for sharing or printing.</span>
            </li>
            <li>
              <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine multiple PDFs into one before converting to Excel.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce PDF file size before uploading for faster conversion.</span>
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
          Trusted by analysts, accountants, and businesses to extract PDF tables into Excel — fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to Excel Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Got data trapped inside a PDF that you need to edit, sort, or analyze? The{" "}
          <span className="font-medium text-slate-900">PDFLinx PDF to Excel Converter</span>{" "}
          extracts tables from PDF files and converts them into clean, editable XLSX spreadsheets in seconds —
          no software installation, no watermarks, no sign-up required. Works with financial reports, invoices,
          bank statements, data exports, and any PDF containing selectable text tables.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF to Excel Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to Excel conversion extracts structured table data from a PDF document and outputs it into an editable
          Excel spreadsheet (XLSX format). Instead of manually copying rows and columns from a PDF, the converter
          detects table structures automatically and maps them into Excel cells — preserving column alignment, row
          order, and numeric data accurately. The resulting XLSX file can be opened and edited in Microsoft Excel,
          Google Sheets, LibreOffice Calc, or any compatible spreadsheet application.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PDF Files to Excel?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Extract locked data from PDF reports, invoices, and bank statements into editable spreadsheets</li>
          <li>Avoid manual copy-paste errors — table detection is automated and accurate</li>
          <li>Analyze, sort, filter, and calculate data freely once in Excel format</li>
          <li>Re-use financial data, pricing tables, and inventory lists without retyping</li>
          <li>Open and edit on any device — Excel, Google Sheets, or LibreOffice Calc</li>
          <li>Batch convert multiple PDF files to Excel simultaneously — saves hours of manual work</li>
          <li>No Microsoft Excel required to convert — works directly in your browser</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              What Types of PDFs Convert Best to Excel?
            </h3>
            <p className="leading-7">
              <strong>Text-based PDFs</strong> — where the content is actual selectable text — produce the best Excel
              output. This includes digital invoices, financial statements, data exports, bank statements, and reports
              created in Word, Excel, or accounting software and saved as PDF.{" "}
              <strong>Scanned PDFs</strong> — where pages are images of physical documents — require OCR (optical
              character recognition) to extract text before conversion. For scanned PDFs, results may vary depending
              on scan quality. Where possible, use a text-based PDF for the most accurate Excel output.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Get the Best PDF to Excel Conversion Results
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Use <strong>text-based PDFs</strong> where text can be selected — these convert with highest accuracy</li>
              <li>Ensure the PDF is not <strong>password protected</strong> — remove restrictions before uploading</li>
              <li>PDFs with <strong>clear table borders and consistent column spacing</strong> extract most cleanly</li>
              <li>Avoid PDFs with heavily merged cells or complex nested table structures where possible</li>
              <li>For multi-page PDFs, all tables across all pages are extracted into the XLSX output</li>
            </ul>
            <p className="leading-7">
              PDFLinx detects <strong>table structures, row and column alignment, and numeric data</strong> automatically —
              your extracted Excel spreadsheet should be ready to use with minimal manual cleanup.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF to Excel Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Bank statements and financial reports:</strong> Extract transaction tables from bank PDF statements
                into Excel for bookkeeping, reconciliation, and expense tracking.
              </li>
              <li>
                <strong>Invoices and purchase orders:</strong> Pull line item data from supplier invoices into Excel for
                accounting, budgeting, and cost analysis.
              </li>
              <li>
                <strong>Data analysis and research:</strong> Convert data tables from PDF research reports, government
                publications, and academic papers into Excel for analysis.
              </li>
              <li>
                <strong>Inventory and product catalogs:</strong> Extract product lists, pricing tables, and stock data
                from PDF catalogs into editable Excel sheets.
              </li>
              <li>
                <strong>HR and payroll records:</strong> Convert employee data tables, attendance records, and salary
                sheets from PDF into Excel for HR processing.
              </li>
              <li>
                <strong>Sales and performance reports:</strong> Extract sales figures, KPIs, and performance tables from
                PDF dashboards into Excel for further analysis and charting.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PDF to Excel Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple PDF files to Excel at once? Upload multiple PDFs simultaneously. The tool converts
              all files and delivers them as a <strong>ZIP download</strong> containing individual XLSX files — ideal for
              processing monthly statement sets, invoice batches, or bulk data exports. Single file uploads download as
              XLSX directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After batch conversion, to work with a single Excel file combining all data, simply copy and paste between
              the XLSX files. To merge the source PDFs before converting, use the{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF tool
              </a>{" "}
              first.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDFLinx is built with privacy as a core priority. Uploaded PDF files are processed securely and{" "}
              <strong>permanently deleted after conversion</strong> — never stored long-term, never shared with third
              parties, and never used for any other purpose. No account creation is required — no email, no password,
              no personal data collected. Your financial data and documents remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert PDF to Excel on Any Device
            </h3>
            <p className="leading-7">
              PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in any modern browser.
              No app download, no Microsoft Excel required to run the conversion. Whether you are at your desk,
              on a laptop, or on your phone, you can extract PDF tables to Excel in seconds. Fully responsive
              with drag-and-drop file upload supported on all devices.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF to Excel Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF to Excel converter — no hidden fees</li>
            <li>Converts PDF tables to editable XLSX format</li>
            <li>Rows, columns, and data extracted accurately</li>
            <li>Batch conversion — multiple PDFs at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>Single file downloads as XLSX directly</li>
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
          <li><strong>Accountants & finance teams:</strong> Extract bank statement tables, P&L data, and financial report tables into Excel for analysis</li>
          <li><strong>Business owners:</strong> Pull invoice line items and purchase order data from PDF into editable spreadsheets</li>
          <li><strong>Data analysts:</strong> Convert PDF research data, government reports, and statistical tables into Excel for processing</li>
          <li><strong>Students:</strong> Extract data tables from academic papers and research PDFs for analysis and assignments</li>
          <li><strong>HR professionals:</strong> Convert payroll and attendance PDF records into Excel for processing and reporting</li>
          <li><strong>Anyone with PDFs:</strong> Stop retyping data manually — extract it from any PDF into Excel in seconds</li>
        </ul>

      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the PDF to Excel converter free to use?",
                a: "Yes. PDFLinx PDF to Excel converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no Microsoft Excel required to convert, no plugins needed.",
              },
              {
                q: "Will my tables and data be extracted accurately from the PDF?",
                a: "Yes. Rows, columns, and data are detected and extracted accurately into XLSX format. Best results are achieved with text-based PDFs containing clear table structures.",
              },
              {
                q: "Can I convert multiple PDF files to Excel at once?",
                a: "Yes. Upload multiple PDF files simultaneously. All converted XLSX files are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one PDF file?",
                a: "Single file uploads convert and download directly as an XLSX file — no ZIP file, no extra steps.",
              },
              {
                q: "Does it work with scanned PDFs?",
                a: "Scanned PDFs (where pages are images) may require OCR for best results. Text-based PDFs — where content is selectable — produce the most accurate Excel output.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties. Your financial data and documents remain completely private.",
              },
              {
                q: "Can I convert PDF to Excel on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "What if my PDF has multiple pages with tables?",
                a: "All tables across all pages of the PDF are extracted into the XLSX output. Each table may appear on a separate sheet or in sequence depending on the PDF structure.",
              },
              {
                q: "Can I edit the Excel file after converting from PDF?",
                a: "Yes. The converted XLSX file is fully editable — open it in Microsoft Excel, Google Sheets, or LibreOffice Calc and sort, filter, calculate, and modify data freely.",
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

      <RelatedToolsSection currentPage="pdf-excel" />
    </>
  );
}








































// "use client";
// import { useState, useRef } from "react";
// import { Download, CheckCircle, FileSpreadsheet, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";

// export default function PdfToExcel() {
//   // ✅ Single + Multiple dono support
//   const [files, setFiles] = useState([]); // array of PDFs
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(""); // single xlsx OR zip link
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const isSingle = files.length === 1;
//   const isMultiple = files.length > 1;

//   const handleFileChange = (e) => {
//     const selected = Array.from(e.target.files || []);
//     setFiles(selected);
//     setSuccess(false);
//     setDownloadUrl("");
//   };

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!files.length) return alert("Please select a PDF file (or multiple files) first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();

//     // ✅ Multiple + Single: same loop
//     files.forEach((f) => formData.append("files", f));

//     // Optional: backend ko hint
//     formData.append("mode", isSingle ? "single" : "multiple");

//     try {
//       const res = await fetch("/convert/pdf-excel", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         // ✅ Backend recommended behavior:
//         // - single => data.download => "/convert/xyz.xlsx"
//         // - multiple => data.download => "/convert/xyz.zip"
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);

//         // ✅ smooth scroll to download section
//         setTimeout(() => {
//           const downloadSection = document.getElementById("download-section");
//           if (downloadSection) {
//             downloadSection.scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//           }
//         }, 300);
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

//   const getDownloadName = () => {
//     if (isSingle) {
//       return files[0]?.name
//         ? files[0].name.replace(/\.pdf$/i, ".xlsx")
//         : "converted.xlsx";
//     }
//     return "pdflinx-pdf-to-excel.zip";
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;

//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = getDownloadName();
//       a.click();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

//       {/* HowTo Schema - PDF to Excel (single + multiple mention) */}
//       <Script
//         id="howto-schema-pdf-excel"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Convert PDF to Excel Online for Free (Single or Multiple Files)",
//               description:
//                 "Convert PDF tables into Excel (XLSX) in seconds. Upload a single PDF or select multiple PDFs together — free, no signup required.",
//               url: "https://pdflinx.com/pdf-excel",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload PDF (single or multiple)",
//                   text: "Click the upload area and select one PDF file — or select multiple PDF files at once.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Convert to Excel",
//                   text: "Click 'Convert to Excel' and wait a few seconds. If you uploaded multiple files, we convert them together.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Download",
//                   text: "Download your converted Excel file. For multiple PDFs, you can download a ZIP containing all XLSX files.",
//                 },
//               ],
//               totalTime: "PT30S",
//               estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//               image: "https://pdflinx.com/og-image.png",
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       {/* Breadcrumb Schema - PDF to Excel */}
//       <Script
//         id="breadcrumb-schema-pdf-excel"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//                 { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-excel" },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               PDF to Excel Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Need to extract tables from a PDF into Excel? Drop it here — we’ll convert it into a clean{" "}
//               <span className="font-semibold text-gray-800">XLSX</span>.
//               <span className="font-semibold text-gray-800"> Upload a single PDF or select multiple PDFs together.</span>{" "}
//               Fast and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleConvert} className="space-y-6">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div
//                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
//                       files.length
//                         ? "border-green-500 bg-green-50"
//                         : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//                     }`}
//                   >
//                     <div className="flex items-center justify-center gap-3 mb-3">
//                       {/* <FileText className="w-10 h-10 text-blue-600" /> */}
//                       <FileSpreadsheet className="w-10 h-10 text-green-600" />
//                     </div>

//                     {/* ✅ Single + Multiple UX */}
//                     <p className="text-lg font-semibold text-gray-700">
//                       {files.length === 0
//                         ? "Drop your PDF file(s) here or click to upload"
//                         : files.length === 1
//                         ? files[0].name
//                         : `${files.length} files selected (single + multiple upload supported)`}
//                     </p>

//                     <p className="text-sm text-gray-500 mt-1">
//                       Supports .pdf — select 1 file or select multiple files at once (we’ll convert them together)
//                     </p>

//                     {/* Optional small list preview */}
//                     {files.length > 1 && (
//                       <div className="mt-3 text-xs text-gray-600 max-h-20 overflow-auto rounded-lg bg-white/60 border border-green-200 p-3">
//                         <p className="font-semibold mb-2 text-gray-700">Selected files:</p>
//                         <ul className="list-disc pl-5 space-y-1">
//                           {files.slice(0, 10).map((f) => (
//                             <li key={`${f.name}-${f.size}-${f.lastModified}`}>{f.name}</li>
//                           ))}
//                           {files.length > 10 && <li>...and {files.length - 10} more</li>}
//                         </ul>
//                       </div>
//                     )}
//                   </div>

//                   <input
//                     type="file"
//                     multiple
//                     accept="application/pdf,.pdf"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || files.length === 0}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     <FileSpreadsheet className="w-5 h-5" />
//                     Convert to Excel
//                   </>
//                 )}
//               </button>

//               {/* Helper note */}
//               <p className="text-center text-sm text-gray-500">
//                 ✅ Upload <span className="font-semibold text-gray-700">one PDF</span> for a single XLSX, or{" "}
//                 <span className="font-semibold text-gray-700">select multiple PDFs</span> to convert in one go
//                 (recommended: download as ZIP).
//               </p>

//               {/* Tiny disclaimer for scanned PDFs (optional but helpful) */}
//               <p className="text-center text-xs text-gray-400">
//                 Tip: Best results for PDFs that contain selectable text/tables. Scanned image PDFs may need OCR.
//               </p>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div
//                 id="download-section"
//                 className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center"
//               >
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />

//                 <p className="text-xl font-bold text-green-700 mb-2">All set!</p>

//                 <p className="text-base text-gray-700 mb-3">
//                   {isSingle ? (
//                     <>Your PDF is now converted into an Excel file (XLSX).</>
//                   ) : (
//                     <>
//                       Your <span className="font-semibold">{files.length}</span> PDFs are converted. Download the ZIP to get
//                       all XLSX files together.
//                     </>
//                   )}
//                 </p>

//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   {isSingle ? "Download XLSX" : "Download ZIP"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer Note */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Single + multiple uploads supported • Files gone after 1 hour • Completely free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION (short + clean) ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//             PDF to Excel Online Free – Extract Tables Fast
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Convert PDF tables into editable Excel spreadsheets. Upload{" "}
//             <span className="font-semibold text-gray-800">one PDF</span> or{" "}
//             <span className="font-semibold text-gray-800">multiple PDFs</span> to convert in one go.
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
//             Convert PDF to Excel in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload PDF(s)</h4>
//               <p className="text-gray-600 text-sm">Select one PDF or choose multiple PDFs together.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Convert</h4>
//               <p className="text-gray-600 text-sm">We extract tables and export to Excel (XLSX).</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download</h4>
//               <p className="text-gray-600 text-sm">Single file = XLSX, multiple files = ZIP.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="pdf-excel" />
//     </>
//   );
// }





































// // "use client";
// // import { useState } from "react";
// // import { Upload, FileSpreadsheet, Download, CheckCircle } from "lucide-react";
// // import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // export default function PdfToExcel() {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file) return alert("Please select a PDF file first!");

// //     setLoading(true);
// //     setDownloadUrl(null);
// //     setSuccess(false);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await fetch("/convert/pdf-to-excel", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setDownloadUrl(`/converted/${data.filename}`);
// //         setSuccess(true);
// //       } else {
// //         alert("Conversion failed: " + (data.error || "Unknown error"));
// //       }
// //     } catch (err) {
// //       alert("Something went wrong, please try again.");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = () => {
// //     if (!downloadUrl) return;
// //     const link = document.createElement("a");
// //     link.href = downloadUrl;
// //     // link.download = file.name.replace(/\.pdf$/i, ".xlsx");
// //     a.download = file.name.replace(/\.pdf$/i, ".xls");
// //     link.click();
// //   };

// //   return (
// //     <>
// //       {/* ==================== SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Convert PDF to Excel Online for Free",
// //             description: "Extract tables from PDF to editable Excel (XLSX) in seconds – completely free, no signup.",
// //             url: "https://pdflinx.com/pdf-to-excel",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PDF", text: "Drop or select your PDF file with tables." },
// //               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
// //               { "@type": "HowToStep", name: "Download Excel", text: "Get your editable XLSX file instantly." },
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png",
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-to-excel" },
// //             ],
// //           }, null, 2),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
// //               PDF to Excel Converter <br /> Online (Free)
// //             </h1>
// //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //               Got tables trapped in a PDF? Drop it here – we’ll pull them out into a clean, editable Excel file in seconds. No sign-up, no watermark!
// //             </p>
// //           </div>

// //           {/* Upload Card */}
// //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="relative">
// //                 <label className="block">
// //                   <div
// //                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
// //                       ? "border-green-500 bg-green-50"
// //                       : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
// //                       }`}
// //                   >
// //                     <Upload className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
// //                     <p className="text-lg font-semibold text-gray-700">
// //                       {file ? file.name : "Drop your PDF file here or click to upload"}
// //                     </p>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       Only .pdf files • Up to 100MB
// //                     </p>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     accept="application/pdf"
// //                     onChange={(e) => setFile(e.target.files?.[0] || null)}
// //                     className="hidden"
// //                     required
// //                   />
// //                 </label>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading || !file}
// //                 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
// //               >
// //                 {loading ? (
// //                   <>Converting... hang tight!</>
// //                 ) : (
// //                   <>
// //                     <FileSpreadsheet className="w-5 h-5" />
// //                     Convert to Excel
// //                   </>
// //                 )}
// //               </button>
// //             </form>

// //             {/* Success State */}
// //             {success && (
// //               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
// //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //                 <p className="text-xl font-bold text-green-700 mb-3">
// //                   Done! Your Excel file is ready
// //                 </p>
// //                 <p className="text-gray-600 mb-4">
// //                   Tables extracted and ready to edit in Excel
// //                 </p>
// //                 <button
// //                   onClick={handleDownload}
// //                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
// //                 >
// //                   <Download className="w-5 h-5" />
// //                   Download Excel (.xls)
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           <p className="text-center mt-6 text-gray-600 text-base">
// //             No account • No watermark • Files gone after 1 hour • Completely free
// //           </p>
// //         </div>
// //       </main>

// //       {/* ==================== SEO CONTENT SECTION ==================== */}
// //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// //         <div className="text-center mb-12">
// //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
// //             PDF to Excel Online Free – Extract Tables Perfectly
// //           </h2>
// //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //             Turn scanned or digital PDFs with tables into editable Excel spreadsheets. Accurate table detection, formulas preserved where possible – fast and always free on PDF Linx!
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// //           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <FileSpreadsheet className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Tables Extracted</h3>
// //             <p className="text-gray-600 text-sm">
// //               Rows, columns, and data pulled accurately into Excel sheets
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border border-emerald-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <CheckCircle className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Editable XLSX</h3>
// //             <p className="text-gray-600 text-sm">
// //               Open in Excel, Google Sheets – edit, calculate, sort freely
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <Download className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
// //             <p className="text-gray-600 text-sm">
// //               Instant conversion, no signup, files deleted after 1 hour
// //             </p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// //             Convert PDF to Excel in 3 Easy Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-8">
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 1
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
// //               <p className="text-gray-600 text-sm">Drop the file with tables here</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 2
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
// //               <p className="text-gray-600 text-sm">We extract tables intelligently</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 3
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Download Excel</h4>
// //               <p className="text-gray-600 text-sm">Get your editable spreadsheet!</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// //           Thousands use PDF Linx daily to free trapped data from PDFs into Excel – accurate, fast, and always free.
// //         </p>
// //       </section>

// //       <RelatedToolsSection currentPage="pdf-to-excel" />
// //     </>
// //   )