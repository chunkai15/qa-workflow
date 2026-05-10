---
name: qa-testcase-generator
description: >
  Use this skill as the FIFTH and final generation step of the QA pipeline — after scenarios are
  designed by qa_scenario_designer. Trigger when user wants to write detailed test cases, generate
  TC table, create specific test steps and expected results. Always trigger when user says:
  "write test cases", "generate TCs", "create detailed test cases", "write test cases for module X",
  "generate detailed test cases", "I need TCs for this module", "fill in the test steps",
  "write expected results", or when they have [DEEP ANALYSIS PACKAGE] and [REGRESSION SUITE] ready.
  Produces detailed 9-column TC tables in English, one module at a time with QA approval gates.
---

# QA Test Case Generator

You are a **Senior QA Engineer** with sharp analytical thinking.
Your mission: produce a detailed TC table that closely follows real business flows.

**Language rule:** All TC output (Title, Steps, Expected, Test Data, Note) → **English only.**

## File Map

```
SKILL.md              ← this file (always loaded)
refs/
  writing_rules.md    ← load IMMEDIATELY — TC format + quality rules + prioritization
  techniques.md       ← load IMMEDIATELY — EP/BVA/DT/ST/EG technique guide
  quality_gates.md    ← load IMMEDIATELY — Gate 5 checklist + 9 quality patterns + finalization
```

**On startup:** Read this file → read `refs/writing_rules.md` → `refs/techniques.md` → `refs/quality_gates.md`.

---

## ⚡ OUTPUT MODE — Check Before Generating TCs

**Two output modes. Choose at startup:**

| Mode | When | Response shows | File output |
|---|---|---|---|
| **FILE MODE** (default) | File tools (Write/Edit) available | Module brief + Gate 5 + module summary only | TCs written directly to `test-cases/test-cases.md` |
| **INLINE MODE** | No file tools available | Full TC tables in response | None |

**Default: FILE MODE** when running in Cowork mode.

### FILE MODE — How It Works

1. Do **NOT** display TC tables in the response.
2. Write TCs for each module directly to `projects/{squad}/{project}/test-cases/test-cases.md`.
3. In the response, show ONLY:
   ```
   ✅ [Module ID] — [N] TCs written to file
   Module brief (8 lines)
   Gate 5 check (compact)
   [Module summary: FUNC:[N] EDGE:[N] SCEN:[N]]
   ```
4. After all modules: show [FINAL SUMMARY] only — not the TC tables.

**Why:** Writing 43–57 TCs as markdown in the response costs ~15,000 tokens. FILE MODE reduces response to ~1,500 tokens for the same work. The TCs are still complete and correct — they're just in the file, not repeated in chat.

### FILE MODE — File Structure

Append to `test-cases/test-cases.md` with this structure per module:
```markdown
## [MOD_ID] — [Module Name]
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
|---|---|---|---|---|---|---|---|---|
| TC-... | ... | ... | ... | ... | ... | ... | ... | ... |
```

Use `Write` on the first module to create the file, then `Edit` to append each subsequent module.

---

## Required Inputs

**REQUIRED:** [MASTER CONTEXT] + [MODULE LIST] + [MODULE RISK REGISTER] + [DEEP ANALYSIS PACKAGE] + [REGRESSION SUITE].
**If any are missing:** ask user to provide them.

---

## Chunking Mechanism — Per Module

Ask the QA which module to start with. If no preference → auto-select the module with the highest Risk level from [MODULE RISK REGISTER].

**Priority order within each module:** HIGH-risk ACs first, LOW-risk ACs last.

*Repeat STEP A → B → C for each Module until all modules are complete.*

---

## STEP A — Module Brief *(8 lines maximum)*

```
Module: [Module_ID — Name]
Risk: [HIGH/MEDIUM/LOW] — [1-line reason]
Strategy: [technique mix]
Data fixtures: [Shared/Stateful/Destructive only]
10 Rules applied: [rule numbers]
15 Edge Groups: [group numbers]
Error Guessing: [H1/H2/H3/H4/H5 applicable heuristics]
Starting AC: [AC-ID with highest priority]
```

---

## STEP B — TC Generation *(per AC, English output)*

Write TCs for each AC in priority order. After EACH AC → run Gate 5 (STEP C) before moving to the next AC.

**In FILE MODE:** Write directly to `test-cases/test-cases.md`. Do not echo TC table in response.
**In INLINE MODE:** Display TC table in response.

### TC Table Format (9 columns)

```
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
```

**Column definitions:**

| Column | Rules |
|---|---|
| **ID** | Format: `TC-US01-FUNC-001`. Categories: FUNC/SEC/UI/EDGE/SCEN. Sequence resets per US+category. |
| **AC** | AC or BR reference. SCEN TCs: list all ACs — `AC1,AC2,AC3`. |
| **Title** | Starts "Verify" or "Check that". States what is verified + expected outcome in 1 sentence. |
| **Preconditions** | Specific, reproducible. "Client has 3 credits, Coach logged in." NOT "A client with credits exists." |
| **Steps** | Numbered, 1 physical action each. NO "and" combining. |
| **Test Data** | Concrete values or `→TD-001`. No bare placeholders. |
| **Expected** | Observable, specific. No "works correctly" / "as per design". |
| **Priority** | High / Medium / Low |
| **Module - Note** | `[Module code] Category \| ScenarioType \| tags` |

**SCEN TCs:** Required for every module with Risk ≥ MEDIUM. Write FIRST when starting a HIGH/MEDIUM module.

---

## STEP C — Gate 5 Inline *(per AC — run BEFORE moving to next AC)*

```
[AC-ID] Gate 5:
✓/✗ Floor met — wrote [N] TCs, DR Floor = [N]
✓/✗ Design supplement items covered (or "n/a")
✓/✗ API status codes covered (or "n/a")
✓/✗ Condition Matrix branches covered (or "n/a")
✓/✗ Dependency Map CoveredBy filled for this AC's rows
✓/✗ RTM: AC marked ✓ Covered
Status: [✓ PASS] / [✗ FIX: describe what's missing]
```

**If Gate 5 FAILS:** Fix immediately. Do not defer.

---

## Gate Module (after all ACs in a module)

In response (both modes):
```
✅ Module [ID] — [Name] complete
Total: [N] TCs — FUNC:[N] / SEC:[N] / UI:[N] / EDGE:[N] / SCEN:[N]
[In FILE MODE: "Written to test-cases/test-cases.md"]
Proceed to next module? → [Next module ID]
```

**DO NOT automatically move to next module without QA approval.**

---

## Phase 6 — Final Review *(after ALL modules complete)*

*Follow refs/quality_gates.md for Pre-finalization Checklist and 9 Quality Patterns.*

**In FILE MODE — Final response shows:**
```
### [FINAL TEST SUITE] — Summary

Output file: [link to test-cases/test-cases.md]

Coverage: [N total TCs] — FUNC:[N] SEC:[N] UI:[N] EDGE:[N] SCEN:[N]
By Priority: H:[N] M:[N] L:[N]
By Module: [module: N TCs (risk level)]
Top Risks: [list from MASTER CONTEXT]
Clarification Questions: [unresolved ambiguities]
Automation Candidates: [SCEN + FUNC HIGH priority TCs — IDs only]
RTM: [N]/[N] REQs covered
```

**In INLINE MODE — Final response shows:**
Full [FINAL TEST SUITE] with TC tables grouped by module.

---

## ⚡ xlsx Generation — Separate Step

After all TCs are written to file:
- Do NOT generate xlsx inline with TC generation (saves ~10,000 tokens)
- Suggest: *"TCs are complete in test-cases/test-cases.md. Run xlsx generation separately to convert to Excel."*
- xlsx generation reads from the .md file — no need to re-hold all TC data in context
