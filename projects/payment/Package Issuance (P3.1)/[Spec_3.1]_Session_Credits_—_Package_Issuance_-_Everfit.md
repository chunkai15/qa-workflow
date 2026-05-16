### Overview

Session Credits P3.1 — Package Issuance: Build automated session credit issuance through the Package system, so that credits are issued without manual coach intervention when a client purchases or renews a package.

### Glossary

* **WS** — Workspace
* **PP** — Payment & Packages (add-on)
* **One-time package** — Package purchased with a single payment
* **Recurring package** — Package purchased with a subscription (billing cycle)
* **Fixed-term recurring** — Recurring subscription that ends after a set number of invoices
* **Forever recurring** — Recurring subscription that never expires
* **Free Trial** — A trial period before the first paid billing cycle
* **Session Credit** — Credits issued to a client to book paid sessions
* **Billing Cycle** — The recurring interval (e.g., 1 month, 2 weeks)
* **Promo Code** — Discount code applied to a purchase
* **Package Snapshot** — The package configuration at the time of purchase (used for issued credits)

### Permissions / Business Rules

* WS must have the Booking feature enabled
* WS must have the Payment & Packages add-on ON
* Coach must be Owner, Admin, or Trainer
* Session type must be active and have "Require session credit" enabled to be selectable in package configuration
* Client must be connected for automated credit issuance to apply to their account
* Max 5 session types per package
* Credit amount per session type: min 1, max 100
* Billing cycle number: min 1, max 12
* No credits issued during free trial period
* No credits issued when Booking feature is disabled
* Credit configuration changes only apply to future purchases (not existing)
* Archived client does not block credit issuance — credits continue as normal
* Expiration starts from the first day of the billing cycle, NOT the payment successful date (except one-time without trial: starts from payment date)

### US1: As a Coach, I want to set a package to automatically issue session credits at purchase and/or each renewal, so that I don't have to manually issue credits every time a client buys or renews.

**Pre-condition:**
* WS has the Booking feature enabled
* The Payment and packages is available for WS
* Coach has permission to access the Payment & packages feature

#### AC1: Update UI for package pricing pop-up when WS hasn't set up payment

* Given: WS hasn't setup payment for Payment & Packages
* When: I click on "Add Pricing" button from Package overview page
* Then:
  * Show Package Pricing pop-up with updated UI
  * Title: "Package Pricing"
  * Image: Illustration of Pricing plan
  * Text: "To enable payments, **please connect your Stripe account**"
  * Button: "Connect Stripe"
  * Click on "Connect Stripe" opens the "Choose Your Country" pop-up

#### AC2: Update UI for Choose Country pop-up

* Given: WS hasn't setup payment for Payment & Packages
* When: I click on "Add Pricing" button from Package overview page OR I go to Payment Setup page and click "Connect Stripe"
* Then:
  * Update the UI of Choose Your Country with new component
  * Add X button
  * Add title "Country"
  * Update the component for Country dropdown
  * Update hover/click behavior

#### AC3: Update UI of Create New Package pop-up

* Given: WS has the PP add-on ON AND I have permission to access PP
* When: I click on Create Package button
* Then:
  * See UI of "Create New Package" updated with new component
  * Font updated
  * Font size updated
  * Text box updated
  * Add "Cancel" button
  * Update "Create New" to "Create Package" button

#### AC4: Update UI of Pricing component

* Given: WS has the PP add-on ON AND I have permission to access PP
* When: I click on Create Package button AND Package is created successfully
* Then:
  * The Add Pricing button should be updated
  * Default state updated
  * Hover state updated
  * No edit icon (design's note)

#### AC5: Update UI for Package Pricing pop-up when payment is set up

* Given: WS has set up payment for Payment & Packages
* When: I click on the "Add Pricing" button from the Package overview page
* Then:
  * Title: "Package Pricing"
  * "Pricing Plan" section with icon + "Pricing Plan"
  * Description: "Price your package as a one-time payment or recurring subscription"
  * "Pricing model" dropdown — Placeholder: "Select pricing model"
  * "Price" field — Placeholder: "{currency symbol}", shows Currency of payment
  * "Free Trial" section with icon + "Free Trial" + tooltip
  * Tooltip text: "Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically cancelled."
  * Description: "Allow clients to try out your package before committing to payment"
  * Toggle: Default OFF
  * "Session Credit" section with icon + "Session Credits" + tooltip + tag "NEW"
  * Tooltip text: "Credits issued upon successful payment and purchase activation: One-time: Issued once / Recurring: Issued every billing cycle"
  * Description: "Issue session credits to schedule paid sessions with your clients"
  * Toggle: Default OFF
  * "Cancel" button — click to close pop-up
  * "Update Pricing" button — disabled by default, enabled when all required Pricing fields are valid (regardless of Session Credits data)
  * X button — click to close pop-up

#### AC6: Pricing model dropdown options

* Given: Coach has the Package Pricing pop-up open
* When: Coach clicks on the "Pricing model" dropdown
* Then:
  * Show 2 options: "One-time Payment" and "Recurring Subscription"
  * Hover: highlight the background
  * Click on option to select — selected model is populated in the field

#### AC7: Enter Price for plan

* Given: I am on the Package Pricing pop-up AND I have selected a pricing model
* When: I type a value in the Price field
* Then:
  * Input is shown in the box
  * Validation: keep as current
  * Border highlighted in blue if valid
  * If invalid: border highlighted in red, show error, disable Update Price button
  * Error messages: "Minimum value is {min value}." / "Maximum value is {max value}."
  * Enable button if coach enters new valid number

#### AC8: Show Billing Cycle and Expiration for Recurring Subscription

* Given: I am on the Package Pricing pop-up
* When: I select "Recurring Subscription" from the Pricing model dropdown
* Then:
  * 2 more fields shown beside the price field
  * "Billing cycle": Text box (only number, validation as current) + Cycle dropdown ("Weeks" and "Months")
  * "Expiration": Dropdown with "Never" (default) and "Ends after"

#### AC9: Enter Billing cycle for recurring subscription

* Given: I am on the Package Pricing pop-up AND I have selected "Recurring Subscription"
* When: I enter a value in the billing cycle field and select a cycle unit
* Then:
  * Show the number input
  * If number = 0: show error "Minimum value is 1." and disable "Update Pricing" button
  * If number > 12: show error "Maximum value is 12." and disable "Update Pricing" button

#### AC10: Select expiration for billing cycle

* Given: I am on the Package Pricing pop-up AND I have selected "Recurring Subscription"
* When: I click on expiration dropdown
* Then:
  * Selected value has a checkmark
  * Hover options: highlight background
  * Click to select, selected option is fulfilled to the box
  * If "Ends after": show invoices field (default 2), validation as current; show "Total: {currency}{amount} Over {x} {cycle}" (don't show if price/billing cycle not fulfilled)
  * If change to "Never": hide Invoiced fields and total/over value

#### AC11: Update UI for turning on Free Trial toggle

* Given: I am on the Package Pricing pop-up
* When: I turn the Free Trial toggle ON
* Then:
  * Free Trial configuration section expands with updated UI
  * "Free Trial" + tooltip: "Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically canceled."
  * Explanation: "Allow clients to try out your package before committing to payment"
  * Free Trial Period dropdown: default 7 days (as current)
  * Checkbox: "Archive client when cancelling a package within the trial period" — default checked
  * Checkbox: "Allow client to sign up for a trial once" — default checked

#### AC12: Show session credit configuration when toggle ON

* Given: I am on the Package Pricing pop-up AND the Free Trial is OFF
* When: I turn the Session Credits toggle ON
* Then:
  * Default: show 1 Session type row
  * Session type dropdown: Placeholder "Select a session type", data = all active session types of all users that require credit
  * Credit field: default 1, only number, min 1, max 100, required
  * Expiration dropdown: default "Expires after" + textbox + duration default "months"
  * "Add Session Credits" button — click to add 1 more session type row below last row
  * Show "Delete" button when 2+ rows; hover: highlight icon + tooltip "Delete"; click: remove row; hide delete if only 1 row left

#### AC13: Show the selected session type

* Given: I am on the Package Pricing pop-up
* When: I have selected a session type from the dropdown
* Then:
  * Selected session type populated to field with: Color of session type, Name
  * Long name: show 1 row only, cut off with "…"

#### AC14: Add multiple Session types

* Given: I am on the Package Pricing pop-up AND I have the Session Credits section open
* When: I add session type rows
* Then:
  * Max 5 session types
  * Selected session type not shown in dropdown again (each type once only)
  * At 5 types: disable "Add Session Credits" button
  * Hover disabled button: tooltip "Session types limit reached (5/5)"

#### AC15: Message when both Trial and Session Credit toggle ON

* Given: I am on the Package Pricing pop-up
* When: I have turned ON both the Free Trial toggle and the Session Credits toggle
* Then:
  * Show message in Session Credit section: icon + "Credits will be added to client account **after the free trial ends** and the first payment is successfully processed."

#### AC16: Validation errors for session credit fields

* Given: I am on the Package Pricing pop-up AND I have the Session Credits section open with incomplete or invalid data
* When: I leave fields empty or enter invalid values
* Then:
  * All invalid fields highlighted in red border
  * "Update Pricing" button disabled until all required fields are valid
  * Empty session field: "Please selecte session type"
  * Empty credit: "Please set a number of credits."
  * Empty duration: "Please set a duration."
  * Credit amount = 0: "Amount must be greater than 0."
  * Credit amount > 100: "Amount must not exceed 100."
  * Invalid expiration: refer to P1.1 expiration validation rules

#### AC17: Handle invalid data after clicking "Update Pricing"

* Given: I am on the Package Pricing pop-up
* When: I click "Update Pricing" with data that has become invalid (e.g., session type deactivated in another tab — session type isn't active or doesn't require credit)
* Then:
  * Show toast: "A session type is no longer available. Please try again."
  * Remove the inactive session type from the pop-up
  * Highlight session type box with invalid data in red: "Please select session type."
  * Update Pricing button disabled until all required fields input

#### AC18: Turn OFF toggle — collapse to default

* Given: I am on the Package Pricing pop-up AND I have turned ON the Free Trial or Session Credits toggle
* When: I turn the toggle OFF
* Then:
  * The UI collapses to default status of Free Trial or Session Credits

#### AC19: Show loading status when saving

* Given: I am on the Package Pricing pop-up
* When: I click "Update Pricing" with valid data
* Then:
  * Loading animation in the Update Price button
  * Disable all buttons on the Package Pricing pop-up

#### AC20: Update UI for Pricing component after saving

* Given: I am on the Package overview page AND I have saved pricing successfully
* When: I'm viewing the Pricing component
* Then:
  * Show "PRICING PLAN" block below Pricing and edit button
  * Title: "PRICING PLAN"
  * Currency (e.g., USD, AUD)
  * Format: {Currency sign}{Amount}/{cycle} . {number of invoices} times
  * One-time example: USD $1,000.00 one time
  * Recurring fixed-term example: USD $1,000.00 / 3 months . 4 times
  * Recurring forever example: USD $1,000.00 / month
  * If package has trial: show tag "{x}-DAY TRIAL"
  * Edit icon: hover to highlight, click to navigate to Package Pricing to update

#### AC21a: Show Session Credits block on package overview

* Given: Coach is viewing a package in the workspace AND the package has session credit issuance enabled AND session types are set AND pricing is saved
* When: I view the package overview
* Then:
  * Show "SESSION CREDIT" block below "PRICING PLAN" block
  * Title: "SESSION CREDIT" + icon
  * Tooltip based on type: Recurring: "Session credits are issued every billing cycle after successful payment and initial purchase activation." / One-time: "Session credits are issued once after successful payment and purchase activation."
  * List of session types in 3 columns: SESSION TYPE (color + name, long name cut off "…"), AMOUNT (coin icon + quantity), EXPIRATION ("in {n} {period}" e.g., "in 1 month", "in 3 weeks", "in 365 days")
  * Hover over each row: highlight background
  * Click row: show Session type details pop-up (as P1.1)
  * Edit icon: hover to highlight, click to navigate to Package Pricing
  * Don't show session credit block if no session type set in package pricing

#### AC21b: Click on Session Type row to show details

* Given: Coach is viewing a package with session credit enabled AND session types are set and saved
* When: I click on a session type row
* Then:
  * Show Session type details pop-up as Session Credit P1.1 Expiration spec

### US2: As a Coach, I want to edit a package's session credit configuration at any time, so that I can update credit rules and have them apply to future purchases.

#### AC1: Pricing model field disabled for published package

* Given: I am on the Package Pricing pop-up of a package that has been published
* When: I open the pop-up to edit pricing
* Then:
  * The pricing model field should be disabled

#### AC2: All session credit fields are always editable

* Given: I am on the Package overview with edit mode
* When: I open the pop-up to edit pricing
* Then:
  * All session credit fields (toggle, session types, quantities, expiration rules) are editable

#### AC3: Save unpublished package — no confirmation needed

* Given: I am on the Package overview with edit mode AND the package hasn't been published before
* When: I click "Update Pricing" with valid data
* Then:
  * Changes are saved immediately with no confirmation pop-up

#### AC4: Save published package — show confirmation pop-up

* Given: I am on the Package overview with edit mode AND the package has been published
* When: I click "Update Pricing" with valid data
* Then:
  * Confirmation pop-up shown
  * Title: "Confirm Package Pricing Update"
  * Description varies by what changed:
    * Only pricing plan: "You are changing the Pricing Plan for this package. The changes will take effect as soon as the package is published."
    * Only session credits: "You are changing the Session Credits for this package. The changes will take effect as soon as the package is published."
    * Only free trial: "You are changing the Free Trial for this package. The changes will take effect as soon as the package is published."
    * Combo: "You are changing the Pricing Plan, Free Trial, and Session Credits for this package. The changes will take effect as soon as the package is published."
  * Note: "This change will not affect recurring payments for existing clients."
  * "Cancel" button — dismiss pop-up, return to Package Pricing without saving
  * "Confirm" button — proceed with saving

#### AC5: Changes apply to future purchases only

* Given: I am on the Edit Package Pricing pop-up
* When: Coach has confirmed the savings on a package for changes
* Then:
  * Updated information shown in Overview Pricing component
  * New purchases use the updated session credit configuration
  * Existing purchases are NOT affected

#### AC6: Block publishing if inactive session type in credit rules

* Given: I am on the Edit Package Pricing pop-up AND I click "Update Pricing" with valid data
* When: In another tab, I archive or turn off "Require session credit" for a session type AND I go back to publish the package that includes that session type
* Then:
  * Coach is blocked from publishing
  * Publish button is NOT disabled — coach can click it to see error
  * Toast: "Can't publish. A session credit rule is tied to an inactive session type. Please activate the session type or update the rule to continue."
  * If coach fixes the issue, they can publish successfully

### US3: Redefine the Status of Purchase and Its function on the Package/Analytics page

**Important note:** We are changing the status name/color/style here. We are NOT changing anything about the actions on the Package/Analytics page. This is documentation of what should be there.

#### AC1: Active status

* Given: The purchase is active (one-time: stays active until coach changes status; recurring: active as long as not another status)
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Active"
  * Actionable buttons for recurring: Purchase Detail, Message Client (only if client is connected), Pause Subscription, Mark as Cancelled
  * Actionable buttons for one-time: Purchase Detail, Message Client (only if client is connected), Mark as Cancelled

#### AC2: Free Trial status

* Given: Client started a trial from the package link (no invoice yet) OR client started a free trial from Payment request (pending invoice below)
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Free Trial"
  * Actionable buttons (both recurring and one-time): Purchase Detail, Message Client (only if client is connected), Cancel Trial

#### AC3: Overdue status

* Given: There is an overdue invoice AND the purchase is not cancelled, expired, paused, expires soon, or cancels soon (other statuses take priority)
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Overdue"
  * Actionable buttons (recurring only): Purchase Detail, Message Client (only if client has account ID — connected or archived connected), Pause Subscription, Cancel Subscription

#### AC4: Paused status

* Given: Purchase is paused
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Paused"
  * Only recurring packages can be paused
  * Actionable buttons: Purchase Detail, Message Client (only if client has account ID), Resume Subscription, Cancel Subscription

#### AC5: Expires Soon status

* Given: The fixed-term recurring purchase has passed the last renewal invoice but hasn't ended
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Expires Soon"
  * Purchase is in the last billing cycle of its fixed-term. Last invoice already created. Package technically active but highlighting it is about to end naturally.
  * Actionable buttons (recurring only): Purchase Detail, Message Client (only if client has account ID), Cancel Subscription

#### AC6: Expired status

* Given: The fixed-term recurring purchase ended
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Expired"
  * The fixed-term package is no longer active; it reached natural expiration (not cancelled)
  * No actionable buttons

#### AC7: Cancels Soon status

* Given: Purchase is scheduled to cancel by coach or client
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Cancels Soon"
  * Only recurring packages have this status (one-time uses "Mark as cancel" → cancelled immediately)
  * Purchase scheduled to be cancelled at next renewal, technically active
  * Actionable buttons: Purchase Detail, Message Client (only if client has account ID), Reactivate

#### AC8: Cancelled status

* Given: Purchase met the schedule cancel date OR failed payment after trial
* When: I view the purchase on Package/Analytics page
* Then:
  * Status shown: "Cancelled"
  * The package is no longer active, cancelled by coach or client
  * Failed payment at end of trial also = Cancelled
  * Actionable button: Purchase Detail only

#### AC9: Cancels Soon and Expires Soon in Active filter

* Given: Package has Cancels Soon and/or Expires Soon status
* When: I view the Active Purchases tab filter
* Then:
  * Cancels Soon and Expires Soon purchases should stay in the Active Purchases tab

### US4: As a Coach, I want to view the updated UI of a purchase details pop-up.

#### AC0.1: Summary of Logic and actionable buttons in Purchase details

* Given: Any purchase status
* When: I open Purchase details pop-up
* Then:
  * Active: Pause (recurring only) + Cancel
  * Free Trial: Cancel
  * Overdue: Pause + Cancel (overdue invoice present)
  * Paused: Resume + Cancel
  * Expires Soon: Cancel
  * Expired: No actionable buttons
  * Cancels Soon: Reactivate
  * Cancelled: No actionable buttons
  * No status (payment request not started): No actionable buttons

#### AC0.2: Summary of invoice statuses and actionable buttons

* Given: Any invoice status in purchase detail
* When: I view the invoice
* Then:
  * Cancelled: No actionable buttons
  * Paid: Refund (if Refund feature ON for WS)
  * Overdue: Recharge Invoice, Cancel Invoice
  * Pending: Resend Payment Request, Cancel
  * Expired: Resend Payment Request, Cancel
  * Failed: Recharge Invoice
  * Refunded: No actionable button

#### AC1: Skeleton loading for Purchase details pop-up

* Given: Client has made a purchase/trial/sent a view request
* When: I click to view the purchase detail
* Then:
  * Show skeleton loading while data is retrieving

#### AC2: Header layout of purchase details

* Given: Client has made a purchase/trial
* When: Coach clicks to view purchase detail pop-up and views the header
* Then:
  * Client's full name
  * Message icon + "Message Client" (only show if client has account ID — connected or archived connected)
  * Mail icon + client's email address (current behavior)
  * Icon + Phone number (current behavior)
  * Icon + Coach name (current behavior)
  * X button to close the pop-up

#### AC3: "View Package" dropdown in purchase details

* Given: Client has made a purchase/trial
* When: Coach clicks to view the "View Package" dropdown
* Then:
  * Default: The selected purchase
  * Click to view list of purchases
  * Order: All Packages first, then Active (free trial, active, overdue, paused, expires soon, cancels soon — most recent first), then Inactive (cancelled, expired — most recent first, no status shown)
  * Each option shows: Package name, Purchase status (only for active/trial/expires soon/cancels soon/overdue — not for expired/cancelled)
  * Hover: highlight background
  * Switching options reloads pop-up content

#### AC4: Package name, status, order, actionable buttons

* Given: Client has made a purchase/trial
* When: Coach views package name and purchase status area
* Then:
  * {Package name} {Purchase status}
  * "Order Number: {Order}" — Exception: Pending invoice won't have order number until client purchase/trial succeeds
  * Actionable buttons based on purchase status (see AC5–AC13)

#### AC5: Active purchase details

* Given: Package is active
* When: I view purchase detail pop-up
* Then:
  * Status: "Active"
  * Status transitions: → "Expires Soon" (last renewal paid), → "Overdue" (renewal fails), → "Paused" (coach pauses), → "Canceled" (immediate cancel), → "Cancels Soon" (scheduled cancel)
  * Actionable buttons: Recurring: "Pause" + "Cancel" / One-time: "Cancel"
  * PRICING PLAN section (show next invoice; if none, show last):
    * One-time: icon + "Price" {currency symbol}{price} "one time"
    * If active after trial: hide Free Trial duration, show icon + "Trial ended on" {end date} {x}-day
    * Recurring: icon + "Price" {currency symbol}{price}/{Cycle} . {x} times (hide ". {x} times" if forever)
    * Recurring: icon + "Next Renewal" {date} (format: 2026-5-1)
    * icon + "Payment method" {Card type} •••• {last 4 digits}

#### AC6: Free Trial purchase details

* Given: Client started a trial package AND trial hasn't ended
* When: I view the purchase detail pop-up
* Then:
  * Status: "Free Trial"
  * Status transitions: → "Active" (payment success after trial), → "Canceled" (cancel or payment fails after trial)
  * Actionable button: "Cancel" (both one-time and recurring)
  * PRICING PLAN: One-time: "{currency symbol}{price} One time" / Recurring: "{currency symbol}{price}/{Cycle} . {x} times" (hide ". {x} times" if forever)
  * icon + "Free trial duration" "{x} days" + "{n} days left" tag
  * icon + "Trial ends on" {trial end date} (format: 2026-5-1)
  * icon + "Payment method" {Card type} •••• {last 4 digits}

#### AC7: Overdue purchase details

* Given: Client has a recurring package AND a renewal invoice is overdue
* When: I view the purchase detail pop-up
* Then:
  * Status: "Overdue"
  * Status transitions: → "Cancels Soon" (schedule cancel), → "Canceled" (immediate cancel), → "Expires Soon" (expiration), → "Active" (all invoices paid + more renewals), → "Paused" (pause)
  * Actionable buttons (recurring only): "Pause" + "Cancel"
  * Alert message: icon + "Renewal Payment Failed" "Please have the client update their payment method or fix the issue with their bank. You can retry payment on the invoice."
  * PRICING PLAN: icon + "Price" {currency symbol}{price}/{Cycle} . {x} times (hide if forever)
  * icon + "Next Renewal" {date}
  * If trial before: icon + "Trial ended on" {date} {x}-day
  * icon + "Payment method" {Card type} •••• {last 4 digits}

#### AC8: Paused purchase details

* Given: Client purchased a recurring package AND coach paused AND not expires soon
* When: I view the purchase detail pop-up
* Then:
  * Status: "Paused"
  * Status transitions: → "Expires Soon" (resume + last invoice made + no overdue), → "Cancelled" (cancel immediately), → "Cancels Soon" (schedule cancel or client cancel), → "Active" (resume + more renewals + no overdue)
  * Actionable buttons (recurring only): "Resume" + "Cancel"
  * Alert: "Subscription Paused — This purchase will be paused until {date}. Resume to continue using your package." (Date format: May 10, 2026)
  * PRICING PLAN: icon + "Price" format, "Paused on" {date}, "Resumes on" {date}, icon + "Payment method"
  * Hide "Next Renewal" and "Trial ended on" if moved from other status

#### AC9: Expires Soon purchase details

* Given: Client has a recurring package AND current cycle is the last AND no overdue invoice
* When: I view the purchase detail pop-up
* Then:
  * Status: "Expires Soon"
  * Status transitions: → "Expired" (expired), → "Cancels Soon" (schedule cancel), → "Cancelled" (immediate cancel)
  * Actionable button: "Cancel"
  * Alert: "Subscription Expires Soon — This subscription will expire on {date}." (Date format: May 10, 2026)
  * PRICING PLAN: icon + "Price" format, "Expires on" {date}, icon + "Payment method"
  * Hide "Next Renewal" and "Trial ended on" if moved from other status

#### AC10: Expired purchase details

* Given: Client has a recurring package AND last cycle passed AND no overdue invoice
* When: I view the purchase detail pop-up
* Then:
  * Status: "Expired"
  * No action buttons
  * PRICING PLAN: icon + "Price" format, "Expired on" {date} (changed from "Expires on"), icon + "Payment method"
  * Hide other fields if moved from other status

#### AC11: Cancels Soon purchase details

* Given: Client has a recurring package AND coach/client scheduled cancel AND cancel date hasn't passed
* When: I view the purchase detail pop-up
* Then:
  * Status: "Cancels Soon"
  * Status transitions for Reactivate: Recurring → "Active" (more invoices) / "Expires Soon" (no more renewal) / "Overdue" (overdue invoice) / One-time → "Active"
  * Actionable button (both one-time and recurring): "Reactivate" (undo cancellation)
  * Alert: "Subscription Cancels Soon — This subscription will be cancelled on {date}." (Date format: May 10, 2026)
  * PRICING PLAN: icon + "Price" (one-time or recurring format), icon + "Cancels on" {date}, "Cancel requested on" {date}, icon + "Payment method"
  * Hide other fields if moved from other status

#### AC12: Cancelled purchase (failed invoice / failed trial payment)

* Given: Client has a recurring package AND coach scheduled cancel AND cancel date passed OR failed payment after trial
* When: I view the purchase detail pop-up
* Then:
  * Status: "Canceled"
  * If canceled by failed trial: recharge successful → Active
  * No action buttons (both one-time and recurring)
  * If canceled due to failed payment after trial, show alert: "Cancelled Due to Payment Failure — The client's first payment after a free trial failed. To reactivate the package, retry payment on the overdue invoice." (Don't show this alert if cancelled by coach/client)
  * PRICING PLAN: icon + "Price" format, icon + "Cancelled on" {date}, icon + "Trial ended on" {date}, icon + "Payment method"
  * Hide other fields if moved from other status

#### AC13: Cancelled purchase (coach/client initiated)

* Given: Client has a recurring package AND client scheduled cancel AND cancel date hasn't passed
* When: I view the purchase detail pop-up
* Then:
  * Status: "Cancelled" — this status won't be changed
  * No action buttons
  * PRICING PLAN: icon + "Price" format, icon + "Cancelled on" {date}, "Cancel requested on" {date}, icon + "Payment method"
  * Hide other fields if moved from other status

#### AC14: Update UI for Payment request

* Given: I sent client a payment request
* When: I view the purchase detail pop-up
* Then:
  * Header: If client connected → show as AC2. If client is new → default avatar (grey) + coach
  * Show package name in View Package field (current behavior)
  * No action buttons
  * PRICING PLAN: One-time: "{currency symbol}{price} One time" / Recurring: "{currency symbol}{price}/{Cycle} . {x} times" (hide if forever)

#### AC15: Resend activation email for non-activated purchase

* Given: Client has made a purchase/trial AND client hasn't activated the package
* When: Coach views purchase detail pop-up
* Then:
  * Show "Resend Activation Email" + email icon
  * Only displays if package hasn't been activated
  * Hover: show underline below hyperlink button
  * Hide button if purchase is activated

#### AC16: Total paid and View invoice table

* Given: Client has made a purchase/trial
* When: Coach views purchase detail pop-up
* Then:
  * If no invoice (Free Trial only): icon + "No invoices yet", description "Invoices will appear here once payments are made."
  * If having invoice: "Total Paid: {symbol}{Total}"
  * Table columns: Invoice #, Payment Due, Billing Cycle ({Start date} - {End date}), Amount, Status (Paid/Failed/Overdue/Canceled/Pending/Expired)
  * Actionable buttons per invoice status (AC17–AC22)

#### AC17: Paid invoice actions

* Given: Invoice is paid AND WS has Refund feature ON
* When: I click eclipse button of paid invoice
* Then:
  * Show "Refund" button (functional as current)
  * Updated UI: container background colors, icon, title style, dropdown component with click/hover states, details box
  * After refund click: invoice status = pending, no buttons on invoice
  * If Refund feature OFF: no function to show

#### AC18: Overdue invoice actions

* Given: Invoice is Overdue
* When: I click eclipse button of overdue invoice
* Then:
  * Show: "Recharge Invoice" + "Cancel Invoice" (current behavior)

#### AC19: Cancelled invoice — no actions

* Given: Invoice is Canceled
* When: I click eclipse button of cancelled invoice
* Then:
  * No actionable buttons

#### AC20: Pending invoice actions

* Given: Invoice is Pending
* When: I click eclipse button of pending invoice
* Then:
  * Show: "Resend Payment Request" + "Cancel Payment Request" (current behavior)
  * Click Resend → "Resend Payment Request?" pop-up with updated components: Title, text style, "Payment is due {<>} from the date the payment request is sent", Cancel, Resend

#### AC21: Expired invoice actions

* Given: Invoice is Expired
* When: I click eclipse button of expired invoice
* Then:
  * Show: "Resend Payment Request" + "Cancel Payment Request" (current behavior)

#### AC22: Failed invoice actions

* Given: Invoice is Failed
* When: I click eclipse button of failed invoice
* Then:
  * Show: "Recharge Invoice" (current behavior)

#### AC23: Show data for selected purchase from dropdown

* Given: I am in the Purchase details pop-up
* When: I select a purchase from the View Packages dropdown
* Then:
  * If data is loading → show skeleton loading
  * Show data after loaded: purchase info + invoices

#### AC24: Show all purchases — "All Packages" option

* Given: I am in the Purchase details pop-up
* When: I select "All Packages"
* Then:
  * Hide Pricing Plan section
  * Show "All Packages" in the Package name position
  * Add Package column to table (current behavior)

#### AC25: Responsive UI

* Given: I am in the Purchase details pop-up
* When: I view the purchase details in different resolutions
* Then:
  * The UI of the pop-up should be responsive

### US5: As a Coach, I want to see the discount details in the purchase details pop-up.

**Pre-condition:** Coach has access to the Payment & Packages

#### AC1: Discount for One-time with/without trial purchase

* Given: Client purchases a one-time package with/without a trial AND applied the promo code
* When: I open the purchase detail pop-up
* Then:
  * Discount shown: Percentage → "{x}% off" OR Amount off → "{currency symbol}{Amount} off"
  * Hover over discount → tooltip:
    * No trial: "**Promo Code: <promo code>**"
    * During trial: "**Promo Code: <promo code>** Discount will be applied after free trial ends."
    * Trial ended: "**Promo Code: <promo code>**"
  * Price of purchase with strikethrough: ~~{currency symbol}{Amount}~~
  * Amount after promo: {currency symbol}{amount} one time (e.g., $25.50 one time)

#### AC2.1a: Fixed-term/forever recurring w/ one-time discount without trial

* Given: Client purchased a recurring subscription without trial AND w/ one-time discount (fixed-term or forever)
* When: I open the purchase detail pop-up
* Then:
  * Won't show any discount since it's over

#### AC2.1b: Fixed-term/forever recurring w/ one-time discount with trial

* Given: Client purchased a recurring subscription with trial AND w/ one-time discount (fixed-term or forever)
* When: I open the purchase detail pop-up
* Then:
  * Show discount during the trial period
  * Hover tooltip: "**Promo Code: <promo code>** Discount will be applied to the first payment."
  * Remove the discount and tooltip if trial ended

#### AC3.1: Forever recurring w/ number-of-invoices discount — show if discount on next invoice

* Given: Client purchased a recurring subscription forever with/without trial AND promo code duration = Number of invoices
* When: I open the purchase detail pop-up
* Then:
  * Show discount if discount on next invoice
  * Discount: Percentage → "{x}% off" OR Amount off → "{currency symbol}{Amount} off"
  * Hover tooltip: "**Promo Code: <promo code>** Discount will be applied to the first X payments." (X = remaining discount payments, not total)
  * If date is in the past → tooltip disappears
  * Price with strikethrough: ~~{currency symbol}{Amount}~~
  * Discounted amount: {currency symbol}{amount}/{billing cycle} (e.g., $25.50/month, $25.50/2 months, $25.50/week)

#### AC3.2: Forever recurring — last invoice has promo (cancel subscription)

* Given: Client purchased a fixed recurring subscription with/without trial AND applied promo code with duration = Number of invoices
* When: The next invoice is applied promo BUT subscription is cancel or scheduled to be canceled at next renewal
* Then:
  * Always show discount in the price
  * Hide tooltip if no more renewal invoice

#### AC4: Forever recurring w/ all-recurring-payments discount — always show

* Given: Client purchased a recurring subscription forever with/without trial AND promo code duration = All recurring payments
* When: I open the purchase detail pop-up
* Then:
  * Always show discount in the price
  * Discount: Percentage → "{x}% off" OR Amount off → "{currency symbol}{Amount} off"
  * Hover tooltip: "**Promo Code: <promo code>** Discount will be applied to all payments."
  * Price with strikethrough: ~~{currency symbol}{Amount}~~
  * Discounted amount: {currency symbol}{amount}/{billing cycle} (e.g., $25.50/month, $25.50/2 months, $25.50/week, $25.50/2 weeks)

#### AC5: Fixed-term recurring w/ number-of-invoices discount — show if discount on next invoice

* Given: Client purchased a fixed-term recurring subscription with/without trial AND promo code duration = Number of invoices
* When: I open the purchase detail pop-up
* Then:
  * Show discount if discount on next invoice
  * Discount: Percentage → "{x}% off" OR Amount off → "{currency symbol}{Amount} off"
  * Hover tooltip: "**Promo Code: <promo code>** Discount will be applied to the next x payments." (x = remaining discount payments)
  * If date is in the past → tooltip disappears
  * Price with strikethrough: ~~{currency symbol}{Amount}~~
  * Discounted amount: {currency symbol}{amount}/{billing cycle} . {x} times (e.g., $25.50/month . 4 times)

#### AC7: Fixed-term w/ forever discount — always show

* Given: Client purchased a fixed-term recurring subscription with/without trial AND promo code duration = All recurring payments
* When: I open the purchase detail pop-up
* Then:
  * Always show discount in the price
  * Discount: Percentage → "{x}% off" OR Amount off → "{currency symbol}{Amount} off"
  * Hover tooltip: "**Promo Code: <promo code>** Discount will be applied to all payments."
  * Price with strikethrough: ~~{currency symbol}{Amount}~~
  * Discounted amount: {currency symbol}{amount}/{billing cycle} . {x} times

#### AC8: Fixed-term — last invoice applied promo code

* Given: Client purchased a fixed recurring subscription with/without trial AND applied promo code (Number of invoices or All recurring payments) AND all invoices applied promo code
* When: I open the purchase detail pop-up
* Then:
  * Always show discount
  * Remove the tooltip at the last renewal (no more invoices)
  * Note: For one-time and fixed-recurring, even if no additional invoice, still show the discount that was on the last invoice

### US6: As a Coach, I want to see a rule of session credits issued from a specific client's package purchase, so that I can verify the correct credits were issued for each payment cycle.

**Pre-condition:**
* Booking feature is enabled for WS
* WS has the Payment & Packages add-on

#### AC1: View Pricing Plan — Session Credit section

* Given: Client has made a purchase/trial with Session Credit setup
* When: Coach clicks to view purchase detail pop-up and views the PRICING PLAN section Session Credit info
* Then:
  * Section name: coin icon + "Session Credits"
  * Info: "{Amount of credit} credits / {cycle}" (hide cycle for one-time purchase)
  * Show button + downward arrow (collapsed by default)
  * Click Show → expand list of session credits; button changes to "Hide" + upward arrow
  * Data: list of session types from the package price at the time of purchase (package snapshot)
  * Each session type: Color, Name (long name max 330px cut off "…"), Tooltip (Name, Duration, Location type, Session type), {amount of credit}/{cycle of purchase}
  * "View issued credits" button → click to navigate to client Sessions/Credits tab
  * Disabled if purchase not activated; hover tooltip: "Client has to activate purchase before credits can be issued."

#### AC2: Hide Session Credit component if no credit setup

* Given: Client has made a purchase/trial without credit set up
* When: Coach views the PRICING PLAN section
* Then:
  * Should NOT see the Credits component in the PRICING PLAN section

### US7: As the System, I want to automatically issue session credits when a client's payment is successful and purchase is activated, so that coaches don't need to issue them manually.

#### AC0: Logic to issue session credits

* Given: Coach set the credits for package
* When: Client purchased the package from Package link or Payment request
* Then:
  * One-time without trial: Credits issued on successful purchase + activated. Expiration starts from day of payment. No credits for failed payment / not activated.
  * One-time with trial: No credits during trial. Credits issued on first paid billing cycle after trial + activated. Failed invoice → charge successful + activated → issue credits. Expiration starts from day after trial end.
  * Recurring with trial: No credits during trial. Credits issued on first paid cycle after trial. Credits issued on each successful renewal + activated. Overdue invoice → charge successful + activated → issue credits. Expiration starts from first day of billing cycle.
  * Recurring without trial: Credits issued on first paid billing cycle. Credits on each successful renewal + activated. Overdue invoice → charge successful → issue credits. Expiration starts from first day of billing cycle.
  * No credits issued when Booking feature is disabled.
  * Issued credits reflected in: Client profile (after activation), Purchase details (after payment success).

#### AC1: Issue credits — One-time without trial

* Given: WS has Booking enabled AND Package has session credits AND no free trial
* When: Client successfully pays for one-time package (Package link or Payment request, with/without logging in) AND purchase is activated
* Then:
  * Credits issued on paid invoice
  * Increase available credits: Balance (total), Balance per session type, Amount in Client profile/Overview/Session component
  * Event in Updates: "**Client name** was issued X credits from payment of <package name> package."
  * In-app notification for managing coach: $ icon + "**Client name** was issued X credits from payment of <package name> package."
  * Notification click: Web → client's Sessions tab/Credits tab; Mobile → client profile/Overview tab
  * Balance History records: Date, Event "Issued", Amount, _{Package name}_ (clickable link → Purchased Package Details pop-up; only if coach has P&P permission, otherwise not clickable; hover for full name)
  * Expiration starts from day of payment success

#### AC2: Issue credits — One-time with trial

* Given: WS has Booking enabled AND Package has session credits AND has free trial
* When: Client starts free trial (Package link or Payment request, with/without logging in) AND purchase is activated
* Then:
  * No credits during trial
  * Credits issued on first paid invoice after trial ends (per package config, same details as AC1)
  * No credits if first paid invoice fails
  * Failed invoice: If recharge successful → issue credits
  * Expiration starts from first day of billing cycle, NOT payment success date

#### AC3: Issue credits — Recurring with trial

* Given: WS has Booking enabled AND Package has session credits AND has free trial + recurring
* When: Client starts free trial (Package link or Payment request, with/without logging in) AND purchase is activated
* Then:
  * No credits during trial
  * Credits issued on first successful paid billing cycle after trial (same details as AC1)
  * Credits issued on each subsequent successful renewal (same details as AC1)
  * No credits when renewal invoice fails
  * Failed invoice → recharge successful → issue credits
  * Overdue invoice → recharge successful → issue credits
  * Expiration starts from first day of billing cycle

#### AC4: Issue credits — Recurring without trial

* Given: WS has Booking enabled AND Package has session credits AND no free trial + recurring
* When: Client successfully pays first invoice (Package link or Payment request, with/without logging in) AND purchase is activated
* Then:
  * Credits issued on first successful billing cycle (same details as AC1)
  * Credits issued on each subsequent successful renewal (same details as AC1)
  * No credits when renewal invoice fails
  * Overdue invoice → recharge successful → issue credits
  * Expiration starts from first day of billing cycle

#### AC5: Issue credits when purchase activated later

* Given: WS has Booking enabled AND Package has session credits
* When: Client purchased and payment made for one or multiple cycles BUT purchase not activated yet
* Then:
  * No credits issued since purchase not activated
  * If client activates later → issue all credits; expiration based on billing cycle date (not payment date or activation date)
  * If expiration is already in the past at issuance → immediately expire. Balance History shows issued and expired on same day.

#### AC6: Archived client — issuance continues

* Given: Client has been archived AND purchase is still active AND payment is paid
* When: A successful paid cycle occurs
* Then:
  * Credits are issued as normal. Archive does not block issuance.
  * Already-issued credits follow P1.0 client-archive display rules.

### US8: Update session type info

#### AC1: Session type info updates reflected across UI

* Given: I created a Session Type that requires credit
* When: I update the session type information
* Then:
  * Updated in Package Pricing pop-up: Dropdown and populated (Color, Name, Duration, Location, Type)
  * Updated in Package overview (Color, Name)
  * Updated in Purchase details pop-up (Color, Name, Duration, Location, Type)
  * Updated in Balance history (as P1.0)

#### AC2: Block archiving session type in published package rule

* Given: Session type requires credit AND is in a package session credit rule AND associated package is published
* When: Coach tries to archive the session type
* Then:
  * Coach is blocked from archiving
  * Pop-up shown:
    * Title: "Session Type In Use"
    * X button to close
    * Description: "This session type is configured in the session credit rules for a published package. To archive this session type, you must remove the session type from the package or unpublish the package."
    * Button: "OK" → close pop-up
  * If coach removes session type from package or unpublishes → can archive
  * If archived after removal, existing purchases still issue that session type's credit following their purchase version. To stop, coach must cancel the purchase.

#### AC3: Block turning off "require credit" if session type in package rule

* Given: Session type requires credit AND is in a package session credit rule
* When: Coach tries to turn off the "require credit" toggle
* Then:
  * Coach is blocked
  * Message shown that they cannot change because there is a package with a session credit rule with this session type
  * If session type has no linked sessions, no issued credits, and package has no purchases → coach can remove session type from package, then turn off toggle
  * Tooltip message: "This setting is locked because this session type is already linked to existing sessions, issued session credit, or is in a package session credit rule."

### US9: Update Client Purchase list pop-up in client Profile Overview

#### AC1: Show all purchase statuses of client

* Given: Coach has permission to access Payment & Packages AND is in client profile/Overview tab
* When: I click on "View {n} Active Packages" hyperlink button
* Then:
  * Purchase statuses reflected in the Purchases pop-up
  * Statuses reflect new defined status text/color/style
  * Update hover/click status when hovering/clicking each row
  * Keep current behavior: click on each package to navigate to Purchase detail pop-up in package analytics page

### US10: User Terminology

#### AC1: Update user terminology based on coach account settings

* Given: Coach set up the user terminology on their settings
* When: I view the places having user terminology item
* Then:
  * Updated based on coach setups in:
    1. Message for session credit if both Trial and Session credit toggle ON: "Credits will be added to client account after the free trial ends and the first payment is successfully processed."
    2. Purchase detail pop-up — Overdue alert message: "Please have the client update their payment method or fix the issue with their bank. You can retry payment on the invoice."
    3. "View issued credits" button disabled tooltip: "Client has to activate purchase to issue credits."

### US11: WS lost the Payment and Packages feature

#### AC1: Keep data and stop issuance if P&P feature OFF

* Given: WS has Booking feature and P&P ON AND there are clients issued credits via package
* When: Payment & Packages feature is OFF
* Then:
  * Keep all data in balance and history of client issued through packages
  * No more credits issued via package
  * Coach should not be able to click on hyperlink from History table

#### AC2: Show historical data again if WS re-purchases P&P

* Given: WS had Booking + P&P ON, clients had credits via package, then P&P turned OFF
* When: Payment & Packages feature is ON again
* Then:
  * All historical data about session credit in the package analytics shown again (following P&P feature logic)

### US12: As the System, I want to suppress all session credit UI and issuance when a WS does not have the Booking feature enabled, so that coaches without Booking are not exposed to credits functionality they cannot use.

**Pre-condition:** WS does NOT have the Booking feature enabled

#### AC1: Hide all Session Credits UI if Booking feature OFF

* Given: WS has Booking feature ON
* When: Booking feature is turned OFF
* Then:
  * Packages shouldn't show session credits
  * Client profile shouldn't show the Sessions tab
  * Client profile Overview tab shouldn't show the Upcoming Session section
  * Note: Do not delete data. If scheduled sessions or issued credits exist, leave them. Ensure email and mobile notifications don't go out if feature flag is off.

#### AC2: Click on notification while lost Booking access

* Given: WS has Booking feature ON
* When: Booking feature is turned OFF
* Then:
  * Coach web: Nothing happens
  * Mobile: Keep navigating to client overview tab

#### AC3: All data saved and shown again if feature flag ON

* Given: WS had Booking feature ON, then turned OFF
* When: Booking feature is turned ON again
* Then:
  * All data should be saved and shown again

### US13: Migration data for existing packages

#### AC1: Migrate data for Packages information

* Given: WS has existing packages
* When: Coach opens the package Overview and Pricing pop-up
* Then:
  * See new UI for this page
  * All data of existing packages should be populated
  * Coach can set the Credits for those packages

#### AC2: Migrate data for all purchases

* Given: WS has existing purchases
* When: Coach opens the purchase details pop-up
* Then:
  * See new UI for this pop-up
  * All data of existing purchases should be populated and mapped with new UI and status

