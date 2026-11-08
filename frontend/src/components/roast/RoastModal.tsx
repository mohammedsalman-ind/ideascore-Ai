import React, { useState } from 'react';
import {
  Flame, X, AlertTriangle, ShieldAlert, CheckCircle2, Wrench,
  ThumbsDown, Sparkles, Scale, RefreshCw, Loader2
} from 'lucide-react';
import { CombinedRoastReport, Solution } from '../../types';
import { CircularScore } from '../common/CircularScore';

interface RoastModalProps {
  roast: CombinedRoastReport | null;
  solution: Solution | null;
  isOpen: boolean;
  onClose: () => void;
  onFixMyIdea: (solution: Solution) => void;
  isLoading: boolean;
}

export const RoastModal: React.FC<RoastModalProps> = ({
  roast,
  solution,
  isOpen,
  onClose,
  onFixMyIdea,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'combined' | 'groq' | 'gemini'>('combined');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f131c] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[#232936] bg-gradient-to-r from-amber-950/30 via-[#131722] to-rose-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow-sm">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Multi-Model Idea Roast</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Groq &times; Gemini
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate max-w-md">
                Deconstructing: <strong className="text-zinc-200">{solution?.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {solution && roast && !isLoading && (
              <button
                onClick={() => onFixMyIdea(solution)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-sm transition-all cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Fix My Idea</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 mx-auto text-amber-400 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Roasting in Parallel with Groq & Gemini...</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Groq (Llama 3.3) is finding startup failure scenarios while Gemini analyzes strategic unit economics.
                </p>
              </div>
            </div>
          ) : roast ? (
            <>
              {/* Verdict & Reality Check Score Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-gradient-to-r from-[#17131b] via-[#151a24] to-[#1a1215] border border-amber-500/30">
                <div className="md:col-span-3 flex justify-center border-b md:border-b-0 md:border-r border-[#2a2b38] pb-4 md:pb-0 md:pr-4">
                  <CircularScore
                    score={roast.reality_check_score}
                    size={96}
                    strokeWidth={7}
                    label="Reality Check"
                    subtext="Weakness Severity"
                  />
                </div>

                <div className="md:col-span-9 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      Brutal Consensus Verdict
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    &ldquo;{roast.brutal_verdict}&rdquo;
                  </p>
                  <div className="text-xs text-rose-300/90 pt-1 flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Biggest Vulnerability:</strong> {roast.biggest_weakness}</span>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex border-b border-[#232936] text-xs font-mono">
                <button
                  onClick={() => setActiveTab('combined')}
                  className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${activeTab === 'combined'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Combined Report
                </button>
                <button
                  onClick={() => setActiveTab('groq')}
                  className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${activeTab === 'groq'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Groq (Brutally Honest Critic)
                </button>
                <button
                  onClick={() => setActiveTab('gemini')}
                  className={`pb-2.5 px-4 font-semibold border-b-2 transition-all ${activeTab === 'gemini'
                      ? 'border-blue-400 text-blue-300'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Gemini (Strategic Critic)
                </button>
              </div>

              {/* Tab 1: Combined Report */}
              {activeTab === 'combined' && (
                <div className="space-y-5">
                  {/* Top 5 Reasons This Idea Could Fail */}
                  <div className="p-4 rounded-xl bg-[#0c0e14] border border-rose-500/20 space-y-2.5">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-400" />
                      Top 5 Reasons This Idea Could Fail
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {roast.top_five_failure_reasons.map((f, i) => (
                        <div key={i} className="p-2.5 rounded bg-[#131722] border border-[#232a3a] text-zinc-300 flex items-start space-x-2">
                          <span className="font-mono text-rose-400 font-bold shrink-0">{i + 1}.</span>
                          <span className="leading-relaxed">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unrealistic Assumptions vs Market Problems */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#121620] border border-[#202737] space-y-2">
                      <h5 className="font-bold text-amber-400 font-mono text-[11px] uppercase tracking-wider">
                        Unrealistic Assumptions
                      </h5>
                      <ul className="space-y-1.5 text-zinc-300">
                        {roast.unrealistic_assumptions.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-amber-400 mr-2">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#121620] border border-[#202737] space-y-2">
                      <h5 className="font-bold text-rose-400 font-mono text-[11px] uppercase tracking-wider">
                        Monetization & Commercial Obstacles
                      </h5>
                      <ul className="space-y-1.5 text-zinc-300">
                        {roast.monetization_concerns.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-rose-400 mr-2">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Multi-Model Consensus: Agreement vs Disagreement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#0f1715] border border-emerald-500/20 space-y-2">
                      <h5 className="font-bold text-emerald-400 font-mono text-[11px] uppercase tracking-wider flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                        Where Groq & Gemini Agree
                      </h5>
                      <ul className="space-y-1.5 text-zinc-300">
                        {roast.points_of_agreement.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-emerald-400 mr-2">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#16141c] border border-purple-500/20 space-y-2">
                      <h5 className="font-bold text-purple-400 font-mono text-[11px] uppercase tracking-wider flex items-center">
                        <Scale className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                        Where Models Disagree
                      </h5>
                      <ul className="space-y-1.5 text-zinc-300">
                        {roast.points_of_disagreement.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-400 mr-2">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* What Needs To Change + Actionable Next Steps */}
                  <div className="p-4 rounded-xl bg-[#0d1017] border border-emerald-500/30 space-y-2.5">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Venture Advisory: What Needs To Change
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {roast.what_needs_to_change.map((c, i) => (
                        <div key={i} className="p-2.5 rounded bg-[#131926] border border-[#232f46] text-zinc-200">
                          <span className="font-mono text-emerald-400 font-bold block mb-1">Pivot #{i + 1}</span>
                          <span className="text-[11px] leading-relaxed">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Groq Detail */}
              {activeTab === 'groq' && roast.groq_critique && (
                <div className="p-5 rounded-xl bg-[#0e121a] border border-amber-500/30 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white text-sm">Groq ({roast.groq_critique.model_name}) Verdict</span>
                    <span className="font-mono text-[10px] text-amber-400">Brutally Honest Critic</span>
                  </div>
                  <p className="text-sm italic text-amber-200 font-medium">
                    &ldquo;{roast.groq_critique.verdict}&rdquo;
                  </p>
                  <div>
                    <h6 className="font-mono uppercase text-zinc-400 font-bold mb-2">Sharp Critique Points:</h6>
                    <ul className="space-y-2 text-zinc-300">
                      {roast.groq_critique.critique_points.map((p, i) => (
                        <li key={i} className="p-2 rounded bg-[#141822] border border-[#232936]">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Gemini Detail */}
              {activeTab === 'gemini' && roast.gemini_critique && (
                <div className="p-5 rounded-xl bg-[#0e121a] border border-blue-500/30 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white text-sm">Gemini Strategic Review</span>
                    <span className="font-mono text-[10px] text-blue-400">Strategic Venture Risk</span>
                  </div>
                  <p className="text-sm italic text-blue-200 font-medium">
                    &ldquo;{roast.gemini_critique.verdict}&rdquo;
                  </p>
                  <div>
                    <h6 className="font-mono uppercase text-zinc-400 font-bold mb-2">Venture & Commercial Gaps:</h6>
                    <ul className="space-y-2 text-zinc-300">
                      {roast.gemini_critique.critique_points.map((p, i) => (
                        <li key={i} className="p-2 rounded bg-[#141822] border border-[#232936]">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-[#232936] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  Ready to turn this critique into an upgraded startup concept?
                </span>

                {solution && (
                  <button
                    onClick={() => onFixMyIdea(solution)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-md transition-all cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Run &ldquo;Fix My Idea&rdquo; Engine</span>
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

