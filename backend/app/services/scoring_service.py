from typing import Dict, Any, List
from backend.app.schemas.analysis import FactorScores
from backend.app.core.config import settings

class ScoringService:
    @staticmethod
    def calculate_weighted_score(scores: FactorScores) -> float:
        """
        Deterministic backend calculation of the final score.
        Weights:
        - Problem Significance: 15%
        - Market Potential: 15%
        - Innovation: 15%
        - Technical Feasibility: 15%
        - Scalability: 10%
        - Revenue Potential: 15%
        - Competitive Positioning: 10%
        - Social Impact: 5%
        """
        w = settings.EVALUATION_WEIGHTS
        
        weighted = (
            scores.problem_significance * w["problem_significance"] +
            scores.market_potential * w["market_potential"] +
            scores.innovation * w["innovation"] +
            scores.technical_feasibility * w["technical_feasibility"] +
            scores.scalability * w["scalability"] +
            scores.revenue_potential * w["revenue_potential"] +
            scores.competitive_positioning * w["competitive_positioning"] +
            scores.social_impact * w["social_impact"]
        )
        
        return round(weighted, 1)

    @staticmethod
    def calculate_reality_check_score(
        failure_reasons_count: int,
        unrealistic_assumptions_count: int,
        monetization_concerns_count: int,
        market_problems_count: int
    ) -> float:
        """
        Calculates a 0-100 Reality Check Score.
        Represents the severity and density of identified vulnerabilities.
        Higher score = more severe critical vulnerabilities detected.
        """
        base = 40.0
        base += min(failure_reasons_count * 5.0, 25.0)
        base += min(unrealistic_assumptions_count * 4.0, 15.0)
        base += min(monetization_concerns_count * 3.5, 12.0)
        base += min(market_problems_count * 3.0, 8.0)
        
        return round(min(max(base, 10.0), 98.0), 1)

    @staticmethod
    def compute_research_coverage(evidence_count: int, competitors_count: int) -> str:
        """Determines research coverage level based on discovered evidence."""
        if evidence_count >= 5 and competitors_count >= 2:
            return "Comprehensive"
        elif evidence_count >= 2 or competitors_count >= 1:
            return "Moderate"
        else:
            return "Preliminary"

scoring_service = ScoringService()

