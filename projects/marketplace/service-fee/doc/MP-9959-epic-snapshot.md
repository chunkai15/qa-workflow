# MP-9959 Epic Snapshot

- Epic Key: MP-9959
- Epic: https://everfit.atlassian.net/browse/MP-9959
- Epic Title: `Launch May 20 | [MP Client] Enable Client Service Fee`
- Synced: 2026-05-15

## Stories

### MP-9988
- Key: MP-9988
- Title: `[Client MP] US1. Enable Client Service Fee`
- Status: `QA READY`
- Actionability: `Actionable`
- Reporter: `Phuong Tran`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9988
- Spec: https://everfit.atlassian.net/wiki/x/8oHV2w
- Surface: `Marketplace checkout and billing`
- Scope Tags: `checkout, invoice, email, stripe, recurring, coach-isolation`
- Suggested Relates Use Cases: `service fee charge, display, rounding, channel scoping, coach visibility`
- Outcome:
  - Enable 5% client service fee on Marketplace purchase flows and keep coach revenue unaffected.
  - Launch UI on May 20, 2026 without turning fee on until ToS update and explicit enable request.
  - Rename client-facing fee labels from `Platform Fee` to `Service Fee`, invoice label to `Marketplace Service Fee`.
- AC summary:
  - Checkout step 1 and 2 show `Service Fee`, tooltip, and total; fee is 5% of package cost or discounted subtotal.
  - Payment success, Stripe management, invoice, and 6 client email types reflect total including service fee.
  - Package Management shows charged service fee, purchase details modal, and billing support link.
  - Fee applies only to Marketplace channels: Homepage, MP Direct Link, Trainer Match Tool; Core platform direct link must not charge fee.
  - Coach-facing surfaces and coach emails must exclude service fee from displayed revenue.
  - Recurring subscription cycles continue charging service fee; rounding follows 3rd-decimal calculation and 2-decimal display.
- Note: Use local spec and analysis as execution source for detailed ACs, examples, and edge-case coverage.

## Ticket Seeds

- MP-9988: Subtask seed: verify service fee calculation, label rename, and tooltip consistency across checkout, success, and package management surfaces.
- MP-9988: Task seed: validate Marketplace-only channel scoping and coach-facing service-fee isolation across invoice, email, analytics, and recurring billing flows.

## Worklog Seeds

- MP-9988: Reviewed service fee rollout scope, mapped fee calculation and display requirements, and compressed reusable story context for downstream QA work.
