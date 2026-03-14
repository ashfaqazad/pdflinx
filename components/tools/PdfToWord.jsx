// app/pdf-to-word/page.js

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";


// export default function PdfToWord() {
export default function PdfToWord({ seo }) {

  const [files, setFiles] = useState([]); // ✅ multiple PDFs
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // const [progress, setProgress] = useState(0);
  const [enableOcr, setEnableOcr] = useState(false);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  // ✅ only for ZIP downloads (multiple files)
  const [downloadUrl, setDownloadUrl] = useState(null);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!files.length) return alert("Please select at least one PDF file");

  //   setLoading(true);
  //   setSuccess(false);
  //   setError("");
  //   setProgress(0);

  //   const formData = new FormData();
  //   files.forEach((f) => formData.append("files", f));
  //   formData.append("enable_ocr", enableOcr ? "1" : "0");

  //   const pollIntervalMs = 1500;
  //   const maxWaitMs = 15 * 60 * 1000;
  //   const startedAt = Date.now();

  //   // Helper: fetch JSON with better errors
  //   const fetchJson = async (url, options) => {
  //     const r = await fetch(url, { cache: "no-store", ...options });
  //     const ct = r.headers.get("content-type") || "";
  //     let payload = null;

  //     if (ct.includes("json")) {
  //       try { payload = await r.json(); } catch { }
  //     }

  //     if (!r.ok) {
  //       const msg =
  //         payload?.detail || payload?.error || `Request failed ${r.status} ${r.statusText}`;
  //       const err = new Error(msg);
  //       err.status = r.status;
  //       err.payload = payload;
  //       throw err;
  //     }

  //     return payload ?? {};
  //   };

  //   // Helper: download file as blob (safer than window.location.href)
  //   const downloadViaBlob = async (url, filenameFallback) => {
  //     const r = await fetch(url, { cache: "no-store" });
  //     if (!r.ok) throw new Error(`Download failed ${r.status}`);

  //     const blob = await r.blob();
  //     const urlObj = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = urlObj;

  //     // Try filename from header if present
  //     const cd = r.headers.get("content-disposition") || "";
  //     const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
  //     const filename = match ? decodeURIComponent(match[1]) : filenameFallback;

  //     a.download = filename || "pdflinx-download";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     URL.revokeObjectURL(urlObj);
  //   };

  //   // Try /api first (Next/Python), fallback to /convert (Node) if 404
  //   const getJobStatus = async (jobId) => {
  //     try {
  //       return await fetchJson(`/api/convert/job/${jobId}`);
  //     } catch (err) {
  //       if (err?.status === 404) {
  //         return await fetchJson(`/convert/job/${jobId}`);
  //       }
  //       throw err;
  //     }
  //   };

  //   const downloadResult = async (jobId) => {
  //     // same fallback logic
  //     try {
  //       await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
  //     } catch (err) {
  //       if (err?.message?.includes("404")) {
  //         await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
  //         return;
  //       }
  //       // if API download failed for non-404, try convert once as well
  //       try {
  //         await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
  //       } catch {
  //         throw err;
  //       }
  //     }
  //   };


  //   // Poll using setTimeout to avoid overlapping async calls
  //   let stopped = false;
  //   const poll = async (jobId) => {
  //     if (stopped) return;

  //     if (Date.now() - startedAt > maxWaitMs) {
  //       setLoading(false);
  //       setError("Conversion timeout. Please try again.");
  //       return;
  //     }

  //     try {
  //       const statusData = await getJobStatus(jobId);

  //       const status = statusData?.status;
  //       if (status === "queued") {
  //         setProgress(0);
  //       } else if (status === "processing") {
  //         setProgress(statusData?.progress ?? 10);

  //       } else if (status === "done") {
  //         setProgress(100);
  //         setFiles([]);
  //         await downloadResult(jobId);  // pehle download
  //         setSuccess(true);             // tab success message
  //         setLoading(false);
  //         return;

  //       } else if (status === "failed") {
  //         setLoading(false);
  //         setError(statusData?.error || "Conversion failed on server");
  //         return;
  //       } else {
  //         // unknown status
  //         setProgress((p) => Math.max(p, 5));
  //       }

  //       setTimeout(() => poll(jobId), pollIntervalMs);
  //     } catch (err) {
  //       setLoading(false);
  //       setError(err?.message || "Polling failed");
  //     }
  //   };

  //   try {
  //     const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
  //     // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/pdf-to-word`, { method: "POST", body: formData });
  //     const ct = res.headers.get("content-type") || "";

  //     if (!res.ok) {
  //       let msg = `Server error ${res.status}`;
  //       if (ct.includes("json")) {
  //         try {
  //           const err = await res.json();
  //           msg = err.detail || err.error || msg;
  //         } catch { }
  //       }
  //       throw new Error(msg);
  //     }

  //     // CASE A: ZIP directly
  //     if (ct.includes("application/zip") || ct.includes("zip")) {
  //       const blob = await res.blob();
  //       const url = URL.createObjectURL(blob);

  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "pdflinx-pdf-to-word.zip";
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       URL.revokeObjectURL(url);

  //       setProgress(100);
  //       setSuccess(true);
  //       setFiles([]);
  //       setLoading(false);
  //       return;
  //     }

  //     // CASE B: JSON job
  //     if (!ct.includes("json")) {
  //       throw new Error(`Unexpected response type: ${ct}`);
  //     }

  //     const data = await res.json();
  //     const jobId = data?.jobId;
  //     if (!jobId) throw new Error("Job ID not received from server");

  //     // start polling
  //     poll(jobId);
  //   } catch (err) {
  //     stopped = true;
  //     setLoading(false);
  //     setError(err?.message || "Something went wrong");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select at least one PDF file");

    startProgress();        // ← setLoading(true) + setProgress(0) ki jagah
    setSuccess(false);
    setError("");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("enable_ocr", enableOcr ? "1" : "0");

    const pollIntervalMs = 1500;
    const maxWaitMs = 15 * 60 * 1000;
    const startedAt = Date.now();

    // Helper: fetch JSON with better errors
    const fetchJson = async (url, options) => {
      const r = await fetch(url, { cache: "no-store", ...options });
      const ct = r.headers.get("content-type") || "";
      let payload = null;

      if (ct.includes("json")) {
        try { payload = await r.json(); } catch { }
      }

      if (!r.ok) {
        const msg =
          payload?.detail || payload?.error || `Request failed ${r.status} ${r.statusText}`;
        const err = new Error(msg);
        err.status = r.status;
        err.payload = payload;
        throw err;
      }

      return payload ?? {};
    };

    // Helper: download file as blob
    const downloadViaBlob = async (url, filenameFallback) => {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`Download failed ${r.status}`);

      const blob = await r.blob();
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;

      const cd = r.headers.get("content-disposition") || "";
      const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
      const filename = match ? decodeURIComponent(match[1]) : filenameFallback;

      a.download = filename || "pdflinx-download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);
    };

    const getJobStatus = async (jobId) => {
      try {
        return await fetchJson(`/api/convert/job/${jobId}`);
      } catch (err) {
        if (err?.status === 404) {
          return await fetchJson(`/convert/job/${jobId}`);
        }
        throw err;
      }
    };

    const downloadResult = async (jobId) => {
      try {
        await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
      } catch (err) {
        if (err?.message?.includes("404")) {
          await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
          return;
        }
        try {
          await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
        } catch {
          throw err;
        }
      }
    };

    let stopped = false;
    const poll = async (jobId) => {
      if (stopped) return;

      if (Date.now() - startedAt > maxWaitMs) {
        cancelProgress();     // ← setLoading(false) ki jagah
        setError("Conversion timeout. Please try again.");
        return;
      }

      try {
        const statusData = await getJobStatus(jobId);
        const status = statusData?.status;

        if (status === "queued") {
          // progress bar apna kaam kar raha hai, kuch nahi karna
        } else if (status === "processing") {
          // hook ka progress chal raha hai, override nahi karna

        } else if (status === "done") {
          setFiles([]);
          await downloadResult(jobId);
          completeProgress();   // ← setProgress(100) + setLoading(false) ki jagah
          setSuccess(true);
          return;

        } else if (status === "failed") {
          cancelProgress();     // ← setLoading(false) ki jagah
          setError(statusData?.error || "Conversion failed on server");
          return;
        }

        setTimeout(() => poll(jobId), pollIntervalMs);
      } catch (err) {
        cancelProgress();       // ← setLoading(false) ki jagah
        setError(err?.message || "Polling failed");
      }
    };

    try {
      const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok) {
        let msg = `Server error ${res.status}`;
        if (ct.includes("json")) {
          try {
            const err = await res.json();
            msg = err.detail || err.error || msg;
          } catch { }
        }
        throw new Error(msg);
      }

      // CASE A: ZIP directly
      if (ct.includes("application/zip") || ct.includes("zip")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "pdflinx-pdf-to-word.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        completeProgress();   // ← setProgress(100) + setLoading(false) ki jagah
        setSuccess(true);
        setFiles([]);
        return;
      }

      // CASE B: JSON job
      if (!ct.includes("json")) {
        throw new Error(`Unexpected response type: ${ct}`);
      }

      const data = await res.json();
      const jobId = data?.jobId;
      if (!jobId) throw new Error("Job ID not received from server");

      poll(jobId);

    } catch (err) {
      stopped = true;
      cancelProgress();         // ← setLoading(false) ki jagah
      setError(err?.message || "Something went wrong");
    }
  };

  // ✅ Only for ZIP downloads (multiple PDFs)
  const handleDownloadZip = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-pdf-to-word.zip";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("There was a problem with the download.");
      console.error(err);
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
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PDF to Word Online for Free",
              description:
                "Convert one or multiple PDF files into editable Word (DOCX) in seconds with PDFLinx — free, fast, and no signup required.",
              url: "https://pdflinx.com/pdf-to-word",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF File(s)",
                  text: "Upload a single PDF or select multiple PDFs at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press 'Convert to Word' and wait a few seconds while we process your file(s).",
                },
                {
                  "@type": "HowToStep",
                  name: "Download DOCX (or ZIP)",
                  text: "Single file downloads as DOCX. Multiple files download as a ZIP containing all DOCX files.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              tool: [{ "@type": "HowToTool", name: "PDFLinx PDF to Word Converter" }],
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      {/* Breadcrumb Schema - PDF to Word */}
      <Script
        id="breadcrumb-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PDF to Word", item: "https://pdflinx.com/pdf-to-word" },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-pdf-to-word"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is the PDF to Word converter free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. PDFLinx provides a completely free PDF to Word converter with no signup and no watermark."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to install any software?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No installation is required. The tool works directly in your browser on mobile, tablet, and desktop."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will formatting stay the same after conversion?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most formatting such as text, tables, and images is preserved. Very complex PDFs may need small adjustments after conversion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert scanned PDFs to editable Word documents?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Enable OCR to extract text from scanned or image-based PDFs and convert them into editable Word documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I convert multiple PDFs to Word at the same time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Upload multiple PDF files and they will be converted together. You will receive a ZIP file containing all DOCX documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are my files safe and private?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Files are processed securely and automatically removed after processing to protect your privacy."
                  }
                }
              ]
            },
            null,
            2
          )
        }}
      />
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">

              {seo?.h1 || "PDF to Word Converter (Free & Online)"}
            </h1>

            {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {seo?.hero?.subtitle || "Upload a PDF and convert it to an editable Word (DOCX). Clean output, no watermark, no signup. Single + bulk supported."}
              <span className="block mt-1">
                Convert scanned/image-based PDFs to editable Word documents using built-in OCR text recognition.
              </span>
            </p> */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert PDF to editable Word (DOCX) instantly — text, tables, images,
              and formatting stay intact. Upload a single PDF or batch convert up to
              10 files at once. Supports scanned PDFs via built-in OCR. Perfect for
              contracts, reports, resumes, and assignments. No signup, no watermark,
              completely free.
            </p>

            {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {seo?.hero?.subtitle || "Got a PDF you need to edit? Upload one file for a quick DOCX..."}
              </p> */}


            {/* <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            
              PDF to Word Converter <br />(Free & Online)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got a PDF you need to edit? Upload one file for a quick DOCX — or select multiple PDFs together and download
              everything in one ZIP. Clean output, no watermark, no signup.
            </p> */}

          </div>

          {/* <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-center">
            <h3 className="mb-1 text-sm font-semibold text-yellow-800">
              🚧 Tool Under Maintenance
            </h3>
            <p className="text-sm text-yellow-700">
              We’re fixing an issue to make conversions faster and more accurate.
              <br />
              Please check back shortly — <strong>PDFLinx</strong> will be ready for you.
            </p>
          </div>  */}


          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {files.length
                        ? `${files.length} file(s) selected`
                        : "Drop your PDF file(s) here or click to upload"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Converts PDF to editable Word (DOCX)
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Tip: Single PDF downloads as DOCX. Multiple PDFs download as a ZIP with all DOCX files inside.
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    required
                  />
                </label>
              </div>


              <div className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={enableOcr}
                  onChange={(e) => setEnableOcr(e.target.checked)}
                />
                <div>
                  <p className="font-medium">Enable OCR (for scanned/image PDFs)</p>
                  <p className="text-gray-500 text-xs">
                    OCR makes text editable but may take longer. Complex layouts/columns may shift slightly.
                  </p>
                </div>
              </div>

              {/* Convert Button */}

              {/* <button
                  type="submit"
                  disabled={loading || !files.length}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
                >
                   {loading ? (
                    <>Converting… please wait</>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Convert to Word
                    </>
                  )} 
                 </button>  */}

              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!files.length}
                icon={<FileText className="w-5 h-5" />}
                label="Convert to Word"
                gradient="from-blue-600 to-green-600"
              />


              {/* <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 text-sm font-semibold text-gray-600"
                >
                  Temporarily Unavailable
                </button>
 */}


              {/* UX Notice (✅ button ke neeche, form ke andar) */}
              <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                <p>
                  ⏱️ <strong>Multiple files conversion may take up to 1 minute.</strong> Please don’t close this tab.
                </p>
                <p>
                  🔢 You can convert up to <strong>10 PDF files at once</strong>.
                </p>
              </div>
            </form>



            {/* MS Word Compatibility Notice (✅ form ke baad, bilkul sahi) */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-semibold mb-1">ℹ️ Microsoft Word Compatibility</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Converted files open best in <strong>Microsoft Word 2013 or newer</strong>.
                </li>
                <li>
                  When opening the file, click <strong>“Enable Editing”</strong> if prompted.
                </li>
                <li>
                  Older versions of Word may not fully support modern DOCX files.
                </li>
              </ul>
            </div>



            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your file(s) downloaded automatically 🎉
                </p>
                <p className="text-base text-gray-700">
                  {files.length === 1
                    ? "Check your downloads for the editable Word file."
                    : "Check your downloads – ZIP contains all converted DOCX files."}
                </p>
              </div>


            )}
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Single & batch conversion • OCR for scanned PDFs • Works on Windows, Mac, Android & iOS
          </p>
          {/* <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Files gone after 1 hour • Completely free • Single & bulk conversions supported
          </p> */}
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            PDF to Word Online Free – Convert PDF to Editable DOCX in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to edit a PDF? Convert it to Word here — text, tables, images,
            and layout move over cleanly so you can edit straight away. Supports
            single file and batch conversion. Scanned PDFs supported via OCR.
            Fast, free, and privacy-friendly on PDF Linx.
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
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Accurate Text & Layout</h3>
            <p className="text-gray-600 text-sm">
              Text, tables, headings, images, and spacing transfer cleanly into
              Word — ready to edit without major cleanup for most standard PDFs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">OCR for Scanned PDFs</h3>
            <p className="text-gray-600 text-sm">
              Enable OCR to extract text from image-based and scanned PDFs —
              turning non-editable scans into fully editable DOCX documents.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Conversion</h3>
            <p className="text-gray-600 text-sm">
              Convert one PDF to DOCX directly, or upload up to 10 PDFs at once
              and download all converted Word files as a single ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert PDF to Word — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">
                Select one PDF or upload multiple files at once for batch
                conversion. Drag and drop supported on all devices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Enable OCR if Needed & Convert</h4>
              <p className="text-gray-600 text-sm">
                For scanned PDFs, enable the OCR option first. Then click
                Convert — the tool processes your file and preserves formatting.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download DOCX or ZIP</h4>
              <p className="text-gray-600 text-sm">
                Single file downloads as DOCX instantly. Multiple files are
                packaged into a ZIP containing all converted Word documents.
              </p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to create a PDF too?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Many workflows go both ways — convert documents into PDF, then edit PDFs back in Word.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">
                Word to PDF Converter
              </a>{" "}
              <span className="text-slate-600">— export your edited DOCX back to PDF instantly.</span>
            </li>
            <li>
              <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
                Merge PDF
              </a>{" "}
              <span className="text-slate-600">— combine multiple PDFs into one before converting.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
                Compress PDF
              </a>{" "}
              <span className="text-slate-600">— reduce PDF file size before or after conversion.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">
                Browse all PDF tools
              </a>{" "}
              <span className="text-slate-600">— merge, split, compress, protect & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by students, professionals, and businesses to convert PDFs into
          editable Word documents — fast, accurate, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to Word Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever had a PDF you needed to edit right now — but couldn't? That's exactly
          what this tool solves. The{" "}
          <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span>{" "}
          extracts text, tables, images, and layout from any PDF and delivers a
          clean, editable Word (DOCX) file in seconds — with no software installation
          and no account required. Upload multiple PDFs and get everything in one ZIP.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is PDF to Word Conversion?
        </h3>
        <p className="leading-7 mb-6">
          PDF to Word conversion transforms a fixed, non-editable PDF file into a
          Microsoft Word document (DOCX format) that you can freely edit — update
          text, fix typos, modify tables, or reuse content in your own templates.
          Our converter preserves the original text flow, heading structure, table
          layouts, and embedded images as accurately as possible, including support
          for scanned PDFs via OCR (Optical Character Recognition).
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Convert PDF to Word?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Edit text, correct errors, and update content in any PDF</li>
          <li>Reuse content from PDFs in your own Word templates</li>
          <li>Extract and modify tables, figures, and formatted text</li>
          <li>Convert scanned documents to editable text using OCR</li>
          <li>Collaborate by sharing an editable DOCX instead of a locked PDF</li>
          <li>Update contracts, invoices, or reports without recreating from scratch</li>
          <li>Copy paragraphs, data, or sections into other documents</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Standard PDFs vs Scanned PDFs — What Is the Difference?
            </h3>
            <p className="leading-7">
              A <strong>standard PDF</strong> contains actual digital text that can be
              selected and copied — these convert to Word with high accuracy. A{" "}
              <strong>scanned PDF</strong> is essentially an image of a document — text
              appears visible but is not selectable. To convert scanned PDFs to editable
              Word, enable the <strong>OCR option</strong> on PDF Linx. OCR (Optical
              Character Recognition) reads the image and extracts the text, making it
              editable in Word. Complex layouts, columns, and tables in scanned documents
              may need minor adjustments after conversion.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Convert PDF to Word Without Losing Formatting
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Use <strong>standard PDFs</strong> where possible — they convert with higher accuracy than scanned files</li>
              <li>Enable <strong>OCR</strong> only when the PDF is scanned or image-based</li>
              <li>PDFs with simple, single-column layouts convert most cleanly</li>
              <li>Multi-column layouts and complex tables may need minor cleanup after conversion</li>
              <li>After conversion, open in <strong>Microsoft Word 2013 or newer</strong> for best compatibility</li>
              <li>Click <strong>"Enable Editing"</strong> when prompted — this is a standard Word security step</li>
            </ul>
            <p className="leading-7">
              PDF Linx is built to preserve <strong>text, tables, images, headings, and page
                structure</strong> — your converted Word document should be ready to edit with
              minimal corrections.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF to Word Conversion
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>
                <strong>Editing contracts and agreements:</strong> Convert a received PDF
                contract to Word, make changes, and send back as an updated document.
              </li>
              <li>
                <strong>Updating resumes and CVs:</strong> Lost the original DOCX? Convert
                your PDF resume back to Word and edit it directly.
              </li>
              <li>
                <strong>Extracting content from reports:</strong> Pull text, data, and tables
                from PDF reports into editable Word documents for reuse or analysis.
              </li>
              <li>
                <strong>Academic and research documents:</strong> Convert PDF papers,
                theses, or assignments to Word for annotation, editing, or reformatting.
              </li>
              <li>
                <strong>Scanned document digitization:</strong> Use OCR to convert scanned
                paper documents, receipts, or forms into searchable, editable DOCX files.
              </li>
              <li>
                <strong>Invoice and form editing:</strong> Convert received PDF invoices or
                forms to Word to update figures, dates, or reference numbers.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PDF to Word Conversion
            </h3>
            <p className="leading-7">
              Need to convert multiple PDFs at once? Upload up to{" "}
              <strong>10 PDF files</strong> simultaneously. The tool converts all files
              and delivers them as a <strong>ZIP download</strong> containing individual
              DOCX files — ideal for processing multiple contracts, reports, assignments,
              or scanned documents in one go. Single PDF uploads download as a DOCX
              directly without any ZIP.
            </p>
            <p className="leading-7 mt-3">
              After converting, if you want to combine pages use{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                Merge PDF
              </a>
              . To export the edited Word file back as PDF, use{" "}
              <a href="/word-to-pdf" className="text-blue-700 font-medium hover:underline">
                Word to PDF
              </a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a priority. Uploaded PDF files are
              processed automatically and <strong>permanently deleted after conversion</strong> —
              never stored long-term, never shared with third parties, and never used
              for any other purpose. No account creation is required — no email, no
              password, no personal data collected. Your documents stay completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Convert PDF to Word on Any Device
            </h3>
            <p className="leading-7">
              PDF Linx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
              in any modern browser. No app download, no software installation required.
              Whether you are on a desktop at the office, a laptop at university, or a
              phone on the go, you can convert PDFs to editable Word documents in seconds.
              Fully responsive with drag-and-drop file upload supported on all devices
              including touchscreens.
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            PDFLinx PDF to Word Converter — Feature Summary
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
            <li>Free online PDF to Word converter — no hidden fees</li>
            <li>Converts PDF to editable DOCX format</li>
            <li>OCR support for scanned and image-based PDFs</li>
            <li>Batch conversion — up to 10 files at once</li>
            <li>ZIP download for multiple file conversions</li>
            <li>Text, tables, images, and layout preserved</li>
            <li>Fast processing — conversion in seconds</li>
            <li>No watermark added to converted files</li>
            <li>Works on desktop and mobile browsers</li>
            <li>Files auto-deleted after conversion — privacy protected</li>
            <li>No signup or account required</li>
            <li>Cross-platform: Windows, macOS, Android, iOS</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Convert PDF study material, papers, and assignments to Word for annotation and editing</li>
          <li><strong>Job seekers:</strong> Convert a PDF resume back to DOCX when the original Word file is lost</li>
          <li><strong>Professionals:</strong> Edit received PDF contracts, proposals, and reports in Word</li>
          <li><strong>Businesses:</strong> Convert PDF invoices, forms, and correspondence to editable Word documents</li>
          <li><strong>Researchers:</strong> Extract and reformat content from academic PDFs and papers</li>
          <li><strong>Administrative staff:</strong> Digitize scanned forms and documents using OCR to Word conversion</li>
          <li><strong>Freelancers:</strong> Update and repurpose PDF content for client deliverables in Word format</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions — PDF to Word
        </h3>
      </section>


      {/* Long-form content (Human touch + bulk mention) */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF to Word Converter – Free Online Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Ever had a PDF that you needed to edit “right now” — but it wouldn’t let you? That’s the exact pain this tool solves.
          The <span className="font-medium text-slate-900">PDFLinx PDF to Word Converter</span> turns PDFs into editable Word (DOCX)
          in seconds. And the best part? If you have a bunch of PDFs, you can upload multiple files at once and download everything in a single ZIP.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What is PDF to Word conversion?
        </h3>
        {/* <p className="leading-7 mb-6">
          PDF to Word conversion means taking a PDF (which is usually fixed and hard to edit) and turning it into a Word document
          you can change freely — edit text, fix typos, update tables, or copy content into your own template.
        </p> */}

        <p className="leading-7 mb-6">
          PDF to Word conversion means taking a PDF (which is usually fixed and hard to edit) and turning it into an editable Word document (DOCX format).
          Our converter extracts text, tables, and images while preserving formatting, layout structure, and font styles as accurately as possible.
          It also works with scanned PDFs using smart text recognition (OCR) to convert scanned documents into editable Word files.
          With OCR enabled, the converter can also extract text from images in scanned PDFs and turn it into an editable DOCX file.
          Complex layouts, columns, or tables may need minor cleanup to preserve formatting and maintain layout structure.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Single file or multiple files — both supported
        </h3>

        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Single PDF:</strong> converts and downloads as a Word (DOCX) file directly.</li>
          <li><strong>Multiple PDFs:</strong> converts all files and gives you a ZIP containing all DOCX files.</li>
        </ul>

        <p className="leading-7 mb-4">
          After converting to DOCX, you may want to send or print the edited file as a PDF again.
          Use our{" "}
          <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">
            Word to PDF converter
          </a>{" "}
          to export the updated document back into PDF. If you’re working with multiple PDFs, you can combine them using{" "}
          <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">
            merge PDF files
          </a>{" "}
          or reduce file size using{" "}
          <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">
            Compress PDF
          </a>.
        </p>


        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why use PDFLinx?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Fast conversion with clean, editable output</li>
          <li>No watermark, no signup, no annoying limits</li>
          <li>Great for resumes, reports, contracts, and assignments</li>
          <li>Supports bulk conversion when you’re working with many files</li>
          <li>Privacy-first: files are removed after processing</li>
          <li>Preserves original formatting, tables, fonts, and images</li>
          <li>Supports scanned PDF to Word conversion with OCR technology</li>
        </ul>
      </section>


      {/* FAQ */}

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              ...(seo?.faqs || []),
              {
                q: "Is the PDF to Word converter free to use?",
                a: "Yes. PDFLinx PDF to Word converter is completely free — no hidden charges, no subscription, no premium tier required.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser. No desktop software, no app download, no plugins needed.",
              },
              {
                q: "Will my PDF formatting be preserved after conversion?",
                a: "Yes for standard PDFs — text, tables, images, and layout transfer cleanly into Word. Very complex layouts may need minor cleanup. Scanned PDFs converted via OCR may have slight formatting shifts.",
              },
              {
                q: "Are my uploaded PDF files safe and private?",
                a: "Yes. Files are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I convert scanned PDFs to editable Word documents?",
                a: "Yes. Enable the OCR option before converting. OCR reads image-based and scanned PDFs and extracts the text into an editable DOCX file. Printed text works best for accurate OCR results.",
              },
              {
                q: "Does OCR work with handwritten text?",
                a: "OCR works best on clear, printed text. Handwritten text accuracy varies depending on scan quality and handwriting clarity — results may need manual correction.",
              },
              {
                q: "Can I convert multiple PDFs to Word at the same time?",
                a: "Yes. Upload up to 10 PDF files at the same time. All converted DOCX files are delivered as a single ZIP download.",
              },
              {
                q: "What happens if I upload only one PDF?",
                a: "Single file uploads convert and download directly as a DOCX file — no ZIP, no extra steps.",
              },
              {
                q: "Why does Microsoft Word ask me to 'Enable Editing'?",
                a: "This is a standard Word security prompt for downloaded files. Click 'Enable Editing' to start editing your converted document — it is completely normal and safe.",
              },
              {
                q: "Can I convert PDF to Word on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile devices, tablets, and all desktop browsers — no app required.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              ...(seo?.faqs || []),

              {
                q: "Can I convert scanned PDFs to editable Word documents?",
                a: "Yes. Enable OCR to extract text from image-based or scanned PDFs and convert them into an editable DOCX file. Printed text works best for accurate text recognition."
              },
              {
                q: "Will formatting stay the same after OCR conversion?",
                a: "OCR focuses on text extraction, so most text becomes editable, but complex layouts, columns, and tables may shift slightly. We aim to preserve formatting and maintain text clarity as much as possible."
              },
              {
                q: "Does OCR work with handwritten text?",
                a: "Handwritten text accuracy can vary. OCR works best on clear, printed text with good scan quality. For low-quality scans, results may need manual correction."
              }

            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5">
                <summary className="font-semibold cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-2 text-gray-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section> */}




      {seo?.extraContent && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{seo.extraContent.heading}</h2>
          <p className="text-gray-600 leading-7">{seo.extraContent.body}</p>
        </section>
      )}


      <RelatedToolsSection currentPage="pdf-to-word" />


      {/* 🔗 Comparison Links (Styled) */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Compare PDF Linx with other PDF tools
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                See differences in limits, ads, pricing, and privacy — before you choose.
              </p>
            </div>

            <a
              href="/free-pdf-tools"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore all tools →
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/compare/pdflinx-vs-ilovepdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs iLovePDF
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Limits, ads, batch conversion, and privacy comparison.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>

            <a
              href="/compare/pdflinx-vs-smallpdf"
              className="group rounded-xl border p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    PDF Linx vs Smallpdf
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Free tier limits, pricing, and user experience.
                  </div>
                </div>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

