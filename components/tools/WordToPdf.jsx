"use client";

import { useState } from "react";
// import { FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
import { useToolFlow, STEPS } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// import {
// FileText, FileSpreadsheet, Image as ImageIcon,
// FilePlus, Minimize2, Shield, Merge, FileType, Code
// } from "lucide-react";
import {
  FileText,
  FileSpreadsheet,
  FileImage,        // ← Presentation ki jagah
  Image as ImageIcon,
  Code,
  FileType,
  Minimize2,
  GitMerge,
} from "lucide-react";
// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Excel to PDF", href: "/excel-pdf", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  // { label: "PPT to PDF",     href: "/ppt-to-pdf",     icon: <Presentation    className="h-4 w-4 text-orange-500"  /> },
  { label: "PPT to PDF", href: "/ppt-to-pdf", icon: <FileImage className="h-4 w-4 text-orange-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "HTML to PDF", href: "/html-to-pdf", icon: <Code className="h-4 w-4 text-indigo-500" /> },
  { label: "Text to PDF", href: "/text-to-pdf", icon: <FileType className="h-4 w-4 text-yellow-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
];

// const DONE_LINKS = [
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
//   { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },

// ];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ DOC & DOCX Supported
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Both old DOC and modern DOCX formats work</li>
      <li>Single file → PDF directly</li>
      <li>Multiple files → ZIP with all PDFs</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Preserves formatting",
  "✓ Works on all devices",
];
// ───────────────────────────────────────────

// ↓ YAHAN DAALO — SIDEBAR_FEATURES ke turant baad
const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">📄 About this conversion</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ DOC & DOCX both supported</li>
      <li>✓ Single file → PDF directly</li>
      <li>✓ Multiple files → ZIP with all PDFs</li>
      <li>✓ Fonts, tables & images preserved</li>
      <li>✓ No quality loss</li>
    </ul>
  </div>
);


export default function WordToPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState("pdflinx-word-to-pdf.pdf");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const handleConvert = async () => {
    if (!flow.files.length) return alert("Please select a Word file first!");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    for (const f of flow.files) formData.append("files", f);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/word-to-pdf`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        let msg = "Conversion failed";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // CASE A: Single PDF
      if (contentType.includes("application/pdf")) {
        setDownloadUrl(url);
        setDownloadFileName("pdflinx-word-to-pdf.pdf");
        completeProgress();
        flow.finishSuccess();
        return;
      }

      // CASE B: Multiple → ZIP
      if (
        contentType.includes("application/zip") ||
        contentType.includes("application/octet-stream")
      ) {
        setDownloadUrl(url);                              // ← yahi fix hai
        setDownloadFileName("pdflinx-word-to-pdf.zip");  // ← correct extension
        completeProgress();
        flow.finishSuccess();
        return;
      }

      throw new Error("Unexpected response from server.");
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };

  // ── DOWNLOAD HANDLER ─────────────────────
  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFileName;  // ← state se filename
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── END API LOGIC ────────────────────────

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Word to PDF Online for Free",
              url: "https://pdflinx.com/word-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Word File(s)",
                  text: "Upload one Word file or select multiple DOC/DOCX files.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Press Convert to PDF and wait a few seconds.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download PDF or ZIP",
                  text: "Single file downloads as PDF. Multiple files download as a ZIP.",
                },
              ],
              totalTime: "PT30S",
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
        id="breadcrumb-schema-word"
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
                  name: "Word to PDF",
                  item: "https://pdflinx.com/word-to-pdf",
                },
              ],
            },
            null,
            2
          ),
        }}
      />
      <Script
        id="faq-schema-word-to-pdf"
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
                  name: "Is the Word to PDF converter free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, completely free with no hidden charges.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need to install any software?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Everything works directly in your browser.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will my Word formatting be preserved?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, fonts, tables, images, and layout are preserved accurately.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I convert multiple Word files at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Upload up to 10 files — all PDFs delivered as a ZIP download.",
                  },
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        // Title + Tagline
        title={seo?.h1 || "Word to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        // uploadTitle="Drop your Word file here"
        // uploadSubtitle="or click to browse — DOC/DOCX supported"
        // File input
        accept=".doc,.docx"
        multiple={true}
        // Buttons
        convertLabel="Convert to PDF"
        // Flow state
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        // Options Step
        optionsTitle="Conversion options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        // optionsSlot={null}
        // Processing Step
        processingTitle="Converting to PDF"
        processingDescription="Please wait while we prepare your PDF document."
        processingStages={["Uploading file", "Converting to PDF", "Finalising"]}
        // Done Step
        doneTitle="Your PDF is ready"
        doneDescription="Your Word document has been converted to PDF successfully."
        doneFileName="converted.pdf"
        downloadLabel="Download PDF"
        resetLabel="Convert another file"
        // Sidebar
        sidebarTitle="Word to PDF"
        sidebarIcon={<FileText className="h-5 w-5 text-blue-500" />}
        sidebarDescription="Convert Word documents to PDF instantly — formatting preserved."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // uploadLanding={true}
        uploadTitle="Drop your Word file here"
        uploadSubtitle="or click to browse — DOC/DOCX supported"
        uploadInfo={
          <>
            <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
            <p className="mt-1">
              🔢 Max 10 Word files at once · Single file → PDF · Multiple → ZIP
            </p>
          </>
        }

        // uploadLandingContent={{
        // ✅ UPDATED: Word to PDF — SEO Optimized Content
        // Changes vs original:
        //   1. heroDescription — expanded with long-tail + semantic keywords
        //   2. "in Seconds" kept but hero overall stronger
        //   3. seoSections[0] — rewritten with primary + long-tail keywords
        //   4. NEW section: "How to Convert Word to PDF Without Losing Formatting"
        //   5. NEW section: "Why Convert Word Documents to PDF?" — topical authority
        //   6. seoSections total: 6 → 8
        //   7. "Why Choose PDFLinx" — competitive positioning added
        //   8. FAQ questions tweaked for long-tail keyword coverage

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "WORD TO PDF CONVERTER",

            breadcrumbCurrent: "Word to PDF Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Word to PDF Converter —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, DOC & DOCX
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Convert DOC and DOCX files to professional, print-ready PDF documents instantly. Fonts, tables, images, and layout stay perfectly preserved — no signup, no watermark, no software needed.",

            // pills: [
            //   "No watermark",
            //   "DOC & DOCX supported",
            //   "Works on any device",
            //   "Batch conversion",
            // ],

            heroTitle: (
              <>
                Word to PDF Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Convert DOC & DOCX to PDF Free
                </em>
              </>
            ),
            heroDescription:
              "Convert Word documents (DOC and DOCX) to PDF online for free — fonts, tables, images, and layout perfectly preserved. No signup, no watermark, no software needed. Works on Windows, Mac, Android, and iPhone.",
            pills: ["No watermark", "DOC & DOCX supported", "Works on any device", "Batch conversion"],


            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            uploadTitle: "Drop your Word file here",
            uploadSubtitle: "or click to browse — DOC & DOCX supported",

            noticeTitle: "DOC & DOCX Supported",
            noticeItems: [
              "Both DOC and DOCX files supported",
              "Single file → PDF",
              "Multiple files → ZIP",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert Word to PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your Word File(s)",
                desc: "Upload DOC or DOCX files from your device. Multiple Word documents can be added at once for batch PDF conversion. Drag and drop supported on all devices.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Start the Conversion",
                desc: "Click Convert to PDF — PDFLinx processes your Word documents and preserves all formatting, fonts, tables, images, and page layout automatically.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PDF",
                desc: "Single file downloads instantly as PDF. Multiple converted files are automatically packaged into a ZIP for easy download.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Word to PDF Converter",

            seoBadge: "Word to PDF Guide",
            seoTitle: "Complete Guide to Word to PDF Conversion",
            seoDescription:
              "Everything you need to know about converting DOC and DOCX files to professional PDF documents — free, online, no watermark, no signup required.",

            seoSections: [
              {
                title:
                  "Free Word to PDF Converter — Convert DOC & DOCX to PDF Online, No Watermark",
                text: "Need to share a Word document professionally? PDFLinx lets you convert Word to PDF online for free — instantly, without losing formatting, fonts, tables, or images. Whether it is a DOC or DOCX file, PDFLinx converts it into a clean, print-ready, universally compatible PDF. No signup, no watermark, and no software installation required. The fastest and most reliable free alternative to Adobe Acrobat, Smallpdf, and iLovePDF for everyday Word to PDF conversion.",
              },
              {
                title: "Why Convert Word Documents to PDF?",
                text: "Word documents can look different on different devices depending on fonts, software versions, and screen sizes. PDF format solves this by locking the layout so your document looks exactly the same on every device and operating system. PDFs are also non-editable by default, making them ideal for sharing official documents, contracts, resumes, and reports where you want to protect the content from accidental changes. Most universities, employers, government offices, and clients specifically require PDF format for document submissions.",
              },
              {
                title:
                  "How to Convert Word to PDF Without Losing Formatting",
                text: "The most common concern with Word to PDF conversion is whether the original formatting stays intact. PDFLinx uses professional-grade document rendering to preserve fonts, headings, tables, bullet points, images, margins, and page layout with high accuracy. DOCX files — the modern Word format — give the best conversion results. DOC files — the older Word format — are also fully supported and convert cleanly. If you notice any minor spacing differences, simply adjust them in your original Word file and re-convert instantly for free.",
              },
              {
                title: "What is Word to PDF Conversion?",
                text: "Word to PDF conversion transforms editable Microsoft Word documents (.doc, .docx) into fixed, secure, and universally compatible PDF files. Unlike Word documents, PDFs maintain consistent formatting across all devices, operating systems, and screen sizes. They are ideal for professional sharing, printing, archiving, and submitting official documents — because the layout never breaks regardless of which device or software opens the file.",
              },
              {
                title: "Common Use Cases for Word to PDF Conversion",
                text: "✓ Students & Researchers: Submit assignments, theses, and reports in PDF as required by universities and colleges.\n✓ Job Seekers: Convert resumes and CVs to PDF for job applications — formatting never breaks on the recruiter's device.\n✓ Professionals: Share reports, proposals, contracts, and presentations in a secure, read-only format.\n✓ Businesses: Generate invoices, agreements, quotations, and official documents in PDF.\n✓ Teachers & Educators: Create worksheets, exam papers, and study materials in a fixed, printable format.\n✓ Freelancers & Agencies: Deliver client work and project deliverables safely in professional PDF format.",
              },
              {
                title:
                  "Convert Word to PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "No software installation needed. PDFLinx Word to PDF converter works perfectly on Windows, Mac, Linux, Android, iPhone, iPad, and tablets — directly in your browser. Whether you are on a phone, laptop, or desktop, you can convert DOC and DOCX files to PDF in seconds without downloading any app. It is the easiest way to convert Word to PDF on mobile for free.",
              },
              {
                title:
                  "PDFLinx vs Adobe Acrobat vs Smallpdf vs iLovePDF — Free Word to PDF Comparison",
                text: "Adobe Acrobat charges a monthly subscription just to export Word to PDF. Smallpdf and iLovePDF limit free conversions per day and require account creation for batch features. PDFLinx offers unlimited free Word to PDF conversion with no daily limits, no watermark, and no signup — directly in your browser. For anyone looking for the best free Adobe Acrobat alternative or Smallpdf alternative for Word to PDF, PDFLinx is the clear choice for everyday document conversion.",
              },
              {
                title: "Privacy and File Security",
                text: "Your uploaded Word files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your files stay completely private from upload to download. No human ever views your documents.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Word to PDF converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of Word files you can convert to PDF.",
              },
              {
                q: "Do I need to sign up to convert Word to PDF?",
                a: "No account or signup required. Upload your Word file and convert to PDF instantly — no email, no registration needed.",
              },
              {
                q: "Can I convert both DOC and DOCX files to PDF?",
                a: "Yes, both old .DOC and modern .DOCX Word formats are fully supported. Both convert into clean, professional PDF files.",
              },
              {
                q: "Will formatting be preserved when converting Word to PDF?",
                a: "Yes. PDFLinx preserves fonts, images, tables, headings, spacing, and overall page layout. DOCX files give the best formatting accuracy. For complex multi-column layouts, minor adjustments may be needed in your original Word file before re-converting.",
              },
              {
                q: "Does PDFLinx add any watermark to the converted PDF?",
                a: "No watermarks, ever. The final PDF is 100% clean, professional, and original — no PDFLinx branding added.",
              },
              {
                q: "Can I convert multiple Word files to PDF at once?",
                a: "Yes. Upload multiple DOC or DOCX files together for batch conversion. All converted PDFs are automatically packaged into a single ZIP file for easy download.",
              },
              {
                q: "Can I use the Word to PDF converter on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation required.",
              },
              {
                q: "Do I need Microsoft Word installed to convert Word to PDF?",
                a: "No. The entire conversion process happens online in your browser. Microsoft Word, LibreOffice, or any other software is not required.",
              },
              {
                q: "What is the maximum file size for Word to PDF conversion?",
                a: "Up to 10 MB per single file and up to 50 MB combined for batch uploads. For larger files, try splitting the content across multiple Word files.",
              },
              {
                q: "What happens if I upload only one Word file?",
                a: "It converts and downloads directly as a single PDF file — no ZIP packaging needed.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free Word to PDF conversion?",
                a: "Yes. PDFLinx offers unlimited free conversions with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict batch conversion and advanced features behind paid plans.",
              },
              {
                q: "How can I reduce the size of the converted PDF?",
                a: "After converting, use our free Compress PDF tool to reduce file size while maintaining good quality — no extra software needed.",
              },
              {
                q: "Why should I use PDF format instead of sending a Word file?",
                a: "PDF format ensures your document looks exactly the same on every device, OS, and screen size. Unlike Word files, PDFs cannot be accidentally edited and are universally accepted by employers, universities, government offices, and clients.",
              },
              {
                q: "What is the difference between DOC and DOCX for PDF conversion?",
                a: "DOCX is the modern Word format (.docx) used in Word 2007 and later — it gives the best formatting accuracy when converting to PDF. DOC is the older Word format (.doc) used in Word 2003 and earlier — it is also fully supported and converts cleanly on PDFLinx.",
              },
            ],

            ctaTitle: (
              <>
                Convert Word to PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate Word to PDF conversion every day.",
            ctaButton: "Choose Word File",
          },
        }}

      />

      {/* ── SEO CONTENT ── */}
      {/* <RelatedToolsSection currentPage="word-to-pdf" /> */}
    </>
  );
}



