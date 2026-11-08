import logging
from typing import List, Dict, Any, Optional
from backend.app.schemas.analysis import Solution, EvaluationResult
from backend.app.schemas.modules import ComparisonReport, CategoryWinner
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class ComparisonService:
    async def compare_solutions(
        self,
        solutions: List[Solution],
        evaluations: Dict[str, EvaluationResult]
    ) -> ComparisonReport:
        """
        Synthesizes a structured comparison report across 2-5 solutions.
        Determines category winners and qualitative trade-offs.
        """
        sol_map = {s.id: s for s in solutions}

        # Category winners determination
        categories = [
            ("Problem Significance", lambda e: e.factor_scores.problem_significance),
            ("Market Potential", lambda e: e.factor_scores.market_potential),
            ("Innovation", lambda e: e.factor_scores.innovation),
            ("Technical Feasibility", lambda e: e.factor_scores.technical_feasibility),
            ("Scalability", lambda e: e.factor_scores.scalability),
            ("Revenue Potential", lambda e: e.factor_scores.revenue_potential),
            ("Competitive Positioning", lambda e: e.factor_scores.competitive_positioning),
            ("Social Impact", lambda e: e.factor_scores.social_impact),
        ]

        category_winners: List[CategoryWinner] = []
        for cat_name, score_fn in categories:
            best_sol_id = None
            best_score = -1.0
            for s in solutions:
                ev = evaluations.get(s.id)
                if ev:
                    sc = score_fn(ev)
                    if sc > best_score:
                        best_score = sc
                        best_sol_id = s.id

            if best_sol_id and best_sol_id in sol_map:
                category_winners.append(CategoryWinner(
                    category=cat_name,
                    winner_solution_id=best_sol_id,
                    winner_solution_name=sol_map[best_sol_id].name,
                    winning_score=best_score,
                    rationale=f"Achieved highest marks in {cat_name.lower()} with distinct strategic advantages."
                ))

        # Overall winner by score
        sorted_by_overall = sorted(
            solutions,
            key=lambda s: evaluations[s.id].weighted_score if s.id in evaluations else 0.0,
            reverse=True
        )

        overall_winner = sorted_by_overall[0].name if sorted_by_overall else "Solution 1"

        # Find easiest to build (highest technical feasibility)
        easiest = max(solutions, key=lambda s: evaluations[s.id].factor_scores.technical_feasibility if s.id in evaluations else 0)
        # Highest revenue potential
        highest_rev = max(solutions, key=lambda s: evaluations[s.id].factor_scores.revenue_potential if s.id in evaluations else 0)
        # Strongest differentiation (highest innovation)
        strongest_diff = max(solutions, key=lambda s: evaluations[s.id].factor_scores.innovation if s.id in evaluations else 0)

        # Call Gemini for qualitative trade-off summary
        sol_summary_text = "\n".join([
            f"- {s.name}: Score {evaluations[s.id].weighted_score if s.id in evaluations else 'N/A'}/100. UVP: {s.unique_value_proposition}. Model: {s.possible_revenue_model}"
            for s in solutions
        ])

        prompt = f"""
Compare these {len(solutions)} startup candidates:
{sol_summary_text}

Provide an executive comparison summary answering:
1. Trade-off breakdown between speed-to-market vs revenue ceiling.
2. Which solution is recommended for a small team or solo founder and why?
3. Which has the lowest execution risk?

Return JSON:
{{
  "easiest_to_build_notes": "{easiest.name} offers the fastest path to MVP with minimal third-party friction.",
  "highest_revenue_potential_notes": "{highest_rev.name} has the largest monetization surface area.",
  "strongest_differentiation_notes": "{strongest_diff.name} holds the most defensible unique feature set.",
  "lowest_execution_risk": "{easiest.name} requires the fewest regulatory and multi-sided platform dependencies.",
  "best_for_small_team_or_student": "Explanation of which solution is best for a student/small team",
  "trade_off_breakdown": "Nuanced trade-off explanation between these options",
  "summary": "Final 2-sentence verdict advising the team on how to choose"
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a venture capital investment committee director. Return valid JSON only.")

        return ComparisonReport(
            solution_ids=[s.id for s in solutions],
            category_winners=category_winners,
            easiest_to_build=data.get("easiest_to_build_notes", f"{easiest.name} provides the fastest path to an operational MVP with low backend complexity."),
            highest_revenue_potential=data.get("highest_revenue_potential_notes", f"{highest_rev.name} features the most scalable pricing architecture with enterprise upgrade potential."),
            strongest_differentiation=data.get("strongest_differentiation_notes", f"{strongest_diff.name} possesses the sharpest proprietary wedge that distinguishes it from incumbent suites."),
            lowest_execution_risk=data.get("lowest_execution_risk", f"{easiest.name} incurs the lowest operational overhead and lowest reliance on brittle third-party integrations."),
            best_for_small_team_or_student=data.get("best_for_small_team_or_student", f"{easiest.name} is the optimal choice for a resource-constrained team due to its tight scope and immediate customer feedback loop."),
            strongest_overall=f"{overall_winner} balances execution feasibility, market appetite, and business sustainability better than its peers.",
            trade_off_breakdown=data.get("trade_off_breakdown", "Building a conversational or browser-extension tool yields immediate user adoption but lower pricing power, whereas an all-in-one platform has higher enterprise value but substantially greater development and onboarding friction."),
            summary=data.get("summary", f"Choose {easiest.name} if you want to ship and validate within 2 weeks; choose {highest_rev.name} if you have 6+ months of runway to pursue venture-backed scale.")
        )

comparison_service = ComparisonService()
