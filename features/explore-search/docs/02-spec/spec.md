1. **[Spec] [MP Client Experience - Explore] Search Mechanism**
   - **URL:** https://everfit.atlassian.net/wiki/spaces/Marketplac/pages/3641868338/Spec+MP+Client+Experience+-+Explore+Search+Mechanism
   - **Last modified:** Monday, April 13, 2026 at 11:20 AM Z

1. **Items**
   - | **Items** | **Note** |
     | --- | --- |
     | **Product Owner** | [Carly Bogatz](/people/712020:4473f5fa-f4b5-4d17-9a0b-bc6795a23172) |
     | **Product Item** | https://everfit.atlassian.net/browse/MPD-633 |
     | **Design** | [Search Coaches on Explore Page](https://www.figma.com/design/E58KQOqaM1UUv2IMV8jmyB/MPD---Explore-Page-v2?node-id=10903-158541&t=PXiorXbAftbhnwW3-4) |
     | **Document Owner** | [Phuong Tran](/people/712020:df48b75b-02fe-48d3-bc03-3b97655fa9bb) |
     | **Project Manager** | [Hoa Nguyen](/people/5ddab5e27474110e231129ef) |
     | **Document Status** | Ready for review |
     | **Related Document** | https://everfit.atlassian.net/wiki/x/GgAi2 |

1. **Overview**
   - The Explore page currently lacks the ability to search using unstructured data, both in terms of underlying logic and user interface.
   - For example, entering a term like “prenatal” returns no results because it isn’t structured within the system.
   - Additionally, selecting “Search” unexpectedly surfaces filters instead of initiating a search, creating a confusing user experience.

1. **Problem statement**
   - The current Everfit Marketplace Explore page provides only filtering coach using into a single control as the search UI, confusing clients and failing to surface the most relevant coaches.
   - Clients can NOT use informal, natural-language terms (“get lean”, “postpartum fitness”, “bulk up”) to search for coaches.
   - As a result, high-quality, relevant coaches are missed, and clients drop off the Explore page without finding a match.

1. **Objective**
   - **V 1.0 Goals:**
     - Separate the Search & Filter functionality (but keep the Filter layout/experience as-is).
     - Run a tagging mechanism on the backend for the existing data and when package is created or updated so results can be rendered.

1. **Document version**
   - | **PIC** | **Date** | **Description** | **Version** |
     | --- | --- | --- | --- |
     | [Phuong Tran](/people/712020:df48b75b-02fe-48d3-bc03-3b97655fa9bb) | 2026-4-8 | Initial version | 1.0.0 |

1. **Acceptance Criteria (status definitions)**
   - **In-progress:** BA is currently drafting the requirements and logic.
   - **Ready for review:** AC is complete from a BA perspective and awaits PO feedback.
   - **In-Revision:** PO has requested changes, provided feedback or questions have been raised.
   - **Ready for dev:** PO has signed off. Technical teams can now pick this up for grooming/coding.
   - **Update:** AC that has been updated after dev has started.
   - **Design not ready:** Additional status to mark the design status (For BA to track with designer).

1. **Workflow**

1. **US1. Search for Coach and Packages by structured data**
   - **User story:** As a client, I want to search for coaches based on relevant keywords so that I can find coaches and packages that match my needs and explore their profiles.

   - **AC1. Entry Point (Ready for dev)**
     - **GIVEN:** I am on the Marketplace page
     - **WHEN:** I view the top navigation bar
     - **THEN:**
       - The system should display a search input field with placeholder text “Search coaches, packages or specialties.”
       - On click on the search box, the system should place the cursor in it so I can start typing for search.
       - While typing, when I pause for 200ms or press enter, the system should trigger a search request.

   - **AC2. Full-text Search Scope (Ready for dev)**
     - **GIVEN:** I am performing a search
     - **WHEN:** The system triggers a search request
     - **THEN:**
       - The system should apply full-text search across the following fields:
         - **Coach data:**
           - (i) Coaching focus
           - (ii) Coaching type / services
           - (iii) Certificates
           - (iv) Coaching personality
           - (v) Expertise
         - **Package data:**
           - (i) Package title
           - (ii) Package headline
           - (iii) Package description
           - (iv) Package label
       - The system should:
         - Support case-insensitive search
         - Support partial keyword matching
         - Sanitize special characters

   - **AC3. Match Qualification (Ready for dev)**
     - **GIVEN:** I am searching with a keyword
     - **WHEN:** (not specified)
     - **THEN:**
       - The system should return:
         - **A coach** if any coach field matches the keyword OR any package belonging to that coach matches the keyword.
         - **A package** if the package field matches the keyword.
       - Given **multiple packages** of the **same coach** match, the system should display the coach **only once** in the result list.
       - The system should include coaches even if:
         - Only package data matches
         - Only coach profile data matches
         - Both match

   - **AC4. Result Structure & Display (Ready for dev)**
     - **GIVEN:** I am viewing search results
     - **WHEN:** The page is loaded
     - **THEN:**
       - The system should display: **Coach Profile section (top)** and **Package section (below)**.
       - The system should sort:
         - **For Coach section:**
           - Coaches in the same country as the client first
           - Then by rating (descending)
         - **For Package section:** TBD
       - If no coach matches the search value, the system should **hide** the **Coach section**.
       - If no coach AND no package match, the system should:
         - Display empty state message (e.g., “No results found”)
         - Hide both sections
       - The system should display the Coach profile card and package card as the current logic.
       - When I hover on the coach card or package card, the system should display the hover state.
       - When I click on the card, the system should navigate me to the Coach profile page or Package page (following the current logic).

   - **AC5. Page Loading & States (Ready for dev)**
     - **GIVEN:** Page Loading & States
     - **WHEN:** (not specified)
     - **THEN:**
       - The system should:
         - Display skeleton loading for both sections
         - Prevent duplicate requests while loading
       - If only coach OR only package data returns, the system should:
         - Render only the available section
         - Maintain correct layout spacing

1. **US2. Filter Coach and Package Experience**
   - **User story:** As a client, I want to filter coaches and packages on the Marketplace so that I can quickly find options that match my preferences.

   - **AC1. Entry Point – Open Filter Modal (Ready for dev)**
     - **GIVEN:** I am on Explore page
     - **WHEN:** The page is loaded
     - **THEN:**
       - The system should:
         - Display the “Filter” button next to Search box
         - Display the count badge if there is filter applied
         - Count badge should be the number of fields that is applied filter value to
       - When I click the “Filter Coach” button, the system should:
         - Open the filter modal as an overlay centered on the screen
         - Dim the background and prevent interaction with the Marketplace content
         - Display all filter sections:
           - (i) Location
           - (ii) Coaching Services
           - (iii) Monthly Budget
           - (iv) Package Options
           - (v) Gender Preference
           - (vi) Coaching Focus
           - (vii) Personality Traits
         - Filter UI and logic should follow the current logic.
         - The system should display previously applied filters as pre-selected values.

   - **AC2. Close Filter Modal (Ready for dev)**
     - **GIVEN:** I am viewing the filter modal
     - **WHEN:** I click the “X” icon or outside the modal
     - **THEN:**
       - The system should close the modal.
       - The system should NOT apply any changes unless I clicked “Show <n> Coaches”.

   - **AC3. Filter Chips Display (After Apply) (Ready for dev)**
     - **GIVEN:** I am on the Marketplace page after applying filters
     - **WHEN:** (not specified)
     - **THEN:**
       - The system should display the filter chip as the current logic.

   - **AC4. Remove Individual Filter (Ready for dev)**
     - **GIVEN:** Remove Individual Filter
     - **WHEN:** I am viewing applied filter chips
     - **THEN:**
       - The system should:
         - Remove that filter
         - Refresh results immediately
         - Update filter count badge

1. **Phase 2 - US3. Search coach and package with natural language (TBD)**
   - TBD

1. **Attachments (embedded in Confluence page)**
   - https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3641868338&preview=%2F3641868338%2F3647307990%2Fimage-20260408-170218.png
   - https://everfit.atlassian.net/wiki/pages/viewpageattachments.action?pageId=3641868338&preview=%2F3641868338%2F3655139778%2Fimage-20260413-112029.png