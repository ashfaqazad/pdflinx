"use client";

import {
  FileText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function SignPdfPreview({
  pdfFile,
  pdfDoc,
  totalPages,
  pageNumber,
  signaturePreview,
  xPosition,
  yPosition,
  signatureWidth,
  signatureHeight,
  scale,
  setScale,
  canvasRefs,
  renderKey,
  handleSignatureDrag,
  handleSignatureDragStart,
  handleSignatureDragEnd,
  selectPage,
}) {

  // Clamp helper
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  return (
    <div className="p-5 sm:p-6 border-t lg:border-t-0 border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Live PDF Preview
        </h3>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setScale((s) =>
                clamp(Number((s + 0.2).toFixed(2)), 0.5, 2.5)
              )
            }
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="text-xs text-gray-600 min-w-10 text-center font-medium">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() =>
              setScale((s) =>
                clamp(Number((s - 0.2).toFixed(2)), 0.5, 2.5)
              )
            }
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!pdfFile ? (
        <div className="flex items-center justify-center h-56 lg:h-[60vh] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />

            <p className="text-sm">
              Upload a PDF to see live preview
            </p>

            <p className="text-xs text-gray-300 mt-1">
              See your digital signature placement in real-time
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-100 p-3 space-y-4"
          style={{
            maxHeight: pdfFile ? "90vh" : "60vh",
          }}
          onMouseMove={handleSignatureDrag}
          onMouseUp={handleSignatureDragEnd}
          onMouseLeave={handleSignatureDragEnd}
          onTouchMove={handleSignatureDrag}
          onTouchEnd={handleSignatureDragEnd}
        >

          {/* PDF Pages */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={`page-${index}-${renderKey}`}
              className={`relative flex justify-center cursor-pointer transition-all ${
                pageNumber === index + 1
                  ? "ring-4 ring-blue-500 rounded-xl p-1.5 bg-blue-50"
                  : "hover:ring-2 hover:ring-gray-300 rounded-xl p-1.5"
              }`}
              onClick={() => selectPage(index + 1)}
            >

              {/* Page Badge */}
              <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded z-10 font-medium">
                Page {index + 1}
              </div>

              {/* Canvas */}
              <div className="relative inline-block shadow-xl max-w-full overflow-hidden">
                <canvas
                  ref={(el) => {
                    if (el) canvasRefs.current[index] = el;
                  }}
                  className="bg-white block"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />

                {/* Signature Overlay */}
                {signaturePreview && pageNumber === index + 1 && (
                  <div
                    className="absolute cursor-move border-2 border-blue-500 shadow-lg"
                    style={{
                      left: `${xPosition}px`,
                      top: `${yPosition}px`,
                      width: `${signatureWidth}px`,
                      height: `${signatureHeight}px`,
                    }}
                    onMouseDown={handleSignatureDragStart}
                    onTouchStart={handleSignatureDragStart}
                    title="Drag to move digital signature"
                  >
                    <img
                      src={signaturePreview}
                      alt="Digital signature on PDF"
                      className="w-full h-full object-contain bg-white/90 pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Overlay */}
          {!pdfDoc && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />

                <p className="text-sm text-gray-500">
                  Loading PDF preview…
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Hint */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        💡 Click a page to select it, then drag the digital signature to position it
      </p>
    </div>
  );
}