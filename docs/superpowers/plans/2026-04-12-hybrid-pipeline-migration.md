# Hybrid Pipeline Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the repo workflow and pipeline conventions to use feature-local automation roots and migrate legacy run artifacts into the new layout.

**Architecture:** Add a small workspace layer in `src/pipeline/` that resolves feature-local paths and performs legacy-run migration, then wire it into a real `run-pipeline.ts` CLI entrypoint. Update workflow docs so all orchestrator and worker skills prefer `features/<feature-key>/automation/...` and treat root `input/` and `output/` as removable legacy layout.

**Tech Stack:** TypeScript, Vitest, Markdown, JSON

---

### Task 1: Lock expected hybrid behavior with tests

**Files:**
- Create: `tests/pipeline/gherkin.test.ts`
- Create: `tests/pipeline/workspace.test.ts`
- Create: `tests/pipeline/migration.test.ts`

- [ ] Write a failing parser test for the current `gherkin.ts` implementation.
- [ ] Write failing workspace tests for feature-local run path resolution.
- [ ] Write failing migration tests for moving a legacy run into `features/<feature-key>/automation/runs/`.

### Task 2: Implement hybrid workspace support

**Files:**
- Create: `src/pipeline/workspace.ts`
- Create: `src/pipeline/migration.ts`
- Modify: `src/pipeline/gherkin.ts`
- Modify: `src/pipeline/types.ts`

- [ ] Fix the Gherkin parser for the installed package versions.
- [ ] Add path resolution helpers for feature-local automation inputs and run roots.
- [ ] Add a migration helper that copies legacy run artifacts and rewrites manifest paths to the new location.

### Task 3: Restore a usable pipeline entrypoint

**Files:**
- Create: `run-pipeline.ts`

- [ ] Add a CLI entrypoint for workspace inspection and legacy migration.
- [ ] Make `npm run pipeline` point to a real file again.

### Task 4: Update workflow docs to the new layout

**Files:**
- Modify: `.agents/skills/qa-auto-test-generator/workflow.md`
- Modify: `.agents/skills/qa-auto-test-generator/steps/step-01-intake.md`
- Modify: `.agents/skills/qa-auto-test-generator/steps/step-02-context.md`
- Modify: `.agents/skills/qa-auto-test-generator/steps/step-03-plan.md`
- Modify: `.agents/skills/qa-auto-test-generator/steps/step-04-generate.md`
- Modify: `.agents/skills/playwright-context-builder/SKILL.md`
- Modify: `.agents/skills/playwright-test-builder/SKILL.md`

- [ ] Switch default examples and artifact conventions to `features/<feature-key>/automation/...`.
- [ ] Keep legacy references only as migration notes, not as the primary contract.

### Task 5: Migrate the existing marketplace legacy run

**Files:**
- Create: `features/marketplace-test/automation/runs/<run-id>/...`
- Modify: `features/marketplace-test/README.md`
- Modify: `features/marketplace-test/meta/feature.yaml`
- Modify: `features/marketplace-test/meta/sources.md`

- [ ] Copy the existing `output/marketplace-test` run into the feature-local run root.
- [ ] Point feature metadata at the migrated run instead of the legacy output folder.
- [ ] Keep traceability notes for the historical source path.
