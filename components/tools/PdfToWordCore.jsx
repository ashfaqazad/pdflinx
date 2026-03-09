// app/[tool]/PdfToWordCore.jsx
// Sirf tool ka core part - embed ke liye

"use client";
import { useState } from "react";
import { Upload, FileText, Download, CheckCircle } from "lucide-react";

export default function PdfToWordCore({ compact = false }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [enableOcr, setEnableOcr] = useState(false);

  // ── Helpers ──────────────────────────────────────────────
  const fetchJson = async (url, options) => {
    const r = await fetch(url, { cache: "no-store", ...options });
    const ct = r.headers.get("content-type") || "";
    let payload = null;
    if (ct.includes("json")) { try { payload = await r.json(); } catch {} }
    if (!r.ok) {
      const msg = payload?.detail || payload?.error || `Request failed ${r.status}`;
      const err = new Error(msg);
      err.status = r.status;
      throw err;
    }
    return payload ?? {};
  };

  const downloadViaBlob = async (url, filenameFallback) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Download failed ${r.status}`);
    const blob = await r.blob();
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    const cd = r.headers.get("content-disposition") || "";
    const match = cd.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
    a.download = match ? decodeURIComponent(match[1]) : filenameFallback;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };

  const getJobStatus = async (jobId) => {
    try { return await fetchJson(`/api/convert/job/${jobId}`); }
    catch (err) {
      if (err?.status === 404) return await fetchJson(`/convert/job/${jobId}`);
      throw err;
    }
  };

  const downloadResult = async (jobId) => {
    try {
      await downloadViaBlob(`/api/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
    } catch (err) {
      await downloadViaBlob(`/convert/download/${jobId}`, "pdflinx-pdf-to-word.docx");
    }
  };
  // ─────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please select at least one PDF file");

    setLoading(true);
    setSuccess(false);
    setError("");
    setProgress(0);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("enable_ocr", enableOcr ? "1" : "0");

    const startedAt = Date.now();
    const maxWaitMs = 15 * 60 * 1000;
    const pollIntervalMs = 1500;
    let stopped = false;

    const poll = async (jobId) => {
      if (stopped) return;
      if (Date.now() - startedAt > maxWaitMs) {
        setLoading(false);
        setError("Conversion timeout. Please try again.");
        return;
      }
      try {
        const statusData = await getJobStatus(jobId);
        const status = statusData?.status;
        if (status === "queued") { setProgress(0); }
        else if (status === "processing") { setProgress(statusData?.progress ?? 10); }
        else if (status === "done") {
          setProgress(100);
          setFiles([]);
          await downloadResult(jobId);
          setSuccess(true);
          setLoading(false);
          return;
        } else if (status === "failed") {
          setLoading(false);
          setError(statusData?.error || "Conversion failed on server");
          return;
        } else { setProgress((p) => Math.max(p, 5)); }
        setTimeout(() => poll(jobId), pollIntervalMs);
      } catch (err) {
        setLoading(false);
        setError(err?.message || "Polling failed");
      }
    };

    try {
      const res = await fetch("/convert/pdf-to-word", { method: "POST", body: formData });
      const ct = res.headers.get("content-type") || "";

      if (!res.ok) {
        let msg = `Server error ${res.status}`;
        if (ct.includes("json")) { try { const e = await res.json(); msg = e.detail || e.error || msg; } catch {} }
        throw new Error(msg);
      }

      // ZIP directly
      if (ct.includes("zip")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "pdflinx-pdf-to-word.zip";
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        setProgress(100); setSuccess(true); setFiles([]); setLoading(false);
        return;
      }

      // JSON job
      const data = await res.json();
      const jobId = data?.jobId;
      if (!jobId) throw new Error("Job ID not received from server");
      poll(jobId);

    } catch (err) {
      stopped = true;
      setLoading(false);
      setError(err?.message || "Something went wrong");
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
          PDF to Word Converter (Free)
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
              display: "block"
            }} />
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
              {files.length > 0 ? `${files.length} file(s) selected` : "Drop PDF file(s) here or click to upload"}
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              Single PDF → DOCX · Multiple PDFs → ZIP
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            style={{ display: "none" }}
          />
        </label>

        {/* OCR Toggle */}
        <label style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: "10px",
          cursor: "pointer",
          padding: "8px 10px",
          background: enableOcr ? "#eff6ff" : "#f8fafc",
          borderRadius: "8px",
          border: `1px solid ${enableOcr ? "#93c5fd" : "#e2e8f0"}`,
          transition: "all 0.2s",
        }}>
          <input
            type="checkbox"
            checked={enableOcr}
            onChange={(e) => setEnableOcr(e.target.checked)}
            style={{ marginTop: "2px", accentColor: "#2563eb" }}
          />
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#334155", margin: "0 0 2px 0" }}>
              Enable OCR (for scanned/image PDFs)
            </p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              Extracts text from scanned PDFs · May take longer
            </p>
          </div>
        </label>

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{
              background: "#e2e8f0", borderRadius: "99px",
              height: "6px", overflow: "hidden",
            }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: "linear-gradient(90deg, #2563eb, #16a34a)",
                borderRadius: "99px",
                transition: "width 0.4s ease",
              }} />
            </div>
            <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", margin: "4px 0 0 0" }}>
              Converting... {progress}%
            </p>
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
          {loading ? "Converting... please wait" : "Convert to Word"}
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
            Check your Downloads folder for the DOCX file
          </p>
        </div>
      )}
    </div>
  );
}