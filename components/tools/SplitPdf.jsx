// app/split-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Scissors } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";




export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert/split-pdf", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
      } else {
        alert("Split failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file ? file.name.replace(/\.pdf$/i, "-split-pages.zip") : "split-pages.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>


{/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

{/* HowTo Schema - Split PDF */}
<Script
  id="howto-schema-split-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Split a PDF into Individual Pages Online",
      description: "Split any PDF into separate pages instantly using PDF Linx - completely free, no signup required.",
      url: "https://pdflinx.com/split-pdf",
      step: [
        { "@type": "HowToStep", name: "Upload PDF", text: "Click the upload area and select your PDF file." },
        { "@type": "HowToStep", name: "Click Split", text: "Press 'Split PDF' and wait a few seconds." },
        { "@type": "HowToStep", name: "Download", text: "Download the ZIP containing all individual pages." }
      ],
      totalTime: "PT40S",
      estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      image: "https://pdflinx.com/og-image.png"
    }, null, 2),
  }}
/>

{/* Breadcrumb Schema - Split PDF */}
<Script
  id="breadcrumb-schema-split-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
        { "@type": "ListItem", position: 2, name: "Split PDF", item: "https://pdflinx.com/split-pdf" }
      ]
    }, null, 2),
  }}
/>
      {/* ==================== UI EXACTLY SAME AS WORD TO PDF ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
              Split PDF Online Free
            </h1>
            <p className="text-xl text-gray-600">
              Split PDF into individual pages online for free. Extract pages instantly with our fast,
              secure PDF splitter — no signup, no watermark.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSplit} className="space-y-8">
              {/* Upload Area - Same as Word to PDF */}
              <div className="relative">
                <label className="block">
                  <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <Scissors className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-700">
                      {/* {file ? file.name : "Drop PDF here or click to upload"} */}
                      {file ? file.name : "Drop your PDF here or click to upload and split online"}

                    </p>
                    {/* <p className="text-sm text-gray-500 mt-2">Your PDF will be split page by page</p> */}
                    <p className="text-sm text-gray-500 mt-2">
                      Split PDF into individual pages • Extract pages from PDF • 100% free
                    </p>

                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Split Button - Same gradient as Word to PDF */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>Splitting your PDF...</>
                ) : (
                  <>
                    <Scissors size={28} />
                    Split PDF
                  </>
                )}
              </button>
            </form>

            {/* Success - Exactly same style */}
            {success && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-4">PDF Split Complete!</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg flex items-center gap-3 mx-auto"
                >
                  <Download size={28} />
                  Download ZIP File
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              No signup • No watermark • 100% free • Files delete after 1 hour
            </p>
          </div>
        </div>
      </main>





{/* ==================== UNIQUE SEO CONTENT SECTION - BELOW THE TOOL ==================== */}
<section className="mt-20 max-w-5xl mx-auto px-6 pb-16">
  {/* Main Heading */}
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
      Split PDF Online Free - Fast & Secure
    </h2>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      Extract individual pages from your PDF in seconds. No signup, no watermarks, no limits. 
      Perfect for reports, invoices, ebooks, or any multi-page document.
    </p>
  </div>

  {/* Benefits Grid - 3 Cards with Icons */}
  <div className="grid md:grid-cols-3 gap-8 mb-20">
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Scissors className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant Page Extraction</h3>
      <p className="text-gray-600">
        Split large PDFs into single pages quickly. Download all pages as a clean ZIP file.
      </p>
    </div>

    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">100% Free & Private</h3>
      <p className="text-gray-600">
        No registration needed. Files are encrypted and automatically deleted after 1 hour.
      </p>
    </div>

    <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Upload className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Works Everywhere</h3>
      <p className="text-gray-600">
        Use on mobile, tablet, or desktop. Supports all PDF files - no size limits.
      </p>
    </div>
  </div>

  {/* How To Steps - Clean Numbered List */}
  <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100">
    <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
      How to Split a PDF in 3 Simple Steps
    </h3>
    <div className="grid md:grid-cols-3 gap-10">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
          1
        </div>
        <h4 className="text-xl font-semibold mb-3">Upload Your PDF</h4>
        <p className="text-gray-600">Drag & drop or click to select your file</p>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
          2
        </div>
        <h4 className="text-xl font-semibold mb-3">Click Split PDF</h4>
        <p className="text-gray-600">We process and extract all pages instantly</p>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
          3
        </div>
        <h4 className="text-xl font-semibold mb-3">Download Pages</h4>
        <p className="text-gray-600">Get your split pages in a ZIP file - done!</p>
      </div>
    </div>
  </div>

  {/* Final CTA Line */}
  <p className="text-center mt-12 text-lg text-gray-500 italic">
    Join thousands who split PDFs daily with PDF Linx — fast, free, and reliable.
  </p>
</section>


      <RelatedToolsSection currentPage="split-pdf" />



    </>
  );
}






















// "use client";
// import { useState, useRef } from "react";

// export default function SplitPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSplit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select a PDF file to split.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     setDownloadUrl("");

//     try {
//       const res = await fetch("/api/convert/split-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`HTTP ${res.status}: ${text}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//       } else {
//         alert("Split failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (error) {
//       console.error("Error splitting PDF:", error);
//       alert("Error splitting PDF: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (downloadUrl) {
//       try {
//         const response = await fetch(downloadUrl);
//         if (!response.ok) throw new Error("Download failed");
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = file ? file.name.replace(/\.[^.]+$/, "-split.zip") : "split.zip";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       } catch (err) {
//         console.error("Download error:", err);
//         alert("Failed to download file");
//       }
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       {/* Heading */}
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">Split PDF</h1>
//         <p className="text-gray-600 mb-8">
//           Split your PDF into individual pages easily.
//         </p>
//       </div>

//       {/* Upload / Split Form */}
//       <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="hidden"
//         />

//         {/* Select File Button */}
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
//         >
//           Select File
//         </button>

//         {/* File Info */}
//         <p className="text-gray-600">
//           {file ? `Selected File: ${file.name}` : "Select a PDF file to split."}
//         </p>

//         {/* Split Button */}
//         <form onSubmit={handleSplit}>
//           <button
//             type="submit"
//             className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Splitting..." : "Split PDF"}
//           </button>
//         </form>

//         {/* Download Section */}
//         {downloadUrl && (
//           <div className="flex flex-col items-center space-y-4 mt-6">
//             <p className="text-lg font-semibold text-green-600">
//               ✅ Split Complete!
//             </p>
//             <button
//               onClick={handleDownload}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
//             >
//               Download Split ZIP
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

