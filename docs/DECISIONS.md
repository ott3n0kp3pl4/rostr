# Decision Log

## ADR-001 - Modular Next.js Monolith

**Status:** accepted, 2026-07-22.
**Decision:** use one Next.js App Router project with REST route handlers and
separate server modules.
**Reason:** the MVP benefits from one contract surface, lower operational load
and faster domain validation.
**Consequence:** domain rules must not live in React components or route
handlers; if API or worker needs grow, modules can be extracted into a separate
service.

## ADR-002 - PostgreSQL And Prisma, Redis Deferred

**Status:** accepted, 2026-07-22.
**Decision:** PostgreSQL is the source of truth and Prisma is the ORM; Redis is
not included.
**Reason:** current requirements do not need a separate queue, distributed cache
or distributed rate-limit store.
**Consequence:** Redis can be added only for a concrete use case such as rate
limits, outbox processing or caching, with a separate ADR.

## ADR-003 - Privacy By Default

**Status:** accepted, 2026-07-22.
**Decision:** contact data is separated from public profile data and future
contact disclosure must be policy-guarded.
**Reason:** talent protection and prevention of bulk collection are core product
requirements.
**Consequence:** DTOs and logs require PII allowlists; invitations or
applications must not be treated as implicit consent. Contact-disclosure
controls are planned, not implemented.

## ADR-004 - Telegram Validation Only On The Server

**Status:** accepted, 2026-07-22.
**Decision:** raw `initData` is validated through HMAC and `auth_date` using the
server-side bot token.
**Reason:** `initDataUnsafe` can be forged.
**Consequence:** local mode is a UI/development boundary only; production does
not serve Telegram authentication without a bot token.

## ADR-005 - Roles Through Permissions And Scope

**Status:** accepted, 2026-07-22.
**Decision:** roles should be data, and access checks should use permissions
with global or agency scope.
**Reason:** new roles and agency teams should not require rewriting conditional
logic across the codebase.
**Consequence:** each future business method must define the required permission
and subject scope. Full RBAC and agency-scoped permissions are approved as
future design, not implemented production controls.

## ADR-006 - Onboarding Persists By Step And Does Not Trust Client User ID

**Status:** accepted, 2026-07-23.
**Decision:** each wizard choice sends one typed action to
`/api/v1/onboarding`; the actor is derived on the server from validated Telegram
`initData`. In development, only one fixed local actor is allowed when
`TELEGRAM_DEV_MODE=true`.
**Reason:** users can safely resume interrupted onboarding, and the API cannot
be pointed at an arbitrary `user_id`.
**Consequence:** until sessions exist, `initData` is sent in each onboarding
request body and is not logged; reopening onboarding for development is limited
to a development-only reset endpoint.

## ADR-007 - Unified Product Context And Working Documents

**Status:** accepted, 2026-07-23.
**Decision:** `MASTER_CONTEXT.md` stores confirmed product boundaries,
`CURRENT_SPRINT.md` stores current scope, and `FOUNDER.md`, `VISION.md`,
`BRAND.md`, `CHANGELOG.md`, `docs/meetings/` and `prompts/` support work
management. Every task starts by reading the required context documents.
**Reason:** product context and scope must be available before implementation,
without Codex redefining product decisions or mixing plans with implemented
features.
**Consequence:** inconsistencies in older documentation are marked explicitly;
product behavior changes require founder and Product Architect approval.

## ADR-008 - PRD As Main Product Source Of Truth

**Status:** accepted, 2026-07-23.
**Decision:** `docs/PRD.md` is the main product source of truth for Rostr
product requirements, product scope and product decisions.
**Reason:** Rostr needs one durable product reference before implementation
work, especially for Career Passport, verified career timeline, event-based
reputation, postponed vacancies and trust-related constraints.
**Consequence:** product-related tasks must read `docs/PRD.md`. If older
documentation conflicts with the PRD, the conflict must be reported and resolved
through documentation updates or an explicit founder/Product Architect decision
before implementation.
