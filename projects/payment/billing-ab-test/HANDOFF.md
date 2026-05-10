# HANDOFF — Billing A/B Test: Annual vs Monthly Default
> Last updated: 2026-05-07 | By: Claude (Cowork session)
> Ticket: PMT-131 / PAY-2492 | Squad: Payment

---

## Session Summary

**2026-05-07 — xlsx redesign session:**
Rebuilt `billing-ab-test-cases.xlsx` (v3) based on design review. Two structural changes:
1. Test Cases — MOD_CORE_01 collapsed from 7 individual TCs → 4 items using Decision Table approach
2. AB Results — completely redesigned from TC-mirror → 4-section independent condition reference

**2026-05-06 — initial pipeline session:**
Full QA pipeline (Layers 1–5) completed from scratch. Spec uploaded + user notes clarified 4 critical ambiguities.

---

## Deliverables Created

| File | Contents | Status |
|---|---|---|
| `analysis.md` | Master Context + Module List/Risk Register + Deep Analysis Package (Layers 1–3) | ✅ Done |
| `test-cases/regression-suite.md` | Regression Suite (31 scenarios, 3 tiers) + BDD Gherkin (5 Tier 0 + 6 Tier 1 scenarios) | ✅ Done |
| `test-cases/test-cases.md` | 56 TCs in 9-column format, grouped by 6 modules, Gate 5 checks, RTM | ✅ Done (reference) |
| `test-cases/billing-ab-test-cases.xlsx` | **v5** — Test Cases: 4-section DT (29 items incl. Event Tracking) + 4-section AB Results | ✅ Done |

**Source spec:** `[Spec] Billing Page A/B Test Annual vs Monthly Default - Everfit.md` (Confluence: PMT-131)

---

## Scope (this session)

**IN SCOPE:** Section 3 only — A/B Test Implementation & Measurement (Free Trial / Starter WSs)
- Variant assignment + persistence
- Billing page display (Variant A/B)
- State transitions T1–T5
- Purchase event recording (first purchase only)
- Report data accuracy (add-on inference, re-purchase new row)

**OUT OF SCOPE (not tested):**
- Section 1 (churn data pull — analytics/BA task)
- Section 2 (new subscription billing cycle tracking — analytics/BA task)
- Section 4 (post-test reporting/charts — BA task)

---

## Key Decisions Made

| Decision | Rationale |
|---|---|
| Scope limited to Section 3 + Section 4 | Section 4 (Event Tracking) added 2026-05-07 from spec update |
| Report captures FIRST purchase only (Free Trial/Starter → paid) | Confirmed Q1: subsequent upgrades/downgrades do NOT update existing row |
| Exception: re-purchase from Starter adds NEW row | Confirmed Q1+Q3: Paid→Starter→purchase = new row, same variant |
| Variant persists permanently to WS ID | Confirmed Q3: no reassignment even after multiple state changes |
| Bundle = Pro + Automation + P&P + On-demand | Confirmed Q4: three add-ons auto-inferred as Yes for Bundle |
| On-demand Collections auto-Yes for Studio | Confirmed Q2: included in Studio at no extra cost |

---

## Clarifications Still Open (Dev input needed)

**NEW — Section 4 Event Tracking open items (2026-05-07):**

4. **[AMB-D1] Event scope for Starter WS:** Spec §4 title says "Free/Trial coaches" but §3 A/B test includes Starter. Do events fire for Starter WS too? Confirm with Dev.
5. **[AMB-D2] current_plan_tier values:** What exact string does the event send? e.g. "free_trial" / "starter"? Confirm.
6. **[AMB-D3] add-on field format in events:** Array of strings or comma-separated string? e.g. `["automation","p_and_p"]` or `"automation,p_and_p"`?
7. **[AMB-D4] total_amount in view_payment_success:** Monthly charge amount or full annual total for annual plans?
8. **[AMB-D5] confirm_payment timing:** Does event fire before or after payment processing result? (Before = action tracking; after = result tracking — impacts DT-D9 interpretation.)

**Previously open items:**

1. **REQ-A3 — A/B split ratio:** 50/50 assumed but NOT confirmed in spec. Also: does a Dev tool exist to force-assign Variant A or B in test environments? Critical for running TC-US01-FUNC-001/002 reliably.

2. **AC-03 T2 timing:** When WS is Free Trial and opens billing page to "select Starter plan" — is variant assigned on the first billing page load (regardless of Starter selection), or after Starter plan selection? Confirm with FE Dev (Hieu Le).

3. **Cancelled/Expired plan state:** If WS cancels paid plan (goes to cancelled/expired — NOT downgraded to Starter) → opens billing page. Is this eligible for new variant assignment? Expected behavior not documented.

---

## Test Environment Notes

- **TD-001 / TD-002** (Free Trial / Starter WSs with no prior billing page load) are **destructive** — each can only be used once for first-load testing. Need fresh WSs per test run.
- **TD-006 / TD-007** (T4/T5 state WSs) require complex multi-step setup (variant assignment + purchase + downgrade). Consider scripting the setup sequence.
- All tests require ability to **query DB directly** to verify variant assignment and report row data (not just UI verification).

---

## Next Steps

1. **Share open clarifications** (#1, #2, #3 above) with Dev (Hieu Le / FE) before test execution.
2. **Set up test data fixtures** (TD-001 through TD-007) in test environment.
3. **Use `billing-ab-test-cases.xlsx` as the primary execution document:**
   - Test Cases sheet: follow TC-US01-DT-001 Decision Table for variant assignment verification
   - AB Results sheet: look up Section 1 (trigger gate) + Section 3 (row matrix) during execution to verify report output — no TC cross-referencing needed
4. **Execute Tier 0** (5 scenarios, ~30–40 min) on first build.
5. **Execute Tier 0+1** (20 scenarios) on staging.
6. **Confirm report Excel export** matches AB Results Section 3 expected rows after test period.
7. Post-test: feed results back to Jon/Long/Rob for post-test recommendation.

---

## File Index

```
projects/payment/billing-ab-test/
  HANDOFF.md                        ← this file
  analysis.md                       ← Layers 1–3 (Master Context, Deep Analysis)
  test-cases/
    regression-suite.md             ← Layer 4 (31 scenarios + BDD Gherkin)
    billing-ab-test-cases.xlsx      ← PRIMARY EXECUTION DOC (v3, redesigned 2026-05-07)
    test-cases.md                   ← Layer 5 (56 TCs, 9-column format)
```

---

## Pipeline Status

```
Layer 1: Context Builder      ✅ Complete — analysis.md
Layer 2: Strategy Decomposer  ✅ Complete — 6-module Hybrid split
Layer 3: Deep Analyzer        ✅ Complete — 9 ACs, all DR blocks, dependency map, RTM
Layer 4: Scenario Designer    ✅ Complete — 31 scenarios + BDD Gherkin (Tier 0+1+2/3)
Layer 5: TC Generator         ✅ Complete — 56 TCs, all Gate 5 checks passed
Automation pipeline           ⬜ Not started — BDD features not yet written as .feature files
```
