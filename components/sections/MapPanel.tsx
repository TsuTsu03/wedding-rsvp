"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { easeOut, inViewOnce, tactileSpring } from "@/lib/motion";

/**
 * A bespoke, palette-matched map instead of a raw third-party embed - it reads
 * as part of the design rather than a foreign rectangle. The clay pin (one of
 * the only two places clay appears) drops in with weight. A real directions link
 * keeps it functional.
 */
export function MapPanel({ place, address }: { place: string; address: string }) {
  const reduce = useReducedMotion();
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place} ${address}`
  )}`;

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border border-line"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <div className="relative aspect-[16/7] w-full bg-[#eee7d6]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1600 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {/* soft land parcels */}
          <rect width="1600" height="700" fill="#ece4d2" />
          <path d="M0 470 Q 380 420 760 470 T 1600 450 V700 H0 Z" fill="#e3dcc8" />
          {/* a calm body of water */}
          <path
            d="M1080 70 Q 1320 120 1380 320 Q 1410 470 1230 520 Q 1040 560 1010 360 Q 990 170 1080 70 Z"
            fill="#cdd6cf"
            opacity="0.85"
          />
          {/* roads */}
          <g stroke="#d8ccb2" fill="none" strokeLinecap="round">
            <path d="M-20 250 Q 400 230 800 320 T 1640 300" strokeWidth="10" />
            <path d="M260 -20 Q 320 300 540 720" strokeWidth="8" />
            <path d="M900 720 Q 760 420 980 120" strokeWidth="6" opacity="0.8" />
          </g>
          <g stroke="#e7dcc6" fill="none" strokeLinecap="round" strokeWidth="3" opacity="0.9">
            <path d="M120 540 Q 500 460 980 540" />
            <path d="M620 60 Q 700 260 600 520" />
          </g>
        </svg>

        {/* The marked location */}
        <motion.div
          className="absolute left-[44%] top-[40%] flex -translate-x-1/2 -translate-y-full flex-col items-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={reduce ? { duration: 0.4 } : { ...tactileSpring, delay: 0.25 }}
        >
          <div className="flex items-center gap-2 rounded-full border border-line bg-paper/95 px-3 py-1.5 shadow-soft backdrop-blur-sm">
            <MapPin size={14} className="text-clay" strokeWidth={2} />
            <span className="whitespace-nowrap text-[0.78rem] font-medium text-ink">
              {place}
            </span>
          </div>
          <span className="mt-1 h-3 w-px bg-clay/60" />
          <span className="-mt-0.5 h-2 w-2 rounded-full bg-clay shadow-[0_0_0_4px_rgba(180,105,78,0.18)]" />
        </motion.div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-line bg-paper px-6 py-4 sm:flex-row sm:items-center">
        <p className="text-[0.9rem] text-ink-soft">{address}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-ink transition-colors hover:text-olive"
        >
          Get directions
          <ArrowUpRight
            size={15}
            strokeWidth={1.75}
            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </motion.div>
  );
}
