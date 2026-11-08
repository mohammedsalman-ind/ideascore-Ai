import React from 'react';
import { Compass, Sparkles, Lightbulb, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FinalRecommendation } from '../../types';

interface FinalRecommendationCardProps {
  recommendation: FinalRecommendation;
}

export const FinalRecommendationCard: React.FC<FinalRecommendationCardProps> = ({
  recommendation
}) => {
  return (
    <div className="terminal-card p-6 border border-emerald-500/30 bg-gradient-to-b from-[#101924] to-[#0e131d] rounded-xl shadow-glow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-emerald-500/20 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Section F: Venture Committee Final Recommendation</span>
            </h3>
            <p className="text-xs text-zinc-400">Synthesized portfolio verdict and founder action plan</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Top Candidate: {recommendation.best_solution_name}</span>
        </div>
      </div>

      {/* Why it ranks first vs why others rank lower */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-[#0e141f] border border-emerald-500/25 space-y-1.5">
          <h5 className="font-bold text-emerald-400 font-mono text-[11px] uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Why {recommendation.best_solution_name} Ranks First
          </h5>
          <p className="text-zinc-200 leading-relaxed text-xs">
            {recommendation.why_it_ranks_first}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0e121a] border border-[#232936] space-y-1.5">
          <h5 className="font-bold text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
            Why Other Contenders Ranked Lower
          </h5>
          <p className="text-zinc-300 leading-relaxed text-xs">
            {recommendation.why_others_rank_lower}
          </p>
        </div>
      </div>

      {/* Key Drivers: Opportunity & Critical Uncertainty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-lg bg-[#111722] border border-[#1f2738] flex items-start space-x-3">
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Biggest Growth Opportunity
            </span>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {recommendation.biggest_opportunity}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#111722] border border-[#1f2738] flex items-start space-x-3">
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Primary Critical Uncertainty
            </span>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {recommendation.biggest_uncertainty}
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Next Step */}
      <div className="p-4 rounded-lg bg-[#0a0d14] border border-emerald-500/30 flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-emerald-500 text-black font-bold shrink-0 mt-0.5">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
            Recommended Action For Founder This Week
          </span>
          <p className="text-xs text-white font-medium leading-relaxed">
            {recommendation.recommended_next_step}
          </p>
        </div>
      </div>
    </div>
  );
};

