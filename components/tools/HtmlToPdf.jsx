"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileCode,
  Code2,
  Globe,
  Upload,
  CheckCircle,
  Download,
  Minimize2,
  GitMerge,
  Scissors,
  FileText, Image as ImageIcon,
  Shield, Stamp, Pencil, FileType
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-pink-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-indigo-500" /> },
//   { label: "OCR PDF", href: "/ocr-pdf", icon: <FileCode className="h-4 w-4 text-amber-500" /> },
// ];

const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Text to PDF", href: "/text-to-pdf", icon: <FileType className="h-4 w-4 text-yellow-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-orange-800">
      ℹ️ HTML to PDF Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>HTML Code — paste raw HTML + CSS</li>
      <li>URL — any public webpage</li>
      <li>File — upload .html / .htm file</li>
      <li>CSS, fonts & images preserved</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after conversion",
  "✓ 100% free",
  "✓ CSS & fonts preserved",
  "✓ 3 input modes",
];

// ── Mode Selector + Inputs — goes into optionsSlot ─────────────────────────
function HtmlInputPanel({ mode, setMode, htmlCode, setHtmlCode, urlInput, setUrlInput, htmlFile, setHtmlFile, fileInputRef }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      alert("Please select a valid .html or .htm file");
      return;
    }
    setHtmlFile(file);
  };

  return (
    <div className="space-y-4">
      {/* About info */}
      {/* <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-800">💡 About this conversion</p>
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li>✓ Paste HTML code with inline/internal CSS</li>
          <li>✓ Or convert any public webpage via URL</li>
          <li>✓ Or upload a .html / .htm file directly</li>
          <li>✓ CSS, fonts, images & layout preserved</li>
          <li>✓ Headless browser rendering — pixel-perfect</li>
        </ul>
      </div> */}

      {/* Mode Toggle */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Input mode</p>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full flex-wrap">
          {[
            { key: "code", label: "HTML Code", icon: <Code2 className="w-3.5 h-3.5" /> },
            { key: "url", label: "Webpage URL", icon: <Globe className="w-3.5 h-3.5" /> },
            { key: "file", label: "Upload .html", icon: <Upload className="w-3.5 h-3.5" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-1 justify-center ${mode === key
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* HTML Code Mode */}
      {mode === "code" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Paste your HTML code
          </label>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder={`<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { font-family: Arial; padding: 40px; }\n      h1 { color: #e85d04; }\n    </style>\n  </head>\n  <body>\n    <h1>Hello PDF!</h1>\n    <p>Your HTML content here...</p>\n  </body>\n</html>`}
            rows={10}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-800 outline-none resize-y focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <div className="flex flex-wrap gap-1.5">
            {["✓ Inline CSS", "✓ Style blocks", "✓ Base64 images", "✓ Tables"].map((t) => (
              <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Enter a public webpage URL
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["✓ Full page render", "✓ External CSS", "✓ Images", "✓ JS rendered"].map((t) => (
              <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            ℹ️ Only public URLs supported. Login-protected pages cannot be converted.
          </p>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === "file" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Select your .html file
          </label>
          <label className="block cursor-pointer group">
            <div className={`rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${htmlFile
              ? "border-orange-400 bg-orange-50"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/40"
              }`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${htmlFile ? "bg-orange-100" : "bg-orange-50 group-hover:bg-orange-100"
                }`}>
                {htmlFile
                  ? <CheckCircle className="w-5 h-5 text-orange-500" />
                  : <Upload className="w-5 h-5 text-orange-600" />
                }
              </div>
              {htmlFile ? (
                <>
                  <p className="text-sm font-semibold text-orange-700">{htmlFile.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {(htmlFile.size / 1024).toFixed(1)} KB · Click to change file
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-700">Drop your .html file here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse · .html & .htm supported</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

export default function HtmlToPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [mode, setMode] = useState("code");
  const [htmlCode, setHtmlCode] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [htmlFile, setHtmlFile] = useState(null);
  const fileInputRef = useRef(null);

  const isReady =
    (mode === "code" && htmlCode.trim().length > 0) ||
    (mode === "url" && urlInput.trim().length > 0) ||
    (mode === "file" && htmlFile !== null);

  const getDownloadName = () =>
    htmlFile
      ? htmlFile.name.replace(/\.html?$/i, ".pdf")
      : "pdflinx-html-to-pdf.pdf";

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // Advance flow to OPTIONS by injecting a dummy file
  // const handleInputReady = () => {
  //   if (!isReady) {
  //     if (mode === "code") return alert("Please paste your HTML code first");
  //     if (mode === "url") return alert("Please enter a valid URL first");
  //     if (mode === "file") return alert("Please select an .html file first");
  //   }
  //   const blob = new Blob(["html-input"], { type: "text/plain" });
  //   const dummy = new File([blob], "html-input.html", { type: "text/html" });
  //   flow.selectFiles([dummy]);
  // };

  // const handleInputReady = () => {
  //   if (!isReady) {
  //     if (mode === "code") return alert("Please paste your HTML code first");
  //     if (mode === "url") return alert("Please enter a valid URL first");
  //     if (mode === "file") return alert("Please select an .html file first");

  //   }
  //   const blob = new Blob(["html-input"], { type: "text/plain" });
  //   const dummy = new File([blob], "html-input.html", { type: "text/html" });
  //   flow.selectFiles([dummy]); // ← YE OPTIONS step trigger karta hai
  // };

  // ── API LOGIC ──────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!isReady) return alert("Please provide HTML input first");

    flow.startProcessing();
    startProgress();

    try {
      let bodyPayload;

      if (mode === "file") {
        const htmlContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error("File read failed"));
          reader.readAsText(htmlFile, "UTF-8");
        });
        bodyPayload = { mode: "code", html: htmlContent };
      } else if (mode === "code") {
        bodyPayload = { mode: "code", html: htmlCode };
      } else {
        bodyPayload = { mode: "url", url: urlInput };
      }

      const res = await fetch("/convert/html-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Conversion failed");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = getDownloadName();

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      completeProgress();
      flow.finishSuccess();
      // } catch (err) {
      //   console.error(err);
      //   cancelProgress();
      //   flow.handleError(err.message || "Something went wrong. Please try again.");
      // }

    } catch (err) {
      console.error(err);
      cancelProgress();
      // flow.handleError mat use karo — ye OPTIONS step pe le jaata hai
      // Seedha UPLOAD step pe wapas jao
      flow.reset();
      alert(err.message || "Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ──────────────────────────────────────────────────────

  // Mode label for UI strings
  const modeLabel =
    mode === "code" ? "HTML Code" : mode === "url" ? "Webpage URL" : ".html File";

  return (
    <>
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-html-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert HTML to PDF Online Free — Code or URL",
            description: "Convert HTML to PDF online free — no signup, no watermark. Paste your HTML code or enter a webpage URL. CSS styling, fonts, and layout are fully preserved. Works on Windows, Mac, Android, and iOS.",
            url: "https://pdflinx.com/html-to-pdf",
            step: [
              { "@type": "HowToStep", name: "Paste HTML or Enter URL", text: "Choose HTML Code mode and paste your HTML, or switch to Webpage URL mode and enter any public webpage address." },
              { "@type": "HowToStep", name: "Convert to PDF", text: "Click Convert to PDF and wait a few seconds. CSS styles, fonts, images, and layout are preserved automatically." },
              { "@type": "HowToStep", name: "Download PDF", text: "Click Download to save your converted PDF file instantly. No watermark added." },
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-html-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "HTML to PDF", item: "https://pdflinx.com/html-to-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-html-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the HTML to PDF converter free?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx HTML to PDF converter is completely free — no hidden charges, no subscription, no account required." } },
              { "@type": "Question", name: "Can I convert a webpage URL to PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, and layout and converts it to PDF." } },
              { "@type": "Question", name: "Will CSS styles and fonts be preserved?", acceptedAnswer: { "@type": "Answer", text: "Yes. CSS styling, custom fonts, colors, images, and layout are all preserved accurately in the converted PDF." } },
              { "@type": "Question", name: "Can I convert HTML with inline CSS to PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Both inline CSS and internal style blocks are fully supported. External stylesheets work when converting from a URL." } },
              { "@type": "Question", name: "Are my HTML files and URLs safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes. HTML code and URLs are processed securely and permanently deleted after conversion. Never stored or shared." } },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-html-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "HTML to PDF Converter - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Convert HTML to PDF online free — paste HTML code or enter a webpage URL. CSS styling, fonts, images, and layout fully preserved. No signup, no watermark.",
            url: "https://pdflinx.com/html-to-pdf",
            screenshot: "https://pdflinx.com/og-image.png",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Convert HTML code to PDF",
              "Convert webpage URL to PDF",
              "CSS and fonts preserved",
              "Inline and internal CSS supported",
              "Free online HTML to PDF converter",
              "No signup required",
              "Secure file processing",
              "Works on mobile and desktop"
            ],
            creator: { "@type": "Organization", name: "PDFLinx" }
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "HTML to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · CSS Preserved"
        accept=".html,.htm"
        multiple={false}
        convertLabel="Convert to PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={() => { }}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        optionsTitle="HTML input options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={
          <HtmlInputPanel
            mode={mode}
            setMode={(m) => { setMode(m); }}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            htmlFile={htmlFile}
            setHtmlFile={setHtmlFile}
            fileInputRef={fileInputRef}
          />
        }

        customFilePreview={
          <HtmlInputPanel
            mode={mode}
            setMode={setMode}
            htmlCode={htmlCode}
            setHtmlCode={setHtmlCode}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            htmlFile={htmlFile}
            setHtmlFile={setHtmlFile}
            fileInputRef={fileInputRef}
          />
        }

        // customOptionsLayout={
        //   <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] min-h-[calc(100vh-80px)]">

        //     {/* LEFT — HTML Input */}
        //     <div className="bg-white p-8 overflow-y-auto">
        //       <h2 className="text-lg font-bold text-slate-900 mb-5">
        //         HTML to PDF — Input Options
        //       </h2>
        //       <HtmlInputPanel
        //         mode={mode}
        //         setMode={setMode}
        //         htmlCode={htmlCode}
        //         setHtmlCode={setHtmlCode}
        //         urlInput={urlInput}
        //         setUrlInput={setUrlInput}
        //         htmlFile={htmlFile}
        //         setHtmlFile={setHtmlFile}
        //         fileInputRef={fileInputRef}
        //       />
        //     </div>

        //     {/* RIGHT — Sidebar */}
        //     <div className="bg-white border-l border-slate-200 flex flex-col">
        //       <div className="flex-1 p-5">
        //         <h3 className="text-base font-bold text-slate-900 mb-3">
        //           HTML to PDF
        //         </h3>
        //         <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
        //           <p className="text-sm font-semibold text-orange-800">
        //             ℹ️ HTML to PDF Info
        //           </p>
        //           <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
        //             <li>HTML Code — paste raw HTML + CSS</li>
        //             <li>URL — any public webpage</li>
        //             <li>File — upload .html / .htm file</li>
        //             <li>CSS, fonts & images preserved</li>
        //           </ul>
        //         </div>
        //       </div>

        //       {/* Convert Button */}
        //       <div className="p-4 border-t border-slate-200">
        //         <button
        //           type="button"
        //           onClick={handleConvert}
        //           disabled={!isReady}
        //           className={`w-full flex items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${isReady
        //             ? "bg-gradient-to-r from-orange-600 to-rose-500 hover:from-orange-700 hover:to-rose-600 shadow-[0_10px_30px_rgba(234,88,12,0.35)]"
        //             : "cursor-not-allowed bg-slate-300"
        //             }`}
        //         >
        //           <FileCode className="h-5 w-5" />
        //           Convert to PDF
        //         </button>
        //         <p className="mt-2 text-xs text-center text-slate-400">
        //           ⏱️ URL mode may take ~30 seconds
        //         </p>
        //       </div>
        //     </div>

        //   </div>
        // }


        processingTitle="Converting HTML to PDF"
        processingDescription="Rendering your HTML with full CSS and layout support — please wait."
        processingStages={["Rendering HTML", "Applying styles", "Generating PDF"]}

        doneTitle="Your PDF is ready"
        doneDescription="HTML converted to PDF successfully. File downloaded automatically."
        doneFileName={getDownloadName()}
        downloadLabel="Download PDF again"
        resetLabel="Convert another"

        sidebarTitle="HTML to PDF"
        sidebarIcon={<FileCode className="h-5 w-5 text-orange-500" />}
        sidebarDescription="Convert HTML code, any webpage URL, or an .html file to PDF — CSS and layout preserved."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}


        // ============================================================
        // HTML TO PDF — uploadLanding content
        // IMPORTANT: customUploadNode mein code logic as-is hai — mat chhona
        // Mode toggle, textarea, URL input, file upload — sab as-is
        // Sirf content strings polish kiye hain
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "HTML TO PDF CONVERTER",

            // heroTitle: (
            //   <>
            //     Convert HTML to PDF <br />
            //     <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">
            //       Pixel-Perfect 🎯
            //     </span>
            //   </>
            // ),

            // heroDescription:
            //   "Paste HTML code, enter a webpage URL, or upload an .html file — get a clean PDF with CSS, fonts, and layout fully preserved. No signup, no watermark, completely free.",

            // bullets: [
            //   "3 input modes: HTML code, webpage URL, or .html file upload",
            //   "CSS, custom fonts, images & layout preserved",
            //   "Headless browser rendering — pixel-perfect output",
            // ],

            heroTitle: (
              <>
                HTML to PDF Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Convert Webpage to PDF Free
                </em>
              </>
            ),
            heroDescription:
              "Convert HTML files or any webpage URL to PDF online for free — layout, fonts, images, and styles preserved exactly as rendered. No signup, no software, instant download.",
            pills: ["HTML file or URL", "Styles & layout preserved", "Instant PDF output", "No signup"],



            // ── Custom upload node — CODE LOGIC AS-IS, DO NOT TOUCH ──
            customUploadNode: (
              <div className="space-y-4 w-full">
                {/* Mode Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full">
                  {[
                    { key: "code", label: "HTML Code", icon: <Code2 className="w-3.5 h-3.5" /> },
                    { key: "url", label: "Webpage URL", icon: <Globe className="w-3.5 h-3.5" /> },
                    { key: "file", label: "Upload .html", icon: <Upload className="w-3.5 h-3.5" /> },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-1 justify-center ${mode === key
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {icon}{label}
                    </button>
                  ))}
                </div>

                {/* HTML Code input */}
                {mode === "code" && (
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder={`<!DOCTYPE html>\n<html>\n  <head>\n    <style>body { font-family: Arial; padding: 40px; }</style>\n  </head>\n  <body>\n    <h1>Hello PDF!</h1>\n  </body>\n</html>`}
                    rows={12}
                    className="w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-xs font-mono text-slate-800 outline-none resize-y focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all hover:border-orange-300"
                  />
                )}

                {/* URL input */}
                {mode === "url" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all hover:border-orange-300">
                      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                    <p className="text-xs text-slate-400 px-1">
                      ℹ️ Only public URLs supported. Login-protected pages cannot be converted.
                    </p>
                  </div>
                )}

                {/* File upload */}
                {mode === "file" && (
                  <label className="block cursor-pointer group">
                    <div className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${htmlFile
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 hover:border-orange-400 hover:bg-orange-50/40"
                      }`}>
                      <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${htmlFile ? "bg-orange-100" : "bg-orange-50 group-hover:bg-orange-100"
                        }`}>
                        {htmlFile
                          ? <CheckCircle className="w-6 h-6 text-orange-500" />
                          : <Upload className="w-6 h-6 text-orange-600" />
                        }
                      </div>
                      {htmlFile ? (
                        <>
                          <p className="text-sm font-semibold text-orange-700">{htmlFile.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{(htmlFile.size / 1024).toFixed(1)} KB · Click to change</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-700">Drop your .html file here</p>
                          <p className="text-xs text-slate-400 mt-1">or click to browse · .html & .htm supported</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && (f.name.endsWith(".html") || f.name.endsWith(".htm"))) setHtmlFile(f);
                      }}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!isReady}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm ${isReady
                    ? "bg-[#e8420a] hover:bg-[#d63a07] shadow-[0_4px_14px_rgba(232,66,10,0.35)] active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <FileCode className="w-4 h-4" />
                  Convert to PDF
                </button>

                <p className="text-xs text-center text-slate-400">
                  ⏱️ URL conversion may take up to 30 seconds · 🔒 Auto-deleted after conversion
                </p>
              </div>
            ),

            privacyTitle: "Your files stay private",
            privacyText:
              "HTML code and URLs are processed securely and permanently deleted after conversion. Never stored or shared with third parties.",

            noticeTitle: "HTML to PDF Modes",
            noticeItems: [
              "HTML Code — paste raw HTML + CSS",
              "URL — any public webpage",
              "File — upload .html / .htm",
            ],

            breadcrumbItems: [
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "HTML to PDF" },
            ],

            trustPills: ["100% Free", "No Sign Up", "CSS Preserved"],

            supports: [
              "HTML code, URL, or .html file",
              "Auto-deleted after conversion",
            ],

            howToTitle: "How to Convert HTML to PDF — 3 Simple Steps",

            howToSteps: [
              {
                n: "1",
                title: "Choose Your Input Mode",
                desc: "Paste raw HTML code, enter any public webpage URL, or upload a saved .html file — all three modes produce the same pixel-perfect PDF output.",
                color: "bg-orange-600",
              },
              {
                n: "2",
                title: "Click Convert to PDF",
                desc: "PDFLinx renders your HTML using a headless browser — CSS styles, custom fonts, images, flexbox layouts, and all visual elements are preserved exactly as in the browser.",
                color: "bg-rose-600",
              },
              {
                n: "3",
                title: "Download PDF Instantly",
                desc: "Your PDF downloads automatically — no watermark, no signup, and the file is permanently deleted from our servers after conversion.",
                color: "bg-amber-600",
              },
            ],

            visualImage: "/images/html-to-pdf-visual.png",
            visualAlt: "HTML to PDF conversion illustration",

            whyTitle: "Why Choose PDFLinx HTML to PDF?",

            whyItems: [
              {
                title: "3 Input Modes in One Tool",
                desc: "Paste raw HTML code with inline CSS, enter any public webpage URL, or upload a saved .html file — all three modes give you the same pixel-perfect PDF output without switching tools.",
                icon: Code2,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "CSS, Fonts & Layout Preserved",
                desc: "CSS styling, Google Fonts, custom font-face, colors, borders, flexbox and grid layouts, and background images are all preserved — your PDF looks exactly like the original HTML.",
                icon: CheckCircle,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
              {
                title: "Headless Browser Rendering",
                desc: "HTML is rendered using a full headless browser — exactly as Chrome or Edge would display it — before converting to PDF. No simplified rendering, no missing styles, no layout shifts.",
                icon: Globe,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                title: "Works on Any Device",
                desc: "Convert HTML to PDF on iPhone, Android, Windows, or Mac — no software installation, no plugins, no app required. Fully browser-based and always free.",
                icon: Download,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
              },
            ],

            relatedTitle: "You Might Also Need",

            // relatedTools: [
            //   { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", icon: GitMerge, iconColor: "text-purple-500", bgColor: "bg-purple-50" },
            //   { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", icon: Minimize2, iconColor: "text-green-500", bgColor: "bg-green-50" },
            //   { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert DOCX to PDF", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
            //   { label: "Split PDF", href: "/split-pdf", desc: "Extract specific pages", icon: Scissors, iconColor: "text-pink-500", bgColor: "bg-pink-50" },
            //   { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX", icon: FileText, iconColor: "text-indigo-500", bgColor: "bg-indigo-50" },
            //   { label: "OCR PDF", href: "/ocr-pdf", icon: FileCode, iconColor: "text-amber-500", bgColor: "bg-amber-50", desc: "Make scanned PDFs searchable" },
            // ],

            faqTitle: "Frequently Asked Questions",

            faqs: [
              {
                q: "Is the HTML to PDF converter free?",
                a: "Yes, completely free. No hidden charges, no subscription required, and no limits on the number of conversions.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no plugins, no extensions needed.",
              },
              {
                q: "Can I convert a live webpage URL to PDF?",
                a: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, fonts, and layout — exactly as it appears in a browser.",
              },
              {
                q: "Will CSS styles and custom fonts be preserved?",
                a: "Yes. CSS styling, Google Fonts, custom font-face declarations, colors, backgrounds, and layouts are all preserved accurately in the converted PDF.",
              },
              {
                q: "Can I convert HTML with inline CSS to PDF?",
                a: "Yes. Both inline CSS and internal style blocks are fully supported. External stylesheets are resolved when converting from a URL.",
              },
              {
                q: "Why are my images not showing in the converted PDF?",
                a: "In HTML Code mode, use base64-encoded images for best results — external image URLs may not load. In URL mode, all images load normally from their original servers.",
              },
              {
                q: "Can I convert a password-protected or login-required page?",
                a: "No. Only publicly accessible pages can be converted via URL mode. For private or login-protected pages, view the page in your browser, copy the HTML source, and use HTML Code mode instead.",
              },
              {
                q: "Are my HTML code and URLs secure and private?",
                a: "Yes. HTML code and URLs are processed securely over HTTPS and permanently deleted after conversion — never stored long-term, never shared with any third party.",
              },
              {
                q: "Can I upload an .html file directly?",
                a: "Yes. Switch to the Upload .html File mode, select your .html or .htm file from your device, and convert it directly to PDF in one step.",
              },
              {
                q: "How do I get the best PDF output from my HTML?",
                a: "Use a max page width of 794px, inline or internal CSS, base64 images in Code mode, and @media print CSS rules to control page breaks. Avoid JavaScript-dependent content for most reliable results.",
              },
              {
                q: "Does JavaScript execute during HTML to PDF conversion?",
                a: "Basic JavaScript may execute during headless browser rendering. However, content requiring user interaction, delayed API calls, or complex dynamic loading may not fully render. For best results, use HTML with content already present in the markup.",
              },
              {
                q: "What is the difference between the three input modes?",
                a: "HTML Code mode is for raw HTML with inline or internal CSS — ideal for invoice templates, email layouts, and custom pages. URL mode renders any live public webpage — best for archiving or saving web content. File Upload mode converts a saved .html or .htm file — convenient when you have a local HTML file ready.",
              },
            ],

            ctaBadge: "✦ 100% Free",
            ctaTitle: "Convert HTML to PDF Now",
            ctaDescription:
              "Fast. Secure. CSS preserved. No sign up required.",
            ctaSubtext: "No limits. No hidden charges. 3 input modes supported.",
            ctaButton: "Start Converting",

            seoSections: [
              {
                title:
                  "Free HTML to PDF Converter — Code, Webpage URL, or .html File",
                text: "Need to save a webpage or convert an HTML template to PDF? PDFLinx renders your HTML using a full headless browser — CSS styles, custom fonts, images, and layout preserved pixel-perfect in the output PDF. Three input modes available in one tool: paste raw HTML code with inline CSS, enter any public webpage URL, or upload a saved .html file directly. No software installation required, no watermarks added, no sign-up needed.",
              },
              {
                title: "HTML Code vs Webpage URL vs File Upload — Which Mode to Use",
                text: "Use HTML Code mode for raw HTML markup with inline or internal CSS — email templates, invoice layouts, custom document pages, and any HTML you have written or copied. Use Webpage URL mode for any publicly accessible live website — external stylesheets, web fonts, images, and basic JavaScript are all rendered as the browser sees them. Use File Upload mode to convert a saved .html or .htm file from your device directly to PDF without copying and pasting the code.",
              },
              {
                title: "Common Use Cases for HTML to PDF Conversion",
                text: "Developers converting HTML invoice and receipt templates to PDF for automated client billing workflows. Designers exporting HTML email layouts and newsletter designs to PDF for client review and approval. Marketers archiving web landing pages and campaign pages as PDF records. Students and researchers saving web articles, documentation pages, and online references as PDF for offline reading and citation. Businesses converting internal HTML reports and dashboards to PDF for distribution.",
              },
              {
                title: "Privacy and File Security",
                text: "HTML code, file uploads, and URLs submitted for conversion are processed securely over encrypted HTTPS connections and permanently deleted from our servers after conversion — never stored long-term, never shared with any third party. No account creation required. Your content remains completely private throughout the process.",
              },
              {
                title: "HTML to PDF vs Other Conversion Methods — Why PDFLinx is Better",
                text: "The browser Print to PDF option adds unwanted headers, footers, URL text, and page break artifacts — and cannot be automated. Browser extensions for saving pages as PDF have inconsistent CSS support and do not handle external stylesheets well. Server-side tools like wkhtmltopdf and Puppeteer require technical setup, hosting, and maintenance. PDFLinx gives you headless browser-quality HTML to PDF conversion directly from your browser — no code, no server setup, no cost, and no compromise on rendering quality.",
              },
            ],

            showPdfTypes: false,
          },
        }}

      />
    </>
  );
}






























// "use client";
// import { useState, useRef } from "react";
// import { Download, CheckCircle, FileCode, Code2, Globe, Upload } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";

// export default function HtmlToPDF() {
//     const [mode, setMode] = useState("code"); // "code" | "url" | "file"
//     const [htmlCode, setHtmlCode] = useState("");
//     const [urlInput, setUrlInput] = useState("");
//     const [htmlFile, setHtmlFile] = useState(null); // File object
//     const [downloadUrl, setDownloadUrl] = useState("");
//     const [success, setSuccess] = useState(false);
//     const fileInputRef = useRef(null);
//     const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();

//     // File select handler — FileReader se HTML content read karo
//     const handleFileChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
//             alert("Please select a valid .html or .htm file");
//             return;
//         }
//         setHtmlFile(file);
//         setSuccess(false);
//         setDownloadUrl("");
//     };

//     // isConvertReady — har mode ke liye check
//     const isReady =
//         (mode === "code" && htmlCode.trim().length > 0) ||
//         (mode === "url" && urlInput.trim().length > 0) ||
//         (mode === "file" && htmlFile !== null);

//     const handleConvert = async (e) => {
//         e.preventDefault();
//         if (!isReady) {
//             if (mode === "code") return alert("Please paste your HTML code first");
//             if (mode === "url") return alert("Please enter a valid URL first");
//             if (mode === "file") return alert("Please select an .html file first");
//         }

//         startProgress();
//         setDownloadUrl("");
//         setSuccess(false);

//         try {
//             // ✅ File mode mein pehle content read karo
//             let bodyPayload;
//             if (mode === "file") {
//                 const htmlContent = await new Promise((resolve, reject) => {
//                     const reader = new FileReader();
//                     reader.onload = (e) => resolve(e.target.result);
//                     reader.onerror = () => reject(new Error("File read failed"));
//                     reader.readAsText(htmlFile, "UTF-8");
//                 });
//                 bodyPayload = { mode: "code", html: htmlContent };
//             } else if (mode === "code") {
//                 bodyPayload = { mode: "code", html: htmlCode };
//             } else {
//                 bodyPayload = { mode: "url", url: urlInput };
//             }

//             // ✅ Fetch karo
//             const res = await fetch("/convert/html-pdf", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(bodyPayload),
//             });

//             // ✅ Error case — backend JSON error bhejta hai
//             if (!res.ok) {
//                 const err = await res.json();
//                 cancelProgress();
//                 return alert("Conversion failed: " + (err.error || "Try again"));
//             }

//             // ✅ Success — seedha blob lo, JSON nahi
//             const blob = await res.blob();
//             const blobUrl = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = blobUrl;
//             a.download = htmlFile
//                 ? htmlFile.name.replace(/\.html?$/i, ".pdf")
//                 : "pdflinx-html-to-pdf.pdf";
//             a.click();
//             window.URL.revokeObjectURL(blobUrl);

//             completeProgress();
//             setSuccess(true);

//             setTimeout(() => {
//                 const downloadSection = document.getElementById("download-section");
//                 if (downloadSection) {
//                     downloadSection.scrollIntoView({ behavior: "smooth", block: "center" });
//                 }
//             }, 300);

//         } catch (error) {
//             cancelProgress();
//             alert("Oops! Something went wrong. Please try again.");
//             console.error(error);
//         }
//     };

//     const handleDownload = async () => {
//         if (!downloadUrl) return;
//         try {
//             const res = await fetch(downloadUrl);
//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             // File mode mein original filename se PDF naam rakho
//             const pdfName = htmlFile
//                 ? htmlFile.name.replace(/\.html?$/i, ".pdf")
//                 : "pdflinx-html-to-pdf.pdf";
//             a.download = pdfName;
//             a.click();
//             window.URL.revokeObjectURL(url);
//         } catch (err) {
//             alert("Download failed");
//         }
//     };

//     const handleReset = () => {
//         setSuccess(false);
//         setHtmlFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         setHtmlCode("");
//         setUrlInput("");
//         setDownloadUrl("");
//     };

//     return (
//         <>
//             {/* ==================== SEO SCHEMAS ==================== */}

//             {/* HowTo Schema */}
//             <Script
//                 id="howto-schema-html-pdf"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "HowTo",
//                         name: "How to Convert HTML to PDF Online Free — Code or URL",
//                         description:
//                             "Convert HTML to PDF online free — no signup, no watermark. Paste your HTML code or enter a webpage URL. CSS styling, fonts, and layout are fully preserved. Works on Windows, Mac, Android, and iOS.",
//                         url: "https://pdflinx.com/html-to-pdf",
//                         step: [
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Paste HTML or Enter URL",
//                                 text: "Choose 'HTML Code' mode and paste your HTML code, or switch to 'Webpage URL' mode and enter any public webpage address.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Convert to PDF",
//                                 text: "Click 'Convert to PDF' and wait a few seconds. CSS styles, fonts, images, and layout are preserved automatically.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Download PDF",
//                                 text: "Click the Download button to save your converted PDF file instantly. No watermark added.",
//                             },
//                         ],
//                         totalTime: "PT20S",
//                         estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//                         image: "https://pdflinx.com/og-image.png",
//                     }, null, 2),
//                 }}
//             />

//             {/* Breadcrumb Schema */}
//             <Script
//                 id="breadcrumb-schema-html-pdf"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "BreadcrumbList",
//                         itemListElement: [
//                             { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//                             { "@type": "ListItem", position: 2, name: "HTML to PDF", item: "https://pdflinx.com/html-to-pdf" },
//                         ],
//                     }, null, 2),
//                 }}
//             />

//             {/* FAQ Schema */}
//             <Script
//                 id="faq-schema-html-pdf"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "FAQPage",
//                         mainEntity: [
//                             {
//                                 "@type": "Question",
//                                 name: "Is the HTML to PDF converter free?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes. PDFLinx HTML to PDF converter is completely free — no hidden charges, no subscription, no account required.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I convert a webpage URL to PDF?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, and layout and converts it to PDF.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Will CSS styles and fonts be preserved?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes. CSS styling, custom fonts, colors, images, and layout are all preserved accurately in the converted PDF.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I convert HTML with inline CSS to PDF?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes. Both inline CSS and internal style blocks are fully supported. External stylesheets work when converting from a URL.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Are my HTML files and URLs safe and private?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes. HTML code and URLs are processed securely and permanently deleted after conversion. Never stored or shared.",
//                                 },
//                             },
//                         ],
//                     }, null, 2),
//                 }}
//             />

//             {/* ==================== MAIN TOOL SECTION ==================== */}
//             <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-8 px-4">
//                 <div className="max-w-4xl mx-auto">

//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
//                             Convert HTML to PDF Online Free
//                             <br />
//                             <span className="text-2xl md:text-3xl font-medium">
//                                 No Signup · No Watermark · CSS Preserved
//                             </span>
//                         </h1>
//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Convert HTML to PDF online free — paste your HTML code or enter a webpage URL.
//                             CSS styles, fonts, images, and layout are preserved pixel-perfect. No software
//                             needed. Works on Windows, Mac, Android, and iOS.
//                         </p>
//                     </div>

//                     {/* Step Strip */}
//                     <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
//                         {[
//                             { n: "1", label: "Paste HTML or URL", sub: "Code or webpage link" },
//                             { n: "2", label: "Convert", sub: "CSS & layout preserved" },
//                             { n: "3", label: "Download PDF", sub: "Instant & free" },
//                         ].map((s, i) => (
//                             <div
//                                 key={i}
//                                 className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
//                             >
//                                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
//                                     {s.n}
//                                 </div>
//                                 <p className="text-xs font-semibold text-gray-700">{s.label}</p>
//                                 <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Main Card */}
//                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

//                         <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

//                             {/* Loading Overlay */}
//                             {isLoading && (
//                                 <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
//                                     <div className="relative w-16 h-16">
//                                         <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
//                                         <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
//                                         <div className="absolute inset-2 rounded-full border-4 border-rose-200 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
//                                     </div>
//                                     <div className="text-center">
//                                         <p className="text-base font-semibold text-gray-700">Converting to PDF…</p>
//                                         <p className="text-sm text-gray-400 mt-1">
//                                             {progress < 30 ? "Rendering HTML…" : progress < 70 ? "Applying styles…" : "Generating PDF…"}
//                                         </p>
//                                     </div>
//                                     <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                                         <div
//                                             className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-500"
//                                             style={{ width: `${progress}%` }}
//                                         />
//                                     </div>
//                                     <p className="text-xs text-gray-400 font-medium">{progress}%</p>
//                                 </div>
//                             )}

//                             <form onSubmit={handleConvert} className="p-8 space-y-5">

//                                 {/* Mode Toggle — 3 options */}
//                                 <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
//                                     <button
//                                         type="button"
//                                         onClick={() => { setMode("code"); setSuccess(false); }}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "code"
//                                             ? "bg-white text-orange-600 shadow-sm"
//                                             : "text-gray-500 hover:text-gray-700"
//                                             }`}
//                                     >
//                                         <Code2 className="w-4 h-4" />
//                                         HTML Code
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => { setMode("url"); setSuccess(false); }}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "url"
//                                             ? "bg-white text-orange-600 shadow-sm"
//                                             : "text-gray-500 hover:text-gray-700"
//                                             }`}
//                                     >
//                                         <Globe className="w-4 h-4" />
//                                         Webpage URL
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => { setMode("file"); setSuccess(false); }}
//                                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "file"
//                                             ? "bg-white text-orange-600 shadow-sm"
//                                             : "text-gray-500 hover:text-gray-700"
//                                             }`}
//                                     >
//                                         <Upload className="w-4 h-4" />
//                                         Upload .html File
//                                     </button>
//                                 </div>

//                                 {/* HTML Code Mode */}
//                                 {mode === "code" && (
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Paste your HTML code below
//                                         </label>
//                                         <textarea
//                                             value={htmlCode}
//                                             onChange={(e) => { setHtmlCode(e.target.value); setSuccess(false); }}
//                                             placeholder={`<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { font-family: Arial; padding: 40px; }\n      h1 { color: #e85d04; }\n    </style>\n  </head>\n  <body>\n    <h1>Hello PDF!</h1>\n    <p>Your HTML content here...</p>\n  </body>\n</html>`}
//                                             rows={12}
//                                             className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y transition"
//                                         />
//                                         <div className="flex flex-wrap gap-2">
//                                             {["✓ Inline CSS", "✓ Style blocks", "✓ Images (base64)", "✓ Tables", "✓ Custom fonts"].map((t) => (
//                                                 <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
//                                                     {t}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* URL Mode */}
//                                 {mode === "url" && (
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Enter a public webpage URL
//                                         </label>
//                                         <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent transition">
//                                             <Globe className="w-4 h-4 text-gray-400 shrink-0" />
//                                             <input
//                                                 type="url"
//                                                 value={urlInput}
//                                                 onChange={(e) => { setUrlInput(e.target.value); setSuccess(false); }}
//                                                 placeholder="https://example.com"
//                                                 className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
//                                             />
//                                         </div>
//                                         <div className="flex flex-wrap gap-2">
//                                             {["✓ Full page render", "✓ External CSS", "✓ Images", "✓ Fonts", "✓ JavaScript rendered"].map((t) => (
//                                                 <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
//                                                     {t}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                         <p className="text-xs text-gray-400">
//                                             ℹ️ Only public URLs are supported. Login-protected pages cannot be converted.
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* File Upload Mode */}
//                                 {mode === "file" && (
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Select your .html file
//                                         </label>
//                                         <label className="block cursor-pointer group">
//                                             <div
//                                                 className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${htmlFile
//                                                     ? "border-orange-400 bg-orange-50"
//                                                     : "border-gray-200 hover:border-orange-400 hover:bg-orange-50/40"
//                                                     }`}
//                                             >
//                                                 <div
//                                                     className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${htmlFile ? "bg-orange-100" : "bg-orange-50 group-hover:bg-orange-100"
//                                                         }`}
//                                                 >
//                                                     {htmlFile ? (
//                                                         <CheckCircle className="w-7 h-7 text-orange-500" />
//                                                     ) : (
//                                                         <Upload className="w-7 h-7 text-orange-600" />
//                                                     )}
//                                                 </div>

//                                                 {htmlFile ? (
//                                                     <>
//                                                         <p className="text-base font-semibold text-orange-700">
//                                                             {htmlFile.name}
//                                                         </p>
//                                                         <p className="text-xs text-gray-400 mt-1">
//                                                             {(htmlFile.size / 1024).toFixed(1)} KB · Click to change file
//                                                         </p>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <p className="text-base font-semibold text-gray-700">
//                                                             Drop your .html file here
//                                                         </p>
//                                                         <p className="text-sm text-gray-400 mt-1">
//                                                             or click to browse · .html & .htm supported
//                                                         </p>
//                                                         <div className="flex flex-wrap justify-center gap-2 mt-4">
//                                                             {["✓ No signup", "✓ No watermark", "✓ CSS preserved", "✓ Auto-deleted"].map((t) => (
//                                                                 <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
//                                                                     {t}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <input
//                                                 type="file"
//                                                 accept=".html,.htm"
//                                                 onChange={handleFileChange}
//                                                 ref={fileInputRef}
//                                                 className="hidden"
//                                             />
//                                         </label>
//                                     </div>
//                                 )}

//                                 {/* Info Row + Convert Button */}
//                                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
//                                     <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
//                                         <FileCode className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-700 leading-none">
//                                                 {mode === "code" ? "HTML code → PDF" : mode === "url" ? "Webpage URL → PDF" : ".html file → PDF"}
//                                             </p>
//                                             <p className="text-xs text-gray-400 mt-0.5">CSS, fonts, images preserved</p>
//                                         </div>
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={!isReady || isLoading}
//                                         className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${isReady && !isLoading
//                                             ? "bg-gradient-to-r from-orange-600 to-rose-500 hover:from-orange-700 hover:to-rose-600 hover:shadow-md active:scale-[0.98]"
//                                             : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                             }`}
//                                     >
//                                         <FileCode className="w-4 h-4" />
//                                         Convert to PDF
//                                     </button>
//                                 </div>

//                                 {/* Hints */}
//                                 <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
//                                     <p>⏱️ URL conversion may take up to 30 seconds — don&apos;t close this tab</p>
//                                     <p>🔒 No signup required · Files auto-deleted after conversion</p>
//                                 </div>

//                             </form>
//                         </div>

//                         {/* Success State */}
//                         {success && (
//                             <div
//                                 id="download-section"
//                                 className="mx-6 mb-6 rounded-2xl overflow-hidden border border-orange-200 bg-gradient-to-br from-orange-50 to-rose-50"
//                             >
//                                 <div className="flex flex-col items-center text-center px-8 py-10">
//                                     <div className="relative w-16 h-16 mb-5">
//                                         <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-30"></div>
//                                         <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg">
//                                             <CheckCircle className="w-8 h-8 text-white" />
//                                         </div>
//                                     </div>
//                                     <h3 className="text-xl font-bold text-orange-800 mb-1">
//                                         Conversion Complete! 🎉
//                                     </h3>
//                                     <p className="text-sm text-orange-700 font-medium mb-1">
//                                         Your HTML has been converted to a clean PDF
//                                     </p>
//                                     <p className="text-xs text-gray-500 mb-6">
//                                         Click below to download your PDF file
//                                     </p>

//                                     {/* <button
//                                         onClick={handleDownload}
//                                         className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-rose-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-orange-700 hover:to-rose-600 transition shadow-md mb-4"
//                                     >
//                                         <Download className="w-4 h-4" />
//                                         Download PDF
//                                     </button> */}

//                                     <div className="flex flex-wrap gap-3 justify-center">
//                                         <button
//                                             onClick={handleReset}
//                                             className="inline-flex items-center gap-2 bg-white border border-orange-300 text-orange-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition shadow-sm"
//                                         >
//                                             <FileCode className="w-4 h-4" />
//                                             Convert another
//                                         </button>
//                                         <a
//                                             href="/merge-pdf"
//                                             className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
//                                         >
//                                             Merge PDF →
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                     </div>

//                     {/* Footer Trust Bar */}
//                     <p className="text-center mt-6 text-gray-500 text-sm">
//                         No account · No watermark · Auto-deleted after 1 hour · 100% free ·
//                         HTML code & URL supported · Works on Windows, Mac, Android &amp; iOS
//                     </p>

//                 </div>
//             </main>

//             {/* ==================== SEO CONTENT SECTION ==================== */}
//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
//                         Free HTML to PDF Converter — Convert HTML Code or Webpage URL to PDF Online
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Need to save a webpage or convert your HTML template to PDF? Paste your HTML code or
//                         enter any public URL and download a pixel-perfect PDF instantly. CSS styles, fonts,
//                         images, and layout preserved. Free, fast, and private on PDFLinx.
//                     </p>
//                 </div>

//                 {/* Benefits Grid */}
//                 <div className="grid md:grid-cols-3 gap-8 mb-16">
//                     <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Code2 className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">HTML Code & URL Support</h3>
//                         <p className="text-gray-600 text-sm">
//                             Paste raw HTML code with inline CSS or internal styles, or enter any public
//                             webpage URL. Both modes produce pixel-perfect PDF output.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl shadow-lg border border-rose-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <CheckCircle className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">CSS & Fonts Preserved</h3>
//                         <p className="text-gray-600 text-sm">
//                             CSS styling, custom fonts, colors, images, and complex layouts are all
//                             preserved accurately — your PDF looks exactly like the original HTML.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Download className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant PDF Download</h3>
//                         <p className="text-gray-600 text-sm">
//                             No email required, no file uploads — your PDF is generated and downloaded
//                             directly in seconds. Auto-deleted after conversion for privacy.
//                         </p>
//                     </div>
//                 </div>

//                 {/* How To Steps */}
//                 <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//                     <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//                         How to Convert HTML to PDF — 3 Simple Steps
//                     </h3>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                                 1
//                             </div>
//                             <h4 className="text-lg font-semibold mb-2">Paste HTML or Enter URL</h4>
//                             <p className="text-gray-600 text-sm">
//                                 Choose HTML Code mode and paste your HTML, or switch to URL mode and
//                                 enter any public webpage address you want to convert to PDF.
//                             </p>
//                         </div>
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                                 2
//                             </div>
//                             <h4 className="text-lg font-semibold mb-2">Click Convert to PDF</h4>
//                             <p className="text-gray-600 text-sm">
//                                 Hit Convert and wait a few seconds. CSS styles, fonts, images, and
//                                 layout are preserved automatically in the output PDF.
//                             </p>
//                         </div>
//                         <div className="text-center">
//                             <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                                 3
//                             </div>
//                             <h4 className="text-lg font-semibold mb-2">Download Your PDF</h4>
//                             <p className="text-gray-600 text-sm">
//                                 Click Download to save your PDF instantly. No watermark, no signup,
//                                 and your data is permanently deleted after conversion.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Contextual Links */}
//                 <div className="mt-10 bg-white p-6 md:p-8 shadow-sm rounded-xl border border-gray-100">
//                     <h3 className="text-lg md:text-xl font-bold text-slate-900">
//                         Need to do more with your PDF?
//                     </h3>
//                     <p className="mt-1 text-sm text-slate-600">
//                         After converting HTML to PDF, these tools can help you organize and share your document.
//                     </p>
//                     <ul className="mt-4 space-y-2 text-sm">
//                         <li>
//                             <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">Merge PDF</a>{" "}
//                             <span className="text-slate-600">— combine your HTML PDF with other documents into one file.</span>
//                         </li>
//                         <li>
//                             <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">Compress PDF</a>{" "}
//                             <span className="text-slate-600">— reduce the converted PDF file size for easy email sharing.</span>
//                         </li>
//                         <li>
//                             <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">Word to PDF</a>{" "}
//                             <span className="text-slate-600">— convert Word documents to PDF alongside your HTML files.</span>
//                         </li>
//                         <li>
//                             <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
//                             <span className="text-slate-600">— merge, split, compress, convert & more.</span>
//                         </li>
//                     </ul>
//                 </div>

//                 <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//                     Trusted by developers, designers, and businesses to convert HTML templates and
//                     webpages to PDF — fast, reliable, and always free.
//                 </p>
//             </section>

//             {/* ==================== DEEP SEO CONTENT ==================== */}
//             <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//                 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//                     HTML to PDF Converter – Free Online Tool by PDFLinx
//                 </h2>

//                 <p className="text-base leading-7 mb-6">
//                     Need to save a webpage as PDF or convert an HTML email template, invoice, or report
//                     to PDF format? The{" "}
//                     <span className="font-medium text-slate-900">PDFLinx HTML to PDF Converter</span>{" "}
//                     renders your HTML exactly as a browser would — CSS styles, custom fonts, images,
//                     tables, and layouts preserved pixel-perfect — and delivers a clean PDF instantly.
//                     No software installation, no watermarks, no sign-up required.
//                 </p>

//                 <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                     What Is HTML to PDF Conversion?
//                 </h3>
//                 <p className="leading-7 mb-6">
//                     HTML to PDF conversion takes your HTML code or a live webpage and renders it into a
//                     fixed-layout PDF document. Everything — CSS styling, fonts, colors, images, tables,
//                     and page layout — stays exactly as designed, regardless of what device or software
//                     the recipient uses. This is ideal for generating invoices, reports, certificates,
//                     HTML email previews, and archiving webpages as PDF files.
//                 </p>

//                 <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                     Why Convert HTML to PDF?
//                 </h3>
//                 <ul className="space-y-2 mb-6 list-disc pl-6">
//                     <li>Preserves CSS styles, fonts, colors, images, and layout perfectly</li>
//                     <li>Opens identically on every device — no browser differences</li>
//                     <li>Protects content from editing — read-only PDF format</li>
//                     <li>Print-ready output with consistent page layout</li>
//                     <li>Archive webpages as PDF for offline use or record-keeping</li>
//                     <li>Generate PDF invoices, reports, and certificates from HTML templates</li>
//                     <li>Share HTML email templates as PDF for client review</li>
//                     <li>Convert HTML documentation to PDF for distribution</li>
//                 </ul>

//                 <div className="mt-10 space-y-10">

//                     <div>
//                         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             HTML Code vs Webpage URL — Which Mode Should I Use?
//                         </h3>
//                         <p className="leading-7">
//                             Use <strong>HTML Code mode</strong> when you have raw HTML markup — email
//                             templates, invoice HTML, custom-built pages, or code copied from your editor.
//                             Inline CSS and internal &lt;style&gt; blocks are fully supported. Use{" "}
//                             <strong>Webpage URL mode</strong> when you want to convert any public live
//                             website to PDF — the tool renders the full page including external stylesheets,
//                             images, and JavaScript-rendered content. Note that login-protected or
//                             private pages cannot be converted via URL.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             How to Convert HTML to PDF Without Losing Formatting
//                         </h3>
//                         <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
//                             <li>Use <strong>inline CSS or &lt;style&gt; blocks</strong> — external stylesheets work only in URL mode</li>
//                             <li>Use <strong>A4 page width</strong> (794px) in your HTML for best PDF page fit</li>
//                             <li>Avoid percentage-based widths that may not translate to fixed PDF dimensions</li>
//                             <li>Use <strong>base64-encoded images</strong> in HTML Code mode for images to render correctly</li>
//                             <li>Add <code className="bg-gray-100 px-1 rounded text-sm">@media print</code> CSS rules to control page breaks and print layout</li>
//                         </ul>
//                         <p className="leading-7">
//                             PDFLinx renders HTML using a full headless browser — your CSS, fonts, and layout
//                             are processed exactly as Chrome would render them before converting to PDF.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             Common Use Cases for HTML to PDF Conversion
//                         </h3>
//                         <ul className="space-y-2 list-disc pl-6 leading-7">
//                             <li>
//                                 <strong>HTML invoices and receipts:</strong> Convert HTML invoice templates to
//                                 PDF for professional client billing without requiring PDF software.
//                             </li>
//                             <li>
//                                 <strong>Email template previews:</strong> Convert HTML email designs to PDF
//                                 for client approval, portfolio presentation, or design review.
//                             </li>
//                             <li>
//                                 <strong>Web page archiving:</strong> Save any public webpage as PDF for
//                                 offline reading, evidence preservation, or compliance records.
//                             </li>
//                             <li>
//                                 <strong>HTML reports and dashboards:</strong> Export data reports or dashboard
//                                 views built in HTML to PDF for stakeholder sharing.
//                             </li>
//                             <li>
//                                 <strong>Certificates and credentials:</strong> Generate PDF certificates from
//                                 HTML templates for courses, events, or employee recognition.
//                             </li>
//                             <li>
//                                 <strong>Developer documentation:</strong> Convert HTML documentation pages to
//                                 PDF for offline distribution or client handover packages.
//                             </li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             Privacy and File Security
//                         </h3>
//                         <p className="leading-7">
//                             PDFLinx is built with privacy as a core priority. HTML code and URLs submitted
//                             for conversion are processed securely and{" "}
//                             <strong>permanently deleted after conversion</strong> — never stored long-term,
//                             never shared with third parties, and never used for any other purpose. No
//                             account creation is required — no email, no password, no personal data
//                             collected.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             Convert HTML to PDF on Any Device
//                         </h3>
//                         <p className="leading-7">
//                             PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in
//                             any modern browser. No app download, no software installation required. Whether
//                             you are a developer on your desktop or a business owner on your phone, you can
//                             convert HTML to PDF in seconds. Fully responsive interface with instant results.
//                         </p>
//                     </div>

//                 </div>

//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
//                     <h3 className="text-xl font-semibold text-slate-900 mb-4">
//                         PDFLinx HTML to PDF Converter — Feature Summary
//                     </h3>
//                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
//                         <li>Free online HTML to PDF converter — no hidden fees</li>
//                         <li>Paste HTML code or convert from a webpage URL</li>
//                         <li>CSS styles, fonts, and images fully preserved</li>
//                         <li>Headless browser rendering — pixel-perfect output</li>
//                         <li>Inline CSS and internal style blocks supported</li>
//                         <li>High-quality, print-ready PDF output</li>
//                         <li>Fast processing — conversion in seconds</li>
//                         <li>No watermark added to converted files</li>
//                         <li>Works on desktop and mobile browsers</li>
//                         <li>Files auto-deleted after conversion — privacy protected</li>
//                         <li>No signup or account required</li>
//                         <li>Cross-platform: Windows, macOS, Android, iOS</li>
//                     </ul>
//                 </div>

//                 <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                     Who Should Use This Tool?
//                 </h3>
//                 <ul className="space-y-2 mb-6 list-disc pl-6">
//                     <li><strong>Web developers:</strong> Convert HTML templates, components, and documentation to PDF for client delivery</li>
//                     <li><strong>Designers:</strong> Export HTML email designs and mockups to PDF for stakeholder review</li>
//                     <li><strong>Business owners:</strong> Generate PDF invoices and quotes from HTML templates without extra software</li>
//                     <li><strong>Marketers:</strong> Archive landing pages and campaign pages as PDF for records or presentations</li>
//                     <li><strong>Students & researchers:</strong> Save webpages and online articles as PDF for offline reading</li>
//                     <li><strong>Anyone with HTML:</strong> Instantly convert any HTML content to a portable, shareable PDF</li>
//                 </ul>

//             </section>

//             {/* ==================== FAQ SECTION ==================== */}
//             <section className="py-16 bg-gray-50">
//                 <div className="max-w-4xl mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//                         Frequently Asked Questions
//                     </h2>
//                     <div className="space-y-4">
//                         {[
//                             {
//                                 q: "Is the HTML to PDF converter free to use?",
//                                 a: "Yes. PDFLinx HTML to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
//                             },
//                             {
//                                 q: "Do I need to install any software?",
//                                 a: "No. Everything works directly in your browser. No desktop software, no plugins needed.",
//                             },
//                             {
//                                 q: "Can I convert a live webpage URL to PDF?",
//                                 a: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, and layout and converts it to PDF.",
//                             },
//                             {
//                                 q: "Will CSS styles and fonts be preserved after conversion?",
//                                 a: "Yes. CSS styling, custom fonts, colors, images, and layout are all preserved accurately in the converted PDF.",
//                             },
//                             {
//                                 q: "Can I convert HTML with inline CSS to PDF?",
//                                 a: "Yes. Both inline CSS and internal <style> blocks are fully supported. External stylesheets work when converting from a URL.",
//                             },
//                             {
//                                 q: "Why are my images not showing in the converted PDF?",
//                                 a: "In HTML Code mode, use base64-encoded images so they are embedded directly in the HTML. External image URLs may not load in code mode. In URL mode, all images load normally.",
//                             },
//                             {
//                                 q: "Can I convert a password-protected or login-required page?",
//                                 a: "No. Only public pages accessible without login can be converted via URL mode. For private pages, copy the HTML source and use HTML Code mode instead.",
//                             },
//                             {
//                                 q: "Are my HTML code and URLs safe and private?",
//                                 a: "Yes. HTML code and URLs are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
//                             },
//                             {
//                                 q: "Why is my PDF layout different from the original HTML?",
//                                 a: "PDF pages have fixed dimensions (A4 by default). HTML designed for wide screens may overflow. Use a max-width of 794px and @media print CSS rules in your HTML to optimize the layout for PDF output.",
//                             },
//                             {
//                                 q: "Can I combine the converted HTML PDF with other PDFs?",
//                                 a: "Yes. After converting, use the Merge PDF tool on PDFLinx to combine multiple PDFs into one organized document.",
//                             },
//                         ].map((faq, i) => (
//                             <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                                 <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
//                                     {faq.q}
//                                     <span className="text-orange-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
//                                 </summary>
//                                 <p className="mt-2 text-gray-600">{faq.a}</p>
//                             </details>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <RelatedToolsSection currentPage="html-pdf" />
//         </>
//     );
// }