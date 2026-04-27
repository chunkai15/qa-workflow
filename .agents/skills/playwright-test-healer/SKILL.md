---
name: playwright-test-healer
description: Debug and fix failing Playwright tests in Stage 6 using Playwright MCP Server tools.- **DOM-First Debugging**: NEVER guess a selector. Always use the browser subagent to inspect the DOM, verify visibility, and check for overlapping text/elements.
- **Ambiguity Verification**: When a locator fails, check if it matches multiple elements. If so, use content-based filtering or scoped parents.
- **State Check**: Verify if the failure is due to a missing React state update (e.g., input not committed) and apply the `Tab/Blur` fix.
- **Ancestor Trace**: If a target element is not clickable, trace up to the nearest `cursor=pointer` or interactive ancestor.
ate.
---

# Playwright Test Healer

Diagnose and repair failing Playwright tests dynamically.

This skill is intended for use during Stage 6 (Execute, Debug, and Repair) of the `qa-auto-test-generator` workflow. It relies on the **Playwright MCP Server** to actively interact with the browser, inspect the application, and fix broken tests.

## Inputs

| Field | Type | Description |
|---|---|---|
| `failed_spec_file` | string | Path to the `.spec.ts` file that failed |
| `error_log` | string | The execution error or stack trace |
| `staging_url` | string | The URL being tested |

## Primary Responsibilities

1. Run the failing test using Playwright MCP tools (`test_run` or `test_debug`).
2. Interactively debug the browser state at the point of failure.
3. Identify the root cause using **`systematic-debugging`**.
4. Update the test code or page object to resolve the issue.
5. Re-run and verify the fix using **`verification-before-completion`**.

## Execution Protocol

### Phase 1 - Reproduce and Debug

1. Run the failed test using the MCP Server tool `test_run`.
2. **Subagent-First / DOM-First Debugging Rule**: Khi test fail vì lý do giao diện (UI) như Timeout `ElementNotFound`, `WrongText`, hoặc `Received 0 expected X`, **CẤM** tuyệt đối việc đoán mò cấu trúc thẻ (đoán thẻ `a`, thẻ `span`) hoặc chỉnh sửa locator một cách mù quáng.
3. Bạn **BẮT BUỘC** phải gọi `browser_subagent` hoặc một script trích xuất để dump toàn bộ cây DOM (`outerHTML`) tại chính xác khu vực bị lỗi, hoặc chụp ảnh toàn màn hình để xác nhận "Sự thật trần trụi" (Ground Truth) trước khi viết code sửa.

### Phase 2 - Root Cause Analysis

Determine why the test failed. **MANDATORY**: Bạn phải gọi skill `systematic-debugging` để tạo một bản phân tích (hypotheses) trước khi thực hiện bất kỳ thay đổi nào.

- **Selector Issue**: The DOM changed. Use the DOM dump from Phase 1 to build an exact `ancestor::` or `:has()` locator. Never use blind text filters if the context is complex.
- **Timing Issue**: The element is not ready. Consider adding readiness checks (e.g., `expect(locator).toBeVisible()`). Never use `networkidle` if discouraged.
- **State Mismatch (React/Vue)**: Nếu UI hiện đúng nhưng test fail, nguyên nhân là React State chưa được commit. Phải sửa kịch bản thành chuỗi event chuẩn (`click -> clear -> pressSequentially -> Tab`).
- **Business Rule Issue**: The flow has changed or auth failed.

### Phase 3 - Repair

Edit the codebase (either the `*.spec.ts` or the corresponding `*Page.ts` POM file) to apply the fix:
- Promote fallback selectors if the primary failed.
- Add necessary `waitFor` or intermediate steps.
- Use regex locators for resilient matching.

**Constraints:**
- Maximum 2 repair attempts per test.
- If the test is structurally correct but the application has a persistent bug, mark the test with `test.fixme()` and leave an explanatory comment instead of endlessly trying to fix it.
- Do not bypass required business steps or invent data just to pass.

### Phase 4 - Verify

1. **MANDATORY**: Gọi skill `verification-before-completion`.
2. Chạy lại test ít nhất **3 lần liên tiếp** (hoặc sử dụng flag `--repeat-each 3`) để đảm bảo fix không bị flaky.
3. Nếu tất cả các lần chạy đều pass, xác nhận kết quả là `resolved_via_runtime_debug`.
4. Nếu vẫn thất bại sau 2 vòng sửa lỗi, báo cáo lại workflow chính.
