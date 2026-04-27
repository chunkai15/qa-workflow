# Regression Logic — 3-Tier Model & Narrative Rules

> Luôn load khi qa_scenario_designer khởi động.

---

## The 3-Tier Model

```
Tier 0 — Critical Path
  Run: ALWAYS, every trigger (new build, hotfix, deploy smoke check)
  Scope: Cross-US E2E flows từ Dependency Map
  Goal: "Is the feature fundamentally working?"
  Count target: 5–15 flows (small feature exception: ≤3 USs → 1 flow per cross-US dependency, không bắt buộc đạt 5)
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

**Source:** Dependency Map — derive flows ONLY from it, không invent.

| Relationship type | Convert to Tier 0 flow như thế nào |
|---|---|
| **Logical inversion** | A creates/applies → B reverses/undoes. Flow = do A → do B → verify state reset |
| **Shared entity** | A và B both write. Flow = do A → verify entity → do B → verify entity again |
| **State dependency** | B behavior changes based on A's state. Flow = put in A's state → exercise B |
| **Data dependency** | B displays data from A. Flow = create via A → verify display in B |
| **Sequence constraint** | B only reachable after A. Flow = complete A → navigate to B → verify availability |

**Exclude from Tier 0:**
- Reuse reference → Tier 1
- Permission inheritance → Tier 2
- Contradiction → Tier 2 (document as known risk)

---

## Tier 1 — Happy Path Construction

**Identify anchor AC:** AC có most observable effects (highest Q6 count) hoặc được referenced by other ACs.

**Priority trong Tier 1:**
- P1: Anchor AC của mỗi US. Feature broken without this.
- P1: Cross-US data dependency (Tier 0 verifies link, Tier 1 verifies full display)
- P2: Common alternate path (empty state, zero state, pagination)
- P2: Multi-step interaction cần setup

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

*Nếu US vượt target → review: scenarios có thể merge? Một số thuộc Tier 2?*

---

## Tier 2/3 Assignment

**Tier 2 — Conditional & Role-based:**
- Mỗi conditional AC (`if X then Y / if not-X then Z`) → 2 scenarios (cả 2 branches)
- Role-based differences (admin vs member vs viewer)
- State-based restrictions (disabled states, locked fields, archived items)
- Error paths user hay gặp ("client has no credits")
- Multi-filter/multi-condition combinations

**Tier 3 — Edge, Boundary, Known Bugs:**
- Boundary values (exactly at limit, one over, one under)
- Concurrency / race conditions
- Long content / special characters / unicode
- Cross-browser / responsive (nếu in scope)
- **Known bugs (Mode B):** Từ FAILED/BLOCKED cases → tag `[REGRESSION: TC-ID]`

---

## Narrative Writing Rules (BẮT BUỘC)

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
⚠️ "Data setup required: [describe what needs to exist]" — dùng khi exact values depend on environment

### Tier 0 anti-patterns

**Anti-pattern 1 — Tier 0 stays in 1 US:**
Symptom: "Tier 0" scenarios không cross US boundary.
Fix: Tier 0 PHẢI start ở US-A và verify outcome ở US-B khác.

**Anti-pattern 2 — Too many scenarios:**
Symptom: 150+ scenarios, tester không finish trong reasonable time.
Fix: Atomic test cases thuộc qa_testcase_generator. Regression suite = strategic coverage, not exhaustive.

**Anti-pattern 3 — Preconditions inside steps:**
Symptom: "Step 1: Find a client with 3 credits and navigate to their profile"
Fix: Data state → Preconditions. Step 1 starts from defined state.

---

## Gate Checks (run sau khi draft)

```
Tier 0: 5-15 flows? ✓/✗
Tier 0: Mọi flow cross US boundary? ✓/✗
Tier 1: 15-30 scenarios? ✓/✗
Tier 1: Mọi US có ≥1 Tier 1 scenario? ✓/✗
Tier 2/3: 10-25 scenarios? ✓/✗
Total: 30-70 scenarios? ✓/✗
Mọi Tier 1 có concrete preconditions? ✓/✗
Không có "works correctly" hoặc "as expected" trong Expected? ✓/✗
```
