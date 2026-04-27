# Session Credit Expiration P1.1 - QA Feature Analysis

## Input Analysis

### Visual Asset Inventory

| Reference | Scope | Access | QA Handling |
| --- | --- | --- | --- |
| Figma nodes `4345-1117116`, `4850-482057` | US1 AC1-AC3 | Attempted, 404 | Functional cases written from spec; visual-only assertions tagged `Draft - Figma not reviewed` |
| Figma nodes `7958-1137366`, `8132-1368498`, `4770-1123982`, `5803-205071`, `5809-426400` | US2 AC1-AC5, US4 AC1 | Attempted, 404 | Layout/color/spacing remain draft |
| Figma nodes `4838-436624`, `8074-1095065`, `8009-467915`, `8009-467419`, Figma Make scroll link | US3 AC1-AC2, US4 AC4-AC5 | Attempted, 404 | Tooltip/modal/filter visuals remain draft |
| Confluence attachment list in `spec.md` section 12 | Cross-feature | Not locally available | Could not map to ACs; logged as missing visual input |
| `solution-design.md` | Cross-feature | Reviewed | Used for technical supplement and contradiction detection |
| `Session_Credits_P1_1_BE_Logic_DataFlow.md` | Cross-feature | Reviewed | Used for technical supplement and contradiction detection |

### AC Type Classification Matrix

| AC | Structural Type | Risk | Est. Floor |
| --- | --- | --- | --- |
| US1 AC1 | Compound UI state | HIGH | 4 |
| US1 AC2 | Field-enum + conditional | HIGH | 3 |
| US1 AC3 | Validation matrix | HIGH | 4 |
| US1 AC4 | Multi-effect success | HIGH | 2 |
| US1 AC5 | Success variant | MEDIUM | 1 |
| US2 AC1 | Compound grouping rules | HIGH | 5 |
| US2 AC2 | Compound notification rule | HIGH | 3 |
| US2 AC3 | Conditional visual treatment | HIGH | 3 |
| US2 AC4 | Conditional alert state | MEDIUM | 2 |
| US2 AC5 | Logical inversion | MEDIUM | 2 |
| US2 AC6 | Headline cleanup rule | LOW | 1 |
| US3 AC1 | Headline tooltip rule | LOW | 1 |
| US3 AC2 | Compound list variant | HIGH | 6 |
| US3 AC3 | State transition rule | HIGH | 3 |
| US3 AC4 | Multi-effect success | HIGH | 2 |
| US3 AC5 | State transition rule | HIGH | 2 |
| US4 AC1 | Scheduled multi-effect flow | HIGH | 5 |
| US4 AC2 | Conditional preserve rule | MEDIUM | 2 |
| US4 AC3 | State transition conflict | HIGH | 3 |
| US4 AC4 | Headline filter update | LOW | 1 |
| US4 AC5 | Filter result states | MEDIUM | 2 |

### Cross-Source Conflict Log

| Topic | Primary interpretation used for core cases | Conflicting source |
| --- | --- | --- |
| Booking deduction order | Soonest-expiring first, then oldest non-expiring | `solution-design.md` 3.3 keeps FIFO by `created_at` |
| Delete modal order | Keep both ASC and DESC as conflict canaries | `spec.md` US3 AC2 says `exp date DESC`; US2/US3 background say soonest first |
| Expiring-soon threshold | Primary cases use exactly 7 days | `spec.md` US2 AC2 also says `if expires <= 7, we won't alert` |
| Expiration cadence | Product expectation treated as `within 1 hour` | `solution-design.md` says hourly; `data-flow.md` says every 15 minutes |
| Early cancel after passed expiry | Stable contract is `used -> expired` with no available-balance bounce | `solution-design.md` writes `returned` then `expired`; `data-flow.md` writes only `expired` |
| Preview date vs stored timestamp | UI preview is informational; persistence follows `ceil_hour` | `spec.md` says `today + N period`; technical docs allow up to one-hour delta |

## Deep Reading

### Deep Reading - US1 AC1

- Step 0: Compound, HIGH, Figma unavailable, structural items = field placement, default `Expires after` state, option list, dependent control toggle.
- Q1-Q5: verbs/items = show, click, select, hide on expiration field, dropdown, value input, period dropdown; actor = coach/system; explicit preconditions = Booking enabled + connected client + modal open; implicit = Issue Credits modal renders; state rules = default shows `Expires after` + input + unit, `Doesn't expire` hides controls, switching back re-shows them.
- Q6-Q9: outcomes = field visible, 2 options shown, hover/check visible, controls toggle; negatives = field not missing, controls not visible on `Doesn't expire`, controls restored on `Expires after`; sequence = open modal then change option; dependency = feeds US1 AC5.
- Q10-Q13: boundaries = default vs alternate option; failures = exact spacing not testable; floor A/B/C = 4/4/4 -> 4; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US1 AC2

- Step 0: Field-enum + conditional, HIGH, Figma unavailable, structural items = valid integer input, unit-specific preset options, preview/button enablement.
- Q1-Q5: verbs/items = input, select, hover, collapse, enable on number box, preset list, period dropdown, preview, submit button; actor = coach/system; explicit preconditions = modal open with `Expires after`; implicit = other issuance fields eventually completed; state rules = positive integer only, preset list changes by unit, typed value persists, valid value shows preview.
- Q6-Q9: outcomes = preset list changes by unit, selected preset collapses into input, typed value remains, preview appears, submit can enable; negatives = wrong-unit options not shown, button not enabled before required fields complete; sequence = choose unit/value first; dependency = validation expanded in AC3 and persistence in AC4.
- Q10-Q13: boundaries = min valid value 1; failures = timezone basis for `today` not defined; floor A/B/C = 3/3/3 -> 3; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US1 AC3

- Step 0: Validation matrix, HIGH, Figma unavailable, structural items = unit max errors, zero-value error, disabled submit, hidden preview while invalid.
- Q1-Q5: verbs/items = enter, blur, change, show, disable, hide on expiration field, inline error, red border, preview, submit button; actor = coach/system; explicit preconditions = modal open with `Expires after`; implicit = validation runs on blur/unit change; state rules = days > 365, weeks > 52, months > 36, or 0 all produce the documented errors and invalid-state UI.
- Q6-Q9: outcomes = correct error copy, red border, hidden preview, disabled submit, revalidation after unit change; negatives = wrong error copy must not appear, preview must not remain visible, submit must not stay enabled; sequence = invalidation occurs on blur or after unit switch; dependency = blocks AC4 success.
- Q10-Q13: boundaries = 0 and one-over-max; failures = decimals/negative numbers not specified; floor A/B/C = 4/4/4 -> 4; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US1 AC4

- Step 0: Multi-effect success, HIGH, structural items = batch-level expiration persistence and grouped balance refresh.
- Q1-Q5: verbs/items = issue, store, share, show, accumulate on session_credit record, expiration_date, toast, balance row; actor = coach/system; explicit preconditions = all required inputs valid; implicit = issuance request succeeds; state rules = one batch gets one expiration date, same-date groups accumulate, expiration is immutable after creation.
- Q6-Q9: outcomes = issuance success, expiration stored, toast shown, balance refreshed, same-date totals accumulated; negatives = mixed expiration values must not exist inside one batch; sequence = submit after AC2/AC3 success; dependency = feeds US2 grouping and US3 ordering.
- Q10-Q13: boundaries = repeated issuance with same expiration; failures = exact timestamp formatting not defined; floor A/B/C = 2/2/2 -> 2; design = N/A. Gate 5: [x] passed.

### Deep Reading - US1 AC5

- Step 0: Success variant, MEDIUM, structural items = null expiration path.
- Q1-Q5: verbs/items = issue, store, accumulate, omit label on `expiration_date = NULL`; actor = coach/system; explicit preconditions = `Do not expire` selected; implicit = submit succeeds; state rules = non-expiring credits persist with `NULL` expiration and render without expiration label/date.
- Q6-Q9: outcomes = issuance success, non-expiring balance updated, toast shown, expiration label omitted; negatives = system must not invent a date for non-expiring credits; sequence = alternate path from AC1; dependency = feeds US2 non-expiring display and US4 exclusion from auto-expire.
- Q10-Q13: boundaries = non-expiring row variant; failures = none beyond general request failure; floor A/B/C = 1/1/1 -> 1; design = N/A. Gate 5: [x] passed.

### Deep Reading - US2 AC1

- Step 0: Compound grouping rules, HIGH, Figma unavailable, structural items = EXPIRATIONS section, same-year format, cross-year format, non-expiring row variant, total/order/grouping rules.
- Q1-Q5: verbs/items = see, group, show, order, sum on EXPIRATIONS section, group rows, dates, total credits; actor = coach/system; explicit preconditions = available credits with expiration rules; implicit = pop-up opens from Balance; state rules = same-year omits year, cross-year includes year, non-expiring shows `don't expire`, same expiration dates accumulate, all-non-expiring hides expiration grouping.
- Q6-Q9: outcomes = section visible, grouped rows correct, total matches sum, soonest-first ordering, non-expiring last when mixed; negatives = no year for same-year rows, empty groups not shown, expiring rows absent when all credits are non-expiring; sequence = depends on issued data; dependency = extended by AC3 and AC6.
- Q10-Q13: boundaries = 1 vs many, same-year vs cross-year, mixed vs all non-expiring; failures = pop-up empty-state copy not documented; floor A/B/C = 5/5/5 -> 5; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US2 AC2

- Step 0: Compound notification rule, HIGH, Figma unavailable, structural items = consolidated 7-day notification, platform navigation, threshold-rule conflict.
- Q1-Q5: verbs/items = send, receive, click, navigate, show on in-app notification, quantity copy, date copy, category, deep link; actor = system/coach; explicit preconditions = one or more available batches expire in 7 days; implicit = notification plumbing works; state rules = one client-level notification may summarize multiple session types, copy varies for singular/plural, web goes to Sessions, mobile goes to Overview.
- Q6-Q9: outcomes = one Admin notification, correct message content, correct deep link, no alert in suppressed states; negatives = no multiple notifications per client per run, no alert for used/deleted/expired credits; sequence = daily job before expiration; dependency = shared 7-day window with AC3/AC4.
- Q10-Q13: boundaries = exactly 7 days vs under-7-day conflict, 1 vs many credits; failures = timezone/date bucket undefined; floor A/B/C = 3/3/3 -> 3; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US2 AC3

- Step 0: Conditional visual treatment, HIGH, Figma unavailable, structural items = Sessions card shows soonest qualifying group, pop-up highlights all qualifying groups, countdown/pluralization.
- Q1-Q5: verbs/items = show, highlight, click, count down on balance card, detail pop-up, countdown text; actor = coach/system; explicit preconditions = available credits expire within 7 days; implicit = grouped balance query computes countdown; state rules = card shows only soonest qualifying group, pop-up highlights all <=7-day groups, countdown is 7..1, copy varies for 1 day vs many and 1 credit vs many.
- Q6-Q9: outcomes = red-highlighted card row, pop-up highlights qualifying rows, countdown copy correct, pluralization correct; negatives = non-qualifying rows not highlighted, card not showing multiple qualifying groups; sequence = grouped balance first, pop-up second; dependency = mirrored in AC4.
- Q10-Q13: boundaries = countdown 7, countdown 1, amount 1, amount > 1; failures = exact color token/layout unavailable; floor A/B/C = 3/3/3 -> 3; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US2 AC4

- Step 0: Conditional alert state, MEDIUM, Figma unavailable, structural items = alert visible with soonest batch and alert absent when none qualifies.
- Q1-Q5: verbs/items = display, show, do not show on Overview alert, icon, count badge; actor = coach/system; explicit preconditions = available credits within 7 days; implicit = Overview response carries alert data; state rules = non-dismissible alert shows the soonest batch only and disappears when no batch qualifies.
- Q6-Q9: outcomes = alert visible with soonest batch, alert absent when no batch qualifies; negatives = later qualifying batch must not replace the sooner one while both exist; sequence = alert rendered from grouped balance data; dependency = removed/switched in AC5.
- Q10-Q13: boundaries = qualifying client vs non-qualifying client; failures = exact badge/icon layout unavailable; floor A/B/C = 2/2/2 -> 2; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US2 AC5

- Step 0: Logical inversion, MEDIUM, Figma unavailable, structural items = remove alert when no qualifying batch remains and switch alert when another qualifying batch remains.
- Q1-Q5: verbs/items = expire, delete, use, remove on expiring-soon alert and qualifying batch; actor = coach/system; explicit preconditions = alert currently shown; implicit = qualification recalculated after each change; state rules = alert is removed when no <=7-day available batch remains and switches to next soonest when one still exists.
- Q6-Q9: outcomes = alert removed after final qualifying batch disappears, alert switches when another qualifying batch remains; negatives = stale alert must not point to deleted/used/expired batch; sequence = post-action only; dependency = updated by delete/use/expire flows.
- Q10-Q13: boundaries = final qualifying batch removed vs another still remains; failures = refresh latency unspecified; floor A/B/C = 2/2/2 -> 2; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US2 AC6

- Step 0: Headline cleanup rule, LOW, structural items = zero-balance groups are hidden.
- Q1-Q5: verbs/items = hide on balance group with no credits left; actor = system; explicit preconditions = a group reaches zero available credits; implicit = use/delete/expire already occurred; state rules = zero-balance group omitted from Balance view.
- Q6-Q9: outcomes = group disappears from Balance view; negatives = empty group must not remain visible; sequence = post-state-change only; dependency = used by delete and auto-expiration flows.
- Q10-Q13: boundaries = 1 remaining vs 0 remaining; failures = none; floor A/B/C = 1/1/1 -> 1; design = N/A. Gate 5: [x] passed.

### Deep Reading - US3 AC1

- Step 0: Headline tooltip rule, LOW, Figma unavailable, structural items = tooltip helper text on Amount to Delete.
- Q1-Q5: verbs/items = click, hover, see on minus button, Amount to Delete label, tooltip; actor = coach; explicit preconditions = outstanding credits exist; implicit = delete control visible; state rules = tooltip copy describes soonest-expiring first then non-expiring.
- Q6-Q9: outcomes = tooltip visible with documented copy; negatives = misleading FIFO-only wording not shown; sequence = open delete modal then hover; dependency = mirrors AC3 business rule.
- Q10-Q13: boundaries = none beyond tooltip visibility; failures = icon placement unknown; floor A/B/C = 1/1/1 -> 1; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US3 AC2

- Step 0: Compound list variant, HIGH, Figma unavailable, structural items = current balance list, new balance list, order conflict, non-expiring row, scroll thresholds, <=7-day red treatment.
- Q1-Q5: verbs/items = show, switch, scroll, highlight, count down on delete modal, session-type dropdown, current/new lists, group rows; actor = coach/system; explicit preconditions = selected session type has available credits; implicit = delete amount is valid; state rules = current and new balances render separately, non-expiring row uses dedicated copy, current list scrolls at >5 groups, new list scrolls at >4 groups, <=7-day groups show red/countdown treatment.
- Q6-Q9: outcomes = both lists render, preview updates after amount/session-type change, scroll appears past thresholds, qualifying rows are highlighted, pluralization correct; negatives = scroll not below threshold, non-qualifying rows not highlighted, preview not identical to current list after non-zero delete; sequence = modal load then preview update; dependency = preview must reflect AC3 actual delete order.
- Q10-Q13: boundaries = 1 vs many credits, >5 current groups, >4 new groups, 1-day countdown, ASC/DESC conflict; failures = exact sort intent unresolved; floor A/B/C = 6/6/6 -> 6; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US3 AC3

- Step 0: State transition rule, HIGH, structural items = earliest expiration first, same-date tie by oldest created_at, non-expiring last.
- Q1-Q5: verbs/items = confirm, delete, consume on delete quantity, balance groups, expiration_date, created_at; actor = coach/system; explicit preconditions = mixed-expiration balance exists; implicit = only available credits are eligible; state rules = earlier expiration wins, same expiration resolves by oldest created_at, non-expiring used last.
- Q6-Q9: outcomes = correct credits removed, resulting balance matches documented example, non-expiring untouched until expiring pool exhausted; negatives = later expiration not consumed first, non-expiring not consumed while expiring credits remain; sequence = selection order happens at confirmation; dependency = explained by AC1/AC2 and surfaced in AC4.
- Q10-Q13: boundaries = same-date tie and expiring-to-non-expiring crossover; failures = concurrency handling inherited from P1.0, not restated; floor A/B/C = 3/3/3 -> 3; design = N/A. Gate 5: [x] passed.

### Deep Reading - US3 AC4

- Step 0: Multi-effect success, HIGH, structural items = balance/history update and Overview alert recalculation.
- Q1-Q5: verbs/items = view, show, record, update on balance card, All tab, Deleted tab, Overview alert; actor = coach/system; explicit preconditions = delete succeeds; implicit = amount and optional note persist correctly; state rules = deleted credits disappear from grouped balance, Deleted row includes documented fields, Overview alert updates if the soonest <=7-day group was deleted.
- Q6-Q9: outcomes = regrouped remaining balance, Deleted row visible in All and Deleted tabs, Overview alert updates/removes; negatives = deleted credits not still visible, stale alert not pointing to removed group; sequence = post-delete only; dependency = ties back to US2 AC4/AC5.
- Q10-Q13: boundaries = deleting the last qualifying <=7-day batch; failures = exact history sort position not documented; floor A/B/C = 2/2/2 -> 2; design = N/A. Gate 5: [x] passed.

### Deep Reading - US3 AC5

- Step 0: State transition rule, HIGH, structural items = soonest-expiring booking deduction and FIFO contradiction canary.
- Q1-Q5: verbs/items = book, redeem, deduct on booking flow and available credits; actor = coach/system; explicit preconditions = client has credits with expiration; implicit = booking succeeds and consumes one credit; state rules = spec/data flow say soonest-expiring first then non-expiring, while technical design keeps FIFO.
- Q6-Q9: outcomes = primary case consumes earliest-expiring credit, canary case guards FIFO implementation drift; negatives = non-expiring not consumed while expiring credit exists; sequence = deduction on booking success; dependency = contradicts `solution-design.md` 3.3.
- Q10-Q13: boundaries = expiring-to-non-expiring crossover and same-date tie risk; failures = tie-breaker not explicitly stated in spec; floor A/B/C = 2/2/2 -> 2; design = N/A. Gate 5: [x] passed.

### Deep Reading - US4 AC1

- Step 0: Scheduled multi-effect flow, HIGH, Figma unavailable, structural items = within-window expiration, balance/history update, consolidated notification, Updates entry, Overview alert recalculation.
- Q1-Q5: verbs/items = run, expire, update, remove, hide, notify, navigate on scheduler, balance card, history row, notification, Updates feed, Overview alert; actor = system/coach; explicit preconditions = available credits with `expiration_date <= now`; implicit = publishing/history rendering works; state rules = only available credits expire, zero-balance groups hide, history action is Expired, one notification/Updates entry per client run, Overview alert removes or switches.
- Q6-Q9: outcomes = credit leaves available balance, Expired history row appears, notification/Updates deep links work, alert recalculates, system actor preserved; negatives = used credits not expired here, empty expired groups not visible, clients not notified; sequence = after eligibility time passes; dependency = AC4/AC5 rely on expired history rows.
- Q10-Q13: boundaries = exactly-at-threshold, last credit in a group, one vs many consolidated quantity; failures = cadence and idempotency unresolved; floor A/B/C = 5/5/5 -> 5; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US4 AC2

- Step 0: Conditional preserve rule, MEDIUM, structural items = archived-client path and downgraded-workspace path.
- Q1-Q5: verbs/items = archive, downgrade, expire, notify on client/workspace state and credits; actor = system/coach; explicit preconditions = archived client or Starter workspace still has credits with expiration date; implicit = P1.0 preserved balances still exist; state rules = expiration behaves the same as active scenario.
- Q6-Q9: outcomes = balance/history/notifications still produced; negatives = archive/downgrade must not suppress the worker; sequence = archive/downgrade precedes expiration; dependency = extends AC1.
- Q10-Q13: boundaries = archived vs active, downgraded vs subscribed; failures = none beyond shared scheduler risk; floor A/B/C = 2/2/2 -> 2; design = N/A. Gate 5: [x] passed.

### Deep Reading - US4 AC3

- Step 0: State transition conflict, HIGH, structural items = cancel after passed expiration, final `used -> expired` state, activity-log conflict.
- Q1-Q5: verbs/items = return, expire, change status on early cancel flow, credit status, activity history; actor = coach/system; explicit preconditions = booking used a credit whose expiration date has passed; implicit = cancel is early, not late; state rules = stable product outcome is expired with no visible available balance, but history may be `returned + expired` or only `expired`.
- Q6-Q9: outcomes = cancel succeeds, final status is expired, available balance does not bounce up, conflict canaries retained for history rows; negatives = credit not restored as lasting available balance; sequence = booked first, expiration passes, then early cancel; dependency = interacts with AC1 alert/history behavior.
- Q10-Q13: boundaries = cancel before vs after expiration; failures = exact history-row count unresolved; floor A/B/C = 3/3/3 -> 3; design = N/A. Gate 5: [x] passed.

### Deep Reading - US4 AC4

- Step 0: Headline filter update, LOW, Figma unavailable, structural items = `Expired` inserted between `Voided` and `Deleted`.
- Q1-Q5: verbs/items = click and see on Event filter and Expired option; actor = coach; explicit preconditions = Booking enabled and history visible; implicit = filter loads; state rules = Expired option appears in the documented position.
- Q6-Q9: outcomes = filter contains Expired in correct order; negatives = Expired not elsewhere in sequence; sequence = open filter first; dependency = AC5 uses this option.
- Q10-Q13: boundaries = none; failures = visual chip style unavailable; floor A/B/C = 1/1/1 -> 1; design = attempted 404. Gate 5: [x] passed.

### Deep Reading - US4 AC5

- Step 0: Filter result states, MEDIUM, Figma unavailable, structural items = expired-only results and no-results empty state.
- Q1-Q5: verbs/items = filter, return, show on Event filter, history rows, empty-state description; actor = coach; explicit preconditions = Expired option available and history loaded; implicit = expired data may or may not exist; state rules = Expired filter returns only expired rows, otherwise `No results found.`
- Q6-Q9: outcomes = expired-only rows visible, non-expired rows excluded, empty-state text shown when applicable; negatives = non-expired rows not remain in filtered view; sequence = AC4 option first, then filter result; dependency = relies on AC1 expired history rows.
- Q10-Q13: boundaries = one expired row vs zero expired rows; failures = pagination/sort behavior not specified; floor A/B/C = 2/2/2 -> 2; design = attempted 404. Gate 5: [x] passed.

## Dependency Map

| Relationship | Source AC | Target AC | Type | Test Implication | Covered By |
| --- | --- | --- | --- | --- | --- |
| Issued expiring batch drives grouped display | US1 AC4 | US2 AC1 | Data dependency | Grouping/order must reflect persisted expiration dates | TC-US01-FUNC-006, TC-US01-EDGE-004, TC-US02-FUNC-001, TC-US02-FUNC-002 |
| `NULL` expiration drives non-expiring variant | US1 AC5 | US2 AC1 | Data dependency | Non-expiring row rules only work if persistence is truly null | TC-US01-FUNC-007, TC-US02-EDGE-001 |
| Invalid expiration blocks successful issue | US1 AC3 | US1 AC4 | Sequence constraint | Successful issuance must not bypass validation | TC-US01-EDGE-001, TC-US01-EDGE-002, TC-US01-EDGE-003, TC-US01-UI-003 |
| One 7-day calculation feeds notification, card, and Overview | US2 AC2 | US2 AC3 / US2 AC4 | Shared entity | All three surfaces must agree on qualifying batches | TC-US02-FUNC-003, TC-US02-FUNC-005, TC-US02-FUNC-007 |
| Delete affects expiring-soon alert | US3 AC4 | US2 AC5 | State dependency | Removing a qualifying group must remove or switch the alert | TC-US03-FUNC-005, TC-US02-FUNC-008, TC-US02-EDGE-004 |
| Auto-expire affects expiring-soon alert | US4 AC1 | US2 AC5 | Logical inversion | Expiring the soonest group must remove or switch the alert | TC-US04-FUNC-004, TC-US02-FUNC-008, TC-US02-EDGE-004 |
| Delete modal preview should mirror delete logic | US3 AC2 | US3 AC3 | Reuse reference | Preview rows must reflect actual consumption order | TC-US03-FUNC-002, TC-US03-UI-001, TC-US03-FUNC-003 |
| Expired history powers Expired filter | US4 AC1 | US4 AC4 / US4 AC5 | Sequence constraint | Filter checks are valid only if Expired rows exist first | TC-US04-FUNC-002, TC-US04-UI-001, TC-US04-FUNC-006 |
| Booking deduction contradiction | US3 AC5 | `solution-design.md` 3.3 | Contradiction | Keep both primary and canary cases | TC-US03-FUNC-006, TC-US03-EDGE-005 |
| Early-cancel history contradiction | US4 AC3 | `solution-design.md` 8.1 / `data-flow.md` 10 | Contradiction | Keep both history canaries until confirmed | TC-US04-FUNC-005, TC-US04-EDGE-004, TC-US04-EDGE-005 |

## Assumptions

- Core alert logic is tested as exactly 7 days because that is the most repeated source statement.
- Acceptance for expiration timing is `within 1 hour`, not an exact cron frequency.
- Early-cancel core validation checks final state and no available-balance bounce; audit-row count is treated as unresolved.
- Mixed balances show non-expiring groups last, while all-non-expiring balances do not render an expiration section.

## Missing Info

- Timezone for preview date and 7-day scheduler bucketing.
- Exact delete-modal ordering intent (`DESC` vs soonest-first).
- Final cron frequency and idempotency details for expiration.
- Final activity-log expectation for early-cancel-after-expiry.
- Reviewable Figma/attachment visuals.

## Risks from Ambiguity

1. Backend may ship FIFO booking deduction if engineering follows `solution-design.md`.
2. Notification job may over-alert or under-alert because `7 days` is phrased inconsistently.
3. Delete modal could visually sort opposite to actual delete behavior.
4. Expiration worker could pass technical checks but still miss product expectation for timeliness.
5. History assertions for early cancel could fail purely due to unresolved source disagreement.

## Coverage Summary

- User stories analyzed: 4
- Acceptance criteria analyzed: 21
- Planned test cases: 58
- Functional: 28
- UI: 11
- Edge/conflict: 18
- Security: 1

## Clarification Questions

1. Is the expiring-soon notification job `exactly 7 days`, or does the `<= 7` sentence mean something else operationally?
2. Should delete modal lists be sorted soonest-first or `exp date DESC`?
3. In P1.1, does booking redemption become expiration-aware or remain FIFO?
4. What is the accepted expiration SLA: every 15 minutes, hourly, or simply within 1 hour?
5. For early cancel after passed expiry, should Balance History show `Returned` + `Expired` or only `Expired`?
6. Which timezone defines `today + N period` and the daily 7-day alert bucket?

## Automation Candidates

- API/integration checks for issuance persistence, delete ordering, booking deduction ordering, auto-expiration state change, and history filter.
- UI automation for modal validations, grouped balance rendering, delete preview, and Overview alert synchronization.
- Event-contract checks for expired and expiring-soon notifications.
