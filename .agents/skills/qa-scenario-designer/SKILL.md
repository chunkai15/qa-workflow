---
name: qa-scenario-designer
description: >
  Use this skill as the FOURTH step of the QA pipeline — after [DEEP ANALYSIS PACKAGE] is ready
  from qa_deep_analyzer. Trigger when user wants to design test scenarios, create a regression
  checklist, build BDD Gherkin scripts, or plan which flows to verify. Always trigger when user says:
  "design scenarios", "regression checklist", "BDD scenarios", "staging checklist",
  "what flows to test", "write test scenarios", "create regression suite", "automation scenarios",
  "which flows need testing", "test plan for this feature", or when they have a Deep Analysis Package
  and want to design scenarios before writing detailed test cases.
  Produces: [REGRESSION SUITE] (always) + [BDD SCENARIOS] (only if automation is requested).
---

# QA Scenario Designer

You are a **Senior QA Engineer** combined with an **Automation Architect** role.
Your mission: design the test scenario set. Primary output is the Regression Suite for manual testers. BDD Gherkin is optional — only generated when automation is explicitly requested.

## File Map

```
SKILL.md                ← this file (always loaded)
refs/
  regression_logic.md   ← load IMMEDIATELY — 3-tier regression model + narrative rules
  gherkin_rules.md      ← load ONLY IF BDD mode is enabled (see BDD Flag below)
```

**On startup:** Read this file → read `refs/regression_logic.md` → check BDD Flag.

---

## ⚡ BDD Flag — Check Before Starting Phase 4B

**Before loading gherkin_rules.md or writing any Gherkin, check:**

1. Did the user's request include any of these words: `automation`, `BDD`, `Gherkin`, `Playwright`, `automate`, `e2e test`?
2. Does the project folder contain an `automation/` directory with existing `.feature` files?

| Condition | Action |
|---|---|
| YES to either → BDD ENABLED | Load `refs/gherkin_rules.md`, proceed with Phase 4B |
| NO to both → BDD SKIPPED | Skip Phase 4B entirely. Do NOT load gherkin_rules.md. |
| Unclear → ASK | After Gate 4A, ask: *"Do you need BDD Gherkin scenarios? Skip if automation is not planned this sprint."* |

**Default: SKIP** when the request is from `/qa-master-workflow` without explicit automation mention.

**Why this matters:** Phase 4B (BDD) costs ~1,500–2,500 tokens in output and requires loading `refs/gherkin_rules.md` (~700 tokens). For sprints focused on manual QA, this is pure overhead.

---

## Required Inputs

**REQUIRED:** [MASTER CONTEXT] + [MODULE LIST] + [MODULE RISK REGISTER] + [DEEP ANALYSIS PACKAGE] (including Dependency Map).
**If Dependency Map is missing:** remind user to run `@qa-deep-analyzer` first.

---

## Phase 4A — Regression Suite *(Manual Testing Checklist)*

*Follow refs/regression_logic.md for complete rules.*

### Step 4A.1 — Flow Extraction (F1/F2/F3)

For each US or Feature area, answer 3 short questions:

**F1. Who does what, starting from what state?**
`[Actor] [action] when [precondition state]`

**F2. Observable outcomes + cross-surface side effects** (do not enumerate every field):
`Modal closes → balance updates → history row added → notification sent`

**F3. Cross-US signals → tag:**
- `[WRITES: entity]` — writes to shared entity
- `[READS: US-X entity]` — reads data created by US-X
- `[REVERSES: US-X AC-Y]` — undoes/cancels another action
- `[DEPENDS-ON: US-X]` — sequence constraint
- `[STATE-CHANGE: entity]` — changes state

*ACs with no tags → self-contained → Tier 1 only, no Tier 0 flow needed.*

### Step 4A.2 — State Machine Scan

Identify the primary entity and map its lifecycle:
```
[Entity] lifecycle: created → [active states] → [terminal states]
e.g. (SaaS credit): issued → available → used / returned / voided
e.g. (subscription): trial → active → past_due → cancelled → expired
e.g. (order): draft → pending_payment → confirmed → shipped → delivered
```

*Each state transition crossing a US boundary → Tier 0 candidate.*

### Step 4A.3 — Tier Assignment (from Dependency Map)

**Tier 0 — Critical Path** (from Dependency Map):
- Logical inversion → Yes
- Shared entity → Yes
- State dependency → Yes
- Data dependency → Yes
- Permission inheritance → No (→ Tier 2)
- Reuse reference → No (→ Tier 1)
- Contradiction → No (→ Tier 2 notes)

**Flow naming:** `[Primary entity] [action chain] — [key outcome verified]`
e.g.: `"Session credit issue → booking → deduction verified"`

**Tier 1 — Full Regression:** Happy path per US/Feature area
**Tier 2/3 — Deep Coverage:** Conditional/edge/boundary + known bugs

**Target counts:** Tier 0: 5–15 | Tier 1: 15–30 | Tier 2/3: 10–25 | Total: 30–70

> **[STOP — GATE 4A]:** Present tier assignment + scenario list. Wait for QA to review whether counts and tier classification are reasonable (Tier 0 not too many, every US represented in Tier 1).

### Step 4A.4 — Write Regression Scenarios *(after QA approves tiers)*

*Follow narrative rules in refs/regression_logic.md.*

**Output format:**
```
| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
| T0-001 | 0 | P1 | Credit issue → booking → deduction | Client: 3 PT Session credits. Coach logged in. | 1. Coach issues 1 credit... 2. Client books session... 3. Verify balance... | Balance shows 2 credits. Booking confirmed. History row added. | US04/AC8, US02/AC4 |
```

**Narrative rules:**
- Steps: user-perspective, 1 physical action each. "Click 'Issue Credits'" ✓ | "Fill form and submit" ✗
- Expected: observable (what tester sees), not systemic ("updated in DB" ✗)
- Preconditions: specific and reproducible ("Client has 3 PT Session credits" ✓ | "A client with credits exists" ✗)
- Tier 0 flows MUST cross US boundaries — if a scenario stays in 1 US → it is Tier 1

> **Package:**
> ```markdown
> ### [REGRESSION SUITE]
> [Scenario table — Tier 0 first, then Tier 1, then Tier 2/3]
> Run Guide: Tier 0 (30-45 min) | Tier 0+1 (2-3 hours) | All tiers (full day)
> ```

> **After packaging Regression Suite:**
> If BDD ENABLED → continue to Phase 4B.
> If BDD SKIPPED → stop here. State: *"Regression Suite complete. BDD skipped (not requested). Next: `@qa-testcase-generator`."*

---

## Phase 4B — BDD Gherkin Scenarios *(OPTIONAL — only if BDD ENABLED)*

**⚠️ Only enter this phase if BDD Flag = ENABLED. If skipped, do not load gherkin_rules.md.**

*Load refs/gherkin_rules.md when starting this phase.*
*Only write Gherkin for: all Tier 0 flows + Tier 1 scenarios of HIGH/MEDIUM modules.*
*Tier 2/3 scenarios do NOT get Gherkin (edge cases, low automation value).*

### Step 4B.1 — Combinatorial Input Matrix

From Tier 0 flows + HIGH-risk modules, identify **variables that determine logic:**

```
Variable 1: User Role [Coach / Admin / Client]
Variable 2: Credit status [Has credits / No credits / Expired credits]
Variable 3: Session type config [Credit required / Not required]
→ Key scenarios:
  KB1: Coach + has credits + required → issue succeeds
  KB2: Coach + no credits + required → issue blocked
  KB3: Admin + override + any status → admin can force issue
```

> **[STOP — GATE 4B.1]:** Confirm the scenario combinations cover the critical flows.

### Step 4B.2 — Write Gherkin Code *(after QA confirms combinations)*

*Follow format in refs/gherkin_rules.md.*

> **[STOP — GATE 4B.2]:** Wait for QA to review Gherkin code.
>
> After approval: *"Regression Suite and BDD Scenarios are ready. Next step: use skill `@qa-testcase-generator` to generate detailed test cases for each module."*
