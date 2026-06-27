"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Live countdown to the wedding. Renders nothing until mounted to avoid a
 * server/client time mismatch. Only the changing digit animates - seconds tick
 * with a small, quiet vertical roll; larger units stay still (they change rarely).
 */
export function Countdown({ date }: { date: string }) {
  const [parts, setParts] = useState<Parts | null>(null);
  const target = new Date(date).getTime();

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: string }[] = parts
    ? [
        { label: "Days", value: pad(parts.days) },
        { label: "Hours", value: pad(parts.hours) },
        { label: "Minutes", value: pad(parts.minutes) },
        { label: "Seconds", value: pad(parts.seconds) },
      ]
    : [
        { label: "Days", value: "--" },
        { label: "Hours", value: "--" },
        { label: "Minutes", value: "--" },
        { label: "Seconds", value: "--" },
      ];

  // Tone-agnostic: digits inherit currentColor; labels/separators use opacity so
  // the countdown drops onto both the dark hero and light sections unchanged.
  return (
    <div className="flex items-stretch justify-center gap-5 sm:gap-9">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-5 sm:gap-9">
          <div className="flex min-w-[3ch] flex-col items-center">
            <div className="relative h-[1.15em] overflow-hidden font-display text-[clamp(1.8rem,5vw,2.9rem)] leading-none tabular-nums">
              <span className="block">{u.value}</span>
            </div>
            <span className="mt-2 text-[0.66rem] uppercase tracking-widest2 opacity-60">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span aria-hidden className="h-10 w-px self-center bg-current opacity-15" />
          )}
        </div>
      ))}
    </div>
  );
}
