# Step 1: Intake - Confirm Inputs and Run Manifest

## STEP GOAL

Define a clean run manifest before any browsing, context capture, or code generation starts.

## MANDATORY RULES

- Read this entire step before acting.
- Do not jump to context capture until inputs are normalized.
- Treat the `.feature` file as the source of truth for scenario intent.

## ENTRY CRITERIA

- `feature_file` is known.

## EXIT CRITERIA

- `run-manifest.json` exists.
- `.env.example` exists when runtime placeholders are needed.
- runtime inputs are normalized without persisting raw secrets.

## ARTIFACTS

- `<output_dir>/run-manifest.json`
- `<output_dir>/.env.example`
- optional `<output_dir>/README.md`

## RESUME LOGIC

- if inputs changed, rewrite `run-manifest.json` before continuing
- if manifest exists but runtime mapping is incomplete, stay in Step 1
- if manifest is usable, continue to Step 2

## VERIFY GATES

- manifest contains normalized runtime input mapping
- output paths for Stage 1, Stage 2, and Step 6 reports are defined
- raw credentials are masked or placeholder-backed in persistent artifacts

---

## EXECUTION SEQUENCE

### 1. Confirm required inputs

Collect or confirm:

- `feature_file`
- `staging_url`
- `auth_config` if applicable
- `output_dir`

If `output_dir` is not provided, derive it from the feature filename:

- `features/foo/automation/input/foo.feature` -> `features/foo/automation/runs/<run-id>/`

If the caller still provides a legacy root feature path such as `input/foo.feature`, treat it as migration input and prefer converting the run to the feature-local layout before future executions.

Useful auth examples:

- browser basic auth
- app credentials
- cookie or token
- storage state

If the user has explicitly provided credentials and allowed their use, treat them as available runtime inputs even if no env vars are set yet.

### 2. Parse setup intent from the feature

Before invoking Stage 1, extract any setup clues from the feature:

- login credentials mentioned in prose
- browser basic auth requirements
- upload directories or fixtures
- random-data requirements
- risky or high-friction steps

If the feature includes real-looking secrets or credentials:

- do not copy them into generated test code or persistent docs
- convert them into env-var placeholders in the run manifest
- record a sanitized mapping such as `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`, `TEST_EMAIL`, `TEST_PASSWORD`
- if the user has allowed their use, keep a runtime-only internal mapping so Stage 1 can continue without blocking on env setup

### 3. Create the workflow run manifest

Create an internal manifest that tracks:

- feature path
- target environment
- auth strategy
- output directory
- expected context bundle location
- expected generated suite location
- validation scope
- env-var placeholders required for execution
- whether credentials are available at runtime from direct user input

Preferred manifest targets:

- `<output_dir>/run-manifest.json`
- `<output_dir>/README.md`
- `<output_dir>/.env.example`

Preferred manifest fields:

- `feature_file`
- `staging_url`
- `auth_config`
- `runtime_input_mapping`
- `artifact_paths`
- `status`
- `blocked_before`
- `next_step`

### 4. Report readiness

Summarize:

- feature under test
- target environment
- auth approach
- output location
- next step: Stage 1 context capture

The readiness summary should make the Stage 1 handoff obvious:

- worker: `playwright-context-builder`
- input feature path
- target bundle paths

If required env-backed auth or fixture inputs are missing, report:

- status: `BLOCKED_PENDING_ENV`
- blocked_before: `Step 2 - Context`
- required env vars
- whether the run manifest is still ready for later execution

Do not report `BLOCKED_PENDING_ENV` if the same runtime inputs are already available from user-provided credentials or paths that the workflow is allowed to use.

When env-backed inputs are required, also prepare a minimal `.env.example` in the run root with placeholder keys for later execution.

---

## NEXT STEP

Read fully and follow: `./step-02-context.md`
