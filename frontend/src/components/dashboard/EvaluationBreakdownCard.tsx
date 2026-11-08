import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { BarChart3, PieChart, ShieldCheck, Calculator } from 'lucide-react';
import { EvaluationResult } from '../../types';
import { CircularScore } from '../common/CircularScore';

interface EvaluationBreakdownCardProps {
  evaluation: EvaluationResult;
  solutionName: string;
}

export const EvaluationBreakdownCard: React.FC<EvaluationBreakdownCardProps> = ({
  evaluation,
  solutionName
}) => {
  const f = evaluation.factor_scores;

  const factorData = [
    { factor: 'Problem Sig.', fullTitle: 'Problem Significance', score: f.problem_significance, weight: '15%' },
    { factor: 'Market Pot.', fullTitle: 'Market Potential', score: f.market_potential, weight: '15%' },
    { factor: 'Innovation', fullTitle: 'Innovation', score: f.innovation, weight: '15%' },
    { factor: 'Tech Feas.', fullTitle: 'Technical Feasibility', score: f.technical_feasibility, weight: '15%' },
    { factor: 'Scalability', fullTitle: 'Scalability', score: f.scalability, weight: '10%' },
    { factor: 'Revenue Pot.', fullTitle: 'Revenue Potential', score: f.revenue_potential, weight: '15%' },
    { factor: 'Comp. Pos.', fullTitle: 'Competitive Positioning', score: f.competitive_positioning, weight: '10%' },
    { factor: 'Social Imp.', fullTitle: 'Social Impact', score: f.social_impact, weight: '5%' },
  ];

  const radarData = factorData.map(d => ({
    subject: d.factor,
    score: d.score,
    fullMark: 100
  }));

  return (
    <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Section D: Deterministic Evaluation Breakdown</h3>
            <p className="text-xs text-zinc-400">
              Evaluated for: <strong className="text-emerald-300">{solutionName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#1c2230] text-zinc-300 border border-[#2b3548]">
            Coverage: {evaluation.research_coverage}
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
            Score: {evaluation.weighted_score.toFixed(1)} / 100
          </span>
        </div>
      </div>

      {/* Main Grid: Visuals and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart (4 cols) */}
        <div className="lg:col-span-5 h-[270px] flex items-center justify-center bg-[#0c0f15] rounded-xl border border-[#1e2534] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#232936" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#232936" tick={{ fill: '#6e7681', fontSize: 9 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Factors Breakdown Table & Weighted Math (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {factorData.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#0d1017] border border-[#1f2533] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-200">{item.fullTitle}</div>
                  <span className="text-[10px] text-zinc-500 font-mono">Weight: {item.weight}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {item.score.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono block">/ 100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Deterministic Formula Explanation Banner */}
          <div className="p-3 rounded-lg bg-[#0e131d] border border-emerald-500/20 text-xs flex items-start space-x-2.5 text-zinc-300">
            <Calculator className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-emerald-400">Deterministic Weighted Backend Formula:</strong>{' '}
              Weighted Score = &sum;(Factor Score &times; Weight). LLM overall hallucinated scores are rejected in favor of verified mathematical weights.
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Explanation */}
      <div className="p-4 rounded-lg bg-[#0c0f15] border border-[#1f2635] text-xs space-y-2">
        <h5 className="font-bold text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
          Evaluation Rationale & Market Thesis
        </h5>
        <p className="text-zinc-300 leading-relaxed">
          {evaluation.evaluation_explanation}
        </p>
      </div>
    </div>
  );
};

