"use client";

// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Key,
  Lock,
  ShieldCheck,
  Download,
  MonitorSmartphone,
  CheckCircle,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";


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
        id="howto-schema-protect"
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
        id="breadcrumb-schema-protect"
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
        id="faq-schema-protect"
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
        uploadLanding={{
          content: {
            eyebrow: "PROTECT PDF",

            heroTitle: (
              <>
                Password Protect PDF <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly
                </em>
              </>
            ),

            heroDescription:
              "Add a password to your PDF online for free — no signup, no watermark, no software needed. Set an open password, restrict printing, copying, and editing. Protect single or multiple PDFs in seconds.",

            noticeTitle: "Protection output",

            noticeItems: [
              "Single PDF → Protected PDF download",
              "Multiple PDFs → ZIP download",
              "Set open password + permissions",
            ],

            howToTitle: "How to password protect a PDF",

            howToSubtitle:
              "Upload your PDF, enter a password, set permissions if needed, and download an encrypted protected PDF instantly.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF file(s)",
                desc: "Select one PDF or upload up to 10 files at once for batch protection. Drag and drop supported.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Set password & permissions",
                desc: "Enter the open password required to view the PDF. Optionally restrict printing, copying, and editing.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download protected PDF",
                desc: "Single file downloads as a protected PDF. Multiple files are packaged into a ZIP instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx to protect PDF?",

            whyItems: [
              {
                title: "Password Protected Access",
                desc: "Set an open password so only authorized people can view the PDF — no password, no access.",
                icon: Lock,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                title: "Permission Controls",
                desc: "Restrict printing, copying, and editing using advanced owner password permissions — full control over how your PDF is used.",
                icon: ShieldCheck,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "Batch PDF Protection",
                desc: "Protect one PDF or up to 10 files at once. All protected PDFs are delivered as a single ZIP download.",
                icon: Download,
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                title: "Content Unchanged",
                desc: "Adding password protection does not change text, images, layout, or quality — only encryption is added.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
              {
                title: "Works Everywhere",
                desc: "Use PDFLinx on Windows, macOS, Linux, Android, iPhone, tablet, or any modern desktop browser.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Privacy First",
                desc: "Files are processed over encrypted connections and permanently deleted after protection. No account needed.",
                icon: Key,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Password Protection Guide",

            seoTitle: "Free Online PDF Password Protection Tool by PDFLinx",

            seoDescription:
              "Add a password to your PDF online for free. Set open passwords, restrict printing, copying, and editing. Protect single or multiple PDFs with no signup or software.",

            seoSections: [
              {
                title: "Encrypt PDF Files with a Password",
                text: "PDFLinx lets you add strong encryption to any PDF so it cannot be opened without the correct password — safe to share via email, cloud storage, or messaging apps.",
              },
              {
                title: "User Password vs Owner Password",
                text: "The user password is required to open and view the PDF. The owner password controls permissions — allowing or restricting printing, copying, and editing independently.",
              },
              {
                title: "Restrict Printing, Copying & Editing",
                text: "Use Advanced Permissions to lock down exactly what recipients can do after opening the PDF. Restrictions apply in all standard PDF viewers including Adobe Reader, Chrome, and Edge.",
              },
              {
                title: "Batch PDF Password Protection",
                text: "Upload up to 10 PDFs at once — all protected with the same password and permission settings. Multiple protected PDFs are delivered as a single ZIP download.",
              },
              {
                title: "Works on Mobile and Desktop",
                text: "Use the PDFLinx protect PDF tool in your browser on Windows, macOS, Linux, Android, iPhone, and tablets with no app or software installation required.",
              },
              {
                title: "No Signup, No Watermark",
                text: "Password protect your PDF online for free with no account required, no watermark added, and files permanently deleted after processing.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: [
              {
                q: "Is this free PDF password protection tool safe to use online?",
                a: "Yes. PDFLinx Protect PDF is completely free and safe. Files are processed over encrypted connections and permanently deleted after protection. No signup required.",
              },
              {
                q: "How do I password protect a PDF without Adobe Acrobat?",
                a: "Upload your PDF to PDFLinx, enter a password, and click Protect PDF Now. No Adobe or any software needed — works directly in your browser.",
              },
              {
                q: "Can I protect multiple PDFs with a password at once?",
                a: "Yes. Upload up to 10 PDF files simultaneously. All protected PDFs are delivered as a single ZIP download.",
              },
              {
                q: "Will password protecting a PDF change its content or quality?",
                a: "No. Adding password protection does not change text, images, or layout. It only adds security encryption to the file.",
              },
              {
                q: "What is the difference between user password and owner password?",
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
            ],
          },
        }}
      />

    </>
  );
}




