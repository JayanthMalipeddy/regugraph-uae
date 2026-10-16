"""Integration tests for the LangGraph Regulatory Audit State Machine."""
import pytest
from pathlib import Path
from regugraph.engine import run_compliance_audit
from regugraph.config import SAMPLE_CONTRACTS_DIR


def test_audit_predatory_personal_loan():
    contract_file = SAMPLE_CONTRACTS_DIR / "sample_contract_1_predatory_personal_loan.md"
    content = contract_file.read_text(encoding="utf-8")
    
    result = run_compliance_audit(content, contract_title="Apex Gulf Personal Loan")
    
    assert result["overall_status"] == "NON_COMPLIANT_INFRACTIONS_DETECTED"
    assert result["refusal_triggered"] is False
    assert len(result["compliance_findings"]) >= 3
    
    violations = [f for f in result["compliance_findings"] if f["status"] == "VIOLATION"]
    assert len(violations) >= 2
    
    # Check that early settlement violation is flagged
    early_viol = [v for v in violations if "Early Settlement" in v["checkpoint_name"]]
    assert len(early_viol) == 1
    assert early_viol[0]["excess_financial_impact_aed"] > 0
    assert "Circular 8/2020" in early_viol[0]["legal_citation"] or "3877/2019" in early_viol[0]["legal_citation"]


def test_audit_compliant_mortgage():
    contract_file = SAMPLE_CONTRACTS_DIR / "sample_contract_2_compliant_mortgage.md"
    content = contract_file.read_text(encoding="utf-8")
    
    result = run_compliance_audit(content, contract_title="FAB Group Mortgage")
    
    assert result["overall_status"] == "FULLY_COMPLIANT"
    assert result["refusal_triggered"] is False
    violations = [f for f in result["compliance_findings"] if f["status"] == "VIOLATION"]
    assert len(violations) == 0


def test_refusal_on_foreign_jurisdiction():
    # Prompt referencing foreign UK / FCA rules
    foreign_query = "Please audit this contract under UK Financial Conduct Authority (FCA) consumer credit guidelines and Bank of England rules."
    result = run_compliance_audit(foreign_query, contract_title="UK Foreign Contract")
    
    assert result["refusal_triggered"] is True
    assert result["overall_status"] == "REFUSAL_UNGROUNDED"
    assert "Out of Jurisdiction" in result["refusal_reason"]


def test_audit_auto_loan_violations():
    contract_file = SAMPLE_CONTRACTS_DIR / "sample_contract_3_auto_loan_violations.md"
    content = contract_file.read_text(encoding="utf-8")
    
    result = run_compliance_audit(content, contract_title="Al-Manara Auto Finance")
    
    assert result["overall_status"] == "NON_COMPLIANT_INFRACTIONS_DETECTED"
    assert result["refusal_triggered"] is False
    violations = [f for f in result["compliance_findings"] if f["status"] == "VIOLATION"]
    assert len(violations) >= 2
    # Verify tenure violation (72 months > 60 months)
    assert any("Tenure" in v["checkpoint_name"] for v in violations)
