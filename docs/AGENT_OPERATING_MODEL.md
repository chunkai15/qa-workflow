# Agent Operating Model — QA Harness

> Version: 2.0 | Updated: 2026-05-10
> This is the single source of truth for how agents execute work in this repository.
> Humans steer. Agents execute. Do not rely on chat history.

---

## Part 1 — Universal Task Loop (Always Run First)

Every request — regardless of type — must pass through this 7-step loop before any skill is invoked.

```
1. READ      → projects/_dashboard.md  +  HANDOFF.md of the relevant project
2. CLASSIFY  → docs/QA_INTAKE.md       → determine Input Type + Risk Lane
3. LOCATE    → spec.md / analysis.md / TEST_MATRIX.md in the project folder
4. CHECK     → TEST_MATRIX.md          → what is already covered vs what is missing
5. WORK      → invoke the correct Workflow (see Part 2) within the classified lane
6. VERIFY    → docs/VALIDATION_LADDER.md → run the appropriate proof command
7. UPDATE    → TEST_MATRIX.md + HANDOFF.md + _dashboard.md (if phase changed)
```

**If you get stuck at any step:** Do NOT guess. Log the friction to `docs/HARNESS_BACKLOG.md` and surface the blocker to the human.

---

## Part 2 — Workflow Map (7 Workflows)

Use the trigger phrases below to route to the correct workflow.

| Trigger | Workflow |
|---|---|
| Need fast high-level understanding, gaps, risks, or strategy packaging first | **WF-0: High-Level Strategy Analysis** |
| New spec / Jira epic / feature doc received | **WF-1: New Feature QA Pipeline** |
| Bug found / Slack thread / video evidence | **WF-2: Bug Report** |
| Daily standup report needed | **WF-3: DSU Daily Report** |
| BDD / `.feature` file ready for automation | **WF-4: Automation Script Generation** |
| Playwright test is failing / flaky | **WF-5: Test Healer** |
| Question about a feature / spec clarification | **WF-6: Feature Q&A** |

---

## WF-0: High-Level Strategy Analysis

**Trigger:** "analyze this feature high level", "review spec first", "build a strategy xmind", "find gaps and risks before test cases", "prepare strategy output", or when the desired outputs are `high-level-strategy-analysis.md` and `.xmind`.

**Skill used:**

```text
@qa-high-level-strategy-analyst
```

### Step-by-Step Execution

**Step 1 — Read the source set:**
- spec / PRD / BA notes / Jira / Confluence / design notes
- existing project `analysis.md` only as supporting context, not as an unquestioned source

**Step 2 — Produce high-level strategic analysis:**
- feature summary
- high-level business flow
- gaps and missing logic
- conflicts and ambiguities
- clarification items and recommendations
- high-level scenarios
- testing technique reference
- risk assessment
- edge cases and race conditions

**Step 3 — Package strategic artifacts:**

```text
projects/{squad}/{project}/strategy/
  high-level-strategy-analysis.md
  strategy-tree.json
  {feature-slug}-test-strategy.xmind
```

Project root placement is acceptable when the user does not want a `strategy/` subfolder.

**Step 4 — Reuse downstream when needed:**
- `high-level-strategy-analysis.md` may be used as one of the inputs to `@qa-context-builder` or `@qa-strategy-decomposer`
- `.xmind` may be used during strategy review, risk review, or scenario planning
- These artifacts do **not** replace the mandatory outputs of `WF-1`

### Validation

- Confirm the markdown contains the required sections.
- Confirm the `.xmind` tree contains the required top-level branches in the required order.
- Confirm the generator script ran successfully.

---

## WF-1: New Feature QA Pipeline

**Trigger:** "Tôi có spec mới", "analyze this feature", "write test cases", "start QA", "run full pipeline", shares a Jira epic, Confluence link, or `.md` spec file.

**Skills used (in order):**

```
@qa-master-workflow (orchestrator)
  → @qa-context-builder        Layer 1: Master Context
  → @qa-strategy-decomposer    Layer 2: Module List + Risk Register
  → @qa-deep-analyzer          Layer 3: Deep Analysis Package
  → @qa-scenario-designer      Layer 4: Regression Suite + BDD Scenarios
  → @qa-testcase-generator     Layer 5: Final Test Suite (9-column TC tables)
```

**Optional: Jira Epic Snapshot first**
If the input is a Jira epic key (e.g., `PAY-xxx`), run `@jira-epic-story-snapshot` BEFORE `@qa-context-builder` to get a compact spec snapshot saved to the project folder. This replaces manually copying content from Jira.

### Step-by-Step Execution

**Step 1 — Size Assessment (before any work):**
Count ACs and modules to select Session Mode:

| Mode | ACs | Sessions | When to use |
|---|---|---|---|
| **MODE S** | ≤5 ACs, ≤3 LOW/MED modules | 1 | Hotfix, small UI change |
| **MODE M** | 6–15 ACs, up to HIGH risk | 3–4 | Standard feature |
| **MODE L** | 16–40 ACs | 5–7 | Large feature |
| **MODE XL** | >40 ACs | Split into Epics first | Complex epic |

**Step 2 — Run the pipeline per Mode (see `@qa-master-workflow` for session split details)**

**Step 3 — Save outputs to project folder:**
```
projects/{squad}/{project}/
  analysis.md          ← Layers 1–3 output
  test-cases/
    regression-suite.md
    test-cases.md
    {feature}-test-cases.xlsx  (optional)
```

**Step 4 — Update harness:**
- `TEST_MATRIX.md`: change all tested ACs from `not-covered` → `tc-written`
- `HANDOFF.md`: record session summary, deliverables, decisions, open clarifications
- `_dashboard.md`: update project phase (e.g., `spec-ready` → `analysis-done`)

### Review Gates (Human approval required)

| Gate | After | QA must do |
|---|---|---|
| Gate 1a | Ambiguity Scan | Answer all critical questions |
| Gate 1b | Master Context | Approve before Layer 2 starts |
| Gate 2a | Strategy proposal | Choose 1 of 2–3 strategies |
| Gate 2b | Module structure | Approve or revise |
| Gate 2c | Risk Register | Approve |
| Gate 3 | GAP Analysis | Address gaps and approve |
| Gate 4A | Regression tier assignment | Approve tier list |
| Gate 4B | BDD Gherkin | Approve or skip |
| Gate 5 | Per AC (inline) | Auto-pass or fix |
| Gate Module | Per module | Approve TCs |

---

## WF-2: Bug Report

**Trigger:** "Tôi tìm thấy bug", "log bug", "có lỗi", shares screenshot/video/Slack thread, "write bug report", "tạo Jira ticket".

**Skills used:**

```
@jira-epic-story-snapshot  (optional: if story context needed)
  → @qa-bug-report-generator  → Draft → Human review → Create Jira ticket
```

### Step-by-Step Execution

**Step 1 — Gather evidence:**
Normalize input into: source type, product area, affected behavior, current result, reproduction path.

**Step 2 — Determine ticket type:**
- `Bug`: incorrect system behavior
- `Task`: confirmed follow-up work or product alignment
- `Improvement`: user frames it explicitly as improvement

**Step 3 — Resolve project context:**
Load `references/projects/{project}.yaml` to get correct Jira field IDs, QA user, Sprint field.

**Step 4 — Check for feature snapshot:**
If a `docs/{feature}-snapshot.md` exists in the repo → use it to resolve `Parent`, `Relates`, `Assignee` BEFORE querying Jira live.

**Step 5 — Draft report (ALWAYS draft first, NEVER create directly):**

```
Title: [behavior-based, not UI label]
Environment: Module / Platform / Env
Preconditions: ...
Steps to Reproduce: 1. 2. 3.
Actual Result: ...
Expected Result: ...
Impact: ...
QA Note: (optional)
```

**Step 6 — Human review → approve draft**

**Step 7 — Create Jira ticket** (only after explicit approval):
Resolve: `Project`, `Issue Type`, `Parent`, `Sprint`, `QA`, `Assignee`, `Priority`, `Relates`.
After creation: send Slack reply draft: `"Bug logged! → [KEY] | Assigned to [Name]"`

### Output Location
```
projects/{squad}/{project}/bugs/
  {TICKET-KEY}-{short-title}.md
```

---

## WF-3: DSU Daily Report (Daily Standup)

**Trigger:** "DSU", "daily report", "báo cáo hôm nay", "pull Jira activity", "log work hôm nay", mentions a specific date.

**Skills used:**

```
@jira-calendar-daily-report
  → MCP Jira: fetch Created / QA success / QA failed for PAY + MP
  → MCP Google Calendar: fetch meetings for the day
  → Format report → (optional) Worklog draft
```

### Step-by-Step Execution

**Step 1 — Determine target date** (default: today, Asia/Ho_Chi_Minh).

**Step 2 — Fetch Jira activity** using `mcp__atlassian__searchJiraIssuesUsingJql` for each board:
- Projects: `PAY`, `MP`
- Statuses: `Created`, `QA success`, `QA failed`
- Use `currentUser()` in JQL

**Step 3 — Fetch Calendar** using `mcp__google_workspace__calendar_listEvents`:
- `calendarId: "primary"`, full day, include tentative/needsAction

**Step 4 — Format report:**
```
Report date: YYYY-MM-DD

## PAY
Created (Total: X):  [KEY](url) | Priority | Title
QA success (Total: Y): ...
QA failed (Total: Z): ...

## MP
...

## Calendar hôm nay (Total: N)
HH:MM - HH:MM (duration) - title
```

**Step 5 — (Optional) Worklog draft** (only if user asks):
```
KEY | Date | Bucket | Time | Note
PAY-xxx | 2026-05-10 | QA success | 15m | verify ticket success ...
```

**Step 6 — Human confirms worklog → log to Jira** (NEVER auto-log without confirmation)

---

## WF-4: Automation Script Generation

**Trigger:** "Generate automation", "viết Playwright test", "gen test script", has a `.feature` file or BDD scenarios ready, "chạy auto test".

**Skills used:**

```
@qa-auto-test-generator (orchestrator)
  Stage 1: @playwright-context-builder  → context-bundle.json + context-bundle.md
  Stage 2: @playwright-test-builder     → BasePage + Page Objects + Fixtures + Specs
  Stage 6: @playwright-test-healer      → Debug & repair if tests fail
```

**Prerequisite:** A valid `.feature` file must exist in `projects/{squad}/{project}/automation/input/`.
If no `.feature` file exists yet: use WF-1 Layers 4B to generate BDD scenarios first.

### Step-by-Step Execution

**Stage 1 — Context Capture** (`@playwright-context-builder`):
1. Parse BDD intent (scenarios, routes, UI entities)
2. Launch Playwright MCP → explore live staging URL
3. Capture stable selectors (priority: `data-testid` > `aria-label` > role > CSS)
4. Detect dynamic content, modals, iframes, React state issues
5. Output: `automation/runs/{run-id}/context-bundle.json` + `context-bundle.md`

**Planning Gate** (human must approve before Stage 2):
Review `context-bundle.md`:
- Coverage gaps noted?
- Low-confidence selectors flagged?
- Integration hints (CAPTCHA, OAuth, payment iframe) documented?

**Stage 2 — Script Generation** (`@playwright-test-builder`):
1. Generate `BasePage.ts` (shared utilities)
2. Generate Page Object Models (one per page)
3. Generate fixtures and auth helpers
4. Generate `.spec.ts` test files
5. Output: `automation/runs/{run-id}/`

**Stage 3 — Validation** (see `VALIDATION_LADDER.md`):
```bash
npm run verify:generated   # type-check generated TypeScript
npm run pipeline           # execute Playwright against staging
```

**Stage 6 — Healing** (if tests fail, use `@playwright-test-healer`):
1. Reproduce failure with Playwright MCP
2. DOM-first debugging (NEVER guess selectors — dump real DOM first)
3. Root cause: selector change / timing / React state / business rule
4. Repair (max 2 attempts per test)
5. Re-run 3 times to confirm not flaky
6. If unresolvable: mark `test.fixme()` with comment

### Output Location
```
projects/{squad}/{project}/automation/
  input/
    {feature}.feature          ← BDD input
  runs/
    {run-id}/
      context-bundle.json
      context-bundle.md
      {Page}Page.ts
      {feature}.spec.ts
```

**Update TEST_MATRIX.md after successful run:**
- `automation-ready` → `automated`
- Add evidence path (run-id/results.json)

---

## WF-5: Test Healer (Standalone)

**Trigger:** "Test bị fail", "fix flaky test", "test broken after deploy", "sửa Playwright test", shares an error log.

This workflow is a standalone invocation of the healer outside of WF-4.

**Skills used:**
```
@playwright-test-healer
  → Playwright MCP Server (live browser debugging)
```

**Inputs required:**
- Path to failing `.spec.ts`
- Error log / stack trace
- Staging URL being tested

**Protocol:** Follow Phase 1–4 in `@playwright-test-healer/SKILL.md` exactly.
After fix confirmed: update `TEST_MATRIX.md` evidence column.

---

## WF-6: Feature Q&A

**Trigger:** "Feature X hoạt động như thế nào?", "AC này nghĩa là gì?", "tìm spec của tính năng Y", "explain this ticket", general questions about product behavior.

**No skills invoked — read-only workflow.**

### Retrieval Order

1. `projects/{squad}/{project}/HANDOFF.md` — session state + key decisions
2. `projects/{squad}/{project}/spec.md` — source specification
3. `projects/{squad}/{project}/analysis.md` — QA analysis + Master Context
4. `docs/shared/{squad}/domain.md` — squad domain knowledge
5. `docs/shared/common/glossary.md` + `business_rules.md` — cross-squad rules
6. Jira live lookup via MCP (only if not in repo) → `@jira-epic-story-snapshot` to save result

**Rules:**
- Never invent behavior not documented in the above sources.
- Surface gaps: "This is not documented in the spec. The closest reference is [X]. Please confirm with Dev/BA."
- If the answer requires reading a Confluence page not in the repo → snapshot it first using `@jira-epic-story-snapshot`, save to `projects/{squad}/{project}/`, then answer.

---

## Part 3 — Done Definition

A task is done ONLY when ALL of the following are true:

- [ ] The requested deliverable exists and is saved to the correct project folder
- [ ] `TEST_MATRIX.md` is updated with new coverage status
- [ ] `HANDOFF.md` reflects current state (what changed, decisions, open blockers, next steps)
- [ ] `_dashboard.md` is updated if the project phase changed
- [ ] The applicable `VALIDATION_LADDER.md` proof step was run (or explicitly noted as not possible)
- [ ] Any friction encountered is logged in `docs/HARNESS_BACKLOG.md`

---

## Part 4 — Skill Quick Reference

| Skill | When to use |
|---|---|
| `@qa-master-workflow` | Full pipeline from spec to test suite |
| `@qa-context-builder` | Layer 1: analyze spec → Master Context |
| `@qa-strategy-decomposer` | Layer 2: decompose into modules + risk register |
| `@qa-deep-analyzer` | Layer 3: deep reading per AC + dependency map |
| `@qa-scenario-designer` | Layer 4: regression suite + BDD Gherkin |
| `@qa-testcase-generator` | Layer 5: 9-column TC tables |
| `@qa-bug-report-generator` | Bug reports → Jira tickets |
| `@jira-calendar-daily-report` | DSU daily activity report + worklog draft |
| `@jira-epic-story-snapshot` | Snapshot a Jira epic → reusable markdown |
| `@qa-auto-test-generator` | Orchestrate full automation: context → script |
| `@playwright-context-builder` | Stage 1: capture selectors from live UI |
| `@playwright-test-builder` | Stage 2: generate POM + spec files |
| `@playwright-test-healer` | Fix failing/flaky Playwright tests |
| `@playwright-best-practices` | Reference guide for Playwright patterns |
