// components/RemovePages.jsx

"use client";
import { useState } from "react";
import { Upload, Scissors, CheckCircle, FileText } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";
// import PdfPreviewSelector from "@/components/PdfPreviewSelector";

import dynamic from "next/dynamic";

const PdfPreviewSelector = dynamic(
  () => import("@/components/PdfPreviewSelector"),
  { ssr: false }
);

export default function RemovePdf() {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);

  const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a PDF file first!");
    if (!selectedPages.length) return alert("Please select page(s) to remove.");

    startProgress();
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", selectedPages.join(","));

    try {
      const res = await fetch("/convert/remove-pages", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Failed to remove pages";
        try {
          const maybeJson = await res.json();
          msg = maybeJson?.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      if (!contentType.includes("application/pdf")) {
        throw new Error("Unexpected response from server.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-pages-removed.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      completeProgress();
      setSuccess(true);
      setFile(null);
      setSelectedPages([]);
      e.target.reset();
    } catch (err) {
      cancelProgress();
      alert(err.message || "Something went wrong, please try again.");
      console.error(err);
    }
  };



  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Remove Pages from a PDF Online for Free",
              description:
                "Delete unwanted pages from a PDF in 3 quick steps. Upload your file, enter page numbers or ranges, and download the updated PDF instantly.",
              url: "https://pdflinx.com/remove-pages",
              step: [
                {
                  "@type": "HowToStep",
                  name: "Upload PDF",
                  text: "Upload the PDF file from which you want to delete pages.",
                },
                {
                  "@type": "HowToStep",
                  name: "Enter page numbers",
                  text: "Type the pages or page ranges you want to remove, such as 2,5,8-10.",
                },
                {
                  "@type": "HowToStep",
                  name: "Download updated PDF",
                  text: "Click the remove pages button and download your new PDF instantly.",
                },
              ],
              totalTime: "PT20S",
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
        id="breadcrumb-schema-remove-pages"
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
                  name: "Remove Pages",
                  item: "https://pdflinx.com/remove-pages",
                },
              ],
            },
            null,
            2
          ),
        }}
      />

      <Script
        id="faq-schema-remove-pages"
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
                  name: "Is the Remove Pages from PDF tool free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, PDFLinx lets you remove pages from PDF online for free with no signup required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I specify which pages to delete?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Enter page numbers separated by commas, such as 2,5,7 or ranges like 3-6.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I remove multiple pages at once?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. You can remove multiple individual pages or page ranges in one go.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will the remaining PDF pages stay in the same order?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Only the selected pages are removed. The rest of the document stays in its original order.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are my PDF files safe?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Files are processed securely and deleted automatically after a short time.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I remove pages from PDF on mobile?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. PDFLinx works on desktop, tablet, and mobile browsers.",
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
        id="software-schema-remove-pages"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Remove Pages from PDF - PDFLinx",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              description:
                "Remove unwanted pages from PDF online free. Delete single pages or page ranges instantly with no signup and no watermark.",
              url: "https://pdflinx.com/remove-pages",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Delete pages from PDF",
                "Remove PDF page ranges",
                "Free online PDF page remover",
                "No watermark",
                "Secure file processing",
                "Works on mobile and desktop",
                "Instant browser-based tool",
              ],
              creator: {
                "@type": "Organization",
                name: "PDFLinx",
              },
            },
            null,
            2
          ),
        }}
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window?.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Remove Pages from PDF Online Free
              <br />
              <span className="text-2xl md:text-3xl font-medium">
                Delete Unwanted PDF Pages in Seconds
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Remove pages from PDF online free — no signup, no watermark, no software needed.
              Delete one page, multiple pages, or page ranges from your PDF instantly.
              Works on Windows, Mac, Android, and iPhone.
            </p>
          </div>



          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input */}
              <div className="relative">


                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-red-500 hover:bg-red-50"
                      }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-red-600" />
                    <p className="text-lg font-semibold text-gray-700">
                      {file ? file.name : "Drop your PDF here or click to upload"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">Only .pdf files</p>

                    <p className="text-xs text-gray-500 mt-2">
                      Upload your PDF, preview pages, select the pages to remove, and download the cleaned file instantly.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const pickedFile = e.target.files?.[0] || null;
                      setFile(pickedFile);
                      setSelectedPages([]);
                    }}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* PDF Preview Selector */}
              {file && (
                <PdfPreviewSelector
                  file={file}
                  selectedPages={selectedPages}
                  setSelectedPages={setSelectedPages}
                />
              )}

              {/* Selected pages info */}
              {file && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-gray-700">
                  <span className="font-semibold">Pages selected to remove: </span>
                  {selectedPages.length ? selectedPages.join(", ") : "None"}
                </div>
              )}

              {/* Button */}
              <ProgressButton
                isLoading={isLoading}
                progress={progress}
                disabled={!file || !selectedPages.length}
                icon={<Scissors className="w-5 h-5" />}
                label="Remove Pages"
                gradient="from-red-600 to-orange-600"
              />

              <div className="text-sm text-gray-600 text-center mt-4 space-y-1">
                <p>
                  ✂️ <strong>Delete extra, blank, or unwanted pages</strong> from your PDF in seconds.
                </p>
                <p>
                  👆 <strong>Click page previews to select pages</strong> you want to remove.
                </p>
              </div>
            </form>

            {/* Success State */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-xl font-bold text-green-700 mb-2">
                  Done! Your updated PDF downloaded automatically 🎉
                </p>
                <p className="text-base text-gray-700">
                  Check your downloads folder.
                </p>
              </div>
            )}
          </div>


          <p className="text-center mt-6 text-gray-600 text-base">
            No account • No watermark • Auto-deleted after 1 hour • 100% free •
            Works on desktop & mobile
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Free PDF Page Remover — Delete Unwanted Pages Without Editing the Whole File
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need to remove a blank page, title page, appendix, duplicate scan, or unnecessary section from a PDF?
            PDFLinx lets you delete pages from PDF online quickly without changing the rest of your document.
            Just upload, enter page numbers, and download the cleaned PDF.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border border-red-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Delete Specific Pages</h3>
            <p className="text-gray-600 text-sm">
              Remove one page, several pages, or full page ranges from a PDF file without editing the rest of the document.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Keeps Remaining Pages Intact</h3>
            <p className="text-gray-600 text-sm">
              Only the selected pages are deleted. The remaining pages stay in the same order and layout as your original PDF.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Free</h3>
            <p className="text-gray-600 text-sm">
              No signup, no installation, and no watermark. Remove unwanted pages from PDF online in seconds from any device.
            </p>
          </div>
        </div>

        {/* How To */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Remove Pages from PDF — 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your PDF</h4>
              <p className="text-gray-600 text-sm">
                Select the PDF file from which you want to delete blank, duplicate, or unnecessary pages.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Pages to Remove</h4>
              <p className="text-gray-600 text-sm">
                Type page numbers like 2,4,7 or ranges like 5-8 to choose which pages should be deleted.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Download Updated PDF</h4>
              <p className="text-gray-600 text-sm">
                Click Remove Pages and download your cleaned PDF instantly with all other pages preserved.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Perfect for students, office users, freelancers, and anyone who needs a quick way to clean up PDF files.
        </p>
      </section>

      {/* ==================== LONG CONTENT / SEMANTIC SEO ==================== */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Remove Pages from PDF Online – Free PDF Page Deleter by PDFLinx
        </h2>

        <p className="text-base leading-7 mb-6">
          A Remove Pages from PDF tool helps you delete unwanted pages from a PDF file without recreating the document from scratch.
          This is useful when your PDF contains blank pages, duplicate pages, unwanted covers, incorrect scans, extra appendices, or pages you simply do not want to share.
          <span className="font-medium text-slate-900"> PDFLinx Remove Pages from PDF</span>{" "}
          makes the process fast and simple directly in your browser.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Does Remove Pages from PDF Mean?
        </h3>
        <p className="leading-7 mb-6">
          Removing pages from a PDF means deleting selected pages while keeping the rest of the document unchanged.
          For example, if your PDF has 20 pages and you remove pages 2, 5, and 10-12, the remaining pages are kept in order and exported as a new PDF.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Do People Delete Pages from PDF Files?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Remove blank pages from scanned PDFs</li>
          <li>Delete wrong or duplicate pages</li>
          <li>Remove a title page or cover page</li>
          <li>Delete confidential or unnecessary pages before sharing</li>
          <li>Clean up long reports, invoices, or assignments</li>
        </ul>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Remove PDF Pages Without Reordering the File
            </h3>
            <p className="leading-7">
              One of the biggest advantages of using a dedicated PDF page remover is that it deletes only the pages you choose.
              The rest of the document remains untouched. This is especially useful for contracts, reports, eBooks, and scanned files where layout consistency matters.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Delete Single Pages or Page Ranges
            </h3>
            <p className="leading-7">
              PDFLinx supports both individual page numbers and page ranges.
              For example, you can remove pages like <strong>2, 5, 9</strong> or entire ranges like <strong>10-15</strong>.
              This makes it faster to clean large PDF documents.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Best Use Cases for a PDF Page Remover
            </h3>
            <ul className="space-y-2 list-disc pl-6 leading-7">
              <li>Delete scanned blank pages after OCR or document scans</li>
              <li>Remove unwanted appendix pages before sending a report</li>
              <li>Clean up invoices or proposals before client delivery</li>
              <li>Delete answer sheets or extra pages from study material</li>
              <li>Trim exported PDFs before uploading to portals</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Remove Pages from PDF on Mobile
            </h3>
            <p className="leading-7">
              Need to delete pages from PDF on Android or iPhone? PDFLinx works directly in mobile browsers,
              so you can upload a PDF, remove selected pages, and download the updated file without installing an app.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              After Removing Pages, What Next?
            </h3>
            <p className="leading-7">
              After deleting unnecessary pages, you may want to use{" "}
              <a href="/organize-pdf" className="text-red-700 font-medium hover:underline">
                Organize PDF
              </a>{" "}
              to reorder pages,{" "}
              <a href="/merge-pdf" className="text-red-700 font-medium hover:underline">
                Merge PDF
              </a>{" "}
              to combine files, or{" "}
              <a href="/compress-pdf" className="text-red-700 font-medium hover:underline">
                Compress PDF
              </a>{" "}
              to reduce file size for easier sharing.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-10">
          How to Delete Pages from PDF Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Upload your PDF file</li>
          <li>Enter the page numbers or ranges you want to remove</li>
          <li>Click the Remove Pages button</li>
          <li>Download the new PDF instantly</li>
        </ol>

        <p className="mb-6">
          No registration, no software installation, and no watermark required.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Remove Pages Tool
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online remove pages from PDF tool</li>
            <li>Delete one page or multiple pages</li>
            <li>Supports page ranges like 4-8</li>
            <li>Fast browser-based PDF processing</li>
            <li>No watermark added to your file</li>
            <li>No signup required</li>
            <li>Works on desktop, tablet, and mobile</li>
            <li>Secure file handling</li>
            <li>Clean and simple interface</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Remove unwanted assignment or notes pages</li>
          <li><strong>Professionals:</strong> Clean reports and proposals before sharing</li>
          <li><strong>Businesses:</strong> Delete confidential or unnecessary PDF sections</li>
          <li><strong>Freelancers:</strong> Deliver polished documents to clients</li>
          <li><strong>Teachers:</strong> Prepare cleaner study or exam material</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Safe to Use?
        </h3>
        <p className="leading-7 mb-6">
          Yes. PDFLinx is privacy-focused. Uploaded files are processed securely and deleted automatically after processing.
          Your PDF documents are not stored permanently.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Remove PDF Pages Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx works on Windows, macOS, Linux, Android, and iOS devices.
          All you need is an internet connection and a modern browser to remove pages from PDF quickly and securely.
        </p>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the Remove Pages from PDF tool free to use?",
                a: "Yes. PDFLinx lets you remove pages from PDF online for free with no hidden charges, no subscription, and no signup required.",
              },
              {
                q: "How do I enter pages to delete?",
                a: "Type page numbers separated by commas, like 2,5,9. You can also enter page ranges like 4-7.",
              },
              {
                q: "Can I remove multiple pages at once?",
                a: "Yes. You can remove several individual pages or multiple page ranges in one operation.",
              },
              {
                q: "Will the remaining pages keep their original order?",
                a: "Yes. Only the selected pages are deleted. The rest of the PDF stays in the same sequence.",
              },
              {
                q: "Can I remove blank pages from a scanned PDF?",
                a: "Yes. This tool is useful for deleting blank pages, duplicate scan pages, and unnecessary document sections.",
              },
              {
                q: "Do I need to install any software?",
                a: "No. Everything works directly in your browser on desktop and mobile devices.",
              },
              {
                q: "Are my uploaded PDF files secure?",
                a: "Yes. Files are processed securely and automatically deleted after a short time.",
              },
              {
                q: "Can I use this PDF page remover on mobile?",
                a: "Yes. PDFLinx works on Android phones, iPhones, tablets, laptops, and desktop browsers.",
              },
              {
                q: "Can I remove a cover page or title page from a PDF?",
                a: "Yes. Simply enter the page number of the cover page or title page and download the updated PDF.",
              },
              {
                q: "What should I use if I want to reorder pages instead of deleting them?",
                a: "For reordering pages, use an Organize PDF tool. Remove Pages is specifically for deleting selected pages.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-red-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection currentPage="remove-pages" />



    </>
  );
}