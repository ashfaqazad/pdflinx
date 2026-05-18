"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import RelatedToolsSection from "@/components/RelatedTools";
import Script from "next/script";
import {
  PenTool,
  Eraser,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle,
  X,
  Shield,
  Zap,
  Lock,
  MonitorSmartphone,
} from "lucide-react";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// ==================== FAQ DATA ====================
const FAQ_DATA = [
  {
    q: "Is the Sign PDF tool free?",
    a: "Yes. PDFLinx Sign PDF is completely free — no sign-up, no watermarks, no hidden costs. You can sign unlimited PDFs at no charge, forever.",
  },
  {
    q: "How do I create a free digital signature online?",
    a: "Simply open the Sign PDF tool above, draw your signature using your mouse, trackpad, or touchscreen, then click 'Use This Signature'. Your free digital signature is instantly ready to place on any PDF document.",
  },
  {
    q: "Can I add a digital signature to a PDF for free without software?",
    a: "Yes. PDFLinx works entirely in your browser — no software download, no installation, no account needed. Just upload your PDF, draw or upload your signature, position it, and download the signed PDF instantly.",
  },
  {
    q: "Can I draw my signature online?",
    a: "Yes. You can draw your signature using your mouse, trackpad, or touchscreen directly in the browser. The drawing canvas supports smooth, natural signature drawing on both desktop and mobile.",
  },
  {
    q: "Can I upload a signature image instead of drawing?",
    a: "Yes. Upload any PNG or JPG image of your handwritten signature. The tool will overlay it on your PDF exactly where you position it in the live preview.",
  },
  {
    q: "Can I see where my signature will appear before downloading?",
    a: "Yes. The live preview panel shows your PDF with the signature overlay in real-time. Simply drag the signature box to position it exactly where you want — no guessing.",
  },
  {
    q: "Are my files safe when signing a PDF?",
    a: "Yes. All uploaded files are processed automatically on secure servers and deleted immediately after signing. We never store your PDFs, signatures, or personal data permanently.",
  },
  {
    q: "Can I sign specific pages of a multi-page PDF?",
    a: "Yes. Use the page selector to choose exactly which page you want to sign. The live preview will show all pages, and you can click any page to select it for signing.",
  },
  {
    q: "Does the signed PDF have watermarks?",
    a: "No. PDFLinx never adds watermarks to your signed PDF documents. The output file is completely clean with only your signature applied.",
  },
  {
    q: "Can I use this digital signature tool on my phone or tablet?",
    a: "Yes. PDFLinx Sign PDF works on all devices including iPhones, Android phones, and tablets. Touch support lets you draw your signature with your finger directly on mobile browsers.",
  },
];

// ==================== SIGN PDF PREVIEW COMPONENT ====================
function SignPdfPreview({
  pdfDoc,
  totalPages,
  pageNumber,
  signaturePreview,
  xPosition,
  yPosition,
  signatureWidth,
  signatureHeight,
  scale,
  setScale,
  canvasRefs,
  renderKey,
  handleSignatureDrag,
  handleSignatureDragStart,
  handleSignatureDragEnd,
  selectPage,
  pdfFile,
}) {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  return (
    <div className="w-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Live PDF Preview</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5))}
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-10 text-center font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5))}
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      {!pdfFile ? (
        <div className="flex items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Upload a PDF to see live preview</p>
            <p className="text-xs text-gray-300 mt-1">
              See your digital signature placement in real-time
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-100 p-3 space-y-4"
          // style={{ maxHeight: "90vh" }}
          style={{ maxHeight: "calc(100vh - 120px)" }}
          onMouseMove={handleSignatureDrag}
          onMouseUp={handleSignatureDragEnd}
          onMouseLeave={handleSignatureDragEnd}
          onTouchMove={handleSignatureDrag}
          onTouchEnd={handleSignatureDragEnd}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={`page-${index}-${renderKey}`}
              className={`relative flex justify-center cursor-pointer transition-all ${pageNumber === index + 1
                ? "ring-4 ring-blue-500 rounded-xl p-1.5 bg-blue-50"
                : "hover:ring-2 hover:ring-gray-300 rounded-xl p-1.5"
                }`}
              onClick={() => selectPage(index + 1)}
            >
              <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded z-10 font-medium">
                Page {index + 1}
              </div>
              <div className="relative inline-block shadow-xl max-w-full overflow-hidden">
                <canvas
                  ref={(el) => {
                    if (el) canvasRefs.current[index] = el;
                  }}
                  className="bg-white block"
                  style={{ display: "block", maxWidth: "100%", height: "auto" }}
                />
                {signaturePreview && pageNumber === index + 1 && (
                  <div
                    className="absolute cursor-move border-2 border-blue-500 shadow-lg"
                    style={{
                      left: `${xPosition}px`,
                      top: `${yPosition}px`,
                      width: `${signatureWidth}px`,
                      height: `${signatureHeight}px`,
                    }}
                    onMouseDown={handleSignatureDragStart}
                    onTouchStart={handleSignatureDragStart}
                    title="Drag to move digital signature"
                  >
                    <img
                      src={signaturePreview}
                      alt="Digital signature on PDF"
                      className="w-full h-full object-contain bg-white/90 pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {!pdfDoc && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading PDF preview…</p>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">
        💡 Click a page to select it, then drag the signature to position it
      </p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function SignPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  // ── PDF state ──
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const canvasRefs = useRef([]);
  const toolCardRef = useRef(null);

  // ── Signature state ──
  const [signatureImage, setSignatureImage] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [activeTab, setActiveTab] = useState("draw");
  const signCanvasRef = useRef(null);
  const isDrawing = useRef(false);

  // ── Position / size state ──
  const [pageNumber, setPageNumber] = useState(1);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [signatureWidth, setSignatureWidth] = useState(150);
  const [signatureHeight, setSignatureHeight] = useState(75);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // ── UI state ──
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFilename, setOutputFilename] = useState("signed.pdf");

  // ── Helpers ──
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const resetAllForNewPdf = () => {
    setPdfDoc(null);
    setTotalPages(1);
    setPageNumber(1);
    setScale(1);
    canvasRefs.current = [];
    setXPosition(50);
    setYPosition(50);
    setRenderKey(0);
  };

  const resetSignature = () => {
    setSignatureImage(null);
    setSignaturePreview("");
  };

  // ── Sync pdfFile from flow.files ──
  useEffect(() => {
    const f = flow.files?.[0] || null;
    if (f !== pdfFile) {
      setPdfFile(f);
      if (f) {
        resetAllForNewPdf();
        setError("");
        setOutputFilename(f.name.replace(/\.pdf$/i, "") + "-signed.pdf");
      }
    }
  }, [flow.files]);

  // ── Load PDF doc ──
  useEffect(() => {
    if (!pdfFile) return;
    let cancelled = false;
    let tries = 0;

    const load = async () => {
      const lib = window?.pdfjsLib;
      if (!lib) {
        if (tries++ < 60) return setTimeout(load, 50);
        if (!cancelled) setError("PDF preview engine failed to load.");
        return;
      }
      try {
        setError("");
        const buf = await pdfFile.arrayBuffer();
        const doc = await lib.getDocument({ data: buf }).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setPageNumber(1);
        canvasRefs.current = new Array(doc.numPages).fill(null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load PDF for preview.");
      }
    };

    load();
    return () => { cancelled = true; };
  }, [pdfFile]);

  // ── Render all pages ──
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    const renderAll = async () => {
      try {
        await new Promise((r) => setTimeout(r, 100));
        for (let i = 1; i <= totalPages; i++) {
          if (cancelled) return;
          const canvas = canvasRefs.current[i - 1];
          if (!canvas) continue;
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale });
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        console.error("Render error:", e);
        if (!cancelled) setError("Failed to render PDF preview.");
      }
    };

    renderAll();
    return () => { cancelled = true; };
  }, [pdfDoc, totalPages, scale, renderKey]);

  useEffect(() => {
    if (pdfDoc) setRenderKey((prev) => prev + 1);
  }, [scale]);

  // ── Drawing ──
  const getCanvasCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e, canvas);
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e, canvas);
    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => { isDrawing.current = false; };

  const clearCanvas = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    resetSignature();
  };

  const saveCanvasAsImage = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "signature.png", { type: "image/png" });
      setSignatureImage(file);
      const url = URL.createObjectURL(blob);
      setSignaturePreview(url);
      setError("");
    }, "image/png");
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image (PNG/JPG).");
      return;
    }
    setSignatureImage(file);
    setSignaturePreview(URL.createObjectURL(file));
    setError("");
  };

  // ── Drag signature ──
  const handleSignatureDragStart = (e) => {
    if (!signaturePreview) return;
    const canvas = canvasRefs.current[pageNumber - 1];
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    dragStart.current = {
      x: clientX - rect.left - xPosition,
      y: clientY - rect.top - yPosition,
    };
  };

  const handleSignatureDrag = (e) => {
    if (!isDragging) return;
    const canvas = canvasRefs.current[pageNumber - 1];
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newX = clientX - rect.left - dragStart.current.x;
    const newY = clientY - rect.top - dragStart.current.y;
    setXPosition(clamp(newX, 0, rect.width - signatureWidth));
    setYPosition(clamp(newY, 0, rect.height - signatureHeight));
  };

  const handleSignatureDragEnd = () => setIsDragging(false);

  const selectPage = (i) => {
    setPageNumber(i);
    const canvas = canvasRefs.current[i - 1];
    if (!canvas) return;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setXPosition((x) => clamp(x, 0, rect.width - signatureWidth));
    setYPosition((y) => clamp(y, 0, rect.height - signatureHeight));
  };

  // ── Remove file ──
  const handleRemoveFile = () => {
    resetAllForNewPdf();
    resetSignature();
    setError("");
    flow.reset();
  };

  // ── Download ──
  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── Convert / Submit ──
  const handleConvert = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file!");
      return;
    }
    if (!signatureImage) {
      setError("Please provide a signature first!");
      return;
    }

    const currentCanvas = canvasRefs.current[pageNumber - 1];
    if (!currentCanvas) {
      setError("Preview canvas not ready yet. Please wait a moment and try again.");
      return;
    }

    flow.startProcessing();
    startProgress();
    setError("");

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      formData.append("signatureImage", signatureImage);
      formData.append("pageNumber", String(pageNumber));
      formData.append("xPosition", String(Math.round(xPosition)));
      formData.append("yPosition", String(Math.round(yPosition)));
      formData.append("width", String(Math.round(signatureWidth)));
      formData.append("height", String(Math.round(signatureHeight)));
      formData.append("scale", String(scale));

      const displayRect = currentCanvas.getBoundingClientRect();
      formData.append("previewWidth", String(displayRect.width));
      formData.append("previewHeight", String(displayRect.height));

      const res = await fetch("/convert/sign-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Signing failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(url);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      const msg = (err?.message || "Something went wrong. Please try again.").toString();
      setError(msg);
      flow.handleError(msg);
      console.error(err);
    }
  };

  // ── Options slot: draw/upload tabs + size controls ──
  const optionsSlot = (
    <div className="space-y-5">
      {/* Signature creation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Create your signature</h3>
        <p className="mt-1 text-sm text-slate-500">Draw with mouse/touch or upload an image.</p>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("draw")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${activeTab === "draw"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
          >
            <PenTool className="w-4 h-4" />
            Draw Signature
          </button>

          <label
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${activeTab === "upload"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-gray-200 text-gray-600 hover:border-purple-300"
              }`}
            onClick={() => setActiveTab("upload")}
          >
            <ImageIcon className="w-4 h-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Draw canvas */}
        {activeTab === "draw" && (
          <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500 mb-2">Draw your signature below:</p>
            <canvas
              ref={signCanvasRef}
              width={600}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="border-2 border-dashed border-gray-300 bg-white w-full rounded-lg cursor-crosshair"
              style={{ touchAction: "none" }}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs font-semibold"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                type="button"
                onClick={saveCanvasAsImage}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-semibold"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Use This Signature
              </button>
            </div>
          </div>
        )}

        {/* Signature ready */}
        {signaturePreview && (
          <div className="mt-3 border-2 border-green-400 bg-green-50 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-green-700 mb-1">✓ Signature ready</p>
              <img
                src={signaturePreview}
                alt="Signature preview"
                className="max-h-12 bg-white border border-gray-200 rounded p-1"
              />
            </div>
            <button
              type="button"
              onClick={resetSignature}
              className="text-red-400 hover:bg-red-100 p-1 rounded shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Position & size controls */}
      {pdfFile && signaturePreview && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Position & size</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Page:{" "}
              <span className="font-semibold text-slate-700">
                {pageNumber} / {totalPages}
              </span>
            </label>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageNumber}
              onChange={(e) => selectPage(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Width:{" "}
              <span className="font-semibold text-slate-700">
                {Math.round(signatureWidth)}px
              </span>
            </label>
            <input
              type="range"
              min="50"
              max="400"
              value={signatureWidth}
              onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Height:{" "}
              <span className="font-semibold text-slate-700">
                {Math.round(signatureHeight)}px
              </span>
            </label>
            <input
              type="range"
              min="30"
              max="220"
              value={signatureHeight}
              onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <p className="text-xs text-slate-400">
            💡 Drag the signature box in the preview to reposition it
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-sign"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Sign a PDF Online Free — Add Digital Signature",
            description:
              "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup, no watermark.",
            url: "https://pdflinx.com/sign-pdf",
            step: [
              { "@type": "HowToStep", position: 1, name: "Upload PDF file", text: "Upload the PDF document you need to sign using the upload area or drag and drop." },
              { "@type": "HowToStep", position: 2, name: "Create free digital signature", text: "Draw your digital signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature." },
              { "@type": "HowToStep", position: 3, name: "Position signature on PDF", text: "Drag the signature overlay to your preferred position using the live PDF preview." },
              { "@type": "HowToStep", position: 4, name: "Download signed PDF", text: "Click Sign PDF to apply your digital signature and download the signed document instantly." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-sign-pdf.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-sign"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pdflinx.com/tools" },
              { "@type": "ListItem", position: 3, name: "Sign PDF Online Free", item: "https://pdflinx.com/sign-pdf" },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-sign"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-sign"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PDFLinx Sign PDF — Free Digital Signature Tool",
            url: "https://pdflinx.com/sign-pdf",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free online tool to add digital signatures to PDF documents. Draw or upload your signature, position with live preview, download instantly. No signup required.",
            featureList: [
              "Free digital signature creation online",
              "Draw signature with mouse or touchscreen",
              "Upload signature image PNG or JPG",
              "Live PDF preview with drag-and-drop positioning",
              "Multi-page PDF support",
              "No watermark on output",
              "Files deleted after processing",
            ],
          }, null, 2),
        }}
      />

      {/* pdf.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            setPdfJsReady(true);
          }
        }}
      />

      {/* ==================== TOOL UI ==================== */}
      <ToolPageLayout
        title={seo?.h1 || "Sign PDF Online Free"}
        tagline="No Signup · No Watermark · Live Preview · 100% Free"
        accept=".pdf,application/pdf"
        multiple={false}
        convertLabel="Sign PDF Now"
        hideSidebar={true}
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Signature options"
        optionsSlot={optionsSlot}
        processingTitle="Signing your PDF..."
        processingDescription="Applying your digital signature. Please wait."
        processingStages={["Uploading", "Applying signature", "Done"]}
        doneTitle="Your signed PDF is ready"
        doneDescription="Click download to save your digitally signed PDF."
        downloadLabel="Download Signed PDF"
        resetLabel="Sign another PDF"
        sidebarTitle="Sign PDF"
        sidebarIcon={<PenTool className="h-5 w-5 text-white" />}
        sidebarDescription="Add a free digital signature to any PDF — draw or upload, position with live preview."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Signature</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Draw or upload signature image</li>
              <li>Drag to position on any page</li>
              <li>Resize width & height freely</li>
              <li>No watermark on output</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files only"

        customOptionsLayout={
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

            {/* LEFT PREVIEW */}
            <div>
              <SignPdfPreview
                pdfFile={pdfFile}
                pdfDoc={pdfDoc}
                totalPages={totalPages}
                pageNumber={pageNumber}
                signaturePreview={signaturePreview}
                xPosition={xPosition}
                yPosition={yPosition}
                signatureWidth={signatureWidth}
                signatureHeight={signatureHeight}
                scale={scale}
                setScale={setScale}
                canvasRefs={canvasRefs}
                renderKey={renderKey}
                handleSignatureDrag={handleSignatureDrag}
                handleSignatureDragStart={handleSignatureDragStart}
                handleSignatureDragEnd={handleSignatureDragEnd}
                selectPage={selectPage}
              />
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-4 xl:sticky xl:top-6 h-fit">
              {optionsSlot}

              {/* Sign + Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleConvert}
                disabled={!pdfFile || !signatureImage}
                className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${pdfFile && signatureImage
                    ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-300"
                  }`}
              >
                Sign PDF Now
              </button>
            </div>
            {/* <div className="space-y-4 xl:sticky xl:top-6 h-fit">
              {optionsSlot}
            </div> */}

          </div>
        }

        // customFilePreview={
        //   <SignPdfPreview
        //     pdfFile={pdfFile}
        //     pdfDoc={pdfDoc}
        //     totalPages={totalPages}
        //     pageNumber={pageNumber}
        //     signaturePreview={signaturePreview}
        //     xPosition={xPosition}
        //     yPosition={yPosition}
        //     signatureWidth={signatureWidth}
        //     signatureHeight={signatureHeight}
        //     scale={scale}
        //     setScale={setScale}
        //     canvasRefs={canvasRefs}
        //     renderKey={renderKey}
        //     handleSignatureDrag={handleSignatureDrag}
        //     handleSignatureDragStart={handleSignatureDragStart}
        //     handleSignatureDragEnd={handleSignatureDragEnd}
        //     selectPage={selectPage}
        //   />
        // }


        uploadLanding={{
          content: {
            eyebrow: "SIGN PDF",

            heroTitle: (
              <>
                Sign PDF Online <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  free & instantly
                </em>
              </>
            ),

            heroDescription:
              "Add a free digital signature to any PDF online — draw your signature with mouse or touchscreen, or upload an image. Position with live preview and download your signed PDF instantly. No signup, no software, no watermark.",

            noticeTitle: "Signature output",

            noticeItems: [
              "Draw or upload signature image",
              "Live preview with drag positioning",
              "Single signed PDF download",
            ],

            howToTitle: "How to sign a PDF online",

            howToSubtitle:
              "Upload your PDF, create your signature, drag it into position on the live preview, and download the signed PDF instantly.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Select the PDF document you need to sign from your device or drag and drop it into the uploader.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Create your signature",
                desc: "Draw your signature using mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Position & download",
                desc: "Drag the signature to your preferred position on the live preview, then download the signed PDF instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx to sign PDF?",

            whyItems: [
              {
                title: "Free Digital Signature",
                desc: "Create and add a free digital signature to any PDF — no subscription, no hidden fees, unlimited use.",
                icon: PenTool,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                title: "Draw or Upload",
                desc: "Draw your signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature.",
                icon: ImageIcon,
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                title: "Live PDF Preview",
                desc: "See exactly where your signature will appear — drag it to any position on any page before downloading.",
                icon: Zap,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "No Watermark",
                desc: "Your signed PDF is completely clean — no watermarks, no branding, just your signature on the document.",
                icon: Shield,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
              {
                title: "Works on Mobile",
                desc: "Use PDFLinx on iPhone, Android, tablet, or desktop — touch support lets you draw your signature with your finger.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Files Auto-Deleted",
                desc: "Your PDF and signature are never stored permanently — processed securely and deleted immediately after signing.",
                icon: Lock,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Signature Guide",

            seoTitle: "Free Online Sign PDF Tool by PDFLinx",

            seoDescription:
              "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup needed.",

            seoSections: [
              {
                title: "Draw Your Signature Online for Free",
                desc: "Use the built-in drawing canvas to create a smooth, natural signature with your mouse, trackpad, or touchscreen — no stylus or special hardware needed.",
              },
              {
                title: "Upload a Signature Image",
                text: "Already have a scanned or photographed signature? Upload any PNG or JPG image and it will be overlaid on your PDF exactly where you position it.",
              },
              {
                title: "Live Preview with Drag Positioning",
                text: "The live PDF preview shows all pages with your signature overlay in real-time. Simply drag the signature box to position it perfectly before downloading.",
              },
              {
                title: "Multi-Page PDF Support",
                text: "Sign any specific page of a multi-page PDF document. Select the page number and position your signature exactly where it needs to appear.",
              },
              {
                title: "Works on All Devices",
                text: "Use the PDFLinx sign PDF tool in your browser on Windows, macOS, Linux, Android, iPhone, and tablets — no app or software installation required.",
              },
              {
                title: "No Signup, No Watermark",
                text: "Add a digital signature to PDF online for free with no account required, no watermark added, and files permanently deleted after signing.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: FAQ_DATA,
          },
        }}
      />

    </>
  );
}






