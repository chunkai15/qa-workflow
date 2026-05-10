# Adaptive Deep Reading Protocol

> Always load when qa_deep_analyzer starts.
> 3-tier adaptive: 7Q COMPACT (LOW) / 10Q COMPACT (MEDIUM) / 12Q FULL (HIGH)

---

## ⚡ Token Budget — Enforce Per DR Block

| Risk Level | Max tokens per DR block | Format |
|---|---|---|
| LOW | ≤ 100 tokens | COMPACT (7Q inline) |
| MEDIUM | ≤ 200 tokens | COMPACT (10Q inline) |
| HIGH | ≤ 450 tokens | FULL (12Q structured) |

**Rule:** If a DR block exceeds its token budget, trim Q5 field descriptions and Q11 API details — these are the two highest-verbosity items. Coverage must still be maintained.

---

## Output Formats

### COMPACT Format — LOW and MEDIUM risk ACs

Use for ALL LOW-risk ACs and MEDIUM-risk ACs with ≤4 fields.
Everything on minimum lines. No prose explanations. Keywords only.

```
### DR — [AC-ID] | [Type] | [RISK] — COMPACT
Q1: verbs=[v1,v2] fields=[f1,f2,f3]
Q2: actor=[role] | system=[trigger]
Q3: explicit=[cond1, cond2] implicit=[assumed auth, page loaded]
Q5: f1:yes→X/no→Y | f2:always required | f3:shown when Z only
Q6: 1.[outcome] 2.[outcome] 3.[outcome]
Q7: NOT[rule1] | NOT[rule2]
[MEDIUM only] Q4:seq=[Y/N brief] Q8:[READS:AC-X] [FEEDS:AC-Y] Q9:boundary=[min/max] fail=[timeout,403]
Floor: [N] (A=[N]/B=[N]/C=[N])
Gate5: [ ] pending
```

**Token target: LOW ≤100 / MEDIUM ≤200**

---

### FULL Format — HIGH risk ACs only

Use when: risk=HIGH AND (AC has ≥5 fields OR has API contract OR has design supplement).

```
### DR — [AC-ID] | [Type] | HIGH
Q1: verbs=[v1,v2,...] | fields=[f1,f2,f3,...]
Q2: [actor + system roles]
Q3: explicit=[...] | implicit=[...]
Q5: [field: state-when-met / state-when-not — one line per field]
Q6: 1.[outcome] 2.[outcome] 3.[outcome] ...
Q7: NOT[rule1] | NOT[rule2] | NOT[rule3]
Q4: [sequence dependency — Y or N + brief]
Q8: [READS:AC-X] [FEEDS:AC-Y] [REVERSES:AC-Z] or "none"
Q9: boundary=[min/max/exact] | zero=[empty vs zero] | fail=[network,403,timeout]
Q10: [design findings — tag [source:design] or "n/a"]
Q11: [API: METHOD → 200/400/401/403/404/409/500 — 1 line each, or "n/a"]
---
Floor: [N] (A=[N]/B=[N]/C=[N])
Gate5: [ ] pending
```

**Token target: HIGH ≤450**

---

## ⚡ Q5 Compact Rule (biggest single token hog)

Q5 is the highest-verbosity question. Apply the following compression:

**OLD (verbose — avoid):**
```
Q5: WS status: Free Trial or Starter → eligible for assignment, system creates variant record in DB.
    WS status: Paid (Pro/Studio/Bundle) → NOT eligible, no DB write occurs.
    Variant record: absent → assignment happens on this load.
    Variant record: present → same variant returned, no new DB write.
    Variant value: A or B (random).
```

**NEW (compact — use this):**
```
Q5: status=FT/Starter→eligible→assign | status=Paid→skip
    variant_in_DB=absent→assign | present→return_existing
    variant_value=A or B (random)
```

**Rule:** Each field = 1 compact line. Max 12 words per line. Use `→` not `then`. Use `|` not `or`.

---

## Q11 Compact Rule (second biggest token hog)

**OLD (verbose):**
```
Q11: HTTP method: POST
     200/201: variant successfully created and stored
     400: missing required fields — WS ID not provided
     401: unauthenticated — missing or invalid token
     403: insufficient permissions
     404: resource not found
     409: variant already exists (idempotency conflict)
     500: server error — DB write failed
```

**NEW (compact):**
```
Q11: POST→201(created) | 400(missing fields) | 401(no token) | 403(perm) | 409(exists→idempotent) | 500(DB fail)
```

**Rule:** All status codes on 1 line using `→` notation. Only include codes with distinct behavior.

---

## Step 0 Compact Rule

**OLD:** List all structural elements as prose paragraphs.

**NEW:**
```
Step0: headings=[...] | bullets=[N items] | conditions=[if/when clauses] | fields=[f1,f2,...] | design=[N items or none]
```

---

## Quick Path — LOW-risk ACs (7Q COMPACT)

Run in COMPACT format. **Hard stop at 100 tokens per block.**

Questions to answer (inline, no prose):
- Q1: verbs + fields (1 line each)
- Q2: actor (1 line)
- Q3: preconditions (1 line explicit, 1 line implicit)
- Q5: field states (1 compact line per field, max 5 fields)
- Q6: outcomes (numbered list, max 10 words each)
- Q7: NOT rules (1 line per rule)
- Floor: A/B/C breakdown

**Skip:** Q4, Q8, Q9, Q10, Q11

---

## Standard Path — MEDIUM-risk ACs (10Q COMPACT)

Run in COMPACT format. **Hard stop at 200 tokens per block.**

Add to Quick Path:
- Q4: sequence dep (1 line: Y/N + brief)
- Q8: cross-refs (1 line: READS/FEEDS/REVERSES tags only)
- Q9: boundary/failure (1 line: boundary=[...] fail=[...])

**Skip:** Q10, Q11

---

## Full Path — HIGH-risk ACs (12Q FULL)

Run in FULL format. **Hard stop at 450 tokens per block.**

All 12 questions. Apply compact rules for Q5 and Q11 to stay within budget.

---

## Anti-Patterns Checklist *(verify before finalizing each DR block)*

| # | Anti-pattern | Signal | Fix |
|---|---|---|---|
| 1 | Over-budget DR block | Block exceeds token budget | Trim Q5 (use compact lines) and Q11 (use 1-line status) |
| 2 | Headline reading | Sub-section AC answered by headline only | Re-read every line; analyze each sub-section independently |
| 3 | Field enum collapse | N fields in spec but Q5 has 1 summary sentence | One compact line per field in Q5 |
| 4 | Conditional visibility ignored | "show X only for Y" but Q7 has no negative | For every "only/only if" → write "NOT[X for non-Y]" |
| 5 | Q-Floor by feel | "around 3" without A/B/C breakdown | Count explicitly: structural items, branches, outcomes |
| 6 | MEDIUM/HIGH treated as LOW | 10Q/12Q AC answered with only 7Q | Check risk level before choosing path |
