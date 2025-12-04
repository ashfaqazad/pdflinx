import { ShieldCheck, Zap, Globe } from "lucide-react";

// ✅ SEO Metadata
export const metadata = {
  title: "About PDF Linx | Free Online PDF & File Tools",
  description:
    "Discover PDF Linx — your free platform for PDF conversions, merging, compressing, and tools like QR Generator, Image to Text, and Password Creator.",
  keywords: [
    "PDF Linx",
    "PDF tools",
    "online PDF converter",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "Word to PDF",
    "PDF to Word",
    "Excel to PDF",
    "Text to PDF",
    "Image to PDF",
    "QR generator",
    "password generator",
    "unit converter",
    "image compressor",
    "image to text",
    "HEIC to JPG",
    "PDF tools online",
    "free document converter",
  ],
};

export default function About() {
  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      {/* ✅ Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          About PDF Linx
        </h1>
        <p className="text-gray-700 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          PDF Linx is a free online toolkit designed to simplify your digital document management.
          From <strong>PDF conversions</strong> to <strong>QR generation, image compression, and password creation</strong>,
          we provide all-in-one tools to help students, professionals, and creators save time — securely and efficiently.
        </p>
      </section>

      {/* ✅ Our Mission */}
      <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
          Our mission at <span className="font-semibold text-blue-600">PDF Linx</span> is to make
          document and media management effortless for everyone. We aim to deliver
          <strong> fast, free, and secure</strong> online tools — from <strong>PDF converters</strong>,
          <strong> image optimizers</strong>, and <strong>QR generators</strong> to
          <strong> signature makers</strong> — ensuring that your data remains private and your workflow smoother than ever.
        </p>
      </section>

      {/* ✅ Features / Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
          <Globe className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Free & Accessible</h3>
          <p className="text-gray-600 dark:text-gray-300">
            All tools like PDF Converters, QR Generators, and Unit Converters are free to use, anytime and anywhere.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
          <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Fast & Reliable</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Enjoy high-speed processing for merging, splitting, or converting PDFs — optimized for performance and accuracy.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
          <ShieldCheck className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure & Private</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your files are processed securely and deleted after completion — your privacy is our top priority.
          </p>
        </div>
      </section>

      {/* ✅ Our Story */}
      <section className="mt-16 text-center bg-gray-100 shadow-md py-10 rounded-2xl">
        <h2 className="text-3xl mb-6 text-red-800 font-bold">Our Story</h2>
        <p className="text-gray-700 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          PDF Linx began as a passion project to simplify PDF conversions. As we grew, so did our vision —
          expanding into <strong>image, text, and media utilities</strong> that make everyday digital tasks easier.
          From converting <strong>PDFs, Word, Excel, and Images</strong> to generating
          <strong> QR codes, passwords, and signatures</strong>,
          we’re on a mission to build the most comprehensive and accessible toolset online.
        </p>
      </section>
    </main>
  );
}


































// // "use client";

// import { ShieldCheck, Zap, Globe } from "lucide-react"; // ✅ icons use karne ke liye

// // ✅ SEO Metadata
// export const metadata = {
//   title: "About PDF Tools | Free Online PDF Conversions",
//   description:
//     "PDF Tools is a free online platform offering PDF conversions, merging, splitting, compressing, and other document management tools. Secure, fast, and accessible.",
//   keywords: [
//     "PDF tools",
//     "online PDF converter",
//     "merge PDF",
//     "split PDF",
//     "compress PDF",
//     "convert PDF to Word",
//     "Word to PDF",
//     "free PDF tools",
//     "secure PDF tools",
//   ],
// };

// export default function About() {
//   return (
//     <main className="max-w-6xl mx-auto py-16 px-6">
//       {/* Hero Section */}
//       <section className="text-center mb-16">
//         <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//           About PDF Tools
//         </h1>
//         <p className="text-gray-700 dark:text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
//           PDF Tools is a free online platform dedicated to helping users manage 
//           their PDF and document files with ease. Our goal is to make document 
//           management simple, fast, and accessible for everyone. We provide secure 
//           and efficient solutions for all types of PDF conversions.
//         </p>
//       </section>

//       {/* Mission Section */}
//       <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-10">
//         <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
//           Our Mission
//         </h2>
//         <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
//           We believe in providing <span className="font-semibold text-blue-600">100% free</span>, secure, 
//           and user-friendly tools that empower students, professionals, and 
//           businesses to convert, merge, split, compress, and handle PDF 
//           documents without hassle. Our mission is to save your time while 
//           keeping your data safe.
//         </p>
//       </section>

//       {/* Features / Values Section */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <Globe className="w-12 h-12 mx-auto text-blue-600 mb-4" />
//           <h3 className="text-xl font-semibold mb-2 dark:text-white">Free & Accessible</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             All tools are free for everyone, anytime, anywhere.
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
//           <h3 className="text-xl font-semibold mb-2  dark:text-white">Fast & Reliable</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             Process documents quickly with guaranteed performance.
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <ShieldCheck className="w-12 h-12 mx-auto text-green-600 mb-4" />
//           <h3 className="text-xl font-semibold mb-2  dark:text-white">Secure & Private</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             Your files are safe and deleted after processing.
//           </p>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="mt-16 text-center bg-gray-100 shadow-md py-8 rounded-2xl">
//         <h2 className="text-3xl mb-6 text-red-800 font-bold">
//           Our Story
//         </h2>
//         <p className="text-gray-700 dark:text-gray-600 max-w-3xl mx-auto leading-relaxed">
//           PDF Tools started as a small project to make online document management 
//           simple and efficient. Over time, we expanded our tools to cover PDF 
//           conversions, merging, splitting, compressing, and more. Our team is 
//           passionate about building free, reliable, and easy-to-use tools that 
//           help people around the globe.
//         </p>
//       </section>
//     </main>
//   );
// }




















// // "use client";

// // import { ShieldCheck, Zap, Globe } from "lucide-react"; // ✅ icons use karne k liye

// // export default function About() {
// //   return (
// //     <main className="max-w-6xl mx-auto py-16 px-6">
// //       {/* Hero Section */}
// //       <section className="text-center mb-16">
// //         <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
// //           About PSD Tools
// //         </h1>
// //         <p className="text-gray-700 dark:text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
// //           PSD Tools is a free online platform dedicated to helping users manage 
// //           their PDF and document files with ease. Our goal is to make document 
// //           management simple, fast, and accessible for everyone.
// //         </p>
// //       </section>

// //       {/* Mission Section */}
// //       <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-10">
// //         <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
// //           Our Mission
// //         </h2>
// //         <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
// //           We believe in providing <span className="font-semibold text-blue-600">100% free</span>, secure, 
// //           and user-friendly tools that empower students, professionals, and 
// //           businesses to convert, merge, split, compress, and handle PDF 
// //           documents without hassle. Our mission is to save your time while 
// //           keeping your data safe.
// //         </p>
// //       </section>

// //       {/* Features / Values Section */}
// //       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
// //         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
// //           <Globe className="w-12 h-12 mx-auto text-blue-600 mb-4" />
// //           <h3 className="text-xl font-semibold mb-2 dark:text-white">Free & Accessible</h3>
// //           <p className="text-gray-600 dark:text-gray-300">
// //             All tools are free for everyone, anytime, anywhere.
// //           </p>
// //         </div>
// //         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
// //           <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
// //           <h3 className="text-xl font-semibold mb-2  dark:text-white">Fast & Reliable</h3>
// //           <p className="text-gray-600 dark:text-gray-300">
// //             Process documents quickly with guaranteed performance.
// //           </p>
// //         </div>
// //         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
// //           <ShieldCheck className="w-12 h-12 mx-auto text-green-600 mb-4" />
// //           <h3 className="text-xl font-semibold mb-2  dark:text-white">Secure & Private</h3>
// //           <p className="text-gray-600 dark:text-gray-300">
// //             Your files are safe and deleted after processing.
// //           </p>
// //         </div>
// //       </section>

// //       {/* Story Section */}
// //       <section className="mt-16 text-center  bg-gray-100 shadow-md py-8 rounded-2xl">
// //         <h2 className="text-3xl mb-6 text-red-800 font-bold">
// //           Our Story
// //         </h2>
// //         <p className="text-gray-700 dark:text-gray-600 max-w-3xl mx-auto leading-relaxed">
// //           PSD Tools started as a small project to make online document management 
// //           simple and efficient. Over time, we expanded our tools to cover PDF 
// //           conversions, merging, splitting, compressing, and more. Our team is 
// //           passionate about building free, reliable, and easy-to-use tools that 
// //           help people around the globe.
// //         </p>
// //       </section>
// //     </main>
// //   );
// // }












// // "use client";

// // export default function About() {
// //   return (
// //     <main className="max-w-5xl mx-auto py-12 px-6">
// //       {/* Hero Section */}
// //       <section className="text-center mb-12">
// //         <h1 className="text-4xl font-bold mb-4">About PSD Tools</h1>
// //         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
// //           PSD Tools is a free online platform dedicated to helping users manage 
// //           their PDF and document files easily. Our goal is to make document 
// //           management simple, fast, and accessible to everyone.
// //         </p>
// //       </section>

// //       {/* Mission Section */}
// //       <section className="mb-12">
// //         <h2 className="text-3xl font-semibold mb-6 text-center">Our Mission</h2>
// //         <p className="text-gray-700 text-center max-w-3xl mx-auto">
// //           We believe in providing 100% free, secure, and user-friendly tools that 
// //           empower students, professionals, and businesses to convert, merge, 
// //           split, compress, and handle PDF documents without hassle. Our mission 
// //           is to save your time and effort while maintaining data privacy.
// //         </p>
// //       </section>

// //       {/* Features / Values Section */}
// //       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h3 className="text-xl font-semibold mb-2">Free & Accessible</h3>
// //           <p className="text-gray-600">All tools are free for everyone, anytime, anywhere.</p>
// //         </div>
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
// //           <p className="text-gray-600">Process documents quickly with guaranteed performance.</p>
// //         </div>
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
// //           <p className="text-gray-600">Your files are safe and deleted after processing.</p>
// //         </div>
// //       </section>

// //       {/* Team / Story Section */}
// //       <section className="mt-12 text-center">
// //         <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
// //         <p className="text-gray-700 max-w-3xl mx-auto">
// //           PSD Tools started as a small project to make online document management 
// //           simple and efficient. Over time, we expanded our tools to cover PDF 
// //           conversions, merging, splitting, compressing, and more. Our team is 
// //           passionate about creating free, reliable, and easy-to-use tools for 
// //           everyone.
// //         </p>
// //       </section>
// //     </main>
// //   );
// // }
