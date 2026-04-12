// app/image-to-pdf/page.js

"use client";
import { useState } from "react";
import { Upload, Image, Download, CheckCircle, X } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";



export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    startProgress();        // ← setLoading(true) ki jagah

    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/convert/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      // Read as text first (because 500 responses are often not JSON)
      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      // Try to parse JSON, otherwise treat it as plain error text
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, error: text || "Internal Server Error" };
      }

      // If server returned error status OR success false
      if (!res.ok || !data?.success) {
        cancelProgress();     // ← error pe
        alert("Conversion failed: " + (data?.error || `HTTP ${res.status}`));
        return;
      }

      // Success
      setDownloadUrl(data.download);
      completeProgress();     // ← setLoading(false) ki jagah

      setSuccess(true);

      // ✅ Scroll wali lines same rakhi
      setTimeout(() => {
        const downloadSection = document.getElementById('download-section');
        if (downloadSection) {
          downloadSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);

    } catch (err) {
      cancelProgress();       // ← catch pe
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
    // finally block hata diya — hook khud handle karta hai
  };


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert(
        `Only JPG, PNG, and WebP allowed.\nInvalid file: ${invalidFiles[0].name}`
      );
      e.target.value = ""; // reset file input
      return;
    }

    const hasWebP = selectedFiles.some((file) => file.type === "image/webp");
    if (hasWebP) {
      alert(
        "WebP image detected.\nBackend conversion support needed, warna 500 error aa sakta hai."
      );
    }

    setFiles(selectedFiles);
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
            description: "Convert JPG, PNG, or WebP images to PDF online free — no signup, no watermark. Up to 50 images combined into one PDF. Works on Windows, Mac, Android, iOS.",
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

      <Script
        id="faq-schema-image-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the Image to PDF converter free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. PDFLinx Image to PDF converter is completely free — no hidden charges, no subscription, no premium tier required."
                }
              },
              {
                "@type": "Question",
                name: "Do I need to install any software?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed."
                }
              },
              {
                "@type": "Question",
                name: "Which image formats are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "JPG, JPEG, PNG, and WebP are all supported. These cover the most common photo and screenshot formats used on phones, cameras, and computers."
                }
              },
              {
                "@type": "Question",
                name: "Can I convert multiple images into one PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Upload up to 50 images at once — all images are combined into one PDF with each image on its own page."
                }
              },
              {
                "@type": "Question",
                name: "Are my uploaded images safe and private?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties."
                }
              },
              {
                "@type": "Question",
                name: "Can I convert images to PDF on my phone?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required."
                }
              },
              {
                "@type": "Question",
                name: "Will my image quality be preserved after conversion?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Images are embedded into the PDF at full resolution — colors, sharpness, and detail stay exactly as they were in the original file."
                }
              },
              {
                "@type": "Question",
                name: "What should I do if the converted PDF file is too large?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use the Compress PDF tool on PDF Linx to reduce the file size after conversion — useful when emailing or uploading to portals with strict size limits."
                }
              }
            ]
          }, null, 2)
        }}
      />
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Image to PDF Converter Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert JPG, PNG, or WebP images into a professional PDF online free — no signup,
              no watermark, no software needed. Each image is placed on its own page with full
              quality preserved. Upload one image or combine up to 50 images into one PDF.
              Works on Windows, Mac, Android and iOS.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload Images", sub: "Single or multiple files" },
              { n: "2", label: "Arrange & Convert", sub: "Preview before export" },
              { n: "3", label: "Download PDF", sub: "One combined file" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                  {s.n}
                </div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── MAIN CARD ── */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* conversion overlay wrapper */}
            <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

              {/* blur overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-pink-200 border-b-transparent animate-spin"
                      style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      Converting your image{files.length > 1 ? "s" : ""}…
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {progress < 30
                        ? "Uploading…"
                        : progress < 70
                          ? "Building PDF…"
                          : "Almost done…"}
                    </p>
                  </div>

                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-5">

                {/* ── DROPZONE ── */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-purple-400 hover:bg-purple-50/40"
                      }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${files.length ? "bg-green-100" : "bg-purple-50 group-hover:bg-purple-100"
                        }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Image className="w-7 h-7 text-purple-600" />
                      )}
                    </div>

                    {files.length ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          {files.length} image{files.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Review preview below or click to change selection
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ JPG/PNG/WebP", "✓ Up to 50 images", "✓ Full quality", "✓ One PDF output"].map((t) => (
                            <span
                              key={t}
                              className="bg-white text-green-700 border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your image file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          or click to browse · JPG, PNG, WebP only
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Up to 50 images", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-purple-50 text-purple-700 border border-purple-100 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* ── SELECTED IMAGES PREVIEW ── */}
                {files.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Selected image preview</p>
                        <p className="text-xs text-gray-400">Images will appear in PDF in this upload order</p>
                      </div>
                      <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                        {files.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto">
                      {files.map((file, index) => (
                        <div key={index} className="relative group bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-28 object-cover rounded-lg"
                          />

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <p className="text-xs text-center mt-2 truncate text-gray-600">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── INFO ROW + CONVERT BUTTON ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <Image className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Image to PDF conversion</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Each image gets its own PDF page · One combined PDF download
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${files.length && !isLoading
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <Image className="w-4 h-4" />
                    Convert to PDF
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Large image sets may take a little longer — don&apos;t close this tab</p>
                  <p>💡 Best results with clear, high-resolution images · Output will be one combined PDF</p>
                </div>

              </form>

            </div>{/* end blur wrapper */}

            {/* ── SUCCESS STATE ── */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-800 mb-1">
                    Conversion Complete! 🎉
                  </h3>

                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    Your image{files.length > 1 ? "s are" : " is"} now combined into PDF format
                  </p>

                  <p className="text-xs text-gray-500 mb-6">
                    Click below to download your PDF file
                  </p>

                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition shadow-md mb-4"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSuccess(false);
                        setFiles([]);
                        setDownloadUrl(null);
                      }}
                      className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                    >
                      <Image className="w-4 h-4" />
                      Convert more images
                    </button>

                    <a
                      href="/pdf-to-jpg"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      PDF to JPG →
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No sign-up • No watermark • Auto-deleted after 1 hour • 100% free •
            Up to 50 images • Works on Windows, Mac, Android &amp; iOS
          </p>
        </div>
      </main>
      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image to PDF Online Free – Convert JPG, PNG & WebP to PDF in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to turn photos, screenshots, or scanned images into a PDF?
            Convert JPG, PNG, or WebP files here — each image placed on its own
            page, full quality preserved, ready to share or submit. Upload a
            single image or combine up to 50 into one PDF. Fast, free, and
            privacy-friendly on PDF Linx.
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
            <h3 className="text-xl font-semibold text-gray-800 mb-3">JPG, PNG & WebP Supported</h3>
            <p className="text-gray-600 text-sm">
              Upload any common image format — JPG, JPEG, PNG, or WebP. Single
              image or up to 50 images combined into one PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Full Quality Preserved</h3>
            <p className="text-gray-600 text-sm">
              Images are embedded at full resolution — colors, sharpness, and
              detail stay exactly as they were in the original photo or screenshot.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Converts in seconds — no sign-up, no watermark, files permanently
              deleted after processing to protect your privacy.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert Images to PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Images</h4>
              <p className="text-gray-600 text-sm">
                Select one image or upload up to 50 JPG, PNG, or WebP files at
                once. Drag and drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Review & Remove if Needed</h4>
              <p className="text-gray-600 text-sm">
                Preview your selected images. Remove any unwanted ones by
                clicking the X — images appear in upload order in the PDF.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Convert & Download PDF</h4>
              <p className="text-gray-600 text-sm">
                Click Convert to PDF and download your file instantly — one clean
                PDF with each image on its own page, full quality intact.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to do more with your PDF?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            After converting images to PDF, these tools can help you organize and share your document.
          </p>

          {/* ✅ YAHAN ADD KARO — list ke upar */}
          <p className="mt-4 text-sm text-slate-600">
            Have a HEIC, WebP, or any unusual image format that won't upload directly? First convert it to JPG using this{" "}
            <a href="https://convertlinx.com/heic-to-jpg" target="_blank" rel="noopener noreferrer" className="text-purple-700 font-semibold hover:underline">
              free image converter
            </a>
            , then come back here to create your PDF. ConvertLinx.com offers 10+ image tools — completely free.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/merge-pdf" className="text-purple-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine your image PDF with other documents into one file.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-purple-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce the PDF file size for easy email sharing or uploading.</span>
            </li>
            <li>
              <a href="/pdf-to-word" className="text-purple-700 font-semibold hover:underline">
                PDF to Word
              </a>{" "}
              <span className="text-slate-600">— convert your PDF back to an editable Word document.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-purple-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to convert images to PDF —
          fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Image to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Got photos, screenshots, receipts, or certificates in JPG or PNG format
          that need to be shared as one professional document? The{" "}
          <span className="font-medium text-slate-900">PDFLinx Image to PDF Converter</span>{" "}
          turns one or multiple images into a clean, high-quality PDF in seconds.
          Each image is placed on its own page at full resolution — no quality loss,
          no watermark, no sign-up required. Works on any device, in any browser.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is Image to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          Image to PDF conversion takes your image files — JPG, JPEG, PNG, or WebP
          — and embeds them into a Portable Document Format (PDF) file. Each image
          becomes a full page in the PDF, preserving original resolution, colors,
          and sharpness. The result is a universally compatible PDF that opens
          identically on every device — Windows, macOS, Android, iOS — without
          requiring any image viewer or editing software.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert Images to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Combine multiple photos into one organized, shareable PDF file</li>
          <li>Share receipts, certificates, or ID proofs professionally</li>
          <li>Submit scanned documents to portals that require PDF format</li>
          <li>Preserve image quality, colors, and resolution in a fixed-layout file</li>
          <li>Print multiple images cleanly — each on its own page</li>
          <li>Create portfolios, photo albums, or product catalogs as PDF</li>
          <li>Convert phone camera photos into a format accepted by official portals</li>
          <li>Archive images in a compact, organized PDF document</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              JPG vs PNG vs WebP — Which Format Converts Best?
            </h3>
            <p className="leading-7">
              All three formats are fully supported. <strong>JPG/JPEG</strong> is the
              most common format for photos — compact file size with good quality,
              converts cleanly to PDF. <strong>PNG</strong> supports transparency and
              is ideal for screenshots, logos, and graphics with sharp edges —
              converts with lossless quality. <strong>WebP</strong> is a modern format
              used by many web browsers and apps — also supported for PDF conversion.
              For best PDF output quality, use the highest resolution version of your
              image available before converting.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert Multiple Images to One PDF
            </h3>
            <p className="leading-7 mb-3">
              Upload multiple images at once — up to 50 files simultaneously. Images
              appear in the PDF in the order they are uploaded, with each image on
              its own page. To change the order, remove images using the X button
              and re-upload them in the correct sequence. After converting, if you
              need to combine the image PDF with other documents, use the{" "}
              <a href="/merge-pdf" className="text-purple-700 font-medium hover:underline">
                Merge PDF tool
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for Image to PDF Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Receipts and expense reports:</strong> Photograph receipts
                with your phone and convert them to a single PDF for expense
                submission or reimbursement claims.
              </li>
              <li>
                <strong>Certificates and ID proofs:</strong> Convert scanned or
                photographed certificates, passports, and ID cards to PDF for
                official submissions and job applications.
              </li>
              <li>
                <strong>Student assignments and projects:</strong> Combine scanned
                handwritten pages, diagrams, or lab sheets into one submission PDF.
              </li>
              <li>
                <strong>Photography portfolios:</strong> Convert a set of JPG photos
                into a professional multi-page PDF portfolio for clients.
              </li>
              <li>
                <strong>Product catalogs:</strong> Turn product images into a
                structured PDF catalog to share with buyers or distributors.
              </li>
              <li>
                <strong>Screenshots and documentation:</strong> Combine app
                screenshots, error logs, or UI designs into one organized PDF report.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded image files
              are processed securely and{" "}
              <strong>permanently deleted after conversion</strong> — never stored
              long-term, never shared with third parties, and never used for any other
              purpose. No account creation is required — no email, no password, no
              personal data collected. Your images remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert Images to PDF on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation. Whether
              you are on a desktop, laptop, or taking photos directly on your phone,
              you can convert images to PDF in seconds. Fully responsive with
              drag-and-drop upload and image preview supported on all devices.
            </p>
          </div>

        </div>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-purple-50 text-purple-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">PDF Linx</th>
                <th className="px-4 py-3">Desktop Software</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3">Free to use</td>
                <td className="px-4 py-3 text-green-600">✅ Always free</td>
                <td className="px-4 py-3 text-red-500">❌ Paid license</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">No installation needed</td>
                <td className="px-4 py-3 text-green-600">✅ Browser-based</td>
                <td className="px-4 py-3 text-red-500">❌ Download required</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">Works on mobile</td>
                <td className="px-4 py-3 text-green-600">✅ Android & iOS</td>
                <td className="px-4 py-3 text-red-500">❌ Desktop only</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">No watermark</td>
                <td className="px-4 py-3 text-green-600">✅ Clean output</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Sometimes</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">Up to 50 images</td>
                <td className="px-4 py-3 text-green-600">✅ Batch supported</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Varies</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">Files auto-deleted</td>
                <td className="px-4 py-3 text-green-600">✅ Privacy first</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Stored locally</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Combine scanned handwritten assignments, diagrams, and lab sheets into one submission PDF</li>
          <li><strong>Job seekers:</strong> Convert certificates, ID proofs, and supporting documents to PDF for job applications</li>
          <li><strong>Professionals:</strong> Create expense reports by converting receipt photos to a single organized PDF</li>
          <li><strong>Photographers:</strong> Share proof sheets and photo portfolios as professional multi-page PDFs</li>
          <li><strong>Business owners:</strong> Convert product images into PDF catalogs for buyers and distributors</li>
          <li><strong>Anyone:</strong> Turn phone photos into organized, printable PDF documents instantly</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions — Image to PDF
        </h3>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the Image to PDF converter free to use?",
                a: "Yes. PDFLinx Image to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "Will my image quality be preserved after conversion?",
                a: "Yes. Images are embedded into the PDF at full resolution — colors, sharpness, and detail stay exactly as they were in the original file.",
              },
              {
                q: "Which image formats are supported?",
                a: "JPG, JPEG, PNG, and WebP are all supported. These cover the most common photo and screenshot formats used on phones, cameras, and computers.",
              },
              {
                q: "Can I convert multiple images into one PDF?",
                a: "Yes. Upload up to 50 images at once — all images are combined into one PDF with each image on its own page.",
              },
              {
                q: "How is the page order determined in the PDF?",
                a: "Images appear in the PDF in the order they are uploaded. To change the order, remove images using the X button and re-upload them in the correct sequence.",
              },
              {
                q: "Are my uploaded images safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert images to PDF on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "Can I combine the image PDF with other PDF documents?",
                a: "Yes. After converting images to PDF, use the Merge PDF tool on PDF Linx to combine your image PDF with other documents into one file.",
              },
              {
                q: "What should I do if the converted PDF file is too large?",
                a: "Use the Compress PDF tool on PDF Linx to reduce the file size after conversion — useful when emailing or uploading to portals with strict size limits.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-purple-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="image-to-pdf" />

    </>
  );
}

























// // app/image-to-pdf/page.js

// "use client";
// import { useState } from "react";
// import { Upload, Image, Download, CheckCircle, X } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function ImageToPdf() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (files.length === 0) {
//       alert("Please select at least one image");
//       return;
//     }

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     files.forEach((file) => formData.append("images", file));

//     try {
//       const res = await fetch("/convert/image-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       // Read as text first (because 500 responses are often not JSON)
//       const text = await res.text();
//       console.log("RAW RESPONSE:", text);

//       // Try to parse JSON, otherwise treat it as plain error text
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = { success: false, error: text || "Internal Server Error" };
//       }

//       // If server returned error status OR success false
//       if (!res.ok || !data?.success) {
//         alert("Conversion failed: " + (data?.error || `HTTP ${res.status}`));
//         return;
//       }

//       // Success
//       setDownloadUrl(data.download);
//       setSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//     const invalidFiles = selectedFiles.filter(
//       (file) => !allowedTypes.includes(file.type)
//     );

//     if (invalidFiles.length > 0) {
//       alert(
//         `Only JPG, PNG, and WebP allowed.\nInvalid file: ${invalidFiles[0].name}`
//       );
//       e.target.value = ""; // reset file input
//       return;
//     }

//     const hasWebP = selectedFiles.some((file) => file.type === "image/webp");
//     if (hasWebP) {
//       alert(
//         "WebP image detected.\nBackend conversion support needed, warna 500 error aa sakta hai."
//       );
//     }

//     setFiles(selectedFiles);
//   };



//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = files.length === 1 ? files[0].name.replace(/\.[^/.]+$/, ".pdf") : "images-converted.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed. Please try again.");
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   return (
//     <>

//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

//       {/* HowTo Schema - Image to PDF */}
//       <Script
//         id="howto-schema-image-to-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Images to PDF Online for Free",
//             description: "Convert multiple JPG, PNG, WebP, or GIF images into a single PDF file in just 3 easy steps - 100% free, no signup required.",
//             url: "https://pdflinx.com/image-to-pdf",
//             step: [
//               {
//                 "@type": "HowToStep",
//                 name: "Select Images",
//                 text: "Click the upload area and select one or multiple images (JPG, PNG, GIF, WebP supported)."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Convert to PDF",
//                 text: "Click 'Convert to PDF' and wait a few seconds while we process your images."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Download PDF",
//                 text: "Your PDF file will be ready - click download to save it instantly."
//               }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - Image to PDF */}
//       <Script
//         id="breadcrumb-schema-image-to-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Image to PDF", item: "https://pdflinx.com/image-to-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />
//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//               Image to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a bunch of photos or screenshots? Turn them into one neat PDF in seconds – perfect quality, super easy, and totally free!
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Drop Zone */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}>
//                     <Image className="w-12 h-12 mx-auto mb-3 text-purple-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {files.length > 0 ? `${files.length} image(s) ready` : "Drop images here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP • Up to 50 images</p>
//                   </div>

//                   <input
//                     type="file"
//                     multiple
//                     accept="image/jpeg,image/png,image/webp"
//                     onChange={handleFileChange}
//                   />

//                   {/* <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={(e) => setFiles(Array.from(e.target.files || []))}
//                     className="hidden"
//                   /> */}


//                 </label>

//                 {/* Selected Images Preview */}
//                 {files.length > 0 && (
//                   <div className="mt-4 grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-3 bg-gray-50 rounded-xl">
//                     {files.map((file, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="w-full h-28 object-cover rounded-lg shadow"
//                         />
//                         <button
//                           onClick={() => removeFile(index)}
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                         <p className="text-xs text-center mt-1 truncate">{file.name}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || files.length === 0}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   "Turning images into PDF..."
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success Message */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-2">All done!</p>
//                 <p className="text-base text-gray-700 mb-3">Your images are now one beautiful PDF</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Your PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Trust Footer */}
//           <p className="text-center mt-6 text-gray-600 text-base">
//             No sign-up • No watermark • Files gone after 1 hour • 100% free & secure
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//             Image to PDF Online Free – Photos into One Clean PDF
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Turn your JPGs, PNGs, screenshots, or any pics into a single PDF – each on its own page, looking sharp. Great for portfolios, reports, or just keeping things organized. Fast and free on PDF Linx!
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Image Works</h3>
//             <p className="text-gray-600 text-sm">
//               JPG, PNG, GIF, WebP – single or up to 50 at once.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Professional</h3>
//             <p className="text-gray-600 text-sm">
//               Full quality, each image on its own page – clean and sharp.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion – no sign-up, files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Turn Images into PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Photos</h4>
//               <p className="text-gray-600 text-sm">Drop one or many – easy preview.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Remove if Needed</h4>
//               <p className="text-gray-600 text-sm">Click X on any you don’t want.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Get Your PDF</h4>
//               <p className="text-gray-600 text-sm">Download your combined PDF instantly!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           People turn photos into PDFs daily with PDF Linx – quick, clean, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           JPG to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Got a bunch of photos or screenshots in JPG format that you need to share as a single, professional document?
//           Maybe receipts, certificates, or product images?
//           Our <span className="font-medium text-slate-900">PDFLinx JPG to PDF Converter</span> makes it super easy.
//           It’s a 100% free online tool that combines one or multiple JPG images into a clean, high-quality PDF in seconds—no software, no watermarks, no complications.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is JPG to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           JPG to PDF conversion takes your image files (JPEG/JPG) and places them neatly into a portable PDF document.
//           Each image becomes a full page (or you can fit multiple per page), preserving original quality, colors, and sharpness.
//           The result is a professional, easy-to-share file that opens perfectly on any device.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert JPG Images to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Combine multiple photos into one organized PDF file</li>
//           <li>Preserves image quality, colors, and resolution</li>
//           <li>Easier to share, print, or archive than separate image files</li>
//           <li>Perfect for portfolios, reports, receipts, certificates, or scanned documents</li>
//           <li>More professional and universally compatible format</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert JPG to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload one or more JPG images (drag & drop or click to select)</li>
//           <li>Arrange the order if needed</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Download your ready PDF in seconds</li>
//         </ol>

//         <p className="mb-6">
//           No sign-up, no watermark, no installation required—completely free and instant.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx JPG to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports single or multiple JPG files</li>
//             <li>High-quality image preservation</li>
//             <li>Adjustable page layout options</li>
//             <li>Lightning-fast processing</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – full privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Students:</strong> Compile assignment scans or project images</li>
//           <li><strong>Business Owners:</strong> Create product catalogs or invoice attachments</li>
//           <li><strong>Photographers:</strong> Share proof sheets or portfolios professionally</li>
//           <li><strong>Professionals:</strong> Submit expense receipts or ID proofs in one file</li>
//           <li><strong>Anyone:</strong> Turn phone photos into organized, printable PDFs</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Yes — completely safe and private.
//           We respect your images and documents.
//           All uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
//           Nothing is stored or shared.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert JPG to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS.
//           Whether you’re on your phone or laptop, just upload your JPGs and get a polished PDF in moments—no app needed.
//         </p>
//       </section>


//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">

//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the JPG to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — totally free, no limits or hidden charges.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — everything works right in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will my image quality be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Absolutely. Your JPGs are embedded at full quality with no compression or loss.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert multiple JPGs at once?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Upload as many images as you need and they’ll be combined into one PDF.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my images safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — files are deleted automatically after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I use this on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>

//       <RelatedToolsSection currentPage="image-to-pdf" />

//     </>
//   );
// }

