import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingDown,
  Scale,
  Sparkles,
  ArrowRight,
  FileText,
  Bot,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Briefcase,
  BookOpen,
  ArrowUpRight,
  Calculator,
  Search
} from 'lucide-react';

interface AboutUsHubProps {
  onNavigateTab: (tab: string) => void;
  onOpenChatbot: () => void;
}

export const AboutUsHub: React.FC<AboutUsHubProps> = ({
  onNavigateTab,
  onOpenChatbot
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'do' | 'offer' | 'use_cases'>('all');

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* 1. HERO VISION BANNER                                          */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 dark:from-[#0d162b] dark:via-[#09101f] dark:to-[#060a14] border border-slate-200 dark:border-cyan-500/20 p-8 sm:p-10 shadow-xl dark:shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>ReguGraph-UAE • Banking Regulatory Intelligence Solution</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Protecting UAE Borrowers & Safeguarding Institutional Banking Compliance
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            ReguGraph-UAE is an institutional-grade FinTech intelligence platform engineered to transform the complex regulatory directives of the{' '}
            <strong className="text-slate-900 dark:text-white">Central Bank of the United Arab Emirates (CBUAE)</strong> into deterministic, automated, and executable software controls. 
            We empower individual borrowers to detect unlawful bank fees, eliminate predatory loan clauses, and demand statutory restitution—while enabling licensed financial institutions to guarantee flawless regulatory compliance.
          </p>

          {/* Quick Pillar Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs shadow-md dark:shadow-xl transition-all cursor-pointer group"
            >
              <span>Launch Audit Studio</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigateTab('calculators')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#131b2e] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Calculator className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Explore Statutory Calculators</span>
            </button>
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800/50 text-cyan-800 dark:text-cyan-300 font-semibold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Bot className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Consult AI Audit Agent</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80 relative z-10">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0a0f1d]/70 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Regulatory Grounding</div>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">100% CBUAE Corpus</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Zero foreign hallucination</div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0a0f1d]/70 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Early Payoff Statutory Cap</div>
            <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">Max 1.0% or 10k AED</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Notice 3877/2019 Art 4.3</div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0a0f1d]/70 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Debt Burden Ratio (DBR)</div>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">50.0% Max Ceiling</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">30% for retirees/pensioners</div>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0a0f1d]/70 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Dispute Restitution</div>
            <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">Sanadak Escalation</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Official UAE Ombudsman</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SECTION FILTER PILLS                                        */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Solution Deep-Dive</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">— Comprehensive Platform Architecture</span>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-[#131b2e] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          {[
            { id: 'all', label: 'Overview' },
            { id: 'do', label: '1. What We Do' },
            { id: 'offer', label: '2. What We Offer' },
            { id: 'use_cases', label: '3. What Can Be Done' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. WHAT WE DO (Section 1)                                      */}
      {/* ============================================================== */}
      {(activeSection === 'all' || activeSection === 'do') && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
              01
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">What We Do</h2>
              <p className="text-xs text-slate-400">
                Transforming complex banking regulations into automated, actionable software intelligence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Capability 1 */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-3 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Autonomous Contract Auditing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We ingest facility sanction letters, retail personal loan agreements, mortgage contracts, and auto financing agreements to extract clauses, covenants, and fee schedules.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-cyan-400">
                NLP Clause Extraction
              </div>
            </div>

            {/* Capability 2 */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-3 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Unlawful Fee & Penalty Detection</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We benchmark contracts against binding CBUAE statutory fee limits, detecting hidden early repayment exit charges exceeding the 1.0% statutory cap, predatory tenure extensions, and unauthorized interest compounding.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-rose-400">
                Statutory Violation Gate
              </div>
            </div>

            {/* Capability 3 */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-3 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Mathematical Restitution Verification</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We calculate exact financial restitution down to the fil (AED) using deterministic financial arithmetic, proving illegal overcharges with mathematical certainty rather than guesswork.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-emerald-400">
                Deterministic Audit Engine
              </div>
            </div>

            {/* Capability 4 */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-3 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Sanadak Ombudsman Escalation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When banks fail to remediate overcharges voluntarily, our platform generates ready-to-file legal restitution demand letters and dispute filings formatted specifically for the UAE Financial Ombudsman (Sanadak).
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-amber-400">
                Restitution Demand Dossier
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. WHAT WE OFFER (Section 2)                                  */}
      {/* ============================================================== */}
      {(activeSection === 'all' || activeSection === 'offer') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
              02
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">What We Offer</h2>
              <p className="text-xs text-slate-400">
                An integrated suite of high-performance regulatory tools, RAG search engines, and deterministic calculators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Offer 1: Multi-Agent RAG Codex */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    ChromaDB Vector Store
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Grounded CBUAE Regulatory RAG Codex</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semantic and lexical hybrid search over 15 indexed CBUAE regulatory circulars, notices, and statutory fee gazettes. Equipped with autonomous refusal gates that reject foreign jurisdictions (FCA, Fed) to guarantee 100% UAE legal validity.
                </p>
                <div className="p-3 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px] font-medium">Indexed Legal Instruments:</div>
                  <div className="text-slate-300 font-mono text-[10px] space-y-0.5">
                    <div>• Notice No. 3877/2019 (1% Prepayment Fee Cap)</div>
                    <div>• Circular No. 8/2020 (Standardized Fee Schedule)</div>
                    <div>• Notice No. 2011/23 (50% DBR & 30% Pensioner Cap)</div>
                    <div>• Circular No. 31/2013 (Mortgage LTV Regulations)</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenChatbot}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-slate-800 text-cyan-400 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search Regulatory Codex</span>
              </button>
            </div>

            {/* Offer 2: Deterministic Calculators */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sliders className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Deterministic Math
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Statutory Financial Calculators Hub</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instant mathematical simulation engines that enforce statutory limits without subjective estimation:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800/80">
                    <span className="font-semibold text-white block">1% Early Settlement Cap Calculator:</span>
                    <span className="text-slate-400 text-[11px]">Enforces lower of 1.0% or AED 10,000 ceiling.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800/80">
                    <span className="font-semibold text-white block">50% Debt Burden Ratio (DBR) Engine:</span>
                    <span className="text-slate-400 text-[11px]">Stress-tests loan EMIs + 5% credit card commitments.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800/80">
                    <span className="font-semibold text-white block">Mortgage LTV Cap Simulator:</span>
                    <span className="text-slate-400 text-[11px]">Applies 85%/75% limits for UAE Nationals & 80%/70% for Expats.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('calculators')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Launch All Calculators</span>
              </button>
            </div>

            {/* Offer 3: AI Audit Agent Chatbot */}
            <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Bot className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Executive AI Agent
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">AI Audit Agent (Conversational Legal Consultant)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A high-intelligence regulatory conversationalist available 24/7 at the bottom-right corner. It answers statutory banking inquiries with clean typography, rendered formulas, official citations, and compliance callout cards.
                </p>
                <div className="p-3 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-slate-400 text-[11px] font-medium">Sample Queries It Solves:</div>
                  <div className="text-purple-300 text-[11px] italic">
                    "What is the statutory cap on early loan settlement?"
                  </div>
                  <div className="text-purple-300 text-[11px] italic">
                    "Does the 50% DBR include credit card limits?"
                  </div>
                  <div className="text-purple-300 text-[11px] italic">
                    "How do I file an overcharge complaint with Sanadak?"
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenChatbot}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-slate-800 text-purple-400 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Open AI Audit Agent</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. WHAT CAN BE DONE WITH US (Section 3)                       */}
      {/* ============================================================== */}
      {(activeSection === 'all' || activeSection === 'use_cases') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
              03
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">What Can Be Done With Us</h2>
              <p className="text-xs text-slate-400">
                Actionable real-world workflows tailored for retail borrowers, financial institutions, and legal advisors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Persona 1: Individual Retail Borrowers */}
            <div className="rounded-3xl bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#080d19] border border-cyan-500/20 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">For Individual Retail Borrowers</h3>
                    <span className="text-[10px] text-cyan-400 font-mono">UAE Nationals & Residents</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Audit Bank Sanction Letters:</strong> Scan facility contracts before signing to verify bank fees comply with statutory caps.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Reclaim Unlawful Payoff Penalties:</strong> If you paid more than 1% or AED 10,000 on an early payoff, generate a formal restitution demand letter immediately.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Verify Safe Borrowing Capacity:</strong> Check your exact DBR percentage and remaining borrowing headroom before applying for auto or mortgage loans.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Escalate to Sanadak with Proof:</strong> Download pre-formatted complaint packages backed by direct CBUAE article citations.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('dashboard')}
                className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Audit My Loan Facility
              </button>
            </div>

            {/* Persona 2: Licensed Financial Institutions */}
            <div className="rounded-3xl bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#080d19] border border-blue-500/20 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">For Licensed Banks & LFIs</h3>
                    <span className="text-[10px] text-blue-400 font-mono">Compliance & Risk Officers</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Pre-Launch Product Stress-Testing:</strong> Test new credit card fee schedules and personal loan terms against CBUAE regulations before marketing.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Avoid Mandatory Central Bank Write-Offs:</strong> Under Notice 2011/23 Art 7.2, loans breaching 50% DBR risk mandatory interest cancellation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Portfolio Overcharge Surveillance:</strong> Continuously monitor retail loan books to identify and remediate fee deviations before regulatory audits.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>REST API Automation:</strong> Integrate our deterministic endpoints into core banking workflows for automated loan approval validation.</span>
                  </div>
                </div>
              </div>

              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-slate-800 text-cyan-400 hover:text-white font-bold text-xs border border-slate-800 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Integrate Core Banking API</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Persona 3: Legal & Financial Advisors */}
            <div className="rounded-3xl bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#080d19] border border-amber-500/20 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">For Legal & Financial Advisors</h3>
                    <span className="text-[10px] text-amber-400 font-mono">Attorneys & Debt Restructuring</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Generate Certified Restitution Dossiers:</strong> Produce authoritative Markdown & PDF evidence packages complete with statutory citations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Accelerate Client Dispute Settlements:</strong> Force banks to settle by confronting them with indisputable statutory calculations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Jurisdiction Refusal Verification:</strong> Rapidly confirm whether a loan is governed by CBUAE, DIFC, ADGM, or foreign laws.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Debt Burden Restructuring:</strong> Simulate optimized debt consolidation plans to bring distressed borrowers back under the 50% DBR ceiling.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('dashboard')}
                className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-slate-800 text-amber-400 hover:text-white font-bold text-xs border border-slate-800 transition-all cursor-pointer"
              >
                Inspect Case Studies
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. FOUR-STEP HOW IT WORKS EXECUTION PIPELINE                   */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 p-8 space-y-6 shadow-xl">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            End-to-End Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
            How ReguGraph-UAE Executes an Audit
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            From raw loan documentation to formal ombudsman restitution in four automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-2 relative">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/20">
              1
            </div>
            <h3 className="text-xs font-bold text-white">Ingest Facility Contract</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Borrower inputs loan parameters (principal, EMI, exit fee, tenure) or pastes full legal sanction letter text.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-2 relative">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/20">
              2
            </div>
            <h3 className="text-xs font-bold text-white">Hybrid CBUAE Grounding</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LangGraph agents execute dense ChromaDB vector search + BM25 keyword matching to retrieve governing CBUAE circulars.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-2 relative">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/20">
              3
            </div>
            <h3 className="text-xs font-bold text-white">Deterministic Computation</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The engine evaluates 1% fee caps, 50% DBR limits, and tenure caps, calculating exact restitution in AED.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-2 relative">
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/20">
              4
            </div>
            <h3 className="text-xs font-bold text-white">Remediate & Escalate</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Borrower receives formal restitution demand letters and Sanadak ombudsman filing documents for instant recovery.
            </p>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. INSTITUTIONAL INTEGRITY GUARANTEE                           */}
      {/* ============================================================== */}
      <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Strict CBUAE Statutory Jurisdiction Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-0.5">
              ReguGraph-UAE operates exclusively within the regulatory framework established by the Central Bank of the United Arab Emirates. 
              Our architecture includes autonomous jurisdiction refusal gates to reject ungrounded offshore laws and safeguard legal validity.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer"
        >
          Start Facility Audit Now →
        </button>
      </div>

    </div>
  );
};

export default AboutUsHub;
