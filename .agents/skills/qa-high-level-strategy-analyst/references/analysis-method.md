# Analysis Method

Use this method to produce evidence-based output without wasting tokens.

## 1. Source Inventory

List only the sources actually used.

Use a compact table:

| Source | Type | Priority | Used For | Confidence Notes |
|---|---|---|---|---|

Recommended short labels:

- `Spec`
- `BE Flow`
- `State Diagram`
- `Sequence Diagram`
- `Design Note`
- `Existing Analysis`

Do not paste long source names into every section.

## 2. Canonical Flow Extraction

Extract 3-7 distinct business flows.

A flow is distinct only if it changes one of:

- actor
- trigger
- gate or decision path
- primary outcome
- failure consequence

Prefer this compact structure:

| Flow | Trigger | Gate(s) | Outcome | Failure Impact |
|---|---|---|---|---|

Do not expand into step-level TC prose.

## 3. Canonical Rule Extraction

Extract only the rules that govern behavior across multiple paths.

Use:

| Rule ID | Canonical Rule | Primary Source | Confidence | Why It Matters |
|---|---|---|---|---|

Confidence values:

- `Confirmed`
- `Inferred`
- `Conflicted`
- `Open`

Examples of rules worth keeping:

- issuance gates
- snapshot immutability
- expiration anchor
- permission boundary
- feature-flag suppression
- recovery rule after failure

Do not list UI copy tweaks as canonical rules unless they change logic.

## 4. Gap Taxonomy

Every gap must fit one of these:

- `Business Rule`
- `State / Lifecycle`
- `Permission / Role`
- `Integration / Event`
- `Failure / Recovery`
- `Observability / Audit`
- `Migration / Compatibility`

Use:

| Gap Type | Missing Logic | Impact | Follow-up |
|---|---|---|---|

Do not call something a gap if the rule exists in another source and is only hard to find.

## 5. Conflict Taxonomy

Use `Conflict` only when two or more sources actively disagree.

Types:

- `Source Conflict`
- `Terminology Conflict`
- `Lifecycle Conflict`
- `Calculation / Date Anchor Conflict`
- `Scope Conflict`

Use:

| Conflict Type | Sources | Conflict | Why It Matters | Provisional Reading |
|---|---|---|---|---|

Always propose a provisional reading unless the user explicitly wants raw conflict listing only.

## 6. Ambiguity Taxonomy

Use `Ambiguity` when the source does not disagree but still allows multiple valid readings.

Types:

- `Product Ambiguity`
- `UX Ambiguity`
- `Backend Behavior Ambiguity`
- `Timing / Async Ambiguity`
- `Data Ownership Ambiguity`

Use:

| Ambiguity Type | Area | What Is Unclear | Why It Matters | Suggested Owner |
|---|---|---|---|---|

## 7. Review Snapshot

Start the markdown with a short review snapshot:

- `Current Understanding`
- `Primary Risk`
- `Blocking Clarifications`
- `Recommended Canonical Reading`

This section should be scannable in under 30 seconds.

## 8. Diagram Decision

Add Mermaid only when it compresses complexity better than text.

Use it when:

- the feature has a multi-stage flow
- states and transitions are central
- async or retry logic matters
- conflicts are easier to compare visually

Skip it for simple single-path features.

## 9. Token Discipline

- Keep tables narrow and decision-oriented.
- Avoid repeating the same rule in flow, conflict, and risk sections unless needed.
- Prefer 1 strong table over 3 weak lists.
- Prefer 1 Mermaid diagram over a long narrative when the flow is complex.
- Keep examples minimal.
