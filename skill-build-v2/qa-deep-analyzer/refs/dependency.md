# Dependency Map & GAP Analysis Protocol

> Always load when qa_deep_analyzer starts.
> v3: Impact Alert Rule added (MANDATORY vs RECOMMENDED TCs). TC Required? column added.

---

## Part 1: Cross-AC/US Dependency Map

Build **once** after completing ALL DR blocks + Data Prerequisite Cards, BEFORE conditional artifacts.

**Reason it exists:** Specs are written US-by-US, but features are experienced end-to-end. Actions in US-02 AC3 may depend on data from US-01 AC1. Without a dependency map → systematically missing cross-flow test cases.

---

### 8 Relationship Types (scan all)

| Type | Description | Example |
|---|---|---|
| **Data dependency** | AC-B reads data created/modified by AC-A | Credits issued in US4 → balance displayed in US2 |
| **State dependency** | AC-B behavior changes due to state set by AC-A | Subscription cancelled in US1 → feature locked in US3 |
| **Shared entity** | Two ACs operate on the same entity (write-write) | US2 AC1 and US4 AC3 both write to Credits table |
| **Permission inheritance** | Role defined in AC-A governs visibility in AC-B | Admin role in US1 AC2 governs report access in US5 AC1 |
| **Sequence constraint** | AC-B only reachable after AC-A | Checkout only after cart has items |
| **Logical inversion** | AC-B is the failure/reversal of AC-A | Credit issue (US2) reversed by credit void (US6) |
| **Reuse reference** | AC-B says "same behavior as AC-A" | "Same notification behavior as AC-X" |
| **Contradiction** | AC-A and AC-B define conflicting outcomes | Two ACs define different default state for same field |

---

### ⚠️ Impact Alert Rule — TC Required?

```
For these relationship types → TC is MANDATORY:
  ✓ Data dependency
  ✓ State dependency
  ✓ Logical inversion
  ✓ Shared entity (write-write conflict)
  → Write as: [MANDATORY TC: describe cross-flow scenario]
  → L5 MUST write a TC exercising this relationship end-to-end

For these relationship types → TC is RECOMMENDED:
  ○ Permission inheritance
  ○ Reuse reference
  ○ Contradiction (flag + note)
  ○ Sequence constraint (can be covered via precondition)
  → Document rationale if skipped
```

---

### Output Format

```
| Relationship | Source AC | Target AC | Type | Test Implication | TC Required? | CoveredBy |
|---|---|---|---|---|---|---|
| Credits issued → balance display | US04/AC3 | US02/AC1 | Data dependency | [MANDATORY TC: issue credits → verify balance updates immediately] | YES | [empty → L5 fills] |
| Archive blocks issuance | US01/AC7 | US04/AC1 | State dependency | [MANDATORY TC: archive subscription → attempt credit issue → verify blocked] | YES | [empty → L5 fills] |
| Permission from Studio Admin | US01/AC2 | US05/AC1 | Permission inheritance | [RECOMMENDED: verify report access reflects Studio Admin role] | RECOMMENDED | [empty → L5 fills] |
| Credit void reverses issuance | US02/AC1 | US06/AC3 | Logical inversion | [MANDATORY TC: issue → void → verify balance rollback + history] | YES | [empty → L5 fills] |
```

**CoveredBy column:**
- Starts **EMPTY** when map is built
- Filled in **L5** when writing TCs: add TC ID
- After L5: every row must have TC ID, or "Covered via precondition in TC-XX", or "No standalone case — [reason]"
- MANDATORY TC row with empty CoveredBy after L5 = **coverage gap**

**Test implications from each dependency row:**
- Write TC exercising relationship end-to-end (MANDATORY rows), OR
- Note as precondition in existing TC (RECOMMENDED rows), OR
- Add to Risks from Ambiguity if underdocumented

---

## Part 2: GAP Analysis + Traceability

### Requirement Traceability Matrix (RTM)

Map every Requirement into [MODULE LIST]:

```
| Req_ID | US | AC | Module | Technique | Min_TCs | Actual_TCs | Status |
|---|---|---|---|---|---|---|---|
| REQ-001 | US01 | AC1 | MOD_01 | DT+ST | 12 | — | UNCOVERED |
| REQ-002 | US01 | AC2 | MOD_01 | BVA | 5 | — | UNCOVERED |
| REQ-003 | — | — | — | — | — | — | ⚠️ GAP |
```

- `Min_TCs` = FINAL Floor from DR block
- `Actual_TCs` starts empty → L5 fills when writing TCs
- `Status`: UNCOVERED → "✓ Covered" (when Actual ≥ Min) → "✗ Gap" (if L5 ends with 0 TCs)

### GAP Alert (REQUIRED when detected)

```
⚠️ GAP ALERT: Found [N] requirements not mapped to any module:
- REQ-003: "Store error history for 30 days" — no module handles this
- REQ-007: "Export PDF report" — no module handles this
→ Decide: (a) add new module, or (b) confirm as out of scope
```

**Strict rule:** DO NOT modify [MODULE LIST] unilaterally. Only flag GAPs — let QA decide.

---

## Gate 3a — Self-Review Checklist (runs BEFORE Gate 3b)

```
Dependency Map:
  [ ] All 8 relationship types scanned
  [ ] Every "same as AC X" reference → Reuse reference row in map
  [ ] Every row has Test Implication (not empty)
  [ ] TC Required? column filled (YES / RECOMMENDED) for every row
  [ ] CoveredBy column present and empty (ready for L5)
  [ ] All MANDATORY TC rows have [MANDATORY TC: scenario description]

RTM:
  [ ] Every AC has Min_TCs populated
  [ ] Every Requirement mapped OR flagged as GAP
  [ ] GAP ALERT printed if any gaps exist
  [ ] Actual_TCs column empty (ready for L5)

Data:
  [ ] Data Prerequisite Card built per module
  [ ] State conflicts documented
  [ ] DataID registry populated
```

---

## Gate 3b — User Approval Checklist (displayed to Khai)

```
✓/✗ Every US has DR block with appropriate Q depth (7Q/10Q/12Q)
✓/✗ Every AC has BU block (4 fields)
✓/✗ Every AC has Q6 O-list + N-list
✓/✗ Every AC has Q-DATA with DataIDs
✓/✗ Dependency Map: all 8 types scanned, TC Required? filled
✓/✗ Data Prerequisite Cards: one per module, conflicts documented
✓/✗ All assigned technique artifacts BUILT (not labeled)
✓/✗ RTM: Min_TCs populated, zero empty rows
✓/✗ GAP ALERT printed if gaps exist
```
