// app/split-pdf/SplitPdfCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState, useRef } from "react";
import { Scissors, Download, CheckCircle } from "lucide-react";

export default function SplitPdfCore({ compact = false }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setDownloadUrl("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/convert/split-pdf", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
        setSuccess(true);
        setTimeout(() => {
          const el = document.getElementById("split-core-download");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      } else {
        alert("Split failed: " + (data.error || "Try again"));
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
      a.download = file
        ? file.name.replace(/\.pdf$/i, "-split-pages.zip")
        : "split-pages.zip";
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
          Split PDF Online (Free)
        </h2>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
          No signup · No watermark · Files deleted after 1 hour
        </p>
      </div>

      <form onSubmit={handleSplit}>
        {/* Upload Area */}
        <label style={{ display: "block", cursor: "pointer", marginBottom: "12px" }}>
          <div style={{
            border: `2px dashed ${file ? "#16a34a" : "#cbd5e1"}`,
            borderRadius: "12px",
            padding: compact ? "18px 12px" : "24px 16px",
            textAlign: "center",
            background: file ? "#f0fdf4" : "#f8fafc",
            transition: "all 0.2s",
          }}>
            <Scissors style={{
              width: compact ? 24 : 28,
              height: compact ? 24 : 28,
              margin: "0 auto 8px",
              color: file ? "#16a34a" : "#2563eb",
              display: "block",
            }} />
            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#334155",
              margin: "0 0 4px 0",
            }}>
              {file ? file.name : "Drop your PDF here or click to upload"}
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              We'll split it page by page instantly
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </label>

        {/* Split Button */}
        <button
          type="submit"
          disabled={loading || !file}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "none",
            background: loading || !file
              ? "#e2e8f0"
              : "linear-gradient(90deg, #2563eb, #16a34a)",
            color: loading || !file ? "#94a3b8" : "#fff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading || !file ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <Scissors style={{ width: 16, height: 16 }} />
          {loading ? "Splitting... please wait" : "Split PDF"}
        </button>
      </form>

      {/* Success State */}
      {success && (
        <div id="split-core-download" style={{
          marginTop: "14px",
          padding: "16px",
          background: "#f0fdf4",
          border: "1.5px solid #bbf7d0",
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
            Done! PDF split successfully 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
            All pages packed in a ZIP file
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
            Download ZIP File
          </button>
        </div>
      )}
    </div>
  );
}