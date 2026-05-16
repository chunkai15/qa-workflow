# Validation Ladder

This is the required proof loop before claiming a task is "done". Agents must run these commands as appropriate for the lane.

## The Ladder

```text
0. validate:strategy
   Confirms high-level-strategy-analysis.md has all required sections.
   Command: (agent self-check — confirm 8 required sections are present)

-1. validate:bug-report
   Confirms bug report draft has all 7 required fields before Jira creation.
   Command: (agent self-check — confirm Title/Env/Steps/Actual/Expected/Impact fields)

-2. validate:handoff
   Confirms HANDOFF.md is updated before ending any session.
   Command: (agent self-check — verify last_updated date changed + Next Action exists)

0.5. validate:analysis
   Confirms analysis.md contains all required pipeline sections before claiming analysis complete.
   Command: (agent self-check — verify presence of: [MASTER CONTEXT] + [MODULE LIST] + [RISK REGISTER] + [DEEP ANALYSIS PACKAGE v3] + RTM with Min_TCs populated)
   Also confirm: regression-suite.md exists with SCEN/FUNC separation table.

1. validate:tc
   Validates linting and structure of manual test cases (test-cases/test-cases.md or .xlsx)
   Command: npm run validate:tc

2. validate:bdd
   Syntax and structure check for Gherkin feature files
   Command: npm run validate:bdd

3. validate:types
   Type-checks generated TypeScript code
   Command: npm run verify:generated

4. validate:run
   Executes Playwright tests against the specified environment
   Command: npm run pipeline

5. validate:report
   Updates TEST_MATRIX.md based on run results
   (Manual agent task based on JSON/HTML outputs)
```

## Rules
- An agent MUST NOT claim "automation complete" until `validate:types` passes.
- Test matrix must not be marked `automated` unless `validate:run` passed.
- If a validation step fails, the agent must fix the issue (or log friction) rather than ignoring it.
