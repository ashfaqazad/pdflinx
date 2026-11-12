import AboutClient from "./AboutClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/breadcrumbSchema";

export const metadata = {
  title: { absolute: "About PDF Linx — Free, Privacy-First PDF Tools" },
  description: "PDF Linx is a simple, fast set of free PDF tools to convert, merge, split and compress files. Most tools run in your browser. Started in 2023.",
  // Optional extras for better SEO / social sharing (Open Graph)
  openGraph: {
    title: "About PDF Linx",
    description: "Privacy-focused free PDF tools. No sign-ups, no servers touching your files.",
    url: "https://pdflinx.com/about",
    siteName: "PDF Linx",
    images: [
      {
        url: "/og/pdflinx-og.png",  // Agar OG image bana hai to rakh, warna ye line hata dena ya blank chhod
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
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <AboutClient />
    </>
  );
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
