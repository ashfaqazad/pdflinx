// "use client";

// import { useState } from "react";
// import Script from "next/script";
// import { useProgressBar } from "@/hooks/useProgressBar";
// import { useToolFlow } from "@/hooks/useToolFlow";
// import ToolPageLayout from "@/components/ToolFlow/ToolPageLayout";
// import {
//   FileText, FileSearch, Languages, MessageSquare,
//   Minimize2, GitMerge, Shield, FileOutput,
// } from "lucide-react";

// // ── Language lists ────────────────────────────────────────────────────────────
// // Must match SUPPORTED_LANGUAGES in backend aiTools.js
// const SOURCE_LANGUAGES = [
//   { value: "auto",       label: "Auto Detect" },
//   { value: "English",    label: "English" },
//   { value: "Arabic",     label: "Arabic — عربي" },
//   { value: "French",     label: "French — Français" },
//   { value: "Spanish",    label: "Spanish — Español" },
//   { value: "German",     label: "German — Deutsch" },
//   { value: "Chinese",    label: "Chinese — 中文" },
//   { value: "Japanese",   label: "Japanese — 日本語" },
//   { value: "Korean",     label: "Korean — 한국어" },
//   { value: "Turkish",    label: "Turkish — Türkçe" },
//   { value: "Portuguese", label: "Portuguese — Português" },
//   { value: "Russian",    label: "Russian — Русский" },
//   { value: "Italian",    label: "Italian — Italiano" },
//   { value: "Hindi",      label: "Hindi — हिन्दी" },
//   { value: "Urdu",       label: "Urdu — اردو" },
//   { value: "Bengali",    label: "Bengali — বাংলা" },
//   { value: "Malay",      label: "Malay — Bahasa Melayu" },
//   { value: "Persian",    label: "Persian — فارسی" },
//   { value: "Dutch",      label: "Dutch — Nederlands" },
//   { value: "Polish",     label: "Polish — Polski" },
//   { value: "Swedish",    label: "Swedish — Svenska" },
// ];

// const TARGET_LANGUAGES = SOURCE_LANGUAGES.filter(l => l.value !== "auto");

// // ── Related links ─────────────────────────────────────────────────────────────
// const DONE_LINKS = [
//   { label: "PDF Summarizer", href: "/pdf-summarizer", icon: <FileSearch  className="h-4 w-4 text-blue-500"   /> },
//   { label: "Chat with PDF",  href: "/chat-with-pdf",  icon: <MessageSquare className="h-4 w-4 text-purple-500" /> },
//   { label: "PDF to Word",    href: "/pdf-to-word",    icon: <FileText    className="h-4 w-4 text-orange-500" /> },
//   { label: "Compress PDF",   href: "/compress-pdf",   icon: <Minimize2   className="h-4 w-4 text-green-500"  /> },
//   { label: "Merge PDF",      href: "/merge-pdf",      icon: <GitMerge    className="h-4 w-4 text-indigo-500" /> },
//   { label: "Protect PDF",    href: "/protect-pdf",    icon: <Shield      className="h-4 w-4 text-red-500"    /> },
//   { label: "PDF to Text",    href: "/pdf-to-text",    icon: <FileOutput  className="h-4 w-4 text-yellow-500" /> },
//   { label: "OCR PDF",        href: "/ocr-pdf",        icon: <FileSearch  className="h-4 w-4 text-pink-500"   /> },
// ];

// const SIDEBAR_NOTICE = (
//   <>
//     <p className="text-sm font-semibold text-blue-800">ℹ️ AI-Powered Translator</p>
//     <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-600">
//       <li>First 3 pages translated</li>
//       <li>20 languages supported</li>
//       <li>Works on text-based PDFs</li>
//       <li>Takes 15–30 seconds</li>
//     </ul>
//   </>
// );

// const SIDEBAR_FEATURES = [
//   "✓ No account required",
//   "✓ 20 languages supported",
//   "✓ AI-powered translation",
//   "✓ 100% free",
//   "✓ Auto language detection",
//   "✓ Works on all devices",
// ];

// // ── Options panel ─────────────────────────────────────────────────────────────
// function TranslateOptionsSlot({ sourceLang, setSourceLang, targetLang, setTargetLang }) {
//   return (
//     <div className="space-y-5">

//       {/* Info notice */}
//       <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
//         <span className="mt-0.5 shrink-0">ℹ️</span>
//         <span>
//           Select the correct source language for better accuracy.
//           Use <strong>Auto Detect</strong> if unsure.
//         </span>
//       </div>

//       {/* From */}
//       <div className="space-y-1.5">
//         <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
//           From:
//         </label>
//         <div className="relative">
//           <select
//             value={sourceLang}
//             onChange={(e) => setSourceLang(e.target.value)}
//             className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
//           >
//             {SOURCE_LANGUAGES.map((l) => (
//               <option key={l.value} value={l.value}>{l.label}</option>
//             ))}
//           </select>
//           <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
//         </div>
//       </div>

//       {/* Swap icon */}
//       <div className="flex justify-center">
//         <button
//           type="button"
//           title="Swap languages"
//           onClick={() => {
//             if (sourceLang === "auto") return;
//             // Only swap if source is not "auto"
//             const prevSource = sourceLang;
//             const prevTarget = targetLang;
//             setSourceLang(prevTarget);
//             setTargetLang(prevSource);
//           }}
//           className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 text-base hover:border-blue-300 hover:text-blue-600 transition select-none"
//         >
//           ⇅
//         </button>
//       </div>

//       {/* To — violet tint like iLovePDF */}
//       <div className="space-y-1.5">
//         <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
//           To:
//         </label>
//         <div className="relative">
//           <select
//             value={targetLang}
//             onChange={(e) => setTargetLang(e.target.value)}
//             className="w-full appearance-none rounded-lg border border-violet-200 bg-violet-50 py-2.5 pl-3 pr-8 text-sm text-slate-800 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition"
//           >
//             {TARGET_LANGUAGES.map((l) => (
//               <option key={l.value} value={l.value}>{l.label}</option>
//             ))}
//           </select>
//           <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
//         </div>
//       </div>

//       <hr className="border-slate-100" />

//       {/* Processing notice */}
//       <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700 space-y-1">
//         <p className="font-semibold">⏱️ Processing time: 15–30 seconds</p>
//         <p className="text-amber-600">First 3 pages of your PDF will be translated.</p>
//       </div>
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export default function AiTranslate({ seo }) {
//   const flow = useToolFlow();
//   const { progress, startProgress, completeProgress, cancelProgress } = useProgressBar();

//   const [translation, setTranslation] = useState(null);
//   const [sourceLang,  setSourceLang]  = useState("auto");
//   const [targetLang,  setTargetLang]  = useState("Urdu");

//   const handleRemoveFile = (index) => {
//     const updated = flow.files.filter((_, i) => i !== index);
//     if (updated.length === 0) flow.reset();
//     else flow.selectFiles(updated);
//   };

//   const handleConvert = async () => {
//     if (!flow.files.length) return alert("Please select a PDF file first!");

//     flow.startProcessing();
//     startProgress();
//     setTranslation(null);

//     // FormData — upload.fields() on backend will correctly parse req.body
//     const formData = new FormData();
//     formData.append("pdf",        flow.files[0]);
//     formData.append("targetLang", targetLang);
//     formData.append("sourceLang", sourceLang);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/translate`,
//         { method: "POST", body: formData }
//       );

//       if (!res.ok) {
//         let msg = "Translation failed";
//         try { const j = await res.json(); msg = j?.error || msg; } catch {}
//         throw new Error(msg);
//       }

//       const data = await res.json();
//       setTranslation(data.translation);
//       completeProgress();
//       flow.finishSuccess();
//     } catch (err) {
//       cancelProgress();
//       flow.handleError(err.message || "Something went wrong, please try again.");
//     }
//   };

//   const handleDownload = () => {
//     if (!translation) return;
//     const blob = new Blob([translation], { type: "text/plain" });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href     = url;
//     a.download = `pdflinx-translation-${targetLang.toLowerCase()}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       {/* ── SEO schemas ── */}
//       <Script id="howto-schema-translate" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify({
//           "@context": "https://schema.org", "@type": "HowTo",
//           name: "How to Translate a PDF Online for Free",
//           url: "https://pdflinx.com/translate-pdf",
//           step: [
//             { "@type": "HowToStep", name: "Upload PDF",       text: "Upload your PDF file." },
//             { "@type": "HowToStep", name: "Select Languages", text: "Choose source and target language from 20+ options." },
//             { "@type": "HowToStep", name: "Translate",        text: "Click Translate PDF and wait 15–30 seconds." },
//             { "@type": "HowToStep", name: "Download",         text: "Read or download the translated text." },
//           ],
//           totalTime: "PT30S",
//           estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//           image: "https://pdflinx.com/og-image.png",
//         }, null, 2) }}
//       />
//       <Script id="breadcrumb-schema-translate" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify({
//           "@context": "https://schema.org", "@type": "BreadcrumbList",
//           itemListElement: [
//             { "@type": "ListItem", position: 1, name: "Home",          item: "https://pdflinx.com" },
//             { "@type": "ListItem", position: 2, name: "Translate PDF", item: "https://pdflinx.com/translate-pdf" },
//           ],
//         }, null, 2) }}
//       />
//       <Script id="faq-schema-translate" type="application/ld+json" strategy="afterInteractive"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify({
//           "@context": "https://schema.org", "@type": "FAQPage",
//           mainEntity: [
//             { "@type": "Question", name: "Is the PDF translator free?",    acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free with no hidden charges." } },
//             { "@type": "Question", name: "How many languages supported?",  acceptedAnswer: { "@type": "Answer", text: "20 languages including Urdu, Hindi, Arabic, French, Spanish, German, Chinese, Japanese, Korean, Turkish, and more." } },
//             { "@type": "Question", name: "Does it work on scanned PDFs?",  acceptedAnswer: { "@type": "Answer", text: "Text-based PDFs work best. Use our OCR PDF tool first for scanned PDFs." } },
//             { "@type": "Question", name: "How many pages are translated?", acceptedAnswer: { "@type": "Answer", text: "First 3 pages are translated for best speed and accuracy." } },
//           ],
//         }, null, 2) }}
//       />

//       {/* ── Tool UI ── */}
//       <ToolPageLayout
//         title={seo?.h1 || "AI PDF Translator — Free & Online"}
//         tagline="No Signup · 20 Languages · AI-Powered"
//         accept=".pdf"
//         multiple={false}
//         convertLabel="Translate PDF"
//         flow={flow}
//         progress={progress}
//         onRemoveFile={handleRemoveFile}
//         onConvert={handleConvert}
//         onDownload={handleDownload}
//         doneLinks={DONE_LINKS}
//         sidebarLinks={DONE_LINKS}

//         optionsTitle="Translation options"
//         showOutputFormat={false}
//         showPreserveLayout={false}
//         optionsSlot={
//           <TranslateOptionsSlot
//             sourceLang={sourceLang} setSourceLang={setSourceLang}
//             targetLang={targetLang} setTargetLang={setTargetLang}
//           />
//         }
//         optionSectionLabel=""

//         processingTitle="Translating PDF"
//         processingDescription={`Translating to ${targetLang} — please wait 15–30 seconds.`}
//         processingStages={["Uploading PDF", "Extracting text", `Translating to ${targetLang}`]}

//         doneTitle="Translation Ready!"
//         doneDescription={
//           translation ? (
//             <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
//               {translation}
//             </div>
//           ) : "Your PDF has been translated successfully."
//         }
//         doneFileName={`pdflinx-translation-${targetLang.toLowerCase()}.txt`}
//         downloadLabel={`Download ${targetLang} Translation`}
//         resetLabel="Translate another PDF"

//         sidebarTitle="AI PDF Translator"
//         sidebarIcon={<Languages className="h-5 w-5 text-blue-500" />}
//         sidebarDescription="PDF ko apni pasandida language mein translate karo — 20 languages, free."
//         sidebarNotice={SIDEBAR_NOTICE}
//         sidebarFeatures={SIDEBAR_FEATURES}

//         uploadTitle="Drop your PDF here"
//         uploadSubtitle="or click to browse — PDF only"
//         uploadInfo={
//           <>
//             <p>⏱️ Translation takes 15–30 seconds — don&apos;t close this tab</p>
//             <p className="mt-1">🌐 First 3 pages · 20 languages · Auto-detect supported</p>
//           </>
//         }

//         uploadLanding={{
//           content: {
//             relatedTools: DONE_LINKS,
//             eyebrow: "AI PDF TRANSLATOR",
//             breadcrumbCurrent: "AI PDF Translator",
//             heroBadge: "✦ 100% Free · No Signup · 20 Languages",
//             heroTitle: (
//               <>
//                 AI PDF Translator —{" "}
//                 <em className="font-bold text-[#e8420a] sm:italic">
//                   Translate Any PDF Free
//                 </em>
//               </>
//             ),
//             heroDescription:
//               "Translate any PDF into Urdu, Hindi, Arabic, French, Spanish, Chinese, and 15+ more languages. Auto language detection included. No signup, no watermark, 100% free.",
//             pills: ["20 languages", "Auto-detect", "No signup", "Free forever"],
//             trustPills: ["100% Free", "No Sign Up", "AI Powered"],
//             uploadTitle: "Drop your PDF here",
//             uploadSubtitle: "or click to browse — PDF only",
//             noticeTitle: "AI PDF Translator",
//             noticeItems: [
//               "20 languages supported",
//               "Auto language detection",
//               "First 3 pages translated",
//             ],
//             rating: "4.8/5",
//             ratingText: "Trusted by thousands of users",
//             howToEyebrow: "How It Works",
//             howToTitle: "How to Translate a PDF — 3 Simple Steps",
//             howToSubtitle: "Upload, select language, translate — done in under 30 seconds.",
//             howToSteps: [
//               { n: "1", title: "Upload Your PDF",      desc: "Select any text-based PDF from your device.", color: "bg-blue-600" },
//               { n: "2", title: "Select Language",      desc: "Choose from 20 languages. Use Auto Detect if unsure about the source language.", color: "bg-purple-600" },
//               { n: "3", title: "Download Translation", desc: "Get the translated text in seconds. Download as a .txt file.", color: "bg-emerald-600" },
//             ],
//             whyTitle: "Why Use PDFLinx AI PDF Translator?",
//             seoBadge: "PDF Translator Guide",
//             seoTitle: "Complete Guide to AI PDF Translation",
//             seoDescription: "Translate PDFs to any language online for free — 20 languages, auto-detect, no signup.",
//             seoSections: [
//               {
//                 title: "Free AI PDF Translator — 20 Languages, No Signup",
//                 text: "PDFLinx AI PDF Translator supports 20 languages including Urdu, Hindi, Arabic, French, Spanish, German, Chinese, Japanese, Korean, Turkish, and more. Completely free with auto language detection.",
//               },
//               {
//                 title: "Which Languages Are Supported?",
//                 text: "Urdu · Hindi · Arabic · French · Spanish · German · Chinese · Japanese · Korean · Turkish · Portuguese · Russian · Italian · Bengali · Malay · Persian · Dutch · Polish · Swedish · English",
//               },
//               {
//                 title: "Best Use Cases",
//                 text: "✓ Students: Translate research papers and textbooks\n✓ Professionals: Understand foreign contracts and reports\n✓ Researchers: Read international academic papers\n✓ Businesses: Translate client documents quickly",
//               },
//             ],
//             faqs: [
//               { q: "Is the translator free?",          a: "Yes, 100% free with no hidden charges or daily limits." },
//               { q: "How many languages supported?",    a: "20 languages including Urdu, Hindi, Arabic, French, Spanish, German, Chinese, Japanese, Korean, Turkish, and more." },
//               { q: "What is Auto Detect?",             a: "Auto Detect automatically identifies the source language of your PDF — you don't need to manually select it." },
//               { q: "How many pages are translated?",   a: "First 3 pages are translated for best speed and accuracy." },
//               { q: "Does it work on scanned PDFs?",    a: "Text-based PDFs work best. Use our OCR PDF tool first for scanned/image PDFs." },
//               { q: "Is my PDF private?",               a: "Yes. Files are processed securely and deleted after processing." },
//             ],
//             ctaTitle: (<>Translate your PDF now —<br />free, private, no sign‑up.</>),
//             ctaDescription: "Join thousands who use PDFLinx to break language barriers.",
//             ctaButton: "Choose PDF File",
//           },
//         }}
//       />
//     </>
//   );
// }