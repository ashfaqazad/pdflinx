// app/embed/compress-pdf/page.jsx
// ?compact=true URL param se sidebar mode activate hoga

import CompressPdfCore from "@/app/compress-pdf/CompressPdfCore";

export const metadata = {
  title: "Compress PDF - PDFLinx",
  robots: "noindex",
};

export default function EmbedCompressPDF({ searchParams }) {
  const isCompact = searchParams?.compact === "true";

  return (
    <>
      <CompressPdfCore compact={isCompact} />
      <div style={{
        textAlign: "center",
        padding: "8px",
        borderTop: "1px solid #f1f5f9"
      }}>
        <a
          href="https://pdflinx.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#94a3b8", fontSize: "11px", textDecoration: "none" }}
        >
          🔗 Powered by PDFLinx.com
        </a>
      </div>
    </>
  );
}




















// // app/embed/compress-pdf/page.jsx

// import CompressPdfCore from "@/app/compress-pdf/CompressPdfCore";

// export const metadata = {
//   title: "Compress PDF - PDFLinx",
//   robots: "noindex",
// };

// export default function EmbedCompressPDF() {
//   return (
//     <>
//       <CompressPdfCore />
//       <div style={{
//         textAlign: "center",
//         padding: "10px",
//         borderTop: "1px solid #f1f5f9"
//       }}>
//         <a
//           href="https://pdflinx.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ color: "#94a3b8", fontSize: "11px", textDecoration: "none" }}
//         >
//           🔗 Powered by PDFLinx.com
//         </a>
//       </div>
//     </>
//   );
// }





















// // // app/embed/compress-pdf/page.jsx

// // import CompressPDF from "@/app/compress-pdf/CompressPdfClient";

// // export const metadata = {
// //   title: "Compress PDF - PDFLinx",
// //   robots: "noindex",
// // };

// // export default function EmbedCompressPDF() {
// //   return (
// //     <div style={{
// //       minHeight: "100vh",
// //       background: "#ffffff",
// //       padding: "24px 16px",
// //     }}>
// //       <CompressPDF />

// //       <div style={{
// //         textAlign: "center",
// //         marginTop: "16px",
// //         paddingTop: "12px",
// //         borderTop: "1px solid #f1f5f9"
// //       }}>
// //         <a
// //           href="https://pdflinx.com"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //           style={{
// //             color: "#94a3b8",
// //             fontSize: "11px",
// //             textDecoration: "none",
// //           }}
// //         >
// //           🔗 Powered by PDFLinx.com
// //         </a>
// //       </div>
// //     </div>
// //   );
// // }


















// // // // app/embed/compress-pdf/page.jsx
// // // // Ya pages/embed/compress-pdf.jsx - Next.js structure ke hisaab se use karo

// // // // IMPORTANT: Yeh page header/footer ke BAHAR hona chahiye
// // // // RootLayout mein Header/Footer conditionally hide karo:
// // // //
// // // // layout.jsx mein:
// // // // const pathname = usePathname()
// // // // const isEmbed = pathname.startsWith('/embed')
// // // // {!isEmbed && <Header />}
// // // // {!isEmbed && <Footer />}

// // // import CompressPDFTool from "@/components/tools/CompressPDFTool"; // tera existing tool component

// // // export const metadata = {
// // //   title: "Compress PDF - PDFLinx",
// // //   robots: "noindex", // embed pages index nahi hongi
// // // };

// // // export default function EmbedCompressPDF() {
// // //   return (
// // //     <div style={{
// // //       minHeight: "100vh",
// // //       background: "#ffffff",
// // //       padding: "24px 16px",
// // //       fontFamily: "inherit"
// // //     }}>
// // //       {/* Sirf tool render karo - koi aur cheez nahi */}
// // //       <CompressPDFTool embedMode={true} />

// // //       {/* Subtle branding - bottom mein */}
// // //       <div style={{
// // //         textAlign: "center",
// // //         marginTop: "16px",
// // //         paddingTop: "12px",
// // //         borderTop: "1px solid #f1f5f9"
// // //       }}>
// // //         <a
// // //           href="https://pdflinx.com"
// // //           target="_blank"
// // //           rel="noopener noreferrer"
// // //           style={{
// // //             color: "#94a3b8",
// // //             fontSize: "11px",
// // //             textDecoration: "none",
// // //             display: "inline-flex",
// // //             alignItems: "center",
// // //             gap: "4px"
// // //           }}
// // //         >
// // //           🔗 Powered by PDFLinx.com
// // //         </a>
// // //       </div>
// // //     </div>
// // //   );
// // // }



















// // // // "use client";

// // // // import CompressPDF from "@/app/compress-pdf/CompressPdfClient";

// // // // export default function EmbedCompressPdf() {
// // // //   return (
// // // //     <div style={{ padding: "10px", background: "#fff" }}>
// // // //       <CompressPDF />

// // // //       <div
// // // //         style={{
// // // //           textAlign: "center",
// // // //           fontSize: "12px",
// // // //           marginTop: "10px",
// // // //         }}
// // // //       >
// // // //         Powered by{" "}
// // // //         <a
// // // //           href="https://pdflinx.com/compress-pdf"
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //           style={{ color: "#6C5CE7", fontWeight: "600" }}
// // // //         >
// // // //           PDFLinx
// // // //         </a>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }




















// // // // // "use client";

// // // // // import CompressPdf from "@/components/tools/CompressPdf";

// // // // // export default function EmbedCompressPdf() {
// // // // //   return (
// // // // //     <div style={{ padding: "10px", background: "#fff" }}>
      
// // // // //       {/* Tool */}
// // // // //       <CompressPdf />

// // // // //       {/* Branding */}
// // // // //       <div
// // // // //         style={{
// // // // //           textAlign: "center",
// // // // //           fontSize: "12px",
// // // // //           marginTop: "10px",
// // // // //         }}
// // // // //       >
// // // // //         Powered by{" "}
// // // // //         <a
// // // // //           href="https://pdflinx.com"
// // // // //           target="_blank"
// // // // //           style={{ color: "#6C5CE7", fontWeight: "600" }}
// // // // //         >
// // // // //           PDFLinx
// // // // //         </a>
// // // // //       </div>

// // // // //     </div>
// // // // //   );
// // // // // }