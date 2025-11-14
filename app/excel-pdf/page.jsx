"use client";
import { useState, useRef } from "react";

export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an Excel file to convert.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/convert/excel-to-pdf", {
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
        alert("Conversion failed: " + data.error);
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Error converting Excel to PDF:", error);
      alert("Error converting Excel to PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

//   const handleDownload = async () => {
//     if (downloadUrl) {
//       try {
//         const response = await fetch(downloadUrl);
//         if (!response.ok) throw new Error("Download failed");
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = file ? file.name.replace(/\.[^.]+$/, ".pdf") : "converted.pdf";
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


const handleDownload = async () => {
  if (downloadUrl) {
    try {
      const response = await fetch(downloadUrl, {
        headers: {
          "Accept": "application/octet-stream", // Force binary download
        },
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file ? file.name.replace(/\.[^.]+$/, ".pdf") : "converted.pdf";
      a.style.display = "none"; // Ensure link isn't visible
      document.body.appendChild(a);
      a.click();
      // Immediate cleanup to prevent memory leaks
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 100);
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
        <h1 className="text-3xl font-bold mb-2">Excel to PDF Converter</h1>
        <p className="text-gray-600 mb-8">
          Convert your Excel files (.xlsx, .xls) to PDF with high quality.
        </p>
      </div>

      {/* Upload / Convert Form */}
      <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center space-y-6 w-full max-w-md">
        {/* Hidden File Input */}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Select File Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Select File
        </button>

        {/* File Info */}
        <p className="text-gray-600">
          {file ? `Selected File: ${file.name}` : "Select an Excel file to convert."}
        </p>

        {/* Convert Button */}
        <form onSubmit={handleConvert}>
          <button
            type="submit"
            className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert to PDF"}
          </button>
        </form>

        {/* Download Section */}
        {downloadUrl && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <p className="text-lg font-semibold text-green-600">
              ✅ Conversion Complete!
            </p>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-green-700 transition"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </main>
  );
}