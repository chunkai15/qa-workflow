# PAY-1901 Epic Snapshot

- Epic: [PAY-1901](https://everfit.atlassian.net/browse/PAY-1901)
- Title: `PAY | Booking | Session Credits P1.1 Expiration`
- Synced: 2026-04-21

## Stories

### PAY-2083
- Title: `User Story 0: Upcoming sessions count on client overview`
- Status: `WILL NOT FIX`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2083](https://everfit.atlassian.net/browse/PAY-2083)
- Spec: [User Story 0](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-0%3A-Adding-Upcoming-Session-to-the-Client-Profile-%3E-Overview-tab)
- Outcome:
  - Coach can view upcoming sessions count on client profile overview
- Note: `WILL NOT FIX`; do not use as implementation source unless scope changes

### PAY-2030
- Title: `User Story 1: Set expiration rule at issuance`
- Status: `To Do`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2030](https://everfit.atlassian.net/browse/PAY-2030)
- Spec: [User Story 1](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-1%3A-Set-Expiration-Rule-at-Issuance)
- Outcome:
  - Coach sets `Expires after` or `Doesn't expire` during credit issuance
  - Issued batch shares one `expiration_date`
- AC summary:
  - Show expiration controls in Issue Credits modal
  - Support days, weeks, months with max limits
  - Validate invalid values and disable submit on error
  - Save `expiration_date` or `NULL` for non-expiring credits

### PAY-2031
- Title: `User Story 2: Expiration date visibility`
- Status: `To Do`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2031](https://everfit.atlassian.net/browse/PAY-2031)
- Spec: [User Story 2](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-2%3A-Session-Credit-Balance-%E2%80%94-Expiration-Date-Visibility)
- Outcome:
  - Coach sees credit groups by expiration date
  - Expiring-soon credits get visual treatment and alerting
- AC summary:
  - Group balances by expiry date, non-expiring last
  - Show 7-day in-app notification for coach
  - Highlight expiring-soon groups with countdown
  - Show and remove client overview alert based on current state

### PAY-2032
- Title: `User Story 3: Delete credits with expiration-aware priority`
- Status: `To Do`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2032](https://everfit.atlassian.net/browse/PAY-2032)
- Spec: [User Story 3](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-3%3A-Delete-Credits-%E2%80%94-Expiration-Aware-Priority-Order)
- Outcome:
  - Delete and redeem consume credits by soonest expiration first
  - Non-expiring credits fall back to oldest-first
- AC summary:
  - Explain delete order in UI
  - Show grouped current/new balance in delete modal
  - Apply priority: earliest `expiration_date`, then oldest `created_at`
  - Reflect correct remaining balance and history after delete/redeem

### PAY-2033
- Title: `User Story 4: Expiring soon alert - 7-day treatment`
- Status: `WILL NOT FIX`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2033](https://everfit.atlassian.net/browse/PAY-2033)
- Spec: [Expiring soon section](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-4%3A-Expiring-Soon-Alert%E2%80%94-7-Day-Treatment)
- Outcome:
  - Defines 7-day alert treatment for expiring credits
- Note: `WILL NOT FIX`; use only as reference if related behavior is revived elsewhere

### PAY-2034
- Title: `User Story 7: System auto-expires credits`
- Status: `To Do`
- Assignee: `Linh Nguyen (BE)`
- Reporter: `thaovu`
- Priority: `Medium`
- Jira: [PAY-2034](https://everfit.atlassian.net/browse/PAY-2034)
- Spec: [User Story 7](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-7%3A-System-Auto-Expires-Credits-at-Expiration-Date)
- Outcome:
  - Scheduled job expires `available` credits after expiration time
  - Expired credits leave balance and appear in history/notification flows
- AC summary:
  - Expire credits where `expiration_date <= now`
  - Set status to `expired` and log `Expired` activity
  - Notify coach and remove expiring-soon alert after expiry
  - Keep expiration behavior for archived clients or downgraded workspaces
  - Expire returned credit immediately on early cancel if date already passed

## Ticket Seeds

- PAY-2030: Subtask seed: implement issuance-side expiration input, validation, and persistence
- PAY-2031: Subtask seed: implement grouped balance visibility and expiring-soon presentation
- PAY-2032: Subtask seed: update delete and redeem flows to consume soonest-expiring credits first
- PAY-2034: Subtask seed: implement auto-expire job, expired history event, and coach notification flow

## Worklog Seeds

- PAY-2030: Implemented expiration rule input, validation, and persistence flow for issued credits
- PAY-2031: Added grouped expiration visibility and expiring-soon alert handling for coach-facing balance views
- PAY-2032: Updated delete and redeem priority logic to consume earliest-expiring credits first
- PAY-2034: Added auto-expire processing, expired activity logging, and related notification handling
