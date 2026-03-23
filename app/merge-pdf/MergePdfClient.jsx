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


  const handleMerge = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    startProgress();        // ← setLoading(true) ki jagah
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();   // ← setLoading(false) ki jagah

        setSuccess(true);

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
        alert("Merge failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      cancelProgress();       // ← catch pe
      alert("Error merging PDFs. Please try again.");
      console.error(error);
    }
    // finally hata diya — hook khud handle karta hai
  };


  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-pdf.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download merged PDF");
    }
  };

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
            <p className="text-gray-600 mt-3 leading-7">
              Merge multiple PDF files into one online free — no signup, no watermark, no software needed. Works on Windows, Mac, Android and iOS. Upload 2 or more PDFs, arrange them in the right order, and download one clean merged PDF instantly.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Upload Area */}
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
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                >
                  <Files className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
                  <p className="text-lg font-semibold text-gray-800">
                    {files.length > 0 ? `${files.length} PDF${files.length > 1 ? 's' : ''} ready` : "Drop PDFs here or click to upload"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Combine 2 or more into one clean file</p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                        <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
                        <p className="text-xs text-center font-medium truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Merge Button */}

              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={files.length < 2}   // ← 2 se kam pe disable
                icon={<Files className="w-5 h-5" />}
                label="Merge PDFs Now"
                gradient="from-indigo-600 to-purple-600"  // ← bg-gradient-to-r hata diya
                type="button"                  // ← form nahi hai toh button
                onClick={handleMerge}          // ← seedha function pass karo
              />
            </div>

            {/* Success State */}
            {success && (
              <div
                id="download-section"  // ✅ BAS YE EK LINE ADD KARO

                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All merged!</p>
                <p className="text-base text-gray-700 mb-3">Your PDFs are now one perfect file</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • No watermark • Auto-deleted after 1 hour • 100% free •
            Unlimited files • Works on Windows, Mac, Android & iOS
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
