# ADR-001: Session Credit Versioning (P1.0 vs P1.1)
- **Date:** 2026-05-14
- **Status:** accepted
- **Context:** Session credit features have iterations like Base Session Credits and Iteration 1.1. We needed a convention on whether to keep them in the same project folder or split them.
- **Decision:** Features are versioned (p1.0, p1.1) as separate projects within the squad folder, but they share the same domain concepts. p1.0 is the base, p1.1 is the iteration.
- **Consequences:** Agents must always check the latest version first. They share the same `shared/payment/domain.md` but maintain their own independent `TEST_MATRIX.md` and `HANDOFF.md`.
