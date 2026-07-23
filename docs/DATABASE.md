# Модель данных

## Применённые миграции

Первая миграция создаёт `users`: внутреннюю UUID-идентичность, уникальный Telegram ID, минимальный публичный display name, статусы/согласия, UTC-аудит и `deleted_at`. Telegram ID — `BigInt`, поскольку нельзя полагаться на JavaScript `number` во всех будущих границах интеграций.

Миграция `20260723000000_onboarding` добавляет только данные первого сценария:

- `users.user_type`, `onboarding_status`, `onboarding_step`, `onboarding_completed_at` — возобновление wizard и его финальное состояние;
- `candidate_profiles` — специализация, опыт, английский, часовой пояс и минимум оплаты. Это **не** резюме: опыта работы, навыков, контактов и свободного текста здесь нет;
- `agencies` — название, диапазон размера команды и диапазон ежемесячного найма;
- `agency_members` — минимальная owner-связь, сохраняющая будущую поддержку командных аккаунтов.

Все незавершённые поля onboarding nullable только до `COMPLETED`; application service не позволяет завершить сценарий без полного набора данных. Контакты и прочий PII в миграцию не добавлялись.

## Целевая декомпозиция

| Контекст    | Таблицы                                                                                                                                                                                                                         | Замечания                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Identity    | `users`, `telegram_identities`, `consents`, `roles`, `permissions`, `role_permissions`, `user_roles`                                                                                                                            | Telegram identity отделяется от пользователя для будущих провайдеров; согласия версионируются.    |
| Candidate   | `candidate_profiles`, `candidate_contacts`, `specializations`, `candidate_specializations`, `skills`, `candidate_skills`, `languages`, `candidate_languages`, `candidate_experiences`, `employment_preferences`, `availability` | Контакты — отдельная защищённая таблица; профиль для поиска не содержит прямых контактов.         |
| Agency      | `agencies`, `agency_members`, `agency_member_roles`, `agency_verifications`                                                                                                                                                     | Роли в агентстве имеют `agency_id` scope.                                                         |
| Marketplace | `vacancies`, `vacancy_specializations`, `vacancy_skills`, `applications`, `saved_vacancies`, `candidate_invitations`                                                                                                            | Статусы — явные state machine; уникальные ограничения не позволяют дублировать отклик/сохранение. |
| Hiring      | `talent_pool_entries`, `hiring_pipeline_stages`, `candidate_pipeline_items`, `contact_disclosures`                                                                                                                              | `contact_disclosures` хранит основание согласия, потребителя, время и отзыв.                      |
| Trust       | `complaints`, `moderation_cases`, `moderation_actions`, `audit_logs`, `verifications`                                                                                                                                           | Модераторские решения append-only; содержание жалобы имеет controlled access.                     |
| Billing     | `plans`, `plan_entitlements`, `subscriptions`, `subscription_entitlements`, `usage_counters`, `feature_flags`, `feature_flag_overrides`, `promotions`, `payments`                                                               | Платёжные провайдеры не подключаются в MVP; entitlement — единый механизм лимитов.                |
| Delivery    | `notifications`, `notification_outbox`, `notification_preferences`                                                                                                                                                              | Идемпотентная отправка Telegram-ботом и retry.                                                    |

## Ключевые правила

- Новые специализации — данные в `specializations`, не миграция enum.
- Прямые контакты хранятся раздельно, encrypted-at-rest на уровне приложения/KMS и никогда не индексируются для поиска.
- По умолчанию все выборки кандидата используют DTO проекции без `candidate_contacts`.
- `applications` и `candidate_invitations` хранят снимок ключевых данных вакансии/профиля, если это нужно для аудита, но не копируют контакты.
- Каждая важная сущность имеет `created_at`, `updated_at`, `deleted_at`; уникальность soft-deleted записей обеспечивается partial unique index в SQL-миграции, где это требуется.
- Удаление аккаунта: немедленная деактивация, отзыв сессий/раскрытий, затем retention job анонимизирует PII по утверждённой юридической политике. Связанный аудит сохраняет необратимый идентификатор и причину по сроку хранения.

## Справочники и state machines

`specializations`, языки, валюты и страны — управляемые справочники с `is_active`, а не перечисления в UI. Воронка агентства: `NEW → QUESTIONNAIRE → TEST → INTERVIEW → TRIAL_SHIFT → HIRED | REJECTED`; разрешённые переходы проверяются сервисом. Возможность настроить этапы появится только после MVP, при сохранении системной семантики аналитики.
