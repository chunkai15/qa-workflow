# Dependency Map & GAP Analysis Protocol

> Always load when qa_deep_analyzer starts.
> Two parts: (1) Cross-AC/US Dependency Map, (2) GAP Analysis + RTM.

---

## Part 1: Cross-AC/US Dependency Map

Build **once** after completing ALL Deep Reading, BEFORE making artifacts.

**Reason it exists:** Specs are written US-by-US, but features are experienced end-to-end. Actions in US-02 AC3 may depend on data from US-01 AC1. Without a dependency map → systematically missing cross-flow test cases.

### 8 Relationship Types (scan all)

| Type | Description | Example |
|---|---|---|
| **Data dependency** | AC-B reads data created/modified by AC-A | Credits issued in US4 → balance displayed in US2 |
| **State dependency** | AC-B behavior changes due to state set by AC-A | Subscription cancelled in US1 → feature locked in US3 |
| **Shared entity** | Two ACs operate on the same entity | US2 AC1 and US4 AC3 both write to Credits table |
| **Permission inheritance** | Role defined in AC-A governs visibility in AC-B | Admin role in US1 AC2 governs report access in US5 AC1 |
| **Sequence constraint** | AC-B is only reachable after AC-A | Checkout only after cart has items |
| **Logical inversion** | AC-B is the failure/reversal of AC-A | Credit issue (US2) reversed by credit void (US6) |
| **Reuse reference** | AC-B says "same behavior as AC-A" | "Same notification behavior as AC-X" |
| **Contradiction** | AC-A and AC-B define conflicting outcomes | Two ACs define different default state for same field |

### Output Format

```
| Relationship | Source AC | Target AC | Type | Test Implication | CoveredBy |
|---|---|---|---|---|---|
| Credit balance updated here... | US04/AC8 | US02/AC4 | Data dependency | TC: issue credits → verify balance display | [empty — fill in Phase 5] |
| Archive blocks issuance | US01/AC7 | US04/AC1 | State dependency | TC: archive subscription → attempt credit issue | [empty] |
```

**CoveredBy column:**
- Starts **EMPTY** when map is built
- Filled in **Phase 5** when writing TCs: add TC ID
- After Phase 5: every row must have a TC ID, or "Covered via precondition in TC-XX", or "No standalone case — [reason]"
- Empty row after Phase 5 = coverage gap → add to Risks from Ambiguity

**Test implications from each dependency row:**
- Write a TC exercising the relationship end-to-end, OR
- Note a precondition in an existing TC ("Preconditions: subscription was archived via US-01 AC7"), OR
- Add to Risks from Ambiguity if ambiguous/underdocumented

---

## Part 2: GAP Analysis + Traceability

### Requirement Traceability Matrix (RTM) — build after Dependency Map

Map every Requirement from [MASTER CONTEXT] + spec into [MODULE LIST]:

```
| Req_ID | Requirement Summary | Mapped Module(s) | Gap Analysis |
|---|---|---|---|
| REQ_01 | System must read the ID card | MOD_UI_01, MOD_BIZ_01 | ✅ Covered |
| REQ_02 | Store error history for 30 days | — | ⚠️ GAP |
```

### GAP Alert (REQUIRED when detected)

If any Requirement has GAP status OR any Module does not serve any Requirement:

```
⚠️ GAP ALERT: Found [N] requirements not systematized:
- REQ_02: "Store error history for 30 days" — no module handles this
- REQ_05: "Export PDF report" — no module handles this
Please decide: (a) add new module, or (b) confirm as out of scope
```

**Strict rule:** DO NOT modify [MODULE LIST] unilaterally. Only flag GAPs; let QA decide.

### Gate 3 Checklist

```
✓/✗ Every US has a DR block with appropriate Q depth
✓/✗ Dependency Map: all 8 types scanned
✓/✗ Every "same as AC X" reference has a reuse row in Dependency Map
✓/✗ Every row has a Test Implication or "No implication — [reason]"
✓/✗ CoveredBy column present and starts empty
✓/✗ RTM: every Requirement mapped or flagged as GAP
✓/✗ GAP ALERT printed if any gaps exist
```
