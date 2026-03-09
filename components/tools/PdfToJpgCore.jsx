// components/tools/PdfToJpgCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, Image as ImageIcon } from "lucide-react";

export default function PdfToJpgCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length === 0) return;
    setFiles(selected);
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one PDF file!");

    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/pdf-to-jpg", { method: "POST", body: formData });

      if (!res.ok) {
        const errText = await res.text();
        setError("Conversion failed: " + errText);
        return;
      }

      const blob = await res.blob();
      const contentType = res.headers.get("content-type") || "";
      const disposition = res.headers.get("content-disposition") || "";

      let filename = "converted_file";
      if (disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      } else if (files.length === 1) {
        filename = files[0].name.replace(/\.pdf$/i, contentType.includes("image") ? ".jpg" : "_jpgs.zip");
      } else {
        filename = "pdf_to_jpg_batch.zip";
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          background: "linear-gradient(90deg, #ea580c, #d97706)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px 0",
        }}>
          PDF to JPG Converter (Free)
        </h2>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
          No signup · No watermark · Files deleted after 1 hour
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Upload Area */}
        <label style={{ display: "block", cursor: "pointer", marginBottom: "10px" }}>
          <div style={{
            border: `2px dashed ${files.length > 0 ? "#16a34a" : "#cbd5e1"}`,
            borderRadius: "12px",
            padding: compact ? "16px 12px" : "20px 16px",
            textAlign: "center",
            background: files.length > 0 ? "#f0fdf4" : "#f8fafc",
            transition: "all 0.2s",
          }}>
            <Upload style={{
              width: compact ? 22 : 26, height: compact ? 22 : 26,
              margin: "0 auto 6px", color: files.length > 0 ? "#16a34a" : "#ea580c",
              display: "block",
            }} />
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
              {files.length > 0
                ? `${files.length} PDF file(s) selected`
                : "Drop PDF file(s) here or click to upload"}
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              1 page → JPG · Multiple pages → ZIP
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Convert Button */}
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
              : "linear-gradient(90deg, #ea580c, #d97706)",
            color: loading || files.length === 0 ? "#94a3b8" : "#fff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <ImageIcon style={{ width: 16, height: 16 }} />
          {loading ? "Converting... please wait" : "Convert to JPG"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: "12px", padding: "10px 14px",
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "8px", fontSize: "12px", color: "#dc2626",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div style={{
          marginTop: "14px", padding: "16px",
          background: "#f0fdf4", border: "1.5px solid #bbf7d0",
          borderRadius: "12px", textAlign: "center",
        }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
            Done! Download started automatically 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            {files.length === 1
              ? "Single page → JPG · Multi-page → ZIP file"
              : "Check your Downloads folder for the ZIP"}
          </p>
        </div>
      )}
    </div>
  );
}