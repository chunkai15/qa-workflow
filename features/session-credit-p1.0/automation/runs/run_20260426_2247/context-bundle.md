# Stage 1 Context Bundle: Session Credits P1.0

## Feature Summary
- **Name**: Session Credits P1.0
- **Path**: `features/session-credit-p1.0/automation/input/session-credit-p1.0.feature`
- **Goal**: Automate the end-to-end lifecycle of session credits including creation, issuance, deletion, booking deduction, and cancellation handling.

## Captured Pages
1. **Session Types Page**: `/home/booking/session-types`
2. **Client List**: `/home/client`
3. **Client Credits Sub-tab**: `/home/client/:id/sessions/credits`
4. **Client Training/Calendar**: `/home/client/:id/training`

## Key Selectors Captured
| Element | Selector | Confidence |
|---|---|---|
| **Add Session Type** | `button:has-text("Add New Session Type")` | High |
| **Require Credit Toggle** | `input[type="checkbox"]` | Medium |
| **Issue Credits Button** | `button:has-text("Issue Credits")` | High |
| **Deduct Credits (-)** | `button:has(i.minus)` | Medium |
| **History Filters** | `div:has(> span:text("Session Type"))`, `div:has(> span:text("Event"))` | Medium |

## Navigation Flows
- **Credits Access**: `Sidebar: Clients` -> `Search/Select Client` -> `Tab: Sessions` -> `Sub-tab: Credits`.
- **Session Configuration**: `Sidebar: Booking` -> `Sub-tab: Session Types` -> `Button: Add New Session Type`.
- **Booking**: `Client Profile` -> `Button: Go to Calendar` (mapped to `Training` tab) -> `Click Calendar Grid`.

## Interaction & State Observations
- **Loading Spinners**: Frequent "Getting your data ready" overlays and skeleton loaders during transition between main sections. Test scripts MUST wait for these to clear.
- **Modals**: Most critical actions (Issue, Deduct, Archive) occur in centered modals.
- **Dynamic Content**: The "-" (Deduct) button is only visible when a session type has > 0 credits.

## Coverage Gaps & Risks
1. **Archive Warning**: The specific warning text in the "Archive Session Type?" modal was not verified with live data during capture.
2. **Brittle Selectors**: The kebab menu for session type actions uses generated CSS classes. Recommended to use row-based targeting by session type name.
3. **Calendar Complexity**: Calendar interactions are grid-based and may require precise coordinate clicks or specific date targeting.

## Critical Outcomes
- [ ] **Creation Success**: Verify "Session credit" column check icon.
- [ ] **Issuance Success**: Verify balance increment and "Issued" event in history.
- [ ] **Deduction Success**: Verify balance decrement and "Deleted" event in history.
- [ ] **Booking Success**: Verify balance decrement and "Used" event in history.
- [ ] **Cancellation Success**: Verify balance refund on early cancel.

---
**Status**: COMPLETE (with gaps noted)
**Next Step**: Stage 3 - Planning
