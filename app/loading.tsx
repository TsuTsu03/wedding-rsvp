import { wedding } from "@/lib/content";

/**
 * A single elegant moment, not a spinner. The monogram breathes on paper while
 * the route resolves.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center">
        <span className="animate-pulse font-display text-[2.4rem] tracking-wide text-ink">
          {wedding.couple.monogram}
        </span>
        <span className="mt-3 text-[0.68rem] uppercase tracking-widest2 text-ink-soft">
          {wedding.location}
        </span>
      </div>
    </div>
  );
}
