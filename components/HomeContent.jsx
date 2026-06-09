"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./HomeContent.module.css";

import {
  ShieldCheck, RotateCw, PenTool, FileText, FileType,
  FileArchive, FileImage, FileSpreadsheet, Split, Stamp,
  ArrowUp, Lock, Zap, Eye, Smartphone, Trash2, Hash, Code,
  Image, CheckCircle2, Presentation, LayoutGrid, Download,
  Wrench, EyeOff, Crop, Sparkles, MessageSquare,
} from "lucide-react";

// import {
//     ShieldCheck, RotateCw, PenTool, FileText, FileType,
//     FileArchive, FileImage, FileSpreadsheet, Split, Stamp,
//     ArrowUp, Lock, Zap, Eye, Smartphone, Trash2, Hash, Code,
//     Image, CheckCircle2,
// } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────────────────────── */

function useScrollReveal(dep) {
    useEffect(() => {
        // Thoda wait karo taake React naye cards render kar sake
        const timer = setTimeout(() => {
            const els = document.querySelectorAll(`.${styles.revealItem}`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const delay = entry.target.dataset.delay || 0;
                            setTimeout(() => {
                                entry.target.classList.add(styles.visible);
                            }, delay);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.05 }
            );

            els.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    const delay = el.dataset.delay || 0;
                    setTimeout(() => {
                        el.classList.add(styles.visible);
                    }, delay);
                } else {
                    observer.observe(el);
                }
            });

            return () => observer.disconnect();
        }, 50); // ← 50ms wait — React render complete hone do

        return () => clearTimeout(timer);
    }, [dep]); // ← dep change hone par dobara run karo
}
/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const tools = [
    {
        title: "PDF to Word",
        desc: "Convert PDF to editable DOCX — fonts, tables, and images preserved. Works on scanned PDFs with built-in OCR.",
        link: "/pdf-to-word",
        icon: <FileType className="w-5 h-5" />,
        bg: "#fff1ec", color: "#e8420a",
        category: "convert", badge: "Most Popular",
    },
    {
        title: "Word to PDF",
        desc: "Convert DOC and DOCX files to professional PDF format. Layout stays pixel-perfect on every device.",
        link: "/word-to-pdf",
        icon: <FileSpreadsheet className="w-5 h-5" />,
        bg: "#eff6ff", color: "#2563eb",
        category: "convert",
    },
    {
        title: "Image to PDF",
        desc: "Combine JPG and PNG images into a single PDF. Supports batch upload — ideal for scans, receipts, and portfolios.",
        link: "/image-to-pdf",
        icon: <FileImage className="w-5 h-5" />,
        bg: "#fdf4ff", color: "#9333ea",
        category: "convert",
    },
    {
        title: "Excel to PDF",
        desc: "Export spreadsheets to PDF with tables, charts, and formatting fully intact. Supports XLS and XLSX.",
        link: "/excel-pdf",
        icon: <FileSpreadsheet className="w-5 h-5" />,
        bg: "#f0fdf4", color: "#16a34a",
        category: "convert",
    },
    {
        title: "PDF to JPG",
        desc: "Extract PDF pages as high-quality JPG images. Single page downloads direct, multiple pages get a ZIP.",
        link: "/pdf-to-jpg",
        icon: <Image className="w-5 h-5" />,
        bg: "#fff8f0", color: "#ea580c",
        category: "convert",
    },
    {
        title: "PPT to PDF",
        desc: "Convert PowerPoint presentations to PDF. Fonts, slide layout, and design preserved for sharing and printing.",
        link: "/ppt-to-pdf",
        icon: <FileText className="w-5 h-5" />,
        bg: "#fdf4ff", color: "#9333ea",
        category: "convert",
    },
    {
        title: "Merge PDF",
        desc: "Combine multiple PDF files into one document. Drag to reorder pages — perfect for reports and bundles.",
        link: "/merge-pdf",
        icon: <FileArchive className="w-5 h-5" />,
        bg: "#f5f3ff", color: "#7c3aed",
        category: "organize", badge: "Popular",
    },
    {
        title: "Split PDF",
        desc: "Extract specific pages or page ranges from any PDF. Keep only what you need — no full document required.",
        link: "/split-pdf",
        icon: <Split className="w-5 h-5" />,
        bg: "#fff0f6", color: "#db2777",
        category: "organize",
    },
    {
        title: "Compress PDF",
        desc: "Reduce PDF file size without losing readability. Choose compression level — ideal before emailing or uploading.",
        link: "/compress-pdf",
        icon: <FileText className="w-5 h-5" />,
        bg: "#fdf4ff", color: "#9333ea",
        category: "organize", badge: "Popular",
    },
    {
        title: "Rotate PDF",
        desc: "Fix sideways or upside-down PDF pages. Rotate 90°, 180°, or 270° — select individual pages or all at once.",
        link: "/rotate-pdf",
        icon: <RotateCw className="w-5 h-5" />,
        bg: "#fff1ec", color: "#e8420a",
        category: "organize",
    },
    {
        title: "Protect PDF",
        desc: "Add password encryption to sensitive PDF documents. Prevent unauthorized access before sharing.",
        link: "/protect-pdf",
        icon: <ShieldCheck className="w-5 h-5" />,
        bg: "#eff6ff", color: "#2563eb",
        category: "security",
    },
    {
        title: "Unlock PDF",
        desc: "Remove password restrictions from PDF files you own. Get full access to your documents instantly.",
        link: "/unlock-pdf",
        icon: <Lock className="w-5 h-5" />,
        bg: "#f0fdf4", color: "#16a34a",
        category: "security",
    },
    {
        title: "Sign PDF",
        desc: "Add a digital signature to contracts, forms, and agreements. Draw, type, or upload your signature.",
        link: "/sign-pdf",
        icon: <PenTool className="w-5 h-5" />,
        bg: "#eff6ff", color: "#0284c7",
        category: "security",
    },
    {
        title: "Add Watermark",
        desc: "Stamp text or image watermarks onto PDF pages. Adjust opacity, position, and angle for professional branding.",
        link: "/add-watermark",
        icon: <Stamp className="w-5 h-5" />,
        bg: "#fdf4ff", color: "#c026d3",
        category: "security",
    },
    {
        title: "OCR PDF",
        desc: "Extract selectable, searchable text from scanned PDFs using Optical Character Recognition technology.",
        link: "/ocr-pdf",
        icon: <Eye className="w-5 h-5" />,
        bg: "#f0fdfa", color: "#0d9488",
        category: "convert",
    },
    {
        title: "Edit PDF",
        desc: "Add text, annotations, and corrections to PDF files directly in your browser. No software installation needed.",
        link: "/edit-pdf",
        icon: <FileText className="w-5 h-5" />,
        bg: "#f8fafc", color: "#475569",
        category: "organize",
    },
    {
        title: "Remove Pages",
        desc: "Delete specific pages from a PDF in seconds. Preview pages first, choose what to remove, and download a clean file.",
        link: "/remove-pages",
        icon: <Trash2 className="w-5 h-5" />,
        bg: "#fff0f6", color: "#ef4444",
        category: "organize",
    },
    {
        title: "PDF to Excel",
        desc: "Extract tables from PDF into editable Excel spreadsheets. Great for invoices, reports, and tabular data.",
        link: "/pdf-to-excel",
        icon: <FileSpreadsheet className="w-5 h-5" />,
        bg: "#f0fdf4", color: "#16a34a",
        category: "convert",
    },
    {
        title: "PDF to PNG",
        desc: "Convert PDF pages into clear PNG images with sharp quality. Best for graphics, transparent-friendly output, and previews.",
        link: "/pdf-to-png",
        icon: <Image className="w-5 h-5" />,
        bg: "#fff8f0", color: "#f97316",
        category: "convert",
    },
    {
        title: "PDF to Text",
        desc: "Extract plain text from PDF files instantly. Useful for copying content, research notes, and searchable text workflows.",
        link: "/pdf-to-text",
        icon: <FileText className="w-5 h-5" />,
        bg: "#eff6ff", color: "#2563eb",
        category: "convert",
    },
    {
        title: "Add Page Numbers",
        desc: "Insert page numbers into your PDF with custom position, format, and style. Perfect for reports, books, and documents.",
        link: "/add-page-numbers",
        icon: <Hash className="w-5 h-5" />,
        bg: "#eff6ff", color: "#1d4ed8",
        category: "organize",
    },
    {
        title: "Text to PDF",
        desc: "Turn plain text into a clean PDF document online. Great for notes, drafts, code snippets, and simple document creation.",
        link: "/text-to-pdf",
        icon: <FileText className="w-5 h-5" />,
        bg: "#f5f3ff", color: "#9333ea",
        category: "convert",
    },
    {
        title: "HTML to PDF",
        desc: "Convert HTML content into PDF format while preserving structure and layout. Useful for web pages, templates, and styled content.",
        link: "/html-to-pdf",
        icon: <Code className="w-5 h-5" />,
        bg: "#fff1ec", color: "#4f46e5",
        category: "convert",
    },

    {
        title: "PDF to PowerPoint",
        desc: "Convert PDF files back to editable PowerPoint presentations. Layouts and formatting preserved.",
        link: "/pdf-to-powerpoint",
        icon: <Presentation className="w-5 h-5" />,
        bg: "#f0f4ff", color: "#4f46e5",
        category: "convert",
    },
    {
        title: "Organize PDF",
        desc: "Reorder, rearrange, or reorganize pages in your PDF. Drag and drop pages into any order you need.",
        link: "/organize-pdf",
        icon: <LayoutGrid className="w-5 h-5" />,
        bg: "#f0fdf4", color: "#16a34a",
        category: "organize",
    },
    {
        title: "Extract PDF",
        desc: "Extract specific pages or content from a PDF into a separate file. Fast and precise.",
        link: "/extract-pdf",
        icon: <Download className="w-5 h-5" />,
        bg: "#fefce8", color: "#ca8a04",
        category: "organize",
    },
    {
        title: "Repair PDF",
        desc: "Fix corrupted or damaged PDF files. Recover content from broken PDFs automatically.",
        link: "/repair-pdf",
        icon: <Wrench className="w-5 h-5" />,
        bg: "#f0f4ff", color: "#4f46e5",
        category: "optimize",
    },
    {
        title: "Redact PDF",
        desc: "Permanently remove sensitive text and images from PDF files. Secure and irreversible redaction.",
        link: "/redact-pdf",
        icon: <EyeOff className="w-5 h-5" />,
        bg: "#fdf2f8", color: "#9333ea",
        category: "security",
    },
    {
        title: "Crop PDF",
        desc: "Crop and trim PDF pages to remove unwanted margins or focus on specific content areas.",
        link: "/crop-pdf",
        icon: <Crop className="w-5 h-5" />,
        bg: "#f0fdf4", color: "#16a34a",
        category: "security",
    },
    {
        title: "AI Summarize",
        desc: "Summarize any PDF instantly using AI. Get key points, insights, and takeaways in seconds.",
        link: "/ai-summarize",
        icon: <Sparkles className="w-5 h-5" />,
        bg: "#fdf4ff", color: "#9333ea",
        category: "ai",
    },
    {
        title: "Chat with PDF",
        desc: "Ask questions about your PDF and get instant AI-powered answers. Like a chat with your document.",
        link: "/chat-with-pdf",
        icon: <MessageSquare className="w-5 h-5" />,
        bg: "#f0f9ff", color: "#0284c7",
        category: "ai",
    },


];

const categories = [
    { key: "all", label: "All Tools" },
    { key: "convert", label: "Convert" },
    { key: "organize", label: "Organize" },
    { key: "security", label: "Security" },
];

const reasons = [
    {
        emoji: "🛡️", bg: "#fff1ec",
        title: "Files Never Leave Your Device",
        text: "PDF conversion and processing happens locally in your browser. No server uploads, no third-party storage, no privacy risk.",
    },
    {
        emoji: "⚡", bg: "#edfaf3",
        title: "Genuinely Fast Processing",
        text: "No unnecessary loading screens or fake progress bars. PDF tools finish in seconds — compress, merge, split, convert.",
    },
    {
        emoji: "👁️", bg: "#eff6ff",
        title: "Zero Ads, Zero Distractions",
        text: "No popups, no banners, no upgrade prompts. Just a clean PDF toolkit that works — free, always.",
    },
    {
        emoji: "👤", bg: "#fff8f0",
        title: "No Account Required",
        text: "Open the site, use the tool, done. No email signup, no password to remember, no spam in your inbox.",
    },
    {
        emoji: "📱", bg: "#f0fdfa",
        title: "Works on Any Device",
        text: "Fully responsive on desktop, tablet, and mobile. Drag-and-drop file upload works smoothly on touchscreens too.",
    },
    {
        emoji: "🗂️", bg: "#fdf4ff",
        title: "All PDF Tools in One Place",
        text: "Convert, merge, split, compress, sign, protect, OCR — every PDF operation you need without switching between sites.",
    },
];

const pills = [
    "Files never stored on server",
    "Converts in seconds",
    "100% free forever",
    "No watermarks added",
    "Works on mobile",
];

const stats = [
    { num: "31+", label: "Free PDF Tools" },
    { num: "Zero", label: "Ads or Popups" },
    { num: "100%", label: "Browser-Based" },
    { num: "Free", label: "No Hidden Costs" },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function HomeContent() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [showBackToTop, setShowBackToTop] = useState(false);

    // useScrollReveal();
    useScrollReveal(activeCategory); // ← activeCategory pass karo


    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 600);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const filtered =
        activeCategory === "all"
            ? tools
            : tools.filter((t) => t.category === activeCategory);

    return (
        <div className={styles.homeRoot}>

            {/* ── HERO ── */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>

                    <span className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot} />
                        100% Free PDF Tools · No Signup Required
                    </span>

                    <h1 className={styles.heroTitle}>
                        Convert, Edit &amp; Manage PDFs<br />
                        <em>Fast, Free &amp; Fully Private</em>
                    </h1>

                    <p className={styles.heroSub}>
                        Free online PDF tools to convert, merge, split, compress, and edit PDF files
                        directly in your browser. Fast, secure, and completely private —
                        no uploads to servers.
                    </p>

                    <div className={styles.heroPills}>
                        {pills.map((p) => (
                            <span key={p} className={styles.heroPill}>
                                <CheckCircle2 className={styles.pillCheck} />
                                {p}
                            </span>
                        ))}
                    </div>

                    <div className={styles.heroCtas}>
                        <button
                            className={styles.btnPrimary}
                            onClick={() =>
                                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Browse All PDF Tools
                        </button>
                        <a href="/pdf-to-word" className={styles.btnSecondary}>
                            Try PDF to Word Free →
                        </a>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <div className={styles.statsStrip}>
                <div className={styles.statsInner}>
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className={`${styles.statItem} ${styles.revealItem}`}
                            data-delay={i * 80}
                        >
                            <span className={styles.statNum}>{s.num}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── ALL TOOLS ── */}
            <section className={styles.toolsSection} id="tools">
                <div className={styles.toolsHeader}>
                    <p className={styles.eyebrow}>PDF Toolkit</p>
                    <h2 className={styles.secTitle}>All Free PDF Tools</h2>
                    <p className={styles.secSub}>
                        Every tool you need to convert, organize and secure PDF documents —
                        no software, no signup.
                    </p>
                </div>

                {/* tabs */}
                <div className={styles.tabBar}>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            className={`${styles.tabBtn} ${activeCategory === cat.key ? styles.tabActive : ""}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* grid */}
                <div className={styles.toolsGrid}>
                    {filtered.map((tool, i) => (
                        <Link
                            key={tool.link}
                            href={tool.link}
                            className={`${styles.toolCard} ${styles.revealItem}`}
                            data-delay={Math.min((i % 4) * 80, 240)}
                        >
                            {tool.badge && (
                                <span
                                    className={styles.toolBadge}
                                    style={{
                                        background: tool.badge === "Most Popular" ? "#fff1ec" : "#edfaf3",
                                        color: tool.badge === "Most Popular" ? "#e8420a" : "#14a44d",
                                    }}
                                >
                                    {tool.badge}
                                </span>
                            )}

                            <div
                                className={styles.toolIcon}
                                style={{ background: tool.bg, color: tool.color }}
                            >
                                {tool.icon}
                            </div>

                            <p className={styles.toolName}>{tool.title}</p>
                            <p className={styles.toolDesc}>{tool.desc}</p>
                            <span className={styles.toolLink} style={{ color: tool.color }}>
                                Use Tool →
                            </span>
                        </Link>
                    ))}
                </div>

                <div className={styles.viewAllWrap}>
                    <Link href="/free-pdf-tools" className={styles.btnViewAll}>
                        View complete PDF tools list →
                    </Link>
                </div>
            </section>

            {/* ── WHY PDFLINX ── */}
            <section className={styles.whySection}>
                <div className={styles.whyInner}>
                    <p className={styles.eyebrow}>Why PDF Linx</p>
                    <h2 className={styles.secTitle}>Built Different. On Purpose.</h2>
                    <p className={styles.secSub}>
                        Most PDF tools are slow, ad-filled, or upload your files to unknown servers.
                        PDF Linx was built to fix all of that.
                    </p>

                    <div className={styles.whyGrid}>
                        {reasons.map((r, i) => (
                            <div
                                key={r.title}
                                className={`${styles.whyItem} ${styles.revealItem}`}
                                data-delay={Math.min((i % 3) * 90, 180)}
                            >
                                <div className={styles.whyIco} style={{ background: r.bg }}>
                                    {r.emoji}
                                </div>
                                <div>
                                    <h4 className={styles.whyItemTitle}>{r.title}</h4>
                                    <p className={styles.whyItemText}>{r.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className={styles.ctaOuter}>
                <div className={styles.ctaBanner}>
                    <div className={styles.ctaGlow} />
                    <div className={styles.ctaLeft}>
                        <h2 className={styles.ctaTitle}>
                            Start Converting PDFs for <span>Free</span>
                        </h2>
                        <p className={styles.ctaText}>
                            No account, no watermarks, no file size tricks. Just fast, private PDF tools that work.
                        </p>
                    </div>
                    <div className={styles.ctaBtns}>
                        <a href="/word-to-pdf" className={styles.btnCtaWhite}>
                            📄 Convert Word to PDF
                        </a>
                        <a href="/compress-pdf" className={styles.btnCtaOutline}>
                            🗜️ Compress a PDF
                        </a>
                    </div>
                </div>
            </section>

            {/* ── BACK TO TOP ── */}
            {showBackToTop && (
                <button
                    className={styles.backTop}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}



