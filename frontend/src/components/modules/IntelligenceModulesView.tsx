import React, { useState } from 'react';
import {
  Cpu, Target, Wrench, DollarSign, Shield, Users,
  Send, Bot, Sparkles, Loader2, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import {
  Solution, MarketGapItem, FeasibilityReport, BusinessModelOption,
  SWOTReport, CustomerValidationReport, SharkTankMessage
} from '../../types';
import { api } from '../../services/api';

interface IntelligenceModulesViewProps {
  solutions: Solution[];
}

export const IntelligenceModulesView: React.FC<IntelligenceModulesViewProps> = ({
  solutions
}) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(solutions[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'gaps' | 'feasibility' | 'business' | 'swot' | 'validation' | 'shark_tank'>('gaps');

  // Module states
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<MarketGapItem[] | null>(null);
  const [feasibility, setFeasibility] = useState<FeasibilityReport | null>(null);
  const [businessModels, setBusinessModels] = useState<BusinessModelOption[] | null>(null);
  const [swot, setSwot] = useState<SWOTReport | null>(null);
  const [validation, setValidation] = useState<CustomerValidationReport | null>(null);

  // Shark Tank State
  const [sharkMessages, setSharkMessages] = useState<SharkTankMessage[]>([]);
  const [userPitch, setUserPitch] = useState('');
  const [sharkLoading, setSharkLoading] = useState(false);

  const selectedSolution = solutions.find(s => s.id === selectedSolutionId) || solutions[0];

  const handleFetchModuleData = async (tab: string, solId: string) => {
    setLoading(true);
    try {
      if (tab === 'gaps') {
        const res = await api.getMarketGaps(solId);
        setGaps(res);
      } else if (tab === 'feasibility') {
        const res = await api.getFeasibility(solId);
        setFeasibility(res);
      } else if (tab === 'business') {
        const res = await api.getBusinessModels(solId);
        setBusinessModels(res);
      } else if (tab === 'swot') {
        const res = await api.getSWOT(solId);
        setSwot(res);
      } else if (tab === 'validation') {
        const res = await api.getCustomerValidation(solId);
        setValidation(res);
      } else if (tab === 'shark_tank' && sharkMessages.length === 0) {
        setSharkLoading(true);
        const res = await api.pitchSharkTank(solId);
        setSharkMessages(res);
        setSharkLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTab = (tab: any) => {
    setActiveTab(tab);
    handleFetchModuleData(tab, selectedSolutionId);
  };

  const handleSelectSolution = (solId: string) => {
    setSelectedSolutionId(solId);
    setSharkMessages([]);
    handleFetchModuleData(activeTab, solId);
  };

  const handleSendSharkPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPitch.trim() || sharkLoading) return;

    const currentPitch = userPitch.trim();
    setUserPitch('');

    const newMsgList: SharkTankMessage[] = [
      ...sharkMessages,
      {
        sender: 'You (Founder)',
        avatar_color: '#10b981',
        text: currentPitch,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setSharkMessages(newMsgList);
    setSharkLoading(true);

    try {
      const responses = await api.pitchSharkTank(selectedSolutionId, currentPitch);
      setSharkMessages([...newMsgList, ...responses]);
    } catch (err) {
      console.error(err);
    } finally {
      setSharkLoading(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    if (solutions.length > 0 && selectedSolutionId) {
      handleFetchModuleData(activeTab, selectedSolutionId);
    }
  }, [selectedSolutionId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Controls: Solution Selector & Modules Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Advanced Startup Intelligence Modules</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Deep-dive modules for market gaps, engineering feasibility, business models, SWOT, validation, and AI Shark Tank
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400">Target Idea:</span>
          <select
            value={selectedSolutionId}
            onChange={(e) => handleSelectSolution(e.target.value)}
            className="rounded bg-[#121620] border border-[#232936] text-white text-xs px-3 py-1.5 focus:border-emerald-500 font-semibold"
          >
            {solutions.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#212735] pb-3 text-xs font-mono">
        {[
          { id: 'gaps', label: '1. Market Gap Finder', icon: Target },
          { id: 'feasibility', label: '2. Feasibility Analyzer', icon: Wrench },
          { id: 'business', label: '3. Business Models', icon: DollarSign },
          { id: 'swot', label: '4. SWOT Analysis', icon: Shield },
          { id: 'validation', label: '5. Customer Validation', icon: Users },
          { id: 'shark_tank', label: '6. AI Shark Tank', icon: Bot },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-glow-sm'
                  : 'bg-[#121620] text-zinc-400 hover:text-zinc-200 border border-[#212735]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Module Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-400">Loading module intelligence...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Market Gaps */}
          {activeTab === 'gaps' && gaps && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gaps.map((gap, i) => (
                <div key={i} className="terminal-card p-5 border border-[#232936] bg-[#121620] rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Unaddressed White Space #{i+1}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-2">{gap.gap_title}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">{gap.market_gap}</p>
                    
                    <div className="p-2.5 rounded bg-[#0c0f15] border border-[#1f2636] text-[11px] text-zinc-400 space-y-1">
                      <div><strong className="text-zinc-300">Customer Frustration:</strong> {gap.customer_pain_point}</div>
                      <div><strong className="text-emerald-400">Opportunity:</strong> {gap.opportunity_description}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1e2536] text-[11px] text-emerald-300 font-mono">
                    <strong>Winning Wedge:</strong> {gap.possible_differentiation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Feasibility */}
          {activeTab === 'feasibility' && feasibility && (
            <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#212735]">
                <div>
                  <h3 className="text-base font-bold text-white">Technical Feasibility & Scope</h3>
                  <p className="text-xs text-zinc-400">Engineering blueprint for delivering MVP</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1c2230] text-zinc-300 border border-[#2b3548]">
                    Complexity: <strong className="text-emerald-400">{feasibility.development_complexity}</strong>
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Effort: {feasibility.approximate_effort_weeks}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-[#0e121a] border border-[#202737] space-y-2">
                  <h5 className="font-mono text-zinc-400 uppercase font-bold text-[11px]">Recommended Tech Stack:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {feasibility.technology_stack.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#181f2c] border border-[#2b3548] text-zinc-300 font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0e121a] border border-[#202737] space-y-2">
                  <h5 className="font-mono text-zinc-400 uppercase font-bold text-[11px]">Required Engineering Skills:</h5>
                  <ul className="space-y-1 text-zinc-300">
                    {feasibility.required_skills.map((s, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#0d1017] border border-emerald-500/20 text-xs">
                <span className="font-mono text-emerald-400 uppercase font-bold text-[10px] block mb-1">
                  Architectural Advisory Note:
                </span>
                <p className="text-zinc-300 leading-relaxed">{feasibility.feasibility_notes}</p>
              </div>
            </div>
          )}

          {/* 3. Business Models */}
          {activeTab === 'business' && businessModels && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessModels.map((bm, i) => (
                <div key={i} className={`terminal-card p-5 border rounded-xl space-y-3 ${
                  bm.recommended ? 'border-emerald-500/40 bg-[#101824]' : 'border-[#232936] bg-[#121620]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{bm.model_type}</span>
                    {bm.recommended && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-black">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono text-emerald-300 bg-[#0d1017] p-2 rounded border border-[#202736]">
                    <strong>Pricing:</strong> {bm.pricing_structure}
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-zinc-300"><strong className="text-emerald-400">Why it works:</strong> {bm.why_it_works}</p>
                    <p className="text-zinc-400"><strong className="text-rose-400">Why it might fail:</strong> {bm.why_it_might_fail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. SWOT */}
          {activeTab === 'swot' && swot && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="terminal-card p-5 border border-emerald-500/25 bg-[#0f1715] rounded-xl space-y-2">
                <h4 className="font-mono font-bold uppercase text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Strengths
                </h4>
                <ul className="space-y-1.5 text-zinc-300">
                  {swot.strengths.map((s, i) => (
                    <li key={i}>&bull; {s}</li>
                  ))}
                </ul>
              </div>

              <div className="terminal-card p-5 border border-rose-500/25 bg-[#171114] rounded-xl space-y-2">
                <h4 className="font-mono font-bold uppercase text-rose-400 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5" /> Weaknesses
                </h4>
                <ul className="space-y-1.5 text-zinc-300">
                  {swot.weaknesses.map((w, i) => (
                    <li key={i}>&bull; {w}</li>
                  ))}
                </ul>
              </div>

              <div className="terminal-card p-5 border border-blue-500/25 bg-[#0f1422] rounded-xl space-y-2">
                <h4 className="font-mono font-bold uppercase text-blue-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Opportunities
                </h4>
                <ul className="space-y-1.5 text-zinc-300">
                  {swot.opportunities.map((o, i) => (
                    <li key={i}>&bull; {o}</li>
                  ))}
                </ul>
              </div>

              <div className="terminal-card p-5 border border-amber-500/25 bg-[#17140f] rounded-xl space-y-2">
                <h4 className="font-mono font-bold uppercase text-amber-400 flex items-center">
                  <Shield className="w-4 h-4 mr-1.5" /> Threats
                </h4>
                <ul className="space-y-1.5 text-zinc-300">
                  {swot.threats.map((t, i) => (
                    <li key={i}>&bull; {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 5. Customer Validation */}
          {activeTab === 'validation' && validation && (
            <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-5 text-xs">
              <div>
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2">
                  5 Mom Test Interview Questions (Non-leading discovery)
                </h4>
                <div className="space-y-1.5">
                  {validation.interview_questions.map((q, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#0d1017] border border-[#1f2533] text-zinc-200">
                      <strong className="text-emerald-400 font-mono">Q{i+1}: </strong>
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-blue-400 uppercase mb-2">
                  Low-Cost Smoke Tests & Validation Experiments
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {validation.validation_experiments.map((exp, i) => (
                    <div key={i} className="p-3 rounded bg-[#0e121a] border border-[#202736] text-zinc-300">
                      <span className="font-mono text-blue-400 font-bold block mb-1">Experiment #{i+1}</span>
                      <p className="text-[11px] leading-relaxed">{exp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. AI Shark Tank Interactive Interrogation */}
          {activeTab === 'shark_tank' && (
            <div className="terminal-card border border-[#232936] bg-[#121620] rounded-xl flex flex-col h-[520px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-[#212735] bg-[#0c0f15] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Shark Tank: Pitch The Investors</h4>
                    <p className="text-[10px] text-zinc-400 font-mono">Elena Vance (SaaS Partner) &bull; Marcus Reed (Product Purist)</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Simulation
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {sharkMessages.map((msg, i) => {
                  const isUser = msg.sender.startsWith('You');
                  return (
                    <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-mono text-zinc-500 mb-1">
                        {msg.sender} &bull; {msg.timestamp}
                      </span>
                      <div className={`p-3 rounded-xl max-w-xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-br-none'
                          : 'bg-[#181d28] border border-[#283244] text-zinc-200 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {sharkLoading && (
                  <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Investors are deliberating on your answer...</span>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendSharkPitch} className="p-3 border-t border-[#212735] bg-[#0c0f15] flex items-center space-x-2 shrink-0">
                <input
                  type="text"
                  value={userPitch}
                  onChange={(e) => setUserPitch(e.target.value)}
                  placeholder="Answer the sharks or defend your business model..."
                  disabled={sharkLoading}
                  className="flex-1 rounded-lg bg-[#141822] border border-[#232936] text-white text-xs px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!userPitch.trim() || sharkLoading}
                  className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

