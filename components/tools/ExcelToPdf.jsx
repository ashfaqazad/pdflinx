// app/excel-pdf/page.js   (or excel-to-pdf/page.js)

"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, FileSpreadsheet } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";



export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an Excel file first");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert/excel-to-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
      } else {
        alert("Conversion failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Oops! Something went wrong. Please try again.");
      console.error(error);
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
      a.download = file ? file.name.replace(/\.(xlsx|xls)$/i, ".pdf") : "converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <>

      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}

      {/* HowTo Schema - Excel to PDF */}
      <Script
        id="howto-schema-excel-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Excel to PDF Online for Free",
            description: "Convert any Excel spreadsheet (XLSX, XLS) to PDF in seconds - completely free, no signup required.",
            url: "https://pdflinx.com/excel-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload Excel", text: "Click the upload area and select your .xlsx or .xls file." },
              { "@type": "HowToStep", name: "Convert to PDF", text: "Click 'Convert to PDF' and wait a few seconds." },
              { "@type": "HowToStep", name: "Download", text: "Download your perfectly formatted PDF file instantly." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      {/* Breadcrumb Schema - Excel to PDF */}
      <Script
        id="breadcrumb-schema-excel-to-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" }
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
              Excel to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got an Excel sheet you want to share as PDF? Drop it here – tables, formulas, charts stay perfect. Quick and totally free!
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleConvert} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {file ? file.name : "Drop your Excel file here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Supports .xlsx & .xls – layout stays perfect</p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
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
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button>
            </form>

            {/* Success State */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">All set!</p>
                <p className="text-base text-gray-700 mb-3">Your spreadsheet is now a crisp PDF</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            )}
          </div>

          {/* Footer Note */}
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
            Excel to PDF Online Free – Spreadsheets Made Shareable
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your Excel files into clean PDFs – tables, charts, formulas stay exactly as they are. Great for reports, invoices, or just sharing without worries. Fast and free on PDF Linx!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1 10h10l1-10h2M7 7v10m4-10v10m4-10v10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Everything Looks Perfect</h3>
            <p className="text-gray-600 text-sm">
              Tables, charts, formulas – your sheet stays beautiful in PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">XLS & XLSX Ready</h3>
            <p className="text-gray-600 text-sm">
              Works with any Excel file – even multi-sheet ones.
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
            Convert Excel to PDF in 3 Easy Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Sheet</h4>
              <p className="text-gray-600 text-sm">Drop your XLS or XLSX file here.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
              <p className="text-gray-600 text-sm">We keep the layout spot-on.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
              <p className="text-gray-600 text-sm">Your ready-to-share PDF is here!</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Thousands turn to PDF Linx daily to make Excel into perfect PDFs – fast, reliable, and always free.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Excel to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever needed to share an Excel spreadsheet but worried it’ll look different on someone else’s computer?
          Or maybe you want to lock down those formulas and formatting so nothing gets accidentally changed?
          That’s where our <span className="font-medium text-slate-900">PDFLinx Excel to PDF Converter</span> comes in.
          It’s a 100% free online tool that turns your Excel files (XLS or XLSX) into clean, professional PDFs in seconds—no installation, no watermarks, no fuss.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is Excel to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          Excel to PDF conversion takes your editable spreadsheet and transforms it into a fixed-layout PDF document.
          Everything—formulas, charts, tables, colors, and formatting—stays exactly as you designed it,
          no matter what device or software the recipient uses. It’s the perfect way to share reports, budgets, invoices, or data tables professionally.
        </p>

        {/* Why convert */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert Excel Files to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves all formatting, charts, colors, and grid lines perfectly</li>
          <li>Looks identical on any device—no missing fonts or shifted columns</li>
          <li>Protects your data and formulas from accidental edits</li>
          <li>Ideal for sharing financial reports, invoices, budgets, or dashboards</li>
          <li>Smaller file size and easier to print or archive</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert Excel to PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your Excel file (XLS or XLSX) – just drag & drop or click</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait a few seconds while we process it</li>
          <li>Download your perfect PDF instantly</li>
        </ol>

        <p className="mb-6">
          No registration, no watermark, no software needed—completely free and fast.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Excel to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online converter</li>
            <li>Supports XLS and XLSX formats</li>
            <li>Full preservation of charts & formulas</li>
            <li>High-quality, print-ready output</li>
            <li>Super-fast conversion</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – complete privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Accountants & Finance Teams:</strong> Share monthly reports and budgets securely</li>
          <li><strong>Business Owners:</strong> Send professional invoices and quotes</li>
          <li><strong>Students:</strong> Submit data analysis or project spreadsheets neatly</li>
          <li><strong>Analysts:</strong> Present dashboards and charts without formatting issues</li>
          <li><strong>Anyone with Excel:</strong> Lock in your hard work and share confidently</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes — completely safe. We take your privacy seriously.
          Your uploaded files are processed securely and automatically deleted from our servers shortly after conversion.
          We never store or share your documents.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert Excel to PDF Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works perfectly on Windows, macOS, Linux, Android, and iOS devices.
          All you need is a browser and an internet connection—turn any Excel spreadsheet into a polished PDF in just a few clicks.
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
                Is the Excel to PDF converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — totally free, no hidden charges or limits.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No — everything works directly in your browser.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will my charts and formatting be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. Tables, charts, colors, fonts, and layout are preserved with high accuracy.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — files are securely processed and deleted automatically after conversion.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert Excel to PDF on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! It works smoothly on mobile phones, tablets, and desktops.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Does it support older XLS files?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — both XLS and XLSX formats are fully supported.
              </p>
            </details>

          </div>
        </div>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PowerPoint to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever created a beautiful PowerPoint presentation and then worried it might look messed up on someone else’s computer?
          Missing fonts, broken animations, or shifted layouts—no thanks!
          That’s why we made the <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>.
          It’s a completely free online tool that turns your PPT or PPTX files into perfect, professional PDFs in seconds—no software needed, no watermarks, no stress.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PowerPoint to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PowerPoint to PDF conversion transforms your editable presentation slides into a fixed-layout PDF document.
          Every slide—text, images, animations (as static frames), charts, transitions, and formatting—stays exactly as you designed it.
          The result is a clean, shareable file that looks identical on any device, whether the viewer has PowerPoint or not.
        </p>

        {/* Why convert */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PowerPoint Files to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves slide layout, fonts, images, and design perfectly</li>
          <li>Looks the same on any device—no missing fonts or broken elements</li>
          <li>Protects your content from accidental edits</li>
          <li>Ideal for sharing presentations, handouts, or portfolios professionally</li>
          <li>Smaller file size and easier to print or email</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert PowerPoint to PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PowerPoint file (PPT or PPTX) – drag & drop or click to select</li>
          <li>Click the “Convert to PDF” button</li>
          <li>Wait just a few seconds while we process it</li>
          <li>Download your high-quality PDF instantly</li>
        </ol>

        <p className="mb-6">
          No account required, no watermark added, no installation—100% free and simple.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx PowerPoint to PDF Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>100% free online converter</li>
            <li>Supports PPT and PPTX formats</li>
            <li>Full slide design & layout preserved</li>
            <li>High-quality, print-ready PDFs</li>
            <li>Super-fast conversion speed</li>
            <li>Works on mobile & desktop</li>
            <li>No file storage – total privacy</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Teachers & Educators:</strong> Share lesson slides as clean handouts</li>
          <li><strong>Students:</strong> Submit assignments or project presentations neatly</li>
          <li><strong>Business Professionals:</strong> Send pitch decks or reports confidently</li>
          <li><strong>Trainers & Speakers:</strong> Distribute slide decks without formatting worries</li>
          <li><strong>Designers:</strong> Showcase portfolios in a universal format</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Absolutely safe. We value your privacy above everything.
          Your uploaded presentations are processed securely and automatically deleted from our servers right after conversion.
          We never store or share your files with anyone.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert PowerPoint to PDF Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works flawlessly on Windows, macOS, Linux, Android, and iOS.
          Just open your browser, upload your slides, and get a polished PDF in seconds—no matter where you are.
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
                Is the PowerPoint to PDF converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — completely free with no hidden fees or restrictions.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Do I need to install any software?
              </summary>
              <p className="mt-2 text-gray-600">
                No — it all happens directly in your browser.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Will my slides and animations be preserved?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! All text, images, layouts, fonts, and designs are preserved accurately.
                Animations appear as static frames in the correct order.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my files safe and private?
              </summary>
              <p className="mt-2 text-gray-600">
                100% safe — files are deleted automatically shortly after conversion.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I convert PowerPoint to PDF on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes! Works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Does it support older PPT files?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — both PPT and PPTX formats are fully supported.
              </p>
            </details>

          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="excel-to-pdf" />

    </>
  );
}























// // app/excel-pdf/page.js   (or excel-to-pdf/page.js)

// "use client";
// import { useState, useRef } from "react";
// import { Upload, Download, CheckCircle, FileSpreadsheet } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";



// export default function ExcelToPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/convert/excel-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Something went wrong. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file ? file.name.replace(/\.(xlsx|xls)$/i, ".pdf") : "converted.pdf";
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <>

// {/* ==================== PAGE-SPECIFIC SEO SCHEMAS (Safe for Next.js) ==================== */}

// {/* HowTo Schema - Excel to PDF */}
// <Script
//   id="howto-schema-excel-to-pdf"
//   type="application/ld+json"
//   strategy="afterInteractive"
//   dangerouslySetInnerHTML={{
//     __html: JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "HowTo",
//       name: "How to Convert Excel to PDF Online for Free",
//       description: "Convert any Excel spreadsheet (XLSX, XLS) to PDF in seconds - completely free, no signup required.",
//       url: "https://pdflinx.com/excel-pdf",
//       step: [
//         { "@type": "HowToStep", name: "Upload Excel", text: "Click the upload area and select your .xlsx or .xls file." },
//         { "@type": "HowToStep", name: "Convert to PDF", text: "Click 'Convert to PDF' and wait a few seconds." },
//         { "@type": "HowToStep", name: "Download", text: "Download your perfectly formatted PDF file instantly." }
//       ],
//       totalTime: "PT30S",
//       estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//       image: "https://pdflinx.com/og-image.png"
//     }, null, 2),
//   }}
// />

// {/* Breadcrumb Schema - Excel to PDF */}
// <Script
//   id="breadcrumb-schema-excel-to-pdf"
//   type="application/ld+json"
//   strategy="afterInteractive"
//   dangerouslySetInnerHTML={{
//     __html: JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "BreadcrumbList",
//       itemListElement: [
//         { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//         { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" }
//       ]
//     }, null, 2),
//   }}
// />


//       {/* ==================== UI EXACTLY SAME AS WORD TO PDF ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
//         <div className="max-w-2xl w-full">
//           {/* Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-4xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
//               Excel to PDF Online Converter (Free)
//             </h1>
//             <p className="text-xl text-gray-600">
//               Convert Excel (XLSX, XLS) to PDF online with perfect formatting — fast & free.
//             </p>
//           </div>

//           {/* Main Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
//             <form onSubmit={handleConvert} className="space-y-8">
//               {/* Upload Area - Same as Word to PDF */}
//               <div className="relative">
//                 <label className="block">
//                   <div className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//                     <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-blue-600" />
//                     <p className="text-xl font-semibold text-gray-700">
//                       {file ? file.name : "Drop Excel file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">Supports .xlsx, .xls • Excel to PDF conversion with perfect layout</p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Convert Button - Same gradient */}
//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-3"
//               >
//                 {loading ? (
//                   <>Converting your Excel...</>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={28} />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State - 100% same */}
//             {success && (
//               <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center animate-pulse">
//                 <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                 <p className="text-2xl font-bold text-green-700 mb-4">Excel Converted Successfully!</p>
//                 <p className="text-lg text-gray-700 mb-4">Your spreadsheet is now a perfect PDF</p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg flex items-center gap-3 mx-auto"
//                 >
//                   <Download size={28} />
//                   Download PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer Note */}
//           <div className="text-center mt-8 text-gray-600">
//             <p className="text-sm">
//               No signup • No watermark • 100% free • Files delete after 1 hour
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* ==================== UNIQUE SEO CONTENT SECTION - EXCEL TO PDF ==================== */}
//       <section className="mt-20 max-w-5xl mx-auto px-6 pb-16">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-[1.2] md:leading-[1.1]">
//             Excel to PDF Online Free - Convert Spreadsheets Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Convert Excel files (XLS, XLSX) to PDF in seconds while preserving tables, formulas, formatting, and layout. Perfect for reports, invoices, or sharing spreadsheets professionally.
//           </p>
//         </div>

//         {/* Benefits Grid - 3 Cards with Icons */}
//         <div className="grid md:grid-cols-3 gap-8 mb-20">
//           <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1 10h10l1-10h2M7 7v10m4-10v10m4-10v10" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Perfect Formatting Preserved</h3>
//             <p className="text-gray-600">
//               Tables, formulas, charts, and layout stay exactly as in your original Excel file.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Supports XLS & XLSX</h3>
//             <p className="text-gray-600">
//               Convert any Excel spreadsheet to PDF free – multiple sheets handled perfectly.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Secure & Free</h3>
//             <p className="text-gray-600">
//               Convert Excel to PDF instantly on any device. No signup, no watermark – files deleted after 1 hour.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-gray-100">
//           <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
//             How to Convert Excel to PDF in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-10">
//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Upload Excel File</h4>
//               <p className="text-gray-600">Drag & drop your XLS or XLSX spreadsheet</p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Click Convert</h4>
//               <p className="text-gray-600">We process and preserve all formatting</p>
//             </div>

//             <div className="text-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-xl font-semibold mb-3">Download PDF</h4>
//               <p className="text-gray-600">Get your professional PDF instantly!</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-12 text-lg text-gray-500 italic">
//           Convert Excel to PDF daily with confidence – trusted by thousands for perfect results at PDF Linx.
//         </p>
//       </section>
//     <RelatedToolsSection currentPage="excel-to-pdf" />

//     </>
//   );
// }




















// "use client";
// import { useState, useRef } from "react";

// export default function ExcelToPDF() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleConvert = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select an Excel file to convert.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     setDownloadUrl("");

//     try {
//       const res = await fetch("/api/convert/excel-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`HTTP ${res.status}: ${text}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//       } else {
//         alert("Conversion failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (error) {
//       console.error("Error converting Excel to PDF:", error);
//       alert("Error converting Excel to PDF: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };



// const handleDownload = async () => {
//   if (downloadUrl) {
//     try {
//       const response = await fetch(downloadUrl, {
//         headers: {
//           "Accept": "application/octet-stream", // Force binary download
//         },
//       });
//       if (!response.ok) throw new Error("Download failed");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file ? file.name.replace(/\.[^.]+$/, ".pdf") : "converted.pdf";
//       a.style.display = "none"; // Ensure link isn't visible
//       document.body.appendChild(a);
//       a.click();
//       // Immediate cleanup to prevent memory leaks
//       setTimeout(() => {
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       }, 100);
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("Failed to download file");
//     }
//   }
// };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       {/* Heading */}
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">Excel to PDF Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your Excel files (.xlsx, .xls) to PDF with high quality.
//         </p>
//       </div>

//       {/* Upload / Convert Form */}
//       <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="hidden"
//         />

//         {/* Select File Button */}
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
//         >
//           Select File
//         </button>

//         {/* File Info */}
//         <p className="text-gray-600">
//           {file ? `Selected File: ${file.name}` : "Select an Excel file to convert."}
//         </p>

//         {/* Convert Button */}
//         <form onSubmit={handleConvert}>
//           <button
//             type="submit"
//             className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Converting..." : "Convert to PDF"}
//           </button>
//         </form>

//         {/* Download Section */}
//         {downloadUrl && (
//           <div className="flex flex-col items-center space-y-4 mt-6">
//             <p className="text-lg font-semibold text-green-600">
//               ✅ Conversion Complete!
//             </p>
//             <button
//               onClick={handleDownload}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
//             >
//               Download PDF
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
