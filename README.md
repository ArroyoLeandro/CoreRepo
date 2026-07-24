# CoreRepo

Plantilla fullstack reutilizable en GitHub: monorepo **Turborepo** con **Next.js** (`apps/web`) + **NestJS** (`apps/api`), contratos Zod compartidos, Postgres/Drizzle y auth JWT en cookies. Úsala con **Use this template**, arranca Postgres con Docker y ten un panel `/admin` listo el mismo día.

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Postgres](https://img.shields.io/badge/Postgres-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![Template](https://img.shields.io/badge/GitHub-Template-181717?logo=github&logoColor=white)](https://github.com/ArroyoLeandro/CoreRepo)

## Inicio rápido

1. Crear repo desde el template → [Use this template](https://github.com/ArroyoLeandro/CoreRepo/generate) (o `git clone`)
2. `pnpm install`
3. `cp .env.example .env` — rotar secretos; dejar `SEED_ADMIN_PASSWORD` para el admin demo
4. `docker compose up -d` → `pnpm db:migrate` → `pnpm db:seed`
5. `pnpm turbo dev`

| Servicio | URL |
| --- | --- |
| Web | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| API health | http://localhost:4000/health |

## Qué incluye

| | Capacidad |
| --- | --- |
| ⚡ | Monorepo Turborepo: web + API + packages compartidos |
| 🔐 | Auth JWT en cookies httpOnly + CSRF + argon2id |
| 👤 | Admin `/admin/*`: usuarios CRUD, settings (i18n es/en + tema), perfil |
| 📦 | `@repo/validators` (Zod SSOT), `@repo/api-client`, `@repo/db` (Drizzle) |
| 🐳 | Postgres 16 vía Docker Compose en `localhost:5432` |
| ✉️ | Email en stub de desarrollo (log en consola) |
| ✅ | CI en GitHub Actions (`.github/workflows/ci.yml`) |

## Prerrequisitos

Necesarios antes de correr el happy path:

| Herramienta | Versión / nota |
| --- | --- |
| **Node.js** | `>= 18` ([nodejs.org](https://nodejs.org/)) |
| **pnpm** | `9` — `corepack enable && corepack prepare pnpm@9.0.0 --activate`, o [instalación](https://pnpm.io/installation) |
| **Docker** | Docker Desktop (Windows/macOS) o Docker Engine + Compose — **requerido** para Postgres |
| **Git** | Para clonar o usar el template |

Opcional: cuenta de GitHub para **Use this template**.

> **Windows:** asegurate de que Docker Desktop esté running antes de `docker compose up -d`.

## Arquitectura

```mermaid
flowchart LR
  Browser["Browser / Admin UI"]
  Web["apps/web<br/>Next.js :3000"]
  Api["apps/api<br/>NestJS :4000"]
  Db[("Postgres :5432<br/>Docker")]
  Val["@repo/validators<br/>Zod SSOT"]
  Client["@repo/api-client"]
  DbPkg["@repo/db<br/>Drizzle"]

  Browser --> Web
  Web --> Client
  Client --> Api
  Api --> DbPkg
  DbPkg --> Db
  Web -.-> Val
  Api -.-> Val
  Client -.-> Val
```

## Mapa del monorepo

| Path | Rol |
| --- | --- |
| `apps/web` | Next.js UI + `/admin/*` (puerto **3000**); features en `features/*`, shared en `shared/*` |
| `apps/api` | NestJS API (puerto **4000**); carga env con `node --env-file=../../.env` |
| `packages/validators` | Contratos Zod (fuente única de verdad; tsup CJS/ESM) |
| `packages/api-client` | Cliente `fetch` tipado (`credentials: 'include'`) |
| `packages/db` | Schema Drizzle, migrate y seed |
| `packages/ui` | UI compartida (stubs) |
| `docker-compose.yml` | Postgres 16 (`corerepo` / user+pass `postgres`) |

## Variables de entorno

Copiá `.env.example` → `.env` en la **raíz** del repo (API y scripts de DB lo leen desde ahí).

| Variable | Default / nota | Usado por |
| --- | --- | --- |
| `PORT` | `4000` | API listen |
| `CORS_ORIGIN` | `http://localhost:3000` | CORS de la API |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/corerepo` | API + Drizzle |
| `JWT_ACCESS_SECRET` | cambiar (≥ 32 chars) | Auth cookies |
| `JWT_REFRESH_SECRET` | cambiar (≥ 32 chars) | Auth cookies |
| `JWT_ACCESS_TTL` | `15m` | Access token |
| `JWT_REFRESH_TTL` | `7d` | Refresh token |
| `COOKIE_SECURE` | `false` (local HTTP) | Cookies |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Web → API |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `es` | Locale por defecto del admin |
| `SEED_ADMIN_PASSWORD` | **requerido para seed** | `pnpm db:seed` |
| `SEED_ADMIN_EMAIL` | `admin@example.com` | Admin seed |
| `SEED_ADMIN_NAME` | `Admin` | Admin seed |

### Credenciales admin por defecto

Tras `pnpm db:seed`:

| Campo | Valor |
| --- | --- |
| Email | `SEED_ADMIN_EMAIL` → `admin@example.com` |
| Password | el valor de `SEED_ADMIN_PASSWORD` en tu `.env` |

> **Seguridad:** rotá `JWT_*` y `SEED_ADMIN_PASSWORD` antes de compartir el repo o desplegar. Los defaults de `.env.example` no son seguros.

## Scripts útiles

```sh
# Dependencias
pnpm install

# Infra + DB
docker compose up -d          # Postgres en localhost:5432
pnpm db:migrate               # migraciones Drizzle
pnpm db:seed                  # admin + settings (locale: es, theme: light)

# Desarrollo
pnpm turbo dev                # web:3000 + api:4000

# Verificar
pnpm turbo build --filter=@repo/validators --filter=@repo/api-client --filter=@repo/db
pnpm --filter api test        # Jest (necesita Postgres + DATABASE_URL)
pnpm --filter web check-types
```

## Checklist de onboarding

- [ ] Repo creado con **Use this template** (sin `.git` anidado en `apps/api`)
- [ ] Node ≥ 18, pnpm 9 y Docker disponibles
- [ ] `.env.example` → `.env` con secretos rotados
- [ ] `docker compose up -d` healthy
- [ ] `pnpm db:migrate` + `pnpm db:seed`
- [ ] `pnpm turbo dev` → health en `:4000/health` y login en `:3000/admin/login`

## Estructura del proyecto

```text
.
├── apps/
│   ├── api/                 # NestJS (:4000)
│   └── web/                 # Next.js (:3000)
│       ├── app/admin/       # Rutas del panel
│       ├── features/        # auth, users, settings, profile, dashboard
│       └── shared/          # layout, ui, lib
├── packages/
│   ├── validators/          # Zod SSOT
│   ├── api-client/
│   ├── db/                  # Drizzle + migrate + seed
│   └── ui/
├── docker-compose.yml       # Postgres 16
├── .env.example
└── package.json             # pnpm@9, turbo scripts
```

## Troubleshooting

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| `CONNECTION_REFUSED` en `:4000` | API no arrancó | Revisá la terminal de `turbo dev`; suele faltar `DATABASE_URL` o Postgres caído |
| Error / crash por `DATABASE_URL` | Sin `.env` en la raíz | `cp .env.example .env` y reiniciá `pnpm turbo dev` |
| Migrate/seed fallan | Postgres down | `docker compose up -d` y esperá el healthcheck; `docker compose ps` |
| Seed falla por password | Falta `SEED_ADMIN_PASSWORD` | Definilo en `.env` (no vacío) y reintentá `pnpm db:seed` |
| Login admin no entra | Seed no corrido o password distinto | Verificá email/password del seed; re-seed si hace falta |
| Docker no arranca (Windows) | Docker Desktop detenido | Abrí Docker Desktop y esperá a que esté ready |

## CI

GitHub Actions (`.github/workflows/ci.yml`) en push/PR: `pnpm install`, build de packages + api, migrate contra Postgres de servicio, `pnpm --filter api test` y `pnpm --filter web check-types`.

## Notas

- El build de Nest (`dist/**`) está cubierto en `turbo.json`.
- Los packages compartidos usan tsup dual (CJS/ESM) para Nest y Next.
- Helpers de raíz: `pnpm db:migrate`, `pnpm db:seed`.
