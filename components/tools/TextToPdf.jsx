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
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-indigo-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-pink-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <FileImage className="h-4 w-4 text-amber-500" /> },
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
        {/* <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your notes, resume, letter, article, assignment, or any plain text here..."
          className="w-full min-h-[260px] rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 outline-none resize-y focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          spellCheck="true"
        /> */}
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your notes, resume, letter, article, assignment, or any plain text here..."
          className="w-full h-[400px] rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 outline-none resize-y focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
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
function TextPreviewCard({ text }) {

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    // <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#f3f4f6] shadow-sm transition hover:shadow-md">

      {/* Preview Area */}
      <div className="relative h-[420px] overflow-hidden bg-[#f3f4f6] p-8">

        {/* White PDF Paper */}
        <div className="relative mx-auto h-full max-w-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

          {/* PDF Badge */}
          <div className="absolute right-4 top-4 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
            PDF Preview
          </div>

          {/* Text Content */}
          <div className="space-y-4 text-[15px] leading-8 text-slate-700">
            {text
              .split("\n")
              .slice(0, 14)
              .map((line, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "pr-24 text-lg font-semibold text-slate-900"
                      : ""
                  }
                >
                  {line || <span className="opacity-0">empty</span>}
                </p>
              ))}
          </div>

          {/* Bottom Fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>


      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="truncate text-sm font-semibold text-slate-800">
          text-input.txt
        </p>

        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>Text Preview</span>
          {/* <span>{text.length} chars</span> */}
          <span>
            {wordCount} words • {text.length} chars
          </span>
        </div>
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
        onDownload={() => { }} // PDF auto-downloads via jsPDF
        doneLinks={DONE_LINKS}
        customFilePreview={
          <TextPreviewCard text={text} />
        }

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
                  className="w-full h-[300px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-slate-700 outline-none resize-y focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-300"
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
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm ${text.trim()
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
              { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert DOCX to PDF", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
              { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX", icon: FileText, iconColor: "text-indigo-500", bgColor: "bg-indigo-50" },
              { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", icon: Minimize2, iconColor: "text-green-500", bgColor: "bg-green-50" },
              { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", icon: GitMerge, iconColor: "text-violet-500", bgColor: "bg-violet-50" },
              { label: "Split PDF", href: "/split-pdf", desc: "Extract specific pages", icon: Scissors, iconColor: "text-pink-500", bgColor: "bg-pink-50" },
              { label: "Image to PDF", href: "/image-to-pdf", desc: "Convert images to PDF", icon: FileImage, iconColor: "text-amber-500", bgColor: "bg-amber-50" },
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


