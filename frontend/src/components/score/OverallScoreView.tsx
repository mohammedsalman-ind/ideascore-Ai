import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ShieldCheck, BarChart3, AlertTriangle, CheckCircle2, TrendingUp, Award, HelpCircle } from 'lucide-react';
import { Solution, EvaluationResult, ResearchResult } from '../../types';

interface OverallScoreViewProps {
  solutions: Solution[];
  evaluations: Record<string, EvaluationResult>;
  researchData: Record<string, ResearchResult>;
  selectedSolutionId?: string;
  onSelectSolution: (sol: Solution) => void;
}

export const OverallScoreView: React.FC<OverallScoreViewProps> = ({
  solutions,
  evaluations,
  researchData,
  selectedSolutionId,
  onSelectSolution
}) => {
  const currentSolution = solutions.find(s => s.id === selectedSolutionId) || solutions[0];
  const evalResult = currentSolution ? evaluations[currentSolution.id] : null;
  const research = currentSolution ? researchData[currentSolution.id] : null;

  if (!solutions || solutions.length === 0 || !evalResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Evaluation Scores Yet</h3>
        <p className="text-xs text-zinc-400">Submit your idea in "Judge Idea" to view weighted scoring, radar charts, and risk breakdown.</p>
      </div>
    );
  }

  const f = evalResult.factor_scores;
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

  // Verdict calculation
  const getVerdict = (score: number) => {
    if (score >= 80) return { label: 'Strong Potential', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 70) return { label: 'Promising but Needs Improvement', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (score >= 60) return { label: 'Weak Differentiation', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (score >= 50) return { label: 'High Risk', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    return { label: 'Not Recommended Yet', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const verdict = getVerdict(evalResult.weighted_score);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-1 shadow-glow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deterministic Scoring Algorithm</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Overall Idea & Solution Judgment
          </h2>
          <p className="text-xs text-zinc-400">
            Weighted multicriteria evaluation across 8 dimensions calculated strictly in backend logic.
          </p>
        </div>

        {/* Solution Selector */}
        <div className="flex flex-wrap gap-2">
          {solutions.map((sol) => {
            const isSelected = sol.id === currentSolution?.id;
            return (
              <button
                key={sol.id}
                onClick={() => onSelectSolution(sol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                    : 'bg-[#141923] text-zinc-400 border border-[#212735] hover:text-white hover:bg-[#1a2230]'
                }`}
              >
                {sol.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-mono uppercase text-zinc-400">Weighted Venture Score</span>
          
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center shadow-glow-md">
              <span className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {evalResult.weighted_score.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500 font-mono">out of 100</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold font-mono ${verdict.color}`}>
            Verdict: {verdict.label}
          </div>

          <div className="w-full pt-4 border-t border-[#1e2535] grid grid-cols-2 gap-2 text-left text-xs font-mono">
            <div className="p-2 rounded bg-[#0d1017]">
              <span className="text-zinc-500 text-[10px] block">Confidence:</span>
              <span className="text-zinc-200 font-bold">{evalResult.confidence_level}</span>
            </div>
            <div className="p-2 rounded bg-[#0d1017]">
              <span className="text-zinc-500 text-[10px] block">Web Coverage:</span>
              <span className="text-emerald-400 font-bold">{evalResult.research_coverage}</span>
            </div>
          </div>
        </div>

        {/* Radar & Factor Breakdown */}
        <div className="lg:col-span-8 terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#212735]">
            <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Evaluation Dimensions & Radar
            </h4>
            <span className="text-xs text-zinc-400 font-mono">Solution: <strong className="text-emerald-300">{currentSolution.name}</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-[250px] bg-[#0c0f15] rounded-xl border border-[#1e2534] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#232936" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#232936" tick={{ fill: '#6e7681', fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {factorData.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-[#0d1017] border border-[#1f2533] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-zinc-200">{item.fullTitle}</span>
                    <span className="text-[10px] text-zinc-500 font-mono ml-2">({item.weight})</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">{item.score.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
          <h5 className="font-bold text-emerald-400 font-mono text-xs uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
            Top Validated Strengths
          </h5>
          <ul className="space-y-2 text-xs text-zinc-300">
            {evalResult.strengths.map((str, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-400 mr-2 font-bold">&bull;</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
          <h5 className="font-bold text-rose-400 font-mono text-xs uppercase tracking-wider flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
            Vulnerabilities & Weaknesses
          </h5>
          <ul className="space-y-2 text-xs text-zinc-300">
            {evalResult.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start">
                <span className="text-rose-400 mr-2 font-bold">&bull;</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
