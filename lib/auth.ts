import { cookies } from "next/headers";

// Demo gate: a single shared passcode stored in an httpOnly cookie. For
// production, swap this for NextAuth or Supabase Auth - the dashboard only
// depends on `isAuthed()`.

const COOKIE = "wedding_admin";

export function adminPasscode(): string {
  return process.env.ADMIN_PASSCODE ?? "demo";
}

export function isAuthed(): boolean {
  return cookies().get(COOKIE)?.value === adminPasscode();
}

export function setAuthCookie() {
  cookies().set(COOKIE, adminPasscode(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE);
}
