import React from 'react';
import { Sparkles, Eye, Flame, Wrench, GitCompare, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Solution, EvaluationResult, ResearchResult } from '../../types';

interface SolutionsSuggestionsViewProps {
  solutions: Solution[];
  evaluations: Record<string, EvaluationResult>;
  researchData: Record<string, ResearchResult>;
  onSelectSolution: (sol: Solution) => void;
  onRoastSolution: (sol: Solution) => void;
  onFixSolution: (sol: Solution) => void;
  onCompareWithExisting?: (sol: Solution) => void;
}

export const SolutionsSuggestionsView: React.FC<SolutionsSuggestionsViewProps> = ({
  solutions,
  evaluations,
  researchData,
  onSelectSolution,
  onRoastSolution,
  onFixSolution,
  onCompareWithExisting
}) => {
  if (!solutions || solutions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Solutions Generated Yet</h3>
        <p className="text-xs text-zinc-400">Submit your idea in "Judge Idea" to get 3-5 AI-generated solutions and strategic suggestions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-[#212735] space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-1 shadow-glow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Strategic Innovation & Solution Matrix</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Solutions & AI Improvement Suggestions
        </h2>
        <p className="text-xs text-zinc-400">
          Distinct product architectures generated from your idea, with strategic refinements, technology stacks, and critical actions.
        </p>
      </div>

      {/* Solutions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {solutions.map((sol, index) => {
          const evalResult = evaluations[sol.id];
          const score = evalResult ? evalResult.weighted_score : null;

          return (
            <div
              key={sol.id}
              className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-all shadow-lg"
            >
              <div className="space-y-4">
                {/* Title & Score Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 inline-block mb-1">
                      Concept #{index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{sol.name}</h3>
                  </div>

                  {score !== null && (
                    <div className="text-right shrink-0">
                      <span className="text-lg font-mono font-extrabold text-emerald-400">{score.toFixed(1)}</span>
                      <span className="text-[10px] text-zinc-500 font-mono block">/ 100</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {sol.short_description}
                </p>

                {/* Unique Value Proposition */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block">
                    Unique Value Proposition
                  </span>
                  <p className="text-zinc-200">{sol.unique_value_proposition}</p>
                </div>

                {/* Target Audience & Revenue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-[#0d1017] border border-[#1f2533]">
                    <span className="text-zinc-500 block text-[10px]">Target Audience</span>
                    <span className="text-zinc-200 truncate block">{sol.target_users.join(', ')}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#0d1017] border border-[#1f2533]">
                    <span className="text-zinc-500 block text-[10px]">Revenue Model</span>
                    <span className="text-emerald-400 truncate block">{sol.possible_revenue_model}</span>
                  </div>
                </div>

                {/* Tech Stack Chips */}
                {sol.required_technology && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sol.required_technology.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161d2a] text-zinc-300 border border-[#242f44]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#1e2535] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => onSelectSolution(sol)}
                  className="px-2.5 py-2 rounded-lg bg-[#1a2130] hover:bg-[#232d42] text-zinc-200 border border-[#2c3750] flex items-center justify-center space-x-1.5 transition-colors font-medium"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Details</span>
                </button>

                <button
                  onClick={() => onRoastSolution(sol)}
                  className="px-2.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition-colors font-medium"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Roast</span>
                </button>

                <button
                  onClick={() => onFixSolution(sol)}
                  className="px-2.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center space-x-1.5 transition-colors font-medium"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Improve</span>
                </button>

                {onCompareWithExisting && (
                  <button
                    onClick={() => onCompareWithExisting(sol)}
                    className="px-2.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center space-x-1.5 transition-colors font-medium"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-blue-400" />
                    <span>Compare</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
