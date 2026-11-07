import { AiError, guardRequest, groqChat, jsonError } from "@/lib/groqServer";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_CONTEXT = 18000;
const MAX_QUESTION = 1000;

const SYSTEM =
  "You answer questions about a PDF document using ONLY the excerpts provided. " +
  "If the answer is not in the excerpts, say you could not find it in the document. " +
  "Answer in the same language as the question. Be concise and accurate. " +
  "Mention page numbers when the excerpts include them, like (page 3).";

export async function POST(req) {
  try {
    guardRequest(req);

    const body = await req.json().catch(() => null);
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    let context = typeof body?.context === "string" ? body.context.trim() : "";
    if (!question) throw new AiError("Please type a question.", 400);
    if (question.length > MAX_QUESTION) throw new AiError("That question is too long.", 400);
    if (context.length < 20) throw new AiError("This PDF has no readable text to chat with.", 400);
    if (context.length > MAX_CONTEXT) context = context.slice(0, MAX_CONTEXT);

    // short conversation memory (last 3 exchanges), sanitized
    const history = Array.isArray(body?.history) ? body.history.slice(-6) : [];
    const past = history
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

    const answer = await groqChat(
      [
        { role: "system", content: SYSTEM },
        ...past,
        { role: "user", content: `Document excerpts:\n"""\n${context}\n"""\n\nQuestion: ${question}` },
      ],
      { maxTokens: 700 }
    );

    return Response.json({ answer });
  } catch (err) {
    return jsonError(err);
  }
}
