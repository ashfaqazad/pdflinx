"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProcessingStep({
  progress = 0,
  title = "Converting your PDF",
  description = "Extracting text and layout...",
  stages = ["Uploading file", "Extracting content", "Generating file"],
  fileCount = 1,
}) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!stages.length) return;
    const idx = Math.min(
      Math.floor((progress / 100) * stages.length),
      stages.length - 1
    );
    setStageIndex(idx);
  }, [progress, stages.length]);

  const currentStageLabel = stages[stageIndex] || description;

  return (
    // <div className="flex min-h-[420px] flex-col items-center justify-start px-6 pt-6 pb-12 text-center">

      <div className="flex min-h-[420px] flex-col items-center justify-start px-6 pt-2 pb-12 text-center">
      {/* 🔥 BRAND — Navbar ke paas (top shift) */}
      <div className="mb-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/pdflinx_logo.svg"
            alt="PDFLinx Logo"
            width={36}
            height={36}
            priority
          />
          <span className="font-semibold text-xl italic text-[#0f0e0d]">
            pdflinx
          </span>
        </Link>
      </div>

      {/* 🔥 Spinner (iLovePDF style) */}
      <div className="relative mb-8 h-20 w-20">
        <svg
          className="h-20 w-20 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
        >
          {/* Track */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="6"
          />

          {/* Active stroke */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#f24d0d"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="175.9"
            strokeDashoffset="110"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0f0e0d]">{title}</h3>

      {/* Stage */}
      <p className="mt-2 text-sm text-[#7a7772]">{currentStageLabel}</p>

      {/* Progress */}
      <div className="mt-6 w-full max-w-sm">
        <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
          <div
            className="h-full rounded-full bg-[#f24d0d] transition-all duration-500 ease-out shadow-[0_4px_12px_rgba(242,77,13,0.35)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="mt-2 text-sm font-semibold text-[#7a7772]">
          {Math.round(progress)}%
        </p>
      </div>

      {fileCount > 1 && (
        <p className="mt-4 text-xs text-gray-400">
          Processing {fileCount} files — please don&apos;t close this tab.
        </p>
      )}
    </div>
  );
}

























// // components/ToolFlow/ProcessingStep.jsx
// "use client";

// import { useEffect, useState } from "react";

// export default function ProcessingStep({
//   progress = 0,
//   title = "Converting your PDF",
//   description = "Extracting text and layout...",
//   progressLabel = "Conversion progress",
//   stages = ["Uploading file", "Extracting content", "Generating file"],
//   fileCount = 1,
// }) {
//   const [stageIndex, setStageIndex] = useState(0);

//   // Cycle through stages based on progress
//   useEffect(() => {
//     if (!stages.length) return;
//     const idx = Math.min(
//       Math.floor((progress / 100) * stages.length),
//       stages.length - 1
//     );
//     setStageIndex(idx);
//   }, [progress, stages.length]);

//   const currentStageLabel = stages[stageIndex] || description;

//   return (
//     <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
//       {/* Spinner */}
//       <div className="relative mb-8 h-16 w-16">
//         <svg
//           className="h-16 w-16 animate-spin"
//           viewBox="0 0 64 64"
//           fill="none"
//         >
//           <circle
//             cx="32"
//             cy="32"
//             r="28"
//             stroke="#e2e8f0"
//             strokeWidth="6"
//           />
//           <circle
//             cx="32"
//             cy="32"
//             r="28"
//             stroke="#1a9e6e"
//             strokeWidth="6"
//             strokeLinecap="round"
//             strokeDasharray="175.9"
//             strokeDashoffset="120"
//           />
//         </svg>
//       </div>

//       {/* Title */}
//       <h3 className="text-xl font-bold text-slate-900">{title}</h3>

//       {/* Stage label */}
//       <p className="mt-2 text-sm text-slate-500">{currentStageLabel}</p>

//       {/* Progress bar */}
//       <div className="mt-6 w-full max-w-sm">
//         <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//           <div
//             className="h-full rounded-full bg-[#1a9e6e] transition-all duration-500 ease-out"
//             style={{ width: `${Math.min(progress, 100)}%` }}
//           />
//         </div>
//         <p className="mt-2 text-sm font-semibold text-slate-500">
//           {Math.round(progress)}%
//         </p>
//       </div>

//       {fileCount > 1 && (
//         <p className="mt-4 text-xs text-slate-400">
//           Processing {fileCount} files — please don&apos;t close this tab.
//         </p>
//       )}
//     </div>
//   );
// }


















// // // components/ToolFlow/ProcessingStep.jsx
// // "use client";

// // export default function ProcessingStep({
// //   progress = 0,
// //   title = "Processing...",
// //   description = "Please wait...",
// // }) {
// //   const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

// //   return (
// //     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
// //       <div className="w-full max-w-sm rounded-[28px] bg-white px-8 py-10 text-center shadow-2xl">
// //         <div className="text-5xl font-extrabold text-blue-600">
// //           {safeProgress}%
// //         </div>

// //         <h3 className="mt-3 text-2xl font-bold text-slate-900">
// //           Processing...
// //         </h3>

// //         <p className="mt-3 text-sm font-medium text-slate-500">
// //           Please wait...
// //         </p>

// //         <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-slate-200">
// //           <div
// //             className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
// //             style={{ width: `${safeProgress}%` }}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




























// // // // components/ToolFlow/ProcessingStep.jsx
// // // "use client";

// // // import { Loader2 } from "lucide-react";

// // // export default function ProcessingStep({
// // //   progress = 0,
// // //   fileCount = 1,

// // //   title = "Converting your PDF",
// // //   description = "Please wait while we prepare your editable Word document.",
// // //   progressLabel = "Conversion progress",
// // //   stages = ["Uploading file", "Extracting content", "Generating DOCX"],
// // // }) {
// // //   const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

// // //   const activeStage = safeProgress < 35 ? 1 : safeProgress < 75 ? 2 : 3;

// // //   const stageClass = (stage) => {
// // //     if (stage === activeStage) return "border-red-200 bg-red-50";
// // //     if (stage < activeStage) return "border-green-200 bg-green-50";
// // //     return "border-slate-200 bg-white opacity-70";
// // //   };

// // //   return (
// // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
// // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
// // //           <Loader2 className="h-10 w-10 animate-spin text-red-500" />
// // //         </div>

// // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // //           {title}
// // //         </h3>

// // //         <p className="mt-2 text-sm text-slate-600">{description}</p>

// // //         <div className="mt-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
// // //           <div className="mb-3 flex items-center justify-between text-sm">
// // //             <span className="font-medium text-slate-700">{progressLabel}</span>
// // //             <span className="font-semibold text-red-600">{safeProgress}%</span>
// // //           </div>

// // //           <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
// // //             <div
// // //               className="h-full rounded-full bg-slate-900 transition-all duration-500"
// // //               style={{ width: `${safeProgress}%` }}
// // //             />
// // //           </div>

// // //           <div className="mt-5 grid gap-3 md:grid-cols-3">
// // //             {stages.map((stageText, index) => {
// // //               const stageNumber = index + 1;

// // //               return (
// // //                 <div
// // //                   key={stageText}
// // //                   className={`rounded-2xl border p-4 ${stageClass(stageNumber)}`}
// // //                 >
// // //                   <div className="text-sm text-slate-500">
// // //                     Step {stageNumber}
// // //                   </div>
// // //                   <div className="mt-1 font-semibold text-slate-900">
// // //                     {stageText}
// // //                     {stageNumber === 1 && fileCount > 1 ? "s" : ""}
// // //                   </div>
// // //                 </div>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>

// // //         <p className="mt-6 text-xs text-slate-400">
// // //           Please don&apos;t close this tab
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // }




















// // // // components/ToolFlow/ProcessingStep.jsx
// // // "use client";

// // // import { Loader2 } from "lucide-react";

// // // export default function ProcessingStep({ progress = 0, fileCount = 1 }) {
// // //   const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

// // //   const activeStage =
// // //     safeProgress < 35 ? 1 : safeProgress < 75 ? 2 : 3;

// // //   const stageClass = (stage) => {
// // //     if (stage === activeStage) {
// // //       return "border-red-200 bg-red-50";
// // //     }

// // //     if (stage < activeStage) {
// // //       return "border-green-200 bg-green-50";
// // //     }

// // //     return "border-slate-200 bg-white opacity-70";
// // //   };

// // //   return (
// // //     <div className="rounded-3xl border border-slate-200 bg-white">
// // //       <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
// // //         {/* Spinner */}
// // //         <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
// // //           <Loader2 className="h-10 w-10 animate-spin text-red-500" />
// // //         </div>

// // //         <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
// // //           Converting your PDF
// // //         </h3>

// // //         <p className="mt-2 text-sm text-slate-600">
// // //           Please wait while we prepare your editable Word document.
// // //         </p>

// // //         {/* Progress Card */}
// // //         <div className="mt-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
// // //           <div className="mb-3 flex items-center justify-between text-sm">
// // //             <span className="font-medium text-slate-700">
// // //               Conversion progress
// // //             </span>
// // //             <span className="font-semibold text-red-600">
// // //               {safeProgress}%
// // //             </span>
// // //           </div>

// // //           <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
// // //             <div
// // //               className="h-full rounded-full bg-slate-900 transition-all duration-500"
// // //               style={{ width: `${safeProgress}%` }}
// // //             />
// // //           </div>

// // //           <div className="mt-5 grid gap-3 md:grid-cols-3">
// // //             <div className={`rounded-2xl border p-4 ${stageClass(1)}`}>
// // //               <div className="text-sm text-slate-500">Step 1</div>
// // //               <div className="mt-1 font-semibold text-slate-900">
// // //                 Uploading file{fileCount > 1 ? "s" : ""}
// // //               </div>
// // //             </div>

// // //             <div className={`rounded-2xl border p-4 ${stageClass(2)}`}>
// // //               <div className="text-sm text-slate-500">Step 2</div>
// // //               <div className="mt-1 font-semibold text-slate-900">
// // //                 Extracting content
// // //               </div>
// // //             </div>

// // //             <div className={`rounded-2xl border p-4 ${stageClass(3)}`}>
// // //               <div className="text-sm text-slate-500">Step 3</div>
// // //               <div className="mt-1 font-semibold text-slate-900">
// // //                 Generating DOCX
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <p className="mt-6 text-xs text-slate-400">
// // //           Please don&apos;t close this tab
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // }






















// // // // components/ToolFlow/ProcessingStep.jsx
// // // "use client";

// // // export default function ProcessingStep({ progress = 0, fileCount = 1 }) {
// // //   return (
// // //     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
// // //       <div className="p-12 flex flex-col items-center text-center">

// // //         {/* Spinner */}
// // //         <div className="relative w-16 h-16 mb-6">
// // //           <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
// // //           <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
// // //           <div
// // //             className="absolute inset-2 rounded-full border-4 border-green-200 border-b-transparent animate-spin"
// // //             style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
// // //           ></div>
// // //         </div>

// // //         <h3 className="text-lg font-semibold text-gray-800 mb-1">
// // //           Converting your file{fileCount > 1 ? "s" : ""}…
// // //         </h3>
// // //         <p className="text-sm text-gray-400 mb-6">
// // //           {progress < 30 ? "Uploading…" : progress < 70 ? "Processing…" : "Almost done…"}
// // //         </p>

// // //         {/* Progress Bar */}
// // //         <div className="w-full max-w-xs">
// // //           <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
// // //             <div
// // //               className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
// // //               style={{ width: `${progress}%` }}
// // //             />
// // //           </div>
// // //           <p className="text-xs text-gray-400 font-medium mt-2">{progress}%</p>
// // //         </div>

// // //         <p className="text-xs text-gray-300 mt-6">Please don&apos;t close this tab</p>
// // //       </div>
// // //     </div>
// // //   );
// // // }