# Sources

## Source Model
This feature uses a hybrid source model.

## Canonical External Sources
- Confluence:
  - Unknown
- Jira:
  - Unknown
- Figma:
  - Unknown

## In-Repo Working Documents
- Feature overview: `README.md`
- Technical mapping note: `docs/04-technical-solution/legacy-workflow-mapping.md`
- QA analysis: `qa/01-analysis/feature-analysis.md`
- Normalized automation input: `automation/input/marketplace-test.feature`
- Migrated run manifest: `automation/runs/2026-04-12_legacy-001/run-manifest.json`
- Migrated validation report: `automation/runs/2026-04-12_legacy-001/generated/validation-report.md`

## Legacy Imported Sources
- Root feature file with runtime credentials: `../../input/marketplace-test.feature`
- Original run location before migration: `output/marketplace-test/`

## Source Handling Rules
- Prefer feature-local working documents when updating QA analysis, test cases, and future automation inputs.
- Use migrated run artifacts inside `automation/runs/` as historical evidence.
- Do not copy raw secrets from the legacy feature file into new persistent artifacts.
- Record source conflicts or newly discovered canonical docs in `docs/08-decisions/` or `qa/05-notes/`.

## Known Source Gaps
- No canonical PRD or functional spec has been linked yet.
- The legacy flow proves automation viability but does not replace product documentation.

## Last Reviewed
- Date: 2026-04-12
- Reviewed by: Codex
