---
squad: "payment"
updated: "2026-05-05"
---

# Squad: Payment

## Scope

Features related to Everfit's payment, billing, and session credit systems — session credits, subscription management, marketplace login/authentication, and package publishing.

## Active Projects

| Project | Phase | Notes |
|---|---|---|
| `marketplace-login` | analyzing | Marketplace login & package publish. Pilot feature, most complete structure. |
| `session-credit-p1.0` | spec-ready | Base session credits. Has spec (67KB) + data flow + checklist xlsx. |
| `session-credit-p1.1` | analysis-done | Credits iteration. Strong analysis (263 lines), needs test case generation. |

## Domain Context

Key entities in this squad: session credits, credit allocation, credit consumption, subscription tiers, billing cycles, session types, trainer-client relationships, payment workflows.

For detailed domain knowledge see `shared/payment/domain.md`.

## Conventions

- Session credit features are versioned (p1.0, p1.1) — always check the latest version first
- p1.0 is the base, p1.1 is the iteration — they share domain concepts
- marketplace-login has a legacy automation run that can be used as reference
