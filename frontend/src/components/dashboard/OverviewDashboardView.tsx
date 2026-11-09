import React from 'react';
import { Target, Lightbulb, Globe, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle, Sparkles, BarChart3, Layers } from 'lucide-react';
import { AnalysisJob, Solution } from '../../types';
import { ProblemOverviewCard } from './ProblemOverviewCard';
import { SolutionRankingsCard } from './SolutionRankingsCard';
import { FinalRecommendationCard } from './FinalRecommendationCard';

interface OverviewDashboardViewProps {
  analysis: AnalysisJob | null;
  onNavigateToJudge: () => void;
  onSelectSolution: (sol: Solution) => void;
  selectedSolution: Solution | null;
  onRoastSolution: (sol: Solution) => void;
  onFixSolution: (sol: Solution) => void;
  onToggleCompare: (solutionId: string) => void;
  comparedIds: string[];
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  analysis,
  onNavigateToJudge,
  onSelectSolution,
  selectedSolution,
  onRoastSolution,
  onFixSolution,
  onToggleCompare,
  comparedIds
}) => {
  // Empty State if no analysis has been performed yet
  if (!analysis || !analysis.problem_understanding) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-md">
          <Lightbulb className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            Welcome to IdeaScore AI
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
            Start by submitting your idea to receive a complete AI-powered judgment.
          </p>
        </div>
        <div>
          <button
            onClick={onNavigateToJudge}
            className="px-6 py-3.5 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black inline-flex items-center space-x-2 shadow-glow-md transition-all cursor-pointer"
          >
            <span>Judge My Idea</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    );
  }

  const topRanking = analysis.rankings && analysis.rankings.length > 0 ? analysis.rankings[0] : null;
  const currentSol = selectedSolution || (topRanking ? topRanking.solution : analysis.solutions[0]);
  const currentEval = currentSol ? analysis.evaluations[currentSol.id] : null;
  const currentResearch = currentSol ? analysis.research_data[currentSol.id] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Submitted Idea Summary */}
      <div className="terminal-card p-6 border border-emerald-500/30 bg-gradient-to-r from-[#101722] via-[#0d131d] to-[#0c1017] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Validation
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Domain: {analysis.problem_understanding.industry_domain}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            &ldquo;{analysis.problem_input.problem_text}&rdquo;
          </h2>
          <p className="text-xs text-zinc-400">
            {analysis.problem_understanding.problem_summary}
          </p>
        </div>

        {topRanking && (
          <div className="shrink-0 text-right p-3 rounded-lg bg-[#0e141f] border border-emerald-500/20">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Top Candidate Score</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {topRanking.score.toFixed(1)}
              <span className="text-xs text-zinc-500 ml-1">/100</span>
            </span>
            <span className="text-[10px] text-zinc-400 block truncate max-w-[150px]">
              {topRanking.solution.name}
            </span>
          </div>
        )}
      </div>

      {/* Section A: Problem Overview */}
      <ProblemOverviewCard
        originalProblem={analysis.problem_input.problem_text}
        understanding={analysis.problem_understanding}
      />

      {/* Section B: Solution Rankings */}
      <SolutionRankingsCard
        rankings={analysis.rankings}
        selectedSolutionId={currentSol?.id}
        onSelectSolution={(sol) => onSelectSolution(sol)}
        onRoastSolution={onRoastSolution}
        onFixSolution={onFixSolution}
        onToggleCompare={onToggleCompare}
        comparedIds={comparedIds}
      />

      {/* Market Competitors & Gaps Preview */}
      {currentResearch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
            <h5 className="font-bold text-white font-mono text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center text-emerald-400">
                <Layers className="w-4 h-4 mr-1.5" />
                Existing Market Products ({currentResearch.competitors.length})
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">TinyFish Crawl</span>
            </h5>
            <div className="space-y-2">
              {currentResearch.competitors.slice(0, 3).map((comp, i) => (
                <div key={i} className="p-2.5 rounded bg-[#0d1017] border border-[#1f2533] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-200">{comp.name}</span>
                    <span className="text-[11px] text-zinc-400 block truncate max-w-sm">{comp.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-2">{comp.pricing_model || 'Free'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
            <h5 className="font-bold text-white font-mono text-xs uppercase tracking-wider flex items-center text-blue-400">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Market Opportunities & Gaps
            </h5>
            <ul className="space-y-2 text-xs text-zinc-300">
              {currentResearch.identified_market_gaps.slice(0, 3).map((gap, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-400 mr-2 font-bold">&bull;</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Final Recommendation Card */}
      {analysis.final_recommendation && (
        <FinalRecommendationCard
          recommendation={analysis.final_recommendation}
        />
      )}
    </div>
  );
};
