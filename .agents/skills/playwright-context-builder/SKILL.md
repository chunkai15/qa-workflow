---
name: playwright-context-builder
description: Build a Stage 1 context bundle from a BDD or Gherkin `.feature` file by parsing scenarios, inferring routes and UI entities, exploring the target app with Playwright, capturing stable selectors, and writing `context-bundle.json` plus `context-bundle.md`.
- **Semantic Discovery**: Prioritize capturing attributes like `data-for`, `data-testid`, `title`, and `aria-label` during DOM exploration. These are often more stable than CSS classes.
- **Deep Ancestor Detection**: If an action button is far from its label, identify the nearest common ancestor container and document its unique attributes.
- **Ambiguity Detection**: Check if the target text appears in multiple places (e.g., search box vs. list) and document filtering siblings (e.g., "Duration", "Balance").
- **Overlay Awareness**: Identify if the app uses global loading overlays or sub-routes for modals and document the transition triggers.
Use before any Playwright POM or spec generation workflow.
---

# Playwright Context Builder

Build the Stage 1 context bundle that Stage 2 will consume.

This skill is the source of truth for understanding `.feature` intent and translating live UI reality into a stable machine-readable bundle. Prefer honest capture and explicit gaps over optimistic guesses.

## Inputs

| Field | Type | Description |
|---|---|---|
| `feature_file` | string | Path to, or raw content of, the `.feature` file |
| `staging_url` | string | Base URL of the staging or test environment |
| `auth_config` | object | Optional credentials, cookie, token, or storage state |
| `output_paths` | object | Optional explicit artifact targets such as `context-bundle.json` and `context-bundle.md` |

When this skill is invoked by `qa-auto-test-generator`, treat the orchestrator's artifact paths as the contract for Stage 1 completion.
When `auth_config` contains runtime credentials explicitly provided by the user, those credentials are valid inputs for live capture even if separate env vars are not set.

## Primary Responsibilities

1. Parse BDD intent before touching the browser.
2. Explore the app and capture stable selectors plus fallbacks.
3. Detect dynamic rendering, risky flows, and external integration needs early.
4. Produce a context bundle that is useful for both batch generation and hard-flow rescue.
5. Write Stage 1 artifacts to the agreed output paths so the orchestrator can hand off cleanly to Stage 2.

## Execution Protocol

### Phase 1 - Parse BDD intent

Before touching the browser:

1. Extract the Feature name.
2. List every Scenario or Scenario Outline with its full ordered steps.
3. Infer touched pages or routes from step language such as `on the login page` or `navigates to /settings`.
4. Infer actions mentioned in steps: `navigate`, `click`, `fill`, `assert`, `hover`, `select`, or `other`.
5. Extract UI entities mentioned in steps, especially quoted names and patterns like `the Submit button`.
6. Extract environment and setup intent from the feature text when present:
   - browser basic auth
   - app credentials
   - upload paths
   - random-data requirements
   - preconditions and expected outcomes
7. Mark risky steps early:
   - modal or popup triggers
   - iframe interactions
   - rich text editors
   - file uploads
   - multi-page transitions
   - finalizing actions such as publish, submit, confirm, or save
8. Build `critical_outcomes` for finalizing or business-critical steps.

Keep this as an internal working model before writing any output.

### Phase 2 - Navigate and explore

For each implied page, leverage the **Playwright MCP Server (`npx playwright run-test-mcp-server`)** to interactively explore the UI in real-time using tools like `browser_navigate`, `browser_click`, `browser_snapshot`, and `browser_evaluate`:

1. Navigate to the route.
2. Wait for `networkidle` before inspecting the DOM.
3. Apply auth first when needed.
4. Prefer accessibility-first inspection before raw DOM heuristics.
5. Do not take screenshots (`browser_snapshot` visual mode or `browser_take_screenshot`) unless absolutely necessary for visual-only states.
6. Do not assume the first post-navigation state is the final inspectable state.

Before beginning selector capture, classify the current page state when possible:

- ready for inspection
- transient loading or hydration
- auth or session redirect
- iframe-mediated intermediate state
- blocking alert or banner
- unknown intermediate state

If the page appears to be in an intermediate state, investigate that state before concluding the page is missing or capture has failed.

For each page, collect inspection metadata when possible:

- `page_type`
- `framework`
- `has_dynamic_ids`
- `has_iframes`
- `has_shadow_dom`
- `has_file_upload`
- `has_rich_text_editor`
- `has_disabled_critical_actions`
- `has_captcha`

Use heuristics from the live page to detect:

- React, Vue, Angular, Svelte, or static rendering
- rich text editors like Quill, ProseMirror, or contenteditable regions
- disabled critical buttons such as Publish, Submit, Continue, Confirm
- file inputs that may be hidden behind visible triggers
- route guards or auth redirects
- loading screens, skeletons, spinners, and hydration overlays
- alerts, banners, or toasts that may indicate delayed readiness
- iframe-based gates or embedded transition states

For each implied entity, resolve selectors in this priority order:

1. `data-testid`
2. semantic role plus accessible name
3. `aria-label`
4. `label` association or placeholder
5. native tag plus relevant attributes or text
6. CSS class
7. XPath

**Deep Ancestor Collection Rule**: Khi phát hiện thực thể nằm trong danh sách (List/Grid/Table) hoặc các hàng dữ liệu phức tạp (có chứa cả label và value ở các nhánh khác nhau), bắt buộc phải thu thập thêm `ancestor_locator`. Dùng lệnh Inspect để tìm thẻ cha bao trùm toàn bộ thực thể đó (ví dụ: thẻ `div` chứa cả tên Session Type và con số Balance), và lưu vào bundle để Stage 2 sử dụng thay vì chỉ lưu selector của từng text lẻ tẻ.

Collect:

- one primary selector
- up to two fallback selectors
- the page route
- the semantic role
- `confidence` as `high`, `medium`, or `low`
- `selector_reason`
- `stability_flags`

The bundle should prefer selector chains over single-point guesses. A selector entry is better when it explains both the primary match and the fallback story.

### Phase 3 - Handle dynamic content

For elements not visible on initial load, use Playwright MCP Server tools to interactively trigger state changes:

1. Attempt the trigger suggested by preceding BDD context.
2. Re-scan the DOM after the trigger.
3. If capture still fails, mark `captured: false` and add an honest `dynamic_note`.
4. Record iframe or conditional-rendering context when relevant.

Dynamic capture should be intent-aware, not page-static. Typical triggers include:

- open modal
- switch tab
- expand accordion
- click "Edit image" or equivalent upload affordance
- open pricing or settings drawer
- trigger hover menus only when the BDD step implies hover behavior

For native chooser or modal upload flows, classify the visible trigger, the chooser or modal state, and the post-upload UI signal separately when observable.

- If a critical action stays disabled after visible fields are filled, record the unresolved prerequisite in the bundle instead of guessing.

### Phase 3b - Interaction Stress Testing (New)

Đối với các thành phần quan trọng (input, toggle, modal), hãy thực hiện các bài "Stress Test" nhỏ để phát hiện hành vi UI không ổn định:

1.  **Focus Loss Test**: Sau khi tương tác với một toggle hoặc nút phụ, kiểm tra xem input chính có bị mất focus hoặc bị clear data không.
2.  **Overlay Detection**: Phát hiện nếu có các lớp layer ảo hoặc animation (như AntD modal animation) làm chậm quá trình sẵn sàng của element.
3.  **State Persistence**: Kiểm tra xem dữ liệu vừa fill có bị React reset khi click ra ngoài hoặc click vào thành phần liên quan không.

Ghi nhận các phát hiện này vào `behavioral_hints` để Stage 2 tạo code xử lý "phòng thủ".

### Phase 3a - Handle intermediate readiness states

When navigation lands on a state that is not clearly ready for inspection, do a short root-cause investigation before continuing.

Investigate in this order:

1. Check whether the URL is still changing or has redirected unexpectedly.
2. Check whether a loading message, spinner, skeleton, or progress UI is visible.
3. Check whether the page contains an iframe that may own the next interaction surface.
4. Check whether an alert or banner indicates data preparation, auth, consent, or account setup.
5. Re-check after a bounded wait or retry window.

Classify the result honestly:

- `transient_loading`
- `auth_redirect`
- `iframe_transition`
- `blocking_alert`
- `unknown_intermediate_state`

Recommended handling:

- `transient_loading`: wait for the blocking UI to disappear, then continue
- `auth_redirect`: record redirect context and stop guessing
- `iframe_transition`: inspect whether the iframe is decorative, auth-related, or the real interaction surface
- `blocking_alert`: capture the alert text and determine whether it is informational or blocking
- `unknown_intermediate_state`: record the evidence and surface `requires_human_review`

Do not treat an intermediate state as a selector failure unless the page has actually stabilized and the expected surface is still absent.

### Phase 4 - Detect integration and workflow hints

During exploration, detect and record downstream generation hints:

- `integration_hints`
- `required_human_checkpoints`
- `recommended_test_utilities`

Examples:

- CAPTCHA or anti-bot protection
- OTP or email verification
- OAuth or social login
- payment iframe
- file download or upload verification
- websocket or live notifications
- auth-required pre-seeding
- geolocation or locale-sensitive content

If these patterns appear, record them as hints for Stage 2 rather than forcing Stage 1 to solve them fully.

Record page-state hints when relevant:

- `page_state_hints`

Examples:

- `"loading_message: Getting your data ready"`
- `"iframe_present_during_transition"`
- `"alert_visible_before_ui_ready"`
- `"auth_redirect_suspected"`

**Data Dependency Detection**:
Scan the scenarios for cross-scenario data dependencies (e.g., Scenario 1 creates an entity "Session Type X", Scenario 2 uses "Session Type X").
Record these in `behavioral_hints` or `integration_hints` so Stage 2 knows to manage state carefully (e.g., combining tests or explicitly sharing variables) instead of isolating them blindly.

Examples:

- `"loading_message: Getting your data ready"`
- `"iframe_present_during_transition"`
- `"alert_visible_before_ui_ready"`
- `"auth_redirect_suspected"`

### Phase 5 - Assemble the context bundle

Write two files from the same source data:

- `context-bundle.json`
- `context-bundle.md`

If quality checks fail, still write the bundle and surface warnings clearly in the Markdown output.
Do not wait for perfect coverage before writing the bundle. A partial but honest bundle is preferred over no bundle.

Artifact path rules:

- If explicit output paths are provided, write exactly there.
- Otherwise prefer the orchestrator convention:
  - run root derived from the owning feature folder
  - `features/<feature-key>/automation/runs/<run-id>/context-bundle.json`
  - `features/<feature-key>/automation/runs/<run-id>/context-bundle.md`
- Do not silently write bundles to ad hoc locations when the caller expects deterministic handoff.

## Output Contract

The JSON bundle must contain:

- `meta`
- `page_inventory`
- `locator_map`
- `interaction_patterns`
- `coverage_gaps`
- `critical_outcomes`

Recommended additional sections:

- `integration_hints`
- `required_human_checkpoints`
- `recommended_test_utilities`
- `page_state_hints`
- `behavioral_hints`

Each `interaction_patterns[].steps[].target_element_id` must reference a `locator_map[].element_id` unless the step is intentionally logged as a coverage gap.

Each locator entry should include:

- `element_id`
- `page_route`
- `semantic_role`
- `primary_selector`
- `fallback_selectors`
- `confidence`
- `selector_reason`
- `stability_flags`
- `behavioral_hints` (e.g., `requires_refocus`, `slow_animation`, `state_loss_prone`)

Each page entry should include an `inspection_meta` section when the data is available.

Each `critical_outcomes[]` entry should include:

- `scenario_name`
- `step_text`
- `status`
- `oracle_type`
- `observed_signal`
- `evidence`
- `confidence`

Allowed `critical_outcomes[].status` values:

- `observed`
- `blocked`
- `unknown`
- `requires_runtime_verification`

Rules:

- finalizing steps such as publish, save, submit, confirm, redirect success, or upload completion must appear in `critical_outcomes`
- if Stage 1 cannot prove the outcome, mark it unresolved instead of omitting it
- missing critical outcome classification blocks honest Stage 1 exit

If a page could not be fully captured because it never reached a stable inspectable state, record:

- the observed state classification
- the visible evidence
- any bounded retries attempted
- whether the issue appears transient, auth-related, iframe-related, or unknown

Stage 1 completion should be treated as successful only when:

- both bundle files exist at the agreed paths
- the JSON is structurally usable for Stage 2
- the Markdown summary is consistent with the JSON

Stage 1 may still be considered complete enough for planning when:

- some scenarios or pages are only partially captured
- unresolved items are clearly represented in `coverage_gaps`
- page-state evidence and missing interactions are documented honestly

In that case, write the bundle anyway and let Stage 3 decide whether generation should proceed.

## Locator Stability Rules

- Always prefer `data-testid` when present.
- Never use positional selectors such as `:nth-child(...)` as primary selectors.
- Avoid hashed or obviously generated CSS classes as primary selectors.
- If only weak selectors exist, keep the best one available and record the limitation honestly.
- If accessible name and semantic role exist, prefer them over brittle CSS.
- If a selector is usable only after a trigger, record that trigger context explicitly.
- If the only working selector is weak, set `confidence: low` and add a stability warning.

## Coverage Gap Taxonomy

When recording gaps, prefer explicit types:

- `route_not_found`
- `auth_blocked`
- `element_missing`
- `dynamic_trigger_failed`
- `weak_selector_only`
- `environment_blocked`
- `requires_human_review`
- `intermediate_state_blocked`

Gaps should explain what was attempted and why capture remains incomplete.

## Error Handling

- If a route returns 404, add a coverage gap for that route.
- If auth fails, stop and report the auth problem.
- If an element is missing from the DOM, add a coverage gap and continue.
- If a dynamic trigger fails, document it and continue.
- If page load times out, retry once and then record the failure.
- If artifact targets are provided but cannot be written, report Stage 1 as incomplete.
- If runtime credentials are provided but rejected by the application, report an auth failure rather than claiming inputs are missing.
- If the page remains in a loading, alert, or iframe-mediated intermediate state after bounded retries, record `intermediate_state_blocked` with the observed evidence.
- If exploration reaches only a subset of the intended flow, still write a partial bundle and represent the missing coverage explicitly.

## Quality Checklist

- Ensure every BDD scenario appears in `interaction_patterns`.
- Ensure every referenced target element is backed by `locator_map` or an explicit coverage gap.
- Ensure `context-bundle.md` and `context-bundle.json` stay consistent.
- Ensure every critical end-state is represented in `critical_outcomes`.
- Ensure dynamic capture failures are documented, not hidden.
- Ensure selector confidence and fallback data are present for captured elements.
- Ensure risky steps and critical actions are represented honestly.
- Ensure integration hints are captured when they materially affect automation design.
- Ensure artifact paths are deterministic and match the caller's expectations.
- Ensure intermediate page states are classified before capture is abandoned.
- Ensure partial captures still produce `context-bundle.json` and `context-bundle.md`.
- Keep the bundle honest even when coverage is incomplete.
