import type {
  HealthStatus,
  ContractScenario,
  AuditResponse,
  DBRCalculationResponse,
  EarlySettlementResponse,
  MortgageLTVResponse,
  SearchResponse,
  RegulationDocument
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch API health');
  return res.json();
}

export async function fetchScenarios(): Promise<ContractScenario[]> {
  const res = await fetch(`${API_BASE}/scenarios`);
  if (!res.ok) throw new Error('Failed to load preset scenarios');
  const data = await res.json();
  return data.scenarios;
}

export async function auditContract(contractText: string, contractTitle?: string): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract_text: contractText, contract_title: contractTitle })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Audit request failed');
  }
  return res.json();
}

export async function exportAuditReport(contractText: string, contractTitle?: string): Promise<{ report_markdown: string; title: string }> {
  const res = await fetch(`${API_BASE}/audit/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract_text: contractText, contract_title: contractTitle })
  });
  if (!res.ok) throw new Error('Failed to export markdown dossier');
  return res.json();
}

export async function calculateDBR(params: {
  gross_salary: number;
  personal_emi?: number;
  auto_emi?: number;
  mortgage_emi?: number;
  credit_card_limits?: number;
  other_debt_obligations?: number;
  is_pensioner?: boolean;
}): Promise<DBRCalculationResponse> {
  const res = await fetch(`${API_BASE}/calculate/dbr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'DBR calculation error');
  }
  return res.json();
}

export async function calculateEarlySettlement(params: {
  outstanding_principal: number;
  charged_fee_amount: number;
  borrower_name?: string;
  bank_name?: string;
  loan_account_no?: string;
}): Promise<EarlySettlementResponse> {
  const res = await fetch(`${API_BASE}/calculate/early-settlement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Early settlement calculation error');
  }
  return res.json();
}

export async function calculateMortgageLTV(params: {
  property_value: number;
  is_uae_national: boolean;
  is_first_home: boolean;
  is_off_plan?: boolean;
}): Promise<MortgageLTVResponse> {
  const res = await fetch(`${API_BASE}/calculate/mortgage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Mortgage LTV calculation error');
  }
  return res.json();
}

export async function searchCodex(query: string, mode: string = 'agentic'): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, mode })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Search query failed');
  }
  return res.json();
}

export async function sendChatMessage(message: string, mode: string = 'agentic'): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, mode })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Chat query failed');
  }
  return res.json();
}

export async function fetchRAGModes(): Promise<{ modes: import('../types').RAGMode[] }> {
  const res = await fetch(`${API_BASE}/rag/modes`);
  if (!res.ok) throw new Error('Failed to fetch RAG modes');
  return res.json();
}


export async function fetchRegulations(): Promise<{ total_articles: number; documents: RegulationDocument[] }> {
  const res = await fetch(`${API_BASE}/regulations`);
  if (!res.ok) throw new Error('Failed to fetch regulatory articles');
  return res.json();
}

export async function fetchBenchmarks(): Promise<any> {
  const res = await fetch(`${API_BASE}/benchmarks`);
  if (!res.ok) throw new Error('Failed to fetch benchmark data');
  return res.json();
}

export async function fetchLatestEvaluation(): Promise<any> {
  const res = await fetch(`${API_BASE}/evaluations/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest evaluation run from ChromaDB');
  return res.json();
}

export async function fetchEvaluationHistory(): Promise<{ history: any[] }> {
  const res = await fetch(`${API_BASE}/evaluations/history`);
  if (!res.ok) throw new Error('Failed to fetch evaluation history from ChromaDB');
  return res.json();
}

export async function runLiveEvaluation(): Promise<any> {
  const res = await fetch(`${API_BASE}/evaluations/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to execute live RAG evaluation suite');
  return res.json();
}

export interface ServicePing {
  status: 'online' | 'offline' | 'degraded';
  service_name: string;
  latency_ms: number;
  last_checked: string;
  details?: Record<string, any>;
  endpoint?: string;
  port?: number;
  architecture?: string;
}

export interface DiagnosticsPingResponse {
  timestamp: string;
  default_refresh_seconds: number;
  refresh_interval_human: string;
  services: {
    chroma_db: ServicePing;
    chroma_ui: ServicePing;
    langgraph: ServicePing;
  };
}

export async function fetchDiagnosticsPing(): Promise<DiagnosticsPingResponse> {
  const res = await fetch(`${API_BASE}/diagnostics/ping`);
  if (!res.ok) throw new Error('Failed to ping diagnostics infrastructure');
  return res.json();
}

