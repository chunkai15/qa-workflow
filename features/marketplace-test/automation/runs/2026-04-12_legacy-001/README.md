# marketplace-test

Imported historical run stored under the feature-local automation layout.

Workflow: `qa-auto-test-generator`

Current status: `USABLE_WITH_CAVEATS`

Artifacts present or expected in this run root:

- `run-manifest.json`
- `.env.example`
- `context-bundle.json`
- `context-bundle.md`
- `generated/`
- `generated/validation-report.md`
- `generation-plan.json` (placeholder added during migration when missing)
- `generated/execution-report.md` (placeholder added during migration when missing)
- `generated/execution-report.json` (placeholder added during migration when missing)

Secret handling:

- Runtime credentials may be used during capture and validation.
- Raw secrets must not be written to persistent artifacts.

Migration note:

- This run was copied from the legacy root layout on 2026-04-12 and normalized to feature-local artifact paths.
