# Test Matrix — Billing A/B Test

> Maps feature behaviors to their proof status. Update this file as coverage expands.

| Behavior ID | AC/Requirement | Manual TC | BDD Feature | Playwright | Status | Evidence |
|---|---|---|---|---|---|---|
| B-001 | AC-01: Example behavior | TC-US01-FUNC-001 | - | - | tc-written | - |

## Status Values

| Status | Meaning |
|---|---|
| `not-covered` | AC exists but no test case is written yet |
| `tc-written` | Manual test case written, not yet executed |
| `executed-pass` | Test case executed manually and passed |
| `executed-fail` | Test case executed manually and failed (has bugs) |
| `automation-ready` | BDD feature file exists |
| `automated` | Playwright spec exists and runs successfully |
| `blocked` | Testing cannot proceed (needs Dev/BA input) |

## Evidence Rules

- Manual execution evidence: link to test case execution log or Jira test run.
- Automation evidence: path to the JSON/HTML report from Playwright run.
- Blocked evidence: link to the Slack thread or Jira comment.
