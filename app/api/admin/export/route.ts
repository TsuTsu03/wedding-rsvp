import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getAdminData, rowsToCsv } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await getAdminData();
  const csv = rowsToCsv(rows);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps-${date}.csv"`,
    },
  });
}
