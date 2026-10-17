import React, { useState } from 'react';
import {
  Layers,
  Database,
  RefreshCw,
  BookOpen,
  Share2,
  Sparkles,
  Cpu,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Code,
  Compass,
  Play
} from 'lucide-react';
import { searchCodex } from '../services/api';
import type { SearchResponse } from '../types';


interface RAGConceptCard {
  id: string;
  number: number;
  title: string;
  category: string;
  tagline: string;
  whatYouBuild: string;
  freeTechStack: string;
  whyItMatters: string;
  failureModePrevented: string;
  sampleQuery: string;
  icon: any;
  color: string;
  accentBg: string;
  flowSteps: string[];
}

const RAG_CONCEPTS: RAGConceptCard[] = [
  {
    id: 'hybrid',
    number: 1,
    title: 'Hybrid Search RAG',
    category: 'Lexical + Dense Fusion',
    tagline: 'BM25 Keyword Search + Dense Vector Embeddings + Reciprocal Rank Fusion',
    whatYouBuild: 'Combines BM25 token frequency scoring with ChromaDB cosine dense retrieval using Reciprocal Rank Fusion (RRF with k=60).',
    freeTechStack: 'Python 3.12 · rank-bm25 (BM25Okapi) · ChromaDB (HNSW Cosine) · RRF Algorithmic Fusion',
    whyItMatters: 'Overcomes the classic vocabulary mismatch problem where dense embeddings miss exact numerical statutory caps (e.g. "1%", "AED 10,000") and BM25 misses semantic intent ("prepayment exit penalty" vs "early settlement").',
    failureModePrevented: 'Eliminates keyword hallucination and ensures exact legal article numbers are found.',
    sampleQuery: 'What is the statutory cap on early settlement prepayment fees under Circular 8/2020?',
    icon: Layers,
    color: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30',
    flowSteps: ['Tokenize query for BM25', 'Compute 384-dim dense query vector', 'Execute parallel sparse & dense search', 'Reciprocal Rank Fusion (k=60)', 'Grounded Synthesis']
  },
  {
    id: 'metadata',
    number: 2,
    title: 'Metadata-Filtered RAG',
    category: 'Categorical Guardrails',
    tagline: 'Semantic Vector Search + Strict Categorical Metadata Filters',
    whatYouBuild: 'Narrows the vector retrieval search space using categorical metadata predicates ($and / where filters for circular, facility type, and tables).',
    freeTechStack: 'Python 3.12 · ChromaDB Metadata Filters ($and / where) · Pydantic Schema Validation',
    whyItMatters: 'Prevents cross-facility contamination where clauses from different banking products (e.g. mortgage LTV caps vs auto loan downpayment rules) accidentally match and pollute generation.',
    failureModePrevented: 'Stops out-of-context articles from leaking across facility types.',
    sampleQuery: 'What are the mortgage loan regulations and LTV limits under Circular 31/2013?',
    icon: Database,
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    flowSteps: ['Infer metadata filters with Pydantic', 'Construct ChromaDB where predicates', 'Execute filtered vector search', 'Fallback to broad search if empty', 'Synthesize category-specific answer']
  },
  {
    id: 'reranking',
    number: 3,
    title: 'Reranking RAG',
    category: 'Two-Stage Retrieval',
    tagline: 'First-Stage Candidate Retrieval (Top-8) -> Second-Stage Cross-Scorer (Top-2)',
    whatYouBuild: 'Retrieves a broad candidate pool of 8 documents using fast vector search, then applies a joint cross-encoder scoring function evaluating exact numerical tokens and term proximity.',
    freeTechStack: 'Python 3.12 · ChromaDB (Stage 1 Bi-Encoder) · Local Numerical & Lexical Cross-Scorer',
    whyItMatters: 'Bi-encoders evaluate queries and documents independently. Cross-scoring evaluates them jointly, catching critical differences between 1% vs 3% exit fees or 48 vs 60 month tenures.',
    failureModePrevented: 'Compresses context by 75% before synthesis, sending only the top-2 highest precision chunks to prevent LLM distractions.',
    sampleQuery: 'What are the maximum personal loan borrowing caps and tenure limits?',
    icon: RefreshCw,
    color: 'text-purple-400',
    accentBg: 'bg-purple-500/10 border-purple-500/30',
    flowSteps: ['High-recall candidate retrieval (fetch 8)', 'Joint query-document cross-scoring', 'Numerical constraint bonus scoring', 'Sort by cross-score descending', 'Context compression to top-2']
  },
  {
    id: 'contextual',
    number: 4,
    title: 'Contextual Chunking RAG',
    category: 'Document Context Retention',
    tagline: 'Hierarchical Document Breadcrumbs + Situational Context Preservation',
    whatYouBuild: 'Enriches raw chunk passages with parent document title, circular reference, legal jurisdiction, and section breadcrumbs before chunk embedding.',
    freeTechStack: 'Python 3.12 · Hierarchical Markdown AST Parser · Breadcrumb Context Injector · ChromaDB',
    whyItMatters: 'Standard chunking causes "chunk amnesia": a chunk stating "The fee is capped at AED 2,500" lacks the context of whether it applies to personal loans, auto loans, or mortgages.',
    failureModePrevented: 'Eliminates orphaned passages and guarantees that every retrieved chunk is self-contained with full situational context.',
    sampleQuery: 'What are the standardized processing fee caps on retail banking services?',
    icon: BookOpen,
    color: 'text-blue-400',
    accentBg: 'bg-blue-500/10 border-blue-500/30',
    flowSteps: ['Parse Markdown hierarchical headers', 'Generate document breadcrumbs', 'Prepend situational metadata header', 'Compute context-aware embeddings', 'Retrieve self-contained chunks']
  },
  {
    id: 'sql',
    number: 5,
    title: 'SQL + Vector RAG',
    category: 'Hybrid Structured/Unstructured',
    tagline: 'Deterministic SQLite Database Queries + ChromaDB Narrative Legal Context',
    whatYouBuild: 'Combines deterministic SQL queries against a structured SQLite database (cbuae_structured.db) with dense vector search for legal gazette prose.',
    freeTechStack: 'Python 3.12 · SQLite3 (Built-in standard library) · ChromaDB · Relational-Vector Synthesis',
    whyItMatters: 'LLMs are notoriously prone to math errors and number hallucination. Relational SQL guarantees 100% deterministic numbers for caps, while vector search provides the legal narrative.',
    failureModePrevented: 'Zero numerical hallucinations on statutory limits, tenures, and penalty caps.',
    sampleQuery: 'What are the exact statutory caps on personal loan processing fees and late payment penalties?',
    icon: Database,
    color: 'text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/30',
    flowSteps: ['Detect query intent and numerical terms', 'Execute deterministic SQL on SQLite3', 'Query ChromaDB for narrative circular text', 'Format structured Markdown data table', 'Synthesize structured + vector findings']
  },
  {
    id: 'graph',
    number: 6,
    title: 'Knowledge Graph + Vector RAG',
    category: 'GraphRAG / Multi-Hop Reasoning',
    tagline: 'NetworkX Directed Graph (DiGraph) Traversal + Entity-Triplet Fused Vector Search',
    whatYouBuild: 'Traverses a 2-hop directed regulatory entity graph (Authority -> Circular -> Article -> Constraint -> Remedy) using NetworkX, fused with vector search.',
    freeTechStack: 'Python 3.12 · NetworkX (DiGraph) · ChromaDB · Multi-Hop Relational Traversal',
    whyItMatters: 'Banking regulations are interconnected webs. Answering "What happens if a bank breaches the 50% DBR cap?" requires connecting the cap (Notice 2011/23) to the statutory remedy (interest write-off mandate).',
    failureModePrevented: 'Solves the "isolated chunk" dilemma by exposing relational paths between regulatory entities across circulars.',
    sampleQuery: 'What are the statutory consequences and consumer remedies if a bank breaches the DBR cap?',
    icon: Share2,
    color: 'text-rose-400',
    accentBg: 'bg-rose-500/10 border-rose-500/30',
    flowSteps: ['Entity recognition and anchor linking', 'NetworkX multi-hop edge traversal', 'Extract source-relation-target triplets', 'Retrieve supporting vector clauses', 'Synthesize relational regulatory proof']
  },
  {
    id: 'crag',
    number: 7,
    title: 'Corrective RAG (CRAG)',
    category: 'Self-Correcting Retrieval',
    tagline: 'Autonomous Retrieval Quality Evaluator + Legal Thesaurus Query Rewriting Loop',
    whatYouBuild: 'Evaluates retrieval confidence score (0.0 to 1.0). If confidence < 0.70, triggers autonomous query rewriting using a CBUAE domain thesaurus and re-retrieves before generation.',
    freeTechStack: 'Python 3.12 · ChromaDB · Autonomous Quality Rubric · CBUAE Regulatory Domain Thesaurus',
    whyItMatters: 'If initial retrieval retrieves weak or ambiguous context, standard RAG hallucinates. CRAG actively detects low confidence and corrects the query automatically.',
    failureModePrevented: 'Prevents garbage-in, garbage-out retrieval failures by actively rewriting vague user terminology.',
    sampleQuery: 'What are the rules for car loan prepayment penalty?',
    icon: RefreshCw,
    color: 'text-teal-400',
    accentBg: 'bg-teal-500/10 border-teal-500/30',
    flowSteps: ['Initial hybrid retrieval', 'Compute retrieval confidence score', 'Evaluate threshold (>=0.70 vs <0.70)', 'If low: rewrite query with legal synonyms', 'Secondary corrective retrieval & synthesis']
  },
  {
    id: 'self_rag',
    number: 8,
    title: 'Self-RAG',
    category: 'Self-Reflective Tokens',
    tagline: 'Autonomous Reflection Tokens: [Retrieve], [Is-Rel], [Is-Sup] and Grounding Critic',
    whatYouBuild: 'Implements self-reflective decision tokens: autonomously decides [Retrieve] vs [No-Retrieve] (bypasses DB for greetings), evaluates [Is-Rel] evidence, and validates [Is-Sup] citation support.',
    freeTechStack: 'Python 3.12 · Self-Reflection Critic Tokens · Citation Grounding Evaluator · ChromaDB',
    whyItMatters: 'Traditional RAG mechanically executes vector lookups for every input—even "Hello" or "Thanks". Self-RAG skips retrieval when unnecessary and verifies citation support before answering.',
    failureModePrevented: 'Stops unnecessary database queries for conversational greetings and catches unsupported claims before output.',
    sampleQuery: 'What is the maximum Debt Burden Ratio for UAE retirees and pensioners?',
    icon: Sparkles,
    color: 'text-yellow-400',
    accentBg: 'bg-yellow-500/10 border-yellow-500/30',
    flowSteps: ['Critic decision: [Retrieve] vs [No-Retrieve]', 'If greeting: synthesize direct response', 'If regulatory: execute knowledge retrieval', 'Evaluate [Is-Rel: Relevant] on retrieved chunk', 'Evaluate [Is-Sup: Fully-Supported] on citations']
  },
  {
    id: 'multimodal',
    number: 9,
    title: 'Multimodal RAG',
    category: 'Tables, Math Formulas & Prose',
    tagline: 'Tabular Fee Schedules + LaTeX Math Formulas + Narrative Legal Text Fusion',
    whatYouBuild: 'Natively queries and reasons over heterogeneous regulatory representations: structured 43-service banking fee tables, mathematical equations (DBR/settlement logic), and narrative clauses.',
    freeTechStack: 'Python 3.12 · Markdown Table AST · Formula Registry (LaTeX) · ChromaDB',
    whyItMatters: 'Regulatory circulars are rarely pure text. They contain fee matrices and mathematical formulas that lose meaning when flattened into continuous text strings.',
    failureModePrevented: 'Preserves table column-row alignment and mathematical variable dependencies during retrieval and generation.',
    sampleQuery: 'What is the formula for Debt Burden Ratio and the fee cap for liability certificates?',
    icon: Layers,
    color: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 border-indigo-500/30',
    flowSteps: ['Search tabular fee schedule matrix', 'Retrieve mathematical formula blocks', 'Execute narrative vector retrieval', 'Fuse table rows and formula AST', 'Render structured multimodal response']
  },
  {
    id: 'agentic',
    number: 10,
    title: 'Agentic RAG',
    category: 'Autonomous Multi-Tool Agent',
    tagline: 'LangGraph Controller Coordinating Vector Search, SQL, Knowledge Graph & Financial Math',
    whatYouBuild: 'An autonomous multi-step reasoning agent with a local tool registry: analyzes queries, creates an execution plan, invokes tools dynamically, and synthesizes multi-source findings.',
    freeTechStack: 'Python 3.12 · Autonomous Tool-Calling Controller · Local Tools (Math, SQL, Graph, Vector)',
    whyItMatters: 'Complex auditing questions (e.g. "A bank charged AED 25,000 to exit a loan with AED 850,000 balance. Is this legal and what refund is due?") cannot be answered by vector search alone.',
    failureModePrevented: 'Solves complex multi-step problems requiring deterministic math calculation, database checks, and legal citations in a single coordinated workflow.',
    sampleQuery: 'Audit early settlement fee: A bank charged AED 25,000 on an outstanding balance of AED 850,000. Is this compliant?',
    icon: Cpu,
    color: 'text-cyan-300',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30',
    flowSteps: ['Intent decomposition & tool planning', 'Tool 1: Financial Calculator (min math)', 'Tool 2: SQL Database (statutory cap lookup)', 'Tool 3: NetworkX Graph (entity relations)', 'Tool 4: Vector Search & Multi-Tool Synthesis']
  }
];

export const RAGLearningHub: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<RAGConceptCard>(RAG_CONCEPTS[0]);
  const [workbenchQuery, setWorkbenchQuery] = useState<string>(RAG_CONCEPTS[0].sampleQuery);
  const [workbenchMode, setWorkbenchMode] = useState<string>(RAG_CONCEPTS[0].id);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [workbenchResult, setWorkbenchResult] = useState<SearchResponse | null>(null);
  const [expandedTraceIdx, setExpandedTraceIdx] = useState<number | null>(null);

  const handleSelectConcept = (concept: RAGConceptCard) => {
    setSelectedConcept(concept);
    setWorkbenchMode(concept.id);
    setWorkbenchQuery(concept.sampleQuery);
  };

  const handleRunWorkbench = async () => {
    if (!workbenchQuery.trim() || isExecuting) return;
    setIsExecuting(true);
    setWorkbenchResult(null);

    try {
      const res = await searchCodex(workbenchQuery.trim(), workbenchMode);
      setWorkbenchResult(res);
    } catch (err: any) {
      setWorkbenchResult({
        query: workbenchQuery,
        answer: `Error executing ${workbenchMode} RAG: ${err.message || 'Execution failed'}`,
        citation: 'Workbench Execution Alert',
        refusal_triggered: true,
        refusal_category: 'execution_error',
        retrieved_chunks: [],
        latency_ms: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ============================================================ */}
      {/* 1. MASTERCLASS HEADER & LEARNING BANNER                      */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 dark:from-[#0d1527] dark:via-[#0f1b33] dark:to-[#0a1224] border border-slate-200 dark:border-cyan-900/40 p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              Interactive RAG Curriculum
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Free & Open-Source Stack
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono">
              10 Production Architecture Patterns
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              10 RAG Production Architectural Patterns Masterclass
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Explore, test, and master all 10 foundational Retrieval-Augmented Generation (RAG) paradigms.
              Every pattern in ReguGraph-UAE is implemented with <strong>100% free and open-source local tools</strong>—no paid OpenAI, Cohere, or Tavily subscriptions required.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Total Patterns</div>
              <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">10 RAG Modes</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Vector DB</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">ChromaDB</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Relational Store</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">SQLite3 (Built-in)</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Graph Engine</div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">NetworkX DiGraph</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LIVE INTERACTIVE TEST WORKBENCH                           */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-white dark:bg-[#0b1222] border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-md dark:shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live RAG Execution Workbench</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any of the 10 RAG modes, submit a regulatory inquiry, and inspect the real-time execution trace and latency.
            </p>
          </div>

          {/* Mode Pill Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Active Mode:</span>
            <span className="px-3 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300 font-bold font-mono text-xs">
              {workbenchMode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Workbench Mode Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RAG_CONCEPTS.map((c) => {
            const isSelected = workbenchMode === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectConcept(c)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-500/15 border-cyan-500 text-cyan-900 dark:text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-slate-400">#{c.number}</div>
                <div className="text-xs font-bold truncate mt-0.5">{c.title.replace(/^\d+\.\s*/, '')}</div>
              </button>
            );
          })}
        </div>

        {/* Query Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Regulatory Query or Facility Statement:</span>
            <span className="text-[10px] text-slate-400 font-mono">Target: {selectedConcept.title}</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={workbenchQuery}
                onChange={(e) => setWorkbenchQuery(e.target.value)}
                placeholder="Enter regulatory query or select a preset below..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleRunWorkbench}
              disabled={isExecuting || !workbenchQuery.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 shrink-0"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing {workbenchMode.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Execute {workbenchMode.toUpperCase()} RAG</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold">Suggested Presets:</span>
            {RAG_CONCEPTS.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setWorkbenchMode(c.id);
                  setWorkbenchQuery(c.sampleQuery);
                  setSelectedConcept(c);
                }}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-[#0e1629] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                #{c.number} {c.title.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Execution Results Box */}
        {workbenchResult && (
          <div className="p-5 rounded-2xl bg-[#070c18] border border-cyan-900/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-xs">
                  {workbenchResult.title || `${workbenchMode.toUpperCase()} RAG Response`}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[10px] font-mono">
                  {workbenchResult.citation || 'Central Bank of the UAE'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{workbenchResult.latency_ms}ms</span>
                </span>
                <span className="text-emerald-400 font-bold">● Grounded</span>
              </div>
            </div>

            {/* Answer Content */}
            <div className="text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans bg-[#0c1322] p-4 rounded-xl border border-slate-800/70">
              {workbenchResult.answer}
            </div>

            {/* Step-by-Step Execution Trace Flow */}
            {workbenchResult.execution_trace && workbenchResult.execution_trace.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Execution Trace ({workbenchResult.execution_trace.length} Sequential Pipeline Steps):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {workbenchResult.execution_trace.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => setExpandedTraceIdx(expandedTraceIdx === sIdx ? null : sIdx)}
                      className="p-3 rounded-xl bg-[#0e1629] border border-slate-800 hover:border-cyan-700/60 transition-all cursor-pointer space-y-1"
                    >
                      <div className="text-[10px] font-mono font-bold text-cyan-400 flex items-center justify-between">
                        <span>Step {sIdx + 1}</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500" />
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">{step.step}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. 10 ARCHITECTURAL CONCEPTS DETAILED CURRICULUM             */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">The 10 Architectural Patterns Masterclass</h2>
            <p className="text-xs text-slate-400">
              Detailed technical blueprint, problem formulation, and free open-source stack mapping for each pattern.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RAG_CONCEPTS.map((concept) => {
            const Icon = concept.icon;
            const isSelected = selectedConcept.id === concept.id;

            return (
              <div
                key={concept.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isSelected
                    ? 'bg-[#0f1b33] border-cyan-500/50 shadow-xl shadow-cyan-950/30'
                    : 'bg-[#0b1222] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-2xl ${concept.accentBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${concept.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          Pattern #{concept.number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-mono font-bold">
                          {concept.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-white mt-0.5">{concept.title}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectConcept(concept)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] transition-all cursor-pointer shrink-0"
                  >
                    Load into Workbench
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {concept.whatYouBuild}
                </p>

                {/* Free & Open-Source Stack Tag */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-[#070c18] border border-slate-800 space-y-1">
                  <div className="text-[9px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    <span>100% Free & Open-Source Local Tech Stack:</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-200">
                    {concept.freeTechStack}
                  </div>
                </div>

                {/* Value & Failure Mode Solved */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-[#0e1629] border border-slate-800/80">
                    <span className="font-bold text-slate-400 block mb-0.5">Why It Matters:</span>
                    <span className="text-slate-300">{concept.whyItMatters}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0e1629] border border-slate-800/80">
                    <span className="font-bold text-amber-400 block mb-0.5">Failure Mode Solved:</span>
                    <span className="text-slate-300">{concept.failureModePrevented}</span>
                  </div>
                </div>

                {/* Visual Pipeline Flow */}
                <div className="mt-3 pt-3 border-t border-slate-800/70">
                  <div className="text-[9px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                    Pipeline Execution Flow:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    {concept.flowSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/60">
                          {step}
                        </span>
                        {idx < concept.flowSteps.length - 1 && (
                          <span className="text-slate-600">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. COMPARISON MATRIX CHEATSHEET                              */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-[#0b1222] border border-slate-800 p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">RAG Architectural Cheatsheet & Selection Matrix</h2>
        </div>
        <p className="text-xs text-slate-400">
          When to choose each architecture for regulatory, financial, and enterprise compliance workloads.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#070c18]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0c1424] text-cyan-300 font-bold font-mono text-[11px]">
                <th className="p-3"># Pattern</th>
                <th className="p-3">Primary Retrieval</th>
                <th className="p-3">Open-Source Tool</th>
                <th className="p-3">Best Used For</th>
                <th className="p-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px] text-slate-300">
              <tr>
                <td className="p-3 font-bold text-white">1. Hybrid Search</td>
                <td className="p-3">BM25 + Cosine Vector</td>
                <td className="p-3 font-mono text-cyan-300">rank-bm25 + ChromaDB</td>
                <td className="p-3">Exact statutory circular numbers & codes</td>
                <td className="p-3 font-mono text-emerald-400">Fast (15-25ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">2. Metadata-Filtered</td>
                <td className="p-3">Categorical Where Predicates</td>
                <td className="p-3 font-mono text-cyan-300">ChromaDB Filters + Pydantic</td>
                <td className="p-3">Partitioning personal vs mortgage vs auto</td>
                <td className="p-3 font-mono text-emerald-400">Fast (10-20ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">3. Reranking RAG</td>
                <td className="p-3">Bi-Encoder -&gt; Cross-Scorer</td>
                <td className="p-3 font-mono text-cyan-300">Local Cross-Scoring Engine</td>
                <td className="p-3">Distinguishing 1% vs 3% exit penalties</td>
                <td className="p-3 font-mono text-emerald-400">Moderate (20-35ms)</td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-white">4. Contextual Chunking</td>
                <td className="p-3">Hierarchical Breadcrumb AST</td>
                <td className="p-3 font-mono text-cyan-300">Markdown AST + Breadcrumbs</td>
                <td className="p-3">Preventing orphaned clauses and amnesia</td>
                <td className="p-3 font-mono text-emerald-400">Fast (15-25ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">5. SQL + Vector RAG</td>
                <td className="p-3">Relational SQL + Semantic Search</td>
                <td className="p-3 font-mono text-cyan-300">SQLite3 (cbuae_structured.db)</td>
                <td className="p-3">Zero-hallucination math on fee caps</td>
                <td className="p-3 font-mono text-emerald-400">Fast (12-25ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">6. GraphRAG</td>
                <td className="p-3">Multi-Hop Entity Traversal</td>
                <td className="p-3 font-mono text-cyan-300">NetworkX Directed Graph</td>
                <td className="p-3">Disjoint legal entity relationships</td>
                <td className="p-3 font-mono text-emerald-400">Fast (15-30ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">7. Corrective RAG (CRAG)</td>
                <td className="p-3">Quality Evaluator + Rewrite</td>
                <td className="p-3 font-mono text-cyan-300">CBUAE Domain Thesaurus</td>
                <td className="p-3">Self-correcting vague or ambiguous queries</td>
                <td className="p-3 font-mono text-amber-400">Adaptive (25-45ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">8. Self-RAG</td>
                <td className="p-3">Adaptive Tokens ([Retrieve])</td>
                <td className="p-3 font-mono text-cyan-300">Reflection Tokens & Critic</td>
                <td className="p-3">Conversational bypass & citation validation</td>
                <td className="p-3 font-mono text-emerald-400">Ultra-fast (1-20ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">9. Multimodal RAG</td>
                <td className="p-3">Table Grids + Formula AST</td>
                <td className="p-3 font-mono text-cyan-300">Markdown Table AST + LaTeX</td>
                <td className="p-3">43-service retail banking fee schedules</td>
                <td className="p-3 font-mono text-emerald-400">Fast (15-30ms)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">10. Agentic RAG</td>
                <td className="p-3">Autonomous Multi-Tool Agent</td>
                <td className="p-3 font-mono text-cyan-300">LangGraph Tool Controller</td>
                <td className="p-3">End-to-end multi-step compliance audits</td>
                <td className="p-3 font-mono text-cyan-400">Comprehensive (30-60ms)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RAGLearningHub;
