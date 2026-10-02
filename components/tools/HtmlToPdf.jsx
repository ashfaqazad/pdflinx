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
  Shield, Stamp, Pencil, FileType, PenTool, LayoutGrid
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Sign PDF", href: "/sign-pdf", icon: <PenTool className="h-4 w-4 text-indigo-500" /> },
  { label: "All Free PDF Tools", href: "/free-pdf-tools", icon: <LayoutGrid className="h-4 w-4 text-emerald-500" /> },
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
  "✓ No account required",
  "✓ No watermark added",
  "✓ Auto-deleted after conversion",
  "✓ 100% free online conversion",
  "✓ CSS & custom fonts preserved",
  "✓ 3 input modes supported",
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/html-pdf`, {
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

    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.reset();
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* ── SEO Schemas ── */}
      
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

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "HTML TO PDF CONVERTER",

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

            // ── Custom upload node — CODE LOGIC AS-IS ──
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

        seoSections: [
          {
            title: "Free HTML to PDF Converter — Code, Webpage URL, or .html File",
            text: (
              <>
                Need to save a webpage or convert an HTML template to PDF? PDFLinx renders your HTML using a full headless browser — CSS styles, custom fonts, images, and layout preserved pixel-perfect in the output PDF. If you have plain text files instead, check out our{" "}
                <a href="/text-to-pdf" className="text-blue-600 hover:underline font-medium">
                  Text to PDF converter
                </a>{" "}
                or explore our full directory of{" "}
                <a href="/free-pdf-tools" className="text-blue-600 hover:underline font-medium">
                  free PDF tools
                </a>. Three input modes available in one tool: paste raw HTML code with inline CSS, enter any public webpage URL, or upload a saved .html file directly. No software installation required, no watermarks added, no sign-up needed.
              </>
            ),
          },
          {
            title: "How to Convert HTML to PDF Online in 3 Simple Steps",
            text: "Converting HTML content to a clean PDF with PDFLinx is fast and effortless: 1. Choose your input mode — HTML Code, Webpage URL, or File Upload. 2. Paste your code, enter the URL, or upload your .html file, then customize your page settings if needed. 3. Click Convert to PDF and download your high-quality PDF document instantly.",
          },
          {
            title: "Key Features of PDFLinx HTML to PDF Converter",
            text: "PDFLinx delivers pixel-perfect rendering with complete CSS3 and media query support. Enjoy fast conversion speeds, accurate page break handling, responsive design preservation, custom margins, and full cross-browser compatibility across desktop and mobile devices without quality loss.",
          },
          {
            title: "HTML Code vs Webpage URL vs File Upload — Which Mode to Use",
            text: "Use HTML Code mode for raw HTML markup with inline or internal CSS — email templates, invoice layouts, custom document pages, and any HTML you have written or copied. Use Webpage URL mode for any publicly accessible live website — external stylesheets, web fonts, images, and basic JavaScript are all rendered as the browser sees them. Use File Upload mode to convert a saved .html or .htm file from your device directly to PDF without copying and pasting the code.",
          },
          {
            title: "Common Use Cases for HTML to PDF Conversion",
            text: (
              <>
                Developers converting HTML invoice and receipt templates to PDF for automated client billing workflows. Designers exporting HTML email layouts and newsletter designs to PDF for client review and approval. Once rendered, if you need to quickly add annotations or legally sign your output documents, use our{" "}
                <a href="/sign-pdf" className="text-blue-600 hover:underline font-medium">
                  Sign PDF
                </a>{" "}
                or{" "}
                <a href="/edit-pdf" className="text-blue-600 hover:underline font-medium">
                  Edit PDF
                </a>{" "}
                tools. Marketers archiving web landing pages and campaign pages as PDF records.
              </>
            ),
          },
          {
            title: "Privacy and File Security",
            text: (
              <>
                HTML code, file uploads, and URLs submitted for conversion are processed securely over encrypted HTTPS connections and permanently deleted from our servers after conversion — never stored long-term, never shared with any third party. If you are handling sensitive documents, you can also use our{" "}
                <a href="/protect-pdf" className="text-blue-600 hover:underline font-medium">
                  Protect PDF
                </a>{" "}
                tool to apply password encryption before sharing.
              </>
            ),
          },
          {
            title: "HTML to PDF vs Other Conversion Methods — Why PDFLinx is Better",
            text: "The browser Print to PDF option adds unwanted headers, footers, URL text, and page break artifacts — and cannot be automated. Browser extensions for saving pages as PDF have inconsistent CSS support and do not handle external stylesheets well. Server-side tools like wkhtmltopdf and Puppeteer require technical setup, hosting, and maintenance. PDFLinx gives you headless browser-quality HTML to PDF conversion directly from your browser — no code, no server setup, no cost, and no compromise on rendering quality.",
          },
        ],


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

          },
        }}
      />
    </>
  );
}



