# MacroSnap Free Access — Detailed Test Cases

**Project:** payment/ms-free-access  
**Pipeline Session:** SESSION 3 — Layer 5  
**Source Inputs:** `analysis.md` + `regression-suite.md`  
**Language:** English  
**BDD:** Skipped; manual QA test suite only.

---

## Test Data Reference

| DataID | Category | Description | Key values | Setup order | Notes |
|---|---|---|---|---:|---|
| TD-001 | Workspace | Paid Pro standard WS with active MS subscription | WS `MS_FREE_PRO_01`; plan Pro; MS subscription active | 1 | Main grant/UI fixture |
| TD-002 | Workspace | Paid Studio non-WL WS with no MS subscription | WS `MS_FREE_STUDIO_01`; plan Studio; no MS subscription | 1 | Used for MS page paid callout |
| TD-003 | Workspace | Paid Accelerator Bundle WS | WS `MS_FREE_ACCEL_01`; plan Accelerator Bundle | 1 | Role coverage fixture |
| TD-004 | Workspace | Starter WS | WS `MS_FREE_STARTER_01`; plan Starter | 1 | Ineligible plan fixture |
| TD-005 | Workspace | Free Trial WS | WS `MS_FREE_TRIAL_01`; plan Free Trial | 1 | Ineligible plan + upsell fixture |
| TD-006 | Workspace | Paid White Label WS | WS `MS_FREE_WL_01`; plan Pro; WL enabled | 1 | Email suppression and OQ-03 fixture |
| TD-007 | User | Eligible Owner coach and matching client email | `coach_owner_ms@testfitness.com` | 2 | Owner positive path |
| TD-008 | User | Eligible Admin coach and matching client email | `coach_admin_ms@testfitness.com` | 2 | Admin positive path |
| TD-009 | User | Eligible Trainer coach and matching client email | `coach_trainer_ms@testfitness.com` | 2 | SME correction positive path |
| TD-010 | User | Non-matching connected client email | `client_nonmatch_ms@testfitness.com` | 2 | Negative email-match path |
| TD-011 | State | Existing migrated connected client | connected client email matches active coach before deployment | 3 | Migration grant fixture |
| TD-012 | State | Pre-release manual assigned client | matching connected client has regular MS manually assigned pre-release | 3 | OQ-01 expected result open |
| TD-013 | State | Pre-release manual unassigned client | matching connected client had regular MS manually unassigned pre-release | 3 | SME says preserve unassigned |
| TD-014 | State | Dual-license client | regular MS assigned first, then same email added as teammate | 3 | Billing reconciliation fixture |
| TD-015 | Boundary | Mixed-case email pair | coach `Coach.Mixed@TestFitness.com`; client `coach.mixed@testfitness.com` | 2 | REQ_22 open expected result |

---

## MOD_CORE_01 — Complementary License Grant Engine

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-001 | US1-AC1,US1-AC2,US2-AC3 | Verify eligible client creation grants complementary MS and keeps billing/UI state correct | Paid Pro WS exists. Owner coach is active. MS subscription is active. No client exists with Owner email. | 1. Log in as Owner coach.<br>2. Create a connected client using the Owner email.<br>3. Log in to the client app with the same email.<br>4. Open MS management page as coach.<br>5. Open the client profile MS section. | TD-001 + TD-007 | Client can access MacroSnap. MS seat count is unchanged. Complementary client is hidden from MS management. Client profile shows Assigned with disabled control and tooltip. | High | [MOD_CORE_01] SCEN \| E2E \| Grant + billing + UI |
| TC-US01-FUNC-001 | US1-AC1 | Verify Owner coach on paid Pro WS receives complementary MS for matching connected client | Paid Pro WS exists. Owner coach is active. | 1. Log in as Owner coach.<br>2. Create a connected client using the Owner email.<br>3. Log in to the client app with the same email. | TD-001 + TD-007 | Client can access MacroSnap without a paid license assignment. | High | [MOD_CORE_01] FUNC \| Pos \| Owner |
| TC-US01-FUNC-002 | US1-AC1 | Verify Admin coach on paid Studio WS receives complementary MS for matching connected client | Paid Studio WS exists. Admin coach is active. | 1. Log in as Admin coach.<br>2. Create a connected client using the Admin email.<br>3. Log in to the client app with the same email. | TD-002 + TD-008 | Client can access MacroSnap without a paid license assignment. | High | [MOD_CORE_01] FUNC \| Pos \| Admin |
| TC-US01-FUNC-003 | US1-AC1,BR-14 | Verify Trainer coach receives complementary MS same as Owner and Admin | Paid Accelerator Bundle WS exists. Trainer coach is active. | 1. Log in as Trainer coach.<br>2. Create a connected client using the Trainer email.<br>3. Log in to the client app with the same email. | TD-003 + TD-009 | Client can access MacroSnap without a paid license assignment. Trainer is not excluded. | High | [MOD_CORE_01] FUNC \| Pos \| SME correction |
| TC-US01-FUNC-004 | US1-AC1 | Verify non-matching connected client does not receive complementary MS | Paid Pro WS exists. Owner coach is active. Client email does not match any eligible coach email. | 1. Log in as Owner coach.<br>2. Create a connected client using the non-matching email.<br>3. Log in to the client app with the non-matching email. | TD-001 + TD-010 | Client cannot access MacroSnap unless a regular paid license is assigned. | High | [MOD_CORE_01] FUNC \| Neg \| Email mismatch |
| TC-US01-FUNC-005 | US1-AC1 | Verify Free Trial WS does not grant complementary MS for matching email | Free Trial WS exists. Owner coach is active. | 1. Log in as Owner coach.<br>2. Create a connected client using the Owner email.<br>3. Log in to the client app with the same email. | TD-005 + `trial_owner_ms@testfitness.com` | Client does not receive complementary MacroSnap access. | High | [MOD_CORE_01] FUNC \| Neg \| Plan gate |
| TC-US01-FUNC-006 | US1-AC1 | Verify Starter WS does not grant complementary MS for matching email | Starter WS exists. Admin coach is active. | 1. Log in as Admin coach.<br>2. Create a connected client using the Admin email.<br>3. Log in to the client app with the same email. | TD-004 + `starter_admin_ms@testfitness.com` | Client does not receive complementary MacroSnap access. | High | [MOD_CORE_01] FUNC \| Neg \| Plan gate |
| TC-US01-EDGE-001 | R-14 | Check that pending coach becoming active grants MS only if BE confirms this trigger | Paid Pro WS exists. Pending coach email matches an already connected client. | 1. Activate the pending coach.<br>2. Log in to the client app using the matching email.<br>3. Open license state in admin tooling. | `pending_coach_ms@testfitness.com` | Expected result follows BE decision. If confirmed, complementary MS is granted after activation. | Medium | [MOD_CORE_01] EDGE \| Open \| R-14 |
| TC-US01-EDGE-002 | R-15 | Check that pending client becoming connected grants MS only if BE confirms this trigger | Paid Pro WS exists. Active Trainer email matches a pending client. | 1. Connect the pending client.<br>2. Log in to the client app using the matching email.<br>3. Open license state in admin tooling. | TD-001 + TD-009 | Expected result follows BE decision. If confirmed, complementary MS is granted after client connection. | Medium | [MOD_CORE_01] EDGE \| Open \| R-15 |
| TC-US01-EDGE-003 | REQ_22 | Check that mixed-case email matching follows final BE rule | Paid Pro WS exists. Coach email uses mixed case. Client email uses lowercase version of same address. | 1. Log in as mixed-case coach.<br>2. Create connected client using lowercase email.<br>3. Log in to client app with lowercase email. | TD-015 | Result matches final BE rule for email case matching. | Medium | [MOD_CORE_01] EDGE \| Open \| Email boundary |

## MOD_CORE_02 — Revocation & State Transition Guard

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-002 | US1-AC1,US1-AC3,US2-AC3 | Verify grant followed by coach removal revokes client access and UI state | Paid Pro WS exists. Trainer has matching connected client with complementary MS. | 1. Log in as workspace Owner.<br>2. Remove the Trainer from teammates.<br>3. Log in to client app using Trainer email.<br>4. Open the client profile MS section as Owner. | TD-001 + TD-009 | Client cannot access MacroSnap. Complementary assigned UI state is removed. | High | [MOD_CORE_02] SCEN \| E2E \| Revoke on removal |
| TC-US01-FUNC-007 | US1-AC3 | Verify coach removal from teammates revokes complementary MS | Paid WS exists. Owner has matching connected client with complementary MS. | 1. Remove Owner coach from teammates.<br>2. Log in to client app using Owner email. | TD-001 + TD-007 | MacroSnap access is revoked for the matching client account. | High | [MOD_CORE_02] FUNC \| Pos \| Removal trigger |
| TC-US01-FUNC-008 | US1-AC3 | Verify WS downgrade to Starter revokes complementary MS | Paid WS exists. Matching connected client has complementary MS. | 1. Downgrade WS plan to Starter.<br>2. Log in to client app using matching email. | TD-001 + TD-008 | MacroSnap access is revoked after downgrade. | High | [MOD_CORE_02] FUNC \| Pos \| Downgrade trigger |
| TC-US01-FUNC-009 | BR-16 | Verify Admin to Trainer role change does not revoke complementary MS | Paid WS exists. Admin has matching connected client with complementary MS. | 1. Change Admin role to Trainer.<br>2. Log in to client app using the same email.<br>3. Open license state in admin tooling. | TD-001 + TD-008 | Client keeps MacroSnap access. No revocation event is created solely for Admin to Trainer change. | High | [MOD_CORE_02] FUNC \| Pos \| SME correction |
| TC-US01-EDGE-004 | QA-internal | Verify archiving a complementary client does not revoke MS access | Paid WS exists. Matching connected client has complementary MS. | 1. Archive the client.<br>2. Log in to client app using matching email.<br>3. Open license state in admin tooling. | TD-001 + TD-007 | Complementary MS access remains active. Seat count remains unchanged. | Medium | [MOD_CORE_02] EDGE \| QA-internal \| Archive non-trigger |
| TC-US01-EDGE-005 | QA-internal | Verify unarchiving does not duplicate or re-grant complementary MS | Paid WS exists. Archived client retained complementary MS. | 1. Unarchive the client.<br>2. Open MS management page.<br>3. Open license state in admin tooling. | TD-001 + TD-007 | Client has a single complementary access state. Seat count remains unchanged. | Medium | [MOD_CORE_02] EDGE \| QA-internal \| Unarchive non-trigger |
| TC-US01-EDGE-006 | REQ_23 | Check that Starter to paid upgrade behavior follows final PM/BE rule | Starter WS exists. Matching connected client already exists. | 1. Upgrade WS from Starter to Pro.<br>2. Log in to client app using matching email.<br>3. Open license state in admin tooling. | TD-004 + `upgrade_owner_ms@testfitness.com` | Expected result follows final PM/BE decision for retroactive re-grant after upgrade. | Medium | [MOD_CORE_02] EDGE \| Open \| WS upgrade |

## MOD_CORE_03 — Migration / Backfill Job

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-003 | US1-AC4,US1-AC2,US2-AC3 | Verify migration grants eligible existing client and keeps management/UI state correct | Paid non-WL WS exists. Existing connected client email matches active Owner. MS subscription is active. | 1. Run migration job.<br>2. Log in to client app using matching email.<br>3. Open MS management page.<br>4. Open client profile MS section. | TD-001 + TD-011 | Client receives complementary MS access. Seat count is unchanged. Client is hidden from MS management. Client profile shows disabled Assigned state. | High | [MOD_CORE_03] SCEN \| E2E \| Migration grant |
| TC-US01-FUNC-010 | US1-AC4 | Verify migration grants existing eligible Owner connected client | Paid non-WL WS exists. Existing connected client email matches active Owner before deployment. | 1. Run migration job.<br>2. Log in to client app using Owner email. | TD-002 + TD-011 | Client can access MacroSnap after migration. | High | [MOD_CORE_03] FUNC \| Pos \| Owner migration |
| TC-US01-FUNC-011 | US1-AC4,BR-14 | Verify migration grants existing eligible Trainer connected client | Paid non-WL WS exists. Existing connected client email matches active Trainer before deployment. | 1. Run migration job.<br>2. Log in to client app using Trainer email. | TD-003 + TD-009 | Client can access MacroSnap after migration. Trainer is included as eligible. | High | [MOD_CORE_03] FUNC \| Pos \| Trainer migration |
| TC-US01-FUNC-012 | R-21 | Verify migration preserves pre-release manual-unassigned client state | Paid WS exists. Matching connected client had regular MS manually unassigned before release. | 1. Run migration job.<br>2. Log in to client app using matching email.<br>3. Open license state in admin tooling. | TD-013 | Client remains without migration-granted complementary MS. No grant email is sent for this preserved state. | High | [MOD_CORE_03] FUNC \| Pos \| SME correction |
| TC-US01-FUNC-013 | R-20,OQ-01 | Check that pre-release manual-assigned client follows final reconciliation rule | Paid WS exists. Matching connected client has regular MS manually assigned before release. | 1. Run migration job.<br>2. Open MS management page.<br>3. Open subscription seat count.<br>4. Log in to client app. | TD-012 | Expected result follows final BE/PM decision for OQ-01. Seat count impact must be recorded. | High | [MOD_CORE_03] FUNC \| Open \| OQ-01 |
| TC-US01-FUNC-014 | US1-AC4 | Verify new post-deployment connected client does not receive migration email | Paid non-WL WS exists after deployment. Active Admin email has no existing client before deployment. | 1. Create connected client using Admin email.<br>2. Log in to client app using Admin email.<br>3. Check Admin email inbox. | TD-002 + TD-008 | Migration email is not sent for the new post-deployment account. | High | [MOD_CORE_03] FUNC \| Neg \| Deployment window |
| TC-US01-EDGE-007 | US1-AC4 | Verify migration retry does not duplicate grant or email | Paid non-WL WS exists. Existing eligible connected client has already been migrated once. | 1. Run migration job.<br>2. Run migration job again.<br>3. Check email inbox.<br>4. Open license state in admin tooling. | TD-011 | One complementary access state exists. Only one migration email is received. | Medium | [MOD_CORE_03] EDGE \| Retry \| Idempotency |
| TC-US01-EDGE-008 | US1-AC4,US1-AC3 | Verify migration final state is safe when WS downgrades during migration | Paid WS exists. Existing eligible connected client is included in migration scan. | 1. Start migration job.<br>2. Downgrade WS to Starter during migration window.<br>3. Log in to client app using matching email.<br>4. Open license state in admin tooling. | TD-001 + TD-011 | Final state reflects Starter ineligibility. Complementary access is absent after downgrade handling completes. | Medium | [MOD_CORE_03] EDGE \| Race \| Plan change |

## MOD_SUP_01 — Seat Count & MS Management Page Integrity

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-004 | US1-AC1,US1-AC2 | Verify complementary grant never changes paid MS seat count | Paid WS has active MS subscription and 2 regular paid MS clients. Matching Owner client has no MS before grant. | 1. Record current MS seat count.<br>2. Create connected client using Owner email.<br>3. Open subscription seat summary.<br>4. Open MS management page. | TD-001 + TD-007 | Seat count remains equal to the 2 regular paid clients. Complementary client is not listed. | High | [MOD_SUP_01] SCEN \| E2E \| Seat count |
| TC-US01-FUNC-015 | US1-AC2 | Verify complementary license is not counted in subscription seat total | Paid WS has active MS subscription. Matching client has complementary MS. | 1. Open subscription seat summary.<br>2. Compare displayed paid seat count with regular paid clients. | TD-001 + TD-007 | Displayed seat count excludes the complementary client. | High | [MOD_SUP_01] FUNC \| Pos \| Seat aggregation |
| TC-US01-FUNC-016 | US1-AC2 | Verify complementary license is not displayed on MS management page | Paid WS has active MS subscription. Matching client has complementary MS. | 1. Open MS management page.<br>2. Search for the matching client name or email. | TD-001 + TD-008 | Matching complementary client is not displayed in the paid MS management list. | High | [MOD_SUP_01] FUNC \| Pos \| Visibility |
| TC-US01-FUNC-017 | US1-AC2 | Verify complementary client is not displayed in assignment dropdown | Paid WS has active MS subscription. Matching client has complementary MS. Another non-matching client exists. | 1. Open license assignment dropdown.<br>2. Search for matching complementary client email. | TD-001 + TD-007 | Complementary client is not listed as a paid license assignment option. | High | [MOD_SUP_01] FUNC \| Pos \| Dropdown exclusion |
| TC-US01-FUNC-018 | US1-AC2,US2-AC3 | Verify regular paid license remains counted in dual-license state until unassigned | Paid WS has active MS subscription. Client was assigned regular MS before being added as teammate with same email. | 1. Open MS management page.<br>2. Open subscription seat summary.<br>3. Locate the regular paid license for that client. | TD-014 | Regular license is counted as a paid seat until coach manually unassigns it. | High | [MOD_SUP_01] FUNC \| Pos \| Dual-license |
| TC-US01-EDGE-009 | US1-AC2 | Verify simultaneous regular assignment and complementary grant does not double-count paid seats | Paid WS has active MS subscription. Matching connected client is eligible for complementary MS. | 1. Trigger complementary grant.<br>2. Assign regular MS license to the same client in a second session.<br>3. Open subscription seat summary. | TD-001 + TD-007 | Seat count reflects only the regular paid license. Complementary state does not add a second paid seat. | Medium | [MOD_SUP_01] EDGE \| Race \| Double-count guard |

## MOD_SUP_02 — Dual-License Reconciliation

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US02-SCEN-001 | US2-AC3,US1-AC2 | Verify dual-license unassign frees paid seat while client keeps MS access | Paid WS has active MS subscription. Client has regular MS assigned via MS management and is added as teammate with same email. | 1. Open subscription seat summary.<br>2. Unassign regular MS license from the client.<br>3. Log in to client app using same email.<br>4. Open subscription seat summary again. | TD-014 | Seat count decreases after unassign. Client still has MacroSnap access through complementary license. | High | [MOD_SUP_02] SCEN \| E2E \| Dual-license |
| TC-US02-FUNC-001 | US2-AC3 | Verify regular license is counted when client is assigned through MS management before teammate add | Paid WS has active MS subscription. Connected client has regular MS assigned before teammate add. | 1. Add same email as teammate.<br>2. Open subscription seat summary. | TD-014 | Regular license remains counted for MS subscription. | High | [MOD_SUP_02] FUNC \| Pos \| Before unassign |
| TC-US02-FUNC-002 | US2-AC3 | Verify client keeps MacroSnap access after regular license unassign in dual-license state | Dual-license state exists. | 1. Unassign regular MS license from MS management.<br>2. Log in to client app using same email. | TD-014 | Client can still access MacroSnap in the client app. | High | [MOD_SUP_02] FUNC \| Pos \| After unassign |
| TC-US02-FUNC-003 | US2-AC3 | Verify paid seat is freed after regular license unassign in dual-license state | Dual-license state exists. Current paid seat count is recorded. | 1. Unassign regular MS license from the client.<br>2. Open subscription seat summary. | TD-014 | Paid seat count decreases by 1. Complementary access is not counted. | High | [MOD_SUP_02] FUNC \| Pos \| Seat freed |
| TC-US02-EDGE-001 | US2-AC3 | Verify concurrent regular unassign and complementary state refresh does not drop client access | Dual-license state exists. Client app session is active. | 1. Open client app as matching client.<br>2. Unassign regular MS license in coach web app.<br>3. Refresh client app MacroSnap page. | TD-014 | Client remains able to access MacroSnap after refresh. | Medium | [MOD_SUP_02] EDGE \| Race \| Access continuity |

## MOD_RPT_01 — Email Notification Logic

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-SCEN-005 | US1-AC4 | Verify migration email is sent once for existing eligible non-WL account | Paid non-WL WS exists. Existing connected client email matches active Owner before deployment. | 1. Run migration job.<br>2. Check Owner email inbox.<br>3. Run migration job again.<br>4. Check Owner email inbox again. | TD-002 + TD-011 | Exactly one email is received with subject "You now have access to MacroSnap". | High | [MOD_RPT_01] SCEN \| E2E \| Email dedupe |
| TC-US01-FUNC-019 | US1-AC4 | Verify non-WL existing eligible account receives grant email | Paid non-WL WS exists. Existing connected client email matches active Admin. | 1. Run migration job.<br>2. Check Admin email inbox. | TD-002 + TD-008 | Email is received with subject "You now have access to MacroSnap". | High | [MOD_RPT_01] FUNC \| Pos \| Non-WL |
| TC-US01-FUNC-020 | US1-AC4,BR-10 | Verify WL workspace suppresses migration email | Paid WL WS exists. Existing connected client email matches active coach role. | 1. Run migration job.<br>2. Check coach email inbox. | TD-006 + TD-009 | No migration grant email is sent. | High | [MOD_RPT_01] FUNC \| Neg \| WL suppression |
| TC-US01-FUNC-021 | US1-AC4 | Verify new post-deployment account does not receive migration email | Paid non-WL WS exists after deployment. No pre-existing connected client for Owner email. | 1. Create connected client using Owner email.<br>2. Check Owner email inbox. | TD-002 + `post_deploy_owner_ms@testfitness.com` | No migration grant email is sent for this new account. | High | [MOD_RPT_01] FUNC \| Neg \| Post-deploy |
| TC-US01-EDGE-010 | US1-AC4 | Check that email send failure can be retried without duplicate grant | Paid non-WL WS exists. Email test tool can simulate first-send failure. | 1. Configure email tool to fail first send.<br>2. Run migration job.<br>3. Restore email tool.<br>4. Retry failed email operation. | TD-002 + TD-011 | Complementary grant remains single. Email is sent once after retry. | Medium | [MOD_RPT_01] EDGE \| Retry \| Email failure |

## MOD_RPT_02 — UI Components

| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US02-SCEN-002 | US2-AC1,US2-AC2,US2-AC3 | Verify MS UI surfaces show correct state across paid, free, and complementary contexts | Paid WS with no MS subscription exists. Free Trial WS exists. Paid WS with active MS subscription and complementary client exists. | 1. Open MS page on paid WS without MS subscription.<br>2. Open MS page on Free Trial WS.<br>3. Open complementary client profile on paid WS with active MS subscription. | TD-001 + TD-002 + TD-005 + TD-007 | Paid WS shows free-perk callout. Free Trial WS shows upgrade callout and link. Complementary client profile shows disabled Assigned state with tooltip. | High | [MOD_RPT_02] SCEN \| E2E \| UI surfaces |
| TC-US02-UI-001 | US2-AC1 | Verify paid-plan callout appears below purchase CTA | Paid Pro WS has no MS subscription. Coach is logged in. | 1. Open MacroSnap page.<br>2. Locate "PURCHASE LICENSES FOR CLIENTS" CTA.<br>3. Review content below the CTA. | TD-002 | Callout appears below CTA with text: "MacroSnap is free on your own client account. Log in to the Everfit client app with your coach email to try it!" | Medium | [MOD_RPT_02] UI \| Pos \| Paid callout |
| TC-US02-UI-002 | US2-AC2 | Verify Free Trial upsell callout and upgrade link | Free Trial WS has no MS subscription. Coach is logged in. | 1. Open MacroSnap page.<br>2. Review content below CTA.<br>3. Click "Upgrade Everfit plan". | TD-005 | Upsell text appears. Click navigates to Choose my plan page. | Medium | [MOD_RPT_02] UI \| Pos \| Free Trial |
| TC-US02-UI-003 | US2-AC2 | Verify Starter upsell callout and upgrade link | Starter WS has no MS subscription. Coach is logged in. | 1. Open MacroSnap page.<br>2. Review content below CTA.<br>3. Click "Upgrade Everfit plan". | TD-004 | Upsell text appears. Click navigates to Choose my plan page. | Medium | [MOD_RPT_02] UI \| Pos \| Starter |
| TC-US02-UI-004 | US2-AC3 | Verify complementary client profile button is disabled with tooltip when MS subscription is active | Paid WS has active MS subscription. Matching client has complementary MS. | 1. Open client profile MS section.<br>2. Hover over Assigned button. | TD-001 + TD-007 | Button is disabled. Status shows Assigned. Tooltip displays the specified free-perk message. | High | [MOD_RPT_02] UI \| Pos \| Disabled button |
| TC-US02-UI-005 | US2-AC3 | Verify client profile button is hidden when MS subscription is cancelled | Paid WS has cancelled MS subscription. Matching client has complementary MS. | 1. Open client profile MS section. | TD-001 + TD-007 | Assign/Unassign license button is hidden. | High | [MOD_RPT_02] UI \| Pos \| Cancelled subscription |
| TC-US02-EDGE-002 | US2-AC3 | Verify client profile does not show stale button after MS subscription cancellation mid-session | Paid WS has active MS subscription. Matching client has complementary MS. Coach has client profile open. | 1. Cancel MS subscription in another browser session.<br>2. Refresh the client profile page.<br>3. Open MS section. | TD-001 + TD-007 | Button is hidden after refresh. No enabled or disabled stale license control remains visible. | Medium | [MOD_RPT_02] EDGE \| Stale UI \| Mid-session cancel |

---

## Coverage Summary

| Area | Count |
|---|---:|
| Total TCs | 48 |
| SCEN | 7 |
| FUNC | 24 |
| UI | 5 |
| EDGE | 12 |
| High priority | 33 |
| Medium priority | 15 |
| Low priority | 0 |

## Module Summary

| Module | TC Count | Risk | Notes |
|---|---:|---|---|
| MOD_CORE_01 — Complementary License Grant Engine | 10 | HIGH | Owner/Admin/Trainer, plan gates, email boundary/open transitions |
| MOD_CORE_02 — Revocation & State Transition Guard | 7 | HIGH | Removal, downgrade, archive non-trigger, Admin->Trainer non-trigger |
| MOD_CORE_03 — Migration / Backfill Job | 8 | HIGH | Existing grant, manual assigned open item, manual unassign preservation, retry/race |
| MOD_SUP_01 — Seat Count & MS Management Page Integrity | 6 | HIGH | Seat count, hidden management page state, dropdown exclusion, double-count guard |
| MOD_SUP_02 — Dual-License Reconciliation | 5 | HIGH | Regular counted before unassign; access retained and seat freed after unassign |
| MOD_RPT_01 — Email Notification Logic | 5 | MEDIUM | Non-WL email, WL suppression, post-deploy suppression, retry |
| MOD_RPT_02 — UI Components | 7 | MEDIUM | MS page callouts, disabled tooltip, hidden cancelled state |

## Clarification-Dependent Cases

| Open Item | Related TCs | Handling |
|---|---|---|
| OQ-01: Pre-release manual assigned reconciliation | TC-US01-FUNC-013 | Written as open-expected-result TC; update after BE/PM decision |
| OQ-03: WL grant eligibility | TC-US01-FUNC-020 plus migration grant scenarios | Email suppression is testable now; grant eligibility needs final scope |
| OQ-04: Add teammate non-dual-license grant check | Regression T2-011 | Keep as open until BE confirms trigger |
| REQ_22: Email case matching | TC-US01-EDGE-003 | Expected result follows final BE rule |
| REQ_23: Starter->paid re-grant | TC-US01-EDGE-006 | Expected result follows final PM/BE rule |

## Gate 5 Summary

| AC / Area | Status | Notes |
|---|---|---|
| US1-AC1 | Conditional PASS | Covered eligible roles, ineligible plans, non-matching email, open state triggers |
| US1-AC2 | PASS | Covered seat count, MS management visibility, assignment dropdown, dual-license count |
| US1-AC3 | PASS | Covered removal, downgrade, archive non-trigger, Admin->Trainer non-trigger |
| US1-AC4 | Conditional PASS | Covered migration grant/email/manual-unassign/retry; manual-assigned and WL grant remain open |
| US2-AC1 | PASS | Covered paid-plan callout |
| US2-AC2 | PASS | Covered Free Trial and Starter upsell callouts and navigation |
| US2-AC3 | PASS | Covered disabled button, tooltip, hidden cancelled state, dual-license unassign |

## Automation Candidates

| Candidate | Suggested TC IDs |
|---|---|
| P0 grant + billing smoke | TC-US01-SCEN-001, TC-US01-FUNC-001, TC-US01-FUNC-004 |
| Revocation state machine | TC-US01-SCEN-002, TC-US01-FUNC-007, TC-US01-FUNC-008, TC-US01-FUNC-009 |
| Migration smoke | TC-US01-SCEN-003, TC-US01-FUNC-010, TC-US01-FUNC-012, TC-US01-EDGE-007 |
| Dual-license billing | TC-US02-SCEN-001, TC-US02-FUNC-002, TC-US02-FUNC-003 |
| UI smoke | TC-US02-SCEN-002, TC-US02-UI-004, TC-US02-UI-005 |
