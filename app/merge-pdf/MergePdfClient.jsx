"use client";

import { useState } from "react";
import { GitMerge, Scissors,
LayoutList, Minimize2, Trash2,  
RotateCw, Hash, Pencil, FileOutput
 } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

// ── CONFIG ─────────────────────────────────
// const DONE_LINKS = [
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-orange-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

const DONE_LINKS = [
  { label: "Split PDF",      href: "/split-pdf",      icon: <Scissors        className="h-4 w-4 text-orange-500"  /> },
  { label: "Organize PDF",   href: "/organize-pdf",   icon: <LayoutList      className="h-4 w-4 text-blue-500"    /> },
  { label: "Remove Pages",   href: "/remove-pages",   icon: <Trash2          className="h-4 w-4 text-red-500"     /> },
  // { label: "Extract PDF",    href: "/extract-pdf",    icon: <FolderOutput    className="h-4 w-4 text-cyan-500"    /> },
  { label: "Extract PDF", href: "/extract-pdf", icon: <FileOutput className="h-4 w-4 text-cyan-500" /> },
  { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2       className="h-4 w-4 text-green-500"   /> },
  { label: "Rotate PDF",     href: "/rotate-pdf",     icon: <RotateCw        className="h-4 w-4 text-cyan-500"    /> },
  { label: "Add Page Numbers", href: "/add-page-numbers", icon: <Hash        className="h-4 w-4 text-slate-500"   /> },
  { label: "Edit PDF",       href: "/edit-pdf",       icon: <Pencil          className="h-4 w-4 text-orange-500"  /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-blue-800">
      ℹ️ How merging works
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Select 2 or more PDF files</li>
      <li>Files merge in the order you upload them</li>
      <li>Remove &amp; re-add to change order</li>
      <li>Download one clean merged PDF</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Unlimited files",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
    <p className="font-semibold text-slate-800">📄 About merging</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Combine 2 or more PDF files</li>
      <li>✓ Page order = upload order</li>
      <li>✓ Original quality preserved</li>
      <li>✓ No re-compression</li>
      <li>✓ Remove files before merging</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────

export default function MergePdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  // const handleDownload = () => {
  //   if (!downloadUrl) return;
  //   const a = document.createElement("a");
  //   a.href = downloadUrl;
  //   a.download = "pdflinx-merged.pdf";
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  // };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pdflinx-merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  // ── API LOGIC ─────────────────────────────
  const handleConvert = async () => {
    if (flow.files.length < 2)
      return alert("Please select at least 2 PDF files to merge.");

    flow.startProcessing();
    startProgress();

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        cancelProgress();
        flow.handleError(errorData?.error || "Merge failed");
        return;
      }

      const data = await res.json();

      if (data.success) {
        // Direct VPS URL — same pattern as original
        const directUrl = `https://pdflinx.com/api${data.download}`;
        setDownloadUrl(directUrl);
        completeProgress();
        flow.finishSuccess();
      } else {
        cancelProgress();
        flow.handleError(data.error || "Merge failed");
      }
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError("Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ─────────────────────────

  return (
    <>
      {/* ── SEO SCHEMAS ── */}
      <Script
        id="howto-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Merge Multiple PDF Files Online for Free",
            url: "https://pdflinx.com/merge-pdf",
            step: [
              { "@type": "HowToStep", name: "Select PDF Files", text: "Click 'Select Files' and choose 2 or more PDF files from your device." },
              { "@type": "HowToStep", name: "Click Merge PDFs", text: "Press the 'Merge PDFs' button and wait a few seconds." },
              { "@type": "HowToStep", name: "Download Merged PDF", text: "Your merged PDF will be ready instantly — click download to save." },
            ],
            totalTime: "PT45S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://pdflinx.com/merge-pdf" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-merge-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the PDF merger free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes — completely free with no signup, no watermark, and no hidden charges." } },
              { "@type": "Question", name: "Do I need to install any software to merge PDFs?", acceptedAnswer: { "@type": "Answer", text: "No. Everything works directly in your browser." } },
              { "@type": "Question", name: "Can I rearrange the order before merging?", acceptedAnswer: { "@type": "Answer", text: "Files merge in upload order. Remove and re-add files to change the sequence." } },
              { "@type": "Question", name: "Will the quality of my PDFs be affected?", acceptedAnswer: { "@type": "Answer", text: "No — merging keeps the original text and image quality without compression." } },
              { "@type": "Question", name: "Are my files safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and deleted automatically after merging." } },
              { "@type": "Question", name: "Can I merge PDFs on my phone?", acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx works on Android and iPhone, as well as Windows and macOS." } },
            ],
          }, null, 2),
        }}
      />

      {/* ── TOOL UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "Merge PDF Files Online Free"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={true}
        convertLabel="Merge PDFs"
        uploadTitle="Drop your PDF files here"
        uploadSubtitle="or click to browse — select 2 or more PDFs"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}
        // Options
        optionsTitle="Merge options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={OPTIONS_SLOT}
        // Processing
        processingTitle="Merging your PDFs"
        processingDescription="Please wait while we combine your PDF files."
        processingStages={["Uploading files", "Merging pages", "Generating PDF"]}
        // Done
        doneTitle="Your merged PDF is ready"
        doneDescription="All PDF files have been merged into one successfully."
        doneFileName="pdflinx-merged.pdf"
        downloadLabel="Download Merged PDF"
        resetLabel="Merge another set"
        // Sidebar
        sidebarTitle="Merge PDF"
        sidebarIcon={<GitMerge className="h-5 w-5 text-indigo-500" />}
        sidebarDescription="Combine multiple PDF files into one clean, organized document instantly."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // uploadLanding={true}

        uploadInfo={
          <>
            <p>⏱️ Large PDF files may take up to 1 minute — don&apos;t close this tab</p>
            <p className="mt-1">
              📄 Select at least 2 PDF files · Merge order follows upload order
            </p>
          </>
        }

        // ============================================================
        // MergePdf.jsx — uploadLanding prop (SEO-complete version)
        // Fixes from audit:
        //   ✅ breadcrumbCurrent added
        //   ✅ heroBadge added
        //   ✅ pills added (8 keyword pills)
        //   ✅ trustPills added
        //   ✅ rating + ratingText added
        //   ✅ howToEyebrow + howToSubtitle added
        //   ✅ whyTitle + whyPoints added (6 points)
        //   ✅ faqTitle added
        //   ✅ Device-specific FAQs: iPhone, Android, Mac, Windows
        //   ✅ seoTitle + seoDescription added
        //   ✅ seoBadge added
        //   ✅ relatedTitle added
        //   ✅ SSL/GDPR added in privacy section
        //   ✅ "pdf merger" keyword injected
        //   ✅ "combine pdf files online free" phrase added
        //   ✅ "merge pdf for email" long-tail added
        // ============================================================

        uploadLanding={{
          content: {
          relatedTools: DONE_LINKS,

            eyebrow: "FREE PDF MERGER TOOL",

            breadcrumbCurrent: "Merge PDF",

            heroBadge: "✦ Free PDF Merger — No Signup, No Watermark",

            // heroTitle: (
            //   <>
            //     Free PDF Merger —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Combine PDF Files into One Online
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Merge PDF files online for free — no signup, no watermark, no software needed. Combine multiple PDFs into one clean document instantly. Works for students, businesses, and professionals. Merge PDFs in the correct page order, preserve original quality and formatting, and download the result immediately. Works on Windows, Mac, Android, and iPhone — free online PDF merger with no file size limit.",

            // pills: [
            //   "Merge PDF files",
            //   "Combine PDF online free",
            //   "Join multiple PDFs",
            //   "Merge PDFs in order",
            //   "Merge PDF for email",
            //   "Batch PDF merge",
            //   "No watermark",
            //   "Works on mobile",
            // ],

            heroTitle: (
              <>
                Merge PDF Files —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Combine PDFs Online Free
                </em>
              </>
            ),
            heroDescription:
              "Merge PDF files online for free — combine multiple PDFs into one document in seconds. Drag to reorder pages, then download instantly. No signup, no watermark, no software needed.",
            pills: ["Combine multiple PDFs", "Drag to reorder", "Instant download", "No signup"],


            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            uploadTitle: "Drop your PDF files here to merge",
            uploadSubtitle: "or click to browse — select 2 or more PDFs",

            noticeTitle: "PDF Merger",
            noticeItems: [
              "Merge 2 to 20+ PDF files at once",
              "Original quality & page order preserved",
              "Files deleted after 1 hour — 100% private",
            ],

            rating: "4.8/5",
            ratingText: "Trusted by 80,000+ users monthly",

            howToEyebrow: "How It Works",
            howToTitle: "How to Merge PDF Files — 3 Simple Steps",
            howToSubtitle:
              "Upload your PDFs, arrange them in the correct order, and download your merged document instantly — no account required.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF Files",
                desc: "Select 2 or more PDF files from your device. You can also drag and drop files. Files are merged in the exact order you upload them. Supports large PDFs, scanned documents, and multi-page files.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Click Merge PDFs",
                desc: "Start merging instantly. PDFLinx securely combines all pages into one organized PDF document — preserving original quality, fonts, images, and formatting with zero re-rendering.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Merged PDF",
                desc: "Your merged PDF is ready to download immediately after processing. One clean, professional file containing all your combined pages — no watermark, no signup.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why Use PDFLinx Free PDF Merger?",

            whyPoints: [
              {
                title: "100% Free, Always",
                desc: "No subscription, no hidden fees. Merge unlimited PDF files at zero cost — forever free. No daily limits, no file count restrictions.",
              },
              {
                title: "Merge PDFs in the Correct Order",
                desc: "PDFLinx merges files in the exact sequence you upload them. Rearrange your documents before uploading and the final PDF will follow your chosen page order precisely.",
              },
              {
                title: "Zero Quality Loss — Lossless Merge",
                desc: "Original page quality, fonts, images, tables, and layout are fully preserved after merging. PDFLinx does not re-render or compress any content during the merge process.",
              },
              {
                title: "Works on All Devices",
                desc: "Merge PDFs on iPhone, Android, Windows, or Mac — no app download needed. Everything runs directly in your browser — the fastest way to combine PDF files on any device.",
              },
              {
                title: "Batch Merge Multiple PDFs",
                desc: "Upload and merge 2 to 20+ PDF files in a single session. Ideal for combining invoices, reports, contracts, assignments, and scanned forms into one organized document.",
              },
              {
                title: "Secure & Private — 256-bit SSL",
                desc: "Your files are transferred over 256-bit SSL encryption and permanently deleted from our servers after 1 hour. We never store, share, or access your documents.",
              },
            ],

            faqTitle: "Merge PDF — Frequently Asked Questions",

            faqs: [
              {
                q: "Is PDFLinx PDF merger free to use?",
                a: "Yes. PDFLinx is a completely free PDF merger with no hidden costs, no subscriptions, and no limits on how many PDF files you can merge. Combine unlimited PDFs for free.",
              },
              {
                q: "How many PDF files can I merge at once?",
                a: "You can merge multiple PDF files in a single session. For best results, we recommend merging up to 20 files at a time. For very large batches, merge in stages — combine a set first, then merge the results together.",
              },
              {
                q: "Will PDF quality be reduced after merging?",
                a: "No. PDFLinx uses a lossless merging process — original image resolution, fonts, tables, and layout are fully preserved. There is no compression or quality loss during the merge.",
              },
              {
                q: "Can I control the order of pages when merging PDFs?",
                a: "Yes. PDF files are merged in the exact order you upload them. To rearrange the order, remove a file and re-upload it in the position you want. The final merged PDF will follow your chosen sequence.",
              },
              {
                q: "How do I merge PDF files on iPhone for free?",
                a: "Open PDFLinx in your iPhone browser (Safari or Chrome) — no app download needed. Tap the upload area, select your PDF files from Files or Photos, tap Merge PDFs, and download the combined file directly to your iPhone. The fastest free PDF merger for iOS.",
              },
              {
                q: "How do I merge PDF files on Android?",
                a: "Open PDFLinx in your Android browser (Chrome or Firefox). Tap the upload area, select your PDFs, tap Merge PDFs, and save the merged file to your device. No app installation required — works directly in any Android browser.",
              },
              {
                q: "How do I merge PDF files on Mac for free?",
                a: "Open PDFLinx in Safari, Chrome, or Firefox on your Mac. Upload your PDFs, click Merge PDFs, and download the combined file. No software installation needed — works entirely in your browser. Free alternative to Adobe Acrobat's PDF combine feature on Mac.",
              },
              {
                q: "How do I merge PDF files on Windows 10 or Windows 11?",
                a: "Open PDFLinx in any browser on Windows — Chrome, Edge, or Firefox. Upload your PDF files, click Merge PDFs, and download the merged output. No additional software or app needed. Works on Windows 10 and Windows 11.",
              },
              {
                q: "Does PDFLinx add a watermark to merged PDFs?",
                a: "No. PDFLinx does not add any watermark to your merged PDF. The output file is 100% clean and professional — exactly as you uploaded your files.",
              },
              {
                q: "Do I need to sign up to merge PDF files?",
                a: "No. No account or registration is required. You can merge PDF files instantly without signup — completely free.",
              },
              {
                q: "Are my uploaded PDF files secure?",
                a: "Yes. All files are transferred over 256-bit SSL encryption and automatically deleted from our servers after 1 hour. We do not store, share, or view your documents at any point. PDFLinx is GDPR-aware and privacy-first.",
              },
              {
                q: "Can I merge PDF files on mobile?",
                a: "Yes. PDFLinx works perfectly on Android, iPhone, iPad, tablets, and all desktop devices — directly in your browser without any app installation.",
              },
              {
                q: "Do I need to install software to merge PDFs?",
                a: "No. PDFLinx is a fully online PDF merger. No software, no app, and no browser extension is required.",
              },
              {
                q: "Will the formatting be preserved in the merged PDF?",
                a: "Yes. Original fonts, images, tables, layout, and page structure remain fully preserved after merging. PDFLinx does not alter or re-render any content during the merge process.",
              },
              {
                q: "What is the difference between merging and combining PDFs?",
                a: "Merging and combining PDFs mean the same thing — joining two or more PDF files into one document. Different tools use different words (merge, combine, join, append) but the process and result are identical.",
              },
              {
                q: "Can I merge a PDF with a scanned document?",
                a: "Yes. PDFLinx can merge any valid PDF file — including scanned PDFs, image-based PDFs, and text-based PDFs — into one document. The content of each file is preserved exactly as uploaded.",
              },
              {
                q: "What happens if I upload only one PDF file?",
                a: "At least 2 PDF files are required for merging. If only one file is uploaded, the tool will prompt you to add more files before proceeding.",
              },
              {
                q: "How do I make sure my PDFs merge in the correct page order?",
                a: "PDFLinx merges files in the exact order you upload them. To ensure the correct sequence, upload your files one by one starting from the first document. If you need to change the order, remove the file and re-upload it in the correct position. Renaming files with numbers before uploading (01_cover.pdf, 02_chapter.pdf) is a helpful way to keep track of order.",
              },
              {
                q: "Can I merge PDF files to send by email?",
                a: "Yes. Merging multiple PDFs into one file before sending by email keeps your attachments clean and professional. One merged PDF is easier to manage than multiple separate files — and stays under email attachment limits more easily.",
              },
            ],

            seoBadge: "Merge PDF Guide",

            seoTitle:
              "Free PDF Merger — Merge PDF Files Online, Combine PDFs into One Instantly | PDFLinx",

            seoDescription:
              "Free online PDF merger — combine multiple PDF files into one document instantly. Merge PDFs in the correct order, no quality loss, no watermark, no signup. Works on Android, iPhone, Mac, and Windows.",

            seoSections: [
              {
                // Primary — all main keywords covered
                title:
                  "Free PDF Merger — Merge PDF Files Online & Combine Multiple PDFs into One Document",
                text: "Need to join multiple PDF files into one document? PDFLinx is a free online PDF merger that combines PDF files instantly — without losing quality, formatting, or page order. Whether you want to merge 2 PDFs or combine a large batch of files, PDFLinx handles it directly in your browser. No signup, no watermark, and no software installation required. A fast and reliable free alternative to Adobe Acrobat, Smallpdf, and ILovePDF — without cost, daily limits, or file size restrictions.",
              },
              {
                // Long-tail: "when should you merge pdf files"
                title: "When Should You Merge PDF Files?",
                text: "Merging PDF files is useful when you want to combine multiple related documents into one organized file. Students often merge assignments, research papers, and study notes into a single PDF before submission. Businesses combine invoices, reports, contracts, quotations, and presentations for easier sharing and record keeping. Instead of sending multiple separate files, one merged PDF keeps everything clean, professional, and easier to manage. PDF merging also helps reduce confusion when printing, emailing, or archiving important documents.",
              },
              {
                // Semantic: "what is pdf merging"
                title: "What is PDF Merging?",
                text: "PDF merging is the process of combining two or more separate PDF files into a single unified document. Also known as PDF joining, PDF combining, or PDF appending, this process preserves the original content, fonts, images, layout, and page order of every file. The result is one clean PDF that contains all the pages from your uploaded files in the exact sequence you chose. PDF merging is different from PDF conversion — no content is changed, only the files are joined together.",
              },
              {
                // Topical authority: "best free pdf merger"
                title: "Why PDFLinx is the Best Free PDF Merger Online",
                text: "Most free PDF merger tools limit how many files you can combine, add watermarks, or require account creation. PDFLinx does none of that — merge unlimited PDF files completely free, with no signup and no watermark. What makes PDFLinx different is the lossless merge engine — your original page quality, fonts, images, and layout are preserved exactly as uploaded. No re-rendering, no compression, no quality loss. A reliable free alternative to Adobe Acrobat and Smallpdf premium plans.",
              },
              {
                // Use cases — text format with checkmarks
                title: "Common Use Cases for Merging PDF Files",
                text: "✓ Students & Researchers: Merge assignments, research papers, reference pages, and study notes into one submission-ready PDF before university or college submission.\n✓ Business Professionals: Combine invoices, quotations, contracts, and reports into a single organized document for clients or management — cleaner than sending multiple attachments.\n✓ HR & Admin Teams: Merge offer letters, ID documents, forms, and policies into one complete employee file for onboarding or record keeping.\n✓ Lawyers & Accountants: Join legal contracts, agreements, financial statements, and supporting documents into one organized case file or audit package.\n✓ Teachers & Educators: Combine worksheets, answer keys, and reading materials into a single printable PDF for easy distribution to students.\n✓ Freelancers & Agencies: Merge project deliverables, proposals, invoices, and contracts into one professional client package for clean, organized handover.",
              },
              {
                // Long-tail: "merge pdf in correct order page sequence"
                title: "How to Merge PDF Files in the Right Order — Page Sequence Tips",
                text: "Page order matters when merging PDFs — especially for reports, legal documents, and multi-chapter files. PDFLinx merges files in the exact order you upload them. To control the final sequence, arrange your files before uploading: upload the cover page PDF first, then body sections, then appendices. If you make a mistake, remove the file and re-upload it in the correct position. For large document packages with 10+ files, plan your upload order in advance — rename files with numbers (01_intro.pdf, 02_body.pdf) so the correct sequence is clear before you start.",
              },
              {
                // Long-tail: "merge pdf for email whatsapp"
                title: "Merge PDFs for Email, WhatsApp, and Online Portals",
                text: "Sending multiple PDFs as separate email attachments looks unprofessional and risks hitting attachment size limits. Merging all files into one PDF before sending keeps your email clean, organized, and easy for the recipient to manage. One merged PDF attachment is also faster to share over WhatsApp and Telegram on mobile networks. For online portals that accept a single PDF upload — university submissions, HR systems, or client portals — merging your documents first ensures a smooth, error-free submission.",
              },
              {
                // Device-specific long-tails
                title: "Merge PDF Files on Any Device — iPhone, Android, Mac, Windows",
                text: "No software installation needed. PDFLinx PDF merger works perfectly on Windows, Mac, Linux, Android, iPhone, iPad, and tablets — directly in your browser without any app. On iPhone, open PDFLinx in Safari, tap upload, select your PDFs from Files, and download the merged result. On Android, open in Chrome or Firefox and follow the same steps. On Mac or Windows, open in any browser — no extensions or plugins needed. The fastest way to merge PDF files on any device, for free.",
              },
              {
                // Trust + privacy — 256-bit SSL + GDPR
                title: "Privacy and File Security — 256-bit SSL Encryption",
                text: "Your uploaded PDF files are transferred over 256-bit SSL encryption and processed on secure servers. Files are automatically deleted after 1 hour — we do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles and is GDPR-aware. No account or email is required to use the free PDF merger. Your files stay completely private from upload to download.",
              },
            ],

            relatedTitle: "More Free PDF Tools",
            showPdfTypes: false,
          },
        }}
      />

      {/* ── SEO CONTENT ── */}
      {/* <RelatedToolsSection currentPage="merge-pdf" /> */}
    </>
  );
}

