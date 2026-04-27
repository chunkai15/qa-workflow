1. **Acceptance Criteria**
   - **Status meaning**
     - In-progess : BA is currently drafting the requirements and logic.
     - Ready for review : AC is complete from a BA perspective and awaits PO feedback
     - In-Revision: PO has requested changes, provided feedback or questions have been raised.
     - Ready for dev : PO has signed off. Technical teams can now pick this up for grooming/coding.
     - Update : AC that has been updated after dev has started
     - Design not ready : Additional status to mark the design status (For BA to track with designer)

   - **Precondition**
     - I am logged in as a **Owner/Admin**
     - The **Booking feature is enabled** for my Workspace.

   - **Epic: [Client MP] Remove Extra Steps from Survey**
     - **US01. Shorter survey with 11 questions for Client Onboarding to enable AI coach matching**
       - **User story**
         - As a prospective client, I want to answer a short set of targeted questions so that the AI algorithm can find the best-matching coaches for my needs.
       - **Pre-conditions**
         - Client has not yet completed the onboarding survey.
       - **Scope rule**
         - Survey is displayed to the client once, immediately after account creation or first login before the main marketplace view is accessible.

       - **AC1. Survey entry point for the first time login clients (Ready for dev)**
         - **GIVEN**
           - I am a new client who has just created an account or logged in for the first time.
           - The onboarding survey has not been completed.
         - **WHEN**
           - I click on “Find my match” button on the Welcome screen
         - **THEN**
           - The system should open the “Find Your Perfect Match” modal (as current flow)
           - After client input their First Nam, Last Name, Email Address, Country, the system should navigate clients to the first question of the list. Refer to AC3 below for the question order
           - Client can NOT skip the survey, they need to complete the survey to be able to explore Marketplace
         - **FIGMA**
           - *(Not provided)*

       - **AC2. Persist survey question for the next attempt (Ready for dev)**
         - **GIVEN**
           - I am a client who has not completed the new shorter survey
         - **WHEN**
           - When I revisit Marketplace for the next time
         - **THEN**
           - The system should remember which question I has dropped off from and navigate me right to that question so that I can continue to complete my survey
           - The system should persist my answer for the question I have provided the answer and display my last answer for each question so that I don’t need to go through it again.
           - Given there is question I have provide answer and the system is displaying it, I can still revisit the question and change my answer there.
         - **FIGMA**
           - *(Not provided)*

       - **AC3. Apply new shorter survey for the clients who has not completed with the previous survey question (Ready for dev)**
         - **GIVEN**
           - I am a client who is in the middle of the previous version of the survey
         - **WHEN**
           - I log in to Marketplace after the moment this new shorter survey is released
         - **THEN**
           - The system should serve me this new shorter survey, starting with the Question 1
           - For the question that is the same with the previous version, the system should persist my last answer and display it automatically for me
           - I can still be able to change the answer
         - **FIGMA**
           - *(Not provided)*

       - **AC4. New shorter survey and its order (Ready for dev)**
         - The new shorter survey should follow the new order as below:

         - **Question list (11 questions)**
           | **Question** | **Answer options** | **Required/Optional** | **Single/Multiple select** | **Design** |
           | --- | --- | --- | --- | --- |
           | 1. **What’s your main fitness goal?** | - Slim down<br>- Get cut<br>- Bulk up<br>- Boost health<br>- Improve diet<br>- Not sure yet | Required | Single select |  |
           | 2. **What coaching format do you prefer?**<br>**~~Which types of coaching interest you?~~** | - Individual/ 1-1<br>- Group Training<br>- Workout plans (self-guided) | Required | Multiple select with checkbox |  |
           | 3. **What coaching focus are you interested in?** | - Habit Coaching<br>- Nutrition Coaching<br>- Sport Coaching<br>- Exercise Coaching | Required | *(Not specified)* |  |
           | 4. **How experienced are you with fitness training?** | - I’m new and curious about exercise<br>- I’m getting back into it<br>- I’m moderately or occasionally active<br>- I’m highly active<br>- I’m a dedicated athlete | Required | *(Not specified)* |  |
           | 5. **What sports are you most interested in?**<br>*(Conditional logic)*<br>- Only show this question if client select “Sport coaching” in the Q2.<br>- If client didn’t select “Sport Coaching” in Q2, skip this question | *(Not provided in spec)* | Required | - Multiple select<br>- Up to 3 sports |  |
           | 6. **Do you want to train in person or online?** | - Online<br>- In-person<br>- Online and in-person | Required | Sigle select |  |
           | 7. **What’s your gender?** | - Male<br>- Female<br>- Non-binary/Other<br>- Prefer not to say | Required | Single select |  |
           | 8. **What coach gender do you prefer?** | - No Preference<br>- Male<br>- Female<br>- I want a coach who is LGBTQIA+ friendly | Required | Multiple select |  |
           | 9. **What’s your monthly budget for coaching?** | From $20 to $500+ | Required | Range select |  |
           | 10. **Where are you located?** | - Country pre-filled with the data in the Find your perfect match modal<br>- City: Search by city | Required | Single select |  |
           | 11. **What’s your age range?** | 18–24, 25–34, 35–44, 45–54, 55–64, 65 or older | Required | Single select- added notes. |  |

         - **Design status**
           - Design not ready

       - **AC5. Persist exact birthdate data if any (Ready for dev)**
         - **GIVEN**
           - I am a client has provided the exact birthdate data in previous survey
         - **WHEN**
           - The system run the new shorten survey
         - **THEN**
           - The system should persist my exact birthdate from my last answer so that Everfit will have this data for other purpose in the future.
           - The age range of the client in the new shorter survey should be saved separately from the exact birthdate and should NOT impact or being impacted the exact birthdate.
         - **FIGMA**
           - *(Not provided)*

     - **US2. Apply A/B Testing for this shorter version for Match Survey**
       - **User story**
         - As Everfit Team, We want to apply A/B Testing for the Match Survey to see which version of the match survey difference in the number of question and the question order will be

       - **AC1. Apply A/B testing for client - Stop the A/B testing started on Apr 2, 2026. (Ready for dev)**
         - **GIVEN**
           - I am client has start BUT has not complete the match survey
         - **WHEN**
           - I login Marketplace explore
         - **THEN**
           - The system should detect which version of survey I was assigned to Variation 1 or Variation 2. Refer to https://everfit.atlassian.net/wiki/x/KYAC1w for details
           - If I was assign the original Version A the system should keep this version for me and navigate me to the last question where I has dropped off
           - The answer that I have provided in the last round should be persisted and displayed as selected for me
           - I can still change the answer
           - If I was assign the Variation 2, the system should reassign the Survey variation for me. Refer to AC3 for the assignment logic.
           - The survey should start with the question 1 of the list
           - Given client is dropped in the middle of the survey, the system should pre-fill the answer that client has provided in the previous survey if any, Client can still be able to change the answer
         - **FIGMA**
           - *(Not provided)*

       - **AC2. Apply A/B Testing for Match survey for Inactive Client from Core (Ready for dev)**
         - **GIVEN**
           - I am an inactive client from Core
         - **WHEN**
           - I log in to Marketplace
         - **THEN**
           - The system should NOT keep the shortened match survey for inactive client AND reassign the Survey Variant for me. Refer to AC3 for the assignment logic.
           - All question should be displayed as its order in AC4 (link below):
             - https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3646914609/Spec+MP+Client+Experience+-+Onboarding+Match+Survey+-+Shorter+version+-+11+questions#AC4.-New-shorter-survey-and-its-order-Ready-for-review
           - Given there is information of my account on Core, the system should pre-fill the data for me ahead so I don’t need to select an answer again
           - I can still be able to change the answer
           - Given client is dropped in the middle of the survey, the system should pre-fill the answer that client has provided in the previous survey if any, Client can still be able to change the answer
         - **FIGMA**
           - *(Not provided)*

       - **AC3. A/B Testing assignment rule (Ready for dev)**
         - **Distribution**
           - 50/50 split assigned immediately upon clicking the "Take the Match Survey" CTA.
         - **Test Duration**
           - TBD
         - **Minimum duration guidance**
           - Minimum 4 weeks from launch date to capture enough sample data.
         - **Survey Variation**
           | **Variant 1 (Original Version A)** | **Variant 2 (Version B )** |
           | --- | --- |
           | 1. Do you want to train in person or online? | 1. What’s your main fitness goal? |
           | 2. Where do you want to train in person? / Which city are you in? (conditional logic) | 2. What coaching format do you prefer? |
           | 3. Which types of coaching interest you? | 3. What coaching focus are you interested in? |
           | 4. What sports are you most interested in? | 4. How experienced are you with fitness training? |
           | 5. How experienced are you with fitness training? | 5. What sports are you most interested in?<br>- Only show this question if client select “Sport coaching” in the Q2.<br>- If client didn’t select “Sport Coaching” in Q2, skip this question |
           | 6. What's your main fitness goal? | 6. Do you want to train in person or online? |
           | 7. Let's talk motivation – what's your why? | 7. What’s your gender? |
           | 8. What's your gender? | 8. What coach gender do you prefer? |
           | 9. Birthdate | 9. What’s your monthly budget for coaching? |
           | 10. What coach gender do you prefer? | 10. Where are you located? |
           | 11. Describe your ideal coach | 11. What’s your age range? |
           | 12. What's your monthly budget for coaching? |  |
           | 13. Anything else we should know? |  |
           | 14. Anything specific you want in a coach? |  |

1. **Event Tracking**
   - **Table**
     | **Event on Amplitude** | **Amplitude Properties** | **Database Properties** | **Other properties** | **Trigger point** |
     | --- | --- | --- | --- | --- |
     | STAGE 1 — Loading page | `mp_match_survey_group`<br><br>- Event Properties<br>```<br>page.url<br>page.path<br>page.name = mp_explore_match_loading<br>session_id<br>survey_variant = variant 1/variant 2<br>source = survey_completion<br>survey_completion_time_ms<br>```<br>- User Properties<br>```<br>client email<br>City/State<br>country<br>Language<br>Device Type<br>OS<br>Platform (Web/Mobile)<br>inactive_client_core = yes/no<br>``` | - Event Properties<br>```<br>page.url<br>page.path<br>page.name = mp_explore_match_loading<br>session_id<br>survey_variant = variant 1/variant 2<br>source = survey_completion<br>survey_completion_time_ms<br>```<br>- User Properties<br>```<br>Client email<br>City/State<br>country<br>Language<br>Device Type<br>OS<br>Platform (Web/Mobile)<br>``` |  | - System assign survey variant |