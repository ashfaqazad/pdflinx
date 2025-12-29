'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Zap, Shield, Image as ImageIcon } from 'lucide-react';
import Script from 'next/script';

export default function ImageCompressor() {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginal(file);
    setOriginalSize((file.size / 1024 / 1024).toFixed(2));
    setCompressed(null);
    setLoading(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.8,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const compSize = (compressedFile.size / 1024 / 1024).toFixed(2);
      setCompressedSize(compSize);
      setSaved(Math.round(((file.size - compressedFile.size) / file.size) * 100));
      setCompressed(URL.createObjectURL(compressedFile));
    } catch (error) {
      alert('Error compressing image. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-img-comp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Compress Image Online for Free",
            description: "Reduce image file size up to 90% while maintaining quality.",
            url: "https://pdflinx.com/image-compressor",
            step: [
              { "@type": "HowToStep", name: "Upload Image", text: "Select JPG, PNG, or WebP image." },
              { "@type": "HowToStep", name: "Compress", text: "Click compress and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download smaller optimized image." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-img-comp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Image Compressor", item: "https://pdflinx.com/image-compressor" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Image Compressor <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compress JPG, PNG, WebP images up to 90% smaller without losing quality. Convert to WebP for best results — 100% free, no signup.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
            <div className="border-4 border-dashed border-green-300 rounded-2xl p-16 text-center hover:border-green-500 transition">
              <Upload className="w-20 h-20 mx-auto text-green-600 mb-6" />
              <label className="cursor-pointer">
                <span className="text-2xl font-bold text-gray-700 block mb-4">
                  Drop your image here or click to upload
                </span>
                <span className="text-gray-500">Supports JPG, PNG, WebP, GIF • Max 50MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Comparison Section */}
          {original && (
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Original */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 text-center border border-gray-200">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Original Image</h3>
                <img
                  src={URL.createObjectURL(original)}
                  alt="Original"
                  className="max-w-full rounded-2xl shadow-lg mx-auto"
                />
                <div className="mt-8">
                  <p className="text-2xl font-bold text-gray-700">{originalSize} MB</p>
                  <p className="text-gray-500">Before Compression</p>
                </div>
              </div>

              {/* Compressed */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl p-8 text-center border-4 border-green-400">
                <h3 className="text-3xl font-bold text-green-600 mb-6">
                  {loading ? 'Compressing...' : 'Compressed Image'}
                </h3>
                {compressed ? (
                  <>
                    <img
                      src={compressed}
                      alt="Compressed"
                      className="max-w-full rounded-2xl shadow-lg mx-auto border-4 border-green-500"
                    />
                    <div className="mt-8">
                      <p className="text-4xl font-extrabold text-green-600 mb-2">{saved}% Smaller!</p>
                      <p className="text-2xl font-bold text-gray-700">{compressedSize} MB</p>
                      <p className="text-gray-500">After Compression</p>
                    </div>
                    <a
                      href={compressed}
                      download={`compressed-${original.name.split('.')[0]}.webp`}
                      className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
                    >
                      <Download size={32} />
                      Download Optimized Image
                    </a>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-green-600"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-center text-gray-600 text-lg">
            No signup • Unlimited compression • Nothing stored • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Image Compressor Online Free - Reduce Size Up to 90% Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Compress JPG, PNG, WebP, and GIF images online without losing quality. Convert to WebP for maximum savings — perfect for websites, emails, and social media. Completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Up to 90% Smaller</h3>
            <p className="text-gray-600">
              Reduce file size dramatically while keeping visual quality — ideal for fast loading websites.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-white p-10 rounded-3xl shadow-xl border border-teal-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">WebP Conversion</h3>
            <p className="text-gray-600">
              Automatically convert to modern WebP format — smallest size with excellent quality.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure & Private</h3>
            <p className="text-gray-600">
              Images processed in browser — nothing uploaded or stored. Completely private and free.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Compress Image in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Upload Image</h4>
              <p className="text-gray-600 text-lg">Drop or select any JPG, PNG, WebP, or GIF image from your device.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Auto Compress</h4>
              <p className="text-gray-600 text-lg">We optimize and convert to WebP automatically in seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download</h4>
              <p className="text-gray-600 text-lg">Save your smaller, optimized image instantly.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Compress images every day with PDF Linx — trusted by thousands for fast, high-quality, and completely free image optimization.
        </p>
      </section>
    </>
  );
}























// 'use client';

// import { useState } from 'react';
// import imageCompression from 'browser-image-compression';

// export default function ImageCompressor() {
//   const [original, setOriginal] = useState(null);
//   const [compressed, setCompressed] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saved, setSaved] = useState(0);

//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setOriginal(file);
//     setCompressed(null);
//     setLoading(true);

//     const options = {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true,
//       fileType: 'image/webp',  // WebP sabse chhota hota hai
//     };

//     try {
//       const compressedFile = await imageCompression(file, options);
//       const originalSize = file.size / 1024 / 1024;
//       const compressedSize = compressedFile.size / 1024 / 1024;
//       setSaved(Math.round((originalSize - compressedSize) / originalSize * 100));
      
//       setCompressed(URL.createObjectURL(compressedFile));
//     } catch (error) {
//       alert('Error compressing image');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
//         <h1 className="text-4xl font-bold text-center mb-4">Image Compressor & Resizer</h1>
//         <p className="text-center text-gray-600 mb-10">Reduce image size up to 90% • Convert to WebP • No quality loss</p>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFile}
//           className="block w-full text-lg text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 p-6 mb-10"
//         />

//         {original && (
//           <div className="grid md:grid-cols-2 gap-10">
//             <div className="text-center">
//               <h3 className="text-2xl font-bold mb-4">Original</h3>
//               <img src={URL.createObjectURL(original)} alt="original" className="max-w-full rounded-lg shadow-lg" />
//               <p className="mt-4 text-xl">Size: {(original.size / 1024 / 1024).toFixed(2)} MB</p>
//             </div>

//             <div className="text-center">
//               <h3 className="text-2xl font-bold mb-4 text-green-600">
//                 {loading ? 'Compressing...' : 'Compressed (-90%)'}
//               </h3>
//               {compressed ? (
//                 <>
//                   <img src={compressed} alt="compressed" className="max-w-full rounded-lg shadow-lg border-4 border-green-500" />
//                   <p className="mt-4 text-3xl font-bold text-green-600">{saved}% Smaller!</p>
//                   <a
//                     href={compressed}
//                     download={`compressed-${original.name.split('.')[0]}.webp`}
//                     className="inline-block mt-6 bg-green-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-700"
//                   >
//                     Download Optimized Image
//                   </a>
//                 </>
//               ) : (
//                 <div className="h-64 flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-600"></div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
