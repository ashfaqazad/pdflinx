"use client";

import { useState } from "react";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import { useToolFlow } from "@/hooks/useToolFlow";
import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";

import {
  FileSpreadsheet,
  GitMerge,
  Minimize2,
  FileText,
  Table,
  Download,
  Lock,
} from "lucide-react";

// ── Config ───────────────────────────────────────────
const DONE_LINKS = [
  { label: "Merge PDF", href: "/merge-pdf", icon: <GitMerge className="h-4 w-4 text-purple-500" /> },
  { label: "Compress PDF", href: "/compress-pdf", icon: <Minimize2 className="h-4 w-4 text-green-500" /> },
  { label: "Word to PDF", href: "/word-to-pdf", icon: <FileText className="h-4 w-4 text-blue-500" /> },
  { label: "PDF to Excel", href: "/pdf-to-excel", icon: <Table className="h-4 w-4 text-emerald-500" /> },
  { label: "Protect PDF", href: "/protect-pdf", icon: <Lock className="h-4 w-4 text-red-500" /> },
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
      const res = await fetch("/convert/excel-pdf", {
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

        uploadLanding={{
  content: {
    heroBadge: "✦ Free Excel to PDF Converter — No Signup, No Watermark",

    heroTitle: (
      <>
        Convert Excel to PDF Online{" "} <br />
        <em className="text-[#e8420a]">for Free</em>
      </>
    ),

    heroDescription:
      "Convert Excel to PDF online for free — no signup, no watermark, no software needed. Turn XLS and XLSX spreadsheets into professional PDF documents instantly. Perfect for sharing financial reports, invoices, budgets, data sheets, and business records via email, WhatsApp, and government portals. Maintains original formatting, column widths, fonts, and cell borders. Works on Windows, Mac, Android, and iPhone — convert Excel to PDF in seconds right in your browser.",

    pills: [
      "Convert XLSX to PDF",
      "Excel to PDF free",
      "Keep formatting intact",
      "Convert for email sharing",
      "Works on mobile",
      "No file size limit",
    ],

    noticeItems: [
      "Original Excel formatting preserved",
      "XLS and XLSX formats supported",
      "No email or account required",
    ],

    seoBadge: "Excel to PDF Guide",

    seoTitle: "Free Excel to PDF Converter — Convert XLSX to PDF Instantly | PDFLinx",

    seoDescription:
      "Convert Excel to PDF online for free. Turn XLS and XLSX spreadsheets into PDF documents instantly. No signup, no watermark. Formatting preserved. Works on Android, iPhone, and desktop.",

    howToTitle: "How to Convert Excel to PDF — 3 Simple Steps",

    howToSubtitle:
      "Upload your Excel file, convert it to PDF automatically, and download the formatted PDF instantly — no account required.",

    howToSteps: [
      {
        n: "1",
        title: "Upload Your Excel File",
        desc: "Choose or drag & drop your XLS or XLSX file into the upload area. Supports all Excel formats including Excel 97–2003 (.xls) and modern Excel (.xlsx). Works on desktop and mobile.",
      },
      {
        n: "2",
        title: "Convert to PDF",
        desc: "Conversion starts instantly. PDFLinx preserves your spreadsheet formatting — column widths, fonts, borders, merged cells, and print areas — in the output PDF.",
      },
      {
        n: "3",
        title: "Download Your PDF",
        desc: "Download your converted PDF immediately — no watermark, no quality loss, ready to share via email, WhatsApp, or upload to any portal.",
      },
    ],

    whyTitle: "Why Use PDFLinx Excel to PDF Converter?",

    whyPoints: [
      {
        title: "100% Free, Always",
        desc: "No subscription, no credits, no hidden fees. Convert unlimited Excel files to PDF at zero cost — free for everyone, forever.",
      },
      {
        title: "Formatting Perfectly Preserved",
        desc: "Column widths, row heights, fonts, cell borders, merged cells, colors, and print areas are all maintained in the converted PDF — exactly as they appear in Excel.",
      },
      {
        title: "Supports XLS and XLSX",
        desc: "Works with all Excel file formats — modern XLSX files and legacy XLS files from Excel 97–2003. No need to resave or reformat before uploading.",
      },
      {
        title: "Works on All Devices",
        desc: "Convert Excel to PDF on iPhone, Android, Windows, or Mac — no software installation needed. Everything runs directly in your browser.",
      },
      {
        title: "Secure & Private",
        desc: "All files are transferred over HTTPS encryption and permanently deleted from our servers immediately after conversion. Your spreadsheets are never stored or accessed.",
      },
      {
        title: "No Watermark Ever",
        desc: "PDFLinx never stamps a watermark on your converted PDF. Your financial reports, invoices, and data sheets stay clean and professional.",
      },
      {
        title: "Instant Conversion, Instant Download",
        desc: "Convert large multi-sheet Excel files in seconds. No queue, no waiting — your PDF is ready for download as soon as processing completes.",
      },
    ],

    faqTitle: "Excel to PDF FAQs",

    faqs: [
      {
        q: "Is the Excel to PDF converter free?",
        a: "Yes. PDFLinx Excel to PDF is completely free with no hidden costs, credits, or subscriptions required.",
      },
      {
        q: "Do I need Microsoft Excel or any software installed?",
        a: "No. PDFLinx converts Excel files entirely in the cloud — no Excel, no software, and no browser extensions needed.",
      },
      {
        q: "Will my Excel formatting be preserved in the PDF?",
        a: "Yes. PDFLinx preserves column widths, fonts, cell borders, merged cells, colors, and layout so the PDF looks exactly like your spreadsheet.",
      },
      {
        q: "Can I convert XLSX and XLS files?",
        a: "Yes. Both modern XLSX files and legacy XLS files from older versions of Excel are fully supported.",
      },
      {
        q: "Can I convert a multi-sheet Excel workbook to PDF?",
        a: "Yes. PDFLinx can convert multi-sheet Excel workbooks. All sheets are included and rendered in the output PDF.",
      },
      {
        q: "Can I use this to convert Excel invoices or reports to PDF for sharing?",
        a: "Absolutely. PDFLinx is ideal for converting invoices, financial reports, budgets, timesheets, and data sheets to PDF for sharing via email or WhatsApp.",
      },
      {
        q: "Can I upload an Excel file for a government portal or official submission?",
        a: "Yes. Convert your Excel file to PDF and upload it to government portals, university admissions systems, or HR platforms that require PDF format.",
      },
      {
        q: "Does PDFLinx add a watermark to converted PDFs?",
        a: "No. PDFLinx never adds watermarks. Your converted PDF is completely clean with no branding stamped on it.",
      },
      {
        q: "Are my uploaded Excel files safe and private?",
        a: "Yes. Files are encrypted during transfer over HTTPS and automatically deleted from our servers after conversion. We never store or read your data.",
      },
      {
        q: "Can I convert Excel to PDF on my phone?",
        a: "Yes. PDFLinx works on Android, iPhone, tablets, and all modern desktop browsers with no app installation needed.",
      },
      {
        q: "What happens if my Excel file has images or charts?",
        a: "Charts, images, and embedded graphics inside your Excel file are included and rendered in the converted PDF output.",
      },
    ],

    relatedTitle: "More PDF Tools",

    seoSections: [
      {
        title: "Convert Excel Invoices & Financial Reports to PDF",
        text: "Turn your Excel invoices, balance sheets, profit & loss statements, and payroll reports into professional PDF documents. PDFs are universally readable, non-editable, and accepted by clients, auditors, and government agencies worldwide.",
      },
      {
        title: "Convert Excel to PDF for Email & WhatsApp Sharing",
        text: "Excel files are not always openable by recipients without Microsoft Office. Converting to PDF ensures your spreadsheet looks identical on every device — ideal for sharing reports, invoices, and quotations via Gmail, Outlook, or WhatsApp.",
      },
      {
        title: "Upload Excel Data to Government & University Portals",
        text: "Many official portals, university admission systems, and HR platforms only accept PDF uploads. Use PDFLinx to convert your Excel forms, mark sheets, salary slips, and data tables to PDF before uploading to any portal.",
      },
      {
        title: "Preserve Excel Formatting in PDF Output",
        text: "PDFLinx maintains your original spreadsheet layout including column widths, row heights, cell borders, merged cells, font styles, and print areas. The converted PDF mirrors your Excel file exactly — no reformatting needed.",
      },
      {
        title: "Secure Online Excel to PDF Conversion",
        text: "All uploaded Excel files are encrypted during transfer and automatically purged from our servers after conversion. No account is required and your financial or business data is never stored or accessed.",
      },
    ],

    showPdfTypes: false,
  },
}}
      />

    </>
  );
}

