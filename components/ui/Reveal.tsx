"use client";

import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { easeOut, inViewOnce } from "@/lib/motion";

/**
 * Scroll reveal - a single, restrained entrance (fade + 18px rise) used across
 * the site so everything settles with the same hand. Fires once. Delay is baked
 * into the variant so it actually applies (a `transition` prop would be ignored
 * once variant-level transitions are present).
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "figure";
  className?: string;
}) {
  const MotionTag = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut, delay },
    },
  };
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
    >
      {children}
    </MotionTag>
  );
}
