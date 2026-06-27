"use client";

import { motion } from "framer-motion";
import { FilmReel } from "@/components/film/FilmReel";
import { easeOut, inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/content";

/**
 * The "teaser" - a real motion-graphics film built in Remotion, played live in
 * the browser via @remotion/player. Framed like a screening: corner ticks,
 * runtime, a quiet caption. This is the bridge from the dark cover into the
 * light editorial interior.
 */
export function Film() {
  return (
    <section id="film" className="noir relative overflow-hidden py-[var(--space-section)]">
      <div className="section-grain section-grain-dark" aria-hidden />

      <div className="shell relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            Featured presentation
          </motion.span>
          <motion.h2
            className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-ivory"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.05 }}
          >
            A little film, before the big day
          </motion.h2>
        </div>

        {/* Screening frame */}
        <motion.div
          className="relative mx-auto mt-14 max-w-4xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          {/* corner ticks */}
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ].map((pos) => (
            <span
              key={pos}
              className={`pointer-events-none absolute h-6 w-6 border-sage/50 ${pos}`}
              style={{ margin: -10 }}
              aria-hidden
            />
          ))}

          <div className="overflow-hidden border border-noir-line bg-black shadow-soft">
            <FilmReel />
          </div>

          <div className="mt-4 flex items-center justify-between text-[0.7rem] uppercase tracking-widest2 text-ivory/45">
            <span>Reel 01 / Save the Date</span>
            <span>Runtime 00:14</span>
          </div>
        </motion.div>

        <motion.p
          className="mx-auto mt-10 max-w-prose2 text-center text-[0.98rem] leading-relaxed text-ivory/65"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
        >
          Made with love, not a film crew. Scroll on for the story, the details, and to
          let us know you're coming. {wedding.hashtag}
        </motion.p>
      </div>
    </section>
  );
}
