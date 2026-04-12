"use client";

// import { useMemo, useState } from "react";
// import { Upload, FileText, Download, CheckCircle, X, Key, LockOpen } from "lucide-react";
// import Script from "next/script";
// import RelatedToolsSection from "@/components/RelatedTools";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import ProgressButton from "@/components/ProgressButton";
import { useMemo, useState } from "react";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  X,
  Key,
  LockOpen,
  Loader2,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";


export default function UnlockPdf() {
  // const [files, setFiles] = useState([]);
  // const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [error, setError] = useState("");
  // const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");



  const totalSizeMb = useMemo(() => {
    return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
  }, [files]);

  // const clearAll = () => {
  //   setFiles([]);
  //   setPassword("");
  //   setSuccess(false);
  //   setError("");
  // };

  const clearAll = () => {
    setFiles([]);
    setPassword("");
    setLoading(false);
    setProgress(0);
    setSuccess(false);
    setError("");
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setSuccess(false);
    setError("");
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!files.length) {
  //     setError("Please select at least one PDF file first!");
  //     return;
  //   }

  //   startProgress();        // ← setLoading(true) ki jagah

  //   setSuccess(false);
  //   setError("");

  //   const formData = new FormData();
  //   for (const f of files) formData.append("files", f);

  //   // optional password (send only if user entered)
  //   if (password.trim()) formData.append("password", password.trim());

  //   try {
  //     const res = await fetch("/convert/unlock-pdf", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       let msg = "Unlock failed";
  //       try {
  //         const j = await res.json();
  //         msg = j?.error || msg;
  //       } catch { }
  //       throw new Error(msg);
  //     }

  //     const contentType = res.headers.get("content-type") || "";

  //     // SINGLE => PDF
  //     if (contentType.includes("application/pdf")) {
  //       const blob = await res.blob();
  //       const outName = files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
  //       downloadBlob(blob, outName);
  //       completeProgress();   // ← success pe
  //       setSuccess(true);
  //       return;
  //     }

  //     // MULTIPLE => ZIP
  //     if (contentType.includes("application/zip")) {
  //       const blob = await res.blob();
  //       downloadBlob(blob, "pdflinx-unlocked-pdfs.zip");
  //       completeProgress();   // ← success pe
  //       setSuccess(true);
  //       return;
  //     }

  //     // fallback
  //     let data = null;
  //     try {
  //       data = await res.json();
  //     } catch { }
  //     throw new Error(data?.error || "Unexpected response from server");

  //   } catch (err) {
  //     const msg = (err?.message || "Something went wrong. Please try again.").toString();

  //     // Friendly hints
  //     if (msg.toLowerCase().includes("password")) {
  //       setError(
  //         "This PDF requires a password to open (user password). Please enter the correct password and try again."
  //       );
  //     } else {
  //       setError(msg);
  //     }

  //     cancelProgress();       // ← error / catch pe reset
  //     console.error(err);
  //   }
  //   // finally hata diya — hook khud manage karega
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setError("Please select at least one PDF file first!");
      return;
    }

    setLoading(true);
    setProgress(0);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);

    if (password.trim()) formData.append("password", password.trim());

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const increment = prev < 35 ? 8 : prev < 65 ? 5 : 2;
        return prev + increment;
      });
    }, 300);

    try {
      const res = await fetch("/convert/unlock-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Unlock failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = res.headers.get("content-type") || "";

      clearInterval(progressInterval);
      setProgress(100);

      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const outName = files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
        downloadBlob(blob, outName);
        setSuccess(true);
      } else if (contentType.includes("application/zip")) {
        const blob = await res.blob();
        downloadBlob(blob, "pdflinx-unlocked-pdfs.zip");
        setSuccess(true);
      } else {
        let data = null;
        try {
          data = await res.json();
        } catch { }
        throw new Error(data?.error || "Unexpected response from server");
      }

      setTimeout(() => {
        const downloadSection = document.getElementById("download-section");
        if (downloadSection) {
          downloadSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    } catch (err) {
      const msg = (err?.message || "Something went wrong. Please try again.").toString();

      if (msg.toLowerCase().includes("password")) {
        setError(
          "This PDF requires a password to open (user password). Please enter the correct password and try again."
        );
      } else {
        setError(msg);
      }

      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 800);
    }
  };


  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Unlock a PDF Online for Free",
            description:
              "Unlock PDF online free — remove printing, copying, and editing restrictions instantly. No signup, no watermark, no software needed. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/unlock-pdf",
            step: [
              { "@type": "HowToStep", name: "Upload PDF file(s)", text: "Upload a single PDF or select multiple PDFs at the same time." },
              { "@type": "HowToStep", name: "Enter password (only if required)", text: "If your PDF requires a password to open, enter it. Otherwise leave it blank." },
              { "@type": "HowToStep", name: "Unlock and download", text: "Click Unlock PDF Now. Download the unlocked PDF or ZIP if multiple files." },
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Unlock PDF", item: "https://pdflinx.com/unlock-pdf" },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="faq-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can I unlock a PDF without a password?",
                acceptedAnswer: { "@type": "Answer", text: "Yes — if the PDF only has printing, copying, or editing restrictions (owner lock). If it requires a password to open (user lock), you must enter the correct password." },
              },
              {
                "@type": "Question",
                name: "What is the difference between user password and owner password?",
                acceptedAnswer: { "@type": "Answer", text: "User password is required to open and view the PDF. Owner password restricts actions like printing, copying, or editing. Owner restrictions can often be removed without needing any password." },
              },
              {
                "@type": "Question",
                name: "Will my unlocked PDF look the same after conversion?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Unlocking only removes restrictions — it does not change text, images, layout, or quality in any way." },
              },
              {
                "@type": "Question",
                name: "Are my files safe and private?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely over encrypted connections and permanently deleted after unlocking. They are never stored long-term or shared with third parties." },
              },
              {
                "@type": "Question",
                name: "Can I unlock multiple PDFs at once?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Upload up to 10 PDF files simultaneously. All unlocked PDFs are delivered as a single ZIP download." },
              },
              {
                "@type": "Question",
                name: "Is PDFLinx cracking or bypassing passwords?",
                acceptedAnswer: { "@type": "Answer", text: "No. PDFLinx removes owner permission restrictions, or unlocks files using the password you provide. PDFs that require an opening password cannot be unlocked without the correct password." },
              },
              {
                "@type": "Question",
                name: "Can I unlock a PDF on my phone?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on Android and iOS mobile browsers — no app download required." },
              },
              {
                "@type": "Question",
                name: "What should I do after unlocking a PDF?",
                acceptedAnswer: { "@type": "Answer", text: "After unlocking, you can protect it again with a new password using the Protect PDF tool, merge it with other documents, compress it for sharing, or split it into individual pages." },
              },
            ],
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Unlock PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                No Signup · No Watermark · Instant Download
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock PDF online free — remove printing, copying, and editing restrictions
              instantly. No signup, no watermark, no software needed. If your PDF requires
              a password to open, enter it to unlock. Works on Windows, Mac, Android and iOS.
            </p>
          </div>

          {/* STEP STRIP */}
          <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            {[
              { n: "1", label: "Upload PDF", sub: "Single or multiple files" },
              { n: "2", label: "Enter Password", sub: "Only if needed" },
              { n: "3", label: "Download PDF", sub: "PDF or ZIP" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
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
              className={`relative transition-all duration-300 ${loading ? "pointer-events-none" : ""
                }`}
            >
              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-green-200 border-b-transparent animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "0.8s",
                      }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      Unlocking your file{files.length > 1 ? "s" : ""}…
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {progress < 30
                        ? "Uploading…"
                        : progress < 70
                          ? "Removing restrictions…"
                          : "Almost done…"}
                    </p>
                  </div>

                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Dropzone */}
                <label className="block cursor-pointer group">
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${files.length
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
                      }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${files.length
                          ? "bg-green-100"
                          : "bg-blue-50 group-hover:bg-blue-100"
                        }`}
                    >
                      {files.length ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Upload className="w-7 h-7 text-blue-600" />
                      )}
                    </div>

                    {files.length ? (
                      <>
                        <p className="text-base font-semibold text-green-700">
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Click to change selection
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                          {files.slice(0, 5).map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
                            >
                              <FileText className="w-3 h-3" />
                              {f.name.length > 24 ? f.name.slice(0, 22) + "…" : f.name}
                            </span>
                          ))}
                          {files.length > 5 && (
                            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                              +{files.length - 5} more
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                          Total selected: {totalSizeMb.toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-semibold text-gray-700">
                          Drop your PDF file(s) here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          or click to browse · PDF files only
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {[
                            "✓ No signup",
                            "✓ No watermark",
                            "✓ Batch unlock",
                            "✓ Auto-deleted",
                          ].map((t) => (
                            <span
                              key={t}
                              className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-full"
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
                    multiple
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const picked = Array.from(e.target.files || []);
                      if (picked.length > 10) {
                        setError("Maximum 10 files allowed.");
                        return;
                      }
                      setFiles(picked);
                      setSuccess(false);
                      setError("");
                    }}
                    className="hidden"
                    required
                  />
                </label>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Selected files</p>
                        <p className="text-xs text-gray-400">Remove any file before unlocking</p>
                      </div>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {files.map((file, idx) => (
                        <div
                          key={`${file.name}-${file.size}-${idx}`}
                          className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="text-sm font-medium truncate max-w-xs text-gray-700">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-400 shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">Unlock settings</p>
                    <p className="text-xs text-gray-400">
                      Enter password only if the PDF requires one to open
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password (optional)
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="Enter only if PDF requires a password to open"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setSuccess(false);
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Leave blank for PDFs with only printing, copying, or editing restrictions.
                      Enter the correct password only if the PDF is locked for opening.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                    <LockOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-none">
                        PDF unlocking
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Single file → PDF · Multiple files → ZIP download
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !files.length}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${files.length && !loading
                        ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 hover:shadow-md active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    Unlock PDF Now
                  </button>
                </div>

                {/* Hints */}
                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                  <p>⏱️ Multiple files may take a little longer — don&apos;t close this tab</p>
                  <p>💡 If the PDF only has owner restrictions, you can usually leave the password field blank</p>
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
                    Done! Your file{files.length > 1 ? "s" : ""} downloaded automatically 🎉
                  </h3>

                  <p className="text-sm text-gray-600 mb-6">
                    {files.length === 1
                      ? "Your unlocked PDF is ready in downloads."
                      : "Check your downloads — ZIP contains all unlocked PDF files."}
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Unlock another PDF
                    </button>

                    <a
                      href="/protect-pdf"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                      Protect PDF →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-500 text-sm">
            No account • No watermark • Files auto delete • Completely free • Supports single &amp; bulk uploads
          </p>
        </div>
      </main>
      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Free PDF Unlocker — Remove PDF Restrictions Online Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Some PDFs restrict printing, copying, or editing. PDFLinx Unlock PDF removes
            these restrictions fast — no signup, no watermark, no software needed. If your
            PDF requires a password to open, just enter it and we'll unlock it for you.
            Works for single and bulk files on any device.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Remove Restrictions</h3>
            <p className="text-gray-600 text-sm">
              Unlock printing, copying, and editing restrictions (owner protection) in one
              click — no password needed for owner-locked PDFs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Password When Needed</h3>
            <p className="text-gray-600 text-sm">
              If your PDF requires a password to open (user protection), enter it to unlock
              safely — content and layout stay exactly as original.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Unlock</h3>
            <p className="text-gray-600 text-sm">
              Unlock one PDF or up to 10 files at once. Single file downloads as PDF
              directly. Multiple files download as a ZIP.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Unlock a PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
              <p className="text-gray-600 text-sm">Select one PDF or upload up to 10 files at once for batch unlock. Drag and drop supported on all devices.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
              <h4 className="text-lg font-semibold mb-2">Enter Password (If Required)</h4>
              <p className="text-gray-600 text-sm">Leave blank for owner-locked PDFs with print/copy restrictions. Enter password only if the PDF requires one to open.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
              <h4 className="text-lg font-semibold mb-2">Download Unlocked PDF</h4>
              <p className="text-gray-600 text-sm">Single file downloads as unlocked PDF instantly. Multiple files are packaged into a ZIP with all unlocked PDFs inside.</p>
            </div>
          </div>
        </div>

        {/* Contextual Links */}
        <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            Need to do more with your PDF?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Unlock is often the first step — manage your document further with these tools.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/protect-pdf" className="text-blue-700 font-semibold hover:underline">Protect PDF</a>{" "}
              <span className="text-slate-600">— add a new password back to your PDF after editing.</span>
            </li>
            <li>
              <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">Merge PDF</a>{" "}
              <span className="text-slate-600">— combine your unlocked PDF with other documents into one file.</span>
            </li>
            <li>
              <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">Compress PDF</a>{" "}
              <span className="text-slate-600">— reduce file size after unlocking for easy email sharing.</span>
            </li>
            <li>
              <a href="/split-pdf" className="text-blue-700 font-semibold hover:underline">Split PDF</a>{" "}
              <span className="text-slate-600">— extract specific pages from your unlocked PDF.</span>
            </li>
            <li>
              <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
              <span className="text-slate-600">— merge, split, compress, convert & more.</span>
            </li>
          </ul>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Trusted by professionals, businesses, and students to unlock PDF files —
          fast, secure, and always free.
        </p>
      </section>

      {/* ── DEEP SEO CONTENT ── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          PDF Unlock Tool – Free Online PDF Restriction Remover by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          Need to remove restrictions from a PDF without Adobe Acrobat? The{" "}
          <span className="font-medium text-slate-900">PDFLinx Unlock PDF tool</span>{" "}
          lets you remove printing, copying, and editing restrictions from any PDF online
          free — no software installation, no signup, no watermark. Upload your PDF, enter
          a password if required, and download a fully unlocked file in seconds.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Does Unlocking a PDF Mean?
        </h3>
        <p className="leading-7 mb-6">
          Unlocking a PDF means removing its restrictions so the file can be accessed,
          printed, copied, or edited freely. There are two types of PDF locks: an
          <strong> owner lock</strong> that restricts actions like printing and copying
          (removable without a password), and a <strong>user lock</strong> that requires a
          password to open the file. PDFLinx handles both — owner locks are removed
          automatically, and user locks are removed when you provide the correct password.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Would You Need to Unlock a PDF?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>You want to print a PDF that has printing restrictions applied</li>
          <li>You need to copy text or extract content from a restricted PDF</li>
          <li>You received a secured PDF for authorized use and need to edit it</li>
          <li>You forgot the password of your own PDF file</li>
          <li>You need to merge or split a restricted PDF using another tool</li>
          <li>You want easier access to frequently used locked documents</li>
        </ul>

        <div className="mt-10 space-y-10">

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              User Password vs Owner Password — What Is the Difference?
            </h3>
            <p className="leading-7">
              A <strong>user password</strong> (open password) is required to open and view
              the PDF — anyone without this password cannot access the file at all. An{" "}
              <strong>owner password</strong> controls permissions — it determines whether
              the recipient can print, copy, or edit the PDF after opening it. PDFLinx
              removes owner restrictions automatically without needing the owner password,
              and removes user password protection when you supply the correct open password.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              How to Unlock a PDF Without Adobe Acrobat
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
              <li>Upload your PDF to the <a href="/unlock-pdf" className="text-blue-700 font-medium hover:underline">Unlock PDF tool</a></li>
              <li>If the PDF requires a password to open, enter it in the password field</li>
              <li>Leave the password field blank if the PDF only has print/copy restrictions</li>
              <li>Click <strong>Unlock PDF Now</strong></li>
              <li>Download your unlocked PDF instantly — restrictions removed</li>
            </ul>
            <p className="leading-7">
              No Adobe Acrobat, no Microsoft software, no desktop app needed — everything
              runs directly in your browser on any device.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Common Use Cases for PDF Unlocking
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li><strong>Legal documents:</strong> Remove restrictions from contracts or agreements you are authorized to edit or reuse.</li>
              <li><strong>Academic materials:</strong> Unlock lecture notes, study guides, or eBooks for printing and annotation.</li>
              <li><strong>Business reports:</strong> Access archived reports with outdated permission locks to copy data or reformat content.</li>
              <li><strong>Personal documents:</strong> Regain full access to your own PDFs when you have forgotten the password.</li>
              <li><strong>Client files:</strong> Unlock client-shared protected files when authorized to make changes or extract content.</li>
              <li><strong>Government forms:</strong> Remove restrictions from official PDF forms to fill, print, or save them properly.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Batch PDF Unlocking
            </h3>
            <p className="leading-7">
              Need to unlock multiple PDFs at once? Upload up to{" "}
              <strong>10 PDF files</strong> simultaneously — all unlocked with the same
              password if provided. All unlocked PDFs are delivered as a{" "}
              <strong>ZIP download</strong>. Single PDF uploads download directly as an
              unlocked PDF without any ZIP. After unlocking, you may want to{" "}
              <a href="/protect-pdf" className="text-blue-700 font-medium hover:underline">
                protect the PDF again
              </a>{" "}
              with a new password, or{" "}
              <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">
                merge it
              </a>{" "}
              with other documents.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Privacy and File Security
            </h3>
            <p className="leading-7">
              PDF Linx is built with privacy as a core priority. Uploaded PDF files are
              processed over encrypted connections and{" "}
              <strong>permanently deleted after unlocking</strong> — never stored long-term,
              never shared with third parties, and never used for any other purpose. No
              account creation is required — no email, no password stored on our end, no
              personal data collected. Your documents remain completely private.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Unlock PDF on Any Device
            </h3>
            <p className="leading-7">
              PDFLinx works on{" "}
              <strong>Windows, macOS, Linux, Android, and iOS</strong> — in any modern
              browser. No app download, no software installation. Whether you are at your
              desk, on a laptop, or on your phone, you can unlock any PDF in seconds. Fully
              responsive with drag-and-drop file upload supported on all devices.
            </p>
          </div>

        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto my-10">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-blue-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">PDF Linx</th>
                <th className="px-4 py-3">Desktop Software</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="px-4 py-3">Free to use</td>
                <td className="px-4 py-3 text-green-600">✅ Always free</td>
                <td className="px-4 py-3 text-red-500">❌ Paid license</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">No installation needed</td>
                <td className="px-4 py-3 text-green-600">✅ Browser-based</td>
                <td className="px-4 py-3 text-red-500">❌ Download required</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">Works on mobile</td>
                <td className="px-4 py-3 text-green-600">✅ Android & iOS</td>
                <td className="px-4 py-3 text-red-500">❌ Desktop only</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">No watermark</td>
                <td className="px-4 py-3 text-green-600">✅ Clean output</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Sometimes</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3">Batch unlock (up to 10)</td>
                <td className="px-4 py-3 text-green-600">✅ Supported</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Varies</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">Files auto-deleted</td>
                <td className="px-4 py-3 text-green-600">✅ Privacy first</td>
                <td className="px-4 py-3 text-yellow-500">⚠️ Stored locally</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Professionals:</strong> Remove restrictions from secured reports, contracts, or presentations to edit and reuse them freely</li>
          <li><strong>Businesses:</strong> Access archived or shared PDFs that have outdated permission locks applied</li>
          <li><strong>Students:</strong> Unlock study materials, lecture notes, or eBooks for printing and annotation</li>
          <li><strong>Freelancers:</strong> Modify client-shared protected files when authorized to make changes</li>
          <li><strong>Individuals:</strong> Regain access to personal PDFs where the password has been forgotten</li>
          <li><strong>Anyone:</strong> Remove PDF restrictions to print, copy, or edit any document you are authorized to use</li>
        </ul>

        {/* Comparison Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-10 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            PDFLinx vs Other PDF Unlock Tools
          </h3>
          <p className="leading-7 text-slate-700">
            Unlike many PDF unlock tools that require account creation, charge for batch
            processing, or add watermarks to unlocked files — PDFLinx provides fast, secure
            PDF unlocking completely free, with no login and no watermark. Files are
            permanently deleted after processing, and batch unlock for up to 10 files is
            available at no cost.
          </p>
        </div>

      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I unlock a PDF without a password?",
                a: "Yes — if the PDF only has printing, copying, or editing restrictions (owner lock). If it requires a password to open (user lock), you must enter the correct password.",
              },
              {
                q: "What is the difference between user password and owner password?",
                a: "User password is required to open and view the PDF. Owner password restricts actions like printing, copying, or editing. Owner restrictions can often be removed without needing any password.",
              },
              {
                q: "Will my unlocked PDF look the same after conversion?",
                a: "Yes. Unlocking only removes restrictions — it does not change text, images, layout, or quality in any way.",
              },
              {
                q: "Are my files safe and private?",
                a: "Yes. Files are processed securely over encrypted connections and permanently deleted after unlocking. They are never stored long-term or shared with third parties.",
              },
              {
                q: "Can I unlock multiple PDFs at once?",
                a: "Yes. Upload up to 10 PDF files simultaneously. All unlocked PDFs are delivered as a single ZIP download.",
              },
              {
                q: "Is PDFLinx cracking or bypassing passwords?",
                a: "No. PDFLinx removes owner permission restrictions, or unlocks files using the password you provide. PDFs that require an opening password cannot be unlocked without the correct password.",
              },
              {
                q: "Can I unlock a PDF on my phone?",
                a: "Yes. PDFLinx works on Android and iOS mobile browsers — no app download required.",
              },
              {
                q: "What should I do after unlocking a PDF?",
                a: "After unlocking, you can protect it again with a new password using the Protect PDF tool, merge it with other documents using Merge PDF, compress it for sharing, or split it into individual pages.",
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

      <RelatedToolsSection currentPage="unlock-pdf" />
    </>

  );
}

























// "use client";

// import { useMemo, useState } from "react";
// import { Upload, LockOpen, CheckCircle, X, FileText, Key } from "lucide-react";
// import Script from "next/script";

// export default function UnlockPdf() {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const totalSizeMb = useMemo(() => {
//     return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
//   }, [files]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!files.length) {
//       setError("Please select at least one PDF file.");
//       return;
//     }

//     setLoading(true);
//     setSuccess(false);
//     setError("");

//     const formData = new FormData();
//     files.forEach((f) => formData.append("files", f));
//     if (password.trim()) formData.append("password", password.trim());

//     try {
//       const res = await fetch("/convert/unlock-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         let msg = "Unlock failed";
//         try {
//           const j = await res.json();
//           msg = j?.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const type = res.headers.get("content-type") || "";

//       // Single PDF
//       if (type.includes("application/pdf")) {
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         download(url, files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf");
//         setSuccess(true);
//         return;
//       }

//       // ZIP
//       if (type.includes("application/zip")) {
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         download(url, "pdflinx-unlocked-pdfs.zip");
//         setSuccess(true);
//         return;
//       }

//       throw new Error("Unexpected server response.");
//     } catch (err) {
//       const msg = err?.message || "Something went wrong.";
//       if (msg.toLowerCase().includes("password")) {
//         setError(
//           "This PDF requires a password to open. Please enter the correct password and try again."
//         );
//       } else {
//         setError(msg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const download = (url, name) => {
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = name;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const removeFile = (i) => {
//     setFiles((p) => p.filter((_, idx) => idx !== i));
//     setError("");
//     setSuccess(false);
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setPassword("");
//     setError("");
//     setSuccess(false);
//   };

//   return (
//     <>
//       {/* ================= SEO: FAQ SCHEMA ================= */}
//       <Script
//         id="faq-unlock-pdf"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "FAQPage",
//             mainEntity: [
//               {
//                 "@type": "Question",
//                 name: "Can I unlock a PDF without a password?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Yes, if the PDF only has printing or editing restrictions (owner password). PDFs that require a password to open need the correct password.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Why does my PDF ask for a password?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Some PDFs are protected with an open (user) password. These cannot be unlocked without entering the correct password.",
//                 },
//               },
//               {
//                 "@type": "Question",
//                 name: "Is Unlock PDF free on PDFLinx?",
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text:
//                     "Yes. PDFLinx Unlock PDF is completely free with no watermark and no sign-up required.",
//                 },
//               },
//             ],
//           }),
//         }}
//       />

//       <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
//               Unlock PDF Online – Free & Secure
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Remove printing, copying, and editing restrictions from PDFs.
//               If your file requires a password to open, simply enter it below.
//             </p>
//           </div>

//           {/* Card */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Upload */}
//               <label className="block">
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
//                     files.length
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//                   }`}
//                 >
//                   <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
//                   <p className="font-semibold">
//                     {files.length
//                       ? `${files.length} file(s) selected`
//                       : "Drop PDF files here or click to upload"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Max 10 files • 25MB each
//                   </p>
//                   {!!files.length && (
//                     <p className="text-xs text-gray-500 mt-2">
//                       Total size: {totalSizeMb.toFixed(2)} MB
//                     </p>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   multiple
//                   accept="application/pdf,.pdf"
//                   className="hidden"
//                   onChange={(e) => {
//                     setFiles(Array.from(e.target.files || []));
//                     setPassword("");
//                     setError("");
//                     setSuccess(false);
//                   }}
//                 />
//               </label>

//               {/* File List */}
//               {files.map((f, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
//                 >
//                   <div className="flex gap-2 items-center">
//                     <FileText className="w-5 h-5 text-red-600" />
//                     <span className="text-sm truncate max-w-xs">{f.name}</span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeFile(i)}
//                     className="text-red-500"
//                   >
//                     <X />
//                   </button>
//                 </div>
//               ))}

//               {files.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={clearAll}
//                   className="text-sm underline text-right block w-full"
//                 >
//                   Clear all
//                 </button>
//               )}

//               {/* Password */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-medium">
//                   <Key className="w-5 h-5 text-blue-600" />
//                   Password (optional)
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Only if PDF requires password to open"
//                   className="w-full mt-2 px-4 py-3 border rounded-xl"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Leave blank for PDFs with only printing/editing restrictions.
//                 </p>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
//                   {error}
//                 </div>
//               )}

//               {/* Button */}
//               <button
//                 type="submit"
//                 disabled={loading || !files.length}
//                 className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-green-600 disabled:opacity-60"
//               >
//                 {loading ? "Unlocking…" : "Unlock PDF"}
//               </button>
//             </form>

//             {success && (
//               <div className="mt-6 text-center bg-green-50 border border-green-200 p-4 rounded-xl">
//                 <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
//                 <p className="font-bold text-green-700">
//                   PDF successfully unlocked!
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }



















// // "use client";

// // import { useMemo, useState } from "react";
// // import { Upload, LockOpen, CheckCircle, X, FileText, Key } from "lucide-react";

// // export default function UnlockPdf() {
// //   const [files, setFiles] = useState([]);
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState(false);
// //   const [error, setError] = useState("");

// //   const totalSizeMb = useMemo(() => {
// //     return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
// //   }, [files]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!files.length) {
// //       setError("Please select at least one PDF file!");
// //       return;
// //     }

// //     setLoading(true);
// //     setSuccess(false);
// //     setError("");

// //     const formData = new FormData();
// //     files.forEach((f) => formData.append("files", f));

// //     // ✅ optional password (send only if user entered)
// //     if (password.trim()) formData.append("password", password.trim());

// //     try {
// //       const res = await fetch("/convert/unlock-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         let msg = "Unlock failed";
// //         try {
// //           const j = await res.json();
// //           msg = j?.error || msg;
// //         } catch {}
// //         throw new Error(msg);
// //       }

// //       const contentType = res.headers.get("content-type") || "";

// //       // ✅ Single file → direct PDF download
// //       if (contentType.includes("application/pdf")) {
// //         const blob = await res.blob();
// //         const url = URL.createObjectURL(blob);

// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = files[0].name.replace(/\.pdf$/i, "") + "-unlocked.pdf";
// //         a.click();

// //         URL.revokeObjectURL(url);
// //         setSuccess(true);
// //         return;
// //       }

// //       // ✅ Multiple files → ZIP download
// //       if (contentType.includes("application/zip")) {
// //         const blob = await res.blob();
// //         const url = URL.createObjectURL(blob);

// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = "pdflinx-unlocked-pdfs.zip";
// //         a.click();

// //         URL.revokeObjectURL(url);
// //         setSuccess(true);
// //         return;
// //       }

// //       // fallback (unexpected)
// //       let data = null;
// //       try {
// //         data = await res.json();
// //       } catch {}
// //       throw new Error(data?.error || "Unexpected response from server");
// //     } catch (err) {
// //       const msg = (err?.message || "Something went wrong. Please try again.").toString();

// //       // ✅ Friendly hint for password-protected PDFs
// //       if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("protected")) {
// //         setError("This PDF requires a password to open. Please enter the password and try again.");
// //       } else {
// //         setError(msg);
// //       }

// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const removeFile = (index) => {
// //     setFiles((prev) => prev.filter((_, i) => i !== index));
// //     setSuccess(false);
// //     setError("");
// //   };

// //   const clearAll = () => {
// //     setFiles([]);
// //     setPassword("");
// //     setSuccess(false);
// //     setError("");
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
// //       <div className="max-w-4xl mx-auto">
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
// //             Unlock PDF Online (Free)
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //             Remove printing, copying, and editing restrictions from PDF files.
// //             Upload single or multiple PDFs — password optional (only if the PDF requires it).
// //           </p>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-lg p-8 border">
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Upload Area */}
// //             <label className="block">
// //               <div
// //                 className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
// //                   files.length
// //                     ? "border-green-500 bg-green-50"
// //                     : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
// //                 }`}
// //               >
// //                 <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
// //                 <p className="text-lg font-semibold">
// //                   {files.length
// //                     ? `${files.length} file(s) selected`
// //                     : "Drop PDF file(s) here or click to upload"}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">
// //                   PDF files only • Max 10 files • 25MB each
// //                 </p>
// //                 {!!files.length && (
// //                   <p className="text-xs text-gray-500 mt-2">
// //                     Total selected: {totalSizeMb.toFixed(2)} MB
// //                   </p>
// //                 )}
// //               </div>

// //               <input
// //                 type="file"
// //                 multiple
// //                 accept=".pdf,application/pdf"
// //                 className="hidden"
// //                 onChange={(e) => {
// //                   const newFiles = Array.from(e.target.files || []);

// //                   if (newFiles.length > 10) {
// //                     setError("Maximum 10 files allowed");
// //                     return;
// //                   }

// //                   setFiles(newFiles);
// //                   setPassword(""); // ✅ reset password on new selection
// //                   setSuccess(false);
// //                   setError("");
// //                 }}
// //               />
// //             </label>

// //             {/* Selected Files List */}
// //             {files.length > 0 && (
// //               <div className="space-y-2">
// //                 {files.map((file, idx) => (
// //                   <div
// //                     key={`${file.name}-${file.size}-${idx}`}
// //                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
// //                   >
// //                     <div className="flex items-center gap-2 min-w-0">
// //                       <FileText className="w-5 h-5 text-red-600 shrink-0" />
// //                       <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
// //                       <span className="text-xs text-gray-500 shrink-0">
// //                         ({(file.size / 1024 / 1024).toFixed(2)} MB)
// //                       </span>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={() => removeFile(idx)}
// //                       className="text-red-500 hover:bg-red-100 p-1 rounded"
// //                       aria-label="Remove file"
// //                     >
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 ))}

// //                 <div className="flex justify-end">
// //                   <button
// //                     type="button"
// //                     onClick={clearAll}
// //                     className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline"
// //                   >
// //                     Clear all
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Password Field (Optional) */}
// //             <div className="space-y-2">
// //               <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
// //                 <Key className="w-5 h-5 text-blue-600" />
// //                 Password (optional)
// //               </label>
// //               <input
// //                 type="password"
// //                 placeholder="Enter only if PDF requires a password to open"
// //                 value={password}
// //                 onChange={(e) => {
// //                   setPassword(e.target.value);
// //                   setSuccess(false);
// //                 }}
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
// //               />
// //               <p className="text-xs text-gray-500">
// //                 Leave blank for files with only printing/copying/editing restrictions — we’ll remove them automatically.
// //               </p>
// //             </div>

// //             {/* Error Message */}
// //             {error && (
// //               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
// //                 <p className="font-semibold">{error}</p>
// //               </div>
// //             )}

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={loading || !files.length}
// //               className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg transition-all"
// //             >
// //               {loading ? (
// //                 <>
// //                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                   Unlocking...
// //                 </>
// //               ) : (
// //                 <>
// //                   <LockOpen className="w-5 h-5" />
// //                   {password.trim() ? "Unlock PDF with Password" : "Unlock PDF"}
// //                 </>
// //               )}
// //             </button>
// //           </form>

// //           {/* Success Message */}
// //           {success && (
// //             <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center animate-in fade-in duration-300">
// //               <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
// //               <p className="font-bold text-green-700 text-lg">
// //                 ✅ {files.length === 1 ? "PDF Unlocked!" : "PDFs Unlocked & Downloaded!"}
// //               </p>
// //               <p className="text-sm text-green-600 mt-1">
// //                 Your file(s) have been unlocked successfully.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Features */}
// //         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-600">
// //           <div>🔒 Password Optional</div>
// //           <div>💧 No Watermark</div>
// //           <div>🗑️ Files Auto Delete</div>
// //           <div>📦 Up to 10 Files</div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }


