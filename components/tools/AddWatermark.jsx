"use client";

import { useMemo, useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
// import { CheckCircle, FileText, Type, Zap } from "lucide-react";
import {
  CheckCircle,
  FileText,
  Type,
  Zap,
  ShieldCheck,
  MonitorSmartphone,
  Lock,
} from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
import { useToolFlow } from "@/hooks/useToolFlow";
import { useProgressBar } from "@/hooks/useProgressBar";
import { DEFAULT_DONE_LINKS, DEFAULT_SIDEBAR_FEATURES } from "@/lib/toolUiConfig";

export default function AddWatermark() {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } =
    useProgressBar();

  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [error, setError] = useState("");
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const file = flow.files?.[0] || null;

  const outputFilename = useMemo(() => {
    if (!file?.name) return "pdflinx-watermarked.pdf";
    return file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
  }, [file?.name]);

  const resetAll = () => {
    if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
    setWatermarkedUrl(null);
    setError("");
    setText("CONFIDENTIAL");
    setOpacity(0.3);
    flow.reset();
  };

  const handleRemoveFile = () => {
    resetAll();
  };

  const handleDownload = () => {
    if (!watermarkedUrl) return;
    const a = document.createElement("a");
    a.href = watermarkedUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a PDF file first!");
      return;
    }
    if (!text.trim()) {
      setError("Please enter watermark text!");
      return;
    }

    flow.startProcessing();
    startProgress();
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.max(42, Math.min(width, height) * 0.12);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.75, 0.75, 0.75),
          opacity,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
      setWatermarkedUrl(objectUrl);

      completeProgress();
      flow.finishSuccess();
    } catch (err) {
      cancelProgress();
      setError(
        "Oops! Something went wrong while adding the watermark. Please try again."
      );
      flow.handleError("Watermark failed. Please try again.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const customOptions = (
    <div className="mx-auto w-full max-w-[760px] space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Watermark settings</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add your text and adjust transparency.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Type className="h-4 w-4 text-slate-500" />
              Watermark text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., CONFIDENTIAL, DRAFT, SAMPLE"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="mt-2 w-full cursor-pointer accent-slate-600"
            />
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
      <Script
        id="howto-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Watermark to PDF Online for Free",
            description: "Add text watermark to PDF pages instantly.",
            url: "https://pdflinx.com/add-watermark",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select your PDF file." },
              { "@type": "HowToStep", name: "Enter Text", text: "Type watermark text." },
              { "@type": "HowToStep", name: "Download", text: "Download watermarked PDF." }
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-watermark"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Add Watermark", item: "https://pdflinx.com/add-watermark" }
            ]
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title="Add Watermark to PDF Online Free"
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf"
        multiple={false}
        convertLabel="Apply Watermark"
        flow={flow}
        progress={progress}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        onDownload={handleDownload}
        doneLinks={DEFAULT_DONE_LINKS}
        showOutputFormat={false}
        showPreserveLayout={false}
        customFilePreview={customOptions}
        doneTitle="Your watermarked PDF is ready"
        doneDescription="Click download to save your updated PDF."
        downloadLabel="Download Watermarked PDF"
        resetLabel="Watermark another PDF"
        sidebarTitle="Add Watermark"
        sidebarIcon={<FileText className="h-5 w-5 text-white" />}
        sidebarDescription="Add a clean watermark across every page — quick and free."
        sidebarNotice={
          <>
            <p className="text-sm font-semibold text-blue-800">ℹ️ Watermark</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
              <li>Applies across all pages</li>
              <li>Adjust text and opacity</li>
              <li>PDF output stays readable</li>
            </ul>
          </>
        }
        sidebarFeatures={DEFAULT_SIDEBAR_FEATURES}
        // uploadLanding={true}
        uploadTitle="Drop your PDF here"
        uploadSubtitle="or click to browse — PDF files supported"

        uploadLanding={{
          content: {
            eyebrow: "ADD WATERMARK",

            heroTitle: (
              <>
                Add Watermark to PDF <br />
                <em className="font-bold not-italic text-[#e8420a] sm:italic">
                  instantly
                </em>
              </>
            ),

            heroDescription:
              "Add watermark to PDF online for free using custom text like CONFIDENTIAL, DRAFT, SAMPLE, or your company name. Apply clean watermarks across every page instantly with no signup or software installation.",

            noticeTitle: "Watermark output",

            noticeItems: [
              "Single PDF → Watermarked PDF",
              "Custom text watermark",
              "Adjust opacity & visibility",
            ],

            howToTitle: "How to add watermark to PDF",

            howToSubtitle:
              "Upload your PDF, type the watermark text, customize the style, and download the updated file in seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload your PDF",
                desc: "Choose a PDF file from your device or drag & drop it into the uploader.",
                color: "bg-blue-600",
              },

              {
                n: "2",
                title: "Set watermark text & style",
                desc: "Type your watermark text and adjust opacity for a subtle and professional appearance.",
                color: "bg-purple-600",
              },

              {
                n: "3",
                title: "Apply & download",
                desc: "Apply the watermark across all pages and download your updated PDF instantly.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why use PDFLinx watermark tool?",

            whyItems: [
              {
                title: "Your Text, Your Way",
                desc: "Add any watermark text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
                icon: Type,
                iconColor: "text-gray-600",
                bgColor: "bg-gray-100",
              },

              {
                title: "Applies on Every Page",
                desc: "The watermark is automatically added across all pages of your PDF without extra editing work.",
                icon: CheckCircle,
                iconColor: "text-slate-600",
                bgColor: "bg-slate-100",
              },

              {
                title: "Fast & Free",
                desc: "Add watermark to PDF online in seconds with no signup, no installation, and no hidden limits.",
                icon: Zap,
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },

              {
                title: "Professional Watermarking",
                desc: "Create clean and subtle watermarks that protect your files without affecting readability.",
                icon: ShieldCheck,
                iconColor: "text-violet-600",
                bgColor: "bg-violet-100",
              },

              {
                title: "Works Everywhere",
                desc: "Use PDFLinx on Windows, macOS, Linux, Android, iPhone, tablet, or desktop browsers.",
                icon: MonitorSmartphone,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
              },

              {
                title: "Privacy Friendly",
                desc: "Your PDF files are processed securely and are not stored permanently after watermarking.",
                icon: Lock,
                iconColor: "text-rose-500",
                bgColor: "bg-rose-50",
              },
            ],

            seoBadge: "PDF Watermark Guide",

            seoTitle:
              "Free Online Add Watermark to PDF Tool by PDFLinx",

            seoDescription:
              "Add text watermark to PDF online for free using custom labels like CONFIDENTIAL, DRAFT, SAMPLE, or company branding. Apply watermark across every page instantly.",

            seoSections: [
              {
                title: "Add Text Watermarks Across All PDF Pages",
                text: "PDFLinx lets you apply custom text watermarks to every page of your PDF automatically without editing pages one by one.",
              },

              {
                title: "Useful for Confidential and Draft Documents",
                text: "Add labels like CONFIDENTIAL, DRAFT, SAMPLE, INTERNAL, or DO NOT COPY to clearly mark document status and protect sensitive files.",
              },

              {
                title: "Protect Ownership and Branding",
                text: "Use watermarks to add your name, company, copyright text, or branding directly on PDF documents before sharing.",
              },

              {
                title: "Clean and Professional Watermark Output",
                text: "Adjust watermark visibility and opacity to create subtle, readable, and professional-looking PDF documents.",
              },

              {
                title: "Works on Mobile and Desktop Devices",
                text: "Use the PDFLinx watermark tool directly in your browser on Windows, macOS, Linux, Android, iPhone, and tablets.",
              },

              {
                title: "No Signup, No Watermark Ads",
                text: "Add watermark to PDF online for free with no account required, no software installation, and no extra branding added to your file.",
              },
            ],

            faqTitle: "Frequently asked questions",

            faqs: [
              {
                q: "Is the Add Watermark to PDF tool free?",
                a: "Yes. PDFLinx lets you add watermark to PDF online for free with unlimited usage and no signup required.",
              },

              {
                q: "Can I apply watermark on every page automatically?",
                a: "Yes. The watermark is added across all PDF pages automatically.",
              },

              {
                q: "What watermark text can I use?",
                a: "You can use any custom text such as CONFIDENTIAL, DRAFT, SAMPLE, DO NOT COPY, your name, or company branding.",
              },

              {
                q: "Will watermark affect PDF readability?",
                a: "No. You can adjust opacity and placement to keep the watermark subtle and professional.",
              },

              {
                q: "Do I need to install software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },

              {
                q: "Can I use this tool on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },

              {
                q: "Are my uploaded PDFs secure?",
                a: "Yes. Files are processed securely and are not stored permanently after processing.",
              },

              {
                q: "Can I watermark contracts, reports, and study files?",
                a: "Yes. This tool is useful for contracts, reports, invoices, assignments, presentations, and many other PDF documents.",
              },
            ],
          },
        }}

      />

    </>
  );
}

