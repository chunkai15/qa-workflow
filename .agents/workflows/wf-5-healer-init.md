# WF-5: Test Healer Init
> **Trigger:** "Test failed", "fix flaky test", "fix Playwright test"

You are running WF-5.

## Mandatory Reading Order
1. Ask the user for the failing `.spec.ts` file path, the error log/stack trace, and the staging URL.

## Expected Outputs
1. Run `@playwright-test-healer`.
2. Use Playwright MCP to reproduce and debug.
3. DOM-first debugging only — NEVER guess selectors.
4. Attempt fix (max 2 attempts).
5. Run test 3 times to confirm stability.

## Completion Checklist
- [ ] Root cause identified.
- [ ] Fix applied and passed 3x, OR marked with `test.fixme()`.
- [ ] `TEST_MATRIX.md` evidence updated.
