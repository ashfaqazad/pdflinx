"use client";

import { useState, useRef, useEffect } from "react";
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
  Send,
} from "lucide-react";

// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "AI Summarize", href: "/ai-summarize", icon: <FileSearch className="h-4 w-4 text-blue-500" /> },
  { label: "Translate PDF", href: "/translate-pdf", icon: <Languages className="h-4 w-4 text-blue-500" /> },
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
      ℹ️ AI Chat with PDF
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Upload PDF once, ask unlimited questions</li>
      <li>First 3 pages used as context</li>
      <li>Works on text-based PDFs only</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ AI-powered chat",
  "✓ 100% free",
  "✓ Unlimited questions",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">🤖 About Chat with PDF</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ PDF uploaded once, context stored</li>
      <li>✓ Ask unlimited questions</li>
      <li>✓ First 3 pages used as context</li>
      <li>✓ Works on text-based PDFs only</li>
      <li>✓ Each answer takes 10–20 seconds</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

// Chat bubble component
function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <span className="text-xs font-semibold text-blue-600 block mb-1">
            🤖 AI
          </span>
        )}
        {text}
      </div>
    </div>
  );
}

export default function AiChat({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [pdfContext, setPdfContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/extract`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        let msg = "Failed to process PDF";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      setPdfContext(data.text);
      setMessages([
        {
          role: "ai",
          text: "✅ PDF loaded! Ask me anything about this document.",
        },
      ]);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || isAsking) return;

    const userMsg = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsAsking(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMsg, context: pdfContext }),
        }
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "Sorry, I could not answer that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error getting answer. Please try again." },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const CHAT_UI = (
    <div className="mt-4 flex flex-col gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.text} />
        ))}
        {isAsking && (
          <div className="flex justify-start mb-3">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your PDF..."
          rows={2}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAsk}
          disabled={isAsking || !question.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-chat"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Chat with a PDF Online for Free",
              url: "https://pdflinx.com/chat-with-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload your PDF file — research paper, contract, report, or any text-based document.",
                },
                {
                  "@type": "HowToStep",
                  name: "Start Chat",
                  text: "Click Start Chat and wait 5–10 seconds for the AI to read and process your PDF.",
                },
                {
                  "@type": "HowToStep",
                  name: "Ask Questions",
                  text: "Type any question about your PDF content and get instant AI-generated answers.",
                },
              ],
              totalTime: "PT20S",
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
        id="breadcrumb-schema-chat"
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
                  name: "Chat with PDF",
                  item: "https://pdflinx.com/chat-with-pdf",
                },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-chat"
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
                  name: "Is Chat with PDF free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, completely free with no hidden charges, no daily limits, and no account required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How many questions can I ask per session?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Unlimited questions per session. Upload your PDF once and ask as many questions as you need.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Chat with PDF work on scanned PDFs?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Text-based PDFs work best. For scanned image-only PDFs, use our free OCR PDF tool first to extract the text, then chat with the result.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does each answer take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Usually 10–20 seconds per answer depending on the complexity of the question and server load.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How many pages of the PDF does the AI read?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The first 3 pages are used as context for answering questions. For best results, ensure your key content is in the first 3 pages.",
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
        title={seo?.h1 || "Chat with PDF — Free AI PDF Chat Online"}
        tagline="No Signup · Unlimited Questions · AI-Powered"
        // File input
        accept=".pdf"
        multiple={false}
        // Buttons
        convertLabel="Start Chat"
        // Flow state
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={null}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        // Options Step
        optionsTitle="Chat options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        // Processing Step
        processingTitle="Loading PDF"
        processingDescription="AI is reading your PDF — please wait a moment."
        processingStages={["Uploading PDF", "Extracting text", "Ready to chat"]}
        // Done Step
        doneTitle="PDF Loaded — Start Chatting!"
        doneDescription={CHAT_UI}
        doneFileName={null}
        downloadLabel={null}
        resetLabel="Chat with another PDF"
        // Sidebar
        sidebarTitle="Chat with PDF"
        sidebarIcon={<MessageSquare className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Upload any PDF and ask questions — AI answers instantly from your document."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF only"
        uploadInfo={
          <>
            <p>⏱️ PDF loads in 5–10 seconds — then ask unlimited questions</p>
            <p className="mt-1">🔢 Single PDF only · First 3 pages used as context</p>
          </>
        }

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "CHAT WITH PDF",

            breadcrumbCurrent: "Chat with PDF",

            heroBadge: "✦ 100% Free · No Signup · AI-Powered",

            heroTitle: (
              <>
                Chat with PDF —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Ask Your PDF Anything, Free Online
                </em>
              </>
            ),
            heroDescription:
              "Upload any PDF and have a real conversation with it using AI. Ask questions, extract information, get summaries — instantly, in plain English. No signup, no watermark, 100% free. Works on Windows, Mac, Android, and iPhone.",
            pills: ["Unlimited questions", "AI-powered", "No signup", "Free forever"],

            trustPills: ["100% Free", "No Sign Up", "AI Powered"],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF only",

            noticeTitle: "Chat with PDF",
            noticeItems: [
              "Upload once, ask unlimited questions",
              "First 3 pages used as context",
              "Text-based PDFs only",
            ],

            rating: "4.9/5",
            ratingText: "Loved by 50,000+ students & professionals",

            howToEyebrow: "How It Works",
            howToTitle: "How to Chat with a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, start chat, ask anything — get instant AI answers.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select any text-based PDF from your device — research papers, legal contracts, business reports, textbooks, study guides. Drag and drop supported on all devices including mobile.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Start Chat",
                desc: "Hit Start Chat — our AI reads your PDF in 5–10 seconds and gets ready to answer any question about the document content. No manual setup needed.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Ask Any Question",
                desc: "Type your question in plain English and get an instant AI-generated answer based on your PDF. Ask as many questions as you need — no limits per session.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free AI Chat with PDF Tool Online",

            seoBadge: "Chat with PDF Guide",
            seoTitle: "Complete Guide to AI Chat with PDF",
            seoDescription:
              "Everything you need to know about chatting with PDFs using AI — free, online, unlimited questions, no signup required.",

            seoSections: [
              {
                title:
                  "Free AI Chat with PDF — Ask Your PDF Anything Online, No Signup, No Watermark",
                text: "Tired of reading entire PDFs just to find one answer? PDFLinx Chat with PDF lets you have a real conversation with any PDF document using AI — completely free, no account needed. Upload your PDF, ask questions in plain English, and get instant answers extracted directly from your document. Whether it is a 50-page research paper, a legal contract, a business report, or a textbook chapter, the AI reads it and answers your questions in seconds. The best free alternative to ChatPDF, Adobe Acrobat AI Assistant, and AskYourPDF — with no daily limits and no login required.",
              },
              {
                title: "Why Chat with a PDF Instead of Reading It?",
                text: "The average professional document runs 20–50 pages. Most people only need specific information from a fraction of those pages. Traditional PDF reading is slow, inefficient, and frustrating when you just need one fact, one figure, or one clause. AI Chat with PDF solves this by letting you ask exactly what you need and getting a precise answer in seconds — without skimming, scrolling, or losing your place. It is the fastest way to extract information from long documents, understand complex content, and work smarter with PDFs every day.",
              },
              {
                title: "How Does AI Chat with PDF Work?",
                text: "PDFLinx uses a large language model (LLM) to read and understand your PDF content. When you upload a PDF, the AI extracts the raw text from the document and stores it as context. When you ask a question, the AI searches through that context, identifies the most relevant passages, and formulates a clear, accurate answer in plain English. The entire upload and processing step takes 5–10 seconds. After that, each question gets an answer in 10–20 seconds. You can ask unlimited follow-up questions in the same session without re-uploading the PDF.",
              },
              {
                title:
                  "How to Get the Best Answers from AI Chat with PDF",
                text: "For best results, use text-based PDFs — documents with selectable text that was created digitally. PDFs converted from Word, Excel, or HTML, as well as native digital PDFs, work perfectly. Ask specific, clear questions rather than vague ones — for example, 'What is the refund policy in section 3?' gives a better answer than 'What are the policies?'. If your key content is in the first 3 pages, the AI will find it most reliably. For longer documents, consider splitting the PDF and chatting with the relevant section individually using our free Split PDF tool.",
              },
              {
                title: "What Types of PDFs Work Best with AI Chat?",
                text: "Text-based PDFs give the most accurate chat results — these include research papers, journal articles, academic theses, legal contracts, business proposals, meeting minutes, technical manuals, user guides, study guides, policy documents, government reports, and e-books. Scanned PDFs that are image-only do not have selectable text, so the AI cannot read them directly. For scanned documents, use our free OCR PDF tool first to convert them into searchable text-based PDFs, then start chatting.",
              },
              {
                title: "Best Use Cases for Chat with PDF",
                text: "✓ Students & Researchers: Ask questions about research papers and textbooks — get instant answers without reading every page.\n✓ Lawyers & Paralegals: Query legal contracts, case documents, and regulatory filings to find specific clauses and obligations.\n✓ Business Professionals: Extract key information from quarterly reports, business proposals, and market research documents.\n✓ HR & Recruiters: Search through job descriptions, employee handbooks, and policy documents quickly.\n✓ Healthcare Workers: Query medical research papers, clinical guidelines, and patient documents.\n✓ Educators: Ask questions about curriculum documents and academic resources efficiently.\n✓ Freelancers & Consultants: Quickly understand client briefs, project specifications, and industry reports without full read-throughs.",
              },
              {
                title:
                  "Chat with PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx Chat with PDF works perfectly in the browser on any device — iPhone, Android, iPad, Windows laptop, Mac, or Linux desktop. No app download, no software installation, no account creation required. Just open pdflinx.com on your mobile browser, upload your PDF, and start chatting in seconds. It is the easiest and fastest way to chat with a PDF on your phone for free — no ChatPDF app download needed.",
              },
              {
                title:
                  "PDFLinx vs ChatPDF vs Adobe AI vs AskYourPDF — Best Free PDF Chat Comparison",
                text: "ChatPDF limits free users to a small number of PDFs per day and restricts the number of questions per document. Adobe Acrobat AI Assistant requires an expensive monthly subscription. AskYourPDF limits free usage and requires account creation for full access. PDFLinx Chat with PDF offers unlimited questions per session, no daily limits, no watermark, no account, and no subscription — entirely free in your browser. For anyone looking for the best free ChatPDF alternative or free Adobe AI alternative for chatting with PDFs, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your uploaded PDF files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We do not store, share, read, or access your documents at any point beyond the AI processing step. PDFLinx is built with privacy-first principles — your files and their contents are completely private from upload to the end of your chat session. No human ever views your documents. Perfect for chatting with confidential legal contracts, business reports, and personal documents.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Chat with PDF free?",
                a: "Yes, completely free. No hidden charges, no premium plans, no daily limits, and no account required. Chat with as many PDFs as you need.",
              },
              {
                q: "Do I need to sign up to chat with a PDF?",
                a: "No account or signup required. Upload your PDF and start chatting instantly — no email, no registration, no password needed.",
              },
              {
                q: "How many questions can I ask per session?",
                a: "Unlimited questions per session. Upload your PDF once and ask as many questions as you need without re-uploading.",
              },
              {
                q: "Does Chat with PDF work on scanned PDFs?",
                a: "Text-based PDFs work best. Scanned image-only PDFs do not have selectable text, so the AI cannot read them directly. Use our free OCR PDF tool first to convert them into text-based PDFs, then chat.",
              },
              {
                q: "How long does each answer take?",
                a: "Usually 10–20 seconds per answer depending on question complexity and server load.",
              },
              {
                q: "How many pages of the PDF does the AI read?",
                a: "The first 3 pages are used as context for answering questions. For best results, make sure your most important content is in the first 3 pages, or split the PDF to the relevant section using our Split PDF tool.",
              },
              {
                q: "Can I use Chat with PDF on my iPhone or Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation required.",
              },
              {
                q: "Can I ask follow-up questions?",
                a: "Yes. You can ask unlimited follow-up questions in the same chat session without re-uploading the PDF. The AI maintains the document context throughout the conversation.",
              },
              {
                q: "Is my PDF kept private?",
                a: "Yes. Your PDF is processed securely over HTTPS and automatically deleted from our servers after 1 hour. We do not store, share, or view your documents.",
              },
              {
                q: "What languages does the AI chat support?",
                a: "Questions can be asked in English for best results. The AI reads the PDF language automatically and answers based on the document content.",
              },
              {
                q: "Is PDFLinx better than ChatPDF for free PDF chatting?",
                a: "Yes. PDFLinx offers unlimited questions per session with no daily PDF limits and no account required. ChatPDF restricts free usage and requires login for full access.",
              },
              {
                q: "What is the maximum file size for Chat with PDF?",
                a: "Up to 10 MB per PDF for best performance. For larger files, try compressing the PDF first using our free Compress PDF tool.",
              },
              {
                q: "Can I chat with multiple PDFs at once?",
                a: "Currently one PDF is loaded per session. Start a new session to chat with a different PDF.",
              },
              {
                q: "What if the AI gives a wrong answer?",
                a: "AI answers are based entirely on the PDF text content. If an answer seems off, try rephrasing your question more specifically — for example, mention the section name or page number where the information should be.",
              },
            ],

            ctaTitle: (
              <>
                Chat with your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who use PDFLinx to get instant answers from their PDFs — students, lawyers, researchers, and professionals.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>
  );
}




















// "use client";

// import { useState, useRef, useEffect } from "react";
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
//   Send,
// } from "lucide-react";

// const DONE_LINKS = [
//   { label: "PDF Summarizer", href: "/pdf-summarizer", icon: <FileSearch className="h-4 w-4 text-blue-500" /> },
//   { label: "Translate PDF", href: "/translate-pdf", icon: <Languages className="h-4 w-4 text-blue-500" /> },
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
//       ℹ️ AI Chat with PDF
//     </p>
//     <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
//       <li>Upload PDF once, ask unlimited questions</li>
//       <li>First 3 pages used as context</li>
//       <li>Works on text-based PDFs only</li>
//     </ul>
//   </>
// );

// const SIDEBAR_FEATURES = [
//   "✓ No account",
//   "✓ No watermark",
//   "✓ AI-powered chat",
//   "✓ 100% free",
//   "✓ Unlimited questions",
//   "✓ Works on all devices",
// ];

// const OPTIONS_SLOT = (
//   <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
//     <p className="font-semibold text-slate-800">🤖 About Chat with PDF</p>
//     <ul className="space-y-1.5 text-xs text-slate-600">
//       <li>✓ PDF uploaded once, context stored</li>
//       <li>✓ Ask unlimited questions</li>
//       <li>✓ First 3 pages used as context</li>
//       <li>✓ Works on text-based PDFs only</li>
//       <li>✓ Each answer takes 10–20 seconds</li>
//     </ul>
//   </div>
// );

// // Chat bubble component
// function ChatBubble({ role, text }) {
//   const isUser = role === "user";
//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
//       <div
//         className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
//           isUser
//             ? "bg-blue-600 text-white rounded-br-sm"
//             : "bg-slate-100 text-slate-800 rounded-bl-sm"
//         }`}
//       >
//         {!isUser && (
//           <span className="text-xs font-semibold text-blue-600 block mb-1">
//             🤖 AI
//           </span>
//         )}
//         {text}
//       </div>
//     </div>
//   );
// }

// export default function AiChat({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } =
//     useProgressBar();

//   // PDF context stored in frontend
//   const [pdfContext, setPdfContext] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [isAsking, setIsAsking] = useState(false);
//   const chatEndRef = useRef(null);

//   // Auto scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   // Step 1: Upload PDF → extract text → store in frontend
//   const handleConvert = async () => {
//     if (!flow.files.length) return alert("Please select a PDF file first!");

//     flow.startProcessing();
//     startProgress();

//     const formData = new FormData();
//     formData.append("pdf", flow.files[0]);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/extract`,
//         { method: "POST", body: formData }
//       );

//       if (!res.ok) {
//         let msg = "Failed to process PDF";
//         try {
//           const maybeJson = await res.json();
//           msg = maybeJson?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const data = await res.json();
//       setPdfContext(data.text);
//       setMessages([
//         {
//           role: "ai",
//           text: "✅ PDF loaded! Ask me anything about this document.",
//         },
//       ]);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       flow.handleError(err.message || "Something went wrong, please try again.");
//     }
//   };

//   // Step 2: Ask question → send (question + stored context) → show answer
//   const handleAsk = async () => {
//     if (!question.trim() || isAsking) return;

//     const userMsg = question.trim();
//     setQuestion("");
//     setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
//     setIsAsking(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/chat`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ question: userMsg, context: pdfContext }),
//         }
//       );

//       const data = await res.json();
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", text: data.answer || "Sorry, I could not answer that." },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", text: "❌ Error getting answer. Please try again." },
//       ]);
//     } finally {
//       setIsAsking(false);
//     }
//   };

//   // Enter key send
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleAsk();
//     }
//   };

//   // Chat UI shown in Done step
//   const CHAT_UI = (
//     <div className="mt-4 flex flex-col gap-3">
//       {/* Messages */}
//       <div className="rounded-xl border border-slate-200 bg-white p-4 h-64 overflow-y-auto">
//         {messages.map((msg, i) => (
//           <ChatBubble key={i} role={msg.role} text={msg.text} />
//         ))}
//         {isAsking && (
//           <div className="flex justify-start mb-3">
//             <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
//               🤖 Thinking...
//             </div>
//           </div>
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex gap-2">
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Ask anything about your PDF..."
//           rows={2}
//           className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleAsk}
//           disabled={isAsking || !question.trim()}
//           className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Send className="h-4 w-4" />
//         </button>
//       </div>
//       <p className="text-xs text-slate-400 text-center">
//         Press Enter to send · Shift+Enter for new line
//       </p>
//     </div>
//   );

//   return (
//     <>
//       <Script
//         id="howto-schema-chat"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Chat with a PDF Online for Free",
//             url: "https://pdflinx.com/chat-with-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Upload your PDF file." },
//               { "@type": "HowToStep", name: "Start Chat", text: "Click Start Chat to process your PDF." },
//               { "@type": "HowToStep", name: "Ask Questions", text: "Ask any question about your PDF and get instant AI answers." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />
//       <Script
//         id="breadcrumb-schema-chat"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Chat with PDF", item: "https://pdflinx.com/chat-with-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />
//       <Script
//         id="faq-schema-chat"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "Is Chat with PDF free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no hidden charges." } },
//               { "@type": "Question", name: "How many questions can I ask?", acceptedAnswer: { "@type": "Answer", text: "Unlimited questions per session." } },
//               { "@type": "Question", name: "Does it work on scanned PDFs?", acceptedAnswer: { "@type": "Answer", text: "Text-based PDFs work best. Use OCR PDF tool first for scanned PDFs." } },
//               { "@type": "Question", name: "How long does each answer take?", acceptedAnswer: { "@type": "Answer", text: "Usually 10–20 seconds per answer." } },
//             ],
//           }, null, 2),
//         }}
//       />

//       <ToolPageLayout
//         title={seo?.h1 || "Chat with PDF — Free AI PDF Chat Online"}
//         tagline="No Signup · Unlimited Questions · AI-Powered"
//         accept=".pdf"
//         multiple={false}
//         convertLabel="Start Chat"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={null}
//         doneLinks={DONE_LINKS}
//         sidebarLinks={DONE_LINKS}
//         optionsTitle="Chat options"
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsSlot={OPTIONS_SLOT}
//         optionSectionLabel=""
//         processingTitle="Loading PDF"
//         processingDescription="AI is reading your PDF — please wait a moment."
//         processingStages={["Uploading PDF", "Extracting text", "Ready to chat"]}
//         doneTitle="PDF Loaded — Start Chatting!"
//         doneDescription={CHAT_UI}
//         doneFileName={null}
//         downloadLabel={null}
//         resetLabel="Chat with another PDF"
//         sidebarTitle="Chat with PDF"
//         sidebarIcon={<MessageSquare className="h-5 w-5 text-blue-500" />}
//         sidebarDescription="Apni PDF se seedha baat karo — AI aapke sawaalon ka jawab dega."
//         sidebarNotice={SIDEBAR_NOTICE}
//         sidebarFeatures={SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF only"
//         uploadInfo={
//           <>
//             <p>⏱️ PDF loads in 5–10 seconds — then ask unlimited questions</p>
//             <p className="mt-1">🔢 Single PDF only · First 3 pages used as context</p>
//           </>
//         }
//         uploadLanding={{
//           content: {
//             relatedTools: DONE_LINKS,
//             eyebrow: "CHAT WITH PDF",
//             breadcrumbCurrent: "Chat with PDF",
//             heroBadge: "✦ 100% Free · No Signup · AI-Powered",
//             heroTitle: (
//               <>
//                 Chat with PDF —{" "}
//                 <em className="font-bold text-[#e8420a] sm:italic">
//                   Ask Your PDF Anything, Free
//                 </em>
//               </>
//             ),
//             heroDescription:
//               "Upload any PDF and chat with it using AI. Ask questions, get summaries, find information — instantly. No signup, no watermark, 100% free.",
//             pills: ["Unlimited questions", "AI-powered", "No signup", "Free forever"],
//             trustPills: ["100% Free", "No Sign Up", "AI Powered"],
//             uploadTitle: "Drop your PDF here",
//             uploadSubtitle: "or click to browse — PDF only",
//             noticeTitle: "Chat with PDF",
//             noticeItems: [
//               "Upload once, ask unlimited questions",
//               "First 3 pages used as context",
//               "Text-based PDFs only",
//             ],
//             rating: "4.9/5",
//             ratingText: "Loved by students & professionals",
//             howToEyebrow: "How It Works",
//             howToTitle: "How to Chat with a PDF — 3 Simple Steps",
//             howToSubtitle: "Upload, start chat, ask anything — get instant AI answers.",
//             howToSteps: [
//               { n: "1", title: "Upload Your PDF", desc: "Select any text-based PDF — research papers, contracts, reports, books.", color: "bg-blue-600" },
//               { n: "2", title: "Start Chat", desc: "Click Start Chat — AI reads your PDF and gets ready to answer questions.", color: "bg-purple-600" },
//               { n: "3", title: "Ask Anything", desc: "Type your questions and get instant AI answers based on your PDF content.", color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why Use PDFLinx Chat with PDF?",
//             seoBadge: "Chat with PDF Guide",
//             seoTitle: "Complete Guide to AI Chat with PDF",
//             seoDescription: "Chat with any PDF online for free — ask questions, get answers, no signup required.",
//             seoSections: [
//               { title: "Free AI Chat with PDF — Ask Your PDF Anything Online", text: "PDFLinx Chat with PDF lets you have a conversation with any PDF document using AI. Upload your PDF, ask questions in plain English, and get instant answers — completely free, no signup needed. Perfect for students, researchers, lawyers, and professionals who need to quickly extract information from long documents." },
//               { title: "Best Use Cases for Chat with PDF", text: "✓ Students: Ask questions about textbooks and research papers\n✓ Lawyers: Query legal documents and contracts\n✓ Researchers: Extract specific data from academic papers\n✓ Professionals: Quickly find information in reports\n✓ Anyone: Understand complex documents without reading every page" },
//             ],
//             faqs: [
//               { q: "Is Chat with PDF free?", a: "Yes, completely free with no hidden charges or daily limits." },
//               { q: "How many questions can I ask?", a: "Unlimited questions per session — ask as many as you need." },
//               { q: "Does it work on scanned PDFs?", a: "Text-based PDFs work best. Use our OCR PDF tool first for scanned PDFs." },
//               { q: "How accurate are the answers?", a: "Answers are based on the PDF content — accuracy depends on PDF text quality." },
//               { q: "Is my PDF private?", a: "Yes. Your PDF is processed securely and automatically deleted after 1 hour." },
//             ],
//             ctaTitle: (<>Chat with your PDF now —<br />free, private, no sign‑up.</>),
//             ctaDescription: "Join thousands who use PDFLinx to get instant answers from their PDFs.",
//             ctaButton: "Choose PDF File",
//           },
//         }}
//       />
//     </>
//   );
// }