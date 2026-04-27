---
name: qa-auto-test-generator
description: Orchestrate a complete QA automation workflow from a BDD or Gherkin `.feature` file through context capture, planning, Playwright suite generation, and validation. Use when Codex needs one end-to-end workflow that coordinates `playwright-context-builder` and `playwright-test-builder`, adds a reviewable planning gate before generation, and performs explicit validation after generation.
---

# QA Auto Test Generator

Orchestrate the full workflow for generating QA automation from a `.feature` file.

This skill is the top-level workflow. It does not replace Stage 1 or Stage 2 workers. It coordinates them:

- Stage 1 worker: `playwright-context-builder`
- Stage 2 worker: `playwright-test-builder`

Invocation contract:

- Use `playwright-context-builder` only during the context step.
- Use `playwright-test-builder` only after the planning step has approved the Stage 1 bundle.
- Do not skip directly from intake to generation.
- Do not treat worker invocation as optional when their stage is active.

Follow the instructions in `./workflow.md`.
