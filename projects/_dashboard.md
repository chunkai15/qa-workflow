---
last_updated: "2026-05-16 (E2 complete)"
updated_by: "claude"
---

# Project Dashboard

> Agent: read this file after CLAUDE.md to know what's active across all squads.

## Squads

| Squad | Active Projects | Focus |
|---|---|---|
| **marketplace** | 3 | Search, onboarding survey, birthdate |
| **payment** | 5 | Marketplace login, session credits, billing A/B test, package issuance |

## All Projects — Status

| Squad | Project | Phase | Priority | Completeness | Next Action |
|---|---|---|---|---|---|
| marketplace | `explore-search` | testcase-ready | medium | 25% | Create analysis.md from spec |
| marketplace | `shorten-survey` | spec-ready | medium | 45% | Consolidate specs, run QA analysis |
| marketplace | `change-birthdate` | draft | medium | 15% | May merge into shorten-survey |
| payment | `marketplace-login` | analyzing | high | 70% | Expand test cases |
| payment | `session-credit-p1.0` | spec-ready | high | 30% | Create analysis.md, QA structure |
| payment | `session-credit-p1.1` | analysis-done | high | 60% | Generate test cases from analysis |
| payment | `Package Issuance (P3.1)` | analyzing | high | 52% | Run E3 QA pipeline (US3 + US4 AC0.1–AC9 — Mode L) |
| payment | `billing-ab-test` | testcase-ready | high | 90% | Execute Tier 0 on first build; resolve 3 open Dev clarifications |

## Currently In Progress

<!-- Update when starting/finishing work on a project -->

| Project | Current Task | Last Agent | Last Updated |
|---|---|---|---|
| `payment/Package Issuance (P3.1)` | E1+E2 complete (260 TCs total). E3 next: US3 + US4 AC0.1–AC9 (Mode L, 20 ACs) | claude | 2026-05-16 |
| `payment/session-credit-p1.1` | Needs test case generation | claude | 2026-05-05 |
| `payment/marketplace-login` | Test cases minimal, needs expansion | claude | 2026-05-05 |
| `payment/billing-ab-test` | Full pipeline done — ready for test execution | claude | 2026-05-06 |

## Blocked

_None currently._

## Lifecycle

```
draft → spec-ready → analyzing → analysis-done → testcase-ready → automation-ready → complete
```

## Priority Order

When starting without specific instructions, work in this order:

1. Any project in "Currently In Progress"
2. High priority projects needing next phase
3. Medium priority projects
4. Structural improvements
