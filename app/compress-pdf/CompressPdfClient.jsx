"use client";

// import { useState } from "react";
import { FileDown } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";

import Script from "next/script";
import {
  GitMerge, Scissors, Wrench, Scan,
  FileText, Shield, Pencil, Image as ImageIcon
} from "lucide-react";

import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── Config ───────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
//   { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },

// ];

const DONE_LINKS = [
  { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge        className="h-4 w-4 text-purple-500"  /> },
  { label: "Split PDF",      href: "/split-pdf",      icon: <Scissors        className="h-4 w-4 text-orange-500"  /> },
  { label: "Repair PDF",     href: "/repair-pdf",     icon: <Wrench          className="h-4 w-4 text-amber-500"   /> },
  { label: "OCR PDF",        href: "/ocr-pdf",        icon: <Scan            className="h-4 w-4 text-violet-500"  /> },
  { label: "PDF to Word",    href: "/pdf-to-word",    icon: <FileText        className="h-4 w-4 text-blue-500"    /> },
  { label: "PDF to JPG",     href: "/pdf-to-jpg",     icon: <ImageIcon       className="h-4 w-4 text-pink-500"    /> },
  { label: "Protect PDF",    href: "/protect-pdf",    icon: <Shield          className="h-4 w-4 text-red-500"     /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ Compression Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Reduce file size up to 90%</li>
      <li>Quality optimized automatically</li>
      <li>Best for email & uploads</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Batch compression",
  "✓ Works on all devices",
];

// Compression level config — estimated reduction %
const COMPRESSION_OPTIONS = [
  {
    value: "high-quality",
    label: "High Quality",
    sublabel: "Less compression",
    estimated: "-20%",
    activeClass: "border-blue-500 bg-blue-50",
    hoverClass: "hover:border-blue-300",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    value: "recommended",
    label: "Recommended ⭐",
    sublabel: "Balanced size & quality",
    estimated: "-50%",
    activeClass: "border-green-500 bg-green-50",
    hoverClass: "hover:border-green-300",
    badgeClass: "bg-green-100 text-green-700",
  },
  {
    value: "max",
    label: "Max Compression",
    sublabel: "Smallest file size",
    estimated: "-75%",
    activeClass: "border-red-500 bg-red-50",
    hoverClass: "hover:border-red-300",
    badgeClass: "bg-red-100 text-red-700",
  },
];
// ───────────────────────────────────────────

// CompressPdf.jsx mein — export default se pehle add karo

function PdfThumbnail({ file }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file || !window.pdfjsLib) return;
    let cancelled = false;

    const render = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;
      } catch (e) {
        console.error("Thumbnail error:", e);
      }
    };

    // pdfjsLib ready hone ka wait karo
    const tryRender = () => {
      if (window.pdfjsLib) render();
      else setTimeout(tryRender, 100);
    };
    tryRender();

    return () => { cancelled = true; };
  }, [file]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
    />
  );
}


// function PdfThumbnail({ url }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!url || !window.pdfjsLib) return;
//     let cancelled = false;

//     const render = async () => {
//       try {
//         const pdf = await window.pdfjsLib.getDocument(url).promise;
//         const page = await pdf.getPage(1);
//         const viewport = page.getViewport({ scale: 0.6 });
//         const canvas = canvasRef.current;
//         if (!canvas || cancelled) return;
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         await page.render({
//           canvasContext: canvas.getContext("2d"),
//           viewport,
//         }).promise;
//       } catch (e) {
//         console.error("Thumbnail error:", e);
//       }
//     };

//     const tryRender = () => {
//       if (window.pdfjsLib) render();
//       else setTimeout(tryRender, 100);
//     };
//     tryRender();

//     return () => { cancelled = true; };
//   }, [url]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="h-full w-full object-contain bg-white"
//     />
//   );
// }

export default function CompressPdfClient() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [compressionLevel, setCompressionLevel] = useState("recommended");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [outputFileName, setOutputFileName] = useState("compressed-file.pdf");
  const [compressionStats, setCompressionStats] = useState(null);
  // { originalSize: 1234567, compressedSize: 345678 }

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // ── Estimated size display (before convert) ──
  const totalOriginalBytes = flow.files.reduce((sum, f) => sum + f.size, 0);
  const selectedOption = COMPRESSION_OPTIONS.find((o) => o.value === compressionLevel);
  const reductionFactor = compressionLevel === "high-quality" ? 0.20
    : compressionLevel === "recommended" ? 0.50
      : 0.75;
  const estimatedBytes = Math.round(totalOriginalBytes * (1 - reductionFactor));

  function formatBytes(bytes) {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  // ── OPTIONS SLOT ─────────────────────────────
  const optionsSlot = (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 px-1 mb-2">
        Compression level
      </h3>
      {COMPRESSION_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setCompressionLevel(opt.value)}
          className={`flex items-center justify-between px-4 py-4 border-b border-slate-200 text-left transition hover:bg-slate-50 ${compressionLevel === opt.value ? "bg-slate-50" : ""
            }`}
        >
          <div>
            <p className={`text-sm font-semibold ${compressionLevel === opt.value ? "text-[#e8420a]" : "text-slate-700"
              }`}>
              {opt.label.replace(" ⭐", "").toUpperCase()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{opt.sublabel}</p>
          </div>
          {compressionLevel === opt.value && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );

  // const optionsSlot = (
  //   <div className="grid grid-cols-1 gap-3">
  //     {COMPRESSION_OPTIONS.map((opt) => (
  //       <button
  //         key={opt.value}
  //         type="button"
  //         onClick={() => setCompressionLevel(opt.value)}
  //         className={`rounded-xl border p-4 text-left text-sm transition ${compressionLevel === opt.value
  //             ? opt.activeClass
  //             : `border-gray-200 ${opt.hoverClass}`
  //           }`}
  //       >
  //         <div className="flex items-center justify-between">
  //           <p className="font-semibold">{opt.label}</p>
  //           {/* Estimated reduction badge */}
  //           {compressionLevel === opt.value && totalOriginalBytes > 0 ? (
  //             <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${opt.badgeClass}`}>
  //               ~{formatBytes(estimatedBytes)}
  //             </span>
  //           ) : (
  //             <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
  //               {opt.estimated}
  //             </span>
  //           )}
  //         </div>
  //         <p className="mt-1 text-xs text-gray-400">{opt.sublabel}</p>
  //       </button>
  //     ))}
  //   </div>
  // );



  // ── API LOGIC ─────────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select PDF file(s) first");

    // Save original size before processing
    const originalSize = flow.files.reduce((sum, f) => sum + f.size, 0);

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("compressionLevel", compressionLevel);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/compress-pdf`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response from server:", text);
        cancelProgress();
        flow.handleError("Server returned invalid response");
        return;
      }

      if (!res.ok || !data.success) {
        cancelProgress();
        flow.handleError(data.error || "Compression failed");
        return;
      }

      const finalDownloadUrl = `/api${data.download}`;
      const finalFileName =
        flow.files.length > 1
          ? "compressed-files.zip"
          : flow.files[0].name.replace(/\.pdf$/i, "-compressed.pdf");

      setDownloadUrl(finalDownloadUrl);
      setOutputFileName(finalFileName);

      const fileRes = await fetch(finalDownloadUrl);
      if (!fileRes.ok) {
        cancelProgress();
        flow.handleError("Download failed from server");
        return;
      }

      const blob = await fileRes.blob();
      if (!blob.size) {
        cancelProgress();
        flow.handleError("Downloaded file is empty");
        return;
      }

      // ── Save compression stats ──
      setCompressionStats({
        originalSize,
        compressedSize: blob.size,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = finalFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong. Please try again.");
    }
  };


  const customOptionsLayout = (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-[1fr_300px]">

      {/* LEFT — File Preview */}
      {/* <div className="relative bg-slate-100 p-8"> */}
      <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">

        {/* Add more — top right corner */}
        <div className="absolute right-4 top-4">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
            <span className="text-base leading-none">+</span>
            <span>Add more</span>

            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);

                if (newFiles.length) {
                  flow.selectFiles([...flow.files, ...newFiles]);
                }
              }}
            />
          </label>
        </div>

        {/* Thumbnails */}
        <div className="flex flex-wrap justify-center gap-6 pt-10">
          {flow.files.map((file, i) => (
            <div
              key={i}
              className="group flex w-[140px] flex-col items-center gap-3"
              style={{
                animation: "previewPop 0.35s ease forwards",
                animationDelay: `${i * 70}ms`,
                opacity: 0,
              }}
            >

              {/* Preview Card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

                {/* PDF Preview */}
                {/* <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <iframe
                  src={`${URL.createObjectURL(file)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={file.name}
                  className="absolute left-0 -top-2 h-[115%] w-full border-0 pointer-events-none"
                />
                </div> */}
                {/* {(file.type === "application/pdf" || ext === "pdf") && (
                  <div className="h-full w-full overflow-hidden">
                    <iframe
                      src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      title={file.name}
                      scrolling="no"
                      className="pointer-events-none h-[130%] w-[135%] -translate-x-[14%] -translate-y-[12%] border-0"
                    />
                  </div>
                )} */}

                {/* PDF Preview — canvas based, no scroll */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-white">
                  <PdfThumbnail file={file} />
                </div>

                {/* PDF Preview — canvas based, no scroll */}
                {/* <div className="absolute inset-0 flex items-center justify-center overflow-hidden       rounded-2xl bg-white">
                  <PdfThumbnail file={file} />
                </div> */}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(i)}
                  className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white transition hover:bg-red-600"
                >
                  ×
                </button>
              </div>



              {/* File Name */}
              <p className="w-full truncate text-center text-xs text-slate-500">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Sidebar */}
      <div className="flex flex-col border-l border-slate-200 bg-white">

        <div className="flex-1 overflow-y-auto">
          {optionsSlot}
        </div>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleConvert}
            disabled={!flow.files.length}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
              ? "bg-[#f24d0d] shadow-[0_10px_30px_rgba(242,77,13,0.38)] hover:bg-[#dc4308]"
              : "cursor-not-allowed bg-slate-300"
              }`}
          >
            Compress PDF

            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );



  const handleDownloadAgain = async () => {
    if (!downloadUrl) return;
    const res = await fetch(downloadUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>

      {/* pdf.js CDN — thumbnail ke liye */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title="Compress PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={true}
        convertLabel="Compress PDF"

        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownloadAgain}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}

        sidebarIcon={<FileDown className="h-5 w-5 text-green-500" />}
        sidebarTitle="Compress PDF"
        sidebarDescription="Reduce PDF file size quickly while keeping quality."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        optionsTitle="Compression options"
        showOutputFormat={false}
        optionSectionLabel="Compression Level"
        showPreserveLayout={false}
        // optionsSlot={optionsSlot}
        optionsSlot={optionsSlot}
        customOptionsLayout={customOptionsLayout}

        processingTitle="Compressing your PDF"
        processingDescription="Please wait while we reduce your PDF file size."
        processingStages={["Uploading file", "Optimizing PDF", "Generating compressed PDF"]}

        doneTitle="Your compressed PDF is ready"
        doneDescription="Your PDF has been compressed successfully."
        doneFileName={outputFileName}
        downloadLabel="Download Compressed PDF"
        resetLabel="Compress another PDF"

        // ── compression stats for DoneStep ──
        compressionStats={compressionStats}

        // ============================================================
        // CompressPdf.jsx — uploadLanding prop (SEO-improved version)
        // Changes from audit:
        //   ✅ "pdf compressor" added as co-primary keyword in heroTitle
        //   ✅ "compress pdf to 100kb" added (high-volume missing long-tail)
        //   ✅ "shrink pdf" / "make pdf smaller" / "pdf size reducer" integrated
        //   ✅ Device-specific FAQs: iPhone, Android, Mac, Windows (separate)
        //   ✅ 256-bit SSL + GDPR mention added
        //   ✅ breadcrumbCurrent, howToEyebrow, rating, ratingText added
        //   ✅ "lossy vs lossless" + DPI context for topical authority
        //   ✅ "reduce pdf without adobe" competitor long-tail added
        //   ✅ seoSection titles rewritten for stronger long-tail targeting
        //   ✅ 4 new FAQs added
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "FREE PDF COMPRESSOR",

            breadcrumbCurrent: "Compress PDF",

            heroBadge: "✦ Free PDF Compressor — No Signup, No Watermark",

            heroTitle: (
              <>
                Free PDF Compressor —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Reduce PDF Size Online Instantly
                </em>
              </>
            ),

            heroDescription:
              "Compress PDF files online for free — no signup, no watermark, no software needed. Reduce PDF size to 100KB, 200KB, 500KB, or under 1MB for email, WhatsApp, government portals, visa applications, university submissions, and job portals. Preserves text quality and image clarity while dramatically shrinking file size. Works on Windows, Mac, Android, and iPhone — free online PDF compressor with no file size limit.",

            pills: [
              "Reduce PDF size",
              "Compress PDF to 100KB",
              "Compress PDF to 200KB",
              "Compress PDF for email",
              "Batch compression",
              "Works on mobile",
              "No file size limit",
              "No watermark",
            ],

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            uploadTitle: "Drop your PDF here to compress",
            uploadSubtitle: "or click to browse — all PDF types supported",

            noticeTitle: "PDF Compressor",
            noticeItems: [
              "Compress PDF without losing quality",
              "Batch PDFs supported",
              "No email or account required",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 100,000+ users monthly",

            howToEyebrow: "How It Works",
            howToTitle: "How to Compress a PDF File — 3 Simple Steps",
            howToSubtitle:
              "Upload your PDF, compress the file size automatically, and download the optimized PDF instantly — no account required.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Choose or drag & drop your PDF into the upload area. Supports large PDFs, scanned documents, and multi-page files. Works on desktop and mobile devices — no software installation needed.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Compress PDF",
                desc: "Start compression instantly. PDFLinx automatically reduces file size while preserving text sharpness and image quality — no settings to adjust.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Compressed PDF",
                desc: "Download your optimized PDF immediately — smaller size, faster sharing, no watermark, same professional quality.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why Use PDFLinx Free PDF Compressor?",

            whyPoints: [
              {
                title: "100% Free, Always",
                desc: "No subscription, no hidden fees. Compress unlimited PDFs at zero cost — forever free for everyone. No daily limits.",
              },
              {
                title: "Compress to Exact Size Targets",
                desc: "Need to hit 100KB, 200KB, 500KB, or under 1MB? PDFLinx reduces PDF size to meet strict upload limits for visa portals, government forms, and job applications.",
              },
              {
                title: "Compress Without Losing Quality",
                desc: "Smart compression engine reduces file size while keeping text sharp, images clear, and layout intact — perfect for professional and official documents.",
              },
              {
                title: "Works on All Devices",
                desc: "Compress PDF on iPhone, Android, Windows, or Mac — no app download needed. Everything runs in your browser — the fastest way to shrink a PDF on any device.",
              },
              {
                title: "Batch Compress Multiple PDFs",
                desc: "Upload and compress multiple PDF files at once. Save time with bulk compression — ideal for reports, invoices, scanned forms, and large document collections.",
              },
              {
                title: "Secure & Private — 256-bit SSL",
                desc: "Your files are transferred over 256-bit SSL encryption and permanently deleted from our servers after 1 hour. We never store, share, or access your documents.",
              },
              {
                title: "No Watermark, Ever",
                desc: "Unlike other tools, PDFLinx never stamps a watermark on your compressed PDF. What you upload is what you download — 100% clean and professional.",
              },
            ],

            faqTitle: "Compress PDF — Frequently Asked Questions",

            faqs: [
              {
                q: "Is the PDF compressor free to use?",
                a: "Yes. PDFLinx is a completely free PDF compressor with no hidden costs, no subscriptions, and no limits on how many PDF files you can compress. Compress unlimited PDFs for free.",
              },
              {
                q: "How do I compress a PDF to 100KB?",
                a: "Upload your PDF and click Compress. PDFLinx automatically optimizes the file. For very large or image-heavy documents, you may need to compress twice to reach 100KB. Re-upload the compressed output and compress again — this is the fastest way to reduce a PDF to 100KB or under without any software.",
              },
              {
                q: "How do I compress a PDF to under 200KB or 500KB?",
                a: "Upload your PDF and click Compress — most standard PDFs reduce to well under 200KB or 500KB in one step. For scanned or image-heavy PDFs, compress twice by re-uploading the output until you hit the required size limit.",
              },
              {
                q: "How do I compress a PDF to under 1MB?",
                a: "Upload your PDF and click Compress. PDFLinx automatically optimizes the file size. Most standard PDFs reduce to well under 1MB in seconds. For very large scanned documents, compress twice — re-upload the result and compress again.",
              },
              {
                q: "Can I compress a PDF for a government portal or visa application?",
                a: "Yes. PDFLinx can reduce PDF size to meet typical government portal and visa application limits — usually 100KB to 2MB. Upload your document, compress it, and check the output size. If you need a smaller size, simply re-upload and compress again until it meets the required limit.",
              },
              {
                q: "Will compressing a PDF affect its quality?",
                a: "PDFLinx is optimized to reduce file size while keeping text sharp, images clear, and layout fully readable. For most documents, quality remains visually identical after compression. Image-heavy or scanned PDFs may show minor differences at extreme zoom, but remain professional and printable.",
              },
              {
                q: "How do I compress a PDF on iPhone for free?",
                a: "Open PDFLinx in your iPhone browser (Safari or Chrome) — no app download needed. Tap the upload area, select your PDF from Files or Photos, tap Compress PDF, and download the compressed file directly to your iPhone. The fastest free PDF compressor for iOS.",
              },
              {
                q: "How do I compress a PDF on Android?",
                a: "Open PDFLinx in your Android browser (Chrome or Firefox). Tap the upload area, select your PDF, tap Compress PDF, and save the compressed file to your device. No app installation required — works directly in any Android browser.",
              },
              {
                q: "How do I compress a PDF on Mac for free?",
                a: "Open PDFLinx in Safari, Chrome, or Firefox on your Mac. Upload your PDF, click Compress, and download the smaller file. No software installation needed — works entirely in your browser. Free alternative to Adobe Acrobat's PDF optimizer on Mac.",
              },
              {
                q: "How do I compress a PDF on Windows 10 or Windows 11?",
                a: "Open PDFLinx in any browser on Windows — Chrome, Edge, or Firefox. Upload your PDF, click Compress PDF, and download the optimized file. No additional software or app needed. Works on Windows 10 and Windows 11.",
              },
              {
                q: "Does PDFLinx add a watermark to compressed PDFs?",
                a: "No. PDFLinx never adds watermarks. Your compressed PDF is 100% clean and professional — exactly as you uploaded it, just smaller in size.",
              },
              {
                q: "How much can the PDF file size be reduced?",
                a: "Compression results vary by content. Image-heavy or scanned PDFs often reduce by 60–80%. Text-only PDFs compress less but still meaningfully. A 10MB scanned document may compress to 2–3MB while remaining fully readable and printable.",
              },
              {
                q: "Can I compress a scanned PDF file?",
                a: "Yes. Scanned PDFs are image-based and are often the largest file types. PDFLinx is especially effective at compressing scanned PDFs — reducing file size significantly while keeping the scanned content readable and printable.",
              },
              {
                q: "Can I compress multiple PDF files at once?",
                a: "Yes. Batch compression is supported — upload multiple PDF files and compress them all in one session. Ideal for invoices, reports, scanned forms, or collections of documents.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. All files are transferred over 256-bit SSL encryption and automatically deleted from our servers after 1 hour. No account is needed, and we do not store, share, or access your documents at any point. PDFLinx is GDPR-aware and privacy-first.",
              },
              {
                q: "What is the difference between compressing and reducing PDF size?",
                a: "Compressing and reducing PDF size mean the same thing — making the file smaller. Some tools call it compression, others call it optimization, shrinking, or size reduction. PDFLinx does all of this in one step: it removes redundant data, optimizes embedded images, and shrinks the overall file size while preserving content quality.",
              },
              {
                q: "What is the difference between lossy and lossless PDF compression?",
                a: "Lossless compression removes redundant data (duplicate fonts, metadata) without any visible quality loss. Lossy compression additionally reduces image resolution and DPI, resulting in smaller files with minor visual differences. PDFLinx uses a balanced approach — primarily lossless techniques with smart image optimization — keeping your PDF visually clean while achieving significant size reduction.",
              },
              {
                q: "Why is my PDF file so large and how do I fix it?",
                a: "PDFs become large when they contain high-resolution scanned images, embedded fonts, unoptimized graphics, or high DPI settings. The easiest fix is to upload your PDF to PDFLinx and compress it — the tool automatically identifies and removes redundant data to reduce file size without affecting visible quality.",
              },
              {
                q: "Do I need to install any software to compress a PDF?",
                a: "No. Everything works directly in your browser — no downloads, no app installations, and no browser extensions required. PDFLinx PDF compressor is fully online and free.",
              },
              {
                q: "What happens if I upload a very large PDF?",
                a: "Large PDF files are supported. Processing time may vary depending on file size and content type, but most files complete in under a minute. For extremely large files, a stable internet connection is recommended during upload.",
              },
            ],

            seoBadge: "Compress PDF Guide",

            seoTitle:
              "Free PDF Compressor — Compress PDF Online, Reduce PDF Size Instantly | PDFLinx",

            seoDescription:
              "Free online PDF compressor — reduce PDF size to 100KB, 200KB, or 1MB instantly. Compress PDF for email, WhatsApp, visa forms, and government portals. No signup, no watermark. Works on Android, iPhone, Mac, and Windows.",

            seoSections: [
              {
                // Primary — co-targets "compress pdf", "pdf compressor", "reduce pdf size online"
                title:
                  "Free PDF Compressor — Compress PDF Online & Reduce PDF File Size Without Losing Quality",
                text: "Need to shrink a PDF? PDFLinx is a free online PDF compressor that reduces PDF file size instantly while preserving text clarity, image quality, and layout. Compress PDF to 100KB, 200KB, 500KB, or under 1MB — directly in your browser. No signup, no watermark, and no software installation required. A fast and reliable free alternative to Adobe Acrobat, Smallpdf, and iLovePDF — without cost, daily limits, or file size restrictions.",
              },
              {
                // Long-tail: "compress pdf to 100kb 200kb 500kb 1mb"
                title:
                  "Compress PDF to 100KB, 200KB, 500KB, or Under 1MB — Hit Any File Size Target",
                text: "Many government portals, visa applications, and job submission systems require PDFs under a strict size limit — typically 100KB to 2MB. PDFLinx lets you compress a PDF to meet any specific file size target. Upload your PDF, compress it, and check the output size. If the file is still too large, simply re-upload and compress again in seconds — no account needed. Most scanned and image-heavy PDFs reduce to 100KB–500KB within one or two compressions, making PDFLinx the go-to free PDF compressor for form submissions and official uploads.",
              },
              {
                // Long-tail: "when should you compress a pdf"
                title: "When Should You Compress a PDF File?",
                text: "Compressing a PDF is useful whenever a file is too large to share, upload, or send. Common situations include sending documents via email where attachments are limited to 10–25MB, sharing files over WhatsApp or Telegram where large files slow down mobile networks, submitting documents to government portals and visa applications with strict size limits of 100KB to 2MB, uploading resumes and CVs to job portals that cap file size, and submitting assignments or theses to university portals. Compressing a PDF solves all of these problems in seconds.",
              },
              {
                // Semantic: "how to compress pdf without losing quality"
                title: "How to Compress a PDF Without Losing Quality",
                text: "The biggest concern with PDF compression is whether the document will still look professional after size reduction. PDFLinx uses intelligent compression that targets redundant image data, duplicate embedded fonts, and unused metadata — the parts of a PDF that take up space but are invisible to the reader. Text sharpness is never degraded. Images are optimized at a balanced quality level that remains clear on screen and in print. For most documents — resumes, reports, forms, and presentations — the compressed output is visually identical to the original. For scanned PDFs, PDFLinx smartly adjusts image DPI to reduce size while maintaining readability.",
              },
              {
                // Semantic: "compress vs reduce vs optimize vs shrink pdf"
                title:
                  "Compress PDF vs Reduce PDF Size vs Shrink PDF vs Optimize PDF — All the Same?",
                text: "Yes — compress PDF, reduce PDF size, shrink PDF, make PDF smaller, and optimize PDF all describe the same process: making a PDF file smaller without changing its visible content. Different platforms use different words for the same action. Adobe Acrobat calls it 'Optimize PDF', Smallpdf calls it 'Compress PDF', and some tools say 'Reduce file size' or 'Shrink PDF'. PDFLinx handles all of this in one step — removing redundant data, optimizing embedded images, and reducing overall file size while keeping the document fully readable and professional.",
              },
              {
                // Long-tail: "compress pdf for email whatsapp portals"
                title:
                  "Reduce PDF File Size for Email, WhatsApp, Telegram, and Online Portals",
                text: "Most email providers limit attachments to 10–25MB. Compress your PDF below the limit and send it instantly via Gmail, Outlook, or Yahoo Mail. Compressed PDFs also load faster on mobile networks — ideal for WhatsApp and Telegram sharing where large files delay delivery. For online portals requiring PDFs under 500KB, 200KB, or 100KB, PDFLinx reduces your file to meet the exact size requirement without reprinting, rescanning, or any software.",
              },
              {
                // Long-tail: "compress pdf for government portals visa applications"
                title:
                  "Compress PDF for Government Portals, Visa Applications, and University Submissions",
                text: "Government websites, visa portals, and university submission systems often enforce strict PDF size limits — typically between 100KB and 2MB. PDFLinx compresses your documents to meet these exact requirements. Whether you are submitting a visa application, a national ID document, a university thesis, or a job application form, PDFLinx reduces the PDF to the required size while keeping content fully clear, readable, and printable.",
              },
              {
                // Semantic: lossy vs lossless + DPI — topical authority signal
                title:
                  "How PDF Compression Works — Lossless, Lossy, and Image DPI Optimization",
                text: "PDF compression uses two main techniques. Lossless compression removes redundant internal data — duplicate fonts, empty metadata, and unused objects — without any visible quality change. Lossy compression additionally reduces image resolution and DPI (dots per inch), resulting in smaller files with minor visual differences only visible at extreme zoom levels. PDFLinx uses a balanced approach: lossless data cleanup first, followed by smart image optimization at a quality level that keeps your PDF professional for both screen viewing and printing. Scanned documents benefit most — high-DPI scan images are the largest contributors to PDF file size.",
              },
              {
                // Trust + privacy — 256-bit SSL + GDPR
                title: "Privacy and File Security — 256-bit SSL Encryption",
                text: "Your uploaded PDF files are transferred over 256-bit SSL encryption and processed on secure servers. Files are automatically deleted after 1 hour — we do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles and is GDPR-aware. No account or email is required to use the free PDF compressor. Your files stay completely private from upload to download.",
              },
            ],

            relatedTitle: "More Free PDF Tools",
            showPdfTypes: false,
          },
        }}

        
      />

      {/* <RelatedToolsSection currentPage="compress-pdf" /> */}
    </>
  );
}
