// app/pdf-to-word/page.js

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, FileText } from "lucide-react";

export const metadata = {
  title: "PDF to Word Converter - Free, Fast & No Signup | PDF Linx",
  description: "Convert PDF to editable Word (DOCX) online for free. No registration, no watermark, 100% secure and works on mobile.",
};

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/convert/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.click();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setFile(null); // Reset after success
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== SAME OLD PERFECT SCHEMA (UNCHANGED) ==================== */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Word Online for Free",
              description: "Convert any PDF file to editable Word document in just 3 simple steps using PDF Linx - completely free and no signup required.",
              url: "https://www.pdflinx.com/pdf-to-word",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload your PDF",
                  text: "Click on 'Select PDF file' button and choose the PDF you want to convert from your device."
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press the 'Convert to Word' button and wait a few seconds while we process your file."
                },
                {
                  "@type": "HowToStep",
                  name: "Download Word file",
                  text: "Your converted .docx file will automatically download. Open it in Microsoft Word or Google Docs."
                }
              ],
              totalTime: "PT30S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD"
              },
              tool: [{ "@type": "HowToTool", name: "PDF Linx PDF to Word Converter" }],
              image: "https://www.pdflinx.com/og-image.png"
            }, null, 2)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://www.pdflinx.com/pdf-to-word" }
              ]
            }, null, 2)
          }}
        />
      </head>

      {/* ==================== BRAND NEW MODERN UI - SAME AS WORD TO PDF ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              PDF to Word Converter
            </h1>
            <p className="text-xl text-gray-600">
              Convert PDF to editable Word (DOCX) — fast, accurate & 100% free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-700">
                      {file ? file.name : "Drop PDF here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Your text will be fully editable in Word</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>Converting your PDF...</>
                ) : (
                  <>
                    <FileText size={28} />
                    Convert to Word
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-4">Converted Successfully!</p>
                <p className="text-lg text-gray-700">Your editable Word file has been downloaded</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              No signup • No watermark • 100% free • Files delete after 1 hour
            </p>
          </div>
        </div>
      </main>
    </>
  );
}




























// "use client";
// import { useState } from "react";

// export default function PdfToWord() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

// const API_URL = "";


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!file) return alert("Please select a PDF file");

//   setLoading(true);
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     // ← YEHI LINE HAI JO SAB THEEK KAREGI
//     const res = await fetch("/convert/pdf-to-word", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Conversion failed");

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.name.replace(/\.pdf$/i, ".docx");
//     a.click();
//     window.URL.revokeObjectURL(url);

//   } catch (err) {
//     alert("Error: " + err.message);
//   } finally {
//     setLoading(false);
//     setFile(null);
//   }
// };
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your PDF to Word documents with incredible accuracy.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
//         <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition text-lg font-medium">
//           {file ? file.name : "Select PDF file"}
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="hidden"
//             required
//           />
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-blue-700 disabled:opacity-60 transition shadow-lg"
//         >
//           {loading ? "Converting... Please wait" : "Convert to Word"}
//         </button>
//       </form>

//       {loading && (
//         <p className="mt-8 text-blue-600 text-lg font-medium animate-pulse">
//           Converting your PDF... (takes 5-15 seconds)
//         </p>
//       )}
//     </main>
//   );
// }

