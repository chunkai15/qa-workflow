Feature: Session Credits P1.0

  # RUNTIME CONTRACT
  # start_url: /
  # auth.app.mode: cookie
  # auth.app.role: coach
  # runtime.notes: Workspace must have Booking feature enabled. Client must be connected for issuance.

  # DATA CONTRACT
  # data.session_type_name: random string, prefix "CreditReq_"
  # data.credit_quantity: integer between 1 and 100
  # data.cleanup: mark_for_review

  # CRITICAL ORACLES
  # oracle.create_session_type_success: "Require session credit" is saved as true and appears in the list.
  # oracle.issue_credit_success: In-app notification "<client name> was issued {x} session credit(s)" is triggered and available balance is updated.
  # oracle.delete_credit_success: In-app notification "<client name>'s session credit balance was reduced" is triggered and balance is updated.
  # oracle.book_session_success: exactly 1 credit is deducted from available balance.
  # oracle.cancel_early_success: 1 credit is returned to available balance.
  # oracle.cancel_late_success: Credit is forfeited, balance is unchanged, history shows voided.
  # oracle.archive_warning_visible: "Archive Session Type?" modal appears with a warning about outstanding credits.
  # oracle.filter_history_success: The Balance History table only shows records matching the selected filter.

  # FLOW NOTES
  # flow.loading_state: Skeleton loading on Sessions tab, Upcoming Sessions, Credits tab, and Balance History.
  # flow.modal_state: "Create Session Type", "Archive Session Type?", "Issue Session Credits", "Delete Session Credits", "Cancel Session"

  Background:
    Given user starts at "/"
    And user has valid runtime credentials for role "coach"

  Scenario: Coach creates a Session Type that requires credit
    Given user is on "/session-types"
    When user clicks the "Add New Session Type" action
    And user enters a random "session_type_name" value
    And user sets the "Require session credit" toggle to "ON"
    And user clicks the "Create" button
    Then the new session type should be visible in the list with a check icon in the "Session credit" column

  Scenario: Coach issues session credits to a connected client
    Given user is on "/clients"
    And user opens a connected client profile
    When user clicks the "Sessions" tab
    And user clicks the "Credits" tab
    And user clicks the "+ Issue Credits" button
    Then the "Issue Session Credits" modal should be visible
    When user selects the newly created session type from the "Session type" dropdown
    And user enters a random "credit_quantity" value with constraint "between 1 and 100"
    And user clicks the "Issue" button
    Then the "available credits" balance should increase by the issued quantity
    And the "Balance History" should show a new "Issued" event

  Scenario: Coach deletes available session credits
    Given user is on the client profile "Credits" tab
    When user clicks the "-" button for the session type
    Then the "Delete Session Credits" modal should be visible
    When user enters "1" in the quantity field
    And user clicks the "Delete" button
    Then the "available credits" balance should decrease by "1"
    And the "Balance History" should show a new "Deleted" event

  Scenario: Coach books a session requiring credit and credit is deducted
    Given user is on the client profile "Sessions" tab
    When user clicks the "Go to Calendar >" button
    And user schedules a session for the client using the credit-required session type
    And user confirms the booking
    Then the booking should be confirmed
    And the client's "available credits" balance should decrease by "1"
    And the "Balance History" should show a new "Used" event linked to the session

  Scenario: Coach early cancels a session and credit is returned
    Given user is on the calendar
    When user clicks the previously booked session
    And user clicks the "Cancel" action
    And user selects "Early Cancel"
    And user confirms the cancellation
    Then the session should be canceled
    And the client's "available credits" balance should increase by "1"
    And the "Balance History" should show a new "Returned" event

  Scenario: Coach late cancels a session and credit is forfeited
    Given user schedules another session for the client using the credit-required session type
    And user confirms the booking
    When user clicks the session
    And user clicks the "Cancel" action
    And user selects "Late Cancel"
    And user confirms the cancellation
    Then the session should be canceled
    And the client's "available credits" balance should remain unchanged
    And the "Balance History" should show a new "Voided" event

  Scenario: Coach archives a session type with outstanding credits and sees a warning
    Given user is on "/session-types"
    And a session type exists with outstanding credits issued to clients
    When user clicks the "Archive" action for that session type
    Then the "Archive Session Type?" modal should be visible
    And the modal should display a warning: "Some clients have unused session credits for this session type"
    When user clicks the "Archive" button in the modal
    Then the session type should be moved to the "Archived" list

  Scenario: Coach unarchives a session type
    Given user is on "/session-types"
    And user clicks the "Archived" tab
    When user clicks the "Unarchive" action for a session type
    Then the session type should be moved back to the "Active" list
    And a success toast "Session type unarchived successfully" should appear

  Scenario: Coach filters Balance History by Session Type
    Given user is on the client profile "Credits" tab
    When user opens the "Session Type" filter
    And user selects a specific session type from the dropdown
    Then the "Balance History" list should only show events for the selected session type

  Scenario: Coach filters Balance History by Event type
    Given user is on the client profile "Credits" tab
    When user opens the "Event" filter
    And user selects "Issued" from the dropdown
    Then the "Balance History" list should only show "Issued" events

