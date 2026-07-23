# Архитектура

## Выбор: модульный Next.js-монолит

Для MVP выбран единый репозиторий и одно Next.js-приложение: App Router для интерфейса и REST route handlers для API. Это рациональнее отдельного NestJS backend сейчас: команды меньше, типы и релизы едины, а домен ещё уточняется. Бизнес-правила живут в серверных модулях, а не в React-компонентах.

Отдельный backend следует выделять только при наблюдаемой потребности: независимом масштабировании API/воркеров, нескольких внешних клиентах, сложных очередях или отдельной ownership-команде. Контракты REST и слои ниже уже позволяют вынести модули без изменения UI.

## Слои

```text
src/app                  Next.js UI и HTTP-адаптеры
src/components           UI-компоненты без доменных правил
src/modules/<domain>     application services, policies, repositories, DTO
src/lib                  инфраструктура: Prisma, Telegram crypto, logger
prisma                   схема и неизменяемые миграции
```

Новая функция должна быть вертикальным модулем: route handler валидирует DTO → application service авторизует и применяет правила → repository работает с Prisma. UI вызывает версионированный REST API через TanStack Query. React Hook Form + Zod валидируют формы, но сервер повторяет все проверки.

## Текущий каркас

- `GET /api/health` — readiness/smoke endpoint без доступа к БД;
- `POST /api/auth/telegram` — принимает только raw `initData`, проверяет HMAC и срок действия; выпуск сессии намеренно отложен;
- `src/components/telegram-shell.tsx` — безопасное определение Telegram в браузере; локальный UI работает без него;
- `/api/v1/onboarding/*` и `src/modules/onboarding` — первый вертикальный модуль: bootstrap, проверяемые переходы, Prisma persistence и отдельный mobile-first wizard;
- `src/components/ui` — локальные shadcn/ui-совместимые primitives; Framer Motion отвечает только за motion-слой и уважает reduced motion;
- Telegram viewport CSS variables задают safe-area padding без хардкода размеров устройств.

## Интеграции и асинхронность

PostgreSQL — источник истины. Redis не нужен в каркасе; добавляется ADR после реальной потребности в распределённом rate limiting, кэше или очереди. Telegram-уведомления должны отправляться воркером из таблицы `notification_outbox` с idempotency key и повторными попытками. Нельзя выполнять их в HTTP-транзакции.

## Нефункциональные нормы

- время и аудит: UTC, `timestamptz`;
- критичные записи: soft delete и неизменяемый аудит;
- PII отделён от публичной части профиля;
- конфигурация только через environment variables;
- JSON-логи без секретов/PII;
- API начинается с `/api/v1` до появления пользовательских бизнес-методов; текущие технические endpoints остаются вне версии.
