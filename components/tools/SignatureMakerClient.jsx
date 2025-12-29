'use client';

import { useRef, useState, useEffect } from 'react';
import { Download, PenTool, Palette, Trash2, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function SignatureMakerClient() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-signature.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-signature"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create Digital Signature Online for Free",
            description: "Make professional signatures by drawing or typing instantly.",
            url: "https://pdflinx.com/signature-maker",
            step: [
              { "@type": "HowToStep", name: "Choose Method", text: "Draw with mouse/finger or type your name." },
              { "@type": "HowToStep", name: "Customize", text: "Change color, style, and thickness." },
              { "@type": "HowToStep", name: "Download", text: "Download transparent PNG signature." }
            ],
            totalTime: "PT40S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-signature"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Signature Maker", item: "https://pdflinx.com/signature-maker" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Signature Maker <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional digital signatures instantly. Draw with mouse/finger, customize color — download transparent PNG. 100% free, no signup.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                <Palette className="w-8 h-8 text-indigo-600" />
                <span className="font-semibold">Pen Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-16 rounded-full cursor-pointer border-4 border-indigo-200"
                />
              </div>

              <button
                onClick={clear}
                className="bg-red-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition flex items-center gap-3 shadow-lg"
              >
                <Trash2 size={24} />
                Clear Canvas
              </button>

              <button
                onClick={download}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-10 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-3 shadow-lg"
              >
                <Download size={28} />
                Download Signature (PNG)
              </button>
            </div>

            {/* Canvas */}
            <div className="w-full max-w-4xl mx-auto">
              <canvas
                ref={canvasRef}
                width={900}
                height={350}
                className="w-full h-[250px] sm:h-[300px] md:h-[350px] border-4 border-indigo-300 rounded-3xl shadow-2xl cursor-crosshair bg-white touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <p className="text-center mt-8 text-gray-600 text-lg">
              💡 Tip: Use mouse on desktop or finger on mobile/tablet for natural handwriting!
            </p>
          </div>

          <p className="text-center mt-10 text-gray-600">
            No signup • Unlimited signatures • Transparent background • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Signature Maker Online Free - Create Digital Signature Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Design professional handwritten or styled signatures online. Draw naturally with mouse or finger, customize color — download transparent PNG for documents, emails, and forms. Completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Natural Handwriting</h3>
            <p className="text-gray-600">
              Draw freely with mouse or finger — feels like signing on paper.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fully Customizable</h3>
            <p className="text-gray-600">
              Choose any color for pen — perfect for matching brand or style.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Transparent & Ready</h3>
            <p className="text-gray-600">
              Download as transparent PNG — ready for Word, PDF, email signatures.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Create Digital Signature in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Draw Your Signature</h4>
              <p className="text-gray-600 text-lg">Use mouse or finger to sign naturally on the canvas.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Customize Color</h4>
              <p className="text-gray-600 text-lg">Pick any pen color to match your style or brand.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download PNG</h4>
              <p className="text-gray-600 text-lg">Save transparent signature for documents and emails.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Create professional signatures every day with PDF Linx — trusted by thousands for easy, fast, and completely free digital signature creation.
        </p>
      </section>
    </>
  );
}






















// "use client";

// import { useRef, useState, useEffect } from "react";

// export default function SignatureMakerClient() {
//   const canvasRef = useRef(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, [bgColor]);

//   const getCoordinates = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     let x, y;

//     if (e.touches && e.touches.length > 0) {
//       x = e.touches[0].clientX - rect.left;
//       y = e.touches[0].clientY - rect.top;
//     } else {
//       x = e.clientX - rect.left;
//       y = e.clientY - rect.top;
//     }

//     // Scaling fix (for responsive canvas)
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;

//     return {
//       x: x * scaleX,
//       y: y * scaleY,
//     };
//   };

//   const startDrawing = (e) => {
//     const { x, y } = getCoordinates(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     if (!drawing) return;
//     const { x, y } = getCoordinates(e);
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.lineWidth = 2;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = color;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     setDrawing(false);
//   };

//   const clear = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   const download = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = "signature.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-2">
//           Free Signature Maker
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 mb-10">
//           Draw or type → Download transparent PNG signature!
//         </p>

//         <div className="flex justify-center gap-4 mb-8 flex-wrap">
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-12 h-12 md:w-16 md:h-16 rounded-full cursor-pointer"
//           />
//           <button
//             onClick={clear}
//             className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-red-700"
//           >
//             Clear
//           </button>
//           <button
//             onClick={download}
//             className="bg-green-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold hover:bg-green-700"
//           >
//             Download PNG
//           </button>
//         </div>

//         <div className="w-full max-w-[800px] mx-auto">
//           <canvas
//             ref={canvasRef}
//             width={800}
//             height={300}
//             className="w-full h-[180px] sm:h-[220px] md:h-[300px] border-4 border-indigo-300 rounded-2xl shadow-2xl cursor-crosshair bg-white"
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={stopDrawing}
//             onMouseLeave={stopDrawing}
//             onTouchStart={startDrawing}
//             onTouchMove={draw}
//             onTouchEnd={stopDrawing}
//           />
//         </div>

//         <p className="mt-10 text-gray-600 text-sm md:text-base">
//           Tip: Sign with your mouse or finger on mobile!
//         </p>
//       </div>
//     </div>
//   );
// }


