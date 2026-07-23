# Дорожная карта

## 0. Foundation — выполнено этим каркасом

Next.js/TypeScript, PostgreSQL/Prisma, Telegram HMAC validation, локальная оболочка, Docker, health check, CI и минимальные тесты.

## 1. Identity и доверие

Сессия после проверенного Telegram login, ролевая схема, согласия с версиями документов, 18+ gate, деактивация/анонимизация, audit middleware, базовый rate limit и placeholder-страницы legal после передачи согласованного текста.

## 2. Candidate и Agency onboarding

Справочник специализаций, кандидатское резюме/предпочтения/приватные контакты, профиль агентства и membership. Добавить модерационные статусы и contract tests DTO без PII.

## 3. Marketplace

CRUD вакансий, лента и безопасные фильтры, candidate discovery, избранное, отклики, инвайты, consent-aware disclosure. Добавить ограничения на сбор данных и Telegram outbox.

## 4. Hiring и moderation

Talent Pool, системная воронка, жалобы, очереди и решения модерации, полные audit events, операционные панели.

## 5. Monetization readiness → integration

Plans/entitlements/usage counters/feature flags, затем отдельным проектом лицензированный платёжный провайдер и продвижения.

Каждый этап заканчивается угроз-моделью, миграциями, API/UX acceptance criteria и регрессионными тестами. Очерёдность может меняться только с записью решения.
