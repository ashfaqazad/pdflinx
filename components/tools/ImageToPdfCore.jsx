// components/tools/ImageToPdfCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState } from "react";
import { Upload, Download, CheckCircle, X } from "lucide-react";

export default function ImageToPdfCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const invalid = selected.filter((f) => !allowed.includes(f.type));
    if (invalid.length > 0) {
      alert(`Only JPG, PNG, and WebP allowed.\nInvalid: ${invalid[0].name}`);
      e.target.value = "";
      return;
    }
    setFiles(selected);
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one image");

    setLoading(true);
    setDownloadUrl(null);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch("/convert/image-to-pdf", { method: "POST", body: formData });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { data = { success: false, error: text || "Internal Server Error" }; }

      if (!res.ok || !data?.success) {
        setError("Conversion failed: " + (data?.error || `HTTP ${res.status}`));
        return;
      }

      setDownloadUrl(data.download);
      setSuccess(true);
      setTimeout(() => {
        const el = document.getElementById("img-pdf-download");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);

    } catch (err) {
      setError("Something went wrong. Please try again.");
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
      a.download = files.length === 1
        ? files[0].name.replace(/\.[^/.]+$/, ".pdf")
        : "images-converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
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
          background: "linear-gradient(90deg, #9333ea, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px 0",
        }}>
          JPG / Image to PDF (Free)
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
              margin: "0 auto 6px", color: files.length > 0 ? "#16a34a" : "#9333ea",
              display: "block",
            }} />
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
              {files.length > 0
                ? `${files.length} image(s) ready`
                : "Drop images here or click to upload"}
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              JPG, PNG, WebP · Up to 50 images
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Image Previews (only in non-compact) */}
        {!compact && files.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            maxHeight: "140px",
            overflowY: "auto",
            padding: "8px",
            background: "#f8fafc",
            borderRadius: "10px",
            marginBottom: "10px",
          }}>
            {files.map((file, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{
                    position: "absolute", top: "2px", right: "2px",
                    background: "#ef4444", border: "none", borderRadius: "50%",
                    width: "16px", height: "16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <X style={{ width: 10, height: 10, color: "#fff" }} />
                </button>
              </div>
            ))}
          </div>
        )}

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
              : "linear-gradient(90deg, #9333ea, #ec4899)",
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
          <Upload style={{ width: 16, height: 16 }} />
          {loading ? "Converting images..." : "Convert to PDF"}
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
        <div id="img-pdf-download" style={{
          marginTop: "14px", padding: "16px",
          background: "#f0fdf4", border: "1.5px solid #bbf7d0",
          borderRadius: "12px", textAlign: "center",
        }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#16a34a", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontWeight: "700", color: "#15803d", margin: "0 0 4px 0", fontSize: "14px" }}>
            All done! Your PDF is ready 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
            Images combined into one clean PDF
          </p>
          <button
            onClick={handleDownload}
            style={{
              background: "#16a34a", color: "#fff", border: "none",
              padding: "10px 24px", borderRadius: "8px",
              fontWeight: "700", fontSize: "13px", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}