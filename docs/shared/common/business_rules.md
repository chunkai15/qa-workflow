# Business Rules

Business-specific testing rules for the fitness and nutrition app (Web, Mobile, API).

> **AI NOTE — Global Rules:** The rules marked with 🌐 **[GLOBAL]** below are cross-feature rules. When generating test cases, create **only ONE test case per feature** for each global rule — do **not** expand them into multiple sub-cases.

---

## 1. General

- **MUST** check plural vs. singular nouns. Example: `1 item`, `2 items`.
- Date/time format:
  - Same year: `MMM d` (e.g., `Mar 2`)
  - Different year: `MMM d, YYYY` (e.g., `Mar 2, 2024`)
- Any logic related to date/time → **SHOULD** test timezone handling.
- CTA button → **MUST** check spam-click behavior.
- Search without a submit button:
  - **MUST NOT** spam the API while typing — must have a debounce delay.
  - **MUST** test search with: numbers.
  - **MUST** test search with: special characters.
  - **MUST** test search with: special languages.
  - **MUST** test search with: lower/upper case.
  - **MUST** test search with: copy/paste input.
- Load more test data: create enough data for at least 2 load-more triggers. Example: if page size = 20 → prepare 41 items minimum.
- **MUST NOT** show logo or Everfit branding with Whitelabel app (workspaces with custom branding in client app, payment flow, and client emails) → don't show logo.
- If spec mentions plan tiers → **MUST** test access restriction on **Free** plan (feature is blocked).
- **MUST** test that **Trial / paid plan (Pro, Studio, Bundle)** unlocks the feature.

### Common Dev's Mistakes

#### Text & Display
- TextArea view mode **MUST** preserve line breaks.
- Long content **SHOULD** show ellipsis (`...`) — not overlay other elements.

#### UI Interaction
- Disabled buttons/frames **MUST NOT** be clickable.
- CUD (Create/Update/Delete) on source data **MUST** reflect in related lists/dropdowns.

#### Input & Validation
- Email fields **MUST NOT** be case-sensitive.
- Text inputs **SHOULD** auto-capitalize the first character.

---

## 2. Web

- 🌐 **[GLOBAL]** **MUST** test on Safari (One test case per feature. Do not create multiple sub-cases).
- If the feature is related to the purchase flow in Payment & Package (Client purchases the coach's package) → **MUST** check on mobile browser.
- **SHOULD** handle ESC key to close pop-ups.

---

## 3. Mobile

- 🌐 **[GLOBAL]** **MUST** test the app upgrade scenario.
- 🌐 **[GLOBAL]** **SHOULD** test old account (old data) running on a new build.
- If client app → **SHOULD** check custom branding colors of button.

---

## 4. API

- If spec doesn't define coach permissions → **MUST** follow General rule:
  - **Trainer:** edit/delete permission on their own assets only, even if shared.
  - **Admin/Owner:** edit/delete permission on all shared assets.
- Related to uploading image/video → **SHOULD** test file size limitations (image = 25 MB, video = 300 MB).
- Related to billing (coach purchases Everfit base subscription and add-on) → **MUST** test both monthly and annual billing periods.
- If the function affects the autoflow calendar → **MUST** test both Exact Date and Interval autoflow types.
- Any case related to client status → **MUST** be aware of all states: Pending, Connected, Offline, Archived, Waiting Activation.
- Related to authentication → **MUST** be aware of Google login.
- Related to purchase (both billing and payment) → **MUST** check 3DS card flow.
