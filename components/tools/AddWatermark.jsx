"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import {
  CheckCircle,
  FileText,
  Type,
  Zap,
  ShieldCheck,
  MonitorSmartphone,
  Lock,
  RotateCcw,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

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

// ─── Live Canvas Preview ──────────────────────────────────────────────────────

function WatermarkPreview({ file, text, opacity, fontFamily, fontSize, colorHex }) {
  const canvasRef = useRef(null);
  const [pdfPage, setPdfPage] = useState(null); // { imageData, width, height }
  const [loading, setLoading] = useState(false);

  // Load first page of PDF as image via pdf.js (CDN)
  useEffect(() => {
    if (!file) { setPdfPage(null); return; }
    let cancelled = false;
    setLoading(true);

    const loadPdf = async () => {
      try {
        // Use pdfjsLib from CDN (loaded via Script tag below)
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) { setLoading(false); return; }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const offCanvas = document.createElement("canvas");
        offCanvas.width = viewport.width;
        offCanvas.height = viewport.height;
        const ctx = offCanvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;

        if (!cancelled) {
          setPdfPage({
            imageData: offCanvas.toDataURL("image/png"),
            width: viewport.width,
            height: viewport.height,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    loadPdf();
    return () => { cancelled = true; };
  }, [file]);

  // Draw watermark overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfPage) return;
    const ctx = canvas.getContext("2d");

    canvas.width = pdfPage.width;
    canvas.height = pdfPage.height;

    // Draw PDF page
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw watermark
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
    img.src = pdfPage.imageData;
  }, [pdfPage, text, opacity, fontFamily, fontSize, colorHex]);

  if (!file) return null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-slate-100 p-4">
      {loading && (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600" />
          <p className="text-sm text-slate-500">Loading preview…</p>
        </div>
      )}
      {!loading && pdfPage && (
        <div className="relative w-full overflow-auto rounded-xl shadow-xl">
          <canvas
            ref={canvasRef}
            className="mx-auto block max-h-[72vh] w-full rounded-xl object-contain"
            style={{ maxWidth: "100%" }}
          />
          <p className="mt-2 text-center text-xs text-slate-400">
            Live preview — Page 1 of your PDF
          </p>
        </div>
      )}
      {!loading && !pdfPage && (
        <p className="text-sm text-slate-400">Preview unavailable</p>
      )}
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
        uploadLanding={{
          content: {
            eyebrow: "ADD WATERMARK",
            heroTitle: (
              <>
                Add Watermark to PDF <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly
                </em>
              </>
            ),
            heroDescription:
              "Add watermark to PDF online for free using custom text like CONFIDENTIAL, DRAFT, SAMPLE, or your company name. Apply clean watermarks across every page instantly with no signup or software installation.",
            noticeTitle: "Watermark output",
            noticeItems: [
              "Single PDF → Watermarked PDF",
              "Custom text watermark",
              "Adjust font, color & opacity",
            ],
            howToTitle: "How to add watermark to PDF",
            howToSubtitle:
              "Upload your PDF, type the watermark text, customize the style, and download the updated file in seconds.",
            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Choose a PDF file from your device or drag & drop it into the uploader.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Set watermark text & style",
                desc: "Type your watermark text and adjust font, color, size, and opacity for a professional appearance.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Apply & download",
                desc: "Apply the watermark across all pages and download your updated PDF instantly.",
                color: "bg-emerald-600",
              },
            ],
            whyTitle: "Why use PDFLinx watermark tool?",
            whyItems: [
              {
                title: "Your Text, Your Way",
                desc: "Add any watermark text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
                icon: Type,
                iconColor: "text-gray-600",
                bgColor: "bg-gray-100",
              },
              {
                title: "Applies on Every Page",
                desc: "The watermark is automatically added across all pages of your PDF without extra editing work.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
              {
                title: "Fast & Free",
                desc: "Add watermark to PDF online in seconds with no signup, no installation, and no hidden limits.",
                icon: Zap,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "Professional Watermarking",
                desc: "Create clean and subtle watermarks that protect your files without affecting readability.",
                icon: ShieldCheck,
                iconColor: "text-violet-600",
                bgColor: "bg-violet-100",
              },
              {
                title: "Works Everywhere",
                desc: "Use PDFLinx on Windows, macOS, Linux, Android, iPhone, tablet, or desktop browsers.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Privacy Friendly",
                desc: "Your PDF files are processed securely and are not stored permanently after watermarking.",
                icon: Lock,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],
            seoBadge: "PDF Watermark Guide",
            seoTitle: "Free Online Add Watermark to PDF Tool by PDFLinx",
            seoDescription:
              "Add text watermark to PDF online for free using custom labels like CONFIDENTIAL, DRAFT, SAMPLE, or company branding. Apply watermark across every page instantly.",
            seoSections: [
              {
                title: "Add Text Watermarks Across All PDF Pages",
                text: "PDFLinx lets you apply custom text watermarks to every page of your PDF automatically without editing pages one by one.",
              },
              {
                title: "Useful for Confidential and Draft Documents",
                text: "Add labels like CONFIDENTIAL, DRAFT, SAMPLE, INTERNAL, or DO NOT COPY to clearly mark document status and protect sensitive files.",
              },
              {
                title: "Protect Ownership and Branding",
                text: "Use watermarks to add your name, company, copyright text, or branding directly on PDF documents before sharing.",
              },
              {
                title: "Clean and Professional Watermark Output",
                text: "Adjust font, color, size, and opacity to create subtle, readable, and professional-looking PDF documents.",
              },
              {
                title: "Works on Mobile and Desktop Devices",
                text: "Use the PDFLinx watermark tool directly in your browser on Windows, macOS, Linux, Android, iPhone, and tablets.",
              },
              {
                title: "No Signup, No Watermark Ads",
                text: "Add watermark to PDF online for free with no account required, no software installation, and no extra branding added to your file.",
              },
            ],
            faqTitle: "Frequently asked questions",
            faqs: [
              {
                q: "Is the Add Watermark to PDF tool free?",
                a: "Yes. PDFLinx lets you add watermark to PDF online for free with unlimited usage and no signup required.",
              },
              {
                q: "Can I apply watermark on every page automatically?",
                a: "Yes. The watermark is added across all PDF pages automatically.",
              },
              {
                q: "What watermark text can I use?",
                a: "You can use any custom text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
              },
              {
                q: "Can I change the font, color, and size?",
                a: "Yes. PDFLinx lets you pick the font family, adjust font size, choose a color, and control opacity for the watermark.",
              },
              {
                q: "Will watermark affect PDF readability?",
                a: "No. You can adjust opacity and size to keep the watermark subtle and professional.",
              },
              {
                q: "Do I need to install software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },
              {
                q: "Can I use this tool on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },
              {
                q: "Are my uploaded PDFs secure?",
                a: "Yes. Files are processed securely and are not stored permanently after processing.",
              },
            ],
          },
        }}
      />
    </>
  );
}

