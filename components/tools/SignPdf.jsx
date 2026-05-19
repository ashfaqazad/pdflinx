"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  RotateCcw,
  Type,
  Download,
  Move,
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

// ==================== SIGNATURE MODAL ====================
function SignatureModal({ onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("draw");
  const [drawColor, setDrawColor] = useState("#1e293b");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [typedText, setTypedText] = useState("");
  const [typeFontIdx, setTypeFontIdx] = useState(0);
  const [typeColor, setTypeColor] = useState("#1e293b");
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathsRef = useRef([]);
  const currentPathRef = useRef([]);

  const COLORS = ["#1e293b", "#e8420a", "#1d4ed8", "#065f46", "#7c3aed"];
  const STROKES = [2, 3, 5, 8];
  const TYPE_FONTS = [
    { name: "Dancing Script", label: "Classic" },
    { name: "Pacifico", label: "Casual" },
    { name: "Caveat", label: "Handwritten" },
    { name: "Sacramento", label: "Elegant" },
  ];

  const getCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
  };

  const redraw = useCallback((all, live = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawPath = (pts) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };
    all.forEach(drawPath);
    if (live.length) drawPath(live);
  }, [drawColor, strokeWidth]);

  const onMouseDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getCoords(e, canvas);
    isDrawingRef.current = true;
    currentPathRef.current = [pos];
  };

  const onMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    currentPathRef.current = [...currentPathRef.current, getCoords(e, canvas)];
    redraw(pathsRef.current, currentPathRef.current);
  };

  const onMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    pathsRef.current = [...pathsRef.current, currentPathRef.current];
    currentPathRef.current = [];
  };

  const handleUndo = () => {
    pathsRef.current = pathsRef.current.slice(0, -1);
    redraw(pathsRef.current);
  };

  const handleClear = () => {
    pathsRef.current = [];
    currentPathRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleDrawSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || pathsRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (imgData.data[(y * canvas.width + x) * 4 + 3] > 0) {
          minX = Math.min(minX, x); minY = Math.min(minY, y);
          maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
        }
      }
    }
    const pad = 12;
    const w = Math.max(1, maxX - minX + pad * 2);
    const h = Math.max(1, maxY - minY + pad * 2);
    const trimmed = document.createElement("canvas");
    trimmed.width = w; trimmed.height = h;
    trimmed.getContext("2d").drawImage(canvas, minX - pad, minY - pad, w, h, 0, 0, w, h);
    onSave(trimmed.toDataURL("image/png"));
  };

  const handleTypeSave = () => {
    if (!typedText.trim()) return;
    const canvas = document.createElement("canvas");
    canvas.width = 500; canvas.height = 130;
    const ctx = canvas.getContext("2d");
    ctx.font = `60px '${TYPE_FONTS[typeFontIdx].name}', cursive`;
    ctx.fillStyle = typeColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedText, 250, 65);
    onSave(canvas.toDataURL("image/png"));
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onSave(ev.target.result);
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: "draw", icon: <PenTool className="w-4 h-4" />, label: "Draw" },
    { id: "type", icon: <Type className="w-4 h-4" />, label: "Type" },
    { id: "upload", icon: <ImageIcon className="w-4 h-4" />, label: "Upload" },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
        style={{ animation: "signModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <style>{`
          @keyframes signModalIn {
            from { opacity: 0; transform: scale(0.92) translateY(16px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Pacifico&family=Caveat:wght@600&family=Sacramento&display=swap');
        `}</style>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f24d0d] text-white">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Signature</h2>
              <p className="text-xs text-slate-400">Draw, type, or upload your signature</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-5">
          <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  activeTab === t.id
                    ? "bg-white text-[#f24d0d] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-6 pt-4">

          {/* ── DRAW TAB ── */}
          {activeTab === "draw" && (
            <div className="space-y-3">
              {/* Color + Stroke */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Color</span>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDrawColor(c)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: c,
                        outline: drawColor === c ? `3px solid ${c}` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Size</span>
                  {STROKES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStrokeWidth(s)}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all ${
                        strokeWidth === s ? "border-[#f24d0d] bg-orange-50" : "border-slate-200"
                      }`}
                    >
                      <div
                        className="rounded-full"
                        style={{ width: Math.min(s * 3, 18), height: s, background: drawColor }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <canvas
                  ref={canvasRef}
                  width={540}
                  height={190}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onMouseDown}
                  onTouchMove={onMouseMove}
                  onTouchEnd={onMouseUp}
                  className="w-full cursor-crosshair bg-white"
                  style={{ touchAction: "none", display: "block" }}
                />
                {pathsRef.current.length === 0 && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-2xl text-slate-300 select-none"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Sign here…
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Undo
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Eraser className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDrawSave}
                    className="flex items-center gap-1.5 rounded-xl bg-[#f24d0d] px-4 py-2 text-xs font-bold text-white hover:bg-[#db4309] transition shadow-[0_4px_14px_rgba(242,77,13,0.3)]"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Insert
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TYPE TAB ── */}
          {activeTab === "type" && (
            <div className="space-y-4">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your name…"
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#f24d0d]"
              />

              {/* Font previews */}
              <div className="grid grid-cols-2 gap-2">
                {TYPE_FONTS.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTypeFontIdx(i)}
                    className={`rounded-2xl border-2 py-4 text-2xl transition-all ${
                      typeFontIdx === i
                        ? "border-[#f24d0d] bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    style={{
                      fontFamily: `'${f.name}', cursive`,
                      color: typeColor,
                    }}
                  >
                    {typedText || f.label}
                  </button>
                ))}
              </div>

              {/* Color */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Color</span>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTypeColor(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      outline: typeColor === c ? `3px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTypeSave}
                  disabled={!typedText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#f24d0d] px-5 py-2 text-xs font-bold text-white hover:bg-[#db4309] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(242,77,13,0.3)]"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Insert
                </button>
              </div>
            </div>
          )}

          {/* ── UPLOAD TAB ── */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 hover:border-[#f24d0d] hover:bg-orange-50 transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Click to upload signature</p>
                  <p className="text-xs text-slate-400 mt-1">PNG or JPG · Transparent background recommended</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

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
    <div className="w-full h-full">
      {!pdfFile ? (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center text-slate-400 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Upload a PDF to see live preview</p>
            <p className="text-xs text-slate-400 mt-1">Your signature placement will appear here in real-time</p>
          </div>
        </div>
      ) : (
        <div
          className="relative space-y-5"
          onMouseMove={handleSignatureDrag}
          onMouseUp={handleSignatureDragEnd}
          onMouseLeave={handleSignatureDragEnd}
          onTouchMove={handleSignatureDrag}
          onTouchEnd={handleSignatureDragEnd}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={`page-${index}-${renderKey}`}
              className={`relative flex justify-center cursor-pointer transition-all rounded-2xl p-2 ${
                pageNumber === index + 1
                  ? "ring-4 ring-[#f24d0d]/40 bg-orange-50/50"
                  : "hover:ring-2 hover:ring-slate-200 bg-white/50"
              }`}
              onClick={() => selectPage(index + 1)}
            >
              {/* Page badge */}
              <div className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                pageNumber === index + 1
                  ? "bg-[#f24d0d] text-white shadow-lg"
                  : "bg-slate-800/80 text-white backdrop-blur-sm"
              }`}>
                Page {index + 1}
                {pageNumber === index + 1 && (
                  <span className="ml-1 text-[10px] opacity-80">● Active</span>
                )}
              </div>

              <div className="relative inline-block shadow-2xl rounded-sm overflow-hidden max-w-full">
                <canvas
                  ref={(el) => { if (el) canvasRefs.current[index] = el; }}
                  className="bg-white block"
                  style={{ display: "block", maxWidth: "100%", height: "auto" }}
                />
                {signaturePreview && pageNumber === index + 1 && (
                  <div
                    className="absolute cursor-move"
                    style={{
                      left: `${xPosition}px`,
                      top: `${yPosition}px`,
                      width: `${signatureWidth}px`,
                      height: `${signatureHeight}px`,
                    }}
                    onMouseDown={handleSignatureDragStart}
                    onTouchStart={handleSignatureDragStart}
                    title="Drag to reposition"
                  >
                    {/* Signature container with ilovepdf-style border */}
                    <div className="relative w-full h-full border-2 border-dashed border-[#f24d0d] rounded-sm shadow-[0_0_0_1px_rgba(242,77,13,0.15)]">
                      <img
                        src={signaturePreview}
                        alt="Signature"
                        className="w-full h-full object-contain bg-white/90 pointer-events-none"
                        draggable={false}
                      />
                      {/* Drag handle indicator */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg bg-[#f24d0d] px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap pointer-events-none">
                        <Move className="w-3 h-3" /> Drag to move
                      </div>
                      {/* Resize corner */}
                      <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-sm bg-[#f24d0d] border-2 border-white shadow cursor-se-resize" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {!pdfDoc && (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#f24d0d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">Loading PDF preview…</p>
              </div>
            </div>
          )}
        </div>
      )}
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
  const [showSignModal, setShowSignModal] = useState(false);

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

  const handleRemoveFile = () => {
    resetAllForNewPdf();
    resetSignature();
    setError("");
    flow.reset();
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── Handle signature save from modal ──
  const handleSignatureSave = (dataUrl) => {
    setShowSignModal(false);
    setSignaturePreview(dataUrl);
    // Convert dataUrl to File
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], "signature.png", { type: "image/png" });
        setSignatureImage(file);
        setError("");
      });
  };

  // ── Convert / Submit ──
  const handleConvert = async () => {
    if (!pdfFile) { setError("Please upload a PDF file!"); return; }
    if (!signatureImage) { setError("Please provide a signature first!"); return; }
    const currentCanvas = canvasRefs.current[pageNumber - 1];
    if (!currentCanvas) {
      setError("Preview canvas not ready yet. Please wait and try again.");
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

      const res = await fetch("/convert/sign-pdf", { method: "POST", body: formData });
      if (!res.ok) {
        let msg = "Signing failed";
        try { const j = await res.json(); msg = j?.error || msg; } catch { }
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

  // ==================== customOptionsLayout — iLovePDF Style ====================
  const customOptionsLayout = (
    <div
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f3f5f9] shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* ── TOP TOOLBAR ── */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f24d0d] text-white shadow-lg">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Sign PDF</h2>
            <p className="text-xs text-slate-500">Draw, type or upload your signature</p>
          </div>
        </div>

        {/* Right: file info + remove */}
        <div className="hidden md:flex items-center gap-3">
          {pdfFile && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="max-w-[180px] truncate text-xs font-semibold text-slate-600">
                {pdfFile.name}
              </span>
              <span className="text-xs text-slate-400">
                {(pdfFile.size / 1024).toFixed(0)} KB
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Remove
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px]">

        {/* ════════ LEFT: PDF PREVIEW ════════ */}
        <div className="relative bg-[#eef1f6]">

          {/* Preview Toolbar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Live Preview</h3>
              <p className="text-xs text-slate-400">
                {pdfFile
                  ? `Click a page · Drag to position`
                  : "Upload a PDF to begin"}
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <div className="min-w-[60px] rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-bold text-slate-700">
                {Math.round(scale * 100)}%
              </div>
              <button
                type="button"
                onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable preview */}
          <div
            className="overflow-auto p-6"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="mx-auto max-w-[900px]">
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
          </div>
        </div>

        {/* ════════ RIGHT: SETTINGS SIDEBAR ════════ */}
        <div className="border-l border-slate-200 bg-white">
          <div
            className="sticky top-0 overflow-y-auto"
            style={{ height: "calc(100vh - 140px)" }}
          >
            {/* Sidebar Header */}
            <div className="border-b border-slate-100 px-5 py-5">
              <h3 className="text-base font-bold text-slate-900">Signature Settings</h3>
              <p className="mt-0.5 text-xs text-slate-400">Create, resize and position your signature</p>
            </div>

            <div className="space-y-4 p-5">

              {/* ── Signature Creator Card ── */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Your Signature</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Draw, type or upload</p>
                  </div>
                  {signaturePreview && (
                    <button
                      type="button"
                      onClick={resetSignature}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Signature preview or add button */}
                {signaturePreview ? (
                  <div className="rounded-xl border-2 border-dashed border-green-300 bg-white p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-xs font-semibold text-green-700">Signature ready</span>
                    </div>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="mx-auto max-h-14 object-contain"
                    />
                  </div>
                ) : (
                  // Three method buttons — iLovePDF style
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <PenTool className="w-5 h-5" />, label: "Draw" },
                      { icon: <Type className="w-5 h-5" />, label: "Type" },
                      { icon: <ImageIcon className="w-5 h-5" />, label: "Upload" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setShowSignModal(true)}
                        className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-slate-500 transition-all hover:border-[#f24d0d] hover:bg-orange-50 hover:text-[#f24d0d]"
                      >
                        {btn.icon}
                        <span className="text-[11px] font-semibold">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {signaturePreview && (
                  <button
                    type="button"
                    onClick={() => setShowSignModal(true)}
                    className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#f24d0d] hover:text-[#f24d0d] transition-all"
                  >
                    Change Signature
                  </button>
                )}
              </div>

              {/* ── Position & Size ── */}
              {pdfFile && signaturePreview && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Position & Size</h4>

                  {/* Page selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-500 font-medium">Page</label>
                      <span className="text-xs font-bold text-slate-700">{pageNumber} / {totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => selectPage(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                      >
                        ‹
                      </button>
                      <div className="flex-1 text-center rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-bold text-slate-700">
                        {pageNumber}
                      </div>
                      <button
                        type="button"
                        onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))}
                        disabled={pageNumber >= totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Width slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-500 font-medium">Width</label>
                      <span className="text-xs font-bold text-slate-700">{Math.round(signatureWidth)}px</span>
                    </div>
                    <input
                      type="range" min="50" max="400" value={signatureWidth}
                      onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
                      className="w-full accent-[#f24d0d]"
                    />
                  </div>

                  {/* Height slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-500 font-medium">Height</label>
                      <span className="text-xs font-bold text-slate-700">{Math.round(signatureHeight)}px</span>
                    </div>
                    <input
                      type="range" min="30" max="220" value={signatureHeight}
                      onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
                      className="w-full accent-[#f24d0d]"
                    />
                  </div>

                  <p className="text-xs text-slate-400">
                    💡 Drag the signature box on the preview to reposition
                  </p>
                </div>
              )}

              {/* ── Security Card ── */}
              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Files are encrypted and auto-deleted after signing. Never stored permanently.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Error ── */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              {/* ── Sign Button ── */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={!pdfFile || !signatureImage}
                className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${
                  pdfFile && signatureImage
                    ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_12px_32px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                {pdfFile && signatureImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Sign PDF Now
                  </span>
                ) : (
                  "Add a signature to continue"
                )}
              </button>

            </div>
          </div>
        </div>

      </div>
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
        customOptionsLayout={customOptionsLayout}
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

      {/* ── Signature Modal (iLovePDF style) ── */}
      {showSignModal && (
        <SignatureModal
          onSave={handleSignatureSave}
          onClose={() => setShowSignModal(false)}
        />
      )}
    </>
  );
}



























// "use client";

// import { useRef, useState, useEffect, useMemo } from "react";
// import RelatedToolsSection from "@/components/RelatedTools";
// import Script from "next/script";
// import {
//   PenTool,
//   Eraser,
//   Image as ImageIcon,
//   ZoomIn,
//   ZoomOut,
//   FileText,
//   CheckCircle,
//   X,
//   Shield,
//   Zap,
//   Lock,
//   MonitorSmartphone,
// } from "lucide-react";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// // ==================== FAQ DATA ====================
// const FAQ_DATA = [
//   {
//     q: "Is the Sign PDF tool free?",
//     a: "Yes. PDFLinx Sign PDF is completely free — no sign-up, no watermarks, no hidden costs. You can sign unlimited PDFs at no charge, forever.",
//   },
//   {
//     q: "How do I create a free digital signature online?",
//     a: "Simply open the Sign PDF tool above, draw your signature using your mouse, trackpad, or touchscreen, then click 'Use This Signature'. Your free digital signature is instantly ready to place on any PDF document.",
//   },
//   {
//     q: "Can I add a digital signature to a PDF for free without software?",
//     a: "Yes. PDFLinx works entirely in your browser — no software download, no installation, no account needed. Just upload your PDF, draw or upload your signature, position it, and download the signed PDF instantly.",
//   },
//   {
//     q: "Can I draw my signature online?",
//     a: "Yes. You can draw your signature using your mouse, trackpad, or touchscreen directly in the browser. The drawing canvas supports smooth, natural signature drawing on both desktop and mobile.",
//   },
//   {
//     q: "Can I upload a signature image instead of drawing?",
//     a: "Yes. Upload any PNG or JPG image of your handwritten signature. The tool will overlay it on your PDF exactly where you position it in the live preview.",
//   },
//   {
//     q: "Can I see where my signature will appear before downloading?",
//     a: "Yes. The live preview panel shows your PDF with the signature overlay in real-time. Simply drag the signature box to position it exactly where you want — no guessing.",
//   },
//   {
//     q: "Are my files safe when signing a PDF?",
//     a: "Yes. All uploaded files are processed automatically on secure servers and deleted immediately after signing. We never store your PDFs, signatures, or personal data permanently.",
//   },
//   {
//     q: "Can I sign specific pages of a multi-page PDF?",
//     a: "Yes. Use the page selector to choose exactly which page you want to sign. The live preview will show all pages, and you can click any page to select it for signing.",
//   },
//   {
//     q: "Does the signed PDF have watermarks?",
//     a: "No. PDFLinx never adds watermarks to your signed PDF documents. The output file is completely clean with only your signature applied.",
//   },
//   {
//     q: "Can I use this digital signature tool on my phone or tablet?",
//     a: "Yes. PDFLinx Sign PDF works on all devices including iPhones, Android phones, and tablets. Touch support lets you draw your signature with your finger directly on mobile browsers.",
//   },
// ];

// // ==================== SIGN PDF PREVIEW COMPONENT ====================
// function SignPdfPreview({
//   pdfDoc,
//   totalPages,
//   pageNumber,
//   signaturePreview,
//   xPosition,
//   yPosition,
//   signatureWidth,
//   signatureHeight,
//   scale,
//   setScale,
//   canvasRefs,
//   renderKey,
//   handleSignatureDrag,
//   handleSignatureDragStart,
//   handleSignatureDragEnd,
//   selectPage,
//   pdfFile,
// }) {
//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

//   return (
//     <div className="w-full">
//       {/* Zoom controls */}
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-semibold text-slate-700">Live PDF Preview</h3>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5))}
//             className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             title="Zoom In"
//           >
//             <ZoomIn className="w-4 h-4" />
//           </button>
//           <span className="text-xs text-gray-600 min-w-10 text-center font-medium">
//             {Math.round(scale * 100)}%
//           </span>
//           <button
//             type="button"
//             onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5))}
//             className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             title="Zoom Out"
//           >
//             <ZoomOut className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* Preview area */}
//       {!pdfFile ? (
//         <div className="flex items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
//           <div className="text-center text-gray-400">
//             <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
//             <p className="text-sm">Upload a PDF to see live preview</p>
//             <p className="text-xs text-gray-300 mt-1">
//               See your digital signature placement in real-time
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div
//           // className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-100 p-3 space-y-4"
//           className="relative rounded-[28px] bg-[#eef1f6] space-y-8"
//           // style={{ maxHeight: "90vh" }}
//           style={{ maxHeight: "calc(100vh - 120px)" }}
//           onMouseMove={handleSignatureDrag}
//           onMouseUp={handleSignatureDragEnd}
//           onMouseLeave={handleSignatureDragEnd}
//           onTouchMove={handleSignatureDrag}
//           onTouchEnd={handleSignatureDragEnd}
//         >
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <div
//               key={`page-${index}-${renderKey}`}
//               className={`relative flex justify-center cursor-pointer transition-all ${pageNumber === index + 1
//                 ? "ring-4 ring-blue-500 rounded-xl p-1.5 bg-blue-50"
//                 : "hover:ring-2 hover:ring-gray-300 rounded-xl p-1.5"
//                 }`}
//               onClick={() => selectPage(index + 1)}
//             >
//               <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded z-10 font-medium">
//                 Page {index + 1}
//               </div>
//               <div className="relative inline-block shadow-xl max-w-full overflow-hidden">
//                 <canvas
//                   ref={(el) => {
//                     if (el) canvasRefs.current[index] = el;
//                   }}
//                   className="bg-white block"
//                   style={{ display: "block", maxWidth: "100%", height: "auto" }}
//                 />
//                 {signaturePreview && pageNumber === index + 1 && (
//                   <div
//                     className="absolute cursor-move border-2 border-blue-500 shadow-lg"
//                     style={{
//                       left: `${xPosition}px`,
//                       top: `${yPosition}px`,
//                       width: `${signatureWidth}px`,
//                       height: `${signatureHeight}px`,
//                     }}
//                     onMouseDown={handleSignatureDragStart}
//                     onTouchStart={handleSignatureDragStart}
//                     title="Drag to move digital signature"
//                   >
//                     <img
//                       src={signaturePreview}
//                       alt="Digital signature on PDF"
//                       className="w-full h-full object-contain bg-white/90 pointer-events-none"
//                       draggable={false}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {!pdfDoc && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
//               <div className="text-center">
//                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                 <p className="text-sm text-gray-500">Loading PDF preview…</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       <p className="text-xs text-gray-400 mt-2 text-center">
//         💡 Click a page to select it, then drag the signature to position it
//       </p>
//     </div>
//   );
// }

// // ==================== MAIN COMPONENT ====================
// export default function SignPdf({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   // ── PDF state ──
//   const [pdfFile, setPdfFile] = useState(null);
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [pdfJsReady, setPdfJsReady] = useState(false);
//   const [renderKey, setRenderKey] = useState(0);
//   const canvasRefs = useRef([]);
//   const toolCardRef = useRef(null);

//   // ── Signature state ──
//   const [signatureImage, setSignatureImage] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState("");
//   const [activeTab, setActiveTab] = useState("draw");
//   const signCanvasRef = useRef(null);
//   const isDrawing = useRef(false);

//   // ── Position / size state ──
//   const [pageNumber, setPageNumber] = useState(1);
//   const [xPosition, setXPosition] = useState(50);
//   const [yPosition, setYPosition] = useState(50);
//   const [signatureWidth, setSignatureWidth] = useState(150);
//   const [signatureHeight, setSignatureHeight] = useState(75);
//   const [scale, setScale] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });

//   // ── UI state ──
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [outputFilename, setOutputFilename] = useState("signed.pdf");

//   // ── Helpers ──
//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

//   const resetAllForNewPdf = () => {
//     setPdfDoc(null);
//     setTotalPages(1);
//     setPageNumber(1);
//     setScale(1);
//     canvasRefs.current = [];
//     setXPosition(50);
//     setYPosition(50);
//     setRenderKey(0);
//   };

//   const resetSignature = () => {
//     setSignatureImage(null);
//     setSignaturePreview("");
//   };

//   // ── Sync pdfFile from flow.files ──
//   useEffect(() => {
//     const f = flow.files?.[0] || null;
//     if (f !== pdfFile) {
//       setPdfFile(f);
//       if (f) {
//         resetAllForNewPdf();
//         setError("");
//         setOutputFilename(f.name.replace(/\.pdf$/i, "") + "-signed.pdf");
//       }
//     }
//   }, [flow.files]);

//   // ── Load PDF doc ──
//   useEffect(() => {
//     if (!pdfFile) return;
//     let cancelled = false;
//     let tries = 0;

//     const load = async () => {
//       const lib = window?.pdfjsLib;
//       if (!lib) {
//         if (tries++ < 60) return setTimeout(load, 50);
//         if (!cancelled) setError("PDF preview engine failed to load.");
//         return;
//       }
//       try {
//         setError("");
//         const buf = await pdfFile.arrayBuffer();
//         const doc = await lib.getDocument({ data: buf }).promise;
//         if (cancelled) return;
//         setPdfDoc(doc);
//         setTotalPages(doc.numPages);
//         setPageNumber(1);
//         canvasRefs.current = new Array(doc.numPages).fill(null);
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError("Failed to load PDF for preview.");
//       }
//     };

//     load();
//     return () => { cancelled = true; };
//   }, [pdfFile]);

//   // ── Render all pages ──
//   useEffect(() => {
//     if (!pdfDoc) return;
//     let cancelled = false;

//     const renderAll = async () => {
//       try {
//         await new Promise((r) => setTimeout(r, 100));
//         for (let i = 1; i <= totalPages; i++) {
//           if (cancelled) return;
//           const canvas = canvasRefs.current[i - 1];
//           if (!canvas) continue;
//           const page = await pdfDoc.getPage(i);
//           const viewport = page.getViewport({ scale });
//           const ctx = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           await page.render({ canvasContext: ctx, viewport }).promise;
//         }
//       } catch (e) {
//         console.error("Render error:", e);
//         if (!cancelled) setError("Failed to render PDF preview.");
//       }
//     };

//     renderAll();
//     return () => { cancelled = true; };
//   }, [pdfDoc, totalPages, scale, renderKey]);

//   useEffect(() => {
//     if (pdfDoc) setRenderKey((prev) => prev + 1);
//   }, [scale]);

//   // ── Drawing ──
//   const getCanvasCoords = (e, canvas) => {
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     return {
//       x: (clientX - rect.left) * scaleX,
//       y: (clientY - rect.top) * scaleY,
//     };
//   };

//   const startDrawing = (e) => {
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;
//     e.preventDefault();
//     const { x, y } = getCanvasCoords(e, canvas);
//     const ctx = canvas.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.strokeStyle = "#1e293b";
//     ctx.lineWidth = 3;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     isDrawing.current = true;
//   };

//   const draw = (e) => {
//     if (!isDrawing.current) return;
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;
//     e.preventDefault();
//     const { x, y } = getCanvasCoords(e, canvas);
//     const ctx = canvas.getContext("2d");
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => { isDrawing.current = false; };

//   const clearCanvas = () => {
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;
//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//     resetSignature();
//   };

//   const saveCanvasAsImage = () => {
//     const canvas = signCanvasRef.current;
//     if (!canvas) return;
//     canvas.toBlob((blob) => {
//       if (!blob) return;
//       const file = new File([blob], "signature.png", { type: "image/png" });
//       setSignatureImage(file);
//       const url = URL.createObjectURL(blob);
//       setSignaturePreview(url);
//       setError("");
//     }, "image/png");
//   };

//   const handleSignatureUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       setError("Please upload a valid image (PNG/JPG).");
//       return;
//     }
//     setSignatureImage(file);
//     setSignaturePreview(URL.createObjectURL(file));
//     setError("");
//   };

//   // ── Drag signature ──
//   const handleSignatureDragStart = (e) => {
//     if (!signaturePreview) return;
//     const canvas = canvasRefs.current[pageNumber - 1];
//     if (!canvas) return;
//     const rect = canvas.parentElement.getBoundingClientRect();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     setIsDragging(true);
//     dragStart.current = {
//       x: clientX - rect.left - xPosition,
//       y: clientY - rect.top - yPosition,
//     };
//   };

//   const handleSignatureDrag = (e) => {
//     if (!isDragging) return;
//     const canvas = canvasRefs.current[pageNumber - 1];
//     if (!canvas) return;
//     const rect = canvas.parentElement.getBoundingClientRect();
//     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//     const newX = clientX - rect.left - dragStart.current.x;
//     const newY = clientY - rect.top - dragStart.current.y;
//     setXPosition(clamp(newX, 0, rect.width - signatureWidth));
//     setYPosition(clamp(newY, 0, rect.height - signatureHeight));
//   };

//   const handleSignatureDragEnd = () => setIsDragging(false);

//   const selectPage = (i) => {
//     setPageNumber(i);
//     const canvas = canvasRefs.current[i - 1];
//     if (!canvas) return;
//     const rect = canvas.parentElement?.getBoundingClientRect();
//     if (!rect) return;
//     setXPosition((x) => clamp(x, 0, rect.width - signatureWidth));
//     setYPosition((y) => clamp(y, 0, rect.height - signatureHeight));
//   };

//   // ── Remove file ──
//   const handleRemoveFile = () => {
//     resetAllForNewPdf();
//     resetSignature();
//     setError("");
//     flow.reset();
//   };

//   // ── Download ──
//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = outputFilename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   // ── Convert / Submit ──
//   const handleConvert = async () => {
//     if (!pdfFile) {
//       setError("Please upload a PDF file!");
//       return;
//     }
//     if (!signatureImage) {
//       setError("Please provide a signature first!");
//       return;
//     }

//     const currentCanvas = canvasRefs.current[pageNumber - 1];
//     if (!currentCanvas) {
//       setError("Preview canvas not ready yet. Please wait a moment and try again.");
//       return;
//     }

//     flow.startProcessing();
//     startProgress();
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("pdfFile", pdfFile);
//       formData.append("signatureImage", signatureImage);
//       formData.append("pageNumber", String(pageNumber));
//       formData.append("xPosition", String(Math.round(xPosition)));
//       formData.append("yPosition", String(Math.round(yPosition)));
//       formData.append("width", String(Math.round(signatureWidth)));
//       formData.append("height", String(Math.round(signatureHeight)));
//       formData.append("scale", String(scale));

//       const displayRect = currentCanvas.getBoundingClientRect();
//       formData.append("previewWidth", String(displayRect.width));
//       formData.append("previewHeight", String(displayRect.height));

//       const res = await fetch("/convert/sign-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Signing failed";
//         try {
//           const j = await res.json();
//           msg = j?.error || msg;
//         } catch { }
//         throw new Error(msg);
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       if (downloadUrl) URL.revokeObjectURL(downloadUrl);
//       setDownloadUrl(url);

//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       const msg = (err?.message || "Something went wrong. Please try again.").toString();
//       setError(msg);
//       flow.handleError(msg);
//       console.error(err);
//     }
//   };

//   // ── Options slot: draw/upload tabs + size controls ──
//   const optionsSlot = (
//     <div className="space-y-5">
//       {/* Signature creation */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h3 className="text-base font-bold text-slate-900">Create your signature</h3>
//         <p className="mt-1 text-sm text-slate-500">Draw with mouse/touch or upload an image.</p>

//         {/* Tab switcher */}
//         <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
//           <button
//             type="button"
//             onClick={() => setActiveTab("draw")}
//             className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${activeTab === "draw"
//               ? "border-blue-600 bg-blue-50 text-blue-700"
//               : "border-gray-200 text-gray-600 hover:border-blue-300"
//               }`}
//           >
//             <PenTool className="w-4 h-4" />
//             Draw Signature
//           </button>

//           <label
//             className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${activeTab === "upload"
//               ? "border-purple-600 bg-purple-50 text-purple-700"
//               : "border-gray-200 text-gray-600 hover:border-purple-300"
//               }`}
//             onClick={() => setActiveTab("upload")}
//           >
//             <ImageIcon className="w-4 h-4" />
//             Upload Image
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleSignatureUpload}
//               className="hidden"
//             />
//           </label>
//         </div>

//         {/* Draw canvas */}
//         {activeTab === "draw" && (
//           <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
//             <p className="text-xs text-gray-500 mb-2">Draw your signature below:</p>
//             <canvas
//               ref={signCanvasRef}
//               width={600}
//               height={300}
//               onMouseDown={startDrawing}
//               onMouseMove={draw}
//               onMouseUp={stopDrawing}
//               onMouseLeave={stopDrawing}
//               onTouchStart={startDrawing}
//               onTouchMove={draw}
//               onTouchEnd={stopDrawing}
//               className="border-2 border-dashed border-gray-300 bg-white w-full rounded-lg cursor-crosshair"
//               style={{ touchAction: "none" }}
//             />
//             <div className="flex gap-2 mt-2">
//               <button
//                 type="button"
//                 onClick={clearCanvas}
//                 className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs font-semibold"
//               >
//                 <Eraser className="w-3.5 h-3.5" />
//                 Clear
//               </button>
//               <button
//                 type="button"
//                 onClick={saveCanvasAsImage}
//                 className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-semibold"
//               >
//                 <CheckCircle className="w-3.5 h-3.5" />
//                 Use This Signature
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Signature ready */}
//         {signaturePreview && (
//           <div className="mt-3 border-2 border-green-400 bg-green-50 rounded-xl p-3 flex items-center gap-3">
//             <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
//             <div className="min-w-0 flex-1">
//               <p className="text-xs font-semibold text-green-700 mb-1">✓ Signature ready</p>
//               <img
//                 src={signaturePreview}
//                 alt="Signature preview"
//                 className="max-h-12 bg-white border border-gray-200 rounded p-1"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={resetSignature}
//               className="text-red-400 hover:bg-red-100 p-1 rounded shrink-0"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Position & size controls */}
//       {pdfFile && signaturePreview && (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
//           <h3 className="text-base font-bold text-slate-900">Position & size</h3>

//           <div>
//             <label className="block text-xs text-slate-500 mb-1">
//               Page:{" "}
//               <span className="font-semibold text-slate-700">
//                 {pageNumber} / {totalPages}
//               </span>
//             </label>
//             <input
//               type="number"
//               min={1}
//               max={totalPages}
//               value={pageNumber}
//               onChange={(e) => selectPage(parseInt(e.target.value) || 1)}
//               className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-slate-500 mb-1">
//               Width:{" "}
//               <span className="font-semibold text-slate-700">
//                 {Math.round(signatureWidth)}px
//               </span>
//             </label>
//             <input
//               type="range"
//               min="50"
//               max="400"
//               value={signatureWidth}
//               onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
//               className="w-full accent-blue-600"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-slate-500 mb-1">
//               Height:{" "}
//               <span className="font-semibold text-slate-700">
//                 {Math.round(signatureHeight)}px
//               </span>
//             </label>
//             <input
//               type="range"
//               min="30"
//               max="220"
//               value={signatureHeight}
//               onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
//               className="w-full accent-blue-600"
//             />
//           </div>

//           <p className="text-xs text-slate-400">
//             💡 Drag the signature box in the preview to reposition it
//           </p>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           <p className="font-semibold">{error}</p>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-sign"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Sign a PDF Online Free — Add Digital Signature",
//             description:
//               "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup, no watermark.",
//             url: "https://pdflinx.com/sign-pdf",
//             step: [
//               { "@type": "HowToStep", position: 1, name: "Upload PDF file", text: "Upload the PDF document you need to sign using the upload area or drag and drop." },
//               { "@type": "HowToStep", position: 2, name: "Create free digital signature", text: "Draw your digital signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature." },
//               { "@type": "HowToStep", position: 3, name: "Position signature on PDF", text: "Drag the signature overlay to your preferred position using the live PDF preview." },
//               { "@type": "HowToStep", position: 4, name: "Download signed PDF", text: "Click Sign PDF to apply your digital signature and download the signed document instantly." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-sign-pdf.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-sign"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pdflinx.com/tools" },
//               { "@type": "ListItem", position: 3, name: "Sign PDF Online Free", item: "https://pdflinx.com/sign-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="faq-schema-sign"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: FAQ_DATA.map((item) => ({
//               "@type": "Question",
//               name: item.q,
//               acceptedAnswer: { "@type": "Answer", text: item.a },
//             })),
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="software-schema-sign"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "SoftwareApplication",
//             name: "PDFLinx Sign PDF — Free Digital Signature Tool",
//             url: "https://pdflinx.com/sign-pdf",
//             applicationCategory: "UtilitiesApplication",
//             operatingSystem: "All",
//             offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
//             description:
//               "Free online tool to add digital signatures to PDF documents. Draw or upload your signature, position with live preview, download instantly. No signup required.",
//             featureList: [
//               "Free digital signature creation online",
//               "Draw signature with mouse or touchscreen",
//               "Upload signature image PNG or JPG",
//               "Live PDF preview with drag-and-drop positioning",
//               "Multi-page PDF support",
//               "No watermark on output",
//               "Files deleted after processing",
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* pdf.js CDN */}
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onReady={() => {
//           if (window?.pdfjsLib) {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//             setPdfJsReady(true);
//           }
//         }}
//       />

//       {/* ==================== TOOL UI ==================== */}
//       <ToolPageLayout
//         title={seo?.h1 || "Sign PDF Online Free"}
//         tagline="No Signup · No Watermark · Live Preview · 100% Free"
//         accept=".pdf,application/pdf"
//         multiple={false}
//         convertLabel="Sign PDF Now"
//         hideSidebar={true}
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsTitle="Signature options"
//         optionsSlot={optionsSlot}
//         processingTitle="Signing your PDF..."
//         processingDescription="Applying your digital signature. Please wait."
//         processingStages={["Uploading", "Applying signature", "Done"]}
//         doneTitle="Your signed PDF is ready"
//         doneDescription="Click download to save your digitally signed PDF."
//         downloadLabel="Download Signed PDF"
//         resetLabel="Sign another PDF"
//         sidebarTitle="Sign PDF"
//         sidebarIcon={<PenTool className="h-5 w-5 text-white" />}
//         sidebarDescription="Add a free digital signature to any PDF — draw or upload, position with live preview."
//         sidebarNotice={
//           <>
//             <p className="text-sm font-semibold text-blue-800">ℹ️ Signature</p>
//             <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
//               <li>Draw or upload signature image</li>
//               <li>Drag to position on any page</li>
//               <li>Resize width & height freely</li>
//               <li>No watermark on output</li>
//             </ul>
//           </>
//         }
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF files only"





//         // customOptionsLayout={
//         //   <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

//         //     {/* LEFT PREVIEW */}
//         //     <div>
//         //       <SignPdfPreview
//         //         pdfFile={pdfFile}
//         //         pdfDoc={pdfDoc}
//         //         totalPages={totalPages}
//         //         pageNumber={pageNumber}
//         //         signaturePreview={signaturePreview}
//         //         xPosition={xPosition}
//         //         yPosition={yPosition}
//         //         signatureWidth={signatureWidth}
//         //         signatureHeight={signatureHeight}
//         //         scale={scale}
//         //         setScale={setScale}
//         //         canvasRefs={canvasRefs}
//         //         renderKey={renderKey}
//         //         handleSignatureDrag={handleSignatureDrag}
//         //         handleSignatureDragStart={handleSignatureDragStart}
//         //         handleSignatureDragEnd={handleSignatureDragEnd}
//         //         selectPage={selectPage}
//         //       />
//         //     </div>

//         //     {/* RIGHT SIDEBAR */}
//         //     <div className="space-y-4 xl:sticky xl:top-6 h-fit">
//         //       {optionsSlot}

//         //       {/* Sign + Error */}
//         //       {error && (
//         //         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//         //           <p className="font-semibold">{error}</p>
//         //         </div>
//         //       )}

//         //       <button
//         //         type="button"
//         //         onClick={handleConvert}
//         //         disabled={!pdfFile || !signatureImage}
//         //         className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${pdfFile && signatureImage
//         //             ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
//         //             : "cursor-not-allowed bg-slate-300"
//         //           }`}
//         //       >
//         //         Sign PDF Now
//         //       </button>
//         //     </div>
//         //     {/* <div className="space-y-4 xl:sticky xl:top-6 h-fit">
//         //       {optionsSlot}
//         //     </div> */}

//         //   </div>
//         // }



//         customOptionsLayout={
//           <div className="min-h-[calc(100vh-120px)] rounded-[28px] border border-slate-200 bg-[#f3f5f9] overflow-hidden shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

//             {/* TOP TOOLBAR */}
//             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

//               {/* LEFT */}
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f24d0d] text-white shadow-lg">
//                   <PenTool className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-base font-bold text-slate-900">
//                     Sign PDF
//                   </h2>

//                   <p className="text-xs text-slate-500">
//                     Draw or upload your signature and place it anywhere
//                   </p>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="hidden md:flex items-center gap-2">

//                 <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
//                   {pdfFile ? pdfFile.name : "No file selected"}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleRemoveFile}
//                   className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
//                 >
//                   Remove
//                 </button>

//               </div>
//             </div>

//             {/* MAIN WORKSPACE */}
//             <div className="grid grid-cols-1 xl:grid-cols-[1fr_370px]">

//               {/* ================= LEFT PREVIEW ================= */}
//               <div className="relative bg-[#eef1f6]">

//                 {/* Preview Toolbar */}
//                 <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur px-5 py-3">

//                   <div className="flex items-center justify-between">

//                     <div>
//                       <h3 className="text-sm font-bold text-slate-800">
//                         PDF Preview
//                       </h3>

//                       <p className="text-xs text-slate-500">
//                         Click page and drag signature to reposition
//                       </p>
//                     </div>

//                     {/* Zoom */}
//                     <div className="flex items-center gap-2">

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setScale((s) =>
//                             clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5)
//                           )
//                         }
//                         className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
//                       >
//                         <ZoomOut className="h-4 w-4" />
//                       </button>

//                       <div className="min-w-[72px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-bold text-slate-700">
//                         {Math.round(scale * 100)}%
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setScale((s) =>
//                             clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5)
//                           )
//                         }
//                         className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
//                       >
//                         <ZoomIn className="h-4 w-4" />
//                       </button>

//                     </div>

//                   </div>

//                 </div>

//                 {/* Preview Area */}
//                 <div className="h-[calc(100vh-220px)] overflow-auto p-6">

//                   <div className="mx-auto max-w-[950px]">

//                     <SignPdfPreview
//                       pdfFile={pdfFile}
//                       pdfDoc={pdfDoc}
//                       totalPages={totalPages}
//                       pageNumber={pageNumber}
//                       signaturePreview={signaturePreview}
//                       xPosition={xPosition}
//                       yPosition={yPosition}
//                       signatureWidth={signatureWidth}
//                       signatureHeight={signatureHeight}
//                       scale={scale}
//                       setScale={setScale}
//                       canvasRefs={canvasRefs}
//                       renderKey={renderKey}
//                       handleSignatureDrag={handleSignatureDrag}
//                       handleSignatureDragStart={handleSignatureDragStart}
//                       handleSignatureDragEnd={handleSignatureDragEnd}
//                       selectPage={selectPage}
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* ================= RIGHT SIDEBAR ================= */}
//               <div className="border-l border-slate-200 bg-white">

//                 <div className="sticky top-0 h-[calc(100vh-120px)] overflow-y-auto">

//                   {/* Sidebar Header */}
//                   <div className="border-b border-slate-200 px-5 py-5">

//                     <h3 className="text-lg font-bold text-slate-900">
//                       Signature Settings
//                     </h3>

//                     <p className="mt-1 text-sm text-slate-500">
//                       Create, resize and position your signature
//                     </p>

//                   </div>

//                   {/* Sidebar Body */}
//                   <div className="space-y-5 p-5">

//                     {optionsSlot}

//                     {/* Action Card */}
//                     <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-orange-50 to-red-50 p-5">

//                       <div className="flex items-start gap-3">

//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f24d0d] text-white shadow-lg">
//                           <Shield className="h-5 w-5" />
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-bold text-slate-900">
//                             Secure PDF Signing
//                           </h4>

//                           <p className="mt-1 text-xs leading-5 text-slate-600">
//                             Your files are encrypted and automatically deleted after processing.
//                           </p>
//                         </div>

//                       </div>

//                     </div>

//                     {/* Error */}
//                     {error && (
//                       <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                         <p className="font-semibold">{error}</p>
//                       </div>
//                     )}

//                     {/* Sign Button */}
//                     <button
//                       type="button"
//                       onClick={handleConvert}
//                       disabled={!pdfFile || !signatureImage}
//                       className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98]
//               ${pdfFile && signatureImage
//                           ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_18px_40px_rgba(242,77,13,0.35)]"
//                           : "cursor-not-allowed bg-slate-300"
//                         }`}
//                     >
//                       Sign PDF Now
//                     </button>

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>
//         }




//         uploadLanding={{
//           content: {
//             eyebrow: "SIGN PDF",

//             heroTitle: (
//               <>
//                 Sign PDF Online <br />
//                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
//                   free & instantly
//                 </em>
//               </>
//             ),

//             heroDescription:
//               "Add a free digital signature to any PDF online — draw your signature with mouse or touchscreen, or upload an image. Position with live preview and download your signed PDF instantly. No signup, no software, no watermark.",

//             noticeTitle: "Signature output",

//             noticeItems: [
//               "Draw or upload signature image",
//               "Live preview with drag positioning",
//               "Single signed PDF download",
//             ],

//             howToTitle: "How to sign a PDF online",

//             howToSubtitle:
//               "Upload your PDF, create your signature, drag it into position on the live preview, and download the signed PDF instantly.",

//             howToSteps: [
//               {
//                 n: "1",
//                 title: "Upload your PDF",
//                 desc: "Select the PDF document you need to sign from your device or drag and drop it into the uploader.",
//                 color: "bg-blue-600",
//               },
//               {
//                 n: "2",
//                 title: "Create your signature",
//                 desc: "Draw your signature using mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature.",
//                 color: "bg-purple-600",
//               },
//               {
//                 n: "3",
//                 title: "Position & download",
//                 desc: "Drag the signature to your preferred position on the live preview, then download the signed PDF instantly.",
//                 color: "bg-emerald-600",
//               },
//             ],

//             whyTitle: "Why use PDFLinx to sign PDF?",

//             whyItems: [
//               {
//                 title: "Free Digital Signature",
//                 desc: "Create and add a free digital signature to any PDF — no subscription, no hidden fees, unlimited use.",
//                 icon: PenTool,
//                 iconColor: "text-blue-600",
//                 bgColor: "bg-blue-100",
//               },
//               {
//                 title: "Draw or Upload",
//                 desc: "Draw your signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature.",
//                 icon: ImageIcon,
//                 iconColor: "text-purple-600",
//                 bgColor: "bg-purple-100",
//               },
//               {
//                 title: "Live PDF Preview",
//                 desc: "See exactly where your signature will appear — drag it to any position on any page before downloading.",
//                 icon: Zap,
//                 iconColor: "text-green-600",
//                 bgColor: "bg-green-100",
//               },
//               {
//                 title: "No Watermark",
//                 desc: "Your signed PDF is completely clean — no watermarks, no branding, just your signature on the document.",
//                 icon: Shield,
//                 iconColor: "text-slate-600",
//                 bgColor: "bg-slate-100",
//               },
//               {
//                 title: "Works on Mobile",
//                 desc: "Use PDFLinx on iPhone, Android, tablet, or desktop — touch support lets you draw your signature with your finger.",
//                 icon: MonitorSmartphone,
//                 iconColor: "text-orange-500",
//                 bgColor: "bg-orange-50",
//               },
//               {
//                 title: "Files Auto-Deleted",
//                 desc: "Your PDF and signature are never stored permanently — processed securely and deleted immediately after signing.",
//                 icon: Lock,
//                 iconColor: "text-rose-500",
//                 bgColor: "bg-rose-50",
//               },
//             ],

//             seoBadge: "PDF Signature Guide",

//             seoTitle: "Free Online Sign PDF Tool by PDFLinx",

//             seoDescription:
//               "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup needed.",

//             seoSections: [
//               {
//                 title: "Draw Your Signature Online for Free",
//                 desc: "Use the built-in drawing canvas to create a smooth, natural signature with your mouse, trackpad, or touchscreen — no stylus or special hardware needed.",
//               },
//               {
//                 title: "Upload a Signature Image",
//                 text: "Already have a scanned or photographed signature? Upload any PNG or JPG image and it will be overlaid on your PDF exactly where you position it.",
//               },
//               {
//                 title: "Live Preview with Drag Positioning",
//                 text: "The live PDF preview shows all pages with your signature overlay in real-time. Simply drag the signature box to position it perfectly before downloading.",
//               },
//               {
//                 title: "Multi-Page PDF Support",
//                 text: "Sign any specific page of a multi-page PDF document. Select the page number and position your signature exactly where it needs to appear.",
//               },
//               {
//                 title: "Works on All Devices",
//                 text: "Use the PDFLinx sign PDF tool in your browser on Windows, macOS, Linux, Android, iPhone, and tablets — no app or software installation required.",
//               },
//               {
//                 title: "No Signup, No Watermark",
//                 text: "Add a digital signature to PDF online for free with no account required, no watermark added, and files permanently deleted after signing.",
//               },
//             ],

//             faqTitle: "Frequently asked questions",

//             faqs: FAQ_DATA,
//           },
//         }}
//       />

//     </>
//   );
// }






