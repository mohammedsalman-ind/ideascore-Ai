import React from 'react';
import { X, Flame, Wrench, Bot, Cpu, CheckCircle2, AlertTriangle, Layers, DollarSign, Users, Sparkles } from 'lucide-react';
import { Solution, EvaluationResult, ResearchResult } from '../../types';
import { CircularScore } from '../common/CircularScore';

interface SolutionDetailModalProps {
  solution: Solution | null;
  evaluation?: EvaluationResult;
  research?: ResearchResult;
  isOpen: boolean;
  onClose: () => void;
  onRoast: (sol: Solution) => void;
  onFix: (sol: Solution) => void;
  onOpenSharkTank: (sol: Solution) => void;
}

export const SolutionDetailModal: React.FC<SolutionDetailModalProps> = ({
  solution,
  evaluation,
  research,
  isOpen,
  onClose,
  onRoast,
  onFix,
  onOpenSharkTank
}) => {
  if (!isOpen || !solution) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0e121a] border border-[#232936] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#212735] bg-[#121622] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{solution.name}</h3>
                {solution.version > 1 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    v{solution.version} Improved
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate max-w-lg">{solution.short_description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRoast(solution)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Roast</span>
            </button>

            <button
              onClick={() => onFix(solution)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-sm transition-all cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Fix My Idea</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Banner with Score and UVP */}
          <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1f2638] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Unique Value Proposition
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                &ldquo;{solution.unique_value_proposition}&rdquo;
              </p>
              <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1 pt-1 font-mono">
                <span><strong>Monetization:</strong> {solution.possible_revenue_model}</span>
                <span><strong>Target Users:</strong> {solution.target_users.join(', ')}</span>
              </div>
            </div>

            {evaluation && (
              <div className="shrink-0 flex items-center space-x-3 border-t md:border-t-0 md:border-l border-[#202737] pt-3 md:pt-0 md:pl-4">
                <CircularScore score={evaluation.weighted_score} size={80} strokeWidth={6} label="IdeaScore" />
              </div>
            )}
          </div>

          {/* How It Works & System Flow */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              How It Works & User Journey Flow
            </h4>
            <div className="p-4 rounded-xl bg-[#121620] border border-[#212735] text-xs text-zinc-300 leading-relaxed">
              {solution.how_it_works}
            </div>
          </div>

          {/* Core Features & Required Tech */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121620] border border-[#212735] space-y-2">
              <h4 className="font-mono font-bold uppercase text-zinc-400 text-[11px] flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Core Features
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {solution.core_features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">&bull;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#121620] border border-[#212735] space-y-2">
              <h4 className="font-mono font-bold uppercase text-zinc-400 text-[11px] flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Required Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {solution.required_technology.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#181f2c] border border-[#293346] text-zinc-200 font-mono text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Assumptions & Potential Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121620] border border-[#212735] space-y-2">
              <h4 className="font-mono font-bold uppercase text-amber-400 text-[11px] flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Core Assumptions to Validate
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {solution.main_assumptions.map((a, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-amber-400 mr-2">&bull;</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#121620] border border-[#212735] space-y-2">
              <h4 className="font-mono font-bold uppercase text-rose-400 text-[11px] flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Potential Execution Challenges
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {solution.potential_challenges.map((c, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-rose-400 mr-2">&bull;</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#212735]">
            <span className="text-[11px] font-mono text-zinc-400">
              Ready to test this solution in our simulation engines?
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSharkTank(solution);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a2130] hover:bg-[#232c3f] text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Pitch to Shark Tank</span>
              </button>

              <button
                onClick={() => onRoast(solution)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 transition-all"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Roast My Idea</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

