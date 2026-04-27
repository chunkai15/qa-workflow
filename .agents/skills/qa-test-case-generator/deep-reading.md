# Deep Reading Protocol

> Always load alongside SKILL.md. Contains the complete AC analysis protocol used in Phase 2.

---

## Step 0 — Expand AC Structure (mandatory before Q1)

Flatten the AC into an explicit inventory **in writing** before answering any question.

**0a. List every structural element:**
- Every `####` sub-section heading
- Every numbered/bulleted item at any depth
- Every `if / when / only if / otherwise` conditional clause
- Every `show / hide / disable / enable` state trigger
- Every explicit field, column, or UI element named
- Every documented copy variant such as singular/plural, same-year/different-year, countdown wording, or threshold wording
- Every distinct target surface that has its own observable outcome
- Every item from the Design Supplement (Phase 0) for this AC — tag: `source = design`

Total count = **structural item count** → lower bound for Q12 Source A.

**0b. Structural type:**

| Type | Signal | Risk | Action |
|---|---|---|---|
| **Headline-only** | 1–2 sentences, no sub-structure | LOW | Q12 driven by branches + negatives |
| **Sub-section** | `####` headings separating data areas | HIGH | Analyze each sub-section as its own mini-AC |
| **Field-enumeration** | Numbered/bulleted list of fields or columns | HIGH | Every listed item = test candidate |
| **Multi-effect** | THEN clause lists N effects after one action | HIGH (if N≥5) | Use Success Outcome Ledger |
| **Conditional** | if / when / only if / otherwise language | MEDIUM | Use Requirement-to-Condition Matrix |
| **Compound** | Combines multiple types above | HIGH | Decompose before Q1 |

---

## Q1–Q13: The 13 Questions

Answer every question in order. If a question does not apply: `N/A — [one-line reason]`. Do not skip silently.

**Q1. All verbs AND all enumerated items?**
List every action word (show, hide, disable, redirect, create, update, delete, validate, sort, filter, scroll…). Then separately list every named field, column, or UI element. A missed field in Q1 = a missed case — no downstream check will catch it.

**Q2. Explicit actors and roles?**
Who performs the action? Who is the system responding to? Any role distinctions (Admin vs Member)? Implied role without a name?

**Q3. Explicit preconditions?**
What state must system/data be in? Is there a stated or implied "Given" clause?

**Q4. Implicit preconditions?**
What does the AC assume without stating? ("User clicks Save" assumes: form exists, fields filled, user authenticated.) List these — they generate missing negative cases.

**Q5. Data/entity states — field by field?**
For every field from Q1: what value/state when condition is MET? What when NOT met? Any conditional display rule (show only if X)?

Do not summarize. One line per field.

Sufficient: `Amount: positive for Issued/Returned; '--' for Voided; plain number for Deleted/Used.`  
Insufficient: `The table shows event data.`

Every conditional display rule found here → branch in Q7 + row in Condition Matrix.

**Q6. All observable outcomes — one by one?**
List every distinct effect on the success path. Do not collapse into one sentence.

Sufficient: `1. Modal closes. 2. Toast shown. 3. Balance total updated. 4. Issued row appears in history. 5. Overview count updated. 6. Notification sent.`  
Insufficient: `Issuance completes successfully.`

Each listed outcome = separate test candidate.

If the same trigger updates multiple surfaces, list each surface outcome separately. Do not collapse modal + balance + history + notification + overview into one generic success sentence.

**Q7. What must NOT happen?**
Every positive assertion implies a negative. "Only Issued/Deleted show User column" → Used/Returned/Voided must NOT show a user name. List all implied negatives — do not leave as reader inference.

**Q8. Time or sequence dependency?**
Behavior only applies after another action? Steps must happen in order? Can the action be repeated, and what changes on second execution?

**Q9. Cross-AC/US references?**
Says "same behavior as AC X"? Modifies data from another US? Conflicts with a rule elsewhere?  
→ Every reference here feeds the Dependency Map.  
→ "Same behavior as AC X" = AC X's full Q6 list applies here. Re-list them. Do not stop at the reference.

**Q10. Boundary and zero states?**
What happens at 0, 1, max? Empty list vs one item vs many? Exact threshold vs one over/under?

**Q11. Unstated failure conditions?**
Plausible failures not documented: network error, permission denied, invalid input, timeout, concurrent edit.  
→ If testable: write a case.  
→ If not enough spec info: add to `Missing Information` or `Not-Testable-Yet Items`.

**Q12. Minimum case floor?**

Four sources — take the highest:

- **Source A — Structural items:** Count from Step 0a (includes design supplement items). Every named field/element unless provably mergeable.
- **Source B — Branch count:** Count every condition branch from Q5 + Q7. Each `if/when/show/hide/enable/disable` = 2 branches minimum (met + not met).
- **Source C — Outcome count:** Count every distinct effect from Q6. Effects that always appear together in the same execution = mergeable. Effects requiring different preconditions = not mergeable.
- **Source D — Density adjustments:** Add +1 for each documented copy-variant set, +1 for each additional target surface after the first, +1 for each exact-threshold rule that differs from below/above behavior, and +1 for each plausible lower-priority source conflict that requires a canary row.

`Floor = max(Source A, Source B, Source C, Source D)`

Write the number, show A/B/C/D breakdown, list which items produce the floor. A floor without this breakdown is not accepted.

**Q13. Design artifact findings?**

Only applies when a Design Supplement exists for this AC (from Phase 0).

If yes:
- List every UI state, combination, field, hover, empty, or loading state visible in design that is NOT in spec text
- Tag each: `From design — not in spec text`
- Add to Step 0a item count → recalculate Source A
- Flag any design element contradicting spec: `Source conflict — design vs spec`

If no design: `N/A — no design artifact for this AC.`

---

## Anti-Patterns Checklist

Before finalizing any Deep Reading block, verify none apply:

| # | Anti-pattern | Signal | Fix |
|---|---|---|---|
| 1 | **Headline reading** | Sub-section AC answered by headline only | Re-read every line; analyze each sub-section independently |
| 2 | **Field enumeration collapse** | N fields listed in spec but Q5 has one summary sentence | List every field individually in Q5 |
| 3 | **Conditional visibility ignored** | "show X only for Y" rule exists but Q7 has no negative | For every "only"/"only if" → write: "must NOT show X for non-Y" |
| 4 | **Q12 by feel** | Q12 says "around 3" or "several" without A/B/C breakdown | Count structural items, count branches, count outcomes. Take max. |
| 5 | **Multi-surface AC as one surface** | AC defines behavior on 2+ UI surfaces, analyzed as one | Apply Step 0b first — if Sub-section type, answer Q1–Q12 per sub-section |
| 6 | **"See AC X" treated as merge** | "same behavior as AC X" → Deep Reading stops there | List all AC X effects in Q6 of current AC. Re-calculate floor. |
| 7 | **Design image not read** | AC has Figma URL or uploaded image but Q13 = "N/A" without checking | Read every uploaded image. Attempt every Figma URL. Note result. |
| 8 | **AC Type Matrix skipped** | >15 ACs but no matrix produced before Deep Reading | Produce matrix first. HIGH-risk ACs must be identified before analysis begins. |
| 9 | **Observable-outcome bundling** | Q6 collapses 4–6 effects into one success sentence | Split outcomes by surface and by independently observable effect. |
| 10 | **Conflict collapse** | A real source conflict is noted but only one interpretation gets a row | Add a primary expectation plus a conflict canary if the lower-priority interpretation is plausible. |

---

## Deep Reading Output Format

One block per AC — never compress multiple ACs into one block.

```
### Deep Reading — [AC identifier]

Step 0:
  Type: [Headline-only | Sub-section | Field-enum | Multi-effect | Conditional | Compound]
  Risk: [HIGH | MEDIUM | LOW]
  Design supplement: [filename or "none"]
  Structural items (N total):
    - [item 1: spec | design]
    - [item 2: spec | design]
    ...

Q1.  Verbs + items: [exhaustive list]
Q2.  Actors: [list]
Q3.  Explicit preconditions: [list]
Q4.  Implicit preconditions: [list]
Q5.  Entity/data states (field by field): [one line per field]
Q6.  Observable outcomes (one by one): [numbered list]
Q7.  Implied negatives: [list]
Q8.  Sequence dependency: [yes/no + explanation]
Q9.  Cross-AC/US references: [list or "none"]
Q10. Boundary/zero states: [list]
Q11. Unstated failures: [list]
Q12. Floor:
     Source A (structural items): [N]
     Source B (branches): [N]
     Source C (outcomes): [N]
     Source D (density adjustments): [N]
     Floor = max(A,B,C,D) = [N]
     Mapping: [items that produce the floor]
Q13. Design findings: [items from design not in spec, or "N/A"]

Gate 5: [ ] pending
```

---

## Cross-US/AC Dependency Map

Build **once after all Deep Reading complete**, before any artifact or row.

**8 relationship types to scan:**

| Type | Description |
|---|---|
| Data dependency | AC-B reads data created/modified by AC-A |
| State dependency | AC-B behavior changes based on state set by AC-A |
| Shared entity | Two ACs operate on the same entity |
| Permission inheritance | Role defined in AC-A governs visibility in AC-B |
| Sequence constraint | AC-B only reachable after AC-A |
| Logical inversion | AC-B is the explicit failure/reversal of AC-A |
| Reuse reference | AC-B says "same behavior as AC-A" |
| Contradiction | AC-A and AC-B define conflicting outcomes for same condition |

**Output format:**
```
| Relationship | Source AC | Target AC | Type | Test Implication | Covered By |
```
`Covered By` starts empty — fill during Phase 4 as each case is written. Every row blank after Phase 5 = gap.

Each row must produce: a test case, or a precondition note on existing case, or `Risks from Ambiguity` entry, or `Cross-Flow Impact Sweep` entry. If none apply: `No test implication — [reason]`.

---

## Large Spec Strategy

| Spec size | Strategy |
|---|---|
| ≤15 ACs | One pass: all Deep Reading → all artifacts → all cases |
| 16–40 ACs | US-by-US: complete Phases 2–5 for US-01 before starting US-02 |
| >40 ACs | Sub-groups: ≤8 ACs per group; complete one group before next |

Never run Deep Reading for all ACs first and then write all cases — this creates a context gap that causes floor shortfalls.
