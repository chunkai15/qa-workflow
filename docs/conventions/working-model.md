# Working Model

## Default Rules

- Start feature work inside `features/<feature-key>/`.
- Put reusable cross-feature knowledge in `knowledge/`.
- Put raw imported files in `intake/`, then normalize them into the owning feature folder when needed.
- Put reusable document skeletons in `templates/`.
- Keep pipeline logic and skill behavior in `src/` and `.agents/skills/`.
- Treat root `input/` and `output/` as migration-only and avoid creating new artifacts there.

## Feature Rules

- Every feature should have `README.md`, `meta/feature.yaml`, and `meta/sources.md`.
- Prefer numeric prefixes under `docs/` and `qa/` when order matters.
- Keep unresolved assumptions, source conflicts, and coverage gaps visible instead of silently resolving them.

## Automation Rules

- Keep `.feature` files under `features/<feature-key>/automation/input/` when creating new work.
- Store run artifacts under `features/<feature-key>/automation/runs/<run-id>/`.
- Do not overwrite previous run folders.
- Keep secrets out of persistent docs and generated artifacts.

## Retrieval Order For Skills

When a skill needs context, prefer this order:

1. `features/<feature-key>/meta/feature.yaml`
2. `features/<feature-key>/README.md`
3. `features/<feature-key>/docs/**`
4. `features/<feature-key>/qa/**`
5. `knowledge/**`
6. `templates/**`

## When To Use `knowledge/`

Use `knowledge/` only if the content is reusable across multiple features. If the content is mainly about one feature, keep it in that feature folder.
