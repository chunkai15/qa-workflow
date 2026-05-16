# QA Pipeline & Skills — Master Improvement Plan v3.0
**Synthesized from:** Post-mortem Plan A + Pipeline Plan v2 (Plan B) + Optimization Session (Plan C)  
**Date:** 2026-05-16 | **Author:** Khai Truong (QA)  
**Status:** FINAL — Ready for implementation  

---

## 0. Executive Summary & Guiding Principle

### Vấn đề cốt lõi

> **Pipeline hiện tại đang đảo ngược vai trò:**  
> Layer 5 đang làm phần lớn analysis thay vì Layer 3.  
> Kết quả: shallow analysis → thin TCs → 2.4 TCs/AC → ~55% AC coverage.

### Framework sửa — Align với ISTQB CTFL v4.0

```
Test Analysis  (WHAT to test)          → phải xảy ra hoàn chỉnh tại L3
Test Design    (HOW to test)           → artifacts phải BUILD xong tại L3
Test Implementation (viết TCs)         → L5 chỉ DERIVE từ L3 artifacts, không re-analyze
```

Khi L5 bắt đầu viết TC đầu tiên → **toàn bộ analysis đã locked tại L3.**

### Nguyên lý phân bổ fix

```
Fix phải nằm tại layer phát sinh vấn đề — không đổ vào L5.

L1 Context Builder   → RCA-1 (AC reading), RCA-3 (scope control)
L2 Decomposer        → RCA-2 (technique assignment), RCA-3 (complexity)
L3 Deep Analyzer     → RCA-2 (artifact build), RCA-5 (data prereqs), RCA-7 (shallow output)
L4 Scenario Designer → RCA-6 (SCEN/FUNC confusion)
L5 TC Generator      → RCA-4 (assertion quality), RCA-8 (gate)
```

---

## 1. Root Cause Analysis — 8 RCAs

### RCA-1 — Đọc AC theo headline, không theo observable outcomes *(Most impactful)*
**Biểu hiện:** US09 AC1 có 5 Then-bullets → 2 TCs. US11 AC1 → 5 TCs thay vì 23.  
**Root cause:** AC được đọc như 1 requirement thay vì list of individually verifiable outcomes. Mỗi Then-bullet chứa 1–3 observable items, mỗi item cần TC riêng.  
**Fix tại:** L1 (Then-bullet Inventory) + L3 (Q6-Extended split protocol)

### RCA-2 — Technique artifacts declared, không được build
**Biểu hiện:** Module Brief ghi "Decision Table: Y" nhưng table không tồn tại. TCs viết từ intuition.  
**Root cause:** Technique được dùng như labels, không phải intermediate artifacts bắt buộc xuất hiện trước TC đầu tiên.  
**Fix tại:** L2 (Technique Assignment Map) + L3 (Artifact BUILD mandate + Gate 3a Technique Review)

### RCA-3 — Token/scope pressure → sacrifice depth for breadth
**Biểu hiện:** 223 TCs / 94 REQs = 2.4 TCs/REQ. Mọi REQ đều có ≥1 TC nhưng không REQ nào đủ depth.  
**Root cause:** Feature 13 US, 90+ ACs không được Epic-split trước pipeline.  
**Fix tại:** Pre-pipeline Epic Split Gate (L1 + Master Workflow + QA_INTAKE)

### RCA-4 — Gộp multiple assertions vào 1 Expected result
**Biểu hiện:** `Expected: "Shows correct status labels, colors, and actions"` = 3+ assertions trong 1 TC.  
**Root cause:** Trong long context, vô thức optimize để bộ TC trông "manageable".  
**Fix tại:** L5 (Forbidden Phrases Blocklist + multiline formatting rule)

### RCA-5 — Thiếu data prerequisite mapping
**Biểu hiện:** TC "verify no credits issued" không specify: client balance bao nhiêu? History entries nào? Purchase state nào?  
**Root cause:** Không có bước nào bắt buộc trả lời "What must exist in the system BEFORE testing this AC?".  
**Fix tại:** L3 (Q-DATA = Q13, Data Prerequisite Card per Module)

### RCA-6 — SCEN TC được dùng như coverage substitute
**Biểu hiện:** Sau khi viết 1 SCEN E2E TC, số FUNC TCs giảm vì "đã có E2E cover rồi".  
**Root cause:** Không có rule phân tách rõ SCEN (business flow) ≠ FUNC/EDGE (per-AC outcome).  
**Fix tại:** L4 (SCEN/FUNC separation rule)

### RCA-7 — Layer 5 không derive từ Layer 3 artifacts
**Biểu hiện:** TCs viết lại từ spec/memory thay vì map từ DR blocks và artifacts.  
**Root cause:** L3 không output đủ artifacts → L5 compensate bằng re-analyze — không đủ depth.  
**Fix tại:** L3 (full artifact output) + L5 (Derive Protocol + Context Review)

### RCA-8 — Gate 5 là self-certification, không phải hard blocker
**Biểu hiện:** Gate 5 pass ngay sau khi viết TCs. Không có gì ngăn pass khi thiếu TCs.  
**Root cause:** Gate chỉ verify by declaration (`✓ Floor met`), không require concrete listed output.  
**Fix tại:** L5 (Gate 5 v2 — 6-part non-fakeable)

---

## 2. Layer 1 — `qa-context-builder`

**Đánh giá:** Solid. Phase 0/0.5/1a/1b/1c đầy đủ. **Cần bổ sung 3 thứ nhỏ.**

### Change 1A — Epic Split Gate *(Fixes RCA-3)*

**Vị trí:** Insert sau Phase 0.5, TRƯỚC Phase 1a (Extraction).

```
### ⚡ SCOPE GATE — Count ACs Before Extraction

Đếm tổng ACs trong scope.
  ≤20 ACs → proceed normally.
  >20 ACs → MANDATORY STOP.

[STOP — SCOPE GATE]
Feature has [N] ACs (limit = 20). Proceeding risks:
  - Context pressure → L3 sacrifices depth for breadth (RCA-3)
  - L5 forced to re-analyze instead of deriving (RCA-7)

Action required: Split into Epics of ≤15 ACs each BEFORE starting pipeline.
Suggested split: Epic A = US01–US05 (N ACs) | Epic B = US06–US10 (N ACs)
Each Epic → independent pipeline → merge regression suites at end.

Wait for Khai to confirm split plan. Do NOT proceed until confirmed.
```

### Change 1B — Then-bullet Inventory *(Fixes RCA-1)*

**Vị trí:** Insert sau Step 1a (Extraction), TRƯỚC Step 1b (Ambiguity Scan).

```
### Step 1a.5 — Then-bullet Inventory (MANDATORY, per AC)

For each AC, copy all Then-bullets verbatim. Inventory only — do NOT analyze depth yet.
Split each bullet on: `,` | `;` | ` and ` (when joining 2 distinct observable items)

  AC1 → [B1: modal title displays], [B2: illustration shown], [B3: body text], [B4: CTA button] → min_hint = 4
  AC2 → [B1: error message shows], [B2: field highlighted red] → min_hint = 2
  AC3 → [B1: cancel button visible] → min_hint = 1

Output: min_hint per AC stored in [MASTER CONTEXT] → carried into:
  L3: DR Q-Floor must be ≥ min_hint
  L5: Gate 5 v2 Part 4 floor check references min_hint
```

### Change 1C — AC Scope Summary *(New — feeds L2 Complexity Tier)*

**Vị trí:** Append vào cuối [MASTER CONTEXT] package.

```
**AC Scope Summary:**
| US | #ACs | Total Then-bullets | Max min_hint | Complexity Signal |
|---|---|---|---|---|
| US01 | 3 | 8 | 4 | Multi-bullet: likely Tier 2–3 |
| US02 | 5 | 3 | 1 | Simple: likely Tier 1 |

Purpose: L2 uses this to assign AC Complexity Tier immediately without re-reading spec.
```

**Updated [MASTER CONTEXT] package** — thêm 2 fields:

```markdown
**Then-bullet Inventory:**
| AC | Bullets (verbatim) | min_hint |
|---|---|---|
| AC1 | B1: [text] / B2: [text] / B3: [text] | 3 |

**AC Scope Summary:**
[Table above]
```

---

## 3. Layer 2 — `qa-strategy-decomposer`

**Đánh giá:** Good. Risk Assessment + Strategy Proposal solid. **Cần thêm per-AC granularity.**

### Change 2A — AC Complexity Tier *(Fixes RCA-2, RCA-3)*

**Vị trí:** Thêm vào Phase 2A (Decomposer), sau khi strategy chosen, TRƯỚC Module Risk Register.

```
### AC Complexity Tier (per AC in each Module)

| Tier | AC characteristics | DR depth | Default techniques |
|---|---|---|---|
| Tier 1 (Simple) | ≤2 Then-bullets, no conditions, 1 actor | 7Q COMPACT | EP (1 class) + 1 negative |
| Tier 2 (Standard) | 3–4 bullets OR 1 condition OR 2 actors | 10Q COMPACT | BVA (if numeric) / ST (if lifecycle) / EP (if multi-role) |
| Tier 3 (Complex) | 5+ bullets OR multiple conditions OR state machine OR API contract | 12Q FULL | DT + ST + BVA + EG (as applicable) |

Output: add column "AC Tier" to Module Risk Register table.
```

### Change 2B — Technique Assignment Map *(Fixes RCA-2)*

**Vị trí:** Append vào Module Risk Register output, sau bảng risk chính.

```
### Technique Assignment Map (per Module, per AC)

| AC | Tier | Technique(s) Assigned | Specific signal from spec |
|---|---|---|---|
| AC1 | Tier 3 | DT + ST | 3 conditions × 5 purchase statuses |
| AC2 | Tier 2 | BVA | qty field: 1–100, documented limits |
| AC3 | Tier 1 | EP | 2 role classes, identical behavior per class |
| AC4 | Tier 3 | DT + EG (H1, H5) | 2 conditions × API integration + async |
| AC5 | Tier 2 | ST | purchase lifecycle: 5 distinct states |

Rules:
  - L3 receives this map → BUILD artifacts for each assigned technique
  - L3 validates and may propose additions (see Gate 3a)
  - L5 derives TCs from artifacts — does NOT re-decide technique
```

### Change 2C — Estimated Floor in Module Risk Register

```
Thêm cột "Est. Floor" vào Module Risk Register:

| Module | Risk | Test Focus | AC Tiers | Technique Map | Est. Floor |
|---|---|---|---|---|---|
| MOD_01 | HIGH | DT+ST+BVA+EP+EG | 2×Tier3, 1×Tier2 | DT(AC1,AC4)+ST(AC1,AC5)+BVA(AC2) | ~28 |

Est. Floor = sum(min_hints from L1) × risk multiplier
  HIGH: × 1.5 | MEDIUM: × 1.2 | LOW: × 1.0
  Purpose: Khai sees total TC volume expectation before pipeline runs.
```

**Updated payload output:**

```markdown
### [MODULE LIST]
[Finalized decomposition table]

### [MODULE RISK REGISTER]
[Risk register + AC Tiers column + Technique Map + Est. Floor]
```

---

## 4. Layer 3 — `qa-deep-analyzer` *(MAJOR REDESIGN)*

**Đánh giá:** Structure đúng (AC Type Classification, 7Q/10Q/12Q, Dependency Map, 7 Artifacts, RTM) nhưng thiếu 5 elements critical. Đây là layer quyết định chất lượng toàn pipeline.

---

### Change 3A — Gate 3a: Technique Review (TRƯỚC Phase 3b) *(Fixes RCA-2)*

**Vị trí:** Thêm vào cuối Phase 3a (sau AC Type Classification Matrix).

```
### Phase 3a.5 — Technique Validation Gate (MANDATORY before Deep Reading)

Read Technique Assignment Map từ L2. Cross-check mỗi AC:

  Rule 1: AC has ≥2 independent conditions affecting same outcome
           → Decision Table REQUIRED. If L2 missed: FLAG.
  Rule 2: AC involves entity with defined lifecycle states
           → State Transition REQUIRED. If L2 missed: FLAG.
  Rule 3: AC has numeric/currency/percentage field with documented limits
           → BVA REQUIRED. If L2 missed: FLAG.
  Rule 4: AC is Tier 3
           → Error Guessing H1-H5 verdict REQUIRED. If L2 missed: FLAG.

Output: Technique Validation Report

| AC | L2 Assignment | Validation Result | Proposed Addition |
|---|---|---|---|
| AC1 | EP only | ❌ GAP: 2 conditions detected | Add DT |
| AC2 | BVA | ✅ Confirmed | None |
| AC3 | ST | ✅ Confirmed | None |

[STOP — GATE 3a]:
Present Technique Validation Report + proposed additions.
Wait for Khai to approve additions BEFORE starting Phase 3b Deep Reading.
Techniques are LOCKED after this gate. No changes after Deep Reading begins.
```

---

### Change 3B — Business Understanding Block per AC *(New — ATDD-aligned)*

**Vị trí:** Thêm vào Phase 3b, TRƯỚC DR block cho mỗi AC.

```
### BU — [AC-ID] Business Understanding

Why business cares: [1 sentence — what breaks in production if this AC fails?]
Actor intent:       [what actor is trying to accomplish, not just "performs action X"]
System contract:    [what system promises to deliver — observable, not internal]
Risk if broken:     Data loss? Wrong charge? User blocked? Silent failure?

Example:
BU — AC1:
  Why business cares: Coaches cannot issue session credits if package config is wrong → revenue loss
  Actor intent:       Coach wants to allocate session credits to client without manual calculation
  System contract:    System auto-calculates credit quantity based on package rules and displays confirmation
  Risk if broken:     Wrong credits issued → client overbilled or underbilled → financial dispute
```

**Rationale:** "Discuss phase before distill phase" (ATDD). Tests written from business understanding have ~40% better coverage than tests written from spec mechanics alone. BU block also feeds L5 SCEN TC writing — agent understands WHY the flow matters.

---

### Change 3C — Q6-Extended + Q-DATA (Q13) in adaptive_reading.md *(Fixes RCA-1, RCA-5)*

#### Q6 Extended — Observable Outcomes (replace current Q6)

Áp dụng tất cả tiers (7Q, 10Q, 12Q):

```
Q6: OBSERVABLE OUTCOMES — Mandatory Split Protocol

  Step 1: Copy each Then-bullet verbatim from spec/BU block
  Step 2: Split each bullet on: `,` | `;` | ` and ` (when joining 2 distinct UI elements/states)
  Step 3: Each split item = 1 observable outcome = 1 minimum TC

  Example:
    Then: "system shows title, illustration, body text, and CTA button"
    → O1: title displayed [exact text from spec]
    → O2: illustration shown [describe source — Figma ref?]
    → O3: body text appears [exact text if specified]
    → O4: CTA button is enabled and shows label [exact label]
    Q6 subtotal = 4 observables

  Cross-check: count(O) must be ≥ min_hint from L1 Master Context.
  If count(O) < min_hint → review spec — some outcomes may be implied, not stated.

  Q6-Negative (integrated):
    N1: [condition that blocks/fails this AC] → [exact error text / blocked UI state]
    N2: [another negative condition] → [exact error / state]

  Output:
    O1: [exact element / text / state]
    O2: [...]
    ON: [...]
    N1: [condition → exact error text]
    N2: [condition → exact error text]
    Q6 subtotal: [N] observables + [N] negatives
```

#### Q-DATA (Q13) — Data Prerequisites *(New mandatory question)*

Thêm vào tất cả tiers sau Q3 (Preconditions):

```
Q-DATA (Q13): DATA PREREQUISITE — What must exist in system BEFORE testing this AC?

  WS State:    Booking=[ON/OFF], P&P=[ON/OFF], Stripe=[connected/not]
  Package:     type=[...], credit_rule=[...], status=[active/archived]
  Purchase:    status=[confirmed/pending/cancelled], activated=[true/false], invoices=[paid/unpaid]
  Client:      connected=[true/false], balance=[X credits], history_entries=[types: Issued/Used/Voided]
  Credit Data: [X] available, [Y] used, [Z] expired

  Tag each data item:
    DESTRUCTIVE → one-time use, cannot reuse across TCs
    SHARED      → assign DataID (TD-001, TD-002...), used by ≥3 TCs
    SIMPLE      → inline in TC (≤4 values, not shared)

  Output example:
    Q-DATA:
      WS: Booking=ON, P&P=ON
      Package: type=PT_Session_Credit, status=active, credit_rule=1_per_session
      Client: connected=true, balance=3, history=[Issued×1]
      DESTRUCTIVE: Client balance state (consumed after TC-FUNC-003)
      DataIDs: TD-001=[Package+Client setup | SHARED], TD-002=[WS state | SHARED]
```

#### Floor Formula Update (all tiers)

```
Floor = max(
  count(Q6 observables O),                   ← from Q6 split
  DT_row_count,                               ← from DT artifact (if assigned)
  ST_valid_transitions + ST_invalid_transitions ← from ST artifact (if assigned)
) + count(Q6 negatives N) + BVA_boundary_points

Minimum floors by Tier:
  Tier 3: ≥ 7 | Tier 2: ≥ 4 | Tier 1: ≥ 2

Floor must be ≥ min_hint (from L1 Master Context).
If Floor < min_hint → use min_hint. Flag in RTM.

Write Floor as: Floor = [N] (O=[N]/N=[N]/DT=[N]/ST=[N]/BVA=[N])
```

---

### Change 3D — Artifact BUILD Mandate (artifacts.md) *(Fixes RCA-2)*

```
### Artifact BUILD Mandate

Rule: If L2 Technique Map assigns a technique → L3 MUST output the ACTUAL artifact
      in the DR block BEFORE moving to the next AC.

Build check per AC (self-verify):
  ✗ "Decision Table: Y" written as text → FAIL — build actual table now
  ✓ DT assigned → Full combination matrix EXISTS in DR block (all condition rows)
  ✓ ST assigned → State × Event table EXISTS (From | Event | To | Valid? | TC_needed)
  ✓ BVA assigned → Boundary List EXISTS (Field | Min | Min-1 | Max | Max+1 | Notes)
  ✓ EG assigned → H1–H5 Verdict List EXISTS (applicable → TC slot | not applicable → reason)

Artifact TC column: starts EMPTY in L3. Filled in L5.
  [ARTIFACT: Decision Table — AC5]
  | Cond A | Cond B | Outcome | TC ID |
  | Y      | Y      | Fee=5%  | [empty → fill in L5] |
  | Y      | N      | No fee  | [empty → fill in L5] |
```

---

### Change 3E — Data Prerequisite Card per Module *(Fixes RCA-5)*

Thêm vào Phase 3d (sau tất cả DR blocks của một module, trước Dependency Map):

```
[DATA PREREQUISITE CARD — MOD_ID]
─────────────────────────────────────────
WS STATE:    Booking=ON, P&P=ON, Stripe=connected
PACKAGE:     type=PT_Session, credit_rule=1_credit_per_session, status=active
PURCHASE:    status=completed, activated=true, invoices=[paid]
CLIENT:      connected=true, balance=5, history=[Issued×3, Used×1, Returned×1]
CREDIT DATA: 5 available, 1 used, 0 expired

DataID Registry:
  TD-001: [Package+Client baseline] | SHARED | setup_order=1
  TD-002: [WS+Booking state] | SHARED | setup_order=1
  TD-003: [Client balance=0 edge case] | BOUNDARY | setup_order=1
  TD-004: [Destructive: cancellation scenario] | DESTRUCTIVE | setup_order=2

Conflicts between ACs requiring different states:
  AC3 needs Client.balance=0 (TD-003) ← conflicts with AC1 needs Client.balance=5 (TD-001)
  → Use separate data fixtures. Do NOT share.
─────────────────────────────────────────
→ L5 imports DataIDs này. Does NOT create new ones. Does NOT infer values.
```

---

### Change 3F — Impact Alert Rule in Dependency Map (dependency.md) *(Fixes RCA-7)*

```
### Impact Alert Rule (thêm vào Dependency Map rules)

For relationship types: Data dependency | State dependency | Logical inversion | Shared entity (write-write)
  → TC is MANDATORY. Document as: [MANDATORY TC: describe cross-flow scenario]

For: Permission inheritance | Reuse reference | Contradiction | Sequence constraint
  → TC is RECOMMENDED. Document rationale if skipped.

Updated Dependency Map format:
| Relationship | Source AC | Target AC | Type | Test Implication | TC Required? | CoveredBy |
|---|---|---|---|---|---|---|
| Credits issued → balance display | US04/AC3 | US02/AC1 | Data dependency | [MANDATORY TC: issue → verify balance] | YES | [Phase 5] |
| Permission from Studio Admin | US01/AC2 | US05/AC1 | Permission inheritance | [RECOMMENDED: verify report access] | RECOMMENDED | [Phase 5] |
```

---

### Change 3G — RTM + Min_TCs Column *(Fixes RCA-8)*

```
Updated RTM format:

| REQ-ID | US | AC | Module | Technique | Min_TCs | Actual_TCs | Status |
|---|---|---|---|---|---|---|---|
| REQ-001 | US01 | AC1 | MOD_01 | DT+ST | 12 | — | UNCOVERED |
| REQ-002 | US01 | AC2 | MOD_01 | BVA | 5 | — | UNCOVERED |

Min_TCs = Floor from Q-Floor calculation (Change 3C).
L5 fills Actual_TCs when writing. Gate 5 v2 verifies Actual ≥ Min.
```

---

### Change 3H — Gate 3 Redesign (2-level) *(Fixes RCA-8)*

```
### Gate 3a — Self-Review (Internal — Agent runs BEFORE presenting to Khai)

Analysis completeness:
  [ ] Every AC has BU block (Why business cares + Actor intent + System contract + Risk)
  [ ] Every AC has Q6-Extended: O1/O2/ON list split (not just "outcomes listed")
  [ ] Every AC has Q-DATA (Q13): DataIDs assigned per data item
  [ ] Every DR block: Floor ≥ min_hint, using explicit breakdown (O/N/DT/ST/BVA counts)

Technique Validation:
  [ ] Technique Validation Report produced (Gate 3a output)
  [ ] Every Tier 3 AC has H1–H5 EG verdict list
  [ ] Every assigned technique has ACTUAL artifact built (not declared)

Dependency Map + Data:
  [ ] All 8 relationship types scanned
  [ ] Every Data/State/Logical-inversion/Shared-entity row → MANDATORY TC flagged
  [ ] Data Prerequisite Card exists per module with DataID registry
  [ ] Conflicts between ACs documented

RTM:
  [ ] Every REQ mapped to module OR flagged as GAP
  [ ] Min_TCs column populated (= Floor per AC)
  [ ] CoveredBy column present and empty (for Phase 5)

Self-Review result: [PASS → proceed to Gate 3b] / [FIX: list items → fix first]

---

### Gate 3b — User Approval (Hard Stop — MANDATORY)

[STOP — GATE 3b]: Present complete [DEEP ANALYSIS PACKAGE v3] including:
  - Technique Validation Report (with Khai-approved additions)
  - Business Understanding Blocks (per AC)
  - DR Blocks (Q6 O-list, N-list, Q-DATA, Floor, technique artifacts)
  - Data Prerequisite Cards (per module)
  - Dependency Map (MANDATORY TCs flagged)
  - RTM (Min_TCs populated)
  - Any GAP ALERTs

Wait for Khai's explicit approval. Do NOT auto-proceed to Layer 4.
After approval: "Package approved. Next: @qa-scenario-designer"
```

---

### [DEEP ANALYSIS PACKAGE v3] — Output Structure

```markdown
### [DEEP ANALYSIS PACKAGE v3]

#### AC Type Classification Matrix (with Tier + min_hint)
| AC | Structural Type | Tier | Risk | Design Supplement? | min_hint | Est. Floor |

#### Technique Validation Report (from Gate 3a)
| AC | L2 Assignment | Result | Khai-approved additions |

#### Business Understanding Blocks (per AC)
BU — AC1: Why business cares / Actor intent / System contract / Risk if broken
BU — AC2: ...

#### Deep Reading Blocks (per AC — 7Q/10Q/12Q + Q6-Extended + Q-DATA)
DR — AC1: Q1..Q12 + Q6 O-list + Q6 N-list + Q-DATA + Technique Artifacts + Floor

#### Data Prerequisite Cards (per Module)
[DATA PREREQUISITE CARD — MOD_01] + DataID Registry

#### Cross-AC/US Dependency Map (8 types, MANDATORY TCs flagged)
| Relationship | Source | Target | Type | Test Implication | TC Required? | CoveredBy |

#### Analysis Artifacts (per triggers)
[AC Capability Map / Success Outcome Ledger / Condition Matrix / etc.]

#### Requirement Traceability Matrix (with Min_TCs)
| REQ-ID | US | AC | Module | Technique | Min_TCs | Actual_TCs | Status |
```

---

## 5. Layer 4 — `qa-scenario-designer`

**Đánh giá:** Good. 3-tier regression, State Machine Scan, BDD flag solid. **Cần 3 additions.**

### Change 4A — SCEN/FUNC Separation Rule *(Fixes RCA-6)*

```
### ⚠️ SCEN vs FUNC Separation (MANDATORY)

SCEN TCs = business flow validation across multiple ACs/surfaces.
FUNC/EDGE TCs = per-AC observable outcome coverage.

SCEN TCs DO NOT substitute FUNC/EDGE TCs.
Writing 1 SCEN TC does NOT reduce FUNC requirement.

Regression Suite output MUST include:
| Scenario | Tier | ACs Covered | FUNC/EDGE TCs Still Required? |
|---|---|---|---|
| T0-001 | 0 | AC1,AC3,AC8 | YES — AC1 needs [N FUNC/EDGE], AC3 needs [N], AC8 needs [N] |

Rule: L5 Gate 5 v2 Floor check uses FUNC+EDGE count from Min_TCs (RTM).
      SCEN count is additive — NEVER used to satisfy floor.
```

### Change 4B — Dependency Map Derive Mandate

```
Tier 0 flows MUST cite specific Dependency Map row IDs:
  T0-001: "Derived from DEP-003 (State dependency: archive blocks issuance) + DEP-007 (Data: credits → balance)"
  Tier 0 flow NOT traceable to Dependency Map → downgrade to Tier 1 or remove.

Rule: If a cross-US flow cannot be traced to a Dependency Map relationship → it is not Tier 0.
```

### Change 4C — Regression Suite RTM Link

```
Each Regression Suite scenario must cite REQ-IDs covered:
| T0-001 | ... | ... | REQ-001, REQ-005, REQ-012 |

Purpose: L5 can cross-check which REQ-IDs are covered by SCEN vs FUNC.
```

---

## 6. Layer 5 — `qa-testcase-generator` *(SIGNIFICANT UPDATE)*

---

### Change 5A — TC Table Format: 9-Column *(Remove Test Level + Auto Feasibility)*

**Current:** 11 columns (includes Test Level, Auto Feasibility)  
**New:** 9 columns

```
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
```

**File structure:**

```markdown
## [MOD_ID] — [Module Name]
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-US01-FUNC-001 | AC1 | Verify... | ... | ... | ... | ... | High | [MOD_01] FUNC \| Pos |
```

**Final Summary — updated (remove automation sections):**

```
### [FINAL TEST SUITE] — Summary
Coverage: [N total] — FUNC:[N] SEC:[N] UI:[N] EDGE:[N] SCEN:[N]
By Priority: High:[N] Medium:[N] Low:[N]
By Module: [module: N TCs (risk level) — Technique artifacts: DT/ST/BVA/EP/EG]
RTM: [N]/[N] REQs covered — [N] with Actual_TCs ≥ Min_TCs — [N] gaps
```

---

### Change 5B — Context Review Step *(Fixes RCA-7)*

**Vị trí:** Phase 5a — chạy MỘT LẦN khi skill start, trước STEP A.

```
## Phase 5a — Context Review (MANDATORY — run once at startup)

### Check 1 — Input Completeness
  [ ] [MASTER CONTEXT] present: Purpose + Flows + Actor Map + Then-bullet Inventory + min_hints
  [ ] [MODULE LIST] + [RISK REGISTER] present with Technique Assignment Map + Tiers
  [ ] [DEEP ANALYSIS PACKAGE v3] present:
      - BU blocks per AC
      - DR blocks with Q6 O-list, N-list, Q-DATA
      - Technique Artifacts (actual tables, not labels)
      - Data Prerequisite Cards with DataID registry
      - Dependency Map with MANDATORY TCs flagged
      - RTM with Min_TCs populated
  [ ] [REGRESSION SUITE] present with SCEN/FUNC separation noted

### Check 2 — Context Quality Spot-Check (3 ACs minimum)
  For 3 randomly sampled ACs:
  [ ] BU block exists and has content (not placeholder)
  [ ] Q6 O-list: has explicit O1/O2/ON items (not just "list of outcomes")
  [ ] Q-DATA: has DataIDs assigned (not empty)
  [ ] Technique artifact: actual table EXISTS (not label "DT: Y")
  [ ] Min_TCs in RTM: populated (not "—")

  If gaps found:
    Option A: Spec file accessible → read and supplement missing Q answers directly
    Option B: Spec not accessible → flag gaps, ask Khai before proceeding

### Check 3 — Technique Supplement (L5 last-check)
  For each module, verify Technique Assignment Map is specific:
  [ ] Any AC with ≥2 conditions has DT assigned
  [ ] Any AC with lifecycle entity has ST assigned
  [ ] Any Tier 3 AC has EG H1–H5 assigned

  If L5 detects additional missing technique that L3 did not catch:
  → Add note: "[TECHNIQUE SUPPLEMENT: DT added for AC-X — 2 independent conditions detected]"
  → Proceed. No stop needed for L5 technique additions (these are minor supplements, not analysis).

Context Review Output (compact, in response):
  ✅ Context: SUFFICIENT / PARTIAL / INSUFFICIENT
  ✅ Gaps found: [list or "none"]
  ✅ Supplements: [list or "none"]
  → Proceeding to STEP A — [first module name]
```

---

### Change 5C — Role Shift: Execution from Artifacts *(Fixes RCA-7)*

```
## STEP A — Module Brief + Derive Pre-work (MANDATORY before any TC)

### Pipeline Derive Protocol (per Module)

Before writing first TC for Module X:
  1. Read BU blocks for all ACs in module → understand business context
  2. Read DR blocks → Q6 O-list + Q6 N-list + Q-DATA for each AC
  3. Read Technique Artifacts → list all DT rows, ST rows, BVA points, EG slots
  4. Read MANDATORY TC rows from Dependency Map for this module
  5. Map EACH item → TC ID slot (or mark "not yet covered")

  Empty TC ID slot = visible gap = write TC next.
  DO NOT write TCs from spec re-reading or memory alone.
  DO NOT re-analyze. IF analysis is insufficient → raise in Context Review (Phase 5a).
```

---

### Change 5D — Writing Rules Update *(Fixes RCA-4, RCA-5)*

#### Steps Formatting Rule

```
Steps — 1 physical action per step, natural numbered list:

RIGHT:
  1. Log in as Coach at app.everfit.io
  2. Navigate to client "Jane Smith" profile
  3. Click "Sessions" tab
  4. Click "Issue Credits" button
  5. Select session type "PT Session"
  6. Enter "3" in Credits field
  7. Click "Confirm" button

WRONG: "1. Log in and navigate to client 2. Click Sessions tab and Issue Credits 3. Fill and submit"

Rule: NO "and". NO "then". 1 verb, 1 target, 1 step.
In markdown table cell: write numbered list inline with spaces (e.g., 1. action 2. action)
  OR use multiple lines within cell where renderer supports it.
```

#### Expected Result Formatting Rule

```
Expected — Observable, specific, separate:

Single outcome:
  "Balance shows '2 credits total' in Credits tab header"

Multiple tightly-coupled outcomes (same TC):
  Write as numbered list:
  "1. Toast: 'Credits issued successfully' appears top-right
   2. Balance updates to '4 PT Session credits' in Credits tab
   3. Activity row added: 'Issued — 1 PT Session credit — 2026-05-16'"

Rule: If Expected has "and" joining 2 INDEPENDENTLY verifiable items → split to numbered list
      OR split into 2 TCs (preferred when items can fail independently).
```

#### Forbidden Phrases Blocklist (auto-fail Gate 5 v2)

```
FORBIDDEN in Expected Result — if found → Gate 5 v2 FAILS → rewrite before proceed:

Vague qualifiers:
  "correctly" | "properly" | "as designed" | "as per spec" | "as expected"

Incomplete observable (missing WHAT/WHERE/VALUE):
  "visible" (alone) | "shown" (alone) | "updated" (alone) | "displayed" (alone)

Function claims (not observable):
  "works" | "functions" | "behaves normally" | "operates as intended"

Multi-assertion connector:
  "[X] and [Y] are [Z]" where X and Y are separately verifiable → split to numbered list or 2 TCs

Required replacement pattern:
  ❌ "Credits are updated correctly"
  ✅ "Credit balance shows '4 PT Session credits' in Sessions tab header"
  
  ❌ "Error message is visible"
  ✅ "Error message appears below Credits field: 'Insufficient balance to issue credits'"
  
  ❌ "Status shows correctly and button is disabled"
  ✅ TC-A Expected: "Status label shows 'Voided' in red"
     TC-B Expected: "Issue Credits button is disabled and non-clickable"
```

#### Test Data Display Rule

```
Test Data — Values first, DataID second:

Shared / Stateful / Boundary / Destructive data:
  "credits: 3 PT Session, status: active, balance: $150 → TD-001"
  "purchase: confirmed, activated: true → TD-002"
  "client: balance=0 (edge case) → TD-003-BOUNDARY"
  
  Rule: Tester must understand test data WITHOUT looking up the DataID.

Simple inline (≤4 values, not shared, no setup dependency):
  "email: coach_test@testfitness.com, credits: 3"
  No DataID needed.

FORBIDDEN:
  ❌ "→TD-001" (DataID only, no values)
  ❌ "credits: 3, balance: $150" (values without DataID when it's a shared fixture)
```

---

### Change 5E — Gate 5 v2: 6-Part, Non-Fakeable *(Fixes RCA-8)*

```
## Gate 5 v2 — Per AC (run IMMEDIATELY after writing TCs for that AC)

NEVER batch at end of module. NEVER self-certify. Each part must have listed output.

---

PART 1 — Observable Outcomes Coverage (NON-FAKEABLE):
| Observable (copy verbatim from Q6 O-list) | TC ID covering it |
|---|---|
| [O1: exact text from DR block] | TC-US##-FUNC-### |
| [O2: exact text] | TC-US##-FUNC-### |
| [N1: exact negative condition → error text] | TC-US##-EDGE-### |

→ ANY empty TC ID = FAIL → write TC before proceeding.
→ Table cannot be skipped, summarized, or shortened.

---

PART 2 — Technique Artifact Coverage (NON-FAKEABLE):
| Artifact row (from DT/ST/BVA table in DR block) | TC ID |
|---|---|
| DT Row 1: Cond A=Y, B=Y → outcome X | TC-... |
| DT Row 2: Cond A=Y, B=N → outcome Y | TC-... |
| ST: active → cancelled | TC-... |
| ST: cancelled → [blocked] (invalid) | TC-... |

→ ANY empty TC ID = FAIL (or "No TC — [reason from spec]" for invalid/excluded rows)
→ "n/a" alone not accepted — must cite reason from spec.

---

PART 3 — Forbidden Phrases Scan:
Scan each Expected Result written for this AC:
  [TC ID] Expected: "[text]" → forbidden phrase detected? YES/NO
→ YES on any TC = FAIL → split/rewrite before proceeding

---

PART 4 — Floor Check:
  Actual TCs written for this AC = [N]
  Min_TCs (from RTM) = [N]
  count(O) + count(N) = [N]
  Actual ≥ max(Min_TCs, count(O) + count(N))? → PASS / FAIL
→ FAIL = write [delta] more TCs before proceeding

---

PART 5 — Test Data Quality Check:
  Any TC in this AC using shared/stateful data with DataID-only (no concrete values)?
  [TC ID]: "→TD-001" only? → FAIL → add concrete values
→ ALL TCs must show values + DataID for shared data.

---

PART 6 — Coverage Linkage:
  [ ] Dependency Map: MANDATORY TC rows for this AC → CoveredBy filled with TC ID
  [ ] RTM: Actual_TCs column filled for this AC
  [ ] RTM: Status updated to "✓ Covered"

---

Status: ✓ PASS — all 6 parts checked  
        ✗ FIX FIRST — Part [N]: [specific item missing]
```

---

### Change 5F — Pre-finalization Checklist Enhancement

Thêm vào refs/quality_gates.md sau 9 Quality Patterns:

```
### PART B — L3 Artifact Traceability Check (mới)
  [ ] Dependency Map CoveredBy column: ZERO empty rows
      (or "Covered via precondition TC-XX" / "No standalone case — reason")
  [ ] Every L3 Technique Artifact row → TC ID assigned (or exclusion reason)
  [ ] RTM: Actual_TCs ≥ Min_TCs for EVERY AC
  [ ] RTM: ZERO "UNCOVERED" rows

### PART C — Test Data Reference Check (mới)
  [ ] Test Data Reference card exists if any TD-xxx referenced in TCs
  [ ] Every TD-xxx in registry: description + key values + setup order + Used by TCs
  [ ] No TC has "→TD-XXX" without concrete values
```

---

## 7. Master Workflow — `qa-master-workflow`

### Change 6A — Pre-pipeline Epic Split

```
### ⚡ MANDATORY PRE-CHECK — Before L1

Step 0: Count total ACs in scope.
  ≤20 ACs → Select SESSION MODE (S/M/L) → proceed to L1.
  >20 ACs → MANDATORY STOP.

"Feature has [N] ACs (limit = 20). Risk: context pressure degrades depth (RCA-3).
 Recommend splitting into [M] Epics of ≤15 ACs each:
   Epic A = US01–US05 ([N] ACs) | Epic B = US06–US10 ([N] ACs)
 Each Epic → independent MODE M pipeline → merge regression suites at end."

Wait for Khai confirmation. Do NOT start L1 until split is confirmed.
```

### Change 6B — Layer Handoff Rules (explicit)

```
### Layer Handoff Artifacts — What Each Layer MUST Receive

L1 → L2: [MASTER CONTEXT] with Then-bullet Inventory + min_hints per AC + AC Scope Summary
L2 → L3: [MODULE LIST] + [RISK REGISTER] + AC Tiers + Technique Assignment Map + Est. Floor
L3 → L4: [DEEP ANALYSIS PACKAGE v3]
          BU blocks + DR blocks (Q6 O-list + Q-DATA) + Technique Artifacts (built)
          + Data Prerequisite Cards + Dependency Map (MANDATORY flags) + RTM (Min_TCs)
L4 → L5: [REGRESSION SUITE] with SCEN/FUNC separation + Dependency Map row citations
L5 ← MISSING any artifact above → L5 raises with Khai. Does NOT compensate by re-analyzing.
```

### Change 6C — Pipeline Derive Protocol

```
### Pipeline Derive Protocol (L5 entry — MANDATORY per module)

Before writing first TC for Module X:
  1. Read BU blocks for all ACs in module
  2. Read DR blocks → Q6 O-list → map each O-item → TC ID slot
  3. Read Technique Artifacts → map each artifact row → TC ID slot
  4. Read Dependency Map → MANDATORY TC rows for module → map → TC ID slot
  5. Read Data Prerequisite Card → import DataIDs → do NOT create new ones

Empty slot = visible gap. Write TC for that slot next.
DO NOT write TCs from memory or spec re-reading alone.
```

---

## 8. `docs/QA_INTAKE.md` Update

```
### PRE-STEP: AC Count Check (thêm vào đầu Intake Flow, BEFORE Step 1)

Count total ACs in scope:
  ≤20 → proceed to Step 1 (assign Lane/Mode)
  >20 → STOP

  "Feature has [N] ACs (>20 limit). Recommend Epic split: [N] Epics of ≤15 ACs each.
   Confirm split plan before pipeline start."

  Reference: MODE XL (>40 ACs) in master workflow already has this.
  This check catches 21–40 range that would be assigned MODE L but still benefits from split.
```

---

## 9. Quality Gates — Complete Redesign Summary

| Gate | Layer | Type | Status | Key change |
|---|---|---|---|---|
| SCOPE GATE | Pre-L1 | Hard Stop | **NEW** | >20 ACs → mandatory split |
| Gate 0 | L1 Phase 0 | User Approval | No change | Design/image check |
| Gate 0.5 | L1 Phase 0.5 | User Approval | No change | Feature Orientation |
| Gate 1a | L1 Phase 1 | User QnA | No change | Ambiguity Scan |
| Gate 1b | L1 Phase 1 | User Approval | **Updated** | +Then-bullet Inventory in MASTER CONTEXT |
| Gate 2a | L2 | User Choice | No change | Strategy selection |
| Gate 2b | L2 | User Approval | No change | Module structure draft |
| Gate 2c | L2 | User Approval | **Updated** | +Technique Assignment Map + Tiers in payload |
| Gate 3a | L3 Phase 3a.5 | Hard Stop | **NEW** | Technique Validation Report — before Deep Reading |
| Gate 3a (self) | L3 | Internal | **NEW** | Agent self-review checklist — before Gate 3b |
| Gate 3b | L3 | Hard Stop | **RENAMED** | Full DEEP ANALYSIS PACKAGE v3 approval |
| Gate 4A | L4 | User Approval | **Updated** | +SCEN/FUNC table + Dependency Map derive mandate |
| Gate 4B | L4 BDD | User Approval | No change | Optional BDD |
| Gate 5 v2 | L5 per-AC | Hard Stop | **MAJOR** | 6-part non-fakeable: O-list table + Artifact table + Phrase scan + Floor + Data + RTM |
| Gate Module | L5 per-module | User Approval | **Updated** | +RTM Actual ≥ Min check |

---

## 10. Files Changed — Full Summary

| File | Action | Changes | Fixes RCA |
|---|---|---|---|
| `qa-context-builder/SKILL.md` | UPDATE | Epic Split Gate (1A) + Then-bullet Inventory (1B) + AC Scope Summary (1C) | RCA-1, RCA-3 |
| `qa-strategy-decomposer/SKILL.md` | UPDATE | AC Complexity Tier (2A) + Technique Assignment Map (2B) + Est. Floor (2C) | RCA-2, RCA-3 |
| `qa-deep-analyzer/SKILL.md` | **MAJOR UPDATE** | Gate 3a Technique Review (3A) + BU block (3B) + BUILD mandate (3D) + Gate 3 redesign (3H) + DAP v3 structure | RCA-1, RCA-2, RCA-5, RCA-7 |
| `qa-deep-analyzer/refs/adaptive_reading.md` | **MAJOR UPDATE** | Q6-Extended + Q6-Negative (3C) + Q-DATA/Q13 (3C) + Floor formula per Tier | RCA-1, RCA-5 |
| `qa-deep-analyzer/refs/artifacts.md` | UPDATE | Artifact BUILD mandate rules (3D) + Data Prerequisite Card format (3E) | RCA-2, RCA-5 |
| `qa-deep-analyzer/refs/dependency.md` | UPDATE | Impact Alert Rule (3F) + TC Required column + Gate 3 checklist extension | RCA-7 |
| `qa-deep-analyzer/refs/ac_unpack.md` | **CREATE NEW** | BU template + Q1–Q13 full template + Floor formula v3 | RCA-1, RCA-5 |
| `qa-deep-analyzer/refs/data_prerequisite.md` | **CREATE NEW** | Data Prerequisite Card template + DataID registry format + Conflict mapping | RCA-5 |
| `qa-scenario-designer/SKILL.md` | UPDATE | SCEN/FUNC separation (4A) + Dependency Map derive mandate (4B) + RTM link (4C) | RCA-6 |
| `qa-testcase-generator/SKILL.md` | **SIGNIFICANT UPDATE** | 9-column table (5A) + Context Review Phase 5a (5B) + Pipeline Derive Protocol (5C) | RCA-7, RCA-4 |
| `qa-testcase-generator/refs/writing_rules.md` | UPDATE | Steps formatting (5D) + Expected formatting (5D) + Forbidden Phrases blocklist (5D) + Test Data display rule (5D) | RCA-4, RCA-5 |
| `qa-testcase-generator/refs/quality_gates.md` | **MAJOR UPDATE** | Gate 5 v2 — 6-part (5E) + Pre-finalization PART B + PART C (5F) | RCA-8 |
| `qa-master-workflow/SKILL.md` | UPDATE | Epic Split pre-check (6A) + Layer Handoff Rules (6B) + Pipeline Derive Protocol (6C) | RCA-3, RCA-7 |
| `docs/QA_INTAKE.md` | UPDATE | Pre-step AC count check | RCA-3 |

**Total: 14 files** (2 new CREATE, 12 UPDATE)

---

## 11. Before / After — Expected Outcomes

| Metric | Before (P3.1) | After (target) | What drives the improvement |
|---|---|---|---|
| TCs/AC average | 2.4 | 6–10 | Q6-Extended O-list split + Q6-Negative (RCA-1) |
| % TCs with single assertion in Expected | ~40% | >90% | Forbidden Phrases blocklist + split rule (RCA-4) |
| % ACs fully covered (all Then-bullets) | ~55% | >90% | Bullet-to-TC mapping table in Gate 5 v2 Part 1 (RCA-1) |
| Technique artifacts actually BUILT | ~20% | >95% | BUILD mandate + Gate 3a verification (RCA-2) |
| Test data: concrete values visible | ~30% | 100% | Writing rule: values + DataID (RCA-5) |
| Layer doing primary analysis | L5 (wrong) | L3 (correct) | Role shift + Derive Protocol + Context Review (RCA-7) |
| Gate 5 pass rate when TCs actually missing | ~80% (self-cert) | <10% | 6-part non-fakeable gate (RCA-8) |
| SCEN TCs used as FUNC substitute | Frequent | Eliminated | SCEN/FUNC separation rule (RCA-6) |
| Epic split before pipeline (>20 ACs) | Never | Always | Pre-pipeline SCOPE GATE (RCA-3) |
| Business context captured per AC | 0% | 100% | BU block mandatory (ATDD alignment) |

---

## 12. Implementation Order — Phase by Phase

**Phase 1 — Critical path (highest ROI):**
1. `qa-deep-analyzer/refs/adaptive_reading.md` → Q6-Extended + Q-DATA (Q13) + Floor formula
2. `qa-deep-analyzer/refs/ac_unpack.md` → CREATE NEW (BU template + Q1-Q13)
3. `qa-deep-analyzer/refs/data_prerequisite.md` → CREATE NEW (Data Prerequisite Card)
4. `qa-deep-analyzer/SKILL.md` → BU block + Gate 3a + Artifact BUILD mandate + Gate 3 redesign + DAP v3
5. `qa-testcase-generator/refs/quality_gates.md` → Gate 5 v2 (6-part)
6. `qa-testcase-generator/refs/writing_rules.md` → Formatting + Forbidden phrases + Test Data rule

**Phase 2 — Upstream fixes:**
7. `qa-context-builder/SKILL.md` → Epic Split Gate + Then-bullet Inventory + AC Scope Summary
8. `qa-strategy-decomposer/SKILL.md` → AC Complexity Tier + Technique Assignment Map + Est. Floor

**Phase 3 — Integration layer:**
9. `qa-scenario-designer/SKILL.md` → SCEN/FUNC rule + Dependency Map mandate + RTM link
10. `qa-testcase-generator/SKILL.md` → 9-column + Context Review + Pipeline Derive Protocol
11. `qa-master-workflow/SKILL.md` → Epic Split + Layer Handoff Rules + Derive Protocol
12. `qa-deep-analyzer/refs/artifacts.md` → BUILD mandate format
13. `qa-deep-analyzer/refs/dependency.md` → Impact Alert Rule + TC Required column
14. `docs/QA_INTAKE.md` → Pre-step AC count check

**Phase 4 — Pilot validation:**
15. Run pilot với US11 AC1 (known answer: ~13 TCs)

---

## 13. Validation — Pilot Test Plan

Sau khi implement Phase 1–3, chạy pilot với **known AC**:

**AC:** US11 AC1 (đã biết từ post-mortem cần ~13 TCs)

```
L3 verification:
  [ ] BU block: "Why business cares" filled and specific
  [ ] Q6-Extended: O-list split → count(O) ≥ 10
  [ ] Q6-Negative: N-list → count(N) ≥ 3
  [ ] Q-DATA: DataIDs assigned (TD-001, TD-002...)
  [ ] Technique artifact: DT or ST actual table built (not declared)
  [ ] Floor calculation: shows O/N/DT/ST/BVA breakdown → Floor ≥ 13
  [ ] Min_TCs in RTM: ≥ 13

L5 verification:
  [ ] Context Review: context SUFFICIENT (all checks pass)
  [ ] Gate 5 v2 Part 1: bullet-to-TC table → 10+ rows, all TC IDs filled
  [ ] Gate 5 v2 Part 2: artifact rows → all TC IDs filled
  [ ] Gate 5 v2 Part 3: forbidden phrases scan → PASS
  [ ] Gate 5 v2 Part 4: Actual ≥ 13 → PASS
  [ ] Gate 5 v2 Part 5: Test Data → values + DataID on all shared fixtures
  [ ] Expected results: all specific, observable, no vague phrases

Pass criteria: Gate 5 v2 CANNOT pass with fewer than 13 TCs for this AC.
→ Pass pilot → merge changes into production skills.
```
