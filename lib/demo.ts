// Shared copy + helper for graceful "preview mode" when no database is reachable
// (e.g. deployed to Vercel before Supabase is wired up). The static site renders
// fully; only the DB-backed features show this notice instead of crashing.

export const DEMO_DB_MESSAGE =
  "This is a preview deployment — the RSVP database isn't connected yet. " +
  "It works locally, and on production once a database (Supabase) is configured.";

/** True when an error looks like "no database available" rather than a real bug. */
export function isDbUnavailable(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /DATABASE_URL|Can't reach database|Unable to open the database|database file|PrismaClientInitializationError|ENOENT|no such table|does not exist/i.test(
    msg
  );
}
