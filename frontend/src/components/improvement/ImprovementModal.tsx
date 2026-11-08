import React from 'react';
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, History, Award } from 'lucide-react';
import { ImprovedSolution, Solution } from '../../types';
import { CircularScore } from '../common/CircularScore';

interface ImprovementModalProps {
  improved: ImprovedSolution | null;
  originalSolution: Solution | null;
  isOpen: boolean;
  onClose: () => void;
  versionHistory: ImprovedSolution[];
  isLoading: boolean;
}

export const ImprovementModal: React.FC<ImprovementModalProps> = ({
  improved,
  originalSolution,
  isOpen,
  onClose,
  versionHistory,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f131c] border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 border-b border-[#232936] bg-gradient-to-r from-emerald-950/30 via-[#131722] to-teal-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Fix My Idea &mdash; Turnaround Engine</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Version {improved?.version || 2}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Pivoted from weaknesses identified in the multi-model roast
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <h4 className="text-base font-bold text-white">Re-engineering Startup Concept with Gemini...</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Addressing weak assumptions, restructuring unit economics, and calculating new deterministic scores.
              </p>
            </div>
          ) : improved ? (
            <>
              {/* Score Delta Comparison Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 rounded-xl bg-gradient-to-r from-[#101924] to-[#0e1620] border border-emerald-500/30">
                <div className="md:col-span-5 flex items-center justify-center space-x-6 border-b md:border-b-0 md:border-r border-[#21293a] pb-4 md:pb-0 md:pr-6">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Original Score</span>
                    <CircularScore score={improved.original_score} size={76} strokeWidth={5} label="" />
                  </div>

                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500 text-black mt-1 shadow-glow-sm">
                      +{improved.score_delta > 0 ? improved.score_delta.toFixed(1) : 0} PTS
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">Upgraded Score</span>
                    <CircularScore score={improved.improved_score} size={76} strokeWidth={5} label="" />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    Turnaround Evolution
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {improved.name}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {improved.short_description}
                  </p>
                </div>
              </div>

              {/* Changes Made & Upgraded UVP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0c1017] border border-emerald-500/20 space-y-2">
                  <h5 className="font-bold text-emerald-400 font-mono text-[11px] uppercase tracking-wider flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Strategic Changes Made
                  </h5>
                  <ul className="space-y-1.5 text-zinc-300">
                    {improved.changes_made.map((change, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-emerald-400 mr-2 font-bold">&bull;</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0e121a] border border-[#202737] space-y-2">
                  <h5 className="font-bold text-zinc-300 font-mono text-[11px] uppercase tracking-wider flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    Defensible Value Proposition
                  </h5>
                  <p className="text-zinc-200 leading-relaxed text-xs">
                    {improved.unique_value_proposition}
                  </p>
                  <div className="pt-2 border-t border-[#1e2536] text-[11px] text-zinc-400">
                    <strong className="text-zinc-200">Revised Monetization:</strong> {improved.revised_revenue_model}
                  </div>
                </div>
              </div>

              {/* Revised Features List */}
              <div className="p-4 rounded-xl bg-[#0d1017] border border-[#1f2738] space-y-2">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Updated Feature Set
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {improved.core_features.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-[#131824] border border-[#232c3f] text-zinc-200 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version History Footer */}
              {versionHistory.length > 0 && (
                <div className="pt-3 border-t border-[#232936] text-xs">
                  <span className="font-mono text-zinc-500 uppercase text-[10px] block mb-2 flex items-center">
                    <History className="w-3 h-3 mr-1" />
                    Idea Iteration History ({versionHistory.length} versions)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {versionHistory.map((v, idx) => (
                      <div key={idx} className="px-2.5 py-1 rounded bg-[#141822] border border-[#232936] text-[11px] text-zinc-300 flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-400">v{v.version}</span>
                        <span className="text-zinc-400 truncate max-w-[140px]">{v.name}</span>
                        <span className="text-zinc-500 font-mono">({v.improved_score.toFixed(1)}/100)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

