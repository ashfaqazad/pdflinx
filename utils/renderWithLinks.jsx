import Link from "next/link";

export function renderWithLinks(text) {
  if (typeof text !== "string" || !text) return text || null;

  return text.split("\n").map((line, lineIdx, arr) => (
    <span key={lineIdx}>
      {line.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          return (
            <Link
              key={i}
              href={match[2]}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {match[1]}
            </Link>
          );
        }
        return part;
      })}
      {lineIdx !== arr.length - 1 && <br />}
    </span>
  ));
}





















// import Link from "next/link";

// export function renderWithLinks(text) {
//   if (!text) return null;

//   return text.split("\n").map((line, lineIdx, arr) => (
//     <span key={lineIdx}>
//       {line.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
//         const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
//         if (match) {
//           return (
//             // <Link
//             //   key={i}
//             //   href={match[2]}
//             //   className="text-blue-600 underline hover:text-blue-800"
//             // >
//             //   {match[1]}
//                             // </Link>
//                 <Link
//                 key={i}
//                 href={match[2]}
//                 className="text-blue-600 no-underline hover:text-blue-800"
//                 >
//                 {match[1]}
//                 </Link>
//           );
//         }
//         return part;
//       })}
//       {lineIdx !== arr.length - 1 && <br />}
//     </span>
//   ));
// }









// // import Link from "next/link";

// // function renderWithLinks(text) {
// //   return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
// //     const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
// //     if (match) {
// //       return (
// //         <Link key={i} href={match[2]} className="text-blue-600 underline hover:text-blue-800">
// //           {match[1]}
// //         </Link>
// //       );
// //     }
// //     return part;
// //   });
// // }

