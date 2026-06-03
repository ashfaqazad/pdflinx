"use client";

import { useState } from "react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  Presentation,
  GitMerge,
  Minimize2,
  FileText,
  FileSpreadsheet, Image as ImageIcon,
  Stamp, Pencil
}
  from "lucide-react";

// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Excel to PDF", href: "/excel-pdf", icon: <Table className="h-4 w-4 text-emerald-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

const DONE_LINKS = [
  { label: "PDF to PPT", href: "/pdf-to-powerpoint", icon: <Presentation className="h-4 w-4 text-orange-500" /> },
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "Excel to PDF", href: "/excel-pdf", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Add Watermark", href: "/add-watermark", icon: <Stamp className="h-4 w-4 text-teal-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-purple-800">
      ℹ️ PPT & PPTX Supported
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Both PPT and PPTX files work</li>
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
  "✓ Batch conversion",
  "✓ Works on all devices",
];

const OPTIONS_SLOT = (
  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
    <p className="font-semibold text-slate-800">📊 About this conversion</p>
    <ul className="space-y-1.5 text-xs text-slate-600">
      <li>✓ PPT & PPTX both supported</li>
      <li>✓ Slides, fonts & images preserved</li>
      <li>✓ Single file → PDF directly</li>
      <li>✓ Multiple files → ZIP download</li>
      <li>✓ Animations become static PDF slides</li>
    </ul>
  </div>
);

export default function PptToPdf({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("converted.pdf");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const getDownloadName = () => {
    if (flow.files.length === 1) {
      return flow.files[0]?.name
        ? flow.files[0].name.replace(/\.(ppt|pptx)$/i, ".pdf")
        : "converted.pdf";
    }

    return "pdflinx-ppt-to-pdf.zip";
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("File not found");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName || getDownloadName();
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed – file not ready yet. Try again in a few seconds.");
    }
  };

  const handleConvert = async () => {
    if (!flow.files.length) {
      return alert("Please select a PowerPoint file first!");
    }

    flow.startProcessing();
    startProgress();

    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("mode", flow.files.length === 1 ? "single" : "multiple");

    try {

      // const res = await fetch("/convert/ppt-to-pdf", {
      //   method: "POST",
      //   body: formData,
      // });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/ppt-to-pdf`, {
        method: "POST",
        body: formData,
      });


      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server error: ${res.status} ${text?.slice(0, 200)}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data?.error || "Conversion failed");
      }

      const finalName = getDownloadName();

      setDownloadUrl(`/api${data.download}`);
      setDownloadName(finalName);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      flow.handleError(err.message || "Something went wrong, please try again.");
    }
  };

  return (
    <>


      {/* ==================== SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-powerpoint-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert PowerPoint to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert PowerPoint to PDF online free — no signup, no watermark. Every slide, font, and layout preserved. Batch convert multiple PPT or PPTX files at once. Works on Windows, Mac, Android, iOS.",
              url: "https://pdflinx.com/ppt-to-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PowerPoint (single or multiple)",
                  text: "Drop your .ppt or .pptx file here — you can also select multiple files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Click Convert",
                  text: "Wait a few seconds for processing. If you uploaded multiple files, we convert them together.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download",
                  text: "Download your converted PDF. For multiple files, you can download a ZIP containing all PDFs.",
                },
              ],
              totalTime: "PT30S",
              estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              image: "https://pdflinx.com/og-image.png",
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="breadcrumb-schema-powerpoint-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "PowerPoint to PDF", item: "https://pdflinx.com/ppt-to-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-powerpoint-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the PowerPoint to PDF converter free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx PowerPoint to PDF converter is completely free — no hidden charges, no subscription required."
                }
              },
              {
                "@type": "Question",
                "name": "Will slide layouts and fonts be preserved?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Slide layouts, fonts, images, backgrounds, and design elements are all preserved accurately in the converted PDF."
                }
              },
              {
                "@type": "Question",
                "name": "What happens to animations when converting to PDF?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PDF is a static format — animations cannot be preserved. Each slide appears as a static frame showing the final state. All text and images remain fully visible."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert multiple PowerPoint files at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Upload multiple PPT or PPTX files simultaneously. All converted PDFs are delivered as a single ZIP download."
                }
              },
              {
                "@type": "Question",
                "name": "Are my files safe and private?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Files are processed securely and permanently deleted after conversion. Never stored or shared."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert PowerPoint to PDF on mobile?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx works on Android and iOS mobile browsers — no app required."
                }
              }
            ]
          }, null, 2)
        }}
      />

      <Script
        id="software-schema-powerpoint-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PowerPoint to PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/powerpoint-pdf",
            description:
              "Free online PowerPoint to PDF converter. Convert PPT and PPTX presentations into high-quality PDF documents while preserving slide layouts, formatting, images, and text.",
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
              "Convert PowerPoint to PDF",
              "Support for PPT and PPTX files",
              "Preserve slide layouts and formatting",
              "High-quality PDF output",
              "Batch presentation conversion",
              "Works on desktop and mobile",
              "Free online converter",
              "No software installation required"
            ]
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title={seo?.h1 || "PowerPoint to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        accept=".ppt,.pptx"
        multiple={true}
        convertLabel="Convert to PDF"
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
        optionsSlot={OPTIONS_SLOT}
        optionSectionLabel=""
        processingTitle="Converting PowerPoint to PDF"
        processingDescription="Please wait while we convert your slides into a PDF."
        processingStages={[
          "Uploading presentation",
          "Rendering slides",
          "Generating PDF",
        ]}
        doneTitle="Your PDF is ready"
        doneDescription={
          flow.files.length > 1
            ? "Your PowerPoint files have been converted successfully."
            : "Your PowerPoint file has been converted to PDF successfully."
        }
        doneFileName={downloadName}
        downloadLabel={flow.files.length > 1 ? "Download ZIP" : "Download PDF"}
        resetLabel="Convert another file"
        sidebarTitle="PowerPoint to PDF"
        sidebarIcon={<Presentation className="h-5 w-5 text-purple-500" />}
        sidebarDescription="Convert PPT and PPTX presentations to PDF instantly."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}


        // ============================================================
        // POWERPOINT TO PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "POWERPOINT TO PDF CONVERTER",

            breadcrumbCurrent: "PowerPoint to PDF Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     PowerPoint to PDF Converter —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Slides Preserved
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Convert PowerPoint presentations to PDF online for free. All slides, animations, images, and formatting preserved — no signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "All slides converted",
            //   "Works on any device",
            //   "Instant conversion",
            // ],

            heroTitle: (
              <>
                PPT to PDF Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  PowerPoint to PDF Free Online
                </em>
              </>
            ),
            heroDescription:
              "Convert PowerPoint to PDF online free — PPT and PPTX files converted with all slides, fonts, and formatting perfectly preserved. No PowerPoint installation needed. Instant, free, no signup.",
            pills: ["PPT & PPTX supported", "Slides & layout preserved", "No PowerPoint needed", "No watermark"],


            uploadTitle: "Drop your PowerPoint file here",
            uploadSubtitle: "or click to browse — .ppt and .pptx files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PowerPoint to PDF Conversion",
            noticeItems: [
              "Supports .ppt and .pptx formats",
              "All slides included in output",
              "Images, text & layout preserved",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert PowerPoint to PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PowerPoint File",
                desc: "Select your .ppt or .pptx file from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. No software or plugin required.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Convert to PDF",
                desc: "Click Convert — all slides, text boxes, images, shapes, and backgrounds are rendered accurately in the PDF. Speaker notes can optionally be included.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PDF",
                desc: "Your presentation PDF is ready in seconds. Download it instantly — one slide per page, clean layout, no watermark, ready to share or present.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PowerPoint to PDF Converter Online",

            seoBadge: "PowerPoint to PDF Guide",
            seoTitle: "Complete Guide to Converting PowerPoint to PDF Online",
            seoDescription:
              "Everything you need to know about converting PowerPoint presentations to PDF — free, online, with all slides and formatting preserved. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PowerPoint to PDF Converter — Convert PPT & PPTX to PDF Online",
                text: "Need to convert a PowerPoint file to PDF? PDFLinx lets you convert PowerPoint to PDF online for free — instantly, with no software installation required. Whether it is a simple slide deck, a business presentation with charts, or a university lecture with embedded images, PDFLinx converts it to a clean, properly formatted PDF in seconds. No signup, no watermark, no hidden limits. It is the best free PowerPoint to PDF converter available online today — works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PowerPoint to PDF Conversion?",
                text: "PowerPoint to PDF conversion turns your editable slide deck into a fixed-layout PDF document. A PDF cannot be accidentally edited, looks identical on every device, and is universally accepted for sharing and submission. Converting PowerPoint to PDF is essential when you need to send a presentation to someone who does not have PowerPoint installed, share slides before a meeting, submit a deck to a client or institution, or archive a final version of a presentation without risk of accidental changes.",
              },
              {
                title: "How to Convert PowerPoint to PDF Without Losing Formatting",
                text: "One of the most common concerns when converting PowerPoint to PDF is whether slide backgrounds, custom fonts, image positions, shapes, and text formatting are preserved. PDFLinx uses high-fidelity rendering to ensure the output PDF looks exactly like your presentation. Each slide is rendered as a full-page PDF — backgrounds, shapes, text boxes, and images all in their correct positions. Embedded charts and SmartArt are rendered accurately, and the overall slide layout is maintained without any shifting or clipping.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PowerPoint to PDF Converter — No Watermark, No Limits",
                text: "Most free PowerPoint to PDF converters add watermarks, restrict file sizes, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily conversion limit. Unlike iLovePDF free tier and Smallpdf free tier which restrict batch conversions and large file uploads behind paid plans, PDFLinx gives you unlimited conversions at zero cost.",
              },
              {
                title: "Common Use Cases for PowerPoint to PDF Conversion",
                text: "✓ Business Professionals: Share pitch decks, board presentations, and project updates as locked, professional PDFs.\n✓ Students & Teachers: Submit assignments, lecture slides, and class presentations as PDF for coursework or distribution.\n✓ Sales & Marketing: Send product decks, proposals, and portfolio presentations to clients as polished PDFs.\n✓ Conference Speakers: Distribute slide decks to attendees as PDF handouts after a talk.\n✓ Freelancers: Deliver project presentations and creative briefs to clients as PDF.\n✓ HR Teams: Share company overview slides, training materials, and onboarding decks as non-editable PDFs.",
              },
              {
                title:
                  "Convert PowerPoint to PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PowerPoint file directly from your files app. On Mac or Windows, drag and drop your presentation and download the PDF in seconds. Unlike desktop software like Microsoft PowerPoint or Adobe Acrobat, PDFLinx is fully online and free. Whether you need to convert PowerPoint to PDF on mobile or desktop, PDFLinx works seamlessly on every device and operating system.",
              },
              {
                title:
                  "PDFLinx vs iLovePDF vs Smallpdf — Free PowerPoint to PDF Converter Comparison",
                text: "iLovePDF and Smallpdf both limit free PowerPoint to PDF conversions per day and require sign-up for full access. Adobe Acrobat charges a monthly subscription for PowerPoint to PDF export. PDFLinx offers unlimited free conversions with no account, no watermark, and no daily limits. For anyone looking for the best free iLovePDF alternative or Smallpdf alternative for PowerPoint to PDF conversion, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "PowerPoint to PDF vs Save As PDF in PowerPoint — Why an Online Converter is More Convenient",
                text: "Microsoft PowerPoint's built-in Save As PDF feature works well — but only if you have PowerPoint installed and a licensed copy available. On mobile devices, older computers, or shared systems without Office, this option is simply not available. PDFLinx fills this gap perfectly — convert any PowerPoint file to PDF from any browser, on any device, without needing Microsoft Office or any other software installed.",
              },
              {
                title:
                  "What Happens to Animations and Transitions in the PDF?",
                text: "PDF is a static format, so animations and slide transitions cannot be preserved in the output. Each slide is rendered as a single static page in the PDF — showing the final state of all animated elements. Text, images, and shapes that appear through animations are all visible in the PDF in their end positions. This is the standard behavior for any PowerPoint to PDF converter and gives you a clean, universally viewable document.",
              },
              {
                title: "Best For Professional Presentation Sharing",
                text: "Use the converted PDF for client submissions, email attachments, conference handouts, printed materials, and archiving. The output is a standard PDF file compatible with Adobe Acrobat, Preview, Chrome, and every PDF viewer — easy to share and open on any device without requiring PowerPoint.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PowerPoint to PDF converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of conversions. Convert as many PowerPoint files as you need at zero cost.",
              },
              {
                q: "Which PowerPoint formats are supported?",
                a: "PDFLinx supports both .ppt (older PowerPoint format) and .pptx (modern PowerPoint format). Both are fully supported with slides and formatting preserved.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PowerPoint file and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "Will all slides be included in the PDF?",
                a: "Yes. All slides in your PowerPoint presentation are included in the PDF output, each as a separate page in the correct order.",
              },
              {
                q: "Will images and backgrounds be preserved in the PDF?",
                a: "Yes. Slide backgrounds, embedded images, shapes, text boxes, and chart graphics are all rendered accurately in the PDF — exactly as they appear in your presentation.",
              },
              {
                q: "What happens to animations and transitions?",
                a: "PDF is a static format, so animations and transitions are not preserved. Each slide is rendered as a single static page showing all content in its final visible state.",
              },
              {
                q: "Does PDFLinx add any watermark to the converted PDF?",
                a: "No watermarks, ever. Your converted PDF is 100% clean and ready to use or share.",
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
                a: "Up to 30 MB per file. For larger presentations with many high-resolution images, try compressing the images in PowerPoint before uploading.",
              },
              {
                q: "Can I convert a password-protected PowerPoint file?",
                a: "You need to remove the password from your PowerPoint file before uploading. Open it in PowerPoint, remove the password protection, save, and then upload to PDFLinx.",
              },
              {
                q: "Will fonts look correct in the PDF if they are not standard fonts?",
                a: "PDFLinx embeds fonts during conversion for best results. If a custom font is not embedded in the original file, a fallback font may be used — but layout and formatting remain intact.",
              },
              {
                q: "How long does PowerPoint to PDF conversion take?",
                a: "Most conversions complete within 10 to 25 seconds depending on file size, number of slides, and embedded content.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PowerPoint to PDF?",
                a: "Yes — PDFLinx offers unlimited free conversions with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict batch conversions behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert PowerPoint to PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate PowerPoint to PDF conversion every day.",
            ctaButton: "Choose PowerPoint File",
          },
        }}

      />

      {/* <RelatedToolsSection currentPage="ppt-to-pdf" /> */}
    </>
  );
}


