Feature: Marketplace Login and navigate to package

Browser basic authentication is provided at runtime via BASIC_AUTH_USER and BASIC_AUTH_PASS.
Credentials to login are provided at runtime via TEST_EMAIL and TEST_PASSWORD.
Upload fixtures are provided at runtime via MARKETPLACE_UPLOAD_DIR.

  Background:
    Given user is on Web platform https://landing-stg.everfit.io/pro/login
    And the web application is accessible with browser basic authentication
    And user has valid coach credentials provided at runtime
    And browser is configured for optimal performance

  Scenario: Marketplace Login success to preview page
    When user opens the web application with runtime basic auth credentials
    And user logs in successfully with valid "coach" credentials provided at runtime
    Then user should be redirected to the dashboard at "/pro/preview"
    And page should be fully loaded with navigation sidebar visible

  Scenario: Create and publish a new package from marketplace packages page
    When user opens the web application with runtime basic auth credentials
    And user logs in successfully with valid "coach" credentials provided at runtime
    Then user should be redirected to the dashboard at "/pro/preview"
    And page should be fully loaded with navigation sidebar visible

    When user clicks on "Package" menu item in sidebar navigation
    Then user should navigate to "/pro/marketplace-packages"
    And packages table should be displayed with package data

    When user clicks the "Create package" button
    Then the "Create New Package" popup should be displayed
    When user enters a random package name with 90 characters
    And user clicks the "Create New" button
    Then user should navigate to "/pro/marketplace-packages/create"

    When user enters a random headline
    And user enters a random description
    And user clicks the "Edit image" button
    And user uploads any image from the runtime upload directory
    And user clicks the package pricing section
    Then the "Package Pricing" popup should be displayed
    When user sets a random package price
    And user clicks the "Update Pricing" button
    And user clicks the "Publish Package" button
    Then the package should be published successfully
