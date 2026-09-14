// components/ToolFlow/ToolFlowShell.jsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { STEPS } from "@/hooks/useToolFlow";

const STEP_ORDER = [STEPS.UPLOAD, STEPS.OPTIONS, STEPS.PROCESSING, STEPS.DONE];
const STEP_LABELS = {
  [STEPS.UPLOAD]: "Upload",
  [STEPS.OPTIONS]: "Options",
  [STEPS.PROCESSING]: "Converting",
  [STEPS.DONE]: "Done",
};

function StepBubble({ index, label, status }) {
  // status: "done" | "active" | "pending"
  const isDone = status === "done";
  const isActive = status === "active";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
          isDone
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-[#1a9e6e] text-white"
            : "border-2 border-slate-300 bg-white text-slate-400"
        }`}
      >
        {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
      </div>
      <span
        className={`text-sm font-semibold transition-colors duration-300 ${
          isActive ? "text-slate-900" : isDone ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ filled }) {
  return (
    <div className="mx-1 h-px w-8 flex-shrink-0 rounded-full bg-slate-200 transition-colors duration-300 sm:w-14">
      <div
        className={`h-full rounded-full bg-green-500 transition-all duration-500 ${
          filled ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}

export default function ToolFlowShell({ step, children }) {
  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1 sm:gap-2">
        {STEP_ORDER.map((s, i) => {
          const status =
            i < currentIndex ? "done" : i === currentIndex ? "active" : "pending";
          return (
            <div key={s} className="flex items-center">
              {i > 0 && <Separator filled={i <= currentIndex} />}
              <StepBubble index={i} label={STEP_LABELS[s]} status={status} />
            </div>
          );
        })}
      </div>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
























// // components/ToolFlow/ToolFlowShell.jsx
// "use client";

// import { AnimatePresence, motion } from "framer-motion";

// export default function ToolFlowShell({ step, children }) {
//   return (
//     <div>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={step}
//           initial={{ opacity: 0, y: 14 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -14 }}
//           transition={{ duration: 0.2, ease: "easeInOut" }}
//         >
//           {children}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }


























// // // components/ToolFlow/ToolFlowShell.jsx
// // "use client";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { CheckCircle2 } from "lucide-react";
// // import { STEPS } from "@/hooks/useToolFlow";

// // const STEP_LIST = [
// //   { key: STEPS.UPLOAD,     label: "Upload" },
// //   { key: STEPS.OPTIONS,    label: "Options" },
// //   { key: STEPS.PROCESSING, label: "Converting" },
// //   { key: STEPS.DONE,       label: "Done" },
// // ];

// // function StepHeader({ currentStep }) {
// //   const currentIndex = STEP_LIST.findIndex((s) => s.key === currentStep);
// //   return (
// //     <div className="flex items-center gap-0 mb-8">
// //       {STEP_LIST.map((step, index) => {
// //         const isActive = step.key === currentStep;
// //         const isDone = index < currentIndex;
// //         const isLast = index === STEP_LIST.length - 1;
// //         return (
// //           <div key={step.key} className="flex items-center flex-1 last:flex-none">
// //             <div className="flex items-center gap-2">
// //               <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300 ${
// //                 isDone
// //                   ? "border-green-500 bg-green-500 text-white"
// //                   : isActive
// //                   ? "border-blue-500 bg-blue-500 text-white"
// //                   : "border-gray-200 bg-white text-gray-400"
// //               }`}>
// //                 {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
// //               </div>
// //               <span className={`text-sm font-medium hidden sm:block transition-colors duration-300 ${
// //                 isActive ? "text-gray-900" : isDone ? "text-green-600" : "text-gray-400"
// //               }`}>
// //                 {step.label}
// //               </span>
// //             </div>
// //             {!isLast && (
// //               <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${
// //                 isDone ? "bg-green-400" : "bg-gray-200"
// //               }`} />
// //             )}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // export default function ToolFlowShell({ step, children }) {
// //   return (
// //     <div>
// //       <StepHeader currentStep={step} />
// //       <AnimatePresence mode="wait">
// //         <motion.div
// //           key={step}
// //           initial={{ opacity: 0, y: 14 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           exit={{ opacity: 0, y: -14 }}
// //           transition={{ duration: 0.2, ease: "easeInOut" }}
// //         >
// //           {children}
// //         </motion.div>
// //       </AnimatePresence>
// //     </div>
// //   );
// // }