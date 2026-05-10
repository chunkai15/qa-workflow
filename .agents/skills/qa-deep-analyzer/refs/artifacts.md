# Analysis Artifacts

> Load when: any HIGH-risk AC OR >10 TCs expected.
> Contains format specs for 7 conditional artifacts.

---

## When to build each artifact

| Artifact | Build when | Trigger words in spec |
|---|---|---|
| **AC Capability Map** | ≥4 sub-bullets or interactive controls or multiple UI outcomes | button, link, icon, tab, expand, sticky, load more, hover |
| **Success Outcome Ledger** | Success path has multiple documented effects | modal close + toast + refresh + history row + notification |
| **Requirement-to-Condition Matrix** | AC has conditional language | `if`, `when`, `only if`, `otherwise`, `enabled/disabled`, `show/hide`, `blocked/allowed` |
| **Row-Schema Variant Matrix** | Repeated table/list with columns varying by row type | activity rows, event types (Issued/Used/Returned/Voided), `+amount/-amount/--`, icon states |
| **Cross-Flow Impact Sweep** | AC has a state change | archive, delete, cancel, forfeit, disable, lock, active-to-inactive |
| **Requirement Traceability Matrix** | >10 TCs expected OR Module Map exists | — |
| **Test Data Reference** | Stateful data, shared fixtures, destructive ops, boundary values | balance changes, fixtures used by ≥3 TCs, delete/archive ops |

---

## AC Capability Map
`| Control/element | Trigger | Immediate result | Follow-up state | Disposition |`

- `Disposition`: `covered` / `merged` / `excluded (reason)`
- Every interactive control from Q1 must appear or be explicitly excluded
- Do not compress multiple distinct behaviors into 1 headline case

---

## Success Outcome Ledger
`| Triggering action | Observable result | Target surface | Disposition |`

- `Target surface`: modal, list, balance, activity log, notification, overview card...
- Effects occurring simultaneously in same execution → mergeable
- Effects requiring different preconditions → not mergeable

---

## Requirement-to-Condition Matrix
`| Direct assertion | Condition/branch | Observable outcome | Downstream effect | Disposition |`

- Each `if / when / show / hide / enable / disable` = at least 2 rows (condition met + not met)
- Conditional AC must not be collapsed into 1 happy-path case unless matrix proves only 1 branch exists

---

## Row-Schema Variant Matrix
`| Row discriminator | Varying column/cell | Documented output | Disposition | Source conflict |`

- `Row discriminator`: action type, status, row subtype (e.g., Issued, Used, Voided)
- Do not use 1 aggregate "table row is correct" case when row schema varies by type

---

## Cross-Flow Impact Sweep

For each entity undergoing a state-change, document:
- **Preserved:** what data/state survives the change
- **Blocked:** what actions are no longer possible after the change
- **Still allowed:** what cleanup actions are still available
- **Downstream UI:** badges, disabled buttons, warning boxes on subsequent screens
- **Audit trail:** what events/messages are triggered

If no downstream effects: explicitly state "No downstream effects documented for this state change."

---

## Requirement Traceability Matrix (RTM)
`| Req ID | Requirement summary | Priority | TC IDs | Coverage status |`

- `TC IDs`: **starts EMPTY** in Phase 3 — filled in Phase 5 when writing TCs
- `Coverage status`: starts as "Uncovered" → update to "✓ Covered" when TC IDs filled → "✗ Gap" if Phase 5 ends with no TC

---

## Test Data Reference

Build when: stateful data (balance, counters, lifecycle states), fixtures shared across ≥3 TCs, destructive operations, boundary values needing precise documentation.

`| DataID | Category | Description | Key values | Setup order | Used by TCs | Notes |`

**DataID format:** TD-001, TD-002...
**Setup order:** integer (lower = must create first; same number = parallel OK)
**Categories:** User / Session / Transaction / State / Boundary / Destructive / Per-role

**Decision rule — inline vs sheet:**
- **Inline** (in TC's Test Data column): ≤4 simple values, not shared, no setup order. `email = test@everfit.io, role = coach`
- **Sheet** (Test Data Reference): ≥5 values OR shared by ≥3 TCs OR setup dependency OR destructive OR boundary-critical
