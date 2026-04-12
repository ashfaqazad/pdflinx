"use client";

// import { useState } from "react";
// import { Upload, Hash, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";
// import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Upload,
  Hash,
  CheckCircle,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import dynamic from "next/dynamic";



const PageNumberPreview = dynamic(
  () => import("@/components/PageNumberPreview"),
  { ssr: false }
);

export default function AddPageNumbers() {
  // const [file, setFile] = useState(null);
  // const [success, setSuccess] = useState(false);

  // const [position, setPosition] = useState("bottom-center");
  // const [startNumber, setStartNumber] = useState(1);
  // const [fontSize, setFontSize] = useState(14);
  // const [margin, setMargin] = useState(20);

  // const {
  //   progress,
  //   isLoading,
  //   startProgress,
  //   completeProgress,
  //   cancelProgress,
  // } = useProgressBar();

  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [margin, setMargin] = useState(20);

  const clearAll = () => {
    setFile(null);
    setSuccess(false);
    setError("");
    setPosition("bottom-center");
    setStartNumber(1);
    setFontSize(14);
    setMargin(20);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!file) return alert("Please select a PDF file first!");

  //   startProgress();
  //   setSuccess(false);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("position", position);
  //   formData.append("startNumber", String(startNumber));
  //   formData.append("fontSize", String(fontSize));
  //   formData.append("margin", String(margin));

  //   try {
  //     const res = await fetch("/convert/add-page-numbers", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       let msg = "Failed to add page numbers";
  //       try {
  //         const maybeJson = await res.json();
  //         msg = maybeJson?.error || msg;
  //       } catch {}
  //       throw new Error(msg);
  //     }

  //     const contentType = (res.headers.get("content-type") || "").toLowerCase();

  //     if (!contentType.includes("application/pdf")) {
  //       throw new Error("Unexpected response from server.");
  //     }

  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();

  //     window.URL.revokeObjectURL(url);

  //     completeProgress();
  //     setSuccess(true);
  //     setFile(null);
  //     setPosition("bottom-center");
  //     setStartNumber(1);
  //     setFontSize(14);
  //     setMargin(20);
  //     e.target.reset();
  //   } catch (err) {
  //     cancelProgress();
  //     alert(err.message || "Something went wrong, please try again.");
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file first!");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    formData.append("startNumber", String(startNumber));
    formData.append("fontSize", String(fontSize));
    formData.append("margin", String(margin));

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const increment = prev < 35 ? 8 : prev < 65 ? 5 : 2;
        return prev + increment;
      });
    }, 300);

    try {
      const res = await fetch("/convert/add-page-numbers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Failed to add page numbers";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      clearInterval(progressInterval);
      setProgress(100);

      if (!contentType.includes("application/pdf")) {
        throw new Error("Unexpected response from server.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setSuccess(true);

      setTimeout(() => {
        const downloadSection = document.getElementById("download-section");
        if (downloadSection) {
          downloadSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);

      clearAll();
      e.target.reset();
    } catch (err) {
      const msg =
        err?.message || "Something went wrong, please try again.";
      setError(msg);
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 800);
    }
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Add Page Numbers to a PDF Online for Free",
              description:
                "Insert page numbers into a PDF in 3 quick steps. Upload your file, choose the number position and style, and download the updated PDF instantly.",
              url: "https://pdflinx.com/add-page-numbers",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload the PDF file to which you want to add page numbers.",
                },
                {
                  "@type": "HowToStep",
                  name: "Choose page number settings",
                  text: "Select the position, starting number, font size, and margin for your page numbers.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download updated PDF",
                  text: "Click the add page numbers button and download your numbered PDF instantly.",
                },
              ],
              totalTime: "PT20S",
              estimatedCost: {
                "@type": "MonetaryAmount",
                value: "0",
                currency: "USD",
              },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://pdflinx.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Add Page Numbers",
                  item: "https://pdflinx.com/add-page-numbers",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is the Add Page Numbers to PDF tool free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, PDFLinx lets you add page numbers to PDF online for free with no signup required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I choose where page numbers appear?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can place page numbers at the top or bottom, and align them left, center, or right.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I start numbering from any number?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can begin numbering from 1, 5, 10, or any number you need.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will adding page numbers change my original PDF layout?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. The original PDF layout stays the same. Only page numbers are added to the pages.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my PDF files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Files are processed securely and deleted automatically after a short time.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I add page numbers to PDF on mobile?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="software-schema-add-page-numbers"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Add Page Numbers to PDF - PDFLinx",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              description:
                "Add page numbers to PDF online free. Insert page numbering anywhere in your PDF instantly with no signup and no watermark.",
              url: "https://pdflinx.com/add-page-numbers",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Add page numbers to PDF",
                "Choose PDF page number position",
                "Start numbering from any number",
                "Free online PDF page numbering tool",
                "No watermark",
                "Secure file processing",
                "Works on mobile and desktop",
                "Instant browser-based tool",
              ],
              creator: {
                "@type": "Organization",
                name: "PDFLinx",
              },
            },
            null,
            2
          ),
        }}
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Add Page Numbers to PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Add page numbers to PDF online free — no signup, no watermark,
              no software needed. Choose the position, start number, font size,
              and margin, then download your updated PDF instantly.
            </p>
          </div>

          {/* STEP STRIP */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Select your file" },
              { n: "2", label: "Set Numbering", sub: "Position and style" },
              { n: "3", label: "Download PDF", sub: "Auto download" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${
                  i < 2 ? "border-r border-gray-100" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                  {s.n}
                </div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* MAIN CARD */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div
              className={`relative transition-all duration-300 ${
                isLoading ? "pointer-events-none" : ""
              }`}
            >
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-blue-200 border-b-transparent animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "0.8s",
                      }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      Adding page numbers…
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {progress < 30
                        ? "Uploading PDF…"
                        : progress < 70
                        ? "Applying page numbers…"
                        : "Almost done…"}
                    </p>
                  </div>

                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {progress}%
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Dropzone */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
                      file
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${
                        file
                          ? "bg-green-100"
                          : "bg-indigo-50 group-hover:bg-indigo-100"
                      }`}
                    >
                      {file ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Upload className="w-7 h-7 text-indigo-600" />
                      )}
                    </div>

                    {file ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          1 file selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Click to change selection
                        </p>

                        <div className="flex justify-center mt-3">
                          <span className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                            <FileText className="w-3 h-3" />
                            {file.name.length > 30
                              ? file.name.slice(0, 28) + "…"
                              : file.name}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your PDF file here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          or click to browse · PDF files only
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {[
                            "✓ No signup",
                            "✓ No watermark",
                            "✓ Instant download",
                            "✓ Auto-deleted",
                          ].map((t) => (
                            <span
                              key={t}
                              className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const pickedFile = e.target.files?.[0] || null;
                      setFile(pickedFile);
                      setSuccess(false);
                      setError("");
                    }}
                    className="hidden"
                    required
                  />
                </label>

                {/* Selected File */}
                {file && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Selected file
                        </p>
                        <p className="text-xs text-gray-400">
                          Remove or replace before processing
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-sm font-medium truncate max-w-xs text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Settings */}
                {file && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Page numbering settings
                      </p>
                      <p className="text-xs text-gray-400">
                        Choose position, start number, font size, and margin
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Page number position
                        </label>
                        <select
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start numbering from
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={startNumber}
                          onChange={(e) =>
                            setStartNumber(Number(e.target.value) || 1)
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Font size
                        </label>
                        <input
                          type="number"
                          min="8"
                          max="48"
                          value={fontSize}
                          onChange={(e) =>
                            setFontSize(Number(e.target.value) || 14)
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Margin
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={margin}
                          onChange={(e) =>
                            setMargin(Number(e.target.value) || 20)
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview */}
                {file && (
                  <PageNumberPreview
                    file={file}
                    position={position}
                    startNumber={startNumber}
                    fontSize={fontSize}
                    margin={margin}
                  />
                )}

                {/* Current Settings */}
                {file && (
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <Hash className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">
                        Current numbering settings
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Start from {startNumber}, position{" "}
                        {position.replace("-", " ")}, font size {fontSize}px,
                        margin {margin}px
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <Hash className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">
                        PDF page numbering
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Adds page numbers without changing the rest of the PDF
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !file}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${
                      file && !isLoading
                        ? "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Hash className="w-4 h-4" />
                    )}
                    Add Page Numbers
                  </button>
                </div>

                {/* Hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Large PDFs may take a little longer — don&apos;t close this tab</p>
                  <p>💡 Preview the numbering position before downloading your final PDF</p>
                </div>
              </form>
            </div>

            {/* Success */}
            {success && (
              <div
                id="download-section"
                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-800 mb-1">
                    Done! Your numbered PDF downloaded automatically 🎉
                  </h3>

                  <p className="text-sm text-gray-600 mb-6">
                    Check your downloads folder for the updated PDF file.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Add numbers to another PDF
                    </button>

                    <a
                      href="/merge-pdf"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Merge PDF →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Files auto delete • Completely free •
            Works on desktop &amp; mobile
          </p>
        </div>
      </main>
      
      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Free PDF Page Numbering Tool — Add Page Numbers Without Editing the Whole File
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to add page numbers to a report, assignment, contract, invoice, or scanned PDF?
            PDFLinx lets you insert page numbers into PDF online quickly without changing the rest of your document.
            Just upload, choose the settings, and download the numbered PDF.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Add Numbers Anywhere</h3>
            <p className="text-gray-600 text-sm">
              Add page numbers at the top or bottom, and align them left, center, or right without editing the whole PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Keeps Original PDF Intact</h3>
            <p className="text-gray-600 text-sm">
              Only the page numbers are added. The remaining content, layout, design, and order of your PDF stay unchanged.
            </p>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg border border-sky-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Free</h3>
            <p className="text-gray-600 text-sm">
              No signup, no installation, and no watermark. Add page numbers to PDF online in seconds from any device.
            </p>
          </div>
        </div>

        {/* How To */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Add Page Numbers to PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
              <p className="text-gray-600 text-sm">
                Select the PDF file to which you want to add numbering for pages, reports, invoices, books, or study material.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Choose Number Settings</h4>
              <p className="text-gray-600 text-sm">
                Select the page number position, starting number, font size, and margin to match your document style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-600 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download Updated PDF</h4>
              <p className="text-gray-600 text-sm">
                Click Add Page Numbers and download your updated PDF instantly with clean numbering applied.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Perfect for students, office users, freelancers, teachers, and anyone who needs professional PDF page numbering in seconds.
        </p>
      </section>

      {/* ==================== LONG CONTENT / SEMANTIC SEO ==================== */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Add Page Numbers to PDF Online – Free PDF Numbering Tool by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          An Add Page Numbers to PDF tool helps you insert page numbering into a PDF file without recreating the document from scratch.
          This is useful when your PDF contains reports, assignments, invoices, legal documents, eBooks, scanned pages, or files prepared for printing.
          <span className="font-medium text-slate-900"> PDFLinx Add Page Numbers to PDF</span>{" "}
          makes the process fast and simple directly in your browser.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Does Add Page Numbers to PDF Mean?
        </h3>
        <p className="leading-7 mb-6">
          Adding page numbers to a PDF means inserting a visible number on each page while keeping the rest of the document unchanged.
          For example, if your PDF has 20 pages, you can number them 1 to 20, or start from a different number such as 5 or 10 depending on your needs.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Do People Add Page Numbers to PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Organize long documents and reports</li>
          <li>Prepare professional files for printing</li>
          <li>Make contracts and invoices easier to review</li>
          <li>Add numbering to assignments, notes, or study material</li>
          <li>Improve navigation in eBooks, manuals, or scanned PDFs</li>
        </ul>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Add PDF Page Numbers Without Changing the Original Layout
            </h3>
            <p className="leading-7">
              One of the biggest advantages of using a dedicated PDF page numbering tool is that it adds only the numbering you choose.
              The rest of the document remains untouched. This is especially useful for contracts, reports, invoices, presentations, and scanned files where layout consistency matters.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Choose Position, Start Number, and Margin
            </h3>
            <p className="leading-7">
              PDFLinx supports different page number positions and flexible settings.
              For example, you can add numbers at the <strong>top left, top center, top right, bottom left, bottom center, or bottom right</strong>.
              You can also start numbering from any number and adjust the margin and font size for better placement.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Best Use Cases for a PDF Page Numbering Tool
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>Add numbering to reports before client delivery</li>
              <li>Prepare assignments and academic PDFs for submission</li>
              <li>Insert page numbers into proposals, invoices, or legal files</li>
              <li>Number scanned PDFs before archiving or printing</li>
              <li>Make manuals, books, or study notes easier to navigate</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Add Page Numbers to PDF on Mobile
            </h3>
            <p className="leading-7">
              Need to add page numbers to PDF on Android or iPhone? PDFLinx works directly in mobile browsers,
              so you can upload a PDF, select the numbering settings, and download the updated file without installing an app.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              After Adding Page Numbers, What Next?
            </h3>
            <p className="leading-7">
              After inserting page numbers, you may want to use{" "}
              <a href="/organize-pdf" className="text-indigo-700 font-medium hover:underline">
                Organize PDF
              </a>{" "}
              to reorder pages,{" "}
              <a href="/merge-pdf" className="text-indigo-700 font-medium hover:underline">
                Merge PDF
              </a>{" "}
              to combine files, or{" "}
              <a href="/compress-pdf" className="text-indigo-700 font-medium hover:underline">
                Compress PDF
              </a>{" "}
              to reduce file size for easier sharing.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-10">
          How to Insert Page Numbers into PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file</li>
          <li>Choose the page number position and style</li>
          <li>Set the starting number, margin, and font size</li>
          <li>Click the Add Page Numbers button</li>
          <li>Download the new PDF instantly</li>
        </ol>

        <p className="mb-6">
          No registration, no software installation, and no watermark required.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Add Page Numbers Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online add page numbers to PDF tool</li>
            <li>Choose top or bottom placement</li>
            <li>Supports left, center, and right alignment</li>
            <li>Start numbering from any number</li>
            <li>Adjust font size and margin</li>
            <li>No watermark added to your file</li>
            <li>No signup required</li>
            <li>Works on desktop, tablet, and mobile</li>
            <li>Secure file handling</li>
            <li>Clean and simple interface</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Number assignments, notes, and study material</li>
          <li><strong>Professionals:</strong> Prepare reports and proposals for review</li>
          <li><strong>Businesses:</strong> Add numbering to contracts, invoices, and formal PDFs</li>
          <li><strong>Freelancers:</strong> Deliver more professional documents to clients</li>
          <li><strong>Teachers:</strong> Prepare course material and handouts with clear numbering</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is privacy-focused. Uploaded files are processed securely and deleted automatically after processing.
          Your PDF documents are not stored permanently.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Add PDF Page Numbers Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS devices.
          All you need is an internet connection and a modern browser to add page numbers to PDF quickly and securely.
        </p>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the Add Page Numbers to PDF tool free to use?",
                a: "Yes. PDFLinx lets you add page numbers to PDF online for free with no hidden charges, no subscription, and no signup required.",
              },
              {
                q: "Can I choose where page numbers appear?",
                a: "Yes. You can place them at the top or bottom, and align them left, center, or right.",
              },
              {
                q: "Can I start numbering from a different number?",
                a: "Yes. You can start from any number like 5, 10, or any page number you need.",
              },
              {
                q: "Will my PDF layout remain unchanged?",
                a: "Yes. Only the page numbers are added. The rest of the PDF stays in the same layout and sequence.",
              },
              {
                q: "Can I add page numbers to a scanned PDF?",
                a: "Yes. This tool is useful for adding numbering to scanned PDFs, reports, books, and other document files.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },
              {
                q: "Are my uploaded PDF files secure?",
                a: "Yes. Files are processed securely and automatically deleted after a short time.",
              },
              {
                q: "Can I use this PDF page numbering tool on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },
              {
                q: "Can I add page numbers to invoices, reports, and contracts?",
                a: "Yes. You can use this tool for invoices, reports, contracts, study files, and many other PDF documents.",
              },
              {
                q: "What should I use if I want to reorder pages after numbering?",
                a: "For reordering pages, use an Organize PDF tool. Add Page Numbers is specifically for inserting page numbering.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-indigo-500 ml-3 text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="add-page-numbers" />

    </>
  );
}






















// "use client";

// import { useState } from "react";
// import { Upload, Hash, CheckCircle, FileText } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";
// import dynamic from "next/dynamic";

// const PageNumberPreview = dynamic(
//     () => import("@/components/PageNumberPreview"),
//     { ssr: false }
// );

// export default function AddPageNumbers() {
//     const [file, setFile] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const [position, setPosition] = useState("bottom-center");
//     const [startNumber, setStartNumber] = useState(1);
//     const [fontSize, setFontSize] = useState(14);
//     const [margin, setMargin] = useState(20);

//     const {
//         progress,
//         isLoading,
//         startProgress,
//         completeProgress,
//         cancelProgress,
//     } = useProgressBar();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!file) return alert("Please select a PDF file first!");

//         startProgress();
//         setSuccess(false);

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("position", position);
//         formData.append("startNumber", String(startNumber));
//         formData.append("fontSize", String(fontSize));
//         formData.append("margin", String(margin));

//         try {
//             const res = await fetch("/convert/add-page-numbers", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 let msg = "Failed to add page numbers";
//                 try {
//                     const maybeJson = await res.json();
//                     msg = maybeJson?.error || msg;
//                 } catch { }
//                 throw new Error(msg);
//             }

//             const contentType = (res.headers.get("content-type") || "").toLowerCase();

//             if (!contentType.includes("application/pdf")) {
//                 throw new Error("Unexpected response from server.");
//             }

//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;
//             a.download = file.name.replace(/\.pdf$/i, "") + "-page-numbers.pdf";
//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);

//             completeProgress();
//             setSuccess(true);
//             setFile(null);

//             setPosition("bottom-center");
//             setStartNumber(1);
//             setFontSize(14);
//             setMargin(20);

//             e.target.reset();
//         } catch (err) {
//             cancelProgress();
//             alert(err.message || "Something went wrong, please try again.");
//             console.error(err);
//         }
//     };

//     return (
//         <>
//             <Script
//                 src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//                 strategy="afterInteractive"
//                 onReady={() => {
//                     if (window?.pdfjsLib) {
//                         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//                             "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//                     }
//                 }}
//             />

//             {/* ==================== SEO SCHEMAS ==================== */}

//             <Script
//                 id="howto-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "HowTo",
//                         name: "How to Add Page Numbers to a PDF Online",
//                         description:
//                             "Add page numbers to your PDF in 3 easy steps. Upload your file, choose position and style, and download the updated PDF instantly.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         step: [
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Upload PDF",
//                                 text: "Upload your PDF file from your device.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Choose page number settings",
//                                 text: "Select position, starting number, font size, and margin.",
//                             },
//                             {
//                                 "@type": "HowToStep",
//                                 name: "Download PDF",
//                                 text: "Click Add Page Numbers and download your updated PDF instantly.",
//                             },
//                         ],
//                         totalTime: "PT20S",
//                         estimatedCost: {
//                             "@type": "MonetaryAmount",
//                             value: "0",
//                             currency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <Script
//                 id="breadcrumb-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "BreadcrumbList",
//                         itemListElement: [
//                             {
//                                 "@type": "ListItem",
//                                 position: 1,
//                                 name: "Home",
//                                 item: "https://pdflinx.com",
//                             },
//                             {
//                                 "@type": "ListItem",
//                                 position: 2,
//                                 name: "Add Page Numbers",
//                                 item: "https://pdflinx.com/add-page-numbers",
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="faq-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "FAQPage",
//                         mainEntity: [
//                             {
//                                 "@type": "Question",
//                                 name: "Is the Add Page Numbers tool free?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can add page numbers to PDF online for free without signup.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I choose where page numbers appear?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can place page numbers at top or bottom, left, center, or right.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Can I start numbering from a specific number?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "Yes, you can start numbering from any number such as 1, 5, or 10.",
//                                 },
//                             },
//                             {
//                                 "@type": "Question",
//                                 name: "Will this change my PDF layout?",
//                                 acceptedAnswer: {
//                                     "@type": "Answer",
//                                     text: "No, the original layout stays the same. Only page numbers are added.",
//                                 },
//                             },
//                         ],
//                     }),
//                 }}
//             />

//             <Script
//                 id="software-schema-add-page-numbers"
//                 type="application/ld+json"
//                 strategy="afterInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "SoftwareApplication",
//                         name: "Add Page Numbers to PDF - PDFLinx",
//                         applicationCategory: "BusinessApplication",
//                         operatingSystem: "Web Browser",
//                         description:
//                             "Add page numbers to PDF online free. Insert page numbers anywhere in your PDF instantly with no watermark.",
//                         url: "https://pdflinx.com/add-page-numbers",
//                         offers: {
//                             "@type": "Offer",
//                             price: "0",
//                             priceCurrency: "USD",
//                         },
//                     }),
//                 }}
//             />

//             <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="text-center mb-8">
//                         <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                             Add Page Numbers to PDF Online Free
//                             <br />
//                             <span className="text-2xl md:text-3xl font-medium">
//                                 Insert PDF Page Numbers in Seconds
//                             </span>
//                         </h1>

//                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                             Add page numbers to your PDF online free. Upload your file, preview
//                             pages, choose number position, and download the updated PDF
//                             instantly.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* File Input */}
//                             <div className="relative">
//                                 <label className="block">
//                                     <div
//                                         className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
//                                             ? "border-green-500 bg-green-50"
//                                             : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
//                                             }`}
//                                     >
//                                         <Upload className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
//                                         <p className="text-lg font-semibold text-gray-700">
//                                             {file ? file.name : "Drop your PDF here or click to upload"}
//                                         </p>

//                                         <p className="text-sm text-gray-500 mt-1">Only .pdf files</p>

//                                         <p className="text-xs text-gray-500 mt-2">
//                                             Upload your PDF, preview the pages, choose page number
//                                             settings, and download the updated file instantly.
//                                         </p>
//                                     </div>

//                                     <input
//                                         type="file"
//                                         accept=".pdf"
//                                         onChange={(e) => {
//                                             const pickedFile = e.target.files?.[0] || null;
//                                             setFile(pickedFile);
//                                         }}
//                                         className="hidden"
//                                         required
//                                     />
//                                 </label>
//                             </div>

//                             {/* Settings */}
//                             {file && (
//                                 <div className="grid md:grid-cols-2 gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Page number position
//                                         </label>
//                                         <select
//                                             value={position}
//                                             onChange={(e) => setPosition(e.target.value)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         >
//                                             <option value="top-left">Top Left</option>
//                                             <option value="top-center">Top Center</option>
//                                             <option value="top-right">Top Right</option>
//                                             <option value="bottom-left">Bottom Left</option>
//                                             <option value="bottom-center">Bottom Center</option>
//                                             <option value="bottom-right">Bottom Right</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Start numbering from
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="1"
//                                             value={startNumber}
//                                             onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Font size
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="8"
//                                             max="48"
//                                             value={fontSize}
//                                             onChange={(e) => setFontSize(Number(e.target.value) || 14)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Margin
//                                         </label>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={margin}
//                                             onChange={(e) => setMargin(Number(e.target.value) || 20)}
//                                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Preview */}
//                             {file && (
//                                 <PageNumberPreview
//                                     file={file}
//                                     position={position}
//                                     startNumber={startNumber}
//                                     fontSize={fontSize}
//                                     margin={margin}
//                                 />
//                             )}

//                             {/* Info box */}
//                             {file && (
//                                 <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-gray-700">
//                                     <span className="font-semibold">Preview settings: </span>
//                                     Start <strong>{startNumber}</strong>, Position{" "}
//                                     <strong>{position.replace("-", " ")}</strong>, Font size{" "}
//                                     <strong>{fontSize}px</strong>, Margin <strong>{margin}px</strong>
//                                 </div>
//                             )}

//                             {/* Button */}
//                             <ProgressButton
//                                 isLoading={isLoading}
//                                 progress={progress}
//                                 disabled={!file}
//                                 icon={<Hash className="w-5 h-5" />}
//                                 label="Add Page Numbers"
//                                 gradient="from-indigo-600 to-blue-600"
//                             />

//                             <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
//                                 <p>
//                                     🔢 <strong>Add page numbers</strong> to your PDF in seconds.
//                                 </p>
//                                 <p>
//                                     👀 <strong>Use live preview</strong> to check the number position
//                                     before downloading.
//                                 </p>
//                             </div>
//                         </form>

//                         {success && (
//                             <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
//                                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                                 <p className="text-xl font-bold text-green-700 mb-2">
//                                     Done! Your numbered PDF downloaded automatically 🎉
//                                 </p>
//                                 <p className="text-base text-gray-700">
//                                     Check your downloads folder.
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     <p className="text-center mt-6 text-gray-600 text-base">
//                         No account • No watermark • Auto-deleted after 1 hour • 100% free •
//                         Works on desktop & mobile
//                     </p>
//                 </div>
//             </main>

//             {/* ==================== SEO CONTENT ==================== */}
//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold mb-4">
//                         Add Page Numbers to PDF Online Free – Fast & Easy PDF Numbering Tool
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Looking to add page numbers to a PDF file online? PDFLinx lets you insert page numbers into your PDF instantly without changing the original layout.
//                         Whether you need to number reports, assignments, invoices, or contracts, this tool helps you do it in seconds.
//                     </p>
//                 </div>

//                 <div className="space-y-10">
//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             What Does Add Page Numbers to PDF Mean?
//                         </h3>
//                         <p>
//                             Adding page numbers to a PDF means inserting numbers on each page of your document. These numbers help organize your document,
//                             improve readability, and make navigation easier when printing or sharing files.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Why Add Page Numbers to PDF Files?
//                         </h3>
//                         <ul className="list-disc pl-6 space-y-2">
//                             <li>Organize long documents and reports</li>
//                             <li>Make navigation easier for readers</li>
//                             <li>Prepare professional documents for printing</li>
//                             <li>Add numbering to assignments or study material</li>
//                             <li>Improve document structure and readability</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Add Page Numbers Without Changing Layout
//                         </h3>
//                         <p>
//                             This tool adds page numbers without modifying your PDF’s original design. The content, formatting, and structure remain unchanged.
//                             Only the page numbers are added at your selected position.
//                         </p>
//                     </div>

//                     <div>
//                         <h3 className="text-xl font-semibold mb-3">
//                             Customize Page Number Position and Style
//                         </h3>
//                         <p>
//                             You can choose where to place page numbers — top or bottom, left, center, or right.
//                             You can also control the starting number, font size, and margin to match your document style.
//                         </p>
//                     </div>
//                 </div>

//                 <h3 className="text-xl font-semibold mt-10 mb-3">
//                     How to Add Page Numbers to PDF Online
//                 </h3>
//                 <ol className="list-decimal pl-6 space-y-2">
//                     <li>Upload your PDF file</li>
//                     <li>Select page number position and settings</li>
//                     <li>Click Add Page Numbers</li>
//                     <li>Download your updated PDF instantly</li>
//                 </ol>

//                 <div className="bg-gray-50 border rounded-xl p-6 mt-8">
//                     <h3 className="text-xl font-semibold mb-4">
//                         Features of Add Page Numbers Tool
//                     </h3>
//                     <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">
//                         <li>Add page numbers to PDF online free</li>
//                         <li>Choose position (top, bottom, left, right)</li>
//                         <li>Start numbering from any page</li>
//                         <li>Customize font size and margin</li>
//                         <li>No watermark added</li>
//                         <li>Works on mobile and desktop</li>
//                         <li>Fast and secure processing</li>
//                         <li>No signup required</li>
//                     </ul>
//                 </div>
//             </section>

//             <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
//                 <div className="text-center mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                         Add Page Numbers to PDF Without Editing the Whole Document
//                     </h2>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                         Insert page numbers into reports, assignments, contracts, invoices,
//                         and scanned PDFs quickly. Choose where the page numbers should appear
//                         and download the final PDF instantly.
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-8 mb-16">
//                     <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Hash className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Add Numbers Anywhere
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             Place page numbers at the top or bottom, left, center, or right side
//                             of every PDF page.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <FileText className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Live Preview
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             See how numbering will look before processing the final PDF file.
//                         </p>
//                     </div>

//                     <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg border border-sky-100 text-center hover:shadow-xl transition">
//                         <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <CheckCircle className="w-8 h-8 text-white" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-3">
//                             Fast & Free
//                         </h3>
//                         <p className="text-gray-600 text-sm">
//                             No signup, no installation, and no watermark. Just upload and
//                             download.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             <section className="py-16">
//                 <div className="max-w-4xl mx-auto px-4">
//                     <h2 className="text-3xl font-bold text-center mb-10">
//                         Frequently Asked Questions
//                     </h2>

//                     <div className="space-y-4">
//                         {[
//                             {
//                                 q: "Is this tool free to use?",
//                                 a: "Yes, you can add page numbers to PDF online for free with no signup.",
//                             },
//                             {
//                                 q: "Can I choose where page numbers appear?",
//                                 a: "Yes, you can place them at top or bottom, left, center, or right.",
//                             },
//                             {
//                                 q: "Can I start numbering from a different number?",
//                                 a: "Yes, you can start from any number like 5 or 10.",
//                             },
//                             {
//                                 q: "Does this tool change my PDF layout?",
//                                 a: "No, it only adds page numbers without affecting layout.",
//                             },
//                             {
//                                 q: "Can I use this on mobile?",
//                                 a: "Yes, it works on all devices including mobile, tablet, and desktop.",
//                             },
//                         ].map((faq, i) => (
//                             <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
//                                 <summary className="font-semibold cursor-pointer flex justify-between items-center">
//                                     {faq.q}
//                                     <span className="text-indigo-500 text-lg group-open:rotate-45">+</span>
//                                 </summary>
//                                 <p className="mt-2 text-gray-600">{faq.a}</p>
//                             </details>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <RelatedToolsSection currentPage="add-page-numbers" />
//         </>
//     );
// }