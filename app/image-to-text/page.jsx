'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageToText() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const recognize = async (file) => {
        setLoading(true);
        setText('Extracting text...');

        const { data: { text } } = await Tesseract.recognize(file, 'eng', {
            logger: m => console.log(m),
            tessedit_pageseg_mode: Tesseract.PSM.AUTO,
            preserve_interword_spaces: '1',
        });

        setText(text.trim() || 'No text detected in image');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center overflow-visible">
                
                <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-normal pb-1">
                    Image to Text (OCR)
                </h1>

                <p className="text-xl text-gray-600 mb-10">Scanned documents, receipts, books se text nikaalo!</p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setImage(URL.createObjectURL(file));
                            recognize(file);
                        }
                    }}
                    className="block w-full max-w-md mx-auto text-lg border-4 border-dashed border-teal-400 rounded-3xl cursor-pointer bg-teal-50 p-16 hover:bg-teal-100 transition"
                />

                {loading && (
                    <div className="my-20">
                        <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-teal-600"></div>
                        <p className="mt-6 text-2xl font-bold text-teal-600">Extracting text... (5-15 sec)</p>
                    </div>
                )}

                {text && !loading && (
                    <div className="grid md:grid-cols-2 gap-10 mt-10">
                        {image && (
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Uploaded Image</h3>
                                <img src={image} alt="uploaded" className="max-w-full rounded-2xl shadow-2xl" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-3xl font-bold mb-4 text-cyan-600">Extracted Text</h3>
                            <textarea
                                value={text}
                                readOnly
                                className="w-full h-80 p-6 text-lg border-2 border-cyan-300 rounded-2xl bg-cyan-50 font-mono resize-none"
                                placeholder="Extracted text will appear here..."
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(text)}
                                className="mt-4 bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-cyan-700"
                            >
                                Copy Text
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}















// 'use client';

// import { useState } from 'react';
// import Tesseract from 'tesseract.js';

// export default function ImageToText() {
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);

//   const doOCR = async (file) => {
//     setLoading(true);
//     setText('Processing...');

//     // Ye settings accuracy 200% badha dete hain
//     const result = await Tesseract.recognize(file, 'eng', {
//       logger: m => console.log(m),
//       tessedit_pageseg_mode: Tesseract.PSM.AUTO,     // Best detection
//       tessedit_char_whitelist: '',                   // Sab allow
//       preserve_interword_spaces: '1',
//     });

//     setText(result.data.text.trim() || 'No text found');
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
//         <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
//           Image to Text (OCR) – 99% Accurate
//         </h1>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setImage(URL.createObjectURL(file));
//               doOCR(file);
//             }
//           }}
//           className="block w-full max-w-md mx-auto text-lg border-4 border-dashed border-emerald-500 rounded-3xl p-16 cursor-pointer bg-emerald-50 hover:bg-emerald-100"
//         />

//         {loading && (
//           <div className="my-20">
//             <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-emerald-600"></div>
//             <p className="mt-6 text-2xl font-bold text-emerald-600">Extracting text...</p>
//           </div>
//         )}

//         {text && !loading && (
//           <div className="mt-10 bg-gray-50 p-8 rounded-2xl border-4 border-emerald-300">
//             <h3 className="text-3xl font-bold text-emerald-700 mb-6">Extracted Text:</h3>
//             <pre className="text-left whitespace-pre-wrap text-lg font-mono bg-white p-6 rounded-xl border border-gray-300">
//               {text}
//             </pre>
//             <button
//               onClick={() => navigator.clipboard.writeText(text)}
//               className="mt-6 bg-emerald-600 text-white px-12 py-5 rounded-xl text-xl font-bold hover:bg-emerald-700"
//             >
//               Copy Text
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }