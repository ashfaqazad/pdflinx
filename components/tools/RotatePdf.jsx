"use client";

import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useState, useRef, useEffect } from "react";



import {
  RotateCw,
  RotateCcw,
  RefreshCw,
  Minimize2,
  GitMerge,
  Scissors,
  LayoutList, Trash2,
  Pencil, Hash, Crop,
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-pink-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
//   { label: "OCR PDF", href: "/ocr-pdf", icon: <Search className="h-4 w-4 text-violet-500" /> },
// ];

const DONE_LINKS = [
  { label: "Organize PDF", href: "/organize-pdf", icon: <LayoutList className="h-4 w-4 text-blue-500" /> },
  { label: "Remove Pages", href: "/remove-pages", icon: <Trash2 className="h-4 w-4 text-red-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash className="h-4 w-4 text-slate-500" /> },
  { label: "Crop PDF", href: "/crop-pdf", icon: <Crop className="h-4 w-4 text-lime-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
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
        id="howto-schema-rotate-pdf"
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
        id="breadcrumb-schema-rotate-pdf"
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
        id="faq-schema-rotate-pdf"
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

      <Script
        id="software-schema-rotate-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Rotate PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/rotate-pdf",
            description:
              "Free online PDF rotation tool. Rotate PDF pages clockwise or counterclockwise and save the updated document. Fix scanned pages, landscape documents, and incorrectly oriented PDFs quickly and easily.",
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
              "Rotate PDF pages",
              "Rotate pages 90, 180, or 270 degrees",
              "Fix page orientation",
              "Rotate individual or all pages",
              "Support for scanned PDF documents",
              "Fast online PDF rotation",
              "Works in any web browser",
              "No software installation required"
            ]
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
        sidebarLinks={DONE_LINKS}

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

        // ============================================================
        // ROTATE PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "ROTATE PDF",

            breadcrumbCurrent: "Rotate PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Rotate PDF Pages —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Permanently Fixed
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Rotate PDF pages online for free. Fix sideways or upside-down pages permanently — rotate all pages or individual ones in any direction. No signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "Rotate all or individual pages",
            //   "Permanent rotation saved",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Rotate PDF Pages —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Free, Permanent Rotation
                </em>
              </>
            ),
            heroDescription:
              "Rotate PDF pages online free — turn one, several, or all pages by 90°, 180°, or 270°. Changes saved permanently in the PDF file. Free, instant, no signup needed.",
            pills: ["Rotate all or specific pages", "90°, 180°, 270° options", "Permanently saved", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Rotate PDF Info",
            noticeItems: [
              "Rotate all pages or specific pages",
              "90°, 180°, 270° rotation supported",
              "Rotation saved permanently in PDF",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Rotate a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, rotate pages, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. All pages load as visual thumbnails so you can see exactly what needs fixing.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Select Pages & Rotate",
                desc: "Rotate all pages at once with one click, or select individual page thumbnails and rotate them independently. Choose 90° clockwise, 90° counterclockwise, or 180° flip for each page.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Fixed PDF",
                desc: "Click Save and your corrected PDF is ready in seconds. Rotation is permanently saved — every page displays in the correct orientation in any PDF viewer, on any device.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Rotation Tool Online",

            seoBadge: "Rotate PDF Guide",
            seoTitle: "Complete Guide to Rotating PDF Pages Online",
            seoDescription:
              "Everything you need to know about rotating PDF pages — free, online, permanent fix. Rotate all pages or individual pages in any direction. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Rotator — Fix Sideways and Upside-Down PDF Pages Online",
                text: "Need to rotate a PDF? PDFLinx lets you rotate PDF pages online for free — instantly and without any software installation. Whether your entire document is sideways from a wrong scan orientation, a few pages are upside down in a merged PDF, or you need to flip a landscape page to portrait, PDFLinx fixes it permanently in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "Why PDF Pages End Up in the Wrong Orientation",
                text: "Incorrect page orientation is one of the most common PDF problems and it happens for several reasons. Scanning a physical document with pages placed sideways in the feeder is the most frequent cause. Merging PDFs from different sources that use different page orientations also results in mixed-direction pages. Some PDF export tools default to landscape when the content was intended as portrait. Mobile phone scans using certain apps can also produce rotated pages depending on how the phone was held. Whatever the cause, PDFLinx corrects the orientation permanently with just a few clicks.",
              },
              {
                title: "Rotate All Pages vs Rotate Individual Pages",
                text: "PDFLinx gives you full control over which pages get rotated. If your entire PDF is in the wrong orientation — for example a portrait document scanned in landscape — you can rotate all pages at once with a single click. If only some pages are sideways in an otherwise correctly oriented document, you can select those specific pages and rotate only them independently. You can even apply different rotations to different pages in the same session — for example rotating pages 3 and 7 clockwise while rotating page 12 counterclockwise.",
              },
              {
                title: "Is the Rotation Permanent or Temporary?",
                text: "The rotation is permanent. This is a critical distinction — some PDF viewers let you rotate a page for viewing only, but the rotation resets when you close and reopen the file. PDFLinx writes the rotation directly into the PDF file structure, so every page displays in the correct orientation in any PDF viewer on any device, always. You never have to rotate it again after downloading the fixed file.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Rotator — No Watermark, No Limits",
                text: "Most free PDF rotation tools add watermarks to the output, restrict the number of pages, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily usage limit. Unlike iLovePDF and Smallpdf which restrict batch page editing on free tiers, PDFLinx gives you full access to rotate as many pages as you need at zero cost.",
              },
              {
                title: "Common Use Cases for Rotating PDF Pages",
                text: "✓ Fix scanned documents where pages were fed into the scanner sideways or upside down.\n✓ Correct orientation in merged PDFs that combined files with different page directions.\n✓ Rotate a landscape-exported PDF back to portrait for standard document viewing.\n✓ Fix mobile phone scans that came out sideways depending on how the phone was held.\n✓ Rotate specific pages in a report that contain wide tables or charts in landscape within a portrait document.\n✓ Correct orientation in PDF forms received from clients or institutions before filling or forwarding.",
              },
              {
                title:
                  "Rotate PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app — the rotation tool works perfectly on touchscreens. On Mac or Windows, drag and drop your PDF and download the corrected file in seconds. PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title: "Rotate PDF vs Organize PDF — What is the Difference?",
                text: "The Rotate PDF tool is focused specifically on fixing page orientation — it is the fastest way to rotate all pages or specific pages in a PDF. The Organize PDF tool is a broader tool that also lets you rotate pages, but additionally allows you to reorder and delete pages in the same session. If rotation is all you need, use Rotate PDF for a simpler, faster experience. If you also need to reorder or delete pages at the same time, use our free Organize PDF tool.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF rotation tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of pages you rotate or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and rotate pages instantly — no email, no registration, no friction.",
              },
              {
                q: "Can I rotate all pages at once?",
                a: "Yes. Click Rotate All to apply the same rotation direction to every page in the PDF in one step — ideal when the entire document is in the wrong orientation.",
              },
              {
                q: "Can I rotate individual pages independently?",
                a: "Yes. Select specific page thumbnails and rotate only those pages — you can apply different rotations to different pages in the same session.",
              },
              {
                q: "What rotation directions are supported?",
                a: "PDFLinx supports 90° clockwise, 90° counterclockwise, and 180° (upside down flip) rotation for any page.",
              },
              {
                q: "Is the rotation permanent in the downloaded PDF?",
                a: "Yes. Rotation is written permanently into the PDF file — every page displays correctly in any PDF viewer on any device. It does not reset when you reopen the file.",
              },
              {
                q: "Will content quality be affected by rotation?",
                a: "No. Rotation only changes the orientation of the page — all content, text, images, formatting, and quality remain exactly as in the original.",
              },
              {
                q: "Does PDFLinx add any watermark to the rotated PDF?",
                a: "No watermarks, ever. Your rotated PDF is 100% clean and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — the rotation tool works on touchscreens too. No app download needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting first using our free PDF Split tool, rotate each part, then merge them back.",
              },
              {
                q: "Can I rotate a password-protected PDF?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then rotate the pages.",
              },
              {
                q: "What is the difference between Rotate PDF and Organize PDF?",
                a: "Rotate PDF is a focused tool for fixing page orientation only — fast and simple. Organize PDF is a broader tool that lets you rotate, reorder, and delete pages all in one session. Use Rotate PDF when orientation is all you need to fix.",
              },
              {
                q: "How long does rotating a PDF take?",
                a: "Most operations complete within 5 to 10 seconds depending on file size and number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for rotating PDFs?",
                a: "Yes — PDFLinx offers unlimited free rotation with permanent fixes, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict page editing tools behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Rotate your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, permanent PDF page rotation every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />
    </>
  );
}
