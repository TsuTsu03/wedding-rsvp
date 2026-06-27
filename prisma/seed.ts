import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Visual floor plan: coordinates are in a 0–100 grid (percentage of the plan).
// The head table sits up top; guest tables fan out in two arcs below it.
const TABLES = [
  { name: "Head Table", capacity: 6, x: 50, y: 14 },
  { name: "Table 1", capacity: 8, x: 24, y: 34 },
  { name: "Table 2", capacity: 8, x: 50, y: 34 },
  { name: "Table 3", capacity: 8, x: 76, y: 34 },
  { name: "Table 4", capacity: 8, x: 16, y: 56 },
  { name: "Table 5", capacity: 8, x: 38, y: 56 },
  { name: "Table 6", capacity: 8, x: 62, y: 56 },
  { name: "Table 7", capacity: 8, x: 84, y: 56 },
  { name: "Table 8", capacity: 10, x: 30, y: 78 },
  { name: "Table 9", capacity: 10, x: 50, y: 78 },
  { name: "Table 10", capacity: 10, x: 70, y: 78 },
];

// Seeded invitees. Guests use their invite code (or name) to look themselves up.
const GUESTS = [
  { name: "Olivia Mendoza", email: "olivia@example.com", inviteCode: "OLIVIA", partySize: 2 },
  { name: "Lucas Reyes", email: "lucas@example.com", inviteCode: "LUCAS", partySize: 2 },
  { name: "Sofia Castillo", email: "sofia@example.com", inviteCode: "SOFIA", partySize: 1 },
  { name: "Gabriel Santos", email: "gabriel@example.com", inviteCode: "GABRIEL", partySize: 4 },
  { name: "Isabella Cruz", email: "isabella@example.com", inviteCode: "BELLA", partySize: 2 },
  { name: "Noah Villanueva", email: "noah@example.com", inviteCode: "NOAH", partySize: 1 },
  { name: "Mia Aquino", email: "mia@example.com", inviteCode: "MIA", partySize: 2 },
  { name: "Ethan Navarro", email: "ethan@example.com", inviteCode: "ETHAN", partySize: 3 },
  { name: "Amara Delos Reyes", email: "amara@example.com", inviteCode: "AMARA", partySize: 2 },
  { name: "Liam Bautista", email: "liam@example.com", inviteCode: "LIAM", partySize: 1 },
  { name: "Chloe Pascual", email: "chloe@example.com", inviteCode: "CHLOE", partySize: 2 },
  { name: "Daniel Ramos", email: "daniel@example.com", inviteCode: "DANIEL", partySize: 2 },
];

async function main() {
  console.log("Seeding wedding database…");

  // Tables (idempotent by name).
  for (const t of TABLES) {
    const existing = await prisma.table.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.table.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.table.create({ data: t });
    }
  }

  // Guests + a PENDING rsvp shell each.
  for (const g of GUESTS) {
    await prisma.guest.upsert({
      where: { inviteCode: g.inviteCode },
      update: { name: g.name, email: g.email, partySize: g.partySize },
      create: {
        ...g,
        rsvp: { create: { status: "PENDING" } },
      },
    });
  }

  // Pre-fill a couple of reservations so occupancy + a busy table read as real.
  const t2 = await prisma.table.findFirst({ where: { name: "Table 2" } });
  const lucas = await prisma.guest.findUnique({ where: { inviteCode: "LUCAS" } });
  if (t2 && lucas) {
    for (let i = 1; i <= 6; i++) {
      await prisma.reservation.upsert({
        where: { tableId_seatLabel: { tableId: t2.id, seatLabel: `S${i}` } },
        update: {},
        create: { guestId: lucas.id, tableId: t2.id, seatLabel: `S${i}` },
      });
    }
    await prisma.rsvp.update({
      where: { guestId: lucas.id },
      data: { status: "YES", mealPreference: "Beef", plusOnes: 1 },
    });
  }

  const counts = {
    tables: await prisma.table.count(),
    guests: await prisma.guest.count(),
    reservations: await prisma.reservation.count(),
  };
  console.log("Done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
