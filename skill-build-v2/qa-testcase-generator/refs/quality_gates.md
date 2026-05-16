# Quality Gates & Finalization

> Always load when qa_testcase_generator starts.
> Gate 5 v2 (6-part, non-fakeable) + Pre-finalization checklist (PART A/B/C) + 9 Quality Patterns.

---

## Gate 5 v2 — Per AC *(run IMMEDIATELY after writing TCs for that AC)*

**Rule:** NEVER batch at end of module. NEVER self-certify. Each part requires listed output.

---

### PART 1 — Observable Outcomes Coverage *(NON-FAKEABLE)*

```
| Observable (copy verbatim from Q6 O-list in DR block) | TC ID covering it |
|---|---|
| [O1: exact text from DR block]                         | TC-US##-FUNC-### |
| [O2: exact text]                                       | TC-US##-FUNC-### |
| [ON: exact text]                                       | TC-US##-FUNC-### |
| [N1: negative condition → exact error text]            | TC-US##-EDGE-### |
| [N2: negative condition → exact error text]            | TC-US##-EDGE-### |
```

→ **ANY empty TC ID cell = FAIL** → write TC before proceeding.
→ Table cannot be skipped, summarized, or shortened.
→ Copy verbatim from Q6 — do NOT paraphrase.

---

### PART 2 — Technique Artifact Coverage *(NON-FAKEABLE)*

```
| Artifact row (from DT/ST/BVA/EG in DR block)         | TC ID |
|---|---|
| DT Row 1: Cond A=Y, B=Y → outcome X                  | TC-... |
| DT Row 2: Cond A=Y, B=N → outcome Y                  | TC-... |
| ST: active → cancelled (valid)                        | TC-... |
| ST: cancelled → active (invalid — blocked)            | TC-... |
| BVA: min boundary (qty=1)                             | TC-... |
| BVA: max boundary (qty=100)                           | TC-... |
| EG H1: API duplicate request (idempotency)            | TC-... |
```

→ **ANY empty TC ID = FAIL** (or write `"No TC — [reason from spec]"` for explicitly excluded rows).
→ `"n/a"` alone is not accepted — must cite reason from spec.

---

### PART 3 — Forbidden Phrases Scan

Scan each Expected Result written for this AC:

```
[TC-ID] Expected: "[text]" → forbidden phrase? YES/NO
TC-US01-FUNC-001: "Balance shows '4 credits'" → NO ✓
TC-US01-FUNC-002: "Credits updated correctly" → YES ✗ → REWRITE
```

→ **YES on any TC = FAIL** → split or rewrite Expected before proceeding.

**Forbidden phrase list:**
- `"correctly"` | `"properly"` | `"as designed"` | `"as per spec"` | `"as expected"`
- `"visible"` (alone) | `"shown"` (alone) | `"updated"` (alone) | `"displayed"` (alone)
- `"works"` | `"functions"` | `"behaves normally"` | `"operates as intended"`
- `"[X] and [Y] are [Z]"` — two verifiable items joined with "and"

---

### PART 4 — Floor Check

```
Actual TCs written for this AC      = [N]
Min_TCs from RTM (FINAL Floor)      = [N]
count(Q6 O) + count(Q6 N)          = [N]
Actual ≥ max(Min_TCs, count(O)+count(N))? → PASS / FAIL
```

→ **FAIL = write [delta] more TCs before proceeding.**
→ Reference DR block for this AC to identify which O/N items still need coverage.

---

### PART 5 — Test Data Quality Check

```
Scan each TC for this AC:
[TC-ID]: uses shared/stateful data → shows "values → DataID"? YES/NO
TC-US01-FUNC-001: "credits: 3, status: active → TD-001" → YES ✓
TC-US01-FUNC-003: "→TD-002" only → NO ✗ → ADD concrete values
```

→ **Any TC with DataID-only (no concrete values) = FAIL** → add values before proceeding.
→ Format: `[concrete values] → [DataID]` (values first, DataID second).

---

### PART 6 — Coverage Linkage

```
  [ ] Dependency Map: all MANDATORY TC rows for this AC → CoveredBy filled with TC ID
      (or "Covered via precondition in TC-XX" / "No standalone case — [reason]")
  [ ] RTM: Actual_TCs column filled for this AC (count of TCs written)
  [ ] RTM: Status updated to "✓ Covered"
```

→ Empty CoveredBy row after this AC = coverage gap = add TC or note.

---

### Gate 5 v2 Status

```
Status: ✓ PASS — all 6 parts checked and passed
        ✗ FIX FIRST — Part [N]: [specific item missing → action required]
```

**If floor shortfall:** Fix immediately with DR block open for context. Do not defer.
**If artifact row empty:** Build missing TC from that artifact row now.
**If forbidden phrase found:** Rewrite Expected to specific, observable outcome.

---

## Pre-finalization Checklist *(run after ALL modules complete)*

### PART A — Context & Analysis Completeness

```
Context:
  [ ] Feature Purpose Statement, Business Flow List, Actor Map present
  [ ] Then-bullet Inventory + min_hints present in MASTER CONTEXT
  [ ] AC Type Classification Matrix produced BEFORE Deep Reading

BU & Deep Reading:
  [ ] Every AC has Business Understanding block (4 fields — not placeholder)
  [ ] Every AC has DR block with appropriate Q depth (7Q/10Q/12Q by tier)
  [ ] Every DR block has Gate5: [✓] passed
  [ ] Q-Floor: every AC uses Floor formula v3 with explicit O/N/DT/ST/BVA breakdown

Technique artifacts:
  [ ] Every HIGH/Tier-3 module: DT built if ≥2 conditions | ST built if lifecycle entity
      BVA list built if numeric fields | EG H1-H5 verdict list built
  [ ] Every artifact row → TC ID assigned (or explicit "No TC — [reason]")
  [ ] No technique declared in Module Brief without actual artifact

Data:
  [ ] Data Prerequisite Card exists per module with DataID registry
  [ ] Every TC using shared data: shows "concrete values → DataID"
  [ ] No TC has DataID-only without concrete values
```

### PART B — Coverage Completeness

```
  [ ] Every AC: Actual_TCs ≥ Min_TCs (RTM)
  [ ] Every module with Risk ≥ MEDIUM: ≥1 SCEN TC
  [ ] Every Q6 O-item: covered by TC (PART 1 table was completed per AC)
  [ ] Every Q6 N-item: covered by EDGE TC
  [ ] Every Dependency Map MANDATORY TC row: CoveredBy filled
  [ ] RTM: ZERO "UNCOVERED" rows
```

### PART C — Row Quality

```
  [ ] Every title starts "Verify" or "Check that"
  [ ] Every step: 1 physical action, no "and"
  [ ] Expected: observable, no forbidden phrases
  [ ] Test Data: concrete values shown alongside DataID for shared fixtures
  [ ] Note column: compact format [Module] Category | ScenarioType | optional tags
```

---

## 9 Multi-run Quality Patterns

Scan after writing TCs. Confirm NONE of these patterns are present.

**Pattern 1 — Design image late discovery**
Symptom: TCs written for AC, then design reveals 15 additional combinations.
Prevention: Gate 0 — all images read BEFORE spec text.
Recovery: Re-open AC DR, add Q10 findings, re-run Gate 5 v2.

**Pattern 2 — Floor shortfall accumulation**
Symptom: After 200+ TCs, Gate 5 check reports 4 ACs below floor.
Prevention: Run Gate 5 v2 IMMEDIATELY after each AC.
Recovery: Write additional TCs with DR block open for context.

**Pattern 3 — "Same as AC X" under-expansion**
Symptom: AC13 says "same as AC10" → AC13 has 3 TCs instead of 12.
Prevention: Q8 reference → open that AC's Q6 O-list → verify all O-items covered.
Recovery: Add missing TCs, update CoveredBy in Dependency Map.

**Pattern 4 — Sub-section AC headline collapse**
Symptom: AC with 2 sub-sections and 19 fields produces 1 TC.
Prevention: Q6 split protocol — each O-item on its own O-line.
Recovery: Redo Q6 split, recalculate FINAL Floor, write missing TCs.

**Pattern 5 — Dependency Map rows unverified**
Symptom: 30-row Dependency Map; after writing TCs, 8 CoveredBy cells empty.
Prevention: Fill CoveredBy IMMEDIATELY when writing TC for that dependency row.
Recovery: For each empty row — decide standalone TC or precondition note.

**Pattern 6 — Changelog version drift**
Symptom: TCs assert behavior from old spec version (e.g., "Forfeited" instead of "Voided").
Prevention: Read changelog FIRST in L1.
Recovery: Search all TCs for deprecated terminology, update Expected.

**Pattern 7 — Vague concurrency TCs**
Symptom: Race condition TC Expected: "modal closes" — no data state assertion.
Prevention: Every concurrency TC Expected MUST assert: (1) UI state AND (2) data state.
Recovery: Add data-state assertion to every concurrency TC.

**Pattern 8 — Missing business context**
Symptom: TCs technically correct per AC but no SCEN TC for critical flows.
Prevention: BU blocks in L3 + SCEN TC for every HIGH/MEDIUM module.
Recovery: Write SCEN TCs for modules missing them.

**Pattern 9 — Assumption silent propagation**
Symptom: "admin" assumed = Org Admin throughout; spec has 2 admin types → 20 wrong TCs.
Prevention: Ambiguity List + Explicit Assumptions BEFORE Deep Reading.
Recovery: Re-read Ambiguity List; identify and rewrite TCs on incorrect assumption.

---

## When Gate Cannot Fully Pass

If spec is genuinely incomplete (not a reading error):
1. Document gap in Missing Information
2. Add to Not-Testable-Yet Items with specific description
3. Mark gate: **conditionally passed** — gap must still be visible and tracked
4. Add question to Clarification Questions in Final Summary

Conditional pass ≠ bypass. Pipeline can proceed but gap must be tracked.
