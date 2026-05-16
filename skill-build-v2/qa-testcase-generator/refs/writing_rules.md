# TC Writing Rules

> Always load when qa_testcase_generator starts.
> v3: 9-column table + multiline formatting + forbidden phrases blocklist + test data values+DataID rule.

---

## TC Table — 9 Columns (English output)

```
| ID | AC | Title | Preconditions | Steps | Test Data | Expected | Priority | Module - Note |
```

### Column Reference

| Column | Format | Example |
|---|---|---|
| **ID** | `TC-US[XX]-[CAT]-[SEQ]` | `TC-US01-FUNC-001` |
| **AC** | AC/BR reference, comma-separated for SCEN | `AC1` / `AC1,AC2` / `BR-01` |
| **Title** | Starts "Verify" or "Check that" + outcome | `Verify credit balance decreases by 1 after cancel` |
| **Preconditions** | Specific reproducible state, list format when ≥2 | `- Client has 3 PT Session credits\n- Coach logged in` |
| **Steps** | Numbered, 1 action each, list format | `1. Log in as Coach 2. Navigate to... 3. Click...` |
| **Test Data** | Concrete values first, DataID second (if shared) | `credits: 3, status: active → TD-001` |
| **Expected** | Observable outcome only, list format when multiple | `Balance shows '2 credits total'` |
| **Priority** | Full word | `High` / `Medium` / `Low` |
| **Module - Note** | `[Module] Category \| Type \| tags` | `[MOD_01] FUNC \| Pos` |

---

## ID Format: `TC-US[XX]-[CAT]-[SEQ]`

| Part | Format | Example |
|---|---|---|
| `TC` | Fixed | `TC` |
| `US[XX]` | User story, zero-padded | `US01`, `US02` |
| `[CAT]` | Category code | `FUNC`, `SEC`, `UI`, `EDGE`, `SCEN` |
| `[SEQ]` | Sequence per US+category, zero-padded | `001`, `002`, `003` |

Sequence resets to `001` for each new US+category combination.

---

## Module - Note Column Format

```
[Module code] Category | ScenarioType | Optional tags
```

**Examples:**
- `[MOD_01] FUNC | Pos` — standard positive functional
- `[STEP_03] EDGE | Neg | Risk: timezone boundary` — edge case with risk tag
- `[MOD_BIZ] SEC | Neg | Auth behavior` — security TC
- `[MOD_01] SCEN | E2E` — scenario TC
- `[STEP_08] FUNC | Neg | Risk: permission bypass` — permission negative

**Category codes:** `FUNC` / `SEC` / `UI` / `EDGE` / `SCEN`
**ScenarioType:** `Pos` / `Neg` / `Edge` / `E2E`

---

## Steps — Formatting Rules

**1 physical action per step. MANDATORY line-per-step format.**

```
RIGHT:
  1. Log in as Coach at app.everfit.io
  2. Navigate to client "Jane Smith" profile
  3. Click "Sessions" tab
  4. Click "Issue Credits" button
  5. Select session type "PT Session" from dropdown
  6. Enter "3" in Credits field
  7. Click "Confirm" button

WRONG: "1. Log in and navigate to client 2. Click Sessions tab and Issue Credits 3. Fill and submit"
```

**Rules:**
- NO "and" combining two actions in one step
- NO "then" chaining
- 1 verb, 1 target, 1 step
- Action verbs: Navigate, Click, Enter, Select, Upload, Scroll, Hover, Observe...

---

## Expected Result — Formatting Rules

**Single outcome:**
```
"Balance shows '2 credits total' in Credits tab header"
```

**Multiple tightly-coupled outcomes (same TC — list format):**
```
"1. Toast: 'Credits issued successfully' appears top-right
 2. Balance updates to '4 PT Session credits' immediately
 3. Activity row added: 'Issued — 1 PT Session credit — 2026-05-16'"
```

**Rules:**
- Write what tester can SEE or VERIFY — not internal DB state
- If Expected has "and" joining 2 INDEPENDENTLY verifiable items → numbered list OR split to 2 TCs
- Split to 2 TCs preferred when items can fail independently

---

## ⛔ Forbidden Phrases Blocklist *(auto-fail Gate 5 v2 PART 3)*

The following phrases make Expected results unverifiable. Any TC with these phrases FAILS Gate 5 v2.

**Vague qualifiers:**
- `"correctly"` | `"properly"` | `"as designed"` | `"as per spec"` | `"as expected"`

**Incomplete observables (missing WHAT/WHERE/VALUE):**
- `"visible"` (alone — specify WHAT is visible and WHERE)
- `"shown"` (alone — specify what is shown)
- `"updated"` (alone — specify updated TO what value)
- `"displayed"` (alone — specify what is displayed)

**Function claims (not observable):**
- `"works"` | `"functions"` | `"behaves normally"` | `"operates as intended"`

**Multi-assertion connector:**
- `"[X] and [Y] are [Z]"` where X and Y are separately verifiable → split to list or 2 TCs

**Required replacement pattern:**
```
❌ "Credits are updated correctly"
✅ "Credit balance shows '4 PT Session credits' in Sessions tab header"

❌ "Error message is visible"
✅ "Error message appears below Credits field: 'Insufficient balance to issue credits'"

❌ "Status shows correctly and button is disabled"
✅ TC-A: "Status label shows 'Voided' in red"
   TC-B: "Issue Credits button is disabled and non-clickable"
```

---

## Test Data — Values First, DataID Second

**Rule: Tester must understand test data WITHOUT looking up the DataID.**

**Shared / Stateful / Boundary / Destructive data:**
```
"credits: 3 PT Session, status: active, purchase: completed → TD-001"
"client: balance=0, connected=true → TD-003-BOUNDARY"
"purchase: cancelled, activated: false → TD-004"
```

**Multiple DataIDs:**
```
"package: PT_Session active → TD-001 | WS: Booking=ON, P&P=OFF → TD-002"
```

**Simple inline (≤4 values, not shared, no setup dependency):**
```
"email: coach_test@testfitness.com, credits: 3"
— No DataID needed for simple inline data.
```

**FORBIDDEN:**
```
❌ "→TD-001"          (DataID only — no values)
❌ "credits: 3"       (values only — no DataID when it's a shared fixture requiring setup)
✅ "credits: 3, status: active → TD-001"
```

---

## Title Quality Rules

✅ Starts with "Verify" or "Check that"
✅ States WHAT is verified AND expected outcome in 1 sentence

**Good:**
- `"Verify Add Credits button is disabled when no session type is selected"`
- `"Check that 401 is returned when calling issue-credits endpoint without auth token"`
- `"Verify credit balance decreases by 1 after successful session booking"`

**Bad:**
- `"Verify the form works"` — too vague
- `"Check system behavior"` — no specific assertion
- `"Test credit issuance"` — missing "Verify/Check that"

---

## Preconditions — Formatting Rules

**Single precondition:** inline.
```
"Client has 3 PT Session credits. Coach logged in."
```

**Multiple preconditions (≥2): list format.**
```
"- Client has 3 PT Session credits
 - Coach logged in as active coach
 - WS has Booking feature enabled
 - P&P is OFF"
```

**Rules:**
- Specific and reproducible: "Client has 3 PT Session credits" ✓ | "A client with credits exists" ✗
- Include all system states required for this TC from Q-DATA / Data Prerequisite Card

---

## Prioritization

**High:** Primary revenue/user-critical workflows | Security/permission risks | Mandatory validations | Data loss / irreversible operations | Billing/payment flows

**Medium:** Common alternate paths | Common error handling | Recoverable failures | Standard UI feedback

**Low:** Lower-frequency cosmetic behavior | Unlikely edge cases | Optional secondary flows | Non-critical UI details

---

## Coverage Guidance

**Functional:** Happy path · Alternate path · Negative path · Required vs optional inputs · Field validation · Business rules · State changes · Role-based behavior · Error handling

**Security:** Authentication (missing/expired token) · Authorization (correct role, wrong record) · Broken access control · Input validation/injection · Sensitive data exposure

**UI/UX:** Labels, placeholders, helper text · Error/empty/loading/success states · Disabled states · Observable layout changes (only when spec provides details)

**Edge/Boundary:** Empty · Null · Min/max at exact limit · Over-limit · Duplicate submission · Special characters · Expired states · Interrupted flows

---

## Test Data Design *(run BEFORE writing first TC for a module)*

Import DataIDs from Data Prerequisite Card (L3). Do NOT create new DataIDs.

| Category | Signal | Action |
|---|---|---|
| SHARED | Same fixture from DataID registry | Reference DataID + show concrete values |
| BOUNDARY | Min/max/exact threshold from DataID registry | Reference DataID + show boundary value |
| DESTRUCTIVE | TC destroys data — cannot reuse | Reference DataID + note "one-time use" |
| STATEFUL | Fixture requires specific lifecycle state | Reference DataID + note required state |
| SIMPLE | ≤4 values, ≤2 TCs, no dependency | Inline — no DataID needed |

**SaaS realistic test data examples:**
- Coach: `coach_test_01@testfitness.com`
- Client: `client_jane_smith` (3 PT Session credits, active)
- Studio: `test_studio_01` (WS ID: WS_9001, Booking: enabled)
- Payment: `ch_test_4242...` (Stripe test card, USD $99.00)
