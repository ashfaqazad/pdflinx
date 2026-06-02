"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  ScanLine,
  Info,
  RotateCcw,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pencil, RotateCw, Trash2, LayoutList,
  Hash, Minimize2, GitMerge, PenLine
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";




const DONE_LINKS = [
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Remove Pages", href: "/remove-pages", icon: <Trash2 className="h-4 w-4 text-red-500" /> },
  { label: "Organize PDF", href: "/organize-pdf", icon: <LayoutList className="h-4 w-4 text-blue-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Sign PDF", href: "/sign-pdf", icon: <PenLine className="h-4 w-4 text-indigo-500" /> },
];


// ── Crop Selection Component ──────────────────────────────────────────────────
function CropCanvas({ file, cropRect, setCropRect, applyToPages, scale, setScale }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfPage, setPdfPage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pdfDocRef = useRef(null);

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

  useEffect(() => {
    if (!cropRect || cropRect.w !== 0) return;
    if (canvasSize.w === 0) return;
    const pad = 0.05;
    setCropRect({
      x: canvasSize.w * pad,
      y: canvasSize.h * pad,
      w: canvasSize.w * (1 - pad * 2),
      h: canvasSize.h * (1 - pad * 2),
    });
  }, [cropRect, canvasSize]);

  // Change page
  useEffect(() => {
    if (!pdfDocRef.current) return;
    pdfDocRef.current.getPage(currentPage).then(setPdfPage);
  }, [currentPage]);

  // Render PDF on canvas
  useEffect(() => {
    if (!pdfPage || !canvasRef.current) return;
    const viewport = pdfPage.getViewport({ scale });
    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    setCanvasSize({ w: viewport.width, h: viewport.height });

    const ctx = canvas.getContext("2d");
    pdfPage.render({ canvasContext: ctx, viewport });

    const pad = 0.05;
    setCropRect({
      x: viewport.width * pad,
      y: viewport.height * pad,
      w: viewport.width * (1 - pad * 2),
      h: viewport.height * (1 - pad * 2),
    });
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

  const getHandle = (pos, rect) => {
    const HIT = 18;
    const corners = {
      "nw": { x: rect.x, y: rect.y },
      "ne": { x: rect.x + rect.w, y: rect.y },
      "sw": { x: rect.x, y: rect.y + rect.h },
      "se": { x: rect.x + rect.w, y: rect.y + rect.h },
      "n": { x: rect.x + rect.w / 2, y: rect.y },
      "s": { x: rect.x + rect.w / 2, y: rect.y + rect.h },
      "w": { x: rect.x, y: rect.y + rect.h / 2 },
      "e": { x: rect.x + rect.w, y: rect.y + rect.h / 2 },
    };
    for (const [key, p] of Object.entries(corners)) {
      if (Math.abs(pos.x - p.x) < HIT && Math.abs(pos.y - p.y) < HIT) return key;
    }
    return null;
  };

  const isInsideRect = (pos, rect) =>
    pos.x > rect.x && pos.x < rect.x + rect.w &&
    pos.y > rect.y && pos.y < rect.y + rect.h;

  const onMouseDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    const handle = getHandle(pos, cropRect);
    if (handle) {
      setIsResizing(handle);
    } else if (isInsideRect(pos, cropRect)) {
      setIsDragging(true);
      setDragStart({ x: pos.x - cropRect.x, y: pos.y - cropRect.y });
    } else {
      setCropRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
      setIsDragging(false);
      setIsResizing("se-new");
      setDragStart({ x: pos.x, y: pos.y });
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    const pos = getPos(e);
    const W = canvasSize.w, H = canvasSize.h;

    if (isDragging) {
      setCropRect(prev => ({
        ...prev,
        x: clamp(pos.x - dragStart.x, 0, W - prev.w),
        y: clamp(pos.y - dragStart.y, 0, H - prev.h),
      }));
    } else if (isResizing === "se-new") {
      const x = Math.min(pos.x, dragStart.x);
      const y = Math.min(pos.y, dragStart.y);
      const w = Math.abs(pos.x - dragStart.x);
      const h = Math.abs(pos.y - dragStart.y);
      setCropRect({ x: clamp(x, 0, W), y: clamp(y, 0, H), w: clamp(w, 10, W - x), h: clamp(h, 10, H - y) });
    } else {
      setCropRect(prev => {
        let { x, y, w, h } = prev;
        if (isResizing.includes("e")) w = clamp(pos.x - x, 10, W - x);
        if (isResizing.includes("s")) h = clamp(pos.y - y, 10, H - y);
        if (isResizing.includes("w")) { w = clamp((x + w) - pos.x, 10, x + w); x = clamp(pos.x, 0, x + prev.w - 10); }
        if (isResizing.includes("n")) { h = clamp((y + h) - pos.y, 10, y + h); y = clamp(pos.y, 0, y + prev.h - 10); }
        return { x, y, w, h };
      });
    }
  };

  const onMouseUp = () => { setIsDragging(false); setIsResizing(null); };

  const cursorMap = {
    nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize",
    n: "n-resize", s: "s-resize", w: "w-resize", e: "e-resize",
  };

  // Blue circular handles — iLovePDF style
  const HANDLE_R = 7;
  const handles = cropRect ? [
    { key: "nw", x: cropRect.x, y: cropRect.y },
    { key: "ne", x: cropRect.x + cropRect.w, y: cropRect.y },
    { key: "sw", x: cropRect.x, y: cropRect.y + cropRect.h },
    { key: "se", x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h },
    { key: "n", x: cropRect.x + cropRect.w / 2, y: cropRect.y },
    { key: "s", x: cropRect.x + cropRect.w / 2, y: cropRect.y + cropRect.h },
    { key: "w", x: cropRect.x, y: cropRect.y + cropRect.h / 2 },
    { key: "e", x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h / 2 },
  ] : [];

  return (
    <div className="flex flex-col h-full">
      {/* PDF Canvas area — white bg, clean */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#525659] flex justify-center items-start py-8"
      >
        <div className="relative inline-block shadow-2xl">
          {/* PDF Canvas */}
          <canvas
            ref={canvasRef}
            className="block bg-white"
            style={{
              display: "block",
              cursor: isDragging ? "grabbing" : "crosshair",
              width: "100%",
              height: "auto",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
          />

          {/* Dark overlay outside crop — iLovePDF gray */}
          {cropRect && cropRect.w > 0 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
              viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <mask id="cropMask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect x={cropRect.x} y={cropRect.y} width={cropRect.w} height={cropRect.h} fill="black" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#cropMask)" />
            </svg>
          )}

          {/* Crop border + blue circular handles — iLovePDF style */}
          {cropRect && cropRect.w > 0 && (
            <svg
              className="absolute inset-0"
              style={{
                width: "100%",
                height: "100%",
                cursor: isDragging ? "grabbing" : "default",
                touchAction: "none",
              }}
              viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
              preserveAspectRatio="none"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onMouseDown}
              onTouchMove={onMouseMove}
              onTouchEnd={onMouseUp}
            >
              {/* Crop rectangle border — thin solid blue */}
              <rect
                x={cropRect.x} y={cropRect.y}
                width={cropRect.w} height={cropRect.h}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
              />
              {/* Blue circular handles */}
              {handles.map(h => (
                <circle
                  key={h.key}
                  cx={h.x}
                  cy={h.y}
                  r={HANDLE_R}
                  fill="#2563eb"
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: cursorMap[h.key] }}
                />
              ))}
            </svg>
          )}
        </div>
      </div>

      {/* ── BOTTOM TOOLBAR — iLovePDF style ── */}
      <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5">
        {/* Page nav */}
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

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Zoom out */}
        <button
          onClick={() => setScale(s => Math.max(0.4, +(s - 0.2).toFixed(1)))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        {/* Zoom level */}
        <div className="flex h-8 w-[68px] items-center justify-center rounded border border-slate-300 bg-white text-sm font-semibold text-slate-700">
          {Math.round(scale * 100)}%
        </div>

        {/* Zoom in */}
        <button
          onClick={() => setScale(s => Math.min(2.5, +(s + 0.2).toFixed(1)))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Fit page icon (optional extra, like iLovePDF) */}
        <button
          onClick={() => setScale(1)}
          title="Reset zoom"
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ScanLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CropPdf() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [applyToPages, setApplyToPages] = useState("all");
  const [cropRect, setCropRect] = useState(null);
  const [scale, setScale] = useState(1);

  const file = flow.files?.[0] || null;

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleReset = () => {
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file?.name?.replace(/\.pdf$/i, "") + "-cropped.pdf" || "cropped.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    if (!flow.files?.length) return;
    if (!cropRect || cropRect.w < 10 || cropRect.h < 10) {
      flow.handleError("Please select a crop area first.");
      return;
    }

    flow.startProcessing();
    startProgress();

    try {
      const formData = new FormData();
      flow.files.forEach(f => formData.append("files", f));
      formData.append("applyToPages", applyToPages);
      formData.append("cropX", String(cropRect.x));
      formData.append("cropY", String(cropRect.y));
      formData.append("cropW", String(cropRect.w));
      formData.append("cropH", String(cropRect.h));
      formData.append("scale", String(scale));

      // const res = await fetch("/convert/crop-pdf", { method: "POST", body: formData });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/crop-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to crop PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong");
    }
  };

  return (
    <>
      <Script
        id="howto-schema-crop-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Crop PDF Pages Online for Free",
            description: "Crop and trim PDF pages in 3 quick steps. Upload your file, select the crop area, and download the cropped PDF instantly.",
            url: "https://pdflinx.com/crop-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF file whose pages you want to crop." },
              { "@type": "HowToStep", name: "Select crop area", text: "Drag to select the area you want to keep on each page." },
              { "@type": "HowToStep", name: "Download cropped PDF", text: "Click crop and download your trimmed PDF instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-crop-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Crop PDF", item: "https://pdflinx.com/crop-pdf" }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-crop-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the Crop PDF tool free?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you crop PDF pages online for free with no signup required." }
              },
              {
                "@type": "Question",
                name: "What does Crop PDF do?",
                acceptedAnswer: { "@type": "Answer", text: "Crop PDF removes unwanted outer areas, white margins, and extra space from PDF pages — you select the area to keep and the rest is trimmed." }
              },
              {
                "@type": "Question",
                name: "Can I crop all pages at once?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. You can apply the same crop area to all pages of your PDF in one click." }
              },
              {
                "@type": "Question",
                name: "Will cropping reduce PDF quality?",
                acceptedAnswer: { "@type": "Answer", text: "No. Cropping only trims the visible page area and does not reduce PDF resolution or quality." }
              },
              {
                "@type": "Question",
                name: "Are my files safe?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. All uploaded files are processed securely and deleted automatically after a short time." }
              },
              {
                "@type": "Question",
                name: "Can I crop PDF on mobile?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers without any software installation." }
              }
            ]
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-crop-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Crop PDF - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Crop PDF pages online free — trim margins, remove white borders, or select a custom crop area on any PDF page. No signup, no watermark.",
            url: "https://pdflinx.com/crop-pdf",
            screenshot: "https://pdflinx.com/og-image.png",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Crop PDF pages online",
              "Remove white margins from PDF",
              "Custom crop area selection",
              "Apply crop to all pages",
              "Free online PDF crop tool",
              "No signup required",
              "Secure file processing",
              "Works on mobile and desktop"
            ],
            creator: { "@type": "Organization", name: "PDFLinx" }
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title="Crop PDF Online"
        tagline="Trim Margins · Remove White Space · Resize PDF Pages"
        accept=".pdf,application/pdf"
        multiple={false}
        convertLabel="Crop PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        processingTitle="Cropping PDF..."
        processingDescription="Trimming PDF page areas. Please wait."
        processingStages={["Uploading", "Cropping pages", "Done"]}
        doneTitle="Your cropped PDF is ready"
        doneDescription="Download your trimmed PDF instantly."
        downloadLabel="Download Cropped PDF"
        resetLabel="Crop another PDF"
        sidebarTitle="Crop PDF"
        sidebarIcon={<Crop className="h-5 w-5 text-white" />}
        sidebarDescription="Remove white margins and unwanted areas from PDF pages online."
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                  <Crop className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Crop PDF</h2>
                  <p className="text-xs text-slate-400">
                    {file ? file.name : "Upload a PDF to get started"}
                  </p>
                </div>
              </div>
              {file && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="max-w-[180px] truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {file.name} · {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={() => flow.reset()}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* MAIN WORKSPACE */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px]">

              {/* LEFT: PDF preview with crop overlay + bottom toolbar */}
              <div style={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
                {file ? (
                  <CropCanvas
                    file={file}
                    cropRect={cropRect}
                    setCropRect={setCropRect}
                    applyToPages={applyToPages}
                    scale={scale}
                    setScale={setScale}
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-center bg-[#525659] p-8">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
                        <FileText className="h-8 w-8 text-white/40" />
                      </div>
                      <p className="text-sm font-semibold text-white/60">Upload a PDF to start cropping</p>
                      <p className="mt-1 text-xs text-white/40">Click and drag to select crop area</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR — iLovePDF style */}
              <div className="border-l border-slate-200 bg-white">
                <div
                  className="sticky top-0 overflow-y-auto flex flex-col"
                  style={{ height: "calc(100vh - 140px)" }}
                >
                  {/* Sidebar title */}
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-lg font-bold text-slate-900">Crop PDF</h3>
                  </div>

                  <div className="flex-1 space-y-4 p-5">

                    {/* Info tip — iLovePDF blue */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-700 leading-5">
                        Click and drag to select the area you want to keep. Resize if needed.
                      </p>
                    </div>

                    {/* Reset all — top right aligned like iLovePDF */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset all
                      </button>
                    </div>

                    {/* Pages selector — iLovePDF style */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pages:</p>
                      <div className="flex flex-col gap-2">
                        {[
                          { value: "all", label: "All pages" },
                          { value: "current", label: "Current page" },
                        ].map(opt => (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2.5 cursor-pointer"
                            onClick={() => setApplyToPages(opt.value)}
                          >
                            {/* iLovePDF green radio */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${applyToPages === opt.value
                                ? "border-[#4caf50] bg-[#4caf50]"
                                : "border-slate-300 bg-white"
                                }`}
                            >
                              {applyToPages === opt.value && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-sm text-slate-700">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Selected area info */}
                    {cropRect && cropRect.w > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected area</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>W: <strong className="text-slate-800">{Math.round(cropRect.w)}px</strong></span>
                          <span>H: <strong className="text-slate-800">{Math.round(cropRect.h)}px</strong></span>
                          <span>X: <strong className="text-slate-800">{Math.round(cropRect.x)}px</strong></span>
                          <span>Y: <strong className="text-slate-800">{Math.round(cropRect.y)}px</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA at bottom — iLovePDF style */}
                  <div className="border-t border-slate-100 p-5">
                    <button
                      type="button"
                      onClick={handleConvert}
                      disabled={!file || !cropRect || cropRect.w < 10}
                      className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${file && cropRect && cropRect.w > 10
                        ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-lg shadow-orange-200"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }`}
                    >
                      <span>{file ? "Crop PDF" : "Upload a PDF first"}</span>
                      {file && cropRect && cropRect.w > 10 && (
                        <ArrowRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        // ============================================================
        // CROP PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,

            eyebrow: "CROP PDF PAGES",

            breadcrumbCurrent: "Crop PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            heroTitle: (
              <>
                Crop PDF Pages —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Free, Online, Precise Margins
                </em>
              </>
            ),

            heroDescription:
              "Crop any PDF page online for free. Remove unwanted margins, whitespace, or borders — crop all pages uniformly or each page individually. No signup, no watermark, no software needed. Works on any device.",

            pills: [
              "No watermark",
              "Crop all pages or individual pages",
              "Remove margins & whitespace",
              "Instant download",
            ],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Crop PDF Info",
            noticeItems: [
              "Set crop margins — top, bottom, left, right",
              "Apply to all pages or specific pages",
              "Cropped area removed permanently",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Crop a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, set crop area, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. All pages load instantly so you can see exactly what needs cropping.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Set Your Crop Area",
                desc: "Drag the crop handles to define the area you want to keep, or enter precise margin values for top, bottom, left, and right. Apply the same crop to all pages or set different crops per page.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Cropped PDF",
                desc: "Click Crop and your trimmed PDF is ready in seconds. The defined crop area is applied permanently — all unwanted margins and whitespace removed cleanly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Cropping Tool Online",

            seoBadge: "Crop PDF Guide",
            seoTitle: "Complete Guide to Cropping PDF Pages Online",
            seoDescription:
              "Everything you need to know about cropping PDF pages — remove margins, whitespace, and borders free online. Crop all pages or individual pages. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Cropper — Remove Margins, Whitespace & Borders from Any PDF Online",
                text: "Need to crop a PDF? PDFLinx lets you crop PDF pages online for free — instantly and without any software installation. Whether you need to remove large white margins from a scanned document, trim borders from a PDF book, cut out a specific region of a page, or resize pages to a custom dimension, PDFLinx handles it precisely in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "Why You Might Need to Crop a PDF",
                text: "PDF cropping is needed more often than most people realize. Scanned documents frequently have large uneven white margins from the scanner bed that waste space and look unprofessional. PDF books and academic papers often have wide margins and headers or footers with page references that are not needed when the content is extracted for a specific use. Presentation slides exported as PDF sometimes have oversized borders around each slide. Technical drawings and architectural plans often have title block borders that need to be removed when sharing just the drawing content. In all these cases, cropping gives you a clean, properly sized page.",
              },
              {
                title: "Crop All Pages Uniformly vs Crop Individual Pages",
                text: "PDFLinx gives you two cropping modes for maximum flexibility. Uniform cropping applies the same margin trim to every page in the PDF — ideal for scanned documents or books where all pages have consistent oversized margins. Individual page cropping lets you set different crop areas for different pages — useful for mixed-content PDFs where different pages have different layouts or different amounts of whitespace to remove. Both modes show you a live preview so you can verify the crop before applying.",
              },
              {
                title: "Precise Margin Control — Top, Bottom, Left, Right",
                text: "Unlike simple screenshot-based cropping that clips at arbitrary points, PDFLinx gives you precise numeric margin control. Enter exact values in millimeters or points for each side — top, bottom, left, and right — independently. This means you can remove only the bottom margin without touching the top, trim just the left side without affecting the right, or set asymmetric crops for specific layout requirements. Precise control is essential for professional document preparation, print-ready PDF output, and consistent formatting across a document series.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Cropper — No Watermark, No Limits",
                text: "Most free PDF cropping tools produce low-quality output, add watermarks, restrict the number of pages, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict advanced page editing on free tiers, PDFLinx gives you precise, professional PDF cropping at zero cost.",
              },
              {
                title: "Common Use Cases for Cropping a PDF",
                text: "✓ Scanned Documents: Remove large scanner bed margins from scanned pages to produce clean, tight document scans.\n✓ PDF Books & Articles: Trim wide headers, footers, and page number areas from academic PDFs and ebooks for cleaner reading or extraction.\n✓ Presentation Slides: Remove thick borders around slides in PDF presentations to make slide content fill the full page.\n✓ Technical Drawings: Crop title blocks and borders from engineering drawings or floor plans when sharing just the drawing area.\n✓ Print Preparation: Trim bleed areas and crop marks from print-ready PDFs before final distribution.\n✓ Content Extraction: Crop to isolate a specific region of a page — a chart, table, diagram, or image — without removing the page from the document.",
              },
              {
                title:
                  "Crop PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app — the crop tool works on touchscreens with drag handles. On Mac or Windows, drag and drop your PDF and download the cropped file in seconds. PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title: "Does Cropping a PDF Reduce File Size?",
                text: "Cropping a PDF reduces the visible page area but does not always reduce the file size as dramatically as you might expect. In standard PDFs, content outside the crop area is hidden rather than deleted from the file structure — meaning the underlying data may still exist in the file. For significant file size reduction, use our free PDF Compress tool after cropping. For scanned PDFs where each page is an image, cropping that removes large whitespace areas does result in a meaningfully smaller file.",
              },
              {
                title: "Crop PDF vs Edit PDF — What is the Difference?",
                text: "Cropping a PDF changes the visible page dimensions — trimming away the outer areas of each page to remove margins, borders, or whitespace. Editing a PDF adds new content on top of existing pages — text boxes, highlights, shapes, and annotations. If you need to change the size and shape of pages by removing their outer edges, use Crop PDF. If you need to add or annotate content on the pages, use our free Edit PDF tool. Both are free on PDFLinx.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF cropping tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of pages you crop or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and crop it instantly — no email, no registration, no friction.",
              },
              {
                q: "Can I crop all pages of a PDF with the same settings?",
                a: "Yes. Apply the same crop margins to all pages at once — ideal for scanned documents and books with consistent oversized margins throughout.",
              },
              {
                q: "Can I crop individual pages differently?",
                a: "Yes. Set different crop areas for different pages in the same session — useful for mixed-content PDFs where different pages need different cropping.",
              },
              {
                q: "How do I set the crop area?",
                a: "Drag the crop handles on the page preview to define the area you want to keep, or enter precise margin values for top, bottom, left, and right sides independently.",
              },
              {
                q: "Is the crop permanent in the output PDF?",
                a: "Yes. The crop is applied permanently — the defined page area is what every page shows in all PDF viewers after download.",
              },
              {
                q: "Will cropping reduce the file size of my PDF?",
                a: "It depends on the PDF type. For scanned PDFs where pages are images, removing large whitespace areas reduces file size meaningfully. For standard PDFs, cropping hides content at the edges but may not reduce file size significantly — use our PDF Compress tool for that.",
              },
              {
                q: "Can I crop a PDF to a specific page size — like A4 or Letter?",
                a: "Yes. Enter the exact margin values needed to trim the page to your required dimensions — useful for standardizing mixed-size pages in a single PDF.",
              },
              {
                q: "Does PDFLinx add any watermark to the cropped PDF?",
                a: "No watermarks, ever. Your cropped PDF is 100% clean and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — the crop handles work on touchscreens too. No app needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting first using our free PDF Split tool, crop each part, then merge them back.",
              },
              {
                q: "Can I crop a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then crop the pages.",
              },
              {
                q: "What is the difference between Crop PDF and Edit PDF?",
                a: "Crop PDF trims the outer dimensions of pages — removing margins and whitespace. Edit PDF adds new content on top of existing pages. Use Crop to resize pages, use Edit to annotate or add content.",
              },
              {
                q: "How long does PDF cropping take?",
                a: "Most operations complete within 5 to 15 seconds depending on file size and number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for cropping PDFs?",
                a: "Yes — PDFLinx offers precise margin control with no watermark, no daily limits, and no account required. iLovePDF and Smallpdf restrict advanced page editing behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Crop your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, precise PDF page cropping every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />

      <RelatedToolsSection />
    </>
  );
}
































// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import {
//   Crop,
//   Download,
//   ShieldCheck,
//   MonitorSmartphone,
//   CheckCircle,
//   Move,
//   ScanLine,
//   Info,
//   RotateCcw,
//   FileText,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import Script from "next/script";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// // ── Crop Selection Component ──────────────────────────────────────────────────
// function CropCanvas({ file, cropRect, setCropRect, applyToPages, scale, setScale }) {
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);
//   const [pdfPage, setPdfPage] = useState(null);
//   const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pdfDocRef = useRef(null);

//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

//   // Load PDF
//   useEffect(() => {
//     if (!file) return;
//     let cancelled = false;
//     let tries = 0;

//     const load = async () => {
//       const lib = window?.pdfjsLib;
//       if (!lib) {
//         if (tries++ < 80) return setTimeout(load, 100);
//         return;
//       }
//       try {
//         const buf = await file.arrayBuffer();
//         const doc = await lib.getDocument({ data: buf }).promise;
//         if (cancelled) return;
//         pdfDocRef.current = doc;
//         setTotalPages(doc.numPages);
//         const page = await doc.getPage(1);
//         if (cancelled) return;
//         setPdfPage(page);
//       } catch (e) { console.error(e); }
//     };

//     // Jab parent se reset signal aaye (w===0) tab reinitialize
//     // useEffect(() => {
//     //   if (!cropRect || cropRect.w !== 0) return;
//     //   if (canvasSize.w === 0) return;
//     //   const pad = 0.05;
//     //   setCropRect({
//     //     x: canvasSize.w * pad,
//     //     y: canvasSize.h * pad,
//     //     w: canvasSize.w * (1 - pad * 2),
//     //     h: canvasSize.h * (1 - pad * 2),
//     //   });
//     // }, [cropRect, canvasSize]);

//     load();
//     return () => { cancelled = true; };
//   }, [file]);

//   useEffect(() => {
//     if (!cropRect || cropRect.w !== 0) return;
//     if (canvasSize.w === 0) return;
//     const pad = 0.05;
//     setCropRect({
//       x: canvasSize.w * pad,
//       y: canvasSize.h * pad,
//       w: canvasSize.w * (1 - pad * 2),
//       h: canvasSize.h * (1 - pad * 2),
//     });
//   }, [cropRect, canvasSize]);


//   // Change page
//   useEffect(() => {
//     if (!pdfDocRef.current) return;
//     pdfDocRef.current.getPage(currentPage).then(setPdfPage);
//   }, [currentPage]);

//   // Render PDF on canvas
//   useEffect(() => {
//     if (!pdfPage || !canvasRef.current) return;
//     const viewport = pdfPage.getViewport({ scale });
//     const canvas = canvasRef.current;
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;
//     setCanvasSize({ w: viewport.width, h: viewport.height });

//     const ctx = canvas.getContext("2d");
//     pdfPage.render({ canvasContext: ctx, viewport });

//     // Init crop rect to center 60%
//     // if (!cropRect || (cropRect.w === 0 && cropRect.h === 0)) {
//     //   const pad = 0.15;
//     //   setCropRect({
//     //     x: viewport.width * pad,
//     //     y: viewport.height * pad,
//     //     w: viewport.width * (1 - pad * 2),
//     //     h: viewport.height * (1 - pad * 2),
//     //   });
//     // }

//     // Init crop rect to full page minus padding
//     const pad = 0.05;
//     setCropRect({
//       x: viewport.width * pad,
//       y: viewport.height * pad,
//       w: viewport.width * (1 - pad * 2),
//       h: viewport.height * (1 - pad * 2),
//     });


//   }, [pdfPage, scale]);

//   // Get pointer position relative to canvas
//   // const getPos = (e) => {
//   //   const canvas = canvasRef.current;
//   //   if (!canvas) return { x: 0, y: 0 };
//   //   const rect = canvas.getBoundingClientRect();
//   //   const scaleX = canvas.width / rect.width;
//   //   const scaleY = canvas.height / rect.height;
//   //   const cx = e.touches ? e.touches[0].clientX : e.clientX;
//   //   const cy = e.touches ? e.touches[0].clientY : e.clientY;
//   //   return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
//   // };


//   const getPos = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();
//     // canvas.width = native pixels, rect.width = displayed pixels
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const cx = e.touches ? e.touches[0].clientX : e.clientX;
//     const cy = e.touches ? e.touches[0].clientY : e.clientY;
//     const x = (cx - rect.left) * scaleX;
//     const y = (cy - rect.top) * scaleY;
//     return { x, y };
//   };


//   // Hit test resize handles
//   const getHandle = (pos, rect) => {
//     const HIT = 16;
//     const corners = {
//       "nw": { x: rect.x, y: rect.y },
//       "ne": { x: rect.x + rect.w, y: rect.y },
//       "sw": { x: rect.x, y: rect.y + rect.h },
//       "se": { x: rect.x + rect.w, y: rect.y + rect.h },
//       "n": { x: rect.x + rect.w / 2, y: rect.y },
//       "s": { x: rect.x + rect.w / 2, y: rect.y + rect.h },
//       "w": { x: rect.x, y: rect.y + rect.h / 2 },
//       "e": { x: rect.x + rect.w, y: rect.y + rect.h / 2 },
//     };
//     for (const [key, p] of Object.entries(corners)) {
//       if (Math.abs(pos.x - p.x) < HIT && Math.abs(pos.y - p.y) < HIT) return key;
//     }
//     return null;
//   };

//   const isInsideRect = (pos, rect) =>
//     pos.x > rect.x && pos.x < rect.x + rect.w &&
//     pos.y > rect.y && pos.y < rect.y + rect.h;

//   const onMouseDown = (e) => {
//     e.preventDefault();
//     const pos = getPos(e);
//     const handle = getHandle(pos, cropRect);
//     if (handle) {
//       setIsResizing(handle);
//     } else if (isInsideRect(pos, cropRect)) {
//       setIsDragging(true);
//       setDragStart({ x: pos.x - cropRect.x, y: pos.y - cropRect.y });
//     } else {
//       // Start new crop
//       setCropRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
//       setIsDragging(false);
//       setIsResizing("se-new");
//       setDragStart({ x: pos.x, y: pos.y });
//     }
//   };

//   const onMouseMove = (e) => {
//     if (!isDragging && !isResizing) return;
//     e.preventDefault();
//     const pos = getPos(e);
//     const W = canvasSize.w, H = canvasSize.h;

//     if (isDragging) {
//       setCropRect(prev => ({
//         ...prev,
//         x: clamp(pos.x - dragStart.x, 0, W - prev.w),
//         y: clamp(pos.y - dragStart.y, 0, H - prev.h),
//       }));
//     } else if (isResizing === "se-new") {
//       const x = Math.min(pos.x, dragStart.x);
//       const y = Math.min(pos.y, dragStart.y);
//       const w = Math.abs(pos.x - dragStart.x);
//       const h = Math.abs(pos.y - dragStart.y);
//       setCropRect({ x: clamp(x, 0, W), y: clamp(y, 0, H), w: clamp(w, 10, W - x), h: clamp(h, 10, H - y) });
//     } else {
//       // Handle resize
//       setCropRect(prev => {
//         let { x, y, w, h } = prev;
//         if (isResizing.includes("e")) w = clamp(pos.x - x, 10, W - x);
//         if (isResizing.includes("s")) h = clamp(pos.y - y, 10, H - y);
//         if (isResizing.includes("w")) { w = clamp((x + w) - pos.x, 10, x + w); x = clamp(pos.x, 0, x + prev.w - 10); }
//         if (isResizing.includes("n")) { h = clamp((y + h) - pos.y, 10, y + h); y = clamp(pos.y, 0, y + prev.h - 10); }
//         return { x, y, w, h };
//       });
//     }
//   };

//   const onMouseUp = () => { setIsDragging(false); setIsResizing(null); };

//   const resetCrop = () => {
//     const pad = 0.15;
//     setCropRect({
//       x: canvasSize.w * pad,
//       y: canvasSize.h * pad,
//       w: canvasSize.w * (1 - pad * 2),
//       h: canvasSize.h * (1 - pad * 2),
//     });
//   };

//   const HANDLE_SIZE = 8;
//   const handles = cropRect ? [
//     { key: "nw", x: cropRect.x, y: cropRect.y },
//     { key: "ne", x: cropRect.x + cropRect.w, y: cropRect.y },
//     { key: "sw", x: cropRect.x, y: cropRect.y + cropRect.h },
//     { key: "se", x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h },
//     { key: "n", x: cropRect.x + cropRect.w / 2, y: cropRect.y },
//     { key: "s", x: cropRect.x + cropRect.w / 2, y: cropRect.y + cropRect.h },
//     { key: "w", x: cropRect.x, y: cropRect.y + cropRect.h / 2 },
//     { key: "e", x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h / 2 },
//   ] : [];

//   const cursorMap = { nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize", n: "n-resize", s: "s-resize", w: "w-resize", e: "e-resize" };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Preview toolbar */}
//       <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
//         <div>
//           <h3 className="text-sm font-bold text-slate-800">PDF Preview</h3>
//           <p className="text-xs text-slate-400">Click and drag to select the area you want to keep</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setScale(s => Math.max(0.4, +(s - 0.2).toFixed(1)))}
//             className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition">
//             <ZoomOut className="h-4 w-4" />
//           </button>
//           <div className="min-w-[60px] rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold text-slate-700">
//             {Math.round(scale * 100)}%
//           </div>
//           <button onClick={() => setScale(s => Math.min(2.5, +(s + 0.2).toFixed(1)))}
//             className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition">
//             <ZoomIn className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Canvas area */}
//       <div ref={containerRef} className="flex-1 overflow-auto bg-[#eef1f6] p-8 flex justify-center">
//         <div className="relative inline-block shadow-2xl">
//           {/* PDF Canvas */}
//           {/* <canvas
//             ref={canvasRef}
//             className="block bg-white"
//             style={{ display: "block", cursor: "crosshair" }}
//             onMouseDown={onMouseDown}
//             onMouseMove={onMouseMove}
//             onMouseUp={onMouseUp}
//             onMouseLeave={onMouseUp}
//             onTouchStart={onMouseDown}
//             onTouchMove={onMouseMove}
//             onTouchEnd={onMouseUp}
//           /> */}

//           <canvas
//             ref={canvasRef}
//             className="block bg-white"
//             style={{ display: "block", cursor: isDragging ? "grabbing" : isResizing ? "crosshair" : "crosshair", width: "100%", height: "auto" }}
//             onMouseDown={onMouseDown}
//             onMouseMove={onMouseMove}
//             onMouseUp={onMouseUp}
//             onMouseLeave={onMouseUp}
//             onTouchStart={onMouseDown}
//             onTouchMove={onMouseMove}
//             onTouchEnd={onMouseUp}
//           />

//           {/* Dark overlay outside crop */}
//           {cropRect && cropRect.w > 0 && (
//             <svg
//               className="absolute inset-0 pointer-events-none"
//               style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
//               // style={{ width: "100%", height: "100%" }}
//               viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
//               // preserveAspectRatio="none"
//               preserveAspectRatio="xMidYMid meet"

//             >
//               <defs>
//                 <mask id="cropMask">
//                   <rect width="100%" height="100%" fill="white" />
//                   <rect x={cropRect.x} y={cropRect.y} width={cropRect.w} height={cropRect.h} fill="black" />
//                 </mask>
//               </defs>
//               <rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask="url(#cropMask)" />
//             </svg>
//           )}

//           {/* Crop border + handles */}
//           {cropRect && cropRect.w > 0 && (
//             <svg
//               className="absolute inset-0"
//               style={{ width: "100%", height: "100%", cursor: isDragging ? "grabbing" : "default", touchAction: "none" }}
//               viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
//               preserveAspectRatio="none"
//               onMouseDown={onMouseDown}
//               onMouseMove={onMouseMove}
//               onMouseUp={onMouseUp}
//               onMouseLeave={onMouseUp}
//               onTouchStart={onMouseDown}
//               onTouchMove={onMouseMove}
//               onTouchEnd={onMouseUp}
//             >
//               {/* Crop rectangle border */}
//               <rect
//                 x={cropRect.x} y={cropRect.y}
//                 width={cropRect.w} height={cropRect.h}
//                 fill="none" stroke="#f24d0d" strokeWidth="2"
//                 strokeDasharray="6 3"
//               />
//               {/* Corner lines */}
//               {[
//                 // top-left
//                 [cropRect.x, cropRect.y, cropRect.x + 20, cropRect.y],
//                 [cropRect.x, cropRect.y, cropRect.x, cropRect.y + 20],
//                 // top-right
//                 [cropRect.x + cropRect.w - 20, cropRect.y, cropRect.x + cropRect.w, cropRect.y],
//                 [cropRect.x + cropRect.w, cropRect.y, cropRect.x + cropRect.w, cropRect.y + 20],
//                 // bottom-left
//                 [cropRect.x, cropRect.y + cropRect.h - 20, cropRect.x, cropRect.y + cropRect.h],
//                 [cropRect.x, cropRect.y + cropRect.h, cropRect.x + 20, cropRect.y + cropRect.h],
//                 // bottom-right
//                 [cropRect.x + cropRect.w - 20, cropRect.y + cropRect.h, cropRect.x + cropRect.w, cropRect.y + cropRect.h],
//                 [cropRect.x + cropRect.w, cropRect.y + cropRect.h - 20, cropRect.x + cropRect.w, cropRect.y + cropRect.h],
//               ].map(([x1, y1, x2, y2], i) => (
//                 <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f24d0d" strokeWidth="3" strokeLinecap="round" />
//               ))}
//               {/* Resize handles */}
//               {handles.map(h => (
//                 <rect
//                   key={h.key}
//                   x={h.x - HANDLE_SIZE / 2} y={h.y - HANDLE_SIZE / 2}
//                   width={HANDLE_SIZE} height={HANDLE_SIZE}
//                   fill="white" stroke="#f24d0d" strokeWidth="2" rx="2"
//                   style={{ cursor: cursorMap[h.key] }}
//                 />
//               ))}
//             </svg>
//           )}
//         </div>
//       </div>

//       {/* Page navigator */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
//           <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
//             className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 font-bold transition">
//             ‹
//           </button>
//           <span className="text-sm font-semibold text-slate-700">
//             Page {currentPage} / {totalPages}
//           </span>
//           <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
//             className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 font-bold transition">
//             ›
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// export default function CropPdf() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [applyToPages, setApplyToPages] = useState("all"); // "all" | "current"
//   const [cropRect, setCropRect] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [canvasNativeSize, setCanvasNativeSize] = useState({ w: 0, h: 0 });

//   const file = flow.files?.[0] || null;

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   // const handleReset = () => {
//   //   setCropRect(null);
//   // };


//   const handleReset = () => {
//     setCropRect({ x: 0, y: 0, w: 0, h: 0 });
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = file?.name?.replace(/\.pdf$/i, "") + "-cropped.pdf" || "cropped.pdf";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleConvert = async () => {
//     if (!flow.files?.length) return;
//     if (!cropRect || cropRect.w < 10 || cropRect.h < 10) {
//       flow.handleError("Please select a crop area first.");
//       return;
//     }

//     flow.startProcessing();
//     startProgress();

//     try {
//       const formData = new FormData();
//       flow.files.forEach(f => formData.append("files", f));
//       formData.append("applyToPages", applyToPages);
//       // Send crop as percentage of canvas for backend
//       formData.append("cropX", String(cropRect.x));
//       formData.append("cropY", String(cropRect.y));
//       formData.append("cropW", String(cropRect.w));
//       formData.append("cropH", String(cropRect.h));
//       formData.append("scale", String(scale));

//       const res = await fetch("/convert/crop-pdf", { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Failed to crop PDF");

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       console.error(err);
//       cancelProgress();
//       flow.handleError("Something went wrong");
//     }
//   };

//   return (
//     <>
//       <Script
//         id="faq-schema-crop-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "What does Crop PDF do?", acceptedAnswer: { "@type": "Answer", text: "Crop PDF removes unwanted outer areas, white margins, and extra space from PDF pages online." } },
//               { "@type": "Question", name: "Can I crop PDF pages online for free?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can crop PDF pages online directly in your browser without installing software." } },
//               { "@type": "Question", name: "Will cropping reduce PDF quality?", acceptedAnswer: { "@type": "Answer", text: "No. Cropping only trims visible page areas and does not reduce PDF quality." } },
//             ],
//           }),
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
//         title="Crop PDF Online"
//         tagline="Trim Margins · Remove White Space · Resize PDF Pages"
//         accept=".pdf,application/pdf"
//         multiple={false}
//         convertLabel="Crop PDF"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         processingTitle="Cropping PDF..."
//         processingDescription="Trimming PDF page areas. Please wait."
//         processingStages={["Uploading", "Cropping pages", "Done"]}
//         doneTitle="Your cropped PDF is ready"
//         doneDescription="Download your trimmed PDF instantly."
//         downloadLabel="Download Cropped PDF"
//         resetLabel="Crop another PDF"
//         sidebarTitle="Crop PDF"
//         sidebarIcon={<Crop className="h-5 w-5 text-white" />}
//         sidebarDescription="Remove white margins and unwanted areas from PDF pages online."
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF supported"

//         customOptionsLayout={
//           <div
//             className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f3f5f9] shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
//             style={{ minHeight: "calc(100vh - 120px)" }}
//           >
//             {/* TOP TOOLBAR */}
//             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f24d0d] text-white shadow-lg">
//                   <Crop className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-slate-900">Crop PDF</h2>
//                   <p className="text-xs text-slate-500">
//                     {file ? file.name : "Click and drag to select crop area"}
//                   </p>
//                 </div>
//               </div>
//               {file && (
//                 <div className="hidden md:flex items-center gap-3">
//                   <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
//                     <FileText className="w-4 h-4 text-slate-400" />
//                     <span className="max-w-[200px] truncate text-xs font-semibold text-slate-600">{file.name}</span>
//                     <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
//                   </div>
//                   <button onClick={() => flow.reset()}
//                     className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
//                     Remove
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* MAIN WORKSPACE */}
//             <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]">

//               {/* LEFT: PDF with crop overlay */}
//               <div style={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
//                 {file ? (
//                   <CropCanvas
//                     file={file}
//                     cropRect={cropRect}
//                     setCropRect={setCropRect}
//                     applyToPages={applyToPages}
//                     scale={scale}
//                     setScale={setScale}
//                   />
//                 ) : (
//                   <div className="flex flex-1 items-center justify-center bg-[#eef1f6] p-8">
//                     <div className="text-center">
//                       <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
//                         <FileText className="h-8 w-8 text-slate-300" />
//                       </div>
//                       <p className="text-sm font-semibold text-slate-500">Upload a PDF to start cropping</p>
//                       <p className="mt-1 text-xs text-slate-400">Click and drag on the preview to select crop area</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* RIGHT SIDEBAR — iLovePDF style */}
//               <div className="border-l border-slate-200 bg-white">
//                 <div className="sticky top-0 overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>

//                   {/* Sidebar header */}
//                   <div className="border-b border-slate-100 px-5 py-5">
//                     <h3 className="text-lg font-bold text-slate-900">Crop PDF</h3>
//                   </div>

//                   <div className="space-y-4 p-5">

//                     {/* iLovePDF-style info tip */}
//                     <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
//                       <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
//                       <p className="text-xs text-blue-700 leading-5">
//                         Click and drag to select the area you want to keep. Resize if needed.
//                       </p>
//                     </div>

//                     {/* Reset all */}
//                     <button
//                       type="button"
//                       onClick={handleReset}
//                       className="flex items-center gap-2 text-sm font-semibold text-[#f24d0d] hover:underline transition ml-auto"
//                     >
//                       <RotateCcw className="w-4 h-4" />
//                       Reset all
//                     </button>

//                     {/* Pages option — iLovePDF style */}
//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Pages:
//                       </label>
//                       <div className="flex gap-4">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <div
//                             onClick={() => setApplyToPages("all")}
//                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${applyToPages === "all"
//                               ? "border-[#f24d0d] bg-[#f24d0d]"
//                               : "border-slate-300 bg-white"
//                               }`}
//                           >
//                             {applyToPages === "all" && (
//                               <div className="w-2 h-2 rounded-full bg-white" />
//                             )}
//                           </div>
//                           <span className="text-sm font-medium text-slate-700">All pages</span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <div
//                             onClick={() => setApplyToPages("current")}
//                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${applyToPages === "current"
//                               ? "border-[#f24d0d] bg-[#f24d0d]"
//                               : "border-slate-300 bg-white"
//                               }`}
//                           >
//                             {applyToPages === "current" && (
//                               <div className="w-2 h-2 rounded-full bg-white" />
//                             )}
//                           </div>
//                           <span className="text-sm font-medium text-slate-700">Current page</span>
//                         </label>
//                       </div>
//                     </div>

//                     {/* Crop area info */}
//                     {cropRect && cropRect.w > 0 && (
//                       <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 space-y-1.5">
//                         <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Selected area</p>
//                         <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
//                           <span>Width: <strong>{Math.round(cropRect.w)}px</strong></span>
//                           <span>Height: <strong>{Math.round(cropRect.h)}px</strong></span>
//                           <span>X: <strong>{Math.round(cropRect.x)}px</strong></span>
//                           <span>Y: <strong>{Math.round(cropRect.y)}px</strong></span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Security */}
//                     <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
//                       <div className="flex items-start gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
//                           <ShieldCheck className="h-4 w-4" />
//                         </div>
//                         <div>
//                           <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
//                           <p className="mt-0.5 text-xs leading-5 text-slate-500">
//                             Files are encrypted and auto-deleted after processing.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* CTA */}
//                     <button
//                       type="button"
//                       onClick={handleConvert}
//                       disabled={!file || !cropRect || cropRect.w < 10}
//                       className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${file && cropRect && cropRect.w > 10
//                         ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_12px_32px_rgba(242,77,13,0.38)]"
//                         : "cursor-not-allowed bg-slate-200 text-slate-400"
//                         }`}
//                     >
//                       <span className="flex items-center justify-center gap-2">
//                         <Crop className="h-5 w-5" />
//                         {file ? "Crop PDF" : "Upload a PDF first"}
//                       </span>
//                     </button>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         }

//         uploadLanding={{
//           content: {
//             eyebrow: "CROP PDF",
//             heroTitle: (
//               <>
//                 Crop PDF Pages <br />
//                 <em className="font-bold not-italic text-[#e8420a] sm:italic">online instantly</em>
//               </>
//             ),
//             heroDescription:
//               "Crop PDF online for free. Remove white margins, trim page edges, and resize visible page areas directly in your browser without installing software.",
//             noticeTitle: "Crop PDF features",
//             noticeItems: ["Remove white margins", "Trim unwanted page areas", "Preserve PDF quality"],
//             howToTitle: "How to crop a PDF",
//             howToSubtitle: "Upload your PDF, drag to select crop area, and download instantly.",
//             howToSteps: [
//               { n: "1", title: "Upload your PDF", desc: "Select your PDF file from your device.", color: "bg-blue-600" },
//               { n: "2", title: "Drag to select crop area", desc: "Click and drag on the PDF preview to select the area you want to keep.", color: "bg-purple-600" },
//               { n: "3", title: "Download cropped PDF", desc: "Save your cleaned and trimmed PDF instantly.", color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why use PDFLinx Crop PDF?",
//             whyItems: [
//               { title: "Remove White Margins", desc: "Clean up scanned PDFs and remove extra outer white space.", icon: Crop, iconColor: "text-orange-500", bgColor: "bg-orange-100" },
//               { title: "Preserve Quality", desc: "Cropping does not reduce PDF quality or text sharpness.", icon: CheckCircle, iconColor: "text-green-600", bgColor: "bg-green-100" },
//               { title: "Fast Online Tool", desc: "Crop PDFs directly in your browser with instant processing.", icon: Download, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
//               { title: "Works on Any Device", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
//               { title: "Private & Secure", desc: "Files are securely processed and automatically deleted.", icon: ShieldCheck, iconColor: "text-emerald-600", bgColor: "bg-emerald-100" },
//             ],
//             seoBadge: "PDF Crop Tool",
//             seoTitle: "Crop PDF Online Free",
//             seoDescription: "Remove white margins and unwanted page areas from PDF files online for free. Crop PDFs instantly with no watermark or signup required.",
//             seoSections: [
//               { title: "Remove White Margins from PDFs", text: "Trim unwanted white space and empty page borders from scanned and digital PDF files instantly." },
//               { title: "Crop PDF Pages Online", text: "Resize visible page areas and remove unnecessary content while preserving original quality." },
//               { title: "Perfect for Scanned Documents", text: "Clean scanned PDFs by trimming uneven edges and unwanted page borders." },
//               { title: "No Software Installation Needed", text: "Crop PDFs directly inside your browser on desktop and mobile devices." },
//             ],
//             faqTitle: "Frequently asked questions",
//             faqs: [
//               { q: "What does Crop PDF do?", a: "Crop PDF removes unwanted outer areas, white margins, and extra space from PDF pages online." },
//               { q: "Can I crop PDF pages online for free?", a: "Yes. You can crop PDF pages online directly in your browser without installing software." },
//               { q: "Will cropping reduce PDF quality?", a: "No. Cropping only trims visible page areas and does not reduce PDF quality." },
//               { q: "Can I remove white margins from scanned PDFs?", a: "Yes. PDFLinx can trim white borders and clean scanned documents instantly." },
//               { q: "Does Crop PDF work on mobile?", a: "Yes. Crop PDF works on Android, iPhone, tablets, and desktop browsers." },
//               { q: "Are my uploaded PDFs secure?", a: "Yes. Files are encrypted during upload and automatically deleted after processing." },
//             ],
//           },
//         }}
//       />

//       <RelatedToolsSection />
//     </>
//   );
// }


























// // "use client";

// // import { useState, useRef, useEffect } from "react";

// // import {
// //   Crop,
// //   Download,
// //   ShieldCheck,
// //   MonitorSmartphone,
// //   CheckCircle,
// //   Move,
// //   ScanLine,
// //   Trash2,
// // } from "lucide-react";

// // import Script from "next/script";

// // import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // import { useToolFlow } from "@/hooks/useToolFlow";
// // import { useProgressBar } from "@/hooks/useProgressBar";

// // import {
// //   DEFAULT_DONE_LINKS,
// //   DEFAULT_SIDEBAR_FEATURES,
// // } from "@/lib/toolUiConfig";

// // function PdfThumbnail({ url }) {
// //   const canvasRef = useRef(null);

// //   useEffect(() => {
// //     if (!url || !window.pdfjsLib) return;

// //     const tryRender = () => {
// //       if (!window.pdfjsLib) return setTimeout(tryRender, 100);

// //       window.pdfjsLib
// //         .getDocument(url)
// //         .promise.then((pdf) => pdf.getPage(1))
// //         .then((page) => {
// //           const viewport = page.getViewport({ scale: 0.6 });

// //           const canvas = canvasRef.current;

// //           if (!canvas) return;

// //           canvas.width = viewport.width;
// //           canvas.height = viewport.height;

// //           page.render({
// //             canvasContext: canvas.getContext("2d"),
// //             viewport,
// //           });
// //         })
// //         .catch(console.error);
// //     };

// //     tryRender();
// //   }, [url]);

// //   return (
// //     <canvas
// //       ref={canvasRef}
// //       className="h-full w-full object-contain bg-white"
// //     />
// //   );
// // }

// // export default function CropPdf() {
// //   const flow = useToolFlow();

// //   const {
// //     progress,
// //     startProgress,
// //     completeProgress,
// //     cancelProgress,
// //   } = useProgressBar();

// //   const [downloadUrl, setDownloadUrl] = useState(null);

// //   const [cropMode, setCropMode] = useState("custom");

// //   const handleRemoveFile = (index) => {
// //     const updated = flow.files.filter((_, i) => i !== index);

// //     if (updated.length === 0) flow.reset();
// //     else flow.selectFiles(updated);
// //   };

// //   const handleDownload = () => {
// //     if (!downloadUrl) return;

// //     const a = document.createElement("a");

// //     a.href = downloadUrl;
// //     a.download = "cropped.pdf";

// //     document.body.appendChild(a);

// //     a.click();

// //     a.remove();
// //   };

// //   const handleConvert = async () => {
// //     if (!flow.files?.length) return;

// //     flow.startProcessing();

// //     startProgress();

// //     try {
// //       const formData = new FormData();

// //       flow.files.forEach((file) => {
// //         formData.append("files", file);
// //       });

// //       formData.append("cropMode", cropMode);

// //       const res = await fetch("/convert/crop-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         throw new Error("Failed to crop PDF");
// //       }

// //       const blob = await res.blob();

// //       const url = URL.createObjectURL(blob);

// //       setDownloadUrl(url);

// //       completeProgress();

// //       flow.finishSuccess();
// //     } catch (err) {
// //       console.error(err);

// //       cancelProgress();

// //       flow.handleError("Something went wrong");
// //     }
// //   };

// //   return (
// //     <>
// //       {/* ================= SEO ================= */}

// //       <Script
// //         id="faq-schema-crop-pdf"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "FAQPage",
// //             mainEntity: [
// //               {
// //                 "@type": "Question",
// //                 name: "What does Crop PDF do?",
// //                 acceptedAnswer: {
// //                   "@type": "Answer",
// //                   text: "Crop PDF removes unwanted outer areas, white margins, and extra space from PDF pages online.",
// //                 },
// //               },
// //               {
// //                 "@type": "Question",
// //                 name: "Can I crop PDF pages online for free?",
// //                 acceptedAnswer: {
// //                   "@type": "Answer",
// //                   text: "Yes. You can crop PDF pages online directly in your browser without installing software.",
// //                 },
// //               },
// //               {
// //                 "@type": "Question",
// //                 name: "Will cropping reduce PDF quality?",
// //                 acceptedAnswer: {
// //                   "@type": "Answer",
// //                   text: "No. Cropping only trims visible page areas and does not reduce PDF quality.",
// //                 },
// //               },
// //             ],
// //           }),
// //         }}
// //       />

// //       {/* ================= UI ================= */}

// //       <ToolPageLayout
// //         title="Crop PDF Online"
// //         tagline="Trim Margins · Remove White Space · Resize PDF Pages"
// //         accept=".pdf,application/pdf"
// //         multiple={false}
// //         convertLabel="Crop PDF"
// //         flow={flow}
// //         progress={progress}
// //         onRemoveFile={handleRemoveFile}
// //         onConvert={handleConvert}
// //         onDownload={handleDownload}
// //         doneLinks={DEFAULT_DONE_LINKS}
// //         showOutputFormat={false}
// //         showPreserveLayout={false}
// //         optionsTitle="Crop options"

// //         processingTitle="Cropping PDF..."
// //         processingDescription="Trimming PDF page areas. Please wait."

// //         processingStages={[
// //           "Uploading",
// //           "Cropping pages",
// //           "Done",
// //         ]}

// //         doneTitle="Your cropped PDF is ready"

// //         doneDescription="Download your trimmed PDF instantly."

// //         downloadLabel="Download Cropped PDF"

// //         resetLabel="Crop another PDF"

// //         sidebarTitle="Crop PDF"

// //         sidebarIcon={<Crop className="h-5 w-5 text-white" />}

// //         sidebarDescription="Remove white margins and unwanted areas from PDF pages online."

// //         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}

// //         uploadTitle="Drop your PDF here"

// //         uploadSubtitle="or click to browse — PDF supported"

// //         customOptionsLayout={
// //           <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

// //             {/* LEFT */}

// //             <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">

// //               <div className="flex flex-wrap justify-center gap-8 pt-8">

// //                 {flow.files.map((file, i) => (

// //                   <div
// //                     key={i}
// //                     className="group flex w-[250px] flex-col items-center gap-4"
// //                   >
// //                     {/* PDF PREVIEW */}

// //                     <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

// //                       <PdfThumbnail
// //                         url={URL.createObjectURL(file)}
// //                       />

// //                       {/* CROP OVERLAY */}

// //                       <div className="absolute inset-[18%] border-2 border-dashed border-[#f24d0d] bg-[#f24d0d]/10">

// //                         <div className="absolute left-0 top-0 h-4 w-4 border-l-4 border-t-4 border-[#f24d0d]" />
// //                         <div className="absolute right-0 top-0 h-4 w-4 border-r-4 border-t-4 border-[#f24d0d]" />

// //                         <div className="absolute bottom-0 left-0 h-4 w-4 border-b-4 border-l-4 border-[#f24d0d]" />

// //                         <div className="absolute bottom-0 right-0 h-4 w-4 border-b-4 border-r-4 border-[#f24d0d]" />
// //                       </div>

// //                       {/* REMOVE */}

// //                       <button
// //                         type="button"
// //                         onClick={() => handleRemoveFile(i)}
// //                         className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </button>
// //                     </div>

// //                     {/* FILE NAME */}

// //                     <p className="w-full truncate text-center text-xs text-slate-500">
// //                       {file.name}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* RIGHT SIDEBAR */}

// //             <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">

// //               <div className="flex-1 overflow-y-auto p-5 space-y-5">

// //                 <h3 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-800">
// //                   Crop PDF
// //                 </h3>

// //                 {/* MODE */}

// //                 <div className="space-y-3">

// //                   <label className="block text-sm font-semibold text-slate-700">
// //                     Crop mode
// //                   </label>

// //                   <div className="space-y-2">

// //                     <button
// //                       onClick={() => setCropMode("custom")}
// //                       className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                         cropMode === "custom"
// //                           ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                           : "border-slate-200 hover:bg-slate-50"
// //                       }`}
// //                     >
// //                       Custom Crop
// //                     </button>

// //                     <button
// //                       onClick={() => setCropMode("trim")}
// //                       className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                         cropMode === "trim"
// //                           ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                           : "border-slate-200 hover:bg-slate-50"
// //                       }`}
// //                     >
// //                       Remove White Margins
// //                     </button>

// //                     <button
// //                       onClick={() => setCropMode("fit")}
// //                       className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
// //                         cropMode === "fit"
// //                           ? "border-[#f24d0d] bg-orange-50 text-[#f24d0d]"
// //                           : "border-slate-200 hover:bg-slate-50"
// //                       }`}
// //                     >
// //                       Fit Visible Content
// //                     </button>

// //                   </div>
// //                 </div>

// //                 {/* INFO BOX */}

// //                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

// //                   <div className="flex items-center gap-2">
// //                     <ScanLine className="h-5 w-5 text-purple-600" />

// //                     <h4 className="font-semibold text-slate-800">
// //                       Smart Cropping
// //                     </h4>
// //                   </div>

// //                   <p className="mt-2 text-sm leading-6 text-slate-500">
// //                     Remove empty borders, white margins, and unwanted outer page areas instantly.
// //                   </p>
// //                 </div>

// //                 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

// //                   <div className="flex items-center gap-2">
// //                     <Move className="h-5 w-5 text-blue-600" />

// //                     <h4 className="font-semibold text-slate-800">
// //                       Precise Page Trimming
// //                     </h4>
// //                   </div>

// //                   <p className="mt-2 text-sm leading-6 text-slate-500">
// //                     Crop PDF pages visually while preserving text clarity and layout quality.
// //                   </p>
// //                 </div>

// //                 {/* SECURITY */}

// //                 <div className="rounded-xl border border-green-200 bg-green-50 p-4">

// //                   <p className="text-sm font-semibold text-green-700">
// //                     ✓ Secure PDF Processing
// //                   </p>

// //                   <p className="mt-2 text-xs leading-5 text-slate-600">
// //                     Files are encrypted during upload and deleted automatically after processing.
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* BUTTON */}

// //               <div className="border-t border-slate-200 p-4">

// //                 <button
// //                   type="button"
// //                   onClick={handleConvert}
// //                   disabled={!flow.files.length}
// //                   className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${
// //                     flow.files.length
// //                       ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
// //                       : "cursor-not-allowed bg-slate-300"
// //                   }`}
// //                 >
// //                   <Crop className="h-5 w-5" />
// //                   Crop PDF
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         }

// //         uploadLanding={{
// //           content: {
// //             eyebrow: "CROP PDF",

// //             heroTitle: (
// //               <>
// //                 Crop PDF Pages <br />
// //                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
// //                   online instantly
// //                 </em>
// //               </>
// //             ),

// //             heroDescription:
// //               "Crop PDF online for free. Remove white margins, trim page edges, and resize visible page areas directly in your browser without installing software.",

// //             noticeTitle: "Crop PDF features",

// //             noticeItems: [
// //               "Remove white margins",
// //               "Trim unwanted page areas",
// //               "Preserve PDF quality",
// //             ],

// //             howToTitle: "How to crop a PDF",

// //             howToSubtitle:
// //               "Upload your PDF, select a crop mode, and download your cropped PDF instantly.",

// //             howToSteps: [
// //               {
// //                 n: "1",
// //                 title: "Upload your PDF",
// //                 desc: "Select your PDF file from your device.",
// //                 color: "bg-blue-600",
// //               },

// //               {
// //                 n: "2",
// //                 title: "Choose crop settings",
// //                 desc: "Remove white space or trim page edges visually.",
// //                 color: "bg-purple-600",
// //               },

// //               {
// //                 n: "3",
// //                 title: "Download cropped PDF",
// //                 desc: "Save your cleaned and trimmed PDF instantly.",
// //                 color: "bg-emerald-600",
// //               },
// //             ],

// //             whyTitle: "Why use PDFLinx Crop PDF?",

// //             whyItems: [
// //               {
// //                 title: "Remove White Margins",
// //                 desc: "Clean up scanned PDFs and remove extra outer white space.",
// //                 icon: Crop,
// //                 iconColor: "text-orange-500",
// //                 bgColor: "bg-orange-100",
// //               },

// //               {
// //                 title: "Preserve Quality",
// //                 desc: "Cropping does not reduce PDF quality or text sharpness.",
// //                 icon: CheckCircle,
// //                 iconColor: "text-green-600",
// //                 bgColor: "bg-green-100",
// //               },

// //               {
// //                 title: "Fast Online Tool",
// //                 desc: "Crop PDFs directly in your browser with instant processing.",
// //                 icon: Download,
// //                 iconColor: "text-purple-600",
// //                 bgColor: "bg-purple-100",
// //               },

// //               {
// //                 title: "Works on Any Device",
// //                 desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.",
// //                 icon: MonitorSmartphone,
// //                 iconColor: "text-blue-600",
// //                 bgColor: "bg-blue-100",
// //               },

// //               {
// //                 title: "Private & Secure",
// //                 desc: "Files are securely processed and automatically deleted.",
// //                 icon: ShieldCheck,
// //                 iconColor: "text-emerald-600",
// //                 bgColor: "bg-emerald-100",
// //               },
// //             ],

// //             seoBadge: "PDF Crop Tool",

// //             seoTitle: "Crop PDF Online Free",

// //             seoDescription:
// //               "Remove white margins and unwanted page areas from PDF files online for free. Crop PDFs instantly with no watermark or signup required.",

// //             seoSections: [
// //               {
// //                 title: "Remove White Margins from PDFs",
// //                 text: "Trim unwanted white space and empty page borders from scanned and digital PDF files instantly.",
// //               },

// //               {
// //                 title: "Crop PDF Pages Online",
// //                 text: "Resize visible page areas and remove unnecessary content while preserving original quality.",
// //               },

// //               {
// //                 title: "Perfect for Scanned Documents",
// //                 text: "Clean scanned PDFs by trimming uneven edges and unwanted page borders.",
// //               },

// //               {
// //                 title: "No Software Installation Needed",
// //                 text: "Crop PDFs directly inside your browser on desktop and mobile devices.",
// //               },
// //             ],

// //             faqTitle: "Frequently asked questions",

// //             faqs: [
// //               {
// //                 q: "What does Crop PDF do?",
// //                 a: "Crop PDF removes unwanted outer areas, white margins, and extra space from PDF pages online.",
// //               },

// //               {
// //                 q: "Can I crop PDF pages online for free?",
// //                 a: "Yes. You can crop PDF pages online directly in your browser without installing software.",
// //               },

// //               {
// //                 q: "Will cropping reduce PDF quality?",
// //                 a: "No. Cropping only trims visible page areas and does not reduce PDF quality.",
// //               },

// //               {
// //                 q: "Can I remove white margins from scanned PDFs?",
// //                 a: "Yes. PDFLinx can trim white borders and clean scanned documents instantly.",
// //               },

// //               {
// //                 q: "Does Crop PDF work on mobile?",
// //                 a: "Yes. Crop PDF works on Android, iPhone, tablets, and desktop browsers.",
// //               },

// //               {
// //                 q: "Are my uploaded PDFs secure?",
// //                 a: "Yes. Files are encrypted during upload and automatically deleted after processing.",
// //               },
// //             ],
// //           },
// //         }}
// //       />

// //       <RelatedToolsSection />
// //     </>
// //   );
// // }