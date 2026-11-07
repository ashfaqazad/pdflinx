// Server-only helpers for the AI tools (Groq). The API key never leaves the server.
// Env vars (set in .env.local and in Vercel → Project → Settings → Environment Variables):
//   GROQ_API_KEY   (required)
//   GROQ_MODEL     (optional, default "llama-3.3-70b-versatile")
//   GROQ_BASE_URL  (optional, default "https://api.groq.com/openai/v1")

const BASE_URL = () => process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const MODEL = () => process.env.GROQ_MODEL || "openai/gpt-oss-120b";

export class AiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// ── Basic abuse protection ────────────────────────────────────────────────
// 1) only accept requests coming from our own pages, 2) per-IP rate limit.
// The limiter is in-memory (per serverless instance), so it is best-effort.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 25;

export function guardRequest(req) {
  const origin = req.headers.get("origin") || "";
  const host = req.headers.get("host") || "";
  if (origin) {
    let oh = "";
    try { oh = new URL(origin).host; } catch (_) {}
    if (oh !== host) throw new AiError("Forbidden", 403);
  }

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_HITS) {
    throw new AiError("Too many requests. Please wait a few minutes and try again.", 429);
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
}

// ── Groq chat completion ──────────────────────────────────────────────────
export async function groqChat(messages, { temperature = 0.2, maxTokens = 900 } = {}) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new AiError("AI is not configured on the server (missing GROQ_API_KEY).", 500);

  let res;
  try {
    res = await fetch(`${BASE_URL()}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL(),
        messages,
        temperature,
        // gpt-oss models "think" first and that counts towards max_tokens, so keep thinking short and leave room
        ...(/gpt-oss/.test(MODEL()) ? { reasoning_effort: "low", max_tokens: maxTokens + 1500 } : { max_tokens: maxTokens }),
      }),
    });
  } catch (_) {
    throw new AiError("Could not reach the AI service. Please try again.", 502);
  }

  if (res.status === 429) throw new AiError("The AI service is busy right now. Please try again in a minute.", 429);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[ai] Groq error", res.status, detail.slice(0, 500)); // visible in the server terminal / Vercel logs
    throw new AiError("The AI service returned an error. Please try again.", 502);
  }

  const data = await res.json().catch(() => null);
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AiError("The AI returned an empty answer. Please try again.", 502);
  return text;
}

export function jsonError(err) {
  const status = err?.status || 500;
  const message = err instanceof AiError ? err.message : "Something went wrong. Please try again.";
  if (!(err instanceof AiError)) console.error("[ai]", err);
  return Response.json({ error: message }, { status });
}
