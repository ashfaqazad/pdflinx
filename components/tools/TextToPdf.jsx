'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, FileText, Type, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function TextToPDF() {
  const [text, setText] = useState('');

  const generatePDF = () => {
    if (!text.trim()) {
      alert('Please enter some text first!');
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    const lines = doc.splitTextToSize(text, maxWidth);

    let y = 20;
    const lineHeight = 7;

    lines.forEach(line => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save('my-text-document.pdf');
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-text-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Text to PDF Online for Free",
            description: "Create PDF from plain text with custom formatting instantly.",
            url: "https://pdflinx.com/text-to-pdf",
            step: [
              { "@type": "HowToStep", name: "Paste Text", text: "Type or paste your text." },
              { "@type": "HowToStep", name: "Customize", text: "Choose font, size, alignment." },
              { "@type": "HowToStep", name: "Download PDF", text: "Click convert and download PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-text-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Text to PDF", item: "https://pdflinx.com/text-to-pdf" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Text to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Turn your notes, letters, or any random text into a clean, professional PDF in seconds. No fuss, no watermarks – just pure magic!
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                <Type className="w-6 h-6 text-blue-600" />
                Drop Your Text Here
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Go ahead – paste your resume, story, notes, shopping list, or whatever's on your mind..."
                className="w-full h-80 p-6 text-base leading-relaxed border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none resize-y bg-gray-50 transition-shadow hover:shadow-inner"
                spellCheck="true"
              />
              <p className="text-right text-gray-500 mt-2 text-sm">
                {text.length} characters
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={generatePDF}
                disabled={!text.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg px-10 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                Download as PDF
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account needed • Convert as much as you like • Looks sharp every time • Totally free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Text to PDF Converter Online Free - Turn Words into PDFs in a Snap
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got some text that needs to look legit? Whether it's a quick letter, study notes, or that novel you've been writing on your phone – just paste it here and boom, you've got a polished PDF ready to print or share. All free, right in your browser, courtesy of PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Looks Pro Every Time</h3>
            <p className="text-gray-600 text-sm">
              Clean layout, nice margins – perfect for resumes, letters, or anything you want to impress with.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Any Text Welcome</h3>
            <p className="text-gray-600 text-sm">
              Short note? Long story? Even code snippets – handles pages automatically, no sweat.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick & Private</h3>
            <p className="text-gray-600 text-sm">
              Happens right in your browser – nothing leaves your device, and it's all on the house.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Turn Text into PDF in 3 Super Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Paste It In</h4>
              <p className="text-gray-600 text-sm">Dump whatever text you've got – the more the merrier.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">We Do the Magic</h4>
              <p className="text-gray-600 text-sm">It gets neatly arranged with proper spacing and flow – looks sharp instantly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Grab Your PDF</h4>
              <p className="text-gray-600 text-sm">Hit download – ready to print, email, or stash away.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          People turn to PDF Linx every day to quickly whip up clean PDFs from text – it's fast, simple, and always free.
        </p>
      </section>
    
    <RelatedToolsSection currentPage="text-to-pdf" />

    </>
  );
}






























// 'use client';

// import { useState } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { Download, FileText, Type, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function TextToPDF() {
//   const [text, setText] = useState('');

//   const generatePDF = () => {
//     if (!text.trim()) {
//       alert('Please enter some text first!');
//       return;
//     }

//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     const maxWidth = pageWidth - 2 * margin;

//     const lines = doc.splitTextToSize(text, maxWidth);

//     let y = 20;
//     const lineHeight = 7;

//     lines.forEach(line => {
//       if (y > 270) {
//         doc.addPage();
//         y = 20;
//       }
//       doc.text(line, margin, y);
//       y += lineHeight;
//     });

//     doc.save('my-text-document.pdf');
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-text-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Text to PDF Online for Free",
//             description: "Create PDF from plain text with custom formatting instantly.",
//             url: "https://pdflinx.com/text-to-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Paste Text", text: "Type or paste your text." },
//               { "@type": "HowToStep", name: "Customize", text: "Choose font, size, alignment." },
//               { "@type": "HowToStep", name: "Download PDF", text: "Click convert and download PDF." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-text-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Text to PDF", item: "https://pdflinx.com/text-to-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//               Text to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Convert plain text to professional PDF instantly. Perfect formatting, custom font size — 100% free, no signup, no watermark.
//             </p>
//           </div>

//           {/* Tool Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             <div className="mb-8">
//               <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
//                 <Type size={28} className="text-blue-600" />
//                 Enter Your Text Below
//               </label>
//               <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Paste your resume, notes, letter, article, or any text here..."
//                 className="w-full h-96 p-8 text-lg leading-relaxed border-2 border-gray-300 rounded-2xl focus:border-blue-600 outline-none resize-y bg-gray-50 font-serif transition-shadow hover:shadow-inner"
//                 spellCheck="true"
//               />
//               <p className="text-right text-gray-500 mt-2">
//                 {text.length} characters
//               </p>
//             </div>

//             <div className="text-center">
//               <button
//                 onClick={generatePDF}
//                 disabled={!text.trim()}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto"
//               >
//                 <Download size={36} />
//                 Download as PDF
//               </button>
//             </div>
//           </div>

//           <p className="text-center mt-10 text-gray-600 text-lg">
//             No signup • Unlimited conversions • Professional formatting • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//             Text to PDF Converter Online Free - Create PDF from Text Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert any plain text — resumes, notes, letters, articles — into beautifully formatted PDF documents. Professional layout, perfect for printing and sharing. Completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FileText className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Formatting</h3>
//             <p className="text-gray-600">
//               Clean A4 layout with proper margins — ideal for resumes, letters, reports.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Type className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Any Text Supported</h3>
//             <p className="text-gray-600">
//               Paste notes, code, articles, emails — multi-page support for long text.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Private</h3>
//             <p className="text-gray-600">
//               Convert instantly in browser — no upload, nothing stored, completely free.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Convert Text to PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Paste Your Text</h4>
//               <p className="text-gray-600 text-lg">Type or paste any text — resume, letter, notes, article.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Auto Format</h4>
//               <p className="text-gray-600 text-lg">Text automatically formatted with clean margins and font.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download PDF</h4>
//               <p className="text-gray-600 text-lg">Save professional PDF instantly — ready for print or share.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Convert text to PDF every day with PDF Linx — trusted by thousands for fast, professional, and completely free document creation.
//         </p>
//       </section>
    
//     <RelatedToolsSection currentPage="text-to-pdf" />

//     </>
//   );
// }





















// 'use client';

// import { useState } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export default function TextToPDF() {
//   // ✅ Empty initial state (no pre-filled text)
//   const [text, setText] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 15;
//     const maxWidth = pageWidth - 2 * margin;

//     const lines = doc.splitTextToSize(text, maxWidth);

//     let y = 20;
//     const lineHeight = 5;

//     lines.forEach(line => {
//       if (y > 280) {
//         doc.addPage();
//         y = 20;
//       }
//       doc.text(line, margin, y);
//       y += lineHeight;
//     });

//     doc.save('text-to-pdf.pdf');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
//         <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//           Text to PDF Converter
//         </h1>

//         {/* ✅ Textarea size increased */}
//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="w-full h-[300px] p-6 text-base leading-relaxed border-2 border-gray-300 rounded-2xl focus:border-blue-600 outline-none resize-y font-mono bg-gray-50"
//           placeholder="Paste your resume or text here..."
//         />

//         <div className="text-center mt-8">
//           <button
//             onClick={generatePDF}
//             className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-16 py-5 rounded-full text-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all shadow-lg"
//           >
//             Download PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

