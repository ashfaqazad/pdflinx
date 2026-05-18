"use client";

import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useState, useRef, useEffect } from "react";



import {
  FileText,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Download,
  Minimize2,
  GitMerge,
  Scissors,
  Lock,
  Search,
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-pink-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Search className="h-4 w-4 text-violet-500" /> },
];

const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-orange-800">
      ℹ️ Rotation Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>All pages rotated by same angle</li>
      <li>Single PDF → rotated PDF directly</li>
      <li>Multiple PDFs → ZIP download</li>
      <li>Lossless — zero quality loss</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after processing",
  "✓ 100% free",
  "✓ Batch rotation",
  "✓ Lossless quality",
];

// ── Rotation Selector — goes into optionsSlot ──────────────────────────────
function RotationSelector({ angle, onChange }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-800">🔄 About rotation</p>
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li>✓ All pages rotated by the same angle</li>
          <li>✓ Lossless — text, images & layout unchanged</li>
          <li>✓ Perfect for scanned docs & mobile photos</li>
          <li>✓ Single PDF → rotated PDF directly</li>
          <li>✓ Multiple PDFs → ZIP download</li>
        </ul>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-700">Select rotation angle</p>
        <p className="text-xs text-slate-400">All pages in each PDF will be rotated by the same angle</p>
        <div className="grid grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => onChange(90)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${angle === 90
              ? "border-orange-600 bg-orange-50 shadow-md"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50"
              }`}
          >
            <RotateCw className="w-7 h-7 text-orange-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">90° Right</span>
            <span className="text-xs text-slate-400 mt-0.5">Clockwise</span>
          </button>

          <button
            type="button"
            onClick={() => onChange(180)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${angle === 180
              ? "border-orange-600 bg-orange-50 shadow-md"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50"
              }`}
          >
            <RefreshCw className="w-7 h-7 text-orange-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">180°</span>
            <span className="text-xs text-slate-400 mt-0.5">Flip</span>
          </button>

          <button
            type="button"
            onClick={() => onChange(270)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${angle === 270
              ? "border-orange-600 bg-orange-50 shadow-md"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50"
              }`}
          >
            <RotateCcw className="w-7 h-7 text-orange-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">270° Left</span>
            <span className="text-xs text-slate-400 mt-0.5">Counter-CW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

// import { useRef, useEffect } from "react";

function PdfThumbnail({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!url || !window.pdfjsLib) return;
    let cancelled = false;
    const tryRender = () => {
      if (!window.pdfjsLib) return setTimeout(tryRender, 100);
      window.pdfjsLib.getDocument(url).promise
        .then((pdf) => pdf.getPage(1))
        .then((page) => {
          const viewport = page.getViewport({ scale: 0.6 });
          const canvas = canvasRef.current;
          if (!canvas || cancelled) return;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          page.render({ canvasContext: canvas.getContext("2d"), viewport });
        })
        .catch(console.error);
    };
    tryRender();
    return () => { cancelled = true; };
  }, [url]);

  return <canvas ref={canvasRef} className="h-full w-full object-contain bg-white" />;
}


export default function RotatePdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [rotationAngle, setRotationAngle] = useState(90);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("rotated.pdf");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const getDownloadName = (contentType = "") => {
    if (flow.files.length === 1) {
      return flow.files[0]?.name
        ? flow.files[0].name.replace(/\.pdf$/i, "-rotated.pdf")
        : "rotated.pdf";
    }
    return "pdflinx-rotated-pdfs.zip";
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── API LOGIC ──────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length)
      return alert("Please select at least one PDF file!");

    flow.startProcessing();
    startProgress();
    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("angle", String(rotationAngle));

    try {
      const res = await fetch("/convert/rotate-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Rotation failed";
        try { const j = await res.json(); msg = j?.error || msg; } catch { }
        throw new Error(msg);
      }

      const contentType = res.headers.get("content-type") || "";
      const filename = getDownloadName(contentType);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(filename);

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError(err.message || "Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ──────────────────────────────────────────────────────

  const angleLabel =
    rotationAngle === 90 ? "90° Clockwise" :
      rotationAngle === 180 ? "180° Flip" :
        "270° Counter-Clockwise";

  return (
    <>

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
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Rotate PDF Pages Online for Free",
            description: "Rotate PDF pages clockwise or counterclockwise by 90°, 180°, or 270°. Fix orientation of scanned documents, photos, and PDFs.",
            url: "https://pdflinx.com/rotate-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF file(s)", text: "Upload a single PDF or select multiple PDFs at the same time." },
              { "@type": "HowToStep", name: "Choose rotation angle", text: "Select 90°, 180°, or 270° rotation angle." },
              { "@type": "HowToStep", name: "Rotate and download", text: "Click Rotate PDF. Download the rotated PDF (or ZIP if multiple files)." },
            ],
            totalTime: "PT15S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Rotate PDF", item: "https://pdflinx.com/rotate-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What does Rotate PDF mean?", acceptedAnswer: { "@type": "Answer", text: "Rotate PDF means changing the orientation of PDF pages by turning them clockwise or counterclockwise. Common rotation angles are 90°, 180°, and 270°." } },
              { "@type": "Question", name: "Can I rotate all pages at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. When you upload a PDF and select a rotation angle, all pages in that PDF will be rotated by the same angle." } },
              { "@type": "Question", name: "Can I rotate multiple PDFs at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. Upload up to 10 PDFs. Each PDF's pages will be rotated by your chosen angle. Multiple files download as a ZIP." } },
              { "@type": "Question", name: "Will rotating a PDF reduce quality?", acceptedAnswer: { "@type": "Answer", text: "No. Rotating a PDF is a lossless operation. Your text, images, and layout remain exactly the same quality." } },
              { "@type": "Question", name: "Are my files safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed automatically and deleted after processing. No sign-up required." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Rotate PDF Online Free"}
        tagline="No Signup · No Watermark · Lossless Quality"
        accept="application/pdf,.pdf"
        multiple={true}
        convertLabel="Rotate PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}

        optionsTitle="Rotation options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        // optionsSlot={
        //   <RotationSelector angle={rotationAngle} onChange={setRotationAngle} />
        // }

        optionsSlot={
          <RotationSelector angle={rotationAngle} onChange={setRotationAngle} />
        }

        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] min-h-[calc(100vh-80px)]">

            {/* LEFT — File Thumbnails */}
            <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">

              {/* Add more button */}
              <div className="absolute right-4 top-4">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-green-500 bg-white px-3 py-1.5 text-sm font-medium text-green-600 shadow-sm transition hover:bg-green-50">
                  <span className="text-base leading-none">+</span>
                  <span>Add more</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      if (newFiles.length) flow.selectFiles([...flow.files, ...newFiles]);
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
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                      <PdfThumbnail url={URL.createObjectURL(file)} />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white transition hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <p className="w-full truncate text-center text-xs text-slate-500">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <div className="flex flex-col border-l border-slate-200 bg-white">

              {/* Rotation options */}
              <div className="flex-1 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Rotation</h3>

                {/* RIGHT button */}
                <button
                  type="button"
                  onClick={() => setRotationAngle(90)}
                  className={`mb-3 flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${rotationAngle === 90
                    ? "border-[#f24d0d] bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d]">
                    <RotateCw className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-slate-800">RIGHT</span>
                </button>

                {/* LEFT button */}
                <button
                  type="button"
                  onClick={() => setRotationAngle(270)}
                  className={`mb-3 flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${rotationAngle === 270
                    ? "border-[#f24d0d] bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d]">
                    <RotateCcw className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-slate-800">LEFT</span>
                </button>

                {/* 180° button */}
                <button
                  type="button"
                  onClick={() => setRotationAngle(180)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${rotationAngle === 180
                    ? "border-[#f24d0d] bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d]">
                    <RefreshCw className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-slate-800">180° FLIP</span>
                </button>
              </div>

              {/* Rotate PDF button */}
              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!flow.files.length}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
                    ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  <RotateCw className="h-5 w-5" />
                  Rotate PDF
                </button>
              </div>
            </div>
          </div>
        }

        processingTitle="Rotating Your PDF"
        processingDescription="Applying rotation to all pages — lossless, no quality loss."
        processingStages={["Uploading file", "Applying rotation", "Saving PDF"]}

        doneTitle="Your rotated PDF is ready"
        doneDescription={
          flow.files.length > 1
            ? "All PDFs rotated successfully. ZIP contains all rotated files."
            : `All pages rotated ${angleLabel}. File downloaded automatically.`
        }
        doneFileName={downloadName}
        downloadLabel="Download Rotated PDF"
        resetLabel="Rotate another PDF"

        sidebarTitle="Rotate PDF"
        sidebarIcon={<RotateCw className="h-5 w-5 text-orange-500" />}
        sidebarDescription="Fix PDF orientation in seconds — rotate by 90°, 180°, or 270°, lossless and free."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        uploadLanding={{
          content: {
            eyebrow: "ROTATE PDF ONLINE",

            heroTitle: (
              <>
                Rotate PDF Pages <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  Fix Orientation Instantly 🔄
                </span>
              </>
            ),

            heroDescription:
              "Fix sideways or upside-down PDFs in seconds — rotate all pages by 90°, 180°, or 270°. Lossless quality, no watermark, no signup. Works for single files and batch uploads.",

            bullets: [
              "Rotate by 90°, 180°, or 270° — all pages at once",
              "Lossless operation — text, images & layout stay identical",
              "Batch rotate multiple PDFs at once",
            ],

            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            privacyTitle: "Your files stay private",
            privacyText: "Files are processed securely and automatically deleted after rotation. Never stored or shared.",

            noticeTitle: "Rotation Output",
            noticeItems: [
              "Single PDF → rotated PDF directly",
              "Multiple PDFs → ZIP with all files",
              "All pages rotated by same angle",
            ],

            breadcrumbItems: [
              { label: "Home", href: "/" },
              { label: "PDF Tools", href: "/pdf-tools" },
              { label: "Rotate PDF" },
            ],

            trustPills: ["100% Free", "No Sign Up", "Lossless"],

            supports: [
              "Supports PDF files",
              "Auto-deleted after processing",
            ],

            howToTitle: "How to Rotate PDF Pages",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File(s)",
                desc: "Upload one PDF or multiple PDFs at once for batch rotation. Drag and drop supported on all devices.",
                color: "bg-orange-600",
              },
              {
                n: "2",
                title: "Choose Rotation Angle",
                desc: "Select 90° clockwise, 180° flip, or 270° counter-clockwise. All pages in each PDF will be rotated by the same angle.",
                color: "bg-red-600",
              },
              {
                n: "3",
                title: "Download Rotated PDF",
                desc: "Single PDF downloads as a rotated PDF directly. Multiple PDFs download as a ZIP with all rotated files.",
                color: "bg-purple-600",
              },
            ],

            visualImage: "/images/rotate-pdf-visual.png",
            visualAlt: "Rotate PDF illustration",

            whyTitle: "Why Choose PDFLinx Rotate PDF?",

            whyItems: [
              {
                title: "Quick Rotation",
                desc: "Rotate PDF pages by 90°, 180°, or 270° in seconds — perfect for fixing scanned documents and mobile photos taken at the wrong angle.",
                icon: RotateCw,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Lossless Quality",
                desc: "Rotating a PDF is a lossless operation — your text, images, and layout remain exactly the same quality. Nothing is re-compressed or degraded.",
                icon: RefreshCw,
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
              },
              {
                title: "Batch Rotation",
                desc: "Upload up to 10 PDFs at once — each processed separately and delivered as a ZIP download with all rotated files.",
                icon: Download,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
              },
              {
                title: "Works on Any Device",
                desc: "Rotate PDFs on iPhone, Android, Windows, or Mac — no software installation needed. Fully browser-based.",
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
              },
            ],

            relatedTitle: "You Might Also Need",

            relatedTools: [
              { label: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs", icon: GitMerge, iconColor: "text-purple-500", bgColor: "bg-purple-50" },
              { label: "Split PDF", href: "/split-pdf", desc: "Extract specific pages", icon: Scissors, iconColor: "text-pink-500", bgColor: "bg-pink-50" },
              { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce PDF file size", icon: Minimize2, iconColor: "text-green-500", bgColor: "bg-green-50" },
              { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX", icon: FileText, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
              { label: "Protect PDF", href: "/protect-pdf", desc: "Add password to PDF", icon: Lock, iconColor: "text-red-500", bgColor: "bg-red-50" },
              { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs searchable", icon: Search, iconColor: "text-violet-500", bgColor: "bg-violet-50" },
            ],

            faqTitle: "Frequently Asked Questions",

            faqs: [
              { q: "Is the Rotate PDF tool free?", a: "Yes. PDFLinx Rotate PDF is completely free — no sign-up, no watermark, no hidden charges." },
              { q: "What rotation angles are available?", a: "You can rotate by 90° clockwise (right), 180° (flip upside down), or 270° counter-clockwise (left)." },
              { q: "Can I rotate multiple PDFs at once?", a: "Yes. Upload up to 10 PDFs. Each PDF's pages will be rotated by your chosen angle. Multiple files download as a ZIP." },
              { q: "Will rotating a PDF reduce quality?", a: "No. Rotating a PDF is a lossless operation. Your text, images, and layout remain exactly the same quality." },
              { q: "Can I rotate individual pages or all pages?", a: "Currently, all pages in each PDF are rotated by the same angle. This is perfect for fixing scanned documents or mobile photos." },
              { q: "Are my files safe and private?", a: "Yes. Files are processed automatically and deleted shortly after processing. We never store your files permanently." },
              { q: "Can I use this on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required." },
              { q: "What if only some pages need rotation?", a: "Currently the tool rotates all pages by the same angle. For page-specific rotation, use the Split PDF tool to separate pages first, rotate individually, then Merge PDF to recombine." },
            ],

            ctaBadge: "✦ 100% Free",
            ctaTitle: "Fix Your PDF Orientation Now",
            ctaDescription: "Fast. Lossless. Private. No sign up required.",
            ctaSubtext: "No limits. No hidden charges.",
            ctaButton: "Choose PDF File",

            seoSections: [
              {
                title: "Free Rotate PDF Tool — Fix Orientation Online in Seconds",
                text: "Rotating PDF pages is essential when documents are scanned or photographed in the wrong orientation. PDFLinx Rotate PDF fixes the orientation instantly — rotate by 90°, 180°, or 270°, lossless quality, no watermark, no sign-up required.",
              },
              {
                title: "What Rotation Angles Are Available?",
                text: "Three rotation angles are supported: 90° clockwise (right turn), 180° flip (upside down), and 270° counter-clockwise (left turn). All pages in each PDF are rotated by the same selected angle.",
              },
              {
                title: "Common Use Cases for PDF Rotation",
                text: "Scanned documents placed sideways in the scanner. Phone photos converted to PDF in wrong orientation. Multi-page documents with some pages rotated incorrectly. Forms and applications that need to be right-side up. Receipts and invoices photographed at the wrong angle.",
              },
              {
                title: "Privacy and File Security",
                text: "Uploaded PDF files are processed securely and automatically deleted after rotation — never stored long-term, never shared with third parties. No account creation required. Your documents remain completely private.",
              },
            ],

            showPdfTypes: false,
          },
        }}
      />
    </>
  );
}
