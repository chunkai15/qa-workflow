# US13 — Migration Analysis: Deep Dive
## Session Credits P3.1 — Package Issuance

**Last updated:** 2026-05-15 | **Spec:** v34 | **Source:** XLSX old UI scenarios + [Spec_3.1]

---

## 1. Purchase Status Mapping: Old → New (P3.1)

### 1.1 Old Status System (Pre-P3.1)

From the existing XLSX test scenarios, the old system had these statuses and visual indicators:

| Old Status Label | Where Displayed | Visual Indicator | Notes |
|---|---|---|---|
| **Active** | Analytics list "Active Purchases" tab | No modifier | Covers many sub-states |
| **Trial** | Analytics list "Active Purchases" tab + separate "Trial" tab | "3 days left on trial" tag in Subscription Details middle part | SE4-114, SE4-173 |
| **Pause** | Analytics list | `Status = PAUSE` | SE4-81, SE4-88 |
| **Cancelled** | Analytics list "Cancelled" tab | Moved to Cancelled tab | SE4-73, SE4-91, SE4-104 |
| *(implied Overdue)* | Analytics list | Overdue invoice present | No explicit status label in XLSX |
| *"Cancelling on..."* | NOT a status — shown in **Next Invoice column** | `Next invoice: Cancelling on {date}` | SE4-98: Self-cancel shows Active with this note |
| *"Ending on..."* | NOT a status — shown in **Next Invoice column** | `SHOULD show the text "Ending on...."` | SE4-69: Fixed-term end shown in column |

### 1.2 New Status System (P3.1 — US3)

| New Status | Label | Terminal? | Actionable Buttons |
|---|---|---|---|
| Active | "Active" | No | Recurring: Pause+Cancel; One-time: Cancel |
| Free Trial | "Free Trial" | No | Cancel |
| Overdue | "Overdue" | No | Pause+Cancel (recurring only) |
| Paused | "Paused" | No | Resume+Cancel |
| Expires Soon | "Expires Soon" | No | Cancel |
| Expired | "Expired" | Yes | None |
| Cancels Soon | "Cancels Soon" | No | Reactivate |
| Canceled | "Canceled" | Yes | None |

### 1.3 Status Mapping Table: Old → New

| Old Status | Old Condition (from XLSX) | New Status | Migration Rule | Test Priority |
|---|---|---|---|---|
| **Active** | One-time, paid, no special state | **Active** | Direct rename (label same, style/color updated) | HIGH |
| **Active** | Recurring, paid, valid renewal pipeline | **Active** | Direct rename | HIGH |
| **Trial** | Trial period active (not yet paid) | **Free Trial** | Rename: "Trial" → "Free Trial" | HIGH |
| **Pause** | Coach paused recurring | **Paused** | Rename: "Pause" → "Paused" | HIGH |
| **Active** + "Cancelling on {date}" in Next Invoice | Client/coach scheduled cancel, cancel date not yet reached | **Cancels Soon** | OLD: shown as Active with note in column → NEW: explicit "Cancels Soon" status label | HIGH |
| **Active** + "Ending on..." in Next Invoice | Fixed-term recurring, last invoice generated, still in final cycle | **Expires Soon** | OLD: shown as Active with "Ending on..." → NEW: explicit "Expires Soon" label | HIGH |
| **Cancelled** | Fixed-term recurring reached natural end of all invoices | **Expired** | OLD: all "end states" lumped into Cancelled tab → NEW: split into Expired (natural end) vs Canceled (user action) | HIGH |
| **Cancelled** | Coach or client cancelled before natural end | **Canceled** | Rename (spelling: "Cancelled" → "Canceled") + explicit reason alert in details | HIGH |
| **Cancelled** | First paid invoice after trial failed | **Canceled** | Same Canceled terminal state, but with specific alert in Purchase Details | HIGH |
| *(implied Overdue)* | Recurring, renewal invoice failed, not yet retried/cancelled | **Overdue** | New explicit status; old system may have shown as Active or not differentiated | MEDIUM |

### 1.4 Key Behavioral Changes Per Status

| Status | Old UI Behavior | New UI Behavior | Change Type |
|---|---|---|---|
| Trial / Free Trial | Shown in separate "Trial" tab; status "Trial" in list; "TRIAL" tag in middle section of Subscription Details | Shown in "Active" filter tab; "Free Trial" badge; Free trial section in PRICING PLAN (duration, ends on date, days-left tag) | Tab consolidation + richer detail |
| Pause / Paused | Status = PAUSE in list; actions via `...` dropdown | Status badge "Paused"; alert "Subscription Paused"; Resume+Cancel buttons visible (not in dropdown) | Dropdown → explicit buttons + alert |
| Cancels Soon | Still shows "Active" in status; "Cancelling on {date}" in Next Invoice column | Explicit "Cancels Soon" badge; alert "Subscription Cancels Soon"; Reactivate button | Status made explicit; alert added |
| Expires Soon | "Active" in status; "Ending on..." in Next Invoice column | Explicit "Expires Soon" badge; alert "Subscription Expires Soon"; Cancel button | Status made explicit; alert added |
| Expired | Goes to Cancelled tab → Status = Cancelled (not differentiated from user-cancelled) | Explicit "Expired" badge; no action buttons; "Expired on {date}" in Pricing Plan | New dedicated status (split from old Cancelled) |
| Canceled | In Cancelled tab | "Canceled" badge (spelling change); split into: (a) failed-trial alert, (b) coach/client cancel no alert | Richer context with alert differentiation |
| Overdue | Likely shown as Active with overdue invoice in table | Explicit "Overdue" badge; alert "Renewal Payment Failed"; Pause+Cancel buttons | New explicit status + alert |

---

## 2. UI Comparison: Old vs New

### 2.1 Package Overview Page

| Element | Old UI (Pre-P3.1) | New UI (P3.1) |
|---|---|---|
| **Pricing component** | "Add Pricing" button (basic); after save: pricing shown inline | "Add Pricing" button (updated style, no edit icon on button itself); after save: dedicated "PRICING PLAN" block with icon, edit icon |
| **Pricing format** | Pricing shown as text in package overview | Formatted block: `{CURRENCY} {amount}/{cycle} . {x} times` with edit icon |
| **Free Trial indicator** | Not explicitly shown in overview | `{x}-DAY TRIAL` tag shown if free trial configured |
| **Session Credits block** | ❌ Does not exist | ✅ New "SESSION CREDIT" block with icon, tooltip, 3-column table (session type, amount, expiration) |
| **Create Package pop-up** | "Create New" button | "Create Package" button; updated font/style; added "Cancel" button |
| **Add Pricing pop-up** | Simpler UI; no Session Credits section | New UI: Pricing Plan + Free Trial + Session Credits sections |

### 2.2 Package Analytics List

| Element | Old UI | New UI |
|---|---|---|
| **Filter tabs** | "Active Purchases" + "Trial" (separate tab) + "Cancelled" | "Active Purchases" (includes Free Trial, Cancels Soon, Expires Soon) + "Inactive" (Cancelled, Expired) |
| **Status column** | Active / Trial / Pause / Cancelled | Active / Free Trial / Overdue / Paused / Expires Soon / Expired / Cancels Soon / Canceled |
| **"Cancelling on"** | In "Next Invoice" column as text note | Removed from column → shown as "Cancels Soon" status badge |
| **"Ending on"** | In "Next Invoice" column as text note | Removed from column → shown as "Expires Soon" status badge |
| **Actions** | `...` dropdown per row | Explicit buttons: Pause Subscription / Resume Subscription / Cancel / Reactivate / Message Client (based on status) |

### 2.3 Purchase Details Pop-up (Subscription Details)

| Element | Old UI ("Subscription Details") | New UI ("Purchase Details Pop-up") |
|---|---|---|
| **Name** | "Subscription details" | "Purchase Details" pop-up |
| **Loading state** | Not mentioned | Skeleton loading while data loads |
| **Header** | Client name, Email, Phone, Coach | Client name, **Message icon** (new, only if account_ID), Email, Phone, Coach, **X button** |
| **View Package selector** | Dropdown to show all packages (SE4-62) | "View Package" dropdown: order = All Packages → Active (recent first) → Inactive (recent first, no status shown) |
| **Status display** | Status shown in analytics LIST row, not in pop-up header area | Status badge shown prominently in pop-up; status-specific alerts |
| **Action buttons** | In `...` dropdown: "Mark as Cancelled" / "Cancel subscription" / "Pause subscription" / "Cancel Trial" | Dedicated buttons based on status: Pause / Cancel / Resume / Reactivate (no `...` dropdown for these) |
| **Resend button** | "Resend invitation" button (or "Resend activation email") | "Resend Activation Email" as hyperlink (shown only if not activated) |
| **Order Number** | Shown in middle section | Part of Purchase Details: "Order Number: {Order}" |
| **Trial tag** | "TRIAL" tag with: "Trial started on {date} and will end on {date} ({n} days left)" in middle section | PRICING PLAN section with: "Free trial duration {x} days" + "{n} days left" tag + "Trial ends on {date}" |
| **Card info** | "VISA ending in: {last 4}" inline in middle section | PRICING PLAN section: icon + "Payment method: {Card type} •••• {last 4}" |
| **Status-specific alerts** | ❌ None — no alert messages | ✅ Alerts for: Overdue ("Renewal Payment Failed"), Paused ("Subscription Paused"), Expires Soon ("Subscription Expires Soon"), Cancels Soon ("Subscription Cancels Soon"), Canceled-failed-trial ("Cancelled Due to Payment Failure") |
| **PRICING PLAN section** | Inline text: price, billing info | Structured PRICING PLAN section with icons and contextual fields per status |
| **Session Credits section** | ❌ Does not exist | ✅ New: coin icon + "Session Credits" + summary + expandable list + "View issued credits" button |
| **Invoice table columns** | Name package \| Invoice \| PAYMENT DUE \| BILLING CYCLE \| Status \| Amount | Invoice # \| Payment Due \| Billing Cycle \| Amount \| Status (same data, reordered/renamed) |
| **Invoice actions** | Not detailed in old scenarios | Eclipse menu per invoice: Refund / Recharge / Resend / Cancel based on invoice status |
| **Total Paid** | Not shown | "Total Paid: {symbol}{Total}" above invoice table |
| **Empty invoices state** | "SHOULD NOT show the invoice" during trial | Explicit empty state: icon + "No invoices yet" + description |
| **All Packages view** | "SHOULD able to click on dropdown to show all packages" | "All Packages" option: hides Pricing Plan, shows Package column in table |
| **Responsive** | Not tested | Must be responsive at different resolutions |

---

## 3. Promo Code Handling for Migrated Purchases

### 3.1 Does Migration Include Promo Codes?

**YES** — Promo codes are a Stripe-level concept that already exists. For existing purchases WITH promo codes applied:

- The promo discount data exists in Stripe and Everfit's DB
- P3.1 **adds new UI display** for discounts in the Purchase Details pop-up (US5)
- Migration (US13) must correctly render this new discount UI for pre-P3.1 purchases

### 3.2 Promo Code State for Migrated Purchases

| Existing Purchase Type | Promo Applied | Expected New UI Display |
|---|---|---|
| One-time, paid, no trial | One-time discount | Show discount badge + strikethrough + tooltip "Promo Code: {code}" |
| One-time, paid, during trial | One-time discount | Show discount badge + tooltip "Discount applied after trial" |
| One-time, paid, trial ended | One-time discount | Show discount badge (already applied) |
| Recurring, past first invoice, one-time discount | One-time discount (used) | NO discount shown (already consumed on 1st invoice) |
| Recurring, active, N-invoices discount remaining | N-invoices | Show if next invoice still has discount; tooltip with remaining count |
| Recurring, active, all-recurring-payments | Forever | Always show discount; tooltip "Discount applied to all payments" |
| Recurring, natural end (Expired), any promo | N/A | No discount shown (no future invoices) |
| Recurring, Cancels Soon, promo on next invoice | Any | Show discount if applies to next invoice before cancel date |

### 3.3 Key Validation Points for Promo Migration

1. **Data preserved**: Promo code association in DB must survive migration
2. **Discount calculation**: Correct discounted amount shown (not original price)
3. **Remaining invoices**: System correctly counts remaining discount invoices for N-invoices type
4. **Expired promos**: Promos where discount period has ended are NOT shown
5. **tooltip text**: Correct tooltip per promo type and timing

---

## 4. Migration Data Integrity Checklist

### 4.1 Package Data

| Field | Expected After Migration | Risk |
|---|---|---|
| Package name | Preserved | Low |
| Pricing Plan (amount, model, cycle, expiration) | Preserved and shown in new PRICING PLAN block | Medium |
| Free Trial configuration | Preserved | Medium |
| Session Credits | Empty/OFF by default | LOW — by design |
| Published status | Preserved (pricing model locked if published) | High |
| Draft version | Preserved | Medium |

### 4.2 Purchase Data

| Field | Expected After Migration | Risk |
|---|---|---|
| Purchase ID / Order Number | Preserved | Low |
| Client association (billing vs. account) | Preserved; name/email shown correctly | Medium |
| Status mapping | Correctly mapped per Section 1.3 | HIGH |
| Invoice records | All historical invoices preserved | HIGH |
| Invoice status (PAID/FAILED/etc.) | Preserved; shown in new table | Medium |
| Billing cycle dates | Preserved | Medium |
| Payment card info | Preserved; shown in new PRICING PLAN format | Low |
| Promo code data | Preserved; new discount UI renders correctly | HIGH |
| Session Credit snapshot | NULL (no snapshot for pre-P3.1) | HIGH — must not crash |
| Activation state (claimed_at) | Preserved; "Resend Activation Email" shown if null | HIGH |

### 4.3 Null Snapshot Edge Cases

Pre-P3.1 purchases have `purchase_credit_snapshots` = NULL/empty.

| Scenario | Expected Behavior |
|---|---|
| View Purchase Details for pre-P3.1 purchase | No "Session Credits" section shown (US6 AC2) |
| Stripe webhook fires for pre-P3.1 purchase | No credit issuance attempted; system checks snapshot and skips |
| View client Balance History for pre-P3.1 purchase | No package-source entries; only manual issuances shown (if any) |
| Null snapshot in DB | No 500 error; no crash; silent skip in issuance logic |

