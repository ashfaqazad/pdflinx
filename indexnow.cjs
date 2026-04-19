/**
 * IndexNow Submission Utility — pdflinx.com
 * 
 * Kaise use karein:
 *   node indexnow.js                        → saare default URLs submit karo
 *   node indexnow.js /pdf-to-word /pdf-to-jpg  → specific URLs submit karo
 */

const https = require("https");

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  apiKey: "b55678ebc7f8913b5b8a6cd0e2193ee5",
  host: "pdflinx.com",
  keyLocation: "https://pdflinx.com/b55678ebc7f8913b5b8a6cd0e2193ee5.txt",

  // Ye URLs aap apni site ke hisaab se update karein
  defaultUrls: [
    "https://pdflinx.com",
    "https://pdflinx.com/pdf-to-word",
    "https://pdflinx.com/pdf-to-jpg",
    "https://pdflinx.com/pdf-to-png",
    "https://pdflinx.com/word-to-pdf",
    "https://pdflinx.com/jpg-to-pdf",
    "https://pdflinx.com/merge-pdf",
    "https://pdflinx.com/split-pdf",
    "https://pdflinx.com/compress-pdf",
  ],
};
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Ek ya multiple URLs IndexNow API ko submit karta hai
 * @param {string[]} urls - Submit karne wale URLs ki list
 */
async function submitToIndexNow(urls) {
  // Ensure all URLs are full (absolute) URLs
  const fullUrls = urls.map((url) =>
    url.startsWith("http") ? url : `https://${CONFIG.host}${url}`
  );

  console.log(`\n📤 Submitting ${fullUrls.length} URL(s) to IndexNow...\n`);
  fullUrls.forEach((url) => console.log(`   → ${url}`));

  const payload = JSON.stringify({
    host: CONFIG.host,
    key: CONFIG.apiKey,
    keyLocation: CONFIG.keyLocation,
    urlList: fullUrls,
  });

  const options = {
    hostname: "api.indexnow.org",
    path: "/indexnow",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const status = res.statusCode;

        console.log(`\n📬 Response Status: ${status}`);

        // IndexNow status codes ka matlab:
        if (status === 200) {
          console.log("✅ SUCCESS! URLs submitted successfully.");
          console.log("   Bing/Yandex ab inhe crawl karenge.");
        } else if (status === 202) {
          console.log("✅ ACCEPTED! URLs queue mein add ho gayi hain.");
        } else if (status === 400) {
          console.log("❌ ERROR 400: Invalid format — URLs ya key check karo.");
        } else if (status === 403) {
          console.log(
            "❌ ERROR 403: Key mismatch — key file aur API key match nahi kar rahi."
          );
          console.log(
            `   Check karo: https://${CONFIG.host}/${CONFIG.apiKey}.txt`
          );
        } else if (status === 422) {
          console.log(
            "❌ ERROR 422: URLs aapki key ke host se match nahi karti."
          );
        } else if (status === 429) {
          console.log(
            "⚠️  ERROR 429: Too many requests — thodi der baad try karo."
          );
        } else {
          console.log(`⚠️  Unexpected status: ${status}`);
          if (body) console.log("Body:", body);
        }

        resolve({ status, body });
      });
    });

    req.on("error", (err) => {
      console.error("❌ Network Error:", err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  // Command line se URLs lein, ya default use karein
  const args = process.argv.slice(2);
  const urls = args.length > 0 ? args : CONFIG.defaultUrls;

  console.log("🚀 IndexNow Submission Tool — pdflinx.com");
  console.log("==========================================");

  try {
    await submitToIndexNow(urls);
  } catch (err) {
    console.error("Failed to submit:", err.message);
    process.exit(1);
  }
}

main();