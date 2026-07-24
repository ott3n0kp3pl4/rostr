# Current Sprint - Sprint 1: MVP shell and profile foundation

**Status:** in progress.

## Goal

Build the first usable Rostr product experience after the documentation
foundation: Telegram Mini App shell, onboarding, post-onboarding dashboard and
Career Passport foundation.

## In scope

- User-visible Rostr naming.
- Mobile-first Telegram product shell.
- Talent and agency onboarding continuation.
- Talent profile foundation dashboard.
- Agency organization foundation dashboard.
- Career Passport foundation empty state.
- Clear planned-not-implemented labels for employment verification.

## Out of scope

- Prisma schema changes and migrations unless explicitly approved.
- Internal package, database, Docker, service or environment namespace renames.
- Vacancies, ratings, reviews, payments, marketplace search, AI recruiting,
  RBAC, moderation and production security claims.
- Fake employment data, fake verification, fake scores or fake badges.

## Exit criteria

- Completed users enter dashboard instead of static onboarding completion.
- Talent dashboard shows existing profile foundation and Career Passport
  foundation.
- Agency dashboard shows existing organization foundation and verification
  placeholder.
- E2E covers talent onboarding to dashboard, agency onboarding to dashboard and
  completed-user dashboard persistence.
- Validation commands pass; no files are staged, committed or pushed by this
  task.

## Unresolved

- First editable Career Passport fields.
- First employment verification lifecycle and status vocabulary.
- Public profile surface and visibility defaults.
- Internal legacy namespace rename timing.
