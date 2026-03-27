// app/protect-pdf/page.jsx
"use client";

import { useMemo, useState } from "react";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  X,
  Key,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";



export default function ProtectPdf() {
  const [files, setFiles] = useState([]);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  // Permissions (owner password controls these)
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalSizeMb = useMemo(() => {
    return files.reduce((sum, f) => sum + (f?.size || 0), 0) / 1024 / 1024;
  }, [files]);

  const clearAll = () => {
    setFiles([]);
    setUserPassword("");
    setOwnerPassword("");
    setShowAdvanced(false);
    setAllowPrint(true);
    setAllowCopy(false);
    setAllowEdit(false);
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

  const validatePassword = (p) => {
    const pass = (p || "").trim();
    if (!pass) return "Please enter a password.";
    if (pass.length < 4) return "Password should be at least 4 characters.";
    if (pass.length > 128) return "Password is too long.";
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setError("Please select at least one PDF file first!");
      return;
    }

    const pwErr = validatePassword(userPassword);
    if (pwErr) {
      setError(pwErr);
      return;
    }

    startProgress();        // ← setLoading(true) ki jagah

    setSuccess(false);
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);

    // Required user/open password
    formData.append("userPassword", userPassword.trim());

    // Optional owner password
    if (ownerPassword.trim()) formData.append("ownerPassword", ownerPassword.trim());

    // Permissions
    formData.append("allowPrint", String(allowPrint));
    formData.append("allowCopy", String(allowCopy));
    formData.append("allowEdit", String(allowEdit));

    try {
      const res = await fetch("/convert/protect-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Protection failed";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = res.headers.get("content-type") || "";

      // SINGLE => PDF
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const outName = files[0].name.replace(/\.pdf$/i, "") + "-protected.pdf";
        downloadBlob(blob, outName);
        completeProgress();   // ← success pe
        setSuccess(true);
        return;
      }

      // MULTIPLE => ZIP
      if (contentType.includes("application/zip")) {
        const blob = await res.blob();
        downloadBlob(blob, "pdflinx-protected-pdfs.zip");
        completeProgress();   // ← success pe
        setSuccess(true);
        return;
      }

      // fallback
      let data = null;
      try {
        data = await res.json();
      } catch { }
      throw new Error(data?.error || "Unexpected response from server");

    } catch (err) {
      const msg = (err?.message || "Something went wrong. Please try again.").toString();
      setError(msg);
      cancelProgress();       // ← error / catch pe reset
      console.error(err);
    }
    // finally hata diya — hook khud manage karega loading/progress
  };

  return (
    <>
  {/* ==================== SEO SCHEMAS ==================== */}
  <Script
    id="howto-schema-protect"
    type="application/ld+json"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Password Protect a PDF Online for Free",
        description:
          "Add a password to your PDF online free — no signup, no watermark. Protect single or multiple PDFs instantly. Works on Windows, Mac, Android, iOS.",
        url: "https://pdflinx.com/protect-pdf",
        step: [
          {
            "@type": "HowToStep",
            name: "Upload PDF file(s)",
            text: "Upload a single PDF or select multiple PDFs at the same time.",
          },
          {
            "@type": "HowToStep",
            name: "Set a password",
            text: "Enter a password that will be required to open the PDF.",
          },
          {
            "@type": "HowToStep",
            name: "Protect and download",
            text: "Click Protect PDF. Download the protected PDF or ZIP if multiple files.",
          },
        ],
        totalTime: "PT20S",
        estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        image: "https://pdflinx.com/og-image.png",
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
          { "@type": "ListItem", position: 2, name: "Protect PDF", item: "https://pdflinx.com/protect-pdf" },
        ],
      }, null, 2),
    }}
  />

  <Script
    id="faq-schema-protect"
    type="application/ld+json"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this free PDF password protection tool safe to use online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. PDFLinx Protect PDF is completely free and safe. Files are processed securely and permanently deleted after protection. No signup required.",
            },
          },
          {
            "@type": "Question",
            name: "How do I password protect a PDF without Adobe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload your PDF to PDFLinx, enter a password, and click Protect PDF. No Adobe Acrobat or any software needed — works directly in your browser.",
            },
          },
          {
            "@type": "Question",
            name: "Can I protect multiple PDFs with a password at once?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Upload up to 10 PDFs simultaneously. All protected PDFs are delivered as a single ZIP download.",
            },
          },
          {
            "@type": "Question",
            name: "Will password protecting a PDF change its content or quality?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Adding password protection does not change text, images, or layout. It only adds security encryption to the file.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between user password and owner password?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "User password is required to open and view the PDF. Owner password controls permissions like printing, copying, and editing. Both can be set separately.",
            },
          },
          {
            "@type": "Question",
            name: "Can I restrict printing and copying of a PDF?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Use the Advanced Permissions section to control whether printing, copying, or editing is allowed in the protected PDF.",
            },
          },
        ],
      }, null, 2),
    }}
  />

  {/* ==================== MAIN TOOL SECTION ==================== */}
  <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
          Password Protect PDF Online Free
          <br />
          <span className="text-2xl md:text-3xl font-medium">
            No Signup · No Watermark · Instant Download
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add a password to your PDF online free — no signup, no watermark, no software needed.
          Protect single or multiple PDFs instantly. Set open password and optional permissions
          for printing, copying, and editing. Works on Windows, Mac, Android and iOS.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Input */}
          <div className="relative">
            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>
                <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <p className="text-lg font-semibold text-gray-700">
                  {files.length ? `${files.length} file(s) selected` : "Drop your PDF file(s) here or click to upload"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Only .pdf files • Max 10 files • 25MB each</p>
                {!!files.length && (
                  <p className="text-xs text-gray-500 mt-2">
                    Total selected: {totalSizeMb.toFixed(2)} MB
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Single file downloads as PDF. Multiple files download as a ZIP.
                </p>
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
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:bg-red-100 p-1 rounded" aria-label="Remove file">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={clearAll} className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline">
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Required Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Password to open PDF (required)
            </label>
            <input
              type="password"
              placeholder="Set a password to open this PDF"
              value={userPassword}
              onChange={(e) => { setUserPassword(e.target.value); setSuccess(false); }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
            <p className="text-xs text-gray-500">
              This password will be required to open the PDF. Use something you can remember.
            </p>
          </div>

          {/* Advanced */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <button type="button" onClick={() => setShowAdvanced((v) => !v)} className="w-full flex items-center justify-between font-semibold text-gray-800">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Advanced permissions (optional)
              </span>
              <span className="text-sm text-gray-600">{showAdvanced ? "Hide" : "Show"}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Owner password (optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Optional: set an owner password for permissions"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    If left blank, we'll auto-generate a secure owner password on the server.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer">
                    <input type="checkbox" checked={allowPrint} onChange={(e) => setAllowPrint(e.target.checked)} />
                    <span className="text-sm text-gray-800">Allow printing</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer">
                    <input type="checkbox" checked={allowCopy} onChange={(e) => setAllowCopy(e.target.checked)} />
                    <span className="text-sm text-gray-800">Allow copy</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer">
                    <input type="checkbox" checked={allowEdit} onChange={(e) => setAllowEdit(e.target.checked)} />
                    <span className="text-sm text-gray-800">Allow editing</span>
                  </label>
                </div>

                <p className="text-xs text-gray-500">
                  Permissions are controlled by the owner password. The open password is still required to open the file.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <ProgressButton
            isLoading={isLoading}
            progress={progress}
            disabled={!files.length}
            icon={<Lock className="w-5 h-5" />}
            label="Protect PDF Now"
            gradient="from-blue-600 to-green-600"
            type="button"
            onClick={handleSubmit}
          />
        </form>

        {success && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-xl font-bold text-green-700 mb-2">
              Done! Your {files.length === 1 ? "protected PDF" : "ZIP"} is ready
            </p>
            <p className="text-sm text-green-700">Download started automatically.</p>
          </div>
        )}
      </div>

      <p className="text-center mt-6 text-gray-600 text-base">
        No account • No watermark • Files auto-deleted after 1 hour • 100% free •
        Single & batch protection • Works on Windows, Mac, Android & iOS
      </p>
    </div>
  </main>

  {/* ==================== SEO CONTENT SECTION ==================== */}
  <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
        Free PDF Password Protection — Secure Your PDF Files Online Instantly
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Need to share a PDF but keep it private? Add a password to your PDF online free —
        no signup, no watermark, no software needed. Set open password and optional
        permissions for printing, copying, and editing. Works for single and bulk files.
      </p>
    </div>

    {/* Benefits Grid */}
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Password Protected</h3>
        <p className="text-gray-600 text-sm">
          Set an open password so only authorized people can view the PDF —
          no password, no access.
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Permission Controls</h3>
        <p className="text-gray-600 text-sm">
          Restrict printing, copying, and editing using advanced owner password
          permissions — full control over how your PDF is used.
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Batch & Single Protection</h3>
        <p className="text-gray-600 text-sm">
          Protect one PDF or up to 10 files at once. Single file downloads as
          PDF directly. Multiple files download as a ZIP.
        </p>
      </div>
    </div>

    {/* How To Steps */}
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
        How to Password Protect a PDF — 3 Simple Steps
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
          <h4 className="text-lg font-semibold mb-2">Upload Your PDF File(s)</h4>
          <p className="text-gray-600 text-sm">Select one PDF or upload up to 10 files at once for batch protection. Drag and drop supported.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
          <h4 className="text-lg font-semibold mb-2">Set Password & Permissions</h4>
          <p className="text-gray-600 text-sm">Enter the open password required to view the PDF. Optionally set permissions to restrict printing, copying, or editing.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
          <h4 className="text-lg font-semibold mb-2">Download Protected PDF</h4>
          <p className="text-gray-600 text-sm">Single file downloads as a protected PDF instantly. Multiple files are packaged into a ZIP with all protected PDFs inside.</p>
        </div>
      </div>
    </div>

    {/* Contextual Links */}
    <div className="mt-10 bg-white p-6 md:p-8 shadow-sm">
      <h3 className="text-lg md:text-xl font-bold text-slate-900">
        Need to do more with your PDF before protecting?
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Protect is often the final step — prepare your document first with these tools.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>
          <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">Merge PDF</a>{" "}
          <span className="text-slate-600">— combine multiple PDFs into one document before adding password protection.</span>
        </li>
        <li>
          <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">Compress PDF</a>{" "}
          <span className="text-slate-600">— reduce file size before protecting and sharing via email.</span>
        </li>
        <li>
          <a href="/split-pdf" className="text-blue-700 font-semibold hover:underline">Split PDF</a>{" "}
          <span className="text-slate-600">— extract only the sensitive pages before adding password protection.</span>
        </li>
        <li>
          <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">Word to PDF</a>{" "}
          <span className="text-slate-600">— convert your document to PDF first, then protect it with a password.</span>
        </li>
        <li>
          <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
          <span className="text-slate-600">— merge, split, compress, convert & more.</span>
        </li>
      </ul>
    </div>

    <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
      Trusted by professionals, businesses, and students to protect PDF files —
      fast, secure, and always free.
    </p>
  </section>

  {/* ── DEEP SEO CONTENT ── */}
  <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
      PDF Password Protection – Free Online Tool by PDFLinx
    </h2>

    <p className="text-base leading-7 mb-6">
      Need to password protect a PDF without Adobe Acrobat? The{" "}
      <span className="font-medium text-slate-900">PDFLinx Protect PDF tool</span>{" "}
      lets you add a password to any PDF file online free — no software installation,
      no signup, no watermark. Upload your PDF, set a password, and download a
      fully encrypted, protected file in seconds.
    </p>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      What Does Password Protecting a PDF Mean?
    </h3>
    <p className="leading-7 mb-6">
      Password protecting a PDF means encrypting the file so it cannot be opened
      without the correct password. Once protected, anyone who receives the PDF
      must enter the password before viewing the content — making it safe to share
      over email, cloud storage, WhatsApp, or any messaging platform.
    </p>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      Why You Should Password Protect PDF Files
    </h3>
    <ul className="space-y-2 mb-6 list-disc pl-6">
      <li>Prevents unauthorized access to sensitive documents</li>
      <li>Protects confidential business, legal, or financial data</li>
      <li>Secures personal documents shared over email or messaging apps</li>
      <li>Helps maintain data privacy and regulatory compliance</li>
      <li>Prevents accidental editing, copying, or printing by recipients</li>
      <li>Required by many organizations for sharing confidential PDFs externally</li>
    </ul>

    <div className="mt-10 space-y-10">

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          User Password vs Owner Password — What Is the Difference?
        </h3>
        <p className="leading-7">
          A <strong>user password</strong> (open password) is required to open
          and view the PDF — anyone without this password cannot access the file.
          An <strong>owner password</strong> controls permissions — it determines
          whether the recipient can print, copy, or edit the PDF after opening it.
          PDFLinx lets you set both independently: the user password for access
          control, and the owner password for permission restrictions.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Password Protect a PDF Without Adobe Acrobat
        </h3>
        <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
          <li>Upload your PDF to the <a href="/protect-pdf" className="text-blue-700 font-medium hover:underline">Protect PDF tool</a></li>
          <li>Enter a strong open password — minimum 4 characters recommended</li>
          <li>Optionally expand Advanced Permissions to restrict printing, copying, or editing</li>
          <li>Click <strong>Protect PDF Now</strong></li>
          <li>Download your encrypted, password-protected PDF instantly</li>
        </ul>
        <p className="leading-7">
          No Adobe Acrobat, no Microsoft software, no desktop app needed — everything
          runs directly in your browser on any device.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Restrict Printing and Copying of a PDF
        </h3>
        <p className="leading-7">
          Use the <strong>Advanced Permissions</strong> section to control exactly
          what recipients can do after opening the PDF. You can allow or restrict:
        </p>
        <ul className="space-y-2 list-disc pl-6 leading-7 mt-3">
          <li><strong>Printing</strong> — allow or prevent the PDF from being printed</li>
          <li><strong>Copying</strong> — allow or block text selection and copying</li>
          <li><strong>Editing</strong> — allow or prevent modifications to the PDF content</li>
        </ul>
        <p className="leading-7 mt-3">
          These restrictions are enforced by the owner password encryption — they
          apply to all standard PDF viewers including Adobe Reader, Chrome, and Edge.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Common Use Cases for PDF Password Protection
        </h3>
        <ul className="space-y-2 list-disc pl-6 leading-7">
          <li><strong>Legal documents:</strong> Protect contracts, NDAs, and agreements before sending to clients or partners.</li>
          <li><strong>Financial reports:</strong> Secure salary sheets, invoices, and financial summaries before emailing.</li>
          <li><strong>Academic submissions:</strong> Protect thesis documents, research papers, and project reports.</li>
          <li><strong>Business proposals:</strong> Lock down pricing, strategy, and confidential data in client proposals.</li>
          <li><strong>Personal documents:</strong> Protect ID scans, certificates, and personal records shared digitally.</li>
          <li><strong>Medical records:</strong> Secure patient documents and health reports before sharing with providers.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Batch PDF Password Protection
        </h3>
        <p className="leading-7">
          Need to protect multiple PDFs at once? Upload up to{" "}
          <strong>10 PDF files</strong> simultaneously — all protected with the
          same password and permission settings. All protected PDFs are delivered
          as a <strong>ZIP download</strong>. Single PDF uploads download directly
          as a protected PDF without any ZIP.
        </p>
        <p className="leading-7 mt-3">
          Before protecting, you may want to{" "}
          <a href="/merge-pdf" className="text-blue-700 font-medium hover:underline">merge multiple PDFs</a>{" "}
          into one document, or{" "}
          <a href="/compress-pdf" className="text-blue-700 font-medium hover:underline">compress the PDF</a>{" "}
          to reduce file size before sending.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Privacy and File Security
        </h3>
        <p className="leading-7">
          PDF Linx is built with privacy as a core priority. Uploaded PDF files
          are processed over encrypted connections and{" "}
          <strong>permanently deleted after protection</strong> — never stored
          long-term, never shared with third parties, and never used for any
          other purpose. No account creation is required — no email, no password
          stored on our end, no personal data collected.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Protect PDF on Any Device
        </h3>
        <p className="leading-7">
          PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> —
          in any modern browser. No app download, no software installation. Whether
          you are at your desk, on a laptop, or on your phone, you can password
          protect any PDF in seconds. Fully responsive with drag-and-drop file
          upload supported on all devices.
        </p>
      </div>

    </div>

    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        PDFLinx Protect PDF — Feature Summary
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
        <li>Free online PDF password protection — no hidden fees</li>
        <li>Strong encryption — user and owner password support</li>
        <li>Restrict printing, copying, and editing permissions</li>
        <li>Batch protection — up to 10 files at once</li>
        <li>ZIP download for multiple file protection</li>
        <li>Content, layout, and quality unchanged after protection</li>
        <li>Fast processing — protected PDF ready in seconds</li>
        <li>No watermark added to protected files</li>
        <li>Works on desktop and mobile browsers</li>
        <li>Files auto-deleted after processing — privacy protected</li>
        <li>No signup or account required</li>
        <li>Cross-platform: Windows, macOS, Android, iOS</li>
      </ul>
    </div>

    <h3 className="text-xl font-semibold text-slate-900 mb-3">
      Who Should Use This Tool?
    </h3>
    <ul className="space-y-2 mb-6 list-disc pl-6">
      <li><strong>Businesses:</strong> Protect contracts, invoices, proposals, and confidential reports before sharing</li>
      <li><strong>Legal professionals:</strong> Secure NDAs, agreements, and legal correspondence with password encryption</li>
      <li><strong>Students:</strong> Protect academic documents, research papers, and thesis files before submission</li>
      <li><strong>Professionals:</strong> Lock down salary sheets, financial reports, and sensitive business documents</li>
      <li><strong>Freelancers:</strong> Share work securely with clients — restrict copying or editing of delivered files</li>
      <li><strong>Anyone:</strong> Add a password to any PDF before sharing over email, WhatsApp, or cloud storage</li>
    </ul>

    {/* Comparison Section */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-10 mb-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        PDFLinx vs Other PDF Protection Tools
      </h3>
      <p className="leading-7 text-slate-700">
        Unlike many PDF tools that require a paid subscription, force you to create
        an account, or add watermarks to your files — PDFLinx provides fast, secure
        PDF password protection completely free, with no login and no watermark.
        Your files are permanently deleted after processing, and permission controls
        (printing, copying, editing) are available at no cost.
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
            q: "Is this free PDF password protection tool safe to use online?",
            a: "Yes. PDFLinx Protect PDF is completely free and safe. Files are processed over encrypted connections and permanently deleted after protection. No signup required.",
          },
          {
            q: "How do I password protect a PDF without Adobe Acrobat?",
            a: "Upload your PDF to PDFLinx, enter a password, and click Protect PDF Now. No Adobe or any software needed — works directly in your browser on any device.",
          },
          {
            q: "Can I protect multiple PDFs with a password at once?",
            a: "Yes. Upload up to 10 PDF files simultaneously. All protected PDFs are delivered as a single ZIP download.",
          },
          {
            q: "Will password protecting a PDF change its content or quality?",
            a: "No. Adding password protection does not change text, images, layout, or quality. It only adds security encryption to the file.",
          },
          {
            q: "What is the difference between user password and owner password in a PDF?",
            a: "User password is required to open and view the PDF. Owner password controls permissions like printing, copying, and editing. PDFLinx lets you set both separately.",
          },
          {
            q: "Can I restrict printing and copying of a protected PDF?",
            a: "Yes. Use the Advanced Permissions section to allow or restrict printing, copying, and editing in the protected PDF.",
          },
          {
            q: "Can I password protect a PDF on my phone?",
            a: "Yes. PDFLinx works on Android and iOS mobile browsers — no app required.",
          },
          {
            q: "What should I do before protecting a PDF?",
            a: "If you need to combine multiple documents, use the Merge PDF tool first. To reduce file size before protecting and sharing, use Compress PDF. To extract only specific pages, use Split PDF.",
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

  <RelatedToolsSection currentPage="protect-pdf" />
</>
  );
}






















// 'use client';

// import { useState } from 'react';
// import { Upload, Download, Lock, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


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
//     if (!file || !password.trim()) {
//       alert('Please upload a PDF and enter a strong password!');
//       return;
//     }
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('password', password);

//     try {
//       const res = await fetch('/api/convert/protect-pdf', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok || data.error) {
//         throw new Error(data.error || 'Protection failed');
//       }

//       // Backend se direct download path aayega
//       setProtectedUrl(data.download);
//     } catch (err) {
//       console.error(err);
//       alert('Error protecting PDF. Try again with a smaller or text-based PDF.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ==================== SCHEMAS ==================== */}
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

//       {/* ==================== MAIN UI ==================== */}
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
//                     placeholder="Type strong password (min 6 characters)"
//                     className="w-full p-6 text-2xl text-center border-2 border-red-300 rounded-2xl focus:border-orange-500 outline-none"
//                   />
//                   <p className="text-center text-gray-600 mt-4">
//                     Password will be required to open the PDF
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <button
//                     onClick={protect}
//                     disabled={loading || !password.trim()}
//                     className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-red-700 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-2xl"
//                   >
//                     {loading ? 'Protecting PDF...' : 'Protect PDF'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {loading && (
//               <div className="text-center mt-12">
//                 <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-600"></div>
//                 <p className="mt-6 text-2xl font-bold text-red-600">Applying password protection...</p>
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

//       {/* ==================== SEO CONTENT SECTION ==================== */}
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


















// // 'use client';

// // import { useState } from 'react';
// // import { PDFDocument } from 'pdf-lib';
// // import { Upload, Download, Lock, CheckCircle } from 'lucide-react';
// // import Script from 'next/script';

// // export default function ProtectPdf() {
// //   const [file, setFile] = useState(null);
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [protectedUrl, setProtectedUrl] = useState(null);

// //   const handleFile = (e) => {
// //     const selected = e.target.files[0];
// //     if (selected) setFile(selected);
// //   };

// //   const protect = async () => {
// //     if (!file || !password) {
// //       alert('Please upload PDF and enter password!');
// //       return;
// //     }
// //     setLoading(true);

// //     try {
// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdfDoc = await PDFDocument.load(arrayBuffer);
// //       await pdfDoc.encrypt({
// //         userPassword: password,
// //         ownerPassword: password,
// //         permissions: {
// //           printing: 'highResolution',
// //           modifying: false,
// //           copying: false,
// //           annotating: true,
// //           fillingForms: true,
// //           contentAccessibility: true,
// //           documentAssembly: true,
// //         },
// //       });

// //       const pdfBytes = await pdfDoc.save();
// //       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
// //       setProtectedUrl(URL.createObjectURL(blob));
// //     } catch (err) {
// //       alert('Error protecting PDF. Try again.');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <>
// //       <Script
// //         id="howto-schema-protect"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "HowTo",
// //             name: "How to Password Protect PDF Online for Free",
// //             description: "Add password protection to PDF documents instantly.",
// //             url: "https://pdflinx.com/protect-pdf",
// //             step: [
// //               { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
// //               { "@type": "HowToStep", name: "Enter Password", text: "Type strong password." },
// //               { "@type": "HowToStep", name: "Download", text: "Download protected PDF." }
// //             ],
// //             totalTime: "PT30S",
// //             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
// //             image: "https://pdflinx.com/og-image.png"
// //           }, null, 2),
// //         }}
// //       />

// //       <Script
// //         id="breadcrumb-schema-protect"
// //         type="application/ld+json"
// //         strategy="afterInteractive"
// //         dangerouslySetInnerHTML={{
// //           __html: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
// //               { "@type": "ListItem", position: 2, name: "Protect PDF", item: "https://pdflinx.com/protect-pdf" }
// //             ]
// //           }, null, 2),
// //         }}
// //       />

// //       <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
// //               Protect PDF with Password <br /> Online (Free)
// //             </h1>
// //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
// //               Add password protection to your PDF files instantly. Secure your documents — 100% free, no signup.
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
// //             <label className="block cursor-pointer mb-10">
// //               <div className="border-4 border-dashed border-red-300 rounded-3xl p-20 text-center hover:border-orange-500 transition">
// //                 <Upload className="w-24 h-24 mx-auto text-red-600 mb-8" />
// //                 <span className="text-3xl font-bold text-gray-800 block mb-4">
// //                   Drop PDF here or click to upload
// //                 </span>
// //               </div>
// //               <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
// //             </label>

// //             {file && (
// //               <div className="space-y-8">
// //                 <div>
// //                   <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
// //                     <Lock size={28} className="text-red-600" />
// //                     Enter Password
// //                   </label>
// //                   <input
// //                     type="password"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     placeholder="Type strong password"
// //                     className="w-full p-6 text-2xl text-center border-2 border-red-300 rounded-2xl focus:border-orange-500 outline-none"
// //                   />
// //                   <p className="text-center text-gray-600 mt-4">
// //                     Password will be required to open the PDF
// //                   </p>
// //                 </div>

// //                 <div className="text-center">
// //                   <button
// //                     onClick={protect}
// //                     disabled={loading || !password}
// //                     className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-16 py-6 rounded-full hover:from-red-700 hover:to-orange-700 disabled:opacity-60 transition shadow-2xl"
// //                   >
// //                     {loading ? 'Protecting...' : 'Protect PDF'}
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {protectedUrl && (
// //               <div className="text-center mt-12">
// //                 <p className="text-3xl font-bold text-green-600 mb-6">PDF Protected Successfully!</p>
// //                 <a
// //                   href={protectedUrl}
// //                   download="protected-pdf.pdf"
// //                   className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:from-green-700 hover:to-teal-700 transition shadow-2xl"
// //                 >
// //                   <Download size={36} />
// //                   Download Protected PDF
// //                 </a>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>

// //       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
// //             Password Protect PDF Online Free - Secure Your Documents
// //           </h2>
// //           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
// //             Add password protection to PDF files instantly. Prevent unauthorized access — perfect for sensitive documents. Completely free with PDF Linx.
// //           </p>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-10 mb-20">
// //           <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-3xl shadow-xl border border-red-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <Lock className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Strong Protection</h3>
// //             <p className="text-gray-600">Password required to open — full encryption.</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy to Use</h3>
// //             <p className="text-gray-600">Just upload, enter password, download — done!</p>
// //           </div>

// //           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
// //             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="w-10 h-10 text-white" />
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & Private</h3>
// //             <p className="text-gray-600">Protect unlimited PDFs — no signup, no upload.</p>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
// //           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
// //             How to Password Protect PDF in 3 Simple Steps
// //           </h3>
// //           <div className="grid md:grid-cols-3 gap-12">
// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 1
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Upload PDF</h4>
// //               <p className="text-gray-600 text-lg">Drop or select your document.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 2
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Enter Password</h4>
// //               <p className="text-gray-600 text-lg">Type strong password to protect.</p>
// //             </div>

// //             <div className="text-center">
// //               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
// //                 3
// //               </div>
// //               <h4 className="text-2xl font-semibold mb-4">Download</h4>
// //               <p className="text-gray-600 text-lg">Save password-protected PDF.</p>
// //             </div>
// //           </div>
// //         </div>

// //         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
// //           Protect PDFs every day with PDF Linx — trusted by professionals for fast, secure, and completely free document protection.
// //         </p>
// //       </section>
// //     </>
// //   );
// // }
