# Marketplace Login And Package Publish

## Summary
This feature package captures the existing marketplace login and package publishing automation flow that previously lived only in the legacy root `input/` and `output/` layout. It acts as the first pilot feature for the repo's hybrid structure and provides a safe working location for future QA analysis, test case writing, and automation regeneration.

## Status
- Feature status: analyzing
- QA status: seed-created
- Automation status: legacy-run-imported
- Priority: high

## Owners
- QA: Admin
- Automation: Admin
- BA/PO: unknown

## Quick Links
- Metadata: `meta/feature.yaml`
- Sources: `meta/sources.md`
- QA analysis: `qa/01-analysis/feature-analysis.md`
- Technical note: `docs/04-technical-solution/legacy-workflow-mapping.md`
- Feature file: `automation/input/marketplace-test.feature`
- Migrated run root: `automation/runs/2026-04-12_legacy-001/`
- Validation report: `automation/runs/2026-04-12_legacy-001/generated/validation-report.md`

## Scope
### In scope
- Basic-auth access to staging web app
- Coach login to preview dashboard
- Navigation to marketplace packages
- Create and publish a new package

### Out of scope
- Refund and package unpublish flows
- Seller management beyond create-and-publish

## Current Understanding
The existing pipeline already generated a usable suite for this flow and validated it with caveats. That historical run has now been migrated into this feature package so future QA notes, testcase work, and automation reruns can stay inside one feature-local workspace.

## Risks And Gaps
- The legacy root feature file still contains runtime secrets and should not be treated as a safe reusable source.
- Publish success relies on runtime-confirmed evidence that should be documented more explicitly in future context capture.
- Upload handling still depends on environment and file-access constraints.

## Recommended Reading Order
1. `meta/sources.md`
2. `docs/04-technical-solution/legacy-workflow-mapping.md`
3. `qa/01-analysis/feature-analysis.md`
4. `automation/input/marketplace-test.feature`
5. `automation/runs/2026-04-12_legacy-001/generated/validation-report.md`

## Workflow Notes
- Use this feature folder as the primary working root going forward.
- Prefer the normalized feature file in `automation/input/` over the legacy root file.
- Keep future automation outputs under `automation/runs/<run-id>/`.
- Treat `automation/runs/2026-04-12_legacy-001/` as the imported historical run.

## Latest Decisions
- 2026-04-12: `marketplace-test` is the pilot feature for the hybrid repo structure.
- 2026-04-12: New feature-local automation inputs use env placeholders instead of persisted secrets.
- 2026-04-12: The legacy run was migrated into `automation/runs/2026-04-12_legacy-001/`.
