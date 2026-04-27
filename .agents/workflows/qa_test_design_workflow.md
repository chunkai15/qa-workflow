---
description: Workflow sinh kịch bản kiểm thử (Test Cases) chuyên sâu — 6-tầng pipeline dựa trên Risk-Based Testing, Adaptive Deep Reading, và Dual Output (Regression Suite + BDD Gherkin).
---

---
skills:
  - requirements_analyzer
  - strategy_decomposer
  - trace_gap_analyzer
  - e2e_bdd_generator
  - testcase_generator
---

> **BẮT BUỘC:** Đọc kỹ nội dung toàn bộ 5 SKILL.md và tất cả refs/ files trước khi bắt đầu:
> 1. `.agent/skills/requirements_analyzer/SKILL.md` + `refs/domain_saas.md`
> 2. `.agent/skills/strategy_decomposer/SKILL.md` + `refs/architecture.md` + `refs/user_flow.md` + `refs/data_crud.md` + `refs/hybrid.md`
> 3. `.agent/skills/trace_gap_analyzer/SKILL.md` + `refs/adaptive_reading.md` + `refs/artifacts.md` + `refs/dependency.md`
> 4. `.agent/skills/e2e_bdd_generator/SKILL.md` + `refs/regression_logic.md` + `refs/gherkin_rules.md`
> 5. `.agent/skills/testcase_generator/SKILL.md` + `refs/writing_rules.md` + `refs/techniques.md` + `refs/quality_gates.md`

# Workflow: QA Test Design Pipeline (6-Tầng)

Pipeline tuần tự với Review Gates bắt buộc. AI KHÔNG được tự động chạy qua nhiều phases mà không có QA approval.

---

## Nguyen tac thuc thi (Strict Rules)

- **Sequential:** Tuyet doi KHONG gop cac buoc
- **Review Gates:** PHAI DUNG cho user phan hoi sau moi gate
- **Payload Management:** Ke thua payload da chot tu buoc truoc — khong tai phan tich
- **Language:** Analysis/giao tiep = Tieng Viet | TC output = English hoan toan
- **Adaptive Depth:** LOW-risk ACs = 7Q | MEDIUM = 10Q | HIGH = 12Q
- **Chunking:** TC generation theo tung module, gate sau moi module

---

## Payload Flow

```
[MASTER CONTEXT]                <- Output Buoc 1 (@requirements_analyzer)
        |
[DANH SACH MODULE]              <- Output Buoc 2 (@strategy_decomposer)
[MODULE RISK REGISTER]          <- Output Buoc 2
        |
[DEEP ANALYSIS PACKAGE]         <- Output Buoc 3 (@trace_gap_analyzer)
 . AC Type Matrix
 . DR blocks (adaptive: 7Q/10Q/12Q)
 . Dependency Map (8 relationship types)
 . Conditional Artifacts (7 loai, trigger-based)
 . RTM (Coverage Status = Uncovered)
        |
[REGRESSION SUITE]              <- Output Buoc 4 (@e2e_bdd_generator)
[BDD SCENARIOS]                 <- Output Buoc 4 (automation candidates)
        |
[FINAL TEST SUITE]              <- Output Buoc 5-6 (@testcase_generator)
 . TC tables 9-column (English)
 . RTM (all Covered)
 . Final Summary
```

---

## Review Gates Reference

| Gate | Sau buoc | QA action |
|---|---|---|
| GATE 0.5 | Feature Orientation | Verify Purpose + Flows + Actor Map |
| GATE 1a | Ambiguity Scan | Tra loi QnA — critical ambiguities phai resolve truoc |
| GATE 1b | Master Context | Approve hoac chinh sua |
| GATE 2a | Strategy proposal | Chon 1 trong 2-3 chien luoc |
| GATE 2b | Module structure draft | Approve hoac chinh sua |
| GATE 2c | Module Risk Register | Approve |
| GATE 3 | GAP Analysis | Xu ly GAPs va approve |
| GATE 4A | Regression tier assignment | Approve tier list + scenario count |
| GATE 4B.1 | Combinatorial matrix | Confirm coverage du |
| GATE 4B.2 | Gherkin code | Approve BDD scenarios |
| GATE 5 (per AC) | Inline floor check | Auto-pass hoac fix truoc khi next AC |
| GATE Module | Per module | Approve hoac adjust TCs |

---

## BUOC 1 — Phan tich Yeu cau & Dong goi Master Context
*Skill: @requirements_analyzer*
*Refs: refs/domain_saas.md (load ngay)*

1. Phase 0: Visual Asset Check (SKIP neu khong co image/Figma)
2. Phase 0.5: Feature Orientation — Purpose Statement + Business Flow List + Actor Map
   > GATE 0.5: Pass truoc khi doc bat ky AC nao
3. Phase 1a: Extract (US/AC/BR/Field specs) + Changelog apply
4. Phase 1b: Ambiguity Scan → Ambiguity List + Assumptions + Interpretations
   > [DUNG — GATE 1a]: Present QnA. Cho user tra loi. Critical ambiguities PHAI resolve truoc.
5. Phase 1c: Dong goi [MASTER CONTEXT]
   > [DUNG — GATE 1b]: Cho user approve → Sang Buoc 2.

---

## BUOC 2 — Tu van Chien luoc & Phan ra He thong
*Skill: @strategy_decomposer*
*Refs: refs/architecture.md | refs/user_flow.md | refs/data_crud.md | refs/hybrid.md*

1. Phase 2A: Risk Assessment (5-7 lines)
2. Phase 2B: De xuat 2-3 chien luoc phu hop nhat + ly do Why
   > [DUNG — GATE 2a]: Cho QA chon chien luoc
3. Phase 2C: Load ref file tuong ung, thuc thi phan ra:
   - Architecture Layers → refs/architecture.md
   - User Flow → refs/user_flow.md
   - Data CRUD → refs/data_crud.md
   - Hybrid → refs/hybrid.md
   > [DUNG — GATE 2b]: Cho QA approve ban phan ra
4. Module Risk Register: Build ngay sau khi approve
   > [DUNG — GATE 2c]: Cho QA approve Risk Register → Sang Buoc 3.

---

## BUOC 3 — Phan tich Sau & Truy vet
*Skill: @trace_gap_analyzer*
*Refs: refs/adaptive_reading.md (load ngay) + refs/dependency.md (load ngay) + refs/artifacts.md (khi HIGH-risk)*

1. Phase 3a: AC Type Classification Matrix (truoc khi bat ky Deep Reading)
   - Headline-only → LOW → 7Q | Conditional → MEDIUM → 10Q | Sub-section/Field-enum/Multi-effect/Compound → HIGH → 12Q
2. Phase 3b: Adaptive Deep Reading per AC (follow refs/adaptive_reading.md)
   - Chunking: ≤15 ACs = 1 pass | 16-40 = US-by-US | >40 = sub-groups ≤8
3. Phase 3c: Dependency Map — 8 relationship types (follow refs/dependency.md)
4. Phase 3d: 7 Conditional Artifacts (follow refs/artifacts.md khi triggered)
5. Phase 3e: GAP Analysis + RTM (follow refs/dependency.md — GAP section)
   > [DUNG — GATE 3]: Cho QA xu ly GAPs va approve [DEEP ANALYSIS PACKAGE] → Sang Buoc 4.

---

## BUOC 4 — Thiet ke Scenarios (Dual Output)
*Skill: @e2e_bdd_generator*
*Refs: refs/regression_logic.md (load ngay) + refs/gherkin_rules.md (khi Phase 4B bat dau)*

Phase 4A — Regression Suite (follow refs/regression_logic.md):
1. Flow Extraction F1/F2/F3 + State Machine Scan
2. Tier Assignment:
   - Tier 0 (5-15 flows): Logical Inversion + Shared Entity + State/Data Dependency
   - Tier 1 (15-30): Happy path per US
   - Tier 2/3 (10-25): Conditional/edge/boundary + known bugs
   > [DUNG — GATE 4A]: Cho QA approve tiers + scenario count
3. Viet Regression Scenarios (narrative style, follow narrative rules trong ref)

Phase 4B — BDD Gherkin (chi Tier 0 + HIGH/MEDIUM Tier 1, follow refs/gherkin_rules.md):
1. Combinatorial Input Matrix
   > [DUNG — GATE 4B.1]: Cho QA confirm matrix
2. Viet Gherkin code voi @tier0/1, @P1/P2, @automation-candidate
   > [DUNG — GATE 4B.2]: Cho QA approve Gherkin → Sang Buoc 5.

---

## BUOC 5 — Thiet ke Test Case Chi tiet (Chunking by Module)
*Skill: @testcase_generator*
*Refs: refs/writing_rules.md + refs/techniques.md + refs/quality_gates.md (tat ca load ngay)*

Hoi QA muon Module nao truoc. Auto-select: Module risk cao nhat tu Risk Register.

Per Module (lap den het):
1. STEP A — Module Brief (8 lines max):
   Module | Risk | Strategy | Data fixtures | 10 Rules | 15 Edge Groups | Error Guessing | Starting AC

2. STEP B — TC Generation (English, 9-column, follow refs/writing_rules.md + refs/techniques.md):
   | ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
   - SCEN TC FIRST cho HIGH/MEDIUM modules
   - 1 physical action per step, concrete data, observable expected
   - Priority: High / Medium / Low | Module-Note: [MOD_01] FUNC | Pos | optional tags

3. STEP C — Gate 5 Inline per AC (follow refs/quality_gates.md):
   Floor met? | Design? | API codes? | Condition branches? | Dependency CoveredBy? | RTM?
   > [DUNG — GATE Module]: Cho QA approve module → tiep tuc module tiep theo

---

## BUOC 6 — Final Review & Quality Check
*Built into @testcase_generator — follow refs/quality_gates.md*

1. Pre-finalization Checklist (toan bo 6 tang)
2. 9 Quality Patterns scan
3. Final output: [FINAL TEST SUITE] voi Coverage Summary + Clarification Questions + Automation Candidates

---

## DELIVERABLES CUOI CUNG

| Artifact | Mo ta |
|---|---|
| [MASTER CONTEXT] | Feature overview, risks, assumptions da phe duyet |
| [DANH SACH MODULE] + [RISK REGISTER] | Cau truc phan ra + risk level + test focus per module |
| [DEEP ANALYSIS PACKAGE] | AC Type Matrix + DR blocks + Dependency Map + 7 Artifacts + RTM |
| [REGRESSION SUITE] | 3-tier checklist (Tier 0/1/2-3) — san sang manual testing ngay |
| [BDD SCENARIOS] | Gherkin code voi annotations — san sang automation |
| [FINAL TEST SUITE] | 9-column TC tables (English) — san sang import Jira/Xray/TestRail |
