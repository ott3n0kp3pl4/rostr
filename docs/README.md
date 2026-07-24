# Rostr Documentation

This directory is the entry point for product and engineering documentation.
The implemented product scope is limited to onboarding. Career Passport,
employment verification, event-based reputation, public profiles, vacancies,
resumes and search are not implemented.

## Document Map

| Area             | Document                                             | When to update                                                                |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Main product SOT | [PRD.md](PRD.md)                                     | Main product source of truth for requirements, product scope and decisions.   |
| Master context   | [MASTER_CONTEXT.md](MASTER_CONTEXT.md)               | Confirmed product context or decision boundaries change.                      |
| Founder roles    | [FOUNDER.md](FOUNDER.md)                             | Ownership or decision rights change.                                          |
| Vision           | [VISION.md](VISION.md)                               | Product hypothesis or strategic boundary changes.                             |
| Brand            | [BRAND.md](BRAND.md)                                 | Name, positioning or brand-system decisions are approved.                     |
| Current sprint   | [CURRENT_SPRINT.md](CURRENT_SPRINT.md)               | Sprint goal, scope, status or exit criteria change.                           |
| Changelog        | [CHANGELOG.md](CHANGELOG.md)                         | Material documentation or product work is completed.                          |
| Product boundary | [PRODUCT.md](PRODUCT.md)                             | User scenario, MVP boundary or product metric categories change.              |
| Architecture     | [ARCHITECTURE.md](ARCHITECTURE.md)                   | Layers, integrations or technical boundaries change.                          |
| Decisions        | [DECISIONS.md](DECISIONS.md)                         | Durable product or architecture decisions are accepted.                       |
| Data             | [DATABASE.md](DATABASE.md)                           | Prisma schema changes, migrations are added or target data boundaries change. |
| API              | [API.md](API.md)                                     | Endpoints are created, changed or retired.                                    |
| Security         | [SECURITY.md](SECURITY.md)                           | Authentication, access control, PII handling or secrets change.               |
| Roles            | [ROLES_AND_PERMISSIONS.md](ROLES_AND_PERMISSIONS.md) | Roles, permissions or scopes change.                                          |
| Quality          | [TESTING.md](TESTING.md)                             | Test strategy or required validation changes.                                 |
| Planning         | [ROADMAP.md](ROADMAP.md)                             | Product phase order or milestone scope is approved.                           |
| Monetization     | [MONETIZATION.md](MONETIZATION.md)                   | Entitlement model changes or payment integration is introduced.               |

Meeting notes live in `docs/meetings/`. Reusable work templates live in
[`prompts/`](../prompts/).

## Maintenance Rules

- Every task starts by reading [AGENTS.md](../AGENTS.md),
  `MASTER_CONTEXT.md` and `CURRENT_SPRINT.md`.
- Product-related tasks also read `PRD.md`; it is the main source of truth for
  product requirements, product scope and product decisions.
- Documentation describes the actual project state. Future ideas are labelled
  as planned, proposed or open questions, not as implemented.
- Database changes require a new Prisma migration and a synchronized
  `DATABASE.md` update.
- REST API changes require a synchronized `API.md` update and relevant tests.
- Secrets, Telegram `initData`, tokens and personal data must not appear in
  documentation, fixtures or Git.
