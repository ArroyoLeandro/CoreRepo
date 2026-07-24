# CoreRepo

Fullstack monorepo template: **Next.js** (`apps/web`) + **NestJS** (`apps/api`) with shared Zod contracts, Drizzle/Postgres, and cookie JWT auth. Use it as a **GitHub template** (or clone) and ship an admin console on day one.

## Quick path

1. Create a repo from this GitHub template (or `git clone`), then `pnpm install`
2. `cp .env.example .env` — set secrets; keep `SEED_ADMIN_PASSWORD` for the demo admin
3. `docker compose up -d` → `pnpm db:migrate` → `pnpm db:seed`
4. `pnpm turbo dev` → web **3000**, api **4000**, health `http://localhost:4000/health`, admin `http://localhost:3000/admin/login`

## Apps and packages

| Path | Role |
| --- | --- |
| `apps/web` | Next.js UI + `/admin/*` (port **3000**) |
| `apps/api` | NestJS API (port **4000**); boots with `node --env-file=../../.env` |
| `packages/validators` | Zod SSOT (tsup dual CJS/ESM) |
| `packages/api-client` | Typed `fetch` (`credentials: 'include'`) |
| `packages/db` | Drizzle schema, migrate, seed |
| `packages/ui` | Shared UI stubs |

## Environment

Copy `.env.example` → `.env` at the **repo root** (API and db scripts read it from there).

| Variable | Default / note | Used by |
| --- | --- | --- |
| `PORT` | `4000` | API listen |
| `CORS_ORIGIN` | `http://localhost:3000` | API CORS |
| `DATABASE_URL` | local Postgres | API + Drizzle |
| `JWT_*` / `COOKIE_SECURE` | see example | Auth cookies |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Web → API |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `es` | Admin chrome default |
| `SEED_ADMIN_PASSWORD` | **required for seed** | `pnpm db:seed` |
| `SEED_ADMIN_EMAIL` | `admin@example.com` | Seed admin |
| `SEED_ADMIN_NAME` | `Admin` | Seed admin |

## Docker, migrate, seed

```sh
docker compose up -d          # Postgres on localhost:5432
pnpm db:migrate               # drizzle migrations
pnpm db:seed                  # admin user + default locale/theme settings
```

Seed upserts an `admin` role user and `app_settings` defaults (`locale: es`, `theme: light`). Login at `/admin/login` with the seeded email/password.

## Dev and verify

```sh
pnpm turbo build --filter=@repo/validators --filter=@repo/api-client --filter=@repo/db
pnpm turbo dev                # web:3000 + api:4000
pnpm --filter api test        # Jest (needs Postgres + DATABASE_URL)
pnpm --filter web check-types
```

- Web: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
- API health: http://localhost:4000/health  

If `:4000` refuses connections, the API likely crashed — usually missing `DATABASE_URL` or Postgres down.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR: `pnpm install`, build packages + api, migrate against a Postgres service container, `pnpm --filter api test`, and `pnpm --filter web check-types`.

## GitHub template checklist

- [ ] Use **Use this template** (no nested `apps/api/.git`)
- [ ] Copy `.env.example` → `.env` and rotate JWT + seed password
- [ ] Start compose, migrate, seed, then `pnpm turbo dev`
- [ ] Confirm health on `:4000/health` and admin login on `:3000`

## Notes

- Nest build outputs (`dist/**`) are covered in `turbo.json`.
- Shared packages use tsup dual packages so Nest (CJS) and Next (ESM) both resolve.
- Root helpers: `pnpm db:migrate`, `pnpm db:seed`.
