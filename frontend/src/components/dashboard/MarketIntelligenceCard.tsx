import React from 'react';
import { Globe, DollarSign, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { ResearchResult } from '../../types';

interface MarketIntelligenceCardProps {
  research: ResearchResult;
  solutionName: string;
}

export const MarketIntelligenceCard: React.FC<MarketIntelligenceCardProps> = ({
  research,
  solutionName
}) => {
  return (
    <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#212735] gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Section C: TinyFish Market Intelligence</h3>
            <p className="text-xs text-zinc-400">
              Live web research, competitor pricing, and verified citations for: <strong className="text-emerald-300">{solutionName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#1c2230] text-zinc-300 border border-[#2b3548] flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            {research.research_source}
          </span>
        </div>
      </div>

      {/* Discovered Competitors Landscape */}
      <div>
        <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase mb-3 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          Discovered Competitors & Existing Products
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {research.competitors.map((comp, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#0e121a] border border-[#202736] flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white tracking-tight truncate">{comp.name}</span>
                  {comp.url && (
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-emerald-400 transition-colors"
                      title="Visit competitor website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                  {comp.description}
                </p>
              </div>

              {/* Pricing & Features */}
              <div className="pt-2 border-t border-[#1d2331] text-[10px] space-y-1 font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Pricing:</span>
                  <span className="text-emerald-400 font-semibold">{comp.pricing_model || 'Unknown'}</span>
                </div>
                {comp.weaknesses_or_gaps.length > 0 && (
                  <div className="text-rose-400/90 truncate">
                    <span>Gap: </span>{comp.weaknesses_or_gaps[0]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gaps & Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-[#0d1017] border border-[#212838]">
          <h5 className="font-bold text-zinc-200 mb-2 flex items-center text-emerald-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Identified Market Opportunities & Gaps
          </h5>
          <ul className="space-y-1.5 text-zinc-300">
            {research.identified_market_gaps.map((gap, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-400 mr-2 font-bold">&bull;</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1017] border border-[#212838]">
          <h5 className="font-bold text-zinc-200 mb-2 flex items-center text-blue-400 font-mono text-[11px]">
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            Observed Customer Pain Points
          </h5>
          <ul className="space-y-1.5 text-zinc-300">
            {research.customer_pain_points.map((p, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-400 mr-2 font-bold">&bull;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Traceable Evidence Sources Table */}
      <div>
        <h4 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2 flex items-center justify-between">
          <span>Traceable Web Evidence & Citations ({research.evidence_list.length})</span>
          <span className="text-[10px] text-zinc-500 font-normal">All sources crawled via TinyFish</span>
        </h4>

        <div className="overflow-x-auto rounded-lg border border-[#202736]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151a24] text-zinc-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Source & Domain</th>
                <th className="p-2.5">Extracted Evidence / Snippet</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2534] bg-[#0c0f15]">
              {research.evidence_list.map((ev, idx) => (
                <tr key={idx} className="hover:bg-[#121620] transition-colors">
                  <td className="p-2.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {ev.evidence_category}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <div className="font-semibold text-zinc-200 truncate max-w-[200px]">{ev.source_title}</div>
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline flex items-center truncate max-w-[180px]"
                    >
                      <span>{ev.site_name}</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1 inline" />
                    </a>
                  </td>
                  <td className="p-2.5 text-zinc-300 text-[11px] leading-relaxed max-w-md">
                    {ev.extracted_information}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[10px]">
                    <span className="text-emerald-400 font-semibold">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

