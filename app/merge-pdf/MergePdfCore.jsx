// app/merge-pdf/MergePdfCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState, useRef } from "react";
import { Files, FileText, X, Upload, Download, CheckCircle } from "lucide-react";

export default function MergePdfCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) setFiles(selected);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async (e) => {
    e.preventDefault();
    if (files.length < 2) return alert("Please select at least 2 PDF files to merge.");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/convert/merge-pdf", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
        setTimeout(() => {
          const el = document.getElementById("merge-core-download");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      } else {
        alert("Merge failed: " + (data.error || "Try again"));
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
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
      a.download = "merged-pdf.pdf";
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
          background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px 0",
        }}>
          Merge PDF Files Online (Free)
        </h2>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
          No signup · No watermark · Files deleted after 1 hour
        </p>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${files.length > 0 ? "#16a34a" : "#cbd5e1"}`,
          borderRadius: "12px",
          padding: compact ? "16px 12px" : "20px 16px",
          textAlign: "center",
          background: files.length > 0 ? "#f0fdf4" : "#f8fafc",
          cursor: "pointer",
          marginBottom: "10px",
          transition: "all 0.2s",
        }}
      >
        <Files style={{
          width: compact ? 24 : 28,
          height: compact ? 24 : 28,
          margin: "0 auto 6px",
          color: files.length > 0 ? "#16a34a" : "#4f46e5",
          display: "block"
        }} />
        <p style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
          {files.length === 0
            ? "Drop PDFs here or click to upload"
            : `${files.length} PDF${files.length > 1 ? "s" : ""} selected`}
        </p>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
          Select 2 or more PDF files
        </p>
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>

      {/* File List - compact grid */}
      {files.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "6px",
          marginBottom: "10px",
          maxHeight: compact ? "80px" : "100px",
          overflowY: "auto",
          padding: "8px",
          background: "#f8fafc",
          borderRadius: "10px",
        }}>
          {files.map((file, index) => (
            <div key={index} style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid #e2e8f0",
              position: "relative",
            }}>
              <FileText style={{ width: 14, height: 14, color: "#4f46e5", flexShrink: 0 }} />
              <span style={{
                fontSize: "10px",
                color: "#475569",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}>
                {file.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{
                  background: "#fee2e2",
                  border: "none",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <X style={{ width: 10, height: 10, color: "#ef4444" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Merge Button */}
      <button
        onClick={handleMerge}
        disabled={loading || files.length < 2}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: "10px",
          border: "none",
          background: loading || files.length < 2
            ? "#e2e8f0"
            : "linear-gradient(90deg, #4f46e5, #7c3aed)",
          color: loading || files.length < 2 ? "#94a3b8" : "#fff",
          fontSize: "14px",
          fontWeight: "700",
          cursor: loading || files.length < 2 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
      >
        <Upload style={{ width: 16, height: 16 }} />
        {loading ? "Merging... please wait" : "Merge PDFs Now"}
      </button>

      {/* Success State */}
      {success && (
        <div id="merge-core-download" style={{
          marginTop: "14px",
          padding: "16px",
          background: "#f0fdf4",
          border: "1.5px solid #bbf7d0",
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
            Done! PDFs merged successfully 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
            Your combined PDF is ready
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
            Download Merged PDF
          </button>
        </div>
      )}
    </div>
  );
}