# Validation Ladder

This is the required proof loop before claiming a task is "done". Agents must run these commands as appropriate for the lane.

## The Ladder

```text
1. validate:tc
   Validates linting and structure of manual test cases (.md or .xlsx)
   Command: npx markdownlint test-cases/*.md

2. validate:bdd
   Syntax and structure check for Gherkin feature files
   Command: npx gherkin-lint automation/input/*.feature

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
