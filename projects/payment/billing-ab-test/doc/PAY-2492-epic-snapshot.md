# PAY-2492 Epic Snapshot

- Epic Key: PAY-2492
- Epic: https://everfit.atlassian.net/browse/PAY-2492
- Epic Title: `PAY | Billing Page | A/B Test Annual vs Monthly Default (Launch May 13)`
- Synced: 2026-05-13

## Stories

### PAY-2505
- Key: PAY-2505
- Title: `[API][A/B Test Annual vs Monthly] Export data for monthly vs annual subscribers in the last 6 months`
- Status: `QA READY`
- Actionability: `Actionable`
- Assignee: `Hoang Ho (BE)`
- Reporter: `Hoang Ho (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2505
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default#3.-A/B-Test-Implementation-&-Measurement:-Get-data-for-Free-Trial-or-Starter-WSs
- Surface: `billing export dataset`
- Scope Tags: `reporting, churn, export`
- Suggested Relates Use Cases: `monthly-vs-annual churn export and 6-month subscription dataset`
- Outcome:
  - Pull churn lifetime for monthly subscribers in the last 6 months.
  - Pull churn lifetime for annual subscribers in the last 6 months.
  - Export billing-cycle purchase data into the shared spreadsheet template.
- AC summary:
  - Compute monthly subscription lifetime until churn or scheduled churn.
  - Compute annual subscription lifetime until churn or scheduled churn.
  - Export new-subscription plan and billing-cycle data for the last 6 months.

### PAY-2506
- Key: PAY-2506
- Title: `[API][A/B Test Annual vs Monthly] API get billing cycle for A/B Test`
- Status: `WILL NOT FIX`
- Actionability: `Non-actionable`
- Assignee: `Hoang Ho (BE)`
- Reporter: `Hoang Ho (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2506
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default#3.-A%2FB-Test-Implementation-%26-Measurement%3A-Get-data-for-Free-Trial-or-Starter-WSs
- Surface: `billing cycle API`
- Scope Tags: `api, reporting`
- Suggested Relates Use Cases: `legacy API approach replaced by newer AB-testing path`
- Outcome:
  - Originally intended to expose billing-cycle data for the experiment.
  - Ticket is closed out of scope and should not drive new implementation.
- AC summary:
  - Spec link retained for historical context only.
  - Solution-design link exists but the delivery path was abandoned.
- Status Warning: `WILL NOT FIX`
- Note: do not use as implementation source unless scope changes

### PAY-2554
- Key: PAY-2554
- Title: `[Web][A/B Test Annual vs Monthly] Handle A/B testing for Annual vs Monthly Pricing Plan`
- Status: `QA READY`
- Actionability: `Actionable`
- Assignee: `Vinh Tran (FE)`
- Reporter: `Hieu Le(FE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2554
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default#3.-A/B-Test-Implementation-&-Measurement:-Get-data-for-Free-Trial-or-Starter-WSs
- Surface: `billing page pricing toggle`
- Scope Tags: `frontend, assignment, display`
- Suggested Relates Use Cases: `variant assignment, annual-default render, persistence on billing page`
- Default Assignee for Bugs/Tasks: `Vinh Tran (FE)`
- Outcome:
  - Assign Variant A or B on the first billing-page load for eligible workspaces.
  - Render monthly-default or annual-default pricing based on the stored variant.
  - Preserve the same variant across paid and downgrade state transitions.
- AC summary:
  - Only Free Trial and Starter workspaces are eligible for assignment.
  - Variant assignment is first-load only and idempotent on later visits.
  - Variant B preselects annual pricing; Variant A preserves current monthly default.
  - Paid workspaces must not receive an experiment assignment.
  - Re-entry after Paid to Starter keeps the original variant.

### PAY-2555
- Key: PAY-2555
- Title: `[Web][A/B Test Annual vs Monthly] Update event tracking for A/B testing`
- Status: `QA READY`
- Actionability: `Actionable`
- Assignee: `Vinh Tran (FE)`
- Reporter: `Hieu Le(FE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2555
- Spec: https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default#3.-A/B-Test-Implementation-&-Measurement:-Get-data-for-Free-Trial-or-Starter-WSs
- Surface: `billing page analytics events`
- Scope Tags: `frontend, analytics, tracking`
- Suggested Relates Use Cases: `view, toggle, confirm, purchase-success event payloads`
- Default Assignee for Bugs/Tasks: `Vinh Tran (FE)`
- Outcome:
  - Update billing-page analytics so experiment behavior can be measured reliably.
  - Feed purchase and interaction events into downstream A/B result computation.
- AC summary:
  - Track experiment-relevant billing interactions from the A/B billing page.
  - Keep event data aligned with the variant shown to the workspace.
  - Support the reporting flow used by the billing A/B result export.

### PAY-2568
- Key: PAY-2568
- Title: `[AB-Testing] Nightly ComputeResults Scheduler with z-test statistics`
- Status: `To Do`
- Actionability: `Actionable`
- Assignee: `Chien Nguyen (BE)`
- Reporter: `Hoang Ho (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2568
- Surface: `ab-testing result engine`
- Scope Tags: `backend, scheduler, statistics`
- Suggested Relates Use Cases: `nightly metric rollup and significance result generation`
- Outcome:
  - Run a nightly job to compute per-variant experiment metrics.
  - Use experiment assignments as exposure truth and event data as conversions.
  - Upsert computed statistics into `experiment_results`.
- AC summary:
  - Scheduler runs nightly and supports `CRON_AB_COMPUTE_RESULTS`.
  - Skip experiments not in `running` status.
  - Aggregate count, unique users, sum, and average per variant.
  - Use two-proportion z-test without external math libraries.
  - Keep control statistics fields null where appropriate and avoid duplicate result docs.

### PAY-2624
- Key: PAY-2624
- Title: `[AB-Testing] Create solution design & implementation plan MVP`
- Status: `QA Success`
- Actionability: `Actionable`
- Assignee: `Chien Nguyen (BE)`
- Reporter: `Chien Nguyen (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2624
- Spec: https://docs.everfit.vn/docs/ab-testing/solution-design-mvp
- Surface: `ab-testing design docs`
- Scope Tags: `architecture, planning, docs`
- Suggested Relates Use Cases: `source docs for MVP design and implementation sequencing`
- Outcome:
  - Capture MVP solution design for the shared A/B testing platform.
  - Capture implementation plan used by follow-on API and scheduler work.
- AC summary:
  - Maintain the MVP solution-design doc as the architecture source.
  - Maintain the implementation-plan doc as the execution source.
  - Use this ticket as upstream reference, not runtime feature logic.

### PAY-2668
- Key: PAY-2668
- Title: `[AB-Testing] Create new API experiments/:name/evaluate & update documents`
- Status: `QA READY`
- Actionability: `Actionable`
- Assignee: `Chien Nguyen (BE)`
- Reporter: `Chien Nguyen (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/PAY-2668
- Spec: https://docs.everfit.vn/docs/ab-testing/api-contract
- Surface: `experiment evaluate API`
- Scope Tags: `backend, api, platform`
- Suggested Relates Use Cases: `server-side experiment evaluation contract for billing integration`
- Outcome:
  - Add the experiment evaluation API endpoint for runtime assignment lookups.
  - Update supporting docs around the A/B testing API contract.
- AC summary:
  - Expose `experiments/:name/evaluate` for experiment evaluation.
  - Keep the API contract doc aligned with implementation.
  - Support downstream consumers such as the billing-page experiment flow.

## Ticket Seeds

- PAY-2505: Task seed: export 6-month monthly-vs-annual churn and new-subscription billing-cycle data into the billing A/B spreadsheet.
- PAY-2554: Subtask seed: implement first-load billing-page assignment and annual-vs-monthly default rendering for eligible workspaces.
- PAY-2555: Task seed: add or fix billing A/B analytics events so interaction and purchase measurement stays variant-aware.
- PAY-2568: Subtask seed: implement nightly experiment result computation with z-test significance and idempotent result upserts.
- PAY-2624: Task seed: refine or extend the shared A/B testing MVP design and implementation docs for follow-on work.
- PAY-2668: Subtask seed: build the `experiments/:name/evaluate` API and align the contract docs with runtime behavior.

## Worklog Seeds

- PAY-2505: Exported monthly-vs-annual churn and subscription billing-cycle data for the billing A/B analysis.
- PAY-2554: Implemented billing-page experiment assignment, annual-default rendering, and variant persistence checks.
- PAY-2555: Updated billing-page analytics events for billing A/B measurement flows.
- PAY-2568: Implemented nightly experiment result computation and statistical output persistence.
- PAY-2624: Prepared the shared A/B testing MVP solution design and implementation plan.
- PAY-2668: Added the experiment evaluation API contract and supporting documentation updates.
