import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { searchCodex, fetchRegulations } from '../services/api';
import type { SearchResponse, RegulationDocument } from '../types';

const formatRef = (ref: string) => {
  if (!ref) return 'CBUAE Regulation';
  if (ref.toLowerCase().includes('fee_schedule') || ref.toLowerCase().includes('cbuae_standardized')) {
    return 'CBUAE Standardized Retail Fee Schedule';
  }
  return ref.replace(/\.md$/i, '').replace(/_/g, ' ');
};

export const RegulatoryCodex: React.FC = () => {
  const [query, setQuery] = useState<string>('What is the statutory cap on early settlement prepayment fees?');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [regulations, setRegulations] = useState<RegulationDocument[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<RegulationDocument | null>(null);

  // Load indexed corpus on mount
  useEffect(() => {
    fetchRegulations()
      .then((data) => {
        setRegulations(data.documents);
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
      })
      .catch(console.error);

    // Initial search
    handleSearch('What is the statutory cap on early settlement prepayment fees?');
  }, []);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchCodex(q);
      setSearchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const sampleQueries = [
    { label: '1% Early Settlement Cap', q: 'What is the maximum early settlement fee for personal loans in UAE?' },
    { label: '50% DBR Ceiling', q: 'What is the Debt Burden Ratio (DBR) limit under Notice 2011/23?' },
    { label: 'Pensioner 30% Cap', q: 'What is the maximum DBR allowed for retirees and pensioners in the UAE?' },
    { label: 'Mortgage LTV Limits', q: 'What are the maximum LTV limits for UAE nationals and expatriates?' },
    { label: 'UK FCA Refusal Gate', q: 'What are the UK Financial Conduct Authority (FCA) rules on personal loans?' },
    { label: 'Crypto Domain Refusal', q: 'Does CBUAE regulate cryptocurrency staking and decentralized yield?' },
  ];

  const filteredDocs = regulations.filter((d) =>
    d.article_header.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    d.circular_ref.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    d.full_content.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Central Bank of the UAE Regulatory Codex
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grounded Hybrid Regulatory Search & Codex
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Query official CBUAE retail credit regulations with hybrid dense vector retrieval and BM25 lexical search.
            Equipped with autonomous foreign-jurisdiction and ungrounded topic refusal gates.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search CBUAE regulations, fee caps, DBR rules, mortgage LTV..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSearching ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Search Codex</span>
              </>
            )}
          </button>
        </form>

        {/* Quick query pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] text-slate-400 py-1">Quick Inquiries:</span>
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.q);
                handleSearch(item.q);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Card */}
      {searchResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  searchResult.refusal_triggered
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {searchResult.refusal_triggered
                  ? `Autonomous Refusal Gate: ${searchResult.refusal_category}`
                  : 'Grounded Statutory Synthesis'}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" /> {searchResult.latency_ms} ms
              </span>
            </div>
            {!searchResult.refusal_triggered && (
              <span className="text-xs font-mono font-semibold text-emerald-400">
                Official Citation: {searchResult.citation}
              </span>
            )}
          </div>

          <div
            className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm ${
              searchResult.refusal_triggered
                ? 'bg-amber-950/20 border-amber-900/40 text-amber-200 font-medium'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}
          >
            {searchResult.answer}
          </div>

          {/* Retrieved Context Chunks */}
          {searchResult.retrieved_chunks && searchResult.retrieved_chunks.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-teal-400" />
                Retrieved Regulatory Chunks (Rank-Fused RRF k=60)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {searchResult.retrieved_chunks.map((chunk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-emerald-400">{formatRef(chunk.circular_ref)}</span>
                      <span className="font-mono text-slate-500">RRF: {chunk.rrf_score}</span>
                    </div>
                    <div className="font-bold text-white text-[11px] line-clamp-1">
                      {chunk.article_header}
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CBUAE Regulations Corpus Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              Indexed CBUAE Regulatory Corpus ({regulations.length} Articles)
            </h2>
            <p className="text-xs text-slate-400">
              ChromaDB vector store collection synchronized with rank-BM25 sparse index.
            </p>
          </div>
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Filter articles..."
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Master-Detail Corpus View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Article List (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/50 border border-slate-800 p-3 space-y-2 max-h-[500px] overflow-y-auto">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/20'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-400">{formatRef(doc.circular_ref)}</span>
                    <span className="font-mono text-slate-500">{doc.token_count} words</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{doc.article_header}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {doc.content_preview}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Article Full Detail View (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between">
            {selectedDoc ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                    {formatRef(selectedDoc.circular_ref)}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedDoc.article_header}
                  </h3>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-[380px] overflow-y-auto select-all">
                  {selectedDoc.full_content}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500 py-16">
                Select an article on the left to read statutory provisions.
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Governing Authority: Central Bank of the UAE</span>
              <span>Jurisdiction: United Arab Emirates (Federal)</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
