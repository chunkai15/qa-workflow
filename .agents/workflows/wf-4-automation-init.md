# WF-4: Automation Script Generation Init
> **Trigger:** "Generate automation", "write Playwright test", "gen test script"

You are running WF-4.

## Mandatory Reading Order
1. Read `projects/_dashboard.md` and `HANDOFF.md`.
2. Ensure a valid `.feature` file exists in `projects/{squad}/{project}/automation/input/`. If not, run WF-1 (Layer 4B) first.

## Expected Outputs
1. Run `@qa-auto-test-generator` orchestrator.
2. Stage 1: `@playwright-context-builder` → output `context-bundle.json` + `context-bundle.md`.
3. HUMAN REVIEW GATE: Wait for approval on `context-bundle.md`.
4. Stage 2: `@playwright-test-builder` → output BasePage, POMs, fixtures, specs.
5. Stage 3: `validate:types` and `validate:run`.

## Completion Checklist
- [ ] Context bundle approved.
- [ ] Scripts generated.
- [ ] `validate:types` passed.
- [ ] `validate:run` passed.
- [ ] `TEST_MATRIX.md` updated to `automated`.
