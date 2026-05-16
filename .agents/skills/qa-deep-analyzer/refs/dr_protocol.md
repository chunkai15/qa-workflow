# DR Protocol — Business Understanding + Q1-Q13 + Output Formats

> Load at Phase 3b start (NOT on startup).
> Single canonical source for all DR content: BU template, Q definitions, output formats, Floor formula.

---

## Section 1 — Business Understanding (BU) Block

Write BEFORE the DR block for each AC. 4 lines. No prose.

```
### BU — [AC-ID] Business Understanding
Why business cares: [what breaks in production if this AC fails — revenue/data/user impact]
Actor intent:       [what actor accomplishes, not just "performs action X"]
System contract:    [observable promise from UI/API — not internal DB state]
Risk if broken:     [Data loss / Wrong charge / User blocked / Silent failure / Compliance breach]
```

**Example:**
```
### BU — AC3 Business Understanding
Why business cares: Credit issuance fails silently → coaches issue credits but balance never updates → financial reconciliation error
Actor intent:       Coach allocates PT Session credits to specific client without manual DB intervention
System contract:    System creates credit record, updates client balance, appends history row, sends notification — atomically
Risk if broken:     Wrong balance shown → client overbilled or underbilled → financial dispute + support cost
```

**Rules:**
- "Why business cares" → production consequence (not test consequence)
- "System contract" → observable from UI/API (never "DB record created")
- "Risk if broken" → must map to one of the 5 categories above
- BU block feeds L5 SCEN TC writing — establishes WHY the flow matters

---

## Section 2 — Token Budgets + Tier Paths

| Risk Level | Max tokens per DR block | Format | Q depth |
|---|---|---|---|
| LOW / Tier 1 | ≤ 120 tokens | COMPACT | 7Q + Q6-Ext + Q-DATA |
| MEDIUM / Tier 2 | ≤ 250 tokens | COMPACT | 10Q + Q6-Ext + Q-DATA |
| HIGH / Tier 3 | ≤ 500 tokens | FULL | 12Q + Q6-Ext + Q-DATA |

**Trim rule:** If block exceeds budget → trim Q5 descriptions and Q11 API details first. NEVER trim Q6 O-list or Q-DATA.

**Quick Path (LOW):** Q1, Q2, Q3, Q-DATA, Q5, Q6-Extended, Q7 + Floor. Skip: Q4, Q8, Q9, Q10, Q11.
**Standard Path (MEDIUM):** Add Q4, Q8, Q9. Skip: Q10, Q11.
**Full Path (HIGH):** All Q1-Q12 + Q6-Extended + Q-DATA. Apply Q5/Q11 compact rules.

---

## Section 3 — Output Format Templates

### COMPACT — LOW + MEDIUM

```
### DR — [AC-ID] | [Type] | [RISK] — COMPACT
Q1: verbs=[v1,v2] fields=[f1,f2,f3]
Q2: actor=[role] | system=[trigger]
Q3: explicit=[cond1,cond2] implicit=[assumed auth, page loaded]
Q5: f1:yes→X/no→Y | f2:always required | f3:shown when Z only
Q6:
  O1: [exact UI element/text/state — verbatim from spec]
  O2: [exact UI element/text/state]
  N1: [condition] → [exact error text/blocked state]
  N2: [condition] → [exact error/state]
  subtotal: [N]O + [N]N | cross-check: count(O)=[N] ≥ min_hint=[N]?
Q7: NOT[rule1] | NOT[rule2]
Q-DATA:
  WS=[Booking:ON/OFF, P&P:ON/OFF] | Package=[type,status] | Client=[connected,balance=X]
  DESTRUCTIVE:[list or none] | DataIDs:[TD-001=desc or none]
[MEDIUM only] Q4:seq=[Y/N] Q8:[READS:AC-X][FEEDS:AC-Y] Q9:boundary=[min/max] fail=[timeout,403]
Floor: [N] (O=[N]/N=[N]/DT=[N]/ST=[N]/BVA=[N]) — FINAL=[N]
Gate5: [ ] pending
```

### FULL — HIGH / Tier 3 only

```
### DR — [AC-ID] | [Type] | HIGH
Q1: verbs=[v1,v2,...] | fields=[f1,f2,f3,...]
Q2: [actor + system roles]
Q3: explicit=[...] | implicit=[...]
Q5: [field: state-when-met → state-when-not — 1 compact line per field]
Q6:
  O1: [exact UI element/text/state — verbatim from spec]
  O2: [...]  ON: [...]
  N1: [condition] → [exact error text/blocked state]
  N2: [...]
  subtotal: [N]O + [N]N | cross-check: count(O)=[N] ≥ min_hint=[N from L1]? [YES/FLAG]
Q7: NOT[rule1] | NOT[rule2] | NOT[rule3]
Q4: [sequence dependency — Y or N + brief]
Q8: [READS:AC-X] [FEEDS:AC-Y] [REVERSES:AC-Z] or "none"
Q9: boundary=[min/max/exact] | zero=[empty vs zero] | fail=[network,403,timeout]
Q10: [design findings — tag [source:design] or "n/a"]
Q11: METHOD→201(ok) | 400(validation) | 401(auth) | 403(perm) | 409(conflict) | 500(server)
Q12: [concurrency, idempotency, webhook, async concerns — or "n/a"]
Q-DATA:
  WS State:    Booking=[ON/OFF], P&P=[ON/OFF], Stripe=[connected/not]
  Package:     type=[...], credit_rule=[...], status=[active/archived]
  Purchase:    status=[confirmed/pending/cancelled], activated=[true/false], invoices=[paid/unpaid]
  Client:      connected=[true/false], balance=[X], history_entries=[Issued/Used/Voided counts]
  Credit Data: [X] available, [Y] used, [Z] expired
  DESTRUCTIVE: [list or "none"]
  DataIDs:     TD-001=[desc|SHARED|order=1], TD-002=[desc|DESTRUCTIVE|order=2] or "none"
---
Floor: [N] (O=[N]/N=[N]/DT=[N]/ST=[N]/BVA=[N]) — FINAL=[N]
Gate5: [ ] pending
```

---

## Section 4 — Q6-Extended: Observable Outcomes Split Protocol

> Most critical protocol. Apply to ALL tiers. NEVER skip.

**Steps:**
1. Copy each Then-bullet verbatim from spec/AC text.
2. Split each bullet on: `,` | `;` | ` and ` (when joining 2 distinct UI elements/states).
3. Each split item = 1 observable outcome (O) = 1 minimum TC.

**Example:**
```
Then-bullet: "system shows title, illustration, body text, and CTA button"
→ O1: title displayed [exact label from spec]
→ O2: illustration shown [Figma ref if applicable]
→ O3: body text appears [exact copy if specified]
→ O4: CTA button enabled with label [exact label]
subtotal = 4 observables
```

**Cross-check:** count(O) must be ≥ min_hint from L1 Master Context. If below → re-read spec; flag implied outcomes; use min_hint as floor baseline.

**Q6-Negative:** For each condition in Q3 that can fail OR each "only if/show/hide/enabled when" clause:
```
N1: [condition NOT met or wrong actor] → [exact error text / blocked UI state]
N2: [another failure] → [exact error/state]
```
Rule: Conditional AC → ≥1 N-item. Tier 1 AC → ≥1 basic negative N-item minimum.

---

## Section 5 — Q-DATA: Data Prerequisite Protocol

> Mandatory for ALL tiers. Fill after Q3 in every DR block.

**Question:** "What must exist in the system BEFORE testing this AC?"

```
WS State:    Booking=[ON/OFF], P&P=[ON/OFF], Stripe=[connected/not]
Package:     type=[...], credit_rule=[...], status=[active/archived]
Purchase:    status=[confirmed/pending/cancelled], activated=[true/false], invoices=[paid/unpaid]
Client:      connected=[true/false], balance=[X credits], history_entries=[types: Issued/Used/Voided]
Credit Data: [X] available, [Y] used, [Z] expired
```

**Tag each item:** `DESTRUCTIVE` (one-time use) | `SHARED` (≥3 TCs → assign DataID) | `SIMPLE` (inline, ≤4 values)

**DataID format:** `TD-001=[description | SHARED/DESTRUCTIVE/BOUNDARY | setup_order=N]`

**Rule:** DataIDs created here are the source of truth. L5 imports — does NOT create new ones.

---

## Section 6 — Compact Rules (Q5, Q11, Step0)

**Q5 Compact:** Each field = 1 line. Max 12 words. Use `→` not "then". Use `|` not "or".
```
Q5: status=FT/Starter→eligible→assign | status=Paid→skip
    variant_in_DB=absent→assign | present→return_existing
```

**Q11 Compact:** All codes on 1 line. Only codes with distinct behavior.
```
Q11: POST→201(created) | 400(missing fields) | 401(no token) | 403(perm) | 409(exists) | 500(DB fail)
```

**Step0 Compact:**
```
Step0: headings=[...] | bullets=[N] | conditions=[if/when clauses] | fields=[f1,f2] | design=[N or none]
```

---

## Section 7 — Floor Formula v3

```
Floor = max(
  count(Q6 observables O),
  DT_row_count,              ← from DT artifact (if assigned)
  ST_valid + ST_invalid      ← from ST artifact (if assigned)
) + count(Q6 negatives N) + BVA_boundary_points

Tier minimums: Tier 3 ≥ 7 | Tier 2 ≥ 4 | Tier 1 ≥ 2

FINAL Floor = max(formula_result, tier_minimum, min_hint_from_L1)

Write as: Floor = [N] (O=[N]/N=[N]/DT=[N]/ST=[N]/BVA=[N]) — FINAL=[N]
```

---

## Section 8 — Anti-Patterns Checklist

| # | Anti-pattern | Signal | Fix |
|---|---|---|---|
| 1 | Over-budget block | Exceeds token budget | Trim Q5/Q11 — NEVER trim Q6 or Q-DATA |
| 2 | Headline reading | Sub-section AC → answered by headline | Re-read every line; analyze each sub-section |
| 3 | Field enum collapse | N fields in spec → Q5 has 1 summary | One compact line per field |
| 4 | Conditional visibility ignored | "show X only for Y" → Q7 has no NOT | Every "only/only if" → write NOT[X for non-Y] |
| 5 | Q-Floor by feel | "around 3" without breakdown | Use Floor formula v3 with explicit O/N/DT/ST/BVA counts |
| 6 | Wrong tier path | HIGH AC answered with 7Q | Check tier before choosing path |
| 7 | Q6 summary only | "Outcomes: modal closes, balance updates" | Split protocol — each O on its own line |
| 8 | Q-DATA empty | "n/a" without checking | Every AC has WS + Client state at minimum |
| 9 | count(O) < min_hint | 3 observables but min_hint=5 | Re-read spec; flag if genuinely absent |
| 10 | N-list missing | All O-items, zero N-items | Conditional AC ≥1 N; Tier 1 ≥1 basic negative |
