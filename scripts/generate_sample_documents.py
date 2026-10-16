"""Generate high-fidelity Word (.docx) and PDF (.pdf) sample sanction documents
for testing and validating CBUAE regulatory compliance audits.
"""
import os
import shutil
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)

OUTPUT_DIRS = [
    Path("data/sample_documents"),
    Path("frontend/public/samples"),
    Path(r"C:\Users\999379\Downloads")
]

for d in OUTPUT_DIRS:
    d.mkdir(parents=True, exist_ok=True)

SAMPLE_DOCS = [
    {
        "id": "scenario-1",
        "slug": "01_Apex_Gulf_Finance_Personal_Loan_Sanction",
        "bank_name": "APEX GULF FINANCIAL SERVICES (PJSC)",
        "license_info": "Licensed & Regulated by Central Bank of the UAE | Category: Commercial Financing",
        "doc_title": "RETAIL PERSONAL CREDIT FACILITY SANCTION LETTER",
        "ref_no": "AG-PL-2026-9941",
        "date_str": "15 January 2026",
        "borrower_name": "Tariq Mansoor Al-Hashemi",
        "borrower_id": "784-1988-1234567-1",
        "income": "AED 15,000.00 per month (Verified Gross)",
        "color_hex": "#b91c1c", # Red badge
        "outcome_badge": "PREDATORY EXIT PENALTIES & TENURE VIOLATION",
        "schedule_a": [
            ("Facility Type", "Unsecured Personal Consumer Cash Loan"),
            ("Sanctioned Loan Principal", "AED 180,000.00"),
            ("Agreed Loan Tenure", "60 Months (5 Years)"),
            ("Fixed Reducing Interest Rate", "7.99% per annum"),
            ("Scheduled Monthly Installment (EMI)", "AED 9,500.00"),
            ("Upfront Processing & Origination Fee", "AED 4,500.00 (Deducted at source)"),
            ("Late Payment Penalty", "AED 300.00 per missed cycle"),
        ],
        "clauses": [
            ("Clause 9.4 — Voluntary Early Settlement & Refinancing",
             "The Borrower may request early settlement of the outstanding facility provided thirty (30) days prior notice is served. In the event of full or partial early settlement: (a) The Borrower shall pay an early termination exit fee equal to 2.75% of the remaining outstanding principal balance, subject to an absolute minimum penalty charge of AED 15,000.00. (b) Any unamortized administrative setup costs shall be retained by the Lender."),
            ("Clause 11.2 — Default & Late Settlement Penalties",
             "Failure to honor any monthly installment on the 1st of each calendar month shall incur an automated delinquent processing fee of AED 300.00 per occurrence. Delinquent amounts shall compound at a default rate of 18% per annum until settled."),
            ("Clause 14.1 — Governing Law & Gazette Direction",
             "This Agreement shall be governed by the laws of the United Arab Emirates and the regulatory directions of the Central Bank of the UAE.")
        ]
    },
    {
        "id": "scenario-2",
        "slug": "02_Emirates_First_Bank_Mortgage_Facility",
        "bank_name": "EMIRATES FIRST COMMERCIAL BANK (PJSC)",
        "license_info": "Licensed & Regulated by Central Bank of the UAE | Tier-1 National Banking Institution",
        "doc_title": "RESIDENTIAL MORTGAGE HOME FINANCE AGREEMENT",
        "ref_no": "EFN-MORT-2026-4402",
        "date_str": "10 February 2026",
        "borrower_name": "Sarah Jenkins",
        "borrower_id": "784-1985-7654321-2",
        "income": "AED 48,000.00 per month (Verified Gross)",
        "color_hex": "#047857", # Emerald badge
        "outcome_badge": "100% CBUAE COMPLIANT RESIDENTIAL MORTGAGE",
        "schedule_a": [
            ("Facility Type", "First-Time Home Buyer Residential Mortgage (Completed Property)"),
            ("Agreed Property Purchase Valuation", "AED 3,000,000.00"),
            ("Down Payment Paid by Borrower", "AED 800,000.00 (26.67% of valuation)"),
            ("Sanctioned Loan Principal (Financed)", "AED 2,200,000.00 (LTV = 73.33%)"),
            ("Repayment Tenure", "240 Months (20 Years)"),
            ("Annual Profit / Interest Rate", "4.25% reducing per annum"),
            ("Scheduled Monthly Installment (EMI)", "AED 13,622.00"),
            ("Borrower Debt Burden Ratio (DBR)", "28.38% (Fully compliant with 50% cap)"),
            ("Processing & Valuation Fee", "AED 5,000.00 (Strictly compliant with CBUAE fee caps)"),
        ],
        "clauses": [
            ("Clause 8.2 — Prepayment & Early Settlement Terms",
             "The Borrower has the contractual right to prepay or partially amortize the facility at any quarterly cycle. In the event of full or partial early settlement, the early exit fee is capped at exactly 1.0% of the prepaid principal sum, or AED 10,000.00, whichever is lower, strictly mirroring CBUAE Notice 3877/2019 and Circular 8/2020. The Lender shall provide an updated amortization schedule within five (5) business days reflecting the reduced balance."),
            ("Clause 16.4 — Governing Law & Jurisdiction",
             "This facility is executed under UAE Federal Banking Law and is subject to the exclusive regulatory supervision of the Central Bank of the United Arab Emirates.")
        ]
    },
    {
        "id": "scenario-3",
        "slug": "03_Falcon_Auto_Credit_Subprime_Facility",
        "bank_name": "FALCON AUTO CREDIT & CONSUMER LEASING LLC",
        "license_info": "Licensed Finance Company | UAE Commercial Credit Registry No. 44921",
        "doc_title": "VEHICLE CONSUMER CREDIT SANCTION FACILITY",
        "ref_no": "FAC-AUTO-2026-1188",
        "date_str": "02 March 2026",
        "borrower_name": "Ahmed Rashid Al-Nuaimi",
        "borrower_id": "784-1994-9988776-5",
        "income": "AED 12,000.00 per month (Verified Gross)",
        "color_hex": "#b91c1c",
        "outcome_badge": "TENURE BREACH (72 MO) & LATE FEE OVERCHARGE",
        "schedule_a": [
            ("Financed Asset", "2026 Premium SUV (Brand New)"),
            ("Vehicle Invoiced Price", "AED 160,000.00"),
            ("Down Payment Received", "AED 0.00 (Zero Down Payment Promotion - 100% Financed)"),
            ("Sanctioned Loan Principal", "AED 160,000.00"),
            ("Loan Repayment Tenure", "72 Months (6 Years)"),
            ("Scheduled Monthly Installment (EMI)", "AED 2,750.00"),
            ("Late Payment Delinquent Charge", "AED 350.00 per occurrence"),
            ("Processing & Admin Fee", "AED 3,200.00 (Exceeds CBUAE standard cap)"),
        ],
        "clauses": [
            ("Clause 5.1 — Extended Auto Tenure Terms",
             "The facility is amortized across seventy-two (72) equal monthly installments of AED 2,750.00. Notice 2011/23 Article 5 statutory cap is 60 months; customer voluntarily elects extended 72-month tenure."),
            ("Clause 9.3 — Delinquency and Administrative Surcharges",
             "Any payment delayed beyond the 5th day of each billing cycle shall be assessed an administrative late fee of AED 350.00 per incident."),
            ("Clause 13.0 — UAE Banking Regulations",
             "Governed by the civil and commercial laws of the United Arab Emirates and CBUAE financing standards.")
        ]
    },
    {
        "id": "scenario-4",
        "slug": "04_Dubai_Crescent_Consolidated_Credit_Facility",
        "bank_name": "DUBAI CRESCENT CREDIT BANK (PJSC)",
        "license_info": "Licensed Commercial Banking Institution | Central Bank of the UAE Registration No. 1104",
        "doc_title": "CONSOLIDATED RETAIL CREDIT FACILITY SANCTION LETTER",
        "ref_no": "DCCB-CRF-2026-8812",
        "date_str": "28 February 2026",
        "borrower_name": "Hamad Salem Al-Falasi",
        "borrower_id": "784-1991-7654321-2",
        "income": "AED 16,000.00 per month (Verified Gross Monthly Income)",
        "color_hex": "#d97706", # Amber badge
        "outcome_badge": "SEVERE DEBT BURDEN RATIO (74.7% DBR) BREACH",
        "schedule_a": [
            ("Facility Type", "Personal Debt Consolidation Facility"),
            ("Approved Principal Amount", "AED 320,000.00"),
            ("Agreed Loan Tenure", "48 Months (4 Years)"),
            ("Scheduled Monthly Loan Installment (EMI)", "AED 7,650.00"),
            ("Active Auto Loan Commitment", "AED 1,800.00 / month"),
            ("Approved Revolving Credit Card Limits", "AED 50,000.00 (Imputed 5% monthly: AED 2,500.00)"),
            ("Total Aggregate Monthly Debt Commitments", "AED 11,950.00 per month"),
            ("Computed Debt Burden Ratio (DBR)", "74.69% of Gross Monthly Income"),
            ("Upfront Processing Fee", "AED 1,600.00 (0.5% of principal)"),
            ("Late Payment Charge", "AED 150.00 per missed cycle"),
        ],
        "clauses": [
            ("Clause 8.2 — Prepayment & Foreclosure Terms",
             "Early settlement shall be permitted subject to an early settlement charge of 1.0% of the remaining outstanding principal balance or AED 10,000.00, whichever is lower, in accordance with Central Bank of the UAE regulatory schedules."),
            ("Clause 12.1 — Debt Burden Ratio Acknowledgment",
             "The Borrower acknowledges that aggregate monthly repayment commitments across all active facilities equal AED 11,950.00 per month, representing 74.69% of validated monthly earnings. Central Bank Notice 2011/23 Article 7 restricts retail DBR to 50.0%."),
            ("Clause 15.3 — Regulatory Oversight",
             "This credit facility is governed by the laws of the United Arab Emirates and subject to CBUAE regulatory enforcement.")
        ]
    },
    {
        "id": "scenario-5",
        "slug": "05_Barclays_Bank_UK_Consumer_Credit_Facility",
        "bank_name": "BARCLAYS BANK UK PLC (LONDON BRANCH)",
        "license_info": "Authorized by the Prudential Regulation Authority (PRA) | Regulated by the Financial Conduct Authority (FCA) Ref: 122702",
        "doc_title": "UK CONSUMER CREDIT ACT 1974 REGULATED CREDIT AGREEMENT",
        "ref_no": "BARC-UK-2026-4491",
        "date_str": "20 January 2026",
        "borrower_name": "Oliver William Hughes",
        "borrower_id": "National Insurance: QQ 12 34 56 A",
        "income": "£4,500.00 per month (Verified Gross)",
        "color_hex": "#eab308", # Yellow badge
        "outcome_badge": "AUTONOMOUS REFUSAL GATE (UK FCA JURISDICTION)",
        "schedule_a": [
            ("Facility Type", "Unsecured Fixed-Sum Personal Loan Agreement"),
            ("Credit Facility Amount", "£15,000.00"),
            ("Duration of Agreement", "36 Months (3 Years)"),
            ("Representative APR", "19.9% APR (Fixed)"),
            ("Scheduled Monthly Repayments", "£542.80"),
            ("Governing Authority", "UK Financial Conduct Authority (FCA) Consumer Credit Sourcebook"),
            ("Applicable Law", "Laws of England and Wales under Bank of England Supervision"),
        ],
        "clauses": [
            ("Section 94 — Right to Early Settlement",
             "The Borrower has the right under Section 94 of the Consumer Credit Act 1974 to settle this agreement early in full or in part. In accordance with Regulation 5 of the Consumer Credit (Early Settlement) Regulations 2004, the Lender may apply a settlement rebate calculated under the statutory actuarial formula."),
            ("Dispute Escalation & Ombudsman",
             "Complaints relating to this facility may be escalated to the Financial Ombudsman Service (FOS) at Exchange Tower, London E14 9SR, United Kingdom."),
            ("Jurisdictional Statement",
             "This contract is governed exclusively by the laws of England and Wales. It is entirely outside the regulatory scope of the Central Bank of the UAE.")
        ]
    }
]


def set_cell_background(cell, fill_hex):
    """Set background color of a docx table cell."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)


def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set inner cell padding in dxa."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)


def generate_word_document(doc_info: dict, target_path: Path):
    """Generate professional Word document."""
    doc = docx.Document()
    
    # Page setup: A4 with standard margins
    section = doc.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

    # Header Bank Banner
    header_p = doc.add_paragraph()
    header_run = header_p.add_run(doc_info["bank_name"])
    header_run.bold = True
    header_run.font.size = Pt(15)
    header_run.font.color.rgb = RGBColor(15, 23, 42)
    header_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    license_p = doc.add_paragraph()
    license_run = license_p.add_run(doc_info["license_info"])
    license_run.font.size = Pt(8.5)
    license_run.font.color.rgb = RGBColor(100, 116, 139)
    license_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    license_p.paragraph_format.space_after = Pt(12)

    # Horizontal Divider
    divider_p = doc.add_paragraph()
    divider_p.paragraph_format.space_after = Pt(8)
    d_run = divider_p.add_run("―" * 58)
    d_run.font.color.rgb = RGBColor(203, 213, 225)
    divider_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # Document Title & Badge
    title_p = doc.add_paragraph()
    title_run = title_p.add_run(doc_info["doc_title"])
    title_run.bold = True
    title_run.font.size = Pt(13)
    title_run.font.color.rgb = RGBColor(2, 132, 199) # Sky blue
    title_p.paragraph_format.space_after = Pt(4)

    badge_p = doc.add_paragraph()
    badge_run = badge_p.add_run(f"AUDIT STRESS TEST TARGET: {doc_info['outcome_badge']}")
    badge_run.bold = True
    badge_run.font.size = Pt(9)
    badge_run.font.color.rgb = RGBColor(225, 29, 72)
    badge_p.paragraph_format.space_after = Pt(12)

    # Metadata Grid Table
    meta_table = doc.add_table(rows=3, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    meta_data = [
        [f"Contract Reference: {doc_info['ref_no']}", f"Sanction Date: {doc_info['date_str']}"],
        [f"Borrower: {doc_info['borrower_name']}", f"Borrower ID: {doc_info['borrower_id']}"],
        [f"Verified Income: {doc_info['income']}", "Regulatory Gazette: CBUAE Licensed Entity"]
    ]

    for row_idx, row in enumerate(meta_table.rows):
        for col_idx, cell in enumerate(row.cells):
            cell.width = Inches(3.3)
            set_cell_background(cell, "f8fafc")
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.text = meta_data[row_idx][col_idx]
            p.runs[0].font.size = Pt(9.5)
            p.runs[0].font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Schedule A Heading
    sch_a_head = doc.add_paragraph()
    sch_a_head_run = sch_a_head.add_run("SCHEDULE A: SANCTIONED FACILITY TERMS & SCHEDULE")
    sch_a_head_run.bold = True
    sch_a_head_run.font.size = Pt(11)
    sch_a_head_run.font.color.rgb = RGBColor(15, 23, 42)
    sch_a_head.paragraph_format.space_after = Pt(6)

    # Schedule A Table
    table = doc.add_table(rows=len(doc_info["schedule_a"]) + 1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    hdr_cells[0].width = Inches(2.8)
    hdr_cells[1].width = Inches(3.8)
    hdr_cells[0].text = "Credit Parameter / Covenant"
    hdr_cells[1].text = "Stipulated Contractual Term"
    for cell in hdr_cells:
        set_cell_background(cell, "0f172a")
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        p = cell.paragraphs[0]
        p.runs[0].bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    for r_idx, (k, v) in enumerate(doc_info["schedule_a"]):
        row_cells = table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(2.8)
        row_cells[1].width = Inches(3.8)
        row_cells[0].text = k
        row_cells[1].text = v
        
        bg_color = "f1f5f9" if r_idx % 2 == 1 else "ffffff"
        for c_idx, cell in enumerate(row_cells):
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
            p = cell.paragraphs[0]
            p.runs[0].font.size = Pt(9)
            if c_idx == 0:
                p.runs[0].bold = True
                p.runs[0].font.color.rgb = RGBColor(51, 65, 85)
            else:
                p.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Schedule B: Clauses
    sch_b_head = doc.add_paragraph()
    sch_b_head_run = sch_b_head.add_run("SCHEDULE B: CONTRACTUAL COVENANTS & LEGAL PROVISIONS")
    sch_b_head_run.bold = True
    sch_b_head_run.font.size = Pt(11)
    sch_b_head_run.font.color.rgb = RGBColor(15, 23, 42)
    sch_b_head.paragraph_format.space_after = Pt(6)

    for c_title, c_body in doc_info["clauses"]:
        cp = doc.add_paragraph()
        c_run = cp.add_run(c_title)
        c_run.bold = True
        c_run.font.size = Pt(10)
        c_run.font.color.rgb = RGBColor(30, 41, 59)
        cp.paragraph_format.space_after = Pt(2)

        body_p = doc.add_paragraph()
        b_run = body_p.add_run(c_body)
        b_run.font.size = Pt(9.5)
        b_run.font.color.rgb = RGBColor(71, 85, 105)
        body_p.paragraph_format.space_after = Pt(8)

    # Signatures
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    
    cell_0 = sig_table.rows[0].cells[0]
    cell_1 = sig_table.rows[0].cells[1]
    cell_0.width = Inches(3.3)
    cell_1.width = Inches(3.3)
    cell_0.text = "FOR AND ON BEHALF OF LENDER:\n\n___________________________________\nAuthorized Signatory (Credit Underwriting)\nOfficial Institutional Seal"
    cell_1.text = "BORROWER ACCEPTANCE & WARRANTY:\n\n___________________________________\nBorrower Signature\nEmirates ID Verified"
    
    for cell in (cell_0, cell_1):
        set_cell_background(cell, "fafafa")
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        for p in cell.paragraphs:
            for run in p.runs:
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(100, 116, 139)

    doc.save(str(target_path))


def generate_pdf_document(doc_info: dict, target_path: Path):
    """Generate high quality, print-ready PDF document."""
    doc = SimpleDocTemplate(
        str(target_path),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0284c7'),
        alignment=0,
        spaceAfter=4
    )

    bank_style = ParagraphStyle(
        'BankHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        spaceAfter=2
    )

    license_style = ParagraphStyle(
        'BankLicense',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#64748b'),
        alignment=1,
        spaceAfter=8
    )

    badge_style = ParagraphStyle(
        'AuditBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor(doc_info['color_hex']),
        spaceAfter=10
    )

    heading_style = ParagraphStyle(
        'SectionHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=4
    )

    clause_title_style = ParagraphStyle(
        'ClauseTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=6,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    cell_style_k = ParagraphStyle(
        'CellKey',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    cell_style_v = ParagraphStyle(
        'CellVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    cell_style_hdr = ParagraphStyle(
        'CellHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Header
    story.append(Paragraph(doc_info["bank_name"], bank_style))
    story.append(Paragraph(doc_info["license_info"], license_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=8))

    # Doc Title & Badge
    story.append(Paragraph(doc_info["doc_title"], title_style))
    story.append(Paragraph(f"AUDIT STRESS TEST TARGET: {doc_info['outcome_badge']}", badge_style))

    # Meta Table (2 columns x 3 rows)
    meta_table_data = [
        [Paragraph(f"<b>Reference:</b> {doc_info['ref_no']}", cell_style_v), Paragraph(f"<b>Sanction Date:</b> {doc_info['date_str']}", cell_style_v)],
        [Paragraph(f"<b>Borrower:</b> {doc_info['borrower_name']}", cell_style_v), Paragraph(f"<b>Borrower ID:</b> {doc_info['borrower_id']}", cell_style_v)],
        [Paragraph(f"<b>Verified Income:</b> {doc_info['income']}", cell_style_v), Paragraph("<b>Supervisory Gazette:</b> CBUAE Licensed Entity", cell_style_v)]
    ]
    meta_table = Table(meta_table_data, colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # Schedule A Table
    story.append(Paragraph("SCHEDULE A: SANCTIONED FACILITY TERMS & COMMITMENTS", heading_style))

    table_data = [[
        Paragraph("Credit Parameter / Covenant", cell_style_hdr),
        Paragraph("Stipulated Contractual Term", cell_style_hdr)
    ]]

    for k, v in doc_info["schedule_a"]:
        table_data.append([
            Paragraph(k, cell_style_k),
            Paragraph(v, cell_style_v)
        ])

    terms_table = Table(table_data, colWidths=[210, 310])
    terms_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(terms_table)
    story.append(Spacer(1, 8))

    # Schedule B Clauses
    story.append(Paragraph("SCHEDULE B: CONTRACTUAL COVENANTS & LEGAL PROVISIONS", heading_style))

    for c_title, c_body in doc_info["clauses"]:
        story.append(Paragraph(c_title, clause_title_style))
        story.append(Paragraph(c_body, body_style))

    # Signature Block
    sig_data = [
        [
            Paragraph("<b>FOR AND ON BEHALF OF LENDER:</b><br/><br/>___________________________________<br/>Authorized Officer (Credit Risk)<br/>Official Bank Stamp", cell_style_v),
            Paragraph("<b>BORROWER ACCEPTANCE & WARRANTY:</b><br/><br/>___________________________________<br/>Borrower Signature<br/>Emirates ID Verified", cell_style_v)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[260, 260])
    sig_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    
    story.append(KeepTogether([
        Spacer(1, 10),
        sig_table
    ]))

    doc.build(story)


def main():
    print(f"Generating 5 Word (.docx) and 5 PDF (.pdf) sample sanction documents...")
    
    for item in SAMPLE_DOCS:
        slug = item["slug"]
        for out_dir in OUTPUT_DIRS:
            docx_path = out_dir / f"{slug}.docx"
            pdf_path = out_dir / f"{slug}.pdf"
            
            generate_word_document(item, docx_path)
            generate_pdf_document(item, pdf_path)
            print(f"  [+] Created: {docx_path.name} & {pdf_path.name} in {out_dir}")

    print("\nAll 10 sample documents (5 Word .docx + 5 PDF .pdf) generated successfully!")


if __name__ == "__main__":
    main()
