"use client";

import { motion } from "framer-motion";
import { details, wedding } from "@/lib/content";
import { detailIcons } from "@/lib/icons";
import { easeOut, inViewOnce } from "@/lib/motion";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { MapPanel } from "./MapPanel";

/**
 * "The Running Order" - the day presented as a film call-sheet: a single thread
 * down the page with the big call-times, each event hung off it. Dark, to break
 * the rhythm of the light interior.
 */
export function Details() {
  return (
    <section id="details" className="noir relative overflow-hidden py-[var(--space-section)]">
      <div className="section-grain section-grain-dark" aria-hidden />
      <div className="shell relative z-10">
        <EditorialHeader
          dark
          index="II"
          kicker="The Day"
          title="The running order"
          lede="Everything you'll need to find us: call times, places, and a note or two."
        />

        <ol className="relative mt-16 sm:mt-20">
          {/* the thread */}
          <span
            className="absolute left-[7px] top-2 bottom-2 w-px bg-ivory/20 sm:left-[calc(20%+7px)]"
            aria-hidden
          />
          {details.map((d, i) => {
            const Icon = detailIcons[d.icon];
            return (
              <motion.li
                key={d.key}
                className="relative grid grid-cols-[auto_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[20%_auto_1fr] sm:gap-x-8"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: 0.7, ease: easeOut, delay: i * 0.08 }}
              >
                {/* call time (desktop col) */}
                <div className="order-2 hidden text-right sm:order-1 sm:block">
                  <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-none text-ivory">
                    {d.time}
                  </span>
                  <p className="mt-2 text-[0.66rem] uppercase tracking-widest2 text-sage">
                    {d.kicker}
                  </p>
                </div>

                {/* node */}
                <div className="relative order-1 flex flex-col items-center sm:order-2">
                  <span className="mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-sage bg-noir">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  </span>
                </div>

                {/* event */}
                <div className="order-3 sm:order-3">
                  {/* mobile time */}
                  <span className="mb-1 block font-display text-[1.5rem] font-light text-ivory sm:hidden">
                    {d.time}
                  </span>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-[1.5rem] font-light leading-tight text-ivory">
                        {d.title}
                      </h3>
                      <p className="mt-2 text-[1rem] text-ivory/85">{d.venue}</p>
                      <p className="text-[0.9rem] text-ivory/55">{d.address}</p>
                    </div>
                    <span className="shrink-0 text-sage">
                      <Icon />
                    </span>
                  </div>
                  {d.note && (
                    <p className="mt-4 max-w-[44ch] border-t border-ivory/15 pt-4 text-[0.9rem] leading-relaxed text-ivory/60">
                      {d.note}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-14">
          <MapPanel
            place={details[0].venue}
            address={`${details[0].address}, ${wedding.location}`}
          />
        </div>
      </div>
    </section>
  );
}
