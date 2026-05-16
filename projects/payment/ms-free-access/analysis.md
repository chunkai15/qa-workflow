# MacroSnap — Free Access for Coach's Own Client Account
# QA Pipeline Analysis — SESSION 1-2 OUTPUT

**Pipeline Mode:** MODE M (Complex; 7 ACs, 7 modules, HIGH-risk modules)
**Spec Version:** v2 (post-meeting, finalized)
**Created:** 2026-05-11

---

## SESSION STATUS
- [x] Layer 1 — Master Context ✅
- [x] Layer 2 — Module List + Risk Register ✅
- [x] Layer 3 — Deep Analysis Package (SESSION 2) ✅
- [x] Layer 4 — Regression Suite (SESSION 3) ✅
- [x] Layer 5 — Test Cases (SESSION 3) ✅

---

# ═══════════════════════════════
# [MASTER CONTEXT]
# ═══════════════════════════════

## Feature Purpose
MacroSnap Free Access for Coach's Own Client Account enables the **System** to automatically grant a complementary (non-billable) MacroSnap license to any client account whose email exactly matches an active coach role on the same paid Self-Serve workspace — Owner, Admin, or Trainer per SME correction — in order to eliminate billing friction for coaches who use their own email to create personal/test client accounts without consuming subscription seats.

---

## Business Flows

| Flow ID | Flow | Actor | Entry Point | Consequence if Fail |
|---|---|---|---|---|
| F1 | Auto-grant on new client creation | System | Coach creates client account with coach email on paid WS | Coach's own account requires paid MS license; trust damage |
| F2 | Retroactive migration grant | System (deployment job) | Deployment detects existing eligible connected clients | Eligible clients missed; email not sent; coaches unaware of free access |
| F3 | Revoke on coach removal from WS | System | Coach deleted from teammates list | License persists after coach removed; billing anomaly |
| F4 | Revoke on WS downgrade to Starter | System | WS plan downgraded | Complementary MS persists on non-paid WS |
| F5 | Dual-license reconciliation | Coach + System | Client assigned via MS management, then added as teammate with same email | Regular seat consumed indefinitely; billing leak until manual unassign |
| F6 | UI disabled state on client profile | FE / System | Coach views complementary client on WS with active MS subscription | Button stays enabled (regression); tooltip missing; confusing UX |
| F7 | UI awareness callout on MS page | System | Coach visits MS page | Coach unaware of free perk; missed upsell for free plan coaches |

---

## Actor Map

| Role | Goal | Entry Point | Permission Boundary |
|---|---|---|---|
| Coach (Owner) — paid WS | Use MS on own client account for free | Client creation, MS page | Complementary license auto-managed by system; cannot bypass eligibility rules |
| Coach (Admin) — paid WS | Same as Owner | Same | Same |
| Coach (Trainer) — paid WS | Same as Owner/Admin | Same | Same — Trainer is eligible per SME correction |
| Client account (matching email) | Access MS via client app without paid license | Everfit client app | Cannot self-manage license state |
| System (grant/revoke engine) | Auto-grant, revoke, migrate complementary licenses | Internal event hooks | Must not increment subscription seat count |
| Migration job | Retroactively grant MS to all eligible existing accounts | Deployment trigger | Must not send email to WL WS; must not double-send; must handle archived/pending states |

---

## Key Rules

| Rule ID | Rule | Confidence |
|---|---|---|
| R-01 | Client email must **exactly match** an active coach role email on the same WS: Owner, Admin, or Trainer | Confirmed by SME correction |
| R-02 | Eligible WS plans: Pro, Studio, Accelerator Bundle only | Confirmed |
| R-03 | Complementary license NOT counted in MS subscription seat count | Confirmed |
| R-04 | Complementary license NOT displayed in MS management page | Confirmed |
| R-05 | Complementary license NOT displayed in license assignment dropdown | Confirmed |
| R-06 | Revocation triggers: coach removed from WS **OR** WS downgraded to Starter. Archive is **NOT** a trigger. | Confirmed |
| R-07 | Retroactive grant on deployment for existing matching accounts. One-time email. Email NOT sent for WL WS. | Confirmed |
| R-08 | No email for new accounts created post-deployment | Confirmed |
| R-09 | Client profile UI: disabled button + tooltip when WS has active MS subscription | Confirmed |
| R-10 | Client profile UI: button hidden (not disabled) when MS subscription cancelled | Confirmed |
| R-11 | Dual-license case: client assigned via MS management first, then added as teammate → regular license IS counted. Coach must unassign; client retains complementary access. | Confirmed |
| R-12 | Owner, Admin, and Trainer qualify for complementary grant when other gates pass | Confirmed by SME correction |
| R-13 | [Inferred] Email comparison is case-insensitive | Provisional |
| R-14 | [Inferred] Coach pending→active triggers grant for already-connected matching clients | Provisional |
| R-15 | [Inferred] Client pending→connected triggers grant check | Provisional |
| R-16 | Coach role demotion Admin→Trainer does **not** trigger revocation because Trainer remains eligible | Confirmed by SME correction |
| R-17 | [Inferred] WS upgrade Starter→paid triggers retroactive re-grant | Provisional |
| R-18 | [Inferred] WL WS receives complementary grant but email is suppressed (grant eligibility independent of email channel) | Provisional — **NEEDS CONFIRMATION** |
| R-19 | [Inferred] Add teammate (no prior MS assignment) triggers complementary grant check | Provisional — **NEEDS CONFIRMATION** |
| R-20 | [Inferred] Pre-release manual assign: migration reconciles → complementary takes over; seat count unchanged | Provisional — **NEEDS CONFIRMATION** |
| R-21 | Pre-release manual un-assign: keep unassigned; migration must not auto-grant complementary for this state | Confirmed by SME correction |

---

## Data Flow

```
Client creation event
  └─> Email match check (client email ↔ eligible WS coach-role emails: Owner/Admin/Trainer)
        └─> WS plan eligibility check (Pro/Studio/Accel?)
              └─> Grant complementary MS license
                    ├─> NOT added to subscription seat count
                    ├─> NOT shown on MS management page
                    └─> NOT shown in assignment dropdown

Coach removal event / WS plan downgrade event
  └─> Revoke all complementary licenses matching that coach email on that WS
        └─> Client loses MS access in client app

Deployment migration job
  └─> Scan all WS on paid plans
        └─> Find all eligible coach-role emails (Owner/Admin/Trainer)
              └─> Find all connected client accounts with matching email
                    └─> Grant complementary MS
                          └─> If non-WL WS → send one-time email "You now have access to MacroSnap"
                          └─> If WL WS → grant but suppress email

MS management assign (pre-feature) + Add teammate (same email)
  └─> Regular license is counted to subscription
        └─> Coach must manually unassign
              └─> Client retains access via complementary (non-billable)
```

---

## Risk Identification

1. **Billing / Data Integrity:**
   - Seat count corruption if complementary license leaks into subscription count
   - Dual-license state (BR-13/R-11) may exist in prod data — regular seats consumed unnecessarily
   - Pre-release manual assign remains undefined; pre-release manual unassign is resolved as "keep unassigned"

2. **Business Logic Gaps:**
   - State transitions not confirmed: coach pending→active, client pending→connected, coach hard delete
   - WS upgrade direction (Starter→paid) has no AC for re-grant
   - Archived client state: archive no longer triggers revoke but must not accidentally fire

3. **Integration / Async:**
   - Migration job race condition (concurrent WS plan change)
   - Email deduplication if migration job retried
   - UI stale state if MS subscription cancelled while coach views client profile

---

## Resolved Assumptions

- A1: Archive/unarchive has zero impact on complementary license (removed from v2 spec)
- A2: Trainer role is eligible same as Owner/Admin when email and WS plan gates pass
- A3: Complementary license is independent of manual UI assign/unassign
- A4: Admin→Trainer demotion does not affect complementary access
- A5: Pre-release manual unassign must stay unassigned after migration
- A6: WL email suppression applies to grant notification only (not license grant itself) — provisional, needs confirmation

---

## Open Clarifications (Pre-TC Blockers)

| ID | Question | Blocks |
|---|---|---|
| OQ-01 | Pre-release manual assign: migration reconciliation behavior? Seat count impact? | Migration module TCs |
| OQ-02 | Pre-release manual un-assign: confirmed keep unassigned; migration must not auto-grant complementary | Resolved; regression assertion for migration module |
| OQ-03 | WL WS: receives complementary grant (just no email) OR fully excluded? | WL test scope |
| OQ-04 | Add teammate (non-dual-license case): triggers grant check? | Activation path TCs |

---

# ═══════════════════════════════
# [MODULE LIST]
# ═══════════════════════════════

**Strategy chosen: Hybrid** — Feature combines core billing state-machine logic (grant/revoke/migrate) + support functions (seat integrity, dual-license edge case) + report/notification surfaces (email, UI callout, client profile UI).

| Module_ID | Module Name | Type | Primary Responsibility | Linked Risk |
|---|---|---|---|---|
| MOD_CORE_01 | Complementary License Grant Engine | Core Function | Auto-grant on new client creation; all activation paths (invite, add teammate); state-triggered grants (coach pending→active, client pending→connected); eligible roles include Owner/Admin/Trainer | Wrong grant = coach billed for own account; missed grant = no free access |
| MOD_CORE_02 | Revocation & State Transition Guard | Core Function | Revoke on coach removal, WS downgrade; state machine enforcement for all coach/client/WS transitions; QA-internal: archive must NOT trigger revoke | License persists after revocation trigger; archive accidentally triggers revoke |
| MOD_CORE_03 | Migration / Backfill Job | Core Function | Retroactive grant on deployment; pre-release data reconciliation (manual assign vs manual unassign preserved); correct email targeting (non-WL only) | Migration misses eligible accounts; incorrectly re-grants manually unassigned accounts; corrupts seat count; emails wrong audience |
| MOD_SUP_01 | Seat Count & MS Management Page Integrity | Support Function | AC2: complementary license not counted in seat total; not shown in MS management page; not in assignment dropdown | Billing anomaly; management page confusion; assignment dropdown pollution |
| MOD_SUP_02 | Dual-license Reconciliation | Support Function | BR-13 edge case: client assigned via MS management + added as teammate → regular license counted; unassign → complementary takes over non-billably | Permanent seat consumption; coach unaware; billing leak |
| MOD_RPT_01 | Email Notification Logic | Report/Export | One-time retroactive email (non-WL only); no email for post-deployment new accounts; deduplication on migration retry; WL suppression | Wrong email audience; duplicate sends; WL receives email when they shouldn't |
| MOD_RPT_02 | UI Components | Report/Export | Client profile: disabled button + tooltip (active MS sub); hidden button (MS cancelled); MS page callout for paid coaches (US2 AC1); upsell callout for free coaches (US2 AC2) | UX regression: button stays enabled; tooltip missing; callout missing or wrong copy |

---

# ═══════════════════════════════
# [MODULE RISK REGISTER]
# ═══════════════════════════════

| Module_ID | Module | Risk Description | Likelihood | Impact | Overall | Test Focus |
|---|---|---|---|---|---|---|
| MOD_CORE_01 | Complementary License Grant Engine | Grant logic fails for one or more activation paths; email match case mismatch causes missed grant; Trainer role incorrectly excluded; WS plan gate bypassed | H | H | **HIGH** | Scenario TC + full EP + Decision Table (plan × role × state × email) + State Transition (all valid grant triggers) + Error Guessing (case mismatch, Trainer eligibility, pending coach) |
| MOD_CORE_02 | Revocation & State Transition Guard | Revoke doesn't fire on coach removal or WS downgrade; archive accidentally fires revoke (regression from v1); Admin→Trainer demotion incorrectly revokes access; WS upgrade not triggering re-grant | H | H | **HIGH** | Scenario TC + State Transition (all revoke/re-grant paths) + Decision Table (trigger × state) + Error Guessing (archive edge, role-change non-trigger, WS upgrade) |
| MOD_CORE_03 | Migration / Backfill Job | Pre-release manual assign not reconciled or manual unassign incorrectly re-granted; migration misses archived/pending clients; duplicate grants on retry; WL email sent incorrectly; concurrent plan change during migration | H | H | **HIGH** | Scenario TC + full pairwise matrix (coach plan × client role × client status × WL flag × pre-release license state) + Error Guessing (pre-release states, concurrent ops, retry) + Data Integrity checks |
| MOD_SUP_01 | Seat Count & MS Management Page Integrity | Complementary license counted in subscription seat total; appears in management page; appears in assignment dropdown | M | H | **HIGH** | Scenario TC + EP (complementary vs regular) + all 3 visibility surfaces + regression checks |
| MOD_SUP_02 | Dual-license Reconciliation | Regular license remains counted indefinitely (unassign not done); client loses MS access during transition; after unassign seat count not freed | M | H | **HIGH** | Scenario TC + State Transition (assign→teammate→unassign→complementary) + EP (with/without prior assignment) + Error Guessing (simultaneous assign) |
| MOD_RPT_01 | Email Notification Logic | Email sent to WL WS coaches; email sent for post-deployment new accounts; duplicate email on migration retry; email not sent for eligible non-WL accounts | M | M | **MEDIUM** | Scenario TC + EP (WL vs non-WL, pre vs post deployment) + BVA (deployment window edge) + deduplication check |
| MOD_RPT_02 | UI Components | Disabled button still enabled; tooltip missing or wrong copy; button not hidden when MS cancelled; callout missing for paid coach; upsell link broken; stale UI when MS cancelled mid-session | M | M | **MEDIUM** | Scenario TC + EP (active sub / no sub / cancelled sub) + UI state matrix + Error Guessing (stale state, mid-session cancel) |

---

# SESSION HANDOFF NOTES

## Confirmed Canonical Readings & Remaining Provisional Items
- R-13 to R-20 contain remaining inferred/open readings; R-16 and R-21 have been corrected by SME input
- OQ-01, OQ-03, and OQ-04 remain open; OQ-02 is resolved as "keep unassigned"

## Next: SESSION 4 — XLSX Generation

**Instructions for Session 4:**
1. Read this file (`analysis.md`)
2. Read `projects/payment/ms-free-access/test-cases.md`
3. Generate `ms-free-access-test-cases.xlsx`
4. Validate workbook structure and row count against `test-cases.md`

## Completed Module Processing Order for Layer 3
```
Round 1 (HIGH): MOD_CORE_01 → MOD_CORE_02 → MOD_CORE_03
Round 2 (HIGH): MOD_SUP_01 → MOD_SUP_02
Round 3 (MEDIUM): MOD_RPT_01 → MOD_RPT_02
```

---

# ═══════════════════════════════
# [DEEP ANALYSIS PACKAGE]
# ═══════════════════════════════

**Session:** SESSION 2 — Layer 3 Deep Analyzer  
**Created:** 2026-05-11  
**Canonical corrections applied before analysis:** Trainer is eligible same as Owner/Admin; Admin→Trainer demotion does not revoke; pre-release manual unassign remains unassigned and must not be auto-granted by migration.

## AC Type Classification Matrix

| AC | Structural Type | Risk | Design Supplement? | Est. Floor | Primary Modules |
|---|---|---|---|---|---|
| US1-AC1 | Conditional + state-creating | HIGH | No | ~14 | MOD_CORE_01, MOD_SUP_01 |
| US1-AC2 | Multi-effect visibility + billing | HIGH | No | ~12 | MOD_SUP_01, MOD_SUP_02 |
| US1-AC3 | Conditional revocation + state transition | HIGH | No | ~12 | MOD_CORE_02 |
| US1-AC4 | Migration + notification + timing | HIGH | No | ~18 | MOD_CORE_03, MOD_RPT_01 |
| US2-AC1 | Conditional UI callout | MEDIUM | No | ~6 | MOD_RPT_02 |
| US2-AC2 | Conditional UI + navigation | MEDIUM | No | ~7 | MOD_RPT_02 |
| US2-AC3 | Multi-effect UI + dual-license edge | HIGH | No | ~16 | MOD_RPT_02, MOD_SUP_02, MOD_SUP_01 |

## Deep Reading Blocks

### DR — US1-AC1 | Conditional + State-Creating | HIGH
Q1: verbs=[create, match, grant] | fields=[client email, coach role, WS plan, complementary license]
Q2: actor=Coach creates client | system=eligibility check + grant engine
Q3: explicit=[paid Self-Serve WS, exact email match, active coach role] | implicit=[Owner/Admin/Trainer eligible per SME, client becomes connected, no regular seat increment]
Q5: email=match→eligible / mismatch→no grant  
role=Owner/Admin/Trainer→eligible | removed/inactive→no grant  
plan=Pro/Studio/Accel→eligible | Trial/Starter→no grant  
license=complementary→hidden/non-billable
Q6: 1.complementary MS granted 2.client can access MS 3.seat count unchanged
Q7: NOT[grant for non-matching email] | NOT[count complementary as paid seat] | NOT[exclude Trainer]
Q4: sequence=Y; client creation must trigger grant after eligibility state exists
Q8: [FEEDS:US1-AC2] [REVERSED-BY:US1-AC3] [FEEDS:US2-AC3]
Q9: boundary=[exact/case email, role state, plan at creation time] | fail=[stale role cache, duplicate grant, async delay]
Q10: n/a
Q11: API/event=create connected client → grant; 403(ineligible role/plan) must not write complementary license; 409(existing license) idempotent
Floor: 14 (A=4/B=6/C=4)
Gate5: [ ] pending

### DR — US1-AC2 | Multi-effect Visibility + Billing | HIGH
Q1: verbs=[view, count, hide, exclude] | fields=[MS management count, subscription seat count, MS page list, assignment dropdown]
Q2: actor=Coach views MS management/subscription | system=license presentation + billing aggregation
Q3: explicit=[complementary license granted, coach purchased MS subscription] | implicit=[regular licenses still count, complementary license exists in backend but hidden]
Q5: seat_total=complementary→no increment | regular→increment  
MS_page=complementary→hidden | regular→visible  
dropdown=complementary→not listed | assignable regular seats→listed  
dual_license=regular+complementary→regular counted until manual unassign
Q6: 1.seat count unchanged 2.complementary hidden 3.assignment dropdown clean
Q7: NOT[display complementary as assignable] | NOT[double-count dual license] | NOT[hide regular paid license]
Q4: sequence=Y; reads license state after grant/migration/dual-license transition
Q8: [READS:US1-AC1] [READS:US1-AC4] [READS:US2-AC3]
Q9: boundary=[0 regular seats, 1 regular+1 complementary, many clients] | fail=[stale aggregate, cache mismatch]
Q10: n/a
Q11: API=license listing/subscription summary → complementary excluded from paid seat total; 500 must not show partial corrupt count
Floor: 12 (A=3/B=6/C=3)
Gate5: [ ] pending

### DR — US1-AC3 | Conditional Revocation + State Transition | HIGH
Q1: verbs=[revoke, downgrade, remove, preserve] | fields=[coach removal, WS downgrade, archive, Admin→Trainer]
Q2: actor=Coach/admin changes WS/team state | system=revocation handler
Q3: explicit=[coach revoked from WS OR WS downgraded to Starter] | implicit=[archive no impact, Admin→Trainer no impact because Trainer eligible]
Q5: coach_removed→revoke complementary  
WS_paid→Starter→revoke all complementary on WS  
archive/unarchive→no grant/revoke  
Admin→Trainer→no revoke  
hard_delete=confirm equivalent to removal
Q6: 1.access revoked on true triggers 2.access preserved on non-triggers 3.no orphaned license
Q7: NOT[revoke on archive] | NOT[revoke on Admin→Trainer] | NOT[persist license after removal/downgrade]
Q4: sequence=Y; revocation consumes existing complementary state
Q8: [REVERSES:US1-AC1] [REVERSES:US1-AC4] [AFFECTS:US2-AC3]
Q9: boundary=[plan changes during grant, coach removed during client creation] | fail=[stale role state, async revoke delay]
Q10: n/a
Q11: event=team removal/plan downgrade → revoke; 409(revoke already done) idempotent; 500 leaves auditable retry
Floor: 12 (A=4/B=5/C=3)
Gate5: [ ] pending

### DR — US1-AC4 | Migration + Notification + Timing | HIGH
Q1: verbs=[detect, grant, send, suppress, preserve] | fields=[existing connected client, active coach email, paid WS, WL flag, deployment timestamp, pre-release license state]
Q2: actor=System deployment job | system=migration/backfill + email sender
Q3: explicit=[existing connected clients, active coach email, paid WS] | implicit=[Owner/Admin/Trainer eligible, WL grant eligibility still open, manual-unassign preservation confirmed]
Q5: existing_connected+eligible→grant complementary  
new_after_deploy→grant path may apply but no email  
WL→no email; grant eligibility still OQ-03  
manual_assigned_pre_release→OQ-01 open  
manual_unassigned_pre_release→keep unassigned/no auto-grant  
retry→no duplicate grant/email
Q6: 1.eligible existing accounts granted 2.non-WL existing gets one email 3.WL email suppressed 4.manual-unassigned preserved
Q7: NOT[email for new post-deploy] | NOT[email WL] | NOT[auto-grant manual-unassigned pre-release state]
Q4: sequence=Y; deployment time separates migration email from normal grant
Q8: [FEEDS:US1-AC2] [FEEDS:US2-AC3] [CONFLICT:OQ-03] [OPEN:OQ-01]
Q9: boundary=[created during migration, job retry, plan changes during scan] | fail=[email send failure, partial batch]
Q10: n/a
Q11: job=batch scan→grant/email; 409(existing grant) idempotent; email failure retry deduped; 500 resumable
Floor: 18 (A=5/B=8/C=5)
Gate5: [ ] pending

### DR — US2-AC1 | Conditional UI Callout | MEDIUM — COMPACT
Q1: verbs=[show, view] fields=[paid plan, no MS subscription, CTA, callout copy]
Q2: actor=Coach | system=MS page UI
Q3: explicit=[paid Self-Serve WS, no MS subscription] implicit=[page loaded, coach authenticated]
Q5: plan=Pro/Studio/Accel→show perk | Trial/Starter→use AC2 | MS_sub=none→below CTA
Q6: 1.callout below CTA 2.copy exact 3.no upsell link
Q7: NOT[show free/trial upsell copy] | NOT[hide callout on paid no-sub WS]
Q4:seq=N Q8:[LOGICAL-INVERSION:US2-AC2] Q9:boundary=[plan switch, subscription absent] fail=[stale plan]
Floor: 6 (A=2/B=3/C=1)
Gate5: [ ] pending

### DR — US2-AC2 | Conditional UI + Navigation | MEDIUM — COMPACT
Q1: verbs=[show, display, click, navigate] fields=[Free Trial/Starter, upsell copy, Upgrade link, plan page]
Q2: actor=Coach | system=MS page UI + navigation
Q3: explicit=[Free Trial or Starter, no MS subscription] implicit=[plan page route exists]
Q5: plan=Trial/Starter→show upsell | paid→AC1 copy | link_click→Choose my plan page
Q6: 1.upsell message shown 2.link displayed 3.click navigates
Q7: NOT[show paid-perk copy] | NOT[missing Upgrade link]
Q4:seq=Y click after render Q8:[LOGICAL-INVERSION:US2-AC1] Q9:boundary=[Trial vs Starter] fail=[broken route]
Floor: 7 (A=3/B=3/C=1)
Gate5: [ ] pending

### DR — US2-AC3 | Multi-effect UI + Dual-License Edge | HIGH
Q1: verbs=[disable, show, hover, hide, unassign, retain] | fields=[assign/unassign button, assigned status, tooltip, MS subscription state, dual-license state]
Q2: actor=Coach views client MS page/profile | system=UI state + license reconciliation
Q3: explicit=[new connected client in paid WS, MS subscription purchased] | implicit=[client has complementary MS, regular license may coexist in dual-license edge]
Q5: MS_sub=active+complementary→button disabled/status Assigned/tooltip shown  
MS_cancelled→button hidden  
dual_license=regular counted→coach can unassign regular license  
after_unassign→client retains complementary access; seat freed  
manual_unassigned_pre_release→remain unassigned unless separately eligible via non-migration grant path
Q6: 1.disabled UI for complementary 2.hidden UI when cancelled 3.dual-license unassign frees paid seat 4.client access persists
Q7: NOT[enable assign/unassign for pure complementary] | NOT[show button after MS cancelled] | NOT[drop client MS after dual-license unassign]
Q4: sequence=Y; grant/subscription state determines UI; unassign transition affects seat count
Q8: [READS:US1-AC1] [READS:US1-AC2] [AFFECTS:MOD_SUP_02] [AFFECTS:MOD_RPT_02]
Q9: boundary=[subscription cancelled mid-session, simultaneous system grant + manual assign, stale UI cache] | fail=[tooltip absent, wrong count after unassign]
Q10: n/a
Q11: API=client license state → UI flags; unassign regular license → complementary remains; 409 concurrent update handled idempotently
Floor: 16 (A=5/B=7/C=4)
Gate5: [ ] pending

## Cross-AC/US Dependency Map

| Relationship | Source AC | Target AC | Type | Test Implication | CoveredBy |
|---|---|---|---|---|---|
| Complementary grant creates the state consumed by seat count rules | US1-AC1 | US1-AC2 | Data dependency | Create eligible client, then verify paid seat total/page/dropdown exclusion |  |
| Migration grant creates same license state as new-client grant | US1-AC4 | US1-AC2 | Reuse reference | Migration-created complementary license must be hidden/non-billable exactly like AC1 grant |  |
| Revocation removes access created by grant/migration | US1-AC1/AC4 | US1-AC3 | Logical inversion | Grant or migrate, then remove coach/downgrade and verify access revoked |  |
| Admin→Trainer role change is a non-trigger | US1-AC1 | US1-AC3 | Permission inheritance | Eligible Trainer state must preserve access after role change |  |
| Archive is a non-trigger despite earlier spec wording | US1-AC3 | US1-AC4 | Contradiction | Archive/unarchive should not revoke; migration archive inclusion still requires BE query decision |  |
| Deployment timestamp controls email behavior | US1-AC4 | US1-AC1 | Sequence constraint | Existing pre-deploy gets migration email; new post-deploy does not |  |
| WL flag changes email behavior but grant eligibility is still OQ-03 | US1-AC4 | MOD_RPT_01 | State dependency | Separate grant assertion from email suppression assertion |  |
| Complementary state controls client-profile UI | US1-AC1/AC4 | US2-AC3 | Data dependency | After grant/migration, verify disabled assigned button + tooltip |  |
| MS subscription state controls visibility | US2-AC3 | US2-AC1/AC2 | Shared entity | Active/cancelled/no-subscription variants must produce correct profile and MS page UI |  |
| Dual-license affects seat count and unassign behavior | US2-AC3 | US1-AC2 | Cross-flow impact | Regular license counted before unassign; after unassign seat freed and complementary access retained |  |
| Paid vs Starter/Trial plan drives both eligibility and callout | US1-AC1/AC3 | US2-AC1/AC2 | State dependency | Plan matrix must cover grant eligibility, revoke, and callout copy together |  |
| Pre-release manual unassign overrides migration auto-grant expectation | SME correction | US1-AC4 | State dependency | Seed manual-unassigned account and verify migration preserves unassigned state |  |

## Analysis Artifacts

### AC Capability Map

| Control/element | Trigger | Immediate result | Follow-up state | Disposition |
|---|---|---|---|---|
| MS page purchase CTA area | Paid WS, no MS subscription | Perk callout appears below CTA | Coach can discover own-account perk | covered |
| Upgrade Everfit plan link | Free Trial/Starter MS page | Link displayed | Click navigates to Choose my plan page | covered |
| Client profile Assign/Unassign button | Complementary client + active MS subscription | Button disabled; status Assigned; tooltip on hover | No manual toggle for pure complementary license | covered |
| Client profile Assign/Unassign button | MS subscription cancelled | Button hidden | No stale disabled control remains | covered |
| MS management unassign action | Dual-license client | Coach unassigns regular paid license | Client retains complementary MS; paid seat freed | covered |
| License assignment dropdown | Complementary license exists | Complementary slot not listed | Prevents manual assignment of shadow license | covered |

### Success Outcome Ledger

| Triggering action | Observable result | Target surface | Disposition |
|---|---|---|---|
| Eligible client created | Complementary MS granted; access available; seat count unchanged | Client app + subscription summary | covered |
| Migration detects eligible existing account | Complementary MS granted; one-time email sent for non-WL | License state + email | covered |
| Migration detects pre-release manual-unassigned account | Remains unassigned; no complementary auto-grant | License state | covered |
| Coach removed from WS | Complementary access revoked | Client app + license state | covered |
| WS downgraded to Starter | Complementary access revoked | Client app + license state | covered |
| Admin demoted to Trainer | Complementary access preserved | License state | covered |
| Dual-license regular unassign | Paid seat freed; complementary access retained | MS management + client app | covered |

### Requirement-to-Condition Matrix

| Direct assertion | Condition/branch | Observable outcome | Downstream effect | Disposition |
|---|---|---|---|---|
| Grant complementary MS | Email match + Owner/Admin/Trainer + paid WS | Complementary license created | UI disabled state + hidden from MS management | covered |
| Do not grant | Non-matching email or Trial/Starter | No complementary license | No free MS access | covered |
| Preserve manual unassign | Pre-release manual-unassigned state during migration | No complementary auto-grant | Prevents overriding coach's previous unassign choice | covered |
| Revoke complementary MS | Coach removed or WS downgraded | Access revoked | UI no longer shows complementary assigned state | covered |
| Preserve complementary MS | Archive/unarchive or Admin→Trainer | Access remains | Regression check for false revoke | covered |
| Send email | Existing eligible non-WL account at deployment | One email sent | Coach notified | covered |
| Suppress email | WL or new post-deploy account | No email sent | Avoid wrong notification audience | covered |
| Disable button | Active MS subscription + complementary client | Assigned button disabled with tooltip | No manual pure-complementary unassign | covered |
| Hide button | MS subscription cancelled | Button hidden | Avoid stale control | covered |

### Cross-Flow Impact Sweep

| Entity / State Change | Preserved | Blocked | Still Allowed | Downstream UI / Audit |
|---|---|---|---|---|
| Coach removed from WS | Non-related regular licenses | Complementary access for that coach email | Audit/retry of revoke event | Client loses MS access |
| WS paid → Starter | Workspace data; regular plan downgrade records | Complementary access on non-paid WS | Future re-grant if upgrade behavior confirmed | MS profile control should no longer imply active complementary access |
| Admin → Trainer | Complementary access | Revocation due solely to demotion | Normal Trainer coach workflows | No revoke event expected |
| Client archive/unarchive | Complementary access | Revoke/re-grant caused by archive | Normal archive UI behavior | QA-internal no state flip |
| Dual-license regular unassign | Complementary access | Paid seat consumption for own account | Client app MS access | Seat count decreases; client access remains |
| Pre-release manual unassign → migration | Manual unassigned state | Migration auto-grant | Future explicit user/system grant only if product defines it | No migration email/access for that state |

### Requirement Traceability Matrix

| Req_ID | Requirement Summary | Mapped Module(s) | Status |
|---|---|---|---|
| REQ_01 | Grant complementary MS to matching active coach-role client on paid Self-Serve WS | MOD_CORE_01 | Covered |
| REQ_02 | Treat Owner/Admin/Trainer as eligible coach roles per SME correction | MOD_CORE_01 | Covered |
| REQ_03 | Exclude Trial/Starter from grant eligibility | MOD_CORE_01 | Covered |
| REQ_04 | Do not count complementary license in MS subscription seat total | MOD_SUP_01 | Covered |
| REQ_05 | Hide complementary license from MS management page and assignment dropdown | MOD_SUP_01 | Covered |
| REQ_06 | Revoke on coach removal from WS | MOD_CORE_02 | Covered |
| REQ_07 | Revoke on WS downgrade to Starter | MOD_CORE_02 | Covered |
| REQ_08 | Do not revoke on archive/unarchive | MOD_CORE_02 | Covered |
| REQ_09 | Do not revoke on Admin→Trainer demotion | MOD_CORE_02 | Covered |
| REQ_10 | Migration grants eligible existing connected clients | MOD_CORE_03 | Covered |
| REQ_11 | Migration preserves pre-release manual-unassigned state | MOD_CORE_03 | Covered |
| REQ_12 | Pre-release manual-assigned reconciliation behavior | MOD_CORE_03, MOD_SUP_02 | Open: OQ-01 blocks final expected result |
| REQ_13 | Send one-time migration email for eligible existing non-WL accounts | MOD_RPT_01 | Covered |
| REQ_14 | Do not send email for WL or new post-deploy accounts | MOD_RPT_01 | Covered |
| REQ_15 | WL grant eligibility separate from WL email suppression | MOD_CORE_03, MOD_RPT_01 | Open: OQ-03 blocks final expected result |
| REQ_16 | Show paid-plan perk callout on MS page | MOD_RPT_02 | Covered |
| REQ_17 | Show Free/Trial upsell callout and upgrade link | MOD_RPT_02 | Covered |
| REQ_18 | Disable client-profile Assign/Unassign button with tooltip for complementary client and active MS subscription | MOD_RPT_02 | Covered |
| REQ_19 | Hide client-profile button when MS subscription is cancelled | MOD_RPT_02 | Covered |
| REQ_20 | Dual-license regular license counted until manual unassign; complementary access retained after unassign | MOD_SUP_02, MOD_SUP_01 | Covered |
| REQ_21 | Add teammate non-dual-license path triggers grant check | MOD_CORE_01 | Open: OQ-04 blocks final expected result |
| REQ_22 | Email case matching behavior | MOD_CORE_01 | Open: needs BE confirmation |
| REQ_23 | WS upgrade Starter→paid re-grant behavior | MOD_CORE_02, MOD_CORE_03 | Open: needs PM/BE confirmation |

**GAP ALERT:** Found 5 requirements with open expected results:
- REQ_12: Pre-release manual-assigned reconciliation behavior — OQ-01
- REQ_15: WL grant eligibility separate from WL email suppression — OQ-03
- REQ_21: Add teammate non-dual-license path grant check — OQ-04
- REQ_22: Email case matching behavior — BE confirmation needed
- REQ_23: WS upgrade Starter→paid re-grant behavior — PM/BE confirmation needed

## Gate 3 Checklist

| Check | Status |
|---|---|
| Every US has a DR block with appropriate Q depth | ✓ |
| Dependency Map scans cross-US/state/permission/timing relationships | ✓ |
| Every row has a Test Implication and empty CoveredBy for Phase 5 | ✓ |
| RTM maps every requirement to module or flags open expected result | ✓ |
| GAP ALERT printed for unresolved expected results | ✓ |

> **STOP — GATE 3:** Deep Analysis Package is ready for QA review. After approval, continue to Session 3 with `@qa-scenario-designer` for regression suite and BDD scenario design.
