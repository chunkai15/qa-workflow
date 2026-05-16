# MacroSnap Free Access — Production Smoke Test Checklist
**Feature:** MacroSnap — Free Access for Coach's Own Client Account
**Run after:** Feature deployment + migration job completion
**Estimated time:** 25–35 min
**Environment:** Production

---

## Pre-Smoke Requirements

Before starting, confirm all of these are available:

| Requirement | Notes |
|---|---|
| Migration job log access | Confirm job completed without errors |
| At least 1 paid non-WL WS (Pro/Studio/Accel) | With active Owner/Admin/Trainer having a known email |
| That coach email's inbox accessible | To verify migration email received |
| Client app access (mobile/web) | Log in as that coach email |
| Admin DB/tool access for seat count | To verify subscription seat total |
| 1 WL paid WS (if applicable) | For WL email suppression check |
| 1 paid WS with no MS subscription | For UI callout check |
| 1 Free Trial or Starter WS | For upsell callout check |

> ⚠️ **GO / NO-GO gate:** If P0 items (Phase 1–2) fail → **STOP, do not proceed to release acceptance.** Escalate to BE immediately.

---

## Phase 0 — Migration Job Verification (one-time, post-deploy)

> Run once immediately after deployment. Verify migration completed before any smoke tests.

| # | Check | Expected | Status | Notes |
|---|---|---|---|---|
| 0.1 | Migration job log: confirm completed without errors | Log shows success, no exceptions, no partial failures | ☐ | |
| 0.2 | Job log: confirm email sending triggered for non-WL eligible accounts | Email send events present in log | ☐ | |
| 0.3 | Job log: confirm WL WS accounts were processed without email send | WL accounts listed but email events absent | ☐ | |
| 0.4 | Spot-check 2–3 known existing connected clients (coach-email accounts) in admin tool: do they now have complementary MS? | Complementary license flag present on those accounts | ☐ | |

---

## Phase 1 — Migration Email Verification ✉️  (P0)

> Use a coach whose account existed before deployment and has a connected client with their email.

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 1.1 | Migration email received for pre-deploy connected client | Check coach email inbox | 1 email with subject **"You now have access to MacroSnap"** received | ☐ | |
| 1.2 | No duplicate email | Check if same email was sent more than once | Exactly 1 email — no duplicates | ☐ | |
| 1.3 | WL WS: no email sent | Check WL coach inbox | No migration email in WL coach's inbox | ☐ | |
| 1.4 | Pre-release manually unassigned account: no grant | Check admin tool for a known pre-unassigned account | No complementary license on that account | ☐ | |

---

## Phase 2 — New Client Grant Verification 🔑  (P0)

> Use a dedicated smoke test coach account or a real coach on a paid WS.
> **Action:** Create a new connected client using the coach's email.

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 2.1 | Complementary MS granted on new client creation | 1. Log in as Owner/Admin/Trainer on paid WS. 2. Create connected client using coach email. 3. Log in to client app with same email. | Client can access MacroSnap in client app without a paid license assigned | ☐ | |
| 2.2 | Seat count NOT incremented | After step 2.1: open Subscription settings → seat total | Seat count is same as before client creation | ☐ | |
| 2.3 | Complementary client NOT shown in MS management page | Open MS management page → search for client | Client NOT listed in paid MS management | ☐ | |
| 2.4 | Complementary client NOT in license assignment dropdown | Open license assignment dropdown → search for client email | Client NOT selectable as a paid license target | ☐ | |
| 2.5 | Client profile button is disabled with tooltip | Open client profile MS section → hover over the button | Button is **disabled**, always shows "Assigned", tooltip shows: *"MacroSnap is free on your own client account…"* | ☐ | |

---

## Phase 3 — Negative Grant Check 🚫  (P0)

> Verify no false grants — non-matching email must NOT receive complementary MS.

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 3.1 | Non-matching email does NOT receive complementary MS | 1. Create connected client using a different email (not any coach email on the WS). 2. Log in to client app with that email. | Client does NOT have MS access. Button on client profile is enabled (normal behavior). | ☐ | |
| 3.2 | Seat count unchanged for non-matching client | Check seat count after 3.1 | Seat count unaffected | ☐ | |

---

## Phase 4 — UI Callout Verification 📣  (P1)

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 4.1 | Paid WS with no MS subscription: perk awareness callout visible | Log in to a paid WS with no MS subscription → open MacroSnap page | Callout below "PURCHASE LICENSES FOR CLIENTS" CTA: *"MacroSnap is free on your own client account. Log in to the Everfit client app with your coach email to try it!"* | ☐ | |
| 4.2 | Free Trial / Starter WS: upsell callout visible + link works | Log in to Free Trial or Starter WS → open MacroSnap page → click "Upgrade Everfit plan" | Upsell text visible. Click navigates to **Choose my plan** page | ☐ | |

---

## Phase 5 — Migration Spot-Check: Existing Accounts 🔍  (P1)

> Verify a sample of pre-deploy eligible accounts received the grant correctly.

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 5.1 | Existing connected client (Owner email) has MS access | Log in to client app using the pre-existing connected client account | Client has MacroSnap access | ☐ | |
| 5.2 | That client NOT shown in management page | Open MS management page for that WS | Client NOT listed as paid MS license holder | ☐ | |
| 5.3 | Seat count for that WS unchanged post-migration | Check seat count via admin tool or Subscription settings | Seat count matches pre-migration value | ☐ | |
| 5.4 | Client with Trainer role match has MS access | If a Trainer's email matched a connected client: log in to client app | MS access granted (Trainer is eligible) | ☐ | |

---

## Phase 6 — WS Upgrade Re-grant Check (P1 — if safe test WS available)

> Only run if a dedicated test Starter WS exists in production with a matching connected client.
> **Skip if no safe test WS is available.**

| # | Check | Steps | Expected | Status | Notes |
|---|---|---|---|---|---|
| 6.1 | WS upgrade Starter→paid triggers re-grant | 1. Upgrade test Starter WS to Pro. 2. Log in to client app with matching email. 3. Check seat count. | Complementary MS granted after upgrade. Client accesses MS. Seat count unchanged. | ☐ | SKIP if no safe WS |

---

## Phase 7 — Staging-Only Checks (DO NOT run in production)

> These require destructive actions. Verify in staging before release.

| # | Check | Why Staging Only |
|---|---|---|
| S1 | Coach removal → MS revoked | Removes a real coach account |
| S2 | WS downgrade to Starter → all MS revoked | Modifies WS billing plan |
| S3 | Client hard delete → license cleanup | Permanently deletes client data |
| S4 | Migration retry idempotency | Re-runs migration job on prod data |
| S5 | Concurrent grant + plan change | Requires controlled timing |

---

## Go / No-Go Summary

Fill this in after completing the checklist:

| Phase | Items | PASS | FAIL | SKIP | Decision |
|---|---|---|---|---|---|
| Phase 0 — Migration job | 4 | | | | |
| Phase 1 — Migration email | 4 | | | | |
| Phase 2 — New grant (P0) | 5 | | | | |
| Phase 3 — Negative check (P0) | 2 | | | | |
| Phase 4 — UI callouts (P1) | 2 | | | | |
| Phase 5 — Spot-check (P1) | 4 | | | | |
| Phase 6 — WS upgrade (P1) | 1 | | | | |

**GO criteria:** All Phase 0–3 items PASS (15 items).
**NO-GO criteria:** Any Phase 0–3 item FAILS → escalate to BE before release acceptance.
**Conditional:** Phase 4–6 failures are P1 — document, create bug, continue release with known issues.

---

## Open Items at Release (fill in before sign-off)

| ID | Question | Decision Before Release? |
|---|---|---|
| OQ-01 | Pre-release manually assigned accounts — migration behavior | ☐ Resolved / ☐ Deferred |
| OQ-03 | WL WS grant eligibility — grant or just email suppressed? | ☐ Resolved / ☐ Deferred |
| REQ_22 | Email case-sensitivity — case-insensitive matching? | ☐ Resolved / ☐ Deferred |

---

*For full staging regression: use `regression-suite.md` (39 scenarios, Tier 0–3).*
*For full test case documentation: use `final-test-cases.md` and `ms-free-access-test-cases.xlsx`.*
