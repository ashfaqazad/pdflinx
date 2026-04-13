"use client";
import { useState, useRef } from "react";
import { Download, CheckCircle, FileCode, Code2, Globe, Upload } from "lucide-react";
import Script from "next/script";
import RelatedToolsSection from "@/components/RelatedTools";
import { useProgressBar } from "@/hooks/useProgressBar";
import ProgressButton from "@/components/ProgressButton";

export default function HtmlToPDF() {
    const [mode, setMode] = useState("code"); // "code" | "url" | "file"
    const [htmlCode, setHtmlCode] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [htmlFile, setHtmlFile] = useState(null); // File object
    const [downloadUrl, setDownloadUrl] = useState("");
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const { progress, isLoading, startProgress, completeProgress, cancelProgress } = useProgressBar();

    // File select handler — FileReader se HTML content read karo
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
            alert("Please select a valid .html or .htm file");
            return;
        }
        setHtmlFile(file);
        setSuccess(false);
        setDownloadUrl("");
    };

    // isConvertReady — har mode ke liye check
    const isReady =
        (mode === "code" && htmlCode.trim().length > 0) ||
        (mode === "url" && urlInput.trim().length > 0) ||
        (mode === "file" && htmlFile !== null);

    const handleConvert = async (e) => {
        e.preventDefault();
        if (!isReady) {
            if (mode === "code") return alert("Please paste your HTML code first");
            if (mode === "url") return alert("Please enter a valid URL first");
            if (mode === "file") return alert("Please select an .html file first");
        }

        startProgress();
        setDownloadUrl("");
        setSuccess(false);

        try {
            // ✅ File mode mein pehle content read karo
            let bodyPayload;
            if (mode === "file") {
                const htmlContent = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = () => reject(new Error("File read failed"));
                    reader.readAsText(htmlFile, "UTF-8");
                });
                bodyPayload = { mode: "code", html: htmlContent };
            } else if (mode === "code") {
                bodyPayload = { mode: "code", html: htmlCode };
            } else {
                bodyPayload = { mode: "url", url: urlInput };
            }

            // ✅ Fetch karo
            const res = await fetch("/convert/html-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });

            // ✅ Error case — backend JSON error bhejta hai
            if (!res.ok) {
                const err = await res.json();
                cancelProgress();
                return alert("Conversion failed: " + (err.error || "Try again"));
            }

            // ✅ Success — seedha blob lo, JSON nahi
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = htmlFile
                ? htmlFile.name.replace(/\.html?$/i, ".pdf")
                : "pdflinx-html-to-pdf.pdf";
            a.click();
            window.URL.revokeObjectURL(blobUrl);

            completeProgress();
            setSuccess(true);

            setTimeout(() => {
                const downloadSection = document.getElementById("download-section");
                if (downloadSection) {
                    downloadSection.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 300);

        } catch (error) {
            cancelProgress();
            alert("Oops! Something went wrong. Please try again.");
            console.error(error);
        }
    };

    const handleDownload = async () => {
        if (!downloadUrl) return;
        try {
            const res = await fetch(downloadUrl);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            // File mode mein original filename se PDF naam rakho
            const pdfName = htmlFile
                ? htmlFile.name.replace(/\.html?$/i, ".pdf")
                : "pdflinx-html-to-pdf.pdf";
            a.download = pdfName;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Download failed");
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setHtmlFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setHtmlCode("");
        setUrlInput("");
        setDownloadUrl("");
    };

    return (
        <>
            {/* ==================== SEO SCHEMAS ==================== */}

            {/* HowTo Schema */}
            <Script
                id="howto-schema-html-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        name: "How to Convert HTML to PDF Online Free — Code or URL",
                        description:
                            "Convert HTML to PDF online free — no signup, no watermark. Paste your HTML code or enter a webpage URL. CSS styling, fonts, and layout are fully preserved. Works on Windows, Mac, Android, and iOS.",
                        url: "https://pdflinx.com/html-to-pdf",
                        step: [
                            {
                                "@type": "HowToStep",
                                name: "Paste HTML or Enter URL",
                                text: "Choose 'HTML Code' mode and paste your HTML code, or switch to 'Webpage URL' mode and enter any public webpage address.",
                            },
                            {
                                "@type": "HowToStep",
                                name: "Convert to PDF",
                                text: "Click 'Convert to PDF' and wait a few seconds. CSS styles, fonts, images, and layout are preserved automatically.",
                            },
                            {
                                "@type": "HowToStep",
                                name: "Download PDF",
                                text: "Click the Download button to save your converted PDF file instantly. No watermark added.",
                            },
                        ],
                        totalTime: "PT20S",
                        estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
                        image: "https://pdflinx.com/og-image.png",
                    }, null, 2),
                }}
            />

            {/* Breadcrumb Schema */}
            <Script
                id="breadcrumb-schema-html-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
                            { "@type": "ListItem", position: 2, name: "HTML to PDF", item: "https://pdflinx.com/html-to-pdf" },
                        ],
                    }, null, 2),
                }}
            />

            {/* FAQ Schema */}
            <Script
                id="faq-schema-html-pdf"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "Is the HTML to PDF converter free?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes. PDFLinx HTML to PDF converter is completely free — no hidden charges, no subscription, no account required.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Can I convert a webpage URL to PDF?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, and layout and converts it to PDF.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Will CSS styles and fonts be preserved?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes. CSS styling, custom fonts, colors, images, and layout are all preserved accurately in the converted PDF.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Can I convert HTML with inline CSS to PDF?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes. Both inline CSS and internal style blocks are fully supported. External stylesheets work when converting from a URL.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Are my HTML files and URLs safe and private?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes. HTML code and URLs are processed securely and permanently deleted after conversion. Never stored or shared.",
                                },
                            },
                        ],
                    }, null, 2),
                }}
            />

            {/* ==================== MAIN TOOL SECTION ==================== */}
            <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
                            Convert HTML to PDF Online Free
                            <br />
                            <span className="text-2xl md:text-3xl font-medium">
                                No Signup · No Watermark · CSS Preserved
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Convert HTML to PDF online free — paste your HTML code or enter a webpage URL.
                            CSS styles, fonts, images, and layout are preserved pixel-perfect. No software
                            needed. Works on Windows, Mac, Android, and iOS.
                        </p>
                    </div>

                    {/* Step Strip */}
                    <div className="grid grid-cols-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                        {[
                            { n: "1", label: "Paste HTML or URL", sub: "Code or webpage link" },
                            { n: "2", label: "Convert", sub: "CSS & layout preserved" },
                            { n: "3", label: "Download PDF", sub: "Instant & free" },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className={`flex flex-col items-center py-4 px-2 text-center ${i < 2 ? "border-r border-gray-100" : ""}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold mb-1 shadow-sm">
                                    {s.n}
                                </div>
                                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                                <p className="text-xs text-gray-400 hidden sm:block">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                        <div className={`relative transition-all duration-300 ${isLoading ? "pointer-events-none" : ""}`}>

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-2 rounded-full border-4 border-rose-200 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-semibold text-gray-700">Converting to PDF…</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {progress < 30 ? "Rendering HTML…" : progress < 70 ? "Applying styles…" : "Generating PDF…"}
                                        </p>
                                    </div>
                                    <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">{progress}%</p>
                                </div>
                            )}

                            <form onSubmit={handleConvert} className="p-8 space-y-5">

                                {/* Mode Toggle — 3 options */}
                                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => { setMode("code"); setSuccess(false); }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "code"
                                            ? "bg-white text-orange-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <Code2 className="w-4 h-4" />
                                        HTML Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMode("url"); setSuccess(false); }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "url"
                                            ? "bg-white text-orange-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        Webpage URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMode("file"); setSuccess(false); }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "file"
                                            ? "bg-white text-orange-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload .html File
                                    </button>
                                </div>

                                {/* HTML Code Mode */}
                                {mode === "code" && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Paste your HTML code below
                                        </label>
                                        <textarea
                                            value={htmlCode}
                                            onChange={(e) => { setHtmlCode(e.target.value); setSuccess(false); }}
                                            placeholder={`<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { font-family: Arial; padding: 40px; }\n      h1 { color: #e85d04; }\n    </style>\n  </head>\n  <body>\n    <h1>Hello PDF!</h1>\n    <p>Your HTML content here...</p>\n  </body>\n</html>`}
                                            rows={12}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y transition"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {["✓ Inline CSS", "✓ Style blocks", "✓ Images (base64)", "✓ Tables", "✓ Custom fonts"].map((t) => (
                                                <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* URL Mode */}
                                {mode === "url" && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Enter a public webpage URL
                                        </label>
                                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent transition">
                                            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                            <input
                                                type="url"
                                                value={urlInput}
                                                onChange={(e) => { setUrlInput(e.target.value); setSuccess(false); }}
                                                placeholder="https://example.com"
                                                className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {["✓ Full page render", "✓ External CSS", "✓ Images", "✓ Fonts", "✓ JavaScript rendered"].map((t) => (
                                                <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            ℹ️ Only public URLs are supported. Login-protected pages cannot be converted.
                                        </p>
                                    </div>
                                )}

                                {/* File Upload Mode */}
                                {mode === "file" && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Select your .html file
                                        </label>
                                        <label className="block cursor-pointer group">
                                            <div
                                                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${htmlFile
                                                    ? "border-orange-400 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-400 hover:bg-orange-50/40"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${htmlFile ? "bg-orange-100" : "bg-orange-50 group-hover:bg-orange-100"
                                                        }`}
                                                >
                                                    {htmlFile ? (
                                                        <CheckCircle className="w-7 h-7 text-orange-500" />
                                                    ) : (
                                                        <Upload className="w-7 h-7 text-orange-600" />
                                                    )}
                                                </div>

                                                {htmlFile ? (
                                                    <>
                                                        <p className="text-base font-semibold text-orange-700">
                                                            {htmlFile.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {(htmlFile.size / 1024).toFixed(1)} KB · Click to change file
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-base font-semibold text-gray-700">
                                                            Drop your .html file here
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            or click to browse · .html & .htm supported
                                                        </p>
                                                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                            {["✓ No signup", "✓ No watermark", "✓ CSS preserved", "✓ Auto-deleted"].map((t) => (
                                                                <span key={t} className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium px-2.5 py-1 rounded-full">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept=".html,.htm"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* Info Row + Convert Button */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                                    <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-1">
                                        <FileCode className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 leading-none">
                                                {mode === "code" ? "HTML code → PDF" : mode === "url" ? "Webpage URL → PDF" : ".html file → PDF"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">CSS, fonts, images preserved</p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isReady || isLoading}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-sm sm:w-auto w-full ${isReady && !isLoading
                                            ? "bg-gradient-to-r from-orange-600 to-rose-500 hover:from-orange-700 hover:to-rose-600 hover:shadow-md active:scale-[0.98]"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <FileCode className="w-4 h-4" />
                                        Convert to PDF
                                    </button>
                                </div>

                                {/* Hints */}
                                <div className="text-xs text-gray-400 text-center space-y-0.5 pb-1">
                                    <p>⏱️ URL conversion may take up to 30 seconds — don&apos;t close this tab</p>
                                    <p>🔒 No signup required · Files auto-deleted after conversion</p>
                                </div>

                            </form>
                        </div>

                        {/* Success State */}
                        {success && (
                            <div
                                id="download-section"
                                className="mx-6 mb-6 rounded-2xl overflow-hidden border border-orange-200 bg-gradient-to-br from-orange-50 to-rose-50"
                            >
                                <div className="flex flex-col items-center text-center px-8 py-10">
                                    <div className="relative w-16 h-16 mb-5">
                                        <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-30"></div>
                                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-orange-800 mb-1">
                                        Conversion Complete! 🎉
                                    </h3>
                                    <p className="text-sm text-orange-700 font-medium mb-1">
                                        Your HTML has been converted to a clean PDF
                                    </p>
                                    <p className="text-xs text-gray-500 mb-6">
                                        Click below to download your PDF file
                                    </p>

                                    {/* <button
                                        onClick={handleDownload}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-rose-500 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:from-orange-700 hover:to-rose-600 transition shadow-md mb-4"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button> */}

                                    <div className="flex flex-wrap gap-3 justify-center">
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-2 bg-white border border-orange-300 text-orange-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition shadow-sm"
                                        >
                                            <FileCode className="w-4 h-4" />
                                            Convert another
                                        </button>
                                        <a
                                            href="/merge-pdf"
                                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
                                        >
                                            Merge PDF →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Trust Bar */}
                    <p className="text-center mt-6 text-gray-500 text-sm">
                        No account · No watermark · Auto-deleted after 1 hour · 100% free ·
                        HTML code & URL supported · Works on Windows, Mac, Android &amp; iOS
                    </p>

                </div>
            </main>

            {/* ==================== SEO CONTENT SECTION ==================== */}
            <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
                        Free HTML to PDF Converter — Convert HTML Code or Webpage URL to PDF Online
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Need to save a webpage or convert your HTML template to PDF? Paste your HTML code or
                        enter any public URL and download a pixel-perfect PDF instantly. CSS styles, fonts,
                        images, and layout preserved. Free, fast, and private on PDFLinx.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Code2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">HTML Code & URL Support</h3>
                        <p className="text-gray-600 text-sm">
                            Paste raw HTML code with inline CSS or internal styles, or enter any public
                            webpage URL. Both modes produce pixel-perfect PDF output.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl shadow-lg border border-rose-100 text-center hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">CSS & Fonts Preserved</h3>
                        <p className="text-gray-600 text-sm">
                            CSS styling, custom fonts, colors, images, and complex layouts are all
                            preserved accurately — your PDF looks exactly like the original HTML.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
                        <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Download className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant PDF Download</h3>
                        <p className="text-gray-600 text-sm">
                            No email required, no file uploads — your PDF is generated and downloaded
                            directly in seconds. Auto-deleted after conversion for privacy.
                        </p>
                    </div>
                </div>

                {/* How To Steps */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
                        How to Convert HTML to PDF — 3 Simple Steps
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                                1
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Paste HTML or Enter URL</h4>
                            <p className="text-gray-600 text-sm">
                                Choose HTML Code mode and paste your HTML, or switch to URL mode and
                                enter any public webpage address you want to convert to PDF.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                                2
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Click Convert to PDF</h4>
                            <p className="text-gray-600 text-sm">
                                Hit Convert and wait a few seconds. CSS styles, fonts, images, and
                                layout are preserved automatically in the output PDF.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                                3
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Download Your PDF</h4>
                            <p className="text-gray-600 text-sm">
                                Click Download to save your PDF instantly. No watermark, no signup,
                                and your data is permanently deleted after conversion.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contextual Links */}
                <div className="mt-10 bg-white p-6 md:p-8 shadow-sm rounded-xl border border-gray-100">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">
                        Need to do more with your PDF?
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                        After converting HTML to PDF, these tools can help you organize and share your document.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <a href="/merge-pdf" className="text-blue-700 font-semibold hover:underline">Merge PDF</a>{" "}
                            <span className="text-slate-600">— combine your HTML PDF with other documents into one file.</span>
                        </li>
                        <li>
                            <a href="/compress-pdf" className="text-blue-700 font-semibold hover:underline">Compress PDF</a>{" "}
                            <span className="text-slate-600">— reduce the converted PDF file size for easy email sharing.</span>
                        </li>
                        <li>
                            <a href="/word-to-pdf" className="text-blue-700 font-semibold hover:underline">Word to PDF</a>{" "}
                            <span className="text-slate-600">— convert Word documents to PDF alongside your HTML files.</span>
                        </li>
                        <li>
                            <a href="/free-pdf-tools" className="text-blue-700 font-semibold hover:underline">Browse all PDF tools</a>{" "}
                            <span className="text-slate-600">— merge, split, compress, convert & more.</span>
                        </li>
                    </ul>
                </div>

                <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
                    Trusted by developers, designers, and businesses to convert HTML templates and
                    webpages to PDF — fast, reliable, and always free.
                </p>
            </section>

            {/* ==================== DEEP SEO CONTENT ==================== */}
            <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    HTML to PDF Converter – Free Online Tool by PDFLinx
                </h2>

                <p className="text-base leading-7 mb-6">
                    Need to save a webpage as PDF or convert an HTML email template, invoice, or report
                    to PDF format? The{" "}
                    <span className="font-medium text-slate-900">PDFLinx HTML to PDF Converter</span>{" "}
                    renders your HTML exactly as a browser would — CSS styles, custom fonts, images,
                    tables, and layouts preserved pixel-perfect — and delivers a clean PDF instantly.
                    No software installation, no watermarks, no sign-up required.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What Is HTML to PDF Conversion?
                </h3>
                <p className="leading-7 mb-6">
                    HTML to PDF conversion takes your HTML code or a live webpage and renders it into a
                    fixed-layout PDF document. Everything — CSS styling, fonts, colors, images, tables,
                    and page layout — stays exactly as designed, regardless of what device or software
                    the recipient uses. This is ideal for generating invoices, reports, certificates,
                    HTML email previews, and archiving webpages as PDF files.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Why Convert HTML to PDF?
                </h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                    <li>Preserves CSS styles, fonts, colors, images, and layout perfectly</li>
                    <li>Opens identically on every device — no browser differences</li>
                    <li>Protects content from editing — read-only PDF format</li>
                    <li>Print-ready output with consistent page layout</li>
                    <li>Archive webpages as PDF for offline use or record-keeping</li>
                    <li>Generate PDF invoices, reports, and certificates from HTML templates</li>
                    <li>Share HTML email templates as PDF for client review</li>
                    <li>Convert HTML documentation to PDF for distribution</li>
                </ul>

                <div className="mt-10 space-y-10">

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                            HTML Code vs Webpage URL — Which Mode Should I Use?
                        </h3>
                        <p className="leading-7">
                            Use <strong>HTML Code mode</strong> when you have raw HTML markup — email
                            templates, invoice HTML, custom-built pages, or code copied from your editor.
                            Inline CSS and internal &lt;style&gt; blocks are fully supported. Use{" "}
                            <strong>Webpage URL mode</strong> when you want to convert any public live
                            website to PDF — the tool renders the full page including external stylesheets,
                            images, and JavaScript-rendered content. Note that login-protected or
                            private pages cannot be converted via URL.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                            How to Convert HTML to PDF Without Losing Formatting
                        </h3>
                        <ul className="space-y-2 list-disc pl-6 leading-7 mb-3">
                            <li>Use <strong>inline CSS or &lt;style&gt; blocks</strong> — external stylesheets work only in URL mode</li>
                            <li>Use <strong>A4 page width</strong> (794px) in your HTML for best PDF page fit</li>
                            <li>Avoid percentage-based widths that may not translate to fixed PDF dimensions</li>
                            <li>Use <strong>base64-encoded images</strong> in HTML Code mode for images to render correctly</li>
                            <li>Add <code className="bg-gray-100 px-1 rounded text-sm">@media print</code> CSS rules to control page breaks and print layout</li>
                        </ul>
                        <p className="leading-7">
                            PDFLinx renders HTML using a full headless browser — your CSS, fonts, and layout
                            are processed exactly as Chrome would render them before converting to PDF.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                            Common Use Cases for HTML to PDF Conversion
                        </h3>
                        <ul className="space-y-2 list-disc pl-6 leading-7">
                            <li>
                                <strong>HTML invoices and receipts:</strong> Convert HTML invoice templates to
                                PDF for professional client billing without requiring PDF software.
                            </li>
                            <li>
                                <strong>Email template previews:</strong> Convert HTML email designs to PDF
                                for client approval, portfolio presentation, or design review.
                            </li>
                            <li>
                                <strong>Web page archiving:</strong> Save any public webpage as PDF for
                                offline reading, evidence preservation, or compliance records.
                            </li>
                            <li>
                                <strong>HTML reports and dashboards:</strong> Export data reports or dashboard
                                views built in HTML to PDF for stakeholder sharing.
                            </li>
                            <li>
                                <strong>Certificates and credentials:</strong> Generate PDF certificates from
                                HTML templates for courses, events, or employee recognition.
                            </li>
                            <li>
                                <strong>Developer documentation:</strong> Convert HTML documentation pages to
                                PDF for offline distribution or client handover packages.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                            Privacy and File Security
                        </h3>
                        <p className="leading-7">
                            PDFLinx is built with privacy as a core priority. HTML code and URLs submitted
                            for conversion are processed securely and{" "}
                            <strong>permanently deleted after conversion</strong> — never stored long-term,
                            never shared with third parties, and never used for any other purpose. No
                            account creation is required — no email, no password, no personal data
                            collected.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                            Convert HTML to PDF on Any Device
                        </h3>
                        <p className="leading-7">
                            PDFLinx works on <strong>Windows, macOS, Linux, Android, and iOS</strong> — in
                            any modern browser. No app download, no software installation required. Whether
                            you are a developer on your desktop or a business owner on your phone, you can
                            convert HTML to PDF in seconds. Fully responsive interface with instant results.
                        </p>
                    </div>

                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10 mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                        PDFLinx HTML to PDF Converter — Feature Summary
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5 text-sm">
                        <li>Free online HTML to PDF converter — no hidden fees</li>
                        <li>Paste HTML code or convert from a webpage URL</li>
                        <li>CSS styles, fonts, and images fully preserved</li>
                        <li>Headless browser rendering — pixel-perfect output</li>
                        <li>Inline CSS and internal style blocks supported</li>
                        <li>High-quality, print-ready PDF output</li>
                        <li>Fast processing — conversion in seconds</li>
                        <li>No watermark added to converted files</li>
                        <li>Works on desktop and mobile browsers</li>
                        <li>Files auto-deleted after conversion — privacy protected</li>
                        <li>No signup or account required</li>
                        <li>Cross-platform: Windows, macOS, Android, iOS</li>
                    </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Who Should Use This Tool?
                </h3>
                <ul className="space-y-2 mb-6 list-disc pl-6">
                    <li><strong>Web developers:</strong> Convert HTML templates, components, and documentation to PDF for client delivery</li>
                    <li><strong>Designers:</strong> Export HTML email designs and mockups to PDF for stakeholder review</li>
                    <li><strong>Business owners:</strong> Generate PDF invoices and quotes from HTML templates without extra software</li>
                    <li><strong>Marketers:</strong> Archive landing pages and campaign pages as PDF for records or presentations</li>
                    <li><strong>Students & researchers:</strong> Save webpages and online articles as PDF for offline reading</li>
                    <li><strong>Anyone with HTML:</strong> Instantly convert any HTML content to a portable, shareable PDF</li>
                </ul>

            </section>

            {/* ==================== FAQ SECTION ==================== */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "Is the HTML to PDF converter free to use?",
                                a: "Yes. PDFLinx HTML to PDF converter is completely free — no hidden charges, no subscription, no premium tier required.",
                            },
                            {
                                q: "Do I need to install any software?",
                                a: "No. Everything works directly in your browser. No desktop software, no plugins needed.",
                            },
                            {
                                q: "Can I convert a live webpage URL to PDF?",
                                a: "Yes. Switch to URL mode and paste any public webpage address. The tool renders the full page including CSS, images, and layout and converts it to PDF.",
                            },
                            {
                                q: "Will CSS styles and fonts be preserved after conversion?",
                                a: "Yes. CSS styling, custom fonts, colors, images, and layout are all preserved accurately in the converted PDF.",
                            },
                            {
                                q: "Can I convert HTML with inline CSS to PDF?",
                                a: "Yes. Both inline CSS and internal <style> blocks are fully supported. External stylesheets work when converting from a URL.",
                            },
                            {
                                q: "Why are my images not showing in the converted PDF?",
                                a: "In HTML Code mode, use base64-encoded images so they are embedded directly in the HTML. External image URLs may not load in code mode. In URL mode, all images load normally.",
                            },
                            {
                                q: "Can I convert a password-protected or login-required page?",
                                a: "No. Only public pages accessible without login can be converted via URL mode. For private pages, copy the HTML source and use HTML Code mode instead.",
                            },
                            {
                                q: "Are my HTML code and URLs safe and private?",
                                a: "Yes. HTML code and URLs are processed securely and permanently deleted after conversion. They are never stored long-term or shared with third parties.",
                            },
                            {
                                q: "Why is my PDF layout different from the original HTML?",
                                a: "PDF pages have fixed dimensions (A4 by default). HTML designed for wide screens may overflow. Use a max-width of 794px and @media print CSS rules in your HTML to optimize the layout for PDF output.",
                            },
                            {
                                q: "Can I combine the converted HTML PDF with other PDFs?",
                                a: "Yes. After converting, use the Merge PDF tool on PDFLinx to combine multiple PDFs into one organized document.",
                            },
                        ].map((faq, i) => (
                            <details key={i} className="bg-white rounded-lg shadow-sm p-5 group">
                                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                                    {faq.q}
                                    <span className="text-orange-500 ml-3 text-lg group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="mt-2 text-gray-600">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <RelatedToolsSection currentPage="html-pdf" />
        </>
    );
}