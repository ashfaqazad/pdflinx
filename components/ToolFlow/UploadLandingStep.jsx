// components/ToolFlow/UploadLandingStep.jsx
"use client";
import { useEffect, useRef, useState } from "react";

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
  Upload,
  Layers,
  Sparkles,
  Timer,
  Image,
  FileImage,
  Minimize2,
  GitMerge,
} from "lucide-react";

import UploadStep from "./UploadStep";

/* ─────────────────────────────────────────
   DEFAULT DATA  (same keys as before)
───────────────────────────────────────── */
const defaultRelatedTools = [
  { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert back to PDF", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", icon: FileMinus, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", icon: FilePlus, iconColor: "text-violet-500", bgColor: "bg-violet-50" },
  { label: "Split PDF", href: "/split-pdf", desc: "Separate PDF pages", icon: Scissors, iconColor: "text-pink-500", bgColor: "bg-pink-50" },
  { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Extract PDF tables", icon: FileSpreadsheet, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs readable", icon: FileSearch, iconColor: "text-teal-500", bgColor: "bg-teal-50" },
];

const defaultFaqs = [
  { q: "Is PDFLinx PDF to Word converter free?", a: "Yes, completely free. No hidden fees, no premium plan required. You can convert as many PDFs as you like without paying anything." },
  { q: "Can I convert scanned PDFs?", a: "Yes! Enable the OCR option before converting. Our OCR engine will extract text from image-based PDFs and create a fully editable Word document." },
  { q: "Will formatting be preserved?", a: "For standard PDFs, formatting is preserved very accurately — including text, tables, columns, and images. Scanned PDFs may have slight variations depending on scan quality." },
  { q: "Is my file secure?", a: "Absolutely. All files are processed over an encrypted connection and are automatically deleted from our servers after 1 hour. We never share or store your documents." },
  { q: "Can I convert multiple PDFs at once?", a: "Yes! Upload multiple PDF files and they'll all be converted and packaged into a single ZIP file for easy download." },
  { q: "What is the maximum file size?", a: "The maximum file size is 10 MB per file. For larger files, try compressing your PDF first using our free PDF Compress tool." },
  { q: "Does PDFLinx add a watermark?", a: "No watermarks, ever. Your converted Word document is completely clean and ready to use or share as-is." },
  { q: "Do I need to sign up?", a: "No account is required. Upload your file and convert instantly." },
];

const defaultFeatures = [
  { icon: Zap, title: "Instant Conversion", desc: "Results in seconds", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
  { icon: Target, title: "High Accuracy", desc: "Clean output quality", iconColor: "text-violet-500", bgColor: "bg-violet-50" },
  { icon: ShieldCheck, title: "Secure Files", desc: "Auto-deleted after processing", iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  { icon: MonitorSmartphone, title: "Works Everywhere", desc: "Desktop, tablet, mobile", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { icon: Infinity, title: "100% Free", desc: "No hidden fees", iconColor: "text-rose-500", bgColor: "bg-rose-50" },
];

const defaultWhyItems = [
  { icon: LayoutTemplate, title: "Clean Formatting", desc: "Your converted file looks exactly like the original — text, tables, and images preserved.", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { icon: Lock, title: "Private & Secure", desc: "Files are processed on secure servers and automatically deleted after 1 hour.", iconColor: "text-violet-500", bgColor: "bg-violet-50" },
  { icon: UserPlus, title: "No Sign Up Required", desc: "Use instantly without registration. No email, no account, no friction whatsoever.", iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { icon: Gift, title: "Free Forever", desc: "No hidden fees, no premium tiers. Convert as many PDFs as you need at zero cost.", iconColor: "text-pink-500", bgColor: "bg-pink-50" },
  { icon: MonitorSmartphone, title: "Works Everywhere", desc: "Desktop, tablet, mobile — use PDFLinx directly in your browser on any device or OS.", iconColor: "text-teal-500", bgColor: "bg-teal-50" },
  { icon: Zap, title: "Lightning Fast", desc: "Most conversions complete in under 30 seconds. No waiting, no queues.", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
];

const defaultStats = [
  { num: "4.9★", label: "User Rating" },
  { num: "50K+", label: "Monthly Users" },
  { num: "<30s", label: "Avg. Conversion Time" },
  { num: "100%", label: "Free, Always" },
];

/* ─────────────────────────────────────────
   SMALL REUSABLE PIECES
───────────────────────────────────────── */

/** Animated green "live" badge */
function HeroBadge({ text = "100% Free · No Signup Required" }) {
  return (
    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      {text}
    </span>
  );
}

/** Small pill chip */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      {children}
    </span>
  );
}

/** Section eyebrow label */
function Eyebrow({ children, color = "text-rose-600" }) {
  return (
    <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${color}`}>
      {children}
    </p>
  );
}

/** Large serif section heading */
function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={`font-display text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}
// function SectionTitle({ children, className = "" }) {
//   return (
//     <h2 className={`font-serif text-3xl font-normal leading-tight tracking-tight text-stone-900 sm:text-4xl ${className}`}>
//       {children}
//     </h2>
//   );
// }

/** Muted section subtitle */
function SectionSub({ children }) {
  return (
    <p className="mt-2 max-w-xl text-base font-light leading-relaxed text-stone-500">
      {children}
    </p>
  );
}

function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible
        ? "translate-y-0 opacity-100"
        : "translate-y-10 opacity-0"
        }`}
    >
      {children}
    </div>
  );
}


/* ─────────────────────────────────────────
   HERO UPLOAD BOX  (right column)
───────────────────────────────────────── */
function HeroUploadBox({ onFilesSelect, accept, multiple, uploadTitle, uploadSubtitle, uploadInfo, content }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-[0_0_0_4px_rgba(232,66,10,0.08)]">
      {/* subtle radial glow top-center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,66,10,0.04) 0%, transparent 65%)" }}
      />

      {/* Icon */}
      {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
        <Upload className="h-7 w-7 text-rose-500" />
      </div> */}

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fce7f3] mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#c4b5fd]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" />
          <path d="M8 13h8v1H8zm0 3h8v1H8zm0-6h4v1H8z" fill="#a78bfa" />
        </svg>
      </div>


      <p className="mb-1 text-lg font-semibold text-stone-900">
        {uploadTitle || content?.uploadTitle || "Drop your PDF here"}
      </p>
      <p className="mb-5 text-sm text-stone-400">
        {uploadSubtitle || content?.uploadSubtitle || "or click to browse — PDF files supported"}
      </p>

      {/* Actual upload trigger (UploadStep renders the input/button) */}
      {/* <UploadStep
        onFilesSelect={onFilesSelect}
        accept={accept}
        multiple={multiple}
        uploadTitle=""
        uploadSubtitle=""
        uploadInfo={uploadInfo || content?.uploadInfo || null}
        buttonClassName="inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(232,66,10,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(232,66,10,0.36)]"
        buttonLabel="Choose File"
      /> */}

      <UploadStep
        onFilesSelect={onFilesSelect}
        accept={accept}
        multiple={multiple}
      >
        {({ open, dragging }) => (
          <div
            onClick={open}
            className={`relative z-10 cursor-pointer ${dragging ? "opacity-80" : ""
              }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#e8420a] px-8 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(232,66,10,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#d63a07] hover:shadow-[0_6px_20px_rgba(232,66,10,0.36)]"            >
              <Upload className="h-4 w-4" />
              Choose File
            </button>
          </div>
        )}
      </UploadStep>

      {/* Meta row */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1 text-xs text-stone-400">
          <Timer className="h-3.5 w-3.5" /> Multiple files up to 1 min
        </span>
        <span className="flex items-center gap-1 text-xs text-stone-400">
          <Layers className="h-3.5 w-3.5" /> Max 10 MB · Single · Multiple · ZIP
        </span>
      </div>

      {/* Feature list */}
      <div className="mt-5 rounded-lg bg-stone-50 p-3 text-left">
        <p className="mb-1.5 text-xs font-medium text-stone-400">PDF to Word Conversion includes:</p>
        <ul className="space-y-1">
          {(content?.noticeItems || [
            "Single PDF → DOCX",
            "Multiple PDFs → ZIP",
            "OCR available for scanned PDFs",
          ]).map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-stone-600">
              <span className="text-rose-500">→</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-stone-400">🔒 Your files are auto-deleted after 1 hour</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   STATS STRIP  (dark band)
───────────────────────────────────────── */
function StatsStrip({ stats }) {
  return (
    <div className="bg-stone-900 py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 text-center sm:grid-cols-4">
        {stats.map(({ num, label }) => (
          <div key={label}>
            <span className="block font-serif text-4xl font-normal text-white">{num}</span>
            <span className="mt-1 block text-xs text-white/50">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS  (3-card grid)
───────────────────────────────────────── */
const stepStyles = [
  { iconBg: "bg-rose-50", icon: Upload, iconColor: "text-rose-500" },
  { iconBg: "bg-blue-50", icon: Sparkles, iconColor: "text-blue-500" },
  { iconBg: "bg-emerald-50", icon: CheckCircle2, iconColor: "text-emerald-500" },
];

function HowItWorksSection({
  steps, eyebrow, title, subtitle, }) {

  // function HowItWorksSection({ steps }) {
  return (
    <div className="bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* <Eyebrow>How it works</Eyebrow> */}
        <Eyebrow>{eyebrow || "How it works"}</Eyebrow>
        {/* <SectionTitle>Three steps to an editable Word doc</SectionTitle> */}
        <SectionTitle>
          {title || "Three steps to an editable Word doc"}
        </SectionTitle>
        {/* <SectionSub>No learning curve. Upload, convert, download — done in under a minute.</SectionSub> */}
        <SectionSub>
          {subtitle || "No learning curve. Upload, convert, download — done in under a minute."}
        </SectionSub>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {steps.map(({ n, title, desc }, idx) => {
            const { iconBg, icon: Icon, iconColor } = stepStyles[idx] || stepStyles[0];
            return (
              <div
                key={n}
                className="group relative overflow-hidden rounded-2xl border border-stone-100 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* ghost number */}
                <span className="pointer-events-none absolute right-5 top-4 select-none font-serif text-6xl font-normal text-stone-900/[0.04]">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="mb-1.5 font-semibold text-stone-900">{title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPARE: STANDARD vs SCANNED
───────────────────────────────────────── */
// function PdfTypesSection() {
function PdfTypesSection({
  eyebrow,
  title,
  subtitle,
}) {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* <Eyebrow>PDF Types</Eyebrow> */}
        <Eyebrow>{eyebrow || "PDF Types"}</Eyebrow>
        {/* <SectionTitle>Standard PDF vs Scanned PDF</SectionTitle> */}
        <SectionTitle>
          {title || "Standard PDF vs Scanned PDF"}
        </SectionTitle>
        {/* <SectionSub>Know the difference — choose the right conversion option for best results.</SectionSub> */}
        <SectionSub>
          {subtitle || "Know the difference — choose the right conversion option for best results."}
        </SectionSub>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {/* Standard */}
          <div className="rounded-2xl border border-stone-200 bg-white p-7 transition hover:shadow-md">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div>
                <h3 className="font-semibold text-stone-900">Standard PDF</h3>
                <p className="text-xs text-stone-400">Digitally created files</p>
              </div>
            </div>
            <ul className="space-y-2.5 border-t border-stone-100 pt-4 text-sm text-stone-600">
              {["Text is selectable & searchable", "Faster conversion speed", "High accuracy output", "No OCR required"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-stone-400">Best for: reports, invoices, documents created digitally.</p>
          </div>

          {/* Scanned */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900 p-7 text-white transition hover:shadow-md">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <div>
                <h3 className="font-semibold text-white">Scanned PDF</h3>
                <p className="text-xs text-white/40">Photo or print-based files</p>
              </div>
            </div>
            <ul className="space-y-2.5 border-t border-white/10 pt-4 text-sm text-white/80">
              {["Text is not selectable (image)", "OCR required for editing", "Slightly slower process", "Converts images into text"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/35">Best for: scanned documents, photos, printed files converted to PDF.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function WhySection({ items, title }) {
  return (
    <div className="bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>Why Choose PDFLinx?</Eyebrow>
        <SectionTitle>{title || "Built for simplicity. Backed by trust."}</SectionTitle>
        <SectionSub>
          Free PDF tools without the catch — no ads, no upsells, no account walls.
        </SectionSub>

        <div className="mt-10 grid grid-cols-1 gap-[1.5px] overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-200 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="group flex min-h-[145px] items-start gap-5 bg-white p-8 transition hover:bg-stone-50"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bgColor}`}
              >
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>

              <div className="min-w-0">
                <h4 className="text-lg font-bold leading-7 text-stone-900">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-stone-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SEO SECTIONS  (numbered cards)
───────────────────────────────────────── */
// function SeoSection({ sections }) {
function SeoSection({
  sections,
  content,
  badge,
  title,
  description,
}) {
  if (!sections?.length) return null;

  const finalSections =
    sections.length % 2 !== 0
      ? [
        ...sections,
        {
          title: "Best For Everyday Document Editing",
          text: "Use the converted Word file for reports, assignments, invoices, contracts, forms, and office documents. The DOCX output is easy to edit, share, and reuse.",
        },
      ]
      : sections;

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-8 text-left">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
            {badge || "PDF Guide"}
          </span>

          <SectionTitle className="mt-3 text-left">
            {title || "Free Online PDF Tool by PDFLinx"}
          </SectionTitle>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
            {description ||
              "Convert standard and scanned PDF files into editable Word documents with a clean, simple, and secure experience."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {finalSections.map((section, idx) => (
            <div
              key={section.title}
              className="rounded-2xl border border-stone-100 bg-stone-50 p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-700">
                  {idx + 1}
                </span>

                <div>
                  <h3 className="font-bold text-stone-900">
                    {section.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-stone-500">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ  (accordion, full-width border lines)
───────────────────────────────────────── */
function FaqSection({ faqs, title }) {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow color="text-violet-600">Help Center</Eyebrow>
        <SectionTitle>{title || "Frequently asked questions"}</SectionTitle>
        <SectionSub>Quick answers about PDF to Word conversion, OCR, file safety, and more.</SectionSub>

        <div className="mt-8 divide-y divide-stone-100 border-t border-stone-100">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group py-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium text-stone-800 transition-colors hover:text-rose-600">
                <span>{faq.q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform duration-300 group-open:rotate-45 group-open:text-rose-500" />
              </summary>
              <p className="pb-5 text-sm leading-7 text-stone-500">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RELATED TOOLS  (chip grid)
───────────────────────────────────────── */
function RelatedToolsSection({ tools, title }) {
  return (
    <div className="bg-stone-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>More Tools</Eyebrow>
        <SectionTitle>{title || "You might also need"}</SectionTitle>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-700 transition-all hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-md"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bgColor}`}>
                {/* <tool.icon className={`h-4 w-4 ${tool.iconColor}`} /> */}
                {tool.icon && (
                  <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
                )}
              </div>
              <span className="transition-colors group-hover:text-rose-600">{tool.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

}

/* ─────────────────────────────────────────
   CTA BANNER  (dark with glow)
───────────────────────────────────────── */
function CtaBanner({ content }) {
  return (
    <div className="px-4 pb-20 pt-2">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-stone-900 px-8 py-12 sm:flex sm:items-center sm:justify-between sm:gap-8">
        {/* decorative glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,66,10,0.18) 0%, transparent 70%)" }}
        />

        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
            {/* <h2 className="font-serif text-2xl font-normal leading-snug text-white sm:text-3xl"> */}
            {content?.ctaTitle || (
              <>Start converting now —<br />free, private, no sign‑up.</>
            )}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            {content?.ctaDescription || "Join thousands who trust PDFLinx for everyday document tasks."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 shadow-xl transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)] sm:mt-0"
        >
          <Upload className="h-4 w-4" />
          {content?.ctaButton || "Choose File"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FEATURES STRIP  (5-col grid)
───────────────────────────────────────── */
function FeaturesStrip({ features }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 shadow-sm sm:grid-cols-3 md:grid-cols-5">
      {features.map((feat) => (
        <div
          key={feat.title}
          className="flex flex-col items-center gap-2 bg-white px-3 py-5 text-center sm:px-4 sm:py-6"
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${feat.bgColor}`}>
            <feat.icon className={`h-5 w-5 ${feat.iconColor}`} />
          </div>
          <p className="text-xs font-bold text-stone-900 sm:text-sm">{feat.title}</p>
          <p className="text-xs text-stone-500">{feat.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
// export default function UploadLandingStep({
//   onFilesSelect,
//   accept,
//   multiple,
//   uploadTitle,
//   uploadSubtitle,
//   uploadInfo,
//   content = {},
// }) {
/* resolve all data with content overrides */
// const relatedTools = content.relatedTools || defaultRelatedTools;
// const relatedTools = content?.relatedTools || defaultRelatedTools;
// const faqs = content.faqs || defaultFaqs;
// const features = content.features || defaultFeatures;
// const whyItems = content.whyItems || defaultWhyItems;
// const stats = content.stats || defaultStats;
export default function UploadLandingStep({
  onFilesSelect,
  accept,
  multiple,
  uploadTitle,
  uploadSubtitle,
  uploadInfo,
  content = {},
}) {

  // SAFE FALLBACK
  content = content || {};

  /* resolve all data with content overrides */
  const relatedTools = content?.relatedTools || defaultRelatedTools;
  const faqs = content?.faqs || defaultFaqs;
  const features = content?.features || defaultFeatures;
  const whyItems = content?.whyItems || defaultWhyItems;
  const stats = content?.stats || defaultStats;

  const howToSteps = content.howToSteps || [
    { n: "1", title: "Upload your PDF", desc: "Drag & drop or click to upload. Supports single files, batch PDFs, and ZIP archives up to 10 MB.", color: "bg-blue-600" },
    { n: "2", title: "Enable OCR if needed", desc: "For scanned or image-based PDFs, enable OCR to extract text and preserve formatting accurately.", color: "bg-violet-600" },
    { n: "3", title: "Download DOCX or ZIP", desc: "Single files download as DOCX. Multiple files are packed into a ZIP with all converted documents.", color: "bg-emerald-600" },
  ];

  const breadcrumbItems = content.breadcrumbItems || [
    { label: "Home", href: "/" },
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: content.breadcrumbCurrent || "PDF Tool" },
  ];

  return (
    /* warm off-white page background */
    <div className="bg-[#faf9f7] font-sans">

      {/* ── BREADCRUMB + TRUST PILLS ── */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-stone-400">
            {breadcrumbItems.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1">
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-stone-600">{item.label}</Link>
                ) : (
                  <span className="font-medium text-stone-600">{item.label}</span>
                )}
                {i < breadcrumbItems.length - 1 && <span aria-hidden="true">›</span>}
              </span>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-stone-500">
            {(content.trustPills || ["100% Free", "No Sign Up", "No Watermark"]).map((pill) => (
              <span key={pill} className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO  (2-col) ── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2">
        {/* <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2"> */}

        {/* LEFT — copy */}
        {/* <div> */}
        <div className="animate-fade-up-hero">
          <HeroBadge text={content.heroBadge || "✦ 100% Free · No Signup Required"} />

          {/* <h1 className="font-serif text-5xl font-normal leading-[1.12] tracking-tight text-stone-900 sm:text-6xl"> */}
          {/* <h1 className="font-bold font-display text-5xl leading-[1.12] tracking-tight text-stone-900 sm:text-6xl">
            {content.heroTitle || (
              <>
                Convert PDF to Word{" "}
                <em className="text-rose-600">in Seconds</em>
              </>
            )}
          </h1> */}

          <h1 className="font-bold font-display text-5xl leading-[1.12] tracking-tight text-stone-900 sm:text-6xl">
            {content.heroTitle}
          </h1>

          <p className="mt-5 max-w-md text-base font-light leading-relaxed text-stone-500">
            {content.heroDescription ||
              "Turn any PDF into a fully editable Word document. Keep text, layout, images and tables intact — no software, no account needed."}
          </p>

          {/* pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(content.pills || [
              "Instant conversion",
              "Secure file processing",
              "OCR for scanned PDFs",
              "Works on any device",
            ]).map((p) => <Pill key={p}>{p}</Pill>)}
          </div>

          {/* social proof */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-stone-900">{content.rating || "4.9/5"}</span>
            <span className="text-sm text-stone-400">{content.ratingText || "Trusted by 50,000+ users monthly"}</span>
          </div>
        </div>

        {/* RIGHT — upload box */}
        <div className="animate-fade-up-hero animate-delay-200">

          <HeroUploadBox
            onFilesSelect={onFilesSelect}
            accept={accept}
            multiple={multiple}
            uploadTitle={uploadTitle}
            uploadSubtitle={uploadSubtitle}
            uploadInfo={uploadInfo}
            content={content}
          />
        </div>

      </section>

      {/* ── STATS STRIP ── */}
      <StatsStrip stats={stats} />

      {/* ── FEATURES STRIP ── */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <FeaturesStrip features={features} />
      </div>

      {/* ── HOW IT WORKS ── */}
      {/* <HowItWorksSection steps={howToSteps} /> */}
      <RevealOnScroll>
        <HowItWorksSection
          steps={howToSteps}
          eyebrow={content.howToEyebrow}
          title={content.howToTitle}
          subtitle={content.howToSubtitle}
        />
        {/* <HowItWorksSection steps={howToSteps} /> */}
      </RevealOnScroll>

      {/* ── COMPARE ── */}
      {/* <PdfTypesSection /> */}
      <RevealOnScroll>
        {content.showPdfTypes !== false && (
          <PdfTypesSection
            eyebrow={content.pdfTypesEyebrow}
            title={content.pdfTypesTitle}
            subtitle={content.pdfTypesSubtitle}
          />
        )}
        {/* <PdfTypesSection /> */}
      </RevealOnScroll>

      {/* ── WHY PDFLINX ── */}
      {/* <WhySection items={whyItems} title={content.whyTitle} /> */}
      <RevealOnScroll>
        <WhySection items={whyItems} title={content.whyTitle} />
      </RevealOnScroll>

      {/* ── SEO SECTIONS ── */}
      {/* {content.seoSections?.length > 0 && <SeoSection sections={content.seoSections} />} */}
      {content.seoSections?.length > 0 && (
        <RevealOnScroll>
          <SeoSection
            sections={content.seoSections}
            content={content}
            badge={content.seoBadge}
            title={content.seoTitle}
            description={content.seoDescription}
          />
        </RevealOnScroll>
      )}

      {/* ── FAQ ── */}
      {/* <FaqSection faqs={faqs} title={content.faqTitle} /> */}
      <RevealOnScroll>
        <FaqSection faqs={faqs} title={content.faqTitle} />
      </RevealOnScroll>

      {/* ── RELATED TOOLS ── */}
      {/* <RelatedToolsSection tools={relatedTools} title={content.relatedTitle} /> */}
      <RevealOnScroll>
        <RelatedToolsSection tools={relatedTools} title={content.relatedTitle} />
      </RevealOnScroll>

      {/* ── CTA BANNER ── */}
      <CtaBanner content={content} />

    </div>
  );
}

