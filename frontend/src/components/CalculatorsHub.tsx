import React, { useState, useEffect } from 'react';
import {
  Percent,
  Building,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { calculateDBR, calculateEarlySettlement, calculateMortgageLTV } from '../services/api';
import type { DBRCalculationResponse, EarlySettlementResponse, MortgageLTVResponse } from '../types';

export const CalculatorsHub: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'dbr' | 'settlement' | 'mortgage'>('dbr');

  // --- DBR State ---
  const [salary, setSalary] = useState<number>(25000);
  const [personalEmi, setPersonalEmi] = useState<number>(4500);
  const [autoEmi, setAutoEmi] = useState<number>(2200);
  const [mortgageEmi, setMortgageEmi] = useState<number>(0);
  const [cardLimits, setCardLimits] = useState<number>(40000);
  const [otherDebt, setOtherDebt] = useState<number>(0);
  const [isPensioner, setIsPensioner] = useState<boolean>(false);
  const [dbrResult, setDbrResult] = useState<DBRCalculationResponse | null>(null);

  // --- Early Settlement State ---
  const [principal, setPrincipal] = useState<number>(450000);
  const [chargedFee, setChargedFee] = useState<number>(13500);
  const [bankName, setBankName] = useState<string>('Apex Commercial Bank');
  const [accountNo, setAccountNo] = useState<string>('AE-LN-2024-9912');
  const [settlementResult, setSettlementResult] = useState<EarlySettlementResponse | null>(null);

  // --- Mortgage LTV State ---
  const [propertyVal, setPropertyVal] = useState<number>(3500000);
  const [isUaeNational, setIsUaeNational] = useState<boolean>(true);
  const [isFirstHome, setIsFirstHome] = useState<boolean>(true);
  const [isOffPlan, setIsOffPlan] = useState<boolean>(false);
  const [mortgageResult, setMortgageResult] = useState<MortgageLTVResponse | null>(null);

  // Run DBR calculation whenever inputs change
  useEffect(() => {
    if (salary > 0) {
      calculateDBR({
        gross_salary: salary,
        personal_emi: personalEmi,
        auto_emi: autoEmi,
        mortgage_emi: mortgageEmi,
        credit_card_limits: cardLimits,
        other_debt_obligations: otherDebt,
        is_pensioner: isPensioner
      })
        .then(setDbrResult)
        .catch(console.error);
    }
  }, [salary, personalEmi, autoEmi, mortgageEmi, cardLimits, otherDebt, isPensioner]);

  // Run Early Settlement calculation whenever inputs change
  useEffect(() => {
    if (principal > 0 && chargedFee >= 0) {
      calculateEarlySettlement({
        outstanding_principal: principal,
        charged_fee_amount: chargedFee,
        bank_name: bankName,
        loan_account_no: accountNo
      })
        .then(setSettlementResult)
        .catch(console.error);
    }
  }, [principal, chargedFee, bankName, accountNo]);

  // Run Mortgage LTV calculation whenever inputs change
  useEffect(() => {
    if (propertyVal > 0) {
      calculateMortgageLTV({
        property_value: propertyVal,
        is_uae_national: isUaeNational,
        is_first_home: isFirstHome,
        is_off_plan: isOffPlan
      })
        .then(setMortgageResult)
        .catch(console.error);
    }
  }, [propertyVal, isUaeNational, isFirstHome, isOffPlan]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101728] via-[#0d1424] to-[#0a0f1d] p-6 sm:p-8 border border-slate-800/90 shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Statutory Financial Compliance Calculators
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Verify exact borrowing capacity, loan payoff statutory fee caps, and mortgage equity quotas
            under official Central Bank of the UAE regulations.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-800/80 space-x-2">
        {[
          { id: 'dbr', label: 'Debt Burden Ratio (DBR)', icon: Percent },
          { id: 'settlement', label: '1% Early Settlement Cap & Refund', icon: TrendingDown },
          { id: 'mortgage', label: 'Mortgage LTV & Downpayment', icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCalc(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. DBR CALCULATOR */}
      {/* ============================================================== */}
      {activeCalc === 'dbr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Input Controls (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="h-4 w-4 text-cyan-400" />
                Monthly Income & Financial Commitments
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Notice 2011/23 Art 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gross Salary */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Gross Monthly Salary (AED)</span>
                  <span className="text-cyan-400 font-mono font-bold">AED {salary.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={salary}
                  onChange={(e) => setSalary(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Personal Loan EMI */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Personal Loan EMI</span>
                  <span className="text-slate-400 font-mono">AED {personalEmi.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={personalEmi}
                  onChange={(e) => setPersonalEmi(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Auto Loan EMI */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Auto Loan EMI</span>
                  <span className="text-slate-400 font-mono">AED {autoEmi.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={autoEmi}
                  onChange={(e) => setAutoEmi(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Mortgage EMI */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Mortgage Loan EMI</span>
                  <span className="text-slate-400 font-mono">AED {mortgageEmi.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={mortgageEmi}
                  onChange={(e) => setMortgageEmi(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Total Credit Card Limits */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Credit Card Limits</span>
                  <span className="text-amber-400 font-mono">5% Rule = AED {(cardLimits * 0.05).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={cardLimits}
                  onChange={(e) => setCardLimits(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Other Debt */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Other Commitments</span>
                  <span className="text-slate-400 font-mono">AED {otherDebt.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={otherDebt}
                  onChange={(e) => setOtherDebt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Pensioner Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
                <div>
                  <div className="text-xs font-medium text-white">Retiree / Pensioner Cap</div>
                  <div className="text-[10px] text-slate-400">Statutory 30% cap vs 50% regular cap</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPensioner(!isPensioner)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isPensioner ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isPensioner ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* DBR Output & Gauge (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-white">CBUAE DBR Statutory Audit</h2>
                {dbrResult && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      dbrResult.is_compliant
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {dbrResult.is_compliant ? 'COMPLIANT' : 'OVER-LEVERAGED BREACH'}
                  </span>
                )}
              </div>

              {/* DBR Percentage & Bar */}
              {dbrResult && (
                <div className="mt-5 space-y-4">
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Current Debt Burden Ratio
                    </div>
                    <div
                      className={`text-5xl font-mono font-extrabold tracking-tight mt-1 ${
                        dbrResult.is_compliant ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {dbrResult.dbr_percent}%
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Statutory Cap: <strong className="text-white">{dbrResult.max_statutory_dbr_cap_percent}%</strong>
                    </div>
                  </div>

                  {/* Horizontal Gauge Bar */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-[#0a0f1d] rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          dbrResult.dbr_percent <= 40
                            ? 'bg-emerald-500'
                            : dbrResult.dbr_percent <= dbrResult.max_statutory_dbr_cap_percent
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, (dbrResult.dbr_percent / dbrResult.max_statutory_dbr_cap_percent) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0%</span>
                      <span>Safe (40%)</span>
                      <span className="text-amber-400">Cap ({dbrResult.max_statutory_dbr_cap_percent}%)</span>
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Monthly Debt Commitment:</span>
                      <span className="text-white font-mono font-bold">
                        AED {dbrResult.monthly_commitment_breakdown.total_monthly_commitment_aed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credit Card 5% Imputed Charge:</span>
                      <span className="text-amber-400 font-mono">
                        AED {dbrResult.monthly_commitment_breakdown.credit_card_5pct_commitment_aed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Borrowing Headroom:</span>
                      <span
                        className={`font-mono font-bold ${
                          dbrResult.headroom_aed >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        AED {dbrResult.headroom_aed.toLocaleString()}
                      </span>
                    </div>
                    {!dbrResult.is_compliant && (
                      <div className="flex justify-between">
                        <span className="text-rose-400">Statutory Violation Margin:</span>
                        <span className="text-rose-400 font-mono font-bold">
                          +{dbrResult.violation_margin_percent}% Over Cap
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800/90 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Statutory Rule:</strong> {dbrResult?.statutory_citation}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. EARLY SETTLEMENT OVERCHARGE CALCULATOR (CLEAN FINTECH - NO RAW DEMAND LETTER) */}
      {/* ============================================================== */}
      {activeCalc === 'settlement' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Inputs (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-amber-400" />
                Loan Early Payoff Balance & Fee Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates prepayment exit fees against CBUAE Notice 3877/2019 & Circular 8/2020 Art 4.3.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Outstanding Loan Principal at Payoff (AED)</label>
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Early Settlement Fee Charged by Bank (AED)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={chargedFee}
                  onChange={(e) => setChargedFee(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Lending Institution</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Loan Account Reference #</label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clean Financial Restitution Output (6 cols - NO DEMAND LETTER) */}
          <div className="lg:col-span-6 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Statutory Fee Analysis & Refund Determination
                </h2>
                {settlementResult && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      settlementResult.is_compliant
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {settlementResult.is_compliant ? 'COMPLIANT FEE' : 'UNLAWFUL OVERCHARGE'}
                  </span>
                )}
              </div>

              {settlementResult && (
                <div className="mt-5 space-y-4">
                  
                  {/* Restitution Due Hero Card */}
                  <div
                    className={`p-5 rounded-2xl border ${
                      settlementResult.is_compliant
                        ? 'bg-emerald-950/20 border-emerald-900/40'
                        : 'bg-rose-950/20 border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        {settlementResult.is_compliant ? 'Fee Complies with CBUAE Cap' : 'Customer Restitution Refund Due'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Notice 3877/2019</span>
                    </div>
                    <div className="text-3xl font-mono font-extrabold text-amber-400 mt-2">
                      AED {settlementResult.refund_due_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {settlementResult.is_compliant
                        ? 'The fee debited by the bank is within the statutory ceiling.'
                        : 'Unlawful excess fee debited above statutory cap of lower of 1% or AED 10,000.'}
                    </p>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Total Outstanding Principal:</span>
                      <span className="text-white font-mono font-bold">AED {settlementResult.outstanding_principal_aed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Exit Fee Debited by Bank:</span>
                      <span className="text-rose-400 font-mono font-bold">AED {settlementResult.charged_fee_amount_aed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">CBUAE Maximum Statutory Cap:</span>
                      <span className="text-emerald-400 font-mono font-bold">AED {settlementResult.statutory_cap_amount_aed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Net Refund Due:</span>
                      <span className="text-amber-400 font-mono font-extrabold text-sm">AED {settlementResult.refund_due_aed.toLocaleString()}</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800/90 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Governing Standard:</strong> {settlementResult?.rule_cited}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MORTGAGE LTV CALCULATOR */}
      {/* ============================================================== */}
      {activeCalc === 'mortgage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 space-y-5">
            <div className="border-b border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-400" />
                Residential Mortgage Property Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                CBUAE Circular 31/2013 (Mortgage Regulations LTV caps & equity quotas).
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>Property Purchase Valuation (AED)</span>
                  <span className="text-cyan-400 font-mono font-bold">AED {propertyVal.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="200000"
                  step="100000"
                  value={propertyVal}
                  onChange={(e) => setPropertyVal(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Citizenship / Residency Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Borrower Citizenship</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUaeNational(true)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isUaeNational
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-[#0a0f1d] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      UAE National
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUaeNational(false)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        !isUaeNational
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-[#0a0f1d] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Expatriate
                    </button>
                  </div>
                </div>

                {/* Home Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Property Occupancy</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFirstHome(true)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isFirstHome
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-[#0a0f1d] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      First Home
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFirstHome(false)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        !isFirstHome
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-[#0a0f1d] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Second / Invest
                    </button>
                  </div>
                </div>

              </div>

              {/* Off-plan checkbox */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
                <div>
                  <div className="text-xs font-medium text-white">Under-Construction / Off-Plan Unit</div>
                  <div className="text-[10px] text-slate-400">Subject to statutory 50% LTV cap across all categories</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOffPlan(!isOffPlan)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isOffPlan ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isOffPlan ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* Mortgage Output (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0f172a]/60 border border-slate-800/90 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-white">Mortgage Financing Ceiling</h2>
                {mortgageResult && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Max LTV: {mortgageResult.max_ltv_percent}%
                  </span>
                )}
              </div>

              {mortgageResult && (
                <div className="mt-5 space-y-4">
                  
                  {/* Maximum Bank Financing */}
                  <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">
                      Maximum Allowable Bank Loan
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                      AED {mortgageResult.max_financing_amount_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {mortgageResult.max_ltv_percent}% of property purchase valuation
                    </div>
                  </div>

                  {/* Minimum Required Downpayment */}
                  <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">
                      Minimum Required Borrower Equity (Downpayment)
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
                      AED {mortgageResult.minimum_downpayment_aed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {100 - mortgageResult.max_ltv_percent}% cash downpayment mandatory
                    </div>
                  </div>

                  {/* Tenure Cap */}
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Maximum Statutory Tenure:</span>
                    <span className="text-white font-mono font-bold">25 Years (300 Months)</span>
                  </div>

                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800/90 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Statutory Standard:</strong> {mortgageResult?.regulatory_rule}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
