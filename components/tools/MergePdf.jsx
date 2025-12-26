// app/merge-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Download, CheckCircle, X, Files } from "lucide-react";
import Script from "next/script";


export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const handleMerge = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
      } else {
        alert("Merge failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error merging PDFs. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-pdf.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download merged PDF");
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>


{/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

{/* HowTo Schema - Merge PDF */}
<Script
  id="howto-schema-merge-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Merge Multiple PDF Files Online for Free",
      description: "Combine 2 or more PDF files into one single document in seconds - 100% free, no registration required.",
      url: "https://www.pdflinx.com/merge-pdf",
      step: [
        {
          "@type": "HowToStep",
          name: "Select PDF Files",
          text: "Click 'Select Files' and choose 2 or more PDF files from your device. You can select multiple files at once."
        },
        {
          "@type": "HowToStep",
          name: "Click Merge PDFs",
          text: "Press the 'Merge PDFs' button and wait a few seconds while we combine your files."
        },
        {
          "@type": "HowToStep",
          name: "Download Merged PDF",
          text: "Your merged PDF will be ready instantly - click download to save the combined file."
        }
      ],
      totalTime: "PT45S",
      estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      tool: [{ "@type": "HowToTool", name: "PDF Linx Merge Tool" }],
      image: "https://www.pdflinx.com/og-image.png"
    }, null, 2),
  }}
/>

{/* Breadcrumb Schema - Merge PDF */}
<Script
  id="breadcrumb-schema-merge-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
        { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://www.pdflinx.com/merge-pdf" }
      ]
    }, null, 2),
  }}
/>


      {/* ==================== MODERN UI (Same as Word/Image to PDF) ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
              Merge PDF Files Online (Free)
            </h1>
            <p className="text-2xl text-gray-700">
              Combine multiple PDF files into one online — fast, secure & completely free.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <div className="space-y-10">
              {/* Upload Area */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-4 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                >
                  <Files className="w-24 h-24 mx-auto mb-6 text-indigo-600" />
                  <p className="text-2xl font-bold text-gray-800">
                    {files.length > 0 ? `${files.length} PDF files selected` : "Drop PDF files here or click to upload"}
                  </p>
                  <p className="text-gray-600 mt-3">Merge 2 or more PDFs into one file instantly</p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-6 bg-gray-50 rounded-2xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                        <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                        <p className="text-xs text-center font-medium truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Merge Button */}
              <button
                onClick={handleMerge}
                disabled={loading || files.length < 2}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-2xl py-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xl flex items-center justify-center gap-4"
              >
                {loading ? (
                  "Merging your PDFs..."
                ) : (
                  <>
                    <Upload size={32} />
                    Merge PDFs Now
                  </>
                )}
              </button>
            </div>

            {/* Success State */}
            {success && (
              <div className="mt-12 p-10 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl text-center animate-pulse">
                <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
                <p className="text-3xl font-bold text-green-700 mb-6">All PDFs merged successfully!</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-green-700 transition shadow-2xl flex items-center gap-4 mx-auto"
                >
                  <Download size={36} />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <div className="text-center mt-12 text-gray-600 space-y-2">
            <p className="font-semibold text-lg">No signup • No limits • Files deleted after 1 hour</p>
            <p className="text-sm">100% Free • Secure • Works on all devices</p>
          </div>
        </div>
      </main>


      {/* ==================== UNIQUE SEO CONTENT SECTION - MERGE PDF ==================== */}
      <section className="mt-20 max-w-5xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
            Merge PDF Online Free - Combine Files Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combine multiple PDF files into one single document in seconds. Perfect for reports, contracts, ebooks, or any project needing unified PDFs.
          </p>
        </div>

        {/* Benefits Grid - 3 Cards with Icons */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Unlimited Merges</h3>
            <p className="text-gray-600">
              Merge PDF files online free – combine as many documents as you need, no limits or hidden fees.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Preserve Quality & Order</h3>
            <p className="text-gray-600">
              Combine PDF files without losing formatting. Rearrange pages easily before merging.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Safe & Private</h3>
            <p className="text-gray-600">
              Merge PDFs quickly on any device. Files encrypted and deleted after 1 hour – 100% secure.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            How to Merge PDF Files in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-xl font-semibold mb-3">Upload PDFs</h4>
              <p className="text-gray-600">Drag & drop multiple PDF files or click to select</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-xl font-semibold mb-3">Arrange Order</h4>
              <p className="text-gray-600">Reorder pages with drag & drop if needed</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-xl font-semibold mb-3">Click Merge</h4>
              <p className="text-gray-600">Download your combined PDF instantly!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-lg text-gray-500 italic">
          Trusted by thousands daily – merge PDF files free, fast, and without hassle at PDF Linx.
        </p>
      </section>



    </>
  );
}









// "use client";
// import { useState, useRef } from "react";

// export default function MergePDF() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFiles([...e.target.files]);
//   };

//   const handleMerge = async (e) => {
//     e.preventDefault();
//     if (files.length < 2) {
//       alert("Please select at least 2 PDF files to merge.");
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));

//     setLoading(true);
//     setDownloadUrl("");

//     try {
//       const res = await fetch("/api/convert/merge-pdf", {
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
//         alert("Merge failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (error) {
//       console.error("Error merging PDFs:", error);
//       alert("Error merging PDFs: " + error.message);
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
//         a.download = "merged.pdf"; // Fixed name, ya files[0]?.name se derive kar sakte ho
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
//         <h1 className="text-3xl font-bold mb-2">Merge PDF Files</h1>
//         <p className="text-gray-600 mb-8">
//           Combine multiple PDF files into a single document easily.
//         </p>
//       </div>

//       {/* Upload / Merge Form */}
//       <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           multiple
//           accept="application/pdf"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="hidden"
//         />

//         {/* Select Files Button */}
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
//         >
//           Select Files
//         </button>

//         {/* Info */}
//         <p className="text-gray-600">
//           {files.length > 0
//             ? `${files.length} file(s) selected`
//             : "Select 2 or more PDF files to merge."}
//         </p>

//         {/* Merge Button */}
//         <button
//           className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
//           onClick={handleMerge}
//           disabled={loading}
//         >
//           {loading ? "Merging..." : "Merge PDFs"}
//         </button>

//         {/* Download Section */}
//         {downloadUrl && (
//           <div className="flex flex-col items-center space-y-4 mt-6">
//             <p className="text-lg font-semibold text-green-600">
//               ✅ Merge Complete!
//             </p>
//             <button
//               onClick={handleDownload}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
//             >
//               Download Merged PDF
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


