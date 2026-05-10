# Feature Snapshot Consumption

Use this file when a feature snapshot artifact may exist in the current repo.

## Goal

Prefer the repo snapshot produced by `jira-epic-story-snapshot` as the primary feature-context source for:

- `Parent`
- `Relates`
- default `Assignee`
- story scope and routing hints

This reduces repeated Jira lookups and keeps ticket creation consistent inside the same feature.

## Snapshot Resolution Strategy

1. Detect the current epic or feature context from:
   - explicit user instruction
   - current repo context
   - existing snapshot filenames under `doc/`
2. Search the configured project snapshot paths, usually `doc/`.
3. Prefer filename patterns such as:
   - `{epic_key}-user-stories.md`
   - `{epic_key}-epic-snapshot.md`
4. Load the first matching snapshot that clearly belongs to the active feature.

## Fields to Consume

Read these fields from the snapshot when present:

- `Epic Key`
- `Epic Title`
- `Key`
- `Status`
- `Actionability`
- `Assignee`
- `Surface`
- `Scope Tags`
- `Suggested Relates Use Cases`
- `Default Assignee for Bugs/Tasks`

## Routing Rules

- Use `Epic Key` for `Parent`.
- Use story `Key` for `Relates`.
- Skip non-actionable stories when choosing a related story unless the user explicitly asks otherwise.
- Prefer stories whose `Surface`, `Scope Tags`, or `Suggested Relates Use Cases` best match the issue.
- Use `Default Assignee for Bugs/Tasks` when present, otherwise use `Assignee`.

## Fallback Rule

If the snapshot is missing, stale, or insufficient for routing, fall back to live Jira lookup.
