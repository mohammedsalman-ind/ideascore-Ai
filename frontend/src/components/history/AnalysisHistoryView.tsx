import React from 'react';
import { History, ArrowRight, Lightbulb, Clock, CheckCircle } from 'lucide-react';
import { CircularScore } from '../common/CircularScore';

interface AnalysisHistoryItem {
  id: string;
  problem_summary: string;
  original_problem: string;
  solution_count: number;
  top_solution_name: string;
  top_solution_score: number;
  created_at: string;
  stage: string;
}

interface AnalysisHistoryViewProps {
  history: AnalysisHistoryItem[];
  onOpenAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  history,
  onOpenAnalysis,
  onNewAnalysis
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#212735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Analysis Archive & History</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Past problem validations, market evidence reports, and solution rankings
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-sm"
        >
          New Validation
        </button>
      </div>

      {history.length === 0 ? (
        <div className="terminal-card p-12 text-center rounded-xl border border-[#212735] space-y-3">
          <Lightbulb className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Previous Analyses Yet</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Submit any problem on the New Analysis page to start your first market research validation.
          </p>
          <button
            onClick={onNewAnalysis}
            className="mt-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-black shadow-glow-sm"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {history.map((item) => (
            <div
              key={item.id}
              className="terminal-card p-4 rounded-xl border border-[#232936] bg-[#121620] hover:border-emerald-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.stage.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight truncate">
                  &ldquo;{item.problem_summary}&rdquo;
                </h4>

                <div className="text-xs text-zinc-400 flex items-center space-x-4">
                  <span>Solutions: <strong className="text-zinc-200">{item.solution_count}</strong></span>
                  <span>Top Pick: <strong className="text-emerald-300">{item.top_solution_name}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-zinc-500 font-mono block">Top Score</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {item.top_solution_score ? item.top_solution_score.toFixed(1) : '--'}
                  </span>
                </div>

                <button
                  onClick={() => onOpenAnalysis(item.id)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#1a2130] hover:bg-[#232c3f] text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <span>Open Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

