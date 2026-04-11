"use client";

import { useEffect, useRef, useState } from "react";

export default function PdfPreviewSelector({ file, selectedPages, setSelectedPages }) {
  const containerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const selectedPagesRef = useRef(selectedPages);

  useEffect(() => {
    selectedPagesRef.current = selectedPages;
  }, [selectedPages]);

  useEffect(() => {
    if (!file || !containerRef.current) return;

    let cancelled = false;
    let tries = 0;

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

      file.arrayBuffer().then((buf) => {
        lib.getDocument({ data: buf }).promise.then((pdf) => {
          if (cancelled) return;

          setTotalPages(pdf.numPages);

          const renderPage = (i) => {
            if (cancelled || i > pdf.numPages) return;

            pdf.getPage(i).then((page) => {
              const viewport = page.getViewport({ scale: 0.45 });

              const wrapper = document.createElement("div");
              wrapper.className =
                "relative rounded-xl border-2 border-gray-200 bg-white p-3 cursor-pointer transition hover:shadow-md";

              const canvas = document.createElement("canvas");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              canvas.className = "mx-auto block";

              const label = document.createElement("p");
              label.textContent = `Page ${i}`;
              label.className =
                "text-center text-sm font-medium text-gray-700 mt-3";

              const badge = document.createElement("span");
              badge.textContent = "✓ Selected";
              badge.className =
                "hidden absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full";

              wrapper.appendChild(canvas);
              wrapper.appendChild(label);
              wrapper.appendChild(badge);

              const applySelected = () => {
                wrapper.classList.remove("border-gray-200", "bg-white");
                wrapper.classList.add("border-red-500", "bg-red-50");
                badge.classList.remove("hidden");
              };

              const applyUnselected = () => {
                wrapper.classList.remove("border-red-500", "bg-red-50");
                wrapper.classList.add("border-gray-200", "bg-white");
                badge.classList.add("hidden");
              };

              wrapper.onclick = () => {
                const current = selectedPagesRef.current;
                const exists = current.includes(i);
                if (exists) {
                  applyUnselected();
                  setSelectedPages(current.filter((p) => p !== i));
                } else {
                  applySelected();
                  setSelectedPages([...current, i].sort((a, b) => a - b));
                }
              };

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
      }).catch((err) => {
        console.error("PDF load error:", err);
      });
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className="space-y-4">
      {file && (
        <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-sm font-medium text-gray-700">
            Total pages:{" "}
            <span className="font-bold text-blue-700">{totalPages}</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            Selected:{" "}
            <span className="font-bold text-red-600">
              {selectedPages.length ? selectedPages.join(", ") : "None"}
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