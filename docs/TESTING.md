# Testing And Quality

## Required Minimum

Before review: `pnpm lint`, `pnpm typecheck`, `pnpm test`; for affected user
routes, run `pnpm test:e2e`. CI should run the same checks on a clean install
with `pnpm install --frozen-lockfile`.

## Current Tests

- Vitest: valid and tampered Telegram `initData` checks with fixed time.
- Playwright: `GET /api/health`, talent onboarding to dashboard, completed-user
  dashboard persistence and agency onboarding to dashboard in local development
  mode with PostgreSQL.

## Test Strategy

1. Unit: policy/state machines, DTO validation, access control and Telegram
   cryptography.
2. Integration: Prisma repositories against a separate PostgreSQL database,
   migrations, API handlers and future outbox behavior.
3. E2E: onboarding, profile foundation, Career Passport foundation, future
   verification, future invitations and consent-controlled contact disclosure.
4. Security: negative RBAC/IDOR cases, replayed `initData`, rate limits, PII
   snapshot/log assertions and dependency audit.

Test fixtures must not contain real Telegram IDs, phone numbers or personal
data. E2E uses `TELEGRAM_DEV_MODE=true` only for the UI shell; API auth is tested
with signed payloads and a test token.
