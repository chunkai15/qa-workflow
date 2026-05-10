# Legacy Workflow Mapping

## Purpose
This note maps the existing legacy automation assets into the new feature-centric hybrid structure without rewriting the underlying workflow engine.

## Legacy Inputs
- Feature file: `input/marketplace-test.feature`
- Historical run root before migration: `output/marketplace-test/`

## Feature-Local Replacements
- Normalized feature input: `automation/input/marketplace-test.feature`
- Migrated historical run: `automation/runs/2026-04-12_legacy-001/`
- Future run root target: `automation/runs/<run-id>/`

## Current State
- Stage 1 context bundle exists in the migrated feature-local run root.
- Stage 3 planning was approved according to the migrated run manifest.
- Stage 5 validation reports the suite as `USABLE_WITH_CAVEATS`.

## Migration Guidance
- Use the migrated feature-local run as the historical evidence root.
- Write future feature notes, QA analysis, and test cases inside this feature folder.
- When the pipeline source is updated to support feature-local automation roots, direct new runs into `automation/runs/`.
- Do not duplicate generated code into the feature folder until the workflow itself writes there.

## Caveats
- The legacy feature file includes runtime secrets and a local upload path, so it is not a safe long-term source file.
- The validation report still calls out upload-capture limitations and a low-confidence image edit selector.
