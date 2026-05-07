"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, FileText, FileType, FileImage, FileSpreadsheet,
  FileMinus, FilePlus, Image as ImageIcon, ScanLine, FileEdit,
  Scissors, RotateCw, Trash2, Hash, Layers, Shield, PenSquare,
  Unlock, Code, Menu, X,
} from "lucide-react";
import Image from "next/image";

/* ─────────────────────────────────────
   DROPDOWN DATA
───────────────────────────────────── */
const dropdownCols = [
  {
    heading: "Organize PDF",
    items: [
      { label: "Merge PDF",    href: "/merge-pdf",    Icon: Layers,    color: "#e8420a" },
      { label: "Split PDF",    href: "/split-pdf",    Icon: Scissors,  color: "#e8420a" },
      { label: "Remove Pages", href: "/remove-pages", Icon: Trash2,    color: "#e8420a" },
    ],
  },
  {
    heading: "Optimize PDF",
    items: [
      { label: "Compress PDF", href: "/compress-pdf", Icon: FileMinus, color: "#16a34a" },
      { label: "OCR PDF",      href: "/ocr-pdf",      Icon: ScanLine,  color: "#16a34a" },
    ],
  },
  {
    heading: "Convert to PDF",
    items: [
      { label: "Word to PDF",       href: "/word-to-pdf",  Icon: FileType,        color: "#2563eb" },
      { label: "Excel to PDF",      href: "/excel-pdf",    Icon: FileSpreadsheet, color: "#16a34a" },
      { label: "PowerPoint to PDF", href: "/ppt-to-pdf",   Icon: FileSpreadsheet, color: "#ea580c" },
      { label: "Image to PDF",      href: "/image-to-pdf", Icon: FileImage,       color: "#ea580c" },
      { label: "Text to PDF",       href: "/text-to-pdf",  Icon: FileText,        color: "#9333ea" },
      { label: "HTML to PDF",       href: "/html-to-pdf",  Icon: Code,            color: "#4f46e5" },
    ],
  },
  {
    heading: "Convert from PDF",
    items: [
      { label: "PDF to Word",  href: "/pdf-to-word",  Icon: FileText,        color: "#e8420a" },
      { label: "PDF to Excel", href: "/pdf-to-excel", Icon: FileSpreadsheet, color: "#16a34a" },
      { label: "PDF to JPG",   href: "/pdf-to-jpg",   Icon: ImageIcon,       color: "#ea580c" },
      { label: "PDF to PNG",   href: "/pdf-to-png",   Icon: ImageIcon,       color: "#f97316" },
      { label: "PDF to Text",  href: "/pdf-to-text",  Icon: FileText,        color: "#2563eb" },
    ],
  },
  {
    heading: "Edit PDF",
    items: [
      { label: "Rotate PDF",       href: "/rotate-pdf",       Icon: RotateCw, color: "#9333ea" },
      { label: "Add Page Numbers", href: "/add-page-numbers", Icon: Hash,     color: "#2563eb" },
      { label: "Add Watermark",    href: "/add-watermark",    Icon: FilePlus, color: "#059669" },
      { label: "Edit PDF",         href: "/edit-pdf",         Icon: FileEdit, color: "#ea580c" },
    ],
  },
  {
    heading: "PDF Security",
    items: [
      { label: "Protect PDF", href: "/protect-pdf", Icon: Shield,    color: "#9333ea" },
      { label: "Unlock PDF",  href: "/unlock-pdf",  Icon: Unlock,    color: "#059669" },
      { label: "Sign PDF",    href: "/sign-pdf",    Icon: PenSquare, color: "#059669" },
    ],
  },
];

const mainLinks = [
  { label: "Home",         href: "/"             },
  { label: "PDF to Word",  href: "/pdf-to-word"  },
  { label: "Merge PDF",    href: "/merge-pdf"    },
  { label: "Split PDF",    href: "/split-pdf"    },
  { label: "Compress PDF", href: "/compress-pdf" },
];

const endLinks = [
  { label: "Blog",    href: "/blog"    },
  { label: "About",   href: "/about"   },
  { label: "Contact", href: "/contact" },
];

/* ─────────────────────────────────────
   MEGA DROPDOWN
───────────────────────────────────── */
function MegaDropdown({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 14px)",
      left: "50%",
      transform: "translateX(-62%)",
      width: 900,
      maxWidth: "calc(100vw - 48px)",
      background: "#ffffff",
      border: "1px solid rgba(15,14,13,0.10)",
      borderRadius: 18,
      boxShadow: "0 24px 64px rgba(0,0,0,0.11)",
      overflow: "hidden",
      zIndex: 200,
      animation: "megaFadeIn .18s ease",
    }}>
      {/* accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#e8420a,#fb923c)" }} />

      {/* all tools */}
      <div style={{ padding: "14px 20px 10px" }}>
        <Link
          href="/free-pdf-tools"
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 14px",
            background: "#faf9f7",
            border: "1px solid rgba(15,14,13,0.08)",
            borderRadius: 10,
            fontSize: 13, fontWeight: 500, color: "#3a3835",
            textDecoration: "none",
            transition: "background .18s, color .18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e8420a"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#faf9f7"; e.currentTarget.style.color = "#3a3835"; }}
        >
          🗂️ View All Free PDF Tools
        </Link>
      </div>

      {/* 6-col grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6,1fr)",
        padding: "4px 20px 22px",
      }}>
        {dropdownCols.map((col, ci) => (
          <div
            key={col.heading}
            style={{
              borderLeft: ci > 0 ? "1px solid rgba(15,14,13,0.07)" : "none",
              paddingLeft: ci > 0 ? 14 : 0,
              paddingRight: 10,
            }}
          >
            <p style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.09em", textTransform: "uppercase",
              color: "#7a7772", margin: "6px 0 8px",
            }}>
              {col.heading}
            </p>
            {col.items.map(({ label, href, Icon, color }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "6px 8px", borderRadius: 8,
                  fontSize: 13, color: "#3a3835",
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "background .15s, transform .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#faf9f7"; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
              >
                <Icon size={14} style={{ color, flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   NAVBAR
───────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [dropdownOpen,    setDropdownOpen]    = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const timeoutRef = useRef(null);

  /* close drawer on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileToolsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll     = () => { setMobileOpen(false); setMobileToolsOpen(false); };
  const closeDropdown = () => setDropdownOpen(false);
  const onEnter      = () => { clearTimeout(timeoutRef.current); setDropdownOpen(true); };
  const onLeave      = () => { timeoutRef.current = setTimeout(() => setDropdownOpen(false), 160); };

  /* shared inline styles */
  const navLinkStyle = {
    fontSize: 14, fontWeight: 400, color: "#7a7772",
    textDecoration: "none", whiteSpace: "nowrap",
    transition: "color .2s",
  };

  return (
    <>
      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes megaFadeIn {
          from { opacity:0; transform:translateX(-62%) translateY(-8px); }
          to   { opacity:1; transform:translateX(-62%) translateY(0); }
        }
        @keyframes drawerSlide {
          from { opacity:0; transform:translateX(100%); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes backdropFade {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>

      {/* ── NAV BAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: 64,
        background: "rgba(250,249,247,0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(15,14,13,0.10)",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: "0 1.5rem", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16,
        }}>

          {/* LOGO */}
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}>
            <Image src="/pdflinx_logo.svg" alt="PDFLinx" width={30} height={30} priority />
            <span style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "1.2rem", fontWeight: 400, color: "#0f0e0d",
            }}>
              PDF <span style={{ color: "#e8420a" }}>Linx</span>
            </span>
          </Link>

          {/* DESKTOP LINKS — hidden on mobile */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1.4rem",
            flex: 1, justifyContent: "center",
          }}
            className="hidden lg:flex"
          >
            {mainLinks.map(({ label, href }) => (
              <Link
                key={href} href={href}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#0f0e0d"}
                onMouseLeave={e => e.currentTarget.style.color = "#7a7772"}
              >
                {label}
              </Link>
            ))}

            {/* PDF Tools trigger */}
            <div style={{ position: "relative" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 14, fontWeight: 400,
                  color: dropdownOpen ? "#0f0e0d" : "#7a7772",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", padding: 0,
                  transition: "color .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#0f0e0d"}
                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.color = "#7a7772"; }}
              >
                PDF Tools
                <ChevronDown size={13} style={{
                  transition: "transform .2s",
                  transform: dropdownOpen ? "rotate(180deg)" : "none",
                }} />
              </button>
              <MegaDropdown open={dropdownOpen} onClose={closeDropdown} />
            </div>

            {endLinks.map(({ label, href }) => (
              <Link
                key={href} href={href}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#0f0e0d"}
                onMouseLeave={e => e.currentTarget.style.color = "#7a7772"}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Desktop CTA */}
            <Link
              href="/free-pdf-tools"
              className="hidden lg:inline-flex"
              style={{
                alignItems: "center", gap: 6,
                background: "#0f0e0d", color: "#fff",
                fontSize: 13, fontWeight: 500,
                padding: "9px 20px", borderRadius: 100,
                textDecoration: "none", whiteSpace: "nowrap",
                transition: "background .2s, transform .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#e8420a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0f0e0d"; e.currentTarget.style.transform = "none"; }}
            >
              Browse All Tools →
            </Link>

            {/* Hamburger — mobile only (lg:hidden) */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40, borderRadius: 10,
                background: mobileOpen ? "#faf9f7" : "transparent",
                border: "1px solid rgba(15,14,13,0.12)",
                cursor: "pointer",
                transition: "background .2s",
              }}
            >
              {mobileOpen ? <X size={18} color="#0f0e0d" /> : <Menu size={18} color="#0f0e0d" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BACKDROP ── */}
      {mobileOpen && (
        <div
          onClick={closeAll}
          className="lg:hidden"
          style={{
            position: "fixed", inset: 0, zIndex: 110,
            background: "rgba(15,14,13,0.35)",
            backdropFilter: "blur(2px)",
            animation: "backdropFade .2s ease",
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "min(340px,90vw)",
            background: "#ffffff",
            zIndex: 120,
            overflowY: "auto",
            boxShadow: "-16px 0 48px rgba(0,0,0,0.12)",
            animation: "drawerSlide .25s ease",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* drawer header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(15,14,13,0.08)",
            position: "sticky", top: 0,
            background: "#fff", zIndex: 2,
          }}>
            <Link href="/" onClick={closeAll} style={{ display:"flex", alignItems:"center", gap:7, textDecoration:"none" }}>
              <Image src="/pdflinx_logo.svg" alt="PDFLinx" width={26} height={26} />
              <span style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"1.1rem", color:"#0f0e0d" }}>
                PDF <span style={{ color:"#e8420a" }}>Linx</span>
              </span>
            </Link>
            <button
              onClick={closeAll}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#7a7772", padding:4 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* links */}
          <div style={{ padding: "0 1.25rem 5rem", flex: 1 }}>

            {mainLinks.map(({ label, href }) => (
              <Link
                key={href} href={href} onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(15,14,13,0.07)",
                  fontSize: 15, fontWeight: 500, color: "#3a3835",
                  textDecoration: "none",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#e8420a"}
                onMouseLeave={e => e.currentTarget.style.color = "#3a3835"}
              >
                {label}
              </Link>
            ))}

            {/* PDF Tools accordion */}
            <div style={{ borderBottom: "1px solid rgba(15,14,13,0.07)" }}>
              <button
                onClick={() => setMobileToolsOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "13px 0",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 15, fontWeight: 500, color: "#3a3835",
                  fontFamily: "inherit",
                }}
              >
                PDF Tools
                <ChevronDown size={15} style={{
                  color: "#7a7772",
                  transition: "transform .25s",
                  transform: mobileToolsOpen ? "rotate(180deg)" : "none",
                }} />
              </button>

              {mobileToolsOpen && (
                <div style={{ paddingBottom: 16 }}>
                  <Link
                    href="/free-pdf-tools" onClick={closeAll}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "9px 14px", marginBottom: 14,
                      background: "#fff1ec",
                      border: "1px solid rgba(232,66,10,0.18)",
                      borderRadius: 10,
                      fontSize: 13, fontWeight: 500, color: "#e8420a",
                      textDecoration: "none",
                    }}
                  >
                    🗂️ View All Free PDF Tools
                  </Link>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {dropdownCols.map((col) => (
                      <div key={col.heading}>
                        <p style={{
                          fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.09em", textTransform: "uppercase",
                          color: "#7a7772", marginBottom: 8,
                        }}>
                          {col.heading}
                        </p>
                        {col.items.map(({ label, href, Icon, color }) => (
                          <Link
                            key={href} href={href} onClick={closeAll}
                            style={{
                              display: "flex", alignItems: "center", gap: 7,
                              padding: "6px 0",
                              fontSize: 12, color: "#3a3835",
                              textDecoration: "none",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "#e8420a"}
                            onMouseLeave={e => e.currentTarget.style.color = "#3a3835"}
                          >
                            <Icon size={13} style={{ color, flexShrink: 0 }} />
                            {label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {endLinks.map(({ label, href }) => (
              <Link
                key={href} href={href} onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(15,14,13,0.07)",
                  fontSize: 15, fontWeight: 500, color: "#3a3835",
                  textDecoration: "none",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#e8420a"}
                onMouseLeave={e => e.currentTarget.style.color = "#3a3835"}
              >
                {label}
              </Link>
            ))}

            {/* mobile CTAs */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href="/free-pdf-tools" onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0f0e0d", color: "#fff",
                  fontSize: 14, fontWeight: 500,
                  padding: "13px 20px", borderRadius: 100,
                  textDecoration: "none",
                }}
              >
                Browse All PDF Tools →
              </Link>
              <Link
                href="/pdf-to-word" onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fff1ec", color: "#e8420a",
                  border: "1px solid rgba(232,66,10,0.2)",
                  fontSize: 14, fontWeight: 500,
                  padding: "12px 20px", borderRadius: 100,
                  textDecoration: "none",
                }}
              >
                PDF to Word — Free →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}























// "use client";

// import Link from "next/link";
// import { useState, useRef } from "react";
// import {
//   ChevronDown,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   FileMinus,
//   FilePlus,
//   Image as ImageIcon,
//   ScanLine,
//   FileEdit,
//   Scissors,
//   RotateCw,
//   Trash2,
//   Hash,
//   Layers,
//   Shield,
//   PenSquare,
//   Unlock,
//   Code,
// } from "lucide-react";
// import Image from "next/image";

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const timeoutRef = useRef(null);

//   const closeDropdown = () => setDropdownOpen(false);
//   const closeMobile = () => setMobileOpen(false);

//   return (
//     <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-18">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="/pdflinx_logo.svg"
//               alt="PDFLinx Logo"
//               width={36}
//               height={36}
//               priority={true}
//               fetchPriority="high"
//             />
//             <span className="font-semibold text-xl italic">pdflinx</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center gap-8">
//             <Link
//               href="/"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Home
//             </Link>
//             <Link
//               href="/pdf-to-word"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               PDF to Word
//             </Link>
//             <Link
//               href="/merge-pdf"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Merge PDF
//             </Link>
//             <Link
//               href="/split-pdf"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Split PDF
//             </Link>
//             <Link
//               href="/compress-pdf"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Compress PDF
//             </Link>

//             {/* PDF TOOLS Dropdown (Desktop) */}
//             <div
//               className="relative"
//               ref={dropdownRef}
//               onMouseEnter={() => {
//                 if (window.innerWidth >= 1024) {
//                   clearTimeout(timeoutRef.current);
//                   setDropdownOpen(true);
//                 }
//               }}
//               onMouseLeave={() => {
//                 if (window.innerWidth >= 1024) {
//                   timeoutRef.current = setTimeout(() => {
//                     setDropdownOpen(false);
//                   }, 180);
//                 }
//               }}
//             >
//               <button
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//                 className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
//               >
//                 PDF Tools
//                 <ChevronDown
//                   size={16}
//                   className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
//                     }`}
//                 />
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute left-1/2 top-[calc(100%+12px)] -translate-x-[75%] w-295 max-w-[calc(100vw-48px)] bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50">
//                   <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500" />

//                   <div className="px-6 py-4 bg-linear-to-b from-gray-50 to-white">
//                     <div className="mb-4">
//                       <Link
//                         href="/free-pdf-tools"
//                         onClick={closeDropdown}
//                         className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition text-sm"
//                       >
//                         🔹 All PDF Tools
//                       </Link>
//                     </div>

//                     <div className="grid grid-cols-6 gap-6">
//                       {/* ORGANIZE PDF */}
//                       <div className="min-w-41.25">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           Organize PDF
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/merge-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Layers size={18} className="text-red-500 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Merge PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/split-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Scissors size={18} className="text-red-500 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Split PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/remove-pages"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Trash2 size={18} className="text-red-500 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Remove Pages
//                             </span>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* OPTIMIZE PDF */}
//                       <div className="min-w-41.25 border-l border-gray-100 pl-5">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           Optimize PDF
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/compress-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileMinus size={18} className="text-green-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Compress PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/ocr-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <ScanLine size={18} className="text-green-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               OCR PDF
//                             </span>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* CONVERT TO PDF */}
//                       <div className="min-w-43.75 border-l border-gray-100 pl-5">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           Convert to PDF
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/word-to-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileType size={18} className="text-blue-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               WORD to PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/excel-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileSpreadsheet
//                               size={18}
//                               className="text-green-600 shrink-0"
//                             />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               EXCEL to PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/ppt-to-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileSpreadsheet
//                               size={18}
//                               className="text-orange-500 shrink-0"
//                             />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               POWERPOINT to PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/image-to-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileImage size={18} className="text-orange-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Image to PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/text-to-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileText size={18} className="text-purple-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Text to PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/html-to-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Code size={18} className="text-indigo-600 shrink-0" />

//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               HTML to PDF
//                             </span>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* CONVERT FROM PDF */}
//                       <div className="min-w-42.5 border-l border-gray-100 pl-5">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           Convert from PDF
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/pdf-to-word"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileText size={18} className="text-red-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               PDF to WORD
//                             </span>
//                           </Link>

//                           <Link
//                             href="/pdf-to-excel"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileSpreadsheet
//                               size={18}
//                               className="text-green-600 shrink-0"
//                             />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               PDF to EXCEL
//                             </span>
//                           </Link>

//                           <Link
//                             href="/pdf-to-jpg"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <ImageIcon size={18} className="text-orange-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               PDF to JPG
//                             </span>
//                           </Link>

//                           <Link
//                             href="/pdf-to-png"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             {/* <Image size={18} className="text-orange-600 shrink-0" /> */}
//                             <ImageIcon size={18} className="text-orange-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               PDF to PNG
//                             </span>
//                           </Link>

//                           <Link
//                             href="/pdf-to-text"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileText size={18} className="text-blue-600 shrink-0" />

//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               PDF to Text
//                             </span>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* EDIT PDF */}
//                       <div className="min-w-43.75 border-l border-gray-100 pl-5">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           Edit PDF
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/rotate-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <RotateCw size={18} className="text-purple-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Rotate PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/add-page-numbers"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Hash size={18} className="text-blue-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Add Page Numbers
//                             </span>
//                           </Link>

//                           <Link
//                             href="/add-watermark"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FilePlus size={18} className="text-emerald-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Add Watermark
//                             </span>
//                           </Link>

//                           <Link
//                             href="/edit-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <FileEdit size={18} className="text-orange-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Edit PDF
//                             </span>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* PDF SECURITY */}
//                       <div className="min-w-41.25 border-l border-gray-100 pl-5">
//                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
//                           PDF Security
//                         </h3>
//                         <div className="space-y-1">
//                           <Link
//                             href="/protect-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Shield size={18} className="text-purple-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Protect PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/unlock-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <Unlock size={18} className="text-emerald-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Unlock PDF
//                             </span>
//                           </Link>

//                           <Link
//                             href="/sign-pdf"
//                             onClick={closeDropdown}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
//                           >
//                             <PenSquare size={18} className="text-emerald-600 shrink-0" />
//                             <span className="font-medium text-gray-700 whitespace-nowrap">
//                               Sign PDF
//                             </span>
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Link
//               href="/blog"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Blog
//             </Link>
//             <Link
//               href="/about"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               About
//             </Link>
//             <Link
//               href="/contact"
//               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
//             >
//               Contact
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
//             aria-label="Toggle mobile menu"
//           >
//             {mobileOpen ? "×" : "☰"}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="lg:hidden fixed top-18.25 left-0 right-0 bottom-0 bg-white border-t border-gray-100 z-40 overflow-y-auto">
//           <div className="px-6 py-6 space-y-4 pb-24">
//             <Link
//               href="/"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Home
//             </Link>
//             <Link
//               href="/pdf-to-word"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               PDF to Word
//             </Link>
//             <Link
//               href="/merge-pdf"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Merge PDF
//             </Link>
//             <Link
//               href="/split-pdf"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Split PDF
//             </Link>
//             <Link
//               href="/compress-pdf"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Compress PDF
//             </Link>

//             <details className="group">
//               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
//                 PDF Tools
//                 <ChevronDown className="group-open:rotate-180 transition" />
//               </summary>

//               <Link
//                 href="/free-pdf-tools"
//                 onClick={closeMobile}
//                 className="block font-semibold text-indigo-600 py-2 border-b border-gray-100"
//               >
//                 🔹 All PDF Tools
//               </Link>

//               <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   {/* Organize PDF */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       Organize PDF
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/merge-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Layers size={16} className="text-red-500 shrink-0" />
//                         Merge PDF
//                       </Link>

//                       <Link
//                         href="/split-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Scissors size={16} className="text-red-500 shrink-0" />
//                         Split PDF
//                       </Link>

//                       <Link
//                         href="/remove-pages"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Trash2 size={16} className="text-red-500 shrink-0" />
//                         Remove Pages
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Optimize PDF */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       Optimize PDF
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/compress-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileMinus size={16} className="text-green-600 shrink-0" />
//                         Compress PDF
//                       </Link>

//                       <Link
//                         href="/ocr-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <ScanLine size={16} className="text-green-600 shrink-0" />
//                         OCR PDF
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Convert TO PDF */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       Convert TO PDF
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/word-to-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileType size={16} className="text-blue-600 shrink-0" />
//                         Word to PDF
//                       </Link>

//                       <Link
//                         href="/excel-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileSpreadsheet size={16} className="text-green-600 shrink-0" />
//                         Excel to PDF
//                       </Link>

//                       <Link
//                         href="/ppt-to-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileSpreadsheet size={16} className="text-orange-500 shrink-0" />
//                         PowerPoint to PDF
//                       </Link>

//                       <Link
//                         href="/image-to-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileImage size={16} className="text-orange-600 shrink-0" />
//                         Image to PDF
//                       </Link>

//                       <Link
//                         href="/text-to-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileText size={16} className="text-purple-600 shrink-0" />
//                         Text to PDF
//                       </Link>

//                       <Link
//                         href="/html-to-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Code size={16} className="text-indigo-600 shrink-0" />
//                         HTML to PDF
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Convert FROM PDF */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       Convert FROM PDF
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/pdf-to-word"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileText size={16} className="text-red-600 shrink-0" />
//                         PDF to Word
//                       </Link>

//                       <Link
//                         href="/pdf-to-excel"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileSpreadsheet size={16} className="text-green-600 shrink-0" />
//                         PDF to Excel
//                       </Link>

//                       <Link
//                         href="/pdf-to-jpg"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <ImageIcon size={16} className="text-orange-600 shrink-0" />
//                         PDF to JPG
//                       </Link>

//                       <Link
//                         href="/pdf-to-png"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <ImageIcon size={16} className="text-orange-600 shrink-0" />
//                         PDF to PNG
//                       </Link>
//                       <Link
//                         href="/pdf-to-text"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileText size={16} className="text-blue-600 shrink-0" />
//                         PDF to Text
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Edit PDF */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       Edit PDF
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/rotate-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <RotateCw size={16} className="text-purple-600 shrink-0" />
//                         Rotate PDF
//                       </Link>

//                       <Link
//                         href="/add-page-numbers"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Hash size={16} className="text-blue-600 shrink-0" />
//                         Add Page Numbers
//                       </Link>

//                       <Link
//                         href="/add-watermark"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FilePlus size={16} className="text-emerald-600 shrink-0" />
//                         Add Watermark
//                       </Link>

//                       <Link
//                         href="/edit-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <FileEdit size={16} className="text-orange-600 shrink-0" />
//                         Edit PDF
//                       </Link>
//                     </div>
//                   </div>

//                   {/* PDF Security */}
//                   <div>
//                     <h3 className="font-bold text-sm text-gray-800 mb-2">
//                       PDF Security
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                       <Link
//                         href="/protect-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Shield size={16} className="text-purple-600 shrink-0" />
//                         Protect PDF
//                       </Link>

//                       <Link
//                         href="/unlock-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <Unlock size={16} className="text-emerald-600 shrink-0" />
//                         Unlock PDF
//                       </Link>

//                       <Link
//                         href="/sign-pdf"
//                         onClick={closeMobile}
//                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
//                       >
//                         <PenSquare size={16} className="text-emerald-600 shrink-0" />
//                         Sign PDF
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </details>

//             <Link
//               href="/blog"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Blog
//             </Link>
//             <Link
//               href="/about"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               About
//             </Link>
//             <Link
//               href="/contact"
//               onClick={closeMobile}
//               className="block font-semibold text-gray-800 py-2"
//             >
//               Contact
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }





























// // "use client";

// // import Link from "next/link";
// // import { useState, useRef } from "react";
// // import {
// //   ChevronDown,
// //   FileText,
// //   FileType,
// //   FileImage,
// //   FileSpreadsheet,
// //   FileMinus,
// //   FilePlus,
// //   Image as ImageIcon,
// //   ScanLine,
// //   FileEdit,
// //   Scissors,
// //   RotateCw,
// //   Trash2,
// //   Hash,
// //   Layers,
// //   Shield,
// //   PenSquare,
// //   Unlock,
// // } from "lucide-react";
// // import Image from "next/image";

// // export default function Navbar() {
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const dropdownRef = useRef(null);
// //   const timeoutRef = useRef(null);


// //   const closeDropdown = () => setDropdownOpen(false);
// //   const closeMobile = () => setMobileOpen(false);

// //   return (
// //     <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-6">
// //         <div className="flex justify-between items-center h-18">
// //           {/* Logo */}
// //           <Link href="/" className="flex items-center gap-2">
// //             <Image
// //               src="/pdflinx_logo.svg"
// //               alt="PDFLinx Logo"
// //               width={36}
// //               height={36}
// //               priority={true}
// //               fetchPriority="high"
// //             />
// //             <span className="font-semibold text-xl italic">pdflinx</span>
// //           </Link>

// //           {/* Desktop Menu */}
// //           <div className="hidden lg:flex items-center gap-8">
// //             <Link
// //               href="/"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Home
// //             </Link>
// //             <Link
// //               href="/pdf-to-word"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               PDF to Word
// //             </Link>
// //             <Link
// //               href="/merge-pdf"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Merge PDF
// //             </Link>
// //             <Link
// //               href="/split-pdf"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Split PDF
// //             </Link>
// //             <Link
// //               href="/compress-pdf"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Compress PDF
// //             </Link>

// //             {/* PDF TOOLS Dropdown (Desktop) */}
// //             {/* <div className="relative" ref={dropdownRef}>
// //               <button
// //                 onClick={() => setDropdownOpen(!dropdownOpen)}
// //                 className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
// //               >
// //                 PDF Tools
// //                 <ChevronDown
// //                   size={16}
// //                   className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               </button> */}

// //             <div
// //               className="relative"
// //               ref={dropdownRef}
// //               onMouseEnter={() => {
// //                 if (window.innerWidth >= 1024) {
// //                   clearTimeout(timeoutRef.current);
// //                   setDropdownOpen(true);
// //                 }
// //               }}
// //               onMouseLeave={() => {
// //                 if (window.innerWidth >= 1024) {
// //                   timeoutRef.current = setTimeout(() => {
// //                     setDropdownOpen(false);
// //                   }, 150); // 👈 delay (important)
// //                 }
// //               }}
// //             >
// //               <button
// //                 onClick={() => setDropdownOpen(!dropdownOpen)}
// //                 className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
// //               >
// //                 PDF Tools
// //                 <ChevronDown
// //                   size={16}
// //                   className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               </button>

// //               {dropdownOpen && (
// //                 <div className="absolute top-full left-1/2 -translate-x-[68%] w-[1220px] bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50">
// //                   <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500" />

// //                   <div className="px-6 py-4 bg-linear-to-b from-gray-50 to-white">
// //                     <div className="mb-4">


// //                       <Link
// //                         href="/free-pdf-tools"
// //                         onClick={closeDropdown}
// //                         className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition text-sm"
// //                       >
// //                         🔹 All PDF Tools
// //                       </Link>
// //                     </div>

// //                     <div className="grid grid-cols-6 gap-6">
// //                       {/* ORGANIZE PDF */}
// //                       <div className="min-w-41.25">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           Organize PDF
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/merge-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Layers size={18} className="text-red-500 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Merge PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/split-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Scissors size={18} className="text-red-500 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Split PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/remove-pages"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Trash2 size={18} className="text-red-500 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Remove Pages
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>

// //                       {/* OPTIMIZE PDF */}
// //                       <div className="min-w-41.25 border-l border-gray-100 pl-5">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           Optimize PDF
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/compress-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileMinus size={18} className="text-green-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Compress PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/ocr-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <ScanLine size={18} className="text-green-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               OCR PDF
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>

// //                       {/* CONVERT TO PDF */}
// //                       <div className="min-w-43.75 border-l border-gray-100 pl-5">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           Convert to PDF
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/word-to-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileType size={18} className="text-blue-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               WORD to PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/excel-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileSpreadsheet
// //                               size={18}
// //                               className="text-green-600 shrink-0"
// //                             />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               EXCEL to PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/ppt-to-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileSpreadsheet
// //                               size={18}
// //                               className="text-orange-500 shrink-0"
// //                             />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               POWERPOINT to PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/image-to-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileImage size={18} className="text-orange-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               JPG to PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/text-to-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileText size={18} className="text-purple-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Text to PDF
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>

// //                       {/* CONVERT FROM PDF */}
// //                       <div className="min-w-42.5 border-l border-gray-100 pl-5">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           Convert from PDF
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/pdf-to-word"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileText size={18} className="text-red-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               PDF to WORD
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/pdf-to-jpg"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <ImageIcon size={18} className="text-orange-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               PDF to JPG
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/pdf-to-excel"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileSpreadsheet
// //                               size={18}
// //                               className="text-green-600 shrink-0"
// //                             />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               PDF to EXCEL
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>

// //                       {/* EDIT PDF */}
// //                       <div className="min-w-43.75 border-l border-gray-100 pl-5">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           Edit PDF
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/rotate-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <RotateCw size={18} className="text-purple-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Rotate PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/add-page-numbers"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Hash size={18} className="text-blue-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Add Page Numbers
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/add-watermark"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FilePlus size={18} className="text-emerald-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Add Watermark
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/edit-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <FileEdit size={18} className="text-orange-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Edit PDF
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>

// //                       {/* PDF SECURITY */}
// //                       <div className="min-w-41.25 border-l border-gray-100 pl-5">
// //                         <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
// //                           PDF Security
// //                         </h3>
// //                         <div className="space-y-1">
// //                           <Link
// //                             href="/protect-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Shield size={18} className="text-purple-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Protect PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/unlock-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <Unlock size={18} className="text-emerald-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Unlock PDF
// //                             </span>
// //                           </Link>

// //                           <Link
// //                             href="/sign-pdf"
// //                             onClick={closeDropdown}
// //                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1 whitespace-nowrap"
// //                           >
// //                             <PenSquare size={18} className="text-emerald-600 shrink-0" />
// //                             <span className="font-medium text-gray-700 whitespace-nowrap">
// //                               Sign PDF
// //                             </span>
// //                           </Link>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <Link
// //               href="/blog"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Blog
// //             </Link>
// //             <Link
// //               href="/about"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               About
// //             </Link>
// //             <Link
// //               href="/contact"
// //               className="text-gray-700 hover:text-indigo-600 font-semibold transition"
// //             >
// //               Contact
// //             </Link>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             onClick={() => setMobileOpen(!mobileOpen)}
// //             className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
// //             aria-label="Toggle mobile menu"
// //           >
// //             {mobileOpen ? "×" : "☰"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {/* {mobileOpen && (
// //         <div className="lg:hidden bg-white border-t border-gray-100"> */}
// //       {mobileOpen && (
// //         <div className="lg:hidden fixed top-18.25 left-0 right-0 bottom-0 bg-white border-t border-gray-100 z-40 overflow-y-auto">
// //           <div className="px-6 py-6 space-y-4">
// //             <Link
// //               href="/"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Home
// //             </Link>
// //             <Link
// //               href="/pdf-to-word"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               PDF to Word
// //             </Link>
// //             <Link
// //               href="/merge-pdf"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Merge PDF
// //             </Link>
// //             <Link
// //               href="/split-pdf"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Split PDF
// //             </Link>
// //             <Link
// //               href="/compress-pdf"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Compress PDF
// //             </Link>

// //             <details className="group">
// //               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
// //                 PDF Tools
// //                 <ChevronDown className="group-open:rotate-180 transition" />
// //               </summary>

// //               <Link
// //                 href="/free-pdf-tools"
// //                 onClick={closeMobile}
// //                 className="block font-semibold text-indigo-600 py-2 border-b border-gray-100"
// //               >
// //                 🔹 All PDF Tools
// //               </Link>

// //               <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
// //                   {/* Organize PDF */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       Organize PDF
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/merge-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Layers size={16} className="text-red-500 shrink-0" />
// //                         Merge PDF
// //                       </Link>

// //                       <Link
// //                         href="/split-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Scissors size={16} className="text-red-500 shrink-0" />
// //                         Split PDF
// //                       </Link>

// //                       <Link
// //                         href="/remove-pages"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Trash2 size={16} className="text-red-500 shrink-0" />
// //                         Remove Pages
// //                       </Link>
// //                     </div>
// //                   </div>

// //                   {/* Optimize PDF */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       Optimize PDF
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/compress-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileMinus size={16} className="text-green-600 shrink-0" />
// //                         Compress PDF
// //                       </Link>

// //                       <Link
// //                         href="/ocr-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <ScanLine size={16} className="text-green-600 shrink-0" />
// //                         OCR PDF
// //                       </Link>
// //                     </div>
// //                   </div>

// //                   {/* Convert TO PDF */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       Convert TO PDF
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/word-to-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileType size={16} className="text-blue-600 shrink-0" />
// //                         Word to PDF
// //                       </Link>

// //                       <Link
// //                         href="/excel-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileSpreadsheet size={16} className="text-green-600 shrink-0" />
// //                         Excel to PDF
// //                       </Link>

// //                       <Link
// //                         href="/ppt-to-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileSpreadsheet size={16} className="text-orange-500 shrink-0" />
// //                         PowerPoint to PDF
// //                       </Link>

// //                       <Link
// //                         href="/image-to-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileImage size={16} className="text-orange-600 shrink-0" />
// //                         JPG to PDF
// //                       </Link>

// //                       <Link
// //                         href="/text-to-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileText size={16} className="text-purple-600 shrink-0" />
// //                         Text to PDF
// //                       </Link>
// //                     </div>
// //                   </div>

// //                   {/* Convert FROM PDF */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       Convert FROM PDF
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/pdf-to-word"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileText size={16} className="text-red-600 shrink-0" />
// //                         PDF to Word
// //                       </Link>

// //                       <Link
// //                         href="/pdf-to-jpg"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <ImageIcon size={16} className="text-orange-600 shrink-0" />
// //                         PDF to JPG
// //                       </Link>

// //                       <Link
// //                         href="/pdf-to-excel"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileSpreadsheet size={16} className="text-green-600 shrink-0" />
// //                         PDF to Excel
// //                       </Link>
// //                     </div>
// //                   </div>

// //                   {/* Edit PDF */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       Edit PDF
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/rotate-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <RotateCw size={16} className="text-purple-600 shrink-0" />
// //                         Rotate PDF
// //                       </Link>

// //                       <Link
// //                         href="/add-page-numbers"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Hash size={16} className="text-blue-600 shrink-0" />
// //                         Add Page Numbers
// //                       </Link>

// //                       <Link
// //                         href="/add-watermark"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FilePlus size={16} className="text-emerald-600 shrink-0" />
// //                         Add Watermark
// //                       </Link>

// //                       <Link
// //                         href="/edit-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <FileEdit size={16} className="text-orange-600 shrink-0" />
// //                         Edit PDF
// //                       </Link>
// //                     </div>
// //                   </div>

// //                   {/* PDF Security */}
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">
// //                       PDF Security
// //                     </h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link
// //                         href="/protect-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Shield size={16} className="text-purple-600 shrink-0" />
// //                         Protect PDF
// //                       </Link>

// //                       <Link
// //                         href="/unlock-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <Unlock size={16} className="text-emerald-600 shrink-0" />
// //                         Unlock PDF
// //                       </Link>

// //                       <Link
// //                         href="/sign-pdf"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1 whitespace-nowrap"
// //                       >
// //                         <PenSquare size={16} className="text-emerald-600 shrink-0" />
// //                         Sign PDF
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </details>

// //             <Link
// //               href="/blog"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Blog
// //             </Link>
// //             <Link
// //               href="/about"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               About
// //             </Link>
// //             <Link
// //               href="/contact"
// //               onClick={closeMobile}
// //               className="block font-semibold text-gray-800 py-2"
// //             >
// //               Contact
// //             </Link>
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // }





















// // "use client";

// // import Link from "next/link";
// // import { useState, useRef } from "react";
// // import {
// //   ChevronDown,
// //   FileText,
// //   FileType,
// //   FileImage,
// //   FileSpreadsheet,
// //   FileMinus,
// //   FilePlus,
// //   Image as ImageIcon,
// //   ScanLine,
// //   FileEdit,
// // } from "lucide-react";
// // import Image from "next/image";

// // export default function Navbar() {
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const dropdownRef = useRef(null);

// //   const closeDropdown = () => setDropdownOpen(false);
// //   const closeMobile = () => setMobileOpen(false);

// //   return (
// //     <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-6">
// //         <div className="flex justify-between items-center h-18">
// //           {/* Logo */}
// //           <Link href="/" className="flex items-center gap-2">
// //             <Image
// //               src="/pdflinx_logo.svg"
// //               alt="PDFLinx Logo"
// //               width={36}
// //               height={36}
// //               priority={true}
// //               fetchPriority="high"
// //             />
// //             <span className="font-semibold text-xl italic">pdflinx</span>
// //           </Link>

// //           {/* Desktop Menu */}
// //           <div className="hidden lg:flex items-center gap-8">
// //             <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Home</Link>
// //             <Link href="/pdf-to-word" className="text-gray-700 hover:text-indigo-600 font-semibold transition">PDF to Word</Link>
// //             <Link href="/merge-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Merge PDF</Link>
// //             <Link href="/split-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Split PDF</Link>
// //             <Link href="/compress-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Compress PDF</Link>

// //             {/* PDF TOOLS Dropdown (Desktop) */}
// //             <div className="relative" ref={dropdownRef}>
// //               <button
// //                 onClick={() => setDropdownOpen(!dropdownOpen)}
// //                 className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
// //               >
// //                 PDF Tools
// //                 <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
// //               </button>

// //               {dropdownOpen && (
// //                 <div className="absolute top-14 right-[-250px] w-[820px] bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50">
// //                   <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500" />
// //                   <div className="grid grid-cols-4 gap-5 px-5 py-4 bg-linear-to-b from-gray-50 to-white">

// //                     {/* Hub link */}
// //                     <div className="col-span-4">
// //                       <Link href="/free-pdf-tools" onClick={closeDropdown} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition text-sm">
// //                         🔹 All PDF Tools
// //                       </Link>
// //                     </div>

// //                     {/* Convert TO PDF */}
// //                     <div>
// //                       <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Convert to PDF</h3>
// //                       <div className="space-y-1">
// //                         <Link href="/word-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileType size={20} className="text-blue-600" />
// //                           <span className="font-medium text-gray-700">WORD to PDF</span>
// //                         </Link>
// //                         <Link href="/excel-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileSpreadsheet size={20} className="text-green-600" />
// //                           <span className="font-medium text-gray-700">EXCEL to PDF</span>
// //                         </Link>
// //                         <Link href="/ppt-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileSpreadsheet size={20} className="text-green-600 flex-shrink-0" />
// //                           <span className="font-medium text-gray-700 whitespace-nowrap">POWERPOINT to PDF</span>
// //                         </Link>
// //                         <Link href="/image-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileImage size={20} className="text-orange-600" />
// //                           <span className="font-medium text-gray-700">JPG to PDF</span>
// //                         </Link>
// //                       </div>
// //                     </div>

// //                     {/* Convert FROM PDF */}
// //                     <div className="border-l border-gray-100 pl-6">
// //                       <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Convert from PDF</h3>
// //                       <div className="space-y-1">
// //                         <Link href="/pdf-to-word" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileText size={20} className="text-red-600" />
// //                           <span className="font-medium text-gray-700">PDF to WORD</span>
// //                         </Link>

// //                         <Link href="/pdf-to-jpg" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           {/* <ImageIcon size={20} className="text-orange-600" /> */}
// //                           <FileSpreadsheet size={20} strokeWidth={2.5} className="text-green-600" />
// //                           <span className="font-medium text-gray-700">PDF to JPG</span>
// //                         </Link>

// //                         {/* <Link href="/pdf-to-excel" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <ImageIcon size={20} className="text-orange-600" />
// //                           <span className="font-medium text-gray-700">PDF to Excel</span>
// //                         </Link> */}

// //                         <Link
// //                           href="/pdf-to-excel"
// //                           onClick={closeDropdown}
// //                           className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1"
// //                         >
// //                           <FileSpreadsheet size={20} strokeWidth={2.5} className="text-green-600" />
// //                           <span className="font-medium text-gray-700">PDF to Excel</span>
// //                         </Link>
// //                       </div>
// //                     </div>

// //                     {/* PDF Security */}
// //                     <div className="border-l border-gray-100 pl-6">
// //                       <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">PDF security</h3>
// //                       <div className="space-y-1">
// //                         <Link href="/protect-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileMinus size={20} className="text-purple-600" />
// //                           <span className="font-medium text-gray-700">Protect PDF</span>
// //                         </Link>
// //                         <Link href="/unlock-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FilePlus size={20} className="text-emerald-600" />
// //                           <span className="font-medium text-gray-700">Unlock PDF</span>
// //                         </Link>
// //                         <Link href="/sign-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FilePlus size={20} className="text-emerald-600" />
// //                           <span className="font-medium text-gray-700">Sign PDF</span>
// //                         </Link>
// //                       </div>
// //                     </div>

// //                     {/* Edit PDF */}
// //                     <div className="border-l border-gray-100 pl-6">
// //                       <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Edit PDF</h3>
// //                       <div className="space-y-1">
// //                         <Link href="/rotate-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileMinus size={20} className="text-purple-600" />
// //                           <span className="font-medium text-gray-700">Rotate PDF</span>
// //                         </Link>
// //                         <Link href="/ocr-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <ScanLine size={20} className="text-blue-600" />
// //                           <span className="font-medium text-gray-700">OCR PDF</span>
// //                         </Link>
// //                         <Link href="/edit-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FileEdit size={20} className="text-orange-600" />
// //                           <span className="font-medium text-gray-700">Edit PDF</span>
// //                         </Link>
// //                         <Link href="/add-watermark" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           <FilePlus size={20} className="text-emerald-600" />
// //                           <span className="font-medium text-gray-700 whitespace-nowrap">Add Watermark</span>
// //                         </Link>

// //                         <Link href="/text-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
// //                           {/* <FilePlus size={20} className="text-emerald-600" /> */}
// //                           <FileText size={16} className="text-purple-600" />
// //                           <span className="font-medium text-gray-700 whitespace-nowrap">Text to PDF</span>
// //                         </Link>
// //                       </div>
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blog</Link>
// //             <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">About</Link>
// //             <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Contact</Link>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             onClick={() => setMobileOpen(!mobileOpen)}
// //             className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
// //             aria-label="Toggle mobile menu"
// //           >
// //             {mobileOpen ? "×" : "☰"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {mobileOpen && (
// //         <div className="lg:hidden bg-white border-t border-gray-100">
// //           <div className="px-6 py-6 space-y-4">
// //             <Link href="/" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Home</Link>
// //             <Link href="/pdf-to-word" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">PDF to Word</Link>
// //             <Link href="/merge-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Merge PDF</Link>
// //             <Link href="/split-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Split PDF</Link>
// //             <Link href="/compress-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Compress PDF</Link>

// //             {/* PDF Tools Mobile */}
// //             <details className="group">
// //               <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
// //                 PDF Tools
// //                 <ChevronDown className="group-open:rotate-180 transition" />
// //               </summary>

// //               <Link href="/free-pdf-tools" onClick={closeMobile} className="block font-semibold text-indigo-600 py-2 border-b border-gray-100">
// //                 🔹 All PDF Tools
// //               </Link>

// //               <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">Convert TO PDF</h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link href="/word-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileType size={16} className="text-blue-600" />Word to PDF</Link>
// //                       <Link href="/excel-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileSpreadsheet size={16} className="text-green-600" />Excel to PDF</Link>
// //                       <Link href="/ppt-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileSpreadsheet size={16} className="text-green-600" />PowerPoint to PDF</Link>
// //                       <Link href="/image-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileImage size={16} className="text-orange-600" />JPG to PDF</Link>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">Convert FROM PDF</h3>

// //                     <div className="space-y-2 text-sm">
// //                       <Link href="/pdf-to-word" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileText size={16} className="text-red-600" />PDF to Word</Link>
// //                       <Link href="/pdf-to-jpg" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><ImageIcon size={16} className="text-orange-600" />PDF to JPG</Link>
// //                       <Link
// //                         href="/pdf-to-excel"
// //                         onClick={closeMobile}
// //                         className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
// //                       >
// //                         <FileSpreadsheet size={16} className="text-green-600" />
// //                         PDF to Excel
// //                       </Link>
// //                     </div>

// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">PDF SECURITY</h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link href="/protect-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileMinus size={16} className="text-purple-600" />Protect PDF</Link>
// //                       <Link href="/unlock-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Unlock PDF</Link>
// //                       <Link href="/sign-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Sign PDF</Link>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-sm text-gray-800 mb-2">Edit PDF</h3>
// //                     <div className="space-y-2 text-sm">
// //                       <Link href="/rotate-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileMinus size={16} className="text-purple-600" />Rotate PDF</Link>
// //                       <Link href="/ocr-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><ScanLine size={16} className="text-blue-600" />OCR PDF</Link>
// //                       <Link href="/edit-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileEdit size={16} className="text-orange-600" />Edit PDF</Link>
// //                       <Link href="/add-watermark" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Add Watermark</Link>
// //                       <Link href="/text-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileText size={16} className="text-purple-600" />Text to PDF</Link>

// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </details>

// //             <Link href="/blog" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Blog</Link>
// //             <Link href="/about" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">About</Link>
// //             <Link href="/contact" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Contact</Link>
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // }

