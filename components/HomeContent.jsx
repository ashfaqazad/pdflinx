"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./HomeContent.module.css";

import {
    ShieldCheck,
    RotateCw,
    PenTool,
    FileText,
    Image,
    FileType,
    FileArchive,
    FileImage,
    FileSpreadsheet,
    Split,
    Stamp,
    ArrowUp,
    Lock,
    Zap,
    Eye,
    Smartphone,
} from "lucide-react";
import SisterSitesBanner from "./SisterSitesBanner";

export default function HomeContent() {
    const router = useRouter();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 600);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const tools = [
        {
            title: "PDF to Word",
            desc: "Convert PDF to editable DOCX — fonts, tables, and images preserved. Works on scanned PDFs with built-in OCR.",
            link: "/pdf-to-word",
            icon: <FileType className="w-6 h-6" />,
            accent: "#e11d48",
            category: "convert",
            badge: "Most Popular",
        },
        {
            title: "Word to PDF",
            desc: "Convert DOC and DOCX files to professional PDF format. Layout stays pixel-perfect on every device.",
            link: "/word-to-pdf",
            icon: <FileSpreadsheet className="w-6 h-6" />,
            accent: "#2563eb",
            category: "convert",
        },
        {
            title: "Image to PDF",
            desc: "Combine JPG and PNG images into a single PDF. Supports batch upload — ideal for scans, receipts, and portfolios.",
            link: "/image-to-pdf",
            icon: <FileImage className="w-6 h-6" />,
            accent: "#0891b2",
            category: "convert",
        },
        {
            title: "Excel to PDF",
            desc: "Export spreadsheets to PDF with tables, charts, and formatting fully intact. Supports XLS and XLSX.",
            link: "/excel-pdf",
            icon: <FileSpreadsheet className="w-6 h-6" />,
            accent: "#16a34a",
            category: "convert",
        },
        {
            title: "PDF to JPG",
            desc: "Extract PDF pages as high-quality JPG images. Single page downloads direct, multiple pages get a ZIP.",
            link: "/pdf-to-jpg",
            icon: <Image className="w-6 h-6" />,
            accent: "#ea580c",
            category: "convert",
        },
        {
            title: "PPT to PDF",
            desc: "Convert PowerPoint presentations to PDF. Fonts, slide layout, and design preserved for sharing and printing.",
            link: "/ppt-to-pdf",
            icon: <FileText className="w-6 h-6" />,
            accent: "#9333ea",
            category: "convert",
        },
        {
            title: "Merge PDF",
            desc: "Combine multiple PDF files into one document. Drag to reorder pages — perfect for reports and bundles.",
            link: "/merge-pdf",
            icon: <FileArchive className="w-6 h-6" />,
            accent: "#d97706",
            category: "organize",
            badge: "Popular",
        },
        {
            title: "Split PDF",
            desc: "Extract specific pages or page ranges from any PDF. Keep only what you need — no full document required.",
            link: "/split-pdf",
            icon: <Split className="w-6 h-6" />,
            accent: "#0d9488",
            category: "organize",
        },
        {
            title: "Compress PDF",
            desc: "Reduce PDF file size without losing readability. Choose compression level — ideal before emailing or uploading.",
            link: "/compress-pdf",
            icon: <FileText className="w-6 h-6" />,
            accent: "#7c3aed",
            category: "organize",
            badge: "Popular",
        },
        {
            title: "Rotate PDF",
            desc: "Fix sideways or upside-down PDF pages. Rotate 90°, 180°, or 270° — select individual pages or all at once.",
            link: "/rotate-pdf",
            icon: <RotateCw className="w-6 h-6" />,
            accent: "#be123c",
            category: "organize",
        },
        {
            title: "Protect PDF",
            desc: "Add password encryption to sensitive PDF documents. Prevent unauthorized access before sharing.",
            link: "/protect-pdf",
            icon: <ShieldCheck className="w-6 h-6" />,
            accent: "#1d4ed8",
            category: "security",
        },
        {
            title: "Unlock PDF",
            desc: "Remove password restrictions from PDF files you own. Get full access to your documents instantly.",
            link: "/unlock-pdf",
            icon: <Lock className="w-6 h-6" />,
            accent: "#059669",
            category: "security",
        },
        {
            title: "Sign PDF",
            desc: "Add a digital signature to contracts, forms, and agreements. Draw, type, or upload your signature.",
            link: "/sign-pdf",
            icon: <PenTool className="w-6 h-6" />,
            accent: "#0284c7",
            category: "security",
        },
        {
            title: "Add Watermark",
            desc: "Stamp text or image watermarks onto PDF pages. Adjust opacity, position, and angle for professional branding.",
            link: "/add-watermark",
            icon: <Stamp className="w-6 h-6" />,
            accent: "#c026d3",
            category: "security",
        },
        {
            title: "OCR PDF",
            desc: "Extract selectable, searchable text from scanned PDFs using Optical Character Recognition technology.",
            link: "/ocr-pdf",
            icon: <Eye className="w-6 h-6" />,
            accent: "#b45309",
            category: "convert",
        },
        {
            title: "Edit PDF",
            desc: "Add text, annotations, and corrections to PDF files directly in your browser. No software installation needed.",
            link: "/edit-pdf",
            icon: <FileText className="w-6 h-6" />,
            accent: "#475569",
            category: "organize",
        },
    ];

    const categories = [
        { key: "all", label: "All Tools" },
        { key: "convert", label: "Convert" },
        { key: "organize", label: "Organize" },
        { key: "security", label: "Security" },
    ];

    const filtered =
        activeCategory === "all"
            ? tools
            : tools.filter((t) => t.category === activeCategory);

    const reasons = [
        {
            icon: <ShieldCheck className="w-7 h-7" />,
            title: "Files Never Leave Your Device",
            text: "PDF conversion and processing happens locally in your browser. No server uploads, no third-party storage, no privacy risk.",
            accent: "#e11d48",
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: "Genuinely Fast Processing",
            text: "No unnecessary loading screens or fake progress bars. PDF tools finish in seconds — compress, merge, split, convert.",
            accent: "#d97706",
        },
        {
            icon: <Eye className="w-7 h-7" />,
            title: "Zero Ads, Zero Distractions",
            text: "No popups, no banners, no upgrade prompts. Just a clean PDF toolkit that works — free, always.",
            accent: "#2563eb",
        },
        {
            icon: <Lock className="w-7 h-7" />,
            title: "No Account Required",
            text: "Open the site, use the tool, done. No email signup, no password to remember, no spam in your inbox.",
            accent: "#059669",
        },
        {
            icon: <Smartphone className="w-7 h-7" />,
            title: "Works on Any Device",
            text: "Fully responsive on desktop, tablet, and mobile. Drag-and-drop file upload works smoothly on touchscreens too.",
            accent: "#7c3aed",
        },
        {
            icon: <FileArchive className="w-7 h-7" />,
            title: "All PDF Tools in One Place",
            text: "Convert, merge, split, compress, sign, protect, OCR — every PDF operation you need without switching between sites.",
            accent: "#0891b2",
        },
    ];

    return (
        <div className={styles.homeRoot}>
            {/* ── HERO ── */}
            <section className={styles.hero}>
                <div className={styles.heroGrid} />
                <div className={styles.heroGlow} />
                <div className={styles.heroInner}>
                    <div className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot} />
                        Free Online PDF Tools — No Signup Required
                    </div>

                    <h1 className={styles.heroTitle}>
                        Convert, Edit &amp; Manage PDFs
                        <br />
                        <em>Fast, Free &amp; Fully Private</em>
                    </h1>

                    <p className={styles.heroSub}>
                        Free online PDF tools to convert PDF to Word, compress PDF, merge PDF files,
                        split PDF pages, and edit PDF documents directly in your browser.
                        Fast, secure, and completely private — no uploads to servers.

                    </p>

                    <div className={styles.heroPills}>
                        {/* <span className={styles.heroPill}>🔒 No file uploads to server</span> */}
                        <span className={styles.heroPill}>🔒 Files never stored on server</span>
                        <span className={styles.heroPill}>⚡ Converts in seconds</span>
                        <span className={styles.heroPill}>🆓 100% free forever</span>
                        <span className={styles.heroPill}>📄 No watermarks added</span>
                        <span className={styles.heroPill}>📱 Works on mobile</span>
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

            {/* ── STATS BAR ── */}
            <div className={styles.statsBar}>
                <div className={styles.statsInner}>
                    {[
                        { num: "16+", label: "Free PDF Tools" },
                        { num: "Zero", label: "Ads or Popups" },
                        { num: "100%", label: "Browser-Based" },
                        { num: "Free", label: "No Hidden Costs" },
                    ].map((s, i) => (
                        <div className={styles.statItem} key={i}>
                            <div className={styles.statNum}>{s.num}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TOOLS GRID ── */}
            <section className={styles.toolsSection} id="tools">
                <div className={styles.sectionHeaderCenter}>
                    <div className={styles.sectionLabel}>PDF Toolkit</div>
                    <h2 className={styles.sectionTitle}>All Free PDF Tools</h2>
                    <p className={styles.sectionSub}>
                        Every tool you need to convert, organize, and secure PDF documents — no software, no signup.
                    </p>
                </div>

                <div className={`${styles.categoryTabs} ${styles.categoryTabsCenter}`}>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            className={`${styles.tabBtn} ${activeCategory === cat.key ? styles.activeTab : ""}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className={styles.toolsGrid}>
                    {filtered.map((tool, i) => (
                        <div
                            key={i}
                            className={styles.toolCard}
                            style={{ "--accent": tool.accent }}
                            onClick={() => router.push(tool.link)}
                        >
                            <div className={styles.toolCardTop}>
                                <div
                                    className={styles.toolIconWrap}
                                    style={{ background: tool.accent }}
                                >
                                    {tool.icon}
                                </div>

                                {tool.badge && (
                                    <span
                                        className={styles.toolBadge}
                                        style={{ background: tool.accent }}
                                    >
                                        {tool.badge}
                                    </span>
                                )}
                            </div>

                            <h3 className={styles.toolTitle}>{tool.title}</h3>
                            <p className={styles.toolDesc}>{tool.desc}</p>
                            <span className={styles.toolLink}>Use Tool →</span>
                        </div>
                    ))}
                </div>

                <div className={styles.toolsFooterLink}>
                    <Link href="/free-pdf-tools" className={styles.toolsListLink}>
                        View complete PDF tools list →
                    </Link>
                </div>
            </section>

            {/* ── WHY SECTION ── */}
            <section className={styles.whySection}>
                <div className={styles.whyInner}>
                    <div className={styles.whyHeader}>
                        <div className={styles.sectionLabel}>Why PDF Linx</div>
                        <h2 className={styles.sectionTitle}>Built Different. On Purpose.</h2>
                        <p className={styles.sectionSub}>
                            Most PDF tools are slow, ad-filled, or upload your files to unknown servers.
                            PDF Linx was built to fix all of that.
                        </p>
                    </div>

                    <div className={styles.whyGrid}>
                        {reasons.map((r, i) => (
                            <div className={styles.whyCard} key={i}>
                                <div
                                    className={styles.whyIcon}
                                    style={{ background: `${r.accent}22`, color: r.accent }}
                                >
                                    {r.icon}
                                </div>
                                <h3 className={styles.whyCardTitle}>{r.title}</h3>
                                <p className={styles.whyCardText}>{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <SisterSitesBanner />

            {/* ── CTA STRIP ── */}
            <section className={styles.ctaStrip}>
                <h2 className={styles.ctaTitle}>Start Converting PDFs for Free</h2>
                <p className={styles.ctaText}>
                    No account. No watermarks. No file size tricks. Just fast, private PDF tools that work.
                </p>
                <div>
                    <a href="/word-to-pdf" className={styles.btnWhite}>
                        Convert Word to PDF →
                    </a>
                    <a href="/compress-pdf" className={styles.btnWhiteOutline}>
                        Compress a PDF
                    </a>
                </div>
            </section>

            {/* ── BACK TO TOP ── */}
            {showBackToTop && (
                <button
                    className={styles.backTop}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}