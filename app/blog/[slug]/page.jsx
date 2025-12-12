// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { notFound } from "next/navigation";



const blogs = [



  // {
  //   slug: "pdf-to-word",
  //   title: "How to Convert PDF to Word Easily (Free & Online Guide)",
  //   date: "Aug 24, 2025",
  //   content: `
  //     Converting PDF files to Word format is one of the most common tasks for students, professionals, and freelancers.
  //     Whether you're editing a contract, fixing a resume, or reusing text from a PDF, this simple online process can save you hours.
      
  //     Our free PDF to Word converter helps you transform locked PDF files into fully editable DOCX files  
  //     without losing formatting, fonts, or images. Just upload, convert, and download.
      
  //     ✅ Steps:
  //     1. Upload your PDF file.
  //     2. Wait a few seconds while our system converts it into Word format.
  //     3. Download your fully editable Word file no signup, no watermark.
      
  //     Bonus Tip: For scanned documents, use the OCR (Optical Character Recognition) feature to extract text accurately.
      
  //     Tools like PDF Linx make this process 100% secure and private your files are auto-deleted after conversion.
  //   `,
  // },

{
  slug: "pdf-to-word",
  title: "How to Convert PDF to Word Easily (Free & Online Guide)",
  date: "Aug 24, 2025",
  content: `
    <h2>How to Convert PDF to Word Easily (Free & Online Guide)</h2>

    <p>Converting PDF files to Word format is one of the most common tasks for students, professionals, and freelancers. Whether you're editing a contract, fixing a resume, or reusing text from a PDF, this simple online process can save you hours.</p>

    <p><strong>Good news:</strong> You don't need to install any software! 
    With our <a href="/pdf-to-word"><strong>Free PDF to Word Converter</strong></a>, 
    you can transform any locked PDF into a fully editable DOCX file in seconds — 
    <strong>no signup, no watermark, 100% free</strong>.</p>

    <h3>Quick Steps to Convert PDF to Word:</h3>
    <ol>
      <li>Go to our <a href="/pdf-to-word">PDF to Word tool</a></li>
      <li>Upload your PDF file (drag & drop or click to select)</li>
      <li>Wait a few seconds while we convert it</li>
      <li>Download your editable .docx file instantly</li>
    </ol>

    <p><strong>Pro Tip:</strong> For scanned PDFs or images, our converter uses advanced OCR to extract text accurately. Just upload and get perfect results!</p>

    <p>Tools like <strong>PDF Linx</strong> make this process 100% secure and private — 
    your files are processed with encryption and <strong>automatically deleted after 1 hour</strong>.</p>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center font-bold text-indigo-800 mt-10">
      Ready to convert? → <a href="/pdf-to-word" class="text-indigo-600 underline hover:text-indigo-800">Click here to use our Free PDF to Word Converter now!</a>
    </div>
  `,
},

  {
    slug: "word-to-pdf",
    title: "Convert Word to PDF Instantly (No Software Required)",
    date: "Aug 23, 2025",
    content: `
      Want to make your Word document look more professional? Converting it to a PDF ensures it looks the same on every device.
      Perfect for resumes, reports, or contracts this method keeps formatting, images, and fonts consistent.
      
      With PDF Linx, you can convert DOC or DOCX files to PDF in just one click:
      1. Upload your Word file.
      2. Click Convert.
      3. Download your clean, polished PDF instantly.
      
      Unlike other tools, ours doesn’t add watermarks or require installation completely online, free, and secure.
      
      💡 Pro Tip: Use our “Compress PDF” tool afterward to shrink file size before emailing or uploading.
    `,
  },
  {
    slug: "image-to-pdf",
    title: "Convert Images (JPG, PNG) to PDF in Seconds",
    date: "Aug 22, 2025",
    content: `
      If you’ve ever needed to share multiple images in one file, converting them into a single PDF is the best solution.
      Whether it’s scanned receipts, ID photos, or design samples a PDF keeps everything neatly packed.
      
      Using our Image to PDF tool:
      - Upload your images (JPG, PNG, or JPEG supported).
      - Reorder them if needed.
      - Click “Convert” to generate one organized PDF.
      
      It’s that easy no signup, no watermark, and full privacy.
      Bonus: Use “Compress PDF” for smaller files or “Merge PDF” to combine multiple PDFs later.
    `,
  },
  {
    slug: "merge-pdf",
    title: "Merge Multiple PDFs into One (Fast & Free)",
    date: "Aug 21, 2025",
    content: `
      Managing multiple PDF files can be messy merging them makes your workflow seamless.
      Whether you’re compiling invoices, reports, or eBooks, our free online PDF merger keeps everything in one place.
      
      Steps:
      1. Upload your PDF files.
      2. Arrange the order by dragging.
      3. Click “Merge” and download your single, neat file.
      
      No software needed, no size limits. Secure and quick.
      Tip: Once merged, use our “Compress PDF” feature to reduce the file size before sharing.
    `,
  },
  {
    slug: "split-pdf",
    title: "Split PDF Files Online (Extract Pages Instantly)",
    date: "Aug 20, 2025",
    content: `
      Have a large PDF but only need a few pages from it? Our free Split PDF tool lets you extract specific pages in seconds.
      Ideal for teachers, lawyers, and business users who need to separate reports or send excerpts.
      
      ✅ How it Works:
      - Upload your PDF file.
      - Select the page range you want (e.g. 3–10).
      - Click “Split” and download your new file instantly.
      
      Everything runs online no downloads, no logins. Perfect for quick document handling.
    `,
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF Files Without Losing Quality",
    date: "Aug 19, 2025",
    content: `
      Big PDF files can slow down email attachments and uploads.
      Our free Compress PDF tool reduces file size while keeping your document’s quality crystal clear.
      
      🚀 Quick Steps:
      1. Upload your large PDF file.
      2. Choose compression level (Low, Medium, or High).
      3. Download your optimized version instantly.
      
      You’ll get up to 90% smaller files with zero quality loss.
      Ideal for online submissions, business reports, or mobile users.
    `,
  },
  {
    slug: "excel-to-pdf",
    title: "Convert Excel Sheets to PDF Without Losing Formatting",
    date: "Aug 18, 2025",
    content: `
      Turning your Excel sheets into PDF helps preserve formulas, charts, and table formatting
      ensuring your data looks professional on any device.
      
      💡 Use Cases:
      - Convert budgets and financial reports into clean PDFs.
      - Share invoices or analytics securely without edit risks.
      
      How to Use:
      1. Upload your .XLS or .XLSX file.
      2. Click “Convert.”
      3. Download your ready-to-share PDF.
      
      All conversions are done online, with privacy and accuracy guaranteed.
    `,
  },

{
  slug: "qr-generator",
  title: "Generate QR Codes Instantly for Links, Text & Contacts",
  date: "Dec 2, 2025",
  content: `
    QR codes are everywhere in 2025 from restaurant menus to business cards and marketing flyers. 
    Our free QR Generator helps you create professional QR codes in seconds for links, Wi-Fi, or custom text.

    💡 Use Cases:
    - Create QR codes for websites, contact cards, and social profiles.
    - Print codes on posters, brochures, or packaging for better reach.

    How to Use:
    1. Enter your URL or text.
    2. Choose your color or style.
    3. Click “Generate” and download your code in PNG or SVG.

    Quick Tip:
    Add a logo in the center or use your brand color for better recognition.
  `,
},
{
  slug: "password-gen",
  title: "Create Strong Passwords Instantly with Our Password Generator",
  date: "Dec 3, 2025",
  content: `
    Weak passwords are the top cause of hacked accounts. 
    Our free Password Generator creates strong, secure, and unique passwords instantly to protect your online identity.

    💡 Use Cases:
    - Generate passwords for emails, banking, or cloud logins.
    - Ideal for freelancers and developers managing multiple accounts.

    How to Use:
    1. Set the desired password length.
    2. Select uppercase, lowercase, numbers, or symbols.
    3. Click “Generate” and copy securely.

    Pro Tip:
    Always store passwords in a password manager for easy and safe access.
  `,
},
{
  slug: "unit-converter",
  title: "Convert Units Easily with Our Free Online Unit Converter",
  date: "Dec 4, 2025",
  content: `
    Convert values quickly between measurement systems like meters to feet or Celsius to Fahrenheit with our smart online Unit Converter.

    💡 Use Cases:
    - Students, engineers, or cooks who need instant conversions.
    - Perfect for travel, construction, and science projects.

    How to Use:
    1. Choose a conversion type (Length, Weight, Area, etc.).
    2. Enter a value in one unit.
    3. Instantly see the equivalent in all other formats.

    Quick Tip:
    Save time by bookmarking the converter for daily use.
  `,
},
{
  slug: "youtube-thumbnail",
  title: "Download HD YouTube Thumbnails Instantly in One Click",
  date: "Dec 5, 2025",
  content: `
    Save high-quality YouTube thumbnails directly from any video link no software or login required. 
    Our downloader supports HD, Full HD, and even 4K thumbnails.

    💡 Use Cases:
    - Ideal for video editors, bloggers, and content creators.
    - Download cover images for your own YouTube videos.

    How to Use:
    1. Copy the YouTube video URL.
    2. Paste it into the downloader field.
    3. Click “Download” and choose your image quality.

    Tip:
    Always credit the creator if using thumbnails for public use.
  `,
},
{
  slug: "image-compressor",
  title: "Compress Images Online Without Losing Quality",
  date: "Dec 6, 2025",
  content: `
    Large image files slow down websites and uploads. 
    Our free Image Compressor reduces file size while keeping visual quality intact no installation needed.

    💡 Use Cases:
    - Compress JPG, PNG, or WebP for web and social media.
    - Optimize images for better website speed and SEO.

    How to Use:
    1. Upload your image files.
    2. Choose compression strength.
    3. Download your smaller, high-quality image.

    Pro Tip:
    Use medium compression to balance size and clarity perfectly.
  `,
},
{
  slug: "image-to-text",
  title: "Convert Images to Text Using AI (Image to Text Extractor)",
  date: "Dec 7, 2025",
  content: `
    Extract editable text from images or scanned papers with our AI-powered Image to Text converter fast, accurate, and 100% free.

    💡 Use Cases:
    - Turn handwritten notes, printed docs, or receipts into text.
    - Ideal for students, researchers, and office users.

    How to Use:
    1. Upload your image or screenshot.
    2. Click “Extract Text.”
    3. Copy or download your converted text instantly.

    Pro Tip:
    Use clear, bright images for the best recognition accuracy.
  `,
},
{
  slug: "signature-maker",
  title: "Draw & Download Signatures Online with Signature Maker",
  date: "Dec 8, 2025",
  content: `
    Create a professional digital signature instantly. 
    Our Signature Maker lets you draw, type, or upload your signature and download it in transparent PNG format.

    💡 Use Cases:
    - Sign contracts, NDAs, or forms online.
    - Ideal for freelancers and business professionals.

    How to Use:
    1. Draw or type your signature.
    2. Adjust color and thickness.
    3. Click “Download” and save your PNG file.

    Tip:
    Keep your digital signature safe for future use on official documents.
  `,
},
{
  slug: "heic-to-jpg",
  title: "Convert HEIC to JPG Instantly Online",
  date: "Dec 9, 2025",
  content: `
    Apple’s HEIC photos often can’t open on Windows or Android. 
    Our HEIC to JPG converter solves that by changing them to a universal JPG format instantly.

    💡 Use Cases:
    - Convert iPhone photos before sharing online.
    - Upload HEIC files easily to websites or email.

    How to Use:
    1. Upload your HEIC files.
    2. Click “Convert.”
    3. Download your JPGs in seconds.

    Pro Tip:
    Batch convert multiple photos to save time and maintain quality.
  `,
},
{
  slug: "text-to-pdf",
  title: "Convert Text to PDF Instantly Online (Free & Secure)",
  date: "Dec 10, 2025",
  content: `
    Turn simple text into a clean, professional PDF in seconds. 
    Our Text to PDF converter helps students, writers, and professionals format their notes or reports easily.

    💡 Use Cases:
    - Create resumes, letters, or documents.
    - Save notes and essays in shareable PDF format.

    How to Use:
    1. Paste or type your text into the editor.
    2. Click “Convert.”
    3. Download your PDF instantly.

    Pro Tip:
    Combine multiple text files using our Merge PDF tool for organized documents.
  `,
},


{
  slug: "best-tools-for-students",
  title: "Best Tools for Students to Study Smarter in 2025",
  date: "Dec 11, 2025",
  content: `
    In today’s digital age, students have access to hundreds of free tools that can make learning smarter, faster, and more efficient. 
    From managing notes to converting assignments into PDFs the right set of online tools can save you hours every week.

    This guide lists some of the "best online tools for students in 2025" that help with studying, productivity, and creativity
    whether you’re in school, college, or university.

    ✨ Here’s our curated list of top tools every student should try:

    1️⃣ "PDF Linx" – The All-in-One File Helper  
    Students often deal with tons of PDFs assignments, forms, scanned notes, etc.  
    With PDF Linx, you can:
    - Convert PDF to Word for easy editing.  
    - Merge or split PDFs for assignments.  
    - Compress PDFs before submitting them online.  
    - Create professional PDFs from Word or Text files.  
    All tools are "free, secure, and browser-based" no software needed.

    2️⃣ "Notion" – Stay Organized & Plan Smarter  
    Notion is the ultimate note-taking and task management app for students.  
    Use it to plan your study schedule, track deadlines, and create digital notebooks.  
    You can even collaborate with friends on group projects.

    3️⃣ "Google Docs" – Write, Edit & Share with Ease  
    Google Docs allows students to write assignments or essays online with auto-save and real-time collaboration.  
    It’s perfect for group projects and essay drafting.  
    Plus, all your data stays synced in Google Drive.

    4️⃣ "Grammarly" – Write Error-Free Assignments  
    Grammarly helps you correct grammar, spelling, and tone while writing essays, reports, or research papers.  
    It’s like having an English teacher right inside your browser.

    5️⃣ "Canva" – Make Creative Presentations  
    Canva is an amazing free design tool for creating posters, resumes, and slides.  
    With hundreds of free templates, it’s perfect for making your school or college projects stand out.

    6️⃣ "Quizlet" – Study Better with Flashcards  
    Learning definitions, vocabulary, or formulas?  
    Quizlet lets you create and use flashcards to memorize concepts faster.  
    It’s especially useful before exams.

    7️⃣ "ChatGPT" – Your AI Study Partner  
    From explaining complex topics to generating summaries, ChatGPT can save hours of research time.  
    It’s perfect for brainstorming ideas or learning new subjects in plain English.  
    (Just don’t forget to fact-check important answers!)

    💡 "Why These Tools Matter"
    Using the right digital tools helps students:
    - Stay organized and productive  
    - Complete assignments faster  
    - Improve focus and creativity  
    - Prepare for exams efficiently

    🎓 "Final Thoughts"
    In 2025, studying isn’t about working harder it’s about working smarter.  
    Tools like "PDF Linx", "Notion", and "Google Docs" empower students to stay ahead, manage time better, and achieve more with less effort.  
    So next time you open your laptop to study, make sure you’ve got these smart companions by your side. 🚀
  `,
},


];


import Link from "next/link";
import { notFound } from "next/navigation";  // ← YEHI RAKH, BAHUT HAI

// ✅ Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  return {
    title: blog.title + " | PDF Linx Blog",
    description: blog.content.slice(0, 160),
    keywords: [
      "PDF tools",
      "convert PDF online",
      "merge PDF",
      "split PDF",
      "compress PDF",
      "Word to PDF",
      "PDF to Word",
      "Excel to PDF",
      "PDF Linx blog",
    ],
  };
}

// // ✅ Blog Page Component
// export default async function BlogPost({ params }) {
//   const { slug } = await params;
//   const blog = blogs.find((b) => b.slug === slug);

//   if (!blog) return notFound();

//   return (
//     <main className="max-w-3xl mx-auto py-12 px-6">
//       {/* Back Button */}
//       {/* <Link
//         href="/blog"
//         className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
//       >
//         <ArrowLeft className="w-5 h-5 mr-2" />
//         Back to Blogs
//       </Link> */}

//       <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
//       <p className="text-gray-500 mb-6">{blog.date}</p>

//       <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
//         {blog.content}
//       </div>

//       <div className="mt-12">
//         <Link
//           href="/blog"
//           className="text-blue-600 font-medium hover:underline"
//         >
//           ← Explore More Guides on PDF Linx
//         </Link>
//       </div>
//     </main>
//   );
// }



// ✅ Blog Page Component - FINAL & WORKING VERSION
// import Link from "next/link";
// import { notFound } from "next/navigation";

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      {/* Optional Back Button */}
      {/* <Link href="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8">
        ← Back to Blog
      </Link> */}

      {/* Title & Date */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
        {blog.title}
      </h1>
      <p className="text-gray-500 text-sm mb-10">{blog.date}</p>

      {/* YE LINE CHANGE KI HAI — AB HTML PERFECT DIKHEGA! */}
      <article 
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />

      {/* Bottom CTA */}
      <div className="mt-16 pt-10 border-t border-gray-200 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold text-lg transition"
        >
          ← Explore More Guides on PDF Linx
        </Link>
      </div>
    </main>
  );
}










