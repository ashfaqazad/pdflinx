"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Hash,
  FileText,
  ShieldCheck,
  Pencil, Stamp, RotateCw, LayoutList,
  GitMerge, Shield, Minimize2, PenLine
} from "lucide-react";
import Script from "next/script";
import dynamic from "next/dynamic";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


const DONE_LINKS = [
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Organize PDF", href: "/organize-pdf", icon: <LayoutList className="h-4 w-4 text-blue-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Sign PDF", href: "/sign-pdf", icon: <PenLine className="h-4 w-4 text-indigo-500" /> },
];


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

      // const res = await fetch("/convert/add-page-numbers", {
      //   method: "POST",
      //   body: formData,
      // });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/add-page-numbers`, {
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
        sidebarLinks={DONE_LINKS}

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

        // ============================================================
        // ADD PAGE NUMBERS TO PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "ADD PAGE NUMBERS TO PDF",

            breadcrumbCurrent: "Add Page Numbers to PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Add Page Numbers to PDF —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Fully Customizable
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Add page numbers to any PDF online for free. Choose position, style, font, and starting number — applied permanently to every page. No signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "Custom position & style",
            //   "Choose starting page number",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Add Page Numbers to PDF —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Custom Position & Style, Free
                </em>
              </>
            ),
            heroDescription:
              "Add page numbers to PDF online free — insert page numbers in header, footer, left, center, or right position. Choose font, size, and starting number. Free, no signup needed.",
            pills: ["Header & footer placement", "Custom font & size", "Choose starting number", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Add Page Numbers Info",
            noticeItems: [
              "Choose position — header or footer",
              "Customize font, size & starting number",
              "Numbers applied permanently to PDF",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Add Page Numbers to a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, customize numbering, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with PDFs of any length — from 1 page to hundreds.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Customize Your Page Numbers",
                desc: "Choose where to place the numbers — top left, top center, top right, bottom left, bottom center, or bottom right. Set the starting number, font size, and number format.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Numbered PDF",
                desc: "Click Add Page Numbers and your updated PDF is ready in seconds. Page numbers are permanently embedded — visible in every PDF viewer, ready to print or share.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Tool to Add Page Numbers to PDF Online",

            seoBadge: "Add Page Numbers to PDF Guide",
            seoTitle: "Complete Guide to Adding Page Numbers to a PDF Online",
            seoDescription:
              "Everything you need to know about adding page numbers to a PDF — free, online, fully customizable position and style. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Page Numbering Tool — Add Page Numbers to Any PDF Online",
                text: (
                  <>
                    Need to add page numbers to a PDF? PDFLinx lets you add page numbers to any PDF online for free — instantly and without any software installation. Whether it is a report, thesis, legal document, contract, or a freshly{" "}
                    <a
                      href="/merge-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      merged PDF
                    </a>
                    , PDFLinx stamps clean, professional page numbers in your chosen position and style in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.
                  </>
                ),
              },
              {
                title: "Why Page Numbers Matter in a PDF Document",
                text: (
                  <>
                    Page numbers are a fundamental part of any professional document. They make long PDFs navigable — readers can jump to specific pages, reference sections precisely, and follow along during meetings or presentations. For legal documents and formal submissions, you can also use our{" "}
                    <a
                      href="/add-watermark"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add Watermark tool
                    </a>{" "}
                    alongside page numbers for official branding. If you need to make additional text edits or adjustments, explore our{" "}
                    <a
                      href="/edit-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit PDF tool
                    </a>
                    . A PDF without page numbers is harder to reference and looks unfinished.
                  </>
                ),
              },
              {
                title: "Page Number Position Options — Where to Place Your Numbers",
                text: (
                  <>
                    PDFLinx gives you six placement options for page numbers — top left, top center, top right, bottom left, bottom center, and bottom right. Bottom center is the most common choice for reports, theses, and formal documents. Bottom right is popular for business documents and contracts. Top right is frequently used in academic and legal formatting. Choose whichever position matches your preference — PDFLinx applies it consistently across every page.
                  </>
                ),
              },
              {
                title: "Customize Starting Number, Font, and Format",
                text: (
                  <>
                    Not every document starts numbering from page 1. A thesis may have front matter, or a report may have a cover page that should not be numbered. If you need to rearrange or delete unnecessary cover pages first, you can use our{" "}
                    <a
                      href="/organize-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Organize PDF tool
                    </a>{" "}
                    or{" "}
                    <a
                      href="/remove-pages"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Remove Pages tool
                    </a>
                    . PDFLinx lets you set the exact starting number, choose font size, and select number format for complete control.
                  </>
                ),
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Page Numbering Tool — No Watermark, No Limits",
                text: (
                  <>
                    Most free PDF page numbering tools add their own watermark alongside your page numbers, restrict customization options, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict PDF editing tools on free tiers, PDFLinx gives you full customization and unlimited access to all our{" "}
                    <a
                      href="/free-pdf-tools"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      free PDF tools
                    </a>{" "}
                    at zero cost.
                  </>
                ),
              },
              {
                title: "Common Use Cases for Adding Page Numbers to a PDF",
                text: (
                  <>
                    ✓ <strong>Students & Academics:</strong> Add properly formatted page numbers to theses and assignments before conversion using{" "}
                    <a
                      href="/word-to-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Word to PDF
                    </a>
                    .<br />
                    ✓ <strong>Legal Professionals:</strong> Number pages in contracts and briefs, then securely sign them with our{" "}
                    <a
                      href="/sign-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign PDF tool
                    </a>
                    .<br />
                    ✓ <strong>Business Professionals:</strong> Add page numbers to multi-page reports and optimize file size using our{" "}
                    <a
                      href="/compress-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Compress PDF tool
                    </a>
                    .<br />
                    ✓ <strong>Publishers & Editors:</strong> Number pages in manuscripts and books before review or printing.
                    <br />
                    ✓ <strong>HR Teams:</strong> Add page numbers to employee handbooks and policy documents.
                    <br />
                    ✓ <strong>Freelancers:</strong> Professionally number client deliverables and project documentation.
                  </>
                ),
              },
              {
                title:
                  "Add Page Numbers on iPhone, Android, Mac & Windows — No App Needed",
                text: (
                  <>
                    PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the numbered file in seconds. Whether you need to add page numbers on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.
                  </>
                ),
              },
              {
                title: "Privacy and File Security",
                text: (
                  <>
                    Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. If you are handling confidential records, consider adding password protection with our{" "}
                    <a
                      href="/protect-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Protect PDF tool
                    </a>
                    . All file transfers use encrypted HTTPS connections for complete security.
                  </>
                ),
              },
              {
                title: "Are Page Numbers Permanently Saved in the PDF?",
                text: (
                  <>
                    Yes. Page numbers added by PDFLinx are permanently embedded into the PDF file — they are not a layer or annotation that can be accidentally removed. Every PDF viewer on every device will display the page numbers exactly as applied. The numbered PDF is ready to print, share, or send via email immediately after download with no further steps needed.
                  </>
                ),
              },
              {
                title: "Add Page Numbers vs Adding a Header or Footer",
                text: (
                  <>
                    Page numbers are the most common reason people add to PDF headers and footers, but headers and footers can contain more than just numbers — document titles, author names, or dates. If you need to make additional adjustments to the layout or structure, you can use our{" "}
                    <a
                      href="/crop-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Crop PDF tool
                    </a>{" "}
                    or{" "}
                    <a
                      href="/rotate-pdf"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Rotate PDF tool
                    </a>{" "}
                    to align your pages properly before numbering them.
                  </>
                ),
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx add page numbers tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of pages or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and add page numbers instantly — no email, no registration, no friction.",
              },
              {
                q: "Where can I place the page numbers?",
                a: "PDFLinx supports six positions — top left, top center, top right, bottom left, bottom center, and bottom right. Choose whichever suits your document style.",
              },
              {
                q: "Can I set a custom starting page number?",
                a: "Yes. Set any starting number you need — for example start from 1, from 3 if your cover pages are unnumbered, or from any other number that matches your document structure.",
              },
              {
                q: "Can I skip numbering the first page — like a cover page?",
                a: "Yes. You can configure the tool to start applying numbers from a specific page, leaving your cover page or front matter without a visible number.",
              },
              {
                q: "Are the page numbers permanently saved in the PDF?",
                a: "Yes. Page numbers are permanently embedded into the PDF file — they appear in every PDF viewer on every device and do not disappear when the file is reopened or printed.",
              },
              {
                q: "Can I choose the font size of the page numbers?",
                a: "Yes. PDFLinx lets you customize the font size so the page numbers match the style and scale of your document.",
              },
              {
                q: "Does PDFLinx add any watermark alongside the page numbers?",
                a: "No watermarks, ever. Only the page numbers you configure are added — your PDF stays 100% clean.",
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
                a: "Up to 50 MB per file. For very large PDFs, try splitting the file first using our free PDF Split tool, add numbers to each part, then merge them back.",
              },
              {
                q: "Can I add page numbers to a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then add your page numbers.",
              },
              {
                q: "Will existing content on the pages be affected?",
                a: "No. Page numbers are added to the margin area of each page — existing content, text, images, and formatting remain completely untouched.",
              },
              {
                q: "How long does it take to add page numbers to a PDF?",
                a: "Most operations complete within 5 to 15 seconds depending on file size and number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for adding page numbers?",
                a: "Yes — PDFLinx offers unlimited free page numbering with full position and style customization, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict PDF editing tools behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Add page numbers to your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, professional PDF page numbering every day.",
            ctaButton: "Choose PDF File",
          },
        }}
      />
    </>
  );
}




