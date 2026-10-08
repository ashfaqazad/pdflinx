// components/JsonLd.jsx
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // "<" escape karna safe practice hai, answer mein kabhi "</script>" aa jaye to bhi page nahi tootega
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}