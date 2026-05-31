"use client";

// import { useState } from "react";
import { useState, useRef, useEffect } from "react";

import {
  Key,
  LockOpen,
  Shield, PenLine, FileText, Scissors,
  Minimize2, GitMerge, EyeOff, Scan, Pencil, Stamp  
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";



const DONE_LINKS = [
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Sign PDF", href: "/sign-pdf", icon: <PenLine className="h-4 w-4 text-indigo-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Redact PDF", href: "/redact-pdf", icon: <EyeOff className="h-4 w-4 text-gray-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
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

      <Script
        id="software-schema-unlock-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Unlock PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/unlock-pdf",
            description:
              "Free online PDF unlock tool. Remove password protection and restrictions from PDF files when you have authorization to access the document. Quickly unlock PDFs for viewing, editing, printing, and copying.",
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
              "Unlock protected PDF files",
              "Remove PDF password restrictions",
              "Enable PDF editing and printing",
              "Allow text copying from PDFs",
              "Fast PDF unlocking",
              "Works in any web browser",
              "Free online PDF unlock tool",
              "No software installation required"
            ]
          }, null, 2),
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
        sidebarLinks={DONE_LINKS}
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


        // ============================================================
        // UNLOCK PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "UNLOCK PDF",

            breadcrumbCurrent: "Unlock PDF",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Unlock PDF —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Remove Password Free Online
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Remove password protection from any PDF online for free. Unlock PDFs you own instantly — no signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "Remove open password",
            //   "Remove permission restrictions",
            //   "Instant unlock",
            // ],

            heroTitle: (
              <>
                Unlock PDF — Remove PDF Password{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Free Online, Instant
                </em>
              </>
            ),
            heroDescription:
              "Unlock PDF and remove password protection online for free — get a fully unlocked, editable PDF in seconds. Works on owner-restricted and encrypted PDFs. No signup required.",
            pills: ["Remove PDF password", "Owner restrictions lifted", "Instant unlock", "No signup"],



            uploadTitle: "Drop your password-protected PDF here",
            uploadSubtitle: "or click to browse — enter password when prompted",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Unlock PDF Info",
            noticeItems: [
              "Enter the known PDF password to unlock",
              "Removes open password & permission locks",
              "Downloads as fully unlocked PDF",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Unlock a PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, enter your password, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your Protected PDF",
                desc: "Select your password-protected PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. The tool detects the protection type automatically.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Enter the PDF Password",
                desc: "Type the password you already know for this PDF. PDFLinx verifies it and removes the protection — open password, permission restrictions, or both.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your Unlocked PDF",
                desc: "Click Unlock and your password-free PDF is ready in seconds. No password needed to open it — edit, print, copy, and share without restrictions.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF Unlock Tool Online",

            seoBadge: "Unlock PDF Guide",
            seoTitle: "Complete Guide to Unlocking Password-Protected PDFs Online",
            seoDescription:
              "Everything you need to know about removing password protection from PDFs you own — free, online, instant. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF Unlocker — Remove Password Protection from Any PDF You Own Online",
                text: "Need to unlock a PDF? PDFLinx lets you remove password protection from any PDF online for free — instantly and without any software installation. If you have a PDF that requires a password to open, or a PDF that blocks printing, copying, and editing due to permission restrictions, PDFLinx removes all of that in seconds once you provide the correct password. No signup, no watermark, no hidden limits. Works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "Why Do PDFs Get Locked — Common Reasons",
                text: "PDFs end up password protected for several common reasons. Documents sent by banks, insurance companies, HR departments, and government agencies are often password-protected by default — with the password communicated separately via email or SMS. PDFs you protected yourself months or years ago may become inconvenient when you need to edit or use them again. Downloaded PDF forms from official websites sometimes have permission restrictions that prevent filling or printing. Received PDFs from colleagues or clients may have editing locks that prevent you from annotating or signing them. In all these cases where you own or have legitimate access to the document, PDFLinx removes the protection instantly.",
              },
              {
                title: "Open Password Removal vs Permission Restriction Removal",
                text: "There are two types of PDF locks that PDFLinx can remove. An open password lock requires anyone who tries to open the PDF to enter a password — completely blocking access without it. PDFLinx removes this by verifying the password you provide and stripping it from the file. A permissions lock does not block viewing but restricts actions — printing, copying text, editing, or extracting pages. PDFLinx removes permission restrictions so you can freely print, copy, edit, and use the document without limitations. Both types of locks are handled in the same simple workflow.",
              },
              {
                title: "Important — PDFLinx Only Unlocks PDFs You Have the Password For",
                text: "PDFLinx is a legitimate tool for removing protection from PDFs you own or have authorized access to — documents you protected yourself, files sent to you with the password, or PDFs from your own organization. To unlock a PDF, you must provide the correct password. PDFLinx does not crack, bypass, or brute-force unknown passwords. This is intentional — it keeps the tool ethical and legal. If you have genuinely lost access to a document you own, contact the original sender or your organization's IT department for the password.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF Unlock Tool — No Watermark, No Limits",
                text: "Most free PDF unlock tools add watermarks to the unlocked output, restrict file sizes, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily limit. Unlike iLovePDF and Smallpdf which restrict PDF unlocking on free tiers, PDFLinx gives you clean, watermark-free unlocked PDFs at zero cost.",
              },
              {
                title: "Common Use Cases for Unlocking a PDF",
                text: "✓ Bank & Financial Statements: Unlock PDFs sent by banks and financial institutions with auto-generated passwords so you can access, print, or file them easily.\n✓ Government & Official Documents: Remove restrictions from officially issued PDFs that block printing or copying when you need to use the content.\n✓ HR Documents: Unlock protected offer letters, payslips, and employee records you have received with a known password.\n✓ Own Protected Files: Remove protection from PDFs you previously locked yourself when the password is no longer needed.\n✓ Permission-Locked PDFs: Unlock PDFs that allow viewing but block editing, printing, or copying so you can annotate, sign, or print them freely.\n✓ Before Using Other PDF Tools: Most PDF tools — merge, split, compress, edit — require an unlocked PDF. Use PDFLinx Unlock first, then use any other tool.",
              },
              {
                title:
                  "Unlock PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your protected PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the unlocked file in seconds. Whether you need to unlock a PDF on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security — Your Password Is Never Stored",
                text: "Your files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. The password you enter is used only to decrypt the file during processing — it is never stored, logged, or recorded by PDFLinx. We do not store, share, or access your documents at any point. Your data and your password stay completely private.",
              },
              {
                title: "After Unlocking — What You Can Do With the PDF",
                text: "Once unlocked, your PDF is a fully open, unrestricted document. You can open it without entering any password. You can print it freely. You can copy and paste text from it. You can edit and annotate it using our free PDF Editor. You can merge it with other PDFs using our free Merge tool. You can split it, compress it, convert it to Word or Excel — any action that was previously blocked by the protection is now fully available. Unlocking is often the first step before using any other PDF tool on the document.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF unlock tool free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of PDFs you unlock or how many times you use it.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and unlock it instantly — no email, no registration, no friction.",
              },
              {
                q: "Do I need to know the PDF password to unlock it?",
                a: "Yes. PDFLinx removes protection from PDFs for which you already have the correct password. Enter the password when prompted and PDFLinx strips it from the file.",
              },
              {
                q: "Can PDFLinx crack or bypass an unknown PDF password?",
                a: "No. PDFLinx is a legitimate unlock tool — it removes protection when you provide the correct password. It does not crack, guess, or brute-force unknown passwords.",
              },
              {
                q: "Can I remove permission restrictions — like printing and copying blocks?",
                a: "Yes. If a PDF has permission restrictions that block printing, copying, or editing, PDFLinx removes those restrictions so you can use the document freely.",
              },
              {
                q: "What is the difference between an open password lock and a permissions lock?",
                a: "An open password lock blocks anyone from viewing the PDF without the password. A permissions lock allows viewing but restricts actions like printing and editing. PDFLinx handles both.",
              },
              {
                q: "Does PDFLinx add any watermark to the unlocked PDF?",
                a: "No watermarks, ever. Your unlocked PDF is 100% clean — just the original content with the password and restrictions removed.",
              },
              {
                q: "Is my file and password secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and deleted after 1 hour. The password you enter is used only during processing and is never stored or logged by PDFLinx.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 50 MB per file. For very large protected PDFs, contact us if you experience issues — we can advise on the best approach.",
              },
              {
                q: "Why should I unlock a PDF before using other PDF tools?",
                a: "Most PDF tools — including merge, split, compress, rotate, and edit — require an unlocked PDF to function. Unlock your PDF first using PDFLinx, then use any other tool on it freely.",
              },
              {
                q: "Can I re-protect a PDF with a new password after unlocking?",
                a: "Yes. After unlocking, use our free Protect PDF tool to add a new password and encryption settings to the document.",
              },
              {
                q: "Will the PDF content or quality change after unlocking?",
                a: "No. Unlocking only removes the encryption and restriction layer — all content, formatting, images, and quality remain exactly as in the original.",
              },
              {
                q: "How long does PDF unlocking take?",
                a: "Most operations complete within 5 to 10 seconds depending on file size.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for unlocking PDFs?",
                a: "Yes — PDFLinx unlocks PDFs with no watermark on output, no daily limits, and no account required. iLovePDF and Smallpdf restrict PDF unlocking behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Unlock your PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx to remove PDF passwords and restrictions instantly every day.",
            ctaButton: "Choose PDF File",
          },
        }}

      />

    </>
  );
}

