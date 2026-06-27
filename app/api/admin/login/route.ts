import { NextRequest, NextResponse } from "next/server";
import { adminPasscode, setAuthCookie, clearAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json().catch(() => ({ passcode: "" }));
  if (passcode !== adminPasscode()) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }
  setAuthCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
