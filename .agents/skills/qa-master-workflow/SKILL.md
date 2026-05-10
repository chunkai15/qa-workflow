---
name: qa-master-workflow
description: >
  Use this skill when user wants to run the COMPLETE end-to-end QA pipeline — from raw spec to
  final test cases. This is the orchestrator skill that guides through all 6 phases in order.
  Trigger when user says: "run full QA pipeline", "start QA process from scratch",
  "run the full QA workflow", "I want to test this feature end to end",
  "help me test this feature completely", "full QA workflow", "qa pipeline",
  or when they have a spec/requirement and want comprehensive test coverage without knowing which
  individual skill to use. Also trigger when user wants guidance on which QA skill to use next.
  This skill does NOT replace the individual skills — it ORCHESTRATES them in the correct order.
---

# QA Master Workflow — Pipeline Orchestrator

You are a **QA Pipeline Orchestrator** guiding a QA engineer through the complete 6-layer pipeline from spec to final test suite.

---

## 6-Layer Architecture

```
LAYER 1: INPUT & CONTEXT          → @qa-context-builder
LAYER 2: STRATEGY & DECOMPOSE     → @qa-strategy-decomposer
LAYER 3: DEEP ANALYSIS            → @qa-deep-analyzer
LAYER 4: SCENARIO DESIGN          → @qa-scenario-designer
LAYER 5: TC GENERATION            → @qa-testcase-generator
LAYER 6: (Built into Layer 5)     → Final Review in qa_testcase_generator
```

---

## Payload Flow

```
[MASTER CONTEXT]              ← Output of Layer 1
        ↓
[MODULE LIST]                 ← Output of Layer 2
[MODULE RISK REGISTER]        ← Output of Layer 2
        ↓
[DEEP ANALYSIS PACKAGE]       ← Output of Layer 3
 - AC Type Matrix
 - DR blocks (Q1-Q12 adaptive)
 - Dependency Map
 - Triggered Artifacts
 - RTM (starts Uncovered)
        ↓
[REGRESSION SUITE]            ← Output of Layer 4
[BDD SCENARIOS]               ← Output of Layer 4 (OPTIONAL — see MODE flag)
        ↓
[FINAL TEST SUITE]            ← Output of Layer 5
 - 9-column TC tables (English)
 - Written directly to file (not in response)
 - RTM (all Covered)
 - Final Summary
```

---

## ⚡ SESSION MODE — Choose Before Starting

**⚠️ MANDATORY FIRST STEP:** Assess feature size, then select mode. Wrong mode = context overflow.

| Mode | ACs | Modules | Context/session | Sessions | Est. total tokens |
|---|---|---|---|---|---|
| **MODE S** | ≤5 | ≤3, all LOW/MED | <25k | 1 | 10k–20k |
| **MODE M** | 6–15 | 4–6, any HIGH | <12k | 3–4 | 25k–40k |
| **MODE L** | 16–40 | 7–10 | <12k | 5–7 | 50k–80k |
| **MODE XL** | >40 | 10+ | <12k | 8–12 → split into Epics | 70k–100k |

**Default: MODE M** for any feature with HIGH-risk modules or ≥6 ACs.
**Large/XL features:** Use MODE L or split into Epics before starting pipeline.

---

### MODE S — Single Session

Run all layers sequentially in one session. Apply Context Pruning Rule (see below) at each layer boundary to prevent accumulation. Suitable for: hotfix verification, small UI features, single-module changes.

---

### MODE M — Multi-Session (Recommended for real features)

Split pipeline at these **natural file-save boundaries**:

```
SESSION 1 — Layer 1 + Layer 2
  Inputs:  spec / Figma / user notes
  Outputs: analysis.md  (Master Context + Module List + Risk Register)
  Ends:    Context pruned → "Session 1 done. Start Session 2 to continue from Layer 3."

SESSION 2 — Layer 3
  Inputs:  Read analysis.md
  Outputs: analysis.md updated (append Deep Analysis Package to same file)
  Ends:    Context pruned → "Session 2 done. Start Session 3 for Scenarios + TCs."

SESSION 3 — Layer 4 + Layer 5
  Inputs:  Read analysis.md (contains Layers 1-3)
  Outputs: regression-suite.md + test-cases.md (written to file, NOT echoed in response)
  Ends:    Context pruned → "Session 3 done. Start Session 4 to generate xlsx."

SESSION 4 — xlsx generation (optional)
  Inputs:  Read test-cases.md
  Outputs: {feature}-test-cases.xlsx
```

**Context budget per MODE M session:** ≤12,000 tokens

---

### MODE L — Large Feature (16–40 ACs, 7–10 modules)

Layer 3 must be sub-grouped. Layer 5 must be split by module group.

```
SESSION 1  — Layer 1 + Layer 2
  Output:  analysis.md (Master Context + full module list + Risk Register)

SESSION 2a — Layer 3: Sub-group 1 (HIGH-risk ACs first, ≤8 ACs)
  Input:   Read analysis.md
  Output:  analysis.md appended (DR group 1 + partial Dependency Map)
  Ends:    Context pruned → compact ref stored

SESSION 2b — Layer 3: Sub-group 2 (next ≤8 ACs)
  Input:   Read analysis.md compact summary of group 1 only (≤300 tokens)
  Output:  analysis.md appended (DR group 2)

SESSION 2c — Layer 3: Sub-group 3 (remaining ACs)
  Input:   Read analysis.md compact summary of groups 1+2
  Output:  analysis.md appended (DR group 3 + full Dependency Map + RTM)

SESSION 3a — Layer 4 + Layer 5: HIGH-risk modules only (≤4 modules)
  Input:   Read analysis.md rolling context ref (key rules + risk register, ≤300 tokens)
  Output:  regression-suite.md + test-cases-high.md (FILE MODE)

SESSION 3b — Layer 5: MEDIUM/LOW modules (remaining)
  Input:   Read test-cases-high.md (TC count summary) + analysis.md compact ref
  Output:  test-cases.md (merged, complete)

SESSION 4  — xlsx generation
  Input:   Read test-cases.md
  Output:  {feature}-test-cases.xlsx
```

**Context budget per MODE L session:** ≤12,000 tokens

#### Rolling Context Window Rule (MODE L sessions 3+)

When a session needs context from multiple prior sessions, use **compact ref format**:

```
[ROLLING CONTEXT — Session 3a]
Feature: {1-line summary}
Key Rules: R1. [rule] | R2. [rule] | R3. [rule] (max 5 rules, 1 line each)
State Transitions: T1-T5 (1 line each, only if relevant to current modules)
Risk Register: MOD_X=HIGH | MOD_Y=HIGH | MOD_Z=MEDIUM
[Full content in analysis.md — do NOT re-expand in context]
```

**Target:** ≤300 tokens for rolled-up context ref vs ≥10,000 tokens for full analysis carry.

---

### MODE XL — Extra Large Feature (>40 ACs)

**Do NOT start pipeline directly on an XL feature.** Epic Split first.

```
Step 0 — Epic Split (before Session 1)
  → Break feature into 2–4 Epics, each ≤15 ACs
  → Each Epic gets its own project folder: projects/{squad}/{epic}/
  → Run MODE M pipeline independently per Epic

Step Final — Merge Regression Suites
  → Combine regression-suite.md files from all Epics
  → Generate single merged xlsx
```

**Why split:** With >40 ACs, the Dependency Map becomes too large for reliable analysis. Splitting by Epic also aligns test execution with sprint deliverables.

---

### ✂️ Context Pruning Rule — Apply at EVERY layer boundary

After saving a layer's output to file, **replace** the verbose in-context version with a compact tag:

```
[Layer N output → saved to {file_path}]
[Summary: {1-2 line summary of what was produced}]
[Load with Read tool if detail is needed — do NOT re-generate]
```

**Example after Layer 3:**
```
[Layer 3 — Deep Analysis saved to projects/payment/billing-ab-test/analysis.md]
[9 ACs analyzed: 7 HIGH / 1 MED / 1 LOW | 8-row Dependency Map | RTM 14 REQs mapped]
[Load with Read tool if detail needed — do NOT re-generate]
```

This removes ~8,000–12,000 tokens of DR blocks from being carried into Layers 4+5.

---

### MODE M — Session Startup Protocol (Sessions 2/3/4)

At the start of every continuation session, ALWAYS:
1. `Read projects/{squad}/{project}/analysis.md`
2. `Read projects/{squad}/{project}/HANDOFF.md`
3. State: "Resuming from Layer [X]. Previous: [1-line summary]. Starting: [next step]."

Do **NOT** re-generate any content that is already saved to files.

---

## Review Gates

| Gate | After step | Required QA action |
|---|---|---|
| Gate 1a | Ambiguity Scan | Answer QnA questions |
| Gate 1b | Master Context | Approve or revise |
| Gate 2a | Strategy proposal | Choose 1 of 2-3 strategies |
| Gate 2b | Module structure draft | Approve or revise |
| Gate 2c | Module Risk Register | Approve |
| Gate 3 | GAP Analysis | Address GAPs and approve |
| Gate 4A | Regression tier assignment | Approve tier list |
| Gate 4B | BDD Gherkin (if enabled) | Approve or skip — see BDD flag |
| Gate 5 | Per AC (inline) | Auto-pass or fix before next AC |
| Gate Module | Per module | Approve or adjust TCs |

---

## Running the Pipeline

### MODE S — Single Session

Orchestrator reads and follows all 5 individual skills in sequence. Apply Context Pruning after each layer output is saved.

### MODE M — Multi-Session

Follow the SESSION 1→2→3→4 split above. Each session reads from files, not from context.

---

## Design Principles

1. **Review Gates are mandatory** — DO NOT auto-run through multiple phases without QA approval
2. **Payload inheritance** — every phase inherits the finalized payload from the previous phase, no re-analysis
3. **Language** — Analysis/communication: English. TC output: English
4. **Adaptive depth** — LOW-risk ACs: 7Q COMPACT. MEDIUM: 10Q COMPACT. HIGH: 12Q FULL. See adaptive_reading.md.
5. **Token efficiency** — Load refs only when triggered. Apply Context Pruning at every layer boundary.
6. **File-first output** — TC tables always written to file, never echoed in full to response.
7. **BDD is optional** — Skip Phase 4B unless user explicitly requests automation scenarios.

---

## Quick Reference — Entry Points

| User already has | Next skill |
|---|---|
| Only spec/requirement | `@qa-context-builder` |
| Has [MASTER CONTEXT] | `@qa-strategy-decomposer` |
| Has [MODULE LIST] + [RISK REGISTER] | `@qa-deep-analyzer` |
| Has [DEEP ANALYSIS PACKAGE] | `@qa-scenario-designer` |
| Has [REGRESSION SUITE] | `@qa-testcase-generator` |
| Has some TCs, wants coverage check | `@qa-deep-analyzer` (Mode B review) |

---

## Token Budget — Updated Estimates

| Feature size | Mode | Est. total tokens | Per session |
|---|---|---|---|
| Small (≤5 ACs, 2-3 modules) | MODE S | 10,000–18,000 | — |
| Medium (6-15 ACs, 4-6 modules) | MODE M | 25,000–40,000 | 8,000–12,000 |
| Large (16-40 ACs, 7+ modules) | MODE M | 40,000–70,000 | 10,000–15,000 |
| XL (>40 ACs) | MODE M + sub-groups | 70,000–100,000 | 12,000–18,000 |
