"""State definitions for the ReguGraph-UAE LangGraph Agentic Workflow."""
from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


class ContractClause(BaseModel):
    clause_type: str = Field(description="Type of clause: e.g. Early Settlement, Tenure, Fee, DBR, Interest")
    contract_statement: str = Field(description="Exact phrase or provision in contract")
    extracted_value: Any = Field(description="Numerical or structured value")
    borrower_impact: str = Field(default="")


class ComplianceFinding(BaseModel):
    checkpoint_name: str
    status: str = Field(description="'COMPLIANT', 'VIOLATION', 'WARNING', or 'REFUSAL'")
    contract_provision: str
    statutory_rule: str
    legal_citation: str
    explanation: str
    excess_financial_impact_aed: float = 0.0
    required_remediation: str = ""
    is_grounded: bool = True
    grounding_confidence: float = 1.0


class AuditState(TypedDict):
    """The central state dictionary passed between all LangGraph nodes."""
    contract_text: str
    contract_title: str
    borrower_income: float
    loan_amount: float
    loan_type: str
    extracted_clauses: List[Dict[str, Any]]
    retrieved_regulations: Dict[str, List[Dict[str, Any]]]
    math_validations: Dict[str, Any]
    compliance_findings: List[Dict[str, Any]]
    citation_verifications: List[Dict[str, Any]]
    overall_status: str
    refusal_triggered: bool
    refusal_reason: str
    executive_summary: str
    action_plan: List[str]
    execution_trace: List[Dict[str, str]]
