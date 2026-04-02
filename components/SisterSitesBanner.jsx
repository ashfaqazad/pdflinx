export default function SisterSitesBanner() {
  return (
    // <section className="flex justify-center items-cente flex-wrap gap-3 w-full px-6 py-3.5 my-8 bg-purple-50 border-l-4 border-purple-600 rounded-lg box-border">
    <section className="flex justify-center items-center gap-3 w-full px-6 py-3.5 my-8 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
      
      <p className="text-xs text-gray-500 m-0 whitespace-nowrap">
        More free tools
      </p>

      <a
        href="https://convertlinx.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Convertlinx for more image and utility tools"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 no-underline hover:underline"
      >
        🖼️ Image & utility tools →
        <span className="text-purple-700 font-semibold">
          convertlinx.com
        </span>
      </a>

    </section>
  );
}