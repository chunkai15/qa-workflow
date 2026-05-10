---
name: qa-high-level-strategy-analyst
description: >
  Analyze a feature spec, requirement document, Jira/Confluence content, design note, or mixed
  product inputs at a high level before the full QA pipeline begins. Use when Codex needs to
  understand a feature quickly, surface business flow, gaps, conflicts, ambiguity, risks, edge
  cases, and strategic test direction without generating detailed test cases yet. Trigger when the
  user says: "analyze this feature high level", "review spec first", "build a test strategy",
  "give me a strategy xmind", "understand this requirement before TCs", "find gaps and risks",
  "prepare strategy output", or when the desired outputs are
  `high-level-strategy-analysis.md` and `.xmind`. This skill creates pre-pipeline strategy
  artifacts that can be used as one of the inputs for `@qa-master-workflow`.
---

# QA High-Level Strategy Analyst

Produce a fast, reviewable strategic read of a feature before committing to the full QA pipeline.

## File Map

```text
SKILL.md                           <- this file
references/
  analysis-method.md              <- load immediately
  analysis-output-contract.md      <- load immediately
  xmind-output-contract.md         <- load immediately
  mermaid-patterns.md             <- load only when the feature needs a flow diagram
  validation.md                    <- load when packaging outputs
scripts/
  build_xmind.py                   <- use to generate .xmind from a strategy tree payload
assets/
  test-strategy-template.xmind     <- default template for .xmind generation
```

**On startup:** Read this file, then read `references/analysis-method.md`,
`references/analysis-output-contract.md`, and `references/xmind-output-contract.md`.

## Purpose

Use this skill to answer four questions quickly:

1. What does this feature do at a business level?
2. What is missing, conflicting, or risky in the spec?
3. What should QA focus on before detailed TC work starts?
4. How should that strategy be packaged into markdown and XMind artifacts?

## Token Discipline

Keep the output dense and reviewable:

- Limit source inventory to the sources actually used.
- Limit high-level flows to 3-7 distinct flows.
- Limit canonical rules to the rules that truly govern behavior.
- Limit risks to the top 5-8 review-relevant risks.
- Do not restate the same rule in multiple sections unless the repetition changes the decision.
- Use short source labels such as `Spec`, `BE Flow`, `State Diagram`, `Note` instead of long citations.
- Add diagrams only when they compress complexity better than text.

## Output Contract

Always produce these two artifacts unless the user explicitly asks for only one:

1. `high-level-strategy-analysis.md`
2. `{feature-slug}-test-strategy.xmind`

The markdown artifact is the narrative source of truth.
The `.xmind` artifact is the visual strategy map derived from the same conclusions.

## Required Inputs

Any of these are sufficient to begin:

- `spec.md`, requirement markdown, PRD, BA notes
- Jira or Confluence content
- exported documents, screenshots, design notes
- existing project `analysis.md` that needs a high-level strategic pass

If the source is weak or fragmented, proceed with analysis and explicitly log what is missing.
Do not block unless the user asks for a final sign-off based on incomplete inputs.

## Operating Modes

### Mode A — Dual Output (default)

Create both `high-level-strategy-analysis.md` and `.xmind`.

### Mode B — Analysis Only

Create only the markdown artifact.

### Mode C — XMind Only

Use when the markdown source already exists and needs to be converted into `.xmind`.

## Workflow

### Phase 0 — Intake and Source Priority

Determine source priority before analysis:

`API contract > product spec > solution design > Jira notes > existing tests > ad hoc comments`

If sources disagree, keep both interpretations visible under `Conflicts & Ambiguities`.
Build a compact source inventory using `references/analysis-method.md`.

### Phase 1 — Feature Orientation

Write a compact orientation before deeper analysis:

- Feature purpose statement
- Primary actor(s)
- High-level business flow(s)
- Main system surfaces touched
- Failure consequence summary

Keep this high level. Do not decompose into full module maps yet.
Before moving on, extract the minimum set of canonical flows and rules needed to explain the feature.

### Phase 2 — Strategic Analysis

Read the source with a strategy lens, not a TC lens.

Use the method in `references/analysis-method.md`.

Capture:

- missing business rules
- missing system behavior
- conflicts across sources
- assumptions required to continue
- likely regression zones
- risk concentration areas
- edge and concurrency conditions

Do not write detailed test cases in this phase.
Every gap, conflict, and ambiguity must be attributable to a source comparison or a missing rule category.

### Phase 3 — Strategy Shaping

Convert the analysis into a strategic testing direction:

- scope boundaries
- objectives
- testing levels
- testing approaches
- test design techniques
- test data themes
- environment and tools
- exit criteria
- deliverables

Use the contract in `references/xmind-output-contract.md` to structure the tree.
If the feature has multiple states, multiple gates, or async/retry timing, load
`references/mermaid-patterns.md` and include a compact Mermaid diagram in the markdown.

### Phase 4 — Package Markdown

Write `high-level-strategy-analysis.md` using the exact section contract from
`references/analysis-output-contract.md`.

The markdown should be:

- high signal
- compact enough for future querying
- explicit about uncertainty
- useful as an upstream input for `@qa-master-workflow`
- easy to scan in review within 1-2 passes
- structured so a reviewer can separate confirmed rules, inferred readings, and open questions quickly

### Phase 5 — Package XMind

Build a strategy tree payload and generate the `.xmind` file with:

```bash
python3 scripts/build_xmind.py \
  --payload <strategy-tree.json> \
  --output <feature-test-strategy.xmind>
```

Default template:

`assets/test-strategy-template.xmind`

Do not handcraft the zip structure when the script can do it deterministically.

### Phase 6 — Validate

Before claiming completion:

1. Verify the markdown includes every required section.
2. Verify the tree contains every required top-level XMind branch in the required order.
3. Run the script successfully and confirm the output `.xmind` exists.
4. Follow `references/validation.md`.

## Review Rules

- Preserve unresolved ambiguity. Do not silently normalize it away.
- Prefer business impact wording over generic QA wording.
- Keep recommendations concrete and reviewable.
- If the source is thin, infer carefully and tag the item as `[inferred]`.
- If a recommendation depends on clarification, say so directly.
- Prefer one provisional canonical reading when sources conflict, but mark it as provisional and explain why.
- Separate `confirmed`, `conflicted`, and `open` information cleanly.
- Optimize for reviewer comprehension over completeness-by-default.

## Relationship to `@qa-master-workflow`

This skill is intentionally separate from `@qa-master-workflow`.

Use it before the full pipeline when the user wants:

- fast understanding
- spec review first
- high-level risk direction
- strategy artifact generation

Its outputs can feed the full pipeline as upstream inputs:

- `high-level-strategy-analysis.md` informs Context Builder and Strategy Decomposer
- `.xmind` informs strategy review, risk discussion, and scenario planning

This skill does **not** replace:

- `@qa-context-builder`
- `@qa-strategy-decomposer`
- `@qa-deep-analyzer`
- `@qa-testcase-generator`

It prepares the ground before those skills run.

## Suggested File Placement

When working inside a project folder, prefer:

```text
projects/{squad}/{project}/strategy/
  high-level-strategy-analysis.md
  strategy-tree.json
  {feature-slug}-test-strategy.xmind
```

If the user does not want a `strategy/` subfolder, place the files at the project root.

## When Mermaid Is Worth It

Add Mermaid only when it saves review time:

- feature has 4 or more states
- feature has 3 or more gating conditions
- feature includes async, retry, recharge, or backfill timing
- a text-only flow would be harder to validate quickly

Skip Mermaid for simple CRUD or single-surface features.

## Minimal Response Pattern

After writing files, report only:

- where the markdown was written
- where the `.xmind` was written
- the top risks or open clarifications
- whether the outputs are ready to be used as input to `@qa-master-workflow`
