import { AiError, guardRequest, groqChat, jsonError } from "@/lib/groqServer";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_CHARS = 60000;   // hard cap on what we accept
const SINGLE_PASS = 24000; // up to this size: one call
const CHUNK = 12000;       // otherwise: summarize chunks, then merge

const SYSTEM =
  "You summarize documents. Write in the same language as the document. " +
  "Output a clear bullet-point summary: start every bullet with '• ', keep bullets short, " +
  "use **bold** for a few short section headings, and include key facts, numbers, names and conclusions. " +
  "Do not invent anything that is not in the text.";

function splitChunks(text) {
  const out = [];
  for (let i = 0; i < text.length; i += CHUNK) out.push(text.slice(i, i + CHUNK));
  return out;
}

export async function POST(req) {
  try {
    guardRequest(req);

    const body = await req.json().catch(() => null);
    let text = typeof body?.text === "string" ? body.text.trim() : "";
    if (text.length < 40) throw new AiError("This PDF has no readable text to summarize.", 400);
    if (text.length > MAX_CHARS) text = text.slice(0, MAX_CHARS);

    let summary;
    if (text.length <= SINGLE_PASS) {
      summary = await groqChat(
        [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Summarize this document:\n\n${text}` },
        ],
        { maxTokens: 900 }
      );
    } else {
      const parts = [];
      for (const chunk of splitChunks(text)) {
        parts.push(
          await groqChat(
            [
              { role: "system", content: SYSTEM },
              { role: "user", content: `Summarize this part of a longer document in bullet points:\n\n${chunk}` },
            ],
            { maxTokens: 600 }
          )
        );
      }
      summary = await groqChat(
        [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Combine these partial summaries into one clear bullet-point summary of the whole document:\n\n${parts.join("\n\n")}` },
        ],
        { maxTokens: 900 }
      );
    }

    return Response.json({ summary });
  } catch (err) {
    return jsonError(err);
  }
}
