# MacroSnap Free Access — Regression Suite

**Project:** payment/ms-free-access  
**Pipeline Session:** SESSION 3 — Layer 4  
**BDD:** Skipped; automation/BDD was not requested and no project `automation/` folder exists.  
**Source:** `analysis.md` through Gate 3, including SME corrections for Trainer eligibility, Admin->Trainer non-revocation, and pre-release manual-unassign preservation.

---

## [REGRESSION SUITE]

### Tier Assignment Summary

| Tier | Purpose | Scenario Count | Run Timing |
|---|---|---:|---|
| Tier 0 | Critical cross-surface and cross-state paths | 8 | Every build / deploy smoke |
| Tier 1 | Main happy paths and common alternates | 16 | Staging regression / release candidate |
| Tier 2/3 | Edge, role, boundary, timing, and known-risk coverage | 15 | Major release / failed-fix retest |
| Total | Manual regression suite | 39 | Full feature regression |

### State Machine Scan

| Entity | Lifecycle / Key States | Regression Notes |
|---|---|---|
| Complementary MS license | not granted -> granted -> revoked | Grant is created by client creation or migration; revoke only on coach removal or WS downgrade. |
| Coach role state | Owner/Admin/Trainer active -> removed | Owner/Admin/Trainer are eligible. Admin->Trainer must preserve access. Removed coach revokes access. |
| WS plan | Trial/Starter -> paid -> Starter | Paid plans allow complementary access. Downgrade to Starter revokes. Starter->paid re-grant remains open. |
| Pre-release license state | none / manually assigned / manually unassigned | Manual assigned remains OQ-01. Manual unassigned is confirmed to remain unassigned after migration. |
| MS subscription state | none -> active -> cancelled | Active subscription shows disabled Assigned button. Cancelled subscription hides the button. |

### Regression Scenarios

| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
|---|---:|---|---|---|---|---|---|
| T0-001 | 0 | P0 | New eligible coach-client grant -> subscription count remains unchanged -> client profile shows disabled Assigned state | Paid Pro WS. Coach Owner email `coach_owner@testfitness.com`. No existing client with that email. Active MS subscription. | 1. Create a connected client using the coach email. 2. Open MS management page. 3. Open the client MS profile section. | Client receives complementary MS access. MS seat count does not increase. Complementary license is hidden from MS management. Client profile shows Assigned with disabled control and tooltip. | US1-AC1, US1-AC2, US2-AC3 |
| T0-002 | 0 | P0 | Migration grant -> non-WL email notification -> management page exclusion | Paid Studio non-WL WS. Existing connected client email matches active Admin. Migration job can be triggered in staging. | 1. Run migration job. 2. Open client app as the connected client. 3. Check email inbox. 4. Open MS management page. | Complementary MS is granted. One email with subject "You now have access to MacroSnap" is received once. License is not counted or listed on MS management page. | US1-AC4, US1-AC2 |
| T0-003 | 0 | P0 | Grant -> coach removal -> access revoked across client app and UI | Paid WS. Connected client has complementary MS from matching Trainer email. | 1. Remove the Trainer from teammates. 2. Log in to client app using the matching email. 3. Open client profile MS section as another coach. | Client no longer has MS access. Complementary assigned state is removed from UI. No paid seat count change occurs. | US1-AC1, US1-AC3, US2-AC3 |
| T0-004 | 0 | P0 | Grant -> WS downgrade to Starter -> all complementary licenses revoked | Paid Accelerator Bundle WS with Owner, Admin, and Trainer complementary clients. | 1. Downgrade WS plan to Starter. 2. Open each matching client in client app. 3. Open MS management page. | All complementary MS access is revoked. No complementary license remains visible or counted. | US1-AC1, US1-AC3, US1-AC2 |
| T0-005 | 0 | P0 | Admin->Trainer demotion preserves complementary access | Paid Pro WS. Admin has matching connected client with complementary MS. | 1. Change Admin role to Trainer. 2. Open matching client in client app. 3. Open client profile MS section. | Client keeps complementary MS access. No revocation event occurs. UI remains in correct complementary state. | SME correction, US1-AC1, US1-AC3 |
| T0-006 | 0 | P0 | Pre-release manual-unassigned state survives migration | Paid WS. Existing connected client matches active Owner email. The client had regular MS manually unassigned before release. | 1. Run migration job. 2. Open client app with the matching email. 3. Open MS management page. 4. Check migration email inbox. | Client remains without MS access from migration. No complementary license is auto-granted. No migration grant email is sent for this preserved unassigned state. | SME correction, US1-AC4 |
| T0-007 | 0 | P0 | Dual-license regular assignment -> add teammate -> manual unassign -> complementary access retained | Paid WS with active MS subscription. Connected client has regular MS assigned via MS management. Same email is added as teammate. | 1. Add the same email as teammate. 2. Open MS management page. 3. Unassign regular MS license. 4. Log in to client app. | Regular license is counted before unassign. After unassign, paid seat is freed and client still has MS access through complementary license. | US2-AC3, US1-AC2 |
| T0-008 | 0 | P0 | MS subscription cancellation hides client-profile license control after complementary state exists | Paid WS. Client has complementary MS. WS has active MS subscription. | 1. Open client profile MS section. 2. Cancel MS subscription. 3. Reload client profile MS section. | Button is disabled with tooltip before cancellation. Button is hidden after cancellation. | US2-AC3, US1-AC1 |
| T1-001 | 1 | P0 | Owner on paid Pro WS gets complementary MS on new connected client creation | Paid Pro WS. Active Owner. No existing client with Owner email. | 1. Create connected client using Owner email. 2. Log in to client app with the same email. | Client can access MacroSnap without paid license assignment. | US1-AC1 |
| T1-002 | 1 | P0 | Admin on paid Studio WS gets complementary MS on new connected client creation | Paid Studio WS. Active Admin. No existing client with Admin email. | 1. Create connected client using Admin email. 2. Log in to client app with the same email. | Client can access MacroSnap without paid license assignment. | US1-AC1 |
| T1-003 | 1 | P0 | Trainer on paid Accelerator Bundle WS gets complementary MS on new connected client creation | Paid Accelerator Bundle WS. Active Trainer. No existing client with Trainer email. | 1. Create connected client using Trainer email. 2. Log in to client app with the same email. | Client can access MacroSnap without paid license assignment. | SME correction, US1-AC1 |
| T1-004 | 1 | P0 | Complementary license is hidden from MS management list | Paid WS. Matching client has complementary MS. | 1. Open MS management page. 2. Review assigned client list. | Complementary client is not displayed in the MS management list. | US1-AC2 |
| T1-005 | 1 | P0 | Complementary license is excluded from subscription seat total | Paid WS with active MS subscription and 2 regular paid MS licenses. One matching client has complementary MS. | 1. Open subscription seat summary. 2. Compare paid license count with regular assigned clients. | Seat total equals regular paid licenses only. Complementary client does not increment the total. | US1-AC2 |
| T1-006 | 1 | P0 | Complementary license is not available in assignment dropdown | Paid WS. Matching client has complementary MS. Another non-matching client exists. | 1. Open license assignment dropdown. 2. Search for matching complementary client. | Complementary client is not listed as an assignable paid license target. | US1-AC2 |
| T1-007 | 1 | P0 | Coach removal revokes complementary MS | Paid WS. Active Owner has matching connected client with complementary MS. | 1. Remove Owner from teammates. 2. Log in to client app using matching email. | Client can no longer access MacroSnap. | US1-AC3 |
| T1-008 | 1 | P0 | WS downgrade to Starter revokes complementary MS | Paid WS. Matching connected client has complementary MS. | 1. Downgrade WS to Starter. 2. Log in to client app using matching email. | Client can no longer access MacroSnap. | US1-AC3 |
| T1-009 | 1 | P0 | Migration grants existing eligible non-WL connected client | Paid non-WL WS. Existing connected client email matches active Owner. | 1. Run migration job. 2. Log in to client app using matching email. | Client can access MacroSnap after migration. | US1-AC4 |
| T1-010 | 1 | P0 | Migration sends one-time email for eligible non-WL existing account | Paid non-WL WS. Existing connected client email matches active Admin. | 1. Run migration job. 2. Check coach email inbox. | One email is received with subject "You now have access to MacroSnap". | US1-AC4 |
| T1-011 | 1 | P1 | New post-deployment connected client does not receive migration email | Paid non-WL WS after deployment. Active Owner. | 1. Create connected client using Owner email. 2. Check coach email inbox. | Complementary access may be available through normal grant, but migration email is not sent. | US1-AC4 |
| T1-012 | 1 | P1 | Paid-plan MS page shows free-perk callout when no MS subscription exists | Paid Pro WS with no MS subscription. Coach logged in. | 1. Open MacroSnap page. 2. Observe area below "PURCHASE LICENSES FOR CLIENTS" CTA. | Free-perk callout appears with the specified message. | US2-AC1 |
| T1-013 | 1 | P1 | Free Trial MS page shows upgrade callout and link | Free Trial WS with no MS subscription. Coach logged in. | 1. Open MacroSnap page. 2. Click "Upgrade Everfit plan". | Upsell message appears. Click navigates to Choose my plan page. | US2-AC2 |
| T1-014 | 1 | P1 | Starter MS page shows upgrade callout and link | Starter WS with no MS subscription. Coach logged in. | 1. Open MacroSnap page. 2. Click "Upgrade Everfit plan". | Upsell message appears. Click navigates to Choose my plan page. | US2-AC2 |
| T1-015 | 1 | P0 | Client profile shows disabled Assigned state with tooltip for complementary client | Paid WS with active MS subscription. Client has complementary MS. | 1. Open client profile MS section. 2. Hover over Assigned button. | Button is disabled. Status shows Assigned. Tooltip displays specified free-perk message. | US2-AC3 |
| T1-016 | 1 | P0 | Client profile hides license button when MS subscription is cancelled | Paid WS with cancelled MS subscription. Client has complementary MS. | 1. Open client profile MS section. | Assign/Unassign license button is hidden. | US2-AC3 |
| T2-001 | 2 | P0 | Non-matching client email does not receive complementary MS | Paid WS. Active Owner email differs from connected client email. | 1. Create connected client with different email. 2. Log in to client app. | Client does not receive complementary MS access. | US1-AC1 |
| T2-002 | 2 | P0 | Trial WS does not grant complementary MS even when email matches | Free Trial WS. Active Owner. | 1. Create connected client using Owner email. 2. Log in to client app. | Client does not receive complementary MS access. | US1-AC1 |
| T2-003 | 2 | P0 | Starter WS does not grant complementary MS even when email matches | Starter WS. Active Admin. | 1. Create connected client using Admin email. 2. Log in to client app. | Client does not receive complementary MS access. | US1-AC1 |
| T2-004 | 2 | P1 | Archive does not revoke complementary MS | Paid WS. Matching client has complementary MS. | 1. Archive the client. 2. Log in to client app using matching email. | Complementary MS access remains active. | US1-AC3 QA-internal |
| T2-005 | 2 | P1 | Unarchive does not re-grant or duplicate complementary MS | Paid WS. Matching archived client already retained complementary MS. | 1. Unarchive the client. 2. Open MS management page. | Client keeps a single complementary access state. Seat count remains unchanged. | US1-AC3 QA-internal |
| T2-006 | 2 | P1 | WL migration suppresses email | Paid WL WS. Existing connected client email matches active coach role. | 1. Run migration job. 2. Check coach email inbox. | No migration email is sent. Grant eligibility remains dependent on OQ-03. | US1-AC4, OQ-03 |
| T2-007 | 2 | P1 | Migration retry does not duplicate email or grant | Paid non-WL WS. Existing eligible connected client already migrated once. | 1. Run migration job. 2. Run migration job again. 3. Check email inbox and MS management page. | Client has one complementary access state. Only one migration email is received. | US1-AC4 |
| T2-008 | 2 | P1 | Email case variation is handled according to BE decision | Paid WS. Coach email uses mixed case; client email uses lowercase same address. | 1. Create connected client with lowercase email. 2. Verify access result. | Result matches final BE decision for email case matching. | REQ_22 |
| T2-009 | 2 | P1 | Pending coach becomes active and triggers grant if BE confirms path | Paid WS. Pending coach email matches existing connected client. | 1. Activate the coach. 2. Log in to client app. | If BE confirms path, complementary MS is granted when coach becomes active. | R-14 |
| T2-010 | 2 | P1 | Pending client becomes connected and triggers grant if BE confirms path | Paid WS. Active Trainer email matches pending client. | 1. Accept/connect the pending client. 2. Log in to client app. | If BE confirms path, complementary MS is granted when client becomes connected. | R-15 |
| T2-011 | 2 | P1 | Add teammate without prior MS assignment triggers grant if BE confirms path | Paid WS. Connected client has no prior MS assignment and same email is added as teammate. | 1. Add the same email as teammate. 2. Log in to client app. | Expected result depends on OQ-04. | OQ-04 |
| T3-001 | 3 | P1 | Migration runs while WS plan changes from paid to Starter | Paid WS with eligible existing connected client. Migration job can be controlled in staging. | 1. Start migration job. 2. Downgrade WS to Starter during migration window. 3. Verify client app access. | Final state reflects Starter ineligibility. No complementary access remains. | US1-AC3, US1-AC4 |
| T3-002 | 3 | P1 | Coach removed while matching client is created | Paid WS. Active Admin email available for connected client creation. | 1. Start client creation with Admin email. 2. Remove Admin from WS before grant completes. 3. Verify client app access. | Final state uses post-removal eligibility. No complementary access is granted. | US1-AC1, US1-AC3 |
| T3-003 | 3 | P1 | MS subscription cancelled while client profile is open | Paid WS. Client has complementary MS. Client profile MS section is open. | 1. Cancel MS subscription in another session. 2. Refresh client profile. | License button is hidden after refresh. No stale enabled or disabled button remains. | US2-AC3 |
| T3-004 | 3 | P1 | Simultaneous regular assignment and complementary grant do not double-count | Paid WS with active MS subscription. Matching connected client is eligible for complementary MS. | 1. Trigger complementary grant. 2. Assign regular MS license to same client at the same time. 3. Open subscription seat count. | Seat count reflects only regular paid license. Complementary license does not add a second paid seat. | US1-AC2, US2-AC3 |

---

## Gate 4A Check

| Check | Status |
|---|---|
| Tier 0: 5-15 flows | PASS — 8 flows |
| Tier 0: every flow crosses US/module/state boundary | PASS |
| Tier 1: 15-30 scenarios | PASS — 16 scenarios |
| Tier 1: every US has at least 1 scenario | PASS |
| Tier 2/3: 10-25 scenarios | PASS — 15 scenarios |
| Total: 30-70 scenarios | PASS — 39 scenarios |
| Every Tier 1 has concrete preconditions | PASS |
| Expected results avoid vague "works correctly" language | PASS |

## Run Guide

| Run Scope | Recommended Use | Estimated Time |
|---|---|---|
| Tier 0 only | Build smoke / hotfix check | 30-45 min |
| Tier 0 + Tier 1 | Staging regression / release candidate | 2-3 hours |
| All tiers | Full feature regression or failed-fix retest | Full regression day |

## BDD Decision

BDD/Gherkin skipped. The request did not ask for automation, BDD, Gherkin, Playwright, or E2E automation, and the project folder has no `automation/` directory.
