"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import {
    Wrench,
    Download,
    MonitorSmartphone,
    CheckCircle,
    ArrowRight,
    Info,
    AlertTriangle,
    Plus, Scan, Scissors, Pencil, RotateCw,
    X, Minimize2, LockOpen, Shield, GitMerge
} from "lucide-react";

import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import {
    DEFAULT_DONE_LINKS,
    DEFAULT_SIDEBAR_FEATURES,
} from "@/lib/toolUiConfig";


const DONE_LINKS = [
    { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
    { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
    { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
    { label: "Unlock PDF", href: "/unlock-pdf", icon: <LockOpen className="h-4 w-4 text-green-500" /> },
    { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
    { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
    { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
    { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
];


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

            <Script
                id="howto-schema-repair-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        name: "How to Repair a PDF Online for Free",
                        description:
                            "Upload a damaged or corrupted PDF file and repair it online in a few simple steps.",
                        url: "https://pdflinx.com/repair-pdf",
                        step: [
                            {
                                "@type": "HowToStep",
                                name: "Upload PDF",
                                text: "Select and upload the damaged or corrupted PDF file."
                            },
                            {
                                "@type": "HowToStep",
                                name: "Repair PDF",
                                text: "Start the repair process to analyze and fix PDF file issues."
                            },
                            {
                                "@type": "HowToStep",
                                name: "Download repaired PDF",
                                text: "Download the repaired PDF document after processing is complete."
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
                id="breadcrumb-schema-repair-pdf"
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
                                name: "Repair PDF",
                                item: "https://pdflinx.com/repair-pdf"
                            }
                        ]
                    }, null, 2),
                }}
            />

            <Script
                id="faq-schema-repair-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What does Repair PDF do?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Repair PDF helps fix corrupted, damaged, or unreadable PDF files so they can be opened and used again."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "Can all damaged PDF files be repaired?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Many PDF issues can be repaired, but the success depends on the extent of the file corruption."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "Will my PDF content remain unchanged?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The repair process focuses on restoring accessibility while preserving as much original content and formatting as possible."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "Does Repair PDF work on mobile devices?",
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
                id="software-schema-repair-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: "Repair PDF",
                        applicationCategory: "BusinessApplication",
                        operatingSystem: "Web Browser",
                        url: "https://pdflinx.com/repair-pdf",
                        description:
                            "Free online PDF repair tool. Fix corrupted, damaged, or unreadable PDF files and restore access to your documents quickly and securely.",
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
                            "Repair corrupted PDF files",
                            "Fix damaged PDF documents",
                            "Restore unreadable PDFs",
                            "Recover accessible PDF content",
                            "Fast PDF repair process",
                            "Works in any web browser",
                            "Free online PDF repair tool",
                            "No software installation required"
                        ]
                    }, null, 2),
                }}
            />


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
                sidebarLinks={DONE_LINKS}
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
                                            className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${filesPreview.length
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

                // ============================================================
                // REPAIR PDF — uploadLanding content
                // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
                // ============================================================

                uploadLanding={{
                    content: {
                        relatedTools: DONE_LINKS,

                        eyebrow: "REPAIR PDF",

                        breadcrumbCurrent: "Repair PDF",

                        heroBadge: "✦ 100% Free · No Signup · No Watermark",

                        heroTitle: (
                            <>
                                Repair PDF Files —{" "}
                                <em className="font-bold text-[#e8420a] sm:italic">
                                    Free, Online, Fix Corrupted PDFs
                                </em>
                            </>
                        ),

                        heroDescription:
                            "Repair corrupted, damaged, or unreadable PDF files online for free. Recover content from broken PDFs that won't open — no signup, no watermark, no software needed. Works on any device.",

                        pills: [
                            "No watermark",
                            "Fix corrupted & damaged PDFs",
                            "Recover unreadable files",
                            "Instant repair",
                        ],

                        uploadTitle: "Drop your damaged PDF here",
                        uploadSubtitle: "or click to browse — corrupted or broken PDF files supported",

                        trustPills: ["100% Free", "No Sign Up", "No Watermark"],

                        noticeTitle: "Repair PDF Info",
                        noticeItems: [
                            "Upload corrupted or damaged PDF",
                            "PDFLinx attempts full content recovery",
                            "Downloads as clean, working PDF",
                        ],

                        rating: "4.9/5",
                        ratingText: "Trusted by 50,000+ users monthly",

                        pdfTypeSection: {
                            enabled: false,
                        },

                        howToEyebrow: "How It Works",
                        howToTitle: "How to Repair a PDF — 3 Simple Steps",
                        howToSubtitle:
                            "No learning curve. Upload your broken PDF, let PDFLinx repair it, download — done in under a minute.",

                        howToSteps: [
                            {
                                n: "1",
                                title: "Upload Your Damaged PDF",
                                desc: "Select your corrupted, broken, or unreadable PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Upload it even if it won't open normally.",
                                color: "bg-blue-600",
                            },
                            {
                                n: "2",
                                title: "PDFLinx Repairs the File",
                                desc: "Our repair engine analyzes the PDF structure, identifies corrupted sections, rebuilds broken cross-reference tables, and recovers as much content as possible from the damaged file.",
                                color: "bg-purple-600",
                            },
                            {
                                n: "3",
                                title: "Download Your Repaired PDF",
                                desc: "Download the recovered PDF instantly. The repaired file opens normally in any PDF viewer — with as much of the original content restored as the damage level allows.",
                                color: "bg-emerald-600",
                            },
                        ],

                        whyTitle: "Why PDFLinx is the Best Free PDF Repair Tool Online",

                        seoBadge: "Repair PDF Guide",
                        seoTitle: "Complete Guide to Repairing Corrupted PDF Files Online",
                        seoDescription:
                            "Everything you need to know about repairing corrupted, damaged, and unreadable PDF files — free, online, instant recovery. No watermark, no signup, no limits.",

                        seoSections: [
                            {
                                title:
                                    "Free PDF Repair Tool — Fix Corrupted and Damaged PDF Files Online",
                                text: "Need to repair a corrupted PDF? PDFLinx lets you fix damaged, broken, and unreadable PDF files online for free — instantly and without any software installation. Whether your PDF shows an error when opening, displays garbled content, is partially viewable, or simply refuses to load in any viewer, PDFLinx analyzes the file structure and attempts to recover as much content as possible. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
                            },
                            {
                                title: "Why PDF Files Get Corrupted",
                                text: "PDF files get corrupted in several common ways. An interrupted download is the most frequent cause — if a PDF download is cut off before completion, the file is incomplete and unreadable. A failed file transfer over email, USB, or cloud storage can introduce data errors. Storage device failures — a failing hard drive, a corrupted memory card, or a damaged USB drive — can corrupt files saved on them. Software crashes during PDF creation or saving can produce an incomplete or structurally broken file. Virus infections and accidental partial deletion can also corrupt PDF content. In many of these cases, a significant portion of the original content is still present in the damaged file and can be recovered.",
                            },
                            {
                                title: "What Does PDF Repair Actually Do?",
                                text: "A PDF file has an internal structure — a cross-reference table, object streams, and a file trailer — that tells PDF viewers where to find each piece of content. When this structure is damaged, viewers cannot parse the file and show an error. PDF repair rebuilds this internal structure using whatever valid data remains in the file. PDFLinx scans the raw file data, identifies intact content objects — text, images, page structures — and reconstructs a valid PDF around them. The result is a properly structured file that opens normally, containing all the content that survived the corruption.",
                            },
                            {
                                title: "What Types of PDF Damage Can Be Repaired?",
                                text: "PDFLinx can repair several types of PDF damage. Truncated PDFs — files that were cut off during download or transfer — are often largely recoverable since most of the content exists but the file ending is missing. Corrupted cross-reference tables — the internal index of a PDF — can be rebuilt from the existing content objects. Minor data corruption affecting only part of the file can often be worked around by reconstructing undamaged sections. Heavily corrupted files where a large portion of the data is destroyed may have limited recovery — the tool always recovers as much as structurally possible.",
                            },
                            {
                                title:
                                    "Why PDFLinx is the Best Free PDF Repair Tool — No Watermark, No Limits",
                                text: "Most free PDF repair tools add watermarks to the recovered output, limit file sizes, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark on the repaired file, and no daily usage limit. Unlike paid tools like PDF2Go repair or Stellar PDF Repair which charge for full recovery, PDFLinx gives you the best possible repair result at zero cost.",
                            },
                            {
                                title: "Common Scenarios Where PDF Repair Helps",
                                text: "✓ Incomplete Downloads: Fix PDFs that were partially downloaded from the internet or a file sharing service and now show an error.\n✓ Failed Email Attachments: Recover PDFs that were corrupted during email transfer and cannot be opened by the recipient.\n✓ Cloud Sync Errors: Repair PDFs damaged during syncing with Dropbox, Google Drive, or OneDrive due to sync conflicts or interruptions.\n✓ Storage Device Failures: Attempt recovery of PDFs from a failing hard drive, corrupted USB drive, or damaged SD card before the device fails completely.\n✓ Software Crash Recovery: Recover PDFs that were being created or edited when the application crashed before saving properly.\n✓ Old or Degraded Files: Attempt to open very old PDF files that have become unreadable due to file system degradation over time.",
                            },
                            {
                                title:
                                    "Repair PDF on iPhone, Android, Mac & Windows — No App Needed",
                                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your damaged PDF directly from your files app. On Mac or Windows, drag and drop your broken PDF and download the repaired version in seconds. Whether you need to repair a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
                            },
                            {
                                title: "Privacy and File Security",
                                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
                            },
                            {
                                title: "What to Do If the PDF Cannot Be Fully Repaired",
                                text: "Not all PDF corruption is recoverable — heavily damaged files where most of the data is destroyed may only yield partial content or nothing at all. If PDFLinx cannot fully restore your PDF, consider these additional steps. Try re-downloading the file from the original source if it was a download. Ask the sender to resend the original file if it was received as an attachment. Check if a backup copy exists on another device, in a cloud backup, or in an email sent folder. If the file was on a failing storage device, stop using the device immediately and consult a professional data recovery service before more data is lost.",
                            },
                        ],

                        faqs: [
                            {
                                q: "Is PDFLinx PDF repair tool free?",
                                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of PDFs you attempt to repair.",
                            },
                            {
                                q: "Do I need to sign up or create an account?",
                                a: "No account required. Upload your damaged PDF and attempt repair instantly — no email, no registration, no friction.",
                            },
                            {
                                q: "Can PDFLinx repair any corrupted PDF?",
                                a: "PDFLinx repairs many types of PDF corruption — truncated files, broken cross-reference tables, and minor data damage. Heavily corrupted files where most of the data is destroyed may only yield partial recovery or none at all.",
                            },
                            {
                                q: "What types of corruption can be repaired?",
                                a: "Truncated downloads, broken internal structure, corrupted cross-reference tables, and minor data errors. Files cut off during download are often the most successfully repaired since most content is intact.",
                            },
                            {
                                q: "Will all content be recovered after repair?",
                                a: "PDFLinx recovers as much content as the damage level allows. Lightly damaged files often recover fully. More severely corrupted files may have partial content recovery. There is no guarantee of complete recovery for all damage types.",
                            },
                            {
                                q: "My PDF opens but shows garbled content — can it be repaired?",
                                a: "Yes. PDFs with display errors, garbled text, or partially missing content are good candidates for repair. Upload the file and let PDFLinx attempt to rebuild the internal structure.",
                            },
                            {
                                q: "My PDF will not open at all — can it still be repaired?",
                                a: "Yes. Upload it anyway — PDFLinx scans the raw file data even when the file is completely unreadable by standard viewers, and attempts to reconstruct a valid PDF from whatever valid data remains.",
                            },
                            {
                                q: "Does PDFLinx add any watermark to the repaired PDF?",
                                a: "No watermarks, ever. Your repaired PDF is 100% clean — just the recovered original content with no platform branding added.",
                            },
                            {
                                q: "Is my file secure and private?",
                                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
                            },
                            {
                                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
                            },
                            {
                                q: "What is the maximum file size limit?",
                                a: "Up to 50 MB per file. Even partially corrupted large files can be uploaded — the tool will attempt recovery regardless of how the file appears.",
                            },
                            {
                                q: "What should I do if the repair does not work?",
                                a: "Try re-downloading from the original source, ask the sender to resend, check for backup copies on other devices or cloud storage. If the file was on a failing drive, consult a professional data recovery service immediately.",
                            },
                            {
                                q: "Can I repair a PDF that was damaged on a USB drive or memory card?",
                                a: "Yes, upload the file and attempt repair. However, if the storage device itself is failing, stop using it immediately and consult a data recovery professional — further use can cause additional data loss.",
                            },
                            {
                                q: "How long does PDF repair take?",
                                a: "Most repair attempts complete within 10 to 30 seconds depending on file size and the type and extent of corruption.",
                            },
                            {
                                q: "Is PDFLinx better than other free PDF repair tools?",
                                a: "Yes — PDFLinx repairs PDFs with no watermark on output, no daily limits, and no account required. Most other free repair tools add watermarks or restrict recovery quality behind paid plans.",
                            },
                        ],

                        ctaTitle: (
                            <>
                                Repair your PDF now —<br />
                                free, private, no sign‑up.
                            </>
                        ),
                        ctaDescription:
                            "Join thousands who trust PDFLinx to recover content from damaged and corrupted PDF files every day.",
                        ctaButton: "Choose Damaged PDF File",
                    },
                }}


            />

            <RelatedToolsSection />
        </>
    );
}

