# Payment — Old Flow Knowledge Base

> **Purpose:** Help AI understand the existing Payment system so it can identify which components,
> constraints, and data flows are affected when a new feature or improvement is introduced.
> Use this file to reason about corner cases, side effects, and regression risks — not just happy paths.

---

## 1. Component Registry

| Component | Platform | Owned By | Key Responsibilities |
|---|---|---|---|
| Payment Setup | Web | Coach | Stripe identity + bank account verification; Meta Pixel toggle; teammate permission grants |
| Payout Engine | Automated (Stripe) | Stripe | Transfers funds to coach's bank every 2 days; auto-pauses on disputes or bank changes |
| Package Management | Web | Coach | Create/publish packages (One-Time, Recurring, Trial); configure pricing, limits, branding, self-cancellation |
| Sequence Engine | Web | Coach | Auto-assigns/removes assets (Autoflow, Resources, Studio Programs, Forums, Workouts) on package activation/expiration |
| Promo Code Engine | Web | Coach | Percentage or fixed-amount discounts applied at checkout; tracks redemption per package |
| Sales Analytics Dashboard | Web | Coach + Admin | Revenue/Client/Package analytics; filter by coach, channel, package, date; 7-day data exports |
| Client Subscriptions & Invoices | Web | Coach | Manage active subscriptions: pause, resume, cancel, refund, retry card, resend request |
| Payment Request | Web | Coach | Email-based checkout link with due date; sent directly to client |
| Coach Bios | Web | Coach | Name, Title, Biography shown on public checkout page |
| Public Package Page | Web (public) | Client | Responsive checkout page; collects contact, card, address, promo code |
| Package Purchased Page | Web (public) | Client | Post-purchase confirmation; shows invoice details; prompts unauthenticated users to activate |
| Client Managing Purchases Page | Web (client.everfit.io) | Client | View active purchases; manage saved cards; self-cancel recurring packages |
| Payment Activity Feed | Web + Mobile | Coach + Client | Centralized log of all transactions; triggers push/in-app notifications selectively |
| Payment Email Engine | Automated | Backend | Sends purchase confirmations, activation alerts, refund receipts, trial alerts, overdue warnings |

---

## 2. Dependency Map

### Package → Subscription → Invoice (Core Chain)
- **Reads from:** Package pricing config, billing cycle, client payment method
- **Writes to:** Subscription record (1 per purchase), Invoice records (1 per billing cycle)
- **Triggers when:** Client completes purchase; each billing cycle renews
- **Downstream impact:** Any change to package pricing or billing cycle affects the subscription and all future invoices generated from it. Existing active subscriptions are NOT retroactively updated if the package is edited after purchase.

### Package → Sequence Engine (Asset Delivery)
- **Reads from:** Sequence mapped to the package at time of purchase
- **Writes to:** Client's assigned assets (Autoflow, Resources, Studio Programs, Forums, Workouts)
- **Triggers when:** Package is activated; assets are removed on expiration
- **Downstream impact:** Sequences CANNOT be edited once the parent package has been purchased. Editing the sequence after first purchase has no effect. Assets are delivered immediately or on the next Monday depending on trigger config.

### Promo Code → Checkout → Invoice
- **Reads from:** Promo code configuration (% or fixed, duration, package scope)
- **Writes to:** Invoice amount at checkout; logged in Promo Redemption tab
- **Downstream impact:** Promo code duration controls how many invoices get the discount (First Purchase / All recurring / N invoices). Changing a promo code after client has applied it does not affect their active discount.

### Loss of Payment Add-on → Active Subscriptions
- **Reads from:** Payment add-on status on coach's account
- **Writes to:** All active client subscriptions under that coach
- **Downstream impact:** Subscriptions pause indefinitely until coach manually resumes them. Trials remain active until their natural expiration. This is a silent side effect — clients are not notified automatically.

### Payout Engine → Bank Account / Dispute State
- **Reads from:** Stripe balance, dispute status, bank account verification state
- **Writes to:** Coach's linked bank account every 2 days
- **Triggers when:** Automatic schedule; disrupted by disputes or bank changes
- **Downstream impact:** Chargeback dispute = payouts pause immediately. Bank account change = verification reset required = payouts pause indirectly. Both states trigger multi-channel alerts (email, in-app, push, internal Slack).

### Self-Cancellation → Subscription → Activity Log + Email
- **Reads from:** Client's self-cancel action on Client Managing Purchases Page
- **Writes to:** Subscription end state (based on billing cycle rules), Activity log
- **Downstream impact:** Self-cancellation is SILENT to coach in the notification system — no push/in-app alert is sent to the coach. Only the activity log records it. Any feature that adds coach visibility into self-cancellations must build against this silent behavior.

---

## 3. Business Constraints

- **BC-001** `[Package]` Package name max length: 90 characters.
- **BC-002** `[Package]` Package types: One-Time, Recurring, Trial. Each has distinct billing behavior.
- **BC-003** `[Package — Trial]` Trial config options: allow 1 sign-up, send reminders 1 day before trial ends.
- **BC-004** `[Sequence]` Sequences CANNOT be edited once the parent package has been purchased by at least one client.
- **BC-005** `[Sequence]` Asset access duration: 1 week, 2 weeks, 1 month, 2 months, 3 months, 6 months, 12 months, or Forever.
- **BC-006** `[Sequence]` Trigger timing: Immediately on activation OR next Monday.
- **BC-007** `[Payout]` Payout cycle: every 2 days. Initial payout minimum delay: 5 days.
- **BC-008** `[Payout]` Payouts auto-pause on: chargeback disputes OR bank account changes (verification reset required).
- **BC-009** `[Payment Add-on — Country]` Only coaches in supported countries can publish packages and receive payouts. Unsupported country coaches can only: connect Stripe, draft packages, and edit bios.
- **BC-010** `[Payment Request]` Due date options: 3, 7, or 14 days. Generates an email link to checkout only.
- **BC-011** `[Promo Code]` Duration options: First Purchase only, All recurring payments, or a specific Number of invoices.
- **BC-012** `[Public Package Page — US only]` "HSA/FSA Eligible" tooltip only displays when user IP is in the US. Not shown for non-US IPs.
- **BC-013** `[Public Package Page]` Address validation is required for US users at checkout. Not required for non-US.
- **BC-014** `[Client Card Management]` A card linked to an active recurring package CANNOT be removed by the client until either a replacement card is set OR the package is cancelled.
- **BC-015** `[Self-Cancellation]` Self-cancellation by client is a SILENT event — no push/in-app notification is sent to the coach. Activity log and email only.
- **BC-016** `[Refund]` Refund action is available for Paid invoices only. Not available for pending, failed, or overdue invoices.
- **BC-017** `[Loss of Add-on]` Subscriptions pause forever; trials remain active until expiration. Neither state notifies clients automatically.
- **BC-018** `[Sales Analytics]` Data export validity: 7 days from export date.
- **BC-019** `[Activation — Not Logged In]` Unauthenticated clients must sign up or log in after purchase to activate the package and receive Sequence assets. Without activation, Sequence is not triggered.
- **BC-020** `[Activation — Logged In]` Authenticated returning clients: package is automatically activated on payment confirmation. No manual activation step.

---

## 4. State Transition Map

### Package States
```
Draft → Published → (Purchased by clients) → (Archived)
```
- **Draft:** Visible to coach only; shareable link not active.
- **Published:** Public link active; purchasable by clients.
- **Purchased:** Sequence is locked — cannot be edited.
- **Archived:** No new purchases; existing subscriptions unaffected.

### Subscription States
```
Active → (Paused | Cancelled | Trial-Cancelled) → Ended
```
- **Active:** Billing cycle running; invoices generated each cycle.
- **Paused:** No billing; client access suspended. Coach can resume.
- **Cancelled (by coach):** Subscription ends based on cycle rules.
- **Self-cancelled (by client):** Same end behavior; SILENT to coach notifications.
- **Trial-Cancelled:** Trial ends without converting to paid subscription.

### Invoice States
```
Pending → Paid | Failed | Overdue
```
- **Paid:** Eligible for refund by coach.
- **Failed:** Coach can retry credit card or resend payment request.
- **Overdue:** Triggers automated email warnings (immediate, 3 days, 5 days).

### Payout States
```
Active (every 2 days) → Paused (dispute or bank change) → Resumed (after resolution)
```
- **Paused by dispute:** Requires admin team to unpause via CMS or backend tools.
- **Paused by bank change:** Requires coach to complete Stripe re-verification.

### Package Purchase Flow — Unauthenticated Client
```
Public Page → Checkout → Payment Submitted → Package Purchased Page → Sign Up/Log In → Activation → Sequence Triggered
```
- Sequence is NOT triggered until activation (sign up/log in) is completed.
- If client never activates, Sequence assets are never assigned.

### Package Purchase Flow — Authenticated Client
```
Public Page → Log In → Checkout (pre-filled) → Payment Submitted → Package Purchased Page → Auto-Activated → Sequence Triggered
```
- No manual activation step. Sequence triggered immediately on payment confirmation.

### Stripe Verification Reset State
```
Bank info changed → Verification reset forced → Payouts paused → Coach re-verifies → Payouts resumed
```
- Payout pause is indirect (not triggered by the system, but by Stripe requiring re-verification).

---
