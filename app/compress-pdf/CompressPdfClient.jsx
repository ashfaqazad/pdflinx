"use client";

// import { useState } from "react";
import { FileDown } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";

import Script from "next/script";
import {
  FileText,
  GitMerge,
  Scissors,
  Table,
  Minimize2,
  Download,
  CheckCircle,
  Lock
} from "lucide-react";

import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },

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
      const res = await fetch("/convert/compress-pdf", {
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

        uploadLanding={{
          content: {
            heroBadge: "✦ Free PDF Compressor — No Signup, No Watermark",

            heroTitle: (
              <>
                Compress PDF Files Online{" "} <br />
                <em className="text-[#e8420a]">for Free</em>
              </>
            ),

            heroDescription:
              "Compress PDF files online for free — no signup, no watermark, no software needed. Reduce PDF size for email attachments, WhatsApp sharing, government portals, visa applications, university submissions, and job applications. Our free online PDF compressor preserves text quality and image clarity while dramatically reducing file size. Works on Windows, Mac, Android, and iPhone. Compress PDF to 200KB, 500KB, or 1MB instantly in your browser.",

            pills: [
              "Reduce PDF size",
              "Compress PDF to 200KB",
              "Compress PDF for email",
              "Batch compression",
              "Works on mobile",
              "No file size limit",
            ],

            noticeItems: [
              "Compress PDF without losing quality",
              "Batch PDFs supported",
              "No email or account required",
            ],

            seoBadge: "Compress PDF Guide",

            seoTitle: "Free Online PDF Compressor — Reduce PDF Size Instantly | PDFLinx",

            seoDescription:
              "Compress PDF files online for free. Reduce PDF size for email, WhatsApp, visa forms, and university portals. No signup, no watermark. Works on Android, iPhone, and desktop.",

            howToTitle: "How to Compress a PDF — 3 Simple Steps",

            howToSubtitle:
              "Upload your PDF, compress the file size automatically, and download the optimized PDF instantly — no account required.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF",
                desc: "Choose or drag & drop your PDF file into the upload area. Supports large PDFs. Works on desktop and mobile devices.",
              },
              {
                n: "2",
                title: "Click Compress PDF",
                desc: "Start compression instantly. PDFLinx automatically reduces file size while preserving text sharpness and image quality.",
              },
              {
                n: "3",
                title: "Download Compressed PDF",
                desc: "Download your optimized PDF immediately — smaller size, faster sharing, no watermark, same professional quality.",
              },
            ],

            whyTitle: "Why Use PDFLinx PDF Compressor?",

            whyPoints: [
              {
                title: "100% Free, Always",
                desc: "No subscription, no hidden fees. Compress unlimited PDFs at zero cost — forever free for everyone.",
              },
              {
                title: "Compress Without Losing Quality",
                desc: "Smart compression engine reduces file size while keeping text sharp, images clear, and layout intact — perfect for professional documents.",
              },
              {
                title: "Works on All Devices",
                desc: "Compress PDF on iPhone, Android, Windows, or Mac — no app download needed. Everything runs in your browser.",
              },
              {
                title: "Batch Compress Multiple PDFs",
                desc: "Upload and compress multiple PDF files at once. Save time with bulk compression — ideal for reports, invoices, and scanned documents.",
              },
              {
                title: "Secure & Private",
                desc: "Your files are encrypted during processing and permanently deleted from our servers after download. We never store your documents.",
              },
              {
                title: "No Watermark Ever",
                desc: "Unlike other tools, PDFLinx never stamps a watermark on your compressed PDF. What you upload is what you download — clean.",
              },
              {
                title: "Fast Compression, Instant Download",
                desc: "Compress large PDF files in seconds. No waiting, no queue — results are ready for download immediately after processing.",
              },
            ],

            faqTitle: "Compress PDF FAQs",

            faqs: [
              {
                q: "Is the PDF compressor free to use?",
                a: "Yes. PDFLinx Compress PDF is completely free with no hidden costs or subscriptions.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly inside your browser — no downloads or installations required.",
              },
              {
                q: "Will compressing affect the quality of my PDF?",
                a: "PDFLinx is optimized to reduce file size while keeping text, images, and layout clear and readable.",
              },
              {
                q: "How do I compress a PDF to under 1MB?",
                a: "Upload your PDF and click compress. PDFLinx automatically optimizes the file. Most PDFs reduce below 1MB in seconds depending on content type.",
              },
              {
                q: "Can I compress a PDF for a government portal or visa application?",
                a: "Yes. PDFLinx can reduce PDF size to meet typical government portal limits (200KB–2MB). You can recompress if a very specific size is required.",
              },
              {
                q: "Does PDFLinx add a watermark to compressed PDFs?",
                a: "No. PDFLinx never adds watermarks. Your compressed PDF is clean and professional — exactly as you uploaded it.",
              },
              {
                q: "How much can the PDF file size be reduced?",
                a: "Compression results vary by content type. Image-heavy or scanned PDFs often reduce by 60–80%. Text-only PDFs compress less but still meaningfully.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. All files are transferred over HTTPS and automatically deleted from our servers after processing. No account is needed.",
              },
              {
                q: "Can I compress multiple PDF files at once?",
                a: "Yes. Batch compression is supported — upload multiple files and compress them all in one go.",
              },
              {
                q: "What happens if I upload a very large PDF?",
                a: "Large PDF files are supported. Processing time may vary depending on file size, but most files complete in under a minute.",
              },
              {
                q: "Can I compress a PDF on my phone?",
                a: "Yes. PDFLinx works on Android, iPhone, tablets, and all desktop browsers — no app installation needed.",
              },
            ],

            relatedTitle: "More PDF Tools",

            seoSections: [
              {
                title: "Reduce PDF File Size for Email & WhatsApp",
                text: "Most email providers limit attachments to 10–25MB. Compress your PDF below the limit and send it instantly via Gmail, Outlook, or Yahoo Mail. Compressed PDFs also load faster on mobile networks for WhatsApp sharing.",
              },
              {
                title: "Compress PDF for Government Portals & Visa Applications",
                text: "Government websites and visa portals often limit PDF uploads to 500KB or 1MB. Use PDFLinx to compress documents to meet exact size requirements without reprinting or rescanning.",
              },
              {
                title: "Preserve Image & Text Quality After Compression",
                text: "PDFLinx uses intelligent compression that reduces redundant data without degrading visible quality. Scanned documents, forms, and image-heavy PDFs remain fully readable and printable.",
              },
              {
                title: "Safe, Encrypted PDF Compression Online",
                text: "All files are transferred over HTTPS and automatically purged from our servers after processing. No account needed — your sensitive documents stay completely private.",
              },
            ],

            showPdfTypes: false,
          },
        }}
      />

      {/* <RelatedToolsSection currentPage="compress-pdf" /> */}
    </>
  );
}
