# XMind Output Contract

Generate a `.xmind` strategy file whose root title is the feature or strategy title.

## Required Top-Level Branches

Keep these branches in this exact order:

1. `Objectives`
2. `Scope of Testing`
3. `Testing Levels`
4. `Testing Approaches`
5. `Test Data Preparation`
6. `Test Environments & Tools`
7. `Exit Criteria`
8. `Deliverables`

## Branch Guidance

### `Objectives`

Add 3-7 concrete business-validation objectives.

### `Scope of Testing`

Use these second-level nodes:

- `In Scope`
- `Out of Scope`

Under `In Scope`, group by surface or subsystem when useful.

### `Testing Levels`

Typical second-level nodes:

- `Unit Test`
- `Integration Testing`
- `System Testing`
- `UI/UX Testing`
- `Regression Testing`
- `Sanity Test`
- `Smoke Test`

Not every feature needs all of them, but the branch should be intentional and readable.

### `Testing Approaches`

Use these second-level nodes when applicable:

- `Functional Testing`
- `Testing Types`
- `Test Design Techniques`
- `Automation Approaches`

### `Test Data Preparation`

Group by data theme, for example:

- workspace configurations
- roles or user types
- variants and combinations
- boundary values
- integration or provider data

### `Test Environments & Tools`

Use these second-level nodes:

- `Environments`
- `Tools`

### `Exit Criteria`

Use these second-level nodes:

- `Functional Exit Criteria`
- `Non-functional Exit Criteria`
- `Documentation Exit Criteria`

### `Deliverables`

List the strategy outputs and expected downstream artifacts.

## Tree Payload Shape

The generator script expects a JSON payload shaped like this:

```json
{
  "title": "Feature Test Strategy",
  "sections": [
    {
      "title": "Objectives",
      "children": [
        {"title": "Validate scheduled downgrade behavior without issuing credit"}
      ]
    }
  ]
}
```

Each node supports:

- `title` string, required
- `children` array of nodes, optional

## Validation Rules

- All required top-level branches must exist.
- The branch order must match this contract.
- Empty titles are invalid.
- The tree may add deeper child nodes, but not extra top-level branches before the required eight.
