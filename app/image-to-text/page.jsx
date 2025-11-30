'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageToText() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const doOCR = (file) => {
    if (!file) return;

    setLoading(true);
    setText('');
    setProgress(0);

    // Browser-safe version: direct Tesseract call (no createWorker)
    Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text.trim() || 'No text found');
      })
      .catch((err) => {
        console.error(err);
        setText('Error: Try again or use clearer image.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
        {/* <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Image to Text (Offline OCR)
        </h1> */}
        <h1
          className="text-5xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-[1.2] pb-2"
        >
          Image to Text (Offline OCR)
        </h1>

        <p className="text-xl text-gray-600 mb-10">
          Upload any image and extract text using!
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(URL.createObjectURL(file));
              doOCR(file);
            }
          }}
          className="block w-full max-w-md mx-auto text-lg border-4 border-dashed border-teal-400 rounded-3xl cursor-pointer bg-teal-50 p-16 hover:bg-teal-100 transition"
        />

        {loading && (
          <div className="my-20">
            <div className="w-96 mx-auto bg-gray-200 rounded-full h-12 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full transition-all duration-300 flex items-center justify-center text-white font-bold"
                style={{ width: `${progress}%` }}
              >
                {progress > 0 && `${progress}%`}
              </div>
            </div>
            <p className="mt-6 text-2xl font-bold text-teal-600">
              Extracting text... (2-5 sec)
            </p>
          </div>
        )}

        {text && !loading && (
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            {image && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Uploaded Image</h3>
                <img
                  src={image}
                  alt="uploaded"
                  className="max-w-full rounded-2xl shadow-2xl"
                />
              </div>
            )}
            <div>
              <h3 className="text-3xl font-bold mb-4 text-cyan-600">
                Extracted Text
              </h3>
              <textarea
                value={text}
                readOnly
                className="w-full h-80 p-6 text-lg border-2 border-cyan-300 rounded-2xl bg-cyan-50 font-mono resize-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="mt-4 w-full bg-cyan-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-cyan-700 transition"
              >
                Copy Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
