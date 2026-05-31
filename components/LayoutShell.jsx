"use client";

// components/LayoutShell.jsx

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolsFooter from "@/components/ToolsFooter";

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const isEmbed = pathname?.startsWith("/embed");

  // Home page check
  const isHomePage = pathname === "/";

  return (
    <>
      {!isEmbed && <Navbar />}

      <main className="grow">
        {children}
      </main>

      {/* {!isEmbed && (
        <> */}
      {/* Home page par ToolsFooter hide */}
      {/* {!isHomePage && <ToolsFooter />}

          <Footer />
        </>
      )}
 */}


      {!isEmbed && (
        <div className="tool-footer-wrap">
          {!isHomePage && <ToolsFooter />}
          <Footer />
        </div>
      )}

    </>
  );
}




















// "use client";

// // components/LayoutShell.jsx

// import { usePathname } from "next/navigation";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import ToolsFooter from "@/components/ToolsFooter";

// export default function LayoutShell({ children }) {
//   const pathname = usePathname();
//   const isEmbed = pathname?.startsWith("/embed");

//   return (
//     <>
//       {!isEmbed && <Navbar />}

//       <main className="grow">
//         {children}
//       </main>

//       {!isEmbed && (
//         <>
//           <ToolsFooter />
//           <Footer />
//         </>
//       )}
//     </>
//   );
// }























// "use client";
// // components/LayoutShell.jsx
// import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export default function LayoutShell({ children }) {
//   const pathname = usePathname();
//   const isEmbed = pathname?.startsWith("/embed");

//   return (
//     <>
//       {!isEmbed && <Navbar />}
//       <main className="grow">{children}</main>

//       {!isEmbed && <Footer />}
//     </>
//   );
// }

