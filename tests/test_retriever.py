"""Unit tests for Hybrid Retriever (Dense + BM25 + RRF)."""
import pytest
from regugraph.retriever import HybridRetriever
from regugraph.ingestion import load_cbuae_corpus


def test_corpus_loading():
    docs = load_cbuae_corpus()
    assert len(docs) >= 5
    # Verify metadata fields exist
    for d in docs:
        assert "circular_ref" in d.metadata
        assert "article_header" in d.metadata
        assert "category" in d.metadata


def test_hybrid_search_early_settlement():
    retriever = HybridRetriever()
    results = retriever.hybrid_search("early settlement prepayment fee cap 1% AED 10,000", top_k=3)
    assert len(results) > 0
    top = results[0]
    assert "content" in top
    assert "circular_ref" in top
    # Content in top results should mention 1%, 1.0%, prepayment, or early settlement
    assert any("early settlement" in r["content"].lower() or "prepayment" in r["content"].lower() or "1%" in r["content"] or "1.0%" in r["content"] for r in results)


def test_hybrid_search_dbr():
    retriever = HybridRetriever()
    results = retriever.hybrid_search("Debt Burden Ratio DBR 50 percent limit salary", top_k=2)
    assert len(results) > 0
    assert any("50%" in r["content"] or "dbr" in r["content"].lower() for r in results)
