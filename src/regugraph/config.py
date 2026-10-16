"""Configuration parameters and environment settings for ReguGraph-UAE."""
import os
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
REGULATIONS_DIR = DATA_DIR / "cbuae_regulations"
SAMPLE_CONTRACTS_DIR = DATA_DIR / "sample_contracts"
CHROMA_DIR = PROJECT_ROOT / "chroma_db"
EVALUATION_DIR = PROJECT_ROOT / "evaluation"

# ChromaDB Server Settings (Connecting to local Chroma server on port 8081)
CHROMA_HOST = os.environ.get("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.environ.get("CHROMA_PORT", "8081"))

# Ensure directories exist
for p in [DATA_DIR, REGULATIONS_DIR, SAMPLE_CONTRACTS_DIR, CHROMA_DIR, EVALUATION_DIR]:
    p.mkdir(parents=True, exist_ok=True)

# Model Settings
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:latest")
OLLAMA_EMBED_MODEL = os.environ.get("OLLAMA_EMBED_MODEL", "nomic-embed-text")

# Alternative Cloud LLM Settings (Pluggable via env)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

# Retrieval & Chunking Hyperparameters (Aligned with Week 2 Framework)
CHUNK_SIZE = 650            # Tokens / chars capacity matching
CHUNK_OVERLAP = 120         # Overlap to preserve clause context
TOP_K_DENSE = 5             # Top-k vector matches
TOP_K_SPARSE = 5            # Top-k BM25 keyword matches
TOP_K_FINAL = 3             # Top-k reranked fused output
RRF_K_CONSTANT = 60         # Standard Reciprocal Rank Fusion constant

# Statutory Thresholds (Central Bank of UAE)
MAX_DBR_PERCENT = 50.0      # Statutory maximum 50% Debt Burden Ratio
MAX_PERSONAL_LOAN_TENURE = 48  # Months
MAX_AUTO_LOAN_TENURE = 60      # Months
MAX_MORTGAGE_TENURE = 300      # 25 Years (300 Months)
MAX_EARLY_SETTLEMENT_PCT = 1.0 # 1.0% of outstanding principal
MAX_EARLY_SETTLEMENT_CAP_AED = 10_000.0 # Absolute cap AED 10,000
MAX_PERSONAL_PROCESSING_FEE_PCT = 1.0   # 1.0% of loan
MAX_PERSONAL_PROCESSING_FEE_CAP_AED = 2_500.0 # AED 2,500 cap
MAX_LATE_FEE_CAP_AED = 150.0  # AED 150 cap per occurrence
