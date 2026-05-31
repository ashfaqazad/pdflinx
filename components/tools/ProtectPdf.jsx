"use client";

// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Key,
  Lock,
  ShieldCheck,
  LockOpen, PenLine, Stamp, EyeOff,
  Minimize2, GitMerge, Pencil, Scan
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


const DONE_LINKS = [
  { label: "Unlock PDF",     href: "/unlock-pdf",     icon: <LockOpen        className="h-4 w-4 text-green-500"   /> },
  { label: "Sign PDF",       href: "/sign-pdf",       icon: <PenLine         className="h-4 w-4 text-indigo-500"  /> },
  { label: "Add Watermark",  href: "/add-watermark",  icon: <Stamp           className="h-4 w-4 text-teal-500"    /> },
  { label: "Redact PDF",     href: "/redact-pdf",     icon: <EyeOff          className="h-4 w-4 text-gray-500"    /> },
  { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2       className="h-4 w-4 text-green-500"   /> },
  { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge        className="h-4 w-4 text-purple-500"  /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
  { label: "OCR PDF",        href: "/ocr-pdf",        icon: <Scan            className="h-4 w-4 text-violet-500"  /> },
];


function PdfThumbnail({ url }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!url || !window.pdfjsLib) return;
    const tryRender = () => {
      if (!window.pdfjsLib) return setTimeout(tryRender, 100);
      window.pdfjsLib.getDocument(url).promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
          const viewport = page.getViewport({ scale: 0.6 });
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          page.render({ canvasContext: canvas.getContext("2d"), viewport });
        }).catch(console.error);
    };
    tryRender();
  }, [url]);
  return <canvas ref={canvasRef} className="h-full w-full object-contain bg-white" />;
}

export default function ProtectPdf() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFilename, setOutputFilename] = useState("protected.pdf");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const validatePassword = (p) => {
    const pass = (p || "").trim();
    if (!pass) return "Please enter a password.";
    if (pass.length < 4) return "Password should be at least 4 characters.";
    if (pass.length > 128) return "Password is too long.";
    return null;
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    const files = flow.files;
    if (!files?.length) {
      setError("Please select at least one PDF file first!");
      return;
    }

    const pwErr = validatePassword(userPassword);
    if (pwErr) {
      setError(pwErr);
      return;
    }

    flow.startProcessing();
    startProgress();
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);
    formData.append("userPassword", userPassword.trim());
    if (ownerPassword.trim()) formData.append("ownerPassword", ownerPassword.trim());
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
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(url);

      const isZip = contentType.includes("application/zip");
      const firstName = files[0]?.name?.replace(/\.pdf$/i, "") || "protected";
      setOutputFilename(
        isZip ? "pdflinx-protected-pdfs.zip" : `${firstName}-protected.pdf`
      );

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      const msg = (err?.message || "Something went wrong. Please try again.").toString();
      setError(msg);
      flow.handleError(msg);
      console.error(err);
    }
  };

  // ── Options slot: password fields + advanced permissions ──
  const optionsSlot = (
    <div className="space-y-5">
      {/* Password to open */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Password settings</h3>
        <p className="mt-1 text-sm text-slate-500">
          Set an open password and optional advanced permissions.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password to open PDF
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Set a password to open this PDF"
                value={userPassword}
                onChange={(e) => {
                  setUserPassword(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              This password will be required to open the PDF.
            </p>
          </div>

          {/* Advanced toggle */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between font-semibold text-slate-800"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Advanced permissions
              </span>
              <span className="text-sm text-slate-500">
                {showAdvanced ? "Hide" : "Show"}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Owner password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Optional: set an owner password for permissions"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    If left blank, a secure owner password is generated on the server.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Allow printing", checked: allowPrint, set: setAllowPrint },
                    { label: "Allow copy", checked: allowCopy, set: setAllowCopy },
                    { label: "Allow editing", checked: allowEdit, set: setAllowEdit },
                  ].map(({ label, checked, set }) => (
                    <label
                      key={label}
                      className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => set(e.target.checked)}
                      />
                      <span className="text-sm text-slate-800">{label}</span>
                    </label>
                  ))}
                </div>

                <p className="text-xs text-slate-500">
                  Permissions are controlled by the owner password. The open password
                  is still required to open the file.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-protect-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
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
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-protect-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Protect PDF",
                  item: "https://pdflinx.com/protect-pdf",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-protect-pdf"
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
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="software-schema-protect-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Protect PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/protect-pdf",
            description:
              "Free online PDF protection tool. Add password security to PDF files and prevent unauthorized access to sensitive documents. Encrypt PDFs quickly and securely in your browser.",
            image: "https://pdflinx.com/og-image.png",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            },
            publisher: {
              "@type": "Organization",
              name: "PDFLinx",
              url: "https://pdflinx.com"
            },
            featureList: [
              "Password protect PDF files",
              "Encrypt PDF documents",
              "Secure sensitive information",
              "Prevent unauthorized access",
              "Fast PDF protection",
              "Works in any web browser",
              "Free online PDF security tool",
              "No software installation required"
            ]
          }, null, 2),
        }}
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      {/* ==================== TOOL UI ==================== */}
      <ToolPageLayout
        title="Password Protect PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept=".pdf,application/pdf"
        multiple={true}
        convertLabel="Protect PDF Now"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Protection options"
        optionsSlot={optionsSlot}


        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

            {/* LEFT — Thumbnails */}
            <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">
              <div className="absolute right-4 top-4">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-green-500 bg-white px-3 py-1.5 text-sm font-medium text-green-600 shadow-sm transition hover:bg-green-50">
                  <span>+</span> Add more
                  <input type="file" accept="application/pdf" multiple className="hidden"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      if (newFiles.length) flow.selectFiles([...flow.files, ...newFiles]);
                    }}
                  />
                </label>
              </div>
              <div className="flex flex-wrap justify-center gap-6 pt-10">
                {flow.files.map((file, i) => (
                  <div key={i} className="group flex w-[140px] flex-col items-center gap-3">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <PdfThumbnail url={URL.createObjectURL(file)} />
                      <button type="button" onClick={() => handleRemoveFile(i)}
                        className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600">
                        ×
                      </button>
                    </div>
                    <p className="w-full truncate text-center text-xs text-slate-500">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Password Sidebar */}
            <div className="flex flex-col border-l border-slate-200 bg-white h-[calc(100vh-80px)]">
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3">
                  Protect PDF
                </h3>
                <p className="text-sm text-slate-500">Set a password to protect your PDF file</p>

                {/* Password field */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Type password"
                    value={userPassword}
                    onChange={(e) => { setUserPassword(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#f24d0d] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Repeat password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#f24d0d] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>

              {/* Protect button */}
              <div className="border-t border-slate-200 p-4">
                <button type="button" onClick={handleConvert}
                  disabled={!flow.files.length}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
                    ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  <Lock className="h-5 w-5" />
                  Protect PDF
                </button>
              </div>
            </div>
          </div>
        }


        processingTitle="Protecting your PDF..."
        processingDescription="Encrypting your file securely. Please wait."
        processingStages={["Uploading", "Encrypting", "Done"]}
        doneTitle="Your protected PDF is ready"
        doneDescription="Click download to save your encrypted PDF."
        downloadLabel="Download Protected PDF"
        resetLabel="Protect another PDF"
        sidebarTitle="Protect PDF"
        sidebarIcon={<Lock className="h-5 w-5 text-white" />}
        sidebarDescription="Add a password to your PDF — control who can open, print, copy, or edit it."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Protection</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Single file → Protected PDF</li>
              <li>Multiple files → ZIP download</li>
              <li>Set open + owner passwords</li>
              <li>Control print, copy & edit</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF file(s) here"
        uploadSubtitle="or click to browse — PDF files supported"

        // ============================================================
        // PROTECT PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS, 
            eyebrow: "PROTECT PDF WITH PASSWORD",

            breadcrumbCurrent: "Protect PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Protect PDF with Password —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, AES Encrypted
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Add password protection to any PDF online for free. Encrypt with AES-128 or AES-256 — restrict opening, editing, copying, and printing. No signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "AES-128 & AES-256 encryption",
            //   "Restrict open, edit & print",
            //   "No watermark added",
            //   "Instant download",
            // ],

            heroTitle: (
              <>
                Protect PDF with Password— {" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Encrypt PDF Free Online
                </em>
              </>
            ),
            heroDescription:
              "Password protect PDF online free — add AES-256 encryption to prevent unauthorized access instantly. Set open password and permissions password. No signup, files auto-deleted after processing.",
            pills: ["AES-256 encryption", "Open & permissions password", "Files auto-deleted", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Protect PDF Info",
            noticeItems: [
              "Set open password — restrict who can view",
              "Set permissions — restrict editing, copying & printing",
              "AES-256 encryption for maximum security",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Protect a PDF with Password — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, set password, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with any PDF — reports, contracts, invoices, or personal documents.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Set Your Password & Permissions",
                desc: "Enter a strong open password that recipients must enter to view the PDF. Optionally restrict permissions — prevent editing, copying text, or printing. Choose AES-128 or AES-256 encryption strength.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Protected PDF",
                desc: "Click Protect and your encrypted PDF is ready in seconds. Anyone who receives it will need your password to open it — share it securely knowing the content is protected.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Password Protection Tool Online",

            seoBadge: "Protect PDF Guide",
            seoTitle: "Complete Guide to Password Protecting a PDF Online",
            seoDescription:
              "Everything you need to know about adding password protection and encryption to a PDF — free, online, AES-256 encryption. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Password Protector — Encrypt Any PDF with a Password Online",
                text: "Need to password protect a PDF? PDFLinx lets you add strong encryption and password protection to any PDF online for free — instantly and without any software installation. Whether it is a confidential business report, a legal contract, financial statements, personal identity documents, or any sensitive file, PDFLinx secures it with AES encryption in seconds. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "Open Password vs Permissions Password — What is the Difference?",
                text: "PDF password protection works on two levels. An open password — also called a user password — is required just to open and view the PDF. Anyone who tries to open the file without this password will be blocked completely. A permissions password — also called an owner password — allows the file to be opened and viewed but restricts what the recipient can do with it — preventing editing, copying text, printing, or extracting pages. PDFLinx lets you set either or both types of protection depending on how you want to control access to your document.",
              },
              {
                title: "AES-128 vs AES-256 Encryption — Which Should You Choose?",
                text: "Both AES-128 and AES-256 are industry-standard encryption algorithms used in banking, government, and enterprise security. AES-128 provides strong encryption that is more than sufficient for everyday document security — contracts, reports, and personal files. AES-256 provides the highest level of encryption available for PDF protection — recommended for highly sensitive documents such as legal filings, financial records, medical files, and confidential business data. For most users AES-256 is the right choice — it adds no meaningful processing time and gives you maximum security.",
              },
              {
                title: "What Permissions Can You Restrict on a Protected PDF?",
                text: "Beyond blocking access with an open password, PDF permissions let you control what an authorized recipient can do after opening the file. PDFLinx lets you restrict printing — so the PDF can be viewed on screen but not printed. You can restrict content copying — so text cannot be selected and copied out of the document. You can restrict editing — so the PDF cannot be modified, annotated, or filled in. You can restrict page extraction — so individual pages cannot be pulled out and saved separately. These permission controls are especially useful for distributing proprietary content, draft documents, or paid materials.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Protection Tool — No Watermark, No Limits",
                text: "Most free PDF password tools either add their own watermark, restrict encryption strength on free plans, or require account creation. PDFLinx does none of that — completely free, full AES-256 encryption, no signup, no watermark, and no daily limit. Unlike iLovePDF and Smallpdf which restrict encryption options on free tiers, PDFLinx gives you professional-grade PDF protection at zero cost.",
              },
              {
                title: "Common Use Cases for Password Protecting a PDF",
                text: "✓ Business & Legal: Encrypt contracts, NDAs, board reports, and legal documents before sharing with clients, partners, or external parties.\n✓ Finance & Accounting: Protect financial statements, payroll records, tax documents, and invoices containing sensitive numerical data.\n✓ HR & Administration: Secure employee records, offer letters, performance reviews, and salary information before distribution.\n✓ Healthcare: Protect patient records, medical reports, and health documents that must be kept confidential.\n✓ Education: Restrict access to exam papers, answer sheets, and course materials before scheduled release.\n✓ Personal: Protect identity documents, scanned passports, bank statements, and personal records shared over email.",
              },
              {
                title:
                  "Protect PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the protected file in seconds. Whether you need to password protect a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security — How PDFLinx Handles Your Document",
                text: "Your files are processed on secure servers over encrypted HTTPS connections and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. The password you set is applied to the PDF file itself — PDFLinx does not record or store your password. After download, only someone with your password can open the protected file. Your data stays yours, completely.",
              },
              {
                title: "How Strong Should Your PDF Password Be?",
                text: "The strength of PDF encryption is only as good as the password protecting it. A short or common password like '1234' or 'password' can be guessed quickly regardless of encryption level. For meaningful protection, use a password of at least 10 characters combining uppercase and lowercase letters, numbers, and symbols. Avoid dictionary words, names, and dates. If you are protecting a highly sensitive document, consider using a randomly generated password and sharing it with the recipient through a separate secure channel — not in the same email as the PDF.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF protection tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of PDFs you protect or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and set a password instantly — no email, no registration, no friction.",
              },
              {
                q: "What encryption does PDFLinx use for PDF protection?",
                a: "PDFLinx supports AES-128 and AES-256 encryption — both industry-standard algorithms. AES-256 is recommended for maximum security on sensitive documents.",
              },
              {
                q: "What is the difference between an open password and a permissions password?",
                a: "An open password blocks anyone from viewing the PDF without entering it. A permissions password allows viewing but restricts what the recipient can do — such as printing, copying, or editing.",
              },
              {
                q: "Can I restrict printing and copying without blocking access?",
                a: "Yes. Set permissions restrictions without an open password — the PDF can be opened and viewed freely but printing, copying, and editing are blocked.",
              },
              {
                q: "Does PDFLinx store or record the password I set?",
                a: "No. The password is applied directly to the PDF file during processing. PDFLinx does not record, store, or have access to your password after the file is generated.",
              },
              {
                q: "Does PDFLinx add any watermark to the protected PDF?",
                a: "No watermarks, ever. Your protected PDF is 100% clean — only your password and encryption settings are applied.",
              },
              {
                q: "Is my file secure and private during processing?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large PDFs, try splitting first using our free PDF Split tool, protect each part, then merge them back.",
              },
              {
                q: "Can I protect a PDF that is already password protected?",
                a: "You need to unlock the existing password first. Use our free PDF Unlock tool to remove the current password, then apply new protection settings.",
              },
              {
                q: "What happens if I forget the password I set?",
                a: "PDFLinx does not store your password — if you forget it, the PDF cannot be recovered through PDFLinx. Always save the password in a secure place before sharing the protected file.",
              },
              {
                q: "Will the PDF content or quality change after protection?",
                a: "No. Password protection only adds an encryption layer to the file — all content, formatting, images, and quality remain exactly as in the original.",
              },
              {
                q: "How long does PDF protection take?",
                a: "Most operations complete within 5 to 10 seconds depending on file size.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for PDF password protection?",
                a: "Yes — PDFLinx offers full AES-256 encryption with permission controls, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict encryption options behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Password protect your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx to secure their PDF documents with strong encryption every day.",
            ctaButton: "Choose PDF File",
          },
        }}


      />

    </>
  );
}




