# MacroSnap Free Access — Decision Tables & State Matrices

**Project:** payment/ms-free-access  
**Purpose:** Condition-first view of the test suite. Use this before execution to verify expected behavior by rule, state, and matrix instead of reading only step-by-step TCs.  
**Source:** `analysis.md`, `regression-suite.md`, `test-cases.md`  
**Canonical corrections:** Trainer is eligible same as Owner/Admin. Admin->Trainer does not revoke. Pre-release manual unassign must remain unassigned.

---

## 1. Grant Eligibility Decision Table

| Case | WS Plan | Coach Role / State | Client Email | Client State | Expected Complementary MS | Expected Email | Expected Billing / Visibility | Related TCs |
|---|---|---|---|---|---|---|---|---|
| GE-01 | Pro | Owner active | Exact match | New connected | Granted | No migration email | Not counted; hidden from MS page/dropdown | TC-US01-FUNC-001, TC-US01-SCEN-001 |
| GE-02 | Studio | Admin active | Exact match | New connected | Granted | No migration email | Not counted; hidden from MS page/dropdown | TC-US01-FUNC-002 |
| GE-03 | Accelerator Bundle | Trainer active | Exact match | New connected | Granted | No migration email | Not counted; hidden from MS page/dropdown | TC-US01-FUNC-003 |
| GE-04 | Pro / Studio / Accelerator | Owner/Admin/Trainer active | Not match | New connected | Not granted | No email | No complementary state | TC-US01-FUNC-004 |
| GE-05 | Free Trial | Owner/Admin/Trainer active | Exact match | New connected | Not granted | No email | No complementary state | TC-US01-FUNC-005 |
| GE-06 | Starter | Owner/Admin/Trainer active | Exact match | New connected | Not granted | No email | No complementary state | TC-US01-FUNC-006 |
| GE-07 | Pro / Studio / Accelerator | Pending coach -> active | Exact match | Existing connected | Open: grant only if BE confirms trigger | No migration email unless deployment case | Must follow final BE rule | TC-US01-EDGE-001 |
| GE-08 | Pro / Studio / Accelerator | Owner/Admin/Trainer active | Exact match | Pending -> connected | Open: grant only if BE confirms trigger | No migration email unless deployment case | Must follow final BE rule | TC-US01-EDGE-002 |
| GE-09 | Pro / Studio / Accelerator | Owner/Admin/Trainer active | Case variant | New connected | Open: follows final BE case-sensitivity rule | No migration email | Must follow final BE rule | TC-US01-EDGE-003 |

## 2. Revocation / Preservation Decision Table

| Case | Starting State | Trigger | Is Trigger Valid? | Expected MS Access | Expected Billing / Visibility | Related TCs |
|---|---|---|---|---|---|---|
| RV-01 | Complementary granted | Coach removed from WS | Yes | Revoked | No complementary visibility or paid seat impact | TC-US01-FUNC-007, TC-US01-SCEN-002 |
| RV-02 | Complementary granted | WS downgraded to Starter | Yes | Revoked | No complementary visibility or paid seat impact | TC-US01-FUNC-008 |
| RV-03 | Complementary granted | Admin -> Trainer | No | Preserved | Still non-billable; no revoke event | TC-US01-FUNC-009 |
| RV-04 | Complementary granted | Client archived | No | Preserved | Seat count unchanged; no duplicate state | TC-US01-EDGE-004 |
| RV-05 | Complementary preserved while archived | Client unarchived | No re-grant trigger | Preserved as single complementary state | Seat count unchanged; no duplicate state | TC-US01-EDGE-005 |
| RV-06 | Starter WS with matching existing client | Starter -> paid | Open | Follows final PM/BE decision | Must follow final lifecycle rule | TC-US01-EDGE-006 |
| RV-07 | Grant and removal happen concurrently | Coach removed before grant completes | Yes, final state should win | Not granted / revoked | No complementary visibility or paid seat impact | Regression T3-002 |

## 3. Migration / Backfill Matrix

| Case | WS Type | WS Plan At Migration | Client State Before Deploy | Coach Role | Pre-release MS State | Expected Complementary MS | Expected Email | Expected Seat Count / Visibility | Related TCs |
|---|---|---|---|---|---|---|---|---|---|
| MG-01 | Standard | Paid | Existing connected | Owner active | None | Granted | Sent once | Not counted; hidden | TC-US01-FUNC-010, TC-US01-SCEN-003 |
| MG-02 | Standard | Paid | Existing connected | Trainer active | None | Granted | Sent once | Not counted; hidden | TC-US01-FUNC-011 |
| MG-03 | Standard | Paid | Existing connected | Owner/Admin/Trainer active | Manually unassigned | Not granted by migration; preserve unassigned | Not sent | No complementary state from migration | TC-US01-FUNC-012 |
| MG-04 | Standard | Paid | Existing connected | Owner/Admin/Trainer active | Manually assigned regular MS | Open: OQ-01 | Open: depends on reconciliation | Must record seat impact after BE/PM decision | TC-US01-FUNC-013 |
| MG-05 | Standard | Paid | New post-deploy connected | Owner/Admin/Trainer active | None | Normal grant path may apply | Not sent | Not counted if complementary granted | TC-US01-FUNC-014 |
| MG-06 | Standard | Paid | Already migrated connected | Owner/Admin/Trainer active | Complementary already granted | No duplicate grant | No duplicate email | Single complementary state | TC-US01-EDGE-007 |
| MG-07 | Standard | Paid -> Starter during job | Existing connected | Owner/Admin/Trainer active | None | Final state should be not eligible | No duplicate email | No complementary state remains | TC-US01-EDGE-008 |
| MG-08 | WL | Paid | Existing connected | Owner/Admin/Trainer active | None | Open: OQ-03 grant scope | Not sent | If granted, still not counted/hidden | TC-US01-FUNC-020 |

## 4. Billing / MS Management Visibility Matrix

| Case | License State | MS Subscription State | MS Management Page | Assignment Dropdown | Subscription Seat Count | Expected Client Access | Related TCs |
|---|---|---|---|---|---|---|---|
| BL-01 | Complementary only | Active | Hidden | Hidden / not assignable | No increment | Access granted | TC-US01-FUNC-015, TC-US01-FUNC-016, TC-US01-FUNC-017 |
| BL-02 | Regular paid only | Active | Visible | Regular assignment behavior | Counted | Access granted | Baseline support check |
| BL-03 | Regular paid + complementary dual-license | Active | Regular paid license visible | Regular license manageable | Counted once as regular paid | Access granted | TC-US01-FUNC-018 |
| BL-04 | Dual-license after regular unassign | Active | Regular license removed; complementary hidden | Complementary not listed | Seat count decreases by 1 | Access preserved by complementary | TC-US02-SCEN-001, TC-US02-FUNC-002, TC-US02-FUNC-003 |
| BL-05 | Complementary + simultaneous regular assignment | Active | Regular license visible only once | Regular license manageable | Counted once as regular paid | Access granted | TC-US01-EDGE-009 |
| BL-06 | Complementary only | Cancelled | Button hidden on client profile | No paid assignment control | No active paid seat | Access state depends on backend but UI control hidden | TC-US02-UI-005, TC-US02-EDGE-002 |

## 5. Dual-License State Matrix

| Case | Start State | Action | Expected License State | Expected Seat Count | Expected Client App Access | Related TCs |
|---|---|---|---|---|---|---|
| DL-01 | Client has regular MS via MS management | Add same email as teammate | Regular license remains counted; complementary eligibility exists | Counted as regular paid | Access granted | TC-US02-FUNC-001 |
| DL-02 | Dual-license state | Coach unassigns regular MS | Complementary remains; regular removed | Seat count decreases by 1 | Access remains granted | TC-US02-SCEN-001, TC-US02-FUNC-002, TC-US02-FUNC-003 |
| DL-03 | Dual-license state | Client app refreshes during unassign | Complementary access remains available | Seat count eventually reflects unassign | Access remains granted after refresh | TC-US02-EDGE-001 |
| DL-04 | Grant and regular assignment happen simultaneously | Concurrent operations | No double-count; regular paid wins billing | Counted once as regular paid | Access granted | TC-US01-EDGE-009 |

## 6. Email Notification Decision Table

| Case | Account Timing | WS Type | Migration Result | Expected Email | Expected Deduplication | Related TCs |
|---|---|---|---|---|---|---|
| EM-01 | Existing before deploy | Standard non-WL | Granted | Sent once with subject "You now have access to MacroSnap" | One email max | TC-US01-FUNC-019, TC-US01-SCEN-005 |
| EM-02 | Existing before deploy | WL | OQ-03 for grant; email suppressed regardless | Not sent | No email | TC-US01-FUNC-020 |
| EM-03 | New after deploy | Standard non-WL | Normal grant path may apply | Not sent | No email | TC-US01-FUNC-021 |
| EM-04 | Existing before deploy | Standard non-WL | Job retry after prior success | No second email | One email max | TC-US01-SCEN-005 |
| EM-05 | Existing before deploy | Standard non-WL | First email send fails, retry later | Sent once after retry | One email max; one grant state | TC-US01-EDGE-010 |
| EM-06 | Existing before deploy | Standard non-WL | Pre-release manual-unassigned preserved | Not sent | No email | TC-US01-FUNC-012 |

## 7. UI State Matrix

| Case | WS Plan | MS Subscription | Client License State | Page / Surface | Expected UI | Related TCs |
|---|---|---|---|---|---|---|
| UI-01 | Paid | No MS subscription | Any | MS page | Free-perk callout below "PURCHASE LICENSES FOR CLIENTS" CTA | TC-US02-UI-001 |
| UI-02 | Free Trial | No MS subscription | Any | MS page | Upsell callout + "Upgrade Everfit plan" link | TC-US02-UI-002 |
| UI-03 | Starter | No MS subscription | Any | MS page | Upsell callout + "Upgrade Everfit plan" link | TC-US02-UI-003 |
| UI-04 | Paid | Active | Complementary only | Client profile MS section | Assigned status; button disabled; tooltip visible on hover | TC-US02-UI-004 |
| UI-05 | Paid | Cancelled | Complementary exists | Client profile MS section | Assign/Unassign button hidden | TC-US02-UI-005 |
| UI-06 | Paid | Cancelled mid-session | Complementary exists | Client profile MS section | After refresh, no stale enabled/disabled control remains | TC-US02-EDGE-002 |
| UI-07 | Paid | Active | Regular + complementary dual-license | MS management / client profile | Regular license can be unassigned; complementary access persists after unassign | TC-US02-SCEN-001 |

## 8. State Transition Table — Complementary MS License

| From State | Event / Trigger | To State | Valid? | Expected Result | Related TCs |
|---|---|---|---|---|---|
| Not granted | New connected client with matching Owner/Admin/Trainer on paid WS | Granted | Yes | Client gains MS access; license hidden/non-billable | TC-US01-SCEN-001 |
| Not granted | New connected client with non-matching email | Not granted | Yes | No complementary access | TC-US01-FUNC-004 |
| Not granted | New connected client on Free Trial/Starter | Not granted | Yes | No complementary access | TC-US01-FUNC-005, TC-US01-FUNC-006 |
| Not granted | Migration detects eligible existing connected client | Granted | Yes | Client gains MS access; non-WL email sent once | TC-US01-SCEN-003 |
| Not granted | Migration detects pre-release manual-unassigned client | Not granted | Yes | Preserve unassigned state | TC-US01-FUNC-012 |
| Granted | Coach removed from WS | Revoked | Yes | Client loses MS access | TC-US01-FUNC-007 |
| Granted | WS downgraded to Starter | Revoked | Yes | Client loses MS access | TC-US01-FUNC-008 |
| Granted | Admin -> Trainer | Granted | Yes | Access preserved | TC-US01-FUNC-009 |
| Granted | Client archived | Granted | Yes | Access preserved; no revoke | TC-US01-EDGE-004 |
| Granted | Client unarchived | Granted | Yes | No duplicate grant | TC-US01-EDGE-005 |
| Revoked | WS upgraded Starter -> paid | Open | Open | Follow final PM/BE rule | TC-US01-EDGE-006 |

## 9. State Transition Table — Pre-release / Dual-License

| From State | Event / Trigger | To State | Expected Billing | Expected Access | Related TCs |
|---|---|---|---|---|---|
| Manual assigned regular MS pre-release | Migration runs | Open: OQ-01 | Must follow BE/PM reconciliation rule | Must follow BE/PM reconciliation rule | TC-US01-FUNC-013 |
| Manual unassigned pre-release | Migration runs | Remain unassigned | No paid/complementary change from migration | No migration-granted access | TC-US01-FUNC-012 |
| Regular MS assigned | Same email added as teammate | Dual-license state | Regular seat counted | Access granted | TC-US02-FUNC-001 |
| Dual-license state | Regular MS unassigned | Complementary only | Seat count decreases by 1 | Access preserved | TC-US02-FUNC-002, TC-US02-FUNC-003 |
| Dual-license state | Concurrent refresh/unassign | Complementary only | Seat count eventually decreases by 1 | Access preserved | TC-US02-EDGE-001 |

## 10. Open Expected Results Register

| Open ID | Area | Current Test Handling | Required Decision Before Final Sign-off |
|---|---|---|---|
| OQ-01 | Pre-release manual assigned regular MS | TC exists with open expectation | Define whether migration converts, preserves regular, creates complementary shadow, or requires manual cleanup |
| OQ-03 | WL grant eligibility | Email suppression is testable; grant result is open | Confirm WL gets complementary grant with no email, or WL is fully excluded |
| OQ-04 | Add teammate without prior regular MS | Regression scenario exists with open expectation | Confirm whether add-teammate path fires grant check |
| REQ_22 | Email case matching | Boundary TC exists with open expectation | Confirm exact match is case-sensitive or normalized case-insensitive |
| REQ_23 | Starter -> paid re-grant | Lifecycle TC exists with open expectation | Confirm whether upgrade triggers retroactive grant |
