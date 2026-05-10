# QA Test Conventions

> Standards for test case writing, naming, and organization across all squads.

## Test Case Format

Use the skill-generated 9-column table format:

| ID | Module | Scenario | Precondition | Steps | Expected Result | Priority | Type | Notes |

## Naming Conventions

- Test case IDs: `TC-{project}-{NNN}` (e.g., `TC-explore-search-001`)
- Bug IDs: `BUG-{project}-{NNN}`
- Project keys: lowercase-kebab-case

## Priority Levels

- **P0** — Blocker: core flow broken, no workaround
- **P1** — Critical: major feature broken, workaround exists
- **P2** — Major: feature partially broken, non-critical path
- **P3** — Minor: cosmetic, edge case, UX improvement

## QA Workflow

1. Read spec → 2. Run analysis skill → 3. Generate test cases → 4. Execute → 5. Report bugs → 6. Regression
