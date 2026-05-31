"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import {
  FileText,
  Type,
  Shield, PenLine, Hash, Pencil, GitMerge,
  Minimize2, RotateCw, EyeOff
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";



// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "Protect PDF",    href: "/protect-pdf",    icon: <Shield          className="h-4 w-4 text-red-500"     /> },
  { label: "Sign PDF",       href: "/sign-pdf",       icon: <PenLine         className="h-4 w-4 text-indigo-500"  /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash        className="h-4 w-4 text-slate-500"   /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
  { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge        className="h-4 w-4 text-purple-500"  /> },
  { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2       className="h-4 w-4 text-green-500"   /> },
  { label: "Rotate PDF",     href: "/rotate-pdf",     icon: <RotateCw        className="h-4 w-4 text-cyan-500"    /> },
  { label: "Redact PDF",     href: "/redact-pdf",     icon: <EyeOff          className="h-4 w-4 text-gray-500"    /> },
];


// ─── Constants ───────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { label: "Helvetica Bold", value: "HelveticaBold", standard: true },
  { label: "Helvetica", value: "Helvetica", standard: true },
  { label: "Times Bold", value: "TimesRomanBold", standard: true },
  { label: "Times Roman", value: "TimesRoman", standard: true },
  { label: "Courier Bold", value: "CourierBold", standard: true },
  { label: "Courier", value: "Courier", standard: true },
];

// Map pdf-lib StandardFonts
const STANDARD_FONT_MAP = {
  HelveticaBold: StandardFonts.HelveticaBold,
  Helvetica: StandardFonts.Helvetica,
  TimesRomanBold: StandardFonts.TimesRomanBold,
  TimesRoman: StandardFonts.TimesRoman,
  CourierBold: StandardFonts.CourierBold,
  Courier: StandardFonts.Courier,
};

// CSS font family for canvas preview
const CSS_FONT_MAP = {
  HelveticaBold: "bold Arial, Helvetica, sans-serif",
  Helvetica: "Arial, Helvetica, sans-serif",
  TimesRomanBold: "bold 'Times New Roman', Times, serif",
  TimesRoman: "'Times New Roman', Times, serif",
  CourierBold: "bold 'Courier New', Courier, monospace",
  Courier: "'Courier New', Courier, monospace",
};

const PRESET_COLORS = [
  { label: "Red", hex: "#e53e3e" },
  { label: "Blue", hex: "#3182ce" },
  { label: "Gray", hex: "#718096" },
  { label: "Black", hex: "#1a202c" },
  { label: "Green", hex: "#38a169" },
  { label: "Orange", hex: "#dd6b20" },
];

const hexToRgb01 = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};

// ─── Live Canvas Preview (Multi-page + Zoom) ─────────────────────────────────
// SIRF YEH COMPONENT REPLACE KARO — baaki AddWatermark.jsx same rahega

function WatermarkPreview({ file, text, opacity, fontFamily, fontSize, colorHex }) {
  const [pages, setPages] = useState([]); // Array of { imageData, width, height }
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRefs = useRef([]);

  // Load ALL pages of PDF
  useEffect(() => {
    if (!file) { setPages([]); return; }
    let cancelled = false;
    setLoading(true);
    setPages([]);

    const loadPdf = async () => {
      try {
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) { setLoading(false); return; }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        const loadedPages = [];

        for (let i = 1; i <= totalPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const offCanvas = document.createElement("canvas");
          offCanvas.width = viewport.width;
          offCanvas.height = viewport.height;
          const ctx = offCanvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          loadedPages.push({
            imageData: offCanvas.toDataURL("image/png"),
            width: viewport.width,
            height: viewport.height,
          });
        }

        if (!cancelled) {
          setPages(loadedPages);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    loadPdf();
    return () => { cancelled = true; };
  }, [file]);

  // Draw watermark on all canvases when options change
  useEffect(() => {
    pages.forEach((pageData, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = pageData.width;
      canvas.height = pageData.height;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        if (text.trim()) {
          const actualFontSize = fontSize || Math.max(42, Math.min(canvas.width, canvas.height) * 0.1);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.globalAlpha = opacity;
          ctx.fillStyle = colorHex;
          ctx.font = `${actualFontSize}px ${CSS_FONT_MAP[fontFamily] || "bold Arial, sans-serif"}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      };
      img.src = pageData.imageData;
    });
  }, [pages, text, opacity, fontFamily, fontSize, colorHex]);

  if (!file) return null;

  return (
    <div className="flex h-full w-full flex-col">

      {/* Zoom controls */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">
          {pages.length > 0 ? `${pages.length} page${pages.length !== 1 ? "s" : ""}` : "Loading..."}
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-lg leading-none"
          >
            −
          </button>
          <span className="min-w-[40px] text-center text-xs font-bold text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-lg leading-none"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="ml-1 rounded-lg border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600" />
            <p className="text-sm text-slate-500">Loading pages…</p>
          </div>
        )}

        {!loading && pages.length > 0 && (
          <div className="flex flex-col items-center gap-6">
            {pages.map((pageData, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="overflow-hidden rounded-xl shadow-lg"
                  style={{ width: `${pageData.width * zoom}px`, maxWidth: "100%" }}
                >
                  <canvas
                    ref={(el) => (canvasRefs.current[idx] = el)}
                    className="block w-full"
                    style={{ width: `${pageData.width * zoom}px`, height: `${pageData.height * zoom}px` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Page {idx + 1}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && pages.length === 0 && (
          <p className="text-center text-sm text-slate-400">Preview unavailable</p>
        )}
      </div>
    </div>
  );
}



// ─── Options Sidebar Panel ────────────────────────────────────────────────────

function WatermarkOptionsPanel({
  text, setText,
  opacity, setOpacity,
  fontFamily, setFontFamily,
  fontSize, setFontSize,
  colorHex, setColorHex,
  error,
}) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">

      {/* Watermark Text */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Type className="h-3.5 w-3.5" />
          Watermark Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., CONFIDENTIAL, DRAFT…"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition-all"
        />
      </div>

      {/* Font Family */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Font
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFontFamily(f.value)}
              className={`rounded-xl border px-3 py-2 text-left text-xs transition-all ${fontFamily === f.value
                ? "border-slate-800 bg-slate-800 text-white"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"
                }`}
              style={{
                fontFamily: CSS_FONT_MAP[f.value],
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Font Size
          </label>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-800">
            {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={120}
          step={2}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="mt-3 w-full cursor-pointer accent-slate-700"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>20px</span>
          <span>120px</span>
        </div>
      </div>

      {/* Color */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              title={c.label}
              onClick={() => setColorHex(c.hex)}
              className={`h-8 w-8 rounded-full border-2 transition-all ${colorHex === c.hex
                ? "scale-110 border-slate-800 shadow-md"
                : "border-transparent hover:scale-105"
                }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {/* Custom color picker */}
          <label
            title="Custom color"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-[10px] text-slate-400 hover:border-slate-500 transition-all overflow-hidden"
          >
            <span>+</span>
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>

        {/* Color preview pill */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <div className="h-4 w-4 rounded-full border border-slate-200" style={{ backgroundColor: colorHex }} />
          <span className="text-xs font-mono text-slate-600">{colorHex.toUpperCase()}</span>
        </div>
      </div>

      {/* Opacity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Opacity
          </label>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-800">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0.05}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="mt-3 w-full cursor-pointer accent-slate-700"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>5% (subtle)</span>
          <span>100% (solid)</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddWatermark({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontFamily, setFontFamily] = useState("HelveticaBold");
  const [fontSize, setFontSize] = useState(64);
  const [colorHex, setColorHex] = useState("#718096");
  const [error, setError] = useState("");
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const file = flow.files?.[0] || null;

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-watermarked.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
  }, [file?.name]);

  const resetAll = () => {
    if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
    setWatermarkedUrl(null);
    setError("");
    setText("CONFIDENTIAL");
    setOpacity(0.3);
    setFontFamily("HelveticaBold");
    setFontSize(64);
    setColorHex("#718096");
    flow.reset();
  };

  const handleRemoveFile = () => resetAll();

  const handleDownload = () => {
    if (!watermarkedUrl) return;
    const a = document.createElement("a");
    a.href = watermarkedUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    if (!file) { setError("Please select a PDF file first!"); return; }
    if (!text.trim()) { setError("Please enter watermark text!"); return; }

    flow.startProcessing();
    startProgress();
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(STANDARD_FONT_MAP[fontFamily] || StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const { r, g, b } = hexToRgb01(colorHex);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const actualFontSize = fontSize;
        const textWidth = font.widthOfTextAtSize(text, actualFontSize);

        // page.drawText(text, {
        //   x: (width - textWidth) / 2,
        //   y: height / 2,
        //   size: actualFontSize,
        //   font,
        //   color: rgb(r, g, b),
        //   opacity,
        //   rotate: degrees(-45),
        // });

        // pdf-lib rotate origin page corner pe hota hai
        // center karne ke liye trigonometry use karna hoga
        const angle = -45 * (Math.PI / 180);
        const centerX = width / 2;
        const centerY = height / 2;

        page.drawText(text, {
          x: centerX - (textWidth / 2) * Math.cos(angle) + (actualFontSize / 2) * Math.sin(angle),
          y: centerY - (textWidth / 2) * Math.sin(angle) - (actualFontSize / 2) * Math.cos(angle),
          size: actualFontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
      setWatermarkedUrl(objectUrl);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      setError("Oops! Something went wrong while adding the watermark. Please try again.");
      flow.handleError("Watermark failed. Please try again.");
      console.error(err);
    }
  };

  // ── Custom file preview: split layout (preview left, options right)
  // const customFilePreview = file ? (
  //   <div className="w-full">
  //     {/* pdf.js CDN for canvas preview */}
  //     <Script
  //       src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
  //       strategy="afterInteractive"
  //       onLoad={() => {
  //         if (window.pdfjsLib) {
  //           window.pdfjsLib.GlobalWorkerOptions.workerSrc =
  //             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  //         }
  //       }}
  //     />

  //     <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
  //       {/* Left — Live PDF Preview */}
  //       <div className="min-h-[480px] rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
  //         <WatermarkPreview
  //           file={file}
  //           text={text}
  //           opacity={opacity}
  //           fontFamily={fontFamily}
  //           fontSize={fontSize}
  //           colorHex={colorHex}
  //         />
  //       </div>

  //       {/* Right — Options */}
  //       <div className="flex flex-col">
  //         <WatermarkOptionsPanel
  //           text={text} setText={setText}
  //           opacity={opacity} setOpacity={setOpacity}
  //           fontFamily={fontFamily} setFontFamily={setFontFamily}
  //           fontSize={fontSize} setFontSize={setFontSize}
  //           colorHex={colorHex} setColorHex={setColorHex}
  //           error={error}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // ) : null;

  return (
    <>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      <Script
        id="howto-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Watermark to PDF Online for Free",
            description: "Add text watermark to PDF pages instantly.",
            url: "https://pdflinx.com/add-watermark",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
              { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the Add Watermark to PDF tool free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, PDFLinx lets you add watermark to PDF online for free with no signup required."
                }
              },
              {
                "@type": "Question",
                name: "Can I add a text watermark to my PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can type any custom text as a watermark and apply it to all pages of your PDF."
                }
              },
              {
                "@type": "Question",
                name: "Can I control the watermark position and opacity?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can choose the position, opacity, font size, and rotation of the watermark."
                }
              },
              {
                "@type": "Question",
                name: "Will the watermark be permanent?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The watermark is permanently embedded into the PDF pages after processing."
                }
              },
              {
                "@type": "Question",
                name: "Are my files safe?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. All uploaded files are processed securely and deleted automatically after a short time."
                }
              },
              {
                "@type": "Question",
                name: "Can I add watermark to PDF on mobile?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers without any software installation."
                }
              }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Add Watermark to PDF - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Add watermark to PDF online free. Stamp custom text watermark on your PDF pages instantly with no signup and no watermark on output.",
            url: "https://pdflinx.com/add-watermark",
            screenshot: "https://pdflinx.com/og-image.png",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Add text watermark to PDF",
              "Custom watermark position and opacity",
              "Watermark rotation control",
              "Free online PDF watermark tool",
              "No signup required",
              "Secure file processing",
              "Works on mobile and desktop",
              "Instant browser-based tool"
            ],
            creator: { "@type": "Organization", name: "PDFLinx" }
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title={seo?.h1 || "Add Watermark to PDF Online Free"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Apply Watermark"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        // customFilePreview={customFilePreview}

        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

            {/* LEFT — Live Preview */}
            <div className="bg-slate-100 p-6 overflow-y-auto h-[calc(100vh-80px)]">
              <WatermarkPreview
                file={file}
                text={text}
                opacity={opacity}
                fontFamily={fontFamily}
                fontSize={fontSize}
                colorHex={colorHex}
              />
            </div>

            {/* RIGHT — Dynamic Sidebar */}
            <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 border-b border-slate-200 pb-3">
                  Add Watermark
                </h3>

                <WatermarkOptionsPanel
                  text={text} setText={setText}
                  opacity={opacity} setOpacity={setOpacity}
                  fontFamily={fontFamily} setFontFamily={setFontFamily}
                  fontSize={fontSize} setFontSize={setFontSize}
                  colorHex={colorHex} setColorHex={setColorHex}
                  error={error}
                />
              </div>

              {/* Apply button — bottom fixed */}
              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!file}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${file
                    ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  Apply Watermark
                </button>
              </div>
            </div>

          </div>
        }

        doneTitle="Your watermarked PDF is ready"
        doneDescription="Click download to save your updated PDF."
        downloadLabel="Download Watermarked PDF"
        resetLabel="Watermark another PDF"
        sidebarTitle="Add Watermark"
        sidebarIcon={<FileText className="h-5 w-5 text-white" />}
        sidebarDescription="Add a clean watermark across every page — quick and free."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Watermark</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Applies across all pages</li>
              <li>Adjust text, font, color & opacity</li>
              <li>PDF output stays readable</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"


        // ============================================================
        // ADD WATERMARK TO PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "ADD WATERMARK TO PDF",

            breadcrumbCurrent: "Add Watermark to PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark Added By Us",

            // heroTitle: (
            //   <>
            //     Add Watermark to PDF —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Fully Customizable
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Add a text or image watermark to any PDF online for free. Customize position, opacity, size, rotation, and color — applied permanently to every page. No signup, no software needed.",

            // pills: [
            //   "Text or image watermark",
            //   "Custom opacity & position",
            //   "Rotate & resize freely",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Add Watermark to PDF —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Text or Image, Free Online
                </em>
              </>
            ),
            heroDescription:
              "Add watermark to PDF online free — stamp custom text or image watermark on your PDF pages in seconds. Control position, opacity, rotation, and size. No signup, works on any device.",
            pills: ["Text & image watermark", "Custom opacity & size", "All pages at once", "Free & private"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "We Add No Watermark"],

            noticeTitle: "Add Watermark Info",
            noticeItems: [
              "Add text watermark — CONFIDENTIAL, DRAFT, etc.",
              "Upload image watermark — logo or stamp",
              "Watermark applied permanently to all pages",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Add a Watermark to a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, configure watermark, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with PDFs of any length or content type.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Configure Your Watermark",
                desc: "Type your watermark text — CONFIDENTIAL, DRAFT, DO NOT COPY — or upload a logo image. Set the position, opacity, font size, rotation angle, and color to match your exact requirements.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Watermarked PDF",
                desc: "Click Add Watermark and your stamped PDF is ready in seconds. The watermark is permanently embedded across every page — visible in every PDF viewer and in print.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Tool to Add Watermarks to PDF Online",

            seoBadge: "Add Watermark to PDF Guide",
            seoTitle: "Complete Guide to Adding Watermarks to PDF Online",
            seoDescription:
              "Everything you need to know about adding text and image watermarks to a PDF — free, online, fully customizable. No signup, no limits, we add no watermark of our own.",

            seoSections: [
              {
                title:
                  "Free PDF Watermark Tool — Add Text or Image Watermarks to Any PDF Online",
                text: "Need to add a watermark to a PDF? PDFLinx lets you stamp any text or image watermark onto a PDF online for free — instantly and without any software installation. Whether you need to mark a document as CONFIDENTIAL, DRAFT, or SAMPLE, add your company logo as a brand stamp, or protect a PDF with a DO NOT COPY notice, PDFLinx applies it cleanly and permanently to every page in seconds. No signup, no hidden limits — and unlike most tools, we add no watermark of our own to your document.",
              },
              {
                title: "Text Watermarks vs Image Watermarks — Which to Use",
                text: "PDFLinx supports both types of watermarks. Text watermarks are ideal for status labels — CONFIDENTIAL, DRAFT, FOR REVIEW, SAMPLE, VOID, COPY — typed directly and styled with your choice of font size, color, and opacity. Image watermarks are used for logos, company stamps, signatures, or any graphic mark you want applied across pages. Upload your logo as a PNG or JPG and PDFLinx places it on every page exactly where you specify. Both types support full position, size, rotation, and opacity control.",
              },
              {
                title: "Watermark Customization — Position, Opacity, Rotation & Color",
                text: "A watermark that is too dark obscures the document content. A watermark placed incorrectly clashes with text. PDFLinx gives you full control over every aspect of your watermark. Set opacity from subtle to prominent — typically 20 to 40 percent works well for background watermarks. Choose from nine positions across the page — top left, top center, top right, middle, bottom corners, and center diagonal. Rotate the watermark at any angle — diagonal watermarks at 45 degrees are the most common for CONFIDENTIAL and DRAFT stamps. Adjust font size and color for text watermarks. Everything is configurable before you apply.",
              },
              {
                title: "Why Add a Watermark — Common Reasons and Use Cases",
                text: "Watermarks serve several important purposes across business, legal, creative, and academic contexts. Confidentiality marking protects sensitive documents shared for review — the CONFIDENTIAL stamp signals that the document is not for public distribution. Draft marking prevents an unfinished version from being mistaken for a final document. Copyright protection adds a visible deterrent to unauthorized reproduction of creative or proprietary content. Brand watermarking stamps company logos on client-facing documents for brand consistency. Sample marking prevents recipients from using a document as a real deliverable before payment or approval.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Watermark Tool — We Add No Watermark of Our Own",
                text: "The irony of most free watermark tools is that they add their own watermark to your document along with yours — completely undermining the purpose. PDFLinx adds only your watermark and nothing else. Completely free, no signup, no platform watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict watermark customization and add branding on free tiers, PDFLinx gives you clean, professional watermarking at zero cost.",
              },
              {
                title: "Common Use Cases for Adding Watermarks to PDF",
                text: "✓ Legal & Compliance: Mark contracts, NDAs, and legal documents as CONFIDENTIAL or FOR INTERNAL USE ONLY before sharing for review.\n✓ Business & Finance: Stamp financial reports, invoices, and proposals as DRAFT until finalized and approved.\n✓ Design & Creative: Watermark portfolio PDFs, mockups, and creative work with a logo or SAMPLE stamp before client approval and payment.\n✓ Publishing & Education: Mark review copies, advance reader copies, or student handouts with appropriate status labels.\n✓ HR & Administration: Stamp employee documents, offer letters, and policies with DRAFT or CONFIDENTIAL as appropriate.\n✓ Photography & Media: Add logo or copyright watermarks to PDF portfolios and image collections before distribution.",
              },
              {
                title:
                  "Add Watermark to PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the watermarked file in seconds. Whether you need to watermark a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when watermarking confidential business, legal, or financial documents. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title: "Is the Watermark Permanent — Can It Be Removed?",
                text: "Watermarks added by PDFLinx are permanently embedded into the PDF page content — they are not a removable annotation or an editable layer. The watermark becomes part of every page image and cannot be stripped out using a standard PDF viewer. For most practical purposes — sharing, printing, reviewing — the watermark is permanent and effective. Keep in mind that no watermark is completely tamper-proof against advanced PDF editing software, but for all everyday use cases, a PDFLinx watermark provides reliable, visible protection.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx add watermark tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of PDFs you watermark or how many times you use it.",
              },
              {
                q: "Does PDFLinx add its own watermark to my document?",
                a: "No — never. PDFLinx adds only the watermark you configure. Unlike many free tools, we do not stamp any platform branding or logo onto your document.",
              },
              {
                q: "Can I add a text watermark like CONFIDENTIAL or DRAFT?",
                a: "Yes. Type any text you need — CONFIDENTIAL, DRAFT, SAMPLE, VOID, FOR REVIEW, DO NOT COPY, or any custom text — and style it with your choice of size, color, and opacity.",
              },
              {
                q: "Can I add an image watermark — like my company logo?",
                a: "Yes. Upload a PNG or JPG image as your watermark — a logo, signature, stamp, or any graphic — and PDFLinx places it on every page in your chosen position.",
              },
              {
                q: "Can I control how transparent the watermark is?",
                a: "Yes. Set the opacity from very subtle to fully visible. A transparency of 20 to 40 percent is typical for background watermarks that do not obscure the main content.",
              },
              {
                q: "Can I rotate the watermark diagonally?",
                a: "Yes. Set any rotation angle — 45 degrees diagonal is the most common for CONFIDENTIAL and DRAFT stamps, but you can use any angle you prefer.",
              },
              {
                q: "Where can I position the watermark on the page?",
                a: "PDFLinx supports multiple position options — center, top left, top right, bottom left, bottom right, and full diagonal across the page. Choose whichever fits your document layout.",
              },
              {
                q: "Is the watermark applied to every page?",
                a: "Yes. The watermark is applied consistently to every page of the PDF by default — ensuring uniform marking across the entire document.",
              },
              {
                q: "Is the watermark permanent — can it be removed?",
                a: "Watermarks added by PDFLinx are permanently embedded into the page content and cannot be removed with standard PDF viewers. They are effective for all everyday use cases — sharing, printing, and reviewing.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and add your watermark instantly — no email, no registration, no friction.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting first using our free PDF Split tool, watermark each part, then merge them back.",
              },
              {
                q: "Can I add a watermark to a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then add your watermark.",
              },
              {
                q: "How long does adding a watermark take?",
                a: "Most operations complete within 5 to 15 seconds depending on file size and number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for adding watermarks?",
                a: "Yes — PDFLinx adds only your watermark with zero platform branding, full customization, no daily limits, and no account required. iLovePDF and Smallpdf restrict watermark options and add their own branding on free tiers.",
              },
            ],

            ctaTitle: (
              <>
                Add a watermark to your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, professional PDF watermarking every day.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>
  );
}

