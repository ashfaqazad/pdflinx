"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileText,
  Type,
  CheckCircle,
  Download,
  Minimize2,
  GitMerge,
  Lock,
  Scissors,
  FileImage,
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
const DONE_LINKS = [
  { label: "Word to PDF",   href: "/word-to-pdf",   icon: <FileText   className="h-4 w-4 text-blue-500"    /> },
  { label: "PDF to Word",   href: "/pdf-to-word",   icon: <FileText   className="h-4 w-4 text-indigo-500"  /> },
  { label: "Compress PDF",  href: "/compress-pdf",  icon: <Minimize2  className="h-4 w-4 text-green-500"   /> },
  { label: "Merge PDF",     href: "/merge-pdf",     icon: <GitMerge   className="h-4 w-4 text-purple-500"  /> },
  { label: "Split PDF",     href: "/split-pdf",     icon: <Scissors   className="h-4 w-4 text-pink-500"    /> },
  { label: "Image to PDF",  href: "/image-to-pdf",  icon: <FileImage  className="h-4 w-4 text-amber-500"   /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ Text to PDF Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>PDF generated instantly in browser</li>
      <li>Your text is never uploaded</li>
      <li>Multi-page support automatically</li>
      <li>Clean A4 format with margins</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Text stays on your device",
  "✓ 100% free",
  "✓ Multi-page support",
  "✓ Works on all devices",
];

// ── Text Editor — goes into optionsSlot ────────────────────────────────────
function TextEditor({ text, onChange }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-800">📝 About this tool</p>
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li>✓ PDF generated instantly in your browser</li>
          <li>✓ Your text is never uploaded to any server</li>
          <li>✓ Long text flows across multiple pages</li>
          <li>✓ Clean A4 layout with proper margins</li>
          <li>✓ Helvetica font, 12pt, professional look</li>
        </ul>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700">
          Your Text
        </label>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your notes, resume, letter, article, assignment, or any plain text here..."
          className="w-full min-h-[260px] rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 outline-none resize-y focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          spellCheck="true"
        />
        <p className="text-xs text-slate-400 text-right">
          {text.length} characters
        </p>
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

export default function TextToPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [text, setText] = useState("");

  // Text-to-PDF uses a fake "file" to satisfy ToolFlow's file-based steps.
  // We override the upload step by treating the textarea as the input,
  // and trigger handleConvert directly from the Options step.

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // ── PDF GENERATION (client-side, no upload) ────────────────────────────
  const handleConvert = async () => {
    if (!text.trim()) return alert("Please enter some text first!");

    flow.startProcessing();
    startProgress();

    try {
      // Small delay so ProcessingStep renders visibly
      await new Promise((r) => setTimeout(r, 600));

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      const lines = doc.splitTextToSize(text, maxWidth);

      let y = 20;
      const lineHeight = 7;
      lines.forEach((line) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      doc.save("my-text-document.pdf");

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("PDF generation failed. Please try again.");
    }
  };
  // ── END PDF GENERATION ─────────────────────────────────────────────────

  // For TextToPdf, upload step is skipped — we jump straight to OPTIONS
  // by pre-populating a dummy file when text is ready, so the Convert
  // button in OptionsStep activates. We handle this by overriding
  // flow.step to OPTIONS when text has content, using a text-based trigger.

  // Instead of file upload, we use ToolPageLayout's optionsSlot as the
  // primary input, and trigger startProcessing via handleConvert directly.
  // The "Upload" step is replaced by showing the textarea immediately.

  // Since ToolPageLayout requires flow.step === OPTIONS to show the convert
  // button, we auto-advance the flow when the user clicks "Start":
  const handleTextReady = () => {
    if (!text.trim()) return alert("Please enter some text first!");
    // Inject a dummy blob as "file" so ToolFlow advances to OPTIONS
    const blob = new Blob([text], { type: "text/plain" });
    const dummyFile = new File([blob], "text-input.txt", { type: "text/plain" });
    flow.selectFiles([dummyFile]);
  };

  return (
    <>
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-text-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Text to PDF Online for Free",
            description: "Create PDF from plain text with custom formatting instantly.",
            url: "https://pdflinx.com/text-to-pdf",
            step: [
              { "@type": "HowToStep", name: "Paste Text", text: "Type or paste your text." },
              { "@type": "HowToStep", name: "Customize", text: "Choose font, size, alignment." },
              { "@type": "HowToStep", name: "Download PDF", text: "Click convert and download PDF." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-text-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Text to PDF", item: "https://pdflinx.com/text-to-pdf" },
            ],
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Text to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        // accept/multiple unused — upload step replaced by textarea
        accept=".txt,text/plain"
        multiple={false}
        convertLabel="Generate PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={() => {}} // PDF auto-downloads via jsPDF
        doneLinks={DONE_LINKS}

        // ── Upload step override ──
        // We render a custom uploadLanding so the user sees the textarea
        // immediately; clicking the CTA button calls handleTextReady()
        // which advances flow to OPTIONS, then Convert triggers handleConvert.
        uploadLanding={{
          // Pass a custom render override via content.customUploadSlot
          content: {
            eyebrow: "TEXT TO PDF CONVERTER",

            heroTitle: (
              <>
                Turn Any Text into a <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Clean PDF Instantly 📄
                </span>
              </>
            ),

            heroDescription:
              "Paste your notes, letter, resume, essay, or any text — get a clean, properly formatted PDF in seconds. Completely free, no signup, and your text never leaves your device.",

            bullets: [
              "PDF generated instantly in your browser — nothing uploaded",
              "Multi-page support — long text flows automatically",
              "Clean A4 layout, proper margins, professional look",
            ],

            // Custom textarea shown in place of the file dropzone
            customUploadNode: (
              <div className="space-y-3 w-full">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your notes, resume, letter, article, assignment, or any plain text here..."
                  className="w-full min-h-[220px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-slate-700 outline-none resize-y focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-300"
                  spellCheck="true"
                />
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-slate-400">
                    Notes, letters, resumes, essays — any plain text works
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {text.length} characters
                  </p>
                </div>
                <button
                  onClick={handleTextReady}
                  disabled={!text.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm ${
                    text.trim()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 hover:shadow-md active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Continue to Generate PDF
                </button>
                <p className="text-xs text-center text-slate-400">
                  ⚡ PDF generated in your browser · 🔒 Text never uploaded to any server
                </p>
              </div>
            ),

            privacyTitle: "Your text stays private",
            privacyText: "PDF is generated entirely in your browser using jsPDF. Your text is never sent to any server — completely private.",

            noticeTitle: "Text to PDF Info",
            noticeItems: [
              "PDF generated instantly in browser",
              "Text never uploaded to server",
              "Multi-page support automatically",
            ],

            breadcrumbItems: [
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Text to PDF" },
            ],

            trustPills: ["100% Free", "No Sign Up", "No Upload"],

            supports: [
              "Plain text input",
              "Multi-page PDF output",
            ],

            howToTitle: "How to Convert Text to PDF",

            howToSteps: [
              {
                n: "1",
                title: "Paste Your Text",
                desc: "Type or paste any plain text — notes, letters, resumes, essays, or any long-form content.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Generate PDF",
                desc: "PDFLinx formats your text automatically — proper margins, line spacing, A4 layout, multi-page support.",
                color: "bg-indigo-600",
              },
              {
                n: "3",
                title: "Download Instantly",
                desc: "Your PDF downloads immediately — ready to print, email, or share. No waiting, no processing time.",
                color: "bg-green-600",
              },
            ],

            visualImage: "/images/text-to-pdf-visual.png",
            visualAlt: "Text to PDF conversion illustration",

            whyTitle: "Why Choose PDFLinx Text to PDF?",

            whyItems: [
              {
                title: "Instant Browser-Side Generation",
                desc: "PDF is created entirely in your browser using jsPDF — your text never leaves your device. Instant download, zero wait time.",
                icon: CheckCircle,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                title: "Multi-Page Support",
                desc: "Long text automatically flows across multiple PDF pages — proper margins, consistent spacing, clean A4 layout every time.",
                icon: FileText,
                iconColor: "text-indigo-500",
                bgColor: "bg-indigo-50",
              },
              {
                title: "Professional Formatting",
                desc: "Clean Helvetica font, 12pt size, 20mm margins — output looks polished and ready to print or share professionally.",
                icon: Type,
                iconColor: "text-green-500",
                bgColor: "bg-green-50",
              },
              {
                title: "Works on Any Device",
                desc: "Convert text to PDF on iPhone, Android, Windows, or Mac — no software installation needed. Fully browser-based.",
                icon: Download,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
              },
            ],

            relatedTitle: "You Might Also Need",

            relatedTools: [
              { label: "Word to PDF",   href: "/word-to-pdf",   desc: "Convert DOCX to PDF",               icon: FileText,   iconColor: "text-blue-500",    bgColor: "bg-blue-50"    },
              { label: "PDF to Word",   href: "/pdf-to-word",   desc: "Convert PDF to editable DOCX",      icon: FileText,   iconColor: "text-indigo-500",  bgColor: "bg-indigo-50"  },
              { label: "Compress PDF",  href: "/compress-pdf",  desc: "Reduce PDF file size",              icon: Minimize2,  iconColor: "text-green-500",   bgColor: "bg-green-50"   },
              { label: "Merge PDF",     href: "/merge-pdf",     desc: "Combine multiple PDFs",             icon: GitMerge,   iconColor: "text-violet-500",  bgColor: "bg-violet-50"  },
              { label: "Split PDF",     href: "/split-pdf",     desc: "Extract specific pages",            icon: Scissors,   iconColor: "text-pink-500",    bgColor: "bg-pink-50"    },
              { label: "Image to PDF",  href: "/image-to-pdf",  desc: "Convert images to PDF",             icon: FileImage,  iconColor: "text-amber-500",   bgColor: "bg-amber-50"   },
            ],

            faqTitle: "Frequently Asked Questions",

            faqs: [
              { q: "Is the Text to PDF converter free?", a: "Yes. PDFLinx Text to PDF is completely free — no hidden charges, no subscription required." },
              { q: "Is my text uploaded to a server?", a: "No. The PDF is generated entirely in your browser using jsPDF. Your text never leaves your device." },
              { q: "Does it support long text with multiple pages?", a: "Yes. Long text automatically flows across multiple PDF pages with consistent margins and spacing." },
              { q: "Can I format the text before converting?", a: "Currently the tool supports plain text with clean automatic formatting — Helvetica font, 12pt, 20mm margins. Rich text formatting is not supported." },
              { q: "Will my PDF look professional?", a: "Yes. The tool formats text with clean margins, proper line spacing, and consistent font — output is polished and print-ready." },
              { q: "Can I use this on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required." },
              { q: "What types of text can I convert?", a: "Any plain text — notes, letters, resumes, essays, assignments, articles, code snippets, and more." },
              { q: "Is there a character or page limit?", a: "No hard limit. The tool handles short and very long text equally well, adding new pages as needed automatically." },
            ],

            ctaBadge: "✦ 100% Free",
            ctaTitle: "Convert Your Text to PDF Now",
            ctaDescription: "Fast. Private. Browser-based. No sign up required.",
            ctaSubtext: "No limits. No hidden charges. Text never uploaded.",
            ctaButton: "Paste Text & Generate PDF",

            seoSections: [
              {
                title: "Free Text to PDF Converter — Turn Plain Text into Clean PDFs Instantly",
                text: "Need a clean PDF from plain text? PDFLinx generates a properly formatted PDF from any text you paste — notes, resumes, letters, essays, or articles. PDF is created instantly in your browser using jsPDF — nothing is uploaded, nothing is stored. No software installation, no watermarks, no sign-up required.",
              },
              {
                title: "How Text to PDF Generation Works",
                text: "Paste your text into the editor and click Generate PDF. PDFLinx formats your text with proper A4 margins, 12pt Helvetica font, and consistent line spacing. Long text automatically flows across multiple pages. The PDF downloads immediately to your device.",
              },
              {
                title: "Common Use Cases for Text to PDF",
                text: "Students converting notes and assignments to PDF for submission. Job seekers turning plain-text resumes into professional PDFs. Office professionals creating quick letters and memos. Writers exporting articles and stories as shareable PDF documents.",
              },
              {
                title: "Privacy — Your Text Never Leaves Your Device",
                text: "Unlike other tools, PDFLinx Text to PDF generates the PDF entirely in your browser using the jsPDF library. Your text is never sent to any server, never stored, and never shared. Complete privacy by design.",
              },
            ],

            showPdfTypes: false,
          },
        }}

        optionsTitle="Text options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={
          <TextEditor text={text} onChange={setText} />
        }

        processingTitle="Generating Your PDF"
        processingDescription="Creating your PDF in the browser — this only takes a second."
        processingStages={["Formatting text", "Building pages", "Generating PDF"]}

        doneTitle="Your PDF is ready"
        doneDescription="Your text has been converted to a clean PDF and downloaded automatically."
        doneFileName="my-text-document.pdf"
        downloadLabel="Download PDF again"
        resetLabel="Convert another text"

        sidebarTitle="Text to PDF"
        sidebarIcon={<Type className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Convert any plain text into a clean, properly formatted PDF — free, instant, and private."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}
      />
    </>
  );
}




































// 'use client';

// import { useState } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { Download, FileText, Type, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function TextToPDF() {
//   const [text, setText] = useState('');

//   const generatePDF = () => {
//     if (!text.trim()) {
//       alert('Please enter some text first!');
//       return;
//     }

//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     const maxWidth = pageWidth - 2 * margin;

//     const lines = doc.splitTextToSize(text, maxWidth);

//     let y = 20;
//     const lineHeight = 7;

//     lines.forEach(line => {
//       if (y > 270) {
//         doc.addPage();
//         y = 20;
//       }
//       doc.text(line, margin, y);
//       y += lineHeight;
//     });

//     doc.save('my-text-document.pdf');
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-text-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Text to PDF Online for Free",
//             description: "Create PDF from plain text with custom formatting instantly.",
//             url: "https://pdflinx.com/text-to-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Paste Text", text: "Type or paste your text." },
//               { "@type": "HowToStep", name: "Customize", text: "Choose font, size, alignment." },
//               { "@type": "HowToStep", name: "Download PDF", text: "Click convert and download PDF." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-text-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Text to PDF", item: "https://pdflinx.com/text-to-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
// <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
//   <div className="max-w-4xl mx-auto">

//     {/* Header */}
//     <div className="text-center mb-8">
//       <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//         Text to PDF Converter Online Free
//         <br />
//         <span className="text-2xl md:text-3xl font-medium">
//           No Signup · No Watermark · Instant Download
//         </span>
//       </h1>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//         Convert plain text into a clean PDF online free — no signup, no watermark,
//         no software needed. Paste notes, letters, resumes, essays, or any long text
//         and download a properly formatted PDF in seconds.
//       </p>
//     </div>

//     {/* ── STEP STRIP ── */}
//     <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
//       {[
//         { n: "1", label: "Paste Text", sub: "Notes, letters, content" },
//         { n: "2", label: "Generate PDF", sub: "Formatted automatically" },
//         { n: "3", label: "Download File", sub: "Instant PDF export" },
//       ].map((s, i) => (
//         <div
//           key={i}
//           className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
//         >
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
//             {s.n}
//           </div>
//           <p className="text-xs font-semibold text-gray-700">{s.label}</p>
//           <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
//         </div>
//       ))}
//     </div>

//     {/* ── MAIN CARD ── */}
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       <div className="p-8 space-y-5">

//         {/* textarea header */}
//         <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
//           <Type className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
//           <div>
//             <p className="text-sm font-medium text-gray-700 leading-none">Plain text editor</p>
//             <p className="text-xs text-gray-400 mt-0.5">
//               Paste or type your content · Multi-page PDF supported automatically
//             </p>
//           </div>
//         </div>

//         {/* textarea */}
//         <div>
//           <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
//             <FileText className="w-5 h-5 text-blue-600" />
//             Enter your text
//           </label>

//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Paste your notes, resume, letter, article, assignment, or any plain text here..."
//             className="w-full min-h-[320px] p-6 text-base leading-relaxed border-2 border-gray-200 rounded-2xl focus:border-blue-500 outline-none resize-y bg-gray-50 transition-all duration-200"
//             spellCheck="true"
//           />

//           <div className="flex items-center justify-between mt-3">
//             <p className="text-xs text-gray-400">
//               Best for notes, letters, essays, resumes, and long-form text
//             </p>
//             <p className="text-sm text-gray-500 font-medium">
//               {text.length} characters
//             </p>
//           </div>
//         </div>

//         {/* action row */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
//           <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex-1">
//             <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-gray-700 leading-none">Auto page handling</p>
//               <p className="text-xs text-gray-400 mt-0.5">
//                 Long text automatically flows across multiple PDF pages
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={generatePDF}
//             disabled={!text.trim()}
//             className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
//               text.trim()
//                 ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md active:scale-[0.98]"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <Download className="w-4 h-4" />
//             Download as PDF
//           </button>
//         </div>

//         {/* hints */}
//         <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
//           <p>⚡ PDF is generated instantly in your browser</p>
//           <p>🔒 Your text is not uploaded — it stays on your device during generation</p>
//         </div>

//       </div>
//     </div>

//     {/* footer trust bar */}
//     <p className="text-center mt-6 text-gray-500 text-sm">
//       No account needed • No watermark • Instant PDF export • 100% free •
//       Multi-page support • Works on Windows, Mac, Android &amp; iOS
//     </p>
//   </div>
// </main>
//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             Text to PDF Converter Online Free - Turn Words into PDFs in a Snap
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Got some text that needs to look legit? Whether it's a quick letter, study notes, or that novel you've been writing on your phone – just paste it here and boom, you've got a polished PDF ready to print or share. All free, right in your browser, courtesy of PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Pro Every Time</h3>
//             <p className="text-gray-600 text-sm">
//               Clean layout, nice margins – perfect for resumes, letters, or anything you want to impress with.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Type className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Text Welcome</h3>
//             <p className="text-gray-600 text-sm">
//               Short note? Long story? Even code snippets – handles pages automatically, no sweat.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Happens right in your browser – nothing leaves your device, and it's all on the house.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Turn Text into PDF in 3 Super Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Paste It In</h4>
//               <p className="text-gray-600 text-sm">Dump whatever text you've got – the more the merrier.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">We Do the Magic</h4>
//               <p className="text-gray-600 text-sm">It gets neatly arranged with proper spacing and flow – looks sharp instantly.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Grab Your PDF</h4>
//               <p className="text-gray-600 text-sm">Hit download – ready to print, email, or stash away.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           People turn to PDF Linx every day to quickly whip up clean PDFs from text – it's fast, simple, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//   {/* Heading */}
//   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//     Text to PDF Converter Online (Free) – Convert Notes, Letters & Content into PDF by PDFLinx
//   </h2>

//   {/* Intro */}
//   <p className="text-base leading-7 mb-6">
//     Need to turn plain text into a clean, shareable PDF? Whether it’s notes, a resume, a letter, or copied content,
//     manually formatting documents can be frustrating. That’s why we built the{" "}
//     <span className="font-medium text-slate-900">PDFLinx Text to PDF Converter</span>.
//     Simply paste your text, click convert, and instantly download a polished PDF file.
//     No signup, no watermark, and works smoothly on mobile and desktop.
//   </p>

//   {/* What is */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     What Is a Text to PDF Converter?
//   </h3>
//   <p className="leading-7 mb-6">
//     A text to PDF converter transforms plain written content into a structured PDF document.
//     Instead of sharing raw text files or screenshots, you can convert your text into professional-looking PDFs that are
//     easier to print, share, and store securely across devices.
//   </p>

//   {/* Why use */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Why Convert Text to PDF?
//   </h3>
//   <ul className="space-y-2 mb-6 list-disc pl-6">
//     <li>Create clean and professional documents instantly</li>
//     <li>Share text content easily without formatting issues</li>
//     <li>Preserve document structure across devices and platforms</li>
//     <li>Perfect for resumes, assignments, letters, and reports</li>
//     <li>Easy printing and secure document storage</li>
//   </ul>

//   {/* Steps */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     How to Convert Text to PDF Online
//   </h3>
//   <ol className="space-y-2 mb-6 list-decimal pl-6">
//     <li>Paste or type your text into the editor</li>
//     <li>Click the “Download as PDF” button</li>
//     <li>The tool formats your text automatically</li>
//     <li>Download your ready-to-use PDF instantly</li>
//     <li>Use it for printing, sharing, or archiving</li>
//   </ol>

//   <p className="mb-6">
//     Unlimited conversions, instant downloads — completely free and simple to use.
//   </p>

//   {/* Features box */}
//   <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//     <h3 className="text-xl font-semibold text-slate-900 mb-4">
//       Features of PDFLinx Text to PDF Converter
//     </h3>
//     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//       <li>Free online text to PDF converter</li>
//       <li>Convert notes, letters, resumes, and content into PDF</li>
//       <li>Clean and professional PDF formatting</li>
//       <li>Instant PDF generation</li>
//       <li>Works on mobile, tablet, and desktop</li>
//       <li>No signup, no watermark, no installation</li>
//       <li>Handles short and long text content</li>
//       <li>Fast and user-friendly interface</li>
//     </ul>
//   </div>

//   {/* Audience */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Who Should Use This Tool?
//   </h3>
//   <ul className="space-y-2 mb-6 list-disc pl-6">
//     <li><strong>Students:</strong> Convert assignments, notes, and essays into PDFs</li>
//     <li><strong>Job seekers:</strong> Turn resumes and cover letters into professional PDF format</li>
//     <li><strong>Office professionals:</strong> Create reports, letters, and official documents</li>
//     <li><strong>Writers & Bloggers:</strong> Export written content as shareable PDFs</li>
//     <li><strong>Anyone:</strong> Who wants to convert plain text into a printable document</li>
//   </ul>

//   {/* Privacy */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Is PDFLinx Text to PDF Converter Safe?
//   </h3>
//   <p className="leading-7 mb-6">
//     Yes. You don’t need to create an account or upload sensitive files. Your text is used only to generate the PDF output.
//     The tool is designed to be fast, secure, and privacy-friendly.
//   </p>

//   {/* Closing */}
//   <h3 className="text-xl font-semibold text-slate-900 mb-3">
//     Convert Text to PDF Anytime, Anywhere
//   </h3>
//   <p className="leading-7">
//     PDFLinx Text to PDF Converter works smoothly on Windows, macOS, Linux, Android, and iOS.
//     Whether you’re using a phone, tablet, or computer, you can convert text into PDF instantly using your browser.
//   </p>
// </section>

// <section className="py-16 bg-gray-50">
//   <div className="max-w-4xl mx-auto px-4">
//     <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//       Frequently Asked Questions
//     </h2>

//     <div className="space-y-4">
//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Is the Text to PDF converter free?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           Yes — it’s completely free with unlimited conversions and downloads.
//         </p>
//       </details>

//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Can I format text before converting?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           Yes — you can edit or paste formatted content before converting it into PDF.
//         </p>
//       </details>

//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Does the tool support long text content?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           Yes — it supports both short and long text documents automatically.
//         </p>
//       </details>

//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Are my texts stored anywhere?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           No — your text is only used to generate the PDF file. Nothing is stored.
//         </p>
//       </details>

//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Can I use this tool on mobile?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           Yes — it works perfectly on mobile phones, tablets, and desktops.
//         </p>
//       </details>

//       <details className="bg-white rounded-lg shadow-sm p-5">
//         <summary className="font-semibold cursor-pointer">
//           Will my PDF look professional?
//         </summary>
//         <p className="mt-2 text-gray-600">
//           Yes — the tool automatically formats text to create clean, readable, and printable PDFs.
//         </p>
//       </details>
//     </div>
//   </div>
// </section>

    
//     <RelatedToolsSection currentPage="text-to-pdf" />

//     </>
//   );
// }

