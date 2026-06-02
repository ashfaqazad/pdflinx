"use client";
import Script from "next/script";
import { useState } from "react";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Image as ImageIcon,
  Minimize2,
  GitMerge,
  Shield,
  Scan
} from "lucide-react";

// ── Config ───────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];

const DONE_LINKS = [
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  // { label: "PPT to PDF",     href: "/ppt-to-pdf",     icon: <Presentation    className="h-4 w-4 text-orange-500"  /> },
  { label: "PPT to PDF", href: "/ppt-to-pdf", icon: <FileImage className="h-4 w-4 text-orange-500" /> },
  { label: "Image to PDF", href: "/image-to-pdf", icon: <ImageIcon className="h-4 w-4 text-pink-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-emerald-800">
      ℹ️ XLS & XLSX Supported
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Both XLS and XLSX files work</li>
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
      <li>✓ XLS & XLSX both supported</li>
      <li>✓ Tables, charts & sheets preserved</li>
      <li>✓ Single file → PDF directly</li>
      <li>✓ Multiple files → ZIP download</li>
      <li>✓ Clean PDF output</li>
    </ul>
  </div>
);

// ───────────────────────────────────────────

export default function ExcelToPdf({ seo }) {
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
        ? flow.files[0].name.replace(/\.(xlsx|xls)$/i, ".pdf")
        : "converted.pdf";
    }

    return "pdflinx-excel-pdf.zip";
  };

  // ── DOWNLOAD HANDLER ─────────────────────
  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const res = await fetch(downloadUrl);
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
      alert("Download failed");
    }
  };

  // ── API LOGIC ────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length) {
      return alert("Please select an Excel file first!");
    }

    flow.startProcessing();
    startProgress();

    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("mode", flow.files.length === 1 ? "single" : "multiple");

    try {
      // const res = await fetch("/convert/excel-pdf", {
      //   method: "POST",
      //   body: formData,
      // });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/excel-pdf`, {
        method: "POST",
        body: formData,
      });


      const data = await res.json();

      if (!res.ok || !data.success) {
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
        id="howto-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Convert Excel to PDF Online for Free (Single or Multiple Files)",
              description:
                "Convert Excel to PDF online free — no signup, no watermark. Tables, charts, and formatting preserved. Batch convert multiple XLS or XLSX files at once. Works on Windows, Mac, Android, iOS.",
              url: "https://pdflinx.com/excel-pdf",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload Excel (single or multiple)",
                  text: "Click the upload area and select one Excel file — or select multiple Excel files at once.",
                },
                {
                  "@type": "HowToStep",
                  name: "Convert to PDF",
                  text: "Click 'Convert to PDF' and wait a few seconds. If you uploaded multiple files, we convert them together.",
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

      {/* Breadcrumb Schema - Excel to PDF */}
      <Script
        id="breadcrumb-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                { "@type": "ListItem", position: 2, name: "Excel to PDF", item: "https://pdflinx.com/excel-pdf" },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the Excel to PDF converter free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PDFLinx Excel to PDF converter is completely free — no hidden charges, no subscription required."
                }
              },
              {
                "@type": "Question",
                "name": "Will charts and formatting be preserved?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Tables, charts, formulas, colors, and grid lines are all preserved accurately in the converted PDF."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert multiple Excel files at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Upload multiple XLS or XLSX files simultaneously. All converted PDFs are delivered as a single ZIP download."
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
                "name": "Can I convert Excel to PDF on mobile?",
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
        id="software-schema-excel-pdf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Excel to PDF Converter - PDFLinx",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            description: "Convert Excel to PDF online free — XLS and XLSX spreadsheets converted with all data, charts, and cell formatting intact. No Excel installation needed, no signup, no watermark.",
            url: "https://pdflinx.com/excel-pdf",
            screenshot: "https://pdflinx.com/og-image.png",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Convert Excel to PDF online",
              "XLS and XLSX supported",
              "Charts and cell formatting preserved",
              "No Excel installation needed",
              "Free online Excel to PDF converter",
              "No signup required",
              "Secure file processing",
              "Works on mobile and desktop"
            ],
            creator: { "@type": "Organization", name: "PDFLinx" }
          }, null, 2),
        }}
      />

      <ToolPageLayout
        title={seo?.h1 || "Excel to PDF Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        accept=".xlsx,.xls"
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
        processingTitle="Converting Excel to PDF"
        processingDescription="Please wait while we convert your spreadsheet into a PDF."
        processingStages={[
          "Uploading file",
          "Processing spreadsheet",
          "Generating PDF",
        ]}
        doneTitle="Your PDF is ready"
        doneDescription={
          flow.files.length > 1
            ? "Your Excel files have been converted successfully."
            : "Your Excel file has been converted to PDF successfully."
        }
        doneFileName={downloadName}
        downloadLabel={flow.files.length > 1 ? "Download ZIP" : "Download PDF"}
        resetLabel="Convert another file"
        sidebarTitle="Excel to PDF"
        sidebarIcon={<FileSpreadsheet className="h-5 w-5 text-emerald-500" />}
        sidebarDescription="Convert Excel spreadsheets to PDF instantly — XLS and XLSX supported."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // ============================================================
        // EXCEL TO PDF — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "EXCEL TO PDF CONVERTER",

            breadcrumbCurrent: "Excel to PDF Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            // heroTitle: (
            //   <>
            //     Excel to PDF Converter —{" "}
            //     <em className="font-bold text-[#e8420a] sm:italic">
            //       Free, Online, Layout Preserved
            //     </em>
            //   </>
            // ),

            // heroDescription:
            //   "Convert Excel spreadsheets to PDF online for free. All sheets, tables, charts, and formatting preserved — no signup, no watermark, no software needed. Works on any device.",

            // pills: [
            //   "No watermark",
            //   "All sheets converted",
            //   "Works on any device",
            //   "Instant conversion",
            // ],

            heroTitle: (
              <>
                Excel to PDF Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  XLS & XLSX to PDF Free Online
                </em>
              </>
            ),
            heroDescription:
              "Convert Excel to PDF online free — XLS and XLSX spreadsheets converted with all data, charts, and cell formatting intact. No Excel installation needed. Works directly in your browser on any device.",
            pills: ["XLS & XLSX supported", "Charts & formatting kept", "No software needed", "No watermark"],


            uploadTitle: "Drop your Excel file here",
            uploadSubtitle: "or click to browse — .xls and .xlsx files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "Excel to PDF Conversion",
            noticeItems: [
              "Supports .xls and .xlsx formats",
              "All sheets included in output",
              "Charts, tables & formatting preserved",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: false,
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert Excel to PDF — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your Excel File",
                desc: "Select your .xls or .xlsx file from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. No file size tricks, no compression.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Choose Options & Convert",
                desc: "Select whether to include all sheets or a specific sheet. Click Convert — all data, charts, tables, and formatting are preserved automatically in the PDF output.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your PDF",
                desc: "Your converted PDF is ready in seconds. Download it instantly — clean, properly formatted, and ready to share or submit without any watermark.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free Excel to PDF Converter Online",

            seoBadge: "Excel to PDF Guide",
            seoTitle: "Complete Guide to Converting Excel to PDF Online",
            seoDescription:
              "Everything you need to know about converting Excel spreadsheets to PDF — free, online, with all formatting preserved. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free Excel to PDF Converter — Convert XLS & XLSX to PDF Online",
                text: "Need to convert an Excel file to PDF? PDFLinx lets you convert Excel to PDF online for free — instantly, with no software installation required. Whether it is a simple spreadsheet, a financial model with charts, or a multi-sheet workbook, PDFLinx converts it to a clean, properly formatted PDF in seconds. No signup, no watermark, no hidden limits. It is the best free Excel to PDF converter available online today — works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is Excel to PDF Conversion?",
                text: "Excel to PDF conversion turns your spreadsheet into a fixed-layout PDF document. Unlike an editable Excel file, a PDF cannot be accidentally modified, looks identical on every device, and is universally accepted for sharing and submission. Converting Excel to PDF is essential when you need to send financial reports, invoices, data tables, or any spreadsheet to someone who does not have Excel installed — or when you want to lock the content before sharing.",
              },
              {
                title: "How to Convert Excel to PDF Without Losing Formatting",
                text: "One of the most common concerns when converting Excel to PDF is whether cell borders, column widths, chart styles, merged cells, and colors are preserved. PDFLinx uses high-fidelity rendering to ensure the output PDF looks exactly like your spreadsheet on screen. Tables stay aligned, charts render correctly, and multi-sheet workbooks are handled page by page. For best results, make sure your Excel print area is properly set before uploading — but even without it, PDFLinx handles the layout intelligently.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free Excel to PDF Converter — No Watermark, No Limits",
                text: "Most free Excel to PDF converters add watermarks, restrict file sizes, or require account creation. PDFLinx does none of that — completely free, no signup, no watermark, and no daily conversion limit. Unlike iLovePDF free tier and Smallpdf free tier which restrict batch conversions behind paid plans, PDFLinx gives you unlimited conversions at zero cost.",
              },
              {
                title: "Common Use Cases for Excel to PDF Conversion",
                text: "✓ Finance & Accounting: Share financial reports, balance sheets, and budget summaries as locked, non-editable PDFs.\n✓ Business Professionals: Send proposals, pricing tables, and project trackers that look polished and professional.\n✓ Students: Submit data analysis assignments, charts, and spreadsheets as PDF for coursework.\n✓ HR Teams: Distribute salary structures, attendance records, and leave trackers as PDF.\n✓ Freelancers: Send invoices and project cost sheets as professional PDFs to clients.\n✓ Developers & Analysts: Share data tables and reports without requiring recipients to have Excel.",
              },
              {
                title:
                  "Convert Excel to PDF on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your Excel file directly from your files app. On Mac or Windows, drag and drop and download the PDF in seconds. Unlike desktop software like Microsoft Excel or Adobe Acrobat, PDFLinx is fully online and free. Whether you need to convert Excel to PDF on mobile or desktop, PDFLinx works seamlessly on every device and operating system.",
              },
              {
                title:
                  "PDFLinx vs iLovePDF vs Smallpdf — Free Excel to PDF Converter Comparison",
                text: "iLovePDF and Smallpdf both limit free Excel to PDF conversions per day and require sign-up for full access. Adobe Acrobat charges a monthly subscription for Excel to PDF export. PDFLinx offers unlimited free conversions with no account, no watermark, and no daily limits. For anyone looking for the best free iLovePDF alternative or Smallpdf alternative for Excel to PDF conversion, PDFLinx is the clear choice.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security.",
              },
              {
                title:
                  "Excel to PDF vs Print to PDF — Why a Proper Converter Gives Better Results",
                text: "Many people try to convert Excel to PDF using the browser's Print to PDF function or File > Save As PDF in Excel — but this approach often cuts off columns, breaks page layout, and loses chart formatting. A dedicated Excel to PDF converter like PDFLinx handles column widths, page breaks, and multi-sheet layouts correctly, giving you a PDF that looks exactly like your spreadsheet without any clipping or misalignment.",
              },
              {
                title: "Best For Professional Document Sharing",
                text: "Use the converted PDF for client deliverables, email attachments, official submissions, and archiving. The output is a standard PDF file compatible with Adobe Acrobat, Preview, Chrome, and every PDF viewer — easy to share and open on any device without requiring Excel.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx Excel to PDF converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of conversions. Convert as many Excel files as you need at zero cost.",
              },
              {
                q: "Which Excel formats are supported?",
                a: "PDFLinx supports both .xls (older Excel format) and .xlsx (modern Excel format). Both are fully supported with formatting preserved.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your Excel file and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "Will charts and graphs be preserved in the PDF?",
                a: "Yes. Charts, bar graphs, pie charts, and other visualizations are rendered accurately in the PDF output — exactly as they appear in your Excel file.",
              },
              {
                q: "Will all sheets in my workbook be converted?",
                a: "Yes. All sheets in your Excel workbook are included in the PDF by default, each on its own page or set of pages depending on the sheet size.",
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
                a: "Up to 20 MB per file. For larger workbooks, try splitting the sheets into separate files before uploading.",
              },
              {
                q: "Why are some columns cut off in the PDF?",
                a: "This can happen if your Excel sheet is wider than a standard page. Make sure your print area and column widths are set correctly in Excel before uploading, or use landscape orientation in the conversion options.",
              },
              {
                q: "Can I convert a password-protected Excel file?",
                a: "You need to remove the password from your Excel file before uploading. Open it in Excel, remove the password, save, and then upload to PDFLinx.",
              },
              {
                q: "How long does Excel to PDF conversion take?",
                a: "Most conversions complete within 10 to 20 seconds depending on file size and complexity.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free Excel to PDF?",
                a: "Yes — PDFLinx offers unlimited free conversions with no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict batch conversions behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert Excel to PDF now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate Excel to PDF conversion every day.",
            ctaButton: "Choose Excel File",
          },
        }}


      />

    </>
  );
}

