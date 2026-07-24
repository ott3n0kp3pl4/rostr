# Rostr Product Requirements Document

## Complete PRD Outline

This outline is part of the PRD. It gives future readers a fast map of the
document before they enter the detailed requirements.

1. **Document Metadata** - version, status, owners, date, audience and source
   context.
2. **Executive Summary** - the compact product thesis for Rostr.
3. **Product Vision** - the future state Rostr is trying to create.
4. **Mission** - the near-term operating mission for the product.
5. **Long-Term Vision** - how the product may expand beyond the first market
   and Telegram.
6. **Product Principles** - durable rules that shape product decisions.
7. **Problem Statement** - the trust and identity problems Rostr exists to
   solve.
8. **Market Context** - confirmed context about the initial CIS and Telegram
   environment, without invented market metrics.
9. **Product Positioning** - how Rostr should be understood in the market.
10. **What Rostr Is** - positive product definition.
11. **What Rostr Is Not** - boundaries that prevent drift into the wrong
    category.
12. **Target Users** - initial and future user groups.
13. **Personas** - provisional operating personas for product design.
14. **User Problems** - specific problems by user type.
15. **Product Goals** - outcomes the product should create.
16. **Non-Goals** - things the product must not optimize for in the MVP.
17. **Product Invariants** - rules that should not be violated as Rostr evolves.
18. **Core Product Concept** - the identity and trust model behind Rostr.
19. **Career Passport** - planned core artifact and its requirements.
20. **Verified Career Timeline** - planned timeline model and event logic.
21. **Reputation Model** - how reputation should be built from verified events.
22. **Verification Model** - dual-sided confirmation and verification states.
23. **Talent Experience** - implemented onboarding and planned talent flows.
24. **Agency Experience** - implemented onboarding and planned agency flows.
25. **Public Profile** - planned public surface and constraints.
26. **Profile Visibility** - privacy, sharing and visibility rules.
27. **User Roles** - current onboarding roles and future authorization roles.
28. **Core User Journeys** - primary flows for onboarding, profile creation and
    verification.
29. **Product Modules** - product-level module map by status.
30. **Functional Requirements** - product requirements grouped by feature area.
31. **Non-Functional Requirements** - quality, trust, mobile and extensibility
    requirements.
32. **MVP Scope** - what the MVP should include.
33. **Out of Scope for MVP** - postponed or excluded capabilities.
34. **Post-MVP Roadmap** - staged future product direction.
35. **Monetization Hypotheses** - future commercial ideas, not implemented
    billing.
36. **Success Metrics** - metric categories to define later, without invented
    targets.
37. **Risks** - product, trust, legal, operational and technical risks.
38. **Edge Cases** - situations the product must handle or explicitly defer.
39. **Abuse and Trust Risks** - misuse patterns and required future controls.
40. **Privacy Principles** - privacy expectations for a trust product.
41. **Security Considerations** - product-level security expectations and
    current limits.
42. **Open Questions** - unresolved decisions that require founder or Product
    Architect approval.
43. **Product Decisions Log** - decisions already made and their implications.
44. **Appendix** - glossary, status vocabulary and legacy documentation notes.

## 1. Document Metadata

| Field             | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Product           | Rostr                                                                 |
| Document          | Product Requirements Document                                         |
| Version           | 0.1                                                                   |
| Status            | Draft for founder and Product Architect review                        |
| Owner             | Product Architect / Head of Product                                   |
| Last Updated      | 2026-07-23                                                            |
| Intended Audience | Founder, Product Architect, Codex, engineering, design and operations |
| Official Language | English                                                               |

### Source Context

This PRD is based on confirmed product context in the repository and founder
instructions. It follows the current product direction:

- Rostr is a Telegram Mini App startup.
- Rostr is a trust layer for creator teams.
- Rostr is professional identity infrastructure for people working in creator
  management agencies and related creator-economy teams.
- Rostr begins with identity and trust, not vacancies.
- The core product artifact is the planned Career Passport.
- Initial users are creator management agencies and talent, initially chatters,
  recruiters and team leads.
- Initial launch market is CIS.
- Telegram is the initial distribution channel, not the permanent product
  boundary.
- Product behavior is owned by the founder and Product Architect.
- Codex owns implementation quality, tests, refactoring and Git execution.

### Implementation Status Snapshot

The current repository is at MVP foundation status. The initial pushed commit is
`a72f36678f258f399024b5c24e53c7a487c037d9`.

Implemented today:

- Telegram Mini App foundation.
- Telegram authentication foundation through server-side raw `initData`
  validation.
- Premium mobile onboarding for talent.
- Premium mobile onboarding for agencies.
- PostgreSQL and Prisma foundation.
- React Hook Form and Zod validation patterns.
- shadcn/ui-compatible UI primitives.
- Framer Motion animation layer.
- Documentation foundation.

Not implemented today:

- Career Passport.
- Verified career timeline.
- Employment verification.
- Reputation model.
- Public profile.
- Search or discovery.
- Vacancies.
- Marketplace mechanics.
- Payments.
- Full RBAC.
- Moderator/admin systems.
- Contact disclosure controls.
- Production security controls.

This document distinguishes implemented functionality from planned, proposed and
unresolved product behavior. Planned controls are not production protections.

## 2. Executive Summary

Rostr is a trust layer for creator teams. It starts as a Telegram Mini App
because the initial users already live and work inside Telegram, especially in
the CIS launch market. The product should not be understood as a job board,
LinkedIn clone, ATS, AI recruiter or generic HR platform. Its center of gravity
is verified professional identity.

The core product innovation is the Career Passport: a portable professional
profile owned by the talent. The Career Passport is planned to contain a
verified career timeline where employment history and role history are confirmed
by both sides: the talent and the agency. Rostr's reputation model should be
built from verified facts and traceable career events, not subjective ratings,
anonymous reviews, popularity metrics or paid boosts.

Rostr begins with onboarding and profile foundations. The current implemented
product already supports talent and agency onboarding. Talent onboarding
collects role, specialization, experience, English level, timezone and salary
expectations. Agency onboarding collects agency name, agency size and monthly
hiring volume. These are onboarding foundations, not yet a complete Career
Passport or agency trust system.

The first major value after onboarding should be identity and trust:

- talent can create a professional profile;
- an agency can create an organization profile;
- work history can eventually be verified by both sides;
- verified career events can become the basis of reputation;
- the public profile can eventually be shared instead of a traditional CV.

Vacancies are intentionally postponed. Rostr may support vacancies later, but it
must not become a marketplace-first product too early. Every major feature must
strengthen trust between creator-economy market participants.

## 3. Product Vision

Rostr's vision is to become professional identity infrastructure for creator
teams.

In the current creator-economy labor market, work often happens through
informal networks, Telegram chats, referrals and fragmented records. People can
claim experience, agencies can claim team quality, and both sides often rely on
screenshots, introductions or trust borrowed from private channels. That creates
friction for honest talent and honest agencies. It also creates room for fake
claims, unverifiable histories and reputation that does not travel with the
person who earned it.

Rostr should make professional trust portable.

The product should let a person build a career record that follows them across
agencies, teams and markets. It should let agencies confirm facts without
owning the talent's identity. It should help the market move from unverifiable
claims to verifiable career events.

The long-term ambition is not to copy a general professional network. It is to
define a credible trust protocol for a specific professional niche first:
creator management agencies and the talent around them.

## 4. Mission

Rostr's mission is to help creator teams trust professional history without
relying on fragile claims, private gossip or subjective ratings.

For talent, Rostr should make career history portable, credible and owned by the
person who earned it.

For agencies, Rostr should make it easier to understand whether a candidate's
claimed experience is real, relevant and confirmed by previous work
relationships.

For the market, Rostr should create a reputation layer based on verified events
rather than popularity, paid placement or opinion-based scores.

Near-term mission:

- capture the minimum identity data needed to start a professional profile;
- establish a clear product language around Career Passport and verified career
  events;
- prepare the product and data model for dual-sided employment verification;
- avoid marketplace mechanics until identity and trust are strong enough to
  support them.

## 5. Long-Term Vision

Long term, Rostr can become the professional identity layer for creator-economy
teams beyond Telegram and beyond the CIS launch market.

The long-term product may include:

- public Career Passports that can be shared outside Telegram;
- verified employment history across agencies and teams;
- portable reputation based on verified career events;
- organization profiles for agencies;
- agency-to-talent relationship history;
- reference and verification workflows;
- carefully scoped discovery;
- invitations;
- notifications;
- eventually vacancies, if they strengthen the identity and trust layer;
- monetization based on utility, not paid reputation.

The product model must remain globally extensible from day one. That does not
mean supporting every country, language, legal model or workflow in the MVP. It
means avoiding product and technical decisions that permanently trap Rostr
inside one market, one language, one Telegram-only interface or one narrow job
category.

Telegram is the launch channel. It is not the final boundary of the product.

## 6. Product Principles

### 6.1 Trust Over Engagement

Rostr should not optimize for addictive loops, vanity metrics or endless feed
activity. A trust product wins when the right facts can be verified with less
ambiguity.

Product decisions should ask:

- Does this increase trust between talent and agencies?
- Does this reduce unverifiable claims?
- Does this preserve user ownership of career reputation?
- Does this avoid fake authority?

### 6.2 Verification Over Claims

A claim is useful only when the product clearly identifies it as unverified or
shows how it was verified. Rostr should never make an unverified profile look
equivalent to a verified career record.

### 6.3 Reputation Over Ratings

Rostr should not use star ratings, anonymous reviews or opinion scores as the
foundation of reputation. Reputation should emerge from verified career events:
what happened, when it happened, who confirmed it and what status it has.

### 6.4 Career History Over Resumes

A resume is usually self-authored and difficult to verify. Rostr's Career
Passport should become a structured history of professional events that can be
confirmed by both sides. It may eventually replace traditional CVs in this
niche, but it should not pretend to do so before verification exists.

### 6.5 Portable Identity Over Platform Lock-In

Talent owns the Career Passport. Agencies may verify facts, but they should not
own the person's professional identity.

### 6.6 Explicit Status Over Ambiguity

Every major product area should be labeled as implemented, planned, proposed or
unresolved. Users, engineers and operators should not have to guess whether a
control exists today or is only a future design.

### 6.7 Privacy By Default

Rostr deals with professional identity and future contact disclosure. Public
surfaces should be intentionally designed. Private contact details should never
leak through list views, logs, search results or implied consent.

## 7. Problem Statement

Creator management teams operate in a relationship-heavy market where trust is
often informal. Talent may have real experience, but they often lack a portable,
credible way to prove it. Agencies may need reliable hiring signals, but the
available signals can be noisy, unverifiable or scattered across private chats.

The market has several connected problems.

### 7.1 Talent Reputation Is Not Portable

Talent may work across agencies, teams or roles. Their reputation often stays
inside the last team, a Telegram chat, a founder's memory or a private
recommendation. When they move, they may have to rebuild trust from scratch.

### 7.2 Work History Is Easy To Claim And Hard To Verify

Profiles, resumes and messages can state that someone worked in a role, but the
recipient has limited ability to confirm whether the work happened, when it
happened and who can confirm it.

### 7.3 Agencies Need Trust Signals But Should Not Own Talent Identity

Agencies need ways to confirm professional history. At the same time, the
talent's identity should not be locked into one agency's internal system or
private database.

### 7.4 Reputation Systems Often Reward The Wrong Things

Star ratings, anonymous reviews, popularity and paid boosts can produce a false
sense of authority. They can also create incentives for manipulation, retaliation
or performance theater. Rostr should avoid those dynamics.

### 7.5 Job-Board Mechanics Can Distract From The Core Trust Problem

Vacancies and marketplaces can create activity, but activity is not the same as
trust. If Rostr starts with jobs too early, it risks becoming another listing
product before it has built the identity infrastructure that makes it unique.

## 8. Market Context

### 8.1 Confirmed Context

The initial launch market is CIS. The initial distribution channel is Telegram.
The initial users are creator management agencies and talent working in or
around those agencies. Initial talent categories are chatters, recruiters and
team leads.

No market-size numbers, traction claims, revenue claims, customer names,
partnerships or legal readiness claims are confirmed for this PRD.

### 8.2 Telegram-First Context

Telegram is important because the target users already operate there. A Telegram
Mini App can reduce onboarding friction, support mobile-first usage and meet the
market where it is.

However, Telegram-first does not mean Telegram-only forever. Rostr should avoid
product decisions that make the Career Passport impossible to share outside
Telegram or impossible to use in future web surfaces.

### 8.3 Creator-Team Context

Creator management agencies and related teams often include roles such as
chatters, recruiters, team leads, managers, closers, virtual assistants,
operations roles, sales roles and creator team specialists. Only chatters,
recruiters and team leads are confirmed as initial talent categories.

Future categories should be added through product decisions and data-driven
configuration, not hard-coded assumptions.

## 9. Product Positioning

Rostr should be positioned as a trust layer for creator teams.

Primary category:

- professional identity infrastructure for creator management teams;
- verified career timeline;
- Career Passport;
- reputation infrastructure based on verified events.

Secondary or future-adjacent categories:

- talent profile system;
- organization profile system;
- verification workflow;
- future discovery or invitation layer.

Rostr should not position itself as:

- a job board;
- a LinkedIn clone;
- an ATS;
- an AI recruiter;
- a generic HR platform;
- a marketplace-first product.

The positioning should communicate that Rostr is about trust, identity and
verified career history. Vacancies may become a module later, but they must not
define the product center.

## 10. What Rostr Is

Rostr is a Telegram Mini App startup that helps creator teams build trust around
verified professional identity.

Rostr is:

- a trust layer for creator teams;
- a professional identity system;
- a Career Passport;
- a verified career timeline;
- reputation infrastructure based on verified career events;
- a portable profile that can eventually replace traditional CVs in this niche;
- a product that starts in Telegram but can expand beyond Telegram;
- a system where talent owns professional reputation and agencies verify facts.

Rostr should make it easier for a talent member to say: "Here is my verified
career history."

Rostr should make it easier for an agency to say: "This work relationship
happened, and these facts are attributable."

## 11. What Rostr Is Not

Rostr is not primarily a job board. Vacancies are postponed and should not be
the first major value proposition.

Rostr is not a LinkedIn clone. The public profile is not a social profile, and
the product should not optimize for generic networking, posting, following or
public popularity.

Rostr is not an ATS. It may later support agency workflows, invitations or
pipeline-like modules, but its core is not applicant tracking.

Rostr is not an AI recruiter. AI matching, scoring and recommendation engines
are out of scope for the MVP.

Rostr is not a generic HR platform. It is designed for creator teams first.

Rostr is not a marketplace-first product. Marketplace mechanics may be useful
later only if they strengthen the trust and identity layer.

Rostr is not a ratings or reviews platform. It must not use star ratings,
anonymous reviews or subjective opinion scores as the foundation of reputation.

Rostr is not a paid reputation system. No user or agency should be able to buy a
better reputation.

## 12. Target Users

### 12.1 Initial Users

Initial users are:

- creator management agencies;
- talent working in or around creator management agencies.

Initial talent categories:

- chatters;
- recruiters;
- team leads.

### 12.2 Agency-Side Users

Agency-side users may include:

- agency owner;
- hiring manager;
- recruiter;
- operations lead;
- team lead.

Only agency owner onboarding is implemented today. Multi-member agency
operations, recruiter permissions and agency-scoped RBAC are planned or
unresolved depending on feature area.

### 12.3 Potential Future Talent Categories

Potential future categories include:

- managers;
- closers;
- virtual assistants;
- operations roles;
- sales roles;
- creator team specialists.

These categories are not automatically in MVP scope. Adding them requires a
product decision, taxonomy update and implementation support.

## 13. Personas

Personas are provisional product working models. They are not validated customer
research claims and do not imply active customers or traction.

### 13.1 Talent: Chatter

Status: Proposed. Category is confirmed for initial users; persona details are
assumptions.

The chatter works directly or indirectly with creator-team operations and wants
their experience to be credible when moving between agencies. They may have
practical experience but little formal documentation. They need a profile that
is quick to create on mobile and can later prove where they worked and in what
role.

Primary needs:

- create a profile quickly inside Telegram;
- record specialization, experience, English level, timezone and salary
  expectations;
- later request verification of work history;
- share a credible profile without exposing unnecessary private information.

### 13.2 Talent: Recruiter

Status: Proposed. Category is confirmed for initial users; persona details are
assumptions.

The recruiter may work inside agencies or across teams. Their credibility is
based on practical hiring history and role context. They need their career
history to be portable rather than trapped inside one agency.

Primary needs:

- show recruiting background and role history;
- distinguish verified facts from self-claims;
- build reputation through traceable career events;
- avoid being reduced to ratings or popularity.

### 13.3 Talent: Team Lead

Status: Proposed. Category is confirmed for initial users; persona details are
assumptions.

The team lead has responsibility beyond individual execution. They may need to
show progression across roles, team contexts and agencies. Their Career Passport
should eventually capture role evolution, verified periods and important career
events.

Primary needs:

- show seniority and experience credibly;
- represent timeline and role progression;
- request confirmation from agencies;
- share a professional identity outside a single Telegram conversation.

### 13.4 Agency Owner

Status: Proposed. Agency owner is a confirmed agency-side user; persona details
are assumptions.

The agency owner needs to create an organization presence and eventually verify
employment facts for current or former talent. They should be able to build
trust in their agency without turning Rostr into a generic company page.

Primary needs:

- create an agency profile quickly;
- represent agency size and hiring volume at a basic level;
- later confirm or dispute employment history requests;
- eventually manage team members and agency-scoped permissions.

### 13.5 Agency Recruiter Or Hiring Manager

Status: Proposed. Potential agency-side user, not implemented.

This user may participate in hiring, verification and future invitations. Their
access must be scoped to the agency and their permissions. They should not
receive broad platform access simply because they work for an agency.

Primary needs:

- view relevant talent profiles with privacy controls;
- send or manage verification/invitation workflows;
- operate within agency-scoped permissions;
- avoid exposing private contact details without consent.

## 14. User Problems

### 14.1 Talent Problems

Talent problems:

- difficult to prove past work history;
- reputation is fragmented across private chats and past agencies;
- self-authored resumes are not enough to create trust;
- subjective ratings can be unfair, retaliatory or easy to manipulate;
- public professional identity may not fit the niche;
- contact details can be exposed too early in hiring or discovery workflows;
- moving between agencies can mean losing credibility already earned.

### 14.2 Agency Problems

Agency problems:

- hard to know whether claimed experience is real;
- difficult to compare candidates when signals are informal;
- private references do not scale;
- generic professional networks do not model niche roles well;
- agency needs to verify facts without owning talent identity;
- future team permissions require agency scope, not broad global roles.

### 14.3 Market Problems

Market problems:

- trust depends on informal networks;
- reputation is not portable;
- unverifiable claims can circulate easily;
- ratings and reviews can create false authority;
- marketplace mechanics can increase activity without increasing trust.

## 15. Product Goals

### 15.1 Near-Term Goals

Near-term goals:

- provide a premium Telegram Mini App onboarding experience;
- complete user registration in less than 40 seconds;
- capture the minimum structured profile foundation for talent and agencies;
- preserve all onboarding choices in PostgreSQL;
- prevent completed users from seeing onboarding again;
- support developer reset of onboarding in development mode;
- establish Rostr product documentation as the source of truth;
- prepare the product model for Career Passport and verification.

### 15.2 MVP Product Goals

MVP product goals:

- support Telegram Mini App entry point;
- support Telegram authentication foundation;
- support talent onboarding;
- support agency onboarding;
- support basic talent profile foundation;
- support basic agency organization profile foundation;
- define Career Passport foundation;
- prepare for employment verification data model;
- keep vacancies postponed;
- avoid fake reputation and paid reputation mechanics.

### 15.3 Post-MVP Goals

Post-MVP goals:

- allow talent to build a Career Passport;
- allow agencies and talent to confirm employment history;
- display verification status clearly;
- enable shareable public profiles;
- introduce event-based reputation;
- support future discovery and invitations only after trust foundations exist;
- support future monetization without allowing paid reputation.

## 16. Non-Goals

### 16.1 MVP Non-Goals

The MVP should not include:

- vacancies;
- marketplace mechanics;
- payments;
- complex RBAC;
- admin or moderator product systems;
- public search marketplace;
- recommendation engine;
- AI recruiting;
- private messaging;
- complex analytics;
- paid reputation;
- ratings or reviews;
- anonymous reviews;
- popularity metrics;
- paid boosts to reputation;
- public blacklists;
- parsing Telegram chats;
- adult-content hosting;
- escrow, crypto or payout features.

### 16.2 Product Non-Goals

Rostr should not optimize for:

- feed engagement;
- vanity profile views;
- generic social networking;
- one-click hiring without trust context;
- unverifiable endorsements;
- agency lock-in of talent identity.

## 17. Product Invariants

These rules should not be violated as the product evolves:

1. Career Passport belongs to the talent, not to an agency.
2. Reputation is based on verified facts, not opinions.
3. No user can buy reputation.
4. No anonymous ratings.
5. No star-rating system.
6. Employment verification requires clear source attribution.
7. Career timeline changes should preserve history.
8. Telegram is a launch channel, not the final product boundary.
9. Any new feature must strengthen trust between market participants.
10. Product documentation must distinguish implemented, planned, proposed and
    unresolved features.

Additional product implications:

- agencies can verify facts but cannot rewrite a talent's identity;
- disputed or revoked verification must remain traceable;
- public profile visibility must be deliberate;
- private contact disclosure must never be implied by profile existence;
- feature growth must not turn reputation into a popularity contest.

## 18. Core Product Concept

The core product concept is professional identity built from verified career
events.

Rostr should make three things structurally different:

- a claim;
- a verified fact;
- a reputation signal.

A claim is information provided by a user or agency that has not yet been
verified by the relevant party. A verified fact is information confirmed through
an approved verification workflow with clear attribution. A reputation signal is
derived from verified facts and traceable events, not from opinions.

The Career Passport is the main artifact where this model becomes visible. The
verified career timeline is the core data structure. The reputation layer is a
future interpretation layer over verified events.

This order matters:

1. identity foundation;
2. profile foundation;
3. career timeline;
4. verification;
5. reputation;
6. public portability;
7. discovery or vacancies only after trust is credible.

## 19. Career Passport

Status: Planned.

The Career Passport is a portable professional identity owned by the talent. It
is not a resume, not a social profile and not an agency-owned record.

### 19.1 Purpose

The Career Passport should help talent present credible professional history and
help agencies understand whether the history has been verified.

It should answer:

- who is this professional in the creator-team context?
- what roles have they held?
- what agencies or teams have they worked with?
- which parts of that history are verified?
- who verified each fact?
- which parts are self-claimed, pending, disputed or unresolved?
- what public information can be shared safely?

### 19.2 Ownership

The Career Passport belongs to the talent. The talent should be able to carry it
between agencies and eventually beyond Telegram.

Agencies may:

- create or confirm career events;
- respond to verification requests;
- dispute incorrect claims;
- be shown as source attribution where appropriate.

Agencies should not:

- own the whole passport;
- erase talent history;
- buy reputation for a talent or agency;
- force private contact disclosure through the passport;
- alter verified history without trace.

### 19.3 Expected Content Areas

Planned content areas:

- basic identity and display name;
- role and specialization;
- experience level;
- English level;
- timezone;
- salary expectations or preferences;
- verified career timeline;
- agency relationships;
- verification status for employment history;
- reputation events derived from verified facts;
- public profile visibility settings;
- shareable profile link.

Open Question: exact field set, field visibility and regional localization must
be approved before implementation.

### 19.4 Status Model

Career Passport information should use explicit statuses:

- self-claimed;
- verification requested;
- agency confirmed;
- talent confirmed;
- fully verified;
- disputed;
- expired or outdated;
- hidden from public profile;
- removed from public view but retained for audit where legally allowed.

Open Question: final status vocabulary and state transitions require a Product
Architect decision before implementation.

### 19.5 MVP Foundation

The MVP should prepare the foundation for Career Passport but does not need to
complete the full passport experience.

MVP foundation should include:

- a profile foundation created through onboarding;
- data model readiness for future employment verification;
- clear documentation of planned passport behavior;
- no UI claims that verification exists before it is implemented.

## 20. Verified Career Timeline

Status: Planned.

The verified career timeline is the structured history inside the Career
Passport. It should record career events with attribution and status.

### 20.1 Timeline Purpose

The timeline should replace vague experience claims with traceable career
events.

Examples of planned verified facts:

- worked at agency X;
- held role Y;
- worked during period Z;
- employment confirmed by agency;
- employment confirmed by talent;
- career event created;
- role history updated;
- verification requested;
- verification accepted;
- verification disputed.

### 20.2 Timeline Requirements

Product-level requirements:

- each timeline event should have a type;
- each event should have a date or date range where applicable;
- each event should have source attribution;
- each event should have a verification status;
- changes to important timeline facts should preserve history;
- disputed events should remain distinguishable from confirmed events;
- public visibility should be configurable at event or section level;
- private operational data should not leak into public profile views.

### 20.3 Timeline Editing

Timeline editing must avoid silent overwrites. If talent or agency changes a
material fact, the product should preserve enough history to understand what
changed, when and by whom.

Open Question: exact edit, correction, dispute and archival policy requires
product and legal review.

### 20.4 Timeline Display

The timeline should be understandable on mobile. It should clearly separate:

- verified events;
- pending events;
- disputed events;
- self-claimed events.

The UI should not visually overstate unverified claims.

## 21. Reputation Model

Status: Planned.

Rostr's reputation model should be based on verified career events, not
subjective ratings.

### 21.1 What Reputation Means

In Rostr, reputation should mean accumulated evidence of verified professional
history. It should not mean popularity, follower count, subjective opinion or
paid placement.

Reputation signals may eventually include:

- number of verified career events;
- recency of verified events;
- role continuity;
- confirmed agency relationships;
- resolved verification requests;
- dispute history where appropriate and fair;
- verified progression across roles.

These are product concepts, not finalized metrics. No scoring formula is
approved in this PRD.

### 21.2 What Reputation Must Not Use

Rostr must not use:

- star ratings;
- anonymous reviews;
- popularity metrics;
- paid reputation boosts;
- fake endorsements;
- unverified claims as reputation signals.

### 21.3 Reputation Display

Reputation display should be conservative. The product should show the facts and
their verification status before introducing derived summaries.

Possible future display patterns:

- "Verified employment at agency";
- "Agency confirmed";
- "Talent confirmed";
- "Verification pending";
- "Disputed";
- "Career event verified".

Open Question: whether Rostr should ever show a summary badge, level or numeric
indicator is unresolved. Any such summary must avoid recreating ratings under a
different name.

## 22. Verification Model

Status: Planned.

Verification is the process that turns claims into verified facts. Verification
is not a review and not a rating.

### 22.1 Dual-Sided Confirmation

Employment history should be verified by both sides:

1. the talent;
2. the agency.

A fully verified employment record should make clear that both parties confirmed
the relevant facts. If only one side has confirmed, the product must not present
the record as fully verified.

### 22.2 Verification Request Flow

Planned flow:

1. Talent creates or selects an employment history entry.
2. Talent requests verification from an agency.
3. Agency receives the request.
4. Agency reviews the claimed facts.
5. Agency accepts, rejects, requests correction or disputes.
6. Talent sees the updated status.
7. The Career Passport reflects the current status and source attribution.

Agency-initiated verification may also be useful later, but it is not yet
approved as a detailed workflow.

### 22.3 Verification Statuses

Proposed statuses:

- draft;
- self-claimed;
- verification requested;
- agency accepted;
- talent accepted;
- verified by both sides;
- correction requested;
- disputed;
- withdrawn;
- archived.

Open Question: final status names, allowed transitions and retention rules
require approval before implementation.

### 22.4 Source Attribution

Every verified fact should answer:

- who created the claim?
- who confirmed it?
- when was it confirmed?
- what exactly was confirmed?
- is there a dispute or correction history?

The product must avoid vague labels such as "verified" without making the source
of verification understandable.

### 22.5 Disputes

Disputes are a critical trust area. Rostr should not treat disputes as simple
negative reviews. A dispute means a factual verification conflict exists.

Open Question: dispute reasons, evidence handling, moderation process, appeal
process and visibility rules are unresolved.

## 23. Talent Experience

### 23.1 Implemented: Talent Onboarding

Talent onboarding is implemented as a premium mobile wizard. It is designed to
complete registration in less than 40 seconds.

Implemented talent onboarding collects:

- role;
- specialization;
- experience;
- English level;
- timezone;
- minimum desired salary.

The onboarding experience uses one action per screen, progress indication,
mobile-first interaction and automatic transition after each selection where
appropriate. Data is saved in PostgreSQL through Prisma.

After onboarding is completed, the user should not see onboarding again. In
development mode, onboarding can be reopened through a dev reset.

### 23.2 Planned: Talent Profile Foundation

After onboarding, talent should have a basic profile foundation. The profile
should not pretend to be a complete Career Passport until the passport and
verification features exist.

Planned profile foundation may include:

- display name;
- role;
- specialization;
- experience;
- English level;
- timezone;
- salary expectation;
- onboarding completion state.

Open Question: public/private split for each field needs approval.

### 23.3 Planned: Career Passport Experience

Talent should be able to:

- view their Career Passport;
- add career timeline entries;
- mark entries as self-claimed;
- request agency verification;
- see verification status;
- hide or show public sections;
- share a public profile link when public profiles are implemented.

### 23.4 Planned: Trust Feedback

Talent should receive clear feedback about:

- what is verified;
- what is pending;
- what is disputed;
- what is private;
- what is public;
- what cannot yet be used as a reputation signal.

The UI should avoid shame, social comparison and manipulative urgency.

## 24. Agency Experience

### 24.1 Implemented: Agency Onboarding

Agency onboarding is implemented as a premium mobile wizard.

Implemented agency onboarding collects:

- agency name;
- team size;
- monthly hiring volume.

The first agency member is created as an owner relationship in the current data
model. This is a minimal onboarding relationship, not full agency-scoped RBAC.

### 24.2 Planned: Organization Profile

The agency organization profile is not just a company page. It should represent
an organization as a participant in the trust network.

Planned organization profile may include:

- agency name;
- basic team size range;
- hiring volume range;
- verified relationship count, if later approved;
- agency verification status, if later approved;
- public/private visibility controls.

Open Question: exact public agency profile fields require approval.

### 24.3 Planned: Verification Operations

Agencies should eventually be able to:

- receive employment verification requests;
- confirm facts;
- request corrections;
- dispute incorrect claims;
- manage agency team members with scoped permissions;
- see verification history relevant to their agency.

Agencies should not be able to:

- globally edit talent passports;
- remove verified history without trace;
- buy better reputation;
- access private contact details without policy and consent.

### 24.4 Planned: Agency-Talent Relationship

The agency-talent relationship should be a trust relationship, not just a hiring
record. It should be able to represent a past, current or claimed work
relationship with verification status.

Open Question: relationship types, date precision, role taxonomy and dispute
rules are unresolved.

## 25. Public Profile

Status: Planned.

The public profile is the shareable surface of the Career Passport. It is not a
social profile and not a resume page.

### 25.1 Purpose

The public profile should let talent share credible professional identity with
an agency or external viewer. It should make verified career history easier to
trust without exposing private data by default.

### 25.2 Public Profile Requirements

Product-level requirements:

- show only fields approved for public visibility;
- clearly label verified, pending, disputed and self-claimed information;
- avoid exposing private contact details;
- be shareable outside the immediate onboarding flow;
- support future non-Telegram access;
- make source attribution understandable without leaking sensitive operational
  details;
- degrade gracefully when a viewer is not authenticated.

### 25.3 Public Profile Is Not A Social Feed

The public profile should not include generic social networking mechanics such
as follower counts, posts, likes or popularity rankings unless a future product
decision proves they strengthen trust. They are not part of the current product
direction.

### 25.4 Public Profile And CV Replacement

The public profile can eventually replace traditional CVs in this niche. That is
a long-term product ambition, not a current implementation claim.

## 26. Profile Visibility

Status: Open Question.

Profile visibility must be deliberate because the product deals with identity,
work history and future contact disclosure.

### 26.1 Visibility Principles

Visibility principles:

- public does not mean everything;
- private contact data must remain private unless explicitly disclosed;
- verified facts may have different visibility from raw operational data;
- profile sharing should be controlled by the talent where possible;
- agency attribution should respect dispute and privacy rules;
- viewers should know when information is hidden, pending or unavailable.

### 26.2 Proposed Visibility Levels

Proposed visibility levels:

- private to the user;
- visible to the linked agency;
- visible to authenticated Rostr users;
- visible through a share link;
- public web view;
- hidden or archived.

Open Question: final visibility levels and defaults require Product Architect,
founder and legal review.

### 26.3 Contact Disclosure

Contact disclosure controls are not implemented.

Future contact disclosure should require:

- explicit policy check;
- clear reason;
- consent where required;
- audit event;
- revocation or retention policy;
- DTO allowlists that exclude contact data by default.

These planned controls are not current production protections.

## 27. User Roles

### 27.1 Implemented Role-Like Onboarding Types

Implemented onboarding stores user type:

- candidate;
- agency owner.

These are onboarding branch choices and current profile foundations. They are
not full production authorization roles.

### 27.2 Planned Product Roles

Planned roles may include:

- talent/candidate;
- agency owner;
- agency recruiter;
- agency hiring manager;
- operations lead;
- team lead;
- moderator;
- admin.

Moderator and admin product systems are not implemented.

### 27.3 Authorization Principle

Future authorization should be permission-based and scope-aware. Product
permissions should be checked on the server. Agency access should be scoped to a
specific agency.

Status: Planned (Post-MVP).

### 27.4 Role Risks

Role risks:

- treating onboarding type as full authorization;
- giving agency members access outside their agency;
- adding global admin powers without audit and review;
- exposing contact data through role shortcuts;
- hard-coding role logic that cannot support future agency teams.

## 28. Core User Journeys

### 28.1 Implemented Journey: Talent Onboarding

1. User opens Rostr inside Telegram or local development mode.
2. User sees welcome screen.
3. User chooses role.
4. User enters the talent path.
5. User chooses specialization.
6. User selects experience.
7. User selects English level.
8. User selects timezone.
9. User enters minimum desired salary.
10. User reaches completion screen.
11. Onboarding completion is saved.
12. Completed user no longer sees onboarding.

### 28.2 Implemented Journey: Agency Onboarding

1. User opens Rostr inside Telegram or local development mode.
2. User sees welcome screen.
3. User chooses role.
4. User enters the agency path.
5. User enters agency name.
6. User selects team size.
7. User selects monthly hiring volume.
8. User reaches completion screen.
9. Agency and first owner relationship are saved.
10. Completed user no longer sees onboarding.

### 28.3 Planned Journey: Talent Creates Career Passport

1. Talent completes onboarding.
2. Talent lands in a basic profile or passport foundation.
3. Talent adds or reviews career history.
4. Talent creates a career event.
5. Talent marks facts that require verification.
6. Talent requests agency confirmation.
7. Talent sees pending status.
8. Agency responds.
9. Talent sees verified, disputed or correction-requested status.
10. Public profile updates according to visibility settings.

### 28.4 Planned Journey: Agency Confirms Employment

1. Agency user receives or opens a verification request.
2. Agency sees the claimed facts.
3. Agency confirms, disputes or requests correction.
4. System records source attribution and timestamp.
5. Talent is notified.
6. Career Passport reflects the updated state.

### 28.5 Planned Journey: Public Profile Sharing

1. Talent chooses what should be visible.
2. Talent generates or opens a shareable profile.
3. Viewer opens the profile.
4. Viewer sees verified and unverified sections clearly separated.
5. Viewer cannot access private contact details by default.
6. Viewer can trust that verified labels have source attribution.

### 28.6 Future Journey: Discovery Or Invitation

Future discovery and invitations are postponed until identity and verification
foundations exist.

If implemented later, discovery must:

- respect visibility and privacy rules;
- avoid leaking contacts;
- avoid popularity ranking as reputation;
- prioritize verified facts where appropriate;
- include rate limits, abuse controls and audit where needed.

## 29. Product Modules

| Module                         | Status                 | Product Meaning                                            |
| ------------------------------ | ---------------------- | ---------------------------------------------------------- |
| Telegram Mini App entry        | Implemented foundation | Initial access surface for the product.                    |
| Telegram authentication        | Implemented foundation | Server validates raw Telegram `initData`; sessions absent. |
| Talent onboarding              | Implemented            | Captures initial talent profile foundation.                |
| Agency onboarding              | Implemented            | Captures initial agency profile foundation.                |
| Basic talent profile           | Planned                | First profile after onboarding.                            |
| Basic organization profile     | Planned                | First agency surface after onboarding.                     |
| Career Passport                | Planned                | Core portable identity artifact.                           |
| Verified career timeline       | Planned                | Timeline of career events and verification status.         |
| Employment verification        | Planned                | Dual-sided confirmation by talent and agency.              |
| Reputation from verified facts | Planned                | Reputation model based on traceable events.                |
| Public profile                 | Planned                | Shareable public Career Passport surface.                  |
| Visibility controls            | Planned / unresolved   | Privacy and sharing settings.                              |
| Contact disclosure             | Planned (Post-MVP)     | Future controlled access to private contacts.              |
| Search/discovery               | Proposed (Future)      | Only after identity and trust foundations.                 |
| Invitations                    | Proposed (Future)      | Possible agency-to-talent workflow.                        |
| References                     | Proposed (Future)      | May support verification, not subjective reviews.          |
| Notifications                  | Planned (Post-MVP)     | Telegram or other notifications with preferences.          |
| Vacancies                      | Planned (Postponed)    | Must not lead the MVP.                                     |
| Payments                       | Proposed (Future)      | Future monetization only.                                  |
| Admin/moderation               | Planned (Post-MVP)     | Requires separate product and security design.             |

## 30. Functional Requirements

Functional requirements use status labels:

- **Implemented** means the current product already includes the behavior.
- **Planned** means the PRD expects the product to support it in a future slice.
- **Proposed** means the idea is useful but not yet approved in detail.
- **Open Question** means product decision is required.
- **Planned (Post-MVP)** means planned after the MVP, not implemented yet.
- **Planned (Postponed)** means planned only after prerequisite trust
  foundations or new approval, not implemented yet.
- **Proposed (Future)** means potentially useful future direction, not approved
  in detail and not implemented.

### 30.1 Telegram Entry And Authentication

**FR-AUTH-001 - Telegram Mini App Entry**

Status: Implemented.

Rostr should support entry through Telegram Mini App because Telegram is the
initial distribution channel for the target market.

**FR-AUTH-002 - Server-Side Telegram Validation**

Status: Implemented.

The product should validate raw Telegram `initData` on the server. The product
must not rely on untrusted client-provided user IDs.

**FR-AUTH-003 - User Session**

Status: Planned.

The product should eventually issue a secure user session after verified
Telegram login. Session model, rotation, revocation and replay protection are
not finalized.

**FR-AUTH-004 - Non-Telegram Future Access**

Status: Proposed.

Rostr should preserve a path to future non-Telegram profile access. Telegram is
not the permanent product boundary.

### 30.2 Onboarding

**FR-ONB-001 - Welcome Screen**

Status: Implemented.

The onboarding flow should start with a premium welcome screen optimized for
mobile Telegram usage.

**FR-ONB-002 - Role Selection**

Status: Implemented.

The user should choose the relevant onboarding path: talent/candidate or agency.

**FR-ONB-003 - Talent Onboarding**

Status: Implemented.

Talent onboarding should collect specialization, experience, English level,
timezone and minimum salary expectation.

**FR-ONB-004 - Agency Onboarding**

Status: Implemented.

Agency onboarding should collect agency name, team size and monthly hiring
volume.

**FR-ONB-005 - One Action Per Screen**

Status: Implemented.

Each onboarding screen should contain only one meaningful action.

**FR-ONB-006 - Progress Bar**

Status: Implemented.

The onboarding flow should show progress so users understand how close they are
to completion.

**FR-ONB-007 - Auto-Advance**

Status: Implemented.

After each choice, the flow should advance automatically when no additional
typing or confirmation is required.

**FR-ONB-008 - Persistence**

Status: Implemented.

Onboarding data should be saved in PostgreSQL after each step so interrupted
users can continue.

**FR-ONB-009 - Completed User Handling**

Status: Implemented.

After completion, the user should not see onboarding again.

**FR-ONB-010 - Development Reset**

Status: Implemented.

Developers should be able to reopen onboarding through a development-only reset.
This must not be a production bypass.

### 30.3 Basic Talent Profile

**FR-TAL-001 - Profile Foundation From Onboarding**

Status: Planned.

Talent onboarding data should become the foundation of a basic talent profile.

**FR-TAL-002 - Profile Editing**

Status: Planned.

Talent should eventually be able to edit basic profile fields. Editing rules for
fields that affect verified history are unresolved.

**FR-TAL-003 - Field Visibility**

Status: Open Question.

The product must define which talent fields are public, private, share-link-only
or visible to agencies.

**FR-TAL-004 - No Resume Claim**

Status: Planned.

The basic profile should not be described as a full resume or Career Passport
until the relevant functionality exists.

### 30.4 Agency Organization Profile

**FR-AGY-001 - Organization Foundation From Onboarding**

Status: Planned.

Agency onboarding data should become the foundation of an organization profile.

**FR-AGY-002 - Agency Profile Editing**

Status: Planned.

Agency owners should eventually be able to edit organization profile fields.

**FR-AGY-003 - Agency Membership**

Status: Implemented.

The data model includes an initial agency owner relationship. Multi-member UI,
agency recruiter permissions and agency-scoped RBAC are not implemented.

**FR-AGY-004 - Organization Trust Role**

Status: Planned.

The agency profile should eventually act as a source of verification, not merely
as a marketing company page.

### 30.5 Career Passport

**FR-CP-001 - Career Passport Creation**

Status: Planned.

Talent should eventually have a Career Passport created from their profile
foundation.

**FR-CP-002 - Talent Ownership**

Status: Planned.

The Career Passport belongs to talent, not to an agency.

**FR-CP-003 - Career Passport Sections**

Status: Planned.

The passport should include identity, role, profile foundation, career timeline,
verification status and public visibility controls.

**FR-CP-004 - No Fake Verification**

Status: Planned.

The UI must not make unverified data look verified.

**FR-CP-005 - Public Portability**

Status: Planned.

The Career Passport should eventually be shareable outside the immediate
Telegram onboarding context.

### 30.6 Verified Employment History

**FR-VER-001 - Employment Entry**

Status: Planned.

Talent should be able to represent employment or work relationships as
structured entries.

**FR-VER-002 - Dual-Sided Confirmation**

Status: Planned.

Employment history should support confirmation by both talent and agency.

**FR-VER-003 - Verification Request**

Status: Planned.

Talent should be able to request agency verification for a career event.

**FR-VER-004 - Agency Response**

Status: Planned.

Agency should be able to accept, dispute or request correction for a
verification request.

**FR-VER-005 - Verification Status Display**

Status: Planned.

Verification state should be visible and understandable to talent, agency and
permitted viewers.

**FR-VER-006 - Source Attribution**

Status: Planned.

Verified facts should include source attribution so users understand who
confirmed what.

### 30.7 Reputation

**FR-REP-001 - Event-Based Reputation**

Status: Planned.

Rostr reputation should be based on verified career events.

**FR-REP-002 - No Star Ratings**

Status: Planned.

Rostr must not use star ratings.

**FR-REP-003 - No Anonymous Reviews**

Status: Planned.

Rostr must not use anonymous reviews as a reputation foundation.

**FR-REP-004 - No Paid Reputation**

Status: Planned.

No user or agency can buy reputation.

**FR-REP-005 - Derived Reputation Summaries**

Status: Open Question.

Any future summary, badge, level or score requires product approval and must not
recreate subjective ratings.

### 30.8 Public Profile And Sharing

**FR-PUB-001 - Shareable Profile**

Status: Planned.

Talent should eventually be able to share a public profile or Career Passport.

**FR-PUB-002 - Verified Status Labels**

Status: Planned.

Public profile viewers should be able to distinguish verified, pending,
disputed and self-claimed information.

**FR-PUB-003 - Contact Privacy**

Status: Planned.

Public profiles must not expose private contact details by default.

**FR-PUB-004 - External Access**

Status: Proposed.

The public profile should eventually be accessible outside Telegram where
appropriate.

### 30.9 Future Search And Discovery

**FR-DISC-001 - Discovery Is Postponed**

Status: Proposed (Future).

Search and discovery should not be implemented before identity and trust
foundations.

**FR-DISC-002 - Privacy-Aware Discovery**

Status: Proposed (Future).

If discovery is implemented later, it must respect profile visibility and
contact disclosure rules.

**FR-DISC-003 - Verified Facts In Discovery**

Status: Proposed.

Future discovery should prefer verified facts where relevant, but must avoid
turning verification into a popularity contest.

### 30.10 Future Invitations

**FR-INV-001 - Invitations Are Future Scope**

Status: Proposed (Future).

Agency-to-talent invitations may be implemented later.

**FR-INV-002 - Invitation Abuse Controls**

Status: Proposed (Future).

Invitations would require rate limits, consent-aware disclosure, user controls
and audit events.

### 30.11 Future References

**FR-REF-001 - References Are Unresolved**

Status: Open Question.

References may become useful if they support factual verification. They must not
become anonymous reviews or subjective ratings.

### 30.12 Future Notifications

**FR-NOT-001 - Verification Notifications**

Status: Planned (Post-MVP).

Users should eventually receive notifications about verification requests and
status changes.

**FR-NOT-002 - Notification Preferences**

Status: Planned (Post-MVP).

Notifications require preferences, failure handling and asynchronous delivery.

### 30.13 Future Vacancies

**FR-VAC-001 - Vacancies Are Postponed**

Status: Planned (Postponed).

Vacancies should not be part of the current product center.

**FR-VAC-002 - Vacancies Must Support Trust**

Status: Planned (Postponed).

If vacancies are introduced later, they must strengthen the trust and identity
layer rather than replacing it.

### 30.14 Future Monetization

**FR-MON-001 - Monetization Is Hypothesis Stage**

Status: Proposed.

Future monetization may include agency plans, team seats, limits, verification
utilities or profile features. No billing integration is implemented.

**FR-MON-002 - Reputation Cannot Be Purchased**

Status: Planned.

Monetization must not allow paid reputation, paid verification outcome or
unearned trust.

## 31. Non-Functional Requirements

### 31.1 Mobile Telegram Quality

Rostr must feel native to mobile Telegram usage. The interface should respect
Telegram safe areas, support small screens and avoid long forms.

The onboarding experience should remain fast, calm and premium. Each screen
should ask for one decision or input.

### 31.2 Speed

Onboarding should be completable in less than 40 seconds for a typical user who
knows their answers. Future flows should preserve the same bias toward clear,
focused actions.

No specific production performance targets are confirmed in this PRD.

### 31.3 Reliability

Profile and onboarding data should not be lost if the user leaves the Mini App
mid-flow. Important future verification actions should be idempotent where
retries can occur.

### 31.4 Data Integrity

Verified career history must preserve source attribution and change history.
Important events should not be silently overwritten.

### 31.5 Privacy

Private information should be excluded from public and list views by default.
Contact disclosure must be designed as a policy-controlled future capability.

### 31.6 Security

Current security is an onboarding development foundation, not production-ready
security. Future production use requires sessions, RBAC, rate limiting, audit
logs, PII protection, moderation and incident response.

### 31.7 Extensibility

The product must remain extensible beyond:

- Telegram;
- CIS;
- the initial talent categories;
- the first agency workflow;
- the first verification model.

### 31.8 Accessibility

The product should support clear text, touch-friendly controls, reduced motion
respect and understandable status labels. Full accessibility acceptance criteria
are not yet defined.

Open Question: formal accessibility requirements and test process.

### 31.9 Internationalization

Rostr launches with CIS context and Telegram-first usage, but should preserve a
path to future international expansion.

Open Question: initial official product language, user-facing language strategy
and localization plan. Repository product documentation is English.

## 32. MVP Scope

MVP should include:

- Telegram Mini App entry point;
- Telegram authentication foundation;
- talent onboarding;
- agency onboarding;
- role selection;
- basic profile foundation;
- basic organization profile foundation;
- Career Passport foundation;
- data model readiness for employment verification;
- documentation and architectural foundation.

The MVP should communicate honestly. It may introduce the Career Passport as the
product direction, but it must not claim that employment verification,
reputation or public profiles are live until they are implemented.

### 32.1 MVP Experience Boundary

The first real user scenario is onboarding. After onboarding, the product may
show a completion or placeholder state, but it should not expose fake vacancies,
fake profiles, fake search or fake verification.

### 32.2 MVP Trust Boundary

MVP trust is mostly structural:

- user identity foundation;
- profile foundation;
- agency organization foundation;
- data model direction;
- product language;
- no misleading reputation features.

Actual trust features such as verification and reputation are planned, not live.

## 33. Out Of Scope For MVP

Out of scope:

- vacancies;
- marketplace mechanics;
- payments;
- checkout;
- subscriptions;
- complex RBAC;
- admin/moderator product systems;
- public search marketplace;
- recommendation engine;
- AI recruiting;
- private messaging;
- complex analytics;
- paid reputation;
- star ratings;
- anonymous reviews;
- public blacklists;
- Telegram chat parsing;
- contact disclosure controls;
- production moderation;
- production audit logs;
- full legal compliance system.

These exclusions are deliberate. They protect Rostr from becoming a marketplace
or engagement product before the identity and trust model is credible.

## 34. Post-MVP Roadmap

This roadmap is product-level and should be refined through future decisions.
It does not replace engineering planning.

### 34.1 Phase 1: Profile Foundation

Planned:

- post-onboarding talent profile;
- post-onboarding agency profile;
- edit flows for non-verified fields;
- clear current vs planned labels;
- visibility foundations.

### 34.2 Phase 2: Career Passport Foundation

Planned:

- Career Passport surface;
- career timeline entry model;
- self-claimed career events;
- public/private section model;
- mobile-first passport view.

### 34.3 Phase 3: Verification

Planned:

- verification request flow;
- agency response flow;
- source attribution;
- verification statuses;
- dispute and correction foundations;
- notification foundation.

### 34.4 Phase 4: Reputation

Planned:

- event-based reputation model;
- verified fact display;
- conservative reputation summaries if approved;
- abuse monitoring;
- documentation of reputation rules.

### 34.5 Phase 5: Public Portability

Planned:

- shareable public profile;
- visibility controls;
- external access outside Telegram where appropriate;
- privacy-safe public rendering.

### 34.6 Phase 6: Discovery, Invitations Or Vacancies

Future and conditional:

- discovery;
- invitations;
- references;
- vacancies.

These should be considered only when they strengthen the trust layer.

## 35. Monetization Hypotheses

Status: Proposed.

Rostr may eventually monetize through utility around agencies, teams, limits,
verification workflows, profile capabilities or discovery. No monetization
model is approved in detail and no payment integration is implemented.

Possible future hypotheses:

- agency plans with usage limits;
- agency team seats;
- higher invitation or workflow limits;
- advanced agency organization features;
- verification workflow tools;
- profile or passport utilities;
- paid discovery tools that do not alter reputation;
- promoted vacancies only if vacancies are later approved.

Hard constraints:

- no paid reputation;
- no paid verification outcome;
- no paid removal of negative facts;
- no paid manipulation of trust signals;
- no dark patterns around profile visibility or contact disclosure.

Open Questions:

- who pays first: agency, talent or both?
- what is the first monetizable unit of value?
- should verification ever be paid, and if so, who pays without biasing the
  outcome?
- what legal and operational review is required before payments?

## 36. Success Metrics

Status: Proposed.

This PRD does not invent business metrics, traction or targets. The following
are metric categories that may be defined later.

### 36.1 Activation Metrics

Potential metric categories:

- talent onboarding completion;
- agency onboarding completion;
- time to onboarding completion;
- profile foundation completion;
- return after onboarding.

### 36.2 Trust Metrics

Potential metric categories:

- career events created;
- verification requests sent;
- verification requests accepted;
- verification requests disputed;
- time to verification response;
- shareable profiles created;
- public profile views by approved context.

### 36.3 Quality Metrics

Potential metric categories:

- abandoned onboarding steps;
- validation errors;
- support requests;
- dispute rate;
- abuse reports;
- false or misleading verification attempts.

### 36.4 Privacy And Safety Metrics

Potential metric categories:

- contact disclosure requests;
- disclosure approvals;
- disclosure revocations;
- suspicious scraping signals;
- moderation queue volume, once moderation exists.

Open Question: final metric definitions, targets, dashboards and data retention
rules.

## 37. Risks

### 37.1 Product Drift Risk

Rostr may drift into a job board or marketplace if vacancies become the center
too early. This would weaken the core identity and trust thesis.

Mitigation:

- keep vacancies postponed;
- require product decision before marketplace work;
- anchor roadmap in Career Passport and verification.

### 37.2 Fake Trust Risk

The product may accidentally imply verification before verification exists.

Mitigation:

- label implemented vs planned features clearly;
- do not show fake badges;
- do not use "verified" without source attribution.

### 37.3 Reputation Abuse Risk

Any reputation system can be gamed or weaponized.

Mitigation:

- avoid star ratings and anonymous reviews;
- base reputation on verified events;
- preserve dispute workflows;
- avoid paid boosts.

### 37.4 Privacy Risk

Public profiles and discovery can expose more information than intended.

Mitigation:

- define visibility controls before public profile launch;
- exclude contact data by default;
- audit future contact disclosure.

### 37.5 Agency Power Imbalance

Agencies may have more operational leverage than individual talent.

Mitigation:

- talent owns Career Passport;
- agencies verify facts but do not own identity;
- disputes and corrections must be fair and traceable.

### 37.6 Legal And Compliance Risk

Age checks, data retention, privacy, moderation and regional laws are unresolved.

Mitigation:

- do not claim production legal readiness;
- require legal review before launch beyond internal MVP;
- document retention and deletion policies before sensitive data expansion.

### 37.7 Technical Foundation Risk

Current security and authorization are foundations, not production systems.

Mitigation:

- implement sessions, RBAC, rate limits, audit logs and PII controls before
  sensitive workflows;
- keep technical documentation honest.

## 38. Edge Cases

### 38.1 User Starts As Talent But Later Represents Agency

Open Question: whether one user can hold multiple product identities and how
switching works.

### 38.2 Agency Changes Name

Planned behavior should preserve verification attribution. An agency rename
must not break historical career events.

### 38.3 Talent Claims Work At An Agency That Is Not On Rostr

Open Question: whether Rostr supports unclaimed agencies, invite-to-verify or
manual review.

### 38.4 Agency Disputes Talent Claim

Open Question: dispute flow, evidence, visibility and appeal policy.

### 38.5 Talent Leaves An Agency

Planned behavior should allow history to remain visible if verified and allowed
by policy. Agency should not be able to erase the talent's Career Passport.

### 38.6 Duplicate Agencies

Open Question: organization deduplication and verification of agency identity.

### 38.7 Multiple Telegram Accounts

Open Question: account linking and identity recovery.

### 38.8 User Wants Data Deleted

Open Question: deletion and anonymization policy. Product must respect future
legal requirements and preserve only legally permitted audit records.

### 38.9 False Verification

Open Question: detection, reversal, audit and penalties for false verification.

### 38.10 Public Profile Link Shared Unintentionally

Open Question: link revocation, privacy defaults and public profile access
controls.

## 39. Abuse And Trust Risks

### 39.1 Fake Employment Claims

Risk: talent or agency creates false work history.

Required future controls:

- verification status;
- source attribution;
- dispute flow;
- audit history.

### 39.2 Retaliatory Disputes

Risk: an agency disputes truthful history because of conflict with talent.

Required future controls:

- neutral dispute process;
- clear evidence policy;
- careful public display;
- appeal process.

### 39.3 Paid Trust Manipulation

Risk: users try to buy reputation or better placement.

Required product rule:

- monetization must never modify reputation facts or verification outcomes.

### 39.4 Scraping And Contact Harvesting

Risk: public profiles or discovery are used to collect contacts.

Required future controls:

- contact exclusion by default;
- rate limiting;
- abuse monitoring;
- disclosure audit;
- visibility controls.

### 39.5 Fake Agencies

Risk: bad actors create fake agencies to verify false history.

Required future controls:

- agency identity checks;
- organization verification policy;
- suspicious behavior detection;
- moderation process.

### 39.6 Over-Trust In Badges

Risk: users over-trust badges or labels without understanding what was verified.

Required product rule:

- verification labels must show source and meaning clearly.

### 39.7 Marketplace Pressure

Risk: job listings create incentives to inflate profiles, spam candidates or
optimize for volume.

Required product rule:

- discovery, invitations and vacancies must wait until trust controls exist.

## 40. Privacy Principles

### 40.1 Data Minimization

Rostr should collect only what is necessary for the current product stage. The
current onboarding foundation should not collect contacts or unnecessary free
text.

### 40.2 Private By Default

Private data should stay private unless the user takes an explicit action or a
documented policy allows disclosure.

### 40.3 Public Profile Control

Talent should control what appears on their public profile where possible.
Public profile defaults must be conservative.

### 40.4 Contact Disclosure Control

Contact details should not appear in public profiles, search lists or ordinary
profile DTOs by default. Disclosure requires future policy, consent and audit.

### 40.5 Source Attribution Without Oversharing

Verified facts require attribution, but the product should avoid exposing
private operational details that are not needed for trust.

### 40.6 Deletion And Retention

Open Question: deletion, anonymization, audit retention and regional compliance
rules require legal review.

## 41. Security Considerations

Current security is not production-ready. It is an onboarding foundation.

### 41.1 Implemented Foundations

Implemented:

- server-side Telegram `initData` validation;
- bot token server-only access;
- no client-supplied user ID for onboarding actor selection;
- onboarding persistence through server APIs;
- `.env` exclusion from Git.

### 41.2 Planned Controls Not Implemented

Planned but not implemented:

- secure user sessions;
- full RBAC;
- agency-scoped permissions;
- rate limiting;
- audit logs;
- moderation system;
- contact disclosure controls;
- PII encryption strategy;
- production secret manager;
- incident response.

These are planned controls, not current production protections.

### 41.3 Security Requirements Before Sensitive Features

Before launching verification, public profiles, discovery, invitations or
contact disclosure, Rostr needs:

- server-side authorization;
- actor and scope checks;
- audit events for sensitive mutations;
- rate limits for abuse-prone endpoints;
- privacy-safe DTOs;
- moderation and support process where applicable;
- deletion and retention policy.

## 42. Open Questions

### Product Scope

- What is the first post-onboarding product surface?
- Is the first Career Passport slice private-only, shareable, or public?
- Which fields belong in the first Career Passport version?
- Which profile fields are public by default?

### Verification

- What exact facts can be verified in v1?
- Who can initiate verification?
- Can agencies initiate employment history entries?
- What are the final verification statuses?
- How are disputes handled?
- What evidence, if any, is stored?

### Reputation

- Which verified events become reputation signals first?
- Should Rostr show any aggregate badge or summary?
- How should disputed events affect public presentation?
- How can reputation remain useful without becoming a rating?

### Agencies

- How is agency identity verified?
- How are duplicate agencies handled?
- What agency roles exist in v1?
- What permissions does each agency role have?

### Public Profile

- Is the first public profile accessible outside Telegram?
- Are public links revocable?
- Can talent hide agency names while keeping role history visible?
- What does an unauthenticated viewer see?

### Market And Legal

- What countries are included in the CIS launch?
- What user-facing language should the first public product use?
- What legal policies are required before external launch?
- What age verification, if any, is required?

### Monetization

- What is the first monetizable value unit?
- Should agencies pay before verification is live?
- Can verification workflows be monetized without biasing outcomes?
- What payment provider and legal setup would be required later?

## 43. Product Decisions Log

This section summarizes decisions already reflected in the product context. It
does not replace `docs/DECISIONS.md`.

### 43.1 Rostr Name And Positioning

Decision: Product name is Rostr.

Decision: Rostr is a trust layer for creator teams.

Implication: New product-facing documentation should use Rostr, not legacy
CreatorHire language.

### 43.2 Telegram-First Launch

Decision: Rostr starts as a Telegram Mini App.

Implication: onboarding and early product UX should be mobile-first and
Telegram-safe. The product model must still support future expansion beyond
Telegram.

### 43.3 Trust And Identity Before Jobs

Decision: Rostr starts with identity and trust, not vacancies.

Implication: vacancies are postponed and should not define the MVP.

### 43.4 Career Passport As Core Concept

Decision: Career Passport is the planned core artifact.

Implication: profile, verification, reputation and public sharing should align
around the passport.

### 43.5 Dual-Sided Employment Confirmation

Decision: employment history should be confirmed by both talent and agency.

Implication: verified history cannot be based on a single unverified claim.

### 43.6 Reputation From Verified Events

Decision: reputation should be based on verified facts and traceable career
events.

Implication: star ratings, anonymous reviews, popularity metrics and paid
reputation boosts are excluded.

### 43.7 Founder And Product Architect Own Product Behavior

Decision: product decisions belong to the founder and Product Architect.

Implication: Codex must not redefine product behavior without approval.

### 43.8 Codex Owns Implementation Quality

Decision: Codex owns implementation quality, tests, refactoring and Git
execution.

Implication: implementation prompts should be precise and reviewed against this
PRD and related product documents.

## 44. Appendix

### 44.1 Glossary

**Rostr** - a Telegram Mini App startup and trust layer for creator teams.

**Creator team** - a team or agency working around creator management and
related creator-economy operations.

**Talent** - a person working in or around creator management agencies. Initial
categories include chatters, recruiters and team leads.

**Agency** - a creator management agency or related organization that may
employ, contract with, manage or verify talent.

**Career Passport** - planned portable professional identity owned by talent.

**Verified career timeline** - planned structured history of career events with
verification status and source attribution.

**Career event** - a structured fact or change in professional history, such as
role held, work period, verification requested or verification accepted.

**Verification** - process for confirming a factual career claim. Verification
is not a review.

**Reputation** - product interpretation of verified career events. Reputation is
not a star rating, review score or paid boost.

**Public profile** - planned shareable surface of the Career Passport.

**Contact disclosure** - future policy-controlled process for revealing private
contact details. Not implemented.

### 44.2 Status Vocabulary

**Implemented** - exists in the current product.

**Implemented foundation** - a technical or product base exists, but full user
value is not complete.

**Partially implemented** - some supporting data or behavior exists, but not a
complete product capability.

**Planned** - expected product direction, not implemented yet.

**Proposed** - potentially useful, but not approved in detail.

**Planned (Post-MVP)** - planned after the MVP, not implemented yet.

**Planned (Postponed)** - planned only after prerequisite trust foundations or
new approval, not implemented yet.

**Proposed (Future)** - potentially useful future direction, not approved in
detail and not implemented.

**Open Question** - requires founder, Product Architect, legal or engineering
decision.

### 44.3 Legacy Documentation Note

Some implementation/runtime namespaces and historical notes may still use
`CreatorHire`. This PRD follows the confirmed Rostr direction: trust layer,
Career Passport, verified career timeline and vacancies postponed.

Those implementation/runtime namespaces should be renamed only through a
separate approved implementation task. This PRD should not be used to claim that
planned trust features are already implemented.

### 44.4 Implementation Handoff Rule

Before Codex implements work derived from this PRD, the implementation prompt
should identify:

- exact feature slice;
- status of the product decision;
- affected user role;
- acceptance criteria;
- data and privacy constraints;
- documentation updates required;
- tests expected;
- Git workflow expectations.

Codex should read `AGENTS.md`, `docs/MASTER_CONTEXT.md`,
`docs/CURRENT_SPRINT.md` and this PRD before implementing PRD-derived product
work.
