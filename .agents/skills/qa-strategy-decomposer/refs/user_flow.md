# User Flow Decomposer

> Load when QA chooses the User Flow strategy.
> Optimal for: long sequential flows, onboarding, checkout, booking — risk of flow breakage (blocker).

## Step 1 — Draft the Flow Decomposition

Break the feature into sequential execution steps. Every "Risk" column MUST be mapped from [MASTER CONTEXT].

| Module_ID | Step Name / Action | Step Type | Goal | Risk & Impact |
|---|---|---|---|---|
| STEP_01 | [e.g., Initialize session] | Pre-condition (Entry) | [Load info, create state] | [Risk] → **Blocks flow** |
| STEP_02 | [e.g., Fill payment details] | Main Action | [Collect valid input] | [Risk] → **UI error only** |
| STEP_03 | [e.g., Confirm payment] | Main Action | [Process payment] | [Risk] → **Blocks flow** |
| STEP_04 | [e.g., Display confirmation] | Post-condition (Result) | [Save to DB, show receipt] | [Risk] → **UI error only** |

**Step types:**
- **Pre-condition (Entry):** Setup state, authentication, load data — must complete to enter the flow
- **Main Action:** Core user interactions — if fail may block or only cause UI errors
- **Post-condition (Result):** After-effects — confirmation, notification, state update

**Impact classification (REQUIRED for each step):**
- **Blocks flow:** Failing this step → user cannot continue → Priority HIGH
- **UI error only:** Failing this step → inconvenient but user can still proceed → Priority MEDIUM/LOW

> **[STOP — GATE 2b]:** Present the draft. Wait for QA to review, especially the "Blocks flow" classification. DO NOT package until confirmed.

## Step 2 — Package after QA approval

```markdown
### [MODULE LIST]
[Final step-by-step flow table]
```

Then continue with the Module Risk Register in the main SKILL.md. Note: Block-flow steps → higher Overall Risk.
