import React from 'react';
import { Award, Flame, GitCompare, CheckCircle2, AlertOctagon, Wrench, ExternalLink, Sparkles } from 'lucide-react';
import { SolutionRanking, Solution } from '../../types';
import { CircularScore } from '../common/CircularScore';

interface SolutionRankingsCardProps {
  rankings: SolutionRanking[];
  selectedSolutionId?: string;
  onSelectSolution: (sol: Solution) => void;
  onRoastSolution: (sol: Solution) => void;
  onFixSolution: (sol: Solution) => void;
  onToggleCompare: (solutionId: string) => void;
  comparedIds: string[];
}

export const SolutionRankingsCard: React.FC<SolutionRankingsCardProps> = ({
  rankings,
  selectedSolutionId,
  onSelectSolution,
  onRoastSolution,
  onFixSolution,
  onToggleCompare,
  comparedIds
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Section B: Validated Solution Rankings</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Ranked deterministically by 8 weighted investment factors against real TinyFish web evidence
          </p>
        </div>

        <span className="text-xs font-mono text-zinc-400">
          Showing {rankings.length} generated candidates
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rankings.map((item) => {
          const isSelected = selectedSolutionId === item.solution.id;
          const isCompared = comparedIds.includes(item.solution.id);
          const isTopRank = item.rank === 1;

          return (
            <div
              key={item.solution.id}
              className={`terminal-card p-5 transition-all relative ${
                isTopRank
                  ? 'border-emerald-500/40 bg-[#121824] shadow-glow-sm'
                  : 'border-[#232936] bg-[#12161f] hover:border-[#353e52]'
              } ${isSelected ? 'ring-1 ring-emerald-500' : ''}`}
            >
              {isTopRank && (
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow-glow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>#1 Top Investment Pick</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Score & Rank Indicator */}
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-zinc-500 mb-1">
                      RANK #{item.rank}
                    </span>
                    <CircularScore score={item.score} size={84} strokeWidth={6} label="IdeaScore" />
                  </div>
                </div>

                {/* Solution Summary & Core Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {item.solution.name}
                    </h4>

                    {item.solution.version > 1 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        v{item.solution.version} Improved
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c2230] text-zinc-300 border border-[#2b3548]">
                      Confidence: {item.confidence_level}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      TinyFish: {item.research_status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {item.solution.short_description}
                  </p>

                  <div className="text-[11px] text-zinc-400 font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      <strong className="text-zinc-300">Model:</strong> {item.solution.possible_revenue_model}
                    </span>
                    <span>
                      <strong className="text-zinc-300">UVP:</strong> {item.solution.unique_value_proposition}
                    </span>
                  </div>

                  {/* Strengths & Weaknesses Snippet */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    <div className="flex items-start space-x-1.5 text-xs text-emerald-300 bg-emerald-950/20 px-2.5 py-1.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="truncate">{item.top_strengths[0] || 'Strong market fit'}</span>
                    </div>

                    <div className="flex items-start space-x-1.5 text-xs text-rose-300 bg-rose-950/20 px-2.5 py-1.5 rounded border border-rose-500/20">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="truncate">{item.biggest_weakness || 'Market adoption challenge'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Roast, Compare, Deep Dive */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  {/* Roast My Idea Button */}
                  <button
                    onClick={() => onRoastSolution(item.solution)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 hover:text-white hover:from-amber-600 hover:to-rose-600 border border-amber-500/40 shadow-sm transition-all"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Roast My Idea</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Compare Checkbox */}
                    <button
                      onClick={() => onToggleCompare(item.solution.id)}
                      className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                        isCompared
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-[#181d28] text-zinc-400 border-[#283144] hover:text-zinc-200'
                      }`}
                    >
                      <GitCompare className="w-3 h-3" />
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => onSelectSolution(item.solution)}
                      className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[#1a2130] hover:bg-[#232c3f] text-emerald-400 border border-emerald-500/30 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

