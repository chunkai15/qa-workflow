---
name: jira-epic-story-snapshot
description: Summarize a Jira epic into a compact markdown snapshot that is directly reusable for creating subtasks, bugs, tasks, and Jira worklogs. Use when Codex needs to pull an epic's linked stories, status, assignee, reporter, priority, Jira links, Confluence spec anchors, short outcome summaries, acceptance-criteria summaries, and explicit WILL NOT FIX warnings while keeping the saved file short for future retrieval.
---

# Jira Epic Story Snapshot

Turn one Jira epic into a short reusable markdown file. Optimize for later querying, not for human-readable long-form documentation.

## Workflow

1. Fetch the epic from Jira.
2. Query all issues under the epic.
3. Keep only fields that help later execution:
   - epic key
   - epic title
   - story key
   - short title
   - status
   - actionability
   - assignee
   - reporter
   - priority
   - Jira link
   - Confluence anchor link when available
   - short surface/area label when it helps routing
   - short scope tags when they help routing
   - short suggested relates-use-cases hint when it helps later bug/task creation
   - short outcome
   - short AC summary
   - `WILL NOT FIX` or similar scope warning
4. Read Confluence only when Jira description does not already carry enough detail.
5. Compress aggressively:
   - keep one-line metadata fields
   - keep outcome to 1 to 3 bullets
   - keep AC summary to 3 to 6 bullets
   - avoid copying full AC tables
   - avoid Figma details unless the user explicitly asks
   - avoid repeating epic-level context inside every story
6. Save a single markdown file in the repo, usually under `doc/`, unless the user asked for another location.

## Output Rules

- Prefer compact markdown over narrative prose.
- Make the file skimmable in one pass.
- Use one section per story.
- Add a short epic header only once.
- Prefer stable field labels over clever prose so downstream skills can parse the file reliably.
- Mark non-actionable stories clearly:
  - `Status: WILL NOT FIX`
  - `Note: do not use as implementation source unless scope changes`
- Do not paste raw Confluence tables.
- Do not include screenshots, image blobs, or verbose notes.
- Do not add analysis that is not reusable later.

## Suggested File Shape

Use this structure unless the user asks for a different format:

1. Epic header
2. `Stories` section with one short block per story
3. `Ticket Seeds` section
4. `Worklog Seeds` section

Read [compact-template.md](./references/compact-template.md) before drafting the file.

## Epic Header Contract

The epic header should be compact but parseable. Include:

- `Epic Key`
- `Epic`
- `Epic Title`
- `Synced`

Keep the header stable across projects so downstream skills can resolve the parent epic without reopening Jira.

## Story Block Contract

For each story, include only:

- `Key`
- `Title`
- `Status`
- `Actionability`
- `Assignee`
- `Reporter`
- `Priority`
- `Jira`
- `Spec`
- `Surface` only when it helps route future bugs/tasks to the right story
- `Scope Tags` only when they help route future bugs/tasks to the right story
- `Suggested Relates Use Cases` only when a short, execution-oriented hint will reduce later ambiguity
- `Default Assignee for Bugs/Tasks` only when it differs from or clarifies `Assignee`
- `Outcome`
- `AC summary`
- `Status Warning` only when status needs explicit warning
- `Note` only when scope needs warning or reuse should be limited

If a field is missing, omit it instead of adding filler, except:

- use `Actionability: Non-actionable` for `WILL NOT FIX` or equivalent stories
- use `Actionability: Actionable` for stories that should be considered valid routing targets

## Routing-Friendly Output Rules

Optimize the snapshot for downstream ticket creation as well as human review:

- `Surface` should name the main UI or system area in 2 to 6 words when useful, for example `Issue Session Credits modal` or `Balance History and notifications`.
- `Scope Tags` should be short comma-separated execution tags, for example `issuance, validation` or `visibility, alert, notification`.
- `Suggested Relates Use Cases` should be a short routing hint, not a paragraph.
- Prefer terms that future bug/task drafts will naturally reuse, such as `overview`, `delete modal`, `expired history`, or `post-expiration`.
- Do not add these routing fields when they are too vague to help.

## Ticket Seeds

Add 1 short line per actionable story:

- `Subtask seed:` implementation-oriented phrasing
- `Bug seed:` behavior/regression phrasing only if the user asked for bug-oriented reuse
- `Task seed:` cross-cutting or ops phrasing when helpful

Keep each seed to one sentence fragment, not a paragraph.

## Worklog Seeds

Add 1 short line per actionable story using past-tense phrasing suitable for Jira worklogs.

Examples:

- `Implemented expiration validation for PAY-2030`
- `Updated delete priority order for PAY-2032`
- `Added expired activity filter for PAY-2034`

## Retrieval Optimization

When saving the markdown:

- prefer stable labels over prose
- prefer parseable one-line metadata over implied structure
- keep terminology consistent across stories
- keep total file length as small as possible without losing reuse value
- avoid duplicate summaries across sections
- prefer abbreviations only when obvious in Jira context, such as `AC`

## Validation

Before finishing:

1. Confirm every story key actually belongs to the epic.
2. Confirm the epic header includes `Epic Key` and `Epic Title`.
3. Confirm actionable vs non-actionable stories are clearly labeled.
4. Confirm any `Surface`, `Scope Tags`, or `Suggested Relates Use Cases` fields are short and actually useful for downstream bug/task routing.
5. Confirm each Confluence anchor points to the right story or section when available.
6. Confirm `WILL NOT FIX` or equivalent statuses are clearly flagged.
7. Check that the file can be used without reopening Jira for routine ticket creation or worklog drafting.
