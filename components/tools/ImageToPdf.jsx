// app/image-to-pdf/page.js

"use client";
import { useState } from "react";
import { Upload, Image, Download, CheckCircle, X } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



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

{/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

{/* HowTo Schema - Image to PDF */}
<Script
  id="howto-schema-image-to-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Convert Images to PDF Online for Free",
      description: "Convert multiple JPG, PNG, WebP, or GIF images into a single PDF file in just 3 easy steps - 100% free, no signup required.",
      url: "https://pdflinx.com/image-to-pdf",
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
      image: "https://pdflinx.com/og-image.png"
    }, null, 2),
  }}
/>

{/* Breadcrumb Schema - Image to PDF */}
<Script
  id="breadcrumb-schema-image-to-pdf"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
        { "@type": "ListItem", position: 2, name: "Image to PDF", item: "https://pdflinx.com/image-to-pdf" }
      ]
    }, null, 2),
  }}
/>
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a bunch of photos or screenshots? Turn them into one neat PDF in seconds – perfect quality, super easy, and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drop Zone */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}>
                    <Image className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length > 0 ? `${files.length} image(s) ready` : "Drop images here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP • Up to 50 images</p>
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
                  <div className="mt-4 grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-3 bg-gray-50 rounded-xl">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-28 object-cover rounded-lg shadow"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Turning images into PDF..."
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All done!</p>
                <p className="text-base text-gray-700 mb-3">Your images are now one beautiful PDF</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Your PDF
                </button>
              </div>
            )}
          </div>

          {/* Trust Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No sign-up • No watermark • Files gone after 1 hour • 100% free & secure
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image to PDF Online Free – Photos into One Clean PDF
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your JPGs, PNGs, screenshots, or any pics into a single PDF – each on its own page, looking sharp. Great for portfolios, reports, or just keeping things organized. Fast and free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Image Works</h3>
            <p className="text-gray-600 text-sm">
              JPG, PNG, GIF, WebP – single or up to 50 at once.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Professional</h3>
            <p className="text-gray-600 text-sm">
              Full quality, each image on its own page – clean and sharp.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion – no sign-up, files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Turn Images into PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Photos</h4>
              <p className="text-gray-600 text-sm">Drop one or many – easy preview.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
              <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Your PDF</h4>
              <p className="text-gray-600 text-sm">Download your combined PDF instantly!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          People turn photos into PDFs daily with PDF Linx – quick, clean, and always free.
        </p>
      </section>

      <RelatedToolsSection currentPage="image-to-pdf" />

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
