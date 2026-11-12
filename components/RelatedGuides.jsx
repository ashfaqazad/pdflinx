import Link from "next/link";
import { relatedGuidesByTool } from "@/data/relatedGuides";

// "Related guides" block: links a tool page to the blog posts about that tool.
export default function RelatedGuides({ tool }) {
  const guides = relatedGuidesByTool[tool];
  if (!guides?.length) return null;

  return (
    <section className="bg-white py-14" aria-labelledby="related-guides-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="related-guides-heading"
          className="font-display text-2xl font-normal tracking-tight text-stone-900"
        >
          Related guides
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/blog/${g.slug}`}
                className="block rounded-xl border border-stone-200 p-4 text-sm font-medium text-stone-700 transition-colors hover:border-rose-400 hover:text-rose-600"
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
