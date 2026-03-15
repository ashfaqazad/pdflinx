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
              "description": "Free online Word to PDF converter. Convert DOC and DOCX files to high-quality PDF without losing formatting. No signup required.",
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
              Word to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert Word documents to PDF instantly — formatting, fonts, tables, and
              images stay exactly the same. Upload a single DOC or DOCX file, or batch
              convert up to 10 files at once. Perfect for resumes, invoices, contracts,
              and assignments. No signup, no watermark, completely free.
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length
                        ? `${files.length} file(s) selected`
                        : "Drop your Word file(s) here or click to upload"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Only .doc & .docx files
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Upload multiple Word files at once. A single file downloads as PDF, multiple files download as a ZIP.
                    </p>
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
              </div>

              {/* Convert Button */}
              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!files.length}
                icon={<FileText className="w-5 h-5" />}
                label="Convert to PDF"
                gradient="from-blue-600 to-green-600"
              />

              {/* ✅ ALWAYS show UX notice */}
              <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                <p>
                  ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong>
                  Please don’t close this tab.
                </p>
                <p>
                  🔢 You can convert up to <strong>10 Word files at once</strong>.
                </p>
              </div>

            </form>

            {/* Success State */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your file(s) downloaded automatically 🎉
                </p>
                <p className="text-base text-gray-700">
                  Check your downloads folder.
                </p>
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
            Word to PDF Online Free – Convert DOC/DOCX to PDF in Seconds
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

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Word to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          A Word to PDF converter is an essential tool for anyone who needs to share
          documents professionally. Converting a Word file (DOC or DOCX) to PDF ensures
          that fonts, margins, tables, images, and the overall layout remain consistent
          across every device, operating system, and screen size — whether the recipient
          is on Windows, macOS, Android, or iOS. The{" "}
          <span className="font-medium text-slate-900">PDFLinx Word to PDF Converter</span>{" "}
          handles the conversion instantly in your browser with no software installation
          and no account required.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is Word to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          Word to PDF conversion transforms an editable Microsoft Word document into a
          fixed-layout, read-only PDF file. PDFs are universally compatible — they open
          identically on every device without requiring Microsoft Word or any other word
          processor. This makes PDF the preferred format for sharing resumes, invoices,
          contracts, reports, and academic assignments.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert Word Files to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves fonts, margins, tables, images, and embedded graphics</li>
          <li>Opens on every device without Microsoft Word installed</li>
          <li>Cross-platform compatible — Windows, macOS, Linux, Android, iOS</li>
          <li>Print-ready format with consistent page layout</li>
          <li>Professional and polished appearance for client deliverables</li>
          <li>Read-only by default — protects document content from accidental edits</li>
          <li>Smaller, optimized file size for easy email sharing and uploading</li>
          <li>Required format for most job portals, university submissions, and official forms</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Word vs PDF – What Is the Difference?
            </h3>
            <p className="leading-7">
              A <strong>Word document (DOC/DOCX)</strong> is an editable file — ideal for
              drafting, revising, and collaborating. A <strong>PDF (Portable Document Format)</strong>{" "}
              is a fixed-layout format designed for sharing, printing, and archiving. When you
              convert a Word file to PDF, the document becomes read-only with a locked layout —
              meaning fonts, spacing, and structure look identical on every device. This is why
              professionals convert Microsoft Word files to PDF before sending resumes, contracts,
              invoices, and reports.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              DOC vs DOCX – Which Format Converts Better?
            </h3>
            <p className="leading-7">
              <strong>DOCX</strong> is the modern Word format introduced with Microsoft Office 2007
              and generally converts to PDF with higher accuracy — better support for styles,
              embedded fonts, images, and complex layouts. <strong>DOC</strong> is the older format
              and also supported, but DOCX to PDF conversion tends to produce the cleanest output
              for documents with advanced formatting. If you have a choice, save your file as DOCX
              before converting.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert Word to PDF Without Losing Formatting
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Use <strong>DOCX format</strong> where possible — better layout support than DOC</li>
              <li>Use standard, widely available fonts (Calibri, Arial, Times New Roman, Georgia)</li>
              <li>Keep page size consistent — A4 or Letter — to avoid layout shifts</li>
              <li>Ensure tables and images are within page margins before converting</li>
              <li>Avoid text boxes with unusual positioning — these sometimes shift during conversion</li>
            </ul>
            <p className="leading-7">
              PDF Linx is built to preserve <strong>fonts, headings, tables, images, and page
                structure</strong> — your Word document should look identical after PDF conversion.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for Word to PDF Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Resume and CV submission:</strong> Job portals and ATS systems prefer PDF.
                Converting your resume from DOCX to PDF ensures layout stays intact for recruiters.
              </li>
              <li>
                <strong>Invoice and contract sharing:</strong> Send invoices and client agreements
                as PDF to prevent accidental edits and ensure consistent formatting.
              </li>
              <li>
                <strong>Academic assignment submission:</strong> Universities and online learning
                platforms typically require PDF for assignment and thesis submissions.
              </li>
              <li>
                <strong>Business reports and proposals:</strong> Convert Word reports to PDF for
                professional client presentations and internal distribution.
              </li>
              <li>
                <strong>Legal documents:</strong> Convert agreements, NDAs, and official
                correspondence to PDF to preserve formatting and prevent modifications.
              </li>
              <li>
                <strong>Print-ready documents:</strong> PDF is the standard format for print
                shops and professional printing — consistent page layout guaranteed.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch Word to PDF Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple Word files at once? Upload up to{" "}
              <strong>10 DOC or DOCX files</strong> simultaneously. The tool converts all files
              and delivers them as a <strong>ZIP download</strong> containing individual PDFs —
              ideal for batch processing resumes, office documents, assignments, or client
              deliverables. Single file uploads download as a PDF directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After batch conversion, if you need to combine the PDFs into one document, use the{" "}
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
              PDF Linx is designed with privacy in mind. Uploaded Word files are processed
              automatically and <strong>permanently deleted after conversion</strong> — they are
              never stored long-term, shared with third parties, or used for any other purpose.
              No account creation is required, which means no email address, no password, and
              no personal data collected. Your documents stay private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert Word to PDF on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in
              any modern browser. No app download, no software installation. Whether you're on a
              desktop at work, a laptop at university, or a phone on the go, you can convert
              Word documents to PDF in seconds. The tool is fully responsive and supports
              drag-and-drop file upload on all devices including touchscreens.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx Word to PDF Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online Word to PDF converter — no hidden fees</li>
            <li>Supports DOC and DOCX file formats</li>
            <li>Batch conversion — up to 10 files at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>Formatting, fonts, and layout fully preserved</li>
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
          <li><strong>Students:</strong> Convert assignments, essays, and thesis documents to PDF for university submission portals</li>
          <li><strong>Job seekers:</strong> Convert resumes and cover letters from DOCX to PDF for job applications and ATS systems</li>
          <li><strong>Professionals:</strong> Share reports, proposals, and meeting minutes as read-only PDFs</li>
          <li><strong>Businesses:</strong> Convert invoices, contracts, and official correspondence to PDF format</li>
          <li><strong>Freelancers:</strong> Deliver polished, professional documents to clients as PDFs</li>
          <li><strong>Teachers:</strong> Distribute learning material, assignments, and handouts in PDF format</li>
          <li><strong>Legal professionals:</strong> Convert agreements and legal documents to fixed-layout PDF for archiving</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions — Word to PDF
        </h3>
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

