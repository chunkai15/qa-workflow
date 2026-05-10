# Test Design Techniques

> Always load when qa_testcase_generator starts.
> Technique selection guide + 10 functional rules + 15 edge case groups.

---

## Core Test Design Techniques

### Equivalence Partitioning (EP)
Divide inputs/states into classes where system behaves identically. 1 representative per class.

Apply to: input fields (valid/invalid), user roles (Coach/Admin/Client), entity states (active/archived/deleted), subscription plans (trial/active/cancelled).

*Classes come from Actor Map (Phase 0.5) and Dependency Map ambiguity list.*

### Boundary Value Analysis (BVA)
Test at and just outside documented limits. 1 valid boundary + 1 invalid per threshold.

- Numeric: min, min-1, max, max+1
- String length: maxLen, maxLen+1
- Collection: empty (0), 1, max, max+1
- Create dedicated DataID for boundary fixtures (TD-001-MIN, TD-002-MAX)

### Decision Table
When outcome depends on COMBINATIONS of conditions. Map each meaningful combination → 1 TC row.

Trigger: AC has ≥2 independent conditions (`if A and B then...`).
When ≥3 conditions: list all meaningful combinations, document excluded combos with reason.
API combinations → status code outcomes.

**Example table structure:**
```
| Condition A | Condition B | Condition C | Outcome |
| subscription active | role = coach | credits > 0 | Issue succeeds → 201 |
| subscription active | role = coach | credits = 0 | Error: no credits → 400 |
| subscription cancelled | any role | any credits | Error: subscription → 403 |
```

### State Transition Testing
For entities with defined lifecycle states. Build State Transition Table BEFORE writing TCs:

```
| From State | Event/Trigger | To State | Valid? | TC needed |
| available | session booked | used | ✓ valid | TC: book session → credit used |
| used | session cancelled | returned | ✓ valid | TC: cancel → credit returned |
| available | manual void | voided | ✓ valid | TC: void → balance decreases |
| voided | any action | voided | ✗ invalid | TC: attempt action on voided → error |
```

- Valid transition → positive TC
- Invalid transition (blocked) → negative TC with expected error
- Every row = ≥1 TC or explicit exclusion with reason

### Scenario Testing (End-to-End)
Required for every module with Risk ≥ MEDIUM.

- 1 Scenario TC per business flow per module
- Steps span multiple ACs, may cross UI surfaces
- Expected result = business outcome (not a single UI state)
- Category code: `SCEN`
- Write Scenario TC FIRST when starting a HIGH/MEDIUM module

### Error Guessing Heuristics (5 heuristics)

**H1 — API integration:**
- Network timeout mid-request
- Malformed/unexpected response body
- Duplicate request (idempotency check — same request sent twice)

**H2 — Async / eventual consistency:**
- Action reports success but side effect (balance update, notification, log) has NOT yet propagated
- Test by checking side effects immediately after success response

**H3 — Permission at record level:**
- User has correct role but does NOT own/have access to this SPECIFIC record
- e.g.: Coach tries to access a Client belonging to another Coach

**H4 — Concurrent modification:**
- Two users perform same action on same entity simultaneously
- What happens? Last-write-wins? Conflict error? Silent data loss?

**H5 — Stateful flow rollback:**
- Step N of multi-step flow fails — are steps 1 to N-1 rolled back or left in partial state?
- e.g.: Payment initiated → webhook fails → subscription status remains pending?

For each heuristic: if spec provides sufficient context → write TC. If not → add to Clarification Questions.

---

## Technique Selection Guide

| Signal in AC/spec | Primary technique | Supporting |
|---|---|---|
| Business flow with ≥3 steps, multi-surface | **Scenario Testing** | + State Transition for lifecycle changes |
| Field with min/max/length/format constraint | **BVA** | + EP for valid/invalid classes |
| Multiple roles with different permissions | **EP** (1 partition per role) | + Decision Table if role × permission matrix |
| ≥2 conditions affect same outcome | **Decision Table** | + EP for input classes |
| Entity with lifecycle states | **State Transition Table** | + Error Guessing H5 |
| API endpoint in AC | **Decision Table** (input → status code) | + Error Guessing H1, H3 |
| Async operation or multi-step flow | **Error Guessing H2, H5** | + State Transition |
| Module Risk = HIGH | **All applicable techniques** | Full depth |
| Module Risk = LOW | **Scenario Testing only** | + 1 critical negative |

---

## 10 Functional Rules

| # | Rule | Apply when |
|---|---|---|
| 1 | **Feature-Based** | Verify core feature works as described |
| 2 | **User Flow** | Multi-step user journey from entry to result |
| 3 | **CRUD** | Create, Read, Update, Delete operations |
| 4 | **Form Validation** | Input fields, validation rules, error messages |
| 5 | **Search & Filter** | Search results, filter combinations, sort orders |
| 6 | **Integration Point** | API calls, third-party services, webhooks |
| 7 | **Permission & RBAC** | Role-based access control, permission boundaries |
| 8 | **State Transition** | Entity lifecycle changes and their effects |
| 9 | **Notification** | Email, push, in-app notifications — trigger and content |
| 10 | **Reporting** | Data accuracy, export formats, aggregation correctness |

---

## 15 Edge Case Groups

| # | Group | Test cases to consider |
|---|---|---|
| 1 | **Boundary (Min/Max)** | Exact limit, one below, one above |
| 2 | **Null/Empty/Zero** | Empty string, null, 0, empty array |
| 3 | **Special Characters** | `<script>`, `'`, `"`, `/`, `\`, emoji, unicode |
| 4 | **Concurrency (Deadlock)** | 2+ users same action simultaneously |
| 5 | **Large Data** | Max items in list, large file upload, bulk operations |
| 6 | **Date/Time** | DST transitions, timezone differences, leap year, future/past dates |
| 7 | **Network/Timeout** | Slow connection, request timeout, retry behavior |
| 8 | **State Transition Rapid** | Quickly changing state multiple times in succession |
| 9 | **Permission/Session Expiry** | Token expired mid-session, role changed mid-session |
| 10 | **Upload/Download** | Wrong file type, oversized file, corrupted file, empty file |
| 11 | **Calculation/Rounding** | Floating point precision, currency rounding, proration |
| 12 | **Multi-language/i18n** | Non-ASCII input, RTL text, date format by locale |
| 13 | **Browser/Incognito** | Different browsers, private/incognito mode, cached data |
| 14 | **Integration Error** | Third-party API down, webhook not received, partial response |
| 15 | **Search Edge** | Empty query, special chars in search, no results, exact match |

---

## Risk-Based Coverage Depth

| Module Risk | Coverage required |
|---|---|
| **HIGH** | Scenario TC + full EP (all classes) + full BVA (all boundaries) + Decision Table (all meaningful combos) + State Transition (all rows) + Error Guessing (all 5 heuristics applicable) + Security |
| **MEDIUM** | Scenario TC + EP (main classes) + BVA (critical boundaries) + Decision Table (primary combos) + main error paths |
| **LOW** | Scenario TC (happy path) + 1 critical negative |
