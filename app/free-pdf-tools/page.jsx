import Link from "next/link";
import {
  FileText, FileType, FileImage, FileSpreadsheet,
  FilePlus, Scissors, FileMinus, Lock, Unlock,
  ShieldCheck, Zap, Globe, RotateCw, PenTool,
  Eye, Stamp, Image,
} from "lucide-react";
import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

export const metadata = {
  title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
  description:
    "24+ free online PDF tools: convert PDF to Word, merge PDF, compress PDF, split, protect, unlock, rotate, sign, OCR, edit, watermark, and more. No signup, no watermark, works on all devices.",
  alternates: { canonical: "https://pdflinx.com/free-pdf-tools" },
  openGraph: {
    title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
    description:
      "16+ free online PDF tools: convert PDF to Word, merge, split, compress, protect, unlock, rotate, sign, OCR and edit PDFs. No signup required.",
    url: "https://pdflinx.com/free-pdf-tools",
  },
};

export default function FreePdfToolsPage() {
  const getTool = (slug, fallbackHref = "#") =>
    Object.values(pdfToolsMeta).find((t) => t.slug === slug) || {
      href: fallbackHref, title: "", description: "", slug,
    };

  const tPdfToWord   = getTool("pdf-to-word",   "/pdf-to-word");
  const tWordToPdf   = getTool("word-to-pdf",   "/word-to-pdf");
  const tImageToPdf  = getTool("image-to-pdf",  "/image-to-pdf");
  const tMerge       = getTool("merge-pdf",      "/merge-pdf");
  const tSplit       = getTool("split-pdf",      "/split-pdf");
  const tCompress    = getTool("compress-pdf",   "/compress-pdf");
  const tProtect     = getTool("protect-pdf",    "/protect-pdf");
  const tUnlock      = getTool("unlock-pdf",     "/unlock-pdf");
  const tRotate      = getTool("rotate-pdf",     "/rotate-pdf");
  const tSign        = getTool("sign-pdf",       "/sign-pdf");
  const tExcel       = getTool("excel-pdf",      "/excel-pdf");
  const tPpt         = getTool("ppt-to-pdf",     "/ppt-to-pdf");
  const tOcr         = getTool("ocr-pdf",        "/ocr-pdf");
  const tEdit        = getTool("edit-pdf",       "/edit-pdf");
  const tWatermark   = getTool("add-watermark",  "/add-watermark");
  const tPdfToJpg    = getTool("pdf-to-jpg",     "/pdf-to-jpg");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What are free PDF tools?", acceptedAnswer: { "@type": "Answer", text: "Free PDF tools are browser-based utilities that let you convert, merge, split, compress, protect, unlock, rotate, sign, OCR, edit, and watermark PDF files online without installing software." } },
      { "@type": "Question", name: "Are PDFLinx PDF tools completely free?", acceptedAnswer: { "@type": "Answer", text: "Yes. All 24+ PDFLinx tools are free to use with no signup, no watermark added to your files, and no hidden charges." } },
      { "@type": "Question", name: "Can I use PDF tools on mobile and desktop?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS — no app download required." } },
      { "@type": "Question", name: "Is it safe to use online PDF tools?", acceptedAnswer: { "@type": "Answer", text: "PDFLinx is designed to be privacy-friendly. Many tools process files directly in your browser without uploading to a server. Files that are uploaded are not stored permanently." } },
      { "@type": "Question", name: "Which PDF tools are most popular?", acceptedAnswer: { "@type": "Answer", text: "The most used tools on PDF Linx are PDF to Word converter, Word to PDF, Compress PDF, Merge PDF, Split PDF, OCR PDF, Protect PDF, Unlock PDF, Rotate PDF, and Sign PDF." } },
      { "@type": "Question", name: "How do I convert a PDF to Word without losing formatting?", acceptedAnswer: { "@type": "Answer", text: "Upload your PDF to the PDF to Word converter on PDF Linx. The tool preserves fonts, tables, images, and layout in the converted DOCX file. For scanned PDFs, run OCR first to extract the text layer before converting." } },
      { "@type": "Question", name: "How do I merge or split a PDF online?", acceptedAnswer: { "@type": "Answer", text: "For merging: upload multiple PDF files, reorder them, and click Merge to download a single combined PDF. For splitting: upload one PDF, select the pages or page range you need, and download the extracted pages." } },
      { "@type": "Question", name: "How do I reduce PDF file size for email?", acceptedAnswer: { "@type": "Answer", text: "Use the Compress PDF tool on PDF Linx. Upload your file, choose a compression level, and download the smaller version. Most PDFs can be reduced by 50–80% without significant quality loss." } },
    ],
  };

  const toolCategories = [
    {
      heading: "Convert to PDF",
      emoji: "📄",
      desc: "Turn Word, Excel, PowerPoint, and image files into professional PDF documents.",
      tools: [
        { label: "Word to PDF",  href: "/word-to-pdf",  emoji: "📄", desc: "Convert DOC and DOCX files to PDF. Layout, fonts, and tables preserved." },
        { label: "Excel to PDF", href: "/excel-pdf",    emoji: "📊", desc: "Export XLS and XLSX spreadsheets to clean, print-ready PDF format." },
        { label: "PPT to PDF",   href: "/ppt-to-pdf",   emoji: "📽️", desc: "Convert PowerPoint presentations to PDF — slides stay pixel-perfect." },
        { label: "Image to PDF", href: "/image-to-pdf", emoji: "🖼️", desc: "Combine JPG and PNG images into a single PDF. Supports batch upload." },
        { label: "JPG to PDF",   href: "/jpg-to-pdf",   emoji: "🖼️", desc: "Convert JPG images into a PDF document quickly and easily." },
        { label: "Text to PDF",  href: "/text-to-pdf",  emoji: "📄", desc: "Convert plain text into a clean PDF document instantly." },
        { label: "HTML to PDF",  href: "/html-to-pdf",  emoji: "💻", desc: "Convert HTML content into PDF while preserving layout and structure." },
      ],
    },
    {
      heading: "Convert from PDF",
      emoji: "🔄",
      desc: "Extract content from PDFs and convert to editable or image formats.",
      tools: [
        { label: "PDF to Word",  href: "/pdf-to-word",  emoji: "📝", desc: "Convert PDF to editable DOCX. Formatting, images, and tables preserved." },
        { label: "PDF to JPG",   href: "/pdf-to-jpg",   emoji: "🖼️", desc: "Extract PDF pages as high-quality JPG images. Download individually or as ZIP." },
        { label: "OCR PDF",      href: "/ocr-pdf",      emoji: "🔍", desc: "Use Optical Character Recognition to extract selectable text from scanned PDFs." },
        { label: "PDF to Excel", href: "/pdf-to-excel", emoji: "📊", desc: "Extract PDF tables into editable Excel spreadsheets." },
        { label: "PDF to PNG",   href: "/pdf-to-png",   emoji: "🖼️", desc: "Convert PDF pages into sharp PNG images with clear quality." },
        { label: "PDF to Text",  href: "/pdf-to-text",  emoji: "📝", desc: "Extract plain text from PDF files for copying, editing, and reuse." },
      ],
    },
    {
      heading: "Organize PDF",
      emoji: "🗂️",
      desc: "Merge, split, compress, and rotate PDF files to manage documents efficiently.",
      tools: [
        { label: "Merge PDF",        href: "/merge-pdf",        emoji: "🔗", desc: "Combine multiple PDF files into one document. Drag to reorder pages." },
        { label: "Split PDF",        href: "/split-pdf",        emoji: "✂️", desc: "Extract specific pages or page ranges from any PDF file." },
        { label: "Compress PDF",     href: "/compress-pdf",     emoji: "🗜️", desc: "Reduce PDF file size without losing readability. Choose compression level." },
        { label: "Rotate PDF",       href: "/rotate-pdf",       emoji: "🔄", desc: "Fix sideways or upside-down PDF pages. Rotate 90°, 180°, or 270°." },
        { label: "Remove Pages",     href: "/remove-pages",     emoji: "🗑️", desc: "Delete specific pages from a PDF and download the cleaned file." },
        { label: "Add Page Numbers", href: "/add-page-numbers", emoji: "#️⃣", desc: "Insert page numbers into your PDF with custom placement and style." },
      ],
    },
    {
      heading: "Edit & Secure PDF",
      emoji: "🔐",
      desc: "Edit content, add signatures, watermarks, and password protection to PDF documents.",
      tools: [
        { label: "Edit PDF",      href: "/edit-pdf",      emoji: "✏️", desc: "Add text, annotations, and corrections to PDF files directly in your browser." },
        { label: "Sign PDF",      href: "/sign-pdf",      emoji: "🖊️", desc: "Add a digital signature to contracts and forms. Draw, type, or upload." },
        { label: "Add Watermark", href: "/add-watermark", emoji: "💧", desc: "Stamp text or image watermarks onto PDF pages for branding or protection." },
        { label: "Protect PDF",   href: "/protect-pdf",   emoji: "🔐", desc: "Add password encryption to sensitive PDF documents before sharing." },
        { label: "Unlock PDF",    href: "/unlock-pdf",    emoji: "🔓", desc: "Remove password restrictions from PDF files you own and have access to." },
      ],
    },
  ];

  const useCases = [
    { title: "Students", emoji: "🎓", text: "Convert lecture notes and course materials from PDF to Word for annotation. Merge assignment pages. Compress files before submitting to university portals." },
    { title: "Office Professionals", emoji: "💼", text: "Convert reports and proposals between Word and PDF. Compress large presentations for email. Add password protection to confidential documents." },
    { title: "Freelancers", emoji: "💻", text: "Sign contracts digitally without printing. Convert client briefs from PDF to editable DOCX. Add watermarks to design previews and draft documents." },
    { title: "Small Business Owners", emoji: "🏢", text: "Convert Excel invoices to PDF for professional sharing. Merge multiple receipts for accounting. Protect sensitive financial documents with passwords." },
  ];

  const faqs = [
    { q: "Do I need to install any software to use these PDF tools?", a: "No. All PDF Linx tools work entirely online in your browser — just upload your file, process it, and download the result. No desktop software, no app download required." },
    { q: "How do I convert a PDF to Word without losing formatting?", a: "Upload your PDF to the PDF to Word converter. The tool preserves fonts, tables, images, and overall layout in the DOCX output. For scanned PDFs, run the OCR PDF tool first to extract the text layer before converting." },
    { q: "How do I reduce PDF file size for email or upload?", a: "Use the Compress PDF tool. Upload your file, select a compression level, and download the smaller version. PDF files can typically be reduced by 50–80% without significant quality loss." },
    { q: "Can I convert Word, Excel, or PowerPoint files to PDF?", a: "Yes. PDF Linx supports Word to PDF (DOC and DOCX), Excel to PDF (XLS and XLSX), and PPT to PDF (PPT and PPTX). All conversions preserve formatting, tables, and layout." },
    { q: "What is OCR and when do I need it?", a: "OCR (Optical Character Recognition) converts scanned PDFs — which are image-based — into searchable and editable text. Use the OCR PDF tool when you can't select or copy text in a PDF, which usually means it's a scanned document." },
    { q: "How do I secure a PDF with a password?", a: "Use the Protect PDF tool to add password encryption. If you already have permission to access a protected PDF and want to remove the password, use the Unlock PDF tool." },
    { q: "How do I rotate pages or sign a PDF online?", a: "Use Rotate PDF to fix sideways or upside-down pages — rotate by 90°, 180°, or 270°. Use Sign PDF to add a digital signature by drawing, typing, or uploading your signature image." },
    { q: "Are my uploaded PDF files kept private?", a: "PDF Linx is designed with privacy in mind. Many tools process files locally in your browser without any server upload. Files that are uploaded for processing are not stored permanently." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .fpt-page {
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
          color: #111;
        }

        /* ── ANIMATIONS ── */
        @keyframes fptFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fpt-fade { opacity: 0; animation: fptFadeUp .6s ease forwards; }
        .fpt-d1 { animation-delay: .1s; }
        .fpt-d2 { animation-delay: .2s; }
        .fpt-d3 { animation-delay: .3s; }
        .fpt-d4 { animation-delay: .4s; }

        /* ── EYEBROW ── */
        .fpt-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #E8380D; margin-bottom: .6rem;
        }
        .fpt-eyebrow::before {
          content: ''; display: inline-block;
          width: 18px; height: 2px;
          background: #E8380D; border-radius: 2px;
        }

        /* ── DIVIDER ── */
        .fpt-divider {
          border: none; border-top: 1px solid #E5E2DC;
          max-width: 1100px; margin: 0 auto;
        }

        /* ── HERO ── */
        .fpt-hero {
          max-width: 900px; margin: 0 auto;
          padding: 5rem 2rem 4rem; text-align: center;
        }
        .fpt-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          line-height: 1.1; color: #111; margin-bottom: 1.2rem;
        }
        .fpt-hero h1 em { font-style: italic; color: #E8380D; }
        .fpt-hero-sub {
          font-size: 16px; color: #3D3D3D; line-height: 1.8;
          max-width: 680px; margin: 0 auto 2rem;
        }
        .fpt-pills { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .fpt-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 100px; padding: 6px 14px;
          font-size: 13px; font-weight: 500; color: #3D3D3D;
        }

        /* ── SECTIONS ── */
        .fpt-section {
          max-width: 1100px; margin: 0 auto; padding: 4rem 2rem;
        }
        .fpt-section-sm {
          max-width: 900px; margin: 0 auto; padding: 4rem 2rem;
        }

        /* ── PILLAR FEATURE CARDS ── */
        .fpt-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 2.5rem;
        }
        .fpt-feature-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 14px; padding: 1.5rem;
          transition: box-shadow .25s, transform .25s;
        }
        .fpt-feature-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-3px); }
        .fpt-feature-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }

        /* ── TASK LIST ── */
        .fpt-task-list { list-style: none; padding: 0; margin: 0 0 2rem; }
        .fpt-task-list li {
          display: flex; align-items: flex-start; gap: 10px;
          padding: .6rem 0; border-bottom: 1px solid #E5E2DC;
          font-size: 14px; color: #3D3D3D; line-height: 1.6;
        }
        .fpt-task-list li:last-child { border-bottom: none; }
        .fpt-task-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #E8380D; flex-shrink: 0; margin-top: 7px;
        }
        .fpt-link {
          color: #E8380D; font-weight: 600;
          text-decoration: none; border-bottom: 1px solid rgba(232,56,13,.25);
          transition: border-color .2s;
        }
        .fpt-link:hover { border-color: #E8380D; }

        /* ── GUIDE BOX ── */
        .fpt-guide-box {
          background: linear-gradient(135deg, rgba(232,56,13,.04), rgba(232,56,13,.01));
          border: 1px solid rgba(232,56,13,.12);
          border-radius: 16px; padding: 2rem; margin-bottom: 2rem;
        }
        .fpt-guide-box h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem; color: #111; margin-bottom: 1rem;
        }
        .fpt-guide-list { list-style: none; padding: 0; margin: 0; }
        .fpt-guide-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: #3D3D3D; line-height: 1.65;
          margin-bottom: .65rem;
        }
        .fpt-guide-list li:last-child { margin-bottom: 0; }
        .fpt-guide-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #E8380D; flex-shrink: 0; margin-top: 7px;
        }

        /* ── CATEGORY SECTION ── */
        .fpt-cat-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 1.2rem;
        }
        .fpt-cat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #FEF0ED; display: flex; align-items: center;
          justify-content: center; font-size: 1.3rem; flex-shrink: 0;
        }
        .fpt-cat-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem; color: #111; margin-bottom: 2px;
        }
        .fpt-cat-desc { font-size: 13px; color: #888; }

        /* ── TOOL GRID ── */
        .fpt-tool-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 3rem;
        }
        .fpt-tool-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 14px; padding: 1.3rem;
          display: flex; flex-direction: column;
          transition: box-shadow .25s, transform .25s, border-color .25s;
          text-decoration: none; color: inherit;
        }
        .fpt-tool-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,.09);
          transform: translateY(-3px);
          border-color: #E8380D;
        }
        .fpt-tool-emoji { font-size: 1.8rem; margin-bottom: .8rem; }
        .fpt-tool-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1rem; color: #111; margin-bottom: .4rem;
          transition: color .2s;
        }
        .fpt-tool-card:hover .fpt-tool-name { color: #E8380D; }
        .fpt-tool-desc {
          font-size: 12px; color: #888; line-height: 1.6;
          flex: 1; margin-bottom: .8rem;
        }
        .fpt-tool-cta {
          font-size: 11px; font-weight: 700;
          color: #E8380D; display: flex; align-items: center; gap: 4px;
        }

        /* ── USE CASES ── */
        .fpt-usecase-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }
        .fpt-usecase-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 14px; padding: 1.5rem;
          display: flex; gap: 14px; align-items: flex-start;
          transition: box-shadow .25s, transform .25s;
        }
        .fpt-usecase-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.07); transform: translateY(-2px); }
        .fpt-usecase-icon {
          font-size: 1.8rem; flex-shrink: 0; margin-top: 2px;
        }
        .fpt-usecase-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.05rem; color: #111; margin-bottom: .4rem;
        }
        .fpt-usecase-text { font-size: 13.5px; color: #3D3D3D; line-height: 1.7; }

        /* ── FAQ ── */
        .fpt-faq-item {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 12px; margin-bottom: 8px;
          overflow: hidden;
        }
        .fpt-faq-item summary {
          padding: 1.1rem 1.3rem;
          font-size: 14px; font-weight: 600; color: #111;
          cursor: pointer; list-style: none;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem;
        }
        .fpt-faq-item summary::-webkit-details-marker { display: none; }
        .fpt-faq-plus {
          color: #E8380D; font-size: 1.2rem; flex-shrink: 0;
          transition: transform .25s;
        }
        .fpt-faq-item[open] .fpt-faq-plus { transform: rotate(45deg); }
        .fpt-faq-answer {
          padding: 0 1.3rem 1.1rem;
          font-size: 13.5px; color: #3D3D3D; line-height: 1.75;
          border-top: 1px solid #E5E2DC;
          padding-top: .9rem;
        }

        /* ── CTA BAND ── */
        .fpt-cta-band {
          background: linear-gradient(135deg, #E8380D 0%, #C42D0A 100%);
          border-radius: 20px; padding: 3.5rem 2rem;
          text-align: center; position: relative; overflow: hidden;
          margin: 0 2rem 2rem;
        }
        .fpt-cta-band::before {
          content: '✨'; position: absolute;
          font-size: 7rem; opacity: .07;
          top: 50%; left: 4%; transform: translateY(-50%);
          pointer-events: none;
        }
        .fpt-cta-band::after {
          content: '📄'; position: absolute;
          font-size: 7rem; opacity: .07;
          top: 50%; right: 4%; transform: translateY(-50%);
          pointer-events: none;
        }
        .fpt-cta-btns {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 10px;
        }
        .fpt-cta-btn-primary {
          background: #fff; color: #E8380D;
          padding: 12px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 700;
          text-decoration: none; transition: transform .2s, box-shadow .2s;
        }
        .fpt-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.2); }
        .fpt-cta-btn-ghost {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.3);
          color: #fff; padding: 12px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; transition: background .2s;
        }
        .fpt-cta-btn-ghost:hover { background: rgba(255,255,255,.2); }

        /* ══════════════════════════════════════
           TABLET — max-width: 900px
        ══════════════════════════════════════ */
        @media (max-width: 900px) {
          .fpt-tool-grid    { grid-template-columns: repeat(3, 1fr); }
          .fpt-feature-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ══════════════════════════════════════
           MOBILE — max-width: 768px
        ══════════════════════════════════════ */
        @media (max-width: 768px) {
          .fpt-hero         { padding: 3rem 1.2rem 2.5rem; }
          .fpt-section      { padding: 2.5rem 1.2rem; }
          .fpt-section-sm   { padding: 2.5rem 1.2rem; }
          .fpt-tool-grid    { grid-template-columns: 1fr 1fr; }
          .fpt-feature-grid { grid-template-columns: 1fr; }
          .fpt-usecase-grid { grid-template-columns: 1fr; }
          .fpt-cta-band     { margin: 0 1.2rem 1.5rem; padding: 2.5rem 1.5rem; }
        }

        /* ══════════════════════════════════════
           SMALL MOBILE — max-width: 480px
        ══════════════════════════════════════ */
        @media (max-width: 480px) {
          .fpt-hero h1      { font-size: 2rem; }
          .fpt-hero-sub     { font-size: 14px; }
          .fpt-tool-grid    { grid-template-columns: 1fr 1fr; gap: 10px; }
          .fpt-tool-card    { padding: 1rem; }
          .fpt-tool-emoji   { font-size: 1.5rem; }
          .fpt-pill         { font-size: 12px; padding: 5px 11px; }
          .fpt-cta-band::before,
          .fpt-cta-band::after { display: none; }
        }
      `}</style>

      <main className="fpt-page min-h-screen">

        {/* ══ HERO ══ */}
        <div className="fpt-hero fpt-fade fpt-d1">
          <div className="fpt-eyebrow">24+ Free Tools — No Signup Required</div>
          <h1>
            Free Online <em>PDF Tools</em>
          </h1>
          <p className="fpt-hero-sub">
            PDF Linx is a complete free PDF toolkit — convert PDF to Word, merge PDF files,
            compress large PDFs, split pages, add digital signatures, run OCR on scanned
            documents, protect with passwords, and more. No signup, no watermarks, works
            on every device.
          </p>
          <div className="fpt-pills">
            {["✅ Completely Free", "🔒 Privacy-Friendly", "⚡ Fast Processing", "📱 Works on Mobile", "🚫 No Watermarks"].map(p => (
              <span key={p} className="fpt-pill">{p}</span>
            ))}
          </div>
        </div>

        <hr className="fpt-divider" />

        {/* ══ PILLAR CONTENT ══ */}
        <section className="fpt-section-sm fpt-fade fpt-d2">
          <div className="fpt-eyebrow">Everything in one place</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#111", lineHeight: 1.2, marginBottom: "1rem" }}>
            Everything You Need to Work with PDF Files
          </h2>
          <p style={{ fontSize: 15, color: "#3D3D3D", lineHeight: 1.8, marginBottom: "1.2rem" }}>
            PDFs are the most widely used document format in the world — for resumes,
            invoices, contracts, academic papers, reports, and official forms. But
            working with PDFs has traditionally required expensive desktop software
            like Adobe Acrobat. <strong style={{ color: "#111" }}>PDF Linx changes that.</strong> Every tool
            you need to convert, edit, compress, organize, and secure PDF files is
            available here for free, directly in your browser — no installation, no
            account, no cost.
          </p>
          <p style={{ fontSize: 15, color: "#3D3D3D", lineHeight: 1.8, marginBottom: "2rem" }}>
            Whether you need to convert a{" "}
            <Link href="/pdf-to-word" className="fpt-link">PDF to an editable Word document</Link>,{" "}
            <Link href="/merge-pdf" className="fpt-link">merge multiple PDFs</Link> into one file,{" "}
            <Link href="/compress-pdf" className="fpt-link">compress a large PDF</Link> before emailing it,
            or <Link href="/ocr-pdf" className="fpt-link">extract text from a scanned PDF</Link> using
            OCR — there's a dedicated tool for every task.
          </p>

          {/* 3 feature cards */}
          <div className="fpt-feature-grid">
            <div className="fpt-feature-card">
              <div className="fpt-feature-icon" style={{ background: "#FFF8E6" }}>
                <Zap size={20} color="#D97706" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".4rem" }}>Fast &amp; Simple</h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.7 }}>
                Upload your file, choose the action, download the result. No complicated steps or settings.
              </p>
            </div>
            <div className="fpt-feature-card">
              <div className="fpt-feature-icon" style={{ background: "#EDFAF3" }}>
                <ShieldCheck size={20} color="#1A7F5A" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".4rem" }}>Privacy-Friendly</h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.7 }}>
                Many tools process files locally in your browser. No permanent file storage, no data sharing.
              </p>
            </div>
            <div className="fpt-feature-card">
              <div className="fpt-feature-icon" style={{ background: "#FEF0ED" }}>
                <Globe size={20} color="#E8380D" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".4rem" }}>Works Everywhere</h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.7 }}>
                Fully compatible with Windows, macOS, Linux, Android, and iOS — in any modern browser.
              </p>
            </div>
          </div>

          {/* All tasks list */}
          <div className="fpt-guide-box">
            <h3>All PDF Tasks You Can Complete Here</h3>
            <ul className="fpt-task-list">
              {[
                { label: "Convert documents to PDF:", links: [{ text: "Word to PDF", href: tWordToPdf.href }, { text: "Excel to PDF", href: tExcel.href }, { text: "PPT to PDF", href: tPpt.href }, { text: "Image to PDF", href: tImageToPdf.href }] },
                { label: "Convert PDF to editable formats:", links: [{ text: "PDF to Word (DOCX)", href: tPdfToWord.href }, { text: "PDF to JPG", href: tPdfToJpg.href }] },
                { label: "Extract text from scanned PDFs:", links: [{ text: "OCR PDF", href: tOcr.href }], extra: "— converts image-based scanned pages into selectable, searchable text" },
                { label: "Combine or extract pages:", links: [{ text: "Merge PDF", href: tMerge.href }, { text: "Split PDF", href: tSplit.href }] },
                { label: "Reduce PDF size for email and uploads:", links: [{ text: "Compress PDF", href: tCompress.href }], extra: "— choose compression level, reduce by up to 80%" },
                { label: "Edit and annotate PDFs:", links: [{ text: "Edit PDF", href: tEdit.href }], extra: "— add text, fix typos, insert annotations" },
                { label: "Sign documents digitally:", links: [{ text: "Sign PDF", href: tSign.href }], extra: "— draw, type, or upload your signature" },
                { label: "Brand and protect documents:", links: [{ text: "Add Watermark", href: tWatermark.href }, { text: "Protect PDF", href: tProtect.href }, { text: "Unlock PDF", href: tUnlock.href }] },
                { label: "Fix page orientation:", links: [{ text: "Rotate PDF", href: tRotate.href }], extra: "— fix sideways or upside-down pages" },
              ].map((item, i) => (
                <li key={i}>
                  <span className="fpt-task-dot" />
                  <span>
                    <strong>{item.label}</strong>{" "}
                    {item.links.map((l, j) => (
                      <span key={l.href}>
                        <Link href={l.href} className="fpt-link">{l.text}</Link>
                        {j < item.links.length - 1 && " / "}
                      </span>
                    ))}
                    {item.extra && <span style={{ color: "#888" }}> {item.extra}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Which tool guide */}
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "#111", marginBottom: ".8rem" }}>
            Which PDF Tool Should You Use?
          </h3>
          <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: "1rem" }}>
            Choosing the right tool depends on what you need to accomplish:
          </p>
          <ul className="fpt-guide-list" style={{ marginBottom: "1rem" }}>
            {[
              { text: "Need to edit a PDF?", links: [{ t: "PDF to Word", h: "/pdf-to-word" }, { t: "Edit PDF", h: "/edit-pdf" }], mid: "Convert to Word first with", mid2: ", or edit inline with" },
              { text: "PDF too large to email?", links: [{ t: "Compress PDF", h: "/compress-pdf" }], mid: "Use", extra: "to reduce file size without quality loss" },
              { text: "Need to combine multiple PDFs?", links: [{ t: "Merge PDF", h: "/merge-pdf" }], mid: "Use" },
              { text: "Only need specific pages?", links: [{ t: "Split PDF", h: "/split-pdf" }], mid: "Extract them with" },
              { text: "Have a scanned PDF with unselectable text?", links: [{ t: "OCR PDF", h: "/ocr-pdf" }], mid: "Use", extra: "to make it searchable and editable" },
              { text: "Need to share a Word or Excel file as a stable document?", links: [{ t: "Word to PDF", h: "/word-to-pdf" }, { t: "Excel to PDF", h: "/excel-pdf" }], mid: "Convert to PDF with" },
              { text: "PDF contains sensitive information?", links: [{ t: "Protect PDF", h: "/protect-pdf" }], mid: "Add password protection with" },
            ].map((item, i) => (
              <li key={i}>
                <span className="fpt-guide-dot" />
                <span>
                  <strong>{item.text}</strong>{" "}
                  {item.mid}{" "}
                  {item.links.map((l, j) => (
                    <span key={l.h}>
                      <Link href={l.h} className="fpt-link">{l.t}</Link>
                      {j < item.links.length - 1 && (item.mid2 ? item.mid2 : " / ")}
                    </span>
                  ))}
                  {item.extra && <span style={{ color: "#888" }}> {item.extra}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>
            Browse the categorized tool sections below to find exactly what you need and get started in seconds.
          </p>
        </section>

        <hr className="fpt-divider" />

        {/* ══ CATEGORIZED TOOLS ══ */}
        <section className="fpt-section fpt-fade fpt-d3">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="fpt-eyebrow" style={{ justifyContent: "center" }}>Browse by category</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#111", lineHeight: 1.2 }}>
              All Free PDF Tools <em style={{ fontStyle: "italic", color: "#E8380D" }}>by Category</em>
            </h2>
          </div>

          {toolCategories.map((cat) => (
            <div key={cat.heading}>
              <div className="fpt-cat-header">
                <div className="fpt-cat-icon">{cat.emoji}</div>
                <div>
                  <div className="fpt-cat-title">{cat.heading}</div>
                  <div className="fpt-cat-desc">{cat.desc}</div>
                </div>
              </div>
              <div className="fpt-tool-grid">
                {cat.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="fpt-tool-card">
                    <div className="fpt-tool-emoji">{tool.emoji}</div>
                    <div className="fpt-tool-name">{tool.label}</div>
                    <p className="fpt-tool-desc">{tool.desc}</p>
                    <span className="fpt-tool-cta">Use Tool →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <hr className="fpt-divider" />

        {/* ══ USE CASES ══ */}
        <section className="fpt-section-sm fpt-fade fpt-d2">
          <div className="fpt-eyebrow">Real people, real use cases</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#111", lineHeight: 1.2, marginBottom: "2rem" }}>
            Who Uses PDF Linx <em style={{ fontStyle: "italic", color: "#E8380D" }}>Free Tools?</em>
          </h2>
          <div className="fpt-usecase-grid">
            {useCases.map((item) => (
              <div key={item.title} className="fpt-usecase-card">
                <div className="fpt-usecase-icon">{item.emoji}</div>
                <div>
                  <div className="fpt-usecase-title">{item.title}</div>
                  <p className="fpt-usecase-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="fpt-divider" />

        {/* ══ FAQ ══ */}
        <section className="fpt-section-sm">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="fpt-eyebrow" style={{ justifyContent: "center" }}>Got questions?</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#111", lineHeight: 1.2 }}>
              Frequently Asked <em style={{ fontStyle: "italic", color: "#E8380D" }}>Questions</em>
            </h2>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <details key={i} className="fpt-faq-item">
                <summary>
                  {faq.q}
                  <span className="fpt-faq-plus">+</span>
                </summary>
                <p className="fpt-faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <div className="fpt-cta-band">
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#fff", marginBottom: ".6rem" }}>
            Start Using Free PDF Tools Now
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: "2rem" }}>
            No account needed. No watermarks. No hidden fees. Just fast, private PDF tools.
          </p>
          <div className="fpt-cta-btns">
            <Link href="/pdf-to-word" className="fpt-cta-btn-primary">PDF to Word →</Link>
            <Link href="/compress-pdf" className="fpt-cta-btn-ghost">Compress PDF</Link>
            <Link href="/merge-pdf" className="fpt-cta-btn-ghost">Merge PDF</Link>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "1rem 2rem 3rem" }}>
          All PDF Linx tools work online without installation. Files are processed securely and not stored permanently.
        </p>

      </main>
    </>
  );
}

































// import Link from "next/link";
// import {
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   FilePlus,
//   Scissors,
//   FileMinus,
//   Lock,
//   Unlock,
//   ShieldCheck,
//   Zap,
//   Globe,
//   RotateCw,
//   PenTool,
//   Eye,
//   Stamp,
//   Image,
// } from "lucide-react";

// import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

// const icons = {
//   "pdf-to-word": FileText,
//   "word-to-pdf": FileType,
//   "image-to-pdf": FileImage,
//   "merge-pdf": FilePlus,
//   "split-pdf": Scissors,
//   "compress-pdf": FileMinus,
//   "excel-pdf": FileSpreadsheet,
//   "ppt-to-pdf": FileType,
//   "protect-pdf": Lock,
//   "unlock-pdf": Unlock,
//   "rotate-pdf": RotateCw,
//   "sign-pdf": PenTool,
//   "ocr-pdf": Eye,
//   "edit-pdf": FileText,
//   "add-watermark": Stamp,
//   "pdf-to-jpg": Image,
// };

// export const metadata = {
//   // title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
//   // description:
//   //   "16+ free online PDF tools: convert PDF to Word, merge PDF, compress PDF, split, protect, unlock, rotate, sign, OCR, edit, and add watermark. No signup, no watermark, works on all devices.",
//   title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
//   description:
//     "24+ free online PDF tools: convert PDF to Word, merge PDF, compress PDF, split, protect, unlock, rotate, sign, OCR, edit, watermark, and more. No signup, no watermark, works on all devices.",
//   alternates: {
//     canonical: "https://pdflinx.com/free-pdf-tools",
//   },
//   openGraph: {
//     title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
//     description:
//       "16+ free online PDF tools: convert PDF to Word, merge, split, compress, protect, unlock, rotate, sign, OCR and edit PDFs. No signup required.",
//     url: "https://pdflinx.com/free-pdf-tools",
//   },
// };

// export default function FreePdfToolsPage() {
//   const getTool = (slug, fallbackHref = "#") =>
//     Object.values(pdfToolsMeta).find((t) => t.slug === slug) || {
//       href: fallbackHref,
//       title: "",
//       description: "",
//       slug,
//     };

//   const tPdfToWord = getTool("pdf-to-word", "/pdf-to-word");
//   const tWordToPdf = getTool("word-to-pdf", "/word-to-pdf");
//   const tImageToPdf = getTool("image-to-pdf", "/image-to-pdf");
//   const tMerge = getTool("merge-pdf", "/merge-pdf");
//   const tSplit = getTool("split-pdf", "/split-pdf");
//   const tCompress = getTool("compress-pdf", "/compress-pdf");
//   const tProtect = getTool("protect-pdf", "/protect-pdf");
//   const tUnlock = getTool("unlock-pdf", "/unlock-pdf");
//   const tRotate = getTool("rotate-pdf", "/rotate-pdf");
//   const tSign = getTool("sign-pdf", "/sign-pdf");
//   const tExcel = getTool("excel-pdf", "/excel-pdf");
//   const tPpt = getTool("ppt-to-pdf", "/ppt-to-pdf");
//   const tOcr = getTool("ocr-pdf", "/ocr-pdf");
//   const tEdit = getTool("edit-pdf", "/edit-pdf");
//   const tWatermark = getTool("add-watermark", "/add-watermark");
//   const tPdfToJpg = getTool("pdf-to-jpg", "/pdf-to-jpg");
//   const tPdfToExcel = getTool("pdf-to-excel", "/pdf-to-excel");
//   const tPdfToPng = getTool("pdf-to-png", "/pdf-to-png");
//   const tPdfToText = getTool("pdf-to-text", "/pdf-to-text");
//   const tTextToPdf = getTool("text-to-pdf", "/text-to-pdf");
//   const tHtmlToPdf = getTool("html-to-pdf", "/html-to-pdf");
//   const tRemovePages = getTool("remove-pages", "/remove-pages");
//   const tAddPageNumbers = getTool("add-page-numbers", "/add-page-numbers");
//   const tJpgToPdf = getTool("jpg-to-pdf", "/jpg-to-pdf");

//   const faqJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: [
//       {
//         "@type": "Question",
//         name: "What are free PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "Free PDF tools are browser-based utilities that let you convert, merge, split, compress, protect, unlock, rotate, sign, OCR, edit, and watermark PDF files online without installing software.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Are PDFLinx PDF tools completely free?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "Yes. All 24+ PDFLinx tools are free to use with no signup, no watermark added to your files, and no hidden charges.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Can I use PDF tools on mobile and desktop?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS — no app download required.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Is it safe to use online PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "PDFLinx is designed to be privacy-friendly. Many tools process files directly in your browser without uploading to a server. Files that are uploaded are not stored permanently.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Which PDF tools are most popular?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "The most used tools on PDF Linx are PDF to Word converter, Word to PDF, Compress PDF, Merge PDF, Split PDF, OCR PDF, Protect PDF, Unlock PDF, Rotate PDF, and Sign PDF.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "How do I convert a PDF to Word without losing formatting?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "Upload your PDF to the PDF to Word converter on PDF Linx. The tool preserves fonts, tables, images, and layout in the converted DOCX file. For scanned PDFs, run OCR first to extract the text layer before converting.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "How do I merge or split a PDF online?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "For merging: upload multiple PDF files, reorder them, and click Merge to download a single combined PDF. For splitting: upload one PDF, select the pages or page range you need, and download the extracted pages.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "How do I reduce PDF file size for email?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text: "Use the Compress PDF tool on PDF Linx. Upload your file, choose a compression level, and download the smaller version. Most PDFs can be reduced by 50–80% without significant quality loss.",
//         },
//       },
//     ],
//   };

//   const toolCategories = [
//     {
//       heading: "Convert to PDF",
//       desc: "Turn Word, Excel, PowerPoint, and image files into professional PDF documents.",
//       tools: [
//         { label: "Word to PDF", href: "/word-to-pdf", emoji: "📄", desc: "Convert DOC and DOCX files to PDF. Layout, fonts, and tables preserved." },
//         { label: "Excel to PDF", href: "/excel-pdf", emoji: "📊", desc: "Export XLS and XLSX spreadsheets to clean, print-ready PDF format." },
//         { label: "PPT to PDF", href: "/ppt-to-pdf", emoji: "📽️", desc: "Convert PowerPoint presentations to PDF — slides stay pixel-perfect." },
//         { label: "Image to PDF", href: "/image-to-pdf", emoji: "🖼️", desc: "Combine JPG and PNG images into a single PDF. Supports batch upload." },
//         { label: "JPG to PDF", href: "/jpg-to-pdf", emoji: "🖼️", desc: "Convert JPG images into a PDF document quickly and easily." },
//         { label: "Text to PDF", href: "/text-to-pdf", emoji: "📄", desc: "Convert plain text into a clean PDF document instantly." },
//         { label: "HTML to PDF", href: "/html-to-pdf", emoji: "💻", desc: "Convert HTML content into PDF while preserving layout and structure." },
//       ],
//     },
//     {
//       heading: "Convert from PDF",
//       desc: "Extract content from PDFs and convert to editable or image formats.",
//       tools: [
//         { label: "PDF to Word", href: "/pdf-to-word", emoji: "📝", desc: "Convert PDF to editable DOCX. Formatting, images, and tables preserved." },
//         { label: "PDF to JPG", href: "/pdf-to-jpg", emoji: "🖼️", desc: "Extract PDF pages as high-quality JPG images. Download individually or as ZIP." },
//         { label: "OCR PDF", href: "/ocr-pdf", emoji: "🔍", desc: "Use Optical Character Recognition to extract selectable text from scanned PDFs." },
//         { label: "PDF to Excel", href: "/pdf-to-excel", emoji: "📊", desc: "Extract PDF tables into editable Excel spreadsheets." },
//         { label: "PDF to PNG", href: "/pdf-to-png", emoji: "🖼️", desc: "Convert PDF pages into sharp PNG images with clear quality." },
//         { label: "PDF to Text", href: "/pdf-to-text", emoji: "📝", desc: "Extract plain text from PDF files for copying, editing, and reuse." },
//       ],
//     },
//     {
//       heading: "Organize PDF",
//       desc: "Merge, split, compress, and rotate PDF files to manage documents efficiently.",
//       tools: [
//         { label: "Merge PDF", href: "/merge-pdf", emoji: "🔗", desc: "Combine multiple PDF files into one document. Drag to reorder pages." },
//         { label: "Split PDF", href: "/split-pdf", emoji: "✂️", desc: "Extract specific pages or page ranges from any PDF file." },
//         { label: "Compress PDF", href: "/compress-pdf", emoji: "🗜️", desc: "Reduce PDF file size without losing readability. Choose compression level." },
//         { label: "Rotate PDF", href: "/rotate-pdf", emoji: "🔄", desc: "Fix sideways or upside-down PDF pages. Rotate 90°, 180°, or 270°." },
//         { label: "Remove Pages", href: "/remove-pages", emoji: "🗑️", desc: "Delete specific pages from a PDF and download the cleaned file." },
//         { label: "Add Page Numbers", href: "/add-page-numbers", emoji: "#️⃣", desc: "Insert page numbers into your PDF with custom placement and style." },
//       ],
//     },
//     {
//       heading: "Edit & Secure PDF",
//       desc: "Edit content, add signatures, watermarks, and password protection to PDF documents.",
//       tools: [
//         { label: "Edit PDF", href: "/edit-pdf", emoji: "✏️", desc: "Add text, annotations, and corrections to PDF files directly in your browser." },
//         { label: "Sign PDF", href: "/sign-pdf", emoji: "🖊️", desc: "Add a digital signature to contracts and forms. Draw, type, or upload." },
//         { label: "Add Watermark", href: "/add-watermark", emoji: "💧", desc: "Stamp text or image watermarks onto PDF pages for branding or protection." },
//         { label: "Protect PDF", href: "/protect-pdf", emoji: "🔐", desc: "Add password encryption to sensitive PDF documents before sharing." },
//         { label: "Unlock PDF", href: "/unlock-pdf", emoji: "🔓", desc: "Remove password restrictions from PDF files you own and have access to." },
//       ],
//     },
//   ];

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
//         }}
//       />

//       <main className="max-w-6xl mx-auto px-4 py-12">

//         {/* ── HERO ── */}
//         <section className="text-center mb-14">
//           <span className="inline-block bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-red-100">
//             24+ Free Tools — No Signup Required
//           </span>
//           <h1 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900 leading-tight">
//             Free Online PDF Tools
//           </h1>
//           <p className="text-gray-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
//             PDF Linx is a complete free PDF toolkit — convert PDF to Word, merge PDF files,
//             compress large PDFs, split pages, add digital signatures, run OCR on scanned
//             documents, protect with passwords, and more. No signup, no watermarks, works
//             on every device.
//           </p>
//           <div className="flex flex-wrap justify-center gap-3 text-sm">
//             {["✅ Completely Free", "🔒 Privacy-Friendly", "⚡ Fast Processing", "📱 Works on Mobile", "🚫 No Watermarks"].map((pill) => (
//               <span key={pill} className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 font-medium">
//                 {pill}
//               </span>
//             ))}
//           </div>
//         </section>

//         {/* ── PILLAR CONTENT ── */}
//         <section className="max-w-4xl mx-auto mb-16 text-slate-700">
//           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5">
//             Everything You Need to Work with PDF Files — In One Place
//           </h2>

//           <p className="leading-7 mb-5">
//             PDFs are the most widely used document format in the world — for resumes,
//             invoices, contracts, academic papers, reports, and official forms. But
//             working with PDFs has traditionally required expensive desktop software
//             like Adobe Acrobat. <strong>PDF Linx changes that.</strong> Every tool
//             you need to convert, edit, compress, organize, and secure PDF files is
//             available here for free, directly in your browser — no installation, no
//             account, no cost.
//           </p>

//           <p className="leading-7 mb-5">
//             Whether you need to convert a <Link href="/pdf-to-word" className="text-red-600 font-medium hover:underline">PDF to an editable Word document</Link>,
//             {" "}<Link href="/merge-pdf" className="text-red-600 font-medium hover:underline">merge multiple PDFs</Link> into one file,
//             {" "}<Link href="/compress-pdf" className="text-red-600 font-medium hover:underline">compress a large PDF</Link> before emailing it,
//             or <Link href="/ocr-pdf" className="text-red-600 font-medium hover:underline">extract text from a scanned PDF</Link> using
//             OCR — there's a dedicated tool for every task. All tools are optimized
//             for speed and accuracy, and your files are handled with privacy in mind.
//           </p>

//           <div className="grid sm:grid-cols-3 gap-4 mb-8">
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Zap className="text-red-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Upload your file, choose the action, download the result. No complicated steps or settings.
//               </p>
//             </div>
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck className="text-red-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Privacy-Friendly</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Many tools process files locally in your browser. No permanent file storage, no data sharing.
//               </p>
//             </div>
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Globe className="text-red-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Fully compatible with Windows, macOS, Linux, Android, and iOS — in any modern browser.
//               </p>
//             </div>
//           </div>

//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             All PDF Tasks You Can Complete Here
//           </h3>
//           <ul className="space-y-2.5 list-disc pl-6 mb-8 text-slate-700">
//             <li>
//               <strong>Convert documents to PDF:</strong>{" "}
//               <Link href={tWordToPdf.href} className="text-red-600 font-medium hover:underline">Word to PDF</Link> /{" "}
//               <Link href={tExcel.href} className="text-red-600 font-medium hover:underline">Excel to PDF</Link> /{" "}
//               <Link href={tPpt.href} className="text-red-600 font-medium hover:underline">PPT to PDF</Link> /{" "}
//               <Link href={tImageToPdf.href} className="text-red-600 font-medium hover:underline">Image to PDF</Link>
//             </li>
//             <li>
//               <strong>Convert PDF to editable formats:</strong>{" "}
//               <Link href={tPdfToWord.href} className="text-red-600 font-medium hover:underline">PDF to Word (DOCX)</Link> /{" "}
//               <Link href={tPdfToJpg.href} className="text-red-600 font-medium hover:underline">PDF to JPG</Link>
//             </li>
//             <li>
//               <strong>Extract text from scanned PDFs:</strong>{" "}
//               <Link href={tOcr.href} className="text-red-600 font-medium hover:underline">OCR PDF</Link>{" "}
//               — converts image-based scanned pages into selectable, searchable text
//             </li>
//             <li>
//               <strong>Combine or extract pages:</strong>{" "}
//               <Link href={tMerge.href} className="text-red-600 font-medium hover:underline">Merge PDF</Link> /{" "}
//               <Link href={tSplit.href} className="text-red-600 font-medium hover:underline">Split PDF</Link>
//             </li>
//             <li>
//               <strong>Reduce PDF size for email and uploads:</strong>{" "}
//               <Link href={tCompress.href} className="text-red-600 font-medium hover:underline">Compress PDF</Link>{" "}
//               — choose compression level, reduce by up to 80%
//             </li>
//             <li>
//               <strong>Edit and annotate PDFs:</strong>{" "}
//               <Link href={tEdit.href} className="text-red-600 font-medium hover:underline">Edit PDF</Link> — add text, fix typos, insert annotations
//             </li>
//             <li>
//               <strong>Sign documents digitally:</strong>{" "}
//               <Link href={tSign.href} className="text-red-600 font-medium hover:underline">Sign PDF</Link>{" "}
//               — draw, type, or upload your signature
//             </li>
//             <li>
//               <strong>Brand and protect documents:</strong>{" "}
//               <Link href={tWatermark.href} className="text-red-600 font-medium hover:underline">Add Watermark</Link> /{" "}
//               <Link href={tProtect.href} className="text-red-600 font-medium hover:underline">Protect PDF</Link> /{" "}
//               <Link href={tUnlock.href} className="text-red-600 font-medium hover:underline">Unlock PDF</Link>
//             </li>
//             <li>
//               <strong>Fix page orientation:</strong>{" "}
//               <Link href={tRotate.href} className="text-red-600 font-medium hover:underline">Rotate PDF</Link>{" "}
//               — fix sideways or upside-down pages
//             </li>
//           </ul>

//           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//             Which PDF Tool Should You Use?
//           </h3>
//           <p className="leading-7 mb-3">
//             Choosing the right tool depends on what you need to accomplish:
//           </p>
//           <ul className="space-y-2 list-disc pl-6 mb-5 text-slate-700">
//             <li>Need to <strong>edit a PDF?</strong> Convert to Word first with <Link href="/pdf-to-word" className="text-red-600 hover:underline font-medium">PDF to Word</Link>, or edit inline with <Link href="/edit-pdf" className="text-red-600 hover:underline font-medium">Edit PDF</Link></li>
//             <li>PDF <strong>too large to email?</strong> Use <Link href="/compress-pdf" className="text-red-600 hover:underline font-medium">Compress PDF</Link> to reduce file size without quality loss</li>
//             <li>Need to <strong>combine multiple PDFs?</strong> Use <Link href="/merge-pdf" className="text-red-600 hover:underline font-medium">Merge PDF</Link></li>
//             <li>Only need <strong>specific pages?</strong> Extract them with <Link href="/split-pdf" className="text-red-600 hover:underline font-medium">Split PDF</Link></li>
//             <li>Have a <strong>scanned PDF</strong> with unselectable text? Use <Link href="/ocr-pdf" className="text-red-600 hover:underline font-medium">OCR PDF</Link> to make it searchable and editable</li>
//             <li>Need to <strong>share a Word or Excel file</strong> as a stable document? Convert to PDF with <Link href="/word-to-pdf" className="text-red-600 hover:underline font-medium">Word to PDF</Link> or <Link href="/excel-pdf" className="text-red-600 hover:underline font-medium">Excel to PDF</Link></li>
//             <li>PDF contains <strong>sensitive information?</strong> Add password protection with <Link href="/protect-pdf" className="text-red-600 hover:underline font-medium">Protect PDF</Link></li>
//           </ul>
//           <p className="leading-7 text-slate-600">
//             Browse the categorized tool sections below to find exactly what you need and get started in seconds.
//           </p>
//         </section>

//         {/* ── CATEGORIZED TOOLS ── */}
//         <section className="mb-16">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
//             All Free PDF Tools by Category
//           </h2>

//           <div className="space-y-12">
//             {toolCategories.map((cat) => (
//               <div key={cat.heading}>
//                 <div className="mb-5">
//                   <h3 className="text-xl font-bold text-gray-900">{cat.heading}</h3>
//                   <p className="text-gray-500 text-sm mt-1">{cat.desc}</p>
//                 </div>
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {cat.tools.map((tool) => (
//                     <Link
//                       key={tool.href}
//                       href={tool.href}
//                       className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-red-400 hover:shadow-md transition-all"
//                     >
//                       <div className="text-2xl mb-3">{tool.emoji}</div>
//                       <h4 className="font-semibold text-gray-900 mb-1.5 group-hover:text-red-600 transition">
//                         {tool.label}
//                       </h4>
//                       <p className="text-xs text-gray-500 leading-relaxed mb-3">{tool.desc}</p>
//                       <span className="text-xs font-bold text-red-600">Use Tool →</span>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── USE CASES ── */}
//         <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             Who Uses PDF Linx Free Tools?
//           </h2>
//           <div className="grid sm:grid-cols-2 gap-6">
//             {[
//               {
//                 title: "Students",
//                 text: "Convert lecture notes and course materials from PDF to Word for annotation. Merge assignment pages. Compress files before submitting to university portals.",
//               },
//               {
//                 title: "Office Professionals",
//                 text: "Convert reports and proposals between Word and PDF. Compress large presentations for email. Add password protection to confidential documents.",
//               },
//               {
//                 title: "Freelancers",
//                 text: "Sign contracts digitally without printing. Convert client briefs from PDF to editable DOCX. Add watermarks to design previews and draft documents.",
//               },
//               {
//                 title: "Small Business Owners",
//                 text: "Convert Excel invoices to PDF for professional sharing. Merge multiple receipts for accounting. Protect sensitive financial documents with passwords.",
//               },
//             ].map((item) => (
//               <div key={item.title} className="flex gap-4">
//                 <div className="w-2 bg-red-500 rounded-full shrink-0" />
//                 <div>
//                   <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
//                   <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <section className="max-w-4xl mx-auto mt-4 mb-14">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-3">
//             {[
//               {
//                 q: "Do I need to install any software to use these PDF tools?",
//                 a: "No. All PDF Linx tools work entirely online in your browser — just upload your file, process it, and download the result. No desktop software, no app download required.",
//               },
//               {
//                 q: "How do I convert a PDF to Word without losing formatting?",
//                 a: "Upload your PDF to the PDF to Word converter. The tool preserves fonts, tables, images, and overall layout in the DOCX output. For scanned PDFs, run the OCR PDF tool first to extract the text layer before converting.",
//               },
//               {
//                 q: "How do I reduce PDF file size for email or upload?",
//                 a: "Use the Compress PDF tool. Upload your file, select a compression level, and download the smaller version. PDF files can typically be reduced by 50–80% without significant quality loss.",
//               },
//               {
//                 q: "Can I convert Word, Excel, or PowerPoint files to PDF?",
//                 a: "Yes. PDF Linx supports Word to PDF (DOC and DOCX), Excel to PDF (XLS and XLSX), and PPT to PDF (PPT and PPTX). All conversions preserve formatting, tables, and layout.",
//               },
//               {
//                 q: "What is OCR and when do I need it?",
//                 a: "OCR (Optical Character Recognition) converts scanned PDFs — which are image-based — into searchable and editable text. Use the OCR PDF tool when you can't select or copy text in a PDF, which usually means it's a scanned document.",
//               },
//               {
//                 q: "How do I secure a PDF with a password?",
//                 a: "Use the Protect PDF tool to add password encryption. If you already have permission to access a protected PDF and want to remove the password, use the Unlock PDF tool.",
//               },
//               {
//                 q: "How do I rotate pages or sign a PDF online?",
//                 a: "Use Rotate PDF to fix sideways or upside-down pages — rotate by 90°, 180°, or 270°. Use Sign PDF to add a digital signature by drawing, typing, or uploading your signature image.",
//               },
//               {
//                 q: "Are my uploaded PDF files kept private?",
//                 a: "PDF Linx is designed with privacy in mind. Many tools process files locally in your browser without any server upload. Files that are uploaded for processing are not stored permanently.",
//               },
//             ].map((faq, i) => (
//               <details key={i} className="bg-white rounded-xl border border-gray-200 p-5 group">
//                 <summary className="font-semibold cursor-pointer text-gray-900 list-none flex justify-between items-center">
//                   {faq.q}
//                   <span className="text-red-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
//                 </summary>
//                 <p className="mt-3 text-gray-600 leading-relaxed text-sm">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </section>

//         {/* ── CTA ── */}
//         <section className="text-center bg-linear-to-r from-red-600 to-rose-500 rounded-2xl p-10 mb-8">
//           <h2 className="text-2xl font-bold text-white mb-3">
//             Start Using Free PDF Tools Now
//           </h2>
//           <p className="text-white/80 mb-6">
//             No account needed. No watermarks. No hidden fees. Just fast, private PDF tools.
//           </p>
//           <div className="flex flex-wrap justify-center gap-3">
//             <Link href="/pdf-to-word" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
//               PDF to Word →
//             </Link>
//             <Link href="/compress-pdf" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
//               Compress PDF
//             </Link>
//             <Link href="/merge-pdf" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
//               Merge PDF
//             </Link>
//           </div>
//         </section>

//         <p className="text-sm text-gray-400 text-center">
//           All PDF Linx tools work online without installation. Files are processed securely and not stored permanently.
//         </p>

//       </main>
//     </>
//   );
// }
