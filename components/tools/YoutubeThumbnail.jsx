'use client';

import { useState } from 'react';

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|^)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const download = () => {
    setLoading(true);
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert('Invalid YouTube URL bhai!');
      setLoading(false);
      return;
    }

    const qualities = [
      { name: 'Max Quality (1920x1080)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      { name: 'HD (1280x720)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
      { name: 'Medium (640x480)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      { name: 'Standard (480x360)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
      { name: 'Low (120x90)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
    ];

    setThumbs(qualities);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">YouTube Thumbnail Downloader</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="flex-1 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-red-500 outline-none"
          />
          <button onClick={download} disabled={loading} className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700">
            {loading ? 'Loading...' : 'Get Thumbnail'}
          </button>
        </div>

        {thumbs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thumbs.map((thumb, i) => (
              <div key={i} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                <img src={thumb.url} alt={thumb.name} className="w-full" />
                <div className="p-4 text-center">
                  <p className="font-semibold">{thumb.name}</p>
                  <a href={thumb.url} download className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}