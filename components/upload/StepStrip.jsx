// // components/upload/StepStrip.jsx

// "use client";

// const ACCENT_STYLES = {
//   blue: {
//     dotBg: "bg-gradient-to-br from-blue-500 to-green-500",
//     connector: "bg-gradient-to-r from-blue-200 to-green-200",
//     labelColor: "text-gray-700",
//     subColor: "text-gray-400",
//     wrapperBg: "bg-white",
//     border: "border-gray-100",
//   },
//   indigo: {
//     dotBg: "bg-gradient-to-br from-indigo-500 to-purple-500",
//     connector: "bg-gradient-to-r from-indigo-200 to-purple-200",
//     labelColor: "text-gray-700",
//     subColor: "text-gray-400",
//     wrapperBg: "bg-white",
//     border: "border-gray-100",
//   },
//   emerald: {
//     dotBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
//     connector: "bg-gradient-to-r from-emerald-200 to-teal-200",
//     labelColor: "text-gray-700",
//     subColor: "text-gray-400",
//     wrapperBg: "bg-white",
//     border: "border-gray-100",
//   },
// };

// export default function StepStrip({ steps = [], accentColor = "blue" }) {
//   const style = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.blue;

//   if (!steps.length) return null;

//   return (
//     <div
//       className={`
//         flex items-center justify-between
//         mb-4 px-6 py-4
//         rounded-2xl border shadow-sm
//         ${style.wrapperBg} ${style.border}
//       `}
//     >
//       {steps.map((step, i) => (
//         <div key={i} className="flex items-center flex-1">

//           {/* Step item */}
//           <div className="flex flex-col items-center text-center flex-shrink-0">
//             {/* Number dot */}
//             <div
//               className={`
//                 w-8 h-8 rounded-full flex items-center justify-center
//                 text-white text-xs font-bold mb-1.5 shadow-sm
//                 ${style.dotBg}
//               `}
//             >
//               {i + 1}
//             </div>

//             {/* Label */}
//             <p className={`text-xs font-semibold leading-tight ${style.labelColor}`}>
//               {step.label}
//             </p>

//             {/* Sub */}
//             {step.sub && (
//               <p className={`text-xs mt-0.5 hidden sm:block ${style.subColor}`}>
//                 {step.sub}
//               </p>
//             )}
//           </div>

//           {/* Connector line — last step ke baad nahi */}
//           {i < steps.length - 1 && (
//             <div
//               className={`
//                 flex-1 h-px mx-3
//                 ${style.connector}
//               `}
//             />
//           )}

//         </div>
//       ))}
//     </div>
//   );
// }