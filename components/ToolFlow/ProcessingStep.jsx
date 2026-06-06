"use client";

import { useEffect, useState, useRef } from "react";
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
  // displayProgress — actual progress se aage nahi jayega lekin rukta nahi
  const [displayProgress, setDisplayProgress] = useState(0);
  const animRef = useRef(null);
  const displayRef = useRef(0);

  // Stage index update
  useEffect(() => {
    if (!stages.length) return;
    const idx = Math.min(
      Math.floor((progress / 100) * stages.length),
      stages.length - 1
    );
    setStageIndex(idx);
  }, [progress, stages.length]);

  // ✅ Animated progress — kabhi rukta nahi, slow crawl karta rehta hai
  useEffect(() => {
    const target = progress >= 100 ? 100 : Math.min(progress, 92); // max 92% jab tak done nahi

    const animate = () => {
      const current = displayRef.current;

      if (current >= target) {
        // Target pe pahunch gaye — slow crawl mode
        // Agar 88% pe atak gaye hain to aage badhte raho slowly
        if (current < 92 && progress < 100) {
          displayRef.current = current + 0.02; // bohot slow crawl
          setDisplayProgress(Math.min(displayRef.current, 99));
        }
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      // Target tak pohnchna hai — fast move
      const diff = target - current;
      const step = Math.max(diff * 0.04, 0.3); // min 0.3% per frame
      displayRef.current = Math.min(current + step, target);
      setDisplayProgress(displayRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [progress]);

  const currentStageLabel = stages[stageIndex] || description;
  const roundedProgress = Math.round(displayProgress);

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-start px-6 pt-2 pb-12 text-center">

      {/* Brand */}
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

      {/* Spinner */}
      <div className="relative mb-8 h-20 w-20">
        <svg className="h-20 w-20 animate-spin" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" />
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

      {/* Stage label */}
      <p className="mt-2 text-sm text-[#7a7772]">{currentStageLabel}</p>

      {/* ✅ Progress bar — big number + thick bar */}
      <div className="mt-6 w-full max-w-xs">

        {/* Big percentage number — center */}
        <p className="mb-3 text-5xl font-extrabold tracking-tight text-[#f24d0d]">
          {roundedProgress}%
        </p>

        {/* Thick bar with track */}
        <div className="h-4 overflow-hidden rounded-full bg-[#f3f4f6] shadow-inner">
          <div
            className="h-full rounded-full bg-[#f24d0d] shadow-[0_2px_10px_rgba(242,77,13,0.45)]"
            style={{
              width: `${Math.min(displayProgress, 100)}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>

      </div>

      {fileCount > 1 && (
        <p className="mt-5 text-xs text-gray-400">
          Processing {fileCount} files — please don&apos;t close this tab.
        </p>
      )}
    </div>
  );
}



























// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// export default function ProcessingStep({
//   progress = 0,
//   title = "Converting your PDF",
//   description = "Extracting text and layout...",
//   stages = ["Uploading file", "Extracting content", "Generating file"],
//   fileCount = 1,
// }) {
//   const [stageIndex, setStageIndex] = useState(0);

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
//     // <div className="flex min-h-[420px] flex-col items-center justify-start px-6 pt-6 pb-12 text-center">

//       <div className="flex min-h-[420px] flex-col items-center justify-start px-6 pt-2 pb-12 text-center">
//       {/* 🔥 BRAND — Navbar ke paas (top shift) */}
//       <div className="mb-10">
//         <Link href="/" className="flex items-center gap-2">
//           <Image
//             src="/pdflinx_logo.svg"
//             alt="PDFLinx Logo"
//             width={36}
//             height={36}
//             priority
//           />
//           <span className="font-semibold text-xl italic text-[#0f0e0d]">
//             pdflinx
//           </span>
//         </Link>
//       </div>

//       {/* 🔥 Spinner (iLovePDF style) */}
//       <div className="relative mb-8 h-20 w-20">
//         <svg
//           className="h-20 w-20 animate-spin"
//           viewBox="0 0 64 64"
//           fill="none"
//         >
//           {/* Track */}
//           <circle
//             cx="32"
//             cy="32"
//             r="28"
//             stroke="#e5e7eb"
//             strokeWidth="6"
//           />

//           {/* Active stroke */}
//           <circle
//             cx="32"
//             cy="32"
//             r="28"
//             stroke="#f24d0d"
//             strokeWidth="6"
//             strokeLinecap="round"
//             strokeDasharray="175.9"
//             strokeDashoffset="110"
//           />
//         </svg>
//       </div>

//       {/* Title */}
//       <h3 className="text-xl font-bold text-[#0f0e0d]">{title}</h3>

//       {/* Stage */}
//       <p className="mt-2 text-sm text-[#7a7772]">{currentStageLabel}</p>

//       {/* Progress */}
//       <div className="mt-6 w-full max-w-sm">
//         <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
//           <div
//             className="h-full rounded-full bg-[#f24d0d] transition-all duration-500 ease-out shadow-[0_4px_12px_rgba(242,77,13,0.35)]"
//             style={{ width: `${Math.min(progress, 100)}%` }}
//           />
//         </div>

//         <p className="mt-2 text-sm font-semibold text-[#7a7772]">
//           {Math.round(progress)}%
//         </p>
//       </div>

//       {fileCount > 1 && (
//         <p className="mt-4 text-xs text-gray-400">
//           Processing {fileCount} files — please don&apos;t close this tab.
//         </p>
//       )}
//     </div>
//   );
// }


