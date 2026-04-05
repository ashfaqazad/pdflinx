// app/layout.js
import "./globals.css";
import { Sora, DM_Sans } from "next/font/google";
import Script from "next/script";
import HistatsTracker from "@/components/HistatsTracker";
import LayoutShell from "@/components/LayoutShell";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
  preload: true, // ✅ Add karo

});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true, // ✅ Add karo

});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export const metadata = {
  metadataBase: new URL("https://pdflinx.com"),

  title: {
    default: "Free Online PDF Tools — Convert, Merge, Compress & Split | PDF Linx",
    template: "%s | PDF Linx",
  },

  description:
    "PDF Linx is a free online PDF toolkit to convert PDF to Word, merge, split, compress, protect, unlock, rotate, sign, watermark, and edit PDFs quickly and securely.",

  keywords: [
    "PDF Linx",
    "pdflinx",
    "free pdf tools",
    "online pdf tools",
    "pdf converter",
    "pdf to word",
    "word to pdf",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "excel to pdf",
    "powerpoint to pdf",
    "jpg to pdf",
    "image to pdf",
    "pdf to jpg",
    "protect pdf",
    "unlock pdf",
    "rotate pdf",
    "sign pdf",
    "edit pdf",
    "ocr pdf",
    "add watermark",
  ],

  authors: [{ name: "PDF Linx", url: "https://pdflinx.com" }],
  creator: "PDF Linx",
  publisher: "PDF Linx",

  verification: {
    pinterest: "c1ab788f2cb7d222782d9d6ed6196669",
  },

  openGraph: {
    title: "PDF Linx — Free Online PDF Tools",
    description:
      "Convert PDF to Word, merge, split, compress, protect, unlock, rotate, sign, watermark, and edit PDFs — fast, private, and free.",
    url: "https://pdflinx.com/",
    siteName: "PDF Linx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDF Linx — Free Online PDF Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PDF Linx — Free Online PDF Tools",
    description:
      "Convert PDF to Word, merge, split, compress, protect, unlock, rotate, sign, watermark, and edit PDFs — fast, private, and free.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <head>
        <meta
          name="p:domain_verify"
          content="c1ab788f2cb7d222782d9d6ed6196669"
        />
        <meta name="ai-access" content="allow" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

      </head>

      <body className="flex min-h-screen flex-col bg-gray-50 font-sans">
        <LayoutShell>{children}</LayoutShell>

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3PSZFQJYJ8"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3PSZFQJYJ8');
          `}
        </Script>

        {/* ✅ Schema JSON-LD — beforeInteractive se afterInteractive kiya */}
        <Script
          id="all-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{

            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "PDF Linx",
                  url: "https://pdflinx.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://pdflinx.com/logo.png",
                    width: 512,
                    height: 512,
                  },
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  name: "PDF Linx",
                  url: "https://pdflinx.com",
                  description:
                    "Free online PDF tools to convert, merge, split, compress, protect, unlock, rotate, sign, watermark, and edit PDFs instantly.",
                  publisher: {
                    "@type": "Organization",
                    name: "PDF Linx",
                  },
                },
                {
                  "@type": "WebApplication",
                  name: "PDF Linx — Free PDF Tools",
                  url: "https://pdflinx.com",
                  applicationCategory: "UtilityApplication",
                  operatingSystem: "All",
                  browserRequirements: "Requires JavaScript and a modern browser",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  description:
                    "Free online PDF tools to convert, merge, split, compress, protect, unlock, rotate, sign, watermark, and edit PDFs.",
                  featureList: [
                    "Merge PDF",
                    "Split PDF",
                    "Compress PDF",
                    "Protect PDF",
                    "Unlock PDF",
                    "Rotate PDF",
                    "Sign PDF",
                    "Edit PDF",
                    "OCR PDF",
                    "Add Watermark",
                    "PDF to Word",
                    "Word to PDF",
                    "Excel to PDF",
                    "PowerPoint to PDF",
                    "JPG to PDF",
                    "Image to PDF",
                    "PDF to JPG",
                  ],
                  creator: {
                    "@type": "Organization",
                    name: "PDF Linx",
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://pdflinx.com/",
                    },
                  ],
                },
              ],
            })

          }}
        />

        <HistatsTracker />

        <noscript style={{ display: "none" }}>
          <img
            src="//sstatic1.histats.com/0.gif?4996996&101"
            alt="Website visitor tracking pixel"
            width="0"
            height="0"
            aria-hidden="true"
          />
        </noscript>
      </body>
    </html>
  );
}


