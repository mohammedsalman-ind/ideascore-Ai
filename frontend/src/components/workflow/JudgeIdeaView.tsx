import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronDown, ChevronUp, Clock, CheckCircle2, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { ProblemInput } from '../../types';

interface JudgeIdeaViewProps {
  onSubmit: (input: ProblemInput) => Promise<void>;
  isLoading: boolean;
  progressPercentage: number;
  statusMessage: string;
}

const EXAMPLE_IDEAS = [
  "I want to build an AI-powered academic planner that parses course syllabi and automatically schedules deadlines and study blocks.",
  "A WhatsApp bot for group projects that gently tracks tasks, sends automated nudges, and avoids awkward confrontations between students.",
  "An automated compliance and insurance pre-check tool for independent healthcare clinics to eliminate phone-tag delays.",
  "A micro-SaaS for video editors to collect frame-accurate video client feedback and approvals without messy email threads."
];

export const JudgeIdeaView: React.FC<JudgeIdeaViewProps> = ({
  onSubmit,
  isLoading,
  progressPercentage,
  statusMessage
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetRegion, setTargetRegion] = useState('Global');
  const [budgetConstraint, setBudgetConstraint] = useState('Bootstrapped / Student ($0 - $5k)');
  const [additionalContext, setAdditionalContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim() || ideaText.trim().length < 10) return;

    onSubmit({
      problem_text: ideaText.trim(),
      target_region: targetRegion,
      budget_constraint: budgetConstraint,
      additional_context: additionalContext.trim() || undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      {/* Hero Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-1 shadow-glow-sm">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Interactive AI Validation Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Tell us your idea.
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Describe your startup idea, product, or the problem you want to solve. Gemini and TinyFish will research competitors, score feasibility, and generate solutions.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl shadow-xl space-y-5">
        <div>
          <label htmlFor="ideaInput" className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
            <span>Your Startup / Product Idea</span>
            <span className="text-zinc-500 font-normal">Min. 10 characters</span>
          </label>
          <textarea
            id="ideaInput"
            rows={6}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your startup idea, product, or the problem you want to solve..."
            className="w-full rounded-lg bg-[#0c0e14] border border-[#222a3a] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-zinc-500 text-sm p-4 transition-all resize-none font-sans leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Quick Example Chips */}
        <div>
          <span className="text-[11px] font-mono text-zinc-400 block mb-1.5">Try an example idea:</span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_IDEAS.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdeaText(ex)}
                disabled={isLoading}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#161b26] hover:bg-[#1e2535] text-zinc-300 border border-[#263044] hover:border-emerald-500/40 transition-all truncate max-w-md"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Settings Accordion */}
        <div className="pt-2 border-t border-[#1e2535]">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Optional Constraints (Geography & Budget)</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#1a202c]">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Target Geographic Region</label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full rounded bg-[#0c0e14] border border-[#222a3a] text-zinc-200 text-xs p-2.5 focus:border-emerald-500"
                >
                  <option value="Global">Global / Worldwide</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="India & South Asia">India & South Asia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Founder Runway / Budget</label>
                <select
                  value={budgetConstraint}
                  onChange={(e) => setBudgetConstraint(e.target.value)}
                  className="w-full rounded bg-[#0c0e14] border border-[#222a3a] text-zinc-200 text-xs p-2.5 focus:border-emerald-500"
                >
                  <option value="Bootstrapped / Student ($0 - $5k)">Bootstrapped / Solo Student ($0 - $5k)</option>
                  <option value="Pre-Seed Funded ($10k - $50k)">Pre-Seed Project ($10k - $50k)</option>
                  <option value="Funded Startup ($100k+)">Funded Startup ($100k+)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button & Progress Area */}
        <div className="pt-2">
          {!isLoading ? (
            <button
              type="submit"
              disabled={ideaText.trim().length < 10}
              className="w-full py-3.5 px-6 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center space-x-2 shadow-glow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Judge Idea</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <div className="p-4 rounded-lg bg-[#0e131d] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-emerald-400" />
                  {statusMessage || 'Judging idea and validating across web indexes...'}
                </span>
                <span className="font-mono font-bold text-white">{progressPercentage}%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full shadow-glow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 text-[10px] font-mono text-zinc-500 text-center gap-1">
                <span className={progressPercentage >= 15 ? 'text-emerald-400' : ''}>1. Understanding</span>
                <span className={progressPercentage >= 35 ? 'text-emerald-400' : ''}>2. 3-5 Solutions</span>
                <span className={progressPercentage >= 60 ? 'text-emerald-400' : ''}>3. TinyFish Web</span>
                <span className={progressPercentage >= 85 ? 'text-emerald-400' : ''}>4. Evaluation</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

