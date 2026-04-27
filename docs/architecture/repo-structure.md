# Hybrid Repo Structure

This repo uses a hybrid QA workspace model.

## Goals

- Keep feature work discoverable in one place.
- Keep reusable knowledge separate from feature-specific documents.
- Let skills and workflows find the same files predictably.
- Preserve the current automation pipeline while making room for more workflows later.

## Top-Level Layout

```text
src/              pipeline engine and shared code
.agents/skills/   workflow and skill definitions
features/         feature-specific working folders
knowledge/        reusable cross-feature knowledge
templates/        reusable document and workflow templates
intake/           raw imported materials before normalization
docs/             repo-level architecture and usage docs
input/            temporary migration-only feature files
output/           temporary migration-only run artifacts
```

## Working Unit

Each `features/<feature-key>/` folder is the primary working unit.

Every feature should include:

- `README.md` for a human-friendly entrypoint
- `meta/feature.yaml` for structured metadata
- `meta/sources.md` for traceability
- `docs/` for feature-specific product and technical docs
- `qa/` for analysis, test cases, and testing notes
- `automation/` for `.feature` files, plans, fixtures, and run artifacts

## Folder Responsibilities

### `features/`

Use this for anything tied to one feature only.

Recommended structure:

```text
features/<feature-key>/
|-- README.md
|-- meta/
|-- docs/
|-- qa/
|-- automation/
`-- assets/
```

### `knowledge/`

Use this for reusable material that should survive beyond one feature:

- domain concepts
- QA strategies
- automation conventions
- glossary terms
- workflow guidance

### `templates/`

Use this for reusable templates only. Do not store real outputs here.

### `intake/`

Use this for raw imported source material from tools such as Confluence, Jira, Figma, or PDFs. Once a normalized working document exists inside a feature folder, that normalized document should become the preferred reference.

### `docs/`

Use this for repo-level documentation such as architecture notes, setup guides, and operating conventions. Avoid using `docs/` as a catch-all for feature content.

## Migration Note

The existing root `input/` and `output/` folders are migration-only paths and should be phased out. New work should use:

- `features/<feature-key>/automation/input/*.feature`
- `features/<feature-key>/automation/runs/<run-id>/`

Migrate legacy content into feature-local folders, then remove the root legacy folders when nothing depends on them anymore.
