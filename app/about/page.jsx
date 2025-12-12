import { ShieldCheck, Zap, Globe } from "lucide-react";

// ✅ Enhanced SEO Metadata
export const metadata = {
  title: "About PDF Linx | Free Online PDF Converter & Tools",
  description:
    "Learn about PDF Linx, your trusted free online platform for PDF conversions, merging, splitting, compressing, and utility tools like QR Code Generator, Password Creator, and Image Compressor. Secure, fast, and no signup required.",
  keywords: [
    "PDF Linx about",
    "free PDF tools",
    "online PDF converter",
    "merge PDF online",
    "split PDF free",
    "compress PDF",
    "Word to PDF converter",
    "PDF to Word online",
    "Excel to PDF free",
    "Image to PDF tool",
    "QR code generator free",
    "password generator secure",
    "unit converter online",
    "image compressor",
    "image to text OCR",
    "HEIC to JPG converter",
    "text to PDF free",
    "PDF tools review",
    "free document converter",
    "online file tools",
  ],
  openGraph: {
    title: "About PDF Linx - Free Online PDF & File Tools",
    description: "Discover PDF Linx: Free PDF converters, QR generators, image tools, and more for secure document management.",
    url: "https://www.pdflinx.com/about",
    images: [{ url: "https://www.pdflinx.com/og-about.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function About() {
  return (
    <>
      {/* ✅ Organization Schema for SEO */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "About PDF Linx",
              description: "Learn about our free online PDF and utility tools platform.",
              url: "https://www.pdflinx.com/about",
              publisher: {
                "@type": "Organization",
                name: "PDF Linx",
                url: "https://www.pdflinx.com",
              },
            }),
          }}
        />
      </head>

      <main className="max-w-6xl mx-auto py-16 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        {/* ✅ Hero Section - Aggressive Bold Look */}
        <section className="text-center mb-16 rounded-2xl bg-white shadow-2xl border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-900 leading-tight tracking-tight">
            About PDF Linx
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            PDF Linx is a free online toolkit designed to simplify your digital document management.
            From <strong>PDF conversions</strong> to <strong>QR generation, image compression, and password creation</strong>,
            we provide all-in-one tools to help students, professionals, and creators save time securely and efficiently.
          </p>
        </section>

        {/* ✅ Our Mission - Sharp Gradient Card */}
        <section className="mb-16 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl shadow-xl border border-indigo-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
            Our mission at <span className="font-bold text-indigo-800">PDF Linx</span> is to make
            document and media management effortless for everyone. We aim to deliver
            <strong> fast, free, and secure</strong> online tools from <strong>PDF converters</strong>,
            <strong> image optimizers</strong>, and <strong>QR generators</strong> to
            <strong> signature makers</strong> ensuring that your data remains private and your workflow smoother than ever.
          </p>
        </section>

        {/* ✅ Features / Values - Aggressive Cards with Sharp Shadows */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2">
            <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-6 shadow-md p-3 rounded-xl bg-indigo-50" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Free & Accessible</h3>
            <p className="text-gray-600 leading-relaxed">
              All tools like PDF Converters, QR Generators, and Unit Converters are free to use, anytime and anywhere.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2">
            <Zap className="w-16 h-16 mx-auto text-amber-600 mb-6 shadow-md p-3 rounded-xl bg-amber-50" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast & Reliable</h3>
            <p className="text-gray-600 leading-relaxed">
              Enjoy high-speed processing for merging, splitting, or converting PDFs optimized for performance and accuracy.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2">
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-6 shadow-md p-3 rounded-xl bg-emerald-50" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Private</h3>
            <p className="text-gray-600 leading-relaxed">
              Your files are processed securely and deleted after completion your privacy is our top priority.
            </p>
          </div>
        </section>

        {/* ✅ Our Story - Bold Shadow Card */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">Our Story</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            PDF Linx began as a passion project to simplify PDF conversions. As we grew, so did our vision
            expanding into <strong>image, text, and media utilities</strong> that make everyday digital tasks easier.
            From converting <strong>PDFs, Word, Excel, and Images</strong> to generating
            <strong> QR codes, passwords, and signatures</strong>,
            we're on a mission to build the most comprehensive and accessible toolset online.
          </p>
        </section>
      </main>
    </>
  );
}


































// import { ShieldCheck, Zap, Globe } from "lucide-react";

// // ✅ SEO Metadata
// export const metadata = {
//   title: "About PDF Linx | Free Online PDF & File Tools",
//   description:
//     "Discover PDF Linx, your free platform for PDF conversions, merging, compressing, and tools like QR Generator, Image to Text, and Password Creator.",
//   keywords: [
//     "PDF Linx",
//     "PDF tools",
//     "online PDF converter",
//     "merge PDF",
//     "split PDF",
//     "compress PDF",
//     "Word to PDF",
//     "PDF to Word",
//     "Excel to PDF",
//     "Text to PDF",
//     "Image to PDF",
//     "QR generator",
//     "password generator",
//     "unit converter",
//     "image compressor",
//     "image to text",
//     "HEIC to JPG",
//     "PDF tools online",
//     "free document converter",
//   ],
// };

// export default function About() {
//   return (
//     <main className="max-w-6xl mx-auto py-16 px-6">
//       {/* ✅ Hero Section */}
//       <section className="text-center mb-16">
//         <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
//           About PDF Linx
//         </h1>
//         <p className="text-gray-700 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
//           PDF Linx is a free online toolkit designed to simplify your digital document management.
//           From <strong>PDF conversions</strong> to <strong>QR generation, image compression, and password creation</strong>,
//           we provide all-in-one tools to help students, professionals, and creators save time securely and efficiently.
//         </p>
//       </section>

//       {/* ✅ Our Mission */}
//       <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-10">
//         <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
//           Our Mission
//         </h2>
//         <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
//           Our mission at <span className="font-semibold text-blue-600">PDF Linx</span> is to make
//           document and media management effortless for everyone. We aim to deliver
//           <strong> fast, free, and secure</strong> online tools from <strong>PDF converters</strong>,
//           <strong> image optimizers</strong>, and <strong>QR generators</strong> to
//           <strong> signature makers</strong> ensuring that your data remains private and your workflow smoother than ever.
//         </p>
//       </section>

//       {/* ✅ Features / Values */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <Globe className="w-12 h-12 mx-auto text-blue-600 mb-4" />
//           <h3 className="text-xl font-semibold mb-2 dark:text-white">Free & Accessible</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             All tools like PDF Converters, QR Generators, and Unit Converters are free to use, anytime and anywhere.
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
//           <h3 className="text-xl font-semibold mb-2 dark:text-white">Fast & Reliable</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             Enjoy high-speed processing for merging, splitting, or converting PDFs optimized for performance and accuracy.
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition">
//           <ShieldCheck className="w-12 h-12 mx-auto text-green-600 mb-4" />
//           <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure & Private</h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             Your files are processed securely and deleted after completion your privacy is our top priority.
//           </p>
//         </div>
//       </section>

//       {/* ✅ Our Story */}
//       <section className="mt-16 text-center bg-gray-100 shadow-md py-10 rounded-2xl">
//         <h2 className="text-3xl mb-6 text-red-800 font-bold">Our Story</h2>
//         <p className="text-gray-700 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
//           PDF Linx began as a passion project to simplify PDF conversions. As we grew, so did our vision
//           expanding into <strong>image, text, and media utilities</strong> that make everyday digital tasks easier.
//           From converting <strong>PDFs, Word, Excel, and Images</strong> to generating
//           <strong> QR codes, passwords, and signatures</strong>,
//           we’re on a mission to build the most comprehensive and accessible toolset online.
//         </p>
//       </section>
//     </main>
//   );
// }







