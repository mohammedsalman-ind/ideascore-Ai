from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from backend.app.schemas.analysis import Solution, EvaluationResult

class ImprovedSolution(BaseModel):
    original_solution_id: str
    new_solution_id: str
    version: int
    name: str
    short_description: str
    how_it_works: str
    core_features: List[str]
    unique_value_proposition: str
    revised_revenue_model: str
    changes_made: List[str]
    remaining_risks: List[str]
    original_score: float
    improved_score: float
    score_delta: float
    evaluation: EvaluationResult
    created_at: str

class VersionHistoryEntry(BaseModel):
    version: int
    solution_id: str
    name: str
    short_description: str
    weighted_score: float
    changes_made: Optional[List[str]] = None
    created_at: str

