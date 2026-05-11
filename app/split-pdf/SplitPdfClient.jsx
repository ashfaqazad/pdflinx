"use client";

import { useState } from "react";
import { Scissors, GitMerge, FileText, Minimize2, Lock } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── CONFIG ─────────────────────────────────
const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ How splitting works
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Upload one PDF file</li>
      <li>Every page → individual PDF</li>
      <li>All pages delivered in one ZIP</li>
      <li>Keep only the pages you need</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ All pages in ZIP",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">✂️ About splitting</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Every page → separate PDF file</li>
      <li>✓ All pages packed in one ZIP</li>
      <li>✓ Original quality preserved</li>
      <li>✓ No re-compression applied</li>
      <li>✓ Use Merge PDF to recombine pages</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

export default function SplitPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = flow.files[0]
        ? flow.files[0].name.replace(/\.pdf$/i, "-split-pages.zip")
        : "split-pages.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  // ── API LOGIC ─────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select a PDF file");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    formData.append("file", flow.files[0]);

    try {
      const res = await fetch("/convert/split-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();
        flow.finishSuccess();
      } else {
        cancelProgress();
        flow.handleError(data.error || "Split failed");
      }
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ─────────────────────────

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Split a PDF into Individual Pages Online",
            url: "https://pdflinx.com/split-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." },
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
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
              { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-split-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How do I split a PDF into individual pages?", acceptedAnswer: { "@type": "Answer", text: "Upload your PDF, click Split PDF, and download the ZIP containing individual pages." } },
              { "@type": "Question", name: "Is the PDF splitter free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Split PDF is completely free and works directly in your browser." } },
              { "@type": "Question", name: "Does splitting a PDF affect quality?", acceptedAnswer: { "@type": "Answer", text: "No. All pages keep their original quality, text, and formatting." } },
              { "@type": "Question", name: "Can I split PDF on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. Works on Android, iPhone, tablets, and desktop browsers." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Split PDF Online Free"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Split PDF"
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — split pages easily"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        // Options
        optionsTitle="Split options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={OPTIONS_SLOT}
        // Processing
        processingTitle="Splitting your PDF"
        processingDescription="Please wait while we separate your PDF pages."
        processingStages={["Uploading file", "Separating pages", "Generating ZIP"]}
        // Done
        doneTitle="Your split pages are ready"
        doneDescription="Every page has been separated into its own PDF file."
        doneFileName="split-pages.zip"
        downloadLabel="Download ZIP"
        resetLabel="Split another PDF"
        // Sidebar
        sidebarTitle="Split PDF"
        sidebarIcon={<Scissors className="h-5 w-5 text-orange-500" />}
        sidebarDescription="Split any PDF into individual pages — every page becomes its own PDF file in a ZIP."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}
        // uploadLanding={true}

        uploadLanding={{
          content: {
            heroBadge: "✦ Free PDF Splitter · No Signup Required",

            // heroTitle: "Split PDF Files Online",
            heroTitle: (
              <>
                Split PDF Files Online{" "}
                <em className="text-[#e8420a]"> <br/>
                   for Free</em>
                {/* <em className="not-italic text-rose-600">Online</em> */}
              </>
            ),

            heroDescription:
              "Split PDF pages online in seconds. Extract, separate, or divide PDF files securely without signup or software. Free PDF splitter that works directly in your browser on Windows, Mac, Android, and iPhone.",

            pills: [
              "Separate PDF pages",
              "ZIP download",
              "No quality loss",
              "Works on all devices",
            ],

            noticeItems: [
              "Every page becomes separate PDF",
              "All pages packed into ZIP",
              "Original quality preserved",
            ],

            seoBadge: "Split PDF Guide",

            seoTitle: "Free Online Split PDF Tool by PDFLinx",

            seoDescription:
              "Separate PDF pages into individual files online. Fast, secure, and no signup required.",

            howToTitle: "How to Split a PDF — 3 Simple Steps",

            howToSubtitle:
              "Upload your PDF, split pages automatically, and download all files in one ZIP.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF",
                desc:
                  "Select your PDF file — any size, any number of pages. Drag and drop supported on all devices.",
              },
              {
                n: "2",
                title: "Click Split PDF",
                desc:
                  "Hit the Split button — the tool separates every page into its own individual PDF file automatically.",
              },
              {
                n: "3",
                title: "Download ZIP",
                desc:
                  "All split pages are packaged into a ZIP file — download and extract the individual PDF pages you need.",
              },
            ],

            whyTitle: "Why Use PDFLinx Split PDF Tool?",

            faqTitle: "Split PDF FAQs",

            faqs: [
              {
                q: "Is the PDF splitter free to use?",
                a:
                  "Yes. PDFLinx Split PDF is completely free — no hidden charges, no subscription required.",
              },
              {
                q: "Do I need to install any software to split a PDF?",
                a:
                  "No. Everything works directly in your browser. No desktop software or plugins needed.",
              },
              {
                q: "How does the PDF get split — what do I receive?",
                a:
                  "Every page in your PDF is separated into its own individual PDF file. All split pages are packaged into a ZIP file for download.",
              },
              {
                q: "Will the quality of my PDF pages change after splitting?",
                a:
                  "No. PDFLinx extracts the original page data directly — no re-rendering or compression. Text and images stay exactly as they were.",
              },
              {
                q: "Can I extract only specific pages from a PDF?",
                a:
                  "Split the PDF to get all pages as individual files, then keep only the specific page PDFs you need from the ZIP.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a:
                  "Yes. Files are processed securely and permanently deleted after splitting.",
              },
              {
                q: "Can I split a PDF on my phone?",
                a:
                  "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers.",
              },
              {
                q: "How do I combine split pages back into one PDF?",
                a:
                  "After splitting, use the Merge PDF tool — upload the individual page PDFs and download one merged PDF file.",
              },
            ],

            relatedTitle: "More PDF Tools",

            seoSections: [
              {
                title: "Split Large PDF Files Easily",
                text:
                  "Separate large PDF documents into smaller individual page files without losing quality.",
              },
              {
                title: "Keep Original PDF Quality",
                text:
                  "All split PDF pages preserve original text, images, and formatting.",
              },
              {
                title: "Extract Individual PDF Pages",
                text:
                  "Convert every page of your PDF into separate standalone PDF files for easier sharing and organization.",
              },
              {
                title: "Secure PDF Splitting Online",
                text:
                  "Your uploaded PDF files are processed securely and automatically deleted after processing.",
              },
            ],

            showPdfTypes: false,
          },
        }}

      />

      {/* ── SEO CONTENT ── */}
      {/* HowTo Steps */}
      {/* <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Free PDF Splitter — Extract &amp; Separate PDF Pages Into Individual Files
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need only a few pages from a large PDF? Split it here — every page becomes its own PDF file,
            packed into a ZIP for easy download.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Split a PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Upload Your PDF", desc: "Select your PDF file — any size, any number of pages. Drag and drop supported on all devices." },
              { n: "2", title: "Click Split PDF", desc: "Hit the Split button — the tool separates every page into its own individual PDF file automatically." },
              { n: "3", title: "Download ZIP", desc: "All split pages are packaged into a ZIP file — download and extract the individual PDF pages you need." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                  {s.n}
                </div>
                <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm rounded-2xl border border-slate-100">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">Need to do more with your PDF pages?</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">Merge PDF</a> <span className="text-slate-600">— combine selected split pages back into one organized PDF.</span></li>
            <li><a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">Compress PDF</a> <span className="text-slate-600">— reduce individual page PDF sizes before sharing.</span></li>
            <li><a href="/pdf-to-word" className="text-blue-700 font-semibold hover:underline">PDF to Word</a> <span className="text-slate-600">— convert extracted pages to editable Word documents.</span></li>
          </ul>
        </div>
      </section> */}

      {/* FAQ */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is the PDF splitter free to use?", a: "Yes. PDFLinx Split PDF is completely free — no hidden charges, no subscription required." },
              { q: "Do I need to install any software to split a PDF?", a: "No. Everything works directly in your browser. No desktop software or plugins needed." },
              { q: "How does the PDF get split — what do I receive?", a: "Every page in your PDF is separated into its own individual PDF file. All split pages are packaged into a ZIP file for download." },
              { q: "Will the quality of my PDF pages change after splitting?", a: "No. PDF Linx extracts the original page data directly — no re-rendering or compression. Text and images stay exactly as they were." },
              { q: "Can I extract only specific pages from a PDF?", a: "Split the PDF to get all pages as individual files, then keep only the specific page PDFs you need from the ZIP." },
              { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after splitting." },
              { q: "Can I split a PDF on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers." },
              { q: "How do I combine split pages back into one PDF?", a: "After splitting, use the Merge PDF tool — upload the individual page PDFs and download one merged PDF file." },
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

      <RelatedToolsSection currentPage="split-pdf" /> */}
    </>
  );
}

