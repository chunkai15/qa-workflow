# ADR-002: WF-0 Artifacts Do Not Replace WF-1 Analysis
- **Date:** 2026-05-14
- **Status:** accepted
- **Context:** WF-0 (High-Level Strategy Analysis) produces strategic documents like `high-level-strategy-analysis.md` and `.xmind`. WF-1 produces `analysis.md` (Context + Strategy + Deep Analysis). We needed to clarify the relationship between them.
- **Decision:** WF-0 artifacts are considered upstream inputs. They do NOT replace the mandatory outputs of WF-1.
- **Consequences:** Even if WF-0 has been run, agents must still run WF-1 (qa-master-workflow) to generate the rigorous 3-layer `analysis.md` before generating test cases. WF-0 artifacts should be fed into WF-1 as inputs.
