# Data CRUD Decomposer

> Load when QA chooses the Data CRUD strategy.
> Optimal for: CMS, Admin Portal, state management, permission/RBAC — data integrity risks.

## Step 1 — Draft the CRUD Decomposition

Analyze the feature by the data entities it affects. Every "Risk" column MUST be mapped from [MASTER CONTEXT].

| Module_ID | Module Name (Action) | Entity | Impact Level | Linked Risk |
|---|---|---|---|---|
| MOD_C_01 | [e.g., Create subscription] | Subscription | **Create** | [Risk: duplicate record, wrong plan assigned] |
| MOD_R_01 | [e.g., View billing history] | Invoice | **Read** | [Risk: wrong data shown, PII exposure] |
| MOD_U_01 | [e.g., Update plan] | Subscription | **Update** | [Risk: wrong proration, state corruption] |
| MOD_D_01 | [e.g., Cancel subscription] | Subscription | **Soft Delete** | [Risk: credits not revoked on cancel] |

**Impact levels (classify clearly):**
- **Read:** View only — lower risk but check data accuracy and PII exposure
- **Create:** Create new — risk of duplicates, wrong defaults, constraint violations
- **Update:** Modify — risk of state corruption, missing cascade effects
- **Soft Delete:** Soft delete (mark deleted, keep data) — check recovery and historical data
- **Hard Delete:** Permanent delete (data lost forever) — MUST distinguish from Soft Delete

> **[STOP — GATE 2b]:** Present the draft. Wait for QA to verify correct entities and impact levels. DO NOT package until confirmed.

## Step 2 — Package after QA approval

```markdown
### [MODULE LIST]
[Final CRUD decomposition table]
```

Then continue with the Module Risk Register. Note: Update + Delete modules → typically higher Overall Risk.
