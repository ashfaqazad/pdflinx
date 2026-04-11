"use client";

import { useEffect, useRef, useState } from "react";

export default function PageNumberPreview({
  file,
  position,
  startNumber,
  fontSize,
  margin,
}) {
  const containerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    let cancelled = false;
    let tries = 0;

    const getPositionClasses = (pos) => {
      switch (pos) {
        case "top-left":
          return { top: `${margin}px`, left: `${margin}px` };
        case "top-center":
          return {
            top: `${margin}px`,
            left: "50%",
            transform: "translateX(-50%)",
          };
        case "top-right":
          return { top: `${margin}px`, right: `${margin}px` };
        case "bottom-left":
          return { bottom: `${margin}px`, left: `${margin}px` };
        case "bottom-center":
          return {
            bottom: `${margin}px`,
            left: "50%",
            transform: "translateX(-50%)",
          };
        case "bottom-right":
        default:
          return { bottom: `${margin}px`, right: `${margin}px` };
      }
    };

    const renderPdf = () => {
      const lib = window?.pdfjsLib;

      if (!lib) {
        if (tries++ < 80) {
          setTimeout(renderPdf, 100);
        } else {
          console.error("pdfjsLib CDN load nahi hua");
        }
        return;
      }

      if (cancelled) return;

      containerRef.current.innerHTML = "";

      file
        .arrayBuffer()
        .then((buf) => {
          lib.getDocument({ data: buf }).promise.then((pdf) => {
            if (cancelled) return;

            setTotalPages(pdf.numPages);

            const renderPage = (i) => {
              if (cancelled || i > pdf.numPages) return;

              pdf.getPage(i).then((page) => {
                const viewport = page.getViewport({ scale: 0.45 });

                const wrapper = document.createElement("div");
                wrapper.className =
                  "relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm";

                const canvas = document.createElement("canvas");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.className = "mx-auto block";

                const label = document.createElement("p");
                label.textContent = `Page ${i}`;
                label.className =
                  "text-center text-sm font-medium text-gray-700 mt-3";

                const pageNumber = document.createElement("span");
                pageNumber.textContent = String(Number(startNumber) + i - 1);
                pageNumber.className =
                  "absolute z-10 bg-black/70 text-white px-2 py-1 rounded-md leading-none pointer-events-none";
                pageNumber.style.fontSize = `${fontSize}px`;

                const posStyles = getPositionClasses(position);
                Object.assign(pageNumber.style, posStyles);

                wrapper.appendChild(canvas);
                wrapper.appendChild(pageNumber);
                wrapper.appendChild(label);
                containerRef.current?.appendChild(wrapper);

                page
                  .render({ canvasContext: canvas.getContext("2d"), viewport })
                  .promise.then(() => {
                    renderPage(i + 1);
                  });
              });
            };

            renderPage(1);
          });
        })
        .catch((err) => {
          console.error("PDF load error:", err);
        });
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [file, position, startNumber, fontSize, margin]);

  return (
    <div className="space-y-4">
      {file && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-sm font-medium text-gray-700">
            Total pages:{" "}
            <span className="font-bold text-blue-700">{totalPages}</span>
          </p>

          <p className="text-sm font-medium text-gray-700">
            Start from:{" "}
            <span className="font-bold text-indigo-700">{startNumber}</span>
          </p>

          <p className="text-sm font-medium text-gray-700">
            Position:{" "}
            <span className="font-bold text-purple-700 capitalize">
              {position.replace("-", " ")}
            </span>
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      />
    </div>
  );
}