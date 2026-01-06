'use client';

import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Upload, Download, Type, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function AddWatermark() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const addWatermark = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };

  const applyWatermark = async () => {
    if (!file || !text) return;
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - 100,
          y: height / 2,
          size: 80,
          color: rgb(0.8, 0.8, 0.8),
          opacity: opacity,
          rotate: { type: 'degrees', angle: -45 },
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setWatermarkedUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error adding watermark');
    }
    setLoading(false);
  };

  return (
    <>
      <Script
        id="howto-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Watermark to PDF Online for Free",
            description: "Add text watermark to PDF pages instantly.",
            url: "https://pdflinx.com/add-watermark",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
              { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
            ]
          }, null, 2),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
              Add Watermark to PDF <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Add text watermark to your PDF pages instantly. Perfect for "CONFIDENTIAL", "DRAFT", or copyright — 100% free.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <label className="block cursor-pointer mb-10">
              <div className="border-4 border-dashed border-gray-300 rounded-3xl p-20 text-center hover:border-slate-500 transition">
                <Upload className="w-24 h-24 mx-auto text-gray-600 mb-8" />
                <span className="text-3xl font-bold text-gray-800 block mb-4">
                  Drop PDF here or click to upload
                </span>
              </div>
              <input type="file" accept=".pdf" onChange={addWatermark} className="hidden" />
            </label>

            {file && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
                    <Type size={28} className="text-gray-600" />
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., CONFIDENTIAL, DRAFT, © 2025"
                    className="w-full p-6 text-2xl text-center border-2 border-gray-300 rounded-2xl focus:border-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xl font-semibold text-gray-700 mb-4">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={applyWatermark}
                    disabled={loading}
                    className="bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-gray-700 hover:to-slate-700 disabled:opacity-60 transition shadow-2xl"
                  >
                    {loading ? 'Adding Watermark...' : 'Apply Watermark'}
                  </button>
                </div>
              </div>
            )}

            {watermarkedUrl && (
              <div className="text-center mt-12">
                <p className="text-3xl font-bold text-green-600 mb-6">Watermark Added Successfully!</p>
                <a
                  href={watermarkedUrl}
                  download="watermarked-pdf.pdf"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
                >
                  <Download size={36} />
                  Download Watermarked PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-6">
            Add Watermark to PDF Online Free - Protect Your Documents
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Add text watermark like "CONFIDENTIAL", "DRAFT", or copyright to all PDF pages instantly. Professional protection — completely free with PDF Linx.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Type className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Text</h3>
            <p className="text-gray-600">Add any text — "CONFIDENTIAL", "DRAFT", "COPYRIGHT" etc.</p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">All Pages</h3>
            <p className="text-gray-600">Watermark applied to every page automatically.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
            <p className="text-gray-600">Add watermark unlimited times — no signup, no upload.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Add Watermark to PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
              <p className="text-gray-600 text-lg">Drop or select your PDF document.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Enter Text</h4>
              <p className="text-gray-600 text-lg">Type your watermark text and adjust opacity.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download</h4>
              <p className="text-gray-600 text-lg">Save watermarked PDF instantly.</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Add watermark to PDFs every day with PDF Linx — trusted by professionals for fast, reliable, and completely free document protection.
        </p>
      </section>

    <RelatedToolsSection currentPage="add-watermark" />
      
    </>
  );
}