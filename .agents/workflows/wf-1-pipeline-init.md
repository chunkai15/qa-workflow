# WF-1: New Feature QA Pipeline Init
> **Trigger:** "I have a new spec", "run full pipeline", "write test cases", "start QA"

You are running WF-1.

## Mandatory Reading Order
1. Read `projects/_dashboard.md` and the project's `HANDOFF.md`.
2. Read the spec and any existing strategy docs (`strategy/high-level-strategy-analysis.md`).
3. Read `docs/QA_INTAKE.md` to check AC count (>20 → Epic split required) and choose Session Mode (S, M, L, XL).

## Response Discipline (pipeline-wide)
All analysis content → write to file silently. Chat output → compact gate summaries only.
- Layers 1–3 → `analysis.md` (create + append)
- Layer 4 → `regression-suite.md`
- Layer 5 → `test-cases/test-cases.md`

## Expected Outputs
1. Run `@qa-master-workflow` orchestrator.
2. If TEST_MATRIX.md is a stub → populate with ACs from spec FIRST.
3. `analysis.md` — Master Context + Strategy + Deep Analysis Package v3
4. `regression-suite.md` — Regression Suite (+ BDD Gherkin if requested)
5. `test-cases/test-cases.md` — 9-column TC tables

## Session Split (MODE M)
```
SESSION 1: L1 (@qa-context-builder) + L2 (@qa-strategy-decomposer) → analysis.md
SESSION 2: L3 (@qa-deep-analyzer) → analysis.md (appended)
SESSION 3: L4 (@qa-scenario-designer) + L5 (@qa-testcase-generator) → regression-suite.md + test-cases.md
SESSION 4: xlsx export (optional)
```
Apply Context Pruning Rule at each layer boundary (replace verbose content with compact tag).

## Completion Checklist
- [ ] AC count checked — ≤20 per Epic (or split confirmed)
- [ ] Layer outputs saved: analysis.md + regression-suite.md + test-cases/test-cases.md
- [ ] Context Pruning Rule applied at each layer boundary
- [ ] `validate:tc` completed successfully
- [ ] `TEST_MATRIX.md` coverage updated
- [ ] `HANDOFF.md` updated with session summary + decisions + next steps
- [ ] `_dashboard.md` updated if phase changed
