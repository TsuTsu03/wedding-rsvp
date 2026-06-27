"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Countdown } from "./Countdown";
import { wedding } from "@/lib/content";
import { easeOut } from "@/lib/motion";

// Kinetic line: clipped, springs up from below. Classic editorial type reveal.
const lineParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const lineChild = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: easeOut } },
};

function RevealLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span variants={lineChild} className={`block ${className ?? ""}`}>
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yNames = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="noir relative flex min-h-[100dvh] flex-col justify-center overflow-hidden"
    >
      {/* texture */}
      <div className="section-grain section-grain-dark" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(0,0,0,0.55))",
        }}
        aria-hidden
      />

      {/* Editorial margins (desktop) */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute inset-y-0 left-6 hidden items-center lg:flex"
      >
        <span className="vertical-rl text-[0.7rem] uppercase tracking-widest2 text-sage/70">
          Save the date - {wedding.location}
        </span>
      </motion.div>
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute inset-y-0 right-6 hidden items-center lg:flex"
      >
        <span className="vertical-rl rotate-180 text-[0.7rem] uppercase tracking-widest2 text-sage/70">
          {wedding.hashtag}
        </span>
      </motion.div>

      {/* Centerpiece */}
      <motion.div
        style={{ y: yNames }}
        className="shell relative z-10 flex flex-col"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
          className="mb-6 flex items-center gap-4 self-center sm:mb-8"
        >
          <span className="h-px w-10 bg-sage/50" />
          <span className="text-[0.7rem] uppercase tracking-widest2 text-sage">
            The wedding of
          </span>
          <span className="h-px w-10 bg-sage/50" />
        </motion.div>

        <motion.h1
          variants={lineParent}
          initial="hidden"
          animate="show"
          className="font-display font-light leading-[0.86] tracking-[-0.03em] text-ivory"
          style={{ fontSize: "clamp(3.2rem, 12vw, 10rem)" }}
        >
          <RevealLine className="text-center sm:text-left sm:pl-[2vw]">
            {wedding.couple.one}
          </RevealLine>
          <RevealLine className="text-center sm:text-right sm:pr-[2vw]">
            <span className="italic text-sage">&amp;</span> {wedding.couple.two}
          </RevealLine>
        </motion.h1>

        {/* Title bar */}
        <div className="mt-8 flex items-center justify-center gap-5 text-ivory/80 sm:mt-10">
          <span className="hidden h-px w-16 bg-ivory/20 sm:block" />
          <span className="font-display text-[1.1rem] italic">14 / 11 / 2026</span>
          <span className="h-px w-6 bg-ivory/20" />
          <span className="text-[0.78rem] uppercase tracking-widest2">
            {wedding.location}
          </span>
          <span className="hidden h-px w-16 bg-ivory/20 sm:block" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-5 text-ivory sm:mt-10">
          <Countdown date={wedding.date} />
          <a
            href="#film"
            className="rounded-full border border-sage/35 px-4 py-2 text-[0.64rem] uppercase tracking-widest2 text-sage transition-colors hover:border-sage/70 hover:text-ivory"
            aria-label="Watch the teaser"
          >
            Watch teaser
          </a>
        </div>
      </motion.div>
    </section>
  );
}
