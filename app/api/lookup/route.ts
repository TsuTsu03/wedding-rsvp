import { NextRequest, NextResponse } from "next/server";
import { lookupGuest } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { query } = await req.json().catch(() => ({ query: "" }));
  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "Please enter a name or invite code." }, { status: 400 });
  }
  const guest = await lookupGuest(query);
  if (!guest) {
    return NextResponse.json(
      { error: "We couldn't find that invitation. Try your full name or invite code." },
      { status: 404 }
    );
  }
  return NextResponse.json({ guest });
}
