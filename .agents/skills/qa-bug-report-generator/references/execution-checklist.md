# Execution Checklist

Use this checklist before creating Jira tickets and before claiming the workflow is complete.

## Pre-draft

1. Normalize the evidence source.
2. Determine whether the request is for `Bug`, `Task`, or `Improvement`.
3. Identify whether the request stops at draft or continues to Jira creation.

## Context Resolution

1. Resolve the target project.
2. Load the project profile for that project when available.
3. Resolve the active feature snapshot from the repo when available.
4. Resolve the related story or feature from the snapshot before querying Jira live.

## Draft Quality

1. Confirm the title uses the active naming convention.
2. Confirm `Actual Result` contains only current behavior.
3. Confirm `Expected Result` uses `SHOULD` or `SHOULD NOT` for bugs.
4. Confirm `Impact` explains the user or business consequence.
5. Confirm `QA Note` is used only when it adds triage value.

## Ticket Field Resolution

1. `Project` resolved from user instruction or project context.
2. `Issue Type` resolved from the request.
3. `Parent` resolved from the feature snapshot or Jira epic lookup.
4. `Relates` resolved from the matching story in the snapshot.
5. `Assignee` resolved from user override, else related story default assignee.
6. `QA` resolved from the project profile.
7. `Sprint` resolved from the project's sprint field and current active sprint.
8. `Priority` evaluated from the report unless explicitly provided.
9. `Fix versions` set only when explicitly requested or otherwise confirmed by project policy.

## Post-create Verification

1. Confirm the created issue key.
2. Confirm `Parent` was set correctly.
3. Confirm `Relates` link was created.
4. Confirm `Assignee` was set correctly.
5. Confirm `QA` field was set correctly.
6. Confirm `Sprint` is present when the project workflow expects it.
7. Confirm `Priority` matches the intended level.

## Slack Follow-up

1. Confirm whether the ticket originated from Slack context.
2. Prefer Slack mentions using project-profile mappings.
3. Fall back to display name only when no mapping exists.
4. If sending the message automatically, verify the final text before send.
