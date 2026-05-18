"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";

export default function Contact() {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [topic, setTopic]         = useState("");
  const [message, setMessage]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();

      if (data?.success) {
        setIsSuccess(true);
        setName(""); setEmail(""); setTopic(""); setMessage("");
      } else {
        setErrorMsg("Oops, something went wrong. Try again?");
      }
    } catch {
      setErrorMsg("Couldn't send — maybe check your connection?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PDF Linx",
    url: "https://pdflinx.com/contact",
    description: "Get in touch with the person behind PDF Linx. Bug reports, feature requests, or just say hi.",
  };

  return (
    <>
      <Script
        id="contactpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .contact-page {
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
          color: #111111;
          min-height: 100vh;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in  { opacity: 0; animation: fadeUp .6s ease forwards; }
        .cp-d1    { animation-delay: .1s; }
        .cp-d2    { animation-delay: .2s; }
        .cp-d3    { animation-delay: .3s; }
        .cp-d4    { animation-delay: .4s; }

        /* ── EYEBROW ── */
        .cp-eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #E8380D; margin-bottom: .5rem;
        }
        .cp-eyebrow::before {
          content: ''; display: inline-block;
          width: 18px; height: 2px;
          background: #E8380D; border-radius: 2px;
        }

        /* ── DIVIDER ── */
        .cp-divider {
          border: none; border-top: 1px solid #E5E2DC;
          max-width: 1100px; margin: 0 auto;
        }

        /* ── HERO ── */
        .cp-hero {
          max-width: 860px; margin: 0 auto;
          padding: 5rem 2rem 4rem; text-align: center;
        }
        .cp-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          line-height: 1.1; color: #111; margin-bottom: 1.2rem;
        }
        .cp-hero h1 em { font-style: italic; color: #E8380D; }
        .cp-hero-sub {
          font-size: 16px; color: #3D3D3D; line-height: 1.8;
          max-width: 540px; margin: 0 auto 2rem;
        }
        .cp-pills { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .cp-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 100px; padding: 6px 14px;
          font-size: 13px; font-weight: 500; color: #3D3D3D;
        }

        /* ── GRID ── */
        .cp-grid {
          max-width: 1100px; margin: 0 auto;
          padding: 0 2rem 5rem;
          display: grid; grid-template-columns: 1.15fr 1fr;
          gap: 2rem; align-items: start;
        }

        /* ── FORM CARD ── */
        .cp-form-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 20px; padding: 2.5rem;
          position: relative; overflow: hidden;
        }
        .cp-form-card::before {
          content: ''; position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(232,56,13,.07), rgba(232,56,13,.01));
          pointer-events: none;
        }
        .cp-form-title {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem; color: #111; margin-bottom: 1.8rem;
        }
        .cp-form-title-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #FEF0ED; display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; flex-shrink: 0;
        }

        /* ── FIELDS ── */
        .cp-field { margin-bottom: 1.2rem; }
        .cp-field label {
          display: block; font-size: 12.5px; font-weight: 600;
          color: #3D3D3D; margin-bottom: 6px; letter-spacing: .01em;
        }
        .cp-input {
          width: 100%; background: #F7F5F2;
          border: 1px solid #E5E2DC; border-radius: 10px;
          padding: 11px 14px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #111;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .cp-input:focus {
          border-color: #E8380D;
          box-shadow: 0 0 0 3px rgba(232,56,13,.1);
          background: #fff;
        }
        .cp-input::placeholder { color: #bbb; }
        .cp-textarea { resize: none; height: 140px; line-height: 1.6; }
        .cp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .cp-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-color: #F7F5F2;
          padding-right: 36px;
        }

        /* ── SUBMIT BTN ── */
        .cp-submit-btn {
          width: 100%; padding: 13px;
          background: #E8380D; color: #fff;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .2s, transform .2s, box-shadow .2s;
          margin-top: 1.5rem;
        }
        .cp-submit-btn:hover:not(:disabled) {
          background: #C42D0A;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232,56,13,.3);
        }
        .cp-submit-btn:disabled { opacity: .7; cursor: not-allowed; }

        /* ── DISCLAIMER ── */
        .cp-disclaimer {
          font-size: 12px; color: #888;
          text-align: center; margin-top: 1rem; line-height: 1.6;
        }
        .cp-disclaimer a {
          color: #E8380D; text-decoration: none;
          border-bottom: 1px solid rgba(232,56,13,.3);
        }

        /* ── ERROR ── */
        .cp-error {
          font-size: 13px; color: #A32D2D;
          text-align: center; margin-top: .75rem;
          background: #FCEBEB; border-radius: 8px; padding: 10px 14px;
        }

        /* ── SUCCESS STATE ── */
        .cp-success {
          text-align: center; padding: 3rem 1.5rem;
        }
        .cp-success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
        .cp-success-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.6rem; color: #111; margin-bottom: .6rem;
        }
        .cp-success-body {
          font-size: 14px; color: #3D3D3D; line-height: 1.7;
        }

        /* ── SIDEBAR ── */
        .cp-sidebar { display: flex; flex-direction: column; gap: 16px; }

        .cp-reach-card {
          background: #fff; border: 1px solid #E5E2DC;
          border-radius: 16px; padding: 1.8rem;
          transition: box-shadow .25s, transform .25s;
        }
        .cp-reach-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,.07);
          transform: translateY(-2px);
        }
        .cp-reach-title {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Instrument Serif', serif;
          font-size: 1.15rem; color: #111; margin-bottom: 1rem;
        }
        .cp-reach-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: #FEF0ED;
          display: flex; align-items: center; justify-content: center;
          font-size: .95rem; flex-shrink: 0;
        }
        .cp-reach-body {
          font-size: 13.5px; color: #3D3D3D; line-height: 1.75; margin-bottom: .8rem;
        }
        .cp-reach-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: #E8380D;
          text-decoration: none; border-bottom: 1px solid rgba(232,56,13,.25);
          transition: gap .2s;
        }
        .cp-reach-link:hover { gap: 10px; }

        /* ── EXPECT CARD ── */
        .cp-expect-card {
          background: linear-gradient(135deg, rgba(232,56,13,.04), rgba(232,56,13,.01));
          border: 1px solid rgba(232,56,13,.12);
          border-radius: 16px; padding: 1.8rem;
        }
        .cp-expect-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.1rem; color: #111; margin-bottom: 1rem;
        }
        .cp-expect-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: #3D3D3D; line-height: 1.65;
          margin-bottom: .75rem;
        }
        .cp-expect-item:last-of-type { margin-bottom: 0; }
        .cp-expect-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #E8380D; flex-shrink: 0; margin-top: 7px;
        }
        .cp-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 1rem; }
        .cp-badge {
          font-size: 11px; font-weight: 500;
          padding: 4px 12px; border-radius: 100px;
          background: #F7F5F2; border: 1px solid #E5E2DC; color: #3D3D3D;
        }

        /* ── HUMAN NOTE (dark card) ── */
        .cp-human-note {
          background: #111; border-radius: 16px;
          padding: 1.8rem; color: rgba(255,255,255,.85);
          position: relative; overflow: hidden;
        }
        .cp-human-note::after {
          content: '☕'; position: absolute; right: 1rem; bottom: .5rem;
          font-size: 4rem; opacity: .08; pointer-events: none;
        }
        .cp-human-note-label {
          font-size: 10px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: rgba(255,255,255,.4);
          margin-bottom: .5rem;
        }
        .cp-human-note-text {
          font-family: 'Instrument Serif', serif;
          font-size: 1.05rem; font-style: italic; line-height: 1.6;
        }
        .cp-human-note-author {
          font-size: 12px; color: rgba(255,255,255,.4); margin-top: .8rem;
        }

        /* ── MADE WITH ── */
        .cp-made-with {
          text-align: center; padding: 1.5rem 2rem 3rem;
          font-size: 14px; color: #888; font-style: italic;
        }

        /* ══════════════════════════════════════
           MOBILE RESPONSIVE — max-width: 768px
        ══════════════════════════════════════ */
        @media (max-width: 768px) {

          /* Hero padding kam karo */
          .cp-hero {
            padding: 3rem 1.2rem 2.5rem;
          }

          /* Grid — 2 column se 1 column */
          .cp-grid {
            grid-template-columns: 1fr;
            padding: 0 1.2rem 3rem;
            gap: 1.2rem;
          }

          /* Form card padding kam */
          .cp-form-card {
            padding: 1.5rem;
          }

          /* Name + Email — side by side se upar neeche */
          .cp-field-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          /* Pills wrap theek se ho jayen */
          .cp-pills {
            gap: 6px;
          }
          .cp-pill {
            font-size: 12px;
            padding: 5px 12px;
          }

          /* Sidebar cards padding */
          .cp-reach-card,
          .cp-expect-card,
          .cp-human-note {
            padding: 1.3rem;
          }

          /* Made with bottom spacing */
          .cp-made-with {
            padding: 1rem 1.2rem 2rem;
          }
        }

        /* ══════════════════════════════════════
           SMALL MOBILE — max-width: 480px
        ══════════════════════════════════════ */
        @media (max-width: 480px) {

          .cp-hero h1 {
            font-size: 2rem;
          }

          .cp-hero-sub {
            font-size: 14px;
          }

          .cp-form-title {
            font-size: 1.2rem;
          }

          .cp-submit-btn {
            font-size: 14px;
            padding: 12px;
          }

          .cp-badges {
            gap: 5px;
          }
          .cp-badge {
            font-size: 10px;
            padding: 3px 10px;
          }
        }
      `}</style>

      <main className="contact-page">

        {/* ══ HERO ══ */}
        <div className="cp-hero fade-in cp-d1">
          <div className="cp-eyebrow" style={{ justifyContent: "center" }}>
            Get in touch
          </div>
          <h1>
            Hey, <em>Let's Talk!</em>
          </h1>
          <p className="cp-hero-sub">
            Got a question, suggestion, bug report, or just wanna say hi?
            I'm the guy behind PDF Linx — drop me a message.
            I read everything and reply when I can.
          </p>
          <div className="cp-pills">
            <span className="cp-pill">💬 Usually replies in 24–48h</span>
            <span className="cp-pill">🙋 Real human, not a bot</span>
            <span className="cp-pill">📬 Every message read</span>
          </div>
        </div>

        <hr className="cp-divider" />

        {/* ══ MAIN GRID ══ */}
        <div className="cp-grid">

          {/* ── FORM CARD ── */}
          <div className="cp-form-card fade-in cp-d2">

            {isSuccess ? (
              /* SUCCESS STATE */
              <div className="cp-success">
                <div className="cp-success-icon">🎉</div>
                <div className="cp-success-title">Message sent!</div>
                <p className="cp-success-body">
                  Thanks for reaching out — I'll read your message personally
                  and get back to you as soon as I can (usually within 24–48h).
                </p>
              </div>
            ) : (
              /* FORM */
              <>
                <div className="cp-form-title">
                  <div className="cp-form-title-icon">✉️</div>
                  Send me a message
                </div>

                <form onSubmit={handleSubmit}>

                  {/* Name + Email row */}
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label htmlFor="cp-name">Your Name</label>
                      <input
                        id="cp-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your Name"
                        className="cp-input"
                      />
                    </div>
                    <div className="cp-field">
                      <label htmlFor="cp-email">Email</label>
                      <input
                        id="cp-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="cp-input"
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="cp-field">
                    <label htmlFor="cp-topic">What's this about?</label>
                    <select
                      id="cp-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="cp-input cp-select"
                    >
                      <option value="" disabled>Choose a topic…</option>
                      <option value="bug">🐛 Bug report</option>
                      <option value="feature">💡 Feature request</option>
                      <option value="question">❓ General question</option>
                      <option value="partnership">🤝 Partnership / collab</option>
                      <option value="hi">💬 Just saying hi</option>
                      <option value="privacy">🔒 Privacy concern</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="cp-field">
                    <label htmlFor="cp-message">Message</label>
                    <textarea
                      id="cp-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="Hey, I love the tool… or I found a bug… or add this feature?"
                      className="cp-input cp-textarea"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cp-submit-btn"
                  >
                    <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
                    {!isSubmitting && <span>→</span>}
                  </button>

                  {/* Disclaimer */}
                  <p className="cp-disclaimer">
                    By submitting this form, you agree that PDF Linx may use your
                    name and email to respond to your request. Please review our{" "}
                    <Link href="/privacy-policy">Privacy Policy</Link>.
                  </p>

                  {/* Error */}
                  {errorMsg && (
                    <p className="cp-error">{errorMsg}</p>
                  )}

                </form>
              </>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="cp-sidebar fade-in cp-d3">

            {/* Other ways to reach */}
            <div className="cp-reach-card">
              <div className="cp-reach-title">
                <div className="cp-reach-icon">📧</div>
                Other Ways to Reach Me
              </div>
              <p className="cp-reach-body">
                Best way: Just use the form — I check it regularly.<br />
                Or email me directly at:
              </p>
              <a
                href="mailto:support&#64;pdflinx&#46;com"
                className="cp-reach-link"
              >
                support@pdflinx.com →
              </a>
              <p className="cp-reach-body" style={{ marginTop: "1rem" }}>
                I'm usually replying on evenings or weekends
                (building this solo in my free time).
              </p>
              <p style={{ fontSize: 13.5, color: "#3D3D3D", fontStyle: "italic", lineHeight: 1.65 }}>
                Seriously — feedback, ideas, bug reports, even a
                simple "thanks" — all welcome. Makes my day.
              </p>
            </div>

            {/* What I love hearing */}
            <div className="cp-expect-card">
              <div className="cp-expect-title">What I love hearing about</div>
              {[
                "Tools that broke on your file — with details if possible",
                "Features you wish existed — I've shipped many user suggestions",
                "Privacy questions — always happy to explain how tools work",
                "Success stories — seriously, these make the late nights worth it",
              ].map((item) => (
                <div key={item} className="cp-expect-item">
                  <span className="cp-expect-dot" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="cp-badges">
                {["🐛 Bug reports", "💡 Feature ideas", "🔒 Privacy Qs", "💬 Just hi", "🤝 Collabs"].map(
                  (b) => <span key={b} className="cp-badge">{b}</span>
                )}
              </div>
            </div>

            {/* Human note — dark card */}
            <div className="cp-human-note cp-d4">
              <div className="cp-human-note-label">A note from the builder</div>
              <div className="cp-human-note-text">
                "There's no support ticket system here. No AI chatbot.
                Just me reading your message with a coffee, and genuinely trying to help."
              </div>
              <div className="cp-human-note-author">— The person behind PDF Linx</div>
            </div>

          </div>
        </div>

        {/* ══ MADE WITH ══ */}
        <p className="cp-made-with">
          Made with ❤️ by a fellow PDF hater who just wanted better tools
        </p>

      </main>
    </>
  );
}























// "use client";

// import { useState } from "react";
// import { Mail, MessageSquare } from "lucide-react";

// export default function Contact() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !email || !message) return;

//     setIsSubmitting(true);
//     setStatus("Sending your message...");

//     try {
//       // ✅ Recommended: send to an API route
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, message }),
//       });

//       const data = await res.json();

//       if (data?.success) {
//         setStatus("Thanks! I got your message — I'll reply soon 😊");
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         setStatus("Oops, something went wrong. Try again?");
//       }
//     } catch (error) {
//       setStatus("Couldn't send — maybe check your connection?");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isSuccess =
//     status.toLowerCase().includes("thanks") ||
//     status.toLowerCase().includes("reply") ||
//     status.toLowerCase().includes("got your message");

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Hero Section */}
//         <section className="text-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
//             Hey, Let&apos;s Talk!
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             Got a question, suggestion, bug report, or just wanna say hi?
//             <br />
//             I&apos;m the guy behind PDF Linx — drop me a message. I read
//             everything and reply when I can.
//           </p>
//         </section>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Contact Form */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <MessageSquare className="w-6 h-6 text-indigo-600" />
//               Send me a message
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1 text-sm">
//                   Your Name
//                 </label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   placeholder="Your Name"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1 text-sm">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1 text-sm">
//                   Message
//                 </label>
//                 <textarea
//                   rows={5}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   required
//                   placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-70"
//               >
//                 {isSubmitting ? "Sending..." : "Send Message"}
//               </button>

//               {/* ✅ Privacy disclosure line */}
//               <p className="text-xs text-gray-500 text-center">
//                 By submitting this form, you agree that PDF Linx may use your
//                 name and email to respond to your request. Please review our{" "}
//                 <a
//                   href="/privacy-policy"
//                   className="text-indigo-600 hover:underline"
//                 >
//                   Privacy Policy
//                 </a>
//                 .
//               </p>

//               {status && (
//                 <p
//                   className={`text-center mt-3 font-medium text-sm ${
//                     isSuccess ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {status}
//                 </p>
//               )}
//             </form>
//           </div>

//           {/* Contact Info */}
//           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 flex flex-col justify-center">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <Mail className="w-6 h-6 text-indigo-600" />
//               Other Ways to Reach Me
//             </h2>

//             <div className="space-y-4 text-gray-700 text-base">
//               <p>Best way: Just use the form — I check it regularly.</p>
//               <p>Or email me directly at:</p>

//               {/* ✅ Fix mailto */}
//               {/* <a
//                 href="mailto:support@pdflinx.com"
//                 className="font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
//               >
//                 support@pdflinx.com
//               </a> */}
//               <a href="mailto:support&#64;pdflinx&#46;com"
//                   className="font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
//                 >
//                   support&#64;pdflinx&#46;com
//               </a>
//               <p className="mt-4">
//                 I&apos;m usually replying on evenings or weekends (building this
//                 solo in my free time).
//               </p>

//               <p className="italic text-gray-600 mt-4">
//                 Seriously — feedback, ideas, bug reports, even a simple
//                 &quot;thanks&quot; — all welcome. Makes my day.
//               </p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-gray-500 text-base italic">
//           Made with ❤️ by a fellow PDF hater who just wanted better tools
//         </p>
//       </div>
//     </main>
//   );
// }




































// // "use client";

// // import { useState } from "react";
// // import { Mail, MessageSquare } from "lucide-react";

// // export default function Contact() {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [status, setStatus] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!name || !email || !message) return;

// //     setIsSubmitting(true);
// //     setStatus("Sending your message...");

// //     try {
// //       const res = await fetch("https://pdflinx.com/contact", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ name, email, message }),
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setStatus("Thanks! I got your message — I'll reply soon 😊");
// //         setName("");
// //         setEmail("");
// //         setMessage("");
// //       } else {
// //         setStatus("Oops, something went wrong. Try again?");
// //       }
// //     } catch (error) {
// //       setStatus("Couldn't send — maybe check your connection?");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Hero Section */}
// //         <section className="text-center mb-8">
// //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// //             Hey, Let's Talk!
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
// //             Got a question, suggestion, bug report, or just wanna say hi?<br />
// //             I'm the guy behind PDF Linx — drop me a message. I read everything and reply when I can.
// //           </p>
// //         </section>

// //         <div className="grid md:grid-cols-2 gap-8">
// //           {/* Contact Form */}
// //           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
// //             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
// //               <MessageSquare className="w-6 h-6 text-indigo-600" />
// //               Send me a message
// //             </h2>

// //              <form onSubmit={handleSubmit} className="space-y-4">
// //                <div>
// //                  <label className="block text-gray-700 font-medium mb-1 text-sm">Your Name</label>
// //                  <input
// //                   type="text"
// //                   value={name}
// //                   onChange={(e) => setName(e.target.value)}
// //                   required
// //                   placeholder="Your Name"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
// //                 />
// //               </div>

// //                  <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
// //                <div>
// //                  <input
// //                   type="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   required
// //                   placeholder="you@example.com"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-gray-50"
// //                 />
// //               </div> 

// //                <div>
// //                  <label className="block text-gray-700 font-medium mb-1 text-sm">Message</label>
// //                  <textarea
// //                    rows="5"
// //                    value={message}
// //                    onChange={(e) => setMessage(e.target.value)}
// //                    required
// //                    placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
// //                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50"
// //                  />
// //                </div>

// //                <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-70"
// //               >
// //             {isSubmitting ? "Sending..." : "Send Message"}
// //                </button>

// //                {status && (
// //                 <p className={`text-center mt-3 font-medium text-sm ${status.includes("Thanks") || status.includes("got") ? "text-green-600" : "text-red-600"}`}>
// //                   {status}
// //                 </p>
// //               )}
// //             </form>
// //           </div>

// //            {/* Contact Info */}
// //            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 flex flex-col justify-center">
// //              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
// //                <Mail className="w-6 h-6 text-indigo-600" />
// //                Other Ways to Reach Me
// //              </h2>

// //              <div className="space-y-4 text-gray-700 text-base">
// //                <p>Best way: Just use the form — I check it regularly.</p>
// //                <p>Or email me directly at:</p>
// //                <a
// //                 href="mailto:ashfaqahmed@pdflinx.com"
// //                 className="font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
// //               >
// //                 support@pdflinx.com
// //               </a>
// //               <p className="mt-4">
// //                 I'm usually replying on evenings or weekends (building this solo in my free time).
// //               </p>
// //               <p className="italic text-gray-600 mt-4">
// //                  Seriously — feedback, ideas, bug reports, even a simple "thanks" — all welcome. Makes my day.
// //                </p>
// //              </div>
// //            </div>
// //          </div>

// //          <p className="text-center mt-12 text-gray-500 text-base italic">
// //            Made with ❤️ by a fellow PDF hater who just wanted better tools
// //          </p>
// //        </div>
// //      </main>
// //   );
// // }
 


















// // // "use client";

// // // import { useState } from "react";
// // // import { MessageSquare } from "lucide-react";

// // // export default function Contact() {
// // //   const [message, setMessage] = useState("");
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [status, setStatus] = useState("");

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!message.trim()) {
// // //       setStatus("Please write a message 🙂");
// // //       return;
// // //     }

// // //     setIsSubmitting(true);
// // //     setStatus("Sending your message...");

// // //     try {
// // //       const response = await fetch("https://formsubmit.co/ajax/ashfaqahmedazad@gmail.com", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Accept: "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           message: message.trim(),
// // //           // Optional: Add subject for better email organization
// // //           _subject: "New Message from PDF Linx Contact Form",
// // //           // FormSubmit will auto-add timestamp and IP if needed
// // //         }),
// // //       });

// // //       if (response.ok) {
// // //         setStatus("Message sent successfully! Thanks — I read every one 😊");
// // //         setMessage("");
// // //       } else {
// // //         setStatus("Something went wrong. Please try again.");
// // //       }
// // //     } catch (error) {
// // //       setStatus("Couldn't send — check your connection and try again.");
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
// // //       <div className="max-w-4xl mx-auto">
// // //         {/* Hero Section */}
// // //         <section className="text-center mb-12">
// // //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// // //             Get in Touch
// // //           </h1>
// // //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
// // //             Questions? Feedback? Bug reports? Feature requests?<br />
// // //             I'm the solo maker behind PDF Linx — I personally read every message.
// // //           </p>
// // //         </section>

// // //         <div className="grid md:grid-cols-2 gap-10 items-start">
// // //           {/* Contact Form */}
// // //           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // //               <MessageSquare className="w-7 h-7 text-indigo-600" />
// // //               Send a Message (100% Anonymous)
// // //             </h2>

// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //               <div>
// // //                 <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
// // //                   Your Message
// // //                 </label>
// // //                 <textarea
// // //                   id="message"
// // //                   rows="9"
// // //                   value={message}
// // //                   onChange={(e) => setMessage(e.target.value)}
// // //                   required
// // //                   placeholder="Examples:&#10;- Amazing tool! Can you add currency converter?&#10;- PDF merge fails with large files...&#10;- Please add dark mode! ❤️&#10;- Just wanted to say thank you for making this free"
// // //                   className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50 text-base leading-relaxed"
// // //                 />
// // //                 <p className="text-sm text-gray-500 mt-3">
// // //                   No name or email needed — your message reaches me privately and anonymously.
// // //                 </p>
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting}
// // //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-lg"
// // //               >
// // //                 {isSubmitting ? "Sending..." : "Send Message"}
// // //               </button>

// // //               {status && (
// // //                 <p
// // //                   className={`text-center mt-4 font-semibold text-base ${
// // //                     status.includes("successfully") || status.includes("Thanks")
// // //                       ? "text-green-600"
// // //                       : "text-red-600"
// // //                   }`}
// // //                 >
// // //                   {status}
// // //                 </p>
// // //               )}
// // //             </form>
// // //           </div>

// // //           {/* Info Panel */}
// // //           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 flex flex-col justify-center">
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-6">
// // //               Why No Email or Name?
// // //             </h2>

// // //             <div className="space-y-5 text-gray-700 text-base leading-relaxed">
// // //               <p>
// // //                 PDF Linx is made for <span className="font-semibold">everyone around the world</span> — no signups, no personal info, no barriers.
// // //               </p>
// // //               <p>
// // //                 Your privacy matters. I get your message directly in my inbox, but you stay completely anonymous.
// // //               </p>
// // //               <p className="font-medium text-indigo-700">
// // //                 Every message — praise, bugs, ideas, or just a "thanks" — truly helps and makes my day.
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <p className="text-center mt-16 text-gray-500 text-base italic">
// // //           Built with ❤️ by one person who wants great PDF tools to be free and simple — for everyone, everywhere.
// // //         </p>
// // //       </div>
// // //     </main>
// // //   );
// // // }



















// // // "use client";

// // // import { useState } from "react";
// // // import { MessageSquare } from "lucide-react";

// // // export default function Contact() {
// // //   const [message, setMessage] = useState("");
// // //   const [status, setStatus] = useState("");
// // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!message.trim()) {
// // //       setStatus("Please write something — even a quick hi! 🙂");
// // //       return;
// // //     }

// // //     setIsSubmitting(true);
// // //     setStatus("Sending your message...");

// // //     try {
// // //       const res = await fetch("https://pdflinx.com/contact", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ 
// // //           message: message.trim(),
// // //         }),
// // //       });

// // //       const data = await res.json();

// // //       if (data.success) {
// // //         setStatus("Message sent! Thanks — I read every single one 😊");
// // //         setMessage("");
// // //       } else {
// // //         setStatus("Something went wrong. Please try again?");
// // //       }
// // //     } catch (error) {
// // //       setStatus("Couldn't send — check your connection?");
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
// // //       <div className="max-w-4xl mx-auto">
// // //         {/* Hero */}
// // //         <section className="text-center mb-12">
// // //           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
// // //             Get in Touch
// // //           </h1>
// // //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
// // //             Questions? Feedback? Bug reports? Feature ideas?<br />
// // //             I'm the solo developer behind PDF Linx — I personally read and appreciate every message.
// // //           </p>
// // //         </section>

// // //         <div className="grid md:grid-cols-2 gap-10 items-start">
// // //           {/* Form */}
// // //           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 order-2 md:order-1">
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // //               <MessageSquare className="w-7 h-7 text-indigo-600" />
// // //               Send a Message (Fully Anonymous)
// // //             </h2>

// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //               <div>
// // //                 <label className="block text-gray-700 font-medium mb-2">
// // //                   Your Message
// // //                 </label>
// // //                 <textarea
// // //                   rows="9"
// // //                   value={message}
// // //                   onChange={(e) => setMessage(e.target.value)}
// // //                   required
// // //                   placeholder="Examples:&#10;- Love the PDF converter! Can you add currency conversion?&#10;- Found a bug in PDF merge when files are large...&#10;- Please add dark mode ❤️&#10;- Just wanted to say thanks for making this free!"
// // //                   className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-gray-50 text-base leading-relaxed"
// // //                 />
// // //                 <p className="text-sm text-gray-500 mt-3">
// // //                   No name, email, or signup required. Your message comes straight to me — privately and anonymously.
// // //                 </p>
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 disabled={isSubmitting}
// // //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 text-lg"
// // //               >
// // //                 {isSubmitting ? "Sending..." : "Send Message"}
// // //               </button>

// // //               {status && (
// // //                 <p className={`text-center mt-4 font-semibold text-base ${status.includes("Thanks") || status.includes("sent") ? "text-green-600" : "text-red-600"}`}>
// // //                   {status}
// // //                 </p>
// // //               )}
// // //             </form>
// // //           </div>

// // //           {/* Info Side */}
// // //           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 flex flex-col justify-center order-1 md:order-2">
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-6">
// // //               Why Keep It Anonymous?
// // //             </h2>

// // //             <div className="space-y-5 text-gray-700 text-base leading-relaxed">
// // //               <p>
// // //                 PDF Linx is built for <span className="font-semibold">everyone, everywhere</span> — no barriers, no personal info needed.
// // //               </p>
// // //               <p>
// // //                 I value your privacy as much as I value your feedback. Whether it's praise, criticism, bugs, or ideas — everything helps make this tool better.
// // //               </p>
// // //               <p className="font-medium text-indigo-700">
// // //                 Every message matters. Seriously — even a simple "thanks" brightens my day.
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <p className="text-center mt-16 text-gray-500 text-base italic">
// // //           Built with ❤️ by one person who believes great tools should be free and simple — for the whole world.
// // //         </p>
// // //       </div>
// // //     </main>
// // //   );
// // // }











































// // // // // "use client";

// // // // // import { useState } from "react";
// // // // // import { Mail, MessageSquare } from "lucide-react";

// // // // // export default function Contact() {
// // // // //   const [name, setName] = useState("");
// // // // //   const [email, setEmail] = useState("");
// // // // //   const [message, setMessage] = useState("");
// // // // //   const [status, setStatus] = useState("");
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!name || !email || !message) return;

// // // // //     setIsSubmitting(true);
// // // // //     setStatus("Sending your message...");

// // // // //     try {
// // // // //       const res = await fetch("https://pdflinx.com/contact", {
// // // // //         method: "POST",
// // // // //         headers: { "Content-Type": "application/json" },
// // // // //         body: JSON.stringify({ name, email, message }),
// // // // //       });

// // // // //       const data = await res.json();

// // // // //       if (data.success) {
// // // // //         setStatus("Thanks! I got your message — I'll reply soon 😊");
// // // // //         setName("");
// // // // //         setEmail("");
// // // // //         setMessage("");
// // // // //       } else {
// // // // //         setStatus("Oops, something went wrong. Try again?");
// // // // //       }
// // // // //     } catch (error) {
// // // // //       setStatus("Couldn't send — maybe check your connection?");
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-6">
// // // // //       <div className="max-w-5xl mx-auto">
// // // // //         {/* Hero Section */}
// // // // //         <section className="text-center mb-16">
// // // // //           <h1 className="text-4xl md:text-5xl font-black mb-6 text-indigo-900">
// // // // //             Hey, Let's Talk!
// // // // //           </h1>
// // // // //           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
// // // // //             Got a question, suggestion, bug report, or just wanna say hi?<br />
// // // // //             I'm the guy behind PDF Linx — drop me a message. I read everything and reply when I can.
// // // // //           </p>
// // // // //         </section>

// // // // //         <div className="grid md:grid-cols-2 gap-10">
// // // // //           {/* Contact Form */}
// // // // //           <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10">
// // // // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // // // //               <MessageSquare className="w-8 h-8 text-indigo-600" />
// // // // //               Send me a message
// // // // //             </h2>

// // // // //             <form onSubmit={handleSubmit} className="space-y-6">
// // // // //               <div>
// // // // //                 <label className="block text-gray-700 font-medium mb-2">Your Name</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={name}
// // // // //                   onChange={(e) => setName(e.target.value)}
// // // // //                   required
// // // // //                   placeholder="Ashfaq"
// // // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
// // // // //                 />
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label className="block text-gray-700 font-medium mb-2">Email</label>
// // // // //                 <input
// // // // //                   type="email"
// // // // //                   value={email}
// // // // //                   onChange={(e) => setEmail(e.target.value)}
// // // // //                   required
// // // // //                   placeholder="you@example.com"
// // // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
// // // // //                 />
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label className="block text-gray-700 font-medium mb-2">Message</label>
// // // // //                 <textarea
// // // // //                   rows="6"
// // // // //                   value={message}
// // // // //                   onChange={(e) => setMessage(e.target.value)}
// // // // //                   required
// // // // //                   placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
// // // // //                   className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none bg-white/70"
// // // // //                 />
// // // // //               </div>

// // // // //               <button
// // // // //                 type="submit"
// // // // //                 disabled={isSubmitting}
// // // // //                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
// // // // //               >
// // // // //                 {isSubmitting ? "Sending..." : "Send Message"}
// // // // //               </button>

// // // // //               {status && (
// // // // //                 <p className={`text-center mt-4 font-medium ${status.includes("Thanks") || status.includes("got") ? "text-green-600" : "text-red-600"}`}>
// // // // //                   {status}
// // // // //                 </p>
// // // // //               )}
// // // // //             </form>
// // // // //           </div>

// // // // //           {/* Contact Info */}
// // // // //           <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10 flex flex-col justify-center">
// // // // //             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// // // // //               <Mail className="w-8 h-8 text-indigo-600" />
// // // // //               Other Ways to Reach Me
// // // // //             </h2>

// // // // //             <div className="space-y-5 text-gray-700">
// // // // //               <p className="text-lg">
// // // // //                 Best way: Just use the form — I check it regularly.
// // // // //               </p>
// // // // //               <p className="text-lg">
// // // // //                 Or email me directly at:
// // // // //               </p>
// // // // //               <a
// // // // //                 href="mailto:ashfaqahmed@pdflinx.com"
// // // // //                 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
// // // // //               >
// // // // //                 ashfaqahmed@pdflinx.com
// // // // //               </a>
// // // // //               <p className="text-lg mt-6">
// // // // //                 I'm usually replying on evenings or weekends (building this solo in my free time).
// // // // //               </p>
// // // // //               <p className="text-base italic text-gray-600 mt-6">
// // // // //                 Seriously — feedback, ideas, bug reports, even a simple "thanks" — all welcome. Makes my day.
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* <p className="text-center mt-16 text-gray-500 text-sm">
// // // // //           Made with ❤️ from Karachi, Pakistan
// // // // //         </p> */}

// // // // //         <p className="text-center mt-16 text-gray-500 text-base italic">
// // // // //           Made with ❤️ by a fellow PDF hater who just wanted better tools
// // // // //         </p>
// // // // //       </div>
// // // // //     </main>
// // // // //   );
// // // // // }













// // // // // // "use client";

// // // // // // import { useState } from "react";

// // // // // // export default function Contact() {
// // // // // //   const [name, setName] = useState("");
// // // // // //   const [email, setEmail] = useState("");
// // // // // //   const [message, setMessage] = useState("");
// // // // // //   const [status, setStatus] = useState("");

// // // // // //   const handleSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     setStatus("Sending...");

// // // // // //     try {
// // // // // //       const res = await fetch("https://pdflinx.com/contact", {
// // // // // //         method: "POST",
// // // // // //         headers: {
// // // // // //           "Content-Type": "application/json",
// // // // // //         },
// // // // // //         body: JSON.stringify({ name, email, message }),
// // // // // //       });

// // // // // //       const data = await res.json();

// // // // // //       if (data.success) {
// // // // // //         setStatus("Message Sent Successfully!");
// // // // // //         setName("");
// // // // // //         setEmail("");
// // // // // //         setMessage("");
// // // // // //       } else {
// // // // // //         setStatus("Failed to send message. Try again.");
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       setStatus("Error connecting to server.");
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <main className="max-w-5xl mx-auto py-12 px-6">
// // // // // //       {/* Page Header */}
// // // // // //       <section className="text-center mb-12">

// // // // // //         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
// // // // // //         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
// // // // // //           Have questions or feedback? We're here to help. Fill out the form below
// // // // // //           or reach us directly via email.
// // // // // //         </p>

// // // // // //       </section>

// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // // // //         {/* Contact Form */}
// // // // // //         <div className="bg-white shadow-lg rounded-lg p-6">
// // // // // //           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>

// // // // // //           <form onSubmit={handleSubmit} className="space-y-4">
// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Name</label>
// // // // // //               <input
// // // // // //                 type="text"
// // // // // //                 value={name}
// // // // // //                 onChange={(e) => setName(e.target.value)}
// // // // // //                 required
// // // // // //                 placeholder="Your Name"
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               />
// // // // // //             </div>

// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Email</label>
// // // // // //               <input
// // // // // //                 type="email"
// // // // // //                 value={email}
// // // // // //                 onChange={(e) => setEmail(e.target.value)}
// // // // // //                 required
// // // // // //                 placeholder="you@example.com"
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               />
// // // // // //             </div>

// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Message</label>
// // // // // //               <textarea
// // // // // //                 rows="5"
// // // // // //                 value={message}
// // // // // //                 onChange={(e) => setMessage(e.target.value)}
// // // // // //                 required
// // // // // //                 placeholder="Write your message..."
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               ></textarea>
// // // // // //             </div>

// // // // // //             <button
// // // // // //               type="submit"
// // // // // //               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
// // // // // //             >
// // // // // //               Send Message
// // // // // //             </button>
// // // // // //           </form>

// // // // // //           {status && (
// // // // // //             <p className="mt-4 text-center text-green-600 font-medium">{status}</p>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         {/* Contact Info */}
// // // // // //         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
// // // // // //           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
// // // // // //           <p className="text-gray-700 mb-4">
// // // // // //             You can also reach out to us via the following contact details:
// // // // // //           </p>
// // // // // //           <ul className="space-y-3 text-gray-700">
// // // // // //             <li>
// // // // // //               <span className="font-medium">📧 Email:</span> ashfaqahmed@pdflinx.com
// // // // // //             </li>
// // // // // //             <li>
// // // // // //               {/* <span className="font-medium">📍 Address:</span> Karachi, Pakistan */}
// // // // // //             </li>
// // // // // //             <li>
// // // // // //               {/* <span className="font-medium">☎ Phone:</span> +92 3332758958 */}
// // // // // //             </li>
// // // // // //           </ul>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </main>
// // // // // //   );
// // // // // // }



























// // // // // // "use client";

// // // // // // export default function Contact() {
// // // // // //   return (
// // // // // //     <main className="max-w-5xl mx-auto py-12 px-6">
// // // // // //       {/* Page Header */}
// // // // // //       <section className="text-center mb-12">
// // // // // //         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
// // // // // //         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
// // // // // //           Have questions or feedback? We're here to help. Fill out the form below
// // // // // //           or reach us directly via email.
// // // // // //         </p>
// // // // // //       </section>

// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // // // //         {/* Contact Form */}
// // // // // //         <div className="bg-white shadow-lg rounded-lg p-6">
// // // // // //           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
// // // // // //           <form className="space-y-4">
// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Name</label>
// // // // // //               <input
// // // // // //                 type="text"
// // // // // //                 placeholder="Your Name"
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               />
// // // // // //             </div>
// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Email</label>
// // // // // //               <input
// // // // // //                 type="email"
// // // // // //                 placeholder="you@example.com"
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               />
// // // // // //             </div>
// // // // // //             <div>
// // // // // //               <label className="block text-gray-700 font-medium mb-1">Message</label>
// // // // // //               <textarea
// // // // // //                 rows="5"
// // // // // //                 placeholder="Write your message..."
// // // // // //                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
// // // // // //               ></textarea>
// // // // // //             </div>
// // // // // //             <button
// // // // // //               type="submit"
// // // // // //               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
// // // // // //             >
// // // // // //               Send Message
// // // // // //             </button>
// // // // // //           </form>
// // // // // //         </div>

// // // // // //         {/* Contact Info */}
// // // // // //         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
// // // // // //           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
// // // // // //           <p className="text-gray-700 mb-4">
// // // // // //             You can also reach out to us via the following contact details:
// // // // // //           </p>
// // // // // //           <ul className="space-y-3 text-gray-700">
// // // // // //             <li>
// // // // // //               <span className="font-medium">📧 Email:</span> @pdflinx.com
// // // // // //             </li>
// // // // // //             <li>
// // // // // //               <span className="font-medium">📍 Address:</span> Karachi, Pakistan
// // // // // //             </li>
// // // // // //             <li>
// // // // // //               <span className="font-medium">☎ Phone:</span> +92 3332758958
// // // // // //             </li>
// // // // // //           </ul>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </main>
// // // // // //   );
// // // // // // }
