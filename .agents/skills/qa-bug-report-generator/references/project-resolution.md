# Project Resolution

Use this file to resolve ticket fields in a stable order across multiple projects.

## Source Precedence

When multiple sources can provide the same value, use this precedence:

1. Explicit user instruction in the current turn
2. Feature snapshot artifact in the repo
3. Project profile defaults and heuristics
4. Live Jira lookup
5. Generic skill fallback

Do not invert this order unless the user explicitly tells you to.

## Project Detection

Resolve the project from:

1. Explicit project key in the user request
2. Current feature repo context or snapshot file
3. Previously confirmed project context in the same working thread

If the project is still unclear and no low-risk assumption exists, ask the user.

## Field Resolution Principles

- `Parent`
  - prefer feature snapshot epic header
  - fallback to live Jira epic lookup only when needed
- `Relates`
  - prefer routing through the story metadata in the snapshot
- `Assignee`
  - user override first
  - related story default assignee second
- `QA`
  - project profile default QA user and field id
- `Sprint`
  - project profile sprint field id plus live active sprint lookup
- `Priority`
  - infer from report impact unless the user or Slack thread explicitly gives severity

## Multi-project Guardrail

Do not assume one project's field ids, QA user, sprint field, or Slack mappings apply to another project.
