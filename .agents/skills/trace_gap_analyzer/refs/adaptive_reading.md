# Adaptive Deep Reading Protocol

> Luôn load khi qa_deep_analyzer khởi động.
> 3-tier adaptive: 7Q (LOW) / 10Q (MEDIUM) / 12Q (HIGH) theo AC risk level từ Phase 3a.

---

## Output Format (compact — dùng cho mọi AC)

```
### DR — [AC-ID] | [Type] | [HIGH/MED/LOW]
Q1: [verbs: v1, v2 | fields: f1, f2, f3]
Q2: [actors và roles]
Q3: [preconditions — explicit và implicit]
Q5: [fieldA: shown when X / hidden when Y | fieldB: required always | ...]
Q6: [1. outcome1 2. outcome2 3. outcome3]
Q7: [NOT: rule1 | NOT: rule2]
--- MEDIUM/HIGH only ---
Q4: [sequence dep: Y/N — mô tả nếu có]
Q8: [cross-refs: [READS: US01/AC3] [REVERSES: US02/AC1] | hoặc "none"]
Q9: [boundary: min/max | zero state | failure: timeout, permission denied]
--- HIGH only ---
Q10: [design findings: [items từ Design Supplement] | hoặc "n/a"]
Q11: [API: method + status codes (200/400/401/403/404/409/500) + schema | hoặc "n/a"]
---
Floor: [N] (A=[N] / B=[N] / C=[N])
Gate5: [ ] pending
```

---

## Quick Path — LOW-risk ACs (7 câu hỏi)

### Step 0: Expand AC Structure *(mandatory trước Q1)*
Liệt kê mọi structural element ra trước:
- Mọi sub-section headings (####)
- Mọi numbered/bulleted items
- Mọi `if / when / only if / show / hide` clauses
- Mọi field/column names được đề cập
- Design Supplement items (nếu Phase 0 ran)

**Structural item count → Source A cho Q-Floor**

### Q1. All verbs + all enumerated items
List **riêng** 2 nhóm:
- Actions: mọi từ chỉ hành động (show, hide, disable, redirect, create, update, delete, validate, sort, filter...)
- Fields/Elements: mọi field, column, UI element được đặt tên trong AC

*Field enumeration missed ở Q1 = coverage gap không thể catch được.*

### Q2. Actors and roles
- Ai thực hiện hành động?
- Hệ thống respond với ai?
- Có role distinctions không? (Admin vs Member, Coach vs Client)

### Q3. All preconditions (explicit + implicit)
- Explicit: điều kiện được nêu rõ trong spec
- Implicit: điều kiện mà spec assume mà không nói (VD: "user clicks Save" → assumes: form loaded, user authenticated, fields filled)
- Implicit preconditions → thường generate negative test cases

### Q5. Data/entity states — field by field
Với **từng field từ Q1**, answer:
- Value/state khi condition MET? Value/state khi NOT met?
- Có conditional display rule không (show only if X)?

**Phải đủ cụ thể:**
`Date field: shown for all events | Event field: one of Used/Issued/Returned/Voided | Amount: positive for Issued, '--' for Voided`

*Không summarize. Một line per field. Mỗi conditional display rule → branch trong Q7 + row trong Condition Matrix.*

### Q6. All observable outcomes — one by one
List mọi distinct effect trên success path. **Không collapse vào 1 câu.**

`1. Modal closes 2. Toast notification shows 3. Balance updates in Credits tab 4. History row added 5. Client notification sent`

*Mỗi outcome = test candidate riêng.*

### Q7. Implied negatives — what must NOT happen
"Only [X] for [Y]" → [X] must NOT appear for non-Y.
List all implied prohibitions explicitly — đừng để reader tự suy ra.

### Q-Floor. Minimum case floor
```
Source A = [N structural items từ Step 0]
Source B = [N distinct condition branches từ Q5 + Q7]
Source C = [N distinct observable outcomes từ Q6]
Floor = max(A, B, C) = [N]
```
*Phải show A/B/C breakdown. Floor stated without breakdown → không accepted.*

---

## Standard Path — MEDIUM-risk ACs (+ thêm Q4, Q8, Q9 so với Quick Path)

### Q4. Sequence / time dependency
- Behavior chỉ applicable sau một action khác không?
- Steps phải theo thứ tự không?
- Action có thể repeat và behavior thay đổi lần 2 không?

### Q8. Cross-AC/US references → feeds Dependency Map
- AC này reference AC khác không? ("same behavior as AC X")
- Modify data từ US khác không?
- Conflict với rule ở nơi khác không?
→ Mỗi reference → entry trong Dependency Map

### Q9. Boundary, zero, and failure states
- Boundary: gì xảy ra ở 0, 1, max? Exact threshold vs one over/under?
- Zero state: empty list vs 1 item vs nhiều?
- Plausible failures không được doc: network error, permission denied, timeout, concurrent edit

---

## Full Path — HIGH-risk ACs (+ thêm Q10, Q11 so với Standard Path)

### Q10. Design artifact findings *(chỉ khi Phase 0 ran và AC có design artifact)*
- List mọi UI state, combination, hover, empty/loading state trong design mà KHÔNG có trong spec text
- Tag: `[source: design]`
- Flag conflicts: `[conflict: design vs spec — specify detail]`
- Add to Step 0 item count → recalculate Source A

**Nếu không có design:** `n/a — no design artifact for this AC`

### Q11. API contract analysis *(chỉ khi AC reference API endpoint)*

Document:
- **HTTP methods:** GET / POST / PUT / PATCH / DELETE
- **Status code matrix:**
  ```
  200/201: [success cases]
  400: [validation failures — which fields?]
  401: [unauthenticated — missing/invalid token]
  403: [authenticated but insufficient permission]
  404: [resource not found]
  409: [conflict — duplicate, state violation, concurrent write]
  500: [server error — any documented recovery behavior?]
  ```
- **Request schema:** required vs optional fields, format constraints, size limits
- **Response schema:** success fields, error payload structure
- **Auth behavior:** missing token / expired token / wrong-role token
- **Idempotency:** same request sent twice → what happens?

**Mỗi status code với distinct behavior → ≥1 TC trong SEC hoặc FUNC category.**
**Nếu không có API notes:** `n/a — no API notes for this AC`

---

## Anti-Patterns Checklist *(verify trước khi finalize mỗi DR block)*

| # | Anti-pattern | Signal | Fix |
|---|---|---|---|
| 1 | Headline reading | Sub-section AC answered by headline only | Re-read every line; analyze each sub-section independently |
| 2 | Field enum collapse | N fields in spec but Q5 has 1 summary sentence | One line per field in Q5 |
| 3 | Conditional visibility ignored | "show X only for Y" but Q7 has no negative | For every "only/only if" → write "must NOT show X for non-Y" |
| 4 | Q-Floor by feel | "around 3" without A/B/C breakdown | Count explicitly: structural items, branches, outcomes |
| 5 | "See AC X" as merge | AC says "same as AC X" → DR stops there | List all AC X's Q6 effects in current AC, recalculate floor |
