"use client";
// components/LayoutShell.jsx
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed");

  return (
    <>
      {!isEmbed && <Navbar />}
      <main className="grow">{children}</main>
      {!isEmbed && <Footer />}
    </>
  );
}

