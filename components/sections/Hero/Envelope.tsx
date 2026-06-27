"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { easeInOut, easeOut, tactileSpring } from "@/lib/motion";
import { wedding } from "@/lib/content";

/**
 * The opening beat: a sealed envelope that opens with weight. The wax seal
 * breaks, the flap falls back on a slow ease-in-out (it has mass), and the
 * invitation card lifts out on a spring. The whole overlay then dissolves,
 * handing off to the hero content beneath.
 *
 * Reduced motion: the overlay is skipped entirely and the hero shows at once.
 */
export function Envelope({ onOpened }: { onOpened: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  // Skip the whole ceremony under reduced motion.
  useEffect(() => {
    if (reduce) {
      setGone(true);
      onOpened();
    }
  }, [reduce, onOpened]);

  // Auto-open shortly after load; a tap opens it sooner.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setOpen(true), 850);
    return () => clearTimeout(t);
  }, [reduce]);

  // Once opening begins, hand off to the hero, then unmount the overlay.
  useEffect(() => {
    if (!open) return;
    const handoff = setTimeout(onOpened, 750);
    const dissolve = setTimeout(() => setGone(true), 1700);
    return () => {
      clearTimeout(handoff);
      clearTimeout(dissolve);
    };
  }, [open, onOpened]);

  if (reduce || gone) return null;

  const kraft = "#e7dcc6";
  const kraftDeep = "#dccdb0";
  const kraftLine = "#cdbd9c";

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.7, ease: easeOut, delay: open ? 0.95 : 0 }}
          onClick={() => setOpen(true)}
          role="button"
          aria-label="Open the invitation"
          style={{ pointerEvents: open ? "none" : "auto", cursor: open ? "default" : "pointer" }}
        >
          <div className="flex flex-col items-center">
            <motion.span
              className="eyebrow mb-10"
              animate={{ opacity: open ? 0 : 1, y: open ? -6 : 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              You're invited
            </motion.span>

            {/* Envelope - sized fluidly, 3:2 */}
            <div
              className="relative"
              style={{
                width: "min(80vw, 360px)",
                aspectRatio: "3 / 2",
                perspective: "1400px",
              }}
            >
              {/* Back panel */}
              <div
                className="absolute inset-0 rounded-[10px]"
                style={{ background: kraftDeep, border: `1px solid ${kraftLine}` }}
              />

              {/* Invitation card - tucked inside, lifts out on a spring */}
              <motion.div
                className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center rounded-[8px] bg-surface"
                style={{
                  width: "86%",
                  height: "118%",
                  border: `1px solid var(--line)`,
                  boxShadow: "var(--shadow-soft)",
                  zIndex: 15,
                }}
                initial={{ x: "-50%", y: "-38%", scale: 0.96 }}
                animate={
                  open
                    ? { x: "-50%", y: "-92%", scale: 1, opacity: 0 }
                    : { x: "-50%", y: "-38%", scale: 0.96 }
                }
                transition={
                  open
                    ? { ...tactileSpring, opacity: { duration: 0.5, ease: easeOut, delay: 0.5 } }
                    : { duration: 0.4 }
                }
              >
                <span className="font-display text-[2rem] text-ink">
                  {wedding.couple.monogram}
                </span>
                <span className="mt-2 text-[0.6rem] uppercase tracking-widest2 text-ink-soft">
                  Together with their families
                </span>
              </motion.div>

              {/* Front pocket - V-shaped, hides the card's lower half */}
              <div
                className="absolute inset-0 rounded-[10px]"
                style={{
                  background: kraft,
                  borderBottom: `1px solid ${kraftLine}`,
                  borderLeft: `1px solid ${kraftLine}`,
                  borderRight: `1px solid ${kraftLine}`,
                  clipPath: "polygon(0 34%, 50% 74%, 100% 34%, 100% 100%, 0 100%)",
                  zIndex: 20,
                }}
              />

              {/* Flap - falls back with weight */}
              <motion.div
                className="absolute inset-x-0 top-0"
                style={{
                  height: "66%",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  zIndex: open ? 5 : 30,
                  background: kraft,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  borderTop: `1px solid ${kraftLine}`,
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: open ? -168 : 0 }}
                transition={{ duration: 0.9, ease: easeInOut, delay: open ? 0.1 : 0 }}
              />

              {/* Wax seal - breaks open */}
              <motion.div
                className="absolute left-1/2 top-[62%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{
                  background: "var(--olive)",
                  color: "var(--paper)",
                  zIndex: 35,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={open ? { scale: 0.4, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: easeOut }}
                aria-hidden
              >
                <span className="font-display text-[0.85rem]">
                  {wedding.couple.one[0]}
                  {wedding.couple.two[0]}
                </span>
              </motion.div>
            </div>

            <motion.span
              className="mt-10 text-[0.78rem] text-ink-soft"
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              Tap to open
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
