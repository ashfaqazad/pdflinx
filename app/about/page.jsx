import AboutClient from "./AboutClient";

export const metadata = {
  title: "About PDF Linx - Privacy-First Free Online PDF Tools",
  description: "Learn about PDF Linx — a simple, fast, ad-free collection of free PDF tools (Convert, Merge, Split, Compress) built in browser for maximum privacy. Started as a weekend project in 2023.",
  // Optional extras for better SEO / social sharing (Open Graph)
  openGraph: {
    title: "About PDF Linx",
    description: "Privacy-focused free PDF tools. No sign-ups, no servers touching your files.",
    url: "https://pdflinx.com/about",
    siteName: "PDF Linx",
    images: [
      {
        url: "/og-image-about.png",  // Agar OG image bana hai to rakh, warna ye line hata dena ya blank chhod
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Canonical already tha, theek hai
  alternates: {
    canonical: "https://pdflinx.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}































// import AboutClient from "./AboutClient";

// export const metadata = {
//   metadataBase: new URL("https://pdflinx.com"),
//   alternates: {
//     canonical: "https://pdflinx.com/about",
//   },
// };

// export default function AboutPage() {
//   return <AboutClient />;
// }
