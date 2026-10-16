"""Unit tests for core deterministic compliance math."""
import pytest
from regugraph.core_math import (
    calculate_dbr,
    audit_early_settlement_fee,
    audit_processing_fee,
    audit_late_payment_fee,
    validate_tenure
)


def test_dbr_compliant():
    # 5,000 EMI on 20,000 salary = 25% DBR
    res = calculate_dbr(monthly_loan_installments=5000, gross_monthly_salary=20000)
    assert res.is_compliant is True
    assert res.dbr_percent == 25.0
    assert res.headroom_aed == 5000.0


def test_dbr_violation():
    # 9,500 EMI + 5% of 20,000 card limit (1,000) on 15,000 salary = 10,500 / 15,000 = 70% DBR
    res = calculate_dbr(monthly_loan_installments=9500, gross_monthly_salary=15000, credit_card_limits=20000)
    assert res.is_compliant is False
    assert res.dbr_percent == 70.0
    assert res.violation_margin_percent == 20.0


def test_early_settlement_capped_at_1_percent():
    # Outstanding 200,000 AED -> 1% is 2,000 AED. Contract charges 5,000 AED (2.5%)
    res = audit_early_settlement_fee(outstanding_principal=200000, charged_fee_amount=5000)
    assert res.is_compliant is False
    assert res.statutory_cap_amount == 2000.0
    assert res.excess_charged_aed == 3000.0
    assert res.refund_due_aed == 3000.0


def test_early_settlement_capped_at_10k_ceiling():
    # Outstanding 2,000,000 AED -> 1% is 20,000 AED, but CBUAE statutory ceiling is 10,000 AED!
    # Contract charges 20,000 AED (1%)
    res = audit_early_settlement_fee(outstanding_principal=2000000, charged_fee_amount=20000)
    assert res.is_compliant is False
    assert res.statutory_cap_amount == 10000.0  # Capped at 10,000!
    assert res.refund_due_aed == 10000.0


def test_processing_fee_personal_loan_cap():
    # Loan 150,000 AED. 1% is 1,500 AED. Contract charges 4,500 AED.
    res = audit_processing_fee(loan_amount=150000, charged_fee=4500, loan_type="Personal Loan")
    assert res.is_compliant is False
    assert res.statutory_cap_amount == 1500.0
    assert res.refund_due_aed == 3000.0


def test_tenure_validation():
    # Personal loan 60 months violates 48m cap
    res = validate_tenure(tenure_months=60, loan_type="Personal Loan")
    assert res["is_compliant"] is False
    assert res["excess_months"] == 12

    # Mortgage 240 months complies with 300m cap
    res_mort = validate_tenure(tenure_months=240, loan_type="Mortgage Loan")
    assert res_mort["is_compliant"] is True
