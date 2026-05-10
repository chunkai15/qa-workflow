# QA Conventions

These are the standard conventions for Everfit QA, ensuring consistency across squads and agents.

## Priority Definitions
| Priority | Meaning |
|---|---|
| **High** | Critical paths, P0 flows, auth, payments. Must pass before any release. |
| **Medium** | Standard features, secondary paths, edge cases that degrade UX but don't block. |
| **Low** | Cosmetic issues, rare edge cases, minor copy issues. |

## Test Data Conventions
Use the `TD-[ID]` format when referencing test data fixtures. Do not invent arbitrary data when testing.

- **TD-001**: Standard test user (clean state).
- **TD-002**: Standard test user (existing data/subscription).
- **TD-INV**: Invalid format inputs.

## Environment Naming
- **Local**: Developer machine.
- **Test / QA**: Isolated environment for QA pipeline testing.
- **Staging**: Pre-production mirror, used for final E2E runs.
- **Production**: Live. Do not run destructive tests here.

## Tool Matrix
| Need | Use |
|---|---|
| Complex decision logic, matrix testing | `.xlsx` generated via spreadsheet skill |
| Standard linear test cases | `.md` generated via testcase skill |
| Automation scripts | `.feature` + Playwright TypeScript (`.ts`) |
