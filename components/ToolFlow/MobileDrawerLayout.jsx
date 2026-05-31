"use client";

import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * MobileDrawerLayout
 *
 * Responsive wrapper for tool pages that have a main canvas + sidebar options.
 *
 * Desktop (lg+): side-by-side  →  mainContent (left, grows) | drawerContent (right, fixed width)
 * Mobile (<lg) : mainContent full-width + floating gear FAB + slide-up drawer for drawerContent
 *
 * Props:
 *  mainContent    — JSX  — The main canvas / preview area (PageCanvas, thumbnail grid, etc.)
 *  drawerContent  — JSX  — The sidebar options panel (sliders, selects, checkboxes, etc.)
 *  drawerTitle    — string (optional) — Label shown in mobile drawer header. Default: "Options"
 *  desktopSidebarWidth — string (optional) — Tailwind width class for desktop sidebar. Default: "w-72"
 */
export default function MobileDrawerLayout({
    mainContent,
    drawerContent,
    drawerTitle = "Options",
    desktopSidebarWidth = "w-72",
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Lock body scroll when drawer is open on mobile
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [drawerOpen]);

    return (
        <>
            {/* ── Desktop Layout ── */}
            <div className="hidden lg:flex gap-4 w-full">
                {/* Main canvas — grows to fill space */}
                <div className="flex-1 min-w-0">{mainContent}</div>

                {/* Sidebar options — fixed width */}
                <div className={`${desktopSidebarWidth} shrink-0`}>
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 h-full">
                        {drawerContent}
                    </div>
                </div>
            </div>

            {/* ── Mobile Layout ── */}
            <div className="lg:hidden w-full">
                {/* Main content — full width */}
                <div className="w-full">{mainContent}</div>

                {/* Floating gear button (FAB) */}
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-red-500 px-4 py-3 text-white shadow-lg shadow-red-500/30 text-sm font-medium active:scale-95 transition-transform"
                    aria-label="Open options"
                >
                    <Settings className="h-4 w-4" />
                    <span>Options</span>
                </button>

                {/* Backdrop */}
                <AnimatePresence>
                    {drawerOpen && (
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                            onClick={() => setDrawerOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Slide-up Drawer */}
                <AnimatePresence>
                    {drawerOpen && (
                        <motion.div
                            key="drawer"
                            //   initial={{ y: "100%" }}
                            //   animate={{ y: 0 }}
                            //   exit={{ y: "100%" }}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}

                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            // className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-2xl max-h-[80vh] flex flex-col"
                            className="fixed inset-y-0 right-0 z-50 rounded-l-2xl bg-white shadow-2xl w-[min(360px,100vw)] flex flex-col"

                        >
                            {/* Drawer handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="h-1 w-10 rounded-full bg-gray-300" />
                            </div>

                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 text-base">
                                    {drawerTitle}
                                </h3>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                                    aria-label="Close options"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Drawer content — scrollable */}
                            <div className="overflow-y-auto flex-1 px-4 py-4">
                                {drawerContent}
                            </div>

                            {/* Safe area spacer for iOS */}
                            <div className="pb-safe h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}