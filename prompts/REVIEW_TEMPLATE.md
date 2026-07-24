# Review template

## Scope check

- Does the change stay within the approved task?
- Does product behavior match `docs/PRD.md`?
- Does it alter product behavior without founder/Product Architect approval?

## Correctness and safety

- Are server-side boundaries validated?
- Are secrets, PII and Telegram `initData` excluded from logs and Git?
- Are migrations additive and preserved?

## Quality

- Are types strict and free of unjustified `any`?
- Are tests and documentation proportionate to the change?
- Are planned features clearly labelled as unimplemented?

## Git readiness

- Is `git status` understood?
- Are staged files limited to the task scope?
- Is explicit approval present before commit or push?
