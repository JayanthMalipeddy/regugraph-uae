"""High-end UI components, charts, and styling for ReguGraph-UAE.
Engineered with senior front-end design standards for enterprise institutional banking.
"""
from typing import Dict, Any, List
import plotly.graph_objects as go
import streamlit as st


def get_custom_css() -> str:
    """Enterprise-grade custom CSS with institutional UAE FinTech aesthetics."""
    return """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    code, pre, .mono-font {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* Top Brand Hero Banner */
    .brand-hero {
        background: linear-gradient(135deg, #091322 0%, #0d1e35 50%, #0a293e 100%);
        border: 1px solid rgba(13, 148, 136, 0.3);
        border-radius: 14px;
        padding: 24px 28px;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(13, 148, 136, 0.15);
    }
    .brand-title {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.5px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .brand-subtitle {
        font-size: 14px;
        color: #94A3B8;
        margin-top: 6px;
        line-height: 1.5;
    }
    .brand-badge {
        background: rgba(13, 148, 136, 0.2);
        color: #2DD4BF;
        border: 1px solid rgba(45, 212, 191, 0.4);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Redline Diff Cards */
    .redline-card {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 12px;
        padding: 18px;
        margin-bottom: 16px;
        transition: all 0.2s ease-in-out;
    }
    .redline-card:hover {
        border-color: rgba(13, 148, 136, 0.5);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .box-covenant {
        background: rgba(239, 68, 68, 0.08);
        border-left: 4px solid #EF4444;
        border-radius: 6px;
        padding: 12px 14px;
        color: #FCA5A5;
        font-size: 13px;
        line-height: 1.5;
    }

    .box-redline {
        background: rgba(16, 185, 129, 0.08);
        border-left: 4px solid #10B981;
        border-radius: 6px;
        padding: 12px 14px;
        color: #6EE7B7;
        font-size: 13px;
        line-height: 1.5;
    }

    .box-citation {
        background: rgba(99, 102, 241, 0.08);
        border-left: 4px solid #6366F1;
        border-radius: 6px;
        padding: 12px 14px;
        color: #A5B4FC;
        font-size: 13px;
        line-height: 1.5;
    }

    /* Status Pill Badges */
    .pill-viol {
        background: rgba(239, 68, 68, 0.2);
        color: #F87171;
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 700;
    }
    .pill-comp {
        background: rgba(16, 185, 129, 0.2);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 700;
    }

    /* Clean Card Container overrides */
    div[data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        font-weight: 700 !important;
    }
    </style>
    """


def create_dbr_gauge(dbr_percent: float, is_compliant: bool, max_cap: float = 50.0) -> go.Figure:
    """Create an interactive DBR semi-circle gauge chart with statutory 50% threshold."""
    bar_color = "#10B981" if is_compliant else "#EF4444"
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=dbr_percent,
        number={"suffix": "%", "font": {"family": "JetBrains Mono", "size": 34, "color": "#F8FAFC"}},
        delta={
            "reference": max_cap,
            "increasing": {"color": "#EF4444"},
            "decreasing": {"color": "#10B981"},
            "relative": False,
            "valueformat": "+.1f"
        },
        title={
            "text": "<b>Debt Burden Ratio (DBR)</b><br><span style='font-size:12px;color:#94A3B8'>CBUAE Statutory Limit: 50.0%</span>",
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
        height=220
    )
    return fig


def create_fee_comparison_chart(audit_findings: List[Dict[str, Any]]) -> go.Figure:
    """Create a side-by-side bar chart comparing Charged Fees vs CBUAE Statutory Caps."""
    fee_checkpoints = [
        f for f in audit_findings 
        if "Fee" in f.get("checkpoint_name", "") or "Early" in f.get("checkpoint_name", "")
    ]
    
    if not fee_checkpoints:
        # Default visual mock if clean
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
        
        # Parse or approximate charged amount
        import re
        match_charged = re.search(r"AED\s*([\d,]+(?:\.\d{2})?)", f.get("contract_provision", ""))
        charged = float(match_charged.group(1).replace(",", "")) if match_charged else (excess + 1000.0)
        charged_vals.append(charged)
        cap_vals.append(max(0.0, charged - excess))

    fig = go.Figure()
    
    # Statutory Cap Bar
    fig.add_trace(go.Bar(
        name="CBUAE Statutory Cap",
        x=names,
        y=cap_vals,
        marker_color="#0D9488",
        hovertemplate="<b>Statutory Cap:</b> AED %{y:,.2f}<extra></extra>"
    ))

    # Unlawful Excess Bar
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
        height=260
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
                st.markdown("<div style='text-align:right;'><span class='pill-viol'>STATUTORY VIOLATION</span></div>", unsafe_allow_html=True)
            else:
                st.markdown("<div style='text-align:right;'><span class='pill-comp'>CBUAE COMPLIANT</span></div>", unsafe_allow_html=True)

        if is_viol:
            c1, c2 = st.columns(2)
            with c1:
                st.markdown("**Contract Provision (As Drafted by Lender):**")
                st.markdown(f"<div class='box-covenant'>{contract_prov}</div>", unsafe_allow_html=True)
                st.markdown(f"<span style='font-size:12px;color:#94A3B8;'>Assessment: {explanation}</span>", unsafe_allow_html=True)

            with c2:
                st.markdown("**CBUAE Mandated Redline & Restitution Requirement:**")
                st.markdown(f"<div class='box-redline'><b>Mandatory Rectification:</b><br>{remediation}</div>", unsafe_allow_html=True)
                st.markdown(f"<span style='font-size:12px;color:#94A3B8;'>Statutory Basis: {rule}</span>", unsafe_allow_html=True)

            if excess > 0:
                st.error(f"**Financial Overcharge Detected:** The Lender has levied **AED {excess:,.2f}** above the CBUAE statutory ceiling. Immediate borrower refund required under Circular 8/2020.", icon=":material/payments:")
        else:
            st.markdown(f"<div class='box-citation'><b>Compliant Term:</b> {contract_prov}<br><span style='font-size:12px;color:#94A3B8;'>Verified against {rule}</span></div>", unsafe_allow_html=True)
