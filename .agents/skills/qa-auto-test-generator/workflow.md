# qa-auto-test-generator Workflow

**Goal:** Turn a `.feature` file into a reviewable, generated, and validated Playwright automation package by coordinating Stage 1 context capture and Stage 2 suite generation.

**Your Role:** You are the workflow orchestrator. Keep the process disciplined, explicit, and reviewable. Use the downstream skills for their intended responsibilities and do not collapse all logic into one step.

---

## WORKFLOW ARCHITECTURE

This workflow uses micro-file architecture, but the workflow is BDD-first rather than page-first.

### Core Principles

- **Feature-first**: The feature folder is the working context, and the `.feature` file inside `features/<feature-key>/automation/input/` is the source of truth for automation intent.
- **Stage separation**: Context capture, planning, generation, and validation stay distinct.
- **Review gates**: Planning and validation are explicit workflow steps.
- **Runtime proof boundary**: Suite-quality validation and feature-aligned execution are separate steps.
- **Honest automation**: Surface gaps, weak selectors, and business blockers instead of guessing.
- **Composable workers**: Use `playwright-context-builder` and `playwright-test-builder` as workers, not as optional suggestions.
- **Explicit invocation**: Each worker must be invoked only in its designated step with clear handoff artifacts.
- **Artifact convention**: Every run should use a predictable output folder and file contract.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the full current step before acting.
2. **FOLLOW SEQUENCE**: Execute steps in order unless the current step explicitly loops back.
3. **DON'T SKIP GATES**: Do not bypass planning or validation.
4. **KEEP OUTPUTS TRACEABLE**: Every stage should produce artifacts that the next stage can consume.

### Critical Rules

- Never generate test scripts before the planning step has reviewed the context bundle.
- Never report completion before the validation step has been executed.
- Never hide low-confidence selectors, unresolved dynamic captures, or business-rule blockers.
- Prefer reusing the outputs of Stage 1 and Stage 2 over re-inventing the workflow inline.
- Never invoke `playwright-test-builder` before `playwright-context-builder` has produced a usable bundle.
- Never invoke Stage 2 with an unreviewed or malformed Stage 1 bundle.
- Never persist raw secrets from a `.feature` file into generated artifacts. Move them to env-var placeholders.
- If required environment inputs for live capture are missing, stop with a clear blocked status rather than pretending Stage 1 ran.
- If the user explicitly provides credentials and allows them to be used, treat them as valid runtime inputs and continue the workflow without requiring separate env setup first.
- Do not mark semantic coverage complete when a critical end-state lacks a verified oracle.

## WORKER INVOCATION PROTOCOL

Use worker skills as explicit sub-workflows inside the current session.

### Stage 1 worker

Invoke `playwright-context-builder` by giving it:

- the feature file path
- the staging URL
- the auth configuration
- the expected Stage 1 artifact targets

Required Stage 1 completion signal:

- `context-bundle.json` exists at the agreed path
- `context-bundle.md` exists at the agreed path
- the bundle includes the minimum required sections
- the bundle classifies `critical_outcomes` for every finalizing or business-critical step

### Stage 2 worker

Invoke `playwright-test-builder` by giving it:

- `context-bundle.json`
- `context-bundle.md`
- `generation-plan.json`
- the output directory for the generated suite
- the staging URL
- the auth configuration
- the approved planning expectations

Required Stage 2 completion signal:

- generated suite files exist at the agreed paths
- `validation-report.md` exists
- low-confidence or unresolved items remain visible in code or reporting
- critical end-states have asserted or explicitly unresolved oracle handling

## DEFAULT ARTIFACT CONVENTION

Unless the user or repo already defines a better convention, derive the run root from the feature folder:

- feature: `features/marketplace-test/automation/input/marketplace-test.feature`
- run root: `features/marketplace-test/automation/runs/<run-id>/`

Within the run root, prefer:

- `run-manifest.json`
- `.env.example`
- `context-bundle.json`
- `context-bundle.md`
- `generation-plan.json`
- `generated/` for Stage 2 suite output
- `generated/data/test-data.ts` for data mapping

Within the Stage 2 suite root, prefer:

- `validation-report.md`
- `execution-report.md`
- `execution-report.json`

Required workflow artifacts:

- `run-manifest.json`
- `context-bundle.json`
- `context-bundle.md`
- `generation-plan.json`
- `generated/validation-report.md`
- `generated/data/test-data.ts`
- `generated/execution-report.md`
- `generated/execution-report.json`

Legacy note:

- older runs may still exist under `output/<feature-name>/`
- migration should move those runs into `features/<feature-key>/automation/runs/<run-id>/` before legacy root folders are removed

## BLOCKED-STATE POLICY

This workflow is allowed to stop early with an honest blocked result when critical runtime inputs are missing.

Typical blockers:

- required auth env vars not set
- required upload fixture directory unavailable
- no reliable Stage 1 browser access
- missing repo execution entrypoints needed by the agreed validation path

Do not treat missing env vars as a blocker when equivalent runtime credentials are already available from the user input or feature content and the user has allowed their use.

When blocked:

- still write the run manifest
- still summarize what is known from the feature
- state the earliest blocked step explicitly
- do not fabricate downstream outputs

## RESUME ROUTING

- blocked before context: resume from Step 1 or Step 2 using `run-manifest.json`
- context insufficient: route back to Step 2
- plan insufficient: route back to Step 3
- structural generation or validation failure: resolve in Step 5 before runtime execution
- runtime-verifiable uncertainty: route to Step 6

## RUNTIME SECRET POLICY

This workflow may use credentials at runtime when they are explicitly provided by the user or clearly embedded in the feature input and the user has allowed their use.

Allowed:

- use provided credentials for browser basic auth
- use provided credentials for in-app login
- use provided local paths for uploads
- normalize provided values into the run manifest as masked or placeholder-backed runtime fields

Not allowed:

- writing raw secrets into generated test code
- writing raw secrets into `context-bundle.json`
- writing raw secrets into `context-bundle.md`
- writing raw secrets into `validation-report.md`
- writing raw secrets into persistent documentation artifacts

---

## WORKFLOW STEPS

### Step 1: Intake (`step-01-intake.md`)
- Confirm the feature file and environment inputs
- Normalize auth and output configuration
- Define the workflow run manifest

### Step 2: Context (`step-02-context.md`)
- Run Stage 1 using `playwright-context-builder`
- Produce `context-bundle.json` and `context-bundle.md`
- Surface early coverage gaps and risky flow hints

### Step 3: Plan (`step-03-plan.md`)
- Review context quality before code generation
- Summarize coverage, gaps, risk, and generation scope
- Finalize `generation-plan.json` and validation expectations

### Step 4: Generate (`step-04-generate.md`)
- Run Stage 2 using `playwright-test-builder`
- Generate pages, fixtures, specs, AND a `data/test-data.ts` file for business parameters
- Preserve planning decisions in the generated output

### Step 5: Validate (`step-05-validate.md`)
- Run explicit suite-quality validation after generation
- Classify structural and semantic issues before runtime execution
- Produce `generated/validation-report.md`

### Step 6: Execute, Debug, and Repair (`step-06-execute-debug-repair.md`)
- Run real feature-aligned execution targets
- Debug and repair bounded local-safe issues
- Produce `generated/execution-report.md` and `generated/execution-report.json`

### Step 5 vs Step 6 Boundary

- Step 5 validates suite quality: structure, selectors, coverage, and oracle presence.
- Step 6 proves runtime behavior against the feature: execute, classify failure cause, repair bounded issues, and re-run affected targets.

---

## EXECUTION

Read fully and follow: `./steps/step-01-intake.md`
