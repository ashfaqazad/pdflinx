"use client";
import { useState } from "react";

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);  // Download link ke liye

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a Word file");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);  // Reset previous

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Use full download link from VPS
        setDownloadUrl(`/api${data.download}`);
      } else {
        alert("Conversion failed: " + data.error);
        console.error("API Error:", data);
      }
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleDownload = async () => {
  if (downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, ".pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  }
};



  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your Word document (.docx) to PDF with high quality.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-6"
      >
        <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
          {file ? file.name : "Select Word file"}
          <input
            type="file"
            accept=".doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert to PDF"}
        </button>
      </form>

      {downloadUrl && (
        <div className="mt-6 flex flex-col items-center space-y-2">
          <p className="text-green-600">Conversion successful! Download your file:</p>
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Download PDF
          </button>
        </div>
      )}
    </main>
  );
}



























// "use client";
// import { useState } from "react";

// export default function WordToPdf() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select a Word file");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       // Backend route hit kar
//       const res = await fetch("/convert/word-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();  // JSON response expect kar (backend se)

//       if (!res.ok || !data.success) {
//         throw new Error(data.error || "Conversion failed");
//       }

//       // Download URL se file fetch kar aur blob bana
//       const downloadRes = await fetch(data.download);  // e.g., /converted/filename.pdf
//       if (!downloadRes.ok) throw new Error("Download failed");

//       const blob = await downloadRes.blob();
//       const url = window.URL.createObjectURL(blob);

//       // Trigger download
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = file.name.replace(/\.[^.]+$/, ".pdf");  // .docx se .pdf bana
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       alert(`Something went wrong: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
//       <p className="text-gray-600 mb-8">
//         Convert your Word document (.docx) to PDF with high quality.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col items-center space-y-6"
//       >
//         <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
//           {file ? file.name : "Select Word file"}
//           <input
//             type="file"
//             accept=".doc,.docx"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="hidden"
//           />
//         </label>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
//           disabled={loading}
//         >
//           {loading ? "Converting..." : "Convert to PDF"}
//         </button>
//       </form>
//     </main>
//   );
// }


































// // "use client";
// // import { useState } from "react";

// // export default function WordToPdf() {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file) {
// //       alert("Please select a Word file");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);

// //       const res = await fetch("/api/word-to-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) throw new Error("Conversion failed");

// //       const blob = await res.blob();
// //       const url = window.URL.createObjectURL(blob);

// //       // Trigger download
// //       const a = document.createElement("a");
// //       a.href = url;
// //       a.download = file.name.replace(/\.[^.]+$/, ".pdf");
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();

// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Something went wrong!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
// //       <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
// //       <p className="text-gray-600 mb-8">
// //         Convert your Word document (.docx) to PDF with high quality.
// //       </p>

// //       <form
// //         onSubmit={handleSubmit}
// //         className="flex flex-col items-center space-y-6"
// //       >
// //         <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
// //           {file ? file.name : "Select Word file"}
// //           <input
// //             type="file"
// //             accept=".doc,.docx"
// //             onChange={(e) => setFile(e.target.files[0])}
// //             className="hidden"
// //           />
// //         </label>

// //         <button
// //           type="submit"
// //           className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// //           disabled={loading}
// //         >
// //           {loading ? "Converting..." : "Convert to PDF"}
// //         </button>
// //       </form>
// //     </main>
// //   );
// // }




















// // "use client";
// // import { useState } from "react";

// // export default function WordToPdf() {
// //   const [file, setFile] = useState(null);
// //   const [downloadUrl, setDownloadUrl] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setDownloadUrl(null);

// //     try {
// //       const formData = new FormData();
// //       if (!file) {
// //         alert("Please select a Word file");
// //         setLoading(false);
// //         return;
// //       }
// //       formData.append("file", file);

// //       const res = await fetch("/api/word-to-pdf", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         console.error("API Error:", data);
// //         alert("Conversion failed: " + JSON.stringify(data));
// //       } else {
// //         setDownloadUrl(data.downloadUrl);
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
// //       <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
// //       <p className="text-gray-600 mb-8">
// //         Convert your Word document (.docx) to PDF with high quality.
// //       </p>

// //       {!downloadUrl && (
// //         <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
// //           <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
// //             {file ? file.name : "Select Word file"}
// //             <input
// //               type="file"
// //               accept=".doc,.docx"
// //               onChange={(e) => setFile(e.target.files[0])}
// //               className="hidden"
// //             />
// //           </label>

// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
// //             disabled={loading}
// //           >
// //             {loading ? "Converting..." : "Convert to PDF"}
// //           </button>
// //         </form>
// //       )}

// //       {downloadUrl && (
// //         <div className="flex flex-col items-center space-y-6 mt-10">
// //           <p className="text-lg font-semibold text-green-600">
// //             ✅ Conversion Complete!
// //           </p>
// //           <a
// //             href={downloadUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
// //           >
// //             Download PDF File
// //           </a>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }
