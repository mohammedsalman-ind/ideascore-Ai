export interface ProblemInput {
  problem_text: string;
  target_region?: string;
  budget_constraint?: string;
  additional_context?: string;
}

export interface ProblemUnderstanding {
  problem_summary: string;
  root_causes: string[];
  people_affected: string;
  target_user_groups: string[];
  industry_domain: string;
  current_alternatives: string[];
  pain_points: string[];
  severity_frequency: string;
  potential_opportunities: string[];
}

export interface Solution {
  id: string;
  name: string;
  short_description: string;
  how_it_works: string;
  target_users: string[];
  core_features: string[];
  unique_value_proposition: string;
  required_technology: string[];
  possible_revenue_model: string;
  main_assumptions: string[];
  potential_challenges: string[];
  version: number;
}

export interface FactorScores {
  problem_significance: number;
  market_potential: number;
  innovation: number;
  technical_feasibility: number;
  scalability: number;
  revenue_potential: number;
  competitive_positioning: number;
  social_impact: number;
}

export interface RiskItem {
  category: string;
  severity: string;
  explanation: string;
  mitigation: string;
}

export interface EvaluationResult {
  solution_id: string;
  factor_scores: FactorScores;
  weighted_score: number;
  confidence_level: string;
  research_coverage: string;
  evaluation_explanation: string;
  strengths: string[];
  weaknesses: string[];
  major_risks: RiskItem[];
  missing_evidence: string[];
}

export interface ResearchEvidence {
  id: string;
  source_title: string;
  source_url: string;
  site_name: string;
  extracted_information: string;
  timestamp: string;
  status: string;
  relevant_solution_id?: string;
  evidence_category: string;
  is_verified_fact: boolean;
}

export interface CompetitorItem {
  name: string;
  url?: string;
  description: string;
  pricing_model?: string;
  key_features: string[];
  strengths: string[];
  weaknesses_or_gaps: string[];
  evidence_source_url?: string;
}

export interface ResearchResult {
  solution_id: string;
  competitors: CompetitorItem[];
  market_trends: string[];
  customer_pain_points: string[];
  identified_market_gaps: string[];
  differentiation_opportunities: string[];
  barriers_to_entry: string[];
  evidence_list: ResearchEvidence[];
  research_status: string;
  data_quality_notes?: string;
  research_source: string;
}

export interface FinalRecommendation {
  best_solution_id: string;
  best_solution_name: string;
  why_it_ranks_first: string;
  why_others_rank_lower: string;
  biggest_opportunity: string;
  biggest_uncertainty: string;
  recommended_next_step: string;
}

export interface SolutionRanking {
  rank: number;
  solution: Solution;
  score: number;
  confidence_level: string;
  research_status: string;
  top_strengths: string[];
  biggest_weakness: string;
  evaluation: EvaluationResult;
  research?: ResearchResult;
}

export interface AnalysisJob {
  id: string;
  problem_input: ProblemInput;
  stage: 'created' | 'understanding' | 'solutions_generated' | 'researching' | 'evaluating' | 'completed' | 'failed';
  progress_percentage: number;
  status_message: string;
  created_at: string;
  updated_at: string;
  error?: string;
  problem_understanding?: ProblemUnderstanding;
  solutions: Solution[];
  research_data: Record<string, ResearchResult>;
  evaluations: Record<string, EvaluationResult>;
  rankings: SolutionRanking[];
  final_recommendation?: FinalRecommendation;
}

export interface ModelRoastOutput {
  model_name: string;
  verdict: string;
  critique_points: string[];
  weak_assumptions: string[];
  unrealistic_expectations: string[];
  why_customers_reject: string[];
  why_competitors_win: string[];
  failure_scenarios: string[];
  status: string;
  error_message?: string;
}

export interface CombinedRoastReport {
  solution_id: string;
  solution_name: string;
  reality_check_score: number;
  brutal_verdict: string;
  biggest_weakness: string;
  top_five_failure_reasons: string[];
  unrealistic_assumptions: string[];
  market_problems: string[];
  technical_challenges: string[];
  monetization_concerns: string[];
  what_competitors_do_better: string[];
  what_needs_to_change: string[];
  actionable_recommendations: string[];
  points_of_agreement: string[];
  points_of_disagreement: string[];
  groq_critique?: ModelRoastOutput;
  gemini_critique?: ModelRoastOutput;
  created_at: string;
}

export interface ImprovedSolution {
  original_solution_id: string;
  new_solution_id: string;
  version: number;
  name: string;
  short_description: string;
  how_it_works: string;
  core_features: string[];
  unique_value_proposition: string;
  revised_revenue_model: string;
  changes_made: string[];
  remaining_risks: string[];
  original_score: number;
  improved_score: number;
  score_delta: number;
  evaluation: EvaluationResult;
  created_at: string;
}

export interface CategoryWinner {
  category: string;
  winner_solution_id: string;
  winner_solution_name: string;
  winning_score: number;
  rationale: string;
}

export interface ComparisonReport {
  solution_ids: string[];
  category_winners: CategoryWinner[];
  easiest_to_build: string;
  highest_revenue_potential: string;
  strongest_differentiation: string;
  lowest_execution_risk: string;
  best_for_small_team_or_student: string;
  strongest_overall: string;
  trade_off_breakdown: string;
  summary: string;
}

export interface MarketGapItem {
  gap_title: string;
  market_gap: string;
  evidence_observed: string;
  customer_pain_point: string;
  opportunity_description: string;
  possible_differentiation: string;
}

export interface FeasibilityReport {
  solution_id: string;
  required_skills: string[];
  technology_stack: string[];
  development_complexity: string;
  approximate_effort_weeks: string;
  core_dependencies: string[];
  infrastructure_requirements: string[];
  feasibility_notes: string;
}

export interface BusinessModelOption {
  model_type: string;
  pricing_structure: string;
  target_paying_customer: string;
  why_it_works: string;
  why_it_might_fail: string;
  recommended: boolean;
}

export interface SWOTReport {
  solution_id: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategic_takeaway: string;
}

export interface CustomerValidationReport {
  solution_id: string;
  target_customer_segments: string[];
  interview_questions: string[];
  survey_questions: string[];
  validation_experiments: string[];
  landing_page_testing_ideas: string[];
  key_assumptions_to_test: string[];
}

export interface SharkTankMessage {
  sender: string;
  avatar_color: string;
  text: string;
  timestamp: string;
}

export interface SettingsStatus {
  tinyfish: { configured: boolean; masked_key: string; engine: string };
  gemini: { configured: boolean; masked_key: string; model: string };
  groq: { configured: boolean; masked_key: string; model: string };
  supabase: { configured: boolean; url: string };
  demo_sandbox_mode: boolean;
  weights: Record<string, number>;
}

