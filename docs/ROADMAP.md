# Roadmap

`docs/PRD.md` is the main product source of truth. This roadmap is a planning
view and must stay aligned with the PRD.

## 0. Foundation - implemented by the current repository

Next.js, TypeScript, PostgreSQL, Prisma, server-side Telegram HMAC validation,
local development shell, Docker, health check, CI and minimal tests.

The first implemented user scenario is onboarding for talent and agencies.

## 1. Profile Foundation

Planned:

- secure session after verified Telegram login;
- basic talent profile foundation from onboarding data;
- basic agency organization profile foundation from onboarding data;
- profile editing for non-verified fields;
- consent/version tracking where required;
- clear distinction between implemented profile fields and planned Career
  Passport features.

## 2. Career Passport Foundation

Planned:

- Career Passport surface;
- verified career timeline model;
- self-claimed career events;
- profile visibility foundations;
- public/private section model;
- product copy that does not imply verification before it exists.

## 3. Employment Verification

Planned:

- dual-sided employment confirmation by talent and agency;
- verification request flow;
- agency response flow;
- correction and dispute foundations;
- source attribution;
- audit events for sensitive verification changes;
- notification foundation through an asynchronous outbox.

## 4. Event-Based Reputation

Planned:

- reputation based on verified career events;
- no star ratings;
- no anonymous reviews;
- no paid reputation boosts;
- no fake endorsements;
- conservative reputation display that explains source and status.

## 5. Public Portability

Planned:

- shareable public profile;
- visibility controls;
- contact privacy boundaries;
- non-Telegram access path where approved;
- abuse controls before broader distribution.

## 6. Discovery, Invitations And Vacancies

Planned (Postponed):

- privacy-aware discovery;
- agency-to-talent invitations;
- references that support factual verification rather than subjective reviews;
- vacancies only if they strengthen the identity and trust layer.

Vacancy CRUD, search, marketplace mechanics and application flows must not move
ahead of Career Passport, verification and trust controls without a new product
decision.

## 7. Monetization Readiness

Proposed:

- plans and entitlements;
- usage counters;
- feature flags;
- team seats or agency utility features;
- payment-provider integration only after legal, security and product review.

Monetization must not allow paid reputation, paid verification outcomes or paid
manipulation of trust signals.

Each phase should end with acceptance criteria, documentation updates, relevant
migrations or API contracts, threat-model review where needed and regression
tests. Phase order can change only through a documented decision.
