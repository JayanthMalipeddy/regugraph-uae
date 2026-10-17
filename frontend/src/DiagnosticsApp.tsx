import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  ArrowLeft,
  Sun,
  Moon,
  ExternalLink,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DiagnosticsHub } from './components/DiagnosticsHub';
import { fetchHealth } from './services/api';
import type { HealthStatus } from './types';

export const DiagnosticsApp: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('regugraph_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('regugraph_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await fetchHealth();
      setHealth(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch diagnostics health status:', err);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    loadHealth();
    // 5-minute auto-refresh interval
    const interval = setInterval(loadHealth, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800/80 px-6 sm:px-8 flex items-center justify-between bg-white/95 dark:bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-40 transition-colors shadow-sm">
        
        {/* Left: Branding & Isolated Badge */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-md shadow-cyan-600/20">
            <div className="h-full w-full bg-white dark:bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                ReguGraph<span className="text-cyan-600 dark:text-cyan-400">-UAE</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                PORT 5174
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Diagnostics, Telemetry & Evaluation Suite</span>
            </div>
          </div>
        </div>

        {/* Right: Cross-Link to Main Platform + Controls */}
        <div className="flex items-center gap-3">
          {/* Live Ping Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs">
            {health?.status === 'healthy' ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Backend Live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Connecting...</span>
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono">
              {lastUpdated}
            </span>
            <button
              onClick={loadHealth}
              disabled={isLoadingHealth}
              className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 ml-1 transition-colors cursor-pointer"
              title="Refresh telemetry"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2e] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Primary Link: Return to Main Demo on Port 5173 */}
          <a
            href="http://localhost:5173"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer whitespace-nowrap"
            title="Return to ReguGraph Main Demo on port 5173"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Main Demo (5173)</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Isolated Environment Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-50 via-teal-50/50 to-slate-50 dark:from-[#101b33] dark:via-[#0d162a] dark:to-[#080d19] border border-cyan-200 dark:border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Isolated Diagnostics & Telemetry Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                  Separated Service
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Dedicated environment running on port 5174 for technical auditing, vector database introspection, and automated regulatory stress tests.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <span>Open Main Website in New Tab</span>
              <ExternalLink className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Full Diagnostics Hub Component */}
        <DiagnosticsHub health={health} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0a0f1d] py-6 px-6 sm:px-8 mt-auto transition-colors">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">ReguGraph-UAE Diagnostics</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
            <span className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Isolated Telemetry & Benchmarking Environment · Port 5174
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:5173"
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold text-xs flex items-center gap-1"
            >
              <span>← ReguGraph Main Platform (Port 5173)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
