# Phase 4 — Writing Rules

> Load this file at the start of Phase 4, before writing the first test case row.
> Contains: coverage guidance, test design techniques, quality rules, traceability rules, all writing checklists.

---

## Coverage Guidance

Write a case only when the source supports it directly or provides enough evidence for a conservative inference.

**Functional:** Happy path · Alternate path · Negative path · Required vs optional inputs · Field format validation · Business rules · State changes · Role-based behavior · Error handling · Search/filter/sort/pagination/CRUD only when documented.

**Security:** Authentication · Authorization · Broken access control · Input validation · Sensitive data exposure · Session/token behavior. Do not auto-add XSS, SQL injection, CSRF unless source exposes relevant inputs or explicit security rules.

**UI/UX:** Labels, helper text, placeholders · Error/empty/loading/success states · Disabled states · Layout consistency when source provides observable UI details. Responsive/accessibility only when documented.

**Edge/Boundary:** Empty · Null · Whitespace-only · Min/max · Over-limit · Duplicate · Special characters · Expired/malformed/interrupted states · Concurrency only when supported by source.

---

## Test Design Techniques

Use the lightest technique that fully covers the documented behavior.

**Equivalence Partitioning** — valid vs invalid input classes, roles, or states.

**Boundary Value Analysis** — source defines limits or thresholds (min, max, length, quantity). One valid boundary + one invalid boundary just over/under.

**Decision Table** — outcome depends on combinations of business rules, toggles, or flags. One case per meaningful rule combination — do not explode all combinations unless each changes behavior.

**State Transition** — lifecycle movement, locking, cancellation, return, deletion, expiration. Map: start state → trigger → end state → blocked transition.

**Error Guessing** — use sparingly, only when grounded by: explicit spec ambiguity, documented concurrency concern, historical bug context, or implementation risk in technical spec. Do not use to invent undocumented forms or endpoints.

**Pairwise / Combinational Reduction** — only when source defines multiple independent variables and exhaustive combinations create waste. State the variables in `Requirement Analysis`.

---

## Quality Rules

### Title
- Start with `Verify` or `Check that`
- State what is verified and expected outcome in one sentence
- Avoid: `Verify the form works` / `Check system behavior`

Good: `Verify check icon shown in Session credit column for credit-required session types`

### Steps
- One physical action per step
- If >5–7 actions, split the scenario or move shared setup to `Preconditions`
- Never combine: `Fill all required fields and submit`

Good: `Click "Create account"` · `Type "admin@test.com" into the Email field`

### Test Data
- Use concrete values for every defined input
- Prefer realistic values over placeholders
- If source does not define a field, do not invent data for it

### Expected Result
- Describe what the tester can see or verify
- Specific about: redirects, status changes, visible messages, button states, persisted data, blocked behavior
- If exact message text is not in source, describe the observable outcome without inventing copy
- **Never use:** `renders as per design` / `works correctly` / `UI matches Figma` / `behaves normally`

Good: `The Save button becomes disabled while the request is in progress.`

### Case Granularity
- One row proves one main behavior or one rule combination
- Do not merge independent assertions to reduce count
- Do not split one simple assertion to inflate coverage

Use these forced split rules:
- Different target surfaces = different rows unless the source proves they are inseparable
- Different copy variants = different rows when the copy itself is the documented behavior
- Exact-threshold vs below-threshold vs above-threshold behavior = separate rows when the outcome changes
- Ordering, grouping, aggregation, visibility, and highlight treatment should not be collapsed into one row when they are independently observable
- Primary expectation vs conflict canary = separate rows

---

## Traceability Rules

- Every case maps back to a real source section
- Every case includes a short `Source Trace` explaining the fact or rule
- If a case cannot be traced, do not write it

Examples:
- `Source Trace: AC2 states that only Admin users can edit existing records.`
- `Source Trace: Diagram 4.6 shows history rows use session.name at time of redemption.`

For security tests: `API Spec §2.1` or `Auth - all endpoints`.

---

## Prioritization

**High:** Primary revenue or user-critical workflows · Security/permission risks · Mandatory validation · Data loss or irreversible state changes.

**Medium:** Common alternate paths · Common UI feedback · Recoverable failure handling.

**Low:** Lower-frequency cosmetic behavior · Less likely edge cases · Optional secondary flows.

---

## Missing Information Handling

- Add the smallest safe assumption only when needed to keep the suite usable
- Tag the case: `Assumption-based` in `Note` column
- Move significant gaps to `Clarification Questions`
- If a meaningful test cannot be drafted without inventing behavior → `Not-Testable-Yet Items`

---

## Branch Coverage Checklist

Run for every AC with conditional behavior:

- [ ] Positive path: condition satisfied?
- [ ] Negative/blocked path: condition not met?
- [ ] Zero vs non-zero: source distinguish none vs some vs all?
- [ ] Partial state: partially used, partially remaining, mixed-status?
- [ ] Cancel vs proceed: flow allows backing out or confirming?
- [ ] Before vs after action: downstream effects documented?
- [ ] Persistence/visibility: something stays visible, becomes hidden, gets preserved, or becomes blocked?
- [ ] Concurrency/stale-data: race conditions, re-checks, write-time validation?
- [ ] Exact threshold vs under/over threshold: does the source distinguish the boundary itself?
- [ ] Conflict branch: does another source define a plausible alternate outcome that should become a canary?

If a checklist item does not apply → say why in Condition Matrix.

---

## UI Interaction Coverage Checklist

Run for any AC with explicit controls or interaction sequences:

- [ ] Default state: visible, hidden, enabled, disabled, or conditional?
- [ ] Trigger action: what happens on click/hover/expand/collapse/clear/tab switch?
- [ ] Loading state: skeleton, spinner, fetch, or temporary disabled?
- [ ] Expanded/changed state: more items, scroll bar, sticky totals, replaced button?
- [ ] Reverse action: `Show less`, collapse, restore default?
- [ ] Count/label variant: text changes for n=1 vs n>1, singular vs plural?
- [ ] Copy-format variant: same-year vs cross-year, date format, countdown label, compact vs detailed wording?
- [ ] Not-show condition: control appears only when threshold exceeded?

---

## Row-Schema Variant Checklist

Run for any AC with repeated table/list where cells vary by type:

- [ ] Variant set: what are the documented row types/discriminators?
- [ ] Per-column mapping: each varying column has explicit output per variant?
- [ ] Sign/value variant: `+`, `-`, `--`, empty, or hidden?
- [ ] Visibility variant: cell shown only for some variants?
- [ ] Icon-state variant: no-note vs has-note / note icon vs linked-session icon?
- [ ] Negative visibility: alternate icon/cell must NOT show for wrong row type?
- [ ] Conflict variant: another AC defines the same row type differently?

---

## Success Outcome Checklist

Run for any AC centered on a successful action:

- [ ] Immediate: modal close, toast, redirect, or visual confirmation?
- [ ] Data update: balances, counts, rows, ordering, or summaries change?
- [ ] Audit trail: activity row, history item, or Updates entry created?
- [ ] Cross-surface sync: Overview, another tab, a card, or different section refreshes?
- [ ] Notification: content and navigation behavior documented?
- [ ] Zero-result consequence: row disappears, becomes hidden, or switches state?
- [ ] Surface split: does each target surface need its own row?
- [ ] Conflict canary: does any lower-priority source define a plausible alternate effect?

---

## Spreadsheet Output

If the user asks for `.xlsx` output or the suite is large enough that a workbook is clearly more usable:
- Use the spreadsheet skill for the final artifact
- Keep the same testcase columns as the markdown schema
- Prefer sheets such as `Test Cases`, `Summary`, `Risks & Source Conflicts`, `Dependency Map`
- Verify workbook structure, duplicate IDs, and row counts before delivery
