# QA Bug Reporting Standards

## Contents

1. Core structure
2. Title rules
3. Section rules
4. Draft vs ticket creation
5. Jira description formatting
6. Jira field workflow
7. Slack-thread follow-up
8. Supported input types
9. Domain cues
10. Known expected behaviors
11. Severity hints
12. Optional category hints
13. Skill prompt behavior
14. Example report

## Core structure

Always produce bug reports in this order:

1. `Title`
2. `Environment`
3. `Preconditions`
4. `Steps to Reproduce`
5. `Actual Result`
6. `Expected Result`
7. `Impact`
8. `QA Note` if needed

The output should be ready to paste into Jira.

Default mindset:

- Act like a Senior QA Engineer.
- Write clearly and professionally.
- Prefer observable facts over speculation.
- If the root cause is unclear, note that in `QA Note` rather than guessing.
- Treat draft review and Jira ticket creation as separate phases.

## Title rules

- Start with `SHOULD`, `SHOULD NOT`, or `SHOULD BE ABLE TO`.
- Describe expected system behavior clearly.
- Avoid weak labels such as `incorrect`, `wrong`, `issue`, `bug`, or `problem` unless they are part of quoted UI text.
- Use short, business-aware wording.
- Add bracketed business context when helpful, for example:
  - `[Billing][MacroSnap] SHOULD NOT show View Upcoming Bill when subscription is scheduled for cancellation`
  - `[Email] SHOULD NOT show Renewal discount in Subscription Started email when promo duration = Once`

Good title examples:

- `SHOULD show correct ending billing cycle date after subscription cancellation`
- `SHOULD NOT show Renewal discount in Subscription Started email when promo duration = Once`
- `SHOULD hide checkbox when MacroSnap subscription is canceled`

If the user has defined a title prefix convention for a feature area, preserve that prefix consistently in drafts and Jira summaries.

## Section rules

### Environment

Keep it concise. Common fields:

- `Module: Billing / MacroSnap / Email / Notification`
- `Platform: Web`
- `Environment: QA / DEV / Staging`

Only include fields that are known from the evidence.

### Preconditions

Include only when they are required to reproduce the issue.

Examples:

- `WS billing: Paid`
- `User has an active MacroSnap subscription`
- `MacroSnap subscription status = Canceled`

### Steps to Reproduce

- Use a numbered list.
- Keep each step short and concrete.
- Prefer UI actions and navigation paths over long explanations.
- Never write reproduction steps as a paragraph.

Example:

1. Navigate to Billing page
2. Click Change Plan
3. Select downgrade option
4. Confirm downgrade

### Actual Result

- Describe current system behavior directly.
- Quote visible messages when they matter.
- Do not mix expectation into this section.

Good:

- `System shows Stripe error.`
- `System shows message: "Client license was unassigned by undefined".`

Bad:

- `There is an error in the system.`

### Expected Result

- Use explicit `SHOULD` or `SHOULD NOT`.
- State the correct system behavior in direct language.

Examples:

- `System SHOULD display correct message: "<Client name>'s MacroSnap license was unassigned when MacroSnap subscription canceled."`
- `Downgrade SHOULD apply at renewal date.`
- `System SHOULD handle Stripe errors internally and not expose raw Stripe errors to users.`

### Impact

Explain why the bug matters. Keep it practical and short.

Examples:

- `Users can attempt license reassignment even though the subscription is canceled.`
- `Billing information becomes misleading and can cause support confusion.`

### QA Note

Use this only when additional investigation context helps triage.

Example:

`Root cause is currently unclear (frontend rendering or API response). Please help verify.`

## Jira description formatting

When writing the final Jira description, use bold section headers for readability.

Preferred bug-ticket style:

- `**Slack Thread**`
- `**Title**`
- `**Environment**`
- `**Preconditions**`
- `**Steps to Reproduce**`
- `**Actual Result**`
- `**Expected Result**`
- `**Impact**`
- `**QA Note**`

If the ticket was created from a Slack thread:

- place the Slack thread hyperlink at the top of the description
- preserve the key context needed for triage

If the ticket is not a bug, do not force bug-only sections. Prefer:

- `**Slack Thread**`
- `**Title**`
- `**Context**`
- `**Current State**`
- `**Requested Action**`
- `**Impact**`
- `**QA Note**`

## Draft vs ticket creation

Default behavior:

1. Review the evidence
2. Draft the bug report
3. Present the draft for user review
4. Wait for explicit approval or a direct create-ticket request
5. Only then create the Jira ticket

Use this distinction consistently:

- `review thread and draft me bug report`
  - stop after the drafted report
- `create ticket`, `bug ticket`, `file this`
  - create the Jira issue only after the draft phase is complete or clearly waived

When the user wants a draft ready for Jira review, append a short `Ticket Fields` section after the bug report.

## Jira field workflow

When the user has established a Jira workflow, use these rules:

- `Project`
  - Use the project the user explicitly names, for example `MP` or `PAY`.
- `Issue Type`
  - Use the type the user asks for, such as `Bug`, `Task`, or `Improvement`.
- `Parent`
  - Set to the epic of the related US or feature.
  - This is different from linking the ticket to the US.
- `Sprint`
  - Use the sprint currently returned by Jira as `active` at ticket-creation time.
  - Do not reuse sprint names from screenshots or old messages.
- `QA`
  - Set to the confirmed QA account for that workspace.
- `Assignee`
  - Default to the assignee of the related US.
  - If the user names someone else, use the user override instead.
- `Priority`
  - Use the priority the user specifies for the bug or task.
- `Fix versions`
  - Set only when the user explicitly mentions a version.
  - Do not infer from the US, feature, or epic.
- `Relates`
  - Create a `Relates` issue link to the relevant US when the workflow asks for it.

### Project-specific validation

- Do not assume that different Jira projects share identical field configuration.
- Verify field metadata per project before creating tickets in a new project.
- In particular, do not assume `PAY` has the same custom fields or allowed values as `MP`.

## Slack-thread follow-up

When a ticket is created from a Slack thread, prepare a reply for that same thread after ticket creation succeeds.

Use this format:

```text
{Ticket type} logged! → {ISSUE-KEY hyperlink}
Assigned to {Assignee display name or tagged Slack user}
```

Examples:

```text
Bug logged! → MP-9893
Assigned to Thanh Nguyen (FE)
```

Rules:

- Use the actual ticket type in the first line.
- Link to the created Jira issue.
- If Slack user mapping is known, prefer tagging the assignee.
- If no Slack mapping is known, use the assignee display name.
- Draft this message automatically for review whenever the ticket originates from Slack context.

## Supported input types

The skill should support:

- QA notes
- Slack threads
- screenshots
- video recordings
- manual reproduction steps

When the source is incomplete:

- extract only what is observable
- infer the domain if it is strongly indicated
- leave unknown details out of `Environment` and `Preconditions`
- use `QA Note` when engineering investigation is needed

When converting Slack threads or loose notes:

- merge duplicate observations
- keep only the final user-visible failure
- remove conversational filler
- preserve exact quoted error text when it matters

When converting screenshots or videos:

- describe visible UI state, copy, and control availability
- do not claim backend causes unless the evidence explicitly shows them

## Domain cues

### Billing

Common keywords:

- subscription
- downgrade
- upgrade
- renewal
- billing cycle
- credit balance
- promo code
- invoice

Common expectation pattern:

- `Downgrade SHOULD apply at renewal date.`

### MacroSnap

Common keywords:

- license
- assign
- unassign
- reassign
- client
- unused licenses
- MacroSnap subscription

Common expectation pattern:

- `All MacroSnap licenses SHOULD be unassigned when subscription is canceled.`

### Email

Common keywords:

- email template
- spacing
- logo size
- discount information
- renewal discount
- promo display

Common expectation pattern:

- `Renewal discount SHOULD NOT be displayed when promo duration = Once.`

### Notification

Common keywords:

- in-app notification
- actor
- system message
- event trigger

Common expectation pattern:

- `Notification SHOULD show correct message when license is auto-unassigned.`

### UI

Common keywords:

- alignment
- spacing
- hover behavior
- checkbox visibility
- popup rendering
- button state

Common expectation pattern:

- `Checkbox SHOULD NOT appear when subscription is canceled.`

## Known expected behaviors

Use these defaults when the evidence matches the case and no stronger product rule is provided.

### Stripe errors

If the user sees a raw Stripe exception such as `StripeInvalidRequestError`, write the expected behavior as:

`System SHOULD handle Stripe errors internally and not expose raw Stripe errors to users.`

### Subscription downgrade logic

For downgrade timing, default to:

`Downgrade SHOULD apply at renewal date.`

### Canceled subscription UI behavior

When a subscription is canceled, related license management actions should not remain interactive. Expected behavior may include:

- hide license actions
- hide reassign buttons
- hide checkboxes
- disable license-management actions

## Severity hints

Use only when the user asks for severity guidance.

- Billing logic bugs: high
- License management bugs: high
- Notification bugs: medium
- UI alignment bugs: low
- Email layout bugs: low

## Optional category hints

If the workflow asks for bug categorization or Jira routing, map to one of:

- `UI bug`
- `Billing bug`
- `Notification bug`
- `Email bug`
- `License bug`

Suggested mapping:

- billing cycle, promo, invoice, downgrade, renewal -> `Billing bug`
- MacroSnap license assignment, unassign, reassign -> `License bug`
- email layout, discount copy, template content -> `Email bug`
- system message, actor, in-app alert -> `Notification bug`
- spacing, alignment, hover state, popup rendering, button visibility -> `UI bug`

Only suggest a category when the evidence is strong enough.

## Skill prompt behavior

Use this internal operating prompt:

```text
You are a Senior QA Engineer.

Generate a professional bug report based on the provided description, screenshot, Slack context, video, or reproduction steps.

Follow this structure:
Title
Environment
Preconditions
Steps to Reproduce
Actual Result
Expected Result
Impact
QA Note (optional)

Title rules:
- Start with SHOULD / SHOULD NOT / SHOULD BE ABLE TO
- Avoid vague words like "incorrect", "wrong", or "issue"
- Include business context when useful

Writing style:
- Use short and clear sentences
- Focus on system behavior
- Avoid long paragraphs
- Use numbered reproduction steps
- State expected behavior explicitly

If root cause is unclear, add a QA Note asking engineering to verify.

Draft-vs-create rule:
- Default to draft only
- Create Jira ticket only after explicit approval or direct create request

Jira workflow rule:
- Parent = epic of related US/feature
- Sprint = current active sprint from Jira
- QA = confirmed QA account
- Assignee = assignee of related US unless user overrides
- Priority = user-specified priority
- Fix versions = only when user explicitly mentions them
- Relates = link to the relevant US

Formatting rule:
- Use bold section headers in Jira descriptions
- Put Slack thread hyperlink at the top when the ticket comes from Slack

Non-bug rule:
- For task/improvement tickets from Slack, summarize context and requested action instead of forcing bug-only sections

Slack follow-up rule:
- After successful ticket creation from Slack, draft the thread reply in the standard `logged` format
```

## Example report

```md
Title
SHOULD hide checkbox and Reassign License button when MacroSnap subscription is canceled

Environment
Module: MacroSnap -> License Management
Environment: QA

Preconditions
MacroSnap subscription status = Canceled

Steps to Reproduce
1. Cancel MacroSnap subscription
2. Navigate to MacroSnap -> Unassigned Clients
3. Hover over a client record

Actual Result
Checkbox appears when hovering over the record.
Reassign License button is visible.

Expected Result
Checkbox SHOULD NOT appear when hovering over the record.
Reassign License button SHOULD be hidden.

Impact
Users can attempt license reassignment even though the subscription is canceled.
```
