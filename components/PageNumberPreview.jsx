"use client";

import { useEffect, useRef } from "react";

export default function PageNumberPreview({
  file,
  position,
  startNumber,
  fontSize,
  margin,
  fontColor = "#000000",
  fontFamily = "Helvetica",
  format = "n", // ← ADD
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    let cancelled = false;
    let tries = 0;

    const getPositionStyles = (pos) => {
      const base = {
        position: "absolute",
        zIndex: "10",
        color: fontColor,
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: "1",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      };

      switch (pos) {
        case "top-left":
          return { ...base, top: `${margin}px`, left: `${margin}px` };
        case "top-center":
          return { ...base, top: `${margin}px`, left: "50%", transform: "translateX(-50%)" };
        case "top-right":
          return { ...base, top: `${margin}px`, right: `${margin}px` };
        case "bottom-left":
          return { ...base, bottom: `${margin}px`, left: `${margin}px` };
        case "bottom-center":
          return { ...base, bottom: `${margin}px`, left: "50%", transform: "translateX(-50%)" };
        case "bottom-right":
        default:
          return { ...base, bottom: `${margin}px`, right: `${margin}px` };
      }
    };

    const renderPdf = () => {
      const lib = window?.pdfjsLib;
      if (!lib) {
        if (tries++ < 80) setTimeout(renderPdf, 100);
        else console.error("pdfjsLib load failed");
        return;
      }
      if (cancelled) return;

      containerRef.current.innerHTML = "";

      file.arrayBuffer()
        .then((buf) => lib.getDocument({ data: buf }).promise)
        .then((pdf) => {
          if (cancelled) return;

          const renderPage = (i) => {
            if (cancelled || i > pdf.numPages) return;
            pdf.getPage(i).then((page) => {
              const viewport = page.getViewport({ scale: 0.45 });

              const wrapper = document.createElement("div");
              wrapper.style.cssText = `
                position:relative; display:inline-block; flex-shrink:0;
                border-radius:12px; border:1px solid #e2e8f0;
                background:white; padding:8px;
                box-shadow:0 1px 4px rgba(0,0,0,0.08); overflow:hidden;
              `;

              const canvas = document.createElement("canvas");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              canvas.style.cssText = "display:block; width:100%; height:auto;";

              const pageNum = document.createElement("span");
              // pageNum.textContent = String(Number(startNumber) + i - 1);
              const n = Number(startNumber) + i - 1;
              const total = pdf.numPages; // pdf variable already available hai
              pageNum.textContent =
                format === "page-n" ? `Page ${n}` :
                  format === "n-of-t" ? `${n} / ${total}` :
                    format === "dash-n" ? `- ${n} -` :
                      String(n);

              Object.assign(pageNum.style, getPositionStyles(position));

              wrapper.appendChild(canvas);
              wrapper.appendChild(pageNum);
              containerRef.current?.appendChild(wrapper);

              page.render({ canvasContext: canvas.getContext("2d"), viewport })
                .promise.then(() => renderPage(i + 1));
            });
          };

          renderPage(1);
        })
        .catch((err) => console.error("PDF load error:", err));
    };

    renderPdf();
    return () => { cancelled = true; };

  }, [file, position, startNumber, fontSize, margin, fontColor, fontFamily, format]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "20px",
        width: "100%",
      }}
    />
  );
}































// "use client";

// import { useEffect, useRef, useState } from "react";

// // export default function PageNumberPreview({
// //   file,
// //   position,
// //   startNumber,
// //   fontSize,
// //   margin,
// // }) {

// export default function PageNumberPreview({
//   file, position, startNumber, fontSize, margin, fontColor = "#000000", fontFamily = "Helvetica",
// }) {

//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!file || !containerRef.current) return;

//     let cancelled = false;
//     let tries = 0;

//     const getPositionStyles = (pos) => {

//       const base = {
//         position: "absolute",
//         zIndex: "10",
//         color: fontColor,
//         fontFamily: fontFamily,
//         lineHeight: "1",
//         pointerEvents: "none",
//         fontSize: `${fontSize}px`,
//       };

//       // const base = {
//       //   position: "absolute",
//       //   zIndex: "10",
//       //   background: "rgba(0,0,0,0.7)",
//       //   color: "white",
//       //   padding: "2px 8px",
//       //   borderRadius: "6px",
//       //   lineHeight: "1",
//       //   pointerEvents: "none",
//       //   fontSize: `${fontSize}px`,
//       // };

//       switch (pos) {
//         case "top-left":
//           return { ...base, top: `${margin}px`, left: `${margin}px` };
//         case "top-center":
//           return { ...base, top: `${margin}px`, left: "50%", transform: "translateX(-50%)" };
//         case "top-right":
//           return { ...base, top: `${margin}px`, right: `${margin}px` };
//         case "bottom-left":
//           return { ...base, bottom: `${margin}px`, left: `${margin}px` };
//         case "bottom-center":
//           return { ...base, bottom: `${margin}px`, left: "50%", transform: "translateX(-50%)" };
//         case "bottom-right":
//         default:
//           return { ...base, bottom: `${margin}px`, right: `${margin}px` };
//       }
//     };

//     const renderPdf = () => {
//       const lib = window?.pdfjsLib;

//       if (!lib) {
//         if (tries++ < 80) setTimeout(renderPdf, 100);
//         else console.error("pdfjsLib CDN load nahi hua");
//         return;
//       }

//       if (cancelled) return;

//       containerRef.current.innerHTML = "";

//       file.arrayBuffer()
//         .then((buf) => {
//           lib.getDocument({ data: buf }).promise.then((pdf) => {
//             if (cancelled) return;

//             const renderPage = (i) => {
//               if (cancelled || i > pdf.numPages) return;

//               pdf.getPage(i).then((page) => {
//                 const viewport = page.getViewport({ scale: 0.45 });

//                 // ── Wrapper ──
//                 const wrapper = document.createElement("div");
//                 wrapper.style.position = "relative";
//                 wrapper.style.display = "inline-block";
//                 wrapper.style.flexShrink = "0";
//                 wrapper.style.borderRadius = "12px";
//                 wrapper.style.border = "1px solid #e2e8f0";
//                 wrapper.style.background = "white";
//                 wrapper.style.padding = "8px";
//                 wrapper.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
//                 wrapper.style.overflow = "hidden";
//                 // wrapper.style.width = "fit-content";

//                 // ── Canvas ──
//                 const canvas = document.createElement("canvas");
//                 canvas.height = viewport.height;
//                 canvas.width = viewport.width;
//                 // canvas.style.display = "block";
//                 canvas.style.display = "block";
//                 canvas.style.width = "100%";
//                 canvas.style.height = "auto";

//                 // ── Page number overlay ──
//                 const pageNumber = document.createElement("span");
//                 pageNumber.textContent = String(Number(startNumber) + i - 1);
//                 Object.assign(pageNumber.style, getPositionStyles(position));

//                 wrapper.appendChild(canvas);
//                 wrapper.appendChild(pageNumber);
//                 containerRef.current?.appendChild(wrapper);

//                 page.render({
//                   canvasContext: canvas.getContext("2d"),
//                   viewport,
//                 }).promise.then(() => {
//                   renderPage(i + 1);
//                 });
//               });
//             };

//             renderPage(1);
//           });
//         })
//         .catch((err) => console.error("PDF load error:", err));
//     };

//     renderPdf();
//     return () => { cancelled = true; };

//   // }, [file, position, startNumber, fontSize, margin]);
//   }, [file, position, startNumber, fontSize, margin, fontColor, fontFamily]);


//   return (
//     <div
//       ref={containerRef}
//       style={{
//         display: "grid",
//         // gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//         gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//         gap: "20px",
//         width: "100%",
//       }}
//     />
//   );

//   // return (
//   //   <div
//   //     ref={containerRef}
//   //     style={{
//   //       display: "flex",
//   //       gap: "20px",
//   //       overflowX: "auto",
//   //       alignItems: "flex-start",
//   //       width: "100%",
//   //       paddingBottom: "10px",
//   //     }}
//   //   />
//   // );
// }
























// // "use client";

// // import { useEffect, useRef, useState } from "react";

// // export default function PageNumberPreview({
// //   file,
// //   position,
// //   startNumber,
// //   fontSize,
// //   margin,
// // }) {
// //   const containerRef = useRef(null);
// //   const [totalPages, setTotalPages] = useState(0);

// //   useEffect(() => {
// //     if (!file || !containerRef.current) return;

// //     let cancelled = false;
// //     let tries = 0;

// //     const getPositionClasses = (pos) => {
// //       switch (pos) {
// //         case "top-left":
// //           return { top: `${margin}px`, left: `${margin}px` };
// //         case "top-center":
// //           return {
// //             top: `${margin}px`,
// //             left: "50%",
// //             transform: "translateX(-50%)",
// //           };
// //         case "top-right":
// //           return { top: `${margin}px`, right: `${margin}px` };
// //         case "bottom-left":
// //           return { bottom: `${margin}px`, left: `${margin}px` };
// //         case "bottom-center":
// //           return {
// //             bottom: `${margin}px`,
// //             left: "50%",
// //             transform: "translateX(-50%)",
// //           };
// //         case "bottom-right":
// //         default:
// //           return { bottom: `${margin}px`, right: `${margin}px` };
// //       }
// //     };

// //     const renderPdf = () => {
// //       const lib = window?.pdfjsLib;

// //       if (!lib) {
// //         if (tries++ < 80) {
// //           setTimeout(renderPdf, 100);
// //         } else {
// //           console.error("pdfjsLib CDN load nahi hua");
// //         }
// //         return;
// //       }

// //       if (cancelled) return;

// //       containerRef.current.innerHTML = "";

// //       file
// //         .arrayBuffer()
// //         .then((buf) => {
// //           lib.getDocument({ data: buf }).promise.then((pdf) => {
// //             if (cancelled) return;

// //             setTotalPages(pdf.numPages);

// //             const renderPage = (i) => {
// //               if (cancelled || i > pdf.numPages) return;

// //               pdf.getPage(i).then((page) => {
// //                 const viewport = page.getViewport({ scale: 0.45 });

// //                 const wrapper = document.createElement("div");
// //                 wrapper.className =
// //                   "relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm";

// //                 const canvas = document.createElement("canvas");
// //                 canvas.height = viewport.height;
// //                 canvas.width = viewport.width;
// //                 canvas.className = "mx-auto block";

// //                 // const label = document.createElement("p");
// //                 // label.textContent = `Page ${i}`;
// //                 // label.className =
// //                 //   "text-center text-sm font-medium text-gray-700 mt-3";

// //                 const pageNumber = document.createElement("span");
// //                 pageNumber.textContent = String(Number(startNumber) + i - 1);
// //                 pageNumber.className =
// //                   "absolute z-10 bg-black/70 text-white px-2 py-1 rounded-md leading-none pointer-events-none";
// //                 pageNumber.style.fontSize = `${fontSize}px`;

// //                 const posStyles = getPositionClasses(position);
// //                 Object.assign(pageNumber.style, posStyles);

// //                 wrapper.appendChild(canvas);
// //                 wrapper.appendChild(pageNumber);
// //                 // wrapper.appendChild(label);
// //                 containerRef.current?.appendChild(wrapper);

// //                 page
// //                   .render({ canvasContext: canvas.getContext("2d"), viewport })
// //                   .promise.then(() => {
// //                     renderPage(i + 1);
// //                   });
// //               });
// //             };

// //             renderPage(1);
// //           });
// //         })
// //         .catch((err) => {
// //           console.error("PDF load error:", err);
// //         });
// //     };

// //     renderPdf();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [file, position, startNumber, fontSize, margin]);

// //   return (
// //     <>

// //       <div
// //         ref={containerRef}
// //         className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
// //       />

// //     </>
// //   );
// // }







// // // <div className="space-y-4">
// //     //   {file && (
// //     //     <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
// //     //       <p className="text-sm font-medium text-gray-700">
// //     //         Total pages:{" "}
// //     //         <span className="font-bold text-blue-700">{totalPages}</span>
// //     //       </p>

// //     //       <p className="text-sm font-medium text-gray-700">
// //     //         Start from:{" "}
// //     //         <span className="font-bold text-indigo-700">{startNumber}</span>
// //     //       </p>

// //     //       <p className="text-sm font-medium text-gray-700">
// //     //         Position:{" "}
// //     //         <span className="font-bold text-purple-700 capitalize">
// //     //           {position.replace("-", " ")}
// //     //         </span>
// //     //       </p>
// //     //     </div>
// //     //   )}

// //     //   <div
// //     //     ref={containerRef}
// //     //     className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
// //     //   />
// //     // </div>