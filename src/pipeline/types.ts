export type SelectorConfidence = "high" | "medium" | "low";

export type LocatorEntry = {
  element_id: string;
  page_route: string;
  semantic_role: string | null;
  primary_selector: string;
  fallback_selectors: string[];
  confidence: SelectorConfidence;
  selector_reason: string;
  stability_flags: string[];
};

export type CoverageGap = {
  gap_id: string;
  type:
    | "route_not_found"
    | "auth_blocked"
    | "element_missing"
    | "dynamic_trigger_failed"
    | "weak_selector_only"
    | "environment_blocked"
    | "requires_human_review"
    | "intermediate_state_blocked";
  page_route: string | null;
  step_text: string | null;
  details: string;
};

export type InteractionPattern = {
  scenario_name: string;
  steps: Array<{
    step_text: string;
    intent:
      | "navigate"
      | "click"
      | "fill"
      | "upload"
      | "assert_url"
      | "assert_visible"
      | "other";
    page_route: string | null;
    target_element_id: string | null;
    notes?: string;
  }>;
};

export type CriticalOutcome = {
  scenario_name: string;
  step_text: string;
  status: "observed" | "blocked" | "unknown" | "requires_runtime_verification";
  oracle_type: string | null;
  observed_signal: string | null;
  evidence: string;
  confidence: SelectorConfidence;
};

export type PageInventoryEntry = {
  page_id: string;
  page_route: string;
  page_type: string | null;
  inspection_meta: Record<string, unknown>;
  notable_elements: string[];
  warnings: string[];
};

export type ContextBundle = {
  meta: {
    feature_file: string;
    feature_name: string;
    created_at: string;
    staging_base_url: string;
    start_path: string;
    auth: {
      browser_basic_auth: { enabled: boolean; user_env: string; pass_env: string };
      app_login: { enabled: boolean; email_env: string; pass_env: string; role_hint: string | null };
    };
    runtime_secrets_policy: "env_only";
  };
  page_inventory: PageInventoryEntry[];
  locator_map: LocatorEntry[];
  interaction_patterns: InteractionPattern[];
  coverage_gaps: CoverageGap[];
  critical_outcomes: CriticalOutcome[];
  integration_hints: string[];
  required_human_checkpoints: string[];
  recommended_test_utilities: string[];
  page_state_hints: Array<{
    page_route: string;
    state: "ready" | "transient_loading" | "auth_redirect" | "iframe_gate" | "blocking_alert" | "unknown";
    evidence: string;
  }>;
};
