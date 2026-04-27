---
name: qa-bdd-feature-generator
description: Generate a highly structured BDD `.feature` file from Markdown specs, acceptance criteria, and UI images. The generated feature file is optimized for consumption by the `qa-auto-test-generator` pipeline and `playwright-context-builder`, including explicit runtime contracts, data contracts, critical oracles, and flow notes.
---

# QA BDD Feature Generator

Translate product specs, technical docs, and UI mockups into a pipeline-ready BDD `.feature` file. 

The output of this skill is **NOT** just generic Gherkin. It must include highly structured metadata contracts and use explicit, actionable language that the `playwright-context-builder` (Stage 1) can parse to automate UI exploration.

## Inputs

| Field | Type | Description |
|---|---|---|
| `spec_content` | string/file | Markdown spec, acceptance criteria, or business rules |
| `ui_images` | files | (Optional but recommended) Screenshots or mockups of the UI |
| `feature_key` | string | The folder name for this feature (e.g., `marketplace-test`) |

## Primary Responsibilities

1. **Analyze:** Understand the end-to-end business flow, prerequisites, and success criteria.
2. **Visual Mapping:** Automatically extract UI labels from **Figma URLs** using the **Figma MCP Server** (if available) to pull exact text nodes. If MCP is unavailable, use provided UI images. Use these exact labels (e.g., "Add to Bag", not "Add item") as element identifiers.
3. **Draft Contracts:** Define strict metadata comments (Runtime, Data, Oracles, Flow Notes).
4. **Write Gherkin:** Produce `Given/When/Then` steps using explicit NLP patterns optimized for Context Builder.
5. **Output:** Write the file to `features/<feature_key>/automation/input/<feature_key>.feature`.

---

## Execution Protocol

### Phase 1 - Intake and Decomposition
Read all provided specs and docs.
Extract:
- Starting URLs and User Roles (e.g., Admin, User).
- Form inputs and data constraints (e.g., max length, required format).
- Critical Actions (e.g., Submit, Publish, Save, Delete).
- End-states (e.g., Redirected to /dashboard, success toast appears).

**Automated UI Extraction (Figma MCP):**
If the spec contains a Figma URL (`https://www.figma.com/file/...` or `design/...`), attempt to use the Figma MCP server tools (e.g., `figma_get_node`, `figma_get_file`) to read the design data directly.
- Extract Text Layers to get exact button names, placeholders, and error messages.
- If the Figma MCP server is not configured or fails, fallback to analyzing manually provided `ui_images`.

### Phase 2 - Build Metadata Contracts
At the top of the `.feature` file (under the `Feature:` declaration), you MUST include the following metadata blocks as comments. This is required by the pipeline.

```gherkin
  # RUNTIME CONTRACT
  # start_url: [url]
  # auth.app.mode: [login_form|cookie|none]
  # auth.app.role: [role]
  # runtime.notes: [any special auth or execution notes]

  # DATA CONTRACT
  # data.[field_name]: [constraints, e.g., random, max_length=90, non_empty=true]
  # data.cleanup: [strategy, e.g., mark_for_review]

  # CRITICAL ORACLES
  # oracle.[action]_success: [strict proof, e.g., url=/success and "Success message" visible]

  # FLOW NOTES
  # flow.loading_state: [expected delays or spinners]
  # flow.modal_state: [names of popups/modals that appear]
```

### Phase 3 - Write BDD Scenarios

**1. Background:**
Always include a Background to establish state, URL, and auth.
Example:
```gherkin
  Background:
    Given user starts at "https://staging.app.com/login"
    And user has valid runtime credentials for role "admin"
```

**2. Scenarios:**
Divide the business flow into logical scenarios (e.g., "Happy path", "Validation errors", "Missing prerequisites"). Keep scenarios focused and avoid monolithic blocks over 15 steps.

**3. Language Rules (Optimized for Context Builder):**
The `playwright-context-builder` parses steps using NLP. You MUST follow these phrasing rules:
- **Navigation:** `Given user is on "/path"` or `When user opens "Menu Item"`
- **Interaction:** `When user clicks the "Exact Button Name" action` (Put UI entities in quotes).
- **Data Entry:** `When user enters a random "field name" value with constraint "non_empty"`
- **Assertion/Oracle:** `Then "success message" should be visible` or `Then user should be on "/dashboard"`

*NEVER use vague statements like `When user fills the form and submits`. Instead, break it down:*
```gherkin
  When user enters a random "email" value
  And user enters a random "password" value
  And user clicks the "Login" button
```

### Phase 4 - Write Output
Save the generated feature file directly to the workspace:
`features/<feature_key>/automation/input/<feature_key>.feature`

If the folder structure does not exist, create it.

---

## Quality Checklist
- Does the file include `RUNTIME CONTRACT`, `DATA CONTRACT`, `CRITICAL ORACLES`, and `FLOW NOTES`?
- Are all UI elements named in quotes matching the actual UI (or spec)?
- Does every Scenario end with a `Then` asserting a Critical Oracle?
- Are complex flows broken down into multiple Scenarios?
