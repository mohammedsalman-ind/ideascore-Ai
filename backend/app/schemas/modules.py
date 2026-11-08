from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SolutionComparisonRequest(BaseModel):
    solution_ids: List[str] = Field(..., min_length=2, max_length=5)

class CategoryWinner(BaseModel):
    category: str
    winner_solution_id: str
    winner_solution_name: str
    winning_score: float
    rationale: str

class ComparisonReport(BaseModel):
    solution_ids: List[str]
    category_winners: List[CategoryWinner]
    easiest_to_build: str
    highest_revenue_potential: str
    strongest_differentiation: str
    lowest_execution_risk: str
    best_for_small_team_or_student: str
    strongest_overall: str
    trade_off_breakdown: str
    summary: str

class MarketGapItem(BaseModel):
    gap_title: str
    market_gap: str
    evidence_observed: str
    customer_pain_point: str
    opportunity_description: str
    possible_differentiation: str

class FeasibilityReport(BaseModel):
    solution_id: str
    required_skills: List[str]
    technology_stack: List[str]
    development_complexity: str # Low, Medium, High, Very High
    approximate_effort_weeks: str
    core_dependencies: List[str]
    infrastructure_requirements: List[str]
    feasibility_notes: str

class BusinessModelOption(BaseModel):
    model_config = {"protected_namespaces": ()}
    model_type: str # Subscription, Freemium, Usage-based, Marketplace Commission, Enterprise Licensing, One-time
    pricing_structure: str
    target_paying_customer: str
    why_it_works: str
    why_it_might_fail: str
    recommended: bool

class SWOTReport(BaseModel):
    solution_id: str
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]
    strategic_takeaway: str

class CustomerValidationReport(BaseModel):
    solution_id: str
    target_customer_segments: List[str]
    interview_questions: List[str]
    survey_questions: List[str]
    validation_experiments: List[str]
    landing_page_testing_ideas: List[str]
    key_assumptions_to_test: List[str]

class SharkTankMessage(BaseModel):
    sender: str # "User", "Investor: Elena Vance (SaaS VC)", "Investor: Marcus Reed (Product Purist)", etc.
    avatar_color: str
    text: str
    timestamp: str

class SharkTankPitchRequest(BaseModel):
    solution_id: str
    user_pitch_message: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = []
