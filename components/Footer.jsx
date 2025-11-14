"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
      <div className="space-y-3">
        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-400">
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/licenses.txt"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            Open Source Licenses
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-400">
          © {year} PDF Converter NSky. All Rights Reserved.
        </p>

        {/* Disclaimer */}
        <p className="text-gray-500 max-w-2xl mx-auto px-4 text-xs leading-relaxed">
          This website provides free online PDF conversion tools. By using this
          site, you agree to our Terms and Privacy Policy. All trademarks and
          brand names belong to their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;














// // components/Footer.jsx
// "use client";
// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-6 text-center">
//       <p>© {new Date().getFullYear()} PDF Tools. All Rights Reserved.</p>
//     </footer>
//   );
// };

// export default Footer;
