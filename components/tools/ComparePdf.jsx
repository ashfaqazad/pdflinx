// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//     GitCompare,
//     Download,
//     MonitorSmartphone,
//     CheckCircle,
//     FileText,
//     ArrowRight,
//     Info,
//     AlertTriangle,
//     Plus,
//     X,
//     Columns2,
//     AlignLeft,
//     Search,
//     ChevronDown,
//     ChevronUp,
// } from "lucide-react";

// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import {
//     DEFAULT_DONE_LINKS,
//     DEFAULT_SIDEBAR_FEATURES,
// } from "@/lib/toolUiConfig";

// // ─────────────────────────────────────────────────────────────
// // Load PDF.js dynamically
// // ─────────────────────────────────────────────────────────────
// let pdfJsPromise = null;

// function loadPdfJs() {
//     if (pdfJsPromise) return pdfJsPromise;
//     pdfJsPromise = new Promise((resolve, reject) => {
//         if (typeof window === "undefined") return reject("SSR");
//         if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
//         const script = document.createElement("script");
//         script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
//         script.onload = () => {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//                 "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//             resolve(window.pdfjsLib);
//         };
//         script.onerror = reject;
//         document.head.appendChild(script);
//     });
//     return pdfJsPromise;
// }

// // ─────────────────────────────────────────────────────────────
// // PDF THUMBNAIL
// // ─────────────────────────────────────────────────────────────
// function PdfThumbnail({ file, label }) {
//     const canvasRef = useRef(null);
//     const [pageCount, setPageCount] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!file) return;
//         let cancelled = false;

//         const render = async () => {
//             try {
//                 const lib = await loadPdfJs();
//                 if (cancelled) return;
//                 const arrayBuffer = await file.arrayBuffer();
//                 if (cancelled) return;
//                 const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
//                 if (cancelled) return;
//                 setPageCount(pdf.numPages);
//                 const page = await pdf.getPage(1);
//                 if (cancelled) return;
//                 const canvas = canvasRef.current;
//                 if (!canvas) return;

//                 const viewport = page.getViewport({ scale: 1.4 });
//                 const context = canvas.getContext("2d");
//                 const deviceScale = window.devicePixelRatio || 1;
//                 canvas.width = viewport.width * deviceScale;
//                 canvas.height = viewport.height * deviceScale;
//                 canvas.style.width = `${viewport.width}px`;
//                 canvas.style.height = `${viewport.height}px`;
//                 context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
//                 await page.render({ canvasContext: context, viewport }).promise;
//                 if (!cancelled) setLoading(false);
//             } catch (e) {
//                 console.error("PDF render error:", e);
//                 if (!cancelled) setLoading(false);
//             }
//         };

//         render();
//         return () => { cancelled = true; };
//     }, [file]);

//     return (
//         <div className="relative flex items-center justify-center w-full h-full">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-[#f24d0d] animate-spin" />
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 className="max-w-full max-h-full object-contain"
//                 style={{ display: loading ? "none" : "block" }}
//             />
//             {!loading && pageCount && (
//                 <span className="absolute bottom-1.5 right-2 text-[10px] font-semibold text-slate-400 bg-white/90 rounded px-1 leading-4">
//                     {pageCount}p
//                 </span>
//             )}
//         </div>
//     );
// }

// // ─────────────────────────────────────────────────────────────
// // UPLOAD SLOT — left or right PDF slot
// // ─────────────────────────────────────────────────────────────
// function UploadSlot({ file, label, color, onFileSelect, onRemove }) {
//     const inputRef = useRef(null);

//     if (file) {
//         return (
//             <div className="relative group flex-1 min-w-0">
//                 {/* Label badge */}
//                 <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${color}`}>
//                     {label}
//                 </div>

//                 {/* Remove button */}
//                 <button
//                     onClick={onRemove}
//                     className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
//                 >
//                     <X className="h-3.5 w-3.5 text-red-500" />
//                 </button>

//                 {/* Preview card */}
//                 <div className="h-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
//                     <div className="h-[calc(100%-44px)] bg-[#f8f9fa] p-3 flex items-center justify-center overflow-hidden">
//                         <PdfThumbnail file={file} label={label} />
//                     </div>
//                     <div className="h-11 border-t border-slate-100 px-3 flex items-center justify-center">
//                         <p className="truncate text-center text-[11px] font-medium text-slate-600">
//                             {file.name}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <label
//             className="flex-1 min-w-0 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-[#f24d0d] hover:bg-orange-50/20 transition-all cursor-pointer group"
//             style={{ minHeight: 320 }}
//         >
//             {/* Label badge */}
//             <div className={`mb-4 px-3 py-1 rounded-full text-xs font-bold text-white ${color}`}>
//                 {label}
//             </div>

//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-orange-100 transition-colors">
//                 <FileText className="h-7 w-7 text-slate-400 group-hover:text-[#f24d0d] transition-colors" />
//             </div>
//             <p className="mt-3 text-sm font-semibold text-slate-500 group-hover:text-[#f24d0d] transition-colors">
//                 Upload {label}
//             </p>
//             <p className="mt-1 text-xs text-slate-400">Click or drop PDF here</p>

//             <input
//                 ref={inputRef}
//                 type="file"
//                 accept=".pdf"
//                 className="hidden"
//                 onChange={(e) => {
//                     const f = e.target.files?.[0];
//                     if (f) onFileSelect(f);
//                     e.target.value = "";
//                 }}
//             />
//         </label>
//     );
// }

// // ─────────────────────────────────────────────────────────────
// // COMPARE MODE SELECTOR TAB
// // ─────────────────────────────────────────────────────────────
// function ModeTab({ active, onClick, icon: Icon, label, description }) {
//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className={`flex-1 flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all ${active
//                 ? "border-[#f24d0d] bg-orange-50"
//                 : "border-slate-200 bg-white hover:border-slate-300"
//                 }`}
//         >
//             <Icon className={`h-5 w-5 ${active ? "text-[#f24d0d]" : "text-slate-400"}`} />
//             <span className={`text-xs font-bold ${active ? "text-[#f24d0d]" : "text-slate-600"}`}>
//                 {label}
//             </span>
//             <span className="text-[10px] text-slate-400 text-center leading-3">{description}</span>
//         </button>
//     );
// }

// // ─────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────
// export default function ComparePdf() {
//     const flow = useToolFlow();
//     const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//     const [downloadUrl, setDownloadUrl] = useState(null);

//     // Two separate PDF slots
//     const [fileA, setFileA] = useState(null); // Original / Old
//     const [fileB, setFileB] = useState(null); // Modified / New

//     // Compare options
//     const [compareMode, setCompareMode] = useState("semantic"); // "semantic" | "overlay"
//     const [searchText, setSearchText] = useState("");

//     // Preload PDF.js on mount
//     useEffect(() => {
//         loadPdfJs().catch(console.error);
//     }, []);

//     // Sync flow.files → fileA, fileB
//     useEffect(() => {
//         if (flow.files?.length >= 1) setFileA(flow.files[0]);
//         if (flow.files?.length >= 2) setFileB(flow.files[1]);
//     }, [flow.files]);

//     // When both files selected → move to OPTIONS step
//     useEffect(() => {
//         if (fileA && fileB) {
//             flow.selectFiles([fileA, fileB]);
//         }
//     }, [fileA, fileB]);

//     // flow reset → clear slots
//     useEffect(() => {
//         if (flow.files.length === 0) {
//             setFileA(null);
//             setFileB(null);
//         }
//     }, [flow.files.length]);

//     // ── Download ─────────────────────────────────────────────
//     const handleDownload = () => {
//         if (!downloadUrl) return;
//         const a = document.createElement("a");
//         a.href = downloadUrl;
//         a.download = "comparison-report.pdf";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//     };

//     // ── Compare ──────────────────────────────────────────────
//     const handleCompare = async () => {
//         if (!fileA || !fileB) return;
//         flow.startProcessing();
//         startProgress();
//         try {
//             const formData = new FormData();
//             formData.append("fileA", fileA);
//             formData.append("fileB", fileB);
//             formData.append("mode", compareMode);

//             const res = await fetch("/convert/compare-pdf", {
//                 method: "POST",
//                 body: formData,
//             });
//             if (!res.ok) throw new Error("Failed to compare PDFs");
//             const blob = await res.blob();
//             setDownloadUrl(URL.createObjectURL(blob));
//             completeProgress();
//             flow.finishSuccess();
//         } catch (err) {
//             console.error(err);
//             cancelProgress();
//             flow.handleError("Something went wrong while comparing PDFs.");
//         }
//     };

//     const bothSelected = !!fileA && !!fileB;

//     // ─────────────────────────────────────────────────────────
//     return (
//         <>
//             <ToolPageLayout
//                 title="Compare PDF Online"
//                 tagline="Compare Two PDF Files · Find Differences Instantly"
//                 accept=".pdf,application/pdf"
//                 multiple={false}
//                 convertLabel="Compare PDFs"
//                 flow={flow}
//                 progress={progress}
//                 onConvert={handleCompare}
//                 onDownload={handleDownload}
//                 doneLinks={DEFAULT_DONE_LINKS}
//                 showOutputFormat={false}
//                 showPreserveLayout={false}
//                 processingTitle="Comparing PDFs..."
//                 processingDescription="Analyzing differences between your PDF files."
//                 processingStages={["Uploading", "Analyzing content", "Detecting changes", "Done"]}
//                 doneTitle="Comparison report is ready"
//                 doneDescription="Download your PDF comparison report instantly."
//                 downloadLabel="Download Report"
//                 resetLabel="Compare another PDF"
//                 sidebarTitle="Compare PDF"
//                 sidebarIcon={<GitCompare className="h-5 w-5 text-white" />}
//                 sidebarDescription="Compare two PDF files and find differences instantly."
//                 sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//                 uploadTitle="Drop your PDF files here"
//                 uploadSubtitle="or click to browse — PDF supported"

//                 customOptionsLayout={
//                     <div
//                         className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
//                         style={{ minHeight: "calc(100vh - 120px)" }}
//                     >
//                         {/* TOP BAR */}
//                         <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
//                                     <GitCompare className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-sm font-bold text-slate-900">Compare PDF</h2>
//                                     <p className="text-xs text-slate-400">Find differences between two PDF files</p>
//                                 </div>
//                             </div>
//                             {/* Reset button */}
//                             {bothSelected && (
//                                 <button
//                                     onClick={() => { setFileA(null); setFileB(null); flow.reset(); }}
//                                     className="text-xs font-semibold text-slate-500 hover:text-red-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-red-200 transition"
//                                 >
//                                     Reset files
//                                 </button>
//                             )}
//                         </div>

//                         {/* MAIN GRID */}
//                         <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]">

//                             {/* LEFT — two PDF upload slots side by side */}
//                             <div
//                                 className="bg-[#f3f4f6] p-6 overflow-y-auto"
//                                 style={{ height: "calc(100vh - 140px)" }}
//                             >
//                                 {/* Upload area header */}
//                                 <div className="mb-4 flex items-center gap-2">
//                                     <Columns2 className="h-4 w-4 text-slate-400" />
//                                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
//                                         Upload two PDF files to compare
//                                     </p>
//                                 </div>

//                                 {/* Two slots side by side */}
//                                 <div className="flex gap-4" style={{ height: "calc(100% - 48px)" }}>
//                                     <UploadSlot
//                                         file={fileA}
//                                         label="PDF 1 — Original"
//                                         color="bg-blue-600"
//                                         onFileSelect={setFileA}
//                                         onRemove={() => setFileA(null)}
//                                     />

//                                     {/* VS divider */}
//                                     <div className="flex flex-col items-center justify-center gap-2 shrink-0">
//                                         <div className="w-px flex-1 bg-slate-300" />
//                                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-slate-300 shadow-sm">
//                                             <span className="text-xs font-black text-slate-400">VS</span>
//                                         </div>
//                                         <div className="w-px flex-1 bg-slate-300" />
//                                     </div>

//                                     <UploadSlot
//                                         file={fileB}
//                                         label="PDF 2 — Modified"
//                                         color="bg-emerald-600"
//                                         onFileSelect={setFileB}
//                                         onRemove={() => setFileB(null)}
//                                     />
//                                 </div>
//                             </div>

//                             {/* RIGHT SIDEBAR */}
//                             <div className="border-l border-slate-200 bg-white">
//                                 <div
//                                     className="sticky top-0 overflow-y-auto flex flex-col"
//                                     style={{ height: "calc(100vh - 140px)" }}
//                                 >
//                                     {/* Sidebar title */}
//                                     <div className="border-b border-slate-100 px-5 py-4">
//                                         <h3 className="text-lg font-bold text-slate-900">Compare PDF</h3>
//                                     </div>

//                                     <div className="flex-1 space-y-5 p-5 overflow-y-auto">

//                                         {/* Compare Mode */}
//                                         <div>
//                                             <p className="mb-2.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
//                                                 Compare Mode
//                                             </p>
//                                             <div className="flex gap-2">
//                                                 <ModeTab
//                                                     active={compareMode === "semantic"}
//                                                     onClick={() => setCompareMode("semantic")}
//                                                     icon={AlignLeft}
//                                                     label="Semantic Text"
//                                                     description="Text changes between PDFs"
//                                                 />
//                                                 <ModeTab
//                                                     active={compareMode === "overlay"}
//                                                     onClick={() => setCompareMode("overlay")}
//                                                     icon={Columns2}
//                                                     label="Content Overlay"
//                                                     description="Visual layout diff"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Mode description */}
//                                         <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
//                                             <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
//                                             <p className="text-xs text-blue-700 leading-5">
//                                                 {/* {compareMode === "semantic"
//                                                     ? "Semantic mode detects text additions, deletions, and edits between the two PDFs and generates a change report."
//                                                     : "Overlay mode visually overlays both PDFs to highlight layout and content position differences."
//                                                 } */}
//                                                 {compareMode === "semantic"
//                                                     ? "Semantic mode combines both PDFs into one report — original pages first, then modified pages for easy comparison."
//                                                     : "Overlay mode merges both PDFs together so you can review original and modified versions side by side."
//                                                 }

//                                             </p>
//                                         </div>

//                                         {/* Files status */}
//                                         <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
//                                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
//                                                 Selected Files
//                                             </p>

//                                             {/* File A */}
//                                             <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${fileA ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-white text-slate-400 border border-dashed border-slate-300"
//                                                 }`}>
//                                                 <div className={`h-2 w-2 rounded-full shrink-0 ${fileA ? "bg-blue-500" : "bg-slate-300"}`} />
//                                                 <span className="truncate">
//                                                     {fileA ? fileA.name : "PDF 1 — not selected"}
//                                                 </span>
//                                             </div>

//                                             {/* File B */}
//                                             <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${fileB ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-white text-slate-400 border border-dashed border-slate-300"
//                                                 }`}>
//                                                 <div className={`h-2 w-2 rounded-full shrink-0 ${fileB ? "bg-emerald-500" : "bg-slate-300"}`} />
//                                                 <span className="truncate">
//                                                     {fileB ? fileB.name : "PDF 2 — not selected"}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Warning if not both selected */}
//                                         {!bothSelected && (
//                                             <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
//                                                 <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
//                                                 <p className="text-xs text-amber-700 leading-5">
//                                                     Upload both PDF files to start comparing.
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* What to expect */}
//                                         {bothSelected && (
//                                             <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
//                                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
//                                                     Report will include
//                                                 </p>
//                                                 {[
//                                                     "Original PDF pages included",
//                                                     "Modified PDF pages included",
//                                                     "Both versions in one combined file",
//                                                     "Downloadable PDF report",

//                                                     // "Text additions (shown in green)",
//                                                     // "Text deletions (shown in red)",
//                                                     // "Page-by-page change summary",
//                                                     // "Downloadable PDF report",
//                                                 ].map((item, i) => (
//                                                     <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
//                                                         <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
//                                                         {item}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* CTA */}
//                                     <div className="border-t border-slate-100 p-5">
//                                         <button
//                                             type="button"
//                                             onClick={handleCompare}
//                                             disabled={!bothSelected}
//                                             className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${bothSelected
//                                                 ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-lg shadow-orange-200"
//                                                 : "cursor-not-allowed bg-slate-200 text-slate-400"
//                                                 }`}
//                                         >
//                                             <span>
//                                                 {bothSelected ? "Compare PDFs" : "Upload both PDFs first"}
//                                             </span>
//                                             {bothSelected && <ArrowRight className="h-5 w-5" />}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }

//                 uploadLanding={{
//                     content: {
//                         eyebrow: "COMPARE PDF",
//                         heroTitle: (
//                             <>
//                                 Compare PDF Files <br />
//                                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
//                                     find differences instantly
//                                 </em>
//                             </>
//                         ),
//                         heroDescription:
//                             "Compare two PDF files online for free. Review both versions together in one combined PDF report instantly.",
//                         noticeTitle: "Compare PDF features",
//                         noticeItems: [
//                             "Both PDF versions in one report",
//                             "Semantic & overlay comparison",
//                             "Download combined PDF report",
//                         ],
//                         howToTitle: "How to compare PDFs",
//                         howToSubtitle: "Upload two PDF files and find differences instantly online.",
//                         howToSteps: [
//                             { n: "1", title: "Upload two PDFs", desc: "Select the original and modified PDF files.", color: "bg-blue-600" },
//                             { n: "2", title: "Choose compare mode", desc: "Pick semantic text or visual overlay comparison.", color: "bg-orange-600" },
//                             { n: "3", title: "Download report", desc: "Get your combined PDF comparison report.", color: "bg-emerald-600" },
//                         ],
//                         whyTitle: "Why use PDFLinx Compare PDF?",
//                         whyItems: [
//                             { title: "Combined PDF Report", desc: "Both PDF versions merged into one file for easy side-by-side review.", icon: AlignLeft, iconColor: "text-orange-600", bgColor: "bg-orange-100" },
//                             { title: "Visual Overlay Mode", desc: "See layout and content position differences visually.", icon: Columns2, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
//                             { title: "Works on Any Device", desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
//                             { title: "Secure Processing", desc: "Files are encrypted and deleted automatically after processing.", icon: Download, iconColor: "text-green-600", bgColor: "bg-green-100" },
//                         ],
//                         seoBadge: "PDF Compare Tool",
//                         seoTitle: "Compare PDF Online Free",
//                         seoDescription: "Compare two PDF files online for free. Get both versions combined in one downloadable PDF report instantly with no signup required.",
//                         seoSections: [
//                             { title: "Combined PDF Report", text: "Both original and modified PDF versions merged into one file for easy review." },
//                             { title: "Semantic & Overlay Comparison", text: "Choose between semantic or overlay mode to review your PDF versions together." },
//                             { title: "Downloadable Combined Report", text: "Get both PDF versions in one downloadable report instantly." },
//                         ],
//                         faqTitle: "Frequently asked questions",
//                         faqs: [
//                             { q: "Can I compare two PDF files online?", a: "Yes. PDFLinx combines both PDF versions into one downloadable report for easy comparison." },
//                             { q: "What is the difference between Semantic and Overlay modes?", a: "Semantic mode places original pages first then modified pages. Overlay mode merges both PDFs together for layout review." },
//                             { q: "Will I get a report of all changes?", a: "Yes. After comparison you can download a combined PDF containing both versions for side-by-side review." },
//                             { q: "Does Compare PDF work on mobile?", a: "Yes. Compare PDF works on Android, iPhone, tablets, and desktop browsers." },
//                             { q: "Are my uploaded PDFs secure?", a: "Yes. Files are encrypted during upload and automatically deleted after processing." },
//                         ],
//                     },
//                 }}


//             />

//             <RelatedToolsSection />
//         </>
//     );
// }