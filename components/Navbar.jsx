"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  ChevronDown,
  FileText,
  FileType,
  FileImage,
  FileSpreadsheet,
  FileMinus,
  FilePlus,
  Image as ImageIcon,
  ScanLine,
  FileEdit,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeDropdown = () => setDropdownOpen(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/pdflinx_logo.svg"
              alt="PDFLinx Logo"
              width={36}
              height={36}
              priority={true}
              fetchPriority="high"
            />
            <span className="font-semibold text-xl italic">pdflinx</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Home</Link>
            <Link href="/pdf-to-word" className="text-gray-700 hover:text-indigo-600 font-semibold transition">PDF to Word</Link>
            <Link href="/merge-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Merge PDF</Link>
            <Link href="/split-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Split PDF</Link>
            <Link href="/compress-pdf" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Compress PDF</Link>

            {/* PDF TOOLS Dropdown (Desktop) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
              >
                PDF Tools
                <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-14 right-[-250px] w-[820px] bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <div className="grid grid-cols-4 gap-5 px-5 py-4 bg-gradient-to-b from-gray-50 to-white">

                    {/* Hub link */}
                    <div className="col-span-4">
                      <Link href="/free-pdf-tools" onClick={closeDropdown} className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition text-sm">
                        🔹 All PDF Tools
                      </Link>
                    </div>

                    {/* Convert TO PDF */}
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Convert to PDF</h3>
                      <div className="space-y-1">
                        <Link href="/word-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileType size={20} className="text-blue-600" />
                          <span className="font-medium text-gray-700">WORD to PDF</span>
                        </Link>
                        <Link href="/excel-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileSpreadsheet size={20} className="text-green-600" />
                          <span className="font-medium text-gray-700">EXCEL to PDF</span>
                        </Link>
                        <Link href="/ppt-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileSpreadsheet size={20} className="text-green-600 flex-shrink-0" />
                          <span className="font-medium text-gray-700 whitespace-nowrap">POWERPOINT to PDF</span>
                        </Link>
                        <Link href="/image-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileImage size={20} className="text-orange-600" />
                          <span className="font-medium text-gray-700">JPG to PDF</span>
                        </Link>
                      </div>
                    </div>

                    {/* Convert FROM PDF */}
                    <div className="border-l border-gray-100 pl-6">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Convert from PDF</h3>
                      <div className="space-y-1">
                        <Link href="/pdf-to-word" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileText size={20} className="text-red-600" />
                          <span className="font-medium text-gray-700">PDF to WORD</span>
                        </Link>

                        <Link href="/pdf-to-jpg" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          {/* <ImageIcon size={20} className="text-orange-600" /> */}
                          <FileSpreadsheet size={20} strokeWidth={2.5} className="text-green-600" />
                          <span className="font-medium text-gray-700">PDF to JPG</span>
                        </Link>

                        {/* <Link href="/pdf-to-excel" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <ImageIcon size={20} className="text-orange-600" />
                          <span className="font-medium text-gray-700">PDF to Excel</span>
                        </Link> */}

                        <Link
                          href="/pdf-to-excel"
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1"
                        >
                          <FileSpreadsheet size={20} strokeWidth={2.5} className="text-green-600" />
                          <span className="font-medium text-gray-700">PDF to Excel</span>
                        </Link>                        
                      </div>
                    </div>

                    {/* PDF Security */}
                    <div className="border-l border-gray-100 pl-6">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">PDF security</h3>
                      <div className="space-y-1">
                        <Link href="/protect-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileMinus size={20} className="text-purple-600" />
                          <span className="font-medium text-gray-700">Protect PDF</span>
                        </Link>
                        <Link href="/unlock-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FilePlus size={20} className="text-emerald-600" />
                          <span className="font-medium text-gray-700">Unlock PDF</span>
                        </Link>
                        <Link href="/sign-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FilePlus size={20} className="text-emerald-600" />
                          <span className="font-medium text-gray-700">Sign PDF</span>
                        </Link>
                      </div>
                    </div>

                    {/* Edit PDF */}
                    <div className="border-l border-gray-100 pl-6">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Edit PDF</h3>
                      <div className="space-y-1">
                        <Link href="/rotate-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileMinus size={20} className="text-purple-600" />
                          <span className="font-medium text-gray-700">Rotate PDF</span>
                        </Link>
                        <Link href="/ocr-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <ScanLine size={20} className="text-blue-600" />
                          <span className="font-medium text-gray-700">OCR PDF</span>
                        </Link>
                        <Link href="/edit-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FileEdit size={20} className="text-orange-600" />
                          <span className="font-medium text-gray-700">Edit PDF</span>
                        </Link>
                        <Link href="/add-watermark" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          <FilePlus size={20} className="text-emerald-600" />
                          <span className="font-medium text-gray-700 whitespace-nowrap">Add Watermark</span>
                        </Link>

                        <Link href="/text-to-pdf" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all duration-200 hover:translate-x-1">
                          {/* <FilePlus size={20} className="text-emerald-600" /> */}
                          <FileText size={16} className="text-purple-600" />
                          <span className="font-medium text-gray-700 whitespace-nowrap">Text to PDF</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Blog</Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-semibold transition">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-semibold transition">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 hover:text-indigo-600 text-3xl"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Home</Link>
            <Link href="/pdf-to-word" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">PDF to Word</Link>
            <Link href="/merge-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Merge PDF</Link>
            <Link href="/split-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Split PDF</Link>
            <Link href="/compress-pdf" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Compress PDF</Link>

            {/* PDF Tools Mobile */}
            <details className="group">
              <summary className="flex justify-between items-center font-semibold text-gray-800 cursor-pointer py-2">
                PDF Tools
                <ChevronDown className="group-open:rotate-180 transition" />
              </summary>

              <Link href="/free-pdf-tools" onClick={closeMobile} className="block font-semibold text-indigo-600 py-2 border-b border-gray-100">
                🔹 All PDF Tools
              </Link>

              <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">Convert TO PDF</h3>
                    <div className="space-y-2 text-sm">
                      <Link href="/word-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileType size={16} className="text-blue-600" />Word to PDF</Link>
                      <Link href="/excel-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileSpreadsheet size={16} className="text-green-600" />Excel to PDF</Link>
                      <Link href="/ppt-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileSpreadsheet size={16} className="text-green-600" />PowerPoint to PDF</Link>
                      <Link href="/image-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileImage size={16} className="text-orange-600" />JPG to PDF</Link>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">Convert FROM PDF</h3>

                    <div className="space-y-2 text-sm">
                      <Link href="/pdf-to-word" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileText size={16} className="text-red-600" />PDF to Word</Link>
                      <Link href="/pdf-to-jpg" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><ImageIcon size={16} className="text-orange-600" />PDF to JPG</Link>
                      <Link
                        href="/pdf-to-excel"
                        onClick={closeMobile}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        PDF to Excel
                      </Link>
                    </div>

                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">PDF SECURITY</h3>
                    <div className="space-y-2 text-sm">
                      <Link href="/protect-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileMinus size={16} className="text-purple-600" />Protect PDF</Link>
                      <Link href="/unlock-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Unlock PDF</Link>
                      <Link href="/sign-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Sign PDF</Link>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2">Edit PDF</h3>
                    <div className="space-y-2 text-sm">
                      <Link href="/rotate-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileMinus size={16} className="text-purple-600" />Rotate PDF</Link>
                      <Link href="/ocr-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><ScanLine size={16} className="text-blue-600" />OCR PDF</Link>
                      <Link href="/edit-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileEdit size={16} className="text-orange-600" />Edit PDF</Link>
                      <Link href="/add-watermark" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FilePlus size={16} className="text-emerald-600" />Add Watermark</Link>
                      <Link href="/text-to-pdf" onClick={closeMobile} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 py-1"><FileText size={16} className="text-purple-600" />Text to PDF</Link>

                    </div>
                  </div>
                </div>
              </div>
            </details>

            <Link href="/blog" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Blog</Link>
            <Link href="/about" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">About</Link>
            <Link href="/contact" onClick={closeMobile} className="block font-semibold text-gray-800 py-2">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

