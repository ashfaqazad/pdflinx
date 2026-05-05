// components/ToolFlow/UploadLandingStep.jsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Target,
  MonitorSmartphone,
  Infinity,
  FileText,
  FileSpreadsheet,
  FileSearch,
  FileMinus,
  FilePlus,
  Lock,
  Star,
  CheckCircle2,
  Gift,
  UserPlus,
  LayoutTemplate,
  ChevronDown,
  Scissors,
} from "lucide-react";
import UploadStep from "./UploadStep";

const defaultRelatedTools = [
  { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert back to PDF", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", icon: FileMinus, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", icon: FilePlus, iconColor: "text-violet-500", bgColor: "bg-violet-50" },
  { label: "Split PDF", href: "/split-pdf", desc: "Separate PDF pages", icon: Scissors, iconColor: "text-pink-500", bgColor: "bg-pink-50" },
  { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Extract PDF tables", icon: FileSpreadsheet, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs readable", icon: FileSearch, iconColor: "text-teal-500", bgColor: "bg-teal-50" },
];

const defaultFaqs = [
  { q: "Is PDFLinx free?", a: "Yes, PDFLinx tools are free to use with no hidden charges." },
  { q: "Do I need to sign up?", a: "No account is required. Upload your file and convert instantly." },
  { q: "Are my files secure?", a: "Files are processed securely and automatically deleted after conversion." },
  { q: "Can I use it on mobile?", a: "Yes, PDFLinx works on desktop, tablet, and mobile browsers." },
];

const defaultFeatures = [
  { icon: Zap, title: "Instant Conversion", desc: "Results in seconds", iconColor: "text-yellow-500", bgColor: "bg-yellow-50" },
  { icon: Target, title: "High Accuracy", desc: "Clean output quality", iconColor: "text-purple-500", bgColor: "bg-purple-50" },
  { icon: ShieldCheck, title: "Secure Files", desc: "Auto-deleted after processing", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { icon: MonitorSmartphone, title: "Works Everywhere", desc: "Desktop, tablet, mobile", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { icon: Infinity, title: "100% Free", desc: "No hidden fees", iconColor: "text-red-500", bgColor: "bg-red-50" },
];

const defaultWhyItems = [
  { icon: LayoutTemplate, title: "Clean Formatting", desc: "Get a neat and usable output file.", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { icon: Lock, title: "Private & Secure", desc: "Your files are handled safely.", iconColor: "text-purple-500", bgColor: "bg-purple-50" },
  { icon: UserPlus, title: "No Sign Up Required", desc: "Use instantly without registration.", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { icon: Gift, title: "Free Forever", desc: "Convert files without hidden charges.", iconColor: "text-pink-500", bgColor: "bg-pink-50" },
];

const defaultStats = [
  { num: "2M+", label: "Files Converted" },
  { num: "23+", label: "Free PDF Tools" },
  { num: "100%", label: "Browser-Based" },
  { num: "0", label: "Hidden Fees" },
];

export default function UploadLandingStep({
  onFilesSelect,
  accept,
  multiple,
  uploadTitle,
  uploadSubtitle,
  uploadInfo,
  content = {},
}) {
  const relatedTools = content.relatedTools || defaultRelatedTools;
  const faqs = content.faqs || defaultFaqs;
  const features = content.features || defaultFeatures;
  const whyItems = content.whyItems || defaultWhyItems;
  const stats = content.stats || defaultStats;

  const howToSteps =
    content.howToSteps || [
      { n: "1", title: "Upload File", desc: "Drag & drop your file or click to browse.", color: "bg-blue-600" },
      { n: "2", title: "Convert", desc: "We process your file securely.", color: "bg-purple-600" },
      { n: "3", title: "Download", desc: "Download your converted file instantly.", color: "bg-emerald-600" },
    ];

  const breadcrumbItems =
    content.breadcrumbItems || [
      { label: "Home", href: "/" },
      { label: "PDF Tools", href: "/pdf-tools" },
      { label: content.breadcrumbCurrent || "PDF Tool" },
    ];

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[1180px] overflow-x-hidden px-4 py-6 md:px-5 md:py-12">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
            {breadcrumbItems.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1">
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-slate-600">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-600">{item.label}</span>
                )}
                {i < breadcrumbItems.length - 1 && <span aria-hidden="true">›</span>}
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            {(content.trustPills || ["100% Free", "No Sign Up", "No Watermark"]).map((pill) => (
              <span key={pill} className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> {pill}
              </span>
            ))}
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-600">
              {content.eyebrow || "PDF TOOL"}
            </p>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              {content.heroTitle || (
                <>
                  Convert Files <br className="hidden sm:block" />
                  in{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                    Seconds ⚡
                  </span>
                </>
              )}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {content.heroDescription || "Convert your files online for free. Fast, secure, and no signup required."}
            </p>

            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              {(content.bullets || [
                "Fast online conversion",
                "Secure file processing",
                "Works on any device — no software needed",
              ]).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {content.privacyBox !== false && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">
                      {content.privacyTitle || "Your files stay private"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {content.privacyText || "Files are processed securely and automatically deleted after conversion."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex shrink-0 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="shrink-0 text-sm font-bold text-slate-900">
                {content.rating || "4.9/5"}
              </span>
              <span className="text-sm text-slate-500">
                {content.ratingText || "Trusted by thousands of users worldwide."}
              </span>
            </div>
          </div>

          <div className="order-1 min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-5 lg:order-2">
            <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 p-5 text-center sm:p-8">
              <UploadStep
                onFilesSelect={onFilesSelect}
                accept={accept}
                multiple={multiple}
                uploadTitle={uploadTitle || content.uploadTitle || "Drop your file here"}
                uploadSubtitle={uploadSubtitle || content.uploadSubtitle || "or click to browse"}
                uploadInfo={uploadInfo || content.uploadInfo || null}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-600">
              {(content.supports || ["Supports your selected file format", "Auto-deleted after 1 hour"]).map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>

            {content.noticeBox !== false && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
                  <span>{content.noticeEmoji || "ℹ️"}</span> {content.noticeTitle || "Important Note"}
                </p>
                <ul className="space-y-1 text-xs text-slate-600">
                  {(content.noticeItems || [
                    "Single file downloads directly",
                    "Multiple files download as ZIP",
                  ]).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            
          </div>
        </section>

        <section className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-3 md:grid-cols-5">
          {features.map((feat) => (
            <div key={feat.title} className="flex flex-col items-center gap-2 bg-white px-3 py-5 text-center sm:px-4 sm:py-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${feat.bgColor}`}>
                <feat.icon className={`h-5 w-5 ${feat.iconColor}`} />
              </div>
              <p className="text-xs font-bold text-slate-900 sm:text-sm">{feat.title}</p>
              <p className="text-xs text-slate-500">{feat.desc}</p>
            </div>
          ))}
        </section>

        {/* <section className="mt-6 grid gap-6 lg:grid-cols-2"> */}
        {/* <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"> */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {content.howToTitle || "How to Convert Your File"}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.5fr]">
              <div>
                {howToSteps.map(({ n, title, desc, color }, idx) => (
                  <div key={n} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
                        {n}
                      </span>
                      {idx < howToSteps.length - 1 && (
                        <div className="my-1 w-px flex-1 bg-slate-200" style={{ minHeight: 24 }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-bold text-slate-900">{title}</p>
                      <p className="mt-0.5 max-w-[220px] sm:max-w-[260px] text-xs leading-5 text-slate-500">
                        {desc}
                      </p>
                      {/* <p className="mt-0.5 text-xs text-slate-500">{desc}</p> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="flex flex-col gap-4"> */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-fit max-w-[260px] rounded-2xl border border-slate-100 bg-slate-50 p-3">
                {/* <div className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3"> */}
                  <img
                    src={content.visualImage || "/images/pdf-to-word-visual.jpeg"}
                    alt={content.visualAlt || "File conversion illustration"}
                    className="h-[220px] w-auto rounded-xl object-contain"
                  /> 
               </div>
              </div>

            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {content.whyTitle || "Why Choose PDFLinx?"}
            </h2>

            <div className="mt-5 space-y-3">
              {whyItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgColor}`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
            {content.statsTitle || "Trusted by Users Around the World"}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center sm:mt-8 sm:gap-6 md:grid-cols-4">
            {stats.map(({ num, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-slate-900 sm:text-3xl">{num}</p>
                <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </section> */}

{/* {content.seoSections?.length > 0 && (
  <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        PDF to Word Converter — Free Online Tool by PDFLinx
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Convert standard and scanned PDF files into editable Word documents with a clean, simple, and secure experience.
      </p>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {content.seoSections.map((section) => (
        <div
          key={section.title}
          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
        >
          <h3 className="text-base font-bold text-slate-900">
            {section.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {section.text}
          </p>
        </div>
      ))}
    </div>
  </section>
)} */}

{content.seoSections?.length > 0 && (
  <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-6 py-7 text-center sm:px-8">
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
        PDF to Word Guide
      </span>

      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        PDF to Word Converter — Free Online Tool by PDFLinx
      </h2>

      <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-600">
        Convert standard and scanned PDF files into editable Word documents with a clean,
        simple, and secure experience.
      </p>
    </div>

    <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
      {content.seoSections.map((section, index) => (
        <div
          key={section.title}
          className={`rounded-2xl border border-slate-100 bg-slate-50/70 p-5 ${
            index === content.seoSections.length - 1 ? "md:col-span-2" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
              {index + 1}
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {section.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)}



{/* ── PDF TYPES COMPARISON (UPGRADED) ── */}
<section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
  
  {/* Header */}
  <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-6 py-6 text-center">
    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700">
      PDF Types
    </span>

    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
      Standard PDF vs Scanned PDF
    </h2>

    <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
      Understand the difference before converting — choose the right option for best results.
    </p>
  </div>

  {/* Cards */}
  <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">

    {/* Standard PDF */}
    <div className="group rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 transition hover:shadow-md">
      
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-base font-extrabold text-green-700">
          Standard PDF
        </h3>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li>✓ Text is selectable</li>
        <li>✓ Faster conversion speed</li>
        <li>✓ High accuracy output</li>
        <li>✓ No OCR required</li>
      </ul>

      <p className="mt-4 text-xs text-slate-500">
        Best for digitally created PDFs like reports, invoices, and documents.
      </p>
    </div>

    {/* Scanned PDF */}
    <div className="group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 transition hover:shadow-md">
      
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
          <FileSearch className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="text-base font-extrabold text-orange-600">
          Scanned PDF
        </h3>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li>✓ Text is not selectable</li>
        <li>✓ OCR required</li>
        <li>✓ Slightly slower process</li>
        <li>✓ Converts images into text</li>
      </ul>

      <p className="mt-4 text-xs text-slate-500">
        Best for scanned documents, photos, and printed files converted to PDF.
      </p>
    </div>

  </div>
</section>
        {/* <section className="mt-6">
          <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
            {content.faqTitle || "Frequently Asked Questions"}
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white px-4 py-3.5 open:shadow-sm sm:px-5 sm:py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-700">
                  <span className="min-w-0">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </section> */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-6 text-center">
    <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-violet-700">
      Help Center
    </span>

    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
      {content.faqTitle || "Frequently Asked Questions"}
    </h2>

    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
      Quick answers about PDF to Word conversion, OCR, file safety, formatting, and downloads.
    </p>
  </div>

  <div className="grid gap-3 p-5 sm:p-6 md:grid-cols-2">
    {faqs.map((faq, index) => (
      <details
        key={faq.q}
        className="group rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition open:border-blue-200 open:bg-blue-50/40 open:shadow-sm sm:px-5 sm:py-4"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-800">
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-black text-blue-700">
              {index + 1}
            </span>
            <span>{faq.q}</span>
          </span>

          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 group-open:text-blue-600" />
        </summary>

        <p className="mt-3 pl-8 text-sm leading-6 text-slate-600">
          {faq.a}
        </p>
      </details>
    ))}
  </div>
</section>


                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {content.relatedTitle || "You Might Also Need"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-3.5 transition-all hover:border-blue-400 hover:shadow-sm sm:p-4"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bgColor}`}>
                  <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {tool.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>


        <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 sm:p-8 md:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white/90">
                {content.ctaBadge || "✦ 100% Free"}
              </span>
              <h2 className="mt-3 text-xl font-black text-white sm:text-2xl md:text-3xl">
                {content.ctaTitle || "Start Converting Now"}
              </h2>
              <p className="mt-1.5 text-sm text-white/75">
                {content.ctaDescription || "Fast. Secure. Private. No sign up required."}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {content.ctaSubtext || "No limits. No hidden charges."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[type="file"]');
                input?.click();
              }}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-xl transition hover:bg-blue-50 active:scale-95 sm:w-auto sm:px-7"
            >
              <FileText className="h-4 w-4 text-blue-600" />
              {content.ctaButton || "Choose File"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}


































// // components/ToolFlow/UploadLandingStep.jsx
// "use client";

// import Link from "next/link";
// import {
//   ShieldCheck,
//   Zap,
//   Target,
//   MonitorSmartphone,
//   Infinity,
//   FileText,
//   FileType2,
//   FileSpreadsheet,
//   FileImage,
//   FileLock,
//   FileSearch,
//   FileMinus,
//   FilePlus,
//   Lock,
//   Star,
//   CheckCircle2,
//   Gift,
//   UserPlus,
//   ScanText,
//   LayoutTemplate,
//   ChevronDown,
//   Scissors,
//   RefreshCw,
// } from "lucide-react";
// import UploadStep from "./UploadStep";

// // ─── DATA ────────────────────────────────────────────────────────────────────

// const relatedTools = [
//   { label: "Word to PDF",  href: "/word-to-pdf",  desc: "Convert back to PDF",      icon: FileText,        iconColor: "text-blue-500",   bgColor: "bg-blue-50"   },
//   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size",      icon: FileMinus,       iconColor: "text-orange-500", bgColor: "bg-orange-50" },
//   { label: "Merge PDF",    href: "/merge-pdf",    desc: "Combine multiple PDFs",     icon: FilePlus,        iconColor: "text-violet-500", bgColor: "bg-violet-50" },
//   { label: "Split PDF",    href: "/split-pdf",    desc: "Separate PDF pages",        icon: Scissors,        iconColor: "text-pink-500",   bgColor: "bg-pink-50"   },
//   { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Extract PDF tables",        icon: FileSpreadsheet, iconColor: "text-emerald-500",bgColor: "bg-emerald-50"},
//   { label: "OCR PDF",      href: "/ocr-pdf",      desc: "Make scanned PDFs readable",icon: FileSearch,      iconColor: "text-teal-500",   bgColor: "bg-teal-50"   },
// ];

// const faqs = [
//   { q: "Is PDFLinx PDF to Word converter free?",   a: "Yes, 100% free. No hidden charges, no subscriptions, no limits." },
//   { q: "Will my PDF formatting be preserved?",      a: "Yes, our converter maintains fonts, images, tables, and layout accurately." },
//   { q: "Do I need to sign up?",                     a: "No account or sign up needed. Just upload and convert instantly." },
//   { q: "What is the maximum file size?",            a: "You can upload PDF files up to 100MB in size." },
//   { q: "Can I convert scanned PDFs to Word?",       a: "Yes! Our OCR technology extracts text from scanned PDFs accurately." },
//   { q: "Is my file secure?",                        a: "Absolutely. Files are processed securely and never stored on our servers." },
//   { q: "Can I convert PDF to Word on mobile?",      a: "Yes, PDFLinx works on all devices including mobile and tablet." },
//   { q: "What happens to my files after conversion?",a: "Files are automatically deleted after conversion. Nothing is stored on our servers." },
// ];

// const features = [
//   { icon: Zap,               title: "Instant Conversion", desc: "Results in seconds",        iconColor: "text-yellow-500", bgColor: "bg-yellow-50" },
//   { icon: Target,            title: "High Accuracy",      desc: "Best formatting retention", iconColor: "text-purple-500", bgColor: "bg-purple-50" },
//   { icon: ScanText,          title: "OCR Powered",        desc: "Scanned PDFs supported",    iconColor: "text-blue-500",   bgColor: "bg-blue-50"   },
//   { icon: MonitorSmartphone, title: "Works Everywhere",   desc: "Desktop, tablet, mobile",   iconColor: "text-orange-500", bgColor: "bg-orange-50" },
//   { icon: Infinity,          title: "100% Free",          desc: "No limits. No hidden fees", iconColor: "text-red-500",    bgColor: "bg-red-50"    },
// ];

// const whyItems = [
//   { icon: LayoutTemplate, title: "Perfect Formatting",  desc: "Maintain fonts, images, tables & layout.",     iconColor: "text-blue-500",   bgColor: "bg-blue-50"   },
//   { icon: ScanText,       title: "OCR Technology",      desc: "Extract text from scanned PDFs accurately.",   iconColor: "text-teal-500",   bgColor: "bg-teal-50"   },
//   { icon: Lock,           title: "No File Uploads",     desc: "Your files never leave your device.",          iconColor: "text-purple-500", bgColor: "bg-purple-50" },
//   { icon: UserPlus,       title: "No Sign Up Required", desc: "Use the tool instantly without registration.", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
//   { icon: Gift,           title: "Free Forever",        desc: "Convert as many files as you want.",           iconColor: "text-pink-500",   bgColor: "bg-pink-50"   },
// ];

// // ─── COLORFUL SVG STAT ICONS ──────────────────────────────────────────────────
// const StatIcons = {
//   files: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#EFF6FF"/>
//       <rect x="10" y="9" width="14" height="18" rx="2" fill="#93C5FD"/>
//       <rect x="15" y="13" width="15" height="18" rx="2" fill="#3B82F6"/>
//       <path d="M18 21h6M18 24.5h4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
//     </svg>
//   ),
//   tools: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#F5F3FF"/>
//       <path d="M25 11l-2.5 2.5 4 4 2.5-2.5a3.5 3.5 0 00-4-4z" fill="#8B5CF6"/>
//       <path d="M22.5 13.5l-9 9 1.5 3.5 3.5 1.5 9-9-5-5z" fill="#A78BFA"/>
//       <circle cx="14" cy="26" r="2" fill="#7C3AED"/>
//     </svg>
//   ),
//   browser: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#F0FDF4"/>
//       <circle cx="20" cy="20" r="10" stroke="#4ADE80" strokeWidth="1.5"/>
//       <ellipse cx="20" cy="20" rx="4.5" ry="10" stroke="#22C55E" strokeWidth="1.3"/>
//       <path d="M10 20h20" stroke="#16A34A" strokeWidth="1.3"/>
//       <path d="M12 15h16M12 25h16" stroke="#86EFAC" strokeWidth="1"/>
//     </svg>
//   ),
//   shield: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#FFF7ED"/>
//       <path d="M20 10l9 3.5v6c0 4.5-3.5 8.5-9 10-5.5-1.5-9-5.5-9-10v-6L20 10z" fill="#FED7AA"/>
//       <path d="M20 10l9 3.5v6c0 4.5-3.5 8.5-9 10" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
//       <path d="M15.5 20l3.5 3.5 6-6" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
// };

// const stats = [
//   { num: "2M+",  label: "Files Converted",   icon: StatIcons.files   },
//   { num: "23+",  label: "Free PDF Tools",    icon: StatIcons.tools   },
//   { num: "100%", label: "Browser-Based",     icon: StatIcons.browser },
//   { num: "0",    label: "Uploads to Server", icon: StatIcons.shield  },
// ];

// // ─── JSON-LD SCHEMAS ──────────────────────────────────────────────────────────
// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqs.map((f) => ({
//     "@type": "Question",
//     name: f.q,
//     acceptedAnswer: { "@type": "Answer", text: f.a },
//   })),
// };

// const howToSchema = {
//   "@context": "https://schema.org",
//   "@type": "HowTo",
//   name: "How to Convert PDF to Word",
//   description: "Convert your PDF to an editable Word document in 3 easy steps using PDFLinx — free, fast, no signup.",
//   totalTime: "PT1M",
//   step: [
//     { "@type": "HowToStep", position: 1, name: "Upload PDF",  text: "Drag & drop your PDF file or click to browse. Max size 100MB." },
//     { "@type": "HowToStep", position: 2, name: "Convert",     text: "Click convert. We process your PDF and convert it to a fully editable Word (.docx) document." },
//     { "@type": "HowToStep", position: 3, name: "Download",    text: "Download your Word file instantly. No signup or watermark." },
//   ],
// };

// const breadcrumbSchema = {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: [
//     { "@type": "ListItem", position: 1, name: "Home",      item: "https://pdflinx.com" },
//     { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pdflinx.com/pdf-tools" },
//     { "@type": "ListItem", position: 3, name: "PDF to Word Converter", item: "https://pdflinx.com/pdf-to-word" },
//   ],
// };

// // ─── COMPONENT ────────────────────────────────────────────────────────────────
// export default function UploadLandingStep({
//   onFilesSelect,
//   accept,
//   multiple,
//   uploadTitle,
//   uploadSubtitle,
//   uploadInfo,
//   content = {},
// }) {
//   return (
//     <div className="bg-white">

//       {/* ══ JSON-LD Schemas ══ */}
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

//       {/* FIX ✅ overflow-x-hidden stops mobile horizontal overflow */}
//       <div className="mx-auto w-full max-w-[1180px] overflow-x-hidden px-4 py-6 md:px-5 md:py-12">

//         {/* ── Breadcrumb + Trust Pills ── */}
//         <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
//           <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
//             <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
//             <span aria-hidden="true">›</span>
//             <Link href="/pdf-tools" className="hover:text-slate-600 transition-colors">PDF Tools</Link>
//             <span aria-hidden="true">›</span>
//             <span className="font-medium text-slate-600">PDF to Word Converter</span>
//           </nav>

//           {/* FIX ✅ trust pills wrap properly on mobile */}
//           <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
//             <span className="inline-flex items-center gap-1">
//               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 100% Free
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> No Sign Up
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <Zap className="h-3.5 w-3.5 text-blue-500" /> No Watermark
//             </span>
//           </div>
//         </div>

//         {/* ── HERO ── */}
//         {/* FIX ✅ single column on mobile, 2 col on lg */}
//         {/* <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start"> */}
//         <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">

//           {/* Left copy */}
//           {/* <div className="min-w-0"> */}
//           <div className="min-w-0 order-2 lg:order-1">
//             <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-600">
//               PDF to Word Converter
//             </p>

//             {/* FIX ✅ smaller font on mobile to prevent overflow */}
//             <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
//               Convert PDF to Word{" "}
//               <br className="hidden sm:block" />
//               in{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
//                 Seconds ⚡
//               </span>
//             </h1>

//             <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
//               Convert PDF to editable Word documents with perfect formatting.
//               Fast, free and 100% secure — your files never leave your browser.
//             </p>

//             <ul className="mt-5 space-y-2 text-sm text-slate-600">
//               {[
//                 "Maintains original formatting & layout",
//                 "OCR powered — works on scanned PDFs",
//                 "100% Private — files never uploaded",
//                 "Works on any device — no software needed",
//               ].map((item) => (
//                 <li key={item} className="flex items-start gap-2">
//                   <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>

//             {/* Privacy box */}
//             <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <ShieldCheck className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="font-bold text-slate-900">Your files stay private</p>
//                   <p className="mt-0.5 text-xs text-slate-500">
//                     All processing happens in your browser. No uploads. No servers. No worries.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* FIX ✅ Rating — wrap on small screens, no overflow */}
//             <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
//               <div className="flex shrink-0 text-yellow-400">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star key={i} className="h-4 w-4 fill-current" />
//                 ))}
//               </div>
//               <span className="shrink-0 text-sm font-bold text-slate-900">4.9/5</span>
//               <span className="text-sm text-slate-500">Trusted by thousands of users worldwide.</span>
//             </div>
//           </div>

//           {/* Right — Upload Card */}
//           {/* <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-5"> */}
//           <div className="min-w-0 order-1 lg:order-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-5">

//             {/* Dashed dropzone */}
//             <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 p-5 text-center sm:p-8">
//               <UploadStep
//                 onFilesSelect={onFilesSelect}
//                 accept={accept}
//                 multiple={multiple}
//                 uploadTitle={uploadTitle || "Drop your PDF file here"}
//                 uploadSubtitle={uploadSubtitle || "or click to browse"}
//                 uploadInfo={uploadInfo || "Max file size: 100MB"}
//               />
//             </div>

//             {/* Supports + Auto-deleted row */}
//             <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-600">
//               <span className="flex items-center gap-1.5">
//                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
//                 Supports: PDF (Scanned or Digital)
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//                 Auto-deleted after 1 hour
//               </span>
//             </div>

//             {/* Microsoft Word Compatibility box */}
//             <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
//               <p className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
//                 <span>🖥️</span> Microsoft Word Compatibility
//               </p>
//               <ul className="space-y-1 text-xs text-slate-600">
//                 <li>• Converted files open best in <strong>Microsoft Word 2013 or newer</strong></li>
//                 <li>• Click <strong>"Enable Editing"</strong> when prompted — this is normal</li>
//                 <li>• Older Word versions may not fully support modern DOCX files</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         {/* ── FEATURES STRIP ── */}
//         {/* FIX ✅ 2 cols mobile, 5 cols desktop */}
//         <section className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-3 md:grid-cols-5">
//           {features.map((feat) => (
//             <div key={feat.title} className="flex flex-col items-center gap-2 bg-white px-3 py-5 text-center sm:px-4 sm:py-6">
//               <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${feat.bgColor}`}>
//                 <feat.icon className={`h-5 w-5 ${feat.iconColor}`} />
//               </div>
//               <p className="text-xs font-bold text-slate-900 sm:text-sm">{feat.title}</p>
//               <p className="text-xs text-slate-500">{feat.desc}</p>
//             </div>
//           ))}
//         </section>

//         {/* ── HOW TO + WHY CHOOSE ── */}
//         {/* FIX ✅ stacked on mobile, side by side on lg */}
//         <section className="mt-6 grid gap-6 lg:grid-cols-2">

//           {/* How to Convert */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//             <h2 className="text-lg font-bold text-slate-900 sm:text-xl">How to Convert PDF to Word</h2>

//             <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.5fr]">
//             {/* <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr]"> */}
//               <div>
//                 {[
//                   { n: "1", title: "Upload PDF", desc: "Drag & drop your PDF file or click to browse.", color: "bg-blue-600" },
//                   { n: "2", title: "Convert",    desc: "We convert your PDF to a fully editable Word document.", color: "bg-purple-600" },
//                   { n: "3", title: "Download",   desc: "Download your Word file instantly. That's it!", color: "bg-emerald-600" },
//                 ].map(({ n, title, desc, color }, idx) => (
//                   <div key={n} className="flex gap-3">
//                     <div className="flex flex-col items-center">
//                       <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
//                         {n}
//                       </span>
//                       {idx < 2 && <div className="my-1 w-px flex-1 bg-slate-200" style={{ minHeight: 24 }} />}
//                     </div>
//                     <div className="pb-4">
//                       <p className="font-bold text-slate-900">{title}</p>
//                       <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col gap-4">

//                 <div className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3">
//                     <img
//                     src="/images/pdf-to-word-visual.jpeg"
//                     alt="PDF to Word conversion illustration"
//                     className="w-full h-auto rounded-xl object-contain"
//                 />
//                 </div>

//                 {/* <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
//                   <p className="text-sm italic text-slate-600">
//                     "Best PDF to Word converter! Keeps the formatting almost perfect."
//                   </p>
//                   <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
//                     <p className="text-sm font-bold text-slate-900">— Priya M., Freelancer</p>
//                     <div className="flex text-yellow-400">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Star key={i} className="h-3.5 w-3.5 fill-current" />
//                       ))}
//                     </div>
//                   </div>
//                 </div> */}

//               </div>
//             </div>
//           </div>

//           {/* Why Choose */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//             <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Why Choose PDFLinx?</h2>

//             <div className="mt-5 space-y-3">
//               {whyItems.map((item) => (
//                 <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
//                   <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgColor}`}>
//                     <item.icon className={`h-5 w-5 ${item.iconColor}`} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="font-bold text-slate-900">{item.title}</p>
//                     <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── STATS ── */}
//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           {/* FIX ✅ heading larger */}
//           <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
//             Trusted by Users Around the World
//           </h2>
//           <div className="mt-6 grid grid-cols-2 gap-4 text-center sm:mt-8 sm:gap-6 md:grid-cols-4">
//             {stats.map(({ num, label, icon }) => (
//               <div key={label} className="flex flex-col items-center gap-2">
//                 {icon}
//                 {/* FIX ✅ larger number */}
//                 <p className="text-2xl font-black text-slate-900 sm:text-3xl">{num}</p>
//                 <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//           <h2 className="text-lg font-bold text-slate-900 sm:text-xl">You Might Also Need</h2>
//           {/* FIX ✅ each tool has its own unique icon */}
//           <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
//             {relatedTools.map((tool) => (
//               <Link
//                 key={tool.href}
//                 href={tool.href}
//                 className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-3.5 transition-all hover:border-blue-400 hover:shadow-sm sm:p-4"
//               >
//                 <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bgColor} transition-opacity group-hover:opacity-80`}>
//                   <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">
//                     {tool.label}
//                   </p>
//                   <p className="mt-0.5 text-xs text-slate-500">{tool.desc}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <section className="mt-6">
//           {/* FIX ✅ heading larger */}
//           <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
//             Frequently Asked Questions
//           </h2>
//           <div className="mt-5 grid gap-3 md:grid-cols-2">
//             {faqs.map((faq) => (
//               <details
//                 key={faq.q}
//                 className="group rounded-2xl border border-slate-200 bg-white px-4 py-3.5 open:shadow-sm sm:px-5 sm:py-4"
//               >
//                 <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-700">
//                   <span className="min-w-0">{faq.q}</span>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
//                 </summary>
//                 <p className="mt-3 text-sm leading-6 text-slate-500">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         {/* FIX ✅ CTA larger text, proper mobile stacking */}
//         <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 sm:p-8 md:p-10">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="min-w-0">
//               <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white/90">
//                 ✦ 100% Free
//               </span>
//               {/* FIX ✅ heading larger */}
//               <h2 className="mt-3 text-xl font-black text-white sm:text-2xl md:text-3xl">
//                 Start Converting PDF to Word Now
//               </h2>
//               <p className="mt-1.5 text-sm text-white/75">
//                 Fast. Secure. Private. No sign up required.
//               </p>
//               <p className="mt-1 text-xs text-white/50">
//                 No uploads. No limits. No hidden charges.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => {
//                 const input = document.querySelector('input[type="file"]');
//                 input?.click();
//               }}
//               className="flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-xl transition hover:bg-blue-50 active:scale-95 sm:w-auto sm:px-7"
//             >
//               <FileText className="h-4 w-4 text-blue-600" />
//               Choose PDF File
//             </button>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

























// // components/ToolFlow/UploadLandingStep.jsx
// "use client";

// import Link from "next/link";
// import {
//   ShieldCheck,
//   Zap,
//   Target,
//   MonitorSmartphone,
//   Infinity,
//   FileText,
//   FileType2,
//   Lock,
//   Star,
//   CheckCircle2,
//   Gift,
//   UserPlus,
//   ScanText,
//   LayoutTemplate,
//   ChevronDown,
//   Upload,
// } from "lucide-react";
// import UploadStep from "./UploadStep";

// // ─── DATA ────────────────────────────────────────────────────────────────────

// const relatedTools = [
//   { label: "Word to PDF",   href: "/word-to-pdf",   desc: "Convert back to PDF" },
//   { label: "Compress PDF",  href: "/compress-pdf",  desc: "Reduce PDF file size" },
//   { label: "Merge PDF",     href: "/merge-pdf",     desc: "Combine multiple PDFs" },
//   { label: "Split PDF",     href: "/split-pdf",     desc: "Separate PDF pages" },
//   { label: "PDF to Excel",  href: "/pdf-to-excel",  desc: "Extract PDF tables" },
//   { label: "OCR PDF",       href: "/ocr-pdf",       desc: "Make scanned PDFs readable" },
// ];

// const faqs = [
//   {
//     q: "Is PDFLinx PDF to Word converter free?",
//     a: "Yes, 100% free. No hidden charges, no subscriptions, no limits.",
//   },
//   {
//     q: "Will my PDF formatting be preserved?",
//     a: "Yes, our converter maintains fonts, images, tables, and layout accurately.",
//   },
//   {
//     q: "Do I need to sign up?",
//     a: "No account or sign up needed. Just upload and convert instantly.",
//   },
//   {
//     q: "What is the maximum file size?",
//     a: "You can upload PDF files up to 100MB in size.",
//   },
//   {
//     q: "Can I convert scanned PDFs to Word?",
//     a: "Yes! Our OCR technology extracts text from scanned PDFs accurately.",
//   },
//   {
//     q: "Is my file secure?",
//     a: "Absolutely. Files are processed securely and never stored on our servers.",
//   },
//   {
//     q: "Can I convert PDF to Word on mobile?",
//     a: "Yes, PDFLinx works on all devices including mobile and tablet.",
//   },
//   {
//     q: "What happens to my files after conversion?",
//     a: "Files are automatically deleted after conversion. Nothing is stored on our servers.",
//   },
// ];

// const features = [
//   { icon: Zap,               title: "Instant Conversion", desc: "Results in seconds",        iconColor: "text-yellow-500", bgColor: "bg-yellow-50" },
//   { icon: Target,            title: "High Accuracy",      desc: "Best formatting retention", iconColor: "text-purple-500", bgColor: "bg-purple-50" },
//   { icon: ScanText,          title: "OCR Powered",        desc: "Scanned PDFs supported",    iconColor: "text-blue-500",   bgColor: "bg-blue-50"   },
//   { icon: MonitorSmartphone, title: "Works Everywhere",   desc: "Desktop, tablet, mobile",   iconColor: "text-orange-500", bgColor: "bg-orange-50" },
//   { icon: Infinity,          title: "100% Free",          desc: "No limits. No hidden fees", iconColor: "text-red-500",    bgColor: "bg-red-50"    },
// ];

// const whyItems = [
//   { icon: LayoutTemplate, title: "Perfect Formatting",  desc: "Maintain fonts, images, tables & layout.",     iconColor: "text-blue-500",   bgColor: "bg-blue-50"   },
//   { icon: ScanText,       title: "OCR Technology",      desc: "Extract text from scanned PDFs accurately.",   iconColor: "text-teal-500",   bgColor: "bg-teal-50"   },
//   { icon: Lock,           title: "No File Uploads",     desc: "Your files never leave your device.",          iconColor: "text-purple-500", bgColor: "bg-purple-50" },
//   { icon: UserPlus,       title: "No Sign Up Required", desc: "Use the tool instantly without registration.", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
//   { icon: Gift,           title: "Free Forever",        desc: "Convert as many files as you want.",           iconColor: "text-pink-500",   bgColor: "bg-pink-50"   },
// ];

// // ─── COLORFUL SVG STAT ICONS ──────────────────────────────────────────────────
// const StatIcons = {
//   files: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#EFF6FF"/>
//       <rect x="10" y="9" width="14" height="18" rx="2" fill="#93C5FD"/>
//       <rect x="15" y="13" width="15" height="18" rx="2" fill="#3B82F6"/>
//       <path d="M18 21h6M18 24.5h4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
//     </svg>
//   ),
//   tools: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#F5F3FF"/>
//       <path d="M25 11l-2.5 2.5 4 4 2.5-2.5a3.5 3.5 0 00-4-4z" fill="#8B5CF6"/>
//       <path d="M22.5 13.5l-9 9 1.5 3.5 3.5 1.5 9-9-5-5z" fill="#A78BFA"/>
//       <circle cx="14" cy="26" r="2" fill="#7C3AED"/>
//     </svg>
//   ),
//   browser: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#F0FDF4"/>
//       <circle cx="20" cy="20" r="10" stroke="#4ADE80" strokeWidth="1.5"/>
//       <ellipse cx="20" cy="20" rx="4.5" ry="10" stroke="#22C55E" strokeWidth="1.3"/>
//       <path d="M10 20h20" stroke="#16A34A" strokeWidth="1.3"/>
//       <path d="M12 15h16M12 25h16" stroke="#86EFAC" strokeWidth="1"/>
//     </svg>
//   ),
//   shield: (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//       <rect width="40" height="40" rx="12" fill="#FFF7ED"/>
//       <path d="M20 10l9 3.5v6c0 4.5-3.5 8.5-9 10-5.5-1.5-9-5.5-9-10v-6L20 10z" fill="#FED7AA"/>
//       <path d="M20 10l9 3.5v6c0 4.5-3.5 8.5-9 10" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
//       <path d="M15.5 20l3.5 3.5 6-6" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
// };

// const stats = [
//   { num: "2M+",  label: "Files Converted",   icon: StatIcons.files   },
//   { num: "23+",  label: "Free PDF Tools",    icon: StatIcons.tools   },
//   { num: "100%", label: "Browser-Based",     icon: StatIcons.browser },
//   { num: "0",    label: "Uploads to Server", icon: StatIcons.shield  },
// ];

// // ─── JSON-LD SCHEMAS ──────────────────────────────────────────────────────────
// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqs.map((f) => ({
//     "@type": "Question",
//     name: f.q,
//     acceptedAnswer: { "@type": "Answer", text: f.a },
//   })),
// };

// const howToSchema = {
//   "@context": "https://schema.org",
//   "@type": "HowTo",
//   name: "How to Convert PDF to Word",
//   description:
//     "Convert your PDF to an editable Word document in 3 easy steps using PDFLinx — free, fast, no signup.",
//   totalTime: "PT1M",
//   step: [
//     {
//       "@type": "HowToStep",
//       position: 1,
//       name: "Upload PDF",
//       text: "Drag & drop your PDF file or click to browse and select your file. Max size 100MB.",
//     },
//     {
//       "@type": "HowToStep",
//       position: 2,
//       name: "Convert",
//       text: "Click convert. We process your PDF and convert it to a fully editable Word (.docx) document.",
//     },
//     {
//       "@type": "HowToStep",
//       position: 3,
//       name: "Download",
//       text: "Download your Word file instantly. No signup or watermark.",
//     },
//   ],
// };

// const breadcrumbSchema = {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: [
//     { "@type": "ListItem", position: 1, name: "Home",      item: "https://pdflinx.com" },
//     { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pdflinx.com/pdf-tools" },
//     { "@type": "ListItem", position: 3, name: "PDF to Word Converter", item: "https://pdflinx.com/pdf-to-word" },
//   ],
// };

// // ─── COMPONENT ────────────────────────────────────────────────────────────────
// export default function UploadLandingStep({
//   onFilesSelect,
//   accept,
//   multiple,
//   uploadTitle,
//   uploadSubtitle,
//   uploadInfo,
// }) {
//   return (
//     <div className="bg-white">

//       {/* ══ JSON-LD Schemas — invisible to users, read by Google ══ */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
//       />

//       <div className="mx-auto w-full max-w-[1180px] px-5 py-8 md:py-12">

//         {/* ── Breadcrumb + Trust Pills ── */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//           <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
//             <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
//             <span aria-hidden="true">›</span>
//             <Link href="/pdf-tools" className="hover:text-slate-600 transition-colors">PDF Tools</Link>
//             <span aria-hidden="true">›</span>
//             <span className="font-medium text-slate-600">PDF to Word Converter</span>
//           </nav>

//           <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500">
//             <span className="inline-flex items-center gap-1.5">
//               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 100% Free
//             </span>
//             <span className="inline-flex items-center gap-1.5">
//               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> No Sign Up
//             </span>
//             <span className="inline-flex items-center gap-1.5">
//               <Zap className="h-3.5 w-3.5 text-blue-500" /> No Watermark
//             </span>
//           </div>
//         </div>

//         {/* ── HERO ── */}
//         <section className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">

//           {/* Left copy */}
//           <div>
//             <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-600">
//               PDF to Word Converter
//             </p>

//             <h1 className="max-w-[540px] text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
//               Convert PDF to Word{" "}
//               <br className="hidden md:block" />
//               in{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
//                 Seconds ⚡
//               </span>
//             </h1>

//             <p className="mt-4 max-w-[500px] text-base leading-7 text-slate-600">
//               Convert PDF to editable Word documents with perfect formatting.
//               Fast, free and 100% secure — your files never leave your browser.
//             </p>

//             <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
//               {[
//                 "Maintains original formatting & layout",
//                 "OCR powered — works on scanned PDFs",
//                 "100% Private — files never uploaded",
//                 "Works on any device — no software needed",
//               ].map((item) => (
//                 <li key={item} className="flex items-center gap-2">
//                   <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
//                   {item}
//                 </li>
//               ))}
//             </ul>

//             {/* Privacy box */}
//             <div className="mt-6 max-w-[420px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <ShieldCheck className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-900">Your files stay private</p>
//                   {/* FIX ✅ contrast: text-slate-500 (was too-light text-slate-400) */}
//                   <p className="mt-0.5 text-xs text-slate-500">
//                     All processing happens in your browser. No uploads. No servers. No worries.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Rating */}
//             <div className="mt-4 flex items-center gap-2">
//               <div className="flex text-yellow-400">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star key={i} className="h-4 w-4 fill-current" />
//                 ))}
//               </div>
//               <span className="text-sm font-bold text-slate-900">4.9/5</span>
//               <span className="text-sm text-slate-500">Trusted by thousands of users worldwide.</span>
//             </div>
//           </div>

//           {/* Right — Upload Card */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">

//             {/* Dashed dropzone */}
//             <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 p-8 text-center">
//               {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
//                 <Upload className="h-8 w-8 text-blue-500" />
//               </div> */}

//               {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
//                     <FileText className="h-10 w-10 text-red-500" />
//               </div> */}

//               <UploadStep
//                 onFilesSelect={onFilesSelect}
//                 accept={accept}
//                 multiple={multiple}
//                 uploadTitle={uploadTitle || "Drop your PDF file here"}
//                 uploadSubtitle={uploadSubtitle || "or click to browse"}
//                 uploadInfo={uploadInfo || "Max file size: 100MB"}
//               />

//               {/* FIX ✅ trust badges with proper contrast text-slate-600 */}
//               <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs font-medium text-slate-600">
//                 {/* <span className="flex items-center justify-center gap-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No signup
//                 </span>
//                 <span className="flex items-center justify-center gap-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No watermark
//                 </span>
//                 {/* <span className="flex items-center justify-center gap-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Auto-deleted
//                 </span> */}
//                 {/* <span className="flex items-center justify-center gap-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 100% free
//                 </span> */}
//               </div>
//             </div>

//             {/* Supports row */}
//             <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
//               <ShieldCheck className="h-4 w-4 text-emerald-500" />
//               Supports: PDF (Scanned or Digital)
//             </div>

//             {/* Secure banner */}
//             {/* <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
//               <div className="flex gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
//                   <Lock className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-900">Secure, Private & Encrypted</p> */}
//                   {/* FIX ✅ contrast: text-slate-500 */}
//                   {/* <p className="mt-0.5 text-xs text-slate-500">
//                     Your file is processed locally in your browser and never stored.
//                   </p>
//                 </div>
//               </div>
//             </div> */}

//             <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
//             <p className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
//                 <span>🖥️</span> Microsoft Word Compatibility
//             </p>
//             <ul className="space-y-1 text-xs text-slate-600">
//                 <li>• Converted files open best in <strong>Microsoft Word 2013 or newer</strong></li>
//                 <li>• Click <strong>"Enable Editing"</strong> when prompted — this is normal</li>
//                 <li>• Older Word versions may not fully support modern DOCX files</li>
//             </ul>
//             </div>
            
//           </div>
//         </section>

//         {/* ── FEATURES STRIP ── */}
//         <section className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm md:grid-cols-5">
//           {features.map((feat) => (
//             <div key={feat.title} className="flex flex-col items-center gap-2 bg-white px-4 py-6 text-center">
//               <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feat.bgColor}`}>
//                 <feat.icon className={`h-6 w-6 ${feat.iconColor}`} />
//               </div>
//               <p className="text-sm font-bold text-slate-900">{feat.title}</p>
//               <p className="text-xs text-slate-500">{feat.desc}</p>
//             </div>
//           ))}
//         </section>

//         {/* ── HOW TO + WHY CHOOSE ── */}
//         <section className="mt-6 grid gap-6 lg:grid-cols-2">

//           {/* How to Convert */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">How to Convert PDF to Word</h2>

//             <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr]">
//               <div>
//                 {[
//                   { n: "1", title: "Upload PDF", desc: "Drag & drop your PDF file or click to browse.", color: "bg-blue-600" },
//                   { n: "2", title: "Convert",    desc: "We convert your PDF to fully editable Word document.", color: "bg-purple-600" },
//                   { n: "3", title: "Download",   desc: "Download your Word file instantly. That's it!", color: "bg-emerald-600" },
//                 ].map(({ n, title, desc, color }, idx) => (
//                   <div key={n} className="flex gap-3">
//                     <div className="flex flex-col items-center">
//                       <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
//                         {n}
//                       </span>
//                       {idx < 2 && <div className="my-1 w-px flex-1 bg-slate-200" style={{ minHeight: 28 }} />}
//                     </div>
//                     <div className="pb-5">
//                       <p className="font-bold text-slate-900">{title}</p>
//                       <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col gap-4">
//                 <div className="flex items-center justify-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 py-6">
//                   <FileText className="h-14 w-14 text-red-500" />
//                   <div className="flex items-center gap-1">
//                     <Zap className="h-5 w-5 text-blue-500" />
//                     <span className="text-slate-300">· · ·</span>
//                     <Zap className="h-5 w-5 text-blue-500" />
//                   </div>
//                   <FileType2 className="h-14 w-14 text-blue-600" />
//                 </div>

//                 <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
//                   <p className="text-sm italic text-slate-600">
//                     "Best PDF to Word converter! Keeps the formatting almost perfect."
//                   </p>
//                   <div className="mt-2 flex items-center justify-between">
//                     <p className="text-sm font-bold text-slate-900">— Priya M., Freelancer</p>
//                     <div className="flex text-yellow-400">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Star key={i} className="h-3.5 w-3.5 fill-current" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Why Choose */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">Why Choose PDFLinx?</h2>

//             <div className="mt-5 space-y-3">
//               {whyItems.map((item) => (
//                 <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3.5">
//                   <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgColor}`}>
//                     <item.icon className={`h-5 w-5 ${item.iconColor}`} />
//                   </div>
//                   <div>
//                     <p className="font-bold text-slate-900">{item.title}</p>
//                     <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── STATS ── */}
//         {/* FIX ✅ colorful SVG icons (replaced plain emojis) */}
//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
//           <h2 className="text-center text-xl font-bold text-slate-900">
//             Trusted by Users Around the World
//           </h2>
//           <div className="mt-8 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
//             {stats.map(({ num, label, icon }) => (
//               <div key={label} className="flex flex-col items-center gap-3">
//                 {icon}
//                 <p className="text-2xl font-black text-slate-900">{num}</p>
//                 <p className="text-xs text-slate-500">{label}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── RELATED TOOLS ── */}
//         {/* FIX ✅ no accidental blue border on default — only hover */}
//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900">You Might Also Need</h2>
//           <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
//             {relatedTools.map((tool) => (
//               <Link
//                 key={tool.href}
//                 href={tool.href}
//                 className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-400 hover:shadow-sm"
//               >
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
//                   <FileText className="h-4 w-4 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">
//                     {tool.label}
//                   </p>
//                   <p className="mt-0.5 text-xs text-slate-500">{tool.desc}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* ── FAQ ── */}
//         <section className="mt-6">
//           <h2 className="text-center text-xl font-bold text-slate-900">
//             Frequently Asked Questions
//           </h2>
//           <div className="mt-6 grid gap-3 md:grid-cols-2">
//             {faqs.map((faq) => (
//               <details
//                 key={faq.q}
//                 className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 open:shadow-sm"
//               >
//                 <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-700">
//                   {faq.q}
//                   <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
//                 </summary>
//                 {/* FIX ✅ text-slate-500 for readable contrast */}
//                 <p className="mt-3 text-sm leading-6 text-slate-500">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </section>

//         {/* ── BOTTOM CTA ── */}
//         <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-7 md:p-10">
//           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//             <div>
//               <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white/90">
//                 ✦ 100% Free
//               </span>
//               <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
//                 Start Converting PDF to Word Now
//               </h2>
//               <p className="mt-1.5 text-sm text-white/75">
//                 Fast. Secure. Private. No sign up required.
//               </p>
//               <p className="mt-1 text-xs text-white/50">
//                 No uploads. No limits. No hidden charges.
//               </p>
//             </div>

//             {/* FIX ✅ icon color text-blue-600 (was text-red-500 — inconsistent) */}
//             <button
//               type="button"
//               onClick={() => {
//                 const input = document.querySelector('input[type="file"]');
//                 input?.click();
//               }}
//               className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-xl transition hover:bg-blue-50 active:scale-95"
//             >
//               <FileText className="h-4 w-4 text-blue-600" />
//               Choose PDF File
//             </button>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }


























// // // components/ToolFlow/UploadLandingStep.jsx
// // "use client";

// // import Link from "next/link";
// // import {
// //   ShieldCheck,
// //   Zap,
// //   Target,
// //   MonitorSmartphone,
// //   Infinity,
// //   FileText,
// //   FileType2,
// //   Lock,
// //   Star,
// //   CheckCircle2,
// //   Gift,
// //   UserPlus,
// //   ScanText,
// //   LayoutTemplate,
// //   ChevronDown,
// //   Upload,
// // } from "lucide-react";
// // import UploadStep from "./UploadStep";

// // const relatedTools = [
// //   { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert back to PDF" },
// //   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size" },
// //   { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs" },
// //   { label: "Split PDF", href: "/split-pdf", desc: "Separate PDF pages" },
// //   { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Extract PDF tables" },
// //   { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs readable" },
// // ];

// // const faqs = [
// //   {
// //     q: "Is PDFLinx PDF to Word converter free?",
// //     a: "Yes, 100% free. No hidden charges, no subscriptions, no limits.",
// //   },
// //   {
// //     q: "Will my PDF formatting be preserved?",
// //     a: "Yes, our converter maintains fonts, images, tables, and layout.",
// //   },
// //   {
// //     q: "Do I need to sign up?",
// //     a: "No account or sign up needed. Just upload and convert instantly.",
// //   },
// //   {
// //     q: "What is the maximum file size?",
// //     a: "You can upload PDF files up to 100MB in size.",
// //   },
// //   {
// //     q: "Can I convert scanned PDFs to Word?",
// //     a: "Yes! Our OCR technology extracts text from scanned PDFs accurately.",
// //   },
// //   {
// //     q: "Is my file secure?",
// //     a: "Absolutely. Files are processed in your browser and never stored on our servers.",
// //   },
// //   {
// //     q: "Can I convert PDF to Word on mobile?",
// //     a: "Yes, PDFLinx works on all devices including mobile and tablet.",
// //   },
// //   {
// //     q: "What happens to my files after conversion?",
// //     a: "Files are automatically deleted. Nothing is stored on our servers.",
// //   },
// // ];

// // const features = [
// //   {
// //     icon: Zap,
// //     title: "Instant Conversion",
// //     desc: "Results in seconds",
// //     iconColor: "text-yellow-500",
// //     bgColor: "bg-yellow-50",
// //   },
// //   {
// //     icon: Target,
// //     title: "High Accuracy",
// //     desc: "Best formatting retention",
// //     iconColor: "text-purple-500",
// //     bgColor: "bg-purple-50",
// //   },
// //   {
// //     icon: ScanText,
// //     title: "OCR Powered",
// //     desc: "Scanned PDFs supported",
// //     iconColor: "text-blue-500",
// //     bgColor: "bg-blue-50",
// //   },
// //   {
// //     icon: MonitorSmartphone,
// //     title: "Works Everywhere",
// //     desc: "Desktop, tablet, mobile",
// //     iconColor: "text-orange-500",
// //     bgColor: "bg-orange-50",
// //   },
// //   {
// //     icon: Infinity,
// //     title: "100% Free",
// //     desc: "No limits. No hidden fees",
// //     iconColor: "text-red-500",
// //     bgColor: "bg-red-50",
// //   },
// // ];

// // const whyItems = [
// //   {
// //     icon: LayoutTemplate,
// //     title: "Perfect Formatting",
// //     desc: "Maintain fonts, images, tables & layout.",
// //     iconColor: "text-blue-500",
// //     bgColor: "bg-blue-50",
// //   },
// //   {
// //     icon: ScanText,
// //     title: "OCR Technology",
// //     desc: "Extract text from scanned PDFs accurately.",
// //     iconColor: "text-teal-500",
// //     bgColor: "bg-teal-50",
// //   },
// //   {
// //     icon: Lock,
// //     title: "No File Uploads",
// //     desc: "Your files never leave your device.",
// //     iconColor: "text-purple-500",
// //     bgColor: "bg-purple-50",
// //   },
// //   {
// //     icon: UserPlus,
// //     title: "No Sign Up Required",
// //     desc: "Use the tool instantly without registration.",
// //     iconColor: "text-orange-500",
// //     bgColor: "bg-orange-50",
// //   },
// //   {
// //     icon: Gift,
// //     title: "Free Forever",
// //     desc: "Convert as many files as you want.",
// //     iconColor: "text-pink-500",
// //     bgColor: "bg-pink-50",
// //   },
// // ];

// // const stats = [
// //   { num: "2M+", label: "Files Converted", icon: "📄" },
// //   { num: "23+", label: "Free PDF Tools", icon: "🔧" },
// //   { num: "100%", label: "Browser-Based", icon: "🌐" },
// //   { num: "0", label: "Uploads to Server", icon: "🛡️" },
// // ];

// // export default function UploadLandingStep({
// //   onFilesSelect,
// //   accept,
// //   multiple,
// //   uploadTitle,
// //   uploadSubtitle,
// //   uploadInfo,
// // }) {
// //   return (
// //     <div className="bg-white">
// //       <div className="mx-auto w-full max-w-[1180px] px-5 py-8 md:py-12">

// //         {/* ── Breadcrumb + Trust Pills ── */}
// //         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
// //           {/* Breadcrumb */}
// //           <nav className="flex items-center gap-1.5 text-xs text-slate-400">
// //             <Link href="/" className="hover:text-slate-600">Home</Link>
// //             <span>›</span>
// //             <Link href="/pdf-tools" className="hover:text-slate-600">PDF Tools</Link>
// //             <span>›</span>
// //             <span className="text-slate-600 font-medium">PDF to Word Converter</span>
// //           </nav>

// //           {/* Trust pills */}
// //           <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500">
// //             <span className="inline-flex items-center gap-1.5">
// //               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
// //               100% Free
// //             </span>
// //             <span className="inline-flex items-center gap-1.5">
// //               <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
// //               No Sign Up
// //             </span>
// //             <span className="inline-flex items-center gap-1.5">
// //               <Zap className="h-3.5 w-3.5 text-blue-500" />
// //               No Watermark
// //             </span>
// //           </div>
// //         </div>

// //         {/* ── HERO ── */}
// //         <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">

// //           {/* Left copy */}
// //           <div>
// //             <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-blue-600">
// //               PDF to Word Converter
// //             </p>

// //             <h1 className="max-w-[540px] text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
// //               Convert PDF to Word{" "}
// //               <br className="hidden md:block" />
// //               in{" "}
// //               <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
// //                 Seconds ⚡
// //               </span>
// //             </h1>

// //             <p className="mt-4 max-w-[500px] text-base leading-7 text-slate-600">
// //               Convert PDF to editable Word documents with perfect formatting.
// //               Fast, free and 100% secure — your files never leave your browser.
// //             </p>

// //             {/* Check list */}
// //             <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
// //               {[
// //                 "Maintains original formatting & layout",
// //                 "OCR powered — works on scanned PDFs",
// //                 "100% Private — files never uploaded",
// //                 "Works on any device — no software needed",
// //               ].map((item) => (
// //                 <li key={item} className="flex items-center gap-2">
// //                   <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
// //                   {item}
// //                 </li>
// //               ))}
// //             </ul>

// //             {/* Privacy box */}
// //             <div className="mt-6 max-w-[420px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
// //               <div className="flex gap-3">
// //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
// //                   <ShieldCheck className="h-5 w-5 text-blue-600" />
// //                 </div>
// //                 <div>
// //                   <p className="font-bold text-slate-900">Your files stay private</p>
// //                   <p className="mt-0.5 text-xs text-slate-500">
// //                     All processing happens in your browser.
// //                     No uploads. No servers. No worries.
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Rating */}
// //             <div className="mt-4 flex items-center gap-2">
// //               <div className="flex text-yellow-400">
// //                 {Array.from({ length: 5 }).map((_, i) => (
// //                   <Star key={i} className="h-4 w-4 fill-current" />
// //                 ))}
// //               </div>
// //               <span className="text-sm font-bold text-slate-900">4.9/5</span>
// //               <span className="text-sm text-slate-500">
// //                 Trusted by thousands of users worldwide.
// //               </span>
// //             </div>
// //           </div>

// //           {/* Right — Upload Card */}
// //           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">

// //             {/* Dashed dropzone */}
// //             <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 p-8 text-center">
// //               {/* Cloud upload icon */}
// //               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
// //                 <Upload className="h-8 w-8 text-blue-500" />
// //               </div>

// //               <UploadStep
// //                 onFilesSelect={onFilesSelect}
// //                 accept={accept}
// //                 multiple={multiple}
// //                 uploadTitle={uploadTitle || "Drop your PDF file here"}
// //                 uploadSubtitle={uploadSubtitle || "or click to browse"}
// //                 uploadInfo={uploadInfo || "Max file size: 100MB"}
// //               />
// //             </div>

// //             {/* Supports row */}
// //             <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
// //               <ShieldCheck className="h-4 w-4 text-emerald-500" />
// //               Supports: PDF (Scanned or Digital)
// //             </div>

// //             {/* Secure banner */}
// //             <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
// //               <div className="flex gap-3">
// //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
// //                   <Lock className="h-5 w-5 text-emerald-600" />
// //                 </div>
// //                 <div>
// //                   <p className="font-bold text-slate-900">Secure, Private & Encrypted</p>
// //                   <p className="mt-0.5 text-xs text-slate-500">
// //                     Your file is processed locally in your browser and never stored.
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── FEATURES STRIP ── */}
// //         <section className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm md:grid-cols-5">
// //           {features.map((feat) => (
// //             <div
// //               key={feat.title}
// //               className="flex flex-col items-center gap-2 bg-white px-4 py-6 text-center"
// //             >
// //               <div
// //                 className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feat.bgColor}`}
// //               >
// //                 <feat.icon className={`h-6 w-6 ${feat.iconColor}`} />
// //               </div>
// //               <p className="text-sm font-bold text-slate-900">{feat.title}</p>
// //               <p className="text-xs text-slate-500">{feat.desc}</p>
// //             </div>
// //           ))}
// //         </section>

// //         {/* ── HOW TO + WHY CHOOSE ── */}
// //         <section className="mt-6 grid gap-6 lg:grid-cols-2">

// //           {/* How to Convert */}
// //           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //             <h2 className="text-xl font-bold text-slate-900">
// //               How to Convert PDF to Word
// //             </h2>

// //             <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr]">
// //               {/* Steps */}
// //               <div className="space-y-0">
// //                 {[
// //                   { n: "1", title: "Upload PDF", desc: "Drag & drop your PDF file or click to browse.", color: "bg-blue-600" },
// //                   { n: "2", title: "Convert", desc: "We convert your PDF to fully editable Word document.", color: "bg-purple-600" },
// //                   { n: "3", title: "Download", desc: "Download your Word file instantly. That's it!", color: "bg-emerald-600" },
// //                 ].map(({ n, title, desc, color }, idx) => (
// //                   <div key={n} className="flex gap-3">
// //                     <div className="flex flex-col items-center">
// //                       <span
// //                         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
// //                       >
// //                         {n}
// //                       </span>
// //                       {idx < 2 && (
// //                         <div className="my-1 w-px flex-1 bg-slate-200" style={{ minHeight: 28 }} />
// //                       )}
// //                     </div>
// //                     <div className="pb-5">
// //                       <p className="font-bold text-slate-900">{title}</p>
// //                       <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Visual + Testimonial */}
// //               <div className="flex flex-col gap-4">
// //                 <div className="flex items-center justify-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 py-6">
// //                   <FileText className="h-14 w-14 text-red-500" />
// //                   <div className="flex items-center gap-1">
// //                     <Zap className="h-5 w-5 text-blue-500" />
// //                     <span className="text-slate-300">· · ·</span>
// //                     <Zap className="h-5 w-5 text-blue-500" />
// //                   </div>
// //                   <FileType2 className="h-14 w-14 text-blue-600" />
// //                 </div>

// //                 <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
// //                   <p className="text-sm italic text-slate-600">
// //                     "Best PDF to Word converter! Keeps the formatting almost perfect."
// //                   </p>
// //                   <div className="mt-2 flex items-center justify-between">
// //                     <p className="text-sm font-bold text-slate-900">— Priya M., Freelancer</p>
// //                     <div className="flex text-yellow-400">
// //                       {Array.from({ length: 5 }).map((_, i) => (
// //                         <Star key={i} className="h-3.5 w-3.5 fill-current" />
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Why Choose */}
// //           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //             <h2 className="text-xl font-bold text-slate-900">Why Choose PDFLinx?</h2>

// //             <div className="mt-5 space-y-3">
// //               {whyItems.map((item) => (
// //                 <div
// //                   key={item.title}
// //                   className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3.5"
// //                 >
// //                   <div
// //                     className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgColor}`}
// //                   >
// //                     <item.icon className={`h-5 w-5 ${item.iconColor}`} />
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-slate-900">{item.title}</p>
// //                     <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* ── STATS ── */}
// //         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
// //           <h2 className="text-center text-xl font-bold text-slate-900">
// //             Trusted by Users Around the World
// //           </h2>

// //           <div className="mt-8 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
// //             {stats.map(({ num, label, icon }) => (
// //               <div key={label} className="flex flex-col items-center gap-2">
// //                 <span className="text-3xl">{icon}</span>
// //                 <p className="text-2xl font-black text-slate-900">{num}</p>
// //                 <p className="text-xs text-slate-500">{label}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ── RELATED TOOLS ── */}
// //         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <h2 className="text-xl font-bold text-slate-900">You Might Also Need</h2>

// //           <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
// //             {relatedTools.map((tool) => (
// //               <Link
// //                 key={tool.href}
// //                 href={tool.href}
// //                 className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-400 hover:shadow-sm"
// //               >
// //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
// //                   <FileText className="h-4 w-4 text-blue-500" />
// //                 </div>
// //                 <div>
// //                   <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
// //                     {tool.label}
// //                   </p>
// //                   <p className="mt-0.5 text-xs text-slate-500">{tool.desc}</p>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ── FAQ ── */}
// //         <section className="mt-6">
// //           <h2 className="text-center text-xl font-bold text-slate-900">
// //             Frequently Asked Questions
// //           </h2>

// //           <div className="mt-6 grid gap-3 md:grid-cols-2">
// //             {faqs.map((faq) => (
// //               <details
// //                 key={faq.q}
// //                 className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 open:shadow-sm"
// //               >
// //                 <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-700">
// //                   {faq.q}
// //                   <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
// //                 </summary>
// //                 <p className="mt-3 text-sm leading-6 text-slate-500">{faq.a}</p>
// //               </details>
// //             ))}
// //           </div>
// //         </section>

// //         {/* ── BOTTOM CTA ── */}
// //         <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-7 md:p-10">
// //           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
// //             <div>
// //               <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white/90">
// //                 ✦ 100% Free
// //               </span>
// //               <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
// //                 Start Converting PDF to Word Now
// //               </h2>
// //               <p className="mt-1.5 text-sm text-white/75">
// //                 Fast. Secure. Private. No sign up required.
// //               </p>
// //               <p className="mt-1 text-xs text-white/50">
// //                 No uploads. No limits. No hidden charges.
// //               </p>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={() => {
// //                 const input = document.querySelector('input[type="file"]');
// //                 input?.click();
// //               }}
// //               className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-xl transition hover:bg-blue-50 active:scale-95"
// //             >
// //               <FileText className="h-4 w-4 text-red-500" />
// //               Choose PDF File
// //             </button>
// //           </div>
// //         </section>

// //       </div>
// //     </div>
// //   );
// // }


























// // // // components/ToolFlow/UploadLandingStep.jsx
// // // "use client";

// // // import Link from "next/link";
// // // import {
// // //   ShieldCheck,
// // //   Zap,
// // //   Target,
// // //   MonitorSmartphone,
// // //   Infinity,
// // //   FileText,
// // //   FileType2,
// // //   Lock,
// // //   Star,
// // //   CheckCircle2,
// // //   Gift,
// // //   UserPlus,
// // //   ScanText,
// // //   LayoutTemplate,
// // // } from "lucide-react";
// // // import UploadStep from "./UploadStep";

// // // const relatedTools = [
// // //   { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert back to PDF" },
// // //   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size" },
// // //   { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs" },
// // //   { label: "Split PDF", href: "/split-pdf", desc: "Separate PDF pages" },
// // //   { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Extract PDF tables" },
// // //   { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs readable" },
// // // ];

// // // const faqs = [
// // //   "Is PDFLinx PDF to Word converter free?",
// // //   "Will my PDF formatting be preserved?",
// // //   "Do I need to sign up?",
// // //   "What is the maximum file size?",
// // //   "Can I convert scanned PDFs to Word?",
// // //   "Is my file secure?",
// // // ];

// // // export default function UploadLandingStep({
// // //   onFilesSelect,
// // //   accept,
// // //   multiple,
// // //   uploadTitle,
// // //   uploadSubtitle,
// // //   uploadInfo,
// // // }) {
// // //   return (
// // //     <div className="bg-white">
// // //       <div className="mx-auto w-full max-w-[1180px] px-5 py-8 md:py-12">
// // //         {/* Top trust row */}
// // //         <div className="mb-8 flex flex-wrap items-center justify-end gap-5 text-xs font-bold text-slate-500">
// // //           <span className="inline-flex items-center gap-1.5">
// // //             <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Free
// // //           </span>
// // //           <span className="inline-flex items-center gap-1.5">
// // //             <ShieldCheck className="h-4 w-4 text-emerald-500" /> No Sign Up
// // //           </span>
// // //           <span className="inline-flex items-center gap-1.5">
// // //             <Zap className="h-4 w-4 text-blue-500" /> No Watermark
// // //           </span>
// // //         </div>

// // //         {/* Hero */}
// // //         <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
// // //           {/* Left */}
// // //           <div>
// // //             <p className="mb-4 text-xs font-extrabold uppercase tracking-wide text-blue-600">
// // //               PDF TO WORD CONVERTER
// // //             </p>

// // //             <h1 className="max-w-[560px] text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
// // //               Convert PDF to Word in{" "}
// // //               <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
// // //                 Seconds ⚡
// // //               </span>
// // //             </h1>

// // //             <p className="mt-5 max-w-[560px] text-base leading-7 text-slate-600 md:text-lg">
// // //               Convert PDF to editable Word documents with perfect formatting.
// // //               Fast, free and secure — no signup required.
// // //             </p>

// // //             <div className="mt-6 space-y-3 text-sm font-semibold text-slate-600">
// // //               <p className="flex items-center gap-2">
// // //                 <CheckCircle2 className="h-4 w-4 text-blue-500" />
// // //                 Maintains original formatting & layout
// // //               </p>
// // //               <p className="flex items-center gap-2">
// // //                 <CheckCircle2 className="h-4 w-4 text-blue-500" />
// // //                 OCR powered — works on scanned PDFs
// // //               </p>
// // //               <p className="flex items-center gap-2">
// // //                 <CheckCircle2 className="h-4 w-4 text-blue-500" />
// // //                 Works on any device — no software needed
// // //               </p>
// // //             </div>

// // //             <div className="mt-7 grid max-w-[420px] gap-4">
// // //               <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
// // //                 <div className="flex gap-3">
// // //                   <ShieldCheck className="h-6 w-6 text-blue-600" />
// // //                   <div>
// // //                     <p className="font-bold text-slate-900">
// // //                       Your files stay private
// // //                     </p>
// // //                     <p className="mt-1 text-sm text-slate-500">
// // //                       No signup, no watermark, and files are auto-deleted.
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               <div className="rounded-2xl border border-yellow-100 bg-yellow-50/70 p-4">
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="flex text-yellow-400">
// // //                     {Array.from({ length: 5 }).map((_, i) => (
// // //                       <Star key={i} className="h-4 w-4 fill-current" />
// // //                     ))}
// // //                   </div>
// // //                   <div>
// // //                     <p className="font-bold text-slate-900">4.9/5</p>
// // //                     <p className="text-sm text-slate-500">
// // //                       Trusted by users worldwide.
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Right upload card */}
// // //           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
// // //             <div className="rounded-[22px] bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5">
// // //               <UploadStep
// // //                 onFilesSelect={onFilesSelect}
// // //                 accept={accept}
// // //                 multiple={multiple}
// // //                 uploadTitle={uploadTitle || "Drop your PDF file here"}
// // //                 uploadSubtitle={uploadSubtitle || "or click to browse"}
// // //                 uploadInfo={uploadInfo}
// // //               />
// // //             </div>

// // //             <div className="mt-5 text-center text-sm font-semibold text-slate-600">
// // //               <span className="inline-flex items-center gap-2">
// // //                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
// // //                 Supports: PDF (Scanned or Digital)
// // //               </span>
// // //             </div>

// // //             <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
// // //               <div className="flex gap-3">
// // //                 <Lock className="h-5 w-5 text-emerald-600" />
// // //                 <div>
// // //                   <p className="font-bold text-slate-900">
// // //                     Secure, Private & Encrypted
// // //                   </p>
// // //                   <p className="text-sm text-slate-500">
// // //                     Your file is processed securely and never shared.
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* Feature strip */}
// // //         <section className="mt-14 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-5">
// // //           {[
// // //             { icon: Zap, title: "Instant Conversion", desc: "Results in seconds", color: "text-emerald-500 bg-emerald-50" },
// // //             { icon: Target, title: "High Accuracy", desc: "Best formatting retention", color: "text-violet-500 bg-violet-50" },
// // //             { icon: ScanText, title: "OCR Powered", desc: "Scanned PDFs supported", color: "text-blue-500 bg-blue-50" },
// // //             { icon: MonitorSmartphone, title: "Works Everywhere", desc: "Desktop, tablet, mobile", color: "text-orange-500 bg-orange-50" },
// // //             { icon: Infinity, title: "100% Free", desc: "No hidden fees", color: "text-pink-500 bg-pink-50" },
// // //           ].map((item) => (
// // //             <div key={item.title} className="text-center">
// // //               <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
// // //                 <item.icon className="h-6 w-6" />
// // //               </div>
// // //               <p className="mt-3 font-bold text-slate-900">{item.title}</p>
// // //               <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
// // //             </div>
// // //           ))}
// // //         </section>

// // //         {/* How + Why */}
// // //         <section className="mt-8 grid gap-6 lg:grid-cols-2">
// // //           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// // //             <h2 className="text-2xl font-bold text-slate-900">
// // //               How to Convert PDF to Word
// // //             </h2>

// // //             <div className="mt-6 grid gap-5 md:grid-cols-[180px_1fr]">
// // //               <div className="space-y-7">
// // //                 {[
// // //                   ["1", "Upload PDF", "Drag & drop your PDF file"],
// // //                   ["2", "Convert", "We convert it to Word"],
// // //                   ["3", "Download", "Get your DOCX instantly"],
// // //                 ].map(([n, title, desc]) => (
// // //                   <div key={n} className="flex gap-3">
// // //                     <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
// // //                       {n}
// // //                     </span>
// // //                     <div>
// // //                       <p className="font-bold text-slate-900">{title}</p>
// // //                       <p className="text-xs text-slate-500">{desc}</p>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
// // //                 <div className="flex items-center justify-center gap-6">
// // //                   <FileText className="h-16 w-16 text-red-500" />
// // //                   <span className="text-2xl text-blue-500">⚡</span>
// // //                   <FileType2 className="h-16 w-16 text-blue-600" />
// // //                 </div>
// // //                 <div className="mt-5 rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
// // //                   “Best PDF to Word converter! Keeps the formatting almost
// // //                   perfect.”
// // //                   <p className="mt-2 font-bold text-slate-900">— Priya M.</p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// // //             <h2 className="text-2xl font-bold text-slate-900">
// // //               Why Choose PDFLinx?
// // //             </h2>

// // //             <div className="mt-6 space-y-3">
// // //               {[
// // //                 { icon: LayoutTemplate, title: "Perfect Formatting", desc: "Maintain fonts, images, tables & layout.", color: "text-blue-600 bg-blue-50" },
// // //                 { icon: ScanText, title: "OCR Technology", desc: "Extract text from scanned PDFs accurately.", color: "text-emerald-600 bg-emerald-50" },
// // //                 { icon: Lock, title: "No File Uploads", desc: "Your files stay private and secure.", color: "text-purple-600 bg-purple-50" },
// // //                 { icon: UserPlus, title: "No Sign Up Required", desc: "Use instantly without registration.", color: "text-orange-600 bg-orange-50" },
// // //                 { icon: Gift, title: "Free Forever", desc: "Convert files without hidden charges.", color: "text-pink-600 bg-pink-50" },
// // //               ].map((item) => (
// // //                 <div key={item.title} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
// // //                   <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
// // //                     <item.icon className="h-5 w-5" />
// // //                   </div>
// // //                   <div>
// // //                     <p className="font-bold text-slate-900">{item.title}</p>
// // //                     <p className="text-sm text-slate-500">{item.desc}</p>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* Related tools */}
// // //         <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// // //           <h2 className="text-2xl font-bold text-slate-900">
// // //             You Might Also Need
// // //           </h2>

// // //           <div className="mt-5 grid gap-4 md:grid-cols-3">
// // //             {relatedTools.map((tool) => (
// // //               <Link
// // //                 key={tool.href}
// // //                 href={tool.href}
// // //                 className="group rounded-2xl border border-slate-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
// // //               >
// // //                 <p className="font-bold text-slate-900 group-hover:text-blue-600">
// // //                   {tool.label}
// // //                 </p>
// // //                 <p className="mt-1 text-sm text-slate-500">{tool.desc}</p>
// // //               </Link>
// // //             ))}
// // //           </div>
// // //         </section>

// // //         {/* Stats */}
// // //         <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// // //           <h2 className="text-center text-2xl font-bold text-slate-900">
// // //             Trusted by Users Around the World
// // //           </h2>

// // //           <div className="mt-6 grid gap-5 text-center md:grid-cols-4">
// // //             {[
// // //               ["2M+", "Files Converted"],
// // //               ["23+", "Free PDF Tools"],
// // //               ["100%", "Browser-Based"],
// // //               ["0", "Hidden Fees"],
// // //             ].map(([num, label]) => (
// // //               <div key={label}>
// // //                 <p className="text-2xl font-black text-slate-900">{num}</p>
// // //                 <p className="text-sm text-slate-500">{label}</p>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </section>

// // //         {/* FAQ */}
// // //         <section className="mt-8">
// // //           <h2 className="text-center text-2xl font-bold text-slate-900">
// // //             Frequently Asked Questions
// // //           </h2>

// // //           <div className="mt-6 grid gap-4 md:grid-cols-2">
// // //             {faqs.map((q) => (
// // //               <div
// // //                 key={q}
// // //                 className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700"
// // //               >
// // //                 {q}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </section>

// // //         {/* Bottom CTA */}
// // //         <section className="mt-10 rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white md:p-8">
// // //           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
// // //             <div>
// // //               <p className="text-xs font-bold uppercase text-white/80">
// // //                 100% Free
// // //               </p>
// // //               <h2 className="mt-2 text-2xl font-black">
// // //                 Start Converting PDF to Word Now
// // //               </h2>
// // //               <p className="mt-1 text-sm text-white/80">
// // //                 Fast. Secure. Private. No sign up required.
// // //               </p>
// // //             </div>

// // //             <button
// // //               type="button"
// // //               onClick={() => {
// // //                 const input = document.querySelector('input[type="file"]');
// // //                 input?.click();
// // //               }}
// // //               className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
// // //             >
// // //               Choose PDF File
// // //             </button>
// // //           </div>
// // //         </section>
// // //       </div>
// // //     </div>
// // //   );
// // // }
























// // // // // components/ToolFlow/UploadLandingStep.jsx
// // // // "use client";

// // // // import UploadStep from "./UploadStep";

// // // // export default function UploadLandingStep({
// // // //   title,
// // // //   tagline,
// // // //   onFilesSelect,
// // // //   accept,
// // // //   multiple,
// // // //   uploadTitle,
// // // //   uploadSubtitle,
// // // //   uploadInfo,
// // // // }) {
// // // //   return (
// // // //     <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
      
// // // //       {/* Hero */}
// // // //       <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        
// // // //         {/* Left Content */}
// // // //         <div>
// // // //           <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
// // // //             Convert PDF to Word <br /> in Seconds
// // // //           </h1>

// // // //           <p className="mt-4 text-lg text-slate-600">
// // // //             Free online PDF to Word converter. No signup required. 
// // // //             Convert your PDFs into fully editable DOCX files instantly.
// // // //           </p>

// // // //           <div className="mt-6 space-y-2 text-sm text-slate-700">
// // // //             <p>✓ High accuracy conversion</p>
// // // //             <p>✓ OCR for scanned PDFs</p>
// // // //             <p>✓ Works on all devices</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Right Upload Box */}
// // // //         <div>
// // // //           <UploadStep
// // // //             onFilesSelect={onFilesSelect}
// // // //             accept={accept}
// // // //             multiple={multiple}
// // // //             uploadTitle={uploadTitle}
// // // //             uploadSubtitle={uploadSubtitle}
// // // //             uploadInfo={uploadInfo}
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Features Strip */}
// // // //       <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
// // // //         {[
// // // //           "Fast Conversion",
// // // //           "Secure Files",
// // // //           "No Watermark",
// // // //           "100% Free",
// // // //         ].map((f) => (
// // // //           <div key={f} className="rounded-xl bg-white p-4 shadow-sm border">
// // // //             <p className="text-sm font-semibold text-slate-700">{f}</p>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* How To */}
// // // //       <div className="mt-16">
// // // //         <h2 className="text-2xl font-bold text-slate-900 text-center">
// // // //           How to Convert PDF to Word
// // // //         </h2>

// // // //         <div className="mt-6 grid gap-6 md:grid-cols-3 text-center">
// // // //           {[
// // // //             "Upload your PDF file",
// // // //             "Click convert",
// // // //             "Download your Word file",
// // // //           ].map((step, i) => (
// // // //             <div key={i} className="rounded-xl border p-5 bg-white">
// // // //               <p className="text-lg font-bold text-blue-600">{i + 1}</p>
// // // //               <p className="mt-2 text-sm text-slate-600">{step}</p>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Related Tools */}
// // // //       <div className="mt-16">
// // // //         <h3 className="text-xl font-bold text-slate-900 text-center">
// // // //           You might also need
// // // //         </h3>

// // // //         <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
// // // //           {[
// // // //             "Word to PDF",
// // // //             "Merge PDF",
// // // //             "Compress PDF",
// // // //             "Split PDF",
// // // //           ].map((tool) => (
// // // //             <div
// // // //               key={tool}
// // // //               className="rounded-xl border p-4 bg-white text-center text-sm font-semibold text-slate-700 hover:border-green-500 cursor-pointer"
// // // //             >
// // // //               {tool}
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //     </div>
// // // //   );
// // // // }