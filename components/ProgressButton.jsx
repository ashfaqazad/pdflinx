export default function ProgressButton({ 
  isLoading, progress, disabled, icon, label, 
  gradient = "from-blue-600 to-green-600",
  type = "submit",        // ← naya prop
  onClick                 // ← naya prop
}) {
  return (
    <button
      type={type}               // ← yahan use karo
      onClick={onClick}         // ← yahan use karo
      disabled={disabled || isLoading}
      className={`w-full bg-gradient-to-r ${gradient} text-white font-semibold text-lg py-4 rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 min-h-[60px]`}
    >
      {isLoading ? (
        <div className="w-full flex flex-col items-center gap-1.5 px-4">
          <div className="flex items-center justify-between w-full text-sm font-medium">
            <span>Converting...</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}

















// // components/ProgressButton.jsx
// export default function ProgressButton({ isLoading, progress, disabled, icon, label, gradient = "from-blue-600 to-green-600" }) {
//   return (
//     <button
//       type="submit"
//       disabled={disabled || isLoading}
//       className={`w-full bg-gradient-to-r ${gradient} text-white font-semibold text-lg py-4 rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 min-h-[60px]`}
//     >
//       {isLoading ? (
//         <div className="w-full flex flex-col items-center gap-1.5 px-4">
//           <div className="flex items-center justify-between w-full text-sm font-medium">
//             <span>Converting...</span>
//             <span className="tabular-nums">{progress}%</span>
//           </div>
//           <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
//             <div
//               className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       ) : (
//         <>
//           {icon}
//           {label}
//         </>
//       )}
//     </button>
//   );
// }



















// // // components/ProgressButton.jsx
// // export default function ProgressButton({ isLoading, progress, disabled, icon, label }) {
// //   return (
// //     <button
// //       type="submit"
// //       disabled={disabled || isLoading}
// //       className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 min-h-[60px]"
// //     >
// //       {isLoading ? (
// //         <div className="w-full flex flex-col items-center gap-1.5 px-4">
// //           <div className="flex items-center justify-between w-full text-sm font-medium">
// //             <span>Converting...</span>
// //             <span className="tabular-nums">{progress}%</span>
// //           </div>
// //           <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
// //             <div
// //               className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
// //               style={{ width: `${progress}%` }}
// //             />
// //           </div>
// //         </div>
// //       ) : (
// //         <>
// //           {icon}
// //           {label}
// //         </>
// //       )}
// //     </button>
// //   );
// // }