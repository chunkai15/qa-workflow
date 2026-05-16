# MacroSnap Free Access — Test Cases (Grouped by US / AC)
**Project:** payment/ms-free-access | **Spec:** v2 post-meeting | **Version:** Final AC-grouped

**Confirmed rules applied:**
- Owner / Admin / Trainer all eligible (same treatment)
- Admin→Trainer demotion does NOT revoke (Trainer still eligible)
- Pre-release manual unassign → preserved (no migration grant)
- Coach pending→active → grant fires (R-14 ✅) | Client pending→connected → grant fires (R-15 ✅)
- WS upgrade Starter→paid → re-grant fires (REQ_23 ✅)

**Open items remaining:** OQ-01 · OQ-03 · REQ_22

---

## Test Data Reference

| DataID | Category | Description | Key Values | Setup | Used In |
|---|---|---|---|---|---|
| TD-001 | WS | Paid Pro + active MS subscription | plan=Pro; MS sub=active | 1 | SCEN-001/002/005/006/009; EDGE-001/005/006/007/008 |
| TD-002 | WS | Paid Studio + no MS subscription | plan=Studio; MS sub=none | 1 | SCEN-003/007; EDGE-003/004 |
| TD-003 | WS | Paid Accelerator Bundle | plan=Accel Bundle | 1 | SCEN-004 |
| TD-004 | WS | Starter WS | plan=Starter | 1 | SCEN-008 |
| TD-005 | WS | Free Trial WS | plan=Free Trial | 1 | SCEN-007 |
| TD-006 | WS | White Label WS — paid | plan=Pro; WL=true | 1 | OPEN-002 |
| TD-007 | User | Owner + matching client email | `coach_owner@testms.com` | 2 | SCEN-001; EDGE-001/005/006/007/008 |
| TD-008 | User | Admin + matching client email | `coach_admin@testms.com` | 2 | SCEN-003/005 |
| TD-009 | User | Trainer + matching client email | `coach_trainer@testms.com` | 2 | SCEN-002/004 |
| TD-010 | User | Non-matching client email | `client_nomatch@testms.com` | 2 | GE-10 |
| TD-011 | State | Pre-deploy existing connected client | email matches active coach before deploy | 3 | SCEN-003; EDGE-003/004 |
| TD-012 | State | Pre-release manually ASSIGNED | had regular MS assigned pre-release | 3 | OPEN-001 |
| TD-013 | State | Pre-release manually UNASSIGNED | had MS manually unassigned pre-release | 3 | GE-14; MGA-02 |
| TD-014 | State | Dual-license client | regular MS via MS mgmt; same email added as teammate | 3 | SCEN-006; EDGE-008 |
| TD-015 | Boundary | Mixed-case email pair | coach `Coach.Mixed@TestMS.com`; client `coach.mixed@testms.com` | 2 | OPEN-003 |
| TD-016 | State | Pending coach | not yet active | 2 | SCEN-009 |
| TD-017 | State | Pending client | not yet connected | 2 | SCEN-010 |

**Setup order:** WS fixtures (1) → User fixtures (2) → State/pre-release fixtures (3)
**Reset:** Restore MS sub state on TD-001 and archived/deleted clients between edge case runs.

---
---

# US1 — Complementary License Engine

---

## US1-AC1: Grant on New Client Creation

**AC:** System grants complementary MS when client email matches active Owner/Admin/Trainer on paid WS.

**Two hard gates (applied before any row below):**
- **Gate 1 — Email:** client email must exactly match an active coach email → NO MATCH = No grant (all rows)
- **Gate 2 — Plan:** WS must be Pro / Studio / Accelerator Bundle → Free Trial / Starter = No grant (all rows)

### Decision Table — Positive Grant Cases

> Owner / Admin / Trainer behave identically. One row covers all 3 roles.

| ID | WS Plan | Coach State | Client State | Grant? | Email Sent? | Seat Count | MS Mgmt Page | Client Profile UI |
|---|---|---|---|---|---|---|---|---|
| GE-01 | Pro / Studio / Accel | **Active** | New connected | ✅ Yes | No (post-deploy) | No change | Hidden | Disabled "Assigned" + tooltip |
| GE-02 | Pro / Studio / Accel | **Pending → Active** (R-14) | Existing connected | ✅ Yes | No | No change | Hidden | Disabled "Assigned" + tooltip |
| GE-03 | Pro / Studio / Accel | Active | **Pending → Connected** (R-15) | ✅ Yes | No | No change | Hidden | Disabled "Assigned" + tooltip |
| GE-04 | **Starter → Paid** upgrade (REQ_23) | Active | Existing connected | ✅ Yes (re-grant) | No | No change | Hidden | Disabled "Assigned" + tooltip |

### Decision Table — Negative Grant Cases

| ID | WS Plan | Coach State | Client State | Email Match? | Grant? | Reason |
|---|---|---|---|---|---|---|
| GE-10 | Pro / Studio / Accel | Active | New connected | ❌ No match | ❌ No | Gate 1 fail |
| GE-11 | **Free Trial / Starter** | Active | New connected | Match | ❌ No | Gate 2 fail |
| GE-12 | Pro / Studio / Accel | **Pending** (not active) | Connected | Match | ❌ No | Coach must be active first |
| GE-13 | Pro / Studio / Accel | Active | **Pending** (not connected) | Match | ❌ No | Client must be connected first |
| GE-14 | Pro / Studio / Accel | Active | Pre-release **manually unassigned** | Match | ❌ No | Preserve unassigned state |

### Coach × Client State Cross-Matrix

**Core rule: grant fires ONLY when coach ACTIVE + client CONNECTED + email match + WS paid.**

#### Part A — When does a NEW grant fire?

| ID | Coach State | Client State | Grant? | Notes |
|---|---|---|---|---|
| CS-01 | Active | New connected | ✅ YES | Standard happy path |
| CS-02 | Active | Existing connected (migration) | ✅ YES | See US1-AC4 for migration details |
| CS-03 | Pending → **Active** (R-14) | Existing connected | ✅ YES on activation | TC-SCEN-009 |
| CS-04 | Active | Pending → **Connected** (R-15) | ✅ YES on connection | TC-SCEN-010 |
| CS-05 | Active | Existing — WS **Starter→paid** (REQ_23) | ✅ YES re-grant | TC-SCEN-008 |
| CS-06 | **Pending** (not active) | Connected | ❌ NO | Coach must be active first |
| CS-07 | Active | **Pending** (not connected) | ❌ NO | Client must be connected first |
| CS-08 | Active | **Archived** (never connected before) | ❌ NO | Not connected = not eligible |
| CS-09 | Active | Connected | ❌ NO (email mismatch) | Gate 1 |
| CS-10 | Active | Connected | ❌ NO (non-paid plan) | Gate 2 |

#### Part B — Post-grant: what happens when state changes?

| ID | Event | Grant After | Client Access |
|---|---|---|---|
| SC-01 | Client: connected → **archived** | PRESERVED (archive not a trigger) | ✅ Retained |
| SC-02 | Client: archived → **connected** (unarchive) | PRESERVED (no new grant) | ✅ Retained |
| SC-03 | Client: connected → **hard deleted** | REVOKE + cleanup | ❌ Gone |
| SC-04 | Coach: active → **removed** from WS | REVOKE | ❌ Gone |
| SC-05 | Coach: **Admin → Trainer** demotion | PRESERVED (Trainer eligible) | ✅ Retained |
| SC-06 | WS: paid → **Starter** downgrade | REVOKE | ❌ Gone |
| SC-07 | WS: **Starter → paid** upgrade (REQ_23) | RE-GRANT fires | ✅ New |

### Step-by-step TCs — US1-AC1

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SCEN-001 | New eligible client → grant → billing + UI correct | TD-001. Owner (TD-007). No existing client with Owner email. MS sub active. | 1. Create connected client with Owner email. 2. Log in to client app. 3. Open MS management + seat summary. 4. Open client profile → hover button. | Client accesses MS. Seat count unchanged. Complementary hidden from management. Profile: disabled "Assigned" + tooltip. | P0 |
| TC-SCEN-008 | WS upgrade Starter→paid → re-grant fires (REQ_23) | TD-004 (Starter). Active Owner email matches existing connected client. | 1. Upgrade WS from Starter to Pro. 2. Log in to client app. 3. Open MS management page. | Complementary MS granted. Client accesses MS. Hidden from management. Seat count unchanged. | P0 |
| TC-SCEN-009 | Coach pending→active triggers grant (R-14) | TD-001. Pending coach (TD-016) email matches existing connected client. | 1. Activate the pending coach. 2. Log in to client app with coach email. 3. Check license state. | Complementary MS granted when coach becomes active. | P0 |
| TC-SCEN-010 | Client pending→connected triggers grant (R-15) | TD-001. Active Trainer email matches pending client (TD-017). | 1. Accept/connect the pending client. 2. Log in to client app. 3. Check license state. | Complementary MS granted when client becomes connected. | P0 |
| TC-EDGE-005 | Coach removed while client creation is in-flight | TD-001. Admin (TD-008) being removed concurrently with client creation. | 1. Start creating connected client with Admin email. 2. Remove Admin before grant completes. 3. Verify client app. | No complementary access. Post-removal eligibility wins. | P1 |

---

## US1-AC2: License Not Counted, Not Visible

**AC:** Complementary license must not be counted in subscription seat total, not displayed in MS management page, not listed in assignment dropdown.

### Billing & MS Management Visibility Matrix

| ID | License State | MS Sub State | Seat Count | MS Mgmt Page | Assignment Dropdown | Client App |
|---|---|---|---|---|---|---|
| BL-01 | Complementary only | Active | **No increment** | **Hidden** | **Not selectable** | ✅ Access |
| BL-02 | Regular paid only | Active | +1 counted | Visible | Selectable | ✅ Access |
| BL-03 | Dual: regular + complementary | Active | +1 (regular only) | Regular visible; complementary hidden | Regular selectable | ✅ Access |
| BL-04 | Dual → after regular unassign | Active | −1 (seat freed) | Complementary hidden | Not selectable | ✅ Access (complementary) |
| BL-05 | Complementary only | **Cancelled** | No impact | N/A | N/A | Per BE; button hidden in coach UI |

> **Coverage note:** BL-01 verified within TC-SCEN-001, TC-SCEN-003, TC-SCEN-004. BL-03/04 verified within TC-SCEN-006 (US2-AC3). No dedicated step-by-step TC needed — billing surface is always checked as part of E2E flows above.

| TC-EDGE-007 | Simultaneous grant + regular assignment — no double-count | TD-001 + TD-007. Complementary grant in progress. | 1. Trigger complementary grant. 2. Assign regular MS to same client concurrently. 3. Open seat summary. | Seat count reflects only regular paid license. No double-count. | P1 |

---

## US1-AC3: Revoke on Coach Removal / WS Downgrade

**AC:** System immediately revokes complementary MS when coach is removed from WS OR WS is downgraded to Starter.
**Archive is NOT a revocation trigger** (removed from product scope v2).

### Revocation & Preservation Decision Table

| ID | Trigger Event | Valid Revoke? | Grant After | Client Access | Notes |
|---|---|---|---|---|---|
| RV-01 | Coach **removed** from WS | ✅ Yes | Revoked | ❌ No MS | Primary revocation trigger |
| RV-02 | WS downgraded to **Starter** | ✅ Yes | Revoked | ❌ No MS | All complementary on that WS revoked |
| RV-03 | Client **archived** | ❌ No revoke | Preserved | ✅ MS retained | Archive not a trigger (v2 spec) |
| RV-04 | Client **unarchived** | N/A | Preserved (single) | ✅ MS retained | No duplicate grant |
| RV-05 | Admin → **Trainer** demotion | ❌ No revoke | Preserved | ✅ MS retained | Trainer still eligible |
| RV-06 | Client **hard deleted** | ✅ Yes (cleanup) | Cleaned up | N/A | No orphaned license |
| RV-07 | WS **Starter → Paid** upgrade | ✅ Re-grant | Granted | ✅ MS restored | REQ_23 confirmed |

### Step-by-step TCs — US1-AC3

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SCEN-002 | Grant → coach removal → access revoked (E2E) | TD-001. Trainer (TD-009) has matching connected client with complementary MS. | 1. Remove Trainer from teammates. 2. Log in to client app with Trainer email. 3. Open client profile. | Client cannot access MS. Complementary state removed from UI. Seat count unchanged. | P0 |
| TC-SCEN-004 | All roles granted → WS downgrade → all revoked (E2E) | TD-003. Owner, Admin, Trainer each have matching connected clients with complementary MS. | 1. Downgrade WS to Starter. 2. Log in to each matching client app. 3. Open MS management page. | All complementary MS access revoked. Nothing visible or counted. | P0 |
| TC-SCEN-005 | Admin → Trainer demotion preserves access | TD-001. Admin (TD-008) has matching connected client with complementary MS. | 1. Change Admin to Trainer. 2. Log in to client app. 3. Open client profile. | MS access kept. No revoke. UI stays disabled Assigned. | P0 |
| TC-EDGE-001 | Archive → unarchive: no revoke, no duplicate (sequential) | TD-001 + TD-007. Client has complementary MS. | 1. Archive the client. 2. Log in to client app → verify MS access retained. 3. Check MS management + seat count. 4. Unarchive the client. 5. Verify single state, no duplicate. | Archive: MS access preserved, seat count unchanged, no revoke event. Unarchive: single complementary state, no duplicate. | P1 |
| TC-EDGE-002 | Client hard delete cleans up complementary license | TD-001 + TD-007. Client has complementary MS. | 1. Hard delete the client. 2. Check MS management page. 3. Check seat count. | No orphaned license. Management page clean. Seat count unchanged. | P1 |

---

## US1-AC4: Migration Retroactive Grant + Email

**AC:** On deployment, system grants complementary MS to all existing connected clients whose email matches an active coach role on a paid WS. One-time email sent for non-WL WS. No email for WL WS or post-deploy new accounts.

### Migration Matrix — By Client Status (§3A)

> **Core rule: Migration grants ONLY to CONNECTED clients.** Archived and pending clients are skipped regardless of email match or coach role.

| ID | Client Status | Matched Coach Role | Coach Has MS Plan? | Grant? | Email (non-WL)? | Reason |
|---|---|---|---|---|---|---|
| MGA-01 | **Connected** | Owner / Admin / Trainer | No plan  OR  Has plan (client not previously assigned) | ✅ YES | ✅ YES | Complementary is independent of MS plan purchase |
| MGA-02 | **Archived** | Owner / Admin / Trainer | Any | ❌ NO | ❌ NO | Archived ≠ connected — migration skips |
| MGA-03 | **Pending** | Owner / Admin / Trainer | Any | ❌ NO | ❌ NO | Pending ≠ connected — migration skips |

> Execute MGA-01 as 3 sub-passes: Owner (TD-007), Trainer (TD-009), Admin (TD-008) — both with and without MS plan.
> Execute MGA-02/03 as negative passes: confirm no grant, no email for archived/pending clients.

### Migration Special Cases (§3B)

| ID | Scenario | Grant? | Email? | Seat Impact |
|---|---|---|---|---|
| MGB-01 | Connected — **manually unassigned** pre-release | ❌ Preserve unassigned | ❌ No | No change |
| MGB-02 | Connected — **manually assigned** regular MS pre-release | **Open (OQ-01)** | Open | Record after BE decision |
| MGB-03 | Connected — **already migrated** (job runs twice) | ❌ No duplicate | ❌ No duplicate | No change |
| MGB-04 | Connected — **WS downgraded mid-job** | ❌ Not eligible | ❌ Not sent | No change |
| MGB-05 | Connected — **WL WS** | **Open (OQ-03)** | ❌ Suppressed | Per OQ-03 |
| MGB-06 | **New post-deploy** (not a migration target) | ✅ via normal F1 grant | ❌ Not sent | No change |

### Email Notification Decision Table

| ID | Account Timing | WS Type | Pre-release MS State | Email Sent? | Dedup Rule |
|---|---|---|---|---|---|
| EM-01 | Existing before deploy | Standard non-WL | None | ✅ Once — *"You now have access to MacroSnap"* | Max 1 per account |
| EM-02 | Existing before deploy | Standard non-WL | Manually unassigned | ❌ No grant = no email | — |
| EM-03 | Existing before deploy | **WL** | None | ❌ Suppressed | — |
| EM-04 | **New post-deploy** | Standard | N/A | ❌ Not migration path | — |
| EM-05 | Migration job **retried** | Standard non-WL | Already granted | ❌ No duplicate | 1 max total |
| EM-06 | First send fails → retry | Standard non-WL | None | ✅ Once on retry | 1 max |

### Step-by-step TCs — US1-AC4

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SCEN-003 | Migration → non-WL grant + email + UI (E2E) | TD-002. Existing connected client (TD-011) matches Admin (TD-008). MS sub active. | 1. Run migration job. 2. Log in to client app. 3. Open MS management page. 4. Open client profile. | MS access granted. One email: "You now have access to MacroSnap". Hidden from management. Profile: disabled Assigned. | P0 |
| TC-EDGE-003 | Migration retry is idempotent (no duplicate grant or email) | TD-002 + TD-011. Already migrated once. | 1. Run migration job. 2. Run migration job again. 3. Check email inbox count. 4. Check license state. | One complementary state. Exactly one email received total. | P1 |
| TC-EDGE-004 | WS downgrade during migration — final state = not eligible | TD-001 + TD-011. Migration job controllable. | 1. Start migration job. 2. Downgrade WS to Starter mid-run. 3. Verify client app after completion. | No complementary access remains. Starter ineligibility wins. | P1 |

### Open Items — US1-AC4

| ID | Open Item | Steps | Record |
|---|---|---|---|
| TC-OPEN-001 | OQ-01: Pre-release manually assigned regular MS — migration behavior | 1. Run migration on TD-012. 2. Open MS management page. 3. Check seat count. 4. Log in to client app. | Actual seat delta; MS access state; management page record |
| TC-OPEN-002 | OQ-03: WL WS — complementary grant despite email suppression? | 1. Run migration on TD-006 (WL WS). 2. Log in to client app. 3. Check MS access. 4. Verify no email. | Grant or no grant; email suppression confirmed |

---
---

# US2 — Coach Awareness & UI

---

## US2-AC1: Perk Awareness Callout for Paid Plan Coaches

**AC:** Paid-plan coaches (no MS subscription) see a callout below the "PURCHASE LICENSES FOR CLIENTS" CTA on the MS page.

### UI Condition Table

| ID | WS Plan | MS Subscription | Expected Callout |
|---|---|---|---|
| UI-01 | **Paid** (Pro / Studio / Accel) | **No** subscription | *"MacroSnap is free on your own client account. Log in to the Everfit client app with your coach email to try it!"* |
| UI-01-N | Paid | **Active** subscription | Callout still visible (subscription doesn't hide perk callout) |
| UI-01-N2 | Free Trial / Starter | No subscription | Upsell callout shown instead — see US2-AC2 |

> **Covered in:** TC-SCEN-007 (step 1 and 3 — verified as part of UI surfaces E2E flow).

---

## US2-AC2: Upsell Callout for Free/Trial Plan Coaches

**AC:** Free Trial and Starter plan coaches see an upsell callout + "Upgrade Everfit plan" link on the MS page.

### UI Condition Table

| ID | WS Plan | MS Subscription | Expected Callout | Upgrade Link |
|---|---|---|---|---|
| UI-02 | **Free Trial** | No subscription | *"Want to try MacroSnap yourself? Upgrade to a paid plan and your own client account gets MacroSnap for free."* | "Upgrade Everfit plan" → Choose my plan page |
| UI-02-B | **Starter** | No subscription | Same upsell callout + link | Same destination |

> **Covered in:** TC-SCEN-007 (step 2 — click upgrade link, verify navigation).

---

## US2-AC3: Disabled Button + Tooltip + Dual-license Reconciliation

**AC:** When WS has active MS subscription, the assign/unassign button on the complementary client's profile is **disabled** with tooltip. When MS subscription is **cancelled**, button is **hidden**. Edge case: if client was assigned via MS management first, then added as teammate, regular license is counted — coach must manually unassign, client retains access via complementary.

### UI Button State Decision Table

| ID | WS MS Sub | License State | Button State | Tooltip on Hover |
|---|---|---|---|---|
| UI-03 | **Active** | Complementary only | **Disabled** — always shows "Assigned" | *"MacroSnap is free on your own client account…"* |
| UI-04 | **Cancelled** | Complementary exists | **Hidden** (not rendered) | N/A |
| UI-05 | Active | Regular paid (non-complementary) | **Enabled** — normal assign/unassign | N/A |
| UI-06 | Active | Dual-license (regular + complementary) | **Enabled** — for regular license management | N/A |

### Dual-license State Transition

| ID | Action | Expected License State | Seat Count | Client Access |
|---|---|---|---|---|
| DL-01 | Client assigned via MS mgmt → added as teammate (same email) | Regular license IS counted to subscription | +1 (regular) | ✅ Access |
| DL-02 | Coach unassigns regular MS from dual-license client | Complementary only | −1 (seat freed) | ✅ Access retained |
| DL-03 | Client app refreshed during unassign (async) | Complementary only | Eventually −1 | ✅ Access preserved after refresh |

### Step-by-step TCs — US2-AC3

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-SCEN-006 | Dual-license: unassign → seat freed, access retained (E2E) | TD-001 + TD-014 (dual-license client). | 1. Record seat count. 2. Unassign regular MS via MS management. 3. Open seat summary. 4. Log in to client app. | Seat count −1. Client retains MS access via complementary license. | P0 |
| TC-SCEN-007 | UI surfaces correct across WS types (E2E) | TD-002 (paid no sub). TD-005 (Free Trial). TD-001 + TD-007 (complementary client). | 1. Open MS page on TD-002 → check callout. 2. Open MS page on TD-005 → click upgrade link. 3. Open complementary profile on TD-001 → hover button. | Paid WS: free-perk callout. Free Trial: upsell + link → plan page. Complementary profile: disabled + tooltip. | P0 |
| TC-EDGE-006 | MS subscription cancelled mid-session — no stale button | TD-001 + TD-007. Client profile open in coach browser. | 1. Cancel MS subscription in another session. 2. Refresh client profile. | Button hidden after refresh. No stale enabled/disabled control. | P1 |
| TC-EDGE-008 | Dual-license unassign — access continuous during async transition | TD-014. Client app session open. | 1. Open client app as matching client. 2. Unassign regular MS in coach web app simultaneously. 3. Refresh client MS page. | MS access remains after refresh. No access gap. | P1 |

### Open Item — US2-AC3

| ID | Open Item | Steps | Record |
|---|---|---|---|
| TC-OPEN-003 | REQ_22: Mixed-case email — does grant trigger? | 1. Coach email is mixed-case (TD-015). 2. Create connected client with lowercase version of same email. 3. Log in to client app. | Grant or no grant — record for BE to confirm case-sensitivity rule |

---
---

# QA-Internal Verification

> These items have no product AC but must be verified to ensure the spec change (archive removed from scope) did not introduce regressions.

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-EDGE-001 | Archive → unarchive: no revoke, no duplicate (sequential) | TD-001 + TD-007. Client has complementary MS. | 1. Archive the client. 2. Log in to client app — verify MS access retained. 3. Check MS management + seat count. 4. Unarchive client. 5. Verify single state, no duplicate. | Archive: MS access preserved, seat unchanged, no revoke event. Unarchive: single complementary state, no duplicate. | P1 |
| TC-EDGE-002 | Client hard delete cleans up complementary license | TD-001 + TD-007. Client has complementary MS. | 1. Hard delete the client. 2. Check MS management page. 3. Check seat count. | No orphaned license. Management page clean. Seat count unchanged. | P1 |

*(TC-EDGE-001 and TC-EDGE-002 are also listed under US1-AC3 for AC traceability. Duplicate reference is intentional.)*

---
---

# Coverage Map

| AC | Requirement Summary | Decision Tables | Step-by-step TCs | Status |
|---|---|---|---|---|
| US1-AC1 | Auto-grant on new client creation | GE-01–14, CS-01–10, SC-01–07 | TC-SCEN-001/008/009/010; TC-EDGE-005 | ✅ |
| US1-AC2 | Not counted; not shown in management/dropdown | BL-01–05 | TC-SCEN-001 (cross-AC); TC-EDGE-007 | ✅ |
| US1-AC3 | Revoke on removal/downgrade; archive NOT trigger | RV-01–07 | TC-SCEN-002/004/005; TC-EDGE-001/002 | ✅ |
| US1-AC4 | Migration: grant + email (existing connected, non-WL) | MGA-01–03, MGB-01–06, EM-01–06 | TC-SCEN-003; TC-EDGE-003/004; TC-OPEN-001/002 | ✅ (2 open) |
| US2-AC1 | Paid-plan perk callout on MS page | UI-01 | TC-SCEN-007 (cross-AC) | ✅ |
| US2-AC2 | Free/Trial upsell callout + upgrade link | UI-02 | TC-SCEN-007 (cross-AC) | ✅ |
| US2-AC3 | Disabled button + tooltip + dual-license reconciliation | UI-03–06, DL-01–03 | TC-SCEN-006/007; TC-EDGE-006/008; TC-OPEN-003 | ✅ (1 open) |

---

# Summary

| AC | Decision Conditions | Step-by-step TCs | Open Items |
|---|---|---|---|
| US1-AC1 | 4 positive + 5 negative + 17 state matrix = **26** | 5 TCs (4×P0 + 1×P1) | 0 |
| US1-AC2 | 5 matrix cases | 1 edge TC | 0 |
| US1-AC3 | 7 revocation cases | 5 TCs (3×P0 + 2×P1) | 0 |
| US1-AC4 | 3 migration + 6 special + 6 email = **15** | 3 TCs (1×P0 + 2×P1) + 2 open | 2 |
| US2-AC1 | 3 conditions | 1 TC (cross-AC) | 0 |
| US2-AC2 | 2 conditions | 1 TC (cross-AC) | 0 |
| US2-AC3 | 4 button states + 3 dual-license transitions = **7** | 4 TCs (2×P0 + 2×P1) + 1 open | 1 |
| QA-Internal | — | 2 TCs (P1) | 0 |
| **Total** | **~65 conditions** | **21 TCs** | **3** |
