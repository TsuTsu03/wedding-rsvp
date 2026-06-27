"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Gift } from "lucide-react";
import { dressCode, faqs } from "@/lib/content";
import { easeOut, inViewOnce } from "@/lib/motion";
import { EditorialHeader } from "@/components/ui/EditorialHeader";

export function DressCode() {
  return (
    <section id="details-extra" className="py-[var(--space-section)]">
      <div className="shell">
        <EditorialHeader
          index="VI"
          kicker="The Fine Print"
          title="Dress code & notes"
          lede="A few notes to help you plan, with answers to what guests usually ask."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Dress code + registry */}
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <span className="eyebrow">Attire</span>
              <h3 className="mt-3 font-display text-[1.7rem]">{dressCode.title}</h3>
              <p className="mt-3 max-w-prose2 text-[0.98rem] leading-relaxed text-ink-soft">
                {dressCode.note}
              </p>

              <div className="mt-7 flex flex-wrap gap-5">
                {dressCode.swatches.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewOnce}
                    transition={{ duration: 0.5, ease: easeOut, delay: i * 0.05 }}
                  >
                    <span
                      className="h-14 w-14 rounded-full border border-line"
                      style={{ background: s.hex }}
                    />
                    <span className="text-[0.72rem] uppercase tracking-widest2 text-ink-soft">
                      {s.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 rounded-lg border border-line bg-paper p-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            >
              <Gift size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
              <div>
                <h4 className="text-[1.05rem] text-ink">On gifts</h4>
                <p className="mt-2 max-w-prose2 text-[0.92rem] leading-relaxed text-ink-soft">
                  {dressCode.registry}
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <div>
            <span className="eyebrow">Good to know</span>
            <ul className="mt-4 border-t border-line">
              {faqs.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.li
      className="border-b border-line"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.5, ease: easeOut, delay: index * 0.04 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[1.02rem] text-ink">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: easeOut }}
          className="shrink-0 text-ink-soft"
        >
          <Plus size={18} strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="max-w-prose2 pb-5 text-[0.94rem] leading-relaxed text-ink-soft">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
