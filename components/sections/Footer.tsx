"use client";

import { motion } from "framer-motion";
import { wedding } from "@/lib/content";
import { Sprig } from "@/lib/icons";
import { easeOut, inViewOnce } from "@/lib/motion";

export function Footer() {
  return (
    <footer className="noir relative overflow-hidden py-[clamp(5rem,11vw,8rem)]">
      <div className="section-grain section-grain-dark" aria-hidden />
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <motion.span
          className="text-sage/80"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.8, ease: easeOut }}
          aria-hidden
        >
          <Sprig />
        </motion.span>

        <motion.p
          className="mt-8 max-w-[18ch] font-display text-[clamp(1.7rem,4.5vw,2.8rem)] font-light leading-snug text-ivory"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.05 }}
        >
          And so, the best part of our story begins.
        </motion.p>

        {/* The names settle in, one then the other. */}
        <motion.div
          className="mt-12 flex items-baseline gap-4 font-display text-[clamp(2.6rem,10vw,5.5rem)] font-light leading-none text-ivory"
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {[wedding.couple.one, "&", wedding.couple.two].map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
              }}
              className={i === 1 ? "italic text-sage" : ""}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-1 text-ivory/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
        >
          <p className="text-[0.85rem] tracking-wide">{wedding.dateLabel}</p>
          <p className="text-[0.78rem] uppercase tracking-widest2">{wedding.location}</p>
          <p className="mt-6 text-[0.78rem] italic text-sage/80">{wedding.hashtag}</p>
        </motion.div>

        <p className="mt-12 text-[0.72rem] uppercase tracking-widest2 text-ivory/35">
          Fin / Made with care / {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
