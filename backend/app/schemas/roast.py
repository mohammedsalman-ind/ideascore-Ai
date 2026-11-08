from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ModelRoastOutput(BaseModel):
    model_config = {"protected_namespaces": ()}
    model_name: str
    verdict: str
    critique_points: List[str]
    weak_assumptions: List[str]
    unrealistic_expectations: List[str]
    why_customers_reject: List[str]
    why_competitors_win: List[str]
    failure_scenarios: List[str]
    strategic_gaps: List[str] = []
    status: str = "success" # success, failed, skipped
    error_message: Optional[str] = None

class CombinedRoastReport(BaseModel):
    solution_id: str
    solution_name: str
    reality_check_score: float = Field(..., ge=0, le=100, description="Severity of identified weaknesses (higher means more critical flaws)")
    brutal_verdict: str
    biggest_weakness: str
    top_five_failure_reasons: List[str]
    unrealistic_assumptions: List[str]
    market_problems: List[str]
    technical_challenges: List[str]
    monetization_concerns: List[str]
    what_competitors_do_better: List[str]
    what_needs_to_change: List[str]
    actionable_recommendations: List[str]
    points_of_agreement: List[str]
    points_of_disagreement: List[str]
    groq_critique: Optional[ModelRoastOutput] = None
    gemini_critique: Optional[ModelRoastOutput] = None
    created_at: str
