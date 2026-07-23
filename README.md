# CreatorHire Mini App

MVP-каркас Telegram Mini App для поиска и найма в creator-management. Продукт предназначен только для совершеннолетних пользователей; он не хранит пользовательский контент для взрослых и не содержит встроенного чата, платежей или автоматического matching.

## Что есть сейчас

- Next.js 16 + TypeScript + Tailwind CSS;
- премиальный мобильный onboarding для кандидата и агентства: один вопрос на экран, прогресс, анимации и сохранение каждого шага;
- клиентский стартовый экран с определением Telegram-среды и локальным режимом;
- серверная проверка подписи Telegram `initData` (`POST /api/auth/telegram`);
- PostgreSQL/Prisma и миграции для состояния onboarding, профиля кандидата и агентства;
- health-check, структурированное логирование и error boundary;
- Docker Compose, unit- и e2e smoke-тесты, CI.

Реализован только первый пользовательский сценарий — onboarding. Вакансий, резюме, поиска, откликов и других продуктовых экранов в приложении нет.

## Быстрый старт

Требуются Node.js 24+ и Docker Desktop. PostgreSQL обязателен для onboarding: wizard сохраняет каждый выбор в базу данных и не использует локальные заглушки.

```bash
cp .env.example .env
npx pnpm@11.9.0 install
docker compose up -d db
npx pnpm@11.9.0 db:generate
npx pnpm@11.9.0 db:deploy
npx pnpm@11.9.0 dev
```

Откройте [http://localhost:3000](http://localhost:3000). Health-check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

Для запуска приложения и БД в Docker:

```bash
cp .env.example .env
docker compose up --build
```

В Docker отдельный сервис `migrate` применяет миграции до старта приложения. Для production укажите защищённые значения `DATABASE_URL` и `TELEGRAM_BOT_TOKEN`; `TELEGRAM_DEV_MODE` не является способом обойти серверную аутентификацию и должен быть `false`.

Если `pnpm` уже установлен, `npx pnpm@11.9.0 <команда>` можно заменить на `pnpm <команда>`. Не используйте `corepack enable` с `sudo`: на macOS это часто требует системных прав и не нужно для запуска проекта.

## Команды

| Команда                         | Назначение                      |
| ------------------------------- | ------------------------------- |
| `pnpm dev`                      | локальный Next.js сервер        |
| `pnpm build && pnpm start`      | production-сборка и запуск      |
| `pnpm lint`                     | ESLint                          |
| `pnpm typecheck`                | строгая проверка TypeScript     |
| `pnpm test`                     | unit-тесты Vitest               |
| `pnpm test:e2e`                 | Playwright smoke-тест           |
| `pnpm db:migrate --name <name>` | создать миграцию в локальной БД |
| `pnpm db:deploy`                | применить существующие миграции |

Перед первым e2e запуском может понадобиться `pnpm test:e2e:install`.

## Документация

- [Карта документации](docs/README.md)
- [Продукт и границы MVP](docs/PRODUCT.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [Данные](docs/DATABASE.md)
- [API](docs/API.md)
- [Безопасность](docs/SECURITY.md)
- [Роли и права](docs/ROLES_AND_PERMISSIONS.md)
- [Монетизация](docs/MONETIZATION.md)
- [Дорожная карта](docs/ROADMAP.md)
- [Журнал решений](docs/DECISIONS.md)
- [Тестирование](docs/TESTING.md)
