import {
  ProblemInput, AnalysisJob, CombinedRoastReport, ImprovedSolution,
  ComparisonReport, MarketGapItem, FeasibilityReport, BusinessModelOption,
  SWOTReport, CustomerValidationReport, SharkTankMessage, SettingsStatus
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

export const api = {
  // Analysis
  async startAnalysis(input: ProblemInput): Promise<{ analysis_id: string; stage: string; status_message: string }> {
    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`Failed to start analysis: ${res.statusText}`);
    return res.json();
  },

  async getAnalysis(id: string): Promise<AnalysisJob> {
    const res = await fetch(`${API_BASE}/analysis/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch analysis: ${res.statusText}`);
    return res.json();
  },

  async getHistory(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analysis/history`);
    if (!res.ok) return [];
    return res.json();
  },

  async retryAnalysis(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/analysis/${id}/retry`, { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to retry: ${res.statusText}`);
    return res.json();
  },

  // Comparison
  async compareSolutions(solutionIds: string[]): Promise<ComparisonReport> {
    const res = await fetch(`${API_BASE}/solutions/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_ids: solutionIds })
    });
    if (!res.ok) throw new Error(`Comparison failed: ${res.statusText}`);
    return res.json();
  },

  // Roast My Idea (Groq + Gemini multi-model)
  async roastSolution(solutionId: string): Promise<CombinedRoastReport> {
    const res = await fetch(`${API_BASE}/solutions/${solutionId}/roast`, { method: 'POST' });
    if (!res.ok) throw new Error(`Roast failed: ${res.statusText}`);
    return res.json();
  },

  async getRoast(solutionId: string): Promise<CombinedRoastReport> {
    const res = await fetch(`${API_BASE}/solutions/${solutionId}/roast`);
    if (!res.ok) throw new Error(`Get roast failed: ${res.statusText}`);
    return res.json();
  },

  // Fix My Idea (Improvement Engine)
  async fixSolution(solutionId: string): Promise<ImprovedSolution> {
    const res = await fetch(`${API_BASE}/solutions/${solutionId}/improve`, { method: 'POST' });
    if (!res.ok) throw new Error(`Fix failed: ${res.statusText}`);
    return res.json();
  },

  async getVersions(solutionId: string): Promise<ImprovedSolution[]> {
    const res = await fetch(`${API_BASE}/solutions/${solutionId}/versions`);
    if (!res.ok) return [];
    return res.json();
  },

  // Reports
  getPdfReportUrl(analysisId: string): string {
    return `${API_BASE}/reports/${analysisId}/pdf`;
  },

  // Intelligence Modules
  async getMarketGaps(solutionId: string): Promise<MarketGapItem[]> {
    const res = await fetch(`${API_BASE}/modules/market-gaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_id: solutionId })
    });
    if (!res.ok) throw new Error('Market gaps failed');
    return res.json();
  },

  async getFeasibility(solutionId: string): Promise<FeasibilityReport> {
    const res = await fetch(`${API_BASE}/modules/feasibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_id: solutionId })
    });
    if (!res.ok) throw new Error('Feasibility failed');
    return res.json();
  },

  async getBusinessModels(solutionId: string): Promise<BusinessModelOption[]> {
    const res = await fetch(`${API_BASE}/modules/business-models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_id: solutionId })
    });
    if (!res.ok) throw new Error('Business models failed');
    return res.json();
  },

  async getSWOT(solutionId: string): Promise<SWOTReport> {
    const res = await fetch(`${API_BASE}/modules/swot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_id: solutionId })
    });
    if (!res.ok) throw new Error('SWOT failed');
    return res.json();
  },

  async getCustomerValidation(solutionId: string): Promise<CustomerValidationReport> {
    const res = await fetch(`${API_BASE}/modules/customer-validation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solution_id: solutionId })
    });
    if (!res.ok) throw new Error('Customer validation failed');
    return res.json();
  },

  async pitchSharkTank(solutionId: string, pitchMessage?: string, history?: any[]): Promise<SharkTankMessage[]> {
    const res = await fetch(`${API_BASE}/modules/shark-tank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        solution_id: solutionId,
        user_pitch_message: pitchMessage,
        conversation_history: history
      })
    });
    if (!res.ok) throw new Error('Shark Tank pitch failed');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SettingsStatus> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Settings check failed');
    return res.json();
  },

  async updateSettings(payload: any): Promise<SettingsStatus> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Update settings failed');
    return res.json();
  }
};

