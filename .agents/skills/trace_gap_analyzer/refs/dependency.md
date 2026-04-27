# Dependency Map & GAP Analysis Protocol

> Luôn load khi qa_deep_analyzer khởi động.
> Hai phần: (1) Cross-AC/US Dependency Map, (2) GAP Analysis + RTM.

---

## Part 1: Cross-AC/US Dependency Map

Build **một lần** sau khi hoàn thành ALL Deep Reading, TRƯỚC khi làm artifacts.

**Lý do tồn tại:** Spec được viết US-by-US, nhưng feature được trải nghiệm end-to-end. Actions ở US-02 AC3 có thể depend on data từ US-01 AC1. Không có dependency map → systematically miss cross-flow test cases.

### 8 Relationship Types (scan tất cả)

| Type | Mô tả | Ví dụ |
|---|---|---|
| **Data dependency** | AC-B reads data created/modified by AC-A | Credits issued in US4 → balance displayed in US2 |
| **State dependency** | AC-B behavior thay đổi do state set bởi AC-A | Subscription cancelled in US1 → feature locked in US3 |
| **Shared entity** | Hai ACs cùng thao tác trên same entity | US2 AC1 và US4 AC3 đều write to Credits table |
| **Permission inheritance** | Role defined in AC-A governs visibility in AC-B | Admin role in US1 AC2 governs report access in US5 AC1 |
| **Sequence constraint** | AC-B chỉ reachable sau AC-A | Checkout only after cart has items |
| **Logical inversion** | AC-B là failure/reversal của AC-A | Credit issue (US2) reversed by credit void (US6) |
| **Reuse reference** | AC-B says "same behavior as AC-A" | "Same notification behavior as AC-X" |
| **Contradiction** | AC-A và AC-B define conflicting outcomes | Two ACs define different default state for same field |

### Output Format

```
| Relationship | Source AC | Target AC | Type | Test Implication | CoveredBy |
|---|---|---|---|---|---|
| Credit balance updated here... | US04/AC8 | US02/AC4 | Data dependency | TC: issue credits → verify balance display | [empty — fill in Phase 5] |
| Archive blocks issuance | US01/AC7 | US04/AC1 | State dependency | TC: archive subscription → attempt credit issue | [empty] |
```

**CoveredBy column:**
- Starts **EMPTY** khi map được build
- Filled trong **Phase 5** khi viết TC: add TC ID
- Sau Phase 5: mọi row phải có TC ID, hoặc "Covered via precondition in TC-XX", hoặc "No standalone case — [reason]"
- Empty row sau Phase 5 = coverage gap → add to Risks from Ambiguity

**Test implications từ mỗi dependency row:**
- Viết TC exercise relationship end-to-end, HOẶC
- Ghi precondition note trong existing TC ("Preconditions: subscription was archived via US-01 AC7"), HOẶC
- Add to Risks from Ambiguity nếu ambiguous/underdocumented

---

## Part 2: GAP Analysis + Traceability

### Requirement Traceability Matrix (RTM) — build sau Dependency Map

Map mọi Requirement từ [MASTER CONTEXT] + spec vào [DANH SÁCH MODULE]:

```
| Req_ID | Tóm tắt Yêu cầu | Mapped Module(s) | Gap Analysis |
|---|---|---|---|
| REQ_01 | Hệ thống phải đọc được CCCD | MOD_UI_01, MOD_BIZ_01 | ✅ Covered |
| REQ_02 | Lưu lịch sử lỗi 30 ngày | — | ⚠️ GAP |
```

### GAP Alert (BẮT BUỘC khi phát hiện)

Nếu bất kỳ Requirement nào có status GAP HOẶC Module nào không serve bất kỳ Requirement nào:

```
⚠️ GAP ALERT: Phát hiện [N] yêu cầu chưa được hệ thống hóa:
- REQ_02: "Lưu lịch sử lỗi 30 ngày" — chưa có module nào xử lý
- REQ_05: "Export PDF report" — chưa có module nào xử lý
Vui lòng quyết định: (a) thêm module mới, hoặc (b) confirm là out of scope
```

**Strict rule:** KHÔNG tự sửa [DANH SÁCH MODULE]. Chỉ flag GAP, để QA quyết định.

### Gate 3 Checklist

```
✓/✗ Mọi US có DR block với appropriate Q depth
✓/✗ Dependency Map: 8 types đã được scan
✓/✗ Mọi "same as AC X" reference có reuse row trong Dependency Map
✓/✗ Mọi row có Test Implication hoặc "No implication — [reason]"
✓/✗ CoveredBy column present và starts empty
✓/✗ RTM: mọi Requirement được mapped hoặc flagged GAP
✓/✗ GAP ALERT printed nếu có gaps
```
