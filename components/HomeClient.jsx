"use client";

// Small client-side pieces of the homepage. Everything else on the homepage is a server
// component, so the tool cards, icons, copy and FAQ ship no JavaScript.

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./HomeContent.module.css";

/* Category tabs: the cards are rendered on the server with data-category, the tabs only show/hide them. */
export function HomeTabs({ categories }) {
  const [active, setActive] = useState("all");
  const firstRun = useRef(true);

  useEffect(() => {
    const cards = document.querySelectorAll("[data-tool-card]");
    cards.forEach((card) => {
      const show = active === "all" || card.dataset.category === active;
      card.style.display = show ? "" : "none";
      // cards that were hidden may never have been scrolled into view: show them right away
      if (show && !firstRun.current) card.classList.add(styles.visible);
    });
    firstRun.current = false;
  }, [active]);

  return (
    <div className={styles.tabBar}>
      {categories.map((cat) => (
        <button
          key={cat.key}
          className={`${styles.tabBtn} ${active === cat.key ? styles.tabActive : ""}`}
          onClick={() => setActive(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

/* Hero button: smooth-scroll to the tools section */
export function BrowseToolsButton({ children }) {
  return (
    <button
      className={styles.btnPrimary}
      onClick={() =>
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
      }
    >
      {children}
    </button>
  );
}

/* Scroll-reveal for .revealItem elements + back-to-top button */
export function HomeEnhancements() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.revealItem}`);
    const reveal = (el) => {
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => el.classList.add(styles.visible), delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      else observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!showBackToTop) return null;

  return (
    <button
      className={styles.backTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
