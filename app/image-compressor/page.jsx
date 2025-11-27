'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressor() {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginal(file);
    setCompressed(null);
    setLoading(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',  // WebP sabse chhota hota hai
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const originalSize = file.size / 1024 / 1024;
      const compressedSize = compressedFile.size / 1024 / 1024;
      setSaved(Math.round((originalSize - compressedSize) / originalSize * 100));
      
      setCompressed(URL.createObjectURL(compressedFile));
    } catch (error) {
      alert('Error compressing image');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-4">Image Compressor & Resizer</h1>
        <p className="text-center text-gray-600 mb-10">Reduce image size up to 90% • Convert to WebP • No quality loss</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-lg text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 p-6 mb-10"
        />

        {original && (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Original</h3>
              <img src={URL.createObjectURL(original)} alt="original" className="max-w-full rounded-lg shadow-lg" />
              <p className="mt-4 text-xl">Size: {(original.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-green-600">
                {loading ? 'Compressing...' : 'Compressed (-90%)'}
              </h3>
              {compressed ? (
                <>
                  <img src={compressed} alt="compressed" className="max-w-full rounded-lg shadow-lg border-4 border-green-500" />
                  <p className="mt-4 text-3xl font-bold text-green-600">{saved}% Smaller!</p>
                  <a
                    href={compressed}
                    download={`compressed-${original.name.split('.')[0]}.webp`}
                    className="inline-block mt-6 bg-green-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-700"
                  >
                    Download Optimized Image
                  </a>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-600"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
