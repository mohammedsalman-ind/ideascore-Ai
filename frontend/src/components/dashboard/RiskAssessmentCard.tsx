import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { RiskItem } from '../../types';

interface RiskAssessmentCardProps {
  risks: RiskItem[];
  solutionName: string;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  risks,
  solutionName
}) => {
  return (
    <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#212735]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Section E: Risk Matrix & De-Risking Roadmap</h3>
            <p className="text-xs text-zinc-400">
              Technical, market, financial, and adoption vulnerabilities identified for: <strong className="text-emerald-300">{solutionName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {risks.map((risk, idx) => {
          const isHigh = risk.severity.toLowerCase() === 'high';
          const isMed = risk.severity.toLowerCase() === 'medium';

          return (
            <div key={idx} className="p-4 rounded-lg bg-[#0e121a] border border-[#202737] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                    {risk.category} Risk
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isMed
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {risk.severity} Severity
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {risk.explanation}
                </p>
              </div>

              {/* Mitigation Action */}
              <div className="pt-2 border-t border-[#1d2331] text-xs">
                <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase mb-0.5 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Recommended Mitigation
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  {risk.mitigation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

