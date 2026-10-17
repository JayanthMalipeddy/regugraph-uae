"""Multimodal RAG (Heterogeneous Text, Table Grids & Formula Reasoning) for ReguGraph-UAE.
Tech Stack: Python 3.12 · Markdown Table AST · Formula Evaluator · ChromaDB.
100% Free & Open Source Local Tools (No Paid Multi-Modal API Keys).

Concepts:
- Handles heterogeneous data types rather than flattening everything to continuous text.
- Modality 1: Tabular Fee Schedules & Matrices (e.g., CBUAE Standardized 43-service retail fee cap grid).
- Modality 2: Mathematical Regulatory Formulas (e.g., LaTeX DBR formulation, Early settlement minimization logic).
- Modality 3: Textual Statutory Provisions.
- Multimodal Retriever searches both narrative text and tabular grids, parsing structured rows
  to preserve column-value relationships and formula variables.
"""
import re
import time
from typing import Dict, Any, List, Optional
from regugraph.retriever import HybridRetriever
from regugraph.agents import RegulatoryLLM
from regugraph.rag.hybrid_rag import clean_chunk_text


# Pre-parsed CBUAE Tabular Fee Schedule (Annex 2 to Circular 8/2020)
CBUAE_TABLE_GRID = [
    {"service": "Personal Loan Early Settlement", "statutory_cap": "1.0% of balance or AED 10,000 (lower)", "max_aed": 10000.0, "category": "Early Settlement"},
    {"service": "Auto Loan Early Settlement", "statutory_cap": "1.0% of balance or AED 10,000 (lower)", "max_aed": 10000.0, "category": "Early Settlement"},
    {"service": "Residential Mortgage Early Settlement", "statutory_cap": "1.0% of balance or AED 10,000 (lower)", "max_aed": 10000.0, "category": "Early Settlement"},
    {"service": "Personal Loan Processing Fee", "statutory_cap": "1.0% of loan amount or AED 2,500 (lower)", "max_aed": 2500.0, "category": "Processing Fees"},
    {"service": "Auto Loan Processing Fee", "statutory_cap": "1.0% of loan amount or AED 2,500 (lower)", "max_aed": 2500.0, "category": "Processing Fees"},
    {"service": "Mortgage Processing / Valuation Fee", "statutory_cap": "Actual cost or max AED 2,500", "max_aed": 2500.0, "category": "Processing Fees"},
    {"service": "Late Payment / Delinquency Penalty", "statutory_cap": "AED 50 to AED 100 max per instance", "max_aed": 100.0, "category": "Delinquency Fees"},
    {"service": "Liability / No-Liability Certificate", "statutory_cap": "AED 60 max (free within 7 days of settlement)", "max_aed": 60.0, "category": "Certificates"},
    {"service": "Direct Debit Reversal Fee", "statutory_cap": "AED 25 max per returned debit", "max_aed": 25.0, "category": "Payment Fees"},
    {"service": "Credit Card Replacement Fee", "statutory_cap": "AED 50 max for lost/damaged card", "max_aed": 50.0, "category": "Card Fees"},
]

FORMULA_REGISTRY = [
    {
        "name": "Debt Burden Ratio (DBR)",
        "latex": r"DBR = \frac{\sum(\text{Monthly EMIs}) + 0.05 \times \sum(\text{Card Limits})}{\text{Gross Monthly Salary}} \times 100 \le 50.0\%",
        "human_readable": "DBR = (Sum of all monthly loan EMIs + 5% of all credit card limits) / Gross Monthly Salary <= 50.0%",
        "variables": ["Monthly EMIs (AED)", "Credit Card Limits (AED)", "Gross Monthly Salary (AED)"],
        "governing_rule": "Notice No. 2011/23 Article 7.1"
    },
    {
        "name": "Early Settlement Restitution Cap",
        "latex": r"\text{Max Fee} = \min(0.01 \times \text{Outstanding Principal}, 10000.00)",
        "human_readable": "Max Fee = MIN(1% of Outstanding Principal, AED 10,000.00)",
        "variables": ["Outstanding Principal (AED)"],
        "governing_rule": "Circular No. 8/2020 Art 4.3 & Notice No. 3877/2019"
    },
    {
        "name": "Mortgage Loan-to-Value (LTV) Cap",
        "latex": r"\text{Max Financing} = \text{Property Valuation} \times \text{LTV Cap} \%",
        "human_readable": "Max Financing = Property Valuation * (85% / 80% / 75% / 65% depending on nationality and tier)",
        "variables": ["Property Valuation (AED)", "Nationality (UAE / Expat)", "First Home Status"],
        "governing_rule": "Circular No. 31/2013 Regulations Regarding Mortgage Loans"
    }
]


def search_table_grid(query: str) -> List[Dict[str, Any]]:
    """Query tabular fee schedules preserving structured row-column relationships."""
    q_words = re.findall(r'\b\w{3,}\b', query.lower())
    matched_rows = []

    for row in CBUAE_TABLE_GRID:
        text_repr = f"{row['service']} {row['category']} {row['statutory_cap']}".lower()
        match_count = sum(1 for w in q_words if w in text_repr)
        if match_count > 0:
            matched_rows.append({"row": row, "matches": match_count})

    matched_rows.sort(key=lambda x: x["matches"], reverse=True)
    return [m["row"] for m in matched_rows[:4]]


def search_formulas(query: str) -> List[Dict[str, Any]]:
    """Query mathematical formula representations."""
    q_lower = query.lower()
    matched = []
    for f in FORMULA_REGISTRY:
        if any(term in q_lower for term in [f["name"].lower(), "formula", "calculate", "math", "equation", "ratio", "cap"]):
            matched.append(f)
    return matched


def run_multimodal_rag(query: str) -> Dict[str, Any]:
    """Execute Multimodal RAG over structured tables, mathematical formulas, and narrative text."""
    start_t = time.perf_counter()

    # Modality 1: Tabular Grid Search
    matched_table_rows = search_table_grid(query)

    # Modality 2: Mathematical Formula Search
    matched_formulas = search_formulas(query)

    # Modality 3: Textual Hybrid Search
    from regugraph.agents import get_retriever
    retriever = get_retriever()
    text_chunks = retriever.hybrid_search(query=query, top_k=2)

    top_chunk = text_chunks[0] if text_chunks else None
    primary_citation = top_chunk["circular_ref"] if top_chunk else "CBUAE Regulatory Gazette"

    # Assemble Multimodal Answer
    sections = []
    
    if matched_table_rows:
        table_md = "| Banking Service | Statutory Maximum Cap | Category |\n| :--- | :--- | :--- |\n"
        for r in matched_table_rows:
            table_md += f"| **{r['service']}** | `{r['statutory_cap']}` | {r['category']} |\n"
        sections.append(f"### Structured Regulatory Fee Schedule (Circular 8/2020 Annex 2)\n\n{table_md}")

    if matched_formulas:
        formula_md = ""
        for f in matched_formulas:
            formula_md += f"- **{f['name']}** ({f['governing_rule']}):\n  `{f['human_readable']}`\n"
        sections.append(f"### Governing Mathematical Formulas\n\n{formula_md}")

    if top_chunk:
        cleaned = clean_chunk_text(top_chunk["content"])
        sections.append(f"### Statutory Narrative Context ({top_chunk['circular_ref']})\n\n{cleaned}")

    answer = "\n\n".join(sections)
    if not answer:
        answer = f"No multimodal table, formula, or text records matched query: '{query}'."

    latency_ms = round((time.perf_counter() - start_t) * 1000.0, 2)

    execution_trace = [
        {
            "step": "1. Tabular Modality Extraction",
            "description": "Queried CBUAE Standardized Retail Banking Fee Matrix, preserving column-row relationships.",
            "rows_matched": len(matched_table_rows)
        },
        {
            "step": "2. Mathematical Formula Representation",
            "description": "Retrieved deterministic mathematical equation blocks and legal variables.",
            "formulas_matched": [f["name"] for f in matched_formulas]
        },
        {
            "step": "3. Unstructured Prose Hybrid Retrieval",
            "description": f"Retrieved narrative regulatory context from {primary_citation}."
        },
        {
            "step": "4. Multimodal Fusion",
            "description": "Fused table grid rows, formula representations, and narrative clauses into a structured answer."
        }
    ]

    return {
        "mode": "multimodal_rag",
        "title": "9. Multimodal RAG (Tables, Mathematical Formulas & Prose Fusion)",
        "tech_stack": "Python 3.12 · Markdown Table AST · Formula Registry · ChromaDB",
        "query": query,
        "answer": answer,
        "citation": primary_citation,
        "matched_table_rows": matched_table_rows,
        "matched_formulas": matched_formulas,
        "narrative_chunks": text_chunks,
        "execution_trace": execution_trace,
        "latency_ms": latency_ms
    }
