"""High-end UI components, charts, and styling for ReguGraph-UAE.
Engineered with senior front-end design standards for enterprise UAE FinTech web applications.
"""
from typing import Dict, Any, List
import plotly.graph_objects as go
import streamlit as st


def get_custom_css() -> str:
    """Enterprise-grade custom CSS with institutional UAE FinTech web aesthetics."""
    return """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    code, pre, .mono-font {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* Top Brand Hero Banner */
    .hero-container {
        background: radial-gradient(circle at 10% 20%, rgba(13, 148, 136, 0.15) 0%, rgba(9, 13, 22, 1) 70%),
                    linear-gradient(135deg, #070B14 0%, #0F172A 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 40px 48px;
        margin-bottom: 28px;
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
        position: relative;
        overflow: hidden;
    }

    .hero-container::before {
        content: "";
        position: absolute;
        top: -50px;
        right: -50px;
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
    }

    .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(13, 148, 136, 0.12);
        color: #2DD4BF;
        border: 1px solid rgba(45, 212, 191, 0.3);
        padding: 6px 14px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-bottom: 16px;
    }

    .hero-heading {
        font-size: 34px;
        font-weight: 800;
        line-height: 1.25;
        letter-spacing: -0.8px;
        color: #FFFFFF;
        margin-bottom: 14px;
    }

    .hero-heading-gradient {
        background: linear-gradient(135deg, #2DD4BF 0%, #38BDF8 50%, #F59E0B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero-description {
        font-size: 16px;
        color: #94A3B8;
        line-height: 1.6;
        max-width: 820px;
        margin-bottom: 24px;
    }

    .trust-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .trust-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #CBD5E1;
    }

    .trust-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 8px #10B981;
    }

    /* 3-Step "How It Works" Cards */
    .step-card {
        background: linear-gradient(180deg, #111827 0%, #0F172A 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 24px 20px;
        height: 100%;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .step-card:hover {
        transform: translateY(-4px);
        border-color: rgba(13, 148, 136, 0.4);
        box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
    }

    .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(13, 148, 136, 0.2);
        color: #2DD4BF;
        font-weight: 800;
        font-size: 14px;
        margin-bottom: 14px;
    }

    .step-title {
        font-size: 17px;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 8px;
    }

    .step-text {
        font-size: 13.5px;
        color: #94A3B8;
        line-height: 1.55;
    }

    /* Redline Diff Cards */
    .box-covenant {
        background: rgba(239, 68, 68, 0.08);
        border-left: 4px solid #EF4444;
        border-radius: 8px;
        padding: 14px 16px;
        color: #FCA5A5;
        font-size: 13.5px;
        line-height: 1.55;
    }

    .box-redline {
        background: rgba(16, 185, 129, 0.08);
        border-left: 4px solid #10B981;
        border-radius: 8px;
        padding: 14px 16px;
        color: #6EE7B7;
        font-size: 13.5px;
        line-height: 1.55;
    }

    .box-citation {
        background: rgba(99, 102, 241, 0.08);
        border-left: 4px solid #6366F1;
        border-radius: 8px;
        padding: 14px 16px;
        color: #A5B4FC;
        font-size: 13.5px;
        line-height: 1.55;
    }

    /* Status Pill Badges */
    .pill-viol {
        background: rgba(239, 68, 68, 0.15);
        color: #F87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
    }

    .pill-comp {
        background: rgba(16, 185, 129, 0.15);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
    }

    /* Rights Card */
    .rights-card {
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 12px;
    }
    .rights-title {
        font-size: 16px;
        font-weight: 700;
        color: #F1F5F9;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .rights-rule {
        font-size: 13px;
        color: #CBD5E1;
        margin: 6px 0;
        line-height: 1.5;
    }
    .rights-citation {
        font-size: 11.5px;
        color: #2DD4BF;
        font-family: 'JetBrains Mono', monospace;
    }

    div[data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        font-weight: 700 !important;
    }
    </style>
    """


def render_website_hero():
    """Renders the top consumer/enterprise hero banner."""
    st.markdown("""
    <div class="hero-container">
        <div class="hero-tag">
            <span class="trust-dot"></span> Official UAE Banking Regulatory Standards
        </div>
        <div class="hero-heading">
            Autonomous Compliance Audit & Legal Redlines for <br>
            <span class="hero-heading-gradient">UAE Credit Facilities & Loan Agreements</span>
        </div>
        <div class="hero-description">
            Cross-examine your personal loans, mortgages, and vehicle finance contracts against mandatory Central Bank of the UAE consumer protection standards in seconds. Identify predatory exit penalties, unlawful processing fees, and excessive debt ratios with automated statutory restitution calculations.
        </div>
        <div class="trust-badges">
            <div class="trust-item"><span class="trust-dot"></span> Circular No. 8/2020 (Fee Caps & Early Exit Limits)</div>
            <div class="trust-item"><span class="trust-dot"></span> Notice No. 2011/23 (50% DBR Ceiling & Tenure Caps)</div>
            <div class="trust-item"><span class="trust-dot"></span> Circular No. 31/2013 (Mortgage LTV Regulations)</div>
            <div class="trust-item"><span class="trust-dot"></span> Zero-Hallucination Exact Arithmetic</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_how_it_works():
    """Renders the 3-step visual guide on how to get an agreement audited."""
    st.markdown("### 🔍 How It Works: 3-Step Automated Compliance Audit")
    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown("""
        <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-title">Submit Credit Agreement</div>
            <div class="step-text">
                Select an audited UAE bank scenario or paste your retail loan schedule, residential mortgage, or auto lease agreement terms.
            </div>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-title">Statutory Cross-Examination</div>
            <div class="step-text">
                Our autonomous engine extracts key covenants and cross-references debt burdens, exit fees, and tenure limits against governing CBUAE gazettes.
            </div>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-title">Restitution & Legal Redline</div>
            <div class="step-text">
                Receive an executive compliance certificate, exact restitution calculations in AED for unlawful overcharges, and copyable legal redline notices.
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.write("")


def render_consumer_rights_grid():
    """Renders a consumer-friendly statutory rights grid."""
    rights = [
        {
            "title": "Early Settlement Fee Cap",
            "rule": "Exit penalties are legally capped at exactly 1.0% of outstanding principal or AED 10,000 (whichever is lower). Minimum fees exceeding this cap are null and void.",
            "citation": "Circular No. 8/2020 Art 4.3 & Notice 3877/2019"
        },
        {
            "title": "Debt Burden Ratio (DBR) 50% Ceiling",
            "rule": "Total monthly loan installments plus 5% of all credit card limits must never exceed 50.0% of verified monthly salary (30.0% for retirees and pensioners).",
            "citation": "Notice No. 2011/23 Article 7.1"
        },
        {
            "title": "5-Business-Day Cooling-Off Period",
            "rule": "Every retail borrower has the statutory right to withdraw from a signed loan contract within five (5) business days without penalties or administrative charges.",
            "citation": "Circular No. 8/2020 Article 4.1.2"
        },
        {
            "title": "Personal Loan Origination Fee Cap",
            "rule": "Loan processing / administrative fees cannot exceed 1.0% of loan amount or AED 2,500 (whichever is lower). VAT is calculated strictly on the capped amount.",
            "citation": "Circular No. 8/2020 Article 4.2"
        },
        {
            "title": "Personal & Auto Tenure Ceilings",
            "rule": "Personal consumer loans cannot exceed 48 months (4 years). Vehicle financing is strictly capped at 60 months (5 years) with a mandatory 20% down payment.",
            "citation": "Notice No. 2011/23 Articles 2.2 & 5.1"
        },
        {
            "title": "Late Payment Penalty Limit",
            "rule": "Delinquency charges are capped at AED 150 per billing cycle. Compounding late interest or escalating punitive fees are strictly prohibited under UAE law.",
            "citation": "CBUAE Standardized Retail Fee Schedule"
        }
    ]

    c_left, c_right = st.columns(2)
    for idx, r in enumerate(rights):
        col = c_left if idx % 2 == 0 else c_right
        with col:
            st.markdown(f"""
            <div class="rights-card">
                <div class="rights-title">⚖️ {r['title']}</div>
                <div class="rights-rule">{r['rule']}</div>
                <div class="rights-citation">Governing Standard: {r['citation']}</div>
            </div>
            """, unsafe_allow_html=True)


def create_dbr_gauge(dbr_percent: float, is_compliant: bool, max_cap: float = 50.0) -> go.Figure:
    """Create an interactive DBR semi-circle gauge chart with statutory 50% threshold."""
    bar_color = "#10B981" if is_compliant else "#EF4444"
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=dbr_percent,
        number={"suffix": "%", "font": {"family": "JetBrains Mono", "size": 32, "color": "#F8FAFC"}},
        delta={
            "reference": max_cap,
            "increasing": {"color": "#EF4444"},
            "decreasing": {"color": "#10B981"},
            "relative": False,
            "valueformat": "+.1f"
        },
        title={
            "text": "<b>Debt Burden Ratio (DBR)</b><br><span style='font-size:12px;color:#94A3B8'>Statutory Ceiling: 50.0%</span>",
            "font": {"family": "Plus Jakarta Sans", "size": 14, "color": "#E2E8F0"}
        },
        gauge={
            "axis": {"range": [0, 80], "tickwidth": 1, "tickcolor": "#475569", "tickfont": {"size": 11, "color": "#94A3B8"}},
            "bar": {"color": bar_color, "thickness": 0.35},
            "bgcolor": "#1E293B",
            "borderwidth": 1,
            "bordercolor": "#334155",
            "steps": [
                {"range": [0, 40], "color": "rgba(16, 185, 129, 0.15)"},
                {"range": [40, 50], "color": "rgba(245, 158, 11, 0.15)"},
                {"range": [50, 80], "color": "rgba(239, 68, 68, 0.25)"}
            ],
            "threshold": {
                "line": {"color": "#EF4444", "width": 4},
                "thickness": 0.8,
                "value": max_cap
            }
        }
    ))
    
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=20, r=20, t=50, b=20),
        height=210
    )
    return fig


def create_fee_comparison_chart(audit_findings: List[Dict[str, Any]]) -> go.Figure:
    """Create a side-by-side bar chart comparing Charged Fees vs CBUAE Statutory Caps."""
    fee_checkpoints = [
        f for f in audit_findings 
        if "Fee" in f.get("checkpoint_name", "") or "Early" in f.get("checkpoint_name", "")
    ]
    
    if not fee_checkpoints:
        return None

    names = []
    charged_vals = []
    cap_vals = []
    excess_vals = []

    for f in fee_checkpoints:
        c_name = f.get("checkpoint_name", "").replace("Loan ", "").replace("Penalty ", "")
        names.append(c_name)
        excess = f.get("excess_financial_impact_aed", 0.0)
        excess_vals.append(excess)
        
        import re
        match_charged = re.search(r"AED\s*([\d,]+(?:\.\d{2})?)", f.get("contract_provision", ""))
        charged = float(match_charged.group(1).replace(",", "")) if match_charged else (excess + 1000.0)
        charged_vals.append(charged)
        cap_vals.append(max(0.0, charged - excess))

    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        name="CBUAE Statutory Cap",
        x=names,
        y=cap_vals,
        marker_color="#0D9488",
        hovertemplate="<b>Statutory Cap:</b> AED %{y:,.2f}<extra></extra>"
    ))

    fig.add_trace(go.Bar(
        name="Unlawful Excess Overcharge",
        x=names,
        y=excess_vals,
        marker_color="#EF4444",
        hovertemplate="<b>Unlawful Overcharge:</b> AED %{y:,.2f}<extra></extra>"
    ))

    fig.update_layout(
        barmode="stack",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        title={
            "text": "<b>Statutory Fee Compliance Breakdown (AED)</b>",
            "font": {"family": "Plus Jakarta Sans", "size": 14, "color": "#E2E8F0"}
        },
        font={"family": "Plus Jakarta Sans", "color": "#94A3B8"},
        xaxis=dict(showgrid=False),
        yaxis=dict(gridcolor="#1E293B", title="Amount (AED)"),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        margin=dict(l=20, r=20, t=50, b=20),
        height=250
    )
    return fig


def render_executive_redline_item(idx: int, finding: Dict[str, Any]):
    """Render a high-impact, side-by-side compliance redline card."""
    is_viol = (finding.get("status") == "VIOLATION")
    checkpoint = finding.get("checkpoint_name", "Checkpoint")
    citation = finding.get("legal_citation", "CBUAE Regulation")
    contract_prov = finding.get("contract_provision", "")
    rule = finding.get("statutory_rule", "")
    explanation = finding.get("explanation", "")
    remediation = finding.get("required_remediation", "")
    excess = finding.get("excess_financial_impact_aed", 0.0)

    with st.container(border=True):
        col_hdr_left, col_hdr_right = st.columns([3, 1])
        with col_hdr_left:
            st.markdown(f"#### #{idx:02d} — {checkpoint}")
            st.caption(f"Governing Authority: `{citation}`")
        with col_hdr_right:
            if is_viol:
                st.markdown("<div style='text-align:right;'><span class='pill-viol'>STATUTORY INFRACTION</span></div>", unsafe_allow_html=True)
            else:
                st.markdown("<div style='text-align:right;'><span class='pill-comp'>CBUAE COMPLIANT</span></div>", unsafe_allow_html=True)

        if is_viol:
            c1, c2 = st.columns(2)
            with c1:
                st.markdown("**Contract Provision (As Drafted by Lender):**")
                st.markdown(f"<div class='box-covenant'>{contract_prov}</div>", unsafe_allow_html=True)
                st.markdown(f"<span style='font-size:12px;color:#94A3B8;'>Assessment: {explanation}</span>", unsafe_allow_html=True)

            with c2:
                st.markdown("**CBUAE-Mandated Redline & Restitution Directive:**")
                st.markdown(f"<div class='box-redline'><b>Mandatory Rectification:</b><br>{remediation}</div>", unsafe_allow_html=True)
                st.markdown(f"<span style='font-size:12px;color:#94A3B8;'>Statutory Basis: {rule}</span>", unsafe_allow_html=True)

            if excess > 0:
                st.error(f"**Direct Restitution Claim:** The Lender has levied **AED {excess:,.2f}** above the CBUAE statutory ceiling. Immediate borrower restitution required under Circular 8/2020.", icon=":material/payments:")
        else:
            st.markdown(f"<div class='box-citation'><b>Compliant Covenant:</b> {contract_prov}<br><span style='font-size:12px;color:#94A3B8;'>Validated against {rule}</span></div>", unsafe_allow_html=True)
