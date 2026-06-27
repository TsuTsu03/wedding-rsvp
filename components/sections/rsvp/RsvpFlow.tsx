"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, Loader2 } from "lucide-react";
import type { FloorTable } from "@/lib/db";
import type { GuestLookup } from "@/lib/db";
import { meals, wedding } from "@/lib/content";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FloorPlan } from "./FloorPlan";
import { Confetti } from "./Confetti";

type Screen = "find" | "attendance" | "meal" | "seats" | "done";

const STEP_OF: Record<Screen, number> = {
  find: 1,
  attendance: 1,
  meal: 2,
  seats: 3,
  done: 4,
};
const STEP_LABELS = ["Attendance", "Meal", "Seats", "Done"];

export function RsvpFlow() {
  const [screen, setScreen] = useState<Screen>("find");
  const [dir, setDir] = useState<1 | -1>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [guest, setGuest] = useState<GuestLookup | null>(null);
  const [attending, setAttending] = useState<"YES" | "NO" | null>(null);
  const [plusOnes, setPlusOnes] = useState(0);
  const [meal, setMeal] = useState<string | null>(null);

  const [tables, setTables] = useState<FloorTable[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [fireConfetti, setFireConfetti] = useState(false);

  const go = useCallback((next: Screen, direction: 1 | -1 = 1) => {
    setError(null);
    setDir(direction);
    setScreen(next);
  }, []);

  const seatsNeeded = 1 + plusOnes;

  // -- Step 1a: look up the guest -------------------------------------------
  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      const g: GuestLookup = data.guest;
      setGuest(g);
      setPlusOnes(g.rsvp?.plusOnes ?? 0);
      setMeal(g.rsvp?.mealPreference ?? null);
      if (g.reservations.length) {
        setActiveTableId(g.reservations[0].tableId);
        setSelectedSeats(g.reservations.map((r) => r.seatLabel));
      }
      go("attendance");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // -- Step 1b: accept / decline --------------------------------------------
  async function decline() {
    if (!guest) return;
    setBusy(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest.id, status: "NO" }),
      });
      setAttending("NO");
      go("done");
    } finally {
      setBusy(false);
    }
  }

  function accept() {
    setAttending("YES");
    go("meal");
  }

  // -- Step 2 -> 3: save meal + load floor plan ------------------------------
  async function continueToSeats() {
    if (!guest || !meal) return;
    setBusy(true);
    setError(null);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          status: "YES",
          mealPreference: meal,
          plusOnes,
        }),
      });
      const res = await fetch("/api/floorplan", { cache: "no-store" });
      const data = await res.json();
      setTables(data.tables);
      go("seats");
    } catch {
      setError("Couldn't load the floor plan. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // -- Step 3 -> 4: reserve seats --------------------------------------------
  async function reserve() {
    if (!guest || !activeTableId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          tableId: activeTableId,
          seats: selectedSeats,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.tables) setTables(data.tables);
        setError(data.error ?? "Those seats are no longer available.");
        return;
      }
      setTables(data.tables);
      setAttending("YES");
      go("done");
      setTimeout(() => setFireConfetti(true), 240);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function toggleSeat(seat: string) {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length < seatsNeeded
          ? [...prev, seat]
          : prev
    );
  }

  function selectTable(id: string) {
    if (id !== activeTableId) {
      setActiveTableId(id);
      setSelectedSeats([]);
    }
  }

  const stepIndex = STEP_OF[screen];

  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
      {/* Progress rail */}
      {screen !== "find" && (
        <div className="flex items-center gap-3 border-b border-line px-6 py-4 sm:px-8">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < stepIndex;
            const current = n === stepIndex;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[0.62rem] font-medium transition-colors duration-200",
                      done && "bg-olive text-paper",
                      current && "border border-olive text-olive",
                      !done && !current && "border border-line text-ink-soft/60"
                    )}
                  >
                    {n}
                  </span>
                  <span
                    className={cn(
                      "hidden text-[0.74rem] tracking-wide sm:inline",
                      current ? "text-ink" : "text-ink-soft/70"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <span className={cn("h-px w-4 sm:w-6", done ? "bg-olive" : "bg-line")} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative min-h-[420px] p-6 sm:p-10">
        <Confetti fire={fireConfetti} />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={screen}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            {screen === "find" && (
              <FindScreen
                query={query}
                setQuery={setQuery}
                onSubmit={lookup}
                busy={busy}
                error={error}
              />
            )}

            {screen === "attendance" && guest && (
              <AttendanceScreen
                guest={guest}
                plusOnes={plusOnes}
                setPlusOnes={setPlusOnes}
                onAccept={accept}
                onDecline={decline}
                busy={busy}
              />
            )}

            {screen === "meal" && (
              <MealScreen
                meal={meal}
                setMeal={setMeal}
                onBack={() => go("attendance", -1)}
                onNext={continueToSeats}
                busy={busy}
                error={error}
              />
            )}

            {screen === "seats" && (
              <SeatsScreen
                tables={tables}
                activeTableId={activeTableId}
                onSelectTable={selectTable}
                selectedSeats={selectedSeats}
                onToggleSeat={toggleSeat}
                seatsNeeded={seatsNeeded}
                onBack={() => go("meal", -1)}
                onReserve={reserve}
                busy={busy}
                error={error}
              />
            )}

            {screen === "done" && (
              <DoneScreen
                guest={guest}
                attending={attending}
                meal={meal}
                tableName={tables.find((t) => t.id === activeTableId)?.name ?? null}
                seats={selectedSeats}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -- Screens ------------------------------------------------------------- */

function FindScreen({
  query,
  setQuery,
  onSubmit,
  busy,
  error,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  busy: boolean;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-md text-center">
      <h3 className="font-display text-[1.8rem] leading-tight">Find your invitation</h3>
      <p className="mt-3 text-[0.95rem] text-ink-soft">
        Enter your name or the invite code on your card.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 text-left">
        <Field
          label="Your name or invite code"
          placeholder="e.g. Olivia Mendoza or OLIVIA"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {error && <p className="text-[0.85rem] text-clay">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="mt-1">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {busy ? "Looking..." : "Continue"}
        </Button>
      </form>
      <p className="mt-6 text-[0.78rem] text-ink-soft/70">
        Try <span className="font-medium text-ink-soft">GABRIEL</span> or{" "}
        <span className="font-medium text-ink-soft">Sofia</span> to preview the flow.
      </p>
    </div>
  );
}

function AttendanceScreen({
  guest,
  plusOnes,
  setPlusOnes,
  onAccept,
  onDecline,
  busy,
}: {
  guest: GuestLookup;
  plusOnes: number;
  setPlusOnes: (n: number) => void;
  onAccept: () => void;
  onDecline: () => void;
  busy: boolean;
}) {
  const maxPlus = Math.max(0, guest.partySize - 1);
  const firstName = guest.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-md text-center">
      <span className="eyebrow">Hello, {firstName}</span>
      <h3 className="mt-4 font-display text-[1.9rem] leading-tight">
        Will you be joining us?
      </h3>
      <p className="mt-3 text-[0.95rem] text-ink-soft">
        We've reserved {guest.partySize === 1 ? "a place" : `${guest.partySize} places`} for
        you. We'd be honoured to have you there.
      </p>

      {maxPlus > 0 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="text-[0.85rem] text-ink-soft">Guests in your party</span>
          <div className="flex items-center gap-1 rounded-full border border-line p-1">
            <button
              type="button"
              onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.04] active:scale-95 disabled:opacity-30"
              disabled={plusOnes <= 0}
              aria-label="Fewer guests"
            >
              -
            </button>
            <span className="w-8 text-center font-display text-[1.2rem]">{plusOnes + 1}</span>
            <button
              type="button"
              onClick={() => setPlusOnes(Math.min(maxPlus, plusOnes + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.04] active:scale-95 disabled:opacity-30"
              disabled={plusOnes >= maxPlus}
              aria-label="More guests"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onAccept} size="lg" disabled={busy}>
          Joyfully accepts
          <ArrowRight size={16} />
        </Button>
        <Button onClick={onDecline} variant="outline" size="lg" disabled={busy}>
          Regretfully declines
        </Button>
      </div>
    </div>
  );
}

function MealScreen({
  meal,
  setMeal,
  onBack,
  onNext,
  busy,
  error,
}: {
  meal: string | null;
  setMeal: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  busy: boolean;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <h3 className="font-display text-[1.8rem] leading-tight">Choose your meal</h3>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          A taste of the evening. Dietary needs? Leave us a note when you arrive.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {meals.map((m) => {
          const selected = meal === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setMeal(m.value)}
              className={cn(
                "flex flex-col rounded text-left transition-[border-color,background-color] duration-200 ease-out active:scale-[0.99]",
                "border p-5",
                selected
                  ? "border-olive bg-olive/[0.05]"
                  : "border-line bg-surface hover:border-ink/25"
              )}
              aria-pressed={selected}
            >
              <span className="flex items-center justify-between">
                <span className="text-[1.05rem] text-ink">{m.label}</span>
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    selected ? "border-olive bg-olive" : "border-line"
                  )}
                >
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                </span>
              </span>
              <span className="mt-1 text-[0.85rem] text-ink-soft">{m.note}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-4 text-center text-[0.85rem] text-clay">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onNext} disabled={!meal || busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          Choose a seat
          {!busy && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}

function SeatsScreen({
  tables,
  activeTableId,
  onSelectTable,
  selectedSeats,
  onToggleSeat,
  seatsNeeded,
  onBack,
  onReserve,
  busy,
  error,
}: {
  tables: FloorTable[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
  selectedSeats: string[];
  onToggleSeat: (s: string) => void;
  seatsNeeded: number;
  onBack: () => void;
  onReserve: () => void;
  busy: boolean;
  error: string | null;
}) {
  const ready = !!activeTableId && selectedSeats.length === seatsNeeded;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h3 className="font-display text-[1.8rem] leading-tight">Reserve your seats</h3>
        <p className="mt-3 text-[0.95rem] text-ink-soft">
          {activeTableId
            ? `Choose ${seatsNeeded} ${seatsNeeded === 1 ? "seat" : "seats"} at your table.`
            : "Tap a table to see its open seats. Full tables are greyed out."}
        </p>
      </div>

      <div className="mt-8">
        <FloorPlan
          tables={tables}
          activeTableId={activeTableId}
          onSelectTable={onSelectTable}
          selectedSeats={selectedSeats}
          onToggleSeat={onToggleSeat}
          seatsNeeded={seatsNeeded}
        />
      </div>

      {error && <p className="mt-4 text-center text-[0.85rem] text-clay">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onReserve} disabled={!ready || busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          {ready
            ? "Reserve & confirm"
            : `Select ${seatsNeeded - selectedSeats.length} more`}
        </Button>
      </div>
    </div>
  );
}

function DoneScreen({
  guest,
  attending,
  meal,
  tableName,
  seats,
}: {
  guest: GuestLookup | null;
  attending: "YES" | "NO" | null;
  meal: string | null;
  tableName: string | null;
  seats: string[];
}) {
  const firstName = guest?.name.split(" ")[0] ?? "friend";
  const accepted = attending === "YES";
  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive text-paper"
      >
        <span className="font-display text-[1.5rem]">{wedding.couple.monogram[0]}</span>
      </motion.div>

      <h3 className="mt-6 font-display text-[2rem] leading-tight">
        {accepted ? "We can't wait to celebrate with you" : "Thank you for letting us know"}
      </h3>
      <p className="mt-3 text-[0.95rem] text-ink-soft">
        {accepted
          ? `Your place is saved, ${firstName}. A confirmation is on its way.`
          : `You'll be missed, ${firstName}. Thank you for replying.`}
      </p>

      {accepted && tableName && (
        <div className="mt-8 inline-flex flex-col gap-2 rounded-lg border border-line bg-surface px-8 py-6 text-left">
          {meal && (
            <Row label="Meal" value={meal} />
          )}
          <Row label="Table" value={tableName} />
          <Row label="Seats" value={seats.map((s) => s.replace("S", "")).join(", ")} />
        </div>
      )}

      <p className="mt-8 text-[0.82rem] italic text-ink-soft">
        {wedding.hashtag}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <span className="text-[0.72rem] uppercase tracking-widest2 text-ink-soft">{label}</span>
      <span className="text-[0.95rem] text-ink">{value}</span>
    </div>
  );
}
