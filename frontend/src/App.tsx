import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuditStudio } from './components/AuditStudio';
import { CalculatorsHub } from './components/CalculatorsHub';
import { AboutUsHub } from './components/AboutUsHub';
import { RAGLearningHub } from './components/RAGLearningHub';
import { AuthModal } from './components/AuthModal';

import { AIAuditAgent } from './components/AIAuditAgent';
import { fetchScenarios } from './services/api';
import type { ContractScenario } from './types';
import { ShieldCheck, Bell, Activity, ExternalLink } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scenarios, setScenarios] = useState<ContractScenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Theme State (Dark or Light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('regugraph_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('regugraph_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sidebar Expand / Collapse State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  // AI Audit Agent Floating Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [chatbotInitialQuery, setChatbotInitialQuery] = useState<string>('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // Initial load
  useEffect(() => {
    fetchScenarios()
      .catch(() => [])
      .then((scenariosData) => {
        setScenarios(scenariosData);
        setIsLoading(false);
      });
  }, []);

  // Global search triggers AI Audit Agent chatbot with user inquiry
  const handleGlobalSearch = (q: string) => {
    if (q.trim()) {
      setChatbotInitialQuery(q);
      setIsChatbotOpen(true);
    }
  };

  // Dedicated Home button handler
  const handleGoHome = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 flex font-sans selection:bg-cyan-500/20 selection:text-cyan-400 transition-colors">
      
      {/* Left Collapsible/Expandable Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Navbar with Home Button and Keyboard-Focused Search */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleGlobalSearch}
          onGoHome={handleGoHome}
          onOpenAbout={() => setActiveTab('about')}
          activeTab={activeTab}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode);
            setIsAuthOpen(true);
          }}
          onLogout={() => setCurrentUser(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
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
              {(activeTab === 'dashboard' || activeTab === 'codex') && (
                <AuditStudio scenarios={scenarios} onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'calculators' && <CalculatorsHub />}
              {activeTab === 'rag-learning' && <RAGLearningHub />}
              {activeTab === 'diagnostics' && (
                <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6 animate-in fade-in duration-200">
                  <div className="h-16 w-16 mx-auto rounded-3xl bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                      ISOLATED SERVICE: PORT 5174
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Diagnostics & Telemetry Portal
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                      Diagnostics and telemetry have been isolated to an independent administrative service on <strong>port 5174</strong> to keep the primary demonstration environment clean and high-performing.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="http://localhost:5174"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Open Diagnostics Portal (Port 5174)</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2e] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'about' && (
                <AboutUsHub
                  onNavigateTab={setActiveTab}
                  onOpenChatbot={() => setIsChatbotOpen(true)}
                />
              )}
            </>
          )}
        </main>


        {/* Minimal Institutional Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0a0f1d] py-6 px-6 sm:px-8 mt-auto transition-colors">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">ReguGraph</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
              <span className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Central Bank of the UAE Regulatory Intelligence & Credit Facility Audit Platform
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs select-none"
                title="All CBUAE regulatory circulars are up to date"
              >
                <Bell className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span>No notifications</span>
              </div>
              <button
                onClick={() => setActiveTab('about')}
                className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-xs font-medium"
              >
                About
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating AI Audit Agent Chatbot at Right Bottom */}
      <AIAuditAgent
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        initialQuery={chatbotInitialQuery}
      />

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
