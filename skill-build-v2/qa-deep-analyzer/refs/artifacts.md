# Analysis Artifacts

> Load when: any HIGH-risk AC OR >10 TCs expected.
> v3: Artifact BUILD Mandate added. Data Prerequisite Card format added.

---

## ⚠️ Artifact BUILD Mandate *(applies to ALL assigned techniques)*

```
Rule: If L2 Technique Assignment Map assigns a technique → L3 MUST output the ACTUAL
      artifact in the DR block BEFORE moving to the next AC.

Build check per AC:
  ✗ "Decision Table: Y" written as text only → FAIL — build actual table now
  ✓ DT assigned → Full combination matrix EXISTS (all condition × outcome rows)
  ✓ ST assigned → State × Event table EXISTS (From | Event | To | Valid? | TC_needed)
  ✓ BVA assigned → Boundary List EXISTS (Field | Min | Min-1 | Max | Max+1 | Notes)
  ✓ EG assigned → H1-H5 Verdict List EXISTS (applicable + TC slot / not-applicable + reason)

Artifact TC column: starts EMPTY in L3. Filled in L5.
Format:
  [ARTIFACT: Decision Table — AC5]
  | Cond A | Cond B | Outcome | TC ID |
  | Y      | Y      | Fee=5%  | [empty → L5 fills] |
  | Y      | N      | No fee  | [empty → L5 fills] |
  | N      | any    | No fee  | [empty → L5 fills] |
```

---

## When to Build Each Artifact

| Artifact | Build when | Trigger signals in spec |
|---|---|---|
| **AC Capability Map** | ≥4 sub-bullets or interactive controls | button, link, icon, tab, expand, hover |
| **Success Outcome Ledger** | Success path has multiple documented effects | modal close + toast + history row + notification |
| **Requirement-to-Condition Matrix** | AC has conditional language | `if`, `when`, `only if`, `show/hide`, `enabled/disabled`, `blocked/allowed` |
| **Row-Schema Variant Matrix** | Repeated table/list with columns varying by row type | activity rows, event types, `+amount/-amount` |
| **Cross-Flow Impact Sweep** | AC has state change | archive, delete, cancel, forfeit, lock, disable |
| **Requirement Traceability Matrix** | Always — with Min_TCs column | — |
| **Test Data Reference** | Any SHARED/DESTRUCTIVE/BOUNDARY DataIDs | balance changes, shared fixtures, delete/archive ops |

---

## Technique Artifacts — Build Format

### Decision Table

**Trigger:** ≥2 independent conditions affecting same outcome.

```
[ARTIFACT: Decision Table — AC-ID]
| Condition A | Condition B | Condition C | Expected Outcome | TC ID |
|---|---|---|---|---|
| Y | Y | Y | Outcome X | [empty] |
| Y | Y | N | Outcome Y | [empty] |
| Y | N | any | Outcome Z | [empty] |
| N | any | any | Outcome W | [empty] |
```

**Derivation:** Each distinct-outcome row → ≥1 TC. Identical-outcome rows → share 1 TC (note merged). Excluded combos → written reason ("impossible — Core platform never has discount").

---

### State Transition Table

**Trigger:** AC involves entity with lifecycle states.

```
[ARTIFACT: State Transition — AC-ID]
| From State | Event / Trigger | To State | Valid? | TC ID |
|---|---|---|---|---|
| active | cancel action | cancelled | ✓ | [empty] |
| cancelled | re-activate | active | ✓ | [empty] |
| cancelled | issue credit | [blocked] | ✗ (invalid) | [empty] |
| expired | any action | [blocked] | ✗ (invalid) | [empty] |
```

**Derivation:** Valid transition → ≥1 positive TC. Invalid transition → ≥1 negative TC (expected: error/block). Every row = ≥1 TC or explicit "No TC — [reason]".

---

### BVA Boundary List

**Trigger:** Numeric/currency/% field with limits.

```
[ARTIFACT: BVA Boundary List — AC-ID]
| Field | Min | Min-1 | Max | Max+1 | Exact limit | Notes |
|---|---|---|---|---|---|---|
| Credits qty | 1 | 0 (→ error) | 100 | 101 (→ error) | — | 0 and 101 = validation fail |
| Fee % | 0% | N/A | 100% | N/A | 5% (fixed) | Fixed rate, not user-input |
| Decimal places | 2dp | 3dp raw | 2dp | 3dp raw | tie at .5 | 3rd dp drives rounding |
```

**Derivation:** Each boundary point → ≥1 TC. Ground-truth data tables (e.g., rounding spec table) → each row = 1 TC.

---

### EG H1-H5 Verdict List

**Trigger:** Tier 3 ACs or HIGH-risk modules.

```
[ARTIFACT: Error Guessing — AC-ID]
H1 — API integration (timeout, duplicate, malformed response):
  → Applicable: Stripe charge — double-submit idempotency → TC slot [empty]
  → Applicable: webhook arrives twice → TC slot [empty]

H2 — Async / eventual consistency (success reported, side-effect not propagated):
  → Applicable: payment success shown but webhook hasn't updated balance → TC slot [empty]

H3 — Permission at record level (correct role, wrong record):
  → Applicable: Coach calling credit API for another coach's client → TC slot [empty]

H4 — Concurrent modification (two users, same entity, same time):
  → Not applicable: credit is write-once per purchase — no concurrent write risk

H5 — Stateful flow rollback (step N fails, steps 1..N-1 left partial):
  → Applicable: checkout step 2 fails — is promo + fee rolled back? → TC slot [empty]
```

**Rule:** Each applicable heuristic → ≥1 TC (include TC slot). Each not-applicable → explicit reason. "H4: N/A" alone rejected.

---

## Conditional Analysis Artifacts

### AC Capability Map
`| Control/element | Trigger | Immediate result | Follow-up state | Disposition |`
- `Disposition`: `covered` / `merged` / `excluded (reason)`

### Success Outcome Ledger
`| Triggering action | Observable result | Target surface | Disposition |`
- Effects in same execution → mergeable. Different preconditions → not mergeable.

### Requirement-to-Condition Matrix
`| Direct assertion | Condition/branch | Observable outcome | Downstream effect | Disposition |`
- Each `if/when/show/hide/enable/disable` = ≥2 rows (condition met + not met)

### Row-Schema Variant Matrix
`| Row discriminator | Varying column/cell | Documented output | Disposition | Source conflict |`
- Row discriminator: action type, status, row subtype (Issued, Used, Voided)

### Cross-Flow Impact Sweep
For each entity undergoing state-change, document:
- **Preserved:** what data/state survives
- **Blocked:** what actions no longer possible
- **Still allowed:** cleanup actions
- **Downstream UI:** badges, disabled buttons, warning boxes
- **Audit trail:** events/messages triggered

### Requirement Traceability Matrix (RTM)
`| Req ID | Requirement summary | Technique | Min_TCs | Actual_TCs | Coverage status |`
- `Min_TCs`: FINAL Floor from DR block
- `Actual_TCs`: starts empty → L5 fills → "✓ Covered" / "✗ Gap"

### Test Data Reference
`| DataID | Category | Description | Key values | Setup order | Used by TCs | Notes |`
- Import DataIDs from Data Prerequisite Card — do NOT create new ones here
- Categories: SHARED / DESTRUCTIVE / BOUNDARY / PER-ROLE / STATEFUL
