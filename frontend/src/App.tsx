import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewDashboardView } from './components/dashboard/OverviewDashboardView';
import { JudgeIdeaView } from './components/workflow/JudgeIdeaView';
import { ExistingSolutionsView } from './components/competitors/ExistingSolutionsView';
import { SolutionsSuggestionsView } from './components/suggestions/SolutionsSuggestionsView';
import { OverallScoreView } from './components/score/OverallScoreView';
import { SolutionDetailModal } from './components/dashboard/SolutionDetailModal';
import { RoastModal } from './components/roast/RoastModal';
import { ImprovementModal } from './components/improvement/ImprovementModal';
import { SettingsModal } from './components/common/SettingsModal';
import { api } from './services/api';
import {
  AnalysisJob, Solution, ProblemInput, CombinedRoastReport,
  ImprovedSolution, SettingsStatus, ComparisonReport
} from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisJob | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Roast state
  const [isRoastOpen, setIsRoastOpen] = useState(false);
  const [roastData, setRoastData] = useState<CombinedRoastReport | null>(null);
  const [isRoastLoading, setIsRoastLoading] = useState(false);

  // Fix My Idea (Improvement) state
  const [isImprovementOpen, setIsImprovementOpen] = useState(false);
  const [improvedData, setImprovedData] = useState<ImprovedSolution | null>(null);
  const [versionHistory, setVersionHistory] = useState<ImprovedSolution[]>([]);
  const [isImprovementLoading, setIsImprovementLoading] = useState(false);

  // Comparison state
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Settings & Progress state
  const [settings, setSettings] = useState<SettingsStatus | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Initial load: settings and history
  useEffect(() => {
    loadSettings();
    loadHistory();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setAnalysisHistory(data);
      // Auto-load most recent analysis if available
      // Do not automatically open the most recent analysis on load.
      // Users should start a new analysis from the dashboard.

    } catch (e) {
      console.error("Failed to load history:", e);
    }
  };

  // Start new analysis pipeline
  const handleStartAnalysis = async (input: ProblemInput) => {
    setIsAnalyzing(true);
    setProgressPercentage(10);
    setStatusMessage('Submitting problem and initializing validation engines...');

    try {
      const { analysis_id } = await api.startAnalysis(input);

      // Poll analysis progress
      const pollInterval = setInterval(async () => {
        try {
          const job = await api.getAnalysis(analysis_id);
          setProgressPercentage(job.progress_percentage);
          setStatusMessage(job.status_message);

          if (job.stage === 'completed' || job.stage === 'failed') {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setActiveAnalysis(job);
            if (job.solutions.length > 0) {
              setSelectedSolution(job.solutions[0]);
              setComparedIds(job.solutions.slice(0, 3).map(s => s.id));
            }
            loadHistory();
            setCurrentTab('overview');
          }
        } catch (err) {
          console.error("Poll error:", err);
          clearInterval(pollInterval);
          setIsAnalyzing(false);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const openAnalysis = async (id: string, switchTab: boolean = true) => {
    try {
      const job = await api.getAnalysis(id);
      setActiveAnalysis(job);
      if (job.solutions.length > 0) {
        setSelectedSolution(job.solutions[0]);
        setComparedIds(job.solutions.slice(0, 3).map(s => s.id));
      }
      if (switchTab) setCurrentTab('overview');
    } catch (e) {
      console.error("Failed to open analysis:", e);
    }
  };

  // Roast Handler
  const handleRoastSolution = async (solution: Solution) => {
    setSelectedSolution(solution);
    setIsRoastOpen(true);
    setIsRoastLoading(true);
    setRoastData(null);

    try {
      const report = await api.roastSolution(solution.id);
      setRoastData(report);
    } catch (err) {
      console.error("Roast error:", err);
    } finally {
      setIsRoastLoading(false);
    }
  };

  // Fix My Idea Handler
  const handleFixMyIdea = async (solution: Solution) => {
    setIsRoastOpen(false);
    setIsImprovementOpen(true);
    setIsImprovementLoading(true);
    setImprovedData(null);

    try {
      const improved = await api.fixSolution(solution.id);
      setImprovedData(improved);
      const versions = await api.getVersions(solution.id);
      setVersionHistory(versions);
    } catch (err) {
      console.error("Fix error:", err);
    } finally {
      setIsImprovementLoading(false);
    }
  };

  // Compare Toggle Handler
  const handleToggleCompare = (solutionId: string) => {
    if (comparedIds.includes(solutionId)) {
      setComparedIds(comparedIds.filter(id => id !== solutionId));
    } else {
      if (comparedIds.length < 5) {
        setComparedIds([...comparedIds, solutionId]);
      }
    }
  };

  // Run Comparison Handler
  const handleRunComparison = async (ids: string[]): Promise<ComparisonReport | null> => {
    try {
      return await api.compareSolutions(ids);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // PDF Export
  const handleExportPdf = () => {
    if (activeAnalysis) {
      window.open(api.getPdfReportUrl(activeAnalysis.id), '_blank');
    }
  };

  // Save Settings
  const handleSaveSettings = async (keys: any) => {
    const updated = await api.updateSettings(keys);
    setSettings(updated);
  };

  const selectedEvaluation = selectedSolution && activeAnalysis
    ? activeAnalysis.evaluations[selectedSolution.id]
    : null;

  const selectedResearch = selectedSolution && activeAnalysis
    ? activeAnalysis.research_data[selectedSolution.id]
    : null;

  return (
    <div className="flex min-h-screen bg-[#0a0c10] text-[#f0f3f6]">
      {/* Vertical Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveAnalysis={Boolean(activeAnalysis && activeAnalysis.stage === 'completed')}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          activeAnalysisId={activeAnalysis?.id}
          activeProblemSummary={activeAnalysis?.problem_understanding?.problem_summary}
          settings={settings || undefined}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportPdf={handleExportPdf}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <OverviewDashboardView
              analysis={activeAnalysis}
              onNavigateToJudge={() => setCurrentTab('judge')}
              onSelectSolution={(sol) => {
                setSelectedSolution(sol);
                setIsDetailOpen(true);
              }}
              selectedSolution={selectedSolution}
              onRoastSolution={handleRoastSolution}
              onFixSolution={handleFixMyIdea}
              onToggleCompare={handleToggleCompare}
              comparedIds={comparedIds}
            />
          )}

          {/* TAB 2: JUDGE IDEA */}
          {currentTab === 'judge' && (
            <JudgeIdeaView
              onSubmit={handleStartAnalysis}
              isLoading={isAnalyzing}
              progressPercentage={progressPercentage}
              statusMessage={statusMessage}
            />
          )}

          {/* TAB 3: EXISTING SOLUTIONS (REAL MARKET COMPETITORS) */}
          {currentTab === 'competitors' && activeAnalysis && (
            <ExistingSolutionsView
              solutions={activeAnalysis.solutions}
              researchData={activeAnalysis.research_data}
              selectedSolutionId={selectedSolution?.id}
              onSelectSolution={(sol) => setSelectedSolution(sol)}
            />
          )}

          {/* TAB 4: SOLUTIONS & SUGGESTIONS */}
          {currentTab === 'suggestions' && activeAnalysis && (
            <SolutionsSuggestionsView
              solutions={activeAnalysis.solutions}
              evaluations={activeAnalysis.evaluations}
              researchData={activeAnalysis.research_data}
              onSelectSolution={(sol) => {
                setSelectedSolution(sol);
                setIsDetailOpen(true);
              }}
              onRoastSolution={handleRoastSolution}
              onFixSolution={handleFixMyIdea}
              onCompareWithExisting={(sol) => {
                setSelectedSolution(sol);
                setCurrentTab('competitors');
              }}
            />
          )}

          {/* TAB 5: OVERALL SCORE */}
          {currentTab === 'score' && activeAnalysis && (
            <OverallScoreView
              solutions={activeAnalysis.solutions}
              evaluations={activeAnalysis.evaluations}
              researchData={activeAnalysis.research_data}
              selectedSolutionId={selectedSolution?.id}
              onSelectSolution={(sol) => setSelectedSolution(sol)}
            />
          )}

          {/* TAB 6: SETTINGS & API */}
          {currentTab === 'settings' && (
            <div className="max-w-2xl mx-auto py-8">
              <div className="terminal-card p-6 border border-[#232936] bg-[#121620] rounded-xl space-y-4">
                <h3 className="text-base font-bold text-white">System Settings & Model Configuration</h3>
                <p className="text-xs text-zinc-400">
                  IdeaScore AI operates in full production mode when API keys are configured, and provides high-fidelity sandbox simulations when keys are missing.
                </p>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-black shadow-glow-sm cursor-pointer"
                >
                  Configure API Keys
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <SolutionDetailModal
        solution={selectedSolution}
        evaluation={selectedEvaluation || undefined}
        research={selectedResearch || undefined}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRoast={(sol) => {
          setIsDetailOpen(false);
          handleRoastSolution(sol);
        }}
        onFix={(sol) => {
          setIsDetailOpen(false);
          handleFixMyIdea(sol);
        }}
        onOpenSharkTank={(sol) => {
          setIsDetailOpen(false);
          setCurrentTab('modules');
        }}
      />

      <RoastModal
        roast={roastData}
        solution={selectedSolution}
        isOpen={isRoastOpen}
        onClose={() => setIsRoastOpen(false)}
        onFixMyIdea={handleFixMyIdea}
        isLoading={isRoastLoading}
      />

      <ImprovementModal
        improved={improvedData}
        originalSolution={selectedSolution}
        isOpen={isImprovementOpen}
        onClose={() => setIsImprovementOpen(false)}
        versionHistory={versionHistory}
        isLoading={isImprovementLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;

