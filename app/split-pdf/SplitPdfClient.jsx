// app/split-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Scissors } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";
// import { Upload, FileText, Download, CheckCircle, X, Files } from "lucide-react";
import { Files } from "lucide-react";




export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();



  const handleFileChange = (e) => setFile(e.target.files[0] || null);


  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    startProgress();        // ← setLoading(true) ki jagah

    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/convert/split-pdf", { method: "POST", body: formData });
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
        alert("Split failed: " + (data.error || "Try again"));
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
      a.download = file ? file.name.replace(/\.pdf$/i, "-split-pages.zip") : "split-pages.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>


      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

      {/* HowTo Schema - Split PDF */}
      <Script
        id="howto-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Split a PDF into Individual Pages Online",
            description: "Split PDF into individual pages online free — no signup, no watermark. Every page becomes its own PDF file in a ZIP download. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/split-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." }
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Split PDF */}
      <Script
        id="breadcrumb-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-split-pdf"
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
                  "name": "How do I split a PDF into individual pages?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your PDF, click Split PDF, and download the ZIP containing individual pages."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I extract only specific pages from a PDF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. You can split a PDF and extract specific pages or page ranges easily."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is the PDF splitter free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. PDFLinx Split PDF is completely free and works directly in your browser."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does splitting a PDF affect quality?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. All pages keep their original quality, text, and formatting."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I split PDF on mobile?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. The PDF splitter works on Android, iPhone, tablets, and desktop browsers."
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Split PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              F file, downloaded together in a ZIP. Works on Windows, Mac, Android and iOS. Perfect for extracting specific pages, separating chapters, or breaking large documents into parts.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSplit} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <Scissors className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {file ? file.name : "Drop your PDF here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">We’ll split it page by page – easy peasy!</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Split Button */}
              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!file}                    // ← split ke liye single file check
                icon={<Files className="w-5 h-5" />} // jo bhi icon use kar rahe ho
                label="Split PDF Now"
                gradient="from-indigo-600 to-purple-600"  // apna tool ka color yahan daal do
                type="button"                       // ← important (form nahi hai)
                onClick={handleSplit}               // ← important
              />
            </form>

            {/* Success State */}
            {success && (
              <div
                id="download-section"  // ✅ BAS YE EK LINE ADD KARO
                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All split!</p>
                <p className="text-base text-gray-700 mb-3">Your pages are ready in a handy ZIP</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download ZIP File
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            All pages in one ZIP • Works on Windows, Mac, Android & iOS
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free PDF Splitter — Extract & Separate PDF Pages Into Individual Files
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need only a few pages from a large PDF? Split it here — every page
            becomes its own PDF file, packed into a ZIP for easy download.
            Perfect for extracting specific pages, separating chapters, or
            breaking large documents into manageable parts. Fast, free, and
            privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Every Page Separated</h3>
            <p className="text-gray-600 text-sm">
              Upload one PDF and every page splits into its own individual PDF
              file — all delivered together in a single ZIP download.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Original Quality Preserved</h3>
            <p className="text-gray-600 text-sm">
              Text, images, formatting, and layout stay exactly as they were —
              no re-rendering, no quality loss, no compression applied.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Splits in seconds — no sign-up, no watermark, files permanently
              deleted after processing to protect your privacy.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Split a PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
              <p className="text-gray-600 text-sm">
                Select your PDF file — any size, any number of pages. Drag and
                drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Split PDF Now</h4>
              <p className="text-gray-600 text-sm">
                Hit the Split button — the tool separates every page into its
                own individual PDF file automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download ZIP</h4>
              <p className="text-gray-600 text-sm">
                All split pages are packaged into a ZIP file — download and
                extract the individual PDF pages you need.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to do more with your PDF pages?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Split is often just one step — merge selected pages, compress, or convert your documents too.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine selected split pages back into one organized PDF.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce individual page PDF sizes before sharing or uploading.</span>
            </li>
            <li>
              <a href="/pdf-to-word" className="text-blue-700 font-semibold hover:underline">
                PDF to Word
              </a>{" "}
              <span className="text-slate-600">— convert extracted pages to editable Word documents.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, compress, convert, protect & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to split PDF files —
          fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF Splitter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Received a large PDF but only need a few specific pages? Or need to
          separate a multi-section document into individual files? The{" "}
          <span className="font-medium text-slate-900">PDFLinx Split PDF tool</span>{" "}
          splits any PDF into individual page files instantly — no software
          installation, no watermarks, no sign-up required. Upload your PDF, click
          Split, and download all pages as a ZIP in seconds.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF Splitting?
        </h3>
        <p className="leading-7 mb-6">
          PDF splitting separates a single multi-page PDF document into individual
          PDF files — one file per page. Each split page preserves the original
          text, images, formatting, and layout exactly as it appeared in the source
          document. The split pages are delivered as a ZIP file containing all
          individual PDFs, which you can then use, share, or recombine as needed.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Split PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Extract only the specific pages you need from a large document</li>
          <li>Separate a multi-chapter report into individual section files</li>
          <li>Remove unwanted pages by splitting and recombining selectively</li>
          <li>Share a single page or section without sending the entire PDF</li>
          <li>Break large scanned documents into individual page files</li>
          <li>Separate invoices, receipts, or statements from a bulk PDF</li>
          <li>Divide a merged PDF back into its original source documents</li>
          <li>Reduce file size by extracting only the pages needed for submission</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Does Splitting a PDF Affect Quality?
            </h3>
            <p className="leading-7">
              No. PDF Linx splits files by extracting the original page data directly —
              there is no re-rendering, no re-compression, and no quality loss. Text
              stays sharp, images stay clear, and formatting remains exactly as it was
              in the original document. Each split page is identical to how it looked
              inside the original PDF.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Extract Specific Pages After Splitting
            </h3>
            <p className="leading-7">
              PDF Linx splits every page into its own individual PDF file delivered
              in a ZIP. To extract only specific pages, download the ZIP, open it,
              and keep only the page files you need — discard the rest. To combine
              your selected pages back into one document, use the{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF tool
              </a>{" "}
              to join the individual page PDFs into one organized file.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF Splitting
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Extracting specific pages:</strong> Pull out a single
                contract page, certificate, or figure from a large multi-page PDF
                document.
              </li>
              <li>
                <strong>Separating invoices and receipts:</strong> Split a bulk
                monthly statement PDF into individual invoice or receipt pages for
                accounting and record-keeping.
              </li>
              <li>
                <strong>Dividing academic documents:</strong> Separate chapters,
                sections, or appendices from a thesis, report, or textbook PDF into
                individual files.
              </li>
              <li>
                <strong>Removing unwanted pages:</strong> Split the PDF, keep only
                the pages needed, then use Merge PDF to reassemble a clean version
                without the unwanted pages.
              </li>
              <li>
                <strong>Sharing partial documents:</strong> Extract and share only
                the relevant section of a confidential document without exposing
                the full file.
              </li>
              <li>
                <strong>Scanned document processing:</strong> Split a bulk scanned
                document into individual page PDFs for filing, archiving, or
                separate distribution.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Split PDF vs Extract Pages — What Is the Difference?
            </h3>
            <p className="leading-7">
              <strong>Split PDF</strong> separates every page of a document into
              individual files — useful when you need all pages as separate PDFs.{" "}
              <strong>Extracting pages</strong> means selecting specific pages to
              keep. PDF Linx splits all pages into individual files — to extract
              specific pages, split first and then keep only the pages you need from
              the ZIP. To remove pages, split and use Merge PDF to reassemble only
              the pages you want to keep.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded PDF files
              are processed securely and{" "}
              <strong>permanently deleted after splitting</strong> — never stored
              long-term, never shared with third parties, and never used for any
              other purpose. No account creation is required — no email, no password,
              no personal data collected. Your documents remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Split PDF on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation. Whether
              you are at your desk, on a laptop, or on your phone, you can split any
              PDF in seconds. Fully responsive with drag-and-drop file upload
              supported on all devices including touchscreens.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF Splitter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF splitter — no hidden fees</li>
            <li>Splits every page into individual PDF files</li>
            <li>All split pages delivered in one ZIP download</li>
            <li>Original text, images, and formatting fully preserved</li>
            <li>No quality loss — original page data extracted directly</li>
            <li>Fast processing — split in seconds</li>
            <li>No watermark added to split pages</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after splitting — privacy protected</li>
            <li>No signup or account required</li>
            <li>Cross-platform: Windows, macOS, Android, iOS</li>
            <li>Drag-and-drop upload supported</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Extract chapters, figures, or specific pages from textbooks and study PDFs</li>
          <li><strong>Professionals:</strong> Pull specific sections, pages, or clauses from contracts and reports</li>
          <li><strong>Businesses:</strong> Separate individual invoices or receipts from bulk statement PDFs</li>
          <li><strong>Legal professionals:</strong> Extract specific pages from legal documents for separate filing or sharing</li>
          <li><strong>Administrative staff:</strong> Split bulk scanned document batches into individual page files for archiving</li>
          <li><strong>Anyone:</strong> Break any large PDF into individual pages to use, share, or recombine as needed</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions — Split PDF
        </h3>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the PDF splitter free to use?",
                a: "Yes. PDFLinx Split PDF is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software to split a PDF?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "How does the PDF get split — what do I receive?",
                a: "Every page in your PDF is separated into its own individual PDF file. All split pages are packaged into a ZIP file for download — open the ZIP and use whichever pages you need.",
              },
              {
                q: "Will the quality of my PDF pages change after splitting?",
                a: "No. PDF Linx extracts the original page data directly — no re-rendering or compression. Text, images, and formatting stay exactly as they were in the original document.",
              },
              {
                q: "Can I extract only specific pages from a PDF?",
                a: "Yes. Split the PDF to get all pages as individual files, then keep only the specific page PDFs you need from the ZIP. Use the Merge PDF tool to recombine selected pages into one document.",
              },
              {
                q: "Can I remove pages from a PDF using this tool?",
                a: "Yes. Split the PDF into individual pages, keep only the pages you want, then use the Merge PDF tool to reassemble a clean version without the unwanted pages.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after splitting. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I split a PDF on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "What is the difference between splitting and extracting PDF pages?",
                a: "Splitting separates all pages into individual files. Extracting means keeping only specific pages. PDF Linx splits all pages — to extract specific ones, take only the page files you need from the downloaded ZIP.",
              },
              {
                q: "How do I combine split pages back into one PDF?",
                a: "After splitting, use the Merge PDF tool on PDF Linx — upload the individual page PDFs you want to combine and download one merged PDF file.",
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
      <RelatedToolsSection currentPage="split-pdf" />
    </>
  );
}



