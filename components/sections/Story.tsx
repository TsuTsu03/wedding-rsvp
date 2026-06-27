"use client";

import { story, type Milestone } from "@/lib/content";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { FilmFrame } from "@/components/ui/FilmFrame";
import { cn } from "@/lib/utils";

const tones = ["#b9b29f", "#c6bda6", "#b6ac95", "#cabfa8"];

function Chapter({ m, index }: { m: Milestone; index: number }) {
  const left = m.side === "left";
  const sc = `Sc. ${String(index + 1).padStart(2, "0")}`;

  return (
    <div
      data-story-chapter={index + 1}
      className="relative grid items-center gap-y-10 sm:grid-cols-12 sm:gap-x-10 lg:gap-x-14"
    >
      {/* Film frame */}
      <div
        className={cn(
          "relative z-10 sm:col-span-5",
          left ? "sm:order-1 sm:col-start-1" : "sm:order-3 sm:col-start-8"
        )}
      >
        <FilmFrame
          tone={tones[index % tones.length]}
          caption={m.title}
          frameNo={`Fr. ${index + 1}2A`}
        />
      </div>

      {/* Text + year */}
      <div
        className={cn(
          "relative z-20 sm:col-span-6 sm:self-center",
          left ? "sm:order-2 sm:col-start-7" : "sm:order-1 sm:col-start-1 sm:row-start-1"
        )}
      >
        <div className={cn("relative", !left && "sm:text-right")}>
          <div className={cn("flex items-center gap-3", !left && "sm:justify-end")}>
            <span className="text-[0.68rem] uppercase tracking-widest2 text-clay">{sc}</span>
            <span className="h-px w-8 bg-olive/40" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none mt-4 font-display text-[clamp(4.8rem,14vw,9rem)] font-light leading-none text-ink/[0.08]"
          >
            {m.year}
          </div>
          <h3 className="mt-7 font-display text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.08]">
            {m.title}
          </h3>
          <p
            className={cn(
              "mt-4 max-w-[40ch] text-[1.02rem] leading-relaxed text-ink-soft",
              !left && "sm:ml-auto"
            )}
          >
            {m.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  return (
    <section id="story" className="shell py-[var(--space-section)]">
      <EditorialHeader
        index="I"
        kicker="Our Story"
        title="Four chapters, and counting"
        lede="A few of the scenes that brought us to this one: borrowed umbrellas, long trains, a hillside at dusk."
      />

      <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-36">
        {story.map((m, i) => (
          <Chapter key={m.year} m={m} index={i} />
        ))}
      </div>
    </section>
  );
}
