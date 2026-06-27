"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, LogOut, RefreshCw } from "lucide-react";
import type { AdminData } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { wedding } from "@/lib/content";

type Filter = "all" | "YES" | "NO" | "PENDING";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "YES", label: "Attending" },
  { key: "NO", label: "Declined" },
  { key: "PENDING", label: "Pending" },
];

const statusStyles: Record<string, string> = {
  YES: "bg-olive/10 text-olive",
  NO: "bg-clay/10 text-clay",
  PENDING: "bg-ink/[0.05] text-ink-soft",
};
const statusLabel: Record<string, string> = {
  YES: "Attending",
  NO: "Declined",
  PENDING: "Pending",
};

export function AdminDashboard({ data }: { data: AdminData }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return data.rows.filter((r) => {
      const passFilter = filter === "all" || r.status === filter;
      const passQuery =
        !q.trim() ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.inviteCode.toLowerCase().includes(q.toLowerCase());
      return passFilter && passQuery;
    });
  }, [data.rows, filter, q]);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  const { summary } = data;

  return (
    <main className="min-h-[100dvh] bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-[0.66rem] uppercase tracking-widest2 text-ink-soft">
              {wedding.couple.monogram} / Dashboard
            </p>
            <h1 className="font-display text-[1.35rem] leading-none">RSVPs</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.refresh()}
              className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[0.8rem] text-ink-soft transition-colors hover:border-ink/25 hover:text-ink active:scale-95"
            >
              <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="/api/admin/export"
              className="flex h-9 items-center gap-2 rounded-full bg-olive px-4 text-[0.8rem] font-medium text-paper transition-colors hover:bg-olive-soft active:scale-95"
            >
              <Download size={14} /> <span className="hidden sm:inline">Export CSV</span>
            </a>
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/25 hover:text-ink active:scale-95"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Confirmed heads" value={summary.attendingHeads} accent />
          <Stat label="Attending" value={summary.yes} />
          <Stat label="Declined" value={summary.no} />
          <Stat label="Pending" value={summary.pending} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* RSVP list */}
          <section className="order-2 lg:order-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[0.8rem] transition-colors duration-150 active:scale-95",
                      filter === f.key
                        ? "bg-ink text-paper"
                        : "border border-line text-ink-soft hover:border-ink/25 hover:text-ink"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name or code..."
                className="h-9 w-full rounded-full border border-line bg-surface px-4 text-[0.82rem] placeholder:text-ink-soft/55 focus:border-olive focus:outline-none sm:w-56"
              />
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-line">
              {/* header row (desktop) */}
              <div className="hidden grid-cols-[1.6fr_0.8fr_1fr_1fr] gap-4 border-b border-line bg-surface px-5 py-3 text-[0.68rem] uppercase tracking-widest2 text-ink-soft sm:grid">
                <span>Guest</span>
                <span>Status</span>
                <span>Meal</span>
                <span>Seats</span>
              </div>
              <ul>
                {rows.length === 0 && (
                  <li className="px-5 py-10 text-center text-[0.9rem] text-ink-soft">
                    No guests match this view.
                  </li>
                )}
                {rows.map((r) => (
                  <li
                    key={r.id}
                    className="grid grid-cols-1 gap-2 border-b border-line px-5 py-4 last:border-0 sm:grid-cols-[1.6fr_0.8fr_1fr_1fr] sm:items-center sm:gap-4"
                  >
                    <div>
                      <p className="text-[0.95rem] text-ink">{r.name}</p>
                      <p className="text-[0.74rem] text-ink-soft">
                        {r.inviteCode}
                        {r.headcount > 0 && ` / ${r.headcount} attending`}
                      </p>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-medium",
                          statusStyles[r.status]
                        )}
                      >
                        {statusLabel[r.status]}
                      </span>
                    </div>
                    <div className="text-[0.85rem] text-ink-soft">{r.meal ?? "-"}</div>
                    <div className="text-[0.85rem] text-ink-soft">
                      {r.table ? (
                        <span>
                          <span className="text-ink">{r.table}</span>
                          {r.seats.length > 0 &&
                            ` / ${r.seats.map((s) => s.replace("S", "")).join(", ")}`}
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Per-table occupancy */}
          <aside className="order-1 lg:order-2">
            <h2 className="text-[0.68rem] uppercase tracking-widest2 text-ink-soft">
              Table occupancy
            </h2>
            <ul className="mt-4 space-y-3">
              {data.tables.map((t) => {
                const ratio = t.capacity ? t.reserved / t.capacity : 0;
                const full = t.reserved >= t.capacity;
                return (
                  <li key={t.id}>
                    <div className="flex items-center justify-between text-[0.82rem]">
                      <span className="text-ink">{t.name}</span>
                      <span className={cn("tabular-nums", full ? "text-clay" : "text-ink-soft")}>
                        {t.reserved}/{t.capacity}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className={cn("h-full rounded-full", full ? "bg-clay" : "bg-olive")}
                        style={{ width: `${Math.min(100, ratio * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        accent ? "border-olive/30 bg-olive/[0.04]" : "border-line bg-surface"
      )}
    >
      <p className="font-display text-[2.2rem] leading-none tabular-nums text-ink">{value}</p>
      <p className="mt-2 text-[0.72rem] uppercase tracking-widest2 text-ink-soft">{label}</p>
    </div>
  );
}
