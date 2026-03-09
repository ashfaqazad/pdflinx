// app/embed-code/page.jsx
// pdflinx.com/embed-code

"use client";
import { useState } from "react";
import { Syne, DM_Sans } from "next/font/google";
import styles from "./embed-code.module.css";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const TOOLS = [
  { id: "compress-pdf", label: "Compress PDF",  icon: "🗜️" },
  { id: "merge-pdf",    label: "Merge PDF",      icon: "🔗" },
  { id: "split-pdf",    label: "Split PDF",      icon: "✂️" },
  { id: "pdf-to-word",  label: "PDF to Word",    icon: "📝" },
  { id: "word-to-pdf",  label: "Word to PDF",    icon: "📄" },
  { id: "jpg-to-pdf",   label: "JPG to PDF",     icon: "🖼️" },
  { id: "pdf-to-jpg",   label: "PDF to JPG",     icon: "🗃️" },
];

const MODES = [
  { id: "normal",  label: "Normal",  desc: "680px — Article / Blog page",  compact: false },
  { id: "compact", label: "Sidebar", desc: "340px — Sidebar / Widget area", compact: true  },
];

function getIframeCode(tool, compact) {
  const src = `https://pdflinx.com/embed/${tool}${compact ? "?compact=true" : ""}`;
  const width  = compact ? "340" : "680";
  const height = compact ? "380" : "480";
  return `<iframe
  src="${src}"
  width="${width}"
  height="${height}"
  style="border:none; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.10);"
  loading="lazy"
  title="PDF Tool by PDFLinx"
></iframe>`;
}

function getReactCode(tool, compact) {
  return `// 1. Download component from pdflinx.com/embed-code
// 2. Place it in: components/embeds/PDFLinxEmbedWrapper.jsx
// 3. Use it anywhere in your project:

import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";

export default function YourPage() {
  return (
    <div>
      <h2>Free PDF Tool</h2>
      <PDFLinxEmbedWrapper
        tool="${tool}"${compact ? "\n        compact={true}" : ""}
      />
    </div>
  );
}`;
}

export default function EmbedCodePage() {
  const [selectedTool, setSelectedTool] = useState("compress-pdf");
  const [selectedMode, setSelectedMode] = useState("normal");
  const [activeTab,    setActiveTab]    = useState("html");
  const [copied,       setCopied]       = useState(false);

  const isCompact   = selectedMode === "compact";
  const iframeCode  = getIframeCode(selectedTool, isCompact);
  const reactCode   = getReactCode(selectedTool, isCompact);
  const displayCode = activeTab === "html" ? iframeCode : reactCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // <div className={`${styles.page} ${dmSans.className} ${syne.variable}`}>
    // <div className={`${styles.page} ${dmSans.className} ${syne.variable} ${syne.className}`}>

<div className={`${styles.page} ${dmSans.className} ${syne.variable} ${syne.className} embed-code-page`}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.badge}>⚡ Free Embed</div>

        <h1 className={`${styles.title} ${syne.className}`}>
          Add PDF Tools to<br />
          <span className={styles.titleAccent}>Your Website Free</span>
        </h1>
        
        <p className={styles.subtitle}>
          Pick a tool, choose your layout, copy the code — paste it anywhere.
          Works on HTML, WordPress, React, Next.js, and more.
        </p>
      </div>

      {/* ── Main Card ── */}
      <div className={styles.card}>

        {/* Step 1 — Tool */}
        <div className={styles.section}>
          <div className={styles.label}>Step 1 — Choose Tool</div>
          <div className={styles.pills}>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`${styles.pill} ${selectedTool === t.id ? styles.pillActive : ""}`}
                onClick={() => setSelectedTool(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Layout */}
        <div className={styles.section}>
          <div className={styles.label}>Step 2 — Choose Layout</div>
          <div className={styles.pills}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`${styles.pill} ${styles.modePill} ${selectedMode === m.id ? styles.pillActive : ""}`}
                onClick={() => setSelectedMode(m.id)}
              >
                <span className={styles.modeTitle}>{m.label}</span>
                <span className={styles.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Preview */}
        <div className={styles.preview}>
          <span className={styles.previewLabel}>Preview Size</span>
          <div className={styles.sizeChip}>
            <div className={styles.sizeDot} />
            Width: <strong>{isCompact ? "340px" : "680px"}</strong>
            &nbsp;·&nbsp;
            Height: <strong>{isCompact ? "380px" : "480px"}</strong>
            &nbsp;·&nbsp;
            Mode: <strong>{isCompact ? "Sidebar" : "Normal"}</strong>
          </div>
        </div>

        {/* Step 3 — Code */}
        <div>
          <div className={styles.codeHeader}>
            <div className={styles.labelNoMargin}>Step 3 — Copy Code</div>
            <div className={styles.codeHeaderRight}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === "html" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("html")}
                >
                  HTML / iframe
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "react" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("react")}
                >
                  React / Next.js
                </button>
              </div>
              <button
                className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className={styles.pre}>{displayCode}</pre>
        </div>

        {/* React download note */}
        {activeTab === "react" && (
          <div className={styles.reactNote}>
            <div>
              <p className={styles.reactNoteTitle}>📦 React Component File</p>
              <p className={styles.reactNoteDesc}>
                Download{" "}
                <code className={styles.reactNoteCode}>PDFLinxEmbedWrapper.jsx</code>
                {" "}and place it in your project
              </p>
            </div>
            <a
              href="/downloads/PDFLinxEmbedWrapper.jsx"
              download
              className={styles.downloadBtn}
            >
              ↓ Download Component
            </a>
          </div>
        )}

      </div>

      {/* Footer note */}
      <p className={styles.footerNote}>
        Free forever · No API key needed · Works on any website
      </p>

    </div>
  );
}






















// // app/embed-code/page.jsx
// // pdflinx.com/embed-code

// "use client";
// import { useState } from "react";
// import styles from "./embed-code.module.css";

// const TOOLS = [
//   { id: "compress-pdf", label: "Compress PDF",  icon: "🗜️" },
//   { id: "merge-pdf",    label: "Merge PDF",      icon: "🔗" },
//   { id: "split-pdf",    label: "Split PDF",      icon: "✂️" },
//   { id: "pdf-to-word",  label: "PDF to Word",    icon: "📝" },
//   { id: "word-to-pdf",  label: "Word to PDF",    icon: "📄" },
//   { id: "jpg-to-pdf",   label: "JPG to PDF",     icon: "🖼️" },
//   { id: "pdf-to-jpg",   label: "PDF to JPG",     icon: "🗃️" },
// ];

// const MODES = [
//   { id: "normal",  label: "Normal",  desc: "680px — Article / Blog page",  compact: false },
//   { id: "compact", label: "Sidebar", desc: "340px — Sidebar / Widget area", compact: true  },
// ];

// function getIframeCode(tool, compact) {
//   const src = `https://pdflinx.com/embed/${tool}${compact ? "?compact=true" : ""}`;
//   const width  = compact ? "340" : "680";
//   const height = compact ? "380" : "480";
//   return `<iframe
//   src="${src}"
//   width="${width}"
//   height="${height}"
//   style="border:none; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.10);"
//   loading="lazy"
//   title="PDF Tool by PDFLinx"
// ></iframe>`;
// }

// function getReactCode(tool, compact) {
//   return `// 1. Download component from pdflinx.com/embed-code
// // 2. Place it in: components/embeds/PDFLinxEmbedWrapper.jsx
// // 3. Use it anywhere in your project:

// import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";

// export default function YourPage() {
//   return (
//     <div>
//       <h2>Free PDF Tool</h2>
//       <PDFLinxEmbedWrapper
//         tool="${tool}"${compact ? "\n        compact={true}" : ""}
//       />
//     </div>
//   );
// }`;
// }

// export default function EmbedCodePage() {
//   const [selectedTool, setSelectedTool] = useState("compress-pdf");
//   const [selectedMode, setSelectedMode] = useState("normal");
//   const [activeTab,    setActiveTab]    = useState("html");
//   const [copied,       setCopied]       = useState(false);

//   const isCompact   = selectedMode === "compact";
//   const iframeCode  = getIframeCode(selectedTool, isCompact);
//   const reactCode   = getReactCode(selectedTool, isCompact);
//   const displayCode = activeTab === "html" ? iframeCode : reactCode;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(displayCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className={styles.page}>

//       {/* ── Hero ── */}
//       <div className={styles.hero}>
//         <div className={styles.badge}>⚡ Free Embed</div>
//         <h1 className={styles.title}>
//           Add PDF Tools to<br />
//           <span className={styles.titleAccent}>Your Website Free</span>
//         </h1>
//         <p className={styles.subtitle}>
//           Pick a tool, choose your layout, copy the code — paste it anywhere.
//           Works on HTML, WordPress, React, Next.js, and more.
//         </p>
//       </div>

//       {/* ── Main Card ── */}
//       <div className={styles.card}>

//         {/* Step 1 — Tool */}
//         <div className={styles.section}>
//           <div className={styles.label}>Step 1 — Choose Tool</div>
//           <div className={styles.pills}>
//             {TOOLS.map((t) => (
//               <button
//                 key={t.id}
//                 className={`${styles.pill} ${selectedTool === t.id ? styles.pillActive : ""}`}
//                 onClick={() => setSelectedTool(t.id)}
//               >
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Step 2 — Layout */}
//         <div className={styles.section}>
//           <div className={styles.label}>Step 2 — Choose Layout</div>
//           <div className={styles.pills}>
//             {MODES.map((m) => (
//               <button
//                 key={m.id}
//                 className={`${styles.pill} ${styles.modePill} ${selectedMode === m.id ? styles.pillActive : ""}`}
//                 onClick={() => setSelectedMode(m.id)}
//               >
//                 <span className={styles.modeTitle}>{m.label}</span>
//                 <span className={styles.modeDesc}>{m.desc}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Size Preview */}
//         <div className={styles.preview}>
//           <span className={styles.previewLabel}>Preview Size</span>
//           <div className={styles.sizeChip}>
//             <div className={styles.sizeDot} />
//             Width: <strong>{isCompact ? "340px" : "680px"}</strong>
//             &nbsp;·&nbsp;
//             Height: <strong>{isCompact ? "380px" : "480px"}</strong>
//             &nbsp;·&nbsp;
//             Mode: <strong>{isCompact ? "Sidebar" : "Normal"}</strong>
//           </div>
//         </div>

//         {/* Step 3 — Code */}
//         <div>
//           <div className={styles.codeHeader}>
//             <div className={styles.labelNoMargin}>Step 3 — Copy Code</div>
//             <div className={styles.codeHeaderRight}>
//               <div className={styles.tabs}>
//                 <button
//                   className={`${styles.tab} ${activeTab === "html" ? styles.tabActive : ""}`}
//                   onClick={() => setActiveTab("html")}
//                 >
//                   HTML / iframe
//                 </button>
//                 <button
//                   className={`${styles.tab} ${activeTab === "react" ? styles.tabActive : ""}`}
//                   onClick={() => setActiveTab("react")}
//                 >
//                   React / Next.js
//                 </button>
//               </div>
//               <button
//                 className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
//                 onClick={handleCopy}
//               >
//                 {copied ? "✓ Copied!" : "Copy"}
//               </button>
//             </div>
//           </div>
//           <pre className={styles.pre}>{displayCode}</pre>
//         </div>

//         {/* React download note */}
//         {activeTab === "react" && (
//           <div className={styles.reactNote}>
//             <div>
//               <p className={styles.reactNoteTitle}>📦 React Component File</p>
//               <p className={styles.reactNoteDesc}>
//                 Download{" "}
//                 <code className={styles.reactNoteCode}>PDFLinxEmbedWrapper.jsx</code>
//                 {" "}and place it in your project
//               </p>
//             </div>
//             <a
//               href="/downloads/PDFLinxEmbedWrapper.jsx"
//               download
//               className={styles.downloadBtn}
//             >
//               ↓ Download Component
//             </a>
//           </div>
//         )}

//       </div>

//       {/* Footer note */}
//       <p className={styles.footerNote}>
//         Free forever · No API key needed · Works on any website
//       </p>

//     </div>
//   );
// }
























// // // app/embed-code/page.jsx
// // // pdflinx.com/embed-code

// // "use client";
// // import { useState } from "react";

// // const TOOLS = [
// //   { id: "compress-pdf", label: "Compress PDF", icon: "🗜️" },
// //   { id: "merge-pdf",    label: "Merge PDF",    icon: "🔗" },
// //   { id: "split-pdf",    label: "Split PDF",    icon: "✂️" },
// // ];

// // const MODES = [
// //   { id: "normal",  label: "Normal",  desc: "680px — Article / Blog page",  compact: false },
// //   { id: "compact", label: "Sidebar", desc: "340px — Sidebar / Widget area", compact: true  },
// // ];

// // function getIframeCode(tool, compact) {
// //   const src = `https://pdflinx.com/embed/${tool}${compact ? "?compact=true" : ""}`;
// //   const width = compact ? "340" : "680";
// //   const height = compact ? "380" : "480";
// //   return `<iframe
// //   src="${src}"
// //   width="${width}"
// //   height="${height}"
// //   style="border:none; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.10);"
// //   loading="lazy"
// //   title="PDF Tool by PDFLinx"
// // ></iframe>`;
// // }

// // function getReactCode(tool, compact) {
// //   return `// 1. Download component from pdflinx.com/embed-code
// // // 2. Place it in: components/embeds/PDFLinxEmbedWrapper.jsx
// // // 3. Use it anywhere:

// // import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";

// // export default function YourPage() {
// //   return (
// //     <div>
// //       <h2>Compress PDF Online</h2>
// //       <PDFLinxEmbedWrapper${compact ? ' compact={true}' : ''} />
// //     </div>
// //   );
// // }`;
// // }

// // export default function EmbedCodePage() {
// //   const [selectedTool, setSelectedTool] = useState("compress-pdf");
// //   const [selectedMode, setSelectedMode] = useState("normal");
// //   const [activeTab, setActiveTab]       = useState("html");
// //   const [copied, setCopied]             = useState(false);

// //   const isCompact = selectedMode === "compact";
// //   const iframeCode = getIframeCode(selectedTool, isCompact);
// //   const reactCode  = getReactCode(selectedTool, isCompact);
// //   const displayCode = activeTab === "html" ? iframeCode : reactCode;

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(displayCode);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

// //         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// //         .ec-page {
// //           min-height: 100vh;
// //           background: #f0f4ff;
// //           font-family: 'DM Sans', system-ui, sans-serif;
// //           padding: 48px 16px 80px;
// //         }

// //         .ec-hero {
// //           text-align: center;
// //           margin-bottom: 48px;
// //         }

// //         .ec-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 6px;
// //           background: #e0e9ff;
// //           color: #3b5bdb;
// //           font-size: 12px;
// //           font-weight: 600;
// //           padding: 5px 14px;
// //           border-radius: 20px;
// //           margin-bottom: 16px;
// //           letter-spacing: 0.5px;
// //           text-transform: uppercase;
// //         }

// //         .ec-title {
// //           font-family: 'Syne', sans-serif;
// //           font-size: clamp(28px, 5vw, 48px);
// //           font-weight: 800;
// //           color: #0f172a;
// //           line-height: 1.15;
// //           margin-bottom: 14px;
// //         }

// //         .ec-title span {
// //           background: linear-gradient(90deg, #2563eb, #14b8a6);
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //         }

// //         .ec-subtitle {
// //           color: #64748b;
// //           font-size: 16px;
// //           max-width: 520px;
// //           margin: 0 auto;
// //           line-height: 1.6;
// //         }

// //         .ec-card {
// //           background: #fff;
// //           border-radius: 24px;
// //           box-shadow: 0 8px 40px rgba(0,0,0,0.07);
// //           border: 1px solid #e2e8f0;
// //           max-width: 780px;
// //           margin: 0 auto;
// //           overflow: hidden;
// //         }

// //         .ec-section {
// //           padding: 28px 32px;
// //           border-bottom: 1px solid #f1f5f9;
// //         }

// //         .ec-section:last-child { border-bottom: none; }

// //         .ec-label {
// //           font-size: 11px;
// //           font-weight: 700;
// //           text-transform: uppercase;
// //           letter-spacing: 1px;
// //           color: #94a3b8;
// //           margin-bottom: 14px;
// //         }

// //         .ec-pills {
// //           display: flex;
// //           flex-wrap: wrap;
// //           gap: 10px;
// //         }

// //         .ec-pill {
// //           display: flex;
// //           align-items: center;
// //           gap: 7px;
// //           padding: 9px 18px;
// //           border-radius: 10px;
// //           border: 2px solid #e2e8f0;
// //           background: #f8fafc;
// //           font-size: 14px;
// //           font-weight: 500;
// //           color: #475569;
// //           cursor: pointer;
// //           transition: all 0.15s;
// //           font-family: inherit;
// //         }

// //         .ec-pill:hover {
// //           border-color: #93c5fd;
// //           background: #eff6ff;
// //           color: #2563eb;
// //         }

// //         .ec-pill.active {
// //           border-color: #2563eb;
// //           background: #eff6ff;
// //           color: #2563eb;
// //           font-weight: 600;
// //         }

// //         .ec-mode-pill {
// //           flex-direction: column;
// //           align-items: flex-start;
// //           padding: 12px 18px;
// //           gap: 3px;
// //         }

// //         .ec-mode-pill .mode-title {
// //           font-size: 14px;
// //           font-weight: 600;
// //         }

// //         .ec-mode-pill .mode-desc {
// //           font-size: 11px;
// //           color: #94a3b8;
// //           font-weight: 400;
// //         }

// //         .ec-mode-pill.active .mode-desc { color: #60a5fa; }

// //         /* Code block */
// //         .ec-code-header {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           padding: 16px 20px 0;
// //         }

// //         .ec-tabs {
// //           display: flex;
// //           gap: 4px;
// //           background: #f1f5f9;
// //           padding: 4px;
// //           border-radius: 10px;
// //         }

// //         .ec-tab {
// //           padding: 6px 16px;
// //           border-radius: 7px;
// //           border: none;
// //           background: transparent;
// //           font-size: 12px;
// //           font-weight: 600;
// //           color: #94a3b8;
// //           cursor: pointer;
// //           transition: all 0.15s;
// //           font-family: inherit;
// //         }

// //         .ec-tab.active {
// //           background: #fff;
// //           color: #0f172a;
// //           box-shadow: 0 1px 4px rgba(0,0,0,0.08);
// //         }

// //         .ec-copy-btn {
// //           display: flex;
// //           align-items: center;
// //           gap: 6px;
// //           padding: 7px 16px;
// //           border-radius: 8px;
// //           border: none;
// //           background: ${copied => copied ? "#dcfce7" : "#0f172a"};
// //           color: #fff;
// //           font-size: 12px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           font-family: inherit;
// //         }

// //         .ec-copy-btn.copied {
// //           background: #dcfce7 !important;
// //           color: #16a34a !important;
// //         }

// //         .ec-copy-btn:not(.copied) {
// //           background: #0f172a;
// //           color: #fff;
// //         }

// //         .ec-copy-btn:hover:not(.copied) { background: #1e293b; }

// //         .ec-pre {
// //           background: #0f172a;
// //           color: #e2e8f0;
// //           font-family: 'Fira Code', 'Cascadia Code', monospace;
// //           font-size: 13px;
// //           line-height: 1.7;
// //           padding: 20px;
// //           margin: 14px 20px 20px;
// //           border-radius: 12px;
// //           overflow-x: auto;
// //           white-space: pre;
// //         }

// //         /* Preview */
// //         .ec-preview {
// //           background: #f8fafc;
// //           border-radius: 12px;
// //           padding: 20px;
// //           margin: 0 32px 28px;
// //           border: 1px dashed #cbd5e1;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           min-height: 80px;
// //           position: relative;
// //         }

// //         .ec-preview-label {
// //           position: absolute;
// //           top: -10px;
// //           left: 16px;
// //           background: #f8fafc;
// //           font-size: 10px;
// //           font-weight: 700;
// //           text-transform: uppercase;
// //           letter-spacing: 1px;
// //           color: #94a3b8;
// //           padding: 0 6px;
// //         }

// //         .ec-size-chip {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 8px;
// //           background: #fff;
// //           border: 1px solid #e2e8f0;
// //           border-radius: 8px;
// //           padding: 8px 16px;
// //           font-size: 13px;
// //           color: #475569;
// //           font-weight: 500;
// //         }

// //         .ec-size-dot {
// //           width: 8px;
// //           height: 8px;
// //           border-radius: 50%;
// //           background: #14b8a6;
// //         }

// //         /* Download React btn */
// //         .ec-download-btn {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 8px;
// //           background: linear-gradient(90deg, #2563eb, #14b8a6);
// //           color: #fff;
// //           text-decoration: none;
// //           font-size: 13px;
// //           font-weight: 700;
// //           padding: 10px 22px;
// //           border-radius: 10px;
// //           transition: opacity 0.2s;
// //           font-family: inherit;
// //           border: none;
// //           cursor: pointer;
// //         }

// //         .ec-download-btn:hover { opacity: 0.88; }

// //         @media (max-width: 600px) {
// //           .ec-section { padding: 20px 18px; }
// //           .ec-pre { margin: 14px 14px 20px; font-size: 11px; }
// //           .ec-preview { margin: 0 18px 20px; }
// //         }
// //       `}</style>

// //       <div className="ec-page">

// //         {/* Hero */}
// //         <div className="ec-hero">
// //           <div className="ec-badge">⚡ Free Embed</div>
// //           <h1 className="ec-title">
// //             Add PDF Tools to<br /><span>Your Website Free</span>
// //           </h1>
// //           <p className="ec-subtitle">
// //             Pick a tool, choose your layout, copy the code — paste it anywhere.
// //             Works on HTML, WordPress, React, Next.js, and more.
// //           </p>
// //         </div>

// //         {/* Main Card */}
// //         <div className="ec-card">

// //           {/* Step 1 - Tool */}
// //           <div className="ec-section">
// //             <div className="ec-label">Step 1 — Choose Tool</div>
// //             <div className="ec-pills">
// //               {TOOLS.map(t => (
// //                 <button
// //                   key={t.id}
// //                   className={`ec-pill ${selectedTool === t.id ? "active" : ""}`}
// //                   onClick={() => setSelectedTool(t.id)}
// //                 >
// //                   {t.icon} {t.label}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Step 2 - Mode */}
// //           <div className="ec-section">
// //             <div className="ec-label">Step 2 — Choose Layout</div>
// //             <div className="ec-pills">
// //               {MODES.map(m => (
// //                 <button
// //                   key={m.id}
// //                   className={`ec-pill ec-mode-pill ${selectedMode === m.id ? "active" : ""}`}
// //                   onClick={() => setSelectedMode(m.id)}
// //                 >
// //                   <span className="mode-title">{m.label}</span>
// //                   <span className="mode-desc">{m.desc}</span>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Size Preview */}
// //           <div className="ec-preview">
// //             <span className="ec-preview-label">Preview Size</span>
// //             <div className="ec-size-chip">
// //               <div className="ec-size-dot" />
// //               Width: <strong>{isCompact ? "340px" : "680px"}</strong>
// //               &nbsp;·&nbsp;
// //               Height: <strong>{isCompact ? "380px" : "480px"}</strong>
// //               &nbsp;·&nbsp;
// //               Mode: <strong>{isCompact ? "Sidebar" : "Normal"}</strong>
// //             </div>
// //           </div>

// //           {/* Step 3 - Code */}
// //           <div style={{ paddingTop: "4px" }}>
// //             <div className="ec-code-header">
// //               <div className="ec-label" style={{ margin: 0 }}>Step 3 — Copy Code</div>
// //               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //                 <div className="ec-tabs">
// //                   <button className={`ec-tab ${activeTab === "html" ? "active" : ""}`} onClick={() => setActiveTab("html")}>
// //                     HTML / iframe
// //                   </button>
// //                   <button className={`ec-tab ${activeTab === "react" ? "active" : ""}`} onClick={() => setActiveTab("react")}>
// //                     React / Next.js
// //                   </button>
// //                 </div>
// //                 <button className={`ec-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
// //                   {copied ? "✓ Copied!" : "Copy"}
// //                 </button>
// //               </div>
// //             </div>
// //             <pre className="ec-pre">{displayCode}</pre>
// //           </div>

// //           {/* React download note */}
// //           {activeTab === "react" && (
// //             <div style={{
// //               margin: "0 32px 28px",
// //               background: "#f0fdf4",
// //               border: "1px solid #bbf7d0",
// //               borderRadius: "12px",
// //               padding: "14px 18px",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "space-between",
// //               flexWrap: "wrap",
// //               gap: "10px"
// //             }}>
// //               <div>
// //                 <p style={{ fontWeight: "600", fontSize: "13px", color: "#15803d", margin: "0 0 2px 0" }}>
// //                   📦 React Component File
// //                 </p>
// //                 <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
// //                   Download <code style={{ background: "#e2e8f0", padding: "1px 5px", borderRadius: "4px" }}>PDFLinxEmbedWrapper.jsx</code> and place it in your project
// //                 </p>
// //               </div>
// //               <a
// //                 href="/downloads/PDFLinxEmbedWrapper.jsx"
// //                 download
// //                 className="ec-download-btn"
// //               >
// //                 ↓ Download Component
// //               </a>
// //             </div>
// //           )}

// //         </div>

// //         {/* Bottom note */}
// //         <p style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "#94a3b8" }}>
// //           Free forever · No API key needed · Works on any website
// //         </p>

// //       </div>
// //     </>
// //   );
// // }