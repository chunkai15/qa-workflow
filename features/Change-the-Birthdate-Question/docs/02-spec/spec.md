# [Release April 23] [Spec] Change the Birthdate Question

## Overview

Based on the client funnel analysis, a large portion of users drop-off at the date of birth step.  
Opportunity: Since majority of users are on mobile devices and “tapping” through the survey, ask for an age bracket in the matching quiz — one tap, no friction.

## Objective

1. US01. As a client, I want to select my age range from a predefined list of options, so that my match results are better tailored to coaches who serve my demographic and life stage.
   - Pre-conditions: Client has not yet completed the match survey.
   - Scope rule: including a/b flow, inactive flow.

| **AC** | **GIVEN** | **WHEN** | **THEN** | **FIGMA** |
| --- | --- | --- | --- | --- |
| **AC-1.1 — Question placement** | Given the client is progressing through the onboarding survey | When they reach the birthdate/age step | Then they see a step titled **"What's your age range?"** (replacing the previous month-year input field and any prior birthdate copy). |  |
| **AC-1.2 — Option display** | Given the client is on the age range step | When the step renders | Then they see exactly 6 selectable options displayed as option cards (matching the existing survey option card pattern), in this order: <br> - Under 18 <br> - 18–24 <br> - 25–34 <br> - 35–44 <br> - 45–54 <br> - 55+ |  |
| **AC-1.3 — Single selection** | Given the client views the age range options | When they tap/click one option except under 18 | Then that option becomes selected and the image changes based on age range and gender, following the mapping table below. |  |

**Gender / Age / Image mapping**

| **Gender** | **Age** | **Image** |
| --- | --- | --- |
| Male | 18–24 |  |
| Male | 25–34 |  |
| Male | 35–44 |  |
| Male | 45–54 |  |
| Male | 55+ |  |
| Female | 18–24 |  |
| Female | 25–34 |  |
| Female | 35–44 |  |
| Female | 45–54 |  |
| Female | 55+ |  |
| Non-binary / Other / Prefer not to say | 18–24 |  |
| Non-binary / Other / Prefer not to say | 25–34 |  |
| Non-binary / Other / Prefer not to say | 35–44 |  |
| Non-binary / Other / Prefer not to say | 45–54 |  |
| Non-binary / Other / Prefer not to say | 55+ |  |

- When they tap/click one option “Under 18”  
  - Then: TBD.

| **AC** | **GIVEN** | **WHEN** | **THEN** | **FIGMA** |
| --- | --- | --- | --- | --- |
| **AC-1.4 — No auto-fill** | Given the system has a stored birth date for the client (derived from their email/account) | When the age range step renders | Then the system calculates the client's current age and **pre-selects the corresponding range** automatically. |  |
|  |  | When no birth date is on file | Then no option is pre-selected by default. |  |
| **AC-1.5 — Data passed forward** | Given the client selects an age range and completes the survey | When the survey is submitted | Then the selected age range value is included in the survey payload used for coach matching logic. |  |

## Open questions

| **No** | **Question** | **Carly’s review** |
| --- | --- | --- |
| 1 | The UI is ready for review. There are two options: <br> - Question name: What's your age range? <br> - Copy: This helps us to tailor training intensity, recovery, and recommendations for you. <br> - Behavior: The current behavior is maintained - the image will change based on the selected age range. <br> - The UI offers 2 distinct layouts for age selection: <br> &nbsp;&nbsp;- Link: https://www.figma.com/design/3bAfXgH3fssalaGWVdJ5TD/-MPD--Trainer-Match-Tool--Client-?node-id=16734-370458&t=wbR6k8LhnRK78chB-4 <br> &nbsp;&nbsp;- Option 1: List View <br> &nbsp;&nbsp;&nbsp;&nbsp;- Layout: Vertical list of full-width buttons. <br> &nbsp;&nbsp;- Option 2: Grid View / Chip View <br> &nbsp;&nbsp;&nbsp;&nbsp;- Layout: Multi-column grid using "Chips" <br><br> Please help us review the copy and select the most suitable option. In the previous meeting, LJ provided feedback that the copy should be changed. From my side, Option 1 makes more sense. | [Carly Bogatz](/people/712020:4473f5fa-f4b5-4d17-9a0b-bc6795a23172) <br><br> 1. **Copy – approved** <br> 2. **Layout – approved** the Vertical list/full width buttons. This will help reduce fat-fingering versus the other layout. <br> 3. **CB Question:** I appreciate the dynamic images for each date range based on the client's gender, however, can we consider a less dynamic approach first to get this out the door faster? What’s the engineering difference in level of effort between the 2? [Hien Nguyen (BA)](/people/712020:d510e922-10c6-42ea-8ce7-52ae25962eea) |
| 2 | Currently, MP supports clients over 18. If a client selects "Under 18," the system should display an error message. In the future, the system will show a banner for clients under 18 and clicking [Got it] will close the survey and go back to the landing page. I propose our platform show message: <br> - You must be at least 18 years old to train with an Everfit coach. | [Carly Bogatz](/people/712020:4473f5fa-f4b5-4d17-9a0b-bc6795a23172) — Makes sense – pop-up design/copy **approved** |
