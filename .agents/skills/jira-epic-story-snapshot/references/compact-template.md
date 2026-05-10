# Compact Template

```md
# <EPIC-KEY> Epic Snapshot

- Epic Key: <EPIC-KEY>
- Epic: <link>
- Epic Title: `<epic title>`
- Synced: <YYYY-MM-DD>

## Stories

### <STORY-KEY>
- Key: <STORY-KEY>
- Title: `<short title>`
- Status: `<status>`
- Actionability: `Actionable`
- Assignee: `<name>`
- Reporter: `<name>`
- Priority: `<priority>`
- Jira: <link>
- Spec: <anchor link>
- Surface: `<short UI/system area>` 
- Scope Tags: `<tag>, <tag>`
- Suggested Relates Use Cases: `<short routing hint>`
- Default Assignee for Bugs/Tasks: `<name>`
- Outcome:
  - <1 short bullet>
  - <optional short bullet>
- AC summary:
  - <short bullet>
  - <short bullet>
  - <short bullet>
- Status Warning: `<only if needed>`
- Note: <only if needed>

## Ticket Seeds

- <STORY-KEY>: Subtask seed: <short fragment>
- <STORY-KEY>: Task seed: <short fragment>

## Worklog Seeds

- <STORY-KEY>: <past-tense worklog line>
```

## Compression Rules

- Keep story titles intact when practical.
- Trim repeated prefixes if all stories share them.
- Keep `Surface`, `Scope Tags`, and `Suggested Relates Use Cases` only when they add real routing value.
- Keep `Outcome` and `AC summary` short enough to scan quickly.
- Omit `Ticket Seeds` or `Worklog Seeds` variants the user did not ask for.
- Omit empty fields.
- Use `Actionability: Non-actionable` for `WILL NOT FIX` or equivalent stories.
