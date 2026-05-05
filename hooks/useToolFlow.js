// hooks/useToolFlow.js
"use client";

import { useState } from "react";

export const STEPS = {
  UPLOAD: "UPLOAD",
  OPTIONS: "OPTIONS",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
};

export function useToolFlow() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const selectFiles = (newFiles) => {
    setFiles(newFiles);
    setError("");
    setStep(STEPS.OPTIONS);
  };

  const startProcessing = () => {
    setError("");
    setStep(STEPS.PROCESSING);
  };

  const finishSuccess = () => {
    setStep(STEPS.DONE);
  };

  const handleError = (msg) => {
    setError(msg || "Something went wrong. Please try again.");
    setStep(STEPS.OPTIONS);
  };

  const reset = () => {
    setFiles([]);
    setError("");
    setStep(STEPS.UPLOAD);
  };

  return { step, files, error, selectFiles, startProcessing, finishSuccess, handleError, reset };
}






















// // hooks/useToolFlow.js
// import { useState } from "react";

// export const STEPS = {
//   UPLOAD: "upload",
//   OPTIONS: "options",
//   PROCESSING: "processing",
//   DONE: "done",
// };

// export function useToolFlow() {
//   const [step, setStep] = useState(STEPS.UPLOAD);
//   const [files, setFiles] = useState([]);
//   const [error, setError] = useState("");

//   const selectFiles = (selectedFiles) => {
//     setFiles(selectedFiles);
//     setStep(STEPS.OPTIONS);
//   };

//   const startProcessing = () => {
//     setError("");
//     setStep(STEPS.PROCESSING);
//   };

//   const finishSuccess = () => {
//     setStep(STEPS.DONE);
//   };

//   const handleError = (msg) => {
//     setError(msg);
//     setStep(STEPS.OPTIONS);
//   };

//   const reset = () => {
//     setStep(STEPS.UPLOAD);
//     setFiles([]);
//     setError("");
//   };

//   return {
//     step,
//     files,
//     error,
//     selectFiles,
//     startProcessing,
//     finishSuccess,
//     handleError,
//     reset,
//   };
// }