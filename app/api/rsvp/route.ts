import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRsvpStatus } from "@/lib/types";
import { sendConfirmation } from "@/lib/email";
import { DEMO_DB_MESSAGE } from "@/lib/demo";

/**
 * Upsert a guest's RSVP. If they decline (status NO) we send the confirmation
 * here and clear any held seats. If they accept, seat reservation happens in a
 * later step and the email is sent from the reserve route.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.guestId || !isRsvpStatus(body.status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const guest = await prisma.guest.findUnique({ where: { id: body.guestId } });
    if (!guest) {
      return NextResponse.json({ error: "Guest not found." }, { status: 404 });
    }

    const plusOnes =
      typeof body.plusOnes === "number"
        ? Math.max(0, Math.min(body.plusOnes, Math.max(0, guest.partySize - 1)))
        : 0;

    const rsvp = await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      update: {
        status: body.status,
        mealPreference: body.mealPreference ?? null,
        plusOnes,
        note: body.note ?? null,
      },
      create: {
        guestId: guest.id,
        status: body.status,
        mealPreference: body.mealPreference ?? null,
        plusOnes,
        note: body.note ?? null,
      },
    });

    if (body.status === "NO") {
      await prisma.reservation.deleteMany({ where: { guestId: guest.id } });
      await sendConfirmation({ to: guest.email, name: guest.name, status: "NO" });
    }

    return NextResponse.json({ rsvp });
  } catch {
    return NextResponse.json({ demo: true, error: DEMO_DB_MESSAGE }, { status: 503 });
  }
}
