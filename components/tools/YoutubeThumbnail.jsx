'use client';

import { useState } from 'react';
import { Download, Youtube, Copy, CheckCircle, Zap } from 'lucide-react';
import Script from 'next/script';

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const download = () => {
    setLoading(true);
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert('Invalid YouTube URL! Paste a valid video link.');
      setLoading(false);
      return;
    }

    const qualities = [
      { name: 'Max Resolution (1920x1080)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      { name: 'HD Quality (1280x720)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
      { name: 'Medium Quality (640x480)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      { name: 'Standard Quality (480x360)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
      { name: 'Default (120x90)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
    ];

    setThumbs(qualities);
    setLoading(false);
  };

  const copyUrl = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-yt"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Download YouTube Thumbnail in HD",
            description: "Download any YouTube video thumbnail in full HD quality instantly.",
            url: "https://www.pdflinx.com/youtube-thumbnail",
            step: [
              { "@type": "HowToStep", name: "Paste URL", text: "Copy and paste YouTube video URL." },
              { "@type": "HowToStep", name: "Click Download", text: "Press get thumbnail button." },
              { "@type": "HowToStep", name: "Save Image", text: "Save full HD thumbnail to your device." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://www.pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-yt"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "YouTube Thumbnail Downloader", item: "https://www.pdflinx.com/youtube-thumbnail" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
              YouTube Thumbnail Downloader <br /> Online (Free)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download any YouTube video thumbnail in full HD quality instantly. Just paste the video URL — no signup, no watermark, 100% free.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video URL here (e.g., https://youtube.com/watch?v=...)"
                className="flex-1 p-5 text-lg border-2 border-gray-300 rounded-xl focus:border-red-500 outline-none transition"
              />
              <button
                onClick={download}
                disabled={loading || !url}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xl px-10 py-5 rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-60 transition shadow-lg flex items-center justify-center gap-3"
              >
                <Youtube size={28} />
                {loading ? 'Loading...' : 'Get Thumbnails'}
              </button>
            </div>

            {/* Thumbnails Grid */}
            {thumbs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {thumbs.map((thumb, i) => (
                  <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition">
                    <img
                      src={thumb.url}
                      alt={thumb.name}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="p-6 text-center">
                      <p className="font-bold text-gray-800 mb-4">{thumb.name}</p>
                      <div className="flex justify-center gap-4">
                        <a
                          href={thumb.url}
                          download
                          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Download size={20} />
                          Download
                        </a>
                        <button
                          onClick={() => copyUrl(thumb.url)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <Copy size={20} />
                          {copied ? 'Copied!' : 'Copy URL'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-center mt-8 text-gray-600 text-sm">
            No signup • Unlimited downloads • Works on all devices • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
            YouTube Thumbnail Downloader Online Free - Get HD Thumbnails Instantly
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Download high-quality YouTube video thumbnails in seconds. Get Max Resolution (1920x1080), HD, and more — perfect for creators, designers, and marketers. Completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-3xl shadow-xl border border-red-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Youtube className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">All Qualities Available</h3>
            <p className="text-gray-600">
              Get thumbnails in Max (1920x1080), HD (1280x720), Medium, Standard — best quality every time.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-10 rounded-3xl shadow-xl border border-pink-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant & Easy</h3>
            <p className="text-gray-600">
              Just paste YouTube URL — thumbnails appear instantly. Copy URL or download directly.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free & No Limits</h3>
            <p className="text-gray-600">
              Download unlimited thumbnails. No signup, no watermark, works on mobile & desktop.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How to Download YouTube Thumbnail in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-4">Paste Video URL</h4>
              <p className="text-gray-600 text-lg">Copy and paste any YouTube video link into the box above.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-4">Get Thumbnails</h4>
              <p className="text-gray-600 text-lg">All available thumbnail sizes appear instantly below.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-4">Download or Copy</h4>
              <p className="text-gray-600 text-lg">Download your favorite quality or copy direct image URL.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
          Download YouTube thumbnails every day with PDF Linx — trusted by creators worldwide for fast, reliable, and free thumbnail downloading.
        </p>
      </section>
    </>
  );
}






















// 'use client';

// import { useState } from 'react';

// export default function YouTubeThumbnailDownloader() {
//   const [url, setUrl] = useState('');
//   const [thumbs, setThumbs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const extractVideoId = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|^)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const download = () => {
//     setLoading(true);
//     const videoId = extractVideoId(url);
//     if (!videoId) {
//       alert('Invalid YouTube URL bhai!');
//       setLoading(false);
//       return;
//     }

//     const qualities = [
//       { name: 'Max Quality (1920x1080)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
//       { name: 'HD (1280x720)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
//       { name: 'Medium (640x480)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
//       { name: 'Standard (480x360)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
//       { name: 'Low (120x90)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
//     ];

//     setThumbs(qualities);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
//         <h1 className="text-4xl font-bold text-center mb-8">YouTube Thumbnail Downloader</h1>
        
//         <div className="flex gap-4 mb-8">
//           <input
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             placeholder="Paste YouTube video URL here..."
//             className="flex-1 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-red-500 outline-none"
//           />
//           <button onClick={download} disabled={loading} className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700">
//             {loading ? 'Loading...' : 'Get Thumbnail'}
//           </button>
//         </div>

//         {thumbs.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {thumbs.map((thumb, i) => (
//               <div key={i} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
//                 <img src={thumb.url} alt={thumb.name} className="w-full" />
//                 <div className="p-4 text-center">
//                   <p className="font-semibold">{thumb.name}</p>
//                   <a href={thumb.url} download className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
//                     Download
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }