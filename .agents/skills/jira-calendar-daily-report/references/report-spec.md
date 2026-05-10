# Report Spec

## Jira JQL Templates

Replace `{PROJECT}`, `{DATE}`, `{NEXT_DATE}`.

### Created

```jql
project = {PROJECT}
AND creator = currentUser()
AND created >= "{DATE} 00:00"
AND created < "{NEXT_DATE} 00:00"
ORDER BY created ASC
```

### QA success

```jql
project = {PROJECT}
AND status CHANGED TO "QA success" BY currentUser()
DURING ("{DATE} 00:00","{NEXT_DATE} 00:00")
ORDER BY updated ASC
```

### QA failed

```jql
project = {PROJECT}
AND status CHANGED TO "QA failed" BY currentUser()
DURING ("{DATE} 00:00","{NEXT_DATE} 00:00")
ORDER BY updated ASC
```

## Calendar Query

Use `mcp__google_workspace__calendar_listEvents` with:

```json
{
  "calendarId": "primary",
  "timeMin": "2026-04-22T00:00:00+07:00",
  "timeMax": "2026-04-22T23:59:59+07:00",
  "attendeeResponseStatus": ["accepted", "tentative", "needsAction"],
  "eventTypes": ["default"]
}
```

## Duration Formatting

- `30m`
- `1h`
- `1h 15m`
- all-day: `Cả ngày`

## Final Output Format

```md
Report date: 2026-04-22

**PAY**

**Created (Total: X)**

[PAY-123](https://everfit.atlassian.net/browse/PAY-123) | High | Title

**QA success (Total: Y)**

[PAY-456](https://everfit.atlassian.net/browse/PAY-456) | Medium | Title

**QA failed (Total: Z)**

[PAY-789](https://everfit.atlassian.net/browse/PAY-789) | Low | Title

**MP**

**Created (Total: X)**

[MP-123](https://everfit.atlassian.net/browse/MP-123) | Highest | Title

**QA success (Total: Y)**

[MP-456](https://everfit.atlassian.net/browse/MP-456) | High | Title

**QA failed (Total: Z)**

[MP-789](https://everfit.atlassian.net/browse/MP-789) | Low | Title

**Calendar hôm nay (Total: N)**

- 09:00 - 09:30 (30m) - Daily sync
- 14:00 - 15:00 (1h) - Planning
- Company holiday (Cả ngày)

**Worklog draft**

- PAY-123 | 2026-04-22 | Created | 5m | create ticket Title
- PAY-456 | 2026-04-22 | QA success | 15m | verify ticket success Title
- PAY-789 | 2026-04-22 | QA failed | 15m | verify ticket failed Title
```

## Inclusion Rule

- For a daily report request, always include the calendar section by default.
- Do not wait for the user to mention calendar explicitly.
- Skip calendar only if the user explicitly asks to omit it.
- Add `Worklog draft` only when the user asks to review or confirm worklogs based on the report.

## Priority Rule

- Render each ticket as:
  - `[ID](jira-url) | Priority | Title`
- Read priority from Jira issue fields.
- If Jira does not return a priority value, render:
  - `No Priority`

## Slack Paste Rule

- Use a real hyperlink for the ticket ID.
- Use `|` separators:
  - `[ID](jira-url) | Priority | Title`
- Keep each ticket on one physical line in the response text.
- If Slack breaks the line after the hyperlink on paste, accept that behavior. Do not switch to plain ticket keys automatically.

## Worklog Draft Rule

- Always include `Report date: YYYY-MM-DD` when generating a report.
- `Worklog draft` lines must use this shape:
  - `TICKET-123 | YYYY-MM-DD | Bucket | Time spent | Worklog note`
- Valid buckets:
  - `Created`
  - `QA success`
  - `QA failed`
- Default mapping:
  - `Created` -> `5m` -> `create ticket {ticket title}`
  - `QA success` -> `15m` -> `verify ticket success {ticket title}`
  - `QA failed` -> `15m` -> `verify ticket failed {ticket title}`
- Preserve cross-section duplicates in `Worklog draft`. If one ticket appears in multiple sections on the same day, emit one worklog draft line per section appearance.
- Remove duplicates only within the same section by ticket key.
- Treat `Worklog draft` as the source of truth for any later confirmation or Jira worklog write.
