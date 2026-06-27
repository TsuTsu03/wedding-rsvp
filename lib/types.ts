// App-level constraints not expressed in the SQLite schema.

export const RSVP_STATUS = ["PENDING", "YES", "NO"] as const;
export type RsvpStatus = (typeof RSVP_STATUS)[number];

export function isRsvpStatus(v: unknown): v is RsvpStatus {
  return typeof v === "string" && (RSVP_STATUS as readonly string[]).includes(v);
}
