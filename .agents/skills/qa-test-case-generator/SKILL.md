---
name: qa-test-case-generator
description: Use this skill when the user needs to turn Markdown product specs, acceptance criteria, or technical documentation into structured QA test cases. Triggers on requests like "write test cases for this spec", "generate QA tests from this feature doc", "help me test this user story", "review my existing test cases against the spec", or any time a .md spec file is provided and QA coverage is needed. Also triggers when the user pastes acceptance criteria, business rules, or API notes and wants test cases derived from them. Use even if the user says "just give me basic test cases" — the analysis step prevents missed coverage.
---

# QA Test Case Generator

Turn a Markdown spec into a production-ready QA test suite. Output must be source-grounded, traceable, and derived from explicit analysis — never invented from assumption.

## File Map — Load by Phase

```
SKILL.md              ← this file (always load)
deep-reading.md       ← always load immediately after SKILL.md
refs/
  p0-visual-assets.md  ← load IF: any image uploaded OR Figma URL found in spec
  p3-artifacts.md      ← load IF: any HIGH-risk AC (Compound, Multi-effect ≥5, Sub-section)
  p4-writing-rules.md  ← load AT: Phase 4 (before writing first test case row)
  p5-gates-patterns.md ← load AT: Phase 5 (before running final review)
```

**On startup:** Read this file, then immediately read `./deep-reading.md`. Those two files contain everything needed for Phases 0–3. Load the `refs/` files only at the phase triggers above — not all at once.

---

## Core Principle

Do not jump from spec text directly to table rows. The sequence is always:
1. Decompose spec → requirements and conditions
2. Choose the right test design technique per requirement
3. Build analysis artifacts before writing rows
4. Write source-backed cases only

Coverage density is part of correctness. If the source describes multiple observable behaviors, the suite must stay dense enough to prove them separately.

You MUST split rows when any of the following are true:
- One trigger produces effects on 2+ target surfaces
- The source defines copy variants such as singular/plural, same-year/different-year, or threshold labels
- The source defines exact-threshold behavior that differs from below-threshold or above-threshold behavior
- The source defines ordering, grouping, aggregation, visibility, and styling as separate observable rules
- Sources conflict and both interpretations are plausible enough to merit a conflict canary

Default bias:
- Prefer atomic rows over merged rows
- Prefer a slightly dense suite over a deceptively compact suite
- Never merge across surfaces just because the trigger is the same

---

## Input Modes

**Mode A — Generate (default):** New test suite from scratch.

**Mode B — Review and Regenerate:** Spec + existing test file provided. Identify gaps, outdated cases, wrong expected results. Generate a complete replacement — do not patch. Add `Review Notes` subsection listing: valid reused cases (with old IDs), missing cases, stale content.

Mode B also requires a density review of the old suite:
- Identify over-merged rows that hide multiple observable outcomes
- Identify ACs whose row count is suspiciously low for the documented structure
- Identify stale assertions caused by source conflicts or later technical clarifications

---

## Operating Mode

- Behave as a Senior QA Engineer writing production-ready cases.
- Write output in English unless user explicitly asks otherwise.
- Stay grounded in provided files and explicitly supplied context.
- Refuse to invent undocumented UI, behavior, roles, messages, or transitions.
- Surface gaps instead of filling them with guesses.
- Prefer fewer high-value cases over inflated coverage with duplicated intent.
- Spec in Vietnamese/other language → write test content in English; quote original verbatim in `Source Trace`.

---

## Fallback Behavior

- No spec → ask for spec before proceeding.
- Input under 3 sentences with no ACs → add to `Not-Testable-Yet Items`, request clarification.
- Multiple `.md` files → treat as one source; note filename in `Source Trace` per fact.
- Contradictions → apply Multi-Source Conflict Resolution below; never resolve silently.
- **Spec has a changelog** → read it first, before cataloguing any AC. Every changelog entry overrides the original AC text. Mark current version per AC. Write deprecated terms to `Assumptions`.
- **Spec >40 ACs** → apply Large Spec Strategy (Step 5B in `deep-reading.md`) before any analysis.

---

## Multi-Source Conflict Resolution

Priority (highest → lowest):
1. Explicitly stated API contract
2. Product spec / acceptance criteria
3. Technical implementation doc
4. Existing test case file (baseline only)

When sources conflict: write case for higher-priority interpretation + additional case for lower-priority if plausible. Tag both: `Source conflict - [A] vs [B]`. Add to `Risks from Ambiguity`. Add to `Clarification Questions`.

When the conflict affects shipped behavior, treat it as a 2-part obligation:
1. **Primary expectation row(s):** aligned to the higher-priority source
2. **Conflict canary row(s):** aligned to the lower-priority but plausible implementation

Typical triggers for conflict canaries:
- Product spec vs technical design ordering mismatch
- Product spec vs data flow state-transition mismatch
- Threshold wording conflicts
- Scheduler cadence or consolidation conflicts

---

## Workflow

Gated pipeline — each gate must pass before the next phase begins. Full gate criteria in `refs/p5-gates-patterns.md`.

---

### Phase 0 — Visual Asset Check

**IF** any image is uploaded OR any Figma URL / diagram reference exists in the spec:
→ Load `./refs/p0-visual-assets.md` and follow its steps before Phase 1.

**ELSE:** Skip Phase 0. No visual assets = no gate to pass.

---

### Phase 1 — Input Intake

**Step 1.** Identify Input Mode (A or B).

**Step 2.** Extract from spec — only what is explicitly stated:
- Feature name, user stories and IDs
- Every AC per US, including status flags (`NEED DESIGN APPROVAL`, `NEED TO DISCUSS WITH DEV`)
- Business rules, field validation rules, user roles, API notes, contradictions

**Step 3.** (Mode B only) Read existing test file. Complete Review Notes before proceeding. Use current sources as primary driver — not the old suite.

For Mode B Review Notes, explicitly classify:
- Valid reused coverage patterns
- Missing coverage areas
- Over-merged old rows
- Stale content caused by version drift or source conflict

▶ **GATE 1:** Every US identified, every AC listed, all BRs extracted, all status flags noted, changelog applied. Fix any gaps before Phase 2.

---

### Phase 2 — Deep Analysis

**Step 4 — AC Type Classification Matrix** (mandatory, before any Deep Reading):

Scan all ACs and produce:
```
| AC | Structural Type | Risk | Design Supplement? | Est. Floor |
|---|---|---|---|---|
```
Risk: **HIGH** = Sub-section / Field-enum / Multi-effect ≥5 / Compound. **MEDIUM** = Conditional / Reuse-ref. **LOW** = Headline-only.

→ IF any HIGH-risk AC exists: load `./refs/p3-artifacts.md` now (artifact formats needed in Phase 3).

**Step 5 — Deep Reading per AC:** Follow the protocol in `./deep-reading.md`. Process per chunk:
- ≤15 ACs: one pass
- 16–40 ACs: US-by-US
- >40 ACs: sub-groups of ≤8 ACs

**Step 6 — Dependency Map:** After all Deep Reading complete. Build `Cross-US/AC Dependency Map` with columns: `Relationship | Source AC | Target AC | Type | Test Implication | Covered By`. `Covered By` starts empty — filled in Phase 4.

▶ **GATE 2:** AC Type Matrix exists. Every AC has a Deep Reading block with all 13 questions. Every Q13 answered. No anti-patterns 1, 4, 7, 8. Full criteria in `refs/p5-gates-patterns.md`.

▶ **GATE 3:** Dependency Map has `Covered By` column. All 8 relationship types scanned. Full criteria in `refs/p5-gates-patterns.md`.

---

### Phase 3 — Artifact Construction

Build only when triggered. All format specs in `./refs/p3-artifacts.md`.

| Artifact | Build when |
|---|---|
| AC Capability Map | AC has 4+ sub-bullets or any interactive control |
| Success Outcome Ledger | Success path has multiple documented effects |
| Requirement-to-Condition Matrix | AC contains if / when / only if / show / hide |
| Row-Schema Variant Matrix | Repeated table/list where columns vary by row type |
| Cross-Flow Impact Sweep | AC performs state change (archive / delete / cancel) |

▶ **GATE 4:** All triggered artifacts built. Any "N/A" has a source-grounded one-line reason.

---

### Phase 4 — Test Case Writing

**→ Load `./refs/p4-writing-rules.md` before writing the first row.**

**Step 7.** For each AC, derive test case set:
- Start from minimum floor (Deep Reading Q12)
- Each Condition Matrix branch → ≥1 row or explicit exclusion
- Each Capability Map item → ≥1 row or explicit exclusion
- Each Success Outcome Ledger effect → covered or explicitly merged
- Each Variant Matrix row → covered or explicitly excluded
- Each Dependency Map row with implication → ≥1 row, or precondition note, or `Covered By` filled
- Each documented copy variant → separate row unless provably inseparable
- Each target surface with its own observable side effect → separate row unless provably inseparable
- Each primary-vs-conflict interpretation pair → primary row plus conflict canary row when plausible
- Do not write any row that cannot be traced to a source fact

▶ **GATE 5 (INLINE — per AC, before moving to next AC):**
1. Count rows produced for this AC
2. Compare against Q12 floor
3. If below floor → write missing cases NOW, do not defer
4. Verify: no vague expected results, no compound steps, no invented test data, every "same as AC X" fully expanded
5. Mark `Gate 5 status: [✓] passed` in the AC's Deep Reading block
Full criteria in `refs/p5-gates-patterns.md`.

---

### Phase 5 — Final Review

**→ Load `./refs/p5-gates-patterns.md` before running this phase.**

**Step 8.** Run Pre-Finalization Checklist (in `refs/p5-gates-patterns.md`).

**Step 9.** Scan Multi-Run Quality Patterns (in `refs/p5-gates-patterns.md`). Confirm none occurred; flag any that partially apply.

---

## Output Contract

```
Input Analysis
  Visual Asset Inventory          ← if Phase 0 ran
  Design Supplement — [AC]        ← one block per AC with design artifact
  AC Type Classification Matrix
  Extracted Sections
  Requirement Analysis
    Deep Reading — [AC]           ← all 13 questions + Gate 5 status
  Cross-US/AC Dependency Map      ← with Covered By column
  AC Capability Map               ← if triggered
  Success Outcome Ledger          ← if triggered
  Requirement-to-Condition Matrix ← if triggered
  Row-Schema Variant Matrix       ← if triggered
  Cross-Flow Impact Sweep         ← if triggered
  Assumptions | Missing Info | Risks from Ambiguity | Not-Testable-Yet
  Review Notes                    ← Mode B only

Test Cases
  ## US-01: [Title]
    ### AC1: [Description]
    | ID | AC | Title | Preconditions | Step | Test Data | Expected | Note | Priority | Module/Feature | Category | Scenario Type | Mapped Source Section | Source Trace |
    ### Security
    | ... |

Final Summary
  Coverage Summary | Top Risks | Clarification Questions | Automation Candidates
```

If the user explicitly asks for spreadsheet output (`.xlsx`) or would clearly benefit from it:
- Use the spreadsheet skill for the final artifact
- Preserve the same traceability fields as the markdown contract
- Prefer workbook sheets such as: `Test Cases`, `Summary`, `Risks & Source Conflicts`, `Dependency Map`
- Do not drop the analysis layer just because the final deliverable is a spreadsheet

**ID format:** `TC-US[XX]-[CAT]-[SEQ]`  
Codes: `FUNC` `SEC` `UI` `EDGE` — sequence resets per US+category.  
**Default output >30 cases:** save to `[feature-name]-test-cases.md`. Tell user the path. Analysis and Summary may print inline.
