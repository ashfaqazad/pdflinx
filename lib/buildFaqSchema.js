import { extractText } from "./extractText";

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: extractText(f.a) },
    })),
  };
}















// // lib/buildFaqSchema.js
// import { extractText } from "./extractText";

// export function buildFaqSchema(faqs) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((f) => ({
//       "@type": "Question",
//       name: f.q,
//       acceptedAnswer: { "@type": "Answer", text: extractText(f.a) },
//     })),
//   };
// }