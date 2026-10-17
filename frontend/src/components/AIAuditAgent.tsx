import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
  X,
  Minus,
  Maximize2,
  Cpu,
  Layers,
  Database,
  Share2,
  RefreshCw
} from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { SearchResponse, RAGTraceStep } from '../types';
import { downloadChatTranscriptWord } from '../utils/reportExport';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  citation?: string;
  refusal_triggered?: boolean;
  refusal_category?: string;
  is_greeting?: boolean;
  rag_mode?: string;
  title?: string;
  tech_stack?: string;
  execution_trace?: RAGTraceStep[];
  reflection_tokens?: Record<string, string>;
  sql_query?: string;
  graph_triplets?: { source: string; target: string; relation: string }[];
  retrieved_chunks?: {
    content: string;
    circular_ref: string;
    article_header: string;
    rrf_score?: number;
  }[];
  latency_ms?: number;
}

interface AIAuditAgentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialQuery?: string;
}

const RAG_MODE_OPTIONS = [
  { id: 'agentic', label: '10. Agentic RAG (Multi-Tool)', badge: 'Recommended', icon: Cpu },
  { id: 'hybrid', label: '1. Hybrid Search (BM25+Dense)', badge: 'RRF Fused', icon: Layers },
  { id: 'metadata', label: '2. Metadata-Filtered RAG', badge: 'ChromaDB', icon: Database },
  { id: 'reranking', label: '3. Reranking RAG', badge: 'Cross-Scorer', icon: RefreshCw },
  { id: 'contextual', label: '4. Contextual Chunking', badge: 'Breadcrumbs', icon: BookOpen },
  { id: 'sql', label: '5. SQL + Vector RAG', badge: 'SQLite3', icon: Database },
  { id: 'graph', label: '6. GraphRAG (NetworkX)', badge: 'Triplets', icon: Share2 },
  { id: 'crag', label: '7. Corrective RAG (CRAG)', badge: 'Self-Correct', icon: RefreshCw },
  { id: 'self_rag', label: '8. Self-RAG', badge: 'Critic Tokens', icon: Sparkles },
  { id: 'multimodal', label: '9. Multimodal (Tables+Math)', badge: 'Grid AST', icon: Layers }
];

const formatCitation = (citation?: string) => {
  if (!citation || citation === 'N/A - Refusal Gate') return 'Autonomous Statutory Guardrail';
  if (citation.toLowerCase().includes('fee_schedule') || citation.toLowerCase().includes('cbuae_standardized')) {
    return 'Circular No. 8/2020: Standardized Schedule of Fee Caps on Banking Services';
  }
  return citation.replace(/\.md$/i, '').replace(/_/g, ' ');
};

export const AIAuditAgent: React.FC<AIAuditAgentProps> = ({
  isOpen,
  setIsOpen,
  initialQuery = ''
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('agentic');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-greeting',
      sender: 'agent',
      text: 'Hello! How can I help you today?\n\nI am your CBUAE Regulatory AI Audit Agent. I specialize in analyzing credit facilities, validating statutory caps (1% early settlement fee cap, 50% DBR limits, mortgage LTV ceilings), and auditing loan agreements against official Central Bank of the UAE circulars.',
      timestamp: 'Just now',
      citation: 'Central Bank of the United Arab Emirates',
      refusal_triggered: false,
      is_greeting: true,
      rag_mode: 'agentic',
      retrieved_chunks: []
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});
  const [expandedTraces, setExpandedTraces] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setIsOpen(true);
      setIsMinimized(false);
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response: SearchResponse = await sendChatMessage(trimmed, selectedMode);
      const agentMsgId = `agent-${Date.now()}`;
      const agentMessage: ChatMessage = {
        id: agentMsgId,
        sender: 'agent',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: response.citation,
        refusal_triggered: response.refusal_triggered,
        refusal_category: response.refusal_category,
        is_greeting: response.is_greeting,
        rag_mode: response.rag_mode || selectedMode,
        title: response.title,
        tech_stack: response.tech_stack,
        execution_trace: response.execution_trace,
        reflection_tokens: response.reflection_tokens,
        sql_query: response.sql_query,
        graph_triplets: response.graph_triplets,
        retrieved_chunks: response.retrieved_chunks,
        latency_ms: response.latency_ms
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `Unable to query CBUAE Codex: ${err.message || 'Network error connecting to RAG service.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        refusal_triggered: true,
        citation: 'Engine Communication Alert'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-greeting-reset',
        sender: 'agent',
        text: 'Hello! How can I help you today?\n\nSession cleared. Ready for your next CBUAE credit facility audit, statutory calculation, or RAG architecture test.',
        timestamp: 'Just now',
        citation: 'Central Bank of the United Arab Emirates',
        refusal_triggered: false,
        is_greeting: true,
        rag_mode: selectedMode
      }
    ]);
  };

  const handleExportChat = () => {
    downloadChatTranscriptWord(messages);
  };

  const toggleChunks = (msgId: string) => {
    setExpandedChunks((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleTrace = (msgId: string) => {
    setExpandedTraces((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const promptSuggestions = [
    { label: 'Say Hello', q: 'Hi, how can you help me today?' },
    { label: '1% Early Exit Cap', q: 'What is the statutory cap on early settlement prepayment fees in the UAE?' },
    { label: '50% DBR Ceiling', q: 'What is the Debt Burden Ratio (DBR) limit under CBUAE Notice 2011/23?' },
    { label: 'Pensioner 30% Cap', q: 'What is the statutory DBR limit for UAE retirees and pensioners?' },
    { label: 'Mortgage LTV Caps', q: 'What are the maximum mortgage LTV limits for UAE nationals and expatriates?' },
    { label: 'Test UK FCA (Refusal)', q: 'What are the mortgage rules under UK FCA regulation?' }
  ];

  const cleanMessageText = (rawText: string): string => {
    if (!rawText) return '';
    return rawText
      .replace(/\*\*REFUSAL TRIGGERED.*?\*\*:\s*/gi, '')
      .replace(/REFUSAL TRIGGERED.*?:/gi, '')
      .replace(/-\s*Exploring our 10 RAG learning architectures\.?(\r?\n|$)/gi, '')
      .trim();
  };

  const renderInline = (inlineText: string) => {
    const parts = inlineText.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={partIdx}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 text-cyan-700 dark:text-cyan-300 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (text: string, isUser: boolean) => {
    if (isUser) {
      return <div className="whitespace-pre-wrap font-sans text-white text-xs leading-relaxed">{text}</div>;
    }

    const cleaned = cleanMessageText(text);
    const paragraphs = cleaned.split('\n\n');

    return (
      <div className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Table rendering check
          if (trimmed.includes('|') && trimmed.includes('\n|')) {
            const rows = trimmed.split('\n').filter(r => r.trim().startsWith('|'));
            if (rows.length > 2) {
              const headers = rows[0].split('|').map(c => c.trim()).filter(Boolean);
              const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
              return (
                <div key={idx} className="my-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] p-1 shadow-inner">
                  <table className="w-full text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-cyan-700 dark:text-cyan-300 font-bold bg-white dark:bg-[#0c1322]">
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-1.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((r, rIdx) => (
                        <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/40">
                          {r.map((c, cIdx) => (
                            <td key={cIdx} className="p-1.5 text-slate-800 dark:text-slate-200">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          // Bullet list check
          if (trimmed.includes('\n- ') || trimmed.includes('\n* ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const lines = trimmed.split('\n');
            const introLines: string[] = [];
            const listItems: string[] = [];

            for (const line of lines) {
              const lTrim = line.trim();
              if (lTrim.startsWith('- ') || lTrim.startsWith('* ')) {
                listItems.push(lTrim.replace(/^[-*]\s+/, ''));
              } else if (lTrim) {
                introLines.push(lTrim);
              }
            }

            return (
              <div key={idx} className="space-y-1.5">
                {introLines.map((intro, iIdx) => (
                  <p key={iIdx} className="leading-relaxed">
                    {renderInline(intro)}
                  </p>
                ))}
                <ul className="space-y-1 pl-1 my-1">
                  {listItems.map((item, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="flex-1">{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          // Formula block check
          if (trimmed.startsWith('`DBR') || (trimmed.startsWith('`') && trimmed.endsWith('`'))) {
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-[#0a0f1d] border border-cyan-200 dark:border-cyan-500/30 font-mono text-[11px] text-cyan-800 dark:text-cyan-300 overflow-x-auto shadow-inner"
              >
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-sans font-bold mb-1">
                  Statutory Regulatory Formula
                </div>
                <div>{trimmed.replace(/^`|`$/g, '')}</div>
              </div>
            );
          }

          // Section header check e.g. #### Section 7.1: The 50% Rule
          if (trimmed.startsWith('####') || trimmed.startsWith('###')) {
            const headerText = trimmed.replace(/^#+\s*/, '');
            return (
              <div key={idx} className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 pt-1 text-cyan-700 dark:text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 shrink-0" />
                <span>{headerText}</span>
              </div>
            );
          }

          // Compliance note check
          if (trimmed.startsWith('**Compliance Mandate:**') || trimmed.startsWith('**Statutory Compliance Note:**')) {
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40 text-[11px] text-cyan-900 dark:text-cyan-300 leading-normal"
              >
                <strong className="text-slate-900 dark:text-white block mb-0.5">Statutory Compliance Note:</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {trimmed.replace(/\*\*.*?\*\*/, '').trim()}
                </span>
              </div>
            );
          }

          // Standard paragraph with bold and code formatting
          return (
            <p key={idx} className="leading-relaxed">
              {renderInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* FLOATING CHATBOT LAUNCHER (Right Bottom) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Open CBUAE AI Audit Agent"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
            </span>
            <Bot className="h-5 w-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">AI Audit Agent</span>
          </button>
        )}
      </div>

      {/* FLOATING MINIMIZED CHATBOT BAR (Right Bottom) */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl bg-white dark:bg-[#0f172a] border border-cyan-500/40 shadow-2xl flex items-center justify-between p-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 cursor-pointer flex-1 select-none group"
            title="Click to maximize chat"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <div className="h-full w-full rounded-[10px] bg-slate-50 dark:bg-[#0a0f1d] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Bot className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  AI Compliance Agent
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Minimized · Click to expand</div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsMinimized(false)}
              className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Maximize chat"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setIsMinimized(false);
                setIsOpen(false);
              }}
              className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING EXPANDED CHATBOT WINDOW (Right Bottom) */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-[460px] max-w-[calc(100vw-32px)] h-[660px] max-h-[88vh] rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header Bar */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/90 bg-slate-50 dark:bg-[#0a0f1d] flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-950/20 dark:shadow-cyan-950/40">
                  <div className="h-full w-full rounded-[14px] bg-white dark:bg-[#0a0f1d] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Bot className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">AI Compliance Agent</h3>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">100% Free & Open-Source Stack</div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="h-8 w-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleExportChat}
                  className="h-8 w-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center justify-center transition-colors cursor-pointer"
                  title="Export guidance transcript as Word document (.doc)"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Minimize chat"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsMinimized(false);
                    setIsOpen(false);
                  }}
                  className="h-8 w-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* RAG Mode Selector Pill Row */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/60">
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Cpu className="h-2.5 w-2.5 text-cyan-600 dark:text-cyan-400" />
                RAG Mode:
              </span>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="flex-1 text-[10px] font-mono bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-800 dark:text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {RAG_MODE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-slate-50/70 dark:bg-[#0a0f1d]/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isExpandedChunks = !!expandedChunks[msg.id];
              const isExpandedTrace = !!expandedTraces[msg.id];
              const hasChunks = msg.retrieved_chunks && msg.retrieved_chunks.length > 0;
              const hasTrace = msg.execution_trace && msg.execution_trace.length > 0;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[95%] ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  {/* Agent Avatar */}
                  {!isUser && (
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0 shadow-sm">
                      <div className="h-full w-full rounded-[10px] bg-white dark:bg-[#0a0f1d] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`space-y-2 rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-cyan-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {/* Top Bar for Agent Messages */}
                    {!isUser && !msg.refusal_triggered && (
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {msg.is_greeting ? (
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              Conversational Agent
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1 truncate max-w-[180px]">
                              <ShieldCheck className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{formatCitation(msg.citation)}</span>
                            </span>
                          )}

                          {msg.rag_mode && !msg.is_greeting && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 text-cyan-800 dark:text-cyan-300 text-[9px] font-mono">
                              {msg.rag_mode.toUpperCase()}
                            </span>
                          )}

                          {msg.latency_ms && (
                            <span className="text-slate-400 font-mono text-[9px]">
                              ⚡{msg.latency_ms}ms
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyText(msg.id, cleanMessageText(msg.text))}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Message Body */}
                    {renderFormattedContent(msg.text, isUser)}

                    {/* RAG Execution Trace Accordion */}
                    {!isUser && hasTrace && !msg.refusal_triggered && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          onClick={() => toggleTrace(msg.id)}
                          className="flex items-center justify-between w-full py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#0a0f1d] dark:hover:bg-slate-900 border border-slate-200 dark:border-cyan-900/40 text-[10px] text-cyan-700 dark:text-cyan-300 font-medium transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <Cpu className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                            <span>RAG Execution Trace ({msg.execution_trace?.length} steps)</span>
                          </span>
                          {isExpandedTrace ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {isExpandedTrace && (
                          <div className="mt-1.5 p-2 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-cyan-900/40 text-[10px] space-y-2 animate-in fade-in duration-150">
                            {msg.tech_stack && (
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono border-b border-slate-200 dark:border-slate-800 pb-1">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">Stack:</span> {msg.tech_stack}
                              </div>
                            )}
                            <div className="space-y-1.5">
                              {msg.execution_trace?.map((stepItem, sIdx) => (
                                <div key={sIdx} className="p-1.5 rounded-lg bg-white dark:bg-[#0e1629] border border-slate-200 dark:border-slate-800/70 text-[10px]">
                                  <div className="font-bold text-cyan-700 dark:text-cyan-200 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                    <span>{stepItem.step}</span>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-300 text-[9px] mt-0.5 leading-relaxed font-mono">
                                    {stepItem.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Grounded RAG Excerpts Drawer */}
                    {!isUser && hasChunks && !msg.refusal_triggered && (
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          onClick={() => toggleChunks(msg.id)}
                          className="flex items-center justify-between w-full py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#0a0f1d] dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                            <span>Grounded Excerpts ({msg.retrieved_chunks?.length})</span>
                          </span>
                          {isExpandedChunks ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {isExpandedChunks && (
                          <div className="mt-1.5 space-y-1.5 animate-in fade-in duration-150">
                            {msg.retrieved_chunks?.map((chunk, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800/80 text-[10px] space-y-0.5"
                              >
                                <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center justify-between">
                                  <span>{formatCitation(chunk.circular_ref)}</span>
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-[9px] font-mono">{chunk.article_header}</div>
                                <p className="text-slate-600 dark:text-slate-300 text-[10px] leading-relaxed font-mono line-clamp-3">
                                  {chunk.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`text-[9px] text-right font-mono ${
                        isUser ? 'text-cyan-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0 animate-pulse">
                  <div className="h-full w-full rounded-[10px] bg-white dark:bg-[#0a0f1d] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="rounded-2xl rounded-tl-sm p-3 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm">
                  <div className="flex space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                    Executing {selectedMode.toUpperCase()} RAG architecture...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiry Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-cyan-600 dark:text-cyan-400" />
              Quick:
            </span>
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-all cursor-pointer disabled:opacity-40 shrink-0 shadow-xs"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-50 dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CBUAE compliance question or test RAG..."
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xs"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="h-9 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-400 dark:text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-3 w-3" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default AIAuditAgent;
