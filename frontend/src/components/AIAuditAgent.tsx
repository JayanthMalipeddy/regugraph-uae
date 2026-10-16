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
  BookOpen,
  X
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

interface AIAuditAgentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialQuery?: string;
}

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-greeting',
      sender: 'agent',
      text: 'Hi, how can I help you today?\n\nI am your CBUAE Regulatory AI Audit Agent. I analyze credit facilities, calculate statutory caps (1% early settlement fee cap, 50% DBR limits, mortgage LTV ceilings), and verify compliance against official Central Bank of the UAE circulars.',
      timestamp: 'Just now',
      citation: 'Central Bank of the United Arab Emirates',
      refusal_triggered: false,
      retrieved_chunks: []
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});
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

  // When initialQuery changes and is not empty, auto-send
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
        id: 'msg-greeting-reset',
        sender: 'agent',
        text: 'Hi, how can I help you today?\n\nSession cleared. Ready for your next CBUAE credit facility audit or statutory compliance question.',
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
          `[${m.timestamp}] ${m.sender === 'user' ? 'BORROWER / COMPLIANCE OFFICER' : 'CBUAE AUDIT AGENT'}:\n${m.text}\n${
            m.citation ? `Authority: ${formatCitation(m.citation)}\n` : ''
          }------------------------------------------------------------`
      )
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CBUAE_Audit_Agent_Consultation_${Date.now()}.md`;
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
    { label: 'Sanadak Dispute Filing', q: 'How does a borrower file a complaint with Sanadak for unlawful bank fees?' }
  ];

  const renderFormattedContent = (text: string, isUser: boolean) => {
    if (isUser) {
      return <div className="whitespace-pre-wrap font-sans text-white text-xs leading-relaxed">{text}</div>;
    }

    const paragraphs = text.split('\n\n');

    return (
      <div className="space-y-2.5 text-xs text-slate-100 font-sans leading-relaxed">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Formula block check
          if (trimmed.startsWith('`DBR') || (trimmed.startsWith('`') && trimmed.endsWith('`'))) {
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#0a0f1d] border border-cyan-500/30 font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-inner"
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
              <div key={idx} className="font-bold text-white text-xs flex items-center gap-1.5 pt-1 text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{headerText}</span>
              </div>
            );
          }

          // Statutory note check
          if (trimmed.startsWith('**Statutory Compliance Note:**')) {
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-300 leading-normal"
              >
                <strong className="text-white block mb-0.5">Statutory Compliance Note:</strong>
                <span className="text-slate-300">
                  {trimmed.replace('**Statutory Compliance Note:**', '').trim()}
                </span>
              </div>
            );
          }

          // Standard paragraph with bold and code formatting
          const parts = trimmed.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
          return (
            <p key={idx} className="leading-relaxed">
              {parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={partIdx} className="font-bold text-white">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={partIdx}
                      className="px-1.5 py-0.5 rounded-md bg-[#0a0f1d] border border-slate-800 text-cyan-300 font-mono text-[11px]"
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING CHATBOT LAUNCHER (Right Bottom)                     */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
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

      {/* ============================================================ */}
      {/* FLOATING EXPANDED CHATBOT WINDOW (Right Bottom)              */}
      {/* ============================================================ */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[430px] max-w-[calc(100vw-32px)] h-[620px] max-h-[85vh] rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header Bar */}
          <div className="h-16 px-5 border-b border-slate-800/90 bg-[#0a0f1d] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-950/40">
                <div className="h-full w-full rounded-[14px] bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">AI Audit Agent</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">CBUAE RAG Grounded • 8081</div>
              </div>
            </div>

            {/* Header Tools */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="h-8 w-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleExportChat}
                className="h-8 w-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Export guidance transcript"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-[#0a0f1d]/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isExpanded = !!expandedChunks[msg.id];
              const hasChunks = msg.retrieved_chunks && msg.retrieved_chunks.length > 0;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[92%] ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  {/* Agent Icon */}
                  {!isUser && (
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0 shadow-sm">
                      <div className="h-full w-full rounded-[10px] bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`space-y-2 rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-[#131b2e] border border-slate-800/90 text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {/* Top Bar for Agent */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {msg.refusal_triggered ? (
                            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Guardrail Active
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 truncate max-w-[200px]">
                              <ShieldCheck className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{formatCitation(msg.citation)}</span>
                            </span>
                          )}
                          {msg.latency_ms && (
                            <span className="text-slate-500 font-mono text-[9px]">
                              ⚡{msg.latency_ms}ms
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Message Body */}
                    {renderFormattedContent(msg.text, isUser)}

                    {/* Refusal Notice */}
                    {!isUser && msg.refusal_triggered && (
                      <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-300">
                        Central Bank of the UAE regulatory scope strictly enforced. Non-UAE or ungrounded queries are rejected to prevent hallucinations.
                      </div>
                    )}

                    {/* Grounded RAG Context Drawer */}
                    {!isUser && hasChunks && (
                      <div className="pt-1.5 border-t border-slate-800/80">
                        <button
                          onClick={() => toggleChunks(msg.id)}
                          className="flex items-center justify-between w-full py-1 px-2 rounded-lg bg-[#0a0f1d] hover:bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-medium transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-cyan-400" />
                            <span>Grounded Excerpts ({msg.retrieved_chunks?.length})</span>
                          </span>
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 space-y-1.5 animate-in fade-in duration-150">
                            {msg.retrieved_chunks?.map((chunk, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-[#070b14] border border-slate-800/80 text-[10px] space-y-0.5"
                              >
                                <div className="font-bold text-cyan-300 flex items-center justify-between">
                                  <span>{formatCitation(chunk.circular_ref)}</span>
                                </div>
                                <div className="text-slate-400 text-[9px] font-mono">{chunk.article_header}</div>
                                <p className="text-slate-300 text-[10px] leading-relaxed font-mono line-clamp-3">
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
                        isUser ? 'text-cyan-200' : 'text-slate-500'
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
                  <div className="h-full w-full rounded-[10px] bg-[#0a0f1d] flex items-center justify-center text-cyan-400">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="rounded-2xl rounded-tl-sm p-3 bg-[#131b2e] border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Grounding with CBUAE regulations...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiry Chips */}
          <div className="px-3 py-2 bg-[#0a0f1d] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
              Quick:
            </span>
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer disabled:opacity-40 shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0a0f1d] border-t border-slate-800">
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
                placeholder="Ask CBUAE audit question..."
                disabled={isLoading}
                className="flex-1 bg-[#131b2e] border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="h-9 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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
