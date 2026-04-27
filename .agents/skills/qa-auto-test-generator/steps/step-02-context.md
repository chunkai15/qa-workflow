# Step 2: Context - Build the Stage 1 Bundle

## STEP GOAL

Produce a reliable Stage 1 context bundle by invoking `playwright-context-builder`.

## MANDATORY RULES

- Read this entire step before acting.
- Treat Stage 1 output as the only acceptable input to planning.
- If auth is broken, stop and report the auth blocker instead of guessing around it.
- If required env vars for live capture are missing, do not attempt a fake Stage 1 run.
- User-provided runtime credentials are sufficient for honest Stage 1 capture when their use has been explicitly allowed.
- **MANDATORY NAVIGATION CAPTURE**: Do not just record target URLs. You MUST record the UI navigation path (e.g., "Home -> Sidebar 'Booking' -> 'Session Types'") to handle SPA routing correctly.
- **MANDATORY STATE CAPTURE**: You MUST explicitly wait for and document any transient loading overlays, spinners, or "Getting data ready" screens that block interaction.
- **MANDATORY SELECTOR DEPTH**: Do not assume standard HTML tags (like `tr` or `ul`). You MUST inspect the actual DOM for complex grids (e.g., React Table `.rt-tr-group`) and document dynamic text patterns (e.g., `Connected \d+`).
- **MANDATORY BUSINESS CONSTRAINTS**: If an action is only valid for specific data states (e.g., "Issue credits only to Connected clients, not Offline"), you MUST document this rule and the visual identifiers for these states.

## ENTRY CRITERIA

- `run-manifest.json` exists.
- runtime inputs are resolved or explicitly blocked.

## EXIT CRITERIA

- `context-bundle.json` and `context-bundle.md` exist.
- all feature scenarios are represented.
- critical outcomes are classified, even when unresolved.

## ARTIFACTS

- `<output_dir>/context-bundle.json`
- `<output_dir>/context-bundle.md`

Preferred `output_dir` is the feature-local run root such as `features/<feature-key>/automation/runs/<run-id>/`.

## RESUME LOGIC

- if runtime inputs are missing, stop here and resume from Step 1 after manifest update
- if the bundle exists but omits scenarios or critical outcomes, rerun Step 2
- if the bundle is honest but partial, continue with gaps preserved

## VERIFY GATES

- `context-bundle.json` parses
- all scenarios from the feature appear in Stage 1 output
- `critical_outcomes` covers finalizing or business-critical steps
- critical outcomes are not silently omitted because capture was partial

---

## EXECUTION SEQUENCE

### 1. Invoke Stage 1 explicitly

Announce that Stage 1 is starting and that `playwright-context-builder` is the active worker for this step.

Before invocation, verify that required runtime inputs are available:

- auth env vars required by the run manifest
- any mandatory upload or fixture env vars

Equivalent runtime values from user-provided credentials or feature-provided inputs may satisfy this requirement.

If they are missing:

- stop this step
- report `BLOCKED_PENDING_ENV`
- name the missing inputs
- preserve the run manifest as the resumable artifact

Use `playwright-context-builder` with:

- `feature_file`
- `staging_url`
- `auth_config`
- expected artifact paths from the run manifest

`auth_config` may be sourced from:

- env vars
- direct user-provided credentials
- sanitized runtime mappings produced during intake

Suggested invocation framing:

`Use playwright-context-builder to build the Stage 1 bundle from <feature_file> against <staging_url> with the provided auth configuration. Write the outputs to <context-bundle.json> and <context-bundle.md>.`

Expected artifacts:

- `context-bundle.json`
- `context-bundle.md`

Do not perform Stage 2 generation logic in this step.

### 2. Verify minimum Stage 1 completeness

Confirm that the bundle includes:

- `meta`
- `page_inventory`
- `locator_map`
- `interaction_patterns` (MUST include loading spinners and wait-states)
- `coverage_gaps`
- `critical_outcomes`
- `navigation_flows` (Explicit UI click-paths to reach pages)

Prefer bundles that also include:

- `integration_hints`
- `required_human_checkpoints`
- `recommended_test_utilities`
- `page_state_hints`

### 3. Review early warnings

Surface before planning:

- low-confidence selectors
- unresolved dynamic captures
- auth-gated routes
- weak-selector-only captures (e.g., exact text matches on dynamic counters)
- business-critical actions that appear disabled or under-specified
- integrations likely required for the flow
- loading, iframe, alert, or intermediate-state classifications (e.g., persistent spinners)
- Non-standard DOM structures (e.g., div-based tables instead of <tr>)

### 4. Prepare the planning handoff

The planning step should receive:

- the bundle locations
- a concise summary of scenario coverage
- all high-risk gaps that may affect generation quality
- a statement that Stage 1 has completed and Stage 2 has not started

If the expected Stage 1 artifacts do not exist at the agreed paths, treat Stage 1 as incomplete.

---

## NEXT STEP

Read fully and follow: `./step-03-plan.md`
