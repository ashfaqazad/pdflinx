"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, Image as ImageIcon } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";


export default function PdfToJpg() {
  const [files, setFiles] = useState([]); // Multiple files support
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
    setSuccess(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one PDF file!");

    setLoading(true);
    setSuccess(false);
    setProgress(0);                    // ← NEW

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // ==================== PROGRESS SIMULATION ====================
    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const increment = prev < 40 ? 8 : prev < 70 ? 5 : 2;
        return prev + increment;
      });
    }, 300);
    // let progressInterval = setInterval(() => {
    //   setProgress((prev) => {
    //     const next = prev + Math.floor(Math.random() * 12) + 4;
    //     return next > 92 ? 92 : next;
    //   });
    // }, 280);
    // ============================================================

    try {
      const res = await fetch("/convert/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Conversion failed: " + errorText);
        setLoading(false);
        clearInterval(progressInterval);
        return;
      }

      // Processing done → 100% kar do
      clearInterval(progressInterval);
      setProgress(100);

      const blob = await res.blob();
      const contentType = res.headers.get("content-type");
      const disposition = res.headers.get("content-disposition");
      let filename = "converted_file";

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      } else if (files.length === 1) {
        filename = files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".jpg" : "_jpgs.zip");
      } else {
        filename = "pdf_to_jpg_batch.zip";
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      clearInterval(progressInterval);
      // 100% thoda der dikhane ke liye delay
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 800);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (files.length === 0) return alert("Please select at least one PDF file!");

  //   setLoading(true);
  //   setSuccess(false);

  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("files", file); // "files" name – backend mein upload.array("files")
  //   });

  //   try {
  //     // const res = await fetch("/convert/pdf-to-jpg", {
  //     const res = await fetch("/convert/pdf-to-jpg", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       alert("Conversion failed: " + errorText);
  //       setLoading(false);
  //       return;
  //     }

  //     // Backend direct ZIP ya single JPG stream karega
  //     const blob = await res.blob();
  //     const contentType = res.headers.get("content-type");
  //     const disposition = res.headers.get("content-disposition");
  //     let filename = "converted_file";

  //     if (disposition && disposition.includes("filename=")) {
  //       filename = disposition.split("filename=")[1].replace(/"/g, "");
  //     } else if (files.length === 1) {
  //       filename = files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".jpg" : "_jpgs.zip");
  //     } else {
  //       filename = "pdf_to_jpg_batch.zip";
  //     }

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);

  //     setSuccess(true);

  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to JPG Online for Free",
            description: "Convert one or multiple PDFs to high-quality JPG images instantly – single page gets JPG, multi-page gets ZIP.",
            url: "https://pdflinx.com/pdf-to-jpg",
            step: [
              { "@type": "HowToStep", name: "Upload PDFs", text: "Select one or multiple PDF files." },
              { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
              { "@type": "HowToStep", name: "Download", text: "Auto download starts – single JPG or ZIP with all images." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-pdf-jpg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to JPG", item: "https://pdflinx.com/pdf-to-jpg" },
            ],
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              PDF to JPG Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF pages to high-quality JPG images instantly — every page
              extracted at full resolution, colors and text stay sharp. Upload a
              single PDF or batch convert multiple PDFs at once. Perfect for social
              media, presentations, websites, and image editing. No signup, no
              watermark, completely free.
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length > 0
                        ? `${files.length} PDF file(s) selected`
                        : "Drop PDF files here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Multiple PDFs supported • Up to 100MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>


              {/* <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg py-4 rounded-xl hover:from-orange-700 hover:to-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>Converting... please wait</>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    Convert to JPG
                  </>
                )}
              </button> */}

              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg py-4 rounded-xl hover:from-orange-700 hover:to-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3 min-h-[60px]"
              >

                {/* {loading ? (
                  <div className="w-full flex flex-col items-center gap-2 px-4"> */}
                {/* Progress Bar */}
                {/* <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div> */}

                {/* Percentage Text */}
                {/* <div className="flex items-center justify-between w-full text-sm font-medium">
                      <span>Converting...</span>
                      <span className="tabular-nums">{progress}%</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    Convert to JPG
                  </>
                )} */}

                {loading ? (
                  <div className="w-full flex flex-col items-center gap-1.5 px-4">
                    <div className="flex items-center justify-between w-full text-sm font-medium">
                      <span>Converting...</span>
                      <span className="tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    Convert to JPG
                  </>
                )}

              </button>



            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-700 mb-3">
                  Success! Download started automatically
                </p>
                <p className="text-gray-700 mb-2">
                  {files.length === 1
                    ? "Single page → direct JPG | Multiple pages → ZIP file"
                    : "Multiple PDFs → separate ZIPs/JPGs in one batch download"}
                </p>
                <p className="text-sm text-gray-500">
                  Check your downloads folder. If not started, try again.
                </p>
              </div>
            )}
          </div>

          <p className="text-center mt-8 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single & batch conversion • Works on Windows, Mac, Android & iOS
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            PDF to JPG Online Free – Convert PDF Pages to Images in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need PDF pages as images? Convert here — every page extracted as a
            high-quality JPG at full resolution. Single-page PDF downloads as
            one JPG directly. Multi-page PDF downloads as a ZIP with all images
            inside. Fast, free, and privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">High-Quality JPG Output</h3>
            <p className="text-gray-600 text-sm">
              Every PDF page extracted at full resolution — text stays sharp,
              colors stay vibrant, no quality loss in the JPG output.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Download</h3>
            <p className="text-gray-600 text-sm">
              Single-page PDF downloads as one JPG directly. Multi-page PDF
              downloads as a ZIP containing all extracted JPG images.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Upload one PDF or multiple PDFs at once — each converted
              separately with no signup, no watermark required.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert PDF to JPG — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PDF or upload multiple PDFs at once for batch
                conversion. Drag and drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to JPG</h4>
              <p className="text-gray-600 text-sm">
                Hit Convert and wait a few seconds — every page is extracted
                as a high-quality JPG image automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download JPG or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single-page PDF downloads as JPG directly. Multi-page PDF
                downloads as ZIP with all extracted images inside.
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
            After converting PDF to JPG, these tools can help you work with your documents.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/image-to-pdf" className="text-orange-700 font-semibold hover:underline">
                Image to PDF
              </a>{" "}
              <span className="text-slate-600">— convert your JPG images back into a PDF document.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-orange-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce PDF file size before extracting pages as images.</span>
            </li>
            <li>
              <a href="/pdf-to-word" className="text-orange-700 font-semibold hover:underline">
                PDF to Word
              </a>{" "}
              <span className="text-slate-600">— convert PDF to editable Word document instead of images.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-orange-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by designers, students, and professionals to convert PDF pages
          to JPG images — fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to JPG Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Need PDF pages as images for social media, a website, a presentation,
          or a photo editor? The{" "}
          <span className="font-medium text-slate-900">PDFLinx PDF to JPG Converter</span>{" "}
          extracts every page from your PDF as a high-quality JPEG image in
          seconds — colors sharp, text clear, layout preserved. No software
          installation, no watermarks, no sign-up required. Works on any device,
          in any browser.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF to JPG Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to JPG conversion extracts each page of a PDF document and saves
          it as a separate high-quality JPEG image file. Every page becomes a
          standalone JPG — preserving the original colors, text sharpness, and
          layout. Single-page PDFs download as one JPG directly. Multi-page PDFs
          download as a ZIP file containing all extracted images, one per page.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PDF to JPG?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Share individual PDF pages as images on social media or websites</li>
          <li>Use PDF pages in PowerPoint, Canva, or photo editing apps</li>
          <li>Extract visuals, charts, or figures from PDF reports and ebooks</li>
          <li>Create thumbnails or preview images of PDF documents</li>
          <li>Insert PDF pages into Word documents or email newsletters as images</li>
          <li>Convert scanned PDF pages to JPG for image editing or archiving</li>
          <li>Share PDF content on platforms that do not support PDF uploads</li>
          <li>Create image-based portfolios or lookbooks from PDF designs</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              JPG vs PNG — Which Format Is Better for PDF Pages?
            </h3>
            <p className="leading-7">
              <strong>JPG (JPEG)</strong> is the most widely compatible image
              format — smaller file size, universally supported by all apps,
              websites, and social media platforms. Ideal for sharing PDF pages
              as photos, on social media, or embedding in websites.{" "}
              <strong>PNG</strong> supports transparency and lossless quality —
              better for PDF pages with sharp graphics, logos, or text-heavy
              layouts where every pixel matters. PDF Linx converts to JPG at
              high resolution — suitable for most sharing and presentation needs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How PDF to JPG Download Works
            </h3>
            <p className="leading-7">
              PDF Linx automatically detects the number of pages in your PDF and
              delivers the output accordingly. A{" "}
              <strong>single-page PDF</strong> downloads as one JPG file directly
              — no ZIP needed. A <strong>multi-page PDF</strong> downloads as a
              ZIP file containing one JPG per page, named sequentially. If you
              upload multiple PDFs in one batch, each PDF is processed separately
              and delivered as individual JPG or ZIP downloads.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF to JPG Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Social media content:</strong> Extract pages from PDF
                reports, brochures, or presentations and share them as images on
                Instagram, LinkedIn, or Twitter.
              </li>
              <li>
                <strong>Presentations and slides:</strong> Insert PDF pages as
                JPG images into PowerPoint, Google Slides, or Canva without
                compatibility issues.
              </li>
              <li>
                <strong>Website and blog use:</strong> Convert PDF infographics,
                charts, or diagrams to JPG for embedding in web pages and
                articles.
              </li>
              <li>
                <strong>Portfolio and design work:</strong> Extract individual
                pages from PDF design portfolios or lookbooks as high-resolution
                JPG images.
              </li>
              <li>
                <strong>Document previews and thumbnails:</strong> Convert the
                first page of a PDF to JPG to use as a preview thumbnail in a
                document library or website.
              </li>
              <li>
                <strong>Scanned document archiving:</strong> Convert scanned PDF
                pages to JPG images for photo library organization or image-based
                archiving systems.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PDF to JPG Conversion
            </h3>
            <p className="leading-7">
              Upload multiple PDF files simultaneously for batch conversion. Each
              PDF is processed separately — single-page PDFs download as
              individual JPGs, multi-page PDFs download as ZIP files. Ideal for
              converting multiple report pages, design files, or scanned
              documents in one go. After converting, if you need to turn the JPG
              images back into a PDF, use the{" "}
              <a href="/image-to-pdf" className="text-orange-700 font-medium hover:underline">
                Image to PDF tool
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded PDF
              files are processed securely and{" "}
              <strong>permanently deleted after conversion</strong> — never stored
              long-term, never shared with third parties, and never used for any
              other purpose. No account creation is required — no email, no
              password, no personal data collected. Your documents remain
              completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert PDF to JPG on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation.
              Whether you are at your desk, on a laptop, or on your phone, you
              can convert PDF pages to JPG images in seconds. Fully responsive
              with drag-and-drop file upload supported on all devices.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF to JPG Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF to JPG converter — no hidden fees</li>
            <li>High-resolution JPG output — full quality preserved</li>
            <li>Single-page PDF → direct JPG download</li>
            <li>Multi-page PDF → ZIP with all JPG images</li>
            <li>Batch conversion — multiple PDFs at once</li>
            <li>Fast processing — conversion in seconds</li>
            <li>No watermark added to converted images</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after conversion — privacy protected</li>
            <li>No signup or account required</li>
            <li>Cross-platform: Windows, macOS, Android, iOS</li>
            <li>Drag-and-drop upload supported</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Designers and marketers:</strong> Extract PDF pages as JPG images for social media, websites, and marketing materials</li>
          <li><strong>Students:</strong> Pull pages from PDF textbooks or notes as images for presentations or study materials</li>
          <li><strong>Content creators:</strong> Convert PDF infographics and charts to JPG for blog posts and newsletters</li>
          <li><strong>Professionals:</strong> Extract specific report pages or diagrams as images for email or presentation use</li>
          <li><strong>Photographers and artists:</strong> Convert PDF portfolio pages to high-resolution JPG images</li>
          <li><strong>Anyone:</strong> Turn any PDF page into a shareable, editable JPG image instantly</li>
        </ul>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the PDF to JPG converter free to use?",
                a: "Yes. PDFLinx PDF to JPG converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "What is the quality of the converted JPG images?",
                a: "JPG images are exported at high resolution — text stays sharp, colors stay vibrant, and layout is preserved accurately from the original PDF pages.",
              },
              {
                q: "How does the download work for single vs multi-page PDFs?",
                a: "Single-page PDFs download as one JPG file directly. Multi-page PDFs download as a ZIP file containing one JPG image per page, named sequentially.",
              },
              {
                q: "Can I convert multiple PDF files to JPG at once?",
                a: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual JPG or ZIP downloads.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert PDF to JPG on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "What is the difference between JPG and PNG for PDF conversion?",
                a: "JPG is smaller in file size and universally compatible — best for sharing on social media and websites. PNG is lossless and better for text-heavy or graphic-rich pages where sharpness is critical.",
              },
              {
                q: "Can I convert the JPG images back to PDF after downloading?",
                a: "Yes. Use the Image to PDF tool on PDF Linx to convert your extracted JPG images back into a PDF document.",
              },
              {
                q: "What should I do if I only need one page from a multi-page PDF?",
                a: "Use the Split PDF tool first to extract the specific page you need, then convert that single-page PDF to JPG for a direct download without a ZIP.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-orange-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <RelatedToolsSection currentPage="pdf-to-jpg" />

    </>
  );
}

