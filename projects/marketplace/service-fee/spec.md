### Overview

This feature enables a 5% client Service Fee (previously called "Platform Fee") on all Marketplace package purchases to create an additional revenue stream for Everfit. The scope covers renaming "Platform Fee" → "Service Fee" across the ecosystem, ensuring correct calculation and display on Checkout, Package Management, Invoices, and Stripe Management.

**Source Specs:**
- [Launch May 20 – Enable Client Service Fee](https://everfit.atlassian.net/wiki/x/8oHV2w)
- [HS – Marketplace Platform Fee (Calculation Reference)](https://everfit.atlassian.net/wiki/x/FICvr)

---

### Glossary

| Term | Definition |
|---|---|
| Package Cost | The package price that the Coach sets up in the Package Overview |
| Service Fee | 5% of the Package Cost (or Discounted Package Cost if a promo code is applied). Formerly called "Platform Fee" |
| Subtotal | Package Cost minus Discount (when a promo code is applied) |
| Final Price (Total) | Subtotal + Service Fee |
| Discounted Package Cost | Package Cost minus the discount amount from a promo code |
| One-Time Purchase | Single-charge package purchase |
| Recurring Subscription | Subscription-based package purchase with recurring billing cycles |

---

### Permissions / Business Rules

* Service Fee rate is **5%** of the Package Cost (or Discounted Package Cost when promo code is applied).
* Calculation formula: `Service Fee = 5% × Package Cost` (or `5% × Discounted Package Cost`).
* Final Price formula: `Total = Package Cost (or Subtotal) + Service Fee`.
* Currency rounding: numbers are rounded to **two decimal places**; calculation is performed to the **third decimal place**.
  * Example: $12.6495 → $12.65
  * Example: $12.6445 → $12.64
  * Example: $12.6444 → $12.64
* The Service Fee is collected by **Everfit**, not the Coach.
* The Service Fee is collected through **3 Marketplace channels only**: Marketplace Homepage, Direct Link (MP), Trainer Match Tool.
* The Service Fee is **NOT** collected through the Direct Link of the **Core platform**.
* The Coach **cannot** view the Service Fee on their Pro website.
* Coach Revenue is **NOT** affected by the Service Fee — Revenue and invoice amounts on Coach-facing pages reflect **Package Cost only** (Sales Dashboard → Revenue tab, Package List revenues, Package Analytics, Coach email of client purchases).
* The client is responsible for paying the Final Price for **each purchase**, including both one-time purchases and recurring billing cycles.
* When a discount promo code is applied, the Service Fee is calculated on the **Discounted Package Cost**, not the original Package Cost.
* Tooltip text for Service Fee ❔ icon: _"This fee helps us maintain the platform, provide secure payments, and support your experience on Everfit."_ (new spec). Referenced spec tooltip: _"This fee covers direct billing support from Everfit, plus portal access to managing packages, invoices, reviews, and more."_ — **QA should verify which tooltip is used in the final build.**
* Tooltip text for Total ℹ️ icon (Manage Package modal): _"Package price may not reflect applied discounts. Check your individual invoice for discounted totals."_
* "Marketplace Platform Fee" label is **renamed** to "Marketplace Service Fee" on invoices.
* "Platform Fee" label is **renamed** to "Service Fee" on all client-facing surfaces.

---

### US1: As Everfit Team, we want to enable Service Fee once a client purchases a package so that Everfit will have another revenue stream

---

#### AC1: Change "Platform Fee" to "Service Fee" on Checkout page

* Given: I am a client visiting the checkout page (purchase package step 1 or step 2)
* When: I view the checkout page
* Then:
  * The system displays **"Service Fee"** instead of "Platform Fee"
  * The system displays the "Service Fee" in **enabled state** with the Service Fee amount calculated as `5% × Package Cost`
  * The system displays a **❔ icon** next to the Service Fee label
  * On hover of the ❔ icon, the system shows a tooltip: _"This fee helps us maintain the platform, provide secure payments, and support your experience on Everfit."_

---

#### AC1-sub1: Display Service Fee on Checkout Step 1 — No Discount Applied

* Given: The client is on purchase package **step 1** and has **not** applied a promo code
* When: The client views the payment details block
* Then:
  * The system displays **Service Fee** and **Total** under the payment details block
  * Service Fee = `5% × Package Cost`
  * Total = `Package Cost + Service Fee`
  * Currency is rounded to **2 decimal places** (calculation to 3rd decimal place)
  * The ❔ icon next to Service Fee is displayed with hover tooltip

---

#### AC1-sub2: Display Service Fee on Checkout Step 2 — No Discount Applied

* Given: The client is on purchase package **step 2** and has **not** applied a promo code
* When: The client views the payment summary
* Then:
  * The system displays **Service Fee** and **Total** right under the Package Cost (Recurring Subscription or One Time)
  * All calculation logic is the same as Step 1

---

#### AC1-sub3: Display Service Fee on Checkout Step 1 — Discount Applied

* Given: The client is on purchase package **step 1** and has **applied** a promo code
* When: The client views the payment details block
* Then:
  * The Promotion Code field moves **below** the Package Cost
  * The system displays **Subtotal** above the **Service Fee**
  * Subtotal = `Package Cost − Discount`
  * Service Fee = `5% × Subtotal` (i.e., calculated on the **discounted** package cost)
  * Total = `Subtotal + Service Fee`
  * Example — 10% Discount:
    * Package Cost: $100
    * Discount (10%): $10
    * Subtotal (Discounted Package Cost): $90
    * Service Fee (5% of $90): $4.50
    * Total: $94.50
    * Coach Earnings: $90 (less Stripe fees and intro fee if applicable)
    * Everfit Earnings: $4.50

---

#### AC1-sub4: Display Service Fee on Checkout Step 2 — Discount Applied

* Given: The client is on purchase package **step 2** and has **applied** a promo code
* When: The client views the payment summary
* Then:
  * The system displays **Subtotal**, **Service Fee**, and **Total** right under the Promo Code section
  * All calculation logic is the same as Step 1 with discount

---

#### AC1-sub5: Display Total Price on Payment Success Page

* Given: The client has completed a package purchase (with or without discount)
* When: The Payment Success page is displayed
* Then:
  * The "Total" displays the total of Package Cost (or Subtotal) + Service Fee
  * No UI layout update is required (existing layout)

---

#### AC2: Service Fee charged with package subscription

* Given: I (client) purchase a package (one-time or recurring subscription)
* When: The payment is made
* Then:
  * The system charges the client the **Total amount including Service Fee**
  * The Service Fee is displayed on the **Stripe Management page**

---

#### AC3: Service Fee displays on Package Management page

* Given: I am a client who has already purchased a package
* When: I view my Package Management page
* Then:
  * The system displays "Service Fee" in **enabled state** with the charged amount for packages purchased with the Service Fee
  * For packages purchased when the Service Fee was **waived**, the system displays the accurate waived state

---

#### AC3-sub1: View Service Fee on Purchase Details Modal (with or without discount)

* Given: I am a client viewing the Purchase Details modal on the Manage Package page
* When: The modal is open
* Then:
  * A new block of package price details is displayed under the original block:
    * **Package Cost**: the original package cost at time of purchase
    * **Service Fee**: 5% of the Package Cost
    * **Total**: Package Cost + Service Fee
  * The ❔ icon next to **Service Fee** shows tooltip on hover: _"This fee covers direct billing support from Everfit, plus portal access to managing packages, invoices, reviews, and more."_
  * The ℹ️ icon next to **Total** shows tooltip on hover: _"Package price may not reflect applied discounts. Check your individual invoice for discounted totals."_
  * **Payment Summary** reflects the total of Package Cost + Service Fee (excludes discount)
    * Recurring payment → Payment Schedule section
    * One-time payment → Payment Info section
  * For discounted purchases: the modal displays **Package Cost before discount** and does **NOT** display the discount amount in the Purchase Details modal
  * The Package Card displays the Total (Package Cost + Service Fee), excluding Discount cost if any

---

#### AC3-sub2: Request Billing Support link on Purchase Details Modal

* Given: I am a client viewing the Purchase Details modal
* When: I scroll to the bottom of the modal
* Then:
  * A text link **"Request billing support"** is displayed at the bottom
  * On click, the system redirects to the **Help Center page** (Intercom)

---

#### AC4: Display Service Fee on Purchase Invoice

* Given: I am a client who purchased a package on Marketplace
* When: I receive the invoice of the purchase
* Then:
  * The Service Fee is displayed on the Invoice
  * The label **"Marketplace Platform Fee"** is replaced with **"Marketplace Service Fee"**

---

#### AC4-sub1: Display Total Price in Client Emails

* Given: I am a client who has purchased/is subscribing to a package
* When: I receive any of the following emails:
  * Email of first-time purchase package
  * Email of recurring payment
  * Email of joining trial package
  * Email of failed payment
  * Email of overdue 3 days
  * Email of overdue 5 days
* Then:
  * The "Total" in the email displays the total of Package Cost + Service Fee
  * The label reads **"Service Fee"** (not "Platform Fee")

---

### Cross-Cutting Test Scenarios (derived from business rules)

---

#### SC1: Service Fee NOT collected via Core Platform Direct Link

* Given: A client accesses a package via the **Direct Link of the Core platform** (not Marketplace)
* When: The client proceeds to purchase
* Then:
  * The system does **NOT** charge or display any Service Fee

---

#### SC2: Service Fee collected only via Marketplace channels

* Given: A client accesses a package via one of the 3 Marketplace channels (Homepage, Direct Link, Trainer Match Tool)
* When: The client proceeds to purchase
* Then:
  * The system charges and displays the 5% Service Fee

---

#### SC3: Coach cannot view Service Fee

* Given: I am a Coach
* When: I view my Pro website, Sales Dashboard (Revenue tab), Package List (Last 30 days / All time Revenue), Package Analytics (Customer Information modal, revenues), or client purchase emails
* Then:
  * The Service Fee is **NOT** visible
  * Revenue reflects **Package Cost only** (not including Service Fee)

---

#### SC4: Currency rounding validation

* Given: A package cost results in a Service Fee with more than 2 decimal places
* When: The Service Fee is calculated
* Then:
  * The displayed value is rounded to **2 decimal places** using the 3rd decimal place for rounding
  * $12.6495 → **$12.65**
  * $12.6445 → **$12.64**
  * $12.6444 → **$12.64**

---

#### SC5: Recurring billing includes Service Fee

* Given: A client has an active recurring subscription
* When: Each billing cycle is charged
* Then:
  * The system charges the **Total (Package Cost + Service Fee)** for each recurring cycle