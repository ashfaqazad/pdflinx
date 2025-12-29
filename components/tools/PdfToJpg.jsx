'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function PdfToJpg() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Backend API base URL — dev aur production ke liye auto detect
  const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/convert'
    : 'https://pdflinx.com/convert';

  const convert = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setImages([]);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selected);

    try {
      const res = await fetch(`${API_BASE}/pdf-to-jpg`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Conversion failed');
      }

      // Backend se image paths aayenge jaise /converted/xyz/page-1.jpg
      setImages(data.images.map((path, i) => ({
        page: i + 1,
        url: path.startsWith('http') ? path : `https://pdflinx.com${path}`,
        name: path.split('/').pop(),
      })));
    } catch (err) {
      console.error(err);
      alert('Error converting PDF to JPG. Try a smaller or text-based PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Schemas same as before */}
      <Script
        id="howto-schema-pdf-to-jpg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to JPG Online for Free",
            description: "Convert PDF pages to high-quality JPG images instantly.",
            url: "https://pdflinx.com/pdf-to-jpg",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Convert", text: "Automatic conversion to JPG." },
              { "@type": "HowToStep", name: "Download", text: "Download all page images." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-pdf-to-jpg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to JPG", item: "https://pdflinx.com/pdf-to-jpg" }
            ]
          }, null, 2),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              PDF to JPG Converter <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert PDF pages to high-quality JPG images instantly. Perfect for sharing or editing — 100% free, no signup.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
            <label className="block cursor-pointer">
              <div className="border-4 border-dashed border-blue-300 rounded-3xl p-20 text-center hover:border-indigo-500 transition">
                <Upload className="w-24 h-24 mx-auto text-blue-600 mb-8" />
                <span className="text-3xl font-bold text-gray-800 block mb-4">
                  Drop PDF here or click to upload
                </span>
                <span className="text-xl text-gray-600">Multi-page PDFs supported</span>
              </div>
              <input type="file" accept=".pdf" onChange={convert} className="hidden" />
            </label>

            {loading && (
              <div className="text-center mt-12">
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="mt-6 text-2xl font-bold text-indigo-600">Converting PDF to JPG...</p>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
                JPG Images Ready!
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {images.map((img) => (
                  <div key={img.page} className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-indigo-200 hover:shadow-3xl transition">
                    <img src={img.url} alt={`Page ${img.page}`} className="w-full h-64 object-cover" />
                    <div className="p-6 text-center">
                      <p className="font-semibold text-gray-800 mb-4">Page {img.page}</p>
                      <a
                        href={img.url}
                        download={img.name}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition shadow-lg"
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

          <p className="text-center mt-12 text-gray-600 text-lg">
            No signup • All pages converted • High quality • 100% free & private
          </p>
        </div>
      </main>

      {/* SEO Section same as before — no change */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* ... same as previous ... */}
      </section>
    </>
  );
}





















// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
// import Script from 'next/script';

// export default function PdfToJpg() {
//   const [file, setFile] = useState(null);
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const convert = async (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     setFile(selected);
//     setImages([]);
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', selected);

//     try {
//       const res = await fetch('/api/convert/pdf-to-jpg', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok || data.error) {
//         throw new Error(data.error || 'Conversion failed');
//       }

//       // Backend se image URLs aayenge
//       setImages(data.images.map((path, i) => ({
//         page: i + 1,
//         url: path, // direct server path jaise /converted/abc/page-1.jpg
//         name: `page-${i + 1}.jpg`,
//       })));
//     } catch (err) {
//       console.error(err);
//       alert('Error converting PDF to JPG. Try a smaller or text-based PDF.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ==================== SCHEMAS (same as before) ==================== */}
//       <Script
//         id="howto-schema-pdf-to-jpg"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert PDF to JPG Online for Free",
//             description: "Convert PDF pages to high-quality JPG images instantly.",
//             url: "https://pdflinx.com/pdf-to-jpg",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
//               { "@type": "HowToStep", name: "Convert", text: "Automatic conversion to JPG." },
//               { "@type": "HowToStep", name: "Download", text: "Download all page images." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-pdf-to-jpg"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF to JPG", item: "https://pdflinx.com/pdf-to-jpg" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN UI (same premium design) ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//               PDF to JPG Converter <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Convert PDF pages to high-quality JPG images instantly. Perfect for sharing or editing — 100% free, no signup.
//             </p>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
//             <label className="block cursor-pointer">
//               <div className="border-4 border-dashed border-blue-300 rounded-3xl p-20 text-center hover:border-indigo-500 transition">
//                 <Upload className="w-24 h-24 mx-auto text-blue-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop PDF here or click to upload
//                 </span>
//                 <span className="text-xl text-gray-600">Multi-page PDFs supported</span>
//               </div>
//               <input type="file" accept=".pdf" onChange={convert} className="hidden" />
//             </label>

//             {loading && (
//               <div className="text-center mt-12">
//                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
//                 <p className="mt-6 text-2xl font-bold text-indigo-600">Converting PDF to JPG...</p>
//               </div>
//             )}
//           </div>

//           {images.length > 0 && (
//             <div>
//               <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
//                 JPG Images Ready!
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//                 {images.map((img) => (
//                   <div key={img.page} className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-indigo-200 hover:shadow-3xl transition">
//                     <img src={img.url} alt={`Page ${img.page}`} className="w-full h-64 object-cover" />
//                     <div className="p-6 text-center">
//                       <p className="font-semibold text-gray-800 mb-4">Page {img.page}</p>
//                       <a
//                         href={img.url}
//                         download={img.name}
//                         className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition shadow-lg"
//                       >
//                         <Download size={24} />
//                         Download JPG
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <p className="text-center mt-12 text-gray-600 text-lg">
//             No signup • All pages converted • High quality • 100% free & private
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION (same as before) ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//             PDF to JPG Converter Online Free - Convert Pages to Images
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert each PDF page to high-quality JPG image instantly. Perfect for extracting images, sharing, or editing — completely free with PDF Linx.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <ImageIcon className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Every Page Converted</h3>
//             <p className="text-gray-600">All pages become separate high-quality JPG images.</p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Quality</h3>
//             <p className="text-gray-600">High-resolution JPG export — no quality loss.</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Free</h3>
//             <p className="text-gray-600">Convert unlimited PDFs instantly — no signup needed.</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Convert PDF to JPG in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
//               <p className="text-gray-600 text-lg">Drop or select your PDF file.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Auto Convert</h4>
//               <p className="text-gray-600 text-lg">Each page converted to JPG automatically.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download</h4>
//               <p className="text-gray-600 text-lg">Save all JPG images instantly.</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Convert PDF to JPG every day with PDF Linx — trusted by thousands for fast, high-quality, and completely free image extraction.
//         </p>
//       </section>
//     </>
//   );
// }























// // 'use client';

// // import { useState } from 'react';
// // import { PDFDocument } from 'pdf-lib';
// // import { Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
// // import Script from 'next/script';

// // export default function PdfToJpg() {
// //   const [file, setFile] = useState(null);
// //   const [images, setImages] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const convert = async (e) => {
// //     const selected = e.target.files[0];
// //     if (!selected) return;

// //     setFile(selected);
// //     setImages([]);
// //     setLoading(true);

// //     try {
// //       const arrayBuffer = await selected.arrayBuffer();
// //       const pdfDoc = await PDFDocument.load(arrayBuffer);
// //       const pages = pdfDoc.getPages();
// //       const results = [];

// //       for (let i = 0; i < pages.length; i++) {
// //         const page = pages[i];
// //         const viewport = page.getViewport({ scale: 2.0 });
// //         const canvas = document.createElement('canvas');
// //         canvas.width = viewport.width;
// //         canvas.height = viewport.height;
// //         const context = canvas.getContext('2d');

// //         await page.render({ canvasContext: context, viewport }).promise;

// //         canvas.toBlob((blob) => {
// //           const url = URL.createObjectURL(blob);
// //           results.push({
// //             page: i + 1,
// //             url,
// //             name: `${selected.name.replace('.pdf', '')}-page-${i + 1}.jpg`,
// //           });

// //           if (results.length === pages.length) {
// //             setImages(results);
// //             setLoading(false);
// //           }
// //         }, 'image/jpeg', 0.95);
// //       }
// //     } catch (err) {
// //       alert('Error converting PDF to JPG');
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <Script
// //         id="howto-schema-pdf-to-jpg"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Convert PDF to JPG Online for Free",
// //             description: "Convert PDF pages to high-quality JPG images instantly.",
// //             url: "https://pdflinx.com/pdf-to-jpg",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
// //               { "@type": "HowToStep", name: "Convert", text: "Automatic conversion to JPG." },
// //               { "@type": "HowToStep", name: "Download", text: "Download all page images." }
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png"
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-pdf-to-jpg"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "PDF to JPG", item: "https://pdflinx.com/pdf-to-jpg" }
// //             ]
// //           }, null, 2),
// //         }}
// //       />

// //       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
// //         <div className="max-w-6xl mx-auto">
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
// //               PDF to JPG Converter <br /> Online (Free)
// //             </h1>
// //             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
// //               Convert PDF pages to high-quality JPG images instantly. Perfect for sharing or editing — 100% free, no signup.
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
// //             <label className="block cursor-pointer">
// //               <div className="border-4 border-dashed border-blue-300 rounded-3xl p-20 text-center hover:border-indigo-500 transition">
// //                 <Upload className="w-24 h-24 mx-auto text-blue-600 mb-8" />
// //                 <span className="text-3xl font-bold text-gray-800 block mb-4">
// //                   Drop PDF here or click to upload
// //                 </span>
// //                 <span className="text-xl text-gray-600">Multi-page PDFs supported</span>
// //               </div>
// //               <input type="file" accept=".pdf" onChange={convert} className="hidden" />
// //             </label>

// //             {loading && (
// //               <div className="text-center mt-12">
// //                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
// //                 <p className="mt-6 text-2xl font-bold text-indigo-600">Converting PDF to JPG...</p>
// //               </div>
// //             )}
// //           </div>

// //           {images.length > 0 && (
// //             <div>
// //               <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
// //                 JPG Images Ready!
// //               </h2>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
// //                 {images.map((img) => (
// //                   <div key={img.page} className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-indigo-200 hover:shadow-3xl transition">
// //                     <img src={img.url} alt={`Page ${img.page}`} className="w-full h-64 object-cover" />
// //                     <div className="p-6 text-center">
// //                       <p className="font-semibold text-gray-800 mb-4">Page {img.page}</p>
// //                       <a
// //                         href={img.url}
// //                         download={img.name}
// //                         className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition shadow-lg"
// //                       >
// //                         <Download size={24} />
// //                         Download JPG
// //                       </a>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           <p className="text-center mt-12 text-gray-600 text-lg">
// //             No signup • All pages converted • High quality • 100% free & private
// //           </p>
// //         </div>
// //       </main>

// //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
// //             PDF to JPG Converter Online Free - Convert Pages to Images
// //           </h2>
// //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// //             Convert each PDF page to high-quality JPG image instantly. Perfect for extracting images, sharing, or editing — completely free with PDF Linx.
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// //           <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <ImageIcon className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Every Page Converted</h3>
// //             <p className="text-gray-600">All pages become separate high-quality JPG images.</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Quality</h3>
// //             <p className="text-gray-600">High-resolution JPG export — no quality loss.</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Free</h3>
// //             <p className="text-gray-600">Convert unlimited PDFs instantly — no signup needed.</p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// //             How to Convert PDF to JPG in 3 Simple Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-12">
// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 1
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
// //               <p className="text-gray-600 text-lg">Drop or select your PDF file.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 2
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Auto Convert</h4>
// //               <p className="text-gray-600 text-lg">Each page converted to JPG automatically.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 3
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Download</h4>
// //               <p className="text-gray-600 text-lg">Save all JPG images instantly.</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// //           Convert PDF to JPG every day with PDF Linx — trusted by thousands for fast, high-quality, and completely free image extraction.
// //         </p>
// //       </section>
// //     </>
// //   );
// // }
