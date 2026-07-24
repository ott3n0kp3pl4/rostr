# Master Context

## Confirmed product context

- **Product:** Rostr, Telegram Mini App.
- **Purpose:** trust layer for creator teams.
- **Initial users:** creator management agencies and talent — initially chatters, recruiters and team leads.
- **Initial market:** CIS.
- **Distribution:** Telegram is the initial channel, not the permanent product boundary.
- **Architecture:** must remain globally extensible.

Rostr is not primarily a job board, LinkedIn clone, ATS, AI recruiting tool or
generic HR platform. Vacancies are postponed. Telegram is the initial
distribution channel, not the permanent product boundary.

## Core concept

The planned core artifact is a **Career Passport**: a portable public
professional profile with a verified career timeline. Employment history is
confirmed by both talent and agency. Reputation is based on verified events, not
ratings.

Confirmed trust principles:

- Career Passport is the core product concept.
- Verified career timeline is the core trust structure.
- Reputation is based on verified career events.
- No star ratings.
- No anonymous reviews.
- No paid reputation boosts.
- No fake endorsements.
- Telegram-first, not Telegram-limited.

Career Passport, bilateral verification, public portability and event-based reputation are not implemented in the current application.

## Current product boundary

The current codebase implements onboarding only. It does not implement vacancies, search, resumes, employment verification, reputation, public profiles or contact disclosure.

## Decision ownership

- Founder and Product Architect own product decisions and product behavior.
- Codex owns implementation quality, tests, refactoring and Git execution.
- Codex must not redefine product behavior without approval.

## Unresolved

- Career Passport fields, visibility rules and verification lifecycle.
- First public-profile surface and portability mechanism.
- CIS launch requirements, legal review and trust-event taxonomy.
- Product milestones after Sprint 0.
