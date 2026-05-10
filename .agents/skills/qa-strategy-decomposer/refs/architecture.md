# Architecture Layers Decomposer

> Load when QA chooses the Architecture Layers strategy.
> Optimal for: backend-heavy systems, risks at API layer, microservices, integration points.

## Step 1 — Draft the Architecture Decomposition

Decompose the feature into 3 technical layer groups. Every "Linked Risk" column MUST be mapped from the Risk Identification in [MASTER CONTEXT].

| Module_ID | Module Name / Component | Layer (UI/Logic/Data) | Primary Responsibility | Linked Risk |
|---|---|---|---|---|
| MOD_UI_01 | [e.g., Payment Form Submit] | Presentation (UI) | [Description] | [Risk from Master Context] |
| MOD_BIZ_01 | [e.g., Payment Validation Service] | Business Logic | [Description] | [Risk from Master Context] |
| MOD_DAT_01 | [e.g., Transaction DB Write] | Integration/Data | [Description] | [Risk from Master Context] |

**Layer definitions:**
- **Presentation (UI):** Form inputs, button states, validation messages, display logic
- **Business Logic:** Rules engine, calculations, state machine, permission checks, API orchestration
- **Integration/Data:** Database operations, third-party API calls, webhooks, caching, async jobs

> **[STOP — GATE 2b]:** Present the draft. Wait for QA to review and approve or revise. DO NOT package until confirmed.

## Step 2 — Package after QA approval

After QA confirms "Finalized", package the approved table:

```markdown
### [MODULE LIST]
[Final module table]
```

Then continue with the Module Risk Register in the main SKILL.md.
