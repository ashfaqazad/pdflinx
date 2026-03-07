import ContactClient from "./ContactClient";  // Ya ContactClient.jsx jo bhi naam rakha tune

export const metadata = {
  title: "Contact PDF Linx - Support and Feedback for Free PDF Tools",
  description: "Questions, suggestions, bug reports or just saying hi? Use the form or email support@pdflinx.com. Fast replies from the solo dev behind PDF Linx.",

  openGraph: {
    title: "Contact PDF Linx",
    description: "Get in touch for help, ideas, or feedback on free online PDF tools.",
    url: "https://pdflinx.com/contact",
    siteName: "PDF Linx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  alternates: {
    canonical: "https://pdflinx.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}