"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root {
          font-family: 'DM Sans', sans-serif;
          background: #f8f7f4;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          background: #ffffff;
          overflow: hidden;
          padding: 100px 24px 90px;
          border-bottom: 1px solid #ebe9e4;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(225,29,72,0.07) 0%, transparent 70%);
          top: -200px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(225,29,72,0.07);
          border: 1px solid rgba(225,29,72,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #e11d48;
          margin-bottom: 32px;
          letter-spacing: 0.02em;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          background: #e11d48;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.15;
          color: #0a0a0f;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #e11d48, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.15rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 44px;
        }
        .hero-pill {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }
        .btn-primary {
          background: #e11d48;
          color: white;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { background: #be123c; transform: translateY(-2px); }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 14px 32px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-secondary:hover { background: #e5e7eb; transform: translateY(-2px); }

        /* ── STATS BAR ── */
        .stats-bar {
          background: #f8f7f4;
          border-bottom: 1px solid #ebe9e4;
          border-top: 1px solid #ebe9e4;
          padding: 20px 24px;
        }
        .stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }
        .stat-item {
          text-align: center;
        }
        .stat-num {
          font-family: 'Sora', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0a0a0f;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #9ca3af;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }

        /* ── TOOLS SECTION ── */
        .tools-section {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e11d48;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          color: #0a0a0f;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .section-sub {
          font-size: 1.05rem;
          color: #6b7280;
          margin-bottom: 36px;
        }
        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .tab-btn {
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid #e5e3de;
          background: white;
          color: #6b7280;
          transition: all 0.18s;
        }
        .tab-btn:hover { border-color: #e11d48; color: #e11d48; }
        .tab-btn.active {
          background: #0a0a0f;
          border-color: #0a0a0f;
          color: white;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .tool-card {
          background: white;
          border: 1.5px solid #ebe9e4;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.22s;
          position: relative;
          overflow: hidden;
        }
        .tool-card:hover {
          border-color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .tool-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .tool-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .tool-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 100px;
          color: white;
        }
        .tool-card h3 {
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #0a0a0f;
          margin-bottom: 8px;
        }
        .tool-card p {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .tool-link {
          font-size: 13px;
          font-weight: 700;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: gap 0.18s;
        }
        .tool-card:hover .tool-link { gap: 8px; }

        /* ── WHY SECTION ── */
        .why-section {
          background: #f8f7f4;
          padding: 80px 24px;
          border-top: 1px solid #ebe9e4;
          border-bottom: 1px solid #ebe9e4;
        }
        .why-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .why-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .why-header .section-label { color: #e11d48; }
        .why-header .section-title { color: #0a0a0f; }
        .why-header .section-sub { color: #6b7280; margin-bottom: 0; }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .why-card {
          padding: 36px;
          background: #ffffff;
          border: 1.5px solid #ebe9e4;
          border-radius: 16px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .why-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-2px); }
        .why-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .why-card h3 {
          font-family: 'Sora', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0a0a0f;
          margin-bottom: 10px;
        }
        .why-card p {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* ── CTA STRIP ── */
        .cta-strip {
          background: linear-gradient(135deg, #e11d48 0%, #9333ea 100%);
          padding: 64px 24px;
          text-align: center;
        }
        .cta-strip h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          color: white;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .cta-strip p {
          color: rgba(255,255,255,0.75);
          font-size: 1.05rem;
          margin-bottom: 32px;
        }
        .btn-white {
          background: white;
          color: #e11d48;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px 36px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          text-decoration: none;
          display: inline-block;
          margin: 6px;
        }
        .btn-white:hover { transform: translateY(-2px); }
        .btn-white-outline {
          background: transparent;
          color: white;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 14px 36px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
          margin: 6px;
        }
        .btn-white-outline:hover { border-color: white; transform: translateY(-2px); }

        /* ── BACK TO TOP ── */
        .back-top {
          position: fixed;
          bottom: 28px; right: 28px;
          background: #e11d48;
          color: white;
          border: none;
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(225,29,72,0.3);
          transition: transform 0.2s;
          z-index: 50;
        }
        .back-top:hover { transform: translateY(-3px); }

        @media (max-width: 640px) {
          .stats-inner { gap: 28px; }
          .why-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="hero-inner">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Free Online PDF Tools — No Signup Required
            </div>

            <h1>
              Convert, Edit &amp; Manage PDFs
              <br />
              <em>Fast, Free &amp; Fully Private</em>
            </h1>

            <p className="hero-sub">
              PDF to Word converter, merge PDF, compress PDF, split, sign, OCR, 
              and 10+ more tools — all free, all in your browser. 
              Your files never leave your device.
            </p>

            <div className="hero-pills">
              <span className="hero-pill">🔒 No file uploads to server</span>
              <span className="hero-pill">⚡ Converts in seconds</span>
              <span className="hero-pill">🆓 100% free forever</span>
              <span className="hero-pill">📄 No watermarks added</span>
              <span className="hero-pill">📱 Works on mobile</span>
            </div>

            <div className="hero-ctas">
              <button
                className="btn-primary"
                onClick={() =>
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse All PDF Tools
              </button>
              <a href="/pdf-to-word" className="btn-secondary">
                Try PDF to Word Free →
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          <div className="stats-inner">
            {[
              { num: "16+", label: "Free PDF Tools" },
              { num: "0", label: "Ads or Popups" },
              { num: "100%", label: "Browser-Based" },
              { num: "Free", label: "No Hidden Costs" },
            ].map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOOLS GRID ── */}
        <section className="tools-section" id="tools">
          <div style={{ textAlign: "center" }}>
            <div className="section-label">PDF Toolkit</div>
            <h2 className="section-title">All Free PDF Tools</h2>
            <p className="section-sub">
              Every tool you need to convert, organize, and secure PDF documents — no software, no signup.
            </p>
          </div>

          <div className="category-tabs" style={{ justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`tab-btn ${activeCategory === cat.key ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="tools-grid">
            {filtered.map((tool, i) => (
              <div
                key={i}
                className="tool-card"
                style={{ "--accent": tool.accent }}
                onClick={() => router.push(tool.link)}
              >
                <div className="tool-card-top">
                  <div
                    className="tool-icon-wrap"
                    style={{ background: tool.accent }}
                  >
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span
                      className="tool-badge"
                      style={{ background: tool.accent }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <span className="tool-link">
                  Use Tool →
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Link
              href="/free-pdf-tools"
              style={{
                color: "#e11d48",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              View complete PDF tools list →
            </Link>
          </div>
        </section>

        {/* ── WHY SECTION ── */}
        <section className="why-section">
          <div className="why-inner">
            <div className="why-header">
              <div className="section-label">Why PDF Linx</div>
              <h2 className="section-title">Built Different. On Purpose.</h2>
              <p className="section-sub">
                Most PDF tools are slow, ad-filled, or upload your files to unknown servers. 
                PDF Linx was built to fix all of that.
              </p>
            </div>

            <div className="why-grid">
              {reasons.map((r, i) => (
                <div className="why-card" key={i}>
                  <div
                    className="why-icon"
                    style={{ background: `${r.accent}22`, color: r.accent }}
                  >
                    {r.icon}
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section className="cta-strip">
          <h2>Start Converting PDFs for Free</h2>
          <p>
            No account. No watermarks. No file size tricks. Just fast, private PDF tools that work.
          </p>
          <div>
            <a href="/pdf-to-word" className="btn-white">
              Convert PDF to Word →
            </a>
            <a href="/compress-pdf" className="btn-white-outline">
              Compress a PDF
            </a>
          </div>
        </section>

        {/* ── BACK TO TOP ── */}
        {showBackToTop && (
          <button
            className="back-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

      </div>
    </>
  );
}


















// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// import {
//   ShieldCheck,
//   RotateCw,
//   PenTool,
//   FileText,
//   Image,
//   FileType,
//   FileArchive,
//   FileImage,
//   FileSpreadsheet,
//   Split,
//   Stamp,
//   ArrowUp,
//   Lock,
// } from "lucide-react";

// export default function HomeContent() {
//   const router = useRouter();
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     {
//       title: "PDF to Word Converter",
//       desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.",
//       link: "/pdf-to-word",
//       icon: <FileType className="w-10 h-10" />,
//       color: "from-rose-500 to-pink-600",
//     },
//     {
//       title: "Merge PDF Files",
//       desc: "Combine multiple PDFs into one clean file – great for reports or presentations.",
//       link: "/merge-pdf",
//       icon: <FileArchive className="w-10 h-10" />,
//       color: "from-orange-500 to-red-600",
//     },
//     {
//       title: "Split PDF Pages",
//       desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.",
//       link: "/split-pdf",
//       icon: <Split className="w-10 h-10" />,
//       color: "from-amber-500 to-orange-600",
//     },
//     {
//       title: "Compress PDF",
//       desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.",
//       link: "/compress-pdf",
//       icon: <FileText className="w-10 h-10" />,
//       color: "from-yellow-500 to-amber-600",
//     },
//     {
//       title: "Word to PDF",
//       desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.",
//       link: "/word-to-pdf",
//       icon: <FileSpreadsheet className="w-10 h-10" />,
//       color: "from-blue-500 to-indigo-600",
//     },
//     {
//       title: "Image to PDF",
//       desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.",
//       link: "/image-to-pdf",
//       icon: <FileImage className="w-10 h-10" />,
//       color: "from-teal-500 to-emerald-600",
//     },
//     {
//       title: "Excel to PDF",
//       desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.",
//       link: "/excel-pdf",
//       icon: <FileSpreadsheet className="w-10 h-10" />,
//       color: "from-green-500 to-emerald-600",
//     },
//     {
//       title: "PDF to JPG",
//       desc: "Extract every page from your PDF as high-quality JPG images. Single page → direct JPG, multiple pages → ZIP file.",
//       link: "/pdf-to-jpg",
//       icon: <Image className="w-10 h-10" />,
//       color: "from-orange-500 to-amber-600",
//     },
//     {
//       title: "Add Watermark",
//       desc: "Protect your images with text or logo watermarks – adjust position and transparency.",
//       link: "/add-watermark",
//       icon: <Stamp className="w-10 h-10" />,
//       color: "from-blue-500 to-cyan-600",
//     },
//     {
//       title: "Protect PDF",
//       desc: "Add password protection to your PDF files and keep your documents secure from unauthorized access.",
//       link: "/protect-pdf",
//       icon: <ShieldCheck className="w-10 h-10" />,
//       color: "from-purple-500 to-indigo-600",
//     },
//     {
//       title: "Unlock PDF",
//       desc: "Remove password protection from PDF files instantly and access your documents without restrictions.",
//       link: "/unlock-pdf",
//       icon: <Lock className="w-10 h-10" />,
//       color: "from-emerald-500 to-teal-600",
//     },
//     {
//       title: "Rotate PDF",
//       desc: "Rotate PDF pages 90°, 180°, or 270° to fix orientation quickly and easily online.",
//       link: "/rotate-pdf",
//       icon: <RotateCw className="w-10 h-10" />,
//       color: "from-orange-500 to-red-500",
//     },
//     {
//       title: "Sign PDF",
//       desc: "Add your digital signature to PDF documents. Draw, type, or upload your signature securely.",
//       link: "/sign-pdf",
//       icon: <PenTool className="w-10 h-10" />,
//       color: "from-blue-500 to-cyan-600",
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-12 px-4 overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>

//         <div className="relative z-10 max-w-6xl mx-auto text-center">
//           <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium">
//             🔒 Privacy-first PDF tools · No ads · No signup
//           </div>

//           <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
//             Free Online PDF Tools
//             <br />
//             Convert PDF to Word, Merge,
//             <br />
//             Split & Compress PDFs
//           </h1>

//           <p className="text-lg md:text-xl max-w-4xl mx-auto mb-6 opacity-95 leading-relaxed">
//             PDF to Word, Word to PDF & other essential tools, fast, simple, and
//             built for privacy.
//           </p>

//           <p className="text-base md:text-lg max-w-4xl mx-auto mb-6 opacity-90">
//             I built PDFLinx after getting tired of slow sites, intrusive
//             pop-ups, and tools that upload files to shady servers.
//           </p>

//           <p className="text-lg md:text-xl font-semibold mb-10">
//             Everything runs in your browser, your files never leave your device.
//           </p>

//           <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base">
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               🔒 Files stay on your device
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               ⚡ Actually fast
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
//               🆓 Completely free
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               onClick={() =>
//                 document
//                   .getElementById("tools")
//                   ?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="bg-white text-indigo-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
//             >
//               Check Out the Tools
//             </button>

//             <a
//               href="/pdf-to-word"
//               className="bg-white/10 border border-white/30 backdrop-blur text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-white/20 transition"
//             >
//               Try PDF to Word →
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose */}
//       <section className="py-20 px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
//             Why I Built This
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             And why you might actually like using it
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//           {[
//             {
//               title: "No Creepy File Storage",
//               text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.",
//               emoji: "🔒",
//             },
//             {
//               title: "Zero Ads",
//               text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.",
//               emoji: "🙅‍♂️",
//             },
//             {
//               title: "Built for Speed",
//               text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.",
//               emoji: "⚡",
//             },
//             {
//               title: "All Tools in One Place",
//               text: "Stop jumping between 5 different websites. Everything you need is right here.",
//               emoji: "🛠️",
//             },
//             {
//               title: "No Account Needed",
//               text: "Just open the site and start using. No email, no password, no spam later.",
//               emoji: "🚀",
//             },
//             {
//               title: "Works on Phone Too",
//               text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.",
//               emoji: "📱",
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
//             >
//               <div className="text-6xl mb-5">{item.emoji}</div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4">
//                 {item.title}
//               </h3>
//               <p className="text-base text-gray-700 leading-relaxed">
//                 {item.text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Tools Grid */}
//       <section
//         id="tools"
//         className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
//       >
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
//             All the Tools You Need
//           </h2>
//           <p className="text-xl text-gray-600">
//             Pick one and get started — takes seconds
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {tools.map((tool, i) => (
//             <div
//               key={i}
//               onClick={() => router.push(tool.link)}
//               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
//             >
//               <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
//               <div className="p-7 text-center">
//                 <div
//                   className={`p-5 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-105 transition-all duration-300`}
//                 >
//                   {tool.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition">
//                   {tool.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-5 leading-relaxed">
//                   {tool.desc}
//                 </p>
//                 <span className="text-indigo-600 font-semibold text-base flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
//                   Open Tool →
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <Link
//             href="/free-pdf-tools"
//             className="inline-block text-indigo-600 font-semibold text-lg hover:underline"
//           >
//             View all free PDF tools →
//           </Link>
//         </div>
//       </section>

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
//         >
//           <ArrowUp className="w-6 h-6" />
//         </button>
//       )}
//     </main>
//   );
// }





















// // "use client";

// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// // import { useState, useEffect } from "react";

// // import {
// //   ShieldCheck,
// //   RotateCw,
// //   PenTool,
// //   FileText,
// //   Image,
// //   FileType,
// //   FileArchive,
// //   FileImage,
// //   FileSpreadsheet,
// //   Split,
// //   QrCode,
// //   Lock,
// //   Ruler,
// //   Youtube,
// //   Image as ImageIcon,
// //   Stamp,
// //   ArrowUp
// // } from "lucide-react";



// // export default function HomeContent() {
// //   const router = useRouter();
// //   const [showBackToTop, setShowBackToTop] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   const tools = [
// //     { title: "PDF to Word Converter", desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.", link: "/pdf-to-word", icon: <FileType className="w-10 h-10" />, color: "from-rose-500 to-pink-600" },
// //     { title: "Merge PDF Files", desc: "Combine multiple PDFs into one clean file – great for reports or presentations.", link: "/merge-pdf", icon: <FileArchive className="w-10 h-10" />, color: "from-orange-500 to-red-600" },
// //     { title: "Split PDF Pages", desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.", link: "/split-pdf", icon: <Split className="w-10 h-10" />, color: "from-amber-500 to-orange-600" },
// //     { title: "Compress PDF", desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.", link: "/compress-pdf", icon: <FileText className="w-10 h-10" />, color: "from-yellow-500 to-amber-600" },
// //     { title: "Word to PDF", desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-blue-500 to-indigo-600" },
// //     { title: "Image to PDF", desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.", link: "/image-to-pdf", icon: <FileImage className="w-10 h-10" />, color: "from-teal-500 to-emerald-600" },
// //     { title: "Excel to PDF", desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-green-500 to-emerald-600" },
// //     {
// //       title: "PDF to JPG", desc: "Extract every page from your PDF as high-quality JPG images. Single page → direct JPG, multiple pages → ZIP file.", link: "/pdf-to-jpg", icon: <Image className="w-10 h-10" />, color: "from-orange-500 to-amber-600"
// //     },
// //     { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-10 h-10" />, color: "from-cyan-500 to-blue-600" },
// //     { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-10 h-10" />, color: "from-purple-500 to-violet-600" },
// //     { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-10 h-10" />, color: "from-lime-500 to-green-600" },
// //     { title: "YouTube Thumbnail Downloader", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-10 h-10" />, color: "from-red-600 to-rose-600" },
// //     { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-10 h-10" />, color: "from-sky-500 to-cyan-600" },
// //     { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-10 h-10" />, color: "from-indigo-500 to-purple-600" },
// //     { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-10 h-10" />, color: "from-emerald-500 to-teal-600" },
// //     { title: "HEIC to JPG Converter", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-10 h-10" />, color: "from-orange-500 to-amber-600" },
// //     { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-10 h-10" />, color: "from-violet-500 to-purple-600" },
// //     { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <FileImage className="w-10 h-10" />, color: "from-pink-500 to-rose-600" },
// //     { title: "Add Watermark", desc: "Protect your images with text or logo watermarks – adjust position and transparency.", link: "/add-watermark", icon: <Stamp className="w-10 h-10" />, color: "from-blue-500 to-cyan-600" },

// //     {
// //       title: "protect-pdf",
// //       desc: "Add password protection to your PDF files and keep your documents secure from unauthorized access.",
// //       link: "/protect-pdf",
// //       icon: <ShieldCheck className="w-10 h-10" />,
// //       color: "from-purple-500 to-indigo-600"
// //     },

// //     {
// //       title: "unlock-pdf",
// //       desc: "Remove password protection from PDF files instantly and access your documents without restrictions.",
// //       link: "/unlock-pdf",
// //       icon: <Lock className="w-10 h-10" />,
// //       color: "from-emerald-500 to-teal-600"
// //     },

// //     {
// //       title: "rotate-pdf",
// //       desc: "Rotate PDF pages 90°, 180°, or 270° to fix orientation quickly and easily online.",
// //       link: "/rotate-pdf",
// //       icon: <RotateCw className="w-10 h-10" />,
// //       color: "from-orange-500 to-red-500"
// //     },

// //     {
// //       title: "sign-pdf",
// //       desc: "Add your digital signature to PDF documents. Draw, type, or upload your signature securely.",
// //       link: "/sign-pdf",
// //       icon: <PenTool className="w-10 h-10" />,
// //       color: "from-blue-500 to-cyan-600"
// //     },


// //   ];

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

// //       {/* Hero Section */}
// //       <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-12 px-4 overflow-hidden">
// //         {/* overlay */}
// //         <div className="absolute inset-0 bg-black/20"></div>

// //         <div className="relative z-10 max-w-6xl mx-auto text-center">

// //           {/* Top badge */}
// //           <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium">
// //             🔒 Privacy-first PDF tools · No ads · No signup
// //           </div>

// //           {/* Main heading */}
// //           <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
// //             Free Online PDF Tools
// //             <br />
// //             Convert PDF to Word, Merge,
// //             <br />
// //             Split & Compress PDFs
// //           </h1>

// //           {/* Subtitle */}
// //           <p className="text-lg md:text-xl max-w-4xl mx-auto mb-6 opacity-95 leading-relaxed">
// //             PDF to Word, Word to PDF & other essential tools, fast, simple, and built for privacy.
// //           </p>

// //           {/* Personal line */}
// //           <p className="text-base md:text-lg max-w-4xl mx-auto mb-6 opacity-90">
// //             I built PDFLinx after getting tired of slow sites, intrusive pop-ups, and tools that upload files to shady servers.
// //           </p>

// //           {/* Emphasis line */}
// //           <p className="text-lg md:text-xl font-semibold mb-10">
// //             Everything runs in your browser, your files never leave your device.
// //           </p>

// //           {/* Feature pills */}
// //           <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base">
// //             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
// //               🔒 Files stay on your device
// //             </div>
// //             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
// //               ⚡ Actually fast
// //             </div>
// //             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
// //               🆓 Completely free
// //             </div>
// //           </div>

// //           {/* CTA buttons */}
// //           <div className="flex flex-col sm:flex-row justify-center gap-4">
// //             <button
// //               onClick={() =>
// //                 document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
// //               }
// //               className="bg-white text-indigo-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
// //             >
// //               Check Out the Tools
// //             </button>

// //             <a
// //               href="/pdf-to-word"
// //               className="bg-white/10 border border-white/30 backdrop-blur text-white font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-white/20 transition"
// //             >
// //               Try PDF to Word →
// //             </a>
// //           </div>

// //         </div>
// //       </section>



// //       {/* Why Choose */}
// //       <section className="py-20 px-4">
// //         <div className="text-center mb-12">
// //           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">Why I Built This</h2>
// //           <p className="text-xl text-gray-600 max-w-3xl mx-auto">And why you might actually like using it</p>
// //         </div>

// //         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
// //           {[
// //             { title: "No Creepy File Storage", text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.", emoji: "🔒" },
// //             { title: "Zero Ads", text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.", emoji: "🙅‍♂️" },
// //             { title: "Built for Speed", text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.", emoji: "⚡" },
// //             { title: "All Tools in One Place", text: "Stop jumping between 5 different websites. Everything you need is right here.", emoji: "🛠️" },
// //             { title: "No Account Needed", text: "Just open the site and start using. No email, no password, no spam later.", emoji: "🚀" },
// //             { title: "Works on Phone Too", text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.", emoji: "📱" },
// //           ].map((item, i) => (
// //             <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
// //               <div className="text-6xl mb-5">{item.emoji}</div>
// //               <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
// //               <p className="text-base text-gray-700 leading-relaxed">{item.text}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Tools Grid */}
// //       <section id="tools" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
// //         <div className="text-center mb-12">
// //           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
// //             All the Tools You Need
// //           </h2>
// //           <p className="text-xl text-gray-600">
// //             Pick one and get started — takes seconds
// //           </p>
// //         </div>

// //         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //           {tools.map((tool, i) => (
// //             <div
// //               key={i}
// //               onClick={() => router.push(tool.link)}
// //               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
// //             >
// //               <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
// //               <div className="p-7 text-center">
// //                 <div
// //                   className={`p-5 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-105 transition-all duration-300`}
// //                 >
// //                   {tool.icon}
// //                 </div>
// //                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition">
// //                   {tool.title}
// //                 </h3>
// //                 <p className="text-gray-600 text-sm mb-5 leading-relaxed">
// //                   {tool.desc}
// //                 </p>
// //                 <span className="text-indigo-600 font-semibold text-base flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
// //                   Open Tool →
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* 🔗 View All Tools Link */}
// //         <div className="text-center mt-12">
// //           <Link
// //             href="/free-pdf-tools"
// //             className="inline-block text-indigo-600 font-semibold text-lg hover:underline"
// //           >
// //             View all free PDF tools →
// //           </Link>
// //         </div>
// //       </section>

// //       {/* Back to Top */}
// //       {showBackToTop && (
// //         <button
// //           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// //           className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
// //         >
// //           <ArrowUp className="w-6 h-6" />
// //         </button>
// //       )}
// //     </main>
// //   );
// // }


