import { prisma } from "@/lib/prisma";
import { seatLabels } from "@/lib/utils";

export type FloorTable = {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  takenSeats: string[]; // seat labels already reserved
  remaining: number;
};

/** Floor plan snapshot for the seat picker: every table with its taken seats. */
export async function getFloorPlan(): Promise<FloorTable[]> {
  const tables = await prisma.table.findMany({
    orderBy: { name: "asc" },
    include: { reservations: { select: { seatLabel: true } } },
  });
  return tables.map((t) => {
    const taken = t.reservations.map((r) => r.seatLabel);
    return {
      id: t.id,
      name: t.name,
      capacity: t.capacity,
      x: t.x,
      y: t.y,
      takenSeats: taken,
      remaining: Math.max(0, t.capacity - taken.length),
    };
  });
}

export type GuestLookup = {
  id: string;
  name: string;
  email: string | null;
  partySize: number;
  rsvp: {
    status: string;
    mealPreference: string | null;
    plusOnes: number;
    note: string | null;
  } | null;
  reservations: { tableId: string; tableName: string; seatLabel: string }[];
};

/** Find a guest by invite code (exact, case-insensitive) or by name. */
export async function lookupGuest(query: string): Promise<GuestLookup | null> {
  const q = query.trim();
  if (!q) return null;

  const guest = await prisma.guest.findFirst({
    where: {
      OR: [
        { inviteCode: q.toUpperCase() },
        { name: { contains: q } }, // SQLite LIKE is case-insensitive for ASCII
      ],
    },
    include: {
      rsvp: true,
      reservations: { include: { table: { select: { name: true } } } },
    },
  });

  if (!guest) return null;
  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    partySize: guest.partySize,
    rsvp: guest.rsvp
      ? {
          status: guest.rsvp.status,
          mealPreference: guest.rsvp.mealPreference,
          plusOnes: guest.rsvp.plusOnes,
          note: guest.rsvp.note,
        }
      : null,
    reservations: guest.reservations.map((r) => ({
      tableId: r.tableId,
      tableName: r.table.name,
      seatLabel: r.seatLabel,
    })),
  };
}

/** Reserve a set of seats at one table for a guest, enforcing capacity in a
 *  transaction. Replaces any prior reservations the guest held. */
export async function reserveSeats(
  guestId: string,
  tableId: string,
  seats: string[]
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) return { ok: false, reason: "Guest not found." };

  const table = await prisma.table.findUnique({ where: { id: tableId } });
  if (!table) return { ok: false, reason: "Table not found." };

  const valid = new Set(seatLabels(table.capacity));
  const wanted = Array.from(new Set(seats));
  if (wanted.length === 0) return { ok: false, reason: "No seats selected." };
  if (wanted.some((s) => !valid.has(s)))
    return { ok: false, reason: "Invalid seat." };

  try {
    await prisma.$transaction(async (tx) => {
      // Free the guest's existing seats first (re-selection / changes).
      await tx.reservation.deleteMany({ where: { guestId } });

      // Re-check live capacity inside the transaction.
      const taken = await tx.reservation.findMany({
        where: { tableId },
        select: { seatLabel: true },
      });
      const takenSet = new Set(taken.map((t) => t.seatLabel));
      for (const s of wanted) {
        if (takenSet.has(s)) {
          throw new Error(`Seat ${s} was just taken.`);
        }
      }
      if (taken.length + wanted.length > table.capacity) {
        throw new Error("Not enough seats remaining at this table.");
      }

      await tx.reservation.createMany({
        data: wanted.map((seatLabel) => ({ guestId, tableId, seatLabel })),
      });
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Reservation failed." };
  }
}
