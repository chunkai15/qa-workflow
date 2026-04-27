# {{feature_title}}

## Summary
{{short_summary}}

## Status
- Feature status: {{feature_status}}
- QA status: {{qa_status}}
- Automation status: {{automation_status}}
- Priority: {{priority}}

## Owners
- QA: {{qa_owner}}
- Automation: {{automation_owner}}
- BA/PO: {{ba_owner}}

## Quick Links
- Metadata: `meta/feature.yaml`
- Sources: `meta/sources.md`
- PRD: `docs/01-prd/{{prd_file}}`
- Functional spec: `docs/02-spec/{{spec_file}}`
- Technical solution: `docs/04-technical-solution/{{technical_file}}`
- QA analysis: `qa/01-analysis/{{qa_analysis_file}}`
- Test cases: `qa/02-test-cases/{{testcase_file}}`
- Feature file: `automation/input/{{feature_slug}}.feature`
- Latest run: `automation/runs/{{latest_run_id}}/`

## Scope
### In scope
- {{in_scope_1}}
- {{in_scope_2}}
- {{in_scope_3}}

### Out of scope
- {{out_scope_1}}
- {{out_scope_2}}

## Current Understanding
{{current_understanding}}

## Risks And Gaps
- {{risk_1}}
- {{risk_2}}
- {{risk_3}}

## Recommended Reading Order
1. `docs/01-prd/{{prd_file}}`
2. `docs/02-spec/{{spec_file}}`
3. `docs/04-technical-solution/{{technical_file}}`
4. `qa/01-analysis/{{qa_analysis_file}}`
5. `automation/input/{{feature_slug}}.feature`

## Workflow Notes
- Use this feature folder as the working root for testcase writing and automation generation.
- Prefer normalized docs inside this feature folder over raw imported files.
- Persist automation outputs under `automation/runs/`.

## Latest Decisions
- {{decision_1}}
- {{decision_2}}
