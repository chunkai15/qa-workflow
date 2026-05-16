# QA TC Quality Improvement Plan
**Trigger:** Post-mortem phân tích P3.1 Session Credits — Package Issuance pipeline
**Date:** 2026-05-16 | **Author:** Khai Truong (QA)

---

## 1. Root Cause Analysis

### RCA-1 — Đọc AC theo headline, không theo observable outcomes *(Most impactful)*
**Biểu hiện:** US09 AC1 có 5 Then-bullets → 2 TCs. US11 AC1 → 5 TCs thay vì 23.
**Root cause:** AC được đọc như 1 requirement thay vì list of individually verifiable outcomes. Mỗi Then-bullet chứa 1-3 observable items, mỗi item cần TC riêng.
**Xảy ra tại:** Layer 1 (inventory), Layer 3 (analysis)

### RCA-2 — Technique artifacts declared, không được build
**Biểu hiện:** Module Brief ghi `Decision Table: Y` nhưng table không tồn tại. TCs được viết từ intuition.
**Root cause:** "BVA/DT/EP" được dùng như labels, không phải intermediate artifacts bắt buộc xuất hiện trước TC đầu tiên.
**Xảy ra tại:** Layer 3 (Deep Analyzer)

### RCA-3 — Token/scope pressure → sacrifice depth for breadth
**Biểu hiện:** 223 TCs cho 94 REQs = 2.4 TCs/REQ. Mọi REQ đều có ≥1 TC nhưng không REQ nào đủ depth.
**Root cause:** Feature quá lớn (13 US, 90+ ACs) không được Epic-split trước pipeline. Context pressure khiến ưu tiên breadth (cover đủ RTM rows) thay vì depth (cover đủ AC outcomes).
**Xảy ra tại:** Intake (trước Layer 1)

### RCA-4 — Gộp multiple assertions vào 1 Expected result
**Biểu hiện:** `Expected: "Shows correct status labels, colors, and actions"` = 3+ assertions trong 1 TC.
**Root cause:** Khi viết TCs trong long context, vô thức optimize để bộ TCs trông "manageable". Gộp Expected = ít dòng hơn = cảm giác xong nhanh hơn.
**Xảy ra tại:** Layer 5 (TC Generator)

### RCA-5 — Thiếu data prerequisite mapping
**Biểu hiện:** US11 TC "verify no credits issued" không specify: client cần có balance bao nhiêu? History entries nào? Purchase ở state nào?
**Root cause:** Không có bước nào bắt buộc trả lời "What must exist in the system BEFORE testing this AC?" trước khi viết TC.
**Xảy ra tại:** Layer 3 (Deep Analyzer)

### RCA-6 — SCEN TC được dùng như coverage substitute
**Biểu hiện:** Sau khi viết 1 SCEN E2E TC cho module, số FUNC TCs giảm vì "đã có E2E cover rồi."
**Root cause:** Không có rule phân tách rõ: SCEN = business flow validation ≠ FUNC/EDGE = per-AC outcome coverage. Hai loại phục vụ mục đích khác nhau.
**Xảy ra tại:** Layer 4 (Scenario Designer), Layer 5

### RCA-7 — Layer 5 không derive từ Layer 3 artifacts
**Biểu hiện:** TCs được viết lại từ spec/memory thay vì map từ DR blocks và Regression Suite rows của Layers 3-4.
**Root cause:** Layer 3 không output đủ artifacts để Layer 5 derive từ. Layer 5 phải compensate bằng cách re-analyze — mà không có đủ depth.
**Xảy ra tại:** Layer 3 (artifact output không đủ), Layer 5 (không enforce derive)

### RCA-8 — Gate 5 là self-certification, không phải hard blocker
**Biểu hiện:** Gate 5 được run và pass ngay sau khi viết TCs cho AC. Không có gì ngăn pass khi thiếu TCs.
**Root cause:** Gate chỉ verify by declaration (`✓ Floor met`), không require concrete listed output mapping bullets → TC IDs.
**Xảy ra tại:** Layer 5 (quality gate)

---

## 2. Kiến trúc sai của plan ban đầu

**Plan cũ đặt 90% fixes vào Layer 5.** Nhưng phần lớn RCAs bắt nguồn từ upstream:

```
L1 Context Builder  → RCA-1 (AC reading), RCA-3 (scope)
L2 Decomposer       → RCA-3 (complexity assessment)
L3 Deep Analyzer    → RCA-2 (artifacts), RCA-5 (data prereqs), RCA-7 (shallow output)
L4 Scenario Designer → RCA-6 (SCEN/FUNC separation)
L5 TC Generator     → RCA-4 (assertions), RCA-8 (gate)
```

**Nguyên lý đúng:** Fix phải nằm tại layer phát sinh vấn đề. Nếu Layer 3 output đúng artifacts + floor + data prerequisites → Layer 5 gần như cơ học.

---

## 3. Improvement Plan — Per Layer

---

### Layer 1: qa-context-builder
**File:** `SKILL.md`
**Adds:**

**A. Epic Split Gate (trước khi build Master Context)**
```
Đếm tổng ACs trong scope.
>20 ACs → STOP → Yêu cầu split thành Epics (≤15 ACs/Epic) trước khi proceed.
Lý do: context pressure bắt đầu tại đây.
```

**B. Then-bullet Inventory trong Master Context**
```
Với mỗi AC, list toàn bộ Then-bullets (không phân tích sâu, chỉ inventory):
  AC1 → [B1: title UI], [B2: illustration], [B3: body text], [B4: button] → min_hint=4
  AC3 → [B1: cancel button], [B2: create button renamed] → min_hint=2
Output: min_hint per AC được carry sang Layer 3 → Layer 5.
```

---

### Layer 2: qa-strategy-decomposer
**File:** `SKILL.md`
**Adds:**

**A. AC Complexity Tier per Module**
```
Tier 1 (Simple):   ≤2 Then-bullets, no conditions, 1 actor → Quick analysis
Tier 2 (Standard): 3-4 bullets OR 1 condition OR 2 actors → Standard AC Unpack
Tier 3 (Complex):  5+ bullets OR multiple conditions OR state machine → Full artifacts required
Output: Tier profile per AC vào Module Risk Register
```

**B. Technique Assignment Map**
```
Không phải Layer 5 tự quyết technique. Layer 2 assign:
  [MOD_ID] Technique Map:
    AC3 → BVA (qty field: 1-100)
    AC5 → Decision Table (2 conditions × 2 values = 4 combos)
    AC7 → State Transition (8 purchase statuses)
Layer 3 nhận map này và BUILD artifacts. Layer 5 chỉ READ.
```

---

### Layer 3: qa-deep-analyzer *(Thay đổi lớn nhất)*
**Files:** `SKILL.md` + new `refs/ac_unpack.md` + new `refs/data_prerequisite.md`

**A. Mandatory AC Unpack — Q1-Q5 per AC** *(New ref file: `refs/ac_unpack.md`)*

```
Q1. DATA PREREQUISITE
    Liệt kê entities + states cần có để test AC này:
    - WS: Booking=[ON/OFF], P&P=[ON/OFF]
    - Package: [type, credit rules, status]
    - Purchase: [status, activated?, invoice_states]
    - Client: [connected?, balance=X, history_entries=[types]]
    Đánh dấu: DESTRUCTIVE (1-time use) | SHARED (→ DataID)

Q2. OBSERVABLE OUTCOMES
    Copy từng Then-bullet. Split on: "," | ";" | " and "
    Mỗi split item = 1 observable = 1 TC minimum.
    O1: [exact UI element / text / state]
    O2: ...

Q3. ACTORS & PERMISSIONS
    - Actor chính: có quyền → positive TCs
    - Actor blocked: không quyền → negative TCs

Q4. NEGATIVE PATHS
    N1: [condition] → [exact error text/blocked state]
    N2: ...

Q5. TC FLOOR CALCULATION
    Floor = max(
      count(O),                  ← từ Q2
      DT_row_count,              ← từ technique map
      ST_valid + ST_invalid      ← từ technique map
    ) + count(N) + BVA_points
    
    Minimums: Tier 3 ≥ 7 | Tier 2 ≥ 4 | Tier 1 ≥ 2
    → STORE Floor in RTM column "Min_TCs"
```

**B. Data Prerequisite Card per Module** *(New ref file: `refs/data_prerequisite.md`)*
```
MODULE: [ID]
──────────────────────────────────────
WS STATE:    Booking=?, P&P=?, Stripe=?
PACKAGE:     type, credit rules, status
PURCHASE:    status, activated?, invoices
CLIENT:      connected?, balance, history entry types
CREDIT DATA: X available, Y used, Z expired
DESTRUCTIVE: [list]
DataIDs:     TD-001=[description], TD-002=[description]
──────────────────────────────────────
→ Layer 5 imports DataIDs này. Không tạo lại.
```

**C. Artifact BUILD mandate (không phải declare)**
```
Rule: Nếu Layer 2 assign technique → Layer 3 phải output actual artifact trong DR block.
❌ "Decision Table: Y" → FAIL (chỉ là label)
✅ Phải xuất hiện actual table với rows trước khi proceed
Mỗi artifact row → mapped sang Layer 5 TC ID (filled after Layer 5)
```

**D. RTM thêm cột Min_TCs**
```
| REQ-ID | US | AC | Module | Min_TCs | Actual_TCs | Status |
| REQ-001 | US1 | AC1 | E1-M1 | 8 | - | UNCOVERED |
Min_TCs = Floor từ Q5. Layer 5 fills Actual_TCs khi viết.
```

---

### Layer 4: qa-scenario-designer
**File:** `SKILL.md`
**Adds:**

**SCEN vs FUNC explicit separation rule:**
```
Regression Suite rows phải ghi rõ:
| Scenario | Tier | ACs covered | FUNC TCs still required? |
| E2E config flow | T1 | AC5,AC12,AC19 | YES |

SCEN TCs verify business flow end-to-end.
SCEN TCs KHÔNG thay thế per-AC FUNC/EDGE TCs.
Layer 5: Floor check dùng FUNC+EDGE count, không tính SCEN.
```

---

### Layer 5: qa-testcase-generator *(Nhẹ hơn — execution layer)*
**Files:** `SKILL.md` + `refs/writing_rules.md` + `refs/quality_gates.md`

**A. SKILL.md — Đổi vai trò: analysis → execution**
```
Layer 5 KHÔNG làm analysis. Nó DERIVES từ Layer 3:
1. Read DR blocks → mỗi artifact row → 1 TC
2. Read Min_TCs từ RTM → viết đủ số lượng
3. Import DataIDs từ Data Prerequisite Card
4. Apply Single-Assertion Filter khi viết
5. Gate 5: verify, không re-analyze
```

**B. refs/writing_rules.md — Thêm Forbidden Phrases Blocklist**
```
FORBIDDEN trong Expected (auto-fail):
- "correctly" | "properly" | "as designed" | "as per spec"
- "visible" (alone) | "shown" (alone) | "updated" (alone)
- "works" | "functions" | "displays"
- "and" nối 2 verifiable states
→ FAIL → split thành 2+ TCs riêng.

SCEN TC KHÔNG thay thế FUNC coverage.
Sau SCEN TC: FUNC TCs vẫn required per-AC per-outcome.
```

**C. refs/quality_gates.md — Gate 5 v2: Concrete Output (non-fakeable)**
```
Gate 5 yêu cầu LISTED output — không thể self-certify:

| Then-bullet (copy verbatim) | TC ID covering it |
| [B1: exact text]            | TC-US##-FUNC-### |
| [B2: exact text]            | TC-US##-FUNC-### |
| [N1: negative path]         | TC-US##-EDGE-### |

→ ANY empty TC ID cell = FAIL = write TC before proceed.

Expected scan: list Expected từng TC có forbidden phrase?
  → YES = FAIL = split TC.

Floor check: actual=[N] / Min_TCs=[N from RTM]
  → actual < Min_TCs = FAIL = write [delta] more TCs.
```

---

### Master Workflow: qa-master-workflow
**File:** `SKILL.md`
**Adds:**

```
Epic Split Rule (before Layer 1):
  Count ACs → >20 → MANDATORY split → ≤15 ACs per Epic → separate pipelines.

Pipeline Derive Protocol (Layer 5 must follow):
  Before writing TCs for Module X:
    1. Read DR block for Module X from analysis.md
    2. List all conditions/artifact rows
    3. Map each → TC ID (or mark as "not yet covered")
    4. Empty mappings = visible gap = missing TCs
  Do NOT write TCs from memory/spec re-reading alone.
```

---

## 4. Files Changed — Summary

| File | Action | Fixes |
|---|---|---|
| `qa-context-builder/SKILL.md` | UPDATE | Epic split gate, Then-bullet inventory |
| `qa-strategy-decomposer/SKILL.md` | UPDATE | Complexity tier, technique assignment map |
| `qa-deep-analyzer/SKILL.md` | **MAJOR UPDATE** | AC Unpack mandate, artifact build rule, RTM Min_TCs |
| `qa-deep-analyzer/refs/ac_unpack.md` | **CREATE** | Q1-Q5 template, Floor formula v2 |
| `qa-deep-analyzer/refs/data_prerequisite.md` | **CREATE** | Data Prerequisite Card template |
| `qa-scenario-designer/SKILL.md` | UPDATE | SCEN/FUNC separation rule |
| `qa-testcase-generator/SKILL.md` | UPDATE | Shift to execution-only, derive protocol |
| `qa-testcase-generator/refs/writing_rules.md` | UPDATE | Forbidden phrases blocklist |
| `qa-testcase-generator/refs/quality_gates.md` | UPDATE | Gate 5 v2 (concrete listed output) |
| `qa-master-workflow/SKILL.md` | UPDATE | Epic split, pipeline derive protocol |
| `docs/QA_INTAKE.md` | UPDATE | Pre-pipeline AC count check |

---

## 5. Before/After: Kỳ vọng thay đổi

| Metric | Before | After |
|---|---|---|
| TCs/AC (average SaaS payment feature) | 2.4 | 6-8 |
| % TCs có single assertion in Expected | ~40% | >90% |
| % ACs fully covered (all Then-bullets) | ~55% | >85% |
| Layer producing most analysis | L5 (wrong) | L3 (correct) |
| Gate 5 pass rate when TCs actually missing | ~80% (self-cert) | <10% (listed output) |
| Epic split before pipeline (>20 ACs) | Never | Always |

---

## 6. Validation — Làm sao biết changes work?

Sau khi update skills, chạy pilot test:
1. Lấy 1 AC đã biết đáp án (ví dụ US11 AC1 — cần ~13 TCs)
2. Chạy pipeline với skills mới
3. Verify: Layer 3 output đủ Q1-Q5 + artifact + Floor=13
4. Verify: Layer 5 derives từ artifacts → actual count ≥ 13
5. Verify: Gate 5 fills bullet-to-TC mapping table đầy đủ

Pass pilot → merge changes vào production skills.
