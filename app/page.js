"use client";

import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  FileText,
  FileType,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  Split,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const tools = [
    {
      title: "PDF to Word Converter",
      desc: "Convert PDF files to editable Word documents instantly.",
      link: "/pdf-to-word",
      icon: (
        <FileType className="w-10 h-10 text-red-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Merge PDF Files",
      desc: "Combine multiple PDF files into one single document.",
      link: "/merge-pdf",
      icon: (
        <FileArchive className="w-10 h-10 text-red-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Split PDF Pages",
      desc: "Separate selected pages from a PDF into new files.",
      link: "/split-pdf",
      icon: (
        <Split className="w-10 h-10 text-red-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Compress PDF",
      desc: "Reduce PDF file size without losing quality online.",
      link: "/compress-pdf",
      icon: (
        <FileText className="w-10 h-10 text-red-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Word to PDF",
      desc: "Convert Microsoft Word documents to high-quality PDF files.",
      link: "/word-to-pdf",
      icon: (
        <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Image to PDF",
      desc: "Turn your JPG, PNG, or other images into a single PDF.",
      link: "/image-to-pdf",
      icon: (
        <FileImage className="w-10 h-10 text-green-600 mx-auto mb-4" />
      ),
    },
    {
      title: "Excel to PDF",
      desc: "Convert Excel spreadsheets to professional PDF documents.",
      link: "/excel-pdf",
      icon: (
        <FileImage className="w-10 h-10 text-blue-600 mx-auto mb-4" />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Free Online PDF Converter | Convert, Merge & Compress PDF Files</title>
        <meta
          name="description"
          content="Convert PDF to Word, merge, split, and compress PDF files online for free. Fast, secure, and no signup needed."
        />
        <meta
          name="keywords"
          content="PDF converter, merge PDF, split PDF, compress PDF, word to pdf, pdf to word, online pdf tools"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-red-700 dark:text-white py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free Online PDF Converter & Tools
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto dark:text-white">
            Convert, merge, split, and compress your PDF files easily — 100%
            free, secure, and fast. No signup required.
          </p>
          <button
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => router.push("#tools")}
          >
            Explore PDF Tools
          </button>
        </section>

        {/* Tools Section */}
        <section
          id="tools"
          className="py-16 px-6 max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-10">
            Popular Free PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {tool.icon}
                <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
                <p className="text-gray-600 mb-4">{tool.desc}</p>
                <button
                  className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                  onClick={() => router.push(tool.link)}
                  aria-label={`Open ${tool.title}`}
                >
                  Open Tool
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-gray-100 py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Our PDF Converter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
              <p className="text-gray-600">
                All PDF tools are 100% free — no subscriptions or hidden costs.
              </p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
              <p className="text-gray-600">
                Process files quickly with full data security and privacy.
              </p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Signup Needed</h3>
              <p className="text-gray-600">
                Use all tools instantly — no login or account required.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}























// "use client";

// import { useRouter } from "next/navigation";
// import { FileText, FileType, FileArchive, FileImage, FileSpreadsheet, Split } from "lucide-react";

// export default function Home() {
//   const router = useRouter();

//   const tools = [
//     { title: "PDF to Word", desc: "Convert PDF files to editable Word documents.", link: "/pdf-to-word", icon: <FileType className="w-10 h-10 text-red-600 mx-auto mb-4" /> },
//     { title: "Merge PDF", desc: "Combine multiple PDF files into one.", link: "/merge-pdf", icon: <FileArchive className="w-10 h-10 text-red-600 mx-auto mb-4" /> },
//     { title: "Split PDF", desc: "Separate PDF pages into different files.", link: "/split-pdf", icon: <Split className="w-10 h-10 text-red-600 mx-auto mb-4" /> },
//     { title: "Compress PDF", desc: "Reduce PDF file size without losing quality.", link: "/compress-pdf", icon: <FileText className="w-10 h-10 text-red-600 mx-auto mb-4" /> },
//     { title: "Word to PDF", desc: "Convert Word documents to PDF easily.", link: "/word-to-pdf", icon: <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto mb-4" /> },
//     { title: "Image to PDF", desc: "Turn your images into a single PDF file.", link: "/image-to-pdf", icon: <FileImage className="w-10 h-10 text-green-600 mx-auto mb-4" /> },
//     { title: "Excel to PDF", desc: "Convert Excel files to PDF with high quality.", link: "/excel-pdf", icon: <FileImage className="w-10 h-10 text-blue-600 mx-auto mb-4" /> },
//   ];

//   return (
//     <main className="w-full">
//       {/* Hero Section */}
//       <section className="bg-red-700 dark:text-white py-20 px-6 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           PSD TOOLS – Free Online PDF & Document Tools
//         </h1>
//         <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto dark:text-white">
//           Convert, merge, split and compress your PDF & documents easily. 100% free & secure.
//         </p>
//         <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
//           Explore Tools
//         </button>
//       </section>

//       {/* Tools Section */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-10">Popular Tools</h2>
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

//       {/* Why Choose Us Section */}
//       <section className="bg-gray-100 py-16 px-6">
//         <h2 className="text-3xl font-bold text-center mb-10">Why Choose PSD Tools?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">100% Free</h3>
//             <p className="text-gray-600">All tools are free forever, no hidden charges.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
//             <p className="text-gray-600">Process files quickly with full data security.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">No Signup Needed</h3>
//             <p className="text-gray-600">Use tools instantly without creating an account.</p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }









// "use client";

// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   const tools = [
//     { title: "PDF to Word", desc: "Convert PDF files to editable Word documents.", link: "/pdf-to-word" },
//     { title: "Merge PDF", desc: "Combine multiple PDF files into one.", link: "/merge-pdf" },
//     { title: "Split PDF", desc: "Separate PDF pages into different files.", link: "/split-pdf" },
//     { title: "Compress PDF", desc: "Reduce PDF file size without losing quality.", link: "/compress-pdf" },
//     { title: "Word to PDF", desc: "Convert Word documents to PDF easily.", link: "/word-to-pdf" },
//     { title: "Image to PDF", desc: "Turn your images into a single PDF file.", link: "/image-to-pdf" },
//   ];

//   return (
//     <main className="w-full">
//       {/* Hero Section */}
//       <section className="bg-red-700 dark:text-white py-20 px-6 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           PSD TOOLS – Free Online PDF & Document Tools
//         </h1>
//         <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto dark:text-white">
//           Convert, merge, split and compress your PDF & documents easily. 100% free & secure.
//         </p>
//         <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
//           Explore Tools
//         </button>
//       </section>

//       {/* Tools Section */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-10">Popular Tools</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {tools.map((tool, i) => (
//             <div
//               key={i}
//               className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition"
//             >
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

//       {/* Why Choose Us Section */}
//       <section className="bg-gray-100 py-16 px-6">
//         <h2 className="text-3xl font-bold text-center mb-10">Why Choose PSD Tools?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">100% Free</h3>
//             <p className="text-gray-600">All tools are free forever, no hidden charges.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
//             <p className="text-gray-600">Process files quickly with full data security.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">No Signup Needed</h3>
//             <p className="text-gray-600">Use tools instantly without creating an account.</p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }














// "use client";

// export default function Home() {
//   return (
//     <main className="w-full">
//       {/* Hero Section */}
//       <section className="bg-red-700 text-white py-20 px-6 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           PSD TOOLS – Free Online PDF & Document Tools
//         </h1>
//         <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
//           Convert, merge, split and compress your PDF & documents easily. 100% free & secure.
//         </p>
//         <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
//           Explore Tools
//         </button>
//       </section>

//       {/* Tools Section */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-10">Popular Tools</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {/* Tool Card */}
//           {[
//             { title: "PDF to Word", desc: "Convert PDF files to editable Word documents." },
//             { title: "Merge PDF", desc: "Combine multiple PDF files into one." },
//             { title: "Split PDF", desc: "Separate PDF pages into different files." },
//             { title: "Compress PDF", desc: "Reduce PDF file size without losing quality." },
//             { title: "Word to PDF", desc: "Convert Word documents to PDF easily." },
//             { title: "Image to PDF", desc: "Turn your images into a single PDF file." },
//           ].map((tool, i) => (
//             <div
//               key={i}
//               className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition"
//             >
//               <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
//               <p className="text-gray-600 mb-4">{tool.desc}</p>
//               <button className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer">
//                 Open Tool
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="bg-gray-100 py-16 px-6">
//         <h2 className="text-3xl font-bold text-center mb-10">Why Choose PSD Tools?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">100% Free</h3>
//             <p className="text-gray-600">All tools are free forever, no hidden charges.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
//             <p className="text-gray-600">Process files quickly with full data security.</p>
//           </div>
//           <div className="p-6 bg-white shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">No Signup Needed</h3>
//             <p className="text-gray-600">Use tools instantly without creating an account.</p>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }
