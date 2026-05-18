"use client";

import UploadStep from "@/components/ToolFlow/UploadStep";
import UploadLandingStep from "@/components/ToolFlow/UploadLandingStep";
import OptionsStep from "@/components/ToolFlow/OptionsStep";
import ProcessingStep from "@/components/ToolFlow/ProcessingStep";
import DoneStep from "@/components/ToolFlow/DoneStep";
import { STEPS } from "@/hooks/useToolFlow";

const STEP_ITEMS = [
  { key: STEPS.UPLOAD, label: "Upload" },
  { key: STEPS.OPTIONS, label: "Options" },
  { key: STEPS.PROCESSING, label: "Converting" },
  { key: STEPS.DONE, label: "Done" },
];

function stepIndex(step) {
  return STEP_ITEMS.findIndex((s) => s.key === step);
}

export default function ToolPageLayout({
  title,
  tagline,
  accept = "application/pdf",
  multiple = true,
  convertLabel = "Convert Now",
  flow,
  progress,
  hideSidebar = false,
  onRemoveFile,
  onConvert,
  onDownload,
  customOptionsLayout,

  customFilePreview,
  optionsSlot,
  optionsTitle = "Conversion options",
  showOutputFormat = false,
  outputFormatTitle = "Output format",
  outputFormats = ["DOCX (Recommended)", "DOC"],
  optionSectionLabel = "",
  showPreserveLayout = false,
  preserveLayoutTitle = "Preserve layout",
  preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",

  processingTitle = "Converting your PDF",
  processingDescription = "Please wait while we process your file.",
  processingProgressLabel = "Conversion progress",
  processingStages = ["Uploading file", "Processing", "Finishing up"],

  doneTitle = "Conversion complete!",
  doneDescription = "Your files are ready to download.",
  doneFileName = "Converted-file",
  downloadLabel = "Download File",
  resetLabel = "Convert another file",
  doneLinks = [],
  compressionStats = null,

  uploadTitle = "Drop your PDF here",
  uploadSubtitle = null,
  uploadInfo = null,
  uploadLanding = false,
  uploadLandingContent = null,

  sidebarTitle,
  sidebarIcon,
  sidebarDescription,
  sidebarNotice,
  optionsSidebarNotice,
  sidebarFeatures = [],
}) {
  const currentIndex = stepIndex(flow.step);
  const isPremiumUpload = flow.step === STEPS.UPLOAD && uploadLanding;

  // Jab customOptionsLayout ho — sidebar bilkul nahi chahiye
  const isCustomOptions = flow.step === STEPS.OPTIONS && !!customOptionsLayout;

  return (
    // <main className={isPremiumUpload ? "bg-white" : "bg-slate-50"}>
    <main className={`${isPremiumUpload ? "bg-white" : "bg-slate-50"} overflow-hidden`}>
      {/* Header - hide on premium upload + options + processing */}
      {!isPremiumUpload &&
        flow.step !== STEPS.OPTIONS &&
        flow.step !== STEPS.PROCESSING &&
        flow.step !== STEPS.DONE && (
          <div className="border-b border-slate-200 bg-white">
            <div className="flex justify-center px-6 py-5">
              <div className="flex w-full max-w-[1055px] items-center gap-4">
                {sidebarIcon && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#f24d0d] shadow-[0_4px_14px_rgba(242,77,13,0.28)]">
                    {sidebarIcon}
                  </div>
                )}
                <div>
                  <h1 className="font-display text-[28px] font-normal tracking-tight text-[#0f0e0d]">
                    {title}
                  </h1>
                  {tagline && (
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {tagline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      <section>
        <div
          className={
            isPremiumUpload
              ? "bg-white"
              : "overflow-hidden border-slate-200 bg-white shadow-sm scrollbar-hide"
          }
        >
          <div
            className={`grid ${isPremiumUpload
              ? "grid-cols-1"
              : `min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] ${flow.step === STEPS.PROCESSING || hideSidebar || isCustomOptions
                ? "grid-cols-1"
                : "lg:grid-cols-[minmax(0,1fr)_350px]"
              }`
              }`}
          >
            {/* Main area */}
            <div
              className={
                isPremiumUpload
                  ? "min-w-0 bg-white p-0 overflow-visible"
                  : isCustomOptions
                    ? "min-w-0 overflow-hidden"
                    : `min-w-0 bg-slate-100 p-8 ${flow.step === STEPS.UPLOAD
                      ? "overflow-hidden"
                      : "custom-tool-scroll overflow-y-auto"
                    }`
              }
            >
              {/* UPLOAD STEP */}
              {flow.step === STEPS.UPLOAD &&
                (isPremiumUpload ? (
                  <UploadLandingStep
                    onFilesSelect={flow.selectFiles}
                    accept={accept}
                    multiple={multiple}
                    uploadTitle={uploadTitle}
                    uploadSubtitle={uploadSubtitle}
                    uploadInfo={uploadInfo}
                    content={uploadLanding?.content}
                  />
                ) : (
                  <div className="flex w-full justify-center">
                    <UploadStep
                      onFilesSelect={flow.selectFiles}
                      accept={accept}
                      multiple={multiple}
                      uploadInfo={uploadInfo}
                      uploadTitle={uploadTitle}
                      uploadSubtitle={uploadSubtitle}
                    />
                  </div>
                ))}

              {/* OPTIONS STEP */}
              {flow.step === STEPS.OPTIONS &&
                (customOptionsLayout ? (
                  // Custom layout — full width, no sidebar
                  <>{customOptionsLayout}</>
                ) : (
                  // Default OptionsStep — with sidebar
                  <OptionsStep
                    files={flow.files}
                    onRemoveFile={onRemoveFile}
                    onBack={flow.reset}
                    error={flow.error}
                    accept={accept}
                    multiple={multiple}
                    onAddFiles={(newFiles) => {
                      flow.selectFiles([...flow.files, ...newFiles]);
                    }}
                    optionsTitle={optionsTitle}
                    showOutputFormat={showOutputFormat}
                    outputFormatTitle={outputFormatTitle}
                    outputFormats={outputFormats}
                    optionSectionLabel={optionSectionLabel}
                    showPreserveLayout={showPreserveLayout}
                    preserveLayoutTitle={preserveLayoutTitle}
                    preserveLayoutDescription={preserveLayoutDescription}
                    customFilePreview={customFilePreview ?? null}
                  >
                    {optionsSlot}
                  </OptionsStep>
                ))}

              {/* PROCESSING STEP */}
              {flow.step === STEPS.PROCESSING && (
                <ProcessingStep
                  progress={progress}
                  fileCount={flow.files.length}
                  title={processingTitle}
                  description={processingDescription}
                  progressLabel={processingProgressLabel}
                  stages={processingStages}
                />
              )}

              {/* DONE STEP */}
              {flow.step === STEPS.DONE && (
                <DoneStep
                  fileCount={flow.files.length}
                  fileName={doneFileName}
                  title={doneTitle}
                  description={doneDescription}
                  downloadLabel={downloadLabel}
                  resetLabel={resetLabel}
                  onDownload={onDownload}
                  onReset={flow.reset}
                  relatedLinks={doneLinks}
                  compressionStats={compressionStats}
                />
              )}
            </div>

            {/* SIDEBAR — customOptionsLayout hone par bilkul hide */}
            {!hideSidebar &&
              !isPremiumUpload &&
              !isCustomOptions &&
              flow.step !== STEPS.PROCESSING && (
                <aside className="border-t border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-y-auto lg:border-l lg:border-t-0">

                  {/* // <aside className="border-t border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:rounded-l-[35px] lg:border-l lg:border-t-0 lg:-ml-6"> */}
                  {/* UPLOAD sidebar */}
                  {flow.step === STEPS.UPLOAD && (
                    <div className="space-y-4">
                      <div className="-mx-5 border-b border-slate-200 px-5 pb-5 text-center">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {sidebarTitle || title}
                        </h3>
                        {sidebarDescription && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {sidebarDescription}
                          </p>
                        )}
                      </div>
                      {sidebarNotice && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 shadow-sm">
                          {sidebarNotice}
                        </div>
                      )}
                    </div>
                  )}

                  {/* OPTIONS sidebar — sirf jab customOptionsLayout nahi hai */}
                  {/* {flow.step === STEPS.OPTIONS && (
                    <div className="space-y-5">
                      <h3 className="border-b border-slate-200 pb-3 text-center text-xl font-bold text-slate-900">
                        {sidebarTitle || "PDF to Word"}
                      </h3>
                      {optionsSidebarNotice}
                      <button
                        type="button"
                        onClick={onConvert}
                        disabled={!flow.files.length}
                        className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
                          ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)] hover:shadow-[0_14px_40px_rgba(242,77,13,0.45)]"
                          : "cursor-not-allowed bg-slate-300"
                          }`}
                      >
                        {convertLabel}
                      </button>
                    </div>
                  )} */}

                  {flow.step === STEPS.OPTIONS && (
                    <div className="flex flex-col h-full">
                      {/* Top — title + options */}
                      <div className="flex-1 space-y-5">
                        <h3 className="border-b border-slate-200 pb-3 text-center text-xl font-bold text-slate-900">
                          {sidebarTitle || "PDF to Word"}
                        </h3>
                        {optionsSidebarNotice}
                      </div>

                      {/* Bottom — fixed convert button */}
                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <button
                          type="button"
                          onClick={onConvert}
                          disabled={!flow.files.length}
                          className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white transition active:scale-[0.98] ${flow.files.length
                              ? "bg-[#f24d0d] hover:bg-[#dc4308] shadow-[0_10px_30px_rgba(242,77,13,0.38)]"
                              : "cursor-not-allowed bg-slate-300"
                            }`}
                        >
                          {convertLabel}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DONE sidebar */}
                  {flow.step === STEPS.DONE && (
                    <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm">
                      <h3 className="border-b border-black/10 px-5 py-4 font-display text-xl font-normal text-[#0f0e0d]">
                        Continue with...
                      </h3>
                      <div>
                        {doneLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.href}
                            className="flex items-center gap-3 border-b border-black/10 px-5 py-4 text-sm font-medium text-[#0f0e0d] transition last:border-b-0 hover:bg-[#f5f4f1]"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f4f1]">
                              {link.icon}
                            </span>
                            <span className="flex-1">{link.label}</span>
                            <span className="text-[#7a7772]">›</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}



