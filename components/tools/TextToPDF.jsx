'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function TextToPDF() {
  // ✅ Empty initial state (no pre-filled text)
  const [text, setText] = useState('');

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    const lines = doc.splitTextToSize(text, maxWidth);

    let y = 20;
    const lineHeight = 5;

    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save('text-to-pdf.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Text to PDF Converter
        </h1>

        {/* ✅ Textarea size increased */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[300px] p-6 text-base leading-relaxed border-2 border-gray-300 rounded-2xl focus:border-blue-600 outline-none resize-y font-mono bg-gray-50"
          placeholder="Paste your resume or text here..."
        />

        <div className="text-center mt-8">
          <button
            onClick={generatePDF}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-16 py-5 rounded-full text-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all shadow-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

