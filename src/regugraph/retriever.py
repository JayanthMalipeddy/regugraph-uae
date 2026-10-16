"""Hybrid Retrieval Engine combining ChromaDB (Dense) + Rank-BM25 (Sparse) with RRF Reranking."""
import re
import math
from typing import List, Dict, Any, Tuple
import chromadb
from rank_bm25 import BM25Okapi
from langchain_core.documents import Document

from .config import (
    CHROMA_DIR,
    OLLAMA_BASE_URL,
    OLLAMA_EMBED_MODEL,
    TOP_K_DENSE,
    TOP_K_SPARSE,
    TOP_K_FINAL,
    RRF_K_CONSTANT
)
from .ingestion import load_cbuae_corpus


class RobustEmbeddingFunction:
    """Embedding adapter that attempts Ollama nomic-embed-text, with deterministic local fallback."""
    def __init__(self):
        self.use_ollama = False
        try:
            import requests
            res = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=1.0)
            if res.status_code == 200:
                self.use_ollama = True
        except Exception:
            self.use_ollama = False

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if self.use_ollama:
            try:
                from langchain_ollama import OllamaEmbeddings
                ollama_embed = OllamaEmbeddings(
                    model=OLLAMA_EMBED_MODEL,
                    base_url=OLLAMA_BASE_URL
                )
                return ollama_embed.embed_documents(texts)
            except Exception:
                pass
        
        # Deterministic 384-dim semantic-hash feature vector fallback
        vectors = []
        for t in texts:
            vec = [0.0] * 384
            words = re.findall(r"\w+", t.lower())
            for i, w in enumerate(words):
                h = hash(w) % 384
                vec[h] += 1.0 / (1.0 + math.log1p(i))
            # Normalize
            norm = math.sqrt(sum(v * v for v in vec)) or 1.0
            vectors.append([v / norm for v in vec])
        return vectors

    def embed_query(self, text: str) -> List[float]:
        return self.embed_documents([text])[0]


class HybridRetriever:
    """Stateful Hybrid Retriever implementing Dense + BM25 + Reciprocal Rank Fusion (RRF)."""
    
    def __init__(self, collection_name: str = "cbuae_regulations"):
        self.collection_name = collection_name
        self.chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        self.embed_fn = RobustEmbeddingFunction()
        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        self.bm25: BM25Okapi = None
        self.documents: List[Document] = []
        self._initialize_index()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b\w+\b", text.lower())

    def _initialize_index(self):
        """Index or update CBUAE corpus in ChromaDB and in-memory BM25 index."""
        docs = load_cbuae_corpus()
        self.documents = docs

        # Setup BM25
        tokenized_corpus = [self._tokenize(doc.page_content) for doc in docs]
        if tokenized_corpus:
            self.bm25 = BM25Okapi(tokenized_corpus)

        # Sync ChromaDB if empty or size mismatch
        current_count = self.collection.count()
        if current_count != len(docs):
            # Clean and reindex
            try:
                self.chroma_client.delete_collection(self.collection_name)
                self.collection = self.chroma_client.create_collection(
                    name=self.collection_name,
                    metadata={"hnsw:space": "cosine"}
                )
            except Exception:
                pass

            ids = [f"doc_{i}" for i in range(len(docs))]
            contents = [d.page_content for d in docs]
            metadatas = [d.metadata for d in docs]
            embeddings = self.embed_fn.embed_documents(contents)

            self.collection.add(
                ids=ids,
                documents=contents,
                embeddings=embeddings,
                metadatas=metadatas
            )

    def retrieve_dense(self, query: str, top_k: int = TOP_K_DENSE) -> List[Tuple[Document, float]]:
        """Vector similarity search using ChromaDB."""
        query_vec = self.embed_fn.embed_query(query)
        results = self.collection.query(
            query_embeddings=[query_vec],
            n_results=min(top_k, self.collection.count())
        )
        dense_results = []
        if results and results["documents"]:
            for text, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
                score = 1.0 - dist if dist is not None else 0.5
                dense_results.append((Document(page_content=text, metadata=meta), score))
        return dense_results

    def retrieve_sparse(self, query: str, top_k: int = TOP_K_SPARSE) -> List[Tuple[Document, float]]:
        """Lexical keyword search using BM25."""
        if not self.bm25 or not self.documents:
            return []
        
        tokenized_query = self._tokenize(query)
        scores = self.bm25.get_scores(tokenized_query)
        scored_docs = list(zip(self.documents, scores))
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        return scored_docs[:top_k]

    def hybrid_search(
        self,
        query: str,
        top_k: int = TOP_K_FINAL,
        rrf_k: int = RRF_K_CONSTANT
    ) -> List[Dict[str, Any]]:
        """Reciprocal Rank Fusion (RRF) combining Dense and Sparse scores."""
        dense_hits = self.retrieve_dense(query, top_k=TOP_K_DENSE)
        sparse_hits = self.retrieve_sparse(query, top_k=TOP_K_SPARSE)

        rrf_scores: Dict[str, float] = {}
        doc_store: Dict[str, Document] = {}

        # Accumulate RRF scores from Dense ranks
        for rank, (doc, score) in enumerate(dense_hits):
            cid = doc.metadata.get("chunk_id", str(hash(doc.page_content)))
            doc_store[cid] = doc
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # Accumulate RRF scores from Sparse BM25 ranks
        for rank, (doc, score) in enumerate(sparse_hits):
            cid = doc.metadata.get("chunk_id", str(hash(doc.page_content)))
            doc_store[cid] = doc
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # Sort by final fused RRF score
        sorted_cids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
        
        final_results = []
        for cid in sorted_cids[:top_k]:
            doc = doc_store[cid]
            final_results.append({
                "content": doc.page_content,
                "metadata": doc.metadata,
                "rrf_score": round(rrf_scores[cid], 5),
                "circular_ref": doc.metadata.get("circular_ref", "CBUAE Regulation"),
                "article_header": doc.metadata.get("article_header", "Standard Article")
            })

        return final_results
