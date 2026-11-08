import React from 'react';
import { Download, Sparkles, Sliders, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { SettingsStatus } from '../../types';

interface HeaderProps {
  currentTab: string;
  activeAnalysisId?: string;
  activeProblemSummary?: string;
  settings?: SettingsStatus;
  onOpenSettings: () => void;
  onExportPdf?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeAnalysisId,
  activeProblemSummary,
  settings,
  onOpenSettings,
  onExportPdf
}) => {
  return (
    <header className="h-16 border-b border-[#1f2633] bg-[#0c0f15]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Context / Title */}
      <div className="flex items-center space-x-4 min-w-0">
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2 truncate">
            {activeProblemSummary ? (
              <>
                <span className="text-zinc-400 font-normal">Active Validation:</span>
                <span className="text-zinc-200 truncate max-w-md">{activeProblemSummary}</span>
              </>
            ) : (
              <span className="text-zinc-300">IdeaScore AI &mdash; Startup Validation & Investment Research Terminal</span>
            )}
          </h1>
          <p className="text-[11px] text-zinc-500 font-medium">
            Don't Just Build Ideas. Validate Them.
          </p>
        </div>
      </div>

      {/* Right: Engine Badges & Actions */}
      <div className="flex items-center space-x-3">
        {/* Engine status pills */}
        <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono px-3 py-1 rounded-full bg-[#141822] border border-[#232936]">
          <span className="text-zinc-400">Engines:</span>
          <span className={`flex items-center space-x-1 ${settings?.tinyfish.configured ? 'text-emerald-400' : 'text-emerald-500/80'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>TinyFish</span>
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-blue-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Gemini</span>
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-amber-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Groq</span>
          </span>
        </div>

        {/* PDF Export Action */}
        {activeAnalysisId && (
          <button
            onClick={onExportPdf}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181f2c] hover:bg-[#20293a] text-zinc-200 border border-[#2b3548] transition-colors"
            title="Download executive PDF report"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export PDF</span>
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-[#141822] hover:bg-[#1a202d] text-zinc-400 hover:text-zinc-200 border border-[#232936] transition-colors"
          title="Configure API Keys & Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

