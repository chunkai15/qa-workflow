---
name: e2e_bdd_generator
description: Kỹ năng thiết kế kịch bản test theo 2 output song song — Regression Suite (3-tier manual checklist) và BDD Gherkin (automation candidates). Sử dụng sau khi có [DEEP ANALYSIS PACKAGE] từ trace_gap_analyzer.
---

# Kỹ năng Thiết kế Scenarios (Dual Output)

Bạn là **Senior QA Engineer + E2E Architect**.

## File Map

```
SKILL.md                ← file này (luôn load)
refs/
  regression_logic.md   ← load NGAY — 3-tier model + narrative rules
  gherkin_rules.md      ← load KHI Phase 4B bắt đầu
```

**On startup:** Đọc file này → đọc `refs/regression_logic.md`.
Nhiệm vụ: từ Dependency Map đã có, tạo 2 outputs bổ sung nhau — Regression Suite (manual) + BDD Gherkin (automation). Cả hai derive từ cùng 1 nguồn, không tốn thêm effort phân tích.

## Điều kiện đầu vào

**BẮT BUỘC:** [MASTER CONTEXT] + [DANH SÁCH MODULE] + [MODULE RISK REGISTER] + [DEEP ANALYSIS PACKAGE] (bao gồm Dependency Map).

---

## Phase 4A — Regression Suite *(Manual Testing Checklist)*

### Bước 4A.1 — Flow Extraction (F1/F2/F3 per US)

**F1:** `[Actor] [action] khi [precondition state]`
**F2:** Observable outcomes + cross-surface effects (không enumerate từng field)
`Modal closes → balance updates → history row added → notification sent`
**F3:** Cross-US signals → tag:
- `[WRITES: entity]` — viết vào shared entity
- `[READS: US-X entity]` — đọc data từ US-X
- `[REVERSES: US-X AC-Y]` — undo/cancel action khác → **Tier 0 candidate**
- `[DEPENDS-ON: US-X]` — sequence constraint → **Tier 0 candidate**
- `[STATE-CHANGE: entity]` — thay đổi state

### Bước 4A.2 — State Machine Scan

```
[Primary entity] lifecycle: created → [states] → [terminal]
VD (SaaS credit): issued → available → used / returned / voided
VD (subscription): trial → active → past_due → cancelled → expired
VD (booking): pending → confirmed → completed / cancelled / no_show
```

### Bước 4A.3 — Tier Assignment (từ Dependency Map)

**Tier 0 — Critical Path** (always run — từ Logical Inversion, Shared Entity, State/Data Dependency):
- Count target: 5-15 flows *(small feature exception: ≤3 USs → 1 flow per cross-US dependency)*
- Flow naming: `"[Entity] [action chain] — [key outcome verified]"`
- VD: `"Session credit issue → booking → deduction verified"`

**Tier 1 — Full Regression** (staging/pre-prod — Happy path per US):
- Count target: 15-30 scenarios
- P1: Anchor AC (most Q6 effects) của mỗi US
- P2: Common alternates (empty state, zero state)
- KHÔNG: negative paths, boundary, concurrency → Tier 2/3

**Tier 2/3 — Deep Coverage** (major releases):
- Count target: 10-25 scenarios
- Tier 2: Conditional ACs (2 branches), role-based, state-based restrictions, common errors
- Tier 3: Boundary values, concurrency, known bugs (`[REGRESSION: TC-ID]`)

*Total target: 30-70 scenarios*

> **[DỪNG LẠI — GATE 4A]:** Trình bày tier assignment + scenario count. Chờ QA approve.

### Bước 4A.4 — Viết Regression Scenarios (sau approve)

**Output format:**
```
| ID | Tier | Priority | Scenario | Preconditions | Steps | Expected | Spec Ref |
```

**Narrative rules (BẮT BUỘC):**
- Steps: user-perspective, 1 physical action each
  ✅ "Coach clicks 'Issue Credits' on client's Sessions tab"
  ❌ "Navigate to sessions tab and click issue credits"
- Expected: observable (cái tester thấy)
  ✅ "Balance shows '4 credits total'" ❌ "Credits updated in database"
- Preconditions: specific và reproducible
  ✅ "Client has 3 PT Session credits, Coach logged in as active coach"
  ❌ "A client with credits exists"
- Tier 0 anti-pattern: Tier 0 scenario PHẢI cross US boundaries — nếu ở trong 1 US → nó là Tier 1

**Đóng gói:**
```markdown
### [REGRESSION SUITE]
[Scenarios — Tier 0 trước, Tier 1, Tier 2/3]
Run Guide: Tier 0 (30-45 min) | Tier 0+1 (2-3 giờ) | All tiers (full day)
```

---

## Phase 4B — BDD Gherkin *(Automation Candidates Only)*

*Chỉ viết Gherkin cho: tất cả Tier 0 + Tier 1 của HIGH/MEDIUM modules.*
*Tier 2/3 KHÔNG viết Gherkin (edge cases, ít giá trị automation).*

### Bước 4B.1 — Combinatorial Input Matrix

Identify biến số quyết định logic từ Tier 0 flows + HIGH-risk modules:
```
Variable 1: User Role [Coach / Admin / Client]
Variable 2: Credit status [Has credits / No credits]
→ KB1: Coach + has credits → issue succeeds
→ KB2: Coach + no credits → issue blocked
```

> **[DỪNG LẠI — GATE 4B.1]:** Xác nhận tổ hợp kịch bản đủ cover luồng quan trọng.

### Bước 4B.2 — Viết Gherkin Code (sau khi QA confirm tổ hợp)

```gherkin
Feature: [Feature name]

  Background:
    Given [common setup]

  @tier0 @P1 @automation-candidate
  Scenario: [Tier 0 flow name — entity + action chain + outcome]
    # Phase 1: [Actor]
    Given [state]
    When [action]
    Then [observable outcome]

    # Phase 2: [Cross-US transition]
    Given [state after Phase 1]
    When [next action]
    Then [outcome at this phase]

  @tier1 @P1 @automation-candidate
  Scenario Outline: [Multi-data flow]
    Given [state with <variable>]
    When [action with <input>]
    Then [<expected>]
    Examples:
    | variable | input | expected |
    | "active" | "3"   | "Credits issued" |
```

**Gherkin rules:**
- `# Phase comments` để chia phases trong Tier 0 cross-US scenarios
- Data Table nội tuyến cho structured data (file upload list, permissions)
- `Scenario Outline` + `Examples` khi ≥3 data sets
- Steps: 1 physical action each — NO "and" combining
- Annotations: `@tier0/tier1`, `@P1/P2`, `@automation-candidate`

**Đóng gói:**
```markdown
### [KỊCH BẢN BDD E2E TOÀN TRÌNH]
[Gherkin code với đầy đủ annotations]
```

> **[DỪNG LẠI — GATE 4B.2]:** Chờ QA approve Gherkin.
>
> Sau khi approve: *"Regression Suite và BDD Scenarios đã sẵn sàng. Bước tiếp theo: dùng skill `@testcase_generator` để generate detailed test cases cho từng module."*

## Strict Rules

- TUYỆT ĐỐI KHÔNG sinh Gherkin ở Bước 4B.1 (chỉ chốt tổ hợp)
- Data trong Gherkin phải thực tế và liền mạch từ đầu đến cuối
- Tier 0 PHẢI cross US boundaries — không stay trong 1 US
