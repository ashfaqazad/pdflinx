"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}



// function PdfThumbnail({ url }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!url) return;

//     // pdfjsLib load hone ka wait karo
//     const renderPdf = () => {
//       if (!window.pdfjsLib) return;
      
//       window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//         "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

//       window.pdfjsLib.getDocument(url).promise.then((pdf) => {
//         pdf.getPage(1).then((page) => {
//           const viewport = page.getViewport({ scale: 0.5 });
//           const canvas = canvasRef.current;
//           if (!canvas) return;
//           const ctx = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           ctx.fillStyle = "#ffffff";
//           ctx.fillRect(0, 0, canvas.width, canvas.height);
//           page.render({ canvasContext: ctx, viewport });
//         });
//       });
//     };

//     // Agar pdfjsLib abhi available nahi — interval se check karo
//     if (window.pdfjsLib) {
//       renderPdf();
//     } else {
//       const interval = setInterval(() => {
//         if (window.pdfjsLib) {
//           clearInterval(interval);
//           renderPdf();
//         }
//       }, 100);
//       return () => clearInterval(interval);
//     }
//   }, [url]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-full object-contain bg-white"
//     />
//   );
// }

function PdfThumbnail({ file }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const render = async () => {
      try {
        // file ko ArrayBuffer mein convert karo — URL se zyada fast
        const buffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (e) {
        console.error("PDF render error:", e);
      }
    };

    const tryRender = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        render();
      } else {
        setTimeout(tryRender, 100);
      }
    };

    tryRender();
    return () => { cancelled = true; };
  }, [file]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain bg-white"
    />
  );
}



export default function OptionsStep({
  files,
  onRemoveFile,
  onAddFiles,
  accept = "",
  multiple = true,
  error = "",
  customFilePreview,
  // 🔥 ADD THIS
  customOptionsLayout,

}) {
  const fileInputRef = useRef(null);

  const handleAddClick = () => fileInputRef.current?.click();

  const fileUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length && onAddFiles) onAddFiles(newFiles);
    e.target.value = "";
  };

  // 🔥 EXACT YAHAN
  if (customOptionsLayout) {
    return customOptionsLayout;
  }


  return (
    // <div className="w-full">
    <div className="w-full animate-options-in">

      {/* Header */}
      <div className="mb-4 flex justify-end">

        {onAddFiles && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={handleAddClick}
              // className="rounded-lg border border-[#1D9E75] bg-white px-3 py-1.5 text-xs font-bold text-[#1D9E75] hover:bg-emerald-50"
              className="animate-addmore-in rounded-lg border border-[#1D9E75] bg-white px-3 py-1.5 text-xs font-bold text-[#1D9E75] transition hover:bg-emerald-50"
            >
              + Add more
            </button>
          </>
        )}
      </div>

      {/* File grid */}
      {customFilePreview ? (
        <div>{customFilePreview}</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {files.map((file, i) => {
            const ext = file.name.split(".").pop().toLowerCase();

            return (
              <div
                key={`${file.name}-${i}`}
                className="animate-filecard-in group relative w-[190px] overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              // className="group relative w-[190px] overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveFile(i)}
                  className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm hover:bg-red-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Preview */}
                {/* <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-white p-4"> */}
                <div className="relative flex h-[170px] items-center justify-center overflow-hidden bg-white p-3">

                  {/* PDF */}
                  {/* {(file.type === "application/pdf" || ext === "pdf") && (
                    <div className="h-full w-full overflow-hidden">
                      <iframe
                        src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={file.name}
                        scrolling="no"
                        className="pointer-events-none h-[130%] w-[135%] -translate-x-[14%] -translate-y-[12%] border-0 bg-white"
                        style={{ backgroundColor: "#ffffff", colorScheme: "light" }}
                      /> */}
                  {/* <iframe
                        src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={file.name}
                        scrolling="no"
                        className="pointer-events-none h-[130%] w-[135%] -translate-x-[14%] -translate-y-[12%] border-0"
                      /> */}
                  {/* </div>
                  )} */}

                  {(file.type === "application/pdf" || ext === "pdf") && (
                    <div className="h-full w-full overflow-hidden bg-white">
                      <PdfThumbnail file={file} />
                      {/* <PdfThumbnail url={fileUrls[i]} /> */}
                    </div>
                  )}

                  {/* Image */}
                  {file.type.startsWith("image/") && (
                    <img
                      src={fileUrls[i]}
                      alt={file.name}
                      className="h-full w-full object-contain"
                    />
                  )}

                  {/* DOC / DOCX */}

                  {(ext === "docx" || ext === "doc") && (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50">

                      <div className="flex flex-col items-center justify-center gap-1">

                        {/* Badge */}
                        <span className="rounded bg-[#0D47A1] px-1.5 py-[2px] text-[8px] font-bold text-white leading-none">
                          DOCX
                        </span>

                        {/* Icon */}
                        <img
                          src="/icons/docx.svg"
                          alt="DOCX"
                          className="h-8 w-8 object-contain"
                        />

                      </div>

                    </div>
                  )}

                  {/* XLS / XLSX block */}

                  {(ext === "xlsx" || ext === "xls") && (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="rounded bg-[#107C41] px-1.5 py-[2px] text-[8px] font-bold leading-none text-white">
                          XLSX
                        </span>

                        <img
                          src="/icons/excel.svg"
                          alt="XLSX"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* PPT / PPTX block */}
                  {(ext === "pptx" || ext === "ppt") && (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="rounded bg-[#D24726] px-1.5 py-[2px] text-[8px] font-bold leading-none text-white">
                          PPTX
                        </span>

                        <img
                          src="/icons/ppt.svg"
                          alt="PPTX"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    </div>
                  )}



                  {/* Others */}
                  {!(
                    file.type === "application/pdf" ||
                    file.type.startsWith("image/") ||
                    ext === "docx" ||
                    ext === "doc" ||
                    ext === "xlsx" ||
                    ext === "xls" ||
                    ext === "pptx" ||
                    ext === "ppt") && (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <div className="text-4xl font-bold text-slate-400">
                          {ext.toUpperCase()}
                        </div>
                        <p className="text-xs text-slate-500">
                          Preview not available
                        </p>
                      </div>
                    )}
                </div>

                {/* File info */}
                <div className="border-t border-slate-100 bg-white px-3 py-2">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {file.name}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
