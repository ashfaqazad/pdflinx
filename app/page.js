"use client";

import { useRouter } from "next/navigation";
import {
  FileText, FileType, FileArchive, FileImage, FileSpreadsheet,
  Split, QrCode, Lock, Ruler, Youtube, Image as ImageIcon, PenTool, Stamp, ArrowUp
} from "lucide-react";
import { useState, useEffect } from "react";
import InternalLinkingSections from "@/components/InternalLinkingSections";


export default function HomeContent() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tools = [
    { title: "PDF to Word Converter", desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.", link: "/pdf-to-word", icon: <FileType className="w-10 h-10" />, color: "from-rose-500 to-pink-600" },
    { title: "Merge PDF Files", desc: "Combine multiple PDFs into one clean file – great for reports or presentations.", link: "/merge-pdf", icon: <FileArchive className="w-10 h-10" />, color: "from-orange-500 to-red-600" },
    { title: "Split PDF Pages", desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.", link: "/split-pdf", icon: <Split className="w-10 h-10" />, color: "from-amber-500 to-orange-600" },
    { title: "Compress PDF", desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.", link: "/compress-pdf", icon: <FileText className="w-10 h-10" />, color: "from-yellow-500 to-amber-600" },
    { title: "Word to PDF", desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-blue-500 to-indigo-600" },
    { title: "Image to PDF", desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.", link: "/image-to-pdf", icon: <FileImage className="w-10 h-10" />, color: "from-teal-500 to-emerald-600" },
    { title: "Excel to PDF", desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-10 h-10" />, color: "from-green-500 to-emerald-600" },
    { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-10 h-10" />, color: "from-cyan-500 to-blue-600" },
    { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-10 h-10" />, color: "from-purple-500 to-violet-600" },
    { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-10 h-10" />, color: "from-lime-500 to-green-600" },
    { title: "YouTube Thumbnail Downloader", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-10 h-10" />, color: "from-red-600 to-rose-600" },
    { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-10 h-10" />, color: "from-sky-500 to-cyan-600" },
    { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-10 h-10" />, color: "from-indigo-500 to-purple-600" },
    { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-10 h-10" />, color: "from-emerald-500 to-teal-600" },
    { title: "HEIC to JPG Converter", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-10 h-10" />, color: "from-orange-500 to-amber-600" },
    { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-10 h-10" />, color: "from-violet-500 to-purple-600" },
    { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <FileImage className="w-10 h-10" />, color: "from-pink-500 to-rose-600" },
    { title: "Add Watermark", desc: "Protect your images with text or logo watermarks – adjust position and transparency.", link: "/add-watermark", icon: <Stamp className="w-10 h-10" />, color: "from-blue-500 to-cyan-600" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            Tired of sketchy PDF tools?
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-4xl mx-auto leading-relaxed opacity-95">
            I built PDFLinx because I was fed up — slow sites, pop-up ads, files getting stored on shady servers.
            <br />
            <span className="block mt-4 text-xl font-semibold">
              Everything here runs in your browser. Your files never leave your device.
            </span>
            <span className="block mt-3 text-base">No ads. No signup. No nonsense.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10 text-base">
            <div className="flex items-center gap-3"><span className="text-2xl">🔒</span> Files Stay on Your Device</div>
            <div className="flex items-center gap-3"><span className="text-2xl">⚡</span> Actually Fast</div>
            <div className="flex items-center gap-3"><span className="text-2xl">🆓</span> Completely Free</div>
          </div>

          <button
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-indigo-700 font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:shadow-indigo-400 hover:scale-105 transition-all duration-300"
          >
            Check Out the Tools
          </button>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Why I Built This</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">And why you might actually like using it</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "No Creepy File Storage", text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.", emoji: "🔒" },
            { title: "Zero Ads", text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.", emoji: "🙅‍♂️" },
            { title: "Built for Speed", text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.", emoji: "⚡" },
            { title: "All Tools in One Place", text: "Stop jumping between 5 different websites. Everything you need is right here.", emoji: "🛠️" },
            { title: "No Account Needed", text: "Just open the site and start using. No email, no password, no spam later.", emoji: "🚀" },
            { title: "Works on Phone Too", text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.", emoji: "📱" },
          ].map((item, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100">
              <div className="text-6xl mb-6">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-base text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">All the Tools You Need</h2>
          <p className="text-xl text-gray-600">Pick one and get started — takes seconds</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, i) => (
            <div
              key={i}
              onClick={() => router.push(tool.link)}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-4"
            >
              <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
              <div className="p-8 text-center">
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{tool.desc}</p>
                <span className="text-indigo-600 font-semibold text-base flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                  Open Tool →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
      
      {/* <InternalLinkingSections /> */}


            {/* Final CTA */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 text-white py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Give It a Try</h2>
          <p className="text-xl mb-10 opacity-95">
            Pick any tool — I promise it won't waste your time.<br />
            Free. Fast. Private.
          </p>
          <button
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-indigo-700 font-bold text-lg px-16 py-6 rounded-2xl shadow-2xl hover:scale-105 hover:shadow-indigo-500 transition-all duration-300"
          >
            Start Now
          </button>
        </div>
      </section>


    </main>
  );
}





















// "use client";

// import { useRouter } from "next/navigation";
// import {
//   FileText, FileType, FileArchive, FileImage, FileSpreadsheet,
//   Split, QrCode, Lock, Ruler, Youtube, Image as ImageIcon, PenTool, Stamp, ArrowUp
// } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function HomeContent() {
//   const router = useRouter();
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 600);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const tools = [
//     { title: "PDF to Word Converter", desc: "Turn locked PDFs into editable Word files – formatting stays perfect, even with scanned docs.", link: "/pdf-to-word", icon: <FileType className="w-12 h-12" />, color: "from-rose-500 to-pink-600" },
//     { title: "Merge PDF Files", desc: "Combine multiple PDFs into one clean file – great for reports or presentations.", link: "/merge-pdf", icon: <FileArchive className="w-12 h-12" />, color: "from-orange-500 to-red-600" },
//     { title: "Split PDF Pages", desc: "Pull out specific pages from a big PDF – no need to keep the whole thing.", link: "/split-pdf", icon: <Split className="w-12 h-12" />, color: "from-amber-500 to-orange-600" },
//     { title: "Compress PDF", desc: "Shrink large PDFs down to email-friendly sizes without messing up the quality.", link: "/compress-pdf", icon: <FileText className="w-12 h-12" />, color: "from-yellow-500 to-amber-600" },
//     { title: "Word to PDF", desc: "Convert your Word docs to sharp, professional PDFs that look good everywhere.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-blue-500 to-indigo-600" },
//     { title: "Image to PDF", desc: "Turn photos, screenshots, or scans into a single PDF – supports batch upload too.", link: "/image-to-pdf", icon: <FileImage className="w-12 h-12" />, color: "from-teal-500 to-emerald-600" },
//     { title: "Excel to PDF", desc: "Export your spreadsheets as clean, print-ready PDFs – all sheets included.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-green-500 to-emerald-600" },
//     { title: "QR Code Generator", desc: "Make QR codes for links, WiFi passwords, menus – ready in seconds.", link: "/qr-generator", icon: <QrCode className="w-12 h-12" />, color: "from-cyan-500 to-blue-600" },
//     { title: "Password Generator", desc: "Create strong, random passwords that actually keep your accounts safe.", link: "/password-gen", icon: <Lock className="w-12 h-12" />, color: "from-purple-500 to-violet-600" },
//     { title: "Unit Converter", desc: "Quick conversions for length, weight, temperature – over 50 units supported.", link: "/unit-converter", icon: <Ruler className="w-12 h-12" />, color: "from-lime-500 to-green-600" },
//     { title: "YouTube Thumbnail Downloader", desc: "Grab full HD thumbnails from any YouTube video in one click.", link: "/youtube-thumbnail", icon: <Youtube className="w-12 h-12" />, color: "from-red-600 to-rose-600" },
//     { title: "Image Compressor", desc: "Reduce image size by up to 80% while keeping them looking sharp.", link: "/image-compressor", icon: <ImageIcon className="w-12 h-12" />, color: "from-sky-500 to-cyan-600" },
//     { title: "Image to Text (OCR)", desc: "Extract text from photos, scans, or screenshots – surprisingly accurate.", link: "/image-to-text", icon: <ImageIcon className="w-12 h-12" />, color: "from-indigo-500 to-purple-600" },
//     { title: "Signature Maker", desc: "Draw or type your signature and download it for documents.", link: "/signature-maker", icon: <PenTool className="w-12 h-12" />, color: "from-emerald-500 to-teal-600" },
//     { title: "HEIC to JPG Converter", desc: "Convert iPhone photos to regular JPGs that open everywhere.", link: "/heic-to-jpg", icon: <FileImage className="w-12 h-12" />, color: "from-orange-500 to-amber-600" },
//     { title: "Text to PDF", desc: "Turn plain text into a nicely formatted PDF with custom styling.", link: "/text-to-pdf", icon: <FileText className="w-12 h-12" />, color: "from-violet-500 to-purple-600" },
//     { title: "Image Converter", desc: "Switch between JPG, PNG, WebP, GIF – transparency stays intact.", link: "/image-converter", icon: <FileImage className="w-12 h-12" />, color: "from-pink-500 to-rose-600" },
//     { title: "Add Watermark", desc: "Protect your images with text or logo watermarks – adjust position and transparency.", link: "/add-watermark", icon: <Stamp className="w-12 h-12" />, color: "from-blue-500 to-cyan-600" },
//   ];

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

//       {/* Hero Section - Real Talk */}
//       <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-32 px-6 overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative z-10 max-w-5xl mx-auto text-center">
//           <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
//             Tired of Shitty PDF Tools?
//           </h1>
//           <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed opacity-95">
//             I built PDFLinx because I was fed up — slow sites, pop-up ads, files getting stored on shady servers.
//             <br />
//             <span className="block mt-6 text-2xl font-semibold">
//               Everything here runs in your browser. Your files never leave your device.
//             </span>
//             <span className="block mt-4 text-lg">No ads. No signup. No nonsense.</span>
//           </p>

//           <div className="flex flex-wrap justify-center gap-8 mb-12 text-lg">
//             <div className="flex items-center gap-3"><span className="text-3xl">🔒</span> Files Stay on Your Device</div>
//             <div className="flex items-center gap-3"><span className="text-3xl">⚡</span> Actually Fast</div>
//             <div className="flex items-center gap-3"><span className="text-3xl">🆓</span> Completely Free</div>
//           </div>

//           <button
//             onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//             className="bg-white text-indigo-700 font-bold text-xl px-16 py-6 rounded-2xl shadow-2xl hover:shadow-indigo-400 hover:scale-105 transition-all duration-300"
//           >
//             Check Out the Tools
//           </button>
//         </div>
//       </section>

//       {/* Why Choose - Honest Reasons */}
//       <section className="py-32 px-6">
//         <div className="text-center mb-20">
//           <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Why I Built This</h2>
//           <p className="text-2xl text-gray-600 max-w-3xl mx-auto">And why you might actually like using it</p>
//         </div>

//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { title: "No Creepy File Storage", text: "Most sites upload your files to their servers. Not here — everything processes locally in your browser.", emoji: "🔒" },
//             { title: "Zero Ads", text: "No popups, no video ads, no 'upgrade to premium' bullshit. Just a clean tool that works.", emoji: "🙅‍♂️" },
//             { title: "Built for Speed", text: "I hate waiting. These tools finish in seconds — no unnecessary loading screens.", emoji: "⚡" },
//             { title: "All Tools in One Place", text: "Stop jumping between 5 different websites. Everything you need is right here.", emoji: "🛠️" },
//             { title: "No Account Needed", text: "Just open the site and start using. No email, no password, no spam later.", emoji: "🚀" },
//             { title: "Works on Phone Too", text: "Tested on mobile — smooth drag-and-drop, no pinching or zooming hell.", emoji: "📱" },
//           ].map((item, i) => (
//             <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100">
//               <div className="text-7xl mb-8">{item.emoji}</div>
//               <h3 className="text-3xl font-bold text-gray-800 mb-5">{item.title}</h3>
//               <p className="text-lg text-gray-700 leading-relaxed">{item.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Tools Grid */}
//       <section id="tools" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50">
//         <div className="text-center mb-20">
//           <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">All the Tools You Need</h2>
//           <p className="text-2xl text-gray-600">Pick one and get started — takes seconds</p>
//         </div>

//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
//           {tools.map((tool, i) => (
//             <div
//               key={i}
//               onClick={() => router.push(tool.link)}
//               className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-6"
//             >
//               <div className={`h-3 bg-gradient-to-r ${tool.color}`}></div>
//               <div className="p-10 text-center">
//                 <div className={`p-8 rounded-2xl bg-gradient-to-br ${tool.color} text-white inline-flex mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
//                   {tool.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition">
//                   {tool.title}
//                 </h3>
//                 <p className="text-gray-600 mb-8 leading-relaxed">{tool.desc}</p>
//                 <span className="text-indigo-600 font-bold text-lg flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
//                   Open Tool →
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 text-white py-28 text-center overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative z-10 max-w-4xl mx-auto px-6">
//           <h2 className="text-5xl md:text-6xl font-black mb-8">Give It a Try</h2>
//           <p className="text-2xl mb-12 opacity-95">
//             Pick any tool — I promise it won't waste your time.<br />
//             Free. Fast. Private.
//           </p>
//           <button
//             onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
//             className="bg-white text-indigo-700 font-bold text-xl px-20 py-7 rounded-2xl shadow-2xl hover:scale-110 hover:shadow-indigo-500 transition-all duration-300"
//           >
//             Start Now
//           </button>
//         </div>
//       </section>

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="fixed bottom-10 right-10 bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all z-50"
//         >
//           <ArrowUp className="w-7 h-7" />
//         </button>
//       )}
//     </main>
//   );
// }



















// // "use client";

// // import { useRouter } from "next/navigation";
// // import {
// //   FileText, FileType, FileArchive, FileImage, FileSpreadsheet,
// //   Split, QrCode, Lock, Ruler, Youtube, Image as ImageIcon, PenTool, Stamp 
// // } from "lucide-react";

// // export default function HomeContent() {
// //   const router = useRouter();

// //   const tools = [
// //     { title: "PDF to Word Converter", desc: "Convert PDF files to editable Word documents instantly.", link: "/pdf-to-word", icon: <FileType className="w-12 h-12" />, color: "from-red-400 to-pink-500" },
// //     { title: "Merge PDF Files", desc: "Combine multiple PDF files into one single document.", link: "/merge-pdf", icon: <FileArchive className="w-12 h-12" />, color: "from-orange-400 to-red-500" },
// //     { title: "Split PDF Pages", desc: "Separate selected pages from a PDF into new files.", link: "/split-pdf", icon: <Split className="w-12 h-12" />, color: "from-amber-400 to-orange-500" },
// //     { title: "Compress PDF", desc: "Reduce PDF file size without losing quality online.", link: "/compress-pdf", icon: <FileText className="w-12 h-12" />, color: "from-yellow-400 to-amber-500" },
// //     { title: "Word to PDF", desc: "Convert Microsoft Word documents to high-quality PDF files.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-blue-400 to-cyan-500" },
// //     { title: "Image to PDF", desc: "Turn your JPG, PNG, or other images into a single PDF.", link: "/image-to-pdf", icon: <FileImage className="w-12 h-12" />, color: "from-emerald-400 to-teal-500" },
// //     { title: "Excel to PDF", desc: "Convert Excel spreadsheets to professional PDF documents.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-green-400 to-emerald-500" },
// //     { title: "QR Code Generator", desc: "Create QR codes instantly for links, text, or WiFi — free and secure.", link: "/qr-generator", icon: <QrCode className="w-12 h-12" />, color: "from-sky-400 to-blue-500" },
// //     { title: "Password Generator", desc: "Generate strong and secure passwords to protect your accounts.", link: "/password-gen", icon: <Lock className="w-12 h-12" />, color: "from-purple-400 to-indigo-500" },
// //     { title: "Unit Converter", desc: "Easily convert between length, weight, temperature, and more.", link: "/unit-converter", icon: <Ruler className="w-12 h-12" />, color: "from-lime-400 to-green-500" },
// //     { title: "YouTube Thumbnail Downloader", desc: "Download high-quality thumbnails from any YouTube video instantly.", link: "/youtube-thumbnail", icon: <Youtube className="w-12 h-12" />, color: "from-rose-500 to-red-600" },
// //     { title: "Image Compressor", desc: "Reduce image file size without losing visual quality online.", link: "/image-compressor", icon: <ImageIcon className="w-12 h-12" />, color: "from-cyan-400 to-blue-500" },
// //     { title: "Image to Text (OCR)", desc: "Extract readable text from images using advanced OCR technology.", link: "/image-to-text", icon: <ImageIcon className="w-12 h-12" />, color: "from-indigo-400 to-purple-500" },
// //     { title: "Signature Maker", desc: "Create and download your digital signature with ease.", link: "/signature-maker", icon: <PenTool className="w-12 h-12" />, color: "from-teal-400 to-emerald-500" }, // ← YEH GALTI THI!
// //     { title: "HEIC to JPG Converter", desc: "Convert iPhone HEIC photos into widely supported JPG format.", link: "/heic-to-jpg", icon: <FileImage className="w-12 h-12" />, color: "from-amber-400 to-orange-500" },
// //     { title: "Text to PDF", desc: "Turn plain text into a professional-looking PDF instantly.", link: "/text-to-pdf", icon: <FileText className="w-12 h-12" />, color: "from-violet-400 to-purple-500" },

// //     { title: "Image Converter", desc: "Turn plain text into a professional-looking PDF instantly.", link: "/image-converter", icon: <FileText className="w-12 h-12" />, color: "from-violet-400 to-purple-500" },

// //     {title: "Add Watermark", desc: "Add text or logo watermark to images easily and securely.", link: "/add-watermark",icon: <Stamp className="w-12 h-12" />, color: "from-blue-400 to-cyan-500" },

    
// //   ];

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">


// //       {/* Hero Section — Perfect Decent & Professional */}
// //       <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-24 px-6 text-center">
// //         {/* Soft overlay for depth */}
// //         <div className="absolute inset-0 bg-black/10"></div>

// //         <div className="relative z-10 max-w-5xl mx-auto">
// //           <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
// //             Free Online PDF Converter & Tools
// //           </h1>

// //           <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
// //             Convert, merge, split, and compress your PDF files easily —
// //             100% free, secure, and no signup required.
// //           </p>

// //           <button
// //             onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
// //             className="bg-white text-indigo-700 font-bold text-lg px-12 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
// //           >
// //             Explore All Tools
// //           </button>
// //         </div>

// //         {/* Clean fade to white */}
// //         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
// //       </section>

// //       {/* Why Choose Section */}
// //       <section className="py-24 px-6">
// //         <div className="text-center mb-16">
// //           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Why Choose PDF Linx</h2>
// //           <p className="text-xl text-gray-600">Everything you need, completely free</p>
// //         </div>

// //         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {[
// //             { emoji: "🔒", title: "Encrypted & Secure", text: "Every file is SSL-encrypted and automatically deleted from our servers after completion." },
// //             { emoji: "⚡", title: "Super-Fast Processing", text: "Cloud-based conversion ensures lightning speed without compromising quality or accuracy." },
// //             { emoji: "📱", title: "Works on All Devices", text: "Use PDF Linx on desktop, tablet, or mobile, no installation, just open and convert." },
// //             { emoji: "🧰", title: "All-in-One PDF Toolset", text: "Convert, merge, compress, split, or edit PDFs easily, everything you need in one place." },
// //             { emoji: "🆓", title: "100% Free Forever", text: "No limits, no paywalls, PDF Linx is completely free for personal and professional use." },
// //             { emoji: "😊", title: "Easy & User-Friendly", text: "Minimal design and fast workflow, anyone can convert files in seconds, no tech skills required." },
// //           ].map((item, i) => (
// //             <div
// //               key={i}
// //               className="group bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center"
// //             >
// //               <div className="text-6xl mb-4">{item.emoji}</div>
// //               <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
// //               <p className="text-gray-600 leading-relaxed">{item.text}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Tools Grid */}
// //       <section id="tools" className="py-24 px-6 bg-gray-50/50">
// //         <div className="text-center mb-16">
// //           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
// //             Popular Free PDF & Online Tools
// //           </h2>
// //           <p className="text-xl text-gray-600">Choose a tool and get started instantly</p>
// //         </div>

// //         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //           {tools.map((tool, i) => (
// //             <div
// //               key={i}
// //               onClick={() => router.push(tool.link)}
// //               className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-4"
// //             >
// //               <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
// //               <div className="p-8 text-center">
// //                 <div className={`p-6 rounded-full bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-110 transition`}>
// //                   {tool.icon}
// //                 </div>
// //                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition">
// //                   {tool.title}
// //                 </h3>
// //                 <p className="text-gray-600 text-sm leading-relaxed mb-6">
// //                   {tool.desc}
// //                 </p>
// //                 <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
// //                   Open Tool →
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// // {/* Final CTA — Perfect Match with Hero */}
// // <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20 text-center">
// //   {/* Subtle overlay */}
// //   <div className="absolute inset-0 bg-black/10"></div>

// //   <div className="relative z-10 max-w-4xl mx-auto px-6">
// //     <h2 className="text-4xl md:text-5xl font-bold mb-4">
// //       Ready to Convert?
// //     </h2>
    
// //     <p className="text-xl md:text-2xl mb-10 opacity-95">
// //       All tools are 100% free • No signup required • Works on any device
// //     </p>

// //     <button
// //       onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
// //       className="bg-white text-indigo-700 font-bold text-lg px-12 py-5 rounded-full shadow-2xl hover:shadow-indigo-300 hover:scale-105 transition-all duration-300 transform"
// //     >
// //       Start Using Now
// //     </button>
// //   </div>
// // </section>

// //     </main>
// //   );
// // }

















