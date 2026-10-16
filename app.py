"""ReguGraph-UAE: Autonomous Regulatory & Compliance Audit Agent
Gen Academy Mastering Agentic AI — Week 2: "Build Your RAG Application"

Autonomous cross-examination of UAE retail credit agreements against CBUAE
statutory circulars (Circular 8/2020, Notice 2011/23, Circular 31/2013, Fee Schedule Caps).
"""
import streamlit as st
from pathlib import Path
import json

from regugraph.config import (
    SAMPLE_CONTRACTS_DIR,
    EVALUATION_DIR,
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    MAX_DBR_PERCENT,
    MAX_EARLY_SETTLEMENT_CAP_AED,
    MAX_PERSONAL_PROCESSING_FEE_CAP_AED
)
from regugraph.engine import run_compliance_audit, answer_regulatory_inquiry
from regugraph.report_generator import generate_markdown_report as generate_markdown_dossier
from regugraph.agents import RegulatoryLLM

# Page configuration
st.set_page_config(
    page_title="ReguGraph-UAE | Autonomous Compliance Auditor",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Session State
if "audit_result" not in st.session_state:
    st.session_state.audit_result = None
if "selected_contract_text" not in st.session_state:
    st.session_state.selected_contract_text = ""
if "selected_contract_name" not in st.session_state:
    st.session_state.selected_contract_name = ""

# Sidebar: System Health & Knowledge Base Status
with st.sidebar:
    st.title("⚖️ ReguGraph-UAE")
    st.caption("Autonomous CBUAE Compliance Auditor")
    st.divider()

    # System Status Card
    with st.container(border=True):
        st.subheader("System Architecture", anchor=False)
        llm_check = RegulatoryLLM()
        if llm_check.is_available:
            st.success(f"Local LLM: Active ({OLLAMA_MODEL})", icon=":material/check_circle:")
        else:
            st.info("Local LLM: Deterministic Engine Fallback", icon=":material/shield:")
        
        st.success("Hybrid Vector Store: ChromaDB Server (localhost:8081)", icon=":material/database:")
        st.success("Sparse Lexical Search: BM25 Okapi Active", icon=":material/search:")
        st.success("Fusion Engine: Reciprocal Rank Fusion (k=60)", icon=":material/sync_alt:")
        st.success("Math Engine: Zero-Hallucination Exact Caps", icon=":material/calculate:")

    # Statutory Regulations Card
    with st.container(border=True):
        st.subheader("Governing CBUAE Corpus", anchor=False)
        st.markdown("""
        - **Circular No. 8/2020:** Consumer Protection Standards (Fee caps, Early Exit 1% / 10k, KFS)
        - **Notice No. 2011/23:** Retail Personal Lending Rules (50% DBR cap, 48m tenure, 60m auto)
        - **Circular No. 31/2013:** Mortgage Regulations (80% expat LTV, 25yr / 300m tenure cap)
        - **Standardized Fee Schedule:** Statutory ceilings for 15+ retail banking services
        """)

    st.divider()
    st.caption("Mastering Agentic AI — Week 2: Build Your RAG Application")


# Main Page Header
st.title("ReguGraph-UAE: Autonomous CBUAE Banking Compliance Auditor")
st.markdown("""
Autonomous multi-agent RAG state machine that extracts credit covenants, performs deterministic statutory arithmetic, 
cross-examines terms against Central Bank of the UAE regulatory gazettes, and synthesizes binding compliance dossiers.
""")

# Top Level Mode Navigation
selected_mode = st.segmented_control(
    "Auditor Workspace Navigation",
    options=["Credit Contract Audit", "Regulatory Inquiry & Refusal QA", "Official Evaluation Benchmark"],
    default="Credit Contract Audit",
    label_visibility="collapsed"
)

st.write("")

# ==============================================================================
# MODE 1: CREDIT CONTRACT AUDIT
# ==============================================================================
if selected_mode == "Credit Contract Audit":
    col_input, col_run = st.columns([3, 1], vertical_alignment="bottom")
    
    # Contract Preset Options
    contract_options = {
        "Sample 1: Predatory Retail Loan (63% DBR, 2.75% Early Exit Fee, 60m Tenure)": "sample_contract_1_predatory_personal_loan.md",
        "Sample 2: Compliant Residential Mortgage (FAB Group Home Finance)": "sample_contract_2_compliant_mortgage.md",
        "Sample 3: Non-Compliant Auto Finance (0% Down Payment, 72m Tenure, AED 350 Late Fee)": "sample_contract_3_auto_loan_violations.md",
        "Sample 4: Foreign UK FCA Loan Agreement (Explicit Refusal Gate Trigger)": "sample_contract_4_uk_foreign_agreement.md",
        "Custom Agreement: Paste or Edit Contract Text Below": None
    }

    selected_label = st.selectbox(
        "Select Credit Contract to Audit:",
        options=list(contract_options.keys()),
        index=0
    )

    # Load contract content
    target_filename = contract_options[selected_label]
    if target_filename:
        file_path = SAMPLE_CONTRACTS_DIR / target_filename
        if file_path.exists():
            default_content = file_path.read_text(encoding="utf-8")
        else:
            default_content = "# Contract File Not Found"
    else:
        default_content = "# Paste custom retail loan, mortgage, or vehicle finance contract markdown here..."

    # Editable text container
    with st.expander("Inspect or Edit Contractual Text", expanded=(target_filename is None)):
        contract_text = st.text_area(
            "Contractual Document Source:",
            value=default_content,
            height=280,
            label_visibility="collapsed"
        )

    # Run Audit Button
    if st.button("Run Autonomous Compliance Audit", type="primary", icon=":material/gavel:", width="stretch"):
        with st.spinner("Executing LangGraph State Machine (Deconstruct → Hybrid Retrieve → Math Engine → Cross-Examine → Grounding Gate → Dossier)..."):
            audit_result = run_compliance_audit(contract_text, contract_title=selected_label.split(":")[0])
            st.session_state.audit_result = audit_result
            st.session_state.selected_contract_name = selected_label

    # Display Audit Results if available
    res = st.session_state.audit_result
    if res:
        st.divider()

        # Handle Refusal Case
        if res.get("refusal_triggered"):
            st.error(
                f"**EXECUTION REFUSED BY JURISDICTION GATE**\n\n{res.get('refusal_reason')}",
                icon=":material/block:"
            )
            with st.container(border=True):
                st.subheader("Zero-Hallucination Refusal Trace", anchor=False)
                for step in res.get("execution_trace", []):
                    st.write(f"- **{step['step']}:** {step['status']}")
        else:
            # Audit Summary Scorecards
            findings = res.get("compliance_findings", [])
            violations = [f for f in findings if f.get("status") == "VIOLATION"]
            total_refund = sum(f.get("excess_financial_impact_aed", 0.0) for f in violations)
            math_vals = res.get("math_validations", {})
            dbr_info = math_vals.get("dbr")

            c1, c2, c3, c4 = st.columns(4)
            with c1:
                with st.container(border=True):
                    if len(violations) > 0:
                        st.metric("Compliance Status", "NON-COMPLIANT", delta=f"{len(violations)} Infractions", delta_color="inverse")
                    else:
                        st.metric("Compliance Status", "FULLY COMPLIANT", delta="CBUAE Certified", delta_color="normal")
            
            with c2:
                with st.container(border=True):
                    dbr_val = f"{dbr_info.dbr_percent}%" if dbr_info else "N/A"
                    dbr_delta = f"{dbr_info.violation_margin_percent}% Over 50% Cap" if (dbr_info and not dbr_info.is_compliant) else "Under 50% Cap"
                    st.metric("Debt Burden Ratio", dbr_val, delta=dbr_delta, delta_color="inverse" if (dbr_info and not dbr_info.is_compliant) else "normal")

            with c3:
                with st.container(border=True):
                    st.metric("Unlawful Overcharges", f"AED {total_refund:,.2f}", delta="Statutory Restitution Due" if total_refund > 0 else "Zero Overcharges", delta_color="inverse" if total_refund > 0 else "normal")

            with c4:
                with st.container(border=True):
                    st.metric("Loan Classification", res.get("loan_type", "Personal Loan"), delta=f"AED {res.get('loan_amount', 0.0):,.0f} Financed")

            # Executive Summary Alert
            if violations:
                st.warning(
                    f"**COMPLIANCE ALERT ({len(violations)} Violations Detected):** {res.get('executive_summary')}",
                    icon=":material/warning:"
                )
            else:
                st.success(
                    f"**COMPLIANCE CERTIFICATION:** {res.get('executive_summary')}",
                    icon=":material/verified:"
                )

            # Two Column Layout: Detailed Findings + Trace & Remediation
            col_findings, col_remedy = st.columns([3, 2])

            with col_findings:
                st.subheader("Audited Checkpoints & Legal Cross-Examinations", anchor=False)
                for f in findings:
                    is_viol = (f.get("status") == "VIOLATION")
                    border_color = ":material/cancel:" if is_viol else ":material/check_circle:"
                    
                    with st.container(border=True):
                        col_status, col_head = st.columns([1, 4])
                        with col_status:
                            if is_viol:
                                st.error("VIOLATION", icon=":material/cancel:")
                            else:
                                st.success("COMPLIANT", icon=":material/check_circle:")
                        with col_head:
                            st.markdown(f"**{f.get('checkpoint_name')}**")
                            st.caption(f"Authority: `{f.get('legal_citation')}`")

                        st.markdown(f"- **Contractual Covenant:** {f.get('contract_provision')}")
                        st.markdown(f"- **CBUAE Statutory Rule:** {f.get('statutory_rule')}")
                        st.markdown(f"- **Legal Assessment:** {f.get('explanation')}")

                        if f.get("excess_financial_impact_aed", 0.0) > 0:
                            st.info(f"**Excess Financial Overcharge:** AED {f.get('excess_financial_impact_aed'):,.2f} refundable under Notice 3877/2019.", icon=":material/payments:")

                        st.markdown(f"**Required Operational Remediation:** `{f.get('required_remediation')}`")

            with col_remedy:
                st.subheader("Mandatory Remediation Plan", anchor=False)
                with st.container(border=True):
                    for step_idx, step_desc in enumerate(res.get("action_plan", []), 1):
                        st.markdown(f"**{step_idx}.** {step_desc}")

                st.subheader("LangGraph State Trace", anchor=False)
                with st.container(border=True):
                    for t in res.get("execution_trace", []):
                        st.markdown(f"- **{t['step']}:** {t['status']}")

                # Dossier Export Button
                st.subheader("Executive Dossier Export", anchor=False)
                dossier_md = generate_markdown_dossier(res)
                st.download_button(
                    label="Download Audit Dossier (.md)",
                    data=dossier_md,
                    file_name="CBUAE_COMPLIANCE_AUDIT_DOSSIER.md",
                    mime="text/markdown",
                    icon=":material/download:",
                    width="stretch"
                )

# ==============================================================================
# MODE 2: REGULATORY INQUIRY & REFUSAL QA
# ==============================================================================
elif selected_mode == "Regulatory Inquiry & Refusal QA":
    st.subheader("Interactive CBUAE Regulatory Inquiry & Refusal Tester", anchor=False)
    st.markdown("Test the Hybrid RAG engine (Dense + Sparse BM25 + Reciprocal Rank Fusion) and verify zero-hallucination refusal gates.")

    preset_queries = [
        "What is the maximum early settlement fee that a UAE bank can charge on a retail loan?",
        "What is the maximum allowable Debt Burden Ratio (DBR) for salaried individuals under CBUAE rules?",
        "What is the maximum permitted repayment tenure for a personal consumer loan in the UAE?",
        "How many years can an expatriate take for a residential mortgage in the UAE?",
        "What are the UK Financial Conduct Authority (FCA) regulations on maximum APR for payday loans?",
        "What is the CBUAE reserve requirement for decentralized cryptocurrency staking pools?",
        "What are the Federal Reserve Regulation Z disclosure mandates for US credit cards?"
    ]

    selected_preset = st.selectbox("Choose a Benchmark Test Query:", ["-- Type your own custom query --"] + preset_queries)
    default_q = selected_preset if selected_preset != "-- Type your own custom query --" else ""
    user_query = st.text_input("Regulatory Compliance Inquiry:", value=default_q, placeholder="e.g. What is the cap on early repayment fees under Circular 8/2020?")

    if st.button("Search CBUAE Regulations", type="primary", icon=":material/search:", width="stretch"):
        if not user_query.strip():
            st.warning("Please enter a regulatory question.")
        else:
            with st.spinner("Executing Parallel Dense & Sparse Retrieval across CBUAE Circulars..."):
                ans_res = answer_regulatory_inquiry(user_query)

            if ans_res.get("refusal_triggered"):
                st.error(
                    f"**EXPLICIT REFUSAL TRIGGERED ({ans_res.get('refusal_category').upper()})**\n\n{ans_res.get('answer')}",
                    icon=":material/block:"
                )
            else:
                st.success(
                    f"**Grounded Answer (Authority: `{ans_res.get('citation')}` | Latency: {ans_res.get('latency_ms')} ms):**\n\n{ans_res.get('answer')}",
                    icon=":material/verified:"
                )

                st.subheader("Retrieved Regulatory Excerpts (Reciprocal Rank Fusion)", anchor=False)
                for idx, chunk in enumerate(ans_res.get("retrieved_chunks", []), 1):
                    with st.container(border=True):
                        st.markdown(f"**Chunk #{idx}:** `{chunk.get('circular_ref')}` — *{chunk.get('article_header')}* (RRF Score: `{chunk.get('rrf_score')}`)")
                        st.text(chunk.get("content"))

# ==============================================================================
# MODE 3: OFFICIAL EVALUATION BENCHMARK
# ==============================================================================
elif selected_mode == "Official Evaluation Benchmark":
    st.subheader("Official Week 2 RAG Benchmark & Faithfulness Evaluation", anchor=False)
    st.markdown("Formal evaluation across 15 test queries testing statutory fee caps, multi-hop comparisons, edge cases, and out-of-jurisdiction refusal bounds.")

    report_path = EVALUATION_DIR / "EVALUATION_REPORT.md"
    if report_path.exists():
        report_content = report_path.read_text(encoding="utf-8")
        st.markdown(report_content)
    else:
        st.info("Evaluation report not yet generated. Run `uv run python evaluation/run_evaluation.py` to generate.")
