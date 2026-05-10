# [Spec P1.0] [Session Credit] - Session Credits

# Background

## Objective

**For Everfit:** Build the foundation for the Booking feature's Session Credits before we layer in package session credit issuance and client self-booking application logic in later releases.

**For Coaches:** Help coaches who are currently doing their own booking and manually tracking sessions issue session credits in Everfit and let Everfit manage session credit application and balances automatically.

## Context

- The Core team is building the parent Booking feature in parallel.
- Session Credits is owned by the Payments team and builds on top of Core's booking functionality.
- This is a foundational release that will later support package issuance and API/Zapier integration.
- Multi-coach support is Booking P4; this release targets single-coach workspaces.

### Competitor Analysis

- **Trainerize**
  - Does not allow editing the "require session credit" field at all once created.
  - Supports bulk credit issuance to multiple clients.
  - Trainerize also doesn't allow you to manually delete/deduct issued credits. (from research comments)
- **My PT Hub**
  - Supports Event Templates with flexible session booking.

## Release Summary

### P1.0 MVP

| Feature | Description |
| --- | --- |
| **Feature Access** | Provide a way for a WS that has the Booking feature to get access to Session Credits. |
| **Session Types** | Coach can set a session type to require session credit (payment). |
| **Session Credit Issuance** | Coach can issue their clients session credits for specific session types, or remove issued credits. |
| **Session Credit Usage** | Coach can book a session for a client that requires credit and the client's session credit balance is reduced; Coach can cancel (early cancel) a session, and the client's session credit is added back to their available balance. |
| **Balance** | Coach can see a client's session credit balance and the breakdown by session type and quantity. |
| **Session Credit History** | Coach can see the full history of a client's session credit issuance and use. |

### P1.1 Credit Expiration (Future Release)

| Feature | Description |
| --- | --- |
| **Expiration Rule** | Coach can set a workspace-level expiration rule for session credits from the issuance date. |
| **Expiration Application** | When a session credit's expiration passes, the session credit is deemed expired and removed from the client's session credit balance. |
| **Expiration Visibility** | Coach can see a client's history of session credit expiration, when a client's available session credits will expire, and is aware of clients with session credits that are going to expire soon. |

> **Note:** 3/3 coaches we talked to said they would want session credits to expire. This is likely a must-have but splitting deliverables enables team to release sooner.

### Not in Scope

- Communications to the coach or client regarding session credits issued or their application.
- Package issuance logic.
- Coach app / API / Zapier issuance.
- Payment at time of booking.
- Future web booking page application.
- Client web account / Coach app / Client app balance visibility.
- Multi-coach support (locking down session credit management to the client's Trainer or only Owner/Admin).
- Credit Expiration (P1.1).
- Bulk Session Credit Actions (P1.2).

---

# Diagrams

- Booking with Session Credit
- Session Credit State Machine
- Cancellation Diagram
- Credit Issuance
- Edge Cases - Client & WS Flow

(Refer to Miro links and Confluence attachments in original page.)

---

# Requirements

## Pre-conditions

- **Booking Feature Access:** Workspace must have the Booking feature enabled.
- **User Role:** Coach is Owner, Admin, or Trainer (all roles can issue credits for P1).
- **Client Status:** 
  - Client must be connected for credit issuance.
  - Deletion (credit delete) allowed on archived clients.

## Document Logs

| Date | What changed | Version | Background |
| --- | --- | --- | --- |
| 2026-04-02 | In-app notification for coach on mobile → should be navigated to the client overview tab. Impacted AC/US: AC 10, AC 13, US 4; AC 9, US 5. | V1.0.0 |  |
| 2026-04-03 | (1) Sessions having 2 tabs: Upcoming Sessions and Session Credits → design goes with option 1. (2) Client Profile > Sessions tab > Sessions Credit sub-tab > Activities: rename to “Balance History”. (3) Change the late cancel “forfeited” activity to “voided”.<br>3A. Update client profile Sessions tab Balance History to “Voided” (see new dropdown treatment of activity filters).<br>3B. Update cancel pop-up language to “Session credit will be **voided** and can no longer be used.”<br>Impacted: US 2: AC 2, 3, 4, 5, 8; US 7: AC 1, 4. | V1.0.1 | L/J decision. “Forfeited” considered too technical → use “Voided”. |
| 2026-04-05 | (1) Change tab name: Session Credits → Credits. (2) Balance History: remove time from “Date & Time” column; rename column to “Date”. (3) Rename “Action” column to “Event”. (4) Remove + and - signs from Amount column values. | V1.0.3 | Naming and UX feedback from Jon; focus on simpler terminology and avoid +/- implying balance change on non-balance events (e.g. voided). |
| 2026-04-06 | (1) Upcoming sessions: get 20 records per load; show total number of upcoming sessions for client. (2) Balance history: add pagination, 10 records per page. (3) Show loading state while calling API for: issue credits, delete credits. Impact: US 2: AC 2, 3, 7, 10; US 4: AC 10; US 5: AC 8. | V1.0.4 | Update after grooming. |
| 2026-04-07 | (1) Client Profile > Sessions > Upcoming Sessions: add count of Upcoming Sessions. (2) Credits > Balance: remove “Used”, only show single available total. (3) Credits > Balance: move session type info into pop-up; improve layout, focus on important info, change “view all” of expirations to open pop-up. (4) Credits > Balance History: move event filters into dropdown and add session type filter. Impacted: US 2 (AC 4, 7, 9 + new AC 10, 12–15); US 4 (AC 10, 13); US 5 (AC 8). | V1.0.5 | Make Upcoming count visible; focus Credits on available balance; simplify filters (no date filter, no multi-select for now). |

---

# Acceptance Criteria

> Lưu ý: Các section dưới đây giữ nguyên cấu trúc User Story / AC như trong spec để dev/QA dễ trace.

---

## User Story 1: Session Types - Require Session Credit Option

**As** a coach  
**I want** to set/edit session types to require session credit  
**So that** I can track which sessions require payment and manage credits accordingly.

### AC 1: Add the “Session credit” column into the Session Types table (Ready)

**Given** WS has access to the Booking feature  
**When** I go to the Session Types page  
**Then** I should see the **Session credit** column:

- If session credit is required for the type → show **check** icon.
- If not required → show icon “--”.
- Skeleton loading state is updated with the new column.

**Design**  
- Skeleton loading:  
  https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-619073&t=tPiHRKl1GYnP5ZgW-1  
- Data loaded:  
  https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-619071&t=tPiHRKl1GYnP5ZgW-1

---

### AC 2: Coach can set "require session credit" on new session type (Ready)

**Given** WS has access to the Booking feature and I stay on Session Types page  
**When** I click on **“Add New Session Type”**  
**Then** I see in the “Create Session Type” pop-up a **Require session credit** section:

- Title: **“Require session credit”**
- Explanation:  
  “Clients must have an available session credit for this session type in order to book a session.”
- Toggle:
  - ON (default): session requires credits.
  - OFF: session doesn’t require credits.
- Toggle hover states follow design.

**Design**  
Pop-up:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-90569&t=tPiHRKl1GYnP5ZgW-1  
Toggle hover:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-618476&t=tPiHRKl1GYnP5ZgW-1

---

### AC 3: Allow coach to create the session type successfully after setting require session credit (Ready)

**Given** WS has access to the Booking feature and I am on the “Create Session Type” pop-up  
**When**

- I set the “Require session credit” toggle ON or OFF, and
- I fill in other required fields, and
- I click **“Create”**

**Then**

- The session type is created successfully.
- The value of “Require session credit” is correctly reflected in the Session Types table (see AC 1).
- Ordering by Name (alphabetical) is handled by Core.

---

### AC 4: Coach can edit "require session credit" if no sessions exist for that type (Ready)

**Given** WS has access to the Booking feature  
**When** I click **Edit** on a session type that:

- **Does not** have any sessions linked to it, and
- **Is not** issued session credits

**Then**

- The “Require session credit” field shows previously saved value and **is editable**.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-622217&t=tPiHRKl1GYnP5ZgW-1

---

### AC 5: Coach cannot edit "require session credit" if sessions exist / credits issued (Ready)

**Given** WS has access to the Booking feature  
**When** I click **Edit** on a session type that:

- Has one or more sessions linked to it, **or**
- Has issued session credits

**Then**

1. “Require session credit” shows the saved value but is **not editable**.
2. Hovering on the toggle shows tooltip:  
   “This setting is locked because this session type is already linked to existing sessions or issued session credit.”

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-630429&t=tPiHRKl1GYnP5ZgW-1

---

### AC 6: Edge case - session type becomes linked / issued after opening Edit (2 tabs) (Ready)

**Given**

- WS has access to the Booking feature, and
- I clicked **Edit** on a session type that initially has no sessions linked / no credits issued

**When**

- Another coach links this session type to a session **or** issues credits in another tab, and
- I try to change “Require session credit” and click **“Update”**

**Then**

1. After loading, I am brought back to the Update Session Type pop-up with the **original** “Require session credit” value, and the toggle is now **disabled**.
2. A toast is shown:  
   “Failed to update. Please try again.”  
   (Generic error to allow reuse for other edge cases.)

---

### AC 7: Add warning when archiving session type with outstanding credits (Ready)

**Given** WS has access to the Booking feature  
**When** the coach clicks **Archive** for a session type that has **outstanding session credits**  
**Then** show warning modal:

- **Title:** “Archive Session Type?”
- **Description:**  
  “Are you sure you want to archive this session type? It will no longer be available for new bookings, but all existing sessions on your calendar will remain unchanged.”
- **Warning box:** icon +  
  “Some clients have unused session credits for this session type. Please delete their session credits or keep this session type active to allow booking.”
- **Buttons:** `[Cancel]` `[Archive]`

> Do **not** show this warning if there are no outstanding credits.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-634447&t=tPiHRKl1GYnP5ZgW-1

---

### AC 8: Archive a credit-required session type successfully (Ready)

**Given**

- WS has access to the Booking feature, and
- Coach clicks to archive a session type that requires session credit but:
  - Has no sessions linked, and
  - Has not been issued to clients

**When** I click **“Archive”** in the confirmation pop-up  
**Then**

1. Close the pop-up.
2. Show toast: “Session type has been archived.”
3. Archive the session type successfully and move it to the Archive table  
   (archive logic handled by Core Booking; ensure integration works).

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-634442&t=O8KN0oro1sAj7QSQ-1

---

### AC 9: Cannot archive if the session becomes linked during flow (2 tabs) (Ready)

**Given**

- WS has access to the Booking feature, and
- Coach clicks archive on a session type that **initially** has no linked sessions

**When**

- In another tab, a coach books a session for this type, and
- I come back and click **Archive** in the confirmation pop-up

**Then**

1. Close the pop-up.
2. Show toast:  
   “Failed to archive session type. Please try again.”

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1808-634439&t=O8KN0oro1sAj7QSQ-1

---

## User Story 2: View Session Credit Balance and History (Ready)

**As** a coach  
**I want** to see a client's session credit balance and full history  
**So that** I can track credit issuance and usage for each client.

### AC 1: Add the Sessions tab to connected client profile (Ready)

**Given** WS has access to the Booking feature  
**When** I go to the **connected** client profile  
**Then**

- A **“Sessions”** tab is visible in profile navigation.
- Tab is accessible for all client statuses.
- URL: `/sessions`.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3292-922940&t=QOCAhV4U7Mjro2VD-1

---

### AC 2: Show skeleton loading for Upcoming Sessions (default) (Updated Apr 6)

**Given** I’m in a connected client profile  
**When** I click the **Sessions** tab  
**Then** I should see skeleton loading while loading data for:

#### Upcoming Sessions

- API data:
  - Total number of upcoming sessions of client.
  - First 20 upcoming schedules of client.
  - Fields per session:
    - Color of session type.
    - Session type name.
    - Date.
    - Time.
    - Duration.
    - Location.
    - Session credit type: 1-on-1 or group.
    - Session description.
    - Whether session used credit or not.
    - Coach in charge:
      - Name,
      - Avatar.  
        (P1.0: only workspace Owner is returned as coach.)

- Data source notes:
  - Session type color: from `session_type` table.
  - Name, duration, location, description: from `session`.

**Design**  
Skeleton & layout:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1806-90537&t=IwoFBzyzhtjBT4js-1  
Upcoming list:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4088-287297&t=IwoFBzyzhtjBT4js-1

---

### AC 3: Upcoming Sessions tab - empty state (Updated Apr 6)

**Given**

- WS has Booking,
- I’m on the profile of a **connected** client with **no sessions scheduled**

**When** I navigate to the **Sessions** tab or click **Upcoming Sessions**  
**Then** show empty state:

1. Title:  
   `Upcoming Sessions {number of upcoming sessions}`  
   - For empty: `{number of upcoming sessions} = 0`.
2. Button `[Go to Calendar >]`:
   - Clicking it: see AC 8 (navigate to calendar).
3. Illustration + text:  
   “No upcoming sessions scheduled.”

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3292-920959&t=dXlHkftVvcBGSPWz-1

---

### AC 4: Show skeleton loading for Credits tab (Updated Apr 7, 2026)

**Given** I’m in connected client profile  
**When** I click **Sessions** then **Credits** tab  
**Then** show skeleton loading while loading data for:

#### 1. Balance

- Count total **available** credits of client.
- Get all session credit types & **available** amounts per type.
- Order by: highest credit balance (DESC / “Order of highest credit balance”).
- For each session type:
  - Color of session type.
  - Session type name.
  - Duration.
  - Location.
  - Session credit type (1-on-1 / group).
  - Session type description.
  - Number of available credits.

#### 2. Balance History

- Default: first page of **10** session credit activities for the client (all event types + all session types).
- Order: Date DESC.
- Per event:
  1. Date of event.
  2. Event type: one of  
     `used, issued, returned, voided, deleted, expired (P1.1)`  
     (Expired handled later in P1.1).
  3. Session type name.
  4. Amount of credits associated with the event.
  5. User (avatar + name of coach who triggered event)  
     - For issued & deleted events.
  6. Note.
  7. Linked session info.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7788-466975&t=dXlHkftVvcBGSPWz-1

---

### AC 5: Credits tab empty state (Need design)

**Given**

- WS has Booking,
- I’m on profile of a **connected** client with **no session credits issued**

**When** I open **Sessions > Credits**  
**Then**

1. **Balance** empty state:
   - Title: **“Balance”**
   - Description area:
     - Icon.
     - Text:  
       “**No session credits yet.**  
       Issue credits for a session type to start booking sessions.”
   - Button: `+ Issue Credits`  
     - Clicking: see User Story 3 (Issuance).

2. **Balance History** empty state:
   - Title: **“Balance History”**
   - Text:  
     “No session credit activity yet.  
     All session credit activities will appear here.”

---

### AC 6: “Issue Credits” button state by client status (Ready)

**Given** WS has Booking  
**When** I visit Sessions for different client statuses  
**Then**

- For **connected** clients:
  - `+ Issue Credits` button is **enabled**.
- For **archived** clients (who have issued credits):
  - `+ Issue Credits` button is **disabled** (issuance only on connected clients).

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7455-1945282&t=IwoFBzyzhtjBT4js-1

---

### AC 7: View Upcoming Sessions with data (Updated Apr 7, 2026)

**Given** I’m in a client profile that has upcoming sessions  
**When** I click the **Sessions** tab  
**Then**

1. Title:  
   `Upcoming Sessions {number of upcoming sessions}`.
2. List the upcoming sessions ordered by date (DESC).  
   Previous month grouping approach is removed; keep date order only.
3. For each session:

   1. **Date**  
      Format: e.g. `17 Fri`.
   2. **Time range + duration**  
      Example: `2:00 - 3:00 PM (60 min)`.
   3. **Location** (from session):
      - Icon + “In-person”
        - Hover → tooltip with full address + note.
        - If no address: “No address added”.
      - Icon + “Phone call”.
      - Icon + “Video call”.
   4. **Type of session credit** (e.g. 1-on-1, group).
   5. **Description icon** (if session has description):
      - Hover → full description (scroll, max height 272px).
      - Hide icon if no description.
   6. **Credit icon** (if session uses credits):
      - Tooltip: “{x} credit used”.
      - `x` = number of credits redeemed for that session.
      - Hide icon if session doesn’t use credit.
   7. **Session type color + name**
      - Up to 2 lines.
   8. **Coach avatar**, host of the meeting:
      - Tooltip: `{Coach role}: {Coach name}`.
      - If coach is current user → show “You”.

4. If more than 20 upcoming sessions:
   - Show vertical scrollbar.
   - Load sessions in chunks of 20 as user scrolls; show skeleton while loading.
   - Sticky month label while scrolling per design.

**Design**  
Upcoming:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4088-287297&t=UdnmYTkwUXTLbRh6-1  
Loading / long name:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7424-1901107&t=UdnmYTkwUXTLbRh6-1  
Sticky label:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4183-374707&t=O8KN0oro1sAj7QSQ-1

---

### AC 8: Navigate to Calendar from [Go to Calendar >] (Ready)

**Given** WS has Booking  
**When**

- I navigate to the Sessions tab, and
- I click `[Go to Calendar >]`

**Then**

1. Navigate to Calendar view **filtered to this client**.
2. Default view: current week.

---

### AC 9: View Credits tab with data (Updated Apr 7, 2026)

**Given** I’m in a client profile that has been issued session credits  
**When** I click **Sessions > Credits**  
**Then**:

#### 1. Balance section header

- Title: “Balance”.
- Button: `+ Issue Credits`.
- `{Total available credits} credits total`.
- “Used” and “Issued” summary line is removed (per V1.0.5).

#### 2. List of session credit types (with available credits)

For **each** session type that has **available** credits:

1. Session type color + name:
   - Up to 2 lines.
   - Hover → underline name.
   - Click → open Session Type details pop-up (AC 10).
2. Number of available credits `N`.
3. `+` button:
   - Function covered in US 3 (issue flow).
4. `-` button:
   - Function covered in US 5 (delete flow).

> Older design elements like inline duration/location/description in the Balance card and the “Show all N session types” toggle are removed per recent updates.

#### 3. When all credits are used / deleted / expired

- If all credits for a session type are used/deleted/expired, hide that session type from Balance (see also US 5, AC 10).

**Design**  
Balance:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4460-1306028&t=dXlHkftVvcBGSPWz-1  
Archived label / long name:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4463-1336953&t=dXlHkftVvcBGSPWz-1

---

### AC 10: Session Type details pop-up on click (New, Apr 7, 2026 – Need design)

**Given** I’m in a client profile with credits issued  
**When** I go to **Sessions > Credits** and click a **session type name** in Balance  
**Then** show pop-up with session type details:

1. Session type color + name (up to 2 lines).
2. Duration (e.g. `60 min`).
3. Session credit type (1-on-1 / group).
4. Location:
   - In-person.
   - Phone call.
   - Video call.
5. Details section:
   - If location = In-person:
     - Show full address and note if available.
     - If address is null: show “No address added”.
   - If not in-person: no address.
   - Description of session type:
     - If present, show full description with scroll if long.
     - If there is no info (address, desc) → hide Details section.

---

### AC 11: Session Credit Activities table with data (Updated Apr 7, 2026)

**Given** I’m in a client profile having available session credits  
**When** I click **Sessions > Credits** to view **Balance History**  
**Then**:

#### 1. Events and filters

- By default, show **10 records/page** including all events and all session types.
- Two filters:
  1. **Session Type**:
     - Source: all session types that client has ever been issued.
     - Default: none (means “all session types”).
     - Placeholder: “Session Type”.
  2. **Event**:
     - Default: none (means “all event types”).
     - Placeholder: “Event”.

#### 2. Columns

1. **Date**
   - Date of the event.
   - Format: `Feb 25, 2026`.
2. **Event**
   - One of: `Used`, `Issued`, `Returned`, `Voided`, `Deleted`, `Expired (P1.1)`.
   - Color per Figma:
     https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2132-296362&t=O8KN0oro1sAj7QSQ-1
3. **Session Type**
   - Show session type name.
   - Up to 2 lines; longer → `…`.
   - Hover → tooltip with full name.
4. **Amount**
   - Show amount of session credits for this event.
   - For issued, returned: positive.
   - For deleted & some other events: show value as simple number (no +/-).
5. **User** (no column title)
   - Avatar + name of coach who triggered event.
   - Only applies to **Issued** and **Deleted** events.
6. **Note/session linked** (no title)
   - **Note icon**:
     - Show for **Issued** and **Deleted** events.
     - Different UI for:
       - No note.
       - Has note.
   - **Tooltip icon for linked session**:
     - Show for **Used**, **Returned**, **Voided** events.
     - Hover/click: see User Story 8 (session preview).

#### 3. Pagination

- If > 10 events:
  - Show pagination with 10 records/page.
  - Click arrows to change page.
  - Show loading state while fetching.
  - Disable `<` on first page, disable `>` on last page.

**Design**  
Full table:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4183-366367&t=XqYQnWmPKS2L1a8R-1  
Loading state:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1806-90537&t=dXlHkftVvcBGSPWz-1  
Scroll / cases:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3328-881395&t=XqYQnWmPKS2L1a8R-1

---

### AC 12: Show filter options (Session Type / Event) (New, Apr 7, 2026 – Need design)

**Given** I’m in a client profile and click **Sessions > Credits**  
**When** I click on **Session Type** filter or **Event** filter  
**Then**:

1. **Session Type filter:**
   - Highlight border of field.
   - Show dropdown list of session types that client has been issued.
   - Each option:
     - Color of session type.
     - Name (long name design TBD, truncation & tooltip).
   - Hover an option → highlight background.
   - Click option → see AC 13.

2. **Event filter:**
   - Highlight border of field.
   - Show list: `Issued`, `Used`, `Returned`, `Voided`, `Deleted`.
   - Click an option → see AC 14.

---

### AC 13: Filter history by Session Type (New, Apr 7, 2026 – Need design)

**Given** I’m in client profile, and on **Sessions > Credits**  
**When** I open Session Type filter and select a session type  
**Then**:

1. Close dropdown.
2. Single selection only.
3. Show selected value in filter field:
   - Session type name + `X` (clear button).
   - Long name design TBD.
   - Click `X` → remove filter (back to all).
4. Show skeleton loading while fetching events.
5. If results exist:
   - List all matching events:
     - Order by Date DESC.
     - Use pagination if >10 records.
6. If no events:
   - Show text: “No results found.”

---

### AC 14: Filter history by Event (New, Apr 7, 2026)

**Given** I’m in client profile, **Sessions > Credits**  
**When** I open Event filter and select an event type  
**Then**:

1. Close dropdown.
2. Single selection only.
3. Show selection in filter:
   - Event name + `X` button.
   - Click `X` → clear event filter.
4. Show skeleton while fetching.
5. If results exist:
   - List events in Date DESC, with pagination (>10).
6. If no events:
   - Show “No results found.”

---

### AC 15: Filter history by both Session Type and Event (New, Apr 7, 2026)

**Given** I’m in client profile, **Sessions > Credits**  
**When** I select both a Session Type **and** an Event filter  
**Then**:

- The results show all rows matching **both** filters (AND condition).

---

## User Story 3: Add number of available credits to Client Profile (Ready)

### AC 1: View available session credits from Client Profile / Overview (Ready)

**Given** I’m in client profile having available credits  
**When** I view the **Overview** (or top-level Sessions info)  
**Then** I see text:

- If total = 0 → “**0 available credits**”.
- If total = 1 → “**1 available credit**”.
- If total > 1 → “**{n} available credits**”.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4088-287298&t=O7KctaLc7wK2kf3P-1

---

### AC 2: Hover over Sessions box → “Go to Sessions” button (Ready)

**Given** WS has Booking  
**When** I hover on the Sessions box on the client Overview  
**Then**

- Show underlined button: **“Go to Sessions”**.
- Hide this button when hover out.

---

### AC 3: Navigate to Sessions/Upcoming tab from “Go to Sessions” (Ready)

**Given** WS has Booking  
**When**

- I hover over Sessions box on Overview and click “Go to Sessions”  
**Then**

- Navigate to **Sessions** tab (Upcoming Sessions sub-tab).

---

## User Story 4: Session Credit Issuance in WS

**As** a coach  
**I want** to issue session credits to my clients  
**So that** they can use these credits when booking sessions.

### Background

- Coach issues session credits from the **client's profile**.
- No bulk issuance to multiple clients (unlike Trainerize) in this phase.
- Owner, Admin, Trainer can issue or remove credits for any client.
- No editing a credit entry; coach must delete and re-add.

---

### AC 1: Show “Issue Session Credits” modal on “+ Issue Credits” (Ready)

**Given**

- WS has Booking,
- I am on the Sessions tab of a **connected** client,

**When** coach clicks `+ Issue Credits`  
**Then**:

1. Fetch list of **active session types that require credits**, ordered alphabetically.
2. Show **“Issue Session Credits”** modal:

   1. Title:
      - “**Issue Session Credits**”
      - Subtitle: “to {ClientAvatar} {ClientName}”.
   2. **Session type** dropdown:
      - Label: “**Session type**”.
      - Placeholder: “Select session type”.
      - Description: “Only session types with session credit required”.
      - Hover → highlight border.
      - Required.
   3. **Amount to add**:
      - Only numeric input.
      - Default = 1.
      - Min = 1; Max = 100.
      - Down arrow disabled by default (at min).
      - Required.
   4. **Internal note (optional)**:
      - Text area, max 500 characters.
      - Placeholder: “This note is not visible to your client.”
      - Help text: “This note is not shared with the client”.
   5. `[Cancel]` button → close modal.
   6. `[Add Credits]` / `[Issue Credits]` button:
      - Disabled when required fields are empty/invalid.
      - Enabled when valid.
      - Clicking: see AC 10.
   7. `X` button → close modal.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2132-306704&t=tPiHRKl1GYnP5ZgW-1

---

### AC 2: Session type dropdown shows active, credit-required types (Ready)

**Given** WS has Booking and I am on the Sessions tab of a connected client  
**When** I click `+ Issue Credits` then click the **Session type** dropdown  
**Then**:

1. Show **active session types that require credits** only.
2. Show loading while fetching.
3. Order: alphabetically.
4. Max height: 250px; show scroll beyond that.
5. Empty state: if none available
   - Text: “No session types yet. Create session type”.
   - Click “Create session type” → navigate to Calendar / Session Types page.

Each option shows:

- Session type color.
- Session type name (up to 2 lines).
- Duration.
- Location:
  - Icon + In-person,
  - Phone call,
  - Video call.
- Number of clients in this session type.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2140-744660&t=tPiHRKl1GYnP5ZgW-1

---

### AC 3: Search session type by name in dropdown (Ready)

**Given** Session type dropdown is open  
**When** I type in the search field  
**Then**:

- The list filters in real-time to show session types whose names match the search string.
- If no match, show: “No results found.”

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4720-996321&t=XqYQnWmPKS2L1a8R-1  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4720-997790&t=XqYQnWmPKS2L1a8R-1

---

### AC 4: Display selected session type (Ready)

**Given** WS has Booking, I opened Issue Credits modal  
**When** I select a session type from dropdown  
**Then**:

1. Show selected type with:

   - Color badge.
   - Session credit type name.
   - Duration (icon + `{time} min`).
   - Location:
     - If In-person:
       - Hover icon → tooltip with full address + note.
       - If no address: “No address added”.
     - If Phone/Video: no address tooltip.
   - Number of clients for this session type.
   - Description icon:
     - Hover → full description (scroll if long).
     - Hide if no description.
   - `X` button:
     - Hover tooltip: “Clear session type”.

2. Show **Current session credit balance**:
   - “Credit balance: {remaining amount}”.
3. Show **New session credit balance** below Amount to add:
   - “New credit balance: {remaining + amountToAdd}”.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4650-926143&t=XqYQnWmPKS2L1a8R-1

---

### AC 5: Remove current session type on X (Ready)

**Given** I have Issue Session Credits modal open with a selected session type  
**When** I click the `X` on the selected session type card  
**Then**:

1. Remove the session type card.
2. Dropdown returns to placeholder state.
3. Hide “Current session credit balance”.
4. Hide “New session credit balance”.
5. Reset Amount to add to default value.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4114-1301885&t=O8KN0oro1sAj7QSQ-1

---

### AC 6: Amount to add input & validation (Ready)

**Given** WS has Booking and Issue Credits modal is open  
**When** I input amount (typing or using arrows)  
**Then**:

1. Show input value.
2. Up arrow:
   - Increments amount by 1 each click.
   - Disabled at limit: 100.
3. Down arrow:
   - Decrements amount by 1 each click.
   - Disabled at limit: 1.
4. If value = 0:
   - Highlight border red.
   - Show inline error: “Amount must be greater than 0”.
   - Hide New credit balance.
   - Show New credit balance again after entering valid number.
5. If value > 100:
   - Border red.
   - Error: “Amount must not exceed 100.”
   - Hide New credit balance until corrected.

---

### AC 7: Max 500 characters in Internal note (Ready)

**Given** WS has Booking and Issue Credits modal is open  
**When** I type in Internal note  
**Then**:

- Can input up to 500 characters.
- Cannot input beyond that.

---

### AC 8: Show loading animation while adding credit (Ready)

**Given** WS has Booking & client is connected  
**When** coach clicks Issue Credits button in modal (even if validations later fail)  
**Then**:

- Show loading animation while API call is in progress.
- Disable all clickable buttons and inputs.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7462-1982906&t=UdnmYTkwUXTLbRh6-1

---

### AC 9: Handle invalid data after clicking “Issue Credits” (Ready)

**Given** WS has Booking & client is connected  
**When** I click **Issue Credits** but data becomes invalid (2 tabs / race conditions)  
**Then**:

1. Case: session type is no longer active:
   - Show toast: “Session credit could not be issued for selected session type. Please try again.”
   - Remove that session type card from modal.
2. Case: session type no longer requires credits:
   - Toast: “This session type does not require credits”.
   - Remove that session type card from modal.
3. Case: client is archived (2 tabs):
   - Close modal.
   - Toast: “Failed to issue session credit because the client is archived.”
4. Issue Credits button must be disabled while data is invalid.

---

### AC 10: Successful credit issuance (Updated Apr 7, 2026)

**Given** WS has Booking and I’m confirming issuing credits  
**When** I submit valid data  
**Then**:

1. Close Issue Credits modal.
2. Reload Credits tab for latest data.
3. Show toast: “Session credit has been issued.”
4. **Balance** section updates:

   - New total available = previous available + amount added.
   - Session type list re-ordered by balance (DESC).
   - Show:
     - Session type theme.
     - Session type name.
     - `{amount} credits`.
     - (Other older fields like time/location/num clients may be omitted per new design, but persisted if needed.)

5. Show filter components (Session Type, Event) if previously no credits.
6. Add an **Issued** record to Balance History:

   - Date: event date (`Feb 25, 2026` format).
   - Event: `Issued`.
   - Session Type: name.
   - Amount.
   - User: avatar + name of issuing coach.
   - Note icon: shown if note exists.

7. Update total available credits in Client Overview and Sessions.
8. Send in-app notification to coach who manages the client:

   - Content:
     - If x = 1:  
       “\<client name\> was issued 1 session credit by \<user name\>.”
     - If x > 1:  
       “\<client name\> was issued {x} session credits by \<user name\>.”
   - Clicking:
     - Web: go to client’s Sessions tab, anchored at Balance History.
     - Mobile: go to Client profile / Overview tab.

9. Show an event in **Updates** section with same copy as notification and navigate to Sessions Credits on click.

**Design**  
Success + loading:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=7462-1983064&t=UdnmYTkwUXTLbRh6-1  
Updates:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4940-1074229&t=dXlHkftVvcBGSPWz-1  
In-app:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4940-1074174&t=dXlHkftVvcBGSPWz-1

---

### AC 11: Tooltip on `+` button in Balance (Ready)

**Given** WS has Booking & client has issued credits  
**When** I hover over `+` button on an existing credit type row in Balance  
**Then** show tooltip:  
“**Issue credit for this session type**”.

---

### AC 12: Pre-populate session type from `+` button (Ready)

**Given** WS has Booking & client has issued credits  
**When** I click `+` on a credit type row in Balance  
**Then**:

- Issue Credits modal opens with this session type **pre-selected**.
- Coach can remove it by clicking `X`.
- Coach can change to another type as in AC 2.
- Show:
  - Current session credit balance for that type.
  - Amount to add default = 1.
  - “New session credit balance: {current + amountToAdd}”.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3309-1011550&t=lLNPMNlT2XtLu4Wl-1

---

### AC 13: Add more session credit successfully (Updated Apr 7, 2026)

**Given** WS has Booking; client already has credits  
**When**

- I open Issue Credits either via `+` button or via `+ Issue Credits` on Credits tab, and
- I add more credits for an **existing** session type, and
- I click **Issue Credits**

**Then**:

1. Close modal.
2. Reload Credits page.
3. Show toast: “Session credit has been issued.”
4. Balance updates:
   - New total available = old available + amount added.
   - Re-sort session types by balance DESC.
5. History:
   - Add Issued event for this addition.
6. Update available credits count on Client Overview & Sessions.
7. Notification and Updates behavior same as AC 10.

---

### AC 14: Display archived session type credits (Ready)

**Given** client has credits for a **session type that is now archived**  
**When** I view **Sessions > Credits**  
**Then**:

1. The session type still appears in Balance but:
   - Labeled “Archived”.
   - Shown in disabled style.
2. The `+` button is **disabled**:
   - Hover tooltip: “Credits cannot be issued for an archived session type”.
3. The `-` button remains **enabled** so coach can delete available credits:
   - Clicking `-` → see User Story 5 (Delete Credits).

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4463-1335731&t=lLNPMNlT2XtLu4Wl-1

---

## User Story 5: Delete Session Credit from Client Profile

**As** a coach  
**I want** to delete unused session credits from my clients  
**So that** I can clean up incorrect or excess credits.

---

### AC 1: `-` button tooltip on credit card (Ready)

**Given** coach is viewing client Sessions tab with credits  
**When** coach hovers over `-` button on a credit type row  
**Then** show tooltip:  
“**Delete credit for this session type**”.

---

### AC 2: “Delete Session Credits” modal (Ready)

**Given**

- WS has Booking,
- Client profile has available credits (connected or archived client with unused credits),

**When** coach clicks `-` on a credit balance row  
**Then** show **“Delete Session Credits”** modal:

1. Title: “**Delete Session Credits**”.
   - Subtitle: “from {ClientAvatar} {ClientName}”.
2. **Session type**:
   - Pre-populated with session type clicked.
   - UI same as in Issue Credits.
   - `X` button:
     - Hover: “Clear session type”.
     - Click: see AC 3.
3. **Amount to delete**:
   - Numeric input.
   - Default = 1, with down arrow disabled at min=1.
   - Max = current available balance for this type.
   - “New session credit balance: {currentBalance - amountToDelete}”.
4. **Internal note (optional)**:
   - Text box, max 500 chars.
   - Placeholder: “This note is not visible to your client.”
   - Help text: “This note is not shared with the client”.
5. `[Cancel]` → close modal.
6. `[Delete Credits]` → triggers deletion flow (see AC 9).
7. `X` → close modal.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2140-763226&t=tPiHRKl1GYnP5ZgW-1

---

### AC 3: Clear session type in Delete modal (Ready)

**Given** Delete Session Credits modal is open  
**When** I click `X` on session type card  
**Then**:

1. Session type is removed.
2. Dropdown returns to placeholder state.
3. Hide “Current session credit balance”.
4. Hide “New session credit balance”.
5. Reset Amount to delete to default.

---

### AC 4: Session type dropdown shows only types with available credits (Ready)

**Given** I cleared session type selection in Delete modal  
**When** I click the Session type dropdown  
**Then**:

- Show only session types for which client has available (unused) credits.
- Order by session type name alphabetically.
- Each option shows same details as in Issue Credits (color, name, duration, location, #clients).

---

### AC 5: Search session type in Delete modal dropdown (Ready)

**Given** session type dropdown open in Delete modal  
**When** I type in search field  
**Then**:

- Filter list in real-time by name.
- If no match → “No results found”.

---

### AC 6: Amount to delete input & validation (Ready)

**Given** WS has Booking & client has available credits  
**When**:

- Coach clicks `-` to open Delete modal, and
- Inputs value via typing or arrows,

**Then**:

1. Up arrow:
   - Increase by 1 per click.
   - Disabled at limit: max available credits of that type.
2. Down arrow:
   - Decrease by 1 per click.
   - Disabled at limit: 1.
3. If amount = 0:
   - Border red.
   - Error: “Amount must be greater than 0”.
   - Hide new credit balance until valid.
4. If amount > current balance:
   - Border red.
   - Error: “Amount must not exceed current session credit balance.”
   - Hide new credit balance until valid.

---

### AC 7: Max 500 characters in Internal note (Ready)

**Given** WS has Booking & client has unused credits  
**When** I type in Internal note in Delete modal  
**Then**:

- Max 500 characters; cannot exceed.

---

### AC 8: Validation errors on Delete Credits (Updated Apr 6)

**Given** WS has Booking & client has available credits  
**When**:

- Coach enters invalid value (e.g. > balance), or
- Credits were used/deleted elsewhere so not enough credits remain, and
- Coach clicks **Delete Credits**

**Then**:

1. Show loading state during API call.
   - Disable all buttons and inputs.
2. After validation:
   - If insufficient balance (2 tabs / concurrency):
     - Toast:  
       “Credit balance was updated elsewhere  
       Please review the balance and try again.”
     - Keep the modal open.
     - Show inline error: “Amount must not exceed current session credit balance.”
     - Disable Delete Credits button.
     - Once coach enters valid number:
       - Hide error.
       - Show new credit balance.
       - Enable Delete Credits if all required fields valid.

**Design**  
Error & loading:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=6168-1406384&t=O7KctaLc7wK2kf3P-1

---

### AC 9: Successful credit deletion (Updated Apr 7, 2026)

**Given** WS has Booking and coach confirms deleting credits  
**When** deletion succeeds  
**Then**:

1. Close modal.
2. Show toast: “Session credits have been deleted.”
3. Reload Credits page.
4. Update credit balance:
   - Available amount reduced by deleted amount.
   - “Issued/Used” ratio summary is not shown anymore (per earlier version removal).
5. Add **Deleted** record to history:

   - Date (`Feb 25, 2026` format).
   - Event: `Deleted`.
   - Session Type: name.
   - Amount.
   - User: avatar + name of coach performing deletion.
   - Note icon if note present.

6. Update total available credits in Client Overview / Sessions.
7. Send in-app notification:

   - Content:
     - If x = 1:  
       “\<client name\>'s session credit balance was reduced by 1 credit by \<user name\>.”
     - If x > 1:  
       “\<client name\>'s session credit balance was reduced by {x} credits by \<user name\>.”
   - Clicking:
     - Web: go to Sessions tab, anchored at Balance History.
     - Mobile: Client profile / Overview.

8. Add event in **Updates** section with same copy and navigate to Credits tab on click.

**Design**  
Modal:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2140-758877&t=lLNPMNlT2XtLu4Wl-1

---

### AC 10: Hide session credit type when available balance = 0 (Ready)

**Given** WS has Booking and credits were issued  
**When** available credit for a session type becomes **0** because of:

- Deletion, or
- Credits used, or
- Voided events from cancellations,

**Then**:

- Hide that session type from the Balance list (credits section).

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1806-90537&t=lLNPMNlT2XtLu4Wl-1

---

## User Story 6: Session Credit - Used via Booking

**As** a coach  
**I want** session credits to be automatically applied when booking sessions  
**So that** I don't have to manually track credit usage.

### Background

- A session credit is **used** when it is linked to a session at booking.
- If session is canceled with **early cancel**, the credit is **returned** to client’s available balance.
- If **late cancel** (no-show/late cancel), client **forfeits** the session credit (marked `Voided` in UI).
- Archive client or workspace downgrade do not modify existing credits, but Booking UI might be hidden later.

---

### AC 1: Coin icon in Book Session session type dropdown (Ready)

**Given** I’m on the **Book Session** pop-up  
**When** I click Session type dropdown  
**Then**:

- If the session type requires credit, show a **coin icon** on that option.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1811-641131&t=CCl6GMzfSeOEYX6w-1

---

### AC 2: Book Session - client has **enough** credits (Ready)

**Given**

- I am booking a session with a session type that requires credit, and
- Selected client has sufficient available credits for this **session type**,

**When**

- I select client then a credit-required session type, **or**
- I select a credit-required session type then the client,

**Then**:

1. Under selected Session Type show:
   - Coin icon + “**1 credit required**”.
   - Success indicator:  
     “{client_first_name} will have {x} remaining session credits for this session type once this session is booked.”  
     where `x = remaining credits after redeeming 1`.
2. **Book Session** button is **enabled**.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1811-648933&t=QOCAhV4U7Mjro2VD-1

---

### AC 3: Book Session - client **doesn’t** have enough credits (Ready)

**Given** I’m booking a session with a credit-required session type  
**When**:

- I select a client who doesn’t have enough credits for this session type, or
- I first pick session type, then select a client without enough credits, or
- Client had enough at open time but not when I click **Book Session** (2-tabs race),

**Then**:

1. Under selected Session Type show:
   - Coin icon + “**1 credit required**”.
   - Error indicator:  
     “{client_first_name} doesn't have available session credit for this session type. **Add credits**”
   - “Add credits” rendered as link:
     - Clicking opens that client’s Sessions - Credits for issuance.
2. For race condition (credits gone before confirming):
   - When I click “Book Session”, hide success indicator from AC 2, and show this error indicator.
3. **Book Session** button is **disabled**.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=2971-1112943&t=QOCAhV4U7Mjro2VD-1

---

### AC 4: Book a credit-required session successfully (Ready)

**Given** credit-required session type and client has sufficient credits  
**When** I select client, session type, fill other details and click **Book Session**  
**Then**:

- Session is booked successfully (Booking Core handles).
- Corresponding credit usage is recorded (see AC 6 & Session Credit usage logic).

---

### AC 5: Session details indicator for credit usage on Calendar (Ready)

**Given** I’m on Calendar view  
**When** I open a session that requires credits  
**Then**:

1. If the session status is **Scheduled**, **Completed**, or **Late cancel**:
   - Show indicator: coin icon + “1 credit used”.
2. Do **not** show this indicator if:
   - Session does not require credit, or
   - Session requires credit but status = **Early cancel**.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1811-661493&t=QOCAhV4U7Mjro2VD-1

---

### AC 6: Show sessions on client profile when added to a session (Updated Apr 5, 2026)

**Given** coach booked a session for a client (with or without credit)  
**When** I go to that client’s profile  
**Then**:

1. In **Sessions > Upcoming Sessions**:
   - Show all future sessions (regardless of credit requirement).
2. If booked session **requires credit**:

   1. Deduct 1 credit from:
      - total available balance, and
      - this session type’s available balance.
   2. Increase usage (historically tracked, though “Used” summary is not shown in Balance UI anymore).
   3. Add “Used” event in Balance History:
      - Date: e.g. `Feb 2, 2026`.
      - Event: `Used`.
      - Session type name.
      - Amount: number of redeemed credits.
      - User: “--” (since used via booking, not manual).
      - Linked session tooltip icon: click → see User Story 8 (preview session).

3. Update available credit count in Overview / Sessions.

---

### AC 7: No session credit indicator on Edit Book Session pop-up (Ready)

**Given** coach has booked a session that requires credit  
**When** I click to **Edit** that session  
**Then**:

- Do **not** show any session credit indicator in Edit Session pop-up.
- Session type cannot be cleared via X (no X button in session type).

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1815-681079&t=lLNPMNlT2XtLu4Wl-1

---

## User Story 7: Returned & Voided Session Credit from Sessions

**As** a coach  
**I want** session credits to be automatically returned or voided when a booking is canceled  
**So that** I don't have to manually track credit usage.

---

### AC 1: “Cancel session?” pop-up for credit-required sessions (Updated Apr 3)

**Given** coach has booked a session that requires credits  
**When** I click Delete / Cancel from any of:

- Calendar - Session preview,
- Calendar - Edit Session pop-up,
- Client Profile > Sessions > Upcoming Sessions - preview session,
- Client Profile > Sessions > Balance History - linked session preview,

**Then** open **“Cancel session?”** pop-up:

- Title: “**Cancel session?**”
- Description:  
  “This change cannot be undone. How would you like to cancel this session with {ClientName}?”
- Radio options (no default):

  1. **Early cancel**  
     “Session credit will be **returned** to client's balance.  
     Client will be **notified** about this cancellation.”
  2. **Late cancel**  
     “Session credit will be **voided** and can no longer be used.  
     Client will **not be notified** about this cancellation.”

- Behavior:
  - Hover radio → highlight border.
  - Click → selected style (border + background).
- Internal note field:
  - Title: “**Internal note**”.
  - Textbox:
    - Placeholder: “Add a reason for cancellation”.
    - Max: 500 characters.
  - Help text: icon + “This note is not shared with the client”.
- Buttons:
  - `[Keep Session]` → close pop-up (no change).
  - `[Cancel Session]`:
    - Disabled by default.
    - Enabled once a radio option is selected.
- `X` button → close pop-up.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1811-858061&t=lLNPMNlT2XtLu4Wl-1

---

### AC 2: Max 500 characters in Internal note (Ready)

**Given** I am in Cancel Session? pop-up  
**When** I type in Internal note  
**Then**:

- Max 500 characters; cannot exceed.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1811-858091&t=lLNPMNlT2XtLu4Wl-1

---

### AC 3: Session credit returned on early cancel (Updated Apr 5, 2026)

**Given** session used a credit  
**When** coach selects **Early cancel** and confirms  
**Then**:

1. Show toast: “The session has been canceled.”
2. Close Cancel Session? pop-up.
3. Session status set to **early cancel** (core Booking).
4. Credit handling:

   - Increase available balance by redeemed amount.
   - Decrease “Used” count by that amount.
   - Add `Returned` event in Balance History:
     - Date.
     - Event: `Returned`.
     - Session type.
     - Amount.
     - User: “--”.
     - Linked session tooltip icon → User Story 8.

5. Session details:
   - Replace “1 credit used” with “1 credit returned”.
6. Remove this session from Upcoming Sessions if it’s in the future.
7. Booking status updated to “early canceled” (Core).
8. Send cancellation email & in-app notification to client (Core).
9. Update total available credits in Overview / Sessions.

---

### AC 4: Forfeit credit on late cancel (Updated Apr 5, 2026)

**Given** a credit-required session with credit used  
**When** coach selects **Late cancel** and confirms  
**Then**:

1. **Do not** return credit to client.
2. Show toast: “The session has been canceled.”
3. Session status becomes `late_canceled`.
4. Add a `Voided` event in Balance History:

   - Date.
   - Event: `Voided`.
   - Session Type.
   - Amount: “--” (no balance change).
   - Linked session tooltip icon.

   > Note: Credit remains in “used” state logically; event type indicates the credit was forfeited (voided) rather than truly used.

5. Remove session from Upcoming Sessions if it was in the future.

---

### AC 5: Concurrency - session already canceled (Ready)

**Given** I am in Cancel Session? pop-up for a credit-required session  
**When** another coach has already canceled this session before I confirm, and I click **Cancel Session**  
**Then**:

1. Close the pop-up.
2. Do nothing else (no extra events, no double cancel).

---

### AC 6: Hide upcoming session if canceled - no credit (Ready)

**Given** coach cancels a session that does **not** require credits  
**When** cancellation is confirmed  
**Then**:

- Remove the session from Upcoming Sessions if it is in the future before cancellation (no credit changes).

---

## User Story 8: Preview Session Details from Client Profile

**As** a coach  
**I want** to see session details from client profile  
**So that** I can quickly view info without going to Calendar.

### Pre-condition

- Session is linked to client via:
  - Upcoming Sessions,
  - Activity History (`Used`, `Returned`, `Voided` events).

---

### AC 1: Hover state for upcoming sessions (Ready)

**Given** a session is linked to client  
**When** I go to client profile and hover a session in **Upcoming Sessions**  
**Then**:

- Highlight background of that session row.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4463-1337932&t=lLNPMNlT2XtLu4Wl-1

---

### AC 2: Show session details on click / tooltip (Ready)

**Given** WS has Booking and a session is linked to client  
**When** I:

- Click a session in **Upcoming Sessions**, or
- Hover/click the tooltip icon from `Used`, `Returned`, `Voided` events in Balance History

**Then** show a session detail pop-over:

1. Session **status**.
2. **Calendar icon**:
   - Hover: “View on client calendar”.
   - Click: see AC 4 (navigate to calendar).
3. **Edit icon**:
   - Hover.
   - Click: see AC 5 (Edit Session pop-up).
4. **Delete icon**:
   - Hover.
   - Click: see AC 7 (Cancel Session pop-up).
5. `X` button → close pop-over.
6. Session type color (from session_type).
7. Session type name (from session).
8. Client name + avatar.
9. Date + time + duration:
   - Same year:  
     `Sat, Jan 17 · 2:00 - 3:00pm (60min)`
   - Different year:  
     `Sat, Jan 17, 2027 · 2:00 - 3:00pm (60min)`
10. Location (with address), from session.
11. Note for client (only if exists).
12. If session requires credit:
    - Show coin icon + “1 credit used”.
    - If session status is **early cancel**, show “1 credit returned” instead.
13. Trainer info:
    - “Trainer: {CoachName}”.
    - P1: only owner shown as Trainer; future: multiple coaches.

**Design**  
Core preview:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=966-645425&t=yLEgToyPokjheE27-1  
Session credit variant:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3309-1074970&t=lLNPMNlT2XtLu4Wl-1

---

### AC 3: Show internal note in Session details on cancel (Ready)

**Given** WS has Booking and session is linked to client  
**When** I canceled a session (early or late) and open session details from Upcoming or Activity History  
**Then**:

1. Show Internal note field (reuse Core UI):
   - Max 500 chars.
   - If note empty → show placeholder to allow coach to add.
2. Editing internal note:
   - Reuses Core behavior and API; latest note is saved and shown.

**Design**  
Core note:  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=1332-738153&t=yLEgToyPokjheE27-1

---

### AC 4: Navigate to Calendar filtered to client via Calendar icon (Ready)

**Given** WS has Booking and session is linked to client  
**When** I open session detail pop-over in Sessions tab and click Calendar icon  
**Then**:

1. Navigate to Calendar **filtered to this client**.
2. Open session details from Calendar (same layout as preview but without Calendar icon).
3. Show skeleton while loading.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3309-1076512&t=lLNPMNlT2XtLu4Wl-1

---

### AC 5: Show Edit Session pop-up from preview (Ready)

**Given** WS has Booking and session is linked to client  
**When** I click Edit icon on session preview pop-over  
**Then**:

1. Open **Edit Session** pop-up (Core Component):  
   https://everfit.atlassian.net/wiki/spaces/EV/pages/3532030037/Spec+Bookings+-+Core+P1.0+-+Coach+Booking+CORE+WEB+Booking+Management#US12.-Edit-A-Session
2. If session is linked to a session type:
   - Editable:
     - Start date.
     - Start time.
     - Note.
     - Session type (with constraints described in AC 6 below).
3. If it is a custom session:
   - Editable:
     - Start date, start time, color & name, duration, location & address, description, note.
4. If edit is successful:
   - Close Edit Session pop-up.
   - Reload/refresh client Sessions tab:
     - Update Upcoming Sessions if necessary.
     - Update Activity History rows linked to this session.
     - Update preview pop-over details.
   - Toast: “The session has been updated.”

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4745-996610&t=XqYQnWmPKS2L1a8R-1

---

### AC 6: Edit duration, location, description via Session Type editing from preview (Ready)

**Given** WS has Booking and session is linked to client  
**When** I open Edit Session pop-up and hover on Session Type’s Edit icon  
**Then**:

1. Highlight Session Type background.
2. Tooltip: “Change duration, location or description”.

If I click Session Type edit button:

1. Open **Edit Session Type** modal stacked over Edit Session pop-up:
   - Allow editing name, duration, location, note.
2. Buttons:
   - `Apply`:
     - Disabled if no changes.
     - Enabled if at least one field changed.
   - `Cancel` / `X`:
     - Close Edit Session Type and return to Edit Session pop-up without changes.
3. When clicking `Apply`:
   - Update current session’s info with new values.
   - Do **not** update other sessions of same session type (local override).
   - Close Edit Session Type modal and return to Edit Session pop-up with updated info.

**Reference** (Core spec):  
https://everfit.atlassian.net/wiki/spaces/EV/pages/3532030037/Spec+Bookings+-+Core+P1.0+-+Coach+Booking+CORE+WEB+Booking+Management#AC2.-Session-data-input-Ready-for-dev-Update

---

### AC 7: Show Cancel Session? pop-up from preview Delete icon (Ready)

**Given** WS has Booking and session is linked to client  
**When** I click **Delete** icon on session preview pop-over  
**Then**:

1. Close preview pop-over.
2. Open Cancel Session? pop-up (see User Story 7 AC 1).
3. If cancellation is successful:
   - Close Cancel Session? pop-up.
   - Reload client data:
     - Hide session from Upcoming if it was future.
     - Update Balance History events appropriately.

---

## User Story 9: Add/Edit Internal Note from Activity History

**As** a coach  
**I want** to add/edit internal note on credit events  
**So that** all team members can see latest internal notes.

---

### AC 1: “Add note” tooltip for empty notes (Ready)

**Given** an `Issued` or `Deleted` event with **no internal note**  
**When** I hover the note icon in Activity History  
**Then**:

- Highlight the icon.
- Tooltip: “**Add note**”.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5129-1092911&t=XqYQnWmPKS2L1a8R-1

---

### AC 2: Show “Add note” pop-over on click (Ready)

**Given** an `Issued` or `Deleted` event without note  
**When** I click the note icon  
**Then**:

- Show pop-over:
  1. Title: “Add note”.
  2. `X` button → closes pop-over.
  3. Textbox:
     - Max 500 characters.
  4. `Save` button:
     - Disabled if empty.
     - Enabled when user types at least 1 character.
     - On click → see AC 3.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5129-1101304&t=XqYQnWmPKS2L1a8R-1

---

### AC 3: Save new internal note (Ready)

**Given** `Issued` or `Deleted` event has no note and Add Note pop-over is open  
**When** I input text and click Save  
**Then**:

1. Close pop-over.
2. Save note successfully.
3. Show toast: “Note has been updated.”
4. Change note icon from “no note” state to “has note” state.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5129-1092927&t=XqYQnWmPKS2L1a8R-1

---

### AC 4: Hover shows tooltip with note content + Edit button (Ready)

**Given** an `Issued` or `Deleted` event **has** internal note  
**When** I hover the note icon  
**Then**:

- Highlight icon and show tooltip:
  1. `{Note content}`
  2. An **Edit note** button
     - Hover: highlight + underline.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=3309-1155944&t=lLNPMNlT2XtLu4Wl-1

---

### AC 5: Show “Edit Note” pop-over on click (Ready)

**Given** an `Issued` or `Deleted` event has internal note  
**When** I hover note icon and click **Edit note** button  
**Then**:

- Show editable pop-over:
  1. Title: “Edit Note”.
  2. Textbox: prefilled with latest note content (max 500).
  3. `X` button → close without saving.
  4. `Save` button → see AC 6.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4114-1076577&t=lLNPMNlT2XtLu4Wl-1

---

### AC 6: Update / delete internal note successfully (Ready)

**Given** an `Issued` or `Deleted` event has internal note and Edit Note pop-over is open  
**When** I change note and click Save  
**Then**:

1. If content not changed:
   - Just close pop-over.
2. If content changed (non-empty):
   - Close pop-over.
   - Toast: “Note has been updated.”
   - Save latest note content.
3. If content cleared (empty):
   - Close pop-over.
   - Toast: “Note has been deleted.”
   - Remove internal note from the record.
   - Switch note icon back to empty state.

**Design**  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4114-1087369&t=lLNPMNlT2XtLu4Wl-1  
https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5129-1106925&t=jk62bQRlf5aL7Jkm-1

---

## User Story 10: Update Session and Session Type Info

**As** a coach  
**I want** the client Sessions tab to reflect latest session/session type changes.

---

### AC 1: Show updated info when session type is edited (Ready)

**Given** the client has issued credits for a session type  
**When** coach edits this session type’s **name** or **color**  
**Then**:

1. Update **color** of session type in:
   - Client profile > Sessions > Credits > Balance.
   - Client profile > Sessions > Upcoming Sessions & preview pop-overs.
   - Session details pop-over (User Story 8).
   - Edit Session pop-up.
   - Cancel Session pop-up.
   - Credits tab > Session Type filter options.
2. Update **session type name** in:
   - Credits tab > Balance.
   - Session Type filter options.
   - Balance History “Session Type” column.

---

### AC 2: Show updated session info if session is edited (Ready)

**Given** coach updates session info linked to client  
**When** I go to that client’s profile  
**Then**:

- Updated session info must be reflected in:
  - Upcoming Sessions list.
  - Session details pop-over (from Upcoming and Activity History):
    - For `Used`, `Returned`, `Voided` events.

---

### AC 3: Update coach avatar & name if changed (Ready)

**Given** coach changes their avatar or name  
**When** I go to session tabs on client profile  
**Then** see updated coach info in:

1. Session preview pop-overs.
2. Balance History **User** column for:
   - `Issued` events,
   - `Deleted` events.
3. Edit Session pop-up.

---

### AC 4: Update client info if changed (Ready)

**Given** client info (name, avatar) updated  
**When** I go to session tabs on client profile  
**Then**:

- Show updated client info in:
  1. Issue Credits modal.
  2. Session preview.
  3. Edit Session pop-up.
  4. Delete Session Credits pop-up.

---

## User Terminology

### AC 1: Update terminology based on coach settings (Ready)

**Given** coach sets custom user terminology in account settings  
**When** UI texts mention “client(s)” or “session credits” in this feature  
**Then** terminology must update in:

1. Create / Edit Session Type pop-up:
   - “Clients must have an available session credit for this session type in order to book a session.”
2. Archive Session Type pop-up.
3. Issue Session Credits modal.
4. Delete Session Credits pop-up.
5. Cancel Session? pop-up.
6. Upcoming sessions: hover coach avatar tooltip.
7. Session preview pop-over.

Implementation details follow existing terminology infrastructure in product.