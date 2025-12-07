"use client";
import { useState } from "react";

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ← Tera Vercel .env se aayega – GitHub par IP nahi dikhega
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/convert/pdf-to-word`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.click();
      window.URL.revokeObjectURL(url);

      // alert("BHAI HO GAYA – Downloaded Successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
        <p className="text-gray-600 mb-8">
          Convert your PDF to Word documents with incredible accuracy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
        <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
          {file ? file.name : "Select PDF file"}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Converting..." : "Convert to Word"}
        </button>
      </form>

      {loading && (
        <p className="mt-6 text-blue-600 animate-pulse">
          Converting your PDF... (takes 5-15 seconds)
        </p>
      )}
    </main>
  );
}









// "use client";
// import { useState } from "react";

// export default function PdfToWord() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ← YEHI SABSE SAFE TAREEKA HAI
//   // Vercel par jo NEXT_PUBLIC_BACKEND_URL set kiya hai woh yahan se le raha hai
//   // Agar local development kar raha hai to fallback IP use hoga
//   const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a PDF file");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch(`${API_URL}/convert/pdf-to-word`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "Conversion failed");
//       }

//       // Direct download – perfect DOCX
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.pdf$/i, ".docx");
//       a.click();
//       window.URL.revokeObjectURL(url);

//       alert("BHAI HO GAYA – Downloaded Successfully!");
//     } catch (err) {
//       console.error("Conversion error:", err);
//       alert("Error: " + err.message);
//     } finally {
//       setLoading(false);
//       setFile(null);
//     }
//   };

//   return (
//     // <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//     //   {/* Heading */}
//     //   <div className="text-center max-w-2xl mb-10">
//     //     <h1 className="text-4xl font-bold text-gray-800">PDF to WORD Converter</h1>
//     //     <p className="text-gray-600 mt-4 text-lg">
//     //       Upload your PDF and get a fully editable Word document instantly!
//     //     </p>
//     //   </div>

//     //   {/* Upload Form */}
//     //   <form onSubmit={handleSubmit} className="w-full max-w-md">
//     //     <label className="block mb-6">
//     //       <input
//     //         type="file"
//     //         accept="application/pdf"
//     //         onChange={(e) => setFile(e.target.files?.[0] || null)}
//     //         required
//     //         className="block w-full text-sm text-gray-900 border-2 border-dashed border-red-500 rounded-xl p-10 cursor-pointer bg-white hover:border-red-600 transition file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
//     //       />
//     //     </label>

//     //     <button
//     //       type="submit"
//     //       disabled={loading}
//     //       className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl text-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition shadow-lg"
//     //     >
//     //       {loading ? "Converting... Please wait" : "Convert to Word"}
//     //     </button>
//     //   </form>

//     //   {/* Loading message */}
//     //   {loading && (
//     //     <div className="mt-8 text-blue-600 font-medium text-lg animate-pulse">
//     //       Converting your PDF... (usually takes 5-15 seconds)
//     //     </div>
//     //   )}
//     // </main>



//         <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your PDF to Word documents with incredible accuracy.
//         </p>
//       </div>

//       {!downloadUrl && (
//         <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
//           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
//             {file ? file.name : "Select PDF file"}
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="hidden"
//             />
//           </label>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
//             disabled={loading}
//           >
//             {loading ? "Converting..." : "Convert to Word"}
//           </button>
//         </form>
//       )}

//       {downloadUrl && (
//         <div className="mt-6 flex flex-col items-center space-y-2">
//           <p className="text-green-600">Conversion successful! Download your file:</p>
//           <button
//             onClick={handleDownload}
//             className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Download DOCX
//           </button>
//         </div>
//       )}
//     </main>

//   );
// }








// "use client";
// import { useState } from "react";

// export default function PdfToWord() {
//   const [file, setFile] = useState(null);
//   const [fileUrl, setFileUrl] = useState("");  
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ← YEHI SAHI API HAI TERE LIVE SITE KA
//   const API_URL = "http://72.60.78.58:4000/convert/pdf-to-word";


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!file) return alert("Please select a PDF file");

//   setLoading(true);
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await fetch("http://72.60.78.58:5050/convert/pdf-to-word", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Server error");

//     // ← YEHI CHANGE KI HAI – ab JSON nahi, direct DOCX blob le raha hai
//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.name.replace(/\.pdf$/i, ".docx");
//     a.click();
//     window.URL.revokeObjectURL(url);

//     // alert("BHAI HO GAYA – Downloaded!");
//   } catch (err) {
//     alert("Error: " + err.message);
//   } finally {
//     setLoading(false);
//     setFile(null);
//   }
// };




//   const handleDownload = async () => {
//     if (downloadUrl) {
//       try {
//         const response = await fetch(downloadUrl);
//         if (!response.ok) throw new Error("Download failed");
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = file ? file.name.replace(/\.[^.]+$/, ".docx") : "converted.docx";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       } catch (err) {
//         console.error("Download error:", err);
//         alert("Failed to download file");
//       }
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
//         <p className="text-gray-600 mb-8">
//           Convert your PDF to Word documents with incredible accuracy.
//         </p>
//       </div>

//       {!downloadUrl && (
//         <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
//           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
//             {file ? file.name : "Select PDF file"}
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="hidden"
//             />
//           </label>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
//             disabled={loading}
//           >
//             {loading ? "Converting..." : "Convert to Word"}
//           </button>
//         </form>
//       )}

//       {downloadUrl && (
//         <div className="mt-6 flex flex-col items-center space-y-2">
//           <p className="text-green-600">Conversion successful! Download your file:</p>
//           <button
//             onClick={handleDownload}
//             className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Download DOCX
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }








//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setDownloadUrl(null);

//   //   try {
//   //     const formData = new FormData();

//   //     if (file) {
//   //       formData.append("file", file);
//   //     } else if (fileUrl) {
//   //       formData.append("fileUrl", fileUrl);
//   //     } else {
//   //       alert("Please select a file or enter a file URL");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const res = await fetch(API_URL, {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     const data = await res.json();

//   //     if (data.success) {
//   //       // Direct download (tera purana style)
//   //       const fullDownloadUrl = `  http://72.60.78.58:4000${data.download}`;
//   //       setDownloadUrl(fullDownloadUrl);
//   //     } else {
//   //       alert("Conversion failed: " + (data.error || "Unknown error"));
//   //       console.error("API Error:", data);
//   //     }
//   //   } catch (err) {
//   //     alert("Something went wrong! Check internet or try again.");
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };






// // "use client";
// // import { useState } from "react";

// // export default function PdfToWord() {
// //   const [file, setFile] = useState(null);
// //   const [fileUrl, setFileUrl] = useState("");  // Agar URL chahiye toh uncomment kar lena
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setDownloadUrl(null);

// //     try {
// //       const formData = new FormData();

// //       if (file) {
// //         formData.append("file", file);
// //       } else if (fileUrl) {
// //         formData.append("fileUrl", fileUrl);
// //       } else {
// //         alert("Please select a file or enter a file URL");
// //         setLoading(false);
// //         return;
// //       }

// //       // ✅ Replace with your VPS API route
// //       const res = await fetch("/api/convert/pdf-to-word", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         // ✅ Use full download link from VPS
// //         setDownloadUrl(`/api${data.download}`);
// //       } else {
// //         alert("Conversion failed: " + data.error);
// //         console.error("API Error:", data);
// //       }
// //     } catch (err) {
// //       alert("Something went wrong!");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = async () => {
// //     if (downloadUrl) {
// //       try {
// //         const response = await fetch(downloadUrl);
// //         if (!response.ok) throw new Error("Download failed");
// //         const blob = await response.blob();
// //         const url = window.URL.createObjectURL(blob);
// //         const a = document.createElement("a");
// //         a.href = url;
// //         a.download = file ? file.name.replace(/\.[^.]+$/, ".docx") : "converted.docx";  // File name derive, ya fixed
// //         document.body.appendChild(a);
// //         a.click();
// //         a.remove();
// //         window.URL.revokeObjectURL(url);
// //       } catch (err) {
// //         console.error("Download error:", err);
// //         alert("Failed to download file");
// //       }
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// //       {/* Heading */}
// //       <div className="text-center max-w-2xl">
// //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// //         <p className="text-gray-600 mb-8">
// //           Convert your PDF to Word documents with incredible accuracy.
// //         </p>
// //       </div>

// //       {/* Upload / URL Form */}
// //       {!downloadUrl && (
// //         <form
// //           onSubmit={handleSubmit}
// //           className="flex flex-col items-center space-y-6"
// //         >
// //           {/* Big Upload Button */}
// //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// //             {file ? file.name : "Select PDF file"}
// //             <input
// //               type="file"
// //               accept="application/pdf"
// //               onChange={(e) => setFile(e.target.files[0])}
// //               className="hidden"
// //             />
// //           </label>

// //           {/* URL Input (commented jaise tune diya tha) */}
// //           {/* <input
// //             type="text"
// //             value={fileUrl}
// //             onChange={(e) => setFileUrl(e.target.value)}
// //             placeholder="Or enter PDF file URL"
// //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// //           /> */}

// //           {/* Convert Button */}
// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// //             disabled={loading}
// //           >
// //             {loading ? "Converting..." : "Convert to Word"}
// //           </button>
// //         </form>
// //       )}

// //       {/* Download Section */}
// //       {downloadUrl && (
// //         <div className="mt-6 flex flex-col items-center space-y-2">
// //           <p className="text-green-600">Conversion successful! Download your file:</p>
// //           <button
// //             onClick={handleDownload}
// //             className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
// //           >
// //             Download DOCX
// //           </button>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }






























// // "use client";

// // import { useState } from "react";

// // export default function PdfToWord() {
// //   const [file, setFile] = useState(null);
// //   const [fileUrl, setFileUrl] = useState("");
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setDownloadUrl(null);

// //     try {
// //       const formData = new FormData();

// //       if (file) {
// //         formData.append("file", file);
// //       } else if (fileUrl) {
// //         formData.append("fileUrl", fileUrl);
// //       } else {
// //         alert("Please select a file or enter a file URL");
// //         setLoading(false);
// //         return;
// //       }

// //       // ✅ Replace with your VPS API route
// //       const res = await fetch("http://72.60.78.58:4000/convert/pdf-to-word", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (data.success) {
// //         // ✅ Use full download link from VPS
// //         setDownloadUrl(`http://72.60.78.58:4000${data.download}`);
// //       } else {
// //         alert("Conversion failed: " + data.error);
// //         console.error("API Error:", data);
// //       }
// //     } catch (err) {
// //       alert("Something went wrong!");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// //       {/* Heading */}
// //       <div className="text-center max-w-2xl">
// //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// //         <p className="text-gray-600 mb-8">
// //           Convert your PDF to Word documents with incredible accuracy.
// //         </p>
// //       </div>

// //       {/* Upload / URL Form */}
// //       {!downloadUrl && (
// //         <form
// //           onSubmit={handleSubmit}
// //           className="flex flex-col items-center space-y-6"
// //         >
// //           {/* Big Upload Button */}
// //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// //             {file ? file.name : "Select PDF file"}
// //             <input
// //               type="file"
// //               accept="application/pdf"
// //               onChange={(e) => setFile(e.target.files[0])}
// //               className="hidden"
// //             />
// //           </label>

// //           {/* <span className="text-gray-500">or drop PDF here</span> */}

// //           {/* URL Input */}
// //           {/* <input
// //             type="text"
// //             value={fileUrl}
// //             onChange={(e) => setFileUrl(e.target.value)}
// //             placeholder="Or enter PDF file URL"
// //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// //           /> */}

// //           {/* Convert Button */}
// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// //             disabled={loading}
// //           >
// //             {loading ? "Converting..." : "Convert to Word"}
// //           </button>
// //         </form>
// //       )}

// //       {/* Download Section */}
// //       {downloadUrl && (
// //         <div className="flex flex-col items-center space-y-6 mt-10">
// //           <p className="text-lg font-semibold text-green-600">
// //             ✅ Conversion Complete!
// //           </p>
// //           <a
// //             href={downloadUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-red-700 transition"
// //           >
// //             Download Word File
// //           </a>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }






























// // "use client";

// // import { useState } from "react";

// // export default function PdfToWord() {
// //   const [file, setFile] = useState(null);
// //   const [fileUrl, setFileUrl] = useState("");
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setDownloadUrl(null);

// //     try {
// //       const formData = new FormData();

// //       if (file) {
// //         formData.append("file", file);
// //       } else if (fileUrl) {
// //         formData.append("fileUrl", fileUrl);
// //       } else {
// //         alert("Please select a file or enter a file URL");
// //         setLoading(false);
// //         return;
// //       }

// //       const res = await fetch("/api/pdf-to-word", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         console.error("API Error:", data);
// //         alert("Conversion failed: " + JSON.stringify(data));
// //       } else {
// //         console.log("Download URL:", data.downloadUrl);
// //         setDownloadUrl(data.downloadUrl); // ✅ ab state me save hoga
// //       }
// //     } catch (err) {
// //       alert("Something went wrong!");
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// //       {/* Heading */}
// //       <div className="text-center max-w-2xl">
// //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// //         <p className="text-gray-600 mb-8">
// //           Convert your PDF to Word documents with incredible accuracy.
// //         </p>
// //       </div>

// //       {/* Upload / URL Form */}
// //       {!downloadUrl && (
// //         <form
// //           onSubmit={handleSubmit}
// //           className="flex flex-col items-center space-y-6"
// //         >
// //           {/* Big Upload Button */}
// //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// //             {file ? file.name : "Select PDF file"}
// //             <input
// //               type="file"
// //               accept="application/pdf"
// //               onChange={(e) => setFile(e.target.files[0])}
// //               className="hidden"
// //             />
// //           </label>

// //           <span className="text-gray-500">or drop PDF here</span>

// //           {/* URL Input */}
// //           <input
// //             type="text"
// //             value={fileUrl}
// //             onChange={(e) => setFileUrl(e.target.value)}
// //             placeholder="Or enter PDF file URL"
// //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// //           />

// //           {/* Convert Button */}
// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// //             disabled={loading}
// //           >
// //             {loading ? "Converting..." : "Convert to Word"}
// //           </button>
// //         </form>
// //       )}

// //       {/* Download Section */}
// //       {downloadUrl && (
// //         <div className="flex flex-col items-center space-y-6 mt-10">
// //           <p className="text-lg font-semibold text-green-600">
// //             ✅ Conversion Complete!
// //           </p>
// //           <a
// //             href={downloadUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-red-700 transition"
// //           >
// //             Download Word File
// //           </a>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }




























// // "use client";
// // import { useState } from "react";

// // export default function Home() {
// //   const [loading, setLoading] = useState(false);

// //   const handleUpload = async (e) => {
// //     e.preventDefault();
// //     const file = e.target.file.files[0];
// //     if (!file) return;

// //     setLoading(true);
// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await fetch("/api/pdf-to-word", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         throw new Error("Failed to convert");
// //       }

// //       // ⬇️ instead of res.json(), use blob()
// //       const blob = await res.blob();
// //       const url = window.URL.createObjectURL(blob);

// //       // Trigger download
// //       const a = document.createElement("a");
// //       a.href = url;
// //       a.download = file.name.replace(".pdf", ".docx"); // downloaded name
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();

// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error("Error:", err);
// //       alert("Conversion failed!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <form onSubmit={handleUpload}>
// //         <input type="file" name="file" accept="application/pdf" />
// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
// //         >
// //           {loading ? "Converting..." : "Upload & Convert"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }













// // // "use client";

// // // import { useState } from "react";

// // // export default function PdfToWord() {
// // //   const [file, setFile] = useState(null);
// // //   const [fileUrl, setFileUrl] = useState("");
// // //   const [downloadUrl, setDownloadUrl] = useState(null);
// // //   const [loading, setLoading] = useState(false);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setDownloadUrl(null);

// // //     try {
// // //       const formData = new FormData();

// // //       if (file) {
// // //         formData.append("file", file);
// // //       } else if (fileUrl) {
// // //         formData.append("fileUrl", fileUrl);
// // //       } else {
// // //         alert("Please select a file or enter a file URL");
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       const res = await fetch("/api/pdf-to-word", {
// // //         method: "POST",
// // //         body: formData,
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         console.error("API Error:", data);
// // //         alert("Conversion failed: " + JSON.stringify(data));
// // //       } else {
// // //         console.log("Download URL:", data.downloadUrl);
// // //         setDownloadUrl(data.downloadUrl); // ✅ ab state me save hoga
// // //       }
// // //     } catch (err) {
// // //       alert("Something went wrong!");
// // //       console.error(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// // //       {/* Heading */}
// // //       <div className="text-center max-w-2xl">
// // //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// // //         <p className="text-gray-600 mb-8">
// // //           Convert your PDF to Word documents with incredible accuracy.
// // //         </p>
// // //       </div>

// // //       {/* Upload / URL Form */}
// // //       {!downloadUrl && (
// // //         <form
// // //           onSubmit={handleSubmit}
// // //           className="flex flex-col items-center space-y-6"
// // //         >
// // //           {/* Big Upload Button */}
// // //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// // //             {file ? file.name : "Select PDF file"}
// // //             <input
// // //               type="file"
// // //               accept="application/pdf"
// // //               onChange={(e) => setFile(e.target.files[0])}
// // //               className="hidden"
// // //             />
// // //           </label>

// // //           <span className="text-gray-500">or drop PDF here</span>

// // //           {/* URL Input */}
// // //           <input
// // //             type="text"
// // //             value={fileUrl}
// // //             onChange={(e) => setFileUrl(e.target.value)}
// // //             placeholder="Or enter PDF file URL"
// // //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// // //           />

// // //           {/* Convert Button */}
// // //           <button
// // //             type="submit"
// // //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// // //             disabled={loading}
// // //           >
// // //             {loading ? "Converting..." : "Convert to Word"}
// // //           </button>
// // //         </form>
// // //       )}

// // //       {/* Download Section */}
// // //       {downloadUrl && (
// // //         <div className="flex flex-col items-center space-y-6 mt-10">
// // //           <p className="text-lg font-semibold text-green-600">
// // //             ✅ Conversion Complete!
// // //           </p>
// // //           <a
// // //             href={downloadUrl}
// // //             target="_blank"
// // //             rel="noopener noreferrer"
// // //             className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-red-700 transition"
// // //           >
// // //             Download Word File
// // //           </a>
// // //         </div>
// // //       )}
// // //     </main>
// // //   );
// // // }














// // // // "use client";

// // // // import { useState } from "react";

// // // // export default function PdfToWord() {
// // // //   const [file, setFile] = useState(null);
// // // //   const [fileUrl, setFileUrl] = useState("");
// // // //   const [downloadUrl, setDownloadUrl] = useState(null);
// // // //   const [loading, setLoading] = useState(false);

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setLoading(true);
// // // //     setDownloadUrl(null);

// // // //     try {
// // // //       const formData = new FormData();

// // // //       if (file) {
// // // //         formData.append("file", file);
// // // //       } else if (fileUrl) {
// // // //         formData.append("fileUrl", fileUrl);
// // // //       } else {
// // // //         alert("Please select a file or enter a file URL");
// // // //         setLoading(false);
// // // //         return;
// // // //       }



// // // //       // const res = await fetch("/api/pdf-to-word", {
// // // //       //   method: "POST",
// // // //       //   body: formData,
// // // //       // });

// // // //       // const data = await res.json();
// // // //       // if (data.downloadUrl) {
// // // //       //   setDownloadUrl(data.downloadUrl);
// // // //       // } else {
// // // //       //   alert("Error: " + (data.error || "Unknown"));
// // // //       // }


// // // //       const res = await fetch("/api/pdf-to-word", {
// // // //         method: "POST",
// // // //         body: formData,
// // // //       });

// // // //       const data = await res.json();

// // // //       if (!res.ok) {
// // // //         console.error("API Error:", data); // ✅ frontend pe clear dikhega
// // // //         alert("Conversion failed: " + JSON.stringify(data));
// // // //       } else {
// // // //         console.log("Download URL:", data.downloadUrl);
// // // //       }



// // // //     } catch (err) {
// // // //       alert("Something went wrong!");
// // // //       console.error(err);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }



// // // //   };

// // // //   return (
// // // //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// // // //       {/* Heading */}
// // // //       <div className="text-center max-w-2xl">
// // // //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// // // //         <p className="text-gray-600 mb-8">
// // // //           Convert your PDF to Word documents with incredible accuracy.
// // // //         </p>
// // // //       </div>

// // // //       {/* Upload / URL Form */}
// // // //       {!downloadUrl && (
// // // //         <form
// // // //           onSubmit={handleSubmit}
// // // //           className="flex flex-col items-center space-y-6"
// // // //         >
// // // //           {/* Big Upload Button */}
// // // //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// // // //             {file ? file.name : "Select PDF file"}
// // // //             <input
// // // //               type="file"
// // // //               accept="application/pdf"
// // // //               onChange={(e) => setFile(e.target.files[0])}
// // // //               className="hidden"
// // // //             />
// // // //           </label>

// // // //           <span className="text-gray-500">or drop PDF here</span>

// // // //           {/* URL Input */}
// // // //           <input
// // // //             type="text"
// // // //             value={fileUrl}
// // // //             onChange={(e) => setFileUrl(e.target.value)}
// // // //             placeholder="Or enter PDF file URL"
// // // //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// // // //           />

// // // //           {/* Convert Button */}
// // // //           <button
// // // //             type="submit"
// // // //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// // // //             disabled={loading}
// // // //           >
// // // //             {loading ? "Converting..." : "Convert to Word"}
// // // //           </button>
// // // //         </form>
// // // //       )}

// // // //       {/* Download Section */}
// // // //       {downloadUrl && (
// // // //         <div className="flex flex-col items-center space-y-6 mt-10">
// // // //           <p className="text-lg font-semibold text-green-600">
// // // //             ✅ Conversion Complete!
// // // //           </p>
// // // //           <a
// // // //             href={downloadUrl}
// // // //             target="_blank"
// // // //             rel="noopener noreferrer"
// // // //             className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-red-700 transition"
// // // //           >
// // // //             Download Word File
// // // //           </a>
// // // //         </div>
// // // //       )}
// // // //     </main>
// // // //   );
// // // // }




















// // // // // "use client";

// // // // // import { useState } from "react";

// // // // // export default function Home() {
// // // // //   const [file, setFile] = useState(null);
// // // // //   const [fileUrl, setFileUrl] = useState("");
// // // // //   const [downloadUrl, setDownloadUrl] = useState(null);
// // // // //   const [loading, setLoading] = useState(false);

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setLoading(true);
// // // // //     setDownloadUrl(null);

// // // // //     try {
// // // // //       const formData = new FormData();

// // // // //       if (file) {
// // // // //         formData.append("file", file);
// // // // //       } else if (fileUrl) {
// // // // //         formData.append("fileUrl", fileUrl);
// // // // //       } else {
// // // // //         alert("Please select a file or enter a file URL");
// // // // //         setLoading(false);
// // // // //         return;
// // // // //       }

// // // // //       const res = await fetch("/api/pdf-to-word", {
// // // // //         method: "POST",
// // // // //         body: formData,
// // // // //       });

// // // // //       const data = await res.json();
// // // // //       if (data.downloadUrl) {
// // // // //         setDownloadUrl(data.downloadUrl);
// // // // //       } else {
// // // // //         alert("Error: " + (data.error || "Unknown"));
// // // // //       }
// // // // //     } catch (err) {
// // // // //       alert("Something went wrong!");
// // // // //       console.error(err);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// // // // //       {/* Heading */}
// // // // //       <div className="text-center max-w-2xl">
// // // // //         <h1 className="text-3xl font-bold mb-2">PDF to WORD Converter</h1>
// // // // //         <p className="text-gray-600 mb-8">
// // // // //           Convert your PDF to Word documents with incredible accuracy.
// // // // //         </p>
// // // // //       </div>

// // // // //       {/* Upload / URL Form */}
// // // // //       {!downloadUrl && (
// // // // //         <form
// // // // //           onSubmit={handleSubmit}
// // // // //           className="flex flex-col items-center space-y-6"
// // // // //         >
// // // // //           {/* Big Upload Button */}
// // // // //           <label className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-red-700 transition">
// // // // //             {file ? file.name : "Select PDF file"}
// // // // //             <input
// // // // //               type="file"
// // // // //               accept="application/pdf"
// // // // //               onChange={(e) => setFile(e.target.files[0])}
// // // // //               className="hidden"
// // // // //             />
// // // // //           </label>

// // // // //           <span className="text-gray-500">or drop PDF here</span>

// // // // //           {/* URL Input */}
// // // // //           <input
// // // // //             type="text"
// // // // //             value={fileUrl}
// // // // //             onChange={(e) => setFileUrl(e.target.value)}
// // // // //             placeholder="Or enter PDF file URL"
// // // // //             className="border border-gray-300 p-3 w-80 rounded-lg focus:ring focus:ring-blue-300"
// // // // //           />

// // // // //           {/* Convert Button */}
// // // // //           <button
// // // // //             type="submit"
// // // // //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? "Converting..." : "Convert to Word"}
// // // // //           </button>
// // // // //         </form>
// // // // //       )}

// // // // //       {/* Download Section */}
// // // // //       {downloadUrl && (
// // // // //         <div className="flex flex-col items-center space-y-6 mt-10">
// // // // //           <p className="text-lg font-semibold text-green-600">
// // // // //             ✅ Conversion Complete!
// // // // //           </p>
// // // // //           <a
// // // // //             href={downloadUrl}
// // // // //             target="_blank"
// // // // //             rel="noopener noreferrer"
// // // // //             className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-red-700 transition"
// // // // //           >
// // // // //             Download Word File
// // // // //           </a>
// // // // //         </div>
// // // // //       )}
// // // // //     </main>
// // // // //   );
// // // // // }















// // // // // // "use client";

// // // // // // import { useState } from "react";

// // // // // // export default function Home() {
// // // // // //   const [file, setFile] = useState(null);
// // // // // //   const [fileUrl, setFileUrl] = useState("");
// // // // // //   const [downloadUrl, setDownloadUrl] = useState(null);
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   const handleSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     setLoading(true);
// // // // // //     setDownloadUrl(null);

// // // // // //     try {
// // // // // //       const formData = new FormData();

// // // // // //       if (file) {
// // // // // //         formData.append("file", file);
// // // // // //       } else if (fileUrl) {
// // // // // //         formData.append("fileUrl", fileUrl);
// // // // // //       } else {
// // // // // //         alert("Please select a file or enter a file URL");
// // // // // //         setLoading(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       const res = await fetch("/api/pdf-to-word", {
// // // // // //         method: "POST",
// // // // // //         body: formData,
// // // // // //       });

// // // // // //       const data = await res.json();
// // // // // //       if (data.downloadUrl) {
// // // // // //         setDownloadUrl(data.downloadUrl);
// // // // // //       } else {
// // // // // //         alert("Error: " + (data.error || "Unknown"));
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       alert("Something went wrong!");
// // // // // //       console.error(err);
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <main className="p-6 max-w-lg mx-auto">
// // // // // //       <h1 className="text-2xl font-bold mb-4">PDF to Word Converter</h1>

// // // // // //       <form onSubmit={handleSubmit} className="space-y-4">
// // // // // //         {/* File Upload */}
// // // // // //         <input
// // // // // //           type="file"
// // // // // //           accept="application/pdf"
// // // // // //           onChange={(e) => setFile(e.target.files[0])}
// // // // // //           className="block w-full border p-2 rounded"
// // // // // //         />

// // // // // //         {/* OR File URL */}
// // // // // //         <input
// // // // // //           type="text"
// // // // // //           value={fileUrl}
// // // // // //           onChange={(e) => setFileUrl(e.target.value)}
// // // // // //           placeholder="Or enter PDF file URL"
// // // // // //           className="border p-2 w-full rounded"
// // // // // //         />

// // // // // //         <button
// // // // // //           type="submit"
// // // // // //           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
// // // // // //           disabled={loading}
// // // // // //         >
// // // // // //           {loading ? "Converting..." : "Convert to Word"}
// // // // // //         </button>
// // // // // //       </form>

// // // // // //       {downloadUrl && (
// // // // // //         <p className="mt-4">
// // // // // //           ✅ Conversion complete:{" "}
// // // // // //           <a
// // // // // //             href={downloadUrl}
// // // // // //             target="_blank"
// // // // // //             rel="noopener noreferrer"
// // // // // //             className="text-blue-500 underline"
// // // // // //           >
// // // // // //             Download Word File
// // // // // //           </a>
// // // // // //         </p>
// // // // // //       )}
// // // // // //     </main>
// // // // // //   );
// // // // // // }












// // // // // // "use client";
// // // // // // import { useState } from "react";

// // // // // // export default function PdfToWord() {
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   const handleSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     setLoading(true);

// // // // // //     const file = e.target.file.files[0];
// // // // // //     const formData = new FormData();
// // // // // //     formData.append("file", file);

// // // // // //     const res = await fetch("/api/pdf-to-word", {
// // // // // //       method: "POST",
// // // // // //       body: formData,
// // // // // //     });

// // // // // //     if (!res.ok) {
// // // // // //       alert("Conversion failed!");
// // // // // //       setLoading(false);
// // // // // //       return;
// // // // // //     }

// // // // // //     // download Word file
// // // // // //     const blob = await res.blob();
// // // // // //     const url = window.URL.createObjectURL(blob);
// // // // // //     const a = document.createElement("a");
// // // // // //     a.href = url;
// // // // // //     a.download = "converted.docx";
// // // // // //     a.click();

// // // // // //     setLoading(false);
// // // // // //   };

// // // // // //   return (
// // // // // //     <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // // // // //       <input type="file" name="file" accept="application/pdf" required />
// // // // // //       <button
// // // // // //         type="submit"
// // // // // //         disabled={loading}
// // // // // //         className="bg-blue-600 text-white px-4 py-2 rounded-md"
// // // // // //       >
// // // // // //         {loading ? "Converting..." : "Convert to Word"}
// // // // // //       </button>
// // // // // //     </form>
// // // // // //   );
// // // // // // }

















// // // // // // "use client";
// // // // // // import { useState } from "react";

// // // // // // export default function PdfToWord() {
// // // // // //   const [file, setFile] = useState(null);
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   const handleUpload = async () => {
// // // // // //     if (!file) return alert("Please select a file");

// // // // // //     const formData = new FormData();
// // // // // //     formData.append("file", file);

// // // // // //     setLoading(true);

// // // // // //     const res = await fetch("/api/pdf-to-word", {
// // // // // //       method: "POST",
// // // // // //       body: formData,
// // // // // //     });

// // // // // //     const data = await res.json();
// // // // // //     setLoading(false);

// // // // // //     console.log("API Response:", data);
// // // // // //     // Yahan tumko ILovePDF ka processed file link milega
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="p-6">
// // // // // //       <h1 className="text-xl font-bold mb-4">PDF → Word Converter</h1>
// // // // // //       <input
// // // // // //         type="file"
// // // // // //         accept="application/pdf"
// // // // // //         onChange={(e) => setFile(e.target.files[0])}
// // // // // //         className="mb-4"
// // // // // //       />
// // // // // //       <button
// // // // // //         onClick={handleUpload}
// // // // // //         className="px-4 py-2 bg-blue-600 text-white rounded"
// // // // // //         disabled={loading}
// // // // // //       >
// // // // // //         {loading ? "Processing..." : "Convert"}
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
