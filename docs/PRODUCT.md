# Product And MVP Boundary

`docs/PRD.md` is the main product source of truth. This document summarizes the
current product boundary for implementation planning.

## Purpose

Rostr is a Telegram Mini App and trust layer for creator teams. It is
professional identity infrastructure for creator management agencies and talent,
not primarily a job board, LinkedIn clone, ATS, AI recruiter or generic HR
platform.

The core product concept is the planned Career Passport: a portable
professional identity with a verified career timeline. Reputation should be
based on verified career events, not star ratings, anonymous reviews, popularity
metrics, paid reputation boosts or fake endorsements.

## Current Product Boundary

Onboarding and the first post-onboarding dashboard are implemented. Onboarding
creates a minimal talent or agency foundation. The dashboard displays the
existing profile foundation and a Career Passport foundation empty state.

The current product does not implement full Career Passport data, verified
employment history, reputation, public profiles, vacancies, resumes, search,
applications, contacts, moderation or employment verification workflows.

Current onboarding specializations are chatter, chatter team lead and recruiter.

Future product work should start from identity and trust:

- basic talent profile foundation;
- basic agency organization profile foundation;
- Career Passport foundation;
- verified career timeline;
- dual-sided employment confirmation;
- event-based reputation;
- public profile and portability.

These features are planned unless explicitly marked as implemented in the PRD.

## First Implemented Scenario: Onboarding And Dashboard

The first user scenario is limited to the registration wizard. It includes no
vacancies, resumes or search. The UX goal is completion in under 40 seconds: one
question per screen, large touch targets, automatic transition after selection
and short progress.

Talent path: welcome -> role -> specialization -> experience -> English level
-> timezone -> minimum salary in USD/month -> completion.

Agency path: welcome -> role -> agency name -> team size -> monthly hiring
volume -> completion.

Choices are saved after each step. A completed user enters the dashboard and no
longer sees the wizard. In local development, an explicit dev reset can reopen
onboarding. In production, the user is derived only from server-validated
Telegram `initData`; local mode uses one fixed development account and does not
accept user ID from the client.

The dashboard includes:

- talent profile foundation from onboarding data;
- agency organization foundation from onboarding data;
- Career Passport foundation empty state;
- clear language that employment verification is planned and not active yet.

## Out Of Scope For MVP

The MVP excludes:

- vacancies;
- marketplace mechanics;
- public search;
- resumes;
- applications;
- private messaging;
- AI matching or scoring;
- payments;
- complex RBAC;
- admin or moderator product systems;
- contact-disclosure controls;
- public blacklists;
- user-generated adult content;
- Telegram chat parsing.

Vacancies may exist later only if they strengthen the trust layer. They are not
the current product center.

## Product Metrics For Later Approval

No numeric targets are approved. Future metric categories should reflect trust
and identity quality rather than vacancy throughput.

Potential categories:

- talent onboarding completion;
- agency onboarding completion;
- time to onboarding completion;
- profile foundation completion;
- Career Passport creation;
- career events created;
- verification requests sent;
- verification requests accepted, corrected or disputed;
- public profiles created or shared;
- privacy and abuse signals.

Metrics must not include raw PII or Telegram `initData`.

## Risks And Missing Decisions

1. **Product scope.** The first post-onboarding Career Passport slice needs
   founder and Product Architect approval.
2. **Verification lifecycle.** Verified facts, status names, source attribution,
   correction and dispute flows are unresolved.
3. **Privacy and public profile.** Visibility defaults, public links and contact
   disclosure rules are unresolved.
4. **Agency teams.** Agency-scoped permissions are approved as future design but
   not implemented.
5. **Security.** Current security is an onboarding foundation, not production
   readiness.
6. **Legal and launch market.** CIS launch countries, legal policies, age
   handling and data retention require review before external launch.
7. **Notifications.** Notification text, preferences, failure handling and
   outbox processing are future work.
