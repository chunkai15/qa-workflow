# MP-9775 Epic Snapshot

- Epic: https://everfit.atlassian.net/browse/MP-9775
- Title: `[Client MP] Remove Extra Steps from Survey`
- Synced: 2026-04-22

## Stories

### MP-9776
- Title: `[Client MP] [Match Survey] US01. Shorter survey with 11 questions for Client Onboarding to enable AI coach matching`
- Status: `In Progress`
- Assignee: `Thanh Nguyen`
- Reporter: `Phuong Tran`
- Priority: `Highest`
- Jira: https://everfit.atlassian.net/browse/MP-9776
- Spec: https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3646914609/Spec+MP+Client+Experience+-+Onboarding+Match+Survey+-+Shorter+version+-+11+questions#US01.-Shorter-survey-with-11-questions-for-Client-Onboarding-to-enable-AI-coach-matching
- Outcome:
  - Replace onboarding survey with an 11-question shortened flow for new clients.
  - Keep survey blocking until completion and resume from last answered question.
  - Preserve assigned version for in-progress clients after rollout.
- AC summary:
  - First login opens the existing match entry modal, then routes into the new question list.
  - In-progress clients return to the exact question they dropped on with answers prefilled and editable.
  - Existing Variant A and existing shortened/inactive-client assignments stay unchanged after release.
  - New order uses the revised shorter survey, including updated location Q10 text and no helper copy.
  - Exact birthdate stays stored separately; new age-range answer must not overwrite it.

### MP-9777
- Title: `[Client MP | Match Survey] US2. Apply A/B Testing for this shorter version for Match Survey`
- Status: `In Progress`
- Assignee: `Thanh Nguyen`
- Reporter: `Phuong Tran`
- Priority: `Highest`
- Jira: https://everfit.atlassian.net/browse/MP-9777
- Spec: https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3646914609/Spec+MP+Client+Experience+-+Onboarding+Match+Survey+-+Shorter+version+-+11+questions#US2.-Apply-A%2FB-Testing-for-this-shorter-version-for-Match-Survey
- Outcome:
  - Run a 50/50 A/B assignment between survey variants at survey start.
  - Stop using the older Apr 2 test assignment logic for this release window.
  - Reassign inactive Core clients and some prior Variant B clients under the new rule.
- AC summary:
  - Incomplete clients on Variant A keep Variant A and resume where they dropped.
  - Incomplete clients previously on Variation 2 are reassigned under the new rule and restart from Q1 with prefilled answers when available.
  - Inactive Core clients do not keep the old shortened survey; they get reassigned and prefilled from Core data.
  - Assignment rule is 50/50 at CTA click and should persist the chosen variant.

### MP-9823
- Title: `[Web][HS][Match Survey][Event Tracking] Implement tracking System assign survey variant`
- Status: `QA READY`
- Assignee: `Thanh Nguyen`
- Reporter: `Thanh Nguyen`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9823
- Spec: https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3646914609/Spec+MP+Client+Experience+-+Onboarding+Match+Survey+-+Shorter+version+-+11+questions#Event-Tracking
- Outcome:
  - Track survey variant assignment at match-survey loading.
  - Send variant context consistently to analytics and DB properties.
- AC summary:
  - Emit `mp_match_survey_group` when the system assigns a survey variant.
  - Include page, session, source, completion time, and survey variant properties.
  - Sync variant group values across DB, HubSpot, Intercom, and CMS contexts.

### MP-9853
- Title: `[API][Match Tool] DB Seed: Age range question + Update forms + Create SHORTENED_VARIANT_B form`
- Status: `In Review`
- Assignee: `Dat Phan (BE)`
- Reporter: `Dat Phan (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9853
- Spec: https://everfit.atlassian.net/wiki/x/MYBf2Q ; https://everfit.atlassian.net/wiki/x/dwLF2Q
- Outcome:
  - Add age-range enums and question metadata, then seed a new `SHORTENED_VARIANT_B` form.
  - Replace birthdate with age range in published forms and migrate in-progress answers.
  - Keep migration idempotent and reuse existing split-question IDs where required.
- AC summary:
  - Add `SHORTENED_VARIANT_B`, `AGE_RANGE`, and age-range option enums.
  - Create Q10 location and Q11 age-range questions with six options.
  - Swap birthdate to age range across REGULAR, REGULAR_VARIANT_B, and SHORTENED published forms.
  - Convert valid in-progress birthdate answers into mapped age-range answers.
  - Insert the new 11-question `SHORTENED_VARIANT_B` form.

### MP-9854
- Title: `[API][Match Tool] Survey Start Logic: AB test routing to SHORTENED_VARIANT_B + Inactive client + Resubmit`
- Status: `In Review`
- Assignee: `Dat Phan (BE)`
- Reporter: `Dat Phan (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9854
- Spec: https://everfit.atlassian.net/wiki/x/MYBf2Q ; https://everfit.atlassian.net/wiki/x/dwLF2Q
- Outcome:
  - Route B-group users to `SHORTENED_VARIANT_B` using a new AB-test start date guard.
  - Put inactive clients through the same assignment path instead of a separate shortened flow.
  - Reassign resubmits from older non-regular variants into `SHORTENED_VARIANT_B`.
- AC summary:
  - Add `MATCH_TOOL_AB_TEST_START_DATE` config and filter assignment counts by start date.
  - Update `initWaitlistFormAnswer` so B-group and inactive clients share the same active-form logic.
  - Keep REGULAR resubmits unchanged, but map REGULAR_VARIANT_B and SHORTENED resubmits to `SHORTENED_VARIANT_B`.
  - Add unit coverage for A-group, B-group, inactive, and resubmit paths.

### MP-9855
- Title: `[API][Match Tool] Submit Flow: Under-18 validation + AI match payload + Search query update`
- Status: `In Review`
- Assignee: `Dat Phan (BE)`
- Reporter: `Dat Phan (BE)`
- Priority: `Medium`
- Jira: https://everfit.atlassian.net/browse/MP-9855
- Spec: https://everfit.atlassian.net/wiki/x/MYBf2Q ; https://everfit.atlassian.net/wiki/x/dwLF2Q
- Outcome:
  - Reject under-18 selections during submit.
  - Feed age-range data into AI match payload and coach-search deal-breaker logic.
  - Keep older ideal-age fallback until AI-side confirmation is settled.
- AC summary:
  - Throw HTTP 400 when `AGE_RANGE` answer is `under_18`.
  - Use the approved under-18 error copy in submit validation.
  - Add `AGE_RANGE` into `has_deal_breaker` search-query logic.
  - Prefer age-range answer for AI payload `age`, then fall back to legacy age-range logic.
  - Cover under-18, valid age range, and non-age-range cases with tests.

## Ticket Seeds

- MP-9776: Subtask seed: wire the 11-question shortened onboarding flow with resume and assignment persistence rules.
- MP-9777: Subtask seed: implement persisted 50/50 survey variant assignment and reassignment rules for prior Variation 2 and inactive clients.
- MP-9823: Task seed: add survey-variant assignment analytics event and contact-property sync.
- MP-9853: Subtask seed: ship idempotent DB migration for age-range questions, answer migration, and `SHORTENED_VARIANT_B` form creation.
- MP-9854: Subtask seed: update start-survey routing and resubmit behavior to assign `SHORTENED_VARIANT_B` behind a start-date-filtered AB test.
- MP-9855: Subtask seed: validate under-18 age-range submissions and propagate `AGE_RANGE` through AI payload and search filters.

## Worklog Seeds

- MP-9776: Implemented shortened 11-question survey flow with resume-from-dropoff and version persistence rules.
- MP-9777: Added new A/B assignment and reassignment rules for shortened survey variants.
- MP-9823: Implemented survey variant assignment tracking and property sync payloads.
- MP-9853: Added DB seed and migration support for age-range questions and `SHORTENED_VARIANT_B`.
- MP-9854: Updated survey start and resubmit routing to use `SHORTENED_VARIANT_B` assignment logic.
- MP-9855: Added under-18 validation and updated AI match/search payload handling for `AGE_RANGE`.
