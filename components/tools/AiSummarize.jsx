"use client";

import { useState } from "react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import {
  FileText,
  FileSearch,
  Languages,
  MessageSquare,
  Minimize2,
  GitMerge,
  Shield,
  FileOutput,
} from "lucide-react";

// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
//   { label: "Translate PDF", href: "/translate-pdf", icon: <Languages className="h-4 w-4 text-blue-500" /> },
{ label: "Text to PDF", href: "/text-to-pdf", icon: <FileOutput className="h-4 w-4 text-yellow-500" /> },

  { label: "Chat with PDF", href: "/ai-chat", icon: <MessageSquare className="h-4 w-4 text-purple-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "PDF to Text", href: "/pdf-to-text", icon: <FileOutput className="h-4 w-4 text-yellow-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <FileSearch className="h-4 w-4 text-pink-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ AI-Powered Summarizer
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Summarizes up to 10 pages at once</li>
      <li>Output in clear bullet points</li>
      <li>Works on text-based PDFs</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ AI-powered summary",
  "✓ 100% free",
  "✓ Private & secure",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">🤖 About AI Summarizer</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Extracts key points automatically</li>
      <li>✓ Works best on text-based PDFs</li>
      <li>✓ Scanned PDFs may not work well</li>
      <li>✓ First 10 pages are summarized</li>
      <li>✓ Processing may take 15–30 seconds</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

export default function AiSummarize({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [summary, setSummary] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select a PDF file first!");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    formData.append("pdf", flow.files[0]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/summarize`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        let msg = "Summarization failed";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      setSummary(data.summary);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdflinx-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-summarize"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Summarize a PDF Online for Free",
              url: "https://pdflinx.com/pdf-summarizer",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload your PDF file — research paper, report, book, or any document.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Summarize PDF",
                  text: "Press Summarize PDF and wait 15–30 seconds for the AI to process.",
                },
                {
                  "@type": "HowToStep",
                  name: "Read or Download Summary",
                  text: "Read the AI-generated bullet point summary online or download it as a text file.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="breadcrumb-schema-summarize"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://pdflinx.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "AI PDF Summarizer",
                  item: "https://pdflinx.com/pdf-summarizer",
                },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-summarize"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is the AI PDF summarizer free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, completely free with no hidden charges, no daily limits, and no account required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does AI PDF summarization work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our AI reads your PDF text and uses a language model to extract the key points, main arguments, and important conclusions — presented as clear bullet points.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does the PDF summarizer work on scanned PDFs?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Scanned PDFs without selectable text may not summarize well. Use our OCR PDF tool first to make them text-based, then summarize.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does PDF summarization take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Usually 15–30 seconds depending on PDF length and current server load.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How many pages does the summarizer process?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The first 10 pages of your PDF are summarized for optimal speed and accuracy.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        // Title + Tagline
        title={seo?.h1 || "AI PDF Summarizer — Free & Online"}
        tagline="No Signup · No Watermark · AI-Powered"
        // File input
        accept=".pdf"
        multiple={false}
        // Buttons
        convertLabel="Summarize PDF"
        // Flow state
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        // Options Step
        optionsTitle="Summarizer options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        // Processing Step
        processingTitle="Summarizing PDF"
        processingDescription="AI is reading and summarizing your PDF — please wait 15–30 seconds."
        processingStages={["Uploading PDF", "Extracting text", "AI summarizing"]}
        // Done Step
        doneTitle="Summary Ready!"
        doneDescription={
          summary ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {summary}
            </div>
          ) : "Your PDF has been summarized successfully."
        }
        doneFileName="pdflinx-summary.txt"
        downloadLabel="Download Summary"
        resetLabel="Summarize another PDF"
        // Sidebar
        sidebarTitle="AI PDF Summarizer"
        sidebarIcon={<FileSearch className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Summarize any PDF instantly with AI — key points extracted automatically."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF only"
        uploadInfo={
          <>
            <p>⏱️ Summarization takes 15–30 seconds — don&apos;t close this tab</p>
            <p className="mt-1">🔢 Single PDF only · First 10 pages summarized</p>
          </>
        }

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "AI PDF SUMMARIZER",

            breadcrumbCurrent: "AI PDF Summarizer",

            heroBadge: "✦ 100% Free · No Signup · AI-Powered",

            heroTitle: (
              <>
                AI PDF Summarizer —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Summarize Any PDF Free Online
                </em>
              </>
            ),
            heroDescription:
              "Upload any PDF and get an instant AI-generated summary in clear bullet points. Perfect for research papers, reports, books, legal documents, and long PDFs. No signup, no watermark, 100% free. Works on Windows, Mac, Android, and iPhone.",
            pills: ["AI-powered", "Bullet point summary", "No signup", "Free forever"],

            trustPills: ["100% Free", "No Sign Up", "AI Powered"],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF only",

            noticeTitle: "AI Summarizer",
            noticeItems: [
              "Works on text-based PDFs",
              "First 10 pages summarized",
              "Output in bullet points",
            ],

            rating: "4.8/5",
            ratingText: "Trusted by 30,000+ users monthly",

            howToEyebrow: "How It Works",
            howToTitle: "How to Summarize a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, summarize, read — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select any text-based PDF from your device — research papers, reports, books, contracts, study guides. Drag and drop supported on all devices including mobile.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Summarize PDF",
                desc: "Hit Summarize PDF — our AI reads your document and extracts the key points, main arguments, and important conclusions automatically. No manual input needed.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Read or Download Summary",
                desc: "Get a clean, structured bullet-point summary instantly on screen. Download it as a .txt file to save, share, or reference anytime.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free AI PDF Summarizer Online",

            seoBadge: "PDF Summarizer Guide",
            seoTitle: "Complete Guide to AI PDF Summarization",
            seoDescription:
              "Everything you need to know about summarizing PDFs with AI — free, online, instant bullet-point summaries, no signup required.",

            seoSections: [
              {
                title:
                  "Free AI PDF Summarizer — Summarize Any PDF Online, No Signup, No Watermark",
                text: "Reading long PDFs takes hours. PDFLinx AI PDF Summarizer extracts the most important points from any PDF document in seconds — completely free, no account needed. Whether it is a 50-page research paper, a legal contract, a business report, or a textbook chapter, PDFLinx AI reads it and delivers a clean bullet-point summary instantly. The fastest and most accurate free alternative to ChatPDF, Scholarcy, TLDR This, and other AI PDF summarizer tools — with no daily limits and no login required.",
              },
              {
                title: "Why Use an AI PDF Summarizer?",
                text: "The average professional reads 4–5 hours of documents every day. AI PDF summarization cuts that time dramatically by extracting only the information that matters — key arguments, main findings, action items, and important conclusions. Instead of reading a 30-page report cover to cover, a summarizer gives you the core insights in 30 seconds. This is especially valuable for students reviewing academic papers, lawyers scanning legal documents, researchers doing literature reviews, and business professionals staying on top of reports and proposals.",
              },
              {
                title: "How Does AI PDF Summarization Work?",
                text: "PDFLinx uses a large language model (LLM) trained on millions of documents to understand the structure and meaning of your PDF. When you upload a PDF, the AI first extracts the raw text content from the document. It then identifies the most important sentences, key arguments, supporting evidence, and main conclusions. Finally, it organizes these into a structured bullet-point summary that captures the essence of the document. The entire process runs in 15–30 seconds depending on the length and complexity of the PDF.",
              },
              {
                title:
                  "How to Summarize a PDF Without Losing Key Information",
                text: "The most common concern with AI summarization is whether important details get lost. PDFLinx AI is designed to prioritize high-information sentences — topic sentences, key findings, defined terms, numerical data, and conclusions. The first 10 pages are processed for optimal speed and accuracy. For very long documents, focus the summary on the most important section by splitting the PDF first using our free Split PDF tool, then summarizing the relevant pages individually.",
              },
              {
                title: "What Types of PDFs Work Best with the AI Summarizer?",
                text: "Text-based PDFs give the best summarization results — these include research papers, journal articles, academic theses, business reports, white papers, legal contracts, meeting minutes, study guides, news articles, and e-books. Scanned PDFs that are image-only do not contain selectable text, so the AI cannot read them directly. For scanned documents, use our free OCR PDF tool first to convert them into searchable text-based PDFs, then summarize.",
              },
              {
                title: "Best Use Cases for PDF Summarizer",
                text: "✓ Students & Researchers: Quickly understand research papers, journal articles, and textbooks without reading every page.\n✓ Lawyers & Paralegals: Extract key clauses and important points from legal contracts and case documents.\n✓ Business Professionals: Summarize quarterly reports, business proposals, meeting transcripts, and strategic documents.\n✓ Journalists & Writers: Get the gist of press releases, policy papers, and government reports in seconds.\n✓ Educators & Teachers: Review curriculum documents, study guides, and academic papers efficiently.\n✓ Healthcare Workers: Summarize medical research, clinical guidelines, and patient case notes.\n✓ Freelancers & Consultants: Quickly review client briefs, project specifications, and industry reports.",
              },
              {
                title:
                  "Summarize PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx AI PDF Summarizer works perfectly in the browser on any device — iPhone, Android, iPad, Windows laptop, Mac, or Linux desktop. No app download, no software installation, no account creation required. Just open pdflinx.com on your mobile browser, upload your PDF, and get your summary in seconds. The fastest way to summarize a PDF on your phone for free.",
              },
              {
                title:
                  "PDFLinx vs ChatPDF vs Scholarcy vs TLDR This — Best Free PDF Summarizer Comparison",
                text: "ChatPDF limits free users to a small number of documents per day and requires an account. Scholarcy is primarily designed for academic papers and charges a monthly fee for full access. TLDR This focuses on web articles rather than uploaded PDF files. PDFLinx offers unlimited free PDF summarization with no daily limits, no watermark, no account, and no subscription — directly in your browser. For anyone looking for the best free ChatPDF alternative or Scholarcy alternative for summarizing PDFs, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your uploaded PDF files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We do not store, share, read, or access your documents at any point. PDFLinx is built with a privacy-first approach — your files and their contents are completely private from upload to download. No human ever views your documents. Perfect for summarizing confidential business reports, legal documents, and personal files.",
              },
            ],

            faqs: [
              {
                q: "Is the PDFLinx AI PDF summarizer free?",
                a: "Yes, completely free. No hidden charges, no premium plans, no daily limits, and no account required. Summarize as many PDFs as you need.",
              },
              {
                q: "Do I need to sign up to summarize a PDF?",
                a: "No account or signup required. Upload your PDF and get a summary instantly — no email, no registration, no password needed.",
              },
              {
                q: "What types of PDFs work best?",
                a: "Text-based PDFs give the best results — research papers, reports, contracts, books, articles, and study guides. Scanned image-only PDFs do not have selectable text; use our free OCR PDF tool first to convert them before summarizing.",
              },
              {
                q: "How long does PDF summarization take?",
                a: "Usually 15–30 seconds depending on the PDF length and current server load. Keep the tab open while the AI processes your document.",
              },
              {
                q: "How many pages does the AI summarize?",
                a: "The first 10 pages of your PDF are summarized. For longer documents, split the PDF using our Split PDF tool and summarize the most important section.",
              },
              {
                q: "Does PDFLinx add any watermark to the summary?",
                a: "No watermarks, ever. The summary is 100% clean text — no PDFLinx branding added to your downloaded summary file.",
              },
              {
                q: "Can I use the PDF summarizer on iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation required.",
              },
              {
                q: "Can I summarize a scanned PDF?",
                a: "Scanned PDFs that are image-only cannot be summarized directly because there is no selectable text. Use our free OCR PDF tool first to extract the text, then summarize the resulting text-based PDF.",
              },
              {
                q: "Is my PDF kept private?",
                a: "Yes. Your PDF is processed securely over HTTPS and automatically deleted from our servers after 1 hour. We do not store, share, or view your documents.",
              },
              {
                q: "Can I download the AI summary?",
                a: "Yes. After summarization, click Download Summary to save the bullet-point summary as a .txt file to your device.",
              },
              {
                q: "Is PDFLinx better than ChatPDF or Scholarcy for free PDF summarization?",
                a: "Yes. PDFLinx offers unlimited free PDF summarization with no daily limits, no account required, and no subscription. ChatPDF and Scholarcy restrict free usage and require login for full access.",
              },
              {
                q: "What is the maximum file size for PDF summarization?",
                a: "Up to 10 MB per PDF file for best performance. For larger files, try compressing the PDF first using our free Compress PDF tool.",
              },
              {
                q: "Can I summarize multiple PDFs at once?",
                a: "Currently one PDF is summarized at a time for best accuracy. Upload and summarize each PDF individually.",
              },
              {
                q: "What language does the AI summarize in?",
                a: "The AI summarizes in the language of the document. English PDFs get English summaries. Other languages may work depending on the AI model's language support.",
              },
            ],

            ctaTitle: (
              <>
                Summarize your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who use PDFLinx to read smarter, work faster, and understand documents in seconds.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>
  );
}

































// "use client";

// import { useState } from "react";
// import Script from "next/script";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import {
//   FileText,
//   FileSearch,
//   Languages,
//   MessageSquare,
//   Minimize2,
//   GitMerge,
//   Shield,
//   FileOutput,
// } from "lucide-react";

// // ── Config ───────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Translate PDF", href: "/translate-pdf", icon: <Languages className="h-4 w-4 text-blue-500" /> },
//   { label: "Chat with PDF", href: "/chat-with-pdf", icon: <MessageSquare className="h-4 w-4 text-purple-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-orange-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
//   { label: "PDF to Text", href: "/pdf-to-text", icon: <FileOutput className="h-4 w-4 text-yellow-500" /> },
//   { label: "OCR PDF", href: "/ocr-pdf", icon: <FileSearch className="h-4 w-4 text-pink-500" /> },
// ];

// const SIDEBAR_NOTICE = (
//   <>
//     <p className="text-sm font-semibold text-blue-800">
//       ℹ️ AI-Powered Summarizer
//     </p>
//     <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
//       <li>Summarizes up to 10 pages at once</li>
//       <li>Output in clear bullet points</li>
//       <li>Works on text-based PDFs</li>
//     </ul>
//   </>
// );

// const SIDEBAR_FEATURES = [
//   "✓ No account",
//   "✓ No watermark",
//   "✓ AI-powered summary",
//   "✓ 100% free",
//   "✓ Private & secure",
//   "✓ Works on all devices",
// ];

// const OPTIONS_SLOT = (
//   <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
//     <p className="font-semibold text-slate-800">🤖 About AI Summarizer</p>
//     <ul className="space-y-1.5 text-xs text-slate-600">
//       <li>✓ Extracts key points automatically</li>
//       <li>✓ Works best on text-based PDFs</li>
//       <li>✓ Scanned PDFs may not work well</li>
//       <li>✓ First 10 pages are summarized</li>
//       <li>✓ Processing may take 15–30 seconds</li>
//     </ul>
//   </div>
// );
// // ───────────────────────────────────────────

// export default function AiSummarize({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } =
//     useProgressBar();

//   const [summary, setSummary] = useState(null);

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   const handleConvert = async () => {
//     if (!flow.files.length) return alert("Please select a PDF file first!");

//     flow.startProcessing();
//     startProgress();

//     const formData = new FormData();
//     formData.append("pdf", flow.files[0]);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/summarize`,
//         { method: "POST", body: formData }
//       );

//       if (!res.ok) {
//         let msg = "Summarization failed";
//         try {
//           const maybeJson = await res.json();
//           msg = maybeJson?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const data = await res.json();
//       setSummary(data.summary);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       flow.handleError(err.message || "Something went wrong, please try again.");
//     }
//   };

//   // Summary copy + download as TXT
//   const handleDownload = () => {
//     if (!summary) return;
//     const blob = new Blob([summary], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "pdflinx-summary.txt";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       {/* ── SEO SCHEMAS ── */}
//       <Script
//         id="howto-schema-summarize"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Summarize a PDF Online for Free",
//             url: "https://pdflinx.com/pdf-summarizer",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Upload your PDF file." },
//               { "@type": "HowToStep", name: "Click Summarize", text: "Press Summarize PDF and wait 15–30 seconds." },
//               { "@type": "HowToStep", name: "Read or Download", text: "Read the AI summary or download it as a text file." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />
//       <Script
//         id="breadcrumb-schema-summarize"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF Summarizer", item: "https://pdflinx.com/pdf-summarizer" },
//             ],
//           }, null, 2),
//         }}
//       />
//       <Script
//         id="faq-schema-summarize"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "Is the PDF summarizer free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no hidden charges." } },
//               { "@type": "Question", name: "How does AI PDF summarization work?", acceptedAnswer: { "@type": "Answer", text: "Our AI reads your PDF text and extracts the key points into clear bullet points automatically." } },
//               { "@type": "Question", name: "Does it work on scanned PDFs?", acceptedAnswer: { "@type": "Answer", text: "Scanned PDFs without selectable text may not summarize well. Use our OCR PDF tool first to make them text-based." } },
//               { "@type": "Question", name: "How long does summarization take?", acceptedAnswer: { "@type": "Answer", text: "Usually 15–30 seconds depending on PDF length." } },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ── TOOL UI ── */}
//       <ToolPageLayout
//         title={seo?.h1 || "AI PDF Summarizer — Free & Online"}
//         tagline="No Signup · No Watermark · AI-Powered"
//         accept=".pdf"
//         multiple={false}
//         convertLabel="Summarize PDF"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DONE_LINKS}
//         sidebarLinks={DONE_LINKS}
//         optionsTitle="Summarizer options"
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsSlot={OPTIONS_SLOT}
//         optionSectionLabel=""
//         processingTitle="Summarizing PDF"
//         processingDescription="AI is reading and summarizing your PDF — please wait 15–30 seconds."
//         processingStages={["Uploading PDF", "Extracting text", "AI summarizing"]}
//         doneTitle="Summary Ready!"
//         doneDescription={
//           summary ? (
//             <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
//               {summary}
//             </div>
//           ) : "Your PDF has been summarized successfully."
//         }
//         doneFileName="pdflinx-summary.txt"
//         downloadLabel="Download Summary"
//         resetLabel="Summarize another PDF"
//         sidebarTitle="AI PDF Summarizer"
//         sidebarIcon={<FileSearch className="h-5 w-5 text-blue-500" />}
//         sidebarDescription="AI se apni PDF summarize karo — key points automatically extract ho jayenge."
//         sidebarNotice={SIDEBAR_NOTICE}
//         sidebarFeatures={SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF only"
//         uploadInfo={
//           <>
//             <p>⏱️ Summarization takes 15–30 seconds — don&apos;t close this tab</p>
//             <p className="mt-1">🔢 Single PDF only · First 10 pages summarized</p>
//           </>
//         }

//         uploadLanding={{
//           content: {
//             relatedTools: DONE_LINKS,
//             eyebrow: "AI PDF SUMMARIZER",
//             breadcrumbCurrent: "AI PDF Summarizer",
//             heroBadge: "✦ 100% Free · No Signup · AI-Powered",
//             heroTitle: (
//               <>
//                 AI PDF Summarizer —{" "}
//                 <em className="font-bold text-[#e8420a] sm:italic">
//                   Summarize Any PDF Instantly
//                 </em>
//               </>
//             ),
//             heroDescription:
//               "Upload any PDF and get an instant AI-generated summary in bullet points. Perfect for research papers, reports, books, and long documents. No signup, no watermark, 100% free.",
//             pills: ["AI-powered", "Bullet point summary", "No signup", "Free forever"],
//             trustPills: ["100% Free", "No Sign Up", "AI Powered"],
//             uploadTitle: "Drop your PDF here",
//             uploadSubtitle: "or click to browse — PDF only",
//             noticeTitle: "AI Summarizer",
//             noticeItems: [
//               "Works on text-based PDFs",
//               "First 10 pages summarized",
//               "Output in bullet points",
//             ],
//             rating: "4.8/5",
//             ratingText: "Trusted by thousands of users",
//             howToEyebrow: "How It Works",
//             howToTitle: "How to Summarize a PDF — 3 Simple Steps",
//             howToSubtitle: "Upload, summarize, read — done in under 30 seconds.",
//             howToSteps: [
//               { n: "1", title: "Upload Your PDF", desc: "Select any text-based PDF from your device. Research papers, reports, books — all work great.", color: "bg-blue-600" },
//               { n: "2", title: "Click Summarize", desc: "Our AI reads your PDF and extracts the most important points automatically.", color: "bg-purple-600" },
//               { n: "3", title: "Read or Download", desc: "Get a clean bullet-point summary instantly. Download it as a text file if needed.", color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why Use PDFLinx AI PDF Summarizer?",
//             seoBadge: "PDF Summarizer Guide",
//             seoTitle: "Complete Guide to AI PDF Summarization",
//             seoDescription: "Everything you need to know about summarizing PDFs with AI — free, online, no signup required.",
//             seoSections: [
//               { title: "Free AI PDF Summarizer — Summarize Any PDF Online Instantly", text: "Reading long PDFs takes hours. PDFLinx AI PDF Summarizer extracts the key points from any PDF document in seconds — completely free, no signup needed. Perfect for students, researchers, professionals, and anyone who needs to quickly understand a long document without reading every page." },
//               { title: "How Does AI PDF Summarization Work?", text: "Our AI reads the text content of your PDF and uses a language model to identify the most important sentences, key arguments, and main conclusions. The result is a clean, structured bullet-point summary that captures the essence of the document — saving you hours of reading time." },
//               { title: "Best Use Cases for PDF Summarizer", text: "✓ Students: Quickly understand research papers and textbooks\n✓ Researchers: Get the gist of academic papers before reading in full\n✓ Professionals: Summarize reports, contracts, and business documents\n✓ Lawyers: Extract key points from legal documents\n✓ Journalists: Quickly review press releases and reports" },
//             ],
//             faqs: [
//               { q: "Is the AI PDF summarizer free?", a: "Yes, completely free with no hidden charges or daily limits." },
//               { q: "What types of PDFs work best?", a: "Text-based PDFs work best. Scanned image-only PDFs may not summarize well — use our OCR PDF tool first." },
//               { q: "How long does summarization take?", a: "Usually 15–30 seconds depending on PDF length and server load." },
//               { q: "Can I summarize a 100-page PDF?", a: "Currently the first 10 pages are summarized for best speed and accuracy." },
//               { q: "Is my PDF private?", a: "Yes. Your PDF is processed securely and automatically deleted after 1 hour." },
//             ],
//             ctaTitle: (<>Summarize your PDF now —<br />free, private, no sign‑up.</>),
//             ctaDescription: "Join thousands who use PDFLinx to read smarter and faster.",
//             ctaButton: "Choose PDF File",
//           },
//         }}
//       />
//     </>
//   );
// }