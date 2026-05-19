"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Hash,
  FileText,
  CheckCircle,
  Settings,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import Script from "next/script";
import dynamic from "next/dynamic";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

const PageNumberPreview = dynamic(
  () => import("@/components/PageNumberPreview"),
  { ssr: false }
);

// ─── Position map: 9-dot grid key → API value ────────────────────────────────
const DOT_POSITIONS = [
  { key: "top-left", label: "Top Left" },
  { key: "top-center", label: "Top Center" },
  { key: "top-right", label: "Top Right" },
  { key: "middle-left", label: "Middle Left" },
  { key: "middle-center", label: "Middle Center" },
  { key: "middle-right", label: "Middle Right" },
  { key: "bottom-left", label: "Bottom Left" },
  { key: "bottom-center", label: "Bottom Center" },
  { key: "bottom-right", label: "Bottom Right" },
];

// ─── Number format options ────────────────────────────────────────────────────
const NUMBER_FORMATS = [
  { id: "n", label: "1", preview: (n) => `${n}` },
  { id: "page-n", label: "Page 1", preview: (n) => `Page ${n}` },
  { id: "n-of-t", label: "1 / 10", preview: (n) => `${n} / 10` },
  { id: "dash-n", label: "- 1 -", preview: (n) => `- ${n} -` },
];

// ─── Font families ────────────────────────────────────────────────────────────
const FONTS = ["Helvetica", "Times New Roman", "Courier", "Arial", "Georgia"];

// ─── Font colors ─────────────────────────────────────────────────────────────
const FONT_COLORS = [
  { hex: "#000000", label: "Black" },
  { hex: "#374151", label: "Dark Gray" },
  { hex: "#6b7280", label: "Gray" },
  { hex: "#ef4444", label: "Red" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#8b5cf6", label: "Purple" },
];

// ─── 9-dot Position Picker ────────────────────────────────────────────────────
function PositionPicker({ value, onChange }) {
  return (
    <div className="inline-grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-100 border border-slate-200">
      {DOT_POSITIONS.map((pos) => {
        const isActive = value === pos.key;
        return (
          <button
            key={pos.key}
            type="button"
            title={pos.label}
            onClick={() => onChange(pos.key)}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group ${isActive
              ? "bg-[#f24d0d] shadow-[0_4px_14px_rgba(242,77,13,0.4)]"
              : "bg-white border-2 border-slate-200 hover:border-[#f24d0d] hover:bg-orange-50"
              }`}
          >
            {/* Mini page icon */}
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              {/* Page outline */}
              <rect
                x="1" y="1" width="18" height="22" rx="2"
                fill={isActive ? "rgba(255,255,255,0.15)" : "#f8fafc"}
                stroke={isActive ? "rgba(255,255,255,0.5)" : "#cbd5e1"}
                strokeWidth="1.2"
              />
              {/* Content lines */}
              {[5, 8, 11].map((y) => (
                <rect
                  key={y} x="3.5" y={y} width="13" height="1.2" rx="0.6"
                  fill={isActive ? "rgba(255,255,255,0.35)" : "#e2e8f0"}
                />
              ))}
              {/* Number dot — position specific */}
              <NumberDot posKey={pos.key} isActive={isActive} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function NumberDot({ posKey, isActive }) {
  const dotColor = isActive ? "#fff" : "#f24d0d";
  const positions = {
    "top-left": { x: 3.5, y: 2.5 },
    "top-center": { x: 8.5, y: 2.5 },
    "top-right": { x: 13.5, y: 2.5 },
    "middle-left": { x: 3.5, y: 11 },
    "middle-center": { x: 8.5, y: 11 },
    "middle-right": { x: 13.5, y: 11 },
    "bottom-left": { x: 3.5, y: 19.5 },
    "bottom-center": { x: 8.5, y: 19.5 },
    "bottom-right": { x: 13.5, y: 19.5 },
  };
  const p = positions[posKey];
  if (!p) return null;
  return <circle cx={p.x + 1} cy={p.y + 0.5} r="1.8" fill={dotColor} />;
}

// ─── Format Selector ──────────────────────────────────────────────────────────
function FormatSelector({ value, onChange, startNumber }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {NUMBER_FORMATS.map((fmt) => (
        <button
          key={fmt.id}
          type="button"
          onClick={() => onChange(fmt.id)}
          className={`rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-all duration-150 ${value === fmt.id
            ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
          <span className="block text-base font-bold mb-0.5">
            {fmt.preview(startNumber)}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            {fmt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FONT_COLORS.map((c) => (
        <button
          key={c.hex}
          type="button"
          title={c.label}
          onClick={() => onChange(c.hex)}
          className="w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110"
          style={{
            background: c.hex,
            borderColor: value === c.hex ? "#f24d0d" : "transparent",
            outline: value === c.hex ? "2px solid #f24d0d" : "none",
            outlineOffset: "2px",
          }}
        />
      ))}
      {/* Custom hex input */}
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full border-2 border-slate-200 cursor-pointer bg-transparent p-0"
          title="Custom color"
        />
      </label>
    </div>
  );
}

// ─── Sidebar Section wrapper ──────────────────────────────────────────────────
function SideSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h4>
      {children}
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, min = 1, max = 9999, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-9 w-9 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-bold hover:border-[#f24d0d] hover:text-[#f24d0d] transition text-lg flex items-center justify-center"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || min)}
          className="flex-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-sm font-bold outline-none focus:border-[#f24d0d] transition"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-9 w-9 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-bold hover:border-[#f24d0d] hover:text-[#f24d0d] transition text-lg flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AddPageNumbers() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [error, setError] = useState("");
  const [downloadFile, setDownloadFile] = useState(null);

  // Settings
  const [position, setPosition] = useState("bottom-center");
  const [format, setFormat] = useState("n");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [margin, setMargin] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Helvetica");

  const file = flow.files?.[0] || null;

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-page-numbers.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
  }, [file?.name]);

  useEffect(() => {
    setError("");
    setDownloadFile(null);
  }, [file]);

  const resetAll = () => {
    setError("");
    setDownloadFile(null);
    setPosition("bottom-center");
    setFormat("n");
    setStartNumber(1);
    setFontSize(14);
    setMargin(20);
    setFontColor("#000000");
    setFontFamily("Helvetica");
    flow.reset();
  };

  const handleDownload = () => {
    if (!downloadFile?.blob) return;
    const urlObj = URL.createObjectURL(downloadFile.blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = downloadFile.filename || outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };

  const handleConvert = async () => {
    if (!file) return flow.handleError("Please select a PDF file first!");
    flow.startProcessing();
    startProgress();
    setError("");
    setDownloadFile(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    formData.append("format", format);
    formData.append("startNumber", String(startNumber));
    formData.append("fontSize", String(fontSize));
    formData.append("margin", String(margin));
    formData.append("fontColor", fontColor);
    formData.append("fontFamily", fontFamily);

    try {
      const res = await fetch("/convert/add-page-numbers", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let msg = "Failed to add page numbers";
        try { const j = await res.json(); msg = j?.error || msg; } catch { }
        throw new Error(msg);
      }
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/pdf")) throw new Error("Unexpected response from server.");

      const blob = await res.blob();
      setDownloadFile({ blob, filename: outputFilename });

      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = outputFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      const msg = err?.message || "Something went wrong, please try again.";
      setError(msg);
      cancelProgress();
      flow.handleError(msg);
      console.error(err);
    }
  };

  // ── iLovePDF-style custom layout ─────────────────────────────────────────
  const customOptionsLayout = (
    <div
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f3f5f9] shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* ── TOP TOOLBAR ── */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f24d0d] text-white shadow-lg">
            <Hash className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Page Numbers</h2>
            <p className="text-xs text-slate-500">
              {file ? file.name : "Customize and apply page numbering"}
            </p>
          </div>
        </div>
        {file && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="max-w-[200px] truncate text-xs font-semibold text-slate-600">
                {file.name}
              </span>
              <span className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px]">

        {/* ══ LEFT: PDF PREVIEW ══ */}
        <div className="relative bg-[#eef1f6]">
          {/* Preview toolbar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Live Preview</h3>
              <p className="text-xs text-slate-400">
                {file ? "Page numbers update as you change settings" : "Upload a PDF to see preview"}
              </p>
            </div>
            {/* Live settings badge */}
            {file && (
              <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-[#f24d0d] animate-pulse" />
                <span className="text-xs font-semibold text-[#f24d0d]">Live</span>
              </div>
            )}
          </div>

          {/* Scrollable preview */}
          <div
            className="overflow-auto p-6"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="mx-auto max-w-[900px]">
              {file ? (
                // <PageNumberPreview
                //   file={file}
                //   position={position}
                //   startNumber={startNumber}
                //   fontSize={fontSize}
                //   margin={margin}
                // />

                <PageNumberPreview
                  file={file}
                  position={position}
                  startNumber={startNumber}
                  fontSize={fontSize}
                  margin={margin}
                  fontColor={fontColor}
                  fontFamily={fontFamily}
                  format={format}  // ← ADD

                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/60">
                  <div className="text-center px-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                      <FileText className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Upload a PDF to see live preview</p>
                    <p className="mt-1 text-xs text-slate-400">Page numbers will appear based on your settings</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ RIGHT: SETTINGS SIDEBAR ══ */}
        <div className="border-l border-slate-200 bg-white">
          <div
            className="sticky top-0 overflow-y-auto"
            style={{ height: "calc(100vh - 140px)" }}
          >
            {/* Sidebar header */}
            <div className="border-b border-slate-100 px-5 py-5">
              <h3 className="text-base font-bold text-slate-900">Numbering Settings</h3>
              <p className="mt-0.5 text-xs text-slate-400">Customize position, format and style</p>
            </div>

            <div className="space-y-4 p-5">

              {/* 1. Position Picker */}
              <SideSection title="Position">
                <div className="flex flex-col items-center gap-3">
                  <PositionPicker value={position} onChange={setPosition} />
                  {/* Selected label */}
                  <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2 w-full justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f24d0d]" />
                    <span className="text-xs font-semibold text-[#f24d0d]">
                      {DOT_POSITIONS.find((p) => p.key === position)?.label}
                    </span>
                  </div>
                </div>
              </SideSection>

              {/* 2. Number Format */}
              <SideSection title="Number Format">
                <FormatSelector
                  value={format}
                  onChange={setFormat}
                  startNumber={startNumber}
                />
              </SideSection>

              {/* 3. Start Number */}
              <SideSection title="Numbering">
                <NumInput
                  label="Start from"
                  value={startNumber}
                  onChange={setStartNumber}
                  min={1}
                  hint="First page number"
                />
              </SideSection>

              {/* 4. Typography */}
              <SideSection title="Typography">
                {/* Font size */}
                <NumInput
                  label="Font size"
                  value={fontSize}
                  onChange={setFontSize}
                  min={8}
                  max={48}
                  hint="8–48 px"
                />

                {/* Font family */}
                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Font family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-[#f24d0d] transition bg-white"
                  >
                    {FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Font color */}
                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">
                    Color
                  </label>
                  <ColorPicker value={fontColor} onChange={setFontColor} />
                </div>
              </SideSection>

              {/* 5. Margin */}
              <SideSection title="Spacing">
                <NumInput
                  label="Margin from edge"
                  value={margin}
                  onChange={setMargin}
                  min={0}
                  max={100}
                  hint="0–100 px"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Distance between page number and the page edge
                </p>
              </SideSection>

              {/* Security badge */}
              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Files are encrypted and auto-deleted after processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={!file}
                className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${file
                  ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_12px_32px_rgba(242,77,13,0.38)]"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Hash className="h-5 w-5" />
                  {file ? "Add Page Numbers" : "Upload a PDF to continue"}
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── SEO Schemas (unchanged) ── */}
      <Script
        id="howto-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Page Numbers to a PDF Online for Free",
            description: "Insert page numbers into a PDF in 3 quick steps.",
            url: "https://pdflinx.com/add-page-numbers",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF file to which you want to add page numbers." },
              { "@type": "HowToStep", name: "Choose settings", text: "Select position, format, start number, font size and margin." },
              { "@type": "HowToStep", name: "Download", text: "Click Add Page Numbers and download your updated PDF instantly." },
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Page Numbers", item: "https://pdflinx.com/add-page-numbers" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the Add Page Numbers to PDF tool free?", acceptedAnswer: { "@type": "Answer", text: "Yes, PDFLinx lets you add page numbers to PDF online for free with no signup required." } },
              { "@type": "Question", name: "Can I choose where page numbers appear?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can place page numbers at the top or bottom, and align them left, center, or right." } },
              { "@type": "Question", name: "Can I start numbering from any number?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can begin numbering from 1, 5, 10, or any number you need." } },
              { "@type": "Question", name: "Will adding page numbers change my original PDF layout?", acceptedAnswer: { "@type": "Answer", text: "No. The original PDF layout stays the same. Only page numbers are added to the pages." } },
              { "@type": "Question", name: "Are my PDF files safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and deleted automatically after a short time." } },
              { "@type": "Question", name: "Can I add page numbers to PDF on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers." } },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="software-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Add Page Numbers to PDF - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/add-page-numbers",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }, null, 2),
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      <ToolPageLayout
        title="Add Page Numbers to PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Add Page Numbers"
        flow={flow}
        progress={progress}
        onRemoveFile={resetAll}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        customOptionsLayout={customOptionsLayout}
        doneTitle="Your numbered PDF is ready"
        doneDescription="Your file was processed successfully."
        downloadLabel="Download PDF"
        resetLabel="Add numbers to another PDF"
        sidebarTitle="Add Page Numbers"
        sidebarIcon={<Hash className="h-5 w-5 text-white" />}
        sidebarDescription="Add clean page numbering without changing the layout."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Tip</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Works great for reports & assignments</li>
              <li>Preview the position before exporting</li>
              <li>Original PDF content stays unchanged</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"
        uploadLanding={{
          content: {
            eyebrow: "ADD PAGE NUMBERS",
            heroTitle: (
              <>
                Add page numbers <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">to any PDF</em>
              </>
            ),
            heroDescription:
              "Add page numbers to PDF online for free without changing the rest of your document. Choose the position, starting number, font size, and download your updated PDF instantly — no signup or watermark required.",
            noticeTitle: "Page numbering",
            noticeItems: [
              "Single PDF → Updated numbered PDF",
              "Choose position and start number",
              "No signup, no watermark",
            ],
            howToTitle: "How to add page numbers to PDF",
            howToSubtitle: "Upload your PDF, customize the numbering settings, and download the updated file in seconds.",
            howToSteps: [
              { n: "1", title: "Upload your PDF", desc: "Choose a PDF from your device or drag & drop it into the uploader.", color: "bg-blue-600" },
              { n: "2", title: "Choose numbering settings", desc: "Select page number position, alignment, start number, margin, and font size.", color: "bg-purple-600" },
              { n: "3", title: "Apply & download", desc: "Insert page numbers instantly and download your updated PDF file.", color: "bg-emerald-600" },
            ],
            whyTitle: "Why use PDFLinx to add page numbers?",
            whyItems: [
              { title: "Add Numbers Anywhere", desc: "Place page numbers at the top or bottom and align them left, center, or right.", icon: Hash, iconColor: "text-indigo-500", bgColor: "bg-indigo-50" },
              { title: "Keeps Original Layout", desc: "Only the numbering is added. Your PDF design and content remain unchanged.", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
              { title: "Fast & Free", desc: "Add page numbers to PDF online in seconds with no watermark or signup.", icon: CheckCircle, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
              { title: "Custom Numbering Options", desc: "Choose the starting page number, font size, color and spacing.", icon: Settings, iconColor: "text-violet-500", bgColor: "bg-violet-50" },
              { title: "Works on All Devices", desc: "Use PDFLinx on desktop, tablet, Android, iPhone, Windows, macOS, and Linux.", icon: MonitorSmartphone, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
              { title: "Secure Processing", desc: "Uploaded files are processed securely and automatically deleted after processing.", icon: ShieldCheck, iconColor: "text-rose-500", bgColor: "bg-rose-50" },
            ],
            seoBadge: "PDF Numbering Guide",
            seoTitle: "Free Online Add Page Numbers to PDF Tool by PDFLinx",
            seoDescription: "Add page numbers to PDF online without changing the original layout. Customize numbering position, alignment, and start number directly in your browser.",
            seoSections: [
              { title: "Add Page Numbers Without Editing the Whole PDF", text: "PDFLinx lets you insert page numbers into PDF files without recreating the document from scratch." },
              { title: "Choose Position, Format, and Start Number", text: "Place page numbers anywhere — top left, bottom center, and more — with 4 format styles." },
              { title: "Custom Font, Color & Size", text: "Pick font size, family, and color to match your document's branding." },
              { title: "Works on Desktop and Mobile Devices", text: "Use PDFLinx directly in your browser on all platforms without installing software." },
              { title: "Fast, Free, and No Watermark", text: "Add page numbers to PDF online for free with no signup and no watermark added." },
              { title: "Secure PDF Processing", text: "Your uploaded files are processed securely and automatically deleted after processing." },
            ],
            faqTitle: "Frequently asked questions",
            faqs: [
              { q: "Is the Add Page Numbers to PDF tool free?", a: "Yes. PDFLinx lets you add page numbers to PDF online for free without signup or hidden charges." },
              { q: "Can I choose where the page numbers appear?", a: "Yes. You can place page numbers at the top or bottom and align them left, center, or right." },
              { q: "Can I start numbering from a custom number?", a: "Yes. You can start page numbering from any number such as 5, 10, or another custom value." },
              { q: "Will the PDF layout remain unchanged?", a: "Yes. Only the page numbers are added. The original PDF formatting and layout stay the same." },
              { q: "Can I add page numbers to scanned PDFs?", a: "Yes. The tool also works for scanned PDFs, reports, invoices, books, and printable documents." },
              { q: "Do I need to install software?", a: "No. Everything works directly in your browser on desktop and mobile devices." },
              { q: "Are my uploaded files secure?", a: "Yes. Files are processed securely and automatically deleted after processing." },
              { q: "Can I use this tool on mobile?", a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers." },
            ],
          },
        }}
      />
    </>
  );
}





























// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Hash,
//   FileText,
//   CheckCircle,
//   Settings,
//   MonitorSmartphone,
//   ShieldCheck,
// } from "lucide-react";
// // import { CheckCircle, FileText, Hash, Settings } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import dynamic from "next/dynamic";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";



// const PageNumberPreview = dynamic(
//   () => import("@/components/PageNumberPreview"),
//   { ssr: false }
// );

// export default function AddPageNumbers() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } =
//     useProgressBar();

//   const [error, setError] = useState("");
//   const [downloadFile, setDownloadFile] = useState(null); // { blob, filename }

//   const [position, setPosition] = useState("bottom-center");
//   const [startNumber, setStartNumber] = useState(1);
//   const [fontSize, setFontSize] = useState(14);
//   const [margin, setMargin] = useState(20);

//   const file = flow.files?.[0] || null;

//   const outputFilename = useMemo(() => {
//     if (!file?.name) return "pdflinx-page-numbers.pdf";
//     return file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
//   }, [file?.name]);

//   useEffect(() => {
//     setError("");
//     setDownloadFile(null);
//   }, [file]);

//   const resetAll = () => {
//     setError("");
//     setDownloadFile(null);
//     setPosition("bottom-center");
//     setStartNumber(1);
//     setFontSize(14);
//     setMargin(20);
//     flow.reset();
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!file) return alert("Please select a PDF file first!");

//   //   startProgress();
//   //   setSuccess(false);

//   //   const formData = new FormData();
//   //   formData.append("file", file);
//   //   formData.append("position", position);
//   //   formData.append("startNumber", String(startNumber));
//   //   formData.append("fontSize", String(fontSize));
//   //   formData.append("margin", String(margin));

//   //   try {
//   //     const res = await fetch("/convert/add-page-numbers", {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     if (!res.ok) {
//   //       let msg = "Failed to add page numbers";
//   //       try {
//   //         const maybeJson = await res.json();
//   //         msg = maybeJson?.error || msg;
//   //       } catch {}
//   //       throw new Error(msg);
//   //     }

//   //     const contentType = (res.headers.get("content-type") || "").toLowerCase();

//   //     if (!contentType.includes("application/pdf")) {
//   //       throw new Error("Unexpected response from server.");
//   //     }

//   //     const blob = await res.blob();
//   //     const url = window.URL.createObjectURL(blob);

//   //     const a = document.createElement("a");
//   //     a.href = url;
//   //     a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
//   //     document.body.appendChild(a);
//   //     a.click();
//   //     a.remove();

//   //     window.URL.revokeObjectURL(url);

//   //     completeProgress();
//   //     setSuccess(true);
//   //     setFile(null);
//   //     setPosition("bottom-center");
//   //     setStartNumber(1);
//   //     setFontSize(14);
//   //     setMargin(20);
//   //     e.target.reset();
//   //   } catch (err) {
//   //     cancelProgress();
//   //     alert(err.message || "Something went wrong, please try again.");
//   //     console.error(err);
//   //   }
//   // };

//   const handleDownload = () => {
//     if (!downloadFile?.blob) return;
//     const urlObj = URL.createObjectURL(downloadFile.blob);
//     const a = document.createElement("a");
//     a.href = urlObj;
//     a.download = downloadFile.filename || outputFilename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(urlObj);
//   };

//   const handleConvert = async () => {
//     if (!file) return flow.handleError("Please select a PDF file first!");

//     flow.startProcessing();
//     startProgress();
//     setError("");
//     setDownloadFile(null);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("position", position);
//     formData.append("startNumber", String(startNumber));
//     formData.append("fontSize", String(fontSize));
//     formData.append("margin", String(margin));

//     try {
//       const res = await fetch("/convert/add-page-numbers", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Failed to add page numbers";
//         try {
//           const maybeJson = await res.json();
//           msg = maybeJson?.error || msg;
//         } catch { }
//         throw new Error(msg);
//       }

//       const contentType = (res.headers.get("content-type") || "").toLowerCase();

//       if (!contentType.includes("application/pdf")) {
//         throw new Error("Unexpected response from server.");
//       }

//       const blob = await res.blob();
//       setDownloadFile({ blob, filename: outputFilename });

//       // Keep existing behavior: auto-download
//       const urlObj = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = urlObj;
//       a.download = outputFilename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(urlObj);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       const msg = err?.message || "Something went wrong, please try again.";
//       setError(msg);
//       cancelProgress();
//       flow.handleError(msg);
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-add-page-numbers"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Add Page Numbers to a PDF Online for Free",
//               description:
//                 "Insert page numbers into a PDF in 3 quick steps. Upload your file, choose the number position and style, and download the updated PDF instantly.",
//               url: "https://pdflinx.com/add-page-numbers",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload PDF",
//                   text: "Upload the PDF file to which you want to add page numbers.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Choose page number settings",
//                   text: "Select the position, starting number, font size, and margin for your page numbers.",
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Download updated PDF",
//                   text: "Click the add page numbers button and download your numbered PDF instantly.",
//                 },
//               ],
//               totalTime: "PT20S",
//               estimatedCost: {
//                 "@type": "MonetaryAmount",
//                 value: "0",
//                 currency: "USD",
//               },
//               image: "https://pdflinx.com/og-image.png",
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-add-page-numbers"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 {
//                   "@type": "ListItem",
//                   position: 1,
//                   name: "Home",
//                   item: "https://pdflinx.com",
//                 },
//                 {
//                   "@type": "ListItem",
//                   position: 2,
//                   name: "Add Page Numbers",
//                   item: "https://pdflinx.com/add-page-numbers",
//                 },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="faq-schema-add-page-numbers"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: [
//                 {
//                   "@type": "Question",
//                   name: "Is the Add Page Numbers to PDF tool free?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes, PDFLinx lets you add page numbers to PDF online for free with no signup required.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I choose where page numbers appear?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. You can place page numbers at the top or bottom, and align them left, center, or right.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I start numbering from any number?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. You can begin numbering from 1, 5, 10, or any number you need.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Will adding page numbers change my original PDF layout?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "No. The original PDF layout stays the same. Only page numbers are added to the pages.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Are my PDF files safe?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. Files are processed securely and deleted automatically after a short time.",
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: "Can I add page numbers to PDF on mobile?",
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers.",
//                   },
//                 },
//               ],
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         id="software-schema-add-page-numbers"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(
//             {
//               "@context": "https://schema.org",
//               "@type": "SoftwareApplication",
//               name: "Add Page Numbers to PDF - PDFLinx",
//               applicationCategory: "BusinessApplication",
//               operatingSystem: "Web Browser",
//               description:
//                 "Add page numbers to PDF online free. Insert page numbering anywhere in your PDF instantly with no signup and no watermark.",
//               url: "https://pdflinx.com/add-page-numbers",
//               offers: {
//                 "@type": "Offer",
//                 price: "0",
//                 priceCurrency: "USD",
//               },
//               featureList: [
//                 "Add page numbers to PDF",
//                 "Choose PDF page number position",
//                 "Start numbering from any number",
//                 "Free online PDF page numbering tool",
//                 "No watermark",
//                 "Secure file processing",
//                 "Works on mobile and desktop",
//                 "Instant browser-based tool",
//               ],
//               creator: {
//                 "@type": "Organization",
//                 name: "PDFLinx",
//               },
//             },
//             null,
//             2
//           ),
//         }}
//       />

//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onReady={() => {
//           if (window?.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//           }
//         }}
//       />

//       <ToolPageLayout
//         title="Add Page Numbers to PDF Online Free"
//         tagline="No Signup · No Watermark · Instant Download"
//         accept="application/pdf"
//         multiple={false}
//         convertLabel="Add Page Numbers"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={resetAll}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}

//         customOptionsLayout={
//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

//             {/* LEFT — existing customFilePreview content minus settings */}
//             <div className="bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">
//               <div className="mx-auto w-full max-w-[900px] space-y-5">
//                 {file && (
//                   <PageNumberPreview
//                     file={file}
//                     position={position}
//                     startNumber={startNumber}
//                     fontSize={fontSize}
//                     margin={margin}
//                   />
//                 )}
//                 {/* <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
//                   <span className="font-semibold">Current settings:</span> Start{" "}
//                   {startNumber}, {position.replace("-", " ")}, {fontSize}px, margin {margin}px
//                 </div> */}
//                 {error && (
//                   <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                     <p className="font-semibold">{error}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* RIGHT — Settings sidebar */}
//             <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">
//               <div className="flex-1 overflow-y-auto p-5">
//                 <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
//                   Page numbering settings
//                 </h3>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700">Page number position</label>
//                     <select
//                       value={position}
//                       onChange={(e) => setPosition(e.target.value)}
//                       className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
//                     >
//                       <option value="top-left">Top Left</option>
//                       <option value="top-center">Top Center</option>
//                       <option value="top-right">Top Right</option>
//                       <option value="bottom-left">Bottom Left</option>
//                       <option value="bottom-center">Bottom Center</option>
//                       <option value="bottom-right">Bottom Right</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700">Start numbering from</label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={startNumber}
//                       onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
//                       className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700">Font size</label>
//                     <input
//                       type="number"
//                       min="8"
//                       max="48"
//                       value={fontSize}
//                       onChange={(e) => setFontSize(Number(e.target.value) || 14)}
//                       className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700">Margin</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={margin}
//                       onChange={(e) => setMargin(Number(e.target.value) || 20)}
//                       className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Button bottom fixed */}
//               <div className="border-t border-slate-200 p-4">
//                 <button
//                   type="button"
//                   onClick={handleConvert}
//                   disabled={!file}
//                   className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${file
//                       ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
//                       : "cursor-not-allowed bg-slate-300"
//                     }`}
//                 >
//                   <Hash className="h-5 w-5" />
//                   Add Page Numbers
//                 </button>
//               </div>
//             </div>
//           </div>
//         }


//         doneTitle="Your numbered PDF is ready"
//         doneDescription="Your file was processed successfully."
//         downloadLabel="Download PDF"
//         resetLabel="Add numbers to another PDF"
//         sidebarTitle="Add Page Numbers"
//         sidebarIcon={<Hash className="h-5 w-5 text-white" />}
//         sidebarDescription="Add clean page numbering without changing the layout."
//         sidebarNotice={
//           <>
//             <p className="text-sm font-semibold text-blue-800">ℹ️ Tip</p>
//             <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
//               <li>Works great for reports & assignments</li>
//               <li>Preview the position before exporting</li>
//               <li>Original PDF content stays unchanged</li>
//             </ul>
//           </>
//         }
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         // uploadLanding={true}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF files supported"


//         uploadLanding={{
//           content: {
//             eyebrow: "ADD PAGE NUMBERS",

//             heroTitle: (
//               <>
//                 Add page numbers <br />
//                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
//                   to any PDF
//                 </em>
//               </>
//             ),

//             heroDescription:
//               "Add page numbers to PDF online for free without changing the rest of your document. Choose the position, starting number, font size, and download your updated PDF instantly — no signup or watermark required.",

//             noticeTitle: "Page numbering",

//             noticeItems: [
//               "Single PDF → Updated numbered PDF",
//               "Choose position and start number",
//               "No signup, no watermark",
//             ],

//             howToTitle: "How to add page numbers to PDF",

//             howToSubtitle:
//               "Upload your PDF, customize the numbering settings, and download the updated file in seconds.",

//             howToSteps: [
//               {
//                 n: "1",
//                 title: "Upload your PDF",
//                 desc: "Choose a PDF from your device or drag & drop it into the uploader.",
//                 color: "bg-blue-600",
//               },

//               {
//                 n: "2",
//                 title: "Choose numbering settings",
//                 desc: "Select page number position, alignment, start number, margin, and font size.",
//                 color: "bg-purple-600",
//               },

//               {
//                 n: "3",
//                 title: "Apply & download",
//                 desc: "Insert page numbers instantly and download your updated PDF file.",
//                 color: "bg-emerald-600",
//               },
//             ],

//             whyTitle: "Why use PDFLinx to add page numbers?",

//             whyItems: [
//               {
//                 title: "Add Numbers Anywhere",
//                 desc: "Place page numbers at the top or bottom and align them left, center, or right without editing the rest of the PDF.",
//                 icon: Hash,
//                 iconColor: "text-indigo-500",
//                 bgColor: "bg-indigo-50",
//               },

//               {
//                 title: "Keeps Original Layout",
//                 desc: "Only the numbering is added. Your PDF design, formatting, images, and content remain unchanged.",
//                 icon: FileText,
//                 iconColor: "text-blue-500",
//                 bgColor: "bg-blue-50",
//               },

//               {
//                 title: "Fast & Free",
//                 desc: "Add page numbers to PDF online in seconds with no watermark, installation, or signup required.",
//                 icon: CheckCircle,
//                 iconColor: "text-emerald-500",
//                 bgColor: "bg-emerald-50",
//               },

//               {
//                 title: "Custom Numbering Options",
//                 desc: "Choose the starting page number, font size, and spacing to match your document style.",
//                 icon: Settings,
//                 iconColor: "text-violet-500",
//                 bgColor: "bg-violet-50",
//               },

//               {
//                 title: "Works on All Devices",
//                 desc: "Use PDFLinx on desktop, tablet, Android, iPhone, Windows, macOS, and Linux.",
//                 icon: MonitorSmartphone,
//                 iconColor: "text-orange-500",
//                 bgColor: "bg-orange-50",
//               },

//               {
//                 title: "Secure Processing",
//                 desc: "Uploaded PDF files are processed securely and automatically deleted after a short time.",
//                 icon: ShieldCheck,
//                 iconColor: "text-rose-500",
//                 bgColor: "bg-rose-50",
//               },
//             ],

//             seoBadge: "PDF Numbering Guide",

//             seoTitle:
//               "Free Online Add Page Numbers to PDF Tool by PDFLinx",

//             seoDescription:
//               "Add page numbers to PDF online without changing the original layout. Customize numbering position, alignment, and start number directly in your browser.",

//             seoSections: [
//               {
//                 title: "Add Page Numbers Without Editing the Whole PDF",
//                 text: "PDFLinx lets you insert page numbers into PDF files without recreating the document from scratch. The original formatting, design, images, and layout remain unchanged.",
//               },

//               {
//                 title: "Choose Position, Alignment, and Start Number",
//                 text: "Place page numbers at the top or bottom of the page and align them left, center, or right. You can also start numbering from any custom number.",
//               },

//               {
//                 title: "Useful for Reports, Invoices, and Assignments",
//                 text: "Page numbering helps organize long PDFs such as reports, contracts, eBooks, study material, scanned documents, and printable files.",
//               },

//               {
//                 title: "Works on Desktop and Mobile Devices",
//                 text: "Use PDFLinx directly in your browser on Windows, macOS, Linux, Android, and iPhone devices without installing software.",
//               },

//               {
//                 title: "Fast, Free, and No Watermark",
//                 text: "Add page numbers to PDF online for free with no signup, no installation, and no watermark added to your document.",
//               },

//               {
//                 title: "Secure PDF Processing",
//                 text: "Your uploaded files are processed securely and automatically deleted after processing to protect your privacy.",
//               },
//             ],

//             faqTitle: "Frequently asked questions",

//             faqs: [
//               {
//                 q: "Is the Add Page Numbers to PDF tool free?",
//                 a: "Yes. PDFLinx lets you add page numbers to PDF online for free without signup or hidden charges.",
//               },

//               {
//                 q: "Can I choose where the page numbers appear?",
//                 a: "Yes. You can place page numbers at the top or bottom and align them left, center, or right.",
//               },

//               {
//                 q: "Can I start numbering from a custom number?",
//                 a: "Yes. You can start page numbering from any number such as 5, 10, or another custom value.",
//               },

//               {
//                 q: "Will the PDF layout remain unchanged?",
//                 a: "Yes. Only the page numbers are added. The original PDF formatting and layout stay the same.",
//               },

//               {
//                 q: "Can I add page numbers to scanned PDFs?",
//                 a: "Yes. The tool also works for scanned PDFs, reports, invoices, books, and printable documents.",
//               },

//               {
//                 q: "Do I need to install software?",
//                 a: "No. Everything works directly in your browser on desktop and mobile devices.",
//               },

//               {
//                 q: "Are my uploaded files secure?",
//                 a: "Yes. Files are processed securely and automatically deleted after processing.",
//               },

//               {
//                 q: "Can I use this tool on mobile?",
//                 a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
//               },
//             ],
//           },
//         }}
//       />



//     </>
//   );
// }






















// "use client";

// import { useState } from "react";
// import { Upload, Hash, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";
// import dynamic from "next/dynamic";

// const PageNumberPreview = dynamic(
//     () => import("@/components/PageNumberPreview"),
//     { ssr: false }
// );

// export default function AddPageNumbers() {
//     const [file, setFile] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const [position, setPosition] = useState("bottom-center");
//     const [startNumber, setStartNumber] = useState(1);
//     const [fontSize, setFontSize] = useState(14);
//     const [margin, setMargin] = useState(20);

//     const {
//         progress,
//         isLoading,
//         startProgress,
//         completeProgress,
//         cancelProgress,
//     } = useProgressBar();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!file) return alert("Please select a PDF file first!");

//         startProgress();
//         setSuccess(false);

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("position", position);
//         formData.append("startNumber", String(startNumber));
//         formData.append("fontSize", String(fontSize));
//         formData.append("margin", String(margin));

//         try {
//             const res = await fetch("/convert/add-page-numbers", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 let msg = "Failed to add page numbers";
//                 try {
//                     const maybeJson = await res.json();
//                     msg = maybeJson?.error || msg;
//                 } catch { }
//                 throw new Error(msg);
//             }

//             const contentType = (res.headers.get("content-type") || "").toLowerCase();

//             if (!contentType.includes("application/pdf")) {
//                 throw new Error("Unexpected response from server.");
//             }

//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;
//             a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);

//             completeProgress();
//             setSuccess(true);
//             setFile(null);

//             setPosition("bottom-center");
//             setStartNumber(1);
//             setFontSize(14);
//             setMargin(20);

//             e.target.reset();
//         } catch (err) {
//             cancelProgress();
//             alert(err.message || "Something went wrong, please try again.");
//             console.error(err);
//         }
//     };

//     return (
//         <>
//             <Script
//                 src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//                 strategy="afterInteractive"
//                 onReady={() => {
//                     if (window?.pdfjsLib) {
//                         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//                             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//                     }
//                 }}
//             />

//             {/* ==================== SEO SCHEMAS ==================== */}

//             <Script
//                 id="howto-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "HowTo",
//                         name: "How to Add Page Numbers to a PDF Online",
//                         description:
//                             "Add page numbers to your PDF in 3 easy steps. Upload your file, choose position and style, and download the updated PDF instantly.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         step: [
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Upload PDF",
//                                 text: "Upload your PDF file from your device.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Choose page number settings",
//                                 text: "Select position, starting number, font size, and margin.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Download PDF",
//                                 text: "Click Add Page Numbers and download your updated PDF instantly.",
//                             },
//                         ],
//                         totalTime: "PT20S",
//                         estimatedCost: {
//                             "@type": "MonetaryAmount",
//                             value: "0",
//                             currency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <Script
//                 id="breadcrumb-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "BreadcrumbList",
//                         itemListElement: [
//                             {
//                                 "@type": "ListItem",
//                                 position: 1,
//                                 name: "Home",
//                                 item: "https://pdflinx.com",
//                             },
//                             {
//                                 "@type": "ListItem",
//                                 position: 2,
//                                 name: "Add Page Numbers",
//                                 item: "https://pdflinx.com/add-page-numbers",
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="faq-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "FAQPage",
//                         mainEntity: [
//                             {
//                                 "@type": "Question",
//                                 name: "Is the Add Page Numbers tool free?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can add page numbers to PDF online for free without signup.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I choose where page numbers appear?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can place page numbers at top or bottom, left, center, or right.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I start numbering from a specific number?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can start numbering from any number such as 1, 5, or 10.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Will this change my PDF layout?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "No, the original layout stays the same. Only page numbers are added.",
//                                 },
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="software-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "SoftwareApplication",
//                         name: "Add Page Numbers to PDF - PDFLinx",
//                         applicationCategory: "BusinessApplication",
//                         operatingSystem: "Web Browser",
//                         description:
//                             "Add page numbers to PDF online free. Insert page numbers anywhere in your PDF instantly with no watermark.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         offers: {
//                             "@type": "Offer",
//                             price: "0",
//                             priceCurrency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="text-center mb-8">
//                         <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                             Add Page Numbers to PDF Online Free
//                             <br />
//                             <span className="text-2xl md:text-3xl font-medium">
//                                 Insert PDF Page Numbers in Seconds
//                             </span>
//                         </h1>

//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Add page numbers to your PDF online free. Upload your file, preview
//                             pages, choose number position, and download the updated PDF
//                             instantly.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* File Input */}
//                             <div className="relative">
//                                 <label className="block">
//                                     <div
//                                         className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
//                                             ? "border-green-500 bg-green-50"
//                                             : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
//                                             }`}
//                                     >
//                                         <Upload className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
//                                         <p className="text-lg font-semibold text-gray-700">
//                                             {file ? file.name : "Drop your PDF here or click to upload"}
//                                         </p>

//                                         <p className="text-sm text-gray-500 mt-1">Only .pdf files</p>

//                                         <p className="text-xs text-gray-500 mt-2">
//                                             Upload your PDF, preview the pages, choose page number
//                                             settings, and download the updated file instantly.
//                                         </p>
//                                     </div>

//                                     <input
//                                         type="file"
//                                         accept=".pdf"
//                                         onChange={(e) => {
//                                             const pickedFile = e.target.files?.[0] || null;
//                                             setFile(pickedFile);
//                                         }}
//                                         className="hidden"
//                                         required
//                                     />
//                                 </label>
//                             </div>

//                             {/* Settings */}
//                             {file && (
//                                 <div className="grid md:grid-cols-2 gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Page number position
//                                         </label>
//                                         <select
//                                             value={position}
//                                             onChange={(e) => setPosition(e.target.value)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         >
//                                             <option value="top-left">Top Left</option>
//                                             <option value="top-center">Top Center</option>
//                                             <option value="top-right">Top Right</option>
//                                             <option value="bottom-left">Bottom Left</option>
//                                             <option value="bottom-center">Bottom Center</option>
//                                             <option value="bottom-right">Bottom Right</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Start numbering from
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="1"
//                                             value={startNumber}
//                                             onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Font size
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="8"
//                                             max="48"
//                                             value={fontSize}
//                                             onChange={(e) => setFontSize(Number(e.target.value) || 14)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Margin
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={margin}
//                                             onChange={(e) => setMargin(Number(e.target.value) || 20)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Preview */}
//                             {file && (
//                                 <PageNumberPreview
//                                     file={file}
//                                     position={position}
//                                     startNumber={startNumber}
//                                     fontSize={fontSize}
//                                     margin={margin}
//                                 />
//                             )}

//                             {/* Info box */}
//                             {file && (
//                                 <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-gray-700">
//                                     <span className="font-semibold">Preview settings: </span>
//                                     Start <strong>{startNumber}</strong>, Position{" "}
//                                     <strong>{position.replace("-", " ")}</strong>, Font size{" "}
//                                     <strong>{fontSize}px</strong>, Margin <strong>{margin}px</strong>
//                                 </div>
//                             )}

//                             {/* Button */}
//                             <ProgressButton
//                                 isLoading={isLoading}
//                                 progress={progress}
//                                 disabled={!file}
//                                 icon={<Hash className="w-5 h-5" />}
//                                 label="Add Page Numbers"
//                                 gradient="from-indigo-600 to-blue-600"
//                             />

//                             <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
//                                 <p>
//                                     🔢 <strong>Add page numbers</strong> to your PDF in seconds.
//                                 </p>
//                                 <p>
//                                     👀 <strong>Use live preview</strong> to check the number position
//                                     before downloading.
//                                 </p>
//                             </div>
//                         </form>

//                         {success && (
//                             <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                                 <p className="text-xl font-bold text-green-700 mb-2">
//                                     Done! Your numbered PDF downloaded automatically 🎉
//                                 </p>
//                                 <p className="text-base text-gray-700">
//                                     Check your downloads folder.
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     <p className="text-center mt-6 text-gray-600 text-base">
//                         No account • No watermark • Auto-deleted after 1 hour • 100% free •
//                         Works on desktop & mobile
//                     </p>
//                 </div>
//             </main>

//             {/* ==================== SEO CONTENT ==================== */}
//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold mb-4">
//                         Add Page Numbers to PDF Online Free – Fast & Easy PDF Numbering Tool
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Looking to add page numbers to a PDF file online? PDFLinx lets you insert page numbers into your PDF instantly without changing the original layout.
//                         Whether you need to number reports, assignments, invoices, or contracts, this tool helps you do it in seconds.
//                     </p>
//                 </div>

//                 <div className="space-y-10">
//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             What Does Add Page Numbers to PDF Mean?
//                         </h3>
//                         <p>
//                             Adding page numbers to a PDF means inserting numbers on each page of your document. These numbers help organize your document,
//                             improve readability, and make navigation easier when printing or sharing files.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Why Add Page Numbers to PDF Files?
//                         </h3>
//                         <ul className="list-disc pl-6 space-y-2">
//                             <li>Organize long documents and reports</li>
//                             <li>Make navigation easier for readers</li>
//                             <li>Prepare professional documents for printing</li>
//                             <li>Add numbering to assignments or study material</li>
//                             <li>Improve document structure and readability</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Add Page Numbers Without Changing Layout
//                         </h3>
//                         <p>
//                             This tool adds page numbers without modifying your PDF’s original design. The content, formatting, and structure remain unchanged.
//                             Only the page numbers are added at your selected position.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Customize Page Number Position and Style
//                         </h3>
//                         <p>
//                             You can choose where to place page numbers — top or bottom, left, center, or right.
//                             You can also control the starting number, font size, and margin to match your document style.
//                         </p>
//                     </div>
//                 </div>

//                 <h3 className="text-xl font-semibold mt-10 mb-3">
//                     How to Add Page Numbers to PDF Online
//                 </h3>
//                 <ol className="list-decimal pl-6 space-y-2">
//                     <li>Upload your PDF file</li>
//                     <li>Select page number position and settings</li>
//                     <li>Click Add Page Numbers</li>
//                     <li>Download your updated PDF instantly</li>
//                 </ol>

//                 <div className="bg-gray-50 border rounded-xl p-6 mt-8">
//                     <h3 className="text-xl font-semibold mb-4">
//                         Features of Add Page Numbers Tool
//                     </h3>
//                     <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">
//                         <li>Add page numbers to PDF online free</li>
//                         <li>Choose position (top, bottom, left, right)</li>
//                         <li>Start numbering from any page</li>
//                         <li>Customize font size and margin</li>
//                         <li>No watermark added</li>
//                         <li>Works on mobile and desktop</li>
//                         <li>Fast and secure processing</li>
//                         <li>No signup required</li>
//                     </ul>
//                 </div>
//             </section>

//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                         Add Page Numbers to PDF Without Editing the Whole Document
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Insert page numbers into reports, assignments, contracts, invoices,
//                         and scanned PDFs quickly. Choose where the page numbers should appear
//                         and download the final PDF instantly.
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-8 mb-16">
//                     <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Hash className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Add Numbers Anywhere
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             Place page numbers at the top or bottom, left, center, or right side
//                             of every PDF page.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <FileText className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Live Preview
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             See how numbering will look before processing the final PDF file.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg border border-sky-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <CheckCircle className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Fast & Free
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             No signup, no installation, and no watermark. Just upload and
//                             download.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             <section className="py-16">
//                 <div className="max-w-4xl mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-10">
//                         Frequently Asked Questions
//                     </h2>

//                     <div className="space-y-4">
//                         {[
//                             {
//                                 q: "Is this tool free to use?",
//                                 a: "Yes, you can add page numbers to PDF online for free with no signup.",
//                             },
//                             {
//                                 q: "Can I choose where page numbers appear?",
//                                 a: "Yes, you can place them at top or bottom, left, center, or right.",
//                             },
//                             {
//                                 q: "Can I start numbering from a different number?",
//                                 a: "Yes, you can start from any number like 5 or 10.",
//                             },
//                             {
//                                 q: "Does this tool change my PDF layout?",
//                                 a: "No, it only adds page numbers without affecting layout.",
//                             },
//                             {
//                                 q: "Can I use this on mobile?",
//                                 a: "Yes, it works on all devices including mobile, tablet, and desktop.",
//                             },
//                         ].map((faq, i) => (
//                             <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                                 <summary className="font-semibold cursor-pointer flex justify-between items-center">
//                                     {faq.q}
//                                     <span className="text-indigo-500 text-lg group-open:rotate-45">+</span>
//                                 </summary>
//                                 <p className="mt-2 text-gray-600">{faq.a}</p>
//                             </details>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <RelatedToolsSection currentPage="add-page-numbers" />
//         </>
//     );
// }