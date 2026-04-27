# Step 6: Execute, Debug, and Repair

## STEP GOAL

Run the generated suite against the real feature flow, classify runtime failures, apply bounded local-safe repairs, and persist the result.

## MANDATORY RULES

- Read this entire step before acting.
- Use feature intent, Stage 1 `critical_outcomes`, and `generation-plan.json` as runtime truth.
- Keep Step 6 focused on runtime feature alignment, not structural regeneration.
- Do not change feature intent, invent business behavior, or bypass the user flow.
- **MANDATORY DOM INSPECTION**: If a test fails due to a `timeout` or `selector_issue`, the Healer worker MUST actively inspect the live DOM (e.g., using a browser subagent or equivalent MCP tool) to identify the correct selector or loading state before applying a repair. Do not guess blindly.

## ENTRY CRITERIA

- the suite is executable
- Step 5 validation is complete enough for runtime execution

## EXIT CRITERIA

- at least one real feature-aligned run completed
- execution result is classified and persisted

## ARTIFACTS

- `<suite_root>/execution-report.md`
- `<suite_root>/execution-report.json`
- optional `<suite_root>/repair-log.md`

## RESUME LOGIC

- if execution cannot start because runtime inputs are wrong, return to Step 1
- if failures trace back to missing Stage 1 evidence, return to Step 2
- if failures trace back to missing or wrong oracle policy, return to Step 3
- if failures are structural generation issues, fix in Step 5 first
- if a bounded repair succeeds, rerun only affected execution targets

## VERIFY GATES

- at least one execution target from `generation-plan.json` ran for real
- failures are classified by runtime cause
- repairs stay within the approved repair policy
- no scenario exceeds 2 repair rounds per failure class

---

## EXECUTION SEQUENCE

### Run

- execute the generated tests tied to `execution_targets`
- use real runtime inputs allowed by the workflow
- record which scenarios, browsers, and inputs actually ran

### Diagnose

Classify runtime failures. **MANDATORY**: Sử dụng skill `systematic-debugging` để tạo bản phân tích nguyên nhân gốc rễ (Hypothesis-driven debugging).

Các loại lỗi phổ biến:
- `selector_issue`
- `timing_issue`
- `focus_or_state_loss` (e.g., focus moved, React state reset)
- `navigation_issue`
- `business_rule_issue`
- `environment_issue`
- `feature_mismatch`
- `oracle_missing`

### Repair

Invoke the `playwright-test-healer` worker to diagnose and fix failing tests dynamically using the **Playwright MCP Server**.

**Crucial Healer Policy**: If the failure is a Timeout or Selector Not Found, the Healer MUST execute a DOM inspection (e.g., opening the page, reproducing the steps, and querying the actual DOM structure) to find the delta before applying a fix.

Allowed bounded repairs (enforced by Healer):

- selector promotion (based on ACTIVE DOM INSPECTION)
- readiness waits (adding `waitFor` for spinners/overlays discovered during failure)
- assertion upgrade from runtime evidence
- runtime input normalization

Not allowed:

- changing feature intent
- inventing business behavior
- bypassing the user flow
- repeated speculative repair loops

Bound:

- max 2 repair rounds per scenario or failure class

### Re-verify

- **MANDATORY**: Sử dụng skill `verification-before-completion`.
- Rerun tests với flag `--repeat-each 3` để đảm bảo tính ổn định.
- Persist final status as `passed`, `passed_with_repairs`, `blocked`, or `failed`.
- Record any issue resolved as `resolved_via_runtime_debug`.

---

## WORKFLOW COMPLETE

At this point the workflow has:

- validated suite quality in Step 5
- executed at least one real feature-aligned target in Step 6
- persisted runtime proof, failure classification, and bounded repair history
