"use client";

import { useState, useRef, useEffect } from "react";

import {
  Download,
  CheckCircle,
  MonitorSmartphone,
  ShieldCheck,
  GripVertical,
  Trash2,
  RotateCw,
  Move,
  Layers3,
} from "lucide-react";

import Script from "next/script";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import RelatedToolsSection from "@/components/RelatedTools";

import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";

import {
  DEFAULT_DONE_LINKS,
  DEFAULT_SIDEBAR_FEATURES,
} from "@/lib/toolUiConfig";

function PdfThumbnail({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!url || !window.pdfjsLib) return;

    const tryRender = () => {
      if (!window.pdfjsLib) return setTimeout(tryRender, 100);

      window.pdfjsLib
        .getDocument(url)
        .promise.then((pdf) => pdf.getPage(1))
        .then((page) => {
          const viewport = page.getViewport({ scale: 0.6 });

          const canvas = canvasRef.current;
          if (!canvas) return;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          });
        })
        .catch(console.error);
    };

    tryRender();
  }, [url]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full object-contain bg-white"
    />
  );
}

export default function OrganizePdf() {
  const flow = useToolFlow();

  const {
    progress,
    startProgress,
    completeProgress,
    cancelProgress,
  } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);

    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const moveLeft = (index) => {
    if (index === 0) return;

    const updated = [...flow.files];

    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];

    flow.selectFiles(updated);
  };

  const moveRight = (index) => {
    if (index === flow.files.length - 1) return;

    const updated = [...flow.files];

    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];

    flow.selectFiles(updated);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");

    a.href = downloadUrl;
    a.download = "organized.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();
  };

  const handleConvert = async () => {
    if (!flow.files?.length) return;

    flow.startProcessing();

    startProgress();

    try {
      const formData = new FormData();

      flow.files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/convert/organize-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to organize PDF");
      }

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);

      completeProgress();

      flow.finishSuccess();
    } catch (err) {
      console.error(err);

      cancelProgress();

      flow.handleError("Something went wrong");
    }
  };

  return (
    <>
      {/* ================= SEO ================= */}

      <Script
        id="faq-schema-organize"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Organize PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Organize PDF allows you to rearrange, rotate, and remove PDF pages online before downloading a newly organized PDF file.",
                },
              },
              {
                "@type": "Question",
                name: "Can I rearrange PDF pages online?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Drag, reorder, rotate, and delete PDF pages directly in your browser with no software installation required.",
                },
              },
            ],
          }),
        }}
      />

      {/* ================= UI ================= */}

      <ToolPageLayout
        title="Organize PDF Online"
        tagline="Rearrange · Rotate · Remove PDF Pages"
        accept=".pdf,application/pdf"
        multiple={true}
        convertLabel="Organize PDF"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Organize options"
        processingTitle="Organizing PDF..."
        processingDescription="Rearranging your pages. Please wait."
        processingStages={[
          "Uploading",
          "Organizing pages",
          "Done",
        ]}
        doneTitle="Your organized PDF is ready"
        doneDescription="Download your newly arranged PDF file."
        downloadLabel="Download Organized PDF"
        resetLabel="Organize another PDF"
        sidebarTitle="Organize PDF"
        sidebarIcon={<Layers3 className="h-5 w-5 text-white" />}
        sidebarDescription="Reorder, rotate, and remove PDF pages visually in seconds."
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF supported"

        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

            {/* LEFT SIDE */}

            <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">

              {/* ADD MORE */}

              <div className="absolute right-4 top-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50">
                  + Add PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const newFiles = Array.from(
                        e.target.files || []
                      );

                      if (newFiles.length) {
                        flow.selectFiles([
                          ...flow.files,
                          ...newFiles,
                        ]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* THUMBNAILS */}

              <div className="flex flex-wrap justify-center gap-6 pt-10">

                {flow.files.map((file, i) => (

                  <div
                    key={i}
                    className="group flex w-[170px] flex-col items-center gap-3"
                  >
                    {/* PAGE */}

                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">

                      {/* PDF */}

                      <PdfThumbnail
                        url={URL.createObjectURL(file)}
                      />

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* MOVE HANDLE */}

                      <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white">
                        <GripVertical className="h-4 w-4" />
                      </div>
                    </div>

                    {/* FILE NAME */}

                    <p className="w-full truncate text-center text-xs text-slate-500">
                      {file.name}
                    </p>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => moveLeft(i)}
                        className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-100"
                      >
                        ←
                      </button>

                      <button
                        className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-100"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => moveRight(i)}
                        className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-100"
                      >
                        →
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}

            <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">

              <div className="flex-1 overflow-y-auto p-5 space-y-6">

                <h3 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-800">
                  Organize PDF
                </h3>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-2">
                    <Move className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-slate-800">
                      Rearrange Pages
                    </h4>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Move pages left or right to change their order.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-2">
                    <RotateCw className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-800">
                      Rotate Pages
                    </h4>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Rotate individual pages before downloading.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-slate-800">
                      Remove Pages
                    </h4>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Delete unwanted pages instantly.
                  </p>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ Your PDF stays private
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Files are securely processed and automatically deleted after processing.
                  </p>
                </div>
              </div>

              {/* BUTTON */}

              <div className="border-t border-slate-200 p-4">

                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={!flow.files.length}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${
                    flow.files.length
                      ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  <Layers3 className="h-5 w-5" />
                  Organize PDF
                </button>

              </div>
            </div>
          </div>
        }

        uploadLanding={{
          content: {
            eyebrow: "ORGANIZE PDF",

            heroTitle: (
              <>
                Organize PDF Pages <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  visually online
                </em>
              </>
            ),

            heroDescription:
              "Rearrange, rotate, and remove PDF pages online for free. Organize your PDF visually with drag-and-drop style controls directly in your browser.",

            noticeTitle: "Organize features",

            noticeItems: [
              "Reorder PDF pages",
              "Rotate pages",
              "Remove unwanted pages",
            ],

            howToTitle: "How to organize a PDF",

            howToSubtitle:
              "Upload your PDF, rearrange pages visually, and download your organized PDF instantly.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Select your PDF file from device storage.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Organize pages",
                desc: "Reorder, rotate, or remove pages visually.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download organized PDF",
                desc: "Save your newly arranged PDF instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx Organize PDF?",

            whyItems: [
              {
                title: "Easy Visual Editing",
                desc: "Organize PDF pages visually with simple controls.",
                icon: Layers3,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },

              {
                title: "Fast Processing",
                desc: "Rearrange and download PDFs within seconds.",
                icon: Download,
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },

              {
                title: "Works Everywhere",
                desc: "Compatible with desktop, tablet, and mobile devices.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },

              {
                title: "Private & Secure",
                desc: "Your uploaded files are securely deleted automatically.",
                icon: ShieldCheck,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },

              {
                title: "No Watermark",
                desc: "Your downloaded PDF remains clean and professional.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
            ],
          },
        }}
      />

      <RelatedToolsSection />
    </>
  );
}