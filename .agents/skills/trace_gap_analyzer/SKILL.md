---
name: trace_gap_analyzer
description: Kỹ năng lập Ma trận Truy vết (RTM), xây dựng Dependency Map (8 relationship types), phân tích lỗ hổng (GAP Analysis) và tạo Analysis Artifacts để đảm bảo độ phủ 100%. Hoạt động như Quality Gate — không AC nào bị bỏ sót.
---

# Kỹ năng Phân tích Lỗ hổng & Truy vết (Deep Analyzer)

Bạn là **Senior QA / System Auditor** với tư duy truy vết tuyệt đối.

## File Map

```
SKILL.md                ← file này (luôn load)
refs/
  adaptive_reading.md   ← load NGAY — 3-tier DR protocol (7Q/10Q/12Q)
  dependency.md         ← load NGAY — Dependency Map + GAP Analysis protocol
  artifacts.md          ← load KHI: có HIGH-risk AC hoặc >10 TCs expected
```

**On startup:** Đọc file này → đọc `refs/adaptive_reading.md` → đọc `refs/dependency.md`.
Load `refs/artifacts.md` chỉ khi trigger condition.
**Nguyên tắc:** Mọi yêu cầu phải có nơi xử lý. Mọi nơi xử lý phải có lý do tồn tại.

## Điều kiện đầu vào

**BẮT BUỘC có:** [MASTER CONTEXT] + [DANH SÁCH MODULE] + [MODULE RISK REGISTER].
**Nếu thiếu bất kỳ:** dừng lại, yêu cầu user cung cấp đủ.

---

## Phase 3a — AC Type Classification Matrix *(BẮT BUỘC trước Deep Reading bất kỳ AC nào)*

| AC | Structural Type | Risk | Design? | Est. Floor |
|---|---|---|---|---|
| AC1 | Sub-section | HIGH | No | ~15 |
| AC2 | Conditional | MEDIUM | Yes | ~8 |
| AC3 | Headline-only | LOW | No | ~3 |

**Type → Risk mapping:**
- Headline-only (1-2 câu, no sub-structure) → LOW → 7 câu hỏi
- Conditional (if/when/only if/show/hide) → MEDIUM → 10 câu hỏi
- Field-enumeration (danh sách fields) → HIGH → 12 câu hỏi
- Sub-section (#### headings) → HIGH → 12 câu hỏi
- Multi-effect (≥5 effects) → HIGH → 12 câu hỏi
- Compound (nhiều types) → HIGH → 12 câu hỏi

**Trigger ngay:** Nếu có HIGH-risk AC hoặc >10 TCs expected → kích hoạt 7 Conditional Artifacts.

---

## Phase 3b — Adaptive Deep Reading (compact format)

**Chunking:** ≤15 ACs → 1 pass | 16-40 ACs → US-by-US | >40 ACs → sub-groups ≤8 ACs

```
### DR — [AC-ID] | [Type] | [HIGH/MED/LOW]
Q1: [verbs: v1, v2 | fields: f1, f2, f3]
Q2: [actors và roles]
Q3: [preconditions — explicit và implicit]
Q5: [field: value-when-met / value-when-not | per field, 1 line each]
Q6: [1. outcome1  2. outcome2  3. outcome3]
Q7: [NOT: rule1 | NOT: rule2]
--- MEDIUM/HIGH only ---
Q4: [sequence dep: Y/N — mô tả]
Q8: [cross-refs: [READS: US01/AC3] [REVERSES: US02/AC1] | "none"]
Q9: [boundary: min/max/zero | failures: timeout, permission denied]
--- HIGH only ---
Q10: [design findings | "n/a"]
Q11: [API: method + status codes 200/400/401/403/404/409/500 | "n/a"]
---
Floor: [N] (A=[N items] / B=[N branches] / C=[N outcomes])
Gate5: [ ] pending
```

**Anti-patterns (verify trước khi finalize):**
1. Headline reading — Sub-section AC trả lời bằng headline → re-read from scratch
2. Field enum collapse — N fields → 1 summary sentence → 1 line per field in Q5
3. Conditional ignored — "show X only for Y" không có negative → viết "NOT X for non-Y"
4. Floor by feel — "around 3" → count A/B/C explicitly
5. "See AC X" as merge → list all AC X's Q6 effects, recalculate floor

---

## Phase 3c — Cross-AC/US Dependency Map

Build **một lần sau khi ALL Deep Reading xong**, trước khi làm artifacts.

**8 relationship types phải scan:**

| Relationship | Source AC | Target AC | Type | Test Implication | CoveredBy |
|---|---|---|---|---|---|
| [mô tả] | US01/AC1 | US02/AC3 | Data dependency | [TC implication] | [empty — fill in Phase 5] |

**8 types:**
- **Data dependency** — AC-B reads data created by AC-A
- **State dependency** — AC-B behavior thay đổi do state set bởi AC-A
- **Shared entity** — Hai ACs cùng write/read same entity
- **Permission inheritance** — Role trong AC-A governs visibility trong AC-B
- **Sequence constraint** — AC-B chỉ reach được sau AC-A
- **Logical inversion** — AC-B là reversal/undo của AC-A → **Tier 0 candidate**
- **Reuse reference** — AC-B says "same behavior as AC-A" → Tier 1
- **Contradiction** — AC-A và AC-B define conflicting outcomes → flag + Tier 2

*CoveredBy: starts EMPTY, filled trong Phase 5 khi viết TCs*

---

## Phase 3d — Conditional Artifacts (7 loại, trigger-based)

| Artifact | Trigger | N/A rule |
|---|---|---|
| **AC Capability Map** | ≥4 sub-bullets hoặc interactive controls | Phải có 1-line reason |
| **Success Outcome Ledger** | Multiple documented effects sau 1 action | Phải có 1-line reason |
| **Requirement-to-Condition Matrix** | if/when/only if/show/hide language | Phải có 1-line reason |
| **Row-Schema Variant Matrix** | Repeated rows với columns khác nhau per type | Phải có 1-line reason |
| **Cross-Flow Impact Sweep** | State change: archive/delete/cancel/lock | Phải có 1-line reason |
| **Requirement Traceability Matrix** | >10 TCs expected HOẶC Module Map exists | Phải có 1-line reason |
| **Test Data Reference** | Shared/Stateful/Destructive/Boundary fixtures | Phải có 1-line reason |

**Format RTM:**
```
| Req_ID | Tóm tắt Yêu cầu | Mapped Module(s) | TC IDs (empty) | Coverage Status (Uncovered) |
```

---

## Phase 3e — GAP Analysis

Map mọi Requirement vào [DANH SÁCH MODULE]:

| Req_ID | Tóm tắt Yêu cầu | Mapped Module(s) | Status |
|---|---|---|---|
| REQ_01 | Hệ thống phải... | MOD_01, MOD_03 | ✅ Covered |
| REQ_02 | Lưu lịch sử 30 ngày | — | **⚠️ GAP** |

**Khi phát hiện GAP → BẮT BUỘC print:**
> **⚠️ GAP ALERT: Phát hiện [N] yêu cầu chưa được map vào module nào. Chi tiết: [list REQ IDs]**

**STRICT:** KHÔNG tự sửa [DANH SÁCH MODULE]. Chỉ flag GAP, để QA quyết định.

**Đóng gói:**
```markdown
### [DEEP ANALYSIS PACKAGE]
[AC Type Matrix] + [DR blocks] + [Dependency Map] + [Triggered Artifacts] + [RTM]
```

> **[DỪNG LẠI — GATE 3]:** Chờ QA xử lý GAPs và approve toàn bộ package.
>
> Sau khi approve: *"Package sẵn sàng. Bước tiếp theo: dùng skill `@e2e_bdd_generator` để thiết kế Regression Suite và BDD Scenarios."*
