# AGENTS.md

## Auto-Loaded Every Session

- This repo is a hybrid QA workspace built around a BDD-to-Playwright automation pipeline in TypeScript.
- Treat each `features/<feature-key>/` folder as the primary working unit for docs, QA artifacts, and automation assets.
- Treat `features/<feature-key>/automation/input/*.feature` as the preferred source of truth for automation intent.
- Treat legacy `input/*.feature` and `output/*` layouts as temporary migration-only paths scheduled for removal.
- Prefer updating pipeline logic in `src/` or skill docs in `.agents/skills/` instead of patching generated artifacts.
- Keep this file concise in spirit during future edits. Target under 200 lines.
- Be explicit about confidence, blockers, and missing runtime inputs. Do not guess silently.
- Do not persist raw credentials, tokens, or other secrets into generated code, bundle files, reports, or docs.

## Project Structure

```text
.
|-- AGENTS.md
|-- package.json
|-- tsconfig.json
|-- tsconfig.generated.json
|-- vitest.config.ts
|-- run-pipeline.ts
|-- src/
|   `-- pipeline/
|-- features/
|   `-- <feature-key>/
|       |-- README.md
|       |-- meta/
|       |   |-- feature.yaml
|       |   `-- sources.md
|       |-- docs/
|       |-- qa/
|       |-- automation/
|       |   |-- input/
|       |   `-- runs/
|       `-- assets/
|-- knowledge/
|-- templates/
|-- intake/
|-- docs/
`-- .agents/
    `-- skills/
        |-- qa-auto-test-generator/
        |-- playwright-context-builder/
        |-- playwright-test-builder/
        `-- playwright-best-practices/
```

## Project Rules & Conventions

- Primary workflow: `qa-auto-test-generator`.
- Stage order is mandatory: intake -> context -> plan -> generate -> validate.
- Never generate tests before Stage 1 artifacts exist and Stage 3 planning has reviewed them.
- Never report success before validation has run.
- Keep stage outputs traceable and aligned with the artifact contract already used in run folders.
- Generated files should remain reviewable artifacts, not hidden side effects.
- If a task changes generation behavior, update the generator source or workflow, then regenerate when needed.
- If a task is only about inspecting a prior run, read from `features/<feature-key>/automation/runs/<run-id>/`.
- Preserve low-confidence selectors, coverage gaps, and human checkpoints in reports or generated output when unresolved.
- Prefer honest blocked states over fabricated completion.
- Use runtime-only credentials when the user has provided them or the workflow explicitly allows them.
- Mask or placeholder any secret-like value that could end up in persistent artifacts.
- Keep feature-specific docs inside the owning `features/<feature-key>/` folder rather than scattering them across repo-level docs.
- Keep reusable guidance in `knowledge/` and reusable document skeletons in `templates/`.

## Code Conventions

- Language: TypeScript.
- Module system: CommonJS.
- Compiler posture: strict mode is enabled; keep changes type-safe.
- Prefer small, focused types and functions over broad utility abstractions.
- Follow the existing naming style in `src/pipeline/`: descriptive types, explicit field names, plain data structures.
- Keep JSON artifact schemas stable unless the task explicitly requires schema evolution.
- When schema changes are necessary, update both producing code and any downstream consumers.
- Avoid adding dependencies unless they clearly reduce workflow complexity or maintenance cost.
- Use ASCII by default unless the target file already relies on Unicode.

## Workflow Expectations

- Feature-first: the feature folder defines working context, and the `.feature` file defines automation intent within that context.
- Context capture must produce both `context-bundle.json` and `context-bundle.md`.
- Planning must review coverage, gaps, risk, and validation scope before generation.
- Generation should create pages, fixtures, support code, specs, and a validation report in the agreed run root.
- Validation should distinguish static-analysis failures from selector issues and semantic coverage gaps.
- Keep `run-manifest.json` accurate enough to explain current status, artifact paths, auth mode, and next step.
- Every feature should have a `README.md`, `meta/feature.yaml`, and `meta/sources.md` before deep QA or automation work begins.
- Prefer normalized working docs in the feature folder over raw files in `intake/`.

## Editing Guidance

- Safe to edit: `src/**`, root configs, workflow docs under `.agents/skills/**`, repo docs, templates, knowledge files, and feature folders.
- Edit generated output only when the task is specifically about debugging or reviewing a concrete run artifact.
- If both source and generated output need updates, prefer changing source first and regenerate or document the delta.
- Do not remove useful caveats from reports unless the underlying issue was actually resolved.
- Keep instructional docs practical and lightweight; this repo favors operational clarity over long prose.

## Execution & Verification

- Install deps: `npm install`
- Run unit tests: `npm run test`
- Run pipeline: `npm run pipeline`
- Verify generated TypeScript: `npm run verify:generated`
- Build source: `npm run build`

- Before claiming completion on code changes, run the most relevant verification available.
- For source changes, prefer at least `npm run test` and `npm run build` when affected.
- For generated-suite or output-shape changes, prefer `npm run verify:generated`.
- If validation could not be run, say exactly what was not verified and why.

## Decision Defaults For Codex

- When asked to improve the workflow, inspect `.agents/skills/qa-auto-test-generator/` first.
- When asked to improve Stage 1 behavior, inspect `.agents/skills/playwright-context-builder/` first.
- When asked to improve Stage 2 behavior, inspect `.agents/skills/playwright-test-builder/` first.
- When asked to debug selector quality or Playwright structure, also consult `.agents/skills/playwright-best-practices/`.
- When uncertain whether a document belongs in a feature folder or `knowledge/`, choose the feature folder unless the content is clearly reusable across multiple features.
- When uncertain whether a change belongs in source or generated output, choose source unless the user explicitly asks for a one-off artifact fix.
