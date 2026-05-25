"use client";

import { useState, useRef, useEffect } from "react";
import {
  Presentation,
  Download,
  MonitorSmartphone,
  CheckCircle,
  FileText,
  ArrowRight,
  Ratio,
  Sparkles,
  Layers3,
  ShieldCheck,
  X,
} from "lucide-react";
import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

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
                { value: "standard",   label: "Standard (4:3)",    desc: "Traditional presentation ratio" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSlideSize(opt.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    slideSize === opt.value
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
                { value: "high",   label: "High quality",   desc: "Better slide image quality" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    quality === opt.value
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
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${
              hasFiles
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
        id="faq-schema-pdf-to-pptx"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Can I convert PDF to PowerPoint online?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx lets you convert PDF files to editable PowerPoint presentations online for free." } },
              { "@type": "Question", name: "Will each PDF page become a slide?",      acceptedAnswer: { "@type": "Answer", text: "Yes. Each page of your PDF becomes a separate PowerPoint slide." } },
              { "@type": "Question", name: "Does PDF to PPTX work on mobile?",        acceptedAnswer: { "@type": "Answer", text: "Yes. PDF to PowerPoint works on Android, iPhone, tablets, and desktop browsers." } },
            ],
          }),
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

        uploadLanding={{
          content: {
            eyebrow: "PDF TO POWERPOINT",
            heroTitle: (
              <>
                Convert PDF to <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">PowerPoint online</em>
              </>
            ),
            heroDescription:
              "Convert PDF files into editable PowerPoint presentations online for free. Each PDF page becomes a PPTX slide instantly.",
            noticeTitle: "PDF to PPTX features",
            noticeItems: ["Convert PDF pages into slides", "Widescreen & standard formats", "High quality conversion"],
            howToTitle: "How to convert PDF to PowerPoint",
            howToSubtitle: "Upload your PDF and download editable PowerPoint slides instantly.",
            howToSteps: [
              { n: "1", title: "Upload your PDF",  desc: "Select the PDF document you want to convert.", color: "bg-blue-600"    },
              { n: "2", title: "Choose settings",  desc: "Select slide size and quality options.",       color: "bg-orange-600"  },
              { n: "3", title: "Download PPTX",    desc: "Download your converted PowerPoint file.",     color: "bg-emerald-600" },
            ],
            whyTitle: "Why use PDFLinx PDF to PowerPoint?",
            whyItems: [
              { title: "Fast Conversion",     desc: "Convert PDF pages into PPTX slides in seconds.",              icon: Presentation,      iconColor: "text-orange-600", bgColor: "bg-orange-100" },
              { title: "High Quality Slides", desc: "Choose high quality rendering for better presentations.",      icon: Sparkles,          iconColor: "text-blue-600",   bgColor: "bg-blue-100"   },
              { title: "Works Everywhere",    desc: "Compatible with Windows, Mac, Android, iPhone, and tablets.", icon: MonitorSmartphone, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
              { title: "Secure Processing",   desc: "Files are encrypted during upload and automatically deleted.", icon: CheckCircle,       iconColor: "text-green-600",  bgColor: "bg-green-100"  },
            ],
            seoBadge: "PDF to PPTX Tool",
            seoTitle: "Convert PDF to PowerPoint Online Free",
            seoDescription: "Convert PDF files into PowerPoint PPTX presentations online for free. Turn each PDF page into editable slides instantly.",
            seoSections: [
              { title: "Convert PDF Pages into Slides",      text: "Each page of your PDF becomes a separate PowerPoint slide automatically." },
              { title: "High Quality PowerPoint Conversion", text: "Choose normal or high quality rendering for professional presentations."   },
              { title: "Online PDF to PPTX Tool",           text: "Convert PDFs into PowerPoint directly in your browser without installing software." },
            ],
            faqTitle: "Frequently asked questions",
            faqs: [
              { q: "Can I convert PDF to PowerPoint online?", a: "Yes. PDFLinx lets you convert PDF files into PowerPoint presentations online for free." },
              { q: "Will each PDF page become a slide?",      a: "Yes. Each page of your PDF becomes a separate PowerPoint slide."                       },
              { q: "Can I choose slide format?",              a: "Yes. You can select widescreen (16:9) or standard (4:3) slide layouts."                },
              { q: "Does PDF to PPTX work on mobile?",       a: "Yes. It works on Android, iPhone, tablets, and desktop browsers."                      },
            ],
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