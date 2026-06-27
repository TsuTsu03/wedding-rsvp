"use client";

import { ReactNode, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

// Lenis - subtle. We lean the smoothing toward "barely there"; it should make
// scrolling feel weighted, not gimmicky. Disabled entirely under reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3), // gentle cubic ease-out
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.1,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Anchor links should hand off to Lenis for a smooth, eased jump.
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.1 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  // reducedMotion="user" makes Framer Motion drop transform/layout animations
  // for users who prefer reduced motion, while keeping opacity transitions -
  // fewer, gentler motion rather than none.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
