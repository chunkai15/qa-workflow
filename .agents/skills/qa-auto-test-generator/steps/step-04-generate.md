# Step 4: Generate - Build the Stage 2 Playwright Suite

## STEP GOAL

Generate the Playwright suite by invoking `playwright-test-builder` with a reviewed Stage 1 bundle.

## MANDATORY RULES

- Read this entire step before acting.
- Use the reviewed context bundle and planning decisions as the generation contract.
- Do not silently drop risky or unresolved items from generated output.
- **DEFENSIVE NAVIGATION**: All page navigations MUST account for loading overlays or spinners documented in Stage 1. Generate explicit `waitFor` statements for these states before interacting.
- **ROBUST LOCATORS**: Ban the use of `.first()` without strong business-logic filtering (e.g., filter by "Connected" status before taking the first client). 
- **LOCATOR PREFERENCE**: Prefer `getByRole`, `getByLabel`, or `getByText(text, { exact: false })` (or Regex) over strict CSS selectors or exact text matches, especially for dynamic lists.

## ENTRY CRITERIA

- approved `generation-plan.json` exists.

## EXIT CRITERIA

- expected generated files exist in the approved suite root.
- critical scenarios have assertion strategy or explicit unresolved markers.

## ARTIFACTS

- `<suite_root>/pages/BasePage.ts`
- `<suite_root>/pages/*Page.ts`
- `<suite_root>/fixtures/index.ts`
- `<suite_root>/tests/*.spec.ts`
- `<suite_root>/validation-report.md`

## RESUME LOGIC

- if the plan changed, regenerate from Step 4 using the latest `generation-plan.json`
- if generation cannot satisfy plan gates, route back to Step 3
- do not route to Step 5 until the expected file set exists

## VERIFY GATES

- Stage 2 reads `generation-plan.json`
- generated specs preserve critical scenario intent
- each critical scenario has an assertion path or explicit unresolved marker
- generated output stays inside the approved suite root

---

## EXECUTION SEQUENCE

### 1. Invoke Stage 2 explicitly

Announce that Stage 2 is starting and that `playwright-test-builder` is the active worker for this step.

Use `playwright-test-builder` with:

- `context_bundle_json`
- `context_bundle_md`
- `generation_plan_json`
- `output_dir`
- `staging_url`
- `auth_config`
- approved planning notes

Suggested invocation framing:

`Use playwright-test-builder to generate the Stage 2 Playwright suite from <context_bundle_json> and <context_bundle_md> into <output_dir> for <staging_url> using the provided auth configuration.`

Preferred `output_dir` is the feature-local run root. Stage 2 should normally generate into `<output_dir>/generated/`.

Do not re-run Stage 1 in this step unless the planning step explicitly sent the workflow back.

### 2. Preserve planning decisions

Ensure Stage 2 respects the plan:

- keep BDD sections visible in generated specs
- emit precondition or readiness checks for critical actions (e.g. `await page.locator('text=Getting your data ready').waitFor({ state: 'hidden' });`)
- preserve low-confidence warnings
- represent required human checkpoints honestly
- add helper hooks only when justified by the bundle
- Apply business rule constraints directly into POM locators (e.g. finding a specific row state before acting).

### 3. Confirm generated artifact set

Expected outputs:

- `pages/BasePage.ts`
- `pages/*Page.ts`
- `fixtures/index.ts`
- `tests/*.spec.ts`
- `validation-report.md`

Unless the plan says otherwise, expect these under the agreed Stage 2 suite root.

Optional outputs when justified:

- focused helper files
- auth fixtures
- integration stubs
- small utility modules

### 4. Prepare validation input

Hand off:

- generated file list
- known risky scenarios
- low-confidence locator summary
- integration-related notes
- any preserved `NEEDS_HUMAN_REVIEW` markers

---

## NEXT STEP

Read fully and follow: `./step-05-validate.md`
