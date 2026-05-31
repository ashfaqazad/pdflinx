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
  sidebarLinks = [],
  compressionStats = null,
}) {
  return (
    <div className="animate-done-in mx-auto -mt-6 w-full max-w-[760px] rounded-[20px] border border-black/10 bg-white px-8 py-14 text-center shadow-sm">

      {/* ── CHECK ICON ── */}
      <div className="animate-success-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edfaf3]">
        <Check className="h-10 w-10 text-black" strokeWidth={2.4} />
      </div>

      {/* ── TITLE + DESC ── */}
      <h3 className="animate-done-text mt-7 font-display text-[30px] font-normal leading-tight text-[#0f0e0d]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#7a7772]">{description}</p>

      {/* ── COMPRESSION STATS ── */}
      {compressionStats && (() => {
        const savedPct = Math.round(
          (1 - compressionStats.compressedSize / compressionStats.originalSize) * 100
        );
        const origMB = (compressionStats.originalSize / (1024 * 1024)).toFixed(2);
        const compMB = (compressionStats.compressedSize / (1024 * 1024)).toFixed(2);

        return (
          <div className="mx-auto mt-6 w-full max-w-[380px] flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="-rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="#f24d0d"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="175.9"
                  strokeDashoffset={175.9 - (savedPct / 100) * 175.9}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-xs font-bold leading-none text-green-600">{savedPct}%</p>
                <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">saved</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700">
                Your PDF is now {savedPct}% smaller!
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {origMB} MB → {compMB} MB
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── DOWNLOAD + RESET BUTTONS ── */}
      <div className="mx-auto mt-8 w-full max-w-[380px] overflow-hidden rounded-xl border border-black/10 bg-white">
        <button
          type="button"
          onClick={onDownload}
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

      {/* ── RELATED LINKS — bottom chips ── */}
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

      {/* ── MOBILE ONLY — sidebarLinks chips — lg pe hide, wahan ToolPageLayout sidebar handle karta hai ── */}
      {sidebarLinks.length > 0 && (
        <div className="mt-8 lg:hidden">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
            Continue with...
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {sidebarLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#3a3835] transition hover:border-[#e8420a] hover:text-[#e8420a]"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}





















// // components/ToolFlow/DoneStep.jsx
// "use client";

// import { Check, Download } from "lucide-react";


// export default function DoneStep({
//   title = "Conversion complete!",
//   description = "Your file is ready to download.",
//   downloadLabel = "Download File",
//   resetLabel = "Convert another file",
//   onDownload,
//   onReset,
//   relatedLinks = [],
//   compressionStats = null,
//   }) {
//   return (
//     <div className="animate-done-in mx-auto -mt-6 w-full max-w-[760px] rounded-[20px] border border-black/10 bg-white px-8 py-14 text-center shadow-sm">
//       <div className="animate-success-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edfaf3]">
//         <Check className="h-10 w-10 text-black" strokeWidth={2.4} />
//       </div>

//       <h3 className="animate-done-text mt-7 font-display text-[30px] font-normal leading-tight text-[#0f0e0d]">
//         {title}
//       </h3>

//       <p className="mt-2 text-sm text-[#7a7772]">{description}</p>


//       {compressionStats && (() => {
//         const savedPct = Math.round(
//           (1 - compressionStats.compressedSize / compressionStats.originalSize) * 100
//         );
//         const origMB = (compressionStats.originalSize / (1024 * 1024)).toFixed(2);
//         const compMB = (compressionStats.compressedSize / (1024 * 1024)).toFixed(2);
//         // const radius = 28;
//         // const circ = 2 * Math.PI * radius;
//         // const dash = (savedPct / 100) * circ;

//         return (
//           <div className="mx-auto mt-6 w-full max-w-[380px] flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
//             {/* SVG Circle */}
//             <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
//               {/* <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90"> */}

//               <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="-rotate-90">
//                 {/* Track — gray */}
//                 <circle
//                   cx="32" cy="32" r="28"
//                   stroke="#e5e7eb"
//                   strokeWidth="6"
//                 />
//                 {/* Progress — orange-red */}
//                 <circle
//                   cx="32" cy="32" r="28"
//                   stroke="#f24d0d"
//                   strokeWidth="6"
//                   strokeLinecap="round"
//                   strokeDasharray="175.9"
//                   strokeDashoffset={175.9 - (savedPct / 100) * 175.9}
//                 />
//               </svg>


//               <div className="absolute text-center">
//                 <p className="text-xs font-bold leading-none text-green-600">{savedPct}%</p>
//                 <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">saved</p>
//               </div>
//             </div>

//             {/* Text */}
//             <div className="text-left">
//               <p className="text-sm font-semibold text-slate-700">
//                 Your PDF is now {savedPct}% smaller!
//               </p>
//               <p className="mt-1 text-xs text-slate-400">
//                 {origMB} MB → {compMB} MB
//               </p>
//             </div>
//           </div>
//         );
//       })()}

//       <div className="mx-auto mt-8 w-full max-w-[380px] overflow-hidden rounded-xl border border-black/10 bg-white">
//         <button
//           type="button"
//           onClick={onDownload}
//           // className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f24d0d] px-6 py-4 text-sm font-bold text-white shadow-2xl transition hover:bg-[#dc4308] hover:shadow-orange-300 active:scale-[0.98]"
//           className="animate-download-pop flex w-full items-center justify-center gap-2 rounded-xl bg-[#f24d0d] px-6 py-4 text-sm font-bold text-white shadow-2xl transition hover:bg-[#dc4308] hover:shadow-orange-300 active:scale-[0.98]"
//         >
//           <Download className="h-4 w-4" />
//           {downloadLabel}
//         </button>

//         <button
//           type="button"
//           onClick={onReset}
//           className="w-full bg-white px-6 py-3.5 text-sm font-medium text-[#0f0e0d] transition hover:bg-[#f5f4f1]"
//         >
//           ↩ {resetLabel}
//         </button>
//       </div>

//       {relatedLinks.length > 0 && (
//         <div className="mt-8 flex flex-wrap justify-center gap-2">
//           {relatedLinks.map((link, i) => (
//             <a
//               key={i}
//               href={link.href}
//               className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium text-[#3a3835] transition hover:border-[#e8420a] hover:text-[#e8420a]"
//             >
//               {link.label}
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


