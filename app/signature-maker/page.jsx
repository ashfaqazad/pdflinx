'use client';

import { useRef, useState } from 'react';

export default function SignatureMaker() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-signature.png';
      a.click();
    });
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
  <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-center">
    <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      Free Signature Maker
    </h1>
    <p className="text-base sm:text-xl text-gray-600 mb-10">
      Draw ya type karo → Transparent PNG signature download karo!
    </p>

    <div className="flex justify-center gap-3 sm:gap-4 mb-8 flex-wrap">
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full cursor-pointer"
      />
      <button
        onClick={clear}
        className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-red-700"
      >
        Clear
      </button>
      <button
        onClick={download}
        className="bg-green-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-xl font-bold hover:bg-green-700"
      >
        Download PNG
      </button>
    </div>

    {/* ✅ Responsive Canvas */}
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={window.innerWidth < 640 ? 300 : 800}
        height={window.innerWidth < 640 ? 200 : 300}
        className="w-full max-w-[800px] h-auto border-4 border-indigo-300 rounded-2xl shadow-2xl cursor-crosshair bg-white"
        style={{ background: bgColor }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>

    <div className="mt-10 text-gray-600 text-sm sm:text-base">
      <p>Tip: Mouse se sign karo ya touch se mobile pe!</p>
    </div>
  </div>
</div>
  );
}