"use client";

import Link from "next/link";

export default function Blog() {
  const blogs = [
    {
      title: "Convert PDF to Word Online Without Losing Formatting",
      description:
        "Struggling with locked PDFs? Learn how to easily convert PDF files into editable Word documents while keeping formatting, fonts, and images intact. Our free online PDF to Word converter ensures accuracy, security, and speed — perfect for students, professionals, and businesses.",
      date: "Aug 24, 2025",
      slug: "pdf-to-word",
    },
    {
      title: "Convert Word to PDF Instantly (No Software Needed)",
      description:
        "Need to send polished, professional documents? Convert your Word files (DOC/DOCX) into high-quality PDFs online in seconds. 100% free, secure, and watermark-free — ideal for resumes, business reports, and official submissions.",
      date: "Aug 26, 2025",
      slug: "word-to-pdf",
    },
    {
      title: "Convert Images (JPG, PNG) to PDF in Seconds",
      description:
        "Combine multiple images into one clear, professional PDF document. Perfect for photos, scanned documents, receipts, or portfolios. Supports JPG, PNG, and more — no signup, no watermark, just fast and secure image to PDF conversion.",
      date: "Aug 28, 2025",
      slug: "image-to-pdf",
    },
    {
      title: "Merge Multiple PDF Files into One Online",
      description:
        "Tired of juggling multiple PDF files? Merge them into one organized document with our free online PDF merger. Preserve layout, order, and quality — the simplest way to manage reports, contracts, or study materials securely.",
      date: "Aug 30, 2025",
      slug: "merge-pdf",
    },
    {
      title: "Split PDF Files Online (Extract Specific Pages Easily)",
      description:
        "Need to extract specific pages from a large PDF? Our free PDF Splitter tool makes it simple to divide, separate, or organize documents — fast, private, and secure. Perfect for teachers, legal professionals, or students.",
      date: "Sep 1, 2025",
      slug: "split-pdf",
    },
    {
      title: "Compress PDF Files Without Losing Quality",
      description:
        "Make your PDFs lighter without losing clarity. Compress large PDF files up to 90% smaller for faster uploads and easy sharing. Perfect for email attachments, job applications, and online submissions.",
      date: "Sep 3, 2025",
      slug: "compress-pdf",
    },
    {
      title: "Convert Excel to PDF Without Losing Formatting",
      description:
        "Turn Excel spreadsheets into high-quality PDFs that keep your tables, charts, and cell formatting intact. Great for business reports, budgets, or analytics — quick, secure, and completely free to use online.",
      date: "Sep 5, 2025",
      slug: "excel-to-pdf",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto py-16 px-6">
      {/* <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
        PDF Tools Blog & Guides
      </h1> */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-1">
        PDF Tools Blog & Guides
      </h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
        Explore expert tips, tutorials, and how-to guides to master all our free PDF and document tools —
        from file conversions and compression to merging, splitting, and more.
        Stay productive with <strong>PDF Linx</strong> — your all-in-one online toolkit.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 hover:text-red-700 transition">
              {blog.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{blog.description}</p>
            <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
            <Link
              href={`/blog/${blog.slug}`}
              className="inline-block bg-red-700 text-white px-5 py-2 rounded-md font-medium hover:bg-red-600 transition"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}



























// "use client";

// import Link from "next/link";

// export default function Blog() {
//   const blogs = [
//     {
//       title: "Convert PDF to Word Online Without Losing Formatting",
//       description:
//         "Easily convert PDF to editable Word documents online. Keep your formatting, fonts, and layout perfectly preserved fast, free, and secure.",
//       date: "Aug 24, 2025",
//       slug: "pdf-to-word",
//     },
//     {
//       title: "Convert Word to PDF Instantly (No Software Needed)",
//       description:
//         "Turn your Word (DOC or DOCX) files into professional, high-quality PDFs in seconds. 100% free and secure ideal for resumes and reports.",
//       date: "Aug 26, 2025",
//       slug: "word-to-pdf",
//     },
//     {
//       title: "Convert Images (JPG, PNG) to PDF in Seconds",
//       description:
//         "Combine multiple images into a single PDF effortlessly. Works with JPG, PNG, and more no watermark, no signup required.",
//       date: "Aug 28, 2025",
//       slug: "image-to-pdf",
//     },
//     {
//       title: "Merge Multiple PDF Files into One Online",
//       description:
//         "Combine multiple PDF documents into one organized file easily. Preserve layout, order, and quality with our simple merge tool.",
//       date: "Aug 30, 2025",
//       slug: "merge-pdf",
//     },
//     {
//       title: "Split PDF Files Online (Extract Specific Pages Easily)",
//       description:
//         "Need only a few pages from a large PDF? Use our free PDF Splitter to extract, separate, or divide PDF files instantly.",
//       date: "Sep 1, 2025",
//       slug: "split-pdf",
//     },
//     {
//       title: "Compress PDF Files Without Losing Quality",
//       description:
//         "Reduce PDF file size for faster sharing without sacrificing text or image clarity. Ideal for email attachments and uploads.",
//       date: "Sep 3, 2025",
//       slug: "compress-pdf",
//     },
//     {
//       title: "Convert Excel to PDF Without Losing Formatting",
//       description:
//         "Convert Excel spreadsheets to PDF quickly and maintain your cell styles, charts, and formulas intact secure and free.",
//       date: "Sep 5, 2025",
//       slug: "excel-to-pdf",
//     },
//   ];

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-6">
//       <h1 className="text-4xl font-bold text-center mb-10">
//         PDF Tools Blog & Guides
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {blogs.map((blog, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
//           >
//             <h2 className="text-2xl font-semibold mb-3">{blog.title}</h2>
//             <p className="text-gray-600 mb-4">{blog.description}</p>
//             <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
//             <Link
//               href={`/blog/${blog.slug}`}
//               className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Read More
//             </Link>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }






















// // "use client";

// // import Link from "next/link";

// // export default function Blog() {
// //   // Dummy blog data
// //   const blogs = [
// //     {
// //       title: "How to Convert PDF to Word Easily",
// //       description:
// //         "Learn step-by-step how to convert your PDF files to editable Word documents quickly and securely.",
// //       date: "Aug 24, 2025",
// //       slug: "pdf-to-word-guide",
// //     },
// //     {
// //       title: "Merge Multiple PDFs into One File",
// //       description:
// //         "A simple tutorial on combining multiple PDF files into a single document using online tools.",
// //       date: "Aug 20, 2025",
// //       slug: "merge-pdf-guide",
// //     },
// //     {
// //       title: "Compress PDFs Without Losing Quality",
// //       description:
// //         "Tips and tricks to reduce PDF size while maintaining original quality for easy sharing.",
// //       date: "Aug 18, 2025",
// //       slug: "compress-pdf-guide",
// //     },
// //     {
// //       title: "Top 5 Free PDF Tools You Must Try",
// //       description:
// //         "Explore the best free online tools to manage your PDF files effectively in 2025.",
// //       date: "Aug 15, 2025",
// //       slug: "top-5-pdf-tools",
// //     },
// //   ];

// //   return (
// //     <main className="max-w-6xl mx-auto py-12 px-6">
// //       <h1 className="text-4xl font-bold text-center mb-10">Our Blog</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //         {blogs.map((blog, index) => (
// //           <div
// //             key={index}
// //             className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
// //           >
// //             <h2 className="text-2xl font-semibold mb-3">{blog.title}</h2>
// //             <p className="text-gray-600 mb-4">{blog.description}</p>
// //             <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
// //             <Link
// //               href={`/blog/${blog.slug}`}
// //               className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
// //             >
// //               Read More
// //             </Link>
// //           </div>
// //         ))}
// //       </div>
// //     </main>
// //   );
// // }

