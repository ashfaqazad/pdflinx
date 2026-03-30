"use client";

import Link from "next/link";

export default function BlogClient() {
  const blogs = [
    {
      title: "Convert PDF to Word Online Without Losing Formatting",
      description:
        "Locked PDFs driving you crazy? Here's how I turn any PDF into an editable Word file without ruining the layout, fonts, or images. I use this free tool every week — no software needed, no signup, just works.",
      date: "Aug 24, 2025",
      slug: "pdf-to-word",
    },

    {
      title: "PDF to Word Formatting Messed Up? Here's How to Fix It",
      description:
        "Fonts changing, tables breaking, images shifting — PDF to Word conversion messes up formatting more often than not. Here's how to fix it fast and get a clean, editable Word file every time. Free tool, no signup, no software needed.",
      date: "Feb 22, 2026",
      slug: "pdf-to-word-formatting-messed-up",
    },
    {
      title: "How to Edit Scanned PDF in Word (The Easy Way with OCR)",
      description:
        "Scanned PDFs are just images — no way to copy text, highlight, or edit anything. I've wasted so much time re-typing everything from receipts, notes, and old documents. Here's how I quickly turn any scanned PDF into a fully editable Word file using OCR first, with a free tool that actually works well. No software install, no signup — just fast and accurate results every time.",
      date: "Feb 23, 2026",
      slug: "how-to-edit-scanned-pdf-in-word",
    },

    {
      title: "Convert PDF Resume to Editable Word Without Losing Layout",
      description:
        "Job portals demand Word resumes, but converting PDF versions often ruins columns, bullets, photos, and spacing — super annoying when you're applying urgently. I've messed up so many applications this way. Here's how I convert PDF resumes to clean, editable Word files that stay professional and ATS-friendly, using a free tool that preserves everything. No signup, no software — just perfect results every time.",
      date: "Feb 24, 2026",
      slug: "convert-pdf-resume-to-editable-word",
    },

    {
      title: "Convert Word to PDF Instantly (No Software Needed)",
      description:
        "Need to turn your Word doc into a clean, professional PDF that looks perfect everywhere? Here’s how I do it in seconds — no software, no watermarks, just a sharp PDF ready to send.",
      date: "Aug 26, 2025",
      slug: "word-to-pdf",
    },

    {
      title: "Convert Images (JPG, PNG) to PDF in Seconds",
      description:
        "Combine multiple images into one clear, professional PDF document. Perfect for photos, scanned documents, receipts, or portfolios. Supports JPG, PNG, and more no signup, no watermark, just fast and secure image to PDF conversion.",
      date: "Aug 28, 2025",
      slug: "image-to-pdf",
    },

    {
      title: "Merge Multiple PDF Files into One Online",
      description:
        "Got a bunch of separate PDFs you need to combine? Here’s how I quickly merge them into one clean file — perfect for reports, invoices, or study notes. Free, no limits, and keeps everything looking sharp.",
      date: "Aug 30, 2025",
      slug: "merge-pdf",
    },

    {
      title: "Split PDF Files Online (Extract Specific Pages Easily)",
      description:
        "Got a big PDF and only need a few pages? Here’s how I quickly pull out exactly what I want — perfect for reports, contracts, or study notes. Free, no signup, and keeps the quality perfect.",
      date: "Sep 1, 2025",
      slug: "split-pdf",
    },

    {
      title: "Compress PDF Files Without Losing Quality",
      description:
        "Got a massive PDF that won’t attach to emails or takes forever to upload? Here’s how I shrink them down super small while keeping everything looking sharp — free, fast, and no quality drop.",
      date: "Sep 3, 2025",
      slug: "compress-pdf",
    },


    {
      title: "Convert Excel to PDF Without Losing Formatting",
      description:
        "Need to turn your Excel spreadsheet into a clean PDF that keeps all the tables, charts, and formatting perfect? Here’s how I do it in seconds — great for reports, budgets, or sharing data securely.",
      date: "Sep 5, 2025",
      slug: "excel-pdf",
    },

    {
      title: "Convert PDF Pages to JPG Images Online",
      description:
        "Need images from a PDF fast? Here’s how I convert every PDF page into high-quality JPG files in seconds — perfect for sharing pages as images, presentations, or social posts.",
      date: "Sep 7, 2025",
      slug: "pdf-to-jpg",
    },

    {
      title: "Convert PowerPoint to PDF Without Breaking the Layout",
      description:
        "Want to share slides without worrying about fonts, spacing, or compatibility issues? Here’s how I convert PowerPoint presentations to PDF while keeping everything clean and professional.",
      date: "Sep 9, 2025",
      slug: "ppt-to-pdf",
    },

    {
      title: "Protect PDF with a Password Online for Free",
      description:
        "Need to lock a PDF before sending it? Here’s how I add password protection to sensitive files in seconds — perfect for contracts, reports, and personal documents.",
      date: "Sep 11, 2025",
      slug: "protect-pdf",
    },

    {
      title: "Unlock PDF Files Online Without Hassle",
      description:
        "Got a password-protected PDF you’re allowed to open but need easier access to? Here’s how I unlock PDF files quickly and securely so I can work with them again.",
      date: "Sep 13, 2025",
      slug: "unlock-pdf",
    },

    {
      title: "Rotate PDF Pages Online to Fix Wrong Orientation",
      description:
        "Ever opened a PDF and found half the pages sideways or upside down? Here’s how I rotate PDF pages online in seconds so everything reads properly again.",
      date: "Sep 15, 2025",
      slug: "rotate-pdf",
    },

    {
      title: "Sign PDF Online with a Digital Signature",
      description:
        "Need to sign a contract, form, or agreement fast? Here’s how I add a digital signature to PDFs online without printing, scanning, or installing anything.",
      date: "Sep 17, 2025",
      slug: "sign-pdf",
    },

    {
      title: "Use OCR to Extract Text from Scanned PDFs",
      description:
        "Scanned PDFs are frustrating when you can’t copy or edit anything. Here’s how I use OCR to turn scanned PDF pages into selectable, editable text in minutes.",
      date: "Sep 19, 2025",
      slug: "ocr-pdf",
    },

    {
      title: "Edit PDF Files Online Without Installing Software",
      description:
        "Need to fix text, add content, or update a PDF quickly? Here’s how I edit PDF files online without downloading heavy desktop software or dealing with complicated tools.",
      date: "Sep 21, 2025",
      slug: "edit-pdf",
    },

    {
      title: "Add Watermark to PDF Files Online",
      description:
        "Want to protect your PDF with branding or ownership text? Here’s how I add text or image watermarks to PDF files online while keeping the document clean and readable.",
      date: "Sep 23, 2025",
      slug: "add-watermark",
    },

    {
      title: "Best Tools for Students to Study Smarter in 2025",
      description:
        "Assignments piling up, group projects, exams, and PDFs that won't cooperate — student life is hectic. Here are the tools that actually help you work faster and smarter, tested and used in real academic workflows.",
      date: "Dec 11, 2025",
      slug: "best-tools-for-students",
    },

    {
      title: "How to Compress a PDF Free Online (Reduce File Size Instantly)",
      description:
        "PDF too large to email or upload? Here's how to compress any PDF in seconds — no software, no signup, no watermark. Works on mobile too, and keeps your text and images looking sharp.",
      date: "Mar 22, 2026",
      slug: "how-to-compress-a-pdf",
    },
    {
      title: "How to Compress a PDF Without Losing Quality",
      description:
        "Worried compression will ruin your PDF? Here's exactly what happens to images, text, and fonts during compression — and how to reduce file size without any visible quality loss.",
      date: "Mar 23, 2026",
      slug: "compress-pdf-without-losing-quality",
    },
    {
      title: "How to Compress a PDF on Mobile (Android & iPhone)",
      description:
        "Need to shrink a PDF from your phone before sending? Here's how to compress any PDF directly in your mobile browser — no app needed, works on both Android and iPhone.",
      date: "Mar 24, 2026",
      slug: "compress-pdf-on-mobile",
    },
    {
      title: "PDF Still Too Large After Compression? Here's How to Fix It",
      description:
        "Compressed your PDF but it's still too big? Here are the real reasons compression sometimes doesn't work — and exactly what to do in each case.",
      date: "Mar 25, 2026",
      slug: "pdf-still-too-large-after-compression",
    },
    {
      title: "Why Are PDF Files So Large? (And How to Fix It)",
      description:
        "Ever wondered why a simple PDF ends up being 50MB? Here's what actually makes PDFs large — images, scans, fonts, layers — and the fastest way to fix each one.",
      date: "Mar 26, 2026",
      slug: "why-are-pdf-files-so-large",
    },
    {
      title: "How Small Should I Compress My PDF? (Size Guide by Use Case)",
      description:
        "Email, WhatsApp, university portals, websites, printing — every use case needs a different PDF size. Here's the exact target size for each one so you compress just enough.",
      date: "Mar 27, 2026",
      slug: "how-small-should-i-compress-my-pdf",
    },

    {
      title: "How to Convert Word to PDF Free Online (No Software Needed)",
      description:
        "Need to convert a Word document to PDF quickly without installing software? Here's the fastest way to turn DOC or DOCX into a clean, professional PDF online — no signup, no watermark, and perfect formatting every time.",
      date: "Mar 15, 2026",
      slug: "how-to-convert-word-to-pdf",
    },
    {
      title: "How to Convert Word to PDF Without Losing Formatting",
      description:
        "Fonts changing, tables breaking, and layout shifting after conversion? Here's how to convert Word to PDF without losing formatting — including exact fixes for fonts, margins, images, and tables.",
      date: "Mar 16, 2026",
      slug: "convert-word-to-pdf-without-losing-formatting",
    },
    {
      title: "How to Convert Word to PDF on Mobile (Android & iPhone)",
      description:
        "Convert Word documents to PDF directly on your phone — no app needed. Here's how to do it on Android and iPhone in under a minute using your mobile browser.",
      date: "Mar 17, 2026",
      slug: "word-to-pdf-on-mobile",
    },
    {
      title: "Word to PDF Not Working? Here's How to Fix It",
      description:
        "Getting blank PDFs, upload errors, or broken formatting? Here's how to fix common Word to PDF conversion problems step by step — including real solutions that actually work.",
      date: "Mar 18, 2026",
      slug: "word-to-pdf-not-working-fix",
    },
    {
      title: "Why Does Formatting Break When Converting Word to PDF?",
      description:
        "Ever wondered why your Word document looks perfect but the PDF gets messed up? Here's the real reason formatting breaks during conversion — and how to prevent it.",
      date: "Mar 19, 2026",
      slug: "why-formatting-breaks-in-word-to-pdf",
    },
    {
      title: "Free vs Paid Word to PDF Tools — What's Actually Different?",
      description:
        "Do you really need to pay for Word to PDF conversion? Here's the real difference between free and paid tools — and when upgrading actually makes sense.",
      date: "Mar 20, 2026",
      slug: "free-vs-paid-word-to-pdf-tools",
    },
    {
      title: "Word to PDF for Students — How to Submit Assignments as PDF",
      description:
        "Submitting assignments as DOCX can break formatting or get rejected. Here's how students can convert Word to PDF properly before submission — fast, free, and reliable.",
      date: "Mar 21, 2026",
      slug: "word-to-pdf-for-students",
    }

  ];

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent leading-tight">
        PDF Tools Blog & Guides
      </h1>

      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base leading-relaxed">
        Hey, welcome to the blog! Here I've written simple, no-nonsense guides
        for all the PDF tools — how to merge PDFs, convert Word to PDF, unlock
        files, rotate pages, and everything else.
        <br />
        <br />
        Everything is <strong>free</strong>, no fluff, and I've tested it all
        myself in real life. Hope these help you save time and get stuff done
        easier.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
          >
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-red-700 transition">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">
                {blog.description}
              </p>
              <p className="text-xs text-gray-500 mb-4">{blog.date}</p>

              <div className="mt-auto">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

