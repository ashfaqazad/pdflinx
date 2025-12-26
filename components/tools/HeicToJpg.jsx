'use client';

import { useState } from 'react';
import { Upload, Download, Smartphone, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function HeicToJpg() {
  const [converted, setConverted] = useState([]);
  const [loading, setLoading] = useState(false);

  const convert = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    setConverted([]);

    try {
      const heic2any = (await import('heic2any')).default;

      const results = [];
      for (const file of files) {
        const jpgBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.94,
        });

        const jpgUrl = URL.createObjectURL(jpgBlob);
        results.push({
          name: file.name.replace(/\.heic$/i, '.jpg'),
          url: jpgUrl,
          originalName: file.name,
        });
      }

      setConverted(results);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Error converting HEIC files. Please try again with valid HEIC images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert HEIC to JPG Online for Free",
            description: "Convert iPhone HEIC photos to JPG format instantly.",
            url: "https://www.pdflinx.com/heic-to-jpg",
            step: [
              { "@type": "HowToStep", name: "Upload HEIC", text: "Select one or multiple HEIC files." },
              { "@type": "HowToStep", name: "Convert", text: "Click convert and wait." },
              { "@type": "HowToStep", name: "Download JPG", text: "Download converted JPG files." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://www.pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-heic"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "HEIC to JPG", item: "https://www.pdflinx.com/heic-to-jpg" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              HEIC to JPG Converter <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert iPhone HEIC photos to JPG instantly. Batch support, high quality — perfect for Windows, Android, or sharing. 100% free, no signup.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-3xl shadow-2xl p-16 border border-gray-100 mb-12">
            <label className="block cursor-pointer">
              <div className="border-4 border-dashed border-pink-300 rounded-3xl p-24 text-center hover:border-purple-500 transition">
                <Upload className="w-28 h-28 mx-auto text-pink-600 mb-8" />
                <span className="text-3xl font-bold text-gray-800 block mb-4">
                  Drop HEIC files here or click to upload
                </span>
                <span className="text-xl text-gray-600">
                  Supports multiple files • iPhone & iPad photos
                </span>
              </div>
              <input
                type="file"
                accept=".heic,.HEIC"
                multiple
                onChange={convert}
                className="hidden"
              />
            </label>

            {loading && (
              <div className="text-center mt-12">
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
                <p className="mt-6 text-2xl font-bold text-purple-600">
                  Converting your HEIC files...
                </p>
              </div>
            )}
          </div>

          {/* Converted Images */}
          {converted.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
                Converted JPG Files Ready!
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {converted.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-200 hover:shadow-3xl transition"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6 text-center">
                      <p className="font-semibold text-gray-800 mb-4 truncate">{item.name}</p>
                      <a
                        href={item.url}
                        download={item.name}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                      >
                        <Download size={24} />
                        Download JPG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-gray-600 text-lg">
            No signup • Batch convert • High quality • 100% free & private
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            HEIC to JPG Converter Online Free - Convert iPhone Photos Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Convert HEIC images from iPhone/iPad to JPG format in seconds. Batch conversion, high quality — perfect for viewing on Windows, Android, or sharing online. Completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-pink-50 to-white p-10 rounded-3xl shadow-xl border border-pink-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">iPhone Photos Compatible</h3>
            <p className="text-gray-600">
              Convert HEIC (iPhone default format) to universally supported JPG.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Batch Conversion</h3>
            <p className="text-gray-600">
              Convert multiple HEIC files at once — save time with bulk processing.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Free</h3>
            <p className="text-gray-600">
              Full quality preserved — no compression loss, completely free forever.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Convert HEIC to JPG in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Upload HEIC Files</h4>
              <p className="text-gray-600 text-lg">Drop or select one or multiple HEIC photos from your device.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Auto Convert</h4>
              <p className="text-gray-600 text-lg">We convert HEIC to high-quality JPG instantly in browser.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download JPG</h4>
              <p className="text-gray-600 text-lg">Save your converted JPG files — ready for any device.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Convert HEIC to JPG every day with PDF Linx — trusted by iPhone users worldwide for fast, reliable, and completely free photo conversion.
        </p>
      </section>
    </>
  );
}




















// "use client";

// import { useState } from "react";

// export default function HeicToJpg() {
//   const [converted, setConverted] = useState([]);

//   const convert = async (e) => {
//     const files = e.target.files;
//     if (!files?.length) return;

//     // ✅ Import heic2any dynamically inside client-only block
//     if (typeof window !== "undefined") {
//       try {
//         const heic2any = (await import("heic2any")).default;

//         const results = [];
//         for (const file of files) {
//           const jpgBlob = await heic2any({
//             blob: file,
//             toType: "image/jpeg",
//             quality: 0.94,
//           });
//           const jpgUrl = window.URL.createObjectURL(jpgBlob);
//           results.push({
//             name: file.name.replace(/\.heic$/i, ".jpg"),
//             url: jpgUrl,
//           });
//         }

//         setConverted(results);
//       } catch (error) {
//         console.error("Conversion failed:", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
//       <div className="max-w-6xl mx-auto text-center">
//         <h1 className="text-7xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
//           HEIC → JPG Converter
//         </h1>
//         <p className="text-3xl text-gray-700 mb-10">
//           Convert iPhone photos to JPG — open them easily on Windows or Android!
//         </p>

//         <label className="cursor-pointer">
//           <input
//             type="file"
//             accept=".heic,.HEIC"
//             multiple
//             onChange={convert}
//             className="hidden"
//           />
//           <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-20 py-16 rounded-3xl shadow-2xl hover:scale-105 transition text-3xl font-bold">
//             Select HEIC Files
//           </div>
//         </label>

//         {converted.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-4xl font-bold text-purple-700 mb-8">
//               Converted JPGs Ready!
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//               {converted.map((item, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition"
//                 >
//                   <img
//                     src={item.url}
//                     alt="Converted preview"
//                     className="w-full h-48 object-cover"
//                   />
//                   <a
//                     href={item.url}
//                     download={item.name}
//                     className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 font-bold hover:opacity-90"
//                   >
//                     Download {item.name}
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


