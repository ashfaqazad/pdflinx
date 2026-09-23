"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import {
  Type,
  Square,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  Bold,
  Italic,
  Underline,
  FileText,
  Scan, Stamp, PenLine, Hash, RotateCw,
  Crop, EyeOff, Minimize2
} from "lucide-react";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


const DONE_LINKS = [
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
  { label: "Sign PDF", href: "/sign-pdf", icon: <PenLine className="h-4 w-4 text-indigo-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Crop PDF", href: "/crop-pdf", icon: <Crop className="h-4 w-4 text-lime-500" /> },
  { label: "Redact PDF", href: "/redact-pdf", icon: <EyeOff className="h-4 w-4 text-gray-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
];


// ── Constants ──
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const FONT_OPTIONS = [
  "Calibri", "Arial", "Helvetica", "Times New Roman", "Georgia",
  "Verdana", "Tahoma", "Trebuchet MS", "Courier New", "Inter", "Roboto", "Poppins",
];

const DARK_PRESETS = ["#111827", "#0f172a", "#1f2937", "#374151", "#000000"];

// ==================== EDIT PDF PREVIEW COMPONENT ====================
function EditPdfPreview({
  pdfFile,
  pdfDoc,
  numPages,
  scale,
  setScale,
  canvasRefs,
  pageWrapRefs,
  objects,
  objectsByPage,
  activeId,
  setActiveId,
  currentPage,
  setCurrentPage,
  startDrag,
  startResize,
  onMove,
  stopDrag,
  updateObj,
}) {
  return (
    <div className="w-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Live Preview (All Pages)</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)))}
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-10 text-center font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active page indicator */}
      {pdfFile && (
        <div className="mb-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          Active page:{" "}
          <span className="font-semibold text-gray-700">{currentPage}</span> / {numPages || 1}
          <span className="ml-2 text-gray-400">(Click a page to select it)</span>
        </div>
      )}

      {/* Preview area */}
      {!pdfFile ? (
        <div className="flex items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Upload a PDF to see live preview</p>
            <p className="text-xs text-gray-300 mt-1">
              Add text, images and cover boxes with drag positioning
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-50"
          style={{ maxHeight: "90vh" }}
          onMouseMove={onMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onClick={() => setActiveId(null)}
        >
          <div className="p-4 space-y-8">
            {Array.from({ length: numPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const objs = objectsByPage.get(pageNum) || [];

              return (
                <div
                  key={pageNum}
                  ref={(el) => (pageWrapRefs.current[idx] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage(pageNum);
                  }}
                  className={`relative inline-block bg-white rounded-lg shadow-sm border ${currentPage === pageNum
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                    }`}
                >
                  <canvas
                    ref={(el) => (canvasRefs.current[idx] = el)}
                    className="block"
                  />

                  {/* Overlays */}
                  {objs.map((obj) => {
                    if (obj.type === "text") {
                      return (
                        <div
                          key={obj.id}
                          onMouseDown={(e) => startDrag(e, obj)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveId(obj.id);
                            setCurrentPage(obj.page);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            const newText = prompt("Edit text:", obj.text);
                            if (newText !== null) updateObj(obj.id, { text: newText });
                          }}
                          style={{
                            position: "absolute",
                            left: obj.x * scale,
                            top: obj.y * scale,
                            fontSize: (obj.fontSize || 16) * scale,
                            color: obj.color || "#111827",
                            fontFamily: obj.fontFamily || "Calibri",
                            fontWeight: obj.fontWeight || "normal",
                            fontStyle: obj.fontStyle || "normal",
                            textDecoration: obj.textDecoration || "none",
                            cursor: "move",
                            whiteSpace: "pre",
                            padding: "2px 6px",
                            borderRadius: 6,
                            background:
                              activeId === obj.id
                                ? "rgba(59,130,246,0.08)"
                                : "transparent",
                            outline:
                              activeId === obj.id
                                ? "2px solid rgba(59,130,246,0.5)"
                                : "none",
                          }}
                          title="Drag to move • Double click to edit"
                        >
                          {obj.text}
                        </div>
                      );
                    }

                    if (obj.type === "image") {
                      return (
                        <div
                          key={obj.id}
                          onMouseDown={(e) => startDrag(e, obj)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveId(obj.id);
                            setCurrentPage(obj.page);
                          }}
                          style={{
                            position: "absolute",
                            left: obj.x * scale,
                            top: obj.y * scale,
                            width: (obj.width || 150) * scale,
                            height: (obj.height || 150) * scale,
                            cursor: "move",
                            outline:
                              activeId === obj.id
                                ? "2px solid rgba(59,130,246,0.5)"
                                : "none",
                          }}
                          title="Drag to move • Resize from corner"
                        >
                          <img
                            src={obj.previewUrl}
                            alt=""
                            draggable={false}
                            className="w-full h-full object-contain pointer-events-none select-none"
                          />
                          <div
                            onMouseDown={(e) => startResize(e, obj)}
                            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                          />
                        </div>
                      );
                    }

                    // "cover" box (default)
                    return (
                      <div
                        key={obj.id}
                        onMouseDown={(e) => startDrag(e, obj)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveId(obj.id);
                          setCurrentPage(obj.page);
                        }}
                        style={{
                          position: "absolute",
                          left: obj.x * scale,
                          top: obj.y * scale,
                          width: (obj.width || 220) * scale,
                          height: (obj.height || 32) * scale,
                          background: obj.fill || "#ffffff",
                          cursor: "move",
                          outline:
                            activeId === obj.id
                              ? "2px solid rgba(59,130,246,0.5)"
                              : "none",
                        }}
                        title="Drag to move • Resize from corner"
                      >
                        <div
                          onMouseDown={(e) => startResize(e, obj)}
                          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                        />
                      </div>
                    );
                  })}

                  <div className="absolute -top-3 left-3 bg-white px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded-full">
                    Page {pageNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">
        💡 Click a page to select it · Drag objects to reposition · Double-click text to edit
      </p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function EditPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  // ── PDF state ──
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRefs = useRef([]);
  const pageWrapRefs = useRef([]);

  // ── Objects state ──
  const [objects, setObjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  // ── Image upload ──
  const imageInputRef = useRef(null);

  // ── UI state ──
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFilename, setOutputFilename] = useState("edited.pdf");

  const activeObj = objects.find((o) => o.id === activeId);

  const objectsByPage = useMemo(() => {
    const m = new Map();
    for (const o of objects) {
      if (!m.has(o.page)) m.set(o.page, []);
      m.get(o.page).push(o);
    }
    return m;
  }, [objects]);

  // ── Sync pdfFile from flow.files ──
  useEffect(() => {
    const f = flow.files?.[0] || null;
    if (f !== pdfFile) {
      setPdfFile(f);
      if (f) {
        // revoke any previous image preview URLs before clearing
        objects.forEach((o) => {
          if (o.type === "image" && o.previewUrl) URL.revokeObjectURL(o.previewUrl);
        });
        setObjects([]);
        setActiveId(null);
        setError("");
        setCurrentPage(1);
        setScale(1);
        canvasRefs.current = [];
        pageWrapRefs.current = [];
        setOutputFilename(f.name.replace(/\.pdf$/i, "") + "-edited.pdf");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.files]);

  // ── Load PDF ──
  useEffect(() => {
    if (!pdfFile) return;

    const load = async () => {
      try {
        setError("");
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const buffer = await pdfFile.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setScale(1);
        canvasRefs.current = new Array(doc.numPages);
        pageWrapRefs.current = new Array(doc.numPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load PDF");
      }
    };

    load();
  }, [pdfFile]);

  // ── Render all pages ──
  useEffect(() => {
    if (!pdfDoc || !numPages) return;
    let cancelled = false;

    const renderAll = async () => {
      try {
        for (let p = 1; p <= numPages; p++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(p);
          const viewport = page.getViewport({ scale });
          const canvas = canvasRefs.current[p - 1];
          if (!canvas) continue;
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        console.error(e);
      }
    };

    renderAll();
    return () => { cancelled = true; };
  }, [pdfDoc, numPages, scale]);

  // ── Object helpers ──
  const updateObj = (id, updates) => {
    setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteActive = () => {
    if (!activeId) return;
    setObjects((prev) => {
      const obj = prev.find((o) => o.id === activeId);
      if (obj?.type === "image" && obj.previewUrl) URL.revokeObjectURL(obj.previewUrl);
      return prev.filter((o) => o.id !== activeId);
    });
    setActiveId(null);
  };

  const addText = () => {
    const id = Date.now();
    setObjects((prev) => [
      ...prev,
      {
        id, type: "text", page: currentPage,
        text: "Double click to edit",
        x: 100, y: 120, fontSize: 16,
        color: "#111827", fontFamily: "Calibri",
        fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
      },
    ]);
    setActiveId(id);
  };

  const addCover = () => {
    const id = Date.now();
    setObjects((prev) => [
      ...prev,
      {
        id, type: "cover", page: currentPage,
        x: 100, y: 120, width: 220, height: 32, fill: "#ffffff",
      },
    ]);
    setActiveId(id);
  };

  // ── Add Image: opens hidden file picker ──
  const addImage = () => {
    imageInputRef.current?.click();
  };

  // ── Fires after user picks an image file ──
  const handleImageSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG or JPG).");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const id = Date.now();

    setObjects((prev) => [
      ...prev,
      {
        id, type: "image", page: currentPage,
        x: 100, y: 120, width: 150, height: 150,
        file,        // actual File — sent to backend in FormData
        previewUrl,  // local blob URL — used only for on-screen preview
      },
    ]);
    setActiveId(id);

    // reset input so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const toggleBold = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, { fontWeight: activeObj.fontWeight === "bold" ? "normal" : "bold" });
  };

  const toggleItalic = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, { fontStyle: activeObj.fontStyle === "italic" ? "normal" : "italic" });
  };

  const toggleUnderline = () => {
    if (!activeObj || activeObj.type !== "text") return;
    updateObj(activeObj.id, {
      textDecoration: activeObj.textDecoration === "underline" ? "none" : "underline",
    });
  };

  // ── Drag / resize ──
  const startDrag = (e, obj) => {
    e.stopPropagation();
    const pageIndex = (obj.page || 1) - 1;
    const wrap = pageWrapRefs.current[pageIndex];
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    dragRef.current = {
      id: obj.id, page: obj.page,
      startX: e.clientX, startY: e.clientY,
      origX: obj.x, origY: obj.y,
      pageLeft: rect.left, pageTop: rect.top,
    };
    setActiveId(obj.id);
    setCurrentPage(obj.page);
  };

  const startResize = (e, obj) => {
    e.stopPropagation();
    resizeRef.current = {
      id: obj.id, page: obj.page,
      startX: e.clientX, startY: e.clientY,
      origW: obj.width, origH: obj.height,
    };
    setActiveId(obj.id);
    setCurrentPage(obj.page);
  };

  const onMove = (e) => {
    if (dragRef.current) {
      const { id, startX, startY, origX, origY } = dragRef.current;
      updateObj(id, {
        x: origX + (e.clientX - startX) / scale,
        y: origY + (e.clientY - startY) / scale,
      });
    }
    if (resizeRef.current) {
      const { id, startX, startY, origW, origH } = resizeRef.current;
      updateObj(id, {
        width: clamp(origW + (e.clientX - startX) / scale, 20, 3000),
        height: clamp(origH + (e.clientY - startY) / scale, 12, 3000),
      });
    }
  };

  const stopDrag = () => {
    dragRef.current = null;
    resizeRef.current = null;
  };

  // ── Remove file ──
  const handleRemoveFile = () => {
    objects.forEach((o) => {
      if (o.type === "image" && o.previewUrl) URL.revokeObjectURL(o.previewUrl);
    });
    setPdfFile(null);
    setPdfDoc(null);
    setNumPages(0);
    setObjects([]);
    setActiveId(null);
    setError("");
    canvasRefs.current = [];
    pageWrapRefs.current = [];
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

  // ── Convert ──
  const handleConvert = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file!");
      return;
    }
    if (objects.length === 0) {
      setError("Please add at least one text, image, or cover box first!");
      return;
    }

    flow.startProcessing();
    startProgress();
    setError("");

    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);

      // Strip non-serializable fields (File, blob preview URL) before
      // JSON.stringify — images are sent as separate FormData entries below,
      // matched to their edit by id.
      const serializableObjects = objects.map((o) => {
        if (o.type === "image") {
          const { file, previewUrl, ...rest } = o;
          return rest;
        }
        return o;
      });
      formData.append("edits", JSON.stringify(serializableObjects));

      // Append each image's actual file, keyed by its object id so the
      // backend can match position/size metadata to the right image.
      objects
        .filter((o) => o.type === "image" && o.file)
        .forEach((o) => {
          formData.append(`image_${o.id}`, o.file, o.file.name);
        });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/edit-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Edit failed";
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
      const msg = (err?.message || "Something went wrong").toString();
      setError(msg);
      flow.handleError(msg);
      console.error(err);
    }
  };

  // ── Options slot ──
  const optionsSlot = (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Edit tools</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add text, insert images, or cover existing content on any page.
        </p>

        {/* hidden native file input used by "Add Image" */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageSelected}
        />

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={addText}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Type className="w-4 h-4" />
            Add Text
          </button>

          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
          >
            <ImageIcon className="w-4 h-4" />
            Add Image
          </button>

          <button
            type="button"
            onClick={addCover}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
          >
            <Square className="w-4 h-4" />
            Cover Text
          </button>

          <button
            type="button"
            onClick={deleteActive}
            disabled={!activeId}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Text styling — only when text object is active */}
      {activeObj?.type === "text" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Text style</h3>
          <p className="mt-1 text-sm text-slate-500">
            Format the selected text box.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Bold / Italic / Underline */}
            <button
              type="button"
              onClick={toggleBold}
              className={`p-2 rounded-lg border ${activeObj.fontWeight === "bold"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
                }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleItalic}
              className={`p-2 rounded-lg border ${activeObj.fontStyle === "italic"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
                }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleUnderline}
              className={`p-2 rounded-lg border ${activeObj.textDecoration === "underline"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
                }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>

            {/* Font size */}
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() =>
                  updateObj(activeObj.id, {
                    fontSize: Math.max(8, (activeObj.fontSize || 16) - 2),
                  })
                }
                className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm"
              >
                A-
              </button>
              <span className="text-sm font-medium w-10 text-center">
                {activeObj.fontSize || 16}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateObj(activeObj.id, {
                    fontSize: (activeObj.fontSize || 16) + 2,
                  })
                }
                className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm"
              >
                A+
              </button>
            </div>

            {/* Font family */}
            <select
              value={activeObj.fontFamily || "Calibri"}
              onChange={(e) => updateObj(activeObj.id, { fontFamily: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* Color picker */}
            <input
              type="color"
              value={activeObj.color || "#111827"}
              onChange={(e) => updateObj(activeObj.id, { color: e.target.value })}
              className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300 bg-white"
              title="Text color"
            />

            {/* Dark presets */}
            <div className="flex items-center gap-1">
              {DARK_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateObj(activeObj.id, { color: c })}
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image hint — only when image object is active */}
      {activeObj?.type === "image" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Image</h3>
          <p className="mt-1 text-sm text-slate-500">
            Drag to reposition. Drag the bottom-right corner to resize.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* PDF.js */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="beforeInteractive"
      />

      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Edit PDF Online for Free",
            description:
              "Add text, insert images, cover existing text, change font, color and download an edited PDF with live preview.",
            url: "https://pdflinx.com/edit-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF you want to edit." },
              { "@type": "HowToStep", name: "Add text, images or cover", text: "Add text anywhere, insert an image, or cover existing text with a white box." },
              { "@type": "HowToStep", name: "Style and download", text: "Change font, size and color, then download the edited PDF." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Edit PDF", item: "https://pdflinx.com/edit-pdf" },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is PDFLinx Edit PDF free to use?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Edit PDF is free — no sign-up, no watermarks." },
              },
              {
                "@type": "Question",
                name: "Can I edit existing text inside the PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can cover existing text with a white box and place new text on top. True editing depends on the PDF structure.",
                },
              },
              {
                "@type": "Question",
                name: "Can I insert an image into my PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Use the Add Image tool to upload a PNG or JPG, then drag to position and resize it anywhere on the page.",
                },
              },
              {
                "@type": "Question",
                name: "Can I change font size, font family, color, bold and italic?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Select a text box, then change its font, size, color, bold/italic/underline from the toolbar.",
                },
              },
              {
                "@type": "Question",
                name: "Is my PDF secure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Files are processed automatically and deleted after processing. No accounts required.",
                },
              },
              {
                "@type": "Question",
                name: "Does it work on mobile?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The editor is mobile-friendly with scrolling and zoom support.",
                },
              },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-editpdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Edit PDF Online - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Edit PDF online free — add or change text, insert images, highlight content, and annotate pages directly in your browser. No Adobe Acrobat, no account, no watermark.",
            url: "https://pdflinx.com/edit-pdf",
            screenshot: "https://pdflinx.com/og-image.png",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Add text to PDF online",
              "Insert images into PDF",
              "Cover existing text with white box",
              "Change font, size, color, bold, italic",
              "Live PDF preview while editing",
              "Free online PDF editor",
              "No signup required",
              "Secure file processing",
              "Works on mobile and desktop"
            ],
            creator: { "@type": "Organization", name: "PDFLinx" }
          }, null, 2),
        }}
      />

      {/* ==================== TOOL UI ==================== */}
      <ToolPageLayout
        title={seo?.h1 || "Edit PDF Online Free"}
        hideSidebar={true}
        tagline="Add Text · Insert Images · Cover & Replace · No Signup · No Watermark"
        accept=".pdf,application/pdf"
        multiple={false}
        convertLabel="Save PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Editor options"
        optionsSlot={optionsSlot}
        processingTitle="Saving your edited PDF..."
        processingDescription="Applying your edits and generating the final PDF."
        processingStages={["Uploading", "Applying edits", "Done"]}
        doneTitle="Your edited PDF is ready"
        doneDescription="Click download to save your edited PDF."
        downloadLabel="Download Edited PDF"
        resetLabel="Edit another PDF"
        sidebarTitle="Edit PDF"
        sidebarIcon={<Type className="h-5 w-5 text-white" />}
        sidebarDescription="Add text, insert images, cover old content, change font and color — with live preview."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Editor</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Add text on any page</li>
              <li>Insert and resize images</li>
              <li>Cover & replace existing text</li>
              <li>Font, size, color, bold/italic</li>
              <li>Drag to reposition objects</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files only"

        customOptionsLayout={
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

            {/* LEFT — PDF Preview */}
            <div>
              <EditPdfPreview
                pdfFile={pdfFile}
                pdfDoc={pdfDoc}
                numPages={numPages}
                scale={scale}
                setScale={setScale}
                canvasRefs={canvasRefs}
                pageWrapRefs={pageWrapRefs}
                objects={objects}
                objectsByPage={objectsByPage}
                activeId={activeId}
                setActiveId={setActiveId}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                startDrag={startDrag}
                startResize={startResize}
                onMove={onMove}
                stopDrag={stopDrag}
                updateObj={updateObj}
              />
            </div>

            {/* RIGHT — Options + Save Button */}
            <div className="space-y-4 xl:sticky xl:top-6 h-fit">
              {optionsSlot}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleConvert}
                disabled={!pdfFile || objects.length === 0}
                className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${pdfFile && objects.length > 0
                  ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                  : "cursor-not-allowed bg-slate-300"
                  }`}
              >
                Save PDF
              </button>
            </div>

          </div>
        }

        // ============================================================
        // EDIT PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "EDIT PDF ONLINE",

            breadcrumbCurrent: "Edit PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            heroTitle: (
              <>
                Edit PDF Online —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Add Text, Images & More Free
                </em>
              </>
            ),
            heroDescription:
              "Edit PDF online free — add or change text, insert images, highlight content, and annotate pages directly in your browser. No Adobe Acrobat, no account, no watermark.",
            pills: ["Add & edit text", "Insert images", "Highlight & annotate", "No Acrobat needed"],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Edit PDF Info",
            noticeItems: [
              "Add text boxes, highlights & shapes",
              "Insert images and photos",
              "Changes saved permanently in PDF",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Edit a PDF Online — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, edit directly in the browser, download — done in minutes.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. The PDF opens instantly in the online editor — no waiting, no plugins.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Edit, Insert Images & Add Content",
                desc: "Add text boxes anywhere on the page, insert an image or photo, highlight important sections, or cover existing content. All editing happens directly in your browser in real time.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Edited PDF",
                desc: "Click Save and your edited PDF is ready in seconds. All additions — text, images, highlights, shapes — are permanently embedded and visible in any PDF viewer.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Online PDF Editor",

            seoBadge: "Edit PDF Online Guide",
            seoTitle: "Complete Guide to Editing PDF Files Online",
            seoDescription:
              "Everything you need to know about editing PDFs online — add text, insert images, highlight, draw shapes, sign, and annotate any PDF for free. No watermark, no signup, no software needed.",

            seoSections: [
              {
                title:
                  "Free PDF Editor — Add Text, Images & Annotations to Any PDF Online",
                text: "Need to edit a PDF online? PDFLinx gives you a full-featured PDF editor in your browser — completely free and without any software installation. Add text boxes, insert images or photos, highlight content, draw shapes and arrows, and annotate any PDF directly on the page. Whether it is a form you need to fill, a photo you need to add to a document, a report you need to mark up, or content you need to update, PDFLinx handles it instantly. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What Can You Edit in a PDF with PDFLinx?",
                text: "PDFLinx is an annotation and content-addition editor — the most practical kind of PDF editing for everyday needs. You can add text boxes anywhere on any page to insert new content, fill in form fields, or label sections. You can insert an image or photo and resize it to fit the page. You can highlight text to draw attention to important passages. You can draw rectangles to annotate or cover existing content. Everything you add becomes a permanent part of the PDF output.",
              },
              {
                title: "Adding Text to a PDF — Without Converting to Word",
                text: "One of the most common PDF editing needs is adding text — filling in a form field, inserting a note, labeling a diagram, or adding a missing line of content. PDFLinx lets you click anywhere on a PDF page and add a text box with your chosen font size and color — no need to convert the PDF to Word first, make changes, and convert back. For quick text additions, PDFLinx is far faster and simpler than a full roundtrip conversion. For more extensive editing of the original document text, converting to Word using our PDF to Word tool may be a better approach.",
              },
              {
                title: "Inserting Images into a PDF Online",
                text: "Need to add a photo, logo, or profile picture to a PDF — like a resume or a form? PDFLinx lets you upload a PNG or JPG image and place it anywhere on the page, then drag to reposition or resize it exactly how you want. This is especially useful for adding a profile photo to a resume template, a signature image, a company logo to a letterhead, or a scanned stamp to a document — all without needing Photoshop or a desktop PDF editor.",
              },
              {
                title: "Highlight, Annotate & Mark Up PDFs for Review",
                text: "PDFLinx is ideal for document review workflows. Highlight key sentences in yellow or another color to flag important content. Add text comment boxes explaining changes or raising questions. Draw rectangles around sections that need attention or cover outdated content with a clean white box. These annotation tools are exactly what legal teams, editors, educators, and business reviewers use when marking up documents — and PDFLinx delivers them without requiring Adobe Acrobat or any other paid software.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free Online PDF Editor — No Watermark, No Limits",
                text: "Most free online PDF editors add watermarks, restrict the number of edits per day, limit the tools available on free plans, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict annotation and editing tools on free tiers, and unlike Adobe Acrobat which requires a monthly subscription, PDFLinx gives you practical PDF editing at zero cost.",
              },
              {
                title: "Common Use Cases for Editing a PDF Online",
                text: "✓ Fill PDF Forms: Add text to form fields in PDFs that are not interactive — contracts, applications, questionnaires, and tax forms.\n✓ Add a Photo or Logo: Insert a profile picture, company logo, or scanned signature image anywhere on the page.\n✓ Review & Mark Up: Highlight, annotate, and comment on reports, drafts, manuscripts, and legal documents.\n✓ Label Diagrams: Add text labels to technical drawings, floor plans, and visual documents.\n✓ Update Content: Cover outdated text and replace it with new text or an image.\n✓ Add Missing Content: Insert text, images, or notes to a PDF where content is missing or needs clarification.",
              },
              {
                title:
                  "Edit PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, the PDF editor works on touchscreens — tap to add text boxes, upload photos from your camera roll, and highlight by touch. On Mac or Windows, use your mouse or trackpad to annotate with precision. Whether you need to edit a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when editing contracts, legal documents, financial records, or any confidential business file. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title: "Edit PDF vs Convert to Word — When to Use Which Approach",
                text: "PDF editing in PDFLinx is best for adding content on top of existing pages — text boxes, images, highlights, and annotations. If you need to change the original text of the document — rewrite paragraphs, update names and dates in the body text, restructure content — converting to Word using our PDF to Word tool gives you a fully editable document where the original text can be modified directly. For anything that requires overlaying new content without changing the underlying document structure, the PDF editor is the faster, simpler choice.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF editor free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of edits or how many PDFs you edit.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and start editing instantly — no email, no registration, no friction.",
              },
              {
                q: "What editing tools does PDFLinx offer?",
                a: "PDFLinx lets you add text boxes, insert and resize images, highlight content, draw shapes, and annotate pages — all directly in the browser.",
              },
              {
                q: "Can I add text anywhere on a PDF page?",
                a: "Yes. Click anywhere on any page to place a text box and type your content. Choose font size and color to match the document style.",
              },
              {
                q: "Can I insert an image into my PDF?",
                a: "Yes. Use the Add Image button to upload a PNG or JPG, then drag it to position and resize it anywhere on the page — great for adding photos, logos, or signature images.",
              },
              {
                q: "Can I fill in PDF forms that are not interactive?",
                a: "Yes. Use the text box tool to click inside form fields on non-interactive PDFs and type your answers — an effective way to fill forms that lack built-in fillable fields.",
              },
              {
                q: "Can I highlight text in a PDF?",
                a: "Yes. Use the highlight tool to select and highlight text in any color — useful for marking important passages in documents you are reviewing.",
              },
              {
                q: "Are my edits permanently saved in the PDF?",
                a: "Yes. All additions — text, images, highlights, shapes — are permanently embedded into the PDF output and visible in every PDF viewer on every device.",
              },
              {
                q: "Can I edit the original text of a PDF — like rewriting a sentence?",
                a: "Direct original text editing depends on the PDF type. For quick content additions and annotations, use the editor. For extensive original text changes, use our PDF to Word converter to get a fully editable document.",
              },
              {
                q: "Does PDFLinx add any watermark to the edited PDF?",
                a: "No watermarks, ever. Your edited PDF contains only what you added — no platform branding or stamps from PDFLinx.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx PDF editor on mobile — iPhone and Android?",
                a: "Yes. The PDF editor works on touchscreens — tap to add text, upload photos, and highlight by touch. No app download needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting the file first using our free PDF Split tool, edit each part, then merge them back.",
              },
              {
                q: "Can I edit a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then open it in the editor.",
              },
              {
                q: "What is the difference between Edit PDF and PDF to Word?",
                a: "Edit PDF adds content on top of existing pages — text boxes, images, highlights, shapes. PDF to Word converts the document into an editable Word file where the original text itself can be changed. Use Edit PDF for annotations and additions, use PDF to Word for rewriting original content.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF editing?",
                a: "Yes — PDFLinx offers a full annotation and editing toolset for free with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict editing tools behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Edit your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, easy PDF editing directly in the browser every day.",
            ctaButton: "Choose PDF File",
          },
        }}
      />

    </>
  );
}





































// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Script from "next/script";
// import {
//   Type,
//   Square,
//   Trash2,
//   ZoomIn,
//   ZoomOut,
//   Bold,
//   Italic,
//   Underline,
//   FileText,
//   Scan, Stamp, PenLine, Hash, RotateCw,
//   Crop, EyeOff, Minimize2
// } from "lucide-react";
// import RelatedToolsSection from "@/components/RelatedTools";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


// const DONE_LINKS = [
//   { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
//   { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
//   { label: "Sign PDF", href: "/sign-pdf", icon: <PenLine className="h-4 w-4 text-indigo-500" /> },
//   { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
//   { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
//   { label: "Crop PDF", href: "/crop-pdf", icon: <Crop className="h-4 w-4 text-lime-500" /> },
//   { label: "Redact PDF", href: "/redact-pdf", icon: <EyeOff className="h-4 w-4 text-gray-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
// ];


// // ── Constants ──
// const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// const FONT_OPTIONS = [
//   "Calibri", "Arial", "Helvetica", "Times New Roman", "Georgia",
//   "Verdana", "Tahoma", "Trebuchet MS", "Courier New", "Inter", "Roboto", "Poppins",
// ];

// const DARK_PRESETS = ["#111827", "#0f172a", "#1f2937", "#374151", "#000000"];

// // ==================== EDIT PDF PREVIEW COMPONENT ====================
// function EditPdfPreview({
//   pdfFile,
//   pdfDoc,
//   numPages,
//   scale,
//   setScale,
//   canvasRefs,
//   pageWrapRefs,
//   objects,
//   objectsByPage,
//   activeId,
//   setActiveId,
//   currentPage,
//   setCurrentPage,
//   startDrag,
//   startResize,
//   onMove,
//   stopDrag,
//   updateObj,
// }) {
//   return (
//     <div className="w-full">
//       {/* Zoom controls */}
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-semibold text-slate-700">Live Preview (All Pages)</h3>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)))}
//             className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             title="Zoom Out"
//           >
//             <ZoomOut className="w-4 h-4" />
//           </button>
//           <span className="text-xs text-gray-600 min-w-10 text-center font-medium">
//             {Math.round(scale * 100)}%
//           </span>
//           <button
//             type="button"
//             onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
//             className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//             title="Zoom In"
//           >
//             <ZoomIn className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* Active page indicator */}
//       {pdfFile && (
//         <div className="mb-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
//           Active page:{" "}
//           <span className="font-semibold text-gray-700">{currentPage}</span> / {numPages || 1}
//           <span className="ml-2 text-gray-400">(Click a page to select it)</span>
//         </div>
//       )}

//       {/* Preview area */}
//       {!pdfFile ? (
//         <div className="flex items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
//           <div className="text-center text-gray-400">
//             <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
//             <p className="text-sm">Upload a PDF to see live preview</p>
//             <p className="text-xs text-gray-300 mt-1">
//               Add text and cover boxes with drag positioning
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div
//           className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-50"
//           style={{ maxHeight: "90vh" }}
//           onMouseMove={onMove}
//           onMouseUp={stopDrag}
//           onMouseLeave={stopDrag}
//           onClick={() => setActiveId(null)}
//         >
//           <div className="p-4 space-y-8">
//             {Array.from({ length: numPages }).map((_, idx) => {
//               const pageNum = idx + 1;
//               const objs = objectsByPage.get(pageNum) || [];

//               return (
//                 <div
//                   key={pageNum}
//                   ref={(el) => (pageWrapRefs.current[idx] = el)}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentPage(pageNum);
//                   }}
//                   className={`relative inline-block bg-white rounded-lg shadow-sm border ${currentPage === pageNum
//                     ? "border-blue-500 ring-2 ring-blue-200"
//                     : "border-gray-200"
//                     }`}
//                 >
//                   <canvas
//                     ref={(el) => (canvasRefs.current[idx] = el)}
//                     className="block"
//                   />

//                   {/* Overlays */}
//                   {objs.map((obj) =>
//                     obj.type === "text" ? (
//                       <div
//                         key={obj.id}
//                         onMouseDown={(e) => startDrag(e, obj)}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActiveId(obj.id);
//                           setCurrentPage(obj.page);
//                         }}
//                         onDoubleClick={(e) => {
//                           e.stopPropagation();
//                           const newText = prompt("Edit text:", obj.text);
//                           if (newText !== null) updateObj(obj.id, { text: newText });
//                         }}
//                         style={{
//                           position: "absolute",
//                           left: obj.x * scale,
//                           top: obj.y * scale,
//                           fontSize: (obj.fontSize || 16) * scale,
//                           color: obj.color || "#111827",
//                           fontFamily: obj.fontFamily || "Calibri",
//                           fontWeight: obj.fontWeight || "normal",
//                           fontStyle: obj.fontStyle || "normal",
//                           textDecoration: obj.textDecoration || "none",
//                           cursor: "move",
//                           whiteSpace: "pre",
//                           padding: "2px 6px",
//                           borderRadius: 6,
//                           background:
//                             activeId === obj.id
//                               ? "rgba(59,130,246,0.08)"
//                               : "transparent",
//                           outline:
//                             activeId === obj.id
//                               ? "2px solid rgba(59,130,246,0.5)"
//                               : "none",
//                         }}
//                         title="Drag to move • Double click to edit"
//                       >
//                         {obj.text}
//                       </div>
//                     ) : (
//                       <div
//                         key={obj.id}
//                         onMouseDown={(e) => startDrag(e, obj)}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActiveId(obj.id);
//                           setCurrentPage(obj.page);
//                         }}
//                         style={{
//                           position: "absolute",
//                           left: obj.x * scale,
//                           top: obj.y * scale,
//                           width: (obj.width || 220) * scale,
//                           height: (obj.height || 32) * scale,
//                           background: obj.fill || "#ffffff",
//                           cursor: "move",
//                           outline:
//                             activeId === obj.id
//                               ? "2px solid rgba(59,130,246,0.5)"
//                               : "none",
//                         }}
//                         title="Drag to move • Resize from corner"
//                       >
//                         <div
//                           onMouseDown={(e) => startResize(e, obj)}
//                           className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
//                         />
//                       </div>
//                     )
//                   )}

//                   <div className="absolute -top-3 left-3 bg-white px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded-full">
//                     Page {pageNum}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <p className="text-xs text-gray-400 mt-2 text-center">
//         💡 Click a page to select it · Drag objects to reposition · Double-click text to edit
//       </p>
//     </div>
//   );
// }

// // ==================== MAIN COMPONENT ====================
// export default function EditPdf({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   // ── PDF state ──
//   const [pdfFile, setPdfFile] = useState(null);
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [numPages, setNumPages] = useState(0);
//   const [scale, setScale] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const canvasRefs = useRef([]);
//   const pageWrapRefs = useRef([]);

//   // ── Objects state ──
//   const [objects, setObjects] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const dragRef = useRef(null);
//   const resizeRef = useRef(null);

//   // ── UI state ──
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [outputFilename, setOutputFilename] = useState("edited.pdf");

//   const activeObj = objects.find((o) => o.id === activeId);

//   const objectsByPage = useMemo(() => {
//     const m = new Map();
//     for (const o of objects) {
//       if (!m.has(o.page)) m.set(o.page, []);
//       m.get(o.page).push(o);
//     }
//     return m;
//   }, [objects]);

//   // ── Sync pdfFile from flow.files ──
//   useEffect(() => {
//     const f = flow.files?.[0] || null;
//     if (f !== pdfFile) {
//       setPdfFile(f);
//       if (f) {
//         setObjects([]);
//         setActiveId(null);
//         setError("");
//         setCurrentPage(1);
//         setScale(1);
//         canvasRefs.current = [];
//         pageWrapRefs.current = [];
//         setOutputFilename(f.name.replace(/\.pdf$/i, "") + "-edited.pdf");
//       }
//     }
//   }, [flow.files]);

//   // ── Load PDF ──
//   useEffect(() => {
//     if (!pdfFile) return;

//     const load = async () => {
//       try {
//         setError("");
//         const pdfjsLib = window.pdfjsLib;
//         if (!pdfjsLib) return;

//         pdfjsLib.GlobalWorkerOptions.workerSrc =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

//         const buffer = await pdfFile.arrayBuffer();
//         const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

//         setPdfDoc(doc);
//         setNumPages(doc.numPages);
//         setCurrentPage(1);
//         setScale(1);
//         canvasRefs.current = new Array(doc.numPages);
//         pageWrapRefs.current = new Array(doc.numPages);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load PDF");
//       }
//     };

//     load();
//   }, [pdfFile]);

//   // ── Render all pages ──
//   useEffect(() => {
//     if (!pdfDoc || !numPages) return;
//     let cancelled = false;

//     const renderAll = async () => {
//       try {
//         for (let p = 1; p <= numPages; p++) {
//           if (cancelled) return;
//           const page = await pdfDoc.getPage(p);
//           const viewport = page.getViewport({ scale });
//           const canvas = canvasRefs.current[p - 1];
//           if (!canvas) continue;
//           const ctx = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           await page.render({ canvasContext: ctx, viewport }).promise;
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     renderAll();
//     return () => { cancelled = true; };
//   }, [pdfDoc, numPages, scale]);

//   // ── Object helpers ──
//   const updateObj = (id, updates) => {
//     setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
//   };

//   const deleteActive = () => {
//     if (!activeId) return;
//     setObjects((prev) => prev.filter((o) => o.id !== activeId));
//     setActiveId(null);
//   };

//   const addText = () => {
//     const id = Date.now();
//     setObjects((prev) => [
//       ...prev,
//       {
//         id, type: "text", page: currentPage,
//         text: "Double click to edit",
//         x: 100, y: 120, fontSize: 16,
//         color: "#111827", fontFamily: "Calibri",
//         fontWeight: "normal", fontStyle: "normal", textDecoration: "none",
//       },
//     ]);
//     setActiveId(id);
//   };

//   const addCover = () => {
//     const id = Date.now();
//     setObjects((prev) => [
//       ...prev,
//       {
//         id, type: "cover", page: currentPage,
//         x: 100, y: 120, width: 220, height: 32, fill: "#ffffff",
//       },
//     ]);
//     setActiveId(id);
//   };

//   const toggleBold = () => {
//     if (!activeObj || activeObj.type !== "text") return;
//     updateObj(activeObj.id, { fontWeight: activeObj.fontWeight === "bold" ? "normal" : "bold" });
//   };

//   const toggleItalic = () => {
//     if (!activeObj || activeObj.type !== "text") return;
//     updateObj(activeObj.id, { fontStyle: activeObj.fontStyle === "italic" ? "normal" : "italic" });
//   };

//   const toggleUnderline = () => {
//     if (!activeObj || activeObj.type !== "text") return;
//     updateObj(activeObj.id, {
//       textDecoration: activeObj.textDecoration === "underline" ? "none" : "underline",
//     });
//   };

//   // ── Drag / resize ──
//   const startDrag = (e, obj) => {
//     e.stopPropagation();
//     const pageIndex = (obj.page || 1) - 1;
//     const wrap = pageWrapRefs.current[pageIndex];
//     if (!wrap) return;
//     const rect = wrap.getBoundingClientRect();
//     dragRef.current = {
//       id: obj.id, page: obj.page,
//       startX: e.clientX, startY: e.clientY,
//       origX: obj.x, origY: obj.y,
//       pageLeft: rect.left, pageTop: rect.top,
//     };
//     setActiveId(obj.id);
//     setCurrentPage(obj.page);
//   };

//   const startResize = (e, obj) => {
//     e.stopPropagation();
//     resizeRef.current = {
//       id: obj.id, page: obj.page,
//       startX: e.clientX, startY: e.clientY,
//       origW: obj.width, origH: obj.height,
//     };
//     setActiveId(obj.id);
//     setCurrentPage(obj.page);
//   };

//   const onMove = (e) => {
//     if (dragRef.current) {
//       const { id, startX, startY, origX, origY } = dragRef.current;
//       updateObj(id, {
//         x: origX + (e.clientX - startX) / scale,
//         y: origY + (e.clientY - startY) / scale,
//       });
//     }
//     if (resizeRef.current) {
//       const { id, startX, startY, origW, origH } = resizeRef.current;
//       updateObj(id, {
//         width: clamp(origW + (e.clientX - startX) / scale, 20, 3000),
//         height: clamp(origH + (e.clientY - startY) / scale, 12, 3000),
//       });
//     }
//   };

//   const stopDrag = () => {
//     dragRef.current = null;
//     resizeRef.current = null;
//   };

//   // ── Remove file ──
//   const handleRemoveFile = () => {
//     setPdfFile(null);
//     setPdfDoc(null);
//     setNumPages(0);
//     setObjects([]);
//     setActiveId(null);
//     setError("");
//     canvasRefs.current = [];
//     pageWrapRefs.current = [];
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

//   // ── Convert ──
//   const handleConvert = async () => {
//     if (!pdfFile) {
//       setError("Please upload a PDF file!");
//       return;
//     }
//     if (objects.length === 0) {
//       setError("Please add at least one text or cover box first!");
//       return;
//     }

//     flow.startProcessing();
//     startProgress();
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("pdfFile", pdfFile);
//       formData.append("edits", JSON.stringify(objects));

//       // const res = await fetch("/convert/edit-pdf", {
//       //   method: "POST",
//       //   body: formData,
//       // });

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/edit-pdf`, {
//         method: "POST",
//         body: formData,
//       });


//       if (!res.ok) {
//         let msg = "Edit failed";
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
//       const msg = (err?.message || "Something went wrong").toString();
//       setError(msg);
//       flow.handleError(msg);
//       console.error(err);
//     }
//   };

//   // ── Options slot ──
//   const optionsSlot = (
//     <div className="space-y-5">
//       {/* Toolbar */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h3 className="text-base font-bold text-slate-900">Edit tools</h3>
//         <p className="mt-1 text-sm text-slate-500">
//           Add text or cover existing text on any page.
//         </p>

//         <div className="flex flex-wrap gap-2 mt-4">
//           <button
//             type="button"
//             onClick={addText}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
//           >
//             <Type className="w-4 h-4" />
//             Add Text
//           </button>

//           <button
//             type="button"
//             onClick={addCover}
//             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
//           >
//             <Square className="w-4 h-4" />
//             Cover Text
//           </button>

//           <button
//             type="button"
//             onClick={deleteActive}
//             disabled={!activeId}
//             className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <Trash2 className="w-4 h-4" />
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Text styling — only when text object is active */}
//       {activeObj?.type === "text" && (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h3 className="text-base font-bold text-slate-900">Text style</h3>
//           <p className="mt-1 text-sm text-slate-500">
//             Format the selected text box.
//           </p>

//           <div className="mt-4 flex flex-wrap items-center gap-2">
//             {/* Bold / Italic / Underline */}
//             <button
//               type="button"
//               onClick={toggleBold}
//               className={`p-2 rounded-lg border ${activeObj.fontWeight === "bold"
//                 ? "bg-gray-900 text-white border-gray-900"
//                 : "bg-white text-gray-700 border-gray-300"
//                 }`}
//               title="Bold"
//             >
//               <Bold className="w-4 h-4" />
//             </button>

//             <button
//               type="button"
//               onClick={toggleItalic}
//               className={`p-2 rounded-lg border ${activeObj.fontStyle === "italic"
//                 ? "bg-gray-900 text-white border-gray-900"
//                 : "bg-white text-gray-700 border-gray-300"
//                 }`}
//               title="Italic"
//             >
//               <Italic className="w-4 h-4" />
//             </button>

//             <button
//               type="button"
//               onClick={toggleUnderline}
//               className={`p-2 rounded-lg border ${activeObj.textDecoration === "underline"
//                 ? "bg-gray-900 text-white border-gray-900"
//                 : "bg-white text-gray-700 border-gray-300"
//                 }`}
//               title="Underline"
//             >
//               <Underline className="w-4 h-4" />
//             </button>

//             {/* Font size */}
//             <div className="flex items-center gap-1 ml-1">
//               <button
//                 type="button"
//                 onClick={() =>
//                   updateObj(activeObj.id, {
//                     fontSize: Math.max(8, (activeObj.fontSize || 16) - 2),
//                   })
//                 }
//                 className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm"
//               >
//                 A-
//               </button>
//               <span className="text-sm font-medium w-10 text-center">
//                 {activeObj.fontSize || 16}
//               </span>
//               <button
//                 type="button"
//                 onClick={() =>
//                   updateObj(activeObj.id, {
//                     fontSize: (activeObj.fontSize || 16) + 2,
//                   })
//                 }
//                 className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm"
//               >
//                 A+
//               </button>
//             </div>

//             {/* Font family */}
//             <select
//               value={activeObj.fontFamily || "Calibri"}
//               onChange={(e) => updateObj(activeObj.id, { fontFamily: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
//             >
//               {FONT_OPTIONS.map((f) => (
//                 <option key={f} value={f}>{f}</option>
//               ))}
//             </select>

//             {/* Color picker */}
//             <input
//               type="color"
//               value={activeObj.color || "#111827"}
//               onChange={(e) => updateObj(activeObj.id, { color: e.target.value })}
//               className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300 bg-white"
//               title="Text color"
//             />

//             {/* Dark presets */}
//             <div className="flex items-center gap-1">
//               {DARK_PRESETS.map((c) => (
//                 <button
//                   key={c}
//                   type="button"
//                   onClick={() => updateObj(activeObj.id, { color: c })}
//                   className="w-6 h-6 rounded border border-gray-300"
//                   style={{ background: c }}
//                   title={c}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error */}
//       {/* {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           <p className="font-semibold">{error}</p>
//         </div>
//       )} */}


//     </div>
//   );

//   return (
//     <>
//       {/* PDF.js */}
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="beforeInteractive"
//       />

//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Edit PDF Online for Free",
//             description:
//               "Add text, cover existing text, change font, color and download an edited PDF with live preview.",
//             url: "https://pdflinx.com/edit-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Upload the PDF you want to edit." },
//               { "@type": "HowToStep", name: "Add text or cover", text: "Add text anywhere or cover existing text with a white box." },
//               { "@type": "HowToStep", name: "Style and download", text: "Change font, size and color, then download the edited PDF." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Edit PDF", item: "https://pdflinx.com/edit-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="faq-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               {
//                 "@type": "Question",
//                 name: "Is PDFLinx Edit PDF free to use?",
//                 acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx Edit PDF is free — no sign-up, no watermarks." },
//               },
//               {
//                 "@type": "Question",
//                 name: "Can I edit existing text inside the PDF?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "You can cover existing text with a white box and place new text on top. True editing depends on the PDF structure.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Can I change font size, font family, color, bold and italic?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. Select a text box, then change its font, size, color, bold/italic/underline from the toolbar.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Is my PDF secure?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. Files are processed automatically and deleted after processing. No accounts required.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Does it work on mobile?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: "Yes. The editor is mobile-friendly with scrolling and zoom support.",
//                 },
//               },
//             ],
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="software-schema-editpdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "SoftwareApplication",
//             name: "Edit PDF Online - PDFLinx",
//             applicationCategory: "BusinessApplication",
//             operatingSystem: "Web Browser",
//             description: "Edit PDF online free — add or change text, insert images, highlight content, and annotate pages directly in your browser. No Adobe Acrobat, no account, no watermark.",
//             url: "https://pdflinx.com/edit-pdf",
//             screenshot: "https://pdflinx.com/og-image.png",
//             offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
//             featureList: [
//               "Add text to PDF online",
//               "Cover existing text with white box",
//               "Change font, size, color, bold, italic",
//               "Live PDF preview while editing",
//               "Free online PDF editor",
//               "No signup required",
//               "Secure file processing",
//               "Works on mobile and desktop"
//             ],
//             creator: { "@type": "Organization", name: "PDFLinx" }
//           }, null, 2),
//         }}
//       />

//       {/* ==================== TOOL UI ==================== */}
//       {/* <ToolPageLayout
//         title={seo?.h1 || "Edit PDF Online Free"} */}
//       <ToolPageLayout
//         title={seo?.h1 || "Edit PDF Online Free"}
//         hideSidebar={true}
//         tagline="Add Text · Cover & Replace · No Signup · No Watermark"
//         accept=".pdf,application/pdf"
//         multiple={false}
//         convertLabel="Save PDF"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         sidebarLinks={DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsTitle="Editor options"
//         optionsSlot={optionsSlot}
//         processingTitle="Saving your edited PDF..."
//         processingDescription="Applying your edits and generating the final PDF."
//         processingStages={["Uploading", "Applying edits", "Done"]}
//         doneTitle="Your edited PDF is ready"
//         doneDescription="Click download to save your edited PDF."
//         downloadLabel="Download Edited PDF"
//         resetLabel="Edit another PDF"
//         sidebarTitle="Edit PDF"
//         sidebarIcon={<Type className="h-5 w-5 text-white" />}
//         sidebarDescription="Add text, cover old content, change font and color — with live preview."
//         sidebarNotice={
//           <>
//             <p className="text-sm font-semibold text-blue-800">ℹ️ Editor</p>
//             <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
//               <li>Add text on any page</li>
//               <li>Cover & replace existing text</li>
//               <li>Font, size, color, bold/italic</li>
//               <li>Drag to reposition objects</li>
//             </ul>
//           </>
//         }
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF files only"

//         // customFilePreview={
//         //   <EditPdfPreview
//         //     pdfFile={pdfFile}
//         //     pdfDoc={pdfDoc}
//         //     numPages={numPages}
//         //     scale={scale}
//         //     setScale={setScale}
//         //     canvasRefs={canvasRefs}
//         //     pageWrapRefs={pageWrapRefs}
//         //     objects={objects}
//         //     objectsByPage={objectsByPage}
//         //     activeId={activeId}
//         //     setActiveId={setActiveId}
//         //     currentPage={currentPage}
//         //     setCurrentPage={setCurrentPage}
//         //     startDrag={startDrag}
//         //     startResize={startResize}
//         //     onMove={onMove}
//         //     stopDrag={stopDrag}
//         //     updateObj={updateObj}
//         //   />
//         // }


//         customOptionsLayout={
//           <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

//             {/* LEFT — PDF Preview */}
//             <div>
//               <EditPdfPreview
//                 pdfFile={pdfFile}
//                 pdfDoc={pdfDoc}
//                 numPages={numPages}
//                 scale={scale}
//                 setScale={setScale}
//                 canvasRefs={canvasRefs}
//                 pageWrapRefs={pageWrapRefs}
//                 objects={objects}
//                 objectsByPage={objectsByPage}
//                 activeId={activeId}
//                 setActiveId={setActiveId}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//                 startDrag={startDrag}
//                 startResize={startResize}
//                 onMove={onMove}
//                 stopDrag={stopDrag}
//                 updateObj={updateObj}
//               />
//             </div>

//             {/* RIGHT — Options + Save Button */}
//             <div className="space-y-4 xl:sticky xl:top-6 h-fit">
//               {optionsSlot}

//               {error && (
//                 <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                   <p className="font-semibold">{error}</p>
//                 </div>
//               )}

//               <button
//                 type="button"
//                 onClick={handleConvert}
//                 disabled={!pdfFile || objects.length === 0}
//                 className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${pdfFile && objects.length > 0
//                   ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
//                   : "cursor-not-allowed bg-slate-300"
//                   }`}
//               >
//                 Save PDF
//               </button>
//             </div>

//           </div>
//         }


//         // ============================================================
//         // EDIT PDF — uploadLanding content
//         // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
//         // ============================================================

//         uploadLanding={{
//           content: {
//             relatedTools: DONE_LINKS,
//             eyebrow: "EDIT PDF ONLINE",

//             breadcrumbCurrent: "Edit PDF",

//             heroBadge: "✦ 100% Free · No Signup · No Watermark",

//             // heroTitle: (
//             //   <>
//             //     Edit PDF Online —{" "}
//             //     <em className="font-bold text-[#e8420a] sm:italic">
//             //       Free, Add Text, Shapes & Annotations
//             //     </em>
//             //   </>
//             // ),

//             // heroDescription:
//             //   "Edit any PDF online for free. Add text, highlight, draw shapes, add signatures, and annotate — directly in your browser. No signup, no watermark, no software needed. Works on any device.",

//             // pills: [
//             //   "No watermark",
//             //   "Add text & annotations",
//             //   "Highlight & draw shapes",
//             //   "Sign & stamp PDFs",
//             // ],

//             heroTitle: (
//               <>
//                 Edit PDF Online —{" "}
//                 <em className="font-bold text-[#e8420a] sm:italic">
//                   Add Text, Images & More Free
//                 </em>
//               </>
//             ),
//             heroDescription:
//               "Edit PDF online free — add or change text, insert images, highlight content, and annotate pages directly in your browser. No Adobe Acrobat, no account, no watermark.",
//             pills: ["Add & edit text", "Insert images", "Highlight & annotate", "No Acrobat needed"],



//             uploadTitle: "Drop your PDF here",
//             uploadSubtitle: "or click to browse — PDF files supported",

//             trustPills: ["100% Free", "No Sign Up", "No Watermark"],

//             noticeTitle: "Edit PDF Info",
//             noticeItems: [
//               "Add text boxes, highlights & shapes",
//               "Insert signatures and stamps",
//               "Changes saved permanently in PDF",
//             ],

//             rating: "4.9/5",
//             ratingText: "Trusted by 50,000+ users monthly",

//             pdfTypeSection: {
//               enabled: false,
//             },

//             howToEyebrow: "How It Works",
//             howToTitle: "How to Edit a PDF Online — 3 Simple Steps",
//             howToSubtitle:
//               "No learning curve. Upload, edit directly in the browser, download — done in minutes.",

//             howToSteps: [
//               {
//                 n: "1",
//                 title: "Upload Your PDF File",
//                 desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. The PDF opens instantly in the online editor — no waiting, no plugins.",
//                 color: "bg-blue-600",
//               },
//               {
//                 n: "2",
//                 title: "Edit, Annotate & Add Content",
//                 desc: "Add text boxes anywhere on the page, highlight important sections, draw shapes and lines, insert a signature, or stamp the document. All editing happens directly in your browser in real time.",
//                 color: "bg-purple-600",
//               },
//               {
//                 n: "3",
//                 title: "Download Your Edited PDF",
//                 desc: "Click Save and your edited PDF is ready in seconds. All additions — text, highlights, shapes, signatures — are permanently embedded and visible in any PDF viewer.",
//                 color: "bg-emerald-600",
//               },
//             ],

//             whyTitle: "Why PDFLinx is the Best Free Online PDF Editor",

//             seoBadge: "Edit PDF Online Guide",
//             seoTitle: "Complete Guide to Editing PDF Files Online",
//             seoDescription:
//               "Everything you need to know about editing PDFs online — add text, highlight, draw shapes, sign, and annotate any PDF for free. No watermark, no signup, no software needed.",

//             seoSections: [
//               {
//                 title:
//                   "Free PDF Editor — Add Text, Annotations & Signatures to Any PDF Online",
//                 text: "Need to edit a PDF online? PDFLinx gives you a full-featured PDF editor in your browser — completely free and without any software installation. Add text boxes, highlight content, draw shapes and arrows, insert signatures, and annotate any PDF directly on the page. Whether it is a form you need to fill, a contract you need to sign and annotate, a report you need to mark up, or a document you need to stamp, PDFLinx handles it instantly. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
//               },
//               {
//                 title: "What Can You Edit in a PDF with PDFLinx?",
//                 text: "PDFLinx is an annotation and content-addition editor — the most practical kind of PDF editing for everyday needs. You can add text boxes anywhere on any page to insert new content, fill in form fields, or label sections. You can highlight text to draw attention to important passages. You can draw rectangles, circles, lines, and arrows to annotate diagrams or emphasize areas. You can insert a hand-drawn or typed signature. You can add stamps such as APPROVED, RECEIVED, or CONFIDENTIAL. Everything you add becomes a permanent part of the PDF output.",
//               },
//               {
//                 title: "Adding Text to a PDF — Without Converting to Word",
//                 text: "One of the most common PDF editing needs is adding text — filling in a form field, inserting a note, labeling a diagram, or adding a missing line of content. PDFLinx lets you click anywhere on a PDF page and add a text box with your chosen font size and color — no need to convert the PDF to Word first, make changes, and convert back. For quick text additions, PDFLinx is far faster and simpler than a full roundtrip conversion. For more extensive editing of the original document text, converting to Word using our PDF to Word tool may be a better approach.",
//               },
//               {
//                 title: "Highlight, Annotate & Mark Up PDFs for Review",
//                 text: "PDFLinx is ideal for document review workflows. Highlight key sentences in yellow or another color to flag important content. Draw arrows pointing to specific elements. Add text comment boxes explaining changes or raising questions. Draw rectangles around sections that need attention. These annotation tools are exactly what legal teams, editors, educators, and business reviewers use when marking up documents — and PDFLinx delivers them without requiring Adobe Acrobat or any other paid software.",
//               },
//               {
//                 title: "Add a Signature to a PDF — Free, No Account Needed",
//                 text: "Signing a PDF is one of the most frequent editing tasks — and PDFLinx makes it completely free. Draw your signature using a mouse or touchscreen, type your name in a signature style, or upload an image of your signature. Place it anywhere on the page, resize it, and save. The signature is permanently embedded in the PDF — ready to share, submit, or print immediately. No paid e-signature subscription needed for simple document signing.",
//               },
//               {
//                 title:
//                   "Why PDFLinx is the Best Free Online PDF Editor — No Watermark, No Limits",
//                 text: "Most free online PDF editors add watermarks, restrict the number of edits per day, limit the tools available on free plans, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict annotation and editing tools on free tiers, and unlike Adobe Acrobat which requires a monthly subscription, PDFLinx gives you practical PDF editing at zero cost.",
//               },
//               {
//                 title: "Common Use Cases for Editing a PDF Online",
//                 text: "✓ Fill PDF Forms: Add text to form fields in PDFs that are not interactive — contracts, applications, questionnaires, and tax forms.\n✓ Sign Documents: Insert a signature on contracts, agreements, consent forms, and any document requiring a sign-off.\n✓ Review & Mark Up: Highlight, annotate, and comment on reports, drafts, manuscripts, and legal documents.\n✓ Label Diagrams: Add text labels and arrows to technical drawings, floor plans, and visual documents.\n✓ Stamp Documents: Apply APPROVED, RECEIVED, DRAFT, or custom stamps to documents in a workflow.\n✓ Add Missing Content: Insert text, shapes, or notes to a PDF where content is missing or needs clarification.",
//               },
//               {
//                 title:
//                   "Edit PDF on iPhone, Android, Mac & Windows — No App Needed",
//                 text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, the PDF editor works on touchscreens — draw signatures with your finger, tap to add text boxes, and highlight by touch. On Mac or Windows, use your mouse or trackpad to annotate with precision. Whether you need to edit a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
//               },
//               {
//                 title: "Privacy and File Security",
//                 text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. This is especially important when editing contracts, legal documents, financial records, or any confidential business file. All file transfers use encrypted HTTPS connections for complete security.",
//               },
//               {
//                 title: "Edit PDF vs Convert to Word — When to Use Which Approach",
//                 text: "PDF editing in PDFLinx is best for adding content on top of existing pages — text boxes, highlights, signatures, shapes, and annotations. If you need to change the original text of the document — rewrite paragraphs, update names and dates in the body text, restructure content — converting to Word using our PDF to Word tool gives you a fully editable document where the original text can be modified directly. For anything that requires overlaying new content without changing the underlying document structure, the PDF editor is the faster, simpler choice.",
//               },
//             ],

//             faqs: [
//               {
//                 q: "Is PDFLinx PDF editor free?",
//                 a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of edits or how many PDFs you edit.",
//               },
//               {
//                 q: "Do I need to sign up or create an account?",
//                 a: "No account required. Upload your PDF and start editing instantly — no email, no registration, no friction.",
//               },
//               {
//                 q: "What editing tools does PDFLinx offer?",
//                 a: "PDFLinx lets you add text boxes, highlight content, draw shapes and arrows, insert signatures (drawn, typed, or uploaded), add stamps, and annotate pages — all directly in the browser.",
//               },
//               {
//                 q: "Can I add text anywhere on a PDF page?",
//                 a: "Yes. Click anywhere on any page to place a text box and type your content. Choose font size and color to match the document style.",
//               },
//               {
//                 q: "Can I fill in PDF forms that are not interactive?",
//                 a: "Yes. Use the text box tool to click inside form fields on non-interactive PDFs and type your answers — an effective way to fill forms that lack built-in fillable fields.",
//               },
//               {
//                 q: "Can I add my signature to a PDF?",
//                 a: "Yes. Draw your signature with a mouse or finger, type it in a signature font, or upload an image of your signature. Place and resize it anywhere on the page.",
//               },
//               {
//                 q: "Can I highlight text in a PDF?",
//                 a: "Yes. Use the highlight tool to select and highlight text in any color — useful for marking important passages in documents you are reviewing.",
//               },
//               {
//                 q: "Are my edits permanently saved in the PDF?",
//                 a: "Yes. All additions — text, highlights, shapes, signatures, stamps — are permanently embedded into the PDF output and visible in every PDF viewer on every device.",
//               },
//               {
//                 q: "Can I edit the original text of a PDF — like rewriting a sentence?",
//                 a: "Direct original text editing depends on the PDF type. For quick content additions and annotations, use the editor. For extensive original text changes, use our PDF to Word converter to get a fully editable document.",
//               },
//               {
//                 q: "Does PDFLinx add any watermark to the edited PDF?",
//                 a: "No watermarks, ever. Your edited PDF contains only what you added — no platform branding or stamps from PDFLinx.",
//               },
//               {
//                 q: "Is my file secure and private?",
//                 a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
//               },
//               {
//                 q: "Can I use PDFLinx PDF editor on mobile — iPhone and Android?",
//                 a: "Yes. The PDF editor works on touchscreens — draw signatures with your finger, tap to add text, and highlight by touch. No app download needed.",
//               },
//               {
//                 q: "What is the maximum file size limit?",
//                 a: "Up to 50 MB per file. For very large PDFs, try splitting the file first using our free PDF Split tool, edit each part, then merge them back.",
//               },
//               {
//                 q: "Can I edit a password-protected PDF?",
//                 a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then open it in the editor.",
//               },
//               {
//                 q: "What is the difference between Edit PDF and PDF to Word?",
//                 a: "Edit PDF adds content on top of existing pages — text boxes, highlights, signatures, shapes. PDF to Word converts the document into an editable Word file where the original text itself can be changed. Use Edit PDF for annotations and additions, use PDF to Word for rewriting original content.",
//               },
//               {
//                 q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF editing?",
//                 a: "Yes — PDFLinx offers a full annotation and editing toolset for free with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict editing tools behind paid plans.",
//               },
//             ],

//             ctaTitle: (
//               <>
//                 Edit your PDF now —<br />
//                 free, private, no sign‑up.
//               </>
//             ),
//             ctaDescription:
//               "Join thousands who trust PDFLinx for fast, easy PDF editing directly in the browser every day.",
//             ctaButton: "Choose PDF File",
//           },
//         }}
//       />

//     </>
//   );
// }




