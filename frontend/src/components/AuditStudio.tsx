import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  Play,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ContractScenario, AuditResponse } from '../types';
import { auditContract, exportAuditReport } from '../services/api';

interface AuditStudioProps {
  scenarios: ContractScenario[];
}

export const AuditStudio: React.FC<AuditStudioProps> = ({ scenarios }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [contractText, setContractText] = useState<string>('');
  const [contractTitle, setContractTitle] = useState<string>('Commercial Credit Facility');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  // Initialize with Scenario 1 by default
  useEffect(() => {
    if (scenarios.length > 0 && !contractText) {
      const s1 = scenarios[0];
      setSelectedScenarioId(s1.id);
      setContractTitle(s1.title);
      setContractText(s1.contract_text);
    }
  }, [scenarios]);

  const handleSelectScenario = (sc: ContractScenario) => {
    setSelectedScenarioId(sc.id);
    setContractTitle(sc.title);
    setContractText(sc.contract_text);
    setAuditResult(null);
    setErrorMsg('');
  };

  const handleRunAudit = async () => {
    if (!contractText.trim()) {
      setErrorMsg('Please enter or select a credit agreement to audit.');
      return;
    }

    setIsAuditing(true);
    setErrorMsg('');
    try {
      const result = await auditContract(contractText, contractTitle);
      setAuditResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Audit execution failed. Please verify FastAPI backend.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDownloadDossier = async () => {
    try {
      const { report_markdown, title } = await exportAuditReport(contractText, contractTitle);
      const blob = new Blob([report_markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_CBUAE_Audit_Dossier.md`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting dossier: ' + err);
    }
  };

  const handleCopySummary = () => {
    if (!auditResult) return;
    const text = `CBUAE Compliance Audit: ${auditResult.contract_title}\nStatus: ${auditResult.overall_status}\nTotal Restitution Due: AED ${auditResult.total_restitution_due_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}\nViolations: ${auditResult.total_violations}`;
    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Autonomous Multi-Agent LangGraph Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Credit Facility Audit Studio
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Upload or inspect credit agreements against mandatory Central Bank of the UAE (CBUAE) regulatory thresholds.
            Detect statutory violations, quantify borrower overcharges in AED, and extract legally enforceable remediation.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Scenario Presets Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pre-Configured Real-World Test Facilities
          </label>
          <span className="text-xs text-slate-500">Select any facility to load contract clauses</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            const isPredatory = sc.severity.includes('NON_COMPLIANT');
            const isCompliant = sc.severity.includes('COMPLIANT');
            const isRefusal = sc.severity.includes('REFUSAL');

            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {sc.loan_type}
                    </span>
                    {isPredatory && (
                      <span className="flex h-2 w-2 rounded-full bg-rose-500" title="Non-Compliant Infractions" />
                    )}
                    {isCompliant && (
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Fully Compliant" />
                    )}
                    {isRefusal && (
                      <span className="flex h-2 w-2 rounded-full bg-amber-500" title="Refusal Gate" />
                    )}
                  </div>
                  <h2 className="text-xs font-semibold text-white line-clamp-1">{sc.title}</h2>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {sc.summary}
                  </p>
                </div>
                {sc.expected_restitution_aed > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Restitution Target:</span>
                    <span className="font-mono font-bold text-amber-400">
                      AED {sc.expected_restitution_aed.toLocaleString()}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contract Editor & Action Trigger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <input
              type="text"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              className="text-base font-bold bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 px-2 py-1 rounded border border-transparent hover:border-slate-700 w-full sm:w-96"
              placeholder="Agreement Title..."
            />
            <p className="text-xs text-slate-400 px-2">
              Review contractual clauses, fee schedules, settlement terms, and tenure covenants.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 disabled:opacity-50 transition-all cursor-pointer w-full sm:w-auto"
            >
              {isAuditing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Auditing Facility...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Audit Facility against CBUAE Standards</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={10}
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
            placeholder="Paste credit facility agreement or loan contract terms here..."
          />
          <div className="absolute right-3 bottom-4 text-[10px] text-slate-500 font-mono">
            {contractText.length.toLocaleString()} characters | {contractText.split('\n').length} lines
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Audit Results View */}
      {auditResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Executive Status Banner */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              auditResult.refusal_triggered
                ? 'bg-amber-500/10 border-amber-500/30'
                : auditResult.overall_status === 'FULLY_COMPLIANT'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {auditResult.refusal_triggered ? (
                    <AlertOctagon className="h-8 w-8 text-amber-400" />
                  ) : auditResult.overall_status === 'FULLY_COMPLIANT' ? (
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="h-8 w-8 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        auditResult.refusal_triggered
                          ? 'bg-amber-500/20 text-amber-300'
                          : auditResult.overall_status === 'FULLY_COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {auditResult.refusal_triggered
                        ? 'Autonomous Refusal Gate Triggered'
                        : auditResult.overall_status === 'FULLY_COMPLIANT'
                        ? 'Regulatory Assessment: Fully Compliant'
                        : 'Statutory Violations & Overcharges Detected'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {auditResult.latency_ms} ms
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {auditResult.contract_title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {auditResult.refusal_triggered
                      ? auditResult.refusal_reason
                      : auditResult.executive_summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedDossier ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedDossier ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadDossier}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Dossier (.MD)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metric Cards */}
          {!auditResult.refusal_triggered && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Financial Restitution Due */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Borrower Restitution Due</span>
                  <TrendingDown className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
                  AED {auditResult.total_restitution_due_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Statutory refund due under CBUAE Circular 8/2020
                </p>
              </div>

              {/* Total Violations */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Statutory Breaches</span>
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-rose-400">
                  {auditResult.total_violations}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Non-compliant contractual provisions
                </p>
              </div>

              {/* Compliant Checkpoints */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Compliant Clauses</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
                  {auditResult.total_compliant_checkpoints}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Satisfies CBUAE retail lending standards
                </p>
              </div>

              {/* Mathematical Verifications */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Math Integrity</span>
                  <Scale className="h-4 w-4 text-teal-400" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-teal-400">
                  100% Deterministic
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Zero LLM arithmetic hallucination
                </p>
              </div>
            </div>
          )}

          {/* Side-by-Side Detailed Findings Redlines */}
          {auditResult.compliance_findings && auditResult.compliance_findings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-emerald-400" />
                  Statutory Redline Assessment & Legal Citations
                </h2>
                <span className="text-xs text-slate-500">
                  {auditResult.compliance_findings.length} Checkpoints Audited
                </span>
              </div>

              <div className="space-y-3">
                {auditResult.compliance_findings.map((f, idx) => {
                  const isViolation = f.status === 'VIOLATION';
                  const isCompliant = f.status === 'COMPLIANT';

                  return (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isViolation
                          ? 'bg-rose-950/20 border-rose-900/50'
                          : isCompliant
                          ? 'bg-slate-900/40 border-slate-800'
                          : 'bg-amber-950/20 border-amber-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isViolation
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : isCompliant
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {f.status}
                            </span>
                            <h3 className="text-sm font-bold text-white">
                              {f.checkpoint_name}
                            </h3>
                          </div>
                        </div>

                        {f.excess_financial_impact_aed > 0 && (
                          <div className="text-right shrink-0">
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Overcharge Refund</div>
                            <div className="font-mono font-bold text-sm text-amber-400">
                              +AED {f.excess_financial_impact_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Side by side comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                        {/* Contract clause */}
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/60">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Contractual Provision (As Drafted)
                          </div>
                          <p className={`font-mono text-xs leading-relaxed ${isViolation ? 'text-rose-300' : 'text-slate-300'}`}>
                            "{f.contract_provision}"
                          </p>
                        </div>

                        {/* Statutory rule */}
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/60">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            <span>Central Bank Statutory Standard</span>
                            <span className="text-emerald-400 font-mono">{f.legal_citation}</span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {f.statutory_rule}
                          </p>
                        </div>
                      </div>

                      {/* Explanation & Remediation */}
                      <div className="mt-3 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                        <p>
                          <strong className="text-slate-300">Legal Assessment:</strong> {f.explanation}
                        </p>
                        {f.required_remediation && (
                          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-xs flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            <span><strong className="text-white">Remediation Order:</strong> {f.required_remediation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Plan */}
          {auditResult.action_plan && auditResult.action_plan.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Mandatory Regulatory Remediation Plan
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                {auditResult.action_plan.map((item, i) => (
                  <li key={i} className="pl-1">
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Multi-Agent Trace Accordion */}
          {auditResult.execution_trace && auditResult.execution_trace.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <button
                onClick={() => setShowTrace(!showTrace)}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-400" />
                  <span>LangGraph Agentic Execution Graph & Node Transitions ({auditResult.execution_trace.length} Steps)</span>
                </div>
                {showTrace ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showTrace && (
                <div className="p-4 pt-0 border-t border-slate-800/80 space-y-2">
                  {auditResult.execution_trace.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                      <div className="h-5 w-5 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 font-mono text-[11px]">{step.node}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
