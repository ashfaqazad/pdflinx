"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = {
  convert:  { label: "Convert PDF",   color: "#E8380D", dot: "#E8380D" },
  compress: { label: "Compress",      color: "#1A7F5A", dot: "#1A7F5A" },
  mobile:   { label: "Mobile",        color: "#2563EB", dot: "#2563EB" },
  students: { label: "Students",      color: "#7C3AED", dot: "#7C3AED" },
  tips:     { label: "Tips & Tricks", color: "#D97706", dot: "#D97706" },
};

const THUMB_STYLES = {
  convert:  { bg: "linear-gradient(135deg,#E8380D 0%,#c4300b 100%)" },
  compress: { bg: "linear-gradient(135deg,#1A7F5A 0%,#145e43 100%)" },
  mobile:   { bg: "linear-gradient(135deg,#2563EB 0%,#1d4fc4 100%)" },
  students: { bg: "linear-gradient(135deg,#7C3AED 0%,#5b27b8 100%)" },
  tips:     { bg: "linear-gradient(135deg,#D97706 0%,#b86006 100%)" },
};

// ─── Articles Data ────────────────────────────────────────────────────────────
const articles = [
  // ── CONVERT ──
  {
    cat: "convert", icon: "📝", featured: true,
    title: "Convert PDF to Word Online Without Losing Formatting",
    excerpt: "Locked PDFs driving you crazy? Here's how I turn any PDF into an editable Word file without ruining the layout, fonts, or images.",
    date: "Aug 24, 2025", read: "5 min", slug: "pdf-to-word",
  },
  {
    cat: "convert", icon: "🔧",
    title: "PDF to Word Formatting Messed Up? Here's How to Fix It",
    excerpt: "Fonts changing, tables breaking, images shifting — PDF to Word conversion messes up formatting more often than not. Here's how to fix it fast.",
    date: "Feb 22, 2026", read: "4 min", slug: "pdf-to-word-formatting-messed-up",
  },
  {
    cat: "convert", icon: "🔍",
    title: "How to Edit Scanned PDF in Word (The Easy Way with OCR)",
    excerpt: "Scanned PDFs are just images — no way to copy text, highlight, or edit anything. Here's how I quickly turn any scanned PDF into a fully editable Word file using OCR.",
    date: "Feb 23, 2026", read: "5 min", slug: "how-to-edit-scanned-pdf-in-word",
  },
  {
    cat: "convert", icon: "📄",
    title: "Convert PDF Resume to Editable Word Without Losing Layout",
    excerpt: "Job portals demand Word resumes, but converting PDF versions often ruins columns, bullets, photos, and spacing.",
    date: "Feb 24, 2026", read: "3 min", slug: "convert-pdf-resume-to-editable-word",
  },
  {
    cat: "convert", icon: "⚡",
    title: "Convert Word to PDF Instantly (No Software Needed)",
    excerpt: "Need to turn your Word doc into a clean, professional PDF? Here's how I do it in seconds — no software, no watermarks.",
    date: "Aug 26, 2025", read: "2 min", slug: "word-to-pdf",
  },
  {
    cat: "convert", icon: "🖼️",
    title: "Convert Images (JPG, PNG) to PDF in Seconds",
    excerpt: "Combine multiple images into one clear, professional PDF document. Supports JPG, PNG, and more — perfect for portfolios.",
    date: "Aug 28, 2025", read: "3 min", slug: "image-to-pdf",
  },
  {
    cat: "convert", icon: "📊",
    title: "Merge Multiple PDF Files into One Online",
    excerpt: "Got a bunch of separate PDFs you need to combine? Here's how I quickly merge them into one clean file.",
    date: "Aug 30, 2025", read: "3 min", slug: "merge-pdf",
  },
  {
    cat: "convert", icon: "✂️",
    title: "Split PDF Files Online (Extract Specific Pages Easily)",
    excerpt: "Got a big PDF and only need a few pages? Here's how I quickly pull out exactly what I want.",
    date: "Sep 1, 2025", read: "3 min", slug: "split-pdf",
  },
  {
    cat: "convert", icon: "📑",
    title: "Convert Excel to PDF Without Losing Formatting",
    excerpt: "Need to turn your Excel spreadsheet into a clean PDF that keeps all the tables, charts, and formatting perfect?",
    date: "Sep 5, 2025", read: "4 min", slug: "excel-pdf",
  },
  {
    cat: "convert", icon: "🎯",
    title: "Convert PDF Pages to JPG Images Online",
    excerpt: "Need images from a PDF fast? Here's how I convert every PDF page into high-quality JPG files in seconds.",
    date: "Sep 7, 2025", read: "3 min", slug: "pdf-to-jpg",
  },
  {
    cat: "convert", icon: "🖥️",
    title: "Convert PowerPoint to PDF Without Breaking the Layout",
    excerpt: "Want to share slides without worrying about fonts, spacing, or compatibility issues? Here's how I convert PowerPoint to PDF.",
    date: "Sep 9, 2025", read: "3 min", slug: "ppt-to-pdf",
  },
  {
    cat: "convert", icon: "🆓",
    title: "Free vs Paid Word to PDF Tools — What's Actually Different?",
    excerpt: "Do you really need to pay for Word to PDF conversion? Here's the real difference between free and paid tools.",
    date: "Mar 20, 2026", read: "7 min", slug: "free-vs-paid-word-to-pdf-tools",
  },
  {
    cat: "convert", icon: "🌐",
    title: "How to Convert Word to PDF Free Online (No Software Needed)",
    excerpt: "Need to convert a Word document to PDF quickly without installing software? Here's the fastest way online.",
    date: "Mar 15, 2026", read: "3 min", slug: "how-to-convert-word-to-pdf",
  },
  {
    cat: "convert", icon: "📐",
    title: "How to Convert Word to PDF Without Losing Formatting",
    excerpt: "Fonts changing, tables breaking, and layout shifting after conversion? Here's how to convert Word to PDF without losing formatting.",
    date: "Mar 16, 2026", read: "5 min", slug: "convert-word-to-pdf-without-losing-formatting",
  },
  {
    cat: "convert", icon: "🛠️",
    title: "Word to PDF Not Working? Here's How to Fix It",
    excerpt: "Getting blank PDFs, upload errors, or broken formatting? Here's how to fix common Word to PDF conversion problems.",
    date: "Mar 18, 2026", read: "4 min", slug: "word-to-pdf-not-working-fix",
  },
  {
    cat: "convert", icon: "🤖",
    title: "ChatGPT Generated a PDF — How to Convert It to Word?",
    excerpt: "Can't edit a PDF created by ChatGPT? This free tool fixes it in 30 seconds — no signup, no watermark, OCR included.",
    date: "Apr 14, 2026", read: "4 min", slug: "how-to-convert-chatgpt-pdf-to-word",
  },

  // ── COMPRESS ──
  {
    cat: "compress", icon: "🗜️",
    title: "Compress PDF Files Without Losing Quality (Complete Guide)",
    excerpt: "Learn how to compress PDF files without losing quality using the best methods. Reduce file size fast for email, upload, and sharing.",
    date: "Sep 3, 2025", read: "6 min", slug: "compress-pdf",
  },
  {
    cat: "compress", icon: "📦",
    title: "PDF Too Large to Upload? Fix It in Seconds",
    excerpt: "PDF too large to upload or send? Fix file size issues instantly with simple compression methods — no quality loss.",
    date: "Apr 17, 2026", read: "3 min", slug: "pdf-file-too-large-compress",
  },
  {
    cat: "compress", icon: "⚖️",
    title: "How to Compress a PDF Free Online (Reduce File Size Instantly)",
    excerpt: "PDF too large to email or upload? Here's how to compress any PDF in seconds — no software, no signup, no watermark.",
    date: "Mar 22, 2026", read: "4 min", slug: "how-to-compress-a-pdf",
  },
  {
    cat: "compress", icon: "✨",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt: "Worried compression will ruin your PDF? Here's exactly what happens to images and text — and how to reduce size without visible quality loss.",
    date: "Mar 23, 2026", read: "5 min", slug: "compress-pdf-without-losing-quality",
  },
  {
    cat: "compress", icon: "📉",
    title: "PDF Still Too Large After Compression? Here's How to Fix It",
    excerpt: "Compressed your PDF but it's still too big? Here are the real reasons compression sometimes doesn't work.",
    date: "Mar 25, 2026", read: "4 min", slug: "pdf-still-too-large-after-compression",
  },
  {
    cat: "compress", icon: "📏",
    title: "Why Are PDF Files So Large? (And How to Fix It)",
    excerpt: "Ever wondered why a simple PDF ends up being 50MB? Here's what actually makes PDFs large — and the fastest fix.",
    date: "Mar 26, 2026", read: "5 min", slug: "why-are-pdf-files-so-large",
  },

  // ── MOBILE ──
  {
    cat: "mobile", icon: "📱",
    title: "How to Compress a PDF on Mobile (Android & iPhone)",
    excerpt: "Need to shrink a PDF from your phone before sending? Here's how to compress any PDF directly in your mobile browser.",
    date: "Mar 24, 2026", read: "3 min", slug: "compress-pdf-on-mobile",
  },
  {
    cat: "mobile", icon: "🤳",
    title: "How to Convert Word to PDF on Mobile (Android & iPhone)",
    excerpt: "Convert Word documents to PDF directly on your phone — no app needed. Works on Android and iPhone in under a minute.",
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
    excerpt: "Assignments piling up, group projects, exams, and PDFs that won't cooperate — here are the tools that actually help.",
    date: "Dec 11, 2025", read: "6 min", slug: "best-tools-for-students",
  },
  {
    cat: "students", icon: "📚",
    title: "Word to PDF for Students — How to Submit Assignments as PDF",
    excerpt: "Submitting assignments as DOCX can break formatting or get rejected. Here's how students can convert Word to PDF properly.",
    date: "Mar 21, 2026", read: "2 min", slug: "word-to-pdf-for-students",
  },
  {
    cat: "students", icon: "🤖",
    title: "ChatGPT Generated a PDF — How to Convert It to Word?",
    excerpt: "Can't edit a PDF created by ChatGPT? This free tool fixes it in 30 seconds — no signup, no watermark, OCR included.",
    date: "Apr 14, 2026", read: "4 min", slug: "how-to-convert-chatgpt-pdf-to-word",
  },
  {
    cat: "students", icon: "📖",
    title: "PDF File Opens but Not Editable — Fix It in 30 Seconds",
    excerpt: "PDF opens but you can't edit anything? Here's the fastest free way to fix a non-editable PDF using OCR.",
    date: "Apr 15, 2026", read: "3 min", slug: "pdf-not-editable-fix",
  },

  // ── TIPS ──
  {
    cat: "tips", icon: "🔒",
    title: "Protect PDF with a Password Online for Free",
    excerpt: "Need to lock a PDF before sending it? Here's how I add password protection to sensitive files in seconds.",
    date: "Sep 11, 2025", read: "3 min", slug: "protect-pdf",
  },
  {
    cat: "tips", icon: "🔓",
    title: "Unlock PDF Files Online Without Hassle",
    excerpt: "Got a password-protected PDF you need easier access to? Here's how I unlock PDF files quickly and securely.",
    date: "Sep 13, 2025", read: "4 min", slug: "unlock-pdf",
  },
  {
    cat: "tips", icon: "🔄",
    title: "Rotate PDF Pages Online to Fix Wrong Orientation",
    excerpt: "Ever opened a PDF and found half the pages sideways or upside down? Here's how to fix orientation in seconds.",
    date: "Sep 15, 2025", read: "2 min", slug: "rotate-pdf",
  },
  {
    cat: "tips", icon: "✍️",
    title: "Sign PDF Online with a Digital Signature",
    excerpt: "Need to sign a contract or form fast? Here's how I add a digital signature to PDFs online without printing or scanning.",
    date: "Sep 17, 2025", read: "3 min", slug: "sign-pdf",
  },
  {
    cat: "tips", icon: "🔡",
    title: "Use OCR to Extract Text from Scanned PDFs",
    excerpt: "Scanned PDFs are frustrating when you can't copy or edit anything. Here's how OCR turns them into editable text.",
    date: "Sep 19, 2025", read: "4 min", slug: "ocr-pdf",
  },
  {
    cat: "tips", icon: "🖊️",
    title: "Edit PDF Files Online Without Installing Software",
    excerpt: "Need to fix text, add content, or update a PDF quickly? Here's how I edit PDFs online without any desktop software.",
    date: "Sep 21, 2025", read: "3 min", slug: "edit-pdf",
  },
  {
    cat: "tips", icon: "🖼️",
    title: "Add Watermark to PDF Files Online",
    excerpt: "Want to protect your PDF with branding or ownership text? Here's how I add watermarks while keeping documents readable.",
    date: "Sep 23, 2025", read: "3 min", slug: "add-watermark",
  },
  {
    cat: "tips", icon: "🔧",
    title: "Why Does Formatting Break When Converting Word to PDF?",
    excerpt: "Ever wondered why your Word document looks perfect but the PDF gets messed up? Here's the real reason — and how to prevent it.",
    date: "Mar 19, 2026", read: "5 min", slug: "why-formatting-breaks-in-word-to-pdf",
  },
  {
    cat: "tips", icon: "🏢",
    title: "Client Sent a PDF? How Freelancers Edit It for Free",
    excerpt: "Got a PDF from a client that you can't edit? Here's how freelancers convert any locked PDF into an editable Word file.",
    date: "Apr 16, 2026", read: "5 min", slug: "freelancer-edit-pdf-free",
  },
  {
    cat: "tips", icon: "🖨️",
    title: "Best Free Image Converter Tools Online in 2025",
    excerpt: "Need to convert HEIC to JPG, WebP to PNG, or resize images? I tested 10+ tools and found one that actually works — no watermarks.",
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
        <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:dot, display:"inline-block" }} />
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
      <div style={{ background:thumb.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", minHeight:"240px" }}>
        <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"180px", height:"180px", borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
        <div style={{ position:"absolute", bottom:"-50px", left:"-30px", width:"140px", height:"140px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <span style={{ fontSize:"4rem", position:"relative", zIndex:1 }}>{article.icon}</span>
      </div>

      {/* Body */}
      <div style={{ padding:"2rem", display:"flex", flexDirection:"column", justifyContent:"center", background:"#FFFFFF" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontWeight:600, color:"#888", marginBottom:"0.8rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>
          <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:cat.color, display:"inline-block" }} />
          {cat.label} · Featured
        </div>
        <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.6rem", lineHeight:1.25, color:"#111111", marginBottom:"0.8rem" }}>
          {article.title}
        </h2>
        <p style={{ fontSize:"14px", color:"#444444", lineHeight:1.75, marginBottom:"1.2rem" }}>
          {article.excerpt}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#888", marginBottom:"1rem", flexWrap:"wrap" }}>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.read} read</span>
          <span style={{ background:"#FEF0ED", color:"#E8380D", fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"100px" }}>
            Most Popular
          </span>
        </div>
        <span style={{ fontSize:"14px", fontWeight:600, color:"#E8380D" }}>
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
      <div style={{ background:thumb.bg, height:"140px", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <span style={{ position:"absolute", top:"12px", left:"12px", background:"rgba(0,0,0,0.25)", color:"#fff", fontSize:"10px", fontWeight:700, padding:"3px 10px", borderRadius:"100px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
          {cat.label}
        </span>
        <div style={{ position:"absolute", top:"-30px", right:"-30px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize:"2.4rem", position:"relative", zIndex:1 }}>{article.icon}</span>
      </div>

      {/* Body */}
      <div style={{ padding:"1.2rem 1.4rem 1.4rem" }}>
        <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.05rem", lineHeight:1.35, color:"#111111", marginBottom:"0.5rem" }}>
          {article.title}
        </h3>
        <p style={{ fontSize:"13.5px", color:"#444444", lineHeight:1.7, marginBottom:"1rem", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {article.excerpt}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"12px", color:"#888" }}>{article.date} · {article.read}</span>
          <span style={{ fontSize:"13px", fontWeight:600, color:"#E8380D" }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function BlogClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Deduplicate by slug (some articles appear in 2 categories)
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

      <div className="blog-page" style={{ fontFamily:"'DM Sans', sans-serif", background:"#F7F5F2", color:"#111111", minHeight:"100vh" }}>

        {/* ── HERO ── */}
        <div
          className="blog-hero-wrap"
          style={{ padding:"4rem 2rem 2.5rem", maxWidth:"1100px", margin:"0 auto", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"2rem", flexWrap:"wrap" }}
        >
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#E8380D", marginBottom:"0.8rem" }}>
              <span style={{ width:"20px", height:"2px", background:"#E8380D", display:"inline-block" }} />
              PDF Linx Blog
            </div>
            <h1 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"clamp(2.2rem, 5vw, 3.8rem)", lineHeight:1.1, color:"#111111", marginBottom:"0.6rem" }}>
              Real guides for{" "}
              <em style={{ fontStyle:"italic", color:"#E8380D" }}>real</em>{" "}
              PDF problems
            </h1>
            <p style={{ fontSize:"15px", color:"#888", maxWidth:"440px", lineHeight:1.6 }}>
              Simple, no-nonsense guides for PDF tools — tested in real life, completely free.
            </p>
          </div>

          <div style={{ display:"flex", gap:"2rem", flexShrink:0 }}>
            {[["39+","Articles"],["5","Categories"],["Free","Always"]].map(([num, label]) => (
              <div key={label} style={{ textAlign:"right" }}>
                <span style={{ fontFamily:"'Instrument Serif', serif", fontSize:"2rem", color:"#111111", display:"block" }}>{num}</span>
                <span style={{ fontSize:"12px", color:"#888" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 2rem 2rem" }}>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", borderBottom:"1px solid #E5E2DC", paddingBottom:"1.5rem" }}>
            <FilterButton label="All Articles" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <FilterButton key={key} label={cat.label} dot={cat.dot} active={activeFilter === key} onClick={() => setActiveFilter(key)} />
            ))}
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 2rem 2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"#FFFFFF", border:"1px solid #E5E2DC", borderRadius:"10px", padding:"10px 16px", maxWidth:"400px" }}>
            <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border:"none", outline:"none", fontFamily:"'DM Sans', sans-serif", fontSize:"14px", color:"#111111", background:"transparent", width:"100%" }}
            />
          </div>
        </div>

        {/* ── FEATURED ── */}
        {showFeatured && (
          <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 2rem 2rem" }}>
            <FeaturedCard article={featuredArticle} />
          </div>
        )}

        {/* ── ARTICLE GRID ── */}
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 2rem 4rem" }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"1.5rem" }}>
            <h2 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"1.6rem", color:"#111111" }}>
              {activeFilter === "all" ? "All Articles" : CATEGORIES[activeFilter].label}
            </h2>
            <span style={{ fontSize:"13px", color:"#888" }}>{gridArticles.length} articles</span>
          </div>

          {gridArticles.length === 0 ? (
            <div style={{ textAlign:"center", padding:"4rem 2rem", color:"#888", fontSize:"15px" }}>
              No articles found. Try a different search.
            </div>
          ) : (
            <div
              className="article-grid"
              style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"20px" }}
            >
              {gridArticles.map((article, i) => (
                <ArticleCard key={article.slug + i} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* ── NEWSLETTER ── */}
        <div style={{ background:"#111111", padding:"4rem 2rem", textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Instrument Serif', serif", fontSize:"clamp(1.6rem, 3vw, 2.2rem)", color:"#FFFFFF", marginBottom:"0.6rem" }}>
            Get PDF tips in your inbox
          </h3>
          <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.6)", marginBottom:"1.8rem" }}>
            One useful tip per week. No spam, no subscriptions — unsubscribe anytime.
          </p>
          <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
            <input type="email" placeholder="your@email.com" className="nl-input" />
            <button className="nl-btn">Subscribe Free</button>
          </div>
        </div>

      </div>
    </>
  );
}































// "use client";

// import Link from "next/link";

// // Color palette for cards - iLovePDF style
// const CARD_COLORS = [
//   { bg: "#E8F5E9", accent: "#2E7D32", text: "#1B5E20" },   // green
//   { bg: "#FFF8E1", accent: "#F9A825", text: "#E65100" },   // yellow
//   { bg: "#FCE4EC", accent: "#C62828", text: "#B71C1C" },   // red
//   { bg: "#E3F2FD", accent: "#1565C0", text: "#0D47A1" },   // blue
//   { bg: "#F3E5F5", accent: "#6A1B9A", text: "#4A148C" },   // purple
//   { bg: "#E0F7FA", accent: "#00838F", text: "#006064" },   // teal
//   { bg: "#FBE9E7", accent: "#BF360C", text: "#BF360C" },   // deep orange
//   { bg: "#F9FBE7", accent: "#827717", text: "#558B2F" },   // lime
// ];

// const blogs = [
//   {
//     title: "Convert PDF to Word Online Without Losing Formatting",
//     description:
//       "Locked PDFs driving you crazy? Here's how I turn any PDF into an editable Word file without ruining the layout, fonts, or images. I use this free tool every week — no software needed, no signup, just works.",
//     date: "Aug 24, 2025",
//     slug: "pdf-to-word",
//   },
//   {
//     title: "PDF to Word Formatting Messed Up? Here's How to Fix It",
//     description:
//       "Fonts changing, tables breaking, images shifting — PDF to Word conversion messes up formatting more often than not. Here's how to fix it fast and get a clean, editable Word file every time.",
//     date: "Feb 22, 2026",
//     slug: "pdf-to-word-formatting-messed-up",
//   },
//   {
//     title: "How to Edit Scanned PDF in Word (The Easy Way with OCR)",
//     description:
//       "Scanned PDFs are just images — no way to copy text, highlight, or edit anything. Here's how I quickly turn any scanned PDF into a fully editable Word file using OCR.",
//     date: "Feb 23, 2026",
//     slug: "how-to-edit-scanned-pdf-in-word",
//   },
//   {
//     title: "Convert PDF Resume to Editable Word Without Losing Layout",
//     description:
//       "Job portals demand Word resumes, but converting PDF versions often ruins columns, bullets, photos, and spacing. Here's how I convert PDF resumes to clean, editable Word files.",
//     date: "Feb 24, 2026",
//     slug: "convert-pdf-resume-to-editable-word",
//   },
//   {
//     title: "Convert Word to PDF Instantly (No Software Needed)",
//     description:
//       "Need to turn your Word doc into a clean, professional PDF that looks perfect everywhere? Here's how I do it in seconds — no software, no watermarks, just a sharp PDF ready to send.",
//     date: "Aug 26, 2025",
//     slug: "word-to-pdf",
//   },
//   {
//     title: "Convert Images (JPG, PNG) to PDF in Seconds",
//     description:
//       "Combine multiple images into one clear, professional PDF document. Perfect for photos, scanned documents, receipts, or portfolios. Supports JPG, PNG, and more.",
//     date: "Aug 28, 2025",
//     slug: "image-to-pdf",
//   },
//   {
//     title: "Merge Multiple PDF Files into One Online",
//     description:
//       "Got a bunch of separate PDFs you need to combine? Here's how I quickly merge them into one clean file — perfect for reports, invoices, or study notes.",
//     date: "Aug 30, 2025",
//     slug: "merge-pdf",
//   },
  
//   {
//     title: "Split PDF Files Online (Extract Specific Pages Easily)",
//     description:
//       "Got a big PDF and only need a few pages? Here's how I quickly pull out exactly what I want — perfect for reports, contracts, or study notes.",
//     date: "Sep 1, 2025",
//     slug: "split-pdf",
//   },

//   // {
//   //   title: "Compress PDF Files Without Losing Quality",
//   //   description:
//   //     "Got a massive PDF that won't attach to emails or takes forever to upload? Here's how I shrink them down super small while keeping everything looking sharp.",
//   //   date: "Sep 3, 2025",
//   //   slug: "compress-pdf",
//   // },

//   {
//   title: "Compress PDF Files Without Losing Quality (Complete Guide)",
//   description:
//     "Learn how to compress PDF files without losing quality using the best methods and tools. Reduce file size fast for email, upload, and sharing.",
//   date: "Sep 3, 2025",
//   slug: "compress-pdf",
// },

// //   { 
// //   title: "PDF File Too Large? Compress It Without Losing Quality",
// //   description:
// //     "PDF file too large to upload or send? Learn how to compress PDF files quickly without losing quality — free, fast, and no software needed.",
// //   date: "Apr 17, 2026",
// //   slug: "pdf-file-too-large-compress",
// // },

// {
//   title: "PDF Too Large to Upload? Fix It in Seconds",
//   description:
//     "PDF too large to upload or send? Fix file size issues instantly with simple compression methods — no quality loss, no software needed.",
//   date: "Apr 17, 2026",
//   slug: "pdf-file-too-large-compress",
// },

//   {
//     title: "Convert Excel to PDF Without Losing Formatting",
//     description:
//       "Need to turn your Excel spreadsheet into a clean PDF that keeps all the tables, charts, and formatting perfect? Here's how I do it in seconds.",
//     date: "Sep 5, 2025",
//     slug: "excel-pdf",
//   },
//   {
//     title: "Convert PDF Pages to JPG Images Online",
//     description:
//       "Need images from a PDF fast? Here's how I convert every PDF page into high-quality JPG files in seconds — perfect for sharing pages as images or presentations.",
//     date: "Sep 7, 2025",
//     slug: "pdf-to-jpg",
//   },
//   {
//     title: "Convert PowerPoint to PDF Without Breaking the Layout",
//     description:
//       "Want to share slides without worrying about fonts, spacing, or compatibility issues? Here's how I convert PowerPoint presentations to PDF while keeping everything clean.",
//     date: "Sep 9, 2025",
//     slug: "ppt-to-pdf",
//   },
//   {
//     title: "Protect PDF with a Password Online for Free",
//     description:
//       "Need to lock a PDF before sending it? Here's how I add password protection to sensitive files in seconds — perfect for contracts, reports, and personal documents.",
//     date: "Sep 11, 2025",
//     slug: "protect-pdf",
//   },
//   {
//     title: "Unlock PDF Files Online Without Hassle",
//     description:
//       "Got a password-protected PDF you need easier access to? Here's how I unlock PDF files quickly and securely so I can work with them again.",
//     date: "Sep 13, 2025",
//     slug: "unlock-pdf",
//   },
//   {
//     title: "Rotate PDF Pages Online to Fix Wrong Orientation",
//     description:
//       "Ever opened a PDF and found half the pages sideways or upside down? Here's how I rotate PDF pages online in seconds so everything reads properly again.",
//     date: "Sep 15, 2025",
//     slug: "rotate-pdf",
//   },
//   {
//     title: "Sign PDF Online with a Digital Signature",
//     description:
//       "Need to sign a contract, form, or agreement fast? Here's how I add a digital signature to PDFs online without printing, scanning, or installing anything.",
//     date: "Sep 17, 2025",
//     slug: "sign-pdf",
//   },
//   {
//     title: "Use OCR to Extract Text from Scanned PDFs",
//     description:
//       "Scanned PDFs are frustrating when you can't copy or edit anything. Here's how I use OCR to turn scanned PDF pages into selectable, editable text in minutes.",
//     date: "Sep 19, 2025",
//     slug: "ocr-pdf",
//   },
//   {
//     title: "Edit PDF Files Online Without Installing Software",
//     description:
//       "Need to fix text, add content, or update a PDF quickly? Here's how I edit PDF files online without downloading heavy desktop software or dealing with complicated tools.",
//     date: "Sep 21, 2025",
//     slug: "edit-pdf",
//   },
//   {
//     title: "Add Watermark to PDF Files Online",
//     description:
//       "Want to protect your PDF with branding or ownership text? Here's how I add text or image watermarks to PDF files online while keeping the document clean and readable.",
//     date: "Sep 23, 2025",
//     slug: "add-watermark",
//   },
//   {
//     title: "Best Tools for Students to Study Smarter in 2025",
//     description:
//       "Assignments piling up, group projects, exams, and PDFs that won't cooperate — student life is hectic. Here are the tools that actually help you work faster and smarter.",
//     date: "Dec 11, 2025",
//     slug: "best-tools-for-students",
//   },
//   {
//     title: "How to Compress a PDF Free Online (Reduce File Size Instantly)",
//     description:
//       "PDF too large to email or upload? Here's how to compress any PDF in seconds — no software, no signup, no watermark. Works on mobile too.",
//     date: "Mar 22, 2026",
//     slug: "how-to-compress-a-pdf",
//   },
//   {
//     title: "How to Compress a PDF Without Losing Quality",
//     description:
//       "Worried compression will ruin your PDF? Here's exactly what happens to images, text, and fonts during compression — and how to reduce file size without any visible quality loss.",
//     date: "Mar 23, 2026",
//     slug: "compress-pdf-without-losing-quality",
//   },
//   {
//     title: "How to Compress a PDF on Mobile (Android & iPhone)",
//     description:
//       "Need to shrink a PDF from your phone before sending? Here's how to compress any PDF directly in your mobile browser — no app needed, works on both Android and iPhone.",
//     date: "Mar 24, 2026",
//     slug: "compress-pdf-on-mobile",
//   },
//   {
//     title: "PDF Still Too Large After Compression? Here's How to Fix It",
//     description:
//       "Compressed your PDF but it's still too big? Here are the real reasons compression sometimes doesn't work — and exactly what to do in each case.",
//     date: "Mar 25, 2026",
//     slug: "pdf-still-too-large-after-compression",
//   },
//   {
//     title: "Why Are PDF Files So Large? (And How to Fix It)",
//     description:
//       "Ever wondered why a simple PDF ends up being 50MB? Here's what actually makes PDFs large — images, scans, fonts, layers — and the fastest way to fix each one.",
//     date: "Mar 26, 2026",
//     slug: "why-are-pdf-files-so-large",
//   },
//   {
//     title: "How Small Should I Compress My PDF? (Size Guide by Use Case)",
//     description:
//       "Email, WhatsApp, university portals, websites, printing — every use case needs a different PDF size. Here's the exact target size for each one so you compress just enough.",
//     date: "Mar 27, 2026",
//     slug: "how-small-should-i-compress-my-pdf",
//   },
//   {
//     title: "How to Convert Word to PDF Free Online (No Software Needed)",
//     description:
//       "Need to convert a Word document to PDF quickly without installing software? Here's the fastest way to turn DOC or DOCX into a clean, professional PDF online.",
//     date: "Mar 15, 2026",
//     slug: "how-to-convert-word-to-pdf",
//   },
//   {
//     title: "How to Convert Word to PDF Without Losing Formatting",
//     description:
//       "Fonts changing, tables breaking, and layout shifting after conversion? Here's how to convert Word to PDF without losing formatting — including exact fixes for fonts, margins, images, and tables.",
//     date: "Mar 16, 2026",
//     slug: "convert-word-to-pdf-without-losing-formatting",
//   },
//   {
//     title: "How to Convert Word to PDF on Mobile (Android & iPhone)",
//     description:
//       "Convert Word documents to PDF directly on your phone — no app needed. Here's how to do it on Android and iPhone in under a minute using your mobile browser.",
//     date: "Mar 17, 2026",
//     slug: "word-to-pdf-on-mobile",
//   },
//   {
//     title: "Word to PDF Not Working? Here's How to Fix It",
//     description:
//       "Getting blank PDFs, upload errors, or broken formatting? Here's how to fix common Word to PDF conversion problems step by step — including real solutions that actually work.",
//     date: "Mar 18, 2026",
//     slug: "word-to-pdf-not-working-fix",
//   },
//   {
//     title: "Why Does Formatting Break When Converting Word to PDF?",
//     description:
//       "Ever wondered why your Word document looks perfect but the PDF gets messed up? Here's the real reason formatting breaks during conversion — and how to prevent it.",
//     date: "Mar 19, 2026",
//     slug: "why-formatting-breaks-in-word-to-pdf",
//   },
//   {
//     title: "Free vs Paid Word to PDF Tools — What's Actually Different?",
//     description:
//       "Do you really need to pay for Word to PDF conversion? Here's the real difference between free and paid tools — and when upgrading actually makes sense.",
//     date: "Mar 20, 2026",
//     slug: "free-vs-paid-word-to-pdf-tools",
//   },
//   {
//     title: "Word to PDF for Students — How to Submit Assignments as PDF",
//     description:
//       "Submitting assignments as DOCX can break formatting or get rejected. Here's how students can convert Word to PDF properly before submission — fast, free, and reliable.",
//     date: "Mar 21, 2026",
//     slug: "word-to-pdf-for-students",
//   },
//   {
//     title: "Best Free Image Converter Tools Online in 2025",
//     description:
//       "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup.",
//     date: "Apr 2, 2026",
//     slug: "best-free-image-converter-tools",
//   },

//   {
//   title: "ChatGPT Generated a PDF — How to Convert It to Word?",
//   description:
//     "Can't edit a PDF created by ChatGPT? This free tool fixes it in 30 seconds — no signup, no watermark, OCR included.",
//   date: "Apr 14, 2026",
//   slug: "how-to-convert-chatgpt-pdf-to-word",
// },

// {
//   title: "PDF File Opens but Not Editable — Fix It in 30 Seconds",
//   description:
//     "PDF opens but you can't edit anything? Here's the fastest free way to fix a non-editable PDF using OCR — no software needed.",
//   date: "Apr 15, 2026",
//   slug: "pdf-not-editable-fix",
// },

// {
//   title: "Client Sent a PDF? How Freelancers Edit It for Free",
//   description:
//     "Got a PDF from a client that you can't edit? Here's how freelancers convert any locked PDF into an editable Word file in seconds — free.",
//   date: "Apr 16, 2026",
//   slug: "freelancer-edit-pdf-free",
// },

// ];

// // PDF icon SVG
// function PdfIcon({ color = "#fff", size = 32 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
//       <rect x="4" y="2" width="18" height="24" rx="2" fill={color} fillOpacity="0.25" />
//       <path d="M4 2h13l5 5v19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.5" fill="none" />
//       <path d="M17 2v5h5" stroke={color} strokeWidth="1.5" fill="none" />
//       <path d="M8 14h10M8 18h7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
//     </svg>
//   );
// }

// // Colored thumbnail card (top part of each blog card)
// function CardThumbnail({ title, colorScheme }) {
//   return (
//     <div
//       style={{ backgroundColor: colorScheme.accent }}
//       className="relative h-36 flex items-center justify-center px-5 overflow-hidden"
//     >
//       {/* Background circle decoration */}
//       <div
//         style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
//         className="absolute -top-6 -right-6 w-28 h-28 rounded-full"
//       />
//       <div
//         style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
//         className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full"
//       />

//       {/* Icon top-left */}
//       <div className="absolute top-3 left-4 opacity-80">
//         <PdfIcon color="#fff" size={22} />
//       </div>

//       {/* Title text */}
//       <p
//         className="text-white font-bold text-lg leading-snug text-center relative z-10 line-clamp-3"
//         style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
//       >
//         {title}
//       </p>
//     </div>
//   );
// }

// export default function BlogClient() {
//   const featuredPost = blogs[0];
//   const restPosts = blogs.slice(1);

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900">
//           Blog
//         </h1>
//         <p className="text-gray-500 text-base max-w-xl mx-auto">
//           Simple, no-nonsense guides for PDF tools — tested in real life, completely free.
//         </p>
//       </div>

//       {/* Featured Post - Big Hero Card */}
//       <Link href={`/blog/${featuredPost.slug}`} className="block mb-8 group">
//         <div className="rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row hover:shadow-xl transition-all duration-300 border border-gray-100">
//           {/* Left: Big colored panel */}
//           <div
//             className="sm:w-64 h-52 sm:h-auto flex-shrink-0 flex items-center justify-center relative overflow-hidden"
//             style={{ backgroundColor: "#E53935" }}
//           >
//             <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white opacity-5" />
//             <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white opacity-5" />
//             <div className="absolute top-4 left-4 opacity-70">
//               <PdfIcon color="#fff" size={26} />
//             </div>
//             <p className="text-white font-extrabold text-xl leading-snug text-center px-6 relative z-10">
//               {featuredPost.title}
//             </p>
//           </div>

//           {/* Right: Content */}
//           <div className="bg-white flex-1 p-6 flex flex-col justify-center">
//             <span className="text-xs text-gray-400 mb-2 block">{featuredPost.date}</span>
//             <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
//               {featuredPost.title}
//             </h2>
//             <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
//               {featuredPost.description}
//             </p>
//             <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
//               Read More <span>→</span>
//             </span>
//           </div>
//         </div>
//       </Link>

//       {/* Grid of Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {restPosts.map((blog, index) => {
//           const colorScheme = CARD_COLORS[index % CARD_COLORS.length];
//           return (
//             <Link
//               key={index}
//               href={`/blog/${blog.slug}`}
//               className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 bg-white"
//             >
//               {/* Colored Top Thumbnail */}
//               <CardThumbnail title={blog.title} colorScheme={colorScheme} />

//               {/* Card Body */}
//               <div className="p-4 min-h-64">
//                 <span className="text-sm text-gray-400 block mb-1">{blog.date}</span>
//                 <h2 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
//                   {blog.title}
//                 </h2>
//                 <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">
//                   {blog.description}
//                 </p>
                
//                 <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
//                   Read More <span>→</span>
//                 </span>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </main>
//   );
// }































// // "use client";

// // import Link from "next/link";

// // export default function BlogClient() {
// //   const blogs = [
// //     {
// //       title: "Convert PDF to Word Online Without Losing Formatting",
// //       description:
// //         "Locked PDFs driving you crazy? Here's how I turn any PDF into an editable Word file without ruining the layout, fonts, or images. I use this free tool every week — no software needed, no signup, just works.",
// //       date: "Aug 24, 2025",
// //       slug: "pdf-to-word",
// //     },

// //     {
// //       title: "PDF to Word Formatting Messed Up? Here's How to Fix It",
// //       description:
// //         "Fonts changing, tables breaking, images shifting — PDF to Word conversion messes up formatting more often than not. Here's how to fix it fast and get a clean, editable Word file every time. Free tool, no signup, no software needed.",
// //       date: "Feb 22, 2026",
// //       slug: "pdf-to-word-formatting-messed-up",
// //     },
// //     {
// //       title: "How to Edit Scanned PDF in Word (The Easy Way with OCR)",
// //       description:
// //         "Scanned PDFs are just images — no way to copy text, highlight, or edit anything. I've wasted so much time re-typing everything from receipts, notes, and old documents. Here's how I quickly turn any scanned PDF into a fully editable Word file using OCR first, with a free tool that actually works well. No software install, no signup — just fast and accurate results every time.",
// //       date: "Feb 23, 2026",
// //       slug: "how-to-edit-scanned-pdf-in-word",
// //     },

// //     {
// //       title: "Convert PDF Resume to Editable Word Without Losing Layout",
// //       description:
// //         "Job portals demand Word resumes, but converting PDF versions often ruins columns, bullets, photos, and spacing — super annoying when you're applying urgently. I've messed up so many applications this way. Here's how I convert PDF resumes to clean, editable Word files that stay professional and ATS-friendly, using a free tool that preserves everything. No signup, no software — just perfect results every time.",
// //       date: "Feb 24, 2026",
// //       slug: "convert-pdf-resume-to-editable-word",
// //     },

// //     {
// //       title: "Convert Word to PDF Instantly (No Software Needed)",
// //       description:
// //         "Need to turn your Word doc into a clean, professional PDF that looks perfect everywhere? Here’s how I do it in seconds — no software, no watermarks, just a sharp PDF ready to send.",
// //       date: "Aug 26, 2025",
// //       slug: "word-to-pdf",
// //     },

// //     {
// //       title: "Convert Images (JPG, PNG) to PDF in Seconds",
// //       description:
// //         "Combine multiple images into one clear, professional PDF document. Perfect for photos, scanned documents, receipts, or portfolios. Supports JPG, PNG, and more no signup, no watermark, just fast and secure image to PDF conversion.",
// //       date: "Aug 28, 2025",
// //       slug: "image-to-pdf",
// //     },

// //     {
// //       title: "Merge Multiple PDF Files into One Online",
// //       description:
// //         "Got a bunch of separate PDFs you need to combine? Here’s how I quickly merge them into one clean file — perfect for reports, invoices, or study notes. Free, no limits, and keeps everything looking sharp.",
// //       date: "Aug 30, 2025",
// //       slug: "merge-pdf",
// //     },

// //     {
// //       title: "Split PDF Files Online (Extract Specific Pages Easily)",
// //       description:
// //         "Got a big PDF and only need a few pages? Here’s how I quickly pull out exactly what I want — perfect for reports, contracts, or study notes. Free, no signup, and keeps the quality perfect.",
// //       date: "Sep 1, 2025",
// //       slug: "split-pdf",
// //     },

// //     {
// //       title: "Compress PDF Files Without Losing Quality",
// //       description:
// //         "Got a massive PDF that won’t attach to emails or takes forever to upload? Here’s how I shrink them down super small while keeping everything looking sharp — free, fast, and no quality drop.",
// //       date: "Sep 3, 2025",
// //       slug: "compress-pdf",
// //     },


// //     {
// //       title: "Convert Excel to PDF Without Losing Formatting",
// //       description:
// //         "Need to turn your Excel spreadsheet into a clean PDF that keeps all the tables, charts, and formatting perfect? Here’s how I do it in seconds — great for reports, budgets, or sharing data securely.",
// //       date: "Sep 5, 2025",
// //       slug: "excel-pdf",
// //     },

// //     {
// //       title: "Convert PDF Pages to JPG Images Online",
// //       description:
// //         "Need images from a PDF fast? Here’s how I convert every PDF page into high-quality JPG files in seconds — perfect for sharing pages as images, presentations, or social posts.",
// //       date: "Sep 7, 2025",
// //       slug: "pdf-to-jpg",
// //     },

// //     {
// //       title: "Convert PowerPoint to PDF Without Breaking the Layout",
// //       description:
// //         "Want to share slides without worrying about fonts, spacing, or compatibility issues? Here’s how I convert PowerPoint presentations to PDF while keeping everything clean and professional.",
// //       date: "Sep 9, 2025",
// //       slug: "ppt-to-pdf",
// //     },

// //     {
// //       title: "Protect PDF with a Password Online for Free",
// //       description:
// //         "Need to lock a PDF before sending it? Here’s how I add password protection to sensitive files in seconds — perfect for contracts, reports, and personal documents.",
// //       date: "Sep 11, 2025",
// //       slug: "protect-pdf",
// //     },

// //     {
// //       title: "Unlock PDF Files Online Without Hassle",
// //       description:
// //         "Got a password-protected PDF you’re allowed to open but need easier access to? Here’s how I unlock PDF files quickly and securely so I can work with them again.",
// //       date: "Sep 13, 2025",
// //       slug: "unlock-pdf",
// //     },

// //     {
// //       title: "Rotate PDF Pages Online to Fix Wrong Orientation",
// //       description:
// //         "Ever opened a PDF and found half the pages sideways or upside down? Here’s how I rotate PDF pages online in seconds so everything reads properly again.",
// //       date: "Sep 15, 2025",
// //       slug: "rotate-pdf",
// //     },

// //     {
// //       title: "Sign PDF Online with a Digital Signature",
// //       description:
// //         "Need to sign a contract, form, or agreement fast? Here’s how I add a digital signature to PDFs online without printing, scanning, or installing anything.",
// //       date: "Sep 17, 2025",
// //       slug: "sign-pdf",
// //     },

// //     {
// //       title: "Use OCR to Extract Text from Scanned PDFs",
// //       description:
// //         "Scanned PDFs are frustrating when you can’t copy or edit anything. Here’s how I use OCR to turn scanned PDF pages into selectable, editable text in minutes.",
// //       date: "Sep 19, 2025",
// //       slug: "ocr-pdf",
// //     },

// //     {
// //       title: "Edit PDF Files Online Without Installing Software",
// //       description:
// //         "Need to fix text, add content, or update a PDF quickly? Here’s how I edit PDF files online without downloading heavy desktop software or dealing with complicated tools.",
// //       date: "Sep 21, 2025",
// //       slug: "edit-pdf",
// //     },

// //     {
// //       title: "Add Watermark to PDF Files Online",
// //       description:
// //         "Want to protect your PDF with branding or ownership text? Here’s how I add text or image watermarks to PDF files online while keeping the document clean and readable.",
// //       date: "Sep 23, 2025",
// //       slug: "add-watermark",
// //     },

// //     {
// //       title: "Best Tools for Students to Study Smarter in 2025",
// //       description:
// //         "Assignments piling up, group projects, exams, and PDFs that won't cooperate — student life is hectic. Here are the tools that actually help you work faster and smarter, tested and used in real academic workflows.",
// //       date: "Dec 11, 2025",
// //       slug: "best-tools-for-students",
// //     },

// //     {
// //       title: "How to Compress a PDF Free Online (Reduce File Size Instantly)",
// //       description:
// //         "PDF too large to email or upload? Here's how to compress any PDF in seconds — no software, no signup, no watermark. Works on mobile too, and keeps your text and images looking sharp.",
// //       date: "Mar 22, 2026",
// //       slug: "how-to-compress-a-pdf",
// //     },
// //     {
// //       title: "How to Compress a PDF Without Losing Quality",
// //       description:
// //         "Worried compression will ruin your PDF? Here's exactly what happens to images, text, and fonts during compression — and how to reduce file size without any visible quality loss.",
// //       date: "Mar 23, 2026",
// //       slug: "compress-pdf-without-losing-quality",
// //     },
// //     {
// //       title: "How to Compress a PDF on Mobile (Android & iPhone)",
// //       description:
// //         "Need to shrink a PDF from your phone before sending? Here's how to compress any PDF directly in your mobile browser — no app needed, works on both Android and iPhone.",
// //       date: "Mar 24, 2026",
// //       slug: "compress-pdf-on-mobile",
// //     },
// //     {
// //       title: "PDF Still Too Large After Compression? Here's How to Fix It",
// //       description:
// //         "Compressed your PDF but it's still too big? Here are the real reasons compression sometimes doesn't work — and exactly what to do in each case.",
// //       date: "Mar 25, 2026",
// //       slug: "pdf-still-too-large-after-compression",
// //     },
// //     {
// //       title: "Why Are PDF Files So Large? (And How to Fix It)",
// //       description:
// //         "Ever wondered why a simple PDF ends up being 50MB? Here's what actually makes PDFs large — images, scans, fonts, layers — and the fastest way to fix each one.",
// //       date: "Mar 26, 2026",
// //       slug: "why-are-pdf-files-so-large",
// //     },
// //     {
// //       title: "How Small Should I Compress My PDF? (Size Guide by Use Case)",
// //       description:
// //         "Email, WhatsApp, university portals, websites, printing — every use case needs a different PDF size. Here's the exact target size for each one so you compress just enough.",
// //       date: "Mar 27, 2026",
// //       slug: "how-small-should-i-compress-my-pdf",
// //     },

// //     {
// //       title: "How to Convert Word to PDF Free Online (No Software Needed)",
// //       description:
// //         "Need to convert a Word document to PDF quickly without installing software? Here's the fastest way to turn DOC or DOCX into a clean, professional PDF online — no signup, no watermark, and perfect formatting every time.",
// //       date: "Mar 15, 2026",
// //       slug: "how-to-convert-word-to-pdf",
// //     },
// //     {
// //       title: "How to Convert Word to PDF Without Losing Formatting",
// //       description:
// //         "Fonts changing, tables breaking, and layout shifting after conversion? Here's how to convert Word to PDF without losing formatting — including exact fixes for fonts, margins, images, and tables.",
// //       date: "Mar 16, 2026",
// //       slug: "convert-word-to-pdf-without-losing-formatting",
// //     },
// //     {
// //       title: "How to Convert Word to PDF on Mobile (Android & iPhone)",
// //       description:
// //         "Convert Word documents to PDF directly on your phone — no app needed. Here's how to do it on Android and iPhone in under a minute using your mobile browser.",
// //       date: "Mar 17, 2026",
// //       slug: "word-to-pdf-on-mobile",
// //     },
// //     {
// //       title: "Word to PDF Not Working? Here's How to Fix It",
// //       description:
// //         "Getting blank PDFs, upload errors, or broken formatting? Here's how to fix common Word to PDF conversion problems step by step — including real solutions that actually work.",
// //       date: "Mar 18, 2026",
// //       slug: "word-to-pdf-not-working-fix",
// //     },
// //     {
// //       title: "Why Does Formatting Break When Converting Word to PDF?",
// //       description:
// //         "Ever wondered why your Word document looks perfect but the PDF gets messed up? Here's the real reason formatting breaks during conversion — and how to prevent it.",
// //       date: "Mar 19, 2026",
// //       slug: "why-formatting-breaks-in-word-to-pdf",
// //     },
// //     {
// //       title: "Free vs Paid Word to PDF Tools — What's Actually Different?",
// //       description:
// //         "Do you really need to pay for Word to PDF conversion? Here's the real difference between free and paid tools — and when upgrading actually makes sense.",
// //       date: "Mar 20, 2026",
// //       slug: "free-vs-paid-word-to-pdf-tools",
// //     },
// //     {
// //       title: "Word to PDF for Students — How to Submit Assignments as PDF",
// //       description:
// //         "Submitting assignments as DOCX can break formatting or get rejected. Here's how students can convert Word to PDF properly before submission — fast, free, and reliable.",
// //       date: "Mar 21, 2026",
// //       slug: "word-to-pdf-for-students",
// //     },

// //     {
// //       title: "Best Free Image Converter Tools Online in 2025",
// //       description:
// //         "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup, no file size tricks. Here's what I use now.",
// //       date: "Apr 2, 2026",
// //       slug: "best-free-image-converter-tools",
// //     },

// //     {
// //       title: "how-to-convert-chatgpt-pdf-to-word",
// //       description:
// //         "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup, no file size tricks. Here's what I use now.",
// //       date: "Apr 2, 2026",
// //       slug: "best-free-image-converter-tools",
// //     },

// //     {
// //       title: "pdf-not-editable-fix",
// //       description:
// //         "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup, no file size tricks. Here's what I use now.",
// //       date: "Apr 2, 2026",
// //       slug: "best-free-image-converter-tools",
// //     },

// //     {
// //       title: "freelancer-edit-pdf-free",
// //       description:
// //         "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup, no file size tricks. Here's what I use now.",
// //       date: "Apr 2, 2026",
// //       slug: "best-free-image-converter-tools",
// //     },

// //     {
// //       title: "pdf-file-too-large-compress",
// //       description:
// //         "Need to convert HEIC to JPG, WebP to PNG, or resize images without installing anything? I tested 10+ free image converter tools and found one that actually works — no watermarks, no signup, no file size tricks. Here's what I use now.",
// //       date: "Apr 2, 2026",
// //       slug: "best-free-image-converter-tools",
// //     },
    

// //   ];

// //   return (
// //     <main className="max-w-6xl mx-auto py-12 px-6">
// //       <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-linear-to-r from-red-600 to-purple-600 bg-clip-text text-transparent leading-tight">
// //         PDF Tools Blog & Guides
// //       </h1>

// //       <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
// //         Hey, welcome to the blog! Here I've written simple, no-nonsense guides
// //         for all the PDF tools — how to merge PDFs, convert Word to PDF, unlock
// //         files, rotate pages, and everything else.
// //         <br />
// //         <br />
// //         Everything is <strong>free</strong>, no fluff, and I've tested it all
// //         myself in real life. Hope these help you save time and get stuff done
// //         easier.
// //       </p>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {blogs.map((blog, index) => (
// //           <div
// //             key={index}
// //             className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
// //           >
// //             <div className="p-5 flex flex-col grow">
// //               <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-red-700 transition">
// //                 {blog.title}
// //               </h2>
// //               <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 grow">
// //                 {blog.description}
// //               </p>
// //               <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

// //               <div className="mt-auto">
// //                 <Link
// //                   href={`/blog/${blog.slug}`}
// //                   className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
// //                 >
// //                   Read More →
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </main>
// //   );
// // }

