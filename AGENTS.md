# Agent Operating Guide (QA Harness)

> Auto-loaded by Codex, Copilot, Claude, and Antigravity. Keep under 100 lines.
> This repository uses Harness Engineering principles. The harness is the OS for agents.

## What Is This Repo?

A hybrid QA workspace for **Everfit** — manual QA artifacts + BDD-to-Playwright automation in TypeScript. Owned by **Khai Truong (QA)**.

## The Harness Map

Humans steer, agents execute. Do not rely on chat history. Read these sources of truth **in order**:

1. `projects/_dashboard.md` → Know what's active across all squads.
2. `docs/QA_INTAKE.md` → Run this BEFORE starting any new task.
3. `projects/{squad}/{project}/HANDOFF.md` → Know exactly where to continue a session.
4. `docs/AGENT_OPERATING_MODEL.md` → The 7-step Task Loop + all 7 Workflow definitions.
5. `projects/{squad}/{project}/TEST_MATRIX.md` → Check what's covered vs uncovered.
6. `docs/VALIDATION_LADDER.md` → Proof expectations before claiming "done".
7. `docs/HARNESS_BACKLOG.md` → Log friction or missing capabilities here.

## Project Structure

```
qa-workflow/
  docs/                  Harness operating system (intake, models, validation)
    shared/              Cross-project knowledge (conventions, glossaries, domain rules)
  projects/              All QA work, grouped by squad
    _dashboard.md        Global status
    marketplace/         Squad: Marketplace
    payment/             Squad: Payment
  pipeline/              Automation engine (TypeScript)
  templates/             Reusable templates (TEST_MATRIX, HANDOFF)
  .agents/skills/        15 agent skill definitions
```

## Workflows (choose by trigger)

| Trigger | Workflow |
|---|---|
| New spec / requirement, need fast strategic read first | **WF-0: High-Level Strategy Analysis** |
| New spec / Jira epic / feature doc | **WF-1: New Feature QA Pipeline** |
| Bug found / screenshot / Slack thread | **WF-2: Bug Report** |
| Daily standup / log work | **WF-3: DSU Daily Report** |
| `.feature` file ready / need automation | **WF-4: Automation Script Generation** |
| Playwright test failing / flaky | **WF-5: Test Healer** |
| Question about a feature / spec | **WF-6: Feature Q&A** |

> Full workflow instructions: `docs/AGENT_OPERATING_MODEL.md`

## Critical Rules

- Never generate tests without running QA Intake gate + reading HANDOFF.md/spec.md.
- Never report success before validation has run.
- Keep all project files inside `projects/{squad}/{project}/`.
- Don't silently resolve ambiguity — surface it in HANDOFF.md.
- Don't overwrite previous automation runs — create new run folders under `automation/runs/`.
- **Harness Friction:** If stuck or confused, log it in `docs/HARNESS_BACKLOG.md`.
- **TEST_MATRIX.md** MUST have real AC rows before any test work begins. If stub → populate first.
- **_dashboard.md** MUST be updated whenever a project phase changes.
- **HANDOFF.md** MUST be updated at the END of every session, not beginning of next.
- Decisions with cross-project impact → log to `docs/decisions/ADR-XXX.md`, not just HANDOFF.
- `.agents/workflows/wf-N-init.md` → load at workflow start for exact execution prompt.

## References

- Old to New Path Mapping: `docs/shared/common/name-mapping.md`
- Skill descriptions: `.agents/skills/{skill}/SKILL.md`
