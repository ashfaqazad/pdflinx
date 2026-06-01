"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  CheckCircle,
  MonitorSmartphone,
  ShieldCheck,
  RotateCw,
  Trash2,
  Layers3,
  Plus,
  ArrowUpDown,
  FilePlus2,
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

/* =============================================
   PDF PAGE THUMBNAIL
   Renders a specific page from a File object
============================================= */
function PdfPageThumbnail({ file, pageNumber, rotation = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file || !window.pdfjsLib) return;
    let cancelled = false;

    const render = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        // const viewport = page.getViewport({ scale: 0.4, rotation: 0 });
        const viewport = page.getViewport({ scale: 0.7, rotation: 0 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      } catch (err) {
        console.error("Thumbnail render error:", err);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [file, pageNumber]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.3s ease",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
      className="object-contain bg-white"
    />
  );
}

/* =============================================
   BLANK PAGE THUMBNAIL
============================================= */
function BlankPageThumbnail() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <span className="text-xs text-slate-300 font-medium">Blank</span>
    </div>
  );
}

/* =============================================
   INSERT BLANK STRIP — hover between pages
============================================= */
function InsertBlankButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center px-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={onClick}
        title="Add a blank page here"
        className={`
          flex flex-col items-center justify-center gap-0.5 rounded-lg border transition-all duration-200
          ${hovered
            ? "w-8 h-28 bg-[#fde8e4] border-[#c0392b] opacity-100"
            : "w-3 h-20 bg-slate-100 border-slate-200 opacity-40 hover:opacity-80"
          }
        `}
      >
        {hovered && (
          <>
            <Plus className="h-3.5 w-3.5 text-[#c0392b]" />
            <span
              className="text-[9px] font-bold text-[#c0392b]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Blank
            </span>
          </>
        )}
        {!hovered && <div className="w-0.5 h-10 bg-slate-300 rounded" />}
      </button>
    </div>
  );
}

/* =============================================
   FILE LABEL BADGE — colored letter per file
============================================= */
const FILE_COLORS = [
  { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-400" },
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-400" },
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
];
function fileColor(fileIndex) {
  return FILE_COLORS[fileIndex % FILE_COLORS.length];
}

/* =============================================
   PAGE CARD — draggable
============================================= */
function PageCard({
  slot,
  page,
  rotation,
  totalSlots,
  allFiles,
  onRotate,
  onDelete,
  onInsertBlank,
  dragging,
  dragOver,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}) {
  const isBlank = page.isBlank;
  const isBeingDragged = dragging === slot;
  const isDragTarget = dragOver === slot && !isBeingDragged;
  const fc = !isBlank ? fileColor(page.fileIndex) : null;

  return (
    <div className="flex items-stretch">
      {/* Insert blank BEFORE */}
      <InsertBlankButton onClick={() => onInsertBlank(slot)} />

      {/* Card */}
      <div
        draggable
        onDragStart={() => onDragStart(slot)}
        onDragEnter={() => onDragEnter(slot)}
        onDragEnd={onDragEnd}
        onDrop={() => onDrop(slot)}
        onDragOver={(e) => e.preventDefault()}
        className={`
          relative flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing
          transition-all duration-150 select-none
          ${isBeingDragged ? "opacity-25 scale-95" : "opacity-100 scale-100"}
        `}
        style={{ width: 210 }}
      >
        {/* Thumbnail box */}
        <div
          className={`
            relative w-full overflow-hidden rounded-xl border-2 bg-white shadow-sm
            transition-all duration-150
            ${isDragTarget ? "border-[#c0392b] ring-2 ring-[#c0392b]/30 scale-[1.03]" : "border-slate-200 hover:border-slate-300"}
          `}
          style={{ aspectRatio: "3/4" }}
        >
          {/* File color tag — top left strip */}
          {!isBlank && (
            <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${fc.dot}`} />
          )}

          {/* Top-right action buttons */}
          <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRotate(slot); }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 border border-slate-200 text-slate-500 shadow-sm hover:bg-orange-50 hover:text-[#c0392b] hover:border-[#c0392b] transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(slot); }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 border border-slate-200 text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-colors"
              title="Delete page"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          {/* Thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center p-2">
            {isBlank ? (
              <BlankPageThumbnail />
            ) : (
              <PdfPageThumbnail
                file={allFiles[page.fileIndex]}
                pageNumber={page.pageNumber}
                rotation={rotation}
              />
            )}
          </div>

          {/* Rotation badge */}
          {rotation !== 0 && (
            <div className="absolute bottom-1.5 right-1.5 rounded bg-orange-500/85 px-1 py-0.5 text-[9px] font-bold text-white">
              {rotation}°
            </div>
          )}
        </div>

        {/* Page number */}
        <span className="text-[11px] font-medium text-slate-400">{slot + 1}</span>
      </div>

      {/* Insert blank AFTER last card */}
      {slot === totalSlots - 1 && (
        <InsertBlankButton onClick={() => onInsertBlank(slot + 1)} />
      )}
    </div>
  );
}

/* =============================================
   MAIN COMPONENT
============================================= */
export default function OrganizePdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  // allFiles: array of File objects (can grow as user adds more)
  const [allFiles, setAllFiles] = useState([]);

  // pages: flat array of page descriptors
  // Each: { fileIndex, pageNumber (1-based), isBlank }
  const [pages, setPages] = useState([]);

  // pageOrder: array of indexes into `pages`
  const [pageOrder, setPageOrder] = useState([]);

  // rotations: { slotIndex: degrees }
  const [rotations, setRotations] = useState({});

  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Hidden file input ref for "Add more files" button
  const addMoreRef = useRef(null);

  /* -------------------------------------------
     Load pages from ONE file and append
  ------------------------------------------- */
  const loadAndAppendFile = useCallback(async (file, fileIndex) => {
    if (!file || !window.pdfjsLib) return [];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    return Array.from({ length: totalPages }, (_, i) => ({
      fileIndex,
      pageNumber: i + 1,
      isBlank: false,
    }));
  }, []);

  /* -------------------------------------------
     Initialize when flow.files first set
  ------------------------------------------- */
  useEffect(() => {
    if (!flow.files?.length) {
      setAllFiles([]);
      setPages([]);
      setPageOrder([]);
      setRotations({});
      return;
    }

    const tryLoad = async () => {
      if (!window.pdfjsLib) { setTimeout(tryLoad, 150); return; }
      setIsLoadingPages(true);
      try {
        const newFiles = [...flow.files];
        let allPageDescs = [];
        for (let fi = 0; fi < newFiles.length; fi++) {
          const descs = await loadAndAppendFile(newFiles[fi], fi);
          allPageDescs = [...allPageDescs, ...descs];
        }
        setAllFiles(newFiles);
        setPages(allPageDescs);
        setPageOrder(Array.from({ length: allPageDescs.length }, (_, i) => i));
        setRotations({});
      } catch (err) {
        console.error(err);
        flow.handleError("Could not read PDF pages.");
      } finally {
        setIsLoadingPages(false);
      }
    };

    tryLoad();
  }, [flow.files]);

  /* -------------------------------------------
     Add MORE files (from "+" button)
  ------------------------------------------- */
  const handleAddMoreFiles = async (newRawFiles) => {
    if (!newRawFiles?.length) return;
    setIsLoadingPages(true);
    try {
      const startFileIndex = allFiles.length;
      const newFileArr = Array.from(newRawFiles);
      let newPageDescs = [];

      for (let i = 0; i < newFileArr.length; i++) {
        const descs = await loadAndAppendFile(newFileArr[i], startFileIndex + i);
        newPageDescs = [...newPageDescs, ...descs];
      }

      const updatedFiles = [...allFiles, ...newFileArr];
      const updatedPages = [...pages, ...newPageDescs];
      const newSlots = newPageDescs.map((_, i) => pages.length + i);

      setAllFiles(updatedFiles);
      setPages(updatedPages);
      setPageOrder((prev) => [...prev, ...newSlots]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPages(false);
    }
  };

  /* -------------------------------------------
     Page actions
  ------------------------------------------- */
  const deletePage = (slotIndex) => {
    const newOrder = pageOrder.filter((_, i) => i !== slotIndex);
    const newRotations = {};
    newOrder.forEach((pageIdx, newSlot) => {
      const oldSlot = pageOrder.indexOf(pageIdx);
      if (rotations[oldSlot] !== undefined) newRotations[newSlot] = rotations[oldSlot];
    });
    setPageOrder(newOrder);
    setRotations(newRotations);
  };

  const rotatePage = (slotIndex) => {
    setRotations((prev) => ({
      ...prev,
      [slotIndex]: ((prev[slotIndex] || 0) + 90) % 360,
    }));
  };

  const insertBlankPage = (beforeSlot) => {
    const blankIdx = pages.length;
    const newPages = [...pages, { fileIndex: -1, pageNumber: null, isBlank: true }];
    const newOrder = [...pageOrder];
    newOrder.splice(beforeSlot, 0, blankIdx);

    const newRotations = {};
    Object.entries(rotations).forEach(([slot, deg]) => {
      const s = parseInt(slot);
      if (s >= beforeSlot) newRotations[s + 1] = deg;
      else newRotations[s] = deg;
    });

    setPages(newPages);
    setPageOrder(newOrder);
    setRotations(newRotations);
  };

  const sortPages = () => {
    const nonBlank = pageOrder
      .filter((idx) => !pages[idx]?.isBlank)
      .sort((a, b) => {
        const pa = pages[a];
        const pb = pages[b];
        if (pa.fileIndex !== pb.fileIndex) return pa.fileIndex - pb.fileIndex;
        return pa.pageNumber - pb.pageNumber;
      });
    const blank = pageOrder.filter((idx) => pages[idx]?.isBlank);
    setPageOrder([...nonBlank, ...blank]);
    setRotations({});
  };

  /* -------------------------------------------
     Drag & Drop
  ------------------------------------------- */
  const [draggingSlot, setDraggingSlot] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const handleDragStart = (slot) => setDraggingSlot(slot);
  const handleDragEnter = (slot) => setDragOverSlot(slot);
  const handleDragEnd = () => { setDraggingSlot(null); setDragOverSlot(null); };

  const handleDrop = (targetSlot) => {
    if (draggingSlot === null || draggingSlot === targetSlot) {
      handleDragEnd(); return;
    }
    const newOrder = [...pageOrder];
    const [moved] = newOrder.splice(draggingSlot, 1);
    newOrder.splice(targetSlot, 0, moved);

    const oldOrder = pageOrder;
    const newRotations = {};
    newOrder.forEach((pageIdx, newSlot) => {
      const oldSlot = oldOrder.indexOf(pageIdx);
      if (rotations[oldSlot] !== undefined) newRotations[newSlot] = rotations[oldSlot];
    });

    setPageOrder(newOrder);
    setRotations(newRotations);
    handleDragEnd();
  };

  /* -------------------------------------------
     Handlers
  ------------------------------------------- */
  const handleRemoveFile = () => {
    flow.reset();
    setAllFiles([]); setPages([]); setPageOrder([]); setRotations({});
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "organized.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    if (!pageOrder.length) return;
    flow.startProcessing();
    startProgress();
    try {
      const formData = new FormData();

      // Append all source files
      allFiles.forEach((f, i) => formData.append(`files`, f));

      // pageOrder as array of { fileIndex, pageNumber } or null for blank
      const finalOrder = pageOrder.map((idx) => {
        const p = pages[idx];
        if (p.isBlank) return null;
        return { fileIndex: p.fileIndex, pageNumber: p.pageNumber };
      });
      formData.append("pageOrder", JSON.stringify(finalOrder));

      // rotations
      const finalRotations = {};
      pageOrder.forEach((_, slotIndex) => {
        const deg = rotations[slotIndex] || 0;
        if (deg !== 0) finalRotations[slotIndex] = deg;
      });
      formData.append("rotations", JSON.stringify(finalRotations));

      const res = await fetch("/convert/organize-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to organize PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError(err.message || "Something went wrong");
    }
  };

  /* -------------------------------------------
     Derived stats
  ------------------------------------------- */
  const totalSlots = pageOrder.length;
  const blankCount = pageOrder.filter((idx) => pages[idx]?.isBlank).length;
  const deletedCount = pages.filter((p) => !p.isBlank).length - pageOrder.filter((idx) => !pages[idx]?.isBlank).length;

  /* -------------------------------------------
     Custom Options Layout
  ------------------------------------------- */
  const customOptionsLayout = (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

      {/* Hidden file input for adding more files */}
      <input
        ref={addMoreRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleAddMoreFiles(e.target.files)}
      />

      {/* ── LEFT: PAGE CANVAS ── */}
      <div className="relative flex-1 overflow-auto bg-[#f0f0f0] p-5">

        {/* Loading */}
        {isLoadingPages && (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c0392b] border-t-transparent" />
              <p className="text-sm text-slate-500">Loading pages…</p>
            </div>
          </div>
        )}

        {/* Pages grid */}
        {!isLoadingPages && pageOrder.length > 0 && (
          // <div className="flex flex-wrap gap-y-5 pb-20">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 pb-20">
            {pageOrder.map((pageIdx, slotIndex) => (
              <PageCard
                key={`${pageIdx}-${slotIndex}`}
                slot={slotIndex}
                page={pages[pageIdx]}
                rotation={rotations[slotIndex] || 0}
                totalSlots={totalSlots}
                allFiles={allFiles}
                onRotate={rotatePage}
                onDelete={deletePage}
                onInsertBlank={insertBlankPage}
                dragging={draggingSlot}
                dragOver={dragOverSlot}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}

        {!isLoadingPages && pageOrder.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">All pages deleted. Add more files or reset.</p>
          </div>
        )}

        {/* ── Floating "+" Add Files Button ── */}
        <button
          type="button"
          onClick={() => addMoreRef.current?.click()}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-white border-2 border-[#c0392b] px-5 py-2.5 text-sm font-bold text-[#c0392b] shadow-xl hover:bg-[#fde8e4] transition-all active:scale-95"
          title="Add more PDF files"
        >
          <Plus className="h-4 w-4" />
          Add more files
        </button>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div
        className="flex flex-col bg-white border-l border-slate-200"
        style={{ width: 260, flexShrink: 0 }}
      >
        {/* Files section */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Files
            </span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-xs text-[#c0392b] hover:underline font-medium"
            >
              Reset all
            </button>
          </div>

          {/* File list */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {allFiles.map((f, fi) => {
              const fc = fileColor(fi);
              const label = String.fromCharCode(65 + fi); // A, B, C...
              return (
                <div
                  key={fi}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${fc.bg} ${fc.border}`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${fc.text} bg-white`}>
                    {label}
                  </div>
                  <span className={`text-xs truncate flex-1 ${fc.text} font-medium`}>
                    {f.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Add file button */}
          <button
            type="button"
            onClick={() => addMoreRef.current?.click()}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-2 text-xs font-semibold text-slate-500 hover:border-[#c0392b] hover:text-[#c0392b] hover:bg-[#fde8e4] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add more files
          </button>
        </div>

        {/* Stats */}
        <div className="border-b border-slate-200 px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Total pages</span>
            <span className="font-semibold text-slate-700">{totalSlots}</span>
          </div>
          {deletedCount > 0 && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>Deleted</span>
              <span className="font-semibold text-red-500">{deletedCount}</span>
            </div>
          )}
          {blankCount > 0 && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>Blank added</span>
              <span className="font-semibold text-blue-500">{blankCount}</span>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="border-b border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={sortPages}
            className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            Sort pages (File A → B → C)
          </button>
        </div>

        {/* Instructions */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-600">Drag</span> pages to reorder.
            {" "}<span className="font-semibold text-slate-600">Rotate</span> or{" "}
            <span className="font-semibold text-slate-600">delete</span> with top-right icons.
            Hover between pages to insert a <span className="font-semibold text-slate-600">blank page</span>.
          </p>

          {/* File color legend */}
          {allFiles.length > 1 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Color legend
              </p>
              {allFiles.map((f, fi) => {
                const fc = fileColor(fi);
                return (
                  <div key={fi} className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-sm ${fc.dot}`} />
                    <span className="text-[10px] text-slate-500 truncate">{f.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-[11px] font-semibold text-green-700">✓ Your PDF is private</p>
            <p className="text-[10px] text-green-600 mt-0.5 leading-relaxed">
              Files are auto-deleted after processing.
            </p>
          </div>
        </div>

        {/* Organize button */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleConvert}
            disabled={!pageOrder.length}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${
              pageOrder.length
                ? "bg-[#c0392b] hover:bg-[#a93226] shadow-[0_8px_24px_rgba(192,57,43,0.3)]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            <Layers3 className="h-4 w-4" />
            Organize PDF
          </button>
        </div>
      </div>
    </div>
  );

  /* -------------------------------------------
     Render
  ------------------------------------------- */
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }}
      />

      <Script
        id="faq-schema-organize"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Organize PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Organize PDF allows you to rearrange, rotate, and remove PDF pages online before downloading a newly organized PDF file.",
                },
              },
              {
                "@type": "Question",
                name: "Can I rearrange PDF pages online?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Reorder, rotate, and delete PDF pages directly in your browser with no software installation required.",
                },
              },
            ],
          }),
        }}
      />

      <ToolPageLayout
        title={seo?.h1 || "Organize PDF Online"}
        tagline="Reorder · Rotate · Remove PDF Pages"
        accept=".pdf,application/pdf"
        multiple={true}
        convertLabel="Organize PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Organize options"
        processingTitle="Organizing PDF..."
        processingDescription="Rearranging your pages. Please wait."
        processingStages={["Uploading", "Organizing pages", "Done"]}
        doneTitle="Your organized PDF is ready"
        doneDescription="Download your newly arranged PDF file."
        downloadLabel="Download Organized PDF"
        resetLabel="Organize another PDF"
        sidebarTitle="Organize PDF"
        sidebarIcon={<Layers3 className="h-5 w-5 text-white" />}
        sidebarDescription="Reorder, rotate, and remove PDF pages visually in seconds."
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDFs here"
        uploadSubtitle="or click to browse — multiple PDFs supported"
        customOptionsLayout={customOptionsLayout}

        uploadLanding={{
          content: {
            eyebrow: "ORGANIZE PDF",
            heroTitle: (
              <>
                Organize PDF Pages{" "}
                <em className="font-bold not-italic text-[#c0392b] sm:italic">
                  visually online
                </em>
              </>
            ),
            heroDescription:
              "Rearrange, rotate, and remove PDF pages online for free. Add multiple PDFs and organize all pages together visually.",
            noticeTitle: "Organize features",
            noticeItems: [
              "Drag & drop to reorder pages",
              "Add multiple PDF files",
              "Rotate individual pages",
              "Add blank pages anywhere",
              "Remove unwanted pages",
            ],
            howToTitle: "How to organize a PDF",
            howToSubtitle:
              "Upload one or more PDFs, drag pages to rearrange, and download your organized PDF instantly.",
            howToSteps: [
              {
                n: "1",
                title: "Upload your PDFs",
                desc: "Select one or more PDF files. Add more anytime.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Organize pages",
                desc: "Drag to reorder, rotate, delete, or add blank pages.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download organized PDF",
                desc: "Save your newly arranged PDF instantly.",
                color: "bg-emerald-600",
              },
            ],
            whyTitle: "Why use PDFLinx Organize PDF?",
            whyItems: [
              {
                title: "Drag & Drop Reorder",
                desc: "Intuitively drag pages to any position.",
                icon: Layers3,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                title: "Multiple Files",
                desc: "Combine pages from different PDFs into one.",
                icon: FilePlus2,
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                title: "Works Everywhere",
                desc: "Compatible with desktop, tablet, and mobile.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Private & Secure",
                desc: "Files are securely deleted after processing.",
                icon: ShieldCheck,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "No Watermark",
                desc: "Downloaded PDF remains clean and professional.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
            ],
          },
        }}
      />

      <RelatedToolsSection />
    </>
  );
}


