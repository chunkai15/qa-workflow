# Analysis — Epic E1: Package Pricing Pop-up Setup
## Session Credits P3.1 — Package Issuance
**Scope:** US1 AC1–AC15 | **Pipeline:** Layer 1 (MASTER CONTEXT) + Layer 2 (MODULE LIST + RISK REGISTER)
**Last updated:** 2026-05-16

---

## [MASTER CONTEXT]

**Feature Purpose:**
Session Credits P3.1 — Package Pricing Pop-up (E1) enables the Coach (Owner/Admin/Trainer) to configure a Pricing Plan, optional Free Trial, and optional Session Credit rules on a package, so that clients can be charged automatically and session credits issued without manual coach intervention.

---

### Business Flows

| Flow | Actor | Entry point | Consequence if fail |
|---|---|---|---|
| Connect Stripe (no-payment path) | Coach | Click "Add Pricing" when Stripe not connected | Coach blocked from selling packages; no revenue |
| Configure Pricing Plan | Coach | Click "Add Pricing" / edit icon when Stripe connected | Package unpriceable → cannot publish or monetise |
| Enable Free Trial | Coach | Toggle Free Trial ON in Pricing pop-up | No trial available → clients must commit without trying |
| Configure Session Credits | Coach | Toggle Session Credits ON | Credits not auto-issued → manual issuance required every time |
| Save pricing (Update Pricing) | Coach + System | Click "Update Pricing" | Config lost → wrong pricing or no credits on purchase |
| Race condition: session type deactivated mid-edit | System | On Update Pricing click with now-invalid session type | Toast shown, row removed, button disabled → coach must re-select |

---

### Actor Map

| Role | Goal | Entry point | Permission boundary |
|---|---|---|---|
| Coach (Owner/Admin/Trainer) | Configure + save package pricing, trial, session credits | Package Overview → "Add Pricing" or edit icon | Must have PP add-on ON + Booking ON; cannot change pricing model after publish |
| System/API | Validate session type eligibility at save-time | Triggered by "Update Pricing" | Re-validates against live session type state (not cached) |

---

### Key Rules

1. WS must have Booking feature enabled AND Payment & Packages add-on ON
2. Coach must be Owner, Admin, or Trainer
3. Session type must be `active` AND `require_credit = true` to appear in Session Credits dropdown
4. Max 5 session types per package; each type at most once per package
5. Credits per type: integer, min 1, max 100 (required)
6. Billing cycle: integer, min 1, max 12; unit = Weeks or Months
7. **Update Pricing button** disabled until ALL of: Pricing Plan required fields valid AND (if credits toggle ON) all credit rows valid
8. Free Trial and Session Credits toggles are independent; both can be ON simultaneously
9. When both Free Trial ON + Session Credits ON: message shown that credits issue AFTER trial ends + first payment
10. Session Credits expiration: two options — "Never" (no expiration) or "Expires after N {months|weeks|days}"
11. AC15 message text uses coach's custom user terminology (not hardcoded "client")
12. Session type dropdown filters out already-selected types across rows
13. "Add Session Credits" button disabled when 5 session types already added
14. Delete button hidden when only 1 row remains; shown at 2+ rows
15. Race condition on save: if session type deactivated between selection and "Update Pricing" click → toast + row removed + field cleared to placeholder + button disabled

---

### Data Flow

```
Coach UI (Package Pricing pop-up)
  → POST/PATCH /packages/:id (UpdatePackageDto + SessionCreditsDto)
    → Validate Pricing Plan (Stripe min/max per currency)
    → If session_credits.enabled: validate each rule (qty, expiration, session type status)
    → booking-service GET /v1/session-types — check active + require_credit=true
    → Persist: package_credit_rules (replace set)
  → Response: PackageModelRes with session_credits
  → UI: Package Overview refreshes with PRICING PLAN + SESSION CREDIT blocks
```

---

### Field Specifications

| Field | Type | Validation Rules | Error Message | Notes |
|---|---|---|---|---|
| Pricing model | Dropdown | Required when saving | — | "One-time Payment" / "Recurring Subscription" |
| Price | Number | Stripe per-currency min/max; required | "Minimum value is {min}." / "Maximum value is {max}." | USD: min $0.50, max $999,999.99 (assumption A1) |
| Billing cycle number | Integer | 1–12, required when Recurring | "Minimum value is 1." / "Maximum value is 12." | Integer only, no decimals |
| Billing cycle unit | Dropdown | Required when Recurring | — | Weeks / Months |
| Expiration (billing) | Dropdown | Required when Recurring | — | Never (default) / Ends after |
| Invoices (fixed-term) | Integer | ≥1, per P1.1 validation | Per P1.1 | Default 2; shown only when "Ends after" selected |
| Free Trial Period | Dropdown | Required when Free Trial ON | — | Default: 7 days |
| Session type (per row) | Dropdown | Active + require_credit=true; required when credits ON | "Please select session type." | Max 5, no duplicates; filtered per selected |
| Credits (per row) | Integer | 1–100; required when credits ON | "Please set a number of credits." / "Amount must be greater than 0." / "Amount must not exceed 100." | Default 1; stepper (up/down arrows) |
| Expiration type (per row) | Dropdown | Required when credits ON | — | **Never** / Expires after |
| Expiration number (per row) | Integer | ≥1; required when "Expires after" selected | "Please set a duration." | Per P1.1 validation |
| Expiration unit (per row) | Dropdown | Required when "Expires after" selected | — | months (default) / weeks / days |

---

### Risk Identification

1. **Data integrity:** "Update Pricing" saves pricing + credits atomically — partial save (pricing OK, credits fail) must not occur
2. **Race condition:** session type archived between dropdown selection and "Update Pricing" → server must re-validate; UI must handle gracefully (DS-6)
3. **Business logic gap:** AC5 (button gating) — button disabled when credits toggle ON + any credit row invalid (Q1 resolved: disabled)
4. **UI state:** toggling Session Credits OFF then ON → spec (AC18) says collapse to default; unclear if previously configured data is lost or preserved
5. **Terminology:** AC15 message uses custom user term (Q3 resolved); must verify terminology substitution works in this specific message location
6. **Expiration scope:** AC12 now has "Never" as valid option (Q2 resolved) — TCs must cover "Never" + "Expires after" for session credit expiration
7. **Integration:** booking-service live lookup for session types — failure/timeout must degrade gracefully (not crash save flow)
8. **Concurrent tab:** coach edits session type to inactive in Tab B while Tab A has Pricing pop-up open → on Update Pricing in Tab A → race condition (AC17 out of E1 scope but flows from E1 config)

---

### Resolved Assumptions

- **A1.** Price min/max = Stripe per-currency (USD example: $0.50 min, $999,999.99 max)
- **A2.** Billing cycle "validation as current" = integer-only, range 1–12
- **A3.** AC10 Total formula = price × invoices (e.g., $100/month × 3 = $300 Over 3 months)
- **A4.** Session Credits expiration has two options: "Never" + "Expires after" (Q2 confirmed)
- **A5.** Figma analysis from 4 user-provided screenshots (MCP rate limit reached)

### Resolved QnA

- **Q1 → Disabled:** Update Pricing disabled when credits toggle ON + any credit field invalid
- **Q2 → "Never" is valid:** Session Credits expiration dropdown has "Never" + "Expires after"
- **Q3 → Custom term:** AC15 message uses coach's configured user terminology

---

### Design Supplements

| Code | AC | Design-only finding | Source |
|---|---|---|---|
| DS-1 | AC5, AC12 | Pop-up: min-height 508px; max-height 700px; body scrolls when overflow; Cancel + Update Pricing footer sticky | Design |
| DS-2 | AC13 | Session type row shows: color dot, name, duration, location icon (e.g., "30 min · ⊕ ·") | Design |
| DS-3 | AC12 | Credits input has stepper arrows (up/down) beside number field | Design |
| DS-4 | AC12 | Expiration row = 3 separate controls: "Expires after" dropdown + number input + unit dropdown | Design |
| DS-5 | AC12 | When Session Credits toggle ON but no type selected: placeholder shown, credits=1, expiration defaults pre-set | Design |
| DS-6 | AC17* | Inactive type on save: row REMOVED entirely → replaced with blank placeholder + error; toast fires simultaneously | Design |
| DS-7 | AC15 | Free Trial ON + Session Credits ON: full content scrolls; header "Package Pricing" + footer buttons sticky | Design |
| DS-8 | AC16* | Multiple row errors: each row shows its own inline error (not global summary) | Design |
| DS-9 | AC16* | Error "Must be greater than 0." shown when credits = 0 (stepper-driven) | Design |

*AC16, AC17 are E2 scope; DS-6/8/9 noted here for cross-epic continuity.

---

### Then-bullet Inventory

| AC | Then-bullets (key items) | min_hint |
|---|---|---|
| US1.AC1 | B1: title "Package Pricing" / B2: illustration shown / B3: body text with bold / B4: "Connect Stripe" button / B5: click → opens "Choose Your Country" pop-up | 5 |
| US1.AC2 | B1: X button added / B2: title "Country" / B3: dropdown updated / B4: hover updated / B5: click updated | 5 |
| US1.AC3 | B1: font updated / B2: font size updated / B3: text box updated / B4: "Cancel" button / B5: button text "Create Package" | 5 |
| US1.AC4 | B1: default state updated / B2: hover state updated / B3: no edit icon | 3 |
| US1.AC5 | B1: title / B2: Pricing Plan section / B3: pricing model dropdown / B4: price field / B5: Free Trial section+toggle OFF / B6: Free Trial tooltip exact / B7: Session Credits section+tag+toggle OFF / B8: Session Credits tooltip exact / B9: Cancel button / B10: Update Pricing disabled by default / B11: enabled when Pricing Plan valid / B12: X button | 12 |
| US1.AC6 | B1: 2 options / B2: hover highlight / B3: click selects+populates | 3 |
| US1.AC7 | B1: input shown / B2: blue border valid / B3: red border+error invalid / B4: button disabled on invalid / B5: error messages exact / B6: button re-enabled on valid | 6 |
| US1.AC8 | B1: 2 extra fields appear / B2: billing cycle number input / B3: cycle dropdown Weeks+Months / B4: expiration dropdown / B5: Never default / B6: Ends after option | 6 |
| US1.AC9 | B1: number shown / B2: 0 → error msg / B3: 0 → button disabled / B4: >12 → error msg / B5: >12 → button disabled | 5 |
| US1.AC10 | B1: checkmark on selected / B2: hover highlight / B3: click selects / B4: Ends after → invoices field (default 2) / B5: invoices validation / B6: Total formula shown / B7: Total hidden if price/cycle empty / B8: Never → hides invoices+total | 8 |
| US1.AC11 | B1: section expands / B2: tooltip exact text / B3: explanation text / B4: trial period dropdown default 7 days / B5: Archive checkbox checked / B6: Allow trial once checkbox checked | 6 |
| US1.AC12 | B1: 1 row default / B2: placeholder text / B3: data=active+require_credit / B4: credits default 1 / B5: credits validation 1–100 / B6: expiration default "Expires after" / B7: expiration number textbox / B8: unit default "months" / B9: Add button / B10: delete at 2+ rows / B11: delete hover tooltip / B12: delete removes row / B13: delete hidden at 1 row | 13 |
| US1.AC13 | B1: color shown / B2: name shown / B3: long name truncated "…" | 3 |
| US1.AC14 | B1: max 5 / B2: selected filtered from others / B3: Add button disabled at 5 / B4: disabled tooltip exact | 4 |
| US1.AC15 | B1: message in Session Credits section / B2: icon shown / B3: exact text with custom terminology | 3 |

---

### AC Scope Summary

| US | #ACs | Total Then-bullets | Max min_hint | Complexity signal |
|---|---|---|---|---|
| US1 (AC1–AC15) | 15 | 87 | 13 (AC12) | HIGH — AC5(12), AC12(13) dense; AC10(8), AC7/8/11(6) are Tier 2–3; AC4/13/15 are Tier 1 |

**Multi-source Priority:** API contract (EP-1, EP-5) > Spec v34 > BE Logic doc > Design screenshots

---

<!-- Layer 2 output appended below after strategy decomposition -->

---

## [MODULE LIST]

| Module_ID | Module Name | Type | AC Scope | Primary Responsibility | Linked Risk |
|---|---|---|---|---|---|
| MOD_CORE_01 | Pricing Plan UI Rendering | Core Function | US1 AC5, AC6 | Full pricing pop-up layout when payment set up; pricing model dropdown | Pop-up broken → no pricing config possible; tooltips/tags wrong |
| MOD_CORE_02 | Pricing Plan Field Validation | Core Function | US1 AC7, AC8, AC9, AC10 | Price, billing cycle, expiration field validation; Total formula; Recurring-specific fields | Invalid price → wrong charges; billing cycle edge cases → wrong renewal |
| MOD_CORE_03 | Session Credits Configuration | Core Function | US1 AC12, AC13, AC14 | Credits toggle rendering; session type selection+filtering; credits+expiration fields; add/delete rows; row limit | Misconfigured credits → wrong auto-issuance; financial impact |
| MOD_SUP_01 | No-Payment Entry & Package UI | Support Function | US1 AC1, AC2, AC3, AC4 | Stripe-gate path; Choose Country pop-up; Create Package pop-up; Add Pricing button states | Gate failure → coach proceeds without Stripe; UI regressions on entry points |
| MOD_SUP_02 | Free Trial Config + Cross-toggle | Support Function | US1 AC11, AC15 | Free Trial toggle expansion; defaults; both Trial+Credits ON message | Message missing → coach misunderstands credit timing during trial |

---

## [MODULE RISK REGISTER]

| Module | Risk Description | Likelihood | Impact | Overall | AC Tiers |
|---|---|---|---|---|---|
| MOD_CORE_01 | Pricing pop-up renders incomplete sections; tooltip text wrong; Session Credits "NEW" tag missing; button gating logic inverted | M | H | **HIGH** | 1×Tier3, 1×Tier2 |
| MOD_CORE_02 | Price field accepts out-of-range values → wrong invoice; Total formula wrong → coach misprices; "Ends after" invoices field shown/hidden incorrectly | H | H | **HIGH** | 4×Tier3 |
| MOD_CORE_03 | Credits misconfigured + silently saved → wrong auto-issuance every cycle (financial impact); same session type selected twice; delete-to-1-row leaves UI stuck | H | H | **HIGH** | 2×Tier3, 1×Tier2 |
| MOD_SUP_01 | Stripe gate missing → coach reaches pricing without account; UI regressions on standard entry flows | L | M | **MEDIUM** | 3×Tier3, 1×Tier2 |
| MOD_SUP_02 | Both-toggles message absent → coach believes credits issue during trial (wrong); checkbox defaults wrong → unexpected archive on trial cancel | M | M | **MEDIUM** | 1×Tier3, 1×Tier2 |

---

## [TECHNIQUE ASSIGNMENT MAP]

| Module | AC | Tier | Technique(s) Assigned | Specific signal from spec |
|---|---|---|---|---|
| MOD_SUP_01 | AC1 | Tier 3 | EP + ST | 2 WS states: Stripe-not-connected vs connected; AC1 is no-Stripe branch |
| MOD_SUP_01 | AC2 | Tier 3 | EP + ST | 2 entry paths to same pop-up: Add Pricing vs Payment Setup → Connect Stripe |
| MOD_SUP_01 | AC3 | Tier 3 | EP | Old UI vs new UI: 5 element changes to verify |
| MOD_SUP_01 | AC4 | Tier 2 | EP | 2 button states: default + hover |
| MOD_CORE_01 | AC5 | Tier 3 | EP + ST + BVA | Multiple toggle-OFF section states; button disabled→enabled; 2 exact tooltip texts |
| MOD_CORE_01 | AC6 | Tier 2 | EP | 2 option classes: One-time Payment / Recurring Subscription |
| MOD_CORE_02 | AC7 | Tier 3 | BVA + EP | Price BVA: below-min, at-min, mid-valid, at-max, above-max; border+button chain |
| MOD_CORE_02 | AC8 | Tier 3 | ST + EP | ST: One-time (no extra fields) → Recurring (Billing Cycle + Expiration appear); cycle unit classes |
| MOD_CORE_02 | AC9 | Tier 3 | BVA + EP | Billing cycle BVA: 0, 1, 12, 13; integer-only class |
| MOD_CORE_02 | AC10 | Tier 3 | DT + BVA | DT: Expiration (Never/Ends after) × Price+Cycle filled (yes/no) → 4 combos; BVA invoices |
| MOD_SUP_02 | AC11 | Tier 3 | ST + EP | ST: Free Trial toggle OFF→ON; 6 field defaults + 2 checkbox states |
| MOD_CORE_03 | AC12 | Tier 3 | DT + BVA + ST | DT: credits toggle × expiration type × credits value × row count; BVA: 0,1,100,101; ST: 1→5 rows→delete |
| MOD_CORE_03 | AC13 | Tier 2 | EP | Name length: short / long-truncated classes |
| MOD_CORE_03 | AC14 | Tier 3 | BVA + ST | BVA: type count 1,4,5,attempt-6; ST: add→limit→disabled→delete→re-enabled; dropdown filter |
| MOD_SUP_02 | AC15 | Tier 2 | DT | DT: Free Trial × Session Credits toggle combos; only ON×ON shows message; terminology check |

---

## [ESTIMATED FLOOR]

| Module | Sum min_hints | Risk | Multiplier | Est. TCs |
|---|---|---|---|---|
| MOD_CORE_01 | 15 | HIGH | ×1.5 | ~23 |
| MOD_CORE_02 | 25 | HIGH | ×1.5 | ~38 |
| MOD_CORE_03 | 20 | HIGH | ×1.5 | ~30 |
| MOD_SUP_01 | 18 | MEDIUM | ×1.2 | ~22 |
| MOD_SUP_02 | 9 | MEDIUM | ×1.2 | ~11 |
| **TOTAL** | **87** | — | — | **~124 TCs** |

<!-- Layer 3 output appended below after deep analysis -->

---

## [DEEP ANALYSIS PACKAGE v3]

### AC Type Classification Matrix

| AC | Structural Type | Tier | Risk | Design Supplement? | min_hint | Est. Floor |
|---|---|---|---|---|---|---|
| AC1 | Multi-effect (≥5 THEN items) | Tier 3 | HIGH | DS-1 | 5 | ~12 |
| AC2 | Multi-effect + 2 entry paths | Tier 3 | HIGH | — | 5 | ~12 |
| AC3 | Sub-section (5 element changes) | Tier 3 | HIGH | — | 5 | ~10 |
| AC4 | Conditional hover state | Tier 2 | MEDIUM | — | 3 | ~5 |
| AC5 | Sub-section compound (3 sections + button logic) | Tier 3 | HIGH | DS-1,DS-7 | 12 | ~25 |
| AC6 | Conditional dropdown | Tier 2 | MEDIUM | — | 3 | ~5 |
| AC7 | Multi-effect + validation chain | Tier 3 | HIGH | — | 6 | ~14 |
| AC8 | Conditional show/hide (pricing model gate) | Tier 3 | HIGH | — | 6 | ~12 |
| AC9 | BVA + conditional button disable | Tier 3 | HIGH | — | 5 | ~10 |
| AC10 | Compound DT (2 conditions × formula visibility) | Tier 3 | HIGH | — | 8 | ~18 |
| AC11 | Multi-effect toggle expansion | Tier 3 | HIGH | DS-7 | 6 | ~14 |
| AC12 | Sub-section (13 bullets; DT+BVA+ST) | Tier 3 | HIGH | DS-2,DS-3,DS-4,DS-5 | 13 | ~28 |
| AC13 | Conditional display (name length) | Tier 2 | MEDIUM | DS-2 | 3 | ~5 |
| AC14 | Multi-effect + BVA on count | Tier 3 | HIGH | — | 4 | ~12 |
| AC15 | DT — 2-toggle combination | Tier 2 | MEDIUM | DS-7 | 3 | ~6 |

### Technique Validation Report (Gate 3a — APPROVED)

EG H1-H5 added to all 11 Tier-3 ACs (AC1,AC2,AC3,AC5,AC7,AC8,AC9,AC10,AC11,AC12,AC14). All other assignments confirmed correct.

**Locked technique map:**
AC1:EP+ST+EG | AC2:EP+ST+EG | AC3:EP+EG | AC4:EP | AC5:EP+ST+BVA+EG | AC6:EP | AC7:BVA+EP+EG | AC8:ST+EP+EG | AC9:BVA+EP+EG | AC10:DT+BVA+EG | AC11:ST+EP+EG | AC12:DT+BVA+ST+EG | AC13:EP | AC14:BVA+ST+EG | AC15:DT

---

### MOD_SUP_01 — BU + DR Blocks (AC1–AC4)

#### BU — AC1
```
Why business cares: Stripe-gate broken → coach proceeds to pricing config without connected account → save fails silently or with cryptic error
Actor intent:       Coach discovers Stripe connection requirement and is channelled to the Country selection flow
System contract:    Pop-up renders illustration + exact body text + "Connect Stripe" CTA; click CTA → Country pop-up opens
Risk if broken:     User blocked — coach cannot initiate Stripe setup from the Package flow
```

#### DR — AC1 | Multi-effect | HIGH
```
Q1: verbs=[show,click] | fields=[title,illustration,body-text,Connect-Stripe-button]
Q2: actor=Coach(PP permission) | system=detect Stripe NOT connected → render AC1 variant
Q3: explicit=[WS no Stripe,Coach clicks Add Pricing] | implicit=[PP+Booking ON,PP permission]
Q5: Stripe-not-connected→AC1 popup | Stripe-connected→AC5 popup | CTA-click→opens-Country-popup
Q6:
  O1: title "Package Pricing" shown
  O2: illustration of Pricing plan visible
  O3: text "To enable payments, please connect your Stripe account" — bold formatting on link text
  O4: "Connect Stripe" button visible and clickable
  O5: click "Connect Stripe" → "Choose Your Country" pop-up opens
  N1: WS Stripe connected → AC5 popup shown (not AC1)
  N2: PP add-on OFF → "Add Pricing" not accessible → popup unreachable
  subtotal: 5O + 2N | cross-check: 5 ≥ min_hint=5 ✅
Q7: NOT[show pricing config fields without Stripe] | NOT[show Connect Stripe on AC5 path]
Q4: Depends on Stripe connection status check at popup open
Q8: READS:Stripe-status | FEEDS:AC2(Country popup path)
Q9: boundary=[Stripe-connected=boolean] | fail=[status check timeout → which popup renders?]
Q10: DS-1: min-height 508px applies to this state [source:design]
Q11: GET /packages/:id → Stripe status check → 200(ok) | 401 | 403
Q12: Stripe connected mid-session (other tab) → reopen shows wrong popup (stale state)
```
[ARTIFACT: EG — AC1]
H1-API: Stripe status API timeout → popup renders wrong variant (AC1 vs AC5) → TC slot [empty]
H2-Async: Stripe connected in Tab B while AC1 popup open → reopen same tab → stale → TC slot [empty]
H3-Permission: Trainer role (not Owner) → "Add Pricing" accessible? → TC slot [empty]
H4-Concurrent: N/A — read-only Stripe status, no write conflict
H5-Stateful: N/A — no rollback concern on open
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=NOT_CONNECTED
  Package: draft, no pricing set
  DESTRUCTIVE: none | DataIDs: TD-001=[WS Stripe NOT connected,Booking ON,P&P ON|SHARED|order=1]
---
Floor: max(5O,2ST) + 2N + 2EG = 5+2+2 = 9 — FINAL=9
Gate5: [ ] pending
```

---

#### BU — AC2
```
Why business cares: Choose Country is first step of Stripe onboarding — broken = no coaches can set up payment from this flow
Actor intent:       Coach selects billing country to begin Stripe Connect setup
System contract:    Pop-up shows X button + title "Country" + updated dropdown + hover/click behaviour
Risk if broken:     User blocked — cannot complete Stripe connection from Package flow
```

#### DR — AC2 | Multi-effect | HIGH
```
Q1: verbs=[show,add,update,click,hover] | fields=[X-button,title-Country,country-dropdown,hover-state,click-state]
Q2: actor=Coach | system=triggered by "Connect Stripe" (AC1) OR "Connect Stripe" on Payment Setup page
Q3: explicit=[WS no Stripe,clicked Connect Stripe] | implicit=[PP permission]
Q5: entry-AC1→same popup | entry-PaymentSetup→same popup | X-click→close
Q6:
  O1: X button present on popup
  O2: title "Country" displayed
  O3: Country dropdown updated to new component
  O4: hover state updated
  O5: click behaviour updated
  N1: Popup not reachable without clicking "Connect Stripe" button
  N2: X button click → closes popup, returns to previous state
  subtotal: 5O + 2N | cross-check: 5 ≥ min_hint=5 ✅
Q7: NOT[allow country selection on Stripe-connected WS without intent] | NOT[missing X button]
Q4: Reachable only after AC1 CTA or Payment Setup path
Q8: READS:AC1(CTA click) or Payment-Setup-page | independent result popup
Q9: boundary=[country list: Stripe-supported list] | fail=[list load fails → dropdown empty]
Q11: GET country list → 200 | 500(list unavailable)
Q12: Country list is likely static/Stripe-driven; stale list if Stripe updates supported countries
```
[ARTIFACT: EG — AC2]
H1-API: Country list API fails → empty dropdown → coach cannot proceed → TC slot [empty]
H2-Async: N/A — static list
H3-Permission: N/A — same as AC1 scope
H4-Concurrent: N/A
H5-Stateful: N/A
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=NOT_CONNECTED | DataIDs: TD-001(SHARED)
  DESTRUCTIVE: none
---
Floor: max(5O,2ST) + 2N + 1EG = 5+2+1 = 8 — FINAL=8
Gate5: [ ] pending
```

---

#### BU — AC3
```
Why business cares: Create Package popup is primary entry to package creation — UI regression here blocks all new package creation
Actor intent:       Coach creates a new package with updated font, Cancel button, and correct button label
System contract:    Popup shows updated font/size/textbox + "Cancel" button + "Create Package" button (replacing "Create New")
Risk if broken:     User blocked — coaches cannot create packages; "Create New" persists = UI regression
```

#### DR — AC3 | Sub-section | HIGH
```
Q1: verbs=[show,update,add] | fields=[font,font-size,textbox,Cancel-button,Create-Package-button]
Q2: actor=Coach | system=Package creation popup
Q3: explicit=[WS PP ON, Coach PP permission, clicks Create Package] | implicit=[logged in, correct role]
Q5: PP-ON+permission→show updated popup | PP-OFF→no Create Package button visible
Q6:
  O1: font updated to new design system
  O2: font size updated
  O3: text box updated (new component)
  O4: "Cancel" button present → click closes popup, no package created
  O5: button text reads "Create Package" (not "Create New")
  N1: "Create New" text still present → test failure (regression)
  N2: "Cancel" button missing → test failure
  subtotal: 5O + 2N | cross-check: 5 ≥ min_hint=5 ✅
Q7: NOT[show old "Create New" label] | NOT[missing Cancel button] | NOT[show popup without PP permission]
Q4: Independent entry point to package creation
Q8: FEEDS:AC4 (after creation, pricing button appears)
Q9: fail=[POST /packages fails → popup stays open, error shown?]
Q11: POST /packages → 201(created) | 400(validation) | 403(perm)
Q12: Double-click "Create Package" → duplicate package submitted?
```
[ARTIFACT: EG — AC3]
H1-API: POST /packages fails → does popup close or stay open with error? → TC slot [empty]
H2-Async: N/A
H3-Permission: Trainer role (not Owner/Admin) → same popup? → TC slot [empty]
H4-Concurrent: Double-click → duplicate package → TC slot [empty]
H5-Stateful: N/A
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=any | Package: none yet
  DataIDs: TD-002=[WS P&P ON,coach PP permission|SHARED|order=1]
  DESTRUCTIVE: none
---
Floor: max(5O) + 2N + 2EG = 5+2+2 = 9 — FINAL=9
Gate5: [ ] pending
```

---

#### BU — AC4
```
Why business cares: "Add Pricing" button is visual cue that pricing is unconfigured — wrong state confuses whether pricing exists
Actor intent:       Coach sees updated button UI that signals "pricing not set" without edit icon
System contract:    Button shows updated default + hover states; no edit icon present
Risk if broken:     User blocked — coach misreads button state; edit icon presence causes UX confusion
```

#### DR — AC4 | Conditional | MEDIUM — COMPACT
```
Q1: verbs=[show,hover] | fields=[Add-Pricing-button,default-state,hover-state]
Q2: actor=Coach | system=Package Overview (package created, no pricing set)
Q3: explicit=[PP ON, package exists, no pricing] | implicit=[PP permission]
Q5: no-pricing→Add-Pricing-button(updated) | pricing-set→Pricing-Plan-block(AC20-scope,not E1)
Q6:
  O1: "Add Pricing" button default state updated to new design
  O2: hover state updated
  O3: no edit icon on the button
  N1: PP OFF → button hidden/not accessible
  N2: edit icon present → test failure
  subtotal: 3O + 2N | cross-check: 3 ≥ min_hint=3 ✅
Q7: NOT[show old button style] | NOT[edit icon on Add Pricing button]
Q4: seq=Y after package created (AC3)
Q8: READS:AC3 output | FEEDS:AC5 (clicking opens Pricing popup)
Q-DATA: WS=Booking:ON,P&P:ON,Stripe:any | Package=created,no-pricing | DataIDs:TD-002(SHARED)
---
Floor: max(3O) + 2N = 5 — FINAL=5
Gate5: [ ] pending
```


---

### MOD_CORE_01 — BU + DR Blocks (AC5–AC6)

#### BU — AC5
```
Why business cares: Package Pricing popup is THE central config surface — missing sections, wrong tooltips, wrong tags, or incorrect button gating means coaches cannot configure monetisation correctly
Actor intent:       Coach opens a complete, correctly-structured popup ready to configure all pricing options
System contract:    Popup renders 3 sections (Pricing Plan, Free Trial, Session Credits) with icons, exact tooltip text, "NEW" tag, correct initial button state (disabled)
Risk if broken:     User blocked — cannot configure pricing; "NEW" tag missing → credits feature undiscovered; wrong tooltip → coach misunderstands trial/credit behaviour
```

#### DR — AC5 | Sub-section compound | HIGH
```
Q1: verbs=[show,render,display] | fields=[title,Pricing-Plan-section,pricing-model-dropdown,price-field,Free-Trial-section,Session-Credits-section,Cancel-button,Update-Pricing-button,X-button]
Q2: actor=Coach(PP permission) | system=Package Overview "Add Pricing" click or edit icon (Stripe connected)
Q3: explicit=[Stripe connected,PP+Booking ON,PP permission] | implicit=[no pricing yet or edit mode open]
Q5: Booking-OFF→Session-Credits-section-hidden | Stripe-not-connected→AC1-popup-instead | all-valid→button-enabled | default→button-disabled
Q6:
  O1: title "Package Pricing" shown
  O2: Pricing Plan section: icon + "Pricing Plan" heading + description "Price your package as a one-time payment or recurring subscription"
  O3: "Pricing model" dropdown: placeholder "Select pricing model"
  O4: "Price" field: placeholder = currency symbol, currency shown (WS currency)
  O5: Free Trial section: icon + "Free Trial" heading + tooltip icon + description + toggle default OFF
  O6: Free Trial tooltip exact: "Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically cancelled."
  O7: Session Credits section: icon + "Session Credits" heading + tooltip icon + "NEW" tag + description + toggle default OFF
  O8: Session Credits tooltip exact: "Credits issued upon successful payment and purchase activation: One-time: Issued once / Recurring: Issued every billing cycle"
  O9: "Cancel" button → click closes popup
  O10: "Update Pricing" button disabled by default (no Pricing Plan data)
  O11: "Update Pricing" enabled when Pricing Plan required fields valid (AND credits valid if toggle ON — Q1 resolved)
  O12: X button → click closes popup
  N1: Stripe not connected → AC1 popup shown, not AC5
  N2: Booking OFF → Session Credits section hidden entirely
  N3: PP add-on OFF → popup unreachable
  subtotal: 12O + 3N | cross-check: 12 ≥ min_hint=12 ✅
Q7: NOT[show Session Credits when Booking OFF] | NOT[enable Update Pricing before Pricing Plan valid] | NOT[missing NEW tag on Session Credits]
Q4: Stripe status resolved before render (dependency on Stripe connected)
Q8: READS:Stripe-status,Booking-flag | FEEDS:AC6,AC7,AC8,AC11,AC12(all sections rendered here)
Q9: boundary=[button disabled→enabled exact on first valid pricing entry] | fail=[popup fails to open → coach stuck]
Q10: DS-1:min-height 508px,max-height 700px,sticky footer [design] | DS-7:scroll when both toggles ON [design]
Q11: GET /packages/:id/detail → 200(session_credits field present) | 401 | 403
Q12: Popup opened in two tabs simultaneously → which tab's save wins (OQ-8 open question)
```

[ARTIFACT: BVA Boundary List — AC5 (button state)]
| Condition | State | Update Pricing button | TC ID |
|---|---|---|---|
| No pricing model selected | default | Disabled | [empty] |
| Pricing model selected + valid price | valid pricing | Enabled | [empty] |
| Pricing model selected + invalid price | invalid pricing | Disabled | [empty] |
| Valid pricing + Credits toggle ON + credits row invalid | mixed | Disabled | [empty] |
| Valid pricing + Credits toggle OFF | no credits | Enabled | [empty] |

[ARTIFACT: State Transition — AC5 (Update Pricing button)]
| From State | Event/Trigger | To State | Valid? | TC ID |
|---|---|---|---|---|
| Disabled | Select model + enter valid price | Enabled | ✓ | [empty] |
| Enabled | Clear price → invalid | Disabled | ✓ | [empty] |
| Enabled | Credits toggle ON + empty row | Disabled | ✓ | [empty] |
| Disabled | Credits toggle OFF (pricing still valid) | Enabled | ✓ | [empty] |

[ARTIFACT: EG — AC5]
```
H1-API: GET package detail timeout → popup opens with missing/empty sections → TC slot [empty]
H2-Async: Booking flag OFF in another tab after popup opens → Session Credits section still visible (stale) → TC slot [empty]
H3-Permission: Trainer role → same popup as Owner? Or restricted fields? → TC slot [empty]
H4-Concurrent: N/A — read-only render
H5-Stateful: N/A — no state change on open
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED
  Package: draft or published (no pricing / existing pricing)
  DataIDs: TD-003=[WS Stripe CONNECTED,Booking ON,P&P ON,PP permission|SHARED|order=1]
  DESTRUCTIVE: none
---
Floor: max(12O,4BVA,4ST) + 3N + 3EG = 12+3+3 = 18 — FINAL=18
Gate5: [ ] pending
```

---

#### BU — AC6
```
Why business cares: Pricing model selection (One-time vs Recurring) drives all downstream field visibility — wrong option list means wrong config entirely
Actor intent:       Coach selects the billing model that matches their business intent
System contract:    Dropdown shows exactly 2 options; hover highlights; click selects and populates field
Risk if broken:     User blocked — cannot select model; wrong model used → packages mispriced
```

#### DR — AC6 | Conditional dropdown | MEDIUM — COMPACT
```
Q1: verbs=[click,hover,select] | fields=[pricing-model-dropdown,option-list]
Q2: actor=Coach | system=Pricing model dropdown in AC5 popup
Q3: explicit=[popup open,Stripe connected,dropdown clicked] | implicit=[PP+Booking ON]
Q5: dropdown-clicked→show-2-options | option-hovered→highlight-bg | option-clicked→select+populate+close
Q6:
  O1: Exactly 2 options: "One-time Payment" and "Recurring Subscription"
  O2: Hover over option → background highlighted
  O3: Click → selected value populated in field, dropdown closes
  N1: No third or additional option present
  N2: Field shows placeholder until selection made
  subtotal: 3O + 2N | cross-check: 3 ≥ min_hint=3 ✅
Q7: NOT[show >2 options] | NOT[allow no selection after click interaction]
Q4: seq=Y — popup must be open (AC5)
Q8: FEEDS:AC7(price field active after model selected) + AC8(Recurring triggers extra fields)
Q-DATA: WS=Booking:ON,P&P:ON,Stripe:CONNECTED | DataIDs:TD-003(SHARED)
---
Floor: max(3O) + 2N = 5 — FINAL=5
Gate5: [ ] pending
```


---

### MOD_CORE_02 — BU + DR Blocks (AC7–AC10)

#### BU — AC7
```
Why business cares: Price field is the primary monetisation value — invalid validation allows $0 / negative / out-of-range prices → packages mispriced or unsellable; Stripe rejects out-of-range at charge time
Actor intent:       Coach enters the package price and receives immediate visual validity feedback
System contract:    Blue border on valid; red border + exact error message + disabled button on invalid; re-enables on valid re-entry
Risk if broken:     Wrong charge — invalid price saved → wrong invoice; button never re-enables → coach stuck
```

#### DR — AC7 | Multi-effect + validation | HIGH
```
Q1: verbs=[type,validate,show,disable,enable] | fields=[price-input,border-color,error-message,Update-Pricing-button]
Q2: actor=Coach | system=price field real-time validation
Q3: explicit=[pricing model selected,price field focused,value entered] | implicit=[popup open,Stripe connected]
Q5: valid-price→blue-border | below-min→red+error-min+disable | above-max→red+error-max+disable | valid-re-entry→re-enable
Q6:
  O1: Entered value shown in field
  O2: Blue border when valid price entered
  O3: Red border when invalid (below min or above max)
  O4: Error "Minimum value is {min}." when below min
  O5: Error "Maximum value is {max}." when above max
  O6: Update Pricing button re-enabled after correcting to valid price
  N1: Price = below min (USD $0.00) → red border + "Minimum value is $0.50." + button disabled
  N2: Price = above max → red border + "Maximum value is $999,999.99." + button disabled
  N3: Non-numeric input → rejected or error shown
  subtotal: 6O + 3N | cross-check: 6 ≥ min_hint=6 ✅
Q7: NOT[save with invalid price] | NOT[blue border on invalid] | NOT[button stays enabled on invalid]
Q4: seq=Y — pricing model must be selected (AC6)
Q8: READS:AC6(model selected) | FEEDS:Update-Pricing-button-state
Q9: boundary=[USD min=$0.50 / max=$999,999.99] | zero=[price=$0→"Minimum value is $0.50."] | fail=[non-numeric rejected silently or with inline error]
Q10: n/a
Q11: PATCH /packages/:id → 400(invalid price) | 422(Stripe min/max violation)
Q12: Currency changes mid-session → price limits shift → stale validation
```

[ARTIFACT: BVA Boundary List — AC7]
| Field | Min valid | Below min (invalid) | Max valid | Above max (invalid) | Notes |
|---|---|---|---|---|---|
| Price (USD) | $0.50 | $0.00 → "Minimum value is $0.50." | $999,999.99 | $1,000,000.00 → "Maximum value is $999,999.99." | Assumption A1 |
| Price format | 2dp or integer | 3dp (rounding?) | — | — | Non-numeric rejected |

[ARTIFACT: EG — AC7]
```
H1-API: Stripe returns unexpected validation error format → UI shows wrong message → TC slot [empty]
H2-Async: Price valid → switch pricing model → switch back → price revalidated from scratch? → TC slot [empty]
H3-Permission: N/A — same field all roles
H4-Concurrent: N/A — per-package field
H5-Stateful: Enter valid price → switch Recurring → switch back One-time → price still valid? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft, no pricing
  DataIDs: TD-003(SHARED) | DESTRUCTIVE: none
---
Floor: max(6O,4BVA) + 3N + 3EG = 6+3+3 = 12 — FINAL=12
Gate5: [ ] pending
```

---

#### BU — AC8
```
Why business cares: Billing cycle + expiration define recurring subscription schedule — missing fields after selecting Recurring means coach cannot configure subscription → package unsellable as recurring
Actor intent:       Coach selects Recurring and immediately sees billing schedule fields appear
System contract:    Selecting "Recurring Subscription" reveals Billing cycle (number + unit dropdown) + Expiration dropdown; switching to One-time hides them
Risk if broken:     User blocked — cannot configure recurring parameters; silent misconfiguration if fields hidden but default values submitted
```

#### DR — AC8 | Conditional show/hide | HIGH
```
Q1: verbs=[select,show,hide] | fields=[pricing-model-dropdown,billing-cycle-number,billing-cycle-unit-dropdown,expiration-dropdown]
Q2: actor=Coach | system=conditional field rendering based on pricing model
Q3: explicit=[Recurring Subscription selected] | implicit=[popup open,AC6 completed]
Q5: Recurring→show(billing-cycle+expiration) | One-time→hide(billing-cycle+expiration) | switch-back→hide-again
Q6:
  O1: 2 additional fields appear beside price field on Recurring selection
  O2: Billing cycle: number textbox (integer only, existing validation)
  O3: Billing cycle unit dropdown: "Weeks" and "Months"
  O4: Expiration dropdown appears
  O5: "Never" is default selection in Expiration dropdown
  O6: "Ends after" is second option in Expiration dropdown
  N1: One-time Payment selected → billing cycle + expiration NOT shown
  N2: Switch Recurring → One-time → fields hidden again
  subtotal: 6O + 2N | cross-check: 6 ≥ min_hint=6 ✅
Q7: NOT[show billing cycle for One-time] | NOT[hide billing cycle when Recurring selected]
Q4: seq=Y — model selected (AC6)
Q8: READS:AC6(model) | FEEDS:AC9(billing cycle validation)+AC10(expiration)
Q9: boundary=[fields shown/hidden exact on model switch] | fail=[fields appear empty with no defaults → save-time error]
Q10: n/a
Q11: n/a — frontend rendering
Q12: n/a
```

[ARTIFACT: State Transition — AC8 (pricing model → field visibility)]
| From State | Event | To State | Fields Visible | Valid? | TC ID |
|---|---|---|---|---|---|
| No model | Select One-time Payment | One-time | Price only | ✓ | [empty] |
| No model | Select Recurring Subscription | Recurring | Price + Billing cycle + Expiration | ✓ | [empty] |
| One-time | Switch to Recurring | Recurring | Add Billing cycle + Expiration | ✓ | [empty] |
| Recurring | Switch to One-time | One-time | Hide Billing cycle + Expiration | ✓ | [empty] |
| Recurring | No switch | Recurring | Billing cycle + Expiration remain | ✓ | [empty] |

[ARTIFACT: EG — AC8]
```
H1-API: N/A — frontend rendering
H2-Async: Enter billing cycle → switch to One-time → switch back Recurring → previous value preserved or cleared? → TC slot [empty]
H3-Permission: N/A
H4-Concurrent: N/A
H5-Stateful: Recurring → enter billing cycle 6 → switch One-time → switch Recurring → field shows 6 (preserved) or empty? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft
  DataIDs: TD-003(SHARED) | DESTRUCTIVE: none
---
Floor: max(6O,5ST) + 2N + 2EG = 6+2+2 = 10 — FINAL=10
Gate5: [ ] pending
```

---

#### BU — AC9
```
Why business cares: Billing cycle number 1-12 defines renewal frequency — cycle=0 or >12 creates invalid Stripe subscription schedules → billing failures or subscription never created
Actor intent:       Coach enters renewal frequency integer and sees immediate validation with exact boundary errors
System contract:    0 → error "Minimum value is 1." + button disabled; >12 → error "Maximum value is 12." + button disabled; 1-12 → clear
Risk if broken:     Wrong charge — invalid cycle bypasses frontend → Stripe rejects → package unsellable
```

#### DR — AC9 | BVA + conditional button | HIGH
```
Q1: verbs=[enter,validate,show,disable] | fields=[billing-cycle-number,error-message,Update-Pricing-button]
Q2: actor=Coach | system=billing cycle field real-time validation
Q3: explicit=[Recurring selected,value entered in billing cycle field] | implicit=[billing cycle field visible]
Q5: 0→error-min+disable | 1-12→valid+clear | 13+→error-max+disable | decimal→reject/error | empty→validation-triggered-on-save-attempt
Q6:
  O1: Number input shown in billing cycle field
  O2: Value 0 → error message "Minimum value is 1."
  O3: Value 0 → Update Pricing button disabled
  O4: Value >12 (e.g., 13) → error "Maximum value is 12."
  O5: Value >12 → Update Pricing button disabled
  N1: Valid value (1–12) → no error, button remains/becomes enabled
  N2: Decimal value (e.g., 1.5) → rejected (integer only)
  N3: Non-numeric input → rejected
  subtotal: 5O + 3N | cross-check: 5 ≥ min_hint=5 ✅
Q7: NOT[allow billing cycle=0] | NOT[allow billing cycle>12] | NOT[enable button on invalid cycle]
Q4: seq=Y — Recurring must be selected (AC8)
Q8: READS:AC8(Recurring mode) | FEEDS:Update-Pricing-button-state + AC10(Total formula needs valid cycle)
Q9: boundary=[0,1,12,13] | zero=[0→specific "Minimum value is 1." distinct from empty] | fail=[field accepts string silently]
Q11: PATCH /packages/:id → 422(billing_cycle out of range 1-12)
Q12: n/a
```

[ARTIFACT: BVA Boundary List — AC9]
| Field | Min valid | Below min | Max valid | Above max | Notes |
|---|---|---|---|---|---|
| Billing cycle number | 1 | 0 → "Minimum value is 1." | 12 | 13 → "Maximum value is 12." | Integer only; decimals rejected |

[ARTIFACT: EG — AC9]
```
H1-API: Server-side validation returns different error text → UI message mismatch → TC slot [empty]
H2-Async: N/A
H3-Permission: N/A
H4-Concurrent: N/A
H5-Stateful: Enter 13 → get error → change to 12 → error clears + button re-enables? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft, Recurring selected
  DataIDs: TD-003(SHARED) | DESTRUCTIVE: none
---
Floor: max(5O,4BVA) + 3N + 2EG = 5+3+2 = 10 — FINAL=10
Gate5: [ ] pending
```

---

#### BU — AC10
```
Why business cares: Expiration option (Never vs Ends after) determines whether subscription auto-renews forever or terminates; Total formula wrong → coach misprices package against business intent
Actor intent:       Coach configures subscription end condition and sees live total pricing preview
System contract:    "Never"→no invoice field; "Ends after"→invoice field (default 2) + Total formula when price+cycle filled; switching back to Never→hides both
Risk if broken:     Wrong charge — package bills indefinitely when should end (or vice versa); coach misprices based on wrong total
```

#### DR — AC10 | Compound DT | HIGH
```
Q1: verbs=[click,select,show,hide,display] | fields=[expiration-dropdown,invoices-field,total-formula,checkmark,hover-highlight]
Q2: actor=Coach | system=expiration dropdown + conditional field rendering + live total calc
Q3: explicit=[Recurring selected,expiration dropdown clicked] | implicit=[billing cycle + price may or may not be filled]
Q5: Never→hide-invoices+hide-total | Ends-after→show-invoices-default-2 | price+cycle-both-filled→show-total | either-empty→hide-total
Q6:
  O1: Selected value shows checkmark in dropdown
  O2: Hover over option → background highlighted
  O3: Click → selected option populates field
  O4: "Ends after" selected → invoices field appears (default = 2)
  O5: Invoices field has P1.1 validation rules
  O6: "Total: {currency}{amount} Over {x} {cycle}" shown when price + billing cycle both filled
  O7: Total hidden when price or billing cycle not yet filled
  O8: Switch back to "Never" → invoices field hidden + total hidden
  N1: "Never" selected → invoices field NOT shown
  N2: "Ends after" + price empty → Total NOT shown
  N3: Invalid invoices value → P1.1 validation error
  subtotal: 8O + 3N | cross-check: 8 ≥ min_hint=8 ✅
Q7: NOT[show total when price not filled] | NOT[show invoices field for Never] | NOT[hide invoices when Ends-after selected]
Q4: seq=Y — Recurring + AC7 price + AC9 cycle for full total
Q8: READS:AC7(price),AC9(billing cycle) | FEEDS:Total preview (downstream pricing display)
Q9: boundary=[invoices: P1.1 min=1 default=2] | fail=[invoices=0 → error]
Q11: n/a — frontend rendering
Q12: H5: Switch Ends-after → enter 5 invoices → Never → Ends-after → invoices field shows 5 or 2?
```

[ARTIFACT: Decision Table — AC10]
| Expiration option | Price filled? | Billing cycle filled? | Expected outcome | TC ID |
|---|---|---|---|---|
| Never | any | any | No invoice field; no Total shown | [empty] |
| Ends after | Yes | Yes | Invoice field (default 2) + Total: {currency}{price×invoices} Over {n} {cycle} | [empty] |
| Ends after | Yes | No | Invoice field shown; Total hidden | [empty] |
| Ends after | No | Yes | Invoice field shown; Total hidden | [empty] |
| Ends after | No | No | Invoice field shown; Total hidden | [empty] |
| Switch Ends-after → Never | — | — | Invoice field hidden + Total hidden | [empty] |

[ARTIFACT: BVA Boundary List — AC10]
| Field | Min | Max | Default | Notes |
|---|---|---|---|---|
| Invoices (Ends after) | 1 (P1.1 min) | P1.1 max | 2 | Per P1.1 validation |
| Total formula | price × invoices | — | — | e.g., $100 × 3 = $300 |

[ARTIFACT: EG — AC10]
```
H1-API: N/A — frontend calc
H2-Async: Price updated → Total updates live? Race with billing cycle change? → TC slot [empty]
H3-Permission: N/A
H4-Concurrent: N/A
H5-Stateful: Ends-after → 5 invoices entered → switch Never → switch Ends-after → invoices shows 5 (preserved) or 2 (reset)? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft, Recurring selected, price+cycle entered
  DataIDs: TD-003(SHARED) | DESTRUCTIVE: none
---
Floor: max(8O,6DT-rows,2BVA) + 3N + 2EG = 8+3+2 = 13 — FINAL=13
Gate5: [ ] pending
```


---

### MOD_SUP_02 — BU + DR Blocks (AC11, AC15)

#### BU — AC11
```
Why business cares: Free Trial configuration controls trial duration + post-trial client management — wrong checkbox defaults archive clients unexpectedly or allow unlimited trial sign-ups
Actor intent:       Coach enables trial and sets duration + archive/trial-limit behaviours
System contract:    Toggle ON → section expands with: exact tooltip, explanation, period dropdown (default 7 days), 2 checkboxes both default CHECKED
Risk if broken:     Silent failure — wrong defaults → clients archived without intent OR unlimited trial abuse; wrong tooltip text → coach misjudges payment timing
```

#### DR — AC11 | Multi-effect toggle | HIGH
```
Q1: verbs=[toggle,expand,show] | fields=[Free-Trial-toggle,tooltip,explanation-text,trial-period-dropdown,archive-checkbox,trial-once-checkbox]
Q2: actor=Coach | system=Free Trial section toggle in Pricing popup
Q3: explicit=[Pricing popup open,Free Trial toggle clicked ON] | implicit=[Stripe connected,PP+Booking ON]
Q5: toggle-OFF→section-collapsed | toggle-ON→section-expands+defaults-set
Q6:
  O1: Free Trial section expands when toggle flipped ON
  O2: Tooltip text exact: "Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically canceled."
  O3: Explanation text: "Allow clients to try out your package before committing to payment"
  O4: Free Trial Period dropdown visible; default = "7 days"
  O5: "Archive client when cancelling a package within the trial period" checkbox → default CHECKED
  O6: "Allow client to sign up for a trial once" checkbox → default CHECKED
  N1: Toggle OFF → section not expanded, no fields visible
  N2: Toggle ON then OFF → section collapses (AC18 behaviour)
  N3: Tooltip icon missing → text inaccessible
  subtotal: 6O + 3N | cross-check: 6 ≥ min_hint=6 ✅
Q7: NOT[show Free Trial fields without toggle ON] | NOT[default archive-checkbox UNCHECKED] | NOT[default trial-once-checkbox UNCHECKED]
Q4: Independent — no prior sequence dependency for toggle itself
Q8: FEEDS:AC15(both toggles ON triggers message)
Q9: boundary=[trial period dropdown: fixed options; 7 days is first/default] | fail=[section fails to expand → coach cannot configure trial]
Q10: DS-7: both Free Trial ON + Session Credits ON → full popup scrolls, sticky header+footer [source:design]
Q11: n/a — frontend rendering
Q12: n/a
```

[ARTIFACT: State Transition — AC11 (Free Trial toggle)]
| From State | Event | To State | Section Visible | TC ID |
|---|---|---|---|---|
| Toggle OFF | Click toggle ON | Toggle ON | Expanded: period dropdown + 2 checkboxes | [empty] |
| Toggle ON | Verify defaults | Toggle ON | period=7 days, archive=checked, trial-once=checked | [empty] |
| Toggle ON | Click toggle OFF | Toggle OFF | Collapsed to default | [empty] |

[ARTIFACT: EG — AC11]
```
H1-API: N/A — frontend toggle
H2-Async: Free Trial ON + Session Credits ON simultaneously → scroll + sticky layout breaks? → TC slot [empty]
H3-Permission: N/A — same for all coach roles
H4-Concurrent: N/A
H5-Stateful: Free Trial ON → configure trial → toggle OFF → toggle ON again → defaults reset or preserved? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft
  DataIDs: TD-003(SHARED) | DESTRUCTIVE: none
---
Floor: max(6O,3ST) + 3N + 2EG = 6+3+2 = 11 — FINAL=max(11,7,6) = 11
Gate5: [ ] pending
```

---

#### BU — AC15
```
Why business cares: Coaches enabling both trial and credits must know credits are deferred — missing message means they believe credits issue during trial, causing client confusion and support tickets
Actor intent:       Coach reads the deferred-issuance notice so they understand credits come after trial + first payment
System contract:    Message with icon appears ONLY when both toggles are ON; uses coach's custom user terminology; message absent when only one toggle ON
Risk if broken:     Silent failure — coach miscommunicates credit timing to clients; terminology wrong → coach-specific brand inconsistency
```

#### DR — AC15 | DT — 2-toggle combination | MEDIUM — COMPACT
```
Q1: verbs=[show,display] | fields=[message-text,message-icon]
Q2: actor=Coach | system=conditional message in Session Credits section
Q3: explicit=[both Free Trial toggle ON AND Session Credits toggle ON] | implicit=[popup open]
Q5: both-ON→show-message-with-custom-term | only-one-ON→no-message | both-OFF→no-message
Q6:
  O1: Message appears in Session Credits section
  O2: Icon shown beside message
  O3: Message text uses coach custom user term: "Credits will be added to {custom-term} account **after the free trial ends** and the first payment is successfully processed."
  N1: Free Trial ON + Session Credits OFF → no message
  N2: Free Trial OFF + Session Credits ON → no message
  N3: Message uses hardcoded "client" not custom term → test failure
  subtotal: 3O + 3N
Q7: NOT[show message when only one toggle ON] | NOT[hardcode "client" in message text]
Q4: seq=Y — both AC11(Free Trial toggle) and AC12(Credits toggle) must be ON
Q8: READS:AC11(Free Trial state)+AC12(Credits state)
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED | Package: draft, both toggles ON
  DataIDs: TD-003(SHARED), TD-004=[WS with custom user terminology configured|SHARED|order=2]
  DESTRUCTIVE: none
```

[ARTIFACT: Decision Table — AC15]
| Free Trial toggle | Session Credits toggle | Message shown? | TC ID |
|---|---|---|---|
| ON | ON | YES — custom-term + bold "after the free trial ends" | [empty] |
| ON | OFF | NO | [empty] |
| OFF | ON | NO | [empty] |
| OFF | OFF | NO | [empty] |

```
Floor: max(3O,4DT-rows) + 3N = 4+3 = 7 — FINAL=max(7,4,3) = 7
Gate5: [ ] pending
```


---

### MOD_CORE_03 — BU + DR Blocks (AC12–AC14)

#### BU — AC12
```
Why business cares: Session Credits config is the core new feature — wrong defaults, missing validation, incorrect expiration options, or broken row management creates invalid rules that either fail to save or issue wrong credits on every client purchase forever
Actor intent:       Coach configures which session types, quantities, and expiration for automated credit issuance
System contract:    Toggle ON → 1 default row; each row: filtered session type dropdown, credits (1 default,1-100), expiration (Never OR Expires after); Add up to 5 rows; Delete shown at 2+; both expiration options available
Risk if broken:     Wrong charge/Silent failure — credits issued with wrong qty or expiration; "Never" missing → coach cannot set no-expiry credits; duplicate types → server reject
```

#### DR — AC12 | Sub-section (13 bullets) | HIGH
```
Q1: verbs=[toggle,show,add,delete,select,enter,validate] | fields=[toggle,session-type-dropdown,credits-field,expiration-dropdown,expiration-number,expiration-unit,Add-button,Delete-button]
Q2: actor=Coach | system=Session Credits section
Q3: explicit=[popup open,Session Credits toggle ON,Free Trial OFF(this AC)] | implicit=[Stripe connected,PP+Booking ON,active session types with require_credit=true exist]
Q5: toggle-OFF→hidden | toggle-ON→1-row-default | expiration=Never→hide-duration-controls | expiration=Expires-after→show-duration | credits<1→error | credits>100→error | rows≥2→show-Delete | rows=1→hide-Delete | rows=5→disable-Add
Q6:
  O1: 1 session type row shown by default on toggle ON
  O2: Session type dropdown placeholder: "Select a session type"
  O3: Dropdown data: active session types with require_credit=true (WS-wide)
  O4: Credits field: default = 1
  O5: Credits field: integer only, min 1, max 100, required
  O6: Expiration dropdown: default "Expires after"
  O7: Expiration number textbox present (when "Expires after")
  O8: Expiration unit dropdown: default "months"
  O9: "Add Session Credits" button visible below rows
  O10: Delete button shown at 2+ rows; hover: icon highlight + tooltip "Delete"
  O11: Delete click → removes that specific row
  O12: Delete button hidden when only 1 row remains
  O13: "Never" option available in expiration dropdown (Q2 confirmed)
  N1: Credits = 0 → "Amount must be greater than 0." + button disabled
  N2: Credits = 101 → "Amount must not exceed 100." + button disabled
  N3: Session type not selected on save → "Please select session type."
  N4: Expiration = "Expires after" + duration empty on save → "Please set a duration."
  N5: Booking OFF → Session Credits section not shown at all
  subtotal: 13O + 5N | cross-check: 13 ≥ min_hint=13 ✅
Q7: NOT[allow credits=0] | NOT[allow same session type in 2 rows] | NOT[show delete at 1 row] | NOT[allow >5 rows] | NOT[hide Never from expiration options]
Q4: seq=Y — popup open (AC5); no dependency on Free Trial state for this AC
Q8: READS:booking-service session types | FEEDS:AC14(multi-row management)+AC15(credits toggle ON feeds both-toggle message)
Q9: boundary=[credits:0,1,100,101; rows:1,5,attempt-6] | zero=[credits=0→specific error distinct from empty] | fail=[session types API fails → empty dropdown]
Q10: DS-2:row shows duration+location icon | DS-3:stepper arrows on credits field | DS-4:3 separate controls for expiration row | DS-5:defaults pre-populated on toggle ON [source:design]
Q11: GET /v1/session-types → 200(list) | 503(booking-service down → empty dropdown)
Q12: Session type archived in another tab while popup open → stale dropdown → AC17 catches at server save
```

[ARTIFACT: Decision Table — AC12 (credits config states)]
| Credits toggle | Expiration type | Credits value | Row count | Expected outcome | TC ID |
|---|---|---|---|---|---|
| ON | Never | 1 (valid) | 1 | Row valid; no duration controls | [empty] |
| ON | Expires after | 1 (valid) | 1 | Duration number + unit shown | [empty] |
| ON | Expires after | 0 (invalid) | 1 | Error "Amount must be greater than 0." + button disabled | [empty] |
| ON | Expires after | 101 (invalid) | 1 | Error "Amount must not exceed 100." + button disabled | [empty] |
| ON | Expires after | empty | 1 | Error "Please set a number of credits." + button disabled | [empty] |
| ON | Never | 1 | 5 rows | Add button disabled | [empty] |
| OFF | — | — | — | Section entirely hidden | [empty] |

[ARTIFACT: BVA Boundary List — AC12]
| Field | Min valid | Below min | Max valid | Above max | Notes |
|---|---|---|---|---|---|
| Credits qty | 1 | 0 → "Amount must be greater than 0." | 100 | 101 → "Amount must not exceed 100." | Default=1; stepper arrows present |
| Row count | 1 (auto) | N/A (toggle ON always creates 1) | 5 | Attempt 6 → Add button already disabled | — |

[ARTIFACT: State Transition — AC12 (row management)]
| From State | Event | To State | Add button | Delete button | TC ID |
|---|---|---|---|---|---|
| 1 row | Click "Add Session Credits" | 2 rows | Enabled | Shown on each row | [empty] |
| 4 rows | Click "Add Session Credits" | 5 rows | **Disabled** | Shown on each row | [empty] |
| 5 rows | Hover disabled Add | 5 rows (no change) | Disabled + tooltip | Shown on each row | [empty] |
| 2 rows | Click Delete on row 2 | 1 row | Enabled | **Hidden** | [empty] |
| 5 rows | Click Delete on any row | 4 rows | **Re-enabled** | Shown on each row | [empty] |

[ARTIFACT: EG — AC12]
```
H1-API: booking-service GET session types times out → dropdown empty → coach cannot configure credits → TC slot [empty]
H2-Async: Session type archived in Tab B while popup open → dropdown shows stale type → server catches at save → TC slot [empty]
H3-Permission: Trainer role → same session types list as Owner? Or filtered by coach? → TC slot [empty]
H4-Concurrent: Two coaches adding same session type to same package simultaneously → server UNIQUE constraint → TC slot [empty]
H5-Stateful: Configure 3 rows → toggle Credits OFF → toggle Credits ON again → rows reset to 1 or preserved? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED
  Session types: ≥1 active with require_credit=true
  DataIDs: TD-003(SHARED), TD-005=[WS with ≥1 active session type require_credit=true|SHARED|order=2]
  DESTRUCTIVE: none
---
Floor: max(13O,7DT-rows,5ST-rows,4BVA) + 5N + 4EG = 13+5+4 = 22 — FINAL=max(22,7,13) = 22
Gate5: [ ] pending
```

---

#### BU — AC13
```
Why business cares: Color + name are the only identifiers of a session type — if wrong color shown or long name wraps instead of truncating, coach cannot confirm correct type selected
Actor intent:       Coach visually confirms the correct session type is in the row by its color and name
System contract:    Selected type shows color dot + name; names >1 row truncated with "…"
Risk if broken:     User blocked — wrong type selected silently; coach cannot distinguish types by name
```

#### DR — AC13 | Conditional display | MEDIUM — COMPACT
```
Q1: verbs=[select,show,display] | fields=[session-type-color,session-type-name]
Q2: actor=Coach | system=session type row after selection
Q3: explicit=[Credits section open,session type selected from dropdown] | implicit=[toggle ON, active types with require_credit exist]
Q5: short-name→show-full | long-name→1-row+truncate-"…"
Q6:
  O1: Session type color indicator (dot) shown in row
  O2: Session type name shown
  O3: Long name: 1 row only, truncated with "…"
  N1: Wrong color shown → test failure
  N2: Long name wraps to 2+ rows → test failure (should truncate)
  subtotal: 3O + 2N | cross-check: 3 ≥ min_hint=3 ✅
Q7: NOT[show plain text without color] | NOT[wrap long name to 2 rows]
Q4: seq=Y — requires AC12 toggle ON + type selected
Q8: READS:AC12(session type selection)
Q-DATA:
  WS State: Booking=ON, P&P=ON | Session types: TD-005(SHARED), TD-006=[session type name >30 chars|SHARED|order=3]
---
Floor: max(3O) + 2N = 5 — FINAL=max(5,4,3) = 5
Gate5: [ ] pending
```

---

#### BU — AC14
```
Why business cares: Max 5 session types per package is a server-enforced business rule — if UI allows 6+ rows or doesn't filter duplicates, invalid config submitted → server 422 or duplicate issuance
Actor intent:       Coach adds multiple distinct session types and sees UI prevent duplicates + enforce the 5-type limit
System contract:    Each row's dropdown excludes already-selected types; at 5 rows Add button disabled with tooltip "Session types limit reached (5/5)"; delete re-enables Add
Risk if broken:     Silent failure — duplicate types submitted; >5 rows attempted → server rejects → coach confused with no UI guidance
```

#### DR — AC14 | Multi-effect + BVA | HIGH
```
Q1: verbs=[add,delete,disable,filter,hover] | fields=[Add-Session-Credits-button,session-type-dropdowns,delete-buttons,tooltip]
Q2: actor=Coach | system=row count enforcement + dropdown filtering
Q3: explicit=[Credits toggle ON,multiple rows being added] | implicit=[≥5 active session types with require_credit=true exist]
Q5: row-count<5→Add-enabled | row-count=5→Add-disabled+tooltip-on-hover | each-dropdown→filters-out-already-selected | delete-row→re-enables-Add+restores-type
Q6:
  O1: Max 5 session types total enforced
  O2: Already-selected type excluded from other rows' dropdowns
  O3: "Add Session Credits" button disabled when 5 rows present
  O4: Hover on disabled Add → tooltip "Session types limit reached (5/5)"
  N1: Attempt to add 6th row → button unclickable (already disabled)
  N2: Delete row at 5 → Add re-enabled → deleted type returns to other dropdowns
  N3: Same session type appears in 2 rows (UI filter bypass) → server rejects 422
  subtotal: 4O + 3N | cross-check: 4 ≥ min_hint=4 ✅
Q7: NOT[allow same session type in 2 rows] | NOT[allow >5 rows] | NOT[keep Add disabled after delete]
Q4: seq=Y — depends on AC12(toggle ON, initial row) + AC13(type selection)
Q8: READS:AC12(row management)+AC13(type selection) | FEEDS:Update-Pricing-validation(max 5 server check)
Q9: boundary=[row count: 1,4,5,attempt-6] | fail=[Add button remains enabled at 5 → UI bug allowing invalid state]
Q11: PATCH /packages/:id → 422(DUPLICATE_SESSION_TYPE or MAX_RULES_EXCEEDED)
Q12: Two coaches add same session type to same package simultaneously → server UNIQUE constraint resolves
```

[ARTIFACT: BVA Boundary List — AC14]
| State | Row count | Add button state | Filtering active | TC ID |
|---|---|---|---|---|
| Initial | 1 | Enabled | N/A (no previous selections) | [empty] |
| Valid mid-range | 4 | Enabled | 3 types excluded from each dropdown | [empty] |
| At maximum | 5 | **Disabled** | 4 types excluded | [empty] |
| Hover at max | 5 | Disabled + tooltip | — | [empty] |
| After delete from max | 4 | **Re-enabled** | 3 types excluded; deleted type restored | [empty] |

[ARTIFACT: State Transition — AC14 (Add button lifecycle)]
| From State | Event | To State | Add button | TC ID |
|---|---|---|---|---|
| 1 row | Add row | 2 rows | Enabled | [empty] |
| 4 rows | Add row | 5 rows | **Disabled** | [empty] |
| 5 rows | Hover Add | 5 rows (no change) | Tooltip: "Session types limit reached (5/5)" | [empty] |
| 5 rows | Delete any row | 4 rows | **Re-enabled** | [empty] |

[ARTIFACT: EG — AC14]
```
H1-API: PATCH with 6 rules → server 422 → UI shows which error message? → TC slot [empty]
H2-Async: Session type added to row 3 then immediately deleted from row 1 → dropdown filter real-time? → TC slot [empty]
H3-Permission: N/A
H4-Concurrent: Coach A + Coach B add same type to same package simultaneously → server UNIQUE constraint → TC slot [empty]
H5-Stateful: 5 rows, type X in row 3 → delete row 3 → type X available in other dropdowns again? → TC slot [empty]
```
```
Q-DATA:
  WS State: Booking=ON, P&P=ON, Stripe=CONNECTED
  Session types: ≥5 active with require_credit=true
  DataIDs: TD-003(SHARED), TD-007=[WS with ≥5 active session types require_credit=true|SHARED|order=4]
  DESTRUCTIVE: none
---
Floor: max(4O,5BVA-states,4ST-rows) + 3N + 3EG = 5+3+3 = 11 — FINAL=max(11,7,4) = 11
Gate5: [ ] pending
```


---

### Data Prerequisite Cards

#### MOD_SUP_01 — Data Prerequisite Card

| DataID | Description | Key Values | Setup Order | Tag | Used by ACs |
|---|---|---|---|---|---|
| TD-001 | WS with Stripe NOT connected, Booking ON, P&P ON, coach PP permission | Stripe=null, Booking=ON, P&P=ON | 1 | SHARED | AC1, AC2 |
| TD-002 | WS with P&P ON, Stripe connected (or not), coach PP permission | PP=ON, role=Owner/Admin/Trainer | 1 | SHARED | AC3, AC4 |

State conflicts: TD-001 and TD-003 are mutually exclusive on Stripe connection — use separate WS instances or reset Stripe state between tests.

#### MOD_CORE_01 — Data Prerequisite Card

| DataID | Description | Key Values | Setup Order | Tag | Used by ACs |
|---|---|---|---|---|---|
| TD-003 | WS Stripe CONNECTED, Booking ON, P&P ON, coach PP permission | Stripe=connected, Booking=ON, P&P=ON | 1 | SHARED | AC5, AC6, AC7, AC8, AC9, AC10, AC11, AC12, AC13, AC14, AC15 |

State conflicts: None within module.

#### MOD_CORE_02 — Data Prerequisite Card

| DataID | Description | Key Values | Setup Order | Tag | Used by ACs |
|---|---|---|---|---|---|
| TD-003 | Same as MOD_CORE_01 | Stripe=connected | 1 | SHARED | AC7–AC10 |

State conflicts: AC8→AC9→AC10 require Recurring Subscription selected in sequence; tests must start from fresh popup open or reset pricing model between sub-tests.

#### MOD_SUP_02 — Data Prerequisite Card

| DataID | Description | Key Values | Setup Order | Tag | Used by ACs |
|---|---|---|---|---|---|
| TD-003 | WS Stripe connected + Booking ON | — | 1 | SHARED | AC11, AC15 |
| TD-004 | WS with custom user terminology configured | custom-term = e.g. "athlete" (not "client") | 2 | SHARED | AC15 |

State conflicts: AC15 requires both Free Trial toggle ON + Session Credits toggle ON simultaneously; setup must ensure AC11 precondition is met before AC15 test.

#### MOD_CORE_03 — Data Prerequisite Card

| DataID | Description | Key Values | Setup Order | Tag | Used by ACs |
|---|---|---|---|---|---|
| TD-003 | WS Stripe connected + Booking ON | — | 1 | SHARED | AC12, AC13, AC14 |
| TD-005 | WS with ≥1 active session type (require_credit=true) | 1 session type, active, require_credit=ON | 2 | SHARED | AC12, AC13 |
| TD-006 | Session type with name >30 characters | name="Very Long Session Type Name For Testing Purposes" | 3 | SHARED | AC13 |
| TD-007 | WS with ≥5 active session types (require_credit=true) | 5 types, all active, all require_credit=ON | 4 | SHARED | AC14 |

State conflicts: TD-005 and TD-007 may overlap (TD-007 is a superset); for AC12/AC13 use only 1 type visible; for AC14 test exactly 5 types. If same WS used, ensure filtering test isolates types per test case.

---

### Cross-AC/US Dependency Map

| Relationship | Source AC | Target AC | Type | Test Implication | TC Required? | CoveredBy |
|---|---|---|---|---|---|---|
| Stripe status gates popup variant | AC1 vs AC5 | — | State dependency | [MANDATORY TC: Stripe NOT connected → AC1 popup; Stripe connected → AC5 popup; switch Stripe state → correct popup] | YES | [empty→L5] |
| CTA click opens Country popup | AC1 | AC2 | Sequence constraint | [MANDATORY TC: click Connect Stripe in AC1 popup → AC2 popup opens] | YES | [empty→L5] |
| Package creation feeds pricing button | AC3 | AC4 | Sequence constraint | Covered via precondition: AC4 test presupposes package created | RECOMMENDED | [empty→L5] |
| Pricing model selection reveals fields | AC6 | AC8 | State dependency | [MANDATORY TC: select Recurring → billing+expiration appear; One-time → hidden] | YES | [empty→L5] |
| Price validity feeds button state | AC7 | AC5(button) | Data dependency | [MANDATORY TC: valid price → button enabled; invalid price → button disabled] | YES | [empty→L5] |
| Billing cycle validity feeds button | AC9 | AC5(button) | Data dependency | [MANDATORY TC: cycle=0 → button disabled; cycle=1 → button enabled] | YES | [empty→L5] |
| Expiration + price + cycle → Total | AC7+AC9 | AC10 | Data dependency | [MANDATORY TC: all 3 filled → Total shown; any missing → Total hidden] | YES | [empty→L5] |
| Free Trial ON feeds cross-toggle message | AC11 | AC15 | State dependency | [MANDATORY TC: Free Trial ON + Credits ON → message shown; one OFF → no message] | YES | [empty→L5] |
| Credits toggle ON feeds button state | AC12 | AC5(button) | State dependency | [MANDATORY TC: credits toggle ON + invalid row → button disabled; valid → enabled] | YES | [empty→L5] |
| Session type selection feeds row display | AC12 | AC13 | Sequence constraint | Covered via precondition in AC13 tests | RECOMMENDED | [empty→L5] |
| Row add/delete feeds count enforcement | AC12 | AC14 | Shared entity | [MANDATORY TC: 5 rows → Add disabled; delete 1 → Add re-enabled; type returns to dropdown] | YES | [empty→L5] |
| AC5 spec "regardless of credits" vs Q1 resolved | AC5 | AC12 | Contradiction | Resolved: button disabled when credits invalid (Q1); RTM note added | RECOMMENDED note | [empty→L5] |
| E1→E2: Credits config → race condition save | AC12(E1) | AC17(E2) | Sequence constraint | E2 scope: session type deactivated mid-edit → save → AC17 validation fires | E2 scope | [empty→L5-E2] |
| E1→E2: Pricing popup → pricing model lock | AC5(E1) | US2-AC1(E2) | State dependency | E2 scope: after publish, pricing model field locked | E2 scope | [empty→L5-E2] |

---

### Conditional Analysis Artifacts

**AC Capability Map:** Triggered — AC5 and AC12 each have ≥4 interactive controls.

[ARTIFACT: AC Capability Map — AC5]
| Control/element | Trigger | Immediate result | Follow-up state | Disposition |
|---|---|---|---|---|
| Pricing model dropdown | Click | Options list shown | Selection populates field | covered — AC6 |
| Price field | Type | Value shown, validation fires | Border color + button state change | covered — AC7 |
| Free Trial toggle | Click ON | Section expands | Defaults set | covered — AC11 |
| Session Credits toggle | Click ON | Section expands | 1 row shown | covered — AC12 |
| Cancel button | Click | Popup closes | No data saved | covered — AC5-O9 |
| X button | Click | Popup closes | No data saved | covered — AC5-O12 |
| Update Pricing button | Click (enabled) | Save attempted | Success → overview updated; failure → error | E2 scope (AC19) |

[ARTIFACT: AC Capability Map — AC12]
| Control/element | Trigger | Immediate result | Follow-up state | Disposition |
|---|---|---|---|---|
| Session Credits toggle | Click ON | Section expands, 1 row shown | Defaults: type=placeholder, credits=1, exp=Expires after/months | covered — AC12-O1 |
| Session type dropdown | Click | Filtered list shown | Selection fills row | covered — AC12-O2/O3 + AC13 |
| Credits stepper (up) | Click | Credits increments | Validation re-runs | covered — AC12-O5 |
| Credits stepper (down) | Click | Credits decrements | Validation re-runs; 0→error | covered — AC12-O5/N1 |
| Expiration dropdown | Click | Never/Expires after options | Duration controls show/hide | covered — AC12-O6/O13 |
| Add Session Credits | Click | New row added | Row count increments | covered — AC12-O9 + AC14 |
| Delete button | Click | Row removed | Row count decrements | covered — AC12-O11 |

**Success Outcome Ledger:** N/A for E1 — "Update Pricing" save outcome is E2 scope (AC19); E1 ACs cover config only, not save result.

**Requirement-to-Condition Matrix:** Triggered — multiple ACs have conditional language (show/hide/enable/disable).
→ Captured inline in Q5 and DT artifacts per AC. Standalone matrix omitted — would duplicate DR blocks. Per-AC Q5 is the condition matrix.

**Row-Schema Variant Matrix:** Triggered by AC12 (session type rows vary by expiration type).

[ARTIFACT: Row-Schema Variant Matrix — AC12]
| Row discriminator | Expiration type | Controls shown | Validation applies to | Disposition |
|---|---|---|---|---|
| Credits row, expiration=Never | Never | Session type + credits + expiration dropdown | Session type required; credits 1-100 | covered — DT row 1 |
| Credits row, expiration=Expires after | Expires after | Session type + credits + expiration dropdown + number + unit | All fields required; duration ≥1 | covered — DT rows 2-5 |

**Cross-Flow Impact Sweep:** N/A for E1 — no state-change actions (archive/delete/cancel) within AC1-AC15 scope. Save action is E2 scope.

---

### Requirement Traceability Matrix (RTM)

| Req_ID | US | AC | Module | Technique | Min_TCs | Actual_TCs | Status |
|---|---|---|---|---|---|---|---|
| REQ-E1-001 | US1 | AC1 | MOD_SUP_01 | EP+ST+EG | 9 | — | UNCOVERED |
| REQ-E1-002 | US1 | AC2 | MOD_SUP_01 | EP+ST+EG | 8 | — | UNCOVERED |
| REQ-E1-003 | US1 | AC3 | MOD_SUP_01 | EP+EG | 9 | — | UNCOVERED |
| REQ-E1-004 | US1 | AC4 | MOD_SUP_01 | EP | 5 | — | UNCOVERED |
| REQ-E1-005 | US1 | AC5 | MOD_CORE_01 | EP+ST+BVA+EG | 18 | — | UNCOVERED |
| REQ-E1-006 | US1 | AC6 | MOD_CORE_01 | EP | 5 | — | UNCOVERED |
| REQ-E1-007 | US1 | AC7 | MOD_CORE_02 | BVA+EP+EG | 12 | — | UNCOVERED |
| REQ-E1-008 | US1 | AC8 | MOD_CORE_02 | ST+EP+EG | 10 | — | UNCOVERED |
| REQ-E1-009 | US1 | AC9 | MOD_CORE_02 | BVA+EP+EG | 10 | — | UNCOVERED |
| REQ-E1-010 | US1 | AC10 | MOD_CORE_02 | DT+BVA+EG | 13 | — | UNCOVERED |
| REQ-E1-011 | US1 | AC11 | MOD_SUP_02 | ST+EP+EG | 11 | — | UNCOVERED |
| REQ-E1-012 | US1 | AC12 | MOD_CORE_03 | DT+BVA+ST+EG | 22 | — | UNCOVERED |
| REQ-E1-013 | US1 | AC13 | MOD_CORE_03 | EP | 5 | — | UNCOVERED |
| REQ-E1-014 | US1 | AC14 | MOD_CORE_03 | BVA+ST+EG | 11 | — | UNCOVERED |
| REQ-E1-015 | US1 | AC15 | MOD_SUP_02 | DT | 7 | — | UNCOVERED |

**Total Min_TCs across E1: 155**

No GAP ALERTs — all 15 ACs mapped to modules. No orphaned requirements.

---

### Self-Review — Gate 3a Checklist

```
[✓] Every AC has BU block (4 fields — not placeholder)
[✓] Every AC has Q6: O-list/N-list (verbatim observables)
[✓] Every AC has Q-DATA with DataIDs
[✓] Every DR block: FINAL Floor ≥ min_hint, explicit O/N/DT/ST/BVA counts
[✓] Technique Validation Report produced and approved (Gate 3a)
[✓] Every Tier-3 AC: EG H1-H5 verdict list present
[✓] Every DT/ST-assigned AC: actual artifact table built (not label only)
[✓] Data Prerequisite Cards per module with DataID registry + conflict notes
[✓] All 8 dependency types scanned; MANDATORY TCs flagged
[✓] Min_TCs column populated in RTM (155 total)
[✓] Every REQ mapped; no GAP alerts

Self-Review: PASS → Gate 3b
```

<!-- Layer 4 output appended below after scenario design -->
