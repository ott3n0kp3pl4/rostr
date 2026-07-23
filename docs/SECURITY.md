# Безопасность и конфиденциальность

Текущая реализация предназначена для onboarding-разработки. Она не является production-ready системой безопасности и не защищает будущие функции, которых в проекте ещё нет.

## Implemented

- Сервер проверяет raw Telegram `initData`: HMAC, constant-time comparison и возраст `auth_date`.
- Bot token читается только на сервере; raw `initData` не записывается в логи.
- Onboarding определяет actor из проверенных Telegram-данных, а не из client-supplied user ID. В local development допускается один фиксированный actor только при явном `TELEGRAM_DEV_MODE=true`.
- `.env` и `.env.local` исключены из Git; `.env.example` не содержит реального bot token.

## Partially implemented

- База хранит минимальные onboarding-данные и не содержит прямых контактов кандидата.
- `UserStatus` и `AgencyMember` существуют как данные, но сами по себе не ограничивают доступ и не образуют модерацию.
- Технический endpoint проверяет подпись Telegram, но не выпускает пользовательскую сессию.

## Approved but not implemented

Следующие меры одобрены как будущий дизайн, но **не являются текущими production protections**:

- полноценный RBAC, platform roles и agency-scoped permissions;
- rate limiting для auth и будущих бизнес-операций;
- mutation audit logs и request correlation;
- модерация пользователей, профилей, вакансий и жалоб;
- private contact storage, consent-controlled disclosure и связанные audit events;
- secure HttpOnly session cookie, rotation, revocation и replay protection;
- шифрование PII, backup/recovery process и production secret manager.

## Proposed

После появления соответствующих API rate limiting должен иметь явные лимиты по actor/IP и серверное хранилище. Раскрытие контакта должно требовать отдельного согласия и policy check. Каждая такая система требует threat model, миграций, API-тестов и отдельного архитектурного решения.

## Unresolved

- Модель сессий и защита от повторного использования Telegram login.
- Политика хранения, удаления и шифрования PII.
- Правила модерации, возрастной проверки, юридические тексты и incident response.
