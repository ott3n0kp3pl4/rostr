# Data Model

`docs/PRD.md` is the main product source of truth. This document describes the
implemented database state and target data boundaries. It must not present
future marketplace, billing or hiring tables as MVP direction.

## Applied Migrations

The first migration creates `users`: internal UUID identity, unique Telegram ID,
minimal public display name, status/consent fields, UTC audit timestamps and
`deleted_at`. Telegram ID is stored as `BigInt` because future integration
boundaries must not rely on JavaScript `number` precision.

Migration `20260723000000_onboarding` adds only the first user scenario:

- `users.user_type`, `onboarding_status`, `onboarding_step` and
  `onboarding_completed_at` for wizard resume and completion state;
- `candidate_profiles` for specialization, experience, English level, timezone
  and minimum salary. This is not a resume and contains no work history, skills,
  contacts or free text;
- `agencies` for agency name, team-size range and monthly hiring-volume range;
- `agency_members` for the minimal owner relationship that preserves future
  support for agency teams.

Incomplete onboarding fields are nullable only until `COMPLETED`; the
application service does not allow completion without the full required data
set. Contacts and other direct PII were not added by the onboarding migration.

## Target Decomposition

Target contexts below are planning boundaries. Unless a table exists in an
applied migration, it is not implemented.

| Context                         | Target tables                                                                                        | Status and notes                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Identity                        | `users`, `telegram_identities`, `consents`, `roles`, `permissions`, `role_permissions`, `user_roles` | `users` exists; sessions, full RBAC and provider separation are planned.                                           |
| Talent profile                  | `candidate_profiles`, `specializations`, `candidate_specializations`, `skills`, `languages`          | `candidate_profiles` exists as onboarding foundation; richer profile fields are planned.                           |
| Career Passport                 | `career_passports`, `career_events`, `career_event_sources`, `career_event_visibility`               | Planned. This should become the core identity model after onboarding.                                              |
| Employment verification         | `employment_records`, `verification_requests`, `verification_responses`, `verification_disputes`     | Planned. Supports dual-sided confirmation by talent and agency.                                                    |
| Agency                          | `agencies`, `agency_members`, `agency_member_roles`, `agency_verifications`                          | `agencies` and first owner membership exist; team management and agency-scoped permissions are planned.            |
| Reputation                      | `trust_events`, `reputation_facts`, `reputation_summaries`                                           | Planned. Must derive from verified events, not star ratings, anonymous reviews or paid boosts.                     |
| Privacy and contact disclosure  | `candidate_contacts`, `contact_disclosures`, `contact_disclosure_audit`                              | Planned (Post-MVP). Contacts stay separate from public profile data.                                               |
| Trust operations                | `complaints`, `moderation_cases`, `moderation_actions`, `audit_logs`                                 | Planned (Post-MVP). Not production moderation or audit today.                                                      |
| Delivery                        | `notifications`, `notification_outbox`, `notification_preferences`                                   | Planned. Telegram notifications must be asynchronous and idempotent.                                               |
| Discovery and invitations       | `candidate_invitations`, `discovery_preferences`, `saved_profiles`                                   | Planned (Postponed). Requires privacy, rate limits and abuse controls first.                                       |
| Vacancies and marketplace flows | `vacancies`, `vacancy_specializations`, `applications`, `saved_vacancies`                            | Planned (Postponed). Not MVP direction and must not precede Career Passport, verification and trust controls.      |
| Billing                         | `plans`, `plan_entitlements`, `subscriptions`, `usage_counters`, `feature_flags`, `payments`         | Proposed (Future). Payment providers are not connected; monetization must not allow paid reputation or paid trust. |

## Key Rules

- Career Passport belongs to talent, not to an agency.
- Career events and verification changes should preserve history.
- New specializations should be data in `specializations`, not enum migrations.
- Direct contacts must be stored separately from public profile data and never
  indexed for search.
- Candidate DTOs should exclude contact fields by default.
- Future discovery, invitations, applications or vacancies must not copy contact
  data.
- Every important entity should have `created_at`, `updated_at` and
  `deleted_at`; partial unique indexes should be used in SQL migrations where
  soft-delete uniqueness requires them.
- Account deletion requires a legal retention policy before sensitive data
  expansion.

## Dictionaries And State Machines

Specializations, languages, currencies and countries should be managed
dictionaries with `is_active`, not hard-coded UI-only lists.

Career Passport, employment verification, disputes and visibility require
explicit state machines before implementation. Vacancy, hiring or marketplace
state machines are postponed and should not drive the MVP data model.
