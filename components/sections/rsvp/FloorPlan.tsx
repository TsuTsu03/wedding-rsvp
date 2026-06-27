"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { FloorTable } from "@/lib/db";
import { seatLabels } from "@/lib/utils";
import { easeOut, tactileSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The tactile centrepiece. A top-down room: tap a table to open its seat ring,
 * then tap individual seats. Full tables are disabled; the selected table glows
 * olive. Everything responds to touch with a spring - it should feel physical.
 */
export function FloorPlan({
  tables,
  activeTableId,
  onSelectTable,
  selectedSeats,
  onToggleSeat,
  seatsNeeded,
}: {
  tables: FloorTable[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
  selectedSeats: string[];
  onToggleSeat: (seat: string) => void;
  seatsNeeded: number;
}) {
  const active = tables.find((t) => t.id === activeTableId) ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* The room */}
      <div className="relative aspect-[4/3] w-full rounded-lg border border-line bg-[#efe9dc] sm:aspect-[16/9]">
        {/* faint floor grid */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(120% 100% at 50% 30%, #000 55%, transparent)",
          }}
        />
        {/* "Head of room" marker */}
        <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[0.62rem] uppercase tracking-widest2 text-ink-soft">
          Stage
        </span>

        {tables.map((t) => {
          const full = t.remaining <= 0;
          const isActive = t.id === activeTableId;
          const filledRatio = (t.capacity - t.remaining) / t.capacity;
          // Size scales gently with capacity.
          const size = 44 + (t.capacity - 6) * 2.2;
          return (
            <motion.button
              key={t.id}
              type="button"
              disabled={full}
              onClick={() => onSelectTable(t.id)}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center",
                "transition-[border-color,background-color] duration-200 ease-out",
                full
                  ? "cursor-not-allowed border border-dashed border-ink/15 bg-ink/[0.04] text-ink-soft/50"
                  : "border bg-surface text-ink hover:border-olive",
                isActive ? "border-olive" : "border-line"
              )}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: size,
                height: size,
                boxShadow: isActive ? "0 0 0 4px rgba(61,74,58,0.14)" : undefined,
              }}
              whileTap={full ? undefined : { scale: 0.94 }}
              transition={tactileSpring}
              aria-label={`${t.name}, ${full ? "full" : `${t.remaining} of ${t.capacity} seats free`}`}
            >
              {/* occupancy arc */}
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke={full ? "transparent" : "var(--olive)"}
                  strokeOpacity="0.85"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${filledRatio * 289} 289`}
                />
              </svg>
              <span className="px-1 text-[0.6rem] font-medium leading-tight">
                {t.name.replace("Table ", "T")}
              </span>
              <span className="text-[0.58rem] text-ink-soft">
                {full ? "Full" : `${t.remaining} free`}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Seat ring for the active table */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="rounded-lg border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-[1.3rem] leading-none">{active.name}</h4>
                <p className="mt-1 text-[0.82rem] text-ink-soft">
                  {active.remaining} of {active.capacity} seats free
                </p>
              </div>
              <p className="text-[0.82rem] text-ink-soft">
                <span className="font-medium text-ink">{selectedSeats.length}</span> / {seatsNeeded} chosen
              </p>
            </div>

            <SeatRing
              table={active}
              selectedSeats={selectedSeats}
              onToggleSeat={onToggleSeat}
              seatsNeeded={seatsNeeded}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeatRing({
  table,
  selectedSeats,
  onToggleSeat,
  seatsNeeded,
}: {
  table: FloorTable;
  selectedSeats: string[];
  onToggleSeat: (seat: string) => void;
  seatsNeeded: number;
}) {
  const seats = useMemo(() => seatLabels(table.capacity), [table.capacity]);
  const taken = useMemo(() => new Set(table.takenSeats), [table.takenSeats]);

  return (
    <div className="relative mx-auto mt-6 aspect-square w-full max-w-[320px]">
      {/* table surface */}
      <div className="absolute left-1/2 top-1/2 flex h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper">
        <span className="font-display text-[0.9rem] italic text-ink-soft">
          {table.name}
        </span>
      </div>

      {seats.map((seat, i) => {
        const angle = (i / seats.length) * Math.PI * 2 - Math.PI / 2;
        const r = 42; // percent radius
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        const isTaken = taken.has(seat);
        const isSelected = selectedSeats.includes(seat);
        const atLimit = selectedSeats.length >= seatsNeeded && !isSelected;
        const disabled = isTaken || atLimit;

        return (
          <motion.button
            key={seat}
            type="button"
            disabled={isTaken}
            onClick={() => onToggleSeat(seat)}
            className={cn(
              "absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[0.7rem] font-medium",
              "transition-[background-color,border-color,color,opacity] duration-150 ease-out",
              isTaken
                ? "cursor-not-allowed border-dashed border-ink/20 bg-ink/[0.05] text-ink-soft/40"
                : isSelected
                  ? "border-olive bg-olive text-paper"
                  : "border-line bg-surface text-ink hover:border-olive",
              !isTaken && atLimit && "opacity-45"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
            whileTap={isTaken ? undefined : { scale: 0.9 }}
            transition={tactileSpring}
            aria-pressed={isSelected}
            aria-label={`Seat ${seat}${isTaken ? ", taken" : isSelected ? ", selected" : ""}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isSelected ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={tactileSpring}
                >
                  <Check size={15} strokeWidth={2.4} />
                </motion.span>
              ) : (
                <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {seat.replace("S", "")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
