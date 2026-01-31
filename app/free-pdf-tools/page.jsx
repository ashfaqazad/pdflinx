import Link from "next/link";
import { pdfToolsMeta } from "@/lib/pdfToolsMeta";
import {
    FileText,
    FileType,
    FileImage,
    FileSpreadsheet,
    FilePlus,
    Scissors,
    FileMinus,
    Lock,
    Unlock,
} from "lucide-react";

const icons = {
    "pdf-to-word": FileText,
    "word-to-pdf": FileType,
    "image-to-pdf": FileImage,
    "merge-pdf": FilePlus,
    "split-pdf": Scissors,
    "compress-pdf": FileMinus,
    "excel-pdf": FileSpreadsheet,
    "ppt-to-pdf": FileType,
    "protect-pdf": Lock,
    "unlock-pdf": Unlock,
};

export const metadata = {
    title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
    description:
        "Access all free PDF tools in one place. Convert, merge, compress, protect and unlock PDFs instantly.",
};

export default function FreePdfToolsPage() {
    return (
        <main className="max-w-6xl mx-auto px-4 py-12">

            <h1 className="text-4xl font-bold mb-4 text-gray-900 text-center">
                Free Online PDF Tools
            </h1>

            <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
                PDF Linx provides a complete collection of free online PDF tools.
                Convert, merge, compress, protect and unlock PDF files easily.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(pdfToolsMeta).map((tool) => {
                    const Icon = icons[tool.slug] || FileText;

                    return (
                        <Link
                            key={tool.slug}
                            href={tool.href}
                            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <Icon size={28} className="text-indigo-600" />
                                <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                                    {tool.title.replace(" | PDF Linx", "")}
                                </h2>
                            </div>

                            <p className="text-sm text-gray-600">{tool.description}</p>

                            <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
                                Use tool →
                            </span>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}





















// import Link from "next/link";
// import {
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
// } from "lucide-react";

// export const metadata = {
//   title: "Free PDF Tools – Convert, Merge, Compress PDFs | PDF Linx",
//   description:
//     "Use free online PDF tools to convert, merge, compress and manage PDF files. No signup required.",
// };

// const tools = [
//   {
//     name: "PDF to Word",
//     desc: "Convert PDF files into editable Word documents online.",
//     href: "/convert/pdf-to-word",
//     icon: FileText,
//     color: "text-red-600",
//   },
//   {
//     name: "Word to PDF",
//     desc: "Convert Word documents into high-quality PDF files.",
//     href: "/convert/word-to-pdf",
//     icon: FileType,
//     color: "text-blue-600",
//   },
//   {
//     name: "Excel to PDF",
//     desc: "Turn Excel spreadsheets into secure PDF files.",
//     href: "/convert/excel-to-pdf",
//     icon: FileSpreadsheet,
//     color: "text-green-600",
//   },
//   {
//     name: "Image to PDF",
//     desc: "Convert JPG or PNG images into a single PDF file.",
//     href: "/convert/image-to-pdf",
//     icon: FileImage,
//     color: "text-orange-600",
//   },
//   {
//     name: "PDF to JPG",
//     desc: "Convert PDF pages into high-quality JPG images.",
//     href: "/convert/pdf-to-jpg",
//     icon: FileImage,
//     color: "text-amber-600",
//   },
//   {
//     name: "Merge PDF",
//     desc: "Combine multiple PDF files into one document.",
//     href: "/merge-pdf",
//     icon: FilePlus,
//     color: "text-emerald-600",
//   },
//   {
//     name: "Split PDF",
//     desc: "Split PDF pages or extract specific pages easily.",
//     href: "/split-pdf",
//     icon: Scissors,
//     color: "text-indigo-600",
//   },
//   {
//     name: "Compress PDF",
//     desc: "Reduce PDF file size without losing quality.",
//     href: "/compress-pdf",
//     icon: FileMinus,
//     color: "text-purple-600",
//   },
// ];

// export default function FreePdfToolsPage() {
//   return (
//     <main className="max-w-6xl mx-auto px-4 py-12">
//       {/* Heading */}
//       <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//         Free Online PDF Tools
//       </h1>

//       <p className="text-gray-600 max-w-3xl mb-10">
//         PDF Linx provides free online PDF tools to convert, merge, compress
//         and manage PDF files easily. No signup required, fast and secure.
//       </p>

//       {/* Tools Grid */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {tools.map((tool, index) => (
//           <Link
//             key={index}
//             href={tool.href}
//             className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
//           >
//             <div className="flex items-center gap-4 mb-4">
//               <tool.icon size={28} className={`${tool.color}`} />
//               <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
//                 {tool.name}
//               </h2>
//             </div>

//             <p className="text-sm text-gray-600">
//               {tool.desc}
//             </p>

//             <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
//               Use tool →
//             </span>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }























// // import Link from "next/link";

// // export const metadata = {
// //   title: "Free PDF Tools – PDF Linx",
// //   description:
// //     "Use free online PDF tools to convert, merge, compress and edit PDFs. No signup required.",
// // };

// // const tools = [
// //   {
// //     name: "PDF to Word Converter",
// //     desc: "Convert PDF files into editable Word documents online.",
// //     href: "/convert/pdf-to-word",
// //   },
// //   {
// //     name: "Word to PDF Converter",
// //     desc: "Convert Word documents into high-quality PDF files.",
// //     href: "/convert/word-to-pdf",
// //   },
// //   {
// //     name: "Excel to PDF Converter",
// //     desc: "Turn Excel spreadsheets into secure PDF documents.",
// //     href: "/convert/excel-to-pdf",
// //   },
// //   {
// //     name: "Image to PDF Converter",
// //     desc: "Convert JPG, PNG images into a single PDF file.",
// //     href: "/convert/image-to-pdf",
// //   },
// //   {
// //     name: "PDF to JPG Converter",
// //     desc: "Extract images from PDF or convert pages to JPG.",
// //     href: "/convert/pdf-to-jpg",
// //   },
// // ];

// // export default function FreePdfToolsPage() {
// //   return (
// //     <main className="max-w-5xl mx-auto px-4 py-10">
// //       <h1 className="text-3xl font-bold mb-4">
// //         Free Online PDF Tools
// //       </h1>

// //       <p className="text-gray-600 mb-8">
// //         PDF Linx provides free online tools to convert, merge, compress,
// //         and manage PDF files easily. No registration required.
// //       </p>

// //       <div className="grid md:grid-cols-2 gap-6">
// //         {tools.map((tool, index) => (
// //           <div
// //             key={index}
// //             className="border rounded-lg p-5 hover:shadow transition"
// //           >
// //             <h2 className="text-xl font-semibold mb-2">
// //               {tool.name}
// //             </h2>
// //             <p className="text-gray-600 mb-3">{tool.desc}</p>
// //             <Link
// //               href={tool.href}
// //               className="text-blue-600 font-medium"
// //             >
// //               Use tool →
// //             </Link>
// //           </div>
// //         ))}
// //       </div>
// //     </main>
// //   );
// // }
