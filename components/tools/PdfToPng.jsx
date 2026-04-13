"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Image as ImageIcon, FileImage, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";

export default function PdfToPng() {
  const [files, setFiles] = useState([]);
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
      const res = await fetch("/convert/pdf-to-png", {
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
        filename = files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".png" : "_pngs.zip");
      } else {
        filename = "pdf_to_png_batch.zip";
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
        id="howto-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to PNG Online for Free",
            description: "Convert PDF pages to high-quality PNG images online free — no signup, no watermark. Lossless quality, transparent background support. Single-page PDF downloads as PNG, multi-page as ZIP. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/pdf-to-png",
            step: [
              { "@type": "HowToStep", name: "Upload PDFs", text: "Select one or multiple PDF files from your device." },
              { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds — every page is extracted as a lossless PNG image." },
              { "@type": "HowToStep", name: "Download", text: "Auto download starts — single PNG or ZIP with all images." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to PNG", item: "https://pdflinx.com/pdf-to-png" },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the PDF to PNG converter free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. PDFLinx PDF to PNG converter is completely free — no hidden charges, no subscription, no account required.",
                },
              },
              {
                "@type": "Question",
                name: "What is the quality of converted PNG images?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "PNG images are exported at full lossless quality — text stays sharp, colors are accurate, and transparent backgrounds are supported.",
                },
              },
              {
                "@type": "Question",
                name: "Can I convert multiple PDF files to PNG at once?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual PNG or ZIP downloads.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between PDF to PNG and PDF to JPG?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "PNG is lossless — better for text, graphics, logos, and transparent backgrounds. JPG is smaller in file size — better for photos and social media sharing.",
                },
              },
              {
                "@type": "Question",
                name: "Are my uploaded PDF files safe?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties.",
                },
              },
            ],
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Convert PDF to PNG Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Lossless Quality
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF to PNG online free — no signup, no watermark, no software needed.
              Turn each PDF page into a high-quality lossless PNG image in seconds. Transparent
              background supported. Works on Windows, Mac, Android and iOS. Upload one PDF or
              batch convert multiple PDF files at once.
            </p>
          </div>

          {/* Step Strip */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Single or multiple files" },
              { n: "2", label: "Convert Pages", sub: "Lossless PNG generated" },
              { n: "3", label: "Download PNG", sub: "Or ZIP for batch/pages" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                  {s.n}
                </div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-sky-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-indigo-200 border-b-transparent animate-spin"
                      style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      Converting your file{files.length > 1 ? "s" : ""}…
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {progress < 30 ? "Uploading…" : progress < 70 ? "Rendering pages…" : "Almost done…"}
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-5">

                {/* Dropzone */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
                      files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-sky-400 hover:bg-sky-50/40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
                        files.length ? "bg-green-100" : "bg-sky-50 group-hover:bg-sky-100"
                      }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <FileImage className="w-7 h-7 text-sky-600" />
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
                          {["✓ No signup", "✓ No watermark", "✓ Lossless PNG", "✓ Auto-deleted"].map((t) => (
                            <span
                              key={t}
                              className="bg-sky-50 text-sky-700 border border-sky-100 text-xs font-medium px-2.5 py-1 rounded-full"
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

                {/* Info row + Convert Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <FileImage className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">Lossless page to PNG conversion</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Single PDF → PNG images · Multiple PDFs → ZIP download
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
                      files.length && !isLoading
                        ? "bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-700 hover:to-indigo-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FileImage className="w-4 h-4" />
                    Convert to PNG
                  </button>
                </div>

                {/* Hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
                  <p>💡 Each PDF page becomes a lossless PNG · Transparent backgrounds supported</p>
                </div>

              </form>
            </div>

            {/* Success State */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-sky-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-sky-800 mb-1">
                    Done! Your file{files.length > 1 ? "s" : ""} downloaded automatically 🎉
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Check your downloads — ZIP contains all converted PNG files.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setFiles([]); }}
                      className="inline-flex items-center gap-2 bg-white border border-sky-300 text-sky-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-50 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Convert another PDF
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

          </div>

          {/* Footer Trust Bar */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Lossless PNG output • Works on Windows, Mac, Android &amp; iOS
          </p>

        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Free PDF to PNG Converter — Extract Every PDF Page as a Lossless PNG Image
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need PDF pages as lossless PNG images? Convert here — every page extracted at
            full quality with transparent background support. Single-page PDF downloads as
            one PNG directly. Multi-page PDF downloads as a ZIP with all images inside.
            Fast, free, and privacy-friendly on PDFLinx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg border border-sky-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Lossless PNG Quality</h3>
            <p className="text-gray-600 text-sm">
              Every PDF page extracted at full lossless quality — text stays
              pixel-sharp, colors are accurate, transparent backgrounds preserved.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Download</h3>
            <p className="text-gray-600 text-sm">
              Single-page PDF downloads as one PNG directly. Multi-page PDF
              downloads as a ZIP containing all extracted PNG images.
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
            How to Convert PDF to PNG — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-600 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PDF or upload multiple PDFs at once for batch
                conversion. Drag and drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to PNG</h4>
              <p className="text-gray-600 text-sm">
                Hit Convert and wait a few seconds — every page is extracted
                as a lossless PNG image automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
              <h4 className="text-lg font-semibold mb-2">Download PNG or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single-page PDF downloads as PNG directly. Multi-page PDF
                downloads as ZIP with all extracted images inside.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm rounded-xl border border-gray-100">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">Need to do more with your PDF?</h3>
          <p className="mt-1 text-sm text-slate-600">
            After converting PDF to PNG, these tools can help you work with your documents.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/pdf-to-jpg" className="text-sky-700 font-semibold hover:underline">PDF to JPG</a>{" "}
              <span className="text-slate-600">— convert PDF pages to JPG format instead for smaller file size.</span>
            </li>
            <li>
              <a href="/image-to-pdf" className="text-sky-700 font-semibold hover:underline">Image to PDF</a>{" "}
              <span className="text-slate-600">— convert your PNG images back into a PDF document.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-sky-700 font-semibold hover:underline">Compress PDF</a>{" "}
              <span className="text-slate-600">— reduce PDF file size before extracting pages as PNG images.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-sky-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by designers, developers, and professionals to convert PDF pages
          to lossless PNG images — fast, reliable, and always free.
        </p>
      </section>

      {/* ==================== DEEP SEO CONTENT ==================== */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to PNG Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Need PDF pages as lossless images for design work, web graphics, or presentations?
          The{" "}
          <span className="font-medium text-slate-900">PDFLinx PDF to PNG Converter</span>{" "}
          extracts every page from your PDF as a high-quality lossless PNG image in seconds —
          text razor-sharp, colors pixel-perfect, transparent backgrounds fully supported. No
          software installation, no watermarks, no sign-up required.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF to PNG Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to PNG conversion extracts each page of a PDF document and saves it as a
          separate lossless PNG image file. Unlike JPG, PNG uses lossless compression —
          meaning zero quality loss, razor-sharp text, and support for transparent
          backgrounds. Ideal for design assets, logos, diagrams, and any PDF content
          where pixel-perfect quality matters.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          PNG vs JPG — Which Should You Choose for PDF Pages?
        </h3>
        <p className="leading-7 mb-6">
          <strong>PNG</strong> is the better choice when quality is the priority — lossless
          compression means no quality degradation, transparent backgrounds are supported,
          and text stays perfectly sharp even at small sizes. Best for logos, diagrams,
          infographics, UI screenshots, and any content with flat colors or sharp edges.{" "}
          <strong>JPG</strong> produces smaller file sizes and is better suited for photos,
          scanned documents, and social media sharing where file size matters more than
          lossless quality. If you need JPG instead, use the{" "}
          <a href="/pdf-to-jpg" className="text-sky-700 font-medium hover:underline">PDF to JPG tool</a>.
        </p>

        <div className="mt-6 space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF to PNG Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li><strong>Design and web graphics:</strong> Extract PDF diagrams, logos, or infographics as PNG for use in websites, apps, or design tools like Figma and Canva.</li>
              <li><strong>Presentations:</strong> Insert PDF pages as lossless PNG images into PowerPoint or Google Slides without quality loss.</li>
              <li><strong>Document thumbnails:</strong> Convert the first page of a PDF to PNG for use as a preview image in document libraries or websites.</li>
              <li><strong>Developer assets:</strong> Extract UI mockups, wireframes, or spec sheets from PDF to PNG for use in development workflows.</li>
              <li><strong>Academic and research:</strong> Extract charts, diagrams, and data tables from PDF papers as high-quality PNG images for reports.</li>
              <li><strong>Transparent background needs:</strong> PNG supports transparency — ideal when the PDF contains logos or graphics that need transparent backgrounds.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Privacy and File Security</h3>
            <p className="leading-7">
              PDFLinx is built with privacy as a core priority. Uploaded PDF files are
              processed securely and <strong>permanently deleted after conversion</strong> —
              never stored long-term, never shared with third parties. No account creation
              required — no email, no password, no personal data collected.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Convert PDF to PNG on Any Device</h3>
            <p className="leading-7">
              PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in
              any modern browser. No app download, no software installation required. Convert
              PDF pages to PNG images in seconds from any device.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto my-10">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-sky-50 text-sky-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">PNG</th>
                <th className="px-4 py-3">JPG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Compression", "Lossless — zero quality loss", "Lossy — some quality reduction"],
                ["Transparent background", "✅ Supported", "❌ Not supported"],
                ["Best for", "Text, logos, diagrams, UI", "Photos, scanned docs, social media"],
                ["File size", "Larger", "Smaller"],
                ["Text sharpness", "✅ Pixel-perfect", "⚠️ May blur at edges"],
                ["Universal compatibility", "✅ All platforms", "✅ All platforms"],
              ].map(([feature, png, jpg], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium">{feature}</td>
                  <td className="px-4 py-3 text-sky-700">{png}</td>
                  <td className="px-4 py-3 text-gray-600">{jpg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Should Use This Tool?</h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Designers:</strong> Extract PDF graphics, logos, and diagrams as lossless PNG for design workflows</li>
          <li><strong>Developers:</strong> Convert PDF mockups and UI specs to PNG for use in development and documentation</li>
          <li><strong>Content creators:</strong> Extract PDF infographics and charts as PNG for blog posts and newsletters</li>
          <li><strong>Students & researchers:</strong> Pull diagrams and figures from PDF papers as high-quality PNG images</li>
          <li><strong>Business professionals:</strong> Convert report pages and presentations to PNG for email or web use</li>
          <li><strong>Anyone needing quality:</strong> When lossless image quality matters more than file size — choose PNG</li>
        </ul>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is the PDF to PNG converter free to use?", a: "Yes. PDFLinx PDF to PNG converter is completely free — no hidden charges, no subscription, no premium tier required." },
              { q: "Do I need to install any software?", a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed." },
              { q: "What is the quality of the converted PNG images?", a: "PNG images are exported at full lossless quality — text stays pixel-sharp, colors are accurate, and transparent backgrounds are preserved." },
              { q: "How does the download work for single vs multi-page PDFs?", a: "Single-page PDFs download as one PNG file directly. Multi-page PDFs download as a ZIP file containing one PNG image per page, named sequentially." },
              { q: "Can I convert multiple PDF files to PNG at once?", a: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual PNG or ZIP downloads." },
              { q: "What is the difference between PDF to PNG and PDF to JPG?", a: "PNG is lossless — better for text, graphics, logos, and transparent backgrounds. JPG produces smaller files — better for photos and social media sharing." },
              { q: "Does PNG support transparent backgrounds?", a: "Yes. PNG fully supports transparent backgrounds — ideal when your PDF contains logos or graphics that need transparency preserved." },
              { q: "Are my uploaded PDF files safe and private?", a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties." },
              { q: "Can I convert PDF to PNG on my phone?", a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required." },
              { q: "What should I do if I only need one page from a multi-page PDF?", a: "Use the Split PDF tool first to extract the specific page you need, then convert that single-page PDF to PNG for a direct download without a ZIP." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-sky-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="pdf-to-png" />
    </>
  );
}