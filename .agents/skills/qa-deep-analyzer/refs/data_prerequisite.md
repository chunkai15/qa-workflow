# Data Prerequisite — Module Card Template & DataID Registry

> NEW ref file — load when qa_deep_analyzer completes DR blocks for a module.
> Contains: Data Prerequisite Card format + DataID registry + conflict mapping rules.

---

## When to Build

Build ONE Data Prerequisite Card per Module, AFTER completing all DR blocks for that module, BEFORE building the Dependency Map.

**Trigger:** Any AC in the module has Q-DATA with SHARED or DESTRUCTIVE tags → card required.
**Minimum:** Even if all data is SIMPLE, build a card with the shared WS state.

---

## Data Prerequisite Card Format

```
[DATA PREREQUISITE CARD — MOD_ID: Module Name]
─────────────────────────────────────────────────────
WS STATE:    Booking=[ON/OFF], P&P=[ON/OFF], Stripe=[connected/not]
PACKAGE:     type=[PT_Session/Class/etc], credit_rule=[1_per_session/etc], status=[active/archived]
PURCHASE:    status=[confirmed/pending/cancelled], activated=[true/false], invoices=[paid/unpaid]
CLIENT:      connected=[true/false], balance=[X credits], history_entries=[Issued×N, Used×N, Voided×N]
CREDIT DATA: [X] available, [Y] used, [Z] expired

DataID Registry:
  TD-001: [plain description] | SHARED | setup_order=1 | Used by: [AC list]
  TD-002: [plain description] | DESTRUCTIVE | setup_order=2 | Used by: [AC list]
  TD-003: [plain description] | BOUNDARY (balance=0) | setup_order=1 | Used by: [AC list]

State Conflicts Between ACs:
  AC3 needs Client.balance=0 (TD-003) ← conflicts with AC1 needs Client.balance=5 (TD-001)
  → Separate fixtures required. Must NOT share.
  AC7 needs Purchase.status=cancelled ← conflicts with AC2 needs Purchase.status=confirmed
  → Separate fixtures. TD-004=[cancelled purchase] created for AC7 only.
─────────────────────────────────────────────────────
→ L5 imports DataIDs from this card. Does NOT create new ones. Does NOT infer values.
```

---

## DataID Format & Rules

**Format:** `TD-[NNN]` — zero-padded sequential, per module (reset per module).

```
TD-001: [one-line description] | [Category] | setup_order=[integer] | Used by: [AC-X, AC-Y]
```

**Categories:**
| Category | When to use |
|---|---|
| `SHARED` | Same fixture used by ≥3 TCs OR shared across ≥2 ACs |
| `DESTRUCTIVE` | TC consumes or irreversibly changes this data state |
| `BOUNDARY` | Fixture at exact min/max/zero value for BVA |
| `PER-ROLE` | One fixture per actor role required (Coach/Admin/Client) |
| `STATEFUL` | Fixture requires specific lifecycle state before testing |

**Setup order:**
- Integer: lower = must create first
- Same integer = can create in parallel
- `DESTRUCTIVE` items always last in setup order

---

## Conflict Detection Rules

Scan all Q-DATA entries across module ACs. Flag conflict when:

1. **Balance conflict:** AC-A needs Client.balance=X, AC-B needs Client.balance=Y (X≠Y)
   → Create separate TD-xxx per balance state

2. **Status conflict:** AC-A needs Purchase.status=confirmed, AC-B needs Purchase.status=cancelled
   → Create separate TD-xxx per status

3. **Feature toggle conflict:** AC-A needs P&P=ON, AC-B needs P&P=OFF
   → Create separate TD-xxx per WS config state. Flag explicitly: "WS state must be reset between these AC groups."

4. **Destructive chain:** AC-A creates data that AC-B destroys → AC-C needs AC-A's data again
   → Create TWO TD-xxx for AC-A's data: one for AC-B (DESTRUCTIVE), one for AC-C (fresh copy)

---

## Example — Complete Card

```
[DATA PREREQUISITE CARD — MOD_01: Session Credit Issuance]
─────────────────────────────────────────────────────
WS STATE:    Booking=ON, P&P=ON, Stripe=connected
PACKAGE:     type=PT_Session_Credit, credit_rule=1_credit_per_session, status=active
PURCHASE:    status=completed, activated=true, invoices=[paid]
CLIENT:      connected=true, balance=3, history=[Issued×2, Used×1]
CREDIT DATA: 3 available, 1 used, 0 expired

DataID Registry:
  TD-001: Baseline — Package active + Client balance=3 + WS Booking=ON | SHARED | order=1 | Used by: AC1,AC2,AC4
  TD-002: WS state — P&P=OFF config for fee-disabled flow | SHARED | order=1 | Used by: AC3
  TD-003: Edge — Client balance=0 (no credits) | BOUNDARY | order=1 | Used by: AC5,AC8
  TD-004: Destructive — Package in ARCHIVED state for block testing | DESTRUCTIVE | order=2 | Used by: AC6
  TD-005: Per-role — Studio Admin user fixture | PER-ROLE | order=1 | Used by: AC7

State Conflicts:
  AC5/AC8 need Client.balance=0 (TD-003) ← conflicts with AC1/AC2/AC4 needing Client.balance=3 (TD-001)
  → Separate fixtures. Do NOT reuse TD-001 for AC5/AC8.
  AC6 needs Package.status=archived (TD-004) ← conflicts with all other ACs needing status=active (TD-001)
  → TD-004 is DESTRUCTIVE. Setup only for AC6 TCs. Must restore for subsequent test runs.
─────────────────────────────────────────────────────
→ L5 imports TD-001 through TD-005. Does NOT create TD-006+. Does NOT assume values.
```
