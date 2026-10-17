"""Contextual Chunking RAG Engine for ReguGraph-UAE.
Tech Stack: Python 3.12 · Hierarchical Markdown AST Parser · Contextual Header Enrichment · ChromaDB.
100% Free & Open Source Local Tools (No Paid Anthropic / OpenAI Keys).

Concepts:
- Preserves document-level context when splitting text into chunks.
- When chunks are embedded and retrieved in isolation, standard RAG suffers from 'amnesia' (lacking
  parent document title, circular date, legal jurisdiction, and hierarchical section breadcrumbs).
- Contextual Chunking prepends structured hierarchical metadata breadcrumbs to every chunk:
  `[DOCUMENT BREADCRUMB: CBUAE Authority > Circular No > Section > Target Facility]`
  This enables accurate semantic retrieval and unambiguous LLM generation.
"""
import time
from typing import Dict, Any, List
from langchain_core.documents import Document
from regugraph.ingestion import load_cbuae_corpus
from regugraph.retriever import RobustEmbeddingFunction
from regugraph.agents import RegulatoryLLM
from regugraph.rag.hybrid_rag import clean_chunk_text


def build_contextual_chunk(doc: Document) -> Dict[str, Any]:
    """Enrich a regulatory chunk with explicit hierarchical document breadcrumbs and scope."""
    meta = doc.metadata or {}
    circular = meta.get("circular_ref", "CBUAE Banking Regulation")
    article = meta.get("article_header", "Statutory Rule")
    category = meta.get("category", "retail_banking")
    chunk_id = meta.get("chunk_id", "chunk_unknown")

    # Document-level context mappings
    hierarchy_map = {
        "personal_loans": "CBUAE Retail Banking Regulations > Personal Credit Facilities > Notice 2011/23",
        "auto_loans": "CBUAE Consumer Protection > Vehicle Financing & Asset-Backed Lending > Notice 2011/23 Art 8",
        "mortgages": "CBUAE Real Estate Regulations > Residential Mortgage Loans > Circular 31/2013",
        "early_settlement": "CBUAE Consumer Protection Framework > Early Settlement & Exit Fees > Notice 3877/2019 & Circular 8/2020",
        "fees": "CBUAE Standardized Banking Fee Caps > Consumer Fee Schedule > Circular 8/2020 Annex 2",
        "general_provisions": "CBUAE Banking Supervisory Framework > General Standards"
    }

    breadcrumb = hierarchy_map.get(category, f"CBUAE Regulatory Gazette > {circular} > {article}")
    
    legal_scope = (
        "Applies to all Licensed Financial Institutions (LFIs) and retail consumer borrowers in the United Arab Emirates."
    )

    enriched_content = (
        f"[HIERARCHICAL CONTEXT: {breadcrumb}]\n"
        f"[LEGAL JURISDICTION: United Arab Emirates (UAE Federal Financial Law)]\n"
        f"[REGULATORY MANDATE: {legal_scope}]\n"
        f"[SECTION: {article}]\n\n"
        f"{doc.page_content}"
    )

    return {
        "chunk_id": chunk_id,
        "circular_ref": circular,
        "article_header": article,
        "category": category,
        "breadcrumb": breadcrumb,
        "raw_content": doc.page_content,
        "contextualized_content": enriched_content
    }


class ContextualChunkingIndex:
    """In-memory contextual chunk store with hierarchical indexing."""
    _instance = None

    def __init__(self):
        raw_docs = load_cbuae_corpus()
        self.contextual_chunks: List[Dict[str, Any]] = [build_contextual_chunk(d) for d in raw_docs]
        self.embed_fn = RobustEmbeddingFunction()
        self.chunk_embeddings = self.embed_fn.embed_documents([c["contextualized_content"] for c in self.contextual_chunks])


    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ContextualChunkingIndex()
        return cls._instance

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Search contextualized chunks using cosine similarity."""
        import math
        q_vec = self.embed_fn.embed_query(query)
        scored = []
        for chunk, c_vec in zip(self.contextual_chunks, self.chunk_embeddings):
            dot = sum(a * b for a, b in zip(q_vec, c_vec))
            norm_q = math.sqrt(sum(a * a for a in q_vec)) or 1.0
            norm_c = math.sqrt(sum(b * b for b in c_vec)) or 1.0
            sim = dot / (norm_q * norm_c)
            scored.append((chunk, sim))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [{"chunk": item[0], "similarity": round(item[1], 4)} for item in scored[:top_k]]


def run_contextual_chunking_rag(query: str, top_k: int = 2) -> Dict[str, Any]:
    """Execute Contextual Chunking RAG preserving document-level context and breadcrumbs."""
    start_t = time.perf_counter()
    index = ContextualChunkingIndex.get_instance()
    results = index.search(query, top_k=top_k)

    top_item = results[0]["chunk"] if results else None
    primary_citation = top_item["circular_ref"] if top_item else "CBUAE Codex"
    article_title = top_item["article_header"] if top_item else "Statutory Rule"

    context_str = "\n\n".join([r["chunk"]["contextualized_content"] for r in results])
    llm = RegulatoryLLM()
    answer = ""
    if llm.is_available:
        prompt = (
            f"You are a Compliance Officer at the Central Bank of the UAE.\n"
            f"Use the hierarchical contextualized text below to answer the inquiry.\n"
            f"Always cite the parent circular and hierarchical breadcrumb.\n\n"
            f"CONTEXT:\n{context_str}\n\n"
            f"QUESTION: {query}\n\n"
            f"ANSWER:"
        )
        answer = llm.invoke(prompt).strip()

    if not answer and top_item:
        cleaned = clean_chunk_text(top_item["raw_content"])
        answer = (
            f"**Hierarchical Context:** `{top_item['breadcrumb']}`\n\n"
            f"Under governing regulation **{primary_citation}** ({article_title}):\n\n"
            f"{cleaned}\n\n"
            f"**Document-Level Scope:** This mandate applies specifically across the retail consumer credit portfolio within UAE jurisdiction."
        )

    latency_ms = round((time.perf_counter() - start_t) * 1000.0, 2)

    execution_trace = [
        {
            "step": "1. Hierarchical Context Breadcrumb Injection",
            "description": "Each raw statutory clause was enriched with parent circular, document title, and regulatory hierarchy.",
            "sample_breadcrumb": top_item["breadcrumb"] if top_item else "N/A"
        },
        {
            "step": "2. Contextualized Embedding Generation",
            "description": "Computed dense embeddings over enriched text preserving document-level situational context.",
            "chunks_indexed": len(index.contextual_chunks)
        },
        {
            "step": "3. Context-Preserved Semantic Retrieval",
            "description": f"Retrieved top-{top_k} chunks with unambiguous situational grounding.",
            "top_similarity": results[0]["similarity"] if results else 0.0
        }
    ]

    return {
        "mode": "contextual_chunking_rag",
        "title": "4. Contextual Chunking RAG (Hierarchical Breadcrumbs + Context Preservation)",
        "tech_stack": "Python 3.12 · Hierarchical Markdown AST · Document Context Breadcrumbs · ChromaDB",
        "query": query,
        "answer": answer,
        "citation": primary_citation,
        "top_contextual_chunks": [
            {
                "breadcrumb": r["chunk"]["breadcrumb"],
                "article_header": r["chunk"]["article_header"],
                "circular_ref": r["chunk"]["circular_ref"],
                "similarity": r["similarity"],
                "contextualized_preview": r["chunk"]["contextualized_content"][:300] + "..."
            }
            for r in results
        ],
        "execution_trace": execution_trace,
        "latency_ms": latency_ms
    }
