# Test Design Techniques — Artifact-First Protocol

> Load IMMEDIATELY on startup (needed for Module Brief in STEP A).
> Core principle: every technique produces an intermediate artifact BEFORE any TC is written.
> TCs are derived FROM artifact rows — not written alongside them.
> 10 Functional Rules + 15 Edge Case Groups → see refs/test_catalog.md (load when filling Module Brief).

---

## Why Artifact-First Matters

Without an artifact, technique selection becomes a label. You write "BVA" in the Module Brief then write TCs from intuition. Coverage gaps are invisible until too late. The artifact makes every missing case explicit: an uncovered row is a visible gap, not an invisible blind spot.

The process is always: **Scan AC → Identify applicable techniques → Build artifact → Extract TCs from rows.**

---

## Technique 1 — Decision Table

**When to build:** AC has 2+ independent conditions that combine to produce different outcomes.
Look for: `if A and B`, `when X is enabled and Y is true`, `only if role=X and status=Y`.

**Artifact — Combination Matrix (build this first):**

| Condition A | Condition B | Condition C | Expected Outcome |
|---|---|---|---|
| discount applied | MP channel | auth=yes | Fee = 5% × Subtotal |
| no discount | MP channel | auth=yes | Fee = 5% × Package Cost |
| any | Core platform | auth=yes | No fee charged |
| any | any channel | auth=no | Redirect to login |

**Derivation rule:** Each distinct-outcome row → ≥1 TC. Identical-outcome rows may share 1 TC (note merged rows). Excluded combos need a written reason.

**Anti-pattern:** Writing 1 "happy path" TC for a 4-condition module. 4 rows → ≥4 TCs.

---

## Technique 2 — State Transition Testing

**When to build:** AC involves an entity with a defined lifecycle and events that trigger state changes.
Look for: `active / cancelled / pending / waived / enabled / disabled / expired`.

**Artifact — State × Event Table (build this first):**

| From State | Event / Trigger | To State | Valid? | TC needed |
|---|---|---|---|---|
| no_fee | feature launch | fee_enabled | ✓ | TC: purchase after launch → fee shown |
| fee_enabled | purchase completed | fee_enabled | ✓ | TC: fee persists in modal |
| fee_enabled | pre-launch record loaded | fee_waived | ✓ | TC: pre-launch → waived state |
| fee_waived | new purchase | fee_enabled | ✓ | TC: new purchase overrides waived |
| fee_waived | edit existing | fee_waived | ✓ | TC: edit doesn't change waived |

**Derivation rule:** Valid transition → ≥1 positive TC. Invalid transition → ≥1 negative TC. Every row = ≥1 TC or explicit "No TC — [reason]".

**Anti-pattern:** 4 entity states but only testing active→completed.

---

## Technique 3 — Boundary Value Analysis (BVA)

**When to build:** AC involves a numeric, currency, percentage, string-length, or date field with limits.
Look for: specific numbers, `%`, `$`, `decimal places`, `rounding`, `min`, `max`.

**Artifact — Boundary List (build this first):**

| Field | Min | Min-1 | Max | Max+1 | Exact limit | Notes |
|---|---|---|---|---|---|---|
| Service Fee % | 0% | N/A | 100% | N/A | 5% fixed | Fixed rate |
| Package price | $0.01 | $0.00 | No max | — | — | Zero = no-fee edge |
| Decimal places | 2dp | 3dp raw | 2dp | 3dp raw | tie at .5 | 3rd dp drives rounding |

**Derivation rule:** Each boundary point → ≥1 TC. Ground-truth data tables → each row = 1 TC.

**Anti-pattern:** Writing 1 TC "Verify fee is correct" when spec has 18 rounding boundary cases.

---

## Technique 4 — Equivalence Partitioning (EP)

**When to build:** AC has multiple user roles, input classes, or states with identical behavior within class but different between classes.
Look for: role names, channel types, status conditions, "valid/invalid" categories.

**Artifact — Partition List (build this first):**

| Partition class | Representative value | Expected behavior | Valid? |
|---|---|---|---|
| Marketplace channels | MP Homepage / Direct Link / Trainer Match | Fee = 5% | ✓ |
| Core Platform channel | Core Platform Direct Link | No fee | ✓ |
| Client role | authenticated client | Sees fee on checkout | ✓ |
| Coach role | authenticated coach | Never sees fee | ✓ |
| Unauthenticated | no session | Redirect to login | ✗ invalid |

**Derivation rule:** 1 representative TC per class. Identical-behavior values within same class → 1 TC + note equivalence.

**Anti-pattern:** 3 Marketplace channel TCs with identical steps. Merge to 1 + note equivalence.

---

## Technique 5 — Scenario Testing (End-to-End)

**When to build:** Module Risk ≥ MEDIUM, or AC crosses ≥2 surfaces.

**No separate artifact.** Write flow description inline before the SCEN TC:

```
Flow: Client purchases via Marketplace with discount → verifies amounts in Purchase Details Modal
Surfaces: Checkout Step 1 → Step 2 → Payment Success → Manage Package Modal
Key assertion: Modal shows Package Cost (original) + Service Fee (actual charged)
```

**Derivation rule:** 1 SCEN TC per business flow per module. Write SCEN TC FIRST in each module.

---

## Technique 6 — Error Guessing (5 Heuristics)

**When to build:** Always for HIGH/Tier-3 modules. Optional for MEDIUM.

**Artifact — H1–H5 Verdict List (build this first):**

```
H1 — API integration (timeout, duplicate, malformed response):
  → Applicable: Stripe charge — double-submit idempotency → TC-EDGE-010
H2 — Async / eventual consistency (success reported, side-effect not propagated):
  → Applicable: Payment success shown but webhook hasn't updated DB → TC-EDGE-009
H3 — Permission at record level (correct role, wrong record):
  → Applicable: Coach calling credit API for another coach's client → TC-SEC-001
H4 — Concurrent modification (two users, same entity):
  → Not applicable: Service Fee is read-only calculated field
H5 — Stateful flow rollback (step N fails, steps 1..N-1 left partial):
  → Applicable: Checkout step 2 fails — is promo + fee rolled back? → TC-EDGE-006
```

**Rule:** Each applicable heuristic → ≥1 TC (include TC ID). Each not-applicable → explicit reason. "H4: N/A" alone rejected.

---

## Technique Selection Guide

| Signal in AC/spec | Primary technique | Artifact required? |
|---|---|---|
| ≥2 independent conditions → different outcomes | Decision Table | Yes — combination matrix |
| Entity has named lifecycle states | State Transition | Yes — state × event table |
| Numeric / currency / percentage with limits | BVA | Yes — boundary list |
| Multiple roles / channels / input classes | EP | Yes — partition list |
| Multi-surface flow, Risk ≥ MEDIUM | Scenario Testing | Inline flow description |
| HIGH-risk module | Error Guessing | Yes — H1–H5 verdict list |
| Module Risk = LOW | Scenario (happy path) only | No artifact needed |

---

## Risk-Based Coverage Depth

| Module Risk | Required techniques | Artifact rule |
|---|---|---|
| **HIGH** | Scenario + EP + BVA + Decision Table + State Transition + Error Guessing H1–H5 | All applicable artifacts MUST be built before first TC |
| **MEDIUM** | Scenario + EP (main classes) + BVA (critical boundaries) + Decision Table (primary combos) | DT + ST artifacts required; EP/BVA inline if simple |
| **LOW** | Scenario (happy path) + 1 critical negative | No formal artifacts needed |
