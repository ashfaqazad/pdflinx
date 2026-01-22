// app/pdf-to-word/page.js

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/convert/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.click();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setFile(null); // Reset after success
    } catch (err) {
      alert("Oops! Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - PDF to Word */}
      <Script
        id="howto-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to Word Online for Free",
            description: "Convert any PDF file to editable Word document in just 3 simple steps using PDF Linx - completely free and no signup required.",
            url: "https://pdflinx.com/pdf-to-word",
            step: [
              {
                "@type": "HowToStep",
                name: "Upload your PDF",
                text: "Click on 'Select PDF file' button and choose the PDF you want to convert from your device."
              },
              {
                "@type": "HowToStep",
                name: "Click Convert",
                text: "Press the 'Convert to Word' button and wait a few seconds while we process your file."
              },
              {
                "@type": "HowToStep",
                name: "Download Word file",
                text: "Your converted .docx file will automatically download. Open it in Microsoft Word or Google Docs."
              }
            ],
            totalTime: "PT30S",
            estimatedCost: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "USD"
            },
            tool: [{ "@type": "HowToTool", name: "PDF Linx PDF to Word Converter" }],
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - PDF to Word */}
      <Script
        id="breadcrumb-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              PDF to Word Converter <br />(Free & Online)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stuck with a PDF you need to edit? Turn it into a fully editable Word file in seconds – formatting stays perfect, no sign-up needed!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {file ? file.name : "Drop your PDF here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Turns into editable Word (DOCX)</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
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
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... almost there!</>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Convert to Word
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All done!</p>
                <p className="text-base text-gray-700">Your editable Word file downloaded automatically</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files gone after 1 hour • Completely free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            PDF to Word Online Free – Make Your PDFs Editable
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to tweak a PDF? Convert it to Word here – text, tables, images, everything stays in place so you can edit easily. Fast, accurate, and always free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Super Accurate</h3>
            <p className="text-gray-600 text-sm">
              Text, tables, layout – everything transfers cleanly for easy editing.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Handles Tough PDFs</h3>
            <p className="text-gray-600 text-sm">
              Scanned pages, images, multi-column – turns them into editable Word.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Private</h3>
            <p className="text-gray-600 text-sm">
              Instant conversion – no sign-up, no watermark, files deleted after 1 hour.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Convert PDF to Word in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload PDF</h4>
              <p className="text-gray-600 text-sm">Drop your file (even scanned ones work)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We pull out text and formatting neatly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download Word</h4>
              <p className="text-gray-600 text-sm">Your editable DOCX is ready!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands use PDF Linx daily to unlock PDFs into editable Word files – fast, accurate, and always free.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
    PDF to Word Converter – Free Online Tool by PDFLinx
  </h2>

  {/* Intro */}
  <p className="text-base leading-7 mb-6">
    Ever received a PDF that you desperately needed to edit, but it just wouldn't let you? 
    We've all been there—stuck with a locked document when you need to make quick changes. 
    That's exactly why we built the <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span>. 
    It's a completely free online tool that turns your PDFs into fully editable Word (DOCX) files in seconds—no software downloads, no watermarks, and no hassle.
  </p>

  {/* What is */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    What is PDF to Word Conversion?
  </h3>
  <p className="leading-7 mb-6">
    PDF to Word conversion means taking a fixed-layout PDF and turning it back into an editable Microsoft Word document. 
    PDFs are great for sharing because nothing moves around, but when you need to update text, fix a typo, or add new content, 
    you need it in Word format. Our tool gives you that freedom while keeping the original look and feel as intact as possible.
  </p>

  {/* Why convert */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Why Convert PDF Files to Word?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li>Easily edit text, images, tables, and everything else</li>
    <li>Keeps fonts, headings, layout, and formatting as accurate as possible</li>
    <li>Open and edit directly in Microsoft Word, Google Docs, or any editor</li>
    <li>Perfect for updating resumes, reports, contracts, or assignments quickly</li>
    <li>Even works with scanned PDFs thanks to built-in OCR technology</li>
  </ul>

  {/* Steps */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    How to Convert PDF to Word Online
  </h3>
  <ol className="space-y-2 mb-6 list-decimal pl-6">
    <li>Upload your PDF file (just drag & drop or click to select)</li>
    <li>Hit the “Convert to Word” button</li>
    <li>Wait a few seconds—conversion is super fast</li>
    <li>Download your fully editable DOCX file instantly</li>
  </ol>

  <p className="mb-6">
    No account needed, no watermark added, no software to install—completely free and simple.
  </p>

  {/* Features box */}
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-slate-900 mb-4">
      Features of PDFLinx PDF to Word Converter
    </h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
      <li>100% free online converter</li>
      <li>High accuracy with layout preservation</li>
      <li>Supports scanned PDFs with OCR</li>
      <li>Lightning-fast conversion</li>
      <li>Works perfectly on mobile & desktop</li>
      <li>No file storage – full privacy guaranteed</li>
      <li>Clean output with no watermarks</li>
    </ul>
  </div>

  {/* Audience */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Who Should Use This Tool?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li><strong>Students:</strong> Edit assignments, theses, or notes received as PDFs</li>
    <li><strong>Professionals:</strong> Update resumes, reports, or proposals on the go</li>
    <li><strong>Businesses:</strong> Make changes to invoices, contracts, or legal docs</li>
    <li><strong>Freelancers:</strong> Turn client PDF briefs into editable Word files quickly</li>
    <li><strong>Teachers:</strong> Modify study materials or handouts before sharing</li>
  </ul>

  {/* Safety */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Is PDFLinx Safe to Use?
  </h3>
  <p className="leading-7 mb-6">
    Absolutely. Your privacy matters to us. 
    Every file you upload is processed securely and automatically deleted from our servers shortly after conversion. 
    We never store your documents permanently or share them with anyone.
  </p>

  {/* Closing */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Convert PDF to Word Anytime, Anywhere
  </h3>
  <p className="leading-7">
    PDFLinx works smoothly on Windows, macOS, Linux, Android, and iOS. 
    All you need is an internet connection and a browser—turn any PDF into an editable Word document in just a few clicks, wherever you are.
  </p>
</section>


<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">

    <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4">

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Is the PDF to Word converter free to use?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — completely free with no hidden fees or limits.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Do I need to install any software?
        </summary>
        <p className="mt-2 text-gray-600">
          No downloads or installations needed. Everything happens right in your browser.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Will the formatting from my PDF be preserved?
        </summary>
        <p className="mt-2 text-gray-600">
          We work hard to keep fonts, tables, images, and layout as close to the original as possible. 
          Results are highly accurate, though very complex PDFs might need minor tweaks afterward.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Are my files safe and private?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — files are securely processed and automatically deleted shortly after conversion. No permanent storage.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I use this on my phone?
        </summary>
        <p className="mt-2 text-gray-600">
          Absolutely! It works great on mobile phones, tablets, and desktops.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Does it work with scanned PDFs?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes! Our built-in OCR technology extracts text from scanned documents accurately.
        </p>
      </details>

    </div>
  </div>
</section>

      <RelatedToolsSection currentPage="pdf-to-word" />
      
    </>
  );
}




















// // app/pdf-to-word/page.js

// "use client";
// import { useState } from "react";
// import { Upload, Download, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function PdfToWord() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PDF file");

//     setLoading(true);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/convert/pdf-to-word", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Conversion failed");

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.pdf$/i, ".docx");
//       a.click();
//       window.URL.revokeObjectURL(url);

//       setSuccess(true);
//       setFile(null); // Reset after success
//     } catch (err) {
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>

//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

//       {/* HowTo Schema - PDF to Word */}
//       <Script
//         id="howto-schema-pdf-to-word"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert PDF to Word Online for Free",
//             description: "Convert any PDF file to editable Word document in just 3 simple steps using PDF Linx - completely free and no signup required.",
//             url: "https://pdflinx.com/pdf-to-word",
//             step: [
//               {
//                 "@type": "HowToStep",
//                 name: "Upload your PDF",
//                 text: "Click on 'Select PDF file' button and choose the PDF you want to convert from your device."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Click Convert",
//                 text: "Press the 'Convert to Word' button and wait a few seconds while we process your file."
//               },
//               {
//                 "@type": "HowToStep",
//                 name: "Download Word file",
//                 text: "Your converted .docx file will automatically download. Open it in Microsoft Word or Google Docs."
//               }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: {
//               "@type": "MonetaryAmount",
//               value: "0",
//               currency: "USD"
//             },
//             tool: [{ "@type": "HowToTool", name: "PDF Linx PDF to Word Converter" }],
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       {/* Breadcrumb Schema - PDF to Word */}
//       <Script
//         id="breadcrumb-schema-pdf-to-word"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== BRAND NEW MODERN UI - SAME AS WORD TO PDF ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
//         <div className="max-w-2xl w-full">
//           {/* Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
//               PDF to Word Converter <br />(Free & Online)
//             </h1>
//             <p className="text-xl text-gray-600">
//               Convert PDF to Word online for free. Our PDF to Word converter
//               creates editable DOCX files fast, secure and without signup.
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Upload Area */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
//                     <p className="text-xl font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PDF file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">Convert PDF to fully editable Word (DOCX)</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="application/pdf"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>

//               {/* Convert Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <>Converting your PDF...</>
//                 ) : (
//                   <>
//                     <FileText size={28} />
//                     Convert to Word
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success Message */}
//             {success && (
//               <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
//                 <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                 <p className="text-2xl font-bold text-green-700 mb-4">Converted Successfully!</p>
//                 <p className="text-lg text-gray-700">Your editable Word file has been downloaded</p>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="text-center mt-8 text-gray-600">
//             <p className="text-sm">
//               No signup • No watermark • 100% free • Files delete after 1 hour
//             </p>
//           </div>
//         </div>
//       </main>



//       {/* ==================== UNIQUE SEO CONTENT SECTION - PDF TO WORD ==================== */}
//       <section className="mt-20 max-w-5xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
//             PDF to Word Online Free - Convert to Editable DOCX
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Convert PDF to Word (DOCX) instantly while keeping text, tables, images, and formatting intact. Edit your documents easily – perfect for reports, contracts, or resumes.
//           </p>
//         </div>

//         {/* Benefits Grid - 3 Cards with Icons */}
//         <div className="grid md:grid-cols-3 gap-8 mb-20">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Accurate & Editable</h3>
//             <p className="text-gray-600">
//               Convert PDF to Word with high accuracy. Text, tables, and layout preserved for easy editing.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Supports Complex PDFs</h3>
//             <p className="text-gray-600">
//               Handles scanned PDFs, images, tables, and multi-column layouts – converts to editable DOCX.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Free & Secure</h3>
//             <p className="text-gray-600">
//               Convert PDF to Word online instantly. No signup, no watermark – files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100">
//           <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
//             How to Convert PDF to Word in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-10">
//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Upload PDF</h4>
//               <p className="text-gray-600">Drag & drop your PDF file (even scanned)</p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Click Convert</h4>
//               <p className="text-gray-600">We extract text and formatting accurately</p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Download Word File</h4>
//               <p className="text-gray-600">Get your editable DOCX instantly!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-lg text-gray-500 italic">
//           Convert PDF to Word every day with perfect results – trusted by thousands at PDF Linx.
//         </p>
//       </section>

//             <RelatedToolsSection currentPage="pdf-to-word" />
      
//     </>
//   );
// }




























// "use client";
// import { useState } from "react";

// export default function PdfToWord() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

// const API_URL = "";


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!file) return alert("Please select a PDF file");

//   setLoading(true);
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     // ← YEHI LINE HAI JO SAB THEEK KAREGI
//     const res = await fetch("/convert/pdf-to-word", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Conversion failed");

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.name.replace(/\.pdf$/i, ".docx");
//     a.click();
//     window.URL.revokeObjectURL(url);

//   } catch (err) {
//     alert("Error: " + err.message);
//   } finally {
//     setLoading(false);
//     setFile(null);
//   }
// };
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your PDF to Word documents with incredible accuracy.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
//         <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition text-lg font-medium">
//           {file ? file.name : "Select PDF file"}
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="hidden"
//             required
//           />
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-blue-700 disabled:opacity-60 transition shadow-lg"
//         >
//           {loading ? "Converting... Please wait" : "Convert to Word"}
//         </button>
//       </form>

//       {loading && (
//         <p className="mt-8 text-blue-600 text-lg font-medium animate-pulse">
//           Converting your PDF... (takes 5-15 seconds)
//         </p>
//       )}
//     </main>
//   );
// }

