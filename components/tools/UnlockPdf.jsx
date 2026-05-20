"use client";

// import { useState } from "react";
import { useState, useRef, useEffect } from "react";

import {
  FileText,
  Key,
  LockOpen,
  Download,
  ShieldCheck,
  MonitorSmartphone,
  CheckCircle,
  Lock,
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

export default function UnlockPdf() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [outputFilename, setOutputFilename] = useState("unlocked.pdf");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
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

    flow.startProcessing();
    startProgress();
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);
    if (password.trim()) formData.append("password", password.trim());

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
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(url);

      const isZip = contentType.includes("application/zip");
      const firstName = files[0]?.name?.replace(/\.pdf$/i, "") || "unlocked";
      setOutputFilename(
        isZip ? "pdflinx-unlocked-pdfs.zip" : `${firstName}-unlocked.pdf`
      );

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      const msg = (err?.message || "Something went wrong. Please try again.").toString();

      if (msg.toLowerCase().includes("password")) {
        setError(
          "This PDF requires a password to open (user password). Please enter the correct password and try again."
        );
        flow.handleError("Incorrect password. Please try again.");
      } else {
        setError(msg);
        flow.handleError(msg);
      }
      console.error(err);
    }
  };

  // ── Options slot: password field ──
  // const optionsSlot = (
  //   <div className="space-y-5">
  //     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  //       <h3 className="text-base font-bold text-slate-900">Unlock settings</h3>
  //       <p className="mt-1 text-sm text-slate-500">
  //         Enter password only if the PDF requires one to open.
  //       </p>

  //       <div className="mt-5">
  //         <label className="block text-sm font-semibold text-slate-700 mb-2">
  //           Password (optional)
  //         </label>
  //         <div className="relative">
  //           <Key className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
  //           <input
  //             type="password"
  //             placeholder="Enter only if PDF requires a password to open"
  //             value={password}
  //             onChange={(e) => {
  //               setPassword(e.target.value);
  //               setError("");
  //             }}
  //             className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500"
  //           />
  //         </div>
  //         <p className="text-xs text-slate-500 mt-2">
  //           Leave blank for PDFs with only printing, copying, or editing restrictions.
  //           Enter the correct password only if the PDF is locked for opening.
  //         </p>
  //       </div>
  //     </div>

  //     {error && (
  //       <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
  //         <p className="font-semibold">{error}</p>
  //       </div>
  //     )}
  //   </div>
  // );

  const optionsSlot = (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Enter password only if the PDF requires one to open.
      </p>

      {/* Password field */}
      <div className="relative">
        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="password"
          placeholder="Type password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#f24d0d] focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-unlock"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Unlock a PDF Online for Free",
              description:
                "Unlock PDF online free — remove printing, copying, and editing restrictions instantly. No signup, no watermark, no software needed. Works on Windows, Mac, Android, iOS.",
              url: "https://pdflinx.com/unlock-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF file(s)",
                  text: "Upload a single PDF or select multiple PDFs at the same time.",
                },
                {
                  "@type": "HowToStep",
                  name: "Enter password (only if required)",
                  text: "If your PDF requires a password to open, enter it. Otherwise leave it blank.",
                },
                {
                  "@type": "HowToStep",
                  name: "Unlock and download",
                  text: "Click Unlock PDF Now. Download the unlocked PDF or ZIP if multiple files.",
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
        id="breadcrumb-schema-unlock"
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
                  name: "Unlock PDF",
                  item: "https://pdflinx.com/unlock-pdf",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-unlock"
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
                  name: "Can I unlock a PDF without a password?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — if the PDF only has printing, copying, or editing restrictions (owner lock). If it requires a password to open (user lock), you must enter the correct password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the difference between user password and owner password?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "User password is required to open and view the PDF. Owner password restricts actions like printing, copying, or editing. Owner restrictions can often be removed without needing any password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will my unlocked PDF look the same after conversion?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Unlocking only removes restrictions — it does not change text, images, layout, or quality in any way.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my files safe and private?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Files are processed securely over encrypted connections and permanently deleted after unlocking. They are never stored long-term or shared with third parties.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I unlock multiple PDFs at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Upload up to 10 PDF files simultaneously. All unlocked PDFs are delivered as a single ZIP download.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is PDFLinx cracking or bypassing passwords?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. PDFLinx removes owner permission restrictions, or unlocks files using the password you provide. PDFs that require an opening password cannot be unlocked without the correct password.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I unlock a PDF on my phone?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. PDFLinx works on Android and iOS mobile browsers — no app download required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What should I do after unlocking a PDF?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "After unlocking, you can protect it again with a new password using the Protect PDF tool, merge it with other documents, compress it for sharing, or split it into individual pages.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ==================== TOOL UI ==================== */}
      <ToolPageLayout
        title="Unlock PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept=".pdf,application/pdf"
        multiple={true}
        convertLabel="Unlock PDF Now"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsTitle="Unlock options"
        optionsSlot={optionsSlot}

        customOptionsLayout={
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] min-h-[calc(100vh-80px)]">

            {/* LEFT — Thumbnails */}
            <div className="relative bg-slate-100 p-8 overflow-y-auto h-[calc(100vh-80px)]">
              <div className="absolute right-4 top-4">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-green-500 bg-white px-3 py-1.5 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50">
                  + Add more
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
                  Unlock PDF
                </h3>
                <p className="text-sm text-slate-500">
                  Enter password only if the PDF requires one to open.
                </p>

                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Type password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#f24d0d] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 p-4">
                <button type="button" onClick={handleConvert}
                  disabled={!flow.files.length}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
                      ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                      : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  <LockOpen className="h-5 w-5" />
                  Unlock PDF Now
                </button>
              </div>
            </div>
          </div>
        }

        processingTitle="Unlocking your PDF..."
        processingDescription="Removing restrictions from your file. Please wait."
        processingStages={["Uploading", "Removing restrictions", "Done"]}
        doneTitle="Your unlocked PDF is ready"
        doneDescription="Click download to save your restriction-free PDF."
        downloadLabel="Download Unlocked PDF"
        resetLabel="Unlock another PDF"
        sidebarTitle="Unlock PDF"
        sidebarIcon={<LockOpen className="h-5 w-5 text-white" />}
        sidebarDescription="Remove printing, copying, and editing restrictions from any PDF instantly."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Unlock</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Single file → Unlocked PDF</li>
              <li>Multiple files → ZIP download</li>
              <li>Owner lock → no password needed</li>
              <li>User lock → enter open password</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        uploadTitle="Drop your PDF file(s) here"
        uploadSubtitle="or click to browse — PDF files supported"
        uploadLanding={{
          content: {
            eyebrow: "UNLOCK PDF",

            heroTitle: (
              <>
                Unlock PDF Restrictions <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly
                </em>
              </>
            ),

            heroDescription:
              "Unlock PDF online for free — remove printing, copying, and editing restrictions instantly. No signup, no watermark, no software needed. If your PDF requires a password to open, just enter it and we'll unlock it for you.",

            noticeTitle: "Unlock output",

            noticeItems: [
              "Single PDF → Unlocked PDF download",
              "Multiple PDFs → ZIP download",
              "Owner lock removed automatically",
            ],

            howToTitle: "How to unlock a PDF",

            howToSubtitle:
              "Upload your PDF, enter a password only if needed, and download a fully unlocked restriction-free PDF instantly.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF file(s)",
                desc: "Select one PDF or upload up to 10 files at once for batch unlocking. Drag and drop supported on all devices.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Enter password (if required)",
                desc: "Leave blank for owner-locked PDFs with print/copy restrictions. Enter password only if the PDF requires one to open.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download unlocked PDF",
                desc: "Single file downloads as an unlocked PDF. Multiple files are packaged into a ZIP with all unlocked PDFs inside.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx to unlock PDF?",

            whyItems: [
              {
                title: "Remove Restrictions Instantly",
                desc: "Unlock printing, copying, and editing restrictions (owner protection) in one click — no password needed for owner-locked PDFs.",
                icon: LockOpen,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                title: "Password When Needed",
                desc: "If your PDF requires a password to open (user protection), enter it to unlock safely — content and layout stay exactly as original.",
                icon: Key,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "Batch PDF Unlocking",
                desc: "Unlock one PDF or up to 10 files at once. All unlocked PDFs are delivered as a single ZIP download.",
                icon: Download,
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                title: "Content Unchanged",
                desc: "Unlocking only removes restrictions — it does not change text, images, layout, or quality in any way.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },
              {
                title: "Works Everywhere",
                desc: "Use PDFLinx on Windows, macOS, Linux, Android, iPhone, tablet, or any modern desktop browser with no app needed.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },
              {
                title: "Privacy First",
                desc: "Files are processed over encrypted connections and permanently deleted after unlocking. No account or signup needed.",
                icon: ShieldCheck,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Unlock Guide",

            seoTitle: "Free Online PDF Unlock Tool by PDFLinx",

            seoDescription:
              "Remove PDF restrictions online for free. Unlock printing, copying, and editing from owner-locked PDFs. Enter password for user-locked PDFs. No signup or software needed.",

            seoSections: [
              {
                title: "Remove Owner Restrictions Without a Password",
                text: "PDFLinx automatically removes owner permission restrictions — unlock printing, copying, and editing from restricted PDFs without needing the owner password.",
              },
              {
                title: "User Password vs Owner Password",
                text: "Owner password restricts actions like printing and copying (removable automatically). User password is required to open the file — enter it to unlock user-locked PDFs.",
              },
              {
                title: "Batch PDF Unlocking",
                text: "Upload up to 10 PDFs at once — all unlocked with the same password if provided. All unlocked PDFs are delivered as a single ZIP download.",
              },
              {
                title: "Content and Quality Unchanged",
                text: "Unlocking only removes encryption restrictions — your text, images, layout, and formatting remain exactly as in the original PDF.",
              },
              {
                title: "Works on Mobile and Desktop",
                text: "Use the PDFLinx unlock PDF tool directly in your browser on Windows, macOS, Linux, Android, iPhone, and tablets — no app or software installation required.",
              },
              {
                title: "No Signup, No Watermark",
                text: "Unlock your PDF online for free with no account required, no watermark added, and files permanently deleted after processing.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: [
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
            ],
          },
        }}
      />

    </>
  );
}

