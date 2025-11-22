"use client";
import { useState, useRef } from "react";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleMerge = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        setDownloadUrl(`/api${data.download}`);
      } else {
        alert("Merge failed: " + data.error);
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Error merging PDFs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloadUrl) {
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf"; // Fixed name, ya files[0]?.name se derive kar sakte ho
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
      {/* Heading */}
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Merge PDF Files</h1>
        <p className="text-gray-600 mb-8">
          Combine multiple PDF files into a single document easily.
        </p>
      </div>

      {/* Upload / Merge Form */}
      <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
        {/* Hidden File Input */}
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Select Files Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Select Files
        </button>

        {/* Info */}
        <p className="text-gray-600">
          {files.length > 0
            ? `${files.length} file(s) selected`
            : "Select 2 or more PDF files to merge."}
        </p>

        {/* Merge Button */}
        <button
          className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
          onClick={handleMerge}
          disabled={loading}
        >
          {loading ? "Merging..." : "Merge PDFs"}
        </button>

        {/* Download Section */}
        {downloadUrl && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <p className="text-lg font-semibold text-green-600">
              ✅ Merge Complete!
            </p>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
            >
              Download Merged PDF
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
















// "use client";

// import { useState, useRef } from "react";

// export default function MergePDF() {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");

//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFiles([...e.target.files]);
//   };

//   const handleMerge = async () => {
//     if (files.length < 2) {
//       alert("Please select at least 2 PDF files to merge.");
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));

//     setLoading(true);
//     setDownloadUrl("");

//     try {
//       const res = await fetch("/api/merge-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.downloadUrl) {
//         setDownloadUrl(data.downloadUrl);
//       } else {
//         alert("Merge failed!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error merging PDFs!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
// <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//   {/* Heading */}
//   <div className="text-center max-w-2xl">
//     <h1 className="text-3xl font-bold mb-2">Merge PDF Files</h1>
//     <p className="text-gray-600 mb-8">
//       Combine multiple PDF files into a single document easily.
//     </p>
//   </div>

//   {/* Upload / Merge Form */}
//   <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
//     {/* Hidden File Input */}
//     <input
//       type="file"
//       multiple
//       accept="application/pdf"
//       onChange={handleFileChange}
//       ref={fileInputRef}
//       className="hidden"
//     />

//     {/* Select Files Button */}
//     <button
//       onClick={() => fileInputRef.current.click()}
//       className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
//     >
//       Select Files
//     </button>

//     {/* Info */}
//     <p className="text-gray-600">
//       {files.length > 0
//         ? `${files.length} file(s) selected`
//         : "Select 2 or more PDF files to merge."}
//     </p>

//     {/* Merge Button */}
//     <button
//       className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
//       onClick={handleMerge}
//       disabled={loading}
//     >
//       {loading ? "Merging..." : "Merge PDFs"}
//     </button>

//     {/* Download Section */}
//     {downloadUrl && (
//       <div className="flex flex-col items-center space-y-4 mt-6">
//         <p className="text-lg font-semibold text-green-600">
//           ✅ Merge Complete!
//         </p>
//         <a
//           href={downloadUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
//         >
//           Download Merged PDF
//         </a>
//       </div>
//     )}
//   </div>
// </main>
//   );
// }
