"use client";

import { useState } from "react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileSpreadsheet, FileText, FileSearch,
  Scan, Minimize2, GitMerge, Shield, Pencil
} from "lucide-react";

// ── Config ─────────────────────────────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "Excel to PDF", href: "/excel-pdf", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
//   { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
//   { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
//   { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
//   { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
// ];


const DONE_LINKS = [
  { label: "Excel to PDF", href: "/excel-pdf", icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> },
  { label: "PDF to Word", href: "/pdf-to-word", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "PDF to Text", href: "/pdf-to-text", icon: <FileSearch className="h-4 w-4 text-yellow-500" /> },
  { label: "OCR PDF", href: "/ocr-pdf", icon: <Scan className="h-4 w-4 text-violet-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Shield className="h-4 w-4 text-red-500" /> },
  { label: "Edit PDF", href: "/edit-pdf", icon: <Pencil className="h-4 w-4 text-orange-500" /> },
];


const SIDEBAR_NOTICE = (
  <>
    <p className="text-sm font-semibold text-emerald-800">
      ℹ️ PDF Table Extraction
    </p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
      <li>Best with text-based PDFs</li>
      <li>Single file → XLSX directly</li>
      <li>Multiple files → ZIP with all XLSX</li>
      <li>Scanned PDFs may need OCR first</li>
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
      <li>✓ Tables extracted from PDF automatically</li>
      <li>✓ Rows, columns & data preserved</li>
      <li>✓ Single file → XLSX directly</li>
      <li>✓ Multiple files → ZIP download</li>
      <li>✓ Open in Excel, Google Sheets, LibreOffice</li>
    </ul>
  </div>
);
// ───────────────────────────────────────────────────────────────────────────

export default function PdfToExcel({ seo }) {
  const flow = useToolFlow();
  const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("converted.xlsx");

  const handleRemoveFile = (index) => {
    const updated = flow.files.filter((_, i) => i !== index);
    if (updated.length === 0) flow.reset();
    else flow.selectFiles(updated);
  };

  const getDownloadName = () => {
    if (flow.files.length === 1) {
      return flow.files[0]?.name
        ? flow.files[0].name.replace(/\.pdf$/i, ".xlsx")
        : "converted.xlsx";
    }
    return "pdflinx-pdf-to-excel.zip";
  };

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
    } catch {
      alert("Download failed");
    }
  };

  // ── API LOGIC ──────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!flow.files.length)
      return alert("Please select a PDF file first!");

    flow.startProcessing();
    startProgress();
    setDownloadUrl(null);

    const formData = new FormData();
    flow.files.forEach((f) => formData.append("files", f));
    formData.append("mode", flow.files.length === 1 ? "single" : "multiple");

    try {


      // const res = await fetch("/convert/pdf-excel", {
      //   method: "POST",
      //   body: formData,
      // });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/pdf-excel`,
        {
          method: "POST",
          body: formData,
        }
      );



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
  // ── END API LOGIC ──────────────────────────────────────────────────────

  return (
    <>
      {/* ── SEO Schemas ── */}
      <Script
        id="howto-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert PDF to Excel Online for Free",
            url: "https://pdflinx.com/pdf-excel",
            step: [
              { "@type": "HowToStep", name: "Upload PDF", text: "Select one PDF or multiple PDFs for batch conversion." },
              { "@type": "HowToStep", name: "Convert to Excel", text: "Click Convert to Excel — tables are extracted automatically." },
              { "@type": "HowToStep", name: "Download XLSX or ZIP", text: "Single file downloads as XLSX. Multiple files download as ZIP." },
            ],
            totalTime: "PT30S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png",
          }, null, 2),
        }}
      />
      <Script
        id="breadcrumb-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "PDF to Excel", item: "https://pdflinx.com/pdf-excel" },
            ],
          }, null, 2),
        }}
      />
      <Script
        id="faq-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the PDF to Excel converter free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Completely free with no hidden charges or subscription." } },
              { "@type": "Question", name: "Will tables be extracted accurately?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rows, columns, and data are extracted accurately. Best with text-based PDFs." } },
              { "@type": "Question", name: "Can I convert multiple PDFs to Excel at once?", acceptedAnswer: { "@type": "Answer", text: "Yes. Upload multiple PDFs — all XLSX files delivered as a single ZIP." } },
              { "@type": "Question", name: "Are my files safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes. Files are permanently deleted after conversion. Never stored or shared." } },
              { "@type": "Question", name: "Can I convert PDF to Excel on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. Works on Android and iOS mobile browsers — no app required." } },
            ],
          }, null, 2),
        }}
      />

      <Script
        id="software-schema-pdf-excel"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PDF to Excel",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web Browser",
            url: "https://pdflinx.com/pdf-excel",
            description:
              "Free online PDF to Excel converter. Extract tables from PDF files and convert them into editable Excel spreadsheets (XLSX) while preserving rows, columns, and formatting.",
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
              "Convert PDF to Excel spreadsheets",
              "Extract tables from PDF documents",
              "Export to XLSX format",
              "Preserve rows and columns",
              "Support for scanned and digital PDFs",
              "Batch PDF to Excel conversion",
              "Free online PDF converter",
              "No software installation required"
            ]
          }, null, 2),
        }}
      />

      {/* ── Tool UI ── */}
      <ToolPageLayout
        title={seo?.h1 || "PDF to Excel Converter (Free & Online)"}
        tagline="No Signup · No Watermark · Instant Download"
        accept="application/pdf,.pdf"
        multiple={true}
        convertLabel="Convert to Excel"
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

        processingTitle="Extracting Tables from PDF"
        processingDescription="Please wait while we extract your PDF tables into Excel format."
        processingStages={["Uploading file", "Detecting tables", "Generating XLSX"]}

        doneTitle="Your Excel file is ready"
        doneDescription={
          flow.files.length > 1
            ? "All PDF tables have been extracted into Excel files successfully."
            : "Your PDF tables have been extracted into an Excel file successfully."
        }
        doneFileName={downloadName}
        downloadLabel={flow.files.length > 1 ? "Download ZIP" : "Download XLSX"}
        resetLabel="Convert another PDF"

        sidebarTitle="PDF to Excel"
        sidebarIcon={<FileSpreadsheet className="h-5 w-5 text-emerald-500" />}
        sidebarDescription="Extract tables from PDF files into editable Excel spreadsheets — fast, free, and accurate."
        sidebarNotice={SIDEBAR_NOTICE}
        sidebarFeatures={SIDEBAR_FEATURES}

        // ============================================================
        // PDF TO EXCEL — uploadLanding content
        // PdfToWord.jsx pattern ke mutabiq — as-is paste karo
        // ============================================================

        uploadLanding={{
          content: {
            relatedTools: DONE_LINKS,
            eyebrow: "PDF TO EXCEL CONVERTER",

            breadcrumbCurrent: "PDF to Excel Converter",

            heroBadge: "✦ 100% Free · No Signup · No Watermark",

            heroTitle: (
              <>
                PDF to Excel Converter —{" "}
                <em className="font-bold text-[#e8420a] sm:italic">
                  Extract Tables to XLSX Free
                </em>
              </>
            ),
            heroDescription:
              "Convert PDF to Excel online free — extract tables and data from any PDF into an editable XLSX spreadsheet. Rows, columns, and numbers converted accurately. No signup, no watermark.",
            pills: ["Tables extracted accurately", "Editable XLSX output", "Multi-page PDFs", "No signup"],



            uploadTitle: "Drop your PDF here",
            uploadSubtitle: "or click to browse — PDF files supported",

            trustPills: ["100% Free", "No Sign Up", "No Watermark"],

            noticeTitle: "PDF to Excel Conversion",
            noticeItems: [
              "Single PDF → editable XLSX",
              "Tables & data extracted accurately",
              "Multiple pages → multiple sheets",
            ],

            rating: "4.9/5",
            ratingText: "Trusted by 50,000+ users monthly",

            pdfTypeSection: {
              enabled: true,
              eyebrow: "PDF Types",
              title: "Standard PDF vs Scanned PDF",
              subtitle:
                "Know the difference — choose the right conversion option for best table extraction results.",
            },

            howToEyebrow: "How It Works",
            howToTitle: "How to Convert PDF to Excel — 3 Simple Steps",
            howToSubtitle:
              "No learning curve. Upload, convert, download — done in under 30 seconds.",

            howToSteps: [
              {
                n: "1",
                title: "Upload Your PDF File",
                desc: "Select your PDF from your device. Drag and drop supported on all devices — mobile, tablet, and desktop. Works with PDFs containing tables, financial data, invoices, and reports.",
                color: "bg-blue-600",
              },
              {
                n: "2",
                title: "Convert to Excel",
                desc: "Click Convert — our engine detects and extracts all tables and structured data from your PDF into properly organized rows and columns in an XLSX spreadsheet.",
                color: "bg-purple-600",
              },
              {
                n: "3",
                title: "Download Your XLSX File",
                desc: "Your editable Excel file is ready in seconds. Download it instantly — all data in correct cells, ready to filter, sort, calculate, and analyze without retyping anything.",
                color: "bg-emerald-600",
              },
            ],

            whyTitle: "Why PDFLinx is the Best Free PDF to Excel Converter Online",

            seoBadge: "PDF to Excel Guide",
            seoTitle: "Complete Guide to Converting PDF to Excel Online",
            seoDescription:
              "Everything you need to know about converting PDF files to editable Excel spreadsheets — free, online, with tables and data accurately extracted. No watermark, no signup, no limits.",

            seoSections: [
              {
                title:
                  "Free PDF to Excel Converter — Extract Tables & Data from PDF to XLSX Online",
                text: "Need to extract data from a PDF into Excel? PDFLinx lets you convert PDF to Excel online for free — instantly, with no software installation required. Whether it is a financial report, invoice, bank statement, price list, or any PDF containing tables and numbers, PDFLinx extracts all structured data into a clean, fully editable XLSX spreadsheet in seconds. No signup, no watermark, no hidden limits. It is the best free PDF to Excel converter available today — works on Windows, Mac, iPhone, and Android.",
              },
              {
                title: "What is PDF to Excel Conversion?",
                text: "PDF to Excel conversion extracts tables, numbers, and structured data from a static PDF document and places them into editable spreadsheet cells. This means you can filter, sort, calculate, chart, and analyze the data immediately — without manually retyping a single number. It is especially valuable for financial reports, invoices, bank statements, inventory lists, and research data where the original editable source file is unavailable.",
              },
              {
                title: "How Accurate is PDF to Excel Table Extraction?",
                text: "For standard text-based PDFs, PDFLinx achieves very high extraction accuracy — table borders, column headers, merged cells, and multi-row data are all detected and placed in the correct Excel cells. For scanned PDFs or image-based tables, OCR is used to recognize text within the image before extraction. Accuracy depends on scan quality — clear, high-resolution scans produce near-perfect results. Complex nested tables or heavily styled PDFs may need minor cleanup in Excel after conversion.",
              },
              {
                title:
                  "Why PDFLinx is the Best Free PDF to Excel Converter — No Watermark, No Limits",
                text: "Most free PDF to Excel converters add watermarks, limit the number of pages you can convert, or lock accurate table extraction behind a paid plan. PDFLinx does none of that — completely free, no signup, no watermark, and no daily conversion limit. Unlike iLovePDF and Smallpdf which restrict PDF to Excel conversion on free tiers, PDFLinx gives you full access at zero cost.",
              },
              {
                title: "Common Use Cases for PDF to Excel Conversion",
                text: "✓ Finance & Accounting: Extract bank statements, financial reports, and balance sheets into Excel for analysis and reconciliation.\n✓ Business Analysts: Pull data tables from PDF reports into Excel for further processing, charting, and modeling.\n✓ Procurement & Inventory: Convert supplier price lists and inventory PDFs into editable spreadsheets.\n✓ Researchers: Extract tabular research data from published PDF papers into Excel for statistical analysis.\n✓ HR Teams: Pull attendance records, payroll summaries, and employee data from PDF reports into Excel.\n✓ Students: Extract data tables from textbooks, case studies, and research PDFs for assignments.",
              },
              {
                title:
                  "Convert PDF to Excel on iPhone, Android, Mac & Windows — No App Needed",
                text: "PDFLinx works entirely in your browser — no download, no installation, no app required. On iPhone or Android, open your browser and upload your PDF directly from your files app. On Mac or Windows, drag and drop your PDF and download the XLSX in seconds. Whether you need to convert PDF to Excel on mobile or desktop, PDFLinx works seamlessly across every platform and operating system.",
              },
              {
                title: "Privacy and File Security",
                text: "Your files are processed on secure servers and automatically deleted after 1 hour. We do not store, share, or access your documents at any point. PDFLinx is built with privacy-first principles — your data stays yours. All file transfers use encrypted HTTPS connections for complete security. This is especially important for financial documents and confidential business data.",
              },
              {
                title:
                  "PDF to Excel vs Manual Data Entry — Why a Converter Saves Hours",
                text: "Manually retyping tables from a PDF into Excel is time-consuming, error-prone, and simply unnecessary. A 10-page financial report with 50 rows of data per page could take hours to enter manually — PDFLinx extracts it in under 30 seconds. Even if minor cleanup is needed after conversion, it is always faster than starting from scratch. For large datasets, PDF to Excel conversion is not just convenient — it is essential.",
              },
              {
                title: "Best For Data-Heavy Documents",
                text: "Use the converted Excel file for financial analysis, data processing, reporting, and decision-making. The XLSX output is fully compatible with Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers — easy to open, edit, and share across any platform.",
              },
            ],

            faqs: [
              {
                q: "Is PDFLinx PDF to Excel converter free?",
                a: "Yes, completely free. No hidden charges, no premium plans, and no limits on the number of conversions. Convert as many PDFs as you need at zero cost.",
              },
              {
                q: "Do I need to sign up or create an account?",
                a: "No account required. Upload your PDF and convert instantly — no email, no registration, no friction.",
              },
              {
                q: "How accurately are tables extracted from the PDF?",
                a: "For standard text-based PDFs, table extraction is very accurate — rows, columns, and headers are placed in the correct Excel cells. Scanned PDFs use OCR for extraction and accuracy depends on scan quality.",
              },
              {
                q: "Can I convert scanned PDFs to Excel?",
                a: "Yes. For scanned or image-based PDFs, OCR is used to recognize text and extract tables. Clear, high-resolution scans produce the best results.",
              },
              {
                q: "What file format will I receive after conversion?",
                a: "You will receive a .XLSX file — fully compatible with Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers.",
              },
              {
                q: "Will multiple tables from different pages be extracted?",
                a: "Yes. Tables from all pages of your PDF are extracted. Each page or table section is organized into the spreadsheet for easy navigation.",
              },
              {
                q: "Does PDFLinx add any watermark to the Excel file?",
                a: "No watermarks, ever. Your converted Excel file is 100% clean and ready to use or share.",
              },
              {
                q: "Is my file secure and private?",
                a: "Yes. Files are processed on secure servers over encrypted HTTPS and automatically deleted after 1 hour. We never store, share, or view your documents — especially important for financial and confidential data.",
              },
              {
                q: "Can I use PDFLinx on mobile — iPhone and Android?",
                a: "Yes. PDFLinx works perfectly in the browser on iPhone, Android, iPad, Windows, and Mac — no app download or installation needed.",
              },
              {
                q: "What is the maximum file size limit?",
                a: "Up to 10 MB per file. For larger PDFs, try splitting the file first using our free PDF Split tool, then convert each part separately.",
              },
              {
                q: "Why is some data not extracting correctly?",
                a: "Complex nested tables, merged cells, or heavily styled PDFs can sometimes cause minor extraction issues. After conversion, a quick review and cleanup in Excel usually takes only a few minutes.",
              },
              {
                q: "Can I convert a password-protected PDF to Excel?",
                a: "You need to unlock the PDF first. Use our free PDF Unlock tool to remove the password, then convert to Excel.",
              },
              {
                q: "How long does PDF to Excel conversion take?",
                a: "Most conversions complete within 10 to 30 seconds depending on file size and the number of tables being extracted.",
              },
              {
                q: "Is PDFLinx better than iLovePDF or Smallpdf for free PDF to Excel?",
                a: "Yes — PDFLinx offers unlimited free conversions with accurate table extraction, no daily limits, no watermark, and no account required. iLovePDF and Smallpdf restrict PDF to Excel conversion behind paid plans.",
              },
            ],

            ctaTitle: (
              <>
                Convert PDF to Excel now —<br />
                free, private, no sign‑up.
              </>
            ),
            ctaDescription:
              "Join thousands who trust PDFLinx for fast, accurate PDF to Excel data extraction every day.",
            ctaButton: "Choose PDF File",
          },
        }}


      />
    </>
  );
}


