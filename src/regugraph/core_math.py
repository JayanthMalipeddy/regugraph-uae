"""Deterministic financial math and CBUAE statutory calculation rules.
Zero hallucination: Exact arithmetic for regulatory enforcement.
"""
from dataclasses import dataclass
from typing import Dict, Any, List

from .config import (
    MAX_DBR_PERCENT,
    MAX_EARLY_SETTLEMENT_PCT,
    MAX_EARLY_SETTLEMENT_CAP_AED,
    MAX_PERSONAL_LOAN_TENURE,
    MAX_AUTO_LOAN_TENURE,
    MAX_MORTGAGE_TENURE,
    MAX_PERSONAL_PROCESSING_FEE_PCT,
    MAX_PERSONAL_PROCESSING_FEE_CAP_AED,
    MAX_LATE_FEE_CAP_AED
)


@dataclass
class DBRResult:
    dbr_percent: float
    is_compliant: bool
    monthly_commitment: float
    gross_salary: float
    headroom_aed: float
    violation_margin_percent: float


@dataclass
class FeeAuditResult:
    fee_type: str
    charged_amount: float
    statutory_cap_amount: float
    is_compliant: bool
    excess_charged_aed: float
    refund_due_aed: float
    rule_cited: str


def calculate_dbr(
    monthly_loan_installments: float,
    gross_monthly_salary: float,
    credit_card_limits: float = 0.0,
    other_debt_obligations: float = 0.0
) -> DBRResult:
    """Calculate Debt Burden Ratio (DBR) under CBUAE Notice 2011/23.
    Formula: (Monthly EMIs + 5% of Credit Card Limits + Other Obligations) / Gross Salary * 100
    """
    if gross_monthly_salary <= 0:
        raise ValueError("Gross monthly salary must be greater than zero.")
    
    card_commitment = credit_card_limits * 0.05
    total_monthly = monthly_loan_installments + card_commitment + other_debt_obligations
    dbr_pct = round((total_monthly / gross_monthly_salary) * 100, 2)
    
    max_allowable_commitment = gross_monthly_salary * (MAX_DBR_PERCENT / 100)
    headroom = round(max_allowable_commitment - total_monthly, 2)
    is_compliant = dbr_pct <= MAX_DBR_PERCENT
    violation_margin = round(dbr_pct - MAX_DBR_PERCENT, 2) if not is_compliant else 0.0

    return DBRResult(
        dbr_percent=dbr_pct,
        is_compliant=is_compliant,
        monthly_commitment=round(total_monthly, 2),
        gross_salary=round(gross_monthly_salary, 2),
        headroom_aed=headroom,
        violation_margin_percent=violation_margin
    )


def audit_early_settlement_fee(
    outstanding_principal: float,
    charged_fee_amount: float
) -> FeeAuditResult:
    """Audit early settlement penalty against CBUAE Notice 3877/2019 & Circular 8/2020 Art 4.3.
    Statutory Cap: Lower of 1.0% of outstanding principal or AED 10,000.
    """
    pct_cap = outstanding_principal * (MAX_EARLY_SETTLEMENT_PCT / 100.0)
    statutory_cap = min(pct_cap, MAX_EARLY_SETTLEMENT_CAP_AED)
    
    excess = max(0.0, charged_fee_amount - statutory_cap)
    is_compliant = charged_fee_amount <= (statutory_cap + 0.01)

    return FeeAuditResult(
        fee_type="Early Settlement Exit Fee",
        charged_amount=round(charged_fee_amount, 2),
        statutory_cap_amount=round(statutory_cap, 2),
        is_compliant=is_compliant,
        excess_charged_aed=round(excess, 2),
        refund_due_aed=round(excess, 2),
        rule_cited="CBUAE Circular 8/2020 Art 4.3 / Notice 3877/2019: Max 1% or AED 10,000 (lower of the two)"
    )


def audit_processing_fee(
    loan_amount: float,
    charged_fee: float,
    loan_type: str = "Personal Loan"
) -> FeeAuditResult:
    """Audit processing / origination fee against CBUAE Circular 8/2020 Art 4.2."""
    if "mortgage" in loan_type.lower():
        statutory_cap = min(loan_amount * 0.01, 5_000.0)
        rule = "CBUAE Circular 31/2013 Art 7.1: Max 1% of loan or AED 5,000 (lower)"
    else:
        statutory_cap = min(loan_amount * (MAX_PERSONAL_PROCESSING_FEE_PCT / 100.0), MAX_PERSONAL_PROCESSING_FEE_CAP_AED)
        rule = "CBUAE Circular 8/2020 Art 4.2: Max 1% of loan or AED 2,500 (lower)"

    excess = max(0.0, charged_fee - statutory_cap)
    is_compliant = charged_fee <= (statutory_cap + 0.01)

    return FeeAuditResult(
        fee_type=f"{loan_type} Processing Fee",
        charged_amount=round(charged_fee, 2),
        statutory_cap_amount=round(statutory_cap, 2),
        is_compliant=is_compliant,
        excess_charged_aed=round(excess, 2),
        refund_due_aed=round(excess, 2),
        rule_cited=rule
    )


def audit_late_payment_fee(charged_fee: float) -> FeeAuditResult:
    """Audit late payment penalty against CBUAE Fee Schedule."""
    statutory_cap = MAX_LATE_FEE_CAP_AED
    excess = max(0.0, charged_fee - statutory_cap)
    is_compliant = charged_fee <= statutory_cap

    return FeeAuditResult(
        fee_type="Late Payment Charge",
        charged_amount=round(charged_fee, 2),
        statutory_cap_amount=round(statutory_cap, 2),
        is_compliant=is_compliant,
        excess_charged_aed=round(excess, 2),
        refund_due_aed=round(excess, 2),
        rule_cited="CBUAE Standardized Retail Fee Schedule: Max AED 150 per cycle"
    )


def validate_tenure(tenure_months: int, loan_type: str) -> Dict[str, Any]:
    """Validate loan tenure against CBUAE statutory limits."""
    lt = loan_type.lower()
    if "personal" in lt:
        max_tenure = MAX_PERSONAL_LOAN_TENURE
        rule = "CBUAE Notice 2011/23 Art 2.2 (Max 48 months for Personal Loans)"
    elif "auto" in lt or "car" in lt or "vehicle" in lt:
        max_tenure = MAX_AUTO_LOAN_TENURE
        rule = "CBUAE Notice 2011/23 Art 5.1 (Max 60 months for Auto Loans)"
    elif "mortgage" in lt or "home" in lt:
        max_tenure = MAX_MORTGAGE_TENURE
        rule = "CBUAE Circular 31/2013 Art 6.1 (Max 300 months / 25 years for Mortgages)"
    else:
        max_tenure = MAX_PERSONAL_LOAN_TENURE
        rule = "CBUAE Default Personal Credit Standard"

    is_compliant = tenure_months <= max_tenure
    return {
        "tenure_months": tenure_months,
        "max_statutory_tenure_months": max_tenure,
        "is_compliant": is_compliant,
        "excess_months": max(0, tenure_months - max_tenure),
        "rule_cited": rule
    }
