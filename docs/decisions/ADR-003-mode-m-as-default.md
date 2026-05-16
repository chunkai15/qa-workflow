# ADR-003: MODE M as Default Session Mode
- **Date:** 2026-05-14
- **Status:** accepted
- **Context:** The `qa-master-workflow` supports S, M, L, XL session modes. Choosing the wrong mode causes context overflow and degraded agent performance.
- **Decision:** MODE M (Multi-Session) is the default mode for any feature with HIGH-risk modules or ≥6 ACs.
- **Consequences:** Agents should split the QA pipeline into 3-4 sessions for standard features, applying the Context Pruning Rule at each layer boundary to stay within the 12,000 token budget per session.
