"use client";

import CompressPDF from "@/app/compress-pdf/CompressPdfClient";

export default function EmbedCompressPdf() {
  return (
    <div style={{ padding: "10px", background: "#fff" }}>
      <CompressPDF />

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          marginTop: "10px",
        }}
      >
        Powered by{" "}
        <a
          href="https://pdflinx.com/compress-pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#6C5CE7", fontWeight: "600" }}
        >
          PDFLinx
        </a>
      </div>
    </div>
  );
}




















// "use client";

// import CompressPdf from "@/components/tools/CompressPdf";

// export default function EmbedCompressPdf() {
//   return (
//     <div style={{ padding: "10px", background: "#fff" }}>
      
//       {/* Tool */}
//       <CompressPdf />

//       {/* Branding */}
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "12px",
//           marginTop: "10px",
//         }}
//       >
//         Powered by{" "}
//         <a
//           href="https://pdflinx.com"
//           target="_blank"
//           style={{ color: "#6C5CE7", fontWeight: "600" }}
//         >
//           PDFLinx
//         </a>
//       </div>

//     </div>
//   );
// }