// app/merge-pdf/page.js

"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Download, CheckCircle, X, Files } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



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
      url: "https://pdflinx.com/merge-pdf",
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
      image: "https://pdflinx.com/og-image.png"
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
        { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://pdflinx.com/merge-pdf" }
      ]
    }, null, 2),
  }}
/>


      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Merge PDF Files Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need to combine a few PDFs into one? Drop them here – we’ll stitch them together perfectly. Fast, easy, and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
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
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                >
                  <Files className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
                  <p className="text-lg font-semibold text-gray-800">
                    {files.length > 0 ? `${files.length} PDF${files.length > 1 ? 's' : ''} ready` : "Drop PDFs here or click to upload"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Combine 2 or more into one clean file</p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                        <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
                        <p className="text-xs text-center font-medium truncate">{file.name}</p>
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Merging your PDFs..."
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Merge PDFs Now
                  </>
                )}
              </button>
            </div>

            {/* Success State */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All merged!</p>
                <p className="text-base text-gray-700 mb-3">Your PDFs are now one perfect file</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • No limits • Files gone after 1 hour • 100% free & secure
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Merge PDF Online Free – Combine Files in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got multiple PDFs that belong together? Merge them into one clean document here – order stays perfect, super fast, and always free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Merge as Many as You Want</h3>
            <p className="text-gray-600 text-sm">
              Combine 2 or 200 PDFs – no limits, no fees.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Stays Perfect</h3>
            <p className="text-gray-600 text-sm">
              Formatting, quality, order – just like the originals.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Works instantly – files deleted after 1 hour, no sign-up needed.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Merge PDFs in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDFs</h4>
              <p className="text-gray-600 text-sm">Drop multiple files – easy preview.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
              <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Merge & Download</h4>
              <p className="text-gray-600 text-sm">Your combined PDF is ready!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands merge PDFs daily with PDF Linx – simple, reliable, and always free.
        </p>
      </section>

      <RelatedToolsSection currentPage="merge-pdf" />
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


