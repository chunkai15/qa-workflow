# Quality Gates & Finalization

> Always load when qa_testcase_generator starts.
> Gate 5 inline checklist + Pre-finalization checklist + 9 Quality Patterns.

---

## Gate 5 — Inline (per AC, BEFORE moving to next AC)

This is the most critical checkpoint. Do not batch check at the end — check IMMEDIATELY after completing each AC.

```
[AC-ID] Gate 5:
✓/✗ Floor met — wrote [actual N], DR Floor = [N from adaptive_reading.md Q-Floor]
✓/✗ Design supplement items covered (Q10 findings) — or "n/a"
✓/✗ API status codes covered (Q11) — or "n/a"
✓/✗ All Condition Matrix branches covered — or "n/a — no conditions"
✓/✗ Dependency Map CoveredBy filled for this AC's rows
✓/✗ RTM: AC marked ✓ Covered
Status: ✓ PASS | ✗ FIX FIRST: [describe what's missing]
```

**If floor shortfall:** Fix immediately with full AC context in mind. Do not defer — shortfalls discovered after 50+ TCs are very hard to fix with the correct context.

---

## Pre-finalization Checklist (run after ALL modules are complete)

### Context completeness
- [ ] Feature Purpose Statement, Business Flow List, Actor Map all present
- [ ] Ambiguity List, Assumptions List, Interpretations all produced
- [ ] AC Type Classification Matrix produced BEFORE Deep Reading

### Deep Reading completeness
- [ ] Every AC has a DR block with appropriate Q depth (7Q/10Q/12Q by risk)
- [ ] Every DR block has Gate5: [✓] passed
- [ ] Q-Floor: every AC has A/B/C breakdown, not an estimate

### Coverage
- [ ] Row count per AC ≥ Q-Floor
- [ ] Every module with Risk ≥ MEDIUM has ≥1 SCEN TC
- [ ] Every Q10 design item has a TC or explicit exclusion note
- [ ] Every Q11 API status code with distinct behavior has ≥1 TC
- [ ] RTM: zero "Uncovered" rows
- [ ] Dependency Map: zero empty CoveredBy rows (or "No standalone case — reason")

### Row quality
- [ ] Every title starts "Verify" or "Check that"
- [ ] Every step: 1 physical action, no "and"
- [ ] Test Data: concrete values or DataID, no bare placeholders when source defines field
- [ ] Expected: observable, no "works correctly" / "as per design"
- [ ] Note column: compact format with category + scenario type + AC ref

### Artifact completeness
- [ ] Capability Map: present for ACs with ≥4 sub-bullets or interactive controls
- [ ] Outcome Ledger: present for multi-effect success paths
- [ ] Condition Matrix: present for conditional ACs
- [ ] Variant Matrix: present for repeated-row ACs
- [ ] Impact Sweep: present for state-changing ACs
- [ ] Test Data Reference: present if any Shared/Stateful/Destructive/Boundary fixtures

---

## 9 Multi-run Quality Patterns

Scan after writing TCs. Confirm none of these patterns are present.

**Pattern 1 — Design image late discovery**
Symptom: TCs written for AC, then design image reveals 15 additional combinations.
Root cause: Phase 0 skipped or incomplete.
Prevention: Gate 0 — all images read BEFORE processing spec text.
Recovery: Re-open AC DR, add Q10 findings, re-run Gate 5.

**Pattern 2 — Floor shortfall accumulation**
Symptom: After 200+ TCs, Gate 5 check reports 4 ACs below floor.
Root cause: Gate 5 treated as batch check at end rather than inline per-AC.
Prevention: Run Gate 5 IMMEDIATELY after each AC, mark [✓] before moving to next AC.
Recovery: Write additional TCs with the DR block of the AC open for context.

**Pattern 3 — "Same as AC X" under-expansion**
Symptom: AC13 says "notification behavior same as AC10" → AC13 has only 3 TCs instead of 12.
Root cause: Reuse reference treated as merge, effects not fully expanded.
Prevention: When Q8 references another AC → open that AC's Q6 list and verify all effects are covered.
Recovery: Add missing TCs, update CoveredBy in Dependency Map.

**Pattern 4 — Sub-section AC headline collapse**
Symptom: AC with 2 sub-sections and 19 fields produces only 1 TC.
Root cause: Read headline instead of expanding sub-sections in Step 0.
Prevention: Step 0 structural expansion BEFORE Q1. Structural item count must be non-trivial for complex ACs.
Recovery: Redo Step 0, recalculate Q-Floor, write missing TCs.

**Pattern 5 — Dependency Map rows unverified**
Symptom: 30-row Dependency Map; after writing TCs, 8 rows still have empty CoveredBy.
Root cause: CoveredBy column not tracked during writing.
Prevention: Fill CoveredBy IMMEDIATELY when writing a TC for that dependency relationship.
Recovery: For each empty row: decide if standalone TC is needed or precondition note is sufficient.

**Pattern 6 — Changelog version drift**
Symptom: TCs assert behavior from old spec version (e.g., "Forfeited" instead of "Voided").
Root cause: Changelog not read before cataloging ACs.
Prevention: Read changelog FIRST in Phase 1. Note overriding version per modified AC.
Recovery: Search all TCs for deprecated terminology, update expected results.

**Pattern 7 — Vague concurrency TCs**
Symptom: Race condition TC with Expected: "modal closes" — does not assert data state.
Root cause: Concurrency TCs written last with reduced context.
Prevention: Every concurrency TC Expected MUST assert: (1) UI state AND (2) data state.
Recovery: Add data-state assertion to every concurrency TC.

**Pattern 8 — Missing business context**
Symptom: TCs technically correct per AC text but no SCEN TC for critical flows.
Root cause: Phase 0.5 skipped. ACs tested like isolated rules, not anchored to business flows.
Prevention: Business Flow List with consequence-if-fail BEFORE Phase 1. Every HIGH/MEDIUM module has a SCEN TC.
Recovery: Write Business Flow List retrospectively. Write SCEN TCs for modules that lack them.

**Pattern 9 — Assumption silent propagation**
Symptom: "admin" assumed to mean Org Admin throughout, writing 20 TCs. Spec actually has 2 admin types.
Root cause: Step 0-pre skipped. Ambiguity not surfaced. Assumption made silently.
Prevention: Ambiguity List + Explicit Assumptions BEFORE Deep Reading. Every assumption tagged in Note column.
Recovery: Re-read Ambiguity List, identify TCs depending on incorrect assumption, rewrite/split affected TCs.

---

## When Gate Cannot Fully Pass

If spec is genuinely incomplete (not a reading error):
1. Document the gap in Missing Information
2. Add affected cases to Not-Testable-Yet Items with specific description
3. Mark gate: **conditionally passed** — gap must still be visible and tracked
4. Add question to Clarification Questions in Final Summary

Conditional pass ≠ bypass. Pipeline can proceed but gap must be tracked.
