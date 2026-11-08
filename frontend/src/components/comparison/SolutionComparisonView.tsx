import React, { useState } from 'react';
import {
  GitCompare, Trophy, Zap, DollarSign, Shield, Users,
  BarChart3, CheckCircle2, ArrowRight, Loader2
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { Solution, EvaluationResult, ComparisonReport } from '../../types';

interface SolutionComparisonViewProps {
  solutions: Solution[];
  evaluations: Record<string, EvaluationResult>;
  onRunComparison: (solutionIds: string[]) => Promise<ComparisonReport | null>;
  initialComparedIds?: string[];
}

export const SolutionComparisonView: React.FC<SolutionComparisonViewProps> = ({
  solutions,
  evaluations,
  onRunComparison,
  initialComparedIds = []
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialComparedIds.length >= 2 ? initialComparedIds : solutions.slice(0, 3).map(s => s.id)
  );
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleCompareClick = async () => {
    if (selectedIds.length < 2) return;
    setIsLoading(true);
    try {
      const res = await onRunComparison(selectedIds);
      if (res) setReport(res);
    } finally {
      setIsLoading(false);
    }
  };

  const comparedSolutions = solutions.filter(s => selectedIds.includes(s.id));

  // Multi-radar chart data
  const factorKeys = [
    { key: 'problem_significance', label: 'Problem Sig.' },
    { key: 'market_potential', label: 'Market Pot.' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'technical_feasibility', label: 'Tech Feas.' },
    { key: 'scalability', label: 'Scalability' },
    { key: 'revenue_potential', label: 'Revenue Pot.' },
    { key: 'competitive_positioning', label: 'Comp. Pos.' },
    { key: 'social_impact', label: 'Social Imp.' },
  ];

  const radarData = factorKeys.map(({ key, label }) => {
    const row: any = { subject: label };
    comparedSolutions.forEach(s => {
      const ev = evaluations[s.id];
      if (ev) {
        row[s.name] = (ev.factor_scores as any)[key];
      }
    });
    return row;
  });

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-emerald-400" />
            <span>Multi-Solution Comparative Matrix</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Select 2 to 5 solutions to compare deterministic factors, trade-offs, and category winners
          </p>
        </div>

        <button
          onClick={handleCompareClick}
          disabled={isLoading || selectedIds.length < 2}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-sm transition-all disabled:opacity-40 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Zap className="w-4 h-4 text-black" />
          )}
          <span>Synthesize Comparison ({selectedIds.length} Selected)</span>
        </button>
      </div>

      {/* Solution Selection Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-zinc-400 mr-2">Select 2-5:</span>
        {solutions.map((s, idx) => {
          const isSelected = selectedIds.includes(s.id);
          const ev = evaluations[s.id];

          return (
            <button
              key={s.id}
              onClick={() => toggleSelect(s.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-glow-sm'
                  : 'bg-[#121620] border-[#222938] text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: isSelected ? colors[idx % colors.length] : '#4b5563' }} />
              <span>{s.name}</span>
              {ev && <span className="font-mono text-[10px] text-zinc-500">({ev.weighted_score.toFixed(0)})</span>}
            </button>
          );
        })}
      </div>

      {/* Category Winners Badges (if report synthesized) */}
      {report && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center">
            <Trophy className="w-4 h-4 mr-1.5 text-emerald-400" />
            Category Winners & Strategic Best-Fits
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-lg bg-[#0e131d] border border-emerald-500/25">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Easiest to Build</span>
              <p className="text-xs text-emerald-300 font-bold leading-tight">{report.easiest_to_build.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{report.easiest_to_build}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0e131d] border border-emerald-500/25">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Highest Revenue Ceiling</span>
              <p className="text-xs text-emerald-300 font-bold leading-tight">{report.highest_revenue_potential.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{report.highest_revenue_potential}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0e131d] border border-emerald-500/25">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Strongest Differentiation</span>
              <p className="text-xs text-emerald-300 font-bold leading-tight">{report.strongest_differentiation.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{report.strongest_differentiation}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0e131d] border border-emerald-500/25">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Lowest Execution Risk</span>
              <p className="text-xs text-emerald-300 font-bold leading-tight">{report.lowest_execution_risk.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{report.lowest_execution_risk}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0e131d] border border-emerald-500/25">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Best for Student/Solo</span>
              <p className="text-xs text-emerald-300 font-bold leading-tight">{report.best_for_small_team_or_student.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{report.best_for_small_team_or_student}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Visuals: Multi-Radar Chart & Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Radar Comparison */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#121620] border border-[#212735] flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase mb-2 block">
            Factor Overlay Radar
          </span>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#232936" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#232936" tick={{ fill: '#6e7681', fontSize: 9 }} />
                {comparedSolutions.map((s, idx) => (
                  <Radar
                    key={s.id}
                    name={s.name}
                    dataKey={s.name}
                    stroke={colors[idx % colors.length]}
                    fill={colors[idx % colors.length]}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Qualitative Trade-off Summary */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-[#121620] border border-[#212735] flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2 block">
              Qualitative Trade-Off Synthesis
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {report?.trade_off_breakdown ||
                "Synthesize comparison to review how these candidates trade off initial technical complexity versus long-term monetization ceiling and defensibility."}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0c0f15] border border-emerald-500/20 text-xs">
            <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase block mb-1">
              Final Recommendation Summary
            </span>
            <p className="text-zinc-200 leading-relaxed text-xs">
              {report?.summary ||
                "Each solution serves a distinct trade-off profile. Higher complexity yields greater enterprise value, while lightweight tools allow immediate validation."}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-[#212735] bg-[#121620]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#151a24] text-zinc-400 font-mono text-[11px] uppercase border-b border-[#212735]">
            <tr>
              <th className="p-3 min-w-[140px]">Metric / Factor</th>
              {comparedSolutions.map((s, idx) => (
                <th key={s.id} className="p-3 min-w-[200px]" style={{ color: colors[idx % colors.length] }}>
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2535] text-zinc-300">
            {/* Overall Score */}
            <tr className="bg-[#0e121a]">
              <td className="p-3 font-semibold font-mono text-zinc-400">Deterministic Score</td>
              {comparedSolutions.map(s => {
                const ev = evaluations[s.id];
                return (
                  <td key={s.id} className="p-3 font-mono font-bold text-emerald-400 text-sm">
                    {ev ? `${ev.weighted_score.toFixed(1)} / 100` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* Core UVP */}
            <tr>
              <td className="p-3 font-semibold font-mono text-zinc-400">Value Proposition</td>
              {comparedSolutions.map(s => (
                <td key={s.id} className="p-3 leading-relaxed text-[11px]">
                  {s.unique_value_proposition}
                </td>
              ))}
            </tr>

            {/* Revenue Model */}
            <tr>
              <td className="p-3 font-semibold font-mono text-zinc-400">Revenue Model</td>
              {comparedSolutions.map(s => (
                <td key={s.id} className="p-3 font-mono text-[11px] text-zinc-300">
                  {s.possible_revenue_model}
                </td>
              ))}
            </tr>

            {/* Tech Stack */}
            <tr>
              <td className="p-3 font-semibold font-mono text-zinc-400">Technology Stack</td>
              {comparedSolutions.map(s => (
                <td key={s.id} className="p-3 text-[11px]">
                  <div className="flex flex-wrap gap-1">
                    {s.required_technology.map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Biggest Weakness */}
            <tr>
              <td className="p-3 font-semibold font-mono text-zinc-400">Primary Hurdle</td>
              {comparedSolutions.map(s => {
                const ev = evaluations[s.id];
                return (
                  <td key={s.id} className="p-3 text-rose-300 text-[11px]">
                    {ev?.weaknesses[0] || 'Market adoption'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

