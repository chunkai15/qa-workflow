# PAY Project Notes

Use this file after the target project is confirmed as `PAY`.

## Defaults

- Default `QA` user: `Khai Truong (QA)`
- `QA` field id: `customfield_10131`
- Sprint field id: `customfield_10010`

## Feature Snapshot Expectation

For feature work, prefer the repo snapshot under `doc/` before doing live Jira routing.

Example filename patterns:

- `PAY-1901-user-stories.md`
- `<EPIC-KEY>-epic-snapshot.md`

## Story Routing Heuristics

- `PAY-2030`
  - issuance modal
  - expiration rule selection
  - validation
  - default expiration option
- `PAY-2031`
  - visibility
  - expiring-soon UI
  - overview balance card
  - 7-day alert
  - notification copy/format
- `PAY-2032`
  - delete modal
  - tooltip
  - reduce count
  - delete priority
  - booking deduction order
- `PAY-2034`
  - auto-expire flow
  - expired history
  - post-expiration navigation
  - expired notification channel behavior

## Priority Heuristics

- `High`
  - broken navigation
  - wrong credit deduction order
  - wrong or noisy notification channel behavior
  - missing traceability for expired history
  - blocked core session credit operations
- `Medium`
  - copy or format mismatch
  - non-blocking UI state mismatch
  - non-blocking display inconsistency

Prefer explicit user-provided priority or Slack severity when available. Otherwise infer from report impact. Do not inherit priority from the related US.

## Slack Reply Notes

- Prefer tagging assignees using `slack_user_mapping` from `pay.yaml`.
- If no mapping exists, fall back to the assignee display name as plain text.
