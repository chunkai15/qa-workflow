# Harness Backlog

Use this file when an agent discovers a missing harness capability, a repeated manual step, or frequent friction. The harness should grow to eliminate friction.

## Adding an Item

Append new items to the bottom of the "Items" list using the template below.

## Template

```markdown
### Title: [Short name]
- **Discovered While:** [Task or project that exposed the gap]
- **Current Pain:** [What was hard, repeated, ambiguous, or unsafe?]
- **Suggested Improvement:** [What should be added or changed?]
- **Risk:** [tiny | normal | high-risk]
- **Status:** [proposed | accepted | implemented | rejected]
```

## Items

### Title: TEST_MATRIX is unpopulated
- **Discovered While:** Project audit across all squads
- **Current Pain:** Agent can't do coverage check because matrices are only stubs.
- **Suggested Improvement:** Add enforcement rule to QA Intake to populate TEST_MATRIX.
- **Risk:** normal
- **Status:** proposed

### Title: .xlsx files unreadable
- **Discovered While:** Reviewing session-credit-p1.1 test cases
- **Current Pain:** Checklist data locked in xlsx format is inaccessible to standard agent reading tools.
- **Suggested Improvement:** Add xlsx→md extraction step to WF-1.
- **Risk:** normal
- **Status:** proposed

### Title: No strategy validation
- **Discovered While:** Reviewing VALIDATION_LADDER.md
- **Current Pain:** Strategy quality (WF-0) is unverifiable because there's no step in the ladder for it.
- **Suggested Improvement:** Add `validate:strategy` check to the ladder.
- **Risk:** normal
- **Status:** proposed

### Title: Dashboard easily becomes stale
- **Discovered While:** Reviewing _dashboard.md updates
- **Current Pain:** Agents have wrong situational awareness because dashboard updates aren't strictly enforced.
- **Suggested Improvement:** Agent MUST update dashboard when project phase changes at end of session.
- **Risk:** normal
- **Status:** proposed

### Title: Handoff referenced missing E2 testcase artifact
- **Discovered While:** Continuing P3.1 E2 testcase generation from `analysis-E2.md`
- **Current Pain:** `HANDOFF.md` said `test-cases/test-cases-E2.md` existed, but the workspace only had E1 `test-cases/test-cases.md`; `TEST_MATRIX.md` and `regression-suite.md` were also absent.
- **Suggested Improvement:** Add a session-end proof check that verifies every listed deliverable path exists before handoff says the layer is complete.
- **Risk:** normal
- **Status:** proposed

---

## Implemented (2026-05-16)

### Title: Pipeline double-logs analysis to chat (token waste)
- **Discovered While:** P3.1 post-mortem + live pipeline run observation
- **Current Pain:** L1-L4 agents logged full analysis to chat AND wrote to file → double token cost. Full content (Business Flows, DR blocks, Dependency Map, Regression scenarios) appeared in chat unnecessarily.
- **Implemented Fix:** Response Discipline added to all 6 skill SKILL.md files. All analysis phases write to file silently. Chat output = compact gate summaries only (≤8 lines). Gate formats standardized per layer.
- **Risk:** normal
- **Status:** implemented

### Title: Shallow TC coverage from AC headline reading (RCA-1)
- **Discovered While:** P3.1 Session Credits pipeline — 2.4 TCs/AC avg, 55% ACs fully covered
- **Current Pain:** Agent read AC by headline ("system shows title, illustration, body, CTA") as 1 TC instead of 4 separate observable outcomes.
- **Implemented Fix:** Q6-Extended split protocol added to adaptive_reading.md (now in dr_protocol.md). Then-bullet Inventory added to L1 (min_hint per AC). Gate 5 v2 bullet-to-TC mapping table (non-fakeable).
- **Risk:** high
- **Status:** implemented

### Title: Technique artifacts declared but not built (RCA-2)
- **Discovered While:** P3.1 pipeline review — "Decision Table: Y" labels with no actual tables
- **Current Pain:** L3 declared technique labels (BVA/DT/ST) but didn't build the artifacts. L5 then wrote TCs from intuition.
- **Implemented Fix:** Artifact BUILD mandate in artifacts.md. Technique Validation Gate 3a added (locks techniques before Deep Reading). L5 derive protocol enforced.
- **Risk:** high
- **Status:** implemented

### Title: L3 always-loaded context too heavy (789 lines startup)
- **Discovered While:** Token optimization analysis session
- **Current Pain:** qa-deep-analyzer loaded ac_unpack.md (160 lines) + adaptive_reading.md (237 lines) + dependency.md (144 lines) = 789 lines on startup, most unused during Phase 3a.
- **Implemented Fix:** Merged ac_unpack + adaptive_reading → dr_protocol.md (217 lines). Progressive disclosure: dr_protocol loads at Phase 3b, dependency.md loads at Phase 3d. Startup context reduced from 789 → 215 lines (73% reduction).
- **Risk:** normal
- **Status:** implemented

### Title: L5 always-loaded context too heavy (929 lines startup)
- **Discovered While:** Token optimization analysis session
- **Current Pain:** qa-testcase-generator loaded writing_rules.md + techniques.md + quality_gates.md = 929 lines on startup, but Phase 5a (Context Review) needs none of writing_rules or quality_gates.
- **Implemented Fix:** techniques.md trimmed (10 Rules + 15 Edge → test_catalog.md on-demand). writing_rules.md deferred to STEP B start. quality_gates.md deferred to STEP C first run. Startup reduced from 929 → 405 lines (56% reduction).
- **Risk:** normal
- **Status:** implemented
