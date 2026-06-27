import { Database } from "lucide-react";

/**
 * Shown on /admin when no database is reachable (e.g. a fresh Vercel deploy
 * before Supabase is wired up). Keeps the dashboard from erroring and explains
 * exactly how to bring it online.
 */
export function AdminDemoNotice() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line text-olive">
          <Database size={18} strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[1.7rem]">Preview mode</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          The dashboard is live, but no database is connected yet — so there are no
          RSVPs to show. Connect a database to bring it online.
        </p>
        <ol className="mx-auto mt-6 max-w-sm space-y-2 text-left text-[0.88rem] text-ink-soft">
          <li>
            1. Set <code className="rounded bg-surface px-1 text-ink">DATABASE_URL</code> to a
            Supabase Postgres connection string.
          </li>
          <li>
            2. Switch the Prisma provider to <code className="rounded bg-surface px-1 text-ink">postgresql</code> and run{" "}
            <code className="rounded bg-surface px-1 text-ink">prisma db push</code> +{" "}
            <code className="rounded bg-surface px-1 text-ink">npm run db:seed</code>.
          </li>
          <li>3. Redeploy.</li>
        </ol>
        <a
          href="/"
          className="mt-8 inline-flex h-10 items-center rounded-full border border-ink/25 px-5 text-[0.85rem] text-ink transition-colors hover:border-ink/55"
        >
          Back to the site
        </a>
      </div>
    </main>
  );
}
