# Wedding Website — Digital Invitation, RSVP & Seat Reservation

A premium, mobile-first wedding site: a cinematic envelope invitation, our-story
timeline, details with a bespoke map, entourage, a multi-step **RSVP with a visual
seat-reservation floor plan**, an editorial gallery, dress code / FAQ, and an
auth-gated admin dashboard.

Built with Next.js 14 (App Router) · TypeScript · Tailwind (custom tokens) ·
Framer Motion · Lenis · Prisma · Resend.

---

## Run it (zero-config demo)

No keys needed — it runs on a seeded local SQLite database.

```bash
npm install
npm run db:reset   # creates + seeds dev.db
npm run dev        # http://localhost:3000
```

Try the RSVP flow with invite code **`GABRIEL`** (party of 4) or name **`Sofia`**.
Admin dashboard: **/admin** — demo passcode **`demo`**.

## Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run db:reset` | Reset + reseed the local database |
| `npm run db:seed` | Reseed only |

---

## Going to production

1. **Database → Supabase Postgres.** In `prisma/schema.prisma` change the datasource
   `provider` to `"postgresql"`, set `DATABASE_URL` to your Supabase connection
   string, then `npx prisma db push && npm run db:seed`.
   (Note: SQLite can't use Prisma enums, so `Rsvp.status` is a string validated in
   `lib/types.ts` — on Postgres you may promote it to a native enum.)
2. **Email → Resend.** Set `RESEND_API_KEY` and `RESEND_FROM`. Without a key,
   confirmations are logged to the server console instead of sent.
3. **Admin auth.** The demo uses a passcode cookie (`lib/auth.ts`). Swap in NextAuth
   or Supabase Auth — the dashboard only depends on `isAuthed()`.
4. Deploy to **Vercel**. Add the env vars above.

See `.env.example` for all variables.

---

## Where to edit

- **All copy & details** (couple names, date, venue, story, entourage, meals, FAQ,
  swatches): [`lib/content.ts`](lib/content.ts) — one file.
- **Design tokens** (palette, type, motion curves): [`app/globals.css`](app/globals.css)
  and [`tailwind.config.ts`](tailwind.config.ts).
- **Tables & guest list** (floor plan layout, seeded invitees):
  [`prisma/seed.ts`](prisma/seed.ts).

## Design notes

Botanical-editorial direction — warm ivory paper, espresso ink, one muted olive
accent, a whisper of clay. Two typefaces only: **Fraunces** (display) and
**Hanken Grotesk** (text). Motion follows Emil Kowalski's principles: custom easing
curves, springs for the tactile seat picker, ≤300ms for UI interactions, one
celebratory confetti beat, and full `prefers-reduced-motion` support.
