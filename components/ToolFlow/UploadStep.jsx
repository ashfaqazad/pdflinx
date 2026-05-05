// components/ToolFlow/UploadStep.jsx
"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function UploadStep({
  onFilesSelect,
  accept = "application/pdf",
  multiple = true,
  uploadInfo = null,
  uploadTitle = "Drop your PDF here",
  uploadSubtitle = null,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length > 0) onFilesSelect(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex min-h-[330px] w-full max-w-[760px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-10 py-10 text-center transition-all duration-200 md:min-h-[360px] md:px-16 md:py-12 ${dragging
          ? "border-[#1a9e6e] bg-green-50"
          : "border-slate-300 bg-white hover:border-[#1a9e6e] hover:bg-green-50/40"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      {/* <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 md:h-20 md:w-20">
        <Upload className="h-8 w-8 text-[#1a9e6e] md:h-10 md:w-10" />
      </div> */}

      <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
        {dragging ? "Drop files here" : uploadTitle}
        {/* {dragging ? "Drop files here" : "Drop your PDF here"} */}
      </h2>

      <p className="mt-2 text-sm text-slate-500 md:text-base">
        {uploadSubtitle || `or click to browse${multiple ? " — up to 10 files at once" : ""}`}
        {/* or click to browse{multiple ? " — up to 10 files at once" : ""} */}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1a9e6e] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#158a5e] active:scale-95 md:px-10 md:py-3.5"
      >
        <Upload className="h-4 w-4" />
        Choose Files
      </button>

      {/* <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {["✓ No signup", "✓ No watermark", "✓ Auto-deleted", "✓ 100% free"].map(
          (badge) => (
            <span
              key={badge}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600"
            >
              {badge}
            </span>
          )
        )}
      </div> */}

      {uploadInfo && (
        <div className="mt-6 text-center text-xs font-medium text-slate-500">
          {uploadInfo}
        </div>
      )}
    </div>
  );
}





























// // components/ToolFlow/UploadStep.jsx
// "use client";

// import { useRef, useState } from "react";
// import { Upload } from "lucide-react";

// export default function UploadStep({
//   onFilesSelect,
//   accept = "application/pdf",
//   multiple = true,
// }) {
//   const inputRef = useRef(null);
//   const [dragging, setDragging] = useState(false);

//   const handleFiles = (fileList) => {
//     const files = Array.from(fileList);
//     if (files.length > 0) onFilesSelect(files);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = () => setDragging(false);

//   const handleChange = (e) => {
//     handleFiles(e.target.files);
//     e.target.value = "";
//   };

//   return (
//     <div
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       // onClick={() => inputRef.current?.click()}
//       className={`flex min-h-[330px] w-full max-w-[760px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-10 py-10 text-center transition-all duration-200 md:min-h-[360px] md:px-16 md:py-12 ${dragging
//           ? "border-[#1a9e6e] bg-green-50"
//           : "border-slate-300 bg-white hover:border-[#1a9e6e] hover:bg-green-50/40"
//         }`}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         accept={accept}
//         multiple={multiple}
//         className="hidden"
//         onChange={handleChange}
//       />

//       <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 md:h-20 md:w-20">
//         <Upload className="h-8 w-8 text-[#1a9e6e] md:h-10 md:w-10" />
//       </div>

//       <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
//         {dragging ? "Drop files here" : "Drop your PDF here"}
//       </h2>

//       <p className="mt-2 text-sm text-slate-500 md:text-base">
//         or click to browse{multiple ? " — up to 10 files at once" : ""}
//       </p>

//       <button
//         type="button"
//         onClick={(e) => {
//           e.stopPropagation();
//           inputRef.current?.click();
//         }}
//         className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1a9e6e] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#158a5e] active:scale-95 md:px-10 md:py-3.5"
//       >
//         <Upload className="h-4 w-4" />
//         Choose Files
//       </button>

//       {/* Small info text */}
//       <div className="mt-6 text-center text-xs font-medium text-slate-500">
//         <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
//         <p className="mt-1">
//           🔢 Max 10 PDF files at once · Single PDF → DOCX · Multiple → ZIP
//         </p>
//       </div>


//       <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
//         {["✓ No signup", "✓ No watermark", "✓ Auto-deleted", "✓ 100% free"].map(
//           (badge) => (
//             <span
//               key={badge}
//               className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600"
//             >
//               {badge}
//             </span>
//           )
//         )}
//       </div>
//     </div>
//   );
// }























// // components/ToolFlow/UploadStep.jsx
// "use client";

// import { useRef, useState } from "react";
// import { Upload } from "lucide-react";

// export default function UploadStep({
//   onFilesSelect,
//   accept = "application/pdf",
//   multiple = true,
// }) {
//   const inputRef = useRef(null);
//   const [dragging, setDragging] = useState(false);

//   const handleFiles = (fileList) => {
//     const files = Array.from(fileList);
//     if (files.length > 0) onFilesSelect(files);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = () => setDragging(false);

//   const handleChange = (e) => {
//     handleFiles(e.target.files);
//     e.target.value = "";
//   };

//   return (
//     <div
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onClick={() => inputRef.current?.click()}
//       className={`flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
//         dragging
//           ? "border-[#1a9e6e] bg-green-50"
//           : "border-slate-300 bg-white hover:border-[#1a9e6e] hover:bg-green-50/40"
//       }`}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         accept={accept}
//         multiple={multiple}
//         className="hidden"
//         onChange={handleChange}
//       />

//       {/* Upload icon */}
//       <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
//         <Upload className="h-8 w-8 text-[#1a9e6e]" />
//       </div>

//       <h2 className="text-xl font-bold text-slate-800">
//         {dragging ? "Drop files here" : "Drop your PDF here"}
//       </h2>
//       <p className="mt-2 text-sm text-slate-500">
//         or click to browse{multiple ? " — up to 10 files at once" : ""}
//       </p>

//       {/* Choose Files button */}
//       <button
//         type="button"
//         onClick={(e) => {
//           e.stopPropagation();
//           inputRef.current?.click();
//         }}
//         className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a9e6e] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#158a5e] active:scale-95"
//       >
//         <Upload className="h-4 w-4" />
//         Choose Files
//       </button>

//       {/* Trust badges */}
//       <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//         {["✓ No signup", "✓ No watermark", "✓ Auto-deleted", "✓ 100% free"].map((badge) => (
//           <span
//             key={badge}
//             className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
//           >
//             {badge}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }




















// // components/ToolFlow/UploadStep.jsx
// "use client";

// import { FileText } from "lucide-react";

// export default function UploadStep({
//   onFilesSelect,
//   accept = "application/pdf",
//   multiple = true,
// }) {
//   const handleChange = (e) => {
//     const selected = Array.from(e.target.files || []);
//     if (selected.length) onFilesSelect(selected);
//   };

//   return (
//     <label className="block cursor-pointer group">
//       <div className="flex min-h-[430px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/40">
//         {/* Icon */}
//         <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:bg-blue-100">
//           <FileText className="h-10 w-10 text-blue-600" />
//         </div>

//         {/* Title */}
//         <h3 className="text-2xl font-bold tracking-tight text-slate-900">
//           Select PDF File
//         </h3>

//         {/* Subtitle */}
//         <p className="mt-3 text-base text-slate-500">
//           Drag & drop or click — select{" "}
//           <span className="font-semibold text-slate-700">multiple files</span>{" "}
//           at once
//         </p>

//         {/* CTA */}
//         <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:bg-blue-700 group-hover:shadow-blue-300">
//           <span className="text-lg">📁</span>
//           Select Files
//         </div>

//         {/* Trust note */}
//         <p className="mt-7 text-sm text-slate-400">
//           🛡️ Zero server storage — files deleted instantly after conversion
//         </p>

//         <input
//           type="file"
//           multiple={multiple}
//           accept={accept}
//           onChange={handleChange}
//           className="hidden"
//         />
//       </div>
//     </label>
//   );
// }
























// // // components/ToolFlow/UploadStep.jsx
// // "use client";
// // import { FileText, CheckCircle, Upload } from "lucide-react";

// // export default function UploadStep({ onFilesSelect, accept = "application/pdf", multiple = true }) {
// //   const handleChange = (e) => {
// //     const selected = Array.from(e.target.files || []);
// //     if (selected.length) onFilesSelect(selected);
// //   };

// //   return (
// //     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
// //       <div className="p-8 space-y-5">

// //         {/* Dropzone */}
// //         <label className="block cursor-pointer group">
// //           <div className="relative rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-200 p-8 text-center">
// //             <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
// //               <Upload className="w-7 h-7 text-blue-500" />
// //             </div>
// //             <p className="text-base font-semibold text-gray-700">Drop your PDF file(s) here</p>
// //             <p className="text-sm text-gray-400 mt-1">or click to browse</p>
// //             <div className="flex flex-wrap justify-center gap-2 mt-4">
// //               {["✓ No signup", "✓ No watermark", "✓ Up to 10 PDFs", "✓ Auto-deleted"].map((t) => (
// //                 <span key={t} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-full">
// //                   {t}
// //                 </span>
// //               ))}
// //             </div>
// //           </div>
// //           <input
// //             type="file"
// //             multiple={multiple}
// //             accept={accept}
// //             onChange={handleChange}
// //             className="hidden"
// //           />
// //         </label>

// //         {/* Hints */}
// //         <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
// //           <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
// //           <p>🔢 Max 10 PDF files at once · Single PDF → DOCX · Multiple → ZIP</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }