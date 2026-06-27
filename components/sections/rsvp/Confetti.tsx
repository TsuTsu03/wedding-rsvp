"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * One celebratory beat, then calm. A single burst of small petals on the palette
 * - no looping, no spam. Skipped entirely under reduced motion.
 */
export function Confetti({ fire }: { fire: boolean }) {
  const reduce = useReducedMotion();

  const petals = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 120 + Math.random() * 220;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60, // bias upward
          rotate: Math.random() * 360,
          delay: Math.random() * 0.08,
          color: ["#5c6b53", "#b4694e", "#d8cdb8", "#3d4a3a"][i % 4],
          size: 5 + Math.random() * 5,
          round: Math.random() > 0.5,
        };
      }),
    []
  );

  if (reduce || !fire) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible" aria-hidden>
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "9999px" : "1px",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 80],
            opacity: [1, 1, 0],
            scale: 1,
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.55, 1],
          }}
        />
      ))}
    </div>
  );
}
