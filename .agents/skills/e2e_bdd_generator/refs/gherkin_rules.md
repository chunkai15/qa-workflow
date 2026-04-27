# BDD Gherkin Rules — Automation Candidates

> Load KHI Phase 4B bắt đầu.
> Chỉ viết Gherkin cho: tất cả Tier 0 + Tier 1 của HIGH/MEDIUM modules.

---

## Gherkin Format Chuẩn

```gherkin
Feature: [Feature name]
  [Brief feature description — 1 line]

  Background:
    Given [common setup applicable to all scenarios in this Feature]

  @tier0 @P1 @automation-candidate
  Scenario: [Tier 0 flow name — entity + action chain + outcome]
    # Phase 1: [Actor — Role]
    Given [state that system must be in]
    When [actor performs action]
    Then [observable outcome]
    And [additional observable outcomes]

    # Phase 2: [Cross-US transition — next Actor/State]
    Given [state after Phase 1 completes]
    When [next actor performs next action]
    Then [observable outcome at this phase]

  @tier1 @P1 @automation-candidate
  Scenario Outline: [Multi-data flow — when same flow runs with different data sets]
    Given [state with <variable>]
    When [actor performs action with <input>]
    Then [outcome matches <expected>]

    Examples:
    | variable | input | expected |
    | "active" | "10"  | "Credits issued" |
    | "expired" | "5" | "Error: subscription expired" |
```

---

## Annotation Rules

**Tags (BẮT BUỘC cho mọi scenario):**
- `@tier0` / `@tier1` — tier từ Regression Suite
- `@P1` / `@P2` — priority
- `@automation-candidate` — confirmed đáng viết automated test
- `@manual-only` — nếu scenario cần human judgment

**Khi nào dùng `Scenario Outline`:**
- Cùng flow chạy với nhiều data sets khác nhau
- Số lượng data sets ≥3 (nếu chỉ 2 → viết 2 Scenario riêng biệt)

---

## Gherkin Writing Rules

### `# Phase comments` — dùng để phân chia flow phases trong 1 Scenario

Cực kỳ quan trọng cho Tier 0 cross-US flows:
```gherkin
# Phase 1: RM creates the request
Given ...
When ...
Then ...

# Phase 2: Manager approves (different actor, different US)
Given User "Manager" is logged in and sees pending request
When Manager clicks Approve
Then Status changes to "Approved" and RM receives notification
```

### Given / When / Then clarity

- `Given`: System state / precondition (không phải action)
- `When`: Actor's action (chỉ 1 action per step)
- `Then`: Observable outcome (cái tester thấy, không phải system internals)
- `And`: Additional same-type step (không dùng quá 3 `And` liên tiếp)

### Data Table — dùng cho structured data trong steps

```gherkin
When Coach issues credits with the following details:
  | Session Type   | Credits | Note         |
  | PT Session     | 3       | Bulk issue   |
  | Group Class    | 1       | Trial credit |
Then client's credit balance reflects:
  | Session Type | Balance |
  | PT Session   | 3       |
  | Group Class  | 1       |
```

### Step atomicity

- 1 physical action per step
- Không: `"Fill in all required fields and click Submit"`
- Có: `"Enter 'coach@everfit.io' in the Email field"` + `"Click the Submit button"`

---

## Không viết Gherkin cho

- Tier 2/3 scenarios (edge/boundary/known bugs → không cost-effective để automate)
- Scenarios yêu cầu complex manual data setup mà không thể automate
- UI cosmetic checks (tooltip text, color, alignment)
- One-time migration scenarios

---

## SaaS-specific Gherkin patterns

### Multi-tenant isolation
```gherkin
Scenario: Coach A cannot access Coach B's clients
  Given Coach "coach_a@test.com" is logged in
  And Client "client_b" is connected to Coach "coach_b@test.com" only
  When Coach A navigates to client_b's profile URL directly
  Then Coach A sees "Not found" or "Access denied" — not client_b's data
```

### Billing state machine
```gherkin
Scenario Outline: Subscription state affects feature access
  Given User has subscription in "<state>" state
  When User attempts to access "<feature>"
  Then System responds with "<response>"
  Examples:
  | state    | feature          | response     |
  | trial    | basic dashboard  | Accessible   |
  | cancelled| premium reports  | Upgrade prompt|
  | expired  | any feature      | Reactivate prompt |
```

### Async operations
```gherkin
Scenario: Payment webhook updates subscription status
  Given Payment "pay_123" is initiated but webhook not yet received
  When Payment gateway sends success webhook for "pay_123"
  Then Subscription status updates to "active" within 30 seconds
  And User receives confirmation email
  And Invoice is marked as "paid"
```
