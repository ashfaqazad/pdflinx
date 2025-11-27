// app/qr-generator/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';   // ← sirf ye install karna hai: npm install qrcode

export default function QRGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, { width: 280, margin: 2 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Free QR Code Generator
        </h1>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL, text, WhatsApp, Wi-Fi..."
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none mb-6"
        />

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setText('https://pdflinx.com')} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
            Pdflinx.com
          </button>
          <button onClick={() => setText('https://wa.me/923001234567')} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
            WhatsApp
          </button>
          <button onClick={() => setText('WIFI:S:HomeWiFi;T:WPA;P:12345678;;')} className="bg-purple-600 text-white p-3 rounded-lg text-sm hover:bg-purple-700">
            Wi-Fi Login
          </button>
          <button onClick={() => setText('https://instagram.com')} className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700">
            Instagram
          </button>
        </div> */}

        {/* Ye canvas hai — yahan QR banega */}
        <div className="flex justify-center">
          {text ? (
            <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
          ) : (
            <div className="w-72 h-72 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
              Enter text to generate QR
            </div>
          )}
        </div>

        {/* Download button (optional bonus) */}
        {text && (
          <div className="text-center mt-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const url = canvasRef.current.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qr-code.png';
                link.click();
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}