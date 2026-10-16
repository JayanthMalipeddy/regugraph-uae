export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
  chroma: {
    host: string;
    port: number;
    connected: boolean;
    chunk_count: number;
    collection_name: string;
  };
  statutory_rules: {
    dbr_standard_cap: string;
    dbr_pensioner_cap: string;
    early_settlement_cap: string;
    personal_tenure_cap: string;
    auto_tenure_cap: string;
    mortgage_tenure_cap: string;
  };
}

export interface ContractScenario {
  id: string;
  filename: string;
  title: string;
  loan_type: string;
  summary: string;
  severity: string;
  expected_restitution_aed: number;
  contract_text: string;
}

export interface ExtractedClause {
  clause_type: string;
  contract_statement: string;
  extracted_value: any;
  borrower_impact?: string;
}

export interface ComplianceFinding {
  checkpoint_name: string;
  status: 'COMPLIANT' | 'VIOLATION' | 'WARNING' | 'REFUSAL';
  contract_provision: string;
  statutory_rule: string;
  legal_citation: string;
  explanation: string;
  excess_financial_impact_aed: number;
  required_remediation: string;
  is_grounded: boolean;
  grounding_confidence: number;
}

export interface AuditResponse {
  contract_title: string;
  overall_status: string;
  refusal_triggered: boolean;
  refusal_reason: string;
  total_restitution_due_aed: number;
  total_violations: number;
  total_warnings: number;
  total_compliant_checkpoints: number;
  executive_summary: string;
  extracted_clauses: ExtractedClause[];
  compliance_findings: ComplianceFinding[];
  math_validations: Record<string, any>;
  action_plan: string[];
  execution_trace: { node: string; description: string }[];
  latency_ms: number;
}

export interface DBRCalculationResponse {
  gross_monthly_salary_aed: number;
  monthly_commitment_breakdown: {
    personal_emi_aed: number;
    auto_emi_aed: number;
    mortgage_emi_aed: number;
    credit_card_5pct_commitment_aed: number;
    other_obligations_aed: number;
    total_monthly_commitment_aed: number;
  };
  dbr_percent: number;
  max_statutory_dbr_cap_percent: number;
  is_compliant: boolean;
  headroom_aed: number;
  violation_margin_percent: number;
  is_pensioner: boolean;
  statutory_citation: string;
}

export interface EarlySettlementResponse {
  outstanding_principal_aed: number;
  charged_fee_amount_aed: number;
  statutory_cap_amount_aed: number;
  is_compliant: boolean;
  excess_charged_aed: number;
  refund_due_aed: number;
  rule_cited: string;
  formal_demand_letter: string;
}

export interface MortgageLTVResponse {
  property_value_aed: number;
  is_uae_national: boolean;
  is_first_home: boolean;
  is_off_plan: boolean;
  max_ltv_percent: number;
  max_financing_amount_aed: number;
  minimum_downpayment_aed: number;
  regulatory_rule: string;
  max_mortgage_tenure_years: number;
  max_mortgage_tenure_months: number;
}

export interface SearchResponse {
  query: string;
  answer: string;
  citation: string;
  refusal_triggered: boolean;
  refusal_category: string;
  retrieved_chunks: {
    content: string;
    circular_ref: string;
    article_header: string;
    rrf_score: number;
  }[];
  latency_ms: number;
}

export interface RegulationDocument {
  id: string;
  circular_ref: string;
  article_header: string;
  content_preview: string;
  full_content: string;
  token_count: number;
}
