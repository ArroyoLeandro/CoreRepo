# CoreRepo

Fullstack monorepo template: **Next.js** (`apps/web`) + **NestJS** (`apps/api`) with shared Zod contracts and a typed API client.

## Apps and packages

- `apps/web` — Next.js on port **3000**
- `apps/api` — NestJS on port **4000**
- `packages/validators` — Zod schemas (SSOT) via tsup dual CJS/ESM
- `packages/api-client` — typed `fetch` client (`credentials: 'include'`)
- `packages/ui` — shared UI stubs
- `packages/eslint-config` / `packages/typescript-config` — shared tooling

## Getting started

```sh
pnpm install
cp .env.example .env
pnpm turbo build --filter=@repo/validators --filter=@repo/api-client
pnpm turbo dev
```

- Web: http://localhost:3000
- API health: http://localhost:4000/health

## Environment

See `.env.example`:

| Variable | Default | Used by |
| --- | --- | --- |
| `PORT` | `4000` | API listen port |
| `CORS_ORIGIN` | `http://localhost:3000` | API CORS |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Web → API client |

## Scripts

```sh
pnpm turbo build
pnpm turbo dev
pnpm --filter api test
```

## Notes

- Nest build outputs (`dist/**`) are covered in `turbo.json`.
- Shared packages use tsup dual packages so Nest (CJS) and Next (ESM) both resolve.
