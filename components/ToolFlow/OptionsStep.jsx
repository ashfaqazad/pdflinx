"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function OptionsStep({
  files,
  onRemoveFile,
  onAddFiles,
  accept = "",
  multiple = true,
  error = "",
  customFilePreview,
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
                  {(file.type === "application/pdf" || ext === "pdf") && (
                    <div className="h-full w-full overflow-hidden">
                      <iframe
                        src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={file.name}
                        scrolling="no"
                        className="pointer-events-none h-[130%] w-[135%] -translate-x-[14%] -translate-y-[12%] border-0"
                      />
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
