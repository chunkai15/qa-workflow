# WF-3: DSU Daily Report Init
> **Trigger:** "DSU", "daily report", "pull Jira activity"

You are running WF-3.

## Mandatory Reading Order
1. None required unless the user specifies a specific project.

## Expected Outputs
1. Run `@jira-calendar-daily-report`.
2. Use Jira MCP to fetch: Created, QA success, QA failed tickets for PAY and MP.
3. Use Google Calendar MCP to fetch today's meetings.
4. Format the report.
5. Provide a worklog draft if requested.

## Completion Checklist
- [ ] Jira activity fetched.
- [ ] Calendar fetched.
- [ ] Report formatted.
- [ ] (If applicable) Human confirmed worklog before logging to Jira.
