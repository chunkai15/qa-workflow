**Title:** [Spec 3.1] Session Credits — Package Issuance - Everfit

**Source:** [https://everfit.atlassian.net/wiki/spaces/EV/pages/3653993094/Spec+3.1+Session+Credits+Package+Issuance](https://everfit.atlassian.net/wiki/spaces/EV/pages/3653993094/Spec+3.1+Session+Credits+Package+Issuance)

---

# Page Structure Map
```text
[Spec 3.1] Session Credits — Package Issuance - Everfit
├── User Story 1: Coach — Configure session credit issuance on a package
│   ├── AC 2: Update UI for Choose country pop-up ready
│   ├── AC 3: Update UI of Create New Package pop-up ready
│   ├── AC 4: Update UI of Pricing component ready
│   ├── AC 5: Update UI for Package Pricing pop-up in case payment has been set up ready
│   ├── AC 6: Show model to select when I click on pricing model dropdown ready
│   ├── AC 7: Enter Price for plan ready
│   ├── AC 8: Show the Billing Cycle and expiration fields if I chose the recurring subscription ready
│   ├── AC 9: Enter Billing cycle for recurring subscription ready
│   ├── AC 10: Select expiration for billing cycle ready
│   ├── AC 11: Update UI for turning on Free Trial toggle ready
│   ├── AC 12: Show session credit configuration if I turn its toggle on ready
│   ├── AC 13: Show the selected session type ready
│   ├── AC 14: Add multiple Session type ready
│   ├── AC 15: Show the message for session credit if both Trial and Session credit toggle ON ready
│   ├── AC 16: Disable Update Pricing buttion and show error if I enter invalid value ready
│   ├── AC 17: Handle invalid data case after click on “Update Pricing” ready
│   ├── AC 19: Show loading status when package is creating ready
│   ├── AC 20: Update UI for Pricing component in package overview after saving pricing ready
│   ├── **AC 21: Show Session Credits if coach add Credit to pricing** ready
│   └── AC 21: Click on Session Type row to show details ready
├── User Story 2: Coach — Edit session credit configuration on a package
│   ├── AC 1: Keep the Pricing model field in Package Pricing pop-up being disabled to edit if package is published ready
│   ├── **AC 2:** All session credit fields are always editable ready
│   ├── **AC 3: Save package** if package hasn’t been published **— no confirmation needed** ready
│   └── AC 6: Block publishing package if there is an inactive session type in the package session credit rules ready
├── User Story 3: Redefine the Status of Purchase and Its function on the Package/Analytics page
│   ├── AC 1: Active status ready
│   ├── AC 2: Free Trial ready
│   ├── AC 3: Overdue ready
│   ├── AC 4: Paused keep for test, no change
│   ├── AC 5: Expires soon ready
│   ├── AC 6: Expired ready
│   ├── AC 7: Cancel soon ready
│   ├── AC 8: Cancelled ready
│   ├── AC 9: Keep Cancels Soons, Expires Soon in the Active purchase filter ready
│   └── AC 10: Add new Expired filter Need to confirm with Jon
├── User Story 4: Coach — Update UI of a purchase details
│   ├── AC 0.1: Summary of Logic and actionable buttons in Purchase details ready
│   ├── AC 0.2: Summary the status of invoices and actionable button on the purchase detail pop-up ready
│   ├── AC 1: Skeleton loading for Purchase details pop-up while it's loading data ready
│   ├── AC 2: Header layout of purchase details ready
│   ├── AC 3: “View Package” dropdown in purchase details ready
│   ├── AC 4: View the selected package name and purchase status, order, actionble button ready
│   ├── AC 5: Active purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready
│   ├── AC 6: Free Trial Purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready
│   ├── AC 7:Overdue Purchase - Show status, actionable butto and the pricing plan in purchase details pop-up ready
│   ├── AC 8: Paused Purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready
│   ├── AC 9: Expires Soon Purchase - Show status and actionable button and pricing plan in purchase details pop-up ready
│   ├── AC 10: Expired Purchase - Show status and actionable button in purchase details pop-up ready
│   ├── AC 11: Cancels Soon Purchase - Show status and actionable button in purchase details pop-up ready
│   ├── AC 12: Canceled Purchase - due to Failed invoice - Show status and actionable button in purchase details pop-up ready
│   ├── AC 13: Canceled Purchase - due to coach/client initiated - Show status and actionable button in purchase details pop-up ready
│   ├── AC 14: Update UI for Payment request ready
│   ├── AC 15: Show Resend activation email button for purchase hasn't been activated ready
│   ├── AC 16: Total paid and View invoice table ready
│   ├── AC 17: Paid invoice - Show eclipse buttons with refund featur & update UI of refund pop-up ready
│   ├── AC 18: Overdue invoice - Show Cancel Invoice function ready
│   ├── AC 19: Cancelld status - No actionable button Need design
│   ├── AC 20: Pending invoice - Show resend and cancel functions and update UI for Resend Payment request pop-up ready
│   ├── AC 21: Expired invoice - show resend ready
│   ├── AC 22: Failed invoice - Show Retry ready
│   ├── AC 23: Show the data for the purchase that coach select from dropdown ready
│   └── AC 24: Show all purchase, if coach select view “All Packages” option ready
├── User Story 5: Package details with discount
│   ├── AC 1: Show discount for One time with/without trial purchase ready
│   ├── AC 2.1: Fixed term or forever Recurring subscription w/ one-time discount without trial ready
│   ├── AC 2.1: Fixed term or forever Recurring subscription w/ one-time discount with trial period ready
│   ├── AC 3.1: Recurring subscription forever w/ number of invoiced applied discount --> will show discount if discount on next invoice ready
│   ├── AC 3.2: Show the discount for the forever recurring subscription with if the last invoice is applied promo code (cancel subscription) ready
│   ├── AC 4: Recurring subscription forever w/ all recurrring payment applied discount--> will always show discount ready
│   ├── AC 5: Fixed-term recurring subscription w/ number of invoiced applied discount --> will show discount if discount on next invoice ready
│   ├── AC 7: Fixed-term w/ forever discount--> will always show discount ready
│   └── AC 8: Show the discount for the fix-term recurring subscription with if the last invoice is applied promo code ready
├── User Story 6: Coach — View credit issuance rule from a purchased package
│   ├── AC 1: View Pricing plan - Session credit ready
│   └── AC 2: Hide the session Credit component if Client purchase a package without credit ready
├── User Story 7: Issue credits when client purchases the package and the payment is successful and package is activated
│   ├── AC 0: Logic to issue session Credit for clients ready
│   ├── AC 1: Issue credits after payment succeed for One time package without trial ready
│   ├── AC 2: Issue credits after payment succeed for One time with trial Ready
│   ├── AC 3: Issue credits after payment succeed for Recurring with trial Ready
│   ├── AC 4: Issue credits after payment succeed for Recurrring without trial Ready
│   ├── AC 5: Issue credits when purchase is activated later of successful payment Ready
│   └── AC 6: Archived client — issuance continues Ready
├── User Story 8: Update session type info
│   ├── AC 1: Update to Session type in the Package Pricing and Purchase details pop-ups and package overview if it's updated Ready
│   ├── AC 2: Blocked if the session type is in a published package rule Ready
│   └── AC 3: **“require credit” rule** on a session type, I am blocked if the session type is in a package session credit rule Ready
├── User Story 9: Update Client Purchase list pop-up in client Profile Overview
│   └── AC 1: Show all purchase status of client Ready
├── User Story 10: User Terminology
│   └── AC 1: Update the user terminology based on what coach set up in their account settings Ready
├── User Story 11: WS lost the Payment and packages feature ready
│   ├── AC 1: Keep all existing data of session. credit and don't issue credit via package if Payments & Packages feature is OFF ready
│   └── AC 2: Show all historical data again if WS purchase the P&P again ready
├── User Story 12: System — Hide session credit UI when Booking feature is not enabled ready
│   ├── **AC 1: Hide all UI relevant to Session Credits if Booking feature is OFF for WS** ready
│   ├── AC 2: Click on notification while lost the Booking access ready
│   └── AC 3: All data is saved and show to coach again if feature flag is turn ON ready
└── User Story 13: Migration data for existing packages
    ├── AC 1: Migrate data for Packages information of all existing package ready
    └── AC 2: Migrate data for all purchases ready
```

---

**AC**

**GIVEN**

**WHEN**

**THEN**

**Figma/Note**

### User Story 1: Coach — Configure session credit issuance on a package

As a Coach,  
I want to set a package to automatically issue session credits at purchase and/or each renewal,  
so that I don't have to manually issue credits every time a client buys or renews.

**Pre-condition:**

-   WS has the Booking feature enabled

-   The Payment and packages is available for WS

-   Coach has permission to access the Payment & packages feature

**AC 1: Update UI for package pricing pop-up when WS hasn't set up payment.** ready

WS hasn't setup payment for payment & packaqges

I click on “Add Pricing” button from Package overview page

Update UI of Package Pricing pop-up:

-   Title: Package Pricing

-   Image: Illustration of Pricing plan

-   “To enable payments, **please connect your Stripe account**”

-   Button: “Connect Stripe”  
    \--> Click on it to open the “Choose Your Country” pop-up

Payment V1

Current UI:

#### AC 2: Update UI for Choose country pop-up ready

WS hasn't setup payment for payment & packaqges

I click on “Add Pricing” button from Package overview page

OR I go to Payment Setup page

I click on “Connect stripe”

Update the UI of Choose Your Country with new component

-   Add X button

-   Add title “Country”

-   Update the component for Country dropdown

    -   Update hover/click behavior

Payment V1

Current UI:

#### AC 3: Update UI of Create New Package pop-up ready

WS has the PP add-on ON

I have permission to access PP

I click on Create Package button

See UI of “Create New Package” being updated with new component

-   Font

-   Font size

-   Text box

-   Add “Cancel” button

-   Update “Create New” to “Create Package” button

Payment V1

Current UI:

#### AC 4: Update UI of Pricing component ready

WS has the PP add-on ON

I have permission to access PP

I click on Create Package button

Package is created successfully

The Add Pricing button should be updated

-   Default state

-   Hover state

Don't have edit icon (design's mistake)

Current UI

#### AC 5: Update UI for Package Pricing pop-up in case payment has been set up ready

WS has set up payment for payment & packages

I click on the “Add Pricing” button from the Package overview page

I should see Package Pricing with new UI:

1.  Title: “Package Pricing”

2.  “Pricing Plan” section

    1.  Icon + “Pricing Plan”

    2.  Description:  
        ”Price your package as a one-time payment or recurring subscription”

    3.  “Pricing model” dropdown

        1.  Placeholder:  
            “Select pricing model”

    4.  “Price” field

        1.  Placeholder:  
            ”{currency symbol}”

        2.  Currency of payment

3.  “Free Trial” section

    1.  icon + “Free Trial” + tooltip

        1.  Hover over the tooltip to show  
            ”Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically cancelled.”

    2.  Description:  
        ”Allow clients to try out your package before committing to payment”

    3.  Toggle:

        1.  Default: OFF

4.  “Session Credit” section

    1.  Icon + “Session Credits” + tooltip + tag “NEW”

        1.  Hover over the tooltip  
            “Credits issued upon successful payment and purchase activation:

            -   One-time: Issued once

            -   Recurring: Issued every billing cycle”

    2.  Description  
        ”Issue session credits to schedule paid sessions with your clients”

    3.  Toggle

        1.  Default: OFF

5.  “Cancel” button

    1.  Click on it to close the pop-up

6.  “Update Pricing” button

    1.  Disable as default

    2.  Enable if all required fields of Pricing section are fulfilled with valid data  
        No matter data in Session Credits section has been fulfilled

7.  X button

    1.  Click on it to close the pop-up

Payment V1

#### AC 6: Show model to select when I click on pricing model dropdown ready

Coach has the Package Pricing pop-up open

Coach clicks on the "Pricing model" dropdown

1.  Show 2 options

-   One-time Payment

-   Recurring Subscription

2.  Hover option:

    1.  Highlight the background

3.  Click on the option to select the model

    1.  The selected model should be populated in the model field

Payment V1

Current UI:

#### AC 7: Enter Price for plan ready

I am on the Package Pricing pop-up  
I have selected a pricing model

I type a value in the Price field

1.  The input should be shown in the box

2.  Validation: keep as current

3.  The border should be highlighted in blue if the value is valid

4.  If the value is invalid

    1.  Highlight the border in red

    2.  Show the error → As current  
        ”Minimum value is {min value}.”  
        ”Maximum value is {max value}.”

    3.  Disable the Update Price button  
        \--> Enable if coach enter new number

Payment V1

#### AC 8: Show the Billing Cycle and expiration fields if I chose the recurring subscription ready

I am on the Package Pricing pop-up

I select "Recurring Subscription" from the Pricing model dropdown

1.  2 more fields are shown beside the price field

    1.  “Billing cycle” includes:

        1.  Text box  
            \--> Validation: as the current behavior  
            \--> Only number

        2.  Cycle dropdown: include “Weeks” and “Months”

            \--> Validation: as the current behavior

    2.  “Expiration” → work as the P1.1

        1.  Dropdown, click to show

            1.  Never → default valude

            2.  Ends after

Payment V1

#### AC 9: Enter Billing cycle for recurring subscription ready

I am on the Package Pricing pop-up  
I have selected "Recurring Subscription"

I enter a value in the billing cycle field and select a cycle unit

1.  Show the number input

2.  If number = 0 → show error  
    \--> “Minimum value is 1.”  
    \--> Disable the “Update Pricing” button

3.  If number > 12 → show error  
    \--> “Maximum value is 12.”  
    \--> Disable the “Update Pricing” button

Payment V1

#### AC 10: Select expiration for billing cycle ready

I am on the Package Pricing pop-up  
I have selected "Recurring Subscription"

I click on expiration dropdown

1.  The selected value has a checkmark

2.  Hover options: highlight the background

3.  Click on it to select the option.  
    \--> The selected option is fulfilled to the box

4.  If I select Ends after

    1.  \--> show invoices field → Default 2  
        \--> Validation as current

    2.  Show  
        Total: {currency}{amount}  
        Over {x} {cycle}

        Don’t show value for total and over if the price or billing cycle hasn’t fulfilled

5.  If I change to the “Never” option  
    \--> Hide Invoiced fields and total/over value

Payment V1

Current UI:

#### AC 11: Update UI for turning on Free Trial toggle ready

I am on the Package Pricing pop-up

I turn the Free Trial toggle ON

The Free Trial configuration section expands — behavior and validation follow current implementation, UI updated to new design

1.  **Free Trial** + tooltip  
    \--> Hover to show  
    ”Payment will be charged at the end of the trial. If the payment fails, subscription and sequences will be automatically canceled.”

2.  Explanation  
    ”Allow clients to try out your package before committing to payment”

3.  **Free Trial Period**

    1.  Dropdown: As current, default 7 days

    2.  Checkbox: “Archive client when cancelling a package within the trial period”  
        \--> Default: checked

    3.  Checkbox: “Allow client to sign up for a trial once”  
        \--> Default check

Payment V1

#### AC 12: Show session credit configuration if I turn its toggle on ready

I am on the Package Pricing pop-up

And the Free Trial is OFF

I turn the Session Credits toggle ON

The behavior and functions should work as P1.1

1.  Default: show 1 Session type row:

    1.  Session type dropdown → refer to behavior of Session type dropdown in US 2 P1.0

        1.  Placeholder: Select a session type

        2.  Data: **Get all active session types of the all users that require credit**

    2.  Credit field

        1.  Default: 1

            1.  The upward arrow is enabled

            2.  The downward arrow is disabled

        2.  Only input a number

        3.  min: 1,

        4.  max: 100

        5.  Required field

    3.  Expiration dropdown: → Refer to US 1, P1.1  
        Default

        1.  “Expires after”

        2.  Textbox

        3.  Duration: Default → “months”

    4.  Show the “Add Session Credits” button

        1.  Click on it  
            \--> Add 1 more session type row below the last row

        2.  Also show the “Delete” button since we have 2 rows of session type

            1.  Hover  
                \--> highlight the icon + show tooltip “Delete”

            2.  Click on it  
                \--> Remove the session type row

            3.  And hide the delete button again, if only have 1 session type row left

Payment V1

#### AC 13: Show the selected session type ready

I am on the Package Pricing pop-up

I have selected a session type from the dropdown

The selected session type should be populated to its field, with:

1.  Color of session type

2.  Name

    1.  Long name → show 1 row only--> cut off with “…”

Payment V1

#### AC 14: Add multiple Session type ready

I am on the Package Pricing pop-up  
I have the Session Credits section open

I add session type rows

1.  I am able to add multiple different session types, Max 5 types

2.  The selected session type should not be shown in the session type list again  
    (Each session type can be added only once)

3.  The option to add another session type is **disabled**. A note is shown: maximum of 5 session types reached

    1.  Disable the “Add Session Credits” button

        1.  Hover the button to show the tooltip  
            ”Session types limit reached (5/5)”

Payment V1

#### AC 15: Show the message for session credit if both Trial and Session credit toggle ON ready

I am on the Package Pricing pop-up

I have turned ON both the Free Trial toggle and the Session Credits toggle

Show the message in the Session Credit section:

icon + “Credits will be added to client account **after the free trial ends** and the first payment is successfully processed.”

Payment V1

#### AC 16: Disable Update Pricing buttion and show error if I enter invalid value ready

I am on the Package Pricing pop-up

I have the Session Credits section open with incomplete or invalid data

Show the errors and All invalid field should be highlighted in red border and the Update Pricing button should be disable until all required fields are input

1.  If empty

    1.  If Session field is empty  
        \--> “Please selecte session type”

    2.  If session credit is empty  
        \--> "Please set a number of credits."

    3.  If Duration is empty  
        \--> “Please set a duration.”

2.  Credit amount = 0  
    \-->“Amount must be greater than 0.”

3.  Credit amount > 100  
    \--> “Amount must not exceed 100.”

4.  Invavid expiration  
    \--> Refer error here: [\[Spec P1.1\] - Session Credit Expiration | AC 3: Validation — expiration limit exceeded/lower than limit ready](https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#AC-3%3A-Validation-%E2%80%94-expiration-limit-exceeded%2Flower-than-limit-ready)

Payment V1

#### AC 17: Handle invalid data case after click on “Update Pricing” ready

I am on the Package Pricing pop-up

I click "Update Pricing" with data that has become invalid (e.g. a session type was deactivated in another tab)

And the package type is invalid:

1.  Session type isn't active (case 2 tabs)

2.  Session type isn't require credit (case 2 tabs)

Invalid case:

1.  → Show toast "A session type is no longer available.Please try again."

2.  Remove the inactive session type from the pop-up

3.  Highlight the session type box that have invalid data in red  
    ”Please select session type.”

4.  Update Pricing button is disable until all required fields input

**AC 18: Show default UI when Turn OFF the toggle** ready

I am on the Package Pricing pop-up  
I have turned ON the Free Trial or Session Credits toggle

I turn the toggle OFF

The UI should collapse with the default status of Free Trial or Session Credits

Payment V1

#### AC 19: Show loading status when package is creating ready

I am on the Package Pricing pop-up

I click "Update Pricing" with valid data

1.  Loading animation in the Update Price button

2.  Disable all buttons on the Package Pricing pop-up

Payment V1

#### AC 20: Update UI for Pricing component in package overview after saving pricing ready

I am on the Package overview page  
I have saved pricing successfully

I'm viewing the Pricing component

1.  Show “PRICING PLAN” block below Pricing and edit button

    1.  Title: “ PRICING PLAN”

    2.  {Currency}  
        E.g: USD, AUD

    3.  {Currency sign}{Amount}/{cycle} . {number of invoices} times

Example:

-   One time:  
    USD $1,000.00 one time

-   Recurring: fixed-term  
    USD $1,000.00 / 3 months . 4 times  
    AUD $1,000.00 / month . 4 times

-   Recurring: forever  
    USD $1,000.00 / month

2.  If the package has a trial period  
    \--> show tag trial  
    ”{x} - DAY TRIAL”

3.  Edit icon

    \--> Hover to highlight the button  
    \--> Click on it to navigate to the Package Pricing to update price

Payment V1 @Linh Ta - Design Need you to add edit icon to the Pricing component

#### **AC 21: Show Session Credits if coach add Credit to pricing** ready

The coach is viewing a package in the workspace

The package has session credit issuance **enabled**

And I set the session type for the package

And I saved pricing successfully

1.  Show “SESSION CREDIT” block below “PRICING PLAN” block

    1.  Title: “SESSION CREDIT”+ icon  
        \--> Hover icon to show the tooltip: the content is based on package type:

        1.  Recurring: "Session credits are issued every billing cycle after successful payment and initial purchase activation."

        2.  One-time: "Session credits are issued once after successful payment and purchase activation.”"“

    2.  List of session types and amount shown in 3 columns:

        1.  “SESSION TYPE” column: Show the list of session type of package

            1.  Color

            2.  Name

                1.  Long name → Show 1 row and cut off with “…”

        2.  “AMOUNT” column: Show amount of each session type

            1.  coin icon + Quantity

        3.  “EXPIRATION”  
            ”in {n} {period}”  
            Example:  
            in 1 month  
            in 3 weeks  
            in 365 days

    3.  Hover over each session type row to highlight the background  
        Click on it: AC 19

    4.  Edit icon  
        \--> Hover to highlight the button  
        \--> Click on it to navigate to the Package Pricing to update price

2.  Don't show the session credit block if there is no Session type set in the package pricing

Payment V1

Note for design: Need edit icon on the Session Credits component

#### AC 21: Click on Session Type row to show details ready

The coach is viewing a package in the workspace

The package has session credit issuance enabled

And I set the session type for the package

And I saved pricing successfullyhttps://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=42325-450785&t=5OljCdUOOrIUg1LH-1

I click on a session type

Show Session type details pop-up as the Session Credit P1.1 Expiration

Payment V1

### User Story 2: Coach — Edit session credit configuration on a package

As a Coach, I want to edit a package's session credit configuration at any time, so that I can update credit rules and have them apply to future purchases.

#### AC 1: Keep the Pricing model field in Package Pricing pop-up being disabled to edit if package is published ready

I am on the Package Pricing pop-up of a package that has been published

I open the pop-up to edit pricing

The pricing model field should be disabled

Payment V1

#### **AC 2:** All session credit fields are always editable ready

I am on the Package overview with edit mode

I open the pop-up to edit pricing

All session credit fields (toggle, session types, quantities, expiration rules) are **editable**

Payment V1

#### **AC 3: Save package** if package hasn’t been published **— no confirmation needed** ready

I am on the Package overview with edit mode

And the package hasn't been published before

I click "Update Pricing" with valid data

Changes are saved immediately with no confirmation pop-up.

**AC 4: Save on the package that has been published before— show confirmation pop-up** ready

I am on the Package overview with edit mode  
And the package has been published

I click "Update Pricing" with valid data

A confirmation pop-up is shown before saving

1.  Title: “Confirm Package Pricing Update”

2.  Description:

    1.  If only changing something in pricing plan:  
        "You are changing the Pricing Plan for this package. The changes will take effect as soon as the package is published."

    2.  If only changing session credits:  
        "You are changing the Session Credits for this package. The changes will take effect as soon as the package is published."

    3.  If only changing free trial:  
        "You are changing the Free Trial for this package. The changes will take effect as soon as the package is published."

    4.  Combo:  
        "You are changing the Pricing Plan, Free Trial, and Session Credits for this package. The changes will take effect as soon as the package is published."

3.  Note:  
    ”This change will not affect recurring payments for existing clients."

4.  **"Cancel"** button  
    \--> dismisses the pop-up and returns to the Package Pricing pop-up without saving

5.  **"Confirm"** button  
    \--> proceeds with saving the changes

Payment V1

Current UI after update price

**AC 5: Changes apply to future purchases only** ready

I am on the Edit Package Pricing pop-up

Coach has confirmed the savings on a package for changes

The updated information should be shown in the Overview Pricing component.

And new purchases of the package use the updated session credit configuration.

#### AC 6: Block publishing package if there is an inactive session type in the package session credit rules ready

I am on the Edit Package Pricing pop-up

I click "Update Pricing" with valid data

In another tab, I go to session type to archive or turn off “Require session credit” toggle for that session type

I go back to publish the package that includes the archived/inactive session type

1.  Coach is blocked from publishing  
    \--> Should not disable the Publish button, coach can click on it again to view the error message below.

2.  Coach sees the toast  
    "Can't publish. A session credit rule is tied to an inactive session type. Please activate the session type or update the rule to continue."

3.  If the coach fixes the issue, they can publish the package successfully.

Payment V1

### User Story 3: Redefine the Status of Purchase and Its function on the Package/Analytics page

**Important note:** We are changing the status name/collor and style here.  
we are not changing anything about the actions on the Package/Analytics page. This is just documentation of what should be there.

#### AC 1: Active status ready

1.  The purchase is active.

    1.  If one-time, the purchase stays active until the coach changes the status

    2.  If recurring, the purchase is active as long as it isn’t one of the other statuses

2.  Actionable buttons in the Eclipse button:

    1.  For recurring purchase

        1.  Purchase Detail

        2.  Message Client (Only show if client is connected)

        3.  Pause Subscription

        4.  Mark as Cancelled

    2.  For one time purchase:

        1.  Purchase Detail

        2.  Message Client (Only show if client is connected)

        3.  Mark as Cancelled

Current UI

Recurring:

One-time:

#### AC 2: Free Trial ready

-   Client start a trial from the package link  
    \--> In this case, there is no invoice for this purchase yet

-   Client start a free trial from the Payment request  
    \--> There is pending invoice below the purchase

1.  Purchase is in a trial period

2.  Actionable buttons: Both recurring and On-time

    1.  Purchase Detail

    2.  Message Client (Only show if client is connected)

    3.  Cancel Trial

Current UI

#### AC 3: Overdue ready

There is overdue invoice

1.  Purchase is active and has an unpaid invoice. If the purchase is cancelled, expired, paused, expires soon, or cancels soon and has an unpaid invoice, it will not be overdue; the other status takes priority.

2.  Actionable buttons: For recurring purchase only

    1.  Purchase Detail

    2.  Message Client (Only show if client has account ID - client is connected or connected client has been archived)

    3.  Pause Subscription

    4.  Cancel Subscription

#### AC 4: Paused keep for test, no change

Purchased is paused

1.  The purchase is currently paused

2.  Actionable buttons:

    1.  Purchase detail

    2.  Message Client (Only show if client has account ID - client is connected or connected client has been archived)

    3.  Resume Subscription

    4.  Cancel Subscription

Current UI

Note: Only recurring package can be pause

#### AC 5: Expires soon ready

The fixed-term recurring purchase has passed the last renewal invoice but hasn't ended

1.  Purchase is in the last billing cycle of its fixed-term billing rules. The last invoice was already created. The package is technically active, but we are highlighting that it is about to end due to a natural expiration (fixed-term).

2.  Actionable buttons: Only have for recurring

    1.  Purchase Detail

    2.  Message Client (Only show if client has account ID - client is connected or connected client has been archived)

    3.  Cancel Subscription

#### AC 6: Expired ready

The fixed-term recurring purchase ended

1.  The fixed-term package is no longer active; it has expired. It was not cancelled. It reached its natural expiration.

(Old logic called canceled)

2.  → No actionable buttons

#### AC 7: Cancel soon ready

Purchase is schedule to cancel by coach or client

1.  The purchase has been scheduled to be canceled at the next renewal. The package is technically active, but we are highlighting that it is about to end due to a cancellation.

2.  Actionable buttons:

    1.  Purchase Detail

    2.  Message Client (Only show if client has account ID - client is connected or connected client has been archived)

    3.  Reactivate

Only recurring package have the Cancel Soon status

Because for one time package → We have “Mark as cancel” feature → purchase canceled immediately

#### AC 8: Cancelled ready

Purchase met the schedule cancel date

Or Failed payment after the trial

1.  The package is no longer active and was cancelled by the coach or client.

    1.  Actionable button:

        1.  Purchase Detail

2.  A failed payment at the end of the trial is also called Canceled

    1.  Actionable button:

        1.  Purchase Detail

#### AC 9: Keep Cancels Soons, Expires Soon in the Active purchase filter ready

Package has the Cancels Soon

And/Or Expires Soon

Cancels Soons, Expires Soon purchases should be stayed in the Active Purchases tab

#### AC 10: Add new Expired filter Need to confirm with Jon

Package has at least an expired purchase

I go to the package analysis page

1.  I should see new purchase tab called “Expired”

2.  Click on it:  
    \--> Same behavior with other purchases tab

3.  Don't show this tab is no expired purchases existed

Note: For the Payment request: We won't create a subscription until the client has started a trial or purchased a package successfully

### User Story 4: Coach — Update UI of a purchase details

https://miro.com/app/board/uXjVJQOmvnU=/?moveToWidget=3458764669155564783&cot=14

#### AC 0.1: Summary of Logic and actionable buttons in Purchase details ready

Active

The purchase is active.

-   If one-time, the purchase stays active until the coach changes the status

-   If recurring, the purchase is active as long as it isn’t one of the other statuses

Actionable buttons:

-   Pause  
    \--> Only have for recurring

-   Cancel

There is no unpaid invoice

Free Trial

Purchase is in a trial period

Actionable buttons:

-   Cancel

There are 2 ways to trigger this status:

-   Client start a trial from the package link  
    \--> In this case, there is no invoice for this purchase yet

-   Client start a free trial from the Payment request  
    \--> There is pending invoice below the purchase

Overdue

Purchase is active and has an unpaid invoice. If the purchase is cancelled, expired, paused, expires soon, or cancels soon and has an unpaid invoice, it will not be overdue; the other status takes priority.

Actionable buttons:

-   Pause

-   Cancel

There is overdue invoice

Paused

The purchase is currently paused

Actionable buttons:

-   Resume

-   Cancel

Expires soon

Purchase is in the last billing cycle of its fixed-term billing rules. The last invoice was already created. The package is technically active, but we are highlighting that it is about to end due to a natural expiration (fixed-term).

Actionable buttons:

→ Cancel

Expired

The fixed-term package is no longer active; it has expired. It was not cancelled. It reached its natural expiration.

(Old logic called canceled)

→ No actionable buttons

Cancel soon

The purchase has been scheduled to be canceled at the next renewal by the coach or the client. The package is technically active, but we are highlighting that it is about to end due to a cancellation.

Actionable buttons:

-   Reactivate

Cancelled

1.  The package is no longer active and was cancelled by the coach or client.

2.  Note that one-time packages are cancelled to make them inactive.

3.  Currently, a failed payment at the end of the trial is also called Canceled

→ No actionable buttons

No status for the payment request that hasn't started

When the coach sends a payment request for the client, but the client hasn't started. Only have a pending invoice there

→ No actionable buttons

#### AC 0.2: Summary the status of invoices and actionable button on the purchase detail pop-up ready

Cancelled

1.  The invoice is cancelled by the coach  
    → No actionable buttons

Paid

Successful payment.

Actionable buttons for invoice:

-   Refund (if feature is ON for WS)

Overdue

Renewal invoice fails to charge

Actionable buttons for invoice:

-   Recharge Invoice

-   Cancel Invoice  
    (this doesn’t show on the purchase details today, but we are adding it since it shows on the package/analytics page.)

Pending

The payment request has been sent, but the client hasn't started

Actionable buttons for invoice:

-   Resend Payment Request

-   Cancel

Expired

The payment request has been sent, but the client hasn't started, and the due date has passed

Actionable buttons for invoice:

-   Resend Payment Request

-   Cancel

Failed

End Trial, but the payment failed

Actionable buttons for invoice:

-   Recharhe Invoice

Refunded

Refund the paid invoice

→ No actionable button

#### AC 1: Skeleton loading for Purchase details pop-up while it's loading data ready

Client has made a purchase/trial/sending a view request

I click to view the purchase detail

While data is retrieving, I should see the skeleton loading

Payment V1

#### AC 2: Header layout of purchase details ready

Client has made a purchase/trial

Coach click to view purchase detail pop-up

I view the header of the purchase details

Header:

1.  Client’s full name

2.  Message icon + Message Client  
    \--> Keep the current logic to show this button  
    **Current logic**: Only show if client has account ID - client is connected or connected client has been archived

3.  Mail icon + client's email address  
    \--> Keep as the current behavior

4.  icon + Phone number  
    \--> Keep as the current behavior

5.  icon + Coach name  
    \--> Keep as the current behavior

6.  X button

    1.  Click on it to close the pop-up

Payment V1

#### AC 3: “View Package” dropdown in purchase details ready

Client has made a purchase/trial

Coach click to view purchase detail pop-up

I view the “View Package” dropdown of the purchase details

1.  Default: The selected purchase

2.  Click to view the list of purchases:

    1.  Order: Actually, All Packages first, activate then inactive, within active or inactive, order by most recent purchase date.

        1.  Active purchases includes: free trial, active, overdue, paused, expires soon, cancels soon  
            \--> order by most recent first

        2.  Inactive purchases includes: cancelled, expired  
            \--> order by most recent first  
            \--> won't show status

    2.  Each option shows:

        1.  Package name

        2.  Purchase status  
            \--> only showing for the active, trial, expires soon, cancel soon, overdue

            and not showing a status if the purchase is expired and cancelled

        3.  Hover over to highlight the background

3.  Switching options reloads the pop-up content for the selected purchase

Payment V1

Payment V1

#### AC 4: View the selected package name and purchase status, order, actionble button ready

Client has made a purchase/trial

Coach click to view purchase detail pop-up

I view the package name and purchase status, order, and the actionable button of the purchase details

1.  {Package name} {Purchase status}

2.  “Order Number: {Order}  
    Exception: Pending invoice won’t have an order number until client purchase/start trial successfully

3.  Actionable buttons based on the status of the purchase  
    \--> View ACs below: **AC 5 → AC 12**

#### AC 5: Active purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready

Package is active

I go to view purchase detail pop-up

1.  I should see the purchase status:  
    ”Active”

    1.  Status will move to “Expires Soon” if last renewal payment is successful

    2.  Status will move to “Overdue” if the renewal invoice is failed

    3.  \-> Move status “Paused” if coach pause the subscription

    4.  → Move status to “Canceled” if it's canceled immediately

    5.  \--> Or “Cancels Soon” if coach set date to cancel

2.  Show an actionable button for purchase

    1.  Button to show:

        1.  For recurring:

            1.  "Pause"

            2.  "Cancel"

        2.  **For one time purchase:**

            1.  Cancel

3.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  One-time

        1.  icon + “Price”  
            {currency symbol}{price of package} “one time”

        2.  If purchase is active after a successful trial

            (see AC 6)  
            \--> Hide the Free trial duration component  
            \--> Change title “Trial ends on” by:  
            icon + “Trial ended on”  
            {end date} {x}-day

        3.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

    2.  Recurring

        1.  icon + “Price”  
            {currency symbol}{price of package}/{Cycle} . {x} times  
            \--> Hide “. {x} times” if it's recurring forever

        2.  icon + “Next Renewal”  
            {Next renewal date}

            Format: May 1, 2026

        3.  If purchase is active after a successful trial

            (see AC 6)  
            \--> Hide the Free trial duration component  
            \--> Change title “Trial ends on” by:  
            icon + “Trial ended on”  
            {end date} {x}-day

        4.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

New UI: Payment V1

Payment V1

Current UI

#### AC 6: Free Trial Purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready

Client has started a trial package

The trial hasn't ended

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”Free Trial”

    1.  Status will be moved to “Active” if payment success after trial

    2.  Status will be move to canceled if coach or client cancel the trial or payment is failed after trial

2.  Show an actionable button for purchase

    1.  Both one time or recurring show:  
        "Cancel"

3.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  icon + “Price”

        1.  ONE TIME  
            ”{currency symbol}{price of package} One time”

        2.  RECURRING

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

    2.  If the purchase is in a trial duration, show:

        1.  icon + “Free trial duration”

            1.  “{x} days”  
                x is the trial duration

            2.  “{n} days left” tag

        2.  icon + “Trial ends on”  
            {trial end date}  
            Format: May 1, 2026

    3.  icon + "Payment method”  
        {Card type} •••• {last 4 digits}"

Payment V1

#### AC 7:Overdue Purchase - Show status, actionable butto and the pricing plan in purchase details pop-up ready

Client has purchased a recurring package

There is a renewal invoice overdue

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”**Overdue**”

    1.  If coach Schedule cancel date  
        \--> change status to “Cancels Soon”

    2.  Coach cancelled the purchase immediately  
        \--> Change to “Canceled”

    3.  The expiration soon  
        \--> Change to “Expires Soon”

    4.  All invoice are paid and having more renewal invoice  
        \--> Active

    5.  Pause subscription  
        \--> Paused

2.  Show actionable buttons for purchase: Only have this status for recurring

    1.  "Pause"

    2.  "Cancel"

        → Function should work as the current behavior

3.  Show alert message  
    icon + ”Renewal Payment Failed  
    “Please have the client update their payment method or fix the issue with their bank. You can retry payment on the invoice.”

4.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  RECURRING

        1.  icon + “Price”

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

        2.  icon + “Next Renewal”  
            {Next renewal date}

            Format: May 1, 2026

        3.  If the purchase has trial before, show:

            1.  icon + “Trial ended on”  
                {trial end date} {x}-day  
                Format: May 1, 2026

        4.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

Payment V1

Current UI:

#### AC 8: Paused Purchase - Show status, actionable button and the pricing plan in purchase details pop-up ready

Client has purchased a recurring package

Coach pause the purchase and it’s not expires soon

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”**Paused**”  
    The status could be changed to:

    1.  Expires Soon  
        If coach resume package and the last invoice has been made and no overdue invoice

    2.  Cancelled  
        \--> If coach Cancel purchase immediately

    3.  Canceled soon  
        \--> Coach Cancel purchase at a specific date  
        Or client cancel the package

    4.  If coach resume pacakge  
        \--> “Active” if pucrahse still has renewal invoice, no overdue invoice for recurring package

2.  Show actionable buttons for purchase:

    For recurring purchase only

    1.  "Resume"

    2.  "Cancel"

3.  Show the alert message  
    ”Subscription Paused  
    This purchase will be paused until {date}. Resume to continue using your package.  
    Date format: May 10,2026

4.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  RECURRING

        1.  icon + “Price”

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

        2.  Show “Paused on”  
            {date}  
            Date format: May 10,2026  
            \--> Date that the purchase is paused

        3.  Show “Resumes on”  
            {date:  
            Date format: May 10,2026  
            \--> Date the the purchase will be resumed

        4.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

        5.  Hide other fields if it’s moved from other status

            1.  Hide icon + “Next Renewal”  
                {Next renewal date}

            2.  Hide con + “Trial ended on”

                If the purchase has trial before

Payment V1

#### AC 9: Expires Soon Purchase - Show status and actionable button and pricing plan in purchase details pop-up ready

Client has purchased a recurring package

The current cycle is the last cycle and there is no overdue invoice

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”Expires Soon”

    1.  The purchase has expired  
        \--> Status changed to “Expired”

    2.  If coach/client schedule to cancel  
        \--> Status will change to “Cancels Soon”

    3.  If coach cancel immediately  
        \--> Status change to “Cancelled”

2.  Actionable buttons

    1.  Cancel

3.  Show alert message  
    ”Subscription Expires Soon  
    This subscription will expire on {date}.”  
    Date format: May 10,2026

4.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  RECURRING

        1.  icon + “Price”

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

        2.  Show “Expires on”  
            {date}  
            Date format: May 10,2026  
            \--> Date that the purchase is paused

        3.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

        4.  Hide other fields if it’s moved from other status, like  
            “Next Renewal” if it’s recurring purchase active  
            “Trial ended on” If the purchase has trial before

Payment V1

Current UI

Schedule to cancel:

#### AC 10: Expired Purchase - Show status and actionable button in purchase details pop-up ready

Client has purchased a recurring package

The last cycle passed and there is no overdue invoice

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”Expired”

2.  → no action buttons

3.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  RECURRING

        1.  icon + “Price”

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

        2.  Change title “Expires on”  
            to “Expired on”

        3.  icon + "Payment method”  
            {Card type} •••• {last 4 digits}"

        4.  Hide other fields if it’s moved from other status

Payment V1

#### AC 11: Cancels Soon Purchase - Show status and actionable button in purchase details pop-up ready

Client has purchased a recurring package

The coach/client schedule to cancel the purchase

End the cancel date hasn’t been over

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”Cancels Soon”

    1.  Coach reactivate purchase

        1.  For recurring invoice:

            1.  there are more invoice for recurring package, status changed to:  
                \--> “Active”

            2.  No more renewal invoice  
                \--> Expires Soon

            3.  If it's has an overdue invoice  
                \--> “Overdue”

        2.  One time purchase  
            \--> Move status to “Active”

2.  Show an actionable button for purchase: both one time and recurrring:

    1.  “Reactivate”  
        \--> this is the undo cancellation function

3.  Show the alert message  
    ”Subscription Cancels Soon  
    This subscription will be cancelled on {date}.”  
    Date format: May 10,2026

4.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  icon + “Price”

        1.  ONE TIME  
            ”{currency symbol}{price of package} One time”

        2.  RECURRING

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

    2.  icon + “Cancels on”  
        {Cancel date}

        Format: May 1, 2026  
        {date}--> The date the purchase will be cancelled

    3.  Cancel requested on  
        {date} requested date

    4.  icon + "Payment method”  
        {Card type} •••• {last 4 digits}"

    5.  Hide other fields if it’s moved from other status

Payment V1

#### AC 12: Canceled Purchase - due to Failed invoice - Show status and actionable button in purchase details pop-up ready

Client has purchased a recurring package

The coach schedule to cancel the purchase

End the cancel date has been over

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”**Canceled**”

    1.  If canceled by failed trial package

        1.  The failed invoice is a recharge successfully  
            \--> Active

2.  → no action buttons for both one-time and recurring

3.  Show an alert message if the canceled status is triggered by the failed payment after the trial period  
    ”Cancelled Due to Payment Failure  
    The client's first payment after a free trial failed. To reactivate the package, retry payment on the overdue invoice.”  
    \--> Don't show this alert if package is canceled by coach or client.

4.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  icon + “Price”

        1.  ONE TIME  
            ”{currency symbol}{price of package} One time”

        2.  RECURRING

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

    2.  icon + “Cancelled on”  
        {Cancelled date}

        Format: May 1, 2026  
        {date}--> The overdue date that payment is failed → purchase is cancelled

    3.  icon + “Trial ended on”  
        {Date} → Date the the trial ended

    4.  icon + "Payment method”  
        {Card type} •••• {last 4 digits}"

    5.  Hide other fields if it’s moved from other status

Payment V1

#### AC 13: Canceled Purchase - due to coach/client initiated - Show status and actionable button in purchase details pop-up ready

Client has purchased a recurring package

The client schedule to cancel the purchase

End the cancel date hasn’t been over

I go to view the purchase detail pop-up

1.  I should see the purchase status:  
    ”**Cancelled**”

    1.  This status won't be changed

2.  → no action buttons

3.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  icon + “Price”

        1.  ONE TIME  
            ”{currency symbol}{price of package} One time”

        2.  RECURRING

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

    2.  icon + “Cancelled on”  
        {Cancelled date}

        Format: May 1, 2026  
        {date}--> The date the purchase will be cancelled

    3.  Cancel requested on  
        {date} requested date

    4.  icon + "Payment method”  
        {Card type} •••• {last 4 digits}"

    5.  Hide other fields if it’s moved from other status

Payment V1

#### AC 14: Update UI for Payment request ready

I send client a payment request

I go to view the purchase detail pop-up

1.  Header:

    1.  If the client status is connected  
        \--> show as the AC 1

    2.  Client is new  
        \--> Show default avatar (grey one)  
        \--> And coach

2.  Show package name in the View Package field  
    \--> Keep as current behavior

3.  Show package name  
    \--> keep as the current behavior

4.  No action buttons

5.  PRICING PLAN section: Data: Pricing and payment method info  
    \--> Meaning: Show the next invoice. If there is not next invoice, show the last invoice.

    1.  icon + “Price”

        1.  ONE TIME  
            ”{currency symbol}{price of package} One time”

        2.  RECURRING

            “{currency symbol}{price of package}/{Cycle} . {x} times”  
            \--> Hide “. {x} times” if it's recurring forever

Payment V1

Current UI:

#### AC 15: Show Resend activation email button for purchase hasn't been activated ready

Client has made a purchase/trial

And Client hasn't activated the package

Coach click to view purchase detail pop-up

I should see:

-   Resend Activation Email + email icon  
    \--> This button only displays if the package hasn't been activated

-   Hover over the button  
    \--> Show the underline below the hyperlink button

Note: hide this button if the purchase is activated

Payment V1

Current UI

#### AC 16: Total paid and View invoice table ready

Client has made a purchase/trial

Coach click to view purchase detail pop-up

The invoice table should show:

1.  If no invoice to show (This only has for Free Trial purchase):

    1.  icon + No invoices yet

    2.  Description  
        ”Invoices will appear here once payments are made.”

2.  If having an invoice,

    1.  Show the total paid  
        ”Total Paid: {symbol}{Total}”

    2.  show the table including columns:

        1.  Invoice #  
            \--> Show invoice ID like current behavior

        2.  Payment Due  
            \--> Data kept as current behavior

        3.  Billing Cycle  
            \--> Show billing cycle  
            {Start date} - {End date}

        4.  Amount  
            \--> keep as current format

        5.  Status  
            in {Paid, Failed, Overdue, Canceled, Pending, Expired}

        6.  Actionable button for specific invoice status: → AC 17 to AC 22

Payment V1

Payment V1

Current UI

#### AC 17: Paid invoice - Show eclipse buttons with refund featur & update UI of refund pop-up ready

Invoice is paid

WS has the Refund feature ON

I go to the Purchase detail pop-up

I click on eclipse button of paid invoice

1.  If the refund feature is on for WS  
    \--> Show a “Refund” button,  
    Functional: Work as the current behavior

    1.  Update UI when click on this button

        1.  Update color of the 2 first containers background

        2.  Icon of the first container

        3.  Update the title style/font/size/color

        4.  Dropdown component

            1.  Click/hover state

        5.  Details box

    2.  After Click refund, if waiting for stripe return result, the status of invoice will be pending  
        And there is no buttons on the invoice

2.  If the refund feature is OFF for WS  
    \--> No function to show

Payment V1

Current UI

#### AC 18: Overdue invoice - Show Cancel Invoice function ready

Invoice is Overdue

I go to the Purchase detail pop-up of that invoice

I click on eclipse button of ovedue invoice

I should see functions show in the invoice:

1.  Recharge Invoice

2.  Cancel Invoice

→ Work as current behavior

Payment V1

#### AC 19: Cancelld status - No actionable button Need design

Invoice is Canceled

I go to the Purchase detail pop-up of that invoice

I click on eclipse button of cancelled invoice

→ Don't have any button in the invoice

#### AC 20: Pending invoice - Show resend and cancel functions and update UI for Resend Payment request pop-up ready

Invoice is Pending

I go to the Purchase detail pop-up of that invoice

I click on eclipse button of pending invoice

I should see functions show in the invoice:

1.  Resend Payment Request

2.  Cancel Payment Request

→ Work as current behavior

And when I click on Resend function  
\--> **The “Resend Payment Request?” popup should be updated the component, please check design**

-   Title

-   Text: font, size

-   “Payment is due {<>} from the date the payment request is sent

-   Cancel

-   Resend

Payment V1

Payment V1

Current UI:

#### AC 21: Expired invoice - show resend ready

Invoice is Expired

I go to the Purchase detail pop-up of that invoice

I click on eclipse button of expired invoice

I should see functions show in the invoice:

1.  Resend Payment Request

2.  Cancel Payment Request

→ Work as current behavior

Payment V1

#### AC 22: Failed invoice - Show Retry ready

Invoice is Failed

I go to the Purchase detail pop-up of that invoice

I click on eclipse button of failed invoice

I should see functions show in the invoice:

1.  Recharge Invoice

→ Work as current behavior

Payment V1

Currnt UI:

#### AC 23: Show the data for the purchase that coach select from dropdown ready

I am in the Purchase details pop-up

I select a purchase from the View Packages dropdown list

1.  If data is loading → show skeleton loading

2.  Show data after loaded

    1.  Purchase infor

    2.  invoices

Payment V1 Payment V1

#### AC 24: Show all purchase, if coach select view “All Packages” option ready

I am in the Purchase details pop-up

I select “All Packages”

1.  Hide Pricing Plan section

2.  Show the “All Packages” in the Packagge name position

3.  Add Package column to table  
    \--> Work as the current behavior

Payment V1

Current UI

### User Story 5: Package details with discount

**Pre-condition:**

-   Coach has the access to the Payment & packages

#### AC 1: Show discount for One time with/without trial purchase ready

Client purchases a one-time package with/without a trial and applied the promo code

I open the purchase detail pop-up

I should see:

1.  Discount:

    1.  Based on the applied purchase, show:

        1.  Percentage

            1.  Show  
                {x}% off

        2.  Amount off

            1.  {currency symbol}{Amount} off

    2.  HOver over the discount to show the tooltip with content

        1.  If no trial  
            **Promo Code: <promo code>**

        2.  if during trial  
            **Promo Code: <promo code>**

            Discount will be applied after free trial ends.

        3.  If Trial duration ended  
            **Promo Code: <promo code>**

2.  Price of purchase with the strikethrough format  
    {currency symbol}{Amount}  
    Example: $30.00

3.  The amount that the client needs to pay after applying the promo code  
    {currency symbol}{amount} one time  
    E.g: $25.50 one time

-   One time without Trial: Payment V1

-   One time with trial: Payment V1

#### AC 2.1: Fixed term or forever Recurring subscription w/ one-time discount without trial ready

Client purchased a Recurring subscription without trial

And w/ one-time discount:

-   Fixed term package

-   Forever recurring package

I open the purchase detail pop-up

\--> Won't show any discount since it's over

#### AC 2.1: Fixed term or forever Recurring subscription w/ one-time discount with trial period ready

Client purchased a Recurring subscription **with a trial period**

And w/ one-time discount:

-   Fixed term package

-   Forever recurring package

I open the purchase detail pop-up

1.  I should see discount **during the trial period**

2.  Hover over the discount  
    \--> Show the tooltip  
    ”**Promo Code: <promo code>**  
    Discount will be applied to the first payment.”

3.  Remove the discount and its tooltip if the trial ended

Payment V1

#### AC 3.1: Recurring subscription forever w/ number of invoiced applied discount --> will show discount if discount on next invoice ready

Client purchased a Recurring subscription forever with/without trial

w/ number of invoiced applied discount

-   Promo code duration: Number of invoice

I open the purchase detail pop-up

I should see discount **if discount on next invoice**

1.  Discount:

    1.  Based on the applied purchase, show:

        1.  Percentage

            1.  Show  
                {x}% off

        2.  Amount off

            1.  {currency symbol}{Amount} off

    2.  Hover over the discount to show the promo code rule in a tooltip  
        “**Promo Code: <promo code>**  
        Discount will be applied to the first X payments.”  
        X: --> x = total invoices allowed for discount - existing payments, so it is how may discount payments are left, not the total

        If the date is in the past, the tooltip should be disappared.

2.  Price of purchase with the strikethrough format  
    {currency symbol}{Amount}  
    Example: $30.00

3.  The amount that the client needs to pay after applying the promo code  
    {currency symbol}{amount}/{billing cycle}  
    Example: $25.50/month  
    $25.50/ 2 months  
    $25.50/week

Payment V1

#### AC 3.2: Show the discount for the forever recurring subscription with if the last invoice is applied promo code (cancel subscription) ready

Client purchased a fixed recurring subscription with/without trial

and applied promo code with duration:

-   Number of invoices

The next invoice is applied promo

But the subscription is cancel or scheduled to be canceled at next renewal

I always see discount **being displayed in the price**

But the tooltip should be hidden if there is no more renewal invoice

#### AC 4: Recurring subscription forever w/ all recurrring payment applied discount--> will always show discount ready

Client purchased a Recurring subscription forever with/without trial

w/ all recurrring payment applied discount

-   Promo code duration: All recurring payments

I open the purchase detail pop-up

I always see discount **being displayed in the price**

1.  Discount:

    1.  Based on the applied purchase, show:

        1.  Percentage

            1.  Show  
                {x}% off

        2.  Amount off

            1.  {currency symbol}{Amount} off

    2.  Hover over the discount to show the promo code rule in a tooltip  
        ”**Promo Code: <promo code>**  
        Discount will be applied to all payments.”

2.  Price of purchase with the strikethrough format  
    {currency symbol}{Amount}  
    Example: $30.00

3.  The amount that the client needs to pay after applying the promo code  
    {currency symbol}{amount}/{billing cycle}  
    Example: $25.50/month  
    $25.50/ 2 months  
    $25.50/week  
    $25.50/2 weeks

Payment V1

#### AC 5: Fixed-term recurring subscription w/ number of invoiced applied discount --> will show discount if discount on next invoice ready

Client purchased a fixed term recurring subscription with/without trial

w/ all recurrring payment applied discount

-   Promo code duration: Number of Invoices

I open the purchase detail pop-up

I should see discount **if discount on next invoice**

1.  Discount:

    1.  Based on the applied purchase, show:

        1.  Percentage

            1.  Show  
                {x}% off

        2.  Amount off

            1.  {currency symbol}{Amount} off

    2.  Hover over the discount to show the promo code rule in a tooltip  
        “**Promo Code: <promo code>**  
        Discount will be applied to the next x payments.”

        X: --> x = total invoices allowed for discount - existing payments, so it is how may discount payments are left, not the total

        If the date is in the past, the tooltip should be disappared.

2.  Price of purchase with the strikethrough format  
    {currency symbol}{Amount}  
    Example: $30.00

3.  The amount that the client needs to pay after applying the promo code  
    {currency symbol}{amount}/{billing cycle} . {x} times

    Example: $25.50/month . 4 times  
    $25.50/ 2 months . 2 times  
    $25.50/week . 8 times

Payment V1

#### AC 7: Fixed-term w/ forever discount--> will always show discount ready

Client purchased a Client purchased a fixed term recurring subscription with/without trial

w/ all recurrring payment applied discount

-   Promo code duration: All recurring payments

I open the purchase detail pop-up

I always see discount **being displayed in the price**

1.  Discount:

    1.  Based on the applied purchase, show:

        1.  Percentage

            1.  Show  
                {x}% off

        2.  Amount off

            1.  {currency symbol}{Amount} off

    2.  Hover over the discount to show the promo code rule in a tooltip  
        ”**Promo Code: <promo code>**  
        Discount will be applied to all payments.”

2.  Price of purchase with the strikethrough format  
    {currency symbol}{Amount}  
    Example: $30.00

3.  The amount that the client needs to pay after applying the promo code  
    {currency symbol}{amount}/{billing cycle} . {x} times

    Example: $25.50/month . 4 times  
    $25.50/ 2 months . 2 times  
    $25.50/week . 8 times

Payment V1

#### AC 8: Show the discount for the fix-term recurring subscription with if the last invoice is applied promo code ready

Client purchased a fixed recurring subscription with/without trial

and applied promo code with duration:

-   Number of invoices

-   All recurring payments

And all invoice applied promo code

I open the purchase detail pop-up

I alway see discount **there, just remove the tooltip at the last renewal**

Note for one-time and fixed-recurring, even if there is no additional invoice, I think we should still show the discount that was on the last invoice.

### User Story 6: Coach — View credit issuance rule from a purchased package

As a Coach, I want to see a rule of session credits issued from a specific client's package purchase, so that I can verify the correct credits were issued for each payment cycle.

**Pre-condition:**

-   Booking feature is enabled for WS

-   WS have the payment & packages add-on

#### AC 1: View Pricing plan - Session credit ready

Client has made a purchase/trial with Session Credit setup

Coach click to view purchase detail pop-up

I view the PRICING PLAN section: Session Credit info of the purchase details

I should see Session Credit info

1.  Section name: coin icon + “Session Credits”

2.  Info on credits

    1.  {Amount of credit} credits / {cycle}

        1.  Amount of credit: This is the amount of credit that will be issued to clients

        2.  {Cycle} cycle of the purchase  
            \--> hide cycle for one-time purchase

3.  Show button + downward arrow → Collapsed as default

    1.  Click on the show button → Expand the list of session credits that will be/have been issued to the client  
        \--> The show button + downward arrow changed to “Hide” button + upward button. Click on it to go to the default state  
        \--> Data: get list of session types from the package price at the time the client purchased the package (package snapshot)

    2.  Each session type includes

        1.  Color of session type

        2.  Session type name  
            Long name: Show max in 330px and cut off with “…”

        3.  Tooltip  
            \--> Hover to see details of the session type

            1.  Name

            2.  Duration

            3.  Location type

            4.  Session type

        4.  {amount of credit will be issued}/{cycle of purchase}

    3.  Show “View issued credits” button  
        \--> Click on it to naviagte to the client Sessions/Credits tab

        1.  The button should be disabled if purchase hasn’t been activated  
            Hover over the disabled status to show the tooltip  
            "Client has to activate purchase before credits can be issued."

Payment V1

#### AC 2: Hide the session Credit component if Client purchase a package without credit ready

Client has made a purchase/trial without credit set up

Coach click to view purchase detail pop-up

I view the PRICING PLAN section

I should not see the Credits component in the PRICING PLAN section

### User Story 7: Issue credits when client purchases the package and the payment is successful and package is activated

As the System, I want to automatically issue session credits when a client's payment is successful and purchase is activated, so that coaches don't need to issue them manually.

#### AC 0: Logic to issue session Credit for clients ready

Coach set the credits for package

Client purchased the package from:

-   Package link

-   Payment request

1.  For a one-time package without a trial:

    1.  Credits issued on successful purchase and package is activated

        1.  Expiration should start from the day of payment succeed (first day of the billing cycle)

    2.  No credits for failed payment and package isn't activated

2.  For one time with trial

    1.  No credits during free trial

    2.  Credits are issued on the first paid billing cycle after the trial and purchase is activated

        1.  No credits for failed payment

        2.  Failed invoice → charge successful and package is activated→ issue credits

        3.  Expiration should start from the day after the trial end

3.  For recurring package:

    1.  If the package has a trial:

        1.  No credits during free trial

        2.  Credits are issued on the first paid billing cycle after the trial

        3.  Credits are issued on successful renewal and package is activated

        4.  No credits for failed payment

            1.  Overdue invoice → charge successful and package is activated→ issue credits

            2.  Expiration start from the first day of the billing cycle, not the payment successful date

    2.  Package without trial

        1.  Credit is issued on the first paid billing cycle

        2.  Credits are issued on successful renewal and package is activated

        3.  No credits for failed payment

            1.  Overdue invoice → charge successful → issue credits

            2.  Expiration should start from the first day of the billing cycle, not the payment successful date

And **no credits issued when the Booking feature is disabled**

---

The issued credits will be reflected in:

1.  Client profile → after package is activated

2.  Purchase details: **Handled in US 4**

    1.  After the payment is successful

#### AC 1: Issue credits after payment succeed for One time package without trial ready

WS has Booking enabled  
Package has session credits configured  
Package has no free trial

Client successfully pays for the one-time package

from:

-   Package link

-   Payment request

with/without logging in

**And the purchase is activated**

1.  Credits are issued on the paid invoice after the trial  
    → Increase available credits for the client based on what the coach set up

    1.  Balance: total number of available credits

    2.  Balance of each session type

    3.  Amount credits in the Client profile/Overview/Session component

    4.  Event in the Updates section:  
        "**Client name** was issued X credits from payment of <package name> package."

    5.  In-app notification for a coach who manages a client  
        $ icon + "**Client name** was issued X credits from payment of <package name> package.."

        **Clicking the notification:**

        -   Web → Goes to client's Sessions tab, anchored to the Credits tab

        -   Mobile → Goes to client profile / Overview tab _(same navigation as P1.0)_

    6.  Balance History records the issuance event with the package name as the source

        1.  Date

        2.  Event: Issued

        3.  Amount

        4.  _{Package name}_

            1.  _(clickable link → Purchased Package Details pop-up)_

                1.  Only the coach has the permission to access payment & packages can be brought to the purchased package details

                2.  Others: Should not be clickable

            2.  Hover to view full name of package

2.  Expiration should start from the day of payment succeed

Payment V1

Payment V1

#### AC 2: Issue credits after payment succeed for One time with trial Ready

WS has Booking enabled  
Package has session credits configured  
Package has a free trial

Client starts the free trial

from:

-   Package link

-   Payment request

with/without logging in

**And the purchase is activated**

1.  No credits are issued during the trial period

2.  When the first paid invoice is successfully charged after the trial ends, credits are issued per the package's credit configuration  
    → Increase available credits for the client based on what the coach set up, defined as AC 2

3.  No credits are issued if the first paid invoice fails

    1.  Failed invoice: If recharge successful  
        → issue credits

    2.  **Expiration should start from the first day of the billing cycle, not the payment successful date**

#### AC 3: Issue credits after payment succeed for Recurring with trial Ready

WS has Booking enabled  
Package has session credits configured  
Package has a free trial and recurs

Client starts the free trial

from:

-   Package link

-   Payment request

with/without logging in

**And the purchase is activated**

1.  No credits issued during the trial period

2.  Credits are issued on the first successful paid billing cycle after trial  
    → Increase available credits for the client based on what the coach set up, defined as AC 2

3.  Credits are issued on each subsequent successful renewal  
    → Increase available credits for the client based on what the coach set up, defined as AC 2

4.  No credits are issued when any renewal invoice fails payment

    1.  Failed invoice: If recharge successful  
        → issue credits

    2.  Overdue invoice: If recharge successful  
        → issue credits

    3.  Expiration should start from the first day of the billing cycle, not the payment successful date

#### AC 4: Issue credits after payment succeed for Recurrring without trial Ready

WS has Booking enabled  
Package has session credits configured  
Package has no free trial and recurs

Client successfully pays the first invoice

from:

-   Package link

-   Payment request

with/without logging in

**And the purchase is activated**

1.  Credits are issued on the first successful billing cycle  
    → Increase available credits for the client based on what the coach set up, defined as AC 2

2.  Credits are issued on each subsequent successful renewal  
    → Increase available credits for the client based on what the coach set up, defined as AC 2

3.  No credits are issued when any renewal invoice fails payment

    1.  Overdue invoice: If recharge successful  
        → issue credits

    2.  Expiration should start from the first day of the billing cycle, not the payment successful date

#### AC 5: Issue credits when purchase is activated later of successful payment Ready

WS has Booking enabled  
Package has session credits configured  
Package

Client purchased the package

And they payment has made one or multiple cycles

1.  The session credit should not be issued since the purchase hasn't been activated

2.  If client activated the purchase later  
    \--> Issue all credits clients and the expiration date should be based on billing cycle date, not the payment successful date or activation date

3.  When issuing credits that if the expiration is in the past, we immediately expire them. The Balance History would show that they were issued and expired on the same day.

#### AC 6: Archived client — issuance continues Ready

Client has been archived AND the Purchase is still active AND the payment is paid

A successful paid cycle occurs

Credits are issued as normal. Archive does not block issuance. _(Already-issued credits follow P1.0 client-archive display rules.)_

### User Story 8: Update session type info

#### AC 1: Update to Session type in the Package Pricing and Purchase details pop-ups and package overview if it's updated Ready

I created the Sesion Type that requires credit

I update the session type information

I should see it's updated in:

-   Package Pricing pop-up: Dropdown and after populated

    -   Color

    -   Name

    -   Duration

    -   Location

    -   Type

-   The package overview

    -   Color

    -   Name

-   Purchase details pop-up

    -   Color

    -   Name

    -   Duration

    -   Location

    -   Type

-   Balance history: as the P1.0

#### AC 2: Blocked if the session type is in a published package rule Ready

-   Session type requires credit

-   Session type is in a package session credit rule

-   The associated package is published

Coach tries to archive the session type

1.  Coach is blocked from archiving the session type

2.  Coach sees a pop-up that block them from archiving that session type:

    1.  Title: “**Session Type In Use”**

    2.  X button to close the pop-up

    3.  Description:  
        ”This session type is configured in the session credit rules for a published package. To archive this session type, you must remove the session type from the package or unpublish the package.”

    4.  Button: OK  
        \--> Click on it to close the pop-up

3.  If the coach removes the session type from the package or unpublishes the package, they can archive the session type

4.  If the removes the session type from the package or unpublishes the package and then archives the session type, existing purchases will still issue that session type’s credit following their purchases version of the packages.

That is okay for now. If the coach wants to stop that, they need to go and cancel the purchase.

Payment V1

#### AC 3: **“require credit” rule** on a session type, I am blocked if the session type is in a package session credit rule Ready

-   Session type requires credit

-   Session type is in a package session credit rule

Coach tried to turn off the session type “require credit” rule

-   Coach is blocked and sees that they can no longer change this rule because there is a package with a session credit rule with this session type.

-   If the session type doesn’t have any linked sessions yet, issued credit, or the package hasn’t had any purchases, the coach can go remove the session session type from the package and then technically come back and turn off the “requires credit” toggle.

Message of tooltip  
”This setting is locked because this session type is already linked to existing sessions, issued session credit, or is in a package session credit rule.”

### User Story 9: Update Client Purchase list pop-up in client Profile Overview

#### AC 1: Show all purchase status of client Ready

As a coach who has the permission to access Payment & Packages

I am in the client profile/Overview tab

I click on View {n} Active Packages hyperlink button.

1.  I should see status of the purchase should be reflected in the Purchases pop-up

2.  The statuses need to reflect the new defined status text/color/style

3.  Update Hover/click status when hovering/clicking on each row

4.  Keep current behavior: Click on each of package to navigate to the Purchase detail pop-up in the package analytic page

Current UI:

### User Story 10: User Terminology

#### AC 1: Update the user terminology based on what coach set up in their account settings Ready

Coach set up the user terminology on their settings

I view the places having user terminology item

It should update based on coach setups

1.  Message for session credit if both Trial and Session credit toggle ON:  
    “Credits will be added to client account after the free trial ends and the first payment is successfully processed.”

2.  Purchase detail pop-up  
    Message in alert overduew status:  
    “Please have the client update their payment method or fix the issue with their bank. You can retry payment on the invoice.”

3.  “View issued credits” button with the disabled status → Hover over to see the tooltip  
    “Client has to activate purchase to issue credits.”

### User Story 11: WS lost the Payment and packages feature ready

#### AC 1: Keep all existing data of session. credit and don't issue credit via package if Payments & Packages feature is OFF ready

WS has Booking feature and Payment & Packages ON

There are clients issued credits via package

Payment & Packages feature is OFF

1.  Keep all the data there in the balance and history of client that issued through packages

2.  No more credits isssued via package if the feature is OFF

3.  Coach should not click on hyperlink from Histoy table

#### AC 2: Show all historical data again if WS purchase the P&P again ready

WS has Booking feature and Payment & Packages ON

There are clients issued credits via package

Payment & Packages feature is OFF

The Payment & Packages feature is ON again

All the historical data about session credit in the package analytics should be shown again → follơing logic of the Payments & packages feature

### User Story 12: System — Hide session credit UI when Booking feature is not enabled ready

As the System, I want to suppress all session credit UI and issuance when a WS does not have the Booking feature enabled, so that coaches without Booking are not exposed to credits functionality they cannot use.

**Pre-condition:** WS does **not** have the Booking feature enabled

#### **AC 1: Hide all UI relevant to Session Credits if Booking feature is OFF for WS** ready

WS has Booking feature ON

Booking feature is OFF

1.  Packages shouldn’t show sessions credits

2.  The client profile shouldn’t show the Sessions tab

3.  The client profile Overview tab shouldn’t show the Upcoming Session section.

Dan’s comment:

Right now we are not tying Booking to payment/a paid plan, only the feature flag. We’ll have to do a special release for all that later on, once we are ready to move out of Beta. Session Credits should only show in the package if the Booking feature flag is enabled and we still need to discuss if we are building a Session Credits feature flag for now or not.

For now we need to hide everything behind the Booking feature flag. If the Booking feature flag is not enabled:

1.  The Calendar section of the nav won’t show

2.  Packages shouldn’t show sessions credits

3.  The client profile shouldn’t show the Sessions tab

4.  The client profile Overview tab shouldn’t show the Upcoming Session section.

I think right now we shouldn’t build anything to delete any data, so if there are scheduled sessions or issued credit, we can just leave that. We can ask the coach to cancel all sessions and delete all credit before turning off the feature flag.

Later we can build in logic on what to delete. We can wait until we are closer to moving out of Beta and tying the feature to a paid plan. Due to forced downgrades to Starter due to failed payment, we’ll likely need to keep the session and credit data for a few days and then have a job to delete it. Also ensure that email and mobile notifications don’t go out if the feature flag is off.

#### AC 2: Click on notification while lost the Booking access ready

WS has Booking feature ON

Booking feature is OFF

-   Coach web: Nothing happen

-   Mobile: Keep navigating to the client overview tab

#### AC 3: All data is saved and show to coach again if feature flag is turn ON ready

WS has Booking feature ON

Booking feature is OFF

All data should be saved

And data will be shown again if feature turned on

### User Story 13: Migration data for existing packages

#### AC 1: Migrate data for Packages information of all existing package ready

WS has existing packages

Coach open the package Overview and Pricing pop-up

I should see new UI for this page and all data of existing package should be populated.

And coach can set the Credits for those packages

#### AC 2: Migrate data for all purchases ready

WS has existing purchase

Coach open the purchase details pop-up

I should see new UI for this pop-up and all data of existing purchase should be populated and mapping with new UI and status