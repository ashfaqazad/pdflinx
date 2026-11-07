export const CALC_FAQS = [
  { q: "How do I calculate how much I save by compressing a PDF?", a: "Subtract the compressed size from the original size to get the saving per file, then divide by the original size for the percentage. Multiply the saving per file by the number of files per month to see your monthly total." },
  { q: "Is the savings calculator free?", a: "Yes. It is completely free, needs no account, and everything is calculated in your browser. Nothing you enter is uploaded." },
  { q: "How accurate are the cost and CO₂ figures?", a: "They are estimates. Storage cost uses a common object-storage price of about $0.023 per GB per month and bandwidth uses about $0.09 per GB. CO₂ is a rough average. Use them to compare scenarios rather than as exact billing numbers." },
  { q: "What compressed size should I enter?", a: "If you have not compressed the file yet, try half of the original size for a typical mixed document. Scanned files and photo-heavy presentations often shrink much more, while text-only PDFs shrink very little." },
  { q: "Why does my text-only PDF barely get smaller?", a: "Compression mainly reduces embedded images. A PDF that contains only text and fonts is already compact, so there is little left to remove." },
  { q: "Does compressing a PDF reduce its quality?", a: "Images may be re-encoded at a lower resolution to save space, which can slightly reduce detail at high zoom. At balanced settings, text stays sharp and pages remain easy to read and print." },
  { q: "Where can I actually compress my PDF?", a: "Use the free Compress PDF tool on PDFLinx. It runs in your browser, adds no watermark, and does not require signup." },
];

