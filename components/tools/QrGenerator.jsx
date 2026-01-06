'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Link, Wifi, MessageCircle, Download } from 'lucide-react'; // Icons ke liye
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";





export default function QRGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return (
    <>


      <Script id="howto-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Create Custom QR Code Online for Free",
          description: "Generate QR codes for URLs, text, WiFi, vCard in seconds - completely free.",
          url: "https://pdflinx.com/qr-generator",
          step: [
            { "@type": "HowToStep", name: "Enter Data", text: "Paste URL, text, or contact details." },
            { "@type": "HowToStep", name: "Customize", text: "Add colors, logo, change style." },
            { "@type": "HowToStep", name: "Download", text: "Download high-resolution PNG or SVG." }
          ],
          totalTime: "PT30S",
          estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          image: "https://pdflinx.com/og-image.png"
        }, null, 2)
      }} />

      <Script id="breadcrumb-schema-qr" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
            { "@type": "ListItem", position: 2, name: "QR Code Generator", item: "https://pdflinx.com/qr-generator" }
          ]
        }, null, 2)
      }} />



      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              QR Code Generator <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create custom QR codes instantly for URLs, text, WiFi, WhatsApp, vCard & more — 100% free, no signup, high quality download.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, Wi-Fi password, contact, WhatsApp number..."
              className="w-full p-5 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none mb-8 transition"
            />

            <div className="flex justify-center mb-8">
              {text ? (
                <canvas ref={canvasRef} className="border-4 border-purple-200 rounded-2xl shadow-xl" />
              ) : (
                <div className="w-80 h-80 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-500 text-center p-8">
                  Enter text above to generate QR code
                </div>
              )}
            </div>

            {text && (
              <div className="text-center">
                <button
                  onClick={() => {
                    const url = canvasRef.current.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'qr-code-pdflinx.png';
                    link.click();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl px-10 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center gap-3 mx-auto"
                >
                  <Download size={28} />
                  Download QR Code (PNG)
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-sm">
            No signup • Unlimited use • Files not stored • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION - QR CODE GENERATOR ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            QR Code Generator Online Free - Create Custom QR Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Generate professional QR codes for websites, WiFi, WhatsApp, contacts, text, and more. Fully customizable, high-resolution, and completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid - 3 Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Link className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Content Type</h3>
            <p className="text-gray-600">
              Create QR for URLs, text, WiFi password, WhatsApp chat, vCard, email, phone — everything supported.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wifi className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">High Quality & Customizable</h3>
            <p className="text-gray-600">
              Download in high-resolution PNG. Works perfectly on print and digital. Fast scanning guaranteed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Secure & Free</h3>
            <p className="text-gray-600">
              Generate unlimited QR codes instantly. No signup, no data stored, completely private and free forever.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Create QR Code in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Enter Your Data</h4>
              <p className="text-gray-600 text-lg">Type or paste URL, text, WiFi details, contact, or message.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">QR Code Appears</h4>
              <p className="text-gray-600 text-lg">Your custom QR code generates instantly with perfect quality.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download & Use</h4>
              <p className="text-gray-600 text-lg">Download high-quality PNG and use on posters, cards, websites.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Create professional QR codes every day with PDF Linx — trusted by thousands for fast, reliable, and free QR generation.
        </p>
      </section>
      <RelatedToolsSection currentPage="qr-generator" />

    </>
  );
}




















// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import QRCode from 'qrcode';   // ← sirf ye install karna hai: npm install qrcode




// export default function QRGenerator() {
//   const [text, setText] = useState('');
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (text && canvasRef.current) {
//       QRCode.toCanvas(canvasRef.current, text, { width: 280, margin: 2 }, (error) => {
//         if (error) console.error(error);
//       });
//     }
//   }, [text]);

//   return (


// <>
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Free QR Code Generator
//         </h1>

//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Enter URL, text, WhatsApp, Wi-Fi..."
//           className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none mb-6"
//         />


//         {/* Ye canvas hai — yahan QR banega */}
//         <div className="flex justify-center">
//           {text ? (
//             <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
//           ) : (
//             <div className="w-72 h-72 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
//               Enter text to generate QR
//             </div>
//           )}
//         </div>

//         {/* Download button (optional bonus) */}
//         {text && (
//           <div className="text-center mt-6">
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 const url = canvasRef.current.toDataURL('image/png');
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.download = 'qr-code.png';
//                 link.click();
//               }}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
//             >
//               Download QR Code
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// }