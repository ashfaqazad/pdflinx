"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Scissors, GitMerge,
  FolderOutput, Trash2, LayoutList,
  Minimize2, RotateCw, Hash, Pencil, X
} from "lucide-react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import MobileDrawerLayout from "@/components/ToolFlow/MobileDrawerLayout";


// ── CONFIG ─────────────────────────────────
// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Extract PDF", href: "/extract-pdf", icon: <FolderOutput className="h-4 w-4 text-cyan-500" /> },
  { label: "Remove Pages", href: "/remove-pages", icon: <Trash2 className="h-4 w-4 text-red-500" /> },
  { label: "Organize PDF", href: "/organize-pdf", icon: <LayoutList className="h-4 w-4 text-blue-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
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

// ── Split Options Sidebar (shared between desktop sidebar + mobile drawer) ─
function SplitSidebarOptions({
  activeTab, onTabChange,
  extractMode, onExtractModeChange,
  selectedPages, totalPages,
  onConvert, files,
  rangeMode, setRangeMode,
  ranges, setRanges,
  pageRangeInput, onPageRangeChange,
  mergeExtracted, onMergeChange,
  // onClose, // only used in mobile drawer
}) {
  const tabs = [
    { key: "range", label: "Range" },
    { key: "pages", label: "Pages" },
    { key: "size", label: "Size" },
  ];

  const outputCount = extractMode === "all" ? totalPages : selectedPages.length;

  return (
    <div className="space-y-4">

      {/* Title row — with close button in mobile drawer */}
      {/* <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-xl font-bold text-slate-900">Split PDF</h3> */}
      {/* {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )} */}


      {/* </div> */}

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

      {/* ── RANGE TAB ── */}
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
  // Mobile drawer state
  // const [drawerOpen, setDrawerOpen] = useState(false);

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
      setPageRangeInput(newSelected.sort((a, b) => a - b).join(","));
      return newSelected;
    });
  }, [setSelectedPages, setPageRangeInput]);

  // Shared sidebar props
  const sidebarProps = {
    activeTab, onTabChange: setActiveTab,
    extractMode, onExtractModeChange: setExtractMode,
    selectedPages, totalPages,
    onConvert, files: file ? [file] : [],
    rangeMode, setRangeMode,
    ranges, setRanges,
    pageRangeInput, onPageRangeChange: setPageRangeInput,
    mergeExtracted, onMergeChange: setMergeExtracted,
  };

  return (
    <>

      <MobileDrawerLayout
        drawerTitle="Split PDF"
        mainContent={
          <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
            <PagePreviewArea
              file={file}
              totalPages={totalPages}
              selectedPages={selectedPages}
              extractMode={extractMode}
              handleTogglePage={handleTogglePage}
              onRemoveFile={onRemoveFile}
            />
          </div>
        }
        drawerContent={
          <SplitSidebarOptions {...sidebarProps} />
        }
        desktopSidebarWidth="w-[350px]"
      />




      {/* ── MOBILE layout: full-width thumbnails + floating gear button + drawer ── */}
      {/* <div className="lg:hidden"> */}
      {/* Full-width page thumbnails area */}
      {/* <div className="min-h-screen bg-slate-100 p-4 pb-24">
          <PagePreviewArea
            file={file}
            totalPages={totalPages}
            selectedPages={selectedPages}
            extractMode={extractMode}
            handleTogglePage={handleTogglePage}
            onRemoveFile={onRemoveFile}
          />
        </div> */}

      {/* Floating settings button — iLovePDF style */}
      {/* <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f24d0d] text-white shadow-[0_8px_32px_rgba(242,77,13,0.45)] transition active:scale-95 hover:bg-[#dc4308]"
          aria-label="Open split settings"
        >
          <Settings2 className="h-6 w-6" />
        </button> */}

      {/* Backdrop */}
      {/* {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
        )} */}

      {/* Drawer — slides in from right */}
      {/* <div
          className={`fixed inset-y-0 right-0 z-50 flex w-[min(360px,100vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        > */}
      {/* Drawer handle bar */}
      {/* <div className="flex items-center justify-center py-3">
            <div className="h-1 w-10 rounded-full bg-slate-200" />
          </div> */}

      {/* Drawer content — scrollable */}
      {/* <div className="flex-1 overflow-y-auto px-5 pb-6">
            <SplitSidebarOptions
              {...sidebarProps}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      </div> */}



    </>
  );
}

// ── Shared page preview area (used in both desktop + mobile) ──
function PagePreviewArea({ file, totalPages, selectedPages, extractMode, handleTogglePage, onRemoveFile }) {
  return (
    <>
      {/* File header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
            <Scissors className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <p className="max-w-[200px] truncate text-sm font-bold text-slate-800 sm:max-w-[280px]">{file?.name}</p>
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

      {/* Thumbnails grid */}
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
    </>
  );
}
// ───────────────────────────────────────────

export default function SplitPdf({ seo }) {
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
        sidebarLinks={DONE_LINKS}
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


        // ============================================================
        // SPLIT PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,

            eyebrow: "SPLIT PDF",

            breadcrumbCurrent: "Split PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Split PDF Files —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Instant
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Split a PDF into separate pages or custom page ranges online for free. Extract exactly the pages you need — no signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "Split by page range",
            //   "Works on any device",
            //   "Instant split",
            // ],

            heroTitle: (
              <>
                Split PDF Online —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Extract & Separate Pages Free
                </em>
              </>
            ),
            heroDescription:
              "Split PDF online for free — extract specific pages or divide your PDF into multiple files instantly. Choose page ranges or split every page. No signup, no watermark.",
            pills: ["Split by page range", "Extract specific pages", "Multiple output files", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PDF Split Info",
            noticeItems: [
              "Single PDF → split into pages or ranges",
              "Custom page ranges supported",
              "Downloads as ZIP (multiple files) or single PDF",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Split a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, choose pages, split — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select the PDF you want to split from your device. Drag and drop is supported on all devices — mobile, tablet, and desktop.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Choose How to Split",
                desc: "Split every page into individual files, or enter custom page ranges to extract exactly the sections you need — for example pages 1-5 or pages 3, 7, 12.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Split Files",
                desc: "Click Split PDF and your files will be ready in seconds. Multiple pages download as a ZIP file. A single page range downloads as one PDF instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Splitter Online",

            seoBadge: "Split PDF Guide",
            seoTitle: "Complete Guide to Splitting PDF Files Online",
            seoDescription:
              "Everything you need to know about splitting a PDF into separate pages or custom ranges — free, online, instant. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Splitter — Split Any PDF into Pages or Ranges Online",
                text: "Need to split a PDF? PDFLinx lets you split PDF files online for free — instantly and without any software installation. Whether you want to extract one page, a specific chapter, or split every page into individual files, PDFLinx handles it in seconds. No signup, no watermark, no file tricks. It is the best free online PDF splitter available today — works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PDF Splitting?",
                text: "PDF splitting separates a single PDF document into multiple smaller files. You can split by individual pages — getting one PDF per page — or by custom page ranges to extract specific sections. This is useful when a large document contains multiple reports, chapters, or forms that need to be distributed or used separately. Each split file is a fully independent, properly formatted PDF.",
              },
              {
                title: "How to Split a PDF Without Losing Quality",
                text: "PDFLinx splits PDF files without any compression or quality loss. Every extracted page is preserved exactly as in the original — fonts, images, tables, hyperlinks, and formatting all remain intact. There is no re-encoding or re-rendering involved, which means each split PDF is identical in quality to its corresponding page in the original file.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Splitter — No Watermark, No Limits",
                text: "Most free PDF splitters add watermarks, limit the number of pages you can extract, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no limit on splits per day. Unlike iLovePDF free tier and Smallpdf free tier which restrict advanced splitting behind paid plans, PDFLinx gives you unlimited splits at zero cost.",
              },
              {
                title: "Common Use Cases for Splitting PDFs",
                text: "✓ Students & Researchers: Extract specific chapters or pages from a large PDF textbook or paper.\n✓ Professionals: Separate a combined report into individual sections for different team members.\n✓ Legal & Finance: Extract specific exhibits, clauses, or statements from large legal or financial documents.\n✓ HR Teams: Pull out individual forms or pages from bulk onboarding documents.\n✓ Freelancers: Deliver only the relevant pages to each client from a combined project file.\n✓ Anyone: Extract receipts, certificates, or specific pages from merged scan files.",
              },
              {
                title:
                  "Split PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload directly from your files app. On Mac or Windows, drag and drop your PDF and download the split files in seconds. Whether you need to split a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title:
                  "PDFLinx vs iLovePDF vs Smallpdf — Free PDF Splitter Comparison",
                text: "iLovePDF and Smallpdf both restrict custom range splitting and batch extraction behind paid plans. Adobe Acrobat requires a monthly subscription to extract pages. PDFLinx offers unlimited free PDF splitting with custom page ranges, no account, and no watermark. For anyone looking for the best free iLovePDF alternative or Smallpdf alternative for splitting PDFs, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title: "Split PDF vs Printing Selected Pages — Why a Proper Splitter is Better",
                text: "Some people try to extract pages by printing to PDF and selecting a page range — but this approach can lose hyperlinks, reformat text, shift images, and reduce quality. A proper PDF splitter like PDFLinx extracts pages at the document level, preserving every element exactly as it is. No content is lost, no formatting is broken, and the result is a clean, high-quality PDF of exactly the pages you need.",
              },
              {
                title: "Best For Everyday Document Management",
                text: "Use split PDFs for targeted sharing, email attachments, specific submissions, and organized archiving. Each output is a standard PDF file compatible with Adobe Acrobat, Preview, Chrome, and every PDF viewer — easy to share and open on any device.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF splitter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on how many times you can split or how many pages you extract.",
              },
              {
                q: "Can I split a PDF into individual pages?",
                a: "Yes. Choose the 'Split every page' option and each page of your PDF will be saved as a separate PDF file, all packaged in a ZIP for easy download.",
              },
              {
                q: "Can I extract a specific page range from a PDF?",
                a: "Yes. Enter the page range you need — for example 1-5 or 3, 7, 12 — and PDFLinx will extract exactly those pages as a new PDF.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your file and split instantly — no email, no registration, no friction.",
              },
              {
                q: "Will the quality of my PDF be reduced after splitting?",
                a: "No. PDFLinx splits files without any compression or quality loss. All pages, images, fonts, and formatting are preserved exactly as in the original.",
              },
              {
                q: "Does PDFLinx add any watermark to the split PDF?",
                a: "No watermarks, ever. Your split PDF files are 100% clean and ready to use or share.",
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
                q: "What is the maximum file size I can upload?",
                a: "Up to 50 MB per file. For very large PDFs, try compressing the file first using our free PDF Compress tool before splitting.",
              },
              {
                q: "Can I split a password-protected PDF?",
                a: "You need to unlock the PDF first before splitting. Use our free PDF Unlock tool to remove the password, then split it.",
              },
              {
                q: "How will my split files be downloaded?",
                a: "If you split into multiple files, they will be packaged into a single ZIP file for easy download. If you extract a single page range, it downloads as one PDF directly.",
              },
              {
                q: "How long does splitting take?",
                a: "Most splits complete within 5 to 15 seconds depending on file size and number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free splitting?",
                a: "Yes — PDFLinx offers unlimited free splits with custom page range support, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict advanced splitting behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Split your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, clean PDF splitting every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />
    </>
  );
}



























// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { Scissors, GitMerge, FileText, Minimize2, Lock, X, Settings2 } from "lucide-react";
// import Script from "next/script";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import MobileDrawerLayout from "@/components/ToolFlow/MobileDrawerLayout";


// // ── CONFIG ─────────────────────────────────
// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-indigo-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

// const SIDEBAR_NOTICE = (
//   <>
//     <p className="text-sm font-semibold text-blue-800">ℹ️ How splitting works</p>
//     <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
//       <li>Upload one PDF file</li>
//       <li>Every page → individual PDF</li>
//       <li>All pages delivered in one ZIP</li>
//       <li>Keep only the pages you need</li>
//     </ul>
//   </>
// );

// const SIDEBAR_FEATURES = [
//   "✓ No account",
//   "✓ No watermark",
//   "✓ Auto-deleted after 1 hour",
//   "✓ 100% free",
//   "✓ All pages in ZIP",
//   "✓ Works on all devices",
// ];
// // ───────────────────────────────────────────

// // ── PDF Page Thumbnail Component ───────────
// function PdfPageThumb({ file, pageNum, isSelected, onToggle, extractMode }) {
//   const canvasRef = useRef(null);
//   const wrapperRef = useRef(null);
//   const [rendered, setRendered] = useState(false);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const el = wrapperRef.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
//       { rootMargin: "200px" }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!file || !visible) return;
//     let cancelled = false;

//     const render = async () => {
//       try {
//         const buffer = await file.arrayBuffer();
//         const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 0.6 });
//         const canvas = canvasRef.current;
//         if (!canvas || cancelled) return;
//         const ctx = canvas.getContext("2d");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         ctx.fillStyle = "#ffffff";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         await page.render({ canvasContext: ctx, viewport }).promise;
//         if (!cancelled) setRendered(true);
//       } catch (e) {
//         console.error("PDF page render error:", e);
//       }
//     };

//     const tryRender = () => {
//       if (window.pdfjsLib) {
//         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//         render();
//       } else {
//         setTimeout(tryRender, 100);
//       }
//     };

//     tryRender();
//     return () => { cancelled = true; };
//   }, [file, pageNum, visible]);

//   const showCheck = extractMode === "all" || isSelected;

//   return (
//     <div
//       ref={wrapperRef}
//       onClick={() => extractMode === "select" && onToggle(pageNum)}
//       className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all
//         ${extractMode === "select" ? "cursor-pointer" : ""}
//         ${isSelected && extractMode === "select"
//           ? "ring-2 ring-[#f24d0d] shadow-lg -translate-y-0.5"
//           : extractMode === "select"
//             ? "hover:-translate-y-0.5 hover:shadow-lg"
//             : ""
//         }`}
//     >
//       <div className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all
//         ${showCheck
//           ? "bg-[#22c55e] opacity-100 scale-100"
//           : "bg-white/80 border-2 border-slate-300 opacity-0 group-hover:opacity-100 scale-90"
//         }`}
//       >
//         <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//         </svg>
//       </div>

//       <div className="relative flex h-[170px] items-center justify-center overflow-hidden bg-slate-50 p-2">
//         {!rendered && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400" />
//           </div>
//         )}
//         <canvas
//           ref={canvasRef}
//           className={`h-full w-full object-contain bg-white transition-opacity ${rendered ? "opacity-100" : "opacity-0"}`}
//         />
//       </div>

//       <div className="border-t border-slate-100 bg-white px-3 py-2 text-center">
//         <p className="text-xs font-semibold text-slate-500">{pageNum}</p>
//       </div>
//     </div>
//   );
// }
// // ───────────────────────────────────────────

// // ── Split Options Sidebar (shared between desktop sidebar + mobile drawer) ─
// function SplitSidebarOptions({
//   activeTab, onTabChange,
//   extractMode, onExtractModeChange,
//   selectedPages, totalPages,
//   onConvert, files,
//   rangeMode, setRangeMode,
//   ranges, setRanges,
//   pageRangeInput, onPageRangeChange,
//   mergeExtracted, onMergeChange,
//   onClose, // only used in mobile drawer
// }) {
//   const tabs = [
//     { key: "range", label: "Range" },
//     { key: "pages", label: "Pages" },
//     { key: "size", label: "Size" },
//   ];

//   const outputCount = extractMode === "all" ? totalPages : selectedPages.length;

//   return (
//     <div className="space-y-4">

//       {/* Title row — with close button in mobile drawer */}
//       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
//         <h3 className="text-xl font-bold text-slate-900">Split PDF</h3>
//         {onClose && (
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             type="button"
//             onClick={() => onTabChange(tab.key)}
//             className={`flex flex-col items-center gap-1.5 px-2 py-3 text-xs font-semibold transition
//               ${activeTab === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//           >
//             {tab.key === "range" && (
//               <svg viewBox="0 0 32 24" className="h-6 w-8" fill="none">
//                 <rect x="1" y="1" width="13" height="22" rx="2" fill={activeTab === "range" ? "#f1f5f9" : "#f8fafc"} stroke={activeTab === "range" ? "#94a3b8" : "#cbd5e1"} strokeWidth="1.5" />
//                 <rect x="18" y="1" width="13" height="22" rx="2" fill={activeTab === "range" ? "#f1f5f9" : "#f8fafc"} stroke={activeTab === "range" ? "#94a3b8" : "#cbd5e1"} strokeWidth="1.5" />
//                 <path d="M14.5 12H17.5M14.5 12L13 10.5M14.5 12L13 13.5M17.5 12L19 10.5M17.5 12L19 13.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
//               </svg>
//             )}
//             {tab.key === "pages" && (
//               <svg viewBox="0 0 40 24" className="h-6 w-10" fill="none">
//                 <rect x="1" y="3" width="10" height="18" rx="1.5" fill={activeTab === "pages" ? "#e0f2fe" : "#f8fafc"} stroke={activeTab === "pages" ? "#38bdf8" : "#cbd5e1"} strokeWidth="1.5" />
//                 {activeTab === "pages" && <path d="M6 8h0M6 12h0" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />}
//                 <rect x="15" y="1" width="10" height="22" rx="1.5" fill={activeTab === "pages" ? "#dbeafe" : "#f8fafc"} stroke={activeTab === "pages" ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
//                 {activeTab === "pages" && <path d="M20 7h0M20 12h0M20 17h0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />}
//                 <rect x="29" y="3" width="10" height="18" rx="1.5" fill={activeTab === "pages" ? "#e0f2fe" : "#f8fafc"} stroke={activeTab === "pages" ? "#38bdf8" : "#cbd5e1"} strokeWidth="1.5" />
//                 {activeTab === "pages" && <path d="M34 8h0M34 12h0" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />}
//               </svg>
//             )}
//             {tab.key === "size" && (
//               <svg viewBox="0 0 36 24" className="h-6 w-9" fill="none">
//                 <rect x="1" y="1" width="22" height="22" rx="2" fill={activeTab === "size" ? "#fef3c7" : "#f8fafc"} stroke={activeTab === "size" ? "#f59e0b" : "#cbd5e1"} strokeWidth="1.5" />
//                 <rect x="26" y="8" width="9" height="15" rx="1.5" fill={activeTab === "size" ? "#fef9c3" : "#f8fafc"} stroke={activeTab === "size" ? "#eab308" : "#cbd5e1"} strokeWidth="1.5" />
//                 <path d="M22 12H24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
//               </svg>
//             )}
//             <span>{tab.label}</span>
//           </button>
//         ))}
//       </div>

//       {/* ── PAGES TAB ── */}
//       {activeTab === "pages" && (
//         <div className="space-y-3">
//           <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Extract mode:</p>

//           <div className="flex overflow-hidden rounded-xl border border-slate-200">
//             <button
//               type="button"
//               onClick={() => onExtractModeChange("all")}
//               className={`flex-1 px-3 py-2.5 text-sm font-semibold transition
//                 ${extractMode === "all"
//                   ? "bg-white text-[#f24d0d] ring-1 ring-inset ring-[#f24d0d] rounded-xl z-10"
//                   : "bg-slate-50 text-slate-500 hover:bg-white hover:text-slate-700"
//                 }`}
//             >
//               Extract all pages
//             </button>
//             <button
//               type="button"
//               onClick={() => onExtractModeChange("select")}
//               className={`flex-1 border-l border-slate-200 px-3 py-2.5 text-sm font-semibold transition
//                 ${extractMode === "select"
//                   ? "bg-white text-slate-800 ring-1 ring-inset ring-slate-400 rounded-xl z-10"
//                   : "bg-slate-50 text-slate-400 hover:bg-white hover:text-slate-600"
//                 }`}
//             >
//               Select pages
//             </button>
//           </div>

//           {totalPages > 0 && (
//             <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3">
//               <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-400">
//                 <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <p className="text-xs leading-5 text-blue-700">
//                 {extractMode === "all"
//                   ? <>Selected pages will be converted into separate PDF files. <strong>{outputCount} PDF{outputCount !== 1 ? "s" : ""}</strong> will be created.</>
//                   : outputCount === 0
//                     ? "Click pages in the preview to select them."
//                     : <><strong>{outputCount}</strong> page{outputCount !== 1 ? "s" : ""} selected → <strong>{outputCount} PDF{outputCount !== 1 ? "s" : ""}</strong> will be created.</>
//                 }
//               </p>
//             </div>
//           )}

//           {extractMode === "select" && (
//             <div className="space-y-3">
//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-500">
//                   Pages to extract:
//                 </label>
//                 <input
//                   type="text"
//                   value={pageRangeInput}
//                   onChange={(e) => onPageRangeChange(e.target.value)}
//                   placeholder="e.g. 1,3,5-8"
//                   className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#f24d0d] focus:bg-white transition"
//                 />
//                 <p className="mt-1.5 text-[11px] text-slate-400">
//                   Use commas and dashes: 1,3,5-8
//                 </p>
//               </div>
//               <label className="flex cursor-pointer items-start gap-3">
//                 <input
//                   type="checkbox"
//                   checked={mergeExtracted}
//                   onChange={(e) => onMergeChange(e.target.checked)}
//                   className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#f24d0d]"
//                 />
//                 <span className="text-xs leading-5 text-slate-600">
//                   Merge extracted pages into one PDF file.
//                 </span>
//               </label>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── RANGE TAB ── */}
//       {activeTab === "range" && (
//         <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
//             <svg viewBox="0 0 32 24" className="h-6 w-8" fill="none">
//               <rect x="1" y="1" width="13" height="22" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
//               <rect x="18" y="1" width="13" height="22" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
//               <path d="M14.5 12H17.5M14.5 12L13 10.5M14.5 12L13 13.5M17.5 12L19 10.5M17.5 12L19 13.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
//             </svg>
//           </div>
//           <div>
//             <p className="text-sm font-bold text-slate-700">Split by Range</p>
//             <p className="mt-1 text-xs leading-5 text-slate-400">Define custom page ranges to create separate PDFs.</p>
//           </div>
//           <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-500">Coming Soon</span>
//         </div>
//       )}

//       {/* ── SIZE TAB ── */}
//       {activeTab === "size" && (
//         <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
//           <p className="font-semibold text-slate-500">Split by File Size</p>
//           <p className="mt-1 text-xs text-slate-400">Coming soon</p>
//         </div>
//       )}

//       {/* Split Button */}
//       <button
//         type="button"
//         onClick={onConvert}
//         disabled={!files.length || (extractMode === "select" && selectedPages.length === 0 && !pageRangeInput)}
//         className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98]
//           ${files.length && (extractMode === "all" || selectedPages.length > 0 || pageRangeInput)
//             ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
//             : "cursor-not-allowed bg-slate-300"
//           }`}
//       >
//         Split PDF
//       </button>

//     </div>
//   );
// }
// // ───────────────────────────────────────────

// // ── Custom Options Full-Width Layout ───────
// function SplitOptionsLayout({
//   file, onRemoveFile, onConvert,
//   selectedPages, setSelectedPages,
//   extractMode, setExtractMode,
//   activeTab, setActiveTab,
//   totalPages, setTotalPages,
//   rangeMode, setRangeMode,
//   ranges, setRanges,
//   pageRangeInput, setPageRangeInput,
//   mergeExtracted, setMergeExtracted,
// }) {
//   // Mobile drawer state
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   useEffect(() => {
//     if (!file) return;
//     let cancelled = false;
//     const countPages = async () => {
//       try {
//         const buffer = await file.arrayBuffer();
//         const tryCount = () => {
//           if (window.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//             window.pdfjsLib.getDocument({ data: buffer }).promise.then((pdf) => {
//               if (!cancelled) setTotalPages(pdf.numPages);
//             });
//           } else { setTimeout(tryCount, 100); }
//         };
//         tryCount();
//       } catch (e) { console.error("Page count error:", e); }
//     };
//     countPages();
//     return () => { cancelled = true; };
//   }, [file, setTotalPages]);

//   const handleTogglePage = useCallback((pageNum) => {
//     setSelectedPages((prev) => {
//       const newSelected = prev.includes(pageNum)
//         ? prev.filter((p) => p !== pageNum)
//         : [...prev, pageNum];
//       setPageRangeInput(newSelected.sort((a, b) => a - b).join(","));
//       return newSelected;
//     });
//   }, [setSelectedPages, setPageRangeInput]);

//   // Shared sidebar props
//   const sidebarProps = {
//     activeTab, onTabChange: setActiveTab,
//     extractMode, onExtractModeChange: setExtractMode,
//     selectedPages, totalPages,
//     onConvert, files: file ? [file] : [],
//     rangeMode, setRangeMode,
//     ranges, setRanges,
//     pageRangeInput, onPageRangeChange: setPageRangeInput,
//     mergeExtracted, onMergeChange: setMergeExtracted,
//   };

//   return (
//     <>
//       {/* ── DESKTOP layout: side-by-side ── */}
//       <div className="hidden lg:flex h-[calc(100vh-80px)]">
//         {/* Left: Page thumbnails */}
//         <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
//           <PagePreviewArea
//             file={file}
//             totalPages={totalPages}
//             selectedPages={selectedPages}
//             extractMode={extractMode}
//             handleTogglePage={handleTogglePage}
//             onRemoveFile={onRemoveFile}
//           />
//         </div>

//         {/* Right: Sidebar */}
//         <aside className="w-[350px] shrink-0 border-l border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-y-auto">
//           <SplitSidebarOptions {...sidebarProps} />
//         </aside>
//       </div>

//       {/* ── MOBILE layout: full-width thumbnails + floating gear button + drawer ── */}
//       <div className="lg:hidden">
//         {/* Full-width page thumbnails area */}
//         <div className="min-h-screen bg-slate-100 p-4 pb-24">
//           <PagePreviewArea
//             file={file}
//             totalPages={totalPages}
//             selectedPages={selectedPages}
//             extractMode={extractMode}
//             handleTogglePage={handleTogglePage}
//             onRemoveFile={onRemoveFile}
//           />
//         </div>

//         {/* Floating settings button — iLovePDF style */}
//         <button
//           type="button"
//           onClick={() => setDrawerOpen(true)}
//           className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f24d0d] text-white shadow-[0_8px_32px_rgba(242,77,13,0.45)] transition active:scale-95 hover:bg-[#dc4308]"
//           aria-label="Open split settings"
//         >
//           <Settings2 className="h-6 w-6" />
//         </button>

//         {/* Backdrop */}
//         {drawerOpen && (
//           <div
//             className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
//             onClick={() => setDrawerOpen(false)}
//           />
//         )}

//         {/* Drawer — slides in from right */}
//         <div
//           className={`fixed inset-y-0 right-0 z-50 flex w-[min(360px,100vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out
//             ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
//         >
//           {/* Drawer handle bar */}
//           <div className="flex items-center justify-center py-3">
//             <div className="h-1 w-10 rounded-full bg-slate-200" />
//           </div>

//           {/* Drawer content — scrollable */}
//           <div className="flex-1 overflow-y-auto px-5 pb-6">
//             <SplitSidebarOptions
//               {...sidebarProps}
//               onClose={() => setDrawerOpen(false)}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // ── Shared page preview area (used in both desktop + mobile) ──
// function PagePreviewArea({ file, totalPages, selectedPages, extractMode, handleTogglePage, onRemoveFile }) {
//   return (
//     <>
//       {/* File header */}
//       <div className="mb-5 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
//             <Scissors className="h-4 w-4 text-orange-500" />
//           </div>
//           <div>
//             <p className="max-w-[200px] truncate text-sm font-bold text-slate-800 sm:max-w-[280px]">{file?.name}</p>
//             <p className="text-xs text-slate-400">
//               {totalPages > 0 ? `${totalPages} page${totalPages !== 1 ? "s" : ""}` : "Loading..."}
//             </p>
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={() => onRemoveFile(0)}
//           className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm transition hover:bg-red-50 hover:text-red-500"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>

//       {/* Thumbnails grid */}
//       {totalPages > 0 ? (
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//             <PdfPageThumb
//               key={pageNum}
//               file={file}
//               pageNum={pageNum}
//               isSelected={selectedPages.includes(pageNum)}
//               onToggle={handleTogglePage}
//               extractMode={extractMode}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="flex h-48 items-center justify-center">
//           <div className="flex flex-col items-center gap-3 text-slate-400">
//             <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400" />
//             <p className="text-sm">Loading PDF pages...</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// // ───────────────────────────────────────────

// export default function SplitPdf({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [activeTab, setActiveTab] = useState("pages");
//   const [extractMode, setExtractMode] = useState("all");
//   const [selectedPages, setSelectedPages] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [rangeMode, setRangeMode] = useState("custom");
//   const [ranges, setRanges] = useState([{ from: 1, to: 1 }]);
//   const [pageRangeInput, setPageRangeInput] = useState("");
//   const [mergeExtracted, setMergeExtracted] = useState(false);

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     setSelectedPages([]);
//     setTotalPages(0);
//     setPageRangeInput("");
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = flow.files[0]
//         ? flow.files[0].name.replace(/\.pdf$/i, "-split-pages.zip")
//         : "split-pages.zip";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download failed:", err);
//       alert("Download failed. Please try again.");
//     }
//   };

//   // ── API LOGIC ─────────────────────────────
//   const handleConvert = async () => {
//     if (!flow.files.length) return alert("Please select a PDF file");
//     flow.startProcessing();
//     startProgress();

//     const formData = new FormData();
//     formData.append("file", flow.files[0]);

//     if (extractMode === "select") {
//       if (pageRangeInput) {
//         formData.append("pages", pageRangeInput);
//       } else if (selectedPages.length > 0) {
//         formData.append("pages", selectedPages.sort((a, b) => a - b).join(","));
//       }
//       if (mergeExtracted) formData.append("merge", "1");
//     }

//     try {
//       const res = await fetch("/convert/split-pdf", { method: "POST", body: formData });
//       const data = await res.json();
//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         completeProgress();
//         flow.finishSuccess();
//       } else {
//         cancelProgress();
//         flow.handleError(data.error || "Split failed");
//       }
//     } catch (err) {
//       console.error(err);
//       cancelProgress();
//       flow.handleError("Something went wrong. Please try again.");
//     }
//   };
//   // ── END API LOGIC ─────────────────────────

//   const customOptionsLayout = flow.files.length > 0 ? (
//     <SplitOptionsLayout
//       file={flow.files[0]}
//       onRemoveFile={handleRemoveFile}
//       onConvert={handleConvert}
//       selectedPages={selectedPages}
//       setSelectedPages={setSelectedPages}
//       extractMode={extractMode}
//       setExtractMode={setExtractMode}
//       activeTab={activeTab}
//       setActiveTab={setActiveTab}
//       totalPages={totalPages}
//       setTotalPages={setTotalPages}
//       rangeMode={rangeMode}
//       setRangeMode={setRangeMode}
//       ranges={ranges}
//       setRanges={setRanges}
//       pageRangeInput={pageRangeInput}
//       setPageRangeInput={setPageRangeInput}
//       mergeExtracted={mergeExtracted}
//       setMergeExtracted={setMergeExtracted}
//     />
//   ) : null;

//   return (
//     <>
//       {/* ── SEO SCHEMAS ── */}
//       <Script id="howto-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "HowTo",
//             name: "How to Split a PDF into Individual Pages Online",
//             url: "https://pdflinx.com/split-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
//               { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
//               { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." },
//             ],
//             totalTime: "PT40S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />
//       <Script id="breadcrumb-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />
//       <Script id="faq-schema-split-pdf" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "How do I split a PDF into individual pages?", acceptedAnswer: { "@type": "Answer", text: "Upload your PDF, click Split PDF, and download the ZIP containing individual pages." } },
//               { "@type": "Question", name: "Is the PDF splitter free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Split PDF is completely free and works directly in your browser." } },
//               { "@type": "Question", name: "Does splitting a PDF affect quality?", acceptedAnswer: { "@type": "Answer", text: "No. All pages keep their original quality, text, and formatting." } },
//               { "@type": "Question", name: "Can I split PDF on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. Works on Android, iPhone, tablets, and desktop browsers." } },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ── TOOL UI ── */}
//       <ToolPageLayout
//         title={seo?.h1 || "Split PDF Online Free"}
//         tagline="No Signup · No Watermark · Instant Download"
//         accept="application/pdf"
//         multiple={false}
//         convertLabel="Split PDF"
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — split pages easily"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DONE_LINKS}
//         customOptionsLayout={customOptionsLayout}
//         optionsTitle="Split options"
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionSectionLabel=""
//         optionsSlot={null}
//         processingTitle="Splitting your PDF"
//         processingDescription="Please wait while we separate your PDF pages."
//         processingStages={["Uploading file", "Separating pages", "Generating ZIP"]}
//         doneTitle="Your split pages are ready"
//         doneDescription="Every page has been separated into its own PDF file."
//         doneFileName="split-pages.zip"
//         downloadLabel="Download ZIP"
//         resetLabel="Split another PDF"
//         sidebarTitle="Split PDF"
//         sidebarIcon={<Scissors className="h-5 w-5 text-orange-500" />}
//         sidebarDescription="Split any PDF into individual pages — every page becomes its own PDF file in a ZIP."
//         sidebarNotice={SIDEBAR_NOTICE}
//         sidebarFeatures={SIDEBAR_FEATURES}
//         uploadLanding={{
//           content: {
//             heroBadge: "✦ Free PDF Splitter · No Signup Required",
//             heroTitle: (<>Split PDF Files Online{" "}<em className="text-[#e8420a]"><br />for Free</em></>),
//             heroDescription: "Split PDF pages online in seconds. Extract, separate, or divide PDF files securely without signup or software. Free PDF splitter that works directly in your browser on Windows, Mac, Android, and iPhone.",
//             pills: ["Separate PDF pages", "ZIP download", "No quality loss", "Works on all devices"],
//             noticeItems: ["Every page becomes separate PDF", "All pages packed into ZIP", "Original quality preserved"],
//             seoBadge: "Split PDF Guide",
//             seoTitle: "Free Online Split PDF Tool by PDFLinx",
//             seoDescription: "Separate PDF pages into individual files online. Fast, secure, and no signup required.",
//             howToTitle: "How to Split a PDF — 3 Simple Steps",
//             howToSubtitle: "Upload your PDF, split pages automatically, and download all files in one ZIP.",
//             howToSteps: [
//               { n: "1", title: "Upload Your PDF", desc: "Select your PDF file — any size, any number of pages. Drag and drop supported on all devices." },
//               { n: "2", title: "Click Split PDF", desc: "Hit the Split button — the tool separates every page into its own individual PDF file automatically." },
//               { n: "3", title: "Download ZIP", desc: "All split pages are packaged into a ZIP file — download and extract the individual PDF pages you need." },
//             ],
//             whyTitle: "Why Use PDFLinx Split PDF Tool?",
//             faqTitle: "Split PDF FAQs",
//             faqs: [
//               { q: "Is the PDF splitter free to use?", a: "Yes. PDFLinx Split PDF is completely free — no hidden charges, no subscription required." },
//               { q: "Do I need to install any software to split a PDF?", a: "No. Everything works directly in your browser. No desktop software or plugins needed." },
//               { q: "How does the PDF get split — what do I receive?", a: "Every page in your PDF is separated into its own individual PDF file. All split pages are packaged into a ZIP file for download." },
//               { q: "Will the quality of my PDF pages change after splitting?", a: "No. PDFLinx extracts the original page data directly — no re-rendering or compression." },
//               { q: "Can I extract only specific pages from a PDF?", a: "Split the PDF to get all pages as individual files, then keep only the specific page PDFs you need from the ZIP." },
//               { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after splitting." },
//               { q: "Can I split a PDF on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers." },
//               { q: "How do I combine split pages back into one PDF?", a: "After splitting, use the Merge PDF tool — upload the individual page PDFs and download one merged PDF file." },
//             ],
//             relatedTitle: "More PDF Tools",
//             seoSections: [
//               { title: "Split Large PDF Files Easily", text: "Separate large PDF documents into smaller individual page files without losing quality." },
//               { title: "Keep Original PDF Quality", text: "All split PDF pages preserve original text, images, and formatting." },
//               { title: "Extract Individual PDF Pages", text: "Convert every page of your PDF into separate standalone PDF files for easier sharing and organization." },
//               { title: "Secure PDF Splitting Online", text: "Your uploaded PDF files are processed securely and automatically deleted after processing." },
//             ],
//             showPdfTypes: false,
//           },
//         }}
//       />
//     </>
//   );
// }


