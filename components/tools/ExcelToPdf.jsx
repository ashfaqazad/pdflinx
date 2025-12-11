// app/excel-pdf/page.js   (or excel-to-pdf/page.js)

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, FileSpreadsheet } from "lucide-react";

export const metadata = {
  title: "Excel to PDF Converter - Free, Fast & Online | PDF Linx",
  description: "Convert Excel (XLSX, XLS) to PDF online for free. Perfect formatting, no signup, instant download.",
};

export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an Excel file first");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert/excel-to-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
      } else {
        alert("Conversion failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
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
      a.download = file ? file.name.replace(/\.(xlsx|xls)$/i, ".pdf") : "converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Excel to PDF Online for Free",
              description: "Convert any Excel spreadsheet (XLSX, XLS) to PDF in seconds - completely free, no signup required.",
              url: "https://www.pdflinx.com/excel-pdf",
              step: [
                { "@type": "HowToStep", name: "Upload Excel", text: "Click the upload area and select your .xlsx or .xls file." },
                { "@type": "HowToStep", name: "Convert to PDF", text: "Click 'Convert to PDF' and wait a few seconds." },
                { "@type": "HowToStep", name: "Download", text: "Download your perfectly formatted PDF file instantly." }
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
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
                { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://www.pdflinx.com/excel-pdf" }
              ]
            }, null, 2)
          }}
        />
      </head>

      {/* ==================== UI EXACTLY SAME AS WORD TO PDF ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Excel to PDF Converter
            </h1>
            <p className="text-xl text-gray-600">
              Convert XLSX/XLS to PDF with perfect formatting — fast & free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleConvert} className="space-y-8">
              {/* Upload Area - Same as Word to PDF */}
              <div className="relative">
                <label className="block">
                  <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-700">
                      {file ? file.name : "Drop Excel file here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Supports .xlsx, .xls • Perfect layout preserved</p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Convert Button - Same gradient */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>Converting your Excel...</>
                ) : (
                  <>
                    <FileSpreadsheet size={28} />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>

            {/* Success State - 100% same */}
            {success && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-4">Excel Converted Successfully!</p>
                <p className="text-lg text-gray-700 mb-4">Your spreadsheet is now a perfect PDF</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg flex items-center gap-3 mx-auto"
                >
                  <Download size={28} />
                  Download PDF
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
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
// import { useState, useRef } from "react";

// export default function ExcelToPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select an Excel file to convert.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     setDownloadUrl("");

//     try {
//       const res = await fetch("/api/convert/excel-to-pdf", {
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
//         alert("Conversion failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (error) {
//       console.error("Error converting Excel to PDF:", error);
//       alert("Error converting Excel to PDF: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };



// const handleDownload = async () => {
//   if (downloadUrl) {
//     try {
//       const response = await fetch(downloadUrl, {
//         headers: {
//           "Accept": "application/octet-stream", // Force binary download
//         },
//       });
//       if (!response.ok) throw new Error("Download failed");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file ? file.name.replace(/\.[^.]+$/, ".pdf") : "converted.pdf";
//       a.style.display = "none"; // Ensure link isn't visible
//       document.body.appendChild(a);
//       a.click();
//       // Immediate cleanup to prevent memory leaks
//       setTimeout(() => {
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       }, 100);
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("Failed to download file");
//     }
//   }
// };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       {/* Heading */}
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">Excel to PDF Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your Excel files (.xlsx, .xls) to PDF with high quality.
//         </p>
//       </div>

//       {/* Upload / Convert Form */}
//       <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           accept=".xlsx,.xls"
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
//           {file ? `Selected File: ${file.name}` : "Select an Excel file to convert."}
//         </p>

//         {/* Convert Button */}
//         <form onSubmit={handleConvert}>
//           <button
//             type="submit"
//             className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Converting..." : "Convert to PDF"}
//           </button>
//         </form>

//         {/* Download Section */}
//         {downloadUrl && (
//           <div className="flex flex-col items-center space-y-4 mt-6">
//             <p className="text-lg font-semibold text-green-600">
//               ✅ Conversion Complete!
//             </p>
//             <button
//               onClick={handleDownload}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
//             >
//               Download PDF
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
