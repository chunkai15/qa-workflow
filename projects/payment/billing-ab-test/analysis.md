# QA Analysis — Billing Page A/B Test: Annual vs Monthly Default
> Generated: 2026-05-06 | Ticket: PMT-131 / PAY-2492 | Scope: Section 3 only

---

## [MASTER CONTEXT]

**Feature Purpose:**
The A/B Test feature assigns Free Trial and Starter workspaces to either Variant A (Monthly default) or Variant B (Annual default) on the billing page — to determine whether showing Annual-first increases annual plan conversion rates. Purchase data is recorded per WS and exported to an Excel report for analysis.

**Scope:** Section 3 ONLY — A/B Test Implementation & Measurement (Free Trial/Starter WSs)

---

### Business Flows

| Flow | Actor | Entry point | Consequence if fail |
|---|---|---|---|
| Variant Assignment | System | First billing page load (Free Trial or Starter WS) | Wrong/no variant → test data invalid |
| Variant A Display | Coach (Free Trial/Starter, Group A) | Opens billing page post-assignment | Sees Annual instead of Monthly → data skewed |
| Variant B Display | Coach (Free Trial/Starter, Group B) | Opens billing page post-assignment | Sees Monthly instead of Annual → A/B invalid |
| Variant Persistence | System | Coach returns to billing page after any state change | Wrong variant shown → breaks test integrity |
| Paid WS Exclusion | System | Paid WS opens billing page | Paid WS gets variant → contaminates test group |
| First Purchase Recording | System | Coach completes first paid plan purchase | Plan/cycle/add-ons not stored → report incomplete |
| Re-purchase Recording | System | WS returns to Starter → purchases paid plan again | New row not added → re-purchase data lost |
| Report Export | Dev/BA | Post-test data extraction to Excel | Wrong data → incorrect business recommendation |

---

### Actor Map

| Role | Goal | Entry point | Permission boundary |
|---|---|---|---|
| Coach — Free Trial WS | Purchase first paid plan | Billing page | Eligible for A/B; can toggle freely |
| Coach — Starter WS | Upgrade from free Starter tier | Billing page | Eligible for A/B; can toggle freely |
| Coach — Paid WS (Pro/Studio/Bundle) | Change plan | Billing page | NOT eligible for variant assignment |
| System/Backend | Auto-assign variant; record purchase | Triggered on billing page load / purchase event | Assign only Free Trial or Starter |
| Dev/BA | Export A/B result data to Excel | Backend DB / data export tool | Read-only |

---

### Key Business Rules

- **R1.** ONLY Free Trial or Starter WS eligible for A/B variant assignment.
- **R2.** Variant assigned on FIRST billing page load ever; persists permanently to WS ID regardless of subsequent state changes.
- **R3.** Paid WS (Pro/Studio/Bundle) opening billing page: NO variant assigned, normal behavior.
- **R4.** Variant A = "Bill Monthly" toggle active on page load (current behavior).
- **R5.** Variant B = "Bill Annually" toggle pre-selected; annual prices shown ("Billed Annually" label); Plan Summary shows /year amounts.
- **R6.** Coach can freely switch the toggle regardless of assigned variant.
- **R7.** Report captures FIRST purchase event only: when WS transitions from Free Trial or Starter → first paid plan (Pro/Studio/Bundle).
- **R8.** EXCEPTION to R7: If WS downgrades back to Starter and purchases again → NEW row added (same variant, new purchase data). Existing row NOT overwritten.
- **R9.** Bundle plan = Pro (discounted) + Automation + Payment & Packages + On-demand Collections bundled.
- **R10.** On-demand Collections: paid add-on for Pro (separate or via Bundle); included at no cost in Studio.
- **R11.** Advanced Custom Branding = one-time fee ($75); not affected by billing cycle.
- **R12.** Split ratio: assumed 50/50 (not confirmed in spec — A3).

---

### Report Columns (Excel template)

| Column | Values |
|---|---|
| WS Identifier | WS ID |
| Flow Assigned | A or B |
| Billing Cycle Purchased | Monthly / Annual |
| Plan Purchased | Pro / Studio / Bundle |
| Automation add-on | Yes / No |
| On-demand Collections add-on | Yes / No (Yes if Studio — included) |
| Payment & Packages add-on | Yes / No |
| Advanced Custom Branding add-on | Yes / No |
| Meal Plans & Recipe Books add-on | Yes / No |
| Zapier add-on | Yes / No |

---

### State Transitions In Scope

| # | Transition | Variant behavior | Report behavior |
|---|---|---|---|
| T1 | Free Trial → Paid (first purchase) | Assign variant on first billing page load | Record row on purchase |
| T2 | Free Trial → Starter → Paid | Variant assigned on first billing page load | Record row on first paid purchase |
| T3 | Starter → Paid (first purchase) | Assign variant on first billing page load | Record row on purchase |
| T4 | Free Trial → Paid → Starter → re-purchase | Keep original variant (no reassignment) | Add NEW row (same variant, new data) |
| T5 | Starter → Paid → Starter → re-purchase | Keep original variant (no reassignment) | Add NEW row (same variant, new data) |

---

### Data Flow

```
Billing page load
  → [Backend checks eligibility (Free Trial / Starter)]
  → [If eligible + no prior variant: assign A or B, store in DB against WS ID]
  → Frontend reads variant from DB
  → Renders Monthly or Annual toggle default accordingly
  → Coach purchases
  → [Backend records: WS ID, variant, billing cycle, plan, add-ons → DB]
  → Dev/BA exports DB data → Excel report (Billing A/B testing template)
```

---

### Risk Identification

1. **DATA INTEGRITY:** Variant assignment must be idempotent. Paid→Starter downgrade must NOT clear stored variant.
2. **BUSINESS LOGIC GAP:** Two conditions tracked independently: (a) eligible for variant assignment vs (b) eligible for new purchase row. WS returning from Paid to Starter = NOT eligible for new variant, IS eligible for new row.
3. **REPORT ACCURACY:** Purchase event trigger fires ONLY on paid plan purchase, not on toggle/selection/load.
4. **ON-DEMAND EDGE CASE:** Studio = On-demand included (Yes in report even if not explicitly selected).
5. **BUNDLE EDGE CASE:** Bundle auto-populates Automation + P&P + On-demand as Yes.
6. **INTEGRATION:** DB → Excel sync. Data loss or mapping errors in export.

---

### Resolved Assumptions

- **A1.** Starter = free Starter tier ("Free, up to 5 clients"). Free Trial = workspace in trial period. Both eligible.
- **A2.** Advanced Custom Branding = one-time fee; not affected by billing cycle.
- **A3.** A/B split ratio = 50/50 assumed (not specified in spec).
- **A4.** Variant persists permanently to WS ID (confirmed by user, pending Dev confirm on implementation detail).
- **A5.** On-demand Collections = Yes for Studio (included in plan) and Bundle (included); Yes only if explicitly purchased for Pro.

### Design Supplements

- Variant B: "Billed Annually" label appears next to price in plan cards `[source: design]`
- Plan Summary updates realtime when toggle switches (monthly ↔ annual) `[source: design]`
- Advanced Custom Branding shows "One time" label in Plan Summary — not /month or /year `[source: design]`
- "SAVE 16%" badge on "Bill Annually" toggle button `[source: design]`
- Client count slider (50–500) appears for Studio plan `[source: design]`

---

---

## [MODULE LIST]

| Module_ID | Module Name | Type | Primary Responsibility | Linked Risk |
|---|---|---|---|---|
| MOD_CORE_01 | Variant Assignment Logic | Core Function | Assign A/B variant to eligible WS on first billing load; idempotency; paid WS exclusion | R1: Idempotency + Paid WS exclusion |
| MOD_CORE_02 | Variant B — Annual Default Display | Core Function | Render billing page with Annual toggle pre-selected; annual prices; labels | R2: Wrong display invalidates entire test |
| MOD_CORE_03 | State Transition & Variant Persistence | Core Function | Validate variant survives all 5 state transitions (T1–T5) | R1: Paid→Starter must NOT clear variant |
| MOD_SUP_01 | Variant A — Monthly Default Display | Support Function | Verify control group behavior (existing Monthly default, not broken) | Lower risk — existing behavior |
| MOD_RPT_01 | Purchase Event Recording | Report/Export | Capture first-purchase data at correct trigger timing; all 10 fields | R3: Trigger timing; R4/R5: Add-on inference |
| MOD_RPT_02 | Report Data Accuracy | Report/Export | Bundle/Studio add-on auto-inference; re-purchase new row; no overwrite | R4: Bundle auto-Yes; R5: Studio auto-Yes; R2: New row not overwrite |

---

## [MODULE RISK REGISTER]

| Module | Risk Description | Likelihood | Impact | Overall | Test Focus |
|---|---|---|---|---|---|
| MOD_CORE_01 | Variant re-assigned on repeat load OR assigned to Paid WS → entire dataset invalid | H | H | **HIGH** | Full EP + Decision Table + State Transition + Error Guessing H1/H4 + Idempotency |
| MOD_CORE_02 | Annual toggle NOT pre-selected for Group B; prices wrong; labels missing | M | H | **HIGH** | Scenario + EP (all toggle states) + BVA + full UI state checks (design supplement) |
| MOD_CORE_03 | Variant cleared after Paid→Starter downgrade (silent data loss); wrong variant on re-entry | H | H | **HIGH** | Full State Transition (T1–T5) + Error Guessing H5 |
| MOD_SUP_01 | Monthly default broken for Group A (unexpected regression) | L | M | **MEDIUM** | Happy path + 1 regression negative |
| MOD_RPT_01 | Recording fires on wrong event (toggle/selection not checkout) OR missing fields | H | H | **HIGH** | Decision Table (plan × cycle × add-ons) + trigger timing + Error Guessing H1/H2/H5 |
| MOD_RPT_02 | Bundle/Studio add-ons NOT auto-inferred; re-purchase overwrites instead of new row | H | H | **HIGH** | Decision Table (3 plan types × 6 add-ons) + State Transition + Error Guessing |

---

---

## [DEEP ANALYSIS PACKAGE]

### AC Type Classification Matrix

| AC | Module | Structural Type | Risk | Design Supplement? | Est. Floor |
|---|---|---|---|---|---|
| AC-01 | MOD_CORE_01 | Compound | HIGH | No | 8 |
| AC-02 | MOD_CORE_02 | Multi-effect | HIGH | Yes (screenshots) | 10 |
| AC-03 | MOD_CORE_03 | Compound | HIGH | No | 8 |
| AC-04 | MOD_CORE_03 | Compound | HIGH | No | 10 |
| AC-05 | MOD_SUP_01 | Headline-only | LOW | No | 3 |
| AC-06 | MOD_RPT_01 | Field-enum (10 fields) | HIGH | No | 12 |
| AC-07 | MOD_RPT_01 | Conditional | MEDIUM | No | 4 |
| AC-08 | MOD_RPT_02 | Compound | HIGH | No | 9 (after EP) |
| AC-09 | MOD_RPT_02 | Conditional | HIGH | No | 6 |

---

### AC Definitions

**AC-01** — Assign variant (A or B) to Free Trial/Starter WS on FIRST billing page load. Paid WS not assigned. Assignment idempotent (subsequent loads do NOT reassign).

**AC-02** — Group B coach → billing page shows "Bill Annually" toggle pre-selected, annual prices in plan cards ("Billed Annually" label), /year in Plan Summary. Toggle freely switchable. Advanced Custom Branding shows "One time" (not /year).

**AC-03** — First-time assignment flows (T1/T2/T3): variant correctly assigned on first billing page load across different WS entry states.

**AC-04** — Persistence flows (T4/T5): variant preserved after Paid→Starter downgrade. No re-assignment. Re-purchase adds NEW row to report.

**AC-05** — Group A coach → billing page shows "Bill Monthly" toggle active. Existing behavior. No change.

**AC-06** — First purchase event (Free Trial/Starter → paid plan) triggers recording: WS ID, variant, billing cycle, plan, 6 add-ons (yes/no each). Trigger fires at checkout completion only.

**AC-07** — Upgrade/downgrade AFTER first purchase (paid-to-paid) does NOT update existing report row, does NOT add new row.

**AC-08** — Add-on auto-inference: Bundle → auto-Yes for Automation + P&P + On-demand. Studio → auto-Yes for On-demand. ACB/Meal Plans/Zapier always explicit.

**AC-09** — WS re-purchases from Starter (after downgrade from paid) → NEW row added (same variant + new purchase data). Existing row NOT overwritten.

---

### Cross-AC Dependency Map

| Dep_ID | Relationship Summary | Source AC | Target AC | Type | Test Implication | CoveredBy |
|---|---|---|---|---|---|---|
| DEP-01 | Variant assigned in AC-01; read by display modules | AC-01 | AC-02, AC-05 | Data dependency | Verify displayed toggle matches DB-stored variant | TC-US01-SCEN-001, TC-US01-FUNC-001 |
| DEP-02 | Variant stored in DB (AC-01) must survive plan state changes | AC-01 | AC-04 | State dependency | Verify DB variant unchanged after Paid→Starter downgrade | TC-US03-FUNC-003/004/005/006 |
| DEP-03 | T1/T3 first-load assigns variant that T4/T5 must preserve | AC-03 | AC-04 | Sequence constraint | Complete T1/T3 setup BEFORE running T4/T5 persistence tests | TC-US03-SCEN-001/002 |
| DEP-04 | Purchase recording reads variant from DB | AC-01 | AC-06 | Data dependency | Verify report row variant = DB variant (not client-set) | TC-US01-SCEN-001, TC-US05-SCEN-001 |
| DEP-05 | AC-06 and AC-08 share same checkout event trigger | AC-06 | AC-08 | Shared entity | Single purchase → verify both recording AND inference fire | TC-US05-FUNC-002/003, TC-US06-SCEN-001 |
| DEP-06 | AC-07 (paid→paid, no row) vs AC-09 (paid→Starter→paid, new row) | AC-07 | AC-09 | Logical inversion | Distinguish similar-looking scenarios with opposite behavior | TC-US05-FUNC-007/008, TC-US06-FUNC-006 |
| DEP-07 | AC-04 T4/T5 setup enables AC-09 re-purchase scenario | AC-04 | AC-09 | Sequence constraint | Complete downgrade flow before testing re-purchase new row | TC-US03-SCEN-001/002, TC-US06-SCEN-001 |
| DEP-08 | Group A and Group B are mutually exclusive | AC-02 | AC-05 | Logical inversion | Same WS cannot display both Monthly and Annual default | TC-US04-FUNC-001/002, TC-US02-FUNC-001 |

---

### Analysis Artifacts

#### Requirement-to-Condition Matrix — AC-01 (Assignment Conditions)

| Direct assertion | Condition/Branch | Observable outcome | Downstream effect |
|---|---|---|---|
| Assign variant if eligible | WS = Free Trial, no prior variant in DB | Variant A or B stored; billing page renders | Purchase recording gets correct variant |
| Assign variant if eligible | WS = Starter, no prior variant in DB | Variant A or B stored; billing page renders | Purchase recording gets correct variant |
| Block assignment if paid | WS = Pro/Studio/Bundle | No variant stored; billing page: normal behavior | No A/B test data for paid WS |
| Idempotency — single load | WS has existing variant, loads billing page again | Existing variant returned; NO new DB write | Variant consistency over time |
| Idempotency — concurrent | Same WS loads billing in 2 tabs simultaneously | Only 1 variant assigned; no double-write conflict | No variant conflict/corruption |

#### Add-on Inference Matrix — AC-08

| Plan | Add-on | Source | Expected report value |
|---|---|---|---|
| Bundle | Automation | Auto (included) | Yes |
| Bundle | On-demand Collections | Auto (included) | Yes |
| Bundle | Payment & Packages | Auto (included) | Yes |
| Bundle | Advanced Custom Branding | Explicit only | Yes if selected, No if not |
| Bundle | Meal Plans & Recipe Books | Explicit only | Yes if selected, No if not |
| Bundle | Zapier | Explicit only | Yes if selected, No if not |
| Studio | On-demand Collections | Auto (included) | Yes |
| Studio | Automation | Explicit only | Yes if selected, No if not |
| Studio | Payment & Packages | Explicit only | Yes if selected, No if not |
| Pro (no bundle) | All 6 add-ons | Explicit only | Yes if selected, No if not |

#### Cross-Flow Impact Sweep — T4/T5 (Paid → Starter Downgrade)

| Dimension | Detail |
|---|---|
| **State change** | WS: Paid plan → downgrade to Starter |
| **Preserved** | DB variant assignment (same A/B); WS ID; original report row(s) |
| **Blocked** | New variant assignment (WS already has one; system does NOT re-assign) |
| **Still allowed** | Open billing page; re-purchase paid plan (creates new report row) |
| **Downstream UI** | Billing page toggle default = original variant (visually unchanged) |
| **Report state** | Original row intact; new row added only on re-purchase (not on downgrade itself) |
| **Audit risk** | Downgrade silently clearing DB variant = highest risk; no visual indicator of data loss |

#### Test Data Reference

| DataID | Category | Description | Key values | Setup order | Notes |
|---|---|---|---|---|---|
| TD-001 | State/Destructive | Free Trial WS, no prior billing page load | status=Free Trial, variant=null | 1 | Single-use; first load assigns variant permanently |
| TD-002 | State/Destructive | Starter WS, no prior billing page load | status=Starter, variant=null | 1 | Single-use |
| TD-003 | State | WS assigned Variant A | variant=A | 2 (after TD-001 or TD-002 first load) | |
| TD-004 | State | WS assigned Variant B | variant=B | 2 | |
| TD-005 | State | Currently Paid WS (Pro, monthly) | status=Pro, variant=null | 1 | For exclusion testing |
| TD-006 | State/Boundary | WS completed T4 (Free Trial→Paid→Starter) | variant=original, 1 existing report row | 3 | Complex setup: TD-001 + purchase + downgrade |
| TD-007 | State/Boundary | WS completed T5 (Starter→Paid→Starter) | variant=original, 1 existing report row | 3 | Complex setup: TD-002 + purchase + downgrade |
| TD-008 | Transaction | Bundle purchase checkout | plan=Bundle, cycle=Annual | 2 | For add-on inference: auto-Yes for Automation/P&P/On-demand |
| TD-009 | Transaction | Studio purchase, no explicit add-ons | plan=Studio, cycle=Monthly, all explicit=No | 2 | On-demand auto-Yes; all others No |
| TD-010 | Transaction | Pro purchase + all 6 add-ons explicit | plan=Pro, cycle=Monthly, all add-ons=Yes | 2 | Maximum add-ons test |

---

### Requirement Traceability Matrix

| Req_ID | Requirement Summary | Priority | Mapped Module | TC IDs | Status |
|---|---|---|---|---|---|
| REQ-01 | Assign variant to Free Trial/Starter on first billing page load | HIGH | MOD_CORE_01 | TC-US01-FUNC-001/002, TC-US01-SCEN-001 | ✅ Covered |
| REQ-02 | Variant assignment is idempotent — repeat loads do NOT reassign | HIGH | MOD_CORE_01 | TC-US01-FUNC-005/006, TC-US01-EDGE-001 | ✅ Covered |
| REQ-03 | Paid WS NOT assigned variant; sees normal billing page | HIGH | MOD_CORE_01 | TC-US01-FUNC-003/004, TC-US01-EDGE-002 | ✅ Covered |
| REQ-04 | Variant B: Annual toggle default; annual prices displayed | HIGH | MOD_CORE_02 | TC-US02-FUNC-001/002/003, TC-US02-SCEN-001 | ✅ Covered |
| REQ-05 | Variant A: Monthly toggle default (control group) | MEDIUM | MOD_SUP_01 | TC-US04-FUNC-001/002 | ✅ Covered |
| REQ-06 | Coach can freely switch toggle regardless of variant | MEDIUM | MOD_CORE_02, MOD_SUP_01 | TC-US02-FUNC-005, TC-US04-FUNC-003 | ✅ Covered |
| REQ-07 | Variant assigned correctly on T1/T2/T3 first loads | HIGH | MOD_CORE_03 | TC-US03-FUNC-001/002, TC-US03-SCEN-001/002 | ✅ Covered |
| REQ-08 | Variant persists through T4/T5 (Paid→Starter→billing) | HIGH | MOD_CORE_03 | TC-US03-FUNC-003/004/005/006, TC-US03-SCEN-001/002 | ✅ Covered |
| REQ-09 | First purchase records all 10 fields correctly | HIGH | MOD_RPT_01 | TC-US05-FUNC-001/002/003/006, TC-US05-SCEN-001 | ✅ Covered |
| REQ-10 | Recording triggers at checkout completion only | HIGH | MOD_RPT_01 | TC-US05-FUNC-004/005 | ✅ Covered |
| REQ-11 | Paid→Paid upgrade/downgrade does NOT update report row | MEDIUM | MOD_RPT_01 | TC-US05-FUNC-007/008 | ✅ Covered |
| REQ-12 | Bundle auto-Yes for Automation + P&P + On-demand | HIGH | MOD_RPT_02 | TC-US06-FUNC-001/002, TC-US06-SCEN-001 | ✅ Covered |
| REQ-13 | Studio auto-Yes for On-demand Collections | HIGH | MOD_RPT_02 | TC-US06-FUNC-003/004 | ✅ Covered |
| REQ-14 | Re-purchase from Starter adds NEW row (same variant, new data) | HIGH | MOD_RPT_02 | TC-US06-FUNC-006/007, TC-US06-SCEN-001 | ✅ Covered |

**⚠️ GAP — REQ-A3:** A/B split ratio (50/50) and randomization algorithm NOT documented in spec. No module tests distribution/randomness. Track as open item in HANDOFF.md.
