# Test Cases (Lean) — [Client MP] Enable Client Service Fee
**Scope:** UI tooltip/label rename + sanity check on calculations
**Date:** 2026-05-14 | **QA:** Khai Truong

---

## 1. Checkout — Service Fee Display

**Focus:** Label rename, tooltip text, fee display — both no-discount and discount paths. Step 1→2 merged into 1 TC each.

| ID | Title | Preconditions | Steps | Expected | Priority |
|---|---|---|---|---|---|
| TC-CO-001 | Verify "Service Fee" label, amount, and ❔ tooltip display correctly on Checkout Step 1 → Step 2 (no discount) | Client on Marketplace. Package = $100. No promo code. | 1. Access package via Marketplace → reach Step 1. 2. Verify label, amount, ❔ icon on Step 1. 3. Hover ❔ icon. 4. Proceed to Step 2. 5. Verify same values on Step 2. | Step 1 & 2: Label = **"Service Fee"** (not "Platform Fee"). Amount = $5.00. Total = $105.00. ❔ icon present. Tooltip = *"This fee helps us maintain the platform, provide secure payments, and support your experience on Everfit."* No Subtotal row. | High |
| TC-CO-002 | Verify Subtotal, "Service Fee" label, amount, and Total display correctly on Checkout Step 1 → Step 2 (discount applied) | Client on Marketplace. Package = $100. Valid 10% promo code. | 1. Reach Checkout Step 1. 2. Apply 10% promo code. 3. Verify layout and amounts on Step 1. 4. Proceed to Step 2. 5. Verify same values on Step 2. | Step 1 & 2: Promo Code field below Package Cost. Subtotal = $90.00. Service Fee = $4.50. Total = $94.50. Label = **"Service Fee"**. ❔ icon present. Tooltip same as TC-CO-001. Values identical on both steps. | High |
| TC-CO-003 | Verify "Platform Fee" label does NOT appear anywhere on Checkout (regression) | Client on any Marketplace checkout page. | 1. Access Checkout Step 1 (no discount). 2. Access Checkout Step 1 (with discount). 3. Search for "Platform Fee" text on both pages. | **"Platform Fee"** not present on either page. Only "Service Fee" used. | High |

---

## 2. Payment Success Page → Package Management: Purchase Details Modal

**Focus:** Total on success page, modal field values, label rename, both tooltips.

| ID | Title | Preconditions | Steps | Expected | Priority |
|---|---|---|---|---|---|
| TC-PS-001 | Verify Payment Success page Total includes Service Fee (no discount) | Client completed $100 Marketplace purchase, no promo. | 1. Complete purchase → reach Payment Success page. 2. Check Total displayed. | Total = **$105.00** (Package Cost + Service Fee). Not $100.00. | High |
| TC-PS-002 | Verify Payment Success page Total is correct for discount purchase | Client completed $100 purchase with 10% promo. | 1. Complete purchase with discount → reach Payment Success page. 2. Check Total. | Total = **$94.50** (Subtotal + Service Fee). Not $105.00, not $100.00. | High |
| TC-MD-001 | Verify Purchase Details Modal: "Service Fee" label, ❔ tooltip, and ℹ️ tooltip on Total are correct (no-discount purchase) | Client purchased $100 Marketplace package, no discount. | 1. Navigate to Manage Package → open Purchase Details modal. 2. Check label next to fee amount. 3. Hover ❔ icon on Service Fee. 4. Hover ℹ️ icon on Total. | Label = **"Service Fee"** (not "Platform fee"). ❔ tooltip = *"This fee helps us maintain the platform, provide secure payments, and support your experience on Everfit."* ℹ️ tooltip = *"Package price may not reflect applied discounts. Check your individual invoice for discounted totals."* | High |
| TC-MD-002 | Verify Purchase Details Modal shows correct amounts: Package Cost = original, Service Fee = actual charged, Total = original + actual fee (discount purchase) | Client purchased $100 Marketplace package with 10% discount. Actual paid = $94.50. | 1. Open Purchase Details modal. 2. Check Package Cost, Service Fee, Total fields. | Package Cost = **$100.00** (original, pre-discount). Service Fee = **$4.50** (actual charged = 5% × $90). Total = **$104.50** (= $100 + $4.50). Discount NOT shown. "Platform fee" label NOT present. | High |
| TC-MD-003 | Verify "Platform fee" label does NOT appear in Purchase Details Modal (regression) | Client with any Marketplace purchase, modal open. | 1. Open Purchase Details modal. 2. Check fee label. | Label = "Service Fee". **"Platform fee" does not appear** anywhere in the modal. | High |

---

## 3. Invoice & Client Emails & Coach Emails

**Focus:** Label rename (Service Fee vs Platform Fee) + sanity check Total amount per email type. Format: data-driven table — no step-by-step.

### 3a. Invoice

| ID | Surface | Check | Expected | Priority |
|---|---|---|---|---|
| TC-INV-001 | Invoice (post-purchase) | Label of fee line | **"Marketplace Service Fee"** (not "Marketplace Platform Fee") | High |
| TC-INV-002 | Invoice (post-purchase, $100 no discount) | Fee amount + Total | Service Fee = $5.00. Total = $105.00. | High |

### 3b. Client Emails

**Formula:** Total = Package Cost − Discount + Service Fee (i.e. Subtotal + Service Fee)

| ID | Email Type | Trigger | Label Check | Total (example: $100, no discount) | Priority |
|---|---|---|---|---|---|
| TC-CE-001 | First-time purchase | Client completes first Marketplace purchase | "Service Fee" present, "Platform Fee" absent | $105.00 | High |
| TC-CE-002 | Recurring payment | Auto-billing cycle fires | "Service Fee" present | $105.00/cycle | High |
| TC-CE-003 | Failed payment | Payment attempt fails | "Service Fee" present | $105.00 (attempted amount) | High |
| TC-CE-004 | Overdue 3 days | 3 days past due | "Service Fee" present | $105.00 | Medium |
| TC-CE-005 | Overdue 5 days | 5 days past due | "Service Fee" present | $105.00 | Medium |
| TC-CE-006 | Trial join | Client joins trial package | "Service Fee" present | $105.00 | Medium |
| TC-CE-007 | Success after trial | Trial converts to paid | "Service Fee" present | $105.00 (actual charge) | High |

### 3c. Coach Emails

**Formula:** Total = Package Cost − Discount (NO Service Fee)

| ID | Email Type | Trigger | Label Check | Total (example: $100, no discount) | Total (example: $100, 10% discount) | Priority |
|---|---|---|---|---|---|---|
| TC-CCH-001 | First-time purchase notification | Client purchases via Marketplace | "Service Fee" NOT present | $100.00 | $90.00 | High |
| TC-CCH-002 | Recurring payment notification | Auto-billing cycle fires | "Service Fee" NOT present | $100.00/cycle | $90.00/cycle | High |
| TC-CCH-003 | Trial + success after trial | Trial join / conversion | "Service Fee" NOT present | $100.00 | $90.00 | Medium |

---

## 4. Service Fee Calculation & Rounding

**Format:** Data table — verify displayed Service Fee and Total match expected values exactly. No step-by-step.
**Setup:** Access package at given price via Marketplace checkout → apply promo if applicable → read Service Fee and Total displayed.
**Ground truth:** DS4 calculation tables provided by QA.

### 4a. No Discount Applied

| # | Package Price ($) | Expected Service Fee ($) | Expected Total ($) | Raw Fee (pre-round) | Note |
|---|---|---|---|---|---|
| 1 | 100.00 | 5.00 | 105.00 | 5.000 | Clean value |
| 2 | 12.65 | 0.63 | 13.28 | 0.6325 | Round down (3rd dp = 2) |
| 3 | 55.54 | 2.78 | 58.32 | 2.777 | Round up (3rd dp = 7) |
| 4 | 250.99 | 12.55 | 263.54 | 12.5495 | Round up (3rd dp = 9) |
| 5 | 99.99 | 5.00 | 104.99 | 4.9995 | Round up (3rd dp = 9) |
| 6 | 12.69 | 0.63 | 13.32 | 0.6345 | Round down (3rd dp = 4) |
| 7 | 15.49 | 0.77 | 16.26 | 0.7745 | Round down (3rd dp = 4) |
| 8 | 87.33 | 4.37 | 91.70 | 4.3665 | Round up (3rd dp = 6) |
| 9 | 199.99 | 10.00 | 209.99 | 9.9995 | Round up (3rd dp = 9) |

> **Pass criteria:** Displayed Service Fee and Total on checkout = expected values in table above.

### 4b. Discount Applied

| # | Package Price ($) | Discount (%) | Discount Amount ($) | Subtotal ($) | Expected Service Fee ($) | Expected Total ($) | Raw Fee (pre-round) | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | 100.00 | 10% | 10.00 | 90.00 | 4.50 | 94.50 | 4.500 | Clean |
| 2 | 12.65 | 15% | 1.90 | 10.75 | 0.54 | 11.29 | 0.5375 | Round up |
| 3 | 55.54 | 20% | 11.11 | 44.43 | 2.22 | 46.65 | 2.2215 | Round up |
| 4 | 250.99 | 25% | 62.75 | 188.24 | 9.41 | 197.65 | 9.412 | Round down |
| 5 | 99.99 | 30% | 30.00 | 69.99 | 3.50 | 73.49 | 3.4995 | Round up |
| 6 | 12.69 | 50% | 6.35 | 6.34 | 0.32 | 6.66 | 0.317 | Per DS4 |
| 7 | 5.00 | 99% | 4.95 | 0.05 | 0.00 | 0.05 | 0.0025 | Near-zero fee rounds to $0.00 |
| 8 | 15.49 | 10% | 1.55 | 13.94 | 0.70 | 14.64 | 0.697 | Round up |
| 9 | 87.33 | 5% | 4.37 | 82.96 | 4.15 | 87.11 | 4.148 | Round up |
| 10 | 199.99 | 7% | 14.00 | 185.99 | 9.30 | 195.29 | 9.2995 | Round up |

> **Pass criteria:** Displayed Subtotal, Service Fee, and Total on checkout = expected values in table above.
> **Key rule being verified:** Service Fee is calculated on **Subtotal** (discounted price), NOT on original Package Price.

---

## 5. Recurring Subscription Billing

**Focus:** Fee present on Cycle 1 and Cycle 2. Discount persists on Cycle 2 if applicable.

| ID | Title | Setup | Cycle | Expected Stripe Charge | Expected Client Email Total | Priority |
|---|---|---|---|---|---|---|
| TC-RC-001 | Verify Service Fee included in Cycle 1 charge (no discount) | Active monthly subscription, $100, no promo. | Cycle 1 | $105.00 | $105.00 — "Service Fee" label present | High |
| TC-RC-002 | Verify Service Fee included in Cycle 2 charge (no discount) — fee not dropped | Same subscription as TC-RC-001, after Cycle 1. | Cycle 2 | $105.00 | $105.00 — "Service Fee" label present | High |
| TC-RC-003 | Verify Service Fee in Cycle 1 uses discounted base (with discount) | Active monthly subscription, $100, 10% discount. | Cycle 1 | $94.50 (Subtotal $90 + Fee $4.50) | $94.50 | High |
| TC-RC-004 | Verify discount persists and Service Fee still uses discounted base on Cycle 2 | Same subscription as TC-RC-003, after Cycle 1. | Cycle 2 | $94.50 — discount NOT dropped | $94.50 — "Service Fee" $4.50, not $5.00 | High |

---

## Summary

| Section | TCs | Format |
|---|---|---|
| Checkout Display | 3 | Step-by-step |
| Payment Success + Modal | 5 | Step-by-step |
| Invoice | 2 | Data table |
| Client Emails | 7 | Data table |
| Coach Emails | 3 | Data table |
| Calculation (No Discount) | 9 rows | Data table |
| Calculation (With Discount) | 10 rows | Data table |
| Recurring Billing | 4 | Condensed table |
| **Total** | **43** | |

**Reduction vs full TC set:** 116 → 43 TCs (~63% reduction)
**Coverage maintained for:** Label rename (all surfaces), tooltip text (checkout + modal), Total calculation sanity, rounding boundary cases, discount base rule, recurring fee persistence, coach email isolation.
