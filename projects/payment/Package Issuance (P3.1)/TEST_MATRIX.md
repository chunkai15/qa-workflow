# Test Matrix - Package Issuance (P3.1)

> Maps feature acceptance criteria to manual testcase coverage. Automation status remains `not-covered` until BDD/Playwright artifacts are generated and validated.

| Behavior ID | AC/Requirement | Manual TC | BDD Feature | Playwright | Status | Evidence |
|---|---|---|---|---|---|---|
| E1-AC01 | US1 AC1 - No-Stripe entry point | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC02 | US1 AC2 - Country popup | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC03 | US1 AC3 - Create package popup | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC04 | US1 AC4 - Add Pricing button | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC05 | US1 AC5 - Pricing Plan UI rendering | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC06 | US1 AC6 - Pricing model selector | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC07 | US1 AC7 - Price validation | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC08 | US1 AC8 - Recurring billing fields | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC09 | US1 AC9 - Billing cycle validation | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC10 | US1 AC10 - Recurring expiration | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC11 | US1 AC11 - Free Trial config | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC12 | US1 AC12 - Session Credits config | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC13 | US1 AC13 - Selected session type display | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC14 | US1 AC14 - Session Credits row limits | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E1-AC15 | US1 AC15 - Free Trial + Credits message | test-cases/test-cases.md | - | - | tc-written | E1 final RTM |
| E2-AC16 | US1 AC16 - Session Credits validation errors | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-001, TC-US01-FUNC-001 to TC-US01-EDGE-005 |
| E2-AC17 | US1 AC17 - Race condition on save | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-001, TC-US01-EDGE-007 to TC-US01-FUNC-010 |
| E2-AC18 | US1 AC18 - Toggle OFF collapse behavior | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-003, TC-US01-FUNC-038 to TC-US01-EDGE-018 |
| E2-AC19 | US1 AC19 - Loading state on save | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-002, TC-US01-FUNC-011 to TC-US01-EDGE-012 |
| E2-AC20 | US1 AC20 - PRICING PLAN block display | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-002, TC-US01-FUNC-016 to TC-US01-FUNC-024 |
| E2-AC21a | US1 AC21a - SESSION CREDIT block | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-SCEN-002, TC-US01-FUNC-025 to TC-US01-FUNC-034 |
| E2-AC21b | US1 AC21b - Session type details popup | test-cases/test-cases-E2.md | - | - | tc-written | TC-US01-FUNC-036, TC-US01-FUNC-037, TC-US01-EDGE-017 |
| E2-US2-AC1 | US2 AC1 - Pricing model disabled after publish | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-002, TC-US02-FUNC-017 to TC-US02-FUNC-019 |
| E2-US2-AC2 | US2 AC2 - Session credit fields editable after publish | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-002, TC-US02-FUNC-020 to TC-US02-FUNC-024 |
| E2-US2-AC3 | US2 AC3 - Unpublished save no confirmation | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-001, TC-US02-FUNC-001 to TC-US02-FUNC-003 |
| E2-US2-AC4 | US2 AC4 - Published edit confirmation popup | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-001, TC-US02-FUNC-004 to TC-US02-EDGE-001 |
| E2-US2-AC5 | US2 AC5 - Future-only impact | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-001, TC-US02-FUNC-014 to TC-US02-FUNC-016 |
| E2-US2-AC6 | US2 AC6 - Publish block on inactive session type | test-cases/test-cases-E2.md | - | - | tc-written | TC-US02-SCEN-002, TC-US02-FUNC-026 to TC-US02-EDGE-010 |
| E3 | US3 + US4 AC0.1-AC9 | - | - | - | not-covered | Next pipeline scope |
| E4 | US4 AC10-AC25 | - | - | - | not-covered | Pending |
| E5 | US5 + US13 | - | - | - | not-covered | Pending |
| E6 | US6-US12 | - | - | - | not-covered | Pending |

## Status Values

| Status | Meaning |
|---|---|
| not-covered | AC exists but no test case is written yet |
| tc-written | Manual test case written, not yet executed |
| executed-pass | Test case executed manually and passed |
| executed-fail | Test case executed manually and failed |
| automation-ready | BDD feature file exists |
| automated | Playwright spec exists and runs successfully |
| blocked | Testing cannot proceed because Dev/BA input is needed |
