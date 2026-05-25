"use client";

import { useState, useEffect, useRef } from "react";
import {
    Wrench,
    Download,
    MonitorSmartphone,
    CheckCircle,
    FileText,
    ArrowRight,
    RotateCw,
    Info,
    AlertTriangle,
    Plus,
    X,
} from "lucide-react";

import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import {
    DEFAULT_DONE_LINKS,
    DEFAULT_SIDEBAR_FEATURES,
} from "@/lib/toolUiConfig";

// ─────────────────────────────────────────────────────────────
// Load PDF.js dynamically
// ─────────────────────────────────────────────────────────────
let pdfJsPromise = null;

function loadPdfJs() {
    if (pdfJsPromise) return pdfJsPromise;
    pdfJsPromise = new Promise((resolve, reject) => {
        if (typeof window === "undefined") return reject("SSR");
        if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(window.pdfjsLib);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return pdfJsPromise;
}

// ─────────────────────────────────────────────────────────────
// PDF THUMBNAIL
// ─────────────────────────────────────────────────────────────
function PdfThumbnail({ file, rotation }) {
    const canvasRef = useRef(null);
    const [pageCount, setPageCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!file) return;
        let cancelled = false;

        const render = async () => {
            try {
                const lib = await loadPdfJs();
                if (cancelled) return;
                const arrayBuffer = await file.arrayBuffer();
                if (cancelled) return;
                const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
                if (cancelled) return;
                setPageCount(pdf.numPages);
                const page = await pdf.getPage(1);
                if (cancelled) return;
                const canvas = canvasRef.current;
                if (!canvas) return;

                const viewport = page.getViewport({ scale: 1.4 });
                const context = canvas.getContext("2d");
                const deviceScale = window.devicePixelRatio || 1;
                canvas.width = viewport.width * deviceScale;
                canvas.height = viewport.height * deviceScale;
                canvas.style.width = `${viewport.width}px`;
                canvas.style.height = `${viewport.height}px`;
                context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
                await page.render({ canvasContext: context, viewport }).promise;
                if (!cancelled) setLoading(false);
            } catch (e) {
                console.error("PDF render error:", e);
                if (!cancelled) setLoading(false);
            }
        };

        render();
        return () => { cancelled = true; };
    }, [file]);

    return (
        <div
            className="relative flex items-center justify-center w-full h-full"
            style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s ease" }}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-[#f24d0d] animate-spin" />
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain shadow-sm"
                style={{ display: loading ? "none" : "block" }}
            />
            {!loading && pageCount && (
                <span className="absolute bottom-1 right-1.5 text-[10px] font-semibold text-slate-400 bg-white/90 rounded px-1 leading-4">
                    {pageCount}p
                </span>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PDF CARD
// ─────────────────────────────────────────────────────────────
function PdfCard({ item, onRotate, onRemove }) {
    return (
        <div className="relative group w-[210px] shrink-0">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-[280px] bg-[#f8f9fa] flex items-center justify-center overflow-hidden p-2">
                    <PdfThumbnail file={item.file} rotation={item.rotation} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-all" />
                    <button
                        onClick={onRotate}
                        title="Rotate"
                        className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50"
                    >
                        <RotateCw className="h-3.5 w-3.5 text-slate-600" />
                    </button>
                    <button
                        onClick={onRemove}
                        title="Remove"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
                    >
                        <X className="h-3.5 w-3.5 text-red-500" />
                    </button>
                </div>
                <div className="border-t border-slate-100 px-3 py-2">
                    <p className="truncate text-center text-[11px] font-medium text-slate-600">
                        {item.file.name}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// ADD MORE CARD
// ─────────────────────────────────────────────────────────────
function AddMoreCard({ onAdd }) {
    return (
        <label className="flex h-[322px] w-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white hover:border-[#f24d0d] hover:bg-orange-50/30 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f24d0d] text-white group-hover:scale-105 transition-transform shadow">
                <Plus className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500 group-hover:text-[#f24d0d] transition-colors">
                Add more files
            </p>
            <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => onAdd(Array.from(e.target.files || []))}
            />
        </label>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function RepairPdf() {
    const flow = useToolFlow();
    const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

    const [downloadUrl, setDownloadUrl] = useState(null);
    const [filesPreview, setFilesPreview] = useState([]);

    // Preload PDF.js on mount
    useEffect(() => {
        loadPdfJs().catch(console.error);
    }, []);

    // ── KEY FIX: flow.files se sync karo ─────────────────────
    // UploadLandingStep directly flow.selectFiles() call karta hai
    // toh flow.files change hone pe filesPreview update karo
    useEffect(() => {
        if (flow.files && flow.files.length > 0) {
            // Sirf naye files add karo — duplicate avoid karne ke liye naam check
            setFilesPreview((prev) => {
                const existingNames = new Set(prev.map((p) => p.file.name + p.file.size));
                const newOnes = flow.files
                    .filter((f) => !existingNames.has(f.name + f.size))
                    .map((file) => ({
                        id: crypto.randomUUID(),
                        file,
                        rotation: 0,
                    }));
                // Agar flow.files bilkul naye hain (fresh upload), replace karo
                if (prev.length === 0) return newOnes;
                return [...prev, ...newOnes];
            });
        }
    }, [flow.files]);

    // flow reset hone pe filesPreview bhi clear karo
    useEffect(() => {
        if (flow.files.length === 0) {
            setFilesPreview([]);
        }
    }, [flow.files.length]);

    // ── Add files (from custom "+ Add files" button) ─────────
    const addMoreFiles = (files) => {
        // flow ko update karo (step OPTIONS pe rahega)
        flow.selectFiles([...flow.files, ...files]);
        // filesPreview update useEffect handle karega
    };

    // ── Fresh upload (replaces all) ──────────────────────────
    const handleFreshUpload = (files) => {
        setFilesPreview([]); // pehle clear karo
        flow.selectFiles(files); // yeh step → OPTIONS karega
        // filesPreview update useEffect handle karega
    };

    // ── Remove ───────────────────────────────────────────────
    const handleRemoveFile = (id) => {
        setFilesPreview((prev) => {
            const updated = prev.filter((f) => f.id !== id);
            // flow.files bhi sync karo
            const updatedFiles = updated.map((p) => p.file);
            if (updatedFiles.length === 0) {
                flow.reset();
            } else {
                // flow.files update karo without step change
                // flow.selectFiles se step reset ho sakta hai — sirf files update
                flow.selectFiles(updatedFiles);
            }
            return updated;
        });
    };

    // ── Rotate ───────────────────────────────────────────────
    const handleRotate = (id) => {
        setFilesPreview((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, rotation: (item.rotation + 90) % 360 }
                    : item
            )
        );
    };

    // ── Download ─────────────────────────────────────────────
    const handleDownload = () => {
        if (!downloadUrl) return;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "repaired-pdf.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // ── Convert ──────────────────────────────────────────────
    const handleConvert = async () => {
        if (!filesPreview.length) return;
        flow.startProcessing();
        startProgress();
        try {
            const formData = new FormData();
            filesPreview.forEach(({ file }) => formData.append("files", file));
            const res = await fetch("/convert/repair-pdf", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to repair PDF");
            const blob = await res.blob();
            setDownloadUrl(URL.createObjectURL(blob));
            completeProgress();
            flow.finishSuccess();
        } catch (err) {
            console.error(err);
            cancelProgress();
            flow.handleError("Something went wrong while repairing PDF.");
        }
    };

    // ─────────────────────────────────────────────────────────
    return (
        <>
            <ToolPageLayout
                title="Repair PDF Online"
                tagline="Fix Corrupted PDF Files · Recover Damaged Documents"
                accept=".pdf,application/pdf"
                multiple={true}
                convertLabel="Repair PDF"
                flow={flow}
                progress={progress}
                onConvert={handleConvert}
                onDownload={handleDownload}
                doneLinks={DEFAULT_DONE_LINKS}
                showOutputFormat={false}
                showPreserveLayout={false}
                processingTitle="Repairing PDF..."
                processingDescription="Recovering damaged PDF structure and content."
                processingStages={["Uploading", "Analyzing PDF", "Repairing structure", "Done"]}
                doneTitle="Your repaired PDF is ready"
                doneDescription="Download your repaired PDF instantly."
                downloadLabel="Download Repaired PDF"
                resetLabel="Repair another PDF"
                sidebarTitle="Repair PDF"
                sidebarIcon={<Wrench className="h-5 w-5 text-white" />}
                sidebarDescription="Repair corrupted or unreadable PDF documents online."
                sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
                uploadTitle="Drop your PDF files here"
                uploadSubtitle="or click to browse — PDF supported"

                customOptionsLayout={
                    <div
                        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
                        style={{ minHeight: "calc(100vh - 120px)" }}
                    >
                        {/* TOP BAR */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Repair PDF</h2>
                                    <p className="text-xs text-slate-400">Fix damaged and corrupted PDF files online</p>
                                </div>
                            </div>
                            <label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                + Add files
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.files || []);
                                        addMoreFiles(selected);
                                    }}
                                />
                            </label>
                        </div>

                        {/* MAIN GRID */}
                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]">

                            {/* LEFT — file cards */}
                            <div
                                className="bg-[#f3f4f6] p-6 overflow-y-auto"
                                style={{ height: "calc(100vh - 140px)" }}
                            >
                                {filesPreview.length > 0 ? (
                                    <div className="flex flex-wrap gap-4 content-start">
                                        {filesPreview.map((item) => (
                                            <PdfCard
                                                key={item.id}
                                                item={item}
                                                onRotate={() => handleRotate(item.id)}
                                                onRemove={() => handleRemoveFile(item.id)}
                                            />
                                        ))}
                                        <AddMoreCard onAdd={addMoreFiles} />
                                    </div>
                                ) : (
                                    /* Loading state — files aa rahe hain */
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/70">
                                                <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-[#f24d0d] animate-spin" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">
                                                Loading files...
                                            </p>
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
                                    <div className="border-b border-slate-100 px-5 py-4">
                                        <h3 className="text-lg font-bold text-slate-900">Repair PDF</h3>
                                    </div>

                                    <div className="flex-1 space-y-4 p-5">
                                        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                                            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-blue-700 leading-5">
                                                We will try to repair your PDFs. You may receive a different
                                                file format if recovery is only partially possible.
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-amber-700 leading-5">
                                                Some severely corrupted PDFs may not be fully recoverable.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Selected files</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {filesPreview.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 p-5">
                                        <button
                                            type="button"
                                            onClick={handleConvert}
                                            disabled={!filesPreview.length}
                                            className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                                                filesPreview.length
                                                    ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-lg shadow-orange-200"
                                                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                                            }`}
                                        >
                                            <span>
                                                {filesPreview.length ? "Repair PDF" : "Upload PDF first"}
                                            </span>
                                            {filesPreview.length > 0 && <ArrowRight className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                uploadLanding={{
                    content: {
                        eyebrow: "REPAIR PDF",
                        heroTitle: (
                            <>
                                Repair PDF Files <br />
                                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                                    online instantly
                                </em>
                            </>
                        ),
                        heroDescription:
                            "Repair damaged and corrupted PDF files online for free. Recover broken, unreadable, or invalid PDF documents instantly.",
                        noticeTitle: "Repair PDF features",
                        noticeItems: [
                            "Fix corrupted PDF files",
                            "Recover unreadable documents",
                            "Multiple file support",
                        ],
                        howToTitle: "How to repair a PDF",
                        howToSubtitle: "Upload damaged PDF files and recover them instantly online.",
                        howToSteps: [
                            { n: "1", title: "Upload your PDFs", desc: "Select damaged PDF files from your device.", color: "bg-blue-600" },
                            { n: "2", title: "Repair documents", desc: "Our engine analyzes and repairs corrupted PDF structure.", color: "bg-orange-600" },
                            { n: "3", title: "Download repaired PDF", desc: "Save and use your repaired documents instantly.", color: "bg-emerald-600" },
                        ],
                        whyTitle: "Why use PDFLinx Repair PDF?",
                        whyItems: [
                            { title: "Repair Corrupted PDFs", desc: "Recover unreadable or broken PDF files instantly.", icon: Wrench, iconColor: "text-orange-600", bgColor: "bg-orange-100" },
                            { title: "Fast Recovery", desc: "Analyze and repair PDF structure automatically.", icon: CheckCircle, iconColor: "text-green-600", bgColor: "bg-green-100" },
                            { title: "Works on Any Device", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
                            { title: "Secure Processing", desc: "Files are encrypted and deleted automatically.", icon: Download, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
                        ],
                        seoBadge: "PDF Repair Tool",
                        seoTitle: "Repair PDF Online Free",
                        seoDescription: "Repair corrupted and damaged PDF files online for free. Recover unreadable PDF documents instantly with no signup required.",
                        seoSections: [
                            { title: "Fix Corrupted PDF Files", text: "Repair unreadable, broken, or damaged PDF documents online instantly." },
                            { title: "Recover PDF Structure", text: "Our repair engine attempts to restore PDF formatting and readable content automatically." },
                            { title: "Online PDF Repair Tool", text: "Repair PDFs directly inside your browser without installing software." },
                        ],
                        faqTitle: "Frequently asked questions",
                        faqs: [
                            { q: "Can I repair corrupted PDF files online?", a: "Yes. PDFLinx lets you repair damaged and corrupted PDF files online for free." },
                            { q: "Will my PDF formatting stay intact?", a: "Our repair system tries to recover original formatting and readable content whenever possible." },
                            { q: "Does Repair PDF work on mobile?", a: "Yes. Repair PDF works on Android, iPhone, tablets, and desktop browsers." },
                            { q: "Are my uploaded PDFs secure?", a: "Yes. Files are encrypted during upload and automatically deleted after processing." },
                        ],
                    },
                }}
            />

            <RelatedToolsSection />
        </>
    );
}

