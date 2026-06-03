"use client";

import { useState } from "react";
import Script from "next/script";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileImage,
  FileText,
  Minimize2,
  GitMerge,
  Image as ImageIcon,
  Scan, RotateCw, Pencil,
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "PDF to JPG", href: "/pdf-to-jpg", icon: <FileImage className="h-4 w-4 text-amber-500" /> },
//   { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-orange-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Split PDF", href: "/split-pdf", icon: <Scissors className="h-4 w-4 text-pink-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
// ];

const DONE_LINKS = [
  { label: "PDF to JPG", href: "/pdf-to-jpg", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-rose-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Rotate PDF", href: "/rotate-pdf", icon: <RotateCw className="h-4 w-4 text-cyan-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-sky-800">
      ℹ️ PNG Output Info
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Single-page PDF → PNG directly</li>
      <li>Multi-page PDF → ZIP with all PNGs</li>
      <li>Multiple PDFs → ZIP download</li>
      <li>Lossless quality output</li>
    </ul>
  </>
);

const SIDEBAR_FEATURES = [
  "✓ No account",
  "✓ No watermark",
  "✓ Auto-deleted after 1 hour",
  "✓ 100% free",
  "✓ Batch conversion",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
    <p className="font-semibold text-slate-800">🖼️ About this conversion</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ Every PDF page → separate PNG image</li>
      <li>✓ Lossless quality — zero quality loss</li>
      <li>✓ Transparent background supported</li>
      <li>✓ Single-page PDF → PNG directly</li>
      <li>✓ Multi-page PDF → ZIP with all PNGs</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────────────────────────────────────

export default function PdfToPng({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("converted.png");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const getDownloadName = (contentType = "") => {
    if (flow.files.length === 1) {
      return flow.files[0]?.name
        ? flow.files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".png" : "_pngs.zip")
        : "converted.png";
    }
    return "pdf_to_png_batch.zip";
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── API LOGIC ──────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length)
      return alert("Please select at least one PDF file!");

    flow.startProcessing();
    startProgress();
    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/pdf-to-png`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Conversion failed");
      }

      const contentType = res.headers.get("content-type") || "";
      const disposition = res.headers.get("content-disposition") || "";

      let filename = getDownloadName(contentType);
      if (disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      // const blob = await res.blob();
      // const url = window.URL.createObjectURL(blob);

      // setDownloadUrl(url);
      // setDownloadName(filename);

      // // Auto-download
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = filename;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);

      const data = await res.json();
      const directUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.download}`;

      setDownloadUrl(directUrl);
      setDownloadName(data.filename);

      // Auto-download direct from VPS
      const a = document.createElement("a");
      a.href = directUrl;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);


      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      console.error(err);
      cancelProgress();
      flow.handleError(err.message || "Something went wrong. Please try again.");
    }
  };
  // ── END API LOGIC ──────────────────────────────────────────────────────

  return (
    <>
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to PNG Online for Free",
            description: "Convert PDF pages to high-quality PNG images online free — no signup, no watermark. Lossless quality, transparent background support. Single-page PDF downloads as PNG, multi-page as ZIP. Works on Windows, Mac, Android, iOS.",
            url: "https://pdflinx.com/pdf-to-png",
            step: [
              { "@type": "HowToStep", name: "Upload PDFs", text: "Select one or multiple PDF files from your device." },
              { "@type": "HowToStep", name: "Click Convert", text: "Wait a few seconds — every page is extracted as a lossless PNG image." },
              { "@type": "HowToStep", name: "Download", text: "Auto download starts — single PNG or ZIP with all images." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to PNG", item: "https://pdflinx.com/pdf-to-png" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is the PDF to PNG converter free?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. PDFLinx PDF to PNG converter is completely free — no hidden charges, no subscription, no account required." },
              },
              {
                "@type": "Question",
                name: "What is the quality of converted PNG images?",
                acceptedAnswer: { "@type": "Answer", text: "PNG images are exported at full lossless quality — text stays sharp, colors are accurate, and transparent backgrounds are supported." },
              },
              {
                "@type": "Question",
                name: "Can I convert multiple PDF files to PNG at once?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Upload multiple PDFs simultaneously — each is processed separately and delivered as individual PNG or ZIP downloads." },
              },
              {
                "@type": "Question",
                name: "What is the difference between PDF to PNG and PDF to JPG?",
                acceptedAnswer: { "@type": "Answer", text: "PNG is lossless — better for text, graphics, logos, and transparent backgrounds. JPG is smaller in file size — better for photos and social media sharing." },
              },
              {
                "@type": "Question",
                name: "Are my uploaded PDF files safe?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared with third parties." },
              },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-pdf-png"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PDF to PNG",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/pdf-png",
            description:
              "Free online PDF to PNG converter. Convert PDF pages into high-quality PNG images with lossless quality and transparent background support where applicable. Extract individual PDF pages as PNG files instantly.",
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
              "Convert PDF pages to PNG images",
              "Lossless image quality",
              "High-resolution PNG output",
              "Extract individual PDF pages",
              "Download single or multiple PNG files",
              "Batch PDF to PNG conversion",
              "Works in any web browser",
              "No software installation required"
            ]
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "PDF to PNG Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Lossless Quality"
        accept="application/pdf,.pdf"
        multiple={true}
        convertLabel="Convert to PNG"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DONE_LINKS}
        sidebarLinks={DONE_LINKS}

        optionsTitle="Conversion options"
        showOutputFormat={false}
        showPreserveLayout={false}
        optionSectionLabel=""
        optionsSlot={OPTIONS_SLOT}

        processingTitle="Converting PDF Pages to PNG"
        processingDescription="Please wait while we extract your PDF pages as lossless PNG images."
        processingStages={["Uploading file", "Rendering pages", "Generating images"]}

        doneTitle="Your PNG images are ready"
        doneDescription={
          flow.files.length > 1
            ? "All PDF files have been converted to PNG images successfully."
            : "Your PDF pages have been converted to PNG images successfully."
        }
        doneFileName={downloadName}
        downloadLabel="Download PNG"
        resetLabel="Convert another PDF"

        sidebarTitle="PDF to PNG"
        sidebarIcon={<FileImage className="h-5 w-5 text-sky-500" />}
        sidebarDescription="Convert every PDF page into a lossless PNG image — fast, free, and no watermark."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // ============================================================
        // PDF TO PNG — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "PDF TO PNG CONVERTER",

            breadcrumbCurrent: "PDF to PNG Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     PDF to PNG Converter —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Lossless Quality
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Convert PDF pages to PNG images online for free. Each page becomes a lossless, high-resolution PNG — perfect for sharp text and diagrams. No signup, no watermark, no software needed.",

            // pills: [
            //   "No watermark",
            //   "Lossless PNG quality",
            //   "Each page to separate PNG",
            //   "Instant conversion",
            // ],


            heroTitle: (
              <>
                PDF to PNG Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  High Quality PNG, Free Online
                </em>
              </>
            ),
            heroDescription:
              "Convert PDF to PNG online for free — extract every page as a high-resolution, transparent-background PNG image. Download individually or as a ZIP. No signup, no watermark.",
            pills: ["High-res PNG output", "Transparent background", "All pages extracted", "No signup"],


            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PDF to PNG Conversion",
            noticeItems: [
              "Each PDF page → one PNG image",
              "Lossless quality — no compression artifacts",
              "Multiple pages → ZIP download",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert PDF to PNG — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with single-page and multi-page PDFs of any type.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Convert to PNG",
                desc: "Click Convert — each page of your PDF is rendered as a high-resolution PNG image with no compression loss. Text stays razor-sharp and diagrams remain pixel-perfect.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PNG Images",
                desc: "Single-page PDFs download as one PNG instantly. Multi-page PDFs are packaged into a ZIP file containing one PNG per page — ready to use immediately.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF to PNG Converter Online",

            seoBadge: "PDF to PNG Guide",
            seoTitle: "Complete Guide to Converting PDF to PNG Online",
            seoDescription:
              "Everything you need to know about converting PDF pages to PNG images — free, online, lossless quality. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF to PNG Converter — Convert PDF Pages to Lossless PNG Images Online",
                text: "Need to convert a PDF to PNG? PDFLinx lets you convert PDF pages to PNG images online for free — instantly and without any software installation. Whether it is a text-heavy document, a technical diagram, a certificate, or a presentation slide, PDFLinx renders each page as a clean, lossless PNG image in seconds. No signup, no watermark, no hidden limits. It is the best free PDF to PNG converter available today — works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PDF to PNG Conversion?",
                text: "PDF to PNG conversion renders each page of a PDF document as a standalone PNG image file. Unlike JPG, PNG uses lossless compression — meaning no image data is lost and there are no compression artifacts. This makes PNG the ideal format when you need pixel-perfect output from your PDF pages, especially for documents with sharp text, line art, logos, diagrams, and transparent elements.",
              },
              {
                title: "Why PNG is Better Than JPG for Certain PDF Content",
                text: "JPG compression is excellent for photographs but introduces visible artifacts on sharp edges, thin text lines, and diagrams — a phenomenon called compression noise. PNG avoids this entirely by using lossless compression. For PDFs containing text-heavy pages, technical drawings, charts, logos, or UI screenshots, converting to PNG gives you noticeably sharper and cleaner output than JPG. If file size is a concern and your PDF contains mostly photographs, JPG may be a better choice — but for quality-critical content, PNG wins every time.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF to PNG Converter — No Watermark, No Limits",
                text: "Most free PDF to PNG converters add watermarks, limit the number of pages you can convert, or reduce image quality on free plans. PDFLinx does none of that — completely free, no signup, no watermark, and no daily conversion limit. Unlike iLovePDF and Smallpdf which restrict high-resolution output and batch conversion on free tiers, PDFLinx gives you full-quality lossless PNG output at zero cost.",
              },
              {
                title: "Common Use Cases for PDF to PNG Conversion",
                text: "✓ Graphic Designers: Extract PDF pages as PNG for use in Photoshop, Illustrator, Figma, or Canva — without quality loss.\n✓ Web Developers: Use PDF page renders as high-quality PNG images on websites, apps, and landing pages.\n✓ Document Thumbnails: Generate sharp, clear preview thumbnails of PDF pages for document management systems.\n✓ Certificates & Badges: Convert certificate PDFs to PNG for embedding in emails, LinkedIn profiles, and websites.\n✓ Technical Documentation: Extract engineering drawings, flowcharts, and technical diagrams from PDFs as crisp PNG images.\n✓ Social Media: Share PDF content as lossless PNG images on platforms where PDF is not directly supported.",
              },
              {
                title:
                  "Convert PDF to PNG on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the PNG images in seconds. Whether you need to convert PDF to PNG on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "Does PDF to PNG Support Transparency?",
                text: "Yes. PNG natively supports transparent backgrounds, and PDFLinx preserves transparency where it exists in the original PDF. This is especially useful for PDFs with logos, icons, or design elements that sit on transparent backgrounds — the exported PNG will retain the transparency, making it easy to place the image on any background color in design tools without a white box appearing around it.",
              },
              {
                title: "PDF to PNG vs PDF to JPG — Which Should You Use?",
                text: "Choose PNG when your PDF contains text, diagrams, logos, charts, screenshots, or any content with sharp edges — lossless quality ensures everything stays pixel-perfect. Choose JPG when your PDF contains mostly photographs or when file size matters more than pixel-perfect sharpness, such as for email sharing or social media. For professional design work, document archiving, and technical content, PNG is almost always the better choice. PDFLinx offers both — use whichever fits your need.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF to PNG converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of pages or conversions. Convert as many PDFs as you need at zero cost.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "Will each page become a separate PNG image?",
                a: "Yes. Each page of your PDF is converted into one individual PNG image. A single-page PDF gives you one PNG. A multi-page PDF gives you one PNG per page, all packaged in a ZIP.",
              },
              {
                q: "Is PNG output lossless — will there be any quality loss?",
                a: "No quality loss at all. PNG uses lossless compression, meaning every pixel is preserved exactly as rendered. There are no compression artifacts — text stays sharp and diagrams stay clean.",
              },
              {
                q: "Does PDF to PNG support transparent backgrounds?",
                a: "Yes. PDFLinx preserves transparency in PNG output where it exists in the original PDF. Logos, icons, and design elements with transparent backgrounds will retain their transparency in the exported PNG.",
              },
              {
                q: "How will multi-page PDFs be downloaded?",
                a: "Multi-page PDFs are converted to one PNG per page and packaged into a single ZIP file for easy download. Single-page PDFs download as one PNG directly.",
              },
              {
                q: "What resolution are the output PNG images?",
                a: "PDFLinx renders PNG images at high resolution by default — sharp enough for professional design use, web publishing, and printing. The output is suitable for both screen and print purposes.",
              },
              {
                q: "Does PDFLinx add any watermark to the PNG images?",
                a: "No watermarks, ever. Your converted PNG images are 100% clean and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 20 MB per file. For larger PDFs, try splitting the file first using our free PDF Split tool, then convert each part separately.",
              },
              {
                q: "When should I use PNG instead of JPG for PDF conversion?",
                a: "Use PNG when your PDF contains text, logos, diagrams, charts, or sharp graphic elements — PNG lossless quality keeps edges crisp. Use JPG when your PDF contains mostly photographs or when smaller file size is the priority.",
              },
              {
                q: "Can I convert a password-protected PDF to PNG?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then convert to PNG.",
              },
              {
                q: "How long does PDF to PNG conversion take?",
                a: "Most conversions complete within 5 to 20 seconds depending on file size and the number of pages. PNG files are slightly larger than JPG so download may take a moment longer.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF to PNG?",
                a: "Yes — PDFLinx offers unlimited free conversions with full lossless PNG quality, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict resolution and batch conversion behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert PDF to PNG now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, lossless PDF to PNG conversion every day.",
            ctaButton: "Choose PDF File",
          },
        }} />
    </>
  );
}
