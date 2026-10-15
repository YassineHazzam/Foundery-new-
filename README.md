# Foundry Platform — Next.js

Real estate agency network + listings marketplace for Morocco, rebuilt on
Next.js (App Router), Prisma, and Postgres (Supabase for now).

## Roles

super_admin, admin (city-scoped), agent, developer, notary (private,
per-transaction), public_user — stored in a role-join-table (`user_roles`)
so adding a role later is a data change, never a schema migration. All
authorization goes through one function: `lib/permissions.ts` → `can()`.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind
- Prisma + Postgres (Supabase to start — see below)
- NextAuth (credentials provider, compatible with existing bcrypt hashes)

## Run it locally

```bash
git clone <your-repo-url>
cd foundry-platform
npm install
cp .env.example .env.local
# fill in DATABASE_URL from your Supabase project
# (Project Settings -> Database -> Connection pooling, port 6543)

npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000.

## Migrating your existing data

If you have the old Express/EJS app's `foundry_store` table (the single
JSON blob) in the same Supabase project:

```bash
npm run db:migrate:legacy
```

This reads that blob and writes into the new normalized tables, keeping
original IDs so relations stay intact. Run it once, check counts against
your legacy data before considering the cutover done.

## Deploying on GitHub + hosting

1. Push this repo to GitHub.
2. Deploy on Vercel (recommended for Next.js) — import the repo, set the
   same env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` = your
   production URL) in the Vercel project settings.
3. Run `npx prisma migrate deploy` against production once (via a one-off
   Vercel build step or locally pointed at the prod `DATABASE_URL`).

## Moving off Supabase later

Change `DATABASE_URL` to the new Postgres instance (Neon, RDS, etc.), run
`prisma migrate deploy` there, then migrate the data over (pg_dump/restore,
or re-point `LEGACY_DATABASE_URL` and re-run the migration script). No
schema or application code changes — that's why the DB was kept decoupled
from the provider from the start.

## What's built

- Public: home, `/acheter`, `/louer`, `/bien/[slug]`, `/agents`,
  `/projets-neufs` + `[slug]`, `/connexion` — styled, with search filters,
  SEO metadata per listing
- Agent dashboard: list own properties, create new listing (goes to
  `pending_review`)
- Developer dashboard: view own projects and unit availability
- Admin dashboard: moderation queue (publish/reject listings, city-scoped),
  all listings, agent approvals
- Super-admin: assign admin role (with optional city scope)
- Notary dashboard: assigned transactions (per-deal, via
  `transaction_participants`)
- Lead capture form on every listing (server action → `leads` table)

## Still to build

- Edit-listing form (create exists; edit/delete not yet wired)
- Image upload flow (currently expects media URLs already hosted — wire to
  Cloudflare R2 or Supabase Storage)
- Map view, mortgage calculator, valuation estimator (ported from the old
  app's `/api/map`, `/pret-immobilier`, `/estimation` routes — logic exists
  in the legacy codebase, not yet migrated)
- Password reset / signup flow for new public users
- Full design pass on mobile breakpoints and empty/error states
