# Session Credits P1.0 — Business Logic & Data Flow Reference for Backend

| | |
|---|---|
| **Epic** | PAY-1421 — PAY \| Booking \| Session Credits P1.0 |
| **Product Owner** | Danielle Childs |
| **Tech Lead** | Huy Nguyen |
| **BA** | San (thaovu) |
| **Last updated** | April 2026 |

---

## Overview

Everfit is building a Booking feature that allows coaches to schedule sessions with clients directly inside the platform. Session Credits is the payment layer on top of that — it lets coaches pre-load clients with session entitlements, which are then automatically consumed when a session is booked and returned or forfeited when a session is cancelled.

P1.0 establishes the foundation: manual credit issuance by coaches, automatic deduction at booking, and credit lifecycle management (return on early cancel, forfeit on late cancel). This release targets single-coach workspaces only. Package-based issuance, bulk actions, expiration, and client self-booking are all deferred to later releases.

The goal is to give coaches a reliable, automated way to track session credit balances — replacing the manual spreadsheets and ad-hoc tracking most coaches currently use.

---

## Table of Contents

1. [Domain Concepts](#1-domain-concepts)
2. [Pre-conditions & Access Rules](#2-pre-conditions--access-rules)
3. [Feature-Level Flow](#3-feature-level-flow)
4. [Credit Lifecycle & State Machine](#4-credit-lifecycle--state-machine)
5. [Data Requirements](#5-data-requirements)
6. [Flow 1 — Session Type: Require Credit Setting](#6-flow-1--session-type-require-credit-setting)
7. [Flow 2 — Credit Issuance](#7-flow-2--credit-issuance)
8. [Flow 3 — Credit Deletion](#8-flow-3--credit-deletion)
9. [Flow 4 — Credit Deduction on Booking](#9-flow-4--credit-deduction-on-booking)
10. [Flow 5 — Credit Return & Forfeit on Cancellation](#10-flow-5--credit-return--forfeit-on-cancellation)
11. [Edge Cases & Concurrency Rules](#11-edge-cases--concurrency-rules)
12. [Activity Log & Notification Rules](#12-activity-log--notification-rules)
13. [Open Questions for BE](#13-open-questions-for-be)
14. [Out of Scope for P1.0](#14-out-of-scope-for-p10)

---

## 1. Domain Concepts

**Session Credit** — A pre-purchased entitlement allowing a client to book one session of a specific session type. Credits are issued manually by a coach in P1.0. Each credit belongs to exactly one client and one session type.

**Session Type** — A reusable template for sessions (e.g. "PT Session", "Assessment"). It carries a `require_credit` flag. If this flag is ON, a client must have an available credit of that type to be booked into a session.

**Credit Balance** — The count of credits a client has in the `available` state for a given session type. This is a derived value — computed from credit records, not stored as a standalone field.

**Transaction Log** — Every state change to a credit must produce an immutable activity record. This is the source of truth for the credit history shown to coaches.

---

## 2. Pre-conditions & Access Rules

These conditions must be verified before processing any credit operation.

| Condition | Rule | Applies To |
|---|---|---|
| Workspace feature access | Booking feature must be enabled on the workspace | All operations |
| User role | Owner, Admin, and Trainer roles can all issue and delete credits in P1.0 | Issuance, Deletion |
| Client status for issuance | Client must be **connected** (active) | Issuance only |
| Client status for deletion | Client can be **connected or archived** | Deletion |
| Client status for booking | Client must be **connected** | Booking |
| Session type status | Session type must be **active** for new credit issuance and booking | Issuance, Booking |

---

## 3. Feature-Level Flow

This diagram shows how a session credit moves through the entire feature from issuance to its final state. Use it as the map before reading individual flows.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SESSION CREDITS — FULL FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

  SETUP
  ─────
  Coach creates a Session Type
         │
         ▼
  Sets [require_credit = ON]
  (locked once sessions or credits exist)
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │  CREDIT ISSUANCE                                                     │
  │                                                                      │
  │  Coach issues credits to client                                      │
  │  → 1 credit record created per unit of quantity                     │
  │  → Status: available                                                 │
  │  → Activity log: issuance                                            │
  │  → In-app notification sent to coach                                 │
  └──────────────────────────────┬───────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          [Coach manually deletes]     [Coach books session]
          credits from client          for client
                    │                         │
                    ▼                         │
          Status: deleted              Check: does client have
          Activity log: deletion       available credit?
          Notification sent                   │
                                    ┌─────────┴──────────┐
                                    │                    │
                                    ▼                    ▼
                              [NO credit]          [HAS credit]
                              Booking blocked      Credit deducted
                              Error shown          Status: used
                                                   Activity log: usage
                                                         │
                                          ┌──────────────┴──────────────┐
                                          │                             │
                               [Session completed]          [Coach cancels session]
                               Credit stays as [used]               │
                               (terminal — no action)    ┌───────────┴───────────┐
                                                         │                       │
                                                  [Future session]    [Past/started session]
                                                  Auto: Early Cancel  Coach chooses:
                                                         │
                                                         │            ┌──────────┴──────────┐
                                                         │            │                     │
                                                         │     [Early Cancel]         [Late Cancel]
                                                         │            │                     │
                                                         └────────────┘                     │
                                                                  │                         │
                                                                  ▼                         ▼
                                                        Status: available           Status: forfeited
                                                        Activity log: return        Activity log: forfeit
                                                        Credit usable again         Credit permanently lost
```

---

## 4. Credit Lifecycle & State Machine

### State Transitions

```
                    [Coach issues credit]
                             │
                             ▼
                        [AVAILABLE]
                        /          \
          [Session booked]          [Coach manually deletes]
                │                             │
                ▼                         [DELETED]
             [USED]                        (terminal)
            /    │    \
           /     │     \
  [Early Cancel] │  [Late Cancel]
   time > 0      │   time ≤ 0, coach decides
        │        │          │
        ▼        │          ▼
  [AVAILABLE]    │      [FORFEITED]
  (returned)     │       (terminal)
                 │
     [Session completed normally]
     Credit remains [USED] — terminal

  [P1.1 — expiry job]
        │
        ▼
    [EXPIRED]
    (terminal)
```

### State Definitions

| State | Description | Counts toward Balance? | Terminal? |
|---|---|---|---|
| `available` | Issued, not yet linked to a booking | Yes | No |
| `used` | Linked to a booking. Stays `used` whether session is upcoming, completed, or late-cancelled. | No | Yes (on completion) |
| `forfeited` | Late cancel chosen by coach. Client permanently loses this credit. | No | Yes |
| `deleted` | Manually removed by coach. | No | Yes |
| `expired` | **P1.1 only.** Passed expiry date without being used. | No | Yes |

### Available Balance Rule

Available balance for a client + session type = count of credit records in `available` state for that pair. This drives booking eligibility and what the UI displays. It is not stored as a standalone counter.

---

## 5. Data Requirements

Field naming and exact schema are BE decisions. This section defines what must be stored and why.

### 5.1 Credit Record

Each individual credit is its own record. Issuing 5 credits = 5 records.

| Data | Purpose |
|---|---|
| Client reference | Who owns this credit |
| Session type reference | Which session type this credit applies to |
| Status | Current lifecycle state (see Section 4) |
| Whether the credit is in use | Indicates the credit is linked to an active booking |
| Booking reference | Which booking consumed this credit (null until used) |
| Source type | How it was issued: `manual` (P1.0), `package` or `api` (future) |
| Workspace reference | Data scoping |
| Issued timestamp | When the credit was created |
| Expiry timestamp | Null in P1.0; populated in P1.1 |

### 5.2 Transaction / Activity Record

Every credit state change must produce an immutable record. This powers the activity history UI.

| Data | Purpose |
|---|---|
| Client reference | Who the credit belongs to |
| Session type reference | Which session type |
| Transaction type | `issuance`, `usage`, `return`, `deletion`, `forfeit`, `expiration` |
| Credit amount | Positive = credit added. Negative = credit removed. Zero = state change only (forfeit). |
| Booking reference | Linked booking for usage / return / forfeit events. Null for issuance / deletion. |
| Actor reference | Coach who triggered the action. **Null for system-triggered events** (booking, return, forfeit). |
| Internal note | Optional, max 500 chars. Coach-facing only — never visible to client. |
| Timestamp | When the action occurred |

### 5.3 Session Type Name vs Session Name in History

Two different data points appear in the activity log:

| Where | What to display | Source |
|---|---|---|
| Balance section | Current session type name | Live lookup via session type reference |
| Activity row — Session Type column | Session type name **at the time of the event** | Must be snapshotted — renaming a session type must not alter history |
| Activity row — Session detail | Session name | Linked session record |

This is a confirmed product decision.

### 5.4 Live Data Updates — Session, Session Type, Coach, and Client Info

When core data is updated elsewhere in the platform, the Session Credits UI must reflect those changes automatically. The system must not store snapshots of this data (except for session type name in activity history per 5.3) — it must always read the latest from the source record.

**Session type info updated (name, color):**

| Where it must update | Source |
|---|---|
| Session Credit balance section — session type name and color | Session type record (live lookup) |
| Upcoming sessions list — session type name and color | Session type record (live lookup) |
| Session preview pop-over — session type name and color | Session type record (live lookup) |
| Edit session pop-up — session type name and color | Session type record (live lookup) |
| Cancel session pop-up — session type name and color | Session type record (live lookup) |
| Activity table — Session Type column | Session type record (live lookup) |

Note: activity history rows use a snapshotted session type name (see 5.3). The live lookup rule above applies to balance and session views only.

**Session info updated (date, time, duration, location, description, note):**

| Where it must update | Source |
|---|---|
| Upcoming sessions list | Session record (live lookup) |
| Session preview pop-over | Session record (live lookup) |
| Activity table rows linked to that session (used, returned actions) | Session record (live lookup) |

**Coach info updated (name, avatar):**

| Where it must update | Source |
|---|---|
| Session preview pop-over — trainer field | Coach/user record (live lookup) |
| Activity table — actor column for issued and deleted actions | Coach/user record (live lookup) |
| Edit session pop-up — trainer field | Coach/user record (live lookup) |

**Client info updated (name, avatar):**

| Where it must update | Source |
|---|---|
| Issue Credits pop-up — client name and avatar in header | Client record (live lookup) |
| Delete Credits pop-up — client name and avatar in header | Client record (live lookup) |
| Session preview pop-over — client name and avatar | Client record (live lookup) |
| Edit session pop-up — client name and avatar | Client record (live lookup) |

---

## 6. Flow 1 — Session Type: Require Credit Setting

> **Figma:** [Session Type — Require Credit Flowchart](#) ← replace with actual Figma link

### Overview

```
Coach opens Session Type (create or edit)
              │
              ▼
     ┌────────────────┐
     │  Creating new? │
     └────────┬───────┘
          Yes │                          No (editing)
              ▼                               │
  Toggle ON by default             ┌──────────▼───────────┐
  Coach can set ON/OFF             │  Sessions exist OR    │
              │                    │  credits issued?      │
              ▼                    └──────────┬────────────┘
   Session type created                  Yes  │  No
                                             │   │
                                             ▼   ▼
                                        [LOCKED] [EDITABLE]
                                             │        │
                                             │        ▼
                                             │   Coach changes value
                                             │        │
                                             │        ▼
                                             │   Re-check lock at write time
                                             │        │
                                    ┌────────┘   ┌────┴────────────────┐
                                    │            │ Still unlocked?      │
                                    │            ├─────────────────────┤
                                    │            │ Yes → Save           │
                                    │            │ No  → Reject (locked)│
                                    │            └──────────────────────┘
                                    ▼
                             Return locked state
```

### Business Rules

**When `require_credit` can be changed:**
- The flag is editable only when no sessions exist for this session type AND no credits have ever been issued for it.
- If either condition is true, the flag is locked. Any write attempt must be rejected.
- Default value: **ON** for newly created session types.

**Lock check must happen at write time:** The lock condition must be re-evaluated at the moment of submission — not only when the form is loaded. If another user adds a session to this type between load and save, the update must still be rejected.

### Archive Flow

```
Coach clicks Archive on Session Type
              │
              ▼
  Check: any clients have available credits for this type?
              │
     ┌────────┴────────┐
     │ Yes             │ No
     ▼                 ▼
  Return flag:      Proceed with archive
  has_outstanding     directly
  _credits: true
  + count
     │
     ▼
  FE shows warning
  Coach decides
     │
  ┌──┴───────────────────┐
  │ Proceed with archive  │ Cancel
  ▼                       ▼
  Check: was a session    No action
  booked for this type
  after warning shown?
     │
  ┌──┴──────────────────┐
  │ Yes                 │ No
  ▼                     ▼
  Reject archive        Archive proceeds
  (session exists)      Credits preserved
                        New issuance: blocked
                        Deletion: still allowed
```

**Key rules for archive:**
- Archiving is never blocked by outstanding credits — the coach is warned but can always proceed.
- A race condition exists: if a session is booked for this type between the warning and the coach confirming, the archive must be rejected because a session cannot exist against an archived type.
- After archiving, existing credits remain in the database and can still be deleted, but cannot be used for new bookings.

---

## 7. Flow 2 — Credit Issuance

> **Figma:** [Credit Issuance Flow](#) ← replace with actual Figma link

### Data Flow Diagram

```
Coach                        System
  │                             │
  │  Issue credits request      │
  │  (client, session type,     │
  │   quantity, optional note)  │
  │ ──────────────────────────► │
  │                             │
  │                    Validate all conditions
  │                    (see rules below)
  │                             │
  │                    ┌────────┴─────────┐
  │                    │ Validation fails  │ Validation passes
  │                    ▼                  ▼
  │◄── Error returned  │         Create credit records (1 per unit)
  │                    │         Status: available
  │                    │         Source: manual
  │                    │                  │
  │                    │         Create activity record
  │                    │         Type: issuance
  │                    │         Amount: +qty
  │                    │         Actor: coach
  │                    │                  │
  │◄───────────────────┼── Return updated balance
  │                    │                  │
  │                    │         Trigger in-app notification
  │                    │         Log entry to Updates feed
```

### Validation Rules

All of the following must pass before any record is created:

| Rule | If fails |
|---|---|
| Session type is active | Reject — session type is inactive or archived |
| Session type has `require_credit = true` | Reject — session type does not require credit |
| Client is connected (active status) | Reject — client is not eligible for issuance |
| Quantity is between 1 and 100 inclusive | Reject — invalid quantity |

### What Must Happen

- One credit record per unit of quantity (qty = 5 → 5 records), all in `available` state.
- One activity record of type `issuance` for the full quantity, with the actor (coach) reference.
- Response must include the updated balance so the UI can refresh without a separate call.
- Trigger an in-app notification to the coach managing the client.
- Log an entry to the Updates feed.

---

## 8. Flow 3 — Credit Deletion

> **Figma:** [Credit Deletion Flow](#) ← replace with actual Figma link

### Data Flow Diagram

```
Coach                        System
  │                             │
  │  Delete credits request     │
  │  (client, session type,     │
  │   quantity, optional note)  │
  │ ──────────────────────────► │
  │                             │
  │                    Check available balance
  │                    for this client + session type
  │                             │
  │                    ┌────────┴──────────────┐
  │                    │ qty > available        │ qty ≤ available
  │                    ▼                        ▼
  │◄── Reject:         │              Remove credit records
  │    insufficient    │              (oldest first, up to qty)
  │    credits         │                        │
  │                    │              Create activity record
  │                    │              Type: deletion
  │                    │              Amount: -qty
  │                    │              Actor: coach
  │                    │                        │
  │◄───────────────────┼── Return updated balance
  │                    │                        │
  │                    │              Trigger in-app notification
```

### Business Rules

- Only `available` (unused) credits can be deleted. Credits linked to a booking cannot be removed through this flow.
- Both connected and archived clients are eligible for deletion.
- The system removes the oldest credits first when processing the requested quantity.

**Race condition — balance changed elsewhere:** If the available balance drops between when the coach opened the modal and when they confirmed (due to a concurrent booking or deletion), the submitted quantity may now exceed the available balance. In this case, reject the operation and return an error so the coach can correct the quantity. The modal must stay open.

---

## 9. Flow 4 — Credit Deduction on Booking

> **Figma:** [Booking with Session Credit Flow](#) ← replace with actual Figma link

### Data Flow Diagram

```
Coach                    Booking Service              Credit System
  │                            │                           │
  │  Book session request      │                           │
  │  (client, session type,    │                           │
  │   date, time)              │                           │
  │ ─────────────────────────► │                           │
  │                            │                           │
  │                     Check: require_credit?             │
  │                            │                           │
  │                     ┌──────┴──────┐                    │
  │                     │ No          │ Yes                 │
  │                     ▼            ▼                     │
  │                  Proceed    Check balance ────────────► │
  │                  normally        │         available?   │
  │                            ┌─────┴─────┐               │
  │                            │ NO credit │ HAS credit     │
  │                            ▼           ▼               │
  │◄─── Error shown       Booking      Create session       │
  │     + link to         blocked      Create booking       │
  │     add credits                         │               │
  │                                  Deduct 1 credit ─────► │
  │                                         │        Mark: used
  │                                         │        Link to booking
  │                                         │        Activity: usage
  │                                         │               │
  │◄──────────────────────────────────────────── Booking confirmed
```

### Business Rules

- Credit check and deduction must happen as part of the booking flow — not as a separate step before or after.
- The credit check must happen at booking confirmation time, not only when the booking form is loaded. Credits available at form-open may no longer be available at confirm time.
- Exactly **1 credit** is consumed per booking, regardless of session duration, group size, or any other attribute.
- The actor on the activity record is **null** — this is a system action, not a manual coach action.
- The credit and booking are linked bidirectionally: the credit stores the booking reference, and the booking records that a credit was used.

---

## 10. Flow 5 — Credit Return & Forfeit on Cancellation

> **Figma:** [Cancellation Flow](#) ← replace with actual Figma link

### Data Flow Diagram

```
Coach                    Booking Service              Credit System
  │                            │                           │
  │  Cancel session request    │                           │
  │ ─────────────────────────► │                           │
  │                            │                           │
  │                     Check: was a credit used?          │
  │                            │                           │
  │                     ┌──────┴──────┐                    │
  │                     │ No          │ Yes                 │
  │                     ▼            ▼                     │
  │                  Cancel      Calculate:                 │
  │                  session     time until session         │
  │                  directly         │                     │
  │                            ┌──────┴────────────┐       │
  │                            │ Future (time > 0)  │ Past/started (time ≤ 0)
  │                            ▼                   ▼       │
  │                       AUTO:              Coach chooses:│
  │                       Early Cancel       [Early] or [Late]
  │                            │                   │       │
  │                            └─────────┬─────────┘       │
  │                                      │                  │
  │                             ┌────────┴────────┐         │
  │                             │ Early Cancel    │ Late Cancel
  │                             ▼                 ▼         │
  │                        Return credit    Forfeit credit ─► │
  │                        Status: available Status: forfeited│
  │                        Activity: return Activity: forfeit │
  │                        Amount: +1       Amount: 0        │
  │                             │                 │         │
  │◄────────────────────────────┴─────────────────┘─────────┘
  │  "Session has been canceled"
  │  (client notified on early cancel only)
```

### The Two Cancellation Paths

| Path | When | Credit Outcome | Client Notified? |
|---|---|---|---|
| **Early cancel** | Session is still in the future (time > 0) | Credit **returned** to available balance | Yes |
| **Late cancel** | Session has started or passed (time ≤ 0), coach selects "Late Cancel" | Credit **forfeited** — permanently lost | No |
| **Early cancel on past session** | Session has started or passed (time ≤ 0), coach selects "Early Cancel" | Credit **returned** to available balance | Yes |

**Why the coach gets to choose when the session has passed:** The session has occurred, but the coach may want to return the credit as a goodwill gesture. This flexibility is intentional.

**If no credit was used:** If the session did not consume a credit (`require_credit = false`), no credit logic applies. The session is cancelled directly.

### Key Rules

**Early cancel:**
- Credit is restored to `available` state.
- Booking link on the credit is removed.
- Activity record: type `return`, amount `+1`, actor null.
- Client receives a cancellation notification.

**Late cancel:**
- Credit is marked as `forfeited`. No balance change — the credit was already removed from available balance at booking time.
- Activity record: type `forfeit`, amount `0`, actor null.
- Client does **not** receive a cancellation notification — this is intentional.

---

## 11. Edge Cases & Concurrency Rules

The scenarios below define the expected business outcomes. BE team determines the appropriate locking or conflict resolution mechanism.

| Scenario | Expected Outcome |
|---|---|
| Two bookings attempt to use the last available credit simultaneously | One booking succeeds. The other is rejected with an insufficient credits error. |
| A credit is used or deleted elsewhere while the Delete Credits modal is open | On submission: balance is now insufficient → reject the operation → coach sees error and can correct the quantity |
| A session is booked for a session type while the Archive modal is open | Archive is rejected — a session cannot exist against an archived session type |
| Sessions or credits are added to a session type between opening and saving the Edit Session Type modal | `require_credit` update is rejected at write time — lock condition must be re-evaluated on submission |
| Another coach cancels a session while the first coach has the Cancel Session modal open | First coach's modal closes with no action — session is already cancelled |
| Client is archived after Issue Credits modal opens but before coach clicks confirm | Issuance is rejected — client status must be validated at write time |

### Workspace Downgrade to Starter

| Rule | Detail |
|---|---|
| Credits are not deleted | All existing credit records are preserved when Booking access is removed |
| Feature flag controls access | Booking feature flag is turned off; all credit UI is hidden |
| Grace period | 5-day window: if the workspace re-subscribes, all credits are immediately accessible again |
| After grace period | Credits remain in the database but Booking access requires re-subscription |

### Client Archived

| Rule | Detail |
|---|---|
| Existing credits preserved | Archiving a client does not affect their credit records |
| Issuance blocked | No new credits can be issued to an archived client |
| Deletion allowed | Coach can still delete existing credits for cleanup |
| Expiration applies | P1.1 expiration rules still apply to archived clients |

---

## 12. Activity Log & Notification Rules

### 12.1 Activity Log

Every credit state change must produce an activity record. No exceptions.

| Action | Type | Amount | Actor | Booking Ref |
|---|---|---|---|---|
| Coach issues credits | `issuance` | `+qty` | Coach | — |
| Coach deletes credits | `deletion` | `-qty` | Coach | — |
| Credit consumed at booking | `usage` | `-1` | System (null) | Yes |
| Credit returned on cancel | `return` | `+1` | System (null) | Yes |
| Credit forfeited on cancel | `forfeit` | `0` | System (null) | Yes |
| Credit expired (P1.1) | `expiration` | `-1` | System (null) | — |

**Amount sign convention:** Positive = credit added to balance. Negative = credit removed. Zero = state change only, no balance movement.

### 12.2 In-App Notifications

Sent to the **coach** who manages the client — not the client themselves — after a successful operation.

| Trigger | Message |
|---|---|
| Issuance | `"<client name> was issued {x} session credit(s) by <actor name>."` |
| Deletion | `"<client name>'s session credit balance was reduced by {x} credit(s) by <actor name>."` |

- Singular/plural: "1 session credit" vs "{x} session credits" as appropriate.
- **Web:** Clicking the notification navigates to the client's Sessions tab, anchored to the Session Credit Activities section.
- **Mobile app:** Clicking the notification navigates to the client profile.

### 12.3 Updates Feed

The same message content must appear as an entry in the Updates feed on the client profile. Clicking the feed entry follows the same navigation rule as the notification.

---

## 13. Open Questions for BE

| # | Question | BA Recommendation | Status |
|---|---|---|---|
| 1 | **Hard delete vs soft delete on credit deletion:** Should deleted records be physically removed or retained with a `deleted` status? | Soft delete — retains full audit trail if a coach disputes a deletion | Pending |
| 2 | **Available balance — live count or cached counter?** | Live count preferred for simplicity. Cached counter acceptable if performance requires it, but must stay in sync with actual records | Pending |
| 3 | **Lock condition for `require_credit` flag:** BE solution design only checks for linked sessions, not for issued credits. BA doc requires both checks. Which is the intended rule? | Both checks — sessions AND issued credits should lock the flag | Needs confirmation from Huy |
| 4 | **Notification delivery:** Should credit notifications use the existing platform notification service or a separate integration in Payment Service? | Align with existing platform pattern to avoid duplication | Pending |

---

## 14. Out of Scope for P1.0

Do not implement the following. The data model and flows should not block these from being added later.

| Feature | Planned Release |
|---|---|
| Credit expiration — setting, enforcement, and visibility | P1.1 |
| Bulk credit issuance to multiple clients at once | P1.2 |
| Package-based (automated) credit issuance on purchase | P3.1 |
| API / Zapier-based credit issuance | Future |
| Client balance visibility (client app, coach app, client web) | Future |
| Multi-coach support — locking credit management to assigned trainer | P4 |
| Payment at time of booking | Future |
| Client self-booking | Future |

---

*Prepared by: San (BA) | Source: [Spec P1.0] Session Credits functional spec | April 2026*
