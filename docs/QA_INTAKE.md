# QA Feature Intake

Every QA request must pass through this intake gate before any execution begins. The agent must classify the input type, assess the risk, and select the correct workflow and lane.

## Intake Flow

```text
QA Request Received
    |
    v
1. Classify Input Type (Map to WF-0 -> WF-6)
    |
    v
2. Identify Affected Project + Squad
    |
    v
3. Run QA Risk Checklist (if WF-1 or WF-4)
    |
    v
4. Choose Risk Lane & Session Mode (S / M / L / XL)
    |
    v
5. Proceed to Execution via docs/AGENT_OPERATING_MODEL.md
```

## 1. Input Types & Workflow Mapping

| Input Type | Trigger Condition | Target Workflow |
|---|---|---|
| **Strategy-First Spec Review** | User wants fast high-level understanding, gaps, risks, or strategy `.xmind` before TCs | `WF-0` (via `@qa-high-level-strategy-analyst`) |
| **New Feature / Epic** | Full QA pipeline needed for a new spec | `WF-1` (via `@qa-master-workflow`) |
| **Spec Slice / Hotfix** | Partial spec coverage or minor change | `WF-1` (via `@qa-master-workflow` in MODE S) |
| **Bug / Issue** | Bug reproduction, Slack thread, fix review | `WF-2` (via `@qa-bug-report-generator`) |
| **Automation** | Manual tests exist, BDD/Playwright needed | `WF-4` (via `@qa-auto-test-generator`) |
| **Test Repair** | Flaky or broken Playwright script | `WF-5` (via `@playwright-test-healer`) |
| **Daily Report (DSU)** | Standup report or worklog draft needed | `WF-3` (via `@jira-calendar-daily-report`) |
| **Harness Friction** | Process issue, ambiguity, missing tools | Log to `docs/HARNESS_BACKLOG.md` |

## 2. QA Risk Checklist (For WF-0, WF-1 & WF-4)

Mark one flag for each item that applies to the feature/change:

| Risk Flag | Applies when the feature touches... |
|---|---|
| **Auth** | Login, logout, sessions, JWT, password, 2FA, auth states |
| **Authorization** | Roles, permissions, tenant scope, subscription tiers |
| **Payment** | Credits, billing, checkout, invoices, trial transitions |
| **Data Mutability** | Hard deletion, data migration, schema changes, state machines |
| **Third-party** | Emails, webhooks, external provider SDKs (Stripe, etc.) |
| **Broad UI** | Cross-platform logic (mobile/web parity), core reused components |
| **Weak Spec** | Missing ACs, undefined edge cases, heavy assumptions required |

## 3. AC Count Gate (MANDATORY — run before lane assignment)

```
Count total ACs in scope.
  ≤20 ACs → proceed to lane assignment below.
  >20 ACs → STOP: Epic split required (≤15 ACs per Epic).
             Each Epic runs as an independent WF-1 pipeline.
             Merge regression suites at the end.
```

## 4. Risk Lanes & Session Modes

Based on the AC count and Risk Flags, determine the lane and the specific Session Mode for `@qa-master-workflow`.

### WF-0: Strategy-First Lane
**Triggers:** user wants high-level analysis first, asks for strategy `.xmind`, or the spec is still too uncertain for detailed TC generation.
**Requirements:**
- Run `@qa-high-level-strategy-analyst`.
- Produce `high-level-strategy-analysis.md` and, unless user opts out, a `.xmind` strategy map.
- Preserve gaps, conflicts, and clarification items instead of flattening them.
- Treat the resulting artifacts as upstream inputs for `WF-1`, not as a replacement for full pipeline outputs.

### Lane 1: Quick-Check (MODE S)
**Triggers:** 0 Risk Flags AND <= 5 ACs AND no complex state transitions.
**Requirements:**
- Run `WF-1` in **MODE S** (Single Session).
- Generate TCs directly after context builder.
- No heavy BDD scenarios required unless explicitly asked.

### Lane 2: Standard (MODE M)
**Triggers:** 1-2 Risk Flags OR 6-15 ACs.
**Requirements:**
- Run `WF-1` in **MODE M** (Multi-Session: 3-4 sessions).
- Must produce full `analysis.md` (Context + Strategy + Deep Analysis).
- Requires explicit mapping to `TEST_MATRIX.md`.
- Context Pruning must be applied between sessions.

### Lane 3: Deep-Analysis (MODE L / XL)
**Triggers:** 3+ Risk Flags OR >15 ACs OR **any Auth/Payment flag**.
**Requirements:**
- Run `WF-1` in **MODE L** (16-40 ACs) or **MODE XL** (>40 ACs, requires Epic Split).
- Must pause at each Review Gate (Gate 1a, 1b, 2, 3, etc.) for human approval.
- High likelihood of source conflicts; document all conflict canaries.
- Requires robust `TEST_MATRIX.md` with explicit integration/E2E proof targets.
