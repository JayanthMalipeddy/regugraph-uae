# ReguGraph-UAE: Official 3–5 Minute Video Demonstration Script
**Project:** ReguGraph-UAE (Autonomous Central Bank of the UAE Credit Compliance & Audit Platform)  
**Target Duration:** 4 minutes 15 seconds (Range: 3 to 5 minutes)  
**Format:** High-Definition Screen Recording with Live Narration / Voiceover

---

## Video Production Summary

| Section | Timestamp | Theme / Feature | Primary Visual Action |
|:---|:---:|:---|:---|
| **Act 1** | **0:00 – 0:40** | The Retail Credit Problem & Mission | Landing page hero carousel, statutory cap context |
| **Act 2** | **0:40 – 1:25** | Modern Fintech Dashboard Tour | Active loan cards, DBR radial visualizer, restitution KPIs |
| **Act 3** | **1:25 – 2:25** | Live Sanction Upload & Predatory Audit | Drag-and-drop Word/PDF upload, live multi-agent audit, AED 16,050 restitution |
| **Act 4** | **2:25 – 3:05** | Testing Compliance & Refusal Gates | Emirates First compliant mortgage, Barclays UK offshore refusal gate |
| **Act 5** | **3:05 – 3:40** | AI Audit Agent (Chroma-Grounded) | Chatbot interaction on Article 7 DBR 50% cap & formula |
| **Act 6** | **3:40 – 4:15** | Diagnostics, Live Evals & ChromaDB | Telemetry, Chroma UI on 8090, 15-inquiry live re-run & score persistence |
| **Act 7** | **4:15 – 4:40** | Conclusion & Impact | Strategic value for UAE banking & borrower rights |

---

## Full Timed Script & Visual Walkthrough

### Act 1: The Problem & The Mission (0:00 – 0:40)
**Visual Cue:**
- Screen shows the ReguGraph-UAE homepage at `http://localhost:5173`.
- The 3-second auto-advancing Hero Carousel slides smoothly through:
  - *Slide 1: Predatory Prepayment Protection*
  - *Slide 2: 50% Debt Burden Ratio Statutory Cap*
  - *Slide 3: Autonomous LangGraph Audit Engine*
- Mouse hovers over the active banner and CBUAE statutory badges.

**Spoken Narration (Voiceover):**
> *"Every year across the UAE, retail borrowers sign credit agreements containing clauses that directly violate Central Bank regulations—from unlawful 3% early exit penalties and over-extended 60-month tenures, to dangerous debt burden ratios that leave families over-leveraged.*
>
> *Traditional compliance reviews are slow, manual, and often missed until penalties are already paid. Generative AI alone cannot solve this, because large language models hallucinate statutory numbers and math.*
>
> *Meet **ReguGraph-UAE**—an autonomous regulatory intelligence platform that combines **deterministic, zero-hallucination statutory math** with a **stateful multi-agent LangGraph pipeline** and **ChromaDB vector retrieval** to audit loan facilities in under 200 milliseconds."*

---

### Act 2: Modern Fintech Dashboard Tour (0:40 – 1:25)
**Visual Cue:**
- Scroll down the dashboard.
- Point out the modern fintech styling:
  - Gradient digital credit card with EMV smart chip visualizer (*AED 400,000 Facility Balance*).
  - The Debt Burden Ratio (DBR) card displaying **56.0%** in red with statutory cap of **50.0%**.
  - Restitution due counter displaying **+AED 16,050.00**.
  - The audited checkpoints feed displaying legal citations to CBUAE Notice 2011/23 and Circular 8/2020.
- Switch between **Blocks**, **List**, and **Table** view modes to show flexible institutional views.

**Spoken Narration (Voiceover):**
> *"Let’s look at the borrower dashboard. Inspired by modern fintech applications, borrowers and risk officers get an immediate, transparent view of their credit facilities.*
>
> *Here on the digital card, we see the active credit principal. Beside it is our **Debt Burden Ratio Engine**, showing that this facility commits 56% of the borrower's validated monthly salary—immediately flagging a 6 percentage point breach against Central Bank Notice 2011/23.*
>
> *Down below, the platform flags three non-compliant infractions and calculates the exact financial restitution owed back to the customer: **16,050 Dirhams**. Notice that every single finding cites the governing CBUAE Gazette article, ensuring total legal accountability."*

---

### Act 3: Live Sanction Upload & Predatory Loan Audit (1:25 – 2:25)
**Visual Cue:**
- Click the **"Add facility"** or **"Audit Credit Facility"** button to open the modal.
- Click the **"Upload / Paste Sanction Document"** tab.
- Show the 5 sample sanction cards with their **Word (.docx)** and **PDF (.pdf)** download buttons.
- Drag `01_Apex_Gulf_Finance_Personal_Loan_Sanction.pdf` directly from `C:\Users\999379\Downloads\` into the dropzone.
- Show the loading indicator *"Extracting contractual terms from document..."* and observe the text preview instantly populate with 2,154 extracted characters.
- Click **"Run CBUAE Compliance Audit on Sanction Document"**.
- Watch the confetti explosion and the audit report render on screen.
- Click **"Download Report"** $\rightarrow$ **"Download Word Dossier (.doc)"** and open the generated file.

**Spoken Narration (Voiceover):**
> *"Now let’s test an actual sanction document. In the audit studio, users can either enter quick statement figures or upload actual sanction letters in Word or PDF formats.*
>
> *We have pre-loaded 5 sample sanction documents directly into the user’s Downloads folder. Let’s drag in sample document number one: a predatory personal loan from Apex Gulf Finance.*
>
> *Our server-side document parser instantly extracts the contractual covenants, principal amount, tenure, and exit fee terms.*
>
> *Let's click 'Run CBUAE Compliance Audit'.*
>
> *In just 180 milliseconds, the LangGraph multi-agent pipeline deconstructs the clauses, conducts hybrid vector retrieval from ChromaDB, runs deterministic arithmetic, and outputs a complete legal audit.*
>
> *It caught an unlawful early exit penalty of 2.75% with a minimum charge of 15,000 Dirhams—violating Circular 8/2020 which caps exit fees at 1% or 10,000 Dirhams—and detected an illegal 60-month personal loan tenure. The restitution due is calculated at exactly AED 16,050. With one click, the borrower can export a court-ready Word or PDF demand letter."*

---

### Act 4: Testing Compliance & Autonomous Refusal Gate (2:25 – 3:05)
**Visual Cue:**
- Open the modal again.
- Click sample card 2: **Emirates First Bank (Residential Mortgage)**.
  - Run audit $\rightarrow$ Green badge: **100% Fully Compliant (AED 0 Restitution)**.
- Open modal again and click sample card 5: **Barclays London Branch (Offshore UK Facility)**.
  - Run audit $\rightarrow$ Yellow badge: **Autonomous Refusal Gate Triggered**.
  - Show the refusal message explaining that foreign UK FCA / English law agreements are outside CBUAE regulatory scope.

**Spoken Narration (Voiceover):**
> *"What happens when a contract is fully compliant? Selecting our Emirates First Bank mortgage scenario shows a clean bill of health: 20-year tenure, 73% loan-to-value, and a capped 1% exit fee—yielding zero infractions.*
>
> *Crucially, ReguGraph-UAE features an **Autonomous Refusal Gate**. If a user submits a contract governed by the UK Financial Conduct Authority or foreign law, our agentic guardrail identifies the out-of-scope jurisdiction and explicitly refuses to audit it—preventing hallucinations and regulatory cross-contamination."*

---

### Act 5: AI Audit Agent (Chroma-Grounded Chatbot) (3:05 – 3:40)
**Visual Cue:**
- Click the floating **AI Audit Agent** icon in the bottom-right corner.
- The chat window opens with *"Hi, how can I help you today?"*.
- Type or click: *"What is the statutory cap on Debt Burden Ratio (DBR) under CBUAE regulations?"*.
- The agent responds instantly with the exact statutory text from Notice No. 2011/23 Article 7, highlighting the 50% cap, the 30% pensioner limit, and the formal EMI formula.

**Spoken Narration (Voiceover):**
> *"Need quick answers on banking law? In the bottom right corner, our **AI Audit Agent** acts as an on-demand regulatory expert.*
>
> *When we ask about the Debt Burden Ratio, it queries ChromaDB via reciprocal rank fusion and delivers an authoritative, grounded response directly from Article 7 of CBUAE Notice 2011/23—complete with the mathematical formula and sanctions for lending violations."*

---

### Act 6: Diagnostics, Live Evals & ChromaDB Persistence (3:40 – 4:15)
**Visual Cue:**
- Click the **"Diagnostics & Telemetry"** tab in the sidebar.
- Show the ChromaDB server cards (Port 8081 and UI on 8090).
- Scroll to the **RAG Benchmark Evaluation Scorecard**:
  - Show **100.0% Overall Score**, **100.0% Recall@3**, **100.0% Citation Accuracy**, **100.0% Refusal Precision**.
  - Show the collection provenance: `cbuae_eval_runs`.
- Click the **"Re-run RAG Evals & Update Chroma"** button.
  - Watch the button spin as it evaluates all 15 benchmark inquiries live.
  - Watch the new evaluation run record persist to ChromaDB with an updated timestamp and run ID.
- Expand one of the test case rows to reveal the statutory citation comparison and the exact generated answer.

**Spoken Narration (Voiceover):**
> *"Finally, let’s look under the hood in the **Diagnostics & Telemetry Hub**.*
>
> *Here we see live telemetry for our ChromaDB vector server on port 8081, blackydrum Chroma UI on port 8090, and the multi-agent pipeline.*
>
> *We have implemented a persistent evaluation engine. All benchmark results are stored directly in ChromaDB under the collection `cbuae_eval_runs`.*
>
> *When we click 'Re-run RAG Evals', the system re-evaluates our 15-inquiry test suite across 8 regulatory categories in real time, computes the RAG Triad scores—achieving 100% recall, 100% citation accuracy, and 100% refusal precision—and immediately writes the audit run into ChromaDB, creating an immutable audit trail."*

---

### Act 7: Closing & Strategic Value (4:15 – 4:40)
**Visual Cue:**
- Return to the main dashboard.
- Display the clean, modern interface with the confetti celebration badge.
- Show the solution summary links in the top navigation bar.

**Spoken Narration (Voiceover):**
> *"ReguGraph-UAE bridges the gap between complex Central Bank regulations and real-world consumer protection.*
>
> *By unifying deterministic mathematics, multi-agent LangGraph workflows, and persistent vector intelligence, we empower consumers to reclaim overcharged fees and enable financial institutions to operate with flawless compliance.*
>
> *Thank you for watching the ReguGraph-UAE platform demonstration."*

---

## Technical Setup Notes for the Video Presenter

1. **Prerequisite Services:**
   - ChromaDB REST: `http://localhost:8081`
   - Chroma UI: `http://localhost:8090`
   - FastAPI Backend: `http://127.0.0.1:8000`
   - Vite React App: `http://localhost:5173`
2. **Pre-Loaded Sample Files:**
   - Ensure `C:\Users\999379\Downloads\` is open in an adjacent File Explorer window for smooth drag-and-drop.
3. **Screen Resolution:**
   - Recommended resolution: 1920x1080 (1080p) at 100% DPI scaling for crisp financial charts and code visibility.
