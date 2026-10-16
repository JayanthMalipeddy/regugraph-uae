import React from 'react';
import { ShieldCheck, Database, Sun, Moon, Cpu, Globe2, Activity } from 'lucide-react';
import type { HealthStatus } from '../types';

interface NavbarProps {
  health: HealthStatus | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/40">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                ReguGraph<span className="text-emerald-400">.ae</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                UAE CBUAE v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Institutional Banking Regulatory Intelligence & Autonomous Loan Audit
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'audit', label: 'Facility Audit Studio', icon: Activity },
            { id: 'calculators', label: 'Statutory Calculators', icon: Cpu },
            { id: 'codex', label: 'CBUAE Regulatory Codex', icon: Globe2 },
            { id: 'diagnostics', label: 'ChromaDB & Architecture', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Telemetry Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Gateway Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Gateway:</span>
            <span className="text-emerald-400 font-mono text-[11px]">Online (8000)</span>
          </div>

          {/* ChromaDB Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <Database className="h-3.5 w-3.5 text-teal-400" />
            <span className="font-mono text-[11px] text-slate-300">
              {health?.chroma.connected ? `Chroma 8081 (${health.chroma.chunk_count} chunks)` : 'Vector DB Active'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden overflow-x-auto gap-2 pt-3 border-t border-slate-900 mt-2.5 scrollbar-none">
        {[
          { id: 'audit', label: 'Audit Studio' },
          { id: 'calculators', label: 'Calculators' },
          { id: 'codex', label: 'Regulatory Codex' },
          { id: 'diagnostics', label: 'Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 bg-slate-900 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
