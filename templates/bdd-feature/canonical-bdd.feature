# CANONICAL BDD FEATURE TEMPLATE
# Purpose:
# - Use this as the default template for automation-ready `.feature` files.
# - Keep the `.feature` file as the source of truth for user intent, runtime needs, and success oracles.
# - Prefer filling these protocol comments rather than scattering critical context across README/docs/chat.
#
# AUTHORING RULES
# - Keep comments short and machine-readable.
# - Every critical end-state must have a concrete oracle.
# - If a flow uses upload, modal, iframe, loading, redirect, or alert states, name them explicitly.
# - Never place raw secrets in this file unless runtime-only usage is explicitly allowed by the workflow.
# - Prefer runtime env keys for credentials, tokens, upload directories, and account data.
#
# SECTION GUIDE
# - RUNTIME CONTRACT: environment, auth, runtime inputs, roles
# - DATA CONTRACT: randomization, constraints, fixtures, cleanup behavior
# - CRITICAL ORACLES: success proof for each important end-state
# - FLOW NOTES: intermediate states or business preconditions that affect automation
#
# STATUS VOCABULARY FOR ORACLE THINKING
# - observable: UI or route state can prove success directly
# - runtime-verifiable: needs real execution to prove
# - human-review: business outcome exists but current oracle is incomplete

@area:<area>
@platform:web
@priority:<critical|high|medium>
@runtime:<live|staging|mocked>
Feature: <Clear user-visible feature name>

  # RUNTIME CONTRACT
  # start_url: https://example.test/path
  # base_url: https://example.test
  # auth.basic.browser: <none|required>
  # auth.basic.user_env: <BASIC_AUTH_USER>
  # auth.basic.pass_env: <BASIC_AUTH_PASS>
  # auth.app.mode: <login_form|token|storage_state|none>
  # auth.app.email_env: <TEST_EMAIL>
  # auth.app.pass_env: <TEST_PASSWORD>
  # auth.app.role: <coach|admin|member|other>
  # runtime.upload_dir_env: <UPLOAD_DIR_ENV>
  # runtime.seed_data_env: <OPTIONAL_ENV_KEY>
  # runtime.notes: <runtime-only credentials allowed / env only / no secrets in file>
  #
  # DATA CONTRACT
  # data.entity_name: random, max_length=<n>, charset=<ascii|unicode|slug>
  # data.headline: random, non_empty=true
  # data.description: random, non_empty=true
  # data.price: random_integer, min=<n>, max=<n>, currency=<USD|GBP|EUR|...>
  # data.upload_file: any existing image from <UPLOAD_DIR_ENV>, extensions=.png|.jpg|.jpeg
  # data.cleanup: <none|delete_created_entity|mark_for_review>
  #
  # CRITICAL ORACLES
  # oracle.login_success: url=<path> and <stable_ui_signal>
  # oracle.create_success: url=<path> or <toast_or_row_signal>
  # oracle.upload_success: <preview|thumbnail|file_name|image_replaced> visible in <container>
  # oracle.pricing_saved: <modal_closed_and_value_visible|toast_visible|summary_updated>
  # oracle.publish_success: <toast_text|status_badge|redirect_pattern|new_action_visible>
  #
  # FLOW NOTES
  # flow.loading_state: <spinner|skeleton|none|unknown>
  # flow.modal_state: <dialog_name or none>
  # flow.native_chooser: <yes|no>
  # flow.iframe_presence: <none|decorative|blocking|interaction_surface>
  # flow.alerts_or_banners: <none|named alert behavior>
  # flow.publish_preconditions: <fields/image/pricing/approval/etc>

  Background:
    Given user starts at "<START_URL>"
    And the application base URL is "<BASE_URL>"
    And browser basic authentication is <required_or_not_required>
    And user has valid runtime credentials for role "<ROLE>"
    And required runtime inputs are available
    And browser is configured for stable automation

  Scenario: <Navigation or entry happy path>
    When user opens the application with the required runtime authentication
    And user signs in with valid runtime credentials
    Then user should be on "<EXPECTED_PATH>"
    And the page should be fully loaded
    And "<PRIMARY_STABLE_UI_SIGNAL>" should be visible

  Scenario: <Primary business flow with critical end-state>
    Given user is authenticated and starts from "<READY_PATH>"
    And the page should be fully loaded

    When user opens "<TARGET_AREA_OR_ROUTE>"
    Then user should be on "<TARGET_PATH>"
    And "<AREA_READY_SIGNAL>" should be visible

    When user starts creating a new "<ENTITY_NAME>"
    Then "<CREATE_ENTRY_SIGNAL>" should be visible

    When user enters a random "<ENTITY_NAME>" value with constraint "<CONSTRAINT_REF>"
    And user enters required primary details
    Then required input state should be valid for progression

    # Use this block only if the flow has upload behavior.
    When user clicks the "<VISIBLE_UPLOAD_TRIGGER>" action
    Then the upload interaction surface should be opened
    And the upload interaction surface should be classified as "<modal|native_chooser|hidden_input|dropzone>"
    When user selects a random valid file from "<UPLOAD_DIR_ENV>"
    Then the UI should confirm the uploaded file was received
    And "<UPLOAD_SUCCESS_SIGNAL>" should be visible

    # Use this block only if the flow has pricing or nested configuration.
    When user opens "<CONFIG_SECTION_NAME>"
    Then "<CONFIG_SURFACE_SIGNAL>" should be visible
    When user applies valid configuration values
    And user confirms the configuration update
    Then "<CONFIG_SUCCESS_SIGNAL>" should be visible

    When user performs the critical action "<CRITICAL_ACTION>"
    Then "<CRITICAL_SUCCESS_SIGNAL>" should be visible
    And the system should show the end-state "<END_STATE_SIGNAL>"

  Scenario: <Negative or guarded critical path>
    Given user is on "<READY_PATH>"
    And one required precondition for "<CRITICAL_ACTION>" is intentionally not satisfied
    When user attempts to perform the critical action "<CRITICAL_ACTION>"
    Then the system should prevent progression
    And "<BLOCKING_SIGNAL>" should be visible
    And the success oracle for "<CRITICAL_ACTION>" should not be visible

  # AUTHOR CHECKLIST BEFORE USING THIS FILE
  # - Replace every <PLACEHOLDER>.
  # - Keep one oracle per critical outcome.
  # - If success depends on upload, add upload success oracle before publish oracle.
  # - If success depends on modal/iframe/loading/alert states, name them in FLOW NOTES or steps.
  # - If a step is business-critical, end it with a user-observable Then/And proof.
