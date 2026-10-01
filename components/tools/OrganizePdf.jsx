"use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import {
//   Download,
//   CheckCircle,
//   MonitorSmartphone,
//   ShieldCheck,
//   RotateCw,
//   Trash2,
//   Layers3,
//   Plus,
//   ArrowUpDown,
//   FilePlus2,
//   X,
//   SlidersHorizontal,
// } from "lucide-react";
// import Script from "next/script";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  CheckCircle,
  MonitorSmartphone,
  ShieldCheck,
  RotateCw,
  Trash2,
  Layers3,
  Plus,
  ArrowUpDown,
  FilePlus2,
  X,
  SlidersHorizontal,
  GitMerge,
  Scissors,
  Minimize2,
  Lock,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


const ORGANIZE_LINKS = [
  { label: "Merge PDF",     href: "/merge-pdf",     icon: <GitMerge   className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF",     href: "/split-pdf",     icon: <Scissors   className="h-4 w-4 text-orange-500" /> },
  { label: "Rotate PDF",    href: "/rotate-pdf",    icon: <RotateCw   className="h-4 w-4 text-cyan-500" /> },
  { label: "Remove Pages",  href: "/remove-pages",  icon: <Trash2     className="h-4 w-4 text-red-500" /> },
  { label: "Compress PDF",  href: "/compress-pdf",  icon: <Minimize2  className="h-4 w-4 text-green-500" /> },
  { label: "Protect PDF",   href: "/protect-pdf",   icon: <Lock       className="h-4 w-4 text-indigo-500" /> },
  { label: "PDF to Word",   href: "/pdf-to-word",   icon: <FileText   className="h-4 w-4 text-blue-500" /> },
  { label: "PDF to JPG",    href: "/pdf-to-jpg",    icon: <ImageIcon  className="h-4 w-4 text-pink-500" /> },
];
/* =============================================
   PDF PAGE THUMBNAIL
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
   INSERT BLANK STRIP
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
   FILE LABEL BADGE
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
          {!isBlank && (
            <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${fc.dot}`} />
          )}

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

          {rotation !== 0 && (
            <div className="absolute bottom-1.5 right-1.5 rounded bg-orange-500/85 px-1 py-0.5 text-[9px] font-bold text-white">
              {rotation}°
            </div>
          )}
        </div>

        <span className="text-[11px] font-medium text-slate-400">{slot + 1}</span>
      </div>

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
  const [allFiles, setAllFiles] = useState([]);
  const [pages, setPages] = useState([]);
  const [pageOrder, setPageOrder] = useState([]);
  const [rotations, setRotations] = useState({});
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Mobile options sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addMoreRef = useRef(null);

  /* -------------------------------------------
     Load pages from ONE file
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
     Add MORE files
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
      allFiles.forEach((f) => formData.append(`files`, f));

      const finalOrder = pageOrder.map((idx) => {
        const p = pages[idx];
        if (p.isBlank) return null;
        return { fileIndex: p.fileIndex, pageNumber: p.pageNumber };
      });
      formData.append("pageOrder", JSON.stringify(finalOrder));

      const finalRotations = {};
      pageOrder.forEach((_, slotIndex) => {
        const deg = rotations[slotIndex] || 0;
        if (deg !== 0) finalRotations[slotIndex] = deg;
      });
      formData.append("rotations", JSON.stringify(finalRotations));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/organize-pdf`, {
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
     RIGHT SIDEBAR CONTENT (shared between desktop + mobile slide-in)
  ------------------------------------------- */
  const sidebarContent = (
    <>
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

        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {allFiles.map((f, fi) => {
            const fc = fileColor(fi);
            const label = String.fromCharCode(65 + fi);
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
          onClick={() => { sortPages(); }}
          className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#fde8e4] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
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
          onClick={() => { setSidebarOpen(false); handleConvert(); }}
          disabled={!pageOrder.length}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${pageOrder.length
            ? "bg-[#e8420a] hover:bg-[#d03a09] shadow-[0_8px_24px_rgba(232,66,10,0.3)]"
            : "bg-slate-300 cursor-not-allowed"
            }`}
        >
          <Layers3 className="h-4 w-4" />
          Organize PDF
        </button>
      </div>
    </>
  );

  /* -------------------------------------------
     Custom Options Layout
  ------------------------------------------- */
  const customOptionsLayout = (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

      {/* Hidden file input */}
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

        {/* Top bar: Add more files button — top right of canvas */}
        <div className="flex items-center justify-end mb-4">
          <button
            type="button"
            onClick={() => addMoreRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-[#c0392b] bg-white px-3 py-1.5 text-xs font-semibold text-[#c0392b] shadow-sm hover:bg-[#fde8e4] transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Add more files
          </button>
        </div>

        {/* Loading */}
        {isLoadingPages && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c0392b] border-t-transparent" />
              <p className="text-sm text-slate-500">Loading pages…</p>
            </div>
          </div>
        )}

        {/* Pages grid */}
        {!isLoadingPages && pageOrder.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 pb-24">
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
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-slate-400">All pages deleted. Add more files or reset.</p>
          </div>
        )}

        {/* ── MOBILE: Bottom Options Button (visible on small screens, hidden on lg+) ── */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            
            className="flex items-center gap-2 rounded-full bg-[#e8420a] px-6 py-3 text-sm font-bold text-white shadow-xl hover:bg-[#d03a09] hover:shadow-2xl transition-all active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Options
          </button>
        </div>
      </div>

      {/* ── DESKTOP: RIGHT SIDEBAR (hidden on mobile, visible on lg+) ── */}
      <div
        className="hidden lg:flex flex-col bg-white border-l border-slate-200"
        style={{ width: 260, flexShrink: 0 }}
      >
        {sidebarContent}
      </div>

      {/* ── MOBILE: SLIDE-IN SIDEBAR OVERLAY ── */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Slide-in panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-40 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: 260 }}
      >
        {/* Header with close */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">Options</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar content (same as desktop) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {sidebarContent}
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
        doneLinks={ORGANIZE_LINKS}
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
            relatedTools: ORGANIZE_LINKS,

            eyebrow: "ORGANIZE PDF",
            breadcrumbCurrent: "Organize PDF",
            heroBadge: "✦ 100% Free · No Signup · No Watermark",

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
            pills: [
              "Drag & drop reorder",
              "Rotate & delete pages",
              "Add blank pages",
              "Multiple PDFs supported",
            ],

            uploadTitle: "Drop your PDFs here",
            uploadSubtitle: "or click to browse — multiple PDFs supported",
            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Organize features",
            noticeItems: [
              "Drag & drop to reorder pages",
              "Add multiple PDF files",
              "Rotate individual pages",
              "Add blank pages anywhere",
              "Remove unwanted pages",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Organize a PDF — 3 Simple Steps",
            howToSubtitle:
              "Upload one or more PDFs, drag pages to rearrange, and download your organized PDF instantly.",
            howToSteps: [
              {
                n: "1",
                title: "Upload your PDFs",
                desc: "Select one or more PDF files from your device. Drag and drop works on mobile, tablet, and desktop, and you can add more files anytime.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Organize pages",
                desc: "Drag pages to reorder them, rotate sideways pages, delete pages you do not need, or insert blank pages between any two pages.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download organized PDF",
                desc: "Click Organize PDF and your newly arranged file is ready in seconds — clean, no watermark, original quality preserved.",
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

            seoBadge: "Organize PDF Guide",
            seoTitle: "Complete Guide to Organizing PDF Pages Online",
            seoDescription:
              "Everything you need to know about reordering, rotating, deleting, and adding pages to a PDF — free, online, with full quality preserved. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free Organize PDF Tool — Reorder, Rotate, Delete and Add Pages Online",
                text: (
                  <>
                    Need to organize the pages of a PDF? PDFLinx lets you rearrange, rotate, delete, and insert blank pages in your PDF online for free — instantly and without any software installation. Whether you need to fix a scanned document with pages in the wrong order, remove unwanted pages from a report, or combine pages from several PDFs into one file, PDFLinx shows every page as a thumbnail so you can arrange the document exactly the way you want. If you only need to delete pages, our <a href="/remove-pages" className="text-blue-600 hover:underline font-medium">Remove Pages tool</a> is the fastest option. No signup, no watermark, no hidden limits — works on Windows, Mac, iPhone, and Android.
                  </>
                ),
              },
              {
                title: "What Does Organizing a PDF Mean?",
                text: (
                  <>
                    Organizing a PDF means changing the structure of the document without changing the content of the individual pages. This includes moving pages to a new position, deleting pages you do not need, rotating pages that appear sideways, and inserting blank pages where you need spacing. It is different from editing a PDF, where you change the text or images on a page. When you organize a PDF, every page stays exactly as it was — you only decide which pages stay, in what order they appear, and how they are oriented. This is the fastest way to turn a messy, out-of-order PDF into a clean and professional document.
                  </>
                ),
              },
              {
                title: "How to Organize PDF Pages — Step by Step",
                text: (
                  <>
                    Organizing a PDF with PDFLinx takes only a few seconds. First, upload one or more PDFs by dragging them into the upload area or selecting them from your device. Second, drag pages to new positions, use the rotate icon on any page that faces the wrong way, use the trash icon to delete pages you do not want, and hover between two pages to insert a blank page. Third, click Organize PDF and download the result. Your original file is never modified — you always receive a new, clean copy with your changes applied.
                  </>
                ),
              },
              {
                title: "Reorder, Rotate, Delete or Add Blank Pages — What Can You Fix?",
                text: (
                  <>
                    Most PDF problems come down to a few simple issues, and organizing solves all of them. Pages in the wrong order — common when scanning double-sided documents — can be dragged into the correct sequence. Unwanted pages such as blank pages, duplicate scans, cover sheets, or confidential pages can be deleted before sharing. Pages that appear sideways or upside down, typical of phone scans, can be rotated in 90° steps until they look right. Blank pages can be inserted between sections or before a chapter. Combine them and you can fix almost any badly structured PDF in one pass.
                  </>
                ),
              },
              {
                title:
                  "Why PDFLinx is the Best Free Organize PDF Tool — No Watermark, No Limits",
                text: (
                  <>
                    Many online PDF organizers add watermarks to the output, limit the number of pages or files you can process, or require you to create an account before you can download your file. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf, which restrict usage on free plans, PDFLinx lets you organize as many PDFs as you need at zero cost. Read our <a href="/compare/pdflinx-vs-ilovepdf" className="text-blue-600 hover:underline font-medium">PDFLinx vs iLovePDF</a> guide for a detailed comparison.
                  </>
                ),
              },
              {
                title: "Common Use Cases for Organizing PDF Pages",
                text: (
                  <>
                    ✓ <strong>Students & Teachers:</strong> Arrange assignment pages, lecture notes, and scanned exam papers in the correct order before submitting or sharing.<br />
                    ✓ <strong>Business & Reports:</strong> Reorder sections of a report, and remove draft or unnecessary pages before sending to clients. Need page numbers afterwards? Use our <a href="/add-page-numbers" className="text-blue-600 hover:underline font-medium">Add Page Numbers tool</a>.<br />
                    ✓ <strong>Legal & Contracts:</strong> Put scanned agreements, annexures, and signature pages in the right sequence and remove pages that should not be shared.<br />
                    ✓ <strong>Finance & Accounting:</strong> Clean up bundled invoices, statements, and receipts by deleting duplicates and sorting pages properly.<br />
                    ✓ <strong>Scanned Documents:</strong> Fix pages scanned out of order or rotated the wrong way, especially from phone scanning apps and shared office scanners.<br />
                    ✓ <strong>Job Applications:</strong> Arrange your CV, cover letter, and certificates in the exact order an employer expects to see them.
                  </>
                ),
              },
              {
                title:
                  "Organize PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: (
                  <>
                    PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser, upload your PDF from your files app, rearrange the pages with your finger, and download the result. On Mac or Windows, drag and drop your PDF, organize the pages with your mouse, and save the new file in seconds. Whether you are on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.
                  </>
                ),
              },
              {
                title: "Privacy and File Security",
                text: (
                  <>
                    Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when organizing contracts, financial records, and personal documents that contain sensitive information. All file transfers use encrypted HTTPS connections for complete security. Want extra protection for the finished file? Lock it with a password using our <a href="/protect-pdf" className="text-blue-600 hover:underline font-medium">Protect PDF tool</a>.
                  </>
                ),
              },
              {
                title:
                  "Organize PDF vs Merge, Split and Remove Pages — Which Should You Use?",
                text: (
                  <>
                    Organize PDF is the all-in-one tool for managing pages visually — reordering, rotating, deleting, and inserting blank pages, and it also lets you add several PDFs and arrange all their pages together. <a href="/merge-pdf" className="text-blue-600 hover:underline font-medium">Merge PDF</a> is the simpler choice when you just want to join whole files one after another. <a href="/split-pdf" className="text-blue-600 hover:underline font-medium">Split PDF</a> is best when you want to break one large PDF into multiple smaller files. <a href="/remove-pages" className="text-blue-600 hover:underline font-medium">Remove Pages</a> is the fastest option when your only goal is to delete specific pages, and <a href="/rotate-pdf" className="text-blue-600 hover:underline font-medium">Rotate PDF</a> is ideal when you only need to fix orientation. If you need more than one of these things, Organize PDF saves time. All of these tools are free on PDFLinx.
                  </>
                ),
              },
              {
                title: "Will Organizing a PDF Reduce Its Quality?",
                text: (
                  <>
                    No. Organizing a PDF only changes the order, presence, and orientation of pages — it does not re-render the content of any page. Text stays sharp, images keep their original resolution, and fonts and layout remain exactly as they were. The file size of the result depends mainly on how many pages you keep, so deleting pages will usually make the PDF smaller. If you want to reduce the size further, you can run the organized PDF through the <a href="/compress-pdf" className="text-blue-600 hover:underline font-medium">Compress PDF tool</a> afterwards.
                  </>
                ),
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Organize PDF tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of PDFs you organize. Rearrange, rotate, and delete pages as many times as you need at zero cost.",
              },
              {
                q: "What can I do with the Organize PDF tool?",
                a: "You can reorder pages by dragging them, rotate pages that appear sideways, delete pages you do not need, insert blank pages anywhere, and add multiple PDFs to arrange all their pages together. All changes are applied at once and you download one clean PDF.",
              },
              {
                q: "How do I change the order of pages in a PDF?",
                a: "Upload your PDF and drag each page thumbnail to its new position. When the order looks right, click Organize PDF and download the new file.",
              },
              {
                q: "Can I delete pages from a PDF with this tool?",
                a: "Yes. Click the trash icon on any page, such as a blank page, duplicate, or confidential sheet, to remove it before downloading. The remaining pages stay exactly as they were.",
              },
              {
                q: "Can I rotate pages in my PDF?",
                a: "Yes. Click the rotate icon on any page to turn it 90° at a time until it faces the right way. This is handy for phone scans and photographed documents.",
              },
              {
                q: "Can I add blank pages to my PDF?",
                a: "Yes. Hover between any two pages and click the blank page button to insert an empty page at that exact position.",
              },
              {
                q: "Can I combine pages from multiple PDFs?",
                a: "Yes. Upload several PDFs, or use Add more files inside the editor, and all their pages appear together. Each file gets its own color so you can tell where a page came from, and you can arrange them into one final PDF.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and organize it instantly — no email, no registration, no friction.",
              },
              {
                q: "Will organizing reduce the quality of my PDF?",
                a: "No. PDFLinx only changes the order, presence, and orientation of pages, so text, images, and layout keep their original quality.",
              },
              {
                q: "Does PDFLinx add any watermark to the PDF?",
                a: "No watermarks, ever. Your organized PDF is 100% clean and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed. On mobile, tap the Options button to open the side panel.",
              },
              {
                q: "Will my original PDF be changed?",
                a: "No. Your original file is never modified. You always receive a new PDF with your changes applied, so your original stays safe.",
              },
              {
                q: "What is the difference between Organize PDF, Merge PDF and Split PDF?",
                a: "Organize PDF manages pages visually: reorder, rotate, delete, and insert blanks, even across several PDFs. Merge PDF simply joins whole files together, and Split PDF breaks one PDF into multiple files. Use Organize when you want full control over every page.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF organizing?",
                a: "Yes — PDFLinx offers unlimited free use with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict usage on free plans.",
              },
            ],

            ctaTitle: (
              <>
                Organize your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx to reorder, rotate, and clean up their PDF pages every day.",
            ctaButton: "Choose PDF Files",
          },
        }}

      />

      <RelatedToolsSection />
    </>
  );
}

