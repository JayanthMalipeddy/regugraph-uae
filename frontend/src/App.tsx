import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuditStudio } from './components/AuditStudio';
import { CalculatorsHub } from './components/CalculatorsHub';
import { RegulatoryCodex } from './components/RegulatoryCodex';
import { DiagnosticsHub } from './components/DiagnosticsHub';
import { fetchHealth, fetchScenarios } from './services/api';
import type { HealthStatus, ContractScenario } from './types';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('audit');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [scenarios, setScenarios] = useState<ContractScenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync dark mode class on root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial load
  useEffect(() => {
    Promise.all([
      fetchHealth().catch(() => null),
      fetchScenarios().catch(() => [])
    ]).then(([healthData, scenariosData]) => {
      setHealth(healthData);
      setScenarios(scenariosData);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Top Institutional Header */}
      <Navbar
        health={health}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-mono">
              Connecting to ReguGraph-UAE Gateway (Port 8000)...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'audit' && <AuditStudio scenarios={scenarios} />}
            {activeTab === 'calculators' && <CalculatorsHub />}
            {activeTab === 'codex' && <RegulatoryCodex />}
            {activeTab === 'diagnostics' && <DiagnosticsHub health={health} />}
          </>
        )}
      </main>

      {/* Institutional FinTech Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-400">ReguGraph-UAE</span>
            <span>—</span>
            <span>Central Bank of the UAE (CBUAE) Regulatory Compliance Intelligence Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="font-mono text-slate-400">Circular 8/2020</span>
            <span className="font-mono text-slate-400">Notice 2011/23</span>
            <span className="font-mono text-slate-400">Notice 3877/2019</span>
            <span className="font-mono text-slate-400">Circular 31/2013</span>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-medium"
            >
              <span>Swagger REST API</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
