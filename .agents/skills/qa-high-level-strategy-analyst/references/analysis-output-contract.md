# High-Level Strategy Analysis Contract

Write `high-level-strategy-analysis.md` with these sections in this order:

1. `# Feature Summary`
2. `## Review Snapshot`
3. `## Source Map`
4. `## Core Business Flow`
5. `## Canonical Business Rules`
6. `## Gaps & Missing Logic`
7. `## Conflicts & Ambiguities`
8. `## Clarification Items & Recommendations`
9. `## High-Level Scenarios`
10. `## Testing Technique Reference`
11. `## Risk Assessment`
12. `## Edge Cases & Race Conditions`
13. `## Suggested Next Inputs For qa-master-workflow`

## Section Rules

### `# Feature Summary`

Keep to 4-8 lines:

- feature purpose
- primary actor
- business goal
- impacted surfaces
- consequence if the feature fails

### `## Review Snapshot`

Keep this section short and highly scannable.

Use 4 bullets only:

- `Current Understanding`
- `Primary Risk`
- `Blocking Clarifications`
- `Recommended Canonical Reading`

### `## Source Map`

Use a compact evidence table:

| Source | Type | Priority | Used For | Confidence Notes |
|---|---|---|---|---|

List only the sources actually used.

### `## Core Business Flow`

Prefer a compact table:

| Flow | Trigger | Gate(s) | Outcome | Failure Impact |
|---|---|---|---|---|

Include only distinct flows. Do not explode into field-level steps.

If the feature has multiple gates, states, or async timing, add one compact Mermaid diagram under this section.

### `## Canonical Business Rules`

Use:

| Rule ID | Canonical Rule | Primary Source | Confidence | Why It Matters |
|---|---|---|---|---|

Keep only the rules that govern behavior across multiple scenarios.

### `## Gaps & Missing Logic`

Use a table:

| Gap Type | Missing Logic | Impact | Follow-up |
|---|---|---|---|

Allowed gap types:

- `Business Rule`
- `State / Lifecycle`
- `Permission / Role`
- `Integration / Event`
- `Failure / Recovery`
- `Observability / Audit`
- `Migration / Compatibility`

### `## Conflicts & Ambiguities`

Use two subsections:

- `Conflicts`
- `Ambiguities`

For `Conflicts`, use:

| Conflict Type | Sources | Conflict | Why It Matters | Provisional Reading |
|---|---|---|---|---|

For `Ambiguities`, use:

| Ambiguity Type | Area | What Is Unclear | Why It Matters | Suggested Owner |
|---|---|---|---|---|

### `## Clarification Items & Recommendations`

Use a table:

| Question | Why It Matters | Suggested Owner | Recommendation |
|---|---|---|---|

Recommendations may be tagged `[inferred]` if they are not confirmed by source.

### `## High-Level Scenarios`

Use a table:

| Scenario Type | US / Area | Scenario | Expectation | Priority |
|---|---|---|---|---|

Rules:

- `US / Area` should reference the relevant user story or feature area concisely.
- `Expectation` should state the business outcome, not test steps.
- `Priority` should be `P0`, `P1`, or `P2`.
- Keep scenarios at scenario level, not TC step level.
- Prefer 6-12 rows total; do not explode into exhaustive combinations.

### `## Testing Technique Reference`

Map technique to reason:

| Technique | Apply To | Why |
|---|---|---|

Typical techniques:

- Equivalence Partitioning
- Boundary Value Analysis
- Decision Table Testing
- State Transition Testing
- Error Guessing
- Risk-based Regression
- Pairwise or combination-based testing when variants exist

### `## Risk Assessment`

Prefer a table:

| Risk Area | Description | Likelihood | Impact | Priority | Suggested Focus |
|---|---|---|---|---|---|

Use feature-specific wording. Avoid generic placeholders.

### `## Edge Cases & Race Conditions`

Use two tables:

- `Edge Cases`
- `Race Conditions / Timing Risks`

For `Edge Cases`, use:

| US / Area | Edge Case | Expectation | Priority |
|---|---|---|---|

For `Race Conditions / Timing Risks`, use:

| US / Area | Race / Timing Risk | Expectation | Priority |
|---|---|---|---|

Include retries, duplicate actions, delayed async updates, stale UI, webhook timing, concurrent edits, or any other timing-sensitive path when relevant.

### `## Suggested Next Inputs For qa-master-workflow`

Keep this section short:

- which parts can feed Context Builder
- which parts can feed Strategy Decomposer
- which open items must be resolved before deeper analysis or TCs

## Writing Style

- Keep it compact and query-friendly.
- Preserve uncertainty.
- Prefer operational wording over essay prose.
- Do not include detailed TCs.
- Do not claim sign-off.
- Prefer narrow tables over long bullet walls.
- Add Mermaid only when it reduces review effort.
