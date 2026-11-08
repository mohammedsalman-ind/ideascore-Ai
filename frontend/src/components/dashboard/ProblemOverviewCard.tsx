import React from 'react';
import { Target, AlertTriangle, Users, Briefcase, Zap, CheckCircle } from 'lucide-react';
import { ProblemUnderstanding } from '../../types';

interface ProblemOverviewCardProps {
  originalProblem: string;
  understanding: ProblemUnderstanding;
}

export const ProblemOverviewCard: React.FC<ProblemOverviewCardProps> = ({
  originalProblem,
  understanding
}) => {
  return (
    <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-[#212735] gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Section A: Problem Understanding</h3>
            <p className="text-xs text-zinc-400">AI-extracted root causes, affected personas, and market severity</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
            {understanding.industry_domain}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {understanding.severity_frequency}
          </span>
        </div>
      </div>

      {/* Raw Submitted Problem vs AI Problem Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="p-4 rounded-lg bg-[#0c0e14] border border-[#1f2533]">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase block mb-1.5">
            Original User Submission
          </span>
          <p className="text-sm text-zinc-200 italic leading-relaxed">
            "{originalProblem}"
          </p>
        </div>

        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400 uppercase block mb-1.5 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" />
            Synthesized Problem Statement
          </span>
          <p className="text-sm text-zinc-100 font-medium leading-relaxed">
            {understanding.problem_summary}
          </p>
        </div>
      </div>

      {/* Deep-dive Badges: Root Causes, Target Users, Pain Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Root Causes */}
        <div className="p-3.5 rounded-lg bg-[#151a24] border border-[#232936]">
          <div className="flex items-center space-x-2 text-zinc-300 font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Root Causes</span>
          </div>
          <ul className="space-y-1.5 text-zinc-400">
            {understanding.root_causes.map((c, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-emerald-500 mr-1.5 font-bold">&bull;</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Affected Users */}
        <div className="p-3.5 rounded-lg bg-[#151a24] border border-[#232936]">
          <div className="flex items-center space-x-2 text-zinc-300 font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Personas</span>
          </div>
          <ul className="space-y-1.5 text-zinc-400">
            {understanding.target_user_groups.map((u, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-400 mr-1.5 font-bold">&bull;</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Pain Points */}
        <div className="p-3.5 rounded-lg bg-[#151a24] border border-[#232936]">
          <div className="flex items-center space-x-2 text-zinc-300 font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Primary Pain Points</span>
          </div>
          <ul className="space-y-1.5 text-zinc-400">
            {understanding.pain_points.slice(0, 3).map((p, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-rose-400 mr-1.5 font-bold">&bull;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

