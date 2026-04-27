# Session Credits P1.1 — Credit Expiration: Business Logic & Data Flow Reference for Backend

| | |
|---|---|
| **Epic** | PAY-1901 — PAY \| Booking \| Session Credits P1.1 - Credit Expiration |
| **Product Owner** | Danielle Childs |
| **Tech Lead** | Huy Nguyen |
| **BA** | San (thaovu) |
| **Last updated** | April 9, 2026 (spec v27 — booking deduction priority order; early cancel expiry transition corrected to used → expired) |

---

## Overview

P1.1 adds expiration logic on top of the P1.0 Session Credits foundation. Coaches can now set an expiration rule when issuing credits — the system automatically expires those credits when the date passes, records the event in the Balance History, and notifies the coach.

**Prerequisites:** All P1.0 infrastructure must be in place before P1.1 ships — `session_credits`, `session_credit_transactions`, balance display, and Balance History table.

Key design decisions:
- Expiration is always set **at issuance** — it cannot be changed after credits are issued.
- There is no workspace-level default expiration rule in this release.
- Only coaches are notified — clients receive no expiration notifications.
- Expiration still applies to **archived clients** and **downgraded workspaces**.

---

## Table of Contents

1. [What Changes from P1.0](#1-what-changes-from-p10)
2. [Expiration Data Model Changes](#2-expiration-data-model-changes)
3. [Credit State Machine — Updated](#3-credit-state-machine--updated)
4. [Flow 1 — Expiration Rule at Issuance](#4-flow-1--expiration-rule-at-issuance)
5. [Flow 2 — Balance Visibility with Expiration](#5-flow-2--balance-visibility-with-expiration)
6. [Flow 3 — Credit Deletion (Expiration-Aware)](#6-flow-3--credit-deletion-expiration-aware)
7. [Flow 3B — Credit Deduction on Booking (Expiration-Aware)](#7-flow-3b--credit-deduction-on-booking-expiration-aware)
8. [Flow 4 — System Auto-Expiration Job](#8-flow-4--system-auto-expiration-job)
9. [Flow 5 — 7-Day Expiring Soon Notification Job](#9-flow-5--7-day-expiring-soon-notification-job)
10. [Edge Cases](#10-edge-cases)
11. [Activity Log Updates](#11-activity-log-updates)
12. [Notification Rules](#12-notification-rules)
13. [Out of Scope for P1.1](#13-out-of-scope-for-p11)

---

## 1. What Changes from P1.0

This section is a quick diff — what P1.1 adds or changes on top of P1.0.

| Area | P1.0 | P1.1 Change |
|---|---|---|
| `session_credits` schema | No expiry field | Add `expires_at` (nullable datetime) |
| Credit issuance modal | No expiration field | Add Expiration field (optional, defaults to "Expires after") |
| Credit deletion order | Oldest credits first | **Soonest-to-expire first**, then oldest non-expiring |
| **Credit deduction order at booking** | Oldest credits first | **Soonest-to-expire first**, then oldest non-expiring |
| `expired` credit state | Not implemented | **Now active** — system job expires credits |
| Balance History event filter | Issued, Used, Returned, Voided, Deleted | Add **Expired** |
| Scheduled jobs | None | Two new jobs: **auto-expiration** + **7-day alert** |
| Notifications | Issuance, Deletion | Add **Expiration** + **Expiring Soon (7-day)** |
| Balance display | Available total only | Add expiration date grouping within session type |
| Client Overview alert | None | Non-dismissible alert when credits expire within 7 days |

---

## 2. Expiration Data Model Changes

### 2.1 `session_credits` — New Field

Add one field to the existing credit record:

| Data | Type | Notes |
|---|---|---|
| `expires_at` | Datetime, nullable | The date and time when this credit expires. Null = never expires. Set at issuance, **immutable** after that. |

All credits in the same issuance batch share the same `expires_at` value, calculated using the **next full hour boundary** from issuance time:

```
expires_at = ceil_hour(issuance_time) + N period
```

Where `ceil_hour` rounds the issuance timestamp up to the next full hour, and N period is what the coach selected (e.g. 30 days, 4 weeks, 3 months).

**Example:**
- Coach issues credits at **9:55 AM**, sets expiration = 1 day
- `ceil_hour(9:55 AM)` = **10:00 AM**
- `expires_at` = **10:00 AM the next day**

This means a coach who issues credits at any time during the 9:xx AM hour will always get an expiration at 10:00 AM on the target day — predictable and consistent.

**Immutability rule:** `expires_at` cannot be updated after the credit is created. The expiration rule is a commitment at the time of issuance.

### 2.2 `session_credit_transactions` — No Schema Change

The `expiration` transaction type was already defined in the P1.0 schema. No new fields are needed — just implement the event writing logic.

### 2.3 Expiration Date Calculation

The expiration date is calculated from the **next full hour boundary** of the issuance time, not from the exact timestamp. The coach sets a duration (e.g. 30 days), and the system calculates:

```
expires_at = ceil_hour(issuance_timestamp) + duration
```

**`ceil_hour` rule:** Round the issuance timestamp up to the start of the next full hour.
- 9:55 AM → rounds up to 10:00 AM
- 10:00 AM exactly → stays 10:00 AM (already on the hour)
- 2:01 PM → rounds up to 3:00 PM

**Full example:**
```
Issuance time:  9:55 AM, Apr 8
Duration:       1 day
ceil_hour:      10:00 AM, Apr 8
expires_at:     10:00 AM, Apr 9
```

Valid duration limits (matching Trainerize):
- Days: 1 – 365
- Weeks: 1 – 52
- Months: 1 – 36

**"Expires on" preview in the UI:** The UI shows `today + N period` as an informational preview. The actual `expires_at` is calculated server-side at commit time using the `ceil_hour` rule — the preview date may differ by up to one hour from the stored value.

---

## 3. Credit State Machine — Updated

P1.1 activates the `expired` terminal state that was reserved in P1.0.

```
                    [Coach issues credit]
                    + optional expires_at
                             │
                             ▼
                        [AVAILABLE]
                        /     |      \
          [Session booked]    |       [Coach manually deletes]
                │             |                │
                ▼             |            [DELETED]
             [USED]           |            (terminal)
            /    |  \         │
  [Early    |  [Late Cancel]  │
   Cancel]  |        │        │
        │   |        ▼        │
        │   |    [VOIDED]     │
        │   |    (terminal)   │
        │   │                 │
        │   │  [expires_at passed while in used +  │
        │   │   early cancel triggered]            │
        │   │          │                           │
        ▼   │          ▼                           │
  [AVAILABLE]      [EXPIRED] ◄────────────────────┘
  (returned)†      (terminal)
                              ▲
               [expires_at <= now, status = available]
```

**† Early cancel when `expires_at` has passed:** If a credit's `expires_at` has passed while the credit was in `used` status (linked to a booking), and the coach early-cancels the session, the credit transitions **directly from `used` to `expired`** — it does not pass through `available`. The client's balance is not temporarily increased. See Section 10.

### Updated State Definitions

| State | Description | Counts toward Available Balance? | Terminal? |
|---|---|---|---|
| `available` | Issued, not yet linked to a booking | Yes | No |
| `used` | Linked to a booking. Stays `used` until session completes, early-cancels, or late-cancels. | No | Varies |
| `voided` | Coach chose late cancel. Credit permanently lost. | No | Yes |
| `deleted` | Manually removed by coach. | No | Yes |
| `expired` | **P1.1.** `expires_at` passed while credit was in `available` state. | No | Yes |

---

## 4. Flow 1 — Expiration Rule at Issuance

> **Figma:** [Issue Credits — Expiration Field](https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4345-1117116&t=CCl6GMzfSeOEYX6w-1)

### Data Flow

```
Coach                        System
  │                             │
  │  Issue credits request      │
  │  + expiration rule          │
  │  (e.g. 30 days / null)      │
  │ ──────────────────────────► │
  │                             │
  │                    Validate all P1.0 conditions
  │                    + validate expiration input
  │                             │
  │                    ┌────────┴──────────────┐
  │                    │ Validation fails       │ Passes
  │                    ▼                        ▼
  │◄── Error returned  │          Calculate expires_at
  │                    │          = ceil_hour(issuance_time) + duration
  │                    │          (null if "Do not expire")
  │                    │                        │
  │                    │          Create credit records
  │                    │          All in same batch → same expires_at
  │                    │                        │
  │                    │          Create activity record
  │                    │          Type: issuance
  │                    │                        │
  │◄───────────────────┼── Return updated balance
  │                    │          (with expiration groups)
  │                    │                        │
  │                    │          Trigger in-app notification
```

### Validation Rules (additions to P1.0)

| Rule | If fails |
|---|---|
| If "Expires after" selected: number is a positive integer | Reject — inline error "Must be greater than 0" |
| If "Expires after" selected: number does not exceed period limit | Reject — "Must be 365 days or less" / "52 weeks or less" / "36 months or less" |
| If "Do not expire" selected: no numeric input required | Pass — store `expires_at = null` |

### What Must Happen

- Calculate `expires_at = ceil_hour(issuance_timestamp) + N period` server-side. The `ceil_hour` function rounds the issuance timestamp up to the next full hour boundary (e.g. 9:55 AM → 10:00 AM). Do not rely on the preview date shown in the UI.
- All credit records in the same batch receive the **same `expires_at`** value.
- `expires_at = null` for "Do not expire" credits.
- Once set, `expires_at` is **immutable**. No update path exists.
- Return the updated balance including expiration groupings so the UI can refresh without a separate call.

---

## 5. Flow 2 — Balance Visibility with Expiration

> **Figma:** [Balance with Expiration](https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=4770-1123982&t=AHOCq0tNAiPfQ8I5-1)

### How Credits Are Grouped

Within each session type, available credits are grouped by `expires_at` value for display. The API must return this grouped structure.

**Grouping rules:**

| Group | Condition | Order |
|---|---|---|
| Expiring groups | Credits with a non-null `expires_at` | Soonest expiration date first |
| Non-expiring group | Credits with `expires_at = null` | Shown last |

**What each group must expose:**

- Count of available credits in this group
- The `expires_at` date (null for non-expiring group)
- Whether this group expires within 7 days (for UI highlight treatment)
- Countdown in days if expiring within 7 days

**Balance section header** (overall for client): Total available credits across all session types. No "Used" count (removed in P1.0 V1.0.5).

### Session Type Details Pop-up — Expiration Section

The "EXPIRATIONS" section in the session type details pop-up shows the same grouping. The API response for this pop-up must include the grouped breakdown.

Groups with zero remaining credits must be **hidden** — do not return empty groups.

### Expiring Soon — Visual Treatment Rules

If a group's `expires_at` is within 7 days from now:
- The group is highlighted in red in the UI.
- A countdown is shown: "in {N} day(s)" where N counts down from 7 to 1.
- The soonest expiring group is shown prominently in the balance card (not just inside the pop-up).

**Countdown logic:**
```
countdown = expires_at - today (in whole days, rounded down)
Display: countdown = 1 → "1 day", countdown > 1 → "{countdown} days"
```

This countdown must be calculated at query time — it is not stored.

### Non-Dismissible Alert on Client Overview

When a client has any `available` credits with `expires_at` within 7 days, the client Overview tab must show a non-dismissible alert. The alert shows the **soonest** expiring batch only.

The API endpoint for the client Overview must return:
- Whether any credits expire within 7 days
- The soonest expiring batch's count and `expires_at`

The alert disappears automatically when:
- All credits in that batch have expired, been deleted, or been used
- No other credits within 7 days remain

---

## 6. Flow 3 — Credit Deletion (Expiration-Aware)

> **Figma:** [Delete Credits with Expiration](https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=8074-1095065&t=AHOCq0tNAiPfQ8I5-1)

### What Changes from P1.0

P1.0 deleted the oldest credits first (by `created_at`). P1.1 changes the deletion order to be **expiration-aware**:

```
Deletion priority order:
1. Soonest expiring first (earliest expires_at, ascending)
2. If tie on expires_at: oldest created_at first
3. After all expiring credits: oldest non-expiring credits (by created_at)
```

**Example:**

```
Client balance for "PT Session":
  - 1 credit, expires Mar 31
  - 2 credits, expires Apr 30
  - 3 credits, no expiration

Coach deletes 2 credits:
  → Mar 31 credit deleted first (1 credit)
  → Apr 30 group: 1 credit deleted

Result: 1 credit expiring Apr 30 + 3 non-expiring credits remain
```

### Delete Modal — Updated Balance Display

The Delete Credits modal must now show grouped expiration breakdown for both the **current balance** and the **projected new balance** after deletion. The new balance preview must reflect the expiration-aware deletion order.

The API response for the delete modal load must return the grouped expiration structure (same format as the balance view).

### All Other P1.0 Delete Rules Remain

- Only `available` credits can be deleted.
- Both connected and archived clients allowed.
- Quantity cannot exceed available balance.
- Race condition handling unchanged.
- Activity record: type `deletion`, amount `-qty`, actor = coach.

---

## 7. Flow 3B — Credit Deduction on Booking (Expiration-Aware)

### What Changes from P1.0

P1.0 deducted the oldest available credit when a session was booked. P1.1 changes this to be **expiration-aware** — the same priority order that applies to deletion now also applies at booking time:

```
Booking deduction priority order:
1. Soonest-to-expire first (earliest expires_at, ascending)
2. If same expires_at: oldest created_at first
3. After all expiring credits: oldest non-expiring credits (by created_at)
```

**Why:** This ensures the most time-sensitive credits are consumed first, minimising the risk of credits expiring unused while non-expiring credits sit idle.

### Business Rules

- When a booking is confirmed for a credit-required session type, the system selects the credit to deduct using expiration-aware priority — not oldest-first.
- If a client has a mix of expiring and non-expiring credits for the same session type, the soonest-expiring credit is always deducted first.
- If two credits share the same `expires_at`, the one issued earliest (`created_at`) is deducted first.
- Exactly **1 credit** is consumed per booking — this P1.0 rule is unchanged.
- All other P1.0 booking rules remain: credit check before booking confirmation, system actor on the usage transaction, bidirectional link between credit and booking.

### Example

```
Client balance for "PT Session":
  - 1 credit, expires Mar 31  ← deducted first
  - 2 credits, expires Apr 30
  - 3 credits, no expiration  ← deducted last

Coach books a session → Mar 31 credit is deducted.

Next booking → 1 of the Apr 30 credits is deducted.
```

---

## 8. Flow 4 — System Auto-Expiration Job

> **Figma:** [Expiration Event](https://www.figma.com/design/xBMrHdNvB1UmhAYTy1EhiZ/Booking-Project?node-id=5809-426400&t=AHOCq0tNAiPfQ8I5-1)

### What the Job Does

A scheduled job runs periodically to find and expire credits that have passed their expiration date.

**Criteria for a credit to be expired by the job:**
- `status = 'available'`
- `expires_at <= now`
- `expires_at IS NOT NULL`

Credits with `status = 'used'` are **not** expired by this job — they are still linked to an active booking.

### Data Flow

```
System (Scheduled Job)           Credit Records
       │                              │
  Find all credits where:             │
  status = available                  │
  expires_at <= now ─────────────────►│
  expires_at is not null              │
       │                              │
  For each qualifying credit:         │
       │                              │
       ├─ Update credit status        │
       │  → expired ─────────────────►│
       │                              │
       ├─ Create activity record      │
       │  Type: expiration            │
       │  Amount: −qty (per client    │
       │  + session type batch)       │
       │  Actor: null (system)        │
       │                              │
       ├─ Send in-app notification    │
       │  to coach managing client    │
       │                              │
       └─ Log to Updates feed         │
          on client profile           │
```

### Batching Logic

Expiration notifications must be **consolidated per client per job run**. If a client has credits for multiple session types expiring in the same run, send **one notification** covering all of them — do not send one notification per session type.

The notification message covers the total count of credits expiring for that client in that job run.

### Job Cadence

The expiration job runs **every 15 minutes** (per BE solution design). Because `expires_at` is always set to a full hour boundary, a credit will be picked up within 15 minutes of its expiration hour. For example, a credit expiring at 10:00 AM will be processed by the 10:00 AM, 10:15 AM, or at most the 10:30 AM job run.

### What Must Happen After Expiration

- Credit `status` updated to `expired`.
- Expiration group with 0 remaining credits is hidden from the balance view.
- If another group for that session type now expires within 7 days, the expiring-soon treatment must appear.
- The non-dismissible alert on the client Overview is updated: if no more credits expire within 7 days, the alert is removed. If another batch now qualifies, the alert updates to that batch.
- Activity record written (see Section 10).
- In-app notification sent to coach.
- Updates feed entry written on the client profile.

---

## 9. Flow 5 — 7-Day Expiring Soon Notification Job

### What the Job Does

A separate scheduled job runs **daily** to find clients who have available credits expiring in exactly 7 days, and sends a notification to their managing coach.

**Criteria:**
- Credit `status = 'available'`
- `expires_at` falls on `today + 7 days` (date comparison, not exact time)
- `expires_at IS NOT NULL`

### Consolidation Rule

One notification per client per job run. If a client has credits across multiple session types all expiring in 7 days, send one consolidated notification covering the total count.

### What Must NOT Happen

- Do **not** send an alert if the credit is expiring in fewer than 7 days (e.g. today, tomorrow, in 3 days). The 7-day window is the only trigger — there is no daily countdown notification. This will be revisited when a workspace-level credits page is built.
- Do not send a notification if the credits have already been used, deleted, or expired.

### Notification Content

See Section 11.2 for exact message format.

---

## 10. Edge Cases

### Early Cancel After Expiry Date Has Passed

If a session was booked using a credit, and that credit's `expires_at` has since passed (the date passed while the credit was in `used` status), and the coach performs an early cancel:

- The credit transitions **directly from `used` to `expired`** — it does not pass through `available`.
- The client's available balance is **not increased**, even momentarily.
- A single `expiration` activity record is written. A `return` record is **not** written, because the credit is not returned to the client — it expires instead.
- The coach does not receive a cancellation email for the credit (no balance change occurred from the client's perspective).

**Why:** The credit's expiration date already passed while it was linked to the booking. Returning it to available would be incorrect — the credit was already expired by the time the cancel happened. The cancel simply resolves the booking; the credit's fate was already determined by its `expires_at`.

### Archived Client — Expiration Still Applies

When a client is archived:
- Their credits' `expires_at` is unchanged.
- The auto-expiration job will still expire their credits when the date passes.
- The 7-day alert job will still send notifications to the coach.
- Booking is already gated on active client status, so expiration has no impact on booking eligibility.

### Workspace Downgraded to Starter

When a workspace downgrades:
- Credits are preserved (P1.0 rule).
- `expires_at` values are unchanged.
- The auto-expiration job still runs and expires credits even while Booking access is disabled.
- Notifications are still sent.
- Once the workspace re-subscribes, the balance will reflect what actually happened during the downgrade period (credits that expired during downgrade will show as expired in history).

### Delete Credits and Expiring Soon Alert

If a coach deletes the credits that were triggering the expiring-soon alert on the client Overview:
- The alert is removed if no other credits within 7 days remain.
- If another batch now qualifies (within 7 days), the alert updates to that batch.

### Issuance with Expiration ≤ 7 Days

If a coach issues credits with an expiration rule that results in `expires_at` being within 7 days of today (e.g. "Expires after 3 days"), no special alert is sent at issuance time. The 7-day alert is only triggered by the daily job, not at issuance.

---

## 11. Activity Log Updates

P1.1 activates the `expiration` transaction type that was defined but unused in P1.0.

### Updated Activity Log Table

| Action | Type | Amount | Actor | Booking Ref | Notes |
|---|---|---|---|---|---|
| Coach issues credits | Issued | `+qty` | Coach | — | Unchanged from P1.0 |
| Coach deletes credits | Deleted | `-qty` | Coach | — | Unchanged from P1.0 |
| Credit consumed at booking | Used | `-1` | System (null) | Yes | Unchanged from P1.0 |
| Credit returned on cancel | Returned | `+1` | System (null) | Yes | Unchanged from P1.0 |
| Credit voided on late cancel | Voided | `0` | System (null) | Yes | Unchanged from P1.0 |
| **Credit expired by system** | **Expired** | `−qty` | **System (null)** | — | **New in P1.1** |

### Expiration Activity Record

- **Actor is null** — expiration is system-initiated, not coach-initiated.
- **Amount** = negative count of credits expired in this batch for this client + session type.
- One activity record per client per session type per job run. If a client has 3 credits expiring for "PT Session" in a single job run, write one `expiration` record with `amount = -3`, not three separate records.
- The `expiration` event must appear in the Balance History table and in the **"Expired"** filter tab.

### Event Filter — Updated Order

The Event filter in the Balance History now includes:
Issued → Used → Returned → Voided → **Expired** → Deleted

---

## 12. Notification Rules

### 11.1 Auto-Expiration Notification (Triggered by Expiration Job)

Sent to the **coach** managing the client after the expiration job runs.

| | |
|---|---|
| **Icon** | $ icon |
| **Message** | `"{Client name} had {X} session credit(s) expire."` |
| **Singular** | "1 session credit expires" |
| **Plural** | "{X} session credits expire" |
| **Web deep-link** | Client's Sessions tab, anchored to Session Credit Activities section |
| **Mobile deep-link** | Client profile, Overview tab |
| **Updates feed** | Same content; clicking navigates same as web deep-link |

### 11.2 Expiring Soon Notification (Triggered by 7-Day Alert Job)

Sent to the **coach** managing the client when the daily job detects credits expiring in 7 days.

| | |
|---|---|
| **Icon** | $ icon |
| **Message** | `"{Client name} has {X} session credit(s) that will expire in 7 days on {DATE}."` |
| **Example** | "Esther Howard has 4 session credits that will expire in 7 days on Mar 10, 2026." |
| **Notification category** | Admin |
| **No user settings** | This notification cannot be turned off in P1.1 |
| **Web deep-link** | Client's Sessions tab |
| **Mobile deep-link** | Client profile, Overview tab |
| **Consolidation** | One notification per client per job run, covering all session types |

### 11.3 No Client Notifications

Clients are **not** notified when their credits expire or are about to expire. This is intentional in P1.1.

---

## 13. Out of Scope for P1.1

| Feature | Status |
|---|---|
| Selecting a specific calendar date for expiration (vs. duration-based) | Not in scope |
| Client-facing expiration notifications | Not in scope |
| Workspace-level default expiration rules | Not in scope |
| Expiration rules at the package level | Future |
| Workspace-level page showing all credits with expiration status | Future |
| Bulk extension of expiration dates | Future |

---

*Prepared by: San (BA) | Source: [Spec P1.1] Session Credit Expiration (Confluence) | April 8, 2026*
