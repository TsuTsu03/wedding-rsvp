"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { gallery, type Frame } from "@/lib/content";
import { easeOut, inViewOnce } from "@/lib/motion";
import { EditorialHeader } from "@/components/ui/EditorialHeader";

function Perfs() {
  return (
    <div className="flex items-center justify-between bg-[#241c14] px-2 py-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="h-1 w-2 rounded-[1px] bg-paper/75" />
      ))}
    </div>
  );
}

/**
 * The gallery as a film contact sheet - proofs in their frames, frame-numbered.
 * Clicking a proof zooms the photo via a shared layoutId (a real zoom, not a fade).
 */
export function Gallery() {
  const [active, setActive] = useState<Frame | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="gallery" className="shell py-[var(--space-section)]">
      <EditorialHeader
        index="V"
        kicker="The Gallery"
        title="Selected frames"
        lede="A small contact sheet. More to come once the day has passed."
      />

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((frame, i) => (
          <motion.button
            key={frame.id}
            type="button"
            onClick={() => setActive(frame)}
            className="block w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.6, ease: easeOut, delay: (i % 4) * 0.05 }}
          >
            <div className="group bg-[#241c14] p-1.5 shadow-soft">
              <Perfs />
              <motion.div
                layoutId={`frame-${frame.id}`}
                className="relative overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  style={{ background: frame.tone }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,transparent,rgba(20,17,13,0.34))]" />
                <span className="absolute right-2 top-1.5 font-display text-[0.6rem] tracking-widest2 text-paper/70">
                  {String(i + 21)}
                </span>
                <span className="absolute bottom-2 left-2.5 font-display text-[0.85rem] italic text-paper/90">
                  {frame.caption}
                </span>
              </motion.div>
              <Perfs />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-noir/80 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-2xl bg-[#241c14] p-2 shadow-soft" onClick={(e) => e.stopPropagation()}>
              <Perfs />
              <motion.div
                layoutId={`frame-${active.id}`}
                className="relative overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
              >
                <div className="absolute inset-0" style={{ background: active.tone }} />
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,transparent,rgba(20,17,13,0.36))]" />
                <span className="absolute bottom-4 left-5 font-display text-[1.3rem] italic text-paper">
                  {active.caption}
                </span>
              </motion.div>
              <Perfs />
            </div>
            <motion.button
              type="button"
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-150 hover:scale-105 active:scale-95"
              onClick={() => setActive(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.75} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
