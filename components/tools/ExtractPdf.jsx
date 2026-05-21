"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Scissors,
  GitMerge,
  FileText,
  Minimize2,
  Lock,
  X,
  CheckCircle,
  Layers3,
  Download,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── CONFIG ─────────────────────────────────
const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">ℹ️ How splitting works</p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Upload one PDF file</li>
      <li>Every page → individual PDF</li>
      <li>All pages delivered in one ZIP</li>
      <li>Keep only the pages you need</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ All pages in ZIP",
  "✓ Works on all devices",
];
// ───────────────────────────────────────────

// ── PDF Page Thumbnail Component ───────────
function PdfPageThumb({ file, pageNum, isSelected, onToggle, extractMode }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Lazy load — sirf tab render karo jab card visible ho viewport mein
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!file || !visible) return;
    let cancelled = false;

    const render = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.6 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setRendered(true);
      } catch (e) {
        console.error("PDF page render error:", e);
      }
    };

    const tryRender = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        render();
      } else {
        setTimeout(tryRender, 100);
      }
    };

    tryRender();
    return () => { cancelled = true; };
  }, [file, pageNum, visible]);

  const showCheck = extractMode === "all" || isSelected;

  return (
    <div
      ref={wrapperRef}
      onClick={() => extractMode === "select" && onToggle(pageNum)}
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all
        ${extractMode === "select" ? "cursor-pointer" : ""}
        ${isSelected && extractMode === "select"
          ? "ring-2 ring-[#f24d0d] shadow-lg -translate-y-0.5"
          : extractMode === "select"
            ? "hover:-translate-y-0.5 hover:shadow-lg"
            : ""
        }`}
    >
      <div className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all
        ${showCheck
          ? "bg-[#22c55e] opacity-100 scale-100"
          : "bg-white/80 border-2 border-slate-300 opacity-0 group-hover:opacity-100 scale-90"
        }`}
      >
        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="relative flex h-[170px] items-center justify-center overflow-hidden bg-slate-50 p-2">
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`h-full w-full object-contain bg-white transition-opacity ${rendered ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="border-t border-slate-100 bg-white px-3 py-2 text-center">
        <p className="text-xs font-semibold text-slate-500">{pageNum}</p>
      </div>
    </div>
  );
}
// ───────────────────────────────────────────

// ── Split Options Sidebar ───────────────────
function SplitSidebarOptions({
  activeTab, onTabChange,
  extractMode, onExtractModeChange,
  selectedPages, totalPages,
  onConvert, files,
  rangeMode, setRangeMode,
  ranges, setRanges,
  pageRangeInput, onPageRangeChange,
  mergeExtracted, onMergeChange,
}) {
  const tabs = [
    { key: "range", label: "Range" },
    { key: "pages", label: "Pages" },
    { key: "size", label: "Size" },
  ];

  const outputCount = extractMode === "all" ? totalPages : selectedPages.length;

  return (
    <div className="space-y-4">

      {/* Title */}
      <h3 className="border-b border-slate-200 pb-3 text-center text-xl font-bold text-slate-900">
        Split PDF
      </h3>

      {/* Tabs */}
      <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-col items-center gap-1.5 px-2 py-3 text-xs font-semibold transition
              ${activeTab === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab.key === "range" && (
              <svg viewBox="0 0 32 24" className="h-6 w-8" fill="none">
                <rect x="1" y="1" width="13" height="22" rx="2" fill={activeTab === "range" ? "#f1f5f9" : "#f8fafc"} stroke={activeTab === "range" ? "#94a3b8" : "#cbd5e1"} strokeWidth="1.5" />
                <rect x="18" y="1" width="13" height="22" rx="2" fill={activeTab === "range" ? "#f1f5f9" : "#f8fafc"} stroke={activeTab === "range" ? "#94a3b8" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M14.5 12H17.5M14.5 12L13 10.5M14.5 12L13 13.5M17.5 12L19 10.5M17.5 12L19 13.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
            {tab.key === "pages" && (
              <svg viewBox="0 0 40 24" className="h-6 w-10" fill="none">
                <rect x="1" y="3" width="10" height="18" rx="1.5" fill={activeTab === "pages" ? "#e0f2fe" : "#f8fafc"} stroke={activeTab === "pages" ? "#38bdf8" : "#cbd5e1"} strokeWidth="1.5" />
                {activeTab === "pages" && <path d="M6 8h0M6 12h0" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />}
                <rect x="15" y="1" width="10" height="22" rx="1.5" fill={activeTab === "pages" ? "#dbeafe" : "#f8fafc"} stroke={activeTab === "pages" ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
                {activeTab === "pages" && <path d="M20 7h0M20 12h0M20 17h0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />}
                <rect x="29" y="3" width="10" height="18" rx="1.5" fill={activeTab === "pages" ? "#e0f2fe" : "#f8fafc"} stroke={activeTab === "pages" ? "#38bdf8" : "#cbd5e1"} strokeWidth="1.5" />
                {activeTab === "pages" && <path d="M34 8h0M34 12h0" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            )}
            {tab.key === "size" && (
              <svg viewBox="0 0 36 24" className="h-6 w-9" fill="none">
                <rect x="1" y="1" width="22" height="22" rx="2" fill={activeTab === "size" ? "#fef3c7" : "#f8fafc"} stroke={activeTab === "size" ? "#f59e0b" : "#cbd5e1"} strokeWidth="1.5" />
                <rect x="26" y="8" width="9" height="15" rx="1.5" fill={activeTab === "size" ? "#fef9c3" : "#f8fafc"} stroke={activeTab === "size" ? "#eab308" : "#cbd5e1"} strokeWidth="1.5" />
                <path d="M22 12H24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── PAGES TAB ── */}
      {activeTab === "pages" && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Extract mode:</p>

          {/* Side-by-side pills */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onExtractModeChange("all")}
              className={`flex-1 px-3 py-2.5 text-sm font-semibold transition
                ${extractMode === "all"
                  ? "bg-white text-[#f24d0d] ring-1 ring-inset ring-[#f24d0d] rounded-xl z-10"
                  : "bg-slate-50 text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
            >
              Extract all pages
            </button>
            <button
              type="button"
              onClick={() => onExtractModeChange("select")}
              className={`flex-1 border-l border-slate-200 px-3 py-2.5 text-sm font-semibold transition
                ${extractMode === "select"
                  ? "bg-white text-slate-800 ring-1 ring-inset ring-slate-400 rounded-xl z-10"
                  : "bg-slate-50 text-slate-400 hover:bg-white hover:text-slate-600"
                }`}
            >
              Select pages
            </button>
          </div>

          {/* Info box */}
          {totalPages > 0 && (
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-400">
                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs leading-5 text-blue-700">
                {extractMode === "all"
                  ? <>Selected pages will be converted into separate PDF files. <strong>{outputCount} PDF{outputCount !== 1 ? "s" : ""}</strong> will be created.</>
                  : outputCount === 0
                    ? "Click pages in the preview to select them."
                    : <><strong>{outputCount}</strong> page{outputCount !== 1 ? "s" : ""} selected → <strong>{outputCount} PDF{outputCount !== 1 ? "s" : ""}</strong> will be created.</>
                }
              </p>
            </div>
          )}

          {/* Pages to extract input + Merge checkbox — select mode mein */}
          {extractMode === "select" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Pages to extract:
                </label>
                <input
                  type="text"
                  value={pageRangeInput}
                  onChange={(e) => onPageRangeChange(e.target.value)}
                  placeholder="e.g. 1,3,5-8"
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#f24d0d] focus:bg-white transition"
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Use commas and dashes: 1,3,5-8
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={mergeExtracted}
                  onChange={(e) => onMergeChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#f24d0d]"
                />
                <span className="text-xs leading-5 text-slate-600">
                  Merge extracted pages into one PDF file.
                </span>
              </label>
            </div>
          )}

        </div>
      )}

      {/* ── RANGE TAB — Coming Soon ── */}
      {activeTab === "range" && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <svg viewBox="0 0 32 24" className="h-6 w-8" fill="none">
              <rect x="1" y="1" width="13" height="22" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="18" y="1" width="13" height="22" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M14.5 12H17.5M14.5 12L13 10.5M14.5 12L13 13.5M17.5 12L19 10.5M17.5 12L19 13.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Split by Range</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Define custom page ranges to create separate PDFs.</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-500">Coming Soon</span>
        </div>
      )}

      {/* ── SIZE TAB ── */}
      {activeTab === "size" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="font-semibold text-slate-500">Split by File Size</p>
          <p className="mt-1 text-xs text-slate-400">Coming soon</p>
        </div>
      )}

      {/* Split Button */}
      <button
        type="button"
        onClick={onConvert}
        disabled={!files.length || (extractMode === "select" && selectedPages.length === 0 && !pageRangeInput)}
        className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98]
          ${files.length && (extractMode === "all" || selectedPages.length > 0 || pageRangeInput)
            ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
            : "cursor-not-allowed bg-slate-300"
          }`}
      >
        Split PDF
      </button>

    </div>
  );
}
// ───────────────────────────────────────────

// ── Custom Options Full-Width Layout ───────
function SplitOptionsLayout({
  file, onRemoveFile, onConvert,
  selectedPages, setSelectedPages,
  extractMode, setExtractMode,
  activeTab, setActiveTab,
  totalPages, setTotalPages,
  rangeMode, setRangeMode,
  ranges, setRanges,
  pageRangeInput, setPageRangeInput,
  mergeExtracted, setMergeExtracted,
}) {

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const countPages = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const tryCount = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            window.pdfjsLib.getDocument({ data: buffer }).promise.then((pdf) => {
              if (!cancelled) setTotalPages(pdf.numPages);
            });
          } else { setTimeout(tryCount, 100); }
        };
        tryCount();
      } catch (e) { console.error("Page count error:", e); }
    };
    countPages();
    return () => { cancelled = true; };
  }, [file, setTotalPages]);

  const handleTogglePage = useCallback((pageNum) => {
    setSelectedPages((prev) => {
      const newSelected = prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum];
      // Sync text input with thumbnail clicks
      setPageRangeInput(newSelected.sort((a, b) => a - b).join(","));
      return newSelected;
    });
  }, [setSelectedPages, setPageRangeInput]);

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left: Page thumbnails */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
              <Scissors className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="max-w-[280px] truncate text-sm font-bold text-slate-800">{file?.name}</p>
              <p className="text-xs text-slate-400">
                {totalPages > 0 ? `${totalPages} page${totalPages !== 1 ? "s" : ""}` : "Loading..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemoveFile(0)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm transition hover:bg-red-50 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {totalPages > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PdfPageThumb
                key={pageNum}
                file={file}
                pageNum={pageNum}
                isSelected={selectedPages.includes(pageNum)}
                onToggle={handleTogglePage}
                extractMode={extractMode}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400" />
              <p className="text-sm">Loading PDF pages...</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Sidebar */}
      <aside className="w-[350px] shrink-0 border-l border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-y-auto">
        <SplitSidebarOptions
          activeTab={activeTab}
          onTabChange={setActiveTab}
          extractMode={extractMode}
          onExtractModeChange={setExtractMode}
          selectedPages={selectedPages}
          totalPages={totalPages}
          onConvert={onConvert}
          files={file ? [file] : []}
          rangeMode={rangeMode}
          setRangeMode={setRangeMode}
          ranges={ranges}
          setRanges={setRanges}
          pageRangeInput={pageRangeInput}
          onPageRangeChange={setPageRangeInput}
          mergeExtracted={mergeExtracted}
          onMergeChange={setMergeExtracted}
        />
      </aside>
    </div>
  );
}
// ───────────────────────────────────────────

export default function ExtractPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("pages");
  const [extractMode, setExtractMode] = useState("all");
  const [selectedPages, setSelectedPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [rangeMode, setRangeMode] = useState("custom");
  const [ranges, setRanges] = useState([{ from: 1, to: 1 }]);
  const [pageRangeInput, setPageRangeInput] = useState("");
  const [mergeExtracted, setMergeExtracted] = useState(false);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    setSelectedPages([]);
    setTotalPages(0);
    setPageRangeInput("");
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = flow.files[0]
        ? flow.files[0].name.replace(/\.pdf$/i, "-split-pages.zip")
        : "split-pages.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  // ── API LOGIC ─────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select a PDF file");
    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    formData.append("file", flow.files[0]);

    if (extractMode === "select") {
      if (pageRangeInput) {
        formData.append("pages", pageRangeInput);
      } else if (selectedPages.length > 0) {
        formData.append("pages", selectedPages.sort((a, b) => a - b).join(","));
      }
      if (mergeExtracted) formData.append("merge", "1");
    }

    try {
      const res = await fetch("/convert/split-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();
        flow.finishSuccess();
      } else {
        cancelProgress();
        flow.handleError(data.error || "Split failed");
      }
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ─────────────────────────

  const customOptionsLayout = flow.files.length > 0 ? (
    <SplitOptionsLayout
      file={flow.files[0]}
      onRemoveFile={handleRemoveFile}
      onConvert={handleConvert}
      selectedPages={selectedPages}
      setSelectedPages={setSelectedPages}
      extractMode={extractMode}
      setExtractMode={setExtractMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      totalPages={totalPages}
      setTotalPages={setTotalPages}
      rangeMode={rangeMode}
      setRangeMode={setRangeMode}
      ranges={ranges}
      setRanges={setRanges}
      pageRangeInput={pageRangeInput}
      setPageRangeInput={setPageRangeInput}
      mergeExtracted={mergeExtracted}
      setMergeExtracted={setMergeExtracted}
    />
  ) : null;

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script id="howto-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "HowTo",
            name: "How to Split a PDF into Individual Pages Online",
            url: "https://pdflinx.com/split-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
              { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." },
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script id="breadcrumb-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script id="faq-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How do I split a PDF into individual pages?", acceptedAnswer: { "@type": "Answer", text: "Upload your PDF, click Split PDF, and download the ZIP containing individual pages." } },
              { "@type": "Question", name: "Is the PDF splitter free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Split PDF is completely free and works directly in your browser." } },
              { "@type": "Question", name: "Does splitting a PDF affect quality?", acceptedAnswer: { "@type": "Answer", text: "No. All pages keep their original quality, text, and formatting." } },
              { "@type": "Question", name: "Can I split PDF on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. Works on Android, iPhone, tablets, and desktop browsers." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Split PDF Online Free"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Split PDF"
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — split pages easily"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        customOptionsLayout={customOptionsLayout}
        optionsTitle="Split options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={null}
        processingTitle="Splitting your PDF"
        processingDescription="Please wait while we separate your PDF pages."
        processingStages={["Uploading file", "Separating pages", "Generating ZIP"]}
        doneTitle="Your split pages are ready"
        doneDescription="Every page has been separated into its own PDF file."
        doneFileName="split-pages.zip"
        downloadLabel="Download ZIP"
        resetLabel="Split another PDF"
        sidebarTitle="Split PDF"
        sidebarIcon={<Scissors className="h-5 w-5 text-orange-500" />}
        sidebarDescription="Split any PDF into individual pages — every page becomes its own PDF file in a ZIP."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

    //     uploadLanding={{
    //       content: {
    //         heroBadge: "✦ Free PDF Splitter · No Signup Required",
    //         heroTitle: (<>Split PDF Files Online{" "}<em className="text-[#e8420a]"><br />for Free</em></>),
    //         heroDescription: "Split PDF pages online in seconds. Extract, separate, or divide PDF files securely without signup or software. Free PDF splitter that works directly in your browser on Windows, Mac, Android, and iPhone.",
    //         pills: ["Separate PDF pages", "ZIP download", "No quality loss", "Works on all devices"],
    //         noticeItems: ["Every page becomes separate PDF", "All pages packed into ZIP", "Original quality preserved"],
    //         seoBadge: "Split PDF Guide",
    //         seoTitle: "Free Online Split PDF Tool by PDFLinx",
    //         seoDescription: "Separate PDF pages into individual files online. Fast, secure, and no signup required.",
    //         howToTitle: "How to Split a PDF — 3 Simple Steps",
    //         howToSubtitle: "Upload your PDF, split pages automatically, and download all files in one ZIP.",
    //         howToSteps: [
    //           { n: "1", title: "Upload Your PDF", desc: "Select your PDF file — any size, any number of pages. Drag and drop supported on all devices." },
    //           { n: "2", title: "Click Split PDF", desc: "Hit the Split button — the tool separates every page into its own individual PDF file automatically." },
    //           { n: "3", title: "Download ZIP", desc: "All split pages are packaged into a ZIP file — download and extract the individual PDF pages you need." },
    //         ],
    //         whyTitle: "Why Use PDFLinx Split PDF Tool?",
    //         faqTitle: "Split PDF FAQs",
    //         faqs: [
    //           { q: "Is the PDF splitter free to use?", a: "Yes. PDFLinx Split PDF is completely free — no hidden charges, no subscription required." },
    //           { q: "Do I need to install any software to split a PDF?", a: "No. Everything works directly in your browser. No desktop software or plugins needed." },
    //           { q: "How does the PDF get split — what do I receive?", a: "Every page in your PDF is separated into its own individual PDF file. All split pages are packaged into a ZIP file for download." },
    //           { q: "Will the quality of my PDF pages change after splitting?", a: "No. PDFLinx extracts the original page data directly — no re-rendering or compression." },
    //           { q: "Can I extract only specific pages from a PDF?", a: "Split the PDF to get all pages as individual files, then keep only the specific page PDFs you need from the ZIP." },
    //           { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after splitting." },
    //           { q: "Can I split a PDF on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers." },
    //           { q: "How do I combine split pages back into one PDF?", a: "After splitting, use the Merge PDF tool — upload the individual page PDFs and download one merged PDF file." },
    //         ],
    //         relatedTitle: "More PDF Tools",
    //         seoSections: [
    //           { title: "Split Large PDF Files Easily", text: "Separate large PDF documents into smaller individual page files without losing quality." },
    //           { title: "Keep Original PDF Quality", text: "All split PDF pages preserve original text, images, and formatting." },
    //           { title: "Extract Individual PDF Pages", text: "Convert every page of your PDF into separate standalone PDF files for easier sharing and organization." },
    //           { title: "Secure PDF Splitting Online", text: "Your uploaded PDF files are processed securely and automatically deleted after processing." },
    //         ],
    //         showPdfTypes: false,
    //       },
    //     }}
    //   />


            uploadLanding={{
          content: {
            eyebrow: "EXTRACT PDF PAGES",
            heroTitle: (
              <>
                Extract PDF Pages <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly online
                </em>
              </>
            ),
            heroDescription:
              "Extract pages from PDF online for free. Save selected pages, split page ranges, or create separate PDFs directly in your browser.",
            noticeTitle: "Extract PDF features",
            noticeItems: [
              "Extract selected pages",
              "Split page ranges",
              "Keep original quality",
            ],
            howToTitle: "How to extract PDF pages",
            howToSubtitle: "Upload your PDF, choose the pages you want to extract, and download a new PDF instantly.",
            howToSteps: [
              { n: "1", title: "Upload your PDF", desc: "Select your PDF file from your device.", color: "bg-blue-600" },
              { n: "2", title: "Choose pages", desc: "Click pages to select or enter page numbers/ranges.", color: "bg-purple-600" },
              { n: "3", title: "Download extracted PDF", desc: "Save your selected pages as a new PDF instantly.", color: "bg-emerald-600" },
            ],
            whyTitle: "Why use PDFLinx Extract PDF?",
            whyItems: [
              { title: "Extract Specific Pages", desc: "Save only the pages you need from large PDF documents.", icon: Scissors, iconColor: "text-orange-500", bgColor: "bg-orange-100" },
              { title: "Preserve PDF Quality", desc: "Extracted pages maintain original text and layout quality.", icon: CheckCircle, iconColor: "text-green-600", bgColor: "bg-green-100" },
              { title: "Multiple Extraction Modes", desc: "Extract ranges, single pages, or split all pages separately.", icon: Layers3, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
              { title: "Fast Online Tool", desc: "Extract PDF pages directly in your browser within seconds.", icon: Download, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
              { title: "Works Everywhere", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
              { title: "Private & Secure", desc: "Uploaded PDFs are securely processed and deleted automatically.", icon: ShieldCheck, iconColor: "text-emerald-600", bgColor: "bg-emerald-100" },
            ],
            seoBadge: "Extract PDF Tool",
            seoTitle: "Extract PDF Pages Online Free",
            seoDescription: "Extract pages from PDF online for free. Save selected pages or page ranges into a new PDF instantly without losing quality.",
            seoSections: [
              { title: "Extract Only the Pages You Need", text: "Save specific pages from large PDF files without downloading or editing the full document." },
              { title: "Split PDF Page Ranges", text: "Extract page ranges like 1-5 or combine selected pages into a separate PDF file." },
              { title: "Preserve Original Formatting", text: "Extracted pages maintain original text clarity, images, layout, and formatting." },
              { title: "No Software Installation Needed", text: "Extract PDF pages directly from your browser on desktop and mobile devices." },
            ],
            faqTitle: "Frequently asked questions",
            faqs: [
              { q: "What does Extract PDF Pages do?", a: "Extract PDF Pages lets you save selected pages from a PDF into a new separate PDF file online." },
              { q: "Can I extract only specific PDF pages?", a: "Yes. You can extract a single page, multiple pages, or a custom page range from your PDF." },
              { q: "Will extracted pages keep original quality?", a: "Yes. Extracted PDF pages preserve the original formatting, text quality, and layout." },
              { q: "Can I split every PDF page into separate files?", a: "Yes. Use 'Extract all pages' mode to create individual PDFs for each page." },
              { q: "Does Extract PDF work on mobile devices?", a: "Yes. PDFLinx Extract PDF works on Android, iPhone, tablets, and desktop browsers." },
              { q: "Are my uploaded PDFs secure?", a: "Yes. Files are securely processed and automatically deleted after extraction." },
            ],
            showPdfTypes: false,
          },
        }}
      />

    </>
  );
}





































// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   Download,
//   ShieldCheck,
//   MonitorSmartphone,
//   CheckCircle,
//   Scissors,
//   Layers3,
//   Trash2,
//   Grid2x2,
//   LayoutGrid,
//   Columns3,
//   Circle,
// } from "lucide-react";
// import Script from "next/script";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// // ── PDF Pages Preview Component ──────────────────────────────────────────────
// function PdfPagesPreview({ file, selectedPages, setSelectedPages, extractMode }) {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!file) return;
//     let cancelled = false;
//     setLoading(true);
//     setPages([]);

//     const loadPages = async () => {
//       try {
//         const tryLoad = async () => {
//           if (!window.pdfjsLib) {
//             await new Promise(r => setTimeout(r, 100));
//             return tryLoad();
//           }
//           const arrayBuffer = await file.arrayBuffer();
//           const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//           const total = pdf.numPages;
//           const renderedPages = [];

//           for (let i = 1; i <= total; i++) {
//             if (cancelled) return;
//             const page = await pdf.getPage(i);
//             const viewport = page.getViewport({ scale: 0.45 });
//             const canvas = document.createElement("canvas");
//             canvas.width = viewport.width;
//             canvas.height = viewport.height;
//             await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
//             renderedPages.push(canvas.toDataURL());
//           }

//           if (!cancelled) {
//             setPages(renderedPages);
//             setLoading(false);
//           }
//         };
//         await tryLoad();
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };

//     loadPages();
//     return () => { cancelled = true; };
//   }, [file]);

//   const togglePage = (pageNum) => {
//     if (extractMode === "all") return;
//     setSelectedPages(prev =>
//       prev.includes(pageNum)
//         ? prev.filter(p => p !== pageNum)
//         : [...prev, pageNum].sort((a, b) => a - b)
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#f24d0d]" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-wrap gap-6">
//       {pages.map((src, i) => {
//         const pageNum = i + 1;
//         const isSelected = extractMode === "all" || selectedPages.includes(pageNum);
//         return (
//           <div
//             key={i}
//             onClick={() => togglePage(pageNum)}
//             className={`relative flex flex-col items-center cursor-pointer group`}
//           >
//             {/* Checkmark */}
//             {isSelected && (
//               <div className="absolute -top-2 -left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow">
//                 <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             )}

//             <div className={`w-[190px] rounded-xl border-2 bg-white p-3 shadow-sm transition-all ${
//               isSelected
//                 ? "border-[#f24d0d] shadow-md"
//                 : "border-slate-200 hover:border-slate-400"
//             }`}>
//               <div className="aspect-[3/4] overflow-hidden bg-white">
//                 <img
//                   src={src}
//                   alt={`Page ${pageNum}`}
//                   className="h-full w-full object-contain"
//                 />
//               </div>
//             </div>
//             <span className="mt-2 text-sm text-slate-500">{pageNum}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function ExtractPdf() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [activeTab, setActiveTab] = useState("pages");
//   const [extractMode, setExtractMode] = useState("all");
//   const [pageRange, setPageRange] = useState("");
//   const [selectedPages, setSelectedPages] = useState([]);
//   const [mergeIntoOne, setMergeIntoOne] = useState(false);

//   const file = flow.files?.[0] || null;

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = "extracted-pages.pdf";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleConvert = async () => {
//     if (!flow.files?.length) return;

//     // Validate
//     if (extractMode === "selected" && selectedPages.length === 0 && !pageRange.trim()) {
//       return flow.handleError("Please select pages or enter a page range.");
//     }

//     flow.startProcessing();
//     startProgress();

//     try {
//       const formData = new FormData();
//       flow.files.forEach(f => formData.append("files", f));
//       formData.append("extractMode", extractMode);
//       formData.append("mergeIntoOne", String(mergeIntoOne));

//       if (extractMode === "selected") {
//         // Use selectedPages if clicked, else pageRange text
//         const pages = selectedPages.length > 0
//           ? selectedPages.join(",")
//           : pageRange;
//         formData.append("pageRange", pages);
//       }

//       const res = await fetch("/convert/extract-pdf", { method: "POST", body: formData });

//       if (!res.ok) throw new Error("Failed to extract PDF pages");

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       console.error(err);
//       cancelProgress();
//       flow.handleError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onReady={() => {
//           if (window.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//           }
//         }}
//       />

//       <Script
//         id="faq-schema-extract-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "What does Extract PDF Pages do?", acceptedAnswer: { "@type": "Answer", text: "Extract PDF Pages lets you save selected pages from a PDF into a new separate PDF file online." } },
//               { "@type": "Question", name: "Can I extract only specific PDF pages?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can extract a single page, multiple pages, or a custom page range from your PDF." } },
//               { "@type": "Question", name: "Will extracted pages keep original quality?", acceptedAnswer: { "@type": "Answer", text: "Yes. Extracted PDF pages preserve the original formatting, text quality, and layout." } },
//             ],
//           }),
//         }}
//       />

//       <ToolPageLayout
//         title="Extract PDF Pages Online"
//         tagline="Save Specific PDF Pages · Split Selected Pages"
//         accept=".pdf,application/pdf"
//         multiple={false}
//         convertLabel="Extract Pages"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsTitle="Extract options"
//         processingTitle="Extracting PDF pages..."
//         processingDescription="Preparing selected pages. Please wait."
//         processingStages={["Uploading", "Extracting pages", "Done"]}
//         doneTitle="Your extracted PDF is ready"
//         doneDescription="Download your selected PDF pages instantly."
//         downloadLabel="Download Extracted PDF"
//         resetLabel="Extract another PDF"
//         sidebarTitle="Extract PDF Pages"
//         sidebarIcon={<Scissors className="h-5 w-5 text-white" />}
//         sidebarDescription="Extract selected pages from your PDF into a new separate PDF file."
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF supported"

//         customOptionsLayout={
//           <div className="grid grid-cols-[1fr_380px] h-[calc(100vh-80px)] overflow-hidden">

//             {/* ── LEFT — PDF Pages ── */}
//             <div className="overflow-auto bg-[#f3f3f7] px-10 py-8">
//               {file && (
//                 <PdfPagesPreview
//                   file={file}
//                   selectedPages={selectedPages}
//                   setSelectedPages={setSelectedPages}
//                   extractMode={extractMode}
//                 />
//               )}
//             </div>

//             {/* ── RIGHT SIDEBAR ── */}
//             <div className="flex h-[calc(100vh-80px)] flex-col border-l border-slate-200 bg-white">

//               {/* Header */}
//               <div className="border-b border-slate-200 px-6 py-5">
//                 <h2 className="text-[40px] font-light tracking-tight text-slate-800">
//                   Split
//                 </h2>
//               </div>

//               {/* Tabs */}
//               <div className="grid grid-cols-3 border-b border-slate-200">
//                 {[
//                   { key: "range", label: "Range", icon: <LayoutGrid className="h-7 w-7" /> },
//                   { key: "pages", label: "Pages", icon: <Grid2x2 className="h-7 w-7" /> },
//                   { key: "size",  label: "Size",  icon: <Columns3 className="h-7 w-7" /> },
//                 ].map((tab, idx) => {
//                   const isActive = activeTab === tab.key;
//                   return (
//                     <button
//                       key={tab.key}
//                       type="button"
//                       onClick={() => setActiveTab(tab.key)}
//                       className={`relative flex flex-col items-center gap-2 py-5 transition ${
//                         idx < 2 ? "border-r border-slate-200" : ""
//                       } ${isActive ? "bg-white" : "bg-slate-50 hover:bg-slate-100"}`}
//                     >
//                       {/* Active checkmark */}
//                       {isActive && (
//                         <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
//                           <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                       )}
//                       <span className={isActive ? "text-slate-800" : "text-slate-400"}>
//                         {tab.icon}
//                       </span>
//                       <span className={`text-sm ${isActive ? "font-semibold text-slate-800" : "text-slate-500"}`}>
//                         {tab.label}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Content */}
//               <div className="flex-1 overflow-y-auto p-5">

//                 {/* Pages Tab — FUNCTIONAL */}
//                 {activeTab === "pages" && (
//                   <div className="space-y-6">
//                     <p className="text-2xl font-light text-slate-800">Extract mode:</p>

//                     {/* Mode buttons */}
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         type="button"
//                         onClick={() => { setExtractMode("all"); setSelectedPages([]); }}
//                         className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${
//                           extractMode === "all"
//                             ? "border-[#f24d0d] bg-[#fff1ec] text-[#f24d0d]"
//                             : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
//                         }`}
//                       >
//                         Extract all pages
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setExtractMode("selected")}
//                         className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${
//                           extractMode === "selected"
//                             ? "border-[#f24d0d] bg-[#fff1ec] text-[#f24d0d]"
//                             : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
//                         }`}
//                       >
//                         Select pages
//                       </button>
//                     </div>

//                     {/* Selected pages info */}
//                     {extractMode === "selected" && (
//                       <div className="space-y-3">
//                         <p className="text-sm font-medium text-slate-700">
//                           Click pages on the left to select, or type below:
//                         </p>

//                         {selectedPages.length > 0 && (
//                           <div className="rounded-xl border border-[#f24d0d]/30 bg-orange-50 px-4 py-3 text-sm text-[#f24d0d]">
//                             Selected: <strong>{selectedPages.join(", ")}</strong>
//                           </div>
//                         )}

//                         <label className="block text-sm font-medium text-slate-700">
//                           Or type pages manually:
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="example: 1,5-8"
//                           value={pageRange}
//                           onChange={(e) => setPageRange(e.target.value)}
//                           className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#f24d0d]"
//                         />
//                       </div>
//                     )}

//                     {/* Merge checkbox */}
//                     <label className="flex items-start gap-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={mergeIntoOne}
//                         onChange={(e) => setMergeIntoOne(e.target.checked)}
//                         className="mt-1 h-4 w-4 accent-[#f24d0d]"
//                       />
//                       <span className="text-sm leading-6 text-slate-700">
//                         Merge extracted pages into one PDF file.
//                       </span>
//                     </label>

//                     {/* Info box */}
//                     {extractMode === "all" && (
//                       <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
//                         ℹ️ All pages will be extracted into separate PDF files.
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Range Tab — coming soon */}
//                 {activeTab === "range" && (
//                   <div className="flex h-full items-center justify-center">
//                     <p className="text-center text-sm text-slate-400">Range mode coming soon.</p>
//                   </div>
//                 )}

//                 {/* Size Tab — coming soon */}
//                 {activeTab === "size" && (
//                   <div className="flex h-full items-center justify-center">
//                     <p className="text-center text-sm text-slate-400">Size split coming soon.</p>
//                   </div>
//                 )}
//               </div>

//               {/* Extract button — sticky bottom */}
//               <div className="sticky bottom-0 border-t border-slate-200 bg-white p-5">
//                 <button
//                   type="button"
//                   onClick={handleConvert}
//                   disabled={!flow.files.length}
//                   className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white transition active:scale-[0.98] ${
//                     flow.files.length
//                       ? "bg-[#f24d0d] hover:bg-[#dd4309] shadow-[0_10px_30px_rgba(242,77,13,0.35)]"
//                       : "cursor-not-allowed bg-slate-300"
//                   }`}
//                 >
//                   <Scissors className="h-5 w-5" />
//                   Extract PDF
//                 </button>
//               </div>
//             </div>
//           </div>
//         }

//         uploadLanding={{
//           content: {
//             eyebrow: "EXTRACT PDF PAGES",
//             heroTitle: (
//               <>
//                 Extract PDF Pages <br />
//                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
//                   instantly online
//                 </em>
//               </>
//             ),
//             heroDescription:
//               "Extract pages from PDF online for free. Save selected pages, split page ranges, or create separate PDFs directly in your browser.",
//             noticeTitle: "Extract PDF features",
//             noticeItems: [
//               "Extract selected pages",
//               "Split page ranges",
//               "Keep original quality",
//             ],
//             howToTitle: "How to extract PDF pages",
//             howToSubtitle: "Upload your PDF, choose the pages you want to extract, and download a new PDF instantly.",
//             howToSteps: [
//               { n: "1", title: "Upload your PDF", desc: "Select your PDF file from your device.", color: "bg-blue-600" },
//               { n: "2", title: "Choose pages", desc: "Click pages to select or enter page numbers/ranges.", color: "bg-purple-600" },
//               { n: "3", title: "Download extracted PDF", desc: "Save your selected pages as a new PDF instantly.", color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why use PDFLinx Extract PDF?",
//             whyItems: [
//               { title: "Extract Specific Pages", desc: "Save only the pages you need from large PDF documents.", icon: Scissors, iconColor: "text-orange-500", bgColor: "bg-orange-100" },
//               { title: "Preserve PDF Quality", desc: "Extracted pages maintain original text and layout quality.", icon: CheckCircle, iconColor: "text-green-600", bgColor: "bg-green-100" },
//               { title: "Multiple Extraction Modes", desc: "Extract ranges, single pages, or split all pages separately.", icon: Layers3, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
//               { title: "Fast Online Tool", desc: "Extract PDF pages directly in your browser within seconds.", icon: Download, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
//               { title: "Works Everywhere", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
//               { title: "Private & Secure", desc: "Uploaded PDFs are securely processed and deleted automatically.", icon: ShieldCheck, iconColor: "text-emerald-600", bgColor: "bg-emerald-100" },
//             ],
//             seoBadge: "Extract PDF Tool",
//             seoTitle: "Extract PDF Pages Online Free",
//             seoDescription: "Extract pages from PDF online for free. Save selected pages or page ranges into a new PDF instantly without losing quality.",
//             seoSections: [
//               { title: "Extract Only the Pages You Need", text: "Save specific pages from large PDF files without downloading or editing the full document." },
//               { title: "Split PDF Page Ranges", text: "Extract page ranges like 1-5 or combine selected pages into a separate PDF file." },
//               { title: "Preserve Original Formatting", text: "Extracted pages maintain original text clarity, images, layout, and formatting." },
//               { title: "No Software Installation Needed", text: "Extract PDF pages directly from your browser on desktop and mobile devices." },
//             ],
//             faqTitle: "Frequently asked questions",
//             faqs: [
//               { q: "What does Extract PDF Pages do?", a: "Extract PDF Pages lets you save selected pages from a PDF into a new separate PDF file online." },
//               { q: "Can I extract only specific PDF pages?", a: "Yes. You can extract a single page, multiple pages, or a custom page range from your PDF." },
//               { q: "Will extracted pages keep original quality?", a: "Yes. Extracted PDF pages preserve the original formatting, text quality, and layout." },
//               { q: "Can I split every PDF page into separate files?", a: "Yes. Use 'Extract all pages' mode to create individual PDFs for each page." },
//               { q: "Does Extract PDF work on mobile devices?", a: "Yes. PDFLinx Extract PDF works on Android, iPhone, tablets, and desktop browsers." },
//               { q: "Are my uploaded PDFs secure?", a: "Yes. Files are securely processed and automatically deleted after extraction." },
//             ],
//             showPdfTypes: false,
//           },
//         }}
//       />
//     </>
//   );
// }













































// // "use client";

// // import { useState, useRef, useEffect } from "react";

// // import {
// //     Download,
// //     ShieldCheck,
// //     MonitorSmartphone,
// //     CheckCircle,
// //     Scissors,
// //     FileOutput,
// //     Trash2,
// //     Grid2x2,
// //     LayoutGrid,
// //     Columns3,
// //     Circle,
// //     Layers3,
// // } from "lucide-react";

// // import Script from "next/script";

// // import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // import { useToolFlow } from "@/hooks/useToolFlow";
// // import { useProgressBar } from "@/hooks/useProgressBar";

// // import {
// //     DEFAULT_DONE_LINKS,
// //     DEFAULT_SIDEBAR_FEATURES,
// // } from "@/lib/toolUiConfig";

// // // function PdfThumbnail({ url }) {
// // //     const canvasRef = useRef(null);

// // //     useEffect(() => {
// // //         if (!url || !window.pdfjsLib) return;

// // //         const tryRender = () => {
// // //             if (!window.pdfjsLib) return setTimeout(tryRender, 100);

// // //             window.pdfjsLib
// // //                 .getDocument(url)
// // //                 .promise.then((pdf) => pdf.getPage(1))
// // //                 .then((page) => {
// // //                     const viewport = page.getViewport({ scale: 0.6 });

// // //                     const canvas = canvasRef.current;

// // //                     if (!canvas) return;

// // //                     canvas.width = viewport.width;
// // //                     canvas.height = viewport.height;

// // //                     page.render({
// // //                         canvasContext: canvas.getContext("2d"),
// // //                         viewport,
// // //                     });
// // //                 })
// // //                 .catch(console.error);
// // //         };

// // //         tryRender();
// // //     }, [url]);

// // //     return (
// // //         <canvas
// // //             ref={canvasRef}
// // //             className="h-full w-full object-contain bg-white"
// // //         />
// // //     );
// // // }



// // function PdfPagesPreview({ file }) {

// //     const [pages, setPages] = useState([]);

// //     useEffect(() => {

// //         if (!file || !window.pdfjsLib) return;

// //         let cancelled = false;

// //         const loadPages = async () => {

// //             try {

// //                 const arrayBuffer = await file.arrayBuffer();

// //                 const pdf =
// //                     await window.pdfjsLib
// //                         .getDocument({ data: arrayBuffer })
// //                         .promise;

// //                 const total = pdf.numPages;

// //                 const renderedPages = [];

// //                 for (let i = 1; i <= total; i++) {

// //                     const page = await pdf.getPage(i);

// //                     const viewport =
// //                         page.getViewport({ scale: 0.45 });

// //                     const canvas =
// //                         document.createElement("canvas");

// //                     const context =
// //                         canvas.getContext("2d");

// //                     canvas.width = viewport.width;

// //                     canvas.height = viewport.height;

// //                     await page.render({
// //                         canvasContext: context,
// //                         viewport,
// //                     }).promise;

// //                     renderedPages.push(
// //                         canvas.toDataURL()
// //                     );
// //                 }

// //                 if (!cancelled) {
// //                     setPages(renderedPages);
// //                 }

// //             } catch (err) {
// //                 console.error(err);
// //             }
// //         };

// //         loadPages();

// //         return () => {
// //             cancelled = true;
// //         };

// //     }, [file]);

// //     return (

// //         <div className="flex flex-wrap gap-8">

// //             {pages.map((src, i) => (

// //                 <div
// //                     key={i}
// //                     className="flex flex-col items-center"
// //                 >

// //                     <div className="w-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

// //                         <div className="aspect-[3/4] overflow-hidden border border-slate-200 bg-white">

// //                             <img
// //                                 src={src}
// //                                 alt={`Page ${i + 1}`}
// //                                 className="h-full w-full object-contain"
// //                             />

// //                         </div>
// //                     </div>

// //                     <span className="mt-3 text-sm text-slate-500">
// //                         {i + 1}
// //                     </span>

// //                 </div>
// //             ))}

// //         </div>
// //     );
// // }



// // export default function ExtractPdf() {
// //     const flow = useToolFlow();

// //     const {
// //         progress,
// //         startProgress,
// //         completeProgress,
// //         cancelProgress,
// //     } = useProgressBar();

// //     const [downloadUrl, setDownloadUrl] = useState(null);

// //     //   const [extractMode, setExtractMode] = useState("range");
// //     const [activeTab, setActiveTab] = useState("pages");

// //     const [extractMode, setExtractMode] = useState("selected");

// //     const [pageRange, setPageRange] = useState("");

// //     const handleRemoveFile = (index) => {
// //         const updated = flow.files.filter((_, i) => i !== index);

// //         if (updated.length === 0) flow.reset();
// //         else flow.selectFiles(updated);
// //     };

// //     const handleDownload = () => {
// //         if (!downloadUrl) return;

// //         const a = document.createElement("a");

// //         a.href = downloadUrl;
// //         a.download = "extracted-pages.pdf";

// //         document.body.appendChild(a);

// //         a.click();

// //         a.remove();
// //     };

// //     const handleConvert = async () => {
// //         if (!flow.files?.length) return;

// //         flow.startProcessing();

// //         startProgress();

// //         try {
// //             const formData = new FormData();

// //             flow.files.forEach((file) => {
// //                 formData.append("files", file);
// //             });

// //             formData.append("extractMode", extractMode);
// //             formData.append("pageRange", pageRange);

// //             const res = await fetch("/convert/extract-pdf", {
// //                 method: "POST",
// //                 body: formData,
// //             });

// //             if (!res.ok) {
// //                 throw new Error("Failed to extract PDF pages");
// //             }

// //             const blob = await res.blob();

// //             const url = URL.createObjectURL(blob);

// //             setDownloadUrl(url);

// //             completeProgress();

// //             flow.finishSuccess();
// //         } catch (err) {
// //             console.error(err);

// //             cancelProgress();

// //             flow.handleError("Something went wrong");
// //         }
// //     };

// //     return (
// //         <>
// //             {/* ================= SEO ================= */}

// //             <Script
// //                 id="faq-schema-extract-pdf"
// //                 type="application/ld+json"
// //                 strategy="afterInteractive"
// //                 dangerouslySetInnerHTML={{
// //                     __html: JSON.stringify({
// //                         "@context": "https://schema.org",
// //                         "@type": "FAQPage",
// //                         mainEntity: [
// //                             {
// //                                 "@type": "Question",
// //                                 name: "What does Extract PDF Pages do?",
// //                                 acceptedAnswer: {
// //                                     "@type": "Answer",
// //                                     text: "Extract PDF Pages lets you save selected pages from a PDF into a new separate PDF file online.",
// //                                 },
// //                             },
// //                             {
// //                                 "@type": "Question",
// //                                 name: "Can I extract only specific PDF pages?",
// //                                 acceptedAnswer: {
// //                                     "@type": "Answer",
// //                                     text: "Yes. You can extract a single page, multiple pages, or a custom page range from your PDF.",
// //                                 },
// //                             },
// //                             {
// //                                 "@type": "Question",
// //                                 name: "Will extracted pages keep original quality?",
// //                                 acceptedAnswer: {
// //                                     "@type": "Answer",
// //                                     text: "Yes. Extracted PDF pages preserve the original formatting, text quality, and layout.",
// //                                 },
// //                             },
// //                         ],
// //                     }),
// //                 }}
// //             />

// //             {/* ================= UI ================= */}

// //             <ToolPageLayout
// //                 title="Extract PDF Pages Online"
// //                 tagline="Save Specific PDF Pages · Split Selected Pages"
// //                 accept=".pdf,application/pdf"
// //                 multiple={false}
// //                 convertLabel="Extract Pages"
// //                 flow={flow}
// //                 progress={progress}
// //                 onRemoveFile={handleRemoveFile}
// //                 onConvert={handleConvert}
// //                 onDownload={handleDownload}
// //                 doneLinks={DEFAULT_DONE_LINKS}
// //                 showOutputFormat={false}
// //                 showPreserveLayout={false}
// //                 optionsTitle="Extract options"

// //                 processingTitle="Extracting PDF pages..."

// //                 processingDescription="Preparing selected pages. Please wait."

// //                 processingStages={[
// //                     "Uploading",
// //                     "Extracting pages",
// //                     "Done",
// //                 ]}

// //                 doneTitle="Your extracted PDF is ready"

// //                 doneDescription="Download your selected PDF pages instantly."

// //                 downloadLabel="Download Extracted PDF"

// //                 resetLabel="Extract another PDF"

// //                 sidebarTitle="Extract PDF Pages"

// //                 sidebarIcon={<Scissors className="h-5 w-5 text-white" />}

// //                 sidebarDescription="Extract selected pages from your PDF into a new separate PDF file."

// //                 sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}

// //                 uploadTitle="Drop your PDF here"

// //                 uploadSubtitle="or click to browse — PDF supported"

// //                 // customOptionsLayout={
// //                 //   <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

// //                 //     {/* LEFT */}

// //                 //     <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">

// //                 //       <div className="flex flex-wrap justify-center gap-8 pt-8">

// //                 //         {flow.files.map((file, i) => (

// //                 //           <div
// //                 //             key={i}
// //                 //             className="group flex w-[250px] flex-col items-center gap-4"
// //                 //           >
// //                 //             {/* PDF */}

// //                 //             <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

// //                 //               <PdfThumbnail
// //                 //                 url={URL.createObjectURL(file)}
// //                 //               />

// //                 //               {/* PAGE RANGE OVERLAY */}

// //                 //               <div className="absolute inset-x-6 bottom-6 rounded-xl border border-[#f24d0d]/20 bg-white/95 p-4 shadow-lg backdrop-blur">

// //                 //                 <div className="flex items-center gap-2">
// //                 //                   <Files className="h-4 w-4 text-[#f24d0d]" />

// //                 //                   <span className="text-sm font-semibold text-slate-800">
// //                 //                     Extract Pages
// //                 //                   </span>
// //                 //                 </div>

// //                 //                 <p className="mt-2 text-xs text-slate-500">
// //                 //                   Example: 1-5, 8, 10-12
// //                 //                 </p>
// //                 //               </div>

// //                 //               {/* REMOVE */}

// //                 //               <button
// //                 //                 type="button"
// //                 //                 onClick={() => handleRemoveFile(i)}
// //                 //                 className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
// //                 //               >
// //                 //                 <Trash2 className="h-4 w-4" />
// //                 //               </button>
// //                 //             </div>

// //                 //             {/* FILE NAME */}

// //                 //             <p className="w-full truncate text-center text-xs text-slate-500">
// //                 //               {file.name}
// //                 //             </p>
// //                 //           </div>
// //                 //         ))}
// //                 //       </div>
// //                 //     </div>

// //                 //     {/* RIGHT SIDEBAR */}

// //                 //     <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">

// //                 //       <div className="flex-1 overflow-y-auto p-5 space-y-5">

// //                 //         <h3 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-800">
// //                 //           Extract Pages
// //                 //         </h3>

// //                 //         {/* MODE */}

// //                 //         <div className="space-y-3">

// //                 //           <label className="block text-sm font-semibold text-slate-700">
// //                 //             Extraction mode
// //                 //           </label>

// //                 //           <div className="space-y-2">

// //                 //             <button
// //                 //               onClick={() => setExtractMode("range")}
// //                 //               className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                 //                 extractMode === "range"
// //                 //                   ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                 //                   : "border-slate-200 hover:bg-slate-50"
// //                 //               }`}
// //                 //             >
// //                 //               Extract Page Range
// //                 //             </button>

// //                 //             <button
// //                 //               onClick={() => setExtractMode("single")}
// //                 //               className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                 //                 extractMode === "single"
// //                 //                   ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                 //                   : "border-slate-200 hover:bg-slate-50"
// //                 //               }`}
// //                 //             >
// //                 //               Extract Single Pages
// //                 //             </button>

// //                 //             <button
// //                 //               onClick={() => setExtractMode("all")}
// //                 //               className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                 //                 extractMode === "all"
// //                 //                   ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                 //                   : "border-slate-200 hover:bg-slate-50"
// //                 //               }`}
// //                 //             >
// //                 //               Extract All Pages Separately
// //                 //             </button>

// //                 //           </div>
// //                 //         </div>

// //                 //         {/* PAGE RANGE */}

// //                 //         <div className="space-y-2">

// //                 //           <label className="block text-sm font-semibold text-slate-700">
// //                 //             Page selection
// //                 //           </label>

// //                 //           <input
// //                 //             type="text"
// //                 //             placeholder="Example: 1-5, 8, 10-12"
// //                 //             value={pageRange}
// //                 //             onChange={(e) =>
// //                 //               setPageRange(e.target.value)
// //                 //             }
// //                 //             className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#f24d0d] focus:ring-2 focus:ring-orange-100"
// //                 //           />

// //                 //           <p className="text-xs leading-5 text-slate-500">
// //                 //             Separate pages with commas and ranges with hyphens.
// //                 //           </p>
// //                 //         </div>

// //                 //         {/* INFO */}

// //                 //         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

// //                 //           <div className="flex items-center gap-2">
// //                 //             <FileOutput className="h-5 w-5 text-purple-600" />

// //                 //             <h4 className="font-semibold text-slate-800">
// //                 //               Flexible Extraction
// //                 //             </h4>
// //                 //           </div>

// //                 //           <p className="mt-2 text-sm leading-6 text-slate-500">
// //                 //             Extract only the pages you need while preserving original quality and formatting.
// //                 //           </p>
// //                 //         </div>

// //                 //         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

// //                 //           <div className="flex items-center gap-2">
// //                 //             <Layers3 className="h-5 w-5 text-blue-600" />

// //                 //             <h4 className="font-semibold text-slate-800">
// //                 //               Multiple Extraction Modes
// //                 //             </h4>
// //                 //           </div>

// //                 //           <p className="mt-2 text-sm leading-6 text-slate-500">
// //                 //             Extract page ranges, individual pages, or split every page into separate PDFs.
// //                 //           </p>
// //                 //         </div>

// //                 //         {/* SECURITY */}

// //                 //         <div className="rounded-xl border border-green-200 bg-green-50 p-4">

// //                 //           <p className="text-sm font-semibold text-green-700">
// //                 //             ✓ Secure PDF Processing
// //                 //           </p>

// //                 //           <p className="mt-2 text-xs leading-5 text-slate-600">
// //                 //             Files are encrypted during upload and automatically deleted after processing.
// //                 //           </p>
// //                 //         </div>
// //                 //       </div>

// //                 //       {/* BUTTON */}

// //                 //       <div className="border-t border-slate-200 p-4">

// //                 //         <button
// //                 //           type="button"
// //                 //           onClick={handleConvert}
// //                 //           disabled={!flow.files.length}
// //                 //           className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${
// //                 //             flow.files.length
// //                 //               ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
// //                 //               : "cursor-not-allowed bg-slate-300"
// //                 //           }`}
// //                 //         >
// //                 //           <Scissors className="h-5 w-5" />
// //                 //           Extract Pages
// //                 //         </button>
// //                 //       </div>
// //                 //     </div>
// //                 //   </div>
// //                 // }


// //                 customOptionsLayout={

// //                     <div className="grid grid-cols-[1fr_380px] h-[calc(100vh-80px)] overflow-hidden">

// //                         {/* ================= LEFT ================= */}

// //                         <div className="overflow-auto bg-[#f3f3f7] px-10 py-8">

// //                             <div className="overflow-auto bg-[#f3f3f7] px-10 py-8">

// //                                 {flow.files.map((file, i) => (

// //                                     <div key={i} className="mb-10 relative">

// //                                         {/* REMOVE */}

// //                                         <button
// //                                             type="button"
// //                                             onClick={() => handleRemoveFile(i)}
// //                                             className="absolute left-0 top-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
// //                                         >
// //                                             <Trash2 className="h-4 w-4" />
// //                                         </button>

// //                                         <PdfPagesPreview file={file} />

// //                                     </div>
// //                                 ))}

// //                             </div>


// //                         </div>

// //                         {/* ================= RIGHT SIDEBAR ================= */}

// //                         {/* <div className="flex flex-col border-l border-slate-300 bg-white"> */}
// //                         <div className="flex h-[calc(100vh-80px)] flex-col border-l border-slate-300 bg-white">

// //                             {/* HEADER */}

// //                             <div className="border-b border-slate-200 px-6 py-5">

// //                                 <h2 className="text-[44px] font-light tracking-tight text-slate-800">
// //                                     Split
// //                                 </h2>

// //                             </div>

// //                             {/* TABS */}

// //                             <div className="grid grid-cols-3 border-b border-slate-200">

// //                                 {/* RANGE */}

// //                                 <button
// //                                     type="button"
// //                                     onClick={() => setActiveTab("range")}
// //                                     className={`flex flex-col items-center gap-2 border-r border-slate-200 py-5 transition ${activeTab === "range"
// //                                         ? "bg-white"
// //                                         : "bg-slate-50 hover:bg-slate-100"
// //                                         }`}
// //                                 >

// //                                     <LayoutGrid className="h-8 w-8 text-slate-400" />

// //                                     <span className="text-sm text-slate-600">
// //                                         Range
// //                                     </span>

// //                                 </button>

// //                                 {/* PAGES */}

// //                                 <button
// //                                     type="button"
// //                                     onClick={() => setActiveTab("pages")}
// //                                     className={`relative flex flex-col items-center gap-2 border-r border-slate-200 py-5 transition ${activeTab === "pages"
// //                                         ? "bg-white"
// //                                         : "bg-slate-50 hover:bg-slate-100"
// //                                         }`}
// //                                 >

// //                                     {/* ACTIVE DOT */}

// //                                     {activeTab === "pages" && (
// //                                         <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">

// //                                             <Circle className="h-2.5 w-2.5 fill-white text-white" />

// //                                         </div>
// //                                     )}

// //                                     <Grid2x2 className="h-8 w-8 text-slate-700" />

// //                                     <span className="text-sm font-medium text-slate-800">
// //                                         Pages
// //                                     </span>

// //                                 </button>

// //                                 {/* SIZE */}

// //                                 <button
// //                                     type="button"
// //                                     onClick={() => setActiveTab("size")}
// //                                     className={`flex flex-col items-center gap-2 py-5 transition ${activeTab === "size"
// //                                         ? "bg-white"
// //                                         : "bg-slate-50 hover:bg-slate-100"
// //                                         }`}
// //                                 >

// //                                     <Columns3 className="h-8 w-8 text-slate-400" />

// //                                     <span className="text-sm text-slate-600">
// //                                         Size
// //                                     </span>

// //                                 </button>

// //                             </div>

// //                             {/* CONTENT */}

// //                             {/* <div className="flex-1 overflow-y-auto p-5"> */}
// //                             <div className="flex-1 overflow-y-auto p-5 pb-40">

// //                                 {/* ONLY PAGES TAB FUNCTIONAL */}

// //                                 {activeTab === "pages" && (

// //                                     <div className="space-y-6">

// //                                         {/* TITLE */}

// //                                         <div>

// //                                             <p className="text-[28px] font-light text-slate-800">
// //                                                 Extract mode:
// //                                             </p>

// //                                         </div>

// //                                         {/* BUTTONS */}

// //                                         <div className="grid grid-cols-2 gap-3">

// //                                             {/* ALL */}

// //                                             <button
// //                                                 type="button"
// //                                                 onClick={() => setExtractMode("all")}
// //                                                 className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${extractMode === "all"
// //                                                     ? "border-[#f24d0d] bg-[#fff1ec] text-[#f24d0d]"
// //                                                     : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
// //                                                     }`}
// //                                             >
// //                                                 Extract all pages
// //                                             </button>

// //                                             {/* SELECT */}

// //                                             <button
// //                                                 type="button"
// //                                                 onClick={() => setExtractMode("selected")}
// //                                                 className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${extractMode === "selected"
// //                                                     ? "border-[#f24d0d] bg-[#fff1ec] text-[#f24d0d]"
// //                                                     : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
// //                                                     }`}
// //                                             >
// //                                                 Select pages
// //                                             </button>

// //                                         </div>

// //                                         {/* INPUT */}

// //                                         {extractMode === "selected" && (

// //                                             <div className="space-y-3">

// //                                                 <label className="block text-lg font-medium text-slate-700">
// //                                                     Pages to extract:
// //                                                 </label>

// //                                                 <input
// //                                                     type="text"
// //                                                     placeholder="example: 1,5-8"
// //                                                     value={pageRange}
// //                                                     onChange={(e) =>
// //                                                         setPageRange(e.target.value)
// //                                                     }
// //                                                     className="w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-[#f24d0d]"
// //                                                 />

// //                                             </div>
// //                                         )}

// //                                         {/* CHECKBOX */}

// //                                         <label className="flex items-start gap-3 cursor-pointer">

// //                                             <input
// //                                                 type="checkbox"
// //                                                 className="mt-1 h-5 w-5 rounded border-slate-300"
// //                                             />

// //                                             <span className="text-sm leading-6 text-slate-700">
// //                                                 Merge extracted pages into one PDF file.
// //                                             </span>

// //                                         </label>

// //                                     </div>
// //                                 )}

// //                                 {/* RANGE */}

// //                                 {activeTab === "range" && (

// //                                     <div className="flex h-full items-center justify-center">

// //                                         <p className="text-center text-sm leading-6 text-slate-400">
// //                                             Range mode UI coming soon.
// //                                         </p>

// //                                     </div>
// //                                 )}

// //                                 {/* SIZE */}

// //                                 {activeTab === "size" && (

// //                                     <div className="flex h-full items-center justify-center">

// //                                         <p className="text-center text-sm leading-6 text-slate-400">
// //                                             Size split mode UI coming soon.
// //                                         </p>

// //                                     </div>
// //                                 )}

// //                             </div>

// //                             {/* BUTTON */}

// //                             {/* <div className="border-t border-slate-200 p-5"> */}
// //                             <div className="sticky bottom-0 border-t border-slate-200 bg-white p-5">

// //                                 <button
// //                                     type="button"
// //                                     onClick={handleConvert}
// //                                     disabled={!flow.files.length}
// //                                     className={`flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-bold text-white transition ${flow.files.length
// //                                         ? "bg-[#f24d0d] hover:bg-[#dd4309]"
// //                                         : "cursor-not-allowed bg-slate-300"
// //                                         }`}
// //                                 >

// //                                     <Scissors className="h-6 w-6" />

// //                                     Split PDF

// //                                 </button>

// //                             </div>
// //                         </div>
// //                     </div>
// //                 }



// //                 uploadLanding={{
// //                     content: {
// //                         eyebrow: "EXTRACT PDF PAGES",

// //                         heroTitle: (
// //                             <>
// //                                 Extract PDF Pages <br />
// //                                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
// //                                     instantly online
// //                                 </em>
// //                             </>
// //                         ),

// //                         heroDescription:
// //                             "Extract pages from PDF online for free. Save selected pages, split page ranges, or create separate PDFs directly in your browser.",

// //                         noticeTitle: "Extract PDF features",

// //                         noticeItems: [
// //                             "Extract selected pages",
// //                             "Split page ranges",
// //                             "Keep original quality",
// //                         ],

// //                         howToTitle: "How to extract PDF pages",

// //                         howToSubtitle:
// //                             "Upload your PDF, choose the pages you want to extract, and download a new PDF instantly.",

// //                         howToSteps: [
// //                             {
// //                                 n: "1",
// //                                 title: "Upload your PDF",
// //                                 desc: "Select your PDF file from your device.",
// //                                 color: "bg-blue-600",
// //                             },

// //                             {
// //                                 n: "2",
// //                                 title: "Choose pages",
// //                                 desc: "Enter page numbers or ranges to extract.",
// //                                 color: "bg-purple-600",
// //                             },

// //                             {
// //                                 n: "3",
// //                                 title: "Download extracted PDF",
// //                                 desc: "Save your selected pages as a new PDF instantly.",
// //                                 color: "bg-emerald-600",
// //                             },
// //                         ],

// //                         whyTitle: "Why use PDFLinx Extract PDF?",

// //                         whyItems: [
// //                             {
// //                                 title: "Extract Specific Pages",
// //                                 desc: "Save only the pages you need from large PDF documents.",
// //                                 icon: Scissors,
// //                                 iconColor: "text-orange-500",
// //                                 bgColor: "bg-orange-100",
// //                             },

// //                             {
// //                                 title: "Preserve PDF Quality",
// //                                 desc: "Extracted pages maintain original text and layout quality.",
// //                                 icon: CheckCircle,
// //                                 iconColor: "text-green-600",
// //                                 bgColor: "bg-green-100",
// //                             },

// //                             {
// //                                 title: "Multiple Extraction Modes",
// //                                 desc: "Extract ranges, single pages, or split all pages separately.",
// //                                 icon: Layers3,
// //                                 iconColor: "text-blue-600",
// //                                 bgColor: "bg-blue-100",
// //                             },

// //                             {
// //                                 title: "Fast Online Tool",
// //                                 desc: "Extract PDF pages directly in your browser within seconds.",
// //                                 icon: Download,
// //                                 iconColor: "text-purple-600",
// //                                 bgColor: "bg-purple-100",
// //                             },

// //                             {
// //                                 title: "Works Everywhere",
// //                                 desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.",
// //                                 icon: MonitorSmartphone,
// //                                 iconColor: "text-slate-600",
// //                                 bgColor: "bg-slate-100",
// //                             },

// //                             {
// //                                 title: "Private & Secure",
// //                                 desc: "Uploaded PDFs are securely processed and deleted automatically.",
// //                                 icon: ShieldCheck,
// //                                 iconColor: "text-emerald-600",
// //                                 bgColor: "bg-emerald-100",
// //                             },
// //                         ],

// //                         seoBadge: "Extract PDF Tool",

// //                         seoTitle: "Extract PDF Pages Online Free",

// //                         seoDescription:
// //                             "Extract pages from PDF online for free. Save selected pages or page ranges into a new PDF instantly without losing quality.",

// //                         seoSections: [
// //                             {
// //                                 title: "Extract Only the Pages You Need",
// //                                 text: "Save specific pages from large PDF files without downloading or editing the full document.",
// //                             },

// //                             {
// //                                 title: "Split PDF Page Ranges",
// //                                 text: "Extract page ranges like 1-5 or combine selected pages into a separate PDF file.",
// //                             },

// //                             {
// //                                 title: "Preserve Original Formatting",
// //                                 text: "Extracted pages maintain original text clarity, images, layout, and formatting.",
// //                             },

// //                             {
// //                                 title: "No Software Installation Needed",
// //                                 text: "Extract PDF pages directly from your browser on desktop and mobile devices.",
// //                             },
// //                         ],

// //                         faqTitle: "Frequently asked questions",

// //                         faqs: [
// //                             {
// //                                 q: "What does Extract PDF Pages do?",
// //                                 a: "Extract PDF Pages lets you save selected pages from a PDF into a new separate PDF file online.",
// //                             },

// //                             {
// //                                 q: "Can I extract only specific PDF pages?",
// //                                 a: "Yes. You can extract a single page, multiple pages, or a custom page range from your PDF.",
// //                             },

// //                             {
// //                                 q: "Will extracted pages keep original quality?",
// //                                 a: "Yes. Extracted PDF pages preserve the original formatting, text quality, and layout.",
// //                             },

// //                             {
// //                                 q: "Can I split every PDF page into separate files?",
// //                                 a: "Yes. Use the 'Extract All Pages Separately' mode to create individual PDFs for each page.",
// //                             },

// //                             {
// //                                 q: "Does Extract PDF work on mobile devices?",
// //                                 a: "Yes. PDFLinx Extract PDF works on Android, iPhone, tablets, and desktop browsers.",
// //                             },

// //                             {
// //                                 q: "Are my uploaded PDFs secure?",
// //                                 a: "Yes. Files are securely processed and automatically deleted after extraction.",
// //                             },
// //                         ],
// //                     },
// //                 }}
// //             />

// //             <RelatedToolsSection />
// //         </>
// //     );
// // }