"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ShieldCheck,
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
  Eye,
  AlertTriangle,
  Shield, PenLine, LockOpen, Pencil,
  Stamp, Minimize2, Scan, GitMerge
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";



const DONE_LINKS = [
  { label: "Protect PDF",    href: "/protect-pdf",    icon: <Shield          className="h-4 w-4 text-red-500"     /> },
  { label: "Sign PDF",       href: "/sign-pdf",       icon: <PenLine         className="h-4 w-4 text-indigo-500"  /> },
  { label: "Unlock PDF",     href: "/unlock-pdf",     icon: <LockOpen        className="h-4 w-4 text-green-500"   /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
  { label: "Add Watermark",  href: "/add-watermark",  icon: <Stamp           className="h-4 w-4 text-teal-500"    /> },
  { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2       className="h-4 w-4 text-green-500"   /> },
  { label: "OCR PDF",        href: "/ocr-pdf",        icon: <Scan            className="h-4 w-4 text-violet-500"  /> },
  { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge        className="h-4 w-4 text-purple-500"  /> },
];


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
        id="howto-schema-redact-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Redact PDF Files Online for Free",
            description:
              "Remove sensitive information from PDF documents by applying permanent redactions before sharing.",
            url: "https://pdflinx.com/redact-pdf",
            step: [
              {
                "@type": "HowToStep",
                name: "Upload PDF",
                text: "Select and upload the PDF document you want to redact."
              },
              {
                "@type": "HowToStep",
                name: "Mark sensitive content",
                text: "Choose the text, images, or areas that should be permanently removed."
              },
              {
                "@type": "HowToStep",
                name: "Apply redactions and download",
                text: "Apply the redactions and download the secured PDF file."
              }
            ],
            totalTime: "PT2M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "USD"
            },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-redact-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://pdflinx.com"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Redact PDF",
                item: "https://pdflinx.com/redact-pdf"
              }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-redact-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What does Redact PDF do?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Redact PDF permanently removes sensitive information from PDF documents by blacking out selected content."
                }
              },
              {
                "@type": "Question",
                name: "Is the redacted information permanently removed?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Proper redaction permanently removes the selected content from the final PDF document."
                }
              },
              {
                "@type": "Question",
                name: "Can I redact text and images?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can redact text, images, and other sensitive areas within a PDF file."
                }
              },
              {
                "@type": "Question",
                name: "Does Redact PDF work on mobile devices?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The tool works on Android, iPhone, tablets, and desktop browsers."
                }
              },
              {
                "@type": "Question",
                name: "Are my files secure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Files are processed securely and automatically removed after processing."
                }
              }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-redact-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Redact PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/redact-pdf",
            description:
              "Free online PDF redaction tool. Permanently remove sensitive information from PDF documents by blacking out text, images, and confidential content before sharing.",
            image: "https://pdflinx.com/og-image.png",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            },
            publisher: {
              "@type": "Organization",
              name: "PDFLinx",
              url: "https://pdflinx.com"
            },
            featureList: [
              "Redact sensitive PDF content",
              "Permanently remove confidential information",
              "Black out text and images",
              "Secure document sharing",
              "Protect personal and business data",
              "Free online PDF redaction",
              "Works in any web browser",
              "No software installation required"
            ]
          }, null, 2),
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
        sidebarLinks={DONE_LINKS}
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
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${isActive
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
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${rect.pageNum === currentPage
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
                      className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${file && totalRedacted > 0
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

        // ============================================================
        // REDACT PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS, 
            eyebrow: "REDACT PDF",

            breadcrumbCurrent: "Redact PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Redact PDF —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Permanently Remove Sensitive Information
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Permanently redact sensitive text, images, and information from any PDF online for free. Black out names, numbers, signatures, and confidential content — irrecoverably removed. No signup, no watermark, no software needed.",

            // pills: [
            //   "Permanent redaction — not just covered",
            //   "Text, images & areas redacted",
            //   "Irrecoverable removal",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Redact PDF Online —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Permanently Remove Text & Images Free
                </em>
              </>
            ),
            heroDescription:
              "Redact PDF online for free — permanently black out sensitive text, images, or personal information from any PDF. Redaction is irreversible and secure. No signup, no watermark.",
            pills: ["Permanent redaction", "Black out text & images", "Secure & irreversible", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Redact PDF Info",
            noticeItems: [
              "Select text or draw area to redact",
              "Content permanently removed — not just hidden",
              "Black box shown where content was",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Redact a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, mark content to redact, download — done in minutes.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. The document opens in the redaction editor instantly.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Mark Content to Redact",
                desc: "Draw black redaction boxes over any text, image, signature, number, or area you want permanently removed. Mark as many areas as needed across any number of pages before applying.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Apply & Download Redacted PDF",
                desc: "Click Apply Redaction — the marked content is permanently and irrecoverably removed from the PDF. Download your redacted file ready to share safely.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Redaction Tool Online",

            seoBadge: "Redact PDF Guide",
            seoTitle: "Complete Guide to Redacting PDF Files Online",
            seoDescription:
              "Everything you need to know about permanently redacting sensitive information from a PDF — free, online, irrecoverable removal. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Redaction Tool — Permanently Remove Sensitive Information from Any PDF Online",
                text: "Need to redact a PDF? PDFLinx lets you permanently remove sensitive text, images, and content from any PDF online for free — instantly and without any software installation. Whether you need to black out personal names, ID numbers, financial figures, signatures, medical information, or any confidential content before sharing a document, PDFLinx removes it irrecoverably in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PDF Redaction — and Why It Must Be Permanent",
                text: "PDF redaction is the process of permanently removing sensitive information from a document so that it cannot be seen, recovered, or extracted by anyone who receives the file. True redaction is fundamentally different from simply drawing a black box or using a black highlighter on top of text — those methods only cover the content visually while leaving the underlying text data completely intact in the PDF file. Anyone can remove such a visual overlay using a PDF editor and read the original text. PDFLinx performs real redaction — the content beneath the marked areas is permanently deleted from the PDF file structure, leaving only the black redaction mark with no recoverable data underneath.",
              },
              {
                title: "Black Box Overlay vs True Redaction — A Critical Difference",
                text: "This distinction is critically important and widely misunderstood. Many people think adding a black rectangle on top of sensitive text in a PDF editor is the same as redacting it — it is not. The text data still exists in the file and is readable by anyone who removes the overlay shape, copies the underlying text layer, or opens the file in a text extraction tool. Genuine redaction permanently removes the content from the file at the data level. PDFLinx applies true redaction — after processing, there is no text, image data, or recoverable information in the redacted areas. The black box you see in the output is all that remains.",
              },
              {
                title: "What Can You Redact with PDFLinx?",
                text: "PDFLinx lets you redact any visible content on any page of a PDF. You can redact text — names, ID numbers, phone numbers, email addresses, financial figures, account numbers, and any other sensitive text. You can redact images — photos, signatures, stamps, and scanned content. You can redact entire areas of a page by drawing a redaction box over any region. You can redact across multiple pages in a single session — marking all sensitive areas throughout the document before applying redaction in one step.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Redaction Tool — No Watermark, No Limits",
                text: "Professional PDF redaction tools like Adobe Acrobat Pro charge a monthly subscription for the redaction feature. Most free alternatives either perform fake redaction using overlays — leaving sensitive data in the file — or add watermarks to the output. PDFLinx performs genuine permanent redaction completely free, with no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which do not offer proper redaction on free tiers, PDFLinx gives you professional-grade data removal at zero cost.",
              },
              {
                title: "Common Use Cases for Redacting a PDF",
                text: "✓ Legal & Court Documents: Redact personal identifiers, witness names, addresses, and confidential case details before filing or sharing court documents publicly.\n✓ Medical & Healthcare: Remove patient names, ID numbers, diagnosis details, and other protected health information from medical records before sharing for research or review.\n✓ Financial Documents: Black out account numbers, routing numbers, tax IDs, and sensitive financial figures from statements and reports shared externally.\n✓ HR & Employment: Redact salary information, personal contact details, and sensitive performance data from employee documents before broader distribution.\n✓ Government & FOIA: Remove classified, private, or legally protected information from government documents prepared for public release.\n✓ Business & Contracts: Redact pricing terms, proprietary details, and confidential clauses from contracts shared for partial review.",
              },
              {
                title:
                  "Redact PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app — draw redaction areas by touch. On Mac or Windows, drag and drop your PDF and use your mouse to mark sensitive areas precisely. Whether you need to redact a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security During Redaction",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when redacting confidential legal, medical, or financial documents. All file transfers use encrypted HTTPS connections. After redaction, the removed content cannot be recovered — not by PDFLinx, not by anyone who receives the file.",
              },
              {
                title: "Can Redacted Content Be Recovered?",
                text: "Content redacted by PDFLinx cannot be recovered. True redaction permanently removes the underlying data from the PDF file structure — there is nothing left to extract, unhide, or reverse. This is the fundamental guarantee of proper redaction. However, always verify your redacted output by downloading the file and confirming the sensitive areas are fully blacked out before sharing. If any area appears improperly redacted, re-upload and re-apply redaction before distribution. Never rely on visual inspection alone — also try selecting and copying text in the redacted areas to confirm no underlying text is selectable.",
              },
              {
                title: "Redact PDF vs Edit PDF — What is the Difference?",
                text: "Editing a PDF adds content on top of existing pages — text boxes, highlights, shapes, and annotations that can be modified or removed later. Redacting a PDF permanently removes content from the page — it is a destructive, irreversible action by design. Use Edit PDF when you want to add or annotate content that may be changed in future versions of the document. Use Redact PDF when you need to permanently destroy sensitive information before the document is shared externally. Both are free on PDFLinx.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF redaction tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of areas you redact or how many PDFs you process.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and start redacting instantly — no email, no registration, no friction.",
              },
              {
                q: "Is the redaction permanent — can the hidden content be recovered?",
                a: "Yes, permanently and irrecoverably. PDFLinx removes content from the PDF file structure — there is no underlying data left to recover, extract, or unhide. This is true redaction, not a visual overlay.",
              },
              {
                q: "What is the difference between real redaction and just adding a black box?",
                a: "Adding a black rectangle or black highlight in a PDF editor only covers text visually — the original text data remains in the file and is recoverable. PDFLinx performs true redaction — the content is permanently deleted from the file, leaving only the black mark with nothing underneath.",
              },
              {
                q: "Can I redact text, images, and scanned content?",
                a: "Yes. Draw a redaction box over any text, image, signature, stamp, or area — PDFLinx permanently removes whatever is underneath the marked region.",
              },
              {
                q: "Can I redact multiple areas across multiple pages in one session?",
                a: "Yes. Mark as many redaction areas as needed across any number of pages before applying — all redactions are applied in a single operation when you click Apply Redaction.",
              },
              {
                q: "Can I undo a redaction after applying it?",
                a: "No. Redaction is permanent and irreversible by design — this is what makes it safe. Always review your marked areas carefully in the preview before applying. Keep the original unredacted file safely stored if you may need it later.",
              },
              {
                q: "How do I verify the redaction was successful?",
                a: "After downloading, open the redacted PDF and try to select or copy text in the redacted areas — if redaction was applied correctly, no text will be selectable. The black boxes should be the only thing present in those areas.",
              },
              {
                q: "Does PDFLinx add any watermark to the redacted PDF?",
                a: "No watermarks, ever. Your redacted PDF contains only your redaction marks and the remaining original content — no platform branding.",
              },
              {
                q: "Is my file secure and private during redaction?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents — especially critical for sensitive legal, medical, and financial files.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works in the browser on iPhone, Android, iPad, Windows, and Mac — draw redaction boxes by touch on mobile. No app download needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting the file first using our free PDF Split tool, redact each part, then merge them back.",
              },
              {
                q: "Can I redact a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then redact the sensitive content.",
              },
              {
                q: "What is the difference between Redact PDF and Edit PDF?",
                a: "Edit PDF adds content on top of pages — annotations and text that can be changed. Redact PDF permanently destroys content — it is irreversible. Use Redact when you need to permanently remove sensitive information before sharing externally.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for PDF redaction?",
                a: "Yes — PDFLinx offers true permanent redaction for free with no watermark, no daily limits, and no account required. Most free tools including iLovePDF do not offer genuine redaction — they only provide black box overlays that leave content recoverable.",
              },
            ],

            ctaTitle: (
              <>
                Redact your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx to permanently remove sensitive information from PDFs every day.",
            ctaButton: "Choose PDF File",
          },
        }}
      />

      <RelatedToolsSection />
    </>
  );
}