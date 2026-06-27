import { NextResponse } from "next/server";
import { getFloorPlan } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tables = await getFloorPlan();
    return NextResponse.json({ tables });
  } catch {
    // Preview mode (no database): return an empty plan rather than crashing.
    return NextResponse.json({ tables: [], demo: true });
  }
}
