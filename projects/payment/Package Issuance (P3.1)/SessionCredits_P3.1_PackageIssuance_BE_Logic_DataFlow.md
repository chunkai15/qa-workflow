# Session Credits — Package Issuance (P3.1) — Business Logic & Data Flow Reference for Backend

| Item | Value |
|---|---|
| **Spec** | [Spec 3.1] Session Credits — Package Issuance |
| **Confluence** | https://everfit.atlassian.net/wiki/spaces/EV/pages/3653993094 |
| **PI** | https://everfit.atlassian.net/browse/PMT-92 |
| **Epic** | PAY-1901 *(placeholder — update when P3.1 Epic is created)* |
| **Product Owner** | Jon |
| **Tech Lead** | TBD *(open question — assign for review)* |
| **BA** | San (thaovu) |
| **Designer** | Linh Ta |
| **Spec version** | v34 — last updated 2026-05-07 |
| **Document Log** | Empty (spec is pre-V1.0.0 — no overrides applied) |
| **Figma** | [Payment V1 — P3.1 Package Issuance](https://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=40996-131325) |

---

## Overview

P3.1 layers automated credit issuance on top of the Package system: a coach attaches a Session Credit configuration to a package, and the system automatically issues credits to the buying client whenever a successful payment is made and the purchase is activated. This release ships two issuance models — one-time purchase and recurring renewal — with optional per-session-type expiration carried over from P1.1. The release also redefines the eight Purchase statuses, redesigns the Purchase Details pop-up, and adds source linkage between issued credits and the package that produced them. The "why": 65% of surveyed coaches want recurring package credit issuance and 57% want one-time issuance — manual issuance every renewal does not scale.

---

## Table of Contents

1. Domain Concepts
2. Pre-conditions & Access Rules
3. Feature-Level Flow
4. Purchase Lifecycle & State Machine
5. Data Requirements
6. Flow 1 — Configure Session Credits on a Package (US1)
7. Flow 2 — Edit Session Credits on a Package (US2)
8. Flow 3 — Issue Credits on Successful Payment + Activation (US7)
9. Flow 4 — View Credit Rule from a Purchased Package (US6)
10. Flow 5 — Session Type Updates Propagation (US8)
11. Flow 6 — Workspace Loses Payment & Packages (US11)
12. Flow 7 — Booking Feature Flag OFF (US12)
13. Flow 8 — Migration of Existing Packages (US13)
14. Edge Cases & Concurrency Rules
15. Activity Log & Notification Rules
16. Open Questions for BE
17. Out of Scope

---

## 1. Domain Concepts

**Package**
A sellable unit owned by the workspace. Has one Pricing Plan, an optional Free Trial configuration, and (new in P3.1) an optional Session Credit configuration. A Package may be in draft (unpublished) or published.

**Pricing Plan**
The price + billing model attached to a Package. Two models: **One-time Payment** or **Recurring Subscription**. Recurring carries a billing cycle (number + unit: weeks/months) and an expiration rule (Never or Ends after N invoices).

**Free Trial**
An optional period before the first paid invoice. While the purchase is in trial, no credits are issued.

**Session Credit Configuration (new — P3.1)**
A set of rules attached to a Package describing what credits to issue on each successful payment + activation. Each rule contains: session type, quantity, and per-rule expiration duration. A package may carry up to 5 session-credit rules, one per distinct session type.

**Purchase**
A specific client's instance of buying a Package. Has a status (Active, Free Trial, Overdue, Paused, Expires Soon, Expired, Cancels Soon, Cancelled), a billing schedule, and an activation flag.

**Purchase Activation**
The state in which a Purchase is linked to a client `account_ID`. There are **two paths** to activation:

1. **Logged-in path → auto-activation.** If the client is already logged in at the moment of purchase or trial-start, the system already knows their `account_ID`, so the Purchase is **automatically activated at creation**. No subsequent action is required from the client. *(This is the current Everfit logic.)*
2. **Guest path → manual activation.** If the client purchases or starts a trial **without logging in**, the Purchase is created without an `account_ID` link. Payment can still succeed, but the Purchase remains *not activated* until the client subsequently **logs in or signs up** — at which point the Purchase is linked to their `account_ID` and becomes activated.

**Issuance always requires three conditions:** (a) a successful paid invoice for the cycle, AND (b) the Purchase is activated, AND (c) the workspace's Booking feature is ON at the moment of issuance. For logged-in purchases (auto-activation) all three conditions usually align at payment success. For guest purchases, the Purchase may sit unactivated for any duration; on later activation, the system back-issues credits for every paid-but-not-yet-issued cycle. (US7 AC0–AC5.)

**Package Snapshot**
A frozen copy of the Package's Session Credit configuration captured at the moment of purchase. All future renewals on that purchase issue credits according to the snapshot — not the live package — so coach edits to the package only affect new purchases.

**Issuance Event**
The atomic operation that creates one or more credit records for a client when triggered by a successful paid invoice + activation. Linked back to the source Purchase, source Invoice, and the Package Snapshot used.

**Source Link (Balance History)**
A clickable reference in Balance History that takes a coach with Payment & Packages permission back to the Purchased Package Details pop-up that issued the credit. Coaches without that permission see the package name as plain (non-clickable) text.

---

## 2. Pre-conditions & Access Rules

| Condition | Rule | Applies To |
|---|---|---|
| Booking feature | Workspace must have the Booking feature enabled | All Session Credit functionality (config, issuance, balance, history) |
| Payment & Packages add-on | Workspace must have the Payment & Packages feature enabled | All Package and Pricing functionality |
| User role | Coach must be Owner, Admin, or Trainer | Configuring/editing Package Session Credit rules; archiving session types |
| Session type status | Session type must be `active` AND have `require_credit = true` | Selectable in package's Session Credit configuration; required for publish |
| Stripe | Workspace must have a connected Stripe account before any Pricing Plan can be set | Add Pricing button on Package Overview |

> **Note on client status (US7 AC6):** Client connection / archive status is **not** a pre-condition for package issuance. As long as the Purchase is active and the payment is paid, credits are issued via Package — even if the client has been archived. Activation still requires the client to log in / sign up so the Purchase can be linked to an `account_ID`, but archive state **after** that does not block issuance via Package.

---

## 3. Feature-Level Flow

```
                ┌──────────────────────────────────────────────────────────────────────────────┐
                │  Coach configures a Package's pricing + Session Credit rules  (US1, US2)     │
                │   • One-time OR Recurring (with optional Free Trial)                          │
                │   • 1–5 Session Credit rules, each with quantity 1–100                        │
                │   • Per-rule expiration (months / weeks / days)  — reuses P1.1 model          │
                └─────────────────────────────────────┬────────────────────────────────────────┘
                                                      │  Coach publishes package
                                                      ▼
                ┌──────────────────────────────────────────────────────────────────────────────┐
                │  Package is published & purchasable                                           │
                │   • Pricing model field becomes locked                                        │
                │   • Session Credit rules remain editable — edits affect NEW purchases only   │
                └─────────────────────────────────────┬────────────────────────────────────────┘
                                                      │  Client buys via Package link OR Payment Request
                                                      │  (login NOT required at purchase time — guest purchase OK)
                                                      ▼
                ┌──────────────────────────────────────────────────────────────────────────────┐
                │  Purchase created                                                             │
                │   • Package Snapshot captured (frozen credit rules for this purchase)         │
                │   • Status: Free Trial OR Active OR Overdue                                   │
                │     (depending on trial + first-payment outcome + activation state)           │
                └─────────────────────────────────────┬────────────────────────────────────────┘
                                                      │
                ┌─────────────────────────────────────┴─────────────────────────────────────────┐
                │                  Did the client log in BEFORE buying / starting trial?         │
                └─────────────────────────────────────┬─────────────────────────────────────────┘
                                                      │
                  ┌───────────────────────────────────┴───────────────────────────────────┐
                  │ YES → logged in                                                       │ NO → guest purchase
                  │  account_ID is known at purchase time                                  │  account_ID unknown
                  │  → Purchase is AUTO-ACTIVATED at creation                              │  → Purchase is NOT activated yet
                  ▼                                                                        ▼
   ┌──────────────────────────────────────────────────┐         ┌──────────────────────────────────────────────────┐
   │  Activated immediately — issuance follows the    │         │  Purchase stays unactivated for any duration     │
   │  payment lifecycle (next box)                    │         │  Payment(s) may succeed in the meantime          │
   └─────────────────────────┬────────────────────────┘         │  Client later LOGS IN / SIGNS UP                 │
                             │                                  │  → Purchase linked to account_ID                 │
                             │                                  │  → Purchase becomes ACTIVATED                    │
                             │                                  │  → BACK-ISSUE every paid-but-not-yet-issued      │
                             │                                  │    cycle (see Failure paths below for the        │
                             │                                  │    "expires_at in the past" rule)                │
                             │                                  └─────────────────────────┬────────────────────────┘
                             │                                                            │
                             └────────────────────────────────────┬───────────────────────┘
                                                                  │
                                                                  ▼
                ┌──────────────────────────────────────────────────────────────────────────────┐
                │  Per-cycle issuance gate (checked for EVERY cycle, EVERY model)               │
                │     a) Invoice for this cycle paid successfully?                              │
                │     b) Purchase is activated?                                                  │
                │     c) Workspace's Booking feature is ON?                                      │
                │   If ALL THREE → ISSUE credits per Package Snapshot. Else → skip this cycle.  │
                └─────────────────────────────────────┬────────────────────────────────────────┘
                                                      │
        ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
        │  One-time, NO trial                          │  One-time WITH trial                        │  Recurring (with or without trial)
        ▼                                              ▼                                              ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│  Single payment succeeds             │  │  Trial period — NO issuance          │  │  Trial — NO issuance (if applicable)         │
│  + gate passes                       │  │  ↓                                    │  │  ↓                                            │
│  → ISSUE credits per snapshot        │  │  First paid invoice after trial      │  │  First paid billing cycle                    │
│                                      │  │  + gate passes                       │  │  + gate passes                               │
│  Expiration anchor:                  │  │  → ISSUE credits per snapshot        │  │  → ISSUE credits per snapshot                │
│  Day of payment success              │  │                                      │  │                                              │
│                                      │  │  If trial-end payment FAILS          │  │  Then on EACH successful renewal             │
│                                      │  │  → NO credits, Purchase = Cancelled   │  │  + gate passes → ISSUE again                 │
│                                      │  │                                      │  │                                              │
│                                      │  │  Expiration anchor:                  │  │  Expiration anchor:                          │
│                                      │  │  Day AFTER trial end                 │  │  FIRST day of the billing cycle              │
│                                      │  │                                      │  │  (NOT the payment-success date)              │
└──────────────────┬───────────────────┘  └─────────────────┬────────────────────┘  └──────────────────────┬───────────────────────┘
                   │                                        │                                              │
                   └────────────────────────────────────────┴──────────────────────────────────────────────┘
                                                      │
                                                      ▼
                ┌──────────────────────────────────────────────────────────────────────────────┐
                │  Credits live in client's Balance                                             │
                │   • Booking deducts                              (P1.0)                       │
                │   • Early cancel returns                         (P1.0)                       │
                │   • Late cancel may void                         (P1.0)                       │
                │   • Coach manually deletes                       (P1.0)                       │
                │   • Expiration auto-expires                      (P1.1)                       │
                │   • Balance History shows source package → Purchased Package Details (P3.1)  │
                └──────────────────────────────────────────────────────────────────────────────┘

──────────────────────────────────  Failure / non-happy paths  ──────────────────────────────────
 • Failed first payment after trial             →  Purchase = Cancelled, NO credits issued
 • Failed renewal payment                       →  Purchase = Overdue, NO credits this cycle
 • Recharge of failed/overdue invoice succeeds  →  Re-evaluate the per-cycle gate; if it passes, ISSUE credits now
 • Booking feature OFF at moment of issuance    →  Per-cycle gate fails → NO issuance, no notifications, UI hidden.
                                                   If feature is later turned ON, retroactive back-issuance is OUT OF SCOPE
                                                   for P3.1 — confirm with BE (see Open Questions).
 • Payment & Packages feature OFF               →  No new issuance via Package; history preserved; source link non-clickable
 • Client archived AFTER activation             →  ISSUANCE CONTINUES via Package — archive does NOT block issuance
 • Guest purchase, client never logs in         →  Purchase remains unactivated; no issuance ever occurs (until/unless they log in)
 • Late activation (guest path, one or more cycles paid before login/sign-up)
                                                →  On activation, back-issue every paid-but-not-yet-issued cycle, using each
                                                   cycle's billing-cycle-based expiration anchor. If the resulting expires_at
                                                   is already in the past, the credit is issued AND immediately expired in the
                                                   same operation (Balance History shows both events same day).
```

---

## 4. Purchase Lifecycle & State Machine

P3.1 redefines purchase statuses (US3, US4). Issuance triggers depend on this status machine, so it is shown here in full.

```
                              ┌──────────────────┐
                              │  Payment Request │
                              │  (no status —    │
                              │  client hasn't   │
                              │  started)        │
                              └────────┬─────────┘
                                       │ client opens trial
                                       │ from request OR purchase
                                       ▼
        ┌──────────────┐  trial start  ┌──────────────┐
        │  FREE TRIAL  │◄──────────────│   (entry)    │
        │              │               └──────┬───────┘
        │              │                      │ no trial → first payment
        └──────┬───────┘                      ▼
               │ trial ends                ┌──────────────┐
               │ + payment success         │   ACTIVE     │
               ├──────────────────────────►│              │
               │                           └──┬─┬─┬─┬─────┘
               │ trial ends                   │ │ │ │
               │ + payment fail               │ │ │ │
               ▼                              │ │ │ │ ┌─► OVERDUE (renewal failed)
        ┌──────────────┐                      │ │ │ └─┘     ↓ recharge ok → ACTIVE
        │  CANCELLED   │◄──── coach/client ───┘ │ │         ↓ recharge fail eventually
        │  (failure or │      cancel immediately│ │         ↓ → CANCELLED
        │  cancel)     │                        │ │
        └──────┬───────┘                        │ │ ┌─► PAUSED (coach pause; recurring only)
               │                                │ └─┘     ↓ resume → ACTIVE / EXPIRES SOON
               │                                │
               │                                └────► CANCELS SOON (scheduled cancel
               │                                         at next renewal)
               │                                         ↓ reactivate → ACTIVE / EXPIRES SOON / OVERDUE
               │
               ▼  (no transitions out — terminal)

Fixed-term recurring path:
   ACTIVE → (last invoice issued) → EXPIRES SOON → (cycle ends) → EXPIRED  (terminal)

Cancel scheduled path:
   ACTIVE / OVERDUE → CANCELS SOON → (cancel date reached) → CANCELLED (terminal)
```

### Status Definitions

| Status | Trigger | Issuance Behavior | Terminal? |
|---|---|---|---|
| Free Trial | Trial active (no first paid invoice yet) | No issuance during trial | No |
| Active | Recurring with valid renewal pipeline; OR one-time successfully paid + activated | Issuance occurs on each successful billing cycle + activation | No |
| Overdue | Renewal invoice failed (recurring) | No issuance for the failed cycle; recharge success → issue | No |
| Paused | Coach paused recurring purchase | No issuance while paused | No |
| Expires Soon | Fixed-term recurring's last invoice has been issued | Final cycle issuance follows normal rules | No |
| Expired | Fixed-term recurring reached natural end | No further issuance | Yes |
| Cancels Soon | Scheduled to cancel at next renewal | Issuance continues until cancel date | No |
| Cancelled | Coach/client cancelled, OR first paid invoice after trial failed | No issuance | Yes |

**Key rule:** Credits are only issued when **(a)** an invoice for that billing cycle is successfully paid **and** **(b)** the Purchase is activated. Both conditions must hold; order is irrelevant.

---

## 5. Data Requirements

> **Field naming and schema are BE decisions.** This section describes data by purpose, not by column name.

### 5.1 Package — Session Credit Configuration

| Data | Purpose |
|---|---|
| Session Credit toggle (on/off) | Whether the package issues credits at all |
| Set of credit rules (1–5) | One rule per distinct session type |
| Rule: session type reference | Which session type the rule applies to |
| Rule: quantity | How many credits to issue per trigger (1–100) |
| Rule: expiration duration (number + unit) | Per-rule expiration applied to issued credits — same semantics as P1.1 |
| Configuration version / change marker | So that a Purchase can snapshot the configuration that existed at purchase time |

### 5.2 Purchase — Package Snapshot

When a Purchase is created, the system must store a snapshot of the Package's Session Credit configuration at that moment, including:

| Data | Purpose |
|---|---|
| Snapshot of all credit rules (session type ref, quantity, expiration) | Frozen rules used for every issuance event on this purchase, regardless of future package edits |
| Activation status | Whether the Purchase has been activated (gates issuance) |
| Activation timestamp | When activation occurred (used for late-activation backfill) |
| Last issuance cycle marker | Tracks which billing cycles have already issued credits, so renewals don't double-issue and late-activation can correctly backfill missed cycles |

### 5.3 Issued Credit — Source Linkage (new — P3.1)

Every credit issued via a Package must record:

| Data | Purpose |
|---|---|
| Source Purchase reference | Enables the Balance History → Purchased Package Details deep link |
| Source Invoice reference | Enables tracing which paid invoice produced these credits |
| Snapshotted package name (at issuance) | What displays in Balance History; survives package rename |
| Snapshotted session type info (color, name, duration, location type) | Survives session type edits/archival for historical accuracy |

> **Confirmed (per BA):** Session type fields (color, name, duration, location type) are **live-looked-up** from the current session type — Balance History and Purchase Details pop-up always reflect the latest info. The package name shown on the source link is also live (BE does not need to snapshot session type fields or package name).

### 5.4 Live Data Update Rules (US8)

Updates to the underlying entities must propagate to all displays:

**Session Type updates:**
| Display | Field that must reflect updates |
|---|---|
| Package Pricing pop-up (dropdown + populated row) | Color, Name, Duration, Location type |
| Package Overview — Session Credits component | Color, Name |
| Purchase Details pop-up — Session Credits section | Color, Name, Duration, Location type |
| Balance History — session type rendering | As P1.0 (live) |

**Package updates:**
| Display | Field that must reflect updates |
|---|---|
| Package overview | Live |
| Purchase Details pop-up — package name | Live (this is the user-facing name throughout the pop-up) |
| Balance History source link | **Live** — package name reflects the current package name |

**Client updates (rename, avatar, archive):**
- Notifications and Balance History entries follow P1.0 conventions.

### 5.5 Cancellation / Status Changes Mid-Lifecycle

- A Purchase moving from any non-terminal status into `Cancelled` or `Expired` does **not** retroactively void already-issued credits. Already-issued credits remain in the client's balance and follow P1.0/P1.1 rules.
- A Purchase moving into `Paused` halts further issuance until resumed. No back-issuance for the paused interval (see Out of Scope — Pause subscription expiration clock).

---

## 6. Flow 1 — Configure Session Credits on a Package (US1)

> **Figma:** [US1 — Package Pricing pop-up](https://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=42382-845647)

### 6.1 Data Flow

```
Coach (Workspace)        System / API                Payment Service           Booking Service
    │                         │                            │                         │
    │ Open Package Pricing    │                            │                         │
    ├────────────────────────►│                            │                         │
    │                         │ Check Stripe connected     │                         │
    │                         ├───────────────────────────►│                         │
    │                         │                            │                         │
    │                         │ Fetch active session types │                         │
    │                         │ where require_credit=true  │                         │
    │                         ├──────────────────────────────────────────────────────►│
    │                         │◄──────────────────────────────────────────────────────┤
    │ Configure rules         │                            │                         │
    │ (1–5 session types)     │                            │                         │
    │ + click Update Pricing  │                            │                         │
    ├────────────────────────►│                            │                         │
    │                         │ Validate config            │                         │
    │                         │ (qty, expiration, dup,     │                         │
    │                         │  session type still valid) │                         │
    │                         │                            │                         │
    │                         │ Persist Pricing + Credit   │                         │
    │                         │ config to package          │                         │
    │                         ├───────────────────────────►│                         │
    │◄────────────────────────┤  Success                   │                         │
```

### 6.2 Business Rules

- **A package can carry between 1 and 5 Session Credit rules**, each tied to a distinct session type. **Why:** Coach research showed 59% want >1 session type per package, but >5 was rare. (US1 AC14.)
- **Quantity per rule must be 1–100.** (US1 AC12, AC16.) Empty, zero, or >100 must fail validation.
- **Each session type may appear at most once per package.** This is enforced by the UI: when the coach has already selected a session type for one rule, the **dropdown for any subsequent rule must filter that session type out** so it cannot be picked again. The session type list endpoint (or the dropdown's data source) must therefore know which session types are already selected in the current pop-up state. (US1 AC14.)
- **Per-rule expiration uses the P1.1 model** (Never / Expires after N {months|weeks|days}) and reuses P1.1 validation. (US1 AC12.)
- **Selectable session types** are: workspace's session types where `status = active` AND `require_credit = true`. (US1 AC12.)
- **Both toggles independent:** Free Trial and Session Credits toggles are independent, but if both ON, a notice must surface that issuance happens *after* trial ends + first payment success. **Why:** Coaches must understand trial = no issuance. (US1 AC15.)
- **Pricing model — billing cycle limits (recurring):** number 1–12; cycle unit weeks or months. (US1 AC9.)
- **Free Trial duration follows current implementation.** Default 7 days. (US1 AC11.)

### 6.3 Validation Rules (server-side)

| Rule | If fails |
|---|---|
| Pricing model required | Block save |
| Price within Stripe min/max for currency | Block save with "Minimum value is {min}" or "Maximum value is {max}" |
| Billing cycle (recurring): integer 1–12 | Block save |
| At least one session type rule when toggle ON | Block save: "Please select session type." |
| Each rule's quantity: integer 1–100 | Block save: "Please set a number of credits." / "Amount must be greater than 0." / "Amount must not exceed 100." |
| Each rule's expiration: P1.1 limits | Block save (reuse P1.1 errors) |
| Each rule's session type: still active AND `require_credit = true` at the moment of save | See Race Condition below — block save with toast and remove invalid rule |
| Distinct session types across rules | Primarily enforced in the UI (dropdown filters out already-selected types — US1 AC14). Server should still reject duplicates as defense-in-depth (e.g. concurrent saves, direct API calls). |

### 6.4 Race Condition — Session Type Becomes Invalid Mid-Edit (US1 AC17)

A coach may have a session type selected in the Package Pricing pop-up while another tab archives or turns off `require_credit`. On clicking Update Pricing, the server must re-validate.

| Scenario | Expected Outcome |
|---|---|
| Selected session type was archived before save | Reject save; client receives a signal that allows the UI to show "A session type is no longer available. Please try again." and remove the offending row |
| Selected session type had `require_credit` turned off before save | Same as above |
| All rules valid, save succeeds | Persist and return updated package |

### 6.5 What Must Happen on Successful Save

After Update Pricing succeeds:
- The Package's Pricing Plan is updated.
- The Package's Session Credit configuration is updated (replaced as a set, not merged).
- The Package overview reflects: Pricing Plan block, Session Credits block (only if at least one rule exists).
- Pricing-model field becomes locked once the package is published (US2 AC1).

---

## 7. Flow 2 — Edit Session Credits on a Package (US2)

> **Figma:** [US2 — Edit Package Pricing](https://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=42325-450785)

### 7.1 Business Rules

- **Pricing model field is locked after publish.** Once a Package has been published, the pricing model (One-time vs Recurring) cannot be changed. (US2 AC1.) **Why:** The model defines the entire schedule shape — changing it after sales would invalidate every existing Purchase's snapshot.
- **All Session Credit fields remain editable at any time.** Toggle, session types, quantities, expiration rules — all editable on a published package. (US2 AC2.)
- **Edits to Session Credit configuration apply only to *new* purchases.** Existing Purchases continue to use their snapshot. (US2 AC5.) **Why:** Clients have already entered into a contract under the original rules.
- **Confirmation pop-up required only after the first publish.** If the package has never been published, save without confirmation. If the package has been published at least once, show a confirmation pop-up listing which sections changed (Pricing Plan / Free Trial / Session Credits) and explicitly stating "This change will not affect recurring payments for existing clients." (US2 AC3, AC4.)
- **Block publish if any rule's session type is invalid.** If any session type in the credit rules is archived or no longer requires credit, the publish action must fail with: "Can't publish. A session credit rule is tied to an inactive session type. Please activate the session type or update the rule to continue." (US2 AC6.)

### 7.2 What Must Happen on Successful Edit

- Updated Pricing/Trial/Credit config is persisted to the Package.
- All **already-existing** Purchases retain their snapshot — no change to their issuance behavior.
- Subsequent **new** Purchases capture a fresh snapshot from the updated Package.

---

## 8. Flow 3 — Issue Credits on Successful Payment + Activation (US7)

This is the core BE flow. **Issuance is only triggered when ALL THREE conditions are met for a given billing cycle:**
- **(a)** the invoice for that cycle was paid successfully,
- **(b)** the Purchase is activated (linked to an `account_ID`), and
- **(c)** the workspace's Booking feature is ON at the moment of issuance.

> **Figma:** [Issuance flows](https://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=42589-330598)

### 8.1 Activation-Path Reminder

Two activation paths feed into the same issuance gate:

- **Logged-in path:** Client logged in before purchase/trial-start → Purchase **auto-activated at creation** → activation condition (b) is satisfied immediately. Subsequent payments pass through the gate as soon as they succeed.
- **Guest path:** Client purchased/started trial without logging in → Purchase **not activated** until the client later logs in or signs up. Until activation, condition (b) fails, so any successful payments in the meantime do **not** trigger issuance. On activation, the system back-issues every paid-but-not-yet-issued cycle through the same gate.

### 8.2 Data Flow

```
Payment Service                Booking Service / Credit Logic              Notification / Activity Log
       │                                  │                                       │
       │  Invoice paid event              │                                       │
       │  (one-time first / renewal)      │                                       │
       ├─────────────────────────────────►│                                       │
       │                                  │  Per-cycle gate (3 conditions):        │
       │                                  │   a) invoice paid successfully? ✓      │
       │                                  │   b) Purchase activated?               │
       │                                  │      ─ No → defer; wait for            │
       │                                  │             activation event           │
       │                                  │      ─ Yes → continue                  │
       │                                  │   c) WS Booking feature ON?            │
       │                                  │      ─ No → SKIP this cycle (no        │
       │                                  │             back-fill in P3.1; OQ)     │
       │                                  │      ─ Yes → continue                  │
       │                                  │                                       │
       │  Activation event                │                                       │
       │  (login or sign-up linking the   │                                       │
       │   guest Purchase to account_ID;  │                                       │
       │   logged-in purchases skip this  │                                       │
       │   step — already activated)      │                                       │
       ├─────────────────────────────────►│                                       │
       │                                  │  For each cycle that is now paid       │
       │                                  │  AND not yet issued (catch-up loop     │
       │                                  │  for guest-path back-issuance):        │
       │                                  │   1. Re-evaluate per-cycle gate        │
       │                                  │   2. Read Purchase's Package Snapshot  │
       │                                  │   3. For each credit rule in snapshot: │
       │                                  │      • Compute expires_at:             │
       │                                  │        – one-time, no trial: from      │
       │                                  │          payment success date          │
       │                                  │        – one-time, with trial:         │
       │                                  │          from day after trial end      │
       │                                  │        – recurring: from FIRST DAY     │
       │                                  │          of the billing cycle (not     │
       │                                  │          payment date)                 │
       │                                  │      • Issue {qty} credits, each       │
       │                                  │        linked to: client, session      │
       │                                  │        type, source Purchase, source   │
       │                                  │        Invoice, snapshotted package    │
       │                                  │        name                            │
       │                                  │      • If expires_at is already in     │
       │                                  │        the past → issue + immediately  │
       │                                  │        expire (Balance History shows   │
       │                                  │        both events same day)           │
       │                                  │   4. Mark cycle as issued on Purchase  │
       │                                  ├──────────────────────────────────────►│
       │                                  │                                       │  Append "issuance" event
       │                                  │                                       │  to Balance History
       │                                  │                                       │  Send in-app notification
       │                                  │                                       │  (web + mobile)
       │                                  │                                       │  Append entry to client
       │                                  │                                       │  profile Updates feed
```

### 8.3 Issuance Trigger Matrix

The matrix is the **same regardless of activation path** — logged-in vs guest only changes *when* condition (b) is met. The trigger described below is what happens once the per-cycle gate passes.

| Package model | Trigger to issue (gate passes) | Expiration anchor |
|---|---|---|
| One-time, no trial | First (and only) successful payment + gate passes | Day of payment success |
| One-time with trial | First successful **paid** invoice after trial ends + gate passes; no issuance during trial; if trial-end payment fails → Purchase = Cancelled, no credits | Day after trial end |
| Recurring, no trial | First successful billing-cycle payment + gate passes, then each subsequent successful renewal + gate passes | First day of billing cycle (NOT payment success date) |
| Recurring with trial | First successful **paid** invoice after trial ends + gate passes; then each subsequent successful renewal + gate passes; no issuance during trial; if trial-end payment fails → Purchase = Cancelled, no credits | First day of billing cycle |

**Logged-in vs guest examples (illustrative, not separate rules):**
- *Logged-in, recurring, no trial:* client logs in → buys → first-cycle payment succeeds → gate passes (already activated) → issue immediately. Each future renewal: payment succeeds → gate passes → issue.
- *Guest, recurring, no trial:* guest buys → first-cycle payment succeeds → gate fails on (b), defer. Maybe several renewal payments succeed. Eventually client logs in → activation event fires → catch-up loop runs the gate against each unissued cycle and issues credits for each cycle that passes.
- *Logged-in, one-time with trial:* client logs in → starts trial → trial ends → trial-end payment succeeds → gate passes → issue, anchored day after trial end.
- *Guest, one-time with trial:* guest starts trial → trial ends → trial-end payment succeeds → gate fails on (b). Client logs in later → catch-up loop issues credits, anchored day after trial end. If the resulting `expires_at` is already past, credit is issued and immediately expired same-day.

**Late activation:** Per the catch-up loop above. (US7 AC5.)

**Booking feature OFF at moment of issuance:** Per-cycle gate fails on (c). The cycle is **skipped, not deferred** — there is no automatic retroactive back-issuance if the workspace later turns Booking back on. *(See OQ-11 in §16 — confirm with BE whether this is acceptable.)*

### 8.4 Failure / Recovery Rules

- **First paid invoice fails after trial:** No credits issued. The Purchase moves to `Cancelled`. If a subsequent recharge of the failed invoice succeeds, the per-cycle gate is re-evaluated; if it now passes, credits **must** be issued for that cycle. (US7 AC2, AC3.)
- **Renewal invoice fails (recurring):** Purchase moves to `Overdue`. No credits for that cycle. If a subsequent recharge of the overdue invoice succeeds, the per-cycle gate is re-evaluated; if it now passes, credits **must** be issued for that cycle. (US7 AC3, AC4.)
- **Booking feature OFF at moment of issuance** (gate condition c fails): cycle is **skipped**. Per current scope, no automatic back-fill if Booking is later turned ON. (US7 AC0; US12 AC1; see OQ-11.)
- **Payment & Packages feature OFF:** No new issuance via Package; historical credits remain visible; Balance History source link is non-clickable while OFF. (US11 AC1.)
- **Purchase not activated** (gate condition b fails): cycle is **deferred**, not skipped — on activation event, the catch-up loop re-evaluates the gate for every unissued paid cycle and issues credits for each cycle that passes. (US7 AC5.)

### 8.5 What Must Happen on Successful Issuance (atomic)

All of the following must succeed together; failure of any must roll back the issuance:

0. The per-cycle gate (a/b/c — see §8) has passed for this cycle.
1. New credit records are created for the client (one per quantity per rule, following P1.0 conventions).
2. Each credit record is linked back to: source Purchase, source Invoice, snapshotted package name.
3. Each credit's `expires_at` is set per the Trigger Matrix above (or left null if the rule has no expiration).
4. The Purchase's "last issuance cycle" marker is advanced so the same cycle cannot double-issue.
5. The client's available balance reflects the new credits immediately.
6. A Balance History entry is appended (see §15).
7. An in-app notification is sent to the coach who manages this client (see §15).
8. An entry is appended to the client profile Updates feed.

### 8.6 Balance History Source Link

Each issuance event in Balance History displays the package name as a clickable link.

| Coach has Payment & Packages permission? | Behavior on click | Hover behavior |
|---|---|---|
| Yes | Navigate to Purchased Package Details pop-up for the source Purchase | Tooltip showing full package name |
| No | Not clickable (plain text) | Tooltip showing full package name |

---

## 9. Flow 4 — View Credit Rule from a Purchased Package (US6)

> **Figma:** [Purchase Details — Session Credits section](https://www.figma.com/design/bglNu50BMGydsXtF4hNWQd/Payment-V1?node-id=42385-924642)

### 9.1 Business Rules

- The Purchased Package Details pop-up's Session Credit section is rendered from the Package Snapshot — not the live package — so a coach editing the package later will not retroactively change what this client's purchase shows. (US6 AC1.)
- Show only if the snapshot includes at least one credit rule. (US6 AC2.)
- Each rule row displays: session type (color, name, long-name truncation), quantity per cycle, and per-rule expiration ("in {n} {period}").
- The "View issued credits" button on each row deep-links to the client's Sessions tab → Credits tab.
- The "View issued credits" button must be disabled until the Purchase has been activated, with tooltip: "Client has to activate purchase before credits can be issued." (US6 AC1.)

---

## 10. Flow 5 — Session Type Updates Propagation (US8)

### 10.1 Business Rules

- **Session type info updates propagate live** to all of: Package Pricing pop-up dropdown, Package overview Session Credits component, Purchase Details pop-up Session Credits section, and Balance History rows. (US8 AC1.) **Why:** Coaches need names/colors to stay current.
- **Archiving a session type that is bound to a published package's credit rule is blocked.** Pop-up: "Session Type In Use — This session type is configured in the session credit rules for a published package. To archive this session type, you must remove the session type from the package or unpublish the package." (US8 AC2.) **Why:** Prevents broken issuance rules at runtime.
- **Once unbound (rule removed or package unpublished), archiving is allowed**, but already-existing Purchases continue to issue from their snapshot. **Cancelling those Purchases is the only way to stop further issuance.** (US8 AC2 — explicit in spec.)
- **Turning off `require_credit` on a session type is blocked** if the session type is currently in any package's credit rule, OR has any linked sessions, OR has any issued credit. Tooltip: "This setting is locked because this session type is already linked to existing sessions, issued session credit, or is in a package session credit rule." (US8 AC3.)

---

## 11. Flow 6 — Workspace Loses Payment & Packages (US11)

| Scenario | Expected Outcome |
|---|---|
| WS has historical credits issued via package; P&P feature is turned OFF | All existing balance and history data is **preserved**. No new issuance occurs from any package. Source link from Balance History is **not clickable** while P&P is OFF (US11 AC1). |
| P&P feature is turned ON again | All historical data re-displays. Source links become clickable again (US11 AC2). |

**Note:** This flow does NOT delete data; it only suspends issuance + linkage.

---

## 12. Flow 7 — Booking Feature Flag OFF (US12)

When the Booking feature flag is off for a workspace:

- All Session Credit UI is hidden in packages (Session Credits toggle, configuration, displays).
- Client profile Sessions tab is hidden.
- Client profile Overview "Upcoming Session" component is hidden.
- No credit issuance occurs from any package, regardless of payment status.
- No Session Credit notifications (in-app, email, mobile push) are sent.
- Existing scheduled sessions and issued credits are **not deleted** in this release. **Why:** Forced downgrades to Starter due to failed payment may need a grace window; explicit deletion is out of scope for P3.1 and will be designed in a later release.
- If a coach taps a stale Session Credit notification while Booking is off:
  - Web → no navigation occurs.
  - Mobile → still navigates to client Overview tab. (US12 AC2.)
- When Booking is re-enabled, all preserved data re-displays. (US12 AC3.)

---

## 13. Flow 8 — Migration of Existing Packages (US13)

| Scenario | Expected Outcome |
|---|---|
| WS has packages created before P3.1 | Opening the Package Overview / Pricing pop-up shows the new UI with all existing Pricing/Trial data populated. The Session Credits section is empty by default — coach can opt into it by toggling on. (US13 AC1.) |
| WS has existing purchases created before P3.1 | The Purchase Details pop-up renders in the new UI with all existing data mapped to the new statuses. No retroactive Session Credit data appears (purchases made pre-P3.1 have no snapshot). (US13 AC2.) |

**Implication:** Existing Purchases must continue to function with no Package Snapshot. The system must tolerate Purchases with a null/empty snapshot and skip credit issuance for them.

---

## 14. Edge Cases & Concurrency Rules

| Scenario | Expected Outcome |
|---|---|
| Two simultaneous Update Pricing saves on the same package | Last write wins, but both saves must run server-side validation independently — neither save may persist with an invalid session type. |
| Coach archives a session type while it is selected in another tab's Pricing pop-up | On Update Pricing, server rejects with "A session type is no longer available." UI must remove the row and block save. (US1 AC17.) |
| Coach tries to publish a package whose credit rules reference an archived/no-longer-`require_credit` session type | Publish is blocked with toast: "Can't publish. A session credit rule is tied to an inactive session type." (US2 AC6.) |
| Coach edits package credit rules between two clients' purchases | Each Purchase keeps its own snapshot — Client A's purchase issues on rules in effect at A's purchase time; Client B's purchase issues on rules in effect at B's purchase time. |
| Renewal invoice paid + activation happens, but session type in the snapshot was archived between purchase time and now | Issuance continues using the snapshot. The credit's session type info displays via **live lookup** of the current session type (per OQ-3 resolution — fields like color/name/duration reflect the latest, even if the session type was later archived). |
| Late activation when one or more billing cycles have already been paid | Back-issue credits for every paid cycle. Use each cycle's billing-cycle-based expiration anchor. If `expires_at` is already past, issue + immediately expire (same-day in Balance History). (US7 AC5.) |
| Purchase moves from Active → Paused → Resumed during a billing cycle that was already paid+issued | No re-issuance on resume. Future renewals issue normally. |
| Purchase moves to Cancelled mid-cycle while credits already issued for that cycle | Already-issued credits remain in the client's balance. Coach must manually delete if desired (P1.0 path). |
| Client is archived but purchase is still active and paid | **Issuance continues** — credits are issued for every successful paid cycle as normal. Archive state does not block issuance. Already-issued credits follow P1.0 client-archive rules for display/usage. (US7 AC6.) |
| WS downgrade: Booking feature OFF | See §12. Data preserved; issuance and notifications suspended. |
| Failed first payment after trial → recharge later succeeds | Credits are issued for that cycle on recharge success + activation. Purchase status moves Cancelled → Active. (US7 AC2.) |
| Refund of a paid invoice that already triggered issuance | **Already-issued credits are NOT removed.** Issuance and refund are decoupled — credits remain in the client's balance and follow P1.0 rules. The coach may manually delete via the P1.0 flow if desired. (OQ-4 resolution.) |

---

## 15. Activity Log & Notification Rules

### 15.1 Balance History Entry — Package Issuance

| Field | Value |
|---|---|
| Date | Date of issuance (date only — no time, per V1.0.3 convention) |
| Event | "Issued" |
| Type (internal) | `issuance` (existing P1.0 type, with new source = package) |
| Amount | Positive integer, no +/− prefix in display |
| Actor | System (null) — issuance is system-triggered for package issuance |
| Source label | Package name — clickable per §8.6 |

### 15.2 In-App Notifications (US7 AC1)

| Trigger | Message |
|---|---|
| Credits issued from a successful package payment + activation | `$ icon` + "**{Client name}** was issued **{X}** credit{s} from payment of **{package name}** package." |

**Singular/plural:** "1 credit" vs "X credits" as appropriate.

**Deep-link targets:**
- Web → Client's Sessions tab, anchored to the Credits tab.
- Mobile app → Client profile, Overview tab. (Same convention as P1.0.)

**Recipients:** All coaches who manage the client and have permission to view payments. *(Specific recipient set is a BE/Notification-Service decision — confirm with Tech Lead.)*

### 15.3 Updates Feed (Client Profile)

Same content as the in-app notification appears in the client profile Updates section. Same navigation on click.

### 15.4 Notifications That Must NOT Fire

- During trial period (no issuance → no notification). (US7 AC2/AC3.)
- When Booking feature is OFF. (US12 AC1.)
- When Payment & Packages feature is OFF. (US11 AC1.)
- When Purchase is not yet activated. (US7 AC5.)
- For payment failures, late cancels, voids, deletions, expirations — those follow P1.0/P1.1 rules and are not introduced by P3.1.

---

## 16. Open Questions for BE

| # | Question | Resolution / BA Recommendation | Status |
|---|---|---|---|
| OQ-3 | In Balance History and Purchase Details pop-up, should session type fields (color, name, duration, location) be live-looked-up from the current session type, or snapshotted at issuance? | **Resolved.** Session type fields are **live-looked-up** from the current session type — Balance History and Purchase Details pop-up always reflect the latest session type info (color, name, duration, location). | Resolved |
| OQ-4 | Refund of a paid invoice that already triggered issuance — should already-issued credits be auto-removed, or left in place? | **Resolved.** **Do not remove** already-issued credits on refund. Issuance and refund are decoupled — credits remain in the client's balance and follow P1.0 rules (coach can manually delete if desired). | Resolved |
| OQ-8 | Concurrency: two simultaneous Update Pricing saves on the same package — last-write-wins or optimistic-fail? | BA defers to BE. Either works; document choice in BE design. | Pending |
| OQ-9 | Late-activation back-issuance: must this happen synchronously on activation, or can it be queued/async? | BA defers to BE. UX impact: client should see balance updated promptly after activation. | Pending |
| OQ-10 | Spec uses both "Cancelled" and "Canceled" inconsistently (US3 AC3 vs US3 AC8 vs US4 AC0.1). | Standardize on **Cancelled** in code/copy; will sync with Designer. | BA to update spec |
| OQ-11 | If a paid cycle was skipped because the Booking feature was OFF at that moment, and Booking is later turned back ON, should the system back-fill those skipped cycles, or are they permanently lost? | Out of scope for P3.1 — skip is permanent. Document explicitly so we don't silently lose data later. Confirm with Tech Lead and Jon. | Pending |

---

## 17. Out of Scope

| Item | Planned Release |
|---|---|
| Issuing credits during a free trial period | Not planned |
| Session credit rules visible on the public/client-facing package page | Future |
| Bulk credit management across multiple clients | Future |
| Session-pack pricing model (price per session quantity) | Future |
| MP (Mobile Package) UX integration | P3.2 / Future |
| Pause subscription — expiration clock behavior changes | Future |
| Logic to **delete** credits when Booking feature flag is disabled | Future (post-Beta) |
| Coach-level session credit reporting / workspace dashboard | Future |
| Client notification on automated credit issuance | Not planned (coach in-app notification IS in scope per US7 AC1) |

> **Note:** The data model and flows defined here should not block any of these from being added later. In particular, the Package Snapshot, source-linkage metadata on issued credits, and the activation-gated issuance trigger are all forward-compatible with bulk management, deletion logic, reporting, and pack-pricing additions.

---

*End of Backend Logic & Data Flow Reference — Session Credits Package Issuance (P3.1)*
