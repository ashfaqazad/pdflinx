"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth";

export default function DocxPreview({ file }) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const readFile = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        if (!cancelled) {
          setHtml(result.value);
          setLoading(false);
        }
      } catch (err) {
        console.error("DOCX preview error:", err);
        setLoading(false);
      }
    };

    readFile();

    return () => {
      cancelled = true;
    };
  }, [file]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
        Loading preview...
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden p-3 text-[10px] leading-tight text-slate-700">
      <div
        className="h-full w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}