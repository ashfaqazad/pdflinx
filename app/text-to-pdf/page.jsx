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














// 'use client';

// import { useState } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export default function TextToPDF() {
//   const [text, setText] = useState(`ASHFAQUE AHMED BHUTTO
// Contact Information
// Phone : +92 333 2758958
// Email  : ashfaqahmedazad@gmail.com
// LinkedIn : https://www.linkedin.com/in/ashfaque
// GitHub  : https://github.com/ashfaqazad
// Portfolio: https://www.ashfaqdev.cloud

// PROFESSIONAL SUMMARY
// Full-stack MERN & Next.js Developer with an M.B.A. in Management – University of Sindh, Jamshoro
// Extensive IT experience. Proven ability to develop responsive, secure, and SEO-friendly web applications using React.js, Next.js, Node.js, and MongoDB.

// PROFESSIONAL EXPERIENCE
// MERN & Next.js Developer | ashfaqDev, Pakistan (2021 – Present)
// • Developed full-stack web applications using React, Next.js and Node.js
// • Built and integrated RESTful APIs
// • Implemented secure JWT-based authentication
// • Designed SEO-friendly, responsive UIs using TailwindCSS
// • Deployed projects on live servers with domain configuration

// IT Officer | Pakistan Standards & Quality Control Authority (2008 – Present)
// • Maintained IT infrastructure and performed system administration
// • Monitored database systems and ensured data security`);

//   const generatePDF = () => {
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     // Clean settings
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(10);           // perfect resume size
//     doc.setTextColor(0, 0, 0);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 15;
//     const maxWidth = pageWidth - 2 * margin;

//     // Split text properly with line height
//     const lines = doc.splitTextToSize(text, maxWidth);

//     let y = 20;
//     const lineHeight = 5;

//     lines.forEach(line => {
//       if (y > 280) { // new page if needed
//         doc.addPage();
//         y = 20;
//       }
//       doc.text(line, margin, y);
//       y += lineHeight;
//     });

//     doc.save('resume-ashfaque-ahmed.pdf');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
//         <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//           Text to PDF Converter (Resume Ready)
//         </h1>

//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="w-full h-screen-max p-8 text-sm leading-relaxed border-2 border-gray-300 rounded-2xl focus:border-blue-600 outline-none resize-none font-mono bg-gray-50"
//           placeholder="Paste your resume/text here..."
//         />

//         <div className="text-center mt-8">
//           <button
//             onClick={generatePDF}
//             className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-20 py-8 rounded-full text-3xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all shadow-lg"
//           >
//             Download PDF (Perfect Format)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }