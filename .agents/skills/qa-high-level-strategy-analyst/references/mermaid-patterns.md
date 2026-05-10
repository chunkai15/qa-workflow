# Mermaid Patterns

Use Mermaid only when it improves review speed.

## Pattern 1 — Core Business Flow

Use for features with multiple gates or branches.

```mermaid
flowchart LR
  A["Trigger"] --> B{"Gate 1"}
  B -->|Yes| C{"Gate 2"}
  B -->|No| X["Blocked / Deferred"]
  C -->|Yes| D["Outcome"]
  C -->|No| Y["Alternate Outcome"]
```

## Pattern 2 — Lifecycle Summary

Use when states drive feature behavior.

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Active
  Active --> Overdue
  Overdue --> Active
  Active --> Cancelled
  Cancelled --> [*]
```

## Pattern 3 — Conflict Summary

Use only when one conflict dominates the review.

```mermaid
flowchart TD
  A["Spec reading"] --> C["Provisional canonical reading"]
  B["BE reading"] --> C
  C --> D["Needs clarification"]
```

## Rules

- Use at most 2 Mermaid blocks in the markdown by default.
- Keep labels short and reviewer-friendly.
- Do not mirror a large external diagram in full.
- Use Mermaid to summarize, not to redraw everything.
