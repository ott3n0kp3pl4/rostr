# Repository Operating Rules

## Required start for every task

Before planning or changing files, read in this order:

1. `AGENTS.md`;
2. `docs/MASTER_CONTEXT.md`;
3. `docs/CURRENT_SPRINT.md`;
4. for product-related work, `docs/PRD.md`.

Then run `git status --short` and read the documents relevant to the task.
`docs/PRD.md` is the main product source of truth for product requirements,
product scope and product decisions. Product behavior is owned by the founder
and Product Architect; Codex must not redefine it without explicit approval.

## Git workflow

1. Before starting a task, complete the required reading above and check
   `git status --short`; do not include unrelated changes in the work.
2. After implementation, update the documentation relevant to the task and run
   the appropriate checks.
3. When changes are ready, stage only files in the task scope and show the user
   `git status`, staged `git diff --stat` and the staged file list.
4. Do not commit, rewrite published history or push without explicit user
   approval. After an approved commit, show the commit hash and wait for a
   separate approval before push.
5. Do not change remotes, default branch, `.gitignore` or Git configuration
   without an explicit task or approval.

## Engineering rules

1. Before changes, read `README.md` and the task-relevant documents in `docs/`.
2. If a task changes product behavior, validate it against `docs/PRD.md` and
   document the decision in `docs/DECISIONS.md` when it is durable.
3. Do not change architecture silently: record substantial architecture
   decisions in `docs/DECISIONS.md` and update affected documentation.
4. Do not add dependencies without need; prefer the standard capabilities of
   the current stack.
5. Do not use `any` without a documented reason. Keep strict typing at API and
   domain boundaries.
6. After changes, run relevant `pnpm lint`, `pnpm typecheck` and tests. Do not
   claim they passed if they were not run.
7. Never delete or rewrite applied migrations. Create a new migration for schema
   changes.
8. Do not weaken Telegram `initData` validation, access control, PII controls or
   rate limiting for speed.
9. Implement only features in the current task. Do not add chat, payments, AI
   matching or adult-content features without a separate decision.
10. Preserve REST API compatibility or explicitly document a breaking change,
    API version and migration plan.
11. Store dates in UTC, do not commit secrets and do not log `initData`, tokens
    or contact data.
