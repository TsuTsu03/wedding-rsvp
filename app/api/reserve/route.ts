import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reserveSeats, getFloorPlan } from "@/lib/db";
import { sendConfirmation } from "@/lib/email";

/**
 * Reserve seats at a table (capacity enforced server-side) and send the final
 * confirmation. Returns the refreshed floor plan so the UI reflects the live
 * state immediately.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.guestId || !body?.tableId || !Array.isArray(body.seats)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await reserveSeats(body.guestId, body.tableId, body.seats);
  if (!result.ok) {
    const tables = await getFloorPlan();
    return NextResponse.json({ error: result.reason, tables }, { status: 409 });
  }

  const guest = await prisma.guest.findUnique({
    where: { id: body.guestId },
    include: { rsvp: true },
  });
  const table = await prisma.table.findUnique({ where: { id: body.tableId } });

  await sendConfirmation({
    to: guest?.email ?? null,
    name: guest?.name ?? "Guest",
    status: "YES",
    meal: guest?.rsvp?.mealPreference ?? null,
    table: table?.name ?? null,
    seats: body.seats,
  });

  const tables = await getFloorPlan();
  return NextResponse.json({ ok: true, tables });
}
