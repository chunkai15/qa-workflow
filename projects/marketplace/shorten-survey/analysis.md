# MASTER SPECIFICATION: MATCH SURVEY OPTIMIZATION (RELEASE APRIL 23)

## 1. PROJECT OVERVIEW
* [cite_start]**Project**: Marketplace Client Experience - Onboarding[cite: 104, 105].
* [cite_start]**Objective**: To optimize the conversion funnel by reducing survey drop-offs through a shorter question set and simplified age selection[cite: 19, 20, 114].
* **Jira Tickets**: 
    * [cite_start]**MPD-650**: Change Birthdate Question to Age Range[cite: 2, 105].
    * [cite_start]**MPD-652**: Reduce Match Survey to 11 targeted questions[cite: 105, 115].
* **Legacy Versions (Pre-Optimization)**:
    * **Ver 1 (Constant)**: The standard 14-question survey live today.
    * **Ver 2 (Variation 1)**: A 15-question version with logistics questions split in the middle.

---

## 2. CHANGE THE BIRTHDATE QUESTION (MPD-650)
[cite_start]The survey replaces the manual month-year input with a friction-less age bracket selection[cite: 33, 35].

### 2.1. Question Structure
* [cite_start]**Title**: "What's your age range?"[cite: 30, 33].
* [cite_start]**Copy**: "This helps us to tailor training intensity, recovery, and recommendations for you."[cite: 64, 70].
* [cite_start]**Options (6 Brackets)**: `Under 18`, `18–24`, `25–34`, `35–44`, `45–54`, `55+`[cite: 56, 57, 58, 59].
* [cite_start]**UI Layout**: Approved "Option 1: List View" (Vertical list of full-width buttons) to reduce "fat-fingering"[cite: 64].

### 2.2. Logic and Acceptance Criteria
* **Under 18 Handling**: 
    * [cite_start]Everfit only supports clients 18 and older[cite: 93].
    * [cite_start]If "Under 18" is selected, an error message/popup appears: "You must be at least 18 years old to train with an Everfit coach."[cite: 95, 103].
    * [cite_start]Clicking [Got it] closes the survey and returns the user to the landing page[cite: 97, 101].
* **Auto-fill / Pre-selection**:
    * [cite_start]If the system has a stored exact birthdate (from email/account), it calculates the current age and pre-selects the corresponding bracket[cite: 61].
    * [cite_start]If no birthdate is on file, no option is pre-selected[cite: 61].
* [cite_start]**Dynamic Imagery**: Images change based on the selected age range and gender combination[cite: 59, 64].
* [cite_start]**Data Integrity**: Selected age range is saved separately; any existing exact birthdate data must be persisted and NOT impacted by the age range selection[cite: 166].

---

## 3. SHORTER SURVEY STRUCTURE (11 QUESTIONS)
[cite_start]The new optimized survey (Variant 2 in A/B testing) follows this mandatory order[cite: 150, 168]:

| # | Question | Answer Type | Requirement | Logic |
| :--- | :--- | :--- | :--- | :--- |
| 1 | What’s your main fitness goal? | Single Select | [cite_start]Required | [cite: 150] |
| 2 | What coaching format do you prefer? | Multiple Select | [cite_start]Required | [cite: 150] |
| 3 | What coaching focus are you interested in? | *(Not specified)* | [cite_start]Required | [cite: 151] |
| 4 | How experienced are you with fitness training? | *(Not specified)* | [cite_start]Required | [cite: 151] |
| 5 | **What sports are you most interested in?** | Multiple (Max 3) | Required | [cite_start]**Conditional**: Only shows if "Sport coaching" is selected in Q2[cite: 152]. |
| 6 | Do you want to train in person or online? | Single Select | [cite_start]Required | [cite: 164] |
| 7 | What’s your gender? | Single Select | [cite_start]Required | [cite: 164] |
| 8 | What coach gender do you prefer? | Multiple Select | [cite_start]Required | [cite: 164] |
| 9 | What’s your monthly budget for coaching? | Range Select | [cite_start]Required | [cite: 165] |
| 10 | Where are you located? | Single Select | Required | Country pre-filled; [cite_start]City search[cite: 165]. |
| 11 | What’s your age range? | Single Select | Required | [cite_start]Replaces Birthdate[cite: 165]. |

---

## 4. DATA MAPPING FROM PREVIOUS VERSIONS
When users migrate to the 11-question survey, data is pre-filled from legacy answers:

| New Question (11-Q) | Mapping from Ver 1 (Constant) | Mapping from Ver 2 (Variation 1) |
| :--- | :--- | :--- |
| **Q1. Fitness Goal** | Q6 | Q5 |
| **Q2. Coaching Format** | Q3 (format split) | Q1 |
| **Q3. Coaching Focus** | Q3 (focus split) | Q2 |
| **Q4. Fitness Experience** | Q5 | Q4 |
| **Q5. Sports (Conditional)** | Q4 | Q3 |
| **Q6. Training Mode** | Q1 | Q7 |
| **Q7. Your Gender** | Q8 | Q9 |
| **Q8. Coach Gender Pref** | Q10 | Q11 |
| **Q9. Monthly Budget** | Q12 | Q13 |
| **Q10. Location** | Q2 | Q8 |
| **Q11. Age Range** | **Q9 (Birthdate)** | **Q10 (Birthdate)** |

---

## 5. A/B TESTING AND REASSIGNMENT LOGIC

### 5.1. Assignment Rule
* [cite_start]**Distribution**: 50/50 split assigned upon clicking "Take the Match Survey"[cite: 168].
* **In-progress Users**:
    * [cite_start]If assigned to Version B (Shorter): Starts from Q1, but pre-fills answers from the previous survey version[cite: 167].

### 5.2. Inactive Client Handling (from Core)
* [cite_start]**Rule**: Systems will NOT keep shortened surveys for inactive clients[cite: 167].
* [cite_start]**Reassignment**: Inactive clients are reassigned a survey variant (50/50 split)[cite: 167].
* [cite_start]**Core Pre-fill**: Account information from Core (Email, Country, Name) should pre-fill survey data to reduce re-entry[cite: 149, 168].

---

## 6. QA ANALYST: CHECKLIST AND EDGE CASES

### 6.1. Functional and Data Logic
* **Age Calculation Accuracy**: Verify bracket selection for edge cases (e.g., birthday today making user exactly 18 or 25).
* **Under 18 Block**: Ensure popup triggers via both manual selection and auto-calculation from legacy DOB.
* **Conditional Persistence**: Ensure Q5 (Sports) remains hidden or shows correctly when navigating [Back] and changing Q2 answers.
* **Data Separation**: Verify `Exact Birthdate` and `Age Range` exist as separate fields in the DB after submission.

### 6.2. A/B Testing and Tracking (Amplitude)
* [cite_start]**Event Tracking**: Verify `mp_match_survey_group` triggers with correct `survey_variant` (1 vs 2)[cite: 172].
* [cite_start]**User Flags**: Ensure `inactive_client_core` (yes/no) is accurately passed in the payload[cite: 172].
* [cite_start]**Resume Logic**: Verify the system navigates to the exact drop-off question upon revisit[cite: 149].