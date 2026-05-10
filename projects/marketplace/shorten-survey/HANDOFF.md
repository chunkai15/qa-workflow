---
feature: "shorten-survey"
squad: "marketplace"
last_updated: "2026-05-05"
last_agent: "claude"
phase: "spec-ready"
blocked: false
---

# Handoff — Shorten Onboarding Survey

## Current State

Phase: `spec-ready` | Last session: `2026-05-05` by `claude`

Multiple spec sources exist (spec.md, spec-birthday-change.md, master analysis). Has test cases xlsx but no formal QA analysis. Was previously `Shorten-11-questions`.

## Next Immediate Action

> **Do this first:** Read `analysis.md` (migrated from Codex's `master-spec-analyst.md`) — check if it qualifies as MASTER CONTEXT (needs: module breakdown, risk areas, acceptance criteria mapping). If insufficient → run `qa-context-builder` on `spec.md` to regenerate.

**Primary spec is `spec.md`** (shorter survey). `spec-birthday-change.md` and `spec-original.md` are supplementary. PDFs are visual-only Figma exports.

## What Was Done (Last Session)

- Migrated from `features/Shorten-11-questions/` to `projects/marketplace/shorten-survey/`
- Renamed for clean kebab-case convention
- Flattened: multiple specs at root, PDFs preserved, epic snapshots kept

## Decisions Made

| Decision | Reasoning | Date |
|---|---|---|
| Keep `change-birthdate` as separate project | Different spec scope, but may merge later (same epic) | 2026-05-05 |
| Preserve PDFs in project folder | Original Figma exports, useful as visual reference | 2026-05-05 |

## Open Issues

- Multiple spec files need consolidation or at least a clear "primary spec" designation
- `analysis.md` is actually `master-spec-analyst.md` from Codex — review if it's a proper MASTER CONTEXT
- `change-birthdate` may need to be merged into this project
- `migrate_codex_threads_provider.py` was in old folder — NOT migrated (unrelated utility)

## Next Steps (after immediate action)

1. If analysis regenerated → run `qa-scenario-designer` for scenarios
2. Then `qa-testcase-generator` for detailed TCs
3. Decide whether to merge `change-birthdate` into this project (same epic)
4. Extract test cases from xlsx to markdown if needed

## Key Files

| File | Purpose | Agent-readable? |
|---|---|---|
| `spec.md` | **Primary spec** (shorter survey) | Yes |
| `spec-birthday-change.md` | Supplementary: birthday change | Yes |
| `spec-original.md` | Supplementary: original combined spec | Yes |
| `analysis.md` | Codex analysis (**needs quality review**) | Yes |
| `solution-design.md` | Technical solution design | Yes |
| `data-flow.md` | Backend data flow | Yes |
| `test-cases/shorten-11-questions-test-cases.xlsx` | Existing test cases | No (xlsx) |
| `MP-9775-epic-snapshot.md` | Jira epic context | Yes |
| `MP-9788-epic-snapshot.md` | Jira epic context | Yes |

## Session History

| Date | Agent | Summary |
|---|---|---|
| 2026-05-05 | claude | Migrated to squad-based structure, renamed from Shorten-11-questions |
