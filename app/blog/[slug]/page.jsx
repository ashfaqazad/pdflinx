import { notFound } from "next/navigation";

// ✅ Dummy Blog Data
const blogs = [
  {
    slug: "pdf-to-word",
    title: "How to Convert PDF to Word Easily",
    date: "Aug 24, 2025",
    content: `
      Learn how to convert PDF to Word easily using online tools.
      We’ll guide you through free and secure methods to make your PDF editable in Word format.
    `,
  },
  {
    slug: "word-to-pdf",
    title: "Convert Word to PDF Instantly",
    date: "Aug 23, 2025",
    content: `
      Want to create professional PDFs from Word documents? 
      Here’s how you can do it online or offline, quickly and safely.
    `,
  },
  {
    slug: "image-to-pdf",
    title: "Convert Images to PDF in Seconds",
    date: "Aug 22, 2025",
    content: `
      Combine multiple JPG or PNG images into a single PDF file.
      Perfect for sharing photo documents online.
    `,
  },
  {
    slug: "merge-pdf",
    title: "Merge Multiple PDFs into One",
    date: "Aug 21, 2025",
    content: `
      Learn to merge multiple PDF files into one organized document in just a few clicks.
    `,
  },
  {
    slug: "split-pdf",
    title: "Split Large PDF Files Easily",
    date: "Aug 20, 2025",
    content: `
      Got a big PDF? Learn to split it into smaller, more manageable parts online for free.
    `,
  },
  {
    slug: "compress-pdf",
    title: "Compress PDFs Without Losing Quality",
    date: "Aug 19, 2025",
    content: `
      Reduce your PDF file size while keeping the quality intact.
      Great for emailing or uploading online.
    `,
  },
  {
    slug: "excel-to-pdf",
    title: "Convert Excel Sheets to PDF Format",
    date: "Aug 18, 2025",
    content: `
      Turn your Excel spreadsheets into easy-to-share PDF documents
      with our quick guide.
    `,
  },
];

// ✅ Metadata (Async version)
export async function generateMetadata({ params }) {
  const { slug } = await params; // 👈 fix: await added here
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  return {
    title: blog.title,
    description: blog.content.slice(0, 120),
  };
}

// ✅ Page Component (Async version)
export default async function BlogPost({ params }) {
  const { slug } = await params; // 👈 fix: await added here
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-6">{blog.date}</p>
      <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
        {blog.content}
      </div>
    </main>
  );
}


















// import { notFound } from "next/navigation";

// const blogs = [
//   {
//     title: "How to Convert PDF to Word Without Losing Formatting",
//     description:
//       "Learn how to convert PDF to Word online easily without losing formatting or layout. Free, fast, and secure PDF to Word conversion.",
//     date: "Aug 24, 2025",
//     slug: "pdf-to-word-guide",
//     keywords: ["PDF to Word", "convert PDF", "online PDF converter", "Word document"],
//     content: `
//       <h3>Why Convert PDF to Word?</h3>
//       <p>PDF files are perfect for sharing, but editing them can be difficult. By converting your PDF to Word, you can easily edit text, change formatting, and reuse content anywhere.</p>
//       <h3>Steps to Convert PDF to Word Online</h3>
//       <ol>
//         <li>Click on <b>Upload PDF File</b> on our homepage.</li>
//         <li>Wait for the system to process your file.</li>
//         <li>Click on <b>Download Word File</b> to get your editable document.</li>
//       </ol>
//       <h3>Benefits</h3>
//       <ul>
//         <li>No sign-up required</li>
//         <li>Preserves formatting and fonts</li>
//         <li>Works on all devices</li>
//       </ul>
//     `,
//   },
//   {
//     title: "Merge Multiple PDFs into One File",
//     description:
//       "Combine multiple PDF files into a single document easily. Learn to merge PDFs online without losing order or quality.",
//     date: "Aug 30, 2025",
//     slug: "merge-pdf-guide",
//     keywords: ["merge PDF", "combine PDFs", "join PDF files", "PDF merger tool"],
//     content: `
//       <h3>Steps to Merge PDFs</h3>
//       <ol>
//         <li>Open Merge PDF page</li>
//         <li>Upload all files</li>
//         <li>Click Merge and Download</li>
//       </ol>
//     `,
//   },
//   // Baqi blog objects yahan same rakho...
// ];






// // ✅ Generate static routes
// export async function generateStaticParams() {
//   return blogs.map((blog) => ({ slug: blog.slug }));
// }

// // ✅ Generate meta for SEO
// export async function generateMetadata({ params }) {
//   const { slug } = await params; // 👈 Fix here
//   const blog = blogs.find((b) => b.slug === slug);
//   if (!blog) return notFound();

//   return {
//     title: `${blog.title} | PDF Converter`,
//     description: blog.description,
//     keywords: blog.keywords.join(", "),
//     openGraph: {
//       title: blog.title,
//       description: blog.description,
//       siteName: "PDF Converter",
//       type: "article",
//     },
//   };
// }

// // ✅ Main Blog Page
// export default async function BlogPost({ params }) {
//   const { slug } = await params; // 👈 Fix here
//   const blog = blogs.find((b) => b.slug === slug);
//   if (!blog) return notFound();

//   return (
//     <main className="max-w-4xl mx-auto py-10 px-6">
//       <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
//       <p className="text-gray-500 mb-6">{blog.date}</p>
//       <article className="prose prose-lg text-gray-700 leading-relaxed">
//         <div dangerouslySetInnerHTML={{ __html: blog.content }} />
//       </article>
//     </main>
//   );
// }





















// // // app/blog/[slug]/page.js
// // import { notFound } from "next/navigation";

// // const blogs = [
// //   {
// //     title: "How to Convert PDF to Word Without Losing Formatting",
// //     description:
// //       "Learn how to convert PDF to Word online easily without losing formatting or layout. Free, fast, and secure PDF to Word conversion.",
// //     date: "Aug 24, 2025",
// //     slug: "pdf-to-word",
// //     keywords: ["PDF to Word", "convert PDF", "online PDF converter", "Word document"],
// //     content: `
// //       <h3>Why Convert PDF to Word?</h3>
// //       <p>PDF files are perfect for sharing, but editing them can be difficult. By converting your PDF to Word, you can easily edit text, change formatting, and reuse content anywhere.</p>
// //       <h3>Steps to Convert PDF to Word Online</h3>
// //       <ol>
// //         <li>Click on <b>Upload PDF File</b> on our homepage.</li>
// //         <li>Wait for the system to process your file.</li>
// //         <li>Click on <b>Download Word File</b> to get your editable document.</li>
// //       </ol>
// //       <h3>Benefits</h3>
// //       <ul>
// //         <li>No sign-up required</li>
// //         <li>Preserves formatting and fonts</li>
// //         <li>Works on all devices</li>
// //       </ul>
// //     `,
// //   },
// //   {
// //     title: "Best Way to Convert Word to PDF (No Software Needed)",
// //     description:
// //       "Convert your Word files into professional PDFs online. Learn how to create high-quality PDFs from DOC or DOCX in seconds.",
// //     date: "Aug 26, 2025",
// //     slug: "word-to-pdf",
// //     keywords: ["Word to PDF", "convert DOCX", "PDF creation", "online document converter"],
// //     content: `
// //       <h3>Why Word to PDF?</h3>
// //       <p>PDF files maintain layout and formatting across all devices. Perfect for resumes and official documents.</p>
// //       <h3>How to Convert</h3>
// //       <ol>
// //         <li>Go to Word to PDF tool</li>
// //         <li>Upload your Word file</li>
// //         <li>Download your PDF instantly</li>
// //       </ol>
// //     `,
// //   },
// //   {
// //     title: "Convert Images to PDF in Seconds (Free Online Tool)",
// //     description:
// //       "Easily convert multiple images into one PDF file. Works with JPG, PNG, and more. Quick, secure, and totally free.",
// //     date: "Aug 28, 2025",
// //     slug: "image-to-pdf",
// //     keywords: ["Image to PDF", "JPG to PDF", "PNG to PDF", "photo to PDF"],
// //     content: `
// //       <h3>Why Convert Images to PDF?</h3>
// //       <p>Helps you store and share scanned pages, receipts, or photos in one file.</p>
// //       <h3>Steps:</h3>
// //       <ol>
// //         <li>Go to Image to PDF converter</li>
// //         <li>Upload your images</li>
// //         <li>Click Convert and Download</li>
// //       </ol>
// //     `,
// //   },
// //   {
// //     title: "How to Merge Multiple PDF Files into One",
// //     description:
// //       "Combine multiple PDF files into a single document easily. Learn to merge PDFs online without losing order or quality.",
// //     date: "Aug 30, 2025",
// //     slug: "merge-pdf",
// //     keywords: ["merge PDF", "combine PDFs", "join PDF files", "PDF merger tool"],
// //     content: `
// //       <h3>Steps to Merge PDFs</h3>
// //       <ol>
// //         <li>Open Merge PDF page</li>
// //         <li>Upload all files</li>
// //         <li>Click Merge and Download</li>
// //       </ol>
// //     `,
// //   },
// //   {
// //     title: "Split PDF Files Online (Free & Easy)",
// //     description:
// //       "Split large PDF files into smaller sections or extract specific pages online securely and for free.",
// //     date: "Sep 2, 2025",
// //     slug: "split-pdf",
// //     keywords: ["split PDF", "extract PDF pages", "divide PDF"],
// //     content: `
// //       <h3>Why Split PDFs?</h3>
// //       <p>Split PDFs to extract specific chapters or remove unnecessary pages.</p>
// //     `,
// //   },
// //   {
// //     title: "Reduce PDF File Size Without Losing Quality",
// //     description:
// //       "Compress your PDF files online without affecting text or image quality. Learn how to reduce PDF size quickly and for free.",
// //     date: "Sep 1, 2025",
// //     slug: "compress-pdf",
// //     keywords: ["compress PDF", "reduce PDF size", "shrink PDF", "PDF optimizer"],
// //     content: `
// //       <h3>Why Compress PDFs?</h3>
// //       <p>Save space and make your PDFs easier to email or upload online.</p>
// //     `,
// //   },
// //   {
// //     title: "Convert Excel to PDF Easily Online",
// //     description:
// //       "Learn how to convert Excel sheets to PDF without losing formatting or formulas. Works for XLS and XLSX files.",
// //     date: "Sep 3, 2025",
// //     slug: "excel-to-pdf",
// //     keywords: ["Excel to PDF", "XLS to PDF", "spreadsheet converter"],
// //     content: `
// //       <h3>Steps to Convert Excel to PDF</h3>
// //       <ol>
// //         <li>Go to Excel to PDF tool</li>
// //         <li>Upload your Excel file</li>
// //         <li>Download your clean PDF</li>
// //       </ol>
// //     `,
// //   },
// // ];

// // // 👇 This function fixes 404 issue during static generation
// // export async function generateStaticParams() {
// //   return blogs.map((blog) => ({ slug: blog.slug }));
// // }

// // export async function generateMetadata({ params }) {
// //   const blog = blogs.find((b) => b.slug === params.slug);
// //   if (!blog) return notFound();

// //   return {
// //     title: `${blog.title} | PDF Converter`,
// //     description: blog.description,
// //     keywords: blog.keywords.join(", "),
// //     openGraph: {
// //       title: blog.title,
// //       description: blog.description,
// //       siteName: "PDF Converter",
// //       type: "article",
// //     },
// //   };
// // }

// // export default function BlogPost({ params }) {
// //   const blog = blogs.find((b) => b.slug === params.slug);
// //   if (!blog) return notFound();

// //   return (
// //     <main className="max-w-4xl mx-auto py-10 px-6">
// //       <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
// //       <p className="text-gray-500 mb-6">{blog.date}</p>
// //       <article className="prose prose-lg text-gray-700 leading-relaxed">
// //         <div dangerouslySetInnerHTML={{ __html: blog.content }} />
// //       </article>
// //     </main>
// //   );
// // }







































