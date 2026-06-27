"use client";

import { cn } from "@/lib/utils";

/**
 * A magazine/programme section header: a full-width top rule, an oversized act
 * numeral on the left, and a big asymmetric title on the right. Deliberately not
 * the centered-eyebrow-and-sprig pattern - this reads as an edited publication.
 */
export function EditorialHeader({
  index,
  kicker,
  title,
  lede,
  dark,
  className,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
  dark?: boolean;
  className?: string;
}) {
  const rule = dark ? "border-ivory/25" : "border-ink/20";
  const sub = dark ? "text-ivory/55" : "text-ink-soft";
  const main = dark ? "text-ivory" : "text-ink";
  const accent = dark ? "text-sage" : "text-olive";

  return (
    <div className={cn("border-t pt-5 sm:pt-7", rule, className)}>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-12">
        {/* Act numeral + kicker */}
        <div
          className="flex items-start gap-4 sm:col-span-4"
        >
          <span className={cn("font-display text-[2.6rem] font-light leading-[0.8]", accent)}>
            {index}
          </span>
          <span className={cn("mt-1 text-[0.7rem] uppercase tracking-widest2", sub)}>
            {kicker}
          </span>
        </div>

        {/* Title + lede */}
        <div className="sm:col-span-8">
          <h2
            className={cn(
              "text-balance font-display font-light leading-[0.98] tracking-[-0.01em]",
              "text-[clamp(2.1rem,6vw,4.4rem)]",
              main
            )}
          >
            {title}
          </h2>
          {lede && (
            <p
              className={cn("mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed", sub)}
            >
              {lede}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
