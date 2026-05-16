# HANDOFF — Package Issuance (P3.1) — Session Credits
**Project:** `payment/Package Issuance (P3.1)`
**Feature:** Session Credits P3.1 — Automated credit issuance through Package system
**Spec version:** v34 (2026-05-07)
**Last updated:** 2026-05-16 (Session 3) | **Updated by:** Codex | **Session:** QA Master Workflow — E2 L5 artifact verification

---

## Session Summary

This session ran the **full QA Master Workflow (Layers 1–3 + 5)** for **Epic E1** of the P3.1 feature.

Epic E1 = **US1 AC1–AC15** (Package Pricing Pop-up Setup — configuration UI only).

Layer 4 (Scenario Designer) was skipped by user — Layer 5 derived directly from L3 artifacts.

---

## Scope: 6 Epics Total (Confirmed)

| Epic | Scope | ACs | Mode | Status |
|---|---|---|---|---|
| **E1** | US1 AC1–AC15 — Pricing Pop-up: UI + Pricing Plan + Free Trial + Session Credits Config | 15 | M | ✅ **COMPLETE** |
| **E2** | US1 AC16–AC21b + US2 AC1–AC6 — Session Credits validation + save + overview + edit flow | 14 | M | ✅ **COMPLETE** |
| **E3** | US3 + US4 AC0.1–AC9 — Purchase status redefinitions + Purchase Details Part 1 | 20 | L | 🔲 **NEXT — ready to start** |
| **E4** | US4 AC10–AC25 — Purchase Details Part 2 | 16 | M | 🔲 pending |
| **E5** | US5 + US13 — Discount display + Migration (status mapping + promo + null snapshot) | 11 | M | 🔲 pending |
| **E6** | US6–US12 — Full Session Credits system (issuance, session type guards, WS flags) | 19 | M/L | 🔲 pending |

**Total ACs across all epics:** 94

---

## E1 — What Was Completed

### Files Produced

| File | Description |
|---|---|
| `analysis-E1.md` | Full pipeline artifact: MASTER CONTEXT + MODULE LIST + RISK REGISTER + DEEP ANALYSIS PACKAGE v3 + RTM |
| `test-cases/test-cases.md` | 158 test cases (English, 9-column format) across 5 modules |

### Pipeline Steps Completed

| Layer | Skill | Output | Status |
|---|---|---|---|
| L1 | `@qa-context-builder` | [MASTER CONTEXT] — 15 ACs, 87 Then-bullets, 3 QnA resolved | ✅ |
| L2 | `@qa-strategy-decomposer` | 5 modules, Hybrid strategy, ~124 TC floor estimate, Technique Assignment Map | ✅ |
| L3 | `@qa-deep-analyzer` | DEEP ANALYSIS PACKAGE v3: BU+DR per AC, DT/ST/BVA/EG artifacts, 5 Data Cards, Dependency Map (10 MANDATORY TCs), RTM (Min=155) | ✅ |
| L4 | *(skipped by user)* | — | — |
| L5 | `@qa-testcase-generator` | 158 TCs, 15/15 ACs ✓, 0 gaps | ✅ |

### E1 Test Suite Summary

**158 TCs total** — FUNC:70 / EDGE:76 / UI:6 / SCEN:6
Priority: High:109 / Medium:44 / Low:5

| Module | ACs | TCs | Risk |
|---|---|---|---|
| MOD_CORE_03 — Session Credits Config | AC12–14 | 42 | HIGH |
| MOD_CORE_02 — Pricing Plan Field Validation | AC7–10 | 29 | HIGH |
| MOD_CORE_01 — Pricing Plan UI Rendering | AC5–6 | 23 | HIGH |
| MOD_SUP_01 — No-Payment Entry & Package UI | AC1–4 | 33 | MEDIUM |
| MOD_SUP_02 — Free Trial Config + Cross-toggle | AC11,15 | 19 | MEDIUM |

### Resolved QnA (E1)

| Q | Question | Answer |
|---|---|---|
| Q1 | When credits toggle ON with empty fields, is Update Pricing disabled? | **Disabled** |
| Q2 | Is "Never" a valid expiration option for Session Credits? | **Yes — Never + Expires After** |
| Q3 | Does AC15 message use custom user terminology? | **Yes — coach's configured term** |

### Key Decisions Made

- Session Credits expiration has **2 options: Never + Expires after** (not Expires after only)
- Update Pricing button gating: disabled when credits ON + ANY field invalid
- AC15 cross-toggle message: custom user terminology, not hardcoded "client"
- Price BVA (USD): min=$0.50, max=$999,999.99 (Stripe-imposed — Assumption A1)
- Billing cycle BVA: integer 1–12 (Assumption A2)
- Figma MCP hit rate limit — design analysis done from 4 uploaded screenshots (DS-1 through DS-9)

### Open Issues / Notes for E2

1. **AC17 (race condition on save)** — covered by TC-US01-EDGE-012 (E1 stale session type EG test), but AC17's formal spec is in E2 scope. E2 must pick this up and write dedicated TCs.
2. **AC18 (toggle OFF collapses to default)** — E2 scope. The stateful behavior (data preserved vs reset on toggle OFF/ON) was noted as Risk #4 in E1 analysis but NOT definitively answered by spec.
3. **AC19 (loading state on save)** — E2 scope. Confirm: does loading animation appear on button only, or whole popup?
4. **US2 AC5 (changes apply to future only)** — requires a package with existing purchases in test data (DESTRUCTIVE scenario needed).
5. **US2 AC6 (block publish if inactive session type)** — requires published package + session type archive in another tab (same race condition pattern as AC17 but for publish action).
6. **Pricing model locked after publish** — US2 AC1: need a test package that has been published at least once (STATEFUL test data).

---

## E2 — Completed

### Files Produced

| File | Description |
|---|---|
| `analysis-E2.md` | Full pipeline artifact: MASTER CONTEXT + MODULE LIST + RISK REGISTER + DEEP ANALYSIS PACKAGE v3 + RTM |
| `test-cases/test-cases-E2.md` | 102 test cases (English, 9-column format) across 5 modules |

### Pipeline Steps Completed

| Layer | Skill | Output | Status |
|---|---|---|---|
| L1 | `@qa-context-builder` | [MASTER CONTEXT] — 13 ACs, 49 Then-bullets, 3 QnA resolved | ✅ |
| L2 | `@qa-strategy-decomposer` | 5 modules (3 CORE HIGH + 1 SUP MED + 1 SUP HIGH), Hybrid strategy, 102 TC floor, Technique Assignment Map | ✅ |
| L3 | `@qa-deep-analyzer` | DEEP ANALYSIS PACKAGE v3: BU+DR per AC, BVA/EP/EG/DT/ST artifacts, 4 Data Cards, 6 Dependency MAND rows, RTM (Min=102) | ✅ |
| L4 | *(skipped by user — same as E1)* | — | — |
| L5 | `@qa-testcase-generator` | 102 TCs, 13/13 ACs ✓, 0 gaps, all 10 MANDATORY TCs satisfied | ✅ |

### E2 Test Suite Summary

**102 TCs total** — FUNC:68 / EDGE:26 / UI:3 / SCEN:5
Priority: High:81 / Medium:19 / Low:2

**Codex verification note (2026-05-16):** `test-cases/test-cases-E2.md` was created from `analysis-E2.md` because the handoff referenced the E2 testcase artifact but the file was missing in the workspace. The generated E2 suite contains 102 TC rows, covers 13/13 E2 ACs, and preserves the Layer 4 skip noted above. `TEST_MATRIX.md` was also created so E1/E2 manual coverage is traceable.

| Module | ACs | TCs | Risk |
|---|---|---|---|
| MOD_CORE_04 — Validation + Race Condition | AC16, AC17 | 20 | HIGH |
| MOD_CORE_05 — Save Flow + Overview Blocks | AC19, AC20, AC21a, AC21b | 33 | HIGH |
| MOD_CORE_06 — Edit Confirm + Future-Only | US2 AC3, AC4, AC5 | 22 | HIGH |
| MOD_SUP_03 — Toggle Collapse | US1 AC18 | 8 | MED |
| MOD_SUP_04 — Published Lock + Publish Block | US2 AC1, AC2, AC6 | 19 | HIGH |

### Resolved QnA (E2)

| Q | Question | Answer |
|---|---|---|
| AMB-E2-01 | US2 AC4: Partial 2-section combo confirmation messages | Dynamic listing: "You are changing the [X] and [Y]..." |
| AMB-E2-02 | AC16: Error message for empty session type | "Please select session type." (no article "a") |
| AMB-E2-03 | AC18: Toggle OFF — data preserved or cleared? | Preserved within session; cleared after save with toggle OFF |

### Key Decisions Made (E2)

- US2 AC4 confirmation popup: 7 combinations now fully specified (3 single + 3 double + 1 all-three)
- US2 AC6 publish button: intentionally NOT disabled before click (spec explicit)
- SESSION CREDIT block: only shows if ≥1 session type rule actually saved
- AC17 race condition: server re-validates session types at save time (EP-1 via booking-service)
- AC5 future-only: architectural guarantee via `purchase_credit_snapshots` immutability

### Open Issues / Notes for E3

1. **Spec typo AC16**: "Please selecte session type" → actual = "Please select session type." — raise to dev
2. **OQ-10 from BE doc**: Standardize "Cancelled" vs "Canceled" spelling — US3 AC8 uses "Canceled" while other places use "Cancelled" — confirm with dev for E3 TCs
3. **US3/US4 AC0.1**: E3 starts with AC0.1 which is a "Summary of Logic" — this is a reference table, not a testable AC; QA Intake should classify it as documentation
4. **US4 AC5-13 actionable button details**: Heavy DT territory — US4 has 25 ACs, will need Mode L handling → confirm E3 split

---

## E2 — Ready to Start (OLD SECTION — REPLACED ABOVE)

### E2 Scope (14 ACs — Mode M)

**US1 AC16–AC21b** — 8 ACs:
- AC16: Validation errors for session credit fields (multi-row inline errors)
- AC17: Handle invalid data after clicking "Update Pricing" (race condition — session type deactivated)
- AC18: Turn OFF toggle — collapse to default state
- AC19: Show loading status when saving (button animation, all buttons disabled)
- AC20: Update UI for Pricing component after saving (PRICING PLAN block on Overview)
- AC21a: Show SESSION CREDIT block on package overview
- AC21b: Click on Session Type row to show session type details popup

**US2 AC1–AC6** — 6 ACs:
- AC1: Pricing model field disabled for published package
- AC2: All session credit fields always editable
- AC3: Save unpublished package — no confirmation
- AC4: Save published package — show confirmation pop-up (varies by what changed)
- AC5: Changes apply to future purchases only (existing purchases unaffected)
- AC6: Block publishing if inactive session type in credit rules

### E2 Key Risks (pre-read)

- **HIGHEST:** US2 AC4 (confirmation pop-up) — complex message combinations (pricing only / credits only / trial only / combo); DT needed
- **HIGH:** US2 AC6 (publish block) — race condition; needs published package + session type archived test data
- **HIGH:** US1 AC17 (server-side race condition on Update Pricing) — same session-type-archived scenario but triggered by save
- **HIGH:** US1 AC20/AC21a — Overview block rendering (PRICING PLAN + SESSION CREDIT blocks) must show correct format for one-time vs recurring vs trial
- **MEDIUM:** US1 AC18 (toggle collapse) — stateful behavior ambiguous in spec
- **MEDIUM:** US1 AC19 (loading state) — button animation + all-button disable during save

### E2 Test Data Needs (carry forward from E1 + new)

| DataID | Description | E2 ACs |
|---|---|---|
| TD-003 | WS Stripe connected, Booking ON, P&P ON | All E2 ACs |
| TD-005 | ≥1 active session type with require_credit=true | AC16, AC17, AC21a |
| TD-007 | ≥5 active session types with require_credit=true | AC16 (multi-row errors) |
| **TD-E2-001** (NEW) | Package **unpublished** (draft), with valid pricing + credits configured | US2 AC3 |
| **TD-E2-002** (NEW) | Package **published** (at least once), with valid pricing + credits configured | US2 AC1, AC2, AC4, AC6 |
| **TD-E2-003** (NEW) | Package published, with session type that gets archived during test | US2 AC6, US1 AC17 |
| **TD-E2-004** (NEW) | WS with existing purchases on a package (for AC5 future-only check) | US2 AC5 |

### Suggested E2 Module Structure (pre-proposal for Layer 2)

| Module | Scope | Type | Risk |
|---|---|---|---|
| MOD_CORE_04 | US1 AC16, AC17 — Validation errors + race condition on save | Core | HIGH |
| MOD_CORE_05 | US1 AC19, AC20, AC21a, AC21b — Save flow + Overview blocks | Core | HIGH |
| MOD_CORE_06 | US2 AC3, AC4, AC5 — Edit pricing: save unpublished + confirmation + future-only | Core | HIGH |
| MOD_SUP_03 | US1 AC18 — Toggle collapse behavior | Support | MEDIUM |
| MOD_SUP_04 | US2 AC1, AC2, AC6 — Published package lock + credit editability + publish block | Support | HIGH |

**Estimated E2 TCs:** ~90–110

---

## Startup Protocol for Next Session (E3)

Read in this order:
1. `HANDOFF.md` (this file) — know where to continue
2. `analysis-E1.md` — E1 decisions (do NOT redo)
3. `analysis-E2.md` — E2 decisions (do NOT redo)
4. `[Spec_3.1]_Session_Credits_—_Package_Issuance_-_Everfit.md` — US3 + US4 AC0.1–AC9 sections
5. `SessionCredits_P3.1_PackageIssuance_BE_Logic_DataFlow.md` — §4 Purchase Lifecycle, Status Machine
6. `solution_package_credit_issuance.md` — EP-4 (GET /purchases/:id/get-by-trainer) API contract

**First action:** Invoke `@qa-context-builder` for E3 (US3 + US4 AC0.1–AC9).
SCOPE GATE: E3 has 20 ACs — MODE L (requires 5-7 sessions). Confirm E3 boundaries before starting.
**Note on E3:** US4 AC0.1 + AC0.2 are "summary of logic" tables — classify as documentation references, not testable ACs, to manage scope.

---

## Dashboard Update Needed

No phase change needed after Session 3. `_dashboard.md` already shows E1+E2 complete and E3 as the next action.

---

*End of HANDOFF — Package Issuance P3.1 — Session end 2026-05-16*
