import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || "b55678ebc7f8913b5b8a6cd0e2193ee5";
const HOST = "pdflinx.com";
const DEFAULT_URLS = [
  `https://${HOST}`,
  `https://${HOST}/pdf-to-word`,
  `https://${HOST}/pdf-to-jpg`,
  `https://${HOST}/pdf-to-png`,
  `https://${HOST}/word-to-pdf`,
  `https://${HOST}/jpg-to-pdf`,
  `https://${HOST}/merge-pdf`,
  `https://${HOST}/split-pdf`,
  `https://${HOST}/compress-pdf`,
];

export async function POST(request) {
  const secret = request.headers.get("x-submit-secret");
  if (process.env.INDEXNOW_SECRET && secret !== process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { urls } = body;
  const urlList = Array.isArray(urls) && urls.length > 0
    ? urls.map((u) => (u.startsWith("http") ? u : `https://${HOST}${u}`))
    : DEFAULT_URLS;

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  return NextResponse.json({
    success: true,
    indexnowStatus: response.status,
    urlsSubmitted: urlList.length,
    urls: urlList,
  });
}