# Тестирование и проверка качества

## Обязательный минимум

Перед PR: `pnpm lint`, `pnpm typecheck`, `pnpm test`; для затрагиваемого пользовательского маршрута — `pnpm test:e2e`. CI выполняет те же проверки на чистой установке с `pnpm install --frozen-lockfile`.

## Текущие тесты

- Vitest: положительная и tampered-проверка Telegram `initData` с фиксированным временем;
- Playwright: `GET /api/health` и полный candidate onboarding в локальном development-режиме с PostgreSQL.

## Стратегия развития

1. Unit: policy/state machine, DTO validation, access-control и Telegram криптография.
2. Integration: Prisma repositories на отдельной PostgreSQL БД, migrations, API handlers и outbox.
3. E2E: candidate onboarding, agency vacancy, отклик, invitation, consent-controlled contact disclosure, moderation/blocking.
4. Security: негативные RBAC/IDOR cases, replay initData, rate limit, PII snapshot/log assertions и dependency audit.

Тестовые fixtures не содержат настоящие Telegram ID, телефоны или персональные данные. E2E запускается с `TELEGRAM_DEV_MODE=true` только для UI shell; API auth тестируется подписью с тестовым токеном.
