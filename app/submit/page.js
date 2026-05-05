"use client";
import { useState, useRef } from "react";

// const PASSWORD = "pdflinx2024"; // <-- Yahan apna password rakho

export default function SubmitPage() {
//   const [authed, setAuthed] = useState(false);
//   const [passInput, setPassInput] = useState("");
//   const [passError, setPassError] = useState(false);

  const [keyJson, setKeyJson] = useState(null);
  const [keyFileName, setKeyFileName] = useState("");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [done, setDone] = useState(false);
  const fileRef = useRef();

  const URLS = [
    "https://pdflinx.com/",
    "https://pdflinx.com/blog",
    "https://pdflinx.com/free-pdf-tools",
    "https://pdflinx.com/about",
    "https://pdflinx.com/contact",
    "https://pdflinx.com/privacy-policy",
    "https://pdflinx.com/terms-and-conditions",
    "https://pdflinx.com/embed-code",
    "https://pdflinx.com/compare/pdflinx-vs-ilovepdf",
    "https://pdflinx.com/compare/pdflinx-vs-smallpdf",
    "https://pdflinx.com/pdf-to-word",
    "https://pdflinx.com/pdf-to-word-for-students",
    "https://pdflinx.com/word-to-pdf",
    "https://pdflinx.com/image-to-pdf",
    "https://pdflinx.com/compress-pdf",
    "https://pdflinx.com/merge-pdf",
    "https://pdflinx.com/split-pdf",
    "https://pdflinx.com/excel-pdf",
    "https://pdflinx.com/pdf-to-jpg",
    "https://pdflinx.com/ppt-to-pdf",
    "https://pdflinx.com/protect-pdf",
    "https://pdflinx.com/unlock-pdf",
    "https://pdflinx.com/rotate-pdf",
    "https://pdflinx.com/sign-pdf",
    "https://pdflinx.com/ocr-pdf",
    "https://pdflinx.com/edit-pdf",
    "https://pdflinx.com/add-watermark",
    "https://pdflinx.com/pdf-to-excel",
    "https://pdflinx.com/compress-pdf-savings-calculator",
    "https://pdflinx.com/remove-pages",
    "https://pdflinx.com/add-page-numbers",
    "https://pdflinx.com/html-to-pdf",
    "https://pdflinx.com/pdf-to-png",
    "https://pdflinx.com/pdf-to-text",
    "https://pdflinx.com/text-to-pdf",
    "https://pdflinx.com/blog/pdf-to-word",
    "https://pdflinx.com/blog/word-to-pdf",
    "https://pdflinx.com/blog/image-to-pdf",
    "https://pdflinx.com/blog/merge-pdf",
    "https://pdflinx.com/blog/split-pdf",
    "https://pdflinx.com/blog/compress-pdf",
    "https://pdflinx.com/blog/excel-pdf",
    "https://pdflinx.com/blog/pdf-to-jpg",
    "https://pdflinx.com/blog/ppt-to-pdf",
    "https://pdflinx.com/blog/protect-pdf",
    "https://pdflinx.com/blog/unlock-pdf",
    "https://pdflinx.com/blog/rotate-pdf",
    "https://pdflinx.com/blog/sign-pdf",
    "https://pdflinx.com/blog/ocr-pdf",
    "https://pdflinx.com/blog/edit-pdf",
    "https://pdflinx.com/blog/add-watermark",
    "https://pdflinx.com/blog/pdf-to-word-formatting-messed-up",
    "https://pdflinx.com/blog/how-to-edit-scanned-pdf-in-word",
    "https://pdflinx.com/blog/convert-pdf-resume-to-editable-word",
    "https://pdflinx.com/blog/best-tools-for-students",
    "https://pdflinx.com/blog/best-free-image-converter-tools",
    "https://pdflinx.com/blog/how-to-convert-chatgpt-pdf-to-word",
    "https://pdflinx.com/blog/pdf-file-too-large-compress",
    "https://pdflinx.com/blog/freelancer-edit-pdf-free",
    "https://pdflinx.com/blog/pdf-not-editable-fix",
    "https://pdflinx.com/blog/how-to-convert-word-to-pdf",
    "https://pdflinx.com/blog/convert-word-to-pdf-without-losing-formatting",
    "https://pdflinx.com/blog/word-to-pdf-on-mobile",
    "https://pdflinx.com/blog/word-to-pdf-not-working-fix",
    "https://pdflinx.com/blog/why-formatting-breaks-in-word-to-pdf",
    "https://pdflinx.com/blog/free-vs-paid-word-to-pdf-tools",
    "https://pdflinx.com/blog/word-to-pdf-for-students",
    "https://pdflinx.com/blog/how-to-compress-a-pdf",
    "https://pdflinx.com/blog/compress-pdf-without-losing-quality",
    "https://pdflinx.com/blog/compress-pdf-on-mobile",
    "https://pdflinx.com/blog/pdf-still-too-large-after-compression",
    "https://pdflinx.com/blog/why-are-pdf-files-so-large",
    "https://pdflinx.com/blog/how-small-should-i-compress-my-pdf",
  ];

//   function handleLogin() {
//     if (passInput === PASSWORD) {
//       setAuthed(true);
//       setPassError(false);
//     } else {
//       setPassError(true);
//     }
//   }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setKeyFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setKeyJson(parsed);
      } catch {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  }

  // JWT + token generation in browser using Web Crypto API
  async function getAccessToken(keyData) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: keyData.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    function b64url(obj) {
      return btoa(JSON.stringify(obj))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    }

    const signingInput = `${b64url(header)}.${b64url(payload)}`;

    // Import private key
    const pemContents = keyData.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\n/g, "");
    const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

    const cryptoKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const encoder = new TextEncoder();
    const signature = await window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      encoder.encode(signingInput)
    );

    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwt = `${signingInput}.${sigB64}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error(tokenData.error_description || "Token failed");
    return tokenData.access_token;
  }

  async function handleSubmit() {
    if (!keyJson) return alert("Pehle key.json upload karo!");
    setRunning(true);
    setDone(false);
    setLogs([]);
    setStats({ total: URLS.length, success: 0, failed: 0 });

    let token;
    try {
      token = await getAccessToken(keyJson);
    } catch (e) {
      setLogs([{ url: "AUTH", status: "error", msg: e.message }]);
      setRunning(false);
      return;
    }

    let success = 0;
    let failed = 0;
    const newLogs = [];

    for (let i = 0; i < URLS.length; i++) {
      const url = URLS[i];
      try {
        const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, type: "URL_UPDATED" }),
        });
        const data = await res.json();
        if (res.ok) {
          success++;
          newLogs.push({ url, status: "success", msg: "" });
        } else {
          failed++;
          newLogs.push({ url, status: "error", msg: data?.error?.message || "Failed" });
        }
      } catch (e) {
        failed++;
        newLogs.push({ url, status: "error", msg: e.message });
      }
      setLogs([...newLogs]);
      setStats({ total: URLS.length, success, failed });
    }

    setRunning(false);
    setDone(true);
  }

  // ---- UI ----

//   if (!authed) {
//     return (
//       <div style={styles.overlay}>
//         <div style={styles.loginBox}>
//           <div style={styles.lockIcon}>🔐</div>
//           <h2 style={styles.loginTitle}>Admin Access</h2>
//           <p style={styles.loginSub}>Google Indexer — pdflinx.com</p>
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={passInput}
//             onChange={(e) => setPassInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//             style={{ ...styles.input, borderColor: passError ? "#ef4444" : "#e2e8f0" }}
//           />
//           {passError && <p style={styles.errorText}>Wrong password!</p>}
//           <button onClick={handleLogin} style={styles.btn}>
//             Login
//           </button>
//         </div>
//       </div>
//     );
//   }

  const progress = stats.total > 0 ? Math.round(((stats.success + stats.failed) / stats.total) * 100) : 0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.headerIcon}>🔍</span>
          <div>
            <h1 style={styles.headerTitle}>Google Indexer Pro</h1>
            <p style={styles.headerSub}>pdflinx.com — Submit URLs directly to Google Indexing API</p>
          </div>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statBox}><div style={styles.statNum}>{URLS.length}</div><div style={styles.statLabel}>Total URLs</div></div>
          <div style={styles.statBox}><div style={{ ...styles.statNum, color: "#4ade80" }}>{stats.success}</div><div style={styles.statLabel}>Submitted</div></div>
          <div style={styles.statBox}><div style={{ ...styles.statNum, color: stats.failed > 0 ? "#f87171" : "#fff" }}>{stats.failed}</div><div style={styles.statLabel}>Errors</div></div>
        </div>
      </div>

      {/* Key Upload */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🔑 API Key Status</h3>
        {keyJson ? (
          <div style={styles.successBadge}>✅ {keyFileName} — Ready to submit!</div>
        ) : (
          <div>
            <div style={styles.infoBadge}>⚠️ Upload your key.json to proceed</div>
            <button onClick={() => fileRef.current.click()} style={styles.uploadBtn}>
              📂 Upload key.json
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
          </div>
        )}
      </div>

      {/* Submit */}
      <div style={styles.card}>
        <button
          onClick={handleSubmit}
          disabled={running || !keyJson}
          style={{ ...styles.submitBtn, opacity: running || !keyJson ? 0.6 : 1 }}
        >
          {running ? `⏳ Submitting... ${stats.success + stats.failed}/${stats.total}` : done ? "🔄 Run Again" : `🚀 Submit All ${URLS.length} URLs to Google`}
        </button>

        {(running || done) && (
          <>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <p style={styles.progressText}>
              {done ? `✅ Done! ${stats.success} submitted, ${stats.failed} failed.` : `Processing ${stats.success + stats.failed} of ${stats.total}...`}
            </p>
          </>
        )}
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Submission Log</h3>
          <div style={styles.logStatsRow}>
            <div style={styles.logStat("success")}>{stats.success}<br /><span style={styles.logStatLabel}>Success</span></div>
            <div style={styles.logStat("error")}>{stats.failed}<br /><span style={styles.logStatLabel}>Failed</span></div>
            <div style={styles.logStat("pending")}>{stats.total - stats.success - stats.failed}<br /><span style={styles.logStatLabel}>Pending</span></div>
          </div>
          <div style={styles.logList}>
            {logs.map((log, i) => (
              <div key={i} style={styles.logRow}>
                <span style={styles.logUrl}>{log.url}</span>
                <span
                  style={{
                    ...styles.logBadge,
                    background: log.status === "success" ? "#dcfce7" : "#fee2e2",
                    color: log.status === "success" ? "#16a34a" : "#dc2626"
                  }}>

                  {log.status === "success" ? "✓ SUCCESS" : `✗ ${log.msg}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" },
  loginBox: { background: "#fff", borderRadius: 16, padding: 40, width: 360, boxShadow: "0 4px 24px rgba(0,0,0,0.1)", textAlign: "center" },
  lockIcon: { fontSize: 48, marginBottom: 12 },
  loginTitle: { margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#1e293b" },
  loginSub: { margin: "0 0 24px", color: "#64748b", fontSize: 14 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 8 },
  errorText: { color: "#ef4444", fontSize: 13, margin: "0 0 8px" },
  btn: { width: "100%", padding: "12px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  page: { minHeight: "100vh", background: "#f1f5f9", padding: "32px 16px", maxWidth: 680, margin: "0 auto" },
  header: { background: "linear-gradient(135deg, #6d28d9, #4f46e5)", borderRadius: 16, padding: "28px 28px 20px", marginBottom: 20, color: "#fff" },
  headerInner: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
  headerIcon: { fontSize: 32 },
  headerTitle: { margin: 0, fontSize: 22, fontWeight: 700 },
  headerSub: { margin: "4px 0 0", fontSize: 13, opacity: 0.8 },
  statsRow: { display: "flex", gap: 12 },
  statBox: { background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 20px", textAlign: "center" },
  statNum: { fontSize: 24, fontWeight: 700, color: "#fff" },
  statLabel: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  card: { background: "#fff", borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardTitle: { margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#1e293b" },
  successBadge: { background: "#dcfce7", color: "#16a34a", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 500 },
  infoBadge: { background: "#fef9c3", color: "#854d0e", borderRadius: 8, padding: "12px 16px", fontSize: 14, marginBottom: 12 },
  uploadBtn: { background: "#f1f5f9", border: "1.5px dashed #cbd5e1", borderRadius: 8, padding: "12px 20px", cursor: "pointer", fontSize: 14, color: "#475569", fontWeight: 500 },
  submitBtn: { width: "100%", padding: "16px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" },
  progressBar: { height: 8, background: "#e2e8f0", borderRadius: 99, marginTop: 14, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6d28d9, #4f46e5)", borderRadius: 99, transition: "width 0.3s" },
  progressText: { textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 8 },
  logStatsRow: { display: "flex", gap: 12, marginBottom: 16 },
  logStat: (type) => ({
    flex: 1, textAlign: "center", padding: "12px", borderRadius: 10,
    background: type === "success" ? "#dcfce7" : type === "error" ? "#fee2e2" : "#f1f5f9",
    color: type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#64748b",
    fontSize: 20, fontWeight: 700,
  }),
  logStatLabel: { fontSize: 12, fontWeight: 400 },
  logList: { maxHeight: 400, overflowY: "auto" },
  logRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9", gap: 12 },
  logUrl: { fontSize: 13, color: "#374151", wordBreak: "break-all" },
  logBadge: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap" },
};