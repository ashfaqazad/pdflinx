"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  FileText, FileType, FileImage, FileSpreadsheet,
  Scissors, FileMinus, FilePlus, QrCode, Lock, Ruler,
  Youtube, Image as ImageIcon, PenTool
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center py-3">
            <img src="/pdflinx-logo.svg" alt="PDF Linx" className="h-11 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">

            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">
              Home
            </Link>

            {/* === PDF TOOLS Dropdown (Only 7 Tools) === */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
                PDF Tools <ChevronDown size={18} className="group-hover:rotate-180 transition" />
              </button>

              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="grid grid-cols-2 gap-10 p-7 bg-gradient-to-b from-gray-50 to-white">
                  {/* Convert TO PDF */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-5">Convert TO PDF</h3>
                    <div className="space-y-3">
                      <Link href="/word-to-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FileType size={26} className="text-blue-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">WORD to PDF</span>
                      </Link>
                      <Link href="/excel-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FileSpreadsheet size={26} className="text-green-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">EXCEL to PDF</span>
                      </Link>
                      <Link href="/image-to-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FileImage size={26} className="text-orange-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">JPG to PDF</span>
                      </Link>
                    </div>
                  </div>

                  {/* Convert FROM PDF */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-5">Convert FROM PDF</h3>
                    <div className="space-y-3">
                      <Link href="/pdf-to-word" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FileText size={26} className="text-red-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">PDF to WORD</span>
                      </Link>
                      <Link href="/compress-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FileMinus size={26} className="text-purple-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">Compress PDF</span>
                      </Link>
                      <Link href="/merge-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <FilePlus size={26} className="text-emerald-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">Merge PDF</span>
                      </Link>
                      <Link href="/split-pdf" className="flex items-center gap-4 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition">
                        <Scissors size={26} className="text-amber-600" />
                        <span className="font-medium text-gray-700 hover:text-indigo-600">Split PDF</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === ALL TOOLS Dropdown (9 Tools including Text to PDF) === */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition">
                All Tools <ChevronDown size={18} className="group-hover:rotate-180 transition" />
              </button>

              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[620px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-7">
                  <h3 className="font-bold text-lg text-gray-800 mb-5 text-center">All Utility Tools</h3>
                  <div className="grid grid-cols-3 gap-5">
                    {[
                      { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
                      { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Gen" },
                      { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
                      { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YT Thumbnail" },
                      { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compress" },
                      { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
                      { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
                      { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
                      { href: "/heic-to-jpg", icon: FileImage, color: "text-orange-600", label: "HEIC to JPG" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-3 hover:bg-indigo-50 p-4 rounded-2xl transition group"
                      >
                        <item.icon size={34} className={item.color} />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 text-center leading-tight">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blog</Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" className="block font-semibold text-gray-800 py-2">Home</Link>
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                PDF Tools <ChevronDown className="group-open:rotate-180 transition" />
              </summary>
              <div className="pl-6 mt-2 space-y-2">
                <Link href="/pdf-to-word" className="block text-gray-600 hover:text-indigo-600 py-1">PDF to Word</Link>
                <Link href="/word-to-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Word to PDF</Link>
                <Link href="/image-to-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Image to PDF</Link>
                <Link href="/merge-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Merge PDF</Link>
                <Link href="/split-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Split PDF</Link>
                <Link href="/compress-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Compress PDF</Link>
                <Link href="/excel-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Excel to PDF</Link>
              </div>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                All Tools <ChevronDown className="group-open:rotate-180 transition" />
              </summary>
              <div className="pl-6 mt-2 space-y-2 text-sm">
                <Link href="/qr-generator" className="block text-gray-600 hover:text-indigo-600 py-1">QR Generator</Link>
                <Link href="/password-gen" className="block text-gray-600 hover:text-indigo-600 py-1">Password Generator</Link>
                <Link href="/unit-converter" className="block text-gray-600 hover:text-indigo-600 py-1">Unit Converter</Link>
                <Link href="/youtube-thumbnail" className="block text-gray-600 hover:text-indigo-600 py-1">YouTube Thumbnail</Link>
                <Link href="/image-compressor" className="block text-gray-600 hover:text-indigo-600 py-1">Image Compressor</Link>
                <Link href="/image-to-text" className="block text-gray-600 hover:text-indigo-600 py-1">Image to Text</Link>
                <Link href="/signature-maker" className="block text-gray-600 hover:text-indigo-600 py-1">Signature Maker</Link>
                <Link href="/text-to-pdf" className="block text-gray-600 hover:text-indigo-600 py-1">Text to PDF</Link>
                <Link href="/heic-to-jpg" className="block text-gray-600 hover:text-indigo-600 py-1">HEIC to JPG</Link>
              </div>
            </details>
            <Link href="/blog" className="block font-semibold text-gray-800 py-2">Blog</Link>
            <Link href="/about" className="block font-semibold text-gray-800 py-2">About</Link>
            <Link href="/contact" className="block font-semibold text-gray-800 py-2">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}



























// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ChevronDown,
//   FileText, FileType, FileImage, FileSpreadsheet,
//   Scissors, FileMinus, FilePlus, QrCode, Lock, Ruler,
//   Youtube, Image as ImageIcon, PenTool
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justifybetween items-center h-16">

//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <img
//               src="/pdflinx-logo.svg"
//               alt="PDF Linx"
//               className="h-10 w-auto"
//             />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition">
//               Home
//             </Link>

//             {/* PDF Tools Dropdown */}
//             <div className="relative group">
//               <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium transition">
//                 PDF Tools <ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition" />
//               </button>
//               <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-4">
//                 <div className="px-6 pb-4 space-y-3">
//                   {[
//                     { href: "/pdf-to-word", icon: FileText, color: "text-red-600", label: "PDF to Word" },
//                     { href: "/word-to-pdf", icon: FileType, color: "text-blue-600", label: "Word to PDF" },
//                     { href: "/image-to-pdf", icon: FileImage, color: "text-orange-600", label: "Image to PDF" },
//                     { href: "/merge-pdf", icon: FilePlus, color: "text-emerald-600", label: "Merge PDF" },
//                     { href: "/split-pdf", icon: Scissors, color: "text-amber-600", label: "Split PDF" },
//                     { href: "/compress-pdf", icon: FileMinus, color: "text-purple-600", label: "Compress PDF" },
//                     { href: "/excel-pdf", icon: FileSpreadsheet, color: "text-green-600", label: "Excel to PDF" },
//                   ].map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className="flex items-center gap-3 hover:bg-gray-50 px-4 py-3 rounded-xl transition group"
//                     >
//                       <item.icon size={18} className={item.color} />
//                       <span className="text-gray-700 group-hover:text-indigo-600 font-medium">{item.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* All Tools Dropdown */}
//             <div className="relative group">
//               <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium transition">
//                 All Tools <ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition" />
//               </button>
//               <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-4">
//                 <div className="grid grid-cols-2 gap-3 px-6 pb-5">
//                   {[
//                     { href: "/qr-generator", icon: QrCode, color: "text-sky-600", label: "QR Generator" },
//                     { href: "/password-gen", icon: Lock, color: "text-amber-600", label: "Password Gen" },
//                     { href: "/unit-converter", icon: Ruler, color: "text-lime-600", label: "Unit Converter" },
//                     { href: "/youtube-thumbnail", icon: Youtube, color: "text-red-600", label: "YT Thumbnail" },
//                     { href: "/image-compressor", icon: ImageIcon, color: "text-cyan-600", label: "Image Compress" },
//                     { href: "/image-to-text", icon: ImageIcon, color: "text-indigo-600", label: "Image to Text" },
//                     { href: "/signature-maker", icon: PenTool, color: "text-emerald-600", label: "Signature Maker" },
//                     { href: "/text-to-pdf", icon: FileText, color: "text-purple-600", label: "Text to PDF" },
//                   ].map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className="flex items-center gap-3 hover:bg-gray-50 px-4 py-3 rounded-xl transition group"
//                     >
//                       <item.icon size={18} className={item.color} />
//                       <span className="text-sm text-gray-700 group-hover:text-indigo-600 font-medium">{item.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-medium transition">
//               Blog
//             </Link>
//             <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium transition">
//               About
//             </Link>
//             <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium transition">
//               Contact
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="md:hidden text-gray-700 hover:text-indigo-600"
//           >
//             {mobileOpen ? "Close" : "Menu"}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100">
//           <div className="px-4 py-4 space-y-3">
//             <Link href="/" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Home</Link>
            
//             <button
//               onClick={() => setOpenMenu(openMenu === "pdf" ? null : "pdf")}
//               className="w-full text-left flex justify-between items-center text-gray-700 hover:text-indigo-600 font-medium py-2"
//             >
//               PDF Tools {openMenu === "pdf" ? "Up" : "Down"}
//             </button>
//             {openMenu === "pdf" && (
//               <div className="pl-6 space-y-2 pb-3">
//                 {["PDF to Word", "Word to PDF", "Image to PDF", "Merge PDF", "Split PDF", "Compress PDF", "Excel to PDF"].map((tool, i) => (
//                   <Link key={i} href={["/pdf-to-word","/word-to-pdf","/image-to-pdf","/merge-pdf","/split-pdf","/compress-pdf","/excel-pdf"][i]} 
//                     className="block text-gray-600 hover:text-indigo-600 py-1 text-sm"
//                     onClick={() => setMobileOpen(false)}
//                   >
//                     {tool}
//                   </Link>
//                 ))}
//               </div>
//             )}

//             <button
//               onClick={() => setOpenMenu(openMenu === "tools" ? null : "tools")}
//               className="w-full text-left flex justify-between items-center text-gray-700 hover:text-indigo-600 font-medium py-2"
//             >
//               All Tools {openMenu === "tools" ? "Up" : "Down"}
//             </button>
//             {openMenu === "tools" && (
//               <div className="pl-6 space-y-2 pb-3 text-sm">
//                 {["QR Generator", "Password Generator", "Unit Converter", "YouTube Thumbnail", "Image Compressor", "Image to Text", "Signature Maker", "Text to PDF"].map((tool, i) => (
//                   <Link key={i} href={["/qr-generator","/password-gen","/unit-converter","/youtube-thumbnail","/image-compressor","/image-to-text","/signature-maker","/text-to-pdf"][i]} 
//                     className="block text-gray-600 hover:text-indigo-600 py-1"
//                     onClick={() => setMobileOpen(false)}
//                   >
//                     {tool}
//                   </Link>
//                 ))}
//               </div>
//             )}

//             <Link href="/blog" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Blog</Link>
//             <Link href="/about" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">About</Link>
//             <Link href="/contact" className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Contact</Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
























// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
//   QrCode,
//   Lock,
//   Ruler,
//   Image as ImageIcon,
//   PenTool,
//   Youtube,
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const toggleDropdown = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <nav className="bg-black text-white font-medium px-3 py-2 flex justify-between items-center relative z-50">
//   {/* //   // <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50 font-[Nunito] font-bold tracking-wide">
//   // <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50 font-[Poppins] font-semibold tracking-wide"> */}

//     {/* ✅ Brand Logo */}
//       <Link href="/">
//         <img
//           src="/pdflinx-logo.svg"
//           alt="PDF Linx Logo"
//           width={200}
//           height={30}
//           style={{ margin: 0, padding: 0, display: "block" }}
//         />
//       </Link>

//       {/* ✅ Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li>
//           <Link href="/" className="hover:text-red-500">Home</Link>
//         </li>

//         {/* ✅ PDF Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("pdf")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("pdf-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             PDF Tools{" "}
//             {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="pdf-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${
//               openMenu === "pdf" ? "block" : "hidden"
//             }`}
//             onMouseEnter={() => setOpenMenu("pdf")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#E63946" /> PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} color="#457B9D" /> Word to PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F4A261" /> Image to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} color="#2A9D8F" /> Merge PDF</Link></li>
//               <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} color="#E76F51" /> Split PDF</Link></li>
//               <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} color="#6A4C93" /> Compress PDF</Link></li>
//               <li><Link href="/excel-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} color="#2D6A4F" /> Excel to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         {/* ✅ All Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("tools")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("tools-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             All Tools{" "}
//             {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="tools-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${
//               openMenu === "tools" ? "block" : "hidden"
//             }`}
//             onMouseEnter={() => setOpenMenu("tools")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} color="#0EA5E9" /> QR Generator</Link></li>
//               <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} color="#F59E0B" /> Password Generator</Link></li>
//               <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} color="#84CC16" /> Unit Converter</Link></li>
//               <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Youtube size={16} color="#EF4444" /> YouTube Thumbnail</Link></li>
//               <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#06B6D4" /> Image Compressor</Link></li>
//               <li><Link href="/image-to-text" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#3B82F6" /> Image to Text</Link></li>
//               <li><Link href="/signature-maker" className="flex items-center gap-2 hover:text-red-600"><PenTool size={16} color="#10B981" /> Signature Maker</Link></li>
//               <li><Link href="/heic-to-jpg" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F59E0B" /> HEIC to JPG</Link></li>
//               <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#9333EA" /> Text to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         <li><Link href="/blog" className="hover:text-red-500">Blog</Link></li>
//         <li><Link href="/about" className="hover:text-red-500">About</Link></li>
//         <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
//       </ul>

//       {/* ✅ Mobile Menu Button */}
//       <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white text-2xl">
//         ☰
//       </button>

//       {/* ✅ Mobile Drawer */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
//           <ul className="flex flex-col gap-3 text-white">
//             <li>
//               <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-red-500">
//                 🏠 Home
//               </Link>
//             </li>

//             {/* 📄 PDF Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("pdf")}
//               >
//                 <span>📄 PDF Tools</span>
//                 {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "pdf" && (
//                 <ul className="pl-4 mt-2 space-y-2 text-sm">
//                   <li><Link href="/pdf-to-word" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileText size={14} color="#E63946" /> PDF to Word</Link></li>
//                   <li><Link href="/word-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileType size={14} color="#457B9D" /> Word to PDF</Link></li>
//                   <li><Link href="/image-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileImage size={14} color="#F4A261" /> Image to PDF</Link></li>
//                   <li><Link href="/merge-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FilePlus size={14} color="#2A9D8F" /> Merge PDF</Link></li>
//                   <li><Link href="/split-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Scissors size={14} color="#E76F51" /> Split PDF</Link></li>
//                   <li><Link href="/compress-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileMinus size={14} color="#6A4C93" /> Compress PDF</Link></li>
//                   <li><Link href="/excel-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileSpreadsheet size={14} color="#2D6A4F" /> Excel to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* 🧰 All Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("tools")}
//               >
//                 <span>🧰 All Tools</span>
//                 {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "tools" && (
//                 <ul className="pl-4 mt-2 space-y-2 text-sm">
//                   <li><Link href="/qr-generator" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><QrCode size={14} color="#0EA5E9" /> QR Generator</Link></li>
//                   <li><Link href="/password-gen" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Lock size={14} color="#F59E0B" /> Password Generator</Link></li>
//                   <li><Link href="/unit-converter" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Ruler size={14} color="#84CC16" /> Unit Converter</Link></li>
//                   <li><Link href="/youtube-thumbnail" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Youtube size={14} color="#EF4444" /> YouTube Thumbnail</Link></li>
//                   <li><Link href="/image-compressor" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><ImageIcon size={14} color="#06B6D4" /> Image Compressor</Link></li>
//                   <li><Link href="/image-to-text" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><ImageIcon size={14} color="#3B82F6" /> Image to Text</Link></li>
//                   <li><Link href="/signature-maker" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><PenTool size={14} color="#10B981" /> Signature Maker</Link></li>
//                   <li><Link href="/heic-to-jpg" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileImage size={14} color="#F59E0B" /> HEIC to JPG</Link></li>
//                   <li><Link href="/text-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileText size={14} color="#9333EA" /> Text to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* ✅ Bottom Links */}
//             <li><Link href="/blog" onClick={() => setMobileOpen(false)}>📰 Blog</Link></li>
//             <li><Link href="/about" onClick={() => setMobileOpen(false)}>ℹ️ About</Link></li>
//             <li><Link href="/contact" onClick={() => setMobileOpen(false)}>📩 Contact</Link></li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }























// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
//   QrCode,
//   Lock,
//   Ruler,
//   Image as ImageIcon,
//   PenTool,
//   Youtube,
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const toggleDropdown = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50">
//       {/* ✅ Brand Logo */}
//       <Link href="/">
//         <img
//           src="/pdflinx-logo.svg"
//           alt="PDF Linx"
//           width={200}
//           height={30}
//           style={{ margin: 0, padding: 0, display: "block" }}
//         />
//       </Link>

//       {/* ✅ Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li>
//           <Link href="/" className="hover:text-red-500">Home</Link>
//         </li>

//         {/* ✅ PDF Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("pdf")}
//           onMouseLeave={() => setOpenMenu(null)}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             PDF Tools {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           {openMenu === "pdf" && (
//             <div className="absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64">
//               <ul className="space-y-2 text-sm">
//                 <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#E63946" /> PDF to Word</Link></li>
//                 <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} color="#457B9D" /> Word to PDF</Link></li>
//                 <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F4A261" /> Image to PDF</Link></li>
//                 <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} color="#2A9D8F" /> Merge PDF</Link></li>
//                 <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} color="#E76F51" /> Split PDF</Link></li>
//                 <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} color="#6A4C93" /> Compress PDF</Link></li>
//                 <li><Link href="/excel-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} color="#2D6A4F" /> Excel to PDF</Link></li>
//               </ul>
//             </div>
//           )}
//         </li>

//         {/* ✅ All Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("tools")}
//           onMouseLeave={() => setOpenMenu(null)}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             All Tools {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           {openMenu === "tools" && (
//             <div className="absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64">
//               <ul className="space-y-2 text-sm">
//                 <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} color="#0EA5E9" /> QR Generator</Link></li>
//                 <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} color="#F59E0B" /> Password Generator</Link></li>
//                 <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} color="#84CC16" /> Unit Converter</Link></li>
//                 <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Youtube size={16} color="#EF4444" /> YouTube Thumbnail</Link></li>
//                 <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#06B6D4" /> Image Compressor</Link></li>
//                 <li><Link href="/image-to-text" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#3B82F6" /> Image to Text</Link></li>
//                 <li><Link href="/signature-maker" className="flex items-center gap-2 hover:text-red-600"><PenTool size={16} color="#10B981" /> Signature Maker</Link></li>
//                 <li><Link href="/heic-to-jpg" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F59E0B" /> HEIC to JPG</Link></li>
//                 <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#9333EA" /> Text to PDF</Link></li>
//               </ul>
//             </div>
//           )}
//         </li>

//         <li><Link href="/blog" className="hover:text-red-500">Blog</Link></li>
//         <li><Link href="/about" className="hover:text-red-500">About</Link></li>
//         <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
//       </ul>

//       {/* ✅ Mobile Menu Button */}
//       <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white text-2xl">
//         ☰
//       </button>

//       {/* ✅ Mobile Drawer */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
//           <ul className="flex flex-col gap-3 text-white">
//             <li>
//               <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-red-500">
//                 🏠 Home
//               </Link>
//             </li>

//             {/* 📄 PDF Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("pdf")}
//               >
//                 <span>📄 PDF Tools</span>
//                 {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "pdf" && (
//                 <ul className="pl-4 mt-2 space-y-2 text-sm">
//                   <li><Link href="/pdf-to-word" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileText size={14} color="#E63946" /> PDF to Word</Link></li>
//                   <li><Link href="/word-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileType size={14} color="#457B9D" /> Word to PDF</Link></li>
//                   <li><Link href="/image-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileImage size={14} color="#F4A261" /> Image to PDF</Link></li>
//                   <li><Link href="/merge-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FilePlus size={14} color="#2A9D8F" /> Merge PDF</Link></li>
//                   <li><Link href="/split-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Scissors size={14} color="#E76F51" /> Split PDF</Link></li>
//                   <li><Link href="/compress-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileMinus size={14} color="#6A4C93" /> Compress PDF</Link></li>
//                   <li><Link href="/excel-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileSpreadsheet size={14} color="#2D6A4F" /> Excel to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* 🧰 All Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("tools")}
//               >
//                 <span>🧰 All Tools</span>
//                 {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "tools" && (
//                 <ul className="pl-4 mt-2 space-y-2 text-sm">
//                   <li><Link href="/qr-generator" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><QrCode size={14} color="#0EA5E9" /> QR Generator</Link></li>
//                   <li><Link href="/password-gen" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Lock size={14} color="#F59E0B" /> Password Generator</Link></li>
//                   <li><Link href="/unit-converter" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Ruler size={14} color="#84CC16" /> Unit Converter</Link></li>
//                   <li><Link href="/youtube-thumbnail" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><Youtube size={14} color="#EF4444" /> YouTube Thumbnail</Link></li>
//                   <li><Link href="/image-compressor" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><ImageIcon size={14} color="#06B6D4" /> Image Compressor</Link></li>
//                   <li><Link href="/image-to-text" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><ImageIcon size={14} color="#3B82F6" /> Image to Text</Link></li>
//                   <li><Link href="/signature-maker" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><PenTool size={14} color="#10B981" /> Signature Maker</Link></li>
//                   <li><Link href="/heic-to-jpg" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileImage size={14} color="#F59E0B" /> HEIC to JPG</Link></li>
//                   <li><Link href="/text-to-pdf" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><FileText size={14} color="#9333EA" /> Text to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* ✅ Bottom Navigation */}
//             <li><Link href="/blog" onClick={() => setMobileOpen(false)}>📰 Blog</Link></li>
//             <li><Link href="/about" onClick={() => setMobileOpen(false)}>ℹ️ About</Link></li>
//             <li><Link href="/contact" onClick={() => setMobileOpen(false)}>📩 Contact</Link></li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }

























// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
//   QrCode,
//   Lock,
//   Ruler,
//   Image as ImageIcon,
//   PenTool,
//   Youtube,
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const toggleDropdown = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50">
//       {/* ✅ Left Side Brand Logo */}
//       <Link href="/">
//         <img
//           src="/pdflinx-logo.svg"
//           alt="PDF Linx Logo"
//           width={200}
//           height={30}
//           style={{
//             margin: 0,
//             padding: 0,
//             display: "block",
//           }}
//         />
//       </Link>

//       {/* ✅ Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li>
//           <Link href="/" className="hover:text-red-500">Home</Link>
//         </li>

//         {/* ✅ PDF Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("pdf")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("pdf-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             PDF Tools{" "}
//             {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="pdf-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${
//               openMenu === "pdf" ? "block" : "hidden"
//             }`}
//             onMouseEnter={() => setOpenMenu("pdf")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#E63946" /> PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} color="#457B9D" /> Word to PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F4A261" /> Image to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} color="#2A9D8F" /> Merge PDF</Link></li>
//               <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} color="#E76F51" /> Split PDF</Link></li>
//               <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} color="#6A4C93" /> Compress PDF</Link></li>
//               <li><Link href="/excel-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} color="#2D6A4F" /> Excel to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         {/* ✅ All Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("tools")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("tools-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 hover:text-red-500">
//             All Tools{" "}
//             {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="tools-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${
//               openMenu === "tools" ? "block" : "hidden"
//             }`}
//             onMouseEnter={() => setOpenMenu("tools")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} color="#0EA5E9" /> QR Generator</Link></li>
//               <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} color="#F59E0B" /> Password Generator</Link></li>
//               <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} color="#84CC16" /> Unit Converter</Link></li>
//               <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Youtube size={16} color="#EF4444" /> YouTube Thumbnail</Link></li>
//               <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#06B6D4" /> Image Compressor</Link></li>
//               <li><Link href="/image-to-text" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#3B82F6" /> Image to Text</Link></li>
//               <li><Link href="/signature-maker" className="flex items-center gap-2 hover:text-red-600"><PenTool size={16} color="#10B981" /> Signature Maker</Link></li>
//               <li><Link href="/heic-to-jpg" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F59E0B" /> HEIC to JPG</Link></li>
//               <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#9333EA" /> Text to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         <li><Link href="/blog" className="hover:text-red-500">Blog</Link></li>
//         <li><Link href="/about" className="hover:text-red-500">About</Link></li>
//         <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
//       </ul>

//       {/* ✅ Mobile Menu Button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="md:hidden text-white text-2xl"
//       >
//         ☰
//       </button>

//       {/* ✅ Mobile Drawer */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
//           <ul className="flex flex-col gap-3 text-white">
//             <li>
//               <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-red-500">
//                 🏠 Home
//               </Link>
//             </li>

//             {/* 📄 PDF Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("pdf")}
//               >
//                 <span>📄 PDF Tools</span>
//                 {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "pdf" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/pdf-to-word" onClick={() => setMobileOpen(false)}>PDF to Word</Link></li>
//                   <li><Link href="/word-to-pdf" onClick={() => setMobileOpen(false)}>Word to PDF</Link></li>
//                   <li><Link href="/image-to-pdf" onClick={() => setMobileOpen(false)}>Image to PDF</Link></li>
//                   <li><Link href="/merge-pdf" onClick={() => setMobileOpen(false)}>Merge PDF</Link></li>
//                   <li><Link href="/split-pdf" onClick={() => setMobileOpen(false)}>Split PDF</Link></li>
//                   <li><Link href="/compress-pdf" onClick={() => setMobileOpen(false)}>Compress PDF</Link></li>
//                   <li><Link href="/excel-pdf" onClick={() => setMobileOpen(false)}>Excel to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* 🧰 All Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center hover:text-red-500"
//                 onClick={() => toggleDropdown("tools")}
//               >
//                 <span>🧰 All Tools</span>
//                 {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "tools" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/qr-generator" onClick={() => setMobileOpen(false)}>QR Generator</Link></li>
//                   <li><Link href="/password-gen" onClick={() => setMobileOpen(false)}>Password Generator</Link></li>
//                   <li><Link href="/unit-converter" onClick={() => setMobileOpen(false)}>Unit Converter</Link></li>
//                   <li><Link href="/youtube-thumbnail" onClick={() => setMobileOpen(false)}>YouTube Thumbnail</Link></li>
//                   <li><Link href="/image-compressor" onClick={() => setMobileOpen(false)}>Image Compressor</Link></li>
//                   <li><Link href="/image-to-text" onClick={() => setMobileOpen(false)}>Image to Text</Link></li>
//                   <li><Link href="/signature-maker" onClick={() => setMobileOpen(false)}>Signature Maker</Link></li>
//                   <li><Link href="/heic-to-jpg" onClick={() => setMobileOpen(false)}>HEIC to JPG</Link></li>
//                   <li><Link href="/text-to-pdf" onClick={() => setMobileOpen(false)}>Text to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* ✅ Bottom Links */}
//             <li><Link href="/blog" onClick={() => setMobileOpen(false)}>📰 Blog</Link></li>
//             <li><Link href="/about" onClick={() => setMobileOpen(false)}>ℹ️ About</Link></li>
//             <li><Link href="/contact" onClick={() => setMobileOpen(false)}>📩 Contact</Link></li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }




















// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   FileType,
//   FileImage,
//   FileSpreadsheet,
//   Scissors,
//   FileMinus,
//   FilePlus,
//   QrCode,
//   Lock,
//   Ruler,
//   Image as ImageIcon, // ✅ renamed to avoid DOM conflict
//   PenTool,
//   Youtube,
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const toggleDropdown = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50">
//       {/* ✅ Left Side Brand Logo */}
//       <Link href="/">
//         <img
//           src="/pdflinx-logo.svg"
//           alt="pdflinx"
//           width={200}
//           height={30}
//           style={{
//             margin: 0,
//             padding: 0,
//             display: "block",
//           }}
//         />
//       </Link>

//       {/* ✅ Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li>
//           <Link href="/">Home</Link>
//         </li>

//         {/* ✅ PDF Tools */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("pdf")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("pdf-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1">
//             PDF Tools{" "}
//             {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="pdf-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "pdf" ? "block" : "hidden"
//               }`}
//             onMouseEnter={() => setOpenMenu("pdf")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#E63946" /> PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} color="#457B9D" /> Word to PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F4A261" /> Image to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} color="#2A9D8F" /> Merge PDF</Link></li>
//               <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} color="#E76F51" /> Split PDF</Link></li>
//               <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} color="#6A4C93" /> Compress PDF</Link></li>
//               <li><Link href="/excel-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} color="#2D6A4F" /> Excel to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         {/* ✅ All Tools */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("tools")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("tools-dropdown");
//               if (!dropdown?.matches(":hover")) setOpenMenu(null);
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1">
//             All Tools{" "}
//             {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="tools-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "tools" ? "block" : "hidden"
//               }`}
//             onMouseEnter={() => setOpenMenu("tools")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} color="#0EA5E9" /> QR Generator</Link></li>
//               <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} color="#F59E0B" /> Password Generator</Link></li>
//               <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} color="#84CC16" /> Unit Converter</Link></li>
//               <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Youtube size={16} color="#EF4444" /> YouTube Thumbnail</Link></li>
//               <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#06B6D4" /> Image Compressor</Link></li>
//               <li><Link href="/image-to-text" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#3B82F6" /> Image to Text</Link></li>
//               <li><Link href="/signature-maker" className="flex items-center gap-2 hover:text-red-600"><PenTool size={16} color="#10B981" /> Signature Maker</Link></li>
//               <li><Link href="/heic-to-jpg" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F59E0B" /> HEIC to JPG</Link></li>
//               <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#9333EA" /> Text to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         <li><Link href="/blog">Blog</Link></li>
//         <li><Link href="/about">About</Link></li>
//         <li><Link href="/contact">Contact</Link></li>
//       </ul>

//       {/* ✅ Mobile Menu Button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="md:hidden text-white text-2xl"
//       >
//         ☰
//       </button>
//       {/* ✅ Mobile Drawer */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
//           <ul className="flex flex-col gap-3">
//             <li>
//               <Link href="/" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
//             </li>

//             {/* PDF Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center"
//                 onClick={() => toggleDropdown("pdf")}
//               >
//                 <span>📄 PDF Tools</span>
//                 {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "pdf" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/pdf-to-word" onClick={() => setMobileOpen(false)}><FileText size={14} color="#E63946" /> PDF to Word</Link></li>
//                   <li><Link href="/word-to-pdf" onClick={() => setMobileOpen(false)}><FileType size={14} color="#457B9D" /> Word to PDF</Link></li>
//                   <li><Link href="/image-to-pdf" onClick={() => setMobileOpen(false)}><FileImage size={14} color="#F4A261" /> Image to PDF</Link></li>
//                   <li><Link href="/merge-pdf" onClick={() => setMobileOpen(false)}><FilePlus size={14} color="#2A9D8F" /> Merge PDF</Link></li>
//                   <li><Link href="/split-pdf" onClick={() => setMobileOpen(false)}><Scissors size={14} color="#E76F51" /> Split PDF</Link></li>
//                   <li><Link href="/compress-pdf" onClick={() => setMobileOpen(false)}><FileMinus size={14} color="#6A4C93" /> Compress PDF</Link></li>
//                   <li><Link href="/excel-pdf" onClick={() => setMobileOpen(false)}><FileSpreadsheet size={14} color="#2D6A4F" /> Excel to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* ✅ All Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center"
//                 onClick={() => toggleDropdown("tools")}
//               >
//                 <span>🧰 All Tools</span>
//                 {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "tools" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/qr-generator" onClick={() => setMobileOpen(false)}><QrCode size={14} color="#0EA5E9" /> QR Generator</Link></li>
//                   <li><Link href="/password-gen" onClick={() => setMobileOpen(false)}><Lock size={14} color="#F59E0B" /> Password Generator</Link></li>
//                   <li><Link href="/unit-converter" onClick={() => setMobileOpen(false)}><Ruler size={14} color="#84CC16" /> Unit Converter</Link></li>
//                   <li><Link href="/youtube-thumbnail" onClick={() => setMobileOpen(false)}><Youtube size={14} color="#EF4444" /> YouTube Thumbnail</Link></li>
//                   <li><Link href="/image-compressor" onClick={() => setMobileOpen(false)}><ImageIcon size={14} color="#06B6D4" /> Image Compressor</Link></li>
//                   <li><Link href="/image-to-text" onClick={() => setMobileOpen(false)}><ImageIcon size={14} color="#3B82F6" /> Image to Text</Link></li>
//                   <li><Link href="/signature-maker" onClick={() => setMobileOpen(false)}><PenTool size={14} color="#10B981" /> Signature Maker</Link></li>
//                   <li><Link href="/heic-to-jpg" onClick={() => setMobileOpen(false)}><FileImage size={14} color="#F59E0B" /> HEIC to JPG</Link></li>
//                   <li><Link href="/text-to-pdf" onClick={() => setMobileOpen(false)}><FileText size={14} color="#9333EA" /> Text to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* ✅ Bottom Navigation Links */}
//             <li><Link href="/blog" onClick={() => setMobileOpen(false)}>📰 Blog</Link></li>
//             <li><Link href="/about" onClick={() => setMobileOpen(false)}>ℹ️ About</Link></li>
//             <li><Link href="/contact" onClick={() => setMobileOpen(false)}>📩 Contact</Link></li>
//           </ul>
//         </div>
//       )}


//     </nav>
//   );
// }


















