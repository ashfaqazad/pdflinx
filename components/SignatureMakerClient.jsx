"use client";

import { useRef, useState, useEffect } from "react";

export default function SignatureMakerClient() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.offsetX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.offsetY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.offsetX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.offsetY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Free Signature Maker
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Draw or type → Download transparent PNG signature!
        </p>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full cursor-pointer"
          />
          <button
            onClick={clear}
            className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={download}
            className="bg-green-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold hover:bg-green-700"
          >
            Download PNG
          </button>
        </div>

        {/* ✅ Responsive Signature Canvas */}
        <div className="w-full max-w-[800px] mx-auto">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-[180px] sm:h-[220px] md:h-[300px] border-4 border-indigo-300 rounded-2xl shadow-2xl cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <p className="mt-10 text-gray-600 text-sm md:text-base">
          Tip: Sign with your mouse or finger on mobile!
        </p>
      </div>
    </div>
  );
}























// "use client";

// import { useRef, useState, useEffect } from "react";

// export default function SignatureMakerClient() {
//   const canvasRef = useRef(null);
//   const [drawing, setDrawing] = useState(false);
//   const [color, setColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, [bgColor]);

//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(
//       e.nativeEvent.offsetX || e.touches[0].clientX - canvas.offsetLeft,
//       e.nativeEvent.offsetY || e.touches[0].clientY - canvas.offsetTop
//     );
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     if (!drawing) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.lineWidth = 2;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = color;

//     const x = e.nativeEvent.offsetX || e.touches[0].clientX - canvas.offsetLeft;
//     const y = e.nativeEvent.offsetY || e.touches[0].clientY - canvas.offsetTop;

//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => setDrawing(false);

//   const clear = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   const download = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = "signature.png";
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
//         <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           Free Signature Maker
//         </h1>
//         <p className="text-xl text-gray-600 mb-10">
//           Draw or type → Download transparent PNG signature!
//         </p>

//         <div className="flex justify-center gap-4 mb-8 flex-wrap">
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-16 h-16 rounded-full cursor-pointer"
//           />
//           <button
//             onClick={clear}
//             className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700"
//           >
//             Clear
//           </button>
//           <button
//             onClick={download}
//             className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-green-700"
//           >
//             Download PNG
//           </button>
//         </div>

//         <canvas
//           ref={canvasRef}
//           width={800}
//           height={300}
//           className="border-4 border-indigo-300 rounded-2xl shadow-2xl mx-auto cursor-crosshair bg-white"
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           onTouchStart={startDrawing}
//           onTouchMove={draw}
//           onTouchEnd={stopDrawing}
//         />

//         <p className="mt-10 text-gray-600">
//           Tip: Sign with mouse or touch on mobile!
//         </p>
//       </div>
//     </div>
//   );
// }





















// // "use client";

// // import { useRef, useState, useEffect } from "react";

// // export default function SignatureMakerClient() {
// //   const canvasRef = useRef(null);
// //   const [drawing, setDrawing] = useState(false);
// //   const [color, setColor] = useState("#000000");
// //   const [bgColor, setBgColor] = useState("#ffffff");

// //   useEffect(() => {
// //     if (typeof window === "undefined") return;
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   }, [bgColor]);

// //   const startDrawing = (e) => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.beginPath();
// //     ctx.moveTo(
// //       e.nativeEvent.offsetX || e.touches[0].clientX - canvas.offsetLeft,
// //       e.nativeEvent.offsetY || e.touches[0].clientY - canvas.offsetTop
// //     );
// //     setDrawing(true);
// //   };

// //   const draw = (e) => {
// //     if (!drawing) return;
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.lineWidth = 2;
// //     ctx.lineCap = "round";
// //     ctx.strokeStyle = color;

// //     const x = e.nativeEvent.offsetX || e.touches[0].clientX - canvas.offsetLeft;
// //     const y = e.nativeEvent.offsetY || e.touches[0].clientY - canvas.offsetTop;

// //     ctx.lineTo(x, y);
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => setDrawing(false);

// //   const clear = () => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// //     ctx.fillStyle = bgColor;
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
// //   };

// //   const download = () => {
// //     const canvas = canvasRef.current;
// //     const link = document.createElement("a");
// //     link.download = "signature.png";
// //     link.href = canvas.toDataURL("image/png");
// //     link.click();
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
// //         <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
// //           Free Signature Maker
// //         </h1>
// //         <p className="text-xl text-gray-600 mb-10">
// //           Draw or type → Download transparent PNG signature!
// //         </p>

// //         <div className="flex justify-center gap-4 mb-8 flex-wrap">
// //           <input
// //             type="color"
// //             value={color}
// //             onChange={(e) => setColor(e.target.value)}
// //             className="w-16 h-16 rounded-full cursor-pointer"
// //           />
// //           <button
// //             onClick={clear}
// //             className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700"
// //           >
// //             Clear
// //           </button>
// //           <button
// //             onClick={download}
// //             className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-green-700"
// //           >
// //             Download PNG
// //           </button>
// //         </div>

// //         <canvas
// //           ref={canvasRef}
// //           width={800}
// //           height={300}
// //           className="border-4 border-indigo-300 rounded-2xl shadow-2xl mx-auto cursor-crosshair bg-white"
// //           onMouseDown={startDrawing}
// //           onMouseMove={draw}
// //           onMouseUp={stopDrawing}
// //           onMouseLeave={stopDrawing}
// //           onTouchStart={startDrawing}
// //           onTouchMove={draw}
// //           onTouchEnd={stopDrawing}
// //         />
// //         <p className="mt-10 text-gray-600">
// //           Tip: Sign with mouse or touch on mobile!
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }
