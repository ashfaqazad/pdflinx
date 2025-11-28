"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  FileType,
  FileImage,
  FileSpreadsheet,
  Scissors,
  FileMinus,
  FilePlus,
  QrCode,
  Lock,
  Ruler,
  Image as ImageIcon, // ✅ renamed to avoid DOM conflict
  PenTool,
  Youtube,
} from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <nav className="bg-black text-white px-3 py-2 flex justify-between items-center relative z-50">
      {/* ✅ Left Side Brand Logo */}
      <Link href="/">
        <img
          src="/pdflinx-logo.svg"
          alt="pdflinx"
          width={200}
          height={30}
          style={{
            margin: 0,
            padding: 0,
            display: "block",
          }}
        />
      </Link>

      {/* ✅ Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6">
        <li>
          <Link href="/">Home</Link>
        </li>

        {/* ✅ PDF Tools */}
        <li
          className="relative"
          onMouseEnter={() => setOpenMenu("pdf")}
          onMouseLeave={() => {
            setTimeout(() => {
              const dropdown = document.getElementById("pdf-dropdown");
              if (!dropdown?.matches(":hover")) setOpenMenu(null);
            }, 200);
          }}
        >
          <button className="flex items-center gap-1">
            PDF Tools{" "}
            {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div
            id="pdf-dropdown"
            className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "pdf" ? "block" : "hidden"
              }`}
            onMouseEnter={() => setOpenMenu("pdf")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <ul className="space-y-2 text-sm">
              <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#E63946" /> PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} color="#457B9D" /> Word to PDF</Link></li>
              <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F4A261" /> Image to PDF</Link></li>
              <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} color="#2A9D8F" /> Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} color="#E76F51" /> Split PDF</Link></li>
              <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} color="#6A4C93" /> Compress PDF</Link></li>
              <li><Link href="/excel-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} color="#2D6A4F" /> Excel to PDF</Link></li>
            </ul>
          </div>
        </li>

        {/* ✅ All Tools */}
        <li
          className="relative"
          onMouseEnter={() => setOpenMenu("tools")}
          onMouseLeave={() => {
            setTimeout(() => {
              const dropdown = document.getElementById("tools-dropdown");
              if (!dropdown?.matches(":hover")) setOpenMenu(null);
            }, 200);
          }}
        >
          <button className="flex items-center gap-1">
            All Tools{" "}
            {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div
            id="tools-dropdown"
            className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "tools" ? "block" : "hidden"
              }`}
            onMouseEnter={() => setOpenMenu("tools")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <ul className="space-y-2 text-sm">
              <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} color="#0EA5E9" /> QR Generator</Link></li>
              <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} color="#F59E0B" /> Password Generator</Link></li>
              <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} color="#84CC16" /> Unit Converter</Link></li>
              <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Youtube size={16} color="#EF4444" /> YouTube Thumbnail</Link></li>
              <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#06B6D4" /> Image Compressor</Link></li>
              <li><Link href="/image-to-text" className="flex items-center gap-2 hover:text-red-600"><ImageIcon size={16} color="#3B82F6" /> Image to Text</Link></li>
              <li><Link href="/signature-maker" className="flex items-center gap-2 hover:text-red-600"><PenTool size={16} color="#10B981" /> Signature Maker</Link></li>
              <li><Link href="/heic-to-jpg" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} color="#F59E0B" /> HEIC to JPG</Link></li>
              <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} color="#9333EA" /> Text to PDF</Link></li>
            </ul>
          </div>
        </li>

        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      {/* ✅ Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-white text-2xl"
      >
        ☰
      </button>
      {/* ✅ Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
            </li>

            {/* PDF Tools Accordion */}
            <li>
              <button
                className="flex justify-between w-full items-center"
                onClick={() => toggleDropdown("pdf")}
              >
                <span>📄 PDF Tools</span>
                {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openMenu === "pdf" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li><Link href="/pdf-to-word" onClick={() => setMobileOpen(false)}><FileText size={14} color="#E63946" /> PDF to Word</Link></li>
                  <li><Link href="/word-to-pdf" onClick={() => setMobileOpen(false)}><FileType size={14} color="#457B9D" /> Word to PDF</Link></li>
                  <li><Link href="/image-to-pdf" onClick={() => setMobileOpen(false)}><FileImage size={14} color="#F4A261" /> Image to PDF</Link></li>
                  <li><Link href="/merge-pdf" onClick={() => setMobileOpen(false)}><FilePlus size={14} color="#2A9D8F" /> Merge PDF</Link></li>
                  <li><Link href="/split-pdf" onClick={() => setMobileOpen(false)}><Scissors size={14} color="#E76F51" /> Split PDF</Link></li>
                  <li><Link href="/compress-pdf" onClick={() => setMobileOpen(false)}><FileMinus size={14} color="#6A4C93" /> Compress PDF</Link></li>
                  <li><Link href="/excel-to-pdf" onClick={() => setMobileOpen(false)}><FileSpreadsheet size={14} color="#2D6A4F" /> Excel to PDF</Link></li>
                </ul>
              )}
            </li>

            {/* ✅ All Tools Accordion */}
            <li>
              <button
                className="flex justify-between w-full items-center"
                onClick={() => toggleDropdown("tools")}
              >
                <span>🧰 All Tools</span>
                {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openMenu === "tools" && (
                <ul className="pl-4 mt-2 space-y-1 text-sm">
                  <li><Link href="/qr-generator" onClick={() => setMobileOpen(false)}><QrCode size={14} color="#0EA5E9" /> QR Generator</Link></li>
                  <li><Link href="/password-gen" onClick={() => setMobileOpen(false)}><Lock size={14} color="#F59E0B" /> Password Generator</Link></li>
                  <li><Link href="/unit-converter" onClick={() => setMobileOpen(false)}><Ruler size={14} color="#84CC16" /> Unit Converter</Link></li>
                  <li><Link href="/youtube-thumbnail" onClick={() => setMobileOpen(false)}><Youtube size={14} color="#EF4444" /> YouTube Thumbnail</Link></li>
                  <li><Link href="/image-compressor" onClick={() => setMobileOpen(false)}><ImageIcon size={14} color="#06B6D4" /> Image Compressor</Link></li>
                  <li><Link href="/image-to-text" onClick={() => setMobileOpen(false)}><ImageIcon size={14} color="#3B82F6" /> Image to Text</Link></li>
                  <li><Link href="/signature-maker" onClick={() => setMobileOpen(false)}><PenTool size={14} color="#10B981" /> Signature Maker</Link></li>
                  <li><Link href="/heic-to-jpg" onClick={() => setMobileOpen(false)}><FileImage size={14} color="#F59E0B" /> HEIC to JPG</Link></li>
                  <li><Link href="/text-to-pdf" onClick={() => setMobileOpen(false)}><FileText size={14} color="#9333EA" /> Text to PDF</Link></li>
                </ul>
              )}
            </li>

            {/* ✅ Bottom Navigation Links */}
            <li><Link href="/blog" onClick={() => setMobileOpen(false)}>📰 Blog</Link></li>
            <li><Link href="/about" onClick={() => setMobileOpen(false)}>ℹ️ About</Link></li>
            <li><Link href="/contact" onClick={() => setMobileOpen(false)}>📩 Contact</Link></li>
          </ul>
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
//   Image,
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
//             // marginBottom: "12px",
//             display: "block", // 👈 ensure proper spacing in layout
//           }}
//         />
//       </Link>

//       {/* <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
//         <span className="text-red-500">🔗</span> pdflinx
//       </Link> */}

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li><Link href="/">Home</Link></li>

//         {/* PDF Tools */}
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
//             PDF Tools {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="pdf-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "pdf" ? "block" : "hidden"
//               }`}
//             onMouseEnter={() => setOpenMenu("pdf")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} />PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16} />Word to PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16} />Image to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16} />Merge PDF</Link></li>
//               <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16} />Split PDF</Link></li>
//               <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16} />Compress PDF</Link></li>
//               <li><Link href="/excel-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16} />Excel to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         {/* All Tools */}
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
//             All Tools {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </button>
//           <div
//             id="tools-dropdown"
//             className={`absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg p-4 w-64 transition-all duration-200 ${openMenu === "tools" ? "block" : "hidden"
//               }`}
//             onMouseEnter={() => setOpenMenu("tools")}
//             onMouseLeave={() => setOpenMenu(null)}
//           >
//             <ul className="space-y-2 text-sm">
//               <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16} />QR Generator</Link></li>
//               <li><Link href="/password-gen" className="flex items-center gap-2 hover:text-red-600"><Lock size={16} />Password Generator</Link></li>
//               <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} />Unit Converter</Link></li>
//               <li><Link href="/youtube-thumbnail" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16} />Youtube Thumbnail</Link></li>

//               <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><Image size={16} />Image Compressor</Link></li>
//               <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16} />Text to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         <li><Link href="/blog">Blog</Link></li>
//         <li><Link href="/about">About</Link></li>
//         <li><Link href="/contact">Contact</Link></li>
//       </ul>

//       {/* Mobile Menu Button */}
//       <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white text-2xl">
//         ☰
//       </button>

//       {/* Mobile Drawer */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-700 p-4 md:hidden">
//           <ul className="flex flex-col gap-3">
//             <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>

//             {/* PDF Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center"
//                 onClick={() => toggleDropdown("pdf")}
//               >
//                 <span>PDF Tools</span>
//                 {openMenu === "pdf" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "pdf" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/pdf-to-word">PDF to Word</Link></li>
//                   <li><Link href="/word-to-pdf">Word to PDF</Link></li>
//                   <li><Link href="/image-to-pdf">Image to PDF</Link></li>
//                   <li><Link href="/merge-pdf">Merge PDF</Link></li>
//                   <li><Link href="/split-pdf">Split PDF</Link></li>
//                   <li><Link href="/compress-pdf">Compress PDF</Link></li>
//                   <li><Link href="/excel-to-pdf">Excel to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             {/* All Tools Accordion */}
//             <li>
//               <button
//                 className="flex justify-between w-full items-center"
//                 onClick={() => toggleDropdown("tools")}
//               >
//                 <span>All Tools</span>
//                 {openMenu === "tools" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>
//               {openMenu === "tools" && (
//                 <ul className="pl-4 mt-2 space-y-1 text-sm">
//                   <li><Link href="/qr-generator">QR Generator</Link></li>
//                   <li><Link href="/password-generator">Password Generator</Link></li>
//                   <li><Link href="/unit-converter">Unit Converter</Link></li>
//                   <li><Link href="/image-compressor">Image Compressor</Link></li>
//                   <li><Link href="/youtube-thumbnail">Youtube thumbnail</Link></li>
//                   <li><Link href="/text-to-pdf">Text to PDF</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li><Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link></li>
//             <li><Link href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
//             <li><Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
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
//   Image,
// } from "lucide-react";

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState(null);

//   const toggleDropdown = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <nav className="bg-black text-white px-6 py-4 flex justify-between items-center relative z-50">
//       {/* Logo */}
//       <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
//         <span className="text-red-500">🔗</span> pdflinx
//       </Link>

//       {/* Navbar Links */}
//       <ul className="hidden md:flex items-center gap-6">
//         <li><Link href="/">Home</Link></li>

//         {/* PDF Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("pdf")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("pdf-dropdown");
//               if (!dropdown?.matches(":hover")) {
//                 setOpenMenu(null);
//               }
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 focus:outline-none">
//             PDF Tools{" "}
//             {openMenu === "pdf" ? (
//               <ChevronUp size={18} />
//             ) : (
//               <ChevronDown size={18} />
//             )}
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
//               <li><Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-red-600"><FileText size={16}/> PDF to Word</Link></li>
//               <li><Link href="/word-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileType size={16}/> Word to PDF</Link></li>
//               <li><Link href="/image-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileImage size={16}/> Image to PDF</Link></li>
//               <li><Link href="/merge-pdf" className="flex items-center gap-2 hover:text-red-600"><FilePlus size={16}/> Merge PDF</Link></li>
//               <li><Link href="/split-pdf" className="flex items-center gap-2 hover:text-red-600"><Scissors size={16}/> Split PDF</Link></li>
//               <li><Link href="/compress-pdf" className="flex items-center gap-2 hover:text-red-600"><FileMinus size={16}/> Compress PDF</Link></li>
//               <li><Link href="/excel-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileSpreadsheet size={16}/> Excel to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         {/* All Tools Dropdown */}
//         <li
//           className="relative"
//           onMouseEnter={() => setOpenMenu("tools")}
//           onMouseLeave={() => {
//             setTimeout(() => {
//               const dropdown = document.getElementById("tools-dropdown");
//               if (!dropdown?.matches(":hover")) {
//                 setOpenMenu(null);
//               }
//             }, 200);
//           }}
//         >
//           <button className="flex items-center gap-1 focus:outline-none">
//             All Tools{" "}
//             {openMenu === "tools" ? (
//               <ChevronUp size={18} />
//             ) : (
//               <ChevronDown size={18} />
//             )}
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
//               <li><Link href="/qr-generator" className="flex items-center gap-2 hover:text-red-600"><QrCode size={16}/> QR Code Generator</Link></li>
//               <li><Link href="/password-generator" className="flex items-center gap-2 hover:text-red-600"><Lock size={16}/> Password Generator</Link></li>
//               <li><Link href="/unit-converter" className="flex items-center gap-2 hover:text-red-600"><Ruler size={16}/> Unit Converter</Link></li>
//               <li><Link href="/image-compressor" className="flex items-center gap-2 hover:text-red-600"><Image size={16}/> Image Compressor</Link></li>
//               <li><Link href="/text-to-pdf" className="flex items-center gap-2 hover:text-red-600"><FileText size={16}/> Text to PDF</Link></li>
//             </ul>
//           </div>
//         </li>

//         <li><Link href="/blog">Blog</Link></li>
//         <li><Link href="/about">About</Link></li>
//         <li><Link href="/contact">Contact</Link></li>
//       </ul>

//       {/* Mobile Menu Button */}
//       <div className="md:hidden">
//         <button onClick={() => toggleDropdown("mobile")} className="text-white focus:outline-none">
//           ☰
//         </button>
//       </div>
//     </nav>
//   );
// }

