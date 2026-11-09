import React from 'react';
import { Layers, Globe, DollarSign, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResearchResult, Solution } from '../../types';

interface ExistingSolutionsViewProps {
  solutions: Solution[];
  researchData: Record<string, ResearchResult>;
  selectedSolutionId?: string;
  onSelectSolution: (sol: Solution) => void;
  isLoading?: boolean;
}

export const ExistingSolutionsView: React.FC<ExistingSolutionsViewProps> = ({
  solutions,
  researchData,
  selectedSolutionId,
  onSelectSolution,
  isLoading = false
}) => {
  const currentSolution = solutions.find(s => s.id === selectedSolutionId) || solutions[0];
  const research = currentSolution ? researchData[currentSolution.id] : null;

  if (isLoading && (!solutions || solutions.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-base font-bold text-white">Researching Market Competitors...</h3>
        <p className="text-xs text-zinc-400">TinyFish web crawl is discovering active market tools and alternatives.</p>
      </div>
    );
  }

  if (!solutions || solutions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Idea Submitted Yet</h3>
        <p className="text-xs text-zinc-400">Submit your idea in "Judge Idea" to view real market competitors and existing products discovered by TinyFish.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-1 shadow-glow-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>TinyFish Market Research Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Existing Market Solutions & Competitors
          </h2>
          <p className="text-xs text-zinc-400">
            Real products discovered by TinyFish web crawling that solve similar problems or target overlapping audiences.
          </p>
        </div>

        {/* Solution Selector Pill Tabs */}
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

      {research ? (
        <div className="space-y-6">
          {/* Competitors Grid */}
          <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase flex items-center">
                <Layers className="w-4 h-4 mr-2 text-emerald-400" />
                Competitors Researched for: <span className="text-white ml-1.5 font-sans font-bold text-sm">{currentSolution.name}</span>
              </h4>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c2230] text-emerald-400 border border-[#2b3548] flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {research.research_source}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {research.competitors.length === 0 ? (
                <div className="col-span-full p-8 text-center text-zinc-400 bg-[#0e121a] rounded-lg border border-[#202736]">
                  No existing solutions found for this category yet.
                </div>
              ) : (
                research.competitors.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#0e121a] border border-[#202736] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white tracking-tight">{comp.name}</span>
                        {comp.url && (
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-emerald-400 transition-colors"
                            title="Visit product website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    {/* Features & Gaps */}
                    <div className="pt-3 border-t border-[#1d2331] text-[11px] space-y-1.5 font-mono">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Pricing:</span>
                        <span className="text-emerald-400 font-semibold">{comp.pricing_model || 'Unknown / Free'}</span>
                      </div>
                      {comp.key_features && comp.key_features.length > 0 && (
                        <div className="text-zinc-400 truncate">
                          <span className="text-zinc-500">Features: </span>{comp.key_features.slice(0, 2).join(', ')}
                        </div>
                      )}
                      {comp.weaknesses_or_gaps && comp.weaknesses_or_gaps.length > 0 && (
                        <div className="text-rose-400/90 truncate">
                          <span className="text-zinc-500">Gap: </span>{comp.weaknesses_or_gaps[0]}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Market Gaps & Opportunities Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
              <h5 className="font-bold text-emerald-400 font-mono text-xs uppercase tracking-wider flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                Identified Market Gaps & White Spaces
              </h5>
              <ul className="space-y-2 text-xs text-zinc-300">
                {research.identified_market_gaps.map((gap, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 font-bold">&bull;</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#121620] border border-[#232936] space-y-3">
              <h5 className="font-bold text-blue-400 font-mono text-xs uppercase tracking-wider flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-blue-400" />
                Differentiation & Advantage Opportunities
              </h5>
              <ul className="space-y-2 text-xs text-zinc-300">
                {research.differentiation_opportunities.map((diff, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-blue-400 mr-2 font-bold">&bull;</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-zinc-400 bg-[#121620] rounded-xl border border-[#232936]">
          Research evidence is being indexed. Select another solution tab above to view competitors.
        </div>
      )}
    </div>
  );
};
