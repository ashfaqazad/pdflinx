'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [converted, setConverted] = useState([]);
  const [toFormat, setToFormat] = useState('webp'); // Default target format
  const [loading, setLoading] = useState(false);

  const formats = [
    { value: 'webp', label: 'WebP (Best for web - smallest size)' },
    { value: 'png', label: 'PNG (Transparency support)' },
    { value: 'jpg', label: 'JPG (Universal, good quality)' },
    { value: 'gif', label: 'GIF (Animated support)' },
    { value: 'bmp', label: 'BMP (Uncompressed, large size)' },
  ];

  const convertImages = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles.length) return;

    setLoading(true);
    setConverted([]);
    const results = [];

    for (const file of selectedFiles) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let mimeType = '';
        let extension = '';
        switch (toFormat) {
          case 'webp':
            mimeType = 'image/webp';
            extension = 'webp';
            break;
          case 'png':
            mimeType = 'image/png';
            extension = 'png';
            break;
          case 'jpg':
            mimeType = 'image/jpeg';
            extension = 'jpg';
            break;
          case 'gif':
            mimeType = 'image/gif';
            extension = 'gif';
            break;
          case 'bmp':
            mimeType = 'image/bmp';
            extension = 'bmp';
            break;
          default:
            mimeType = 'image/webp';
            extension = 'webp';
        }

        canvas.toBlob((blob) => {
          const convertedUrl = URL.createObjectURL(blob);
          results.push({
            originalName: file.name,
            name: file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
            url: convertedUrl,
            originalUrl: url,
          });

          if (results.length === selectedFiles.length) {
            setConverted(results);
            setLoading(false);
          }
        }, mimeType, toFormat === 'jpg' ? 0.94 : 1);
      };

      img.src = url;
    }

    setFiles(Array.from(selectedFiles));
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-image-converter"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Image Format Online for Free",
            description: "Convert JPG, PNG, WebP, GIF, BMP to any format instantly.",
            url: "https://pdflinx.com/image-converter",
            step: [
              { "@type": "HowToStep", name: "Upload Images", text: "Select one or multiple images." },
              { "@type": "HowToStep", name: "Choose Format", text: "Select target format (WebP, PNG, JPG, etc.)." },
              { "@type": "HowToStep", name: "Download", text: "Download converted images instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-image-converter"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image Converter", item: "https://pdflinx.com/image-converter" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need to switch your pics from JPG to PNG, or go super-small with WebP? Drop them here – convert a bunch at once, quality stays awesome, and it's all free!
            </p>
          </div>

          {/* Upload & Format Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Upload Area */}
              <div>
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-pink-500 transition">
                    <Upload className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                    <span className="text-xl font-semibold text-gray-800 block mb-2">
                      Drop images here or click to browse
                    </span>
                    <span className="text-gray-600 text-sm">
                      JPG, PNG, WebP, GIF, BMP • Multiple files okay
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={convertImages}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Format Selector */}
              <div>
                <label className="text-lg font-semibold text-gray-800 mb-4 block">
                  Convert to:
                </label>
                <div className="space-y-3">
                  {formats.map((fmt) => (
                    <label
                      key={fmt.value}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition hover:shadow-md ${
                        toFormat === fmt.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="format"
                          value={fmt.value}
                          checked={toFormat === fmt.value}
                          onChange={(e) => setToFormat(e.target.value)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <span className="text-base font-medium">{fmt.label}</span>
                      </div>
                      {toFormat === fmt.value && <CheckCircle className="w-6 h-6 text-purple-600" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                <p className="mt-4 text-lg font-semibold text-purple-600">
                  Turning your images into magic...
                </p>
              </div>
            )}
          </div>

          {/* Converted Images Grid */}
          {converted.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
                Your converted images are ready!
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {converted.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md overflow-hidden border border-purple-200 hover:shadow-lg transition"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-center">
                      <p className="font-medium text-gray-800 mb-2 text-sm truncate">{item.name}</p>
                      <a
                        href={item.url}
                        download={item.name}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-gray-600 text-base">
            No login • Convert as many as you want • Quality stays sharp • All free & private
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image Converter Online Free - Switch Formats in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're prepping pics for your website (go WebP!), need transparency (hello PNG), or just want classic JPG – this tool handles it all. Upload a bunch, pick your format, and grab the new versions. Super fast, no quality drop, and totally free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">All the Formats You Need</h3>
            <p className="text-gray-600 text-sm">
              JPG, PNG, WebP, GIF, BMP – modern or old-school, we've got you.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch Mode FTW</h3>
            <p className="text-gray-600 text-sm">
              Convert a whole folder's worth at once – big time saver.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality + Free Forever</h3>
            <p className="text-gray-600 text-sm">
              Your images stay crisp, and you never pay a rupee.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Change Image Format in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Pics</h4>
              <p className="text-gray-600 text-sm">Drop one or a handful – any format works.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Pick the New Format</h4>
              <p className="text-gray-600 text-sm">WebP for tiny files, PNG for transparency, etc.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download & Done</h4>
              <p className="text-gray-600 text-sm">Grab your fresh converted images instantly.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Designers, devs, and everyday folks use PDF Linx daily to flip image formats – it's fast, keeps quality high, and always free.
        </p>
      </section>
    <RelatedToolsSection currentPage="image-converter" />

    </>
  );
}






















// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Image as ImageIcon, Zap, Shield, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function ImageConverter() {
//   const [files, setFiles] = useState([]);
//   const [converted, setConverted] = useState([]);
//   const [toFormat, setToFormat] = useState('webp'); // Default target format
//   const [loading, setLoading] = useState(false);

//   const formats = [
//     { value: 'webp', label: 'WebP (Best for web - smallest size)' },
//     { value: 'png', label: 'PNG (Transparency support)' },
//     { value: 'jpg', label: 'JPG (Universal, good quality)' },
//     { value: 'gif', label: 'GIF (Animated support)' },
//     { value: 'bmp', label: 'BMP (Uncompressed, large size)' },
//   ];

//   const convertImages = async (e) => {
//     const selectedFiles = e.target.files;
//     if (!selectedFiles.length) return;

//     setLoading(true);
//     setConverted([]);
//     const results = [];

//     for (const file of selectedFiles) {
//       const img = new Image();
//       const url = URL.createObjectURL(file);

//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0);

//         let mimeType = '';
//         let extension = '';
//         switch (toFormat) {
//           case 'webp':
//             mimeType = 'image/webp';
//             extension = 'webp';
//             break;
//           case 'png':
//             mimeType = 'image/png';
//             extension = 'png';
//             break;
//           case 'jpg':
//             mimeType = 'image/jpeg';
//             extension = 'jpg';
//             break;
//           case 'gif':
//             mimeType = 'image/gif';
//             extension = 'gif';
//             break;
//           case 'bmp':
//             mimeType = 'image/bmp';
//             extension = 'bmp';
//             break;
//           default:
//             mimeType = 'image/webp';
//             extension = 'webp';
//         }

//         canvas.toBlob((blob) => {
//           const convertedUrl = URL.createObjectURL(blob);
//           results.push({
//             originalName: file.name,
//             name: file.name.replace(/\.[^/.]+$/, '') + '.' + extension,
//             url: convertedUrl,
//             originalUrl: url,
//           });

//           if (results.length === selectedFiles.length) {
//             setConverted(results);
//             setLoading(false);
//           }
//         }, mimeType, toFormat === 'jpg' ? 0.94 : 1);
//       };

//       img.src = url;
//     }

//     setFiles(Array.from(selectedFiles));
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-image-converter"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Image Format Online for Free",
//             description: "Convert JPG, PNG, WebP, GIF, BMP to any format instantly.",
//             url: "https://pdflinx.com/image-converter",
//             step: [
//               { "@type": "HowToStep", name: "Upload Images", text: "Select one or multiple images." },
//               { "@type": "HowToStep", name: "Choose Format", text: "Select target format (WebP, PNG, JPG, etc.)." },
//               { "@type": "HowToStep", name: "Download", text: "Download converted images instantly." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-image-converter"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image Converter", item: "https://pdflinx.com/image-converter" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
//               Image Converter <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Convert images between JPG, PNG, WebP, GIF, BMP instantly. Batch support, high quality — 100% free, no signup.
//             </p>
//           </div>

//           {/* Upload & Format Selector */}
//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
//             <div className="grid md:grid-cols-2 gap-10 mb-10">
//               {/* Upload Area */}
//               <div>
//                 <label className="block cursor-pointer">
//                   <div className="border-4 border-dashed border-purple-300 rounded-3xl p-20 text-center hover:border-pink-500 transition">
//                     <Upload className="w-24 h-24 mx-auto text-purple-600 mb-8" />
//                     <span className="text-3xl font-bold text-gray-800 block mb-4">
//                       Drop images here or click to upload
//                     </span>
//                     <span className="text-xl text-gray-600">
//                       Supports JPG, PNG, WebP, GIF, BMP • Multiple files
//                     </span>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={convertImages}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Format Selector */}
//               <div>
//                 <label className="text-2xl font-bold text-gray-800 mb-6 block">
//                   Convert To:
//                 </label>
//                 <div className="grid grid-cols-1 gap-4">
//                   {formats.map((fmt) => (
//                     <label
//                       key={fmt.value}
//                       className={`flex items-center justify-between p-6 rounded-2xl border-4 cursor-pointer transition shadow-lg hover:shadow-xl ${
//                         toFormat === fmt.value
//                           ? 'border-purple-500 bg-purple-50'
//                           : 'border-gray-200 bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="radio"
//                           name="format"
//                           value={fmt.value}
//                           checked={toFormat === fmt.value}
//                           onChange={(e) => setToFormat(e.target.value)}
//                           className="w-6 h-6 text-purple-600"
//                         />
//                         <span className="text-xl font-semibold">{fmt.label}</span>
//                       </div>
//                       {toFormat === fmt.value && <CheckCircle className="w-8 h-8 text-purple-600" />}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {loading && (
//               <div className="text-center">
//                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
//                 <p className="mt-6 text-2xl font-bold text-purple-600">
//                   Converting your images...
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Converted Images Grid */}
//           {converted.length > 0 && (
//             <div>
//               <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
//                 Converted Images Ready!
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
//                 {converted.map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-200 hover:shadow-3xl transition"
//                   >
//                     <img
//                       src={item.url}
//                       alt={item.name}
//                       className="w-full h-64 object-cover"
//                     />
//                     <div className="p-6 text-center">
//                       <p className="font-semibold text-gray-800 mb-4 truncate">{item.name}</p>
//                       <a
//                         href={item.url}
//                         download={item.name}
//                         className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
//                       >
//                         <Download size={24} />
//                         Download
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <p className="text-center mt-12 text-gray-600 text-lg">
//             No signup • Batch convert • High quality • 100% free & private
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
//             Image Converter Online Free - JPG, PNG, WebP, GIF, BMP
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert images between any format instantly — JPG to PNG, PNG to WebP, WebP to JPG, GIF, BMP. Batch conversion, high quality, perfect for web, design, and sharing. Completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <ImageIcon className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">All Popular Formats</h3>
//             <p className="text-gray-600">
//               Convert between JPG, PNG, WebP, GIF, BMP — full support for modern and legacy formats.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-pink-50 to-white p-10 rounded-3xl shadow-xl border border-pink-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Zap className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Batch Conversion</h3>
//             <p className="text-gray-600">
//               Convert multiple images at once — save time with bulk processing.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Free</h3>
//             <p className="text-gray-600">
//               Full quality preserved — no compression loss, completely free forever.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Convert Image Format in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload Images</h4>
//               <p className="text-gray-600 text-lg">Drop or select one or multiple images in any format.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Choose Format</h4>
//               <p className="text-gray-600 text-lg">Select target format: WebP (smallest), PNG (transparent), JPG, etc.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download</h4>
//               <p className="text-gray-600 text-lg">Download all converted images instantly.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Convert image formats every day with PDF Linx — trusted by designers, developers, and users worldwide for fast, reliable, and completely free image conversion.
//         </p>
//     </section>
//     <RelatedToolsSection currentPage="image-converter" />

//     </>
//   );
// }

