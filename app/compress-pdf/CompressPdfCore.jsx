// app/compress-pdf/CompressPdfCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState, useRef } from "react";
import { FileDown, Download, CheckCircle } from "lucide-react";

export default function CompressPdfCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));

  const handleCompress = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select PDF file(s) first");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/compress-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
        // Auto-scroll to download button
        setTimeout(() => {
          const el = document.getElementById("core-download-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      } else {
        alert("Compression failed: " + (data.error || "Try again"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length > 1
        ? "compressed-files.zip"
        : files[0].name.replace(/\.pdf$/i, "-compressed.pdf");
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: compact ? "14px 12px" : "20px 16px",
      background: "#fff",
    }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <h2 style={{
          fontSize: compact ? "15px" : "18px",
          fontWeight: "700",
          background: "linear-gradient(90deg, #2563eb, #16a34a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px 0",
        }}>
          Compress PDF Online (Free)
        </h2>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
          No signup · No watermark · Files deleted after 1 hour
        </p>
      </div>

      <form onSubmit={handleCompress}>
        {/* Upload Area */}
        <label style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
          <div style={{
            border: `2px dashed ${files.length > 0 ? "#16a34a" : "#cbd5e1"}`,
            borderRadius: "12px",
            padding: "24px 16px",
            textAlign: "center",
            background: files.length > 0 ? "#f0fdf4" : "#f8fafc",
            transition: "all 0.2s",
          }}>
            <FileDown style={{
              width: 32, height: 32,
              margin: "0 auto 8px",
              color: files.length > 0 ? "#16a34a" : "#2563eb",
              display: "block"
            }} />

            <p style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#334155",
              margin: "0 0 4px 0"
            }}>
              {files.length === 0
                ? "Drop your PDF here or click to upload"
                : `${files.length} PDF(s) selected`}
            </p>

            {files.length > 0 && (
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "6px 0 0 0",
                textAlign: "left",
              }}>
                {files.map((f) => (
                  <li key={f.name} style={{
                    fontSize: "11px",
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>• {f.name}</li>
                ))}
              </ul>
            )}

            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>
              Up to 15 PDFs · Max 25MB each
            </p>
          </div>

          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </label>

        {/* Compress Button */}
        <button
          type="submit"
          disabled={loading || files.length === 0}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: loading || files.length === 0
              ? "#e2e8f0"
              : "linear-gradient(90deg, #2563eb, #16a34a)",
            color: loading || files.length === 0 ? "#94a3b8" : "#fff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
            letterSpacing: "0.3px",
          }}
        >
          <FileDown style={{ width: 16, height: 16 }} />
          {loading ? "Compressing... please wait" : "Compress PDF"}
        </button>
      </form>

      {/* Success State */}
      {success && (
        <div id="core-download-section" style={{
          marginTop: "14px",
          padding: "16px",
          background: "#f0fdf4",
          border: "1.5px solid #bbf7d0",
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
            Done! PDF is smaller now 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
            Ready to send or upload anywhere
          </p>
          <button
            onClick={handleDownload}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Download Compressed PDF
          </button>
        </div>
      )}
    </div>
  );
}





















// // app/compress-pdf/CompressPdfCore.jsx
// // Sirf tool ka core part - embed ke liye

// "use client";
// import { useState, useRef } from "react";
// import { FileDown, Download, CheckCircle } from "lucide-react";

// export default function CompressPdfCore() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [success, setSuccess] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));

//   const handleCompress = async (e) => {
//     e.preventDefault();
//     if (!files.length) return alert("Please select PDF file(s) first");

//     setLoading(true);
//     setDownloadUrl("");
//     setSuccess(false);

//     const formData = new FormData();
//     files.forEach((f) => formData.append("files", f));

//     try {
//       const res = await fetch("/convert/compress-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         setDownloadUrl(`/api${data.download}`);
//         setSuccess(true);
//       } else {
//         alert("Compression failed: " + (data.error || "Try again"));
//       }
//     } catch (error) {
//       alert("Something went wrong. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!downloadUrl) return;
//     try {
//       const res = await fetch(downloadUrl);
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = files.length > 1
//         ? "compressed-files.zip"
//         : files[0].name.replace(/\.pdf$/i, "-compressed.pdf");
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert("Download failed");
//     }
//   };

//   return (
//     <div style={{
//       fontFamily: "'DM Sans', system-ui, sans-serif",
//       padding: "20px 16px",
//       background: "#fff",
//     }}>
//       {/* Heading */}
//       <div style={{ textAlign: "center", marginBottom: "16px" }}>
//         <h2 style={{
//           fontSize: "18px",
//           fontWeight: "700",
//           background: "linear-gradient(90deg, #2563eb, #16a34a)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           margin: "0 0 4px 0",
//         }}>
//           Compress PDF Online (Free)
//         </h2>
//         <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
//           No signup · No watermark · Files deleted after 1 hour
//         </p>
//       </div>

//       <form onSubmit={handleCompress}>
//         {/* Upload Area */}
//         <label style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
//           <div style={{
//             border: `2px dashed ${files.length > 0 ? "#16a34a" : "#cbd5e1"}`,
//             borderRadius: "12px",
//             padding: "24px 16px",
//             textAlign: "center",
//             background: files.length > 0 ? "#f0fdf4" : "#f8fafc",
//             transition: "all 0.2s",
//           }}>
//             <FileDown style={{
//               width: 32, height: 32,
//               margin: "0 auto 8px",
//               color: files.length > 0 ? "#16a34a" : "#2563eb",
//               display: "block"
//             }} />

//             <p style={{
//               fontSize: "14px",
//               fontWeight: "600",
//               color: "#334155",
//               margin: "0 0 4px 0"
//             }}>
//               {files.length === 0
//                 ? "Drop your PDF here or click to upload"
//                 : `${files.length} PDF(s) selected`}
//             </p>

//             {files.length > 0 && (
//               <ul style={{
//                 listStyle: "none",
//                 padding: 0,
//                 margin: "6px 0 0 0",
//                 textAlign: "left",
//               }}>
//                 {files.map((f) => (
//                   <li key={f.name} style={{
//                     fontSize: "11px",
//                     color: "#64748b",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap"
//                   }}>• {f.name}</li>
//                 ))}
//               </ul>
//             )}

//             <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>
//               Up to 15 PDFs · Max 25MB each
//             </p>
//           </div>

//           <input
//             type="file"
//             accept="application/pdf"
//             multiple
//             onChange={handleFileChange}
//             ref={fileInputRef}
//             style={{ display: "none" }}
//           />
//         </label>

//         {/* Compress Button */}
//         <button
//           type="submit"
//           disabled={loading || files.length === 0}
//           style={{
//             width: "100%",
//             padding: "13px",
//             borderRadius: "10px",
//             border: "none",
//             background: loading || files.length === 0
//               ? "#e2e8f0"
//               : "linear-gradient(90deg, #2563eb, #16a34a)",
//             color: loading || files.length === 0 ? "#94a3b8" : "#fff",
//             fontSize: "14px",
//             fontWeight: "700",
//             cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "8px",
//             transition: "all 0.2s",
//             letterSpacing: "0.3px",
//           }}
//         >
//           <FileDown style={{ width: 16, height: 16 }} />
//           {loading ? "Compressing... please wait" : "Compress PDF"}
//         </button>
//       </form>

//       {/* Success State */}
//       {success && (
//         <div style={{
//           marginTop: "14px",
//           padding: "16px",
//           background: "#f0fdf4",
//           border: "1.5px solid #bbf7d0",
//           borderRadius: "12px",
//           textAlign: "center",
//         }}>
//           <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
//           <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
//             Done! PDF is smaller now 🎉
//           </p>
//           <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
//             Ready to send or upload anywhere
//           </p>
//           <button
//             onClick={handleDownload}
//             style={{
//               background: "#16a34a",
//               color: "#fff",
//               border: "none",
//               padding: "10px 24px",
//               borderRadius: "8px",
//               fontWeight: "700",
//               fontSize: "13px",
//               cursor: "pointer",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             <Download style={{ width: 14, height: 14 }} />
//             Download Compressed PDF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }