import json
import logging
import httpx
import re
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings
from backend.app.schemas.roast import ModelRoastOutput

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    def set_api_key(self, key: str):
        self.api_key = key.strip()

    def set_model(self, model: str):
        self.model = model.strip()

    async def roast_solution(self, solution_name: str, description: str, uvp: str, tech: List[str], revenue_model: str) -> ModelRoastOutput:
        """
        Executes the Brutally Honest Critic critique using Groq (Llama 3.3).
        Sharp, witty, direct, cutting through startup vanity metrics.
        """
        if not self.is_configured():
            logger.warning("Groq API key not configured. Generating high-fidelity simulation critique.")
            return self._generate_simulated_groq_roast(solution_name, description, uvp, revenue_model)

        prompt = f"""
You are the Brutally Honest Startup Critic on IdeaScore AI.
Your job is to deconstruct this startup idea with razor-sharp wit, brutal honesty, and actionable truth.
Do NOT be polite, but do NOT be meaningless or abusive. Be devastatingly accurate about what kills startups like this.

Startup Pitch:
- Name: {solution_name}
- Concept: {description}
- Value Proposition: {uvp}
- Tech Stack: {', '.join(tech)}
- Revenue Model: {revenue_model}

Return a JSON object with this exact structure:
{{
  "verdict": "1-2 punchy, witty, no-BS sentences summarizing the harsh reality of this idea.",
  "critique_points": [
    "Sharp critique point 1",
    "Sharp critique point 2",
    "Sharp critique point 3"
  ],
  "weak_assumptions": [
    "Flawed assumption 1",
    "Flawed assumption 2"
  ],
  "unrealistic_expectations": [
    "Delusional expectation 1",
    "Delusional expectation 2"
  ],
  "why_customers_reject": [
    "Reason customer won't switch or pay 1",
    "Reason customer won't switch or pay 2"
  ],
  "why_competitors_win": [
    "Why incumbents will crush or ignore this 1",
    "Why incumbents will crush or ignore this 2"
  ],
  "failure_scenarios": [
    "How this goes to zero in month 6",
    "How this drains the founder's bank account"
  ]
}}
"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a brutally honest Y Combinator mentor who despises vanity metrics and buzzwords. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(self.api_url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    return ModelRoastOutput(
                        model_name=f"Groq ({self.model})",
                        verdict=parsed.get("verdict", "Interesting idea with serious structural flaws."),
                        critique_points=parsed.get("critique_points", []),
                        weak_assumptions=parsed.get("weak_assumptions", []),
                        unrealistic_expectations=parsed.get("unrealistic_expectations", []),
                        why_customers_reject=parsed.get("why_customers_reject", []),
                        why_competitors_win=parsed.get("why_competitors_win", []),
                        failure_scenarios=parsed.get("failure_scenarios", []),
                        strategic_gaps=[],
                        status="success"
                    )
                else:
                    logger.error(f"Groq API error {res.status_code}: {res.text}")
                    return ModelRoastOutput(
                        model_name="Groq",
                        verdict="Groq critique temporarily unavailable.",
                        critique_points=[],
                        weak_assumptions=[],
                        unrealistic_expectations=[],
                        why_customers_reject=[],
                        why_competitors_win=[],
                        failure_scenarios=[],
                        status="failed",
                        error_message=f"HTTP {res.status_code}"
                    )
        except Exception as e:
            logger.error(f"Groq API call failed: {str(e)}")
            return ModelRoastOutput(
                model_name="Groq",
                verdict="Groq connection failed.",
                critique_points=[],
                weak_assumptions=[],
                unrealistic_expectations=[],
                why_customers_reject=[],
                why_competitors_win=[],
                failure_scenarios=[],
                status="failed",
                error_message=str(e)
            )

    def _generate_simulated_groq_roast(self, name: str, description: str, uvp: str, revenue_model: str) -> ModelRoastOutput:
        """High-impact realistic simulated roast when Groq API key is not yet set."""
        return ModelRoastOutput(
            model_name="Groq (Llama 3.3 Critic - Demo Sandbox)",
            verdict=f"You built a vitamin, not a painkiller. {name} sounds like a high-maintenance weekend project trying to disguise itself as a venture-scale business.",
            critique_points=[
                f"You are assuming users will build a new habit just to save 4 minutes, when history shows 90% abandon task-trackers within 14 days.",
                f"Your revenue model ({revenue_model}) assumes price elasticity that doesn't exist for individual consumers who already pirated Spotify and use free Google Docs.",
                "There is zero structural moat: The moment an incumbent like Notion or Apple Notes tweaks a widget, your entire UVP evaporates."
            ],
            weak_assumptions=[
                "Assuming users actually want another notification vector rather than fewer pings.",
                "Assuming group members will voluntarily log in and update their tasks without someone holding a gun to their head."
            ],
            unrealistic_expectations=[
                "Expecting organic viral growth without an insanely high viral coefficient or aggressive incentive mechanism.",
                "Expecting users to pay recurring SaaS fees for something a shared Google Sheet does for $0."
            ],
            why_customers_reject=[
                "Setup fatigue: 'I don't need another app to manage the 7 apps I already can't keep up with.'",
                "Friction: If even one person in a team refuses to install it, the whole group abandons it immediately."
            ],
            why_competitors_win=[
                "Microsoft and Google own the distribution channel (Teams, Classroom, Docs) and can clone your key feature as a free quarterly update.",
                "Slack and Discord already have active bot marketplaces with thousands of free open-source competitors."
            ],
            failure_scenarios=[
                "Month 3: 5,000 signups from a Reddit post, followed by a 94% 30-day churn rate and $400 in AWS bills.",
                "Founder spends 6 months perfecting the dashboard UI while nobody is willing to put their credit card down."
            ],
            status="success"
        )

groq_service = GroqService()

