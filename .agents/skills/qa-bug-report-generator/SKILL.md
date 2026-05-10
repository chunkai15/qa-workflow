---
name: qa-bug-report-generator
description: Generate Jira-ready QA bug reports from QA notes, screenshots, videos, Slack threads, reproduction steps, or mixed investigation context. Use when Codex needs to convert raw QA evidence into a structured bug report with a behavior-based title, concise environment details, reproducible steps, actual vs expected results, impact, and an optional QA note. Also use when Codex must draft or create Jira bug, task, or improvement tickets from QA evidence or Slack threads, resolve project-specific Jira fields, consume feature snapshot artifacts under the repo such as epic story snapshots, and prepare Slack follow-up replies.
---

# QA Bug Report Generator

Generate clear, business-aware QA bug reports and execution-ready Jira tickets.

Keep the core workflow generic. Do not hardcode project-specific Jira fields, QA users, sprint fields, Slack mappings, or feature story keys in this file. Load project references only after the target project is known.

## Core Workflow

1. Normalize the evidence:
   - source type: QA notes, screenshot, video, Slack thread, or manual steps
   - product area
   - affected behavior
   - current visible result
   - reproduction path
   - missing details that should stay omitted or move to `QA Note`
2. Determine the ticket type:
   - `Bug` for incorrect system behavior
   - `Task` for confirmed follow-up work, routing updates, or product/design-alignment work
   - `Improvement` only when the user explicitly frames it that way
3. Resolve project context before ticket creation:
   - read [project-resolution.md](./references/project-resolution.md)
   - once the project is known, load the matching project profile under `references/projects/`
4. Resolve feature context before Jira live lookup when possible:
   - read [feature-snapshot-consumption.md](./references/feature-snapshot-consumption.md)
   - prefer the feature snapshot artifact in the repo for `Parent`, `Relates`, and default `Assignee`
5. Build the title using the active naming convention:
   - preserve any approved prefix convention
   - otherwise use the base title rules in [reporting-standards.md](./references/reporting-standards.md)
6. Draft the report:
   - for `Bug`, use the exact bug-report section order
   - for `Task` or `Improvement` from Slack, use the non-bug operational format
7. Stop after the draft unless the user explicitly asks to create the ticket.
8. If the user asks to create the ticket:
   - read [execution-checklist.md](./references/execution-checklist.md)
   - resolve `Project`, `Issue Type`, `Parent`, `Sprint`, `QA`, `Assignee`, `Priority`, `Fix versions`, and `Relates`
   - create the ticket
   - verify the created issue fields
   - prepare or send Slack follow-up when needed

## Operating Rules

- Behave like a Senior QA Engineer.
- Prefer observable facts over speculation.
- Keep draft review and Jira creation as separate phases unless the user explicitly collapses them.
- When screenshots, videos, or Slack messages are the only source, do not invent hidden system states.
- Use user overrides first, then feature snapshot context, then project profile defaults, then live Jira lookup, then generic fallback.
- Reuse known project defaults only after they are confirmed in the active project profile.

## Draft-First Rule

Default sequence:

1. Review the evidence.
2. Draft the bug or task report.
3. Present the draft for review.
4. Wait for explicit approval or a direct create-ticket request.
5. Only then create the Jira ticket.

If the user says `draft me bug report`, `review thread`, or `review and draft`, stop after the draft.

## Jira Description Rule

When creating the actual Jira ticket description:

- use bold section headers
- keep the content compact and skimmable
- if the ticket originates from Slack, place the Slack permalink at the top under `**Slack Thread**`

Use bug sections for `Bug`:

- `**Title**`
- `**Environment**`
- `**Preconditions**`
- `**Steps to Reproduce**`
- `**Actual Result**`
- `**Expected Result**`
- `**Impact**`
- `**QA Note**`

Use non-bug sections for `Task` or `Improvement` from Slack:

- `**Slack Thread**`
- `**Title**`
- `**Context**`
- `**Current State**`
- `**Requested Action**`
- `**Impact**`
- `**QA Note**`

## Ticket Field Rules

Apply these rules during ticket creation:

- `Parent`
  - resolve from the feature snapshot first
  - fallback to Jira epic lookup only when the snapshot is missing or insufficient
- `Relates`
  - resolve from the related story in the feature snapshot first
  - create a Jira `Relates` link to the matching US when the workflow calls for it
- `Assignee`
  - use the user override when provided
  - otherwise use the default assignee of the related story from the snapshot or project context
- `QA`
  - use the project profile's confirmed QA field id and default QA user when available
- `Sprint`
  - use the project profile's sprint field mapping
  - fetch the currently active sprint live at create time
  - do not reuse sprint names from older turns or screenshots
- `Priority`
  - evaluate from the report's impact unless the user explicitly provides priority or the Slack thread already carries severity
  - do not inherit priority from the related US by default
- `Fix versions`
  - set only when the user explicitly requests it or the project workflow requires it with confirmed data

## Slack Follow-up Rule

After a ticket is created from Slack context:

- draft or send a Slack reply in this format:

```text
{Ticket type} logged! → {ISSUE-KEY hyperlink}
Assigned to {Assignee display name or tagged Slack user}
```

- prefer Slack mention syntax when a project profile provides a Jira-to-Slack mapping
- if no mapping exists, fall back to the assignee display name and state that as plain text

## Required References

Read these files when their conditions apply:

- [reporting-standards.md](./references/reporting-standards.md)
  - always read when drafting or creating a bug report
- [execution-checklist.md](./references/execution-checklist.md)
  - read before ticket creation or when validating a workflow change
- [project-resolution.md](./references/project-resolution.md)
  - read when the target project is unclear or when resolving field precedence
- [feature-snapshot-consumption.md](./references/feature-snapshot-consumption.md)
  - read when a repo feature snapshot may exist
- `references/projects/<project>.yaml`
  - read once the project key is known for field ids, QA defaults, Slack mappings, and routing
- `references/projects/<project>.md`
  - read once the project key is known for routing heuristics, priority heuristics, and known pitfalls

## Output Format

For `Bug`, use this exact draft shape:

```md
Title
<behavior-based title>

Environment
Module: ...
Platform: ...
Environment: ...

Preconditions
<only when needed>

Steps to Reproduce
1. ...
2. ...

Actual Result
...

Expected Result
...

Impact
...

QA Note
<optional>
```

When the user wants a draft ready for Jira creation review, append:

```md
Ticket Fields
- Project: ...
- Issue Type: ...
- Parent: ...
- Sprint: ...
- QA: ...
- Assignee: ...
- Priority: ...
- Fix versions: ...
- Relates: ...
```

If the ticket originates from Slack, also append:

```md
Slack Reply Draft
Bug logged! → ISSUE-KEY
Assigned to ...
```

For `Task` or `Improvement`, keep the draft compact and operational, matching the non-bug section order above.
