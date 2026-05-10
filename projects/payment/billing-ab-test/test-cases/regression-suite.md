# Regression Suite — Billing A/B Test: Annual vs Monthly Default
> Layer 4 Output | Generated: 2026-05-06 | Ticket: PMT-131 / PAY-2492

**Run Guide:**
- **Tier 0 only** (smoke / every deploy): ~30–40 min — 5 flows
- **Tier 0 + 1** (staging / pre-prod): ~2.5 hours — 20 scenarios
- **All tiers** (full regression / major release): Full day — 31 scenarios

---

## [REGRESSION SUITE]

### Tier 0 — Critical Path (5 flows)
> Run on every new build. Covers all cross-module Dependency Map links.

| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
|---|---|---|---|---|---|---|---|
| T0-001 | 0 | P1 | WS variant assignment → billing page renders correct toggle default | Free Trial WS (WS_FT_01): no prior billing load, no variant in DB | 1. Log in as coach for WS_FT_01. 2. Navigate to Billing page. 3. Note toggle state (Monthly or Annual). 4. Query DB for assigned variant. | Variant A or B assigned and stored in DB. Toggle default matches assigned variant (Monthly for A / Annual for B). Page renders without error. | AC-01, AC-02, AC-05 — DEP-01, DEP-08 |
| T0-002 | 0 | P1 | Eligible WS → variant assigned → first paid purchase → report row created with correct variant | Starter WS (WS_ST_01) with Variant B assigned. | 1. Navigate to Billing page. 2. Confirm Annual toggle active. 3. Select Pro plan, Annual cycle. 4. Complete checkout. 5. Query report for WS_ST_01. | Report row exists: WS=WS_ST_01, variant=B, cycle=Annual, plan=Pro, On-demand=No, others per selection. Variant in report matches DB variant. | AC-01, AC-06 — DEP-04 |
| T0-003 | 0 | P1 | Paid → Starter downgrade → re-open billing page → original variant still displayed, no reassignment | WS_T4_01: completed T4 (was Free Trial → Variant A → Pro → now Starter). 1 existing report row. | 1. Log in as coach for WS_T4_01 (Starter status). 2. Navigate to Billing page. 3. Observe toggle default. 4. Query DB for variant. | Toggle shows "Bill Monthly" (Variant A). DB variant = A (unchanged). No new variant assignment triggered. | AC-04 — DEP-02, DEP-03 |
| T0-004 | 0 | P1 | T4 re-purchase from Starter → new report row added, original row intact (not overwritten) | WS_T4_01 in Starter status, has 1 existing report row (plan=Pro, cycle=Monthly, variant=A). | 1. Navigate to Billing page. 2. Select Studio plan, Annual. 3. Complete checkout. 4. Query report for WS_T4_01. | Report has 2 rows. Row 1 unchanged (plan=Pro, cycle=Monthly). Row 2: variant=A, plan=Studio, cycle=Annual, On-demand=Yes. | AC-04, AC-09 — DEP-06, DEP-07 |
| T0-005 | 0 | P1 | Bundle or Studio purchase → included add-ons auto-populated in report (inference logic) | WS Starter, Variant B. Bundle plan available. | 1. Navigate to Billing page (Variant B). 2. Select Bundle plan, Annual. 3. Do NOT explicitly check Automation, P&P, or On-demand. 4. Complete checkout. 5. Query report. 6. Repeat with Studio plan (different WS). | Bundle: Automation=Yes, P&P=Yes, On-demand=Yes (all auto). Studio: On-demand=Yes (auto), Automation=No, P&P=No. | AC-08 — DEP-05 |

---

### Tier 1 — Full Regression (15 scenarios)
> Run on staging / pre-prod builds. One happy path per feature area.

| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
|---|---|---|---|---|---|---|---|
| T1-001 | 1 | P1 | Free Trial WS — first billing load — variant assigned, correct toggle default shown | WS_FT_B01: Free Trial, no prior variant in DB | 1. Navigate to Billing page for WS_FT_B01. 2. Check toggle state. 3. Query DB for variant. | Variant A or B stored in DB. Toggle = Monthly (if A) or Annual (if B). | AC-01, AC-03 |
| T1-002 | 1 | P1 | Starter WS — first billing load — variant assigned, correct toggle default shown | WS_ST_B01: Starter, no prior variant | 1. Navigate to Billing page. 2. Check toggle. 3. Query DB. | Variant assigned. Toggle default matches. | AC-01, AC-03 |
| T1-003 | 1 | P1 | Paid WS (Pro) opens billing page — no variant assigned, normal Monthly default | WS_PAID_01: Active Pro plan, no prior variant | 1. Navigate to Billing page. 2. Check toggle. 3. Query DB for variant. | DB: no variant for WS_PAID_01. Toggle shows "Bill Monthly" (normal behavior). | AC-01 |
| T1-004 | 1 | P1 | Variant B billing page — Annual toggle active, plan cards show "Billed Annually" label | WS_B_01: Variant B assigned | 1. Navigate to Billing page. 2. Inspect toggle. 3. Inspect Pro plan card. 4. Inspect Plan Summary. | "Bill Annually" active. Pro card shows "$19/month" + "Billed Annually" label. Plan Summary shows /year amounts. | AC-02 |
| T1-005 | 1 | P1 | Variant B — Advanced Custom Branding shows "One time" (not /year) when Annual is active | WS_B_02: Variant B. ACB add-on visible in billing page. | 1. Navigate to Billing page. 2. Check ACB add-on. 3. Inspect Plan Summary for ACB entry. | Plan Summary: ACB = "$75 One time" — not "$900/year". | AC-02 |
| T1-006 | 1 | P2 | Variant B — coach switches toggle to Monthly — all prices update to /month | WS_B_03: Variant B, Annual active on load | 1. Navigate to Billing page (Annual active). 2. Click "Bill Monthly". 3. Check plan card prices. 4. Check Plan Summary. | Toggle = Monthly active. Plan cards show /month (no "Billed Annually" label). Plan Summary shows /month. | AC-02 |
| T1-007 | 1 | P1 | T1 flow — Free Trial → variant assigned → Pro Monthly purchase → report row records correct variant | WS_FT_C01: Free Trial, no prior variant | 1. Navigate to Billing page. 2. Note assigned toggle (variant). 3. Select Pro Monthly. 4. Complete checkout. 5. Query report. | Report row: variant matches toggle default from step 2. cycle=Monthly, plan=Pro. | AC-03, AC-06 |
| T1-008 | 1 | P1 | T3 flow — Starter → variant assigned → Studio Annual purchase → report row recorded | WS_ST_C01: Starter, no prior variant | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Complete checkout. 4. Query report. | Report row: variant=assigned, cycle=Annual, plan=Studio, On-demand=Yes. | AC-03, AC-06 |
| T1-009 | 1 | P1 | T4 — Free Trial → Paid → Starter: billing page shows original Variant A (Monthly default) without reassignment | WS_T4_A: Free Trial → Variant A assigned → purchased Pro → now Starter | 1. Navigate to Billing page. 2. Check toggle. 3. Query DB. | Toggle = Monthly active (Variant A). DB variant = "A". No new assignment. | AC-04 |
| T1-010 | 1 | P1 | T5 — Starter → Paid → Starter: billing page shows original Variant B (Annual default) without reassignment | WS_T5_B: Starter → Variant B assigned → purchased Studio → now Starter | 1. Navigate to Billing page. 2. Check toggle. 3. Query DB. | Toggle = Annual active (Variant B). DB variant = "B". No new assignment. | AC-04 |
| T1-011 | 1 | P1 | Variant A billing page — Monthly default (control group, existing behavior intact) | WS_A_01: Variant A assigned | 1. Navigate to Billing page. 2. Check toggle. 3. Check Plan Summary. | "Bill Monthly" active. Plan Summary shows /month amounts. No "Billed Annually" label. | AC-05 |
| T1-012 | 1 | P1 | First purchase (Pro Monthly + Automation) — all 10 report fields recorded with correct values | WS_A_02: Variant A, Starter, no prior row | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Check Automation. 4. Complete checkout. 5. Query report. | Report: variant=A, cycle=Monthly, plan=Pro, Automation=Yes, On-demand=No, P&P=No, ACB=No, Meal=No, Zapier=No. | AC-06 |
| T1-013 | 1 | P1 | First purchase (Studio Annual, no explicit add-ons) — On-demand auto-Yes, all others No | WS_B_04: Variant B, Starter, no prior row | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Do not check any add-ons. 4. Complete checkout. 5. Query report. | Report: variant=B, cycle=Annual, plan=Studio, On-demand=Yes, Automation=No, P&P=No, ACB=No, Meal=No, Zapier=No. | AC-06, AC-08 |
| T1-014 | 1 | P2 | Paid→Paid upgrade (Pro → Studio) — no new report row, existing row unchanged | WS_PAID_02: Active Pro plan, 1 existing report row | 1. Upgrade from Pro to Studio. 2. Complete upgrade. 3. Query report. | Report still has 1 row. Row unchanged (plan=Pro). | AC-07 |
| T1-015 | 1 | P1 | Idempotency — same WS reloads billing page 3 times — variant NOT reassigned | WS_A_03: Variant A assigned | 1. Load billing page (load 1). 2. Navigate away. 3. Load again (load 2). 4. Navigate away. 5. Load again (load 3). 6. Query DB. | DB variant = "A" after all 3 loads. Toggle = Monthly on all loads. No extra DB writes. | AC-01 |

---

### Tier 2/3 — Deep Coverage (11 scenarios)
> Run on major releases, after spec changes, or after FAILED fixes.

| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
|---|---|---|---|---|---|---|---|
| T2-001 | 2 | P2 | Paid WS opens billing page — confirm NO variant exists in DB (negative verification) | WS_PAID_03: Active Studio plan, no prior variant | 1. Navigate to Billing page. 2. Query DB for variant. | DB has NO variant entry for WS_PAID_03. | AC-01 |
| T2-002 | 2 | P2 | Variant B — "SAVE 16%" badge visible on Annual toggle button | WS_B_05: Variant B | 1. Navigate to Billing page. 2. Inspect "Bill Annually" button. | "SAVE 16%" text/badge is visible on or adjacent to "Bill Annually" toggle. | AC-02 |
| T2-003 | 2 | P2 | Variant B — toggle Monthly→Annual→Monthly: all price updates are correct each time | WS_B_06: Variant B. Studio plan selected. Automation checked. | 1. Load billing page (Annual default). 2. Click Monthly. Check Plan Summary (/month). 3. Click Annual. Check Plan Summary (/year). | Monthly state: Studio=$105/month, Automation=$29/month. Annual state: Studio=$1,050/year, Automation=$290/year. Each switch updates correctly. | AC-02 |
| T2-004 | 2 | P2 | Studio + explicit Automation add-on: On-demand=Yes (auto) AND Automation=Yes (explicit) both in report | WS Starter, Variant A | 1. Navigate to Billing page. 2. Select Studio, Monthly. 3. Check Automation add-on. 4. Complete checkout. 5. Query report. | Report: On-demand=Yes, Automation=Yes, P&P=No, others=No. | AC-08 |
| T2-005 | 2 | P2 | Bundle purchase: Automation, P&P, On-demand all auto-Yes even without explicit selection | WS Starter, Variant B | 1. Navigate to Billing page. 2. Select Bundle, Monthly. 3. Do NOT check any add-ons. 4. Complete checkout. 5. Query report. | Report: Automation=Yes, P&P=Yes, On-demand=Yes. ACB=No, Meal=No, Zapier=No. | AC-08 |
| T2-006 | 2 | P2 | Pro with zero add-ons: all 6 fields = No in report | WS Starter, Variant A | 1. Select Pro, Monthly. 2. Uncheck all add-ons. 3. Complete checkout. 4. Query report. | All 6 add-on columns = No. | AC-06 |
| T2-007 | 2 | P1 | Checkout abandoned before payment — no report row created | WS_B_07: Variant B, Starter, no prior row | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Begin checkout. 4. Close browser without completing payment. 5. Query report. | Report has 0 rows for WS_B_07. | AC-06 |
| T2-008 | 2 | P1 | Payment declined — no report row created | WS_A_04: Variant A, Starter, no prior row | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Enter declined card (4000000000000002). 4. Submit. 5. Query report. | Payment failure message shown. Report has 0 rows for WS_A_04. | AC-06 |
| T2-009 | 2 | P2 | Paid→Paid downgrade (Studio → Pro) — no new report row | WS_PAID_04: Active Studio plan, 1 existing report row | 1. Downgrade Studio → Pro. 2. Complete downgrade. 3. Query report. | Report still has 1 row. Existing row unchanged. | AC-07 |
| T3-001 | 3 | P2 | Concurrent first billing page load (2 tabs, same WS) — only ONE variant assigned | WS_FT_D01: Free Trial, no prior variant | 1. Open 2 browser tabs simultaneously for WS_FT_D01. 2. Navigate to Billing page in both tabs at the same time. 3. Query DB for variant after both loads. | DB has exactly 1 variant entry for WS_FT_D01. Both tabs show the same toggle default. No conflicting assignments. | AC-01 |
| T3-002 | 3 | P2 | WS cycles T4 twice (two complete Paid→Starter→paid cycles) — report has 3 rows, all with original variant | WS that: Variant A → Pro → Starter → Studio → Starter (2 complete T4 cycles), 2 existing rows. | 1. Navigate to Billing page (Starter status, 2 report rows). 2. Re-purchase Bundle, Annual. 3. Query report. | Report has 3 rows. Row 3: variant=A, plan=Bundle, cycle=Annual. All 3 rows have variant=A. | AC-04, AC-09 |

---

---

## [BDD SCENARIOS]

### Combinatorial Input Matrix — Tier 0 + HIGH-Risk Modules

**Variables driving key logic:**

| Variable | Values |
|---|---|
| WS Status | Free Trial / Starter / Paid |
| Prior variant in DB | Yes (A) / Yes (B) / No |
| Plan purchased | Pro / Studio / Bundle |
| Billing cycle selected | Monthly / Annual |
| Add-ons explicitly selected | None / Partial / All |

**Key scenario combinations:**

| KB_ID | WS Status | Prior variant | Plan | Cycle | Expected behavior |
|---|---|---|---|---|---|
| KB1 | Free Trial | No | Any | Any | Variant assigned on page load |
| KB2 | Starter | No | Any | Any | Variant assigned on page load |
| KB3 | Paid | No | — | — | NO variant assigned |
| KB4 | Any (Free Trial/Starter) | Yes (A or B) | — | — | Same variant returned; NO new assignment |
| KB5 | Starter (Variant A) | Yes (A) | Pro | Monthly | Report: variant=A, cycle=Monthly, plan=Pro, add-ons per selection |
| KB6 | Starter (Variant B) | Yes (B) | Studio | Annual | Report: variant=B, cycle=Annual, plan=Studio, On-demand=Yes |
| KB7 | Starter (Variant A) | Yes (A) | Bundle | Monthly | Report: variant=A, Automation=Yes, P&P=Yes, On-demand=Yes |
| KB8 | Starter after T4/T5 | Yes (original) | Any | Any | Same variant on page; re-purchase = new row |

---

```gherkin
Feature: Billing Page A/B Test — Annual vs Monthly Default
  Controls variant assignment (A or B) for Free Trial/Starter workspaces and tracks
  purchase data to analyze annual plan conversion rates.

  Background:
    Given the A/B test feature is enabled on the platform

  # ==========================================================================
  # TIER 0 — CRITICAL PATH
  # ==========================================================================

  @tier0 @P1 @automation-candidate
  Scenario Outline: Variant assigned on first billing page load and toggle matches assignment
    # Phase 1: System assigns variant to eligible WS
    Given workspace "<ws_id>" is in "<status>" status with no prior variant assignment
    When coach logs in and navigates to the Billing page for the first time
    Then a variant is assigned and stored in the database for workspace "<ws_id>"
    And the billing toggle default matches the assigned variant:
      | Assigned variant | Expected toggle default |
      | A                | Bill Monthly            |
      | B                | Bill Annually           |

    Examples:
      | ws_id    | status     |
      | WS_FT_01 | Free Trial |
      | WS_ST_01 | Starter    |

  @tier0 @P1 @automation-candidate
  Scenario: Eligible WS completes first purchase — report row created with correct variant
    # Phase 1: Variant B WS on billing page
    Given workspace "WS_ST_02" is in "Starter" status and has been assigned Variant B
    When coach navigates to the Billing page
    Then the billing toggle shows "Bill Annually" as active

    # Phase 2: Purchase and report recording
    When coach selects "Pro" plan with "Annual" billing cycle
    And coach adds "Automation" add-on
    And coach completes checkout successfully
    Then a report row is created for "WS_ST_02" with:
      | Field              | Value    |
      | Flow Assigned      | B        |
      | Billing Cycle      | Annual   |
      | Plan Purchased     | Pro      |
      | Automation         | Yes      |
      | On-demand          | No       |
      | Payment & Packages | No       |
      | Adv Custom Brand   | No       |
      | Meal Plans         | No       |
      | Zapier             | No       |

  @tier0 @P1 @automation-candidate
  Scenario: Variant persists after WS transitions Paid → Starter — billing page shows original variant
    # Phase 1: WS was Free Trial, assigned Variant A, purchased Pro
    Given workspace "WS_T4_01" has Variant A assigned and completed one paid plan purchase
    And workspace "WS_T4_01" has been downgraded to Starter status

    # Phase 2: Re-open billing page — variant must be preserved
    When coach navigates to the Billing page for workspace "WS_T4_01"
    Then the billing toggle shows "Bill Monthly" as active (Variant A)
    And the database variant for "WS_T4_01" remains "A"
    And no new variant assignment is created

  @tier0 @P1 @automation-candidate
  Scenario: Re-purchase from Starter adds new report row without overwriting original
    # Phase 1: WS returned to Starter — has existing report row
    Given workspace "WS_T4_01" has Variant A assigned and 1 existing report row (plan=Pro, cycle=Monthly)
    And workspace "WS_T4_01" is in Starter status

    # Phase 2: Re-purchase — must create new row, not overwrite
    When coach selects "Studio" plan with "Annual" billing cycle
    And coach completes checkout successfully
    Then the report for "WS_T4_01" contains exactly 2 rows
    And row 1 is unchanged: plan=Pro, cycle=Monthly, variant=A
    And row 2 contains: plan=Studio, cycle=Annual, variant=A, On-demand=Yes

  @tier0 @P1 @automation-candidate
  Scenario Outline: Bundle or Studio purchase auto-populates included add-ons in report
    Given workspace "<ws_id>" has variant B assigned and is in Starter status
    When coach selects "<plan>" plan and completes checkout without explicitly selecting add-ons
    Then the report row for "<ws_id>" contains:
      | Automation | On-demand Collections | Payment & Packages |
      | <auto_atm> | <auto_od>             | <auto_pp>          |

    Examples:
      | ws_id    | plan   | auto_atm | auto_od | auto_pp |
      | WS_B_10  | Bundle | Yes      | Yes     | Yes     |
      | WS_B_11  | Studio | No       | Yes     | No      |

  # ==========================================================================
  # TIER 1 — FULL REGRESSION (HIGH/MEDIUM modules)
  # ==========================================================================

  @tier1 @P1 @automation-candidate
  Scenario: Paid WS opens billing page — no variant assigned (exclusion rule)
    Given workspace "WS_PAID_01" is on active "Pro" plan with no prior variant
    When coach navigates to the Billing page
    Then the billing toggle shows "Bill Monthly" as default (normal behavior)
    And no variant is stored in the database for workspace "WS_PAID_01"

  @tier1 @P1 @automation-candidate
  Scenario: Variant assignment is idempotent — repeat loads do not reassign
    Given workspace "WS_A_01" has Variant A assigned from a prior billing page load
    When coach navigates to the Billing page a second time
    And navigates to the Billing page a third time
    Then the billing toggle shows "Bill Monthly" on all loads
    And the database variant for "WS_A_01" remains "A" with no additional DB writes

  @tier1 @P1 @automation-candidate
  Scenario: Variant B — Plan Summary shows /year amounts for all recurring items on page load
    Given workspace "WS_B_04" has Variant B assigned
    When coach navigates to the Billing page and selects Studio plan with Automation add-on
    Then the Plan Summary sidebar shows:
      | Item                      | Display    |
      | Studio Plan - 50 clients  | $1,050/year |
      | Automation Add-on         | $290/year   |
    And "Advanced Custom Branding" shows "$75 One time" — not a yearly amount

  @tier1 @P2 @automation-candidate
  Scenario: Variant B — coach switches to Monthly — prices update; switch back — prices restore
    Given workspace "WS_B_05" has Variant B assigned and the Billing page is loaded (Annual active)
    When coach clicks "Bill Monthly" toggle
    Then plan card prices show /month amounts without "Billed Annually" label
    When coach clicks "Bill Annually" toggle
    Then plan card prices return to showing "Billed Annually" label and /year amounts in Plan Summary

  @tier1 @P2 @automation-candidate
  Scenario: Variant A — Monthly default shown (control group, existing behavior intact)
    Given workspace "WS_A_02" has Variant A assigned
    When coach navigates to the Billing page
    Then the billing toggle shows "Bill Monthly" as active
    And plan cards show /month prices
    And no "Billed Annually" label is present

  @tier1 @P1 @automation-candidate
  Scenario: Paid→Paid upgrade does not create new report row and does not update existing row
    Given workspace "WS_PAID_02" is on active "Pro Monthly" plan
    And the report has 1 existing row: plan=Pro, cycle=Monthly for "WS_PAID_02"
    When coach upgrades to "Studio Annual" plan
    And upgrade completes successfully
    Then the report for "WS_PAID_02" still has exactly 1 row
    And that row still shows plan=Pro, cycle=Monthly (unchanged)
```
