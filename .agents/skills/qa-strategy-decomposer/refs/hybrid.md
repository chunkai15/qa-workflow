# Hybrid Decomposer

> Load when QA chooses the Hybrid strategy.
> Optimal for: large/complex features with multiple interwoven risk types (core business + CRUD + reporting).

## Step 1 — Draft the Hybrid Decomposition

Divide the feature into 3 groups of Functional Modules. Every "Risk" column MUST be mapped from [MASTER CONTEXT].

**REQUIRED — clearly classify into 3 groups, do not merge:**

| Module_ID | Module Name / Functional Block | Type | Primary Responsibility | Linked Risk |
|---|---|---|---|---|
| MOD_CORE_01 | [e.g., Issue Credits to Client] | **Core Function** | [Core business value] | [Risk from Master Context] |
| MOD_CORE_02 | [e.g., Process Subscription Payment] | **Core Function** | [Core business value] | [Risk] |
| MOD_SUP_01 | [e.g., Search & Filter Clients] | **Support Function** | [Helper for core functions] | [Risk: performance] |
| MOD_SUP_02 | [e.g., Permission Settings] | **Support Function** | [Config, access control] | [Risk: misconfiguration] |
| MOD_RPT_01 | [e.g., Export Billing Report] | **Report/Export** | [Data output, analytics] | [Risk: data accuracy, PII] |

**3 Functional Module groups:**
- **Core Function:** Business flows that deliver direct business value (credit issuance, payment processing, session booking)
- **Support Function:** Supporting tools (search, filter, config, settings, permissions, notifications)
- **Report/Export:** Data output (reports, exports, logs, analytics dashboards)

*Note: Support and Report functions are often overlooked in test planning — pay close attention to these two groups.*

> **[STOP — GATE 2b]:** Present the draft. Wait for QA to verify full coverage, especially Support and Report modules. DO NOT package until confirmed.

## Step 2 — Package after QA approval

```markdown
### [MODULE LIST]
[Final functional blocks table]
```

Then continue with the Module Risk Register. Note: Core modules typically HIGH risk; Report modules check data accuracy + PII.
