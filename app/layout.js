import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Official Next.js 15+ standard metadata export
export const metadata = {
  title: {
    default: "PDF Linx - Free Online PDF & Utility Tools | Merge, Convert & Compress",
    template: "%s | PDF Linx",
  },
  description:
    "PDF Linx (pdflinx.com) - Free online tools to convert, merge, split, and compress PDF files easily. Also includes Password Generator, QR Code Generator, Image Compressor, Unit Converter, YouTube Thumbnail Downloader, and Text to PDF tools.",
  keywords: [
    // 🔹 PDF-related
    "PDF Linx",
    "pdflinx",
    "PDF converter",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "Word to PDF",
    "PDF to Word",
    "online PDF tools",
    "Text to PDF",
    // 🔹 Utility tools
    "Password Generator",
    "QR Code Generator",
    "Image Compressor",
    "Unit Converter",
    "YouTube Thumbnail Downloader",
    "Free Online Tools",
    "Online Utilities",
  ],
  authors: [{ name: "PDF Linx", url: "https://www.pdflinx.com" }],
  creator: "PDF Linx",
  publisher: "PDF Linx",
  metadataBase: new URL("https://www.pdflinx.com"),
  openGraph: {
    title: "PDF Linx - Free Online PDF & Utility Tools | Merge, Convert & Compress",
    description:
      "Use PDF Linx (pdflinx.com) for all your online tools: convert, merge, split, and compress PDFs — plus Password Generator, QR Code Generator, Image Compressor, Unit Converter, YouTube Thumbnail Downloader, and Text to PDF.",
    url: "https://www.pdflinx.com/",
    siteName: "PDF Linx",
    images: [
      {
        url: "https://www.pdflinx.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDF Linx - Free Online PDF & Utility Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Linx - Free Online PDF & Utility Tools | Merge, Convert & Compress",
    description:
      "Convert, merge, and compress PDFs online — plus tools like Password Generator, QR Code Generator, Image Compressor, Unit Converter, and more on PDF Linx.",
    images: ["https://www.pdflinx.com/og-image.png"],
    creator: "@pdflinx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

// ✅ Official Root Layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Structured Data (Schema.org JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PDF Linx",
              url: "https://www.pdflinx.com",
              logo: "https://www.pdflinx.com/logo.png",
              sameAs: [
                "https://www.facebook.com/pdflinx",
                "https://twitter.com/pdflinx",
                "https://www.instagram.com/pdflinx",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-gray-50`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

































// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });



// export const metadata = {
//   title: {
//     default: "PDFLinx - Free PDF Tools",
//     template: "%s | PDFLinx",
//   },
//   description:
//     "Free online tools to convert, merge, split, and compress PDF files easily.",
//   icons: {
//     icon: "/favicon.svg",
//     shortcut: "/favicon.svg",
//     apple: "/favicon.svg",
//   },
// };

// // export const metadata = {
// //   title: "PDFLinx - PDF Tools",
// //   description: "Convert PDF files easily online.",
// //   icons: {
// //     icon: "/favicon.svg",
// //     shortcut: "/favicon.svg",
// //     apple: "/favicon.svg",
// //   },
// // };


// // export const metadata = {
// //   icons: {
// //     icon: "/favicon.svg",
// //     shortcut: "/favicon.svg",
// //     apple: "/favicon.svg",
// //   },
// // };



// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-gray-50`}
//       >
//         <Navbar />
//         <main className="flex-grow">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }





















// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // export const metadata = {
// //   title: "Create Next App",
// //   description: "Generated by create next app",
// // };

// export const metadata = {
//   title: "PDF Converter Online – PDF to Word, Word to PDF, Image to PDF",
//   description: "Free online PDF conversion tools: PDF to Word, Word to PDF, Image to PDF, Merge, Split, Compress PDF. Fast, secure, no registration required.",
// };


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-gray-50`}
//       >
//         <Navbar />
//         {/* Main content area grows to push footer down */}
//         <main className="flex-grow">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }


















// // import { Geist, Geist_Mono } from "next/font/google";
// // import "./globals.css";
// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// // export const metadata = {
// //   title: "Create Next App",
// //   description: "Generated by create next app",
// // };

// // export default function RootLayout({ children }) {
// //   return (
// //     <html lang="en">
// //       <body className={`${geistSans.variable} ${geistMono.variable}`}>
// //         <Navbar />
// //         {children}
// //         <Footer />
// //       </body>
// //     </html>
// //   );
// // }
