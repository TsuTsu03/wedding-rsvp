/** Minimal className joiner - avoids a clsx dependency for a small surface. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Seat labels for a table: S1...Sn. */
export function seatLabels(capacity: number): string[] {
  return Array.from({ length: capacity }, (_, i) => `S${i + 1}`);
}
