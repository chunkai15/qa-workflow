# Analysis Artifacts

> Load khi: có HIGH-risk AC HOẶC >10 TCs expected.
> Contains format specs cho 7 conditional artifacts.

---

## Khi nào build mỗi artifact

| Artifact | Build khi | Trigger words trong spec |
|---|---|---|
| **AC Capability Map** | ≥4 sub-bullets hoặc interactive controls hoặc multiple UI outcomes | button, link, icon, tab, expand, sticky, load more, hover |
| **Success Outcome Ledger** | Success path có multiple documented effects | modal close + toast + refresh + history row + notification |
| **Requirement-to-Condition Matrix** | AC có conditional language | `if`, `when`, `only if`, `otherwise`, `enabled/disabled`, `show/hide`, `blocked/allowed` |
| **Row-Schema Variant Matrix** | Repeated table/list với columns vary by row type | activity rows, event types (Issued/Used/Returned/Voided), `+amount/-amount/--`, icon states |
| **Cross-Flow Impact Sweep** | AC có state change | archive, delete, cancel, forfeit, disable, lock, active-to-inactive |
| **Requirement Traceability Matrix** | >10 TCs expected HOẶC Module Map exists | — |
| **Test Data Reference** | Stateful data, shared fixtures, destructive ops, boundary values | balance changes, fixtures used by ≥3 TCs, delete/archive ops |

---

## AC Capability Map
`| Control/element | Trigger | Immediate result | Follow-up state | Disposition |`

- `Disposition`: `covered` / `merged` / `excluded (reason)`
- Mọi interactive control từ Q1 phải appear hoặc được explicitly excluded
- Không compress multiple distinct behaviors vào 1 headline case

---

## Success Outcome Ledger
`| Triggering action | Observable result | Target surface | Disposition |`

- `Target surface`: modal, list, balance, activity log, notification, overview card...
- Effects xảy ra cùng lúc trong same execution → mergeable
- Effects cần different preconditions → không mergeable

---

## Requirement-to-Condition Matrix
`| Direct assertion | Condition/branch | Observable outcome | Downstream effect | Disposition |`

- Mỗi `if / when / show / hide / enable / disable` = ít nhất 2 rows (condition met + not met)
- Conditional AC không được collapse thành 1 happy-path case trừ khi matrix chứng minh chỉ có 1 branch

---

## Row-Schema Variant Matrix
`| Row discriminator | Varying column/cell | Documented output | Disposition | Source conflict |`

- `Row discriminator`: action type, status, row subtype (VD: Issued, Used, Voided)
- Không dùng 1 aggregate "table row is correct" case khi row schema thay đổi theo type

---

## Cross-Flow Impact Sweep

Với mỗi entity bị state-change, document:
- **Preserved:** data/state nào survive qua change
- **Blocked:** action nào không còn possible sau change
- **Still allowed:** cleanup actions nào vẫn available
- **Downstream UI:** badges, disabled buttons, warning boxes ở screens sau
- **Audit trail:** events/messages nào được triggered

Nếu không có downstream effects: ghi rõ "No downstream effects documented for this state change."

---

## Requirement Traceability Matrix (RTM)
`| Req ID | Requirement summary | Priority | TC IDs | Coverage status |`

- `TC IDs`: **bắt đầu EMPTY** ở Phase 3 — được fill trong Phase 5 khi viết TCs
- `Coverage status`: bắt đầu là "Uncovered" → update thành "✓ Covered" khi TC IDs filled → "✗ Gap" nếu Phase 5 kết thúc mà không có TC

---

## Test Data Reference

Build khi: stateful data (balance, counters, lifecycle states), fixtures shared across ≥3 TCs, destructive operations, boundary values cần document chính xác.

`| DataID | Category | Description | Key values | Setup order | Used by TCs | Notes |`

**DataID format:** TD-001, TD-002...
**Setup order:** integer (lower = must create first; same number = parallel OK)
**Categories:** User / Session / Transaction / State / Boundary / Destructive / Per-role

**Decision rule — inline vs sheet:**
- **Inline** (trong TC's Test Data column): ≤4 simple values, not shared, no setup order. `email = test@everfit.io, role = coach`
- **Sheet** (Test Data Reference): ≥5 values OR shared by ≥3 TCs OR setup dependency OR destructive OR boundary-critical
