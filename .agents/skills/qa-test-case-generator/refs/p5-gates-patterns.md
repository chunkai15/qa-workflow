# Phase 5 — Gates & Patterns

> Load this file at the start of Phase 5 final review.
> Also contains full pass criteria for Gates 0–5 — referenced inline during earlier phases.

---

## Pre-Finalization Checklist

Run after all rows are written across all ACs.

**Phase 0 completeness**
- [ ] Visual Asset Inventory exists: every image, Figma URL, "Need design" AC logged
- [ ] Every uploaded image has a Design Supplement block with extracted combinations
- [ ] Every "Need design" AC has visual/layout assertions tagged `Draft - design pending`

**Phase 2 completeness**
- [ ] AC Type Classification Matrix produced before Deep Reading; risk levels assigned
- [ ] Every AC has a Deep Reading block with all 13 questions answered or N/A with reason
- [ ] Every Deep Reading block has `Gate 5: [✓] passed`
- [ ] Dependency Map has `Covered By` column; every row has TC ID, precondition note, or "No standalone case — [reason]"

**Coverage completeness**
- [ ] Every AC row count ≥ Q12 floor (which includes design supplement items in Source A)
- [ ] Every Q13 item (design-only finding) has a corresponding case or explicit exclusion note
- [ ] Every "same as AC X" reference fully expanded: all AC X effects covered in referencing AC
- [ ] No two rows have identical steps AND identical expected results (remove duplicates)
- [ ] Every branch in conditional ACs covered or explicitly excluded
- [ ] Every interaction in interaction-heavy ACs covered or explicitly excluded
- [ ] Every design combination from Design Supplement blocks covered or explicitly excluded
- [ ] Every documented copy variant has a row or explicit exclusion
- [ ] Every independently observable target surface has a row or explicit exclusion
- [ ] Every plausible lower-priority source conflict has a conflict canary or an explicit reason it does not merit one

**Artifact completeness**
- [ ] Requirement Analysis section exists and precedes all test tables
- [ ] Dense/interaction-heavy ACs have AC Capability Map
- [ ] Multi-effect success ACs have Success Outcome Ledger
- [ ] Conditional ACs have Requirement-to-Condition Matrix
- [ ] Repeated-row ACs have Row-Schema Variant Matrix
- [ ] State-changing ACs have Cross-Flow Impact Sweep

**Row quality**
- [ ] Every case maps to a requirement, condition, or design finding
- [ ] Every case traces to spec or named design artifact — no invented UI or flow
- [ ] Test Data concrete when source supports it
- [ ] Every step is one physical action
- [ ] No `works correctly` / `as per design` / `same as Figma` in Expected column

**Structure and IDs**
- [ ] Cases grouped by US then by AC
- [ ] Security tests not tied to AC in `### Security` subsection
- [ ] IDs: `TC-US[XX]-[CAT]-[SEQ]`; no duplicates; no sequence gaps within US+category
- [ ] All multi-source conflicts flagged in Note column and `Risks from Ambiguity`
- [ ] ACs with status flags handled correctly
- [ ] Final Summary counts reconcile with actual row counts
- [ ] Output >30 cases saved to file

---

## Multi-Run Quality Patterns

Scan these after writing all cases. Confirm none occurred; flag any that partially apply.

**Pattern 1 — Design image late discovery**
Symptom: Cases for an AC written, then design image reveals 15 additional combinations.
Root cause: Phase 0 skipped or incomplete.
Prevention: Gate 0 — every image read before spec text processing.
Recovery: Re-open AC Deep Reading, add Q13 findings, re-run Gate 5 inline.

**Pattern 2 — Floor shortfall accumulation**
Symptom: After 200+ cases, Gate 5 check reports 4 ACs below floor — appended additions needed.
Root cause: Gate 5 treated as batch check at end instead of per-AC inline.
Prevention: Mark `Gate 5: [✓] passed` before moving to next AC.
Recovery: Write additions with original AC's Deep Reading block open for context.

**Pattern 3 — "Same as AC X" under-expansion**
Symptom: AC13 says "notification behavior same as AC10" — AC13 gets 3 cases instead of 12.
Root cause: Anti-pattern 6 — reuse reference treated as merge, not full expansion.
Prevention: When Q9 references another AC, open that AC's Q6 list and verify all effects covered.
Recovery: Add missing cases inline; update `Covered By` in Dependency Map.

**Pattern 4 — Sub-section AC headline collapse**
Symptom: AC with 2 sub-sections and 19 fields produces 1 case.
Root cause: Anti-pattern 1 — headline read without expanding sub-sections.
Prevention: Step 0 structural expansion mandatory before Q1. Structural item count must be non-trivial.
Recovery: Redo Step 0 from scratch; recalculate Q12.

**Pattern 5 — Dependency Map rows not verified**
Symptom: 30-row map built; after writing, 8 rows have no corresponding case.
Root cause: `Covered By` column not tracked during writing.
Prevention: Fill `Covered By` as each dependency's case is written.
Recovery: For each empty row, determine if standalone case needed or precondition note suffices.

**Pattern 6 — Changelog version drift**
Symptom: Cases assert behavior from older spec version (e.g., "Forfeited" instead of "Voided").
Root cause: Changelog not read before cataloguing ACs.
Prevention: Read changelog first in Phase 1. Note overriding version per modified AC.
Recovery: Search all cases for deprecated terminology; update expected results.

**Pattern 7 — Vague concurrency cases**
Symptom: Race condition cases written with expected result "modal closes" — no assertion about data state or event log.
Root cause: Concurrency cases written last, with reduced context.
Prevention: Every race condition expected result must assert: (1) what UI shows AND (2) what data state is (credits created/not, event logged/not).
Recovery: Add data-state assertion to Expected column for each concurrency case.

**Pattern 8 — Over-merged outcome rows**
Symptom: One row claims "submit succeeds" and covers modal close, toast, balance refresh, history row, and notification together.
Root cause: Row count optimized for compactness instead of observability.
Prevention: Split by target surface and by independently observable effect during Gate 5.
Recovery: Re-open the Success Outcome Ledger and create one row per surface/effect that can be verified separately.

**Pattern 9 — Conflict acknowledged but not tested**
Symptom: Analysis notes a real source conflict, but testcase output contains only the preferred interpretation.
Root cause: Multi-Source Conflict Resolution applied as documentation only, not as test design.
Prevention: For every plausible lower-priority interpretation, add a conflict canary row.
Recovery: Add canary rows and tag them `Source conflict - [A] vs [B]`.

---

## Full Gate Criteria (reference for inline gate checks)

### Gate 0 — Visual Asset Completeness
*(Full criteria in `refs/p0-visual-assets.md`)*

| Check | Pass condition |
|---|---|
| Images read | Every uploaded image read; Design Supplement produced |
| Figma attempted | Every Figma URL attempted; inaccessible ones noted |
| "Need design" flagged | Every flagged AC logged and tagged |
| Design vs spec compared | Design-only items extracted for every read artifact |

### Gate 1 — Intake Completeness

| Check | Pass condition |
|---|---|
| US inventory | Every `## US-XX` section identified |
| AC inventory | Every AC listed with identifier and full text |
| BR inventory | Every BR / validation rule extracted |
| Status flag inventory | Every flagged AC noted with flag text |
| Role inventory | Every distinct user role identified |
| API note inventory | Every API endpoint or contract note extracted |
| Contradiction log | Every contradicting sentence flagged, not resolved silently |
| Changelog applied | Every changelog entry applied; modified ACs marked with current version |

### Gate 2 — Deep Reading Completeness

| Check | Pass condition |
|---|---|
| AC Type Matrix | Produced before Deep Reading; risk levels assigned |
| Block count | Deep Reading blocks = number of ACs in current chunk |
| Step 0 present | Every block: structural type, risk, design supplement ref, item list |
| Design supplement linked | HIGH-risk ACs with design artifact: items included in Step 0 count |
| Sub-section coverage | Every Sub-section AC analyzed per sub-section, not per headline |
| Field enum coverage | Every Field-enum AC: every field in Q1 and Q5 individually |
| Q5 quality | Every field: own line with expected value when met AND when not met |
| Q6 quality | Outcomes listed one-by-one, not summarized |
| Q7 quality | Every "only for X" rule has corresponding implied negative |
| Q12 quality | A/B/C breakdown shown; final = max(A,B,C); Source A includes design items |
| Density quality | Source D breakdown shown when copy variants, extra surfaces, thresholds, or source conflicts apply |
| Q13 present | ACs with design: specific findings. ACs without: "N/A" |
| No anti-pattern 1 | No Sub-section AC answered by headline only |
| No anti-pattern 4 | No Q12 with range instead of counted integer |
| No anti-pattern 7 | No uploaded image left unread |
| No anti-pattern 8 | AC Type Matrix produced before Deep Reading for >15-AC specs |

### Gate 3 — Dependency Map Soundness

| Check | Pass condition |
|---|---|
| Shared entity scan | Every entity in >1 AC has a map row |
| State-change scan | Every Q8 sequence dependency has a map row |
| Reuse reference scan | Every "same behavior as"/"see AC-X" has a reuse reference row |
| Cross-US modification scan | Every AC creating/modifying data consumed elsewhere has a data dependency row |
| Contradiction scan | Every Q9 conflict has a contradiction row → Multi-Source Conflict Resolution |
| Implication coverage | Every row has test implication or explicit "no implication — [reason]" |
| Covered By column | Map table includes `Covered By` column |

### Gate 4 — Artifact Coverage

| Artifact | Required when | Pass condition |
|---|---|---|
| AC Capability Map | 4+ sub-bullets, or any interactive control, or multiple UI outcomes after one action | All controls listed; each has disposition |
| Success Outcome Ledger | Success path has >1 documented effect | All effects listed; each has disposition |
| Requirement-to-Condition Matrix | Any conditional language | All branches listed; each has disposition |
| Row-Schema Variant Matrix | Repeated table where columns vary by type/status | All variants listed; each has disposition |
| Cross-Flow Impact Sweep | State change (archive/delete/cancel/disable/lock) | Downstream consequences documented; "none found" stated explicitly if applicable |

N/A rule: requires source-grounded one-line reason. `"N/A"` alone not sufficient.

### Gate 5 — Per-AC Row Audit (inline, before moving to next AC)

| Check | Pass condition |
|---|---|
| Floor met | Row count ≥ Q12 floor; any shortfall fixed NOW (not deferred) |
| Design supplement covered | Every Q13 item has row or "excluded — reason" |
| Reuse expansion complete | Every "same as AC X" expanded: all AC X effects in Q6 and covered |
| Condition coverage | Every Condition Matrix branch covered or explicit exclusion |
| Capability coverage | Every Capability Map item covered or explicit exclusion |
| Outcome coverage | Every Success Outcome Ledger effect covered or merged |
| Variant coverage | Every Variant Matrix row covered or explicit exclusion |
| Dependency coverage | Every Dependency Map row for this AC: TC ID in Covered By or precondition note |
| Copy-variant coverage | Every documented copy variant has row or explicit exclusion |
| Surface split quality | Each independently observable target surface has row or explicit exclusion |
| Conflict canaries | Every plausible lower-priority conflict interpretation has a canary row or explicit exclusion |
| Title quality | Every title starts with `Verify` or `Check that` |
| Step atomicity | Every step = one physical action; no "and" |
| Test data concrete | No `[value]`/`any valid input` when source defines the field |
| Expected specificity | No `works correctly`/`as per design`/`same as Figma` |
| Source traceability | Every row has non-empty Source Trace |
| Gate 5 marked | Deep Reading block updated: `Gate 5: [✓] passed` |

**Fail behavior for all gates:** Fix before proceeding. Gate failure from genuine spec incompleteness → document gap, mark "conditionally passed", add to Clarification Questions. Conditional pass is not a bypass.
