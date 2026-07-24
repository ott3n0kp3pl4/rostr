# REST API

## Правила контрактов

- JSON, UTF-8, UTC ISO-8601 даты, `camelCase` в payload;
- для бизнес-API: `/api/v1/...`; технический health endpoint не версионируется;
- сервер валидирует DTO Zod и права независимо от UI;
- ошибки: `{ "error": { "code": "...", "message": "..." } }`;
- контакт кандидата отсутствует в любых list/detail DTO, кроме явно авторизованного endpoint раскрытия;
- list endpoint поддерживает cursor pagination, ограниченный `limit`, allowlist сортировок и фильтров;
- mutation endpoint принимает idempotency key там, где повтор Telegram/retry может создать дубликат.

## Уже реализовано

### `GET /api/health`

Возвращает `200` и `{ status: "ok", service, timestamp }`. Не проверяет доступность PostgreSQL, поэтому является liveness/smoke check, а не полной readiness-проверкой.

### `POST /api/auth/telegram`

Body: `{ "initData": "<raw Telegram WebApp initData>" }`. Сервер использует bot token, сам строит data-check string, сравнивает HMAC constant-time и проверяет `auth_date`. Успех возвращает только проверенные поля Telegram и пока **не создаёт сессию**. Ошибки: `400 INVALID_REQUEST`, `401 INVALID_TELEGRAM_INIT_DATA`, `503 TELEGRAM_AUTH_NOT_CONFIGURED`.

### Onboarding

`POST /api/v1/onboarding/bootstrap` accepts `{ initData? }` in the body and
returns a server-derived `onboarding` snapshot. In production, `initData` is
required; in local development, only the fixed development account is allowed.

The snapshot includes onboarding state, user-facing display name, role and the
available profile foundation:

- talent: specialization, experience, English level, timezone and minimum
  salary when available;
- agency: organization name, team size and monthly hiring volume when
  available.

The snapshot does not include Telegram ID, contacts, employment history,
verification records, reputation, vacancies or private PII.

`PATCH /api/v1/onboarding` accepts one discriminated action per request:
`start`, `role`, `specialization`, `experience`, `english`, `timezone`,
`salary`, `agencyName`, `teamSize` or `monthlyHiring`. Zod validates every
value again on the server. Actions do not accept user ID and do not return
Telegram ID.

`POST /api/v1/onboarding/dev-reset` is available only when
`TELEGRAM_DEV_MODE=true`; it removes the local test scenario data and returns
the wizard to the welcome screen. In production, the endpoint responds `404`.

## Planned MVP Surface

The next API surface should stay aligned with the PRD: profile foundation,
Career Passport foundation and employment verification readiness before
vacancies or marketplace mechanics.

| Area               | Candidate endpoints                                          | Status              |
| ------------------ | ------------------------------------------------------------ | ------------------- |
| Auth/session       | `POST /api/v1/auth/session`, `GET /api/v1/me`                | Planned             |
| Profile foundation | `GET/PATCH /api/v1/profile-foundation`                       | Planned             |
| Career Passport    | `GET /api/v1/career-passport`                                | Planned             |
| Agency foundation  | `GET/PATCH /api/v1/agency-foundation`                        | Planned             |
| Verification       | verification request/response endpoints                      | Planned (Post-MVP)  |
| Vacancies          | vacancy CRUD, search, applications and marketplace mechanics | Planned (Postponed) |

Before implementation, each endpoint group needs DTOs, permissions, rate-limit
expectations, audit requirements, disclosure policy where relevant and contract
tests.
