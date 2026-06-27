"use client";

import { motion } from "framer-motion";
import { easeOut, inViewOnce } from "@/lib/motion";
import { Sprig } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Editorial section heading: eyebrow, serif title, optional lede, and a quiet
 * botanical sprig. Centered by default; can align left for asymmetric sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  sprig = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
  sprig?: boolean;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col",
        centered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {eyebrow}
        </motion.span>
      )}
      {sprig && centered && (
        <motion.span
          className="mt-3 text-olive/70"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.05 }}
          aria-hidden
        >
          <Sprig />
        </motion.span>
      )}
      <motion.h2
        className={cn(
          "mt-4 text-balance text-[clamp(2rem,5vw,3.4rem)] leading-[1.04]",
          centered ? "max-w-[16ch]" : "max-w-[18ch]"
        )}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inViewOnce}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.06 }}
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          className={cn(
            "mt-5 text-[1.0625rem] leading-relaxed text-ink-soft",
            centered ? "max-w-prose2" : "max-w-prose2"
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
