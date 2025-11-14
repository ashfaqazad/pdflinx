"use client";
import { useState } from "react";

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);  // Multiple files ke liye array
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);  // Download link ke liye

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);  // Reset previous

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);  // Backend array ke liye
      });

      const res = await fetch("/api/convert/image-to-pdf", {
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
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "images-to-pdf.pdf";  // Fixed name, ya files[0]?.name se derive kar sakte ho agar chahiye
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
      <h1 className="text-3xl font-bold mb-2">Image to PDF Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your images (JPG, PNG, etc.) to a single PDF with high quality.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-6"
      >
        <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
          {files.length > 0 ? `${files.length} image(s) selected` : "Select Images"}
          <input
            type="file"
            accept="image/*"  // All images: .jpg,.jpeg,.png,.gif etc.
            multiple  // Multiple select enable
            onChange={(e) => setFiles(Array.from(e.target.files))}
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
            disabled={loading}  // Optional: disable during download
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

// export default function ImageToPdf() {
//   const [files, setFiles] = useState([]);  // Multiple files ke liye array
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);  // Download link ke liye

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       alert("Please select at least one image");
//       return;
//     }

//     setLoading(true);
//     setDownloadUrl(null);  // Reset previous

//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append("images", file);  // Backend array ke liye
//       });

//       const res = await fetch("http://72.60.78.58:4000/convert/image-to-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         // ✅ Use full download link from VPS
//         setDownloadUrl(`http://72.60.78.58:4000${data.download}`);
//       } else {
//         alert("Conversion failed: " + data.error);
//         console.error("API Error:", data);
//       }
//     } catch (err) {
//       alert("Something went wrong!");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (downloadUrl) {
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = "images-to-pdf.pdf";  // Fixed name, ya files[0] se derive kar sakte ho
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold mb-2">Image to PDF Converter</h1>
//       <p className="text-gray-600 mb-8">
//         Convert your images (JPG, PNG, etc.) to a single PDF with high quality.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col items-center space-y-6"
//       >
//         <label className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-green-700 transition">
//           {files.length > 0 ? `${files.length} image(s) selected` : "Select Images"}
//           <input
//             type="file"
//             accept="image/*"  // All images: .jpg,.jpeg,.png,.gif etc.
//             multiple  // Multiple select enable
//             onChange={(e) => setFiles(Array.from(e.target.files))}
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

//       {downloadUrl && (
//         <div className="mt-6 flex flex-col items-center space-y-2">
//           <p className="text-green-600">Conversion successful! Download your file:</p>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
//           >
//             Download PDF
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }