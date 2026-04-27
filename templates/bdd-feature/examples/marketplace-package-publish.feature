@area:marketplace
@platform:web
@priority:critical
@runtime:staging
Feature: Create and publish marketplace package

  # RUNTIME CONTRACT
  # start_url: https://landing-stg.everfit.io/pro/login
  # base_url: https://landing-stg.everfit.io
  # auth.basic.browser: required
  # auth.basic.user_env: BASIC_AUTH_USER
  # auth.basic.pass_env: BASIC_AUTH_PASS
  # auth.app.mode: login_form
  # auth.app.email_env: TEST_EMAIL
  # auth.app.pass_env: TEST_PASSWORD
  # auth.app.role: coach
  # runtime.upload_dir_env: MARKETPLACE_UPLOAD_DIR
  # runtime.seed_data_env: none
  # runtime.notes: runtime-only credentials allowed, no raw secrets persisted
  #
  # DATA CONTRACT
  # data.entity_name: random, max_length=90, charset=ascii
  # data.headline: random, non_empty=true
  # data.description: random, non_empty=true
  # data.price: random_integer, min=1, max=999, currency=GBP
  # data.upload_file: any existing image from MARKETPLACE_UPLOAD_DIR, extensions=.png|.jpg|.jpeg
  # data.cleanup: mark_for_review
  #
  # CRITICAL ORACLES
  # oracle.login_success: url=/pro/preview and navigation sidebar visible
  # oracle.create_success: url=/pro/marketplace-packages/create
  # oracle.upload_success: uploaded image preview visible in hero image area
  # oracle.pricing_saved: pricing modal closes and configured price is visible on editor
  # oracle.publish_success: success message is visible and published state is visible via Live badge or Unpublish action
  #
  # FLOW NOTES
  # flow.loading_state: possible dashboard and editor readiness delay after navigation
  # flow.modal_state: Create New Package popup and Package Pricing popup
  # flow.native_chooser: yes
  # flow.iframe_presence: decorative, Intercom iframe may remain mounted and should not be treated as target surface
  # flow.alerts_or_banners: ignore non-blocking support widgets unless they obscure target controls
  # flow.publish_preconditions: valid required fields, successful image upload, valid pricing

  Background:
    Given user starts at "https://landing-stg.everfit.io/pro/login"
    And the application base URL is "https://landing-stg.everfit.io"
    And browser basic authentication is required
    And user has valid runtime credentials for role "coach"
    And required runtime inputs are available
    And browser is configured for stable automation

  Scenario: Login to marketplace dashboard
    When user opens the application with the required runtime authentication
    And user signs in with valid runtime credentials
    Then user should be on "/pro/preview"
    And the page should be fully loaded
    And "navigation sidebar" should be visible

  Scenario: Create and publish a package
    Given user is authenticated and starts from "/pro/preview"
    And the page should be fully loaded

    When user opens "Marketplace Packages" from the sidebar
    Then user should be on "/pro/marketplace-packages"
    And "packages table" should be visible

    When user starts creating a new "package"
    Then "Create New Package popup" should be visible

    When user enters a random "package name" value with constraint "max_length=90"
    And user confirms package creation
    Then user should be on "/pro/marketplace-packages/create"

    When user enters a random "headline" value with constraint "non_empty"
    And user enters a random "description" value with constraint "non_empty"
    Then required input state should be valid for progression

    When user clicks the "Edit image" action
    Then the upload interaction surface should be opened
    And the upload interaction surface should be classified as "native_chooser"
    When user selects a random valid file from "MARKETPLACE_UPLOAD_DIR"
    Then the UI should confirm the uploaded file was received
    And "uploaded image preview in hero image area" should be visible

    When user opens "Package Pricing"
    Then "Package Pricing popup" should be visible
    When user applies valid configuration values
    And user confirms the configuration update
    Then "configured price visible on editor" should be visible

    When user performs the critical action "Publish Package"
    Then "publish success message" should be visible
    And the system should show the end-state "published state via Live badge or Unpublish action"

  Scenario: Prevent publish when image upload is missing
    Given user is on "/pro/marketplace-packages/create"
    And one required precondition for "Publish Package" is intentionally not satisfied
    When user attempts to perform the critical action "Publish Package"
    Then the system should prevent progression
    And "publish blocked state or validation message" should be visible
    And the success oracle for "Publish Package" should not be visible
