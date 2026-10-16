"""Compiled LangGraph Workflow Engine for ReguGraph-UAE."""
from typing import Dict, Any
from langgraph.graph import StateGraph, END

from .graph_state import AuditState
from .agents import (
    node_deconstruct_contract,
    node_hybrid_retrieve,
    node_deterministic_math_audit,
    node_regulatory_cross_examine,
    node_grounding_and_refusal_gate,
    node_synthesize_dossier
)


def _should_refuse(state: AuditState) -> str:
    """Routing function for the Refusal Gate."""
    if state.get("refusal_triggered", False):
        return "grounding_gate"
    return "hybrid_retrieve"


def build_audit_graph():
    """Build and compile the LangGraph regulatory audit state machine."""
    workflow = StateGraph(AuditState)

    # Add Nodes
    workflow.add_node("deconstruct", node_deconstruct_contract)
    workflow.add_node("hybrid_retrieve", node_hybrid_retrieve)
    workflow.add_node("math_audit", node_deterministic_math_audit)
    workflow.add_node("cross_examine", node_regulatory_cross_examine)
    workflow.add_node("grounding_gate", node_grounding_and_refusal_gate)
    workflow.add_node("synthesize", node_synthesize_dossier)

    # Set Entry Point
    workflow.set_entry_point("deconstruct")

    # Conditional Branch: Handle early refusal
    workflow.add_conditional_edges(
        "deconstruct",
        _should_refuse,
        {
            "grounding_gate": "grounding_gate",
            "hybrid_retrieve": "hybrid_retrieve"
        }
    )

    # Linear workflow for grounded audits
    workflow.add_edge("hybrid_retrieve", "math_audit")
    workflow.add_edge("math_audit", "cross_examine")
    workflow.add_edge("cross_examine", "grounding_gate")
    workflow.add_edge("grounding_gate", "synthesize")
    workflow.add_edge("synthesize", END)

    return workflow.compile()


# Singleton compiled graph
_compiled_app = None

def get_audit_engine():
    global _compiled_app
    if _compiled_app is None:
        _compiled_app = build_audit_graph()
    return _compiled_app


def run_compliance_audit(contract_text: str, contract_title: str = "Uploaded Agreement") -> AuditState:
    """Run an end-to-end regulatory compliance audit over a credit contract."""
    engine = get_audit_engine()
    initial_state: AuditState = {
        "contract_text": contract_text,
        "contract_title": contract_title,
        "borrower_income": 0.0,
        "loan_amount": 0.0,
        "loan_type": "Personal Loan",
        "extracted_clauses": [],
        "retrieved_regulations": {},
        "math_validations": {},
        "compliance_findings": [],
        "citation_verifications": [],
        "overall_status": "PROCESSING",
        "refusal_triggered": False,
        "refusal_reason": "",
        "executive_summary": "",
        "action_plan": [],
        "execution_trace": []
    }
    final_state = engine.invoke(initial_state)
    return final_state


def answer_regulatory_inquiry(query: str) -> Dict[str, Any]:
    """Answer an ad-hoc regulatory question using Hybrid Retrieval and Grounded Synthesis,
    with an active refusal gate for out-of-scope or ungrounded queries."""
    import re
    import time
    start_t = time.perf_counter()
    query_lower = query.lower()

    # 1. Foreign Jurisdiction Refusal Gate
    foreign_indicators = ["fca", "boe", "federal reserve", "cfpb", "gdpr", "california", "uk law", "irs", "us law", "regulation z"]
    if any(re.search(rf"\b{re.escape(ind)}\b", query_lower) for ind in foreign_indicators):
        latency = (time.perf_counter() - start_t) * 1000.0
        return {
            "query": query,
            "answer": "REFUSAL TRIGGERED (Out of Jurisdiction): CBUAE regulations apply strictly within the United Arab Emirates. The submitted inquiry references foreign regulatory authorities or non-UAE jurisdictions (e.g. UK FCA, US Federal Reserve).",
            "citation": "N/A - Refusal Gate",
            "refusal_triggered": True,
            "refusal_category": "foreign_jurisdiction",
            "retrieved_chunks": [],
            "latency_ms": round(latency, 2)
        }

    # 2. Ungrounded Domain Refusal Gate
    ungrounded_indicators = ["crypto", "cryptocurrency", "staking", "bitcoin", "ethereum", "defi", "web3", "blockchain pool"]
    if any(re.search(rf"\b{re.escape(ind)}\b", query_lower) for ind in ungrounded_indicators):
        latency = (time.perf_counter() - start_t) * 1000.0
        return {
            "query": query,
            "answer": "REFUSAL TRIGGERED (Ungrounded Topic): Topic not found in corpus. CBUAE retail consumer credit regulations do not govern decentralized cryptocurrency staking or speculative crypto assets. System refrains from generating ungrounded advice.",
            "citation": "N/A - Refusal Gate",
            "refusal_triggered": True,
            "refusal_category": "ungrounded_domain",
            "retrieved_chunks": [],
            "latency_ms": round(latency, 2)
        }

    # 3. In-Scope: Execute Hybrid Retrieval
    from .agents import get_retriever, RegulatoryLLM
    retriever = get_retriever()
    results = retriever.hybrid_search(query=query, top_k=3)
    
    top_citation = results[0]["circular_ref"] if results else "CBUAE Banking Regulatory Gazette"
    context_text = "\n\n".join([f"[{r['circular_ref']} - {r['article_header']}]:\n{r['content']}" for r in results])

    def clean_regulatory_text(content: str) -> str:
        """Format raw regulatory chunk into clean, readable executive text."""
        # Strip bracketed source headers e.g. [Notice No. 2011/23 - Article 7: ...]
        text = re.sub(r'^\s*\[[^\]]+\]\s*\n*', '', content.strip())
        # Strip duplicate top markdown headers e.g. ### Article 7: Debt Burden Ratio (DBR) Statutory Cap
        text = re.sub(r'^\s*###\s+[^\n]+\n+', '', text)
        # Normalize unicode dashes and smart quotes to safe standard characters
        text = text.replace('\u2014', ' - ').replace('\u2013', ' - ').replace('\u2018', "'").replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"')
        # Simplify LaTeX DBR math formula into clean readable math
        text = re.sub(
            r'\$\$.*?DBR.*?\\le\s*50\.0\\%.*?\$\$',
            '`DBR = (Total Monthly Loan Installments + 5% of Credit Card Limits) / Gross Monthly Salary <= 50.0%`',
            text,
            flags=re.DOTALL
        )
        # Strip any remaining LaTeX wrappers
        text = re.sub(r'\$\$([^\$]+)\$\$', r'`\1`', text)
        text = re.sub(r'\\text\{([^}]+)\}', r'\1', text)
        text = re.sub(r'\\sum', 'Total', text)
        text = re.sub(r'\\times', '*', text)
        text = re.sub(r'\\le', '<=', text)
        text = re.sub(r'\\ge', '>=', text)
        text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1) / (\2)', text)
        # Strip excessive horizontal rule breaks
        text = re.sub(r'\n---+\s*', '\n', text)
        # Clean up double headers or whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

    # 4. Synthesize Answer using Local LLM or Deterministic Legal Synthesis
    llm = RegulatoryLLM()
    answer = ""
    if llm.is_available:
        prompt = (
            f"You are a Senior Regulatory Compliance Officer at the Central Bank of the UAE.\n"
            f"Answer the following inquiry strictly and concisely using ONLY the provided regulatory context.\n"
            f"Always cite the exact circular reference (e.g., Circular 8/2020 Art 4.3, Notice 2011/23 Art 7.1).\n"
            f"Do not hallucinate or extrapolate.\n\n"
            f"REGULATORY CONTEXT:\n{context_text}\n\n"
            f"QUESTION: {query}\n\n"
            f"ANSWER:"
        )
        answer = llm.invoke(prompt).strip()

    # If LLM offline or returned empty, generate a clean, executive regulatory synthesis
    if not answer:
        primary_chunk = results[0] if results else None
        if primary_chunk:
            cleaned_content = clean_regulatory_text(primary_chunk["content"])
            article_title = primary_chunk.get("article_header", "Statutory Rule")
            answer = (
                f"Under **{top_citation}** ({article_title}), the Central Bank of the UAE mandates the following statutory requirements:\n\n"
                f"{cleaned_content}\n\n"
                f"**Statutory Compliance Note:** Financial institutions operating in the UAE are legally bound by these limits. Any contractual clause in breach of these thresholds is deemed null, void, and unenforceable under UAE Federal Law."
            )
        else:
            answer = f"No governing CBUAE regulatory provisions were found matching the inquiry: '{query}'."

    latency = (time.perf_counter() - start_t) * 1000.0
    return {
        "query": query,
        "answer": answer,
        "citation": top_citation,
        "refusal_triggered": False,
        "refusal_category": "in_scope",
        "retrieved_chunks": results,
        "latency_ms": round(latency, 2)
    }
