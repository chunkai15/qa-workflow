---
name: playwright-test-builder
description: Build a Stage 2 Playwright TypeScript suite from `context-bundle.json` and its Markdown companion by generating `BasePage`, page objects, fixtures, specs, and a validation report. Use after `playwright-context-builder` has produced a valid context bundle and before running the generated suite.
---

# Playwright Test Builder

Build the Stage 2 Playwright suite from a valid context bundle.

This skill consumes Stage 1 output as its source of truth. It should generate maintainable Playwright code that is aware of selector confidence, dynamic workflows, human checkpoints, and business preconditions.

## Inputs

| Field | Type | Description |
|---|---|---|
| `context_bundle_json` | path or object | Machine-readable output from Stage 1 |
| `context_bundle_md` | path | Human-readable companion bundle |
| `output_dir` | string | Directory where generated files will be written |
| `staging_url` | string | Used for live selector verification |
| `auth_config` | object | Optional auth configuration reused from Stage 1 |
| `planning_notes` | object or text | Optional reviewed expectations from `qa-auto-test-generator` Step 3 |
| `generation_plan_json` | path or object | Official Step 3 handoff with oracle, validation, execution, and repair expectations |

Do not continue if the context bundle is missing or malformed.

When this skill is invoked by `qa-auto-test-generator`, treat the reviewed Stage 1 bundle and `generation_plan_json` as the contract for Stage 2.
If `auth_config` contains runtime credentials explicitly provided by the user, they may be used for validation flows without requiring a separate env bootstrap first.

## Primary Responsibilities

1. Generate stable multi-file Playwright code from the bundle.
2. Preserve feature intent, not just DOM interactions.
3. Turn low-confidence or dynamic capture into explicit code comments, TODOs, checkpoints, or validation warnings.
4. Validate generated code with useful failure taxonomy instead of generic pass/fail output.
5. Write generated artifacts where the orchestrator expects them and make validation handoff explicit.

## Execution Protocol

### Phase 1 - Generate BasePage

Create `pages/BasePage.ts` first.

The class must provide:

- `goto(route: string)`
- a network-idle wait via navigation flow
- `expectVisible(locator)`
- `softExpect(locator)`
- `waitForReady()`: Tự động chờ các skeleton/loading overlays ẩn đi.
- `safeClick(locator)`: Thử click với retry và xử lý các overlay tạm thời.
- `fillAndVerify(locator, value)`: Điền dữ liệu và xác minh lại để tránh mất state.
- a helper for structured debug logging during validation khi thực thi.

Keep this file deterministic and stable.

Output path rules:

- If the caller gives an explicit `output_dir`, write the suite there.
- If the caller follows the orchestrator default, prefer:
  - `features/<feature-key>/automation/runs/<run-id>/generated/`
- Do not write generated files to ambiguous locations when Stage 3 has already approved a suite root.

### Phase 2 - Generate page objects

For each unique `page_route` in `locator_map`:

1. Generate one `pages/[PageName]Page.ts`.
2. Extend `BasePage`.
3. Create one getter per locator.
4. Reference fallback selectors in comments above the getter, or implement a locator chain when the bundle supports it.
5. Create fluent action methods that return `this`.
6. For unresolved dynamic elements, generate a TODO stub instead of throwing.
7. For critical actions such as publish, submit, confirm, save, or continue, generate readiness checks before clicking when the bundle indicates business preconditions or disabled-action risk.

Use route naming such as:

- `/login` -> `LoginPage`
- `/dashboard/settings` -> `DashboardSettingsPage`
- `/` -> `HomePage`

Page object generation rules:

- Prefer semantic selectors first and preserve fallback intent from Stage 1.
- **Deep Ancestor Locator Rule**: Khi trích xuất dữ liệu hoặc tương tác với phần tử trong một danh sách/bảng (List/Table), TUYỆT ĐỐI KHÔNG dùng text filter phẳng (`locator().filter()`). Bắt buộc sinh xpath theo mô hình Ancestor-Descendant để "leo lên" container cha bao trùm toàn bộ hàng dữ liệu đó trước khi trích xuất giá trị (ví dụ: `xpath=./ancestor::div[.//button][1]`).
- **React-Safe Input Rule**: Đối với các ứng dụng React/Vue (Single Page Applications), tuyệt đối không sinh code dùng `evaluate(v => input.value = v)`. Bắt buộc sinh chuỗi hành động mô phỏng người dùng: `click -> Control+A -> Backspace -> pressSequentially -> Tab (Blur)` để đảm bảo State được commit chính xác.
- If `confidence: low`, keep the generated locator but add a concise warning comment.
- Do not silently collapse unresolved dynamic elements into brittle selectors.
- For rich text editors, uploads, dialogs, and iframes, generate focused helper methods instead of inlining brittle actions in specs.
- When a locator can be reached only after a trigger, reflect that in the action method sequence.
- Respect explicit planning notes about critical actions, checkpoints, and review markers when they are provided.
- **Defensive Logic**: Sử dụng `behavioral_hints` từ Stage 1 để chèn thêm logic phòng thủ (ví dụ: `re-focus` sau khi click toggle, hoặc `waitForTimeout` cho slow animations).

### Phase 3 - Generate fixtures

Create `fixtures/index.ts` that:

- instantiates each page object
- exports custom `test`
- re-exports `expect`
- applies auth setup when storage state or equivalent auth context is available

When Stage 1 includes workflow hints, consider generating small focused helpers or fixtures for:

- auth setup
- random test data
- file upload path normalization
- integration stubs
- human checkpoint configuration

### Phase 4 - Generate specs

For each Scenario in `interaction_patterns`:

1. Create a dedicated `[fs-friendly-scenario-name].spec.ts` file for this scenario to ensure isolation.
2. At the top of the file, add metadata comments linking to the source (e.g., `// feature: path/to/feature`, `// context: path/to/context-bundle.md`).
3. Wrap the test in a `test.describe()` block matching the overall Feature name.
4. Create one `test()` block for the scenario.
5. Preserve `// Given`, `// When`, and `// Then` section comments.
6. Add the original BDD step text as an inline comment above generated actions.
7. Include the minimum fixture set needed by the scenario.
8. Ensure each scenario includes at least one assertion path.
9. Preserve step intent for dynamic flows instead of flattening everything into click chains.
10. Before critical actions, assert that the action is ready when the context bundle indicates prerequisite risk.
11. If Stage 1 emitted a required human checkpoint, generate a guarded checkpoint pattern instead of blindly hardcoding `page.pause()`.
12. If a critical end-state has an oracle in Stage 1 or Step 3, generate an explicit assertion for it.
13. If a critical end-state has no verified oracle, keep an explicit unresolved marker in code or validation output.

Spec generation rules:

- Keep assertions close to the step they validate.
- **State Management Rule**: Tránh khai báo biến global (toàn cục) ở ngoài cùng file `spec.ts` để truyền dữ liệu giữa các kịch bản chạy tuần tự (Serial) nếu không được quản lý chặt chẽ. Ưu tiên gộp các kịch bản có tính phụ thuộc dữ liệu cao (Tạo -> Sử dụng -> Xóa) vào chung một khối `test()` và phân tách bằng `test.step()`, hoặc lưu state vào một Data Object để tránh lỗi `undefined` khi Worker reset context.
- **Noise Filtering Rule**: Khi xác thực số liệu, luôn sinh code loại bỏ văn bản nhiễu (ví dụ: mã định danh trong tên) trước khi dùng Regex trích xuất để tránh bắt nhầm số liệu.
- If a scenario ends in success criteria such as published, saved, redirected, or visible confirmation, generate explicit result assertions.
- Clicking a critical button without asserting its result is not sufficient.
- For unresolved business-state prerequisites, emit a clear `NEEDS_HUMAN_REVIEW` comment and reflect it in validation output.
- Preserve orchestrator planning notes when they materially affect generation choices.

### Phase 5 - Validate in three tiers

Run validation sequentially:

1. Static analysis
2. Selector verification
3. Semantic coverage

If a tier fails:

- attempt safe auto-fix once or twice when practical
- keep generating the rest of the output
- report the failure honestly in `validation-report.md`
- flag remaining issues as `NEEDS_HUMAN_REVIEW`

Validation should classify failures where possible:

- `selector_issue`
- `selector_ambiguity`
- `timing_issue`
- `navigation_issue`
- `auth_issue`
- `business_rule_issue`
- `integration_required`
- `environment_issue`
- `requires_human_review`
- `oracle_missing`
- `feature_mismatch`
- `resolved_via_runtime_debug`

## Output Files

Write:

- `pages/BasePage.ts`
- `pages/*Page.ts`
- `fixtures/index.ts`
- `tests/*.spec.ts`
- `validation-report.md`

Write additional helper files only when justified by the context bundle. Prefer small, focused files over speculative scaffolding.

Stage 2 should be treated as complete only when:

- the generated files exist in the agreed suite root
- `validation-report.md` exists
- remaining low-confidence or human-review items are surfaced, not hidden

## Validation Requirements

### Tier 1 - Static analysis

- Ensure generated TypeScript compiles.
- Ensure imports resolve.
- Ensure specs do not reference missing page object members.
- If static analysis cannot run, state that clearly in `validation-report.md`.

### Tier 2 - Selector verification

- Re-check selectors against the live app interactively using **Playwright MCP Server** (`browser_navigate`, `browser_verify_element_visible`, etc.).
- Try fallbacks using the MCP Server if a primary selector fails.
- Promote a fallback to primary when it proves better and record the promotion.
- Preserve the previous selector in comments or validation notes when a promotion happens.
- Distinguish selector failure from business-state failure. A found but disabled button is not a selector problem.

### Tier 3 - Semantic coverage

- Verify all BDD steps map to generated code.
- Verify section comments are present and ordered.
- Verify each scenario has at least one assertion.
- Verify critical end-state steps have meaningful assertions rather than only navigation or visibility placeholders.
- Verify human checkpoints and integration-driven steps are represented honestly.
- Do not mark semantic coverage `complete` when any critical end-state lacks a concrete asserted oracle.

## Validation Report Expectations

`validation-report.md` should include:

- summary of generated files
- selector promotions
- remaining low-confidence locators
- unmet dynamic captures
- critical outcome matrix
- failure taxonomy for any validation failures
- explicit `NEEDS_HUMAN_REVIEW` items

If a scenario is blocked by business prerequisites, call that out directly instead of masking it as a generic timeout.
If the bundle or planning notes were insufficient, say so explicitly so the orchestrator can route back to Stage 2 or Stage 3 appropriately.

## Quality Checklist

- Ensure every page class extends `BasePage`.
- Ensure every locator entry is represented in- **Data-Driven Mapping**: For every new test suite, MUST create a `data/test-data.ts` file. 
    - Move all business parameters (names, quantities, roles) into this file.
    - Include authentication credentials in the mapping if requested (avoiding raw `.env` for static test accounts).
    - Import `testData` at the top level of the generated `.spec.ts` files.
- **React-Safe Input**: Always trigger a `Tab` key or `blur()` after typing into numeric or state-heavy fields.
- **Content-Based Filtering**: To avoid Search Box collisions, filter row locators by combining the Target Name with unique sibling content (e.g., "min", "Balance", "credits").
- **Strict Mode Prevention**: Always use `exact: true` for button names and scope locators within `.modal` or `.overlay` when multiple instances exist.
- **Semantic Over Visual**: Prefer `[data-for]`, `[title]`, or `[aria-label]` for kebab menus over generic tag names like `img` or `i`.
- Ensure fixtures cover every generated page object referenced by specs.
- Ensure low-confidence selectors are surfaced, not hidden.
- Ensure critical actions have readiness checks when the bundle indicates disabled-state risk.
- Ensure critical end-states have asserted or explicitly unresolved oracle handling.
- Ensure integration hints from Stage 1 are either converted into code hooks or reflected as explicit review notes.
- Ensure output paths and validation artifacts are deterministic for orchestrated handoff.
- Keep `validation-report.md` accurate even when failures remain.
