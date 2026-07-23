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

`POST /api/v1/onboarding/bootstrap` принимает `{ initData? }` в body и возвращает server-derived `onboarding` snapshot. В production `initData` обязателен; в local development допускается только фиксированный development account.

`PATCH /api/v1/onboarding` принимает один discriminated action за запрос: `start`, `role`, `specialization`, `experience`, `english`, `timezone`, `salary`, `agencyName`, `teamSize` или `monthlyHiring`. Zod повторно валидирует каждое значение на сервере. Action не принимает user ID и не возвращает Telegram ID.

`POST /api/v1/onboarding/dev-reset` доступен исключительно при `TELEGRAM_DEV_MODE=true`; удаляет данные тестового сценария и возвращает wizard к приветствию. В production endpoint отвечает `404`.

## Запланированная поверхность MVP

| Область         | Методы                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Auth/onboarding | `POST /api/v1/auth/session`, `GET/PATCH /me`, `POST /me/consents`, `POST /me/deactivate`                                 |
| Candidate       | `GET/PATCH /candidate-profile`, `GET /vacancies`, `POST/DELETE /saved-vacancies/:id`, `POST /vacancies/:id/applications` |
| Agency          | `GET/PATCH /agency`, CRUD `/vacancies`, `GET /candidates`, `POST /candidates/:id/invitations`, CRUD `/talent-pool`       |
| Pipeline        | `GET/PATCH /pipeline-items/:id`, `POST /pipeline-items/:id/move`                                                         |
| Trust           | `POST /complaints`, moderator queues and reviewed actions                                                                |

Перед реализацией каждого набора endpoints фиксируются DTO, permissions, rate limits, audit-события, disclosure-policy и контрактные тесты.
