# Step 3: Plan - Review Context Before Generation

## STEP GOAL

Turn the Stage 1 bundle into a generation plan that is explicit, reviewable, and honest about risk.

## MANDATORY RULES

- Read this entire step before acting.
- Do not generate tests before this review is complete.
- Planning must evaluate both coverage and generation risk.

## ENTRY CRITERIA

- a valid Stage 1 bundle exists.

## EXIT CRITERIA

- `generation-plan.json` exists.
- critical end-states have required success oracles or explicit review markers.

## ARTIFACTS

- `<output_dir>/generation-plan.json`

## RESUME LOGIC

- if Stage 1 is malformed or omits critical outcomes, route back to Step 2
- if the plan exists but lacks oracle or execution decisions, stay in Step 3
- only advance when `generation-plan.json` is the agreed handoff

## VERIFY GATES

- plan declares required success oracles for critical end-states
- validation expectations are explicit
- execution targets and repair policy are defined
- core decisions are stored in JSON, not prose only

---

## EXECUTION SEQUENCE

### 1. Present context coverage summary

Summarize:

- feature name
- scenarios discovered
- pages/routes covered
- number of locator entries
- low-confidence selector count
- coverage gap count

For each important page, present:

- route or URL
- page type when available
- notable elements captured
- critical actions
- warnings

### 2. Present risk and gap summary

Highlight:

- `weak_selector_only`
- unresolved dynamic triggers
- required human checkpoints
- integration hints
- business-rule ambiguity
- auth or environment blockers

### 3. Present generation plan

Define what Stage 2 is expected to generate:

- `pages/BasePage.ts`
- `pages/*Page.ts`
- `fixtures/index.ts`
- `tests/*.spec.ts`
- `validation-report.md`
- `execution-report.md`
- `execution-report.json`

Define where Stage 2 should write:

- default suite root: `<output_dir>/generated/`
- in this repo, prefer `features/<feature-key>/automation/runs/<run-id>/generated/`

State explicitly that the next step will invoke `playwright-test-builder` with:

- `context_bundle_json`
- `context_bundle_md`
- `output_dir`
- `staging_url`
- `auth_config`
- approved planning notes

Also define generation expectations:

- preserve BDD comments
- emit readiness checks before critical actions
- surface low-confidence locators in code comments or validation notes
- generate hooks for integration hints when justified

The official handoff artifact is `generation-plan.json` with at least:

- `approved`
- `suite_root`
- `required_success_oracles`
- `validation_expectations`
- `execution_targets`
- `repair_policy`
- `needs_human_review`

### 4. Define validation expectations

Before generation starts, set the validation bar:

- static analysis required
- selector verification required
- semantic coverage required
- failures must be classified, not just listed

### 5. Finalize the plan

The plan output should be concrete enough that Stage 2 can execute without re-deciding core assumptions.

The final planning handoff should include:

- approved bundle paths
- output directory
- generation expectations
- validation expectations
- any explicit `NEEDS_HUMAN_REVIEW` markers to preserve in generated output
- the exact Stage 2 suite root
- runtime execution targets for Step 6

If the context bundle is too incomplete, stop here and report that Stage 1 needs improvement instead of generating brittle code.

---

## NEXT STEP

Read fully and follow: `./step-04-generate.md`
