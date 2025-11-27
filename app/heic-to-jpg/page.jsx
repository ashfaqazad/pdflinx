"use client";

import { useState } from "react";

export default function HeicToJpg() {
  const [converted, setConverted] = useState([]);

  const convert = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    // ✅ Dynamic import to avoid SSR errors
    const heic2any = (await import("heic2any")).default;

    const results = [];
    for (let file of files) {
      try {
        // ✅ Safe window usage (client-only)
        if (typeof window !== "undefined") {
          const jpgBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.94,
          });
          const jpgUrl = window.URL.createObjectURL(jpgBlob);
          results.push({
            name: file.name.replace(/\.heic$/i, ".jpg"),
            url: jpgUrl,
          });
        }
      } catch (err) {
        console.error("Error converting file:", file.name, err);
      }
    }
    setConverted(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-7xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
          HEIC → JPG Converter
        </h1>
        <p className="text-3xl text-gray-700 mb-10">
          Convert iPhone photos to JPG — open them easily on Windows or Android!
        </p>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".heic,.HEIC"
            multiple
            onChange={convert}
            className="hidden"
          />
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-20 py-16 rounded-3xl shadow-2xl hover:scale-105 transition text-3xl font-bold">
            Select HEIC Files
          </div>
        </label>

        {converted.length > 0 && (
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-purple-700 mb-8">
              Converted JPGs Ready!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {converted.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition"
                >
                  <img
                    src={item.url}
                    alt="Converted preview"
                    className="w-full h-48 object-cover"
                  />
                  <a
                    href={item.url}
                    download={item.name}
                    className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 font-bold hover:opacity-90"
                  >
                    Download {item.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
