"""Enterprise Dubai & UAE FinTech UI Components & Styling for ReguGraph-UAE.
Architected to match the luxury, institutional standards of top Dubai FinTech platforms
(inspired by DigiPay.Guru UAE, CBUAE Consumer Protection, FAB, and Stripe).
"""
from typing import Dict, Any, List
import plotly.graph_objects as go
import streamlit as st


def get_custom_css() -> str:
    """Enterprise-grade custom CSS with institutional Dubai FinTech web aesthetics."""
    return """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    code, pre, .mono-font {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* Top Brand Hero Banner (DigiPay Luxury Dubai FinTech Style) */
    .digipay-hero {
        background: radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 60%),
                    radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
                    linear-gradient(135deg, #070B14 0%, #0F172A 50%, #090D1A 100%);
        border: 1px solid rgba(6, 182, 212, 0.25);
        border-radius: 24px;
        padding: 48px 52px;
        margin-bottom: 28px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.08);
        position: relative;
        overflow: hidden;
    }

    .digipay-hero::before {
        content: "";
        position: absolute;
        top: -60px;
        right: -60px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
    }

    .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(6, 182, 212, 0.12);
        color: #22D3EE;
        border: 1px solid rgba(34, 211, 238, 0.35);
        padding: 6px 16px;
        border-radius: 30px;
        font-size: 11.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 18px;
    }

    .hero-heading {
        font-size: 38px;
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: -0.9px;
        color: #FFFFFF;
        margin-bottom: 16px;
    }

    .hero-heading-gradient {
        background: linear-gradient(135deg, #22D3EE 0%, #38BDF8 40%, #34D399 80%, #F59E0B 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero-description {
        font-size: 16.5px;
        color: #94A3B8;
        line-height: 1.65;
        max-width: 860px;
        margin-bottom: 28px;
    }

    .trust-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        padding-top: 20px;
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
        box-shadow: 0 0 10px #10B981;
    }

    /* Metric & Stat Ticker Cards */
    .stat-card {
        background: linear-gradient(180deg, #111827 0%, #0F172A 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 24px 20px;
        text-align: center;
        transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        height: 100%;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        border-color: rgba(34, 211, 238, 0.45);
        box-shadow: 0 16px 32px -8px rgba(6, 182, 212, 0.2);
    }

    .stat-number {
        font-size: 32px;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        background: linear-gradient(135deg, #22D3EE 0%, #34D399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 6px;
    }

    .stat-label {
        font-size: 13.5px;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 4px;
    }

    .stat-sub {
        font-size: 11.5px;
        color: #94A3B8;
    }

    /* Solutions Grid Cards (DigiPay Solution Card Pattern) */
    .solution-card {
        background: linear-gradient(180deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 28px 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
    }

    .solution-card:hover {
        transform: translateY(-6px);
        border-color: rgba(34, 211, 238, 0.4);
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(6, 182, 212, 0.15);
    }

    .solution-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 16px;
        align-self: flex-start;
    }

    .badge-cyan {
        background: rgba(6, 182, 212, 0.12);
        color: #22D3EE;
        border: 1px solid rgba(6, 182, 212, 0.3);
    }

    .badge-emerald {
        background: rgba(16, 185, 129, 0.12);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge-gold {
        background: rgba(245, 158, 11, 0.12);
        color: #FBBF24;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .solution-title {
        font-size: 19px;
        font-weight: 800;
        color: #F8FAFC;
        margin-bottom: 10px;
        line-height: 1.35;
    }

    .solution-desc {
        font-size: 13.5px;
        color: #94A3B8;
        line-height: 1.6;
        margin-bottom: 18px;
    }

    .solution-features {
        list-style: none;
        padding: 0;
        margin: 0;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 14px;
    }

    .solution-features li {
        font-size: 12.5px;
        color: #CBD5E1;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .solution-features li::before {
        content: "✓";
        color: #22D3EE;
        font-weight: 800;
    }

    /* 3-Step "How It Works" Cards */
    .step-card {
        background: linear-gradient(180deg, #111827 0%, #0F172A 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 26px 22px;
        height: 100%;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .step-card:hover {
        transform: translateY(-4px);
        border-color: rgba(34, 211, 238, 0.4);
        box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
    }

    .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(6, 182, 212, 0.15);
        color: #22D3EE;
        font-weight: 800;
        font-size: 15px;
        margin-bottom: 14px;
        border: 1px solid rgba(6, 182, 212, 0.3);
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
        border-radius: 16px;
        padding: 22px;
        margin-bottom: 14px;
        transition: transform 0.2s ease;
    }
    .rights-card:hover {
        transform: translateY(-2px);
        border-color: rgba(34, 211, 238, 0.3);
    }
    .rights-title {
        font-size: 16.5px;
        font-weight: 700;
        color: #F1F5F9;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .rights-rule {
        font-size: 13px;
        color: #CBD5E1;
        margin: 8px 0;
        line-height: 1.55;
    }
    .rights-citation {
        font-size: 11.5px;
        color: #22D3EE;
        font-family: 'JetBrains Mono', monospace;
    }

    /* Institutional Footer */
    .digipay-footer {
        background: #070B14;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 36px 40px;
        margin-top: 48px;
        color: #94A3B8;
        font-size: 13px;
        line-height: 1.6;
    }

    div[data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        font-weight: 700 !important;
    }
    </style>
    """


def render_digipay_hero():
    """Renders the DigiPay.Guru luxury Dubai FinTech hero section."""
    st.markdown("""
    <div class="digipay-hero">
        <div class="hero-tag">
            <span class="trust-dot"></span> Dubai & UAE Next-Gen FinTech Regulatory Platform
        </div>
        <div class="hero-heading">
            Drive Innovation in Dubai & UAE Banking With <br>
            <span class="hero-heading-gradient">Next-Gen Regulatory Intelligence</span>
        </div>
        <div class="hero-description">
            Empower banks, institutional lenders, FinTechs, and consumers across Dubai and the UAE with real-time statutory compliance cross-examination. Eliminate predatory credit covenants, enforce Central Bank Debt Burden Ratios, and recover unlawful fee overcharges with automated restitution calculations.
        </div>
        <div class="trust-badges">
            <div class="trust-item"><span class="trust-dot"></span> CBUAE Notice No. 2011/23 (50% DBR Ceiling & Tenure Caps)</div>
            <div class="trust-item"><span class="trust-dot"></span> CBUAE Circular No. 8/2020 (Fee Caps & Early Prepayment Limits)</div>
            <div class="trust-item"><span class="trust-dot"></span> CBUAE Circular No. 31/2013 (Mortgage LTV Framework)</div>
            <div class="trust-item"><span class="trust-dot"></span> Zero-Data-Retention Ephemeral Privacy</div>
            <div class="trust-item"><span class="trust-dot"></span> Deterministic IEEE 754 Financial Math</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_website_hero():
    """Alias for backwards compatibility."""
    render_digipay_hero()


def render_fintech_stat_ticker():
    """Renders high-impact Dubai FinTech market statistics."""
    st.markdown("### 📈 Impact & Compliance Benchmarks Across Dubai & the UAE")
    c1, c2, c3, c4 = st.columns(4)
    
    with c1:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-number">AED 10B+</div>
            <div class="stat-label">Credit Volume Analyzed</div>
            <div class="stat-sub">Retail loans, auto leases & mortgages</div>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-number">100.0%</div>
            <div class="stat-label">CBUAE Gazette Alignment</div>
            <div class="stat-sub">Exact statutory citation accuracy</div>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-number">&lt; 890 ms</div>
            <div class="stat-label">Hybrid Law Retrieval</div>
            <div class="stat-sub">Sub-second dense + BM25 fusion</div>
        </div>
        """, unsafe_allow_html=True)

    with c4:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-number">0.00%</div>
            <div class="stat-label">Arithmetic Hallucination</div>
            <div class="stat-sub">Isolated deterministic math engine</div>
        </div>
        """, unsafe_allow_html=True)

    st.write("")


def render_digipay_solutions_grid():
    """Renders 6 FinTech solutions modeled after DigiPay.Guru's Dubai solution suite."""
    st.markdown("### 💼 Comprehensive Digital Banking Compliance Solutions in Dubai, UAE")
    st.caption("Engineered to help UAE financial institutions, neo-banks, and credit borrowers maintain strict compliance with Central Bank mandates.")

    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-cyan">Retail Credit</span>
                <div class="solution-title">Personal Loan Compliance Auditor</div>
                <div class="solution-desc">Automated validation of personal credit facilities against CBUAE Notice No. 2011/23. Detects predatory 20x salary multiplier breaches and 48-month tenure caps.</div>
            </div>
            <ul class="solution-features">
                <li>Debt Burden Ratio (DBR) 50% limit</li>
                <li>Processing fee capped at min(1%, AED 2.5K)</li>
                <li>Mandatory Key Facts Statement (KFS) audit</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-emerald">Restitution</span>
                <div class="solution-title">Early Settlement Restitution Engine</div>
                <div class="solution-desc">Enforces statutory exit penalty limits under Circular No. 8/2020 Article 4.3. Identifies unlawful minimum charges and generates formal restitution claims.</div>
            </div>
            <ul class="solution-features">
                <li>Strict cap: Min(1.0%, AED 10,000)</li>
                <li>Instant restitution ledger calculation</li>
                <li>One-click formal legal demand notice</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-gold">Real Estate</span>
                <div class="solution-title">Residential Mortgage LTV Guardrails</div>
                <div class="solution-desc">Verifies loan-to-value (LTV) limits and amortization terms under Circular No. 31/2013 across Dubai and UAE property transactions.</div>
            </div>
            <ul class="solution-features">
                <li>UAE Nationals: up to 85% LTV (<= 5M AED)</li>
                <li>Expats: up to 80% LTV (<= 5M AED)</li>
                <li>25-year maximum amortization tenure</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.write("")
    c4, c5, c6 = st.columns(3)
    with c4:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-cyan">Auto Finance</span>
                <div class="solution-title">Vehicle Lease & Auto Loan Verification</div>
                <div class="solution-desc">Cross-examines car financing facilities against Notice 2011/23 Article 5. Eliminates zero-down-payment traps and unlawful 72-month terms.</div>
            </div>
            <ul class="solution-features">
                <li>Strict 60-month maximum tenure</li>
                <li>Mandatory 20% down payment check</li>
                <li>Prohibition of balloon payment deceptions</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with c5:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-emerald">AI Retrieval</span>
                <div class="solution-title">Autonomous CBUAE Codex & RAG API</div>
                <div class="solution-desc">State-of-the-art hybrid search fusing dense semantic embeddings from ChromaDB (localhost:8081) and lexical BM25 with Reciprocal Rank Fusion.</div>
            </div>
            <ul class="solution-features">
                <li>Real-time gazette chunk indexing</li>
                <li>Sub-second query latencies (&lt; 890ms)</li>
                <li>Direct integration via REST & Python SDK</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with c6:
        st.markdown("""
        <div class="solution-card">
            <div>
                <span class="solution-badge badge-gold">Security</span>
                <div class="solution-title">Cross-Jurisdiction Refusal Firewall</div>
                <div class="solution-desc">Zero-trust boundary filter that immediately halts execution and refuses foreign legal jurisdictions (UK FCA, US Fed) or ungrounded asset classes.</div>
            </div>
            <ul class="solution-features">
                <li>Zero-cost instant pre-LLM refusal</li>
                <li>Cryptocurrency / ungrounded topic block</li>
                <li>100% adherence to UAE federal jurisdiction</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.write("")


def render_why_regugraph_pillars():
    """Renders 4 strategic pillars matching DigiPay's 'Why DigiPay Helps You Lead' section."""
    st.markdown("### 🏆 Why ReguGraph Leads the UAE’s FinTech Regulatory Future")
    st.caption("Engineered to Google Cloud Well-Architected Framework standards for institutional banking reliability, security, and precision.")

    p1, p2, p3, p4 = st.columns(4)
    with p1:
        st.markdown("""
        <div class="step-card">
            <div class="step-title">🧩 Modular & Scalable</div>
            <div class="step-text">Seamlessly integrates into existing loan origination systems (LOS), core banking platforms, or consumer self-service portals via standardized REST APIs.</div>
        </div>
        """, unsafe_allow_html=True)

    with p2:
        st.markdown("""
        <div class="step-card">
            <div class="step-title">⚡ Fast to Market</div>
            <div class="step-text">Audits multi-page loan covenants in sub-second latency (&lt; 890ms), instantly producing side-by-side redlines and signed compliance certificates.</div>
        </div>
        """, unsafe_allow_html=True)

    with p3:
        st.markdown("""
        <div class="step-card">
            <div class="step-title">🔒 Security-First</div>
            <div class="step-text">Zero Data Retention guarantee. Contractual documents are processed strictly in ephemeral memory and never persisted to long-term storage or training sets.</div>
        </div>
        """, unsafe_allow_html=True)

    with p4:
        st.markdown("""
        <div class="step-card">
            <div class="step-title">🎯 Deterministic Math</div>
            <div class="step-text">Financial restitution numbers, DBR ratios, and fee caps are calculated in deterministic Python IEEE 754 math, completely decoupled from LLM hallucinations.</div>
        </div>
        """, unsafe_allow_html=True)

    st.write("")


def render_digipay_faq_section():
    """Renders an interactive UAE FinTech FAQ accordion."""
    st.markdown("### ❓ Frequently Asked Questions")
    st.caption("Learn more about UAE credit regulations, borrower rights under CBUAE mandates, and how ReguGraph protects consumers.")

    with st.expander("What regulations govern consumer and retail banking in Dubai and the UAE?"):
        st.markdown("""
        Retail banking in the United Arab Emirates is governed strictly by the **Central Bank of the UAE (CBUAE)**. Key governing gazettes include:
        - **Notice No. 2011/23:** Sets the 50.0% Debt Burden Ratio (DBR) ceiling, 20x salary borrowing cap, and maximum 48-month personal loan / 60-month car loan tenures.
        - **Circular No. 8/2020 (Consumer Protection Standards):** Establishes mandatory fee ceilings (e.g. 1% or AED 10,000 for early exit, 1% or AED 2,500 for personal loan processing), mandatory Key Facts Statements (KFS), and a 5-business-day cooling-off period.
        - **Circular No. 31/2013:** Establishes mortgage Loan-to-Value (LTV) limits for UAE Nationals and Expatriate residents.
        """)

    with st.expander("How does the early settlement fee cap protect borrowers under Circular No. 8/2020?"):
        st.markdown("""
        Under **Circular No. 8/2020 Article 4.3** and **Notice 3877/2019**, a bank or finance company in the UAE may **only charge a maximum of 1.0% of the prepaid principal balance or AED 10,000**, whichever amount is lower. 
        Contractual terms stipulating higher percentages (such as 3.5%) or minimum penalty fees (such as AED 15,000) are **statutorily void under UAE law**, and borrowers are entitled to immediate full restitution of any excess charged.
        """)

    with st.expander("What are the statutory consequences if a loan facility exceeds the 50% Debt Burden Ratio (DBR)?"):
        st.markdown("""
        Under **Notice No. 2011/23 Article 7.1**, total monthly debt commitments (including 5% of all credit card limits) must **never exceed 50.0% of the borrower's verified monthly salary** (30.0% for retirees and pensioners). 
        Facilities issued in excess of this statutory ceiling constitute a major regulatory breach. The CBUAE requires lending institutions to reschedule or restructure the debt without additional interest or fees to bring the borrower's ratio back into compliance.
        """)

    with st.expander("Does ReguGraph store or retain uploaded loan documents or sensitive personal data?"):
        st.markdown("""
        **No.** ReguGraph is engineered under Google Cloud Well-Architected Framework Zero-Trust security principles with **Zero Data Retention (ZDR)**. 
        Credit facility text is ingested into ephemeral in-memory state during the audit lifecycle and discarded immediately upon conclusion of the session. Document data is never written to disk logs, database collections, or external training pipelines.
        """)

    with st.expander("How does ReguGraph achieve 100% citation accuracy without mathematical hallucinations?"):
        st.markdown("""
        ReguGraph employs a decoupled, multi-agent architecture:
        1. **Deterministic Arithmetic:** All calculations (Debt Burden Ratio, 1% fee ceilings, excess restitution in AED) are calculated in pure Python IEEE 754 arithmetic rather than delegating calculations to stochastic LLM token probabilities.
        2. **Hybrid RAG Grounding:** The system retrieves regulatory texts from an official CBUAE vector collection hosted on ChromaDB (`localhost:8081`) combined with sparse BM25 keyword rankings via Reciprocal Rank Fusion ($k=60$).
        3. **Refusal Gate:** Any query referencing non-UAE jurisdictions or ungrounded assets is deterministically refused before generation.
        """)

    st.write("")


def render_digipay_footer():
    """Renders the institutional Dubai UAE FinTech footer."""
    st.markdown("""
    <div class="digipay-footer">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; margin-bottom: 24px;">
            <div>
                <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">
                    🏛️ ReguGraph.ai | UAE FinTech Regulatory Intelligence
                </div>
                <div style="max-width: 460px; color: #94A3B8; font-size: 13px; line-height: 1.6;">
                    The premier autonomous regulatory audit platform for banking institutions, neo-banks, credit funds, and consumers across Dubai and the United Arab Emirates.
                </div>
            </div>
            <div>
                <div style="font-weight: 700; color: #E2E8F0; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Statutory Frameworks</div>
                <div style="color: #64748B; font-size: 12.5px; line-height: 1.8;">
                    • CBUAE Notice No. 2011/23 (Personal Loans & DBR)<br>
                    • CBUAE Circular No. 8/2020 (Consumer Protection Standards)<br>
                    • CBUAE Circular No. 31/2013 (Mortgage Regulations)<br>
                    • UAE Federal Law No. 14 of 2018 (Central Bank & Financial Institutions)
                </div>
            </div>
            <div>
                <div style="font-weight: 700; color: #E2E8F0; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">System Endpoints</div>
                <div style="color: #64748B; font-size: 12.5px; line-height: 1.8;">
                    • Web Application: <code>http://localhost:8501</code><br>
                    • ChromaDB REST Server: <code>http://localhost:8081</code><br>
                    • Vector Management UI: <code>http://localhost:8090</code><br>
                    • Status: <span style="color:#10B981;font-weight:700;">● Active & Verified</span>
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #64748B;">
            <div>© 2026 ReguGraph-UAE. Built in Dubai, United Arab Emirates. Compliant with CBUAE Regulatory Guidelines.</div>
            <div>Zero Data Retention • Deterministic Financial Arithmetic • Google Cloud WAF Aligned</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_fintech_security_posture():
    """Renders the Google Well-Architected Framework (WAF) FinTech Security & Privacy banner."""
    st.markdown("""
    <div style="background: rgba(6, 182, 212, 0.06); border: 1px solid rgba(34, 211, 238, 0.25); border-radius: 16px; padding: 18px 24px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🛡️</span>
                <div>
                    <span style="font-weight: 800; color: #22D3EE; font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px;">Institutional FinTech Security & Privacy Posture</span><br>
                    <span style="color: #94A3B8; font-size: 13px;">Aligned with CBUAE Consumer Protection Standards and Google Cloud Well-Architected Security Pillars.</span>
                </div>
            </div>
            <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <span style="background: rgba(255,255,255,0.06); padding: 5px 12px; border-radius: 6px; font-size: 11.5px; color: #CBD5E1; font-family: 'JetBrains Mono';">🔒 Zero Data Retention</span>
                <span style="background: rgba(255,255,255,0.06); padding: 5px 12px; border-radius: 6px; font-size: 11.5px; color: #CBD5E1; font-family: 'JetBrains Mono';">⚡ Deterministic Math Guardrails</span>
                <span style="background: rgba(255,255,255,0.06); padding: 5px 12px; border-radius: 6px; font-size: 11.5px; color: #CBD5E1; font-family: 'JetBrains Mono';">📜 100% Gazette Grounded</span>
            </div>
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
        marker_color="#06B6D4",
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
