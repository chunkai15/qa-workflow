# Sources

## Source Model
This feature uses a hybrid source model.

## Canonical External Sources
- Confluence:
  - {{confluence_link}}
- Jira:
  - {{jira_link}}
- Figma:
  - {{figma_link}}
- Other:
  - {{other_source}}

## In-Repo Working Documents
- PRD working copy: `docs/01-prd/{{prd_file}}`
- Functional spec working copy: `docs/02-spec/{{spec_file}}`
- Technical solution working copy: `docs/04-technical-solution/{{technical_file}}`
- QA analysis: `qa/01-analysis/{{qa_analysis_file}}`
- Test cases: `qa/02-test-cases/{{testcase_file}}`

## Raw Imported Materials
- `intake/confluence/`
- `intake/jira/`
- `intake/figma/`
- `intake/pdf/`

## Source Handling Rules
- Prefer canonical external links when validating the latest business intent.
- Prefer in-repo working documents when writing QA analysis, test cases, and automation artifacts.
- Do not use raw intake files as the final reference if a normalized document already exists in this feature folder.
- Record major source conflicts in `docs/08-decisions/` or `qa/05-notes/`.

## Known Source Gaps
- {{source_gap_1}}
- {{source_gap_2}}

## Last Reviewed
- Date: {{review_date}}
- Reviewed by: {{reviewer}}
