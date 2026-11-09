import React from 'react';
import {
  LayoutDashboard, PlusCircle, GitCompare,
  Cpu, Settings, ShieldCheck, Lightbulb
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hasActiveAnalysis: boolean;
  isAnalyzing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveAnalysis,
  isAnalyzing = false
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      disabled: !hasActiveAnalysis && !isAnalyzing,
      badge: hasActiveAnalysis ? 'Active' : undefined
    },
    {
      id: 'judge',
      label: 'Judge Idea',
      icon: Lightbulb,
      accent: true
    },
    {
      id: 'competitors',
      label: 'Existing Solutions',
      icon: Cpu,
      disabled: !hasActiveAnalysis && !isAnalyzing
    },
    {
      id: 'suggestions',
      label: 'Solutions & Suggestions',
      icon: PlusCircle,
      disabled: !hasActiveAnalysis && !isAnalyzing
    },
    {
      id: 'score',
      label: 'Overall Score',
      icon: ShieldCheck,
      disabled: !hasActiveAnalysis && !isAnalyzing
    },
    {
      id: 'settings',
      label: 'Settings & API',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-[#0e1117] border-r border-[#1f2633] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1f2633]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-glow-sm">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-white">IdeaScore</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-tight">Validation Terminal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onSelectTab(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-glow-sm'
                    : isDisabled
                    ? 'text-zinc-600 cursor-not-allowed'
                    : item.accent
                    ? 'text-white bg-zinc-800/60 hover:bg-zinc-800 hover:text-emerald-300'
                    : 'text-zinc-400 hover:bg-[#151a24] hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Architecture Stack */}
      <div className="p-4 border-t border-[#1f2633] space-y-3 bg-[#0a0c10]/40">
        <div className="text-[11px] text-zinc-500 space-y-1 font-mono">
          <div className="flex justify-between items-center text-zinc-400">
            <span>Research:</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              TinyFish Web
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Strategy:</span>
            <span className="text-blue-400 font-semibold">Gemini 3.8</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Critic:</span>
            <span className="text-amber-400 font-semibold">Groq (Llama 3.3)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
          <span>v1.0.0 Production</span>
          <span className="flex items-center text-emerald-500">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified
          </span>
        </div>
      </div>
    </aside>
  );
};

