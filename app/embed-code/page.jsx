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
  // const src = `https://pdflinx.com/embed/${tool}${compact ? "?compact=true" : ""}`;
  const src = compact
  ? `https://pdflinx.com/embed/${tool}?compact=true&ref=embed`
  : `https://pdflinx.com/embed/${tool}?ref=embed`;

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

function getWordPressCode(tool, compact) {
  return `[pdflinx tool="${tool}"${compact ? ' layout="sidebar"' : ""}]`;
}



export default function EmbedCodePage() {
  const [selectedTool, setSelectedTool] = useState("compress-pdf");
  const [selectedMode, setSelectedMode] = useState("normal");
  const [activeTab,    setActiveTab]    = useState("html");
  const [copied,       setCopied]       = useState(false);

  const isCompact   = selectedMode === "compact";
  const iframeCode  = getIframeCode(selectedTool, isCompact);
  const reactCode   = getReactCode(selectedTool, isCompact);
  const wpCode      = getWordPressCode(selectedTool, isCompact);
  const displayCode = activeTab === "html" ? iframeCode : activeTab === "react" ? reactCode : wpCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
                <button
                  className={`${styles.tab} ${activeTab === "wordpress" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("wordpress")}
                >
                  🟦 WordPress
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

        {/* WordPress download note */}
        {activeTab === "wordpress" && (
          <div className={styles.wpNote}>
            <div className={styles.wpNoteLeft}>
              <p className={styles.wpNoteTitle}>🟦 WordPress Plugin</p>
              <p className={styles.wpNoteDesc}>
                Download the plugin ZIP, install it in WordPress, then paste the shortcode above into any page or post.
              </p>
              <div className={styles.wpSteps}>
                <div className={styles.wpStep}>
                  <span className={styles.wpStepNum}>1</span>
                  <span>Download <code className={styles.reactNoteCode}>pdflinx-embed.zip</code></span>
                </div>
                <div className={styles.wpStep}>
                  <span className={styles.wpStepNum}>2</span>
                  <span>WordPress Admin → Plugins → Add New → Upload Plugin</span>
                </div>
                <div className={styles.wpStep}>
                  <span className={styles.wpStepNum}>3</span>
                  <span>Activate → paste shortcode in any page or post</span>
                </div>
                <div className={styles.wpStep}>
                  <span className={styles.wpStepNum}>4</span>
                  <span>Or use <strong>PDFLinx Tool</strong> block in Gutenberg editor</span>
                </div>
              </div>
            </div>
            <a
              href="/downloads/pdflinx-embed.zip"
              download
              className={styles.downloadBtn}
            >
              ↓ Download Plugin
            </a>
          </div>
        )}

      </div>

      {/* How it works */}
      <section className={styles.info} aria-labelledby="embed-info-title">
        <h2 id="embed-info-title" className={styles.infoTitle}>
          How embedding PDF Linx tools works
        </h2>
        <p>
          Each tool above runs on its own page at pdflinx.com/embed/ and is
          shown on your site inside an iframe. You pick a tool and a size,
          copy the code and paste it into your page. There is nothing to
          install, no account to create and no API key to manage.
        </p>

        <h3 className={styles.infoSub}>Tools you can embed</h3>
        <p>
          Seven tools are available: Compress PDF, Merge PDF, Split PDF, PDF to
          Word, Word to PDF, JPG to PDF and PDF to JPG. They are the same tools
          visitors get on pdflinx.com, so the options and results match what
          you see on the main site.
        </p>

        <h3 className={styles.infoSub}>Choosing a size</h3>
        <p>
          <strong>Normal (680px)</strong> suits article pages and blog posts,
          where the tool can sit between paragraphs. <strong>Sidebar
          (340px)</strong> is a compact layout for widget areas and narrow
          columns. Both sizes are responsive, so they also work on phones.
        </p>

        <h3 className={styles.infoSub}>HTML, WordPress or React</h3>
        <ul className={styles.infoList}>
          <li>
            <strong>HTML / iframe:</strong> paste the generated snippet into any
            page, CMS or site builder that accepts custom HTML.
          </li>
          <li>
            <strong>WordPress:</strong> install the plugin, then use the
            shortcode, for example <code>[pdflinx tool=&quot;compress-pdf&quot;]</code>,
            or add the PDFLinx Tool block in the Gutenberg editor.
          </li>
          <li>
            <strong>React / Next.js:</strong> download the wrapper component and
            render it with the tool name and the compact option.
          </li>
        </ul>

        <h3 className={styles.infoSub}>Files and privacy</h3>
        <p>
          An embedded tool runs the same code as the PDF Linx website. Depending
          on the tool, a visitor&apos;s file is processed in their browser or sent to
          PDF Linx servers for conversion. Read our{" "}
          <a href="/privacy-policy">privacy policy</a> before embedding a tool
          on a page where visitors handle sensitive documents, and mention it
          to your visitors if that applies to your site.
        </p>

        <h3 className={styles.infoSub}>Tips for placing a tool</h3>
        <ul className={styles.infoList}>
          <li>Put a tool next to content that explains it, such as a compress tool inside a guide about reducing PDF size.</li>
          <li>Keep the iframe height from the snippet so the upload area is not cut off.</li>
          <li>Test the page on a phone after you publish it.</li>
        </ul>
        <p>
          Looking for a tool that is not on the list? Every tool is also
          available as a normal page in our{" "}
          <a href="/free-pdf-tools">free PDF tools</a> collection.
        </p>
      </section>

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
// import { Syne, DM_Sans } from "next/font/google";
// import styles from "./embed-code.module.css";

// const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne" });
// const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

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
//     // <div className={`${styles.page} ${dmSans.className} ${syne.variable}`}>
//     // <div className={`${styles.page} ${dmSans.className} ${syne.variable} ${syne.className}`}>

// <div className={`${styles.page} ${dmSans.className} ${syne.variable} ${syne.className} embed-code-page`}>
//       {/* ── Hero ── */}
//       <div className={styles.hero}>
//         <div className={styles.badge}>⚡ Free Embed</div>

//         <h1 className={`${styles.title} ${syne.className}`}>
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

