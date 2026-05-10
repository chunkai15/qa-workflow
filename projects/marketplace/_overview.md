---
squad: "marketplace"
updated: "2026-05-05"
---

# Squad: Marketplace

## Scope

Features related to the Everfit Marketplace client experience — search, discovery, onboarding surveys, profile setup, and marketplace-facing flows.

## Active Projects

| Project | Phase | Notes |
|---|---|---|
| `explore-search` | testcase-ready | Has spec + test cases xlsx, needs analysis |
| `shorten-survey` | spec-ready | Shorten onboarding from 11 to fewer questions. Has multiple specs + PDFs. |
| `change-birthdate` | draft | Change birthdate question format. May merge into shorten-survey (same epic). |

## Domain Context

Key entities in this squad: user profiles, onboarding surveys, match surveys, marketplace search, explore feed, client experience flows.

For detailed domain knowledge see `shared/marketplace/domain.md`.

## Conventions

- Feature keys: lowercase-kebab (e.g., `explore-search`, `shorten-survey`)
- Specs often come from Figma exports (PDFs) — store originals in project folder
- Onboarding features may affect multiple platforms (web + mobile)
