from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class ProblemInput(BaseModel):
    problem_text: str = Field(..., min_length=10, description="The user's raw problem description")
    target_region: Optional[str] = Field("Global", description="Optional region constraint")
    budget_constraint: Optional[str] = Field(None, description="Optional budget or team constraint")
    additional_context: Optional[str] = Field(None, description="Any other constraints or domain notes")

class ProblemUnderstanding(BaseModel):
    problem_summary: str
    root_causes: List[str]
    people_affected: str
    target_user_groups: List[str]
    industry_domain: str
    current_alternatives: List[str]
    pain_points: List[str]
    severity_frequency: str
    potential_opportunities: List[str]

class Solution(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    short_description: str
    how_it_works: str
    target_users: List[str]
    core_features: List[str]
    unique_value_proposition: str
    required_technology: List[str]
    possible_revenue_model: str
    main_assumptions: List[str]
    potential_challenges: List[str]
    version: int = 1

class ResearchEvidence(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_title: str
    source_url: str
    site_name: str
    extracted_information: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "verified" # verified, failed, unverified
    relevant_solution_id: Optional[str] = None
    evidence_category: str = "competitor" # competitor, pricing, market_trend, pain_point, feature, gap
    is_verified_fact: bool = True

class CompetitorItem(BaseModel):
    name: str
    url: Optional[str] = None
    description: str
    pricing_model: Optional[str] = "Unknown / Free Tier"
    key_features: List[str] = []
    strengths: List[str] = []
    weaknesses_or_gaps: List[str] = []
    evidence_source_url: Optional[str] = None

class ResearchResult(BaseModel):
    solution_id: str
    competitors: List[CompetitorItem] = []
    market_trends: List[str] = []
    customer_pain_points: List[str] = []
    identified_market_gaps: List[str] = []
    differentiation_opportunities: List[str] = []
    barriers_to_entry: List[str] = []
    evidence_list: List[ResearchEvidence] = []
    research_status: str = "completed" # completed, partial, failed
    data_quality_notes: Optional[str] = None
    research_source: str = "TinyFish" # TinyFish, Simulated/Demo

class FactorScores(BaseModel):
    problem_significance: float = Field(..., ge=0, le=100) # 15%
    market_potential: float = Field(..., ge=0, le=100) # 15%
    innovation: float = Field(..., ge=0, le=100) # 15%
    technical_feasibility: float = Field(..., ge=0, le=100) # 15%
    scalability: float = Field(..., ge=0, le=100) # 10%
    revenue_potential: float = Field(..., ge=0, le=100) # 15%
    competitive_positioning: float = Field(..., ge=0, le=100) # 10%
    social_impact: float = Field(..., ge=0, le=100) # 5%

class RiskItem(BaseModel):
    category: str # Technical, Market, Financial, Competitive, Adoption
    severity: str # High, Medium, Low
    explanation: str
    mitigation: str

class EvaluationResult(BaseModel):
    solution_id: str
    factor_scores: FactorScores
    weighted_score: float # Deterministically calculated backend score
    confidence_level: str # High, Moderate, Low
    research_coverage: str # Comprehensive, Partial, Limited
    evaluation_explanation: str
    strengths: List[str]
    weaknesses: List[str]
    major_risks: List[RiskItem]
    missing_evidence: List[str]

class FinalRecommendation(BaseModel):
    best_solution_id: str
    best_solution_name: str
    why_it_ranks_first: str
    why_others_rank_lower: str
    biggest_opportunity: str
    biggest_uncertainty: str
    recommended_next_step: str

class SolutionRanking(BaseModel):
    rank: int
    solution: Solution
    score: float
    confidence_level: str
    research_status: str
    top_strengths: List[str]
    biggest_weakness: str
    evaluation: EvaluationResult
    research: Optional[ResearchResult] = None

class AnalysisJob(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = "guest"
    problem_input: ProblemInput
    stage: str = "created" # created, understanding, solutions_generated, researching, evaluating, completed, failed
    progress_percentage: int = 0
    status_message: str = "Analysis initialized"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    error: Optional[str] = None
    
    # Analysis outputs
    problem_understanding: Optional[ProblemUnderstanding] = None
    solutions: List[Solution] = []
    research_data: Dict[str, ResearchResult] = {} # solution_id -> ResearchResult
    evaluations: Dict[str, EvaluationResult] = {} # solution_id -> EvaluationResult
    rankings: List[SolutionRanking] = []
    final_recommendation: Optional[FinalRecommendation] = None

class AnalysisHistorySummary(BaseModel):
    id: str
    problem_summary: str
    original_problem: str
    solution_count: int
    top_solution_name: str
    top_solution_score: float
    created_at: str
    stage: str

