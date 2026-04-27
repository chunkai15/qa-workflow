# Phase 0 — Visual Asset Inventory

> Load this file when: any image is uploaded OR any Figma URL / diagram reference exists in the spec.
> Purpose: ensure coverage is grounded in design artifacts, not just spec text.
> One unread design image can mean 10–20 missed cases.

---

## Steps

**0A. Produce a Visual Asset Inventory:**

Scan the entire spec and list:
- Every uploaded image file → note which AC it illustrates
- Every Figma URL → note which AC it belongs to
- Every diagram, flowchart, or sequence diagram referenced
- Every AC with flag: `Need design` / `Need design approval` / `Waiting for design approval`
- Every BE/technical doc with sequence diagrams or data flow charts

**0B. Read every uploaded image and accessible diagram immediately:**

For each, extract every UI state, combination case, field, hover state, empty state, or loading state visible in the design that is **not fully described in the spec text**. Document in a `Design Supplement` block:

```
## Design Supplement — [AC identifier]
Source: [filename / Figma URL]
Items in design NOT fully described in spec text:
  - [item: description]        ← tag: "source = design"
Conflicts with spec text:
  - [any design element that contradicts spec]
```

These items feed into Q0a structural item count and Q12 Source A of Deep Reading.

**0C. For inaccessible Figma URLs:**
- Add to `Missing Information`: "Figma for [AC] not reviewed — visual combinations may be under-covered"
- Tag all cases for that AC: `Draft - Figma not reviewed`

**0D. For every `Need design` AC:**
- Write functional cases based on spec text (no draft tag needed for functional behavior)
- Tag visual/layout-only assertions: `Draft - design pending`
- Add to `Not-Testable-Yet Items`: which exact visual states are blocked

---

## Gate 0 — Visual Asset Completeness

Pass criteria before proceeding to Phase 1:

| Check | Pass condition |
|---|---|
| Image inventory | Every uploaded image identified and mapped to its AC |
| Images read | Every uploaded image read; Design Supplement block produced |
| Figma inventory | Every Figma URL identified and mapped to its AC |
| Figma attempted | Every Figma URL attempted; inaccessible ones noted in Missing Information |
| "Need design" flagged | Every AC with `Need design` flag logged and tagged |
| BE diagrams reviewed | Every BE/technical doc with diagrams reviewed |
| Design vs spec compared | For every read artifact: design-only items extracted and listed |

**Do not proceed if any uploaded image is unread.** Read it now.

---

## Status Flag Handling

| Flag | Meaning | Action |
|---|---|---|
| `NEED DESIGN APPROVAL` | UI/layout not finalized | Write full functional cases. If image uploaded: read it, produce Design Supplement, write full coverage. Tag visual/layout assertions only: `Draft - design pending`. |
| `WAITING FOR DESIGN APPROVAL` | Same | Same as above. |
| `NEED TO DISCUSS WITH DEV` | Implementation unresolved | Write case for intended spec behavior. Tag: `Draft - dev approach TBD`. Add to Clarification Questions. |
| `OUT OF SCOPE` / `P1.1+` | Explicitly deferred | Do not write a case. Add to `Not-Testable-Yet Items` with phase label. |

**Key:** "Need design" does NOT mean skip the AC. Functional behavior in spec text → write full cases. Visual-only gaps → draft tag or Not-Testable-Yet.
