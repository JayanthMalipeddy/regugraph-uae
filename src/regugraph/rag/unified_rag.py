"""Unified RAG Dispatcher & Conversational Guardrail Engine for ReguGraph-UAE.
Tech Stack: Python 3.12 · 100% Free & Open Source Local Tools.

Implements:
1. Natural Conversational Greeting Handler ("hi", "hello" -> warm, polite greeting with platform capabilities).
2. Strict Allowed-Scope Guardrails:
   - Permitted: CBUAE retail credit regulations (DBR, early exit fees, personal/auto/mortgage caps, processing/late fees, restitution math, facility auditing, 10 RAG architectures).
   - Refused (polite & firm): Foreign laws (UK FCA, US Fed), crypto/tokens, off-topic general questions.
3. Multi-Mode RAG Dispatcher:
   Coordinates all 10 RAG architectures with standardized output and educational execution traces.
"""
import re
import time
from typing import Dict, Any, Optional

from regugraph.rag.hybrid_rag import run_hybrid_rag
from regugraph.rag.metadata_rag import metadata_filtered_rag
from regugraph.rag.reranker import run_reranking_rag
from regugraph.rag.contextual_chunker import run_contextual_chunking_rag
from regugraph.rag.sql_engine import execute_sql_rag
from regugraph.rag.graph_rag import execute_graph_rag
from regugraph.rag.crag_engine import run_corrective_rag
from regugraph.rag.self_rag import run_self_rag
from regugraph.rag.multimodal_rag import run_multimodal_rag
from regugraph.rag.agentic_rag import run_agentic_rag


# Catalog of the 10 RAG Concepts with their 100% Free & Open Source Local Tech Stacks
RAG_MODES_REGISTRY = {
    "hybrid": {
        "id": "hybrid",
        "name": "1. Hybrid Search RAG",
        "summary": "Combines BM25 keyword search with dense vector retrieval using Reciprocal Rank Fusion (RRF).",
        "tech_stack": "Python 3.12 · rank-bm25 (BM25Okapi) · ChromaDB (HNSW Cosine) · RRF (k=60)",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Eliminates vocabulary mismatch while preserving exact statutory numerical codes and legal references."
    },
    "metadata": {
        "id": "metadata",
        "name": "2. Metadata-Filtered RAG",
        "summary": "Combines dense semantic search with strict categorical and circular metadata filtering.",
        "tech_stack": "Python 3.12 · ChromaDB Metadata Filters ($and / where) · Pydantic Schema Validation",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Prevents cross-facility contamination (e.g. mortgage LTV rules contaminating auto loan audits)."
    },
    "reranking": {
        "id": "reranking",
        "name": "3. Reranking RAG",
        "summary": "First-stage broad candidate retrieval followed by cross-encoder joint scoring for high precision.",
        "tech_stack": "Python 3.12 · ChromaDB (Bi-Encoder) · Local Lexical & Numerical Cross-Scorer",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Prunes 75% of noisy candidates, sending only the top-2 highest relevance chunks to the LLM."
    },
    "contextual": {
        "id": "contextual",
        "name": "4. Contextual Chunking RAG",
        "summary": "Preserves document-level context and hierarchical breadcrumbs before chunk embedding.",
        "tech_stack": "Python 3.12 · Hierarchical Markdown AST Parser · Contextual Breadcrumb Injector · ChromaDB",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Prevents chunk amnesia by retaining parent circular authority, article hierarchy, and legal scope."
    },
    "sql": {
        "id": "sql",
        "name": "5. SQL + Vector RAG",
        "summary": "Combines deterministic SQL queries for structured caps with vector search for narrative legal context.",
        "tech_stack": "Python 3.12 · SQLite (cbuae_structured.db) · ChromaDB · Structured-Vector Fusion",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Guarantees zero-hallucination numerical math from structured relational tables combined with legal prose."
    },
    "graph": {
        "id": "graph",
        "name": "6. Knowledge Graph + Vector RAG (GraphRAG)",
        "summary": "Combines semantic vector search with explicit multi-hop entity-relationship knowledge graph traversal.",
        "tech_stack": "Python 3.12 · NetworkX Directed Graph (DiGraph) · ChromaDB · Entity-Triplet Traversal",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Connects disjoint legal facts across multiple circulars (Authority -> Circular -> Article -> Constraint -> Remedy)."
    },
    "crag": {
        "id": "crag",
        "name": "7. Corrective RAG (CRAG)",
        "summary": "Evaluates retrieval quality before answering; triggers autonomous query rewriting if confidence is low.",
        "tech_stack": "Python 3.12 · ChromaDB · Quality Evaluator · CBUAE Regulatory Domain Thesaurus",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Self-corrects ambiguous or weak queries before generation, preventing hallucination cascades."
    },
    "self_rag": {
        "id": "self_rag",
        "name": "8. Self-RAG",
        "summary": "Autonomous reflection tokens for adaptive retrieval ([Retrieve] vs [No-Retrieve]), [Is-Rel], and [Is-Sup].",
        "tech_stack": "Python 3.12 · Self-Reflection Decision Tokens · Citation Grounding Critic · ChromaDB",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Bypasses retrieval for conversational greetings and guarantees that claims are backed by cited articles."
    },
    "multimodal": {
        "id": "multimodal",
        "name": "9. Multimodal RAG",
        "summary": "Extracts and reasons over tabular fee grids and mathematical formulas alongside narrative legal text.",
        "tech_stack": "Python 3.12 · Markdown Table AST · Formula Registry (LaTeX) · ChromaDB",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Natively interprets structured 43-service banking fee tables and mathematical DBR/settlement formulas."
    },
    "agentic": {
        "id": "agentic",
        "name": "10. Agentic RAG",
        "summary": "Autonomous tool-calling agent dynamically planning and combining Vector Search, SQL, Graph, and Math tools.",
        "tech_stack": "Python 3.12 · Autonomous Multi-Tool Controller · Local Tool Registry (Math, SQL, Graph, Vector)",
        "cost": "100% Free & Open Source (Local)",
        "key_benefit": "Executes complex multi-step facility audits, mathematical verification, and legal citation end-to-end."
    }
}


# Permitted CBUAE Banking Regulatory Keywords
ALLOWED_TOPICS_REGEX = re.compile(
    r"\b(dbr|debt burden|settlement|prepayment|exit fee|early payoff|personal loan|auto loan|car loan|"
    r"mortgage|home loan|ltv|loan to value|salary|pensioner|retiree|tenure|interest|restitution|sanadak|"
    r"cbuae|central bank|circular|notice|2011/23|8/2020|3877/2019|31/2013|processing fee|late payment|"
    r"fee schedule|calculator|audit|contract|facility|rag|hybrid|metadata|rerank|graph|sql|multimodal|"
    r"agentic|corrective|self-rag|chunk|benchmark|diagnostics|eval|sample|sanction)\b",
    re.IGNORECASE
)

# Refusal Triggers
FOREIGN_JURISDICTIONS = ["fca", "boe", "federal reserve", "cfpb", "gdpr", "uk law", "us law", "irs", "rbi", "sebi", "sec"]
UNGROUNDED_CRYPTO = ["crypto", "cryptocurrency", "bitcoin", "ethereum", "btc", "eth", "staking", "nft", "web3", "defi", "altcoin"]
OFF_TOPIC_GENERAL = ["recipe", "cooking", "weather", "movie", "song", "poem", "joke", "gaming", "football", "cricket", "horoscope"]


def evaluate_query_guardrails(query: str) -> Optional[Dict[str, Any]]:
    """Strictly evaluates incoming query against allowed list of CBUAE compliance topics."""
    q_clean = query.strip()
    q_lower = q_clean.lower()

    # 1. Natural Conversational Greeting Detection
    greeting_patterns = [
        r"^(hi|hello|hey|greetings|good\s+morning|good\s+afternoon|good\s+evening|salam|marhaba)[\s!.,?]*$",
        r"^(who\s+are\s+you|what\s+can\s+you\s+do|how\s+can\s+you\s+help|what\s+is\s+this\s+website|tell\s+me\s+about\s+yourself)[\s?!.,]*$"
    ]
    if any(re.search(p, q_lower) for p in greeting_patterns):
        greeting_text = (
            "Hello! How can I help you today?\n\n"
            "I am your **CBUAE Regulatory & Compliance AI Audit Agent**. I specialize in analyzing credit facilities, "
            "validating statutory caps, and auditing loan agreements against official Central Bank of the UAE regulations.\n\n"
            "Here is what I can do within our allowed regulatory scope:\n"
            "- **Debt Burden Ratio (DBR):** Calculate and enforce statutory 50% cap (30% for pensioners) under Notice 2011/23.\n"
            "- **Early Settlement Fees:** Audit and compute restitution for fees exceeding 1% or AED 10,000 under Circular 8/2020 & Notice 3877/2019.\n"
            "- **Tenure & Borrowing Limits:** Verify Personal loans (48-month max, 20x salary), Auto loans (60-month max, 80% LTV), and Mortgages (25-year max, 85%/80%/75% LTV).\n"
            "- **Fee Schedules:** Audit processing fees (1% / AED 2,500 max) and late payment charges (AED 50 to AED 100 max).\n"
            "- **Facility Audits:** Audit loan sanction documents (PDF/Word/Text) with legal restitution demand letter generation.\n\n"
            "Feel free to ask a regulatory compliance question or request a loan calculation!"
        )
        return {
            "query": query,
            "answer": greeting_text,
            "citation": "ReguGraph-UAE Conversational Greeting Gate",
            "refusal_triggered": False,
            "refusal_category": "greeting",
            "is_greeting": True,
            "retrieved_chunks": [],
            "execution_trace": [
                {
                    "step": "Conversational Greeting Gate",
                    "description": "Detected natural conversational greeting. Responded with system greeting and permitted regulatory scope without database retrieval."
                }
            ],
            "latency_ms": 1.5
        }

    # 2. Foreign Jurisdiction Refusal Gate
    if any(re.search(rf"\b{re.escape(ind)}\b", q_lower) for ind in FOREIGN_JURISDICTIONS):
        return {
            "query": query,
            "answer": (
                "ReguGraph-UAE operates exclusively within the **United Arab Emirates (UAE)** legal jurisdiction and is governed strictly by the statutory mandates of the **Central Bank of the UAE (CBUAE)**.\n\n"
                "The submitted inquiry references foreign regulatory bodies (such as UK FCA, US Federal Reserve, Bank of England, or SEC). Our system politely refrains from providing advice on foreign or international jurisdictions."
            ),
            "citation": "Autonomous Statutory Refusal Gate",
            "refusal_triggered": True,
            "refusal_category": "foreign_jurisdiction",
            "is_greeting": False,
            "retrieved_chunks": [],
            "execution_trace": [
                {
                    "step": "Refusal Gate: Foreign Jurisdiction Check",
                    "description": f"Query flagged for referencing foreign non-UAE regulatory authorities: {query}."
                }
            ],
            "latency_ms": 1.2
        }

    # 3. Ungrounded Domain Refusal Gate (Crypto / Speculative)
    if any(re.search(rf"\b{re.escape(ind)}\b", q_lower) for ind in UNGROUNDED_CRYPTO):
        return {
            "query": query,
            "answer": (
                "Topic not found in statutory corpus. CBUAE retail consumer credit regulations do not govern decentralized speculative crypto assets, tokens, staking, or NFTs.\n\n"
                "ReguGraph-UAE is strictly bounded to licensed consumer credit, personal loans, auto loans, residential mortgages, and official fee schedules."
            ),
            "citation": "Autonomous Statutory Refusal Gate",
            "refusal_triggered": True,
            "refusal_category": "ungrounded_domain",
            "is_greeting": False,
            "retrieved_chunks": [],
            "execution_trace": [
                {
                    "step": "Refusal Gate: Crypto / Speculative Topic Filter",
                    "description": "Query flagged for decentralized crypto or speculative assets outside retail credit scope."
                }
            ],
            "latency_ms": 1.1
        }

    # 4. General Off-Topic Non-Financial Refusal Gate
    if any(re.search(rf"\b{re.escape(ind)}\b", q_lower) for ind in OFF_TOPIC_GENERAL):
        return {
            "query": query,
            "answer": (
                "Your inquiry does not appear to pertain to Central Bank of the UAE retail credit regulations, loan auditing, statutory caps, or platform tools.\n\n"
                "To ensure 100% legal precision, I only answer questions related to:\n"
                "- UAE Personal, Auto, and Mortgage loan regulations (Notices 2011/23, 3877/2019, Circulars 8/2020, 31/2013)\n"
                "- Debt Burden Ratio (DBR) 50% cap & early settlement 1% / AED 10,000 cap\n"
                "- Facility sanction document auditing & restitution calculations"
            ),
            "citation": "Autonomous Statutory Refusal Gate",
            "refusal_triggered": True,
            "refusal_category": "off_topic",
            "is_greeting": False,
            "retrieved_chunks": [],
            "execution_trace": [
                {
                    "step": "Refusal Gate: General Off-Topic Check",
                    "description": "Query flagged as non-financial and unrelated to CBUAE banking regulations."
                }
            ],
            "latency_ms": 1.1
        }

    # Check for general domain grounding
    if not ALLOWED_TOPICS_REGEX.search(q_lower):
        # Allow if query contains numerical questions with AED or loan
        if not re.search(r'\b(aed|dirham|percent|%|loan|fee|bank|credit|interest)\b', q_lower):
            return {
                "query": query,
                "answer": (
                    "Your inquiry does not appear to pertain to Central Bank of the UAE retail credit regulations, loan auditing, statutory caps, or platform tools.\n\n"
                    "To ensure 100% legal precision, I only answer questions related to:\n"
                    "- UAE Personal, Auto, and Mortgage loan regulations (Notices 2011/23, 3877/2019, Circulars 8/2020, 31/2013)\n"
                    "- Debt Burden Ratio (DBR) 50% cap & early settlement 1% / AED 10,000 cap\n"
                    "- Facility sanction document auditing & restitution calculations"
                ),
                "citation": "Autonomous Statutory Refusal Gate",
                "refusal_triggered": True,
                "refusal_category": "out_of_scope",
                "is_greeting": False,
                "retrieved_chunks": [],
                "execution_trace": [
                    {
                        "step": "Refusal Gate: Scope Boundary Enforcement",
                        "description": "Query did not match permitted CBUAE regulatory topics or financial terms."
                    }
                ],
                "latency_ms": 1.2
            }

    return None


def execute_unified_rag(query: str, mode: str = "agentic") -> Dict[str, Any]:
    """Master Coordinator: Evaluates guardrails and dispatches to the requested RAG architecture."""
    # Step 1: Guardrail & Greeting Evaluation
    guardrail_res = evaluate_query_guardrails(query)
    if guardrail_res is not None:
        return guardrail_res

    # Normalize mode
    norm_mode = mode.lower().strip()
    if norm_mode not in RAG_MODES_REGISTRY:
        norm_mode = "agentic"

    # Step 2: Dispatch to the selected RAG Engine
    if norm_mode == "hybrid":
        result = run_hybrid_rag(query)
    elif norm_mode == "metadata":
        result = metadata_filtered_rag(query)
    elif norm_mode == "reranking":
        result = run_reranking_rag(query)
    elif norm_mode == "contextual":
        result = run_contextual_chunking_rag(query)
    elif norm_mode == "sql":
        result = execute_sql_rag(query)
    elif norm_mode == "graph":
        result = execute_graph_rag(query)
    elif norm_mode == "crag":
        result = run_corrective_rag(query)
    elif norm_mode == "self_rag":
        result = run_self_rag(query)
    elif norm_mode == "multimodal":
        result = run_multimodal_rag(query)
    elif norm_mode == "agentic":
        result = run_agentic_rag(query)
    else:
        result = run_agentic_rag(query)

    # Standardize result attributes
    result.setdefault("refusal_triggered", False)
    result.setdefault("refusal_category", "in_scope")
    result["is_greeting"] = False
    result["rag_mode"] = norm_mode
    result["rag_metadata"] = RAG_MODES_REGISTRY.get(norm_mode, {})

    # Ensure standardized retrieved_chunks is available across all 10 modes
    if "retrieved_chunks" not in result or not result["retrieved_chunks"]:
        raw_chunks = (
            result.get("ranked_chunks") or
            result.get("matched_chunks") or
            result.get("top_reranked_chunks") or
            result.get("top_contextual_chunks") or
            result.get("vector_chunks") or
            result.get("narrative_chunks") or
            []
        )
        std_chunks = []
        for rc in raw_chunks:
            c = dict(rc)
            if "content" not in c:
                c["content"] = c.get("contextualized_content", c.get("contextualized_preview", ""))
            std_chunks.append(c)
        result["retrieved_chunks"] = std_chunks

    return result
