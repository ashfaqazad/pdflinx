'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, RotateCw, Download, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function RotatePdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rotatedUrl, setRotatedUrl] = useState(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const rotate = async (angle) => {
    if (!file) return;
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setRotation((page.getRotation().angle + angle + 360) % 360);
        // Adjust position if needed after rotation
        if (angle === 90 || angle === 270) {
          page.setSize(height, width);
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setRotatedUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error rotating PDF. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Script
        id="howto-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Rotate PDF Online for Free",
            description: "Rotate PDF pages 90, 180, 270 degrees instantly.",
            url: "https://pdflinx.com/rotate-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Choose Angle", text: "Select 90°, 180°, or 270° rotation." },
              { "@type": "HowToStep", name: "Download", text: "Download rotated PDF instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-rotate"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Rotate PDF", item: "https://pdflinx.com/rotate-pdf" }
            ]
          }, null, 2),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
              Rotate PDF <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rotate PDF pages 90°, 180°, or 270° instantly. Fix upside-down or sideways PDFs — 100% free, no signup.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <label className="block cursor-pointer">
              <div className="border-4 border-dashed border-orange-300 rounded-3xl p-20 text-center hover:border-amber-500 transition">
                <Upload className="w-24 h-24 mx-auto text-orange-600 mb-8" />
                <span className="text-3xl font-bold text-gray-800 block mb-4">
                  Drop PDF here or click to upload
                </span>
                <span className="text-xl text-gray-600">Single or multi-page PDFs supported</span>
              </div>
              <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
            </label>

            {file && (
              <div className="mt-12">
                <p className="text-center text-xl font-semibold mb-8">Selected: {file.name}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => rotate(90)}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-6 rounded-2xl hover:from-orange-700 hover:to-amber-700 transition shadow-xl flex items-center justify-center gap-4"
                  >
                    <RotateCw size={32} />
                    Rotate 90° Clockwise
                  </button>
                  <button
                    onClick={() => rotate(180)}
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-6 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition shadow-xl flex items-center justify-center gap-4"
                  >
                    <RotateCw size={32} className="rotate-180" />
                    Rotate 180°
                  </button>
                  <button
                    onClick={() => rotate(270)}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-6 rounded-2xl hover:from-orange-700 hover:to-amber-700 transition shadow-xl flex items-center justify-center gap-4"
                  >
                    <RotateCw size={32} className="rotate-90" />
                    Rotate 270° Clockwise
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center mt-12">
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600"></div>
                <p className="mt-6 text-2xl font-bold text-orange-600">Rotating PDF...</p>
              </div>
            )}

            {rotatedUrl && (
              <div className="text-center mt-12">
                <p className="text-3xl font-bold text-green-600 mb-6">PDF Rotated Successfully!</p>
                <a
                  href={rotatedUrl}
                  download="rotated-pdf.pdf"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
                >
                  <Download size={36} />
                  Download Rotated PDF
                </a>
              </div>
            )}
          </div>

          <p className="text-center mt-10 text-gray-600 text-lg">
            No signup • Unlimited rotations • High quality • 100% free & private
          </p>
        </div>
      </main>

      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
            Rotate PDF Online Free - Fix Orientation Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Rotate PDF pages 90°, 180°, or 270° in seconds. Perfect for fixing upside-down or sideways scanned documents — completely free with PDF Linx.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCw className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Angle</h3>
            <p className="text-gray-600">Rotate 90°, 180°, or 270° — fix any orientation issue.</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-10 rounded-3xl shadow-xl border border-amber-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Quality</h3>
            <p className="text-gray-600">No quality loss — original PDF preserved perfectly.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Free</h3>
            <p className="text-gray-600">Rotate unlimited PDFs instantly — no signup, completely free.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Rotate PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
              <p className="text-gray-600 text-lg">Drop or select your PDF file.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Choose Rotation</h4>
              <p className="text-gray-600 text-lg">Select 90°, 180°, or 270° rotation.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download</h4>
              <p className="text-gray-600 text-lg">Save your rotated PDF instantly.</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Rotate PDFs every day with PDF Linx — trusted by thousands for fast, accurate, and completely free PDF rotation.
        </p>
      </section>
    </>
  );
}