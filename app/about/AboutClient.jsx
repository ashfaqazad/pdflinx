"use client";

import { ShieldCheck, Zap, Globe } from "lucide-react";
import Script from "next/script";
import Link from "next/link";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PDF Linx — No-BS, Privacy-First Tools",
    description:
      "PDF Linx was born from frustration with clunky PDF tools. 22+ free tools, no signups, no subscriptions. Built solo, loved by thousands across Pakistan, India, Bangladesh & beyond.",
    url: "https://pdflinx.com/about",
    publisher: {
      "@type": "Organization",
      name: "PDF Linx",
      url: "https://pdflinx.com",
      logo: "https://pdflinx.com/logo.png",
      foundingDate: "2023",
    },
  };

  return (
    <>
      <Script
        id="aboutpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .about-page {
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
          color: #111111;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in  { opacity: 0; animation: fadeUp .6s ease forwards; }
        .delay-1  { animation-delay: .1s; }
        .delay-2  { animation-delay: .2s; }
        .delay-3  { animation-delay: .3s; }
        .delay-4  { animation-delay: .4s; }
        .delay-5  { animation-delay: .5s; }

        @keyframes tlFade {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .tl-item {
          opacity: 0;
          animation: tlFade .5s ease forwards;
          position: relative;
          padding: 0 0 1.8rem 1.8rem;
        }
        .tl-item:nth-child(1) { animation-delay: .15s; }
        .tl-item:nth-child(2) { animation-delay: .28s; }
        .tl-item:nth-child(3) { animation-delay: .41s; }
        .tl-item:nth-child(4) { animation-delay: .54s; }
        .tl-item::before {
          content: '';
          position: absolute;
          left: -5px; top: 5px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #E8380D;
          border: 2px solid #F7F5F2;
          box-shadow: 0 0 0 2px #E8380D;
        }

        /* ── EYEBROW ── */
        .eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #E8380D; margin-bottom: .5rem;
        }
        .eyebrow::before {
          content: ''; display: inline-block;
          width: 18px; height: 2px;
          background: #E8380D; border-radius: 2px;
        }

        /* ── HERO ── */
        .about-hero {
          max-width: 1100px; margin: 0 auto;
          padding: 5rem 2rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center;
        }

        /* ── BACKSTORY GRID ── */
        .backstory-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        /* ── VALUES GRID ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* ── GLOBAL BAND INNER ── */
        .global-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center; gap: 2rem;
        }
        .global-stat {
          text-align: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 2rem 2.5rem;
          flex-shrink: 0;
        }

        /* ── TIMELINE + SOLO GRID ── */
        .journey-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: start;
        }

        /* ── TIMELINE ── */
        .timeline-wrap {
          position: relative;
          padding-left: 1.8rem;
        }
        .timeline-wrap::before {
          content: '';
          position: absolute;
          left: 0; top: 8px; bottom: 8px;
          width: 2px;
          background: linear-gradient(to bottom, #E8380D, rgba(232,56,13,.1));
          border-radius: 2px;
        }
        .tl-date {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .06em;
          color: #E8380D; margin-bottom: 3px;
        }
        .tl-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.05rem; color: #111; margin-bottom: 3px;
        }
        .tl-body { font-size: 13.5px; color: #3D3D3D; line-height: 1.7; }
        .tl-badge {
          display: inline-block; margin-top: 6px;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 100px;
          background: #FEF0ED; color: #E8380D;
        }

        /* ── STORY CARDS ── */
        .story-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 16px; padding: 2rem;
          position: relative; overflow: hidden;
          transition: box-shadow .25s, transform .25s;
        }
        .story-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,.08); transform: translateY(-3px); }
        .story-card::after {
          content: ''; position: absolute;
          top: 0; left: 0; width: 4px; height: 100%;
          background: #E8380D; border-radius: 4px 0 0 4px;
        }
        .story-card-amber::after { background: #D97706; }
        .story-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          color: #E8380D; margin-bottom: .75rem;
        }
        .story-card-amber .story-label { color: #D97706; }

        /* ── INSIGHT / CORE BELIEF ── */
        .insight-box {
          background: #F7F5F2; border-left: 3px solid #D97706;
          border-radius: 8px; padding: 12px 16px;
          margin: 1rem 0; font-size: 14px;
          font-style: italic; color: #3D3D3D;
        }
        .core-belief {
          background: linear-gradient(135deg, rgba(232,56,13,.06), rgba(232,56,13,.02));
          border: 1px solid rgba(232,56,13,.18);
          border-radius: 10px; padding: 14px 16px; margin-top: 1rem;
        }
        .core-belief-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: #E8380D; margin-bottom: 4px;
        }
        .core-belief-quote {
          font-family: 'Instrument Serif', serif;
          font-size: 1.05rem; font-style: italic; color: #111;
        }

        /* ── VALUE CARDS ── */
        .value-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 14px; padding: 1.8rem;
          transition: box-shadow .25s, transform .25s;
        }
        .value-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-4px); }
        .value-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.2rem; transition: transform .25s;
        }
        .value-card:hover .value-icon { transform: scale(1.1); }

        /* ── STAGS ── */
        .stag {
          font-size: 11px; font-weight: 500;
          padding: 4px 12px; border-radius: 100px;
          background: #F7F5F2; border: 1px solid #E5E2DC; color: #3D3D3D;
        }

        /* ── CTA BAND ── */
        .cta-band {
          background: linear-gradient(135deg, #E8380D 0%, #C42D0A 100%);
          padding: 4rem 2rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-band::before {
          content: '✨'; position: absolute;
          font-size: 8rem; opacity: .07;
          top: 50%; left: 5%; transform: translateY(-50%);
          pointer-events: none;
        }
        .cta-band::after {
          content: '📄'; position: absolute;
          font-size: 8rem; opacity: .07;
          top: 50%; right: 5%; transform: translateY(-50%);
          pointer-events: none;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #E8380D;
          padding: 14px 28px; border-radius: 10px;
          font-size: 15px; font-weight: 600; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: transform .2s, box-shadow .2s; text-decoration: none;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }

        /* ── DIVIDER ── */
        .section-divider {
          border: none; border-top: 1px solid #E5E2DC;
          max-width: 1100px; margin: 0 auto;
        }

        /* ══════════════════════════════════════
           TABLET — max-width: 900px
        ══════════════════════════════════════ */
        @media (max-width: 900px) {

          /* Hero — 2 col se 1 col */
          .about-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 3rem 1.5rem 2.5rem;
          }

          /* Values — 3 col se 2 col */
          .values-grid {
            grid-template-columns: 1fr 1fr;
          }

          /* Journey — 2 col se 1 col */
          .journey-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          /* Global band stat box hide on tablet */
          .global-stat {
            display: none;
          }
          .global-inner {
            grid-template-columns: 1fr;
          }
        }

        /* ══════════════════════════════════════
           MOBILE — max-width: 768px
        ══════════════════════════════════════ */
        @media (max-width: 768px) {

          /* Hero */
          .about-hero {
            padding: 2.5rem 1.2rem 2rem;
            gap: 1.5rem;
          }

          /* Backstory — 2 col se 1 col */
          .backstory-grid {
            grid-template-columns: 1fr;
          }

          /* Story cards padding kam */
          .story-card {
            padding: 1.5rem;
          }

          /* Values — 1 col */
          .values-grid {
            grid-template-columns: 1fr;
          }

          /* Value card padding kam */
          .value-card {
            padding: 1.3rem;
          }

          /* Global band */
          .global-inner {
            grid-template-columns: 1fr;
          }
          .global-stat { display: none; }

          /* Sections padding */
          .about-section {
            padding: 2.5rem 1.2rem;
          }

          /* CTA band */
          .cta-band {
            padding: 3rem 1.2rem;
          }
          .cta-btn {
            padding: 12px 22px;
            font-size: 14px;
          }
        }

        /* ══════════════════════════════════════
           SMALL MOBILE — max-width: 480px
        ══════════════════════════════════════ */
        @media (max-width: 480px) {

          .about-hero {
            padding: 2rem 1rem 1.5rem;
          }

          /* Pills wrap */
          .about-pills {
            gap: 6px;
          }
          .about-pill {
            font-size: 12px !important;
            padding: 5px 11px !important;
          }

          /* Quote card font size */
          .about-quote-text {
            font-size: 1.1rem !important;
          }

          /* Stats 3 col raho lekin chhote */
          .about-stats-num {
            font-size: 1.4rem !important;
          }

          /* Stags wrap */
          .stag {
            font-size: 10px;
            padding: 3px 10px;
          }

          /* Timeline */
          .tl-title { font-size: .95rem; }
          .tl-body  { font-size: 13px; }

          /* Solo cards */
          .solo-card-inner {
            padding: 1.2rem !important;
          }

          /* CTA */
          .cta-band::before,
          .cta-band::after { display: none; }
        }
      `}</style>

      <main className="about-page min-h-screen">

        {/* ══ HERO ══ */}
        <section className="about-hero">

          {/* LEFT */}
          <div className="fade-in delay-1">
            <div className="eyebrow" style={{ marginBottom: "1.2rem" }}>
              Built with ❤ · Since 2023
            </div>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              lineHeight: 1.1, color: "#111", marginBottom: "1.2rem",
            }}>
              We don't do<br />subscriptions<br />
              <em style={{ fontStyle: "italic", color: "#E8380D" }}>&amp; popups.</em>
            </h1>
            <p style={{ fontSize: 16, color: "#3D3D3D", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 480 }}>
              PDF Linx exists because free tools shouldn't feel like a scam.
              Built solo, driven by <strong style={{ color: "#111" }}>real human needs</strong> — no boardroom, no hidden agenda.
            </p>
            <div className="about-pills" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["🚀 22+ tools", "🔒 Browser-first privacy", "🌍 150K+ users"].map((p) => (
                <span key={p} className="about-pill" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#fff", border: "1px solid #E5E2DC",
                  borderRadius: 100, padding: "6px 14px",
                  fontSize: 13, fontWeight: 500, color: "#3D3D3D",
                }}>{p}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Quote Card */}
          <div className="fade-in delay-2">
            <div style={{
              background: "#fff", border: "1px solid #E5E2DC",
              borderRadius: 20, padding: "2rem",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: "linear-gradient(135deg,rgba(232,56,13,.08),rgba(232,56,13,.02))",
                pointerEvents: "none",
              }} />
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "5rem", color: "#E8380D",
                opacity: .15, lineHeight: 1, marginBottom: "-.4rem",
              }}>"</div>
              <p className="about-quote-text" style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "1.3rem", fontStyle: "italic",
                lineHeight: 1.5, color: "#111", marginBottom: "1rem",
              }}>
                Don't waste people's time. Tools should feel invisible — you drop a file, you get results, you leave.
              </p>
              <p style={{ fontSize: 13, color: "#888" }}>
                — The person who built this, at 2AM before a deadline
              </p>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                borderTop: "1px solid #E5E2DC",
                marginTop: "1.5rem", paddingTop: "1.5rem",
              }}>
                {[["22+", "Free Tools"], ["150K", "Users"], ["80+", "Countries"]].map(([num, lbl]) => (
                  <div key={lbl} style={{
                    textAlign: "center",
                    borderRight: lbl !== "Countries" ? "1px solid #E5E2DC" : "none",
                  }}>
                    <span className="about-stats-num" style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: "1.8rem", color: "#111", display: "block",
                    }}>{num}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ══ BACKSTORY ══ */}
        <section className="about-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
          <div className="eyebrow">The backstory</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1.2, color: "#111", marginBottom: ".5rem" }}>
            Why this even exists
          </h2>
          <p style={{ fontSize: 15, color: "#888", marginBottom: "2.5rem", maxWidth: 540 }}>
            A frustrating receipt, one weekend, and a Reddit post that changed everything.
          </p>

          <div className="backstory-grid">

            <div className="story-card fade-in delay-2">
              <div className="story-label">October 2023 — The origin</div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "#111", marginBottom: ".8rem" }}>
                A scanned receipt nearly cost everything
              </h3>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
                A scanned receipt made me almost lose it. I tried <em>"free" PDF converters</em> that demanded signups, tiny file limits, and made me wait 3 minutes for a 2-page PDF.
              </p>
              <div className="insight-box">
                💡 "Why does a simple task need this much friction?"
              </div>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
                So over a weekend, I built my own. No tracking, no ads, no "create an account" nonsense. Just drop a file, get results, leave. It felt <strong style={{ color: "#E8380D" }}>right.</strong>
              </p>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8 }}>
                In November, I shared it on Reddit and it <strong>exploded</strong> — thousands of students, freelancers, and fellow devs started using it. A friend merged her thesis PDFs in seconds, a café owner made QR codes for their menu.
              </p>
              <p style={{ fontSize: 13, color: "#888", marginTop: "1rem", borderLeft: "2px solid #E5E2DC", paddingLeft: 12 }}>
                ✨ Today: 22 tools — same soul, one human helping others skip the BS.
              </p>
            </div>

            <div className="story-card story-card-amber fade-in delay-3">
              <div className="story-label">Why this exists</div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "#111", marginBottom: ".8rem" }}>
                One belief, built into every tool
              </h3>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
                I'm not chasing a billion-dollar exit. I just <strong>hate time-wasting software</strong> that charges $15/month for something that should take 4 seconds.
              </p>
              <div className="core-belief">
                <div className="core-belief-label">🔥 Core belief</div>
                <div className="core-belief-quote">"Don't waste people's time."</div>
                <p style={{ fontSize: 13, color: "#3D3D3D", marginTop: 6, lineHeight: 1.6 }}>
                  Whether it's 2AM before a deadline, compressing bulky PDFs for a client, or generating a QR code — tools should feel invisible.
                </p>
              </div>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginTop: "1rem" }}>
                No spam popups, no "upgrade to pro" fake buttons, no weirdly slow servers. If a tool can run locally in your browser, it does.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "1.2rem" }}>
                {["⚡ Fast by design", "🔒 Privacy by default", "🤫 No noise"].map(t => (
                  <span key={t} className="stag">{t}</span>
                ))}
              </div>
            </div>

          </div>
        </section>

        <hr className="section-divider" />

        {/* ══ VALUES ══ */}
        <section className="about-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>What makes us different</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#111", lineHeight: 1.2 }}>
              Built with <em style={{ fontStyle: "italic", color: "#E8380D" }}>you</em> in mind
            </h2>
            <p style={{ fontSize: 15, color: "#888", marginTop: ".4rem" }}>No spin. Just features you actually feel.</p>
          </div>

          <div className="values-grid">
            <div className="value-card fade-in delay-1">
              <div className="value-icon" style={{ background: "#FEF0ED" }}>
                <Globe size={24} color="#E8380D" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
                Actually <span style={{ color: "#E8380D" }}>free</span>
              </h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
                No "free trial" traps. No credit card forms. No watermarks. Open the site, use any tool, close the tab. Zero friction. Period.
              </p>
            </div>

            <div className="value-card fade-in delay-2">
              <div className="value-icon" style={{ background: "#FFF8E6" }}>
                <Zap size={24} color="#D97706" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
                Ridiculously <span style={{ color: "#D97706" }}>fast</span>
              </h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
                Merge 50 PDFs? Usually under 3 seconds. Compress images while sipping coffee. Built to be snappy because waiting sucks.
              </p>
            </div>

            <div className="value-card fade-in delay-3">
              <div className="value-icon" style={{ background: "#EDFAF3" }}>
                <ShieldCheck size={24} color="#1A7F5A" />
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
                Your files stay <span style={{ color: "#1A7F5A" }}>yours</span>
              </h3>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
                Many tools run locally inside your browser — files never leave your device. For server-side tools, we're transparent. No sneaky selling.
              </p>
            </div>
          </div>
        </section>

        {/* ══ GLOBAL DARK BAND ══ */}
        <section style={{ background: "#111", padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", fontSize: "8rem", opacity: .06, pointerEvents: "none" }}>🌍</div>

          <div className="global-inner">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: ".6rem" }}>
                Used in 80+ countries
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#fff", lineHeight: 1.25, marginBottom: ".8rem" }}>
                Built for everyone,<br />wherever you are
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", maxWidth: 520, lineHeight: 1.75, marginBottom: ".8rem" }}>
                What started as a solo weekend project is now used by students, freelancers, developers, and small business owners across the globe. No matter where you're working from — PDF Linx just works.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", maxWidth: 520, lineHeight: 1.75, marginBottom: "1.2rem" }}>
                Got a bug report, a feature idea, or just want to say hi? Every message goes directly to the person who built this. That's the whole team.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["🎓 Students & researchers", "💼 Freelancers", "🏢 Small businesses", "💻 Developers", "🌍 80+ countries"].map(t => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 100, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.12)" }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="global-stat">
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2.8rem", color: "#fff", display: "block" }}>80+</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Countries</span>
            </div>
          </div>
        </section>

        {/* ══ TIMELINE + BUILT SOLO ══ */}
        <section className="about-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
          <div className="journey-grid">

            {/* TIMELINE */}
            <div>
              <div className="eyebrow">The journey</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.8rem", color: "#111", marginBottom: "1.5rem" }}>
                From 3 tools to 22+
              </h2>
              <div className="timeline-wrap">
                {[
                  { date: "Oct '23", title: "The beginning", body: "PDF to Word, Merge PDF, Compress PDF — just the basics that needed fixing.", badge: "3 tools" },
                  { date: "Nov '23", title: "Reddit went wild", body: "Reddit post blew up (5K+ upvotes). Added QR generator after hundreds of requests.", badge: "🚀 5K+ upvotes" },
                  { date: "2024", title: "Growing fast", body: "Image compressor, password generator, Split PDF — all added from real user requests.", badge: "User-driven" },
                  { date: "Today", title: "Still going", body: "22 tools. 0 bloat. 100% indie energy. Same soul — one human helping others skip the BS.", badge: "22 tools · 150K users" },
                ].map((item) => (
                  <div key={item.date} className="tl-item">
                    <div className="tl-date">{item.date}</div>
                    <div className="tl-title">{item.title}</div>
                    <p className="tl-body">{item.body}</p>
                    <span className="tl-badge">{item.badge}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#888", marginTop: ".5rem", fontStyle: "italic" }}>
                📬 Got an idea? I read everything at{" "}
                <a href="mailto:support@pdflinx.com" style={{ color: "#E8380D", textDecoration: "none", borderBottom: "1px solid rgba(232,56,13,.3)" }}>support@pdflinx.com</a>
              </p>
            </div>

            {/* BUILT SOLO */}
            <div>
              <div className="eyebrow">Behind the scenes</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.8rem", color: "#111", marginBottom: "1.5rem" }}>
                Built solo, maintained with love
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="solo-card-inner" style={{ background: "#fff", border: "1px solid #E5E2DC", borderRadius: 14, padding: "1.5rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>🧑‍💻</div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".5rem" }}>No corporate meetings. Ever.</h3>
                  <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.8 }}>
                    No investors pushing ads. Just me (a dev who hates subscription fatigue) and my laptop, shipping updates when real people need them.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1rem" }}>
                    <span className="stag">✅ 100% human-made</span>
                    <span className="stag">🔄 Regular updates</span>
                  </div>
                </div>

                <div className="solo-card-inner" style={{ background: "#fff", border: "1px solid #E5E2DC", borderRadius: 14, padding: "1.5rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>💡</div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".5rem" }}>One question drives everything</h3>
                  <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.8 }}>
                    Every tool is built with one question:{" "}
                    <em style={{ color: "#E8380D", background: "#FEF0ED", padding: "1px 6px", borderRadius: 4 }}>"Does this solve someone's headache?"</em>{" "}
                    If the answer isn't immediately yes — it doesn't ship.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══ CTA BAND ══ */}
        <div className="cta-band">
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#fff", marginBottom: ".6rem" }}>
            No strings attached. <em style={{ fontStyle: "italic" }}>Ever.</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: "2rem" }}>
            Use PDF Linx as much as you want — for work, study, or side projects. Zero cost, zero signup, zero drama.
          </p>
          <Link href="/" className="cta-btn">
            Explore all 22+ tools →
          </Link>
          <p style={{ marginTop: "1rem", fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            ⭐ Loved by thousands · No tracking · Made with ❤ · No data retained
          </p>
        </div>

      </main>
    </>
  );
}





























// "use client";

// import { ShieldCheck, Zap, Globe } from "lucide-react";
// import Script from "next/script";
// import Link from "next/link";

// export default function About() {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "AboutPage",
//     name: "About PDF Linx — No-BS, Privacy-First Tools",
//     description:
//       "PDF Linx was born from frustration with clunky PDF tools. 22+ free tools, no signups, no subscriptions. Built solo, loved by thousands across Pakistan, India, Bangladesh & beyond.",
//     url: "https://pdflinx.com/about",
//     publisher: {
//       "@type": "Organization",
//       name: "PDF Linx",
//       url: "https://pdflinx.com",
//       logo: "https://pdflinx.com/logo.png",
//       foundingDate: "2023",
//     },
//   };

//   return (
//     <>
//       <Script
//         id="aboutpage-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

//         .about-page {
//           font-family: 'DM Sans', sans-serif;
//           background: #F7F5F2;
//           color: #111111;
//         }

//         /* ── ANIMATIONS ── */
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(24px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .fade-in   { opacity: 0; animation: fadeUp .6s ease forwards; }
//         .delay-1   { animation-delay: .1s; }
//         .delay-2   { animation-delay: .2s; }
//         .delay-3   { animation-delay: .3s; }
//         .delay-4   { animation-delay: .4s; }
//         .delay-5   { animation-delay: .5s; }

//         @keyframes tlFade {
//           from { opacity: 0; transform: translateX(-16px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//         .tl-item {
//           opacity: 0;
//           animation: tlFade .5s ease forwards;
//         }
//         .tl-item:nth-child(1) { animation-delay: .15s; }
//         .tl-item:nth-child(2) { animation-delay: .28s; }
//         .tl-item:nth-child(3) { animation-delay: .41s; }
//         .tl-item:nth-child(4) { animation-delay: .54s; }

//         /* ── SECTION LABELS ── */
//         .eyebrow {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: .08em;
//           text-transform: uppercase;
//           color: #E8380D;
//           margin-bottom: .5rem;
//         }
//         .eyebrow::before {
//           content: '';
//           display: inline-block;
//           width: 18px;
//           height: 2px;
//           background: #E8380D;
//           border-radius: 2px;
//         }

//         /* ── CARDS ── */
//         .story-card {
//           background: #fff;
//           border: 1px solid #E5E2DC;
//           border-radius: 16px;
//           padding: 2rem;
//           position: relative;
//           overflow: hidden;
//           transition: box-shadow .25s, transform .25s;
//         }
//         .story-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,.08); transform: translateY(-3px); }
//         .story-card::after {
//           content: '';
//           position: absolute;
//           top: 0; left: 0;
//           width: 4px; height: 100%;
//           background: #E8380D;
//           border-radius: 4px 0 0 4px;
//         }
//         .story-card-amber::after { background: #D97706; }

//         .story-label {
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: .06em;
//           text-transform: uppercase;
//           color: #E8380D;
//           margin-bottom: .75rem;
//         }
//         .story-card-amber .story-label { color: #D97706; }

//         .insight-box {
//           background: #F7F5F2;
//           border-left: 3px solid #D97706;
//           border-radius: 8px;
//           padding: 12px 16px;
//           margin: 1rem 0;
//           font-size: 14px;
//           font-style: italic;
//           color: #3D3D3D;
//         }

//         .core-belief {
//           background: linear-gradient(135deg, rgba(232,56,13,.06), rgba(232,56,13,.02));
//           border: 1px solid rgba(232,56,13,.18);
//           border-radius: 10px;
//           padding: 14px 16px;
//           margin-top: 1rem;
//         }
//         .core-belief-label {
//           font-size: 10px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: .08em;
//           color: #E8380D;
//           margin-bottom: 4px;
//         }
//         .core-belief-quote {
//           font-family: 'Instrument Serif', serif;
//           font-size: 1.05rem;
//           font-style: italic;
//           color: #111;
//         }

//         /* ── VALUE CARDS ── */
//         .value-card {
//           background: #fff;
//           border: 1px solid #E5E2DC;
//           border-radius: 14px;
//           padding: 1.8rem;
//           transition: box-shadow .25s, transform .25s;
//         }
//         .value-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-4px); }

//         .value-icon {
//           width: 48px; height: 48px;
//           border-radius: 12px;
//           display: flex; align-items: center; justify-content: center;
//           margin-bottom: 1.2rem;
//           transition: transform .25s;
//         }
//         .value-card:hover .value-icon { transform: scale(1.1); }

//         /* ── TIMELINE ── */
//         .timeline-wrap {
//           position: relative;
//           padding-left: 1.8rem;
//         }
//         .timeline-wrap::before {
//           content: '';
//           position: absolute;
//           left: 0; top: 8px; bottom: 8px;
//           width: 2px;
//           background: linear-gradient(to bottom, #E8380D, rgba(232,56,13,.1));
//           border-radius: 2px;
//         }
//         .tl-item {
//           position: relative;
//           padding: 0 0 1.8rem 1.8rem;
//         }
//         .tl-item::before {
//           content: '';
//           position: absolute;
//           left: -5px; top: 5px;
//           width: 12px; height: 12px;
//           border-radius: 50%;
//           background: #E8380D;
//           border: 2px solid #F7F5F2;
//           box-shadow: 0 0 0 2px #E8380D;
//         }
//         .tl-date {
//           font-size: 11px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: .06em;
//           color: #E8380D;
//           margin-bottom: 3px;
//         }
//         .tl-title {
//           font-family: 'Instrument Serif', serif;
//           font-size: 1.05rem;
//           color: #111;
//           margin-bottom: 3px;
//         }
//         .tl-body { font-size: 13.5px; color: #3D3D3D; line-height: 1.7; }
//         .tl-badge {
//           display: inline-block;
//           margin-top: 6px;
//           font-size: 11px;
//           font-weight: 600;
//           padding: 3px 10px;
//           border-radius: 100px;
//           background: #FEF0ED;
//           color: #E8380D;
//         }

//         /* ── STAGS ── */
//         .stag {
//           font-size: 11px;
//           font-weight: 500;
//           padding: 4px 12px;
//           border-radius: 100px;
//           background: #F7F5F2;
//           border: 1px solid #E5E2DC;
//           color: #3D3D3D;
//         }

//         /* ── CTA BAND ── */
//         .cta-band {
//           background: linear-gradient(135deg, #E8380D 0%, #C42D0A 100%);
//           padding: 4rem 2rem;
//           text-align: center;
//           position: relative;
//           overflow: hidden;
//         }
//         .cta-band::before {
//           content: '✨';
//           position: absolute;
//           font-size: 8rem;
//           opacity: .07;
//           top: 50%; left: 5%;
//           transform: translateY(-50%);
//           pointer-events: none;
//         }
//         .cta-band::after {
//           content: '📄';
//           position: absolute;
//           font-size: 8rem;
//           opacity: .07;
//           top: 50%; right: 5%;
//           transform: translateY(-50%);
//           pointer-events: none;
//         }
//         .cta-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: #fff;
//           color: #E8380D;
//           padding: 14px 28px;
//           border-radius: 10px;
//           font-size: 15px;
//           font-weight: 600;
//           border: none;
//           cursor: pointer;
//           font-family: 'DM Sans', sans-serif;
//           transition: transform .2s, box-shadow .2s;
//           text-decoration: none;
//         }
//         .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }

//         /* ── DIVIDER ── */
//         .section-divider {
//           border: none;
//           border-top: 1px solid #E5E2DC;
//           max-width: 1100px;
//           margin: 0 auto;
//         }
//       `}</style>

//       <main className="about-page min-h-screen">

//         {/* ══════════════════════════════════════════
//             HERO
//         ══════════════════════════════════════════ */}
//         <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

//           {/* LEFT */}
//           <div className="fade-in delay-1">
//             <div className="eyebrow" style={{ marginBottom: "1.2rem" }}>
//               Built with ❤ · Since 2023
//             </div>

//             <h1
//               style={{
//                 fontFamily: "'Instrument Serif', serif",
//                 fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
//                 lineHeight: 1.1,
//                 color: "#111",
//                 marginBottom: "1.2rem",
//               }}
//             >
//               We don't do<br />
//               subscriptions<br />
//               <em style={{ fontStyle: "italic", color: "#E8380D" }}>&amp; popups.</em>
//             </h1>

//             <p style={{ fontSize: 16, color: "#3D3D3D", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 480 }}>
//               PDF Linx exists because free tools shouldn't feel like a scam.
//               Built solo, driven by <strong style={{ color: "#111" }}>real human needs</strong> — no boardroom, no hidden agenda.
//             </p>

//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//               {["🚀 22+ tools", "🔒 Browser-first privacy", "🌍 150K+ users"].map((p) => (
//                 <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #E5E2DC", borderRadius: 100, padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#3D3D3D" }}>{p}</span>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT — Quote Card */}
//           <div className="fade-in delay-2">
//             <div style={{ background: "#fff", border: "1px solid #E5E2DC", borderRadius: 20, padding: "2rem", position: "relative", overflow: "hidden" }}>
//               {/* deco circle */}
//               <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg,rgba(232,56,13,.08),rgba(232,56,13,.02))", pointerEvents: "none" }} />

//               <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "5rem", color: "#E8380D", opacity: .15, lineHeight: 1, marginBottom: "-.4rem" }}>"</div>

//               <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", fontStyle: "italic", lineHeight: 1.5, color: "#111", marginBottom: "1rem" }}>
//                 Don't waste people's time. Tools should feel invisible — you drop a file, you get results, you leave.
//               </p>
//               <p style={{ fontSize: 13, color: "#888" }}>— The person who built this, at 2AM before a deadline</p>

//               {/* Stats row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid #E5E2DC", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
//                 {[["22+", "Free Tools"], ["150K", "Users"], ["80+", "Countries"]].map(([num, lbl]) => (
//                   <div key={lbl} style={{ textAlign: "center", borderRight: lbl !== "Countries" ? "1px solid #E5E2DC" : "none" }}>
//                     <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.8rem", color: "#111", display: "block" }}>{num}</span>
//                     <span style={{ fontSize: 11, color: "#888" }}>{lbl}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <hr className="section-divider" />

//         {/* ══════════════════════════════════════════
//             BACKSTORY
//         ══════════════════════════════════════════ */}
//         <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
//           <div className="eyebrow">The backstory</div>
//           <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", lineHeight: 1.2, color: "#111", marginBottom: ".5rem" }}>
//             Why this even exists
//           </h2>
//           <p style={{ fontSize: 15, color: "#888", marginBottom: "2.5rem", maxWidth: 540 }}>
//             A frustrating receipt, one weekend, and a Reddit post that changed everything.
//           </p>

//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

//             {/* Origin */}
//             <div className={`story-card fade-in delay-2`}>
//               <div className="story-label">October 2023 — The origin</div>
//               <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "#111", marginBottom: ".8rem" }}>
//                 A scanned receipt nearly cost everything
//               </h3>
//               <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
//                 A scanned receipt made me almost lose it. I tried <em>"free" PDF converters</em> that demanded signups, tiny file limits, and made me wait 3 minutes for a 2-page PDF.
//               </p>
//               <div className="insight-box">
//                 💡 "Why does a simple task need this much friction?"
//               </div>
//               <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
//                 So over a weekend, I built my own. No tracking, no ads, no "create an account" nonsense. Just drop a file, get results, leave. It felt <strong style={{ color: "#E8380D" }}>right.</strong>
//               </p>
//               <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8 }}>
//                 In November, I shared it on Reddit and it <strong>exploded</strong> — thousands of students, freelancers, and fellow devs started using it. A friend merged her thesis PDFs in seconds, a café owner made QR codes for their menu.
//               </p>
//               <p style={{ fontSize: 13, color: "#888", marginTop: "1rem", borderLeft: "2px solid #E5E2DC", paddingLeft: 12 }}>
//                 ✨ Today: 22 tools — same soul, one human helping others skip the BS.
//               </p>
//             </div>

//             {/* Why */}
//             <div className={`story-card story-card-amber fade-in delay-3`}>
//               <div className="story-label">Why this exists</div>
//               <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "#111", marginBottom: ".8rem" }}>
//                 One belief, built into every tool
//               </h3>
//               <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginBottom: ".75rem" }}>
//                 I'm not chasing a billion-dollar exit. I just <strong>hate time-wasting software</strong> that charges $15/month for something that should take 4 seconds.
//               </p>
//               <div className="core-belief">
//                 <div className="core-belief-label">🔥 Core belief</div>
//                 <div className="core-belief-quote">"Don't waste people's time."</div>
//                 <p style={{ fontSize: 13, color: "#3D3D3D", marginTop: 6, lineHeight: 1.6 }}>
//                   Whether it's 2AM before a deadline, compressing bulky PDFs for a client, or generating a QR code — tools should feel invisible.
//                 </p>
//               </div>
//               <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.8, marginTop: "1rem" }}>
//                 No spam popups, no "upgrade to pro" fake buttons, no weirdly slow servers. If a tool can run locally in your browser, it does.
//               </p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "1.2rem" }}>
//                 {["⚡ Fast by design", "🔒 Privacy by default", "🤫 No noise"].map(t => (
//                   <span key={t} className="stag">{t}</span>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </section>

//         <hr className="section-divider" />

//         {/* ══════════════════════════════════════════
//             VALUES
//         ══════════════════════════════════════════ */}
//         <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
//           <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
//             <div className="eyebrow" style={{ justifyContent: "center" }}>What makes us different</div>
//             <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#111", lineHeight: 1.2 }}>
//               Built with <em style={{ fontStyle: "italic", color: "#E8380D" }}>you</em> in mind
//             </h2>
//             <p style={{ fontSize: 15, color: "#888", marginTop: ".4rem" }}>No spin. Just features you actually feel.</p>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>

//             <div className={`value-card fade-in delay-1`}>
//               <div className="value-icon" style={{ background: "#FEF0ED" }}>
//                 <Globe size={24} color="#E8380D" />
//               </div>
//               <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
//                 Actually <span style={{ color: "#E8380D" }}>free</span>
//               </h3>
//               <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
//                 No "free trial" traps. No credit card forms. No watermarks. Open the site, use any tool, close the tab. Zero friction. Period.
//               </p>
//             </div>

//             <div className={`value-card fade-in delay-2`}>
//               <div className="value-icon" style={{ background: "#FFF8E6" }}>
//                 <Zap size={24} color="#D97706" />
//               </div>
//               <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
//                 Ridiculously <span style={{ color: "#D97706" }}>fast</span>
//               </h3>
//               <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
//                 Merge 50 PDFs? Usually under 3 seconds. Compress images while sipping coffee. Built to be snappy because waiting sucks.
//               </p>
//             </div>

//             <div className={`value-card fade-in delay-3`}>
//               <div className="value-icon" style={{ background: "#EDFAF3" }}>
//                 <ShieldCheck size={24} color="#1A7F5A" />
//               </div>
//               <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.15rem", color: "#111", marginBottom: ".5rem" }}>
//                 Your files stay <span style={{ color: "#1A7F5A" }}>yours</span>
//               </h3>
//               <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.75 }}>
//                 Many tools run locally inside your browser — files never leave your device. For server-side tools, we're transparent. No sneaky selling.
//               </p>
//             </div>

//           </div>
//         </section>

//         {/* ══════════════════════════════════════════
//             GLOBAL DARK BAND
//         ══════════════════════════════════════════ */}
//         <section style={{ background: "#111", padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
//           {/* decorative globe */}
//           <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", fontSize: "8rem", opacity: .06, pointerEvents: "none" }}>🌍</div>

//           <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "2rem" }}>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: ".6rem" }}>
//                 Used in 80+ countries
//               </div>
//               <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#fff", lineHeight: 1.25, marginBottom: ".8rem" }}>
//                 Built for everyone,<br />wherever you are
//               </h2>
//               <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", maxWidth: 520, lineHeight: 1.75, marginBottom: ".8rem" }}>
//                 What started as a solo weekend project is now used by students, freelancers, developers, and small business owners across the globe. No matter where you're working from — PDF Linx just works.
//               </p>
//               <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", maxWidth: 520, lineHeight: 1.75, marginBottom: "1.2rem" }}>
//                 Got a bug report, a feature idea, or just want to say hi? Every message goes directly to the person who built this. That's the whole team.
//               </p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                 {["🎓 Students & researchers", "💼 Freelancers", "🏢 Small businesses", "💻 Developers", "🌍 80+ countries"].map(t => (
//                   <span key={t} style={{ fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 100, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.12)" }}>{t}</span>
//                 ))}
//               </div>
//             </div>

//             <div style={{ textAlign: "center", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: "2rem 2.5rem", flexShrink: 0 }}>
//               <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2.8rem", color: "#fff", display: "block" }}>80+</span>
//               <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Countries</span>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════
//             TIMELINE + BUILT SOLO
//         ══════════════════════════════════════════ */}
//         <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

//             {/* TIMELINE */}
//             <div>
//               <div className="eyebrow">The journey</div>
//               <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.8rem", color: "#111", marginBottom: "1.5rem" }}>
//                 From 3 tools to 22+
//               </h2>
//               <div className="timeline-wrap">
//                 {[
//                   { date: "Oct '23", title: "The beginning", body: "PDF to Word, Merge PDF, Compress PDF — just the basics that needed fixing.", badge: "3 tools" },
//                   { date: "Nov '23", title: "Reddit went wild", body: "Reddit post blew up (5K+ upvotes). Added QR generator after hundreds of requests.", badge: "🚀 5K+ upvotes" },
//                   { date: "2024", title: "Growing fast", body: "Image compressor, password generator, Split PDF — all added from real user requests.", badge: "User-driven" },
//                   { date: "Today", title: "Still going", body: "22 tools. 0 bloat. 100% indie energy. Same soul — one human helping others skip the BS.", badge: "22 tools · 150K users" },
//                 ].map((item) => (
//                   <div key={item.date} className="tl-item">
//                     <div className="tl-date">{item.date}</div>
//                     <div className="tl-title">{item.title}</div>
//                     <p className="tl-body">{item.body}</p>
//                     <span className="tl-badge">{item.badge}</span>
//                   </div>
//                 ))}
//               </div>
//               <p style={{ fontSize: 13, color: "#888", marginTop: ".5rem", fontStyle: "italic" }}>
//                 📬 Got an idea? I read everything at{" "}
//                 <a href="mailto:support@pdflinx.com" style={{ color: "#E8380D", textDecoration: "none", borderBottom: "1px solid rgba(232,56,13,.3)" }}>support@pdflinx.com</a>
//               </p>
//             </div>

//             {/* BUILT SOLO */}
//             <div>
//               <div className="eyebrow">Behind the scenes</div>
//               <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.8rem", color: "#111", marginBottom: "1.5rem" }}>
//                 Built solo, maintained with love
//               </h2>

//               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                 <div style={{ background: "#fff", border: "1px solid #E5E2DC", borderRadius: 14, padding: "1.5rem" }}>
//                   <div style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>🧑‍💻</div>
//                   <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".5rem" }}>No corporate meetings. Ever.</h3>
//                   <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.8 }}>
//                     No investors pushing ads. Just me (a dev who hates subscription fatigue) and my laptop, shipping updates when real people need them.
//                   </p>
//                   <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1rem" }}>
//                     <span className="stag">✅ 100% human-made</span>
//                     <span className="stag">🔄 Regular updates</span>
//                   </div>
//                 </div>

//                 <div style={{ background: "#fff", border: "1px solid #E5E2DC", borderRadius: 14, padding: "1.5rem" }}>
//                   <div style={{ fontSize: "1.8rem", marginBottom: ".8rem" }}>💡</div>
//                   <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "#111", marginBottom: ".5rem" }}>One question drives everything</h3>
//                   <p style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.8 }}>
//                     Every tool is built with one question:{" "}
//                     <em style={{ color: "#E8380D", background: "#FEF0ED", padding: "1px 6px", borderRadius: 4 }}>"Does this solve someone's headache?"</em>{" "}
//                     If the answer isn't immediately yes — it doesn't ship.
//                   </p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* ══════════════════════════════════════════
//             CTA BAND
//         ══════════════════════════════════════════ */}
//         <div className="cta-band">
//           <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#fff", marginBottom: ".6rem" }}>
//             No strings attached. <em style={{ fontStyle: "italic" }}>Ever.</em>
//           </h2>
//           <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: "2rem" }}>
//             Use PDF Linx as much as you want — for work, study, or side projects. Zero cost, zero signup, zero drama.
//           </p>
//           <Link href="/" className="cta-btn">
//             Explore all 22+ tools →
//           </Link>
//           <p style={{ marginTop: "1rem", fontSize: 12, color: "rgba(255,255,255,.5)" }}>
//             ⭐ Loved by thousands · No tracking · Made with ❤ · No data retained
//           </p>
//         </div>
//       </main>
//     </>
//   );
// }




































// // "use client";

// // import { ShieldCheck, Zap, Globe, Heart, Users, Coffee, Sparkles } from "lucide-react";
// // import Script from "next/script";

// // export default function About() {
// //   const jsonLd = {
// //     "@context": "https://schema.org",
// //     "@type": "AboutPage",
// //     name: "About PDF Linx — No-BS, Privacy-First Tools",
// //     description:
// //       "PDF Linx was born from frustration with clunky PDF tools. 22+ free tools, no signups, no subscriptions. Built solo, loved by thousands across Pakistan, India, Bangladesh & beyond.",
// //     url: "https://pdflinx.com/about",
// //     publisher: {
// //       "@type": "Organization",
// //       name: "PDF Linx",
// //       url: "https://pdflinx.com",
// //     },
// //   };

// //   return (
// //     <>
// //       <Script
// //         id="aboutpage-jsonld"
// //         type="application/ld+json"
// //         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
// //       />

// //       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
// //         {/* Hero Section — Modern & Bold */}
// //         <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-20 md:pb-12">
// //           <div className="text-center max-w-4xl mx-auto">
// //             {/* Badge */}
// //             <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-indigo-100 mb-6">
// //               <span className="relative flex h-2 w-2">
// //                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
// //                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
// //               </span>
// //               <span className="text-xs font-medium text-indigo-800">BUILT WITH ❤️ · SINCE 2023</span>
// //             </div>

// //             <h1 className="text-4xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-6">
// //               <span className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-500 bg-clip-text text-transparent">
// //                 We don't do
// //               </span>
// //               <br />
// //               <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
// //                 subscriptions & popups
// //               </span>
// //             </h1>

// //             <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
// //               PDF Linx exists because free tools shouldn't feel like a scam.
// //               Built solo, driven by <span className="font-semibold text-indigo-700">real human needs</span> — no boardroom, no hidden agenda.
// //             </p>

// //             <div className="flex flex-wrap gap-3 justify-center mt-8">
// //               <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
// //                 🚀 22+ tools
// //               </span>
// //               <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
// //                 🔒 Browser-first privacy
// //               </span>
// //               <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
// //                 🌍 150k+ users
// //               </span>
// //             </div>
// //           </div>
// //         </section>

// //         {/* The Story Section — Personal Touch */}
// //         <section className="max-w-6xl mx-auto px-4 py-8">
// //           <div className="grid md:grid-cols-2 gap-8">
// //             {/* Left Card — Origin Story */}
// //             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl transition-all duration-300 group">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <div className="h-10 w-1 bg-gradient-to-b from-indigo-500 to-indigo-300 rounded-full"></div>
// //                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
// //                   The backstory
// //                 </h2>
// //               </div>
// //               <div className="space-y-4 text-gray-600 leading-relaxed">
// //                 <p>
// //                   <span className="font-bold text-indigo-700">October 2023</span> — a scanned receipt made me almost lose it.
// //                   I tried <span className="italic">"free" PDF converters</span> that demanded signups, tiny file limits,
// //                   and made me wait 3 minutes for a 2-page PDF.
// //                 </p>
// //                 <p className="bg-indigo-50/50 p-4 rounded-xl border-l-4 border-indigo-400">
// //                   💡 <span className="font-medium">"Why does a simple task need this much friction?"</span>
// //                 </p>
// //                 <p>
// //                   So over a weekend, I built my own. No tracking, no ads, no "create an account" nonsense.
// //                   Just drop a file, get results, leave. It felt <span className="font-medium text-indigo-800">right.</span>
// //                 </p>
// //                 <p>
// //                   In November, I shared it on Reddit and <span className="font-semibold">it exploded</span> —
// //                   thousands of students, freelancers, and fellow devs started using it.
// //                   A friend merged her thesis PDFs in seconds, a café owner made QR codes for their menu.
// //                 </p>
// //                 <div className="pt-2 text-sm text-gray-500 border-l-2 border-indigo-200 pl-4">
// //                   ✨ Today: 22 tools — same soul, one human helping others skip the BS.
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Right Card — Why This Exists */}
// //             <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl shadow-xl border border-indigo-100 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <div className="h-10 w-1 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full"></div>
// //                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
// //                   Why this exists
// //                 </h2>
// //               </div>
// //               <div className="space-y-4 text-gray-600 leading-relaxed">
// //                 <p>
// //                   I'm not chasing a billion-dollar exit. I just <span className="font-medium">hate time-wasting software</span>
// //                   that charges $15/month for something that should take 4 seconds.
// //                 </p>
// //                 <div className="bg-white/70 p-5 rounded-xl border border-indigo-100">
// //                   <p className="font-semibold text-indigo-900 mb-2">🎯 Core belief:</p>
// //                   <p className="italic text-gray-700">"Don't waste people's time."</p>
// //                   <p className="text-sm text-gray-600 mt-2">
// //                     Whether it's 2 AM before a deadline, compressing bulky PDFs for a client,
// //                     or generating a QR code — tools should feel invisible.
// //                   </p>
// //                 </div>
// //                 <p>
// //                   No spam popups, no "upgrade to pro" fake buttons, no weirdly slow servers.
// //                   If a tool can run locally in your browser, it does.
// //                 </p>
// //                 <div className="flex gap-2 text-sm text-indigo-700 font-medium">
// //                   ⚡ Fast by design · 🧠 Privacy by default · 🕊️ No noise
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Feature Cards — Enhanced Modern */}
// //         <section className="max-w-6xl mx-auto px-4 py-12">
// //           <div className="text-center mb-10">
// //             <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide px-3 py-1 rounded-full">
// //               what makes us different
// //             </span>
// //             <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800">
// //               Built with <span className="text-indigo-600">you</span> in mind
// //             </h2>
// //             <p className="text-gray-500 max-w-xl mx-auto mt-2">
// //               No spin. Just features you actually feel.
// //             </p>
// //           </div>

// //           <div className="grid md:grid-cols-3 gap-6">
// //             {/* Card 1 */}
// //             <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
// //               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
// //                 <Globe className="w-7 h-7 text-indigo-700" />
// //               </div>
// //               <h3 className="text-xl font-bold mb-2 text-gray-800">
// //                 Actually <span className="text-indigo-600">free</span>
// //               </h3>
// //               <p className="text-gray-500 text-sm leading-relaxed">
// //                 No "free trial" traps. No credit card forms. No watermarks.
// //                 Open the site, use any tool, close the tab. Zero friction. Period.
// //               </p>
// //             </div>

// //             {/* Card 2 */}
// //             <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
// //               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
// //                 <Zap className="w-7 h-7 text-amber-600" />
// //               </div>
// //               <h3 className="text-xl font-bold mb-2 text-gray-800">
// //                 Ridiculously <span className="text-amber-600">fast</span>
// //               </h3>
// //               <p className="text-gray-500 text-sm leading-relaxed">
// //                 Merge 50 PDFs? Usually under 3 seconds. Compress images while sipping coffee.
// //                 Built to be snappy because waiting sucks.
// //               </p>
// //             </div>

// //             {/* Card 3 */}
// //             <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
// //               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
// //                 <ShieldCheck className="w-7 h-7 text-emerald-700" />
// //               </div>
// //               <h3 className="text-xl font-bold mb-2 text-gray-800">
// //                 Your files stay <span className="text-emerald-600">yours</span>
// //               </h3>
// //               <p className="text-gray-500 text-sm leading-relaxed">
// //                 Many tools run locally inside your browser — files never leave your device.
// //                 For server-side tools, we're transparent. No sneaky selling.
// //               </p>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Community Section — Desi Dev Shoutout */}
// //         {/* <section className="max-w-6xl mx-auto px-4 py-8">
// //           <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-10 relative overflow-hidden">
// //             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
// //             <div className="relative flex flex-col md:flex-row gap-8 items-center">
// //               <div className="flex-1 text-center md:text-left">
// //                 <div className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-4 backdrop-blur-sm">
// //                   🌍 growing community
// //                 </div>
// //                 <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
// //                   From Pakistan to Bangladesh, India & beyond
// //                 </h3>
// //                 <p className="text-gray-600 leading-relaxed">
// //                   What started as a solo project now has a growing community across South Asia and the world. 
// //                   <strong className="text-indigo-700 block mt-2">Shoutout to the desi dev community 🙏</strong>
// //                   Your support, bug reports, and feature requests shaped what PDF Linx is today.
// //                 </p>
// //                 <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇵🇰 Lahore · Karachi</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇮🇳 Delhi · Bengaluru</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇧🇩 Dhaka · Chittagong</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🌏 80+ countries</span>
// //                 </div>
// //               </div>
// //               <div className="flex-shrink-0">
// //                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center text-5xl shadow-lg">
// //                   🙌
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section> */}

// //         {/* Community Section */}
// //         <section className="max-w-6xl mx-auto px-4 py-8">
// //           <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-10 relative overflow-hidden">
// //             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
// //             <div className="relative flex flex-col md:flex-row gap-8 items-center">
// //               <div className="flex-1 text-center md:text-left">
// //                 <div className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-4 backdrop-blur-sm">
// //                   🌍 used in 80+ countries
// //                 </div>
// //                 <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
// //                   Built for everyone, wherever you are
// //                 </h3>
// //                 <p className="text-gray-600 leading-relaxed">
// //                   What started as a solo weekend project is now used by students, freelancers, developers,
// //                   and small business owners across the globe. No matter where you're working from — PDF Linx just works.
// //                 </p>
// //                 <p className="text-gray-600 leading-relaxed mt-3">
// //                   Got a bug report, a feature idea, or just want to say hi? Every message goes directly
// //                   to the person who built this. That's the whole team.
// //                 </p>
// //                 <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Students & researchers</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Freelancers</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Small businesses</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Developers</span>
// //                   <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🌏 80+ countries</span>
// //                 </div>
// //               </div>
// //               <div className="flex-shrink-0">
// //                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center text-5xl shadow-lg">
// //                   🌍
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>


// //         {/* Journey Section */}
// //         <section className="max-w-6xl mx-auto px-4 py-8">
// //           <div className="grid md:grid-cols-2 gap-8">
// //             {/* Tools Evolution */}
// //             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <span className="text-3xl">🛠️</span>
// //                 <h3 className="text-xl font-bold text-gray-800">From 3 tools to 22+</h3>
// //               </div>
// //               <div className="space-y-3 text-gray-600">
// //                 <div className="flex gap-3">
// //                   <span className="text-indigo-500 font-bold">→</span>
// //                   <span><span className="font-semibold">Oct '23:</span> PDF to Word, Merge PDF, Compress PDF — just the basics.</span>
// //                 </div>
// //                 <div className="flex gap-3">
// //                   <span className="text-indigo-500 font-bold">→</span>
// //                   <span><span className="font-semibold">Nov '23:</span> Reddit post blew up (5k+ upvotes), added QR generator after requests.</span>
// //                 </div>
// //                 <div className="flex gap-3">
// //                   <span className="text-indigo-500 font-bold">→</span>
// //                   <span><span className="font-semibold">2024:</span> Image compressor, password generator, split PDF — all requested by real users.</span>
// //                 </div>
// //                 <div className="flex gap-3">
// //                   <span className="text-indigo-500 font-bold">→</span>
// //                   <span>Today: <span className="font-bold">22 tools, 0 bloat, 100% indie energy.</span></span>
// //                 </div>
// //               </div>
// //               <div className="mt-6 text-sm text-gray-500 italic border-t pt-4">
// //                 📬 Got an idea? I read everything at <a href="mailto:support@pdflinx.com" className="text-indigo-600 font-medium hover:underline">support@pdflinx.com</a>
// //               </div>
// //             </div>

// //             {/* Solo Builder */}
// //             <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 hover:shadow-xl transition">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <span className="text-3xl">🧘</span>
// //                 <h3 className="text-xl font-bold text-gray-800">Built solo, maintained with love</h3>
// //               </div>
// //               <p className="text-gray-600 leading-relaxed mb-4">
// //                 No corporate meetings, no investors pushing ads. Just me (a dev who hates subscription fatigue)
// //                 and my laptop, shipping updates when real people need them.
// //               </p>
// //               <p className="text-gray-600 leading-relaxed">
// //                 Every tool is built with one question: <span className="bg-indigo-100 px-1.5 py-0.5 rounded font-medium">"Does this solve someone's headache?"</span>
// //               </p>
// //               <div className="mt-5 flex gap-2 text-sm">
// //                 <span className="bg-white rounded-full px-3 py-1 text-gray-700 border">✨ 100% human-made</span>
// //                 <span className="bg-white rounded-full px-3 py-1 text-gray-700 border">📆 Regular updates</span>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Closing Note / CTA */}
// //         <section className="max-w-4xl mx-auto px-4 py-12">
// //           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">
// //             <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
// //             <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
// //               No strings attached. <span className="text-indigo-600">Ever.</span>
// //             </h2>
// //             <p className="text-gray-500 mb-6 max-w-lg mx-auto">
// //               That's the promise. Use PDF Linx as much as you want — for work, study, or side projects.
// //             </p>
// //             <a
// //               href="/"
// //               className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
// //             >
// //               Explore all 22+ tools →
// //             </a>
// //             <p className="text-xs text-gray-400 mt-6">
// //               ⭐ Loved by thousands · No tracking · Made with ☕ and frustration for bloated software
// //             </p>
// //           </div>
// //         </section>
// //       </main>
// //     </>
// //   );
// // }































// // // "use client";

// // // import { ShieldCheck, Zap, Globe } from "lucide-react";
// // // import Script from "next/script";

// // // export default function About() {
// // //   const jsonLd = {
// // //     "@context": "https://schema.org",
// // //     "@type": "AboutPage",
// // //     name: "About PDF Linx",
// // //     description:
// // //       "Learn about PDF Linx — a privacy-first collection of free PDF and utility tools built for speed and simplicity.",
// // //     url: "https://pdflinx.com/about",
// // //     publisher: {
// // //       "@type": "Organization",
// // //       name: "PDF Linx",
// // //       url: "https://pdflinx.com",
// // //     },
// // //   };

// // //   return (
// // //     <>
// // //       {/* SEO Schema (JSON-LD) */}
// // //       <Script
// // //         id="aboutpage-jsonld"
// // //         type="application/ld+json"
// // //         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
// // //       />

// // //       <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
// // //         {/* Hero Section */}
// // //         <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
// // //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// // //             About <strong>PDF Linx</strong>
// // //           </h1>

// // //           <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-3">
// // //             <p>
// // //               I built PDF Linx in <strong>October 2023</strong> after wasting way
// // //               too much time trying to convert a simple scanned receipt.
// // //               I tested multiple “free” converters — and they all came with the
// // //               same annoying problems.
// // //             </p>

// // //             <p>You know the type:</p>
// // //             <ul className="list-none space-y-1 ml-4">
// // //               <li>→ “Sign up to download your file” (why?)</li>
// // //               <li>→ tiny file limits</li>
// // //               <li>→ popups and distractions</li>
// // //               <li>→ slow processing for basic tasks</li>
// // //             </ul>

// // //             <p>
// // //               So I spent the weekend building something that just works —
// // //               simple, fast, and focused. Many tools run directly in your browser
// // //               to keep things private and quick.
// // //             </p>

// // //             <p>
// // //               I posted it on Reddit in November and it got surprising traction.
// // //               A friend used it for a thesis (merging a bunch of PDFs), and then
// // //               more people started sharing it.
// // //             </p>

// // //             <p>
// // //               Today, there’s a small but growing community — especially across
// // //               Pakistan, India, and Bangladesh (shoutout to the desi dev community 🙏).
// // //             </p>

// // //             <p className="text-gray-600 italic">
// // //               Built solo. Maintained continuously. Privacy-first by default.
// // //             </p>
// // //           </div>
// // //         </section>

// // //         {/* Mission Section */}
// // //         <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8">
// // //           <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-6">
// // //             Why This Exists
// // //           </h2>

// // //           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed space-y-3">
// // //             <p>
// // //               I’m not trying to build the next billion-dollar startup. I just got
// // //               tired of clunky tools that charge monthly subscriptions for basic
// // //               PDF operations.
// // //             </p>

// // //             <p>
// // //               The goal is simple: <strong>don’t waste people’s time</strong>.
// // //             </p>

// // //             <p>
// // //               Whether you’re a student submitting assignments at 2 AM, a freelancer
// // //               dealing with client files, or someone making a QR code for a café menu —
// // //               these tools should just work. Fast. Simple. Minimal friction.
// // //             </p>

// // //             <p className="text-gray-600">
// // //               And yes — I keep the site clean. No spammy popups. No weird tricks.
// // //             </p>
// // //           </div>
// // //         </section>

// // //         {/* Feature Cards */}
// // //         <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
// // //           {/* Card 1 */}
// // //           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
// // //             <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-4 p-3 rounded-xl bg-indigo-50 group-hover:scale-110 transition" />
// // //             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition">
// // //               Actually <strong>Free</strong>
// // //             </h3>
// // //             <p className="text-gray-600 text-center text-sm leading-relaxed">
// // //               No “free trial” traps. No account required. No credit card.
// // //               <br />
// // //               <br />
// // //               Use it on phone, laptop, tablet — just open the site and go.
// // //             </p>
// // //           </div>

// // //           {/* Card 2 */}
// // //           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
// // //             <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
// // //             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
// // //               Fast, <strong>Always</strong>
// // //             </h3>
// // //             <p className="text-gray-600 text-center text-sm leading-relaxed">
// // //               Most tools finish quickly — because waiting for simple tasks is painful.
// // //               <br />
// // //               <br />
// // //               Merging PDFs, compressing files, converting formats — built to be snappy.
// // //             </p>
// // //           </div>

// // //           {/* Card 3 */}
// // //           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
// // //             <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
// // //             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
// // //               Your Files Stay <strong>Yours</strong>
// // //             </h3>
// // //             <p className="text-gray-600 text-center text-sm leading-relaxed">
// // //               Many tools run directly in your browser — so your files aren’t sent
// // //               to random servers for processing.
// // //               <br />
// // //               <br />
// // //               If a tool requires server processing, it’s clearly disclosed in the tool page.
// // //             </p>
// // //           </div>
// // //         </section>

// // //         {/* Story Section */}
// // //         <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
// // //           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
// // //             How We Got <strong>Here</strong>
// // //           </h2>

// // //           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-3">
// // //             <p>
// // //               Started as a weekend project in <strong>October 2023</strong>. Just
// // //               me, building what I wished existed.
// // //             </p>

// // //             <p>
// // //               The first version had just a few essentials:{" "}
// // //               <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and{" "}
// // //               <strong>Compress PDF</strong>.
// // //             </p>

// // //             <p>
// // //               Then people started requesting more:
// // //               <br />
// // //               → QR Code Generator (added)
// // //               <br />
// // //               → Password Generator (added)
// // //               <br />
// // //               → Image Compression (added)
// // //             </p>

// // //             <p>
// // //               Now there are <strong>22 tools</strong> and I still ship updates
// // //               based on feedback.
// // //             </p>

// // //             <p className="text-gray-600 italic">
// // //               Got an idea or found a bug? Email{" "}
// // //               <strong>support@pdflinx.com</strong>. I read everything.
// // //             </p>
// // //           </div>
// // //         </section>
// // //       </main>
// // //     </>
// // //   );
// // // }

