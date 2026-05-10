---
name: jira-calendar-daily-report
description: Build a daily activity report for the current user using Atlassian MCP and Google Workspace MCP. Use when the user asks to pull Jira activity for one or more dates, summarize Created / QA success / QA failed tickets for PAY and MP, include Google Calendar meetings for the same day, or keep a fixed report format with totals and hyperlink ticket IDs.
---

# Jira Calendar Daily Report

Build the report with MCP only.

- Use `mcp__atlassian__searchJiraIssuesUsingJql` for Jira.
- Use `mcp__google_workspace__calendar_listEvents` for Calendar.
- Do not use browser scraping when MCP is available.

## Workflow

1. Determine the target date.
2. Treat the report day as `00:00:00` to `23:59:59` in `Asia/Ho_Chi_Minh` unless the user explicitly says otherwise.
3. For each requested Jira project, fetch:
   - `Created`
   - `QA success`
   - `QA failed`
4. Fetch calendar events from `calendarId: "primary"` for the same day.
5. Format the final output exactly as defined in [references/report-spec.md](./references/report-spec.md).
6. If the user wants to review worklogs based on the report, append a `Worklog draft` block after the report content.

Calendar is part of the default daily report. Include it unless the user explicitly asks to omit calendar.

## Jira Rules

- Default projects:
  - `PAY`
  - `MP`
- Use `currentUser()` in JQL.
- Use exact status names:
  - `QA success`
  - `QA failed`
- Request at least these fields:
  - `key`
  - `priority`
  - `summary`
- Preserve duplicates across sections if the same ticket qualifies in multiple sections.
- Remove duplicates within the same section by ticket key.
- If the same ticket appears in multiple sections on the same report date, treat each appearance as a separate worklog candidate.

See [references/report-spec.md](./references/report-spec.md) for JQL templates.

## Calendar Rules

- Always use `calendarId: "primary"`.
- Query the full local day with explicit timezone offset.
- Default filters:
  - `eventTypes: ["default"]`
  - `attendeeResponseStatus: ["accepted", "tentative", "needsAction"]`
- Exclude cancelled events.
- Keep all-day events and label them `Cả ngày`.
- Format timed events as `HH:MM - HH:MM (duration) - title`.

## Output Rules

- Group by board/project first.
- Always print `Report date: YYYY-MM-DD` before the first Jira section.
- For each board, output:
  - `Created (Total: X)`
  - `QA success (Total: Y)`
  - `QA failed (Total: Z)`
- Ticket format must be:
  - `[ID](jira-url) | Priority | Title`
- If priority is missing, use `No Priority`.
- Use a real hyperlink for `ID`.
- Use `|` as the separator between fields.
- Keep each ticket as a single physical line in the response text.
- If Slack breaks after the hyperlink when pasted, accept that behavior; do not change the chosen display format.
- Add a `Calendar hôm nay (Total: N)` section after Jira sections.
- Include the calendar section by default for daily report requests, even if the user only mentions Jira boards or projects.
- Omit the calendar section only when the user explicitly says they do not want calendar output.
- If the user asks to prepare worklogs from the report, add a `Worklog draft` section after the calendar section.
- Each `Worklog draft` line must be a single physical line and include:
  - `Ticket Key | Report date | Bucket | Time spent | Worklog note`
- `Worklog draft` is the only source for downstream confirmation and Jira worklog writes. Do not reconstruct worklog entries by parsing the display sections.
- Keep answers compact. Do not add explanation unless the user asks for it.

## Notes

- If the user asks for one board only, output only that board plus calendar if requested.
- For daily report requests, treat calendar as requested by default.
- If the user asks for multiple boards, keep each board in its own section.
- If a section has zero items, still print the section header with `Total: 0`.
- If the user explicitly says to skip calendar, omit the calendar section.
- Default worklog mapping for `Worklog draft`:
  - `Created` -> `5m` -> `create ticket {ticket title}`
  - `QA success` -> `15m` -> `verify ticket success {ticket title}`
  - `QA failed` -> `15m` -> `verify ticket failed {ticket title}`
- Allow per-ticket overrides when the user provides them explicitly.
- Never log work to Jira until the user confirms the draft.
