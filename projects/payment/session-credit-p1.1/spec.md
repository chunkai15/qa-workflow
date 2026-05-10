# [Spec P1.1] - Session Credit Expiration
> **Source Confluence page:** https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration

## 2) Review notes (quick QA)

### 2.1 Missing / placeholder

* State machine diagram section is empty (only header).
* Document Logs table is empty.

### 2.2 Inconsistencies / clarity gaps

* Ordering wording conflict:
  * In User Story 2 (visibility) groups are ordered the soonest expiration date first.
  * In User Story 3 AC 2 it says “ordered by exp date DESC, then non-exp date”.  
* Expiring soon alert rule:
  * Text says “expiring in 7 days” and also “if a session credit expires ≤ 7, we won’t alert.”  
* Timezone / “today” definition:
  * “Expires on: {DATE} where DATE = today + N period” does not define which timezone.  
* Expire window behavior:
  * “Expire window should be 1 hour” is not fully detailed (job cadence, idempotency, etc.).  
* Early cancel edge case:
  * “It should expire immediately after being returned” is not explicit about ordering between returning and expiring in activity history.

---

## 3) Background

### 3.1 Objective

* **For Everfit:** Add expiration logic on top of the P1.0 Session Credits foundation so coaches can set credits to automatically expire after a defined period.
* **For Coaches:** Help coaches manage their session credit liability by setting expiration rules at issuance and being alerted before credits expire so they can take action.

### 3.2 Context

* 5/5 coaches interviewed said they want session credits to expire.
* This release builds directly on P1.0. All P1.0 infrastructure (`session_credits` table, `session_credit_transactions`, balance display, Activities table) must be in place before P1.1 ships.
* Expiration is always set at the point of issuance — there is no workspace-level default rule in this release.
* Expiration rules match Trainerize: up to 365 days, 52 weeks, or 36 months.
* Only coaches (not clients) are notified in this release.

### 3.3 Release Summary

| Feature | Description |
| --- | --- |
| Expiration Rule | Coach can set an expiration rule (or no expiration) when issuing credits |
| Expiration Application | System auto-expires credits when `expiration_date` passes; records in Activities |
| Expiration Balance Visibility | Coach can see expiration dates in the client's credit balance, grouped by expiry date |
| Expiring Soon Alerts | Coach receives a 7-day in-app notification and sees a non-dismissible alert on the client profile |

### 3.4 Not in Scope

* Selecting a specific calendar date for expiration
* Client-facing expiration notifications
* Workspace-level default expiration rules
* Expiration rules at the package level (future)

---

## 4) State machine diagram

* (Not included in this spec content.)

---

## 5) Pre-conditions

* **Booking Feature Access:** WS must have the Booking feature enabled
* **User Role:** Coach is Owner, Admin, or Trainer
* **Client Status:** Client must be connected for credit issuance; expiration still applies to archived clients' credits

---

## 6) Requirements

### 6.1 Document Logs

| **Date** | **What changed** | **Version** | **Note** |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |

---

## 7) User Story 1: Set Expiration Rule at Issuance

**As** a coach  
**I want** to set an expiration rule when issuing session credits  
**So that** I can control how long a client has to use their credits before they automatically expire  

**Pre-condition:**

* WS has the Booking feature enabled

**Background:**

* The expiration rule is always set at the point of issuance — it cannot be changed after credits are issued
* Rules match Trainerize limits: days (max 365), weeks (max 52), months (max 36)
* Coach can also choose "Do not expire" for credits with no auto-expiration
* All credits in the same issuance batch share the same expiration date: `expiration_date = created_at + N period`

https://everfit.atlassian.net/browse/PAY-2030  

---

### US1 — AC 1: Show "Expires" field in "Issue Session Credits" modal (ready)

**GIVEN**

* WS has access to the Booking feature. I am viewing a connected client's Sessions tab

**WHEN**

* I click the "Issue Credits" button

**THEN**

1. The "Issue Session Credits" modal shows an **"Expiration"** field below "Amount to add":
   * Default state: dropdown showing **"Expires after"** + textbox + a period dropdown (Days / Weeks / Months).
   * Click on the expiration dropdown options to show:
     * **Doesn't expire**
     * **Expires after**
       * Highlight the background of the hovering option.
       * The current selected option should have the check mark.
   * When "Doesn't expire" is selected:
     * Hide the textbox and the duration dropdown.
   * When "Expires after" is selected:
     * Show a number input field + a period dropdown (Days / Weeks / Months).

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4345-1117116&t=CCl6GMzfSeOEYX6w-1  

---

### US1 — AC 2: Coach selects "Expires after" and inputs a valid expiration rule (ready)

**GIVEN**

* "Issue Session Credits" modal is open; I have selected "Expires after"

**WHEN**

* I input/select a number and select a period (Days / Weeks / Months)

**THEN**

1. Number input accepts only positive integers (minimum 1).
2. Click on the box: show the list of options for the coach to select.
   * If duration = days  
     --> Show options in [7; 14; 30; 60; 90; 180; 365]
   * If duration = weeks  
     --> Show options in [1; 2; 4; 8; 12; 24; 52]
   * If duration = months  
     --> Show options in [ 1; 2; 3; 6; 9; 12; 18; 24; 36]
3. Hover over the option: highlight the background.
4. Click on the option to show it in the text box and collapse the list of options.
5. Allow the coach to type the number of periods:
   * Collapse options.
   * And show the number that the coach typed.
6. Period dropdown shows: Days, Weeks, Months.
   * Highlight the background for the hovering option.
   * The selected option should have a checkmark.
7. Show calculated expiration preview below:
   * **"Expires on: {DATE}"**  
     where DATE = today + N period.
8. "Issue Credits" button is enabled when all required fields are prefilled.

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4850-482057&t=CCl6GMzfSeOEYX6w-1  

---

### US1 — AC 3: Validation — expiration limit exceeded/lower than limit (ready)

**GIVEN**

* "Issue Session Credits" modal is open; I have selected "Expires after"

**WHEN**

* I enter a number that exceeds the period limit and click outside of the box  
  OR Coach changes the duration, which makes the number of durations invalid

**THEN**

1. Show an inline error below the expiration field + highlight border in red if the coach enters a number greater than the limit:
   * Days > 365 → "Must be 365 days or less"
   * Weeks > 52 → "Must be 52 weeks or less"
   * Months > 36 → "Must be 36 months or less"
2. Show an inline error below the expiration field if the coach enters 0:
   * Show inline error + highlight border in red:
     * ”Must be greater than 0”
3. "Issue Credits" button is disabled until the validation is corrected.
4. Hide the “Expires on: **{date}**” if error shown:
   * Only show this field when the coach enters a valid number.

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4345-1117116&t=CCl6GMzfSeOEYX6w-1  

---

### US1 — AC 4: Successful credit issuance with expiration rule (ready)

**GIVEN**

* WS has access to the Booking feature; Connected client's Sessions tab is open

**WHEN**

* I fill all required fields, including an expiration rule, and click "Issue Credits"

**THEN**

1. Credits are issued successfully.
2. `expiration_date` is stored on the session_credit record.
3. All credits in the batch share the same `expiration_date`.
4. Toast: **"Session credit has been issued."**
5. Balance section updates:
   * Credit for the session type shows the expiration date.
   * The credit balance is accumulated for the same expiration date. (View UI in US 3)

**FIGMA / ADDITIONAL NOTES**

* The `expiration_date` is immutable once set — it cannot be edited after issuance.

---

### US1 — AC 5: Successful credit issuance with "Do not expire" (ready)

**GIVEN**

* WS has access to the Booking feature; Connected client's Sessions tab is open

**WHEN**

* Coach fills all required fields, leaves "Do not expire" selected, and clicks "Issue Credits"

**THEN**

1. Credits are issued with `expiration_date = NULL`.
2. These credits are never auto-expired by the system.
3. The balance section should be accumulated by the amount added.
4. The credit expiration group shown below the session type of clients without an expiration date is displayed.
5. Toast: **"Session credit has been issued."**

**FIGMA / ADDITIONAL NOTES**

* No expiration label or date is shown for "Do not expire" credits — only show expiration info when an expiration date exists. This is cleaner than Trainerize's "(Do not expire)" parenthetical.

---

## 8) User Story 2: Balance — Expiration Date Visibility

**As** a coach  
**I want** to see when a client's session credits will expire or expire soon in their profile  
**So that** I can proactively book sessions before credits are wasted  

**Pre-condition:**

* WS has the Booking feature enabled

**Background:**

* The balance card for each session type may have credits with different expiration dates (because the coach issued multiple batches at different times with different rules).
* Credits should be grouped by expiration date within the session type card.
* We do NOT show "Do not expire" text — only show expiration info when an expiration date exists.

https://everfit.atlassian.net/browse/PAY-2031  

---

### US2 — AC 1: Add the expirations section to the Session Credit Type details pop-up

**GIVEN**

* Client has available credits for session type with expiration rules

**WHEN**

* Coach goes to the Credits tab and click on a Session type in the Balance section

**THEN**

1. Should see the “EXPIRATIONS” section in the Session Type details pop-up.
2. Credits of a session type are grouped:
   * Same year → don't show year  
     E.g: "3 credits expiring Mar 31"
   * Different year  
     E.g: "3 credits expiring Mar 31, 2027"
   * Credits with no expiration date show: `{y} credit(s) don't expire` with no expiration label.
3. Group examples:
   * Group 1: "3 credits expiring Mar 31" (soonest, shown first)
   * Group 2: "2 credits expiring Apr 30, 2027"
   * Group 3: "4 credits don't expire" (no expiration, shown last)
4. Total available credits = the sum of all groups.
5. Groups are ordered by the soonest expiration date first.
6. The system accumulates credits for clients with the same expiration date when issuing credits.
7. Don't show any batch if that session type doesn't have the exp date for all credits.

**Note: Single/plural rule**

* If x = 1 → “1 credit expiring”  
  x > 1 → “{x} credits expiring”
* y = 1 → 1 credit doesn't expire  
  y > 1 → {y} credits don't expire
* If all credits don't have exp → don't show any exp group

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7958-1137366&t=AHOCq0tNAiPfQ8I5-1  

---

### US2 — AC 2: System sends a notification for all expiring batches based on daily job for each client (readY)

**GIVEN**

* A client has credits for a/multiple session types, expiring in 7 days; OR one session type has multiple batches with different expiration dates in 7 days

**WHEN**

* The system alert job runs

**THEN**

1. Coach receives in-app notification:
   * $ icon + **"{Client name}** has {X} session credits that will expire in 7 days on {DATE}."
   * Example: "Esther Howard has 4 session credits that will expire in 7 days on Mar 10, 2026."
   * Noti category: Admin.
   * No settings for this in-app noti.
2. Clicking the notification:
   * On web: Navigates to the Sessions tab on the client profile.
   * On mobile app: Navigate to the Overview tab of the client profile.
3. x = 1 → Show “1 session credit”  
   x > 1 → {x} session credits.
4. For now, if a session credit expires ≤ 7, we won’t alert. Later, we will build a WS-level page where the coach can see all credits issued, and there we can highlight credits that will expire sooner.
5. View the updated UI for Credit Balance and Client Overview tab:
   * Credit balance: AC 3
   * Overview: AC 4

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=8132-1368498&t=AHOCq0tNAiPfQ8I5-1  

---

### US2 — AC 3: Expiring soon visual treatment on Credit balance (ready)

**GIVEN**

* Client has session credits that will expire within 7 days

**WHEN**

* Coach views the Sessions tab / Balance section

**THEN**

1. For the session type having credits expire in 7 days:
   * Show one group that will expire soonest.
   * The group should be highlighted in red with content:  
     `{Amount of credits} credit(s) expiring on {date} . in {countdown} day(s)`
2. When coach clicks on that session type:
   * Adding a countdown for the group that expires within 7 days:  
     `{Amount of credits} credit(s) expiring on {date} . in {countdown} day(s)`
   * Highlight all groups that expire within 7 days in red.
3. Countdown:
   * Countdown from 7 to 1.
   * If countdown = 1 → “1 day”.
   * Countdown > 1 → {countdown} days.
4. Amount of credits:
   * Amount of credits = 1 → Show “1 credit expiring”.
   * Amount of credits > 1 → {Amount of credits} credits expiring.

**FIGMA / ADDITIONAL NOTES**

* Having exp: https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4770-1123982&t=AHOCq0tNAiPfQ8I5-1  
* No exp: https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4345-1117116&t=yLEgToyPokjheE27-1  

---

### US2 — AC 4: Non-dismissible alert shown on client profile when credits expire within 7 days (Ready)

**GIVEN**

* A client has `available` credits with `expiration_date` within 7 days

**WHEN**

* Coach navigates to the client profile > Overview

**THEN**

1. A non-dismissible alert banner/element is displayed on the client profile > Overview > Session showing:
   * Show the batch of session credit expiring soonest, highlighted in red.
   * Content: “Expiring in {y} d: $ icon + {x}”.
   * y countdown daily from 7 to 1 (7 → 6 → 5 → ... → 1).
2. If no batch expires within 7 days → don’t show any message there.

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5803-205071&t=H29GqPg8zVfqrqNm-1  (Having batch expires within 7 days)

---

### US2 — AC 5: Alert disappears when credits are no longer expiring soon (within 7 days) (ready)

**GIVEN**

* Client profile shows expiring soon alert

**WHEN**

* Credits expire (past expiration date), OR the coach deletes the expiring credits OR credit is used via a booked session  
* And there is no credits expires within 7 days

**THEN**

* The expiring soon alert for that credit batch is no longer shown in the Session of Client Profile/Overview tab.

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5809-426400&t=AHOCq0tNAiPfQ8I5-1  

---

### US2 — AC 6: Remove the group that doen't have any credit left (ready)

**GIVEN**

* Client has credits for session type with one or multiple issuance groups with different expiration rules

**WHEN**

* All the credits in a group are used/expired/deleted

**THEN**

* Those groups should be hidden from the Balance view.

---

## 9) User Story 3: Delete/Used Credits — Expiration-Aware Priority Order

**As** a coach  
**I want** the system to delete the right credits automatically when I delete from a mixed-expiration balance  
**So that** the most urgent credits are removed first, minimizing waste  

**Pre-condition:**

* WS has the Booking feature enabled

**Background:**

* This updates the P1.0 Delete behavior. Previously: oldest credits deleted first (FIFO). Now with expiration: soonest-to-expire credits are deleted first, then oldest non-expiring credits.
* Coach cannot select _which specific_ credits within a session type to delete.
* Deletion priority: `soonest expiring first → oldest non-expiring (FIFO)`.

https://everfit.atlassian.net/browse/PAY-2032  

---

### US3 — AC 1: Adding tooltip for Amout to Delete field of delete credit pop-up (ready)

**GIVEN**

* Client has been issued credits having outstanding credits

**WHEN**

* Coach clicks on “-” button on a session type that has available credit

**THEN**

* Should see the tooltip beside the “Amount to delete” label.  
  Hover to see the info:  
  ”Credits expiring soonest are deleted first, then the non-expiring credits”

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4838-436624&t=AHOCq0tNAiPfQ8I5-1  

---

### US3 — AC 2: Show the Expiration date and balance of selected session type in “Delete Session Credits” pop-up (ready)

**GIVEN**

* Client has been issued credits having outstanding credits

**WHEN**

* Coach clicks on “-” button on a session type that has available credit  
  OR Click on the X button of the Session type then select another Session type from the Session Type dropdown

**THEN**

1. Show the expiration of the credit balance:
   1. Show a list of expiration dates and their balance, ordered by exp date DESC, then non-exp date.
   2. Each group shows:  
      `{Number of current available balance} credits expiring on {date}`
   3. More than 5 expirations, having scroll:  
      --> View this design: https://www.figma.com/make/AuEEhbCvd3F2RAqeyKpK3d/Make-Credit-Balance-Scrollable?p=f&t=acWPQWiWoT1KJyaF-0&fullscreen=1  
2. Show the expiration of the New credit balance:
   1. Show a list of expiration dates and their balance, ordered by exp date DESC, then non-exp date.
   2. Each group having an exp date shows:  
      `{Number of new available balance} credits expiring {date}`  
      `{Number of new available balance} = {Number of current available balance} - {Amount to delete}`
   3. If {Number of available balance} = 1 → “1 credit expiring      {date}”  
      If {Number of available balance} > 1 → “{Number of available balance} credits expiring       {date}”
3. The group without an exp date, show:  
   ”{y} credit(s) don't/doesn't expire”  
   y = 1 → 1 credit doesn't expire  
   y > 1 → {y} credits don't expire
4. More than 4 expirations, having scroll:  
   --> View this design: https://www.figma.com/make/AuEEhbCvd3F2RAqeyKpK3d/Make-Credit-Balance-Scrollable?p=f&t=acWPQWiWoT1KJyaF-0&fullscreen=1  
5. UI treatment for the group expires within 7 days:
   1. Highlight this group in red.
   2. Adding a countdown from 7 to 1:  
      “{Number of current/new available balance} credits expiring . in {countdown} days              {date}”  
      * counts back from 7 days to 1 day  
      * countdown = 1 → 1 day  
      * countdown > 1 → x days

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=8074-1095065&t=AHOCq0tNAiPfQ8I5-1  

---

### US3 — AC 3: Delete applies expiration-aware priority order (ready)

**GIVEN**

* Client has a session type credit balance with mixed expiration rules (some with expiration dates, some without)

**WHEN**

* I open the "Delete Session Credits" modal, enter an amount to delete, and confirm

**THEN**

* System deletes credits in this order:
  1. Soonest to expire first (earliest `expiration_date`).
  2. If the same expiration date: oldest `created_at` first.
  3. After all expiring credits are consumed: the oldest issued non-expiring credits.
* Example:  
  Balance = 1 credit expires on Mar 31.  
  + 2 credits expire on Apr 30.  
  + 3 credits no-expiration.  
  Coach deletes 2 credits → Mar 31 credit is deleted first (1), then 1 of the Apr 30 credits.  
  --> New balance: 1 credit expiring Apr 30 and 3 credits with no expiration date.

---

### US3 — AC 4: Updated balance and activity reflects correct remaining credits after deletion (ready)

**GIVEN**

* Deletion completes successfully

**WHEN**

* I view the client's Sessions

**THEN**

1. The balance card for the session type shows the updated remaining credits, correctly grouped by remaining expiration date. Credits that were deleted no longer appear.
2. A "Deleted" entry is recorded in the "All" and "Deleted" tabs, showing:
   * date/time
   * action = deleted
   * session type
   * amount {x}
   * coach user
   * Internal note (If have)
3. If you delete the credit that expires soonest within 7 days:
   * Update the Amount of credits that expire within 7 days from the Client Overview  
     (UI covered in US 4: https://everfit.atlassian.net/wiki/spaces/EV/pages/3581968475/Spec+P1.1+-+Session+Credit+Expiration#User-Story-4%3A-Expiring-Soon-Alert%E2%80%94-7-Day-Treatment)

---

### US3 — AC 5: Deduct the credits expiring soonest firs when redeem the credit to a session (ready)

**GIVEN**

* Client has been issued credits with expiritation

**WHEN**

* Coach booked a session requiring credit successfully

**THEN**

* The credits that expire soonest should be deducted first, then the credits doesn't have expiration.

---

## 10) User Story 4: System Auto-Expires Credits at Expiration Date

**As** the system  
**I want** to automatically expire session credits when their expiration date passes  
**So that** coaches don't have to manually clean up expired credits  

**Pre-condition:**

* WS has the Booking feature enabled

**Background:**

* The system runs a scheduled job to check for credits where `expiration_date <= now` and status = `available`.
* Only `available` credits are expired by the system. Credits in `used` status linked to a booked session are not expired by this job.
* The expiration event is recorded in the client's Session Credit Activities and triggers a trainer notification.
* Clients are NOT notified when their credits expire.
* There is no coach user on the expiration transaction — the system performed the action.

https://everfit.atlassian.net/browse/PAY-2034  

---

### US4 — AC 1: System expires available credits when expiration_date passes (ready)

**GIVEN**

* A client has session credits with `status = 'available'` and `expiration_date <= now`

**WHEN**

* The system expiration job runs

**THEN**

1. Expire window should be 1 hour.
2. Credit `status` is updated to `'expired'`.
3. Credit is removed from the client's available session credit balance for that session type.
4. If the session type balance for that group reaches 0, the expiration group row is hidden from the balance card.
5. Show an expired event in the balance History table; the entry shows:
   * Date & Time: date/time of expiration
   * Action: **"Expired"**
   * Session Type: session type name
   * Amount: `{X}`
6. Coach sees in-app notification:
   * $ icon + **"{Client name}** had {X} session credits expire.**"** for coach who manage clients.
   * Clicking the notification navigates to:
     * Web: the Sessions tab on the client profile, anchored to the Session Credit Activities section.
     * Mobile app: Client profile, overview tab.
7. Show an event in the Updates section of the Client profile:
   * $ icon + **"{Client name}** had {X} session credits expire.**"**
   * Click on it: navigates to the Sessions tab on the client profile, anchored to the Session Credit Activities section.
8. Remove the non-dismissible alert from the Client Overview/Sessions:
   * If another group expires within 7 days, then show the soonest batch that will expire.
   * x = 1 → show **"{Client name}** had 1 session credits expires.  
     x > 1 → **"{Client name}** had {X} session credits expire."

**FIGMA / ADDITIONAL NOTES**

* Expiration is system-initiated, not coach-initiated.  
* Updates: https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5809-426400&t=AHOCq0tNAiPfQ8I5-1  

---

### US4 — AC 2: Expiration rule won't be impacted by WS plan or client status (ready)

**GIVEN**

* A client has been archived OR WS has been downgraded to Starter  
  BUT still holds session credits with an expiration date

**WHEN**

* The expiration date passes

**THEN**

* The system expires the credits exactly the same way as for active clients:
  * Balance updated, Activities recorded, trainer notified
  * Booking is already gated on active client status regardless.

---

### US4 — AC 3: Early cancel returns a credit whose expiration_date has passed (ready)

**GIVEN**

* A session was booked using a credit; that credit's expiration_date has since passed; coach performs an early cancel

**WHEN**

* The system tries to return the credit

**THEN**

* It should expire immediately after being returned.  
* The status of credit should be changed from “used” → “expired”.

---

### US4 — AC 4: Adding new “Expired” event to the event filter of history table (ready)

**GIVEN**

* WS has Booking enabled

**WHEN**

* I'm viewing the Balance History section of a client who has been issued credits  
  I click on Event filter

**THEN**

* I should see a new event listed in the activity table called “Expired”, between Voided and the “Deleted” events.

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=8009-467915&t=AHOCq0tNAiPfQ8I5-1  

---

### US4 — AC 5: Filter Balance History by the Expired event

**GIVEN**

* WS has Booking enabled  
* Client has the expired credits

**WHEN**

* I'm viewing the Balance History section of a client who has expired credits  
  I click on Event filter and I click on Expired

**THEN**

1. Balance History should return all Expired events.
2. If no results are found:
   * Show description “No results found.”

**FIGMA / ADDITIONAL NOTES**

* https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=8009-467419&t=AHOCq0tNAiPfQ8I5-1  

---

## 11) Additional information (as written in spec)

* When WS is downgraded, or the client is archived, it won't impact the expiration or the number of session credits of clients.
* When WS doesn’t have Booking enabled, → Hide Sessions tab and Session component. This logic will be handled in the P3.1.
* The expiration rule only impacts the available credits.

---

## 12) Attachments (from Confluence page)

* image-20260409-051242.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647996195%2Fimage-20260409-051242.png
* image-20260409-051214.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3648520389%2Fimage-20260409-051214.png
* image-20260408-080457.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3646685359%2Fimage-20260408-080457.png
* image-20260315-084234.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3606609972%2Fimage-20260315-084234.png
* Session_Credits_P1_1_BE_Logic_DataFlow.md  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3646914838%2FSession_Credits_P1_1_BE_Logic_DataFlow.md
* image-20260318-073024.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3611132116%2Fimage-20260318-073024.png
* image-20260318-081254.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3611984083%2Fimage-20260318-081254.png
* image-20260408-094207.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647209578%2Fimage-20260408-094207.png
* image-20260408-101227.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3646914790%2Fimage-20260408-101227.png
* image-20260408-101043.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3646718167%2Fimage-20260408-101043.png
* image-20260408-095432.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647275170%2Fimage-20260408-095432.png
* image-20260408-100819.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647307903%2Fimage-20260408-100819.png
* image-20260408-101904.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647209603%2Fimage-20260408-101904.png
* image-20260323-074320.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3619618817%2Fimage-20260323-074320.png
* image-20260409-051134.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3648520383%2Fimage-20260409-051134.png
* image-20260408-101918.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3646718176%2Fimage-20260408-101918.png
* image-20260409-051339.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3648356679%2Fimage-20260409-051339.png
* image-20260409-045958.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3648192789%2Fimage-20260409-045958.png
* image-20260316-034817.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3607167117%2Fimage-20260316-034817.png
* image-20260409-051259.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3648520395%2Fimage-20260409-051259.png
* image-20260409-051056.png  
  https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3581968475&preview=%2F3581968475%2F3647963430%2Fimage-20260409-051056.png