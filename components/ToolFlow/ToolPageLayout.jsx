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
  onRemoveFile,
  onConvert,
  onDownload,

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

  return (
    <main className={isPremiumUpload ? "bg-white" : "bg-slate-50"}>
      {/* Header - hide on premium upload */}
      {!isPremiumUpload &&
        flow.step !== STEPS.OPTIONS &&
        flow.step !== STEPS.PROCESSING && (
          <div className="border-b border-slate-200 bg-white">
            <div className="flex justify-center px-6 py-5">
              <div className="flex w-full max-w-[1055px] items-center gap-4">
                {sidebarIcon && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow">
                    {sidebarIcon}
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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
              : "overflow-hidden border-slate-200 bg-white shadow-sm"
          }
        >
          <div
            className={`grid ${
              isPremiumUpload
                ? "grid-cols-1"
                : `min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] ${
                    flow.step === STEPS.PROCESSING
                      ? "grid-cols-1"
                      : "lg:grid-cols-[minmax(0,1fr)_300px]"
                  }`
            }`}
          >
            {/* Main area */}
            <div
              className={
                isPremiumUpload
                  ? "min-w-0 bg-white p-0 overflow-visible"
                  : `min-w-0 bg-slate-100 p-8 ${
                      flow.step === STEPS.UPLOAD
                        ? "overflow-hidden"
                        : "custom-tool-scroll overflow-y-auto"
                    }`
              }
            >
              {flow.step === STEPS.UPLOAD &&
                (isPremiumUpload ? (
                  <UploadLandingStep
                    onFilesSelect={flow.selectFiles}
                    accept={accept}
                    multiple={multiple}
                    uploadTitle={uploadTitle}
                    uploadSubtitle={uploadSubtitle}
                    uploadInfo={uploadInfo}
                    content={uploadLandingContent}
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

              {flow.step === STEPS.OPTIONS && (
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
                  customFilePreview={customFilePreview}
                >
                  {optionsSlot}
                </OptionsStep>
              )}

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

            {/* Sidebar - hide on premium upload + processing */}
            {!isPremiumUpload && flow.step !== STEPS.PROCESSING && (
              <aside className="border-t border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:rounded-l-[35px] lg:border-l lg:border-t-0 lg:-ml-6">
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

                {flow.step === STEPS.OPTIONS && (
                  <div className="space-y-5">
                    <h3 className="border-b border-slate-200 pb-3 text-center text-xl font-bold text-slate-900">
                      {sidebarTitle || "PDF to Word"}
                    </h3>

                    {optionsSidebarNotice}

                    <button
                      type="button"
                      onClick={onConvert}
                      disabled={!flow.files.length}
                      className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white ${
                        flow.files.length
                          ? "bg-[#1D9E75] hover:bg-[#0F6E56]"
                          : "cursor-not-allowed bg-slate-300"
                      }`}
                    >
                      {convertLabel}
                    </button>
                  </div>
                )}

                {flow.step === STEPS.DONE && (
                  <div>
                    <h3 className="mb-4 text-base font-bold text-slate-900">
                      Continue with...
                    </h3>

                    <div className="space-y-2">
                      {doneLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1D9E75]"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                            {link.icon}
                          </span>
                          <span className="flex-1">{link.label}</span>
                          <span className="text-slate-400">›</span>
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
























// "use client";

// import UploadStep from "@/components/ToolFlow/UploadStep";
// import OptionsStep from "@/components/ToolFlow/OptionsStep";
// import ProcessingStep from "@/components/ToolFlow/ProcessingStep";
// import DoneStep from "@/components/ToolFlow/DoneStep";
// import { STEPS } from "@/hooks/useToolFlow";
// import UploadLandingStep from "./UploadLandingStep";

// const STEP_ITEMS = [
//   { key: STEPS.UPLOAD, label: "Upload" },
//   { key: STEPS.OPTIONS, label: "Options" },
//   { key: STEPS.PROCESSING, label: "Converting" },
//   { key: STEPS.DONE, label: "Done" },
// ];

// function stepIndex(step) {
//   return STEP_ITEMS.findIndex((s) => s.key === step);
// }

// export default function ToolPageLayout({
//   title,
//   tagline,
//   accept = "application/pdf",
//   multiple = true,
//   convertLabel = "Convert Now",
//   flow,
//   progress,
//   onRemoveFile,
//   onConvert,
//   onDownload,

//   customFilePreview,
//   optionsSlot,
//   optionsTitle = "Conversion options",
//   showOutputFormat = false,
//   outputFormatTitle = "Output format",
//   outputFormats = ["DOCX (Recommended)", "DOC"],
//   optionSectionLabel = "",
//   showPreserveLayout = false,
//   preserveLayoutTitle = "Preserve layout",
//   preserveLayoutDescription = "Keep headings, paragraphs, and basic spacing where possible.",

//   processingTitle = "Converting your PDF",
//   processingDescription = "Please wait while we process your file.",
//   processingProgressLabel = "Conversion progress",
//   processingStages = ["Uploading file", "Processing", "Finishing up"],

//   doneTitle = "Conversion complete!",
//   doneDescription = "Your files are ready to download.",
//   doneFileName = "Converted-file",
//   downloadLabel = "Download File",
//   resetLabel = "Convert another file",
//   doneLinks = [],
//   compressionStats = null,
//   uploadTitle = "Drop your PDF here",
//   uploadSubtitle = null,
//   uploadLanding = false,
//   uploadLandingContent = null,


//   sidebarTitle,
//   sidebarIcon,
//   sidebarDescription,
//   sidebarNotice,
//   optionsSidebarNotice,
//   uploadInfo = null,
//   uploadSidebarInfo = null,
//   sidebarFeatures = [],
// }) {
//   const currentIndex = stepIndex(flow.step);

//   return (
//     <main className="bg-slate-50">
//       {/* Header */}
//       {/* {flow.step !== STEPS.OPTIONS && ( */}
//       {flow.step !== STEPS.OPTIONS && flow.step !== STEPS.PROCESSING && (
//         <div className="border-b border-slate-200 bg-white">
//           {/* <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-6 py-5"> */}
//           <div className="flex justify-center px-6 py-5">
//             <div className="w-full max-w-[1055px] flex items-center gap-4">
//               {sidebarIcon && (
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow">
//                   {sidebarIcon}
//                 </div>
//               )}

//               <div>
//                 <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//                   {title}
//                 </h1>
//                 {tagline && (
//                   <p className="mt-1 text-sm font-medium text-slate-500">
//                     {tagline}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Full page tool box */}
//       {/* <section className="mx-auto max-w-screen-xl px-4 py-8"> */}
//       <section className="">
//         <div className="overflow-hidden border-slate-200 bg-white shadow-sm">

//           {/* Layout */}
//           <div

//             // className={`grid h-[calc(100vh-80px)] ${flow.step === STEPS.PROCESSING

//             className={`grid min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] ${flow.step === STEPS.PROCESSING
//               ? "grid-cols-1"
//               : "lg:grid-cols-[minmax(0,1fr)_300px]"
//               }`}
//           >
//             {/* Main area */}
//             <div
//               className={`min-w-0 bg-slate-100 p-8 ${flow.step === STEPS.UPLOAD
//                 // ? "overflow-hidden px-6 pt-3 pb-6"
//                 // : "custom-tool-scroll overflow-y-auto p-6"

//                 ? "overflow-hidden"
//                 : "custom-tool-scroll overflow-y-auto"
//                 }`}
//             >

//               {flow.step === STEPS.UPLOAD && (
//                 <UploadLandingStep
//                   title={title}
//                   tagline={tagline}
//                   onFilesSelect={flow.selectFiles}
//                   accept={accept}
//                   multiple={multiple}
//                   uploadTitle={uploadTitle}
//                   uploadSubtitle={uploadSubtitle}
//                   uploadInfo={uploadInfo}
//                 />
//               )}
//               {/* {flow.step === STEPS.UPLOAD && (
//                 <div className="flex w-full justify-center">
//                   <UploadStep
//                     onFilesSelect={flow.selectFiles}
//                     accept={accept}
//                     multiple={multiple}
//                     uploadInfo={uploadInfo}
//                     uploadTitle={uploadTitle}
//                     uploadSubtitle={uploadSubtitle}
//                   />
//                 </div>
//               )} */}
//               {/* {flow.step === STEPS.UPLOAD && (
//                 <div className="flex w-full justify-center">
//                   <UploadStep
//                     onFilesSelect={flow.selectFiles}
//                     accept={accept}
//                     multiple={multiple}
//                   />
//                 </div>
//               )} */}

//               {flow.step === STEPS.OPTIONS && (
//                 <OptionsStep
//                   files={flow.files}
//                   onRemoveFile={onRemoveFile}
//                   onBack={flow.reset}
//                   error={flow.error}
//                   accept={accept}
//                   multiple={multiple}
//                   onAddFiles={(newFiles) => {
//                     flow.selectFiles([...flow.files, ...newFiles]);
//                   }}
//                   optionsTitle={optionsTitle}
//                   showOutputFormat={showOutputFormat}
//                   outputFormatTitle={outputFormatTitle}
//                   outputFormats={outputFormats}
//                   optionSectionLabel={optionSectionLabel}
//                   showPreserveLayout={showPreserveLayout}
//                   preserveLayoutTitle={preserveLayoutTitle}
//                   preserveLayoutDescription={preserveLayoutDescription}
//                   customFilePreview={customFilePreview}
//                 >
//                   {optionsSlot}
//                 </OptionsStep>
//               )}

//               {flow.step === STEPS.PROCESSING && (
//                 <ProcessingStep
//                   progress={progress}
//                   fileCount={flow.files.length}
//                   title={processingTitle}
//                   description={processingDescription}
//                   progressLabel={processingProgressLabel}
//                   stages={processingStages}
//                 />
//               )}

//               {flow.step === STEPS.DONE && (
//                 <DoneStep
//                   fileCount={flow.files.length}
//                   fileName={doneFileName}
//                   title={doneTitle}
//                   description={doneDescription}
//                   downloadLabel={downloadLabel}
//                   resetLabel={resetLabel}
//                   onDownload={onDownload}
//                   onReset={flow.reset}
//                   relatedLinks={doneLinks}
//                   compressionStats={compressionStats}
//                 />
//               )}
//             </div>

//             {/* Sidebar */}
//             {flow.step !== STEPS.PROCESSING && (
//               <aside className="border-t border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:rounded-l-[35px] lg:border-l lg:border-t-0 lg:-ml-6">
//                 {/* // <aside className="border-t border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:rounded-l-[46px] lg:border-l lg:border-t-0"> */}
//                 {flow.step === STEPS.UPLOAD && (
//                   <div className="space-y-4">
//                     {/* Heading */}
//                     <div className="-mx-5 border-b border-slate-200 px-5 pb-5 text-center">
//                       <h3 className="text-2xl font-bold text-slate-900">
//                         {sidebarTitle || title}
//                       </h3>

//                       {sidebarDescription && (
//                         <p className="mt-3 text-sm leading-6 text-slate-600">
//                           {sidebarDescription}
//                         </p>
//                       )}
//                     </div>

//                     {/* Upload info */}
//                     {/* {uploadSidebarInfo && (
//                       <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold leading-6 text-slate-800 shadow-sm">
//                         {uploadSidebarInfo}
//                       </div>
//                     )} */}
//                     {/* <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold leading-6 text-slate-800 shadow-sm">
//                       <p>⏱️ Multiple files may take up to 1 minute — don&apos;t close this tab</p>
//                       <p className="mt-2">
//                         🔢 Max 10 PDF files at once · Single PDF → DOCX · Multiple → ZIP
//                       </p>
//                     </div>
//  */}
//                     {/* Notice card */}
//                     {sidebarNotice && (
//                       <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 shadow-sm">
//                         {sidebarNotice}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {flow.step === STEPS.OPTIONS && (
//                   <div className="space-y-5">
//                     <h3 className="border-b border-slate-200 pb-3 text-center text-xl font-bold text-slate-900">
//                       {sidebarTitle || "PDF to Word"}
//                     </h3>

//                     {optionsSidebarNotice}

//                     <button
//                       type="button"
//                       onClick={onConvert}
//                       disabled={!flow.files.length}
//                       className={`w-full rounded-xl px-5 py-4 text-base font-bold text-white ${flow.files.length
//                         ? "bg-[#1D9E75] hover:bg-[#0F6E56]"
//                         : "cursor-not-allowed bg-slate-300"
//                         }`}
//                     >
//                       {convertLabel}
//                     </button>
//                   </div>
//                 )}

//                 {flow.step === STEPS.DONE && (
//                   <div>
//                     <h3 className="mb-4 text-base font-bold text-slate-900">
//                       Continue with...
//                     </h3>

//                     <div className="space-y-2">
//                       {doneLinks.map((link, i) => (
//                         <a
//                           key={i}
//                           href={link.href}
//                           className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1D9E75]"
//                         >
//                           <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
//                             {link.icon}
//                           </span>
//                           <span className="flex-1">{link.label}</span>
//                           <span className="text-slate-400">›</span>
//                         </a>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </aside>
//             )}

//           </div>

//         </div>
//       </section>
//     </main>
//   );
// }



