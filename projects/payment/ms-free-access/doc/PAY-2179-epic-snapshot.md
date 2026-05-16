# PAY-2179 Epic Snapshot

- Epic Key: PAY-2179
- Epic: https://everfit.atlassian.net/browse/PAY-2179
- Epic Title: `PAY | MacroSnap Payment | Coach Subscriptions GA`
- Synced: 2026-05-12

## User Stories

### PAY-2556
- Key: PAY-2556
- Type: `User Story`
- Title: `PAY | MacroSnap P1 | Free Coach Access — US 1: System manages complementary MS access lifecycle on email match`
- Status: `To Do`
- Actionability: `Actionable`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2556
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3689087233/Spec+MacroSnap+Free+Access+for+Coach+s+Own+Client+Account
- Surface: `Complementary license lifecycle`
- Scope Tags: `eligibility, grant, revoke, migration`
- Suggested Relates Use Cases: `coach email match on paid self-serve workspace`
- Outcome:
  - Grants free MacroSnap access to coach-owned client accounts on exact email match.
  - Keeps access aligned with paid self-serve eligibility and teammate state.
  - Excludes complementary access from billed subscription counts.
- AC summary:
  - Grant access when a newly created connected client email matches an active coach on paid self-serve.
  - Complementary coach access must not appear in MS page totals or assign dropdown.
  - Revoke access when coach eligibility is lost or workspace downgrades to Starter.
  - Backfill existing eligible coach-client pairs and send the welcome email only for that backfill path.

### PAY-2557
- Key: PAY-2557
- Type: `User Story`
- Title: `PAY | MacroSnap P1 | Free Coach Access — US 2: Coach sees contextual callout on MacroSnap page based on plan`
- Status: `In Review`
- Actionability: `Actionable`
- Assignee: `Thinh Huynh Ngoc`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2557
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3689087233/Spec+MacroSnap+Free+Access+for+Coach+s+Own+Client+Account
- Surface: `MacroSnap page callout`
- Scope Tags: `web, messaging, plan-gating`
- Suggested Relates Use Cases: `coach perk callout and upgrade prompt`
- Outcome:
  - Shows contextual plan-based callouts on the MacroSnap page.
  - Adds disabled assigned-state behavior and tooltip on client profile when relevant.
- AC summary:
  - Paid self-serve coaches without MS subscription see a free-on-your-own-client-account callout.
  - Trial and Starter coaches see an upgrade message with navigation to plan selection.
  - Assigned-state UI stays visible but disabled on client profile, with tooltip and cancel-hide behavior.
- Status Warning: `Design is still marked waiting for approval for callout variants.`

## Ticket Seeds

- PAY-2556: Subtask seed: implement and verify complementary-access lifecycle for coach-email-matched client accounts on paid self-serve workspaces.
- PAY-2557: Subtask seed: verify paid-vs-free plan callouts and disabled assigned-state messaging on MacroSnap surfaces.

## Worklog Seeds

- PAY-2556: Defined the complementary MacroSnap access lifecycle for coach-owned client accounts.
- PAY-2557: Added plan-based MacroSnap callout and assigned-state behavior requirements.
