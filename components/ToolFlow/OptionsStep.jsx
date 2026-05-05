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
    <div className="w-full">

      {/* Header */}
      <div className="mb-4 flex justify-end">
        {/* <div>
          <h3 className="text-base font-bold text-slate-900">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Click any file to preview · Options on the right →
          </p>
        </div> */}

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
              className="rounded-lg border border-[#1D9E75] bg-white px-3 py-1.5 text-xs font-bold text-[#1D9E75] hover:bg-emerald-50"
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
                // className="group relative w-[240px] overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
                className="group relative w-[190px] overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"              >
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





















// "use client";

// // import { useRef } from "react";
// // import { FileText, Plus, X } from "lucide-react";

// import { useEffect, useMemo, useRef } from "react";
// import { X } from "lucide-react";
// import DocxPreview from "./DocxPreview";

// function formatBytes(bytes) {
//   if (!bytes || bytes === 0) return "0 KB";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// }

// export default function OptionsStep({
//   files,
//   onRemoveFile,
//   onAddFiles,
//   accept = "",
//   multiple = true,
//   error = "",
//   customFilePreview,
// }) {
//   const fileInputRef = useRef(null);

//   const handleAddClick = () => fileInputRef.current?.click();

//   const fileUrls = useMemo(() => {
//     return files.map((file) => URL.createObjectURL(file));
//   }, [files]);

//   useEffect(() => {
//     return () => {
//       fileUrls.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [fileUrls]);

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     if (newFiles.length && onAddFiles) onAddFiles(newFiles);
//     e.target.value = "";
//   };

//   return (
//     // <div className="w-full max-w-[560px]">
//     // <div className="w-full max-w-[760px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//     <div className="w-full">

//       {/* Header */}
//       <div className="mb-4 flex items-center justify-between gap-3">
//         <div>
//           <h3 className="text-base font-bold text-slate-900">
//             {files.length} file{files.length !== 1 ? "s" : ""} selected
//           </h3>
//           <p className="mt-1 text-xs text-slate-500">
//             Click any file to preview · Options on the right →
//           </p>
//         </div>

//         {onAddFiles && (
//           <>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept={accept}
//               multiple={multiple}
//               className="hidden"
//               onChange={handleFileChange}
//             />

//             <button
//               type="button"
//               onClick={handleAddClick}
//               className="rounded-lg border border-[#1D9E75] bg-white px-3 py-1.5 text-xs font-bold text-[#1D9E75] transition hover:bg-emerald-50"
//             >
//               + Add more
//             </button>
//           </>
//         )}
//       </div>

//       {/* File grid */}
//       {customFilePreview ? (
//         <div>{customFilePreview}</div>
//       ) : (
//         // <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//         // <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//         // <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="flex flex-wrap justify-center gap-4">
//           {files.map((file, i) => (
//             <div
//               key={`${file.name}-${i}`}
//               // className="group relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
//               className="group relative w-[240px] overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
//             >
//               <button
//                 type="button"
//                 onClick={() => onRemoveFile(i)}
//                 className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm transition hover:bg-red-500 hover:text-white"
//                 aria-label="Remove file"
//               >
//                 <X className="h-3.5 w-3.5" />
//               </button>

//               <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-white p-4">
//                 {(() => {
//                   const ext = file.name.split(".").pop().toLowerCase();

//                   // PDF
//                   if (file.type === "application/pdf" || ext === "pdf") {
//                     return (

//                       <div className="h-full w-full overflow-hidden">
//                         <iframe
//                           src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
//                           className="h-[120%] w-[120%] -translate-x-[10%] -translate-y-[10%] border-0"
//                         />
//                       </div>

//                       // <iframe
//                       //   src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
//                       //   title={file.name}
//                       //   className="h-full w-full scale-[1.35] border-0"
//                       // />

//                     );
//                   }

//                   // Image
//                   if (file.type.startsWith("image/")) {
//                     return (
//                       <img
//                         src={fileUrls[i]}
//                         alt={file.name}
//                         className="h-full w-full object-contain"
//                       />
//                     );
//                   }

//                   // DOCX
//                   // if (ext === "docx" || ext === "doc") {
//                     // return <DocxPreview file={file} />;
//                     if (ext === "docx" || ext === "doc") {
//                       return (
//                         <div className="flex h-full w-full items-center justify-center bg-[#f3f4f6]">
//                           <div className="flex flex-col items-center gap-2">
//                             <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
//                               DOCX
//                             </span>

//                             <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-700 text-white text-lg font-bold">
//                               W
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     }
//                   }


//                   // Others
//                   return (
//                     <div className="flex h-full w-full flex-col items-center justify-center gap-2">
//                       <div className="text-4xl font-bold text-slate-400">
//                         {ext.toUpperCase()}
//                       </div>
//                       <p className="text-xs text-slate-500">Preview not available</p>
//                     </div>
//                   );
//                 })()}

//               </div>

//               {/* <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-white p-4">
//                 {file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? (
//                   <iframe
//                     src={`${fileUrls[i]}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
//                     title={file.name}
//                     className="h-full w-full scale-[1.35] border-0"
//                   />
//                 ) : file.type.startsWith("image/") ? (
//                   <img
//                     src={fileUrls[i]}
//                     alt={file.name}
//                     className="h-full w-full object-contain"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
//                     Preview not available
//                   </div>
//                 )}

//                 <span className="absolute bottom-2 right-2 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
//                   PDF
//                 </span>
//               </div> */}


//               {/* <div className="border-t border-slate-100 p-3"> */}
//               <div className="border-t border-slate-100 bg-white px-3 py-2">
//                 <p className="truncate text-xs font-bold text-slate-900">
//                   {file.name}
//                 </p>
//                 <p className="mt-1 text-[11px] font-semibold text-slate-400">
//                   {formatBytes(file.size)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* {onAddFiles && (
//         <button
//           type="button"
//           onClick={handleAddClick}
//           className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 text-xs font-bold text-slate-500 transition hover:border-[#1D9E75] hover:bg-emerald-50"
//         >
//           <Plus className="h-4 w-4" />
//           Drop more files here
//         </button>
//       )} */}


//       {error && (
//         <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
//           ⚠️ {error}
//         </div>
//       )}
//     </div>
//   );
// }





















// // components/ToolFlow/OptionsStep.jsx
// "use client";

// import { useRef } from "react";
// import { FileText, X, Plus, Settings2 } from "lucide-react";

// function formatBytes(bytes) {
//   if (!bytes || bytes === 0) return "0 KB";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// }

// export default function OptionsStep({
//   files,
//   onRemoveFile,
//   onBack,
//   onAddFiles,
//   accept = "",
//   multiple = true,
//   error = "",
//   customFilePreview,

//   // Options panel
//   optionsTitle = "Conversion options",
//   showOutputFormat = false,
//   outputFormatTitle = "Output format",
//   outputFormats = ["DOCX (Recommended)", "DOC"],
//   optionSectionLabel = "",
//   showPreserveLayout = false,
//   preserveLayoutTitle = "Preserve layout",
//   preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",

//   children, // custom options slot
// }) {
//   const fileInputRef = useRef(null);

//   const handleAddClick = () => fileInputRef.current?.click();

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     if (newFiles.length && onAddFiles) onAddFiles(newFiles);
//     e.target.value = "";
//   };

//   const hasOptions = showOutputFormat || children || showPreserveLayout;

//   return (
//     <div className="min-w-0">
//       {/* Header row */}
//       <div className="mb-6 flex items-center justify-between gap-3">
//         <div>
//           <h3 className="text-2xl font-bold text-slate-900">
//             {files.length} file{files.length !== 1 ? "s" : ""} selected
//           </h3>
//           <p className="mt-1 text-sm text-slate-500">
//             Review your files and choose conversion options.
//           </p>
//         </div>

//         {onAddFiles && (
//           <>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept={accept}
//               multiple={multiple}
//               className="hidden"
//               onChange={handleFileChange}
//             />
//             <button
//               type="button"
//               onClick={handleAddClick}
//               className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
//             >
//               <Plus className="h-4 w-4" />
//               Add more
//             </button>
//           </>
//         )}
//       </div>

//       {/* Main grid: files left, options right */}
//       <div className={hasOptions ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]" : ""}>

//         {/* File cards */}
//         <div>
//           {customFilePreview ? (
//             <div>{customFilePreview}</div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
//               {files.map((file, i) => (
//                 <div
//                   key={`${file.name}-${i}`}
//                   className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
//                 >
//                   {/* Remove button */}
//                   <button
//                     type="button"
//                     onClick={() => onRemoveFile(i)}
//                     className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow transition hover:bg-red-500 hover:text-white"
//                     aria-label="Remove file"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>

//                   {/* File thumbnail */}
//                   <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50">
//                     <div className="relative">
//                       <FileText className="h-20 w-20 text-red-400" />
//                       <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">
//                         PDF
//                       </span>
//                     </div>
//                   </div>

//                   <p className="mt-4 truncate text-center text-sm font-semibold text-slate-900">
//                     {file.name}
//                   </p>
//                   <p className="mt-1 text-center text-xs font-semibold text-slate-400">
//                     {formatBytes(file.size)}
//                   </p>

//                   <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
//                     <div className="h-full w-full rounded-full bg-slate-200" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Add more drop zone */}
//           {onAddFiles && (
//             <button
//               type="button"
//               onClick={handleAddClick}
//               className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-5 text-sm font-bold text-slate-500 transition hover:border-[#1a9e6e] hover:bg-green-50/40"
//             >
//               <Plus className="h-4 w-4" />
//               Drop more files here
//             </button>
//           )}
//         </div>

//         {/* Options panel */}
//         {hasOptions && (
//           <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//             <div className="flex items-center gap-2">
//               <Settings2 className="h-5 w-5 text-blue-600" />
//               <h4 className="font-semibold text-slate-900">{optionsTitle}</h4>
//             </div>

//             <div className="mt-5 space-y-4">
//               {showOutputFormat && (
//                 <label className="block rounded-2xl border border-slate-200 bg-white p-4">
//                   <div className="text-sm font-medium text-slate-800">{outputFormatTitle}</div>
//                   <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
//                     {outputFormats.map((fmt) => (
//                       <option key={fmt}>{fmt}</option>
//                     ))}
//                   </select>
//                 </label>
//               )}

//               {children && (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-4">
//                   {optionSectionLabel && (
//                     <div className="mb-3 text-sm font-medium text-slate-800">
//                       {optionSectionLabel}
//                     </div>
//                   )}
//                   {children}
//                 </div>
//               )}

//               {showPreserveLayout && (
//                 <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
//                   <input
//                     type="checkbox"
//                     defaultChecked
//                     className="mt-1 h-4 w-4 accent-blue-600"
//                   />
//                   <div>
//                     <div className="text-sm font-medium text-slate-800">{preserveLayoutTitle}</div>
//                     <div className="mt-0.5 text-xs leading-5 text-slate-500">
//                       {preserveLayoutDescription}
//                     </div>
//                   </div>
//                 </label>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
//           ⚠️ {error}
//         </div>
//       )}
//     </div>
//   );
// }
























// // "use client";

// // import { useRef } from "react";
// // import { FileText, X, ChevronLeft, Plus, Settings2 } from "lucide-react";

// // function formatBytes(bytes) {
// //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// //   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // }

// // export default function OptionsStep({
// //   files,
// //   onRemoveFile,
// //   onBack,
// //   onAddFiles,
// //   accept = "",
// //   multiple = true,
// //   error = "",
// //   customFilePreview,
// //   children,

// //   optionsTitle = "Conversion options",
// //   showOutputFormat = true,
// //   outputFormatTitle = "Output format",
// //   outputFormats = ["DOCX (Recommended)", "DOC"],

// //   optionSectionLabel = "OCR mode",

// //   showPreserveLayout = true,
// //   preserveLayoutTitle = "Preserve layout",
// //   preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",
// // }) {
// //   const fileInputRef = useRef(null);

// //   const handleAddClick = () => fileInputRef.current?.click();

// //   const handleFileChange = (e) => {
// //     const newFiles = Array.from(e.target.files || []);
// //     if (newFiles.length && onAddFiles) onAddFiles(newFiles);
// //     e.target.value = "";
// //   };

// //   const hasOptions =
// //     showOutputFormat || children || showPreserveLayout;

// //   return (
// //     <div className="min-w-0 bg-transparent">
// //       <div className="mb-6 flex items-center justify-between gap-3">
// //         <div>
// //           <h3 className="text-2xl font-bold text-slate-900">
// //             {files.length} file{files.length > 1 ? "s" : ""} selected
// //           </h3>
// //           <p className="mt-1 text-sm text-slate-500">
// //             Review your files and choose conversion options.
// //           </p>
// //         </div>

// //         {onAddFiles && (
// //           <>
// //             <input
// //               ref={fileInputRef}
// //               type="file"
// //               accept={accept}
// //               multiple={multiple}
// //               className="hidden"
// //               onChange={handleFileChange}
// //             />

// //             <button
// //               type="button"
// //               onClick={handleAddClick}
// //               className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
// //             >
// //               <Plus className="h-4 w-4" />
// //               Add more
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       <div className={hasOptions ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" : ""}>
// //         <div>
// //           {customFilePreview ? (
// //             <div>{customFilePreview}</div>
// //           ) : (
// //             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
// //               {files.map((file, i) => (
// //                 <div
// //                   key={`${file.name}-${i}`}
// //                   className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
// //                 >
// //                   <button
// //                     type="button"
// //                     onClick={() => onRemoveFile(i)}
// //                     className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition hover:bg-red-500 hover:text-white"
// //                     aria-label="Remove file"
// //                   >
// //                     <X className="h-4 w-4" />
// //                   </button>

// //                   <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50">
// //                     <div className="relative">
// //                       <FileText className="h-20 w-20 text-red-500" />
// //                       <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold text-white">
// //                         PDF
// //                       </span>
// //                     </div>
// //                   </div>

// //                   <p className="mt-4 truncate text-center text-sm font-semibold text-slate-900">
// //                     {file.name}
// //                   </p>

// //                   <p className="mt-1 text-center text-xs font-semibold text-slate-500">
// //                     {formatBytes(file.size)}
// //                   </p>

// //                   <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
// //                     <div className="h-full w-full rounded-full bg-slate-200" />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}

// //           {onAddFiles && (
// //             <button
// //               type="button"
// //               onClick={handleAddClick}
// //               className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-5 text-sm font-bold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50/40"
// //             >
// //               <Plus className="h-4 w-4" />
// //               Drop more files here
// //             </button>
// //           )}
// //         </div>

// //         {hasOptions && (
// //           <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
// //             <div className="flex items-center gap-2">
// //               <Settings2 className="h-5 w-5 text-blue-600" />
// //               <h4 className="font-semibold text-slate-900">
// //                 {optionsTitle}
// //               </h4>
// //             </div>

// //             <div className="mt-5 space-y-4">
// //               {showOutputFormat && (
// //                 <label className="block rounded-2xl border border-slate-200 bg-white p-4">
// //                   <div className="text-sm font-medium text-slate-800">
// //                     {outputFormatTitle}
// //                   </div>

// //                   <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
// //                     {outputFormats.map((format) => (
// //                       <option key={format}>{format}</option>
// //                     ))}
// //                   </select>
// //                 </label>
// //               )}

// //               {children && (
// //                 <div className="rounded-2xl border border-slate-200 bg-white p-4">
// //                   {optionSectionLabel && (
// //                     <div className="text-sm font-medium text-slate-800">
// //                       {optionSectionLabel}
// //                     </div>
// //                   )}
// //                   <div className="mt-3">{children}</div>
// //                 </div>
// //               )}

// //               {showPreserveLayout && (
// //                 <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
// //                   <input
// //                     type="checkbox"
// //                     defaultChecked
// //                     className="mt-1 accent-blue-600"
// //                   />
// //                   <div>
// //                     <div className="text-sm font-medium text-slate-800">
// //                       {preserveLayoutTitle}
// //                     </div>
// //                     <div className="text-xs leading-5 text-slate-500">
// //                       {preserveLayoutDescription}
// //                     </div>
// //                   </div>
// //                 </label>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {error && (
// //         <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
// //           ⚠️ {error}
// //         </div>
// //       )}

// //       <div className="mt-6 border-t border-slate-100 pt-5">
// //         <button
// //           type="button"
// //           onClick={onBack}
// //           className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// //         >
// //           <ChevronLeft className="h-4 w-4" />
// //           Back
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }



























// // // "use client";

// // // import { useRef } from "react";
// // // import { FileText, X, ChevronLeft, Plus } from "lucide-react";

// // // function formatBytes(bytes) {
// // //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // //   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // }

// // // export default function OptionsStep({
// // //   files,
// // //   onRemoveFile,
// // //   onBack,
// // //   onAddFiles,
// // //   accept = "",
// // //   multiple = true,
// // //   error = "",
// // //   customFilePreview,
// // // }) {
// // //   const fileInputRef = useRef(null);

// // //   const handleAddClick = () => {
// // //     fileInputRef.current?.click();
// // //   };

// // //   const handleFileChange = (e) => {
// // //     const newFiles = Array.from(e.target.files || []);
// // //     if (newFiles.length && onAddFiles) onAddFiles(newFiles);
// // //     e.target.value = "";
// // //   };

// // //   return (
// // //     <div className="min-w-0 bg-transparent">
// // //       {/* Header */}
// // //       <div className="mb-6 flex items-center justify-between gap-3">
// // //         <div>
// // //           <h3 className="text-2xl font-bold text-slate-900">
// // //             {files.length} file{files.length > 1 ? "s" : ""} selected
// // //           </h3>
// // //           <p className="mt-1 text-sm text-slate-500">
// // //             Review your files before conversion.
// // //           </p>
// // //         </div>

// // //         {onAddFiles && (
// // //           <>
// // //             <input
// // //               ref={fileInputRef}
// // //               type="file"
// // //               accept={accept}
// // //               multiple={multiple}
// // //               className="hidden"
// // //               onChange={handleFileChange}
// // //             />

// // //             <button
// // //               type="button"
// // //               onClick={handleAddClick}
// // //               className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
// // //             >
// // //               <Plus className="h-4 w-4" />
// // //               Add more
// // //             </button>
// // //           </>
// // //         )}
// // //       </div>

// // //       {/* Files Preview */}
// // //       {customFilePreview ? (
// // //         <div>{customFilePreview}</div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
// // //           {files.map((file, i) => (
// // //             <div
// // //               key={`${file.name}-${i}`}
// // //               className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
// // //             >
// // //               <button
// // //                 type="button"
// // //                 onClick={() => onRemoveFile(i)}
// // //                 className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition hover:bg-red-500 hover:text-white"
// // //                 aria-label="Remove file"
// // //               >
// // //                 <X className="h-4 w-4" />
// // //               </button>

// // //               <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50">
// // //                 <div className="relative">
// // //                   <FileText className="h-20 w-20 text-red-500" />
// // //                   <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold text-white">
// // //                     PDF
// // //                   </span>
// // //                 </div>
// // //               </div>

// // //               <p className="mt-4 truncate text-center text-sm font-semibold text-slate-900">
// // //                 {file.name}
// // //               </p>

// // //               <p className="mt-1 text-center text-xs font-semibold text-slate-500">
// // //                 {formatBytes(file.size)}
// // //               </p>

// // //               <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
// // //                 <div className="h-full w-full rounded-full bg-slate-200" />
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Drop more files */}
// // //       {onAddFiles && (
// // //         <button
// // //           type="button"
// // //           onClick={handleAddClick}
// // //           className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-5 text-sm font-bold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50/40"
// // //         >
// // //           <Plus className="h-4 w-4" />
// // //           Drop more files here
// // //         </button>
// // //       )}

// // //       {error && (
// // //         <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
// // //           ⚠️ {error}
// // //         </div>
// // //       )}

// // //       {/* Back only */}
// // //       <div className="mt-6 border-t border-slate-100 pt-5">
// // //         <button
// // //           type="button"
// // //           onClick={onBack}
// // //           className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // //         >
// // //           <ChevronLeft className="h-4 w-4" />
// // //           Back
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }


























// // // // "use client";

// // // // import { useRef } from "react";
// // // // import { FileText, X, Settings2, ChevronLeft, Plus } from "lucide-react";

// // // // function formatBytes(bytes) {
// // // //     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // // //     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // // }

// // // // export default function OptionsStep({
// // // //     files,
// // // //     onRemoveFile,
// // // //     onBack,
// // // //     onConvert,
// // // //     onAddFiles,          // ← naya prop: parent se file add karne ka handler
// // // //     accept = "",         // ← file input ke liye
// // // //     multiple = true,
// // // //     convertLabel = "Convert Now",
// // // //     error = "",
// // // //     children,

// // // //     // configurable options
// // // //     optionsTitle = "Conversion options",

// // // //     showOutputFormat = true,
// // // //     outputFormatTitle = "Output format",
// // // //     outputFormats = ["DOCX (Recommended)", "DOC"],

// // // //     optionSectionLabel = "OCR mode",
// // // //     customFilePreview,

// // // //     showPreserveLayout = true,
// // // //     preserveLayoutTitle = "Preserve layout",
// // // //     preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",
// // // // }) {
// // // //     const fileInputRef = useRef(null);

// // // //     const handleAddClick = () => {
// // // //         fileInputRef.current?.click();
// // // //     };

// // // //     const handleFileChange = (e) => {
// // // //         const newFiles = Array.from(e.target.files || []);
// // // //         if (newFiles.length && onAddFiles) {
// // // //             onAddFiles(newFiles);
// // // //         }
// // // //         // reset so same file can be added again
// // // //         e.target.value = "";
// // // //     };

// // // //     return (
// // // //         <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 md:p-8">
// // // //             <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

// // // //                 {/* ── Left: selected files ── */}
// // // //                 <div>
// // // //                     {/* Header row: title + Add More button */}
// // // //                     <div className="flex items-center justify-between gap-3">
// // // //                         <div>
// // // //                             <h3 className="text-2xl font-semibold text-slate-900">
// // // //                                 Your files are ready
// // // //                             </h3>
// // // //                             <p className="mt-1 text-sm text-slate-600">
// // // //                                 Review the selected files and choose options before starting.
// // // //                             </p>
// // // //                         </div>

// // // //                         {/* + Add More Files button */}
// // // //                         {onAddFiles && (
// // // //                             <>
// // // //                                 <input
// // // //                                     ref={fileInputRef}
// // // //                                     type="file"
// // // //                                     accept={accept}
// // // //                                     multiple={multiple}
// // // //                                     className="hidden"
// // // //                                     onChange={handleFileChange}
// // // //                                 />
// // // //                                 <button
// // // //                                     type="button"
// // // //                                     onClick={handleAddClick}
// // // //                                     className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
// // // //                                 >
// // // //                                     <Plus className="h-3.5 w-3.5" />
// // // //                                     Add more
// // // //                                 </button>
// // // //                             </>
// // // //                         )}
// // // //                     </div>

// // // //                     {/* ── Files / Custom Preview ── */}
// // // //                     {customFilePreview ? (
// // // //                         <div className="mt-5">{customFilePreview}</div>
// // // //                     ) : (
// // // //                         <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
// // // //                             {files.map((file, i) => (
// // // //                                 <div
// // // //                                     key={i}
// // // //                                     className="flex w-full min-w-0 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
// // // //                                 >
// // // //                                     <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
// // // //                                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50">
// // // //                                             <FileText className="h-5 w-5 text-red-500" />
// // // //                                         </div>

// // // //                                         <div className="min-w-0 flex-1 overflow-hidden">
// // // //                                             <p className="truncate text-sm font-semibold text-slate-900">
// // // //                                                 {file.name}
// // // //                                             </p>
// // // //                                             <p className="text-xs text-slate-500">
// // // //                                                 {formatBytes(file.size)}
// // // //                                             </p>
// // // //                                         </div>
// // // //                                     </div>

// // // //                                     <button
// // // //                                         type="button"
// // // //                                         onClick={() => onRemoveFile(i)}
// // // //                                         className="ml-3 shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
// // // //                                         aria-label="Remove file"
// // // //                                     >
// // // //                                         <X className="h-4 w-4" />
// // // //                                     </button>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>
// // // //                     )}

// // // //                 </div>

// // // //                 {/* ── Right: options ── */}
// // // //                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
// // // //                     <div className="flex items-center gap-2">
// // // //                         <Settings2 className="h-5 w-5 text-red-500" />
// // // //                         <h4 className="font-semibold text-slate-900">{optionsTitle}</h4>
// // // //                     </div>

// // // //                     <div className="mt-5 space-y-4">
// // // //                         {showOutputFormat && (
// // // //                             <label className="block rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <div className="text-sm font-medium text-slate-800">
// // // //                                     {outputFormatTitle}
// // // //                                 </div>
// // // //                                 <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
// // // //                                     {outputFormats.map((format) => (
// // // //                                         <option key={format}>{format}</option>
// // // //                                     ))}
// // // //                                 </select>
// // // //                             </label>
// // // //                         )}

// // // //                         {/* {children && (
// // // //                             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <div className="text-sm font-medium text-slate-800">
// // // //                                     {optionSectionLabel}
// // // //                                 </div>
// // // //                                 <div className="mt-3">{children}</div>
// // // //                             </div>
// // // //                         )} */}

// // // //                         {children && (
// // // //                             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 {optionSectionLabel && (
// // // //                                     <div className="text-sm font-medium text-slate-800">
// // // //                                         {optionSectionLabel}
// // // //                                     </div>
// // // //                                 )}
// // // //                                 <div className="mt-3">{children}</div>
// // // //                             </div>
// // // //                         )}

// // // //                         {showPreserveLayout && (
// // // //                             <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <input type="checkbox" defaultChecked className="mt-1 accent-red-500" />
// // // //                                 <div>
// // // //                                     <div className="text-sm font-medium text-slate-800">
// // // //                                         {preserveLayoutTitle}
// // // //                                     </div>
// // // //                                     <div className="text-xs leading-5 text-slate-500">
// // // //                                         {preserveLayoutDescription}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             </label>
// // // //                         )}
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {error && (
// // // //                 <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
// // // //                     ⚠️ {error}
// // // //                 </div>
// // // //             )}

// // // //             {/* ── Bottom actions ── */}
// // // //             <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:gap-3">
// // // //                 <button
// // // //                     type="button"
// // // //                     onClick={onBack}
// // // //                     className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // //                 >
// // // //                     <ChevronLeft className="h-4 w-4" />
// // // //                     Back
// // // //                 </button>

// // // //                 <button
// // // //                     type="button"
// // // //                     onClick={onConvert}
// // // //                     disabled={!files.length}
// // // //                     className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition sm:min-w-[180px] ${files.length
// // // //                         ? "bg-red-500 hover:bg-red-600"
// // // //                         : "bg-slate-200 text-slate-400 cursor-not-allowed"
// // // //                         }`}
// // // //                 >
// // // //                     {convertLabel}
// // // //                 </button>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

































// // // // "use client";

// // // // import { FileText, X, Settings2, ChevronLeft } from "lucide-react";

// // // // function formatBytes(bytes) {
// // // //     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // // //     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // // }

// // // // export default function OptionsStep({
// // // //     files,
// // // //     onRemoveFile,
// // // //     onBack,
// // // //     onConvert,
// // // //     convertLabel = "Convert Now",
// // // //     error = "",
// // // //     children,

// // // //     // configurable options
// // // //     optionsTitle = "Conversion options",

// // // //     showOutputFormat = true,
// // // //     outputFormatTitle = "Output format",
// // // //     outputFormats = ["DOCX (Recommended)", "DOC"],

// // // //     optionSectionLabel = "OCR mode",

// // // //     showPreserveLayout = true,
// // // //     preserveLayoutTitle = "Preserve layout",
// // // //     preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",


// // // // }) {
// // // //     return (
// // // //         // <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
// // // //         <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 md:p-8">
// // // //             <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
// // // //                 {/* Left: selected files */}
// // // //                 <div>
// // // //                     <h3 className="text-2xl font-semibold text-slate-900">
// // // //                         Your files are ready
// // // //                     </h3>

// // // //                     <p className="mt-2 text-sm text-slate-600">
// // // //                         Review the selected file and choose options before starting.
// // // //                     </p>

// // // //                     <div className="mt-6 space-y-3">
// // // //                         {files.map((file, i) => (
// // // //                             <div
// // // //                                 key={i}
// // // //                                 className="flex w-full min-w-0 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
// // // //                             >
// // // //                                 {/* {files.map((file, i) => (
// // // //                             <div
// // // //                                 key={i}
// // // //                                 className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
// // // //                             > */}
// // // //                                 {/* <div className="flex min-w-0 items-center gap-3"> */}
// // // //                                 <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
// // // //                                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50">
// // // //                                         <FileText className="h-5 w-5 text-red-500" />
// // // //                                     </div>

// // // //                                     {/* <div className="min-w-0"> */}
// // // //                                     <div className="min-w-0 flex-1 overflow-hidden">

// // // //                                         <p className="block w-full max-w-[180px] truncate text-sm font-semibold text-slate-900 sm:max-w-full">
// // // //                                             {file.name}
// // // //                                         </p>

// // // //                                         {/* <p className="max-w-full truncate text-sm font-semibold text-slate-900">
// // // //                                             {file.name}
// // // //                                         </p> */}

// // // //                                         <p className="text-xs text-slate-500">
// // // //                                             {formatBytes(file.size)}
// // // //                                         </p>
// // // //                                     </div>
// // // //                                 </div>

// // // //                                 <button
// // // //                                     type="button"
// // // //                                     onClick={() => onRemoveFile(i)}
// // // //                                     className="ml-3 shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
// // // //                                     aria-label="Remove file"
// // // //                                 >
// // // //                                     <X className="h-4 w-4" />
// // // //                                 </button>
// // // //                             </div>
// // // //                         ))}
// // // //                     </div>
// // // //                 </div>

// // // //                 {/* Right: options */}
// // // //                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
// // // //                     <div className="flex items-center gap-2">
// // // //                         <Settings2 className="h-5 w-5 text-red-500" />
// // // //                         <h4 className="font-semibold text-slate-900">{optionsTitle}</h4>
// // // //                     </div>

// // // //                     <div className="mt-5 space-y-4">
// // // //                         {showOutputFormat && (
// // // //                             <label className="block rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <div className="text-sm font-medium text-slate-800">
// // // //                                     {outputFormatTitle}
// // // //                                 </div>

// // // //                                 <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
// // // //                                     {outputFormats.map((format) => (
// // // //                                         <option key={format}>{format}</option>
// // // //                                     ))}
// // // //                                 </select>
// // // //                             </label>
// // // //                         )}

// // // //                         {children && (
// // // //                             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <div className="text-sm font-medium text-slate-800">
// // // //                                     {optionSectionLabel}
// // // //                                 </div>

// // // //                                 <div className="mt-3">{children}</div>
// // // //                             </div>
// // // //                         )}

// // // //                         {showPreserveLayout && (
// // // //                             <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
// // // //                                 <input type="checkbox" defaultChecked className="mt-1 accent-red-500" />
// // // //                                 <div>
// // // //                                     <div className="text-sm font-medium text-slate-800">
// // // //                                         {preserveLayoutTitle}
// // // //                                     </div>
// // // //                                     <div className="text-xs leading-5 text-slate-500">
// // // //                                         {preserveLayoutDescription}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             </label>
// // // //                         )}
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {error && (
// // // //                 <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
// // // //                     ⚠️ {error}
// // // //                 </div>
// // // //             )}

// // // //             {/* Bottom actions */}
// // // //             <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:gap-3">
// // // //                 <button
// // // //                     type="button"
// // // //                     onClick={onBack}
// // // //                     className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // //                 >
// // // //                     <ChevronLeft className="h-4 w-4" />
// // // //                     Back
// // // //                 </button>

// // // //                 <button
// // // //                     type="button"
// // // //                     onClick={onConvert}
// // // //                     disabled={!files.length}
// // // //                     className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition sm:min-w-[180px] ${files.length
// // // //                         ? "bg-red-500 hover:bg-red-600"
// // // //                         : "bg-slate-200 text-slate-400 cursor-not-allowed"
// // // //                         }`}
// // // //                 >
// // // //                     {convertLabel}
// // // //                 </button>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }


























// // // // // components/ToolFlow/OptionsStep.jsx
// // // // // "use client";

// // // // // import { FileText, X, Settings2, ChevronLeft } from "lucide-react";

// // // // // function formatBytes(bytes) {
// // // // //     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // // // //     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // // // }

// // // // // export default function OptionsStep({
// // // // //     files,
// // // // //     onRemoveFile,
// // // // //     onBack,
// // // // //     onConvert,
// // // // //     convertLabel = "Convert Now",
// // // // //     error = "",
// // // // //     children,
// // // // // }) {
// // // // //     return (
// // // // //         <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
// // // // //             <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
// // // // //                 {/* Left: selected files */}
// // // // //                 <div>
// // // // //                     <h3 className="text-2xl font-semibold text-slate-900">
// // // // //                         Your files are ready
// // // // //                     </h3>
// // // // //                     <p className="mt-2 text-sm text-slate-600">
// // // // //                         Review the selected file and choose conversion options before starting.
// // // // //                     </p>

// // // // //                     <div className="mt-6 space-y-3">
// // // // //                         {files.map((file, i) => (
// // // // //                             <div
// // // // //                                 key={i}
// // // // //                                 className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
// // // // //                             >
// // // // //                                 <div className="flex min-w-0 items-center gap-3">
// // // // //                                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50">
// // // // //                                         <FileText className="h-5 w-5 text-red-500" />
// // // // //                                     </div>

// // // // //                                     <div className="min-w-0">
// // // // //                                         <p className="truncate text-sm font-semibold text-slate-900">
// // // // //                                             {file.name}
// // // // //                                         </p>
// // // // //                                         <p className="text-xs text-slate-500">
// // // // //                                             {formatBytes(file.size)}
// // // // //                                         </p>
// // // // //                                     </div>
// // // // //                                 </div>

// // // // //                                 <button
// // // // //                                     type="button"
// // // // //                                     onClick={() => onRemoveFile(i)}
// // // // //                                     className="ml-3 shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
// // // // //                                     aria-label="Remove file"
// // // // //                                 >
// // // // //                                     <X className="h-4 w-4" />
// // // // //                                 </button>
// // // // //                             </div>
// // // // //                         ))}
// // // // //                     </div>
// // // // //                 </div>

// // // // //                 {/* Right: options */}
// // // // //                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
// // // // //                     <div className="flex items-center gap-2">
// // // // //                         <Settings2 className="h-5 w-5 text-red-500" />
// // // // //                         <h4 className="font-semibold text-slate-900">Conversion options</h4>
// // // // //                     </div>

// // // // //                     <div className="mt-5 space-y-4">
// // // // //                         <label className="block rounded-2xl border border-slate-200 bg-white p-4">
// // // // //                             <div className="text-sm font-medium text-slate-800">
// // // // //                                 Output format
// // // // //                             </div>
// // // // //                             <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
// // // // //                                 <option>DOCX (Recommended)</option>
// // // // //                                 <option>DOC</option>
// // // // //                             </select>
// // // // //                         </label>

// // // // //                         <div className="rounded-2xl border border-slate-200 bg-white p-4">
// // // // //                             <div className="text-sm font-medium text-slate-800">
// // // // //                                 OCR mode
// // // // //                             </div>

// // // // //                             <div className="mt-3">
// // // // //                                 {children}
// // // // //                             </div>
// // // // //                         </div>

// // // // //                         <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
// // // // //                             <input type="checkbox" defaultChecked className="mt-1 accent-red-500" />
// // // // //                             <div>
// // // // //                                 <div className="text-sm font-medium text-slate-800">
// // // // //                                     Preserve layout
// // // // //                                 </div>
// // // // //                                 <div className="text-xs leading-5 text-slate-500">
// // // // //                                     Keep headings, paragraphs, and basic spacing where possible.
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </label>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {error && (
// // // // //                 <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
// // // // //                     ⚠️ {error}
// // // // //                 </div>
// // // // //             )}

// // // // //             {/* Bottom actions */}
// // // // //             {/* <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"> */}
// // // // //             <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:gap-3">

// // // // //                 <button
// // // // //                     type="button"
// // // // //                     onClick={onBack}
// // // // //                     className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // // //                 >
// // // // //                     <ChevronLeft className="h-4 w-4" />
// // // // //                     Back
// // // // //                 </button>

// // // // //                 <button
// // // // //                     type="button"
// // // // //                     onClick={onConvert}
// // // // //                     disabled={!files.length}
// // // // //                     className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition sm:min-w-[180px] ${files.length
// // // // //                         ? "bg-red-500 hover:bg-red-600"
// // // // //                         : "bg-slate-200 text-slate-400 cursor-not-allowed"
// // // // //                         }`}
// // // // //                 >
// // // // //                     {convertLabel}
// // // // //                 </button>
// // // // //             </div>

// // // // //         </div>
// // // // //     );
// // // // // }





















// // // // // // components/ToolFlow/OptionsStep.jsx
// // // // // "use client";
// // // // // import { FileText, X } from "lucide-react";

// // // // // function formatBytes(bytes) {
// // // // //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // // // //   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // // // }

// // // // // export default function OptionsStep({
// // // // //   files,
// // // // //   onRemoveFile,
// // // // //   onBack,
// // // // //   onConvert,
// // // // //   convertLabel = "Convert Now",
// // // // //   error = "",
// // // // //   children, // tool-specific options
// // // // // }) {
// // // // //   return (
// // // // //     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
// // // // //       <div className="p-8 space-y-5">

// // // // //         {/* File List */}
// // // // //         <p className="text-sm font-medium text-gray-500">Selected files</p>
// // // // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // // // //           {/* <p className="text-sm font-medium text-gray-500">Selected files</p> */}
// // // // //           {files.map((file, i) => (
// // // // //             <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
// // // // //               <div className="flex items-center gap-3 min-w-0">
// // // // //                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
// // // // //                   <FileText className="h-5 w-5 text-blue-500" />
// // // // //                 </div>
// // // // //                 <div className="min-w-0">
// // // // //                   <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
// // // // //                   <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
// // // // //                 </div>
// // // // //               </div>
// // // // //               <button
// // // // //                 onClick={() => onRemoveFile(i)}
// // // // //                 className="ml-3 text-gray-300 hover:text-red-400 transition flex-shrink-0"
// // // // //               >
// // // // //                 <X className="w-4 h-4" />
// // // // //               </button>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>

// // // // //         {/* Tool-specific options — passed as children */}
// // // // //         {children && (
// // // // //           <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
// // // // //             <p className="text-sm font-medium text-gray-500">Options</p>
// // // // //             {children}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Error */}
// // // // //         {error && (
// // // // //           <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
// // // // //             ⚠️ {error}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Actions */}
// // // // //         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
// // // // //           <button
// // // // //             onClick={onBack}
// // // // //             className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition sm:w-auto w-full"
// // // // //           >
// // // // //             ← Back
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={onConvert}
// // // // //             disabled={!files.length}
// // // // //             className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm flex-1 ${
// // // // //               files.length
// // // // //                 ? "bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 hover:shadow-md active:scale-[0.98]"
// // // // //                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
// // // // //             }`}
// // // // //           >
// // // // //             {convertLabel}
// // // // //           </button>
// // // // //         </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }