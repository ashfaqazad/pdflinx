"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, Image as ImageIcon } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";


export default function PdfToJpg() {
  const [files, setFiles] = useState([]); // Multiple files support
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // "files" name – backend mein upload.array("files")
    });

    try {
      // const res = await fetch("/convert/pdf-to-jpg", {
      const res = await fetch("/convert/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Conversion failed: " + errorText);
        setLoading(false);
        return;
      }

      // Backend direct ZIP ya single JPG stream karega
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
      setLoading(false);
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
              Extract pages from one or multiple PDFs as high-quality JPG images. Single page → direct JPG, multiple pages → ZIP file. Just like iLovePDF & Smallpdf!
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      files.length > 0
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

              <button
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
            No account • No watermark • Files deleted after 1 hour • 100% Free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            PDF to JPG Online Free – Extract Pages as Images Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert one or multiple PDFs to JPG images. Single page PDFs become direct JPGs, multi-page PDFs become clean ZIP files – just like iLovePDF and Smallpdf. Fast, free, no signup!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Download</h3>
            <p className="text-gray-600 text-sm">
              1 page = single JPG | Multiple pages = ZIP with all images
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch Support</h3>
            <p className="text-gray-600 text-sm">
              Upload multiple PDFs at once – each gets its own JPG/ZIP
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion, auto download, files deleted after 1 hour
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert PDF to JPG in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDFs</h4>
              <p className="text-gray-600 text-sm">One or multiple – drop them here</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We extract every page as JPG</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Auto Download</h4>
              <p className="text-gray-600 text-sm">JPG or ZIP starts downloading instantly</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands trust PDF Linx daily for PDF to JPG conversions – fast, smart, and completely free.
        </p>
      </section>

    <RelatedToolsSection currentPage="pdf-to-jpg" />

    </>
  );
}

