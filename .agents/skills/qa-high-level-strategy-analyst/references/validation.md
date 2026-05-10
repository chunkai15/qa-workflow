# Validation

Run these checks before saying the skill output is ready.

## Artifact Checks

### Markdown

Confirm `high-level-strategy-analysis.md` contains all required headings from
`analysis-output-contract.md`.

Also confirm:

- `Source Map` exists and lists only used sources.
- `Canonical Business Rules` exists and uses confidence labels.
- every gap is categorized
- every conflict names the conflicting sources
- every ambiguity names a likely owner
- every high-level scenario row includes `US / Area`, `Expectation`, and `Priority`
- every edge/race row includes `US / Area`, `Expectation`, and `Priority`
- Mermaid is included only when the feature complexity warrants it

### XMind Tree Payload

Confirm the JSON payload contains the required top-level branch titles from
`xmind-output-contract.md` in the exact required order.

### XMind File

Run the generator script and confirm:

- process exits successfully
- output `.xmind` file exists
- file contains `content.json`

## Skill Checks

Run:

```bash
python3 /Users/everfit/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  /Users/everfit/gitRepo/qa-workflow/.agents/skills/qa-high-level-strategy-analyst
```

## Smoke Test

Run the generator on a small payload and verify the output path is created.

Example:

```bash
python3 .agents/skills/qa-high-level-strategy-analyst/scripts/build_xmind.py \
  --payload /tmp/strategy-tree.json \
  --output /tmp/strategy-test.xmind
```

Do not claim success based only on file creation. The command must also validate the branch contract.

## Review Quality Check

Before closing the task, ask:

1. Can a reviewer identify the canonical reading in under 30 seconds?
2. Are the top blocking clarifications obvious?
3. Did the output separate confirmed vs conflicted vs open information?
4. Did the markdown avoid repeating the same rule across too many sections?
