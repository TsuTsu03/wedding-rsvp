"use client";

import { motion } from "framer-motion";
import { entourage } from "@/lib/content";
import { easeOut, inViewOnce } from "@/lib/motion";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { cn } from "@/lib/utils";

/**
 * "The Cast & Crew" - the entourage as a film credit roll. Each role sits on the
 * left, the name(s) on the right, joined by a dotted leader. Reads like a playbill
 * rather than a generic avatar grid.
 */
export function Entourage() {
  return (
    <section id="entourage" className="shell py-[var(--space-section)]">
      <EditorialHeader
        index="III"
        kicker="The Cast"
        title="The cast & crew"
        lede="The hands and hearts standing beside us on the day."
      />

      <div className="mt-16 space-y-14 sm:mt-24 sm:space-y-20">
        {entourage.map((group, gi) => (
          <div key={group.group} className="grid gap-x-10 gap-y-6 sm:grid-cols-12">
            <div className="sm:col-span-3">
              <h3 className="font-display text-[1.2rem] font-light italic leading-tight text-olive">
                {group.group}
              </h3>
              <span className="mt-2 block text-[0.66rem] uppercase tracking-widest2 text-ink-soft">
                Roll {String(gi + 1).padStart(2, "0")}
              </span>
            </div>

            <motion.ul
              className="sm:col-span-9"
              initial="hidden"
              whileInView="show"
              viewport={inViewOnce}
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            >
              {group.people.map((p, i) => (
                <motion.li
                  key={p.role}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
                  }}
                  className={cn(
                    "flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4",
                    i > 0 && "border-t border-line"
                  )}
                >
                  <span className="text-[0.72rem] uppercase tracking-widest2 text-ink-soft">
                    {p.role}
                  </span>
                  <span className="hidden h-px flex-1 translate-y-[-3px] border-b border-dotted border-ink/25 sm:block" />
                  <span className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-light leading-tight text-ink sm:text-right">
                    {p.names.join(" / ")}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </section>
  );
}
