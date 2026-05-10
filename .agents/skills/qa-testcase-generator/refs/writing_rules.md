# TC Writing Rules

> Always load when qa_testcase_generator starts.

---

## TC Table — 9 Columns (English output)

```
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
```

### Column Reference

| Column | Format | Example |
|---|---|---|
| **ID** | `TC-US[XX]-[CAT]-[SEQ]` | `TC-US01-FUNC-001` |
| **AC** | AC/BR reference, comma-separated for SCEN | `AC1` / `AC1,AC2` / `BR-01` / `Auth` |
| **Title** | Starts "Verify" or "Check that" + outcome | `Verify credit balance decreases by 1 after cancel` |
| **Preconditions** | Specific reproducible state | `Client has 3 PT Session credits. Coach logged in.` |
| **Steps** | Numbered, 1 action each | `1. Log in as Coach 2. Navigate to... 3. Click...` |
| **Test Data** | Concrete values or DataID ref | `credits: 3` or `→TD-001` |
| **Expected** | Observable outcome only | `Balance shows '2 credits total'` |
| **Priority** | Full word | `High` / `Medium` / `Low` |
| **Module - Note** | `[Module] Category \| Type \| tags` | `[STEP_03] FUNC \| Pos` |

### ID Format: `TC-US[XX]-[CAT]-[SEQ]`

| Part | Format | Example |
|---|---|---|
| `TC` | Fixed | `TC` |
| `US[XX]` | User story, zero-padded | `US01`, `US02` |
| `[CAT]` | Category code | `FUNC`, `SEC`, `UI`, `EDGE`, `SCEN` |
| `[SEQ]` | Sequence per US+category, zero-padded | `001`, `002`, `003` |

Sequence resets to `001` for each new US+category combination.
If spec has no explicit US IDs → number sequentially: US-01, US-02...

### Module - Note Column Format

```
[Module code] Category | ScenarioType | Optional tags
```

**Examples:**
- `[MOD_01] FUNC | Pos` — standard positive functional TC
- `[STEP_03] EDGE | Neg | Risk: timezone boundary` — edge case with risk tag
- `[MOD_BIZ] SEC | Neg | Auth behavior` — security TC
- `[MOD_01] SCEN | E2E | Assume: A1` — scenario TC with assumption flag
- `[STEP_08] FUNC | Neg | Risk: permission bypass` — permission negative case

**Category codes:** `FUNC` / `SEC` / `UI` / `EDGE` / `SCEN`
**ScenarioType values:** `Pos` / `Neg` / `Edge` / `E2E`
**Optional tags:** `Risk: [description]` | `Assume: [A-ref]` | add only when relevant

### Title Quality Rules

✅ Starts with "Verify" or "Check that"
✅ States what is verified AND expected outcome in 1 sentence

Good:
- `"Verify Add Credits button is disabled when no session type is selected"`
- `"Check that 401 is returned when calling issue-credits endpoint without auth token"`
- `"Verify credit balance decreases by 1 after successful session booking"`

Bad:
- `"Verify the form works"` — too vague
- `"Check system behavior"` — no specific assertion
- `"Test credit issuance"` — missing "Verify/Check that"

### Steps Quality Rules

- **1 physical action per step** — no "and" combining
- **Numbered, sequential**
- **Action verbs:** Navigate, Click, Enter, Select, Upload, Scroll, Hover...

Good:
```
1. Log in as Coach at app.everfit.io
2. Navigate to client "Jane Smith" profile
3. Click "Sessions" tab
4. Click "Issue Credits" button
5. Select session type "PT Session" from dropdown
6. Enter "3" in Credits field
7. Click "Confirm" button
```

Bad:
```
1. Log in and navigate to client profile
2. Click Sessions tab and then Issue Credits button
3. Fill in all required fields and submit
```

### Test Data Quality Rules

**Never use placeholders when source defines the field:**
- ❌ "Enter a valid email address"
- ✅ "email: coach_test@everfit.io"
- ❌ "Enter an amount exceeding the limit"
- ✅ "amount: 10001 (system max is 10000)"

**DataID references:**
- Simple data (≤4 values, not shared, no setup dependency) → inline: `email: x@y.com, credits: 3`
- Shared/Stateful/Destructive/Boundary → `→TD-001` or `→TD-001 + TD-003`
- DataID with state note: `→TD-002 (balance must be 0 before step 1)`

**SaaS realistic test data examples:**
- Coach email: `coach_test_01@testfitness.com`
- Client: `client_jane_smith` (3 PT Session credits, active subscription)
- Studio: `test_studio_01` (WS ID: WS_9001, Booking feature: enabled)
- Subscription: `plan_premium_monthly` (active, next billing: 2026-05-01)
- Payment: `ch_test_4242...` (Stripe test card, USD $99.00)

### Expected Result Quality Rules

**Describe what tester can SEE or VERIFY:**
✅ "The Save button becomes disabled while request is in progress"
✅ "Balance shows '4 credits total' in the Credits tab"
✅ "Toast notification appears: 'Credits issued successfully'"
✅ "Response status 401 with body: `{error: 'unauthorized'}`"

Never use:
❌ "renders as per design"
❌ "works correctly"
❌ "UI matches Figma"
❌ "behaves normally"
❌ "credits are updated in the database" (not observable by tester)

---

## Prioritization

**High:** Primary revenue/user-critical workflows | Security/permission risks | Mandatory validations | Data loss or irreversible operations | Billing/payment flows

**Medium:** Common alternate paths | Common error handling | Recoverable failures | Standard UI feedback

**Low:** Lower-frequency cosmetic behavior | Unlikely edge cases | Optional secondary flows | Non-critical UI details

---

## Coverage Guidance

**Functional:** Happy path · Alternate path · Negative path · Required vs optional inputs · Field validation · Business rules · State changes · Role-based behavior · Error handling

**Security:** Authentication (missing/expired token) · Authorization (correct role, wrong record) · Broken access control · Input validation/injection · Sensitive data exposure · Session behavior

**UI/UX:** Labels, placeholders, helper text · Error/empty/loading/success states · Disabled states · Observable layout changes (only when spec provides details)

**Edge/Boundary:** Empty · Null · Whitespace-only · Min/max at exact limit · Over-limit · Duplicate submission · Special characters · Expired states · Interrupted flows · Concurrent modification (when supported by spec)

---

## Test Data Design (run BEFORE writing first TC for a module)

Scan ACs, Q9/Q10 boundary findings, Q11 API notes:

| Category | Signal | Action |
|---|---|---|
| Shared | Same fixture needed by ≥3 TCs | DataID → Test Data Reference sheet |
| Boundary | Min/max/exact threshold | DataID (TD-min, TD-max) |
| Destructive | TC deletes/archives — cannot reuse | DataID + "one-time use" |
| Stateful | Fixture in specific lifecycle state | DataID + setup steps required |
| Per-role | Each role needs own user fixture | 1 DataID per role |
| Simple | ≤4 values, ≤2 TCs, no dependency | Inline in Test Data column |

DataID setup order: integers (lower = must create first, same = parallel OK)
