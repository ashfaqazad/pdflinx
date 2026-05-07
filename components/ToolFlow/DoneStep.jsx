// components/ToolFlow/DoneStep.jsx
"use client";

import { Check, Download } from "lucide-react";

export default function DoneStep({
  title = "Conversion complete!",
  description = "Your file is ready to download.",
  downloadLabel = "Download File",
  resetLabel = "Convert another file",
  onDownload,
  onReset,
  relatedLinks = [],
}) {
  return (
    <div className="animate-done-in mx-auto -mt-10 w-full max-w-[760px] rounded-[20px] border border-black/10 bg-white px-8 py-14 text-center shadow-sm">
      <div className="animate-success-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edfaf3]">
        <Check className="h-10 w-10 text-black" strokeWidth={2.4} />
      </div>

      <h3 className="animate-done-text mt-7 font-display text-[30px] font-normal leading-tight text-[#0f0e0d]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#7a7772]">{description}</p>

      <div className="mx-auto mt-8 w-full max-w-[380px] overflow-hidden rounded-xl border border-black/10 bg-white">
        <button
          type="button"
          onClick={onDownload}
          // className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f24d0d] px-6 py-4 text-sm font-bold text-white shadow-2xl transition hover:bg-[#dc4308] hover:shadow-orange-300 active:scale-[0.98]"
          className="animate-download-pop flex w-full items-center justify-center gap-2 rounded-xl bg-[#f24d0d] px-6 py-4 text-sm font-bold text-white shadow-2xl transition hover:bg-[#dc4308] hover:shadow-orange-300 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          {downloadLabel}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full bg-white px-6 py-3.5 text-sm font-medium text-[#0f0e0d] transition hover:bg-[#f5f4f1]"
        >
          ↩ {resetLabel}
        </button>
      </div>

      {relatedLinks.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {relatedLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium text-[#3a3835] transition hover:border-[#e8420a] hover:text-[#e8420a]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

























// // components/ToolFlow/DoneStep.jsx
// "use client";

// import { Check, FileText, Download } from "lucide-react";

// function formatBytes(bytes) {
//   if (!bytes || bytes === 0) return "0 KB";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// }

// function CompressionCircle({ percent }) {
//   const radius = 36;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (percent / 100) * circumference;

//   return (
//     <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
//       <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
//       <circle
//         cx="48"
//         cy="48"
//         r={radius}
//         fill="none"
//         stroke="#16a34a"
//         strokeWidth="8"
//         strokeLinecap="round"
//         strokeDasharray={circumference}
//         strokeDashoffset={offset}
//         style={{ transition: "stroke-dashoffset 0.6s ease" }}
//       />
//     </svg>
//   );
// }

// export default function DoneStep({
//   fileCount = 1,
//   fileName = "Converted-file.docx",
//   title = "Conversion complete!",
//   description = "Your files are ready to download.",
//   downloadLabel = "Download File",
//   resetLabel = "Convert another file",
//   onDownload,
//   onReset,
//   compressionStats = null,
//   relatedLinks = [],
// }) {
//   let savedPercent = 0;
//   let originalLabel = "";
//   let compressedLabel = "";

//   if (compressionStats?.originalSize && compressionStats?.compressedSize) {
//     const { originalSize, compressedSize } = compressionStats;
//     savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);
//     savedPercent = Math.max(0, Math.min(99, savedPercent));
//     originalLabel = formatBytes(originalSize);
//     compressedLabel = formatBytes(compressedSize);
//   }

//   return (
//     // <div className="flex flex-col items-center py-10 text-center">
//     <div className="flex w-full flex-col items-center pb-10 text-center">
//       {/* Success icon */}
//       <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
//         <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
//       </div>

//       {/* Title */}
//       <h3 className="mt-5 text-2xl font-bold text-slate-900">{title}</h3>
//       <p className="mt-2 text-sm text-slate-500">{description}</p>

//       {/* Compression stats (optional) */}
//       {compressionStats && savedPercent > 0 && (
//         <div className="mt-6 flex items-center gap-5 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
//           <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
//             <CompressionCircle percent={savedPercent} />
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-lg font-bold text-green-600">{savedPercent}%</span>
//               <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//                 saved
//               </span>
//             </div>
//           </div>
//           <div className="text-left">
//             <p className="text-sm font-semibold text-slate-800">
//               Your PDF is now {savedPercent}% smaller!
//             </p>
//             <p className="mt-1 text-sm text-slate-500">
//               {originalLabel}
//               <span className="mx-2 text-slate-300">→</span>
//               <span className="font-semibold text-slate-800">{compressedLabel}</span>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
//         <button
//           type="button"
//           onClick={onDownload}
//           className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a9e6e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:bg-[#158a5e] active:scale-95"
//         >
//           <Download className="h-4 w-4" />
//           {downloadLabel}
//         </button>

//         <button
//           type="button"
//           onClick={onReset}
//           className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//         >
//           {resetLabel}
//         </button>
//       </div>

//       {/* Related tool links */}
//       {relatedLinks.length > 0 && (
//         <div className="mt-6 flex flex-wrap justify-center gap-2">
//           {relatedLinks.map((link, i) => (
//             <a
//               key={i}
//               href={link.href}
//               className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
//             >
//               {link.label}
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
























// // // components/ToolFlow/DoneStep.jsx
// // "use client";

// // import { FileText } from "lucide-react";

// // function formatBytes(bytes) {
// //   if (!bytes || bytes === 0) return "0 KB";
// //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// //   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // }

// // function CompressionCircle({ percent }) {
// //   const radius = 36;
// //   const circumference = 2 * Math.PI * radius;
// //   const offset = circumference - (percent / 100) * circumference;

// //   return (
// //     <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
// //       <circle
// //         cx="48"
// //         cy="48"
// //         r={radius}
// //         fill="none"
// //         stroke="#e2e8f0"
// //         strokeWidth="8"
// //       />
// //       <circle
// //         cx="48"
// //         cy="48"
// //         r={radius}
// //         fill="none"
// //         stroke="#16a34a"
// //         strokeWidth="8"
// //         strokeLinecap="round"
// //         strokeDasharray={circumference}
// //         strokeDashoffset={offset}
// //         style={{ transition: "stroke-dashoffset 0.6s ease" }}
// //       />
// //     </svg>
// //   );
// // }

// // export default function DoneStep({
// //   fileCount = 1,
// //   fileName = "Converted-file.docx",
// //   compressionStats = null,
// // }) {
// //   let savedPercent = 0;
// //   let originalLabel = "";
// //   let compressedLabel = "";

// //   if (compressionStats?.originalSize && compressionStats?.compressedSize) {
// //     const { originalSize, compressedSize } = compressionStats;
// //     savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);
// //     savedPercent = Math.max(0, Math.min(99, savedPercent));
// //     originalLabel = formatBytes(originalSize);
// //     compressedLabel = formatBytes(compressedSize);
// //   }

// //   return (
// //     <div className="min-w-0 bg-transparent">
// //       <div className="mb-6">
// //         <h3 className="text-2xl font-bold text-slate-900">
// //           {fileCount} file{fileCount > 1 ? "s" : ""} converted
// //         </h3>
// //         <p className="mt-1 text-sm text-slate-500">
// //           Your file is ready to download.
// //         </p>
// //       </div>

// //       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
// //         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
// //           <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50">
// //             <div className="relative">
// //               <FileText className="h-20 w-20 text-blue-500" />
// //               <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold text-white">
// //                 FILE
// //               </span>
// //             </div>
// //           </div>

// //           <p className="mt-4 truncate text-center text-sm font-semibold text-slate-900">
// //             {fileName}
// //           </p>

// //           <p className="mt-1 text-center text-xs font-semibold text-slate-500">
// //             Ready to download
// //           </p>

// //           <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
// //             <div className="h-full w-full rounded-full bg-green-500" />
// //           </div>
// //         </div>
// //       </div>

// //       {compressionStats && savedPercent > 0 && (
// //         <div className="mt-6 flex max-w-xl items-center gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
// //           <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
// //             <CompressionCircle percent={savedPercent} />
// //             <div className="absolute inset-0 flex flex-col items-center justify-center">
// //               <span className="text-lg font-bold text-green-600">
// //                 {savedPercent}%
// //               </span>
// //               <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
// //                 saved
// //               </span>
// //             </div>
// //           </div>

// //           <div>
// //             <p className="text-sm font-semibold text-slate-800">
// //               Your PDF is now {savedPercent}% smaller!
// //             </p>
// //             <p className="mt-1 text-sm text-slate-500">
// //               {originalLabel}
// //               <span className="mx-2 text-slate-300">→</span>
// //               <span className="font-semibold text-slate-800">
// //                 {compressedLabel}
// //               </span>
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
























// // // // components/ToolFlow/DoneStep.jsx
// // // "use client";

// // // import { FileText } from "lucide-react";

// // // export default function DoneStep({
// // //   fileCount = 1,
// // //   fileName = "Converted-file.docx",
// // // }) {
// // //   return (
// // //     <div className="min-w-0 bg-transparent">
// // //       <div className="mb-6">
// // //         <h3 className="text-2xl font-bold text-slate-900">
// // //           {fileCount} file{fileCount > 1 ? "s" : ""} converted
// // //         </h3>
// // //         <p className="mt-1 text-sm text-slate-500">
// // //           Your file is ready to download.
// // //         </p>
// // //       </div>

// // //       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
// // //         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
// // //           <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50">
// // //             <div className="relative">
// // //               <FileText className="h-20 w-20 text-blue-500" />
// // //               <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold text-white">
// // //                 FILE
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <p className="mt-4 truncate text-center text-sm font-semibold text-slate-900">
// // //             {fileName}
// // //           </p>

// // //           <p className="mt-1 text-center text-xs font-semibold text-slate-500">
// // //             Ready to download
// // //           </p>

// // //           <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
// // //             <div className="h-full w-full rounded-full bg-green-500" />
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }





















// // // // // components/ToolFlow/DoneStep.jsx
// // // // "use client";

// // // // import { Check, FileText, Download } from "lucide-react";

// // // // function formatBytes(bytes) {
// // // //   if (!bytes || bytes === 0) return "0 KB";
// // // //   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
// // // //   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// // // // }

// // // // // SVG circular progress — iLovePDF style
// // // // function CompressionCircle({ percent }) {
// // // //   const radius = 36;
// // // //   const circumference = 2 * Math.PI * radius;
// // // //   const offset = circumference - (percent / 100) * circumference;

// // // //   return (
// // // //     <svg width="96" height="96" viewBox="0 0 96 96" className="rotate-[-90deg]">
// // // //       {/* Background track */}
// // // //       <circle
// // // //         cx="48" cy="48" r={radius}
// // // //         fill="none"
// // // //         stroke="#e2e8f0"
// // // //         strokeWidth="8"
// // // //       />
// // // //       {/* Progress arc */}
// // // //       <circle
// // // //         cx="48" cy="48" r={radius}
// // // //         fill="none"
// // // //         stroke="#ef4444"
// // // //         strokeWidth="8"
// // // //         strokeLinecap="round"
// // // //         strokeDasharray={circumference}
// // // //         strokeDashoffset={offset}
// // // //         style={{ transition: "stroke-dashoffset 0.6s ease" }}
// // // //       />
// // // //     </svg>
// // // //   );
// // // // }

// // // // export default function DoneStep({
// // // //   fileCount = 1,
// // // //   onReset,
// // // //   onDownload,
// // // //   relatedLinks = [],
// // // //   compressionStats = null, // { originalSize, compressedSize } — only for compress tool

// // // //   title = "Your file is ready",
// // // //   description = "The converted Word document has been generated successfully.",
// // // //   fileName = "Converted-file.docx",
// // // //   downloadLabel = "Download Word",
// // // //   resetLabel = "Convert another file",
// // // // }) {
// // // //   // Compression stats calculation
// // // //   let savedPercent = 0;
// // // //   let originalLabel = "";
// // // //   let compressedLabel = "";

// // // //   if (compressionStats?.originalSize && compressionStats?.compressedSize) {
// // // //     const { originalSize, compressedSize } = compressionStats;
// // // //     savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);
// // // //     savedPercent = Math.max(0, Math.min(99, savedPercent));
// // // //     originalLabel = formatBytes(originalSize);
// // // //     compressedLabel = formatBytes(compressedSize);
// // // //   }

// // // //   return (
// // // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
// // // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
// // // //           <Check className="h-10 w-10 text-green-600" />
// // // //         </div>

// // // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // // //           {title}
// // // //         </h3>

// // // //         <p className="mt-2 text-sm text-slate-600">
// // // //           {description}
// // // //         </p>

// // // //         <div className="mt-8 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
// // // //           <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
// // // //             <div className="flex min-w-0 items-center gap-3">
// // // //               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
// // // //                 <FileText className="h-5 w-5 text-blue-500" />
// // // //               </div>
// // // //               <div className="min-w-0 text-left">
// // // //                 <p className="truncate text-sm font-semibold text-slate-900">
// // // //                   {fileName}
// // // //                 </p>
// // // //                 <p className="text-xs text-slate-500">
// // // //                   Ready to download • {fileCount} file{fileCount > 1 ? "s" : ""}
// // // //                 </p>
// // // //               </div>
// // // //             </div>
// // // //             <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
// // // //               Completed
// // // //             </span>
// // // //           </div>

// // // //           {/* ── Compression Stats — sirf compress tool ke liye ── */}
// // // //           {compressionStats && savedPercent > 0 && (
// // // //             <div className="mt-4 flex items-center justify-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4">
// // // //               {/* SVG Circle */}
// // // //               <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
// // // //                 <CompressionCircle percent={savedPercent} />
// // // //                 <div className="absolute inset-0 flex flex-col items-center justify-center">
// // // //                   <span className="text-lg font-bold text-red-500">{savedPercent}%</span>
// // // //                   <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">saved</span>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Size info */}
// // // //               <div className="text-left">
// // // //                 <p className="text-sm font-semibold text-slate-700">
// // // //                   Your PDF is now {savedPercent}% smaller!
// // // //                 </p>
// // // //                 <p className="mt-1 text-sm text-slate-500">
// // // //                   {originalLabel}
// // // //                   <span className="mx-2 text-slate-300">→</span>
// // // //                   <span className="font-semibold text-slate-700">{compressedLabel}</span>
// // // //                 </p>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Actions */}
// // // //         <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
// // // //           <button
// // // //             type="button"
// // // //             onClick={onDownload}
// // // //             className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
// // // //           >
// // // //             <Download className="h-4 w-4" />
// // // //             {downloadLabel}
// // // //           </button>

// // // //           <button
// // // //             type="button"
// // // //             onClick={onReset}
// // // //             className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // //           >
// // // //             {resetLabel}
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

























// // // // // components/ToolFlow/DoneStep.jsx
// // // // "use client";

// // // // import { Check, FileText, Download } from "lucide-react";

// // // // export default function DoneStep({
// // // //   fileCount = 1,
// // // //   onReset,
// // // //   onDownload,
// // // //   relatedLinks = [],

// // // //   title = "Your file is ready",
// // // //   description = "The converted Word document has been generated successfully.",
// // // //   fileName = "Converted-file.docx",
// // // //   downloadLabel = "Download Word",
// // // //   resetLabel = "Convert another file",
// // // // }) {
// // // //   return (
// // // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
// // // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
// // // //           <Check className="h-10 w-10 text-green-600" />
// // // //         </div>

// // // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // // //           {title}
// // // //         </h3>

// // // //         <p className="mt-2 text-sm text-slate-600">
// // // //           {description}
// // // //         </p>

// // // //         <div className="mt-8 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
// // // //           <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
// // // //             <div className="flex min-w-0 items-center gap-3">
// // // //               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
// // // //                 <FileText className="h-5 w-5 text-blue-500" />
// // // //               </div>

// // // //               <div className="min-w-0 text-left">
// // // //                 <p className="truncate text-sm font-semibold text-slate-900">
// // // //                   {fileName}
// // // //                 </p>
// // // //                 <p className="text-xs text-slate-500">
// // // //                   Ready to download • {fileCount} file{fileCount > 1 ? "s" : ""}
// // // //                 </p>
// // // //               </div>
// // // //             </div>

// // // //             <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
// // // //               Completed
// // // //             </span>
// // // //           </div>
// // // //         </div>

// // // //         {/* Actions */}
// // // //         <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
// // // //           {/* Download */}
// // // //           <button
// // // //             type="button"
// // // //             onClick={onDownload}
// // // //             className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
// // // //           >
// // // //             <Download className="h-4 w-4" />
// // // //             {downloadLabel}
// // // //           </button>

// // // //           {/* Reset */}
// // // //           <button
// // // //             type="button"
// // // //             onClick={onReset}
// // // //             className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // //           >
// // // //             {resetLabel}
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }























// // // // // // components/ToolFlow/DoneStep.jsx
// // // // // "use client";

// // // // // import { Check, FileText, Download } from "lucide-react";

// // // // // export default function DoneStep({
// // // // //   fileCount = 1,
// // // // //   onReset,
// // // // //   onDownload,

// // // // //   title = "Your file is ready",
// // // // //   description = "The converted Word document has been generated successfully.",
// // // // //   fileName = "Converted-file.docx",
// // // // //   downloadLabel = "Download Word",
// // // // //   resetLabel = "Convert another file",
// // // // // }) {
// // // // //   return (
// // // // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // // // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
// // // // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
// // // // //           <Check className="h-10 w-10 text-green-600" />
// // // // //         </div>

// // // // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // // // //           {title}
// // // // //         </h3>

// // // // //         <p className="mt-2 text-sm text-slate-600">
// // // // //           {description}
// // // // //         </p>

// // // // //         <div className="mt-8 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
// // // // //           <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
// // // // //             <div className="flex min-w-0 items-center gap-3">
// // // // //               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
// // // // //                 <FileText className="h-5 w-5 text-blue-500" />
// // // // //               </div>

// // // // //               <div className="min-w-0 text-left">
// // // // //                 <p className="truncate text-sm font-semibold text-slate-900">
// // // // //                   {fileName}
// // // // //                 </p>
// // // // //                 <p className="text-xs text-slate-500">
// // // // //                   Ready to download • {fileCount} file{fileCount > 1 ? "s" : ""}
// // // // //                 </p>
// // // // //               </div>
// // // // //             </div>

// // // // //             <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
// // // // //               Completed
// // // // //             </span>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
// // // // //           <button className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
// // // // //             <Download className="h-4 w-4" />
// // // // //             {downloadLabel}
// // // // //           </button>

// // // // //           <button
// // // // //             onClick={onDownload}
// // // // //             className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
// // // // //           >
// // // // //             {resetLabel}
// // // // //           </button>
// // // // //         </div> */}

// // // // //         {/* Actions */}
// // // // // <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
// // // // //   {/* Download */}
// // // // //   <button
// // // // //     type="button"
// // // // //     onClick={onDownload}
// // // // //     className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
// // // // //   >
// // // // //     <Download className="h-4 w-4" />
// // // // //     {downloadLabel}
// // // // //   </button>

// // // // //   {/* Reset */}
// // // // //   <button
// // // // //     type="button"
// // // // //     onClick={onReset}
// // // // //     className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // // //   >
// // // // //     {resetLabel}
// // // // //   </button>
// // // // // </div>


// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }






























// // // // // // // components/ToolFlow/DoneStep.jsx
// // // // // // "use client";

// // // // // // import { Check, FileText, Download } from "lucide-react";

// // // // // // export default function DoneStep({
// // // // // //   fileCount = 1,
// // // // // //   onReset,
// // // // // // }) {
// // // // // //   return (
// // // // // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // // // // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">

// // // // // //         {/* Success Icon */}
// // // // // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
// // // // // //           <Check className="h-10 w-10 text-green-600" />
// // // // // //         </div>

// // // // // //         {/* Title */}
// // // // // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // // // // //           Your file is ready
// // // // // //         </h3>

// // // // // //         <p className="mt-2 text-sm text-slate-600">
// // // // // //           The converted Word document has been generated successfully.
// // // // // //         </p>

// // // // // //         {/* File Card */}
// // // // // //         <div className="mt-8 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
// // // // // //           <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">

// // // // // //             <div className="flex items-center gap-3 min-w-0">
// // // // // //               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
// // // // // //                 <FileText className="h-5 w-5 text-blue-500" />
// // // // // //               </div>

// // // // // //               <div className="min-w-0 text-left">
// // // // // //                 <p className="truncate text-sm font-semibold text-slate-900">
// // // // // //                   Converted-file.docx
// // // // // //                 </p>
// // // // // //                 <p className="text-xs text-slate-500">
// // // // // //                   Ready to download • {fileCount} file{fileCount > 1 ? "s" : ""}
// // // // // //                 </p>
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
// // // // // //               Completed
// // // // // //             </span>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Actions */}
// // // // // //         <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

// // // // // //           {/* Download */}
// // // // // //           <button className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
// // // // // //             <Download className="h-4 w-4" />
// // // // // //             Download Word
// // // // // //           </button>

// // // // // //           {/* Reset */}
// // // // // //           <button
// // // // // //             onClick={onReset}
// // // // // //             className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
// // // // // //           >
// // // // // //             Convert another file
// // // // // //           </button>

// // // // // //         </div>

// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }




















// // // // // // // // components/ToolFlow/DoneStep.jsx
// // // // // // // "use client";
// // // // // // // import { CheckCircle, Upload } from "lucide-react";

// // // // // // // export default function DoneStep({
// // // // // // //   fileCount = 1,
// // // // // // //   onReset,
// // // // // // //   relatedLinks = [], // [{ label, href }]
// // // // // // // }) {
// // // // // // //   return (
// // // // // // //     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
// // // // // // //       <div className="mx-6 my-6 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
// // // // // // //         <div className="flex flex-col items-center text-center px-8 py-10">

// // // // // // //           {/* Icon */}
// // // // // // //           <div className="relative w-16 h-16 mb-5">
// // // // // // //             <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30"></div>
// // // // // // //             <div className="relative w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
// // // // // // //               <CheckCircle className="w-8 h-8 text-white" />
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           <h3 className="text-xl font-bold text-green-800 mb-1">
// // // // // // //             Conversion Complete! 🎉
// // // // // // //           </h3>
// // // // // // //           <p className="text-sm text-green-700 font-medium mb-1">
// // // // // // //             Your file{fileCount === 1 ? " has" : "s have"} been downloaded automatically
// // // // // // //           </p>
// // // // // // //           <p className="text-xs text-gray-500 mb-6">
// // // // // // //             {fileCount === 1
// // // // // // //               ? "Check your downloads folder for the converted file"
// // // // // // //               : "Check your downloads — ZIP contains all converted files"}
// // // // // // //           </p>

// // // // // // //           {/* Actions */}
// // // // // // //           <div className="flex flex-wrap gap-3 justify-center">
// // // // // // //             <button
// // // // // // //               onClick={onReset}
// // // // // // //               className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition shadow-sm"
// // // // // // //             >
// // // // // // //               <Upload className="w-4 h-4" />
// // // // // // //               Convert another file
// // // // // // //             </button>

// // // // // // //             {/* Related tool links — tool passes these */}
// // // // // // //             {relatedLinks.map(({ label, href }) => (
// // // // // // //               <a
// // // // // // //                 key={href}
// // // // // // //                 href={href}
// // // // // // //                 className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm"
// // // // // // //               >
// // // // // // //                 {label} →
// // // // // // //               </a>
// // // // // // //             ))}
// // // // // // //           </div>

// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }