"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = {
  convert: { label: "Convert PDF", color: "#E8380D", dot: "#E8380D" },
  compress: { label: "Compress", color: "#1A7F5A", dot: "#1A7F5A" },
  mobile: { label: "Mobile", color: "#2563EB", dot: "#2563EB" },
  students: { label: "Students", color: "#7C3AED", dot: "#7C3AED" },
  tips: { label: "Tips & Tricks", color: "#D97706", dot: "#D97706" },
  "ai-tools": { label: "AI Tools", color: "#0EA5E9", dot: "#0EA5E9" },  // ADD THIS
};

const THUMB_STYLES = {
  convert: { bg: "linear-gradient(135deg,#E8380D 0%,#c4300b 100%)" },
  compress: { bg: "linear-gradient(135deg,#1A7F5A 0%,#145e43 100%)" },
  mobile: { bg: "linear-gradient(135deg,#2563EB 0%,#1d4fc4 100%)" },
  students: { bg: "linear-gradient(135deg,#7C3AED 0%,#5b27b8 100%)" },
  tips: { bg: "linear-gradient(135deg,#D97706 0%,#b86006 100%)" },
  "ai-tools": { bg: "linear-gradient(135deg,#0EA5E9 0%,#0284c7 100%)" },  // ADD THIS
};

// ─── Articles Data ────────────────────────────────────────────────────────────
const articles = [
  // ── CONVERT ──
  {
    cat: "convert", icon: "📝", featured: true,
    title: "PDF to Word Conversion Accuracy Tips — Get Better Results Every Time",
    excerpt: "Most people upload a PDF and hope for the best — then spend 20 minutes fixing garbled text, broken tables, and shifted images. The real issue isn't the tool, it's the preparation. This guide covers exactly what to check before converting, when to enable OCR, how to handle scanned vs digital PDFs differently, and what to review in the output so you waste as little cleanup time as possible.",
    date: "Aug 24, 2025", read: "5 min", slug: "pdf-to-word-accuracy-tips",
  },
  {
    cat: "convert", icon: "🔧",
    title: "PDF to Word Formatting Messed Up? Here's How to Fix It",
    excerpt: "Fonts changing, tables breaking, images shifting — these are not random bugs, they happen for specific and predictable reasons. PDF to Word conversion fails most often when the source PDF was created from a scanned document, used non-standard fonts, or had complex multi-column layouts. This guide walks through each formatting failure type, explains exactly what causes it, and gives you the fastest fix for each — so you spend less time manually correcting output and more time actually using the document.",
    date: "Feb 22, 2026", read: "4 min", slug: "pdf-to-word-formatting-messed-up",
  },
  {
    cat: "convert", icon: "🔍",
    title: "How to Edit Scanned PDF in Word (The Easy Way with OCR)",
    excerpt: "Scanned PDFs are just images — no way to copy text, highlight, or edit anything. The document looks like a page of text but every character is actually pixels, not selectable content. OCR (Optical Character Recognition) is the only way to extract real editable text from a scanned document. This guide explains how OCR works, which scan quality settings produce the best results, how to run OCR on a scanned PDF and export it to Word, and what to check in the output because OCR is accurate but not perfect.",
    date: "Feb 23, 2026", read: "5 min", slug: "how-to-edit-scanned-pdf-in-word",
  },
  {
    cat: "convert", icon: "📄",
    title: "Convert PDF Resume to Editable Word Without Losing Layout",
    excerpt: "Job portals demand Word resumes, but converting PDF versions often ruins columns, bullets, photos, and spacing. Resume PDFs are among the hardest documents to convert cleanly because they rely heavily on precise positioning, custom fonts, and multi-column layouts — all of which behave differently in Word. This guide explains why resume conversion breaks, what layout elements are most at risk, how to run the conversion in a way that preserves as much structure as possible, and what to fix manually when the output needs adjustment before submission.",
    date: "Feb 24, 2026", read: "3 min", slug: "convert-pdf-resume-to-editable-word",
  },
  {
    cat: "convert", icon: "⚡",
    title: "Word to PDF Best Practices — Convert Documents the Right Way",
    excerpt: "Converting Word to PDF seems simple until the fonts change, tables shift, or images land in the wrong place. Before you hit convert, there are eight things worth checking — from saving as DOCX instead of DOC, to embedding fonts, to verifying margins in Print Preview. This guide walks through every best practice so your PDF looks exactly like your Word document, every time.",
    date: "Aug 23, 2025", read: "5 min", slug: "word-to-pdf-best-practices",
  },
  {
    cat: "convert", icon: "🖼️",
    title: "Image to PDF Quality Guide — Get Sharp, Clean Results Every Time",
    excerpt: "Blurry PDFs, pixelated scans, and low-resolution photos are almost always caused by one thing: the source image quality before conversion. This guide explains DPI and resolution targets for different use cases, how to scan or photograph documents correctly for best results, whether to use JPG or PNG before converting, and what to check in the final PDF to catch quality issues before you share it.",
    date: "Aug 22, 2025", read: "4 min", slug: "image-to-pdf-quality-guide",
  },
  {
    cat: "convert", icon: "📊",
    title: "When to Merge PDF Files — Smart Situations Where Combining Makes Sense",
    excerpt: "Merging PDFs isn't always the right move — but when it is, it saves a lot of friction. This guide covers the specific situations where combining PDFs genuinely helps: scanned multi-page documents, job applications requiring one file, project deliverables, legal documents with exhibits, and monthly reports compiled from multiple sources. It also covers when NOT to merge, and what to do instead.",
    date: "Aug 21, 2025", read: "4 min", slug: "when-to-merge-pdf-files",
  },
  {
    cat: "convert", icon: "✂️",
    title: "How to Split PDF for Sharing — Send Only What People Need",
    excerpt: "Sending a 60-page document when someone needs pages 12 to 18 is a waste of everyone's time — and sometimes a privacy issue. This guide explains when splitting a PDF before sharing makes sense, how to extract specific pages and reassemble them into section-specific documents for different recipients, and how splitting reduces file size more effectively than compression for documents where only part of the content is needed.",
    date: "Aug 20, 2025", read: "4 min", slug: "split-pdf-for-sharing",
  },
  {
    cat: "convert", icon: "📑",
    title: "Excel to PDF Print Layout — Fix Columns, Pages and Formatting",
    excerpt: "Excel spreadsheets were never designed for fixed pages — which is exactly why converting them to PDF produces cut-off columns, dozens of unnecessary pages, missing headers on page 2 onwards, and content scaled so small it becomes unreadable. This guide explains each layout problem, what causes it, and the exact Excel settings to fix before converting so the PDF looks clean and professional.",
    date: "Aug 18, 2025", read: "5 min", slug: "excel-to-pdf-print-layout",
  },
  {
    cat: "convert", icon: "🎯",
    title: "PDF to JPG vs PNG — Which Format Should You Export To?",
    excerpt: "JPG and PNG look similar at first glance but behave very differently — and choosing the wrong one affects file size, text sharpness, and edit quality in ways that matter. This guide explains the core difference between lossy and lossless formats, when JPG is the right choice for PDF page exports, when PNG produces noticeably better results, and which format to use for social media, slide decks, technical diagrams, and documents you plan to edit further.",
    date: "Sep 7, 2025", read: "4 min", slug: "pdf-to-jpg-vs-png",
  },
  {
    cat: "convert", icon: "🖥️",
    title: "PPT to PDF Fonts Missing or Wrong? Here's How to Fix It",
    excerpt: "You spend hours on a presentation, convert it to PDF, and the fonts are completely wrong — or text boxes have shifted because the substitute font has different spacing. This is one of the most common PowerPoint to PDF complaints, and it happens for a specific reason. This guide explains why fonts go missing during conversion, which fonts are safe to use, how to embed fonts directly in your PPTX file, and what to do when embedding is not an option.",
    date: "Sep 9, 2025", read: "4 min", slug: "ppt-to-pdf-fonts-missing",
  },
  {
    cat: "convert", icon: "🆓",
    title: "Free vs Paid Word to PDF Tools — What's Actually Different?",
    excerpt: "Most people assume paid tools convert better — but for Word to PDF conversion, the difference is rarely about output quality. Free browser-based tools handle standard DOCX files just as well as paid software for the majority of documents. Where paid tools actually differ is in batch processing, file size limits, privacy guarantees, offline availability, and enterprise integrations. This guide breaks down every real difference between free and paid Word to PDF tools so you can make an informed decision based on your actual use case rather than marketing.",
    date: "Mar 20, 2026", read: "7 min", slug: "free-vs-paid-word-to-pdf-tools",
  },
  {
    cat: "convert", icon: "🌐",
    title: "Word to PDF on Windows vs Mac — Differences and Best Method",
    excerpt: "Word on Windows and Word on Mac are different applications — and they produce slightly different PDF output from the same DOCX file. Font rendering differs, text spacing behaves differently, and the export method you choose on Mac affects the result more than most people realize. This guide explains exactly what differs between platforms, which export method produces the best output on each, and when a browser-based converter eliminates platform variability entirely.",
    date: "Mar 15, 2026", read: "5 min", slug: "word-to-pdf-windows-vs-mac",
  },
  {
    cat: "convert", icon: "📐",
    title: "How to Convert Word to PDF Without Losing Formatting",
    excerpt: "Fonts changing, tables breaking, and layout shifting after conversion are not inevitable — they happen because of specific issues in how the Word document was built or how the export was run. Custom fonts that aren't embedded, table cells with percentage-based widths, images set to inline rather than anchored, and documents saved in the older DOC format are the most common culprits. This guide walks through each formatting failure, explains what causes it, and gives you the fix to apply before converting so the PDF matches your document exactly.",
    date: "Mar 16, 2026", read: "5 min", slug: "convert-word-to-pdf-without-losing-formatting",
  },
  {
    cat: "convert", icon: "🛠️",
    title: "Word to PDF Not Working? Here's How to Fix It",
    excerpt: "Blank PDFs, upload errors, conversion timeouts, and broken formatting are the four most common Word to PDF failure modes — and each one has a different cause and a different fix. Blank output usually means the file is password-protected or corrupted. Upload errors are almost always a file size issue. Timeouts happen with unusually complex documents. Broken formatting is a font or layout problem. This guide covers the diagnostic steps for each failure, the fastest fix for each scenario, and what to try when the standard solutions don't work.",
    date: "Mar 18, 2026", read: "4 min", slug: "word-to-pdf-not-working-fix",
  },
  {
    cat: "convert", icon: "🤖",
    title: "ChatGPT Generated a PDF — How to Convert It to Word?",
    excerpt: "ChatGPT can export conversations and generated content as PDFs — but those PDFs are not always easy to edit, reformat, or repurpose. Whether you need to extract the text into a Word document for further editing, reformat the content into a report structure, or pull specific sections for use in another document, the process is straightforward but depends on whether the PDF contains real text or is a scanned image. This guide covers both scenarios, explains when OCR is needed, and shows you how to convert any ChatGPT-generated PDF into a fully editable Word file in under a minute.",
    date: "Apr 14, 2026", read: "4 min", slug: "how-to-convert-chatgpt-pdf-to-word",
  },

  // ── COMPRESS ──
  {
    cat: "compress", icon: "🗜️",
    title: "PDF Too Large for Email? How to Compress It Under the Limit",
    excerpt: "Gmail rejects attachments over 25MB. Corporate mail servers often cap at 10MB. And large PDFs bounce without warning, leaving you wondering why the delivery failed. This guide explains exactly how email size limits work, how much different types of PDFs compress, and what to do when compression alone is not enough — including splitting and file sharing alternatives for very heavy documents.",
    date: "Aug 19, 2025", read: "5 min", slug: "compress-pdf-email-limit",
  },
  {
    cat: "compress", icon: "📦",
    title: "PDF Too Large to Upload? Fix It in Seconds",
    excerpt: "Upload portals, university submission systems, government forms, and HR platforms all have file size limits — and a PDF that is too large gets rejected without explanation. The fix is almost always compression, but how much you can compress depends on what is inside the PDF. Image-heavy documents compress dramatically. Text-only documents compress very little. This guide explains how to identify what is making your PDF large, choose the right compression level for your use case, and what to do when the portal limit is so low that even maximum compression is not enough.",
    date: "Apr 17, 2026", read: "3 min", slug: "pdf-file-too-large-compress",
  },
  {
    cat: "compress", icon: "⚖️",
    title: "Compress PDF on Mobile vs Desktop — Which Is Better?",
    excerpt: "If you compress a PDF from your phone instead of a computer, does the quality suffer? The short answer is no — but the practical experience differs in ways that affect when each option makes more sense. This guide explains how browser-based compression actually works, what differs between mobile and desktop in terms of upload speed, file management, and output review, and when to use each for the fastest and most convenient workflow.",
    date: "Mar 22, 2026", read: "4 min", slug: "compress-pdf-mobile-vs-desktop",
  },
  {
    cat: "compress", icon: "✨",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt: "Compression always involves a tradeoff — but for most PDFs, you can reduce file size by 50 to 80 percent before any quality loss becomes visible. The key is understanding what compression actually does to different content types. Text and vector graphics compress without any quality loss at all. Images are where quality can degrade, and only at aggressive compression levels. This guide explains exactly what happens to each content type during compression, which compression level to choose for different use cases, and how to check the output so you never share a PDF that looks worse than the original.",
    date: "Mar 23, 2026", read: "5 min", slug: "compress-pdf-without-losing-quality",
  },
  {
    cat: "compress", icon: "📉",
    title: "PDF Still Too Large After Compression? Here's How to Fix It",
    excerpt: "Running compression and getting back a file that is almost the same size is frustrating — but it happens for specific reasons that are fixable. The most common cause is that the PDF contains high-resolution embedded images that need a different approach, or it includes embedded fonts, attachments, or metadata that compression tools do not touch. This guide covers the five most common reasons compression fails to reduce size significantly, and gives you a step-by-step approach for each — from re-exporting the source file to splitting the document.",
    date: "Mar 25, 2026", read: "4 min", slug: "pdf-still-too-large-after-compression",
  },
  {
    cat: "compress", icon: "📏",
    title: "Why Are PDF Files So Large? (And How to Fix It)",
    excerpt: "A two-page document that should be 200KB ending up at 50MB is not unusual — but the reason is almost never obvious from looking at the file. High-resolution embedded images are the most common culprit, but embedded fonts, color profiles, revision history, attached files, and redundant data layers all contribute to file size in ways that are invisible to the reader. This guide explains every major source of PDF file size bloat, how to identify which one is affecting your document, and the fastest way to fix each.",
    date: "Mar 26, 2026", read: "5 min", slug: "why-are-pdf-files-so-large",
  },

  // ── MOBILE ──
  {
    cat: "mobile", icon: "📱",
    title: "How to Compress a PDF on Mobile (Android & iPhone)",
    excerpt: "Compressing a PDF from your phone is faster than most people expect — no app download required, no account needed. Modern browser-based tools work just as well on mobile as on desktop, and the entire process takes under a minute from any Android or iPhone. This guide walks through the exact steps for both platforms, explains how to access the compressed file from your phone's storage, and covers what to do if the upload is slow or the file is too large for the mobile browser to handle comfortably.",
    date: "Mar 24, 2026", read: "3 min", slug: "compress-pdf-on-mobile",
  },
  {
    cat: "mobile", icon: "🤳",
    title: "How to Convert Word to PDF on Mobile (Android & iPhone)",
    excerpt: "Converting a Word document to PDF from your phone is something most people assume requires a computer — but browser-based tools handle it entirely on mobile without any app installation. The process works identically on Android and iPhone, supports both DOCX and DOC formats, and takes under a minute for standard documents. This guide covers the exact steps, explains how to pick the converted file from your downloads, and addresses the two most common mobile-specific issues: finding the DOCX file in phone storage and handling large files on slower connections.",
    date: "Mar 17, 2026", read: "3 min", slug: "word-to-pdf-on-mobile",
  },
  {
    cat: "mobile", icon: "🌐",
    title: "How Small Should I Compress My PDF? (Size Guide by Use Case)",
    excerpt: "Email, WhatsApp, university portals, websites — every use case needs a different PDF size. Here's the exact target for each.",
    date: "Mar 27, 2026", read: "4 min", slug: "how-small-should-i-compress-my-pdf",
  },

  // ── STUDENTS ──
  {
    cat: "students", icon: "🎓",
    title: "Best Tools for Students to Study Smarter in 2025",
    excerpt: "Assignments piling up, group projects, exams, and PDFs that won't cooperate — the right tools make a real difference to how efficiently you get through academic work. This guide covers the most useful free tools for students across five categories: PDF management, note-taking, document conversion, image handling, and writing support. Every tool listed works directly in the browser with no signup required, no watermarks, and no cost — because students should not have to pay for utilities that are available free.",
    date: "Dec 11, 2025", read: "6 min", slug: "best-tools-for-students",
  },
  {
    cat: "students", icon: "📚",
    title: "Word to PDF for Students — How to Submit Assignments as PDF",
    excerpt: "Submitting assignments as DOCX can break formatting on the lecturer's machine, get flagged by submission portals that only accept PDF, or display differently depending on the version of Word the reader uses. Converting to PDF before submission eliminates all of these risks — the document looks identical on every device and every operating system. This guide explains the fastest way to convert Word assignments to PDF, what to check before submitting, and how to handle common issues like file size limits on university portals.",
    date: "Mar 21, 2026", read: "2 min", slug: "word-to-pdf-for-students",
  },
  {
    cat: "students", icon: "🤖",
    title: "ChatGPT Generated a PDF — How to Convert It to Word?",
    excerpt: "ChatGPT can export conversations and generated content as PDFs — but those PDFs are not always easy to edit, reformat, or repurpose. Whether you need to extract the text into a Word document for further editing, reformat the content into a report structure, or pull specific sections for use in another document, the process is straightforward but depends on whether the PDF contains real text or is a scanned image. This guide covers both scenarios, explains when OCR is needed, and shows you how to convert any ChatGPT-generated PDF into a fully editable Word file in under a minute.",
    date: "Apr 14, 2026", read: "4 min", slug: "how-to-convert-chatgpt-pdf-to-word",
  },
  {
    cat: "students", icon: "📖",
    title: "PDF File Opens but Not Editable — Fix It in 30 Seconds",
    excerpt: "A PDF that opens but shows no cursor, no text selection, and no way to type is almost always either a scanned document or a permission-restricted file — and both are fixable. Scanned PDFs need OCR to convert image-based text into real selectable characters before any editing is possible. Permission-restricted PDFs need to be unlocked before editing tools can work on them. This guide explains how to tell which type you have, the fastest fix for each, and what to do when the standard approach does not work.",
    date: "Apr 15, 2026", read: "3 min", slug: "pdf-not-editable-fix",
  },

  // ── AI ──
  {
  cat: "ai-tools", icon: "🤖", featured: true,
  title: "How to Summarize a PDF with AI Instantly — No Reading Required",
  excerpt: "Forty pages of research, sixty pages of contract, a hundred-page report — and you need the key points in the next ten minutes. AI PDF summarization does not skim, it reads everything and surfaces what actually matters. This guide covers how the technology works, which document types get the best results, when to use summarization versus chat, and the small preparation steps that make a big difference in output quality.",
  date: "Jun 11, 2025", read: "6 min", slug: "how-to-summarize-a-pdf-with-ai-instantly",
},

{
  cat: "ai-tools", icon: "💬", featured: true,
  title: "Chat with PDF Using AI — Ask Any Question, Get Instant Answers from Your Document",
  excerpt: "Ctrl+F finds words — it does not find answers. When you need to know the termination clause in a 90-page contract, the Q3 revenue in a 120-page report, or the methodology buried in Chapter 4 of a thesis, keyword search wastes your time. Chat with PDF lets you ask plain-English questions and get direct, synthesized answers from the full document. This guide covers what kinds of questions work best, real-world use cases across legal, academic, and financial documents, and how to get the most accurate results.",
  date: "Jun 11, 2025", read: "7 min", slug: "chat-with-pdf-ai-questions-answers-any-document",
},

  // ── TIPS ──
  {
    cat: "tips", icon: "🔒",
    title: "PDF Password Best Practices — How to Protect Documents the Right Way",
    excerpt: "Adding a password to a PDF is easy — but most people do it wrong. Weak passwords offer false security. Complex passwords get forgotten, locking out even the document owner. And protecting every file the same way creates unnecessary friction. This guide covers strong password creation, secure storage, how to communicate passwords safely to recipients, which documents actually need protection, and how to use watermarks alongside passwords for a complete document security workflow.",
    date: "Sep 11, 2025", read: "5 min", slug: "pdf-password-best-practices",
  },
  {
    cat: "tips", icon: "🔓",
    title: "Forgot Your PDF Password? Here Are Your Options",
    excerpt: "PDF encryption has no built-in recovery mechanism — forget the password and the document is locked permanently. But before assuming the worst, there are several realistic options worth trying. This guide covers systematic password recall methods, how to search your email for the original password, contacting the document source, using the Unlock PDF tool when you have the correct password, and what third-party recovery tools can and cannot realistically do for modern encrypted PDFs.",
    date: "Sep 13, 2025", read: "5 min", slug: "forgot-pdf-password-options",
  },
  {
    cat: "tips", icon: "🔄",
    title: "PDF Pages Upside Down or Sideways? Fix Orientation Instantly",
    excerpt: "Wrong page orientation is one of the most common PDF problems — and one of the easiest to fix. Scanner placement, phone photography angle, design software export settings, and merged documents from different sources all produce pages that end up sideways or upside down. This guide explains exactly which rotation to apply for each scenario, whether rotation affects quality (it doesn't for digital PDFs), and why fixing orientation before running OCR matters significantly for accuracy.",
    date: "Sep 15, 2025", read: "3 min", slug: "pdf-pages-upside-down-fix",
  },
  {
    cat: "tips", icon: "✍️",
    title: "Digital vs Electronic Signature on PDF — What's the Difference?",
    excerpt: "Digital signature and electronic signature are used as if they mean the same thing — but they refer to completely different technologies with very different legal implications. One is a visual mark placed on a document. The other is a cryptographic proof that the document has not changed since signing. This guide explains both clearly, which one you actually need for everyday contracts and agreements, and when a certified digital signature is legally required in your jurisdiction.",
    date: "Sep 17, 2025", read: "5 min", slug: "digital-vs-electronic-signature-pdf",
  },
  {
    cat: "tips", icon: "🔡",
    title: "OCR PDF Accuracy and Language Support — What to Expect",
    excerpt: "OCR accuracy is not a fixed number — it changes dramatically depending on scan resolution, font type, document condition, page orientation, and the language being processed. This guide explains each factor clearly, gives you resolution targets for different use cases, describes which fonts convert reliably and which cause errors, explains how language support varies across major language groups, and tells you exactly what to review in the output to catch the most common OCR mistakes before they cause problems.",
    date: "Sep 19, 2025", read: "5 min", slug: "ocr-pdf-accuracy-languages",
  },
  {
    cat: "tips", icon: "🖊️",
    title: "How to Edit a PDF Without Word — Free Browser-Based Methods",
    excerpt: "The assumption that editing a PDF requires Microsoft Word is wrong — and often leads people to unnecessary conversions, reformatting work, and paid software subscriptions. This guide covers four practical methods for editing PDFs without Word: direct browser-based editing for minor changes, Google Docs for moderate edits, LibreOffice Draw for offline layout work, and conversion to Word only when major rewrites make it genuinely the best option.",
    date: "Sep 21, 2025", read: "4 min", slug: "edit-pdf-without-word",
  },
  {
    cat: "tips", icon: "🖼️",
    title: "How Freelancers Should Watermark PDFs — Protect Your Work",
    excerpt: "As a freelancer, you share work before payment is confirmed — design previews, draft documents, writing samples, and project proposals. Without protection, clients can use your draft and disappear. This guide covers what watermarks actually prevent and what they don't, four practical watermarking strategies for different freelance situations, the opacity and placement settings that work best, and how to manage clean final delivery once payment is confirmed.",
    date: "Sep 23, 2025", read: "4 min", slug: "watermark-pdf-for-freelancers",
  },
  {
    cat: "tips", icon: "🔧",
    title: "Why Does Formatting Break When Converting Word to PDF?",
    excerpt: "A Word document that looks perfect on screen produces a PDF with wrong fonts, shifted tables, and misplaced images — and the reason is almost never obvious. The core issue is that Word documents are dynamic: they adapt to the fonts installed on the current machine, the page size settings of the current printer, and the rendering engine of the current version of Word. PDFs are fixed. The conversion process freezes the document state at one moment — and if that state depends on resources that are not embedded or settings that vary by machine, the output breaks. This guide explains every formatting failure mode and how to prevent each one before you export.",
    date: "Mar 19, 2026", read: "5 min", slug: "why-formatting-breaks-in-word-to-pdf",
  },
  {
    cat: "tips", icon: "🏢",
    title: "Client Sent a PDF? How Freelancers Edit It for Free",
    excerpt: "Clients send PDFs constantly — briefs, contracts, feedback forms, design specs — and most of them need to be edited, annotated, or converted before you can actually work with them. Paying for Adobe Acrobat or a subscription tool to handle this is unnecessary. Browser-based tools handle the most common freelancer PDF tasks completely free: converting to Word for editing, adding comments and annotations, filling and signing forms, and extracting specific pages. This guide covers the most common scenarios freelancers face and the fastest free solution for each.",
    date: "Apr 16, 2026", read: "5 min", slug: "freelancer-edit-pdf-free",
  },
  {
    cat: "tips", icon: "🖨️",
    title: "Best Free Image Converter Tools Online in 2025",
    excerpt: "HEIC files from iPhone that Windows cannot open, WebP images that older software rejects, PNG screenshots that need to be JPG for upload portals — image format conversion is a constant low-level friction point for anyone working with files across different platforms. This guide covers the best free browser-based image converter tools available right now, tested across the most common conversion types: HEIC to JPG, WebP to PNG, PNG to JPG, and batch conversions. No watermarks, no signup, no file size tricks — just the tools that actually work.",
    date: "Apr 2, 2026", read: "5 min", slug: "best-free-image-converter-tools",
  },
];

const featuredArticle = articles.find((a) => a.featured);

// ─── Filter Button ────────────────────────────────────────────────────────────
function FilterButton({ label, dot, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 18px",
        borderRadius: "100px",
        border: "1px solid " + (active ? "#111111" : "#E5E2DC"),
        background: active ? "#111111" : "#FFFFFF",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "#FFFFFF" : "#444444",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all .2s",
      }}
    >
      {dot && (
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: dot, display: "inline-block" }} />
      )}
      {label}
    </button>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ article }) {
  const [hovered, setHovered] = useState(false);
  const thumb = THUMB_STYLES[article.cat];
  const cat = CATEGORIES[article.cat];

  return (
    <Link
      href={"/blog/" + article.slug}
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E2DC",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
        textDecoration: "none",
        transition: "box-shadow .3s, transform .3s",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
      className="featured-grid"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div style={{ background: thumb.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: "240px" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <span style={{ fontSize: "4rem", position: "relative", zIndex: 1 }}>{article.icon}</span>
      </div>

      {/* Body */}
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", background: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#888", marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: cat.color, display: "inline-block" }} />
          {cat.label} · Featured
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.6rem", lineHeight: 1.25, color: "#111111", marginBottom: "0.8rem" }}>
          {article.title}
        </h2>
        {/* <p style={{ fontSize:"14px", color:"#444444", lineHeight:1.75, marginBottom:"1.2rem" }}> */}
        <p style={{ fontSize: "14px", color: "#444444", lineHeight: 1.75, marginBottom: "1.2rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>

          {article.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#888", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.read} read</span>
          <span style={{ background: "#FEF0ED", color: "#E8380D", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px" }}>
            Most Popular
          </span>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#E8380D" }}>
          Read Article →
        </span>
      </div>
    </Link>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  const [hovered, setHovered] = useState(false);
  const thumb = THUMB_STYLES[article.cat];
  const cat = CATEGORIES[article.cat];

  return (
    <Link
      href={"/blog/" + article.slug}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E2DC",
        borderRadius: "14px",
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
        transition: "transform .25s, box-shadow .25s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div style={{ background: thumb.bg, height: "140px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <span style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.25)", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {cat.label}
        </span>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: "2.4rem", position: "relative", zIndex: 1 }}>{article.icon}</span>
      </div>

      {/* Body */}
      <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
        {/* <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.05rem", lineHeight:1.35, color:"#111111", marginBottom:"0.5rem", fontWeight: 700 }}>
          {article.title}
        </h3> */}

        <h3 style={{ fontSize: "1.05rem", lineHeight: 1.35, color: "#111111", marginBottom: "0.5rem", fontWeight: 700 }}>
          {article.title}
        </h3>

        <p style={{ fontSize: "13.5px", color: "#444444", lineHeight: 1.7, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>{article.date} · {article.read}</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#E8380D" }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function BlogClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueArticles = articles.filter(
    (a, idx, self) => self.findIndex((b) => b.slug === a.slug) === idx
  );

  const filtered = uniqueArticles.filter((a) => {
    const matchCat = activeFilter === "all" || a.cat === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const showFeatured = activeFilter === "all" && !searchQuery;
  const gridArticles = showFeatured
    ? filtered.filter((a) => a.slug !== featuredArticle.slug)
    : filtered;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .blog-page * { box-sizing: border-box; }
        @media (max-width: 680px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .blog-hero-wrap { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (max-width: 520px) {
          .article-grid { grid-template-columns: 1fr !important; }
        }
        .nl-input {
          flex: 1; max-width: 300px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff; padding: 10px 16px;
          border-radius: 8px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; outline: none;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.4); }
        .nl-btn {
          background: #E8380D; color: #fff; border: none;
          padding: 10px 22px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
          transition: background .2s;
        }
        .nl-btn:hover { background: #c4300b; }
      `}</style>

      <div className="blog-page" style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F5F2", color: "#111111", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <div
          className="blog-hero-wrap"
          style={{ padding: "4rem 2rem 2.5rem", maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E8380D", marginBottom: "0.8rem" }}>
              <span style={{ width: "20px", height: "2px", background: "#E8380D", display: "inline-block" }} />
              PDF Linx Blog
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, color: "#111111", marginBottom: "0.6rem" }}>
              Real guides for{" "}
              <em style={{ fontStyle: "italic", color: "#E8380D" }}>real</em>{" "}
              PDF problems
            </h1>
            <p style={{ fontSize: "15px", color: "#888", maxWidth: "440px", lineHeight: 1.6 }}>
              Simple, no-nonsense guides for PDF tools — tested in real life, completely free.
            </p>
          </div>

          <div style={{ display: "flex", gap: "2rem", flexShrink: 0 }}>
            {[["39+", "Articles"], ["5", "Categories"], ["Free", "Always"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "#111111", display: "block" }}>{num}</span>
                <span style={{ fontSize: "12px", color: "#888" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 2rem" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid #E5E2DC", paddingBottom: "1.5rem" }}>
            <FilterButton label="All Articles" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <FilterButton key={key} label={cat.label} dot={cat.dot} active={activeFilter === key} onClick={() => setActiveFilter(key)} />
            ))}
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#FFFFFF", border: "1px solid #E5E2DC", borderRadius: "10px", padding: "10px 16px", maxWidth: "400px" }}>
            <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#111111", background: "transparent", width: "100%" }}
            />
          </div>
        </div>

        {/* ── FEATURED ── */}
        {showFeatured && (
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 2rem" }}>
            <FeaturedCard article={featuredArticle} />
          </div>
        )}

        {/* ── ARTICLE GRID ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.6rem", color: "#111111" }}>
              {activeFilter === "all" ? "All Articles" : CATEGORIES[activeFilter].label}
            </h2>
            <span style={{ fontSize: "13px", color: "#888" }}>{gridArticles.length} articles</span>
          </div>

          {gridArticles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#888", fontSize: "15px" }}>
              No articles found. Try a different search.
            </div>
          ) : (
            <div
              className="article-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}
            >
              {gridArticles.map((article, i) => (
                <ArticleCard key={article.slug + i} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* ── NEWSLETTER ── */}
        <div style={{ background: "#111111", padding: "4rem 2rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#FFFFFF", marginBottom: "0.6rem" }}>
            Get PDF tips in your inbox
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "1.8rem" }}>
            One useful tip per week. No spam, no subscriptions — unsubscribe anytime.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <input type="email" placeholder="your@email.com" className="nl-input" />
            <button className="nl-btn">Subscribe Free</button>
          </div>
        </div>

      </div>
    </>
  );
}



