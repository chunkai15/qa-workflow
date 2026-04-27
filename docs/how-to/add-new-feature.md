# Add A New Feature

## Quick Start

1. Create a new folder at `features/<feature-key>/`.
2. Copy the files from `templates/feature/`.
3. Fill in `README.md`, `meta/feature.yaml`, and `meta/sources.md`.
4. Add the feature to `features/_index/feature-catalog.md`.
5. Place normalized source docs in `docs/`.
6. Place QA outputs in `qa/`.
7. Place automation inputs in `automation/input/`.

## Recommended Initial Layout

```text
features/<feature-key>/
|-- README.md
|-- meta/
|   |-- feature.yaml
|   `-- sources.md
|-- docs/
|-- qa/
|-- automation/
`-- assets/
```

## Notes

- If the source material lives outside the repo, record those links in `meta/sources.md`.
- If you import raw files first, keep them under `intake/` until you create a normalized working version.
- If the feature already has legacy automation assets in root `input/` or `output/`, document the mapping in the feature README instead of moving files blindly.
