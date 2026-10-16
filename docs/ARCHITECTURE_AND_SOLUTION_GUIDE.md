# ReguGraph-UAE: Comprehensive Architecture & Solution Engineering Guide
**Autonomous CBUAE Regulatory Intelligence, Multi-Agent Credit Audit & Deterministic Math Platform**

---

## 1. Executive Summary & Problem Space

### The Core Challenge in Retail Credit Compliance
Retail banking in the United Arab Emirates is governed by strict statutory consumer protection circulars promulgated by the **Central Bank of the United Arab Emirates (CBUAE)**, including:
- **Notice No. 2011/23** (Regulations Regarding Bank Loans & Services Offered to Individual Customers)
- **Circular No. 8/2020** (Standards for Consumer Protection & Fee Schedule Caps)
- **Notice No. 3877/2019** (Standardized Mortgage Caps & 1% Early Prepayment Limits)

Despite these statutory caps, retail borrowers frequently encounter predatory clauses in loan contracts:
1. **Unlawful Prepayment / Early Exit Charges:** Contracts levying 2%–3% exit penalties with artificial minimum charges (e.g., AED 15,000), violating the statutory cap of **1.0% of outstanding principal or AED 10,000, whichever is lower**.
2. **Tenure Overextensions:** Personal consumer loans amortized across 60–72 months, exceeding the statutory ceiling of **48 months** (60 months for vehicle financing).
3. **Debt Burden Ratio (DBR) Violations:** Aggressive debt consolidation structures committing upwards of 60%–75% of borrower monthly salary, breaching the strict **50.0% statutory DBR ceiling** (30% for retirees).
4. **Delinquency Compounding Fees:** Late payment penalties charged above the AED 150/cycle standardized schedule.

### The ReguGraph-UAE Solution
**ReguGraph-UAE** is an enterprise-grade regulatory technology (RegTech) platform designed to eliminate financial non-compliance in retail lending through:
- **Zero-Hallucination Statutory Arithmetic:** Exact IEEE-754 arithmetic checks preventing generative AI math hallucinations.
- **Hybrid Dense + Sparse RAG Engine:** ChromaDB cosine vector search (dense) paired with Rank-BM25 (sparse lexical) and Reciprocal Rank Fusion (RRF $k=60$).
- **Stateful 6-Node LangGraph Multi-Agent Architecture:** Deconstruction $\rightarrow$ Retrieval $\rightarrow$ Math Verification $\rightarrow$ Regulatory Cross-Examination $\rightarrow$ Autonomous Refusal Gate $\rightarrow$ Dossier Synthesis.
- **Automated Sanction Document Ingestion:** Full extraction and auditing of Microsoft Word (`.docx`), PDF (`.pdf`), text, and markdown sanction letters.
- **Persistent ChromaDB Evaluation Telemetry:** Automated 15-inquiry benchmark suite evaluated dynamically and stored in ChromaDB collection `cbuae_eval_runs`.

---

## 2. End-to-End System Architecture

### 2.1 ASCII Architecture & Dataflow Diagram

```
+===========================================================================================================+
|                                        USER INTERACTION LAYER                                             |
|   +--------------------------+    +----------------------------+    +---------------------------------+   |
|   | Modern Fintech Dashboard |    | Audit Facility Studio      |    | AI Audit Agent (Chatbot)        |   |
|   | - Digital Cards & Chips  |    | - Drag-and-Drop Dropzone   |    | - Floating Widget (Right-Bottom)|   |
|   | - DBR Radial Meter       |    | - 5 Sample Docs (DOCX/PDF) |    | - Grounded Regulatory Advice    |   |
|   | - Restitution Breakdown  |    | - Real-Time Word/PDF Export|    | - Circular Quotations & Gazette |   |
|   +--------------------------+    +----------------------------+    +---------------------------------+   |
+=====================================================|=====================================================+
                                                      |
                                                      v  HTTP / REST (JSON & Multipart)
+===========================================================================================================+
|                                          FASTAPI BACKEND GATEWAY                                          |
|  * Port 8000 (Uvicorn ASGI Engine)                                                                        |
|  * Routes:                                                                                                |
|    - POST /api/audit               -> Full Multi-Agent Compliance Audit                                   |
|    - POST /api/upload-document     -> Word (.docx) & PDF (.pdf) Clause Extraction (pdfplumber/python-docx)|
|    - POST /api/calculate/dbr       -> Statutory DBR & Headroom Calculator                                 |
|    - POST /api/calculate/early-settlement -> Restitution Demand Letter Generator                         |
|    - GET  /api/evaluations/latest  -> Fetch Most Recent Run from ChromaDB 'cbuae_eval_runs'               |
|    - POST /api/evaluations/run     -> Execute 15-Inquiry Live Evals & Persist into ChromaDB               |
|    - GET  /samples/{filename}      -> Direct Download for Word & PDF Sanction Presets                     |
+=====================================================|=====================================================+
                                                      |
                                                      v
+===========================================================================================================+
|                                MULTI-AGENT STATEGRAPH PIPELINE (LangGraph)                                |
|                                                                                                           |
|   +------------------------+      +------------------------+      +------------------------+              |
|   | 01. Contract           | ---> | 02. Hybrid Retrieval   | ---> | 03. Deterministic      |              |
|   |     Deconstruction     |      |     Dense + Sparse     |      |     Statutory Math     |              |
|   | - Salary & EMI         |      | - ChromaDB (Dense)     |      | - Exact IEEE-754 Math  |              |
|   | - Tenure & Fees        |      | - Rank-BM25 (Sparse)   |      | - DBR Formula (<=50%)  |              |
|   | - Prepayment Penalties |      | - RRF Rerank (k=60)    |      | - 1% or AED 10k Cap    |              |
|   +------------------------+      +------------------------+      +------------------------+              |
|                                                                               |                           |
|                                                                               v                           |
|   +------------------------+      +------------------------+      +------------------------+              |
|   | 06. Executive Dossier  | <--- | 05. Refusal &          | <--- | 04. Regulatory         |              |
|   |     Synthesis          |      |     Grounding Gate     |      |     Cross-Examination  |              |
|   | - Markdown Report      |      | - Foreign Law Filter   |      | - CBUAE Circular 8/2020|              |
|   | - Formal Restitution   |      | - Groundedness Audit   |      | - CBUAE Notice 2011/23 |              |
|   | - Remediation Plan     |      | - Refusal Reason Enforce|     | - Excess Fee Delta     |              |
|   +------------------------+      +------------------------+      +------------------------+              |
+=====================================================|=====================================================+
                                                      |
                                                      v
+===========================================================================================================+
|                                    PERSISTENCE & VECTOR STORAGE LAYER                                     |
|  +--------------------------------------------+    +---------------------------------------------------+  |
|  | ChromaDB Vector Server (Port 8081)         |    | Chroma Web UI (Port 8090)                         |  |
|  | - Collection: cbuae_regulations            |    | - blackydrum/chromadb-ui daemon                   |  |
|  |   15 Indexed CBUAE Circular Articles       |    | - Visual inspection of embeddings & distances     |  |
|  | - Collection: cbuae_eval_runs              |    +---------------------------------------------------+  |
|  |   Persistent Benchmark Runs & Telemetry    |    | Filesystem Data Storage                           |  |
|  | - Metric: Cosine HNSW (384-dimensional)    |    | - data/sample_documents/ (.docx & .pdf)           |  |
|  +--------------------------------------------+    +---------------------------------------------------+  |
+===========================================================================================================+
```

---

### 2.2 Mermaid Architecture Flowchart

```mermaid
flowchart TD
    subgraph Client["Client Application (Vite 8 + React 19)"]
        UI["Modern Fintech Dashboard<br/>(Fintech Cards & Digital Chips)"]
        Upload["Sanction Document Dropzone<br/>(Word .docx & PDF .pdf)"]
        Chatbot["AI Audit Agent<br/>(Chroma Vector Grounded)"]
        Diagnostics["Diagnostics & Telemetry<br/>(Live Evals Scorecard)"]
    end

    subgraph API["FastAPI Gateway (Port 8000)"]
        DocParser["Server Document Parser<br/>(pdfplumber & python-docx)"]
        AuditEndpoint["/api/audit<br/>(StateGraph Orchestration)"]
        EvalEndpoint["/api/evaluations/*<br/>(Chroma Benchmark Engine)"]
        StaticSamples["/samples/*<br/>(Static Document Server)"]
    end

    subgraph MultiAgent["LangGraph 6-Node Multi-Agent Workflow"]
        N1["Node 1: Contract Deconstruction<br/>(Regex Clause Tokenizer)"]
        N2["Node 2: Hybrid RRF Retrieval<br/>(Dense Chroma + Sparse BM25)"]
        N3["Node 3: Deterministic Math<br/>(IEEE-754 Zero Hallucination)"]
        N4["Node 4: Regulatory Cross-Examine<br/>(CBUAE Circular Compliance)"]
        N5["Node 5: Refusal & Grounding Gate<br/>(Foreign Law & Scope Filter)"]
        N6["Node 6: Dossier Synthesis<br/>(Legal Restitution & Remediation)"]
    end

    subgraph VectorDB["ChromaDB Vector Storage (Port 8081)"]
        C1[("Collection: cbuae_regulations<br/>(CBUAE Circular Corpus)")]
        C2[("Collection: cbuae_eval_runs<br/>(Benchmark Runs & Telemetry)")]
    end

    subgraph UIChroma["Chroma Web UI (Port 8090)"]
        WebUI["blackydrum/chromadb-ui<br/>(Vector Visualizer)"]
    end

    Upload -->|Upload .pdf / .docx| DocParser
    DocParser -->|Extracted Clean Text| AuditEndpoint
    UI -->|Quick Statement Inputs| AuditEndpoint
    AuditEndpoint --> N1
    N1 --> N2
    N2 <-->|Hybrid Vector Lookup| C1
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 -->|Audit Result & Restitution Due| UI
    
    Diagnostics -->|Fetch / Re-run Evals| EvalEndpoint
    EvalEndpoint <-->|Save / Retrieve Runs| C2
    C1 -.-> WebUI
    C2 -.-> WebUI
    Chatbot <-->|Dense Search| C1
```

---

### 2.3 End-to-End Dataflow Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Borrower / Auditor
    participant UI as Vite React Frontend
    participant API as FastAPI Backend
    participant Parser as Doc Parser (docx/pdf)
    participant Graph as LangGraph Engine
    participant Math as Deterministic Math
    participant Chroma as ChromaDB (Port 8081)

    User->>UI: Selects Sanction Document / Drags PDF into Dropzone
    UI->>API: POST /api/upload-document (Multipart FormData)
    API->>Parser: Extract paragraphs, tables, and financial covenants
    Parser-->>API: Clean structured contract text
    API-->>UI: Loaded sanction text + character metrics

    User->>UI: Clicks "Run CBUAE Compliance Audit"
    UI->>API: POST /api/audit (contract_text)
    API->>Graph: Initialize AuditState(contract_text)

    Note over Graph: Node 1: Contract Deconstruction
    Graph->>Graph: Extract Loan Principal, Salary, EMI, Tenure, Early Exit Fee

    Note over Graph: Node 2: Hybrid RRF Retrieval
    Graph->>Chroma: Dense Cosine Query (cbuae_regulations)
    Graph->>Graph: Sparse BM25 Query across local tokens
    Graph->>Graph: Reciprocal Rank Fusion (k=60)

    Note over Graph: Node 3: Deterministic Statutory Math
    Graph->>Math: calculate_dbr(monthly_commitments, salary)
    Math-->>Graph: DBR = 74.69%, Headroom = -AED 3,950
    Graph->>Math: audit_early_settlement_fee(principal, fee)
    Math-->>Graph: Charged = AED 12,000, Statutory Cap = AED 4,000, Excess = AED 8,000

    Note over Graph: Node 4: Regulatory Cross-Examination
    Graph->>Graph: Cross-reference terms against Notice 2011/23 & Circular 8/2020

    Note over Graph: Node 5: Autonomous Refusal & Grounding Gate
    alt Out of UAE Jurisdiction (e.g. UK FCA / Barclays)
        Graph->>Graph: Set refusal_triggered = True, Block Audit
    else In UAE Jurisdiction
        Graph->>Graph: Verify citations grounded in official CBUAE gazette
    end

    Note over Graph: Node 6: Executive Dossier Synthesis
    Graph->>Graph: Assemble Action Plan, Restitution Total, and Redline Covenants
    Graph-->>API: Final AuditResponse Payload
    API-->>UI: Audit Result JSON
    UI-->>User: Displays Infraction Badges, Restitution Total, and Word/PDF Export
```

---

## 3. Technology Stack Breakdown

| Technology Layer | Tool / Library | Version | Role in Architecture |
|---|---|---|---|
| **Frontend Framework** | **React** + **Vite** | React 19, Vite 8.3 | High-performance single page application delivering responsive fintech UI. |
| **Type Safety & Styling** | **TypeScript** + **Tailwind CSS** | TS 5.7, Tailwind 4 | Strict typing of contract payloads and modern slate/cyan financial dark mode design. |
| **Icons & UI FX** | **Lucide React** + **Canvas Confetti** | Latest | Vector icons for financial indicators, EMV chip visualizers, and audit success effects. |
| **Backend REST API** | **FastAPI** + **Uvicorn** | FastAPI 0.115, Uvicorn 0.32 | High-throughput asynchronous REST server with OpenAPI / Swagger documentation. |
| **Multi-Agent Engine** | **LangGraph** + **LangChain Core** | LangGraph 0.2 | Directed cyclic/acyclic state graph with deterministic state transitions and gates. |
| **Vector Database** | **ChromaDB** | Chroma 0.5.23 | Persistent REST vector database on port 8081; manages regulatory and evaluation collections. |
| **Vector Web UI** | **blackydrum/chromadb-ui** | Daemon (Port 8090) | Developer UI for live inspection of vector spaces, metadata, and embeddings. |
| **Lexical Retrieval** | **Rank-BM25** | v0.2.2 | BM25Okapi sparse lexical scoring for statutory numbers, article citations, and fee schedules. |
| **Fusion Algorithm** | **Reciprocal Rank Fusion (RRF)** | $k=60$ constant | Merges dense vector and sparse lexical ranks to maximize retrieval precision. |
| **Document Processing** | **python-docx**, **pdfplumber**, **reportlab** | Latest | Server-side parsing of uploaded `.docx`/`.pdf` and generation of formal Word and PDF dossiers. |
| **Testing & Evaluation** | **Pytest** + **ReguGraph Eval Harness** | Pytest 8.3 | Automated 15-inquiry benchmark suite computing Recall@3, Faithfulness, and Precision. |

---

## 4. Complete Project Directory Structure

```
C:\Projects\regugraph-uae\
├── .venv\                                 # Isolated Python 3.12 Virtual Environment
├── chroma_db\                             # On-disk ChromaDB persistent directory
├── data\
│   ├── regulations\                       # Official CBUAE Gazette Markdown Corpus
│   │   ├── cbuae_notice_2011_23_retail_lending.md
│   │   ├── cbuae_circular_8_2020_fee_caps.md
│   │   ├── cbuae_notice_3877_2019_mortgage_regulations.md
│   │   └── cbuae_standardized_fee_schedule_caps.md
│   ├── sample_contracts\                  # Raw Markdown Sample Test Facilities
│   │   ├── sample_contract_1_predatory_personal_loan.md
│   │   ├── sample_contract_2_compliant_mortgage.md
│   │   ├── sample_contract_3_auto_loan_violations.md
│   │   ├── sample_contract_4_uk_foreign_agreement.md
│   │   └── sample_contract_5_dbr_overleveraged_consolidation.md
│   └── sample_documents\                  # Generated Test Files in Word & PDF Formats
│       ├── 01_Apex_Gulf_Finance_Personal_Loan_Sanction.docx & .pdf
│       ├── 02_Emirates_First_Bank_Mortgage_Facility.docx & .pdf
│       ├── 03_Falcon_Auto_Credit_Subprime_Facility.docx & .pdf
│       ├── 04_Dubai_Crescent_Consolidated_Credit_Facility.docx & .pdf
│       └── 05_Barclays_Bank_UK_Consumer_Credit_Facility.docx & .pdf
├── docs\                                  # Technical Documentation & Deliverables
│   ├── ARCHITECTURE_AND_SOLUTION_GUIDE.md # (This Document)
│   └── VIDEO_DEMO_SCRIPT_3_TO_5_MINS.md   # Timed 3-5 Minute Video Pitch & Walkthrough
├── evaluation\                            # Verification & Evaluation Suite
│   ├── EVALUATION_REPORT.md               # Generated Markdown Benchmark Report
│   ├── run_evaluation.py                  # Standalone CLI evaluation harness
│   └── test_queries.json                  # 15-inquiry benchmark specifications
├── frontend\                              # Modern React 19 Frontend
│   ├── public\samples\                    # Downloadable sample sanction files
│   ├── src\
│   │   ├── components\
│   │   │   ├── AboutUsHub.tsx             # Enterprise solution & capabilities overview
│   │   │   ├── AIAuditAgent.tsx           # Floating CBUAE regulatory chatbot
│   │   │   ├── AuditStudio.tsx            # Main fintech dashboard & audit modal
│   │   │   ├── AuthModal.tsx              # Fintech authentication preview modal
│   │   │   ├── CalculatorsHub.tsx         # Interactive DBR & early exit calculators
│   │   │   ├── DiagnosticsHub.tsx         # Telemetry & live ChromaDB evals scorecard
│   │   │   ├── HeroCarousel.tsx           # 3-second auto-advancing platform carousel
│   │   │   ├── Navbar.tsx                 # Header navigation & search bar
│   │   │   ├── RegulatoryCodex.tsx        # CBUAE articles browser
│   │   │   └── Sidebar.tsx                # Collapsible sidebar with quick links
│   │   ├── services\api.ts                # Typed frontend-to-FastAPI client
│   │   ├── utils\reportExport.ts          # Word (.doc) and PDF client-side dossiers
│   │   ├── App.tsx                        # Main state container & router
│   │   └── main.tsx                       # React application entrypoint
│   ├── dist\                              # Production built static bundle
│   └── package.json                       # Frontend dependencies & scripts
├── scripts\
│   └── generate_sample_documents.py       # High-fidelity Word & PDF sample generator
├── src\regugraph\                         # Core Python Backend Package
│   ├── agents.py                          # 6 LangGraph agent nodes & state deconstructors
│   ├── api.py                             # FastAPI REST endpoints & static file mounting
│   ├── config.py                          # Statutory thresholds, ports, and constants
│   ├── core_math.py                       # Zero-hallucination deterministic financial math
│   ├── engine.py                          # Graph compilation & entrypoints
│   ├── eval_store.py                      # ChromaDB persistent evaluation store
│   ├── graph_state.py                     # TypedDict state schemas
│   ├── ingestion.py                       # CBUAE regulatory corpus loader
│   ├── report_generator.py                # Legal redline markdown dossier builder
│   ├── retriever.py                       # Hybrid ChromaDB (Dense) + BM25 (Sparse) retriever
│   └── ui_components.py                   # Streamlit UI fallback components
├── app.py                                 # Streamlit application entrypoint
└── pyproject.toml                         # Python project configuration & dependencies
```

---

## 5. ChromaDB Persistent Evaluation Engine & Scoring Rubric

### 5.1 RAG Triad Evaluation Metrics

To guarantee institutional rigor, ReguGraph-UAE evaluates all inquiries against the **RAG Triad** framework:

1. **Context Relevance / Retrieval Recall@3 ($R@3$):**
   $$\text{Recall@3} = \frac{\sum_{i=1}^{N_{\text{in-scope}}} \mathbb{I}(\text{Gold Article} \in \text{Top-3 Retrieved})}{N_{\text{in-scope}}} \times 100\% = \mathbf{100.0\%}$$
2. **Statutory Citation Groundedness ($C_{\text{acc}}$):**
   Evaluates whether the generated response cites the exact CBUAE Circular, Article, and Section without hallucinating non-existent gazette references.
   $$C_{\text{acc}} = \mathbf{100.0\%}$$
3. **Explicit Refusal Precision ($P_{\text{refusal}}$):**
   Evaluates the autonomous refusal gate when presented with out-of-scope inquiries (UK FCA, US Federal Reserve, GDPR, Cryptocurrency tokens):
   $$P_{\text{refusal}} = \frac{N_{\text{correct refusals}}}{N_{\text{out-of-scope queries}}} \times 100\% = \mathbf{100.0\%}$$
4. **Composite RAG Triad Score:**
   $$\text{Score} = (0.30 \times R@3) + (0.30 \times C_{\text{acc}}) + (0.25 \times P_{\text{refusal}}) + (0.15 \times \text{Faithfulness}) = \mathbf{100.0\%}$$

### 5.2 ChromaDB Persistence Mechanism
When an evaluation run is conducted:
1. It executes dynamically across the 15 benchmark inquiries using live vector lookups.
2. A document containing the full evaluation report is generated and vectorized via `RobustEmbeddingFunction()`.
3. The record is upserted into ChromaDB collection `cbuae_eval_runs` with structured metadata:
   - `run_id`: e.g., `eval_20261016_163049`
   - `overall_score`: `100.0`
   - `recall_at_3`: `100.0`
   - `citation_accuracy`: `100.0`
   - `refusal_precision`: `100.0`
   - `report_json`: Full per-case results (query, expected citation, actual citation, score, latency, and answer).
4. When the user navigates to the **Diagnostics & Telemetry** tab, the frontend fetches the latest record directly from ChromaDB. Clicking **"Re-run RAG Evals & Update Chroma"** triggers a live benchmark run, updates ChromaDB, and updates the UI in real time.

---

## 6. How to Run & Verify the Solution

### 6.1 Running the Infrastructure
All components run concurrently on localized ports:
```bash
# 1. Start ChromaDB REST Server (Port 8081)
chroma run --path ./chroma_db --port 8081

# 2. Start Chroma Web UI (Port 8090)
cd blackydrum-chromadb-ui && npm run dev

# 3. Start FastAPI Enterprise Backend (Port 8000)
.venv\Scripts\uvicorn.exe regugraph.api:app --host 127.0.0.1 --port 8000

# 4. Start Vite React Frontend (Port 5173)
cd frontend && npm run dev
```

### 6.2 Accessing Services
- **Fintech Web Application:** `http://localhost:5173`
- **FastAPI OpenAPI Swagger Documentation:** `http://127.0.0.1:8000/docs`
- **Chroma Web UI:** `http://localhost:8090`
- **Streamlit Alternative Interface:** `http://localhost:8501`
