import { useEffect } from "react";

/**
 * Adds cinematic scroll-triggered reveal animations to any element
 * marked with [data-reveal]. Variants: up (default), left, right, scale, blur.
 * Stagger via data-reveal-delay (ms).
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay || "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};
