"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (

    <footer className="bg-black text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-10">

          {/* Brand */}
          {/* <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              PDF<span className="text-orange-500">Linx</span>
            </h3>
            <p className="text-gray-400 text-sm leading-7 max-w-sm">
              Free online PDF tools for people who take their PDF tasks seriously.
              Simple, fast, and private — just the way it should be.
            </p>
          </div> */}


          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              PDF<span className="text-orange-500">Linx</span>
            </h3>
            <p className="text-gray-400 text-sm leading-7 max-w-sm">
              Free online PDF tools for people who take their PDF tasks seriously.
              Simple, fast, and private — just the way it should be.
            </p>

            {/* ConvertLinx — footer mein subtle placement */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold mb-2">
                More free tools
              </p>
              <Link
                href="https://convertlinx.com"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition group"
              >
                <span>🖼️ Image &amp; utility tools</span>
                <span className="text-gray-600 group-hover:text-orange-400 transition">
                  → convertlinx.com
                </span>
              </Link>
            </div>
          </div>


          {/* Popular Tools */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-4 tracking-wide uppercase">
              Popular Tools
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/pdf-to-word" className="hover:text-white transition">PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="hover:text-white transition">Word to PDF</Link></li>
              <li><Link href="/merge-pdf" className="hover:text-white transition">Merge PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-white transition">Compress PDF</Link></li>
              <li><Link href="/image-to-pdf" className="hover:text-white transition">Image to PDF</Link></li>
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-4 tracking-wide uppercase">
              More Tools
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/edit-pdf" className="hover:text-white transition">Edit PDF</Link></li>
              <li><Link href="/protect-pdf" className="hover:text-white transition">Protect PDF</Link></li>
              <li><Link href="/ocr-pdf" className="hover:text-white transition">OCR PDF</Link></li>
              <li><Link href="/rotate-pdf" className="hover:text-white transition">Rotate PDF</Link></li>
              <li><Link href="/sign-pdf" className="hover:text-white transition">Sign PDF</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-4 tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-4 tracking-wide uppercase">
              Connect
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Got feedback or ideas? Let’s talk.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Get in Touch →
            </Link>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PDF Linx • All rights reserved
          </p>

          <p className="text-gray-600 text-xs">
            Free tools • No tracking • No data stored
          </p>

        </div>

      </div>
    </footer>

  );
};

export default Footer;





