"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Download,
  MonitorSmartphone,
  CheckCircle,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  Eraser,
  Hand,
  Square,
  Trash2,
  Info,
  Eye,
  EyeOff,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// ── Redact Canvas Component ───────────────────────────────────────────────────
function RedactCanvas({
  file,
  redactRects,       // [{ pageNum, x, y, w, h, id, label }]
  setRedactRects,
  activeTool,        // "select" | "redact" | "eraser"
  currentPage,
  setCurrentPage,
  scale,
  setScale,
  totalPages,
  setTotalPages,
  onRectAdd,
  onRectRemove,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfPage, setPdfPage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [draftRect, setDraftRect] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const pdfDocRef = useRef(null);
  const idCounter = useRef(1);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Load PDF
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    let tries = 0;
    const load = async () => {
      const lib = window?.pdfjsLib;
      if (!lib) {
        if (tries++ < 80) return setTimeout(load, 100);
        return;
      }
      try {
        const buf = await file.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        const page = await doc.getPage(1);
        if (cancelled) return;
        setPdfPage(page);
      } catch (e) { console.error(e); }
    };
    load();
    return () => { cancelled = true; };
  }, [file]);

  // Change page
  useEffect(() => {
    if (!pdfDocRef.current) return;
    pdfDocRef.current.getPage(currentPage).then(setPdfPage);
  }, [currentPage]);

  // Render PDF
  useEffect(() => {
    if (!pdfPage || !canvasRef.current) return;
    const viewport = pdfPage.getViewport({ scale });
    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    setCanvasSize({ w: viewport.width, h: viewport.height });
    const ctx = canvas.getContext("2d");
    pdfPage.render({ canvasContext: ctx, viewport });
  }, [pdfPage, scale]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  };

  // Get rect at position (for eraser)
  const getRectAt = (pos) => {
    const pageRects = redactRects.filter(r => r.pageNum === currentPage);
    // reverse so top-most (last drawn) is hit first
    for (let i = pageRects.length - 1; i >= 0; i--) {
      const r = pageRects[i];
      if (pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h) {
        return r.id;
      }
    }
    return null;
  };

  const onMouseDown = (e) => {
    if (activeTool === "select") return;
    e.preventDefault();
    const pos = getPos(e);

    if (activeTool === "eraser") {
      const id = getRectAt(pos);
      if (id) onRectRemove(id);
      return;
    }

    if (activeTool === "redact") {
      setIsDrawing(true);
      setDrawStart(pos);
      setDraftRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
  };

  const onMouseMove = (e) => {
    if (!isDrawing || activeTool !== "redact") {
      // hover for eraser
      if (activeTool === "eraser") {
        const pos = getPos(e);
        setHoveredId(getRectAt(pos));
      }
      return;
    }
    e.preventDefault();
    const pos = getPos(e);
    const W = canvasSize.w, H = canvasSize.h;
    const x = Math.min(pos.x, drawStart.x);
    const y = Math.min(pos.y, drawStart.y);
    const w = Math.abs(pos.x - drawStart.x);
    const h = Math.abs(pos.y - drawStart.y);
    setDraftRect({
      x: clamp(x, 0, W),
      y: clamp(y, 0, H),
      w: clamp(w, 2, W - x),
      h: clamp(h, 2, H - y),
    });
  };

  const onMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (draftRect && draftRect.w > 8 && draftRect.h > 8) {
      const newRect = {
        ...draftRect,
        pageNum: currentPage,
        id: idCounter.current++,
        label: `Page ${currentPage}`,
      };
      onRectAdd(newRect);
    }
    setDraftRect(null);
    setDrawStart(null);
  };

  const pageRects = redactRects.filter(r => r.pageNum === currentPage);

  const getCursor = () => {
    if (activeTool === "select") return "default";
    if (activeTool === "eraser") return "cell";
    return isDrawing ? "crosshair" : "crosshair";
  };

  return (
    <div className="flex flex-col h-full">
      {/* PDF Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#525659] flex justify-center items-start py-8"
      >
        <div className="relative inline-block shadow-2xl">
          {/* PDF Canvas */}
          <canvas
            ref={canvasRef}
            className="block bg-white"
            style={{ display: "block", cursor: getCursor(), width: "100%", height: "auto" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
          />

          {/* Existing redact rectangles overlay */}
          {canvasSize.w > 0 && (pageRects.length > 0 || draftRect) && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
              viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
              preserveAspectRatio="none"
            >
              {/* Committed redact rects */}
              {pageRects.map(r => (
                <g key={r.id}>
                  {/* Black fill — true redaction preview */}
                  <rect
                    x={r.x} y={r.y} width={r.w} height={r.h}
                    fill={hoveredId === r.id ? "rgba(220,38,38,0.85)" : "rgba(0,0,0,0.82)"}
                    stroke={hoveredId === r.id ? "#ef4444" : "#1e293b"}
                    strokeWidth="1.5"
                  />
                </g>
              ))}

              {/* Draft rect being drawn */}
              {draftRect && draftRect.w > 2 && (
                <rect
                  x={draftRect.x} y={draftRect.y} width={draftRect.w} height={draftRect.h}
                  fill="rgba(0,0,0,0.65)"
                  stroke="#f24d0d"
                  strokeWidth="2"
                  strokeDasharray="6,3"
                />
              )}
            </svg>
          )}

          {/* Transparent pointer-event layer for eraser hover */}
          {activeTool === "eraser" && canvasSize.w > 0 && (
            <svg
              className="absolute inset-0"
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, cursor: "cell" }}
              viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const pos = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
                setHoveredId(getRectAt(pos));
              }}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const pos = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
                const id = getRectAt(pos);
                if (id) onRectRemove(id);
              }}
            >
              <rect width="100%" height="100%" fill="transparent" />
            </svg>
          )}
        </div>
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="flex h-8 w-10 items-center justify-center rounded border border-slate-300 bg-white text-sm font-semibold text-slate-700">
            {currentPage}
          </div>
          <span className="text-sm text-slate-500">/ {totalPages}</span>
        </div>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          onClick={() => setScale(s => Math.max(0.4, +(s - 0.2).toFixed(1)))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-[68px] items-center justify-center rounded border border-slate-300 bg-white text-sm font-semibold text-slate-700">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={() => setScale(s => Math.min(2.5, +(s + 0.2).toFixed(1)))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-1" />
        <button
          onClick={() => setScale(1)}
          title="Reset zoom"
          className="flex h-8 px-3 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600 text-xs font-medium"
        >
          100%
        </button>

        {/* Filename */}
        <div className="ml-4 hidden md:block max-w-[200px] truncate text-xs text-slate-400 border border-slate-200 rounded px-2 py-1">
          {file?.name || ""}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function RedactPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [redactRects, setRedactRects] = useState([]);
  const [activeTool, setActiveTool] = useState("redact"); // "select" | "redact" | "eraser"
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const file = flow.files?.[0] || null;

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleRectAdd = (rect) => {
    setRedactRects(prev => [...prev, rect]);
  };

  const handleRectRemove = (id) => {
    setRedactRects(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAll = () => setRedactRects([]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file?.name?.replace(/\.pdf$/i, "") + "-redacted.pdf" || "redacted.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Search text redact — sends search term to backend which finds & marks text
  const handleSearchRedact = async () => {
    if (!searchText.trim() || !file) return;
    setSearchLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("searchText", searchText.trim());

      const res = await fetch("/convert/redact-pdf-search", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      // data.rects = [{ pageNum, x, y, w, h }]
      if (data.rects?.length) {
        const newRects = data.rects.map((r, i) => ({
          ...r,
          id: Date.now() + i,
          label: `"${searchText}" — Page ${r.pageNum}`,
        }));
        setRedactRects(prev => [...prev, ...newRects]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
      setSearchText("");
    }
  };

  const handleConvert = async () => {
    if (!flow.files?.length) return;
    if (redactRects.length === 0) {
      flow.handleError("Please mark at least one area to redact.");
      return;
    }

    flow.startProcessing();
    startProgress();

    try {
      const formData = new FormData();
      flow.files.forEach(f => formData.append("files", f));
      formData.append("redactRects", JSON.stringify(redactRects));
      formData.append("scale", String(scale));

      const res = await fetch("/convert/redact-pdf", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to redact PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong while redacting.");
    }
  };

  // Tool button config
  const tools = [
    { id: "select", icon: Hand, label: "Select" },
    { id: "redact", icon: Square, label: "Redact" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const rectsOnCurrentPage = redactRects.filter(r => r.pageNum === currentPage);
  const totalRedacted = redactRects.length;

  return (
    <>
      <Script
        id="faq-schema-redact-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is PDF redaction?", acceptedAnswer: { "@type": "Answer", text: "PDF redaction permanently removes sensitive text and images from PDF documents, replacing them with black boxes so the content cannot be recovered." } },
              { "@type": "Question", name: "Can I redact PDF online for free?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you redact PDF files online for free without installing any software." } },
              { "@type": "Question", name: "Is redacted text permanently removed?", acceptedAnswer: { "@type": "Answer", text: "Yes. Our tool permanently removes the underlying text and image data, not just covers it visually." } },
              { "@type": "Question", name: "Can I search and redact specific words?", acceptedAnswer: { "@type": "Answer", text: "Yes. Use the search box to find and mark specific words or phrases across all pages for redaction." } },
              { "@type": "Question", name: "Are my files secure?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are encrypted during upload and automatically deleted from our servers after processing." } },
            ],
          }),
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
        title="Redact PDF Online"
        tagline="Black Out Sensitive Text · Permanently Remove Data · Secure Documents"
        accept=".pdf,application/pdf"
        multiple={false}
        convertLabel="Redact PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        processingTitle="Redacting PDF..."
        processingDescription="Permanently removing marked content. Please wait."
        processingStages={["Uploading", "Applying redactions", "Cleaning data", "Done"]}
        doneTitle="Your redacted PDF is ready"
        doneDescription="All marked areas have been permanently removed."
        downloadLabel="Download Redacted PDF"
        resetLabel="Redact another PDF"
        sidebarTitle="Redact PDF"
        sidebarIcon={<ShieldCheck className="h-5 w-5 text-white" />}
        sidebarDescription="Permanently black out sensitive text and data from PDF documents."
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF supported"

        customOptionsLayout={
          <div
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            {/* TOP HEADER BAR */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
              <div className="flex items-center gap-3">
                {/* Tool buttons — iLovePDF style top toolbar */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {tools.map(tool => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        title={tool.label}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {file && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="max-w-[180px] truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {file.name} · {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={() => { flow.reset(); setRedactRects([]); }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* MAIN WORKSPACE */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]">

              {/* LEFT: PDF canvas */}
              <div style={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
                {file ? (
                  <RedactCanvas
                    file={file}
                    redactRects={redactRects}
                    setRedactRects={setRedactRects}
                    activeTool={activeTool}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    scale={scale}
                    setScale={setScale}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                    onRectAdd={handleRectAdd}
                    onRectRemove={handleRectRemove}
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-center bg-[#525659] p-8">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
                        <FileText className="h-8 w-8 text-white/40" />
                      </div>
                      <p className="text-sm font-semibold text-white/60">Upload a PDF to start redacting</p>
                      <p className="mt-1 text-xs text-white/40">Select areas to permanently remove sensitive content</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="border-l border-slate-200 bg-white">
                <div
                  className="sticky top-0 overflow-y-auto flex flex-col"
                  style={{ height: "calc(100vh - 140px)" }}
                >
                  {/* Sidebar title */}
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-lg font-bold text-slate-900">Redact PDF</h3>
                  </div>

                  <div className="flex-1 space-y-4 p-5">

                    {/* Search text box — iLovePDF style */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Search text</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchText}
                          onChange={e => setSearchText(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleSearchRedact()}
                          placeholder="e.g. John Smith, SSN..."
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                        />
                        <button
                          onClick={handleSearchRedact}
                          disabled={!searchText.trim() || !file || searchLoading}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          {searchLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">Marks all occurrences across all pages</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100" />

                    {/* Info tip */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 leading-5">
                        Review the result carefully before sharing sensitive documents.
                      </p>
                    </div>

                    {/* Marked for redaction list */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Marked for redaction
                          {totalRedacted > 0 && (
                            <span className="ml-2 rounded-full bg-red-100 text-red-600 px-2 py-0.5 text-[10px] font-bold">
                              {totalRedacted}
                            </span>
                          )}
                        </p>
                        {totalRedacted > 0 && (
                          <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            Clear all
                          </button>
                        )}
                      </div>

                      {totalRedacted === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <Square className="h-5 w-5 text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-400 leading-5">
                            Select and search text or pages to start redacting sensitive content
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                          {redactRects.map(rect => (
                            <div
                              key={rect.id}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
                                rect.pageNum === currentPage
                                  ? "border-red-200 bg-red-50"
                                  : "border-slate-200 bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-3 w-3 rounded-sm bg-slate-900 shrink-0" />
                                <span className="text-xs text-slate-600 truncate max-w-[150px]">
                                  {rect.label || `Area — Page ${rect.pageNum}`}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRectRemove(rect.id)}
                                className="ml-2 shrink-0 text-slate-400 hover:text-red-500 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Current page hint */}
                    {rectsOnCurrentPage.length > 0 && (
                      <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                        <Eye className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="text-xs text-slate-600">
                          <strong>{rectsOnCurrentPage.length}</strong> area{rectsOnCurrentPage.length !== 1 ? "s" : ""} marked on this page
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA at bottom */}
                  <div className="border-t border-slate-100 p-5 space-y-2">
                    <button
                      type="button"
                      onClick={handleConvert}
                      disabled={!file || totalRedacted === 0}
                      className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        file && totalRedacted > 0
                          ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-lg shadow-orange-200"
                          : "cursor-not-allowed bg-slate-200 text-slate-400"
                      }`}
                    >
                      <span>
                        {!file
                          ? "Upload a PDF first"
                          : totalRedacted === 0
                          ? "Mark areas to redact"
                          : `Redact PDF`}
                      </span>
                      {file && totalRedacted > 0 && <ArrowRight className="h-5 w-5" />}
                    </button>
                    {totalRedacted > 0 && (
                      <p className="text-center text-[11px] text-slate-400">
                        {totalRedacted} area{totalRedacted !== 1 ? "s" : ""} will be permanently removed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        uploadLanding={{
          content: {
            eyebrow: "REDACT PDF",
            heroTitle: (
              <>
                Redact PDF Online <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">free & permanently</em>
              </>
            ),
            heroDescription:
              "Redact PDF online to permanently remove sensitive text, personal data, and confidential information from your documents. Black out names, addresses, SSNs, and more — no software needed.",
            noticeTitle: "Redact PDF features",
            noticeItems: ["Permanent text removal", "Search & redact keywords", "Draw redaction areas manually"],
            howToTitle: "How to redact a PDF",
            howToSubtitle: "Upload your PDF, mark areas to redact, and download your secure document instantly.",
            howToSteps: [
              { n: "1", title: "Upload your PDF", desc: "Select your PDF file from your device.", color: "bg-blue-600" },
              { n: "2", title: "Mark areas to redact", desc: "Draw black boxes over sensitive text or use search to find and mark keywords automatically.", color: "bg-red-600" },
              { n: "3", title: "Download redacted PDF", desc: "Download your permanently redacted document with all sensitive data removed.", color: "bg-emerald-600" },
            ],
            whyTitle: "Why use PDFLinx Redact PDF?",
            whyItems: [
              { title: "Permanent Redaction", desc: "Underlying text data is completely removed, not just covered visually.", icon: ShieldCheck, iconColor: "text-red-600", bgColor: "bg-red-100" },
              { title: "Search & Redact", desc: "Find and mark specific keywords, names, or numbers across all pages automatically.", icon: Search, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
              { title: "GDPR & Privacy Compliance", desc: "Remove personal data before sharing documents to meet privacy requirements.", icon: CheckCircle, iconColor: "text-green-600", bgColor: "bg-green-100" },
              { title: "Works on Any Device", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
              { title: "Private & Secure", desc: "Files are encrypted during upload and automatically deleted after processing.", icon: Download, iconColor: "text-emerald-600", bgColor: "bg-emerald-100" },
            ],
            seoBadge: "PDF Redaction Tool",
            seoTitle: "Redact PDF Online Free",
            seoDescription: "Permanently redact sensitive text and images from PDF files online for free. Black out names, addresses, and confidential data with no watermark or signup required.",
            seoSections: [
              { title: "Permanently Remove Sensitive Data from PDFs", text: "True PDF redaction removes the underlying text data entirely, not just covers it with a black box. This prevents copy-paste or forensic recovery of redacted content." },
              { title: "Search and Redact Keywords Automatically", text: "Use the search feature to find all instances of a name, ID number, or phrase across all pages and mark them for redaction in one click." },
              { title: "Ideal for Legal, Medical, and HR Documents", text: "Redact confidential information from contracts, medical records, HR files, and government documents before sharing or publishing." },
              { title: "No Software Installation Required", text: "Redact PDFs directly in your browser on any desktop or mobile device without installing additional tools." },
            ],
            faqTitle: "Frequently asked questions",
            faqs: [
              { q: "What is PDF redaction?", a: "PDF redaction permanently removes sensitive text and images from PDF documents, replacing them with black boxes so the content cannot be recovered." },
              { q: "Can I redact PDF online for free?", a: "Yes. PDFLinx lets you redact PDF files online for free without installing any software." },
              { q: "Is redacted text permanently removed?", a: "Yes. Our tool permanently removes the underlying text and image data — it cannot be recovered by copying, selecting, or forensic tools." },
              { q: "Can I search and redact specific words?", a: "Yes. Use the search box to find and mark specific words or phrases across all pages for redaction." },
              { q: "Does redact PDF work on mobile?", a: "Yes. Redact PDF works on Android, iPhone, tablets, and all desktop browsers." },
              { q: "Are my uploaded PDFs secure?", a: "Yes. Files are encrypted during upload and automatically deleted from our servers after processing." },
            ],
          },
        }}
      />

      <RelatedToolsSection />
    </>
  );
}