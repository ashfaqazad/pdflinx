// components/tools/WordToPdfCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function WordToPdfCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select a Word file first!");

    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    for (const f of files) formData.append("files", f);

    try {
      const res = await fetch("/convert/word-to-pdf", { method: "POST", body: formData });

      if (!res.ok) {
        let msg = "Conversion failed";
        try { const j = await res.json(); msg = j?.error || msg; } catch {}
        throw new Error(msg);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      // Single → PDF
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = files[0].name.replace(/\.(doc|docx)$/i, ".pdf");
        document.body.appendChild(a); a.click(); a.remove();
        window.URL.revokeObjectURL(url);
        setSuccess(true); setFiles([]);
        return;
      }

      // Multiple → ZIP
      if (contentType.includes("zip") || contentType.includes("octet-stream")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "pdflinx-word-to-pdf.zip";
        document.body.appendChild(a); a.click(); a.remove();
        window.URL.revokeObjectURL(url);
        setSuccess(true); setFiles([]);
        return;
      }

      throw new Error("Unexpected response from server.");
    } catch (err) {
      setError(err.message || "Something went wrong, please try again.");
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
          background: "linear-gradient(90deg, #2563eb, #16a34a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px 0",
        }}>
          Word to PDF Converter (Free)
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
              margin: "0 auto 6px", color: files.length > 0 ? "#16a34a" : "#2563eb",
              display: "block",
            }} />
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Drop Word file(s) here or click to upload"}
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              .doc & .docx · Single → PDF · Multiple → ZIP
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
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
          }}
        >
          <FileText style={{ width: 16, height: 16 }} />
          {loading ? "Converting... hang tight!" : "Convert to PDF"}
        </button>

        {/* Notice */}
        {!compact && (
          <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", margin: "8px 0 0 0" }}>
            ⏱️ Multiple files may take up to 1 min · Please don't close this tab
          </p>
        )}
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
            Done! File downloaded automatically 🎉
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Check your Downloads folder for the PDF
          </p>
        </div>
      )}
    </div>
  );
}