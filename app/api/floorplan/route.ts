import { NextResponse } from "next/server";
import { getFloorPlan } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const tables = await getFloorPlan();
  return NextResponse.json({ tables });
}
