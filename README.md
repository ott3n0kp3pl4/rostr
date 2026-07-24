# Rostr Mini App

MVP foundation for Rostr, a Telegram Mini App and trust layer for creator
teams. Rostr starts with professional identity and onboarding, not vacancies or
marketplace mechanics.

The current application is not production-ready. It does not implement Career
Passport, employment verification, event-based reputation, public profiles,
search, vacancies, payments or production moderation.

## What is implemented

- Next.js 16, TypeScript and Tailwind CSS;
- premium mobile onboarding for talent and agencies: one action per screen,
  progress, animation and per-step persistence;
- client entry shell with Telegram environment detection and local development
  mode;
- server-side Telegram `initData` validation (`POST /api/auth/telegram`);
- PostgreSQL, Prisma and migrations for onboarding state, talent profile
  foundation and agency foundation;
- health check, structured logging and error boundary;
- Docker Compose, unit tests, e2e smoke tests and CI foundation.

Only the first user scenario is implemented: onboarding. The app has no
vacancies, resumes, search, applications, public profiles, verification flows or
other product screens.

## Quick start

Requirements: Node.js 24+ and Docker Desktop. PostgreSQL is required for
onboarding because the wizard saves every choice to the database and does not
use local mock storage.

```bash
cp .env.example .env
npx pnpm@11.9.0 install
docker compose up -d db
npx pnpm@11.9.0 db:generate
npx pnpm@11.9.0 db:deploy
npx pnpm@11.9.0 dev
```

Open [http://localhost:3000](http://localhost:3000). Health check:
[http://localhost:3000/api/health](http://localhost:3000/api/health).

To run the app and database through Docker:

```bash
cp .env.example .env
docker compose up --build
```

In Docker, the `migrate` service applies migrations before the app starts. For
production, provide protected values for `DATABASE_URL` and
`TELEGRAM_BOT_TOKEN`; `TELEGRAM_DEV_MODE` is not a server authentication bypass
and must be `false`.

If `pnpm` is already installed, `npx pnpm@11.9.0 <command>` can be replaced
with `pnpm <command>`. Do not use `corepack enable` with `sudo`: on macOS this
often requires system permissions and is not needed to run the project.

## Commands

| Command                         | Purpose                          |
| ------------------------------- | -------------------------------- |
| `pnpm dev`                      | local Next.js server             |
| `pnpm build && pnpm start`      | production build and start       |
| `pnpm lint`                     | ESLint                           |
| `pnpm typecheck`                | strict TypeScript check          |
| `pnpm test`                     | Vitest unit tests                |
| `pnpm test:e2e`                 | Playwright smoke test            |
| `pnpm db:migrate --name <name>` | create a migration in a local DB |
| `pnpm db:deploy`                | apply existing migrations        |

Before the first e2e run, `pnpm test:e2e:install` may be required.

## Documentation

- [Documentation map](docs/README.md)
- [Product Requirements Document](docs/PRD.md)
- [Product and MVP boundary](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATABASE.md)
- [API](docs/API.md)
- [Security](docs/SECURITY.md)
- [Roles and permissions](docs/ROLES_AND_PERMISSIONS.md)
- [Monetization](docs/MONETIZATION.md)
- [Roadmap](docs/ROADMAP.md)
- [Decision log](docs/DECISIONS.md)
- [Testing](docs/TESTING.md)
