import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("docs/diagrams", exist_ok=True)

# Load fonts
try:
    font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 36)
    font_subtitle = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)
    font_section = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 24)
    font_card_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)
    font_body_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
    font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 16)
    font_caption = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
    font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 14)
except Exception:
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_section = ImageFont.load_default()
    font_card_title = ImageFont.load_default()
    font_body_bold = ImageFont.load_default()
    font_body = ImageFont.load_default()
    font_caption = ImageFont.load_default()
    font_badge = ImageFont.load_default()


def draw_rounded_rect(draw, box, r, fill, outline=None, width=1):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill, outline=outline, width=width)


def draw_arrow(draw, start, end, color=(71, 85, 105), width=3, label=None, label_font=font_caption):
    x1, y1 = start
    x2, y2 = end
    draw.line([start, end], fill=color, width=width)
    # Arrow head
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = 12
    draw.polygon([
        (x2, y2),
        (x2 - head_len * math.cos(angle - math.pi / 6), y2 - head_len * math.sin(angle - math.pi / 6)),
        (x2 - head_len * math.cos(angle + math.pi / 6), y2 - head_len * math.sin(angle + math.pi / 6))
    ], fill=color)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        bbox = draw.textbbox((mx, my), label, font=label_font)
        pw, ph = bbox[2] - bbox[0] + 10, bbox[3] - bbox[1] + 6
        draw_rounded_rect(draw, [mx - pw/2, my - ph/2 - 12, mx + pw/2, my + ph/2 - 12], 4, fill=(255, 255, 255), outline=color, width=1)
        draw.text((mx - pw/2 + 5, my - ph/2 - 12 + 2), label, fill=color, font=label_font)


def draw_card(draw, box, title, tag, items, fill_color, header_color, border_color, tag_bg=(15, 23, 42)):
    x1, y1, x2, y2 = box
    # Outer box shadow
    draw_rounded_rect(draw, [x1+4, y1+4, x2+4, y2+4], 12, fill=(226, 232, 240))
    # Main card
    draw_rounded_rect(draw, [x1, y1, x2, y2], 12, fill=fill_color, outline=border_color, width=2)
    # Header banner
    draw_rounded_rect(draw, [x1, y1, x2, y1+48], 12, fill=header_color)
    draw.rectangle([x1, y1+24, x2, y1+48], fill=header_color)
    # Header Title
    draw.text((x1 + 16, y1 + 12), title, fill=(255, 255, 255), font=font_card_title)
    # Header Tag Badge
    if tag:
        tbox = draw.textbbox((0, 0), tag, font=font_badge)
        tw = tbox[2] - tbox[0] + 16
        bx2 = x2 - 14
        bx1 = bx2 - tw
        draw_rounded_rect(draw, [bx1, y1 + 10, bx2, y1 + 38], 6, fill=tag_bg)
        draw.text((bx1 + 8, y1 + 14), tag, fill=(255, 255, 255), font=font_badge)
    # Items
    cy = y1 + 62
    for item in items:
        if isinstance(item, tuple):
            prefix, text = item
            draw.text((x1 + 16, cy), prefix, fill=(15, 23, 42), font=font_body_bold)
            pbox = draw.textbbox((x1 + 16, cy), prefix, font=font_body_bold)
            draw.text((pbox[2] + 4, cy), text, fill=(71, 85, 105), font=font_body)
        else:
            draw.text((x1 + 16, cy), f"• {item}", fill=(51, 65, 85), font=font_body)
        cy += 24


# ==============================================================================
# DIAGRAM 1: End-to-End System Architecture
# ==============================================================================
def create_diagram_1():
    W, H = 2400, 1500
    img = Image.new("RGB", (W, H), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Top Banner Header
    draw.rectangle([0, 0, W, 120], fill=(15, 23, 42))  # Slate 900
    draw.text((60, 24), "ReguGraph-UAE: End-to-End Enterprise Architecture", fill=(255, 255, 255), font=font_title)
    draw.text((60, 72), "Autonomous CBUAE Retail Credit Compliance, Hybrid RAG, Deterministic Math & Telemetry", fill=(148, 163, 184), font=font_subtitle)

    # Layer 1: Client Experience Layer (Dual Web Apps)
    draw_rounded_rect(draw, [60, 150, 2340, 420], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 165), "LAYER 1: PRESENTATION & CLIENT EXPERIENCE LAYER (ISOLATED DUAL-PORT TOPOLOGY)", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [90, 205, 800, 395], "Main Regulatory Platform", "PORT 5173", [
        ("Tech Stack: ", "React 19 + TypeScript 6 + Vite 8 + Tailwind CSS v4"),
        ("Features: ", "Fintech Cards, DBR Radial Meter, Restitution Delta"),
        ("Audit Studio: ", "Drag-and-Drop Word (.docx) & PDF (.pdf) Ingestion"),
        ("AI Agent: ", "Floating Grounded Regulatory Assistant Widget"),
        ("Export: ", "Automated Court-Ready Word (.docx) & PDF Restitution Dossiers")
    ], (255, 255, 255), (30, 58, 138), (147, 197, 253), tag_bg=(30, 64, 175))

    draw_card(draw, [840, 205, 1550, 395], "Diagnostics & Telemetry Hub", "PORT 5174", [
        ("Tech Stack: ", "React 19 + Vite 8 (vite.config.diagnostics.ts)"),
        ("Isolation: ", "Completely isolated from demo page for Oct 19 review"),
        ("Live Pings: ", "Real-time heartbeat polling (Chroma, UI, LangGraph, FastAPI)"),
        ("Auto-Refresh: ", "5-minute automated background timer with manual trigger"),
        ("Evals Scorecard: ", "15-inquiry live benchmark suite with RAG Triad metrics")
    ], (255, 255, 255), (13, 148, 136), (153, 246, 228), tag_bg=(15, 118, 110))

    draw_card(draw, [1590, 205, 2310, 395], "Vector Storage Visualizer", "PORT 8090", [
        ("Tech Stack: ", "FastAPI + Jinja2 Templates + HTML5/CSS (blackydrum UI)"),
        ("Collection View: ", "Inspect cbuae_regulations & cbuae_eval_runs"),
        ("Document Browser: ", "Inspect embedding vectors, documents, and metadata"),
        ("Distance Debug: ", "Verify cosine and L2 similarity distance scores")
    ], (255, 255, 255), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    # Layer 2: API Gateway Layer
    draw_rounded_rect(draw, [60, 450, 2340, 680], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 465), "LAYER 2: SECURE API & APPLICATION GATEWAY LAYER (PORT 8000)", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [90, 505, 680, 655], "FastAPI ASGI Engine", "UVICORN 8000", [
        ("Runtime: ", "Python 3.13 + Uvicorn ASGI Server (0.0.0.0:8000)"),
        ("Validation: ", "Pydantic v2 strict schemas for audit requests"),
        ("CORS & Security: ", "Cross-Origin headers enabled for 5173 & 5174"),
        ("Telemetry: ", "Health probe endpoint /api/health with real-time ping")
    ], (255, 255, 255), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    draw_card(draw, [710, 505, 1500, 655], "Document & Extraction Gateway", "DOCX / PDF", [
        ("Engines: ", "python-docx + pdfplumber + regex tokenizer"),
        ("Capabilities: ", "Extracts covenants, loan schedule tables, exit clauses"),
        ("Normalization: ", "Strips non-breaking spaces, aligns numeric terms"),
        ("Jurisdiction Tag: ", "Identifies CBUAE vs DIFC/ADGM vs UK FCA offshore")
    ], (255, 255, 255), (180, 83, 9), (254, 215, 170), tag_bg=(217, 119, 6))

    draw_card(draw, [1530, 505, 2310, 655], "REST Endpoint Registry", "FASTAPI ROUTER", [
        ("POST /api/audit: ", "Full multi-agent LangGraph credit contract audit"),
        ("POST /api/upload-document: ", "Extract text from uploaded Word/PDF files"),
        ("GET /api/evaluations/latest: ", "Retrieve latest benchmark run from ChromaDB"),
        ("POST /api/evaluations/run: ", "Re-run 15-inquiry evals and write telemetry"),
        ("GET /api/export/docx: ", "Export court-ready Word restitution demand letter")
    ], (255, 255, 255), (15, 118, 110), (153, 246, 228), tag_bg=(13, 148, 136))

    # Layer 3: Orchestration & AI Engines
    draw_rounded_rect(draw, [60, 710, 2340, 1070], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 725), "LAYER 3: MULTI-AGENT ORCHESTRATION & HYBRID RAG SUBSYSTEMS", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [90, 765, 800, 1045], "LangGraph 6-Node State Machine", "LANGGRAPH", [
        ("N1: Contract Deconstruction: ", "Extracts principal, EMI, tenure, fees"),
        ("N2: Hybrid RRF Retrieval: ", "Dense ChromaDB + Sparse Rank-BM25 (k=60)"),
        ("N3: Deterministic Math: ", "IEEE-754 exact math (zero hallucination)"),
        ("N4: Regulatory Cross-Examine: ", "CBUAE Notice 2011/23 & Circular 8/2020"),
        ("N5: Refusal & Grounding Gate: ", "Foreign law exclusion & citation check"),
        ("N6: Dossier Synthesis: ", "Legal restitution and remediation report")
    ], (255, 255, 255), (15, 23, 42), (203, 213, 225), tag_bg=(51, 65, 85))

    draw_card(draw, [830, 765, 1570, 1045], "Hybrid & Advanced RAG Engines", "MULTI-RAG", [
        ("Dense Retrieval: ", "ChromaDB cosine similarity (384-dim HNSW index)"),
        ("Sparse Retrieval: ", "Rank-BM25 token frequency for exact legal keywords"),
        ("Fusion: ", "Reciprocal Rank Fusion RRF score = Sum(1 / (k + rank))"),
        ("Self-RAG: ", "Self-critique loop for hallucination detection"),
        ("CRAG Engine: ", "Corrective RAG evaluating retrieval confidence"),
        ("Graph & SQL RAG: ", "Knowledge graph linking & quantitative threshold queries")
    ], (255, 255, 255), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    draw_card(draw, [1600, 765, 2310, 1045], "Deterministic Math Engine", "ZERO-HALLUCINATION", [
        ("DBR Calculator: ", "DBR = Total Commitments / Salary <= 50% (30% retiree)"),
        ("Exit Fee Cap: ", "Min(1.0% Outstanding Principal, AED 10,000)"),
        ("Max Tenure: ", "48 months personal loan ceiling / 60 months auto"),
        ("Basel III Standards: ", "CAR >= 13.0%, Tier 1 >= 8.5%, CET1 >= 7.0%, CCB = 2.5%"),
        ("Liquidity Standards: ", "LCR >= 100%, NSFR >= 100%, Leverage Ratio >= 3.0%"),
        ("Restitution Engine: ", "Calculates exact dirham-for-dirham overcharge delta")
    ], (255, 255, 255), (225, 29, 72), (254, 205, 211), tag_bg=(190, 18, 60))

    # Layer 4: Storage, Telemetry & Developer Tooling
    draw_rounded_rect(draw, [60, 1100, 2340, 1420], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 1115), "LAYER 4: PERSISTENCE, TELEMETRY & DEVELOPER TOOLING", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [90, 1155, 800, 1395], "ChromaDB Vector Server", "PORT 8081", [
        ("Process: ", "Chroma standalone daemon on port 8081 (chroma.exe run)"),
        ("Collection 1: ", "cbuae_regulations: 15 indexed CBUAE circulars"),
        ("Collection 2: ", "cbuae_eval_runs: Persistent benchmark evaluation logs"),
        ("Index Type: ", "HNSW space with Cosine distance metric"),
        ("Embeddings: ", "384-dimensional dense semantic vectors")
    ], (255, 255, 255), (30, 58, 138), (147, 197, 253), tag_bg=(30, 64, 175))

    draw_card(draw, [830, 1155, 1570, 1395], "Evaluation & Audit Persistence", "CBUAE_EVAL_RUNS", [
        ("Benchmark Suite: ", "15-inquiry evaluation suite across 8 categories"),
        ("Metrics Captured: ", "Recall@3 (100%), Citation Accuracy, Refusal Precision"),
        ("Audit Logs: ", "Run ID, timestamp, category breakdown, model latency"),
        ("API Access: ", "Endpoints for real-time benchmark re-execution")
    ], (255, 255, 255), (13, 148, 136), (153, 246, 228), tag_bg=(15, 118, 110))

    draw_card(draw, [1600, 1155, 2310, 1395], "Developer Workflows & chub", "CONTEXT HUB", [
        ("Repository: ", "Official https://github.com/andrewyng/context-hub cloned"),
        ("CLI Commands: ", ".\chub search, .\chub get, .\chub annotate, .\chub feedback"),
        ("Agent Skill: ", "context-hub skill registered in .agents/skills/"),
        ("Team Annotations: ", "Locally saved gotchas for ChromaDB v2 and ports"),
        ("Isolation: ", "Developer-only maintenance; zero impact on demo platform")
    ], (255, 255, 255), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    # Flow arrows connecting layers
    draw_arrow(draw, (450, 420), (450, 450), color=(30, 64, 175), width=3, label="HTTP / REST")
    draw_arrow(draw, (1190, 420), (1190, 450), color=(13, 148, 136), width=3, label="Telemetry Poll")
    draw_arrow(draw, (1950, 420), (1950, 1155), color=(124, 58, 237), width=3, label="Inspect ChromaDB")
    draw_arrow(draw, (450, 680), (450, 710), color=(15, 23, 42), width=3, label="StateGraph Invoke")
    draw_arrow(draw, (1190, 680), (1190, 710), color=(5, 150, 105), width=3, label="RAG Routing")
    draw_arrow(draw, (1950, 680), (1950, 710), color=(225, 29, 72), width=3, label="Formulas")
    draw_arrow(draw, (450, 1070), (450, 1100), color=(30, 58, 138), width=3, label="Vector Queries")
    draw_arrow(draw, (1190, 1070), (1190, 1100), color=(13, 148, 136), width=3, label="Save Evals")

    img.save("docs/diagrams/01_end_to_end_system_architecture.png", "PNG", dpi=(300, 300))
    print("Created Diagram 1: docs/diagrams/01_end_to_end_system_architecture.png")


# ==============================================================================
# DIAGRAM 2: Dual-Port Frontend Separation Architecture
# ==============================================================================
def create_diagram_2():
    W, H = 2200, 1250
    img = Image.new("RGB", (W, H), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Top Banner Header
    draw.rectangle([0, 0, W, 110], fill=(15, 23, 42))
    draw.text((60, 20), "ReguGraph-UAE: Dual-Port Frontend Isolation Architecture", fill=(255, 255, 255), font=font_title)
    draw.text((60, 66), "Independent Presentation Port 5173 vs. Observability Port 5174 for Seamless Live Demonstration", fill=(148, 163, 184), font=font_subtitle)

    # Left Container: Main Application on Port 5173
    draw_rounded_rect(draw, [60, 140, 1050, 1180], 16, fill=(255, 255, 255), outline=(30, 58, 138), width=3)
    draw_rounded_rect(draw, [60, 140, 1050, 200], 16, fill=(30, 58, 138))
    draw.rectangle([60, 170, 1050, 200], fill=(30, 58, 138))
    draw.text((80, 152), "PORT 5173 — RETAIL AUDITING PLATFORM", fill=(255, 255, 255), font=font_section)
    draw_rounded_rect(draw, [880, 148, 1030, 188], 6, fill=(59, 130, 246))
    draw.text((892, 156), "MAIN DEMO", fill=(255, 255, 255), font=font_badge)

    draw_card(draw, [90, 230, 1020, 390], "Borrower & Auditor UI Components", "REACT 19", [
        ("Hero Carousel: ", "Auto-advancing 3-second statutory awareness cards"),
        ("Facility Cards: ", "Interactive digital credit card with EMV chip design"),
        ("View Switcher: ", "View facilities in Blocks, Table, or List layout"),
        ("DBR Radial Meter: ", "Statutory 50.0% ceiling indicator with red breach glow"),
        ("Restitution Due: ", "Real-time calculation of refundable dirham amounts")
    ], (248, 250, 252), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    draw_card(draw, [90, 420, 1020, 580], "Audit Studio & File Ingestion Dropzone", "DOCX / PDF", [
        ("Dropzone: ", "Drag-and-drop support for Word (.docx) & PDF (.pdf)"),
        ("Preset Sanctions: ", "5 pre-loaded sample facilities with direct downloads"),
        ("Live Parsing: ", "Character-by-character text extraction feedback"),
        ("Execution: ", "Under 200ms multi-agent compliance review trigger")
    ], (248, 250, 252), (180, 83, 9), (254, 215, 170), tag_bg=(217, 119, 6))

    draw_card(draw, [90, 610, 1020, 770], "AI Audit Agent (Grounded Assistant)", "CHROMA RAG", [
        ("Floating Widget: ", "Right-bottom corner responsive chat assistant"),
        ("Grounded Queries: ", "Queries CBUAE circulars via dense + sparse fusion"),
        ("Citations: ", "Provides exact Gazette circular and article numbers"),
        ("Jurisdiction Guard: ", "Refuses questions outside CBUAE scope")
    ], (248, 250, 252), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    draw_card(draw, [90, 800, 1020, 960], "Court-Ready Dossier Exporter", "WORD & PDF", [
        ("Word (.docx) Export: ", "Formal demand letter with restitution schedules"),
        ("Legal Citations: ", "Notice 2011/23 Art 7, Circular 8/2020 Art 4.2"),
        ("Remediation Plan: ", "Step-by-step instructions for CBUAE Ombudsman submission"),
        ("Confetti Alert: ", "Interactive celebration trigger on successful audit")
    ], (248, 250, 252), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    # Link button at bottom of Left container
    draw_rounded_rect(draw, [90, 1000, 1020, 1140], 12, fill=(239, 246, 255), outline=(59, 130, 246), width=2)
    draw.text((120, 1020), "DEMO NAVIGATION BRIDGE: Direct Link to Diagnostics", fill=(30, 58, 138), font=font_body_bold)
    draw.text((120, 1055), "Topbar & Sidebar feature direct button: 'Diagnostics & Telemetry -> :5174'", fill=(71, 85, 105), font=font_body)
    draw.text((120, 1090), "Opens port 5174 in a dedicated tab once main demo presentation concludes.", fill=(100, 116, 139), font=font_caption)

    # Right Container: Diagnostics on Port 5174
    draw_rounded_rect(draw, [1150, 140, 2140, 1180], 16, fill=(255, 255, 255), outline=(13, 148, 136), width=3)
    draw_rounded_rect(draw, [1150, 140, 2140, 200], 16, fill=(13, 148, 136))
    draw.rectangle([1150, 170, 2140, 200], fill=(13, 148, 136))
    draw.text((1170, 152), "PORT 5174 — DIAGNOSTICS & TELEMETRY HUB", fill=(255, 255, 255), font=font_section)
    draw_rounded_rect(draw, [1950, 148, 2120, 188], 6, fill=(20, 184, 166))
    draw.text((1965, 156), "ISOLATED", fill=(255, 255, 255), font=font_badge)

    draw_card(draw, [1180, 230, 2110, 390], "Real-Time Health & Daemon Pings", "5-MIN TIMER", [
        ("ChromaDB Server (8081): ", "Live heartbeat check (/api/v2/heartbeat)"),
        ("Chroma Web UI (8090): ", "Live HTTP status check of blackydrum UI service"),
        ("LangGraph Engine (8000): ", "Live state machine pipeline latency check"),
        ("FastAPI Gateway (8000): ", "Live endpoint connectivity & status check"),
        ("Auto-Refresh: ", "Automated 5-minute background refresh with manual trigger")
    ], (248, 250, 252), (13, 148, 136), (153, 246, 228), tag_bg=(15, 118, 110))

    draw_card(draw, [1180, 420, 2110, 580], "15-Inquiry RAG Benchmark Scorecard", "100% SCORE", [
        ("Retrieval Recall@3: ", "100.0% across all 15 statutory benchmark queries"),
        ("Citation Accuracy: ", "100.0% exact match against official CBUAE Gazettes"),
        ("Refusal Precision: ", "100.0% accurate rejection of foreign & offshore loans"),
        ("Average Latency: ", "182ms end-to-end multi-agent evaluation latency")
    ], (248, 250, 252), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    draw_card(draw, [1180, 610, 2110, 770], "ChromaDB Persistence & Telemetry", "CBUAE_EVAL_RUNS", [
        ("Storage Provenance: ", "Persistent collection cbuae_eval_runs"),
        ("Interactive Re-run: ", "Button triggers 15-inquiry live re-run and updates UI"),
        ("Drill-Down Inspection: ", "Click any inquiry row to inspect model response"),
        ("Audit Verification: ", "Verifies historical consistency across model versions")
    ], (248, 250, 252), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    draw_card(draw, [1180, 800, 2110, 960], "Architectural & Technical Guidance", "LEARNING HUB", [
        ("RAG Learning Hub: ", "Interactive guide explaining 8 advanced RAG strategies"),
        ("Basel III Guide: ", "Formulas for CAR, Tier 1, CET1, LCR, and NSFR"),
        ("Open UI on 8090: ", "Direct link to Chroma Web UI for visual inspection"),
        ("Quick Links: ", "Return to Main App (:5173), FastAPI Docs (:8000/docs)")
    ], (248, 250, 252), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    # Link button at bottom of Right container
    draw_rounded_rect(draw, [1180, 1000, 2110, 1140], 12, fill=(240, 253, 250), outline=(20, 184, 166), width=2)
    draw.text((1210, 1020), "RETURN BRIDGE: Direct Link to Main Application", fill=(15, 118, 110), font=font_body_bold)
    draw.text((1210, 1055), "Top navigation header includes: '<- Return to ReguGraph Main Dashboard (:5173)'", fill=(71, 85, 105), font=font_body)
    draw.text((1210, 1090), "Ensures seamless bi-directional switching during the live demonstration.", fill=(100, 116, 139), font=font_caption)

    # Central Bi-directional Connector Arrow
    draw_arrow(draw, (1050, 660), (1150, 660), color=(59, 130, 246), width=4, label="Open Port 5174")
    draw_arrow(draw, (1150, 720), (1050, 720), color=(13, 148, 136), width=4, label="Return Port 5173")

    img.save("docs/diagrams/02_dual_port_frontend_isolation_architecture.png", "PNG", dpi=(300, 300))
    print("Created Diagram 2: docs/diagrams/02_dual_port_frontend_isolation_architecture.png")


# ==============================================================================
# DIAGRAM 3: LangGraph 6-Node Multi-Agent Flowchart
# ==============================================================================
def create_diagram_3():
    W, H = 2400, 1500
    img = Image.new("RGB", (W, H), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Top Banner Header
    draw.rectangle([0, 0, W, 110], fill=(15, 23, 42))
    draw.text((60, 20), "ReguGraph-UAE: LangGraph Multi-Agent StateMachine Flowchart", fill=(255, 255, 255), font=font_title)
    draw.text((60, 66), "Deterministic 6-Node Pipeline for Statutory Deconstruction, Verification, Grounding & Restitution", fill=(148, 163, 184), font=font_subtitle)

    # Step 1: Input Contract
    draw_card(draw, [60, 160, 400, 520], "0. Input Contract", "INGESTION", [
        ("Source 1: ", "Sanction Word (.docx)"),
        ("Source 2: ", "Sanction PDF (.pdf)"),
        ("Source 3: ", "Quick Statement Form"),
        ("Parser: ", "pdfplumber & docx"),
        ("Output: ", "Clean normalized text"),
        ("State: ", "AuditState initialized")
    ], (255, 255, 255), (30, 41, 59), (203, 213, 225), tag_bg=(71, 85, 105))

    # Step 2: Node 1 - Deconstruction
    draw_card(draw, [440, 160, 780, 520], "1. Deconstruction", "NODE 1", [
        ("Agent: ", "Contract Deconstructor"),
        ("Extraction: ", "Loan Principal (AED)"),
        ("Commitment: ", "Borrower Monthly Salary"),
        ("EMI: ", "Equated Monthly Installment"),
        ("Tenure: ", "Duration in months"),
        ("Exit Fee: ", "Prepayment percentage/fixed")
    ], (255, 255, 255), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    # Step 3: Node 2 - Hybrid RRF Retrieval
    draw_card(draw, [820, 160, 1180, 520], "2. Hybrid RRF Search", "NODE 2", [
        ("Dense Query: ", "ChromaDB (Port 8081)"),
        ("Sparse Query: ", "Rank-BM25 Lexical"),
        ("Corpus: ", "CBUAE Gazette collection"),
        ("Fusion: ", "RRF Score (k=60)"),
        ("Articles: ", "Notice 2011/23 Art 7"),
        ("Standards: ", "Circular 8/2020 Art 4.2")
    ], (255, 255, 255), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    # Step 4: Node 3 - Deterministic Math
    draw_card(draw, [1220, 160, 1580, 520], "3. Statutory Math", "NODE 3", [
        ("Engine: ", "Pure Python IEEE-754"),
        ("Zero Halluc: ", "Never uses LLM for math"),
        ("DBR Formula: ", "DBR = EMI / Salary"),
        ("DBR Limit: ", "Strict 50.0% cap"),
        ("Exit Cap: ", "Min(1% Bal, AED 10,000)"),
        ("Tenure Cap: ", "48 mos max personal loan")
    ], (255, 255, 255), (225, 29, 72), (254, 205, 211), tag_bg=(190, 18, 60))

    # Step 5: Node 4 - Regulatory Cross-Exam
    draw_card(draw, [1620, 160, 1980, 520], "4. Cross-Examine", "NODE 4", [
        ("Agent: ", "Regulatory Prosecutor"),
        ("Comparison: ", "Contractual vs Statutory"),
        ("DBR Breach: ", "Calculates excess %"),
        ("Exit Breach: ", "Calculates excess fee"),
        ("Tenure Breach: ", "Flags unlawful duration"),
        ("Citations: ", "Maps to CBUAE gazettes")
    ], (255, 255, 255), (180, 83, 9), (254, 215, 170), tag_bg=(217, 119, 6))

    # Step 6: Node 5 - Refusal & Grounding Gate
    draw_card(draw, [2020, 160, 2380, 520], "5. Refusal Gate", "NODE 5", [
        ("Agent: ", "Jurisdiction Gatekeeper"),
        ("Check: ", "Is contract CBUAE scope?"),
        ("Offshore: ", "UK FCA, DIFC common law"),
        ("If Foreign: ", "Trigger refusal state!"),
        ("Grounding: ", "Verify exact Gazette text"),
        ("Hallucination: ", "Eliminate fabricated rules")
    ], (255, 255, 255), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    # Connecting horizontal arrows across top row
    draw_arrow(draw, (400, 340), (440, 340), color=(71, 85, 105), width=3)
    draw_arrow(draw, (780, 340), (820, 340), color=(30, 64, 175), width=3)
    draw_arrow(draw, (1180, 340), (1220, 340), color=(5, 150, 105), width=3)
    draw_arrow(draw, (1580, 340), (1620, 340), color=(225, 29, 72), width=3)
    draw_arrow(draw, (1980, 340), (2020, 340), color=(180, 83, 9), width=3)

    # Decision Branch below Node 5
    draw_arrow(draw, (2200, 520), (2200, 620), color=(124, 58, 237), width=3, label="Evaluate Jurisdiction")

    # Decision Diamond Box
    draw_rounded_rect(draw, [2000, 620, 2400, 720], 12, fill=(255, 255, 255), outline=(124, 58, 237), width=2)
    draw.text((2040, 650), "Jurisdiction & Grounding Valid?", fill=(15, 23, 42), font=font_body_bold)
    draw.text((2070, 680), "CBUAE vs Offshore / Foreign Law", fill=(100, 116, 139), font=font_caption)

    # Refusal Path (Left)
    draw_arrow(draw, (2000, 670), (1600, 670), color=(225, 29, 72), width=3, label="NO (Foreign / Offshore)")
    draw_card(draw, [1180, 600, 1600, 760], "Autonomous Refusal Response", "BLOCKED", [
        ("Trigger: ", "Offshore / UK FCA / English Law facility"),
        ("Action: ", "Sets refusal_triggered = True in AuditState"),
        ("Output: ", "Official refusal notice with explanation"),
        ("Protection: ", "Prevents hallucinations on non-UAE laws")
    ], (255, 241, 242), (225, 29, 72), (254, 205, 211), tag_bg=(190, 18, 60))

    # Compliant / UAE Path (Down)
    draw_arrow(draw, (2200, 720), (2200, 800), color=(5, 150, 105), width=3, label="YES (CBUAE Jurisdiction)")

    # Node 6: Executive Dossier Synthesis
    draw_card(draw, [1800, 800, 2380, 1140], "6. Dossier Synthesis", "NODE 6", [
        ("Agent: ", "Executive Dossier Synthesizer"),
        ("Infractions: ", "Aggregates all statutory breaches"),
        ("Restitution: ", "Calculates exact dirham refund owed"),
        ("Demand Letter: ", "Drafts legal demand under Notice 2011/23"),
        ("Remediation: ", "Generates steps for CBUAE dispute filing"),
        ("JSON Contract: ", "Outputs structured audit JSON to frontend")
    ], (255, 255, 255), (15, 118, 110), (153, 246, 228), tag_bg=(13, 148, 136))

    # Bottom Area: Output Artifacts
    draw_rounded_rect(draw, [60, 840, 1650, 1440], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 855), "FINAL AUDIT OUTPUT ARTIFACTS & INSTITUTIONAL REPORTING", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [90, 900, 560, 1410], "Interactive UI Dossier", "PORT 5173", [
        ("Live Breach Badges: ", "Red badges for DBR, tenure, fee violations"),
        ("Restitution Due: ", "+AED 16,050 calculated instantly"),
        ("Citation Feed: ", "Full text of CBUAE Notice 2011/23 Art 7"),
        ("Amortization Delta: ", "Visual comparison of lawful vs charged schedule"),
        ("Confetti Celebration: ", "Alerts user on positive restitution discovery")
    ], (255, 255, 255), (30, 58, 138), (147, 197, 253), tag_bg=(30, 64, 175))

    draw_card(draw, [590, 900, 1100, 1410], "Court-Ready Word Dossier", "DOCX EXPORT", [
        ("Format: ", "Official Microsoft Word (.docx) demand letter"),
        ("Heading: ", "Official Borrower Legal Restitution Notice"),
        ("Statutory Basis: ", "Direct citations to CBUAE gazettes"),
        ("Financial Table: ", "Breakdown of charged fee vs statutory cap"),
        ("Bank Submission: ", "Ready for presentation to bank compliance officer")
    ], (255, 255, 255), (180, 83, 9), (254, 215, 170), tag_bg=(217, 119, 6))

    draw_card(draw, [1130, 900, 1630, 1410], "ChromaDB Telemetry Record", "EVAL RUNS", [
        ("Run Persistence: ", "Logged to collection cbuae_eval_runs"),
        ("Run Metadata: ", "Run ID, audit timestamp, execution duration"),
        ("Inquiry Evals: ", "Scores across 15 benchmark inquiries"),
        ("Verification: ", "Inspectable in Diagnostics Hub on Port 5174"),
        ("Audit Trail: ", "Immutable regulatory compliance history")
    ], (255, 255, 255), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    # Flow arrows from Node 6 to Artifacts
    draw_arrow(draw, (1800, 970), (1650, 970), color=(15, 118, 110), width=4, label="Generate Artifacts")

    img.save("docs/diagrams/03_langgraph_multi_agent_flowchart.png", "PNG", dpi=(300, 300))
    print("Created Diagram 3: docs/diagrams/03_langgraph_multi_agent_flowchart.png")


# ==============================================================================
# DIAGRAM 4: Basel III & CBUAE Math Engine Flowchart
# ==============================================================================
def create_diagram_4():
    W, H = 2200, 1300
    img = Image.new("RGB", (W, H), (248, 250, 252))
    draw = ImageDraw.Draw(img)

    # Top Banner Header
    draw.rectangle([0, 0, W, 110], fill=(15, 23, 42))
    draw.text((60, 20), "ReguGraph-UAE: Deterministic Basel III & CBUAE Financial Math Engine", fill=(255, 255, 255), font=font_title)
    draw.text((60, 66), "Zero-Hallucination IEEE-754 Arithmetic Architecture for Consumer Credit Caps & Prudential Ratios", fill=(148, 163, 184), font=font_subtitle)

    # Section 1: Consumer Credit Protection Caps
    draw_rounded_rect(draw, [60, 140, 1070, 740], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 155), "MODULE 1: CBUAE RETAIL BORROWER STATUTORY CAPS", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [80, 195, 550, 440], "Debt Burden Ratio (DBR)", "NOTICE 2011/23", [
        ("Formula: ", "DBR = (Sum Monthly EMIs) / Monthly Salary"),
        ("Standard Cap: ", "50.0% of regular monthly income"),
        ("Pensioner Cap: ", "30.0% for UAE national pensioners"),
        ("Headroom: ", "Max Allowed EMI - Current Commitments"),
        ("Breach Action: ", "Flags predatory consolidation loans")
    ], (255, 255, 255), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    draw_card(draw, [580, 195, 1050, 440], "Early Settlement Exit Fee", "CIRCULAR 8/2020", [
        ("Statutory Cap: ", "Min(1.0% Outstanding Principal, AED 10,000)"),
        ("Unlawful Practice: ", "Charging 2.0% - 3.0% with AED 15,000 min"),
        ("Restitution: ", "Fee Charged - Statutory Cap"),
        ("Example: ", "Apex loan charged AED 12k; Cap is AED 4k"),
        ("Refund Due: ", "+AED 8,000 dirham-for-dirham refund")
    ], (255, 255, 255), (225, 29, 72), (254, 205, 211), tag_bg=(190, 18, 60))

    draw_card(draw, [80, 465, 550, 710], "Maximum Loan Tenure", "NOTICE 2011/23", [
        ("Personal Loan: ", "Strict ceiling of 48 months (4 years)"),
        ("Auto Loan: ", "Strict ceiling of 60 months (5 years)"),
        ("Home Mortgage: ", "Strict ceiling of 300 months (25 years)"),
        ("Breach Trigger: ", "Any 60/72-month personal loan is voided"),
        ("Remedy: ", "Rescheduled without interest compounding")
    ], (255, 255, 255), (180, 83, 9), (254, 215, 170), tag_bg=(217, 119, 6))

    draw_card(draw, [580, 465, 1050, 710], "Fee Schedule & Late Penalties", "CIRCULAR 8/2020", [
        ("Late Payment Fee: ", "Strict cap of AED 150 per cycle"),
        ("Delinquency Cap: ", "Cannot exceed actual administrative cost"),
        ("Processing Fee: ", "Capped at 1.0% of principal or AED 2,500"),
        ("Compounding: ", "Zero compounding on penalty charges"),
        ("Restitution: ", "Excess penalties refunded to borrower")
    ], (255, 255, 255), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    # Section 2: Basel III & CBUAE Prudential Capital & Liquidity Ratios
    draw_rounded_rect(draw, [1130, 140, 2140, 740], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((1150, 155), "MODULE 2: BASEL III & CBUAE PRUDENTIAL RATIOS", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [1150, 195, 1620, 440], "Capital Adequacy Ratio (CAR)", "CBUAE STANDARD", [
        ("Formula: ", "CAR = (Tier 1 + Tier 2 Capital) / Total RWA"),
        ("CBUAE Minimum: ", "13.0% (Higher than Basel III 8.0% baseline)"),
        ("CCB Buffer: ", "+2.5% Capital Conservation Buffer"),
        ("Total Target: ", "15.5% Total Regulatory Capital target"),
        ("Risk Weights: ", "Standardized credit, market & operational")
    ], (255, 255, 255), (30, 58, 138), (147, 197, 253), tag_bg=(30, 64, 175))

    draw_card(draw, [1650, 195, 2120, 440], "Tier 1 & CET1 Ratios", "CORE CAPITAL", [
        ("Tier 1 Ratio: ", "Tier 1 Capital / Total RWA >= 8.5%"),
        ("CET1 Ratio: ", "Common Equity Tier 1 / Total RWA >= 7.0%"),
        ("High Loss Absorb: ", "Common shares, retained earnings, reserves"),
        ("Deductions: ", "Goodwill, intangibles, deferred tax assets"),
        ("Prudential Alert: ", "Triggered if CET1 drops below 7.0%")
    ], (255, 255, 255), (13, 148, 136), (153, 246, 228), tag_bg=(15, 118, 110))

    draw_card(draw, [1150, 465, 1620, 710], "Liquidity Ratios (LCR & NSFR)", "SHORT & LONG TERM", [
        ("LCR Formula: ", "HQLA / Net 30-Day Cash Outflows >= 100%"),
        ("NSFR Formula: ", "Available Stable Funding / Required SF >= 100%"),
        ("HQLA Assets: ", "Cash, central bank reserves, high-grade debt"),
        ("Stress Horizon: ", "30-day severe liquidity crisis resilience"),
        ("Funding Mismatch: ", "Prevents over-reliance on short-term wholesale")
    ], (255, 255, 255), (124, 58, 237), (221, 214, 254), tag_bg=(109, 40, 217))

    draw_card(draw, [1650, 465, 2120, 710], "Basel III Leverage Ratio", "NON-RISK BACKSTOP", [
        ("Formula: ", "Leverage = Tier 1 Capital / Total Exposure"),
        ("Statutory Cap: ", "Minimum 3.0% non-risk-weighted backstop"),
        ("Exposure Scope: ", "On-balance sheet + derivative + off-balance"),
        ("Countercyclical: ", "Limits systemic deleveraging shocks"),
        ("Supervisory Check: ", "Monitored quarterly by risk governance")
    ], (255, 255, 255), (15, 23, 42), (203, 213, 225), tag_bg=(51, 65, 85))

    # Bottom Area: Quantitative Pipeline Flow
    draw_rounded_rect(draw, [60, 770, 2140, 1240], 16, fill=(241, 245, 249), outline=(203, 213, 225), width=2)
    draw.text((80, 785), "QUANTITATIVE ARITHMETIC PIPELINE & RESTITUTION ACCUMULATOR", fill=(30, 41, 59), font=font_section)

    draw_card(draw, [80, 830, 560, 1210], "1. Financial Input Parsing", "INPUT STAGE", [
        ("Validation: ", "Pydantic v2 strict float validation"),
        ("Currency Normalization: ", "Dirhams (AED) standard scale"),
        ("Salary Verification: ", "Regular salary vs variable bonus"),
        ("Commitment Aggregation: ", "Sums all bank EMIs, cards & loans"),
        ("Zero-Divide Protection: ", "Graceful handling of zero values")
    ], (255, 255, 255), (30, 41, 59), (203, 213, 225), tag_bg=(71, 85, 105))

    draw_card(draw, [590, 830, 1070, 1210], "2. Exact Statutory Checks", "ARITHMETIC", [
        ("DBR Verification: ", "DBR = Total EMI / Salary"),
        ("Delta Computation: ", "Excess DBR = Max(0, DBR - 50.0%)"),
        ("Exit Fee Check: ", "StatCap = Min(0.01 * Balance, 10000)"),
        ("Exit Excess: ", "Refund = Max(0, FeeCharged - StatCap)"),
        ("Tenure Check: ", "ExcessMonths = Max(0, Tenure - MaxAllowed)")
    ], (255, 255, 255), (30, 64, 175), (191, 219, 254), tag_bg=(29, 78, 216))

    draw_card(draw, [1100, 830, 1580, 1210], "3. Delta Restitution Sum", "ACCUMULATOR", [
        ("Accumulator: ", "Sum(ExitRefund + LateFeeRefund + ..."),
        ("Interest Recalibration: ", "Computes unearned tenure interest"),
        ("Restitution Due: ", "Total direct cash refund to borrower"),
        ("Example Apex Loan: ", "AED 8,000 fee + AED 8,050 tenure"),
        ("Total Restitution: ", "AED 16,050.00 exact refund")
    ], (255, 255, 255), (225, 29, 72), (254, 205, 211), tag_bg=(190, 18, 60))

    draw_card(draw, [1610, 830, 2120, 1210], "4. Legal Dossier Binding", "OUTPUT STAGE", [
        ("Citations: ", "Binds each delta to governing CBUAE article"),
        ("UI Presentation: ", "Radial gauges, metric cards, confetti"),
        ("Word Document: ", "Auto-populates formal legal restitution tables"),
        ("Audit Trail: ", "Persists calculation parameters to ChromaDB"),
        ("Ombudsman Pack: ", "Ready for submission to Sanadak / CBUAE")
    ], (255, 255, 255), (5, 150, 105), (167, 243, 208), tag_bg=(16, 185, 129))

    # Flow arrows connecting bottom stages
    draw_arrow(draw, (560, 1020), (590, 1020), color=(71, 85, 105), width=3)
    draw_arrow(draw, (1070, 1020), (1100, 1020), color=(30, 64, 175), width=3)
    draw_arrow(draw, (1580, 1020), (1610, 1020), color=(225, 29, 72), width=3)

    img.save("docs/diagrams/04_cbuae_basel_iii_math_engine_flowchart.png", "PNG", dpi=(300, 300))
    print("Created Diagram 4: docs/diagrams/04_cbuae_basel_iii_math_engine_flowchart.png")


if __name__ == "__main__":
    print("Generating High-Resolution Architecture Diagrams...")
    create_diagram_1()
    create_diagram_2()
    create_diagram_3()
    create_diagram_4()
    print("All 4 architecture diagrams successfully generated in docs/diagrams/")
