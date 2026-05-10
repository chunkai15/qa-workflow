# Regression Logic — 3-Tier Model & Narrative Rules

> Always load when qa_scenario_designer starts.

---

## The 3-Tier Model

```
Tier 0 — Critical Path
  Run: ALWAYS, every trigger (new build, hotfix, deploy smoke check)
  Scope: Cross-US E2E flows from Dependency Map
  Goal: "Is the feature fundamentally working?"
  Count target: 5–15 flows (small feature exception: ≤3 USs → 1 flow per cross-US dependency, not required to reach 5)
  Time: 30–45 minutes

Tier 1 — Full Regression
  Run: Staging builds, pre-production, post-hotfix verification
  Scope: Happy path per US + common alternates
  Goal: "Is each feature area working end-to-end?"
  Count target: 15–30 scenarios
  Time: 2–3 hours (Tier 0+1 combined)

Tier 2/3 — Deep Coverage
  Run: Major releases, after spec changes, after FAILED fixes
  Scope: Conditional/edge/boundary + known bug regression
  Goal: "Are the non-obvious cases still correct?"
  Count target: 10–25 scenarios
  Time: Full regression day (all 3 tiers)
```

---

## Tier 0 Flow Detection Rules

**Source:** Dependency Map — derive flows ONLY from it, do not invent.

| Relationship type | How to convert to Tier 0 flow |
|---|---|
| **Logical inversion** | A creates/applies → B reverses/undoes. Flow = do A → do B → verify state reset |
| **Shared entity** | A and B both write. Flow = do A → verify entity → do B → verify entity again |
| **State dependency** | B behavior changes based on A's state. Flow = put in A's state → exercise B |
| **Data dependency** | B displays data from A. Flow = create via A → verify display in B |
| **Sequence constraint** | B only reachable after A. Flow = complete A → navigate to B → verify availability |

**Exclude from Tier 0:**
- Reuse reference → Tier 1
- Permission inheritance → Tier 2
- Contradiction → Tier 2 (document as known risk)

---

## Tier 1 — Happy Path Construction

**Identify anchor AC:** AC with most observable effects (highest Q6 count) or referenced by other ACs.

**Priority in Tier 1:**
- P1: Anchor AC of each US. Feature broken without this.
- P1: Cross-US data dependency (Tier 0 verifies link, Tier 1 verifies full display)
- P2: Common alternate path (empty state, zero state, pagination)
- P2: Multi-step interaction requiring setup

**Stay OUT of Tier 1:**
- Negative paths → Tier 2
- UI state variations (disabled, tooltip text) → Tier 2
- Boundary values → Tier 3
- Concurrency / race conditions → Tier 3
- Role-based differences → Tier 2

**Scenario count per US complexity:**
- Simple (1-3 ACs) → 1-2 scenarios
- Moderate (4-8 ACs) → 2-4 scenarios
- Complex (9+ ACs) → 3-6 scenarios

*If US exceeds target → review: can scenarios be merged? Do some belong in Tier 2?*

---

## Tier 2/3 Assignment

**Tier 2 — Conditional & Role-based:**
- Each conditional AC (`if X then Y / if not-X then Z`) → 2 scenarios (both branches)
- Role-based differences (admin vs member vs viewer)
- State-based restrictions (disabled states, locked fields, archived items)
- Common error paths users encounter ("client has no credits")
- Multi-filter/multi-condition combinations

**Tier 3 — Edge, Boundary, Known Bugs:**
- Boundary values (exactly at limit, one over, one under)
- Concurrency / race conditions
- Long content / special characters / unicode
- Cross-browser / responsive (if in scope)
- **Known bugs (Mode B):** From FAILED/BLOCKED cases → tag `[REGRESSION: TC-ID]`

---

## Narrative Writing Rules (REQUIRED)

### Steps: user perspective, 1 action each

**Wrong (test-case style):**
> "Step 1: Navigate to /sessions tab and verify URL"

**Right (narrative style):**
> "Step 1: Log in as Coach and open a connected client's profile"
> → Sessions tab loads; Upcoming sub-tab shown by default

### Expected: observable, not systemic

✅ "Balance shows '4 credits total'"
✅ "Coin icon appears next to session type name"
❌ "Credit balance is updated in the database"
❌ "System processes the issuance correctly"
❌ "Works as expected"

### Preconditions: specific and reproducible

✅ "Client has 3 available credits for 'PT Session' type; Coach logged in as active coach"
✅ "WS has Booking feature enabled; ≥2 session types exist"
❌ "A client with credits exists"
⚠️ "Data setup required: [describe what needs to exist]" — use when exact values depend on environment

### Tier 0 anti-patterns

**Anti-pattern 1 — Tier 0 stays in 1 US:**
Symptom: "Tier 0" scenarios don't cross US boundaries.
Fix: Tier 0 MUST start in US-A and verify outcome in a different US-B.

**Anti-pattern 2 — Too many scenarios:**
Symptom: 150+ scenarios, testers can't finish in reasonable time.
Fix: Atomic test cases belong in qa_testcase_generator. Regression suite = strategic coverage, not exhaustive.

**Anti-pattern 3 — Preconditions inside steps:**
Symptom: "Step 1: Find a client with 3 credits and navigate to their profile"
Fix: Data state → Preconditions. Step 1 starts from the defined state.

---

## Gate Checks (run after draft)

```
Tier 0: 5-15 flows? ✓/✗
Tier 0: Every flow crosses US boundary? ✓/✗
Tier 1: 15-30 scenarios? ✓/✗
Tier 1: Every US has ≥1 Tier 1 scenario? ✓/✗
Tier 2/3: 10-25 scenarios? ✓/✗
Total: 30-70 scenarios? ✓/✗
Every Tier 1 has concrete preconditions? ✓/✗
No "works correctly" or "as expected" in Expected? ✓/✗
```
