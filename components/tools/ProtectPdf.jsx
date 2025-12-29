'use client';

import { useState } from 'react';
import { Upload, Download, Lock, CheckCircle } from 'lucide-react';
import Script from 'next/script';

export default function ProtectPdf() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [protectedUrl, setProtectedUrl] = useState(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const protect = async () => {
    if (!file || !password.trim()) {
      alert('Please upload a PDF and enter a strong password!');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const res = await fetch('/api/convert/protect-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Protection failed');
      }

      // Backend se direct download path aayega
      setProtectedUrl(data.download);
    } catch (err) {
      console.error(err);
      alert('Error protecting PDF. Try again with a smaller or text-based PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==================== SCHEMAS ==================== */}
      <Script
        id="howto-schema-protect"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Password Protect PDF Online for Free",
            description: "Add password protection to PDF documents instantly.",
            url: "https://pdflinx.com/protect-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Password", text: "Type strong password." },
              { "@type": "HowToStep", name: "Download", text: "Download protected PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-protect"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Protect PDF", item: "https://pdflinx.com/protect-pdf" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN UI ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
              Protect PDF with Password <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Add password protection to your PDF files instantly. Secure your documents — 100% free, no signup.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <label className="block cursor-pointer mb-10">
              <div className="border-4 border-dashed border-red-300 rounded-3xl p-20 text-center hover:border-orange-500 transition">
                <Upload className="w-24 h-24 mx-auto text-red-600 mb-8" />
                <span className="text-3xl font-bold text-gray-800 block mb-4">
                  Drop PDF here or click to upload
                </span>
              </div>
              <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
            </label>

            {file && (
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
                    <Lock size={28} className="text-red-600" />
                    Enter Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type strong password (min 6 characters)"
                    className="w-full p-6 text-2xl text-center border-2 border-red-300 rounded-2xl focus:border-orange-500 outline-none"
                  />
                  <p className="text-center text-gray-600 mt-4">
                    Password will be required to open the PDF
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={protect}
                    disabled={loading || !password.trim()}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-red-700 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-2xl"
                  >
                    {loading ? 'Protecting PDF...' : 'Protect PDF'}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center mt-12">
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-600"></div>
                <p className="mt-6 text-2xl font-bold text-red-600">Applying password protection...</p>
              </div>
            )}

            {protectedUrl && (
              <div className="text-center mt-12">
                <p className="text-3xl font-bold text-green-600 mb-6">PDF Protected Successfully!</p>
                <a
                  href={protectedUrl}
                  download="protected-pdf.pdf"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
                >
                  <Download size={36} />
                  Download Protected PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Password Protect PDF Online Free - Secure Your Documents
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Add password protection to PDF files instantly. Prevent unauthorized access — perfect for sensitive documents. Completely free with PDF Linx.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-3xl shadow-xl border border-red-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Strong Protection</h3>
            <p className="text-gray-600">Password required to open — full encryption.</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy to Use</h3>
            <p className="text-gray-600">Just upload, enter password, download — done!</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
            <p className="text-gray-600">Protect unlimited PDFs — no signup, no upload.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Password Protect PDF in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
              <p className="text-gray-600 text-lg">Drop or select your document.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Enter Password</h4>
              <p className="text-gray-600 text-lg">Type strong password to protect.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download</h4>
              <p className="text-gray-600 text-lg">Save password-protected PDF.</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Protect PDFs every day with PDF Linx — trusted by professionals for fast, secure, and completely free document protection.
        </p>
      </section>
    </>
  );
}


















// 'use client';

// import { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';
// import { Upload, Download, Lock, CheckCircle } from 'lucide-react';
// import Script from 'next/script';

// export default function ProtectPdf() {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [protectedUrl, setProtectedUrl] = useState(null);

//   const handleFile = (e) => {
//     const selected = e.target.files[0];
//     if (selected) setFile(selected);
//   };

//   const protect = async () => {
//     if (!file || !password) {
//       alert('Please upload PDF and enter password!');
//       return;
//     }
//     setLoading(true);

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       await pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: 'highResolution',
//           modifying: false,
//           copying: false,
//           annotating: true,
//           fillingForms: true,
//           contentAccessibility: true,
//           documentAssembly: true,
//         },
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       setProtectedUrl(URL.createObjectURL(blob));
//     } catch (err) {
//       alert('Error protecting PDF. Try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       <Script
//         id="howto-schema-protect"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Password Protect PDF Online for Free",
//             description: "Add password protection to PDF documents instantly.",
//             url: "https://pdflinx.com/protect-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
//               { "@type": "HowToStep", name: "Enter Password", text: "Type strong password." },
//               { "@type": "HowToStep", name: "Download", text: "Download protected PDF." }
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-protect"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Protect PDF", item: "https://pdflinx.com/protect-pdf" }
//             ]
//           }, null, 2),
//         }}
//       />

//       <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
//               Protect PDF with Password <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Add password protection to your PDF files instantly. Secure your documents — 100% free, no signup.
//             </p>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             <label className="block cursor-pointer mb-10">
//               <div className="border-4 border-dashed border-red-300 rounded-3xl p-20 text-center hover:border-orange-500 transition">
//                 <Upload className="w-24 h-24 mx-auto text-red-600 mb-8" />
//                 <span className="text-3xl font-bold text-gray-800 block mb-4">
//                   Drop PDF here or click to upload
//                 </span>
//               </div>
//               <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
//             </label>

//             {file && (
//               <div className="space-y-8">
//                 <div>
//                   <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
//                     <Lock size={28} className="text-red-600" />
//                     Enter Password
//                   </label>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Type strong password"
//                     className="w-full p-6 text-2xl text-center border-2 border-red-300 rounded-2xl focus:border-orange-500 outline-none"
//                   />
//                   <p className="text-center text-gray-600 mt-4">
//                     Password will be required to open the PDF
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <button
//                     onClick={protect}
//                     disabled={loading || !password}
//                     className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-red-700 hover:to-orange-700 disabled:opacity-60 transition shadow-2xl"
//                   >
//                     {loading ? 'Protecting...' : 'Protect PDF'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {protectedUrl && (
//               <div className="text-center mt-12">
//                 <p className="text-3xl font-bold text-green-600 mb-6">PDF Protected Successfully!</p>
//                 <a
//                   href={protectedUrl}
//                   download="protected-pdf.pdf"
//                   className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
//                 >
//                   <Download size={36} />
//                   Download Protected PDF
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
//             Password Protect PDF Online Free - Secure Your Documents
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Add password protection to PDF files instantly. Prevent unauthorized access — perfect for sensitive documents. Completely free with PDF Linx.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-3xl shadow-xl border border-red-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Lock className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Strong Protection</h3>
//             <p className="text-gray-600">Password required to open — full encryption.</p>
//           </div>

//           <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy to Use</h3>
//             <p className="text-gray-600">Just upload, enter password, download — done!</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
//             <p className="text-gray-600">Protect unlimited PDFs — no signup, no upload.</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Password Protect PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
//               <p className="text-gray-600 text-lg">Drop or select your document.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Enter Password</h4>
//               <p className="text-gray-600 text-lg">Type strong password to protect.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Download</h4>
//               <p className="text-gray-600 text-lg">Save password-protected PDF.</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Protect PDFs every day with PDF Linx — trusted by professionals for fast, secure, and completely free document protection.
//         </p>
//       </section>
//     </>
//   );
// }
