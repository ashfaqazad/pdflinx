import Link from "next/link";
import styles from "./HomeContent.module.css";

/**
 * Drop-in sections for HomeContent.jsx
 *
 * <PdfIntroSection />  -> place right after the Hero, before the Stats bar
 * <PdfFaqSection />    -> place after "Built Different. On Purpose.", before the CTA banner
 *
 * Every <Link> below points at a page currently stuck in GSC's
 * "Discovered - currently not indexed" report. Anchor text is
 * intentionally descriptive (not just the tool name) for topical signal.
 */

const linkClass =
  "text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500";

export function PdfIntroSection() {
  return (
    <section className={styles.seoSection}>
      <div className="mx-auto max-w-3xl text-center">
        <p style={{ color: "#e8420a", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Every PDF task, one toolkit
        </p>
        <h2 className={styles.secTitle}>
          Whatever you need to do to a PDF, it&apos;s here
        </h2>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 text-left text-[17px] leading-relaxed text-neutral-700">
        <p>
          Most people start with the essentials:{" "}
          <Link href="/word-to-pdf" className={linkClass}>
            convert Word to PDF
          </Link>{" "}
          or go the other way with{" "}
          <Link href="/pdf-to-word" className={linkClass}>
            PDF to Word
          </Link>
          , turn scanned pictures into a document with{" "}
          <Link href="/image-to-pdf" className={linkClass}>
            Image to PDF
          </Link>
          , or pull pages back out as images with{" "}
          <Link href="/pdf-to-jpg" className={linkClass}>
            PDF to JPG
          </Link>
          . Sending a spreadsheet?{" "}
          <Link href="/excel-pdf" className={linkClass}>
            Excel to PDF
          </Link>{" "}
          keeps your tables and charts intact. Need to trim a file down?{" "}
          <Link href="/split-pdf" className={linkClass}>
            Split PDF
          </Link>{" "}
          breaks a large document into smaller ones,{" "}
          <Link href="/remove-pages" className={linkClass}>
            Remove Pages
          </Link>{" "}
          deletes exactly what you don&apos;t need, and{" "}
          <Link href="/add-watermark" className={linkClass}>
            Add Watermark
          </Link>{" "}
          stamps your branding across every page before you share it.
        </p>

        <p>
          PDFLinx brings together every PDF tool you actually need, processed
          entirely in your browser. Bringing files together from different
          places?{" "}
          <Link href="/merge-pdf" className={linkClass}>
            Merge multiple PDFs
          </Link>{" "}
          into one document, then{" "}
          <Link href="/crop-pdf" className={linkClass}>
            crop PDF pages
          </Link>{" "}
          to remove stray margins, or{" "}
          <Link href="/organize-pdf" className={linkClass}>
            organize PDF pages
          </Link>{" "}
          by dragging them into the order you need — no software, no signup.
        </p>

        <p>
          Working across formats is just as easy. Turn a deck into a document
          with{" "}
          <Link href="/ppt-to-pdf" className={linkClass}>
            PowerPoint to PDF
          </Link>
          , archive a web page with{" "}
          <Link href="/html-to-pdf" className={linkClass}>
            HTML to PDF
          </Link>
          , or go the other way with{" "}
          <Link href="/pdf-to-powerpoint" className={linkClass}>
            PDF to PowerPoint
          </Link>{" "}
          when slides need editing again. Students converting an assignment
          can use{" "}
          <Link href="/pdf-to-word-for-students" className={linkClass}>
            PDF to Word for students
          </Link>{" "}
          for a clean, editable file, while freelancers can{" "}
          <Link href="/protect-pdf" className={linkClass}>
            password-protect a PDF
          </Link>{" "}
          before emailing it to a client.
        </p>

        <p>
          Need to go further than conversion?{" "}
          <Link href="/edit-pdf" className={linkClass}>
            Edit PDF text and annotations
          </Link>{" "}
          directly in the browser,{" "}
          <Link href="/add-page-numbers" className={linkClass}>
            add page numbers
          </Link>{" "}
          before printing a report, or{" "}
          <Link href="/sign-pdf" className={linkClass}>
            sign a PDF
          </Link>{" "}
          without installing anything. Not sure how much a compression pass
          will actually save? Check the{" "}
          <Link href="/compress-pdf-savings-calculator" className={linkClass}>
            compression savings calculator
          </Link>{" "}
          before you commit.
        </p>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "How do I convert a PDF to editable Excel data?",
    answerText:
      "Use PDF to Excel. PDFLinx extracts tables from your PDF into a proper spreadsheet, keeping rows and columns intact for invoices, reports, and statements.",
    a: (
      <>
        Use{" "}
        <Link href="/pdf-to-excel" className={linkClass}>
          PDF to Excel
        </Link>
        . PDFLinx extracts tables from your PDF into a proper spreadsheet,
        keeping rows and columns intact for invoices, reports, and statements.
      </>
    ),
  },
  {
    q: "Can I pull an image out of a PDF file?",
    answerText:
      "Yes, PDF to PNG converts each page into a high-quality image, useful for previews, thumbnails, or lifting a single graphic out of a document.",
    a: (
      <>
        Yes —{" "}
        <Link href="/pdf-to-png" className={linkClass}>
          PDF to PNG
        </Link>{" "}
        converts each page into a high-quality image, useful for previews,
        thumbnails, or lifting a single graphic out of a document.
      </>
    ),
  },
  {
    q: "I have a scanned document that isn't searchable. What do I do?",
    answerText:
      "Run it through OCR PDF. It uses Optical Character Recognition to turn scanned pages into selectable, searchable text.",
    a: (
      <>
        Run it through{" "}
        <Link href="/ocr-pdf" className={linkClass}>
          OCR PDF
        </Link>
        . It uses Optical Character Recognition to turn scanned pages into
        selectable, searchable text.
      </>
    ),
  },
  {
    q: "How do I get just the text out of a PDF?",
    answerText:
      "PDF to Text extracts plain text instantly — handy for copying content into notes or research without formatting clutter.",
    a: (
      <>
        <Link href="/pdf-to-text" className={linkClass}>
          PDF to Text
        </Link>{" "}
        extracts plain text instantly — handy for copying content into notes
        or research without formatting clutter.
      </>
    ),
  },
  {
    q: "My PDF pages are sideways or upside down — can I fix that?",
    answerText:
      "Rotate PDF fixes sideways or upside-down pages, individually or all at once.",
    a: (
      <>
        <Link href="/rotate-pdf" className={linkClass}>
          Rotate PDF
        </Link>{" "}
        fixes sideways or upside-down pages, individually or all at once.
      </>
    ),
  },
  {
    q: "I forgot the password on my own PDF. How do I get back in?",
    answerText:
      "Unlock PDF removes password restrictions so you get full access back to your own file.",
    a: (
      <>
        <Link href="/unlock-pdf" className={linkClass}>
          Unlock PDF
        </Link>{" "}
        removes password restrictions so you get full access back to your own
        file.
      </>
    ),
  },
  {
    q: "I need to permanently remove sensitive info, not just hide it. Is that possible?",
    answerText:
      "Redact PDF permanently removes sensitive text and images so the content can't be recovered, unlike simply covering it with a black box.",
    a: (
      <>
        <Link href="/redact-pdf" className={linkClass}>
          Redact PDF
        </Link>{" "}
        permanently removes sensitive text and images so the content can't be
        recovered, unlike simply covering it with a black box.
      </>
    ),
  },
  {
    q: "My PDF won't open and looks corrupted. Can it be fixed?",
    answerText:
      "Repair PDF automatically recovers content from broken or corrupted files.",
    a: (
      <>
        <Link href="/repair-pdf" className={linkClass}>
          Repair PDF
        </Link>{" "}
        automatically recovers content from broken or corrupted files.
      </>
    ),
  },
  {
    q: "Can I turn plain text into a formatted PDF?",
    answerText:
      "Yes, Text to PDF turns plain text into a clean, formatted PDF in seconds.",
    a: (
      <>
        Yes,{" "}
        <Link href="/text-to-pdf" className={linkClass}>
          Text to PDF
        </Link>{" "}
        turns plain text into a clean, formatted PDF in seconds.
      </>
    ),
  },
  {
    q: "I only need a few pages from a large PDF. How do I pull just those out?",
    answerText:
      "Extract PDF pulls specific pages or content into a separate file, so you're not stuck sharing the whole document.",
    a: (
      <>
        <Link href="/extract-pdf" className={linkClass}>
          Extract PDF
        </Link>{" "}
        pulls specific pages or content into a separate file, so you're not
        stuck sharing the whole document.
      </>
    ),
  },
  {
    q: "Are all these tools actually free, or is there a catch?",
    answerText:
      "Every tool on our free PDF tools page is completely free, with no signup, watermark, or hidden limits.",
    a: (
      <>
        Every tool on our{" "}
        <Link href="/free-pdf-tools" className={linkClass}>
          free PDF tools
        </Link>{" "}
        page is completely free, with no signup, watermark, or hidden limits.
      </>
    ),
  },
  {
    q: "How does PDFLinx compare to other PDF tools?",
    answerText:
      "See our side-by-side breakdowns: PDFLinx vs iLovePDF and PDFLinx vs Smallpdf.",
    a: (
      <>
        See our side-by-side breakdowns:{" "}
        <Link href="/compare/pdflinx-vs-ilovepdf" className={linkClass}>
          PDFLinx vs iLovePDF
        </Link>{" "}
        and{" "}
        <Link href="/compare/pdflinx-vs-smallpdf" className={linkClass}>
          PDFLinx vs Smallpdf
        </Link>
        .
      </>
    ),
  },
  {
    q: "Can I ask questions about a PDF instead of reading the whole thing?",
    answerText:
      "Yes, Chat with PDF lets you ask questions and get instant AI-powered answers based on the document's content.",
    a: (
      <>
        Yes —{" "}
        <Link href="/chat-with-pdf" className={linkClass}>
          Chat with PDF
        </Link>{" "}
        lets you ask questions and get instant AI-powered answers based on
        the document's content.
      </>
    ),
  },
];

export function PdfFaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText, // ← fixed: plain-text answer, not the question
      },
    })),
  };

  return (
    <section className={styles.seoSection}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <p style={{ color: "#e8420a", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Common questions
        </p>
        <h2 className={styles.secTitle}>Frequently Asked Questions</h2>
      </div>

      <div className="mx-auto max-w-2xl divide-y divide-neutral-200">
        {faqs.map((item, i) => (
          <div key={i} className="py-4">
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              {item.q}
            </h3>
            <p className="text-[16px] leading-relaxed text-neutral-700">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}






























// import Link from "next/link";
// import styles from "./HomeContent.module.css";

// /**
//  * Drop-in sections for HomeContent.jsx
//  *
//  * <PdfIntroSection />  -> place right after the Hero, before the Stats bar
//  * <PdfFaqSection />    -> place after "Built Different. On Purpose.", before the CTA banner
//  *
//  * Every <Link> below points at a page currently stuck in GSC's
//  * "Discovered - currently not indexed" report. Anchor text is
//  * intentionally descriptive (not just the tool name) for topical signal.
//  */

// export function PdfIntroSection() {
//   return (
//     <section className="bg-white px-4 py-20">
//       <div className="mx-auto max-w-3xl text-center">
//         {/* <p className="mb-3 text-sm font-medium text-orange-600">
//           Every PDF task, one toolkit
//         </p> */}
//         <p className={styles.eyebrow}>Every PDF task, one toolkit</p>

//         {/* <h2 className="mb-8 font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
//           Whatever you need to do to a PDF, it&apos;s here
//         </h2> */}

//         <h2 className={styles.secTitle}>Whatever you need to do to a PDF, it's here</h2>

//       </div>

//       <div className="mx-auto max-w-2xl space-y-6 text-left text-[17px] leading-relaxed text-neutral-700">
//         <p>
//           PDFLinx brings together every PDF tool you actually need, processed
//           entirely in your browser. Bringing files together from different
//           places?{" "}
//           <Link href="/merge-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             Merge multiple PDFs
//           </Link>{" "}
//           into one document, then{" "}
//           <Link href="/crop-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             crop PDF pages
//           </Link>{" "}
//           to remove stray margins, or{" "}
//           <Link href="/organize-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             organize PDF pages
//           </Link>{" "}
//           by dragging them into the order you need — no software, no signup.
//         </p>

//         <p>
//           Working across formats is just as easy. Turn a deck into a document
//           with{" "}
//           <Link href="/ppt-to-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             PowerPoint to PDF
//           </Link>
//           , archive a web page with{" "}
//           <Link href="/html-to-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             HTML to PDF
//           </Link>
//           , or go the other way with{" "}
//           <Link href="/pdf-to-powerpoint" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             PDF to PowerPoint
//           </Link>{" "}
//           when slides need editing again. Students converting an assignment
//           can use{" "}
//           <Link href="/pdf-to-word-for-students" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             PDF to Word for students
//           </Link>{" "}
//           for a clean, editable file, while freelancers can{" "}
//           <Link href="/protect-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             password-protect a PDF
//           </Link>{" "}
//           before emailing it to a client.
//         </p>

//         <p>
//           Need to go further than conversion?{" "}
//           <Link href="/edit-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             Edit PDF text and annotations
//           </Link>{" "}
//           directly in the browser,{" "}
//           <Link href="/add-page-numbers" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             add page numbers
//           </Link>{" "}
//           before printing a report, or{" "}
//           <Link href="/sign-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             sign a PDF
//           </Link>{" "}
//           without installing anything. Not sure how much a compression pass
//           will actually save? Check the{" "}
//           <Link href="/compress-pdf-savings-calculator" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//             compression savings calculator
//           </Link>{" "}
//           before you commit.
//         </p>
//       </div>
//     </section>
//   );
// }

// const faqs = [
//   {
//     q: "How do I convert a PDF to editable Excel data?",
//     a: (
//       <>
//         Use{" "}
//         <Link href="/pdf-to-excel" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           PDF to Excel
//         </Link>
//         . PDFLinx extracts tables from your PDF into a proper spreadsheet,
//         keeping rows and columns intact for invoices, reports, and statements.
//       </>
//     ),
//   },
//   {
//     q: "Can I pull an image out of a PDF file?",
//     a: (
//       <>
//         Yes —{" "}
//         <Link href="/pdf-to-png" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           PDF to PNG
//         </Link>{" "}
//         converts each page into a high-quality image, useful for previews,
//         thumbnails, or lifting a single graphic out of a document.
//       </>
//     ),
//   },
//   {
//     q: "I have a scanned document that isn't searchable. What do I do?",
//     a: (
//       <>
//         Run it through{" "}
//         <Link href="/ocr-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           OCR PDF
//         </Link>
//         . It uses Optical Character Recognition to turn scanned pages into
//         selectable, searchable text.
//       </>
//     ),
//   },
//   {
//     q: "How do I get just the text out of a PDF?",
//     a: (
//       <>
//         <Link href="/pdf-to-text" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           PDF to Text
//         </Link>{" "}
//         extracts plain text instantly — handy for copying content into notes
//         or research without formatting clutter.
//       </>
//     ),
//   },
//   {
//     q: "My PDF pages are sideways or upside down — can I fix that?",
//     a: (
//       <>
//         <Link href="/rotate-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Rotate PDF
//         </Link>{" "}
//         fixes sideways or upside-down pages, individually or all at once.
//       </>
//     ),
//   },
//   {
//     q: "I forgot the password on my own PDF. How do I get back in?",
//     a: (
//       <>
//         <Link href="/unlock-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Unlock PDF
//         </Link>{" "}
//         removes password restrictions so you get full access back to your own
//         file.
//       </>
//     ),
//   },
//   {
//     q: "I need to permanently remove sensitive info, not just hide it. Is that possible?",
//     a: (
//       <>
//         <Link href="/redact-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Redact PDF
//         </Link>{" "}
//         permanently removes sensitive text and images so the content can't be
//         recovered, unlike simply covering it with a black box.
//       </>
//     ),
//   },
//   {
//     q: "My PDF won't open and looks corrupted. Can it be fixed?",
//     a: (
//       <>
//         <Link href="/repair-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Repair PDF
//         </Link>{" "}
//         automatically recovers content from broken or corrupted files.
//       </>
//     ),
//   },
//   {
//     q: "Can I turn plain text into a formatted PDF?",
//     a: (
//       <>
//         Yes,{" "}
//         <Link href="/text-to-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Text to PDF
//         </Link>{" "}
//         turns plain text into a clean, formatted PDF in seconds.
//       </>
//     ),
//   },
//   {
//     q: "I only need a few pages from a large PDF. How do I pull just those out?",
//     a: (
//       <>
//         <Link href="/extract-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Extract PDF
//         </Link>{" "}
//         pulls specific pages or content into a separate file, so you're not
//         stuck sharing the whole document.
//       </>
//     ),
//   },
//   {
//     q: "Are all these tools actually free, or is there a catch?",
//     a: (
//       <>
//         Every tool on our{" "}
//         <Link href="/free-pdf-tools" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           free PDF tools
//         </Link>{" "}
//         page is completely free, with no signup, watermark, or hidden limits.
//       </>
//     ),
//   },
//   {
//     q: "How does PDFLinx compare to other PDF tools?",
//     a: (
//       <>
//         See our side-by-side breakdowns:{" "}
//         <Link href="/compare/pdflinx-vs-ilovepdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           PDFLinx vs iLovePDF
//         </Link>{" "}
//         and{" "}
//         <Link href="/compare/pdflinx-vs-smallpdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           PDFLinx vs Smallpdf
//         </Link>
//         .
//       </>
//     ),
//   },
//   {
//     q: "Can I ask questions about a PDF instead of reading the whole thing?",
//     a: (
//       <>
//         Yes —{" "}
//         <Link href="/chat-with-pdf" className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-500">
//           Chat with PDF
//         </Link>{" "}
//         lets you ask questions and get instant AI-powered answers based on
//         the document's content.
//       </>
//     ),
//   },
// ];

// export function PdfFaqSection() {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((item) => ({
//       "@type": "Question",
//       name: item.q,
//       acceptedAnswer: {
//         "@type": "Answer",
//         // plain-text fallback for schema; JSX answer above handles the visible links
//         text: item.q,
//       },
//     })),
//   };

//   return (
//     <section className="bg-neutral-50 px-4 py-2">
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       <div className="mx-auto max-w-3xl text-center">
//         {/* <p className="mb-3 text-sm font-medium text-orange-600">
//           Common questions
//         </p> */}
//         <p className={styles.eyebrow}>Common questions</p>

//         {/* <h2 className="mb-12 font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
//           Frequently Asked Questions
//         </h2> */}
//         <h2 className={styles.secTitle}>Frequently Asked Questions</h2>
//       </div>

//       <div className="mx-auto max-w-2xl divide-y divide-neutral-200">
//         {faqs.map((item, i) => (
//           <div key={i} className="py-6">
//             <h3 className="mb-2 text-lg font-semibold text-neutral-900">
//               {item.q}
//             </h3>
//             <p className="text-[16px] leading-relaxed text-neutral-700">
//               {item.a}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }