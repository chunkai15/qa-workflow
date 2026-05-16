# Test Catalog — 10 Functional Rules + 15 Edge Case Groups

> Load when filling in Module Brief (STEP A) — specifically "10 Rules" and "15 Edge Groups" fields.
> Reference taxonomy only — not execution protocol.

---

## 10 Functional Rules

| # | Rule | Apply when |
|---|---|---|
| 1 | Feature-Based | Verify core feature works as described |
| 2 | User Flow | Multi-step user journey from entry to result |
| 3 | CRUD | Create, Read, Update, Delete operations |
| 4 | Form Validation | Input fields, validation rules, error messages |
| 5 | Search & Filter | Search results, filter combinations, sort orders |
| 6 | Integration Point | API calls, third-party services, webhooks |
| 7 | Permission & RBAC | Role-based access control, permission boundaries |
| 8 | State Transition | Entity lifecycle changes and their effects |
| 9 | Notification | Email, push, in-app notifications — trigger and content |
| 10 | Reporting | Data accuracy, export formats, aggregation correctness |

---

## 15 Edge Case Groups

| # | Group | Test cases to consider |
|---|---|---|
| 1 | Boundary (Min/Max) | Exact limit, one below, one above |
| 2 | Null/Empty/Zero | Empty string, null, 0, empty array |
| 3 | Special Characters | `<script>`, `'`, `"`, `/`, `\`, emoji, unicode |
| 4 | Concurrency | 2+ users same action simultaneously |
| 5 | Large Data | Max items in list, large file, bulk operations |
| 6 | Date/Time | DST transitions, timezone, leap year, future/past dates |
| 7 | Network/Timeout | Slow connection, timeout, retry behavior |
| 8 | State Transition Rapid | Quickly changing state multiple times |
| 9 | Permission/Session Expiry | Token expired mid-session, role changed mid-session |
| 10 | Upload/Download | Wrong file type, oversized, corrupted, empty file |
| 11 | Calculation/Rounding | Floating point precision, currency rounding, proration |
| 12 | Multi-language/i18n | Non-ASCII input, RTL text, date format by locale |
| 13 | Browser/Incognito | Different browsers, private mode, cached data |
| 14 | Integration Error | Third-party API down, webhook missed, partial response |
| 15 | Search Edge | Empty query, special chars, no results, exact match |
