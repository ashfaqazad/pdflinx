"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, FileText, FileType, FileImage, FileSpreadsheet,
  FileMinus, FilePlus, Image as ImageIcon, ScanLine, FileEdit,
  Scissors, RotateCw, Trash2, Hash, Layers, Shield, PenSquare,
  Unlock, Code, Menu, X, Italic, List, FileOutput, Crop, ShieldAlert,
  Wrench, Presentation, FileSearch, MessageSquare,
} from "lucide-react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   useIsDesktop
───────────────────────────────────────────────────────────── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const dropdownCols = [
  {
    heading: "Organize PDF",
    items: [
      { label: "Merge PDF", href: "/merge-pdf", Icon: Layers, color: "#e8420a" },
      { label: "Split PDF", href: "/split-pdf", Icon: Scissors, color: "#e8420a" },
      { label: "Remove Pages", href: "/remove-pages", Icon: Trash2, color: "#e8420a" },
      { label: "Organize PDF", href: "/organize-pdf", Icon: List, color: "#e8420a" },
      { label: "Extract PDF", href: "/extract-pdf", Icon: FileOutput, color: "#e8420a" },
    ],

  },

  {
    heading: "Optimize PDF",
    items: [
      { label: "Compress PDF", href: "/compress-pdf", Icon: FileMinus, color: "#16a34a" },
      { label: "OCR PDF", href: "/ocr-pdf", Icon: ScanLine, color: "#16a34a" },
      { label: "Repair PDF", href: "/repair-pdf", Icon: Wrench, color: "#16a34a" },
    ],
  },
  {
    heading: "Convert to PDF",
    items: [
      { label: "Word to PDF", href: "/word-to-pdf", Icon: FileType, color: "#2563eb" },
      { label: "Excel to PDF", href: "/excel-pdf", Icon: FileSpreadsheet, color: "#16a34a" },
      { label: "PowerPoint to PDF", href: "/ppt-to-pdf", Icon: FileSpreadsheet, color: "#ea580c" },
      { label: "Image to PDF", href: "/image-to-pdf", Icon: FileImage, color: "#ea580c" },
      { label: "HTML to PDF", href: "/html-to-pdf", Icon: Code, color: "#4f46e5" },
      { label: "Text to PDF", href: "/text-to-pdf", Icon: FileText, color: "#9333ea" },
    ],
  },
  {
    heading: "Convert from PDF",
    items: [
      { label: "PDF to Word", href: "/pdf-to-word", Icon: FileText, color: "#e8420a" },
      { label: "PDF to Excel", href: "/pdf-to-excel", Icon: FileSpreadsheet, color: "#16a34a" },
      {
        label: "PDF to PowerPoint", href: "/pdf-to-powerpoint", Icon: Presentation, color: "#ea580c"
      },
      { label: "PDF to JPG", href: "/pdf-to-jpg", Icon: ImageIcon, color: "#ea580c" },
      { label: "PDF to PNG", href: "/pdf-to-png", Icon: ImageIcon, color: "#f97316" },
      { label: "PDF to Text", href: "/pdf-to-text", Icon: FileText, color: "#2563eb" },

    ],
  },
  {
    heading: "Edit PDF",
    items: [
      { label: "Rotate PDF", href: "/rotate-pdf", Icon: RotateCw, color: "#9333ea" },
      { label: "Add Page Numbers", href: "/add-page-numbers", Icon: Hash, color: "#2563eb" },
      { label: "Add Watermark", href: "/add-watermark", Icon: FilePlus, color: "#059669" },
      { label: "Edit PDF", href: "/edit-pdf", Icon: FileEdit, color: "#ea580c" },
      { label: "Crop PDF", href: "/crop-pdf", Icon: Crop, color: "#e8420a" },
    ],
  },
  {
    heading: "PDF Security",
    items: [
      { label: "Protect PDF", href: "/protect-pdf", Icon: Shield, color: "#9333ea" },
      { label: "Unlock PDF", href: "/unlock-pdf", Icon: Unlock, color: "#059669" },
      { label: "Sign PDF", href: "/sign-pdf", Icon: PenSquare, color: "#059669" },
      { label: "Redact PDF", href: "/redact-pdf", Icon: ShieldAlert, color: "#059669" },
    ],
  },

  // {
  //   heading: "AI PDF",
  //   items: [
  //     {
  //       heading: "AI PDF", items: [{ label: "AI Summarize", href: "/ai-summarize", Icon: FileSearch, color: "#e8420a" },
  //       { label: "Chat with PDF", href: "/ai-chat", Icon: MessageSquare, color: "#e8420a" },],
  //     },
  //   ],

  // },

  // ✅ CORRECT
  {
    heading: "AI PDF",
    items: [
      { label: "AI Summarize", href: "/ai-summarize", Icon: FileSearch, color: "#e8420a" },
      // { label: "AI Proofread", href: "/ai-proofread-pdf", Icon: SpellCheck, color: "#e8420a" },
      { label: "Chat with PDF", href: "/chat-with-pdf", Icon: MessageSquare, color: "#e8420a" },

    ],
  },


];

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "PDF to Word", href: "/pdf-to-word" },
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },
];

const endLinks = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─────────────────────────────────────────────────────────────
   MEGA DROPDOWN (Desktop)
───────────────────────────────────────────────────────────── */
function MegaDropdown({ open, onClose }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",           /* fixed instead of absolute — no clipping */
      top: 64,                     /* nav height */
      left: "50%",
      transform: "translateX(-50%)",
      width: 1120,
      maxWidth: "calc(100vw - 24px)",
      background: "#ffffff",
      border: "1px solid rgba(15,14,13,0.10)",
      borderRadius: 18,
      boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
      overflow: "hidden",
      zIndex: 9999,
    }}>
      <div style={{ height: 3, background: "linear-gradient(90deg,#e8420a,#fb923c)" }} />

      <div style={{ padding: "14px 24px 10px" }}>
        <Link
          href="/free-pdf-tools"
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 16px", background: "#faf9f7", border: "1px solid rgba(15,14,13,0.08)",
            borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#3a3835",
            textDecoration: "none", transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e8420a"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#faf9f7"; e.currentTarget.style.color = "#3a3835"; }}
        >
          🗂️ View All Free PDF Tools
        </Link>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(160px, 1fr))",
        padding: "6px 24px 24px",
      }}>
        {dropdownCols.map((col, ci) => (
          <div
            key={col.heading}
            style={{
              borderLeft: ci > 0 ? "1px solid rgba(15,14,13,0.07)" : "none",
              paddingLeft: ci > 0 ? 18 : 0,
              paddingRight: 10,
            }}
          >
            <p style={{
              fontSize: 12, fontWeight: 700, letterSpacing: "0.09em",
              textTransform: "uppercase", color: "#7a7772",
              margin: "6px 0 10px", whiteSpace: "nowrap",
            }}>
              {col.heading}
            </p>

            {col.items.map(({ label, href, Icon, color }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 8px", borderRadius: 8, fontSize: 14,
                  color: "#3a3835", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#faf9f7";
                  e.currentTarget.style.transform = "translateX(3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "none";
                }}
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

/* ─────────────────────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  const isDesktop = useIsDesktop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
      setMobileToolsOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => { setMobileOpen(false); setMobileToolsOpen(false); };
  const closeDropdown = () => setDropdownOpen(false);
  const onEnter = () => { clearTimeout(timeoutRef.current); setDropdownOpen(true); };
  const onLeave = () => { timeoutRef.current = setTimeout(() => setDropdownOpen(false), 160); };

  return (
    <>
      <style>{`
        @keyframes drawerSlide { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* ── NAV BAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, height: 64,
        background: "rgba(250,249,247,0.94)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(15,14,13,0.10)",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: isDesktop ? "0 1.5rem" : "0 1rem",
          height: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          /* NO overflow:hidden here — that was clipping the dropdown */
        }}>

          {/* LOGO */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
            <Image src="/pdflinx_logo.svg" alt="PDFLinx" width={30} height={30} priority />
            <span style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "1.2rem", fontWeight: 600, fontStyle: "italic", color: "#0f0e0d",
            }}>
              pdf<span style={{ color: "#e8420a" }}>linx</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "center" }}>
              {mainLinks.map(({ label, href }) => (
                <Link key={href} href={href} style={{
                  fontSize: 15, fontWeight: 500, color: "#7a7772",
                  textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#0f0e0d"}
                  onMouseLeave={e => e.currentTarget.style.color = "#7a7772"}
                >
                  {label}
                </Link>
              ))}

              {/* PDF Tools Dropdown trigger */}
              <div style={{ position: "relative" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 15, fontWeight: 500,
                    color: dropdownOpen ? "#0f0e0d" : "#7a7772",
                    background: "none", border: "none", cursor: "pointer",
                    transition: "color 0.15s",
                  }}
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
                <Link key={href} href={href} style={{
                  fontSize: 15, fontWeight: 500, color: "#7a7772",
                  textDecoration: "none", whiteSpace: "nowrap", transition: "color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#0f0e0d"}
                  onMouseLeave={e => e.currentTarget.style.color = "#7a7772"}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {isDesktop && (
              <Link
                href="/free-pdf-tools"
                style={{
                  background: "#0f0e0d", color: "#fff",
                  fontSize: 13, fontWeight: 500,
                  padding: "9px 20px", borderRadius: 100,
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e8420a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0f0e0d"; }}
              >
                Browse All Tools →
              </Link>
            )}

            {/* Hamburger */}
            {!isDesktop && (
              <button
                onClick={() => setMobileOpen(p => !p)}
                aria-label="Toggle menu"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 42, height: 42, borderRadius: 12,
                  background: mobileOpen ? "#faf9f7" : "transparent",
                  border: "1px solid rgba(15,14,13,0.12)",
                  cursor: "pointer", transition: "all .2s", flexShrink: 0,
                }}
              >
                {mobileOpen
                  ? <X size={20} color="#0f0e0d" strokeWidth={2.5} />
                  : <Menu size={20} color="#0f0e0d" strokeWidth={2.5} />
                }
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {!isDesktop && mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeAll}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(15,14,13,0.38)", zIndex: 110,
            }}
          />

          {/* Drawer */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "88vw", maxWidth: 360,
            background: "#ffffff", zIndex: 120,
            overflowY: "auto",
            boxShadow: "-16px 0 48px rgba(0,0,0,0.12)",
            animation: "drawerSlide .25s ease",
            display: "flex", flexDirection: "column",
          }}>

            {/* Drawer Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 1.25rem", height: 64, flexShrink: 0,
              borderBottom: "1px solid rgba(15,14,13,0.08)",
              position: "sticky", top: 0, background: "#fff", zIndex: 2,
            }}>
              <Link href="/" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Image src="/pdflinx_logo.svg" alt="PDFLinx" width={28} height={28} />
                <span style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "1.2rem", fontWeight: 600, fontStyle: "italic", color: "#0f0e0d",
                }}>
                  pdf<span style={{ color: "#e8420a" }}>linx</span>
                </span>
              </Link>
              <button
                onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 36, height: 36, borderRadius: 10,
                  border: "1px solid rgba(15,14,13,0.12)",
                  background: "transparent", cursor: "pointer",
                }}
              >
                <X size={18} color="#0f0e0d" />
              </button>
            </div>

            {/* Drawer Links */}
            <div style={{ padding: "0 1.25rem 5rem", flex: 1 }}>
              {mainLinks.map(({ label, href }) => (
                <Link key={href} href={href} onClick={closeAll} style={{
                  display: "flex", alignItems: "center",
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(15,14,13,0.07)",
                  fontSize: 15.5, fontWeight: 500,
                  color: "#3a3835", textDecoration: "none",
                }}>
                  {label}
                </Link>
              ))}

              {/* PDF Tools accordion */}
              <div style={{ borderBottom: "1px solid rgba(15,14,13,0.07)" }}>
                <button
                  onClick={() => setMobileToolsOpen(p => !p)}
                  style={{
                    width: "100%", padding: "13px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none",
                    fontSize: 15.5, fontWeight: 500, color: "#3a3835", cursor: "pointer",
                  }}
                >
                  PDF Tools
                  <ChevronDown size={18} style={{
                    transition: "transform 0.2s",
                    transform: mobileToolsOpen ? "rotate(180deg)" : "none",
                    color: "#7a7772",
                  }} />
                </button>

                {mobileToolsOpen && (
                  <div style={{ paddingBottom: 20 }}>
                    <Link href="/free-pdf-tools" onClick={closeAll} style={{
                      display: "flex", justifyContent: "center", gap: 6,
                      padding: "10px 14px", marginBottom: 16,
                      background: "#fff1ec", border: "1px solid rgba(232,66,10,0.2)",
                      borderRadius: 10, color: "#e8420a", fontWeight: 500,
                      fontSize: 14, textDecoration: "none",
                    }}>
                      🗂️ View All Free PDF Tools
                    </Link>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 12px" }}>
                      {dropdownCols.map(col => (
                        <div key={col.heading}>
                          <p style={{
                            fontSize: 10.5, fontWeight: 700,
                            textTransform: "uppercase", color: "#7a7772", marginBottom: 8,
                          }}>
                            {col.heading}
                          </p>
                          {col.items.map(({ label, href, Icon, color }) => (
                            <Link key={href} href={href} onClick={closeAll} style={{
                              display: "flex", alignItems: "center", gap: 7,
                              padding: "6px 0", fontSize: 13,
                              color: "#3a3835", textDecoration: "none",
                            }}>
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
                <Link key={href} href={href} onClick={closeAll} style={{
                  display: "flex", alignItems: "center",
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(15,14,13,0.07)",
                  fontSize: 15.5, fontWeight: 500,
                  color: "#3a3835", textDecoration: "none",
                }}>
                  {label}
                </Link>
              ))}

              {/* Browse All Tools CTA */}
              <div style={{ marginTop: 24 }}>
                <Link
                  href="/free-pdf-tools"
                  onClick={closeAll}
                  style={{
                    display: "flex", justifyContent: "center",
                    background: "#0f0e0d", color: "#fff",
                    fontSize: 14, fontWeight: 500,
                    padding: "13px 20px", borderRadius: 100,
                    textDecoration: "none",
                  }}
                >
                  Browse All Tools →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}




