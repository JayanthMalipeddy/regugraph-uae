import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Lock,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Search,
  FileText,
  Upload,
  Check
} from 'lucide-react';
import type { ContractScenario, AuditResponse } from '../types';
import { auditContract, exportAuditReport } from '../services/api';
import { downloadWordDossier, downloadPdfDossier } from '../utils/reportExport';
import { HeroCarousel } from './HeroCarousel';

interface AuditStudioProps {
  scenarios: ContractScenario[];
  onNavigateTab?: (tab: string) => void;
}

export const AuditStudio: React.FC<AuditStudioProps> = ({ scenarios, onNavigateTab }) => {
  const [viewMode, setViewMode] = useState<'blocks' | 'list' | 'table'>('blocks');
  const [listCategory, setListCategory] = useState<'all' | 'personal' | 'mortgage' | 'auto'>('all');
  const [tableFilter, setTableFilter] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'1y' | '6m' | '3m' | '1m'>('6m');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-1');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'simple' | 'document'>('simple');
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [activeBannerMessage, setActiveBannerMessage] = useState<string | null>(null);

  // File Upload & Sample Sanctions State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('scenario-1');
  const [isUploadingDocument, setIsUploadingDocument] = useState<boolean>(false);

  // Borrower simple inputs (Human friendly, no technical jargon!)
  const [bankName, setBankName] = useState<string>('Apex Gulf Finance');
  const [loanType, setLoanType] = useState<string>('Personal Loan');
  const [loanAmount, setLoanAmount] = useState<number>(400000);
  const [monthlySalary, setMonthlySalary] = useState<number>(25000);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [exitFeeCharged, setExitFeeCharged] = useState<number>(12000);
  const [contractText, setContractText] = useState<string>('');

  // Initialize with Scenario 1 contract text
  useEffect(() => {
    if (scenarios.length > 0 && !contractText) {
      const s1 = scenarios[0];
      setSelectedScenarioId(s1.id);
      setContractText(s1.contract_text);
      // Auto-run initial audit so dashboard starts populated with live data
      handleAudit(s1.contract_text, s1.title);
    }
  }, [scenarios]);

  const handleSelectPreset = (sc: ContractScenario, shouldScroll: boolean = false) => {
    setViewMode('blocks');
    setSelectedScenarioId(sc.id);
    setContractText(sc.contract_text);
    handleAudit(sc.contract_text, sc.title);

    // Provide explicit confirmation banner
    setActiveBannerMessage(`Loaded & Audited: ${sc.title} — Restitution: AED ${sc.expected_restitution_aed.toLocaleString()} (${sc.severity})`);
    setTimeout(() => setActiveBannerMessage(null), 5000);

    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('benchmarks-dock');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleAudit = async (textToAudit: string, titleToAudit?: string) => {
    setIsAuditing(true);
    try {
      const res = await auditContract(textToAudit, titleToAudit || `${bankName} ${loanType} Facility`);
      setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCompileSimpleInput = () => {
    // Convert friendly borrower inputs into audit text
    const text = `CREDIT FACILITY AGREEMENT
Lending Institution: ${bankName}
Facility Type: ${loanType}
Principal Disbursed Amount: AED ${loanAmount.toLocaleString()}
Borrower Gross Monthly Salary: AED ${monthlySalary.toLocaleString()}
Agreed Repayment Tenure: ${tenureMonths} Months
Monthly Installment (EMI): AED ${Math.round(loanAmount / Math.min(tenureMonths, 48)).toLocaleString()}
Early Settlement Exit Clause: In the event of early loan payoff, the borrower shall pay an exit penalty of AED ${exitFeeCharged.toLocaleString()} (or 3.0% of outstanding balance).
Late Payment Charge: AED 350 per delayed cycle.
Governing Law: Central Bank of the United Arab Emirates.`;

    setContractText(text);
    setShowInputModal(false);
    handleAudit(text, `${bankName} ${loanType}`);
  };

  const processSelectedFile = async (file: File) => {
    setUploadedFileName(file.name);
    const sizeKb = (file.size / 1024).toFixed(1);
    setUploadedFileSize(`${sizeKb} KB`);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // If PDF or Word (.docx, .doc), use backend parser
    if (ext === 'pdf' || ext === 'docx' || ext === 'doc') {
      setIsUploadingDocument(true);
      setActiveBannerMessage(`Extracting contractual terms from ${file.name}...`);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.extracted_text) {
          setContractText(data.extracted_text);
          setUploadedFileSize(`${data.size_kb} KB (${data.character_count} chars extracted)`);
          setActiveBannerMessage(`Sanction document loaded: ${file.name} (${data.size_kb} KB)`);
        } else {
          throw new Error(data.detail || 'Could not parse document');
        }
      } catch (err: any) {
        alert('Failed to parse document: ' + (err.message || err));
      } finally {
        setIsUploadingDocument(false);
        setTimeout(() => setActiveBannerMessage(null), 5000);
      }
    } else {
      // Plain text, markdown, rtf, json
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setContractText(content);
          setActiveBannerMessage(`Sanction document loaded: ${file.name} (${sizeKb} KB)`);
          setTimeout(() => setActiveBannerMessage(null), 5000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processSelectedFile(file);
  };

  const sampleSanctionDocuments = [
    {
      id: 'scenario-1',
      title: 'Apex Gulf Finance (Personal Loan)',
      bank: 'Apex Gulf Finance PJSC',
      type: 'Personal Loan',
      badge: '🔴 Overcharge & Tenure Violation',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Unlawful 3% prepayment exit fee (AED 12k vs AED 4k cap) and 60-month tenure cap violation.',
      expected: 'Non-Compliant (+AED 16,050 Restitution)',
      docxUrl: '/samples/01_Apex_Gulf_Finance_Personal_Loan_Sanction.docx',
      pdfUrl: '/samples/01_Apex_Gulf_Finance_Personal_Loan_Sanction.pdf',
      docName: '01_Apex_Gulf_Finance_Personal_Loan_Sanction'
    },
    {
      id: 'scenario-2',
      title: 'Emirates First Bank (Compliant Mortgage)',
      bank: 'Emirates First Commercial Bank',
      type: 'Residential Mortgage',
      badge: '🟢 100% Fully Compliant',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'First home mortgage strictly adhering to Notice 3877/2019, 25-yr tenure cap, and 1% fee cap.',
      expected: 'Fully Compliant (AED 0 Restitution)',
      docxUrl: '/samples/02_Emirates_First_Bank_Mortgage_Facility.docx',
      pdfUrl: '/samples/02_Emirates_First_Bank_Mortgage_Facility.pdf',
      docName: '02_Emirates_First_Bank_Mortgage_Facility'
    },
    {
      id: 'scenario-3',
      title: 'Falcon Auto Credit (Subprime Auto Loan)',
      bank: 'Falcon Auto Credit LLC',
      type: 'Auto Loan',
      badge: '🔴 72-Mo Tenure Breach',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Vehicle credit facility containing 72-month tenure breach and compounding late fee.',
      expected: 'Tenure Infraction (+AED 2,250 Restitution)',
      docxUrl: '/samples/03_Falcon_Auto_Credit_Subprime_Facility.docx',
      pdfUrl: '/samples/03_Falcon_Auto_Credit_Subprime_Facility.pdf',
      docName: '03_Falcon_Auto_Credit_Subprime_Facility'
    },
    {
      id: 'scenario-5',
      title: 'Dubai Crescent Credit (Over-Leveraged DBR)',
      bank: 'Dubai Crescent Credit Bank PJSC',
      type: 'Consolidated Loan',
      badge: '🔴 74.7% DBR Ceiling Breach',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'Consolidated debt commitments pushing DBR to 74.7%, breaching CBUAE 50% cap under Notice 2011/23.',
      expected: 'Severe DBR Breach (Sanctions Risk)',
      docxUrl: '/samples/04_Dubai_Crescent_Consolidated_Credit_Facility.docx',
      pdfUrl: '/samples/04_Dubai_Crescent_Consolidated_Credit_Facility.pdf',
      docName: '04_Dubai_Crescent_Consolidated_Credit_Facility'
    },
    {
      id: 'scenario-4',
      title: 'Barclays London Branch (Offshore UK Facility)',
      bank: 'Barclays Bank UK PLC',
      type: 'Offshore Facility',
      badge: '🟡 Jurisdiction Refusal Gate',
      badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      description: 'Out-of-jurisdiction agreement governed by UK FCA. Triggers autonomous CBUAE refusal gate.',
      expected: 'Autonomous Refusal Gate',
      docxUrl: '/samples/05_Barclays_Bank_UK_Consumer_Credit_Facility.docx',
      pdfUrl: '/samples/05_Barclays_Bank_UK_Consumer_Credit_Facility.pdf',
      docName: '05_Barclays_Bank_UK_Consumer_Credit_Facility'
    }
  ];

  const handleSelectSampleSanction = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const matched = scenarios.find((s) => s.id === sampleId);
    if (matched && matched.contract_text) {
      setContractText(matched.contract_text);
      setUploadedFileName(matched.filename || `${sampleId}.md`);
      setUploadedFileSize('Sanction Sample');
    }
  };

  const handleExportWord = async () => {
    setShowDownloadMenu(false);
    try {
      const { report_markdown, title } = await exportAuditReport(
        contractText,
        auditResult?.contract_title || 'Credit Facility Audit'
      );
      downloadWordDossier(title, report_markdown, auditResult);
    } catch (err: any) {
      alert('Error generating Word report: ' + (err.message || err));
    }
  };

  const handleExportPdf = async () => {
    setShowDownloadMenu(false);
    try {
      const { report_markdown, title } = await exportAuditReport(
        contractText,
        auditResult?.contract_title || 'Credit Facility Audit'
      );
      downloadPdfDossier(title, report_markdown, auditResult);
    } catch (err: any) {
      alert('Error generating PDF report: ' + (err.message || err));
    }
  };

  const baseFacilities = [
    {
      id: 'fac-1',
      scenarioId: 'scenario-1',
      title: 'Predatory Personal Loan Facility',
      bankName: 'Apex Gulf Finance',
      bankBadge: 'AGF',
      loanType: 'Personal Loan',
      category: 'personal',
      principalAed: 400000,
      tenureMonths: 60,
      emiAed: 8333,
      dbrPercent: 56.0,
      isCompliant: false,
      statusLabel: 'CRITICAL BREACH',
      restitutionAed: 16050,
      authority: 'Circular 8/2020 & Notice 2011/23',
      summary: 'Features unlawful 3% exit penalty (AED 12,000), 60-month tenure exceeding 48-month statutory cap, and 56% DBR.'
    },
    {
      id: 'fac-2',
      scenarioId: 'scenario-2',
      title: 'Compliant Residential Mortgage Agreement',
      bankName: 'Emirates First Bank',
      bankBadge: 'EFB',
      loanType: 'Residential Mortgage',
      category: 'mortgage',
      principalAed: 1200000,
      tenureMonths: 300,
      emiAed: 6850,
      dbrPercent: 32.4,
      isCompliant: true,
      statusLabel: 'FULLY COMPLIANT',
      restitutionAed: 0,
      authority: 'Circular 31/2013 & Notice 3877/2019',
      summary: 'Tier-1 mortgage agreement strictly compliant with CBUAE 25-year tenure cap, 80% LTV, and 1% capped settlement.'
    },
    {
      id: 'fac-3',
      scenarioId: 'scenario-3',
      title: 'Subprime Auto Financing Facility',
      bankName: 'Falcon Auto Credit',
      bankBadge: 'FAC',
      loanType: 'Auto Loan',
      category: 'auto',
      principalAed: 180000,
      tenureMonths: 72,
      emiAed: 3200,
      dbrPercent: 38.0,
      isCompliant: false,
      statusLabel: 'TENURE VIOLATION',
      restitutionAed: 2250,
      authority: 'Notice 2011/23 Art 5.1',
      summary: '72-month vehicle loan breaching CBUAE 60-month statutory ceiling with excess compound late fee clauses.'
    },
    {
      id: 'fac-4',
      scenarioId: 'custom',
      title: 'Corporate Treasury Working Capital Line',
      bankName: 'First Abu Dhabi Bank',
      bankBadge: 'FAB',
      loanType: 'Corporate Line',
      category: 'personal',
      principalAed: 950000,
      tenureMonths: 48,
      emiAed: 21200,
      dbrPercent: 28.5,
      isCompliant: true,
      statusLabel: 'COMPLIANT',
      restitutionAed: 0,
      authority: 'CBUAE Commercial Standards',
      summary: 'Prime corporate debt facility monitored for liquidity ratios and verified fee structures.'
    },
    {
      id: 'fac-5',
      scenarioId: 'scenario-4',
      title: 'UK Consumer Credit Facility',
      bankName: 'Barclays London Branch',
      bankBadge: 'BAR',
      loanType: 'Foreign Jurisdiction',
      category: 'personal',
      principalAed: 120000,
      tenureMonths: 48,
      emiAed: 2800,
      dbrPercent: 0,
      isCompliant: false,
      statusLabel: 'OUT OF SCOPE REFUSAL',
      restitutionAed: 0,
      authority: 'UK Financial Conduct Authority (FCA)',
      summary: 'Governed by UK FCA laws. Triggers autonomous jurisdiction refusal gate to safeguard CBUAE scope.'
    }
  ];

  const filteredFacilities = baseFacilities.filter((f) => {
    if (listCategory !== 'all' && f.category !== listCategory) return false;
    return true;
  });

  const tableRows = baseFacilities.filter((f) => {
    if (!tableFilter.trim()) return true;
    const q = tableFilter.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.bankName.toLowerCase().includes(q) ||
      f.loanType.toLowerCase().includes(q) ||
      f.statusLabel.toLowerCase().includes(q) ||
      f.authority.toLowerCase().includes(q)
    );
  });

  const handleAuditFromFacility = (fac: typeof baseFacilities[0]) => {
    const matched = scenarios.find((s) => s.id === fac.scenarioId);
    if (matched) {
      handleSelectPreset(matched);
    } else {
      setBankName(fac.bankName);
      setLoanType(fac.loanType);
      setLoanAmount(fac.principalAed);
      setTenureMonths(fac.tenureMonths);
      handleCompileSimpleInput();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Dashboard Header Bar (matching fintechui.jpeg) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          
          {/* View Switcher Pills */}
          <div className="flex items-center bg-[#131b2e] p-1 rounded-2xl border border-slate-800/90 text-xs">
            {(['blocks', 'list', 'table'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl capitalize font-medium transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons (matching fintechui.jpeg) */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowInputModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Audit Loan Facility</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#131b2e] hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
              title="Download Compliance Dossier as Word or PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download report</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            {/* Dropdown Menu for Word vs PDF format */}
            {showDownloadMenu && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800/80 mb-1">
                  Select Report Format
                </div>
                <button
                  onClick={handleExportWord}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs text-slate-200 hover:text-white transition-colors cursor-pointer group"
                >
                  <FileText className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-white">Microsoft Word (.doc)</div>
                    <div className="text-[10px] text-slate-400">Editable Word document</div>
                  </div>
                </button>
                <button
                  onClick={handleExportPdf}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs text-slate-200 hover:text-white transition-colors cursor-pointer group mt-0.5"
                >
                  <Download className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-white">Adobe PDF (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Printable executive dossier</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Action Confirmation Banner */}
      {activeBannerMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{activeBannerMessage}</span>
          </div>
          <button
            onClick={() => setActiveBannerMessage(null)}
            className="text-slate-400 hover:text-white text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Interactive Feature Walkthrough Slideshow (Tells visitors what they can do) */}
      <HeroCarousel
        onAuditFacility={() => setShowInputModal(true)}
        onOpenCalculators={() => onNavigateTab ? onNavigateTab('calculators') : undefined}
        onSelectCaseStudy={(scId) => {
          const sc = scenarios.find((s) => s.id === scId);
          if (sc) handleSelectPreset(sc, true);
        }}
      />

      {/* ============================================================== */}
      {/* 1. BLOCKS VIEW (Default Visual FinTech Dashboard)              */}
      {/* ============================================================== */}
      {viewMode === 'blocks' && (
        <>
          {/* TOP ROW: Total Balance Chart (Left) + My Cards / Active Facility (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Total Credit Exposure & Commitment Trend (8 cols) - matching fintechui.jpeg */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Credit Facility Audited</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white tracking-tight">
                  AED {auditResult ? '450,000.00' : '400,000.00'}
                </span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> CBUAE Verified
                </span>
              </div>
            </div>

            {/* Time Period Filter Pills (matching fintechui.jpeg) */}
            <div className="flex items-center gap-1 bg-[#0a0f1d] p-1 rounded-2xl border border-slate-800 text-xs">
              {(['1y', '6m', '3m', '1m'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    timePeriod === period
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {period === '1y' ? '1 year' : period === '6m' ? '6 month' : period === '3m' ? '3 month' : '1 month'}
                </button>
              ))}
            </div>
          </div>

          {/* Smooth Area Chart Visual (matching fintechui.jpeg with striped gradient) */}
          <div className="py-6 relative">
            
            {/* Tooltip Pill (matching reference image) */}
            <div className="absolute left-[36%] top-2 bg-white text-slate-950 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 z-10 border border-slate-200">
              <span className="text-[11px] font-semibold">21 Aug, 2024</span>
              <ArrowUpRight className="h-3 w-3 text-slate-600" />
              <span className="font-mono text-xs font-bold text-slate-900">8,780.90 AED</span>
            </div>

            {/* SVG Trend Graph with diagonal stripes and glowing green/cyan line */}
            <svg viewBox="0 0 700 200" className="w-full h-44 overflow-visible">
              <defs>
                <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="3" />
                </pattern>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="700" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="180" x2="700" y2="180" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Shaded Striped Area */}
              <polygon
                points="0,180 0,140 100,120 200,145 260,85 350,110 450,90 560,98 700,70 700,180"
                fill="url(#diagonalStripes)"
              />
              <polygon
                points="0,180 0,140 100,120 200,145 260,85 350,110 450,90 560,98 700,70 700,180"
                fill="url(#areaGradient)"
              />

              {/* Green / Cyan Glowing Line */}
              <path
                d="M 0,140 Q 50,130 100,120 T 200,145 T 260,85 T 350,110 T 450,90 T 560,98 T 700,70"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Highlight Pin Dot */}
              <circle cx="260" cy="85" r="6" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-2">
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Footer Metrics & Legend (matching fintechui.jpeg) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">
              6 month average commitment: <strong className="text-white font-mono">AED 8,000.00</strong>
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 bg-emerald-500/20 border border-emerald-500 rounded-sm" />
                Available borrowing capacity
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 bg-emerald-400 rounded-full" />
                Active debt commitment
              </span>
            </div>
          </div>
        </div>

        {/* My Cards / Active Loan Facility (5 cols) - matching fintechui.jpeg */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-sm font-bold text-white">My facilities</h2>
            <button
              onClick={() => setShowInputModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#131b2e] hover:bg-slate-800 text-xs font-semibold text-cyan-400 border border-slate-800 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add facility</span>
            </button>
          </div>

          {/* Visual Digital Card (matching fintechui.jpeg) */}
          <div className="relative mt-4 overflow-hidden rounded-3xl p-6 bg-gradient-to-tr from-[#1d4ed8] via-[#0284c7] to-[#06b6d4] text-white shadow-2xl min-h-[190px] flex flex-col justify-between border border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/90 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Active
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-6 w-6 rounded-full bg-rose-500 opacity-90 inline-block -mr-2" />
                <span className="h-6 w-6 rounded-full bg-amber-400 opacity-90 inline-block" />
              </div>
            </div>

            {/* Smart EMV Golden Chip */}
            <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-200 to-amber-400 border border-amber-500/50 my-2 opacity-95" />

            <div>
              <div className="text-[10px] uppercase font-semibold text-cyan-100 tracking-wider">
                Facility Principal Balance
              </div>
              <div className="text-2xl font-mono font-extrabold tracking-tight mt-0.5">
                {auditResult ? `AED ${auditResult.total_restitution_due_aed > 0 ? '400,000.00' : '850,000.00'}` : 'AED 450,000.00'}
              </div>
            </div>
          </div>

          {/* Secondary Locked / Inactive Facility Visual (matching fintechui.jpeg) */}
          <div className="mt-3 p-4 rounded-2xl bg-[#0a0f1d]/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Residential Mortgage Line</div>
                <div className="text-[10px] text-slate-400 font-mono">CBUAE 85% LTV Cap</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">AED 1.2M</span>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: Recent Checkpoints (5 cols) + Commitments/DBR (4 cols) + AI Card (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Recent Transactions / Audited Facility Checkpoints (5 cols) - matching fintechui.jpeg */}
        <div className="md:col-span-12 lg:col-span-5 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-sm font-bold text-white">Audited Checkpoints</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="cursor-pointer hover:text-white">Sort ↑↓</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#0a0f1d] border border-slate-800 text-[11px]">
                Active ⌄
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {auditResult && auditResult.compliance_findings && auditResult.compliance_findings.length > 0 ? (
              auditResult.compliance_findings.slice(0, 4).map((f, i) => {
                const isViolation = f.status === 'VIOLATION';
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[#0a0f1d]/60 border border-slate-800/60 hover:bg-[#0a0f1d] transition-all">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isViolation
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isViolation ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white line-clamp-1">{f.checkpoint_name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{f.legal_citation}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isViolation ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {isViolation ? 'Violation' : 'Compliant'}
                      </span>
                      {f.excess_financial_impact_aed > 0 && (
                        <div className="text-[11px] font-mono font-bold text-amber-400 mt-0.5">
                          +AED {f.excess_financial_impact_aed.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs text-slate-400 py-8">
                Click "Audit Loan Facility" above to populate live findings.
              </div>
            )}
          </div>
        </div>

        {/* Categories / CBUAE Debt Burden Breakdown (4 cols) - matching fintechui.jpeg */}
        <div className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-sm font-bold text-white">CBUAE DBR Breakdown</h2>
              <button
                onClick={() => setShowInputModal(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="mt-4">
              <div className="text-[11px] text-slate-400 font-medium">Monthly Debt Commitments</div>
              <div className="text-2xl font-mono font-extrabold text-white mt-0.5">
                AED 8,450.00 <span className="text-xs font-normal text-slate-400">/ 33.8% DBR</span>
              </div>
            </div>

            {/* Segmented multi-color progress bar (matching fintechui.jpeg) */}
            <div className="flex h-2.5 w-full rounded-full overflow-hidden mt-4 gap-1">
              <div className="w-[50%] bg-cyan-400 rounded-l-full" title="Personal Loan EMI" />
              <div className="w-[30%] bg-emerald-400" title="Auto Loan EMI" />
              <div className="w-[20%] bg-amber-400 rounded-r-full" title="Credit Card 5%" />
            </div>

            {/* Commitments List with colored dots (matching fintechui.jpeg) */}
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0a0f1d]/40">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">Personal Loan Installment</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-semibold text-white">
                  <span>AED 4,500.00</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0a0f1d]/40">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">Auto Vehicle Loan EMI</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-semibold text-white">
                  <span>AED 2,200.00</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0a0f1d]/40">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-slate-300">Credit Card 5% Imputed Limit</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-semibold text-white">
                  <span>AED 1,750.00</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
            Notice 2011/23 Art 2: 50% max DBR cap (Safe limit 40%)
          </div>
        </div>

        {/* Revolutionize Your Banking with AI (3 cols) - matching fintechui.jpeg with cosmic sphere */}
        <div className="md:col-span-6 lg:col-span-3 rounded-3xl bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#080d19] border border-cyan-500/20 p-6 flex flex-col items-center text-center justify-between shadow-2xl relative overflow-hidden group">
          
          {/* Subtle cosmic background glow */}
          <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Glowing Iridescent Orb / Sphere (matching fintechui.jpeg) */}
          <div className="relative my-2">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-emerald-500 p-1 shadow-lg shadow-cyan-500/40 animate-pulse-subtle">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-500/80 via-blue-600 to-teal-400 opacity-90 blur-[1px]" />
                <Sparkles className="h-7 w-7 text-white relative z-10" />
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="space-y-2 mt-2">
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Revolutionize Your Banking with AI
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-[210px] mx-auto">
              Leverage the power of AI to audit credit facilities and safeguard statutory borrower rights.
            </p>
          </div>

          {/* White Pill Button (matching fintechui.jpeg) */}
          <button
            onClick={() => setShowInputModal(true)}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Audit New Facility
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* BENCHMARK LOAN CASE STUDIES & STRESS TESTS DOCK                */}
      {/* ============================================================== */}
      <div id="benchmarks-dock" className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CBUAE Stress-Test Benchmarks
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-World Facility Case Studies</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Select an Institutional Loan Case Study to Audit
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any scenario to populate contract text & run autonomous compliance audit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            const isOvercharge = sc.expected_restitution_aed > 0;
            return (
              <div
                key={sc.id}
                onClick={() => handleSelectPreset(sc)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'bg-[#0f172a]/70 border-slate-800/90 hover:border-slate-700 hover:bg-[#0f172a]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0a0f1d] border border-slate-800 text-slate-300">
                      {sc.loan_type}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isOvercharge ? 'bg-rose-400' : sc.severity.includes('COMPLIANT') ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{sc.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{sc.summary}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-400">
                    {sc.expected_restitution_aed > 0
                      ? `+AED ${sc.expected_restitution_aed.toLocaleString()} Refund`
                      : 'Compliant (AED 0)'}
                  </span>
                  <button
                    type="button"
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-[#131b2e] text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {isSelected ? 'Audited ✓' : 'Audit →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ENTERPRISE INSIGHTS & OPERATIONS SUITE (Demonstrates FinTech Capabilities) */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Institutional Operations Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">UAE Banking Surveillance & Grievance Tracking</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Active Banking Portfolio & Sanadak Dispute Insights
            </h2>
          </div>
          
          <div className="text-xs text-slate-400">
            Portfolio Health: <strong className="text-emerald-400 font-mono">94.2% Compliant</strong>
          </div>
        </div>

        {/* 4 Key Portfolio Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 space-y-1">
            <span className="text-[11px] font-medium text-slate-400">Total Unlawful Overcharges Detected</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
              AED 18,300.00
            </div>
            <p className="text-[10px] text-slate-500">Across 3 commercial facilities</p>
          </div>

          <div className="p-4 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 space-y-1">
            <span className="text-[11px] font-medium text-slate-400">Restitution Recovered to Date</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
              AED 14,050.00
            </div>
            <p className="text-[10px] text-slate-500">Credited to borrower accounts</p>
          </div>

          <div className="p-4 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 space-y-1">
            <span className="text-[11px] font-medium text-slate-400">Active Facilities Monitored</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
              3 Banking Lines
            </div>
            <p className="text-[10px] text-slate-500">Personal, Mortgage & Auto</p>
          </div>

          <div className="p-4 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 space-y-1">
            <span className="text-[11px] font-medium text-slate-400">Corporate Debt Burden Ratio</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-400">
              33.8% DBR
            </div>
            <p className="text-[10px] text-slate-500">Notice 2011/23 Safe Range (&lt;40%)</p>
          </div>
        </div>

        {/* Two Column Grid: Sanadak Grievance Pipeline (Left) + UAE Bank Compliance Index (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sanadak Dispute Tracking Pipeline (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">CBUAE Sanadak Dispute Escalation Pipeline</h3>
                <p className="text-[11px] text-slate-400">Formal consumer ombudsman complaint and refund tracking</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                2 Active Filings
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#0a0f1d]/70 border border-slate-800/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">#SND-2024-9182</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Restitution Mandate Issued
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Apex Gulf Finance — Unlawful 3% Prepayment Exit Penalty</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Circular 8/2020 Art 4.3 • Filed 12 Sep 2024</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Award Amount</span>
                  <div className="font-mono font-bold text-sm text-emerald-400">AED 12,000.00</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0a0f1d]/70 border border-slate-800/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">#SND-2024-8441</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Refund Credited
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">First Retail Credit — Excess Origination Processing Fee</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Circular 8/2020 Art 4.2 • Filed 28 Aug 2024</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Refund Credited</span>
                  <div className="font-mono font-bold text-sm text-cyan-400">AED 2,050.00</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0a0f1d]/70 border border-slate-800/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">#SND-2024-7729</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Under Sanadak Mediation
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Falcon Auto Credit — 72-Month Statutory Tenure Breach</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Notice 2011/23 Art 5.1 • Filed 04 Oct 2024</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Claim Amount</span>
                  <div className="font-mono font-bold text-sm text-amber-400">AED 4,250.00</div>
                </div>
              </div>
            </div>
          </div>

          {/* UAE Bank Lending Compliance Index (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <h3 className="text-sm font-bold text-white">UAE Bank Compliance Index</h3>
                <span className="text-[11px] text-slate-400">CBUAE Benchmark</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0a0f1d]/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-800">
                      FAB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">First Abu Dhabi Bank</div>
                      <div className="text-[10px] text-slate-400">Tier-1 Institutional Lender</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">98 / 100</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0a0f1d]/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-800">
                      ENBD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Emirates NBD</div>
                      <div className="text-[10px] text-slate-400">Tier-1 Retail & Corporate</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">96 / 100</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0a0f1d]/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-800">
                      FAC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Falcon Auto Credit</div>
                      <div className="text-[10px] text-amber-400">Subprime Vehicle Credit</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-amber-400">64 / 100</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0a0f1d]/60">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-800">
                      AGF
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Apex Gulf Finance</div>
                      <div className="text-[10px] text-rose-400">Critical Fee Breaches</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-rose-400">42 / 100</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
              Scored autonomously against CBUAE Circular 8/2020 & Consumer Standards
            </div>
          </div>

        </div>

      </div>
    </>
  )}

      {/* ============================================================== */}
      {/* 2. LIST VIEW (Structured Vertical Facility Feed)               */}
      {/* ============================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* List Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a]/70 p-4 rounded-3xl border border-slate-800/90 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Filter Facilities:</span>
              {(['all', 'personal', 'mortgage', 'auto'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setListCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                    listCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-[#131b2e] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Facilities' : cat}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredFacilities.length}</strong> audited banking lines
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-3">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="p-5 rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-center font-extrabold text-xs text-cyan-400 shrink-0 shadow-inner">
                    {fac.bankBadge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{fac.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {fac.loanType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">{fac.summary}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-2">
                      <span>Principal: <strong className="text-white">AED {fac.principalAed.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Tenure: <strong className="text-white">{fac.tenureMonths} Mo</strong></span>
                      <span>•</span>
                      <span>EMI: <strong className="text-white">AED {fac.emiAed.toLocaleString()}/mo</strong></span>
                      {fac.dbrPercent > 0 && (
                        <>
                          <span>•</span>
                          <span>DBR: <strong className="text-cyan-400">{fac.dbrPercent}%</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60">
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        fac.isCompliant
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {fac.statusLabel}
                    </span>
                    {fac.restitutionAed > 0 && (
                      <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                        +AED {fac.restitutionAed.toLocaleString()} Restitution Due
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleAuditFromFacility(fac)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Audit Facility
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TABLE VIEW (Comprehensive Institutional Financial Table)     */}
      {/* ============================================================== */}
      {viewMode === 'table' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a]/70 p-4 rounded-3xl border border-slate-800/90 shadow-lg">
            <div className="flex items-center gap-2 w-full sm:w-80">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  placeholder="Filter by bank, agreement, status..."
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Exposure: <strong className="text-white font-mono">AED 2,850,000.00</strong></span>
              <span>•</span>
              <span>Overcharges: <strong className="text-amber-400 font-mono">AED 18,300.00</strong></span>
            </div>
          </div>

          {/* Responsive Data Table */}
          <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0f1d] border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  <tr>
                    <th className="py-4 px-5">Facility Agreement</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4 font-mono">Principal (AED)</th>
                    <th className="py-4 px-4">Tenure</th>
                    <th className="py-4 px-4 font-mono">Monthly EMI</th>
                    <th className="py-4 px-4">Compliance Status</th>
                    <th className="py-4 px-4 font-mono">Restitution</th>
                    <th className="py-4 px-4">Governing Authority</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tableRows.map((row) => (
                    <tr key={row.id} className="hover:bg-[#131b2e]/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-xs">{row.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{row.bankName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {row.loanType}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-semibold text-white">
                        AED {row.principalAed.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {row.tenureMonths} Mos
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300">
                        AED {row.emiAed.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            row.isCompliant
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {row.statusLabel}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        {row.restitutionAed > 0 ? `+AED ${row.restitutionAed.toLocaleString()}` : 'AED 0.00'}
                      </td>
                      <td className="py-4 px-4 text-[10px] text-slate-400 font-mono">
                        {row.authority}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleAuditFromFacility(row)}
                          className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Summary Footer */}
            <div className="py-3 px-5 bg-[#0a0f1d] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span>Showing {tableRows.length} facilities monitored under CBUAE banking regulations</span>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span>Total Monitored: <strong className="text-white">5 Facilities</strong></span>
                <span>Audit Accuracy: <strong className="text-emerald-400">100% Deterministic</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* HUMAN-FRIENDLY BORROWER AUDIT MODAL (Replaces Technical Jargon) */}
      {/* ============================================================== */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white">Audit Credit Facility</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter everyday loan terms from your bank statement or upload your loan document.
                </p>
              </div>
              <button
                onClick={() => setShowInputModal(false)}
                className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Input Mode Switcher */}
            <div className="flex bg-[#0a0f1d] p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('simple')}
                className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  inputMode === 'simple' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Quick Statement Details
              </button>
              <button
                type="button"
                onClick={() => setInputMode('document')}
                className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  inputMode === 'document' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload / Paste Sanction Document
              </button>
            </div>

            {/* Form Mode 1: Friendly Borrower Fields */}
            {inputMode === 'simple' ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Lending Bank</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Emirates NBD, Apex Finance"
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Loan Type</label>
                    <select
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Personal Loan">Personal Loan (Max 48 Mo)</option>
                      <option value="Auto Loan">Auto Loan (Max 60 Mo)</option>
                      <option value="Residential Mortgage">Residential Mortgage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Original Loan Amount (AED)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Monthly Salary (AED)</label>
                    <input
                      type="number"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Loan Tenure (Months)</label>
                    <input
                      type="number"
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Early Exit Fee Quoted (AED)</label>
                    <input
                      type="number"
                      value={exitFeeCharged}
                      onChange={(e) => setExitFeeCharged(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAuditing}
                  onClick={handleCompileSimpleInput}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isAuditing ? 'Auditing Agreement...' : 'Verify Compliance & Calculate Overcharge'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Five Sample Sanction Documents Selector to Test & Validate Results */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      5 Sample Sanction Documents (Validate Different Results)
                    </span>
                    <span className="text-[10px] text-slate-400">Click any sample to load & test</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleSanctionDocuments.map((s) => {
                      const isSelected = selectedSampleId === s.id;
                      return (
                        <div
                          key={s.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelectSampleSanction(s.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                              : 'bg-[#0a0f1d] border-slate-800/80 hover:border-slate-700 hover:bg-[#0d1527]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-slate-400">{s.type}</span>
                              <span className={`px-1.5 py-0.2 rounded-full font-bold border text-[9px] ${s.badgeClass}`}>
                                {s.badge}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1">{s.title}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{s.description}</div>
                            <div className="text-[10px] text-cyan-300 font-mono font-medium pt-0.5">{s.expected}</div>
                          </div>
                          
                          {/* Sample Download Links (Word DOCX & PDF) */}
                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={s.docxUrl}
                                download={`${s.docName}.docx`}
                                className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="Download editable Word document"
                              >
                                <FileText className="h-2.5 w-2.5" /> Word (.docx)
                              </a>
                              <a
                                href={s.pdfUrl}
                                download={`${s.docName}.pdf`}
                                className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="Download print-ready PDF"
                              >
                                <Download className="h-2.5 w-2.5" /> PDF (.pdf)
                              </a>
                            </div>
                            <span className={`font-bold text-[10px] ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                              {isSelected ? 'Selected ✓' : 'Load →'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Local Downloads Folder Guidance Note */}
                <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">5 Sample Documents Ready in Your Downloads: </span>
                    All 5 test sanction files (.docx &amp; .pdf) are also pre-generated directly in your Windows Downloads folder (<code className="text-cyan-300 font-mono text-[10px]">C:\Users\999379\Downloads\</code>). You can drag and drop any file directly into the box below!
                  </div>
                </div>

                {/* 2. Drag & Drop or Browse Sanction Document Upload Dropzone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-cyan-400" />
                      Upload Your Bank Sanction Document
                    </span>
                    {uploadedFileName && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="h-3 w-3" /> Loaded: {uploadedFileName} {uploadedFileSize ? `(${uploadedFileSize})` : ''}
                      </span>
                    )}
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropFile}
                    onClick={() => !isUploadingDocument && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 text-center bg-[#0a0f1d]/60 hover:bg-[#0a0f1d] transition-all cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".txt,.pdf,.doc,.docx,.md,.json,.rtf"
                      className="hidden"
                    />
                    {isUploadingDocument ? (
                      <div className="py-2 flex flex-col items-center justify-center text-cyan-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyan-400 border-t-transparent mb-2" />
                        <span className="text-xs font-semibold">Extracting clauses &amp; parameters from document...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-500 group-hover:text-cyan-400 mx-auto mb-1.5 transition-colors" />
                        <div className="text-xs font-semibold text-white">
                          Drop sanction document here, or <span className="text-cyan-400 underline">browse</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Supports PDF (.pdf), Word (.docx, .doc), Text (.txt, .md), and RTF files
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Document Text Preview & Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Document Text Preview / Editor</span>
                    <span className="font-mono text-[10px]">{contractText.length} characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder="Sanction document text will appear here. You can also paste agreement terms directly..."
                    className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 resize-y"
                  />
                </div>

                {/* Run Audit Button */}
                <button
                  type="button"
                  disabled={isAuditing || !contractText.trim()}
                  onClick={() => {
                    setShowInputModal(false);
                    handleAudit(contractText, uploadedFileName ? `Sanction Document (${uploadedFileName})` : 'Sanction Agreement');
                  }}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isAuditing ? 'Scanning Document...' : 'Run CBUAE Compliance Audit on Sanction Document'}</span>
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
