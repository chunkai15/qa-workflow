# Phase 3 — Analysis Artifact Formats

> Load this file when: any HIGH-risk AC exists in the AC Type Classification Matrix.
> Contains format specs for all 5 artifact types built in Phase 3.

---

## When to Build Each Artifact

| Artifact | Build when | Trigger words |
|---|---|---|
| AC Capability Map | 4+ sub-bullets, or any interactive control, or multiple UI outcomes after one action | button, link, icon, tab, arrow, hover, `Show all`, `skeleton`, `load more`, `expand`, `sticky` |
| Success Outcome Ledger | Success path produces multiple documented effects | modal close + toast + refresh + history row + notification |
| Requirement-to-Condition Matrix | AC contains conditional language | `if`, `when`, `only if`, `otherwise`, `enabled/disabled`, `show/hide`, `blocked/allowed`, `preserved`, `still allowed` |
| Row-Schema Variant Matrix | Repeated table/list where columns differ by row type | activity rows, event types (Issued/Used/Returned/Voided/Deleted), `+amount/-amount/--`, icon states |
| Cross-Flow Impact Sweep | AC performs a state change | archive, delete, cancel, forfeit, disable, lock, active-to-inactive |

An artifact marked N/A requires a one-line source-grounded reason. `"N/A"` alone is not sufficient.

---

## AC Capability Map

```
| Control/element | Trigger | Immediate result | Follow-up state | Disposition |
```

- `Disposition`: `covered` / `merged` / `excluded (reason)`
- Separate from branching analysis — an AC can be interaction-heavy without business logic branches
- Every interactive control from the AC's Q1 list must appear as a row or be explicitly excluded

---

## Success Outcome Ledger

```
| Triggering action | Observable result | Target surface | Disposition |
```

- `Target surface`: modal, list, balance, activity log, notification, overview, etc.
- One generic "success" case is not sufficient when multiple effects are documented
- Effects that always appear together in same execution → mergeable
- Effects requiring different preconditions → not mergeable

---

## Requirement-to-Condition Matrix

```
| Direct assertion | Condition/branch | Observable outcome | Downstream effect | Disposition |
```

- Every `if / when / show / hide / enable / disable` = at least 2 rows (condition met + condition not met)
- Do not let a conditional AC collapse to one happy-path case unless matrix proves only one branch exists

---

## Row-Schema Variant Matrix

```
| Row discriminator | Varying column/cell | Documented output | Disposition | Source conflict |
```

- `Row discriminator`: action type, status, or row subtype (e.g., Issued, Used, Voided)
- `Source conflict`: flag if another source defines the same variant differently
- Do not use one aggregate "table row is correct" case when row schema itself varies

---

## Cross-Flow Impact Sweep

For each state-changed entity, document:
- **Preserved**: what data/state survives the change
- **Blocked**: what becomes impossible after the change
- **Still allowed**: what cleanup actions remain available
- **Downstream UI**: archived badges, disabled buttons, warning boxes in later screens
- **Activity log / notification**: any events or messages triggered by the state change

If nothing downstream is documented → say so explicitly: "No downstream effects documented for this state change."
