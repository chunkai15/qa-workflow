# WF-2: Bug Report Init
> **Trigger:** "I found a bug", "log bug", "write bug report"

You are running WF-2.

## Mandatory Reading Order
1. Read user's provided evidence (screenshot, video, thread).
2. If feature context is missing, run `@jira-epic-story-snapshot` or read the project `spec.md`.

## Expected Outputs
1. Run `@qa-bug-report-generator`.
2. Draft a bug report locally with 7 required fields: Title, Env, Preconditions, Steps, Actual, Expected, Impact.
3. Wait for human approval.
4. ONLY AFTER APPROVAL: Create Jira ticket and prepare Slack reply.

## Completion Checklist
- [ ] `validate:bug-report` self-check completed on the draft.
- [ ] Human approved the draft.
- [ ] Jira ticket created.
- [ ] Slack reply drafted.
