"use client";

import { useState } from "react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import {
  FileText,
  FileSearch,
  MessageSquare,
  Minimize2,
  GitMerge,
  Shield,
  FileOutput,
  CheckSquare,
} from "lucide-react";

// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "AI PDF Summarizer", href: "/pdf-summarizer", icon: <FileSearch className="h-4 w-4 text-blue-500" /> },
  { label: "Chat with PDF", href: "/ai-chat", icon: <MessageSquare className="h-4 w-4 text-purple-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Text to PDF", href: "/text-to-pdf", icon: <FileOutput className="h-4 w-4 text-yellow-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <FileSearch className="h-4 w-4 text-pink-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">ℹ️ AI-Powered Proofreader</p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Fixes grammar & spelling errors</li>
      <li>Works on text-based PDFs only</li>
      <li>First 3 pages are proofread</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ AI-powered proofreading",
  "✓ 100% free",
  "✓ Private & secure",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">✅ About AI Proofreader</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Fixes grammar mistakes automatically</li>
      <li>✓ Corrects spelling errors</li>
      <li>✓ Fixes punctuation issues</li>
      <li>✓ Works best on text-based PDFs</li>
      <li>✓ First 3 pages are proofread</li>
      <li>✓ Processing may take 20–40 seconds</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

export default function AiProofread({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [corrected, setCorrected] = useState(null);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/proofread`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        let msg = "Proofreading failed";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      setCorrected(data.corrected);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };

  const handleDownload = () => {
    if (!corrected) return;
    const blob = new Blob([corrected], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdflinx-proofread.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-proofread"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Proofread a PDF Online for Free",
            url: "https://pdflinx.com/ai-proofread-pdf",
            step: [
              {
                "@type": "HowToStep",
                name: "Upload PDF",
                text: "Upload your PDF file — essay, report, letter, or any text-based document.",
              },
              {
                "@type": "HowToStep",
                name: "Click Proofread PDF",
                text: "Press Proofread PDF and wait 20–40 seconds for the AI to fix errors.",
              },
              {
                "@type": "HowToStep",
                name: "Download Corrected Text",
                text: "Read the AI-corrected text online or download it as a .txt file.",
              },
            ],
            totalTime: "PT40S",
            estimatedCost: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "USD",
            },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-proofread"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "AI PDF Proofreader", item: "https://pdflinx.com/ai-proofread-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="software-schema-proofread"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AI PDF Proofreader — PDFLinx",
            url: "https://pdflinx.com/ai-proofread-pdf",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            screenshot: "https://pdflinx.com/og-image.png",
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1400" },
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-proofread"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the AI PDF proofreader free?",
                acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no hidden charges, no daily limits, and no account required." },
              },
              {
                "@type": "Question",
                name: "What errors does the AI proofreader fix?",
                acceptedAnswer: { "@type": "Answer", text: "The AI fixes grammar mistakes, spelling errors, and punctuation issues while keeping the original meaning intact." },
              },
              {
                "@type": "Question",
                name: "Does it work on scanned PDFs?",
                acceptedAnswer: { "@type": "Answer", text: "Scanned PDFs without selectable text cannot be proofread directly. Use our OCR PDF tool first to make them text-based." },
              },
              {
                "@type": "Question",
                name: "How many pages does the AI proofread?",
                acceptedAnswer: { "@type": "Answer", text: "The first 3 pages of your PDF are proofread for optimal speed and accuracy." },
              },
              {
                "@type": "Question",
                name: "Will the AI change my writing style?",
                acceptedAnswer: { "@type": "Answer", text: "No. The AI only fixes errors — grammar, spelling, and punctuation. It does not rewrite sentences or change your writing style." },
              },
            ],
          }, null, 2),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "AI PDF Proofreader — Fix Grammar & Spelling Free"}
        tagline="No Signup · No Watermark · AI-Powered"
        accept=".pdf"
        multiple={false}
        convertLabel="Proofread PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        optionsTitle="Proofreader options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        processingTitle="Proofreading PDF"
        processingDescription="AI is checking and fixing grammar, spelling, and punctuation — please wait 20–40 seconds."
        processingStages={["Uploading PDF", "Extracting text", "AI proofreading"]}
        doneTitle="Proofreading Complete!"
        doneDescription={
          corrected ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {corrected}
            </div>
          ) : "Your PDF has been proofread successfully."
        }
        doneFileName="pdflinx-proofread.txt"
        downloadLabel="Download Corrected Text"
        resetLabel="Proofread another PDF"
        sidebarTitle="AI PDF Proofreader"
        sidebarIcon={<CheckSquare className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Fix grammar, spelling, and punctuation in any PDF instantly with AI — free and online."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF only"
        uploadInfo={
          <>
            <p>⏱️ Proofreading takes 20–40 seconds — don&apos;t close this tab</p>
            <p className="mt-1">🔢 Single PDF only · First 3 pages proofread</p>
          </>
        }
        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "AI PDF PROOFREADER",
            breadcrumbCurrent: "AI PDF Proofreader",
            heroBadge: "✦ 100% Free · No Signup · AI-Powered",
            heroTitle: (
              <>
                AI PDF Proofreader —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Fix Grammar & Spelling in PDF Free
                </em>
              </>
            ),
            heroDescription:
              "Upload any PDF and get instant AI-powered grammar, spelling, and punctuation corrections. Perfect for essays, reports, cover letters, business documents, and academic papers. No signup, no watermark, 100% free. Works on Windows, Mac, Android, and iPhone.",
            pills: ["AI-powered", "Grammar fix", "Spelling check", "No signup", "Free forever"],
            trustPills: ["100% Free", "No Sign Up", "AI Powered"],
            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF only",
            noticeTitle: "AI Proofreader",
            noticeItems: [
              "Fixes grammar & spelling",
              "First 3 pages proofread",
              "Original meaning preserved",
            ],
            rating: "4.8/5",
            ratingText: "Trusted by 30,000+ users monthly",
            howToEyebrow: "How It Works",
            howToTitle: "How to Proofread a PDF — 3 Simple Steps",
            howToSubtitle: "No learning curve. Upload, proofread, download — done in under 40 seconds.",
            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select any text-based PDF from your device — essays, reports, cover letters, business emails, academic papers, or any document with text. Drag and drop supported on all devices including mobile.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Proofread PDF",
                desc: "Hit Proofread PDF — our AI scans every sentence for grammar mistakes, spelling errors, and punctuation issues. It fixes them automatically while keeping your original meaning and writing style intact.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Corrected Text",
                desc: "Get your AI-corrected text instantly on screen. Download it as a .txt file to copy into your document, email, or anywhere you need clean, error-free writing.",
                color: "bg-emerald-600",
              },
            ],
            whyTitle: "Why PDFLinx is the Best Free AI PDF Proofreader Online",
            seoBadge: "PDF Proofreader Guide",
            seoTitle: "Complete Guide to AI PDF Proofreading",
            seoDescription:
              "Everything you need to know about proofreading PDFs with AI — free, online, instant grammar and spelling fixes, no signup required.",
            seoSections: [
              {
                title: "Free AI PDF Proofreader — Fix Grammar & Spelling in Any PDF Online",
                text: "Grammar and spelling mistakes make documents look unprofessional. PDFLinx AI PDF Proofreader automatically fixes grammar errors, spelling mistakes, and punctuation issues in any PDF — completely free, no account needed. Whether it is a student essay, business report, cover letter, research paper, or official document, PDFLinx AI corrects it instantly. The fastest and most accurate free alternative to Grammarly PDF, ProWritingAid, and other grammar checker tools — with no daily limits and no login required.",
              },
              {
                title: "Why Use an AI PDF Proofreader?",
                text: "Errors in documents cost opportunities. A resume with spelling mistakes gets rejected. A business proposal with grammar errors loses credibility. An academic paper with punctuation mistakes loses marks. AI proofreading catches errors that human eyes miss — especially after reading the same document multiple times. PDFLinx AI PDF Proofreader is especially valuable for students submitting essays and assignments, professionals writing reports and proposals, non-native English speakers polishing their writing, and anyone who needs a quick, reliable second check before submitting or sending a document.",
              },
              {
                title: "What Errors Does the AI PDF Proofreader Fix?",
                text: "PDFLinx AI PDF Proofreader fixes three main categories of errors. Grammar errors include subject-verb agreement mistakes, incorrect tense usage, wrong word forms, and sentence structure problems. Spelling errors include typos, commonly confused words, and misspelled technical terms. Punctuation errors include missing commas, incorrect apostrophes, wrong use of semicolons, and missing full stops. The AI corrects all these automatically while preserving your original writing style and meaning.",
              },
              {
                title: "AI Proofreader vs Manual Proofreading — Which is Better?",
                text: "Manual proofreading by a human editor is thorough but expensive and slow — professional proofreaders charge per word and take hours or days. AI proofreading is instant, free, and available 24/7. For most documents — student essays, business emails, reports, cover letters — AI proofreading catches the majority of errors in seconds. For critical documents like published books or legal contracts, AI proofreading is an excellent first pass before final human review. PDFLinx gives you the speed and accessibility of AI at zero cost.",
              },
              {
                title: "What Types of PDFs Work Best with the AI Proofreader?",
                text: "Text-based PDFs give the best proofreading results — these include essays, research papers, business reports, cover letters, emails saved as PDF, meeting minutes, project proposals, and academic theses. Scanned PDFs that are image-only do not contain selectable text, so the AI cannot read them directly. For scanned documents, use our free OCR PDF tool first to convert them into text-based PDFs, then proofread.",
              },
              {
                title: "Proofread PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx AI PDF Proofreader works perfectly in the browser on any device — iPhone, Android, iPad, Windows laptop, Mac, or Linux desktop. No app download, no software installation, no account creation required. Just open pdflinx.com on your mobile browser, upload your PDF, and get corrected text in seconds. The fastest way to proofread a PDF on your phone for free.",
              },
              {
                title: "PDFLinx vs Grammarly vs ProWritingAid — Best Free PDF Grammar Checker",
                text: "Grammarly requires an account and charges a monthly subscription for advanced grammar checks. It also does not accept PDF uploads directly — you have to copy and paste text manually. ProWritingAid similarly requires a subscription for full access and does not support direct PDF upload. PDFLinx accepts PDF files directly, fixes grammar and spelling automatically, requires no account, and is completely free — making it the best free Grammarly alternative for proofreading PDFs online.",
              },
              {
                title: "Privacy and File Security",
                text: "Your uploaded PDF files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We do not store, share, read, or access your documents at any point. PDFLinx is built with a privacy-first approach — your files and their contents are completely private from upload to download. No human ever views your documents. Perfect for proofreading confidential business reports, personal cover letters, and academic papers.",
              },
            ],
            faqs: [
              {
                q: "Is the PDFLinx AI PDF proofreader free?",
                a: "Yes, completely free. No hidden charges, no premium plans, no daily limits, and no account required. Proofread as many PDFs as you need.",
              },
              {
                q: "Do I need to sign up to proofread a PDF?",
                a: "No account or signup required. Upload your PDF and get corrected text instantly — no email, no registration, no password needed.",
              },
              {
                q: "What errors does the AI fix?",
                a: "Grammar mistakes, spelling errors, and punctuation issues — all fixed automatically while preserving your original meaning and writing style.",
              },
              {
                q: "Will the AI change my writing style?",
                a: "No. The AI only fixes errors. It does not rewrite sentences, change your vocabulary, or alter your writing style in any way.",
              },
              {
                q: "How many pages does the AI proofread?",
                a: "The first 3 pages of your PDF are proofread. For longer documents, split the PDF using our Split PDF tool and proofread each section individually.",
              },
              {
                q: "How long does proofreading take?",
                a: "Usually 20–40 seconds depending on the PDF length and current server load. Keep the tab open while the AI processes your document.",
              },
              {
                q: "Does the proofreader work on scanned PDFs?",
                a: "Scanned PDFs that are image-only cannot be proofread directly because there is no selectable text. Use our free OCR PDF tool first, then proofread.",
              },
              {
                q: "Can I download the corrected text?",
                a: "Yes. After proofreading, click Download Corrected Text to save the output as a .txt file to your device.",
              },
              {
                q: "Is my PDF kept private?",
                a: "Yes. Your PDF is processed securely over HTTPS and automatically deleted from our servers after 1 hour. We do not store or view your documents.",
              },
              {
                q: "Is PDFLinx better than Grammarly for proofreading PDFs?",
                a: "Yes for PDF files. PDFLinx accepts PDF uploads directly with no account required and no word limits — all completely free. Grammarly requires login, does not support PDF upload, and charges for advanced features.",
              },
              {
                q: "Does the AI proofread non-English PDFs?",
                a: "The AI works best on English PDFs. Other languages may partially work depending on the AI model's language support.",
              },
              {
                q: "Can I proofread multiple PDFs at once?",
                a: "Currently one PDF is proofread at a time for best accuracy. Upload and proofread each PDF individually.",
              },
            ],
            ctaTitle: (
              <>
                Proofread your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who use PDFLinx to fix grammar, spelling, and punctuation in their documents instantly.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>
  );
}