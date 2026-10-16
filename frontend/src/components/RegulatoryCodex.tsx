import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen
} from 'lucide-react';
import { searchCodex } from '../services/api';
import type { SearchResponse } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  citation?: string;
  refusal_triggered?: boolean;
  refusal_category?: string;
  retrieved_chunks?: {
    content: string;
    circular_ref: string;
    article_header: string;
    rrf_score: number;
  }[];
  latency_ms?: number;
}

interface RegulatoryCodexProps {
  initialQuery?: string;
}

const formatCitation = (citation?: string) => {
  if (!citation || citation === 'N/A - Refusal Gate') return 'Autonomous Statutory Guardrail';
  if (citation.toLowerCase().includes('fee_schedule') || citation.toLowerCase().includes('cbuae_standardized')) {
    return 'Circular No. 8/2020: Standardized Schedule of Fee Caps on Banking Services';
  }
  return citation.replace(/\.md$/i, '').replace(/_/g, ' ');
};

export const RegulatoryCodex: React.FC<RegulatoryCodexProps> = ({ initialQuery = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: 'Welcome to the CBUAE Regulatory Codex AI Agent. I am an autonomous banking intelligence assistant grounded strictly on the Central Bank of the United Arab Emirates regulatory corpus, including Circular 8/2020 (Fee Caps), Notice 2011/23 (Debt Burden Ratios), and Circular 31/2013 (Mortgage Regulations).\n\nAsk any question regarding retail credit limits, prepayment penalties, borrower rights, or bank compliance.',
      timestamp: 'Just now',
      citation: 'Central Bank of the United Arab Emirates',
      refusal_triggered: false,
      retrieved_chunks: []
    }
  ]);
  const [inputValue, setInputValue] = useState<string>(initialQuery);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
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
      const response: SearchResponse = await searchCodex(trimmed);
      const agentMsgId = `agent-${Date.now()}`;
      const agentMessage: ChatMessage = {
        id: agentMsgId,
        sender: 'agent',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: response.citation,
        refusal_triggered: response.refusal_triggered,
        refusal_category: response.refusal_category,
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
        id: 'msg-welcome-new',
        sender: 'agent',
        text: 'Session cleared. Ready for your next CBUAE regulatory consultation inquiry.',
        timestamp: 'Just now',
        citation: 'Central Bank of the United Arab Emirates',
        refusal_triggered: false
      }
    ]);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender === 'user' ? 'BORROWER / COMPLIANCE OFFICER' : 'CBUAE CODEX AGENT'}:\n${m.text}\n${
            m.citation ? `Authority: ${formatCitation(m.citation)}\n` : ''
          }------------------------------------------------------------`
      )
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CBUAE_Regulatory_Consultation_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleChunks = (msgId: string) => {
    setExpandedChunks((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const promptSuggestions = [
    { label: '1% Early Settlement Cap', q: 'What is the statutory cap on early settlement prepayment fees in the UAE?' },
    { label: '50% DBR Ceiling', q: 'What is the Debt Burden Ratio (DBR) limit under CBUAE Notice 2011/23?' },
    { label: 'Pensioner 30% Cap', q: 'What is the statutory DBR limit for UAE retirees and pensioners?' },
    { label: 'Mortgage LTV Caps', q: 'What are the maximum mortgage LTV limits for UAE nationals and expatriates?' },
    { label: 'Sanadak Dispute Rights', q: 'How does a borrower file a complaint with Sanadak for unlawful bank fees?' },
    { label: 'Foreign Law Refusal Gate', q: 'What are the UK Financial Conduct Authority (FCA) personal loan rules?' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner (Matching fintechui.jpeg aesthetic) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <Bot className="h-3 w-3" />
              Autonomous Codex Agent
            </span>
            <span className="text-xs text-slate-400 font-medium">Grounded RAG Engine • ChromaDB & BM25</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            CBUAE Regulatory Codex AI Agent
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Direct conversational intelligence grounded strictly on official Central Bank of the UAE regulatory gazettes, statutory fee schedules, and consumer protection mandates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#131b2e] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Clear current session"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={handleExportChat}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#131b2e] hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
            title="Export consultation transcript"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Guidance</span>
          </button>
        </div>
      </div>

      {/* Main Agent Chat Window */}
      <div className="rounded-3xl bg-[#0f172a]/70 border border-slate-800/90 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        
        {/* Chat Stream Area */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isExpanded = !!expandedChunks[msg.id];
            const hasChunks = msg.retrieved_chunks && msg.retrieved_chunks.length > 0;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {/* Agent Avatar */}
                {!isUser && (
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shrink-0 shadow-md shadow-cyan-950/40">
                    <div className="h-full w-full rounded-[14px] bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
                      <Bot className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`space-y-2.5 rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-cyan-950/30'
                      : 'bg-[#131b2e]/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                  }`}
                >
                  {/* Top Bar for Agent Message */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        {msg.refusal_triggered ? (
                          <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <AlertTriangle className="h-3 w-3" />
                            Statutory Guardrail Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="h-3 w-3" />
                            {formatCitation(msg.citation)}
                          </span>
                        )}
                        {msg.latency_ms && (
                          <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
                            ⚡ {msg.latency_ms}ms
                          </span>
                        )}
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans text-slate-100">
                    {msg.text}
                  </div>

                  {/* Refusal Explanatory Banner */}
                  {!isUser && msg.refusal_triggered && (
                    <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                        <span>Jurisdiction & Grounding Notice</span>
                      </div>
                      <p className="text-amber-200/80">
                        The Codex engine automatically rejects queries referencing non-UAE authorities or ungrounded asset domains to guarantee absolute regulatory accuracy.
                      </p>
                    </div>
                  )}

                  {/* Grounded RAG Context Accordion (Shows retrieved ChromaDB excerpts) */}
                  {!isUser && hasChunks && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => toggleChunks(msg.id)}
                        className="flex items-center justify-between w-full py-1.5 px-3 rounded-xl bg-[#0a0f1d] hover:bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-medium transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Grounded RAG Context ({msg.retrieved_chunks?.length} official excerpts)</span>
                        </span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                          {msg.retrieved_chunks?.map((chunk, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#070b14] border border-slate-800/80 text-[11px] space-y-1"
                            >
                              <div className="flex items-center justify-between font-bold text-cyan-300">
                                <span>{formatCitation(chunk.circular_ref)}</span>
                                <span className="text-[10px] font-mono text-slate-400">{chunk.article_header}</span>
                              </div>
                              <p className="text-slate-300 text-[11px] leading-relaxed font-mono line-clamp-4">
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
                    className={`text-[10px] text-right font-mono ${
                      isUser ? 'text-cyan-200' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0 animate-pulse">
                <div className="h-full w-full rounded-[14px] bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-3xl rounded-tl-sm p-4 bg-[#131b2e] border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 shadow-md">
                <div className="flex space-x-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  Searching CBUAE RAG Corpus & Grounding Answer...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts Bar */}
        <div className="px-5 py-2.5 bg-[#0a0f1d]/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            Inquiries:
          </span>
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.q)}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Input Bar */}
        <div className="p-4 bg-[#0a0f1d] border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about CBUAE circulars, fee caps, DBR rules, mortgage LTV, Sanadak disputes..."
                disabled={isLoading}
                className="w-full bg-[#131b2e] border border-slate-800/90 rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <div className="absolute right-3 top-3 text-[10px] font-mono text-slate-500 hidden sm:block">
                Press ↵
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="h-11 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg shadow-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ask Codex</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1">
            <span>Central Bank of the United Arab Emirates (CBUAE) Regulatory RAG Engine</span>
            <span>Zero Hallucination Grounding • Active Statutory Guardrails</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RegulatoryCodex;
