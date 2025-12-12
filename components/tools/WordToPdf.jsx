// app/word-to-pdf/page.js

"use client";
import { useState } from "react";
import { Upload, FileText, Download, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Word to PDF Converter - Free, Fast & No Signup | PDF Linx",
  description: "Convert Word (DOC/DOCX) to PDF online for free. No registration, no watermark, perfect formatting preserved.",
};

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a Word file first!");

    setLoading(true);
    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
      } else {
        alert("Conversion failed: " + data.error);
      }
    } catch (err) {
      alert("Something went wrong, please try again.");
      console.error(err);
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
      a.download = file.name.replace(/\.(doc|docx)$/i, ".pdf");
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("There was a problem with the download.");
    }
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <head>
        {/* HowTo Schema - Google will like this */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Word to PDF Online for Free",
              description:
                "Convert any Word document (DOC/DOCX) to PDF in just 3 simple steps - completely free, no signup needed.",
              url: "https://www.pdflinx.com/word-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Word File",
                  text: "Click 'Select Word file' and choose your .doc or .docx file from computer or phone.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press the 'Convert to PDF' button and wait 5-10 seconds.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF",
                  text: "Your converted PDF will be ready - click download and save it.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              image: "https://www.pdflinx.com/og-image.png",
            }, null, 2),
          }}
        />

        {/* Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.pdflinx.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Word to PDF",
                  item: "https://www.pdflinx.com/word-to-pdf",
                },
              ],
            }, null, 2),
          }}
        />
      </head>

      {/* ==================== MODERN UI ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Word to PDF Converter
            </h1>
            <p className="text-xl text-gray-600">
              Convert DOC or DOCX to a perfect PDF in just one click — completely free!
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Input */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      file
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-700">
                      {file
                        ? file.name
                        : "Drop your Word file here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Only .doc, .docx supported
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                  <>Converting... Please wait a moment</>
                ) : (
                  <>
                    <FileText size={28} />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>

            {/* Success State */}
            {success && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-4">
                  Converted successfully!
                </p>
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
              No signup • No watermark • Files delete after 1 hour • 100% free
            </p>
          </div>
        </div>
      </main>
    </>
  );
}























// // app/word-to-pdf/page.js

// "use client";
// import { useState } from "react";
// import { Upload, FileText, Download, CheckCircle } from "lucide-react";

// export const metadata = {
//   title: "Word to PDF Converter - Free, Fast & No Signup | PDF Linx",
//   description: "Convert Word (DOC/DOCX) to PDF online for free. No registration, no watermark, perfect formatting preserved.",
// };

// export default function WordToPdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Pehle Word file select karo bhai!");

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/convert/word-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion fail ho gaya: " + data.error);
//       }
//     } catch (err) {
//       alert("Kuch to gadbad ho gaya bhai, dobara try karo");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.(doc|docx)$/i, ".pdf");
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download mein problem aaya");
//     }
//   };

//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <head>
//         {/* HowTo Schema - Google isko pasand karega */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "HowTo",
//               name: "How to Convert Word to PDF Online for Free",
//               description: "Convert any Word document (DOC/DOCX) to PDF in just 3 simple steps - completely free, no signup needed.",
//               url: "https://www.pdflinx.com/word-to-pdf",
//               step: [
//                 {
//                   "@type": "HowToStep",
//                   name: "Upload Word File",
//                   text: "Click 'Select Word file' and choose your .doc or .docx file from computer or phone."
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Click Convert",
//                   text: "Press the 'Convert to PDF' button and wait 5-10 seconds."
//                 },
//                 {
//                   "@type": "HowToStep",
//                   name: "Download PDF",
//                   text: "Your converted PDF will be ready - click download and save it."
//                 }
//               ],
//               totalTime: "PT30S",
//               estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//               image: "https://www.pdflinx.com/og-image.png"
//             }, null, 2)
//           }}
//         />

//         {/* Breadcrumb */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
//                 { "@type": "ListItem", position: 2, name: "Word to PDF", item: "https://www.pdflinx.com/word-to-pdf" }
//               ]
//             }, null, 2)
//           }}
//         />
//       </head>

//       {/* ==================== MODERN UI ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
//         <div className="max-w-2xl w-full">
//           {/* Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
//               Word to PDF Converter
//             </h1>
//             <p className="text-xl text-gray-600">
//               Convert DOC or DOCX to a perfect PDF in just one click — completely free!            </p>
//           </div>

//           {/* Upload Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* File Input */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
//                     <p className="text-xl font-semibold text-gray-700">
//                       {file ? file.name : "Word file yahan drop karo ya click karo"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">Only .doc, .docx supported</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <>Converting... Thoda wait karo</>
//                 ) : (
//                   <>
//                     <FileText size={28} />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
//                 <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                 <p className="text-2xl font-bold text-green-700 mb-4">Converted successfully!</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg flex items-center gap-3 mx-auto"
//                 >
//                   <Download size={28} />
//                   Download PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer Note */}
//           <div className="text-center mt-8 text-gray-600">
//             <p className="text-sm">
//               No signup • No watermark • Files delete after 1 hour • 100% free
//             </p>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }






















// "use client";
// import { useState } from "react";

// export default function WordToPdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);  // Download link ke liye

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select a Word file");
//       return;
//     }

//     setLoading(true);
//     setDownloadUrl(null);  // Reset previous

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("/api/convert/word-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         // ✅ Use full download link from VPS
//         setDownloadUrl(`/api${data.download}`);
//       } else {
//         alert("Conversion failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (err) {
//       alert("Something went wrong!");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleDownload = async () => {
//   if (downloadUrl) {
//     try {
//       const response = await fetch(downloadUrl);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.[^.]+$/, ".pdf");
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("Failed to download file");
//     }
//   }
// };



//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
//       <p className="text-gray-600 mb-8">
//         Convert your Word document (.docx) to PDF with high quality.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col items-center space-y-6"
//       >
//         <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
//           {file ? file.name : "Select Word file"}
//           <input
//             type="file"
//             accept=".doc,.docx"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="hidden"
//           />
//         </label>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
//           disabled={loading}
//         >
//           {loading ? "Converting..." : "Convert to PDF"}
//         </button>
//       </form>

//       {downloadUrl && (
//         <div className="mt-6 flex flex-col items-center space-y-2">
//           <p className="text-green-600">Conversion successful! Download your file:</p>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
//           >
//             Download PDF
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }








