"use client";

import { useState, useRef, useEffect } from "react";
import {
  Ratio,
  FileImage,
  Sparkles,
  Layers3,
  ShieldCheck, X,
  Presentation, FileText, FileSpreadsheet,
  Image as ImageIcon, Minimize2, GitMerge, Stamp, Pencil
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";




const DONE_LINKS = [
  // { label: "PPT to PDF",     href: "/ppt-to-pdf",     icon: <Presentation    className="h-4 w-4 text-orange-500"  /> },
  { label: "PPT to PDF", href: "/ppt-to-pdf", icon: <FileImage className="h-4 w-4 text-orange-500" /> },
  { label: "PDF to Word",    href: "/pdf-to-word",    icon: <FileText        className="h-4 w-4 text-blue-500"    /> },
  { label: "PDF to Excel",   href: "/pdf-to-excel",   icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  { label: "Image to PDF",   href: "/image-to-pdf",   icon: <ImageIcon       className="h-4 w-4 text-pink-500"    /> },
  { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2       className="h-4 w-4 text-green-500"   /> },
  { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge        className="h-4 w-4 text-purple-500"  /> },
  { label: "Add Watermark",  href: "/add-watermark",  icon: <Stamp           className="h-4 w-4 text-teal-500"    /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
];



/* =============================================
   PDF PAGE THUMBNAIL
============================================= */
function PdfPageThumbnail({ file, pageNumber = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file || !window.pdfjsLib) return;
    let cancelled = false;

    const render = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 0.7 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      } catch (err) {
        console.error("Thumbnail render error:", err);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [file, pageNumber]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      className="object-contain bg-white"
    />
  );
}

/* =============================================
   PDF CARD
============================================= */
function PdfCard({ file, totalPages, onRemove }) {
  return (
    <div className="group relative flex flex-col items-center gap-2">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
      >
        <X className="h-3 w-3" />
      </button>

      <div
        className="relative flex w-[160px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-md hover:border-slate-300 hover:shadow-lg transition-all"
        style={{ aspectRatio: "3/4" }}
      >
        {totalPages > 0 && (
          <div className="absolute top-2 right-2 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f24d0d] px-1.5 text-[10px] font-bold text-white shadow">
            {totalPages}
          </div>
        )}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f24d0d] rounded-l-xl" />
        <div className="absolute inset-0 flex items-center justify-center p-2 pl-3">
          <PdfPageThumbnail file={file} pageNumber={1} />
        </div>
      </div>

      <p className="w-[160px] text-center text-[11px] font-medium text-slate-500 leading-tight truncate px-1">
        {file.name}
      </p>
    </div>
  );
}

/* =============================================
   MAIN COMPONENT
============================================= */
export default function PdfToPowerPoint() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [slideSize, setSlideSize] = useState("widescreen");
  const [quality, setQuality] = useState("normal");
  const [totalPages, setTotalPages] = useState(0);

  const hasFiles = flow.files?.length > 0;
  const file = flow.files?.[0] || null;

  // Get total page count
  useEffect(() => {
    if (!file) { setTotalPages(0); return; }
    const tryCount = async () => {
      if (!window.pdfjsLib) { setTimeout(tryCount, 150); return; }
      try {
        const buf = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        setTotalPages(pdf.numPages);
      } catch { setTotalPages(0); }
    };
    tryCount();
  }, [file]);

  const handleRemoveFile = () => {
    flow.reset();
    setTotalPages(0);
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file?.name?.replace(/\.pdf$/i, ".pptx") || "converted.pptx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── FIXED: Polling-based convert (same pattern as PdfToWord) ──
  const handleConvert = async () => {
    if (!flow.files?.length) return;
    flow.startProcessing();
    startProgress();

    try {
      // Step 1: Upload & get jobId
      const formData = new FormData();
      formData.append("file", flow.files[0]);
      formData.append("slide_size", slideSize); // FIXED: underscore wala naam
      formData.append("quality", quality);

      const uploadRes = await fetch("/convert/pdf-to-pptx", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { jobId } = await uploadRes.json();
      if (!jobId) throw new Error("No jobId received");

      // Step 2: Poll job status
      let attempts = 0;
      const maxAttempts = 60; // 60 * 3s = 3 min timeout

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch(`/convert/pdf-to-pptx/job/${jobId}`);
        if (!statusRes.ok) throw new Error("Job status check failed");

        const status = await statusRes.json();

        if (status.status === "done") {
          // Step 3: Download file
          const dlRes = await fetch(`/convert/pdf-to-pptx/download/${jobId}`);
          if (!dlRes.ok) throw new Error("Download failed");

          const blob = await dlRes.blob();
          setDownloadUrl(URL.createObjectURL(blob));
          completeProgress();
          flow.finishSuccess();
          return;
        }

        if (status.status === "failed") {
          throw new Error(status.error || "Conversion failed");
        }
      }

      throw new Error("Conversion timed out");

    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong while converting PDF to PowerPoint.");
    }
  };

  /* ── Custom layout ── */
  const customOptionsLayout = (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

      {/* LEFT: PDF thumbnail */}
      <div className="relative flex-1 overflow-auto bg-[#f0f0f0] p-8">
        {hasFiles ? (
          <div className="flex flex-wrap justify-center gap-6">
            <PdfCard
              file={file}
              totalPages={totalPages}
              onRemove={handleRemoveFile}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow">
                <Presentation className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">Upload a PDF to convert</p>
              <p className="mt-1 text-xs text-slate-400">Each PDF page becomes a PowerPoint slide</p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        className="flex flex-col bg-white border-l border-slate-200"
        style={{ width: 280, flexShrink: 0 }}
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">PDF to PowerPoint</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 p-5">

          {/* File info */}
          {hasFiles && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <FileText className="h-4 w-4 shrink-0 text-[#f24d0d]" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">{file.name}</p>
                {totalPages > 0 && (
                  <p className="text-[10px] text-slate-400">
                    {totalPages} page{totalPages > 1 ? "s" : ""} → {totalPages} slide{totalPages > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button onClick={handleRemoveFile} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* SLIDE SIZE */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Ratio className="h-4 w-4 text-slate-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide size</p>
            </div>
            <div className="space-y-2">
              {[
                { value: "widescreen", label: "Widescreen (16:9)", desc: "Best for modern presentations" },
                { value: "standard", label: "Standard (4:3)", desc: "Traditional presentation ratio" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSlideSize(opt.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${slideSize === opt.value
                    ? "border-[#f24d0d] bg-orange-50"
                    : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* QUALITY */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality</p>
            </div>
            <div className="space-y-2">
              {[
                { value: "normal", label: "Normal quality", desc: "Faster conversion & smaller file size" },
                { value: "high", label: "High quality", desc: "Better slide image quality" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${quality === opt.value
                    ? "border-[#f24d0d] bg-orange-50"
                    : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <Layers3 className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
              <p className="text-xs leading-5 text-blue-700">
                Each PDF page will become a separate PowerPoint slide.
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-green-100 bg-green-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
              <p className="text-xs leading-5 text-green-700">
                Files are encrypted and auto-deleted after processing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleConvert}
            disabled={!hasFiles}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${hasFiles
              ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_8px_24px_rgba(242,77,13,0.3)]"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
          >
            <Presentation className="h-4 w-4" />
            {hasFiles ? "Convert to PPTX" : "Upload PDF first"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }}
      />

      <Script
        id="howto-schema-pdf-to-pptx"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to PowerPoint Online for Free",
            description:
              "Convert PDF files into editable PowerPoint presentations in a few simple steps.",
            url: "https://pdflinx.com/pdf-powerpoint",
            step: [
              {
                "@type": "HowToStep",
                name: "Upload PDF",
                text: "Select and upload your PDF file."
              },
              {
                "@type": "HowToStep",
                name: "Convert to PPTX",
                text: "Click the convert button to transform your PDF into a PowerPoint presentation."
              },
              {
                "@type": "HowToStep",
                name: "Download PPTX",
                text: "Download the generated PowerPoint file and edit it in Microsoft PowerPoint or compatible software."
              }
            ],
            totalTime: "PT1M",
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
        id="breadcrumb-schema-pdf-to-pptx"
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
                name: "PDF to PowerPoint",
                item: "https://pdflinx.com/pdf-powerpoint"
              }
            ]
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-pdf-to-pptx"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Can I convert PDF to PowerPoint online?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you convert PDF files to editable PowerPoint presentations online for free." } },
              { "@type": "Question", name: "Will each PDF page become a slide?", acceptedAnswer: { "@type": "Answer", text: "Yes. Each page of your PDF becomes a separate PowerPoint slide." } },
              { "@type": "Question", name: "Does PDF to PPTX work on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDF to PowerPoint works on Android, iPhone, tablets, and desktop browsers." } },
            ],
          }),
        }}
      />

      <Script
        id="software-schema-pdf-to-pptx"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PDF to PowerPoint",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/pdf-powerpoint",
            description:
              "Free online PDF to PowerPoint converter. Convert PDF documents into editable PPTX presentations while preserving page layout and content structure.",
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
              "Convert PDF to PowerPoint presentations",
              "Export to PPTX format",
              "Editable PowerPoint slides",
              "Each PDF page becomes a slide",
              "Batch PDF conversion",
              "Works on desktop and mobile",
              "Free online converter",
              "No software installation required"
            ]
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title="PDF to PowerPoint"
        tagline="Convert PDF to PPTX Slides Online"
        accept=".pdf,application/pdf"
        multiple={false}
        convertLabel="Convert to PPTX"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        processingTitle="Converting PDF..."
        processingDescription="Creating PowerPoint slides from your PDF pages."
        processingStages={["Uploading", "Rendering pages", "Building PowerPoint", "Done"]}
        doneTitle="Your PowerPoint is ready"
        doneDescription="Download your converted PPTX presentation."
        downloadLabel="Download PPTX"
        resetLabel="Convert another PDF"
        sidebarTitle="PDF to PowerPoint"
        sidebarIcon={<Presentation className="h-5 w-5 text-white" />}
        sidebarDescription="Convert PDF pages into PowerPoint slides online."
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF supported"
        customOptionsLayout={customOptionsLayout}


        // ============================================================
        // PDF TO POWERPOINT — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,

            eyebrow: "PDF TO POWERPOINT CONVERTER",

            breadcrumbCurrent: "PDF to PowerPoint Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     PDF to PowerPoint Converter —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Slides Preserved
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Convert PDF to PowerPoint online for free. Each PDF page becomes an editable PPTX slide — layout, images, and text preserved. No signup, no watermark, no software needed.",

            // pills: [
            //   "No watermark",
            //   "Each page becomes a slide",
            //   "Works on any device",
            //   "Instant conversion",
            // ],

            heroTitle: (
              <>
                PDF to PowerPoint Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  PDF to PPT & PPTX Free Online
                </em>
              </>
            ),
            heroDescription:
              "Convert PDF to PowerPoint online for free — each PDF page converted to an editable PPT or PPTX slide. Text, images, and layout extracted accurately. No signup, no watermark.",
            pills: ["Editable PPT & PPTX", "Each page = one slide", "Text & images kept", "No signup"],



            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PDF to PowerPoint Conversion",
            noticeItems: [
              "Each PDF page → one PPTX slide",
              "Text, images & layout preserved",
              "Fully editable in PowerPoint",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: true,
              eyebrow: "PDF Types",
              title: "Standard PDF vs Scanned PDF",
              subtitle:
                "Know the difference — text-based PDFs give fully editable slides, scanned PDFs produce image-based slides.",
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert PDF to PowerPoint — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with presentation PDFs, report PDFs, and any multi-page document.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Convert to PowerPoint",
                desc: "Click Convert — each page of your PDF is converted into an individual PowerPoint slide. Text, images, shapes, and layout are preserved as editable elements in the PPTX file.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PPTX File",
                desc: "Your editable PowerPoint file is ready in seconds. Download it instantly — open in PowerPoint or Google Slides, edit slides, add animations, and present immediately.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF to PowerPoint Converter Online",

            seoBadge: "PDF to PowerPoint Guide",
            seoTitle: "Complete Guide to Converting PDF to PowerPoint Online",
            seoDescription:
              "Everything you need to know about converting PDF files to editable PowerPoint presentations — free, online, with slides and layout preserved. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF to PowerPoint Converter — Convert PDF Pages to Editable PPTX Slides Online",
                text: "Need to convert a PDF into a PowerPoint presentation? PDFLinx lets you convert PDF to PowerPoint online for free — instantly, with no software installation required. Whether it is a presentation someone shared as PDF, a report you need to repurpose as slides, or a deck exported to PDF that you need to edit again, PDFLinx converts each page into a fully editable PPTX slide in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PDF to PowerPoint Conversion?",
                text: "PDF to PowerPoint conversion turns each page of a PDF document into an individual slide in an editable PPTX file. This allows you to modify text, reposition images, change backgrounds, add animations, and update content — everything you can do in a normal PowerPoint file. It is especially useful when you receive a presentation as PDF and need to edit it, or when you want to repurpose a PDF report as a slide deck without recreating it from scratch.",
              },
              {
                title: "How Well is the Layout Preserved After Conversion?",
                text: "For text-based PDFs, PDFLinx extracts text blocks, images, and layout elements and places them as editable objects on each slide. Text remains selectable and editable, and images are embedded in their original positions. For scanned PDFs, each page is placed as a high-resolution image on a slide — the slide is viewable but text is not individually editable without OCR. The overall visual appearance of your PDF is preserved accurately in both cases.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF to PowerPoint Converter — No Watermark, No Limits",
                text: "Most free PDF to PowerPoint converters produce poor output — text boxes misaligned, images missing, or slides that look nothing like the original PDF. The tools that do it well usually require a paid subscription. PDFLinx gives you accurate, high-quality PDF to PowerPoint conversion for free, with no signup, no watermark, and no daily limit. Unlike iLovePDF and Smallpdf which restrict this conversion on free tiers, PDFLinx gives you full access at zero cost.",
              },
              {
                title: "Common Use Cases for PDF to PowerPoint Conversion",
                text: "✓ Business Professionals: Recover a presentation that was shared as PDF and needs to be edited or updated.\n✓ Students: Convert PDF lecture slides into editable PowerPoint files for note-taking and study.\n✓ Designers: Repurpose PDF reports, brochures, or portfolios as editable slide decks.\n✓ Sales & Marketing: Update PDF pitch decks and product presentations in PowerPoint without recreating them.\n✓ Teachers: Convert PDF educational materials into editable slides for classroom use.\n✓ Freelancers: Edit client-provided PDF presentations without access to the original source file.",
              },
              {
                title:
                  "Convert PDF to PowerPoint on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the PPTX in seconds. Whether you need to convert PDF to PowerPoint on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "PDF to PowerPoint vs Screenshot Method — Why a Proper Converter is Better",
                text: "Some people try to convert PDF to PowerPoint by taking screenshots of each page and pasting them as slide images. This approach is extremely time-consuming for multi-page PDFs, produces low-resolution slides, and gives you no editable text or elements. A proper PDF to PowerPoint converter like PDFLinx does this automatically in seconds — with preserved layout, editable text, and properly embedded images — saving hours of manual work.",
              },
              {
                title: "Best For Repurposing and Editing PDF Content",
                text: "Use the converted PPTX for editing, presenting, updating, and sharing. The output is fully compatible with Microsoft PowerPoint, Google Slides, LibreOffice Impress, and Apple Keynote — easy to open, modify, and present on any device or platform.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF to PowerPoint converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of conversions. Convert as many PDFs as you need at zero cost.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "Will each page of my PDF become a separate slide?",
                a: "Yes. Each page of your PDF is converted into one slide in the PPTX file — in the same order as the original PDF pages.",
              },
              {
                q: "Can I edit the text on the slides after conversion?",
                a: "Yes, for text-based PDFs. Text is extracted and placed as editable text boxes on each slide. For scanned PDFs, each page is placed as an image — text editing requires OCR processing.",
              },
              {
                q: "Will images from the PDF be preserved in the slides?",
                a: "Yes. Images embedded in the PDF are extracted and placed on the corresponding slides in their original positions.",
              },
              {
                q: "What is the difference between converting a standard PDF vs a scanned PDF?",
                a: "Standard text-based PDFs give you fully editable slides with selectable text and embedded images. Scanned PDFs produce slides with each page as a high-resolution image — viewable but not individually text-editable without OCR.",
              },
              {
                q: "Does PDFLinx add any watermark to the PowerPoint file?",
                a: "No watermarks, ever. Your converted PPTX file is 100% clean and ready to use or present.",
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
                a: "Up to 10 MB per file. For larger PDFs, try splitting the file first using our free PDF Split tool, then convert each part separately.",
              },
              {
                q: "Can I convert a password-protected PDF to PowerPoint?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then convert to PowerPoint.",
              },
              {
                q: "Which applications can open the converted PPTX file?",
                a: "The PPTX file is compatible with Microsoft PowerPoint, Google Slides, LibreOffice Impress, and Apple Keynote — works on any device and operating system.",
              },
              {
                q: "How long does PDF to PowerPoint conversion take?",
                a: "Most conversions complete within 10 to 30 seconds depending on file size and the number of pages.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF to PowerPoint?",
                a: "Yes — PDFLinx offers unlimited free conversions with accurate slide output, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict this conversion behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert PDF to PowerPoint now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate PDF to PowerPoint conversion every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />

      <RelatedToolsSection />
    </>
  );
}






























// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   Presentation,
//   Download,
//   MonitorSmartphone,
//   CheckCircle,
//   FileText,
//   ArrowRight,
//   Ratio,
//   Sparkles,
//   Layers3,
//   ShieldCheck,
//   X,
// } from "lucide-react";
// import Script from "next/script";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// /* =============================================
//    PDF PAGE THUMBNAIL
// ============================================= */
// function PdfPageThumbnail({ file, pageNumber = 1 }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!file || !window.pdfjsLib) return;
//     let cancelled = false;

//     const render = async () => {
//       try {
//         const arrayBuffer = await file.arrayBuffer();
//         const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//         if (cancelled) return;
//         const page = await pdf.getPage(pageNumber);
//         if (cancelled) return;
//         const viewport = page.getViewport({ scale: 0.7 });
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
//       } catch (err) {
//         console.error("Thumbnail render error:", err);
//       }
//     };

//     render();
//     return () => { cancelled = true; };
//   }, [file, pageNumber]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ maxWidth: "100%", maxHeight: "100%" }}
//       className="object-contain bg-white"
//     />
//   );
// }

// /* =============================================
//    PDF CARD
// ============================================= */
// function PdfCard({ file, totalPages, onRemove }) {
//   return (
//     <div className="group relative flex flex-col items-center gap-2">
//       <button
//         onClick={onRemove}
//         className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
//       >
//         <X className="h-3 w-3" />
//       </button>

//       <div
//         className="relative flex w-[160px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-md hover:border-slate-300 hover:shadow-lg transition-all"
//         style={{ aspectRatio: "3/4" }}
//       >
//         {totalPages > 0 && (
//           <div className="absolute top-2 right-2 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f24d0d] px-1.5 text-[10px] font-bold text-white shadow">
//             {totalPages}
//           </div>
//         )}
//         <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f24d0d] rounded-l-xl" />
//         <div className="absolute inset-0 flex items-center justify-center p-2 pl-3">
//           <PdfPageThumbnail file={file} pageNumber={1} />
//         </div>
//       </div>

//       <p className="w-[160px] text-center text-[11px] font-medium text-slate-500 leading-tight truncate px-1">
//         {file.name}
//       </p>
//     </div>
//   );
// }

// /* =============================================
//    MAIN COMPONENT
// ============================================= */
// export default function PdfToPowerPoint() {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [slideSize, setSlideSize] = useState("widescreen");
//   const [quality, setQuality] = useState("normal");
//   const [totalPages, setTotalPages] = useState(0);

//   const hasFiles = flow.files?.length > 0;
//   const file = flow.files?.[0] || null;

//   // Get total page count
//   useEffect(() => {
//     if (!file) { setTotalPages(0); return; }
//     const tryCount = async () => {
//       if (!window.pdfjsLib) { setTimeout(tryCount, 150); return; }
//       try {
//         const buf = await file.arrayBuffer();
//         const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
//         setTotalPages(pdf.numPages);
//       } catch { setTotalPages(0); }
//     };
//     tryCount();
//   }, [file]);

//   const handleRemoveFile = () => {
//     flow.reset();
//     setTotalPages(0);
//     setDownloadUrl(null);
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = file?.name?.replace(/\.pdf$/i, ".pptx") || "converted.pptx";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   // ── FIXED: Polling-based convert (same pattern as PdfToWord) ──
//   const handleConvert = async () => {
//     if (!flow.files?.length) return;
//     flow.startProcessing();
//     startProgress();

//     try {
//       // Step 1: Upload & get jobId
//       const formData = new FormData();
//       formData.append("file", flow.files[0]);
//       formData.append("slide_size", slideSize); // FIXED: underscore wala naam
//       formData.append("quality", quality);

//       const uploadRes = await fetch("/convert/pdf-to-pptx", {
//         method: "POST",
//         body: formData,
//       });

//       if (!uploadRes.ok) throw new Error("Upload failed");

//       const { jobId } = await uploadRes.json();
//       if (!jobId) throw new Error("No jobId received");

//       // Step 2: Poll job status
//       let attempts = 0;
//       const maxAttempts = 60; // 60 * 3s = 3 min timeout

//       while (attempts < maxAttempts) {
//         await new Promise((r) => setTimeout(r, 3000));
//         attempts++;

//         // const statusRes = await fetch(`/convert/pptx-job/${jobId}`);
//         const statusRes = await fetch(`/convert/pdf-to-pptx/job/${jobId}`);
//         if (!statusRes.ok) throw new Error("Job status check failed");

//         const status = await statusRes.json();

//         if (status.status === "done") {
//           // Step 3: Download file
//           // const dlRes = await fetch(`/convert/pptx-download/${jobId}`);
//           const dlRes = await fetch(`/convert/pdf-to-pptx/download/${jobId}`);
//           if (!dlRes.ok) throw new Error("Download failed");

//           const blob = await dlRes.blob();
//           setDownloadUrl(URL.createObjectURL(blob));
//           completeProgress();
//           flow.finishSuccess();
//           return;
//         }

//         if (status.status === "failed") {
//           throw new Error(status.error || "Conversion failed");
//         }
//       }

//       throw new Error("Conversion timed out");

//     } catch (err) {
//       console.error(err);
//       cancelProgress();
//       flow.handleError("Something went wrong while converting PDF to PowerPoint.");
//     }
//   };

//   /* ── Custom layout ── */
//   const customOptionsLayout = (
//     <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

//       {/* LEFT: PDF thumbnail */}
//       <div className="relative flex-1 overflow-auto bg-[#f0f0f0] p-8">
//         {hasFiles ? (
//           <div className="flex flex-wrap justify-center gap-6">
//             <PdfCard
//               file={file}
//               totalPages={totalPages}
//               onRemove={handleRemoveFile}
//             />
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             <div className="text-center">
//               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow">
//                 <Presentation className="h-8 w-8 text-slate-300" />
//               </div>
//               <p className="text-sm font-semibold text-slate-500">Upload a PDF to convert</p>
//               <p className="mt-1 text-xs text-slate-400">Each PDF page becomes a PowerPoint slide</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* RIGHT SIDEBAR */}
//       <div
//         className="flex flex-col bg-white border-l border-slate-200"
//         style={{ width: 280, flexShrink: 0 }}
//       >
//         <div className="border-b border-slate-100 px-5 py-4">
//           <h3 className="text-base font-bold text-slate-900">PDF to PowerPoint</h3>
//         </div>

//         <div className="flex-1 overflow-y-auto space-y-5 p-5">

//           {/* File info */}
//           {hasFiles && (
//             <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
//               <FileText className="h-4 w-4 shrink-0 text-[#f24d0d]" />
//               <div className="flex-1 min-w-0">
//                 <p className="truncate text-xs font-semibold text-slate-700">{file.name}</p>
//                 {totalPages > 0 && (
//                   <p className="text-[10px] text-slate-400">
//                     {totalPages} page{totalPages > 1 ? "s" : ""} → {totalPages} slide{totalPages > 1 ? "s" : ""}
//                   </p>
//                 )}
//               </div>
//               <button onClick={handleRemoveFile} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors">
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             </div>
//           )}

//           {/* SLIDE SIZE */}
//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               <Ratio className="h-4 w-4 text-slate-400" />
//               <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide size</p>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { value: "widescreen", label: "Widescreen (16:9)", desc: "Best for modern presentations" },
//                 { value: "standard",   label: "Standard (4:3)",    desc: "Traditional presentation ratio" },
//               ].map(opt => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setSlideSize(opt.value)}
//                   className={`w-full rounded-xl border px-4 py-3 text-left transition ${
//                     slideSize === opt.value
//                       ? "border-[#f24d0d] bg-orange-50"
//                       : "border-slate-200 hover:bg-slate-50"
//                   }`}
//                 >
//                   <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
//                   <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* QUALITY */}
//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               <Sparkles className="h-4 w-4 text-slate-400" />
//               <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality</p>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { value: "normal", label: "Normal quality", desc: "Faster conversion & smaller file size" },
//                 { value: "high",   label: "High quality",   desc: "Better slide image quality" },
//               ].map(opt => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setQuality(opt.value)}
//                   className={`w-full rounded-xl border px-4 py-3 text-left transition ${
//                     quality === opt.value
//                       ? "border-[#f24d0d] bg-orange-50"
//                       : "border-slate-200 hover:bg-slate-50"
//                   }`}
//                 >
//                   <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
//                   <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Info */}
//           <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
//             <div className="flex items-start gap-2.5">
//               <Layers3 className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
//               <p className="text-xs leading-5 text-blue-700">
//                 Each PDF page will become a separate PowerPoint slide.
//               </p>
//             </div>
//           </div>

//           {/* Security */}
//           <div className="rounded-xl border border-green-100 bg-green-50 p-3.5">
//             <div className="flex items-start gap-2.5">
//               <ShieldCheck className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
//               <p className="text-xs leading-5 text-green-700">
//                 Files are encrypted and auto-deleted after processing.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="border-t border-slate-100 p-4">
//           <button
//             type="button"
//             onClick={handleConvert}
//             disabled={!hasFiles}
//             className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${
//               hasFiles
//                 ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_8px_24px_rgba(242,77,13,0.3)]"
//                 : "cursor-not-allowed bg-slate-200 text-slate-400"
//             }`}
//           >
//             <Presentation className="h-4 w-4" />
//             {hasFiles ? "Convert to PPTX" : "Upload PDF first"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <Script
//         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         strategy="afterInteractive"
//         onLoad={() => {
//           window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//         }}
//       />

//       <Script
//         id="faq-schema-pdf-to-pptx"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               { "@type": "Question", name: "Can I convert PDF to PowerPoint online?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you convert PDF files to editable PowerPoint presentations online for free." } },
//               { "@type": "Question", name: "Will each PDF page become a slide?",      acceptedAnswer: { "@type": "Answer", text: "Yes. Each page of your PDF becomes a separate PowerPoint slide." } },
//               { "@type": "Question", name: "Does PDF to PPTX work on mobile?",        acceptedAnswer: { "@type": "Answer", text: "Yes. PDF to PowerPoint works on Android, iPhone, tablets, and desktop browsers." } },
//             ],
//           }),
//         }}
//       />

//       <ToolPageLayout
//         title="PDF to PowerPoint"
//         tagline="Convert PDF to PPTX Slides Online"
//         accept=".pdf,application/pdf"
//         multiple={false}
//         convertLabel="Convert to PPTX"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DEFAULT_DONE_LINKS}
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         processingTitle="Converting PDF..."
//         processingDescription="Creating PowerPoint slides from your PDF pages."
//         processingStages={["Uploading", "Rendering pages", "Building PowerPoint", "Done"]}
//         doneTitle="Your PowerPoint is ready"
//         doneDescription="Download your converted PPTX presentation."
//         downloadLabel="Download PPTX"
//         resetLabel="Convert another PDF"
//         sidebarTitle="PDF to PowerPoint"
//         sidebarIcon={<Presentation className="h-5 w-5 text-white" />}
//         sidebarDescription="Convert PDF pages into PowerPoint slides online."
//         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF supported"
//         customOptionsLayout={customOptionsLayout}

//         uploadLanding={{
//           content: {
//             eyebrow: "PDF TO POWERPOINT",
//             heroTitle: (
//               <>
//                 Convert PDF to <br />
//                 <em className="font-bold not-italic text-[#e8420a] sm:italic">PowerPoint online</em>
//               </>
//             ),
//             heroDescription:
//               "Convert PDF files into editable PowerPoint presentations online for free. Each PDF page becomes a PPTX slide instantly.",
//             noticeTitle: "PDF to PPTX features",
//             noticeItems: ["Convert PDF pages into slides", "Widescreen & standard formats", "High quality conversion"],
//             howToTitle: "How to convert PDF to PowerPoint",
//             howToSubtitle: "Upload your PDF and download editable PowerPoint slides instantly.",
//             howToSteps: [
//               { n: "1", title: "Upload your PDF",  desc: "Select the PDF document you want to convert.", color: "bg-blue-600"    },
//               { n: "2", title: "Choose settings",  desc: "Select slide size and quality options.",       color: "bg-orange-600"  },
//               { n: "3", title: "Download PPTX",    desc: "Download your converted PowerPoint file.",     color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why use PDFLinx PDF to PowerPoint?",
//             whyItems: [
//               { title: "Fast Conversion",     desc: "Convert PDF pages into PPTX slides in seconds.",              icon: Presentation,      iconColor: "text-orange-600", bgColor: "bg-orange-100" },
//               { title: "High Quality Slides", desc: "Choose high quality rendering for better presentations.",      icon: Sparkles,          iconColor: "text-blue-600",   bgColor: "bg-blue-100"   },
//               { title: "Works Everywhere",    desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
//               { title: "Secure Processing",   desc: "Files are encrypted during upload and automatically deleted.", icon: CheckCircle,       iconColor: "text-green-600",  bgColor: "bg-green-100"  },
//             ],
//             seoBadge: "PDF to PPTX Tool",
//             seoTitle: "Convert PDF to PowerPoint Online Free",
//             seoDescription: "Convert PDF files into PowerPoint PPTX presentations online for free. Turn each PDF page into editable slides instantly.",
//             seoSections: [
//               { title: "Convert PDF Pages into Slides",      text: "Each page of your PDF becomes a separate PowerPoint slide automatically." },
//               { title: "High Quality PowerPoint Conversion", text: "Choose normal or high quality rendering for professional presentations."   },
//               { title: "Online PDF to PPTX Tool",           text: "Convert PDFs into PowerPoint directly in your browser without installing software." },
//             ],
//             faqTitle: "Frequently asked questions",
//             faqs: [
//               { q: "Can I convert PDF to PowerPoint online?", a: "Yes. PDFLinx lets you convert PDF files into PowerPoint presentations online for free." },
//               { q: "Will each PDF page become a slide?",      a: "Yes. Each page of your PDF becomes a separate PowerPoint slide."                       },
//               { q: "Can I choose slide format?",              a: "Yes. You can select widescreen (16:9) or standard (4:3) slide layouts."                },
//               { q: "Does PDF to PPTX work on mobile?",       a: "Yes. It works on Android, iPhone, tablets, and desktop browsers."                      },
//             ],
//           },
//         }}
//       />

//       <RelatedToolsSection />
//     </>
//   );
// }
































// // "use client";

// // import { useState, useRef, useEffect } from "react";
// // import {
// //   Presentation,
// //   Download,
// //   MonitorSmartphone,
// //   CheckCircle,
// //   FileText,
// //   ArrowRight,
// //   Ratio,
// //   Sparkles,
// //   Layers3,
// //   ShieldCheck,
// //   X,
// // } from "lucide-react";
// // import Script from "next/script";
// // import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// // import RelatedToolsSection from "@/components/RelatedTools";
// // import { useToolFlow } from "@/hooks/useToolFlow";
// // import { useProgressBar } from "@/hooks/useProgressBar";
// // import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

// // /* =============================================
// //    PDF PAGE THUMBNAIL — same as OrganizePdf
// // ============================================= */
// // function PdfPageThumbnail({ file, pageNumber = 1 }) {
// //   const canvasRef = useRef(null);

// //   useEffect(() => {
// //     if (!file || !window.pdfjsLib) return;
// //     let cancelled = false;

// //     const render = async () => {
// //       try {
// //         const arrayBuffer = await file.arrayBuffer();
// //         const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// //         if (cancelled) return;
// //         const page = await pdf.getPage(pageNumber);
// //         if (cancelled) return;
// //         const viewport = page.getViewport({ scale: 0.7 });
// //         const canvas = canvasRef.current;
// //         if (!canvas) return;
// //         canvas.width = viewport.width;
// //         canvas.height = viewport.height;
// //         await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
// //       } catch (err) {
// //         console.error("Thumbnail render error:", err);
// //       }
// //     };

// //     render();
// //     return () => { cancelled = true; };
// //   }, [file, pageNumber]);

// //   return (
// //     <canvas
// //       ref={canvasRef}
// //       style={{ maxWidth: "100%", maxHeight: "100%" }}
// //       className="object-contain bg-white"
// //     />
// //   );
// // }

// // /* =============================================
// //    PDF CARD — real thumbnail + page count badge
// // ============================================= */
// // function PdfCard({ file, totalPages, onRemove }) {
// //   return (
// //     <div className="group relative flex flex-col items-center gap-2">
// //       {/* Remove button */}
// //       <button
// //         onClick={onRemove}
// //         className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
// //       >
// //         <X className="h-3 w-3" />
// //       </button>

// //       {/* Card */}
// //       <div
// //         className="relative flex w-[160px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-md hover:border-slate-300 hover:shadow-lg transition-all"
// //         style={{ aspectRatio: "3/4" }}
// //       >
// //         {/* Page count badge */}
// //         {totalPages > 0 && (
// //           <div className="absolute top-2 right-2 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f24d0d] px-1.5 text-[10px] font-bold text-white shadow">
// //             {totalPages}
// //           </div>
// //         )}

// //         {/* Red left strip */}
// //         <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f24d0d] rounded-l-xl" />

// //         {/* Thumbnail */}
// //         <div className="absolute inset-0 flex items-center justify-center p-2 pl-3">
// //           <PdfPageThumbnail file={file} pageNumber={1} />
// //         </div>
// //       </div>

// //       {/* File name */}
// //       <p className="w-[160px] text-center text-[11px] font-medium text-slate-500 leading-tight truncate px-1">
// //         {file.name}
// //       </p>
// //     </div>
// //   );
// // }

// // /* =============================================
// //    MAIN COMPONENT
// // ============================================= */
// // export default function PdfToPowerPoint() {
// //   const flow = useToolFlow();
// //   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [slideSize, setSlideSize] = useState("widescreen");
// //   const [quality, setQuality] = useState("normal");
// //   const [totalPages, setTotalPages] = useState(0);

// //   const hasFiles = flow.files?.length > 0;
// //   const file = flow.files?.[0] || null;

// //   // Get total page count from PDF
// //   useEffect(() => {
// //     if (!file) { setTotalPages(0); return; }
// //     const tryCount = async () => {
// //       if (!window.pdfjsLib) { setTimeout(tryCount, 150); return; }
// //       try {
// //         const buf = await file.arrayBuffer();
// //         const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
// //         setTotalPages(pdf.numPages);
// //       } catch { setTotalPages(0); }
// //     };
// //     tryCount();
// //   }, [file]);

// //   const handleRemoveFile = () => {
// //     flow.reset();
// //     setTotalPages(0);
// //     setDownloadUrl(null);
// //   };

// //   const handleDownload = () => {
// //     if (!downloadUrl) return;
// //     const a = document.createElement("a");
// //     a.href = downloadUrl;
// //     a.download = file?.name?.replace(/\.pdf$/i, ".pptx") || "converted.pptx";
// //     document.body.appendChild(a);
// //     a.click();
// //     a.remove();
// //   };

// //   const handleConvert = async () => {
// //     if (!flow.files?.length) return;
// //     flow.startProcessing();
// //     startProgress();
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", flow.files[0]);
// //       formData.append("slideSize", slideSize);
// //       formData.append("quality", quality);

// //       const res = await fetch("/convert/pdf-to-pptx", { method: "POST", body: formData });
// //       if (!res.ok) throw new Error("Failed to convert PDF to PPTX");

// //       const blob = await res.blob();
// //       const url = URL.createObjectURL(blob);
// //       setDownloadUrl(url);
// //       completeProgress();
// //       flow.finishSuccess();
// //     } catch (err) {
// //       console.error(err);
// //       cancelProgress();
// //       flow.handleError("Something went wrong while converting PDF to PowerPoint.");
// //     }
// //   };

// //   /* ── Custom layout — flex pattern same as OrganizePdf ── */
// //   const customOptionsLayout = (
// //     <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

// //       {/* ── LEFT: PDF thumbnail canvas ── */}
// //       <div className="relative flex-1 overflow-auto bg-[#f0f0f0] p-8">
// //         {hasFiles ? (
// //           <div className="flex flex-wrap justify-center gap-6">
// //             <PdfCard
// //               file={file}
// //               totalPages={totalPages}
// //               onRemove={handleRemoveFile}
// //             />
// //           </div>
// //         ) : (
// //           <div className="flex h-full items-center justify-center">
// //             <div className="text-center">
// //               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow">
// //                 <Presentation className="h-8 w-8 text-slate-300" />
// //               </div>
// //               <p className="text-sm font-semibold text-slate-500">Upload a PDF to convert</p>
// //               <p className="mt-1 text-xs text-slate-400">Each PDF page becomes a PowerPoint slide</p>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ── RIGHT SIDEBAR — fixed width, always visible like OrganizePdf ── */}
// //       <div
// //         className="flex flex-col bg-white border-l border-slate-200"
// //         style={{ width: 280, flexShrink: 0 }}
// //       >
// //         {/* Title */}
// //         <div className="border-b border-slate-100 px-5 py-4">
// //           <h3 className="text-base font-bold text-slate-900">PDF to PowerPoint</h3>
// //         </div>

// //         <div className="flex-1 overflow-y-auto space-y-5 p-5">

// //           {/* File info chip */}
// //           {hasFiles && (
// //             <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
// //               <FileText className="h-4 w-4 shrink-0 text-[#f24d0d]" />
// //               <div className="flex-1 min-w-0">
// //                 <p className="truncate text-xs font-semibold text-slate-700">{file.name}</p>
// //                 {totalPages > 0 && (
// //                   <p className="text-[10px] text-slate-400">
// //                     {totalPages} page{totalPages > 1 ? "s" : ""} → {totalPages} slide{totalPages > 1 ? "s" : ""}
// //                   </p>
// //                 )}
// //               </div>
// //               <button onClick={handleRemoveFile} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors">
// //                 <X className="h-3.5 w-3.5" />
// //               </button>
// //             </div>
// //           )}

// //           {/* SLIDE SIZE */}
// //           <div>
// //             <div className="mb-2 flex items-center gap-2">
// //               <Ratio className="h-4 w-4 text-slate-400" />
// //               <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide size</p>
// //             </div>
// //             <div className="space-y-2">
// //               {[
// //                 { value: "widescreen", label: "Widescreen (16:9)", desc: "Best for modern presentations" },
// //                 { value: "standard",   label: "Standard (4:3)",    desc: "Traditional presentation ratio" },
// //               ].map(opt => (
// //                 <button
// //                   key={opt.value}
// //                   onClick={() => setSlideSize(opt.value)}
// //                   className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// //                     slideSize === opt.value
// //                       ? "border-[#f24d0d] bg-orange-50"
// //                       : "border-slate-200 hover:bg-slate-50"
// //                   }`}
// //                 >
// //                   <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
// //                   <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* QUALITY */}
// //           <div>
// //             <div className="mb-2 flex items-center gap-2">
// //               <Sparkles className="h-4 w-4 text-slate-400" />
// //               <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality</p>
// //             </div>
// //             <div className="space-y-2">
// //               {[
// //                 { value: "normal", label: "Normal quality", desc: "Faster conversion & smaller file size" },
// //                 { value: "high",   label: "High quality",   desc: "Better slide image quality" },
// //               ].map(opt => (
// //                 <button
// //                   key={opt.value}
// //                   onClick={() => setQuality(opt.value)}
// //                   className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// //                     quality === opt.value
// //                       ? "border-[#f24d0d] bg-orange-50"
// //                       : "border-slate-200 hover:bg-slate-50"
// //                   }`}
// //                 >
// //                   <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
// //                   <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Info */}
// //           <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
// //             <div className="flex items-start gap-2.5">
// //               <Layers3 className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
// //               <p className="text-xs leading-5 text-blue-700">
// //                 Each PDF page will become a separate PowerPoint slide.
// //               </p>
// //             </div>
// //           </div>

// //           {/* Security */}
// //           <div className="rounded-xl border border-green-100 bg-green-50 p-3.5">
// //             <div className="flex items-start gap-2.5">
// //               <ShieldCheck className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
// //               <p className="text-xs leading-5 text-green-700">
// //                 Files are encrypted and auto-deleted after processing.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* CTA — sticky bottom */}
// //         <div className="border-t border-slate-100 p-4">
// //           <button
// //             type="button"
// //             onClick={handleConvert}
// //             disabled={!hasFiles}
// //             className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${
// //               hasFiles
// //                 ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-[0_8px_24px_rgba(242,77,13,0.3)]"
// //                 : "cursor-not-allowed bg-slate-200 text-slate-400"
// //             }`}
// //           >
// //             <Presentation className="h-4 w-4" />
// //             {hasFiles ? "Convert to PPTX" : "Upload PDF first"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       <Script
// //         src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
// //         strategy="afterInteractive"
// //         onLoad={() => {
// //           window.pdfjsLib.GlobalWorkerOptions.workerSrc =
// //             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
// //         }}
// //       />

// //       <Script
// //         id="faq-schema-pdf-to-pptx"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "FAQPage",
// //             mainEntity: [
// //               { "@type": "Question", name: "Can I convert PDF to PowerPoint online?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you convert PDF files to editable PowerPoint presentations online for free." } },
// //               { "@type": "Question", name: "Will each PDF page become a slide?",      acceptedAnswer: { "@type": "Answer", text: "Yes. Each page of your PDF becomes a separate PowerPoint slide." } },
// //               { "@type": "Question", name: "Does PDF to PPTX work on mobile?",        acceptedAnswer: { "@type": "Answer", text: "Yes. PDF to PowerPoint works on Android, iPhone, tablets, and desktop browsers." } },
// //             ],
// //           }),
// //         }}
// //       />

// //       <ToolPageLayout
// //         title="PDF to PowerPoint"
// //         tagline="Convert PDF to PPTX Slides Online"
// //         accept=".pdf,application/pdf"
// //         multiple={false}
// //         convertLabel="Convert to PPTX"
// //         flow={flow}
// //         progress={progress}
// //         onRemoveFile={handleRemoveFile}
// //         onConvert={handleConvert}
// //         onDownload={handleDownload}
// //         doneLinks={DEFAULT_DONE_LINKS}
// //         showOutputFormat={false}
// //         showPreserveLayout={false}
// //         processingTitle="Converting PDF..."
// //         processingDescription="Creating PowerPoint slides from your PDF pages."
// //         processingStages={["Uploading", "Rendering pages", "Building PowerPoint", "Done"]}
// //         doneTitle="Your PowerPoint is ready"
// //         doneDescription="Download your converted PPTX presentation."
// //         downloadLabel="Download PPTX"
// //         resetLabel="Convert another PDF"
// //         sidebarTitle="PDF to PowerPoint"
// //         sidebarIcon={<Presentation className="h-5 w-5 text-white" />}
// //         sidebarDescription="Convert PDF pages into PowerPoint slides online."
// //         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
// //         uploadTitle="Drop your PDF here"
// //         uploadSubtitle="or click to browse — PDF supported"
// //         customOptionsLayout={customOptionsLayout}

// //         uploadLanding={{
// //           content: {
// //             eyebrow: "PDF TO POWERPOINT",
// //             heroTitle: (
// //               <>
// //                 Convert PDF to <br />
// //                 <em className="font-bold not-italic text-[#e8420a] sm:italic">PowerPoint online</em>
// //               </>
// //             ),
// //             heroDescription:
// //               "Convert PDF files into editable PowerPoint presentations online for free. Each PDF page becomes a PPTX slide instantly.",
// //             noticeTitle: "PDF to PPTX features",
// //             noticeItems: ["Convert PDF pages into slides", "Widescreen & standard formats", "High quality conversion"],
// //             howToTitle: "How to convert PDF to PowerPoint",
// //             howToSubtitle: "Upload your PDF and download editable PowerPoint slides instantly.",
// //             howToSteps: [
// //               { n: "1", title: "Upload your PDF",  desc: "Select the PDF document you want to convert.", color: "bg-blue-600"    },
// //               { n: "2", title: "Choose settings",  desc: "Select slide size and quality options.",       color: "bg-orange-600"  },
// //               { n: "3", title: "Download PPTX",    desc: "Download your converted PowerPoint file.",     color: "bg-emerald-600" },
// //             ],
// //             whyTitle: "Why use PDFLinx PDF to PowerPoint?",
// //             whyItems: [
// //               { title: "Fast Conversion",    desc: "Convert PDF pages into PPTX slides in seconds.",              icon: Presentation,     iconColor: "text-orange-600", bgColor: "bg-orange-100" },
// //               { title: "High Quality Slides",desc: "Choose high quality rendering for better presentations.",      icon: Sparkles,         iconColor: "text-blue-600",   bgColor: "bg-blue-100"   },
// //               { title: "Works Everywhere",   desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone,iconColor: "text-purple-600", bgColor: "bg-purple-100" },
// //               { title: "Secure Processing",  desc: "Files are encrypted during upload and automatically deleted.", icon: CheckCircle,      iconColor: "text-green-600",  bgColor: "bg-green-100"  },
// //             ],
// //             seoBadge: "PDF to PPTX Tool",
// //             seoTitle: "Convert PDF to PowerPoint Online Free",
// //             seoDescription: "Convert PDF files into PowerPoint PPTX presentations online for free. Turn each PDF page into editable slides instantly.",
// //             seoSections: [
// //               { title: "Convert PDF Pages into Slides",      text: "Each page of your PDF becomes a separate PowerPoint slide automatically." },
// //               { title: "High Quality PowerPoint Conversion", text: "Choose normal or high quality rendering for professional presentations."   },
// //               { title: "Online PDF to PPTX Tool",           text: "Convert PDFs into PowerPoint directly in your browser without installing software." },
// //             ],
// //             faqTitle: "Frequently asked questions",
// //             faqs: [
// //               { q: "Can I convert PDF to PowerPoint online?", a: "Yes. PDFLinx lets you convert PDF files into PowerPoint presentations online for free." },
// //               { q: "Will each PDF page become a slide?",      a: "Yes. Each page of your PDF becomes a separate PowerPoint slide."                       },
// //               { q: "Can I choose slide format?",              a: "Yes. You can select widescreen (16:9) or standard (4:3) slide layouts."                },
// //               { q: "Does PDF to PPTX work on mobile?",       a: "Yes. It works on Android, iPhone, tablets, and desktop browsers."                      },
// //             ],
// //           },
// //         }}
// //       />

// //       <RelatedToolsSection />
// //     </>
// //   );
// // }

























// // // "use client";

// // // import { useState } from "react";
// // // import {
// // //   Presentation,
// // //   Download,
// // //   MonitorSmartphone,
// // //   CheckCircle,
// // //   FileText,
// // //   ArrowRight,
// // //   Ratio,
// // //   Sparkles,
// // //   Layers3,
// // // } from "lucide-react";

// // // import Script from "next/script";

// // // import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// // // import RelatedToolsSection from "@/components/RelatedTools";

// // // import { useToolFlow } from "@/hooks/useToolFlow";
// // // import { useProgressBar } from "@/hooks/useProgressBar";

// // // import {
// // //   DEFAULT_DONE_LINKS,
// // //   DEFAULT_SIDEBAR_FEATURES,
// // // } from "@/lib/toolUiConfig";

// // // export default function PdfToPowerPoint() {

// // //   const flow = useToolFlow();

// // //   const {
// // //     progress,
// // //     startProgress,
// // //     completeProgress,
// // //     cancelProgress,
// // //   } = useProgressBar();

// // //   const [downloadUrl, setDownloadUrl] = useState(null);

// // //   // OPTIONS
// // //   const [slideSize, setSlideSize] =
// // //     useState("widescreen");

// // //   const [quality, setQuality] =
// // //     useState("normal");

// // //   const handleRemoveFile = (index) => {
// // //     const updated = flow.files.filter(
// // //       (_, i) => i !== index
// // //     );

// // //     if (updated.length === 0) {
// // //       flow.reset();
// // //     } else {
// // //       flow.selectFiles(updated);
// // //     }
// // //   };

// // //   const handleDownload = () => {

// // //     if (!downloadUrl) return;

// // //     const a = document.createElement("a");

// // //     a.href = downloadUrl;

// // //     a.download = "converted.pptx";

// // //     document.body.appendChild(a);

// // //     a.click();

// // //     a.remove();
// // //   };

// // //   const handleConvert = async () => {

// // //     if (!flow.files?.length) return;

// // //     flow.startProcessing();

// // //     startProgress();

// // //     try {

// // //       const formData = new FormData();

// // //       formData.append(
// // //         "file",
// // //         flow.files[0]
// // //       );

// // //       formData.append(
// // //         "slideSize",
// // //         slideSize
// // //       );

// // //       formData.append(
// // //         "quality",
// // //         quality
// // //       );

// // //       const res = await fetch(
// // //         "/convert/pdf-to-pptx",
// // //         {
// // //           method: "POST",
// // //           body: formData,
// // //         }
// // //       );

// // //       if (!res.ok) {
// // //         throw new Error(
// // //           "Failed to convert PDF to PPTX"
// // //         );
// // //       }

// // //       const blob = await res.blob();

// // //       const url =
// // //         URL.createObjectURL(blob);

// // //       setDownloadUrl(url);

// // //       completeProgress();

// // //       flow.finishSuccess();

// // //     } catch (err) {

// // //       console.error(err);

// // //       cancelProgress();

// // //       flow.handleError(
// // //         "Something went wrong while converting PDF to PowerPoint."
// // //       );
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {/* FAQ SCHEMA */}
// // //       <Script
// // //         id="faq-schema-pdf-to-pptx"
// // //         type="application/ld+json"
// // //         strategy="afterInteractive"
// // //         dangerouslySetInnerHTML={{
// // //           __html: JSON.stringify({
// // //             "@context":
// // //               "https://schema.org",

// // //             "@type": "FAQPage",

// // //             mainEntity: [
// // //               {
// // //                 "@type": "Question",

// // //                 name:
// // //                   "Can I convert PDF to PowerPoint online?",

// // //                 acceptedAnswer: {
// // //                   "@type": "Answer",

// // //                   text:
// // //                     "Yes. PDFLinx lets you convert PDF files to editable PowerPoint presentations online for free.",
// // //                 },
// // //               },

// // //               {
// // //                 "@type": "Question",

// // //                 name:
// // //                   "Will each PDF page become a slide?",

// // //                 acceptedAnswer: {
// // //                   "@type": "Answer",

// // //                   text:
// // //                     "Yes. Each page of your PDF becomes a separate PowerPoint slide.",
// // //                 },
// // //               },

// // //               {
// // //                 "@type": "Question",

// // //                 name:
// // //                   "Does PDF to PPTX work on mobile?",

// // //                 acceptedAnswer: {
// // //                   "@type": "Answer",

// // //                   text:
// // //                     "Yes. PDF to PowerPoint works on Android, iPhone, tablets, and desktop browsers.",
// // //                 },
// // //               },
// // //             ],
// // //           }),
// // //         }}
// // //       />

// // //       <ToolPageLayout
// // //         title="PDF to PowerPoint"
// // //         tagline="Convert PDF to PPTX Slides Online"

// // //         accept=".pdf,application/pdf"

// // //         multiple={false}

// // //         convertLabel="Convert to PPTX"

// // //         flow={flow}

// // //         progress={progress}

// // //         onRemoveFile={handleRemoveFile}

// // //         onConvert={handleConvert}

// // //         onDownload={handleDownload}

// // //         doneLinks={DEFAULT_DONE_LINKS}

// // //         showOutputFormat={false}

// // //         showPreserveLayout={false}

// // //         processingTitle="Converting PDF..."

// // //         processingDescription="Creating PowerPoint slides from your PDF pages."

// // //         processingStages={[
// // //           "Uploading",
// // //           "Rendering pages",
// // //           "Building PowerPoint",
// // //           "Done",
// // //         ]}

// // //         doneTitle="Your PowerPoint is ready"

// // //         doneDescription="Download your converted PPTX presentation."

// // //         downloadLabel="Download PPTX"

// // //         resetLabel="Convert another PDF"

// // //         sidebarTitle="PDF to PowerPoint"

// // //         sidebarIcon={
// // //           <Presentation className="h-5 w-5 text-white" />
// // //         }

// // //         sidebarDescription="Convert PDF pages into PowerPoint slides online."

// // //         sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}

// // //         uploadTitle="Drop your PDF here"

// // //         uploadSubtitle="or click to browse — PDF supported"

// // //         customOptionsLayout={
// // //           <div
// // //             className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
// // //             style={{
// // //               minHeight:
// // //                 "calc(100vh - 120px)",
// // //             }}
// // //           >

// // //             {/* TOP */}
// // //             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">

// // //               <div className="flex items-center gap-3">

// // //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f24d0d] text-white shadow">
// // //                   <Presentation className="h-5 w-5" />
// // //                 </div>

// // //                 <div>
// // //                   <h2 className="text-sm font-bold text-slate-900">
// // //                     PDF to PowerPoint
// // //                   </h2>

// // //                   <p className="text-xs text-slate-400">
// // //                     Convert PDF pages into PPTX slides
// // //                   </p>
// // //                 </div>
// // //               </div>

// // //               {flow.files?.[0] && (
// // //                 <div className="hidden md:flex items-center gap-2">

// // //                   <span className="max-w-[220px] truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
// // //                     {flow.files[0].name}
// // //                   </span>

// // //                   <button
// // //                     onClick={() => flow.reset()}
// // //                     className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
// // //                   >
// // //                     Remove
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* BODY */}
// // //             <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px]">

// // //               {/* LEFT */}
// // //               <div
// // //                 className="bg-[#f3f4f6] p-8"
// // //                 style={{
// // //                   height:
// // //                     "calc(100vh - 140px)",
// // //                 }}
// // //               >
// // //                 {flow.files?.[0] ? (

// // //                   <div className="flex h-full items-center justify-center">

// // //                     <div className="w-[260px] rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">

// // //                       {/* PDF PREVIEW */}
// // //                       <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#fafafa]">

// // //                         <div className="flex h-[330px] items-center justify-center">

// // //                           <div className="text-center">

// // //                             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f24d0d]/10">
// // //                               <FileText className="h-10 w-10 text-[#f24d0d]" />
// // //                             </div>

// // //                             <p className="px-5 text-sm font-semibold text-slate-700">
// // //                               {flow.files[0].name}
// // //                             </p>

// // //                             <p className="mt-2 text-xs text-slate-400">
// // //                               PDF will be converted into PPTX slides
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                       </div>

// // //                       {/* INFO */}
// // //                       <div className="mt-4 space-y-2">

// // //                         <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
// // //                           <span className="text-sm text-slate-500">
// // //                             Slide size
// // //                           </span>

// // //                           <span className="text-sm font-semibold text-slate-700">
// // //                             {slideSize ===
// // //                             "standard"
// // //                               ? "4:3"
// // //                               : "16:9"}
// // //                           </span>
// // //                         </div>

// // //                         <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
// // //                           <span className="text-sm text-slate-500">
// // //                             Quality
// // //                           </span>

// // //                           <span className="text-sm font-semibold text-slate-700 capitalize">
// // //                             {quality}
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                 ) : (

// // //                   <div className="flex h-full items-center justify-center">

// // //                     <div className="text-center">

// // //                       <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white">
// // //                         <Presentation className="h-8 w-8 text-slate-300" />
// // //                       </div>

// // //                       <p className="text-sm font-semibold text-slate-600">
// // //                         Upload a PDF to convert
// // //                       </p>

// // //                       <p className="mt-1 text-xs text-slate-400">
// // //                         Convert each PDF page into PowerPoint slides
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* RIGHT SIDEBAR */}
// // //               <div className="border-l border-slate-200 bg-white">

// // //                 <div
// // //                   className="sticky top-0 overflow-y-auto flex flex-col"
// // //                   style={{
// // //                     height:
// // //                       "calc(100vh - 140px)",
// // //                   }}
// // //                 >

// // //                   {/* TITLE */}
// // //                   <div className="border-b border-slate-100 px-5 py-4">

// // //                     <h3 className="text-lg font-bold text-slate-900">
// // //                       Conversion settings
// // //                     </h3>
// // //                   </div>

// // //                   <div className="flex-1 space-y-5 p-5">

// // //                     {/* SLIDE SIZE */}
// // //                     <div>

// // //                       <div className="mb-2 flex items-center gap-2">

// // //                         <Ratio className="h-4 w-4 text-slate-400" />

// // //                         <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
// // //                           Slide size
// // //                         </p>
// // //                       </div>

// // //                       <div className="space-y-2">

// // //                         <button
// // //                           onClick={() =>
// // //                             setSlideSize(
// // //                               "widescreen"
// // //                             )
// // //                           }
// // //                           className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// // //                             slideSize ===
// // //                             "widescreen"
// // //                               ? "border-[#f24d0d] bg-orange-50"
// // //                               : "border-slate-200 hover:bg-slate-50"
// // //                           }`}
// // //                         >
// // //                           <p className="text-sm font-semibold text-slate-800">
// // //                             Widescreen (16:9)
// // //                           </p>

// // //                           <p className="mt-1 text-xs text-slate-500">
// // //                             Best for modern presentations
// // //                           </p>
// // //                         </button>

// // //                         <button
// // //                           onClick={() =>
// // //                             setSlideSize(
// // //                               "standard"
// // //                             )
// // //                           }
// // //                           className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// // //                             slideSize ===
// // //                             "standard"
// // //                               ? "border-[#f24d0d] bg-orange-50"
// // //                               : "border-slate-200 hover:bg-slate-50"
// // //                           }`}
// // //                         >
// // //                           <p className="text-sm font-semibold text-slate-800">
// // //                             Standard (4:3)
// // //                           </p>

// // //                           <p className="mt-1 text-xs text-slate-500">
// // //                             Traditional presentation ratio
// // //                           </p>
// // //                         </button>
// // //                       </div>
// // //                     </div>

// // //                     {/* QUALITY */}
// // //                     <div>

// // //                       <div className="mb-2 flex items-center gap-2">

// // //                         <Sparkles className="h-4 w-4 text-slate-400" />

// // //                         <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
// // //                           Quality
// // //                         </p>
// // //                       </div>

// // //                       <div className="space-y-2">

// // //                         <button
// // //                           onClick={() =>
// // //                             setQuality(
// // //                               "normal"
// // //                             )
// // //                           }
// // //                           className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// // //                             quality ===
// // //                             "normal"
// // //                               ? "border-[#f24d0d] bg-orange-50"
// // //                               : "border-slate-200 hover:bg-slate-50"
// // //                           }`}
// // //                         >
// // //                           <p className="text-sm font-semibold text-slate-800">
// // //                             Normal quality
// // //                           </p>

// // //                           <p className="mt-1 text-xs text-slate-500">
// // //                             Faster conversion & smaller file size
// // //                           </p>
// // //                         </button>

// // //                         <button
// // //                           onClick={() =>
// // //                             setQuality(
// // //                               "high"
// // //                             )
// // //                           }
// // //                           className={`w-full rounded-xl border px-4 py-3 text-left transition ${
// // //                             quality ===
// // //                             "high"
// // //                               ? "border-[#f24d0d] bg-orange-50"
// // //                               : "border-slate-200 hover:bg-slate-50"
// // //                           }`}
// // //                         >
// // //                           <p className="text-sm font-semibold text-slate-800">
// // //                             High quality
// // //                           </p>

// // //                           <p className="mt-1 text-xs text-slate-500">
// // //                             Better slide image quality
// // //                           </p>
// // //                         </button>
// // //                       </div>
// // //                     </div>

// // //                     {/* INFO */}
// // //                     <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

// // //                       <div className="flex items-start gap-3">

// // //                         <Layers3 className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />

// // //                         <div>

// // //                           <p className="text-sm font-semibold text-blue-800">
// // //                             Slide conversion
// // //                           </p>

// // //                           <p className="mt-1 text-xs leading-5 text-blue-700">
// // //                             Each page of your PDF will become a separate PowerPoint slide.
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* CTA */}
// // //                   <div className="border-t border-slate-100 p-5">

// // //                     <button
// // //                       type="button"
// // //                       onClick={handleConvert}
// // //                       disabled={!flow.files?.length}
// // //                       className={`w-full rounded-xl px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
// // //                         flow.files?.length
// // //                           ? "bg-[#f24d0d] hover:bg-[#db4309] shadow-lg shadow-orange-200"
// // //                           : "cursor-not-allowed bg-slate-200 text-slate-400"
// // //                       }`}
// // //                     >
// // //                       <span>
// // //                         {flow.files?.length
// // //                           ? "Convert to PPTX"
// // //                           : "Upload PDF first"}
// // //                       </span>

// // //                       {flow.files?.length && (
// // //                         <ArrowRight className="h-5 w-5" />
// // //                       )}
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         }

// // //         uploadLanding={{
// // //           content: {
// // //             eyebrow:
// // //               "PDF TO POWERPOINT",

// // //             heroTitle: (
// // //               <>
// // //                 Convert PDF to <br />
// // //                 <em className="font-bold not-italic text-[#e8420a] sm:italic">
// // //                   PowerPoint online
// // //                 </em>
// // //               </>
// // //             ),

// // //             heroDescription:
// // //               "Convert PDF files into editable PowerPoint presentations online for free. Each PDF page becomes a PPTX slide instantly.",

// // //             noticeTitle:
// // //               "PDF to PPTX features",

// // //             noticeItems: [
// // //               "Convert PDF pages into slides",
// // //               "Widescreen & standard formats",
// // //               "High quality conversion",
// // //             ],

// // //             howToTitle:
// // //               "How to convert PDF to PowerPoint",

// // //             howToSubtitle:
// // //               "Upload your PDF and download editable PowerPoint slides instantly.",

// // //             howToSteps: [
// // //               {
// // //                 n: "1",

// // //                 title:
// // //                   "Upload your PDF",

// // //                 desc:
// // //                   "Select the PDF document you want to convert.",

// // //                 color:
// // //                   "bg-blue-600",
// // //               },

// // //               {
// // //                 n: "2",

// // //                 title:
// // //                   "Choose settings",

// // //                 desc:
// // //                   "Select slide size and quality options.",

// // //                 color:
// // //                   "bg-orange-600",
// // //               },

// // //               {
// // //                 n: "3",

// // //                 title:
// // //                   "Download PPTX",

// // //                 desc:
// // //                   "Download your converted PowerPoint presentation.",

// // //                 color:
// // //                   "bg-emerald-600",
// // //               },
// // //             ],

// // //             whyTitle:
// // //               "Why use PDFLinx PDF to PowerPoint?",

// // //             whyItems: [
// // //               {
// // //                 title:
// // //                   "Fast Conversion",

// // //                 desc:
// // //                   "Convert PDF pages into PPTX slides in seconds.",

// // //                 icon:
// // //                   Presentation,

// // //                 iconColor:
// // //                   "text-orange-600",

// // //                 bgColor:
// // //                   "bg-orange-100",
// // //               },

// // //               {
// // //                 title:
// // //                   "High Quality Slides",

// // //                 desc:
// // //                   "Choose high quality rendering for better presentations.",

// // //                 icon:
// // //                   Sparkles,

// // //                 iconColor:
// // //                   "text-blue-600",

// // //                 bgColor:
// // //                   "bg-blue-100",
// // //               },

// // //               {
// // //                 title:
// // //                   "Works Everywhere",

// // //                 desc:
// // //                   "Compatible with Windows, Mac, Android, iPhone, and tablets.",

// // //                 icon:
// // //                   MonitorSmartphone,

// // //                 iconColor:
// // //                   "text-purple-600",

// // //                 bgColor:
// // //                   "bg-purple-100",
// // //               },

// // //               {
// // //                 title:
// // //                   "Secure Processing",

// // //                 desc:
// // //                   "Files are encrypted during upload and automatically deleted.",

// // //                 icon:
// // //                   Download,

// // //                 iconColor:
// // //                   "text-green-600",

// // //                 bgColor:
// // //                   "bg-green-100",
// // //               },
// // //             ],

// // //             seoBadge:
// // //               "PDF to PPTX Tool",

// // //             seoTitle:
// // //               "Convert PDF to PowerPoint Online Free",

// // //             seoDescription:
// // //               "Convert PDF files into PowerPoint PPTX presentations online for free. Turn each PDF page into editable slides instantly.",

// // //             seoSections: [
// // //               {
// // //                 title:
// // //                   "Convert PDF Pages into Slides",

// // //                 text:
// // //                   "Each page of your PDF becomes a separate PowerPoint slide automatically.",
// // //               },

// // //               {
// // //                 title:
// // //                   "High Quality PowerPoint Conversion",

// // //                 text:
// // //                   "Choose normal or high quality rendering for professional presentations.",
// // //               },

// // //               {
// // //                 title:
// // //                   "Online PDF to PPTX Tool",

// // //                 text:
// // //                   "Convert PDFs into PowerPoint directly in your browser without installing software.",
// // //               },
// // //             ],

// // //             faqTitle:
// // //               "Frequently asked questions",

// // //             faqs: [
// // //               {
// // //                 q:
// // //                   "Can I convert PDF to PowerPoint online?",

// // //                 a:
// // //                   "Yes. PDFLinx lets you convert PDF files into PowerPoint presentations online for free.",
// // //               },

// // //               {
// // //                 q:
// // //                   "Will each PDF page become a slide?",

// // //                 a:
// // //                   "Yes. Each page of your PDF becomes a separate PowerPoint slide.",
// // //               },

// // //               {
// // //                 q:
// // //                   "Can I choose slide format?",

// // //                 a:
// // //                   "Yes. You can select widescreen (16:9) or standard (4:3) slide layouts.",
// // //               },

// // //               {
// // //                 q:
// // //                   "Does PDF to PPTX work on mobile?",

// // //                 a:
// // //                   "Yes. It works on Android, iPhone, tablets, and desktop browsers.",
// // //               },
// // //             ],
// // //           },
// // //         }}
// // //       />

// // //       <RelatedToolsSection />
// // //     </>
// // //   );
// // // }