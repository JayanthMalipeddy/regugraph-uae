# ReguGraph-UAE: 3 to 5 Minute Demo Presentation Script
> **Gen Academy — Mastering Agentic AI: Week 2 Project Presentation**  
> **Target Audience:** Technical Judges, GenAI Evaluators, Compliance Officers  
> **Presentation Duration:** 4 Minutes (+ 1 Minute Q&A)

---

## Presentation Outline & Timing Matrix

```
┌───────────────────────────────────────────────┬──────────────┬───────────────────────────────┐
│ Section                                       │ Timestamp    │ Screen Action / Visual Cue    │
├───────────────────────────────────────────────┼──────────────┼───────────────────────────────┤
│ 1. The Hook & The Regulatory Challenge        │ 0:00 - 0:45  │ Streamlit Dashboard Home View │
│ 2. The Hybrid RAG & LangGraph Architecture    │ 0:45 - 1:30  │ Architecture Diagram / State  │
│ 3. Live Audit: The Predatory Personal Loan    │ 1:30 - 2:45  │ Audit Mode & Scorecards       │
│ 4. Zero-Hallucination & Explicit Refusal Gate │ 2:45 - 3:30  │ Sample 4 & Inquiry QA Tab     │
│ 5. Official Benchmark & 100% Faithfulness     │ 3:30 - 4:15  │ Official Evaluation Report    │
│ 6. Conclusion & Judges' Handover              │ 4:15 - 4:45  │ Downloadable Audit Dossier    │
└───────────────────────────────────────────────┴──────────────┴───────────────────────────────┘
```

---

## Detailed Script (Word-for-Word Guide)

### 1. The Hook & The Regulatory Challenge (0:00 – 0:45)
*(Visual: Streamlit app open at `http://localhost:8501`, showing the executive dark header "ReguGraph-UAE: Autonomous CBUAE Banking Compliance Auditor".)*

> **"Hello everyone! In the UAE, retail lending is governed by strict statutory consumer protection regulations issued by the Central Bank of the UAE.**
>
> For instance:
> - **Circular No. 8/2020** mandates that early settlement exit penalties can never exceed **1.0%** or **AED 10,000**.
> - **Notice No. 2011/23** enforces an absolute **50% Debt Burden Ratio (DBR)** cap and a 48-month personal loan tenure ceiling.
>
> Yet, in the real world, hundreds of retail loan contracts contain predatory prepayment penalties—often charging 2.75% or imposing artificial minimum penalties of AED 15,000.
>
> Generic LLM chatbots cannot solve this problem: they hallucinate mathematical figures, make arithmetic errors, or cite foreign UK/US regulations.
>
> To solve this, I built **ReguGraph-UAE**: an autonomous, zero-hallucination regulatory compliance agent powered by **Hybrid RAG**, **Reciprocal Rank Fusion**, and **LangGraph**."

---

### 2. The Hybrid RAG & LangGraph Architecture (0:45 – 1:30)
*(Visual: Point to the sidebar showcasing ChromaDB, BM25, and LangGraph status badges.)*

> **"Let's look under the hood at why our RAG pipeline succeeds where naive vector search fails.**
>
> Financial regulations are uniquely challenging because they contain **exact statutory numbers** alongside broad legal principles. If you rely solely on dense vector search, semantic embeddings drift on numerical caps like 1% vs 2.75%. If you rely solely on lexical BM25, you miss semantic synonyms.
>
> In ReguGraph-UAE, we implement:
> 1. **Parallel Hybrid Search:** Dense vector search using ChromaDB and cosine distance, running in parallel with BM25 Okapi lexical matching.
> 2. **Reciprocal Rank Fusion (RRF, $k=60$):** Fusing the top-ranked regulatory chunks to guarantee that both statutory numbers and legal definitions are retrieved.
> 3. **A 6-Node LangGraph State Machine:** Deconstruct Contract $\to$ Hybrid Retrieve $\to$ Deterministic Math Engine $\to$ Cross-Examine $\to$ Grounding Gate $\to$ Dossier Synthesis.
>
> Notice that arithmetic calculations are performed deterministically in Python code—meaning **zero hallucination on financial numbers**."

---

### 3. Live Audit: The Predatory Personal Loan (1:30 – 2:45)
*(Visual: Select 'Sample 1: Predatory Retail Loan' from the dropdown, click 'Run Autonomous Compliance Audit'.)*

> **"Let's run a live audit on a real-world scenario: an Apex Gulf Personal Loan agreement.**
>
> Watch the LangGraph state machine trace:
> - It deconstructs the contract, extracting a principal of AED 180,000, salary of AED 15,000, EMI of AED 9,500, tenure of 60 months, and an early exit fee of 2.75% with a minimum penalty of AED 15,000.
> - The Hybrid Retriever pulls CBUAE Circular 8/2020 Article 4.3 and Notice 2011/23 Article 7.
>
> Look at the generated compliance scorecards:
> 1. **Status:** `NON-COMPLIANT` with **3 statutory infractions detected**.
> 2. **Debt Burden Ratio:** The borrower's DBR is **63.33%**—a direct breach of the CBUAE 50% statutory ceiling by 13.33 percentage points.
> 3. **Early Settlement Penalty:** The contract levied an exit penalty of **AED 15,000**. The statutory cap under Circular 8/2020 is lower of 1% or AED 10,000, which is **AED 1,800**. That is an **unlawful overcharge of AED 13,200**!
> 4. **Processing Fee:** Capped at AED 1,800; contract charged AED 4,500—an additional **AED 2,700 overcharge**.
>
> In total, the system calculates an exact **statutory refund of AED 15,900** owed to the borrower, and generates a legally binding rectification notice with a single click."

---

### 4. Zero-Hallucination & Explicit Refusal Gate (2:45 – 3:30)
*(Visual: Switch dropdown to 'Sample 4: Foreign UK FCA Loan Agreement' or switch to the 'Regulatory Inquiry & Refusal QA' tab and click the UK FCA preset query.)*

> **"One of the mandatory requirements in the Week 2 rubric is an explicit, reliable refusal boundary.**
>
> What happens if a user submits a contract governed by the UK Financial Conduct Authority or asks about US Federal Reserve Regulation Z?
>
> Watch this: I select the London Metropolitan Credit contract governed by the UK FCA.
>
> The system intercepts this at the **Jurisdiction & Grounding Gate**. Instead of hallucinating UAE rules or fabricating advice, it triggers an **explicit refusal**:
> *'Execution Refused (Out of Jurisdiction): CBUAE regulations apply strictly within the United Arab Emirates. The query references foreign regulatory authorities (UK FCA).'*
>
> Similarly, when queried about unsupported topics like cryptocurrency staking, the system recognizes that no authoritative CBUAE circular exists in the corpus and immediately refuses. Zero hallucination."

---

### 5. Official Benchmark & 100% Faithfulness (3:30 – 4:15)
*(Visual: Click the 'Official Evaluation Benchmark' tab in the top navigation.)*

> **"Now, let's look at the rigorous evaluation suite we built.**
>
> We designed a formal 15-question benchmark covering statutory fee caps, mortgage LTVs, multi-hop tenure comparisons, edge cases like the balloon payment ban, and 3 explicit refusal queries.
>
> Running our automated evaluation harness yields:
> - **Retrieval Recall@3:** **100.0% (12 out of 12)**
> - **Citation Grounding Accuracy:** **100.0% (12 out of 12)**
> - **Refusal Precision:** **100.0% (3 out of 3)**
> - **RAG Triad Faithfulness:** **100.0%**
> - **Average Latency:** **900 milliseconds**
>
> Every single finding is grounded in official CBUAE gazettes, backed by deterministic mathematical verification."

---

### 6. Conclusion & Judges' Handover (4:15 – 4:45)
*(Visual: Show the one-click Download Audit Dossier button and the clean markdown file.)*

> **"To summarize, ReguGraph-UAE demonstrates that true agentic RAG is not just about prompt engineering. It requires:**
> - Hybrid lexical and dense vector search via Reciprocal Rank Fusion,
> - Deterministic statutory arithmetic for zero-hallucination financial numbers,
> - Explicit refusal gates for out-of-scope queries,
> - And autonomous state machine orchestration with LangGraph.
>
> With a single click, compliance officers can download the complete executive audit dossier and file it directly with the Central Bank.
>
> Thank you, and I look forward to your questions!"

---

## Anticipated Judges' Questions & Prepared Answers

**Q1: Why did you use Reciprocal Rank Fusion (RRF) instead of a simple cross-encoder reranker?**
> *"Cross-encoders add 300 to 600 milliseconds of inference latency per query. In contrast, RRF ($k=60$) is a rank-based aggregation algorithm that runs in sub-millisecond time while effectively neutralizing the score scale disparity between ChromaDB cosine distance and BM25 unbounded scores. It ensures that chunks matching exact statutory figures (like 1% or AED 10k) rank at the very top."*

**Q2: How does the system ensure it doesn't crash if Ollama or the local LLM is offline?**
> *"We implemented a dual-tier execution pattern: `RegulatoryLLM` performs an instant health check on initialization. If Ollama is active, it uses Qwen 2.5 with a strict zero-hallucination prompt. If Ollama is offline, it seamlessly activates our deterministic legal synthesis engine, drawing directly from the top-ranked CBUAE circular chunks and deterministic math outputs. The user interface and audit findings never crash."*

**Q3: How are markdown tables chunked without getting corrupted?**
> *"In `src/regugraph/ingestion.py`, we built a table-aware parser that recognizes markdown table syntax (`|` and `---`). Rather than slicing tables across arbitrary token limits, it treats regulatory fee schedules as atomic documents, preserving all columns (Fee Type, Statutory Cap, Regulatory Reference, Permitted Deviations) intact."*
