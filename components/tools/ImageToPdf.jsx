// app/image-to-pdf/page.js

"use client";
import { useState } from "react";
import { Upload, Image, Download, CheckCircle, X } from "lucide-react";

export const metadata = {
  title: "Image to PDF Converter - Free, Fast & Online | PDF Linx",
  description: "Convert JPG, PNG, GIF, WebP images to PDF online for free. Multiple images supported, no signup, perfect quality.",
};

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/convert/image-to-pdf", {
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
      alert("Something went wrong. Please try again.");
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
      a.download = files.length === 1 ? files[0].name.replace(/\.[^/.]+$/, ".pdf") : "images-converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed. Please try again.");
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <head>
        {/* HowTo Schema - Google Rich Results ke liye */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Images to PDF Online for Free",
              description: "Convert multiple JPG, PNG, WebP, or GIF images into a single PDF file in just 3 easy steps - 100% free, no signup required.",
              url: "https://www.pdflinx.com/image-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Select Images",
                  text: "Click the upload area and select one or multiple images (JPG, PNG, GIF, WebP supported)."
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to PDF",
                  text: "Click 'Convert to PDF' and wait a few seconds while we process your images."
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF",
                  text: "Your PDF file will be ready - click download to save it instantly."
                }
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://www.pdflinx.com/og-image.png"
            }, null, 2)
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Image to PDF", item: "https://www.pdflinx.com/image-to-pdf" }
              ]
            }, null, 2)
          }}
        />
      </head>

      {/* ==================== MODERN & BEAUTIFUL UI ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image to PDF Converter
            </h1>
            <p className="text-xl text-gray-700">
              Convert JPG, PNG, GIF, WebP images to a single PDF — instantly & free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Drop Zone */}
              <div className="relative">
                <label className="block">
                  <div className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}>
                    <Image className="w-20 h-20 mx-auto mb-6 text-purple-600" />
                    <p className="text-2xl font-bold text-gray-800">
                      {files.length > 0 ? `${files.length} image(s) selected` : "Drop images here or click to upload"}
                    </p>
                    <p className="text-gray-500 mt-3">Supports JPG, PNG, GIF, WebP • Up to 50 images</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                </label>

                {/* Selected Images Preview */}
                {files.length > 0 && (
                  <div className="mt-6 grid grid-cols-4 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-2xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                        <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl py-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  "Converting your images..."
                ) : (
                  <>
                    <Upload size={28} />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-10 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl text-center animate-bounce">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-6">All images converted successfully!</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition shadow-lg flex items-center gap-3 mx-auto"
                >
                  <Download size={32} />
                  Download Your PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <div className="text-center mt-10 text-gray-600 space-y-2">
            <p className="font-medium">No registration • No watermark • Files deleted after 1 hour</p>
            <p className="text-sm">100% Free • Secure • Works on mobile & desktop</p>
          </div>
        </div>
      </main>
    </>
  );
}





















// "use client";
// import { useState } from "react";

// export default function ImageToPdf() {
//   const [files, setFiles] = useState([]);  // Multiple files ke liye array
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);  // Download link ke liye

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       alert("Please select at least one image");
//       return;
//     }

//     setLoading(true);
//     setDownloadUrl(null);  // Reset previous

//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append("images", file);  // Backend array ke liye
//       });

//       const res = await fetch("/api/convert/image-to-pdf", {
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
//     if (downloadUrl) {
//       try {
//         const response = await fetch(downloadUrl);
//         if (!response.ok) throw new Error("Download failed");
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "images-to-pdf.pdf";  // Fixed name, ya files[0]?.name se derive kar sakte ho agar chahiye
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
//       <h1 className="text-3xl font-bold mb-2">Image to PDF Converter</h1>
//       <p className="text-gray-600 mb-8">
//         Convert your images (JPG, PNG, etc.) to a single PDF with high quality.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col items-center space-y-6"
//       >
//         <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
//           {files.length > 0 ? `${files.length} image(s) selected` : "Select Images"}
//           <input
//             type="file"
//             accept="image/*"  // All images: .jpg,.jpeg,.png,.gif etc.
//             multiple  // Multiple select enable
//             onChange={(e) => setFiles(Array.from(e.target.files))}
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
//             disabled={loading}  // Optional: disable during download
//           >
//             Download PDF
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }
