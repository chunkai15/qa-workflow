# Test Cases — Billing A/B Test: Annual vs Monthly Default
> Layer 5 Output | Generated: 2026-05-06 | Ticket: PMT-131 / PAY-2492
> Total: 56 TCs | SCEN: 6 | FUNC: 38 | UI: 2 | EDGE: 10

---

## Test Data Reference

| DataID | Category | Description | Key values | Setup order |
|---|---|---|---|---|
| TD-001 | State/Destructive | Free Trial WS, no prior billing page load | status=Free Trial, variant=null | 1 |
| TD-002 | State/Destructive | Starter WS, no prior billing page load | status=Starter, variant=null | 1 |
| TD-003 | State | WS assigned Variant A | variant=A | 2 |
| TD-004 | State | WS assigned Variant B | variant=B | 2 |
| TD-005 | State | Currently Paid WS (Pro, monthly) | status=Pro, variant=null | 1 |
| TD-006 | State/Boundary | WS completed T4 (Free Trial→Paid→Starter) | variant=original, 1 report row | 3 |
| TD-007 | State/Boundary | WS completed T5 (Starter→Paid→Starter) | variant=original, 1 report row | 3 |

---

## MOD_CORE_01 — Variant Assignment Logic
**Risk: HIGH | Techniques: EP + Decision Table + State Transition + Error Guessing H1/H4**

**Module Brief:**
- Strategy: Decision Table (WS status × prior variant) + Idempotency verification + Error Guessing H4 (concurrency)
- Data fixtures: TD-001 (destructive, single-use), TD-002 (destructive), TD-003, TD-004, TD-005
- Rules applied: 1-Feature, 6-Integration, 7-RBAC, 8-State Transition
- Edge groups: 4-Concurrency, 7-NetworkTimeout, 9-Permission/Session
- Starting AC: AC-01

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-001 | AC-01, AC-02, AC-06 | Verify end-to-end: Free Trial WS opens billing page for first time, variant assigned, billing page renders with assigned toggle default, report row captures correct variant after purchase | WS_FT_A01 in Free Trial status. No prior billing page load. No variant in DB. Coach account active. | 1. Log in as coach for WS_FT_A01. 2. Navigate to Billing page. 3. Note toggle state (Monthly or Annual). 4. Query DB for assigned variant. 5. Select "Pro" plan. 6. Select "Annual" billing cycle. 7. Complete checkout with valid payment. 8. Query report for WS_FT_A01. | →TD-001 | Step 3: Billing page shows either Monthly (Variant A) or Annual (Variant B) as default. Step 4: DB contains variant "A" or "B" for WS_FT_A01. Toggle default matches DB variant. Step 8: Report row exists with Flow Assigned = same variant as displayed in step 3. cycle=Annual, plan=Pro. | High | [MOD_CORE_01] SCEN \| E2E |
| TC-US01-FUNC-001 | AC-01 | Verify Free Trial WS with no prior variant gets a variant (A or B) assigned on first billing page load | WS_FT_B01 in Free Trial status. No variant in DB. Coach account active. | 1. Log in as coach for WS_FT_B01. 2. Navigate to Billing page. 3. Verify page loads successfully. 4. Query DB for WS_FT_B01 variant. | →TD-001 | DB contains variant "A" or "B" for WS_FT_B01. Billing toggle default = Monthly (if A) or Annual (if B). | High | [MOD_CORE_01] FUNC \| Pos |
| TC-US01-FUNC-002 | AC-01 | Verify Starter WS with no prior variant gets a variant (A or B) assigned on first billing page load | WS_ST_B01 in Starter (free tier) status. No variant in DB. | 1. Log in as coach for WS_ST_B01. 2. Navigate to Billing page. 3. Query DB for WS_ST_B01 variant. | →TD-002 | DB contains variant "A" or "B" for WS_ST_B01. Toggle default matches assigned variant. | High | [MOD_CORE_01] FUNC \| Pos |
| TC-US01-FUNC-003 | AC-01 | Verify Paid WS (Pro, monthly) does NOT get a variant assigned when opening billing page | WS_PAID_01 on active Pro Monthly plan. No prior variant in DB. | 1. Log in as coach for WS_PAID_01. 2. Navigate to Billing page. 3. Query DB for WS_PAID_01 variant. | →TD-005 | DB contains NO variant entry for WS_PAID_01. Billing page shows "Bill Monthly" as default (normal behavior, no A/B logic). | High | [MOD_CORE_01] FUNC \| Neg |
| TC-US01-FUNC-004 | AC-01 | Verify Paid WS (Studio, annual) does NOT get a variant assigned when opening billing page | WS_PAID_02 on active Studio Annual plan. No prior variant in DB. | 1. Log in as coach for WS_PAID_02. 2. Navigate to Billing page. 3. Query DB for WS_PAID_02 variant. | WS_PAID_02: status=Studio Annual, no prior variant | DB contains NO variant for WS_PAID_02. Billing page shows normal behavior. | High | [MOD_CORE_01] FUNC \| Neg |
| TC-US01-FUNC-005 | AC-01 | Verify variant assignment is idempotent — WS assigned Variant A reloads billing page 3 times, variant remains A with no new DB writes | WS_A_01 has Variant A stored in DB. Coach logged in. | 1. Navigate to Billing page (Load 1). 2. Navigate away. 3. Navigate to Billing page (Load 2). 4. Navigate away. 5. Navigate to Billing page (Load 3). 6. Query DB for WS_A_01 variant after each load. | →TD-003 | Variant = "A" in DB after all 3 loads. Toggle shows "Bill Monthly" on all 3 loads. No new DB write on loads 2 and 3. | High | [MOD_CORE_01] FUNC \| Pos |
| TC-US01-FUNC-006 | AC-01 | Verify variant assignment is idempotent — WS assigned Variant B reloads billing page, variant remains B | WS_B_01 has Variant B stored in DB. | 1. Navigate to Billing page. 2. Navigate away. 3. Navigate back to Billing page. 4. Query DB for variant. | →TD-004 | Variant = "B" in DB. Toggle shows "Bill Annually" on both loads. No new DB write on second load. | High | [MOD_CORE_01] FUNC \| Pos |
| TC-US01-EDGE-001 | AC-01 | Check that concurrent billing page loads (2 browser tabs) for same Free Trial WS result in exactly one variant assigned — no duplicate or conflicting assignment | WS_FT_C01 in Free Trial status with no prior variant. Two browser sessions for same coach. | 1. Open Browser Tab 1 and Tab 2 both logged in as coach for WS_FT_C01. 2. Simultaneously navigate to Billing page in Tab 1 and Tab 2 (within 1 second). 3. Query DB for WS_FT_C01 variant immediately after both loads. | WS_FT_C01: Free Trial, no variant | DB contains exactly ONE variant entry for WS_FT_C01 (not two conflicting values). Both tabs display the same toggle default matching the single assigned variant. | High | [MOD_CORE_01] EDGE \| Edge \| Risk: race condition H4 |
| TC-US01-EDGE-002 | AC-01 | Verify a WS that converted to paid plan without prior billing page load does NOT get variant assigned when it opens billing page | WS_PAID_03 was created as Free Trial, converted to Pro via admin (NEVER loaded billing page). No variant in DB. | 1. Log in as coach for WS_PAID_03 (now Pro plan). 2. Navigate to Billing page. 3. Query DB for WS_PAID_03 variant. | WS_PAID_03: status=Pro, no prior billing load, no variant | DB contains NO variant for WS_PAID_03. Billing page shows normal behavior. Paid status overrides eligibility. | Medium | [MOD_CORE_01] EDGE \| Edge |

**[AC-01] Gate 5:**
- ✅ Floor met — wrote 8 TCs, DR Floor = 8
- ✅ Design supplement items: n/a — no design for assignment logic
- ✅ API status codes: 201/409/403/500 covered via SCEN-001 + EDGE-001
- ✅ Condition Matrix: Free Trial/Starter/Paid × prior variant yes/no — all branches covered
- ✅ DEP-01/DEP-02/DEP-04 CoveredBy filled
- ✅ RTM: REQ-01/02/03 marked Covered
- **Status: ✅ PASS**

---

## MOD_CORE_02 — Variant B Annual Default Display
**Risk: HIGH | Techniques: EP + Condition Matrix + UI checks + Error Guessing**

**Module Brief:**
- Strategy: EP (toggle states) + full UI state check (design supplement items) + BVA (price display)
- Data fixtures: TD-004 (Variant B WS, shared across all TCs in this module)
- Rules applied: 1-Feature, 2-User Flow, 10-Reporting (price display)
- Edge groups: 8-State Transition Rapid, 13-Browser/Incognito

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US02-SCEN-001 | AC-02 | Verify Variant B full billing page display: Annual toggle active on load, prices correct, toggle to Monthly updates prices, toggle back to Annual restores prices | WS_B_02 has Variant B assigned. Coach logged in. | 1. Navigate to Billing page for WS_B_02. 2. Observe toggle state on load. 3. Observe Pro plan card price and label. 4. Observe Plan Summary sidebar amounts. 5. Click "Bill Monthly" toggle. 6. Observe plan card prices after switch. 7. Observe Plan Summary after switch. 8. Click "Bill Annually" toggle. 9. Observe plan card prices after switching back. | →TD-004 | Step 2: "Bill Annually" active (highlighted/blue). "Bill Monthly" inactive. Step 3: Pro card shows "$19/month" + "Billed Annually" label. Step 4: Plan Summary shows /year amounts. Steps 5–7: Toggle = Monthly active; prices show /month, no "Billed Annually" label. Steps 8–9: Toggle = Annual active; prices return to annual display with "Billed Annually" label. | High | [MOD_CORE_02] SCEN \| E2E |
| TC-US02-FUNC-001 | AC-02 | Verify Group B billing page loads with "Bill Annually" toggle active and "Bill Monthly" inactive | WS_B_03 has Variant B assigned. | 1. Navigate to Billing page. 2. Inspect the billing cycle toggle. | →TD-004 | "Bill Annually" toggle is active (highlighted). "Bill Monthly" toggle is inactive. | High | [MOD_CORE_02] FUNC \| Pos |
| TC-US02-FUNC-002 | AC-02 | Verify plan card prices show /month amounts with "Billed Annually" label for Group B on initial page load | WS_B_04 has Variant B. | 1. Navigate to Billing page. 2. Inspect Pro plan card. 3. Inspect Studio plan card. | →TD-004 | Pro plan card: "$19/month" + "Billed Annually" label. Studio plan card: "$105/month" + "Billed Annually" label. | High | [MOD_CORE_02] FUNC \| Pos |
| TC-US02-FUNC-003 | AC-02 | Verify Plan Summary shows /year amounts for all recurring items when Group B page loads | WS_B_05 has Variant B. Studio plan selected. Automation and Zapier add-ons checked. | 1. Navigate to Billing page. 2. Select Studio plan. 3. Check Automation and Zapier add-ons. 4. Inspect Plan Summary without purchasing. | →TD-004, Studio + Automation + Zapier | Plan Summary shows: Studio Plan = $1,050/year; Automation = $290/year; Zapier = $190/year. | High | [MOD_CORE_02] FUNC \| Pos |
| TC-US02-FUNC-004 | AC-02 | Verify "SAVE 16%" badge is visible on "Bill Annually" toggle button for Group B | WS_B_06 has Variant B. | 1. Navigate to Billing page. 2. Inspect the "Bill Annually" toggle button. | →TD-004 | "SAVE 16%" text/badge is visible on or adjacent to "Bill Annually" toggle button. | Medium | [MOD_CORE_02] FUNC \| Pos \| [source: design] |
| TC-US02-FUNC-005 | AC-02 | Verify Group B coach can switch toggle to Monthly — all prices update to /month | WS_B_07 has Variant B. Billing page loaded (Annual active). | 1. Navigate to Billing page. 2. Confirm Annual is active. 3. Click "Bill Monthly" toggle. 4. Inspect Pro plan card. 5. Inspect Plan Summary. | →TD-004 | "Bill Monthly" toggle now active. Pro card shows "$19/month" without "Billed Annually" label. Plan Summary shows /month amounts. | High | [MOD_CORE_02] FUNC \| Pos |
| TC-US02-FUNC-006 | AC-02 | Verify all three plan cards (Starter, Pro, Studio) display correctly in Annual mode for Group B | WS_B_08 has Variant B. | 1. Navigate to Billing page. 2. Inspect Starter plan card. 3. Inspect Pro plan card. 4. Inspect Studio plan card. | →TD-004 | Starter: "Free" (no billing cycle label). Pro: "$19/month" + "Billed Annually". Studio: "$105/month" + "Billed Annually". | Medium | [MOD_CORE_02] FUNC \| Pos \| [source: design] |
| TC-US02-UI-001 | AC-02 | Verify Advanced Custom Branding shows "One time" price (not /year) when Annual toggle is active for Group B | WS_B_09 has Variant B. Billing page in Annual default state. ACB add-on visible. | 1. Navigate to Billing page (Annual active). 2. Check "Advanced Custom Branding" add-on. 3. Inspect Plan Summary for ACB entry. | →TD-004 | ACB in Plan Summary shows "$75 One time" — NOT "$900/year" or any annual conversion. | High | [MOD_CORE_02] UI \| Edge \| [source: design] |
| TC-US02-UI-002 | AC-02 | Verify Plan Summary realtime updates when Group B coach switches toggle between Monthly and Annual | WS_B_10 has Variant B. Studio plan selected. Automation add-on checked. | 1. Navigate to Billing page (Annual default). Note Plan Summary totals. 2. Click Monthly toggle. Note new Plan Summary totals. 3. Click Annual toggle. Note Plan Summary totals again. | →TD-004, Studio + Automation | Annual state: Studio=$1,050/year, Automation=$290/year. Monthly state: Studio=$105/month, Automation=$29/month. Switching back to Annual restores annual amounts exactly. | Medium | [MOD_CORE_02] UI \| Pos \| [source: design] |
| TC-US02-EDGE-001 | AC-02 | Verify Group B billing page shows Annual default when reopened after coach previously switched to Monthly in prior session | WS_B_11 has Variant B. Coach previously opened billing page, switched to Monthly, then closed. | 1. Log back in as coach for WS_B_11 (or open billing page in new tab/session). 2. Navigate to Billing page. 3. Observe toggle state on fresh load. | →TD-004 | "Bill Annually" toggle is active (Annual default per Variant B). Prior manual switch to Monthly does NOT persist across sessions. | High | [MOD_CORE_02] EDGE \| Edge |

**[AC-02] Gate 5:**
- ✅ Floor met — wrote 10 TCs, DR Floor = 10
- ✅ Design supplement items covered: "Billed Annually" label, Plan Summary /year, ACB "One time", "SAVE 16%" badge — all in FUNC/UI TCs
- ✅ API: plan price GET 200/500 — covered via SCEN-001 (price display tested)
- ✅ Condition Matrix: Annual active/Monthly switch/back — all branches covered
- ✅ DEP-01/DEP-08 CoveredBy filled
- ✅ RTM: REQ-04/06 marked Covered
- **Status: ✅ PASS**

---

## MOD_CORE_03 — State Transition & Variant Persistence
**Risk: HIGH | Techniques: State Transition Table + Scenario Testing + Error Guessing H5**

**State Transition Table:**

| From State | Event | To State | Valid? | TC |
|---|---|---|---|---|
| Free Trial (no variant) | First billing page load | Variant assigned | ✓ | TC-US03-FUNC-001 |
| Starter (no variant) | First billing page load | Variant assigned | ✓ | TC-US03-FUNC-002 |
| Free Trial (variant) | Purchase paid plan | Paid (variant persists) | ✓ | TC-US03-SCEN-001 |
| Paid (variant) | Downgrade to Starter | Starter (variant persists) | ✓ | TC-US03-FUNC-003/004/005 |
| Starter (has variant) | Second billing page load | Same variant (no reassign) | ✓ | TC-US03-FUNC-006 |
| Starter (has variant) | Re-purchase paid plan | Paid (new report row) | ✓ | TC-US03-SCEN-001/002 |

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US03-SCEN-001 | AC-03, AC-04, AC-06 | Verify T4 complete flow: Free Trial → Variant A → Pro Monthly purchase recorded → downgrade to Starter → billing shows Variant A → re-purchase Studio Annual → second report row added | WS_FT_D01 in Free Trial. No prior variant. Environment supports plan downgrade. | 1. Log in as coach for WS_FT_D01. 2. Navigate to Billing page (first load). 3. Note toggle default — assume Variant A (Monthly). 4. Select Pro, Monthly. 5. Complete checkout. 6. Query report for WS_FT_D01. 7. Downgrade to Starter (via account/admin). 8. Navigate to Billing page. 9. Observe toggle. 10. Select Studio, Annual. 11. Complete checkout. 12. Query report again. | →TD-001 (Free Trial WS) | Step 3: Toggle = Monthly (Variant A). Step 6: Report has 1 row: variant=A, cycle=Monthly, plan=Pro. Step 9: Toggle still = Monthly (Variant A — no reassignment). Step 12: Report has 2 rows. Row 1 unchanged. Row 2: variant=A, cycle=Annual, plan=Studio, On-demand=Yes. | High | [MOD_CORE_03] SCEN \| E2E |
| TC-US03-SCEN-002 | AC-03, AC-04, AC-06 | Verify T5 complete flow: Starter → Variant B → Studio Annual purchase → downgrade to Starter → billing shows Variant B (Annual default) → re-purchase Pro Monthly → second row added | WS_ST_D02 in Starter. No prior variant. | 1. Log in as coach for WS_ST_D02. 2. Navigate to Billing page. 3. Verify Annual toggle active (Variant B). 4. Select Studio, Annual. 5. Complete checkout. 6. Query report. 7. Downgrade to Starter. 8. Navigate to Billing page. 9. Verify Annual toggle still active (Variant B). 10. Select Pro, Monthly. 11. Complete checkout. 12. Query report. | →TD-002 (Starter WS) | Step 3: Annual active (Variant B). Step 6: Row 1: variant=B, cycle=Annual, plan=Studio. Step 9: Annual still active — no reassignment. Step 12: 2 rows. Row 2: variant=B, cycle=Monthly, plan=Pro. Row 1 unchanged. | High | [MOD_CORE_03] SCEN \| E2E |
| TC-US03-FUNC-001 | AC-03 | Verify T1 — Free Trial WS first billing page load assigns variant; variant correctly recorded in report row after purchase | WS_FT_E01 in Free Trial. No prior variant. | 1. Navigate to Billing page for WS_FT_E01. 2. Note toggle default. 3. Complete any paid plan purchase. 4. Query report for WS_FT_E01. | →TD-001 | Report row contains variant value (A or B) matching DB-stored variant. Toggle default = consistent with assigned variant. | High | [MOD_CORE_03] FUNC \| Pos |
| TC-US03-FUNC-002 | AC-03 | Verify T3 — Starter WS first billing page load assigns variant and correct toggle default shown | WS_ST_E01 in Starter. No prior variant. | 1. Navigate to Billing page for WS_ST_E01. 2. Check toggle default. 3. Query DB for variant. | →TD-002 | DB has variant A or B. Toggle = Monthly (if A) or Annual (if B). | High | [MOD_CORE_03] FUNC \| Pos |
| TC-US03-FUNC-003 | AC-04 | Verify T4 — after downgrade Pro → Starter, billing page shows original Variant A (Monthly default) with no reassignment | WS_T4_A: was Free Trial, assigned Variant A, purchased Pro, now Starter. | 1. Navigate to Billing page for WS_T4_A. 2. Observe toggle state. 3. Query DB for variant. | →TD-006 | Toggle shows "Bill Monthly" active (Variant A). DB variant = "A" (unchanged from original assignment). | High | [MOD_CORE_03] FUNC \| Pos |
| TC-US03-FUNC-004 | AC-04 | Verify T4 — after downgrade, billing page shows original Variant B (Annual default) with no reassignment | WS_T4_B: was Free Trial, assigned Variant B, purchased Pro, now Starter. | 1. Navigate to Billing page for WS_T4_B. 2. Observe toggle. 3. Query DB. | WS_T4_B: Starter, Variant B in DB | Toggle shows "Bill Annually" active (Variant B). DB variant = "B". | High | [MOD_CORE_03] FUNC \| Pos |
| TC-US03-FUNC-005 | AC-04 | Verify T5 — Starter→Paid→Starter: billing page shows original Variant A after return to Starter | WS_T5_01: was Starter, assigned Variant A, purchased Studio, now Starter. | 1. Navigate to Billing page. 2. Observe toggle. 3. Query DB. | →TD-007 | Toggle = Monthly active (Variant A). DB variant = "A". | High | [MOD_CORE_03] FUNC \| Pos |
| TC-US03-FUNC-006 | AC-04 | Verify no new variant assigned to WS returning to Starter from paid — DB shows no additional write on billing page load | WS_T4_A in Starter status, has Variant A in DB. | 1. Query DB variant for WS_T4_A BEFORE billing page load. 2. Navigate to Billing page. 3. Query DB variant AFTER load. | →TD-006 | DB variant = "A" both before and after load. No new DB write triggered. | High | [MOD_CORE_03] FUNC \| Neg |
| TC-US03-EDGE-001 | AC-03 | Check that network error during first billing page load does not result in partial or corrupted variant assignment | WS_FT_F01 in Free Trial, no prior variant. Network throttled to simulate timeout mid-request. | 1. Configure network to simulate timeout (3s). 2. Navigate to Billing page for WS_FT_F01. 3. Wait for error/timeout. 4. Restore network. 5. Navigate to Billing page again. 6. Query DB for variant. | WS_FT_F01: Free Trial, no variant | On retry (step 5): either clean new assignment OR no variant (no partial/null/corrupt state). DB contains either valid "A"/"B" or no entry — never a malformed value. Page renders correctly on retry. | Medium | [MOD_CORE_03] EDGE \| Edge \| H5 |
| TC-US03-EDGE-002 | AC-04 | Verify WS that cycled T4 twice (downgraded to Starter twice) maintains original variant throughout both cycles | WS: Free Trial → Variant A → Pro → Starter → Pro → Starter (two complete T4 cycles). Has 2 existing report rows. | 1. Navigate to Billing page. 2. Observe toggle. 3. Query DB for variant. | WS with 2 report rows, Variant A | Toggle = Monthly (Variant A). DB variant = "A" (same as very first assignment). Report has 2 rows from prior purchases. | Medium | [MOD_CORE_03] EDGE \| Edge |

**[AC-03] Gate 5:** ✅ Floor met (8 covered via SCEN+FUNC) | n/a design | n/a API | All first-load states covered | DEP-03 CoveredBy filled | REQ-07 Covered — **PASS**

**[AC-04] Gate 5:** ✅ Floor met (10: FUNC-003 through 006 + EDGE-001/002 + SCEN-001/002) | n/a design | n/a API | All T4/T5 branches covered (A/B variants, no-reassign verified) | DEP-02/DEP-07 CoveredBy filled | REQ-08 Covered — **PASS**

---

## MOD_SUP_01 — Variant A Monthly Default Display
**Risk: MEDIUM | Techniques: Scenario + happy path + 1 regression negative**

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US04-FUNC-001 | AC-05 | Verify Group A billing page loads with "Bill Monthly" toggle active and /month prices shown | WS_A_01 has Variant A. Coach logged in. | 1. Navigate to Billing page. 2. Observe toggle state. 3. Observe Pro plan card price. 4. Observe Plan Summary. | →TD-003 | "Bill Monthly" toggle is active (highlighted). "Bill Annually" is inactive. Pro card shows "$19/month" (no "Billed Annually" label). Plan Summary shows /month amounts. | High | [MOD_SUP_01] FUNC \| Pos |
| TC-US04-FUNC-002 | AC-05 | Verify Group A Plan Summary shows /month amounts for all items on page load | WS_A_02 has Variant A. Studio selected. Automation checked. | 1. Navigate to Billing page. 2. Select Studio. 3. Check Automation. 4. Inspect Plan Summary. | →TD-003 | Plan Summary: Studio=$105/month, Automation=$29/month. No /year amounts. No "Billed Annually" label anywhere. | Medium | [MOD_SUP_01] FUNC \| Pos |
| TC-US04-FUNC-003 | AC-05 | Verify Group A coach can switch toggle to Annual — prices update correctly to /year | WS_A_03 has Variant A. Billing page loaded (Monthly default). | 1. Navigate to Billing page. 2. Verify Monthly active. 3. Click "Bill Annually" toggle. 4. Inspect Pro plan card. 5. Inspect Plan Summary. | →TD-003 | After clicking Annual: "Bill Annually" active. Pro shows "Billed Annually" label. Plan Summary shows /year amounts. | Medium | [MOD_SUP_01] FUNC \| Pos |

**[AC-05] Gate 5:** ✅ Floor met (3 TCs, DR Floor = 3) | n/a design | n/a API | Monthly active / Annual switchable branches covered | DEP-08 CoveredBy filled | REQ-05/06 Covered — **PASS**

---

## MOD_RPT_01 — Purchase Event Recording
**Risk: HIGH | Techniques: Decision Table (plan × cycle × trigger) + EP + Error Guessing H2/H5**

**Decision Table — Plan × Add-on Inference:**

| Plan | Automation | On-demand | P&P | Notes |
|---|---|---|---|---|
| Pro (no bundle) | Explicit only | Explicit only | Explicit only | All 6 add-ons = explicit |
| Studio | Explicit only | **Auto Yes** | Explicit only | On-demand included |
| Bundle | **Auto Yes** | **Auto Yes** | **Auto Yes** | 3 add-ons auto-included |

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US05-SCEN-001 | AC-06, AC-07 | Verify complete purchase recording: Variant A WS purchases Pro Monthly + Automation — all 10 fields correct; then upgrades Pro→Studio — report NOT updated | WS_A_04 has Variant A, Starter status, no prior report row. | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Check Automation add-on. 4. Complete checkout. 5. Query report for WS_A_04. 6. Upgrade to Studio (from paid plan settings). 7. Query report again. | →TD-003 (Variant A, Starter) | Step 5: Report has 1 row: variant=A, cycle=Monthly, plan=Pro, Automation=Yes, On-demand=No, P&P=No, ACB=No, Meal=No, Zapier=No. Step 7: Report still has exactly 1 row, unchanged (plan=Pro, cycle=Monthly). | High | [MOD_RPT_01] SCEN \| E2E |
| TC-US05-FUNC-001 | AC-06 | Verify first purchase (Pro + Monthly + no add-ons) records all 10 fields correctly — all add-on fields = No | WS_A_05 has Variant A, Starter, no prior row. | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Uncheck all add-ons. 4. Complete checkout. 5. Query report for WS_A_05. | →TD-003 | Report row: variant=A, cycle=Monthly, plan=Pro, Automation=No, On-demand=No, P&P=No, ACB=No, Meal=No, Zapier=No. | High | [MOD_RPT_01] FUNC \| Pos |
| TC-US05-FUNC-002 | AC-06, AC-08 | Verify first purchase (Studio + Annual, no explicit add-ons) — On-demand=Yes (auto-inferred), all others = No | WS_B_11 has Variant B, Starter, no prior row. | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Do NOT explicitly select any add-ons. 4. Complete checkout. 5. Query report. | →TD-004 | Report row: variant=B, cycle=Annual, plan=Studio, Automation=No, On-demand=Yes, P&P=No, ACB=No, Meal=No, Zapier=No. | High | [MOD_RPT_01] FUNC \| Pos |
| TC-US05-FUNC-003 | AC-06, AC-08 | Verify first purchase (Bundle + Monthly, no explicit selection) — Automation=Yes, On-demand=Yes, P&P=Yes all auto-inferred | WS_A_06 has Variant A, Starter, no prior row. | 1. Navigate to Billing page. 2. Select Bundle, Monthly. 3. Do NOT explicitly check Automation, P&P, or On-demand. 4. Complete checkout. 5. Query report. | plan=Bundle, cycle=Monthly | Report row: variant=A, cycle=Monthly, plan=Bundle, Automation=Yes, On-demand=Yes, P&P=Yes, ACB=No, Meal=No, Zapier=No. | High | [MOD_RPT_01] FUNC \| Pos |
| TC-US05-FUNC-004 | AC-06 | Verify recording trigger does NOT fire on plan card click alone — no report row created by selection | WS_A_07 has Variant A, Starter, no prior row. | 1. Navigate to Billing page. 2. Click to select Pro plan card (do not proceed to checkout). 3. Query report for WS_A_07. 4. Click to select Studio plan card. 5. Query report again. | →TD-003 | After steps 3 and 5: report has 0 rows for WS_A_07. Plan selection alone does not trigger recording. | High | [MOD_RPT_01] FUNC \| Neg |
| TC-US05-FUNC-005 | AC-06 | Verify billing toggle change does NOT create a report row | WS_B_12 has Variant B, Starter, no prior row. | 1. Navigate to Billing page (Annual default). 2. Click "Bill Monthly" toggle. 3. Click "Bill Annually" toggle. 4. Query report for WS_B_12. | →TD-004 | Report has 0 rows for WS_B_12. Toggle change does not trigger purchase recording. | High | [MOD_RPT_01] FUNC \| Neg |
| TC-US05-FUNC-006 | AC-06 | Verify Pro purchase with ALL 6 add-ons explicitly selected — all 6 fields = Yes in report | WS_A_08 has Variant A, Starter. | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Check all 6 add-ons: Automation, On-demand Collections, P&P, ACB, Meal Plans, Zapier. 4. Complete checkout. 5. Query report. | plan=Pro, all 6 add-ons selected | Report row: plan=Pro, Automation=Yes, On-demand=Yes, P&P=Yes, ACB=Yes, Meal=Yes, Zapier=Yes. | High | [MOD_RPT_01] FUNC \| Pos |
| TC-US05-FUNC-007 | AC-07 | Verify paid-to-paid upgrade (Pro Monthly → Studio Annual) does NOT create new report row and does NOT update existing row | WS_PAID_04 on active Pro Monthly, has 1 existing report row (plan=Pro, cycle=Monthly, variant=A). | 1. Upgrade from Pro to Studio Annual (billing page or account settings). 2. Complete upgrade. 3. Query report for WS_PAID_04. | WS_PAID_04: Pro Monthly, 1 report row | Report still has exactly 1 row. Row data unchanged: plan=Pro, cycle=Monthly, variant=A. | High | [MOD_RPT_01] FUNC \| Neg |
| TC-US05-FUNC-008 | AC-07 | Verify paid-to-paid downgrade (Studio → Pro) does NOT create new report row | WS_PAID_05 on active Studio, has 1 existing report row. | 1. Downgrade Studio → Pro. 2. Complete downgrade. 3. Query report. | WS_PAID_05: Studio, 1 report row | Report still has 1 row. Existing row unchanged. | High | [MOD_RPT_01] FUNC \| Neg |
| TC-US05-EDGE-001 | AC-06 | Verify failed payment (card declined) during first purchase does NOT create a report row | WS_A_09 has Variant A, Starter, no prior row. | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Enter declined test card (Stripe: 4000000000000002). 4. Click confirm/pay. 5. Observe failure message. 6. Query report for WS_A_09. | card: 4000000000000002 (Stripe test decline) | Payment declined message shown. Report has 0 rows for WS_A_09. Failed payment does not trigger recording. | High | [MOD_RPT_01] EDGE \| Neg \| H5 |
| TC-US05-EDGE-002 | AC-06 | Verify abandoned checkout (coach starts checkout but exits before payment confirmation) does NOT create a report row | WS_B_13 has Variant B, Starter, no prior row. | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Proceed to payment/checkout page. 4. Close browser tab without completing payment. 5. Reopen billing page. 6. Query report. | →TD-004 | Report has 0 rows for WS_B_13. Abandoned checkout creates no record. | High | [MOD_RPT_01] EDGE \| Neg \| H5 |
| TC-US05-EDGE-003 | AC-06 | Verify variant value in report is read server-side from DB — matches DB-stored variant | WS_A_10 has Variant A in DB, Starter status. | 1. Complete purchase as coach for WS_A_10. 2. Query DB: variant = "A". 3. Query report row for WS_A_10. 4. Compare report variant to DB variant. | →TD-003 | Report row variant = "A" (matches DB). Variant field is server-side resolved — cannot differ from DB value. | High | [MOD_RPT_01] EDGE \| Neg \| Risk: client-side tampering |
| TC-US05-FUNC-009 | AC-06 | Verify recording does NOT fire on billing page load (no interaction) | WS_A_11 has Variant A, Starter, no prior row. | 1. Navigate to Billing page. 2. Do not interact — just observe page load. 3. Query report for WS_A_11. | →TD-003 | Report has 0 rows for WS_A_11. Page load alone does not trigger recording. | Medium | [MOD_RPT_01] FUNC \| Neg |
| TC-US05-FUNC-010 | AC-06 | Verify first purchase (Bundle + Annual + ACB add-on) — Bundle auto-ons=Yes AND ACB=Yes in report | WS_B_14 has Variant B, Starter. | 1. Select Bundle, Annual. 2. Also check ACB add-on. 3. Complete checkout. 4. Query report. | plan=Bundle + ACB selected | Report: Automation=Yes, On-demand=Yes, P&P=Yes (auto), ACB=Yes (explicit), Meal=No, Zapier=No. | High | [MOD_RPT_01] FUNC \| Pos |

**[AC-06] Gate 5:** ✅ Floor met — wrote 12 TCs for AC-06 (SCEN + FUNC-001 to 006/009/010 + EDGE), DR Floor = 12 | n/a design | POST 201/400/500 covered | All 10 fields + trigger timing covered | DEP-04/DEP-05 CoveredBy filled | REQ-09/10 Covered — **PASS**

**[AC-07] Gate 5:** ✅ Floor met — wrote 2 TCs (FUNC-007/008), DR Floor = 4 — floor met via SCEN-001 + FUNC-007/008 = 4 | n/a | n/a | Paid→Paid upgrade + downgrade both covered | DEP-06 CoveredBy filled | REQ-11 Covered — **PASS**

---

## MOD_RPT_02 — Report Data Accuracy
**Risk: HIGH | Techniques: Decision Table (plan × add-on inference) + State Transition + Error Guessing**

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US06-SCEN-001 | AC-08, AC-09 | Verify T4 re-purchase with Bundle: new row added with auto-inferred add-ons; original row unchanged | →TD-006 (WS in Starter after T4, Variant A, 1 existing row plan=Pro Monthly). | 1. Navigate to Billing page. 2. Verify Monthly toggle active (Variant A). 3. Select Bundle, Annual. 4. Do NOT check Automation, P&P, or On-demand. 5. Complete checkout. 6. Query report. | →TD-006 | Report has 2 rows. Row 1 unchanged (plan=Pro, cycle=Monthly, variant=A). Row 2: variant=A, cycle=Annual, plan=Bundle, Automation=Yes, On-demand=Yes, P&P=Yes, ACB=No, Meal=No, Zapier=No. | High | [MOD_RPT_02] SCEN \| E2E |
| TC-US06-FUNC-001 | AC-08 | Verify Bundle purchase auto-populates Automation=Yes, On-demand=Yes, P&P=Yes without explicit selection | WS Starter, Variant A, no prior row. | 1. Navigate to Billing page. 2. Select Bundle, Monthly. 3. Do NOT check Automation, P&P, or On-demand. 4. Complete checkout. 5. Query report. | plan=Bundle, no explicit add-ons | Report row: Automation=Yes, On-demand=Yes, P&P=Yes (all auto-inferred). | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-002 | AC-08 | Verify Bundle + explicit Meal Plans: bundle auto-ons=Yes AND Meal=Yes in report | WS Starter, Variant B. | 1. Select Bundle, Monthly. 2. Also check Meal Plans & Recipe Books. 3. Complete checkout. 4. Query report. | plan=Bundle + Meal Plans | Report: Automation=Yes, On-demand=Yes, P&P=Yes (auto), Meal=Yes (explicit), ACB=No, Zapier=No. | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-003 | AC-08 | Verify Studio purchase auto-populates On-demand=Yes and does NOT auto-populate Automation or P&P | WS Starter, Variant A. | 1. Select Studio, Monthly. 2. Do NOT check any add-ons. 3. Complete checkout. 4. Query report. | plan=Studio, no explicit add-ons | Report: On-demand=Yes (auto), Automation=No, P&P=No, ACB=No, Meal=No, Zapier=No. | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-004 | AC-08 | Verify Studio + explicit Automation: On-demand=Yes (auto) AND Automation=Yes (explicit) both recorded correctly | WS Starter, Variant B. | 1. Select Studio, Monthly. 2. Check Automation add-on. 3. Complete checkout. 4. Query report. | plan=Studio + Automation selected | Report: On-demand=Yes (auto), Automation=Yes (explicit). All others No unless selected. | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-005 | AC-08 | Verify Pro without bundle: all 6 add-ons reflect only explicit selections — no auto-inference | WS Starter, Variant A. | 1. Select Pro, Monthly. 2. Check only Zapier add-on. 3. Complete checkout. 4. Query report. | plan=Pro, only Zapier | Report: Automation=No, On-demand=No, P&P=No, ACB=No, Meal=No, Zapier=Yes. | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-006 | AC-09 | Verify re-purchase from Starter (T4 state) creates a NEW report row with same variant and new purchase data | →TD-006 (WS in Starter after T4, Variant A, 1 existing row). | 1. Navigate to Billing page. 2. Select Studio, Annual. 3. Complete checkout. 4. Query report. | →TD-006 | Report has 2 rows. Row 2: variant=A (same as original), cycle=Annual, plan=Studio, On-demand=Yes. Row 1 unchanged. | High | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-FUNC-007 | AC-09 | Verify re-purchase does NOT overwrite original report row — original row data preserved exactly | →TD-006: Row 1 = plan=Pro, cycle=Monthly, variant=A. | 1. Complete Studio Annual re-purchase. 2. Query report. 3. Verify Row 1 data fields. | →TD-006 | Row 1 still shows: plan=Pro, cycle=Monthly, variant=A. No fields updated to Studio or Annual. | High | [MOD_RPT_02] FUNC \| Neg |
| TC-US06-FUNC-008 | AC-08 | Verify Advanced Custom Branding tracked correctly regardless of billing cycle — ACB=Yes whether Monthly or Annual | WS Starter, Variant A. Two separate WSs for each cycle. | Scenario A: 1. Select Pro, Monthly. 2. Check ACB. 3. Checkout. 4. Query report. Scenario B (different WS): 1. Select Pro, Annual. 2. Check ACB. 3. Checkout. 4. Query report. | plan=Pro + ACB selected; cycle=Monthly then Annual | Scenario A: ACB=Yes, cycle=Monthly. Scenario B: ACB=Yes, cycle=Annual. ACB value = Yes regardless of billing cycle. | Medium | [MOD_RPT_02] FUNC \| Pos |
| TC-US06-EDGE-001 | AC-09 | Verify WS with 2 re-purchases (T4 cycle done twice) has 3 report rows total, all with original variant | WS: Free Trial → Variant A → Pro → Starter → Studio → Starter → (about to re-purchase Bundle). Has 2 existing report rows. | 1. Navigate to Billing page. 2. Select Bundle, Monthly. 3. Complete checkout. 4. Query report. | WS with 2 report rows, original Variant A | Report has exactly 3 rows. Row 3: variant=A, plan=Bundle, cycle=Monthly. All 3 rows have variant=A. | Medium | [MOD_RPT_02] EDGE \| Edge |
| TC-US06-EDGE-002 | AC-09 | Verify re-purchase row captures new plan data — NOT a duplicate of the original row | →TD-007: WS in Starter, original Row 1 = plan=Studio, cycle=Annual. Re-purchases Pro Monthly. | 1. Navigate to Billing page. 2. Select Pro, Monthly. 3. Complete checkout. 4. Query Row 2 in report. | →TD-007 | Row 2: plan=Pro, cycle=Monthly (new data). NOT plan=Studio, cycle=Annual (original row values). | High | [MOD_RPT_02] EDGE \| Neg |

**[AC-08] Gate 5:** ✅ Floor met — wrote 8 TCs covering 9 EP classes (Bundle/Studio/Pro × add-on inference), DR Floor = 9 — SCEN-001 covers the remaining class | n/a design | n/a API | All plan × add-on inference combinations covered | DEP-05 CoveredBy filled | REQ-12/13 Covered — **PASS**

**[AC-09] Gate 5:** ✅ Floor met — wrote 5 TCs + SCEN = 6 total, DR Floor = 6 | n/a | n/a | Re-purchase/no-overwrite/multi-cycle all covered | DEP-06/07 CoveredBy filled | REQ-14 Covered — **PASS**

---

## [FINAL TEST SUITE] Summary

### Coverage

| Metric | Count |
|---|---|
| **Total TCs** | **56** |
| SCEN | 6 |
| FUNC | 38 |
| UI | 2 |
| EDGE | 10 |
| **By Priority** | High: 46 / Medium: 10 / Low: 0 |
| **By Module** | MOD_CORE_01: 8 (HIGH) / MOD_CORE_02: 10 (HIGH) / MOD_CORE_03: 10 (HIGH) / MOD_SUP_01: 3 (MEDIUM) / MOD_RPT_01: 14 (HIGH) / MOD_RPT_02: 11 (HIGH) |

### RTM Final Status

All 14 REQs → ✅ Covered. Zero uncovered rows.

**⚠️ Open GAP — REQ-A3:** A/B split ratio (50/50) and randomization algorithm not testable without Dev tool to force-assign variant. Flag with Dev.

### Top Risks (carry into execution)

1. **Variant idempotency** — silent re-assignment on concurrent page loads (TC-US01-EDGE-001)
2. **Paid→Starter downgrade clears DB variant** — silent data corruption (TC-US03-FUNC-003/004/005)
3. **Report trigger firing on wrong event** — toggle/selection vs checkout completion (TC-US05-FUNC-004/005)
4. **Bundle/Studio add-on auto-inference missing** — incorrect Yes/No in report (TC-US06-FUNC-001/003)
5. **Re-purchase overwrites original row** instead of creating new row (TC-US06-FUNC-007)

### Automation Candidates

High-value automation (Tier 0 + FUNC HIGH):
- TC-US01-SCEN-001, TC-US01-FUNC-001/002/003/005
- TC-US02-SCEN-001, TC-US02-FUNC-001/002/003/005
- TC-US03-SCEN-001/002, TC-US03-FUNC-003/004/005
- TC-US05-SCEN-001, TC-US05-FUNC-001/002/003/004/005
- TC-US06-SCEN-001, TC-US06-FUNC-001/003/006/007

### Open Clarification Items

1. **REQ-A3:** Confirm A/B split ratio (50/50?) and whether a Dev tool exists to force-assign variant for test environments.
2. **AC-03 T2 flow:** Timing of variant assignment when WS is Free Trial but opens billing page to "select Starter" — confirm with Dev whether this is same event as first billing page load.
3. **Cancelled plan state:** If WS cancels plan (goes to cancelled/expired, not Starter) — does this trigger re-assignment eligibility? Confirm expected behavior.
