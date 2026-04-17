import Link from "next/link";
import {
  FileText,
  FileType,
  FileImage,
  FileSpreadsheet,
  FilePlus,
  Scissors,
  FileMinus,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  Globe,
  RotateCw,
  PenTool,
  Eye,
  Stamp,
  Image,
} from "lucide-react";

import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

const icons = {
  "pdf-to-word": FileText,
  "word-to-pdf": FileType,
  "image-to-pdf": FileImage,
  "merge-pdf": FilePlus,
  "split-pdf": Scissors,
  "compress-pdf": FileMinus,
  "excel-pdf": FileSpreadsheet,
  "ppt-to-pdf": FileType,
  "protect-pdf": Lock,
  "unlock-pdf": Unlock,
  "rotate-pdf": RotateCw,
  "sign-pdf": PenTool,
  "ocr-pdf": Eye,
  "edit-pdf": FileText,
  "add-watermark": Stamp,
  "pdf-to-jpg": Image,
};

export const metadata = {
  // title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
  // description:
  //   "16+ free online PDF tools: convert PDF to Word, merge PDF, compress PDF, split, protect, unlock, rotate, sign, OCR, edit, and add watermark. No signup, no watermark, works on all devices.",
  title: "Free PDF Tools – Convert, Merge, Compress, Sign & Edit PDFs Online | PDF Linx",
  description:
    "24+ free online PDF tools: convert PDF to Word, merge PDF, compress PDF, split, protect, unlock, rotate, sign, OCR, edit, watermark, and more. No signup, no watermark, works on all devices.",
  alternates: {
    canonical: "https://pdflinx.com/free-pdf-tools",
  },
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
      href: fallbackHref,
      title: "",
      description: "",
      slug,
    };

  const tPdfToWord = getTool("pdf-to-word", "/pdf-to-word");
  const tWordToPdf = getTool("word-to-pdf", "/word-to-pdf");
  const tImageToPdf = getTool("image-to-pdf", "/image-to-pdf");
  const tMerge = getTool("merge-pdf", "/merge-pdf");
  const tSplit = getTool("split-pdf", "/split-pdf");
  const tCompress = getTool("compress-pdf", "/compress-pdf");
  const tProtect = getTool("protect-pdf", "/protect-pdf");
  const tUnlock = getTool("unlock-pdf", "/unlock-pdf");
  const tRotate = getTool("rotate-pdf", "/rotate-pdf");
  const tSign = getTool("sign-pdf", "/sign-pdf");
  const tExcel = getTool("excel-pdf", "/excel-pdf");
  const tPpt = getTool("ppt-to-pdf", "/ppt-to-pdf");
  const tOcr = getTool("ocr-pdf", "/ocr-pdf");
  const tEdit = getTool("edit-pdf", "/edit-pdf");
  const tWatermark = getTool("add-watermark", "/add-watermark");
  const tPdfToJpg = getTool("pdf-to-jpg", "/pdf-to-jpg");
  const tPdfToExcel = getTool("pdf-to-excel", "/pdf-to-excel");
  const tPdfToPng = getTool("pdf-to-png", "/pdf-to-png");
  const tPdfToText = getTool("pdf-to-text", "/pdf-to-text");
  const tTextToPdf = getTool("text-to-pdf", "/text-to-pdf");
  const tHtmlToPdf = getTool("html-to-pdf", "/html-to-pdf");
  const tRemovePages = getTool("remove-pages", "/remove-pages");
  const tAddPageNumbers = getTool("add-page-numbers", "/add-page-numbers");
  const tJpgToPdf = getTool("jpg-to-pdf", "/jpg-to-pdf");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are free PDF tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Free PDF tools are browser-based utilities that let you convert, merge, split, compress, protect, unlock, rotate, sign, OCR, edit, and watermark PDF files online without installing software.",
        },
      },
      {
        "@type": "Question",
        name: "Are PDFLinx PDF tools completely free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All 24+ PDFLinx tools are free to use with no signup, no watermark added to your files, and no hidden charges.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use PDF tools on mobile and desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS — no app download required.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use online PDF tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PDFLinx is designed to be privacy-friendly. Many tools process files directly in your browser without uploading to a server. Files that are uploaded are not stored permanently.",
        },
      },
      {
        "@type": "Question",
        name: "Which PDF tools are most popular?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most used tools on PDF Linx are PDF to Word converter, Word to PDF, Compress PDF, Merge PDF, Split PDF, OCR PDF, Protect PDF, Unlock PDF, Rotate PDF, and Sign PDF.",
        },
      },
      {
        "@type": "Question",
        name: "How do I convert a PDF to Word without losing formatting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your PDF to the PDF to Word converter on PDF Linx. The tool preserves fonts, tables, images, and layout in the converted DOCX file. For scanned PDFs, run OCR first to extract the text layer before converting.",
        },
      },
      {
        "@type": "Question",
        name: "How do I merge or split a PDF online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For merging: upload multiple PDF files, reorder them, and click Merge to download a single combined PDF. For splitting: upload one PDF, select the pages or page range you need, and download the extracted pages.",
        },
      },
      {
        "@type": "Question",
        name: "How do I reduce PDF file size for email?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the Compress PDF tool on PDF Linx. Upload your file, choose a compression level, and download the smaller version. Most PDFs can be reduced by 50–80% without significant quality loss.",
        },
      },
    ],
  };

  const toolCategories = [
    {
      heading: "Convert to PDF",
      desc: "Turn Word, Excel, PowerPoint, and image files into professional PDF documents.",
      tools: [
        { label: "Word to PDF", href: "/word-to-pdf", emoji: "📄", desc: "Convert DOC and DOCX files to PDF. Layout, fonts, and tables preserved." },
        { label: "Excel to PDF", href: "/excel-pdf", emoji: "📊", desc: "Export XLS and XLSX spreadsheets to clean, print-ready PDF format." },
        { label: "PPT to PDF", href: "/ppt-to-pdf", emoji: "📽️", desc: "Convert PowerPoint presentations to PDF — slides stay pixel-perfect." },
        { label: "Image to PDF", href: "/image-to-pdf", emoji: "🖼️", desc: "Combine JPG and PNG images into a single PDF. Supports batch upload." },
        { label: "JPG to PDF", href: "/jpg-to-pdf", emoji: "🖼️", desc: "Convert JPG images into a PDF document quickly and easily." },
        { label: "Text to PDF", href: "/text-to-pdf", emoji: "📄", desc: "Convert plain text into a clean PDF document instantly." },
        { label: "HTML to PDF", href: "/html-to-pdf", emoji: "💻", desc: "Convert HTML content into PDF while preserving layout and structure." },
      ],
    },
    {
      heading: "Convert from PDF",
      desc: "Extract content from PDFs and convert to editable or image formats.",
      tools: [
        { label: "PDF to Word", href: "/pdf-to-word", emoji: "📝", desc: "Convert PDF to editable DOCX. Formatting, images, and tables preserved." },
        { label: "PDF to JPG", href: "/pdf-to-jpg", emoji: "🖼️", desc: "Extract PDF pages as high-quality JPG images. Download individually or as ZIP." },
        { label: "OCR PDF", href: "/ocr-pdf", emoji: "🔍", desc: "Use Optical Character Recognition to extract selectable text from scanned PDFs." },
        { label: "PDF to Excel", href: "/pdf-to-excel", emoji: "📊", desc: "Extract PDF tables into editable Excel spreadsheets." },
        { label: "PDF to PNG", href: "/pdf-to-png", emoji: "🖼️", desc: "Convert PDF pages into sharp PNG images with clear quality." },
        { label: "PDF to Text", href: "/pdf-to-text", emoji: "📝", desc: "Extract plain text from PDF files for copying, editing, and reuse." },
      ],
    },
    {
      heading: "Organize PDF",
      desc: "Merge, split, compress, and rotate PDF files to manage documents efficiently.",
      tools: [
        { label: "Merge PDF", href: "/merge-pdf", emoji: "🔗", desc: "Combine multiple PDF files into one document. Drag to reorder pages." },
        { label: "Split PDF", href: "/split-pdf", emoji: "✂️", desc: "Extract specific pages or page ranges from any PDF file." },
        { label: "Compress PDF", href: "/compress-pdf", emoji: "🗜️", desc: "Reduce PDF file size without losing readability. Choose compression level." },
        { label: "Rotate PDF", href: "/rotate-pdf", emoji: "🔄", desc: "Fix sideways or upside-down PDF pages. Rotate 90°, 180°, or 270°." },
        { label: "Remove Pages", href: "/remove-pages", emoji: "🗑️", desc: "Delete specific pages from a PDF and download the cleaned file." },
        { label: "Add Page Numbers", href: "/add-page-numbers", emoji: "#️⃣", desc: "Insert page numbers into your PDF with custom placement and style." },
      ],
    },
    {
      heading: "Edit & Secure PDF",
      desc: "Edit content, add signatures, watermarks, and password protection to PDF documents.",
      tools: [
        { label: "Edit PDF", href: "/edit-pdf", emoji: "✏️", desc: "Add text, annotations, and corrections to PDF files directly in your browser." },
        { label: "Sign PDF", href: "/sign-pdf", emoji: "🖊️", desc: "Add a digital signature to contracts and forms. Draw, type, or upload." },
        { label: "Add Watermark", href: "/add-watermark", emoji: "💧", desc: "Stamp text or image watermarks onto PDF pages for branding or protection." },
        { label: "Protect PDF", href: "/protect-pdf", emoji: "🔐", desc: "Add password encryption to sensitive PDF documents before sharing." },
        { label: "Unlock PDF", href: "/unlock-pdf", emoji: "🔓", desc: "Remove password restrictions from PDF files you own and have access to." },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* ── HERO ── */}
        <section className="text-center mb-14">
          <span className="inline-block bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-red-100">
            24+ Free Tools — No Signup Required
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900 leading-tight">
            Free Online PDF Tools
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
            PDF Linx is a complete free PDF toolkit — convert PDF to Word, merge PDF files,
            compress large PDFs, split pages, add digital signatures, run OCR on scanned
            documents, protect with passwords, and more. No signup, no watermarks, works
            on every device.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {["✅ Completely Free", "🔒 Privacy-Friendly", "⚡ Fast Processing", "📱 Works on Mobile", "🚫 No Watermarks"].map((pill) => (
              <span key={pill} className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 font-medium">
                {pill}
              </span>
            ))}
          </div>
        </section>

        {/* ── PILLAR CONTENT ── */}
        <section className="max-w-4xl mx-auto mb-16 text-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5">
            Everything You Need to Work with PDF Files — In One Place
          </h2>

          <p className="leading-7 mb-5">
            PDFs are the most widely used document format in the world — for resumes,
            invoices, contracts, academic papers, reports, and official forms. But
            working with PDFs has traditionally required expensive desktop software
            like Adobe Acrobat. <strong>PDF Linx changes that.</strong> Every tool
            you need to convert, edit, compress, organize, and secure PDF files is
            available here for free, directly in your browser — no installation, no
            account, no cost.
          </p>

          <p className="leading-7 mb-5">
            Whether you need to convert a <Link href="/pdf-to-word" className="text-red-600 font-medium hover:underline">PDF to an editable Word document</Link>,
            {" "}<Link href="/merge-pdf" className="text-red-600 font-medium hover:underline">merge multiple PDFs</Link> into one file,
            {" "}<Link href="/compress-pdf" className="text-red-600 font-medium hover:underline">compress a large PDF</Link> before emailing it,
            or <Link href="/ocr-pdf" className="text-red-600 font-medium hover:underline">extract text from a scanned PDF</Link> using
            OCR — there's a dedicated tool for every task. All tools are optimized
            for speed and accuracy, and your files are handled with privacy in mind.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-red-600" size={18} />
                <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Upload your file, choose the action, download the result. No complicated steps or settings.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-red-600" size={18} />
                <h3 className="font-semibold text-slate-900">Privacy-Friendly</h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Many tools process files locally in your browser. No permanent file storage, no data sharing.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="text-red-600" size={18} />
                <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
              </div>
              <p className="text-sm text-slate-600 leading-6">
                Fully compatible with Windows, macOS, Linux, Android, and iOS — in any modern browser.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            All PDF Tasks You Can Complete Here
          </h3>
          <ul className="space-y-2.5 list-disc pl-6 mb-8 text-slate-700">
            <li>
              <strong>Convert documents to PDF:</strong>{" "}
              <Link href={tWordToPdf.href} className="text-red-600 font-medium hover:underline">Word to PDF</Link> /{" "}
              <Link href={tExcel.href} className="text-red-600 font-medium hover:underline">Excel to PDF</Link> /{" "}
              <Link href={tPpt.href} className="text-red-600 font-medium hover:underline">PPT to PDF</Link> /{" "}
              <Link href={tImageToPdf.href} className="text-red-600 font-medium hover:underline">Image to PDF</Link>
            </li>
            <li>
              <strong>Convert PDF to editable formats:</strong>{" "}
              <Link href={tPdfToWord.href} className="text-red-600 font-medium hover:underline">PDF to Word (DOCX)</Link> /{" "}
              <Link href={tPdfToJpg.href} className="text-red-600 font-medium hover:underline">PDF to JPG</Link>
            </li>
            <li>
              <strong>Extract text from scanned PDFs:</strong>{" "}
              <Link href={tOcr.href} className="text-red-600 font-medium hover:underline">OCR PDF</Link>{" "}
              — converts image-based scanned pages into selectable, searchable text
            </li>
            <li>
              <strong>Combine or extract pages:</strong>{" "}
              <Link href={tMerge.href} className="text-red-600 font-medium hover:underline">Merge PDF</Link> /{" "}
              <Link href={tSplit.href} className="text-red-600 font-medium hover:underline">Split PDF</Link>
            </li>
            <li>
              <strong>Reduce PDF size for email and uploads:</strong>{" "}
              <Link href={tCompress.href} className="text-red-600 font-medium hover:underline">Compress PDF</Link>{" "}
              — choose compression level, reduce by up to 80%
            </li>
            <li>
              <strong>Edit and annotate PDFs:</strong>{" "}
              <Link href={tEdit.href} className="text-red-600 font-medium hover:underline">Edit PDF</Link> — add text, fix typos, insert annotations
            </li>
            <li>
              <strong>Sign documents digitally:</strong>{" "}
              <Link href={tSign.href} className="text-red-600 font-medium hover:underline">Sign PDF</Link>{" "}
              — draw, type, or upload your signature
            </li>
            <li>
              <strong>Brand and protect documents:</strong>{" "}
              <Link href={tWatermark.href} className="text-red-600 font-medium hover:underline">Add Watermark</Link> /{" "}
              <Link href={tProtect.href} className="text-red-600 font-medium hover:underline">Protect PDF</Link> /{" "}
              <Link href={tUnlock.href} className="text-red-600 font-medium hover:underline">Unlock PDF</Link>
            </li>
            <li>
              <strong>Fix page orientation:</strong>{" "}
              <Link href={tRotate.href} className="text-red-600 font-medium hover:underline">Rotate PDF</Link>{" "}
              — fix sideways or upside-down pages
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Which PDF Tool Should You Use?
          </h3>
          <p className="leading-7 mb-3">
            Choosing the right tool depends on what you need to accomplish:
          </p>
          <ul className="space-y-2 list-disc pl-6 mb-5 text-slate-700">
            <li>Need to <strong>edit a PDF?</strong> Convert to Word first with <Link href="/pdf-to-word" className="text-red-600 hover:underline font-medium">PDF to Word</Link>, or edit inline with <Link href="/edit-pdf" className="text-red-600 hover:underline font-medium">Edit PDF</Link></li>
            <li>PDF <strong>too large to email?</strong> Use <Link href="/compress-pdf" className="text-red-600 hover:underline font-medium">Compress PDF</Link> to reduce file size without quality loss</li>
            <li>Need to <strong>combine multiple PDFs?</strong> Use <Link href="/merge-pdf" className="text-red-600 hover:underline font-medium">Merge PDF</Link></li>
            <li>Only need <strong>specific pages?</strong> Extract them with <Link href="/split-pdf" className="text-red-600 hover:underline font-medium">Split PDF</Link></li>
            <li>Have a <strong>scanned PDF</strong> with unselectable text? Use <Link href="/ocr-pdf" className="text-red-600 hover:underline font-medium">OCR PDF</Link> to make it searchable and editable</li>
            <li>Need to <strong>share a Word or Excel file</strong> as a stable document? Convert to PDF with <Link href="/word-to-pdf" className="text-red-600 hover:underline font-medium">Word to PDF</Link> or <Link href="/excel-pdf" className="text-red-600 hover:underline font-medium">Excel to PDF</Link></li>
            <li>PDF contains <strong>sensitive information?</strong> Add password protection with <Link href="/protect-pdf" className="text-red-600 hover:underline font-medium">Protect PDF</Link></li>
          </ul>
          <p className="leading-7 text-slate-600">
            Browse the categorized tool sections below to find exactly what you need and get started in seconds.
          </p>
        </section>

        {/* ── CATEGORIZED TOOLS ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            All Free PDF Tools by Category
          </h2>

          <div className="space-y-12">
            {toolCategories.map((cat) => (
              <div key={cat.heading}>
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-gray-900">{cat.heading}</h3>
                  <p className="text-gray-500 text-sm mt-1">{cat.desc}</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-red-400 hover:shadow-md transition-all"
                    >
                      <div className="text-2xl mb-3">{tool.emoji}</div>
                      <h4 className="font-semibold text-gray-900 mb-1.5 group-hover:text-red-600 transition">
                        {tool.label}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{tool.desc}</p>
                      <span className="text-xs font-bold text-red-600">Use Tool →</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Who Uses PDF Linx Free Tools?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Students",
                text: "Convert lecture notes and course materials from PDF to Word for annotation. Merge assignment pages. Compress files before submitting to university portals.",
              },
              {
                title: "Office Professionals",
                text: "Convert reports and proposals between Word and PDF. Compress large presentations for email. Add password protection to confidential documents.",
              },
              {
                title: "Freelancers",
                text: "Sign contracts digitally without printing. Convert client briefs from PDF to editable DOCX. Add watermarks to design previews and draft documents.",
              },
              {
                title: "Small Business Owners",
                text: "Convert Excel invoices to PDF for professional sharing. Merge multiple receipts for accounting. Protect sensitive financial documents with passwords.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-2 bg-red-500 rounded-full shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-4xl mx-auto mt-4 mb-14">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Do I need to install any software to use these PDF tools?",
                a: "No. All PDF Linx tools work entirely online in your browser — just upload your file, process it, and download the result. No desktop software, no app download required.",
              },
              {
                q: "How do I convert a PDF to Word without losing formatting?",
                a: "Upload your PDF to the PDF to Word converter. The tool preserves fonts, tables, images, and overall layout in the DOCX output. For scanned PDFs, run the OCR PDF tool first to extract the text layer before converting.",
              },
              {
                q: "How do I reduce PDF file size for email or upload?",
                a: "Use the Compress PDF tool. Upload your file, select a compression level, and download the smaller version. PDF files can typically be reduced by 50–80% without significant quality loss.",
              },
              {
                q: "Can I convert Word, Excel, or PowerPoint files to PDF?",
                a: "Yes. PDF Linx supports Word to PDF (DOC and DOCX), Excel to PDF (XLS and XLSX), and PPT to PDF (PPT and PPTX). All conversions preserve formatting, tables, and layout.",
              },
              {
                q: "What is OCR and when do I need it?",
                a: "OCR (Optical Character Recognition) converts scanned PDFs — which are image-based — into searchable and editable text. Use the OCR PDF tool when you can't select or copy text in a PDF, which usually means it's a scanned document.",
              },
              {
                q: "How do I secure a PDF with a password?",
                a: "Use the Protect PDF tool to add password encryption. If you already have permission to access a protected PDF and want to remove the password, use the Unlock PDF tool.",
              },
              {
                q: "How do I rotate pages or sign a PDF online?",
                a: "Use Rotate PDF to fix sideways or upside-down pages — rotate by 90°, 180°, or 270°. Use Sign PDF to add a digital signature by drawing, typing, or uploading your signature image.",
              },
              {
                q: "Are my uploaded PDF files kept private?",
                a: "PDF Linx is designed with privacy in mind. Many tools process files locally in your browser without any server upload. Files that are uploaded for processing are not stored permanently.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 p-5 group">
                <summary className="font-semibold cursor-pointer text-gray-900 list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-red-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="text-center bg-linear-to-r from-red-600 to-rose-500 rounded-2xl p-10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Start Using Free PDF Tools Now
          </h2>
          <p className="text-white/80 mb-6">
            No account needed. No watermarks. No hidden fees. Just fast, private PDF tools.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pdf-to-word" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
              PDF to Word →
            </Link>
            <Link href="/compress-pdf" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
              Compress PDF
            </Link>
            <Link href="/merge-pdf" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
              Merge PDF
            </Link>
          </div>
        </section>

        <p className="text-sm text-gray-400 text-center">
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
// };

// export const metadata = {
//   title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
//   description:
//     "Use PDFLinx free online PDF tools to convert, merge, split, compress, protect, unlock, rotate, and sign PDFs instantly. No signup, no watermark, works on all devices.",
//   alternates: {
//     canonical: "https://pdflinx.com/free-pdf-tools",
//   },
//   openGraph: {
//     title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
//     description:
//       "Free online PDF tools: convert, merge, split, compress, protect, unlock, rotate and sign PDFs. No signup required.",
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

//   const faqJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: [
//       {
//         "@type": "Question",
//         name: "What are free PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Free PDF tools help you convert, merge, split, compress, protect, unlock, rotate, and sign PDF files online without installing software.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Are PDFLinx PDF tools completely free?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Yes. PDFLinx tools are free to use with no signup, no watermark, and no hidden charges.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Can I use PDF tools on mobile and desktop?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Is it safe to use online PDF tools?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "PDFLinx is designed to be privacy-friendly. Your files are processed to produce the output and are not meant to be stored permanently.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "Which PDF tools are most popular?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Popular tools include Word to PDF, PDF to Word, Compress PDF, Merge PDF, Split PDF, Protect PDF, Unlock PDF, Rotate PDF, and Sign PDF.",
//         },
//       },
//       {
//         "@type": "Question",
//         name: "How do I merge or split a PDF online?",
//         acceptedAnswer: {
//           "@type": "Answer",
//           text:
//             "Upload your PDF, choose merge or split options, and download the result instantly. No account required.",
//         },
//       },
//     ],
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
//         }}
//       />

//       <main className="max-w-6xl mx-auto px-4 py-12">
//         {/* HERO */}
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">
//           Free Online PDF Tools
//         </h1>

//         <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
//           PDFLinx offers a complete collection of free online PDF tools to help
//           you convert, merge, compress, protect, unlock, rotate, and sign PDF
//           files instantly. No signup required, no watermark, and works on all
//           devices.
//         </p>

//         {/* SEO PILLAR CONTENT (HUB) */}
//         <section className="max-w-4xl mx-auto mb-12 text-slate-700">
//           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
//             PDF Tools Online Free – Convert, Edit, Compress & Secure PDFs in One
//             Place
//           </h2>

//           <p className="leading-7 mb-5">
//             PDFs are everywhere — resumes, invoices, assignments, contracts, and
//             reports. But editing or sharing PDFs can be annoying when a file is
//             too large, password-protected, or needs a quick format change.
//             That’s where{" "}
//             <span className="font-medium text-slate-900">
//               PDFLinx Free PDF Tools
//             </span>{" "}
//             help. Use our web-based toolkit to convert documents to PDF,
//             convert PDFs back to editable formats, merge and split pages,
//             compress size for email, rotate pages, sign documents, and add
//             security for sensitive files — all in your browser.
//           </p>

//           <div className="grid sm:grid-cols-3 gap-4 mb-6">
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Zap className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Upload → choose action → download. No complicated steps.
//               </p>
//             </div>

//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <ShieldCheck className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">
//                   Privacy-Friendly
//                 </h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Designed for safe processing — no signup required to use tools.
//               </p>
//             </div>

//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Globe className="text-indigo-600" size={18} />
//                 <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
//               </div>
//               <p className="text-sm text-slate-600 leading-6">
//                 Use on Windows, macOS, Linux, Android, and iOS in your browser.
//               </p>
//             </div>
//           </div>

//           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//             Popular PDF Tasks You Can Do Here
//           </h3>
//           <ul className="space-y-2 list-disc pl-6 mb-6">
//             <li>
//               Convert documents to PDF:{" "}
//               <Link
//                 href={tWordToPdf.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Word to PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tExcel.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Excel to PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tPpt.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 PPT to PDF
//               </Link>
//             </li>
//             <li>
//               Convert PDF to editable formats:{" "}
//               <Link
//                 href={tPdfToWord.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 PDF to Word
//               </Link>
//             </li>
//             <li>
//               Combine or extract pages:{" "}
//               <Link
//                 href={tMerge.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Merge PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tSplit.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Split PDF
//               </Link>
//             </li>
//             <li>
//               Reduce PDF size for email & sharing:{" "}
//               <Link
//                 href={tCompress.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Compress PDF
//               </Link>
//             </li>
//             <li>
//               Secure & edit documents:{" "}
//               <Link
//                 href={tProtect.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Protect PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tUnlock.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Unlock PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tRotate.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Rotate PDF
//               </Link>{" "}
//               /{" "}
//               <Link
//                 href={tSign.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Sign PDF
//               </Link>
//             </li>
//             <li>
//               Convert images into PDF:{" "}
//               <Link
//                 href={tImageToPdf.href}
//                 className="text-indigo-600 font-medium hover:underline"
//               >
//                 Image to PDF
//               </Link>
//             </li>
//           </ul>

//           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//             Which PDF Tool Should You Use?
//           </h3>
//           <p className="leading-7 mb-2">
//             If your goal is sharing or printing, convert files to PDF. If you need
//             editing, convert a PDF back to Word. If your PDF is too large,
//             compress it. If it contains multiple documents, merge them. If you only
//             need certain pages, split it. And if the file is sensitive, add
//             password protection. You can also rotate pages to fix orientation and
//             sign documents online.
//           </p>
//           <p className="leading-7">
//             This hub page helps you find the right PDF tool quickly — choose a
//             tool below and get started.
//           </p>
//         </section>

//         {/* TOP TOOLS */}
//         <section className="mb-14">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
//             Most Popular PDF Tools
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {[
//               { title: "Word to PDF", url: "/word-to-pdf", emoji: "📄" },
//               { title: "PDF to Word", url: "/pdf-to-word", emoji: "📝" },
//               { title: "Protect PDF", url: "/protect-pdf", emoji: "🔐" },
//               { title: "Compress PDF", url: "/compress-pdf", emoji: "🗜️" },
//             ].map((tool) => (
//               <Link
//                 key={tool.url}
//                 href={tool.url}
//                 className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition text-center"
//               >
//                 <div className="text-3xl mb-2">{tool.emoji}</div>
//                 <h3 className="font-semibold text-gray-800">{tool.title}</h3>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* ALL TOOLS GRID */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
//             All PDF Tools
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Object.values(pdfToolsMeta).map((tool) => {
//               const Icon = icons[tool.slug] || FileText;

//               return (
//                 <Link
//                   key={tool.slug}
//                   href={tool.href}
//                   className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
//                 >
//                   <div className="flex items-center gap-4 mb-3">
//                     <Icon size={28} className="text-indigo-600" />
//                     <h3 className="text-lg font-semibold group-hover:text-indigo-600">
//                       {tool.title.replace(" | PDF Linx", "")}
//                     </h3>
//                   </div>

//                   <p className="text-sm text-gray-600">{tool.description}</p>

//                   <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
//                     Use tool →
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* EXTRA SEO MINI-FAQ (VISIBLE) */}
//         <section className="max-w-4xl mx-auto mt-14">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No. All PDFLinx tools work online in your browser — just upload,
//                 process, and download.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Which tool should I use to reduce PDF size?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Use{" "}
//                 <Link
//                   href={tCompress.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Compress PDF
//                 </Link>{" "}
//                 to reduce file size for email, WhatsApp, or faster uploads.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert Word, Excel, or PowerPoint to PDF?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — try{" "}
//                 <Link
//                   href={tWordToPdf.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Word to PDF
//                 </Link>
//                 ,{" "}
//                 <Link
//                   href={tExcel.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Excel to PDF
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href={tPpt.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   PPT to PDF
//                 </Link>
//                 .
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How do I secure a PDF with a password?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Use{" "}
//                 <Link
//                   href={tProtect.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Protect PDF
//                 </Link>{" "}
//                 to add password protection. If you own the file and need access,
//                 use{" "}
//                 <Link
//                   href={tUnlock.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Unlock PDF
//                 </Link>
//                 .
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 How do I rotate pages or sign a PDF online?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Use{" "}
//                 <Link
//                   href={tRotate.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Rotate PDF
//                 </Link>{" "}
//                 to fix page orientation, and{" "}
//                 <Link
//                   href={tSign.href}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   Sign PDF
//                 </Link>{" "}
//                 to add your signature securely online.
//               </p>
//             </details>
//           </div>
//         </section>

//         {/* FOOTER NOTE */}
//         <p className="text-sm text-gray-500 text-center mt-12">
//           All tools work online without installation. Files are processed securely
//           and removed automatically for your privacy.
//         </p>
//       </main>
//     </>
//   );
// }























// // import Link from "next/link";
// // import {
// //   FileText,
// //   FileType,
// //   FileImage,
// //   FileSpreadsheet,
// //   FilePlus,
// //   Scissors,
// //   FileMinus,
// //   Lock,
// //   Unlock,
// //   ShieldCheck,
// //   Zap,
// //   Globe,
// // } from "lucide-react";

// // import { pdfToolsMeta } from "@/lib/pdfToolsMeta";

// // const icons = {
// //   "pdf-to-word": FileText,
// //   "word-to-pdf": FileType,
// //   "image-to-pdf": FileImage,
// //   "merge-pdf": FilePlus,
// //   "split-pdf": Scissors,
// //   "compress-pdf": FileMinus,
// //   "excel-pdf": FileSpreadsheet,
// //   "ppt-to-pdf": FileType,
// //   "protect-pdf": Lock,
// //   "unlock-pdf": Unlock,
// // };

// // export const metadata = {
// //   title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
// //   description:
// //     "Use PDFLinx free online PDF tools to convert, merge, split, compress, protect, and unlock PDFs instantly. No signup, no watermark, works on all devices.",
// //   alternates: {
// //     canonical: "https://pdflinx.com/free-pdf-tools",
// //   },
// //   // Optional: openGraph add kar sakte ho agar chahiye
// //   openGraph: {
// //     title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
// //     description:
// //       "Free online PDF tools: convert, merge, split, compress, protect PDFs. No signup required.",
// //     url: "https://pdflinx.com/free-pdf-tools",
// //   },
// // };

// // export default function FreePdfToolsPage() {
// //   const getTool = (slug, fallbackHref = "#") =>
// //     Object.values(pdfToolsMeta).find((t) => t.slug === slug) || {
// //       href: fallbackHref,
// //       title: "",
// //       description: "",
// //       slug,
// //     };

// //   const tPdfToWord = getTool("pdf-to-word", "/pdf-to-word");
// //   const tWordToPdf = getTool("word-to-pdf", "/word-to-pdf");
// //   const tImageToPdf = getTool("image-to-pdf", "/image-to-pdf");
// //   const tMerge = getTool("merge-pdf", "/merge-pdf");
// //   const tSplit = getTool("split-pdf", "/split-pdf");
// //   const tCompress = getTool("compress-pdf", "/compress-pdf");
// //   const tProtect = getTool("protect-pdf", "/protect-pdf");
// //   const tUnlock = getTool("unlock-pdf", "/unlock-pdf");
// //   const tExcel = getTool("excel-pdf", "/excel-pdf");
// //   const tPpt = getTool("ppt-to-pdf", "/ppt-to-pdf");

// //   const faqJsonLd = {
// //     "@context": "https://schema.org",
// //     "@type": "FAQPage",
// //     mainEntity: [
// //       {
// //         "@type": "Question",
// //         name: "What are free PDF tools?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "Free PDF tools help you convert, merge, split, compress, protect, and unlock PDF files online without installing software.",
// //         },
// //       },
// //       {
// //         "@type": "Question",
// //         name: "Are PDFLinx PDF tools completely free?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "Yes. PDFLinx tools are free to use with no signup, no watermark, and no hidden charges.",
// //         },
// //       },
// //       {
// //         "@type": "Question",
// //         name: "Can I use PDF tools on mobile and desktop?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "Yes. PDFLinx works in your browser on Windows, macOS, Linux, Android, and iOS.",
// //         },
// //       },
// //       {
// //         "@type": "Question",
// //         name: "Is it safe to use online PDF tools?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "PDFLinx is designed to be privacy-friendly. Your files are processed to produce the output and are not meant to be stored permanently.",
// //         },
// //       },
// //       {
// //         "@type": "Question",
// //         name: "Which PDF tools are most popular?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "Popular tools include Word to PDF, PDF to Word, Compress PDF, Merge PDF, Split PDF, Protect PDF, and Unlock PDF.",
// //         },
// //       },
// //       {
// //         "@type": "Question",
// //         name: "How do I merge or split a PDF online?",
// //         acceptedAnswer: {
// //           "@type": "Answer",
// //           text:
// //             "Upload your PDF, choose merge or split options, and download the result instantly. No account required.",
// //         },
// //       },
// //     ],
// //   };

// //   return (
// //     <>
// //       {/* FAQ Schema - safe server-side */}
// //       <script
// //         type="application/ld+json"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
// //         }}
// //       />

// //       <main className="max-w-6xl mx-auto px-4 py-12">
// //         {/* HERO */}
// //         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">
// //           Free Online PDF Tools
// //         </h1>

// //         <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
// //           PDFLinx offers a complete collection of free online PDF tools to help you
// //           convert, merge, compress, protect, and unlock PDF files instantly.
// //           No signup required, no watermark, and works on all devices.
// //         </p>

// //         {/* SEO PILLAR CONTENT (HUB) */}
// //         <section className="max-w-4xl mx-auto mb-12 text-slate-700">
// //           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
// //             PDF Tools Online Free – Convert, Edit, Compress & Secure PDFs in One Place
// //           </h2>

// //           <p className="leading-7 mb-5">
// //             PDFs are everywhere — resumes, invoices, assignments, contracts, and reports. But editing or sharing PDFs can
// //             be annoying when a file is too large, password-protected, or needs a quick format change. That’s where{" "}
// //             <span className="font-medium text-slate-900">PDFLinx Free PDF Tools</span> help.
// //             Use our web-based toolkit to convert documents to PDF, convert PDFs back to editable formats, merge and split
// //             pages, compress size for email, and add security for sensitive files — all in your browser.
// //           </p>

// //           <div className="grid sm:grid-cols-3 gap-4 mb-6">
// //             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <Zap className="text-indigo-600" size={18} />
// //                 <h3 className="font-semibold text-slate-900">Fast & Simple</h3>
// //               </div>
// //               <p className="text-sm text-slate-600 leading-6">
// //                 Upload → choose action → download. No complicated steps.
// //               </p>
// //             </div>

// //             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <ShieldCheck className="text-indigo-600" size={18} />
// //                 <h3 className="font-semibold text-slate-900">Privacy-Friendly</h3>
// //               </div>
// //               <p className="text-sm text-slate-600 leading-6">
// //                 Designed for safe processing — no signup required to use tools.
// //               </p>
// //             </div>

// //             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <Globe className="text-indigo-600" size={18} />
// //                 <h3 className="font-semibold text-slate-900">Works Everywhere</h3>
// //               </div>
// //               <p className="text-sm text-slate-600 leading-6">
// //                 Use on Windows, macOS, Linux, Android, and iOS in your browser.
// //               </p>
// //             </div>
// //           </div>

// //           <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //             Popular PDF Tasks You Can Do Here
// //           </h3>
// //           <ul className="space-y-2 list-disc pl-6 mb-6">
// //             <li>
// //               Convert documents to PDF:{" "}
// //               <Link href={tWordToPdf.href} className="text-indigo-600 font-medium hover:underline">
// //                 Word to PDF
// //               </Link>{" "}
// //               /{" "}
// //               <Link href={tExcel.href} className="text-indigo-600 font-medium hover:underline">
// //                 Excel to PDF
// //               </Link>{" "}
// //               /{" "}
// //               <Link href={tPpt.href} className="text-indigo-600 font-medium hover:underline">
// //                 PPT to PDF
// //               </Link>
// //             </li>
// //             <li>
// //               Convert PDF to editable formats:{" "}
// //               <Link href={tPdfToWord.href} className="text-indigo-600 font-medium hover:underline">
// //                 PDF to Word
// //               </Link>
// //             </li>
// //             <li>
// //               Combine or extract pages:{" "}
// //               <Link href={tMerge.href} className="text-indigo-600 font-medium hover:underline">
// //                 Merge PDF
// //               </Link>{" "}
// //               /{" "}
// //               <Link href={tSplit.href} className="text-indigo-600 font-medium hover:underline">
// //                 Split PDF
// //               </Link>
// //             </li>
// //             <li>
// //               Reduce PDF size for email & sharing:{" "}
// //               <Link href={tCompress.href} className="text-indigo-600 font-medium hover:underline">
// //                 Compress PDF
// //               </Link>
// //             </li>
// //             <li>
// //               Secure sensitive documents:{" "}
// //               <Link href={tProtect.href} className="text-indigo-600 font-medium hover:underline">
// //                 Protect PDF
// //               </Link>{" "}
// //               /{" "}
// //               <Link href={tUnlock.href} className="text-indigo-600 font-medium hover:underline">
// //                 Unlock PDF
// //               </Link>
// //             </li>
// //             <li>
// //               Convert images into PDF:{" "}
// //               <Link href={tImageToPdf.href} className="text-indigo-600 font-medium hover:underline">
// //                 Image to PDF
// //               </Link>
// //             </li>
// //           </ul>

// //           <h3 className="text-xl font-semibold text-slate-900 mb-3">
// //             Which PDF Tool Should You Use?
// //           </h3>
// //           <p className="leading-7 mb-2">
// //             If your goal is sharing or printing, convert files to PDF. If you need editing, convert a PDF back to Word.
// //             If your PDF is too large, compress it. If it contains multiple documents, merge them. If you only need certain
// //             pages, split it. And if the file is sensitive, add password protection.
// //           </p>
// //           <p className="leading-7">
// //             This hub page helps you find the right PDF tool quickly — choose a tool below and get started.
// //           </p>
// //         </section>

// //         {/* TOP TOOLS */}
// //         <section className="mb-14">
// //           <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
// //             Most Popular PDF Tools
// //           </h2>

// //           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
// //             {[
// //               { title: "Word to PDF", url: "/word-to-pdf", emoji: "📄" },
// //               { title: "PDF to Word", url: "/pdf-to-word", emoji: "📝" },
// //               { title: "Protect PDF", url: "/protect-pdf", emoji: "🔐" },
// //               { title: "Compress PDF", url: "/compress-pdf", emoji: "🗜️" },
// //             ].map((tool) => (
// //               <Link
// //                 key={tool.url}
// //                 href={tool.url}
// //                 className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition text-center"
// //               >
// //                 <div className="text-3xl mb-2">{tool.emoji}</div>
// //                 <h3 className="font-semibold text-gray-800">{tool.title}</h3>
// //               </Link>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ALL TOOLS GRID */}
// //         <section>
// //           <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
// //             All PDF Tools
// //           </h2>

// //           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {Object.values(pdfToolsMeta).map((tool) => {
// //               const Icon = icons[tool.slug] || FileText;

// //               return (
// //                 <Link
// //                   key={tool.slug}
// //                   href={tool.href}
// //                   className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
// //                 >
// //                   <div className="flex items-center gap-4 mb-3">
// //                     <Icon size={28} className="text-indigo-600" />
// //                     <h3 className="text-lg font-semibold group-hover:text-indigo-600">
// //                       {tool.title.replace(" | PDF Linx", "")}
// //                     </h3>
// //                   </div>

// //                   <p className="text-sm text-gray-600">{tool.description}</p>

// //                   <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
// //                     Use tool →
// //                   </span>
// //                 </Link>
// //               );
// //             })}
// //           </div>
// //         </section>

// //         {/* EXTRA SEO MINI-FAQ (VISIBLE) */}
// //         <section className="max-w-4xl mx-auto mt-14">
// //           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
// //             Frequently Asked Questions
// //           </h2>

// //           <div className="space-y-4">
// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Do I need to install any software?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 No. All PDFLinx tools work online in your browser — just upload, process, and download.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Which tool should I use to reduce PDF size?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Use{" "}
// //                 <Link href={tCompress.href} className="text-indigo-600 font-medium hover:underline">
// //                   Compress PDF
// //                 </Link>{" "}
// //                 to reduce file size for email, WhatsApp, or faster uploads.
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 Can I convert Word, Excel, or PowerPoint to PDF?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Yes — try{" "}
// //                 <Link href={tWordToPdf.href} className="text-indigo-600 font-medium hover:underline">
// //                   Word to PDF
// //                 </Link>
// //                 ,{" "}
// //                 <Link href={tExcel.href} className="text-indigo-600 font-medium hover:underline">
// //                   Excel to PDF
// //                 </Link>{" "}
// //                 and{" "}
// //                 <Link href={tPpt.href} className="text-indigo-600 font-medium hover:underline">
// //                   PPT to PDF
// //                 </Link>
// //                 .
// //               </p>
// //             </details>

// //             <details className="bg-white rounded-lg shadow-sm p-5">
// //               <summary className="font-semibold cursor-pointer">
// //                 How do I secure a PDF with a password?
// //               </summary>
// //               <p className="mt-2 text-gray-600">
// //                 Use{" "}
// //                 <Link href={tProtect.href} className="text-indigo-600 font-medium hover:underline">
// //                   Protect PDF
// //                 </Link>{" "}
// //                 to add password protection. If you own the file and need access, use{" "}
// //                 <Link href={tUnlock.href} className="text-indigo-600 font-medium hover:underline">
// //                   Unlock PDF
// //                 </Link>
// //                 .
// //               </p>
// //             </details>
// //           </div>
// //         </section>

// //         {/* FOOTER NOTE */}
// //         <p className="text-sm text-gray-500 text-center mt-12">
// //           All tools work online without installation. Files are processed securely
// //           and removed automatically for your privacy.
// //         </p>
// //       </main>
// //     </>
// //   );
// // }

