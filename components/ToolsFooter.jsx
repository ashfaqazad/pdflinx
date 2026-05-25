"use client";

import React from "react";
import Link from "next/link";
import {
    Scissors, Layers3, Trash2, FolderOpen, FileOutput,
    Minimize2, ScanSearch, FileText, FileSpreadsheet,
    Presentation, ImageIcon, Type, Code2, FileImage,
    FileType, RotateCw, Hash, Droplets, Pencil, Crop,
    Shield, Unlock, PenSquare,
} from "lucide-react";

const groupColors = [
    {
        title: "text-blue-600",
        border: "border-blue-200",
        iconDefault: "text-blue-300",
        iconHover: "group-hover:text-blue-500",
        hoverBg: "hover:bg-blue-50 active:bg-blue-50",
        hoverText: "hover:text-blue-800 active:text-blue-800",
    },
    {
        title: "text-emerald-600",
        border: "border-emerald-200",
        iconDefault: "text-emerald-300",
        iconHover: "group-hover:text-emerald-500",
        hoverBg: "hover:bg-emerald-50 active:bg-emerald-50",
        hoverText: "hover:text-emerald-800 active:text-emerald-800",
    },
    {
        title: "text-amber-500",
        border: "border-amber-200",
        iconDefault: "text-amber-300",
        iconHover: "group-hover:text-amber-500",
        hoverBg: "hover:bg-amber-50 active:bg-amber-50",
        hoverText: "hover:text-amber-800 active:text-amber-800",
    },
    {
        title: "text-violet-600",
        border: "border-violet-200",
        iconDefault: "text-violet-300",
        iconHover: "group-hover:text-violet-500",
        hoverBg: "hover:bg-violet-50 active:bg-violet-50",
        hoverText: "hover:text-violet-800 active:text-violet-800",
    },
    {
        title: "text-orange-500",
        border: "border-orange-200",
        iconDefault: "text-orange-300",
        iconHover: "group-hover:text-orange-500",
        hoverBg: "hover:bg-orange-50 active:bg-orange-50",
        hoverText: "hover:text-orange-800 active:text-orange-800",
    },
    {
        title: "text-rose-500",
        border: "border-rose-200",
        iconDefault: "text-rose-300",
        iconHover: "group-hover:text-rose-500",
        hoverBg: "hover:bg-rose-50 active:bg-rose-50",
        hoverText: "hover:text-rose-800 active:text-rose-800",
    },
];

const ToolsFooter = () => {
    const toolGroups = [
        {
            title: "Organize PDF",
            items: [
                { name: "Merge PDF", href: "/merge-pdf", icon: Layers3 },
                { name: "Split PDF", href: "/split-pdf", icon: Scissors },
                { name: "Remove Pages", href: "/remove-pages", icon: Trash2 },
                { name: "Organize PDF", href: "/organize-pdf", icon: FolderOpen },
                { name: "Extract PDF", href: "/extract-pdf", icon: FileOutput },
            ],
        },
        {
            title: "Optimize PDF",
            items: [
                { name: "Compress PDF", href: "/compress-pdf", icon: Minimize2 },
                { name: "OCR PDF", href: "/ocr-pdf", icon: ScanSearch },
            ],
        },
        {
            title: "Convert To PDF",
            items: [
                { name: "Word to PDF", href: "/word-to-pdf", icon: FileText },
                { name: "Excel to PDF", href: "/excel-to-pdf", icon: FileSpreadsheet },
                { name: "PowerPoint to PDF", href: "/ppt-to-pdf", icon: Presentation },
                { name: "Image to PDF", href: "/image-to-pdf", icon: ImageIcon },
                { name: "Text to PDF", href: "/text-to-pdf", icon: Type },
                { name: "HTML to PDF", href: "/html-to-pdf", icon: Code2 },
            ],
        },
        {
            title: "Convert From PDF",
            items: [
                { name: "PDF to Word", href: "/pdf-to-word", icon: FileText },
                { name: "PDF to Excel", href: "/pdf-to-excel", icon: FileSpreadsheet },
                { name: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage },
                { name: "PDF to PNG", href: "/pdf-to-png", icon: ImageIcon },
                { name: "PDF to Text", href: "/pdf-to-text", icon: FileType },
            ],
        },
        {
            title: "Edit PDF",
            items: [
                { name: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw },
                { name: "Add Page Numbers", href: "/add-page-numbers", icon: Hash },
                { name: "Add Watermark", href: "/add-watermark", icon: Droplets },
                { name: "Edit PDF", href: "/edit-pdf", icon: Pencil },
                { name: "Crop PDF", href: "/crop-pdf", icon: Crop },
            ],
        },
        {
            title: "PDF Security",
            items: [
                { name: "Protect PDF", href: "/protect-pdf", icon: Shield },
                { name: "Unlock PDF", href: "/unlock-pdf", icon: Unlock },
                { name: "Sign PDF", href: "/sign-pdf", icon: PenSquare },
            ],
        },
    ];

    return (
        <section className="bg-[#f7f6f3] border-t border-[#e5e3de] py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9e9b95] mb-2.5">
                        All PDF Tools
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Explore Every{" "}
                        <span className="text-orange-500">PDF Tool</span>
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-[#6b6963] leading-relaxed max-w-lg mx-auto">
                        Convert, organize, optimize and secure your PDF files with fast,
                        browser-based tools designed for everyday use.
                    </p>
                </div>

                {/* Grid — mobile: 2 col, sm: 3 col, lg: 6 col */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-0 gap-y-8 lg:gap-y-0">
                    {toolGroups.map((group, index) => {
                        const color = groupColors[index];
                        return (
                            <div
                                key={index}
                                className={`
                                    px-3 sm:px-4 lg:px-5
                                    first:pl-0 last:pr-0
                                    lg:border-r lg:last:border-r-0 lg:border-[#e5e3de]
                                `}
                            >
                                {/* Group title */}
                                <h3 className={`
                                    text-[11px] md:text-[10.5px] font-bold uppercase
                                    tracking-[0.16em] mb-3 pb-2 border-b-2
                                    ${color.title} ${color.border}
                                `}>
                                    {group.title}
                                </h3>

                                {/* Items */}
                                <ul className="flex flex-col gap-0.5">
                                    {group.items.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={idx}>
                                                <Link
                                                    href={item.href}
                                                    className={`
                                                        group flex items-center gap-2.5
                                                        px-2 py-[8px] md:py-[7px]
                                                        rounded-[7px] text-[13px] md:text-[13.5px]
                                                        text-[#4a4845] transition-all duration-150
                                                        ${color.hoverBg} ${color.hoverText}
                                                        hover:translate-x-1
                                                    `}
                                                >
                                                    <Icon
                                                        size={15}
                                                        className={`
                                                            flex-shrink-0 transition-colors duration-150
                                                            ${color.iconDefault} ${color.iconHover}
                                                        `}
                                                    />
                                                    <span className="leading-snug">{item.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default ToolsFooter;






















// "use client";

// import React from "react";
// import Link from "next/link";
// import {
//   Scissors,
//   Layers3,
//   Trash2,
//   FolderOpen,
//   FileOutput,
//   Minimize2,
//   ScanSearch,
//   FileText,
//   FileSpreadsheet,
//   Presentation,
//   ImageIcon,
//   Type,
//   Code2,
//   FileArchive,
//   FileImage,
//   FileType,
//   RotateCw,
//   Hash,
//   Droplets,
//   Pencil,
//   Crop,
//   Shield,
//   Unlock,
//   PenSquare,
// } from "lucide-react";

// const ToolsFooter = () => {
//   const toolGroups = [
//     {
//       title: "Organize PDF",
//       items: [
//         { name: "Merge PDF", href: "/merge-pdf", icon: Layers3 },
//         { name: "Split PDF", href: "/split-pdf", icon: Scissors },
//         { name: "Remove Pages", href: "/remove-pages", icon: Trash2 },
//         { name: "Organize PDF", href: "/organize-pdf", icon: FolderOpen },
//         { name: "Extract PDF", href: "/extract-pdf", icon: FileOutput },
//       ],
//     },

//     {
//       title: "Optimize PDF",
//       items: [
//         { name: "Compress PDF", href: "/compress-pdf", icon: Minimize2 },
//         { name: "OCR PDF", href: "/ocr-pdf", icon: ScanSearch },
//       ],
//     },

//     {
//       title: "Convert To PDF",
//       items: [
//         { name: "Word to PDF", href: "/word-to-pdf", icon: FileText },
//         { name: "Excel to PDF", href: "/excel-to-pdf", icon: FileSpreadsheet },
//         { name: "PowerPoint to PDF", href: "/ppt-to-pdf", icon: Presentation },
//         { name: "Image to PDF", href: "/image-to-pdf", icon: ImageIcon },
//         { name: "Text to PDF", href: "/text-to-pdf", icon: Type },
//         { name: "HTML to PDF", href: "/html-to-pdf", icon: Code2 },
//       ],
//     },

//     {
//       title: "Convert From PDF",
//       items: [
//         { name: "PDF to Word", href: "/pdf-to-word", icon: FileText },
//         { name: "PDF to Excel", href: "/pdf-to-excel", icon: FileSpreadsheet },
//         { name: "PDF to JPG", href: "/pdf-to-jpg", icon: FileImage },
//         { name: "PDF to PNG", href: "/pdf-to-png", icon: ImageIcon },
//         { name: "PDF to Text", href: "/pdf-to-text", icon: FileType },
//       ],
//     },

//     {
//       title: "Edit PDF",
//       items: [
//         { name: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw },
//         { name: "Add Page Numbers", href: "/add-page-numbers", icon: Hash },
//         { name: "Add Watermark", href: "/add-watermark", icon: Droplets },
//         { name: "Edit PDF", href: "/edit-pdf", icon: Pencil },
//         { name: "Crop PDF", href: "/crop-pdf", icon: Crop },
//       ],
//     },

//     {
//       title: "PDF Security",
//       items: [
//         { name: "Protect PDF", href: "/protect-pdf", icon: Shield },
//         { name: "Unlock PDF", href: "/unlock-pdf", icon: Unlock },
//         { name: "Sign PDF", href: "/sign-pdf", icon: PenSquare },
//       ],
//     },
//   ];

//   return (
//     <section className="bg-[#f5f5f4] border-t border-gray-200 py-16">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* Top Heading */}
//         <div className="mb-14 text-center">
//           <p className="text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
//             All PDF Tools
//           </p>

//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//             Explore Every PDF Tool
//           </h2>

//           <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-7">
//             Convert, organize, optimize and secure your PDF files with fast,
//             browser-based tools designed for everyday use.
//           </p>
//         </div>

//         {/* Tools Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

//           {toolGroups.map((group, index) => (
//             <div key={index}>

//               <h3 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-bold mb-5">
//                 {group.title}
//               </h3>

//               <ul className="space-y-4">
//                 {group.items.map((item, idx) => {
//                   const Icon = item.icon;

//                   return (
//                     <li key={idx}>
//                       <Link
//                         href={item.href}
//                         className="group flex items-center gap-3 text-[15px] text-gray-700 hover:text-black transition"
//                       >
//                         <Icon
//                           size={16}
//                           className="text-gray-400 group-hover:text-orange-500 transition"
//                         />

//                         <span>{item.name}</span>
//                       </Link>
//                     </li>
//                   );
//                 })}
//               </ul>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// };

// export default ToolsFooter;