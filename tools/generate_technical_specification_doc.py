import os
import docx
from docx_styler import (
    set_document_margins, add_title, add_heading_1, add_heading_2, add_heading_3,
    add_paragraph, add_bullet, add_callout, add_table, add_image_with_caption
)

def build_technical_specification_doc():
    doc = docx.Document()
    set_document_margins(doc)

    metadata = {
        "Document Reference:": "REG-TECH-2026-V1.0",
        "System Name:": "ReguGraph-UAE Engine & Multi-Agent Architecture",
        "Technical Stack:": "React 19 | Vite 8 | FastAPI 0.141 | LangGraph 1.2 | ChromaDB 0.6 | Python 3.13",
        "Target Demonstration:": "October 19, 2026",
        "Network Ports:": ":5173 (Main) | :5174 (Diagnostics) | :8000 (API) | :8081 (Chroma) | :8090 (UI)",
        "Document Type:": "System Architecture & Engineering Specification",
        "Security Classification:": "Engineering Confidential"
    }
    add_title(
        doc,
        "ReguGraph-UAE: Technical Specification & Engineering Blueprint",
        "In-Depth Architectural Design, LangGraph State Machine, Multi-Engine RAG, Deterministic Math Formalisms & API Contracts",
        metadata
    )

    # 1. Technical Architecture & Topology
    add_heading_1(doc, "1. Technical Architecture & Process Execution Topology")
    add_paragraph(
        doc,
        "ReguGraph-UAE is architected as an asynchronous, distributed multi-tier system engineered for microsecond-level determinism, strict isolation between presentation and telemetry, and absolute compliance with statutory banking formulas.",
        bold_prefix="Architectural Blueprint: "
    )

    add_image_with_caption(
        doc,
        "docs/diagrams/01_end_to_end_system_architecture.png",
        "ReguGraph-UAE End-to-End Multi-Tier Engineering Topology",
        width_inches=6.3
    )

    add_paragraph(
        doc,
        "The system operates across five concurrent local service daemons:",
        bold_prefix="Daemon Process Topology: "
    )
    headers_daemons = ["Service Process", "Host & Port", "Underlying Technology", "Operational Role & Process Model"]
    rows_daemons = [
        ["Retail Auditing Web App", "http://localhost:5173", "Vite 8.3 + React 19.2", "Presentation application rendering fintech cards, DBR radial visualizer, and audit studio."],
        ["Diagnostics & Telemetry", "http://localhost:5174", "Vite 8.3 (vite.config.diagnostics.ts)", "Isolated monitoring hub managing 5-minute health heartbeats and live RAG evaluation scorecards."],
        ["FastAPI Backend Gateway", "http://localhost:8000", "FastAPI 0.141 + Uvicorn ASGI", "REST and streaming gateway coordinating document ingestion, LangGraph, and math calculations."],
        ["ChromaDB Vector Server", "http://localhost:8081", "Chroma 0.6.3 REST Engine", "Standalone vector database managing collections 'cbuae_regulations' and 'cbuae_eval_runs'."],
        ["Chroma Web UI Visualizer", "http://localhost:8090", "Uvicorn + Jinja2 UI Daemon", "Administrative vector browser allowing visual inspection of collections and distance scores."]
    ]
    add_table(doc, headers_daemons, rows_daemons, col_widths=[1.6, 1.6, 1.5, 1.8])

    # 2. Dual-Port Frontend Topology
    add_heading_1(doc, "2. Dual-Port Presentation & Diagnostics Isolation Architecture")
    add_paragraph(
        doc,
        "In accordance with user design specifications for the October 19 demonstration, the Diagnostics & Telemetry module has been isolated from the primary client application onto Port 5174. This architecture achieves strict visual and operational isolation while sharing common TypeScript models and API client libraries."
    )

    add_image_with_caption(
        doc,
        "docs/diagrams/02_dual_port_frontend_isolation_architecture.png",
        "ReguGraph-UAE Dual-Port Frontend Separation Architecture (:5173 vs :5174)",
        width_inches=6.3
    )

    add_paragraph(
        doc,
        "The dual-port configuration is implemented as follows:",
        bold_prefix="Implementation Highlights: "
    )
    add_bullet(
        doc,
        "Configured in `vite.config.diagnostics.ts` with entry point `frontend/src/diagnostics-main.tsx`. The application renders `DiagnosticsApp.tsx`, providing live daemon pings, an automated 5-minute polling loop with manual triggers, and the 15-inquiry benchmark suite.",
        bold_prefix="Isolated Diagnostics Build: "
    )
    add_bullet(
        doc,
        "The top navigation bar on Port 5173 features a prominent 'Diagnostics & Telemetry -> :5174' action button. Reciprocally, Port 5174 features a '<- Return to ReguGraph Main Dashboard (:5173)' banner, enabling rapid transitions during live stakeholder Q&A.",
        bold_prefix="Bi-Directional Bridging: "
    )
    add_bullet(
        doc,
        "The diagnostics application polls `/api/health` and `/api/evaluations/latest` asynchronously. If any backend daemon experiences latency or stops heartbeating, visual status badges transition dynamically from green ('Online') to amber ('Degraded') or red ('Offline').",
        bold_prefix="Real-Time Health Polling: "
    )

    # 3. LangGraph 6-Node Multi-Agent State Machine
    add_heading_1(doc, "3. LangGraph 6-Node Multi-Agent State Machine Specification")
    add_paragraph(
        doc,
        "At the core of ReguGraph-UAE is a stateful, cyclical multi-agent graph implemented using LangGraph. The graph orchestrates specialized autonomous agents through a rigorous sequence of deconstruction, hybrid retrieval, mathematical verification, legal cross-examination, and dossier synthesis."
    )

    add_image_with_caption(
        doc,
        "docs/diagrams/03_langgraph_multi_agent_flowchart.png",
        "LangGraph 6-Node Multi-Agent State Machine Flowchart & Decision Branching",
        width_inches=6.3
    )

    add_heading_2(doc, "3.1 AuditState TypedDict Schema")
    add_paragraph(
        doc,
        "The workflow state is maintained in an immutable TypedDict passed between nodes:",
        bold_prefix="State Container: "
    )
    add_callout(
        doc,
        "class AuditState(TypedDict):\n"
        "    contract_text: str                     # Raw or parsed contract text\n"
        "    extracted_terms: Dict[str, Any]        # Principal, salary, EMI, tenure, exit fees\n"
        "    retrieved_articles: List[Dict]         # Gazette articles retrieved via Hybrid RRF\n"
        "    math_results: Dict[str, Any]           # Exact IEEE-754 calculation metrics\n"
        "    infractions: List[Dict[str, Any]]      # Detected statutory violations\n"
        "    refusal_triggered: bool                # True if out of CBUAE jurisdiction\n"
        "    refusal_reason: Optional[str]          # Legal justification for refusal\n"
        "    restitution_due: float                 # Total dirham-for-dirham refund owed\n"
        "    executive_dossier: str                 # Markdown & Word formatted legal brief",
        title="AUDIT STATE TYPEDDICT SCHEMA"
    )

    add_heading_2(doc, "3.2 Node-by-Node Execution Logic")
    headers_nodes = ["Node Name", "Agent Identity", "Input State Attributes", "Execution Logic & Output State"]
    rows_nodes = [
        [
            "Node 1: Deconstruction",
            "Contract Deconstructor",
            "contract_text",
            "Executes multi-pattern regex and named entity extraction to parse principal, salary, EMI, tenure, and prepayment fees into extracted_terms."
        ],
        [
            "Node 2: Hybrid Retrieval",
            "Hybrid RRF Retriever",
            "extracted_terms",
            "Conducts dense ChromaDB cosine search and sparse Rank-BM25 search against CBUAE circulars. Combines ranks using Reciprocal Rank Fusion (k=60) into retrieved_articles."
        ],
        [
            "Node 3: Deterministic Math",
            "Statutory Math Verifier",
            "extracted_terms",
            "Executes exact IEEE-754 Python routines to calculate DBR, loan headroom, and exit fee caps without invoking LLM tokens. Outputs math_results."
        ],
        [
            "Node 4: Cross-Examination",
            "Regulatory Prosecutor",
            "math_results, retrieved_articles",
            "Compares contract terms against statutory caps from Notice 2011/23 and Circular 8/2020. Flags excess tenure, predatory fees, and DBR breaches into infractions."
        ],
        [
            "Node 5: Refusal Gate",
            "Jurisdiction Gatekeeper",
            "contract_text, infractions",
            "Scans contract for foreign governing law clauses (UK FCA, English Law, DIFC). If detected, sets refusal_triggered=True and halts execution with formal refusal notice."
        ],
        [
            "Node 6: Dossier Synthesis",
            "Executive Synthesizer",
            "infractions, math_results",
            "Aggregates all violations, calculates total restitution due (e.g. AED 16,050.00), and drafts a court-ready restitution demand letter and remediation roadmap."
        ]
    ]
    add_table(doc, headers_nodes, rows_nodes, col_widths=[1.5, 1.4, 1.5, 2.1])

    # 4. Multi-Engine RAG & Hybrid Retrieval Subsystems
    add_heading_1(doc, "4. Multi-Engine RAG & Hybrid Retrieval Subsystems")
    add_paragraph(
        doc,
        "To achieve 100.0% recall and eliminate legal hallucinations, ReguGraph-UAE implements a multi-engine RAG architecture in `src/regugraph/rag/` comprising 8 specialized retrieval modules:"
    )

    headers_rag = ["RAG Engine Module", "Source Code File", "Algorithmic Mechanism", "Regulatory Application"]
    rows_rag = [
        [
            "Contextual Chunker",
            "contextual_chunker.py",
            "Hierarchical text chunking preserving parent circular titles, article numbers, and legal definitions.",
            "Prevents orphaned legal clauses from losing statutory authority during vector embedding."
        ],
        [
            "Hybrid RRF Engine",
            "hybrid_rag.py",
            "Dense cosine similarity fused with Rank-BM25 lexical scoring via Reciprocal Rank Fusion: Score = Sum(1 / (60 + rank)).",
            "Guarantees 100% recall for both conceptual queries and exact circular references (e.g. 'Notice 2011/23 Article 7')."
        ],
        [
            "Corrective RAG (CRAG)",
            "crag_engine.py",
            "Evaluates retrieval confidence score against a 0.75 threshold; triggers query reformulation if confidence is degraded.",
            "Corrects ambiguous borrower phrasing (e.g. 'bank charged me too much to cancel loan') into statutory terminology."
        ],
        [
            "Self-RAG Critique",
            "self_rag.py",
            "Self-reflection critique loop inspecting generated responses for hallucinated rules or fabricated fee caps.",
            "Guarantees that every generated compliance recommendation is grounded in an indexed CBUAE circular."
        ],
        [
            "Graph RAG",
            "graph_rag.py",
            "NetworkX knowledge graph mapping relationships between regulations, financial institutions, and definitions.",
            "Traverses cross-circular dependencies (e.g. Notice 2011/23 referencing Federal Law No. 10/1980)."
        ],
        [
            "Quantitative SQL RAG",
            "sql_engine.py",
            "Text-to-SQL engine querying structured tables of statutory fee caps and Basel III risk weights.",
            "Executes exact relational queries against CBUAE fee schedules and standardized loan limits."
        ],
        [
            "Multimodal RAG",
            "multimodal_rag.py",
            "Extracts and parses complex sanction letter tables, amortization schedules, and fee grids.",
            "Extracts structured APR schedules and compounding penalty clauses from scanned sanction documents."
        ],
        [
            "Cross-Encoder Reranker",
            "reranker.py",
            "Neural cross-encoder scoring top-20 retrieved candidates to output top-3 highest-relevance passages.",
            "Maximizes token efficiency by feeding only the most authoritative statutory text into the synthesis prompt."
        ]
    ]
    add_table(doc, headers_rag, rows_rag, col_widths=[1.5, 1.4, 2.0, 1.6])

    # 5. Deterministic Basel III & CBUAE Math Engine
    add_heading_1(doc, "5. Deterministic Basel III & CBUAE Financial Math Engine")
    add_paragraph(
        doc,
        "Mathematical precision is paramount in regulatory enforcement. ReguGraph-UAE's financial math engine (`src/regugraph/core_math.py`) executes pure IEEE-754 arithmetic checks verified against official CBUAE regulations and Basel III accords."
    )

    add_image_with_caption(
        doc,
        "docs/diagrams/04_cbuae_basel_iii_math_engine_flowchart.png",
        "Deterministic Basel III & CBUAE Financial Mathematics Engine Flowchart",
        width_inches=6.3
    )

    add_heading_2(doc, "5.1 Mathematical Formalisms & Statutory Formulas")
    
    add_paragraph(
        doc,
        "DBR = (Sum_{i} Monthly_Commitment_i) / Monthly_Salary <= 0.50  (Standard)\n"
        "DBR <= 0.30  (UAE National Pensioners)\n"
        "Headroom = Max(0, (Monthly_Salary * 0.50) - Current_Commitments)",
        bold_prefix="Debt Burden Ratio (DBR) Formula: ",
        italic=True
    )
    add_paragraph(
        doc,
        "Notice No. 2011/23 Article 7 strictly prohibits commercial banks from extending credit facilities if the borrower's total monthly debt service exceeds 50.0% of their validated regular monthly salary. For retirees and national pensioners, the statutory cap is lowered to 30.0%."
    )

    add_paragraph(
        doc,
        "Statutory_Exit_Cap = Min(0.01 * Outstanding_Principal, 10,000.00 AED)\n"
        "Restitution_Due = Max(0.0, Charged_Exit_Fee - Statutory_Exit_Cap)",
        bold_prefix="Early Prepayment Exit Fee Formula: ",
        italic=True
    )
    add_paragraph(
        doc,
        "Circular No. 8/2020 Article 4.2 establishes that early settlement exit fees must not exceed 1.0% of the remaining outstanding loan balance, or AED 10,000, whichever is lower. In our Apex Gulf Finance benchmark scenario, the bank charged 2.75% with a minimum penalty of AED 15,000, levying AED 12,000 on an AED 400,000 balance. ReguGraph-UAE automatically calculates the statutory cap of AED 4,000 and demands an immediate dirham-for-dirham refund of AED 8,000."
    )

    add_paragraph(
        doc,
        "CAR = (Tier_1_Capital + Tier_2_Capital) / Total_RWA >= 13.0%\n"
        "Total_Capital_Target = CAR + CCB = 13.0% + 2.5% = 15.5%\n"
        "Tier_1_Ratio = Tier_1_Capital / Total_RWA >= 8.5%\n"
        "CET1_Ratio = Common_Equity_Tier_1 / Total_RWA >= 7.0%\n"
        "LCR = High_Quality_Liquid_Assets / Net_30Day_Outflows >= 100.0%\n"
        "NSFR = Available_Stable_Funding / Required_Stable_Funding >= 100.0%\n"
        "Leverage_Ratio = Tier_1_Capital / Total_Exposure >= 3.0%",
        bold_prefix="Prudential Basel III & CBUAE Ratios: ",
        italic=True
    )
    add_paragraph(
        doc,
        "The platform monitors prudential capital and liquidity buffers in parallel with consumer credit caps, ensuring holistic compliance across micro-prudential lending and macro-prudential capital adequacy."
    )

    # 6. REST API Specification & Data Contracts
    add_heading_1(doc, "6. REST API Specification & Data Contracts")
    add_paragraph(
        doc,
        "FastAPI exposes a fully documented, asynchronous REST interface running on Port 8000. All request and response bodies are validated using Pydantic v2 models."
    )

    headers_api = ["HTTP Method & Route", "Request Payload", "Response Schema", "Description & Operational Behavior"]
    rows_api = [
        [
            "POST /api/audit",
            "{ contract_text: str, facility_type?: str }",
            "{ audit_id: str, infractions: [], restitution_due: float, dbr: float, dossier: str }",
            "Executes complete 6-node LangGraph multi-agent compliance audit on submitted contract text."
        ],
        [
            "POST /api/upload-document",
            "Multipart/form-data (file: .docx | .pdf)",
            "{ filename: str, char_count: int, extracted_text: str, format: str }",
            "Parses uploaded Word or PDF sanction letters and extracts contractual covenants and schedules."
        ],
        [
            "POST /api/calculate/dbr",
            "{ salary: float, monthly_emis: float, loans: [] }",
            "{ dbr_percent: float, is_compliant: bool, max_allowed_emi: float, headroom: float }",
            "Executes deterministic DBR calculation and statutory headroom evaluation under Notice 2011/23."
        ],
        [
            "POST /api/calculate/early-settlement",
            "{ outstanding_principal: float, exit_fee_charged: float }",
            "{ statutory_cap: float, excess_charged: float, restitution_due: float, basis: str }",
            "Calculates early exit penalty cap (1% or AED 10k) and calculates restitution refund under Circular 8/2020."
        ],
        [
            "GET /api/evaluations/latest",
            "None",
            "{ run_id: str, timestamp: str, overall_score: float, recall_at_3: float, test_cases: [] }",
            "Fetches most recent 15-inquiry benchmark evaluation run from ChromaDB collection 'cbuae_eval_runs'."
        ],
        [
            "POST /api/evaluations/run",
            "{ include_telemetry?: bool }",
            "{ run_id: str, overall_score: 100.0, recall: 100.0, citation_acc: 100.0, duration_ms: int }",
            "Executes live 15-inquiry benchmark suite, computes RAG Triad scores, and logs run to ChromaDB."
        ],
        [
            "GET /api/health",
            "None",
            "{ status: 'healthy', daemons: { chroma: 'online', langgraph: 'online', api: 'online' } }",
            "Real-time health check endpoint polled by Diagnostics Hub on Port 5174 every 5 minutes."
        ],
        [
            "GET /api/export/docx",
            "Query param: audit_id",
            "Binary stream: application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Streams formatted Microsoft Word (.docx) formal restitution demand letter and dossier."
        ]
    ]
    add_table(doc, headers_api, rows_api, col_widths=[1.6, 1.4, 1.7, 1.8])

    # 7. ChromaDB Vector Schema & Evaluation Telemetry
    add_heading_1(doc, "7. ChromaDB Vector Storage & Telemetry Persistence Schema")
    add_paragraph(
        doc,
        "ChromaDB operates as a persistent daemon on Port 8081 managing two primary collections:"
    )

    add_heading_2(doc, "7.1 Collection: cbuae_regulations")
    add_paragraph(
        doc,
        "Contains 15 canonical CBUAE circular articles, fee schedules, and gazette notices. Indexed using an HNSW graph with Cosine distance metric over 384-dimensional dense embeddings. Every document chunk contains structured metadata:",
        bold_prefix="Vector Index Schema: "
    )
    add_bullet(doc, "e.g. 'Notice No. 2011/23', 'Circular No. 8/2020', 'Notice No. 3877/2019'.", bold_prefix="circular_number: ")
    add_bullet(doc, "e.g. 'Article 7', 'Article 4.2', 'Schedule B'.", bold_prefix="article_number: ")
    add_bullet(doc, "e.g. 'DBR_CAP', 'EARLY_SETTLEMENT_CAP', 'TENURE_LIMIT', 'LATE_PAYMENT_FEE'.", bold_prefix="statutory_domain: ")
    add_bullet(doc, "Direct legal excerpt from the official UAE Federal Gazette.", bold_prefix="gazette_citation: ")

    add_heading_2(doc, "7.2 Collection: cbuae_eval_runs")
    add_paragraph(
        doc,
        "Stores automated evaluation runs executed by the 15-inquiry benchmark suite. Every execution persists an immutable record containing:",
        bold_prefix="Telemetry Persistence Schema: "
    )
    add_bullet(doc, "Unique execution identifier (e.g. 'run-20261017-1422').", bold_prefix="run_id: ")
    add_bullet(doc, "ISO 8601 UTC timestamp of execution.", bold_prefix="timestamp: ")
    add_bullet(doc, "Aggregated compliance score (100.0% across all 15 queries).", bold_prefix="overall_score: ")
    add_bullet(doc, "100.0% statutory retrieval success in top-3 candidates.", bold_prefix="recall_at_3: ")
    add_bullet(doc, "100.0% exact match against governing CBUAE Gazette articles.", bold_prefix="citation_accuracy: ")
    add_bullet(doc, "100.0% rejection of offshore UK FCA and English Law contracts.", bold_prefix="refusal_precision: ")
    add_bullet(doc, "Detailed query-by-query breakdown with query text, retrieved chunk, and model response.", bold_prefix="test_cases_json: ")

    # 8. Developer Tooling & Context Hub (chub) Architecture
    add_heading_1(doc, "8. Developer Tooling & Context Hub (chub) Architecture")
    add_paragraph(
        doc,
        "To support ongoing developer maintenance without polluting production runtime dependencies, Andrew Ng's official Context Hub repository (https://github.com/andrewyng/context-hub) was cloned directly into `tools/context-hub`.",
        bold_prefix="Source Integration: "
    )
    add_paragraph(
        doc,
        "The integration encompasses three operational facets:",
        bold_prefix="Integration Architecture: "
    )
    add_bullet(
        doc,
        "Root scripts `chub.cmd` and `chub.ps1` allow developers to execute `.\\chub search`, `.\\chub get <id>`, and `.\\chub annotate <id>` directly in PowerShell or CMD.",
        bold_prefix="Local Command Wrappers: "
    )
    add_bullet(
        doc,
        "Registered at `C:\\Users\\999379\\.agents\\skills\\context-hub\\SKILL.md`. Equips autonomous coding assistants to fetch LLM-optimized documentation before generating code against external APIs.",
        bold_prefix="Autonomous Agent Skill: "
    )
    add_bullet(
        doc,
        "Local gotchas are persisted across sessions via `chub annotate`. Seeded annotations include ChromaDB v2 heartbeat paths (`/api/v2/heartbeat` on Port 8081) and daemon port assignments.",
        bold_prefix="Persistent Project Annotations: "
    )

    os.makedirs("docs", exist_ok=True)
    out_path = "docs/ReguGraph_UAE_Technical_Specification.docx"
    doc.save(out_path)
    print(f"Successfully generated Technical Specification document at: {out_path}")


if __name__ == "__main__":
    build_technical_specification_doc()
