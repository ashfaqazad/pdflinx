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
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
              Word to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600">
              Convert Word to PDF online for free. Turn DOC or DOCX into a high-quality PDF instantly — no signup, no watermark, 100% secure
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Input */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-700">
                      {file
                        ? file.name
                        : "Drop your Word file here or click to upload Supports .doc & .docx files"}
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



      {/* ==================== UNIQUE SEO CONTENT SECTION - WORD TO PDF ==================== */}
      <section className="mt-20 max-w-5xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h4 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
            Word to PDF Online Free - Convert DOC/DOCX Instantly
          </h4>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert Word documents (DOC, DOCX) to PDF in seconds while preserving formatting, fonts, images, tables, and layout. Perfect for sharing professional documents securely.
          </p>
        </div>

        {/* Benefits Grid - 3 Cards with Icons */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Formatting Preserved</h3>
            <p className="text-gray-600">
              Fonts, images, tables, headings, and layout stay exactly the same in the PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Supports DOC & DOCX</h3>
            <p className="text-gray-600">
              Convert any Microsoft Word document to PDF free – including complex files with styles.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Secure & Free</h3>
            <p className="text-gray-600">
              Convert Word to PDF instantly on any device. No signup, no watermark – files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            How to Convert Word to PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-xl font-semibold mb-3">Upload Word File</h4>
              <p className="text-gray-600">Drag & drop your DOC or DOCX document</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-xl font-semibold mb-3">Click Convert</h4>
              <p className="text-gray-600">We preserve all formatting perfectly</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-xl font-semibold mb-3">Download PDF</h4>
              <p className="text-gray-600">Get your professional PDF instantly!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-lg text-gray-500 italic">
          Convert Word to PDF every day with flawless results – trusted by thousands at PDF Linx.
        </p>
      </section>
    </>
  );
}




