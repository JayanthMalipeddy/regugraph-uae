import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuditStudio } from './components/AuditStudio';
import { CalculatorsHub } from './components/CalculatorsHub';
import { RegulatoryCodex } from './components/RegulatoryCodex';
import { DiagnosticsHub } from './components/DiagnosticsHub';
import { AuthModal } from './components/AuthModal';
import { fetchHealth, fetchScenarios } from './services/api';
import type { HealthStatus, ContractScenario } from './types';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [scenarios, setScenarios] = useState<ContractScenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

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

  const handleGlobalSearch = (q: string) => {
    if (q.trim()) {
      setActiveTab('codex');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans selection:bg-cyan-500/20 selection:text-cyan-400">
      
      {/* Left Slim Sidebar (matching fintechui.jpeg) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Navbar (matching fintechui.jpeg with search shortcut and user profile) */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleGlobalSearch}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode);
            setIsAuthOpen(true);
          }}
          onLogout={() => setCurrentUser(null)}
        />

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1400px] w-full mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-36 space-y-4">
              <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-mono">
                Connecting to ReguGraph-UAE Engine...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <AuditStudio scenarios={scenarios} />}
              {activeTab === 'calculators' && <CalculatorsHub />}
              {activeTab === 'codex' && <RegulatoryCodex />}
              {activeTab === 'diagnostics' && <DiagnosticsHub health={health} />}
            </>
          )}
        </main>

        {/* Minimal Institutional Footer */}
        <footer className="border-t border-slate-800/60 bg-[#0a0f1d] py-6 px-6 sm:px-8 mt-auto">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold text-slate-300">ReguGraph.ae</span>
              <span>—</span>
              <span>Central Bank of the United Arab Emirates (CBUAE) Regulatory Compliance Engine</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono text-slate-400">Notice 2011/23 (DBR)</span>
              <span className="font-mono text-slate-400">Notice 3877/2019 (1% Cap)</span>
              <span className="font-mono text-slate-400">Circular 31/2013 (Mortgage)</span>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono font-medium"
              >
                <span>REST API Specs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </footer>

      </div>

      {/* Institutional Enterprise Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
        initialMode={authInitialMode}
      />

    </div>
  );
}

export default App;
