"use client";

import { cn } from "@/lib/utils";

/**
 * A placeholder "photograph" presented as a single frame of film - sprocket
 * perforations top and bottom, a frame number, and a slate caption. Ties the
 * whole interior to the film concept and gives the empty placeholders real
 * character. Swap the toned fill for a real <img> at handoff.
 */
function Perforations() {
  return (
    <div className="flex items-center justify-between bg-[#241c14] px-2.5 py-[5px]">
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="h-[5px] w-2.5 rounded-[1.5px] bg-paper/80" />
      ))}
    </div>
  );
}

export function FilmFrame({
  tone,
  caption,
  frameNo,
  ratio = "4 / 5",
  className,
}: {
  tone: string;
  caption?: string;
  frameNo?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={cn("group overflow-hidden bg-[#241c14] p-1.5 shadow-soft", className)}>
      <Perforations />
      <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          style={{ background: tone }}
        />
        {/* duotone-ish depth + cinematic vignette, no actual image needed */}
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_-10%,transparent,rgba(20,17,13,0.4))]" />
        <div className="absolute inset-0 mix-blend-overlay bg-[linear-gradient(35deg,rgba(174,186,160,0.18),transparent_55%,rgba(180,105,78,0.16))]" />

        {frameNo && (
          <span className="absolute right-2.5 top-2 font-display text-[0.62rem] tracking-widest2 text-paper/70">
            {frameNo}
          </span>
        )}
        {caption && (
          <figcaption className="absolute bottom-2.5 left-3 max-w-[calc(100%-1.5rem)] border-l border-paper/45 pl-2">
            <span className="font-display text-[0.95rem] italic text-paper/95">
              {caption}
            </span>
          </figcaption>
        )}
      </div>
      <Perforations />
    </figure>
  );
}
