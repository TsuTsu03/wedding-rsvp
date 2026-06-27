"use client";

import { Sprig } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * A kinetic marquee band. CSS-driven (runs off the main thread, stays smooth),
 * pauses on hover, and freezes under reduced motion via the global rule.
 */
export function Marquee({
  items,
  tone = "light",
  reverse = false,
}: {
  items: string[];
  tone?: "light" | "dark";
  reverse?: boolean;
}) {
  const seq = (
    <span className="marquee-track-seq flex items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display text-[clamp(1.6rem,5vw,3rem)] font-light italic">
            {it}
          </span>
          <span className={cn("mx-7 sm:mx-10", tone === "dark" ? "text-sage/70" : "text-olive/60")}>
            <Sprig />
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn(
        "marquee group relative overflow-hidden border-y py-6 sm:py-8",
        tone === "dark"
          ? "noir border-noir-line text-ivory"
          : "border-line bg-paper text-ink"
      )}
    >
      <div className={cn("marquee-track", reverse && "reverse")}>
        {seq}
        {seq}
      </div>
      {/* soft edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{
          background: `linear-gradient(90deg, ${
            tone === "dark" ? "var(--noir)" : "var(--paper)"
          }, transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{
          background: `linear-gradient(270deg, ${
            tone === "dark" ? "var(--noir)" : "var(--paper)"
          }, transparent)`,
        }}
      />
    </div>
  );
}
