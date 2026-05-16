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

You are a **QA Pipeline Orchestrator** guiding a QA engineer through the complete 6-layer pipeline.

---

## ⚡ Pipeline Response Discipline — File-First Throughout

**Core rule for every layer: write analysis to file, log only at gate stops.**

```
Analysis content (every layer):
  L1+L2 → analysis.md        (create + append)
  L3     → analysis.md        (append to existing)
  L4     → regression-suite.md (create + append)
  L5     → test-cases/test-cases.md (create + append)

Chat output only at:
  → GATE stops: compact summary (≤8 lines) + file reference
  → QnA stops: questions that need user answers
  → Module gates (L5): compact summary + proceed question

Why this matters: logging full analysis to chat doubles token cost — generated once,
then re-read from chat history on every subsequent step. This discipline saves 40-60% 
of per-session token usage while maintaining full output quality.
```

---

## 6-Layer Architecture

```
LAYER 1: INPUT & CONTEXT       → @qa-context-builder     → analysis.md (create)
LAYER 2: STRATEGY & DECOMPOSE  → @qa-strategy-decomposer → analysis.md (append)
LAYER 3: DEEP ANALYSIS         → @qa-deep-analyzer        → analysis.md (append)
LAYER 4: SCENARIO DESIGN       → @qa-scenario-designer    → regression-suite.md (create)
LAYER 5: TC GENERATION         → @qa-testcase-generator   → test-cases/test-cases.md (create)
LAYER 6: (Built into Layer 5)  → Final Review
```

---

## ⚡ PRE-PIPELINE SCOPE GATE

```
Count total ACs before selecting MODE.
  ≤20 ACs → select SESSION MODE → proceed.
  >20 ACs → MANDATORY STOP.

"Feature has [N] ACs (>20 limit). Split into Epics (≤15 ACs) first.
 Epic A = US01–US05 | Epic B = US06–US10
 → Confirm split to continue."
```

---

## SESSION MODE

| Mode | ACs | Modules | Sessions | Est. tokens |
|---|---|---|---|---|
| **MODE S** | ≤5 | ≤3 LOW/MED | 1 | 10k–20k |
| **MODE M** | 6–15 | 4–6 any HIGH | 3–4 | 25k–40k |
| **MODE L** | 16–20 | 7–10 | 5–7 | 50k–80k |
| **MODE XL** | >20 | → Epic Split first | — | — |

**Default: MODE M** for any feature with HIGH modules or ≥6 ACs.

---

### MODE M — Multi-Session

```
SESSION 1 — Layer 1 + Layer 2
  Input:   spec / Figma / user notes
  Output:  analysis.md (MASTER CONTEXT + MODULE LIST + RISK REGISTER + Technique Map)
  Ends:    [GATE 2c compact summary] → "Session 1 done. Start Session 2 for Layer 3."

SESSION 2 — Layer 3
  Input:   Read analysis.md
  Output:  analysis.md appended (DEEP ANALYSIS PACKAGE v3)
  Ends:    [GATE 3b compact summary] → "Session 2 done. Start Session 3 for L4+L5."

SESSION 3 — Layer 4 + Layer 5
  Input:   Read analysis.md + regression-suite.md (if exists)
  Output:  regression-suite.md + test-cases/test-cases.md
  Ends:    [FINAL TEST SUITE compact summary]

SESSION 4 — xlsx generation (optional)
  Input:   Read test-cases/test-cases.md
  Output:  {feature}-test-cases.xlsx
```

**Context budget per session:** ≤12,000 tokens (written content is in files, not re-read into chat).

---

## Layer Handoff Artifacts

```
L1 → L2: analysis.md contains [MASTER CONTEXT] with Then-bullet Inventory + min_hints
L2 → L3: analysis.md contains [MODULE LIST] + [RISK REGISTER] + Tiers + Technique Map
L3 → L4: analysis.md contains [DEEP ANALYSIS PACKAGE v3] (BU + DR + Artifacts + DataIDs + RTM)
L4 → L5: regression-suite.md contains [REGRESSION SUITE] + SCEN/FUNC table + REQ-ID links
L5 ← Missing any artifact → raise with Khai. Do NOT compensate by re-analyzing.
```

---

## Pipeline Derive Protocol (L5 entry — per module)

```
Before writing first TC for Module X:
  1. Read BU blocks from analysis.md
  2. Map Q6 O-list items → TC slots
  3. Map Q6 N-list items → EDGE slots
  4. Map Technique Artifact rows → TC slots
  5. Map MANDATORY Dep Map rows → TC slots
  6. Import DataIDs from Data Prerequisite Card
Empty slot = visible gap = write TC next.
DO NOT write TCs from memory or spec re-reading.
```

---

## ✂️ Context Pruning (at every layer boundary)

After saving a layer's output to file, replace verbose in-context version with compact tag:
```
[Layer N → saved to {file_path}]
[Summary: {1-2 lines}]
[Load with Read if detail needed — do NOT re-generate]
```

---

## Session Startup Protocol (Sessions 2/3/4)

1. `Read projects/{squad}/{project}/analysis.md`
2. `Read projects/{squad}/{project}/HANDOFF.md`
3. State: "Resuming Layer [X]. Previous: [1-line]. Starting: [next step]."

Do NOT re-generate content already in files.

---

## Review Gates Summary

| Gate | Layer | Chat output |
|---|---|---|
| Scope Gate | Pre-L1 | Split request (if >20 ACs) |
| Gate 1a | L1 | Critical questions only |
| Gate 1b | L1 | Compact stats (4 lines) |
| Gate 2a | L2 | 2 strategy options |
| Gate 2b | L2 | Module names only |
| Gate 2c | L2 | Risk/TC counts (3 lines) |
| Gate 3a | L3 | Technique adjustments |
| Gate 3b | L3 | Package stats (4 lines) |
| Gate 4A | L4 | Tier counts (3 lines) |
| Gate 4B | L4 | Gherkin count (if BDD) |
| Gate 5 v2 | L5 per-AC | 1 line per AC |
| Gate Module | L5 per-module | Compact summary + proceed? |

---

## Quick Reference — Entry Points

| User has | Start with |
|---|---|
| Only spec | `@qa-context-builder` |
| Has MASTER CONTEXT in analysis.md | `@qa-strategy-decomposer` |
| Has MODULE LIST + RISK REGISTER | `@qa-deep-analyzer` |
| Has DEEP ANALYSIS PACKAGE v3 | `@qa-scenario-designer` |
| Has REGRESSION SUITE | `@qa-testcase-generator` |
