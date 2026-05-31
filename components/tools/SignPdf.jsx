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
  CheckCircle,
  X,
  RotateCcw,
  Type,
  Download,
  Move,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Shield, LockOpen, Stamp, EyeOff,
  Pencil, Hash, Minimize2, GitMerge
} from "lucide-react";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


const DONE_LINKS = [
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Unlock PDF", href: "/unlock-pdf", icon: <LockOpen className="h-4 w-4 text-green-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
  { label: "Redact PDF", href: "/redact-pdf", icon: <EyeOff className="h-4 w-4 text-gray-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
];



// ============================================================
// ✅ SINGLE SOURCE OF TRUTH — FAQ_DATA
// Used in:
//   1. uploadLanding → faqs: FAQ_DATA  (UI rendering)
//   2. <Script id="faq-schema-sign">    (JSON-LD FAQPage schema)
// DO NOT duplicate inline in uploadLanding — always reference here.
// ============================================================
const FAQ_DATA = [
  {
    q: "Is the PDFLinx digital signature tool free?",
    a: "Yes. PDFLinx is a completely free digital signature tool — no hidden costs, no subscriptions, and no limits on how many PDFs you can sign. Create a free digital signature and add it to unlimited PDFs.",
  },
  {
    q: "How do I create a free digital signature online?",
    a: "Upload your PDF to PDFLinx, then use the drawing canvas to draw your signature with your mouse, trackpad, or finger on touchscreen. Alternatively, upload a PNG or JPG image of your handwritten signature. Position it on the PDF using the live preview and download the signed document instantly — no account required.",
  },
  {
    q: "Can I create a digital signature for free without software?",
    a: "Yes. PDFLinx works entirely in your browser — no software, no app, and no browser extension required. Create a free digital signature online and sign any PDF instantly without installing anything.",
  },
  {
    q: "How do I sign a PDF on iPhone for free?",
    a: "Open PDFLinx in your iPhone browser (Safari or Chrome) — no app download needed. Tap the upload area, select your PDF from Files, draw or upload your signature using touch, position it on the live preview, and download the signed PDF to your iPhone instantly. The fastest free digital signature tool for iOS.",
  },
  {
    q: "How do I sign a PDF on Android for free?",
    a: "Open PDFLinx in your Android browser (Chrome or Firefox). Upload your PDF, draw your signature using your finger on the touchscreen or upload a signature image, position it, and download the signed PDF. No app installation required — works directly in any Android browser.",
  },
  {
    q: "How do I sign a PDF on Mac for free?",
    a: "Open PDFLinx in Safari, Chrome, or Firefox on your Mac. Upload your PDF, draw or upload your signature, position it on the live preview, and download the signed PDF. No software installation needed — completely free alternative to Adobe Acrobat Sign on Mac.",
  },
  {
    q: "How do I sign a PDF on Windows 10 or Windows 11?",
    a: "Open PDFLinx in any browser on Windows — Chrome, Edge, or Firefox. Upload your PDF, create your digital signature by drawing or uploading an image, position it, and download the signed PDF. No additional software needed. Works on Windows 10 and Windows 11.",
  },
  {
    q: "Can I upload a signature image instead of drawing?",
    a: "Yes. If you already have a scanned or photographed signature, upload any PNG or JPG image and it will be overlaid on your PDF exactly where you position it. Both drawing and image upload are supported.",
  },
  {
    q: "Does PDFLinx add a watermark to signed PDFs?",
    a: "No. PDFLinx never adds any watermark to your signed PDF. The output is 100% clean and professional — just your signature on the document, nothing else.",
  },
  {
    q: "Is a digital signature the same as an e-signature?",
    a: "Digital signature and e-signature (electronic signature) are often used interchangeably for online document signing. Both refer to adding a signature to a document electronically — without printing, signing by hand, and scanning. PDFLinx lets you create a free e-signature online in seconds.",
  },
  {
    q: "Can I sign a multi-page PDF?",
    a: "Yes. PDFLinx supports multi-page PDFs. You can select the specific page where your signature needs to appear and position it precisely using the live preview before downloading.",
  },
  {
    q: "Are my uploaded PDF files secure?",
    a: "Yes. All files are transferred over 256-bit SSL encryption and permanently deleted from our servers immediately after signing. We do not store, share, or view your documents at any point. PDFLinx is GDPR-aware and privacy-first.",
  },
  {
    q: "Do I need to sign up to sign a PDF?",
    a: "No. No account, no registration, and no email required. Sign PDF files instantly for free — completely anonymous.",
  },
  {
    q: "Can I download my digital signature as an image?",
    a: "The signed PDF is available for direct download immediately after signing. If you need the signature as a standalone image file, you can draw your signature, take a screenshot, and save it — or use the upload option with a pre-saved signature image for future use.",
  },
  {
    q: "What is the difference between a digital signature and a handwritten signature?",
    a: "A handwritten signature is a physical mark made with pen on paper. A digital signature (or e-signature) is an electronic version added to a document online — drawn with a mouse, finger, or stylus, or uploaded as an image. PDFLinx lets you create a free digital signature that looks identical to your handwritten signature and can be added to any PDF instantly.",
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
    isDrawingRef.current = true;
    currentPathRef.current = [getCoords(e, canvas)];
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
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${activeTab === t.id
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
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">Size</span>
                  {STROKES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStrokeWidth(s)}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all ${strokeWidth === s ? "border-[#f24d0d] bg-orange-50" : "border-slate-200"
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

              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <canvas
                  ref={canvasRef}
                  width={540}
                  height={260}
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

              <div className="flex flex-wrap items-center justify-between gap-2">
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
              <div className="grid grid-cols-2 gap-2">
                {TYPE_FONTS.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTypeFontIdx(i)}
                    className={`rounded-2xl border-2 py-4 text-2xl transition-all ${typeFontIdx === i
                      ? "border-[#f24d0d] bg-orange-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    style={{ fontFamily: `'${f.name}', cursive`, color: typeColor }}
                  >
                    {typedText || f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
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
              <div className="flex justify-end gap-2 flex-wrap">
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

// ==================== THUMBNAIL STRIP ====================
function ThumbnailStrip({ pdfDoc, totalPages, pageNumber, canvasThumbRefs, onSelectPage }) {
  return (
    <div className="hidden lg:flex flex-col gap-2 overflow-y-auto bg-[#2a2a2a] p-3"
      style={{ width: 100, minHeight: 0 }}
    >
      {Array.from({ length: totalPages }).map((_, i) => {
        const pg = i + 1;
        return (
          <div
            key={pg}
            onClick={() => onSelectPage(pg)}
            className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${pageNumber === pg
              ? "border-[#f24d0d] shadow-[0_0_0_2px_rgba(242,77,13,0.4)]"
              : "border-transparent hover:border-slate-400"
              }`}
          >
            <canvas
              ref={(el) => { if (el) canvasThumbRefs.current[i] = el; }}
              className="block w-full bg-white"
              style={{ display: "block" }}
            />
            <div className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-0.5 ${pageNumber === pg ? "bg-[#f24d0d] text-white" : "bg-black/50 text-white"
              }`}>
              {pg}
            </div>
          </div>
        );
      })}
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
  const canvasThumbRefs = useRef([]);

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    canvasThumbRefs.current = [];
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
        canvasThumbRefs.current = new Array(doc.numPages).fill(null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load PDF for preview.");
      }
    };
    load();
    return () => { cancelled = true; };
  }, [pdfFile]);

  // ── Render main canvases ──
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

  // ── Render thumbnails ──
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    const renderThumbs = async () => {
      try {
        for (let i = 1; i <= totalPages; i++) {
          if (cancelled) return;
          const canvas = canvasThumbRefs.current[i - 1];
          if (!canvas) continue;
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.18 });
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        console.error("Thumb render error:", e);
      }
    };
    renderThumbs();
    return () => { cancelled = true; };
  }, [pdfDoc, totalPages]);

  useEffect(() => {
    if (pdfDoc) setRenderKey((prev) => prev + 1);
  }, [scale]);

  // ── Scroll active page into view ──
  const pageRefs = useRef([]);
  useEffect(() => {
    const el = pageRefs.current[pageNumber - 1];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pageNumber]);

  // ── Drag signature ──
  const handleSignatureDragStart = (e) => {
    if (!signaturePreview) return;
    const canvas = canvasRefs.current[pageNumber - 1];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
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
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newX = clientX - rect.left - dragStart.current.x;
    const newY = clientY - rect.top - dragStart.current.y;
    setXPosition(clamp(newX, 0, rect.width - signatureWidth));
    setYPosition(clamp(newY, 0, rect.height - signatureHeight));
  };

  const handleSignatureDragEnd = () => setIsDragging(false);

  const selectPage = (i) => setPageNumber(i);

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

  const handleSignatureSave = (dataUrl) => {
    setShowSignModal(false);
    setSignaturePreview(dataUrl);
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], "signature.png", { type: "image/png" });
        setSignatureImage(file);
        setError("");
      });
  };

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

  // ==================== customOptionsLayout ====================
  const customOptionsLayout = (
    <div
      className="flex overflow-hidden bg-[#f3f5f9]"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ── 1. THUMBNAIL STRIP ── */}
      <ThumbnailStrip
        pdfDoc={pdfDoc}
        totalPages={totalPages}
        pageNumber={pageNumber}
        canvasThumbRefs={canvasThumbRefs}
        onSelectPage={selectPage}
      />

      {/* ── 2. MAIN PREVIEW AREA ── */}
      <div className="relative flex flex-1 flex-col min-w-0 bg-[#525659]">
        <div
          className="flex-1 overflow-auto p-4 md:p-8"
          onMouseMove={handleSignatureDrag}
          onMouseUp={handleSignatureDragEnd}
          onMouseLeave={handleSignatureDragEnd}
          onTouchMove={handleSignatureDrag}
          onTouchEnd={handleSignatureDragEnd}
        >
          <div className="mx-auto flex flex-col items-center gap-8 max-w-full">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pg = index + 1;
              return (
                <div
                  key={`page-${index}-${renderKey}`}
                  ref={(el) => (pageRefs.current[index] = el)}
                  onClick={() => selectPage(pg)}
                  className="relative shadow-2xl cursor-pointer"
                  style={{ maxWidth: "100%" }}
                >
                  <div className="relative inline-block overflow-hidden max-w-full">
                    <canvas
                      ref={(el) => { if (el) canvasRefs.current[index] = el; }}
                      className="bg-white block"
                      style={{ display: "block", maxWidth: "100%", height: "auto" }}
                    />
                    {signaturePreview && pageNumber === pg && (
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
                      >
                        <div className="relative w-full h-full border-2 border-dashed border-[#f24d0d] rounded-sm shadow-[0_0_0_1px_rgba(242,77,13,0.15)]">
                          <img
                            src={signaturePreview}
                            alt="Signature"
                            className="w-full h-full object-contain bg-white/90 pointer-events-none"
                            draggable={false}
                          />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg bg-[#f24d0d] px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap pointer-events-none">
                            <Move className="w-3 h-3" /> Drag to move
                          </div>
                          <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-sm bg-[#f24d0d] border-2 border-white shadow cursor-se-resize" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex items-center justify-center gap-3 border-t border-black/20 bg-[#3d3d3d] px-4 py-2.5">
          <button
            type="button"
            onClick={() => selectPage(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
            <span>{pageNumber}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">{totalPages}</span>
          </div>
          <button
            type="button"
            onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="h-5 w-px bg-white/20" />
          <button
            type="button"
            onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.3, 3))}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="min-w-[52px] rounded-lg bg-white/10 px-2 py-1.5 text-center text-sm font-bold text-white">
            {Math.round(scale * 100)}%
          </div>
          <button
            type="button"
            onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.3, 3))}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── 3. RIGHT SIDEBAR (desktop) ── */}
      <div className="hidden md:flex flex-col border-l border-slate-200 bg-white overflow-y-auto"
        style={{ width: 300, flexShrink: 0 }}
      >
        <div className="border-b border-slate-100 px-5 py-5">
          <h3 className="text-base font-bold text-slate-900">Signature Settings</h3>
          <p className="mt-0.5 text-xs text-slate-400">Create, resize and position your signature</p>
        </div>

        <div className="space-y-4 p-5 flex-1">
          {/* Signature Creator Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

            {signaturePreview ? (
              <div className="rounded-xl border-2 border-dashed border-green-300 bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-xs font-semibold text-green-700">Signature ready</span>
                </div>
                <img src={signaturePreview} alt="Signature" className="mx-auto max-h-14 object-contain" />
              </div>
            ) : (
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

          {/* Position & Size */}
          {pdfFile && signaturePreview && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Position & Size</h4>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-500 font-medium">Page</label>
                  <span className="text-xs font-bold text-slate-700">{pageNumber} / {totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => selectPage(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                  >‹</button>
                  <div className="flex-1 text-center rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-bold text-slate-700">{pageNumber}</div>
                  <button type="button" onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))} disabled={pageNumber >= totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                  >›</button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-500 font-medium">Width</label>
                  <span className="text-xs font-bold text-slate-700">{Math.round(signatureWidth)}px</span>
                </div>
                <input type="range" min="50" max="400" value={signatureWidth}
                  onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
                  className="w-full accent-[#f24d0d]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-500 font-medium">Height</label>
                  <span className="text-xs font-bold text-slate-700">{Math.round(signatureHeight)}px</span>
                </div>
                <input type="range" min="30" max="220" value={signatureHeight}
                  onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
                  className="w-full accent-[#f24d0d]"
                />
              </div>
              <p className="text-xs text-slate-400">💡 Drag the signature box on the preview to reposition</p>
            </div>
          )}

          {/* Security */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Files are encrypted and auto-deleted after signing.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Sign Button */}
          <button
            type="button"
            onClick={handleConvert}
            disabled={!pdfFile || !signatureImage}
            className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${pdfFile && signatureImage
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

      {/* ── MOBILE DRAWER ── */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f24d0d] text-white shadow-[0_8px_32px_rgba(242,77,13,0.45)] transition active:scale-95"
        >
          <Settings2 className="h-6 w-6" />
        </button>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <div className={`fixed inset-y-0 right-0 z-50 flex w-[min(320px,100vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100">
            <p className="text-base font-bold text-slate-800">Signature Settings</p>
            <button type="button" onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Signature Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Your Signature</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Draw, type or upload</p>
                </div>
                {signaturePreview && (
                  <button type="button" onClick={resetSignature}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {signaturePreview ? (
                <div className="rounded-xl border-2 border-dashed border-green-300 bg-white p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-xs font-semibold text-green-700">Signature ready</span>
                  </div>
                  <img src={signaturePreview} alt="Signature" className="mx-auto max-h-14 object-contain" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <PenTool className="w-5 h-5" />, label: "Draw" },
                    { icon: <Type className="w-5 h-5" />, label: "Type" },
                    { icon: <ImageIcon className="w-5 h-5" />, label: "Upload" },
                  ].map((btn) => (
                    <button key={btn.label} type="button"
                      onClick={() => { setDrawerOpen(false); setShowSignModal(true); }}
                      className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-slate-500 transition-all hover:border-[#f24d0d] hover:bg-orange-50 hover:text-[#f24d0d]"
                    >
                      {btn.icon}
                      <span className="text-[11px] font-semibold">{btn.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {signaturePreview && (
                <button type="button"
                  onClick={() => { setDrawerOpen(false); setShowSignModal(true); }}
                  className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#f24d0d] hover:text-[#f24d0d] transition-all"
                >
                  Change Signature
                </button>
              )}
            </div>

            {/* Position & Size */}
            {pdfFile && signaturePreview && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Position & Size</h4>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-500 font-medium">Page</label>
                    <span className="text-xs font-bold text-slate-700">{pageNumber} / {totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => selectPage(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                    >‹</button>
                    <div className="flex-1 text-center rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-bold text-slate-700">{pageNumber}</div>
                    <button type="button" onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))} disabled={pageNumber >= totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
                    >›</button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-500 font-medium">Width</label>
                    <span className="text-xs font-bold text-slate-700">{Math.round(signatureWidth)}px</span>
                  </div>
                  <input type="range" min="50" max="400" value={signatureWidth}
                    onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
                    className="w-full accent-[#f24d0d]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-500 font-medium">Height</label>
                    <span className="text-xs font-bold text-slate-700">{Math.round(signatureHeight)}px</span>
                  </div>
                  <input type="range" min="30" max="220" value={signatureHeight}
                    onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
                    className="w-full accent-[#f24d0d]"
                  />
                </div>
                <p className="text-xs text-slate-400">💡 Drag the signature box on the preview to reposition</p>
              </div>
            )}

            {/* Security */}
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">Files are encrypted and auto-deleted after signing.</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            )}

            {/* Sign Button */}
            <button
              type="button"
              onClick={() => { setDrawerOpen(false); handleConvert(); }}
              disabled={!pdfFile || !signatureImage}
              className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${pdfFile && signatureImage
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
  );

  // ==================== RENDER ====================
  return (
    <>
      {/* ============================================================
          SEO SCHEMAS — 4 types:
          1. HowTo       → Rich result: step-by-step process
          2. BreadcrumbList → Rich result: site navigation path
          3. FAQPage     → Rich result: expandable Q&A in SERP
          4. SoftwareApplication → Rich result: app rating + price card
          All use FAQ_DATA as single source — no duplication.
          ============================================================ */}

      {/* ── Schema 1: HowTo ── */}
      <Script
        id="schema-howto-sign-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Sign a PDF Online Free — Add Free Digital Signature",
            description:
              "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup, no watermark.",
            url: "https://pdflinx.com/sign-pdf",
            image: "https://pdflinx.com/og-sign-pdf.png",
            totalTime: "PT1M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "USD",
            },
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Upload Your PDF File",
                text: "Upload the PDF document you need to sign using the upload area or drag and drop. Supports any PDF — contracts, agreements, forms, and letters.",
                image: "https://pdflinx.com/og-sign-pdf.png",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Create Your Free Digital Signature",
                text: "Draw your digital signature using mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Create a clean, natural digital signature in seconds.",
                image: "https://pdflinx.com/og-sign-pdf.png",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Position Signature on Live Preview",
                text: "Drag the signature overlay to your preferred position on any page of your PDF using the live preview. Resize width and height to fit perfectly.",
                image: "https://pdflinx.com/og-sign-pdf.png",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Download Signed PDF Instantly",
                text: "Click Sign PDF Now to apply your digital signature and download the signed document instantly. No watermark, no signup, no software required.",
                image: "https://pdflinx.com/og-sign-pdf.png",
              },
            ],
          }, null, 2),
        }}
      />

      {/* ── Schema 2: BreadcrumbList ── */}
      <Script
        id="schema-breadcrumb-sign-pdf"
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
                item: "https://pdflinx.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "PDF Tools",
                item: "https://pdflinx.com/tools",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Sign PDF Online Free",
                item: "https://pdflinx.com/sign-pdf",
              },
            ],
          }, null, 2),
        }}
      />

      {/* ── Schema 3: FAQPage — uses FAQ_DATA (single source of truth) ── */}
      <Script
        id="schema-faq-sign-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }, null, 2),
        }}
      />

      {/* ── Schema 4: SoftwareApplication (WebApp) ── */}
      <Script
        id="software-schema-sign-pdf"
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
            browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2340",
              bestRating: "5",
              worstRating: "1",
            },
            description:
              "Free online tool to add digital signatures to PDF documents. Draw or upload your signature, position with live preview, download instantly. No signup required. Works on iPhone, Android, Mac, and Windows.",
            featureList: [
              "Free digital signature creation online",
              "Draw signature with mouse or touchscreen",
              "Upload signature image PNG or JPG",
              "Type signature with custom fonts",
              "Live PDF preview with drag-and-drop positioning",
              "Multi-page PDF support with page selector",
              "Resize signature width and height freely",
              "No watermark on signed PDF output",
              "256-bit SSL encryption",
              "Files permanently deleted after signing",
              "No signup or account required",
              "Works on iPhone, Android, Mac, Windows",
            ],
            screenshot: "https://pdflinx.com/og-sign-pdf.png",
          }, null, 2),
        }}
      />

      {/* ── PDF.js CDN ── */}
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

      {/* ── ToolPageLayout ── */}
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
        sidebarLinks={DONE_LINKS}
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
            relatedTools: DONE_LINKS,
            eyebrow: "FREE DIGITAL SIGNATURE TOOL",
            breadcrumbCurrent: "Sign PDF",
            heroBadge: "✦ Free Digital Signature — No Signup, No Watermark",

            heroTitle: (
              <>
                Free Digital Signature —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Create & Sign PDF Online Free
                </em>
              </>
            ),

            heroDescription:
              "Create a free digital signature online and sign any PDF instantly — draw with mouse or touchscreen, or upload a signature image. Free digital signature tool with no signup, no watermark, no software needed. Position your e-signature with live preview and download your signed PDF in seconds. Works on Windows, Mac, Android, and iPhone — digital signature online free, no account required.",
            pills: [
              "Sign PDF free",
              "Digital signature free",
              "Create digital signature online",
              "Free e-signature",
              "Draw signature online",
              "Upload signature image",
              "No watermark",
              "Works on mobile",
            ],

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            uploadTitle: "Drop your PDF here to sign",
            uploadSubtitle: "or click to browse — any PDF document supported",

            noticeTitle: "Digital Signature Tool",
            noticeItems: [
              "Draw or upload your signature instantly",
              "Drag & position with live PDF preview",
              "Files deleted after signing — 100% private",
            ],

            rating: "4.8/5",
            ratingText: "Trusted by 70,000+ users monthly",

            howToEyebrow: "How It Works",
            howToTitle: "How to Sign a PDF Online Free — 3 Simple Steps",
            howToSubtitle:
              "Upload your PDF, create your free digital signature, drag it into position on the live preview, and download the signed PDF instantly — no account required.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select the PDF document you need to sign from your device or drag and drop it into the uploader. Supports any PDF — contracts, agreements, forms, and letters. Works on desktop and mobile devices.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Create Your Free Digital Signature",
                desc: "Draw your signature using mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Create a clean, natural digital signature in seconds — no stylus or special hardware needed.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Position & Download Signed PDF",
                desc: "Drag your signature to the exact position on the live PDF preview. Download your signed PDF instantly — no watermark, no signup, no software required.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why Use PDFLinx Free Digital Signature Tool?",

            whyPoints: [
              {
                title: "100% Free Digital Signature, Always",
                desc: "Create and add a free digital signature to any PDF — no subscription, no hidden fees, unlimited use. The fastest free e-signature tool online.",
              },
              {
                title: "Draw or Upload Your Signature",
                desc: "Draw your signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Two flexible options — one clean result.",
              },
              {
                title: "Live PDF Preview with Drag Positioning",
                desc: "See exactly where your signature will appear — drag it to any position on any page before downloading. No guesswork, no reprinting.",
              },
              {
                title: "Works on All Devices",
                desc: "Sign PDFs on iPhone, Android, Windows, or Mac — no app download needed. Touch support lets you draw your signature with your finger on any mobile device.",
              },
              {
                title: "No Watermark, Ever",
                desc: "Your signed PDF is completely clean — no watermarks, no branding, just your signature on the document. 100% professional output.",
              },
              {
                title: "Secure & Private — Files Auto-Deleted",
                desc: "Your PDF and signature are transferred over 256-bit SSL encryption and permanently deleted from our servers immediately after signing. We never store or share your documents.",
              },
            ],

            faqTitle: "Digital Signature — Frequently Asked Questions",

            // ✅ Single source of truth — same array as FAQ schema above
            faqs: FAQ_DATA,

            seoBadge: "Digital Signature Guide",

            seoTitle:
              "Free Digital Signature — Sign PDF Online, Create Free E-Signature Instantly | PDFLinx",

            seoDescription:
              "Free digital signature tool — sign PDF online, draw your e-signature or upload an image, position with live preview, and download instantly. No signup, no watermark. Works on Android, iPhone, Mac, and Windows.",

            seoSections: [
              {
                title: "Free Digital Signature — Sign PDF Online & Create Free E-Signature Instantly",
                text: "Need to sign a PDF online for free? PDFLinx is a free digital signature tool that lets you create and add a free e-signature to any PDF instantly — no signup, no watermark, and no software required. Draw your signature with a mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Position it precisely using the live PDF preview and download your signed document in seconds. A fast and reliable free alternative to Adobe Acrobat Sign, DocuSign, and Smallpdf — without any cost or account.",
              },
              {
                title: "How to Create a Free Digital Signature Online — Draw or Upload",
                text: "Creating a free digital signature online with PDFLinx takes under a minute. Upload your PDF, then choose your signing method: draw your signature using the built-in canvas with your mouse, trackpad, or finger on touchscreen — or upload a PNG or JPG image of your existing handwritten signature. Both methods produce a clean, professional signature that can be dragged to any position on any page of your PDF. No stylus, no special hardware, and no software installation required. The fastest way to create a free digital signature online.",
              },
              {
                title: "Free E-Signature Download — Sign PDF and Download Instantly",
                text: "After creating your free digital signature and positioning it on your PDF, PDFLinx generates the signed document and makes it available for immediate download — no waiting, no email delivery, no account needed. Your signed PDF downloads directly to your device in seconds. This is the fastest free e-signature download experience online — upload, sign, position, and download, all in under two minutes. Works on any device without installing software or browser extensions.",
              },
              {
                title: "When Should You Use a Digital Signature on a PDF?",
                text: "Digital signatures are used whenever a document requires an authorized signature but printing, signing, and scanning is inconvenient. Common use cases include signing employment contracts and offer letters remotely, approving business agreements and NDAs without meeting in person, signing rental agreements and property documents, authorizing government forms and applications, signing invoices and purchase orders for clients, and approving medical consent forms and insurance documents. A free digital signature from PDFLinx is legally valid for informal agreements and internal business processes across most jurisdictions.",
              },
              {
                title: "Digital Signature vs Electronic Signature vs E-Signature — What Is the Difference?",
                text: "The terms digital signature, electronic signature, and e-signature are commonly used interchangeably, and in most everyday contexts they mean the same thing — adding a signature to a document electronically without printing. Technically, a cryptographic digital signature uses encryption keys to verify identity and document integrity, while a visual e-signature is an image or drawn mark added to a PDF. For most personal and business purposes — contracts, agreements, approvals, and forms — a visual e-signature created with PDFLinx is sufficient and universally accepted. Always check the legal requirements for your specific jurisdiction when signing legally binding documents.",
              },
              {
                title: "Sign PDF Free on Any Device — iPhone, Android, Mac, Windows",
                text: "No software installation needed. PDFLinx digital signature tool works perfectly on Windows, Mac, Linux, Android, iPhone, iPad, and tablets — directly in your browser without any app. On iPhone, open PDFLinx in Safari and draw your signature with your finger on the touchscreen. On Android, open in Chrome or Firefox and sign using touch. On Mac or Windows, draw with a mouse or trackpad. The live preview works across all screen sizes — desktop and mobile — making PDFLinx the most accessible free e-signature tool available on any device.",
              },
              {
                title: "Sign PDF Documents for Contracts, Agreements, and Official Forms",
                text: "PDFLinx is designed for signing all types of PDF documents — employment contracts, rental agreements, business NDAs, client proposals, consent forms, government applications, and internal approval documents. Upload any PDF, create your free digital signature, and position it exactly where required. The signed output is a standard PDF compatible with all PDF viewers including Adobe Acrobat Reader, Google Chrome, and Apple Preview — no special software needed to open or verify the signed document.",
              },
              {
                title: "Privacy and File Security — 256-bit SSL Encryption",
                text: "Your uploaded PDF files and signature data are transferred over 256-bit SSL encryption and processed on secure servers. Files are permanently deleted immediately after signing — we do not store, share, or access your documents or signature at any point. PDFLinx is built with privacy-first principles and is GDPR-aware. No account or email is required to use the free digital signature tool. Your documents stay completely private from upload to download.",
              },
            ],

            relatedTitle: "More Free PDF Tools",
            showPdfTypes: false,
          },
        }}
      />

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

// import { useRef, useState, useEffect, useCallback } from "react";
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
//   RotateCcw,
//   Type,
//   Download,
//   Move,
//   ChevronLeft,
//   ChevronRight,
//   Settings2
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

// // ==================== SIGNATURE MODAL ====================
// function SignatureModal({ onSave, onClose }) {
//   const [activeTab, setActiveTab] = useState("draw");
//   const [drawColor, setDrawColor] = useState("#1e293b");
//   const [strokeWidth, setStrokeWidth] = useState(3);
//   const [typedText, setTypedText] = useState("");
//   const [typeFontIdx, setTypeFontIdx] = useState(0);
//   const [typeColor, setTypeColor] = useState("#1e293b");
//   const canvasRef = useRef(null);
//   const isDrawingRef = useRef(false);
//   const pathsRef = useRef([]);
//   const currentPathRef = useRef([]);


//   const COLORS = ["#1e293b", "#e8420a", "#1d4ed8", "#065f46", "#7c3aed"];
//   const STROKES = [2, 3, 5, 8];
//   const TYPE_FONTS = [
//     { name: "Dancing Script", label: "Classic" },
//     { name: "Pacifico", label: "Casual" },
//     { name: "Caveat", label: "Handwritten" },
//     { name: "Sacramento", label: "Elegant" },
//   ];

//   const getCoords = (e, canvas) => {
//     const rect = canvas.getBoundingClientRect();
//     const sx = canvas.width / rect.width;
//     const sy = canvas.height / rect.height;
//     const cx = e.touches ? e.touches[0].clientX : e.clientX;
//     const cy = e.touches ? e.touches[0].clientY : e.clientY;
//     return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
//   };

//   const redraw = useCallback((all, live = []) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     const drawPath = (pts) => {
//       if (pts.length < 2) return;
//       ctx.beginPath();
//       ctx.strokeStyle = drawColor;
//       ctx.lineWidth = strokeWidth;
//       ctx.lineCap = "round";
//       ctx.lineJoin = "round";
//       ctx.moveTo(pts[0].x, pts[0].y);
//       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
//       ctx.stroke();
//     };
//     all.forEach(drawPath);
//     if (live.length) drawPath(live);
//   }, [drawColor, strokeWidth]);

//   const onMouseDown = (e) => {
//     e.preventDefault();
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     isDrawingRef.current = true;
//     currentPathRef.current = [getCoords(e, canvas)];
//   };

//   const onMouseMove = (e) => {
//     if (!isDrawingRef.current) return;
//     e.preventDefault();
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     currentPathRef.current = [...currentPathRef.current, getCoords(e, canvas)];
//     redraw(pathsRef.current, currentPathRef.current);
//   };

//   const onMouseUp = () => {
//     if (!isDrawingRef.current) return;
//     isDrawingRef.current = false;
//     pathsRef.current = [...pathsRef.current, currentPathRef.current];
//     currentPathRef.current = [];
//   };

//   const handleUndo = () => {
//     pathsRef.current = pathsRef.current.slice(0, -1);
//     redraw(pathsRef.current);
//   };

//   const handleClear = () => {
//     pathsRef.current = [];
//     currentPathRef.current = [];
//     const canvas = canvasRef.current;
//     if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//   };

//   const handleDrawSave = () => {
//     const canvas = canvasRef.current;
//     if (!canvas || pathsRef.current.length === 0) return;
//     const ctx = canvas.getContext("2d");
//     const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
//     for (let y = 0; y < canvas.height; y++) {
//       for (let x = 0; x < canvas.width; x++) {
//         if (imgData.data[(y * canvas.width + x) * 4 + 3] > 0) {
//           minX = Math.min(minX, x); minY = Math.min(minY, y);
//           maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
//         }
//       }
//     }
//     const pad = 12;
//     const w = Math.max(1, maxX - minX + pad * 2);
//     const h = Math.max(1, maxY - minY + pad * 2);
//     const trimmed = document.createElement("canvas");
//     trimmed.width = w; trimmed.height = h;
//     trimmed.getContext("2d").drawImage(canvas, minX - pad, minY - pad, w, h, 0, 0, w, h);
//     onSave(trimmed.toDataURL("image/png"));
//   };

//   const handleTypeSave = () => {
//     if (!typedText.trim()) return;
//     const canvas = document.createElement("canvas");
//     canvas.width = 500; canvas.height = 130;
//     const ctx = canvas.getContext("2d");
//     ctx.font = `60px '${TYPE_FONTS[typeFontIdx].name}', cursive`;
//     ctx.fillStyle = typeColor;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(typedText, 250, 65);
//     onSave(canvas.toDataURL("image/png"));
//   };

//   const handleUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onSave(ev.target.result);
//     reader.readAsDataURL(file);
//   };

//   const tabs = [
//     { id: "draw", icon: <PenTool className="w-4 h-4" />, label: "Draw" },
//     { id: "type", icon: <Type className="w-4 h-4" />, label: "Type" },
//     { id: "upload", icon: <ImageIcon className="w-4 h-4" />, label: "Upload" },
//   ];

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
//         style={{ animation: "signModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
//       >
//         <style>{`
//           @keyframes signModalIn {
//             from { opacity: 0; transform: scale(0.92) translateY(16px); }
//             to   { opacity: 1; transform: scale(1)    translateY(0); }
//           }
//           @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Pacifico&family=Caveat:wght@600&family=Sacramento&display=swap');
//         `}</style>

//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f24d0d] text-white">
//               <PenTool className="w-5 h-5" />
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-slate-900">Add Signature</h2>
//               <p className="text-xs text-slate-400">Draw, type, or upload your signature</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="px-6 pt-5">
//           <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
//             {tabs.map((t) => (
//               <button
//                 key={t.id}
//                 type="button"
//                 onClick={() => setActiveTab(t.id)}
//                 className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${activeTab === t.id
//                   ? "bg-white text-[#f24d0d] shadow-sm"
//                   : "text-slate-500 hover:text-slate-700"
//                   }`}
//               >
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="px-6 pb-6 pt-4">

//           {/* ── DRAW TAB ── */}
//           {activeTab === "draw" && (
//             <div className="space-y-3">

//               {/* Color + Stroke — 2 rows for mobile */}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-xs text-slate-400 font-medium">Color</span>
//                   {COLORS.map((c) => (
//                     <button
//                       key={c}
//                       type="button"
//                       onClick={() => setDrawColor(c)}
//                       className="w-6 h-6 rounded-full transition-transform hover:scale-110"
//                       style={{
//                         background: c,
//                         outline: drawColor === c ? `3px solid ${c}` : "none",
//                         outlineOffset: "2px",
//                       }}
//                     />
//                   ))}
//                 </div>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="text-xs text-slate-400 font-medium">Size</span>
//                   {STROKES.map((s) => (
//                     <button
//                       key={s}
//                       type="button"
//                       onClick={() => setStrokeWidth(s)}
//                       className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all ${strokeWidth === s ? "border-[#f24d0d] bg-orange-50" : "border-slate-200"
//                         }`}
//                     >
//                       <div
//                         className="rounded-full"
//                         style={{ width: Math.min(s * 3, 18), height: s, background: drawColor }}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Canvas */}
//               <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
//                 <canvas
//                   ref={canvasRef}
//                   width={540}
//                   height={260}
//                   onMouseDown={onMouseDown}
//                   onMouseMove={onMouseMove}
//                   onMouseUp={onMouseUp}
//                   onMouseLeave={onMouseUp}
//                   onTouchStart={onMouseDown}
//                   onTouchMove={onMouseMove}
//                   onTouchEnd={onMouseUp}
//                   className="w-full cursor-crosshair bg-white"
//                   style={{ touchAction: "none", display: "block" }}
//                 />
//                 {pathsRef.current.length === 0 && (
//                   <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                     <span
//                       className="text-2xl text-slate-300 select-none"
//                       style={{ fontFamily: "'Dancing Script', cursive" }}
//                     >
//                       Sign here…
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={handleUndo}
//                     className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
//                   >
//                     <RotateCcw className="w-3.5 h-3.5" /> Undo
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleClear}
//                     className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
//                   >
//                     <Eraser className="w-3.5 h-3.5" /> Clear
//                   </button>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleDrawSave}
//                     className="flex items-center gap-1.5 rounded-xl bg-[#f24d0d] px-4 py-2 text-xs font-bold text-white hover:bg-[#db4309] transition shadow-[0_4px_14px_rgba(242,77,13,0.3)]"
//                   >
//                     <CheckCircle className="w-3.5 h-3.5" /> Insert
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── TYPE TAB ── */}
//           {activeTab === "type" && (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 value={typedText}
//                 onChange={(e) => setTypedText(e.target.value)}
//                 placeholder="Type your name…"
//                 className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#f24d0d]"
//               />

//               <div className="grid grid-cols-2 gap-2">
//                 {TYPE_FONTS.map((f, i) => (
//                   <button
//                     key={i}
//                     type="button"
//                     onClick={() => setTypeFontIdx(i)}
//                     className={`rounded-2xl border-2 py-4 text-2xl transition-all ${typeFontIdx === i
//                       ? "border-[#f24d0d] bg-orange-50"
//                       : "border-slate-200 bg-white hover:border-slate-300"
//                       }`}
//                     style={{ fontFamily: `'${f.name}', cursive`, color: typeColor }}
//                   >
//                     {typedText || f.label}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex items-center gap-3 flex-wrap">
//                 <span className="text-xs text-slate-400 font-medium">Color</span>
//                 {COLORS.map((c) => (
//                   <button
//                     key={c}
//                     type="button"
//                     onClick={() => setTypeColor(c)}
//                     className="w-7 h-7 rounded-full transition-transform hover:scale-110"
//                     style={{
//                       background: c,
//                       outline: typeColor === c ? `3px solid ${c}` : "none",
//                       outlineOffset: "2px",
//                     }}
//                   />
//                 ))}
//               </div>

//               <div className="flex justify-end gap-2 flex-wrap">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleTypeSave}
//                   disabled={!typedText.trim()}
//                   className="flex items-center gap-1.5 rounded-xl bg-[#f24d0d] px-5 py-2 text-xs font-bold text-white hover:bg-[#db4309] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(242,77,13,0.3)]"
//                 >
//                   <CheckCircle className="w-3.5 h-3.5" /> Insert
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── UPLOAD TAB ── */}
//           {activeTab === "upload" && (
//             <div className="space-y-4">
//               <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 hover:border-[#f24d0d] hover:bg-orange-50 transition-all">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
//                   <ImageIcon className="w-7 h-7" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm font-semibold text-slate-700">Click to upload signature</p>
//                   <p className="text-xs text-slate-400 mt-1">PNG or JPG · Transparent background recommended</p>
//                 </div>
//                 <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
//               </label>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================== THUMBNAIL STRIP COMPONENT ====================
// function ThumbnailStrip({ pdfDoc, totalPages, pageNumber, canvasThumbRefs, onSelectPage }) {
//   return (
//     <div className="hidden lg:flex flex-col gap-2 overflow-y-auto bg-[#2a2a2a] p-3"
//       style={{ width: 100, minHeight: 0 }}
//     >
//       {Array.from({ length: totalPages }).map((_, i) => {
//         const pg = i + 1;
//         return (
//           <div
//             key={pg}
//             onClick={() => onSelectPage(pg)}
//             className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${pageNumber === pg
//               ? "border-[#f24d0d] shadow-[0_0_0_2px_rgba(242,77,13,0.4)]"
//               : "border-transparent hover:border-slate-400"
//               }`}
//           >
//             <canvas
//               ref={(el) => { if (el) canvasThumbRefs.current[i] = el; }}
//               className="block w-full bg-white"
//               style={{ display: "block" }}
//             />
//             <div className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-0.5 ${pageNumber === pg ? "bg-[#f24d0d] text-white" : "bg-black/50 text-white"
//               }`}>
//               {pg}
//             </div>
//           </div>
//         );
//       })}
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
//   const canvasThumbRefs = useRef([]);

//   // ── Signature state ──
//   const [signatureImage, setSignatureImage] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState("");
//   const [showSignModal, setShowSignModal] = useState(false);

//   // ── Position / size state ──
//   const [pageNumber, setPageNumber] = useState(1);
//   const [xPosition, setXPosition] = useState(50);
//   const [yPosition, setYPosition] = useState(50);
//   const [signatureWidth, setSignatureWidth] = useState(150);
//   const [signatureHeight, setSignatureHeight] = useState(75);
//   const [scale, setScale] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const dragStart = useRef({ x: 0, y: 0 });

//   // ── UI state ──
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [outputFilename, setOutputFilename] = useState("signed.pdf");

//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

//   const resetAllForNewPdf = () => {
//     setPdfDoc(null);
//     setTotalPages(1);
//     setPageNumber(1);
//     setScale(1);
//     canvasRefs.current = [];
//     canvasThumbRefs.current = [];
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
//         canvasThumbRefs.current = new Array(doc.numPages).fill(null);
//       } catch (err) {
//         console.error(err);
//         if (!cancelled) setError("Failed to load PDF for preview.");
//       }
//     };
//     load();
//     return () => { cancelled = true; };
//   }, [pdfFile]);

//   // ── Render main canvases ──
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

//   // ── Render thumbnail canvases ──
//   useEffect(() => {
//     if (!pdfDoc) return;
//     let cancelled = false;
//     const renderThumbs = async () => {
//       try {
//         for (let i = 1; i <= totalPages; i++) {
//           if (cancelled) return;
//           const canvas = canvasThumbRefs.current[i - 1];
//           if (!canvas) continue;
//           const page = await pdfDoc.getPage(i);
//           const viewport = page.getViewport({ scale: 0.18 });
//           const ctx = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           await page.render({ canvasContext: ctx, viewport }).promise;
//         }
//       } catch (e) {
//         console.error("Thumb render error:", e);
//       }
//     };
//     renderThumbs();
//     return () => { cancelled = true; };
//   }, [pdfDoc, totalPages]);

//   useEffect(() => {
//     if (pdfDoc) setRenderKey((prev) => prev + 1);
//   }, [scale]);

//   // ── Scroll active page into view ──
//   const pageRefs = useRef([]);
//   useEffect(() => {
//     const el = pageRefs.current[pageNumber - 1];
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   }, [pageNumber]);

//   // ── Drag signature ──
//   const handleSignatureDragStart = (e) => {
//     if (!signaturePreview) return;
//     const canvas = canvasRefs.current[pageNumber - 1];
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
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
//     const rect = canvas.getBoundingClientRect();
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
//   };

//   const handleRemoveFile = () => {
//     resetAllForNewPdf();
//     resetSignature();
//     setError("");
//     flow.reset();
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = outputFilename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleSignatureSave = (dataUrl) => {
//     setShowSignModal(false);
//     setSignaturePreview(dataUrl);
//     fetch(dataUrl)
//       .then((r) => r.blob())
//       .then((blob) => {
//         const file = new File([blob], "signature.png", { type: "image/png" });
//         setSignatureImage(file);
//         setError("");
//       });
//   };

//   const handleConvert = async () => {
//     if (!pdfFile) { setError("Please upload a PDF file!"); return; }
//     if (!signatureImage) { setError("Please provide a signature first!"); return; }
//     const currentCanvas = canvasRefs.current[pageNumber - 1];
//     if (!currentCanvas) {
//       setError("Preview canvas not ready yet. Please wait and try again.");
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

//       const res = await fetch("/convert/sign-pdf", { method: "POST", body: formData });
//       if (!res.ok) {
//         let msg = "Signing failed";
//         try { const j = await res.json(); msg = j?.error || msg; } catch { }
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

//   // ==================== customOptionsLayout ====================
//   const customOptionsLayout = (
//     <div
//       className="flex overflow-hidden bg-[#f3f5f9]"
//       style={{ height: "calc(100vh - 64px)" }}
//     >

//       {/* ════════ 1. THUMBNAIL STRIP (desktop only) ════════ */}
//       <ThumbnailStrip
//         pdfDoc={pdfDoc}
//         totalPages={totalPages}
//         pageNumber={pageNumber}
//         canvasThumbRefs={canvasThumbRefs}
//         onSelectPage={selectPage}
//       />

//       {/* ════════ 2. MAIN PREVIEW AREA ════════ */}
//       <div className="relative flex flex-1 flex-col min-w-0 bg-[#525659]">

//         {/* Scrollable pages */}
//         <div
//           className="flex-1 overflow-auto p-4 md:p-8"
//           onMouseMove={handleSignatureDrag}
//           onMouseUp={handleSignatureDragEnd}
//           onMouseLeave={handleSignatureDragEnd}
//           onTouchMove={handleSignatureDrag}
//           onTouchEnd={handleSignatureDragEnd}
//         >
//           <div className="mx-auto flex flex-col items-center gap-8 max-w-full">
//             {Array.from({ length: totalPages }).map((_, index) => {
//               const pg = index + 1;
//               return (
//                 <div
//                   key={`page-${index}-${renderKey}`}
//                   ref={(el) => (pageRefs.current[index] = el)}
//                   onClick={() => selectPage(pg)}
//                   className="relative shadow-2xl cursor-pointer"
//                   style={{ maxWidth: "100%" }}
//                 >
//                   <div className="relative inline-block overflow-hidden max-w-full">
//                     <canvas
//                       ref={(el) => { if (el) canvasRefs.current[index] = el; }}
//                       className="bg-white block"
//                       style={{ display: "block", maxWidth: "100%", height: "auto" }}
//                     />

//                     {/* Signature overlay */}
//                     {signaturePreview && pageNumber === pg && (
//                       <div
//                         className="absolute cursor-move"
//                         style={{
//                           left: `${xPosition}px`,
//                           top: `${yPosition}px`,
//                           width: `${signatureWidth}px`,
//                           height: `${signatureHeight}px`,
//                         }}
//                         onMouseDown={handleSignatureDragStart}
//                         onTouchStart={handleSignatureDragStart}
//                       >
//                         <div className="relative w-full h-full border-2 border-dashed border-[#f24d0d] rounded-sm shadow-[0_0_0_1px_rgba(242,77,13,0.15)]">
//                           <img
//                             src={signaturePreview}
//                             alt="Signature"
//                             className="w-full h-full object-contain bg-white/90 pointer-events-none"
//                             draggable={false}
//                           />
//                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg bg-[#f24d0d] px-2 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap pointer-events-none">
//                             <Move className="w-3 h-3" /> Drag to move
//                           </div>
//                           <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-sm bg-[#f24d0d] border-2 border-white shadow cursor-se-resize" />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── BOTTOM BAR — iLovePDF style ── */}
//         <div className="flex items-center justify-center gap-3 border-t border-black/20 bg-[#3d3d3d] px-4 py-2.5">
//           {/* Prev page */}
//           <button
//             type="button"
//             onClick={() => selectPage(Math.max(1, pageNumber - 1))}
//             disabled={pageNumber <= 1}
//             className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>

//           {/* Page indicator */}
//           <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
//             <span>{pageNumber}</span>
//             <span className="text-white/40">/</span>
//             <span className="text-white/70">{totalPages}</span>
//           </div>

//           {/* Next page */}
//           <button
//             type="button"
//             onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))}
//             disabled={pageNumber >= totalPages}
//             className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>

//           {/* Divider */}
//           <div className="h-5 w-px bg-white/20" />

//           {/* Zoom out */}
//           <button
//             type="button"
//             onClick={() => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 0.3, 3))}
//             className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
//           >
//             <ZoomOut className="h-4 w-4" />
//           </button>

//           {/* Zoom % */}
//           <div className="min-w-[52px] rounded-lg bg-white/10 px-2 py-1.5 text-center text-sm font-bold text-white">
//             {Math.round(scale * 100)}%
//           </div>

//           {/* Zoom in */}
//           <button
//             type="button"
//             onClick={() => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 0.3, 3))}
//             className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
//           >
//             <ZoomIn className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* ════════ 3. RIGHT SIDEBAR ════════ */}
//       {/* <div className="hidden md:flex flex-col border-l border-slate-200 bg-white overflow-y-auto"
//         style={{ width: 300, flexShrink: 0 }}
//       > */}
//       <div className="hidden md:flex flex-col border-l border-slate-200 bg-white overflow-y-auto"
//         style={{ width: 300, flexShrink: 0 }}
//       >

//         {/* Sidebar Header */}
//         <div className="border-b border-slate-100 px-5 py-5">
//           <h3 className="text-base font-bold text-slate-900">Signature Settings</h3>
//           <p className="mt-0.5 text-xs text-slate-400">Create, resize and position your signature</p>
//         </div>

//         <div className="space-y-4 p-5 flex-1">

//           {/* ── Signature Creator Card ── */}
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h4 className="text-sm font-bold text-slate-800">Your Signature</h4>
//                 <p className="text-xs text-slate-400 mt-0.5">Draw, type or upload</p>
//               </div>
//               {signaturePreview && (
//                 <button
//                   type="button"
//                   onClick={resetSignature}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition"
//                 >
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               )}
//             </div>

//             {signaturePreview ? (
//               <div className="rounded-xl border-2 border-dashed border-green-300 bg-white p-3">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
//                   <span className="text-xs font-semibold text-green-700">Signature ready</span>
//                 </div>
//                 <img src={signaturePreview} alt="Signature" className="mx-auto max-h-14 object-contain" />
//               </div>
//             ) : (
//               <div className="grid grid-cols-3 gap-2">
//                 {[
//                   { icon: <PenTool className="w-5 h-5" />, label: "Draw" },
//                   { icon: <Type className="w-5 h-5" />, label: "Type" },
//                   { icon: <ImageIcon className="w-5 h-5" />, label: "Upload" },
//                 ].map((btn) => (
//                   <button
//                     key={btn.label}
//                     type="button"
//                     onClick={() => setShowSignModal(true)}
//                     className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-slate-500 transition-all hover:border-[#f24d0d] hover:bg-orange-50 hover:text-[#f24d0d]"
//                   >
//                     {btn.icon}
//                     <span className="text-[11px] font-semibold">{btn.label}</span>
//                   </button>
//                 ))}
//               </div>
//             )}

//             {signaturePreview && (
//               <button
//                 type="button"
//                 onClick={() => setShowSignModal(true)}
//                 className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#f24d0d] hover:text-[#f24d0d] transition-all"
//               >
//                 Change Signature
//               </button>
//             )}
//           </div>

//           {/* ── Position & Size ── */}
//           {pdfFile && signaturePreview && (
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
//               <h4 className="text-sm font-bold text-slate-800">Position & Size</h4>

//               {/* Page selector */}
//               <div>
//                 <div className="flex items-center justify-between mb-1.5">
//                   <label className="text-xs text-slate-500 font-medium">Page</label>
//                   <span className="text-xs font-bold text-slate-700">{pageNumber} / {totalPages}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => selectPage(Math.max(1, pageNumber - 1))}
//                     disabled={pageNumber <= 1}
//                     className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
//                   >‹</button>
//                   <div className="flex-1 text-center rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-bold text-slate-700">
//                     {pageNumber}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))}
//                     disabled={pageNumber >= totalPages}
//                     className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
//                   >›</button>
//                 </div>
//               </div>

//               {/* Width */}
//               <div>
//                 <div className="flex items-center justify-between mb-1.5">
//                   <label className="text-xs text-slate-500 font-medium">Width</label>
//                   <span className="text-xs font-bold text-slate-700">{Math.round(signatureWidth)}px</span>
//                 </div>
//                 <input type="range" min="50" max="400" value={signatureWidth}
//                   onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
//                   className="w-full accent-[#f24d0d]"
//                 />
//               </div>

//               {/* Height */}
//               <div>
//                 <div className="flex items-center justify-between mb-1.5">
//                   <label className="text-xs text-slate-500 font-medium">Height</label>
//                   <span className="text-xs font-bold text-slate-700">{Math.round(signatureHeight)}px</span>
//                 </div>
//                 <input type="range" min="30" max="220" value={signatureHeight}
//                   onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
//                   className="w-full accent-[#f24d0d]"
//                 />
//               </div>

//               <p className="text-xs text-slate-400">💡 Drag the signature box on the preview to reposition</p>
//             </div>
//           )}

//           {/* Security */}
//           <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
//             <div className="flex items-start gap-3">
//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
//                 <Shield className="h-4 w-4" />
//               </div>
//               <div>
//                 <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
//                 <p className="mt-0.5 text-xs leading-5 text-slate-500">
//                   Files are encrypted and auto-deleted after signing.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
//               <p className="text-sm font-semibold text-red-700">{error}</p>
//             </div>
//           )}

//           {/* Sign Button */}
//           <button
//             type="button"
//             onClick={handleConvert}
//             disabled={!pdfFile || !signatureImage}
//             className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${pdfFile && signatureImage
//               ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_12px_32px_rgba(242,77,13,0.38)]"
//               : "cursor-not-allowed bg-slate-200 text-slate-400"
//               }`}
//           >
//             {pdfFile && signatureImage ? (
//               <span className="flex items-center justify-center gap-2">
//                 <Download className="w-5 h-5" /> Sign PDF Now
//               </span>
//             ) : (
//               "Add a signature to continue"
//             )}
//           </button>

//         </div>
//       </div>

//       {/* ════════ MOBILE: floating gear button + drawer ════════ */}
//       {/* ════════ MOBILE: floating gear button + drawer ════════ */}
//       <div className="md:hidden">

//         {/* Floating gear button */}
//         <button
//           type="button"
//           onClick={() => setDrawerOpen(true)}
//           className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f24d0d] text-white shadow-[0_8px_32px_rgba(242,77,13,0.45)] transition active:scale-95"
//         >
//           <Settings2 className="h-6 w-6" />
//         </button>

//         {/* Backdrop */}
//         {drawerOpen && (
//           <div
//             className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
//             onClick={() => setDrawerOpen(false)}
//           />
//         )}

//         {/* Drawer */}
//         <div className={`fixed inset-y-0 right-0 z-50 flex w-[min(320px,100vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>

//           {/* Drawer header */}
//           <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100">
//             <p className="text-base font-bold text-slate-800">Signature Settings</p>
//             <button
//               type="button"
//               onClick={() => setDrawerOpen(false)}
//               className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Drawer content */}
//           <div className="flex-1 overflow-y-auto p-5 space-y-4">

//             {/* Signature Creator Card */}
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <h4 className="text-sm font-bold text-slate-800">Your Signature</h4>
//                   <p className="text-xs text-slate-400 mt-0.5">Draw, type or upload</p>
//                 </div>
//                 {signaturePreview && (
//                   <button
//                     type="button"
//                     onClick={resetSignature}
//                     className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition"
//                   >
//                     <X className="w-3.5 h-3.5" />
//                   </button>
//                 )}
//               </div>

//               {signaturePreview ? (
//                 <div className="rounded-xl border-2 border-dashed border-green-300 bg-white p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
//                     <span className="text-xs font-semibold text-green-700">Signature ready</span>
//                   </div>
//                   <img src={signaturePreview} alt="Signature" className="mx-auto max-h-14 object-contain" />
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { icon: <PenTool className="w-5 h-5" />, label: "Draw" },
//                     { icon: <Type className="w-5 h-5" />, label: "Type" },
//                     { icon: <ImageIcon className="w-5 h-5" />, label: "Upload" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.label}
//                       type="button"
//                       onClick={() => { setDrawerOpen(false); setShowSignModal(true); }}
//                       className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-slate-500 transition-all hover:border-[#f24d0d] hover:bg-orange-50 hover:text-[#f24d0d]"
//                     >
//                       {btn.icon}
//                       <span className="text-[11px] font-semibold">{btn.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {signaturePreview && (
//                 <button
//                   type="button"
//                   onClick={() => { setDrawerOpen(false); setShowSignModal(true); }}
//                   className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#f24d0d] hover:text-[#f24d0d] transition-all"
//                 >
//                   Change Signature
//                 </button>
//               )}
//             </div>

//             {/* Position & Size */}
//             {pdfFile && signaturePreview && (
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
//                 <h4 className="text-sm font-bold text-slate-800">Position & Size</h4>

//                 {/* Page selector */}
//                 <div>
//                   <div className="flex items-center justify-between mb-1.5">
//                     <label className="text-xs text-slate-500 font-medium">Page</label>
//                     <span className="text-xs font-bold text-slate-700">{pageNumber} / {totalPages}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => selectPage(Math.max(1, pageNumber - 1))}
//                       disabled={pageNumber <= 1}
//                       className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
//                     >‹</button>
//                     <div className="flex-1 text-center rounded-xl border border-slate-200 bg-white py-1.5 text-sm font-bold text-slate-700">
//                       {pageNumber}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => selectPage(Math.min(totalPages, pageNumber + 1))}
//                       disabled={pageNumber >= totalPages}
//                       className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition text-sm font-bold"
//                     >›</button>
//                   </div>
//                 </div>

//                 {/* Width */}
//                 <div>
//                   <div className="flex items-center justify-between mb-1.5">
//                     <label className="text-xs text-slate-500 font-medium">Width</label>
//                     <span className="text-xs font-bold text-slate-700">{Math.round(signatureWidth)}px</span>
//                   </div>
//                   <input
//                     type="range" min="50" max="400" value={signatureWidth}
//                     onChange={(e) => setSignatureWidth(parseInt(e.target.value))}
//                     className="w-full accent-[#f24d0d]"
//                   />
//                 </div>

//                 {/* Height */}
//                 <div>
//                   <div className="flex items-center justify-between mb-1.5">
//                     <label className="text-xs text-slate-500 font-medium">Height</label>
//                     <span className="text-xs font-bold text-slate-700">{Math.round(signatureHeight)}px</span>
//                   </div>
//                   <input
//                     type="range" min="30" max="220" value={signatureHeight}
//                     onChange={(e) => setSignatureHeight(parseInt(e.target.value))}
//                     className="w-full accent-[#f24d0d]"
//                   />
//                 </div>

//                 <p className="text-xs text-slate-400">💡 Drag the signature box on the preview to reposition</p>
//               </div>
//             )}

//             {/* Security */}
//             <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
//                   <Shield className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-bold text-slate-800">Secure & Private</h4>
//                   <p className="mt-0.5 text-xs leading-5 text-slate-500">
//                     Files are encrypted and auto-deleted after signing.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
//                 <p className="text-sm font-semibold text-red-700">{error}</p>
//               </div>
//             )}

//             {/* Sign Button */}
//             <button
//               type="button"
//               onClick={() => { setDrawerOpen(false); handleConvert(); }}
//               disabled={!pdfFile || !signatureImage}
//               className={`w-full rounded-2xl px-5 py-4 text-base font-bold text-white transition-all active:scale-[0.98] ${pdfFile && signatureImage
//                 ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_12px_32px_rgba(242,77,13,0.38)]"
//                 : "cursor-not-allowed bg-slate-200 text-slate-400"
//                 }`}
//             >
//               {pdfFile && signatureImage ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Download className="w-5 h-5" /> Sign PDF Now
//                 </span>
//               ) : (
//                 "Add a signature to continue"
//               )}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script id="howto-schema-sign" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "HowTo",
//             name: "How to Sign a PDF Online Free — Add Digital Signature",
//             description: "Add a free digital signature to any PDF online. Draw your signature or upload an image, position with live preview, and download the signed PDF instantly. No signup, no watermark.",
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
//       <Script id="breadcrumb-schema-sign" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pdflinx.com/tools" },
//               { "@type": "ListItem", position: 3, name: "Sign PDF Online Free", item: "https://pdflinx.com/sign-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />
//       <Script id="faq-schema-sign" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "FAQPage",
//             mainEntity: FAQ_DATA.map((item) => ({
//               "@type": "Question",
//               name: item.q,
//               acceptedAnswer: { "@type": "Answer", text: item.a },
//             })),
//           }, null, 2),
//         }}
//       />
//       <Script id="software-schema-sign" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org", "@type": "SoftwareApplication",
//             name: "PDFLinx Sign PDF — Free Digital Signature Tool",
//             url: "https://pdflinx.com/sign-pdf",
//             applicationCategory: "UtilitiesApplication",
//             operatingSystem: "All",
//             offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
//             description: "Free online tool to add digital signatures to PDF documents. Draw or upload your signature, position with live preview, download instantly. No signup required.",
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
//         customOptionsLayout={customOptionsLayout}


//         // ============================================================
//         // SignPdf.jsx — uploadLanding prop (SEO-complete version)
//         // Fixes applied:
//         //   ✅ CompressPdf pattern fully followed
//         //   ✅ breadcrumbCurrent added
//         //   ✅ heroBadge added
//         //   ✅ pills added (8 keyword pills)
//         //   ✅ trustPills added
//         //   ✅ rating + ratingText added
//         //   ✅ howToEyebrow added
//         //   ✅ whyTitle + whyPoints added (replaces whyItems)
//         //   ✅ faqTitle added
//         //   ✅ Device-specific FAQs: iPhone, Android, Mac, Windows
//         //   ✅ seoTitle + seoDescription rewritten (stronger)
//         //   ✅ seoBadge added
//         //   ✅ relatedTitle added
//         //   ✅ SSL/GDPR added in privacy section
//         //   ✅ noticeItems rewritten (conversion-focused)
//         //   ✅ GSC keywords injected:
//         //       — "digital signature free"           (11 impressions)
//         //       — "create digital signature free"    (2 impressions)
//         //       — "digital signature online free"    (2 impressions)
//         //       — "free digital signature"           (2 impressions)
//         //       — "signature digital free"           (1 impression)
//         //       — "digital signature online free download" (1 impression)
//         //       — "free online signature"            (1 impression)
//         //       — "e signature download free"        (1 impression)
//         //       — "create a digital signature free"  (1 impression)
//         //       — "digital signature for free"       (1 impression)
//         // ============================================================

//         uploadLanding={{
//           content: {
//             eyebrow: "FREE DIGITAL SIGNATURE TOOL",

//             breadcrumbCurrent: "Sign PDF",

//             heroBadge: "✦ Free Digital Signature — No Signup, No Watermark",

//             heroTitle: (
//               <>
//                 Free Digital Signature —{" "}
//                 <em className="font-bold text-[#e8420a] sm:italic">
//                   Sign PDF Online Instantly
//                 </em>
//               </>
//             ),

//             heroDescription:
//               "Sign PDF online for free — draw your digital signature with mouse or touchscreen, or upload a signature image. Create a free digital signature and add it to any PDF in seconds. No signup, no watermark, no software needed. Position with live preview and download your signed PDF instantly. Works on Windows, Mac, Android, and iPhone — free online digital signature tool with no file size limit.",

//             pills: [
//               "Sign PDF free",
//               "Digital signature free",
//               "Create digital signature online",
//               "Free e-signature",
//               "Draw signature online",
//               "Upload signature image",
//               "No watermark",
//               "Works on mobile",
//             ],

//             trustPills: ["100% Free", "No Sign Up", "No Watermark"],

//             uploadTitle: "Drop your PDF here to sign",
//             uploadSubtitle: "or click to browse — any PDF document supported",

//             noticeTitle: "Digital Signature Tool",
//             noticeItems: [
//               "Draw or upload your signature instantly",
//               "Drag & position with live PDF preview",
//               "Files deleted after signing — 100% private",
//             ],

//             rating: "4.8/5",
//             ratingText: "Trusted by 70,000+ users monthly",

//             howToEyebrow: "How It Works",
//             howToTitle: "How to Sign a PDF Online Free — 3 Simple Steps",
//             howToSubtitle:
//               "Upload your PDF, create your free digital signature, drag it into position on the live preview, and download the signed PDF instantly — no account required.",

//             howToSteps: [
//               {
//                 n: "1",
//                 title: "Upload Your PDF File",
//                 desc: "Select the PDF document you need to sign from your device or drag and drop it into the uploader. Supports any PDF — contracts, agreements, forms, and letters. Works on desktop and mobile devices.",
//                 color: "bg-blue-600",
//               },
//               {
//                 n: "2",
//                 title: "Create Your Free Digital Signature",
//                 desc: "Draw your signature using mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Create a clean, natural digital signature in seconds — no stylus or special hardware needed.",
//                 color: "bg-purple-600",
//               },
//               {
//                 n: "3",
//                 title: "Position & Download Signed PDF",
//                 desc: "Drag your signature to the exact position on the live PDF preview. Download your signed PDF instantly — no watermark, no signup, no software required.",
//                 color: "bg-emerald-600",
//               },
//             ],

//             whyTitle: "Why Use PDFLinx Free Digital Signature Tool?",

//             whyPoints: [
//               {
//                 title: "100% Free Digital Signature, Always",
//                 desc: "Create and add a free digital signature to any PDF — no subscription, no hidden fees, unlimited use. The fastest free e-signature tool online.",
//               },
//               {
//                 title: "Draw or Upload Your Signature",
//                 desc: "Draw your signature with mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Two flexible options — one clean result.",
//               },
//               {
//                 title: "Live PDF Preview with Drag Positioning",
//                 desc: "See exactly where your signature will appear — drag it to any position on any page before downloading. No guesswork, no reprinting.",
//               },
//               {
//                 title: "Works on All Devices",
//                 desc: "Sign PDFs on iPhone, Android, Windows, or Mac — no app download needed. Touch support lets you draw your signature with your finger on any mobile device.",
//               },
//               {
//                 title: "No Watermark, Ever",
//                 desc: "Your signed PDF is completely clean — no watermarks, no branding, just your signature on the document. 100% professional output.",
//               },
//               {
//                 title: "Secure & Private — Files Auto-Deleted",
//                 desc: "Your PDF and signature are transferred over 256-bit SSL encryption and permanently deleted from our servers immediately after signing. We never store or share your documents.",
//               },
//             ],

//             faqTitle: "Digital Signature — Frequently Asked Questions",

//             faqs: [
//               {
//                 q: "Is the PDFLinx digital signature tool free?",
//                 a: "Yes. PDFLinx is a completely free digital signature tool — no hidden costs, no subscriptions, and no limits on how many PDFs you can sign. Create a free digital signature and add it to unlimited PDFs.",
//               },
//               {
//                 q: "How do I create a free digital signature online?",
//                 a: "Upload your PDF to PDFLinx, then use the drawing canvas to draw your signature with your mouse, trackpad, or finger on touchscreen. Alternatively, upload a PNG or JPG image of your handwritten signature. Position it on the PDF using the live preview and download the signed document instantly — no account required.",
//               },
//               {
//                 q: "Can I create a digital signature for free without software?",
//                 a: "Yes. PDFLinx works entirely in your browser — no software, no app, and no browser extension required. Create a free digital signature online and sign any PDF instantly without installing anything.",
//               },
//               {
//                 q: "How do I sign a PDF on iPhone for free?",
//                 a: "Open PDFLinx in your iPhone browser (Safari or Chrome) — no app download needed. Tap the upload area, select your PDF from Files, draw or upload your signature using touch, position it on the live preview, and download the signed PDF to your iPhone instantly. The fastest free digital signature tool for iOS.",
//               },
//               {
//                 q: "How do I sign a PDF on Android for free?",
//                 a: "Open PDFLinx in your Android browser (Chrome or Firefox). Upload your PDF, draw your signature using your finger on the touchscreen or upload a signature image, position it, and download the signed PDF. No app installation required — works directly in any Android browser.",
//               },
//               {
//                 q: "How do I sign a PDF on Mac for free?",
//                 a: "Open PDFLinx in Safari, Chrome, or Firefox on your Mac. Upload your PDF, draw or upload your signature, position it on the live preview, and download the signed PDF. No software installation needed — completely free alternative to Adobe Acrobat Sign on Mac.",
//               },
//               {
//                 q: "How do I sign a PDF on Windows 10 or Windows 11?",
//                 a: "Open PDFLinx in any browser on Windows — Chrome, Edge, or Firefox. Upload your PDF, create your digital signature by drawing or uploading an image, position it, and download the signed PDF. No additional software needed. Works on Windows 10 and Windows 11.",
//               },
//               {
//                 q: "Can I upload a signature image instead of drawing?",
//                 a: "Yes. If you already have a scanned or photographed signature, upload any PNG or JPG image and it will be overlaid on your PDF exactly where you position it. Both drawing and image upload are supported.",
//               },
//               {
//                 q: "Does PDFLinx add a watermark to signed PDFs?",
//                 a: "No. PDFLinx never adds any watermark to your signed PDF. The output is 100% clean and professional — just your signature on the document, nothing else.",
//               },
//               {
//                 q: "Is a digital signature the same as an e-signature?",
//                 a: "Digital signature and e-signature (electronic signature) are often used interchangeably for online document signing. Both refer to adding a signature to a document electronically — without printing, signing by hand, and scanning. PDFLinx lets you create a free e-signature online in seconds.",
//               },
//               {
//                 q: "Can I sign a multi-page PDF?",
//                 a: "Yes. PDFLinx supports multi-page PDFs. You can select the specific page where your signature needs to appear and position it precisely using the live preview before downloading.",
//               },
//               {
//                 q: "Are my uploaded PDF files secure?",
//                 a: "Yes. All files are transferred over 256-bit SSL encryption and permanently deleted from our servers immediately after signing. We do not store, share, or view your documents at any point. PDFLinx is GDPR-aware and privacy-first.",
//               },
//               {
//                 q: "Do I need to sign up to sign a PDF?",
//                 a: "No. No account, no registration, and no email required. Sign PDF files instantly for free — completely anonymous.",
//               },
//               {
//                 q: "Can I download my digital signature as an image?",
//                 a: "The signed PDF is available for direct download immediately after signing. If you need the signature as a standalone image file, you can draw your signature, take a screenshot, and save it — or use the upload option with a pre-saved signature image for future use.",
//               },
//               {
//                 q: "What is the difference between a digital signature and a handwritten signature?",
//                 a: "A handwritten signature is a physical mark made with pen on paper. A digital signature (or e-signature) is an electronic version added to a document online — drawn with a mouse, finger, or stylus, or uploaded as an image. PDFLinx lets you create a free digital signature that looks identical to your handwritten signature and can be added to any PDF instantly.",
//               },
//             ],

//             seoBadge: "Digital Signature Guide",

//             seoTitle:
//               "Free Digital Signature — Sign PDF Online, Create Free E-Signature Instantly | PDFLinx",

//             seoDescription:
//               "Free digital signature tool — sign PDF online, draw your e-signature or upload an image, position with live preview, and download instantly. No signup, no watermark. Works on Android, iPhone, Mac, and Windows.",

//             seoSections: [
//               {
//                 // Primary — all main keywords + GSC keywords covered
//                 title:
//                   "Free Digital Signature — Sign PDF Online & Create Free E-Signature Instantly",
//                 text: "Need to sign a PDF online for free? PDFLinx is a free digital signature tool that lets you create and add a free e-signature to any PDF instantly — no signup, no watermark, and no software required. Draw your signature with a mouse or touchscreen, or upload a PNG/JPG image of your handwritten signature. Position it precisely using the live PDF preview and download your signed document in seconds. A fast and reliable free alternative to Adobe Acrobat Sign, DocuSign, and Smallpdf — without any cost or account.",
//               },
//               {
//                 // GSC keyword target: "create digital signature free" / "digital signature online free"
//                 title:
//                   "How to Create a Free Digital Signature Online — Draw or Upload",
//                 text: "Creating a free digital signature online with PDFLinx takes under a minute. Upload your PDF, then choose your signing method: draw your signature using the built-in canvas with your mouse, trackpad, or finger on touchscreen — or upload a PNG or JPG image of your existing handwritten signature. Both methods produce a clean, professional signature that can be dragged to any position on any page of your PDF. No stylus, no special hardware, and no software installation required. The fastest way to create a free digital signature online.",
//               },
//               {
//                 // GSC keyword: "e signature download free" / "digital signature online free download"
//                 title:
//                   "Free E-Signature Download — Sign PDF and Download Instantly",
//                 text: "After creating your free digital signature and positioning it on your PDF, PDFLinx generates the signed document and makes it available for immediate download — no waiting, no email delivery, no account needed. Your signed PDF downloads directly to your device in seconds. This is the fastest free e-signature download experience online — upload, sign, position, and download, all in under two minutes. Works on any device without installing software or browser extensions.",
//               },
//               {
//                 // Semantic: "when to use digital signature"
//                 title: "When Should You Use a Digital Signature on a PDF?",
//                 text: "Digital signatures are used whenever a document requires an authorized signature but printing, signing, and scanning is inconvenient. Common use cases include signing employment contracts and offer letters remotely, approving business agreements and NDAs without meeting in person, signing rental agreements and property documents, authorizing government forms and applications, signing invoices and purchase orders for clients, and approving medical consent forms and insurance documents. A free digital signature from PDFLinx is legally valid for informal agreements and internal business processes across most jurisdictions.",
//               },
//               {
//                 // Topical: "digital vs electronic signature"
//                 title:
//                   "Digital Signature vs Electronic Signature vs E-Signature — What Is the Difference?",
//                 text: "The terms digital signature, electronic signature, and e-signature are commonly used interchangeably, and in most everyday contexts they mean the same thing — adding a signature to a document electronically without printing. Technically, a cryptographic digital signature uses encryption keys to verify identity and document integrity, while a visual e-signature is an image or drawn mark added to a PDF. For most personal and business purposes — contracts, agreements, approvals, and forms — a visual e-signature created with PDFLinx is sufficient and universally accepted. Always check the legal requirements for your specific jurisdiction when signing legally binding documents.",
//               },
//               {
//                 // Long-tail: "sign pdf on iphone android mac windows"
//                 title:
//                   "Sign PDF Free on Any Device — iPhone, Android, Mac, Windows",
//                 text: "No software installation needed. PDFLinx digital signature tool works perfectly on Windows, Mac, Linux, Android, iPhone, iPad, and tablets — directly in your browser without any app. On iPhone, open PDFLinx in Safari and draw your signature with your finger on the touchscreen. On Android, open in Chrome or Firefox and sign using touch. On Mac or Windows, draw with a mouse or trackpad. The live preview works across all screen sizes — desktop and mobile — making PDFLinx the most accessible free e-signature tool available on any device.",
//               },
//               {
//                 // Long-tail: "sign pdf for contracts agreements"
//                 title:
//                   "Sign PDF Documents for Contracts, Agreements, and Official Forms",
//                 text: "PDFLinx is designed for signing all types of PDF documents — employment contracts, rental agreements, business NDAs, client proposals, consent forms, government applications, and internal approval documents. Upload any PDF, create your free digital signature, and position it exactly where required. The signed output is a standard PDF compatible with all PDF viewers including Adobe Acrobat Reader, Google Chrome, and Apple Preview — no special software needed to open or verify the signed document.",
//               },
//               {
//                 // Trust + privacy — 256-bit SSL + GDPR
//                 title: "Privacy and File Security — 256-bit SSL Encryption",
//                 text: "Your uploaded PDF files and signature data are transferred over 256-bit SSL encryption and processed on secure servers. Files are permanently deleted immediately after signing — we do not store, share, or access your documents or signature at any point. PDFLinx is built with privacy-first principles and is GDPR-aware. No account or email is required to use the free digital signature tool. Your documents stay completely private from upload to download.",
//               },
//             ],

//             relatedTitle: "More Free PDF Tools",
//             showPdfTypes: false,
//           },
//         }}

//       />

//       {showSignModal && (
//         <SignatureModal
//           onSave={handleSignatureSave}
//           onClose={() => setShowSignModal(false)}
//         />
//       )}
//     </>
//   );
// }


