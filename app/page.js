"use client";

import { useRouter } from "next/navigation";
import {
  FileText, FileType, FileArchive, FileImage, FileSpreadsheet,
  Split, QrCode, Lock, Ruler, Youtube, Image as ImageIcon, PenTool
} from "lucide-react";

export default function HomeContent() {
  const router = useRouter();

  const tools = [
    { title: "PDF to Word Converter", desc: "Convert PDF files to editable Word documents instantly.", link: "/pdf-to-word", icon: <FileType className="w-12 h-12" />, color: "from-red-400 to-pink-500" },
    { title: "Merge PDF Files", desc: "Combine multiple PDF files into one single document.", link: "/merge-pdf", icon: <FileArchive className="w-12 h-12" />, color: "from-orange-400 to-red-500" },
    { title: "Split PDF Pages", desc: "Separate selected pages from a PDF into new files.", link: "/split-pdf", icon: <Split className="w-12 h-12" />, color: "from-amber-400 to-orange-500" },
    { title: "Compress PDF", desc: "Reduce PDF file size without losing quality online.", link: "/compress-pdf", icon: <FileText className="w-12 h-12" />, color: "from-yellow-400 to-amber-500" },
    { title: "Word to PDF", desc: "Convert Microsoft Word documents to high-quality PDF files.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-blue-400 to-cyan-500" },
    { title: "Image to PDF", desc: "Turn your JPG, PNG, or other images into a single PDF.", link: "/image-to-pdf", icon: <FileImage className="w-12 h-12" />, color: "from-emerald-400 to-teal-500" },
    { title: "Excel to PDF", desc: "Convert Excel spreadsheets to professional PDF documents.", link: "/excel-pdf", icon: <FileSpreadsheet className="w-12 h-12" />, color: "from-green-400 to-emerald-500" },
    { title: "QR Code Generator", desc: "Create QR codes instantly for links, text, or WiFi — free and secure.", link: "/qr-generator", icon: <QrCode className="w-12 h-12" />, color: "from-sky-400 to-blue-500" },
    { title: "Password Generator", desc: "Generate strong and secure passwords to protect your accounts.", link: "/password-gen", icon: <Lock className="w-12 h-12" />, color: "from-purple-400 to-indigo-500" },
    { title: "Unit Converter", desc: "Easily convert between length, weight, temperature, and more.", link: "/unit-converter", icon: <Ruler className="w-12 h-12" />, color: "from-lime-400 to-green-500" },
    { title: "YouTube Thumbnail Downloader", desc: "Download high-quality thumbnails from any YouTube video instantly.", link: "/youtube-thumbnail", icon: <Youtube className="w-12 h-12" />, color: "from-rose-500 to-red-600" },
    { title: "Image Compressor", desc: "Reduce image file size without losing visual quality online.", link: "/image-compressor", icon: <ImageIcon className="w-12 h-12" />, color: "from-cyan-400 to-blue-500" },
    { title: "Image to Text (OCR)", desc: "Extract readable text from images using advanced OCR technology.", link: "/image-to-text", icon: <ImageIcon className="w-12 h-12" />, color: "from-indigo-400 to-purple-500" },
    { title: "Signature Maker", desc: "Create and download your digital signature with ease.", link: "/signature-maker", icon: <PenTool className="w-12 h-12" />, color: "from-teal-400 to-emerald-500" }, // ← YEH GALTI THI!
    { title: "HEIC to JPG Converter", desc: "Convert iPhone HEIC photos into widely supported JPG format.", link: "/heic-to-jpg", icon: <FileImage className="w-12 h-12" />, color: "from-amber-400 to-orange-500" },
    { title: "Text to PDF", desc: "Turn plain text into a professional-looking PDF instantly.", link: "/text-to-pdf", icon: <FileText className="w-12 h-12" />, color: "from-violet-400 to-purple-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">


      {/* Hero Section — Perfect Decent & Professional */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-24 px-6 text-center">
        {/* Soft overlay for depth */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Free Online PDF Converter & Tools
          </h1>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Convert, merge, split, and compress your PDF files easily —
            100% free, secure, and no signup required.
          </p>

          <button
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-indigo-700 font-bold text-lg px-12 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Explore All Tools
          </button>
        </div>

        {/* Clean fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>




      {/* Why Choose Section */}
      <section className="py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Why Choose PDF Linx</h2>
          <p className="text-xl text-gray-600">Everything you need, completely free</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { emoji: "🔒", title: "Encrypted & Secure", text: "Every file is SSL-encrypted and automatically deleted from our servers after completion." },
            { emoji: "⚡", title: "Super-Fast Processing", text: "Cloud-based conversion ensures lightning speed without compromising quality or accuracy." },
            { emoji: "📱", title: "Works on All Devices", text: "Use PDF Linx on desktop, tablet, or mobile, no installation, just open and convert." },
            { emoji: "🧰", title: "All-in-One PDF Toolset", text: "Convert, merge, compress, split, or edit PDFs easily, everything you need in one place." },
            { emoji: "🆓", title: "100% Free Forever", text: "No limits, no paywalls, PDF Linx is completely free for personal and professional use." },
            { emoji: "😊", title: "Easy & User-Friendly", text: "Minimal design and fast workflow, anyone can convert files in seconds, no tech skills required." },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center"
            >
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6 bg-gray-50/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Popular Free PDF & Online Tools
          </h2>
          <p className="text-xl text-gray-600">Choose a tool and get started instantly</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, i) => (
            <div
              key={i}
              onClick={() => router.push(tool.link)}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-4"
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
              <div className="p-8 text-center">
                <div className={`p-6 rounded-full bg-gradient-to-br ${tool.color} text-white inline-flex mb-5 shadow-lg group-hover:scale-110 transition`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {tool.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                  Open Tool →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* Final CTA — Perfect Match with Hero */}
<section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20 text-center">
  {/* Subtle overlay */}
  <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative z-10 max-w-4xl mx-auto px-6">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Ready to Convert?
    </h2>
    
    <p className="text-xl md:text-2xl mb-10 opacity-95">
      All tools are 100% free • No signup required • Works on any device
    </p>

    <button
      onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
      className="bg-white text-indigo-700 font-bold text-lg px-12 py-5 rounded-full shadow-2xl hover:shadow-indigo-300 hover:scale-105 transition-all duration-300 transform"
    >
      Start Using Now
    </button>
  </div>
</section>

    </main>
  );
}




















// "use client";

// import { useRouter } from "next/navigation";
// import {
//   FileText,
//   FileType,
//   FileArchive,
//   FileImage,
//   FileSpreadsheet,
//   Split,
//   QrCode,
//   Lock,
//   Ruler,
//   Youtube,
//   Image as ImageIcon,
//   PenTool,
// } from "lucide-react";

// export default function HomeContent() {
//   const router = useRouter();

//   // 🧰 All Tools (PDF + Extra Tools)
//   const tools = [
//     // 🔹 PDF Tools
//     {
//       title: "PDF to Word Converter",
//       desc: "Convert PDF files to editable Word documents instantly.",
//       link: "/pdf-to-word",
//       icon: <FileType className="w-10 h-10 text-red-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Merge PDF Files",
//       desc: "Combine multiple PDF files into one single document.",
//       link: "/merge-pdf",
//       icon: <FileArchive className="w-10 h-10 text-red-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Split PDF Pages",
//       desc: "Separate selected pages from a PDF into new files.",
//       link: "/split-pdf",
//       icon: <Split className="w-10 h-10 text-red-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Compress PDF",
//       desc: "Reduce PDF file size without losing quality online.",
//       link: "/compress-pdf",
//       icon: <FileText className="w-10 h-10 text-red-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Word to PDF",
//       desc: "Convert Microsoft Word documents to high-quality PDF files.",
//       link: "/word-to-pdf",
//       icon: <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Image to PDF",
//       desc: "Turn your JPG, PNG, or other images into a single PDF.",
//       link: "/image-to-pdf",
//       icon: <FileImage className="w-10 h-10 text-green-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Excel to PDF",
//       desc: "Convert Excel spreadsheets to professional PDF documents.",
//       link: "/excel-pdf",
//       icon: <FileSpreadsheet className="w-10 h-10 text-yellow-600 mx-auto mb-4" />,
//     },

//     // 🔹 All Tools (non-PDF)
//     {
//       title: "QR Code Generator",
//       desc: "Create QR codes instantly for links, text, or WiFi — free and secure.",
//       link: "/qr-generator",
//       icon: <QrCode className="w-10 h-10 text-sky-500 mx-auto mb-4" />,
//     },
//     {
//       title: "Password Generator",
//       desc: "Generate strong and secure passwords to protect your accounts.",
//       link: "/password-gen",
//       icon: <Lock className="w-10 h-10 text-yellow-500 mx-auto mb-4" />,
//     },
//     {
//       title: "Unit Converter",
//       desc: "Easily convert between length, weight, temperature, and more.",
//       link: "/unit-converter",
//       icon: <Ruler className="w-10 h-10 text-lime-600 mx-auto mb-4" />,
//     },
//     {
//       title: "YouTube Thumbnail Downloader",
//       desc: "Download high-quality thumbnails from any YouTube video instantly.",
//       link: "/youtube-thumbnail",
//       icon: <Youtube className="w-10 h-10 text-red-500 mx-auto mb-4" />,
//     },
//     {
//       title: "Image Compressor",
//       desc: "Reduce image file size without losing visual quality online.",
//       link: "/image-compressor",
//       icon: <ImageIcon className="w-10 h-10 text-cyan-500 mx-auto mb-4" />,
//     },
//     {
//       title: "Image to Text (OCR)",
//       desc: "Extract readable text from images using advanced OCR technology.",
//       link: "/image-to-text",
//       icon: <ImageIcon className="w-10 h-10 text-blue-600 mx-auto mb-4" />,
//     },
//     {
//       title: "Signature Maker",
//       desc: "Create and download your digital signature with ease.",
//       link: "/signature-maker",
//       icon: <PenTool className="w-10 h-10 text-emerald-600 mx-auto mb-4" />,
//     },
//     {
//       title: "HEIC to JPG Converter",
//       desc: "Convert iPhone HEIC photos into widely supported JPG format.",
//       link: "/heic-to-jpg",
//       icon: <FileImage className="w-10 h-10 text-amber-500 mx-auto mb-4" />,
//     },
//     {
//       title: "Text to PDF",
//       desc: "Turn plain text into a professional-looking PDF instantly.",
//       link: "/text-to-pdf",
//       icon: <FileText className="w-10 h-10 text-purple-600 mx-auto mb-4" />,
//     },
//   ];

//   return (
//     <main className="w-full">
//       {/* Hero Section */}
//       <section className="bg-red-700 text-white py-20 px-6 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           Free Online PDF Converter & Tools
//         </h1>
//         <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
//           Convert, merge, split, and compress your PDF files easily, 100% free,
//           secure, and fast. No signup required.
//         </p>
//         <button
//           className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
//           onClick={() => router.push("#tools")}
//         >
//           Explore Tools
//         </button>
//       </section>



// {/* Features Section */}

// <section className="py-20 bg-[#f9fafb] text-center">
//   <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900">
//     Why Choose PDF Linx
//   </h2>

//   <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">🔒 Encrypted & Secure</h3>
//       <p className="text-gray-600">
//         Every file is SSL-encrypted and automatically deleted from our servers
//         after completion.
//       </p>
//     </div>

//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">⚡ Super-Fast Processing</h3>
//       <p className="text-gray-600">
//         Cloud-based conversion ensures lightning speed without compromising
//         quality or accuracy.
//       </p>
//     </div>

//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">🌍 Works on All Devices</h3>
//       <p className="text-gray-600">
//         Use PDF Linx on desktop, tablet, or mobile, no installation, just open
//         and convert.
//       </p>
//     </div>

//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">🧰 All-in-One PDF Toolset</h3>
//       <p className="text-gray-600">
//         Convert, merge, compress, split, or edit PDFs easily, everything you
//         need in one place.
//       </p>
//     </div>

//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">🆓 100% Free Forever</h3>
//       <p className="text-gray-600">
//         No limits, no paywalls, PDF Linx is completely free for personal and
//         professional use.
//       </p>
//     </div>

//     <div className="p-8 bg-white rounded-2xl shadow hover:shadow-md transition">
//       <h3 className="text-xl font-semibold mb-3">💬 Easy & User-Friendly</h3>
//       <p className="text-gray-600">
//         Minimal design and fast workflow, anyone can convert files in seconds,
//         no tech skills required.
//       </p>
//     </div>
//   </div>
// </section>




//       {/* Tools Section */}
//       <section id="tools" className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Popular Free PDF & Online Tools
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {tools.map((tool, i) => (
//             <div
//               key={i}
//               className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1"
//             >
//               {tool.icon}
//               <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
//               <p className="text-gray-600 mb-4">{tool.desc}</p>
//               <button
//                 className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
//                 onClick={() => router.push(tool.link)}
//               >
//                 Open Tool
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>





//     </main>
//   );
// }


