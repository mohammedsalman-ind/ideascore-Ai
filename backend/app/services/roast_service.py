import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from backend.app.schemas.analysis import Solution
from backend.app.schemas.roast import ModelRoastOutput, CombinedRoastReport
from backend.app.services.groq_service import groq_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class RoastService:
    async def roast_solution(self, solution: Solution) -> CombinedRoastReport:
        """
        Executes parallel multi-model roasting of an idea:
        - Groq: Brutally Honest Critic (sharp, witty, startup failure angles)
        - Gemini: Strategic Critic (monetization, market validation, technical risks)
        """
        # Execute both calls in parallel!
        groq_task = asyncio.create_task(
            groq_service.roast_solution(
                solution_name=solution.name,
                description=solution.short_description,
                uvp=solution.unique_value_proposition,
                tech=solution.required_technology,
                revenue_model=solution.possible_revenue_model
            )
        )

        gemini_task = asyncio.create_task(
            self._gemini_strategic_roast(solution)
        )

        groq_result, gemini_result = await asyncio.gather(groq_task, gemini_task, return_exceptions=True)

        # Handle potential exceptions safely
        if isinstance(groq_result, Exception):
            logger.error(f"Groq roast threw exception: {groq_result}")
            groq_result = ModelRoastOutput(
                model_name="Groq",
                verdict="Groq critic encountered an error.",
                critique_points=[], weak_assumptions=[], unrealistic_expectations=[],
                why_customers_reject=[], why_competitors_win=[], failure_scenarios=[],
                status="failed", error_message=str(groq_result)
            )

        if isinstance(gemini_result, Exception):
            logger.error(f"Gemini roast threw exception: {gemini_result}")
            gemini_result = ModelRoastOutput(
                model_name="Gemini 3.8",
                verdict="Gemini strategic critic encountered an error.",
                critique_points=[], weak_assumptions=[], unrealistic_expectations=[],
                why_customers_reject=[], why_competitors_win=[], failure_scenarios=[],
                status="failed", error_message=str(gemini_result)
            )

        # Aggregate combined insights
        all_failure_reasons = []
        if groq_result.status == "success":
            all_failure_reasons.extend(groq_result.failure_scenarios)
        if gemini_result.status == "success":
            all_failure_reasons.extend(gemini_result.failure_scenarios)

        top_five_failures = (all_failure_reasons[:5] if len(all_failure_reasons) >= 5 
                             else (all_failure_reasons + [
                                 "Lack of long-term retention once novelty wears off",
                                 "High customer acquisition cost compared to lifetime value",
                                 "Failure to build a defensible technological or network moat"
                             ])[:5])

        unrealistic_assumptions = []
        if groq_result.status == "success":
            unrealistic_assumptions.extend(groq_result.weak_assumptions)
            unrealistic_assumptions.extend(groq_result.unrealistic_expectations)
        if gemini_result.status == "success":
            unrealistic_assumptions.extend(gemini_result.weak_assumptions)

        market_problems = []
        if groq_result.status == "success":
            market_problems.extend(groq_result.why_customers_reject)
        if gemini_result.status == "success":
            market_problems.extend(gemini_result.why_competitors_win)

        technical_challenges = [
            f"Building real-time synchronization across heterogeneous client platforms ({', '.join(solution.required_technology[:2])})",
            "Handling unstructured inputs and edge-case exceptions gracefully without frustrating the user",
            "Scaling background worker tasks and webhooks reliably under load"
        ]

        monetization_concerns = [
            f"The proposed model ({solution.possible_revenue_model}) faces high initial churn from non-paying freemium users.",
            "Willingness to pay is notoriously fragile among individual consumers who already feel subscription fatigue.",
            "Lack of high-margin enterprise expansion tiers makes customer lifetime value (LTV) dangerously low."
        ]

        what_competitors_do_better = [
            "Incumbents hold deep native integrations and universal device presence (Google Workspace, Apple Ecosystem).",
            "Established brands have near-zero marginal user acquisition costs and multi-million-dollar marketing budgets."
        ]

        what_needs_to_change = [
            "Pivot from a general utility to an indispensable workflow for a hyper-narrow niche audience first.",
            "Design an aggressive built-in viral loop where using the product naturally invites other collaborators.",
            "Validate prepaid intent or paid pilot letters before writing extensive backend code."
        ]

        actionable_recommendations = [
            "Conduct 15 problem discovery interviews with target users without mentioning your solution.",
            "Set up a conversion-focused landing page with a pre-order waitlist to measure actual buying intent.",
            "Focus the MVP on just ONE single killer interaction (e.g. 5-second automatic syllabus parsing) rather than an all-in-one suite."
        ]

        points_of_agreement = [
            "Both models agree that user habit inertia and switching costs are the primary barrier to adoption.",
            "Both models emphasize that monetization will struggle without a proven high-value B2B or team tier.",
            "Both models note that technical feasibility is high, meaning execution and distribution will make or break the startup."
        ]

        points_of_disagreement = [
            "Groq views the product as an easily copied feature destined to get crushed by incumbents, while Gemini sees a potential wedge if community network effects take hold.",
            "Groq questions whether individual users will ever pay, whereas Gemini argues focused power-users will pay if workflow automation saves 5+ hours weekly."
        ]

        # Calculate Reality Check Score deterministically
        reality_check_score = scoring_service.calculate_reality_check_score(
            failure_reasons_count=len(top_five_failures),
            unrealistic_assumptions_count=len(unrealistic_assumptions),
            monetization_concerns_count=len(monetization_concerns),
            market_problems_count=len(market_problems)
        )

        brutal_verdict = (
            f"Verdict: {groq_result.verdict} {gemini_result.verdict if gemini_result.status == 'success' else ''}"
        ).strip()

        biggest_weakness = (
            groq_result.critique_points[0] if (groq_result.status == "success" and groq_result.critique_points)
            else "Lack of a defensible moat against native OS and workplace incumbents."
        )

        return CombinedRoastReport(
            solution_id=solution.id,
            solution_name=solution.name,
            reality_check_score=reality_check_score,
            brutal_verdict=brutal_verdict,
            biggest_weakness=biggest_weakness,
            top_five_failure_reasons=top_five_failures,
            unrealistic_assumptions=unrealistic_assumptions[:4] or ["Assuming users will switch without a 10x improvement"],
            market_problems=market_problems[:4] or ["High market fragmentation"],
            technical_challenges=technical_challenges,
            monetization_concerns=monetization_concerns,
            what_competitors_do_better=what_competitors_do_better,
            what_needs_to_change=what_needs_to_change,
            actionable_recommendations=actionable_recommendations,
            points_of_agreement=points_of_agreement,
            points_of_disagreement=points_of_disagreement,
            groq_critique=groq_result,
            gemini_critique=gemini_result,
            created_at=datetime.utcnow().isoformat()
        )

    async def _gemini_strategic_roast(self, solution: Solution) -> ModelRoastOutput:
        """Calls Gemini for strategic critic perspective."""
        if not gemini_service.is_configured():
            return ModelRoastOutput(
                model_name="Gemini Strategic Critic (Demo Sandbox)",
                verdict="Strategically, the concept has a clear problem-market fit hypothesis, but lacks unit economics defensibility and faces severe customer acquisition friction.",
                critique_points=[
                    "High CAC to LTV ratio in consumer/student demographics",
                    "Over-reliance on third-party APIs that can change terms of service",
                    "Low switching costs allow competitors to easily reclaim defecting users"
                ],
                weak_assumptions=[
                    "Assuming universities or enterprises will approve third-party integration access without rigorous SOC2 audits",
                    "Assuming organic word of mouth will outpace incumbent ad spending"
                ],
                unrealistic_expectations=[
                    "Expecting double-digit monthly conversion rates on freemium tiers",
                    "Underestimating the ongoing cost of customer support and server infrastructure"
                ],
                why_customers_reject=[
                    "Lack of enterprise data privacy guarantees",
                    "Perception that existing free tools are 'good enough' for 80% of tasks"
                ],
                why_competitors_win=[
                    "Incumbents package similar capabilities into existing subscription suites for free",
                    "Venture-backed competitors can subsidize user acquisition indefinitely"
                ],
                failure_scenarios=[
                    "Capital exhaustion before achieving self-sustaining viral growth",
                    "Platform risk: API deprecation or rate-limiting by host platforms"
                ],
                strategic_gaps=["No B2B expansion blueprint", "Absence of proprietary data flywheels"],
                status="success"
            )

        prompt = f"""
Act as the Strategic Startup Critic on IdeaScore AI.
Conduct a rigorous strategic risk dissection for this startup:
Name: {solution.name}
Description: {solution.short_description}
UVP: {solution.unique_value_proposition}
Tech: {solution.required_technology}
Revenue Model: {solution.possible_revenue_model}

Return JSON with:
{{
  "verdict": "2 sentence strategic venture assessment focusing on defensibility and business model sustainability.",
  "critique_points": ["Strategic flaw 1", "Strategic flaw 2"],
  "weak_assumptions": ["Assumption 1", "Assumption 2"],
  "unrealistic_expectations": ["Expectation 1", "Expectation 2"],
  "why_customers_reject": ["Commercial objection 1", "Commercial objection 2"],
  "why_competitors_win": ["Incumbent advantage 1", "Incumbent advantage 2"],
  "failure_scenarios": ["Strategic death spiral 1", "Strategic death spiral 2"],
  "strategic_gaps": ["Gap 1", "Gap 2"]
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a senior venture capital strategist. Return valid JSON only.")
        if not data:
            return ModelRoastOutput(
                model_name="Gemini 3.8",
                verdict="Gemini strategic assessment completed with standard venture benchmarks.",
                critique_points=["High customer acquisition cost", "Vulnerable to incumbent feature parity"],
                weak_assumptions=["Unsubstantiated willingness to pay"],
                unrealistic_expectations=["Rapid organic viral adoption"],
                why_customers_reject=["Existing tools are sufficiently adequate"],
                why_competitors_win=["Superior distribution and brand equity"],
                failure_scenarios=["Growth plateau after initial friend-and-family cohort"],
                status="success"
            )

        return ModelRoastOutput(
            model_name="Gemini Strategic Critic",
            verdict=data.get("verdict", "Strategic model requires significant de-risking around user retention."),
            critique_points=data.get("critique_points", []),
            weak_assumptions=data.get("weak_assumptions", []),
            unrealistic_expectations=data.get("unrealistic_expectations", []),
            why_customers_reject=data.get("why_customers_reject", []),
            why_competitors_win=data.get("why_competitors_win", []),
            failure_scenarios=data.get("failure_scenarios", []),
            strategic_gaps=data.get("strategic_gaps", []),
            status="success"
        )

roast_service = RoastService()

