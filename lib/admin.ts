import { prisma } from "@/lib/prisma";

export type AdminRow = {
  id: string;
  name: string;
  email: string | null;
  inviteCode: string;
  partySize: number;
  status: string; // PENDING | YES | NO
  meal: string | null;
  plusOnes: number;
  headcount: number; // attending heads (0 if not YES)
  table: string | null;
  seats: string[];
  updatedAt: string | null;
};

export type AdminData = {
  rows: AdminRow[];
  summary: {
    invited: number; // distinct invitations
    attendingHeads: number; // confirmed heads
    yes: number;
    no: number;
    pending: number;
  };
  tables: { id: string; name: string; capacity: number; reserved: number }[];
};

export async function getAdminData(): Promise<AdminData> {
  const [guests, tables] = await Promise.all([
    prisma.guest.findMany({
      orderBy: { name: "asc" },
      include: {
        rsvp: true,
        reservations: { include: { table: { select: { name: true } } } },
      },
    }),
    prisma.table.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { reservations: true } } },
    }),
  ]);

  const rows: AdminRow[] = guests.map((g) => {
    const status = g.rsvp?.status ?? "PENDING";
    const plusOnes = g.rsvp?.plusOnes ?? 0;
    return {
      id: g.id,
      name: g.name,
      email: g.email,
      inviteCode: g.inviteCode,
      partySize: g.partySize,
      status,
      meal: g.rsvp?.mealPreference ?? null,
      plusOnes,
      headcount: status === "YES" ? 1 + plusOnes : 0,
      table: g.reservations[0]?.table.name ?? null,
      seats: g.reservations.map((r) => r.seatLabel),
      updatedAt: g.rsvp?.updatedAt?.toISOString() ?? null,
    };
  });

  const summary = {
    invited: rows.length,
    attendingHeads: rows.reduce((n, r) => n + r.headcount, 0),
    yes: rows.filter((r) => r.status === "YES").length,
    no: rows.filter((r) => r.status === "NO").length,
    pending: rows.filter((r) => r.status === "PENDING").length,
  };

  return {
    rows,
    summary,
    tables: tables.map((t) => ({
      id: t.id,
      name: t.name,
      capacity: t.capacity,
      reserved: t._count.reservations,
    })),
  };
}

/** RFC-4180-ish CSV for spreadsheet export. */
export function rowsToCsv(rows: AdminRow[]): string {
  const headers = [
    "Name",
    "Email",
    "Invite Code",
    "Status",
    "Party Size",
    "Attending Heads",
    "Meal",
    "Table",
    "Seats",
    "Updated",
  ];
  const esc = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.inviteCode,
      r.status,
      r.partySize,
      r.headcount,
      r.meal,
      r.table,
      r.seats.join(" "),
      r.updatedAt,
    ]
      .map(esc)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}
