"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Image as ImageIcon, FileImage, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";


export default function PdfToJpg() {
  const [files, setFiles] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("converted_file");

  const fileInputRef = useRef(null);
  const isSingle = files.length === 1;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
    setSuccess(false);
    setDownloadUrl("");
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one PDF file!");

    setIsLoading(true);
    setSuccess(false);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const increment = prev < 40 ? 8 : prev < 70 ? 5 : 2;
        return prev + increment;
      });
    }, 300);

    try {
      const res = await fetch("/convert/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Conversion failed: " + errorText);
        setIsLoading(false);
        clearInterval(progressInterval);
        return;
      }

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
      setDownloadUrl(url);
      setDownloadFilename(filename);

      // Auto download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 800);
    }
  };

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
            description: "Convert PDF pages to high-quality JPG images online free — no signup, no watermark. Single-page PDF downloads as JPG, multi-page as ZIP. Works on Windows, Mac, Android, iOS.",
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
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Convert PDF to JPG Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF to JPG online free — no signup, no watermark, no software needed.
              Turn each PDF page into high-quality JPG images in seconds. Works on Windows,
              Mac, Android and iOS. Upload one PDF or batch convert multiple PDF files at once.
            </p>
          </div>

          {/* ── STEP STRIP ── */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Single or multiple files" },
              { n: "2", label: "Convert Pages", sub: "JPG images generated auto" },
              { n: "3", label: "Download JPG", sub: "Or ZIP for batch/pages" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
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
                    <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-orange-200 border-b-transparent animate-spin"
                      style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      Converting your file{files.length > 1 ? "s" : ""}…
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {progress < 30
                        ? "Uploading…"
                        : progress < 70
                          ? "Rendering pages…"
                          : "Almost done…"}
                    </p>
                  </div>

                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
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
                      : "border-gray-200 hover:border-amber-400 hover:bg-amber-50/40"
                      }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${files.length ? "bg-green-100" : "bg-amber-50 group-hover:bg-amber-100"
                        }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <FileImage className="w-7 h-7 text-amber-600" />
                      )}
                    </div>

                    {files.length ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Click to change selection</p>

                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                          {files.slice(0, 5).map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
                            >
                              <FileText className="w-3 h-3" />
                              {f.name.length > 24 ? f.name.slice(0, 22) + "…" : f.name}
                            </span>
                          ))}

                          {files.length > 5 && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                              +{files.length - 5} more
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your PDF file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          or click to browse · PDF files only
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {["✓ No signup", "✓ No watermark", "✓ Batch convert", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* ── Info row + Convert Button ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <FileImage className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Page to image conversion</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Single PDF → JPG images · Multiple PDFs → ZIP download
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${files.length && !isLoading
                      ? "bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 hover:shadow-md active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <FileImage className="w-4 h-4" />
                    Convert to JPG
                  </button>
                </div>

                {/* hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>💡 Each PDF page will be converted into a JPG image · Download may be provided as ZIP</p>
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
                    Done! Your file{files.length > 1 ? "s" : ""} downloaded automatically 🎉
                  </h3>

                  <p className="text-sm text-gray-600 mb-6">
                    Check your downloads — ZIP contains all converted JPG files.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setFiles([]);
                      }}
                      className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Convert another PDF
                    </button>

                    <a
                      href="/jpg-to-pdf"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      JPG to PDF →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>{/* end main card */}

          {/* footer trust bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single &amp; batch conversion • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Free PDF to JPG Converter — Extract Every PDF Page as a High-Quality Image
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

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-orange-50 text-orange-800 font-semibold">
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
                <td className="px-4 py-3">Batch conversion</td>
                <td className="px-4 py-3 text-green-600">✅ Multiple PDFs</td>
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
























// "use client";
// import { useState } from "react";
// import { Upload, Download, CheckCircle, Image as ImageIcon } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function PdfToJpg() {
//   const [files, setFiles] = useState([]); // Multiple files support
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) return;
//     setFiles(selectedFiles);
//     setSuccess(false);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return alert("Please select at least one PDF file!");

//     setLoading(true);
//     setSuccess(false);
//     setProgress(0);                    // ← NEW

//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     // ==================== PROGRESS SIMULATION ====================
//     let progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 88) return prev;
//         const increment = prev < 40 ? 8 : prev < 70 ? 5 : 2;
//         return prev + increment;
//       });
//     }, 300);
//     // let progressInterval = setInterval(() => {
//     //   setProgress((prev) => {
//     //     const next = prev + Math.floor(Math.random() * 12) + 4;
//     //     return next > 92 ? 92 : next;
//     //   });
//     // }, 280);
//     // ============================================================

//     try {
//       const res = await fetch("/convert/pdf-to-jpg", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         alert("Conversion failed: " + errorText);
//         setLoading(false);
//         clearInterval(progressInterval);
//         return;
//       }

//       // Processing done → 100% kar do
//       clearInterval(progressInterval);
//       setProgress(100);

//       const blob = await res.blob();
//       const contentType = res.headers.get("content-type");
//       const disposition = res.headers.get("content-disposition");
//       let filename = "converted_file";

//       if (disposition && disposition.includes("filename=")) {
//         filename = disposition.split("filename=")[1].replace(/"/g, "");
//       } else if (files.length === 1) {
//         filename = files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".jpg" : "_jpgs.zip");
//       } else {
//         filename = "pdf_to_jpg_batch.zip";
//       }

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       setSuccess(true);

//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       clearInterval(progressInterval);
//       // 100% thoda der dikhane ke liye delay
//       setTimeout(() => {
//         setLoading(false);
//         setProgress(0);
//       }, 800);
//     }
//   };


//   return (
//     <>
//       {/* ==================== SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert PDF to JPG Online for Free",
//             description: "Convert PDF pages to high-quality JPG images online free — no signup, no watermark. Single-page PDF downloads as JPG, multi-page as ZIP. Works on Windows, Mac, Android, iOS.",
//             url: "https://pdflinx.com/pdf-to-jpg",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDFs", text: "Select one or multiple PDF files." },
//               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
//               { "@type": "HowToStep", name: "Download", text: "Auto download starts – single JPG or ZIP with all images." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-pdf-jpg"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF to JPG", item: "https://pdflinx.com/pdf-to-jpg" },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
//               Convert PDF to JPG Online Free
//               <br />
//               <span className="text-2xl md:text-3xl font-medium">
//                 No Signup · No Watermark · Instant Download
//               </span>
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Convert PDF to JPG online free — no signup, no watermark, no software needed.
//               Turn each PDF page into high-quality JPG images in seconds. Works on Windows,
//               Mac, Android and iOS. Upload one PDF or batch convert multiple PDF files at once.
//             </p>
//           </div>

//           {/* ── STEP STRIP ── */}
//           <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
//             {[
//               { n: "1", label: "Upload PDF", sub: "Single or multiple files" },
//               { n: "2", label: "Convert Pages", sub: "JPG images generated auto" },
//               { n: "3", label: "Download JPG", sub: "Or ZIP for batch/pages" },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
//               >
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
//                   {s.n}
//                 </div>
//                 <p className="text-xs font-semibold text-gray-700">{s.label}</p>
//                 <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
//               </div>
//             ))}
//           </div>

//           {/* ── MAIN CARD ── */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

//             {/* conversion overlay wrapper */}
//             <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

//               {/* blur overlay */}
//               {isLoading && (
//                 <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
//                   <div className="relative w-16 h-16">
//                     <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
//                     <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
//                     <div
//                       className="absolute inset-2 rounded-full border-4 border-orange-200 border-b-transparent animate-spin"
//                       style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
//                     ></div>
//                   </div>

//                   <div className="text-center">
//                     <p className="text-base font-semibold text-gray-700">
//                       Converting your file{files.length > 1 ? "s" : ""}…
//                     </p>
//                     <p className="text-sm text-gray-400 mt-1">
//                       {progress < 30
//                         ? "Uploading…"
//                         : progress < 70
//                           ? "Rendering pages…"
//                           : "Almost done…"}
//                     </p>
//                   </div>

//                   <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-400 font-medium">{progress}%</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="p-8 space-y-5">

//                 {/* ── DROPZONE ── */}
//                 <label className="block cursor-pointer group">
//                   <div
//                     className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${files.length
//                         ? "border-green-400 bg-green-50"
//                         : "border-gray-200 hover:border-amber-400 hover:bg-amber-50/40"
//                       }`}
//                   >
//                     <div
//                       className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${files.length ? "bg-green-100" : "bg-amber-50 group-hover:bg-amber-100"
//                         }`}
//                     >
//                       {files.length ? (
//                         <CheckCircle className="w-7 h-7 text-green-500" />
//                       ) : (
//                         <FileImage className="w-7 h-7 text-amber-600" />
//                       )}
//                     </div>

//                     {files.length ? (
//                       <>
//                         <p className="text-base font-semibold text-green-700">
//                           {files.length} file{files.length > 1 ? "s" : ""} selected
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">Click to change selection</p>

//                         <div className="flex flex-wrap justify-center gap-2 mt-3">
//                           {files.slice(0, 5).map((f, i) => (
//                             <span
//                               key={i}
//                               className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
//                             >
//                               <FileText className="w-3 h-3" />
//                               {f.name.length > 24 ? f.name.slice(0, 22) + "…" : f.name}
//                             </span>
//                           ))}

//                           {files.length > 5 && (
//                             <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
//                               +{files.length - 5} more
//                             </span>
//                           )}
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <p className="text-base font-semibold text-gray-700">
//                           Drop your PDF file(s) here
//                         </p>
//                         <p className="text-sm text-gray-400 mt-1">
//                           or click to browse · PDF files only
//                         </p>

//                         <div className="flex flex-wrap justify-center gap-2 mt-4">
//                           {["✓ No signup", "✓ No watermark", "✓ Batch convert", "✓ Auto-deleted"].map((t) => (
//                             <span
//                               key={t}
//                               className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium px-2.5 py-1 rounded-full"
//                             >
//                               {t}
//                             </span>
//                           ))}
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     multiple
//                     accept="application/pdf,.pdf"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>

//                 {/* ── Info row + Convert Button ── */}
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
//                   <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
//                     <FileImage className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-700 leading-none">Page to image conversion</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         Single PDF → JPG images · Multiple PDFs → ZIP download
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={!files.length || isLoading}
//                     className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${files.length && !isLoading
//                         ? "bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 hover:shadow-md active:scale-[0.98]"
//                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                       }`}
//                   >
//                     <FileImage className="w-4 h-4" />
//                     Convert to JPG
//                   </button>
//                 </div>

//                 {/* hints */}
//                 <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
//                   <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
//                   <p>💡 Each PDF page will be converted into a JPG image · Download may be provided as ZIP</p>
//                 </div>

//               </form>

//             </div>{/* end blur wrapper */}

//             {/* ── SUCCESS STATE ── */}
//             {success && (
//               <div
//                 id="download-section"
//                 className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
//               >
//                 <div className="flex flex-col items-center text-center px-8 py-10">
//                   <div className="relative w-16 h-16 mb-5">
//                     <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
//                     <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
//                       <CheckCircle className="w-8 h-8 text-white" />
//                     </div>
//                   </div>

//                   <h3 className="text-xl font-bold text-emerald-800 mb-1">
//                     Conversion Complete! 🎉
//                   </h3>

//                   <p className="text-sm text-emerald-700 font-medium mb-1">
//                     {isSingle
//                       ? "Your PDF pages are now converted into JPG images"
//                       : `All ${files.length} PDF files converted to JPG successfully`}
//                   </p>

//                   <p className="text-xs text-gray-500 mb-6">
//                     {isSingle
//                       ? "Click below to download your JPG images"
//                       : "ZIP contains all converted JPG files"}
//                   </p>

//                   {/* Download button */}
//                   <button
//                     onClick={handleDownload}
//                     className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition shadow-md mb-4"
//                   >
//                     <Download className="w-4 h-4" />
//                     {isSingle ? "Download JPG" : "Download ZIP"}
//                   </button>

//                   {/* secondary actions */}
//                   <div className="flex flex-wrap gap-3 justify-center">
//                     <button
//                       onClick={() => {
//                         setSuccess(false);
//                         setFiles([]);
//                         setDownloadUrl("");
//                       }}
//                       className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
//                     >
//                       <FileText className="w-4 h-4" />
//                       Convert another PDF
//                     </button>

//                     <a
//                       href="/jpg-to-pdf"
//                       className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
//                     >
//                       JPG to PDF →
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>{/* end main card */}

//           {/* footer trust bar */}
//           <p className="text-center mt-6 text-gray-500 text-sm">
//             No account • No watermark • Auto-deleted after 1 hour • 100% free •
//             Single &amp; batch conversion • Works on Windows, Mac, Android &amp; iOS
//           </p>

//         </div>
//       </main>      {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
//             Free PDF to JPG Converter — Extract Every PDF Page as a High-Quality Image
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Need PDF pages as images? Convert here — every page extracted as a
//             high-quality JPG at full resolution. Single-page PDF downloads as
//             one JPG directly. Multi-page PDF downloads as a ZIP with all images
//             inside. Fast, free, and privacy-friendly on PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <ImageIcon className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">High-Quality JPG Output</h3>
//             <p className="text-gray-600 text-sm">
//               Every PDF page extracted at full resolution — text stays sharp,
//               colors stay vibrant, no quality loss in the JPG output.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Download</h3>
//             <p className="text-gray-600 text-sm">
//               Single-page PDF downloads as one JPG directly. Multi-page PDF
//               downloads as a ZIP containing all extracted JPG images.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
//             <p className="text-gray-600 text-sm">
//               Upload one PDF or multiple PDFs at once — each converted
//               separately with no signup, no watermark required.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             How to Convert PDF to JPG — 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
//               <p className="text-gray-600 text-sm">
//                 Select one PDF or upload multiple PDFs at once for batch
//                 conversion. Drag and drop supported on all devices.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Click Convert to JPG</h4>
//               <p className="text-gray-600 text-sm">
//                 Hit Convert and wait a few seconds — every page is extracted
//                 as a high-quality JPG image automatically.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download JPG or ZIP</h4>
//               <p className="text-gray-600 text-sm">
//                 Single-page PDF downloads as JPG directly. Multi-page PDF
//                 downloads as ZIP with all extracted images inside.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Contextual Links */}
//         <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
//           <h3 className="text-lg md:text-xl font-bold text-slate-900">
//             Need to do more with your PDF?
//           </h3>
//           <p className="mt-1 text-sm text-slate-600">
//             After converting PDF to JPG, these tools can help you work with your documents.
//           </p>
//           <ul className="mt-4 space-y-2 text-sm">
//             <li>
//               <a href="/image-to-pdf" className="text-orange-700 font-semibold hover:underline">
//                 Image to PDF
//               </a>{" "}
//               <span className="text-slate-600">— convert your JPG images back into a PDF document.</span>
//             </li>
//             <li>
//               <a href="/compress-pdf" className="text-orange-700 font-semibold hover:underline">
//                 Compress PDF
//               </a>{" "}
//               <span className="text-slate-600">— reduce PDF file size before extracting pages as images.</span>
//             </li>
//             <li>
//               <a href="/pdf-to-word" className="text-orange-700 font-semibold hover:underline">
//                 PDF to Word
//               </a>{" "}
//               <span className="text-slate-600">— convert PDF to editable Word document instead of images.</span>
//             </li>
//             <li>
//               <a href="/free-pdf-tools" className="text-orange-700 font-semibold hover:underline">
//                 Browse all PDF tools
//               </a>{" "}
//               <span className="text-slate-600">— merge, split, compress, convert & more.</span>
//             </li>
//           </ul>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Trusted by designers, students, and professionals to convert PDF pages
//           to JPG images — fast, reliable, and always free.
//         </p>
//       </section>

//       {/* ── DEEP SEO CONTENT ── */}
//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PDF to JPG Converter – Free Online Tool by PDFLinx
//         </h2>

//         <p className="text-base leading-7 mb-6">
//           Need PDF pages as images for social media, a website, a presentation,
//           or a photo editor? The{" "}
//           <span className="font-medium text-slate-900">PDFLinx PDF to JPG Converter</span>{" "}
//           extracts every page from your PDF as a high-quality JPEG image in
//           seconds — colors sharp, text clear, layout preserved. No software
//           installation, no watermarks, no sign-up required. Works on any device,
//           in any browser.
//         </p>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What Is PDF to JPG Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           PDF to JPG conversion extracts each page of a PDF document and saves
//           it as a separate high-quality JPEG image file. Every page becomes a
//           standalone JPG — preserving the original colors, text sharpness, and
//           layout. Single-page PDFs download as one JPG directly. Multi-page PDFs
//           download as a ZIP file containing all extracted images, one per page.
//         </p>

//         <div className="mt-10 space-y-10">

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               JPG vs PNG — Which Format Is Better for PDF Pages?
//             </h3>
//             <p className="leading-7">
//               <strong>JPG (JPEG)</strong> is the most widely compatible image
//               format — smaller file size, universally supported by all apps,
//               websites, and social media platforms. Ideal for sharing PDF pages
//               as photos, on social media, or embedding in websites.{" "}
//               <strong>PNG</strong> supports transparency and lossless quality —
//               better for PDF pages with sharp graphics, logos, or text-heavy
//               layouts where every pixel matters. PDF Linx converts to JPG at
//               high resolution — suitable for most sharing and presentation needs.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               How PDF to JPG Download Works
//             </h3>
//             <p className="leading-7">
//               PDF Linx automatically detects the number of pages in your PDF and
//               delivers the output accordingly. A{" "}
//               <strong>single-page PDF</strong> downloads as one JPG file directly
//               — no ZIP needed. A <strong>multi-page PDF</strong> downloads as a
//               ZIP file containing one JPG per page, named sequentially. If you
//               upload multiple PDFs in one batch, each PDF is processed separately
//               and delivered as individual JPG or ZIP downloads.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               Common Use Cases for PDF to JPG Conversion
//             </h3>
//             <ul className="space-y-2 list-disc pl-6 leading-7">
//               <li>
//                 <strong>Social media content:</strong> Extract pages from PDF
//                 reports, brochures, or presentations and share them as images on
//                 Instagram, LinkedIn, or Twitter.
//               </li>
//               <li>
//                 <strong>Presentations and slides:</strong> Insert PDF pages as
//                 JPG images into PowerPoint, Google Slides, or Canva without
//                 compatibility issues.
//               </li>
//               <li>
//                 <strong>Website and blog use:</strong> Convert PDF infographics,
//                 charts, or diagrams to JPG for embedding in web pages and
//                 articles.
//               </li>
//               <li>
//                 <strong>Portfolio and design work:</strong> Extract individual
//                 pages from PDF design portfolios or lookbooks as high-resolution
//                 JPG images.
//               </li>
//               <li>
//                 <strong>Document previews and thumbnails:</strong> Convert the
//                 first page of a PDF to JPG to use as a preview thumbnail in a
//                 document library or website.
//               </li>
//               <li>
//                 <strong>Scanned document archiving:</strong> Convert scanned PDF
//                 pages to JPG images for photo library organization or image-based
//                 archiving systems.
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               Batch PDF to JPG Conversion
//             </h3>
//             <p className="leading-7">
//               Upload multiple PDF files simultaneously for batch conversion. Each
//               PDF is processed separately — single-page PDFs download as
//               individual JPGs, multi-page PDFs download as ZIP files. Ideal for
//               converting multiple report pages, design files, or scanned
//               documents in one go. After converting, if you need to turn the JPG
//               images back into a PDF, use the{" "}
//               <a href="/image-to-pdf" className="text-orange-700 font-medium hover:underline">
//                 Image to PDF tool
//               </a>.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               Privacy and File Security
//             </h3>
//             <p className="leading-7">
//               PDF Linx is built with privacy as a core priority. Uploaded PDF
//               files are processed securely and{" "}
//               <strong>permanently deleted after conversion</strong> — never stored
//               long-term, never shared with third parties, and never used for any
//               other purpose. No account creation is required — no email, no
//               password, no personal data collected. Your documents remain
//               completely private.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-3">
//               Convert PDF to JPG on Any Device
//             </h3>
//             <p className="leading-7">
//               PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
//               in any modern browser. No app download, no software installation.
//               Whether you are at your desk, on a laptop, or on your phone, you
//               can convert PDF pages to JPG images in seconds. Fully responsive
//               with drag-and-drop file upload supported on all devices.
//             </p>
//           </div>

//         </div>

//         <div className="overflow-x-auto my-6">
//           <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
//             <thead className="bg-orange-50 text-orange-800 font-semibold">
//               <tr>
//                 <th className="px-4 py-3">Feature</th>
//                 <th className="px-4 py-3">PDF Linx</th>
//                 <th className="px-4 py-3">Desktop Software</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               <tr className="bg-white">
//                 <td className="px-4 py-3">Free to use</td>
//                 <td className="px-4 py-3 text-green-600">✅ Always free</td>
//                 <td className="px-4 py-3 text-red-500">❌ Paid license</td>
//               </tr>
//               <tr className="bg-gray-50">
//                 <td className="px-4 py-3">No installation needed</td>
//                 <td className="px-4 py-3 text-green-600">✅ Browser-based</td>
//                 <td className="px-4 py-3 text-red-500">❌ Download required</td>
//               </tr>
//               <tr className="bg-white">
//                 <td className="px-4 py-3">Works on mobile</td>
//                 <td className="px-4 py-3 text-green-600">✅ Android & iOS</td>
//                 <td className="px-4 py-3 text-red-500">❌ Desktop only</td>
//               </tr>
//               <tr className="bg-gray-50">
//                 <td className="px-4 py-3">No watermark</td>
//                 <td className="px-4 py-3 text-green-600">✅ Clean output</td>
//                 <td className="px-4 py-3 text-yellow-500">⚠️ Sometimes</td>
//               </tr>
//               <tr className="bg-white">
//                 <td className="px-4 py-3">Batch conversion</td>
//                 <td className="px-4 py-3 text-green-600">✅ Multiple PDFs</td>
//                 <td className="px-4 py-3 text-yellow-500">⚠️ Varies</td>
//               </tr>
//               <tr className="bg-gray-50">
//                 <td className="px-4 py-3">Files auto-deleted</td>
//                 <td className="px-4 py-3 text-green-600">✅ Privacy first</td>
//                 <td className="px-4 py-3 text-yellow-500">⚠️ Stored locally</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Designers and marketers:</strong> Extract PDF pages as JPG images for social media, websites, and marketing materials</li>
//           <li><strong>Students:</strong> Pull pages from PDF textbooks or notes as images for presentations or study materials</li>
//           <li><strong>Content creators:</strong> Convert PDF infographics and charts to JPG for blog posts and newsletters</li>
//           <li><strong>Professionals:</strong> Extract specific report pages or diagrams as images for email or presentation use</li>
//           <li><strong>Photographers and artists:</strong> Convert PDF portfolio pages to high-resolution JPG images</li>
//           <li><strong>Anyone:</strong> Turn any PDF page into a shareable, editable JPG image instantly</li>
//         </ul>
//       </section>

//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-4">
//             {[
//               {
//                 q: "Is the PDF to JPG converter free to use?",
//                 a: "Yes. PDFLinx PDF to JPG converter is completely free — no hidden charges, no subscription, no premium tier required.",
//               },
//               {
//                 q: "Do I need to install any software?",
//                 a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
//               },
//               {
//                 q: "What is the quality of the converted JPG images?",
//                 a: "JPG images are exported at high resolution — text stays sharp, colors stay vibrant, and layout is preserved accurately from the original PDF pages.",
//               },
//               {
//                 q: "How does the download work for single vs multi-page PDFs?",
//                 a: "Single-page PDFs download as one JPG file directly. Multi-page PDFs download as a ZIP file containing one JPG image per page, named sequentially.",
//               },
//               {
//                 q: "Can I convert multiple PDF files to JPG at once?",
//                 a: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual JPG or ZIP downloads.",
//               },
//               {
//                 q: "Are my uploaded PDF files safe and private?",
//                 a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
//               },
//               {
//                 q: "Can I convert PDF to JPG on my phone?",
//                 a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
//               },
//               {
//                 q: "What is the difference between JPG and PNG for PDF conversion?",
//                 a: "JPG is smaller in file size and universally compatible — best for sharing on social media and websites. PNG is lossless and better for text-heavy or graphic-rich pages where sharpness is critical.",
//               },
//               {
//                 q: "Can I convert the JPG images back to PDF after downloading?",
//                 a: "Yes. Use the Image to PDF tool on PDF Linx to convert your extracted JPG images back into a PDF document.",
//               },
//               {
//                 q: "What should I do if I only need one page from a multi-page PDF?",
//                 a: "Use the Split PDF tool first to extract the specific page you need, then convert that single-page PDF to JPG for a direct download without a ZIP.",
//               },
//             ].map((faq, i) => (
//               <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                 <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
//                   {faq.q}
//                   <span className="text-orange-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
//                 </summary>
//                 <p className="mt-2 text-gray-600">{faq.a}</p>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>
//       <RelatedToolsSection currentPage="pdf-to-jpg" />

//     </>
//   );
// }

