# ANALYSIS — E2 — Session Credits Validation + Edit Flow
**Project:** `payment/Package Issuance (P3.1)`
**Epic:** E2 — US1 AC16–AC21b + US2 AC1–AC6
**Mode:** M (14 ACs) | **Date:** 2026-05-16

---

## [MASTER CONTEXT] — Layer 1

### Feature Summary
E2 covers two logical groups:
1. **US1 AC16–AC21b** — Validation, save flow, and overview rendering for the Package Pricing pop-up (Session Credits section). The coach configures credits, submits, sees loading state, and views the result on the Package Overview page.
2. **US2 AC1–AC6** — Edit constraints and confirmation for packages that have already been published. Covers pricing model lock, credit field editability, confirmation pop-up (DT-driven), future-only impact, and publish block on invalid session type.

### AC Inventory with Then-Bullet Count

| AC | Title | Then-Bullets | US |
|---|---|---|---|
| AC16 | Validation errors for session credit fields | 8 | US1 |
| AC17 | Handle invalid data after clicking Update Pricing (race condition) | 4 | US1 |
| AC18 | Turn OFF toggle — collapse to default | 1 | US1 |
| AC19 | Show loading status when saving | 2 | US1 |
| AC20 | Update UI for Pricing component after saving | 9 | US1 |
| AC21a | Show SESSION CREDIT block on package overview | 8 | US1 |
| AC21b | Click on Session Type row to show details | 1 | US1 |
| US2-AC1 | Pricing model field disabled for published package | 1 | US2 |
| US2-AC2 | All session credit fields always editable | 1 | US2 |
| US2-AC3 | Save unpublished package — no confirmation | 1 | US2 |
| US2-AC4 | Save published package — show confirmation pop-up | 6 | US2 |
| US2-AC5 | Changes apply to future purchases only | 3 | US2 |
| US2-AC6 | Block publishing if inactive session type in credit rules | 4 | US2 |
| **TOTAL** | | **49** | |

### Then-Bullet Inventory (Full)

**AC16:**
- T1: All invalid fields highlighted in red border
- T2: "Update Pricing" button disabled until all required fields are valid
- T3: Empty session type → "Please selecte session type" *(spec typo — flag AMB-E2-02)*
- T4: Empty credit → "Please set a number of credits."
- T5: Empty duration → "Please set a duration."
- T6: Credit = 0 → "Amount must be greater than 0."
- T7: Credit > 100 → "Amount must not exceed 100."
- T8: Invalid expiration → refer to P1.1 expiration validation rules *(Assumption A1-E2: min=1 for all units)*

**AC17:**
- T1: Toast: "A session type is no longer available. Please try again."
- T2: Remove inactive session type from pop-up
- T3: Highlight session type box in red: "Please select session type."
- T4: Update Pricing disabled until all required fields input

**AC18:**
- T1: UI collapses to default status of Free Trial or Session Credits *(Ambiguity: data preserved vs cleared — AMB-E2-03)*

**AC19:**
- T1: Loading animation in the Update Price button
- T2: Disable all buttons on the Package Pricing pop-up

**AC20:**
- T1: Show "PRICING PLAN" block below Pricing and edit button
- T2: Title: "PRICING PLAN"
- T3: Show Currency code (e.g., USD, AUD)
- T4: Format: `{Currency sign}{Amount}/{cycle} . {number of invoices} times`
- T5: One-time → `USD $1,000.00 one time`
- T6: Recurring fixed-term → `USD $1,000.00 / 3 months . 4 times`
- T7: Recurring forever → `USD $1,000.00 / month`
- T8: If trial → show tag `{x}-DAY TRIAL`
- T9: Edit icon → hover to highlight, click → navigate to Package Pricing

**AC21a:**
- T1: Show "SESSION CREDIT" block below "PRICING PLAN" block
- T2: Title: "SESSION CREDIT" + icon
- T3: Tooltip (recurring): "Session credits are issued every billing cycle after successful payment and initial purchase activation."
- T4: Tooltip (one-time): "Session credits are issued once after successful payment and purchase activation."
- T5: 3-column list: SESSION TYPE (color + name, long name → "…"), AMOUNT (coin icon + qty), EXPIRATION ("in {n} {period}")
- T6: Row hover → highlight background
- T7: Row click → Session type details pop-up (as P1.1)
- T8: Edit icon → hover highlight, click → navigate to Package Pricing
- T9: No SESSION CREDIT block if no session type set

**AC21b:**
- T1: Click session type row → Session type details pop-up (as P1.1 Expiration spec)

**US2 AC1:**
- T1: Pricing model field disabled for published package

**US2 AC2:**
- T1: All session credit fields (toggle, types, quantities, expiration) are editable

**US2 AC3:**
- T1: Changes saved immediately with no confirmation pop-up (unpublished package)

**US2 AC4:**
- T1: Confirmation pop-up shown
- T2: Title: "Confirm Package Pricing Update"
- T3: Description varies by what changed:
  - Pricing only: "You are changing the Pricing Plan for this package. The changes will take effect as soon as the package is published."
  - Credits only: "You are changing the Session Credits for this package. The changes will take effect as soon as the package is published."
  - Trial only: "You are changing the Free Trial for this package. The changes will take effect as soon as the package is published."
  - All three (combo): "You are changing the Pricing Plan, Free Trial, and Session Credits for this package. The changes will take effect as soon as the package is published."
  - **AMB-E2-01: Partial 2-item combos not defined in spec**
- T4: Note: "This change will not affect recurring payments for existing clients."
- T5: Cancel → dismiss pop-up, return to Package Pricing without saving
- T6: Confirm → proceed with saving

**US2 AC5:**
- T1: Updated info shown in Overview Pricing component
- T2: New purchases use updated session credit configuration
- T3: Existing purchases are NOT affected

**US2 AC6:**
- T1: Coach is blocked from publishing
- T2: Publish button is NOT disabled — coach can click it to see error
- T3: Toast: "Can't publish. A session credit rule is tied to an inactive session type. Please activate the session type or update the rule to continue."
- T4: If coach fixes the issue, they can publish successfully

### QnA — Critical Ambiguities

| # | Question | Status | Resolution |
|---|---|---|---|
| AMB-E2-01 | US2 AC4: What confirmation message shows for 2-item combos (Pricing+Credits / Pricing+Trial / Trial+Credits)? | **OPEN** | TCs written for 4 defined cases only; 3 partial combos marked as open |
| AMB-E2-02 | AC16: Is the empty session type error "Please selecte session type" (spec typo) or "Please select a session type."? | **OPEN** | Assume "Please select a session type." for TCs; note typo for dev |
| AMB-E2-03 | AC18: Toggle OFF — is previously entered data preserved (hidden/recoverable) or cleared (reset)? | **OPEN** | TCs written for both scenarios; flagged for clarification |

### Assumptions Carried Forward

| ID | Assumption | Source |
|---|---|---|
| A1-E1 | Price BVA (USD): min=$0.50, max=$999,999.99 (Stripe-imposed) | E1 analysis |
| A2-E1 | Billing cycle BVA: integer 1–12 | E1 analysis |
| A3-E1 | AC15: cross-toggle message uses custom user terminology | E1 QnA Q3 |
| A1-E2 | P1.1 expiration validation: min=1 for all units (days/weeks/months); max not capped in spec (assume SMALLINT: 32767) | BE solution doc `expiration_value SMALLINT NOT NULL` |
| A2-E2 | AC18 toggle OFF: data is preserved within the pop-up session (not saved), so re-toggling ON restores the entered data. After saving with toggle OFF, server clears the config. | Reasonable UX assumption |
| A3-E2 | US2 AC4: "Combo" = all 3 changed. 2-item combos assume message lists the changed sections by name. | AMB-E2-01 open |

### min_hints (Key Constraints from BE Docs)

- **package_credit_rules** saved at package_id level (not price_id)
- **EP-1** PATCH /packages/:id — `session_credits.enabled=true` with rules validated against booking-service; replace-all strategy (DELETE old, INSERT new)
- **EP-2** PATCH /packages/:id/publish — re-validates all session types before publish; blocks with 422 if any invalid
- **Race condition guard (AC17)**: server calls `booking-service GET /v1/session-types` at save time; returns 422 SESSION_TYPE_INACTIVE or SESSION_TYPE_NOT_CREDIT_ELIGIBLE
- **Race condition guard (AC6)**: publish endpoint also re-validates session types
- **Pricing model lock**: once published, pricing model cannot change — not a UI-only constraint, server also enforces
- **US2 AC5 mechanism**: "replace-all" on save only affects `package_credit_rules` (live config); `purchase_credit_snapshots` (per-purchase immutable copies) are unchanged
- **Toggle OFF + save**: `session_credits.enabled=false` → DELETE all `package_credit_rules` for this package

---

## [MODULE LIST] — Layer 2

### Strategy: Hybrid
- **CORE modules** (HIGH risk): BVA + EP + EG + DT (full coverage)
- **SUPPORT modules** (MED risk): EP + ST (focused coverage)

### Module Definitions

| Module ID | Name | ACs | Type | Risk | Technique |
|---|---|---|---|---|---|
| MOD_CORE_04 | Validation + Race Condition | US1 AC16, AC17 | Core | HIGH | BVA + EP + EG |
| MOD_CORE_05 | Save Flow + Overview Blocks | US1 AC19, AC20, AC21a, AC21b | Core | HIGH | EP + ST |
| MOD_CORE_06 | Edit: Confirm + Future-Only | US2 AC3, AC4, AC5 | Core | HIGH | DT + EP + EG |
| MOD_SUP_03 | Toggle Collapse Behavior | US1 AC18 | Support | MED | ST + EP |
| MOD_SUP_04 | Published Lock + Publish Block | US2 AC1, AC2, AC6 | Support | HIGH | EP + EG |

---

## [MODULE RISK REGISTER] — Layer 2

| Module | Risk Level | AC Tiers | Key Risk Drivers |
|---|---|---|---|
| MOD_CORE_04 | **HIGH** | AC16=T1, AC17=T1 | Server-side race condition (AC17); multi-field validation matrix (AC16); spec typo in error message (AMB-E2-02) |
| MOD_CORE_05 | **HIGH** | AC20=T1, AC21a=T1, AC19=T2, AC21b=T2 | Overview block rendering completeness; 6 pricing plan display variations (AC20); dual tooltip variation (AC21a); all-buttons-disabled during loading (AC19) |
| MOD_CORE_06 | **HIGH** | US2-AC4=T1, US2-AC5=T1, US2-AC3=T2 | DT for confirmation message (4 defined + 3 ambiguous combinations); future-only impact on existing purchases (data integrity) |
| MOD_SUP_03 | **MED** | AC18=T2 | Stateful toggle behavior; AMB-E2-03 (data preserved vs cleared) |
| MOD_SUP_04 | **HIGH** | US2-AC1=T1, US2-AC6=T1, US2-AC2=T2 | Pricing model lock enforcement; publish race condition (AC6); publish button NOT pre-disabled (spec explicit) |

### AC Tier Assignments

| AC | Tier | Justification |
|---|---|---|
| US1 AC16 | TIER_1 | Multi-field validation blocks save; critical path |
| US1 AC17 | TIER_1 | Server-side race condition; data integrity failure mode |
| US1 AC18 | TIER_2 | UX stateful behavior; no data integrity risk |
| US1 AC19 | TIER_2 | Loading state UX; button disable prevents double-submit |
| US1 AC20 | TIER_1 | Primary visual output of save; 6 format variations must all be correct |
| US1 AC21a | TIER_1 | Feature visibility gate — missing block = feature invisible |
| US1 AC21b | TIER_2 | Secondary interaction; P1.1 popup reuse |
| US2 AC1 | TIER_1 | Business rule: pricing model lock enforced after publish |
| US2 AC2 | TIER_2 | Permissive rule; credits stay editable — lower risk of misimplementation |
| US2 AC3 | TIER_2 | Happy path (no confirm needed) — simpler |
| US2 AC4 | TIER_1 | Complex DT: 4 defined + 3 ambiguous confirmation message combinations |
| US2 AC5 | TIER_1 | Data integrity: existing purchases must NOT be retroactively affected |
| US2 AC6 | TIER_1 | Publish gate race condition; high severity if missed — credits break on publish |

---

## [TECHNIQUE ASSIGNMENT MAP] — Layer 2

| AC | Primary Technique | Secondary | Artifact |
|---|---|---|---|
| AC16 | EP (field states) | BVA (credit 0/1/100/101) | BVA Table AC16, Error Matrix |
| AC17 | EG (valid→invalid race) | ST (state: selected→deactivated→save) | EG Table AC17 |
| AC18 | ST (toggle state machine) | EP | ST Diagram AC18 |
| AC19 | ST (loading state machine) | EP | ST Diagram AC19 |
| AC20 | EP (pricing model × trial matrix) | — | 2×3 Display Matrix AC20 |
| AC21a | EP (credits present/absent, type tooltip) | — | EP Table AC21a |
| AC21b | EP | — | — |
| US2 AC1 | EP (published vs unpublished) | — | — |
| US2 AC2 | EP (field editability) | — | — |
| US2 AC3 | EP | — | — |
| US2 AC4 | DT (what changed → message) | EP (UI elements) | Decision Table AC4 |
| US2 AC5 | EP (new vs existing purchase) | — | — |
| US2 AC6 | EG (valid session type → archived/off → publish) | EP | EG Table AC6 |

---

## [DEEP ANALYSIS PACKAGE v3] — Layer 3

### AC16 — Validation Errors

**BU:** Inline validation must block save and surface specific errors per field. Each field has its own error message. Multiple fields can be invalid simultaneously.

**DR:**
- DR1: Red border = visual error state; must appear on blur or on save attempt
- DR2: Update Pricing button state depends on ALL fields valid (not just credit fields — pricing fields from AC5–10 also gate the button; confirmed in E1)
- DR3: "Invalid expiration" delegates to P1.1 rules; for TCs, use: empty = "Please set a duration.", value < min = "Please set a duration." (assumed per Assumption A1-E2)
- DR4: Credit field BVA: 0 = "Amount must be greater than 0.", 1 = valid, 100 = valid, 101 = "Amount must not exceed 100."

**BVA Table — AC16 Credit Amount:**
| Value | Partition | Expected |
|---|---|---|
| 0 | Invalid (zero) | "Amount must be greater than 0." |
| 1 | Valid (lower bound) | No error, border blue |
| 100 | Valid (upper bound) | No error, border blue |
| 101 | Invalid (exceed) | "Amount must not exceed 100." |

**EP — Field Error Matrix:**
| Condition | Error Message | Button State |
|---|---|---|
| Session type = empty | "Please select a session type." | Disabled |
| Credit amount = empty | "Please set a number of credits." | Disabled |
| Credit amount = 0 | "Amount must be greater than 0." | Disabled |
| Credit amount = 101 | "Amount must not exceed 100." | Disabled |
| Expiration duration = empty | "Please set a duration." | Disabled |
| Invalid expiration value | P1.1 error message | Disabled |
| All fields valid | No error | Enabled |
| Mixed (some valid, some not) | Per-field errors shown | Disabled |

**Risk Notes:**
- SPEC TYPO AMB-E2-02: "Please selecte session type" → verify exact string with dev before testing

---

### AC17 — Race Condition on Save

**BU:** Server re-validates session types at save time. If any session type was deactivated (archived OR `require_credit=false`) between pop-up open and Update Pricing click, the save must fail with specific toast + UI update.

**DR:**
- DR1: This is server-side rejection — the BE doc (6.4) confirms server returns error signal on invalid session type. UI must handle the error response.
- DR2: "Remove the inactive session type from the pop-up" — this means the row is deleted from the UI, leaving remaining valid rows in place
- DR3: "Highlight session type box in red: 'Please select session type.'" — this implies the row was removed and a new empty row is shown, or the session type dropdown is cleared and shows the error
- DR4: The toast fires first, then the UI updates (row removal + error highlight)
- DR5: Only invalid session types are removed; valid ones stay

**EG Table — AC17:**
| Case | Session Type State at Save | Result |
|---|---|---|
| EG-1 (happy) | All types still active + require_credit=true | Save succeeds, no toast |
| EG-2 | One type archived between open and save | Toast shown, that row removed, remaining rows stay |
| EG-3 | One type require_credit=OFF between open and save | Toast shown, that row removed, remaining rows stay |
| EG-4 | Multiple types, one invalid | Toast shown, only invalid row removed |
| EG-5 | All types invalid | Toast shown, all rows removed (or reset to single empty row) |
| EG-6 | Fix (re-select valid type after error) | Update Pricing re-enabled after valid selection |

**ST Diagram — AC17:**
```
State: Types selected + valid →
  [Click Update Pricing]
  → Server validates at save time
  → If all valid: SUCCESS (pop-up closes, Overview updates)
  → If any invalid: RACE_CONDITION_ERROR
    → Toast: "A session type is no longer available. Please try again."
    → Invalid row removed from pop-up
    → Session type field of removed row shows: "Please select session type." (red)
    → Update Pricing disabled
    → [User fixes: selects new valid type] → Update Pricing re-enabled → retry save
```

---

### AC18 — Toggle OFF Collapse

**BU:** Turning OFF either toggle (Free Trial or Session Credits) collapses its configuration section to default state.

**DR (based on Assumption A2-E2):**
- DR1: "Collapses to default status" — visual collapse only within the current pop-up session; data preserved until next save
- DR2: Toggling OFF and then ON again within the same pop-up session: data is restored (assumption — dev to confirm)
- DR3: After saving with toggle OFF + reopening pop-up: section shows default (empty) state

**ST Diagram — AC18 (Session Credits toggle):**
```
DEFAULT (toggle OFF, section hidden)
  → [Toggle ON] → Section expands (1 row, empty fields)
    → [Enter data] → Section filled
      → [Toggle OFF] → Section collapses to DEFAULT
        → [Toggle ON again] → (AMB-E2-03: data restored OR fresh empty state)
          → [Save with toggle OFF] → Server clears rules
            → [Reopen pop-up] → Section shows DEFAULT (confirmed cleared)
```

---

### AC19 — Loading State on Save

**BU:** Clicking Update Pricing triggers an async save. During the save, user must not be able to interact with the pop-up.

**DR:**
- DR1: "All buttons" = Cancel, X button, Update Pricing itself (showing loading animation), and any other interactive elements
- DR2: Loading state ends when server responds (success or error)
- DR3: On success: pop-up closes (or refreshes to show updated pricing)
- DR4: On error (e.g., race condition AC17): loading stops, error state shown, pop-up stays open

**ST Diagram — AC19:**
```
IDLE (pop-up open, data valid)
  → [Click Update Pricing] → LOADING
    → Button shows loading animation
    → All buttons disabled
    → [Server responds: success] → pop-up closes, Overview updated
    → [Server responds: error (AC17)] → IDLE + error toast + row removed
```

---

### AC20 — PRICING PLAN Block Display

**BU:** After saving, the Package Overview shows a PRICING PLAN block with the correct format based on pricing model and trial presence.

**DR:**
- DR1: Block always shows after pricing is saved (even without credits)
- DR2: Six display format variants: One-time / Recurring-forever / Recurring-fixed-term × No trial / With trial
- DR3: Currency code and amount formatted with commas for large values
- DR4: Edit icon click must open Package Pricing pop-up (same pop-up as creation)

**Display Matrix — AC20:**
| Pricing Model | Trial | Format | Tag |
|---|---|---|---|
| One-time | No | `USD $1,000.00 one time` | None |
| One-time | Yes | `USD $1,000.00 one time` | `{x}-DAY TRIAL` |
| Recurring forever | No | `USD $1,000.00 / month` | None |
| Recurring forever | Yes | `USD $1,000.00 / month` | `{x}-DAY TRIAL` |
| Recurring fixed-term | No | `USD $1,000.00 / 3 months . 4 times` | None |
| Recurring fixed-term | Yes | `USD $1,000.00 / 3 months . 4 times` | `{x}-DAY TRIAL` |

---

### AC21a — SESSION CREDIT Block

**BU:** If credits are configured and saved, a SESSION CREDIT block must appear below PRICING PLAN. Each session type row shows 3-column data. Tooltips differ by pricing model.

**DR:**
- DR1: Block only shows if at least one session type is saved (credits enabled + rules exist)
- DR2: Toggle credits ON but save with no rules → no block shown (edge case)
- DR3: Each row: [color dot + name] / [coin icon + quantity] / [in {n} {period}]
- DR4: Long name truncation: if name exceeds available space → show "…"
- DR5: Edit icon navigates to Package Pricing pop-up with credits pre-filled

**EP Table — AC21a:**
| Condition | Expected |
|---|---|
| Credits configured + recurring package | Block shown + tooltip about billing cycle issuance |
| Credits configured + one-time package | Block shown + tooltip about one-time issuance |
| Credits NOT configured (no rules) | Block NOT shown |
| Session type name < display width | Full name shown |
| Session type name > display width | Truncated with "…" |
| 1 session type | Single row |
| 5 session types (max) | 5 rows in 3-column layout |
| Expiration in days | "in X days" |
| Expiration in weeks | "in X weeks" |
| Expiration in months | "in X months" |

---

### US2 AC4 — Confirmation Pop-up (Decision Table)

**BU:** When a published package is edited, a confirmation pop-up must appear with a message tailored to what changed (pricing / trial / credits).

**DR:**
- DR1: The confirmation is only triggered for packages that have been published at least once (US2 AC3 covers unpublished packages)
- DR2: "Changed" = any field within that section is different from the saved state
- DR3: Cancel button = no save; data returns to pre-edit state
- DR4: Confirm button = save proceeds

**Decision Table — US2 AC4:**
| Pricing Plan Changed | Free Trial Changed | Session Credits Changed | Expected Message |
|:---:|:---:|:---:|:---|
| Y | N | N | "You are changing the Pricing Plan for this package. The changes will take effect as soon as the package is published." |
| N | Y | N | "You are changing the Free Trial for this package. The changes will take effect as soon as the package is published." |
| N | N | Y | "You are changing the Session Credits for this package. The changes will take effect as soon as the package is published." |
| Y | Y | Y | "You are changing the Pricing Plan, Free Trial, and Session Credits for this package. The changes will take effect as soon as the package is published." |
| Y | Y | N | **AMB-E2-01: Undefined in spec** — Assumption: "the Pricing Plan and Free Trial" |
| Y | N | Y | **AMB-E2-01: Undefined in spec** — Assumption: "the Pricing Plan and Session Credits" |
| N | Y | Y | **AMB-E2-01: Undefined in spec** — Assumption: "the Free Trial and Session Credits" |
| N | N | N | N/A — Update Pricing button should not be enabled if nothing changed |

---

### US2 AC5 — Future-Only Impact

**BU:** Credit configuration changes applied via Update Pricing only affect new purchases. Existing purchases use their `purchase_credit_snapshots` (immutable at buy-time).

**DR:**
- DR1: The mechanism is architectural: `package_credit_rules` is updated (live config), but `purchase_credit_snapshots` per purchase are never modified
- DR2: "Existing purchases are NOT affected" = existing clients continue receiving credits per their snapshot, even if coach changes the package credits
- DR3: "Updated info shown in Overview Pricing component" = this refers to the live package config (visible to coach on the package overview), not the purchase's snapshot

**EG Table — US2 AC5 (test scenarios):**
| Case | Scenario | Expected |
|---|---|---|
| EG-1 (happy) | Edit credits (e.g., change quantity from 5 to 10) → confirm | Overview shows new qty (10); existing client's next billing still uses snapshot (5) |
| EG-2 | Add a new session type to credits → existing purchase cycle | Existing purchase does NOT issue for the new session type |
| EG-3 | Remove a session type from credits → existing purchase cycle | Existing purchase continues issuing for the removed type (per snapshot) |

---

### US2 AC6 — Publish Block Race Condition

**BU:** At publish time, the server re-validates all session types in the package's credit rules. If any type is archived or has `require_credit=false`, the publish is blocked with a specific toast.

**DR:**
- DR1: Publish button is intentionally NOT disabled before click — user must click to see the error (spec explicit: "Publish button is NOT disabled — coach can click it to see error")
- DR2: This is server-side validation (EP-2 in BE doc: re-validates via booking-service before delegating to UpdatePackageService)
- DR3: "Inactive" = either archived OR `require_credit=false`
- DR4: Fix paths: (a) reactivate the session type, (b) remove the session type from the credit rule, (c) unpublish the package (then publish again)

**EG Table — US2 AC6:**
| Case | Precondition | Action | Expected |
|---|---|---|---|
| EG-1 (happy) | All session types active + require_credit=true | Click Publish | Publish succeeds |
| EG-2 | One session type archived after credits saved | Click Publish | Toast: "Can't publish. A session credit rule..." |
| EG-3 | One session type require_credit=OFF after credits saved | Click Publish | Same toast |
| EG-4 | Multiple types, one invalid | Click Publish | Same toast (blocked) |
| EG-5 (fix A) | After EG-2: reactivate session type | Click Publish again | Publish succeeds |
| EG-6 (fix B) | After EG-2: remove session type from rule, save | Click Publish again | Publish succeeds |
| EG-7 | No credit rules configured on package | Click Publish | Publish succeeds (no credit rules to validate) |

---

### Data Prerequisite Cards — E2

**TD-E2-001** — Unpublished Package with Credits Configured
- WS: Stripe connected, Booking ON, P&P ON
- Package: draft (never published), pricing configured (any model), session credits ON with ≥1 valid session type
- Session type: active, require_credit=true
- Use for: US2 AC3 (save without confirm)

**TD-E2-002** — Published Package with Credits Configured
- WS: same as above
- Package: published at least once, pricing configured, session credits ON with ≥1 valid session type
- Pricing model: 3 variants needed (one-time, recurring-forever, recurring-fixed-term)
- Use for: US2 AC1 (pricing model locked), US2 AC2 (fields editable), US2 AC4 (confirm popup), US2 AC6 (publish block)

**TD-E2-003** — Package + Session Type to Archive During Test
- WS: same
- Package: published, session credits ON with session type ST-VOLATILE
- ST-VOLATILE: active at test start; will be archived or have require_credit toggled during test
- Use for: US1 AC17 (race condition on save), US2 AC6 (publish block)

**TD-E2-004** — Package with Existing Active Purchases
- WS: same
- Package: published, session credits configured with session type ST-A (qty=5)
- Purchases: ≥1 active purchase from this package (client has received credits per snapshot)
- Use for: US2 AC5 (future-only impact — verify existing purchase unaffected after edit)

**TD-E2-005** — Package with All 3 Sections Changed
- WS: same
- Package: published, pricing plan + free trial + session credits all configured
- Use for: US2 AC4 DT "all three changed" case

---

### Dependency Map — MANDATORY TCs (Cross-Module)

| Dependency | From AC | To AC | Module | Why |
|---|---|---|---|---|
| DEP-E2-01 | US1 AC16 (validation) | US1 AC19 (loading) | C04 → C05 | Loading only triggers when data IS valid; validation test must establish the "all valid" baseline |
| DEP-E2-02 | US1 AC17 (race condition) | US2 AC6 (publish block) | C04 → S04 | Both test session-type-invalid-at-action-time; AC6 uses same TD-E2-003 with different trigger |
| DEP-E2-03 | US1 AC19 (save completes) | US1 AC20 (overview block) | C05 → C05 | AC20 block only appears after successful save (AC19 success path) |
| DEP-E2-04 | US1 AC20 (pricing block) | US1 AC21a (credit block) | C05 → C05 | Credit block appears below pricing block; pricing block must be present first |
| DEP-E2-05 | US2 AC3/AC4 (save flows) | US2 AC5 (future-only) | C06 → C06 | AC5 scenario requires a completed save (AC3 or AC4 path) |
| DEP-E2-06 | US2 AC1 (pricing locked) | US2 AC4 (confirm popup) | S04 → C06 | Confirmation popup for published package; pricing model field locked (AC1) during same edit session |

**MANDATORY TCs (must exist in suite to satisfy RTM):**
1. MAND-E2-01: Validate credit amount BVA boundaries (0, 1, 100, 101)
2. MAND-E2-02: Race condition — session type archived between open and save
3. MAND-E2-03: Loading state — all buttons disabled during save
4. MAND-E2-04: AC20 all 6 pricing plan display variants
5. MAND-E2-05: AC21a — block shown vs not shown (credit enabled vs disabled)
6. MAND-E2-06: US2 AC4 DT — all 4 defined confirmation message variants
7. MAND-E2-07: US2 AC5 — existing purchase unaffected after edit
8. MAND-E2-08: US2 AC6 — publish blocked when session type archived
9. MAND-E2-09: US2 AC6 — publish blocked when require_credit=OFF
10. MAND-E2-10: US2 AC1 — pricing model field disabled on published package

---

## [RTM — E2 Coverage Map]

| AC | Min TCs Required | Techniques Used | Module |
|---|---|---|---|
| US1 AC16 | 12 | BVA (4) + EP (8) | MOD_CORE_04 |
| US1 AC17 | 8 | EG (6) + ST (2) | MOD_CORE_04 |
| US1 AC18 | 8 | ST (6) + EP (2) | MOD_SUP_03 |
| US1 AC19 | 6 | ST (4) + EP (2) | MOD_CORE_05 |
| US1 AC20 | 12 | EP (6 display variants + 4 UI + 2 edge) | MOD_CORE_05 |
| US1 AC21a | 12 | EP (10) + UI (2) | MOD_CORE_05 |
| US1 AC21b | 3 | EP (3) | MOD_CORE_05 |
| US2 AC1 | 4 | EP (4) | MOD_SUP_04 |
| US2 AC2 | 5 | EP (5) | MOD_SUP_04 |
| US2 AC3 | 4 | EP (4) | MOD_CORE_06 |
| US2 AC4 | 12 | DT (7) + UI (5) | MOD_CORE_06 |
| US2 AC5 | 6 | EG (4) + EP (2) | MOD_CORE_06 |
| US2 AC6 | 10 | EG (7) + EP (3) | MOD_SUP_04 |
| **TOTAL** | **102** | | |

**TC Floor: 102 TCs | Mode M target: 95–115**

---

*[L1+L2+L3 → saved to analysis-E2.md]*
*[Resume at L5 → read this file for context | load test-cases/test-cases-E2.md for output]*
