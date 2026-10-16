import type { AuditResponse } from '../types';

/**
 * Generate a beautifully styled, print-ready and Word-compatible HTML dossier
 * from the live CBUAE audit results and markdown text.
 */
export function buildAuditDossierHtml(title: string, _markdownText?: string, auditResult?: AuditResponse | null): string {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' GST';

  const isViolation = auditResult?.overall_status === 'NON_COMPLIANT_INFRACTIONS_DETECTED';
  const statusLabel = isViolation
    ? 'STATUTORY VIOLATIONS DETECTED'
    : auditResult?.overall_status === 'FULLY_COMPLIANT'
    ? 'FULLY COMPLIANT'
    : 'OUT OF SCOPE / REFUSAL TRIGGERED';

  const restitutionAed = auditResult?.total_restitution_due_aed || 0;

  const findings = auditResult?.compliance_findings || [];
  const clauses = auditResult?.extracted_clauses || [];
  const actionPlan = auditResult?.action_plan || [];

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${title} - CBUAE Compliance Audit Dossier</title>
<style>
  @page {
    size: A4;
    margin: 20mm;
  }
  body {
    font-family: 'Calibri', 'Arial', 'Segoe UI', sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1e293b;
    margin: 0;
    padding: 24px;
    background-color: #ffffff;
  }
  .header-box {
    border-bottom: 3px solid #0284c7;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .agency-badge {
    font-size: 9pt;
    font-weight: bold;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
  }
  .doc-title {
    font-size: 22pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
  }
  .doc-subtitle {
    font-size: 11pt;
    color: #64748b;
  }
  .meta-grid {
    margin-top: 14px;
    font-size: 10pt;
    color: #475569;
  }
  .badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 10pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 10px;
  }
  .badge-violation {
    background-color: #ffe4e6;
    color: #be123c;
    border: 1px solid #f43f5e;
  }
  .badge-compliant {
    background-color: #dcfce7;
    color: #15803d;
    border: 1px solid #22c55e;
  }
  .restitution-banner {
    background-color: #fff1f2;
    border: 1px solid #fecdd3;
    border-left: 6px solid #e11d48;
    padding: 16px 20px;
    border-radius: 8px;
    margin: 20px 0;
  }
  .restitution-title {
    font-size: 12pt;
    font-weight: bold;
    color: #9f1239;
    margin-bottom: 4px;
  }
  .restitution-amount {
    font-size: 18pt;
    font-weight: 800;
    font-family: 'Consolas', 'Courier New', monospace;
    color: #e11d48;
  }
  h2 {
    font-size: 14pt;
    color: #0369a1;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 12px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 10px 14px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: bold;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .finding-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 12px;
    background-color: #ffffff;
  }
  .citation-code {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9pt;
    color: #0284c7;
    background-color: #f0f9ff;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #bae6fd;
  }
  .footer-note {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #cbd5e1;
    font-size: 9pt;
    color: #64748b;
    text-align: center;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>

  <!-- Header Box -->
  <div class="header-box">
    <div class="agency-badge">Central Bank of the United Arab Emirates • Regulatory Compliance Dossier</div>
    <div class="doc-title">CBUAE Credit Facility Audit Dossier</div>
    <div class="doc-subtitle">Statutory Compliance Verification & Restitution Analysis Report</div>
    
    <div class="meta-grid">
      <div><strong>Evaluated Facility:</strong> ${title}</div>
      <div><strong>Date of Evaluation:</strong> ${dateStr} at ${timeStr}</div>
      <div><strong>Governing Authority:</strong> Central Bank of the UAE (CBUAE) Consumer Protection Framework</div>
    </div>

    <div class="badge ${isViolation ? 'badge-violation' : 'badge-compliant'}">
      ${isViolation ? '⚠️ ' : '✓ '} ${statusLabel}
    </div>
  </div>

  ${restitutionAed > 0 ? `
  <!-- Restitution Summary Banner -->
  <div class="restitution-banner">
    <div class="restitution-title">Mandated Financial Restitution Due to Borrower:</div>
    <div class="restitution-amount">+AED ${restitutionAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    <div style="font-size: 9pt; color: #881337; margin-top: 4px;">
      Statutory Overcharge under CBUAE Notice No. 3877/2019 & Circular No. 8/2020 Article 4.3 (1.0% Prepayment Cap).
    </div>
  </div>
  ` : ''}

  <!-- 1. Executive Summary -->
  <h2>1. Executive Regulatory Summary</h2>
  <p style="font-size: 11pt; line-height: 1.6; color: #334155;">
    ${auditResult?.executive_summary || 'The facility has been evaluated against Central Bank of the UAE consumer lending regulations.'}
  </p>

  <!-- 2. Extracted Contractual Parameters -->
  ${clauses.length > 0 ? `
  <h2>2. Extracted Contractual Terms & Covenants</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Clause Category</th>
        <th style="width: 70%;">Extracted Contract Covenant</th>
      </tr>
    </thead>
    <tbody>
      ${clauses.map(c => `
        <tr>
          <td><strong>${c.clause_type}</strong></td>
          <td>${c.contract_statement}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  <!-- 3. Compliance Checkpoints & Findings -->
  <h2>3. CBUAE Statutory Audit Findings</h2>
  ${findings.length > 0 ? findings.map(f => `
    <div class="finding-card" style="border-left: 4px solid ${f.status === 'VIOLATION' ? '#e11d48' : '#10b981'};">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <strong style="font-size: 11pt; color: #0f172a;">${f.checkpoint_name}</strong>
        <span style="font-size: 9pt; font-weight: bold; color: ${f.status === 'VIOLATION' ? '#be123c' : '#15803d'};">
          ${f.status === 'VIOLATION' ? 'STATUTORY VIOLATION' : 'COMPLIANT'}
        </span>
      </div>
      <div style="margin-bottom: 6px;">
        <span class="citation-code">${f.legal_citation}</span>
      </div>
      <p style="font-size: 10pt; color: #475569; margin: 6px 0;">${f.explanation}</p>
      ${f.excess_financial_impact_aed > 0 ? `
        <div style="font-size: 10pt; font-weight: bold; color: #b91c1c; margin-top: 4px;">
          Unlawful Overcharge: AED ${f.excess_financial_impact_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      ` : ''}
    </div>
  `).join('') : '<p>No specific findings recorded.</p>'}

  <!-- 4. Action Plan & Legal Remediation -->
  ${actionPlan.length > 0 ? `
  <h2>4. Remediation & Ombudsman Escalation Steps</h2>
  <ol style="padding-left: 20px; font-size: 10pt; color: #334155; line-height: 1.8;">
    ${actionPlan.map(a => `<li>${a}</li>`).join('')}
  </ol>
  ` : ''}

  <!-- Institutional Footer -->
  <div class="footer-note">
    <div><strong>ReguGraph-UAE Regulatory Intelligence Engine • Version 2.0.0</strong></div>
    <div>CBUAE Notice 2011/23 • Notice 3877/2019 • Circular 8/2020 • Sanadak Ombudsman Escalation Standards</div>
    <div style="margin-top: 4px; font-size: 8pt; color: #94a3b8;">This dossier serves as formal evidence for bank compliance review and UAE Financial Ombudsman (Sanadak) dispute filings.</div>
  </div>

</body>
</html>`;
}

/**
 * Download as Microsoft Word Document (.doc)
 * Word natively interprets HTML with Office XML namespaces when encoded with UTF-8 BOM.
 */
export function downloadWordDossier(title: string, markdownText?: string, auditResult?: AuditResponse | null) {
  const htmlContent = buildAuditDossierHtml(title, markdownText, auditResult);
  // Add UTF-8 BOM (\ufeff) so Word decodes special characters properly
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = (title || 'CBUAE_Credit_Facility_Audit').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
  a.download = `${safeTitle}_Compliance_Report.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download as Official PDF Document (.pdf) via native browser print driver.
 */
export function downloadPdfDossier(title: string, markdownText?: string, auditResult?: AuditResponse | null) {
  const htmlContent = buildAuditDossierHtml(title, markdownText, auditResult);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the PDF preview & print window.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for document to load, then trigger native print (which saves as PDF)
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}
