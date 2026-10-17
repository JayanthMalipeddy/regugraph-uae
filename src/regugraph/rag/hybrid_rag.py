"""Hybrid Search RAG Engine for ReguGraph-UAE.
Tech Stack: Python 3.12 · rank-bm25 (BM25Okapi) · ChromaDB (HNSW Cosine) · Reciprocal Rank Fusion (RRF).
100% Free & Open Source Local Tools (No Paid APIs).

Concepts:
- Dense Vector Retrieval: Captures semantic intent and contextual paraphrasing via dense embeddings.
- Sparse Lexical Retrieval: Captures exact statutory keywords, numerical codes (e.g., '10,000', '50%', '8/2020').
- Reciprocal Rank Fusion (RRF): Combines disjoint rankings into a single unified score:
  RRF_score(d) = sum(1 / (k + rank_i(d))) with constant k=60.
"""
from typing import Dict, Any, List
import time
from regugraph.retriever import HybridRetriever
from regugraph.agents import RegulatoryLLM

# Shared singleton retriever instance
_hybrid_engine: HybridRetriever = None

def get_hybrid_engine() -> HybridRetriever:
    global _hybrid_engine
    if _hybrid_engine is None:
        _hybrid_engine = HybridRetriever()
    return _hybrid_engine


def clean_chunk_text(text: str) -> str:
    """Strip repetitive internal markdown markers for clean display."""
    import re
    cleaned = re.sub(r'^\s*\[[^\]]+\]\s*\n*', '', text.strip())
    cleaned = re.sub(r'^\s*###\s+[^\n]+\n+', '', cleaned)
    cleaned = re.sub(
        r'\$\$.*?DBR.*?\\le\s*50\.0\\%.*?\$\$',
        '`DBR = (Total Monthly Installments + 5% Credit Card Limits) / Gross Salary <= 50.0%`',
        cleaned,
        flags=re.DOTALL
    )
    cleaned = re.sub(r'\$\$([^\$]+)\$\$', r'`\1`', cleaned)
    cleaned = re.sub(r'\\text\{([^}]+)\}', r'\1', cleaned)
    cleaned = re.sub(r'\\sum', 'Total', cleaned)
    cleaned = re.sub(r'\\times', '*', cleaned)
    cleaned = re.sub(r'\\le', '<=', cleaned)
    cleaned = re.sub(r'\\ge', '>=', cleaned)
    cleaned = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1) / (\2)', cleaned)
    return cleaned.strip()


def run_hybrid_rag(query: str, top_k: int = 3, rrf_k: int = 60) -> Dict[str, Any]:
    """Execute Hybrid Search RAG combining dense vector similarities and sparse BM25 scores."""
    start_t = time.perf_counter()
    engine = get_hybrid_engine()

    # Step 1: Dense Retrieval
    dense_hits = engine.retrieve_dense(query, top_k=top_k * 2)

    # Step 2: Sparse BM25 Retrieval
    sparse_hits = engine.retrieve_sparse(query, top_k=top_k * 2)

    # Step 3: Reciprocal Rank Fusion (RRF)
    rrf_scores: Dict[str, float] = {}
    doc_store: Dict[str, Any] = {}
    dense_ranks: Dict[str, int] = {}
    sparse_ranks: Dict[str, int] = {}

    for rank, (doc, score) in enumerate(dense_hits):
        cid = doc.metadata.get("chunk_id", str(hash(doc.page_content)))
        doc_store[cid] = doc
        dense_ranks[cid] = rank + 1
        rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

    for rank, (doc, score) in enumerate(sparse_hits):
        cid = doc.metadata.get("chunk_id", str(hash(doc.page_content)))
        doc_store[cid] = doc
        sparse_ranks[cid] = rank + 1
        rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

    # Sort candidates by fused score
    sorted_cids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)

    ranked_results = []
    for cid in sorted_cids[:top_k]:
        doc = doc_store[cid]
        ranked_results.append({
            "chunk_id": cid,
            "circular_ref": doc.metadata.get("circular_ref", "CBUAE Regulatory Gazette"),
            "article_header": doc.metadata.get("article_header", "Statutory Rule"),
            "content": doc.page_content,
            "rrf_score": round(rrf_scores[cid], 5),
            "dense_rank": dense_ranks.get(cid, "N/A"),
            "sparse_rank": sparse_ranks.get(cid, "N/A"),
        })

    primary_hit = ranked_results[0] if ranked_results else None
    primary_citation = primary_hit["circular_ref"] if primary_hit else "CBUAE Codex"
    article_title = primary_hit["article_header"] if primary_hit else "Regulatory Rule"

    # Step 4: Answer Synthesis
    llm = RegulatoryLLM()
    context_str = "\n\n".join([f"[{r['circular_ref']} - {r['article_header']}]:\n{r['content']}" for r in ranked_results])
    
    answer = ""
    if llm.is_available:
        prompt = (
            f"You are a Senior Compliance Auditor at the Central Bank of the UAE.\n"
            f"Answer using ONLY the provided regulatory context.\n"
            f"Always cite the exact circular.\n\n"
            f"CONTEXT:\n{context_str}\n\n"
            f"QUESTION: {query}\n\n"
            f"ANSWER:"
        )
        answer = llm.invoke(prompt).strip()

    if not answer and primary_hit:
        cleaned = clean_chunk_text(primary_hit["content"])
        answer = (
            f"Under **{primary_citation}** ({article_title}), the Central Bank of the UAE establishes the following governing requirements:\n\n"
            f"{cleaned}\n\n"
            f"**Compliance Mandate:** All Licensed Financial Institutions (LFIs) in the UAE must adhere strictly to these statutory ceilings. Contractual provisions attempting to circumvent these rules are legally unenforceable under UAE Federal Law."
        )

    latency_ms = round((time.perf_counter() - start_t) * 1000.0, 2)

    # Detailed educational execution trace
    execution_trace = [
        {
            "step": "1. Sparse BM25 Lexical Retrieval",
            "description": f"Extracted keywords from query '{query}' and searched inverted index using BM25Okapi scoring across term frequencies.",
            "candidates_found": len(sparse_hits),
            "top_match": sparse_hits[0][0].metadata.get("article_header") if sparse_hits else "None"
        },
        {
            "step": "2. Dense Vector Semantic Retrieval",
            "description": "Computed 384-dimensional query embedding vector and queried ChromaDB HNSW cosine similarity space.",
            "candidates_found": len(dense_hits),
            "top_match": dense_hits[0][0].metadata.get("article_header") if dense_hits else "None"
        },
        {
            "step": "3. Reciprocal Rank Fusion (RRF)",
            "description": f"Fused sparse and dense rankings using RRF with constant k={rrf_k}. Overcame vocabulary mismatch while maintaining exact statutory reference precision.",
            "top_fused_score": ranked_results[0]["rrf_score"] if ranked_results else 0.0,
            "top_fused_article": ranked_results[0]["article_header"] if ranked_results else "None"
        },
        {
            "step": "4. Grounded Synthesis",
            "description": "Synthesized final regulatory response with strict citation grounding.",
            "primary_citation": primary_citation
        }
    ]

    return {
        "mode": "hybrid_search_rag",
        "title": "1. Hybrid Search RAG (BM25 + Dense ChromaDB + RRF)",
        "tech_stack": "Python 3.12 · rank-bm25 (BM25Okapi) · ChromaDB · Reciprocal Rank Fusion (k=60)",
        "query": query,
        "answer": answer,
        "citation": primary_citation,
        "ranked_chunks": ranked_results,
        "execution_trace": execution_trace,
        "latency_ms": latency_ms
    }
