"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, Presentation } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";


export default function PptToPdf() {
  // ✅ Single + Multiple dono support (same input)
  const [files, setFiles] = useState([]); // 1 file ho to bhi array me 1 item
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null); // single pdf OR zip link
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  const isSingle = files.length === 1;
  const isMultiple = files.length > 1;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setSuccess(false);
    setDownloadUrl(null);
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!files.length) return alert("Please select a PowerPoint file (or multiple files) first!");

  //   setLoading(true);
  //   setDownloadUrl(null);
  //   setSuccess(false);

  //   const formData = new FormData();

  //   // ✅ Single + multiple (same loop) — field name "files"
  //   files.forEach((f) => formData.append("files", f));

  //   // optional hint
  //   formData.append("mode", isSingle ? "single" : "multiple");

  //   try {
  //     // 🔹 API call
  //     const res = await fetch("/convert/ppt-to-pdf", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     // safer: read JSON only if ok
  //     if (!res.ok) {
  //       const text = await res.text().catch(() => "");
  //       throw new Error(`Server error: ${res.status} ${text?.slice(0, 200)}`);
  //     }

  //     const data = await res.json();

  //     if (data.success) {
  //       // ✅ same pattern as excel: backend returns relative download path
  //       // recommended: backend returns "/converted/xxx.pdf" for single
  //       // and "/converted/xxx.zip" for multiple
  //       setDownloadUrl(`/api${data.download}`);
  //       setSuccess(true);

  //       // ✅ YE 8 LINES ADD KARO
  //       setTimeout(() => {
  //         const downloadSection = document.getElementById('download-section');
  //         if (downloadSection) {
  //           downloadSection.scrollIntoView({
  //             behavior: 'smooth',
  //             block: 'center'
  //           });
  //         }
  //       }, 300);

  //     } else {
  //       alert("Conversion failed: " + (data.error || "Unknown error"));
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     alert("Something went wrong, please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a PowerPoint file (or multiple files) first!");

    startProgress();        // ← setLoading(true) ki jagah

    setDownloadUrl(null);
    setSuccess(false);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("mode", isSingle ? "single" : "multiple");

    try {
      const res = await fetch("/convert/ppt-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        cancelProgress();     // ← error pe
        throw new Error(`Server error: ${res.status} ${text?.slice(0, 200)}`);
      }

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        completeProgress();   // ← setLoading(false) ki jagah

        setSuccess(true);

        // Scroll wali lines same rakhi
        setTimeout(() => {
          const downloadSection = document.getElementById('download-section');
          if (downloadSection) {
            downloadSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);

      } else {
        cancelProgress();     // ← error pe
        alert("Conversion failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      cancelProgress();       // ← catch pe
      console.error("Error:", err);
      alert("Something went wrong, please try again.");
    }
    // finally block hata diya — hook khud handle karta hai
  };


  const getDownloadName = () => {
    if (isSingle) {
      return files[0]?.name
        ? files[0].name.replace(/\.(ppt|pptx)$/i, ".pdf")
        : "converted.pdf";
    }
    return "pdflinx-ppt-to-pdf.zip";
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("File not found");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadName();
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed – file not ready yet. Try again in a few seconds.");
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
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PowerPoint to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert PPT or PPTX presentations to PDF in seconds. You can upload a single file or select multiple files together — slides preserved perfectly.",
              url: "https://pdflinx.com/ppt-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PowerPoint (single or multiple)",
                  text: "Drop your .ppt or .pptx file here — you can also select multiple files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Wait a few seconds for processing. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted PDF. For multiple files, you can download a ZIP containing all PDFs.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== MAIN TOOL ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              PowerPoint to PDF Converter <br /> Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PowerPoint presentations to PDF instantly — every slide, font,
              image, and layout stays exactly as designed. Upload a single PPT or
              PPTX file, or batch convert multiple presentations at once. Perfect for
              sharing decks, handouts, proposals, and portfolios. No signup, no
              watermark, completely free.
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />

                    <p className="text-lg font-semibold text-gray-700">
                      {files.length === 0
                        ? "Drop your PowerPoint file(s) here or click to upload"
                        : files.length === 1
                          ? files[0].name
                          : `${files.length} files selected (single + multiple upload supported)`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Only .ppt & .pptx files • Up to 100MB • Select 1 file or select multiple files at once
                    </p>

                    {/* Optional: list preview for multiple */}
                    {files.length > 1 && (
                      <div className="mt-3 text-xs text-gray-600 max-h-20 overflow-auto rounded-lg bg-white/60 border border-green-200 p-3">
                        <p className="font-semibold mb-2 text-gray-700">Selected files:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {files.slice(0, 10).map((f) => (
                            <li key={`${f.name}-${f.size}-${f.lastModified}`}>{f.name}</li>
                          ))}
                          {files.length > 10 && <li>...and {files.length - 10} more</li>}
                        </ul>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* <button
                type="submit"
                disabled={loading || files.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Converting... hang tight!</>
                ) : (
                  <>
                    <Presentation className="w-5 h-5" />
                    Convert to PDF
                  </>
                )}
              </button> */}

              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!files.length}
                icon={<Presentation className="w-5 h-5" />}     // ← PPT ke liye best icon (Presentation)
                label="Convert PPT to PDF"
                gradient="from-indigo-600 to-purple-600"        // ← PPT tool ke liye acha professional color
                type="button"
                onClick={handleSubmit}
              />

              {/* helper note */}
              <p className="text-center text-sm text-gray-500">
                ✅ Upload <span className="font-semibold text-gray-700">one PPT/PPTX</span> for a single PDF, or{" "}
                <span className="font-semibold text-gray-700">select multiple files</span> to convert in one go
                (recommended: download as ZIP).
              </p>
            </form>

            {/* Success State */}
            {success && (
              <div
                id="download-section"  // ✅ BAS YE EK LINE ADD KARO

                className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />

                <p className="text-xl font-bold text-green-700 mb-3">
                  {isSingle ? "Done! Your PDF is ready" : "Done! Your ZIP is ready"}
                </p>

                <p className="text-gray-600 mb-4">
                  {isSingle ? (
                    <>All slides and formatting preserved perfectly.</>
                  ) : (
                    <>
                      Your <span className="font-semibold">{files.length}</span> presentations are converted. Download the ZIP to
                      get all PDFs together.
                    </>
                  )}
                </p>

                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
                >
                  <Download className="w-5 h-5" />
                  {isSingle ? "Download PDF" : "Download ZIP"}
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single & batch conversion • Works on Windows, Mac, Android & iOS
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            PowerPoint to PDF Online Free – Convert PPT & PPTX to PDF in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to share a presentation that looks identical on every device?
            Convert PPT or PPTX to PDF here — slides, fonts, images, and layouts
            stay pixel-perfect. Upload a single file or batch convert multiple
            presentations at once. Fast, free, and privacy-friendly on PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Presentation className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Slides Stay Perfect</h3>
            <p className="text-gray-600 text-sm">
              Fonts, images, layouts, and slide designs are preserved exactly —
              your presentation looks identical after converting to PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
            <p className="text-gray-600 text-sm">
              Works with both old PPT and modern PPTX formats — including
              presentations with embedded images, charts, and custom fonts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one presentation or multiple files at once. Single file
              downloads as PDF directly. Multiple files download as a ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert PowerPoint to PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Presentation(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PPT or PPTX file, or upload multiple presentations at
                once for batch conversion. Drag and drop supported.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Click Convert to PDF</h4>
              <p className="text-gray-600 text-sm">
                Hit Convert and wait a few seconds. Every slide, font, and image
                is preserved automatically in the output PDF.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download PDF or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as a clean PDF instantly. Multiple files
                are packaged into a ZIP with all converted PDFs inside.
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
            After converting PowerPoint to PDF, these tools can help you organize and share your document.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/merge-pdf" className="text-purple-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine your presentation PDF with other documents into one file.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-purple-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce the converted PDF file size for easy email sharing.</span>
            </li>
            <li>
              <a href="/word-to-pdf" className="text-purple-700 font-semibold hover:underline">
                Word to PDF
              </a>{" "}
              <span className="text-slate-600">— convert Word documents to PDF alongside your presentations.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-purple-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to convert PowerPoint
          presentations to PDF — fast, reliable, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PowerPoint to PDF Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Created a polished PowerPoint presentation but worried it will look
          broken on someone else's device — missing fonts, shifted layouts, or
          broken images? The{" "}
          <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>{" "}
          turns PPT and PPTX files into professional, fixed-layout PDFs in
          seconds — every slide preserved exactly as designed. No software
          installation, no watermarks, no sign-up required.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PowerPoint to PDF Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PowerPoint to PDF conversion transforms your editable presentation
          into a fixed-layout PDF document. Every slide — text, images, charts,
          backgrounds, and custom fonts — stays exactly as you designed it,
          regardless of what device or software the recipient uses. PDFs are
          universally compatible and open identically on Windows, macOS,
          Android, and iOS without requiring Microsoft PowerPoint.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PowerPoint Files to PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Preserves slide layouts, fonts, images, and design perfectly</li>
          <li>Opens identically on every device — no missing fonts or broken elements</li>
          <li>Protects presentation content from accidental edits — read-only format</li>
          <li>Print-ready output — consistent slide layout for handouts and printing</li>
          <li>Professional format for sharing decks, proposals, and portfolios</li>
          <li>Required format for many submission portals and client deliverables</li>
          <li>Smaller file size than PPTX for easy email sharing and uploading</li>
          <li>Batch convert multiple presentations to PDF simultaneously</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              PPT vs PPTX — Which Format Converts Better?
            </h3>
            <p className="leading-7">
              <strong>PPTX</strong> is the modern PowerPoint format introduced
              with Microsoft Office 2007 and generally converts to PDF with
              higher accuracy — better support for custom fonts, embedded images,
              animations as static frames, and complex slide layouts.{" "}
              <strong>PPT</strong> is the older format and also fully supported,
              but PPTX to PDF conversion tends to produce the cleanest output for
              presentations with advanced design. If you have a choice, save your
              file as PPTX before converting.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              What Happens to Animations When Converting to PDF?
            </h3>
            <p className="leading-7">
              PDF is a static format — animations and transitions cannot be
              preserved in a PDF. Each animated slide appears as a{" "}
              <strong>static frame</strong> in the converted PDF, showing the
              slide in its final state. All text, images, and design elements
              remain fully visible and correctly positioned. If animations are
              important, consider sharing the original PPTX file alongside the
              PDF for presentations where interactivity matters.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PowerPoint to PDF Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Business presentations and proposals:</strong> Convert
                client-facing decks and business proposals to PDF to ensure
                consistent formatting across all devices and email clients.
              </li>
              <li>
                <strong>Academic presentations:</strong> Convert university
                assignment slides, seminar presentations, and thesis defenses to
                PDF for submission to portals that require PDF format.
              </li>
              <li>
                <strong>Handouts and printed materials:</strong> Convert
                presentation slides to PDF for printing as handouts, training
                materials, or conference takeaways.
              </li>
              <li>
                <strong>Portfolio sharing:</strong> Convert design portfolios,
                creative decks, and lookbooks from PPTX to PDF for professional
                distribution to clients or employers.
              </li>
              <li>
                <strong>Training and e-learning:</strong> Convert training
                presentations to PDF for distribution as course materials or
                reference documents.
              </li>
              <li>
                <strong>Investor decks and pitch presentations:</strong> Convert
                pitch decks to PDF for sending to investors, partners, or
                accelerator programs that require PDF submissions.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PowerPoint to PDF Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple presentations at once? Upload multiple PPT
              or PPTX files simultaneously. The tool converts all files and
              delivers them as a <strong>ZIP download</strong> containing
              individual PDFs — ideal for batch processing training decks,
              quarterly presentations, or client proposal sets. Single file
              uploads download as a PDF directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After batch conversion, to combine the PDFs into one document use
              the{" "}
              <a href="/merge-pdf" className="text-purple-700 font-medium hover:underline">
                Merge PDF tool
              </a>
              . To reduce file size before emailing, use{" "}
              <a href="/compress-pdf" className="text-purple-700 font-medium hover:underline">
                Compress PDF
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded
              PowerPoint files are processed securely and{" "}
              <strong>permanently deleted after conversion</strong> — never
              stored long-term, never shared with third parties, and never used
              for any other purpose. No account creation is required — no email,
              no password, no personal data collected. Your presentations and
              confidential slide content remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert PowerPoint to PDF on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no Microsoft PowerPoint
              required on the recipient's device. Whether you are at your desk,
              on a laptop, or on your phone, you can convert presentations to PDF
              in seconds. Fully responsive with drag-and-drop file upload
              supported on all devices.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PowerPoint to PDF Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PowerPoint to PDF converter — no hidden fees</li>
            <li>Supports PPT and PPTX file formats</li>
            <li>Slide layouts, fonts, and images fully preserved</li>
            <li>Animations appear as static frames in PDF output</li>
            <li>Batch conversion — multiple files at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>High-quality, print-ready PDF output</li>
            <li>Fast processing — conversion in seconds</li>
            <li>No watermark added to converted files</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after conversion — privacy protected</li>
            <li>No signup or account required</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Convert university assignment slides, seminar presentations, and thesis defenses to PDF for submission</li>
          <li><strong>Professionals:</strong> Share business proposals, client decks, and meeting presentations as read-only PDFs</li>
          <li><strong>Designers:</strong> Convert portfolio decks and creative presentations to PDF for professional distribution</li>
          <li><strong>Businesses:</strong> Convert training materials, investor decks, and company presentations to PDF</li>
          <li><strong>Teachers:</strong> Distribute lecture slides and course materials as PDF handouts</li>
          <li><strong>Anyone:</strong> Convert any PowerPoint presentation to PDF for reliable, cross-device sharing</li>
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
                q: "Is the PowerPoint to PDF converter free to use?",
                a: "Yes. PDFLinx PowerPoint to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no Microsoft PowerPoint required, no plugins needed.",
              },
              {
                q: "Will my slide layouts and fonts be preserved after conversion?",
                a: "Yes. Slide layouts, fonts, images, backgrounds, and design elements are all preserved accurately in the converted PDF.",
              },
              {
                q: "What happens to animations when converting to PDF?",
                a: "PDF is a static format — animations and transitions cannot be preserved. Each animated slide appears as a static frame showing the slide in its final state. All text and images remain fully visible.",
              },
              {
                q: "Can I convert multiple PowerPoint files to PDF at once?",
                a: "Yes. Upload multiple PPT or PPTX files simultaneously. All converted PDFs are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one PowerPoint file?",
                a: "Single file uploads convert and download directly as a PDF — no ZIP file, no extra steps.",
              },
              {
                q: "What is the difference between PPT and PPTX?",
                a: "PPT is the older Microsoft PowerPoint format. PPTX is the modern format introduced with Office 2007. Both are supported, but PPTX generally converts with higher accuracy for presentations with advanced design and custom fonts.",
              },
              {
                q: "Are my uploaded PowerPoint files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert PowerPoint to PDF on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
              {
                q: "Can I combine the converted presentation PDFs into one document?",
                a: "Yes. After converting, use the Merge PDF tool on PDF Linx to combine multiple converted PDFs into one organized document.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-purple-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="ppt-to-pdf" />

    </>
  );
}



























// "use client";
// import { useState } from "react";
// import { Upload, FileText, Download, CheckCircle, Presentation } from "lucide-react";
// import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// export default function PptToPdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [success, setSuccess] = useState(false);



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PowerPoint file first!");

//     setLoading(true);
//     setDownloadUrl(null);
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // 🔹 API call
//       const res = await fetch("/api/convert/ppt-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Server error: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         // 🔹 backend jo path de, wahi use karo (BEST)
//         setDownloadUrl(data.download || `/converted/${data.filename}`);
//         setSuccess(true);
//       } else {
//         alert("Conversion failed: " + (data.error || "Unknown error"));
//       }
//     }
//     catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;

//     try {
//       const response = await fetch(downloadUrl);
//       if (!response.ok) throw new Error("File not found");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.(ppt|pptx)$/i, ".pdf");
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Download failed – file not ready yet. Try again in a few seconds.");
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
//             name: "How to Convert PowerPoint to PDF Online for Free",
//             description: "Convert PPT or PPTX presentations to PDF in seconds – formatting, animations, and slides preserved perfectly.",
//             url: "https://pdflinx.com/ppt-to-pdf",
//             step: [
//               { "@type": "HowToStep", name: "Upload PowerPoint", text: "Drop your .ppt or .pptx file here." },
//               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
//               { "@type": "HowToStep", name: "Download PDF", text: "Get your ready-to-share PDF instantly." },
//             ],
//             totalTime: "PT30S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png",
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
//             ],
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//               PowerPoint to PDF Converter <br /> Online (Free)
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Got a presentation that needs to be shared safely? Drop your PPT or PPTX here – we’ll turn it into a perfect PDF with all slides, animations, and formatting intact. No sign-up, no watermark!
//             </p>
//           </div>

//           {/* Upload Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <label className="block">
//                   <div
//                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
//                       }`}
//                   >
//                     <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />
//                     <p className="text-lg font-semibold text-gray-700">
//                       {file ? file.name : "Drop your PowerPoint file here or click to upload"}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Only .ppt & .pptx files • Up to 100MB
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || !file}
//                 className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>Converting... hang tight!</>
//                 ) : (
//                   <>
//                     {/* <FilePresentation className="w-5 h-5" /> */}
//                     <Presentation className="w-5 h-5" />
//                     Convert to PDF
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success State */}
//             {success && (
//               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                 <p className="text-xl font-bold text-green-700 mb-3">
//                   Done! Your PDF is ready
//                 </p>
//                 <p className="text-gray-600 mb-4">
//                   All slides, formatting, and animations preserved perfectly
//                 </p>
//                 <button
//                   onClick={handleDownload}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download PDF
//                 </button>
//               </div>
//             )}
//           </div>

//           <p className="text-center mt-6 text-gray-600 text-base">
//             No account • No watermark • Files gone after 1 hour • Completely free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             PowerPoint to PDF Online Free – Preserve Your Slides Perfectly
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Convert PPT or PPTX presentations to PDF without losing formatting, animations, fonts, or layout. Ideal for sharing slides safely – fast and always free on PDF Linx!
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               {/* <FilePresentation className="w-8 h-8 text-white" /> */}
//               <Presentation className="w-12 h-12 text-green-600 mx-auto mb-3" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect Slides</h3>
//             <p className="text-gray-600 text-sm">
//               Layout, animations, images, and text stay exactly the same
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
//             <p className="text-gray-600 text-sm">
//               Works with old and new PowerPoint files – no issues
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
//             <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-white" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Secure</h3>
//             <p className="text-gray-600 text-sm">
//               Instant conversion, no signup, files deleted after 1 hour
//             </p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
//           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
//             Convert PowerPoint to PDF in 3 Easy Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 1
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Upload Presentation</h4>
//               <p className="text-gray-600 text-sm">Drop your PPT or PPTX file here</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 2
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
//               <p className="text-gray-600 text-sm">We preserve every detail perfectly</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
//                 3
//               </div>
//               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
//               <p className="text-gray-600 text-sm">Share your slides safely!</p>
//             </div>
//           </div>
//         </div>

//         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
//           Thousands use PDF Linx daily to convert presentations to PDF – reliable, fast, and always free.
//         </p>
//       </section>


//       <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
//         {/* Heading */}
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
//           PowerPoint to PDF Converter – Free Online Tool by PDFLinx
//         </h2>

//         {/* Intro */}
//         <p className="text-base leading-7 mb-6">
//           Ever created a beautiful PowerPoint presentation and then worried it might look messed up on someone else’s computer?
//           Missing fonts, broken animations, or shifted layouts—no thanks!
//           That’s why we made the <span className="font-medium text-slate-900">PDFLinx PowerPoint to PDF Converter</span>.
//           It’s a completely free online tool that turns your PPT or PPTX files into perfect, professional PDFs in seconds—no software needed, no watermarks, no stress.
//         </p>

//         {/* What is */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           What is PowerPoint to PDF Conversion?
//         </h3>
//         <p className="leading-7 mb-6">
//           PowerPoint to PDF conversion transforms your editable presentation slides into a fixed-layout PDF document.
//           Every slide—text, images, animations (as static frames), charts, transitions, and formatting—stays exactly as you designed it.
//           The result is a clean, shareable file that looks identical on any device, whether the viewer has PowerPoint or not.
//         </p>

//         {/* Why convert */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Why Convert PowerPoint Files to PDF?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li>Preserves slide layout, fonts, images, and design perfectly</li>
//           <li>Looks the same on any device—no missing fonts or broken elements</li>
//           <li>Protects your content from accidental edits</li>
//           <li>Ideal for sharing presentations, handouts, or portfolios professionally</li>
//           <li>Smaller file size and easier to print or email</li>
//         </ul>

//         {/* Steps */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           How to Convert PowerPoint to PDF Online
//         </h3>
//         <ol className="space-y-2 mb-6 list-decimal pl-6">
//           <li>Upload your PowerPoint file (PPT or PPTX) – drag & drop or click to select</li>
//           <li>Click the “Convert to PDF” button</li>
//           <li>Wait just a few seconds while we process it</li>
//           <li>Download your high-quality PDF instantly</li>
//         </ol>

//         <p className="mb-6">
//           No account required, no watermark added, no installation—100% free and simple.
//         </p>

//         {/* Features box */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
//           <h3 className="text-xl font-semibold text-slate-900 mb-4">
//             Features of PDFLinx PowerPoint to PDF Converter
//           </h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
//             <li>100% free online converter</li>
//             <li>Supports PPT and PPTX formats</li>
//             <li>Full slide design & layout preserved</li>
//             <li>High-quality, print-ready PDFs</li>
//             <li>Super-fast conversion speed</li>
//             <li>Works on mobile & desktop</li>
//             <li>No file storage – total privacy</li>
//           </ul>
//         </div>

//         {/* Audience */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Who Should Use This Tool?
//         </h3>
//         <ul className="space-y-2 mb-6 list-disc pl-6">
//           <li><strong>Teachers & Educators:</strong> Share lesson slides as clean handouts</li>
//           <li><strong>Students:</strong> Submit assignments or project presentations neatly</li>
//           <li><strong>Business Professionals:</strong> Send pitch decks or reports confidently</li>
//           <li><strong>Trainers & Speakers:</strong> Distribute slide decks without formatting worries</li>
//           <li><strong>Designers:</strong> Showcase portfolios in a universal format</li>
//         </ul>

//         {/* Safety */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Is PDFLinx Safe to Use?
//         </h3>
//         <p className="leading-7 mb-6">
//           Absolutely safe. We value your privacy above everything.
//           Your uploaded presentations are processed securely and automatically deleted from our servers right after conversion.
//           We never store or share your files with anyone.
//         </p>

//         {/* Closing */}
//         <h3 className="text-xl font-semibold text-slate-900 mb-3">
//           Convert PowerPoint to PDF Anytime, Anywhere
//         </h3>
//         <p className="leading-7">
//           PDFLinx works flawlessly on Windows, macOS, Linux, Android, and iOS.
//           Just open your browser, upload your slides, and get a polished PDF in seconds—no matter where you are.
//         </p>
//       </section>


//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4">

//           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Is the PowerPoint to PDF converter free to use?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — completely free with no hidden fees or restrictions.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Do I need to install any software?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 No — it all happens directly in your browser.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Will my slides and animations be preserved?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! All text, images, layouts, fonts, and designs are preserved accurately.
//                 Animations appear as static frames in the correct order.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Are my files safe and private?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 100% safe — files are deleted automatically shortly after conversion.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Can I convert PowerPoint to PDF on my phone?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes! Works perfectly on mobile phones, tablets, and desktops.
//               </p>
//             </details>

//             <details className="bg-white rounded-lg shadow-sm p-5">
//               <summary className="font-semibold cursor-pointer">
//                 Does it support older PPT files?
//               </summary>
//               <p className="mt-2 text-gray-600">
//                 Yes — both PPT and PPTX formats are fully supported.
//               </p>
//             </details>

//           </div>
//         </div>
//       </section>
//     </>
//   );
// }






















// // "use client";
// // import { useState } from "react";
// // import { Upload, FileText, Download, CheckCircle, Presentation } from "lucide-react";
// // import Script from "next/script";
// // import RelatedToolsSection from "@/components/RelatedTools";

// // export default function PptToPdf() {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file) return alert("Please select a PowerPoint file first!");

// //     setLoading(true);
// //     setDownloadUrl(null);
// //     setSuccess(false);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await fetch("/convert/ppt-to-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         setDownloadUrl(`/converted/${data.filename}`);
// //         setSuccess(true);
// //       } else {
// //         alert("Conversion failed: " + (data.error || "Unknown error"));
// //       }
// //     } catch (err) {
// //       alert("Something went wrong, please try again.");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = () => {
// //     if (!downloadUrl) return;
// //     const link = document.createElement("a");
// //     link.href = downloadUrl;
// //     link.download = file.name.replace(/\.(ppt|pptx)$/i, ".pdf");
// //     link.click();
// //   };

// //   return (
// //     <>
// //       {/* ==================== SEO SCHEMAS ==================== */}
// //       <Script
// //         id="howto-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Convert PowerPoint to PDF Online for Free",
// //             description: "Convert PPT or PPTX presentations to PDF in seconds – formatting, animations, and slides preserved perfectly.",
// //             url: "https://pdflinx.com/ppt-to-pdf",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PowerPoint", text: "Drop your .ppt or .pptx file here." },
// //               { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds for processing." },
// //               { "@type": "HowToStep", name: "Download PDF", text: "Get your ready-to-share PDF instantly." },
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png",
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
// //             ],
// //           }, null, 2),
// //         }}
// //       />

// //       {/* ==================== MAIN TOOL ==================== */}
// //       <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
// //               PowerPoint to PDF Converter <br /> Online (Free)
// //             </h1>
// //             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //               Got a presentation that needs to be shared safely? Drop your PPT or PPTX here – we’ll turn it into a perfect PDF with all slides, animations, and formatting intact. No sign-up, no watermark!
// //             </p>
// //           </div>

// //           {/* Upload Card */}
// //           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="relative">
// //                 <label className="block">
// //                   <div
// //                     className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
// //                       ? "border-green-500 bg-green-50"
// //                       : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
// //                       }`}
// //                   >
// //                     <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />
// //                     <p className="text-lg font-semibold text-gray-700">
// //                       {file ? file.name : "Drop your PowerPoint file here or click to upload"}
// //                     </p>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       Only .ppt & .pptx files • Up to 100MB
// //                     </p>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
// //                     onChange={(e) => setFile(e.target.files?.[0] || null)}
// //                     className="hidden"
// //                     required
// //                   />
// //                 </label>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading || !file}
// //                 className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
// //               >
// //                 {loading ? (
// //                   <>Converting... hang tight!</>
// //                 ) : (
// //                   <>
// //                     {/* <FilePresentation className="w-5 h-5" /> */}
// //                     <Presentation className="w-5 h-5" />
// //                     Convert to PDF
// //                   </>
// //                 )}
// //               </button>
// //             </form>

// //             {/* Success State */}
// //             {success && (
// //               <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
// //                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //                 <p className="text-xl font-bold text-green-700 mb-3">
// //                   Done! Your PDF is ready
// //                 </p>
// //                 <p className="text-gray-600 mb-4">
// //                   All slides, formatting, and animations preserved perfectly
// //                 </p>
// //                 <button
// //                   onClick={handleDownload}
// //                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2 mx-auto text-base"
// //                 >
// //                   <Download className="w-5 h-5" />
// //                   Download PDF
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           <p className="text-center mt-6 text-gray-600 text-base">
// //             No account • No watermark • Files gone after 1 hour • Completely free
// //           </p>
// //         </div>
// //       </main>

// //       {/* ==================== SEO CONTENT SECTION ==================== */}
// //       <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
// //         <div className="text-center mb-12">
// //           <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
// //             PowerPoint to PDF Online Free – Preserve Your Slides Perfectly
// //           </h2>
// //           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
// //             Convert PPT or PPTX presentations to PDF without losing formatting, animations, fonts, or layout. Ideal for sharing slides safely – fast and always free on PDF Linx!
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-8 mb-16">
// //           <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               {/* <FilePresentation className="w-8 h-8 text-white" /> */}
// //               <Presentation className="w-12 h-12 text-green-600 mx-auto mb-3" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Perfect Slides</h3>
// //             <p className="text-gray-600 text-sm">
// //               Layout, animations, images, and text stay exactly the same
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <CheckCircle className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">PPT & PPTX Supported</h3>
// //             <p className="text-gray-600 text-sm">
// //               Works with old and new PowerPoint files – no issues
// //             </p>
// //           </div>

// //           <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-lg border border-pink-100 text-center hover:shadow-xl transition">
// //             <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <Download className="w-8 h-8 text-white" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Secure</h3>
// //             <p className="text-gray-600 text-sm">
// //               Instant conversion, no signup, files deleted after 1 hour
// //             </p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
// //           <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
// //             Convert PowerPoint to PDF in 3 Easy Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-8">
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 1
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Upload Presentation</h4>
// //               <p className="text-gray-600 text-sm">Drop your PPT or PPTX file here</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 2
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Hit Convert</h4>
// //               <p className="text-gray-600 text-sm">We preserve every detail perfectly</p>
// //             </div>
// //             <div className="text-center">
// //               <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
// //                 3
// //               </div>
// //               <h4 className="text-lg font-semibold mb-2">Download PDF</h4>
// //               <p className="text-gray-600 text-sm">Share your slides safely!</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
// //           Thousands use PDF Linx daily to convert presentations to PDF – reliable, fast, and always free.
// //         </p>
// //       </section>

// //       <RelatedToolsSection currentPage="ppt-to-pdf" />
// //     </>
// //   );
// // }