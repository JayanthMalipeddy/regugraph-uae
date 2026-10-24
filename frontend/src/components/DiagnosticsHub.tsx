import React, { useState, useEffect } from 'react';
import {
  Database,
  ExternalLink,
  Cpu,
  CheckCircle2,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Terminal,
  Server,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
  Clock,
  FileCheck,
  Trophy,
  Zap,
  Award,
  ArrowUpDown
} from 'lucide-react';
import type { HealthStatus } from '../types';
import {
  fetchLatestEvaluation,
  fetchEvaluationHistory,
  runLiveEvaluation,
  fetchDiagnosticsPing,
  type DiagnosticsPingResponse
} from '../services/api';

interface DiagnosticsHubProps {
  health: HealthStatus | null;
}

const metric = (value: number | null | undefined, suffix = '%') =>
  value == null ? 'N/A' : `${value.toFixed(1)}${suffix}`;

export const DiagnosticsHub: React.FC<DiagnosticsHubProps> = ({ health }) => {
  const [evalData, setEvalData] = useState<any>(null);
  const [evalHistory, setEvalHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunningEvals, setIsRunningEvals] = useState<boolean>(false);
  const [benchmarkFilter, setBenchmarkFilter] = useState<'all' | 'in_scope' | 'refusal'>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const [ragSortBy, setRagSortBy] = useState<'default' | 'speed' | 'score'>('default');

  // Real-time ping state for 3 infrastructure components (ChromaDB, Chroma UI, LangGraph)
  const [pingData, setPingData] = useState<DiagnosticsPingResponse | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number>(300); // 5 minutes default

  const loadPingData = async () => {
    setIsPinging(true);
    try {
      const data = await fetchDiagnosticsPing();
      setPingData(data);
      setSecondsUntilRefresh(data.default_refresh_seconds || 300);
    } catch (err) {
      console.error('Error fetching real-time diagnostics ping:', err);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    loadPingData();
  }, []);

  // 1-second countdown timer for the 5-minute auto-refresh cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          loadPingData();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Load latest evaluation run & history from ChromaDB
  const loadEvaluationData = async () => {
    setIsLoading(true);
    try {
      const [latest, histRes] = await Promise.all([
        fetchLatestEvaluation(),
        fetchEvaluationHistory().catch(() => ({ history: [] }))
      ]);
      setEvalData(latest.scorer_version === '2.0' ? latest : null);
      setEvalHistory(histRes.history || []);
    } catch (err: any) {
      setEvalData(null);
      console.error('Error fetching evaluation data from ChromaDB:', err);
      setStatusBanner('Could not fetch evaluation from ChromaDB. Please click "Re-run RAG Evals".');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluationData();
  }, []);

  // Trigger manual live evaluation re-run and ChromaDB persistence
  const handleRunEvaluation = async () => {
    setIsRunningEvals(true);
    setStatusBanner('Executing all-mode benchmark suite against CBUAE vector index & calculating scores...');
    try {
      const result = await runLiveEvaluation();
      setEvalData(result);
      setStatusBanner(`Evaluation completed and saved to ChromaDB collection 'cbuae_eval_runs' (Run ID: ${result.run_id})`);
      // Refresh history
      const histRes = await fetchEvaluationHistory().catch(() => ({ history: [] }));
      setEvalHistory(histRes.history || []);
    } catch (err: any) {
      alert('Failed to execute evaluation suite: ' + (err.message || err));
      setStatusBanner('Evaluation failed. Check server logs.');
    } finally {
      setIsRunningEvals(false);
      setTimeout(() => setStatusBanner(null), 8000);
    }
  };

  const activeMode = evalData?.mode_evaluations?.find((m: any) => m.id === selectedModeId);
  const testCases = activeMode?.cases || evalData?.cases || [];
  const filteredCases = testCases.filter((tc: any) => {
    if (benchmarkFilter === 'in_scope') return !tc.refusal_expected;
    if (benchmarkFilter === 'refusal') return tc.refusal_expected;
    return true;
  });

  const overallScore = evalData?.overall_score ?? null;
  const passedCases = evalData?.passed_cases ?? 'N/A';
  const totalCases = evalData?.total_cases ?? 'N/A';

  const modeEvaluations = evalData?.scorer_version === '2.0' ? (evalData.mode_evaluations || []) : [];

  const sortedModes = [...modeEvaluations].sort((a: any, b: any) => {
    if (ragSortBy === 'speed') return a.avg_latency_ms - b.avg_latency_ms;
    if (ragSortBy === 'score') return b.overall_score - a.overall_score;
    return 0;
  });

  const fastestMode = [...modeEvaluations].sort((a: any, b: any) => a.avg_latency_ms - b.avg_latency_ms)[0] || modeEvaluations[0];
  const topScoreMode = [...modeEvaluations].sort((a: any, b: any) => b.overall_score - a.overall_score)[0] || modeEvaluations[0];
  const topFaithfulMode = [...modeEvaluations].sort((a: any, b: any) => b.rag_faithfulness - a.rag_faithfulness)[0] || modeEvaluations[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 dark:from-slate-900 dark:via-[#0f172a] dark:to-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Activity className="h-3.5 w-3.5" />
              Live Telemetry &amp; ChromaDB RAG Evaluation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Diagnostics &amp; RAG Evaluation Suite
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time monitoring for ChromaDB vector storage (port 8081), Chroma UI (port 8090), and autonomous LangGraph multi-agent execution. 
              Evaluations are computed dynamically and persisted in ChromaDB collection <code className="text-cyan-600 dark:text-cyan-400 font-mono">cbuae_eval_runs</code>.
            </p>
          </div>

          {/* Action Button: Run / Refresh Evals */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleRunEvaluation}
              disabled={isRunningEvals}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:text-slate-950 font-bold text-xs shadow-md dark:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRunningEvals ? 'animate-spin' : ''}`} />
              <span>{isRunningEvals ? 'Running 15 Evals...' : 'Re-run RAG Evals & Update Chroma'}</span>
            </button>
          </div>
        </div>

        {/* Live Status Notification Banner */}
        {statusBanner && (
          <div className="mt-4 p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-200 text-xs flex items-center gap-2 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}
      </div>

      {/* Real-Time Ping Monitoring Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              pingData?.services.chroma_db.status === 'online' &&
              pingData?.services.chroma_ui.status === 'online' &&
              pingData?.services.langgraph.status === 'online'
                ? 'bg-emerald-400'
                : 'bg-amber-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              pingData?.services.chroma_db.status === 'online' &&
              pingData?.services.chroma_ui.status === 'online' &&
              pingData?.services.langgraph.status === 'online'
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            }`} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>Real-Time Infrastructure Health &amp; Pings</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                5-Min Cycle
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live latency probes across ChromaDB REST (8081), Chroma UI (8090), and deterministic LangGraph engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Refresh Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium">
            <Clock className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Next auto-ping: <strong className="text-slate-900 dark:text-white">{formatCountdown(secondsUntilRefresh)}</strong></span>
          </div>

          {/* Manual Ping Now Button */}
          <button
            onClick={loadPingData}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 dark:text-cyan-300 dark:border dark:border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Ping ChromaDB, Chroma UI, and LangGraph immediately"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Pinging...' : 'Ping Now'}</span>
          </button>
        </div>
      </div>

      {/* ChromaDB & Server Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ChromaDB REST Server */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">ChromaDB REST Server</h2>
            </div>
            {pingData?.services.chroma_db.status === 'online' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online · ⚡{pingData.services.chroma_db.latency_ms}ms
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Offline
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Port:</span>
              <span className="text-slate-900 dark:text-white font-mono">http://localhost:8081</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Corpus Collection:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">cbuae_regulations</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Eval Runs Collection:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">cbuae_eval_runs</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Indexed Corpus Chunks:</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">
                {pingData?.services.chroma_db.details?.chunks_count ?? health?.chroma.chunk_count ?? 15} Chunks
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Vector Space:</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">Cosine HNSW (384-dim)</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Last Real-Time Ping:</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                {pingData?.services.chroma_db.last_checked || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Chroma Web UI */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Chroma Web UI</h2>
            </div>
            {pingData?.services.chroma_ui.status === 'online' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online · ⚡{pingData.services.chroma_ui.latency_ms}ms
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Offline
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Port:</span>
              <span className="text-slate-900 dark:text-white font-mono">http://localhost:8090</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Web Explorer:</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">ReguGraph Chroma Explorer</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Collections Monitored:</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">
                {pingData?.services.chroma_ui.details?.collections_monitored ?? 2} Collections
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Chroma Backend Link:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Connected (Port 8081)</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Last Real-Time Ping:</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                {pingData?.services.chroma_ui.last_checked || 'Pending'}
              </span>
            </div>
          </div>
          <div className="pt-2">
            <a
              href="http://localhost:8090"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Chroma DB UI (8090) ↗</span>
            </a>
          </div>
        </div>

        {/* Multi-Agent LangGraph Engine */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">LangGraph Engine</h2>
            </div>
            {pingData?.services.langgraph.status === 'online' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online · ⚡{pingData.services.langgraph.latency_ms}ms
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Degraded
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Architecture:</span>
              <span className="text-slate-700 dark:text-slate-200 font-mono">StateGraph Pipeline</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Math Engine:</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-semibold">Deterministic IEEE-754</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Retrieval:</span>
              <span className="text-slate-700 dark:text-slate-200 font-mono">Dense + BM25 (RRF k=60)</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Refusal Gate:</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">Foreign / Ungrounded Scope</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Last Real-Time Ping:</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                {pingData?.services.langgraph.last_checked || 'Live'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* RAG EVALUATION SCORECARD & TELEMETRY */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl dark:shadow-2xl">
        
        {/* Scorecard Header & Chroma Provenance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">RAG Benchmark Evaluation Scorecard</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                Chroma Collection: <strong className="text-slate-800 dark:text-slate-200">cbuae_eval_runs</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                Latest Run: <strong className="text-slate-800 dark:text-slate-200">{evalData?.timestamp || 'Loading...'}</strong>
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                Run ID: <strong className="text-slate-700 dark:text-slate-400">{evalData?.run_id || 'N/A'}</strong>
              </span>
            </div>
          </div>

          {/* Past Runs History Selector */}
          {evalHistory.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <History className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">History:</span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-mono font-semibold text-[11px] border border-slate-200 dark:border-slate-700">
                {evalHistory.length} Runs in ChromaDB
              </span>
            </div>
          )}
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Composite Score */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0a0f1d] border border-cyan-200 dark:border-cyan-500/30 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-cyan-700 dark:text-cyan-300 uppercase font-bold tracking-wider">Overall RAG Score</div>
            <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
              {isLoading ? '...' : metric(overallScore)}
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(overallScore ?? 0, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {passedCases}/{totalCases} Cases Passed
            </div>
          </div>

          {/* Evidence Coverage@3 */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Evidence Coverage@3</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {isLoading ? '...' : metric(evalData?.recall_at_3)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Required evidence in top 3 passages</div>
          </div>

          {/* Citation Coverage */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Citation Coverage</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {isLoading ? '...' : metric(evalData?.citation_accuracy)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Emitted authority + supporting evidence</div>
          </div>

          {/* Refusal Precision */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Refusal Precision</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {isLoading ? '...' : metric(evalData?.refusal_precision)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Foreign boundary protection</div>
          </div>

          {/* Average Latency */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/90">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Mean RAG Latency</div>
            <div className="text-2xl font-mono font-extrabold text-teal-400 mt-1">
              {isLoading ? '...' : metric(evalData?.avg_latency_ms, ' ms')}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Measured run, includes initialization</div>
          </div>

        </div>

      </div>

      {/* 10 RAG ARCHITECTURES EVALUATION LEADERBOARD & COMPARISON MATRIX */}
      <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-extrabold text-white">
                10 RAG Architectures Evaluation Leaderboard &amp; Benchmark Matrix
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                100% Free &amp; Open Source
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Side-by-side empirical performance benchmark of all 10 RAG patterns auditing Central Bank of the UAE (CBUAE) retail credit standards. 
              Evaluates <strong>Evidence@3</strong>, <strong>Citation Accuracy</strong>, <strong>Refusal Precision</strong>, <strong>Numeric Support</strong>, and <strong>Latency</strong>.
              Results are persisted directly in ChromaDB collection <code className="text-cyan-400 font-mono">cbuae_eval_runs</code>.
            </p>
          </div>

          {/* Quick Sorter */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1d] p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto shrink-0 text-xs">
            <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3 text-slate-500" />
              Sort:
            </span>
            {[
              { id: 'default', label: 'Pattern 1-10' },
              { id: 'speed', label: 'Fastest Latency' },
              { id: 'score', label: 'Highest Score' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setRagSortBy(s.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  ragSortBy === s.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Podium Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0a0f1d] to-[#0f172a] border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Fastest Execution
              </span>
              <span className="font-mono text-xs font-extrabold">{fastestMode?.avg_latency_ms?.toFixed(1) ?? 'N/A'} ms</span>
            </div>
            <div className="text-sm font-bold text-white">{fastestMode?.name}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {fastestMode?.badge}: {fastestMode?.key_strength}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#0a0f1d] to-[#0f172a] border border-purple-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                Highest Overall Score
              </span>
              <span className="font-mono text-xs font-extrabold">{topScoreMode?.overall_score?.toFixed(1) ?? 'N/A'}% Score</span>
            </div>
            <div className="text-sm font-bold text-white">{topScoreMode?.name}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {topScoreMode?.badge}: Evidence@3 {topScoreMode?.recall_at_3}% · Citation Precision {topScoreMode?.citation_accuracy}%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0a0f1d] to-[#0f172a] border border-blue-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Highest Numeric Support
              </span>
              <span className="font-mono text-xs font-extrabold">{topFaithfulMode?.rag_faithfulness?.toFixed(1) ?? 'N/A'}% Grounding</span>
            </div>
            <div className="text-sm font-bold text-white">{topFaithfulMode?.name}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {topFaithfulMode?.badge}: Token-presence proxy; not semantic or legal verification.
            </p>
          </div>
        </div>

        {/* 10 RAG Leaderboard Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070b14] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4"># Rank &amp; Architecture Pattern</th>
                  <th className="py-3 px-3">Measured Outcome</th>
                  <th className="py-3 px-3 text-center">Evidence@3</th>
                  <th className="py-3 px-3 text-center">Citation Acc</th>
                  <th className="py-3 px-3 text-center">Refusal Prec</th>
                  <th className="py-3 px-3 text-center">Numeric Support</th>
                  <th className="py-3 px-3 text-center">Mean Latency</th>
                  <th className="py-3 px-3 text-center">Overall Score</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {sortedModes.map((m: any, idx: number) => {
                  const isSelected = selectedModeId === m.id;
                  return (
                    <React.Fragment key={m.id}>
                      <tr
                        onClick={() => setSelectedModeId(isSelected ? null : m.id)}
                        className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-950/20 border-l-2 border-cyan-400' : ''
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400 text-xs w-5">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-white text-xs">{m.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {m.tech_stack}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-semibold">
                            <Award className="h-3 w-3 text-amber-400" />
                            {m.badge}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400 whitespace-nowrap">
                          {metric(m.recall_at_3)}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400 whitespace-nowrap">
                          {metric(m.citation_accuracy)}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400 whitespace-nowrap">
                          {metric(m.refusal_precision)}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-cyan-400 whitespace-nowrap">
                          {metric(m.numeric_support)}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <span className="font-mono text-[11px] font-bold text-teal-300">
                              {m.avg_latency_ms} ms
                            </span>
                            <div className="w-16 bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                              <div
                                className="bg-teal-400 h-full rounded-full"
                                style={{ width: `${Math.min((m.avg_latency_ms / 35) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-extrabold text-[11px]">
                            {m.overall_score}%
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer"
                          >
                            <span>{isSelected ? 'Close' : 'Inspect'}</span>
                            {isSelected ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Mode Details Drawer */}
                      {isSelected && (
                        <tr className="bg-[#050811] border-b border-slate-800">
                          <td colSpan={9} className="p-4 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1.5 md:col-span-1">
                                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                                  <Layers className="h-3.5 w-3.5" />
                                  Core Concept &amp; Mechanism
                                </span>
                                <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                                  {m.concept}
                                </div>
                              </div>

                              <div className="space-y-1.5 md:col-span-1">
                                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Key Strength in Legal Auditing
                                </span>
                                <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                                  {m.key_strength}
                                </div>
                              </div>

                              <div className="space-y-1.5 md:col-span-1">
                                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Ideal CBUAE Compliance Use Case
                                </span>
                                <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                                  {m.ideal_use_case}
                                </div>
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">100% Free &amp; Open Source Stack:</span>
                                <code className="text-cyan-300 font-mono font-semibold">{m.tech_stack}</code>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">Run Storage:</span>
                                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Stored in cbuae_eval_runs
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Production Multi-Agent Architecture Visual Flow */}
      <div className="p-6 rounded-3xl bg-[#0f172a]/70 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          End-to-End Autonomous Multi-Agent LangGraph Pipeline Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {[
            {
              step: '01',
              title: 'Contract Deconstruct',
              desc: 'Extracts loan amount, salary, tenure, settlement clauses, and fee schedules.',
              icon: Terminal,
              color: 'text-blue-400'
            },
            {
              step: '02',
              title: 'Hybrid RRF Retrieve',
              desc: 'ChromaDB (Dense 8081) + BM25 (Sparse) with Reciprocal Rank Fusion.',
              icon: Database,
              color: 'text-teal-400'
            },
            {
              step: '03',
              title: 'Deterministic Math',
              desc: 'IEEE 754 arithmetic: DBR, 1% cap, tenure, and exact AED restitution.',
              icon: Cpu,
              color: 'text-emerald-400'
            },
            {
              step: '04',
              title: 'Cross-Examine',
              desc: 'Validates provisions against CBUAE Circular 8/2020 & Notice 2011/23.',
              icon: ShieldCheck,
              color: 'text-amber-400'
            },
            {
              step: '05',
              title: 'Refusal & Grounding Gate',
              desc: 'Autonomous refusal for foreign laws (UK FCA/US Fed) and crypto tokens.',
              icon: AlertTriangle,
              color: 'text-rose-400'
            },
            {
              step: '06',
              title: 'Synthesize Dossier',
              desc: 'Compiles formal markdown compliance report and remediation plan.',
              icon: CheckCircle2,
              color: 'text-emerald-400'
            },
          ].map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={i} className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-slate-800 text-xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500">Node {node.step}</span>
                  <Icon className={`h-4 w-4 ${node.color}`} />
                </div>
                <div className="font-bold text-white text-xs">{node.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{node.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 15-INQUIRY BENCHMARK TEST CASES & LIVE RESPONSES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Per-Mode Benchmark Test Cases &amp; Generated Responses
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any inquiry row to expand and inspect the exact answer generated by the CBUAE RAG agent.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-2xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: `All (${testCases.length})` },
              { id: 'in_scope', label: `In-Scope (${testCases.filter((c: any) => !c.refusal_expected).length})` },
              { id: 'refusal', label: `Refusals (${testCases.filter((c: any) => c.refusal_expected).length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBenchmarkFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  benchmarkFilter === f.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Cases Table with Expandable Answer Drawers */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0f1d] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Inquiry Query</th>
                  <th className="py-3 px-4">Expected Citation / Boundary</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status &amp; Score</th>
                  <th className="py-3 px-4 text-center">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCases.map((tc: any) => {
                  const isExpanded = expandedCaseId === tc.id;
                  const isPassed = tc.status === 'PASS';
                  return (
                    <React.Fragment key={tc.id}>
                      <tr
                        onClick={() => setExpandedCaseId(isExpanded ? null : tc.id)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-300 whitespace-nowrap">
                          {tc.id}
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                            {tc.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-medium max-w-xs sm:max-w-md">
                          <div className="line-clamp-2">{tc.query}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                          {tc.refusal_expected ? (
                            <span className="text-amber-400 font-semibold">REFUSAL GATE ({tc.expected_citation})</span>
                          ) : (
                            <span className="text-emerald-400">{tc.expected_citation}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {tc.latency_ms} ms
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                            {tc.status} ({tc.score}%)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Response Details Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#070b14] border-b border-slate-800">
                          <td colSpan={7} className="p-4 sm:p-6 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                  Statutory Citation Comparison
                                </span>
                                <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs space-y-1 font-mono">
                                  <div className="text-slate-400">
                                    Expected: <span className="text-emerald-400 font-semibold">{tc.expected_citation}</span>
                                  </div>
                                  <div className="text-slate-400">
                                    Actual: <span className="text-cyan-400 font-semibold">{tc.actual_citation || 'None cited'}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex items-center gap-3">
                                    <span>Citation Match: {tc.citation_match ? '✅ Verified' : '⚠️ Deviated'}</span>
                                    <span>Retrieval Hit: {tc.retrieval_hit ? '✅ Hit' : '⚠️ Miss'}</span>
                                    <span>Numeric Support: {metric(tc.numeric_support)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                  RAG Agent Generated Answer / Refusal
                                </span>
                                <div className="p-3 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                                  {tc.answer || tc.answer_preview || 'No response recorded.'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
