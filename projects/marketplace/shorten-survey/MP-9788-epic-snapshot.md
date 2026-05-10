# MP-9788 Epic Snapshot

- Epic: https://everfit.atlassian.net/browse/MP-9788
- Title: `| Client MP | Change the Birthdate Question and Move Later`
- Synced: 2026-04-22

## Stories

### MP-9789
- Title: `US01. As a client, I want the age range question to appear as the final step before submission, so that I complete the most important goal/preference questions first and the demographic question feels like a natural wrap-up.`
- Status: `To Do`
- Reporter: `Hien Nguyen (BA)`
- Priority: `High`
- Jira: https://everfit.atlassian.net/browse/MP-9789
- Spec: https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3653567095/Release+April+15+Spec+Change+the+Birthdate+Question+and+Move+Later#US01.-As-a-client%2C-I-want-the-age-range-question-to-appear-as-the-final-step-before-submission%2C-so-that-I-complete-the-most-important-goal%2Fpreference-questions-first-and-the-demographic-question-feels-like-a-natural-wrap-up.
- Outcome:
  - Replace birthdate input with an age-range step placed at the end of the survey.
  - Make the step faster on mobile while keeping match-quality data available.
- AC summary:
  - Show `What's your age range?` instead of the month-year birthdate field at the age step.
  - Move the age-range step to the final step before submission.
  - Use approved helper copy focused on tailoring training intensity, recovery, and recommendations.
  - Apply the change across normal, A/B, and inactive-client flows.

### MP-9790
- Title: `US02. As a client, I want to select my age range from a predefined list of options,So that my match results are better tailored to coaches who serve my demographic and life stage.`
- Status: `To Do`
- Reporter: `Hien Nguyen (BA)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9790
- Spec: https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3653567095/Release+April+15+Spec+Change+the+Birthdate+Question+and+Move+Later#US02.-As-a-client%2C-I-want-to-select-my-age-range-from-a-predefined-list-of-options%2CSo-that-my-match-results-are-better-tailored-to-coaches-who-serve-my-demographic-and-life-stage.
- Outcome:
  - Offer six age-range choices as a one-tap alternative to birthdate entry.
  - Block under-18 users from advancing while preserving age data for matching.
- AC summary:
  - Render exactly six options in order: `Under 18`, `18-24`, `25-34`, `35-44`, `45-54`, `55+`.
  - Support single selection using the existing survey option-card pattern.
  - Selecting `Under 18` shows an inline error and disables next.
  - If birthdate exists on file, preselect the matching age range; otherwise leave blank.
  - Include selected age range in the submitted coach-matching payload.

## Ticket Seeds

- MP-9789: Subtask seed: move the age-range question to the final survey step and replace legacy birthdate step copy.
- MP-9790: Subtask seed: implement six-option age-range selection with prefill and under-18 blocking behavior.

## Worklog Seeds

- MP-9789: Updated survey flow to place the age-range step at the end and replace the birthdate input copy.
- MP-9790: Added age-range option selection, prefill behavior, and under-18 blocking rules.
