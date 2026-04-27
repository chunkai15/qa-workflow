# Step 5: Validate - Verify, Classify, and Deliver

## STEP GOAL

Run explicit post-generation validation and report the true readiness of the generated suite.

## MANDATORY RULES

- Read this entire step before acting.
- Do not claim success without running validation.
- Classify failures by cause when possible.
- Separate selector problems from business-rule or environment blockers.

## ENTRY CRITERIA

- generated suite exists.

## EXIT CRITERIA

- `validation-report.md` exists.
- validation tiers have explicit statuses.

## ARTIFACTS

- `<suite_root>/validation-report.md`

## RESUME LOGIC

- if generated files are missing, return to Step 4
- if validation exposes plan or oracle gaps, route to Step 3
- if validation exposes Stage 1 omissions, route to Step 2
- if validation is structurally acceptable but runtime proof is still needed, continue to Step 6

## VERIFY GATES

- validation reports static, selector, and semantic tier status separately
- semantic coverage cannot be `complete` if any critical end-state lacks a verified oracle
- validation includes a critical outcome matrix
- failures are classified, not left as generic pass/fail

---

## EXECUTION SEQUENCE

### 1. Run validation

Validation must cover:

1. static analysis
2. selector verification
3. semantic coverage

Use the generated `validation-report.md` as a required artifact, not an optional summary.

Validation consumes the Stage 2 outputs. Do not invoke `playwright-context-builder` in this step.
If validation shows Stage 1 quality was insufficient, report that explicitly as a workflow finding.
If `validation-report.md` is missing, treat Stage 2 as incomplete rather than silently continuing.

### 2. Classify failures

When validation fails, classify issues where possible:

- `selector_issue`
- `selector_ambiguity`
- `timing_issue`
- `navigation_issue`
- `auth_issue`
- `business_rule_issue`
- `integration_required`
- `environment_issue`
- `requires_human_review`
- `oracle_missing`
- `feature_mismatch`
- `resolved_via_runtime_debug`

Examples:

- found-but-disabled publish button -> `business_rule_issue`
- missing locator even after fallback -> `selector_issue`
- OTP, email verification, or payment dependency -> `integration_required`

### 3. Decide next action

If issues are safe and local, allow limited auto-fix or regeneration attempts.

If issues are structural, stop and report clearly:

- Stage 1 context insufficient
- generation assumptions too weak
- business rule not inferable from context
- manual review required
- required runtime env missing for full validation

When regeneration is required:

- return to Stage 3 if the plan was wrong
- return to Stage 2 (Context) if the bundle was insufficient
- stay in validation only for purely local verification reruns

### 4. Produce the delivery summary

Summarize:

- what was generated
- what passed
- what failed
- failure taxonomy
- low-confidence areas still present
- next recommended action

The summary must make it obvious whether the output is:

- ready to use
- usable with caveats
- blocked pending review or enrichment
- blocked pending environment setup

Critical outcome matrix expectations:

- list each critical end-state from Stage 1 or the plan
- show the expected oracle
- show whether generated assertions prove it
- mark unresolved items explicitly

---

## WORKFLOW COMPLETE

At this point the workflow has produced:

- a reviewed Stage 1 context bundle
- a planned generation scope
- a generated Playwright suite
- an explicit validation outcome
