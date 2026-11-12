import { notFound } from "next/navigation";
import { compareData } from "@/lib/compareData";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/breadcrumbSchema";

export async function generateMetadata({ params }) {
  const data = compareData[params.slug];
  if (!data) return {};

  return {
    title: { absolute: data.title },
    description: data.description,
    alternates: { canonical: data.canonical },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://pdflinx.com${data.canonical}`,
      siteName: "PDF Linx",
      type: "website",
      images: [{ url: "/og/pdflinx-og.png", width: 1200, height: 630, alt: "PDF Linx — Free Online PDF Tools" }],
    },
  };
}

export default function ComparePage({ params }) {
  const data = compareData[params.slug];
  if (!data) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd
        data={breadcrumbSchema([{ name: data.h1, path: data.canonical }])}
      />
      <h1 className="text-4xl font-bold mb-4">{data.h1}</h1>
      <p className="text-gray-600 mb-8">{data.description}</p>

      {/* Comparison Table */}
      <div className="border rounded-xl overflow-hidden mb-10">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold p-4">
          <div>Feature</div>
          <div>PDF Linx</div>
          <div>{data.competitor}</div>
        </div>

        {data.table.map((row, i) => (
          <div key={i} className="grid grid-cols-3 border-t p-4">
            <div>{row[0]}</div>
            <div>{row[1]}</div>
            <div>{row[2]}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={data.ctaHref}
        className="inline-block mb-10 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
      >
        {data.ctaText}
      </a>

      {/* SEO Content */}
      <div className="space-y-4 text-gray-700 mb-12">
        {data.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* More detail */}
      <h2 className="text-2xl font-bold mb-4">{data.h1}: more detail</h2>
      <div className="border rounded-xl overflow-hidden mb-12">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold p-4">
          <div>Feature</div>
          <div>PDF Linx</div>
          <div>{data.competitor}</div>
        </div>
        {data.moreTable.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-4 border-t p-4 text-sm">
            <div className="font-medium">{row[0]}</div>
            <div>{row[1]}</div>
            <div>{row[2]}</div>
          </div>
        ))}
      </div>

      {/* Pros and cons */}
      <h2 className="text-2xl font-bold mb-4">Pros and cons</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {[
          { name: "PDF Linx", pros: data.pros.pdflinx, cons: data.cons.pdflinx },
          { name: data.competitor, pros: data.pros.competitor, cons: data.cons.competitor },
        ].map((col) => (
          <div key={col.name} className="border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">{col.name}</h3>
            <p className="font-medium text-green-700 mb-1">Pros</p>
            <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-700 text-sm">
              {col.pros.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="font-medium text-red-700 mb-1">Cons</p>
            <ul className="list-disc ml-5 space-y-1 text-gray-700 text-sm">
              {col.cons.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Which to choose */}
      <h2 className="text-2xl font-bold mb-4">Which one should you choose?</h2>
      <div className="space-y-4 text-gray-700 mb-6">
        {data.choose.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <p className="text-sm text-gray-500">{data.note}</p>
    </main>
  );
}
